import { LedMatrix, GpioMapping } from "rpi-led-matrix";
import { checkForNewDisplayConfig } from "./checkForNewDisplayConfig";
import { createDisplayEngine, Pixel } from "../src/display-engine";
import { getData } from "@/server/db";
import { transformPresetToDisplayMacros } from "@/server/actions/transformPresetToDisplayMacros";
import { PanelField } from "@/types";

(async () => {
  const args = process.argv.slice(2);
  const params: any = { emulate: false };

  args.forEach((arg) => {
    if (arg.startsWith("--")) {
      const key = arg.substring(2);
      params[key] = true;
    }
  });

  const { panel, hardware } = await getData();

  const updateQueue: Pixel[][] = [];

  function RGBAToHexA(rgba: Uint8ClampedArray, forceRemoveAlpha = false) {
    const hexValues = [...rgba]
      .filter((_number, index) => !forceRemoveAlpha || index !== 3)
      .map((number, index) => (index === 3 ? Math.round(number * 255) : number))
      .map((number) => number.toString(16));

    return hexValues
      .map((string) => (string.length === 1 ? "0" + string : string)) // Adds 0 when length of one number is 1
      .join("");
  }

  if (!params.emulate) {
    console.log("Starting Hardware...");
    const matrix = new LedMatrix(
      {
        ...LedMatrix.defaultMatrixOptions(),
        rows: 32,
        cols: 32,
        chainLength: 1,
        hardwareMapping: GpioMapping.Regular,
        pwmLsbNanoseconds: panel[PanelField.PwnLsbNanoseconds],
        pwmBits: panel[PanelField.PwmBits],
      },
      {
        ...LedMatrix.defaultRuntimeOptions(),
        gpioSlowdown: panel[PanelField.GpioSlowdown],
      }
    );
    matrix.afterSync(() => {
      const pixelUpdates = updateQueue.shift();
      if (pixelUpdates) {
        for (const pixel of pixelUpdates) {
          matrix
            .brightness(panel[PanelField.Brightness])
            .fgColor(
              parseInt(pixel.rgba ? RGBAToHexA(pixel.rgba, true) : "000000", 16)
            )
            .setPixel(pixel.x, pixel.y);
        }
      }
      setTimeout(() => matrix.sync(), 0);
    });
    matrix.sync();
  } else {
    console.log("Skipping hardware...");
  }

  const engine = createDisplayEngine({
    dimensions: { width: 32, height: 32 },
    onPixelsChange: (pixels) => {
      updateQueue.push(pixels);
    },
  });

  engine.render(await transformPresetToDisplayMacros(hardware.preset));

  setInterval(async () => {
    const displayConfig = await checkForNewDisplayConfig();

    if (displayConfig) {
      engine.render(displayConfig);
    }
  }, 2000);
})();
