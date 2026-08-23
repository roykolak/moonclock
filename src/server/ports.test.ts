import { afterEach, describe, it } from "node:test";
import assert from "node:assert";
import { appPort, hardwarePort, hardwareUrl } from "./ports";

afterEach(() => {
  delete process.env.MOONCLOCK_APP_PORT;
  delete process.env.MOONCLOCK_HARDWARE_PORT;
});

describe("ports", () => {
  it("serves the installed device's ports when nothing is set", () => {
    assert.strictEqual(appPort(), 80);
    assert.strictEqual(hardwarePort(), 3001);
    assert.strictEqual(
      hardwareUrl("/api/reload"),
      "http://localhost:3001/api/reload",
    );
  });

  it("lets a second local instance move off them", () => {
    process.env.MOONCLOCK_APP_PORT = "3010";
    process.env.MOONCLOCK_HARDWARE_PORT = "3011";

    assert.strictEqual(appPort(), 3010);
    assert.strictEqual(hardwarePort(), 3011);
    assert.strictEqual(
      hardwareUrl("/api/peers"),
      "http://localhost:3011/api/peers",
    );
  });

  it("falls back rather than binding nothing when the value is junk", () => {
    process.env.MOONCLOCK_APP_PORT = "not-a-port";
    process.env.MOONCLOCK_HARDWARE_PORT = "0";

    assert.strictEqual(appPort(), 80);
    assert.strictEqual(hardwarePort(), 3001);
  });
});
