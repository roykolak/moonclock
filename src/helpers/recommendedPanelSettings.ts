import type { Panel } from "@/types";

export type TunablePanelField =
  | "brightness"
  | "pwnLsbNanoseconds"
  | "gpioSlowdown"
  | "pwmBits"
  | "pwmDitherBits"
  | "limitRefreshRateHz";

export type PanelTuning = Required<Pick<Panel, TunablePanelField>>;

export const recommendedPanelSettings: PanelTuning = {
  brightness: 30,
  pwnLsbNanoseconds: 553,
  gpioSlowdown: 2,
  pwmBits: 9,
  pwmDitherBits: 0,
  limitRefreshRateHz: 0,
};
