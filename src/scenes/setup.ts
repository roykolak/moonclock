import type { Scene } from "./types";
import { SceneId } from "./types";

const PADDING = 4;
const CENTER = 16;
const CIRCLE_RADIUS = 5;
const OUTER_CIRCLE_RADIUS = 7;
const CROSS_REACH = 8;

const DOT_COLOR = "#FFFFFF";
const CIRCLE_COLOR = "#3B82F6";
const OUTER_CIRCLE_COLOR = "#EF4444";
const CROSS_COLOR = "#FACC15";

function drawPixel(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillRect(x, y, 1, 1);
}

function drawRing(ctx: CanvasRenderingContext2D, radius: number) {
  for (let y = CENTER - radius; y < CENTER + radius; y++) {
    for (let x = CENTER - radius; x < CENTER + radius; x++) {
      const distance = Math.hypot(x + 0.5 - CENTER, y + 0.5 - CENTER);
      if (Math.round(distance) === radius) drawPixel(ctx, x, y);
    }
  }
}

export const setupScene: Scene = {
  id: SceneId.Setup,
  label: "Setup",
  draw({ ctx, dimensions }) {
    const { width, height } = dimensions;

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = DOT_COLOR;
    for (const x of [PADDING, width - 1 - PADDING]) {
      for (const y of [PADDING, height - 1 - PADDING]) {
        drawPixel(ctx, x, y);
      }
    }

    ctx.fillStyle = CIRCLE_COLOR;
    drawRing(ctx, CIRCLE_RADIUS);

    ctx.fillStyle = OUTER_CIRCLE_COLOR;
    drawRing(ctx, OUTER_CIRCLE_RADIUS);

    ctx.fillStyle = CROSS_COLOR;
    for (let step = 0; step < CROSS_REACH * 2; step++) {
      const near = CENTER - CROSS_REACH + step;
      const far = CENTER + CROSS_REACH - 1 - step;
      drawPixel(ctx, near, near);
      drawPixel(ctx, far, near);
    }
  },
};
