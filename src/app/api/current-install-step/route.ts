import { currentInstallStepFile } from "@/server/utils";
import fs from "fs";

export async function GET() {
  let step: string = "";

  try {
    step = fs.readFileSync(currentInstallStepFile()).toString();
  } catch {}

  return Response.json({ step });
}
