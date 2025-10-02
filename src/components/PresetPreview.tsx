"use client";

import React, { useCallback, useEffect, useState } from "react";
import { createDisplayEngine, Macro, Pixel } from "../display-engine";
import { Preset } from "@/types";
import { transformPresetToDisplayMacros } from "@/server/actions/transformPresetToDisplayMacros";
import { Overlay } from "@mantine/core";
import fetchline from "fetchline";

const dimensions = { height: 32, width: 32 };

export function getRenderedCanvasDataUrl(
  canvas: HTMLCanvasElement,
  pixels: Pixel[]
) {
  const ctx = canvas.getContext("2d");

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

  return canvas.toDataURL("png");
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
    const canvas = document.createElement("canvas");

    canvas.width = 32;
    canvas.height = 32;

    (async () => {
      const displayEngine = createDisplayEngine({
        dimensions,
        fonts: {
          "4x6": await fetchline(`/fonts/4x6.bdf`),
        },
        onPixelsChange: (pixels) => {
          const dataUrl = getRenderedCanvasDataUrl(canvas, pixels);
          setImageData(dataUrl);
        },
      });

      setEngine(displayEngine);
    })();

    // return () => {
    //   displayEngine?.stop();
    // };
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
