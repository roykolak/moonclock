import App from "../../components/App";
import {
  getScenes,
  getPresets,
  getLastHeartbeat,
  getSlot,
} from "../../server/actions";
import Panel from "../../components/Panel";

export const dynamic = "force-dynamic";

export default async function Page() {
  const slot = await getSlot();
  const scenes = await getScenes();
  const presets = await getPresets();
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
        slot={slot}
        formattedEndTime={formattedEndTime}
        formattedLastHeartbeat={formattedLastHeartbeat}
        scenes={scenes}
        presets={presets}
      />
    </App>
  );
}
