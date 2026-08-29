import { afterEach, beforeEach, describe, it } from "node:test";
import assert from "node:assert";
import fs from "fs";
import os from "os";
import path from "path";
import {
  defaultData,
  getData,
  prepareDatabase,
  resetDatabase,
  setData,
} from "./db";

let databaseFile: string;
const previousDatabase = process.env.MOONCLOCK_DATABASE;

beforeEach(() => {
  databaseFile = path.join(
    fs.mkdtempSync(path.join(os.tmpdir(), "moonclock-db-")),
    "database.json",
  );
  process.env.MOONCLOCK_DATABASE = databaseFile;
});

afterEach(() => {
  fs.rmSync(path.dirname(databaseFile), { recursive: true, force: true });
  if (previousDatabase === undefined) {
    delete process.env.MOONCLOCK_DATABASE;
  } else {
    process.env.MOONCLOCK_DATABASE = previousDatabase;
  }
});

function writeLegacyDatabase() {
  const { deviceId, ...withoutDeviceId } = defaultData;
  void deviceId;
  fs.writeFileSync(databaseFile, JSON.stringify(withoutDeviceId));
}

describe("prepareDatabase", () => {
  it("mints and persists an id for a database written before the field existed", () => {
    writeLegacyDatabase();

    const { deviceId } = prepareDatabase();

    assert.ok(deviceId);
    assert.strictEqual(getData().deviceId, deviceId);
  });

  it("is the same id every time it runs", () => {
    writeLegacyDatabase();

    assert.strictEqual(prepareDatabase().deviceId, prepareDatabase().deviceId);
  });

  it("keeps the id a seeded database already has", () => {
    const seeded = getData().deviceId;

    assert.strictEqual(prepareDatabase().deviceId, seeded);
  });

  it("leaves hand-tuned panel fields alone while minting", () => {
    const { deviceId, ...withoutDeviceId } = defaultData;
    void deviceId;
    fs.writeFileSync(
      databaseFile,
      JSON.stringify({
        ...withoutDeviceId,
        panel: {
          ...withoutDeviceId.panel,
          hardwareMapping: "adafruit-hat-pwm",
          pwmBits: 7,
        },
      }),
    );

    prepareDatabase();

    const { panel } = getData();
    assert.strictEqual(panel.hardwareMapping, "adafruit-hat-pwm");
    assert.strictEqual(panel.pwmBits, 7);
  });

  it("settles the whole identity, so nothing is left for a later reader to mint", () => {
    prepareDatabase();

    const first = getData();
    setData({});
    const second = getData();

    assert.ok(first.deviceId);
    assert.strictEqual(first.deviceId, second.deviceId);
    assert.strictEqual(first.panel.name, second.panel.name);
    assert.deepStrictEqual(
      first.presets.map((preset) => preset.id),
      second.presets.map((preset) => preset.id),
    );
  });
});

describe("resetDatabase", () => {
  it("throws away a customized database and seeds the factory one", () => {
    setData({
      panel: { ...getData().panel, name: "Tuned Moonclock", pwmBits: 7 },
      presets: [],
    });

    const fresh = resetDatabase();

    assert.notStrictEqual(fresh.panel.name, "Tuned Moonclock");
    assert.strictEqual(fresh.panel.pwmBits, defaultData.panel.pwmBits);
    assert.deepStrictEqual(
      fresh.presets.map((preset) => preset.name),
      defaultData.presets.map((preset) => preset.name),
    );
    assert.deepStrictEqual(getData(), fresh);
  });

  it("mints a new identity rather than carrying the old one over", () => {
    const before = prepareDatabase().deviceId;

    const after = resetDatabase().deviceId;

    assert.ok(after);
    assert.notStrictEqual(after, before);
    assert.strictEqual(getData().deviceId, after);
  });

  it("seeds a database that is already missing", () => {
    assert.ok(!fs.existsSync(databaseFile));

    const fresh = resetDatabase();

    assert.ok(fresh.deviceId);
    assert.strictEqual(getData().deviceId, fresh.deviceId);
  });
});
