import { getData } from "@/server/db";

export async function GET() {
  return Response.json({ data: getData() });
}
