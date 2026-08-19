"use client";

import { useEffect, useRef, useState } from "react";

type Coordinates = { [key: string]: string };

/** Subscribes to the hardware service's live pixel stream (SSE) and returns the
 *  current panel as a coordinate map (`"x:y" -> "#rrggbb"`).
 *
 *  The server sends one `snapshot` event on connect, then `delta` events
 *  carrying only the pixels that changed — so a static scene produces no
 *  traffic. `version` increments on every message so consumers can cheaply key
 *  a re-render without diffing/serialising the whole map. */
export function usePanelStream(): {
  coordinates: Coordinates;
  version: number;
  connected: boolean;
} {
  const [coordinates, setCoordinates] = useState<Coordinates>({});
  const [version, setVersion] = useState(0);
  const [connected, setConnected] = useState(false);

  // Hold the map in a ref so delta merges don't depend on the latest render's
  // state closure.
  const coordinatesRef = useRef<Coordinates>({});

  useEffect(() => {
    const source = new EventSource(
      `http://${window.location.hostname}:3001/api/panel/stream`,
    );

    source.addEventListener("open", () => setConnected(true));

    source.addEventListener("snapshot", (event) => {
      coordinatesRef.current = JSON.parse(event.data);
      setCoordinates(coordinatesRef.current);
      setVersion((v) => v + 1);
      setConnected(true);
    });

    source.addEventListener("delta", (event) => {
      coordinatesRef.current = {
        ...coordinatesRef.current,
        ...JSON.parse(event.data),
      };
      setCoordinates(coordinatesRef.current);
      setVersion((v) => v + 1);
    });

    source.addEventListener("error", () => setConnected(false));

    return () => source.close();
  }, []);

  return { coordinates, version, connected };
}
