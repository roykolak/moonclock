export interface DataTypes {
  panel: Panel;
  scheduledPreset: ScheduledPreset | null;
  presets: Preset[];
  nextVersion: NextVersion | null;
}

export interface ScheduledPreset {
  endTime: string | null;
  preset: Preset | null;
  updatedAt?: string;
}

export interface NextVersion {
  version: string;
  releaseNotes: string;
  updateStartedAt: string | null;
  updateFinishedAt: string | null;
  absoluteFilePath: string;
  downloadUrl: string;
  downloadedAt: string | null;
}

export type UpdateChannel = "stable" | "beta";

export interface Panel {
  [PanelField.Name]: string;
  [PanelField.TimeAdjustmentAmount]: string;
  [PanelField.Brightness]: number;
  [PanelField.PwnLsbNanoseconds]: number;
  [PanelField.GpioSlowdown]: 0 | 1 | 2 | 3 | 4;
  [PanelField.PwmBits]: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
  [PanelField.HardwareMapping]: string;
  [PanelField.ButtonEnabled]: boolean;
  [PanelField.ButtonGpioPin]: number;
  [PanelField.UpdateChannel]?: UpdateChannel;
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
  HardwareMapping = "hardwareMapping",
  ButtonEnabled = "buttonEnabled",
  ButtonGpioPin = "buttonGpioPin",
  UpdateChannel = "updateChannel",
}

export interface Time {
  hour: number;
  minute: number;
}

export enum PresetField {
  Name = "name",
  SceneId = "sceneId",
  Mode = "mode",
  UntilDay = "untilDay",
  UntilHour = "untilHour",
  UntilMinute = "untilMinute",
  ForTime = "forTime",
  TimeAdjustmentAmount = "timeAdjustmentAmount",
  Brightness = "brightness",
  Pinned = "pinned",
}

export interface QueuedFramesSnapshot {
  timestamp: number;
  count: number;
}

export interface HardwareState {
  queuedFramesSnapshots: QueuedFramesSnapshot[];
  renderedAt: string;
  lastLoopRunAt: string;
  preset: Preset;
  syncSpeed: number;
  virtualPanel: { [k: string]: string };
  brightness: number;
}

export interface Preset {
  id?: string;
  [PresetField.Name]: string;
  [PresetField.Mode]: "for" | "until";
  [PresetField.UntilDay]: string;
  [PresetField.UntilHour]: string;
  [PresetField.UntilMinute]: string;
  [PresetField.ForTime]: string;
  [PresetField.TimeAdjustmentAmount]?: string;
  [PresetField.Brightness]?: number | null;
  [PresetField.Pinned]?: boolean;
  /** A scene id from src/scenes/catalog.ts. */
  [PresetField.SceneId]: string;
}
