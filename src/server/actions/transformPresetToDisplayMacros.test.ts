import { beforeEach, describe, it } from "node:test";
import { Preset, SceneName } from "@/types";
import timekeeper from "timekeeper";
import assert from "node:assert";
import { transformPresetToDisplayMacros } from "./transformPresetToDisplayMacros";

describe("transformPresetToDisplayConfig", () => {
  beforeEach(() => {
    timekeeper.freeze(new Date(1735994402614));
  });

  it("returns countdown macro config", async () => {
    const preset: Preset = {
      name: "test preset",
      mode: "for",
      scene: { layers: [{ sceneName: SceneName.Countdown }] },
      forTime: "0:05",
      untilDay: "0",
      untilHour: "0",
      untilMinute: "0",
    };

    const displayConfig = await transformPresetToDisplayMacros(preset);

    assert.equal(displayConfig.length, 1);
    assert.equal(displayConfig[0].macroName, "countdown");
    assert.equal(!!displayConfig[0].macroConfig.endDate, true);
  });

  it("returns moon macro config", async () => {
    const preset: Preset = {
      name: "test preset",
      mode: "for",
      scene: { layers: [{ sceneName: SceneName.Moon }] },
      forTime: "0:05",
      untilDay: "0",
      untilHour: "0",
      untilMinute: "0",
    };

    const displayConfig = await transformPresetToDisplayMacros(preset);

    assert.deepEqual(displayConfig, [
      {
        macroConfig: {},
        macroName: "moon",
      },
    ]);
  });

  it("returns blank macro config", async () => {
    const preset: Preset = {
      name: "test preset",
      mode: "for",
      scene: { layers: [{ sceneName: SceneName.Blank }] },
      forTime: "0:05",
      untilDay: "0",
      untilHour: "0",
      untilMinute: "0",
    };

    const displayConfig = await transformPresetToDisplayMacros(preset);

    assert.deepEqual(displayConfig, [
      {
        macroConfig: {
          backgroundColor: "#000000",
        },
        macroName: "box",
      },
    ]);
  });

  it("returns bunny macro config", async () => {
    const preset: Preset = {
      name: "test preset",
      mode: "for",
      scene: { layers: [{ sceneName: "bunny" }] },
      forTime: "0:05",
      untilDay: "0",
      untilHour: "0",
      untilMinute: "0",
    };

    const displayConfig = await transformPresetToDisplayMacros(preset);

    assert.equal(displayConfig[0].macroName, "coordinates");
    assert.equal(
      Object.keys(displayConfig[0].macroConfig.coordinates).length,
      471
    );
  });

  it("returns missing macro config", async () => {
    const preset: Preset = {
      name: "test preset",
      mode: "for",
      scene: { layers: [{ sceneName: "Bu33y" }] },
      forTime: "0:05",
      untilDay: "0",
      untilHour: "0",
      untilMinute: "0",
    };

    const displayConfig = await transformPresetToDisplayMacros(preset);

    assert.equal(displayConfig[0].macroName, "text");
    assert.equal(displayConfig[0].macroConfig.text, "?");
  });
});
