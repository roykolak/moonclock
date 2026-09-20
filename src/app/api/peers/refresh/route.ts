import { hardwareUrl } from "@/server/ports";

export const dynamic = "force-dynamic";

// Held open until the clock has finished listening, so the caller can show
// the search running for exactly as long as it actually runs.
const TIMEOUT_MS = 15000;

export async function POST() {
  try {
    await fetch(hardwareUrl("/api/peers/refresh"), {
      method: "POST",
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {}

  return Response.json({ ok: true });
}
