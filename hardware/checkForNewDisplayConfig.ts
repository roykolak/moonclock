import { getData, setData } from "@/server/db";
import { Macro } from "../src/display-engine";
import { PresetField, Scene } from "@/types";
import fs from "fs";
import { transformPresetToDisplayMacros } from "@/server/actions/transformPresetToDisplayMacros";

function sceneMatch(scene1: Scene, scene2: Scene) {
  return JSON.stringify(scene1) === JSON.stringify(scene2);
}

export async function checkForNewDisplayConfig(): Promise<Macro[] | null> {
  try {
    fs.writeFileSync("./hardware/lastHeartbeat.txt", new Date().toJSON());

    const { scheduledPreset, panel, hardwareScene } = await getData();

    if (!scheduledPreset) {
      if (!sceneMatch(hardwareScene, panel.defaultPreset.scene)) {
        console.log(`[RERENDER] Default Preset change`);

        await setData({ hardwareScene: panel.defaultPreset.scene });

        return transformPresetToDisplayMacros(panel.defaultPreset);
      }

      return null;
    }

    if (
      scheduledPreset?.endTime !== null &&
      new Date().getTime() > new Date(scheduledPreset.endTime).getTime()
    ) {
      console.log(`[CLEAR] ${scheduledPreset.preset.name} has expired`);

      await setData({
        scheduledPreset: null,
        hardwareScene: panel.defaultPreset.scene,
      });

      return transformPresetToDisplayMacros(panel.defaultPreset);
    }

    if (!sceneMatch(scheduledPreset.preset.scene, hardwareScene)) {
      console.log(
        `[UPDATE] Rerendering ${
          scheduledPreset?.preset[PresetField.Name]
        } until ${scheduledPreset?.endTime}`
      );

      await setData({ hardwareScene: scheduledPreset.preset.scene });
      return transformPresetToDisplayMacros(scheduledPreset.preset);
    }
  } catch (e) {
    console.log("Error!", e);
  }

  return null;
}
