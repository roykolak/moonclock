import { getAnimationFrame, stopAnimationFrame } from "../animation";
import { MacroFn, Pixel } from "../types";

export function colorToRgba(hexOrRgbString: string) {
  if (hexOrRgbString.includes("rgb")) {
    const result = hexOrRgbString.match(
      /^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i
    );
    if (result) {
      return {
        r: parseInt(result[1], 10),
        g: parseInt(result[2], 10),
        b: parseInt(result[3], 10),
        a: parseInt(result[4], 10) || 255,
      };
    }
  } else {
    // Try 8-digit hex with alpha first (#rrggbbaa)
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
      hexOrRgbString
    );
    if (result) {
      return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: parseInt(result[4], 16),
      };
    }

    // Fall back to 6-digit hex without alpha (#rrggbb)
    result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
      hexOrRgbString
    );
    if (result) {
      return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: 255,
      };
    }
  }

  return { r: 0, g: 0, b: 0, a: 0 };
}

export const startRipple: MacroFn = async ({
  macroConfig,
  dimensions,
  index,
  updatePixels,
}) => {
  const config = {
    width: dimensions.width,
    height: dimensions.height,
    speed: 5,
    waveHeight: 5,
    color: "#ffffff",
    ...macroConfig,
  };

  const { height, width, speed, waveHeight, color } = config;

  let timeoutId: NodeJS.Timeout;

  function drawRipple(timestamp: number) {
    const pixels: Pixel[] = [];

    const elapsedTimeUnits = (timestamp - startTime) / (240 - speed * 20);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const reIndexedX = -(width - x - width / 2);
        const reIndexedY = height - y - height / 2;

        const distance = Math.hypot(reIndexedX, reIndexedY);
        const calculatedWaveHeight = Math.sin(
          (distance - elapsedTimeUnits) / waveHeight
        );

        const adjustedHeight = calculatedWaveHeight * 60 + 100 / 2;

        const rgba = colorToRgba(color);
        const alpha = (adjustedHeight / 100) * (rgba?.a as number);

        pixels.push({
          x,
          y,
          rgba: new Uint8ClampedArray([rgba.r, rgba.g, rgba.b, alpha]),
        });
      }
    }

    updatePixels(pixels, index);

    timeoutId = getAnimationFrame(drawRipple, { framesPerSecond: speed });
  }

  const startTime = performance.now();

  drawRipple(startTime);

  return () => {
    stopAnimationFrame(timeoutId);
  };
};
