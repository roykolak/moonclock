import packageInfo from "../../../../package.json";
import { currentInstallStepFile } from "@/server/utils";
import fs from "fs";

// Everything UpdatePrompt needs to follow an update, in one request.
//
// `version` is the release actually serving this request — each release bundles
// its own package.json at build time, so during a restart the outgoing process
// still reports the old number. That makes it a complete signal on its own: the
// old version means keep waiting, a failed request means the app is between
// processes, and the expected version means the update landed.
//
// `step` is the human-readable progress line install.sh writes. It is display
// only; nothing keys off its contents, which is what lets the install script
// change its wording or its timing without stranding a waiting client.
export const dynamic = "force-dynamic";

export async function GET() {
  let step = "";

  try {
    step = fs.readFileSync(currentInstallStepFile()).toString();
  } catch {}

  return Response.json({ version: packageInfo.version, step });
}
