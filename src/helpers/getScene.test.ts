import { describe, it } from "node:test";
import assert from "node:assert";
import { getScene } from "./getScene";
import { moonScene } from "@/scenes/moon";

describe("getScene", () => {
  it("returns null for a missing or empty id", () => {
    assert.equal(getScene(undefined), null);
    assert.equal(getScene(null), null);
    assert.equal(getScene(""), null);
  });

  it("returns the matching scene for a known id", () => {
    assert.equal(getScene("moon"), moonScene);
  });

  it("returns a visible fallback (not null) for an id that doesn't match any scene", () => {
    const scene = getScene("not-a-real-scene");
    assert.equal(typeof scene?.draw, "function");

    const calls: string[] = [];
    const fakeCtx = {
      set textBaseline(_v: string) {},
      set font(_v: string) {},
      set fillStyle(_v: string) {},
      fillText: (text: string) => calls.push(text),
    } as unknown as CanvasRenderingContext2D;

    assert.doesNotThrow(() =>
      scene!.draw({
        ctx: fakeCtx,
        dimensions: { width: 32, height: 32 },
        elapsed: 0,
        state: undefined,
      }),
    );
    assert.deepEqual(calls, ["?"]);
  });
});
