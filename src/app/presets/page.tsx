import App from "../../components/App";
import { getScenes, getPresets } from "../../server/actions";
import { PresetsList } from "../../components/PresetsList";
import { getFriendlyEndTime } from "@/utils";

export const dynamic = "force-dynamic";

export default async function Edit() {
  const presets = await getPresets();
  const scenes = await getScenes();

  const formattedEndTimes = presets.map((p) => getFriendlyEndTime(p));

  return (
    <App>
      <PresetsList
        presets={presets}
        scenes={scenes}
        formattedEndTimes={formattedEndTimes}
      ></PresetsList>
    </App>
  );
}
