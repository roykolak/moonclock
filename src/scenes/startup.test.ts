import { describe, it } from "node:test";
import assert from "node:assert";
import { createStartupConnected, createStartupRing } from "./startup";
import type { Scene } from "@/display-engine/types";

const dimensions = { width: 32, height: 32 };

/** The ring is soft-edged dots — a radial gradient filled through `arc`. The
 *  check is a stroked polyline. Counting the calls tells the two apart exactly,
 *  where sampling pixels cannot: the ring's dots carry every hue, so some of
 *  them are the same green as the check. */
function record(scene: Scene, elapsed: number) {
  const calls = { gradients: 0, arcs: 0, strokes: 0 };
  const ctx = {
    createRadialGradient() {
      calls.gradients++;
      return { addColorStop() {} };
    },
    arc() {
      calls.arcs++;
    },
    stroke() {
      calls.strokes++;
    },
    beginPath() {},
    rect() {},
    clip() {},
    fill() {},
    moveTo() {},
    lineTo() {},
    globalAlpha: 1,
    fillStyle: "",
    strokeStyle: "",
    lineWidth: 0,
    lineCap: "",
    lineJoin: "",
  } as unknown as CanvasRenderingContext2D;

  scene.draw({ ctx, dimensions, elapsed, state: undefined });
  return calls;
}

const RING_DOTS = 10;
const FIRST_FRAME_MS = 1000 / 30;

describe("createStartupConnected", () => {
  it("resolves the ring when handed the ring's age", () => {
    const at0 = record(createStartupConnected(0), 0);
    assert.equal(at0.gradients, RING_DOTS);
    assert.equal(at0.strokes, 0, "check waits out DRAW_DELAY_MS");
  });

  it("stops drawing the ring once it has fully faded", () => {
    const later = record(createStartupConnected(0), 400);
    assert.equal(later.gradients, 0, "drawRing short-circuits at zero alpha");
    assert.equal(later.strokes, 1, "check is stroking by now");
  });

  it("draws no ring at all when called standalone", () => {
    const standalone = createStartupConnected();
    for (const elapsed of [0, 40, 100, 200, 320, 1200]) {
      assert.equal(
        record(standalone, elapsed).gradients,
        0,
        `ring drawn at t=${elapsed}ms`,
      );
      assert.equal(record(standalone, elapsed).arcs, 0, `t=${elapsed}ms`);
    }
  });

  it("starts the check on the first frame when standalone", () => {
    assert.equal(record(createStartupConnected(), FIRST_FRAME_MS).strokes, 1);
    assert.equal(
      record(createStartupConnected(0), FIRST_FRAME_MS).strokes,
      0,
      "the ring-resolving form still holds the check back",
    );
  });
});

describe("createStartupRing", () => {
  it("keeps the loader on screen for as long as it runs", () => {
    const ring = createStartupRing();
    for (const elapsed of [0, 1000, 10_000]) {
      assert.equal(record(ring, elapsed).gradients, RING_DOTS, `t=${elapsed}ms`);
      assert.equal(record(ring, elapsed).strokes, 0);
    }
  });
});
