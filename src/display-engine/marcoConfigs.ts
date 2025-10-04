import {
  Macro,
  MacroBoxConfig,
  MacroCoordinatesConfig,
  // MacroCountdownConfig,
  MacroEmojiConfig,
  // MacroMarqueeConfig,
  // MacroMeteorsConfig,
  MacroMoonConfig,
  MacroName,
  // MacroRippleConfig,
  MacroTextConfig,
  MacroTwinkleConfig,
} from "./types";

export const twinkle = (macroConfig: Partial<MacroTwinkleConfig>): Macro => ({
  macroName: MacroName.Twinkle,
  macroConfig,
});

// export const meteors = (macroConfig: Partial<MacroMeteorsConfig>): Macro => ({
//   macroName: MacroName.Meteors,
//   macroConfig,
// });

export const box = (macroConfig: Partial<MacroBoxConfig>): Macro => ({
  macroName: MacroName.Box,
  macroConfig,
});

export const text = (macroConfig: Partial<MacroTextConfig>): Macro => ({
  macroName: MacroName.Text,
  macroConfig,
});

// export const marquee = (macroConfig: Partial<MacroMarqueeConfig>): Macro => ({
//   macroName: MacroName.Marquee,
//   macroConfig,
// });

export const emoji = (macroConfig: Partial<MacroEmojiConfig>): Macro => ({
  macroName: MacroName.Emoji,
  macroConfig,
});

// export const ripple = (macroConfig: Partial<MacroRippleConfig>): Macro => ({
//   macroName: MacroName.Ripple,
//   macroConfig,
// });

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

// export const countdown = (
//   macroConfig: Partial<MacroCountdownConfig>
// ): Macro => ({
//   macroName: MacroName.Countdown,
//   macroConfig,
// });
