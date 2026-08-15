import { describe, it, mock } from "node:test";
import assert from "node:assert";
import { createDisplayEngine } from "./index";
import { Dimensions, Pixel } from "./types";

const dimensions: Dimensions = { width: 4, height: 4 };

function fakeCtx(): CanvasRenderingContext2D {
  return {
    clearRect: () => {},
    save: () => {},
    restore: () => {},
    getImageData: () => ({
      data: new Uint8ClampedArray(dimensions.width * dimensions.height * 4),
    }),
  } as unknown as CanvasRenderingContext2D;
}

const fakeCreateCanvas = (async () => ({
  getContext: () => fakeCtx(),
})) as unknown as (d: Dimensions) => Promise<HTMLCanvasElement>;

function makeEngine(onPixelsChange: (pixels: Pixel[]) => void) {
  return createDisplayEngine({
    dimensions,
    createCanvas: fakeCreateCanvas,
    onPixelsChange,
  });
}

describe("createDisplayEngine", () => {
  it("resets to black and does nothing further when rendering null", async () => {
    const batches: Pixel[][] = [];
    const engine = makeEngine((pixels) => batches.push(pixels));

    await engine.render(null);

    assert.equal(batches.length, 1);
    assert.equal(batches[0].length, dimensions.width * dimensions.height);
    assert.ok(batches[0].every((p) => p.rgba?.[3] === 255));
  });

  it("runs init once and draw per frame, and stop() halts the loop", async () => {
    const drawSpy = mock.fn();
    const initSpy = mock.fn(async () => ({}));
    const engine = makeEngine(() => {});

    const stop = await engine.render({
      init: initSpy,
      draw: drawSpy,
      framesPerSecond: 100,
    });

    assert.equal(initSpy.mock.calls.length, 1);
    assert.equal(drawSpy.mock.calls.length, 1);

    stop();
    const callsAfterStop = drawSpy.mock.calls.length;

    await new Promise((resolve) => setTimeout(resolve, 30));
    assert.equal(
      drawSpy.mock.calls.length,
      callsAfterStop,
      "draw should not be called again after stop()",
    );
  });

  it("draws exactly one frame when framesPerSecond is omitted", async () => {
    const drawSpy = mock.fn();
    const engine = makeEngine(() => {});

    await engine.render({ draw: drawSpy });
    await new Promise((resolve) => setTimeout(resolve, 30));

    assert.equal(drawSpy.mock.calls.length, 1);
  });

  it("re-rendering stops the previous scene's loop", async () => {
    const firstDraw = mock.fn();
    const secondDraw = mock.fn();
    const engine = makeEngine(() => {});

    await engine.render({ draw: firstDraw, framesPerSecond: 100 });
    const stop = await engine.render({
      draw: secondDraw,
      framesPerSecond: 100,
    });

    const firstCallsAfterSwitch = firstDraw.mock.calls.length;
    await new Promise((resolve) => setTimeout(resolve, 30));

    assert.equal(firstDraw.mock.calls.length, firstCallsAfterSwitch);
    assert.ok(secondDraw.mock.calls.length > 1);

    stop();
  });
});
