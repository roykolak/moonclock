import { mixColors } from "./colors";
import { startBox } from "./macros/box";
import { startText } from "./macros/text";
import { startTwinkle } from "./macros/twinkle";
import {
  CreateCanvas,
  Dimensions,
  Fonts,
  Macro,
  MacroFn,
  MacroName,
  Pixel,
  PixelsChangeCallback,
  UpdatePixels,
} from "./types";
import { startCoordinates } from "./macros/coordinates";
import { startMoon } from "./macros/moon";
import { startEmoji } from "./macros/emoji";

export type { Pixel, Macro, MacroConfig, MacroName, Dimensions } from "./types";

async function startMacros({
  macros,
  dimensions,
  fonts,
  updatePixels,
  createCanvas,
}: {
  macros: Macro[];
  dimensions: Dimensions;
  updatePixels: UpdatePixels;
  createCanvas: CreateCanvas;
  fonts: Fonts;
}) {
  const MacroMap: { [k in MacroName]: MacroFn } = {
    [MacroName.Box]: startBox,
    [MacroName.Text]: startText,
    [MacroName.Twinkle]: startTwinkle,
    [MacroName.Coordinates]: startCoordinates,
    [MacroName.Moon]: startMoon,
    [MacroName.Emoji]: startEmoji,
  };

  const stops = await Promise.all(
    macros.map(async ({ macroName, macroConfig }, index) => {
      const canvas = await createCanvas(dimensions);
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

      const macroFn = MacroMap[macroName];

      return macroFn({
        macroConfig,
        dimensions,
        fonts,
        ctx,
        index,
        updatePixels,
        createCanvas,
      });
    })
  );

  return () => {
    for (const stop of stops) {
      stop();
    }
  };
}

const buildPixelMap = ({ height, width }: Dimensions) => {
  const pixelMap: Pixel[][][] = [];
  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      row.push([]);
    }
    pixelMap.push(row);
  }
  return pixelMap;
};

export function createDisplayEngine({
  dimensions,
  onPixelsChange,
  createCanvas,
  fonts,
}: {
  dimensions: { height: number; width: number };
  onPixelsChange: PixelsChangeCallback;
  fonts: Fonts;
  createCanvas: CreateCanvas;
}) {
  let stopMacros: () => void = () => {};

  return {
    render: async (macros: Macro[]) => {
      stopMacros();

      const resetPixels: Pixel[] = [];

      for (let x = 0; x < 32; x++) {
        for (let y = 0; y < 32; y++) {
          resetPixels.push({
            x,
            y,
            rgba: new Uint8ClampedArray([0, 0, 0, 255]),
          });
        }
      }

      onPixelsChange(resetPixels);

      const pixelMap = buildPixelMap(dimensions);

      stopMacros = await startMacros({
        macros,
        dimensions,
        createCanvas,
        fonts,
        updatePixels: (updatePixels, index) => {
          const pixelsToUpdate: Pixel[] = [];
          updatePixels.forEach((pixelToUpdate) => {
            const { y, x } = pixelToUpdate;
            const pixelStack = pixelMap?.[y]?.[x];

            if (!pixelStack) return;

            pixelStack[index] = pixelToUpdate;

            const rgba = pixelStack.reduce<Uint8ClampedArray>(
              (baseColor, pixel) => {
                return mixColors({ newColor: pixel.rgba, baseColor });
              },
              new Uint8ClampedArray([0, 0, 0, 255])
            );

            pixelsToUpdate.push({
              ...pixelToUpdate,
              rgba,
            });
          });

          onPixelsChange(pixelsToUpdate);
        },
      });

      return stopMacros;
    },
    stop: async () => {
      await stopMacros();
    },
  };
}
