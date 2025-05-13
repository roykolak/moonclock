import App from "../../components/App";
import { getCustomSceneNames } from "../../server/queries";
import Panel from "../../components/Panel";
import { Metadata } from "next";
import { getData } from "@/server/db";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { panel } = getData();
  return { title: panel.name };
}

export default async function Page() {
  const { scheduledPreset, panel, presets, nextVersion } = getData();
  const customSceneNames = await getCustomSceneNames();

  let formattedEndTime = null;

  if (scheduledPreset) {
    formattedEndTime = scheduledPreset.endTime
      ? new Date(scheduledPreset.endTime).toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        })
      : "forever";
  }

  return (
    <App>
      <Panel
        nextVersion={nextVersion}
        panel={panel}
        scheduledPreset={scheduledPreset}
        formattedEndTime={formattedEndTime}
        presets={presets}
        customSceneNames={customSceneNames}
      />
    </App>
  );
}
