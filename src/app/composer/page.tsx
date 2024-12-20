import App from "../../components/App";
import { getScenes } from "../../server/actions";
import { Editor } from "./Editor";

export default async function Composer() {
  const scenes = await getScenes();

  return (
    <App>
      <Editor scenes={scenes} />
    </App>
  );
}
