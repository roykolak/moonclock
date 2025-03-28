import { getData, setData } from "@/server/db";
import { Macro } from "../src/display-engine";
import { Preset, PresetField } from "@/types";
import fs from "fs";
import { transformPresetToDisplayMacros } from "@/server/actions/transformPresetToDisplayMacros";
import { heartBeatFile } from "@/server/utils";

function sceneMatch(preset1: Preset | null, preset2: Preset | null) {
  return JSON.stringify(preset1?.scenes) === JSON.stringify(preset2?.scenes);
}

function getSceneName(preset: Preset | null) {
  return preset?.scenes?.[0].sceneName;
}

export async function checkForNewDisplayConfig(): Promise<Macro[] | null> {
  try {
    fs.writeFileSync(heartBeatFile(), new Date().toJSON(), {
      mode: 0o776,
    });

    const { scheduledPreset, panel, hardware } = await getData();

    if (!scheduledPreset?.preset) {
      if (!sceneMatch(hardware?.preset, panel.defaultPreset)) {
        console.log(
          `[RERENDER] Default Preset change (${getSceneName(
            hardware?.preset
          )} to ${getSceneName(panel.defaultPreset)})`
        );

        const preset = panel.defaultPreset;
        const renderedAt = new Date().toJSON();

        await setData({ hardware: { preset, renderedAt } });

        return transformPresetToDisplayMacros(preset);
      }

      return null;
    }

    if (
      scheduledPreset.endTime !== null &&
      new Date().getTime() > new Date(scheduledPreset.endTime).getTime()
    ) {
      console.log(`[CLEAR] ${scheduledPreset.preset.name} has expired`);

      const preset = panel.defaultPreset;
      const renderedAt = new Date().toJSON();

      await setData({
        scheduledPreset: null,
        hardware: { preset, renderedAt },
      });

      return transformPresetToDisplayMacros(preset);
    }

    if (!sceneMatch(scheduledPreset.preset, hardware.preset)) {
      console.log(
        `[UPDATE] Rerendering ${
          scheduledPreset.preset[PresetField.Name]
        } until ${scheduledPreset.endTime}`
      );

      const preset = scheduledPreset.preset;
      const renderedAt = new Date().toJSON();

      await setData({ hardware: { preset, renderedAt } });

      return transformPresetToDisplayMacros(preset);
    }
  } catch (e) {
    console.log("Error!", e);
  }

  return null;
}
