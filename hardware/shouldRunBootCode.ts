import os from "os";
import fs from "fs";

function getSystemUptimeMinutes() {
  try {
    const uptime = fs.readFileSync("/proc/uptime", "utf8").split(" ")[0];
    return parseFloat(uptime) / 60;
  } catch {
    return os.uptime() / 60;
  }
}

export function shouldRunBootCode(thresholdMinutes = 1) {
  try {
    const uptimeMinutes = getSystemUptimeMinutes();

    return uptimeMinutes <= thresholdMinutes;
  } catch (error) {
    console.error("Error checking uptime:", error);
    return false;
  }
}
