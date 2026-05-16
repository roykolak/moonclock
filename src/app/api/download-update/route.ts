import { getData, setData } from "@/server/db";
import {
  currentDownloadProgressFile,
  releaseDownloadPath,
} from "@/server/utils";
import fs from "fs";
import { pipeline, Readable, Transform } from "stream";
import { promisify } from "util";

const pipelineAsync = promisify(pipeline);

function writeProgress(progress: {
  version: string;
  status: "downloading" | "complete" | "error";
  bytesDownloaded: number;
  totalBytes: number;
  message?: string;
}) {
  fs.writeFileSync(currentDownloadProgressFile(), JSON.stringify(progress), {
    mode: 0o666,
  });
}

function readProgress() {
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

export async function POST() {
  const { nextVersion } = getData();

  if (!nextVersion) {
    return Response.json({ status: "no-update" });
  }

  if (nextVersion.downloadedAt && fs.existsSync(nextVersion.absoluteFilePath)) {
    writeProgress({
      version: nextVersion.version,
      status: "complete",
      bytesDownloaded: 0,
      totalBytes: 0,
    });
    return Response.json({ status: "already-downloaded" });
  }

  if (!nextVersion.downloadUrl) {
    writeProgress({
      version: nextVersion.version,
      status: "error",
      bytesDownloaded: 0,
      totalBytes: 0,
      message: "Stale update record — please check for update again.",
    });
    return Response.json({ status: "stale" });
  }

  const progress = readProgress();
  if (
    progress?.status === "downloading" &&
    progress.version === nextVersion.version
  ) {
    return Response.json({ status: "in-progress" });
  }

  void runDownload(nextVersion.version, nextVersion.downloadUrl);

  return Response.json({ status: "started" });
}
