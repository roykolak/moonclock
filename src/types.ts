export interface DataTypes {
  panel: Panel;
  scheduledPreset: ScheduledPreset | null;
  presets: Preset[];
  hardware: Hardware;
}

export interface ScheduledPreset {
  endTime: string | null;
  preset: Preset | null;
  updatedAt: string | null;
}

export interface Panel {
  name: string;
  defaultPreset: Preset;
  updatedAt: string | null;
}

export interface Hardware {
  renderedAt?: string;
  scene: Scene;
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
  Blank = "blank",
  Moon = "moon",
  Countdown = "countdown",
  Twinkle = "twinkle",
}

export const TriggerHardwareReloadScene = "trigger-hardware-scene-reload";

export interface Preset {
  [PresetField.Name]: string;
  scene: Scene;
  [PresetField.Mode]: "for" | "until";
  [PresetField.UntilDay]: string;
  [PresetField.UntilHour]: string;
  [PresetField.UntilMinute]: string;
  [PresetField.ForTime]: string;
}

export interface Scene {
  layers: SceneLayer[];
}

export interface SceneLayer {
  sceneName: string;
}

export interface CustomScene {
  name: string;
  coordinates: Coordinates;
}

export interface Coordinates {
  [k: string]: string;
}
