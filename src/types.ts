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

// Chipsets needing a special init sequence. "" is the normal HUB75 panel;
// the others garble output on a panel that doesn't have that chipset.
export type PanelType = "" | "FM6126A" | "FM6127";

export interface Panel {
  name: string;
  brightness: number;
  pwnLsbNanoseconds: number;
  gpioSlowdown: 0 | 1 | 2 | 3 | 4;
  pwmBits: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
  hardwareMapping: string;
  // Ghosting/refresh tuning. Optional so older databases keep loading; the
  // hardware client falls back to the library defaults when they're absent.
  pwmDitherBits?: 0 | 1 | 2;
  limitRefreshRateHz?: number;
  panelType?: PanelType;
  updateChannel?: UpdateChannel;
  updatedAt?: string;
  defaultPreset: Preset;
}

export interface Preset {
  id?: string;
  name: string;
  mode: "for" | "until";
  untilDay: string;
  untilHour: string;
  untilMinute: string;
  forTime: string;
  brightness?: number | null;
  /** A scene id from src/scenes/catalog.ts. */
  sceneId: string;
}
