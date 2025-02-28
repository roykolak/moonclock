import fs from "fs";

export function reloadHardware() {
  log("Triggering hardware restart");
  fs.closeSync(fs.openSync("restart-hardware", "w"));
}

function log(message: string) {
  console.log(`[APP] ${message}`);
}
