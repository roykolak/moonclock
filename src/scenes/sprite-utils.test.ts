import { describe, it } from "node:test";
import assert from "node:assert";
import { measure, normalizeSprite } from "./sprite-utils";
import { moon } from "@/display-engine/scenes/moon";
import bunnyJson from "../../custom_scenes/bunny.json";

describe("measure", () => {
  it("returns a zeroed bbox for an empty map", () => {
    assert.deepEqual(measure({}), {
      minX: 0,
      minY: 0,
      maxX: -1,
      maxY: -1,
      width: 0,
      height: 0,
    });
  });

  it("skips falsy values and unparseable keys", () => {
    const bbox = measure({ "0:0": "", "5:5": "#fff", garbage: "#fff" });
    assert.deepEqual(bbox, {
      minX: 5,
      minY: 5,
      maxX: 5,
      maxY: 5,
      width: 1,
      height: 1,
    });
  });
});

describe("normalizeSprite", () => {
  it("round-trips: re-adding the removed offset reproduces the original keys", () => {
    const original = { "5:6": "#ff0000", "8:9": "#00ff00" };
    const sprite = normalizeSprite(original);
    assert.deepEqual(sprite, {
      width: 4,
      height: 4,
      pixels: { "0:0": "#ff0000", "3:3": "#00ff00" },
    });
  });

  it("normalizes the legacy moon map to the measured 29x29 extent", () => {
    const sprite = normalizeSprite(moon);
    assert.equal(sprite.width, 29);
    assert.equal(sprite.height, 29);
    assert.equal(Object.keys(sprite.pixels).length, Object.keys(moon).length);
  });

  it("normalizes bunny.json to the measured 24x29 extent", () => {
    const sprite = normalizeSprite(
      bunnyJson as unknown as Record<string, string>,
    );
    assert.equal(sprite.width, 24);
    assert.equal(sprite.height, 29);
    // bunny.json has 471 raw keys, 2 with falsy (null) values that both
    // this and the coordinates macro correctly skip.
    const truthyKeys = Object.values(bunnyJson).filter(Boolean).length;
    assert.equal(Object.keys(sprite.pixels).length, truthyKeys);
    assert.equal(truthyKeys, 469);
  });
});
