import { rebootMachine } from "@/server/utils";

export async function POST() {
  rebootMachine();

  return Response.json({ ok: true });
}
