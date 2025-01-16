"use client";

import React, { useCallback, useEffect, useState } from "react";
import { createDisplayEngine, Macro } from "../../shared/display-engine";
import { createCanvas } from "canvas";
import { SceneName } from "@/types";

const dimensions = { height: 32, width: 32 };

interface DisplayProps {
  scene: SceneName | undefined;
  displayConfig: Macro[] | undefined;
}

export function SlotPreview({ scene, displayConfig }: DisplayProps) {
  const [imageData, setImageData] = useState<string | null>();

  const [engine, setEngine] = useState<any>();
  const [stop, setStop] = useState<any>();

  useEffect(() => {
    const canvas = createCanvas(dimensions.width, dimensions.height);
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

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
    console.log("useCallback", displayConfig);
    const halt = engine?.render(displayConfig);
    setStop(() => halt);
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
          alt={`${scene} scene`}
          src={imageData}
          width="100%"
          style={{ imageRendering: "pixelated" }}
        />
      )}
    </div>
  );
}
