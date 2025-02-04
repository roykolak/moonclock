import { getData, setData } from "@/server/db";
import { Macro } from "../src/display-engine";
import { PresetField } from "@/types";
import fs from "fs";
import { transformPresetToDisplayMacros } from "@/server/actions/transformPresetToDisplayMacros";

export async function checkForNewDisplayConfig(): Promise<Macro[] | null> {
  try {
    fs.writeFileSync("./hardware/lastHeartbeat.txt", new Date().toJSON());

    const { slot, panel, currentHardwareScene } = await getData();

    if (!slot) {
      if (
        currentHardwareScene.layers[0].sceneName !==
        panel.defaultPreset.scene.layers[0].sceneName
      ) {
        console.log(`[RERENDER] Default Preset change`);

        await setData({
          currentHardwareScene: panel.defaultPreset.scene,
        });
        return transformPresetToDisplayMacros(panel.defaultPreset);
      }

      return null;
    }

    if (
      slot?.endTime !== null &&
      new Date().getTime() > new Date(slot.endTime).getTime()
    ) {
      console.log(`[CLEAR] ${slot.preset.name} has expired`);

      await setData({
        slot: null,
        currentHardwareScene: panel.defaultPreset.scene,
      });

      return transformPresetToDisplayMacros(panel.defaultPreset);
    }

    if (
      slot?.preset.scene.layers[0].sceneName !==
      currentHardwareScene.layers[0].sceneName
    ) {
      console.log(
        `[UPDATE] Rerendering ${slot?.preset[PresetField.Name]} until ${
          slot?.endTime
        }`
      );

      await setData({ currentHardwareScene: slot.preset.scene });
      return transformPresetToDisplayMacros(slot.preset);
    }
  } catch (e) {
    console.log("Error!", e);
  }

  return null;
}
