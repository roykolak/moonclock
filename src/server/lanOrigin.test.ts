import { describe, it } from "node:test";
import assert from "node:assert";
import { isLanOrigin } from "./lanOrigin";

describe("isLanOrigin", () => {
  it("accepts the origins another clock's app is served from", () => {
    assert.ok(isLanOrigin("http://moonclock-2.local"));
    assert.ok(isLanOrigin("http://192.168.1.42"));
    assert.ok(isLanOrigin("http://10.0.0.5:80"));
    assert.ok(isLanOrigin("http://172.20.3.4"));
    assert.ok(isLanOrigin("http://localhost:3000"));
    assert.ok(isLanOrigin("http://[fd00::1]"));
  });

  it("rejects the open web, so a visited page can't drive the clock", () => {
    assert.ok(!isLanOrigin("https://example.com"));
    assert.ok(!isLanOrigin("http://8.8.8.8"));
    assert.ok(!isLanOrigin("http://172.32.0.1"));
    assert.ok(!isLanOrigin("http://moonclock.local.example.com"));
  });

  it("rejects a missing or unparseable origin", () => {
    assert.ok(!isLanOrigin(null));
    assert.ok(!isLanOrigin(""));
    assert.ok(!isLanOrigin("null"));
  });
});
