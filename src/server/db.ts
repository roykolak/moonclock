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
    defaultPreset,
    brightness: 30,
    pwnLsbNanoseconds: 130,
    gpioSlowdown: 4,
    pwmBits: 11,
    hardwareMapping: "adafruit-hat",
    // Neutral (library-default) values. These are the ghosting knobs — tune
    // them per panel with hardware/test-matrix.ts rather than guessing here.
    pwmDitherBits: 0,
    limitRefreshRateHz: 0,
    panelType: "",
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
  const file = getDatabaseName();

  // Write to a sibling temp file and rename over the target, rather than
  // truncating the real file in place. rename(2) is atomic within a filesystem,
  // so a reader either sees the whole old file or the whole new one — never a
  // half-written database. That matters because the app is killed by signal on
  // every update restart, and a plain writeFileSync interrupted partway would
  // leave invalid JSON behind, costing the hand-tuned panel config that readDb
  // then backs up and replaces with defaults.
  const tmp = `${file}.${process.pid}.tmp`;

  try {
    fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
    // Set the mode explicitly instead of relying on writeFileSync's `mode`,
    // which is only honoured when the file is created and is masked by umask.
    // The rename replaces the inode, so without this the 666 that install.sh
    // grants database.json would be silently dropped on the first write.
    fs.chmodSync(tmp, 0o666);
    fs.renameSync(tmp, file);
  } catch (e) {
    try {
      fs.unlinkSync(tmp);
    } catch {}
    throw e;
  }
}

export function getData() {
  return readDb();
}

export function setData(data: Partial<DataTypes>) {
  const db = readDb();
  writeDb({ ...db, ...data });
}
