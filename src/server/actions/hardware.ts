"use server";

import { TriggerHardwareReloadScene } from "@/types";
import { setData } from "../db";
import { revalidatePath } from "next/cache";

export async function reloadHardwareScene() {
  await setData({
    hardware: {
      preset: {
        name: "Trigger Hardware Reload",
        scenes: [{ sceneName: TriggerHardwareReloadScene, sceneConfig: {} }],
        mode: "for",
        untilDay: "0",
        untilHour: "0",
        untilMinute: "00",
        forTime: "0:00",
      },
    },
  });

  revalidatePath("/panel");
}
