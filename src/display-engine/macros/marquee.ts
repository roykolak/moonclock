import { MacroFn } from "../types";
import { getAnimationFrame, stopAnimationFrame } from "../animation";

export const startMarquee: MacroFn = async ({
  macroConfig,
  dimensions,
  ctx,
  index,
  updatePixels,
  createCanvas,
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

  const textMetrics = ctx.measureText(config.text);

  const textCanvas = await createCanvas({
    width: Math.ceil(textMetrics.width),
    height: config.fontSize + 4,
  });
  const textCtx = textCanvas.getContext("2d") as CanvasRenderingContext2D;

  textCtx.textBaseline = "top";
  textCtx.font = `${config.fontSize}px ${config.font}`;
  textCtx.fillStyle = config.color;
  textCtx.fillText(config.text, 0, 0);

  const textImageData = textCtx.getImageData(
    0,
    0,
    textCanvas.width,
    textCanvas.height
  );
  const textPixels = textImageData.data;
  const textWidth = textCanvas.width;
  const textHeight = textCanvas.height;

  let offset =
    config.direction === "horizontal" ? -config.width : -config.height;

  function runMarquee() {
    const pixels = [];

    for (let y = 0; y < config.height; y++) {
      for (let x = 0; x < config.width; x++) {
        let sourceX: number;
        let sourceY: number;

        if (config.direction === "horizontal") {
          sourceX = x + offset;
          sourceY = y - config.startingRow;
        } else {
          sourceX = x - config.startingColumn;
          sourceY = y - offset;
        }

        if (
          sourceX >= 0 &&
          sourceX < textWidth &&
          sourceY >= 0 &&
          sourceY < textHeight
        ) {
          const textIndex = (sourceY * textWidth + sourceX) * 4;
          const rgba = new Uint8ClampedArray(4);

          rgba[0] = textPixels[textIndex];
          rgba[1] = textPixels[textIndex + 1];
          rgba[2] = textPixels[textIndex + 2];
          rgba[3] = textPixels[textIndex + 3];

          pixels.push({ x, y, rgba });
        }
      }
    }

    if (config.direction === "horizontal") {
      if (offset > config.width + textWidth) {
        offset = -config.width;
      }
    } else if (config.direction === "vertical") {
      if (offset > config.height + textHeight) {
        offset = -config.height;
      }
    }

    offset += 1;

    if (running) {
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
