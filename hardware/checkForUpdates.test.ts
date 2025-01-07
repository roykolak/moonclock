import fs from "fs";
import { beforeEach, describe, it } from "node:test";
import assert from "node:assert";
import { get, writeDb } from "@/server/db";
import { Slot } from "@/types";
import { checkForUpdates, setCurrentSlot } from "./checkForUpdates";
import timekeeper from "timekeeper";

describe("checkForUpdates", () => {
  beforeEach(() => {
    timekeeper.freeze(new Date(1735994402614));
  });

  it("writes a timestamp to lastHeartBeat.txt", async () => {
    const date = new Date();
    date.setMinutes(date.getMinutes() - 1);

    const slot = {
      endTime: date.toJSON(),
      sceneName: "moon",
    };

    writeDb({ slot, presets: [] });

    await checkForUpdates();

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
        sceneName: "moon",
      };

      writeDb({ slot, presets: [] });

      setCurrentSlot(null);

      const updates = await checkForUpdates();

      assert.equal(get<Slot>("slot")?.sceneName, "moon");
      assert.equal(updates.length, 2);
    });
  });

  describe("when the currentSlot is set", () => {
    describe("when the endTime is in the future", () => {
      it("does not clear the slot or return updates", async () => {
        const date = new Date();
        date.setHours(date.getHours() + 1);

        const slot = {
          endTime: date.toJSON(),
          sceneName: "moon",
        };

        writeDb({ slot, presets: [] });

        setCurrentSlot(slot);

        const updates = await checkForUpdates();

        assert.equal(get<Slot>("slot")?.sceneName, "moon");
        assert.equal(updates.length, 0);
      });
    });

    describe("when the endTime is in the past", () => {
      it("clears the slot and returns a reset update", async () => {
        const date = new Date();
        date.setMinutes(date.getMinutes() - 1);

        const slot = {
          endTime: date.toJSON(),
          sceneName: "moon",
        };

        writeDb({ slot, presets: [] });

        const updates = await checkForUpdates();

        assert.equal(get("slot"), null);
        assert.equal(updates.length, 1);
      });
    });
  });
});
