import { getData, setData } from "@/server/db";
import { Preset } from "@/types";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  const preset: Preset = await request.json();
  const { presets } = getData();

  const created = { ...preset, id: randomUUID() };
  setData({ presets: [...presets, created] });

  return Response.json(created);
}
