import { moon } from "../scenes/moon";
import { MacroCoordinatesConfig, MacroFn } from "../types";
import { startCoordinates } from "./coordinates";

const PULSE_DURATION = 1;
const DELAY_BETWEEN_PIXELS = 1;
const MAX_ALPHA = 255;
const SEQUENCE_DELAY = 5.0;

const TOTAL_PIXELS = 4;
const SEQUENCE_DURATION = TOTAL_PIXELS * DELAY_BETWEEN_PIXELS + PULSE_DURATION;
const TOTAL_CYCLE_DURATION = SEQUENCE_DURATION + SEQUENCE_DELAY;

const GLOW_RGB = [15, 10, 222];

const TWINKLE_STARS = [
  { y: 6, x: 5 },
  { y: 9, x: 15 },
  { y: 22, x: 30 },
  { y: 29, x: 12 },
];

function shuffle(unshuffled: any[]) {
  return unshuffled
    .map((value) => ({ ...value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map((value) => value);
}

export const startMoon: MacroFn = async ({
  dimensions,
  ctx,
  index,
  updatePixels,
}) => {
  const coordinatesConfig: MacroCoordinatesConfig = {
    coordinates: moon,
  };

  let twinkleStars = shuffle(TWINKLE_STARS);

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
    if (accumulator > TOTAL_CYCLE_DURATION) {
      accumulator = 0;
      twinkleStars = shuffle(TWINKLE_STARS);
    }

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

        const star = twinkleStars[i];

        const starRgba = new Uint8ClampedArray([255, 255, 255, alpha]);
        const glowRgba = new Uint8ClampedArray([...GLOW_RGB, alpha / 2]);

        updatePixels(
          [
            { ...star, rgba: starRgba },
            {
              ...star,
              y: star.y + 1,
              rgba: glowRgba,
            },
            {
              ...star,
              y: star.y - 1,
              rgba: glowRgba,
            },
            {
              ...star,
              x: star.x + 1,
              rgba: glowRgba,
            },
            {
              ...star,
              x: star.x - 1,
              rgba: glowRgba,
            },
          ],
          index + 1
        );
      }
    }

    if (typeof window !== "undefined") {
      requestId = window.requestAnimationFrame(runMoon);
    } else {
      requestId = setImmediate(() => runMoon(startTime));
    }
  }

  startCoordinates({
    dimensions,
    ctx,
    index,
    updatePixels,
    macroConfig: coordinatesConfig,
  });

  let requestId: NodeJS.Immediate | number;

  const startTime = performance.now();

  runMoon(startTime);

  return () => {
    if (typeof window !== "undefined") {
      window.cancelAnimationFrame(requestId as number);
    } else {
      clearImmediate(requestId as NodeJS.Immediate);
    }
  };
};
