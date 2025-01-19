import App from "../../components/App";
import { getCustomScenes } from "../../server/actions";
import { Editor } from "./../../components/Editor";

export default async function Page() {
  const customScenes = await getCustomScenes();

  return (
    <App>
      <Editor customScenes={customScenes} />
    </App>
  );
}
