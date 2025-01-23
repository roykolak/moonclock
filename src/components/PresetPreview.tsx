"use client";

import React, { useCallback, useEffect, useState } from "react";
import { createDisplayEngine, Macro } from "../display-engine";
import { createCanvas } from "canvas";
import { Preset, PresetField } from "@/types";
import { transformPresetToDisplayMacros } from "@/server/transformPresetToDisplayMacros";

const dimensions = { height: 32, width: 32 };

interface DisplayProps {
  preset?: Preset;
}

export function PresetPreview({ preset }: DisplayProps) {
  const [imageData, setImageData] = useState<string | null>();

  const [engine, setEngine] = useState<any>();
  const [stop, setStop] = useState<any>();

  const [displayConfig, setDisplayConfig] = useState<Macro[]>([]);

  useEffect(() => {
    (async () => {
      setDisplayConfig(await transformPresetToDisplayMacros(preset || null));
    })();
  }, [preset]);

  useEffect(() => {
    const canvas = createCanvas(dimensions.width, dimensions.height);
    const ctx = canvas.getContext("2d");

    setEngine(
      createDisplayEngine({
        dimensions,
        onPixelsChange: (pixels) => {
          pixels.forEach((pixel) => {
            if (!pixel.rgba) return;

            const id = ctx.createImageData(1, 1);
            const d = id.data;
            d[0] = pixel.rgba[0];
            d[1] = pixel.rgba[1];
            d[2] = pixel.rgba[2];
            d[3] = pixel.rgba[3];
            ctx.putImageData(id, pixel.x, pixel.y);
          });

          const dataURL = canvas.toDataURL("image/png");
          setImageData(dataURL);
        },
      })
    );
  }, []);

  useEffect(() => {
    renderDisplay();
  }, [engine, JSON.stringify(displayConfig)]);

  const renderDisplay = useCallback(() => {
    if (!engine) return;
    if (stop) stop();

    const halt = engine?.render(displayConfig);
    setStop(() => () => halt);
  }, [engine, JSON.stringify(displayConfig), setStop]);

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
          alt={`${preset?.[PresetField.Scenes][0].sceneName} scene`}
          src={imageData}
          style={{ imageRendering: "pixelated" }}
        />
      )}
    </div>
  );
}
