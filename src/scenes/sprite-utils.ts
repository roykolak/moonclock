// PURE — no fs, no next/*, no "use server". Bundles into the hardware
// esbuild bundle, the Next server, and client chunks (ScenePicker,
// PresetPreview). Keep it that way.

import { measure } from "@/display-engine/geometry";
import type { Sprite } from "./sprite";

export { measure };
export type { BBox } from "@/display-engine/geometry";

/** Rebase an absolute "x:y" -> hex coordinate map to its own bounding box,
 *  so minX === minY === 0. Used one-time (via bin/normalize-sprite.ts) to
 *  turn a panel-absolute map (legacy scene data, custom_scenes JSON) into
 *  a Sprite authored in its own box. */
export function normalizeSprite(coords: { [key: string]: string }): Sprite {
  const bbox = measure(coords);
  const pixels: { [key: string]: string } = {};

  for (const key in coords) {
    if (!coords[key]) continue;
    const [x, y] = key.split(":").map((n) => parseInt(n, 10));
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
    pixels[`${x - bbox.minX}:${y - bbox.minY}`] = coords[key];
  }

  return { width: bbox.width, height: bbox.height, pixels };
}

/** Applies a Recolor (palette swap + opacity multiply) to a Sprite at
 *  build time, returning a new Sprite. Swap keys are matched
 *  case-insensitively against the source hex. */
export function applyRecolor(
  sprite: Sprite,
  recolor?: { swap?: Record<string, string>; opacity?: number },
): Sprite {
  if (!recolor?.swap && recolor?.opacity === undefined) return sprite;

  const swap = recolor.swap ?? {};
  const swapLower = Object.fromEntries(
    Object.entries(swap).map(([k, v]) => [k.toLowerCase(), v]),
  );

  const pixels: { [key: string]: string } = {};
  for (const key in sprite.pixels) {
    let hex = sprite.pixels[key];
    const swapped = swapLower[hex.toLowerCase()];
    if (swapped) hex = swapped;

    if (recolor.opacity !== undefined) {
      hex = withOpacity(hex, recolor.opacity);
    }

    pixels[key] = hex;
  }

  return { width: sprite.width, height: sprite.height, pixels };
}

function withOpacity(hex: string, opacity: number): string {
  const clean = hex.replace("#", "");
  const rgb = clean.slice(0, 6);
  const existingAlpha =
    clean.length === 8 ? parseInt(clean.slice(6, 8), 16) : 255;
  const alpha = Math.round(existingAlpha * Math.max(0, Math.min(1, opacity)));
  return `#${rgb}${alpha.toString(16).padStart(2, "0")}`;
}
