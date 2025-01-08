"use server";

import fs from "fs";
import { revalidatePath } from "next/cache";
import { Panel, Preset, Scene, Slot } from "../types";
import { getData, set } from "./db";

export async function setPanel(panel: Panel | null) {
  set("panel", panel);
  revalidatePath("/panel");
}

export async function setSlot(slot: Slot | null) {
  set("slot", slot);
  revalidatePath("/panel");
}

export async function getLastHeartbeat() {
  try {
    return fs.readFileSync(`./hardware/lastHeartbeat.txt`).toString();
  } catch {
    return null;
  }
}

export async function setPresets(presets: Preset[]) {
  set("presets", presets);
  revalidatePath("/presets");
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
  const { slot } = await getData();

  if (!slot) {
    return revalidatePath("/panel");
  }

  if (slot.endTime === null) return;

  const newEnd = new Date(slot.endTime);
  newEnd.setMinutes(newEnd.getMinutes() + minuteChange);

  slot.endTime = newEnd.toJSON();

  await setSlot(slot);
}
