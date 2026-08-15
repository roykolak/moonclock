import type { Scene } from "@/display-engine/types";
import { scenes } from "@/scenes/catalog";

/** Visible signal that a DB row names a scene this build doesn't have —
 *  better than a silent black panel. The realistic trigger isn't a
 *  malformed input, it's renaming or deleting a scene id in catalog.ts:
 *  presets already in database.json still point at the old id. */
const UNKNOWN_SCENE: Scene = {
  draw({ ctx }) {
    ctx.textBaseline = "top";
    ctx.font = "20px Arial";
    ctx.fillStyle = "#888";
    ctx.fillText("?", 11, 8);
  },
};

/** `null` means no id was given at all (nothing scheduled). An id that
 *  doesn't match any catalog entry returns UNKNOWN_SCENE, not null — those
 *  are different situations and callers shouldn't have to tell them apart
 *  themselves. */
export function getScene(id?: string | null): Scene | null {
  if (!id) return null;
  return scenes.find((s) => s.id === id) ?? UNKNOWN_SCENE;
}
