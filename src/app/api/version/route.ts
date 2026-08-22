import packageInfo from "../../../../package.json";

// Reports the version of the release actually serving this request. Each release
// bundles its own package.json at build time, so during a restart the outgoing
// process still answers with the old number — which is exactly the signal
// UpdatePrompt needs to tell whether the new release is up yet.
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({ version: packageInfo.version });
}
