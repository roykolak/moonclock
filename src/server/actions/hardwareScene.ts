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
      scene: {
        layers: [{ sceneName: TriggerHardwareReloadScene }],
      },
    },
  });

  await sleep(3000);

  revalidatePath("/panel");
}
