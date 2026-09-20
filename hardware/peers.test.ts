import { describe, it } from "node:test";
import assert from "node:assert";
import {
  advertisedName,
  collectDevices,
  createPeerDirectory,
  PeerBrowser,
  toDevice,
} from "./peers";

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

describe("advertisedName", () => {
  it("separates two clocks that share the installed hostname", () => {
    assert.notStrictEqual(
      advertisedName("moonclock", "3f2a91b4-1c2d-4e5f-8a9b-0c1d2e3f4a5b"),
      advertisedName("moonclock", "7d8e9f01-2a3b-4c5d-6e7f-8a9b0c1d2e3f"),
    );
  });

  it("keeps the hostname readable ahead of the device id", () => {
    assert.strictEqual(
      advertisedName("moonclock", "3f2a91b4-1c2d-4e5f-8a9b-0c1d2e3f4a5b"),
      "moonclock-3f2a91b4",
    );
  });

  it("stays a single dns label when the hostname is qualified", () => {
    assert.strictEqual(
      advertisedName("moonclock.lan", "3f2a91b4-1c2d-4e5f-8a9b-0c1d2e3f4a5b"),
      "moonclock-3f2a91b4",
    );
  });

  it("falls back to the hostname when there is no device id", () => {
    assert.strictEqual(advertisedName("moonclock", ""), "moonclock");
  });
});

describe("createPeerDirectory", () => {
  function browsers(...listings: string[][]) {
    const opened: Array<PeerBrowser & { stopped: boolean }> = [];

    const open = () => {
      const browser = {
        services: (listings[opened.length] ?? []).map((id) => ({
          txt: { id },
        })),
        stopped: false,
        stop() {
          browser.stopped = true;
        },
      };
      opened.push(browser);
      return browser;
    };

    return { open, opened };
  }

  function ids(directory: { services: { txt?: { [k: string]: unknown } }[] }) {
    return directory.services.map((service) => service.txt?.id);
  }

  it("keeps serving the clocks it knows while the next browse settles", () => {
    const { open } = browsers(["a", "b"], ["a"]);
    const directory = createPeerDirectory(open);

    directory.startRefresh();

    assert.deepStrictEqual(ids(directory), ["a", "b"]);
  });

  it("drops a clock that stopped answering once the browse settles", () => {
    const { open } = browsers(["a", "b"], ["a"]);
    const directory = createPeerDirectory(open);

    directory.startRefresh();
    directory.finishRefresh();

    assert.deepStrictEqual(ids(directory), ["a"]);
  });

  it("picks up a clock that only answered the second browse", () => {
    const { open } = browsers([], ["c"]);
    const directory = createPeerDirectory(open);

    directory.startRefresh();
    directory.finishRefresh();

    assert.deepStrictEqual(ids(directory), ["c"]);
  });

  it("closes the browse it replaces rather than leaving it listening", () => {
    const { open, opened } = browsers(["a"], ["a"]);
    const directory = createPeerDirectory(open);

    directory.startRefresh();
    directory.finishRefresh();

    assert.strictEqual(opened[0].stopped, true);
    assert.strictEqual(opened[1].stopped, false);
  });

  it("abandons a settling browse rather than stacking them up", () => {
    const { open, opened } = browsers(["a"], ["b"], ["c"]);
    const directory = createPeerDirectory(open);

    directory.startRefresh();
    directory.startRefresh();
    directory.finishRefresh();

    assert.strictEqual(opened[1].stopped, true);
    assert.deepStrictEqual(ids(directory), ["c"]);
  });

  it("stays put when nothing is settling", () => {
    const { open } = browsers(["a"], ["b"]);
    const directory = createPeerDirectory(open);

    directory.finishRefresh();

    assert.deepStrictEqual(ids(directory), ["a"]);
  });
});
