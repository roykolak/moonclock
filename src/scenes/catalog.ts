// PURE — no fs, no next/*, no "use server". Bundles into the hardware
// esbuild bundle, the Next server, and client chunks (ScenePicker,
// PresetPreview). Keep it that way.

import { blankScene } from "./blank";
import { moonScene } from "./moon";
import { bunnyScene } from "./bunny";
import type { Scene } from "./types";

export const scenes: Scene<any>[] = [blankScene, moonScene, bunnyScene];
