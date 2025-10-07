import { syncFromCanvas } from "../canvas";
import { MacroFn } from "../types";

// function logPixels(pixels: Pixel[]) {
//   const output: { [k: string]: string } = {};

//   for (const pixel of pixels) {
//     output[`${pixel.x}:${pixel.y}`] = toHex(pixel.rgba as Uint8ClampedArray);
//   }

//   console.log(JSON.stringify(output, null, 2));
// }

// logPixels(
//   pixels.filter(
//     (pixel) =>
//       !(pixel.rgba[0] === 0 && pixel.rgba[2] === 0 && pixel.rgba[3] === 0)
//   )
// );

export const startText: MacroFn = async ({
  macroConfig,
  dimensions,
  ctx,
  index,
  updatePixels,
}) => {
  const config = {
    color: "#fff",
    text: "hello WORLD!",
    font: "Arial",
    fontSize: 12,
    alignment: "left",
    spaceBetweenLetters: 1,
    spaceBetweenLines: 1,
    startingColumn: 0,
    startingRow: 0,
    width: dimensions.width,
    ...macroConfig,
  };

  ctx.textBaseline = "top";
  ctx.font = `${config.fontSize}px ${config.font}`;
  ctx.fillStyle = config.color;

  const lineHeight = 7;
  let y = config.startingRow;

  for (const line of config.text.split(/\r?\n/)) {
    const textMetrics = ctx.measureText(line);
    if (config.alignment === "left") {
      ctx.fillText(line, config.startingColumn, y);
    } else if (config.alignment === "right") {
      ctx.fillText(line, config.width - textMetrics.width, y);
    } else if (config.alignment === "center") {
      ctx.fillText(
        line,
        Math.floor(config.width / 2) - Math.floor(textMetrics.width / 2),
        y
      );
    }
    y += lineHeight;
  }

  const pixels = syncFromCanvas(ctx, dimensions);
  updatePixels(pixels, index);

  return () => {};
};
