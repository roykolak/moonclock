import { PresetForm } from "@/components/PresetForm";
import App from "@/components/App";
import { getData } from "@/server/db";
import { getCustomScenes, updatePreset } from "@/server/actions";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ index: string }>;
}) {
  const { presets } = await getData();
  const customScenes = await getCustomScenes();

  const index = parseInt((await params).index, 10);

  return (
    <App>
      <PresetForm
        index={index}
        title="Edit Preset"
        preset={presets[index]}
        customScenes={customScenes}
        action={updatePreset.bind(null, index)}
      />
    </App>
  );
}
