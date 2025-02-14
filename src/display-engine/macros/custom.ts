import { syncFromCanvas } from "../canvas";
import { MacroCustomConfig, MacroFn } from "../types";

export const startCustom: MacroFn = async ({
  macroConfig,
  dimensions,
  ctx,
  index,
  updatePixels,
}) => {
  (macroConfig as MacroCustomConfig).customFunc(ctx, dimensions);

  const pixels = syncFromCanvas(ctx, dimensions);
  updatePixels(pixels, index);

  return () => {};
};
