import { getData, setData } from "@/server/db";
import { Macro } from "../src/display-engine";
import { PresetField, Scene } from "@/types";
import fs from "fs";
import { transformPresetToDisplayMacros } from "@/server/actions/transformPresetToDisplayMacros";

function sceneMatch(scene1: Scene, scene2: Scene) {
  return JSON.stringify(scene1) === JSON.stringify(scene2);
}

function getSceneName(scene: Scene) {
  return scene.layers[0].sceneName;
}

export async function checkForNewDisplayConfig(): Promise<Macro[] | null> {
  try {
    fs.writeFileSync("./hardware/lastHeartbeat.txt", new Date().toJSON());

    const { scheduledPreset, panel, hardware } = await getData();

    if (!scheduledPreset?.preset) {
      if (!sceneMatch(hardware.scene, panel.defaultPreset.scene)) {
        console.log(
          `[RERENDER] Default Preset change (${getSceneName(
            hardware.scene
          )} to ${getSceneName(panel.defaultPreset.scene)})`
        );

        await setData({
          hardware: {
            scene: panel.defaultPreset.scene,
            renderedAt: new Date().toJSON(),
          },
        });

        return transformPresetToDisplayMacros(panel.defaultPreset);
      }

      return null;
    }

    if (
      scheduledPreset.endTime !== null &&
      new Date().getTime() > new Date(scheduledPreset.endTime).getTime()
    ) {
      console.log(`[CLEAR] ${scheduledPreset.preset.name} has expired`);

      await setData({
        scheduledPreset: null,
        hardware: {
          scene: panel.defaultPreset.scene,
          renderedAt: new Date().toJSON(),
        },
      });

      return transformPresetToDisplayMacros(panel.defaultPreset);
    }

    if (!sceneMatch(scheduledPreset?.preset?.scene, hardware.scene)) {
      console.log(
        `[UPDATE] Rerendering ${
          scheduledPreset.preset[PresetField.Name]
        } until ${scheduledPreset.endTime}`
      );

      await setData({
        hardware: {
          scene: scheduledPreset.preset.scene,
          renderedAt: new Date().toJSON(),
        },
      });
      return transformPresetToDisplayMacros(scheduledPreset.preset);
    }
  } catch (e) {
    console.log("Error!", e);
  }

  return null;
}
