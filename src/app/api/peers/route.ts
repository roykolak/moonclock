import { getData } from "@/server/db";
import { hardwareUrl } from "@/server/ports";

export const dynamic = "force-dynamic";

const TIMEOUT_MS = 2000;

export async function GET() {
  try {
    const response = await fetch(hardwareUrl("/api/peers"), {
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) throw new Error(`Status ${response.status}`);

    return Response.json(await response.json());
  } catch {
    return Response.json({ deviceId: getData().deviceId, devices: [] });
  }
}
