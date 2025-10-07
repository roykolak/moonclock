import { Dimensions, Pixel } from "./types";

export function syncFromCanvas(
  ctx: CanvasRenderingContext2D,
  dimensions: Dimensions
) {
  const pixels: Pixel[] = [];

  let data: Uint8ClampedArray | null;

  try {
    ({ data } = ctx.getImageData(0, 0, dimensions.width, dimensions.height));
  } catch (e) {
    console.log(e);
    data = null;
  }

  if (data) {
    for (let y = 0; y < dimensions.height; y++) {
      for (let x = 0; x < dimensions.width; x++) {
        const i = (y * dimensions.width + x) * 4;
        pixels.push({
          x: x,
          y: y,
          rgba: new Uint8ClampedArray([
            data[i],
            data[i + 1],
            data[i + 2],
            data[i + 3],
          ]),
        });
      }
    }
  }

  return pixels;
}
