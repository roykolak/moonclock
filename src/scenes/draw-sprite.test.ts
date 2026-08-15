import { describe, it } from "node:test";
import assert from "node:assert";
import { drawSprite } from "./draw-sprite";
import { moonSprite } from "./moon/sprite";
import { bunnySprite } from "./bunny/sprite";
import { moon as legacyMoon } from "./__fixtures__/legacy-moon";
import bunnyJson from "../../custom_scenes/bunny.json";
import type { Dimensions } from "@/display-engine/types";

const dimensions: Dimensions = { width: 32, height: 32 };

function fakeCtx() {
  const pixels: { [key: string]: string } = {};
  const ctx = {
    fillStyle: "",
    fillRect(x: number, y: number, w: number, h: number) {
      for (let dy = 0; dy < h; dy++) {
        for (let dx = 0; dx < w; dx++) {
          pixels[`${x + dx}:${y + dy}`] = ctx.fillStyle as string;
        }
      }
    },
  };
  return { ctx: ctx as unknown as CanvasRenderingContext2D, pixels };
}

describe("drawSprite", () => {
  it("centers a small sprite within the panel using floor((panel-sprite)/2)", () => {
    const { ctx, pixels } = fakeCtx();
    drawSprite(ctx, dimensions, {
      width: 4,
      height: 4,
      pixels: { "0:0": "#fff" },
    });
    assert.deepEqual(Object.keys(pixels), ["14:14"]);
  });

  it("applies offsetX/offsetY after anchoring", () => {
    const { ctx, pixels } = fakeCtx();
    drawSprite(
      ctx,
      dimensions,
      { width: 1, height: 1, pixels: { "0:0": "#fff" } },
      {
        anchor: "top-left",
        offsetX: 3,
        offsetY: -2,
      },
    );
    assert.deepEqual(Object.keys(pixels), ["3:-2"]);
  });

  it("scale draws an NxN block per source pixel", () => {
    const { ctx, pixels } = fakeCtx();
    drawSprite(
      ctx,
      dimensions,
      { width: 1, height: 1, pixels: { "0:0": "#fff" } },
      {
        anchor: "top-left",
        scale: 2,
      },
    );
    assert.deepEqual(Object.keys(pixels).sort(), ["0:0", "0:1", "1:0", "1:1"]);
  });

  it("skips falsy hex values", () => {
    const { ctx, pixels } = fakeCtx();
    drawSprite(ctx, dimensions, {
      width: 1,
      height: 1,
      pixels: { "0:0": "" },
    });
    assert.deepEqual(pixels, {});
  });

  it("reproduces the legacy moon's exact absolute pixel positions at anchor:center, offsetX:1", () => {
    const { ctx, pixels } = fakeCtx();
    drawSprite(ctx, dimensions, moonSprite, {
      anchor: "center",
      offsetX: 1,
      offsetY: 0,
    });

    const expected: { [key: string]: string } = {};
    for (const [key, hex] of Object.entries(legacyMoon)) {
      expected[key] = hex.toLowerCase();
    }
    const actual: { [key: string]: string } = {};
    for (const [key, hex] of Object.entries(pixels)) {
      actual[key] = hex.toLowerCase();
    }

    assert.deepEqual(actual, expected);
  });

  it("reproduces bunny.json's exact absolute pixel positions at anchor:center (no offset)", () => {
    const { ctx, pixels } = fakeCtx();
    drawSprite(ctx, dimensions, bunnySprite, { anchor: "center" });

    const expected: { [key: string]: string } = {};
    for (const [key, hex] of Object.entries(
      bunnyJson as unknown as Record<string, string>,
    )) {
      if (hex) expected[key] = hex.toLowerCase();
    }
    const actual: { [key: string]: string } = {};
    for (const [key, hex] of Object.entries(pixels)) {
      actual[key] = hex.toLowerCase();
    }

    assert.deepEqual(actual, expected);
  });
});
