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
    ? "../../custom_scenes"
    : "./custom_scenes";
}

export function heartBeatFile() {
  return process.env.NODE_ENV === "production"
    ? "../../hardware/lastHeartbeat.txt"
    : "./hardware/lastHeartbeat.txt";
}
