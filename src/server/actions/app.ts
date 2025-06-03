"use server";

import { exec } from "child_process";
import { promisify } from "util";
import { getData, setData } from "../db";

const execPromise = promisify(exec);

export async function updateNow() {
  try {
    const { nextVersion } = getData();

    if (!nextVersion) {
      throw new Error("No next version");
    }

    const { absoluteFilePath, version } = nextVersion;

    const { stderr } = await execPromise(
      `
      sudo mkdir -p "/usr/local/bin/moonclock/releases/${version}" &&
      sudo tar -xzvf ${absoluteFilePath} --strip-components=1 -C "/usr/local/bin/moonclock/releases/${version}" &&
      sudo ln -sfn "/usr/local/bin/moonclock/releases/${version}" /usr/local/bin/moonclock/current &&
      sudo cp /usr/local/bin/moonclock/current/custom_scenes/* /var/lib/moonclock/custom_scenes/
      sudo mc restart
    `,
      { maxBuffer: 10 * 1024 * 1024 } // 10 MB
    );

    if (stderr) {
      console.error("Error occurred:", stderr, version);
      return false;
    }

    setData({ nextVersion: null });
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
      updatedAt: new Date().toJSON(),
    },
  });
}
