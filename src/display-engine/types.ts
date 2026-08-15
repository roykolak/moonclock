export type Anchor =
  | "top-left"
  | "top"
  | "top-right"
  | "left"
  | "center"
  | "right"
  | "bottom-left"
  | "bottom"
  | "bottom-right";

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

export type PixelsChangeCallback = (pixels: Pixel[]) => void;
export type CreateCanvas = (
  dimensions: Dimensions,
) => Promise<HTMLCanvasElement>;

/** The engine's one rendering primitive. Everything the display engine can
 *  render — a curated scene, a boot screen, a button-press preview — is a
 *  Scene: optional one-time setup, then a per-frame draw with direct canvas
 *  access. There is no intermediate "macro" representation to compile into
 *  or out of. */
export interface Scene<S = unknown> {
  /** 0/undefined == draw a single static frame. */
  framesPerSecond?: number;
  /** Optional async setup, run once per render — e.g. pre-render a sprite
   *  or measure text onto a scratch canvas rather than doing it per-frame.
   *  `ctx` is the real, visible canvas context — safe to use for
   *  measurement (e.g. `ctx.measureText`) before any drawing happens. */
  init?: (args: {
    dimensions: Dimensions;
    createCanvas: CreateCanvas;
    ctx: CanvasRenderingContext2D;
  }) => Promise<S>;
  draw: (args: {
    ctx: CanvasRenderingContext2D;
    dimensions: Dimensions;
    /** ms since this render started. Use for time-based motion. */
    elapsed: number;
    state: S;
  }) => void;
}
