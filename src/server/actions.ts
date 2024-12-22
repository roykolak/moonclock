"use server";

import fs from "fs";
import { revalidatePath } from "next/cache";
import { Preset, Scene, Slot } from "../types";
import { get, set } from "./db";

export async function getActiveSlot() {
  return get<Slot>("activeSlot");
}

export async function setActiveSlot(slot: Slot | null) {
  set("activeSlot", slot);
  revalidatePath("/panel");
}

export async function getPresets() {
  return get<Preset[]>("presets");
}

export async function setPresets(presets: Preset[]) {
  set("presets", presets);
  revalidatePath("/panel");
}

export async function setScene({ name, coordinates }: Scene) {
  const fileName = `./scenes/${name}.json`;
  fs.writeFileSync(fileName, JSON.stringify(coordinates, null, 2));
}

export async function getScenes(): Promise<Scene[]> {
  return fs.readdirSync("./scenes").map((file) => {
    const name = file.split(".")[0];
    const coordinates = JSON.parse(
      fs.readFileSync(`./scenes/${name}.json`).toString()
    );
    return { name, coordinates };
  });
}

export async function changeEndTime(minuteChange: number) {
  const activeSlot = await getActiveSlot();

  if (!activeSlot) {
    return revalidatePath("/panel");
  }

  if (activeSlot.endTime === null) return;

  const newEnd = new Date(activeSlot.endTime);
  newEnd.setMinutes(newEnd.getMinutes() + minuteChange);

  activeSlot.endTime = newEnd.toJSON();

  await setActiveSlot(activeSlot);
}
