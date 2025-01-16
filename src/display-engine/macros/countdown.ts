import { syncFromCanvas } from "../canvas";
import { MacroCountdownConfig, MacroFn } from "../types";

export const startCountdown: MacroFn = async ({
  macroConfig,
  dimensions,
  ctx,
  index,
  updatePixels,
}) => {
  const config = {
    color: "#fff",
    width: dimensions.width,
    height: dimensions.height,
    ...macroConfig,
  };

  const interval = setInterval(() => {
    const minutes = Math.floor(
      (config.endDate.getTime() - new Date().getTime()) / (1000 * 60) + 1
    );

    const textMetrics = ctx.measureText(`${minutes}`);
    const height =
      textMetrics.actualBoundingBoxAscent +
      textMetrics.actualBoundingBoxDescent;

    ctx.clearRect(0, 0, config.width, config.height);

    ctx.fillStyle = "#6aa84f";
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);

    ctx.textBaseline = "top";
    ctx.font = `24px Arial`;
    ctx.fillStyle = config.color;
    ctx.fillText(
      `${minutes}`,
      config.width / 2 - textMetrics.width / 2,
      config.height / 2 - height / 2
    );

    const pixels = syncFromCanvas(ctx, dimensions);
    updatePixels(pixels, index);
  }, 250);

  return Promise.resolve(() => clearInterval(interval));
};
