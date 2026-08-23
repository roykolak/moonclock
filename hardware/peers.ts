import type { Device } from "@/types";

export interface DiscoveredService {
  name?: string;
  host?: string;
  port?: number;
  addresses?: string[];
  txt?: { [key: string]: unknown };
}

const IPV4 = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
const LINK_LOCAL_PREFIX = "169.254.";
const DEFAULT_HARDWARE_PORT = 3001;

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function routableIpv4(addresses: string[] = []) {
  return (
    addresses.find(
      (address) => IPV4.test(address) && !address.startsWith(LINK_LOCAL_PREFIX),
    ) ?? null
  );
}

function withoutTrailingDot(host: string) {
  return host.replace(/\.$/, "");
}

function portOrDefault(value: unknown, fallback: number) {
  const parsed = Number(text(value));
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function toDevice(service: DiscoveredService): Device | null {
  const id = text(service.txt?.id);
  if (!id) return null;

  const advertisedHost = text(service.host);
  const host = withoutTrailingDot(
    advertisedHost || (service.name ? `${service.name}.local` : ""),
  );
  if (!host) return null;

  return {
    id,
    name: text(service.txt?.name) || host.replace(/\.local$/, ""),
    version: text(service.txt?.version),
    host,
    address: routableIpv4(service.addresses),
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
