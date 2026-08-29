import { describe, it } from "node:test";
import assert from "node:assert";
import { STAR_MARGIN, STARS, lunarPhase, phaseSprite } from "./index";
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

  it("waxes to full then wanes back to new", () => {
    const STEPS = 24;
    const lit = Array.from(
      { length: STEPS },
      (_, step) => tally(step / STEPS).lit,
    );
    for (let step = 1; step <= STEPS / 2; step++) {
      assert.ok(
        lit[step] > lit[step - 1],
        `waxing stalled at ${step}/${STEPS}`,
      );
    }
    for (let step = STEPS / 2 + 1; step < STEPS; step++) {
      assert.ok(
        lit[step] < lit[step - 1],
        `waning stalled at ${step}/${STEPS}`,
      );
    }
  });

  it("shows the same sliver of light waxing and waning", () => {
    for (const phase of [1 / 24, 3 / 24, 5 / 24, 7 / 24, 9 / 24, 11 / 24]) {
      assert.equal(tally(1 - phase).lit, tally(phase).lit, `phase ${phase}`);
    }
  });

  it("opens the crescent on the right waxing and on the left waning", () => {
    const radius = moonSprite.width / 2;
    const litSides = (phase: number) => {
      const { pixels } = tally(phase);
      const sides = new Set<string>();
      for (const key in pixels) {
        if (shadowTones.has(pixels[key])) continue;
        const [x] = key.split(":").map(Number);
        sides.add(x + 0.5 - radius > 0 ? "right" : "left");
      }
      return [...sides];
    };
    assert.deepEqual(litSides(1 / 24), ["right"]);
    assert.deepEqual(litSides(23 / 24), ["left"]);
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

describe("star field", () => {
  const PANEL = 32;

  it("keeps every star inside the panel's safe area", () => {
    for (const star of STARS) {
      const edge = Math.min(
        star.x,
        PANEL - 1 - star.x,
        star.y,
        PANEL - 1 - star.y,
      );
      assert.ok(edge >= STAR_MARGIN, `(${star.x},${star.y}) is ${edge}px in`);
    }
  });

  it("never places a star on the moon", () => {
    const origin = Math.floor((PANEL - moonSprite.width) / 2);
    const disc = new Set(
      Object.keys(moonSprite.pixels).map((key) => {
        const [x, y] = key.split(":").map(Number);
        return `${x + origin}:${y + origin}`;
      }),
    );
    for (const star of STARS) {
      assert.ok(!disc.has(`${star.x}:${star.y}`), `(${star.x},${star.y})`);
    }
  });
});
