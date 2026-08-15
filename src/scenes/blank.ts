import type { Scene } from "./types";
import { SceneId } from "./types";

export const blankScene: Scene = {
  id: SceneId.Blank,
  label: "Blank",
  draw({ ctx, dimensions }) {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);
  },
};
