"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DeviceApi } from "@/client/deviceApi";
import { Device } from "@/types";

const POLL_INTERVAL_MS = 5000;

export interface Peers {
  devices: Device[];
  searching: boolean;
  search: () => Promise<void>;
}

export function usePeers(api: DeviceApi): Peers {
  const [devices, setDevices] = useState<Device[]>([]);
  const [searching, setSearching] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const load = useCallback(async () => {
    try {
      const listing = await api.getPeers();
      if (!mounted.current) return;
      setDevices((current) =>
        JSON.stringify(current) === JSON.stringify(listing.devices)
          ? current
          : listing.devices,
      );
    } catch {
      if (mounted.current) setDevices([]);
    }
  }, [api]);

  useEffect(() => {
    load();
    const poll = setInterval(load, POLL_INTERVAL_MS);

    return () => clearInterval(poll);
  }, [load]);

  // The request is held open until the clock has finished listening, so the
  // search runs for exactly as long as the clock is actually searching.
  const search = useCallback(async () => {
    setSearching(true);

    try {
      await api.refreshPeers();
      await load();
    } catch {
    } finally {
      if (mounted.current) setSearching(false);
    }
  }, [api, load]);

  return { devices, searching, search };
}
