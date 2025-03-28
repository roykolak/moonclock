import { getCustomScenes } from "@/server/queries";
import App from "../../components/App";
import { Editor } from "./../../components/Editor";

export const dynamic = "force-dynamic";

export default async function Page() {
  const customScenes = await getCustomScenes();

  return (
    <App>
      <Editor customScenes={customScenes} />
    </App>
  );
}
