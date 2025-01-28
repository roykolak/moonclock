import { PresetForm } from "@/components/PresetForm";
import App from "@/components/App";
import { createPreset } from "@/server/actions/presets";
import { getCustomSceneNames } from "@/server/queries";

export const dynamic = "force-dynamic";

export default async function Page() {
  const customSceneNames = await getCustomSceneNames();

  return (
    <App>
      <PresetForm
        title="Create New Preset"
        customSceneNames={customSceneNames}
        action={createPreset}
      />
    </App>
  );
}
