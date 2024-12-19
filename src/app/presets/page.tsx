import "@mantine/core/styles.css";
import App from "../../App";
import { getAllSceneData, getPresets } from "../../server/actions";
import { PresetsList } from "../../PresetsList";

export default async function Presets() {
  const presets = await getPresets();
  const scenes = await getAllSceneData();

  return (
    <App>
      <PresetsList presets={presets} scenes={scenes}></PresetsList>
    </App>
  );
}
