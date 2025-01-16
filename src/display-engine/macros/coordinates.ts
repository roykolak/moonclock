import { MacroCoordinatesConfig, MacroFn } from "../types";
import { syncFromCanvas } from "../canvas";

export const startCoordinates: MacroFn = async ({
  macroConfig,
  ctx,
  dimensions,
  index,
  updatePixels,
}) => {
  const config = {
    coordinates: {
      "1:1": "#ffffff",
    },
    ...macroConfig,
  };

  for (const coordinate in config.coordinates) {
    ctx.fillStyle = (config as MacroCoordinatesConfig).coordinates[coordinate];
    const [x, y] = coordinate.split(":");
    ctx.fillRect(parseInt(x, 10), parseInt(y, 10), 1, 1);
  }

  const pixels = syncFromCanvas(ctx, dimensions);
  updatePixels(pixels, index);

  return Promise.resolve(() => {});
};
