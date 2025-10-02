import { MacroFn, Pixel } from "../types";
import { $Font } from "bdfparser";

export const startText: MacroFn = async ({
  macroConfig,
  dimensions,
  fonts,
  index,
  updatePixels,
}) => {
  const config = {
    color: "#fff",
    text: "hello WORLD!",
    font: "Tiny5",
    fontSize: 12,
    startingColumn: 0,
    startingRow: 0,
    width: dimensions.width,
    alignment: "left" as const,
    spaceBetweenLetters: 1,
    spaceBetweenLines: 1,
    ...macroConfig,
  };

  let pixels: Pixel[] = [];

  try {
    const font = await $Font(fonts["4x6"]);

    function hexRowsToOnPixels(
      hexRows: string[],
      width: number,
      cursor: number,
      line: number
    ) {
      const bytesPerRow = Math.ceil(width / 8);

      for (let y = 0; y < hexRows.length; y++) {
        const hex = hexRows[y];
        const padded = hex.padStart(bytesPerRow * 2, "0");

        let bits = "";
        for (let i = 0; i < padded.length; i += 2) {
          const byte = parseInt(padded.slice(i, i + 2), 16);
          bits += byte.toString(2).padStart(8, "0");
        }

        for (let x = 0; x < width; x++) {
          if (bits[x] === "1")
            pixels.push({
              x: x + cursor,
              y: y + line,
              rgba: new Uint8ClampedArray([255, 255, 255, 255]),
            });
        }
      }
    }

    let cursor = 0;
    let lineCursor = 0;

    for (const line of "hello\nWorld!".split("\n")) {
      for (const character of line) {
        const glyph = font.glyph(character);
        hexRowsToOnPixels(
          glyph?.meta?.hexdata as string[],
          glyph?.meta.bbw as number,
          cursor,
          lineCursor
        );

        cursor += glyph?.meta.bbw || 0;
      }
      lineCursor += font.headers?.fbby || 0;
      cursor = 0;
    }

    //rgba: new Uint8ClampedArray([255, 255, 255, 255]),
  } catch (error) {
    console.error(
      `Failed to render text with bitmap font ${config.font}:`,
      error
    );
    // Fall back to empty pixels array
    pixels = [];
  }

  updatePixels(pixels, index);

  return async () => {};
};
