import { MacroFn, MacroPromptConfig, Pixel } from "../types";
import { colorToRgba } from "./ripple";
import { generatePixelArt } from "../../server/actions/generatePixelArt";
import { getAnimationFrame, stopAnimationFrame } from "../animation";

export const startPrompt: MacroFn = async ({
  macroConfig,
  index,
  updatePixels,
}) => {
  const config = {
    prompt: "",
    executedPrompt: "",
    ...macroConfig,
  } as MacroPromptConfig;

  // Use executedPrompt if available, otherwise fall back to prompt
  const promptToExecute = config.executedPrompt;

  if (!promptToExecute) {
    console.error("Prompt macro requires a prompt to execute");
    return () => {};
  }

  let loadingBit = false;
  let loadingIntervalId: NodeJS.Timeout | null = null;

  // Start loading animation
  const drawLoading = () => {
    loadingBit = !loadingBit;
    const loadingPixels: Pixel[] = [];

    const blueRgba = colorToRgba("#6495ED");
    const yellowRgba = colorToRgba("#facc0d");
    const blackRgba = colorToRgba("#000000");

    loadingPixels.push({
      y: 0,
      x: 0,
      rgba: new Uint8ClampedArray(
        loadingBit
          ? [blueRgba.r, blueRgba.g, blueRgba.b, blueRgba.a]
          : [blackRgba.r, blackRgba.g, blackRgba.b, blackRgba.a]
      ),
    });

    loadingPixels.push({
      y: 1,
      x: 0,
      rgba: new Uint8ClampedArray(
        loadingBit
          ? [blackRgba.r, blackRgba.g, blackRgba.b, blackRgba.a]
          : [yellowRgba.r, yellowRgba.g, yellowRgba.b, yellowRgba.a]
      ),
    });

    updatePixels(loadingPixels, index);
    loadingIntervalId = getAnimationFrame(drawLoading, { framesPerSecond: 2 });
  };

  drawLoading();

  // Generate pixel art (this happens while loading animation is running)
  const result = await generatePixelArt(promptToExecute);

  // Stop loading animation
  if (loadingIntervalId) {
    stopAnimationFrame(loadingIntervalId);
  }

  // Clear loading pixels by setting them to null (transparent)
  const clearLoadingPixels: Pixel[] = [
    {
      y: 0,
      x: 0,
      rgba: null,
    },
    {
      y: 1,
      x: 0,
      rgba: null,
    },
  ];
  updatePixels(clearLoadingPixels, index);

  if (!result.success || !result.coordinates) {
    console.error("Failed to generate pixel art:", result.error);
    return () => {};
  }

  const pixels: Pixel[] = [];

  for (const coordinate in result.coordinates) {
    const hexColor = result.coordinates[coordinate];

    if (!hexColor) continue;

    const rgba = colorToRgba(hexColor);
    const [x, y] = coordinate.split(":");

    pixels.push({
      y: parseInt(y, 10),
      x: parseInt(x, 10),
      rgba: new Uint8ClampedArray([rgba.r, rgba.g, rgba.b, rgba.a]),
    });
  }

  updatePixels(pixels, index);

  return () => {};
};
