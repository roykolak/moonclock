"use server";

import fs from "fs";
import { revalidatePath } from "next/cache";
import { Panel, Preset, PresetField, Slot } from "../types";
import { getData, setData } from "./db";
import { getEndDate } from "@/helpers/getEndDate";
import { redirect } from "next/navigation";

export async function setPanel(panel: Panel) {
  setData({ panel });
  revalidatePath("/panel");
}

export async function setSlot(slot: Slot | null) {
  setData({ slot });
  revalidatePath("/panel");
}

export async function setPresets(presets: Preset[]) {
  setData({ presets });
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

export async function updateCustomSceneData({
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

export async function updatePreset(index: number, formData: FormData) {
  const { presets } = await getData();

  presets[index] = formDataToPreset(formData);
  await setPresets(presets);

  redirect("/presets");
}

export async function createPreset(formData: FormData) {
  const { presets } = await getData();

  const newPresets = [...presets];
  newPresets.push(formDataToPreset(formData));
  await setPresets(newPresets);

  redirect("/presets");
}

export async function createCustomSlottedPreset(formData: FormData) {
  const preset = formDataToPreset(formData);
  const endDate = getEndDate(preset);

  setSlot({
    preset: { ...preset, name: "Custom" },
    endTime: endDate ? endDate.toJSON() : null,
  });

  redirect("/panel");
}

export async function deletePreset(index: number) {
  const { presets } = await getData();
  const newPresets = [...presets];
  newPresets.splice(index, 1);
  await setPresets(newPresets);
  redirect("/presets");
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
