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
