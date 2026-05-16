import { currentDownloadProgressFile } from "@/server/utils";
import fs from "fs";

export async function GET() {
  try {
    const raw = fs.readFileSync(currentDownloadProgressFile(), "utf-8");
    return Response.json(JSON.parse(raw));
  } catch {
    return Response.json(null);
  }
}
