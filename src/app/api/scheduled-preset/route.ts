import { setData } from "@/server/db";
import { refreshHardwareScene } from "@/server/utils";
import { ScheduledPreset } from "@/types";

export async function PUT(request: Request) {
  const body: Partial<ScheduledPreset> = await request.json();

  setData({
    scheduledPreset: {
      preset: null,
      endTime: null,
      ...body,
      updatedAt: new Date().toJSON(),
    },
  });

  await refreshHardwareScene();

  return Response.json({ ok: true });
}
