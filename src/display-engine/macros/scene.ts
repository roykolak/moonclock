import { bunny } from "../scenes/bunny";
import { moon } from "../scenes/moon";
import { nothing } from "../scenes/nothing";
import {
  MacroCoordinatesConfig,
  MacroFn,
  MacroSceneConfig,
  SceneName,
} from "../types";
import { startCoordinates } from "./coordinates";

export const startScene: MacroFn = async ({
  macroConfig,
  dimensions,
  ctx,
  index,
  updatePixels,
}) => {
  const config = {
    sceneName: "moon", // default
    ...macroConfig,
  } as MacroSceneConfig;

  const coordinatesConfig: MacroCoordinatesConfig = {
    coordinates: getSceneCoordinates(config.sceneName),
  };

  let frame = 0;

  const interval = setInterval(() => {
    const rgba = new Uint8ClampedArray([255, 255, 255, 255]);
    if (frame === 2 && config.sceneName === "moon") {
      updatePixels([{ y: 6, x: 5, rgba }], index);
    } else if (frame === 15 && config.sceneName === "moon") {
      updatePixels([{ y: 9, x: 15, rgba }], index);
    } else if (frame === 38 && config.sceneName === "moon") {
      updatePixels([{ y: 22, x: 30, rgba }], index);
    } else if (frame === 40 && config.sceneName === "moon") {
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

function getSceneCoordinates(scene: SceneName) {
  if (scene === "moon") {
    return moon;
  } else if (scene === "bunny") {
    return bunny;
  } else if (scene === "nothing") {
    return nothing;
  }
  return {};
}
