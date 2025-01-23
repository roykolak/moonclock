import { PresetForm } from "@/components/PresetForm";
import App from "@/components/App";
import { createPreset, getCustomScenes } from "@/server/actions";

export const dynamic = "force-dynamic";

export default async function Page() {
  const customScenes = await getCustomScenes();

  return (
    <App>
      <PresetForm
        index={null}
        title="Create New Preset"
        customScenes={customScenes}
        action={createPreset}
      />
    </App>
  );
}
