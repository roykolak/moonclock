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
