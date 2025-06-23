"use server";

import { getData, setData } from "../db";
import { Preset } from "@/types";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";

export async function updatePreset(preset: Preset) {
  const { presets } = await getData();

  const index = presets.findIndex((p) => preset.id === p.id);
  presets[index] = preset;
  setData({ presets });

  revalidatePath("/presets");
}

export async function createPreset(preset: Preset) {
  const { presets } = await getData();

  const newPresets = [...presets];
  newPresets.push({
    id: randomUUID(),
    ...preset,
  });
  setData({ presets: newPresets });

  revalidatePath("/presets");
}

export async function deletePreset(id: string) {
  const { presets } = await getData();

  const index = presets.findIndex((p) => id === p.id);

  const newPresets = [...presets];
  newPresets.splice(index, 1);
  setData({ presets: newPresets });

  revalidatePath("/presets");
}
