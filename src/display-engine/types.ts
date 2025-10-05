export type Alignment = "left" | "center" | "right";

export enum MacroName {
  Box = "box",
  Text = "text",
  Twinkle = "twinkle",
  Coordinates = "coordinates",
  Moon = "moon",
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
  MacroTwinkleConfig &
  MacroImageConfig &
  MacroCoordinatesConfig &
  MacroMoonConfig &
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
export type MacroStopCallback = () => void;

export type CreateCanvas = (
  dimensions: Dimensions
) => Promise<HTMLCanvasElement>;

export type MacroFn = ({
  macroConfig,
  dimensions,
  ctx,
  fonts,
  index,
  updatePixels,
}: {
  macroConfig: Partial<MacroConfig>;
  dimensions: Dimensions;
  ctx: CanvasRenderingContext2D;
  fonts: Fonts;
  index: number;
  updatePixels: InternalPixelsChangeCallback;
  createCanvas: CreateCanvas;
}) => Promise<MacroStopCallback>;
