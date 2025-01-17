import { beforeEach, describe, it } from "node:test";
import { Preset, SceneName } from "@/types";
import timekeeper from "timekeeper";
import assert from "node:assert";
import { transformPresetToDisplayConfig } from "./transformPresetToDisplayConfig";

describe("transformPresetToDisplayConfig", () => {
  beforeEach(() => {
    timekeeper.freeze(new Date(1735994402614));
  });

  it("returns countdown display config", () => {
    const preset: Preset = {
      name: "test preset",
      mode: "for",
      sceneName: SceneName.Countdown,
      forTime: "0:05",
      untilDay: "0",
      untilHour: "0",
      untilMinute: "0",
    };

    const displayConfig = transformPresetToDisplayConfig(preset);

    assert.equal(displayConfig.length, 1);
    assert.equal(displayConfig[0].macroName, "countdown");
    assert.equal(!!displayConfig[0].macroConfig.endDate, true);
  });

  it("returns moon display config", () => {
    const preset: Preset = {
      name: "test preset",
      mode: "for",
      sceneName: SceneName.Moon,
      forTime: "0:05",
      untilDay: "0",
      untilHour: "0",
      untilMinute: "0",
    };

    const displayConfig = transformPresetToDisplayConfig(preset);

    assert.deepEqual(displayConfig, [
      {
        macroConfig: {
          sceneName: "moon",
        },
        macroName: "scene",
      },
    ]);
  });

  it("returns bunny display config", () => {
    const preset: Preset = {
      name: "test preset",
      mode: "for",
      sceneName: SceneName.Bunny,
      forTime: "0:05",
      untilDay: "0",
      untilHour: "0",
      untilMinute: "0",
    };

    const displayConfig = transformPresetToDisplayConfig(preset);

    assert.deepEqual(displayConfig, [
      {
        macroConfig: {
          sceneName: "bunny",
        },
        macroName: "scene",
      },
    ]);
  });
});
