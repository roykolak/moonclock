import { getAnimationFrame, stopAnimationFrame } from "../animation";
import { MacroFn, Pixel } from "../types";
import { colorToRgba } from "../colors";

export const startTwinkle: MacroFn = async ({
  macroConfig,
  dimensions,
  index,
  updatePixels,
}) => {
  const config = {
    color: "#FFFFFF",
    speed: 10,
    amount: 50,
    width: dimensions.width,
    height: dimensions.height,
    ...macroConfig,
  };

  let timeoutId: NodeJS.Timeout;

  const twinklingCoordinates: any[] = [];

  for (let i = 0; i < config.amount; i++) {
    const y = Math.floor(Math.random() * (config.height - 1 - 0 + 1)) + 0;
    const x = Math.floor(Math.random() * (config.width - 1 - 0 + 1)) + 0;
    const a = Math.floor(Math.random() * (255 - 1 - 0 + 1)) + 0;
    twinklingCoordinates.push({ x, y, a, peaked: i % 2 });
  }

  const stepAmount = Math.floor(255 / 10);

  async function drawTwinkle() {
    const pixels: Pixel[] = [];

    const availableSlots = config.amount - twinklingCoordinates.length;

    for (let a = 0; a < availableSlots; a++) {
      const y = Math.floor(Math.random() * (config.height - 1 - 0 + 1)) + 0;
      const x = Math.floor(Math.random() * (config.width - 1 - 0 + 1)) + 0;
      twinklingCoordinates.push({ x, y, a: 0 });
    }

    for (let i = 0; i < twinklingCoordinates.length; i++) {
      const { x, y, a, peaked } = twinklingCoordinates[i];

      const rgba = await colorToRgba("#FFFFFF");

      pixels.push({
        x,
        y,
        rgba: new Uint8ClampedArray([rgba.r, rgba.g, rgba.b, a]),
      });

      if (a <= -1) {
        twinklingCoordinates.splice(i, 1);
        continue;
      }
      twinklingCoordinates[i] = {
        ...twinklingCoordinates[i],
        x,
        y,
        a: a + (peaked ? -stepAmount : stepAmount),
        ...(!peaked && a > 255 ? { peaked: true } : {}),
      };
    }

    updatePixels(pixels, index);

    timeoutId = getAnimationFrame(drawTwinkle, {
      framesPerSecond: config.speed,
    });
  }

  drawTwinkle();

  return () => {
    stopAnimationFrame(timeoutId);
  };
};
