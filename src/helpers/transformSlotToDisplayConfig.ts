import {
  countdown,
  Macro,
  scene,
  SceneName,
} from "../../shared/display-engine";
import { Preset, PresetField } from "@/types";
import { getEndDate } from "@/helpers/getEndDate";

const coordinateScenes = ["bunny", "moon"];

export function transformSlotToDisplayConfig(preset: Preset | null): Macro[] {
  if (!preset) return [];

  const sceneName = preset[PresetField.SceneName];

  if (coordinateScenes.includes(sceneName)) {
    return [scene({ sceneName: sceneName as SceneName })];
  }

  if (sceneName === "countdown") {
    const endDate = getEndDate(preset);

    if (!endDate) return [];
    return [countdown({ endDate })];
  }

  return [];
}
