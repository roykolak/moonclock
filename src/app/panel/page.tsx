import App from "../../components/App";
import { getCustomSceneNames, getLastHeartbeat } from "../../server/queries";
import Panel from "../../components/Panel";
import { Metadata } from "next";
import { getData } from "@/server/db";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { panel } = getData();
  return { title: panel.name };
}

export default async function Page() {
  const { slot, panel, presets, currentHardwareScene } = getData();
  const lastHeartBeat = await getLastHeartbeat();
  const customSceneNames = await getCustomSceneNames();

  let formattedEndTime = null;
  let formattedLastHeartbeat = null;

  if (slot) {
    formattedEndTime = slot.endTime
      ? new Date(slot.endTime).toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        })
      : "forever";
  }

  if (lastHeartBeat) {
    formattedLastHeartbeat = new Date(lastHeartBeat).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  return (
    <App>
      <Panel
        panel={panel}
        slot={slot}
        currentHardwareScene={currentHardwareScene}
        formattedEndTime={formattedEndTime}
        formattedLastHeartbeat={formattedLastHeartbeat}
        presets={presets}
        customSceneNames={customSceneNames}
      />
    </App>
  );
}
