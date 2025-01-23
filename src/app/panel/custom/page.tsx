import { PresetForm } from "@/components/PresetForm";
import App from "@/components/App";
import { createCustomSlottedPreset, getCustomScenes } from "@/server/actions";
import { Preset } from "@/types";

export const dynamic = "force-dynamic";

export default async function Page() {
  const customScenes = await getCustomScenes();

  return (
    <App>
      <PresetForm
        title="Create Custom Preset"
        index={null}
        customScenes={customScenes}
        preset={{ name: "Custom Preset" } as Preset}
        action={createCustomSlottedPreset}
      />
    </App>
  );
}
