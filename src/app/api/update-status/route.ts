import packageInfo from "../../../../package.json";
import { currentInstallStepFile } from "@/server/utils";
import fs from "fs";

export const dynamic = "force-dynamic";

export async function GET() {
  let step = "";

  try {
    step = fs.readFileSync(currentInstallStepFile()).toString();
  } catch {}

  return Response.json({ version: packageInfo.version, step });
}
