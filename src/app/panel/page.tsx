import App from "../../components/App";
import { getActiveSlot, getScenes, getPresets } from "../../server/actions";
import Panel from "../../components/Panel";

export const dynamic = "force-dynamic";

export default async function Home() {
  const activeSlot = await getActiveSlot();
  const scenes = await getScenes();
  const presets = await getPresets();

  let formattedEndTime = null;

  if (activeSlot) {
    formattedEndTime = activeSlot.endTime
      ? new Date(activeSlot.endTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "forever";
  }

  return (
    <App>
      <Panel
        activeSlot={activeSlot}
        formattedEndTime={formattedEndTime || null}
        scenes={scenes}
        presets={presets}
      />
    </App>
  );
}
