import { moon } from "../scenes/moon";
import { MacroCoordinatesConfig, MacroFn } from "../types";
import { startCoordinates } from "./coordinates";

const PULSE_DURATION = 1;
const DELAY_BETWEEN_PIXELS = 1;
const MAX_ALPHA = 255;
const SEQUENCE_DELAY = 2.0;

const TOTAL_PIXELS = 4;
const SEQUENCE_DURATION = TOTAL_PIXELS * DELAY_BETWEEN_PIXELS + PULSE_DURATION;
const TOTAL_CYCLE_DURATION = SEQUENCE_DURATION + SEQUENCE_DELAY;

export const startMoon: MacroFn = async ({
  dimensions,
  ctx,
  index,
  updatePixels,
}) => {
  const coordinatesConfig: MacroCoordinatesConfig = {
    coordinates: moon,
  };

  const twinkleStars = [
    { y: 6, x: 5, startTime: 0, alpha: 0 },
    { y: 9, x: 15, startTime: 0, alpha: 0 },
    { y: 22, x: 30, startTime: 0, alpha: 0 },
    { y: 29, x: 12, startTime: 0, alpha: 0 },
  ];

  for (let i = 0; i < twinkleStars.length; i++) {
    twinkleStars[i] = {
      ...twinkleStars[i],
      startTime: i * DELAY_BETWEEN_PIXELS,
      alpha: 0,
    };
  }

  let lastTime = 0;
  let accumulator = 0;

  startCoordinates({
    dimensions,
    ctx,
    index,
    updatePixels,
    macroConfig: coordinatesConfig,
  });

  function runMoon(currentTime: number) {
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    accumulator += deltaTime;

    const sequenceTime = accumulator % TOTAL_CYCLE_DURATION;

    for (let i = 0; i < TOTAL_PIXELS; i++) {
      const pixelStartTime = i * DELAY_BETWEEN_PIXELS;
      const pixelTime = sequenceTime - pixelStartTime;

      if (
        pixelTime < 0 ||
        pixelTime > PULSE_DURATION ||
        sequenceTime > SEQUENCE_DURATION
      ) {
        const rgba = new Uint8ClampedArray([255, 255, 255, 0]);
        const star = twinkleStars[i];
        updatePixels(
          [
            { ...star, rgba },
            { ...star, y: star.y + 1, rgba },
            { ...star, y: star.y - 1, rgba },
            { ...star, x: star.x + 1, rgba },
            { ...star, x: star.x - 1, rgba },
          ],
          index + 1
        );
      } else {
        const alpha =
          Math.sin((pixelTime / PULSE_DURATION) * Math.PI) * MAX_ALPHA;
        const rgba = new Uint8ClampedArray([255, 255, 255, alpha]);
        const star = twinkleStars[i];
        updatePixels(
          [
            { ...star, rgba },
            {
              ...star,
              y: star.y + 1,
              rgba: new Uint8ClampedArray([255, 255, 255, alpha / 4]),
            },
            {
              ...star,
              y: star.y - 1,
              rgba: new Uint8ClampedArray([255, 255, 255, alpha / 4]),
            },
            {
              ...star,
              x: star.x + 1,
              rgba: new Uint8ClampedArray([255, 255, 255, alpha / 4]),
            },
            {
              ...star,
              x: star.x - 1,
              rgba: new Uint8ClampedArray([255, 255, 255, alpha / 4]),
            },
          ],
          index + 1
        );
      }
    }

    if (typeof window !== "undefined") {
      requestId = window.requestAnimationFrame(runMoon);
    } else {
      setImmediate(() => runMoon(startTime));
    }
  }

  startCoordinates({
    dimensions,
    ctx,
    index,
    updatePixels,
    macroConfig: coordinatesConfig,
  });

  let requestId: number;

  const startTime = performance.now();

  runMoon(startTime);

  return () => window.cancelAnimationFrame(requestId);
};
