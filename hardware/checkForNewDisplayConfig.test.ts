import fs from "fs";
import { beforeEach, describe, it } from "node:test";
import assert from "node:assert";
import { defaultData, getData, setData } from "@/server/db";
import { checkForNewDisplayConfig } from "./checkForNewDisplayConfig";
import timekeeper from "timekeeper";
import { Preset, SceneName } from "@/types";

describe("checkForUpdates", () => {
  beforeEach(() => {
    timekeeper.freeze(new Date(1735994402614));
  });

  describe("when the currentSlot is not set", () => {
    describe("when the current hardware scene is not the same as the default scene", () => {
      it("updates the current hardware scene", async () => {
        const date = new Date();
        date.setHours(date.getHours() + 1);

        setData({
          scheduledPreset: null,
          presets: [],
          panel: defaultData.panel,
        });

        const currentHardwarePreset = {
          name: "bedtime",
          scenes: [{ sceneName: SceneName.Moon, sceneConfig: {} }],
        } as Preset;

        const { displayConfig, preset } =
          (await checkForNewDisplayConfig(currentHardwarePreset)) || {};

        assert.equal(preset?.scenes[0].sceneName, "blank");
        assert.deepEqual(displayConfig, [
          {
            macroConfig: {
              backgroundColor: "#000000",
            },
            macroName: "box",
          },
        ]);
      });
    });
  });

  describe("when the currentSlot is set", () => {
    describe("when the endTime is in the future", () => {
      it("does not clear the slot or return updates", async () => {
        const date = new Date();
        date.setHours(date.getHours() + 1);

        const currentHardwarePreset = {
          name: "bedtime",
          scenes: [{ sceneName: SceneName.Moon, sceneConfig: {} }],
        } as Preset;

        setData({
          scheduledPreset: {
            endTime: date.toJSON(),
            preset: currentHardwarePreset,
          },
          presets: [],
          panel: defaultData.panel,
        });

        const { displayConfig } =
          (await checkForNewDisplayConfig(currentHardwarePreset)) || {};

        const { scheduledPreset } = await getData();

        assert.equal(scheduledPreset?.preset?.scenes[0].sceneName, "moon");
        assert.equal(displayConfig, null);
      });
    });

    describe("when the endTime is in the past", () => {
      it("clears the slot and sets the hardware scene to the default preset", async () => {
        const date = new Date();
        date.setMinutes(date.getMinutes() - 1);

        const currentHardwarePreset = {
          name: "bedtime",
          scenes: [{ sceneName: SceneName.Moon, sceneConfig: {} }],
        } as Preset;

        setData({
          scheduledPreset: {
            endTime: date.toJSON(),
            preset: currentHardwarePreset,
          },
          presets: [],
          panel: defaultData.panel,
        });

        const { displayConfig, preset } =
          (await checkForNewDisplayConfig(currentHardwarePreset)) || {};

        const { scheduledPreset } = await getData();

        assert.equal(scheduledPreset, null);
        assert.deepEqual(preset, defaultData.panel.defaultPreset);
        assert.deepEqual(displayConfig, [
          {
            macroConfig: {
              backgroundColor: "#000000",
            },
            macroName: "box",
          },
        ]);
      });
    });
  });
});
