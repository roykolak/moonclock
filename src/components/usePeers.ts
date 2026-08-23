"use client";

import { useEffect, useState } from "react";
import { DeviceApi } from "@/client/deviceApi";
import { Device } from "@/types";

const POLL_INTERVAL_MS = 5000;

export function usePeers(api: DeviceApi): Device[] {
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const listing = await api.getPeers();
        if (cancelled) return;
        setDevices((current) =>
          JSON.stringify(current) === JSON.stringify(listing.devices)
            ? current
            : listing.devices,
        );
      } catch {
        if (!cancelled) setDevices([]);
      }
    };

    load();
    const poll = setInterval(load, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(poll);
    };
  }, [api]);

  return devices;
}
