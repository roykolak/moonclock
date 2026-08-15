// PURE — no fs, no next/*, no "use server". Bundles into the hardware
// esbuild bundle, the Next server, and client chunks (ScenePicker,
// PresetPreview). Keep it that way.

import type { Scene as RenderableScene } from "@/display-engine/types";

/** A curated scene: the engine's `Scene` (draw/init/framesPerSecond) plus
 *  the catalog metadata (a persisted id, a UI label). Every scene's
 *  animation is bespoke, so there's no menu of layer kinds to choose
 *  between — sprites, placement, and any motion all live inside `draw`
 *  (and optionally `init`), calling shared helpers like `drawSprite`
 *  directly. This is also literally what `createDisplayEngine.render()`
 *  takes — there's no separate compilation step from Scene to some other
 *  renderable representation. */
export interface Scene<S = unknown> extends RenderableScene<S> {
  id: string; // persisted in the DB as Preset.sceneId
  label: string; // UI label
}

export const SceneId = {
  Blank: "blank",
  Moon: "moon",
  Bunny: "bunny",
} as const;
export type SceneId = (typeof SceneId)[keyof typeof SceneId];
