import { setData } from "@/server/db";
import packageInfo from "../../../../package.json";
import { log } from "console";
import { pipeline, Readable } from "stream";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";

const pipelineAsync = promisify(pipeline);
const execPromise = promisify(exec);

export async function PUT() {
  let message: string = "";

  log("Checking for update");

  try {
    const url = `https://api.github.com/repos/roykolak/moonclock/releases`;
    const releases = await fetch(url).then((response) => response.json());

    const latestRelease = releases[0];

    if (!latestRelease) {
      const message = "No release found.";
      console.log(message);
      return Response.json({ message });
    }

    const asset = latestRelease.assets[0];

    if (!asset) {
      const message = "No asset found.";
      console.log(message);
      return Response.json({ message });
    }

    const latestVersion = latestRelease.tag_name.replace("v", "");

    if (latestVersion === packageInfo.version) {
      const message = "Up to date.";
      console.log(message);
      return Response.json({ message });
    }

    const downloadUrl = asset.browser_download_url;
    const fileName = asset.name;

    console.log(`Downloading ${fileName} from ${downloadUrl}...`);

    const assetResponse = await fetch(downloadUrl);
    if (!assetResponse.ok) {
      throw new Error(`Failed to download asset: ${assetResponse.status}`);
    }

    const readableStream = Readable.fromWeb(assetResponse.body as any);

    const savePath = "/usr/local/bin/moonclock/release.tar.gz";

    await execPromise(`rm -f ${savePath}`);

    const fileStream = fs.createWriteStream(savePath);
    await pipelineAsync(readableStream, fileStream);

    console.log(`Downloaded and saved as ${savePath}, ${latestVersion}`);

    setData({
      nextVersion: {
        version: latestVersion,
        releaseNotes: latestRelease.body,
        updateFinishedAt: null,
        updateStartedAt: null,
        absoluteFilePath: savePath,
      },
    });

    message = "Update available - " + latestVersion;
  } catch (e) {
    log(e);
    message = "Error checking for update";
  }

  log(message);

  return Response.json({ message });
}
