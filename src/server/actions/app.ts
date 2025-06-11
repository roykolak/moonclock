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

    const logFile = "/tmp/moonclock-update.log";

    const { stdout, stderr } = await execPromise(
      `
  {
    sudo mkdir -p "/usr/local/bin/moonclock/update" &&
    sudo tar -xzvf ${absoluteFilePath} --strip-components=1 -C "/usr/local/bin/moonclock/update" &&
    cd /usr/local/bin/moonclock/update/ &&
    sudo ./install.sh &&
    cd /usr/local/bin/moonclock &&
    sudo rm -fr /usr/local/bin/moonclock/update &&
    sudo mc restart
  } 2>&1 | tee ${logFile}
  `,
      { maxBuffer: 50 * 1024 * 1024 } // Increased to 50 MB
    );

    console.log("Command output:", stdout);

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
