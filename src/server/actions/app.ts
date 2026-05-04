"use server";

import { exec } from "child_process";
import { getData, setData } from "../db";

export async function startUpdate() {
  try {
    const { nextVersion } = getData();

    if (nextVersion?.updateStartedAt) return;

    if (!nextVersion) {
      throw new Error("No next version");
    }

    setData({
      nextVersion: {
        ...nextVersion,
        updateStartedAt: new Date().toJSON(),
      },
    });

    const { absoluteFilePath } = nextVersion;

    exec(`{
      sudo mkdir -p "/usr/local/bin/moonclock/update" &&
      sudo tar -xzvf ${absoluteFilePath} --strip-components=1 -C "/usr/local/bin/moonclock/update" &&
      cd /usr/local/bin/moonclock/update/ &&
      sudo ./install.sh
    } 2>&1 | while IFS= read -r line; do echo "[$(date '+%Y-%m-%d %H:%M:%S')] $line"; done | tee /tmp/moonclock-update.log`);
  } catch (e) {
    console.log("Error trying to update!", e);
    return false;
  }
}

export async function markAsUpdated() {
  const { nextVersion } = getData();

  if (!nextVersion) return;

  setData({
    nextVersion: {
      ...nextVersion,
      updateFinishedAt: new Date().toJSON(),
    },
  });
}
