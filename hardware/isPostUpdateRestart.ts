import fs from "fs";

const CURRENT_RELEASE_SYMLINK = "/usr/local/bin/moonclock/current";

export function isPostUpdateRestart(
  thresholdSeconds = 60,
  symlinkPath = CURRENT_RELEASE_SYMLINK,
) {
  try {
    const { mtimeMs } = fs.lstatSync(symlinkPath);
    return (Date.now() - mtimeMs) / 1000 <= thresholdSeconds;
  } catch {
    return false;
  }
}
