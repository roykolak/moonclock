import { getData, setData } from "@/server/db";
import { refreshHardwareScene } from "@/server/utils";
import { Setup } from "@/types";

export async function PUT(request: Request) {
  const changes: Partial<Setup> = await request.json();
  const { setup } = getData();

  setData({
    setup: {
      completedAt: setup?.completedAt ?? null,
      testPatternUntil: setup?.testPatternUntil ?? null,
      ...changes,
    },
  });

  await refreshHardwareScene();

  return Response.json({ ok: true });
}
