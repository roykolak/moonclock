"use client";

import { Preset, PresetField } from "@/types";
import { Overlay } from "@mantine/core";
import { useScenePreview } from "./useScenePreview";
import { getScene } from "@/helpers/getScene";

interface DisplayProps {
  preset: Preset;
  isDefaultPreset?: boolean;
  /** Stop the engine's animation loop after the first rendered frame.
   *  Use for thumbnails (e.g. the scene picker) so N previews don't each
   *  run their own live setTimeout loop concurrently. */
  staticFrame?: boolean;
}

export function PresetPreview({
  preset,
  isDefaultPreset = false,
  staticFrame = false,
}: DisplayProps) {
  const scene = getScene(preset[PresetField.SceneId]);
  const imageData = useScenePreview(scene, preset?.sceneId ?? "", {
    staticFrame,
  });

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
          alt={`${preset?.sceneId ?? "blank"} scene`}
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
