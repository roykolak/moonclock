import { checkForUpdate } from "@/server/updates";

export async function PUT() {
  return Response.json(await checkForUpdate());
}
