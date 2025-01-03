export interface DataTypes {
  slot: Slot | null;
  heartBeat: HeartBeat | null;
  presets: Preset[];
}

export interface HeartBeat {
  lastUpdatedAt: string | null;
  lastCheckedAt: string | null;
}

export interface Panel {
  activeSlot: Slot | null;
}

export interface Slot {
  endTime: string | null;
  sceneName: string;
}

export interface Time {
  hour: number;
  minute: number;
}

export enum PresetField {
  Name = "name",
  SceneName = "sceneName",
  Mode = "mode",
  UntilDay = "untilDay",
  UntilHour = "untilHour",
  UntilMinute = "untilMinute",
  ForTime = "forTime",
}

export interface Preset {
  [PresetField.Name]: string;
  [PresetField.SceneName]: string;
  [PresetField.Mode]: "for" | "until";
  [PresetField.UntilDay]: string;
  [PresetField.UntilHour]: string;
  [PresetField.UntilMinute]: string;
  [PresetField.ForTime]: string;
}

export interface Scene {
  name: string;
  coordinates: Coordinates;
}

export interface Coordinates {
  [k: string]: string;
}
