"use server";

import {
  box,
  coordinates,
  // countdown,
  // emoji,
  // marquee,
  // moon,
  // ripple,
  text,
  twinkle,
} from "../../display-engine/marcoConfigs";
import { Macro } from "../../display-engine/types";
import { Preset, SceneName } from "@/types";
// import { getEndDate } from "@/helpers/getEndDate";
import { getCustomScenes } from "@/server/queries";

export async function transformPresetToDisplayMacros(
  preset: Preset | null
): Promise<Macro[]> {
  if (!preset) return [];

  const nestedMacros = await Promise.all(
    preset.scenes.flatMap(async ({ sceneName, sceneConfig }) => {
      if (sceneName === SceneName.Blank) {
        return [box({ backgroundColor: "#000000" })];
      }

      if (sceneName === SceneName.Color) {
        return [box({ backgroundColor: sceneConfig.color })];
      }

      // if (sceneName === SceneName.Moon) {
      //   return [moon({ ...sceneConfig })];
      // }

      // if (sceneName === SceneName.Ripple) {
      //   return [ripple({ ...sceneConfig })];
      // }

      // if (sceneName === SceneName.Marquee) {
      //   return [
      //     marquee({
      //       ...sceneConfig,
      //       direction: "horizontal",
      //     }),
      //   ];
      // }

      if (sceneName === SceneName.Message) {
        return [
          text({
            ...sceneConfig,
            startingRow: 0,
            font: "Tiny5",
            fontSize: 8,
          }),
        ];
      }

      if (sceneName === SceneName.Emoji) {
        return [
          text({
            startingRow: 4,
            startingColumn: 1,
            fontSize: 30,
            text: "👍",
          }),
          // emoji({
          //   ...sceneConfig,
          // }),
        ];
      }

      // if (sceneName === SceneName.Countdown) {
      //   const endDate = getEndDate(preset);

      //   if (endDate) {
      //     return [countdown({ ...sceneConfig, endDate: endDate.toJSON() })];
      //   } else {
      //     return [text({ text: "no\n date" })];
      //   }
      // }

      if (sceneName === SceneName.Twinkle) {
        return [twinkle({ ...sceneConfig })];
      }

      if (sceneName === SceneName.Hardware) {
        return [coordinates({ ...sceneConfig })];
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
