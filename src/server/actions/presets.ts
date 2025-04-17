"use server";

import { getData, setData } from "../db";
import { Preset } from "@/types";
import { revalidatePath } from "next/cache";

export async function updatePreset(index: number, preset: Preset) {
  const { presets } = await getData();

  presets[index] = preset;
  setData({ presets });

  revalidatePath("/presets");
}

export async function createPreset(preset: Preset) {
  const { presets } = await getData();

  const newPresets = [...presets];
  newPresets.push(preset);
  setData({ presets: newPresets });

  revalidatePath("/presets");
}

export async function deletePreset(index: number) {
  const { presets } = await getData();

  const newPresets = [...presets];
  newPresets.splice(index, 1);
  setData({ presets: newPresets });

  revalidatePath("/presets");
}
