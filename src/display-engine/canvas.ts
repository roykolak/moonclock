import { Dimensions, Pixel } from "./types";

export function syncFromCanvas(
  ctx: CanvasRenderingContext2D,
  dimensions: Dimensions
) {
  const pixels: Pixel[] = [];

  for (let y = 0; y < dimensions.height; y++) {
    for (let x = 0; x < dimensions.width; x++) {
      let data: Uint8ClampedArray | null;

      try {
        ({ data } = ctx.getImageData(x, y, 1, 1));
      } catch (e) {
        console.log(e);
        data = null;
      }

      pixels.push({
        x: x,
        y: y,
        rgba: data,
      });
    }
  }

  return pixels;
}
