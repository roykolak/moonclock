import os from "os";

export function getIpAddress() {
  const networkInterfaces = os.networkInterfaces();

  for (const interfaceName in networkInterfaces) {
    const interfaces = networkInterfaces[interfaceName] || [];

    for (const i of interfaces) {
      if (i.family === "IPv4" && !i.internal) {
        return i.address;
      }
    }
  }

  return null;
}

export async function waitForIpAddress(maxRetries = 30, delay = 2000) {
  for (let i = 0; i < maxRetries; i++) {
    const ip = getIpAddress();
    if (ip) {
      console.log(`Got IP address: ${ip}`);
      return ip;
    }
    console.log(`Waiting for IP address... (attempt ${i + 1}/${maxRetries})`);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  // Returning null (rather than throwing) lets the boot sequence fall through
  // to the WiFi setup prompt instead of crashing the hardware process when the
  // device has no network — the exact case provisioning exists to handle.
  console.log("Failed to get IP address after maximum retries");
  return null;
}
