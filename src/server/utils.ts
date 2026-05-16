import { exec } from "child_process";

export function reloadHardware() {
  log("Triggering hardware restart");
  exec("systemctl restart moonclock-hardware");
}

function log(message: string) {
  console.log(`[APP] ${message}`);
}

export function customScenesPath() {
  return process.env.NODE_ENV === "production"
    ? "/var/lib/moonclock/custom_scenes"
    : "./custom_scenes";
}

export function databaseFile() {
  return process.env.NODE_ENV === "production"
    ? "/var/lib/moonclock/database.json"
    : "./database.json";
}

export function currentInstallStepFile() {
  return process.env.NODE_ENV === "production"
    ? "/var/lib/moonclock/current_install_step.txt"
    : "./current_install_step.txt";
}

export function currentDownloadProgressFile() {
  return process.env.NODE_ENV === "production"
    ? "/var/lib/moonclock/current_download_progress.json"
    : "./current_download_progress.json";
}

export function releaseDownloadPath() {
  return process.env.NODE_ENV === "production"
    ? "/usr/local/bin/moonclock/release.tar.gz"
    : "./release.tar.gz";
}
