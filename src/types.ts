import { MacroName } from "./display-engine";

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
  Scenes = "scenes",
  Mode = "mode",
  UntilDay = "untilDay",
  UntilHour = "untilHour",
  UntilMinute = "untilMinute",
  ForTime = "forTime",
}

export enum SceneName {
  Moon = "moon",
  Countdown = "countdown",
  Twinkle = "twinkle",
}

export interface Preset {
  [PresetField.Name]: string;
  scenes: SceneConfig[];
  [PresetField.Mode]: "for" | "until";
  [PresetField.UntilDay]: string;
  [PresetField.UntilHour]: string;
  [PresetField.UntilMinute]: string;
  [PresetField.ForTime]: string;
}

export interface SceneConfig {
  sceneName: string;
}

export interface CustomScene {
  name: string;
  coordinates: Coordinates;
}

export interface Coordinates {
  [k: string]: string;
}
