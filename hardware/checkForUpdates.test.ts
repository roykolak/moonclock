// import fs from "fs";
// import { beforeEach, describe, it } from "node:test";
// import assert from "node:assert";
// import { getData, writeDb } from "@/server/db";
// import { checkForUpdates, setCurrentSlot } from "./checkForUpdates";
// import timekeeper from "timekeeper";

// describe.skip("checkForUpdates", () => {
//   beforeEach(() => {
//     timekeeper.freeze(new Date(1735994402614));
//   });

//   it("writes a timestamp to lastHeartBeat.txt", async () => {
//     const date = new Date();
//     date.setMinutes(date.getMinutes() - 1);

//     const slot = {
//       name: "bedtime",
//       endTime: date.toJSON(),
//       sceneName: "moon",
//     };

//     writeDb({ slot, presets: [], panel: { name: "moonclock" } });

//     await checkForUpdates();

//     const lastHeartBeat = fs
//       .readFileSync(`./hardware/lastHeartbeat.txt`)
//       .toString();

//     assert.equal(lastHeartBeat, "2025-01-04T12:40:02.614Z");
//   });

//   describe("when the currentSlot is not set", () => {
//     it("sets the currentSlot and returns updates", async () => {
//       const date = new Date();
//       date.setHours(date.getHours() + 1);

//       const slot = {
//         name: "bedtime",
//         endTime: date.toJSON(),
//         sceneName: "moon",
//       };

//       writeDb({ slot, presets: [], panel: { name: "moonclock" } });

//       setCurrentSlot(null);

//       const updates = await checkForUpdates();

//       assert.equal((await getData())?.slot?.sceneName, "moon");
//       assert.equal(updates.length, 2);
//     });
//   });

//   describe("when the currentSlot is set", () => {
//     describe("when the endTime is in the future", () => {
//       it("does not clear the slot or return updates", async () => {
//         const date = new Date();
//         date.setHours(date.getHours() + 1);

//         const slot = {
//           name: "bedtime",
//           endTime: date.toJSON(),
//           sceneName: "moon",
//         };

//         writeDb({ slot, presets: [], panel: { name: "moonclock" } });

//         setCurrentSlot(slot);

//         const updates = await checkForUpdates();

//         assert.equal((await getData())?.slot?.sceneName, "moon");
//         assert.equal(updates.length, 0);
//       });
//     });

//     describe("when the endTime is in the past", () => {
//       it("clears the slot and returns a reset update", async () => {
//         const date = new Date();
//         date.setMinutes(date.getMinutes() - 1);

//         const slot = {
//           name: "bedtime",
//           endTime: date.toJSON(),
//           sceneName: "moon",
//         };

//         writeDb({ slot, presets: [], panel: { name: "moonclock" } });

//         const updates = await checkForUpdates();

//         assert.equal((await getData())?.slot, null);
//         assert.equal(updates.length, 1);
//       });
//     });
//   });
// });
