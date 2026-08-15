import { getData, setData } from "@/server/db";
import { Scene } from "../src/display-engine";
import { Preset } from "@/types";
import { getScene } from "@/helpers/getScene";

function sceneMatch(preset1: Preset | null, preset2: Preset | null) {
  return preset1?.sceneId === preset2?.sceneId;
}

export async function checkForNewDisplayConfig(currentPreset: Preset): Promise<{
  preset: Preset;
  renderedAt: string;
  scene: Scene | null;
} | null> {
  try {
    const { scheduledPreset, panel } = await getData();

    if (!scheduledPreset?.preset) {
      if (!sceneMatch(currentPreset, panel.defaultPreset)) {
        console.log(
          `[HARDWARE] Default Preset change, rerendering (${currentPreset?.sceneId} to ${panel.defaultPreset.sceneId})`,
        );

        const preset = panel.defaultPreset;
        const renderedAt = new Date().toJSON();
        const scene = getScene(preset.sceneId);

        return { scene, preset, renderedAt };
      }

      return null;
    }

    if (
      scheduledPreset.endTime !== null &&
      new Date().getTime() > new Date(scheduledPreset.endTime).getTime()
    ) {
      console.log(
        `[HARDWARE] ${scheduledPreset.preset.name} has expired, clearing`,
      );

      const preset = panel.defaultPreset;
      const renderedAt = new Date().toJSON();
      const scene = getScene(preset.sceneId);

      await setData({ scheduledPreset: null });

      return { scene, preset, renderedAt };
    }

    if (!sceneMatch(scheduledPreset.preset, currentPreset)) {
      console.log(
        `[HARDWARE] Rendering ${
          scheduledPreset.preset.name
        } until ${scheduledPreset.endTime}`,
      );

      const preset = scheduledPreset.preset;
      const renderedAt = new Date().toJSON();
      const scene = getScene(preset.sceneId);

      return { scene, preset, renderedAt };
    }
  } catch (e) {
    console.log("Error!", e);
  }

  return null;
}
