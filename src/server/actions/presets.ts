"use server";

import { redirect } from "next/navigation";
import { getData, setData } from "../db";
import { formDataToPreset } from "../helpers";

export async function updatePreset(index: number, formData: FormData) {
  const { presets } = await getData();

  presets[index] = formDataToPreset(formData);
  setData({ presets });

  redirect("/presets");
}

export async function createPreset(formData: FormData) {
  const { presets } = await getData();

  const newPresets = [...presets];
  newPresets.push(formDataToPreset(formData));
  setData({ presets: newPresets });

  redirect("/presets");
}

export async function deletePreset(index: number) {
  const { presets } = await getData();

  const newPresets = [...presets];
  newPresets.splice(index, 1);
  setData({ presets: newPresets });

  redirect("/presets");
}
