import { coordinates, createDisplayEngine } from "@bigdots-io/display-engine";
import type { Pixel } from "@bigdots-io/display-engine";
import { LedMatrix, GpioMapping } from "rpi-led-matrix";
import fs from "fs";
import { Command } from "commander";

const program = new Command();

program
  .name("bigdots")
  .description("Power a hardware LED board")
  .version("0.1.0");

program
  .option("--brightness <number>")
  .option("--debug <boolean>")
  .option("--emulate <boolean>");

program.parse(process.argv);

const options = program.opts();

function getSceneData(name: string) {
  if (!name) return {};
  const file = fs.readFileSync(`./scenes/${name}.json`).toString();
  return JSON.parse(file);
}

function getDatabase() {
  const file = fs.readFileSync(`./database.json`).toString();
  return JSON.parse(file);
}

function setDatabase(data: any) {
  fs.writeFileSync("database.json", JSON.stringify(data, null, 2));
}

function RGBAToHexA(rgba: Uint8ClampedArray, forceRemoveAlpha = false) {
  const hexValues = [...rgba]
    .filter((_number, index) => !forceRemoveAlpha || index !== 3)
    .map((number, index) => (index === 3 ? Math.round(number * 255) : number))
    .map((number) => number.toString(16));

  return hexValues
    .map((string) => (string.length === 1 ? "0" + string : string)) // Adds 0 when length of one number is 1
    .join("");
}

const updateQueue: Pixel[][] = [];

if (!options.emulate) {
  const matrix = new LedMatrix(
    {
      ...LedMatrix.defaultMatrixOptions(),
      rows: 32,
      cols: 32,
      chainLength: 1,
      hardwareMapping: GpioMapping.Regular,
    },
    {
      ...LedMatrix.defaultRuntimeOptions(),
      gpioSlowdown: 2,
    }
  );
  matrix.afterSync(() => {
    if (options.debug && updateQueue.length > 0) {
      console.log("Queue:", updateQueue.length);
    }
    const pixelUpdates = updateQueue.shift();
    if (pixelUpdates) {
      for (const pixel of pixelUpdates) {
        matrix
          .brightness(parseInt(options.brightness, 10))
          .fgColor(
            parseInt(pixel.rgba ? RGBAToHexA(pixel.rgba, true) : "000000", 16)
          )
          .setPixel(pixel.x, pixel.y);
      }
    }
    setTimeout(() => matrix.sync(), 0);
  });
  matrix.sync();
}

const engine = createDisplayEngine({
  dimensions: {
    width: 32,
    height: 32,
  },
  onPixelsChange: (pixels) => {
    updateQueue.push(pixels);
  },
});

let currentActiveSlot: any = null;

setInterval(() => {
  try {
    const database = getDatabase();
    const { activeSlot } = database;

    if (
      activeSlot?.endTime !== null &&
      new Date().getTime() > new Date(activeSlot?.endTime).getTime()
    ) {
      database.activeSlot = null;
      return setDatabase(database);
    }

    const activeSlotScene = activeSlot?.scene || "nothing";

    const slotToActivateSceneData = getSceneData(activeSlotScene);

    const currentActiveSlotSceneData = getSceneData(
      currentActiveSlot?.scene || "nothing"
    );

    if (
      JSON.stringify(currentActiveSlotSceneData) !==
      JSON.stringify(slotToActivateSceneData)
    ) {
      console.log(
        `[UPDATE] Rerendering ${activeSlotScene} until ${activeSlot?.endTime}`
      );

      engine?.render([
        coordinates({
          coordinates: slotToActivateSceneData,
        }),
      ]);
    } else if (currentActiveSlot?.endTime !== activeSlot?.endTime) {
      console.log(
        `[UPDATE] ${activeSlotScene} endTime changed to ${activeSlot.endTime}`
      );
    }

    currentActiveSlot = activeSlot;
  } catch (e) {
    console.log("Error!", e);
  }
}, 2000);
