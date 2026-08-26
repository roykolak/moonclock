import type { Preset } from "@/types";

function samePreset(a: Preset, b: Preset) {
  return a.id != null && b.id != null ? a.id === b.id : a.name === b.name;
}

export function nextPresetInCycle(
  presets: Preset[],
  activePreset: Preset | null,
): Preset | null {
  const found = activePreset
    ? presets.findIndex((preset) => samePreset(preset, activePreset))
    : -1;

  const position = found === -1 ? presets.length : found;
  const next = (position + 1) % (presets.length + 1);

  return next === presets.length ? null : presets[next];
}
