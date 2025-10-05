import {
  Macro,
  MacroBoxConfig,
  MacroCoordinatesConfig,
  MacroEmojiConfig,
  MacroMoonConfig,
  MacroName,
  MacroTextConfig,
  MacroTwinkleConfig,
} from "./types";

export const twinkle = (macroConfig: Partial<MacroTwinkleConfig>): Macro => ({
  macroName: MacroName.Twinkle,
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

export const emoji = (macroConfig: Partial<MacroEmojiConfig>): Macro => ({
  macroName: MacroName.Emoji,
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
