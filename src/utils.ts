import { Preset } from "./types";

export function getEndDate(preset: Preset) {
  const endDate = new Date();

  if (preset.mode === "until") {
    const day = parseInt(preset.untilDay, 10);
    const hour = parseInt(preset.untilHour, 10);
    const minute = parseInt(preset.untilMinute, 10);

    endDate.setDate(endDate.getDate() + day);
    endDate.setHours(hour, minute, 0, 0);
  } else if (preset.mode === "for") {
    const [h, m] = preset.forTime.split(":");

    const hour = parseInt(h, 10);
    const minute = parseInt(m, 10);

    if (hour === 0 && minute === 0) {
      return null;
    }

    endDate.setHours(
      endDate.getHours() + hour,
      endDate.getMinutes() + minute,
      0,
      0
    );
  }

  return endDate;
}

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
    const [hour, minute] = preset.forTime.split(":");
    if (hour === "0" && minute === "0") {
      return "Forever";
    }
    if (hour === "0") {
      return `For ${minute} minutes`;
    } else {
      if (minute === "0") {
        return `For ${hour} hours`;
      } else {
        return `For ${hour} hours & ${minute} mins`;
      }
    }
  }

  return "";
}
