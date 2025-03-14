import { exec } from "child_process";

export function reloadHardware() {
  log("Triggering hardware restart");
  exec("systemctl restart moonclock-hardware");
}

function log(message: string) {
  console.log(`[APP] ${message}`);
}
