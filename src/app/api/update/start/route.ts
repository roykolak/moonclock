import { exec } from "child_process";
import { getData, setData } from "@/server/db";

export async function POST() {
  const { nextVersion } = getData();

  if (!nextVersion) {
    return Response.json({ error: "No next version" }, { status: 409 });
  }

  if (nextVersion.updateStartedAt) {
    return Response.json({ ok: true, alreadyStarted: true });
  }

  setData({
    nextVersion: { ...nextVersion, updateStartedAt: new Date().toJSON() },
  });

  exec(`{
    sudo mkdir -p "/usr/local/bin/moonclock/update" &&
    sudo tar -xzf ${nextVersion.absoluteFilePath} --strip-components=1 -C "/usr/local/bin/moonclock/update" &&
    cd /usr/local/bin/moonclock/update/ &&
    sudo ./install.sh
  }`);

  return Response.json({ ok: true });
}
