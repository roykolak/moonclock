import { getData, setData } from "@/server/db";
import { Macro } from "../src/display-engine";
import { Preset, PresetField } from "@/types";
import { transformPresetToDisplayMacros } from "@/server/actions/transformPresetToDisplayMacros";

function sceneMatch(preset1: Preset | null, preset2: Preset | null) {
  return JSON.stringify(preset1?.scenes) === JSON.stringify(preset2?.scenes);
}

function getSceneName(preset: Preset | null) {
  return preset?.scenes?.[0].sceneName;
}

export async function checkForNewDisplayConfig(currentPreset: Preset): Promise<{
  preset: Preset;
  renderedAt: string;
  displayConfig: Macro[];
} | null> {
  try {
    const { scheduledPreset, panel } = await getData();

    if (!scheduledPreset?.preset) {
      if (!sceneMatch(currentPreset, panel.defaultPreset)) {
        console.log(
          `[HARDWARE] Default Preset change, rerendering (${getSceneName(
            currentPreset
          )} to ${getSceneName(panel.defaultPreset)})`
        );

        const preset = panel.defaultPreset;
        const renderedAt = new Date().toJSON();
        const displayConfig = await transformPresetToDisplayMacros(preset);

        return { displayConfig, preset, renderedAt };
      }

      return null;
    }

    if (
      scheduledPreset.endTime !== null &&
      new Date().getTime() > new Date(scheduledPreset.endTime).getTime()
    ) {
      console.log(
        `[HARDWARE] ${scheduledPreset.preset.name} has expired, clearing`
      );

      const preset = panel.defaultPreset;
      const renderedAt = new Date().toJSON();
      const displayConfig = await transformPresetToDisplayMacros(preset);

      await setData({ scheduledPreset: null });

      return { displayConfig, preset, renderedAt };
    }

    if (!sceneMatch(scheduledPreset.preset, currentPreset)) {
      console.log(
        `[HARDWARE] Rendering ${
          scheduledPreset.preset[PresetField.Name]
        } until ${scheduledPreset.endTime}`
      );

      const preset = scheduledPreset.preset;
      const renderedAt = new Date().toJSON();
      const displayConfig = await transformPresetToDisplayMacros(preset);

      return { displayConfig, preset, renderedAt };
    }
  } catch (e) {
    console.log("Error!", e);
  }

  return null;
}
