import App from "../../components/App";
import { Settings } from "@/components/Settings";
import { getData } from "@/server/db";
import { getCustomSceneNames } from "@/server/queries";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { panel } = await getData();
  const customSceneNames = await getCustomSceneNames();

  return (
    <App>
      <Settings panel={panel} customSceneNames={customSceneNames} />
    </App>
  );
}
