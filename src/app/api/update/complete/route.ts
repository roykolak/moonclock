import { getData, setData } from "@/server/db";

export async function POST() {
  const { nextVersion } = getData();

  if (!nextVersion) return Response.json({ ok: true });

  setData({
    nextVersion: { ...nextVersion, updateFinishedAt: new Date().toJSON() },
  });

  return Response.json({ ok: true });
}
