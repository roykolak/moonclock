export interface DataTypes {
  panel: Panel;
  slot: Slot | null;
  presets: Preset[];
  currentHardwareScene: Scene;
}

export interface Slot {
  endTime: string | null;
  preset: Preset;
}

export interface Panel {
  name: string;
  defaultPreset: Preset;
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
