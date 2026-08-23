import { exec } from "child_process";
import { hardwareUrl } from "./ports";

export function reloadHardware() {
  log("Triggering hardware restart");
  exec("systemctl restart moonclock-hardware");
}

export function rebootMachine() {
  log("Triggering machine reboot");
  exec("reboot");
}

function log(message: string) {
  console.log(`[APP] ${message}`);
}

export async function refreshHardwareScene() {
  try {
    await fetch(hardwareUrl("/api/reload"));
  } catch {
    log("Hardware service unreachable; skipping scene refresh");
  }
}

export function databaseFile() {
  if (process.env.MOONCLOCK_DATABASE) return process.env.MOONCLOCK_DATABASE;

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
