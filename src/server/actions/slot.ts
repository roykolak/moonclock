"use server";

import { revalidatePath } from "next/cache";
import { getData, setData } from "../db";
import { Slot } from "@/types";
import { getEndDate } from "@/helpers/getEndDate";
import { redirect } from "next/navigation";
import { formDataToPreset } from "../helpers";

export async function updateSlot(slot: Slot | null) {
  setData({ slot });
  revalidatePath("/panel");
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

  await setData({ slot });

  revalidatePath("/panel");
}

export async function createCustomSlottedPreset(formData: FormData) {
  const preset = formDataToPreset(formData);
  const endDate = getEndDate(preset);

  setData({
    slot: {
      preset: { ...preset, name: "Custom" },
      endTime: endDate ? endDate.toJSON() : null,
    },
  });

  redirect("/panel");
}
