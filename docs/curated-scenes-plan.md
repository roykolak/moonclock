# Curated scenes: shrinking presets, dialing in the art

Status: **planned, not started.** Target release: next minor.

## Context

### The problem

A preset today is a **multi-layer compositor**: `Preset.scenes` is an array, the UI
(`src/components/Scenes.tsx`, 427 lines) lets you add, delete, drag-reorder layers, and
~30 controls configure them per scene type.

In practice only two scenes ever get used: **moon** and **bunny**. Both are single static
sprite maps. The compositor is carrying almost no weight, and it isn't even working
correctly — see "Bugs this fixes" below.

Meanwhile the thing that would actually improve the panel — sprites smaller than 32x32,
deliberately centered, with hand-tuned animation and color — is **impossible today**,
because the display engine has no geometry primitive at all. No origin, no offset, no
scale, no `ctx.translate` anywhere in the repo. `custom_scenes/bunny.json` hand-bakes its
margins into 471 absolute coordinate keys; you cannot nudge it two pixels without
rewriting the file.

### The goal

Trade breadth for depth. Fewer knobs, better art.

- **Less customization**: no layer editor, no per-scene config sliders. Pick a scene.
- **More curation**: each scene is hand-tuned in code — placement, animation, palette.
- **Bespoke placement**: author sprites in their own box, place them at render time,
  centered, optionally scaled up for chunky cuteness.

### Decisions already made

1. **`Preset` holds one scene, not an array.** Collapse to a flat `sceneId: string`.
2. **DB schema breaks are acceptable.** Single-user device; no migration code, no legacy
   mirror fields, no deprecation schedule. Migration is `rm database.json` and reseed.
3. **Composer is demoted to an authoring tool**, not removed. It's how sprites get drawn;
   `custom_scenes/` stops being a render source.
4. **Both placement mechanisms**: a declarative anchor/offset/scale primitive _and_ a
   code-defined path with raw canvas access for per-frame drawing.
5. **Scope of this pass**: the architecture plus porting moon and bunny as proof. No new
   scenes yet.
6. **Vocabulary**: a **scene** is what you pick. A scene has **layers**. Layers live in
   code, not in the DB and not in the UI.

## Architecture

### Scene catalog

New module tree at `src/scenes/`. It must stay **pure and dependency-free** — no `fs`, no
`"use server"`, no `next/*` imports — because it bundles three ways: into the esbuild
hardware bundle (`build.js` entry `hardware/index.ts`), into the Next server, and into a
client chunk (`PresetPreview`, `ScenePicker`). This constraint is load-bearing; `npm run
build` is the gate that catches violations.

```
src/scenes/
  types.ts             Scene, SceneLayer, Sprite, Placement, Recolor, SceneId
  catalog.ts           the curated scenes
  buildSceneMacros.ts  Scene -> Macro[]   (1 layer == 1 macro == 1 z-slot)
  buildPresetMacros.ts Preset -> Macro[]  (replaces the server action)
  sprite-utils.ts      measure / normalizeSprite / applyRecolor
  sprites/
    index.ts           id -> Sprite registry
    moon.ts            29x29, origin-normalized
    bunny.ts           24x29
```

```ts
/** A sprite authored in its OWN box: keys are "x:y" relative to the sprite's
 *  top-left, so minX === minY === 0. */
export interface Sprite {
  width: number;
  height: number;
  pixels: Record<string, string>; // "x:y" -> "#rrggbb" | "#rrggbbaa"
}

export type Anchor =
  | "top-left"
  | "top"
  | "top-right"
  | "left"
  | "center"
  | "right"
  | "bottom-left"
  | "bottom"
  | "bottom-right";

export interface Placement {
  anchor?: Anchor; // scene compiler defaults to "center"
  offsetX?: number; // whole pixels, applied AFTER anchoring
  offsetY?: number;
  scale?: 1 | 2 | 3 | 4; // integer nearest-neighbour only
}

export interface Recolor {
  swap?: Record<string, string>; // source hex (lowercased) -> replacement
  opacity?: number; // 0..1, multiplied into alpha at build time
}

export type SceneLayer =
  /** sparse pixel art; compiles to MacroName.Coordinates */
  | { kind: "sprite"; sprite: Sprite; placement?: Placement; recolor?: Recolor }
  /** any existing macro, verbatim — the authoring escape hatch */
  | { kind: "macro"; macro: Macro }
  /** code-defined per-frame canvas drawing; compiles to MacroName.Custom */
  | {
      kind: "painter";
      drawId: PainterId;
      params?: Record<string, string | number | boolean>;
      framesPerSecond?: number;
    };

export interface Scene {
  id: string; // persisted in the DB as Preset.sceneId
  label: string; // UI label
  hidden?: boolean; // excluded from the picker (e.g. the hardware mirror)
  /** BOTTOM-FIRST. Index in this array === z-slot in the compositor. */
  layers: SceneLayer[];
}
```

`SceneId` stays a string union rather than a TS enum, so DB values and catalog ids are the
same lexical thing:

```ts
export const SceneId = {
  Blank: "blank",
  Moon: "moon",
  Bunny: "bunny",
} as const;
export type SceneId = (typeof SceneId)[keyof typeof SceneId];
```

### The z-order invariant

`src/display-engine/index.ts:126-156` keys `pixelStack[index]` off the **macro array
index**, so macro order is z-order, bottom-first. The compiler is deliberately 1:1:

```ts
export function buildSceneMacros(scene: Scene): Macro[] {
  return scene.layers.map((layer) => {
    /* one macro per layer, order preserved */
  });
}
```

**Invariant: `layers.length === macros.length`, index-for-index.** This holds only if no
macro writes to an index other than its own — which is exactly what
`src/display-engine/macros/moon.ts:128` violates today. Enforce it with a catalog test.

### Preset shape

```ts
export interface Preset {
  id?: string;
  name: string;
  mode: "for" | "until";
  untilDay: string;
  untilHour: string;
  untilMinute: string;
  forTime: string;
  timeAdjustmentAmount?: string;
  brightness?: number | null;
  pinned?: boolean;

  sceneId: string; // was: scenes: Scene[]
}
```

The scheduling half (`mode` / `until*` / `forTime` / `pinned` / `brightness` /
`timeAdjustmentAmount`) is **the actual product** and stays untouched. Only the
"what to show" half changes.

Deleted from `src/types.ts`: the `Scene` interface (a DB row type; the name is reused for
the catalog entry in `src/scenes/types.ts`), `SceneName`, and `PresetField.Scenes`.

Three embedded `Preset` locations all inherit the change: `Panel.defaultPreset`,
`ScheduledPreset.preset`, `presets[]`.

### The live hardware mirror

`src/components/HardwareSettings.tsx:59-64` currently synthesizes a throwaway `Preset`
carrying `sceneConfig: { coordinates: virtualPanel }` purely to reuse `PresetPreview`.
That is the only reason a per-preset config bag exists.

Fix it properly: give `PresetPreview` a second entry point that accepts coordinates
directly and bypasses presets entirely. That's what lets `Preset` be a flat `sceneId:
string` with no nested object.

### Placement primitive

Extend `MacroCoordinatesConfig`:

```ts
export interface MacroCoordinatesConfig {
  coordinates: { [key: string]: string };
  /** Natural sprite box. Defaults to the measured bbox of `coordinates`. */
  spriteWidth?: number;
  spriteHeight?: number;
  anchor?: Anchor; // DEFAULT "top-left" — byte-identical to today
  offsetX?: number;
  offsetY?: number;
  scale?: number; // integer, >= 1, default 1
}
```

Defaults (`top-left` / `0` / `1`) make an un-annotated call **byte-for-byte identical to
the current 36-line implementation**. This matters: `coordinates` is still called raw by
`hardware/index.ts` boot pixels and the virtual-panel mirror. The _scene compiler_ is what
defaults `anchor` to `"center"`.

Anchor semantics — `anchorOrigin(anchor, panelSize, spriteSizeScaled)`:

| Axis       | Rule                                                                                                     |
| ---------- | -------------------------------------------------------------------------------------------------------- |
| horizontal | `*-left` -> `0`; `center`/`top`/`bottom` -> `floor((panel - sprite) / 2)`; `*-right` -> `panel - sprite` |
| vertical   | `top-*` -> `0`; `left`/`center`/`right` -> floored centre; `bottom-*` -> `panel - sprite`                |

Odd-size sprites bias up/left. The bbox subtraction applies **only when
`spriteWidth`/`spriteHeight` are omitted**, so callers passing explicit dims (the 32x32
hardware mirror) skip re-anchoring.

**Clipping is already safe.** `src/display-engine/index.ts:136-138` reads
`pixelMap?.[y]?.[x]` and returns early on a missing stack, so off-panel pixels are dropped
without throwing. Offsetting cannot crash.

**Scale is in scope** — integer nearest-neighbour, a nested loop, no canvas. It's what
unlocks "author a 16x16 sprite, show it at 2x, centered." Non-integer scale, aspect-fit,
and `drawImage` resampling stay deferred; `src/display-engine/macros/image.ts` is deleted
rather than fixed (it's a `console.log` stub with no producer).

### Sprite normalization

`measure()` computes a bbox; `normalizeSprite()` rebases keys so `minX === minY === 0`.

Normalization is a **one-time dev script whose output is committed** —
`bin/normalize-sprite.ts`, run via `tsx`. Not a build step, not a runtime transform. The
numbers are the art: they should be diffable in git, and the whole premise is that they get
hand-tuned afterward. A runtime normalizer would re-derive the bbox every render and make
hand-tuning impossible to express.

Measured outputs:

| Sprite | Source                                       | Absolute extent | Normalized |
| ------ | -------------------------------------------- | --------------- | ---------- |
| moon   | `src/display-engine/scenes/moon.ts` (167 px) | x2-30, y1-29    | 29x29      |
| bunny  | `custom_scenes/bunny.json` (471 px)          | x4-27, y1-29    | 24x29      |

**Free correctness signal:** moon at 29 wide centers to origin 1, and `offsetX: 1` puts it
at 2 — exactly its current `minX`. Bunny at 24 wide centers to origin 4 — exactly _its_
current `minX`, with no offset needed. So both ports are pixel-identical to today by
construction. Turn that into the regression test that proves the port is visually lossless.

### Painters (the code-defined path)

`customFunc` can't survive the JSON store _or_ the RSC boundary, so the indirection must be
name-based and resolved inside the display engine on whichever side is rendering.

```ts
export interface MacroCustomConfig {
  drawId: string;
  params?: Record<string, string | number | boolean>;
  /** 0 (default) == one static frame, matching today's behaviour. */
  framesPerSecond?: number;
}

export interface Painter<S = unknown> {
  /** Optional async setup — e.g. build a scratch sprite canvas ONCE. */
  init?: (args: {
    dimensions: Dimensions;
    params: Params;
    createCanvas: CreateCanvas;
  }) => Promise<S>;
  draw: (args: {
    ctx: CanvasRenderingContext2D;
    dimensions: Dimensions;
    elapsed: number;
    params: Params;
    state: S;
  }) => void;
  framesPerSecond?: number;
}
```

Registry at `src/display-engine/painters/index.ts`. `fps: 0` reproduces today's
single-static-frame semantics exactly, so the path is purely additive. Unknown `drawId`
renders the grey `?` rather than throwing.

**Both environments.** Hardware is `skia-canvas` (`canvas.gpu = false`, Tiny5 + Silkscreen
via `FontLibrary.use`, `hardware/index.ts:44-55`); the browser preview is a DOM canvas with
**only Tiny5** registered (`PresetPreview.tsx:11-27`). Painters are restricted to the API
intersection — document this on the `Painter` type:

- **Allowed**: `save`/`restore`, `translate`/`scale`/`rotate`, `clearRect`/`fillRect`/
  `strokeRect`, `fillStyle`/`strokeStyle`/`globalAlpha`/`globalCompositeOperation`, path
  ops, gradients, `clip`, `getImageData`/`putImageData`, and `drawImage` of a canvas
  obtained from the injected `createCanvas`.
- **Forbidden**: any font but Tiny5 (Silkscreen renders differently in-browser — a
  pre-existing divergence, don't add to it); `roundRect`, `filter`, `OffscreenCanvas`,
  `ImageBitmap`; loading images by URL or path (skia's `loadImage` and DOM `Image` diverge,
  which is why `init` gets `createCanvas` and not a loader); anything touching `document`
  or `window`.

**Cost warning.** Every painter frame pushes 1024 pixels through `syncFromCanvas` (no
dirty-rect) into `updateQueue`, and `hardware/index.ts:288-295` **dumps the entire queue
past depth 50** while `:281-286` logs lag past 10. Cap painters around 8-12 fps and prefer
`kind: "sprite"` for sparse art. Dirty-rect support in `syncFromCanvas` is the real fix and
is deferred.

## Bugs this fixes

Each of these is fixed **by construction**, not by intention:

| Bug                                                                                                                                                     | Location                                                          | Resolution                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Moon's star twinkle emits at `index + 1`, squatting on the next macro's z-slot; moon silently occupies two layers                                       | `src/display-engine/macros/moon.ts:128`                           | Extract to `macros/star-twinkle.ts` emitting on plain `index`; moon becomes two honest layers                                                                 |
| `animation.ts` has a **module-level shared `lastTime`**, so concurrent animated macros clobber each other's pacing and `framesPerSecond` is not honored | `src/display-engine/animation.ts:1`                               | Replace `getAnimationFrame` with `createAnimationLoop` holding per-loop state; migrate all 5 call sites (ripple, twinkle, marquee, loading-bar, star-twinkle) |
| Default `sceneConfig` seeded only for `scenes.0`; layers 1..n silently get `{}`                                                                         | `src/components/PresetForm.tsx:65-118`                            | Deleted — curated scenes carry their own tuning                                                                                                               |
| `message` exposes a `fontSize` slider that does nothing (the transform hardcodes `fontSize: 8`)                                                         | `Scenes.tsx:390-398` vs `transformPresetToDisplayMacros.ts:49-58` | Deleted                                                                                                                                                       |
| `readDb` overwrites the DB with defaults on any parse failure, silently destroying hand-tuned `Panel` fields                                            | `src/server/db.ts:222-226`                                        | Copy to `.corrupt-<timestamp>` before seeding; empty/missing still seeds silently (`install.sh` touches an empty file on first boot)                          |
| `preset?.scenes?.[0].sceneName` throws on an empty array (optional chain stops at `scenes`)                                                             | `hardware/checkForNewDisplayConfig.ts:11`                         | Becomes `preset.sceneId`                                                                                                                                      |
| Log interpolates the `SceneName` enum object instead of a name                                                                                          | `src/server/actions/customScenes.ts:24`                           | Block deleted                                                                                                                                                 |
| `e2e/presets.spec.ts:112` names its variable `bunnyPreset` but `nth(3)` is _Twinkle_; reshaping seed presets breaks it silently                         | `e2e/presets.spec.ts:112`                                         | Select by name, not index                                                                                                                                     |
| Reset loop hardcodes `32` instead of using `dimensions`                                                                                                 | `src/display-engine/index.ts:113-121`                             | One-line fix while in the file                                                                                                                                |

`readDb`'s catch is worth calling out specifically. The presets it destroys are cheap —
they're seeded from `defaultData`. The **`Panel` fields are not**: `pwnLsbNanoseconds`,
`gpioSlowdown`, `pwmBits`, `hardwareMapping`, `brightness`, `anthropicApiKey` are tuned
against real hardware and annoying to recover.

## UI reduction

### Delete

- **`src/components/Scenes.tsx`** — all 427 lines: dnd-kit wiring, per-row select, delete
  button, and `SceneConfigControls` (`:184-427`, ~30 controls across
  emoji/moon/twinkle/color/ripple/marquee/message).
- **`src/components/ColorPicker.tsx`** — sole consumer was `Scenes.tsx`.
- **`@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`** from `package.json` —
  verified sole consumer. (`emoji-mart` is also already dead with no importer.)
- **"Add new scene" button** — `PresetForm.tsx:171-182`.
- **`PresetForm`'s `form.watch("scenes.0.sceneName")` seeding block** — `:65-118`.
- **`Panel.tsx`'s "Custom…" flow** — `:207-216`. The "Edit Preset" menu item stays;
  editing an active preset's name and expiration is still useful.
- **`src/server/actions/transformPresetToDisplayMacros.ts`** — replaced by the pure
  `src/scenes/buildPresetMacros.ts`.
- **`src/display-engine/macros/moon.ts`** (star code moves), **`macros/emoji.ts`** (no
  scene uses it), **`macros/image.ts`** (stub), **`scenes/nothing.ts`** (dead — its
  `rgba(...)` strings don't even match `colorToRgba`'s regex).
- Keep `src/display-engine/emojis/*.ts` as future sprite material.

### Keep

`Editor.tsx`, `TouchDisplay.tsx`, `generatePixelArt.ts`, `/composer`, `PresetsList.tsx`,
`PresetItem.tsx` + pin toggle, `PresetForm`'s name / expiration / brightness-override /
time-adjustment, `HardwareSettings`, `Panel`'s pinned buttons and +/- time controls.

### Add: `src/components/ScenePicker.tsx`

A **grid of thumbnail cards**, not a `Select` — with a curated set, showing the art is the
point, and it reads as "pick a scene" rather than "configure a layer." It imports the
catalog directly (pure module, no server action, no prop plumbing), which is why
`customSceneNames` disappears from `PresetsList`, `PresetForm`, `Panel`, `Settings`, and
all three `page.tsx` files.

**Perf risk to handle:** `PresetPreview` spins up a full `createDisplayEngine` with live
animation loops per instance. A picker multiplies that by the catalog size, on top of the
big preview and one per presets-page row. Add a `staticFrame?: boolean` prop that calls
`engine.stop()` after the first `onPixelsChange` batch and use it for thumbnails.
Without it the modal runs 2N+1 concurrent loops each converting 1024 pixels.

**Preserve the alt-text contract.** Change the expression, keep the string shape:

```tsx
alt={`${preset.sceneId ?? "blank"} scene`}
```

That yields exactly what it does today (`"moon scene"`, `"bunny scene"`), so
`e2e/presets.spec.ts:44,73` and `e2e/settings.spec.ts:41` pass unmodified. Renaming to
`"moon look"` would cost e2e churn for zero user value.

Also worth taking: because `buildPresetMacros` is pure, `PresetPreview` no longer needs a
**server-action RPC per preview** (`PresetPreview.tsx:48` today fires one per presets-page
row). Import it directly on both the client and in `hardware/index.ts`.

## Composer demotion

1. **`custom_scenes/` leaves the render path.** `buildPresetMacros` has no
   `getCustomScenes()` fallback. A DB row naming a custom scene renders the grey `?` —
   deliberately visible rather than a black panel.
2. **The Composer keeps `custom_scenes/` as its own scratch storage.**
   `src/server/queries.ts` and `updateCustomSceneData` stay. Only the render coupling is
   cut: delete `customScenes.ts:19-27` (the reload-if-active check) — a draft can no longer
   be on screen, so there's nothing to reload.
3. **Promotion path.** Add `exportSpriteModule(name, coordinates)` that runs
   `normalizeSprite` and returns TS module source, plus an "Export as sprite" button in
   `Editor.tsx` showing it in a copyable read-only `Textarea`
   (`data-testid="copy-sprite-module"`) with the instruction: _paste into
   `src/scenes/sprites/<name>.ts` and add a `Scene` to `src/scenes/catalog.ts`_.
   Deliberately manual — curated scenes are code, reviewed and committed. That's the
   property being bought.
4. Add a short `Alert` at the top of `/composer`: _"Drafts. Export a sprite to ship one as
   a scene."_
5. `custom_scenes/bunny.json` stays in the repo and in `install.sh`'s seeding step — the
   Composer still lists it as an editable draft, and `install.sh:94` globs the directory
   unconditionally (an emptied dir makes `cp` error noisily). The **render** source for
   bunny is now `src/scenes/sprites/bunny.ts`.

## Porting moon and bunny

**Moon** — two layers, replacing one macro that secretly used two z-slots:

| Layer      | Kind     | Detail                                                                                                                                                                                                   |
| ---------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0 (bottom) | `sprite` | `moonSprite` 29x29, `anchor: "center"`, `offsetX: 1` -> origin (2,1), pixel-identical to today                                                                                                           |
| 1 (top)    | `macro`  | `starTwinkle({ stars: [{x:5,y:6},{x:15,y:9},{x:30,y:22},{x:12,y:29}], color: "#ffffff", glowColor: "#0f0ade", framesPerSecond: 12 })` — the code from `macros/moon.ts:60-133`, emitting on plain `index` |

The `animateStarTwinkle` boolean disappears; a curated moon always twinkles. A still moon
would be a second catalog entry — which is the whole shape of the new system.

Star twinkle stays a **pixel macro, not a painter**: it emits ~20 pixels per frame, and
routing it through `syncFromCanvas` would cost 1024. Sparse effects stay pixel-emitting.

**Bunny** — one painter layer, proving the code-defined path:

```ts
{ kind: "painter", drawId: "spriteBob", framesPerSecond: 8,
  params: { spriteId: "bunny", amplitude: 1, periodMs: 3200, anchor: "center" } }
```

Bunny's centered origin equals its baked `minX`, so the resting frame is pixel-identical
and the bob is pure addition. **Document the fallback in the catalog as a comment**: if
1024px x 8fps hurts queue depth on real hardware, swap to
`{ kind: "sprite", sprite: bunnySprite, placement: { anchor: "center" } }`. That's the
likeliest tuning decision on the device.

### Newly possible

- Re-center a sprite by editing an offset instead of rewriting 471 keys.
- Integer 2x-4x scale — a 16x16 sprite at 2x, centered, for chunky cuteness.
- Per-scene palette `swap` / `opacity` at build time without touching sprite data
  (a warmer moon at dusk as a separate entry).
- Explicit z-stacking with guaranteed non-colliding slots now that `index + 1` is gone.
- Per-scene `framesPerSecond` that is actually honored.
- Motion with real feel (bob, pulse, drift) via painters — previously impossible, since
  `custom` was unreachable and drew exactly one frame.

## `defaultData` reshape

Only two scenes exist, so the eight demo presets referencing
ripple/marquee/emoji/color/message/twinkle would all render `?`. Reduce
`defaultData.presets` to:

1. **Moon** — `sceneId: "moon"`, `mode: "until"`, `untilDay: "1"`, `untilHour: "7"`,
   `untilMinute: "00"`, `pinned: true`. **Keep these exact values** —
   `e2e/panel.spec.ts:24` asserts `7:00 AM`, and both `panel.spec.ts` and
   `settings.spec.ts` click a `"Moon"` button.
2. **Bunny** — `sceneId: "bunny"`, `mode: "for"`, `forTime: "2:00"`, `pinned: true`.

`panel.defaultPreset` -> `sceneId: "blank"`.

## Implementation order

Start with placement — it's the part visible on the panel.

**Phase 1 — placement primitive**

1. `src/scenes/sprite-utils.ts` (`measure`, `normalizeSprite`, `applyRecolor`); `Anchor`
   in `src/display-engine/types.ts`; `MacroCoordinatesConfig` additions.
2. Rewrite `macros/coordinates.ts` with anchor/offset/scale, defaulting to today's exact
   behaviour. Fix the hardcoded `32` at `index.ts:113-121`.
3. `bin/normalize-sprite.ts`; run against `display-engine/scenes/moon.ts` and
   `custom_scenes/bunny.json`; commit `src/scenes/sprites/{moon,bunny,index}.ts`.

**Phase 2 — animation + painters** 4. `animation.ts` -> `createAnimationLoop`; migrate ripple / twinkle / marquee /
loading-bar; delete `getAnimationFrame`/`stopAnimationFrame`. Give the never-imported
`AnimationConfig` (`display-engine/types.ts:151-153`) a real use as the loop options
type, or delete it. 5. `src/display-engine/painters/{index,spriteBob}.ts`; rewrite `macros/custom.ts` for
`drawId` + loop + unknown-id fallback. 6. `macros/star-twinkle.ts` from `macros/moon.ts` (plain `index`); register
`MacroName.StarTwinkle`; delete `macros/moon.ts`, `MacroName.Moon`, `MacroMoonConfig`,
and the `moon` factory in `marcoConfigs.ts`.

**Phase 3 — catalog** 7. `src/scenes/{types,catalog,buildSceneMacros,buildPresetMacros}.ts`. 8. Delete `transformPresetToDisplayMacros.ts`; repoint `hardware/index.ts` and
`PresetPreview.tsx` at `buildPresetMacros`. 9. Delete `macros/emoji.ts`, `macros/image.ts`, `scenes/nothing.ts`.

**Phase 4 — schema + non-UI call sites** 10. `src/types.ts`: `Preset.sceneId`; delete `Scene`, `SceneName`, `PresetField.Scenes`. 11. `src/server/db.ts`: reshape `defaultData`; fix `readDb`'s destructive catch. 12. `hardware/checkForNewDisplayConfig.ts:7,11` -> compare `sceneId`. 13. `src/server/actions/customScenes.ts`: drop the reload block; add `exportSpriteModule`.

**Phase 5 — UI** 14. `ScenePicker.tsx`; `PresetPreview` `staticFrame` prop + coordinates entry point + alt
text; `PresetForm` (delete watch block and "Add new scene", render the picker). 15. Delete `Scenes.tsx` and `ColorPicker.tsx`; drop the three dnd-kit deps. 16. `Settings.tsx` single default-scene `Select` (keep `data-testid="default-scene-select"`);
`Panel.tsx` drop "Custom…"; `HardwareSettings.tsx` use the new preview entry point;
strip `customSceneNames` everywhere.

**Phase 6 — Composer demotion** 17. `Editor.tsx`: draft `Alert`, "Export as sprite" button, copyable textarea.

## Tests

### Add

- **`src/scenes/sprite-utils.test.ts`** — the highest-value new file. `measure` on empty /
  garbage keys / falsy values; `normalizeSprite` round-trip; and the **regression that
  proves the port is lossless**: `normalizeSprite(legacy absolute moon)` re-placed at
  `anchor: "center", offsetX: 1` reproduces the original 167 absolute keys exactly, and the
  same for bunny at `anchor: "center"` with no offset.
- **`src/display-engine/macros/coordinates.test.ts`** — default `{"1:1":"#ffffff"}`
  back-compat; `anchor: "center"` of a 4x4 in 32x32 -> origin 14; each anchor corner;
  offsets; `scale: 2` -> 4 output pixels per source pixel at correct positions; an
  off-panel sprite emits pixels the compositor drops **without throwing**.
- **`src/display-engine/macros/custom.test.ts`** — unknown `drawId` emits `?` without
  throwing; `init` runs once and `draw` per frame; `stop()` halts the loop.
- **`src/scenes/catalog.test.ts`** — every scene builds; `layers.length === macros.length`
  (the z-order invariant); no macro config is `undefined`; ids unique and snapshotted
  against a literal list, so renaming an id (which orphans DB rows) fails loudly; every
  painter's `drawId` exists in the registry; every sprite fits 32x32 after placement unless
  the layer opts into clipping.

### Update

- `transformPresetToDisplayMacros.test.ts` -> `src/scenes/buildPresetMacros.test.ts`. Drop
  the emoji / marquee / twinkle / bunny-via-custom-scene cases. Keep and rewrite: moon ->
  **2 macros** `[coordinates, starTwinkle]` with expected anchor/offset/spriteWidth; blank
  -> `box({backgroundColor:"#000000"})`; unknown id -> `text({text:"?"})`.
- `hardware/checkForNewDisplayConfig.test.ts` — fixtures use `sceneId`; assertions read
  `preset.sceneId`.
- `src/helpers/getEndDate.test.ts`, `getFriendlyEndTime.test.ts` — `scenes: []` becomes
  `sceneId: "blank"`.

### Delete

- `e2e/presets.spec.ts:85` (multi-scene preset) and `:128` (drag-reorder) — both test
  removed capabilities.
- `e2e/panel.spec.ts:56` (the "Custom…" flow).

### Rewrite

- `e2e/presets.spec.ts:12` — drop `new-scene-button`; replace `scene-0-select` +
  `getByRole("option", {name:"bunny"})` with `getByTestId("scene-option-bunny").click()`.
  The alt-text assertions survive. The new-preset default scene must be `moon` for `:44`
  to hold.
- `e2e/presets.spec.ts:112` — select by name (`filter({ hasText: "Bunny" })`), not
  `nth(3)`; assert the `"Bunny"` button on Panel.
- `e2e/settings.spec.ts:12` — structurally unchanged; `default-scene-select` and the
  `"bunny scene"` alt text are preserved.

### Leave alone

`e2e/custom-scenes.spec.ts` — both Composer tests should pass untouched, which is itself
the proof the Composer still works as an authoring tool.

**New testids:** `scene-picker`, `scene-option-blank`, `scene-option-moon`,
`scene-option-bunny`, `copy-sprite-module`.

## Verification

**Unit / e2e.** `npm run test` (`APP_ENV=test tsx --test`, uses `./database-test.json`) and
`npm run test:e2e` (webkit, 1 worker, boots `npm run app:test`).

**Build.** `npm run build` must pass — `next build` then `node build.js`, which
esbuild-bundles `hardware/index.ts`. This is the gate for the biggest structural hazard:
anything under `src/scenes/` accidentally importing `fs`, `next/*`, or a `"use server"`
module breaks the hardware bundle or silently pulls in the Next runtime. Also watch for a
`src/scenes` <-> `src/display-engine/painters` import cycle — put the sprite registry in
`src/scenes/sprites/index.ts` and have the painter import from there, not the reverse.

**Emulator** (`npm run start:dev`). No pixels, but something better: `hardware/index.ts:103-113`
serves `virtualPanel` (`"x:y" -> "#rrggbb"`) at `GET http://localhost:3001/api/state`.
That map is ground truth for what the _hardware_ renderer produced.

1. Activate Moon from `/panel`, then diff the non-black keys of `virtualPanel` against the
   expected placed sprite keys. Repeat for Bunny. **This is the single most valuable check
   in the pass** — it proves placement parity between the pure-TS path and the real render
   loop, and catches the anchor off-by-one that `floor()` centering makes easy.
2. Cross-check the browser: `/hardware` renders `virtualPanel` through the preview. If the
   two disagree, there's a skia-vs-DOM divergence — most likely a painter using an API
   outside the allowed intersection, or a font.
3. Watch frame health on `/hardware`: the `queuedFramesSnapshots` chart with its reference
   line at 50, and the `isFrameRateLagging` alert on `/panel`. If the chart trends toward
   50, drop the painter's fps or fall back to the static bunny sprite. The "Add frame delay
   (ms)" slider (`syncSpeed`) is the live knob.
4. `POST /api/button-press` — exercises pinned-preset cycling with two pinned presets,
   including the preview screens and the clear step (`hardware/index.ts:330-362`).

**Real hardware.** Deploy, then `mc logs` for `[HARDWARE] Update queue lagging`. Run the
same `virtualPanel` diff against the device's `:3001/api/state`. If pixels look wrong in a
way that isn't placement — color, ghosting, brightness — isolate the matrix from the scenes
rather than debugging both at once:

```
cd /usr/local/bin/moonclock/current/dist/hardware
sudo node test-matrix.cjs --panel='<the panel object from GET /api/db>'
```

**Migration.** `rm /var/lib/moonclock/database.json` and let it reseed. Capture the `panel`
object from `GET /api/db` first if the tuning values matter — see the `readDb` fix above.

## Risks

1. **Painter frames cost 1024 pixels each.** `syncFromCanvas` has no dirty-rect and the
   queue dumps past depth 50. The bunny bob is the first thing to sacrifice; dirty-rect
   support is the real fix and is deferred.
2. **skia-canvas vs DOM canvas divergence** is now a first-class correctness surface, since
   a painter is code rather than data. The API allow-list and the
   `virtualPanel`-vs-browser diff are the only defences. Fonts are the known trap.
3. **Scene ids are a persisted contract.** Renaming one orphans DB rows. The catalog test
   snapshots the id list to make that loud.
4. **Thumbnail engine multiplication** in the picker — mitigated by `staticFrame`, but if
   the catalog grows past ~6 scenes, a pre-rendered PNG per scene becomes the better answer.
5. **Multi-scene presets are lost**, by design. Accepted: single-user device, presets are
   seeded and cheap.
6. **`src/scenes/` purity is enforced only by the build.** A stray `fs` import fails late
   and confusingly. Worth a comment at the top of every file in the tree.
