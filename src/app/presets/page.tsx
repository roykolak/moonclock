import App from "../../components/App";
import { getScenes, getPresets } from "../../server/actions";
import { PresetsList } from "../../components/PresetsList";

export const dynamic = "force-dynamic";

export default async function Presets() {
  const presets = await getPresets();
  const scenes = await getScenes();

  return (
    <App>
      <PresetsList presets={presets} scenes={scenes}></PresetsList>
    </App>
  );
}
