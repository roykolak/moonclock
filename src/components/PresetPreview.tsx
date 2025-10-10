"use client";

import React, { useCallback, useEffect, useState } from "react";
import { createDisplayEngine, Dimensions, Macro } from "../display-engine";
import { Preset } from "@/types";
import { transformPresetToDisplayMacros } from "@/server/actions/transformPresetToDisplayMacros";
import { Overlay } from "@mantine/core";

const dimensions = { height: 32, width: 32 };

export async function createCanvas(dimensions: Dimensions) {
  const { width, height } = dimensions;

  const tiny5Font = new FontFace("Tiny5", "url(/fonts/Tiny5-Regular.ttf)");
  const loadedTiny5Font = await tiny5Font.load();

  document.fonts.add(loadedTiny5Font);

  await document.fonts.ready;

  const canvas = document.createElement("canvas");

  canvas.width = width;
  canvas.height = height;

  return canvas;
}

interface DisplayProps {
  preset?: Preset;
  isDefaultPreset?: boolean;
}

export function PresetPreview({
  preset,
  isDefaultPreset = false,
}: DisplayProps) {
  const [imageData, setImageData] = useState<string | null>();

  const [engine, setEngine] = useState<any>();

  const [displayConfig, setDisplayConfig] = useState<Macro[]>([]);

  useEffect(() => {
    (async () => {
      setDisplayConfig(await transformPresetToDisplayMacros(preset || null));
    })();
  }, [JSON.stringify(preset)]);

  useEffect(() => {
    (async () => {
      const canvas = await createCanvas(dimensions);
      const ctx = canvas.getContext("2d");

      const displayEngine = createDisplayEngine({
        dimensions,
        createCanvas,
        onPixelsChange: (pixels) => {
          requestAnimationFrame(() => {
            for (const pixel of pixels) {
              if (!pixel.rgba) return;

              const id = ctx?.createImageData(1, 1);

              if (!id) continue;

              const d = id.data;

              d[0] = pixel.rgba[0];
              d[1] = pixel.rgba[1];
              d[2] = pixel.rgba[2];
              d[3] = pixel.rgba[3];

              ctx?.putImageData(id, pixel.x, pixel.y);
            }

            const dataURL = canvas.toDataURL("png");
            setImageData(dataURL);
          });
        },
      });

      setEngine(displayEngine);
    })();

    return () => engine?.stop();
  }, []);

  useEffect(() => {
    renderDisplay();
  }, [engine, JSON.stringify(displayConfig)]);

  const renderDisplay = useCallback(() => {
    if (!engine) return;
    engine?.render(displayConfig);
  }, [engine, JSON.stringify(displayConfig)]);

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
          alt={`${preset?.scenes.map((s) => s.sceneName).join(", ")} scene`}
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
