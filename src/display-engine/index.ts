import { mixColors } from "./colors";
import { startBox } from "./macros/box";
import { startMarquee } from "./macros/marquee";
import { startMeteors } from "./macros/meteors";
import { startRipple } from "./macros/ripple";
import { startText } from "./macros/text";
import { startTwinkle } from "./macros/twinkle";
import {
  Dimensions,
  Macro,
  MacroBoxConfig,
  MacroCoordinatesConfig,
  MacroCountdownConfig,
  MacroCustomConfig,
  MacroFn,
  MacroImageConfig,
  MacroMarqueeConfig,
  MacroMeteorsConfig,
  MacroMoonConfig,
  MacroName,
  MacroRippleConfig,
  MacroTextConfig,
  MacroTwinkleConfig,
  Pixel,
  PixelsChangeCallback,
  UpdatePixels,
} from "./types";
import { startImage } from "./macros/image";
import { startCustom } from "./macros/custom";
import { buildCanvas } from "./canvas";
import { startCoordinates } from "./macros/coordinates";
import { startMoon } from "./macros/moon";
import { startCountdown } from "./macros/countdown";

export type { Pixel, Macro, MacroConfig, MacroName, Dimensions } from "./types";

export const twinkle = (macroConfig: Partial<MacroTwinkleConfig>): Macro => ({
  macroName: MacroName.Twinkle,
  macroConfig,
});

export const meteors = (macroConfig: Partial<MacroMeteorsConfig>): Macro => ({
  macroName: MacroName.Meteors,
  macroConfig,
});

export const box = (macroConfig: Partial<MacroBoxConfig>): Macro => ({
  macroName: MacroName.Box,
  macroConfig,
});

export const text = (macroConfig: Partial<MacroTextConfig>): Macro => ({
  macroName: MacroName.Text,
  macroConfig,
});

export const marquee = (macroConfig: Partial<MacroMarqueeConfig>): Macro => ({
  macroName: MacroName.Marquee,
  macroConfig,
});

export const image = (macroConfig: Partial<MacroImageConfig>): Macro => ({
  macroName: MacroName.Image,
  macroConfig,
});

export const ripple = (macroConfig: Partial<MacroRippleConfig>): Macro => ({
  macroName: MacroName.Ripple,
  macroConfig,
});

export const custom = (macroConfig: Partial<MacroCustomConfig>): Macro => ({
  macroName: MacroName.Custom,
  macroConfig,
});

export const moon = (macroConfig: Partial<MacroMoonConfig>): Macro => ({
  macroName: MacroName.Moon,
  macroConfig,
});

export const coordinates = (
  macroConfig: Partial<MacroCoordinatesConfig>
): Macro => ({
  macroName: MacroName.Coordinates,
  macroConfig,
});

export const countdown = (
  macroConfig: Partial<MacroCountdownConfig>
): Macro => ({
  macroName: MacroName.Countdown,
  macroConfig,
});

function startMacros({
  macros,
  dimensions,
  updatePixels,
}: {
  macros: Macro[];
  dimensions: Dimensions;
  updatePixels: UpdatePixels;
}): () => Promise<void> {
  const stops = macros.map(({ macroName, macroConfig }, index) => {
    const { ctx } = buildCanvas(dimensions);

    const MacroMap: { [k in MacroName]: MacroFn } = {
      [MacroName.Box]: startBox,
      [MacroName.Text]: startText,
      [MacroName.Marquee]: startMarquee,
      [MacroName.Twinkle]: startTwinkle,
      [MacroName.Ripple]: startRipple,
      [MacroName.Image]: startImage,
      [MacroName.Meteors]: startMeteors,
      [MacroName.Custom]: startCustom,
      [MacroName.Coordinates]: startCoordinates,
      [MacroName.Moon]: startMoon,
      [MacroName.Countdown]: startCountdown,
    };

    const macroFn = MacroMap[macroName];

    return macroFn({
      macroConfig,
      dimensions,
      ctx,
      index,
      updatePixels,
    });
  });

  return async () => {
    (await Promise.all(stops)).forEach((stop) => stop());
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
}: {
  dimensions: { height: number; width: number };
  onPixelsChange: PixelsChangeCallback;
}) {
  let stopMacros: () => Promise<void> = () => Promise.resolve();

  return {
    render: async (macros: Macro[]) => {
      await stopMacros();

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

      stopMacros = startMacros({
        macros,
        dimensions,
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
  };
}
