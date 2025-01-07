import { beforeEach, describe, it } from "node:test";
import { getEndDate } from "./getEndDate";
import { Preset } from "@/types";
import timekeeper from "timekeeper";
import assert from "node:assert";

describe("getEndDate", () => {
  beforeEach(() => {
    timekeeper.freeze(new Date(1735994402614));
  });

  describe("when passed a 'for' preset", () => {
    it("returns an end date built w/ 'for' config", () => {
      const preset: Preset = {
        name: "test preset",
        mode: "for",
        sceneName: "bunny",
        forTime: "2:15",
        untilDay: "0",
        untilHour: "0",
        untilMinute: "0",
      };

      assert.equal(new Date().toJSON(), "2025-01-04T12:40:02.614Z");
      assert.equal(getEndDate(preset)?.toJSON(), "2025-01-04T14:55:00.000Z");
    });
  });

  describe("when passed an 'until' preset", () => {
    it("returns an end date w/ 'until' config", () => {
      const preset: Preset = {
        name: "test preset",
        mode: "until",
        sceneName: "bunny",
        forTime: "",
        untilDay: "1",
        untilHour: "6",
        untilMinute: "30",
      };

      assert.equal(new Date().toJSON(), "2025-01-04T12:40:02.614Z");
      assert.equal(getEndDate(preset)?.toJSON(), "2025-01-05T12:30:00.000Z");
    });
  });
});
