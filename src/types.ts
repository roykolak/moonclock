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
  name: string;
  timeAdjustmentAmount: string;
  brightness: number;
  pwnLsbNanoseconds: number;
  gpioSlowdown: 0 | 1 | 2 | 3 | 4;
  pwmBits: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
  hardwareMapping: string;
  buttonEnabled: boolean;
  buttonGpioPin: number;
  updateChannel?: UpdateChannel;
  updatedAt?: string;
  defaultPreset: Preset;
}

export interface QueuedFramesSnapshot {
  timestamp: number;
  count: number;
}

export interface Preset {
  id?: string;
  name: string;
  mode: "for" | "until";
  untilDay: string;
  untilHour: string;
  untilMinute: string;
  forTime: string;
  timeAdjustmentAmount?: string;
  brightness?: number | null;
  pinned?: boolean;
  /** A scene id from src/scenes/catalog.ts. */
  sceneId: string;
}
