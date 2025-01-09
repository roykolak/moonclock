import App from "../../components/App";
import { getScenes } from "../../server/actions";
import { Editor } from "./../../components/Editor";

export default async function Page() {
  const scenes = await getScenes();

  return (
    <App>
      <Editor scenes={scenes} />
    </App>
  );
}
