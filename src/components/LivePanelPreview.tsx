"use client";

import type { Scene } from "@/display-engine";
import { Overlay } from "@mantine/core";
import { useScenePreview } from "./useScenePreview";
import { usePanelStream } from "./usePanelStream";

/** Builds a Scene that paints a raw coordinate map (`"x:y" -> "#rrggbb"`)
 *  straight onto the canvas — the live-panel mirror has no scene of its own. */
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

/** Renders exactly what the hardware is currently displaying, streamed pixel by
 *  pixel over SSE. Shows a blank panel until the stream connects. The `version`
 *  counter (bumped per stream message) keys the re-render, avoiding a
 *  per-frame JSON.stringify of the whole coordinate map. */
export function LivePanelPreview({
  isDefaultPreset = false,
}: {
  isDefaultPreset?: boolean;
}) {
  const { coordinates, version, connected } = usePanelStream();

  const scene = coordinatesScene(coordinates);
  const imageData = useScenePreview(scene, String(version));

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
