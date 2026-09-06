// PURE — no fs, no next/*, no "use server". Bundles into the hardware
// esbuild bundle, the Next server, and client chunks (ScenePicker,
// PresetPreview). Keep it that way.

import { blankScene } from "./blank";
import { moonScene } from "./moon";
import { catScene } from "./cat";
import { digitalClockScene } from "./digital-clock";
import type { Scene } from "./types";
import { SceneId } from "./types";

export const scenes: Scene<any>[] = [
  blankScene,
  moonScene,
  catScene,
  digitalClockScene,
];

export const selectableScenes: Scene<any>[] = scenes.filter(
  (scene) => scene.id !== SceneId.Blank,
);
