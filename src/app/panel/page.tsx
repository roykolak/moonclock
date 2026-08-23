import MainScreen from "../../components/MainScreen";
import { Metadata } from "next";
import { getData } from "@/server/db";
import packageInfo from "../../../package.json";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { panel } = getData();
  return { title: panel.name };
}

export default async function Page() {
  const { deviceId, panel, presets, scheduledPreset, nextVersion } = getData();

  return (
    <MainScreen
      initialState={{
        deviceId,
        version: packageInfo.version,
        panel,
        presets,
        scheduledPreset,
        nextVersion,
      }}
    />
  );
}
