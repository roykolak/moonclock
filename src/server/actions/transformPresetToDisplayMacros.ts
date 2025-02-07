"use server";

import {
  box,
  coordinates,
  countdown,
  Macro,
  moon,
  text,
  twinkle,
} from "../../display-engine";
import { Preset, TriggerHardwareReloadScene } from "@/types";
import { getEndDate } from "@/helpers/getEndDate";
import { getCustomScenes } from "@/server/queries";

export async function transformPresetToDisplayMacros(
  preset: Preset | null
): Promise<Macro[]> {
  if (!preset) return [];

  const nestedMacros = await Promise.all(
    preset.scene.layers.flatMap(async ({ sceneName }) => {
      if (sceneName === "blank") {
        return [box({ backgroundColor: "#000000" })];
      }

      if (sceneName === "moon") {
        return [moon({})];
      }

      if (sceneName === "countdown") {
        const endDate = getEndDate(preset);

        if (endDate) {
          return [countdown({ endDate: endDate.toJSON() })];
        } else {
          return [text({ text: "no\n date" })];
        }
      }

      if (sceneName === "twinkle") {
        return [twinkle({})];
      }

      if (sceneName === TriggerHardwareReloadScene) {
        return [box({ backgroundColor: "#000000" })];
      }

      const customScenes = await getCustomScenes();
      const customScene = customScenes.find(
        (scene) => scene.name === sceneName
      );

      if (customScene) {
        return [coordinates({ coordinates: customScene?.coordinates })];
      }

      return [
        text({
          text: "?",
          startingColumn: 11,
          startingRow: 8,
          fontSize: 20,
          color: "#888",
        }),
      ];
    })
  );

  return nestedMacros.flat();
}
