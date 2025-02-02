import fs from "fs";
import { DataTypes, SceneName } from "../types";

export const defaultData: DataTypes = {
  panel: {
    name: "My Moonclock",
    defaultPreset: {
      name: "Default",
      scenes: [{ sceneName: SceneName.Blank }],
      mode: "for",
      untilDay: "0",
      untilHour: "0",
      untilMinute: "00",
      forTime: "0:00",
    },
  },
  slot: null,
  presets: [
    {
      name: "Sleep Mode",
      scenes: [{ sceneName: SceneName.Moon }],
      mode: "until",
      untilDay: "1",
      untilHour: "7",
      untilMinute: "00",
      forTime: "",
    },
    {
      name: "Nap Mode",
      scenes: [{ sceneName: "bunny" }],
      mode: "for",
      untilDay: "0",
      untilHour: "0",
      untilMinute: "0",
      forTime: "2:00",
    },
    {
      name: "Timeout",
      scenes: [{ sceneName: SceneName.Countdown }],
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
  fs.writeFileSync(getDatabaseName(), JSON.stringify(db, null, 2));
}

export function getData(): DataTypes {
  return readDb();
}

export function setData(data: Partial<DataTypes>) {
  const db = readDb();
  writeDb({ ...db, ...data });
}
