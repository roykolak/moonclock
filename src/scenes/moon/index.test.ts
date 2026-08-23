import { describe, it } from "node:test";
import assert from "node:assert";
import { lunarPhase, phaseSprite } from "./index";
import {
  MOON_SHADOW_TONE,
  MOON_TERMINATOR_TONE,
  MoonTone,
  moonSprite,
} from "./sprite";

const DAYS_TOLERANCE = 0.6 / 29.530588853;

function offBy(phase: number, target: number): number {
  return Math.min(
    Math.abs(phase - target),
    Math.abs(phase - target - 1),
    Math.abs(phase - target + 1),
  );
}

const shadowTones = new Set(Object.values(MOON_SHADOW_TONE));

function tally(phase: number) {
  const pixels = phaseSprite(phase).pixels;
  let lit = 0;
  let shadowed = 0;
  for (const key in pixels) {
    if (shadowTones.has(pixels[key])) shadowed++;
    else lit++;
  }
  return { lit, shadowed, pixels };
}

describe("lunarPhase", () => {
  it("lands on new moon at known new moons", () => {
    for (const iso of [
      "2024-01-11T11:57Z",
      "2024-12-01T06:21Z",
      "2025-01-29T12:36Z",
    ]) {
      assert.ok(
        offBy(lunarPhase(Date.parse(iso)), 0) < DAYS_TOLERANCE,
        `${iso} -> ${lunarPhase(Date.parse(iso))}`,
      );
    }
  });

  it("lands on full moon at known full moons", () => {
    for (const iso of [
      "2024-01-25T17:54Z",
      "2025-01-13T22:27Z",
      "2026-08-28T04:18Z",
    ]) {
      assert.ok(
        offBy(lunarPhase(Date.parse(iso)), 0.5) < DAYS_TOLERANCE,
        `${iso} -> ${lunarPhase(Date.parse(iso))}`,
      );
    }
  });

  it("stays within [0, 1) for dates before the epoch", () => {
    const phase = lunarPhase(Date.parse("1969-07-20T20:17Z"));
    assert.ok(phase >= 0 && phase < 1, `${phase}`);
  });
});

describe("phaseSprite", () => {
  it("draws every pixel of the disc at every phase", () => {
    const expected = Object.keys(moonSprite.pixels).sort();
    for (let step = 0; step < 24; step++) {
      const keys = Object.keys(phaseSprite(step / 24).pixels).sort();
      assert.deepEqual(keys, expected, `phase ${step / 24}`);
    }
  });

  it("lights the whole disc at full moon", () => {
    const { shadowed } = tally(0.5);
    assert.equal(shadowed, 0);
  });

  it("shadows the whole disc at new moon", () => {
    const { lit } = tally(0);
    assert.equal(lit, 0);
  });

  it("lights the right half at first quarter", () => {
    const { pixels } = tally(0.25);
    const radius = moonSprite.width / 2;
    for (const key in pixels) {
      const [x] = key.split(":").map(Number);
      const dx = x + 0.5 - radius;
      if (dx > 1.5) assert.ok(!shadowTones.has(pixels[key]), `lit ${key}`);
      if (dx < -1.5) assert.ok(shadowTones.has(pixels[key]), `dark ${key}`);
    }
  });

  it("mirrors first quarter at last quarter", () => {
    const first = tally(0.25);
    const last = tally(0.75);
    assert.equal(first.lit, last.shadowed);
    assert.equal(first.shadowed, last.lit);
  });

  it("only ever paints tones from the declared palette", () => {
    const allowed = new Set<string>([
      ...Object.values(MoonTone),
      ...shadowTones,
      MOON_TERMINATOR_TONE,
    ]);
    for (let step = 0; step < 24; step++) {
      const { pixels } = tally(step / 24);
      for (const key in pixels) {
        assert.ok(allowed.has(pixels[key]), `${key} -> ${pixels[key]}`);
      }
    }
  });
});
