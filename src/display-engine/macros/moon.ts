import { moon } from "../scenes/moon";
import { MacroCoordinatesConfig, MacroFn } from "../types";
import { startCoordinates } from "./coordinates";

export const startMoon: MacroFn = async ({
  dimensions,
  ctx,
  index,
  updatePixels,
}) => {
  const coordinatesConfig: MacroCoordinatesConfig = {
    coordinates: moon,
  };

  let frame = 0;

  const interval = setInterval(() => {
    const rgba = new Uint8ClampedArray([255, 255, 255, 255]);
    if (frame === 2) {
      updatePixels([{ y: 6, x: 5, rgba }], index);
    } else if (frame === 15) {
      updatePixels([{ y: 9, x: 15, rgba }], index);
    } else if (frame === 38) {
      updatePixels([{ y: 22, x: 30, rgba }], index);
    } else if (frame === 40) {
      updatePixels([{ y: 29, x: 12, rgba }], index);
    } else {
      startCoordinates({
        dimensions,
        ctx,
        index,
        updatePixels,
        macroConfig: coordinatesConfig,
      });
    }

    frame = frame === 60 ? 0 : frame + 1;
  }, 1000);

  startCoordinates({
    dimensions,
    ctx,
    index,
    updatePixels,
    macroConfig: coordinatesConfig,
  });

  return Promise.resolve(() => clearInterval(interval));
};
