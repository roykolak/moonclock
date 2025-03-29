"use server";

import {
  box,
  coordinates,
  countdown,
  Macro,
  marquee,
  moon,
  ripple,
  text,
  twinkle,
} from "../../display-engine";
import { Preset, SceneName, TriggerHardwareReloadScene } from "@/types";
import { getEndDate } from "@/helpers/getEndDate";
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

      if (sceneName === SceneName.Moon) {
        return [moon({})];
      }

      if (sceneName === SceneName.Ripple) {
        return [
          ripple({
            ...sceneConfig,
            speed: sceneConfig.speed / 10,
            waveHeight: sceneConfig.waveHeight / 10,
          }),
        ];
      }

      if (sceneName === SceneName.Marquee) {
        return [
          marquee({
            ...sceneConfig,
            direction: "horizontal",
          }),
        ];
      }

      if (sceneName === SceneName.Emoji) {
        return [
          text({
            startingRow: 3,
            startingColumn: 1,
            fontSize: 30,
            text: sceneConfig.emoji,
          }),
        ];
      }

      if (sceneName === SceneName.Countdown) {
        const endDate = getEndDate(preset);

        if (endDate) {
          return [countdown({ endDate: endDate.toJSON() })];
        } else {
          return [text({ text: "no\n date" })];
        }
      }

      if (sceneName === SceneName.Twinkle) {
        return [
          twinkle({
            ...sceneConfig,
            speed: 51 - sceneConfig.speed / 2,
            amount: sceneConfig.amount * 10,
          }),
        ];
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
