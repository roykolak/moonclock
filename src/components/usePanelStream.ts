"use client";

import { useEffect, useRef, useState } from "react";

type Coordinates = { [key: string]: string };

/** Subscribes to the hardware service's live pixel stream (SSE) and returns the
 *  current panel as a coordinate map (`"x:y" -> "#rrggbb"`).
 *
 *  `streamUrl` points at the mirror of whichever clock is being viewed, so the
 *  same hook renders a peer's panel as readily as this one's.
 *
 *  The server sends one `snapshot` event on connect, then `delta` events
 *  carrying only the pixels that changed — so a static scene produces no
 *  traffic. Each event replaces the map with a new object reference, so
 *  consumers can key a repaint off `coordinates` identity. */
export function usePanelStream(streamUrl: string): {
  coordinates: Coordinates;
  connected: boolean;
} {
  const [coordinates, setCoordinates] = useState<Coordinates>({});
  const [connected, setConnected] = useState(false);

  // Hold the map in a ref so delta merges don't depend on the latest render's
  // state closure.
  const coordinatesRef = useRef<Coordinates>({});

  useEffect(() => {
    const source = new EventSource(streamUrl);

    source.addEventListener("open", () => setConnected(true));

    source.addEventListener("snapshot", (event) => {
      coordinatesRef.current = JSON.parse(event.data);
      setCoordinates(coordinatesRef.current);
      setConnected(true);
    });

    source.addEventListener("delta", (event) => {
      coordinatesRef.current = {
        ...coordinatesRef.current,
        ...JSON.parse(event.data),
      };
      setCoordinates(coordinatesRef.current);
    });

    source.addEventListener("error", () => setConnected(false));

    return () => source.close();
  }, [streamUrl]);

  return { coordinates, connected };
}
