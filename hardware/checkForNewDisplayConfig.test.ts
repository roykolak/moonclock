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

  it("writes a timestamp to lastHeartBeat.txt", async () => {
    const date = new Date();
    date.setMinutes(date.getMinutes() - 1);

    const slot = {
      endTime: date.toJSON(),
      preset: {
        name: "bedtime",
        scene: { layers: [{ sceneName: SceneName.Moon }] },
      } as Preset,
    };

    setData({ slot, presets: [], panel: defaultData.panel });

    await checkForNewDisplayConfig();

    const lastHeartBeat = fs
      .readFileSync(`./hardware/lastHeartbeat.txt`)
      .toString();

    assert.equal(lastHeartBeat, "2025-01-04T12:40:02.614Z");
  });

  describe("when the currentSlot is not set", () => {
    it("sets the currentSlot and returns updates", async () => {
      const date = new Date();
      date.setHours(date.getHours() + 1);

      const slot = {
        endTime: date.toJSON(),
        preset: {
          name: "bedtime",
          scene: { layers: [{ sceneName: SceneName.Moon }] },
        } as Preset,
      };

      setData({
        slot,
        presets: [],
        panel: defaultData.panel,
        currentHardwareScene: defaultData.panel.defaultPreset.scene,
      });

      const displayConfig = await checkForNewDisplayConfig();

      assert.equal(
        (await getData())?.slot?.preset.scene.layers[0].sceneName,
        "moon"
      );
      assert.deepEqual(displayConfig, [
        {
          macroConfig: {},
          macroName: "moon",
        },
      ]);
    });
  });

  describe("when the currentSlot is set", () => {
    describe("when the endTime is in the future", () => {
      it("does not clear the slot or return updates", async () => {
        const date = new Date();
        date.setHours(date.getHours() + 1);

        const slot = {
          endTime: date.toJSON(),
          preset: {
            name: "bedtime",
            scene: { layers: [{ sceneName: SceneName.Moon }] },
          } as Preset,
        };

        setData({
          slot,
          presets: [],
          panel: defaultData.panel,
          currentHardwareScene: slot.preset.scene,
        });

        const displayConfig = await checkForNewDisplayConfig();

        assert.equal(
          (await getData())?.slot?.preset.scene.layers[0].sceneName,
          "moon"
        );
        assert.equal(displayConfig, null);
      });
    });

    describe("when the endTime is in the past", () => {
      it("clears the slot and returns a reset update", async () => {
        const date = new Date();
        date.setMinutes(date.getMinutes() - 1);

        const slot = {
          endTime: date.toJSON(),
          preset: {
            name: "bedtime",
            scene: { layers: [{ sceneName: SceneName.Moon }] },
          } as Preset,
        };

        setData({
          slot,
          presets: [],
          panel: defaultData.panel,
        });

        const displayConfig = await checkForNewDisplayConfig();

        console.log({ displayConfig });

        assert.equal((await getData())?.slot, null);
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
