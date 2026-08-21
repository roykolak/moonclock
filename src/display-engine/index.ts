import { mixColors } from "./colors";
import { createAnimationLoop } from "./animation";
import { syncFromCanvas } from "./canvas";
import {
  CreateCanvas,
  Dimensions,
  Pixel,
  PixelsChangeCallback,
  Scene,
} from "./types";

export type { Pixel, Scene, Dimensions } from "./types";

const BLACK = new Uint8ClampedArray([0, 0, 0, 255]);

export function createDisplayEngine({
  dimensions,
  onPixelsChange,
  createCanvas,
}: {
  dimensions: Dimensions;
  onPixelsChange: PixelsChangeCallback;
  createCanvas: CreateCanvas;
}) {
  let stop: () => void = () => {};

  return {
    render: async <S>(scene: Scene<S> | null) => {
      stop();

      const resetPixels: Pixel[] = [];
      for (let x = 0; x < dimensions.width; x++) {
        for (let y = 0; y < dimensions.height; y++) {
          resetPixels.push({ x, y, rgba: BLACK });
        }
      }
      onPixelsChange(resetPixels);

      if (!scene) {
        stop = () => {};
        return stop;
      }

      const canvas = await createCanvas(dimensions);
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

      // skia-canvas's Context2D keeps only a WeakRef to its canvas. If nothing
      // else holds the canvas strongly, GC can free it mid-scene and the next
      // getImageData (in syncFromCanvas) throws a Neon "failed to downcast"
      // error. Pin the canvas onto the ctx we retain and touch every frame: a
      // property write on a live object is a real side effect, so — unlike a
      // bare `void canvas` statement — bundler dead-code elimination can't drop
      // it (esbuild minify silently removed the old keepalive, freeing the
      // canvas the instant boot-time GC ran).
      (ctx as unknown as { __canvasKeepalive?: unknown }).__canvasKeepalive =
        canvas;

      // A scene without `init` never reads `state` in `draw`, so the
      // `undefined` here is safe even though `S` may not include it.
      const state = (
        scene.init
          ? await scene.init({ dimensions, createCanvas, ctx })
          : undefined
      ) as S;

      const fps = scene.framesPerSecond ?? 0;
      const start = performance.now();
      const loop = createAnimationLoop({ framesPerSecond: fps || 1 });
      let running = true;

      function frame() {
        ctx.clearRect(0, 0, dimensions.width, dimensions.height);
        ctx.save();
        scene!.draw({
          ctx,
          dimensions,
          elapsed: performance.now() - start,
          state,
        });
        ctx.restore();

        const pixels = syncFromCanvas(ctx, dimensions).map((pixel) => ({
          ...pixel,
          rgba: mixColors({ newColor: pixel.rgba, baseColor: BLACK }),
        }));
        onPixelsChange(pixels);

        if (running && fps > 0) loop.schedule(frame);
      }

      frame();

      stop = () => {
        running = false;
        loop.stop();
      };

      return stop;
    },
    stop: () => {
      stop();
    },
  };
}
