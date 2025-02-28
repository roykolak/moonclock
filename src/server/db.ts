import fs from "fs";
import { DataTypes, Preset, SceneName } from "../types";

const defaultPreset: Preset = {
  name: "Default",
  scenes: [{ sceneName: SceneName.Blank, sceneConfig: {} }],
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
  },
  scheduledPreset: {
    preset: null,
    endTime: null,
  },
  hardware: {
    preset: defaultPreset,
  },
  presets: [
    {
      name: "Sleep Mode",
      scenes: [{ sceneName: SceneName.Moon, sceneConfig: {} }],
      mode: "until",
      untilDay: "1",
      untilHour: "7",
      untilMinute: "00",
      forTime: "",
    },
    {
      name: "Nap Mode",
      scenes: [{ sceneName: "bunny", sceneConfig: {} }],
      mode: "for",
      untilDay: "0",
      untilHour: "0",
      untilMinute: "0",
      forTime: "2:00",
    },
    {
      name: "Timeout",
      scenes: [{ sceneName: SceneName.Countdown, sceneConfig: {} }],
      mode: "for",
      untilDay: "0",
      untilHour: "0",
      untilMinute: "0",
      forTime: "0:05",
    },
  ],
};

function getDatabaseName() {
  return process.env["APP_ENV"] === "test"
    ? "database-test.json"
    : "database.json";
}

function readDb(): DataTypes {
  const dbFile = getDatabaseName();
  try {
    const file = fs.readFileSync(`./${dbFile}`).toString();
    return JSON.parse(file);
  } catch {
    console.log(`${dbFile} not found, loading default data`);
    return JSON.parse(JSON.stringify(defaultData));
  }
}

function writeDb(db: DataTypes) {
  fs.writeFileSync(getDatabaseName(), JSON.stringify(db, null, 2), {
    mode: 0o776,
  });
}

export function getData(): DataTypes {
  return readDb();
}

export function setData(data: Partial<DataTypes>) {
  const db = readDb();
  writeDb({ ...db, ...data });
}
