export interface DataTypes {
  panel: Panel;
  slot: Slot | null;
  presets: Preset[];
}

export interface Slot {
  endTime: string | null;
  preset: Preset;
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

export enum SceneName {
  Bunny = "bunny",
  Moon = "moon",
  Countdown = "countdown",
}

export interface Preset {
  [PresetField.Name]: string;
  [PresetField.SceneName]: SceneName;
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
