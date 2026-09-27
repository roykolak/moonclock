"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Device, PeerListing } from "@/types";

const POLL_INTERVAL_MS = 5000;

export interface Peers {
  devices: Device[];
  searching: boolean;
  search: () => Promise<void>;
}

export function usePeers(): Peers {
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
      const response = await fetch("/api/peers", { cache: "no-store" });
      const listing: PeerListing = await response.json();
      if (!mounted.current) return;
      setDevices((current) =>
        JSON.stringify(current) === JSON.stringify(listing.devices)
          ? current
          : listing.devices,
      );
    } catch {
      if (mounted.current) setDevices([]);
    }
  }, []);

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
      await fetch("/api/peers/refresh", { method: "POST" });
      await load();
    } catch {
    } finally {
      if (mounted.current) setSearching(false);
    }
  }, [load]);

  return { devices, searching, search };
}
