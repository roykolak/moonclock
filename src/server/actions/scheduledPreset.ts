"use server";

import { revalidatePath } from "next/cache";
import { getData, setData } from "../db";
import { Preset, ScheduledPreset } from "@/types";
import { getEndDate } from "@/helpers/getEndDate";
import { reloadHardware } from "../utils";

export async function updateScheduledPreset(
  scheduledPreset: Partial<ScheduledPreset>
) {
  setData({
    scheduledPreset: {
      updatedAt: new Date().toJSON(),
      preset: null,
      endTime: null,
      ...scheduledPreset,
    },
  });

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

  await setData({
    scheduledPreset: {
      ...scheduledPreset,
      endTime: newEnd.toJSON(),
      updatedAt: new Date().toJSON(),
    },
  });

  revalidatePath("/panel");
}

export async function createCustomScheduledPreset(preset: Preset) {
  const endDate = getEndDate(preset);

  setData({
    scheduledPreset: {
      preset: { ...preset },
      endTime: endDate ? endDate.toJSON() : null,
      updatedAt: new Date().toJSON(),
    },
  });

  reloadHardware();

  revalidatePath("/panel");
}
