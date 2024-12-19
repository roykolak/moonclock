import "@mantine/core/styles.css";
import App from "../../App";
import { getAllSceneData } from "../../server/actions";
import { Editor } from "./Editor";

export default async function Composer() {
  const allSceneData = await getAllSceneData();

  return (
    <App>
      <Editor allSceneData={allSceneData} />
    </App>
  );
}
