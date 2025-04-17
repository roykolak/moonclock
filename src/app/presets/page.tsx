import { getCustomSceneNames } from "@/server/queries";
import App from "../../components/App";
import { PresetsList } from "../../components/PresetsList";
import { getFriendlyEndTime } from "@/helpers/getFriendlyEndTime";
import { getData } from "@/server/db";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { presets } = await getData();

  const formattedEndTimes = presets.map((p) => getFriendlyEndTime(p));

  const customSceneNames = await getCustomSceneNames();

  return (
    <App>
      <PresetsList
        presets={presets}
        formattedEndTimes={formattedEndTimes}
        customSceneNames={customSceneNames}
      ></PresetsList>
    </App>
  );
}
