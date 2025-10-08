import fs from "fs";
import { DataTypes, Preset, SceneName } from "../types";
import { databaseFile } from "./utils";
import { randomUUID } from "crypto";

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
    pwnLsbNanoseconds: 130,
    gpioSlowdown: 4,
    pwmBits: 11,
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
      scenes: [
        {
          sceneName: SceneName.Moon,
          sceneConfig: { animateStarTwinkle: true },
        },
      ],
      mode: "until",
      untilDay: "1",
      untilHour: "7",
      untilMinute: "00",
      forTime: "",
      pinned: true,
    },
    {
      mode: "for",
      name: "Message",
      scenes: [
        {
          sceneName: "message",
          sceneConfig: {
            text: "Hello \nWorld!",
            fontSize: 25,
          },
        },
      ],
      untilMinute: "0",
      untilDay: "0",
      untilHour: "0",
      forTime: "0:05",
      id: randomUUID(),
      pinned: true,
    },
    {
      id: randomUUID(),
      name: "Bunny",
      scenes: [{ sceneName: "bunny", sceneConfig: {} }],
      mode: "for",
      untilDay: "0",
      untilHour: "0",
      untilMinute: "0",
      forTime: "2:00",
      pinned: true,
    },
    {
      id: randomUUID(),
      mode: "for",
      name: "Twinkle",
      scenes: [
        {
          sceneName: "twinkle",
          sceneConfig: {
            color: "#ffffff",
            speed: 30,
            amount: 50,
          },
        },
      ],
      untilMinute: "0",
      untilDay: "0",
      untilHour: "0",
      forTime: "0:05",
      pinned: false,
    },
    {
      id: randomUUID(),
      mode: "for",
      name: "Ripple",
      scenes: [
        {
          sceneName: "ripple",
          sceneConfig: {
            color: "#08a86b",
            speed: 30,
            waveHeight: 1,
          },
        },
      ],
      untilMinute: "0",
      untilDay: "0",
      untilHour: "0",
      forTime: "0:05",
    },
    {
      id: randomUUID(),
      mode: "for",
      name: "Emoji",
      scenes: [
        {
          sceneName: "emoji",
          sceneConfig: {
            name: "smile",
          },
        },
      ],
      untilMinute: "0",
      untilDay: "0",
      untilHour: "0",
      forTime: "0:05",
    },
    {
      id: randomUUID(),
      mode: "for",
      name: "Solid Color",
      scenes: [
        {
          sceneName: "color",
          sceneConfig: {
            color: "#8a1663",
          },
        },
      ],
      untilMinute: "0",
      untilDay: "0",
      untilHour: "0",
      forTime: "0:05",
    },
    {
      id: randomUUID(),
      mode: "for",
      name: "Marquee",
      scenes: [
        {
          sceneName: "marquee",
          sceneConfig: {
            color: "#ffffff",
            speed: 30,
            fontSize: 16,
            text: "hello",
          },
        },
      ],
      untilMinute: "0",
      untilDay: "0",
      untilHour: "0",
      forTime: "0:05",
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
  try {
    const file = fs.readFileSync(dbFile).toString();
    return JSON.parse(file);
  } catch {
    console.log(`trouble loading/parsing ${dbFile}, seeding default data`);
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
