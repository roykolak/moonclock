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
      scenes: [{ sceneName: SceneName.Countdown, sceneConfig: {} }],
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

  it("returns emoji macro config", async () => {
    const preset: Preset = {
      name: "test preset",
      mode: "for",
      scenes: [{ sceneName: SceneName.Emoji, sceneConfig: { emoji: "☕️" } }],
      forTime: "0:05",
      untilDay: "0",
      untilHour: "0",
      untilMinute: "0",
    };

    const displayConfig = await transformPresetToDisplayMacros(preset);

    assert.equal(displayConfig.length, 1);
    assert.equal(displayConfig[0].macroName, "text");
    assert.equal(displayConfig[0].macroConfig.text, "☕️");
  });

  it("returns marquee macro config", async () => {
    const preset: Preset = {
      name: "test preset",
      mode: "for",
      scenes: [
        { sceneName: SceneName.Marquee, sceneConfig: { text: "hello friend" } },
      ],
      forTime: "0:05",
      untilDay: "0",
      untilHour: "0",
      untilMinute: "0",
    };

    const displayConfig = await transformPresetToDisplayMacros(preset);

    assert.equal(displayConfig.length, 1);
    assert.equal(displayConfig[0].macroName, "marquee");
    assert.equal(displayConfig[0].macroConfig.text, "hello friend");
  });

  it("returns twinkle macro config", async () => {
    const preset: Preset = {
      name: "test preset",
      mode: "for",
      scenes: [
        {
          sceneName: SceneName.Twinkle,
          sceneConfig: { amount: 5, speed: 75, color: "#ff0000" },
        },
      ],
      forTime: "0:05",
      untilDay: "0",
      untilHour: "0",
      untilMinute: "0",
    };

    const displayConfig = await transformPresetToDisplayMacros(preset);

    assert.equal(displayConfig.length, 1);
    assert.equal(displayConfig[0].macroName, "twinkle");
    assert.equal(displayConfig[0].macroConfig.amount, 50);
    assert.equal(displayConfig[0].macroConfig.speed, 13.5);
    assert.equal(displayConfig[0].macroConfig.color, "#ff0000");
  });

  it("returns moon macro config", async () => {
    const preset: Preset = {
      name: "test preset",
      mode: "for",
      scenes: [{ sceneName: SceneName.Moon, sceneConfig: {} }],
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
      scenes: [{ sceneName: SceneName.Blank, sceneConfig: {} }],
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
      scenes: [{ sceneName: "bunny", sceneConfig: {} }],
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
      scenes: [{ sceneName: "Bu33y", sceneConfig: {} }],
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
