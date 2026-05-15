import { MacroFn } from "../types";
import { syncFromCanvas } from "../canvas";
import { getAnimationFrame, stopAnimationFrame } from "../animation";

export const startLoadingBar: MacroFn = async ({
  macroConfig,
  dimensions,
  ctx,
  index,
  updatePixels,
}) => {
  const config = {
    color: "#ffffff",
    height: 2,
    startingRow: dimensions.height - 2,
    duration: 3000,
    ...macroConfig,
  };

  let timeoutId: NodeJS.Timeout;
  let running = true;
  const startTime = performance.now();

  function runFrame() {
    const elapsed = performance.now() - startTime;
    const progress = Math.min(elapsed / config.duration, 1);
    const barWidth = Math.floor(progress * dimensions.width);

    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    if (barWidth > 0) {
      ctx.fillStyle = config.color;
      ctx.fillRect(0, config.startingRow, barWidth, config.height);
    }

    const pixels = syncFromCanvas(ctx, dimensions);
    updatePixels(pixels, index);

    if (running && progress < 1) {
      timeoutId = getAnimationFrame(runFrame, { framesPerSecond: 20 });
    }
  }

  runFrame();

  return () => {
    running = false;
    stopAnimationFrame(timeoutId);
  };
};
