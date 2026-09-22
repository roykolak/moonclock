import {
  Device,
  DeviceState,
  Panel,
  Preset,
  ScheduledPreset,
  Setup,
} from "@/types";

export interface DownloadProgress {
  version: string;
  status: "downloading" | "complete" | "error";
  bytesDownloaded: number;
  totalBytes: number;
  message?: string;
}

export interface UpdateCheck {
  message: string;
  available: boolean;
  version?: string;
}

export interface UpdateStatus {
  version: string;
  step: string;
}

export interface PeerListing {
  deviceId: string;
  devices: Device[];
}

export interface DeviceApi {
  isLocal: boolean;
  panelStreamUrl: string;
  logsStreamUrl: string;
  getState(): Promise<DeviceState>;
  getPeers(): Promise<PeerListing>;
  refreshPeers(): Promise<void>;
  setScheduledPreset(scheduledPreset: Partial<ScheduledPreset>): Promise<void>;
  createPreset(preset: Preset): Promise<void>;
  updatePreset(preset: Preset): Promise<void>;
  deletePreset(id: string): Promise<void>;
  updatePanel(panel: Panel): Promise<void>;
  updateSetup(setup: Partial<Setup>): Promise<void>;
  resetDatabase(): Promise<void>;
  reloadHardware(): Promise<void>;
  rebootMachine(): Promise<void>;
  pressButton(): Promise<void>;
  checkForUpdate(): Promise<UpdateCheck>;
  startDownload(): Promise<void>;
  getDownloadProgress(): Promise<DownloadProgress | null>;
  startUpdate(): Promise<void>;
  completeUpdate(): Promise<void>;
  getUpdateStatus(): Promise<UpdateStatus>;
}

const REQUEST_TIMEOUT_MS = 8000;
const SEARCH_TIMEOUT_MS = 20000;

function createDeviceApi(
  appOrigin: string,
  hardwareOrigin: string,
  isLocal: boolean,
): DeviceApi {
  async function request(
    path: string,
    method = "GET",
    body?: unknown,
    timeoutMs: number = REQUEST_TIMEOUT_MS,
  ) {
    const response = await fetch(`${appOrigin}${path}`, {
      method,
      cache: "no-store",
      headers:
        body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (!response.ok) {
      throw new Error(`${method} ${path} failed (${response.status})`);
    }

    return response;
  }

  async function json<T>(path: string, method = "GET", body?: unknown) {
    return (await request(path, method, body)).json() as Promise<T>;
  }

  async function send(
    path: string,
    method: string,
    body?: unknown,
    timeoutMs?: number,
  ) {
    await request(path, method, body, timeoutMs);
  }

  return {
    isLocal,
    panelStreamUrl: `${hardwareOrigin}/api/panel/stream`,
    logsStreamUrl: `${appOrigin}/api/logs/stream`,
    getState: () => json<DeviceState>("/api/state"),
    getPeers: () => json<PeerListing>("/api/peers"),
    refreshPeers: () =>
      send("/api/peers/refresh", "POST", undefined, SEARCH_TIMEOUT_MS),
    setScheduledPreset: (scheduledPreset) =>
      send("/api/scheduled-preset", "PUT", scheduledPreset),
    createPreset: (preset) => send("/api/presets", "POST", preset),
    updatePreset: (preset) => send(`/api/presets/${preset.id}`, "PUT", preset),
    deletePreset: (id) => send(`/api/presets/${id}`, "DELETE"),
    updatePanel: (panel) => send("/api/panel", "PUT", panel),
    updateSetup: (setup) => send("/api/setup", "PUT", setup),
    resetDatabase: () => send("/api/db", "DELETE"),
    reloadHardware: () => send("/api/hardware/reload", "POST"),
    rebootMachine: () => send("/api/reboot", "POST"),
    pressButton: async () => {
      await fetch(`${hardwareOrigin}/api/button-press`, {
        method: "POST",
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
    },
    checkForUpdate: () => json<UpdateCheck>("/api/check-for-update", "PUT"),
    startDownload: () => send("/api/download-update", "POST"),
    getDownloadProgress: () =>
      json<DownloadProgress | null>("/api/current-download-progress"),
    startUpdate: () => send("/api/update/start", "POST"),
    completeUpdate: () => send("/api/update/complete", "POST"),
    getUpdateStatus: () => json<UpdateStatus>("/api/update-status"),
  };
}

export function localDeviceApi(hardwarePort: number): DeviceApi {
  const hostname =
    typeof window === "undefined" ? "localhost" : window.location.hostname;

  return createDeviceApi("", `http://${hostname}:${hardwarePort}`, true);
}

function unreachableDeviceApi(): DeviceApi {
  const fail = () =>
    Promise.reject(new Error("This clock has no reachable address"));

  return {
    isLocal: false,
    panelStreamUrl: "",
    logsStreamUrl: "",
    getState: fail,
    getPeers: fail,
    refreshPeers: fail,
    setScheduledPreset: fail,
    createPreset: fail,
    updatePreset: fail,
    deletePreset: fail,
    updatePanel: fail,
    updateSetup: fail,
    resetDatabase: fail,
    reloadHardware: fail,
    rebootMachine: fail,
    pressButton: fail,
    checkForUpdate: fail,
    startDownload: fail,
    getDownloadProgress: fail,
    startUpdate: fail,
    completeUpdate: fail,
    getUpdateStatus: fail,
  };
}

export function remoteDeviceApi(device: Device): DeviceApi {
  if (!device.address) return unreachableDeviceApi();

  const appPort = device.port === 80 ? "" : `:${device.port}`;

  return createDeviceApi(
    `http://${device.address}${appPort}`,
    `http://${device.address}:${device.hardwarePort}`,
    false,
  );
}
