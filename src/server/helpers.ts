import { Preset, PresetField } from "@/types";

export function formDataToPreset(formData: FormData): Preset {
  return {
    mode: formData.get(PresetField.Mode) as any,
    name: formData.get(PresetField.Name) as any,
    scenes: [
      { sceneName: formData.get(`${PresetField.Scenes}.0.sceneName`) as any },
    ],
    untilMinute: formData.get(PresetField.UntilMinute) as any,
    untilDay: "1",
    untilHour: formData.get(PresetField.UntilHour) as any,
    forTime: formData.get(PresetField.ForTime) as any,
  };
}
