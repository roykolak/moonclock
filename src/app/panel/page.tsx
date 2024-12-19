import "@mantine/core/styles.css";
import App from "../../App";
import { getAllSceneData, getPanel, getPresets } from "../../server/actions";
import Panel from "../../Panel";

export default async function Home() {
  const panel = await getPanel();
  const scenes = await getAllSceneData();
  const presets = await getPresets();

  return (
    <App>
      <Panel panel={panel} scenes={scenes} presets={presets} />
    </App>
  );
}
