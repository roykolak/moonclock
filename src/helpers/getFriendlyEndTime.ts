import { Preset } from "@/types";
import { getEndDate } from "./getEndDate";

export function getFriendlyEndTime(preset: Preset) {
  const { mode } = preset;

  if (mode === "until") {
    const endDate = getEndDate(preset);
    return `Until ${endDate?.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    })} tomorrow`;
  }

  if (mode === "for") {
    const [h, m] = preset.forTime.split(":");

    const hour = parseInt(h, 10);
    const minute = parseInt(m, 10);

    if (hour === 0 && minute === 0) {
      return "Forever";
    }
    if (hour === 0) {
      return `For ${minute} minutes`;
    } else {
      if (minute === 0) {
        return `For ${hour} hours`;
      } else {
        return `For ${hour} hours & ${minute} mins`;
      }
    }
  }

  return "";
}
