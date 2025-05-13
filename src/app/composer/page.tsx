import { getCustomScenes } from "@/server/queries";
import App from "../../components/App";
import { Editor } from "./../../components/Editor";
import { getData } from "@/server/db";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { nextVersion } = getData();
  const customScenes = await getCustomScenes();

  return (
    <App nextVersion={nextVersion}>
      <Editor customScenes={customScenes} />
    </App>
  );
}
