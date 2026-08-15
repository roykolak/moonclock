import { Anchor } from "./types";

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
