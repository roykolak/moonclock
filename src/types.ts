export interface DataTypes {
  panel: Panel;
  scheduledPreset: ScheduledPreset | null;
  presets: Preset[];
  hardware: Hardware;
}

export interface ScheduledPreset {
  endTime: string | null;
  preset: Preset | null;
  updatedAt?: string;
}

export interface Panel {
  name: string;
  defaultPreset: Preset;
  timeAdjustmentAmount: string;
  updatedAt?: string;
  brightness: number;
}

export interface Hardware {
  renderedAt?: string;
  preset: Preset;
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
  TimeAdjustmentAmount = "timeAdjustmentAmount",
}

export enum SceneName {
  Blank = "blank",
  Moon = "moon",
  Countdown = "countdown",
  Twinkle = "twinkle",
  Ripple = "ripple",
}

export const TriggerHardwareReloadScene = "trigger-hardware-scene-reload";

export interface Preset {
  [PresetField.Name]: string;
  scenes: Scene[];
  [PresetField.Mode]: "for" | "until";
  [PresetField.UntilDay]: string;
  [PresetField.UntilHour]: string;
  [PresetField.UntilMinute]: string;
  [PresetField.ForTime]: string;
  [PresetField.TimeAdjustmentAmount]?: string;
}

export interface Scene {
  sceneName: string;
  sceneConfig: any;
}

export interface CustomScene {
  name: string;
  coordinates: Coordinates;
}

export interface Coordinates {
  [k: string]: string;
}
