import App from "../../components/App";
import { getScenes } from "../../server/actions";
import { PresetsList } from "../../components/PresetsList";
import { getFriendlyEndTime } from "@/helpers/getFriendlyEndTime";
import { getData } from "@/server/db";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { presets } = await getData();
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
