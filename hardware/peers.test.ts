import { describe, it } from "node:test";
import assert from "node:assert";
import { collectDevices, toDevice } from "./peers";

function service(overrides = {}) {
  return {
    name: "moonclock-2",
    host: "moonclock-2.local",
    port: 80,
    addresses: ["192.168.1.42", "fe80::1"],
    txt: {
      id: "peer-id",
      name: "Bedroom",
      version: "0.97.0",
      hardwarePort: "3001",
    },
    ...overrides,
  };
}

describe("toDevice", () => {
  it("maps an advertised service onto a device", () => {
    assert.deepStrictEqual(toDevice(service()), {
      id: "peer-id",
      name: "Bedroom",
      version: "0.97.0",
      host: "moonclock-2.local",
      address: "192.168.1.42",
      port: 80,
      hardwarePort: 3001,
    });
  });

  it("ignores services that carry no device id", () => {
    assert.strictEqual(toDevice(service({ txt: { name: "Bedroom" } })), null);
    assert.strictEqual(toDevice(service({ txt: undefined })), null);
  });

  it("falls back to the hostname when no name is advertised", () => {
    assert.strictEqual(
      toDevice(service({ txt: { id: "peer-id" } }))?.name,
      "moonclock-2",
    );
  });

  it("drops the trailing dot mDNS puts on a hostname", () => {
    assert.strictEqual(
      toDevice(service({ host: "moonclock-2.local." }))?.host,
      "moonclock-2.local",
    );
  });

  it("takes the control server's port from the record", () => {
    assert.strictEqual(
      toDevice(service({ txt: { id: "peer-id", hardwarePort: "3011" } }))
        ?.hardwarePort,
      3011,
    );
  });

  it("assumes the installed port when the record doesn't say", () => {
    assert.strictEqual(
      toDevice(service({ txt: { id: "peer-id" } }))?.hardwarePort,
      3001,
    );
    assert.strictEqual(
      toDevice(service({ txt: { id: "peer-id", hardwarePort: "nonsense" } }))
        ?.hardwarePort,
      3001,
    );
  });

  it("skips link-local addresses, which no browser can reach", () => {
    assert.strictEqual(
      toDevice(service({ addresses: ["169.254.7.7", "192.168.1.42"] }))
        ?.address,
      "192.168.1.42",
    );
    assert.strictEqual(
      toDevice(service({ addresses: ["169.254.7.7"] }))?.address,
      null,
    );
  });
});

describe("collectDevices", () => {
  it("leaves this clock out of its own peer list", () => {
    const devices = collectDevices(
      [service(), service({ txt: { id: "self-id", name: "Kitchen" } })],
      "self-id",
    );

    assert.deepStrictEqual(
      devices.map((device) => device.id),
      ["peer-id"],
    );
  });

  it("keeps one entry per device when a record is seen twice", () => {
    const devices = collectDevices([service(), service()], "self-id");

    assert.strictEqual(devices.length, 1);
  });

  it("sorts by name so the switcher order is stable", () => {
    const devices = collectDevices(
      [
        service({ txt: { id: "c", name: "Nursery" } }),
        service({ txt: { id: "a", name: "Bedroom" } }),
        service({ txt: { id: "b", name: "Living room" } }),
      ],
      "self-id",
    );

    assert.deepStrictEqual(
      devices.map((device) => device.name),
      ["Bedroom", "Living room", "Nursery"],
    );
  });
});
