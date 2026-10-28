# Scenes

## Padding

The panel is 32×32. Everything a scene draws stays inside a 4px padding box:
every lit pixel has `x` and `y` in `[4, 27]`, on every frame. Moon and Cat sit
at 5px, Setup at exactly 4.

Dropping to 3px on one edge is allowed only when the layout cannot fit
otherwise, and the commit message says why. Flip Clock does this on its left
and right edges to keep a readable gap between hours and minutes. Moon's stars
do it so they read as a field around the disc. Nothing goes below 3px.

Pin the padding with a test (see `flip-clock/index.test.ts`,
`moon/index.test.ts`). It regresses silently the next time the art is
retouched.

## Adding a scene

- Put it in `src/scenes/<name>/index.ts`, exporting `<name>Scene: Scene<State>`.
  Static pixel art goes in `<name>/sprite.ts` as a `Sprite`.
- Add the id to `SceneId` in `types.ts`, the scene to `scenes` in `catalog.ts`,
  and the id to `EXPECTED_IDS` in `catalog.test.ts`.
- Ids are persisted as `Preset.sceneId`. Never rename one once it ships.
- Scene files are pure: no `fs`, no `next/*`, no `"use server"`. They are
  bundled into the hardware build, the Next server, and client chunks.
- Add a GIF and a bullet to the README's Panel Scenes section.

## Animation

- 12 fps (`framesPerSecond: 12`), matching the other scenes.
- Motion is a pure function of `elapsed`: sines, cycles, and keyed fractions
  of a cycle. Don't call `Math.random()` per frame. A deterministic curve can
  be tested and renders the same in the app preview and on the panel.
  Real-world time (`Date.now()` for the moon phase, the clock) is fine.
- Pre-render the parts that don't change in `init` with `createCanvas`, then
  `drawImage` them in `draw`. Redraw per frame only what moves.
- Center with `Math.floor((dimensions.width - w) / 2)`. Nudge with a named
  offset (like Cat's `SPRITE_LIFT`) when the ink sits off-center in its box.

## Art on an LED panel

The panel is emissive on black, behind a diffuser. What looks right in a
browser can look wrong on the wall.

- Black means off. Never put a dark outline pixel against the background: dark
  brown or dark grey reads as a dim glow bleeding off the shape, not as an
  edge. Dark tones belong inside the silhouette, as depth.
- Adjacent tones need real brightness separation, at least ~15 luma. Two tones
  7 luma apart look identical on the panel.
- Prefer saturated tones. Pale, low-chroma highlights wash out to white.
- Glyph features need about 4px. At 3px wide, closed shapes fill in and
  details merge after the diffuser.
- Pull hues from scenes that already exist (Cat's `#ff8c1a` orange, Moon's
  golds, `boot-palette.ts`) so the catalog reads as one family.
- When part of the art is lit and part isn't, keep the unlit parts darker
  than the dimmest lit state, so the lit shape never disappears into its
  surroundings.

## Iterating

Generate candidates procedurally in a scratch harness outside the repo, render
frames through the scene's own `draw` with `skia-canvas`, and compare them.
Once a design is chosen, freeze it into `sprite.ts` as static data and delete
the harness. The scene keeps only the code that animates the art.
