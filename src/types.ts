export interface DataTypes {
  activeSlot: Slot | null;
  presets: Preset[];
}

export interface Panel {
  activeSlot: Slot | null;
}

export interface Slot {
  endTime: string | null;
  sceneName: string;
}

export interface Time {
  hour: number;
  minute: number;
}

export interface Preset {
  name: string;
  sceneName: string;
  mode: "offset" | "until" | "forever";
  end: {
    hour: number;
    day: number;
    minute: number;
  };
}

export interface Scene {
  name: string;
  coordinates: Coordinates;
}

export interface Coordinates {
  [k: string]: string;
}
