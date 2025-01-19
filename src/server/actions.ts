"use server";

import fs from "fs";
import { revalidatePath } from "next/cache";
import { Panel, Preset, Slot } from "../types";
import { set } from "./db";

export async function setPanel(panel: Panel | null) {
  set("panel", panel);
  revalidatePath("/panel");
}

export async function setSlot(slot: Slot | null) {
  set("slot", slot);
  revalidatePath("/panel");
}

export async function setPresets(presets: Preset[]) {
  set("presets", presets);
  revalidatePath("/presets");
}

export async function getCustomScenes() {
  return fs.readdirSync("./custom_scenes").map((file) => {
    const name = file.split(".")[0];
    const coordinates = JSON.parse(
      fs.readFileSync(`./custom_scenes/${name}.json`).toString()
    );
    return { name, coordinates };
  });
}

export async function setCustomSceneData({
  name,
  coordinates,
}: {
  name: string;
  coordinates: { [k: string]: string };
}) {
  const fileName = `./custom_scenes/${name}.json`;
  fs.writeFileSync(fileName, JSON.stringify(coordinates, null, 2));
}

export async function getLastHeartbeat() {
  try {
    return fs.readFileSync(`./hardware/lastHeartbeat.txt`).toString();
  } catch {
    return null;
  }
}
