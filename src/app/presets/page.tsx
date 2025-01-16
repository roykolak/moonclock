import App from "../../components/App";
import { PresetsList } from "../../components/PresetsList";
import { getFriendlyEndTime } from "@/helpers/getFriendlyEndTime";
import { getData } from "@/server/db";
import { Macro } from "../../display-engine";
import { transformSlotToDisplayConfig } from "@/helpers/transformSlotToDisplayConfig";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { presets } = await getData();

  const displayConfigs: Macro[][] = [];

  for (const preset of presets) {
    displayConfigs.push(transformSlotToDisplayConfig(preset));
  }

  const formattedEndTimes = presets.map((p) => getFriendlyEndTime(p));

  return (
    <App>
      <PresetsList
        presets={presets}
        displayConfigs={displayConfigs}
        formattedEndTimes={formattedEndTimes}
      ></PresetsList>
    </App>
  );
}
