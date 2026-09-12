import { describe, it } from "node:test";
import assert from "node:assert";
import { scenes, selectableScenes } from "./catalog";
import { SceneId } from "./types";

// Snapshot of expected ids. A rename here orphans any persisted DB row
// naming the old id — this failing loudly is the point.
const EXPECTED_IDS = ["blank", "moon", "cat", "flip-clock", "setup"];

describe("scene catalog", () => {
  it("has exactly the expected, stable set of ids", () => {
    assert.deepEqual(scenes.map((s) => s.id).sort(), [...EXPECTED_IDS].sort());
  });

  it("every scene has a draw function", () => {
    for (const scene of scenes) {
      assert.equal(typeof scene.draw, "function", scene.id);
    }
  });

  it("still renders blank so existing presets and the default resolve", () => {
    assert.ok(scenes.some((s) => s.id === SceneId.Blank));
  });

  it("does not offer blank or the setup pattern as a choice", () => {
    assert.ok(!selectableScenes.some((s) => s.id === SceneId.Blank));
    assert.ok(!selectableScenes.some((s) => s.id === SceneId.Setup));
  });

  it("offers every other scene", () => {
    const unlisted: string[] = [SceneId.Blank, SceneId.Setup];
    assert.deepEqual(
      selectableScenes.map((s) => s.id).sort(),
      scenes
        .map((s) => s.id)
        .filter((id) => !unlisted.includes(id))
        .sort(),
    );
  });
});
