import App from "../../components/App";
import { Settings } from "@/components/Settings";
import { getData } from "@/server/db";
import { getCustomSceneNames } from "@/server/queries";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { panel, nextVersion } = await getData();
  const customSceneNames = await getCustomSceneNames();

  return (
    <App nextVersion={nextVersion}>
      <Settings panel={panel} customSceneNames={customSceneNames} />
    </App>
  );
}
