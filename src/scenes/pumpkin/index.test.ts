import { describe, it } from "node:test";
import assert from "node:assert";
import { FLAME_FLOOR, candleColor, flame } from "./index";
import { PumpkinTone, carvedPixels, pumpkinSprite } from "./sprite";

const PANEL = 32;
const MARGIN = 4;

function luma([r, g, b]: number[]): number {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function hexToRgb(hex: string): number[] {
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
}

function coords(key: string): [number, number] {
  const [x, y] = key.split(":").map(Number);
  return [x, y];
}

describe("pumpkin layout", () => {
  it("keeps the pumpkin and its carving inside the panel's safe area", () => {
    const ox = Math.floor((PANEL - pumpkinSprite.width) / 2);
    const oy = Math.floor((PANEL - pumpkinSprite.height) / 2);
    for (const key of [...Object.keys(pumpkinSprite.pixels), ...carvedPixels]) {
      const [x, y] = coords(key);
      const edge = Math.min(
        ox + x,
        PANEL - 1 - (ox + x),
        oy + y,
        PANEL - 1 - (oy + y),
      );
      assert.ok(edge >= MARGIN, `${key} is ${edge}px in`);
    }
  });

  it("carves only through the rind, never off its edge", () => {
    for (const key of carvedPixels) {
      assert.ok(!(key in pumpkinSprite.pixels), `${key} is also rind`);
      const [x, y] = coords(key);
      for (const [dx, dy] of [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ]) {
        const neighbour = `${x + dx}:${y + dy}`;
        assert.ok(
          neighbour in pumpkinSprite.pixels || carvedPixels.includes(neighbour),
          `${key} opens onto the background at ${neighbour}`,
        );
      }
    }
  });

  it("carves a face that mirrors across the stem", () => {
    const carved = new Set(carvedPixels);
    for (const key of carvedPixels) {
      const [x, y] = coords(key);
      const mirror = `${pumpkinSprite.width - 1 - x}:${y}`;
      assert.ok(carved.has(mirror), `${key} has no mirror at ${mirror}`);
    }
  });
});

describe("candle", () => {
  it("stays between its floor and full brightness", () => {
    for (let t = 0; t < 60_000; t += 1000 / 12) {
      const level = flame(t);
      assert.ok(level >= FLAME_FLOOR && level <= 1, `${level} at ${t}ms`);
    }
  });

  it("actually flickers", () => {
    const levels = new Set<number>();
    for (let t = 0; t < 2000; t += 1000 / 12) {
      levels.add(Math.round(flame(t) * 100));
    }
    assert.ok(levels.size > 10, `only ${levels.size} distinct levels`);
  });

  it("dips toward its floor when the candle gutters", () => {
    assert.ok(flame(7300 + 190) < flame(7300 - 500));
  });

  it("burns brighter than the rind even at its dimmest", () => {
    const stem: string[] = [
      PumpkinTone.StemHighlight,
      PumpkinTone.Stem,
      PumpkinTone.StemShade,
    ];
    const brightestRind = Math.max(
      ...Object.values(pumpkinSprite.pixels)
        .filter((hex) => !stem.includes(hex))
        .map((hex) => luma(hexToRgb(hex))),
    );
    const dimmestFlame = luma(candleColor(FLAME_FLOOR));
    assert.ok(
      dimmestFlame - brightestRind >= 15,
      `flame ${dimmestFlame.toFixed(0)} vs rind ${brightestRind.toFixed(0)}`,
    );
  });
});
