import { describe, it } from "node:test";
import assert from "node:assert";
import { scenes } from "./catalog";

// Snapshot of expected ids. A rename here orphans any persisted DB row
// naming the old id — this failing loudly is the point.
const EXPECTED_IDS = ["blank", "moon", "cat"];

describe("scene catalog", () => {
  it("has exactly the expected, stable set of ids", () => {
    assert.deepEqual(scenes.map((s) => s.id).sort(), [...EXPECTED_IDS].sort());
  });

  it("every scene has a draw function", () => {
    for (const scene of scenes) {
      assert.equal(typeof scene.draw, "function", scene.id);
    }
  });
});
