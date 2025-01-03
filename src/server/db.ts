import fs from "fs";
import { DataTypes } from "../types";

const defaultData: DataTypes = {
  slot: null,
  heartBeat: {
    lastCheckedAt: null,
    lastUpdatedAt: null,
  },
  presets: [
    {
      name: "Sleep Mode",
      sceneName: "moon",
      mode: "until",
      untilDay: "1",
      untilHour: "7",
      untilMinute: "0",
      forTime: "",
    },
    {
      name: "Nap Mode",
      sceneName: "bunny",
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
    ? "database-test.json"
    : "database.json";
}

function loadPersistedData(): Partial<DataTypes> {
  const dbFile = getDatabaseName();
  try {
    const file = fs.readFileSync(`./${dbFile}`).toString();
    return JSON.parse(file);
  } catch (e) {
    console.log(`${dbFile} not found, loading default data`);
    return JSON.parse(JSON.stringify(defaultData));
  }
}

export function get<T>(key: keyof DataTypes): T {
  const db = loadPersistedData();
  return JSON.parse(JSON.stringify(db[key]));
}

export function set<T>(key: keyof DataTypes, value: T) {
  const db = loadPersistedData();

  if (JSON.stringify(db[key]) === JSON.stringify(value)) {
    return;
  }

  db[key] = JSON.parse(JSON.stringify(value));
  fs.writeFileSync(getDatabaseName(), JSON.stringify(db, null, 2));
}
