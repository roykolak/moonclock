"use client";

import { Overlay } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { usePanelStream } from "./usePanelStream";

const SIZE = 32;

/** Renders exactly what the hardware is currently displaying, streamed pixel by
 *  pixel over SSE. The colours arrive already final (opaque `#rrggbb`), so we
 *  paint them straight onto a 32×32 canvas — no display engine, scene, or font
 *  loading needed. Repaints whenever the streamed coordinate map changes. Shows
 *  a blank panel until the stream connects. */
export function LivePanelPreview({
  isDefaultPreset = false,
}: {
  isDefaultPreset?: boolean;
}) {
  const { coordinates, connected } = usePanelStream();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);

  useEffect(() => {
    const canvas =
      canvasRef.current ??
      (canvasRef.current = document.createElement("canvas"));
    canvas.width = SIZE;
    canvas.height = SIZE;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, SIZE, SIZE);

    for (const key in coordinates) {
      const hex = coordinates[key];
      if (!hex) continue;

      const [x, y] = key.split(":").map((n) => parseInt(n, 10));
      if (!Number.isFinite(x) || !Number.isFinite(y)) continue;

      ctx.fillStyle = hex;
      ctx.fillRect(x, y, 1, 1);
    }

    setImageData(canvas.toDataURL("image/png"));
  }, [coordinates]);

  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "1 / 1",
        background: "#000",
        display: "flex",
      }}
    >
      {connected && imageData && (
        <img
          alt="live panel mirror"
          src={imageData}
          style={{ imageRendering: "pixelated" }}
          width="100%"
        />
      )}
      {isDefaultPreset && (
        <Overlay color="#000" backgroundOpacity={0.85} zIndex={0} />
      )}
    </div>
  );
}
