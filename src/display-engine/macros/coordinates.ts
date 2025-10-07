import { MacroCoordinatesConfig, MacroFn, Pixel } from "../types";
import { colorToRgba } from "./ripple";

export const startCoordinates: MacroFn = async ({
  macroConfig,
  index,
  updatePixels,
}) => {
  const config = {
    coordinates: {
      "1:1": "#ffffff",
    },
    ...macroConfig,
  };

  const pixels: Pixel[] = [];

  for (const coordinate in config.coordinates) {
    const hexColor = (config as MacroCoordinatesConfig).coordinates[coordinate];

    if (!hexColor) continue;

    const rgba = colorToRgba(hexColor);
    const [x, y] = coordinate.split(":");

    pixels.push({
      y: parseInt(y, 10),
      x: parseInt(x, 10),
      rgba: new Uint8ClampedArray([rgba.r, rgba.g, rgba.b, rgba.a]),
    });
  }

  updatePixels(pixels, index);

  return () => {};
};
