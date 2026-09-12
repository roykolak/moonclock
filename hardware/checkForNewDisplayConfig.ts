import { getData, setData } from "@/server/db";
import { Scene } from "../src/display-engine";
import { Preset, Setup } from "@/types";
import { getScene } from "@/helpers/getScene";
import { createSetupScene, SETUP_SCENE_ID } from "@/scenes/setup";

const setupPreset: Preset = {
  name: "Setup",
  sceneId: SETUP_SCENE_ID,
  mode: "for",
  untilDay: "0",
  untilHour: "0",
  untilMinute: "0",
  forTime: "0:00",
};

function sceneMatch(preset1: Preset | null, preset2: Preset | null) {
  return preset1?.sceneId === preset2?.sceneId;
}

function testPatternIsLeased(setup: Setup | undefined) {
  if (!setup?.testPatternUntil) return false;

  return Date.now() < new Date(setup.testPatternUntil).getTime();
}

export async function checkForNewDisplayConfig(currentPreset: Preset): Promise<{
  preset: Preset;
  renderedAt: string;
  scene: Scene | null;
} | null> {
  try {
    const { scheduledPreset, panel, setup } = await getData();

    if (testPatternIsLeased(setup)) {
      if (sceneMatch(currentPreset, setupPreset)) return null;

      console.log("[HARDWARE] Setup in progress, showing the test pattern");

      return {
        scene: createSetupScene(),
        preset: setupPreset,
        renderedAt: new Date().toJSON(),
      };
    }

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
