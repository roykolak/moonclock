export type Alignment = "left" | "center" | "right";

export enum MacroName {
  Box = "box",
  Text = "text",
  Twinkle = "twinkle",
  // Meteors = "meteors",
  // Marquee = "marquee",
  // Image = "image",
  // Ripple = "ripple",
  // Custom = "custom",
  Coordinates = "coordinates",
  // Moon = "moon",
  // Countdown = "countdown",
  Emoji = "emoji",
}
export interface Gradient {
  direction: "vertical" | "horizontal";
  colorStops: { color: string; offset: number }[];
}

export interface MacroBoxConfig {
  backgroundColor: string | Gradient;
  startingColumn: number;
  startingRow: number;
  width: number;
  height: number;
  borderWidth: number;
  borderColor: string;
}

export interface MacroTextConfig {
  color: string;
  text: string;
  fontSize: number;
  font: string;
  alignment: Alignment;
  spaceBetweenLetters: number;
  spaceBetweenLines: number;
  width: number;
  startingColumn: number;
  startingRow: number;
}

export interface MacroTwinkleConfig {
  color: string;
  speed: number;
  width: number;
  height: number;
  amount: number;
}

export interface MacroRippleConfig {
  width: number;
  height: number;
  speed: number;
  color: string;
  waveHeight: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
}

export interface MacroMeteorsConfig {
  color: string;
  meteorCount: number;
  maxTailLength: number;
  minTailLength: number;
  maxDepth: number;
  minSpeed: number;
  maxSpeed: number;
  width: number;
  height: number;
}

export interface MacroMarqueeConfig {
  color: string;
  fontSize: number;
  font: string;
  text: string;
  speed: number;
  width: number;
  startingColumn: number;
  startingRow: number;
  height: number;
  mirrorHorizontally: boolean;
  direction: "horizontal" | "vertical";
}

export interface MacroEmojiConfig {
  name: string;
}

export interface MacroImageConfig {
  url: string;
  speed: number;
  width: number;
  height: number;
  startingColumn: number;
  startingRow: number;
}

export interface MacroCountdownConfig {
  color: string;
  endDate: string;
  cycleBackgroundColor: boolean;
  unit: "minute" | "second";
}

export interface MacroCoordinatesConfig {
  coordinates: {
    [key: string]: string;
  };
}

export interface MacroMoonConfig {
  optional?: any;
  animateStarTwinkle?: boolean;
}

export type MacroConfig = MacroBoxConfig &
  MacroTextConfig &
  MacroMarqueeConfig &
  MacroTwinkleConfig &
  // | MacroMeteorsConfig
  MacroImageConfig &
  MacroCoordinatesConfig &
  MacroMoonConfig &
  MacroRippleConfig &
  MacroCountdownConfig &
  MacroEmojiConfig;

export interface Macro {
  macroName: MacroName;
  macroConfig: Partial<MacroConfig>;
}

export interface Dimensions {
  height: number;
  width: number;
}

export interface Pixel {
  y: number;
  x: number;
  rgba: null | Uint8ClampedArray;
}

export interface AnimationConfig {
  framesPerSecond: number;
}

export type UpdatePixels = (pixels: Pixel[], index: number) => void;
export type InternalPixelsChangeCallback = (
  pixels: Pixel[],
  index: number
) => void;
export type PixelsChangeCallback = (pixels: Pixel[]) => void;
export interface Fonts {
  "4x6": any;
}
export type MacroStopCallback = () => Promise<void>;

export type MacroFn = ({
  macroConfig,
  dimensions,
  fonts,
  index,
  updatePixels,
}: {
  macroConfig: Partial<MacroConfig>;
  dimensions: Dimensions;
  fonts: Fonts;
  index: number;
  updatePixels: InternalPixelsChangeCallback;
}) => Promise<MacroStopCallback>;
