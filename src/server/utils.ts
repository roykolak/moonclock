import { exec } from "child_process";

export function reloadHardware() {
  log("Triggering hardware restart");
  exec("systemctl restart moonclock-hardware");
}

function log(message: string) {
  console.log(`[APP] ${message}`);
}

export function customScenesPath() {
  return process.env.NODE_ENV ? "./custom_scenes" : "../../custom_scenes";
}
