import { getData, set } from "@/server/db";
import { Macro } from "../shared/display-engine";
import { PresetField, Slot } from "@/types";
import fs from "fs";
import { transformSlotToDisplayConfig } from "@/helpers/transformSlotToDisplayConfig";

export function setDisplayedSlot(slot: Slot | null) {
  displayedSlot = slot;
}

let displayedSlot: Slot | null = null;

export async function checkForNewDisplayConfig(): Promise<Macro[] | null> {
  try {
    fs.writeFileSync("./hardware/lastHeartbeat.txt", new Date().toJSON());

    const { slot } = await getData();

    if (!slot) return [];

    if (
      slot?.endTime !== null &&
      new Date().getTime() > new Date(slot.endTime).getTime()
    ) {
      console.log(`[CLEAR] ${slot.preset.name} has expired`);
      await set("slot", null);

      return [];
    }

    if (slot?.preset.sceneName !== displayedSlot?.preset.sceneName) {
      console.log(
        `[UPDATE] Rerendering ${slot?.preset[PresetField.Name]} until ${
          slot?.endTime
        }`
      );

      setDisplayedSlot(slot);

      return transformSlotToDisplayConfig(slot.preset);
    } else if (displayedSlot?.endTime !== slot?.endTime) {
      console.log(
        `[UPDATE] ${slot?.preset[PresetField.Name]} endTime changed to ${
          slot.endTime
        }`
      );

      setDisplayedSlot(slot);
    }
  } catch (e) {
    console.log("Error!", e);
  }

  return null;
}
