"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { getData, resetDatabase as resetData, setData } from "@/server/db";
import {
  rebootMachine as reboot,
  refreshHardwareScene,
  reloadHardware as reload,
} from "@/server/utils";
import * as updates from "@/server/updates";
import { Panel, Preset, ScheduledPreset, Setup, UpdateCheck } from "@/types";

const PAGE = "/panel";

export async function setScheduledPreset(changes: Partial<ScheduledPreset>) {
  setData({
    scheduledPreset: {
      preset: null,
      endTime: null,
      ...changes,
      updatedAt: new Date().toJSON(),
    },
  });

  await refreshHardwareScene();
  revalidatePath(PAGE);
}

export async function createPreset(preset: Preset) {
  const { presets } = getData();

  setData({ presets: [...presets, { ...preset, id: randomUUID() }] });
  revalidatePath(PAGE);
}

export async function updatePreset(preset: Preset) {
  const { presets, scheduledPreset } = getData();
  const target = presets.find((existing) => existing.id === preset.id);
  if (!target) return;

  const active = scheduledPreset?.preset;
  const scheduled =
    active &&
    (active.id != null ? active.id === preset.id : active.name === target.name)
      ? scheduledPreset
      : null;

  setData({
    presets: presets.map((existing) =>
      existing.id === preset.id ? preset : existing,
    ),
    ...(scheduled ? { scheduledPreset: { ...scheduled, preset } } : {}),
  });

  if (scheduled) await refreshHardwareScene();
  revalidatePath(PAGE);
}

export async function deletePreset(id: string) {
  const { presets } = getData();

  setData({ presets: presets.filter((existing) => existing.id !== id) });
  revalidatePath(PAGE);
}

export async function updatePanel(panel: Panel) {
  setData({ panel: { ...panel, updatedAt: new Date().toJSON() } });

  reload();
  revalidatePath(PAGE);
}

export async function updateSetup(changes: Partial<Setup>) {
  const { setup } = getData();

  setData({
    setup: { completedAt: setup?.completedAt ?? null, ...changes },
  });

  await refreshHardwareScene();
  revalidatePath(PAGE);
}

export async function resetDatabase() {
  resetData();
  reload();
}

export async function reloadHardware() {
  reload();
}

export async function rebootMachine() {
  reboot();
}

export async function checkForUpdate(): Promise<UpdateCheck> {
  const result = await updates.checkForUpdate();
  revalidatePath(PAGE);
  return result;
}

export async function startDownload() {
  updates.startDownload();
}

export async function startUpdate() {
  updates.startUpdate();
  revalidatePath(PAGE);
}
