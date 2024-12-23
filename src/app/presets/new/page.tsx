import { PresetForm } from "@/components/PresetForm";
import App from "../../../components/App";
import { getPresets, getScenes } from "@/server/actions";

export const dynamic = "force-dynamic";

export default async function Edit() {
  const scenes = await getScenes();
  const presets = await getPresets();

  return (
    <App>
      <PresetForm presets={presets} scenes={scenes} />
    </App>
  );
}
