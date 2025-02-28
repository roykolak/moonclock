"use server";

import { revalidatePath } from "next/cache";
import { getData, setData } from "../db";
import { Panel } from "@/types";
import { reloadHardware } from "../utils";

function hardwareReloadNeeded(newPanel: Panel, oldPanel: Panel) {
  return newPanel.brightness !== oldPanel.brightness;
}

export async function updatePanel(newPanel: Panel) {
  const { panel: oldPanel } = getData();

  setData({
    panel: {
      ...newPanel,
      updatedAt: new Date().toJSON(),
    },
  });

  revalidatePath("/panel");

  if (hardwareReloadNeeded(newPanel, oldPanel)) {
    reloadHardware();
  }
}
