import App from "../../components/App";
import { getScenes, getLastHeartbeat } from "../../server/actions";
import Panel from "../../components/Panel";
import { Metadata } from "next";
import { getData } from "@/server/db";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { panel } = await getData();
  return { title: panel.name };
}

export default async function Page() {
  const { slot, panel, presets } = await getData();

  const scenes = await getScenes();
  const lastHeartBeat = await getLastHeartbeat();

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
        formattedEndTime={formattedEndTime}
        formattedLastHeartbeat={formattedLastHeartbeat}
        scenes={scenes}
        presets={presets}
      />
    </App>
  );
}
