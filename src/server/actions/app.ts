"use server";

import { exec } from "child_process";
import { version } from "../../../package.json";
import fs from "fs";
import { pipeline, Readable } from "stream";
import { promisify } from "util";

const pipelineAsync = promisify(pipeline);
const execPromise = promisify(exec);

export async function checkForNewRelease() {
  try {
    const url = `https://api.github.com/repos/roykolak/moonclock/releases`;
    const releases = await fetch(url).then((response) => response.json());

    const latestRelease = releases[0];

    if (!latestRelease) {
      console.log("No releases found.");
      return;
    }

    const latestVersion = latestRelease.tag_name.replace("v", "");

    // Compare versions
    return latestVersion !== version;
  } catch {
    return false;
  }
}

export async function updateNow() {
  try {
    const url = `https://api.github.com/repos/roykolak/moonclock/releases`;
    const releases = await fetch(url).then((response) => response.json());

    const latestRelease = releases[0];
    const latestVersion = latestRelease.tag_name;

    if (!latestRelease) {
      console.log("No releases found.");
      return;
    }

    const asset = latestRelease.assets[0];

    if (!asset) {
      console.log("No assets found in the latest release.");
      return;
    }

    const downloadUrl = asset.browser_download_url;
    const fileName = asset.name;

    console.log(`Downloading ${fileName} from ${downloadUrl}...`);

    // Step 2: Download the asset
    const assetResponse = await fetch(downloadUrl);
    if (!assetResponse.ok) {
      throw new Error(`Failed to download asset: ${assetResponse.status}`);
    }

    const readableStream = Readable.fromWeb(assetResponse.body as any);

    const savePath = "/usr/local/bin/moonclock/release.tar.gz";

    const fileStream = fs.createWriteStream(savePath);
    await pipelineAsync(readableStream, fileStream);

    console.log(`Downloaded and saved as ${savePath}, ${latestVersion}`);

    const { stderr } = await execPromise(
      `
      sudo mkdir -p "/usr/local/bin/moonclock/releases/${latestVersion}" &&
      sudo tar -xzvf ${savePath} --strip-components=1 -C "/usr/local/bin/moonclock/releases/${latestVersion}" &&
      sudo ln -sfn "/usr/local/bin/moonclock/releases/${latestVersion}" /usr/local/bin/moonclock/current &&
      sudo cp /usr/local/bin/moonclock/current/custom_scenes/* /var/lib/moonclock/custom_scenes/
      sudo mc restart
      sudo rm ${savePath}
    `
    );

    if (stderr) {
      console.error("Error occurred:", stderr, latestVersion);
      return false;
    }
    console.error("Successfully updated!", latestVersion);
    return true;
  } catch (e) {
    console.log("Error trying to update!", e);
    return false;
  }
}
