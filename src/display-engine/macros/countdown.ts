import { syncFromCanvas } from "../canvas";
import { MacroFn } from "../types";

const colors = ["#6aa84f", "#fa6a31", "#2e7fc8", "#ffc332", "#218787"];

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

  let prevDiffInUnit: number | null = null;

  const interval = setInterval(() => {
    const now = new Date().getTime();
    const end = new Date((config as any).endDate).getTime();
    const diffMs = end - now;

    const diffInUnit =
      config.unit === "minute"
        ? Math.floor(diffMs / (1000 * 60)) + 1
        : Math.floor(diffMs / 1000) + 1;

    if (prevDiffInUnit === diffInUnit) return;

    prevDiffInUnit = diffInUnit;

    ctx.textBaseline = "top";
    ctx.font = `${fitTextSimple(ctx, diffInUnit)} Arial`;

    const textMetrics = ctx.measureText(`${diffInUnit}`);
    const height =
      textMetrics.actualBoundingBoxAscent +
      textMetrics.actualBoundingBoxDescent;

    ctx.clearRect(0, 0, config.width, config.height);

    if (config.cycleBackgroundColor) {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      ctx.fillStyle = randomColor;
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);
    }

    ctx.fillStyle = config.color;
    ctx.fillText(
      `${diffInUnit}`,
      config.width / 2 - textMetrics.width / 2,
      config.height / 2 - height / 2
    );

    const pixels = syncFromCanvas(ctx, dimensions);
    updatePixels(pixels, index);
  }, 250);

  return () => clearInterval(interval);
};

function fitTextSimple(ctx: any, text: number, startSize = 24) {
  let fontSize = startSize;

  do {
    ctx.font = `${fontSize}px Arial`;
    fontSize--;
  } while (ctx.measureText(text).width > 32 && fontSize > 1);

  return fontSize + 1;
}
