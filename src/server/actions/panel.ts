"use server";

import { revalidatePath } from "next/cache";
import { getData, setData } from "../db";
import { Panel, PanelField } from "@/types";
import { reloadHardware } from "../utils";

function hardwareReloadNeeded(newPanel: Panel, oldPanel: Panel) {
  return (
    newPanel[PanelField.Brightness] !== oldPanel[PanelField.Brightness] ||
    newPanel[PanelField.GpioSlowdown] !== oldPanel[PanelField.GpioSlowdown] ||
    newPanel[PanelField.PwnLsbNanoseconds] !==
      oldPanel[PanelField.PwnLsbNanoseconds]
  );
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
