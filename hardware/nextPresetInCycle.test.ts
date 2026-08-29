import { describe, it } from "node:test";
import assert from "node:assert";
import { nextPresetInCycle } from "./nextPresetInCycle";
import type { Preset } from "@/types";

function preset(overrides: Partial<Preset> = {}): Preset {
  return {
    id: "moon-id",
    name: "Moon",
    mode: "for",
    untilDay: "0",
    untilHour: "0",
    untilMinute: "00",
    forTime: "1:00",
    sceneId: "moon",
    ...overrides,
  };
}

const moon = preset();
const cat = preset({ id: "cat-id", name: "Cat", sceneId: "cat" });
const presets = [moon, cat];

describe("nextPresetInCycle", () => {
  it("walks the presets in order and then clears", () => {
    assert.strictEqual(nextPresetInCycle(presets, null), moon);
    assert.strictEqual(nextPresetInCycle(presets, moon), cat);
    assert.strictEqual(nextPresetInCycle(presets, cat), null);
  });

  it("advances from a preset the web UI selected, not from a press count", () => {
    assert.strictEqual(nextPresetInCycle(presets, cat), null);
    assert.strictEqual(nextPresetInCycle(presets, moon), cat);
  });

  it("restarts the cycle when the active preset is no longer in the list", () => {
    const deleted = preset({ id: "gone-id", name: "Ghost" });

    assert.strictEqual(nextPresetInCycle(presets, deleted), moon);
  });

  it("matches on id, so a rename keeps its place in the cycle", () => {
    const renamed = preset({ id: "moon-id", name: "Moonrise" });

    assert.strictEqual(nextPresetInCycle(presets, renamed), cat);
  });

  it("falls back to the name when either preset has no id", () => {
    const withoutIds = [preset({ id: undefined }), cat];

    assert.strictEqual(
      nextPresetInCycle(withoutIds, preset({ id: undefined })),
      cat,
    );
  });

  it("has nothing to cycle to when there are no presets", () => {
    assert.strictEqual(nextPresetInCycle([], null), null);
    assert.strictEqual(nextPresetInCycle([], moon), null);
  });
});
