import { setData } from "@/server/db";
import { reloadHardware } from "@/server/utils";
import { Panel } from "@/types";

export async function PUT(request: Request) {
  const panel: Panel = await request.json();

  setData({ panel: { ...panel, updatedAt: new Date().toJSON() } });

  reloadHardware();

  return Response.json({ ok: true });
}
