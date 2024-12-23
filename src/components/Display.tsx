"use client";

import React, { useEffect, useState } from "react";
import { Scene } from "../types";

const dimensions = { height: 32, width: 32 };

interface DisplayProps {
  scene: Scene | undefined;
}

export default function Display({ scene }: DisplayProps) {
  const [imageData, setImageData] = useState<string | null>();

  useEffect(() => {
    if (!scene) {
      return setImageData(null);
    }

    const canvas = document.createElement("canvas");
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    for (const coordinate in scene.coordinates) {
      ctx.fillStyle = scene.coordinates[coordinate];
      const [x, y] = coordinate.split(":");
      ctx.fillRect(parseInt(x, 10), parseInt(y, 10), 1, 1);
    }

    const dataURL = canvas.toDataURL("image/png");
    setImageData(dataURL);
  }, [JSON.stringify(scene)]);

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
          src={imageData}
          width="100%"
          style={{ imageRendering: "pixelated" }}
        />
      )}
    </div>
  );
}
