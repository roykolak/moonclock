import { Preset } from "./types";

export function getEndDate(preset: Preset) {
  if (preset.mode === "forever") {
    return null;
  }

  const endDate = new Date();

  if (preset.mode === "until") {
    endDate.setDate(endDate.getDate() + preset.end.day);
    endDate.setHours(preset.end.hour, preset.end.minute, 0, 0);
  } else if (preset.mode === "offset") {
    endDate.setHours(
      endDate.getHours() + preset.end.hour,
      endDate.getMinutes() + preset.end.minute,
      0,
      0
    );
  }

  return endDate;
}
