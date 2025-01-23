import fs from "fs";
import { DataTypes, SceneName } from "../types";

const defaultData: DataTypes = {
  panel: {
    name: "My Moonclock",
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

function loadPersistedData(): Partial<DataTypes> {
  const dbFile = getDatabaseName();
  try {
    const file = fs.readFileSync(`./${dbFile}`).toString();
    return JSON.parse(file);
  } catch {
    console.log(`${dbFile} not found, loading default data`);
    return JSON.parse(JSON.stringify(defaultData));
  }
}

export function getData(): DataTypes {
  const db = loadPersistedData();
  return JSON.parse(JSON.stringify(db));
}

export function set<T>(key: keyof DataTypes, value: T) {
  const db = loadPersistedData();

  if (JSON.stringify(db[key]) === JSON.stringify(value)) {
    return;
  }

  db[key] = JSON.parse(JSON.stringify(value));
  fs.writeFileSync(getDatabaseName(), JSON.stringify(db, null, 2));
}

export function writeDb(db: DataTypes) {
  fs.writeFileSync(getDatabaseName(), JSON.stringify(db, null, 2));
}
