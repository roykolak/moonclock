import { getCustomScenes } from "@/server/actions";
import { SceneName } from "@/types";

export async function GET() {
  const customScenes = await getCustomScenes();
  return Response.json([
    SceneName.Moon,
    SceneName.Countdown,
    SceneName.Twinkle,
    ...customScenes.map((scene) => scene.name),
  ]);
}
