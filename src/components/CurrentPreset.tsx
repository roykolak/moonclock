"use client";

import React, { useEffect, useRef } from "react";
import { Preset } from "@/types";
import { Overlay } from "@mantine/core";
import { colorToRgba } from "@/display-engine/macros/ripple";

interface DisplayProps {
  preset?: Preset;
  isDefaultPreset?: boolean;
}

export function CurrentPreset({ isDefaultPreset = false }: DisplayProps) {
  const ref = useRef(null);

  useEffect(() => {
    const eventSource = new EventSource(
      `http://${window.location.hostname}:3001/api/events`
    );

    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
    };

    eventSource.onopen = () => {
      console.log("SSE connected");
    };

    eventSource.onmessage = async function (event) {
      const data = JSON.parse(event.data);

      const pixels = data.data;

      if (!pixels) return;

      const canvas = ref.current as unknown as HTMLCanvasElement;

      const ctx = canvas?.getContext("2d");

      for (const key of Object.keys(pixels)) {
        const rgb = await colorToRgba(pixels[key]);

        const id = ctx?.createImageData(1, 1);

        if (!id || !rgb) continue;

        const d = id.data;
        d[0] = rgb.r;
        d[1] = rgb.g;
        d[2] = rgb.b;
        d[3] = 255;

        const [x, y] = key.split(":");

        ctx?.putImageData(id, parseInt(x, 10), parseInt(y, 10));
      }
    };

    return () => {
      console.log("SSE disconnected");
      eventSource.close();
    };
  }, []);

  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "1 / 1",
        background: "#000",
        display: "flex",
      }}
    >
      <canvas
        ref={ref}
        width={32}
        height={32}
        style={{
          imageRendering: "pixelated",
          width: "100%",
          height: "100%",
        }}
      />
      {isDefaultPreset && (
        <Overlay color="#000" backgroundOpacity={0.85} zIndex={0} />
      )}
    </div>
  );
}
