import fs from "fs";
import { DataTypes } from "../types";

function loadPersistedData(): Partial<DataTypes> {
  try {
    const file = fs.readFileSync(`./database.json`).toString();
    return JSON.parse(file);
  } catch (e) {
    console.log("Error loading db, falling back. ", e);
    return {
      activeSlot: null,
      presets: [
        {
          name: "Sleep Mode",
          sceneName: "moon",
          mode: "until",
          end: {
            hour: 7,
            minute: 0,
            day: 1,
          },
        },
      ],
    };
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
  fs.writeFileSync("database.json", JSON.stringify(db, null, 2));
}
