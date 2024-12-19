import { Preset, Slot } from "../types";
import fs from "fs";

function loadPersistedData(): Partial<DataTypes> {
  try {
    const file = fs.readFileSync(`./database.json`).toString();
    return JSON.parse(file);
  } catch {
    return {
      [DataKey.ActiveSlot]: null,
      [DataKey.Presets]: [
        {
          name: "Sleep Mode",
          scene: "moon",
          mode: "until",
          end: {
            hour: 7,
            minute: 0,
            day: 0,
          },
        },
      ],
    };
  }
}

export enum DataKey {
  ActiveSlot = "activeSlot",
  Presets = "presets",
}

export interface DataTypes {
  activeSlot: Slot | null;
  presets: Preset[];
}

export function get<K extends DataKey>(key: K): DataTypes[K] {
  const db = loadPersistedData();
  return JSON.parse(JSON.stringify(db[key]));
}

export function set<K extends DataKey>(key: K, value: DataTypes[K]) {
  const db = loadPersistedData();
  if (JSON.stringify(db[key]) === JSON.stringify(value)) {
    return;
  }

  db[key] = JSON.parse(JSON.stringify(value));
  fs.writeFileSync("database.json", JSON.stringify(db, null, 2));
}
