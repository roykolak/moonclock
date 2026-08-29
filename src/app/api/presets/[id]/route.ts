import { getData, setData } from "@/server/db";
import { refreshHardwareScene } from "@/server/utils";
import { Preset } from "@/types";

interface Context {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: Context) {
  const { id } = await params;
  const preset: Preset = await request.json();
  const { presets, scheduledPreset } = getData();

  const target = presets.find((existing) => existing.id === id);

  if (!target) {
    return Response.json({ error: "No such preset" }, { status: 404 });
  }

  const updated = { ...preset, id };

  const active = scheduledPreset?.preset;
  const scheduled =
    active &&
    (active.id != null ? active.id === id : active.name === target.name)
      ? scheduledPreset
      : null;

  setData({
    presets: presets.map((existing) =>
      existing.id === id ? updated : existing,
    ),
    ...(scheduled
      ? { scheduledPreset: { ...scheduled, preset: updated } }
      : {}),
  });

  if (scheduled) await refreshHardwareScene();

  return Response.json(updated);
}

export async function DELETE(_request: Request, { params }: Context) {
  const { id } = await params;
  const { presets } = getData();

  setData({ presets: presets.filter((existing) => existing.id !== id) });

  return Response.json({ ok: true });
}
