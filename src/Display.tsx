import React, { useCallback, useEffect, useState } from "react";
import { Dimensions, Macro } from "@bigdots-io/display-engine";
import { createDisplayEngine } from "@bigdots-io/display-engine";
import { createCanvas } from "canvas";

export default function Display({
  layers,
  dimensions,
}: {
  layers: Macro[];
  dimensions: Dimensions;
}) {
  const [imageData, setImageData] = useState<string>();
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
  }, [engine, JSON.stringify(layers)]);

  const renderDisplay = useCallback(() => {
    if (!engine) return;
    const halt = engine?.render(layers);
    setStop(() => halt);
  }, [engine, JSON.stringify(layers), setStop]);

  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "1 / 1",
        background: "#000",
        display: "flex",
      }}
    >
      <img
        src={imageData}
        width="100%"
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  );
}
