import { getData } from "@/server/db";
import { DeviceState } from "@/types";
import packageInfo from "../../../../package.json";

export const dynamic = "force-dynamic";

export async function GET() {
  const { deviceId, panel, presets, scheduledPreset, nextVersion } = getData();

  const state: DeviceState = {
    deviceId,
    version: packageInfo.version,
    panel,
    presets,
    scheduledPreset,
    nextVersion,
  };

  return Response.json(state);
}
