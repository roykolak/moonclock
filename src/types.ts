import type { Macro, SceneName } from "@bigdots-io/display-engine";

export interface Panel {
  activeSlot: Slot | null;
  macros: Macro[];
}

export interface Slot {
  endTime: string | null;
  scene: SceneName;
}

export interface Time {
  hour: number;
  minute: number;
}

export interface Preset {
  name: string;
  scene: SceneName;
  mode: "offset" | "until" | "forever";
  end: {
    hour: number;
    day: number;
    minute: number;
  };
}

export interface SceneData {
  name: SceneName;
  coordinates: { [k: string]: string };
}
