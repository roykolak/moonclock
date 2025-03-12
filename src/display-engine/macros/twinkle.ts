import { getAnimationFrame, stopAnimationFrame } from "../animation";
import { syncFromCanvas } from "../canvas";
import { MacroFn } from "../types";
import { colorToRgba } from "./ripple";

export const startTwinkle: MacroFn = async ({
  macroConfig,
  dimensions,
  ctx,
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

  const { color, speed, amount, height, width } = config;

  let timeoutId: NodeJS.Timeout;

  const twinklingCoordinates: any[] = [];

  for (let i = 0; i < amount; i++) {
    const y = Math.floor(Math.random() * (height - 1 - 0 + 1)) + 0;
    const x = Math.floor(Math.random() * (width - 1 - 0 + 1)) + 0;
    const a = Math.floor(Math.random() * (255 - 1 - 0 + 1)) + 0;
    twinklingCoordinates.push({ x, y, a, peaked: i % 2 });
  }

  const stepAmount = Math.floor(255 / speed);

  function drawTwinkle() {
    const availableSlots = amount - twinklingCoordinates.length;

    for (let a = 0; a < availableSlots; a++) {
      const y = Math.floor(Math.random() * (height - 1 - 0 + 1)) + 0;
      const x = Math.floor(Math.random() * (width - 1 - 0 + 1)) + 0;
      twinklingCoordinates.push({ x, y, a: 0 });
    }

    for (let i = 0; i < twinklingCoordinates.length; i++) {
      const { x, y, a, peaked } = twinklingCoordinates[i];

      const rgba = colorToRgba(color);

      const id = ctx.createImageData(1, 1);
      const d = id.data;

      d[0] = rgba?.r as number;
      d[1] = rgba?.g as number;
      d[2] = rgba?.b as number;
      d[3] = a;

      ctx.putImageData(id, x, y);

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
    const pixels = syncFromCanvas(ctx, dimensions);
    updatePixels(pixels, index);

    timeoutId = getAnimationFrame(drawTwinkle);
  }

  drawTwinkle();

  return () => {
    stopAnimationFrame(timeoutId);
  };
};
