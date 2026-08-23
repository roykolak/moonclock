import { reloadHardware } from "@/server/utils";

export async function POST() {
  reloadHardware();

  return Response.json({ ok: true });
}
