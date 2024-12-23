import { PresetForm } from "@/components/PresetForm";
import App from "../../../../components/App";
import { getPresets, getScenes } from "@/server/actions";

export const dynamic = "force-dynamic";

export default async function Edit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const scenes = await getScenes();
  const presets = await getPresets();

  const id = parseInt((await params).id, 10);

  return (
    <App>
      <PresetForm id={id} presets={presets} scenes={scenes} />
    </App>
  );
}
