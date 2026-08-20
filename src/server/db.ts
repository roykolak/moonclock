import fs from "fs";
import { DataTypes, Preset } from "../types";
import { SceneId } from "../scenes/types";
import { databaseFile } from "./utils";
import { randomUUID } from "crypto";

const defaultPreset: Preset = {
  name: "Default",
  sceneId: SceneId.Blank,
  mode: "for",
  untilDay: "0",
  untilHour: "0",
  untilMinute: "00",
  forTime: "0:00",
};

export const defaultData: DataTypes = {
  panel: {
    name: "My Moonclock",
    timeAdjustmentAmount: "5",
    defaultPreset,
    brightness: 30,
    pwnLsbNanoseconds: 130,
    gpioSlowdown: 4,
    pwmBits: 11,
    hardwareMapping: "adafruit-hat",
    buttonEnabled: false,
    updateChannel: "stable",
  },
  scheduledPreset: {
    preset: null,
    endTime: null,
  },
  nextVersion: null,
  presets: [
    {
      id: randomUUID(),
      name: "Moon",
      sceneId: SceneId.Moon,
      mode: "until",
      untilDay: "1",
      untilHour: "7",
      untilMinute: "00",
      forTime: "",
      pinned: true,
    },
    {
      id: randomUUID(),
      name: "Bunny",
      sceneId: SceneId.Bunny,
      mode: "for",
      untilDay: "0",
      untilHour: "0",
      untilMinute: "0",
      forTime: "2:00",
      pinned: false,
    },
  ],
};

function getDatabaseName() {
  return process.env["APP_ENV"] === "test"
    ? "./database-test.json"
    : databaseFile();
}

function readDb(): DataTypes {
  const dbFile = getDatabaseName();

  let raw = "";
  try {
    raw = fs.readFileSync(dbFile).toString();
  } catch {
    console.log(`[DB] ${dbFile} missing; seeding default data`);
    writeDb(defaultData);
    return JSON.parse(JSON.stringify(defaultData));
  }

  // install.sh `touch`es an empty database.json on first boot — that's
  // expected and should seed silently, not be treated as corruption.
  if (raw.trim() === "") {
    writeDb(defaultData);
    return JSON.parse(JSON.stringify(defaultData));
  }

  try {
    return JSON.parse(raw);
  } catch {
    // Don't silently overwrite a non-empty file that failed to parse —
    // it may hold hand-tuned Panel fields (pwmBits, gpioSlowdown,
    // hardwareMapping, ...) that are genuinely annoying to re-tune.
    // Preset data is cheap (it's just the seed above); Panel tuning isn't.
    const backupFile = `${dbFile}.corrupt-${Date.now()}`;
    try {
      fs.writeFileSync(backupFile, raw, { mode: 0o666 });
      console.error(
        `[DB] ${dbFile} failed to parse; original preserved at ${backupFile}, seeding defaults`,
      );
    } catch {
      console.error(
        `[DB] ${dbFile} failed to parse and could not be backed up; seeding defaults`,
      );
    }
    writeDb(defaultData);
    return JSON.parse(JSON.stringify(defaultData));
  }
}

function writeDb(db: DataTypes) {
  fs.writeFileSync(getDatabaseName(), JSON.stringify(db, null, 2), {
    mode: 0o776,
  });
}

export function getData() {
  return readDb();
}

export function setData(data: Partial<DataTypes>) {
  const db = readDb();
  writeDb({ ...db, ...data });
}
