import { exec } from "child_process";
import fs from "fs";
import { pipeline, Readable, Transform } from "stream";
import { promisify } from "util";
import packageInfo from "../../package.json";
import { getData, setData } from "@/server/db";
import {
  currentDownloadProgressFile,
  releaseDownloadPath,
} from "@/server/utils";
import { selectEligibleRelease } from "@/helpers/selectEligibleRelease";
import { DownloadProgress, UpdateCheck } from "@/types";

const pipelineAsync = promisify(pipeline);

export async function checkForUpdate(): Promise<UpdateCheck> {
  try {
    const url = `https://api.github.com/repos/roykolak/moonclock/releases`;
    const releases = await fetch(url).then((response) => response.json());

    const { panel, nextVersion } = getData();
    const channel = panel?.updateChannel ?? "stable";

    const eligible = selectEligibleRelease(
      releases,
      channel,
      packageInfo.version,
    );

    if (!eligible) {
      if (nextVersion) setData({ nextVersion: null });
      return { message: "Up to date.", available: false };
    }

    setData({
      nextVersion: {
        version: eligible.version,
        releaseNotes: eligible.release.body,
        downloadUrl: eligible.asset.browser_download_url,
        absoluteFilePath: releaseDownloadPath(),
        downloadedAt: null,
        updateFinishedAt: null,
        updateStartedAt: null,
      },
    });

    return {
      message: `Update available - ${eligible.version}`,
      available: true,
      version: eligible.version,
    };
  } catch (e) {
    console.log(e);
    return { message: "Error checking for update", available: false };
  }
}

function writeProgress(progress: DownloadProgress) {
  fs.writeFileSync(currentDownloadProgressFile(), JSON.stringify(progress), {
    mode: 0o666,
  });
}

function readProgress(): DownloadProgress | null {
  try {
    return JSON.parse(fs.readFileSync(currentDownloadProgressFile(), "utf-8"));
  } catch {
    return null;
  }
}

async function runDownload(version: string, downloadUrl: string) {
  try {
    writeProgress({
      version,
      status: "downloading",
      bytesDownloaded: 0,
      totalBytes: 0,
    });

    const response = await fetch(downloadUrl);
    if (!response.ok) {
      throw new Error(`Failed to download asset: ${response.status}`);
    }

    const totalBytes = Number(response.headers.get("content-length") || 0);
    let bytesDownloaded = 0;
    let lastWriteAt = 0;

    const tracker = new Transform({
      transform(chunk, _enc, cb) {
        bytesDownloaded += chunk.length;
        const now = Date.now();
        if (now - lastWriteAt > 250) {
          lastWriteAt = now;
          writeProgress({
            version,
            status: "downloading",
            bytesDownloaded,
            totalBytes,
          });
        }
        cb(null, chunk);
      },
    });

    const savePath = releaseDownloadPath();
    fs.rmSync(savePath, { force: true });

    await pipelineAsync(
      Readable.fromWeb(response.body as any),
      tracker,
      fs.createWriteStream(savePath),
    );

    writeProgress({
      version,
      status: "complete",
      bytesDownloaded,
      totalBytes: totalBytes || bytesDownloaded,
    });

    const { nextVersion } = getData();
    if (nextVersion?.version === version) {
      setData({
        nextVersion: { ...nextVersion, downloadedAt: new Date().toJSON() },
      });
    }
  } catch (e) {
    console.log("Download failed", e);
    writeProgress({
      version,
      status: "error",
      bytesDownloaded: 0,
      totalBytes: 0,
      message: e instanceof Error ? e.message : String(e),
    });
  }
}

export function startDownload() {
  const { nextVersion } = getData();

  if (!nextVersion) return;

  if (nextVersion.downloadedAt && fs.existsSync(nextVersion.absoluteFilePath)) {
    writeProgress({
      version: nextVersion.version,
      status: "complete",
      bytesDownloaded: 0,
      totalBytes: 0,
    });
    return;
  }

  if (!nextVersion.downloadUrl) {
    writeProgress({
      version: nextVersion.version,
      status: "error",
      bytesDownloaded: 0,
      totalBytes: 0,
      message: "Stale update record — please check for update again.",
    });
    return;
  }

  const progress = readProgress();
  if (
    progress?.status === "downloading" &&
    progress.version === nextVersion.version
  ) {
    return;
  }

  void runDownload(nextVersion.version, nextVersion.downloadUrl);
}

export function startUpdate() {
  const { nextVersion } = getData();

  if (!nextVersion || nextVersion.updateStartedAt) return;

  setData({
    nextVersion: { ...nextVersion, updateStartedAt: new Date().toJSON() },
  });

  exec(`{
    sudo mkdir -p "/usr/local/bin/moonclock/update" &&
    sudo tar -xzf ${nextVersion.absoluteFilePath} --strip-components=1 -C "/usr/local/bin/moonclock/update" &&
    cd /usr/local/bin/moonclock/update/ &&
    sudo ./install.sh
  }`);
}
