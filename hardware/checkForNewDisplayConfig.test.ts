import { beforeEach, describe, it } from "node:test";
import assert from "node:assert";
import { defaultData, getData, setData } from "@/server/db";
import { checkForNewDisplayConfig } from "./checkForNewDisplayConfig";
import timekeeper from "timekeeper";
import { Preset } from "@/types";
import { SceneId } from "@/scenes/types";

describe("checkForUpdates", () => {
  beforeEach(() => {
    timekeeper.freeze(new Date(1735994402614));
  });

  describe("while setup holds a test pattern lease", () => {
    const currentHardwarePreset = {
      name: "bedtime",
      sceneId: SceneId.Moon,
    } as Preset;

    function leaseUntil(offsetMs: number) {
      setData({
        setup: {
          completedAt: null,
          testPatternUntil: new Date(Date.now() + offsetMs).toJSON(),
        },
        scheduledPreset: {
          endTime: null,
          preset: currentHardwarePreset,
        },
        presets: [],
        panel: defaultData.panel,
      });
    }

    it("takes the panel over from whatever was scheduled", async () => {
      leaseUntil(30000);

      const { scene, preset } =
        (await checkForNewDisplayConfig(currentHardwarePreset)) || {};

      assert.equal(preset?.sceneId, "setup-test-pattern");
      assert.equal(typeof scene?.draw, "function");
    });

    it("holds the pattern rather than redrawing it every poll", async () => {
      leaseUntil(30000);

      const { preset } =
        (await checkForNewDisplayConfig(currentHardwarePreset)) || {};

      assert.equal(await checkForNewDisplayConfig(preset!), null);
    });

    it("hands the panel back once the lease has run out", async () => {
      leaseUntil(-1000);

      const { preset } =
        (await checkForNewDisplayConfig({
          sceneId: "setup-test-pattern",
        } as Preset)) || {};

      assert.equal(preset?.sceneId, currentHardwarePreset.sceneId);
    });
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
          sceneId: SceneId.Moon,
        } as Preset;

        const { scene, preset } =
          (await checkForNewDisplayConfig(currentHardwarePreset)) || {};

        assert.equal(preset?.sceneId, "blank");
        assert.equal(typeof scene?.draw, "function");
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
          sceneId: SceneId.Moon,
        } as Preset;

        setData({
          scheduledPreset: {
            endTime: date.toJSON(),
            preset: currentHardwarePreset,
          },
          presets: [],
          panel: defaultData.panel,
        });

        const result = await checkForNewDisplayConfig(currentHardwarePreset);

        const { scheduledPreset } = await getData();

        assert.equal(scheduledPreset?.preset?.sceneId, "moon");
        assert.equal(result, null);
      });
    });

    describe("when the endTime is in the past", () => {
      it("clears the slot and sets the hardware scene to the default preset", async () => {
        const date = new Date();
        date.setMinutes(date.getMinutes() - 1);

        const currentHardwarePreset = {
          name: "bedtime",
          sceneId: SceneId.Moon,
        } as Preset;

        setData({
          scheduledPreset: {
            endTime: date.toJSON(),
            preset: currentHardwarePreset,
          },
          presets: [],
          panel: defaultData.panel,
        });

        const { scene, preset } =
          (await checkForNewDisplayConfig(currentHardwarePreset)) || {};

        const { scheduledPreset } = await getData();

        assert.equal(scheduledPreset, null);
        assert.deepEqual(preset, defaultData.panel.defaultPreset);
        assert.equal(typeof scene?.draw, "function");
      });
    });
  });
});
