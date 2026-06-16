"use client";

import { HardwareState } from "@/types";
import { Alert, Loader } from "@mantine/core";
import { useEffect, useState } from "react";
import { HardwareSettings } from "./HardwareSettings";

export function HardwarePage() {
  const [hardwareState, setHardwareState] = useState<HardwareState | null>(
    null,
  );
  const [connected, setConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const loop = setInterval(() => {
      fetch(`http://${window.location.hostname}:3001/api/state`)
        .then((response) => response.json())
        .then((data) => {
          setHardwareState(data);
          setConnected(true);
        })
        .catch(() => setConnected(false));
    }, 250);

    return () => clearInterval(loop);
  }, []);

  if (connected === null) return <Loader />;

  if (!connected)
    return (
      <Alert color="gray" title="Hardware not connected">
        The hardware service is not reachable. Make sure the device is on and
        the hardware service is running.
      </Alert>
    );

  return <HardwareSettings hardwareState={hardwareState} />;
}
