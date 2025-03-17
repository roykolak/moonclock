"use server";

import { revalidatePath } from "next/cache";
import { getData, setData } from "../db";
import { Panel, PanelField } from "@/types";
import { reloadHardware } from "../utils";

const propsThatReloadHardware = [
  PanelField.Brightness,
  PanelField.GpioSlowdown,
  PanelField.PwnLsbNanoseconds,
  PanelField.PwmBits,
];

function hardwareReloadNeeded(newPanel: Panel, oldPanel: Panel) {
  return propsThatReloadHardware.some(
    (prop) => newPanel[prop] !== oldPanel[prop]
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
