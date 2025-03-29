import Panel from "./components/Panel";

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
  [PanelField.Name]: string;
  [PanelField.TimeAdjustmentAmount]: string;
  [PanelField.Brightness]: number;
  [PanelField.PwnLsbNanoseconds]: number;
  [PanelField.GpioSlowdown]: 0 | 1 | 2 | 3 | 4;
  [PanelField.PwmBits]: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
  updatedAt?: string;
  defaultPreset: Preset;
}

export enum PanelField {
  Name = "name",
  TimeAdjustmentAmount = "timeAdjustmentAmount",
  Brightness = "brightness",
  PwnLsbNanoseconds = "pwnLsbNanoseconds",
  GpioSlowdown = "gpioSlowdown",
  PwmBits = "pwmBits",
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
  Marquee = "marquee",
  Emoji = "emoji",
}

export const TriggerHardwareReloadScene = "trigger-hardware-scene-reload";

export interface Preset {
  [PresetField.Name]: string;
  [PresetField.Mode]: "for" | "until";
  [PresetField.UntilDay]: string;
  [PresetField.UntilHour]: string;
  [PresetField.UntilMinute]: string;
  [PresetField.ForTime]: string;
  [PresetField.TimeAdjustmentAmount]?: string;
  scenes: Scene[];
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
