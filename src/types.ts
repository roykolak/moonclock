export interface DataTypes {
  panel: Panel;
  slot: Slot | null;
  presets: Preset[];
}

export interface Slot {
  endTime: string | null;
  sceneName: string;
  name: string;
}

export interface Panel {
  name: string;
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
