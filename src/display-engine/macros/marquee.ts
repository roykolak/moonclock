import { buildCanvas, syncFromCanvas } from "../canvas";
import { MacroFn } from "../types";
import { getAnimationFrame, stopAnimationFrame } from "../animation";

export const startMarquee: MacroFn = async ({
  macroConfig,
  dimensions,
  ctx,
  index,
  updatePixels,
}) => {
  const config = {
    color: "#fff",
    text: "Replace with marquee text!",
    font: "Arial",
    fontSize: 12,
    speed: 50,
    width: dimensions.width,
    height: dimensions.height,
    startingColumn: 0,
    startingRow: 0,
    direction: "vertical",
    mirrorHorizontally: false,
    ...macroConfig,
  };

  let timeoutId: NodeJS.Timeout;
  let running = true;

  ctx.textBaseline = "top";
  ctx.font = `bold ${config.fontSize}px ${config.font}`;
  ctx.fillStyle = config.color;

  if (config.mirrorHorizontally) {
    ctx.scale(-1, 1);
  }

  const textMetrics = ctx.measureText(config.text);

  const { canvas: textCanvas, ctx: textCtx } = buildCanvas({
    width: textMetrics.width,
    height: 32,
  });

  textCtx.textBaseline = "top";
  textCtx.font = `${config.fontSize}px ${config.font}`;
  textCtx.fillStyle = config.color;
  textCtx.textDrawingMode = "glyph";
  textCtx.fillText(config.text, 0, 0);

  let offset =
    config.direction === "horizontal"
      ? config.mirrorHorizontally
        ? 0
        : -config.width
      : -config.height;

  function runMarquee() {
    ctx.clearRect(
      0,
      0,
      config.mirrorHorizontally ? -config.width : config.width,
      config.height
    );

    ctx.drawImage(
      textCanvas,
      config.mirrorHorizontally ? offset : -offset,
      config.startingRow
    );

    if (config.direction === "horizontal") {
      if (config.mirrorHorizontally) {
        if (offset < -(config.width + textMetrics.width)) {
          offset = config.width;
        }
      } else {
        if (offset > config.width + textMetrics.width) {
          offset = -config.width;
        }
      }
    } else if (config.direction === "vertical") {
      const height =
        textMetrics.actualBoundingBoxAscent +
        textMetrics.actualBoundingBoxDescent;
      if (offset > config.height + height) {
        offset = -config.height;
      }
    }

    if (config.mirrorHorizontally) {
      offset -= 1;
    } else {
      offset += 1;
    }

    if (running) {
      const pixels = syncFromCanvas(ctx, dimensions);
      updatePixels(pixels, index);
      timeoutId = getAnimationFrame(runMarquee, {
        framesPerSecond: config.speed,
      });
    }
  }

  runMarquee();

  return () => {
    running = false;
    stopAnimationFrame(timeoutId);
  };
};
