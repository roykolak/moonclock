"use server";

import { revalidatePath } from "next/cache";
import { setData } from "../db";
import { Panel } from "@/types";
import { reloadHardware } from "../utils";

export async function updatePanel(newPanel: Panel) {
  setData({
    panel: {
      ...newPanel,
      updatedAt: new Date().toJSON(),
    },
  });

  revalidatePath("/panel");

  reloadHardware();
}
