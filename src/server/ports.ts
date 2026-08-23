const DEFAULT_APP_PORT = 80;
const DEFAULT_HARDWARE_PORT = 3001;

function port(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function appPort() {
  return port(process.env.MOONCLOCK_APP_PORT, DEFAULT_APP_PORT);
}

export function hardwarePort() {
  return port(process.env.MOONCLOCK_HARDWARE_PORT, DEFAULT_HARDWARE_PORT);
}

export function hardwareUrl(path: string) {
  return `http://localhost:${hardwarePort()}${path}`;
}
