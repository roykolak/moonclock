import { getData } from "@/server/db";

export const dynamic = "force-dynamic";

const HARDWARE_PEERS_URL = "http://localhost:3001/api/peers";
const TIMEOUT_MS = 2000;

export async function GET() {
  try {
    const response = await fetch(HARDWARE_PEERS_URL, {
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) throw new Error(`Status ${response.status}`);

    return Response.json(await response.json());
  } catch {
    return Response.json({ deviceId: getData().deviceId, devices: [] });
  }
}
