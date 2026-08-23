import { getData, setData } from "@/server/db";
import { Preset } from "@/types";

interface Context {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: Context) {
  const { id } = await params;
  const preset: Preset = await request.json();
  const { presets } = getData();

  if (!presets.some((existing) => existing.id === id)) {
    return Response.json({ error: "No such preset" }, { status: 404 });
  }

  setData({
    presets: presets.map((existing) =>
      existing.id === id ? { ...preset, id } : existing,
    ),
  });

  return Response.json({ ...preset, id });
}

export async function DELETE(_request: Request, { params }: Context) {
  const { id } = await params;
  const { presets } = getData();

  setData({ presets: presets.filter((existing) => existing.id !== id) });

  return Response.json({ ok: true });
}
