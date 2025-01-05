import { beforeEach, describe, it } from "node:test";
import { Preset } from "@/types";
import tk from "timekeeper";
import assert from "node:assert";
import { getFriendlyEndTime } from "./getFriendlyEndTime";

describe("getFriendlyEndTime", () => {
  beforeEach(() => {
    tk.freeze(new Date(1735994402614));
  });

  describe("when passed a 'for' preset", () => {
    describe("when the timeEnd is '0:0'", () => {
      it("returns a friend end time of 'Forever'", () => {
        const preset: Preset = {
          name: "test preset",
          mode: "for",
          sceneName: "bunny",
          forTime: "0:0",
          untilDay: "0",
          untilHour: "0",
          untilMinute: "0",
        };

        assert.equal(getFriendlyEndTime(preset), "Forever");
      });
    });

    describe("when the timeEnd is just has minutes set", () => {
      it("returns a friend end time just referencing minutes", () => {
        const preset: Preset = {
          name: "test preset",
          mode: "for",
          sceneName: "bunny",
          forTime: "0:15",
          untilDay: "0",
          untilHour: "0",
          untilMinute: "0",
        };

        assert.equal(getFriendlyEndTime(preset), "For 15 minutes");
      });
    });

    describe("when the timeEnd is just has hours set", () => {
      it("returns a friend end time just referencing hours", () => {
        const preset: Preset = {
          name: "test preset",
          mode: "for",
          sceneName: "bunny",
          forTime: "2:00",
          untilDay: "0",
          untilHour: "0",
          untilMinute: "0",
        };

        assert.equal(getFriendlyEndTime(preset), "For 2 hours");
      });
    });

    describe("when the timeEnd has hours and minutes set", () => {
      it("returns a friend end time referencing hours and minutes", () => {
        const preset: Preset = {
          name: "test preset",
          mode: "for",
          sceneName: "bunny",
          forTime: "2:23",
          untilDay: "0",
          untilHour: "0",
          untilMinute: "0",
        };

        assert.equal(getFriendlyEndTime(preset), "For 2 hours & 23 mins");
      });
    });
  });

  describe("when passed an 'until' preset", () => {
    it("returns an 'until' friendly end time", () => {
      const preset: Preset = {
        name: "test preset",
        mode: "until",
        sceneName: "bunny",
        forTime: "",
        untilDay: "1",
        untilHour: "6",
        untilMinute: "30",
      };

      assert.equal(getFriendlyEndTime(preset), "Until 6:30 AM tomorrow");
    });
  });
});
