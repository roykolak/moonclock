"use client";

import type { Scene } from "@/display-engine";
import { useScenePreview } from "./useScenePreview";

/** Renders a raw coordinate map directly, bypassing the scene catalog and
 *  Preset entirely — this is the live-panel mirror (HardwareSettings'
 *  preview), a runtime pixel snapshot with no scene of its own. */
function coordinatesScene(coordinatesMap: { [key: string]: string }): Scene {
  return {
    draw({ ctx }) {
      for (const key in coordinatesMap) {
        const hex = coordinatesMap[key];
        if (!hex) continue;

        const [x, y] = key.split(":").map((n) => parseInt(n, 10));
        if (!Number.isFinite(x) || !Number.isFinite(y)) continue;

        ctx.fillStyle = hex;
        ctx.fillRect(x, y, 1, 1);
      }
    },
  };
}

export function HardwarePreview({
  coordinates,
}: {
  coordinates: { [key: string]: string };
}) {
  const scene = coordinatesScene(coordinates);
  const imageData = useScenePreview(scene, JSON.stringify(coordinates));

  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "1 / 1",
        background: "#000",
        display: "flex",
      }}
    >
      {imageData && (
        <img
          alt="hardware mirror scene"
          src={imageData}
          style={{ imageRendering: "pixelated" }}
          width="100%"
        />
      )}
    </div>
  );
}
