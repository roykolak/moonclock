import App from "../../components/App";
import {
  getScenes,
  getPresets,
  getHeartBeat,
  getSlot,
} from "../../server/actions";
import Panel from "../../components/Panel";

export const dynamic = "force-dynamic";

export default async function Page() {
  const slot = await getSlot();
  const scenes = await getScenes();
  const presets = await getPresets();
  const heartBeat = await getHeartBeat();

  let formattedEndTime = null;
  let formattedLastCheckedAt = null;

  if (slot) {
    formattedEndTime = slot.endTime
      ? new Date(slot.endTime).toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        })
      : "forever";
  }

  if (heartBeat.lastCheckedAt) {
    formattedLastCheckedAt = new Date(
      heartBeat.lastCheckedAt
    ).toLocaleTimeString([], {
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
        formattedLastCheckedAt={formattedLastCheckedAt}
        scenes={scenes}
        presets={presets}
      />
    </App>
  );
}
