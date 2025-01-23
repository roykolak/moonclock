"use server";

import fs from "fs";
import { revalidatePath } from "next/cache";
import { Panel, Preset, PresetField, Slot } from "../types";
import { getData, set } from "./db";
import { getEndDate } from "@/helpers/getEndDate";

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

function formDataToPreset(formData: FormData): Preset {
  return {
    mode: formData.get(PresetField.Mode) as any,
    name: formData.get(PresetField.Name) as any,
    scenes: [
      { sceneName: formData.get(`${PresetField.Scenes}.0.sceneName`) as any },
    ],
    untilMinute: formData.get(PresetField.UntilMinute) as any,
    untilDay: "1",
    untilHour: formData.get(PresetField.UntilHour) as any,
    forTime: formData.get(PresetField.ForTime) as any,
  };
}

export async function updatePreset(
  index: number,
  previousState: any,
  formData: FormData
) {
  const { presets } = await getData();

  presets[index] = formDataToPreset(formData);
  await setPresets(presets);

  return "Successfully updated Preset!";
}

export async function createPreset(previousState: any, formData: FormData) {
  console.log("yoo");
  const { presets } = await getData();

  const newPresets = [...presets];
  newPresets.push(formDataToPreset(formData));
  await setPresets(newPresets);

  return "Successfully created Preset!";
}

export async function createCustomSlottedPreset(
  previousState: any,
  formData: FormData
) {
  const preset = formDataToPreset(formData);
  const endDate = getEndDate(preset);

  setSlot({
    preset: { ...preset, name: "Custom" },
    endTime: endDate ? endDate.toJSON() : null,
  });

  return "Successfully set custom preset!";
}

export async function deletePreset(index: number) {
  const { presets } = await getData();
  const newPresets = [...presets];
  newPresets.splice(index, 1);
  await setPresets(newPresets);
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
