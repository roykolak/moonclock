// Leaf module — no imports.

/** A sprite authored in its OWN box. Keys are "x:y" relative to the
 *  sprite's top-left, i.e. minX === minY === 0. */
export interface Sprite {
  width: number;
  height: number;
  pixels: { [key: string]: string }; // "x:y" -> "#rrggbb" | "#rrggbbaa"
}
