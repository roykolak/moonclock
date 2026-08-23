"use client";

import { useCallback, useEffect, useState } from "react";
import { DeviceApi } from "@/client/deviceApi";
import { DeviceState } from "@/types";

const POLL_INTERVAL_MS = 5000;

export function useDeviceState(
  api: DeviceApi,
  initialState: DeviceState | null,
) {
  const [state, setState] = useState<DeviceState | null>(initialState);
  const [unreachable, setUnreachable] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setState(await api.getState());
      setUnreachable(false);
    } catch {
      setUnreachable(true);
    }
  }, [api]);

  useEffect(() => {
    refresh();
    const poll = setInterval(refresh, POLL_INTERVAL_MS);
    return () => clearInterval(poll);
  }, [refresh]);

  return { state, refresh, unreachable };
}
