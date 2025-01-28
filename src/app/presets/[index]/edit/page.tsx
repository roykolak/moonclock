import { PresetForm } from "@/components/PresetForm";
import App from "@/components/App";
import { getData } from "@/server/db";
import { updatePreset } from "@/server/actions/presets";
import { PresetDelete } from "@/components/PresetDelete";
import { getCustomSceneNames } from "@/server/queries";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ index: string }>;
}) {
  const { presets } = await getData();
  const customSceneNames = await getCustomSceneNames();

  const index = parseInt((await params).index, 10);

  return (
    <App>
      <PresetForm
        title="Edit Preset"
        preset={presets[index]}
        customSceneNames={customSceneNames}
        action={updatePreset.bind(null, index)}
      />
      <PresetDelete index={index}></PresetDelete>
    </App>
  );
}
