// PURE — no fs, no next/*, no "use server". Bundles into the hardware
// esbuild bundle, the Next server, and client chunks (ScenePicker,
// PresetPreview). Keep it that way.

import { anchorOrigin } from "@/display-engine/geometry";
import type { Anchor, Dimensions } from "@/display-engine/types";
import type { Sprite } from "./types";

interface SpritePlacement {
  anchor?: Anchor; // default "center"
  offsetX?: number; // whole pixels, applied AFTER anchoring
  offsetY?: number;
  scale?: number; // integer nearest-neighbour, >= 1, default 1
}

/** Draws a Sprite (pixel data authored in its own 0-based box) onto a
 *  canvas, anchored within `dimensions` and painted via `ctx.fillRect`.
 *  The one shared placement primitive every scene's `draw()` calls
 *  directly. */
export function drawSprite(
  ctx: CanvasRenderingContext2D,
  dimensions: Dimensions,
  sprite: Sprite,
  placement?: SpritePlacement,
): void {
  const anchor = placement?.anchor ?? "center";
  const scale = Math.max(1, Math.floor(placement?.scale ?? 1));

  const origin = anchorOrigin(
    anchor,
    dimensions.width,
    dimensions.height,
    sprite.width * scale,
    sprite.height * scale,
  );
  const ox = origin.x + (placement?.offsetX ?? 0);
  const oy = origin.y + (placement?.offsetY ?? 0);

  for (const key in sprite.pixels) {
    const hex = sprite.pixels[key];
    if (!hex) continue;

    const [sx, sy] = key.split(":").map((n) => parseInt(n, 10));
    if (!Number.isFinite(sx) || !Number.isFinite(sy)) continue;

    ctx.fillStyle = hex;
    ctx.fillRect(ox + sx * scale, oy + sy * scale, scale, scale);
  }
}
