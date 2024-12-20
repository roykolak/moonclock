import fs from "fs";
import { LedMatrix, GpioMapping } from "rpi-led-matrix";
import { Command } from "commander";
import { Coordinates, Slot } from "./src/types";
import { get, set } from "./src/server/db";

export async function getSceneCoordinates(name: string) {
  const file = fs.readFileSync(`./scenes/${name}.json`).toString();
  return JSON.parse(file) as Coordinates;
}

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

const updateQueue: Coordinates[] = [];

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
    const coordinates = updateQueue.shift();

    for (const coordinate in coordinates) {
      const [x, y] = coordinate.split(":");
      matrix
        .brightness(parseInt(options.brightness, 10))
        .fgColor(parseInt(coordinates[coordinate], 16))
        .setPixel(parseInt(x, 10), parseInt(y, 10));
    }

    setTimeout(() => matrix.sync(), 0);
  });
  matrix.sync();
}

let currentActiveSlot: Slot | null = null;

setInterval(async () => {
  try {
    const activeSlot = await get<Slot>("activeSlot");

    if (
      activeSlot?.endTime !== null &&
      new Date().getTime() > new Date(activeSlot?.endTime).getTime()
    ) {
      console.log(`[CLEAR] ${activeSlot.sceneName} has expired`);
      return await set("activeSlot", null);
    }

    const activeSceneName = activeSlot?.sceneName || "nothing";
    const currentSceneName = currentActiveSlot?.sceneName || "nothing";

    const activeCoordinates = await getSceneCoordinates(activeSceneName);
    const currentCoordinates = await getSceneCoordinates(currentSceneName);

    if (
      JSON.stringify(currentCoordinates) !== JSON.stringify(activeCoordinates)
    ) {
      console.log(
        `[UPDATE] Rerendering ${activeSceneName} until ${activeSlot?.endTime}`
      );

      updateQueue.push(activeCoordinates);
    } else if (currentActiveSlot?.endTime !== activeSlot?.endTime) {
      console.log(
        `[UPDATE] ${activeSceneName} endTime changed to ${activeSlot.endTime}`
      );
    }

    currentActiveSlot = activeSlot;
  } catch (e) {
    console.log("Error!", e);
  }
}, 2000);
