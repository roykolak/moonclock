import type { Device } from "@/types";

export interface DiscoveredService {
  name?: string;
  port?: number;
  referer?: { address?: string };
  txt?: { [key: string]: unknown };
}

const IPV4 = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
const DEFAULT_HARDWARE_PORT = 3001;

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function portOrDefault(value: unknown, fallback: number) {
  const parsed = Number(text(value));
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function toDevice(service: DiscoveredService): Device | null {
  const id = text(service.txt?.id);
  const address = text(service.referer?.address);
  if (!id || !IPV4.test(address)) return null;

  return {
    id,
    name: text(service.txt?.name) || text(service.name) || address,
    version: text(service.txt?.version),
    address,
    port: service.port || 80,
    hardwarePort: portOrDefault(
      service.txt?.hardwarePort,
      DEFAULT_HARDWARE_PORT,
    ),
  };
}

export function collectDevices(
  services: DiscoveredService[],
  selfId: string,
): Device[] {
  const byId = new Map<string, Device>();

  for (const service of services) {
    const device = toDevice(service);
    if (!device || device.id === selfId) continue;
    byId.set(device.id, device);
  }

  return [...byId.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function advertisedName(hostname: string, deviceId: string) {
  const label = hostname.split(".")[0];
  const suffix = deviceId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8);

  return suffix ? `${label}-${suffix}` : label;
}

export interface PeerBrowser {
  services: DiscoveredService[];
  stop(): void;
}

export function createPeerDirectory(openBrowser: () => PeerBrowser) {
  let serving = openBrowser();
  let pending: PeerBrowser | null = null;

  return {
    get services() {
      return serving.services;
    },
    startRefresh() {
      if (pending) return false;
      pending = openBrowser();
      return true;
    },
    finishRefresh() {
      if (!pending) return;
      serving.stop();
      serving = pending;
      pending = null;
    },
  };
}
