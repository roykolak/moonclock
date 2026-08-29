import { getData, resetDatabase } from "@/server/db";
import { reloadHardware } from "@/server/utils";

export async function GET() {
  return Response.json({ data: getData() });
}

export async function DELETE() {
  resetDatabase();

  reloadHardware();

  return Response.json({ ok: true });
}
