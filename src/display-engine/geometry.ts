import { Anchor } from "./types";

export interface BBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
}

/** Measures the bounding box of a sparse "x:y" -> hex coordinate map,
 *  skipping falsy values and unparseable keys the same way the
 *  coordinates macro does. */
export function measure(coords: { [key: string]: string }): BBox {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const key in coords) {
    if (!coords[key]) continue;
    const [x, y] = key.split(":").map((n) => parseInt(n, 10));
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }

  if (minX === Infinity) {
    return { minX: 0, minY: 0, maxX: -1, maxY: -1, width: 0, height: 0 };
  }

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}

/** Origin (top-left corner) of a `spriteSize`-sized box anchored within a
 *  `panelSize`-sized box. Odd remainders bias toward top-left (floor). */
export function anchorOrigin(
  anchor: Anchor,
  panelWidth: number,
  panelHeight: number,
  spriteWidth: number,
  spriteHeight: number,
): { x: number; y: number } {
  const x = anchor.includes("right")
    ? panelWidth - spriteWidth
    : anchor.includes("left")
      ? 0
      : Math.floor((panelWidth - spriteWidth) / 2);

  const y = anchor.startsWith("bottom")
    ? panelHeight - spriteHeight
    : anchor.startsWith("top")
      ? 0
      : Math.floor((panelHeight - spriteHeight) / 2);

  return { x, y };
}
