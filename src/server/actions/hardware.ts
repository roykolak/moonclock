"use server";

import { TriggerHardwareReloadScene } from "@/types";
import { setData } from "../db";
import { revalidatePath } from "next/cache";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function reloadHardwareScene() {
  await setData({
    hardware: {
      preset: {
        name: "Trigger Hardware Reload",
        scene: {
          layers: [{ sceneName: TriggerHardwareReloadScene, sceneConfig: {} }],
        },
        mode: "for",
        untilDay: "0",
        untilHour: "0",
        untilMinute: "00",
        forTime: "0:00",
      },
    },
  });

  await sleep(3000);

  revalidatePath("/panel");
}
