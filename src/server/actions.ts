"use server";

import { coordinates, SceneName } from "@bigdots-io/display-engine";
import fs from "fs";
import { revalidatePath } from "next/cache";
import { Panel, Preset, Slot } from "../types";
import { DataKey, get, set } from "./db";

export async function getPanel(): Promise<Panel> {
  const activeSlot = get(DataKey.ActiveSlot);

  return {
    activeSlot,
    macros: [
      coordinates({
        coordinates: await getSceneData(activeSlot?.scene || "nothing"),
      }),
    ],
  };
}

export async function getPresets() {
  return get(DataKey.Presets);
}

export async function setActiveSlot(slot: Slot | null) {
  set(DataKey.ActiveSlot, slot);
  revalidatePath("/");
}

export async function setPresets(presets: Preset[]) {
  set(DataKey.Presets, presets);
  revalidatePath("/");
}

export async function changeEndTime(minuteChange: number) {
  const activeSlot = get(DataKey.ActiveSlot);

  if (!activeSlot) {
    return revalidatePath("/");
  }

  if (activeSlot.endTime === null) return;

  const newEnd = new Date(activeSlot.endTime);
  newEnd.setMinutes(newEnd.getMinutes() + minuteChange);

  activeSlot.endTime = newEnd.toJSON();

  set(DataKey.ActiveSlot, activeSlot);

  revalidatePath("/");
}

export async function getSceneData(name: string) {
  const file = fs.readFileSync(`./scenes/${name}.json`).toString();
  return JSON.parse(file);
}

export async function setSceneData(
  name: string,
  coordinates: { [k: string]: string }
) {
  const fileName = `./scenes/${name}.json`;
  fs.writeFileSync(fileName, JSON.stringify(coordinates, null, 2));
}

export async function getAllSceneData() {
  return fs.readdirSync("./scenes").map((file) => {
    const name = file.split(".")[0] as SceneName;
    const coordinates = JSON.parse(
      fs.readFileSync(`./scenes/${name}.json`).toString()
    );
    return { name, coordinates };
  });
}
