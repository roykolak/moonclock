import App from "../../components/App";
import { getActiveSlot, getScenes, getPresets } from "../../server/actions";
import Panel from "../../components/Panel";

export const dynamic = "force-dynamic";

export default async function Home() {
  const activeSlot = await getActiveSlot();
  const scenes = await getScenes();
  const presets = await getPresets();

  return (
    <App>
      <Panel activeSlot={activeSlot} scenes={scenes} presets={presets} />
    </App>
  );
}
