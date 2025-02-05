"use server";

import { revalidatePath } from "next/cache";
import { getData, setData } from "../db";
import { Preset, ScheduledPreset } from "@/types";
import { getEndDate } from "@/helpers/getEndDate";

export async function updateScheduledPreset(
  scheduledPreset: ScheduledPreset | null
) {
  setData({ scheduledPreset });
  revalidatePath("/panel");
}

export async function changeEndTime(minuteChange: number) {
  const { scheduledPreset } = await getData();

  if (!scheduledPreset) {
    return revalidatePath("/panel");
  }

  if (scheduledPreset.endTime === null) return;

  const newEnd = new Date(scheduledPreset.endTime);
  newEnd.setMinutes(newEnd.getMinutes() + minuteChange);

  scheduledPreset.endTime = newEnd.toJSON();

  await setData({ scheduledPreset });

  revalidatePath("/panel");
}

export async function createCustomScheduledPreset(preset: Preset) {
  const endDate = getEndDate(preset);

  setData({
    scheduledPreset: {
      preset: { ...preset, name: "Custom" },
      endTime: endDate ? endDate.toJSON() : null,
    },
  });

  revalidatePath("/panel");
}
