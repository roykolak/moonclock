import { MacroFn, Pixel } from "../types";

export const startBox: MacroFn = async ({
  macroConfig,
  dimensions,
  index,
  updatePixels,
}) => {
  const config = {
    backgroundColor: "#ffffff",
    startingColumn: 0,
    startingRow: 0,
    width: dimensions.width,
    height: dimensions.height,
    borderWidth: 0,
    borderColor: "#fff",
    ...macroConfig,
  };

  const pixels: Pixel[] = [];

  for (let x = 0; x < config.width; x++) {
    for (let y = 0; y < config.height; y++) {
      pixels.push({ x, y, rgba: new Uint8ClampedArray([0, 0, 0, 255]) });
    }
  }

  updatePixels(pixels, index);

  return () => {};
};
