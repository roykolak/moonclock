import { drawSprite } from "../draw-sprite";
import { bunnySprite } from "./sprite";
import type { Scene } from "../types";
import { SceneId } from "../types";

const AMPLITUDE = 1; // pixels
const PERIOD_MS = 3200;

interface BunnyState {
  canvas: HTMLCanvasElement;
}

export const bunnyScene: Scene<BunnyState> = {
  id: SceneId.Bunny,
  label: "Bunny",
  framesPerSecond: 8,
  async init({ createCanvas }) {
    // Pre-render the sprite once onto a scratch canvas rather than
    // redrawing all ~469 pixels every frame — same approach the old
    // spriteBob painter used.
    const canvas = await createCanvas({
      width: bunnySprite.width,
      height: bunnySprite.height,
    });
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    drawSprite(
      ctx,
      { width: bunnySprite.width, height: bunnySprite.height },
      bunnySprite,
      { anchor: "top-left" },
    );
    return { canvas };
  },
  draw({ ctx, dimensions, elapsed, state }) {
    const bob = Math.round(
      Math.sin((elapsed / PERIOD_MS) * Math.PI * 2) * AMPLITUDE,
    );

    const ox = Math.floor((dimensions.width - bunnySprite.width) / 2);
    const oy = Math.floor((dimensions.height - bunnySprite.height) / 2) + bob;

    ctx.drawImage(state.canvas as unknown as CanvasImageSource, ox, oy);
  },
};
