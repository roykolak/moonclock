import fs from "fs";

export function reloadHardware() {
  fs.closeSync(fs.openSync("restart-hardware", "w"));
}
