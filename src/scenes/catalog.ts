// PURE — no fs, no next/*, no "use server". Bundles into the hardware
// esbuild bundle, the Next server, and client chunks (ScenePicker,
// PresetPreview). Keep it that way.

import { blankScene } from "./blank";
import { moonScene } from "./moon";
import { catScene } from "./cat";
import { flipClockScene } from "./flip-clock";
import { setupScene } from "./setup";
import type { Scene } from "./types";
import { SceneId } from "./types";

export const scenes: Scene<any>[] = [
  blankScene,
  moonScene,
  catScene,
  flipClockScene,
  setupScene,
];

const unlistedScenes: string[] = [SceneId.Blank, SceneId.Setup];

export const selectableScenes: Scene<any>[] = scenes.filter(
  (scene) => !unlistedScenes.includes(scene.id),
);
