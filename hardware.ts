import fs from "fs";
import { LedMatrix, GpioMapping } from "rpi-led-matrix";
import { Command } from "commander";
import { Coordinates, HeartBeat, Slot } from "./src/types";
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
  console.log("Starting Hardware...");
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
      const hex = coordinates[coordinate]?.replace("#", "") || "000000";
      matrix
        .brightness(parseInt(options.brightness, 10))
        .fgColor(parseInt(hex, 16))
        .setPixel(parseInt(x, 10), parseInt(y, 10));
    }

    setTimeout(() => matrix.sync(), 0);
  });
  matrix.sync();
} else {
  console.log("Skipping hardware...");
}

let currentSlot: Slot | null = null;

const resetCoordinates: Coordinates = {};

for (let x = 0; x < 32; x++) {
  for (let y = 0; y < 32; y++) {
    resetCoordinates[`${x}:${y}`] = "#000000";
  }
}

setInterval(async () => {
  const now = new Date().toJSON();

  const heartBeat = await get<HeartBeat>("heartBeat");
  heartBeat.lastCheckedAt = now;

  try {
    const slot = await get<Slot>("slot");

    if (
      slot?.endTime !== null &&
      new Date().getTime() > new Date(slot?.endTime).getTime()
    ) {
      console.log(`[CLEAR] ${slot.sceneName} has expired`);

      heartBeat.lastUpdatedAt = now;

      await set("heartBeat", heartBeat);
      await set("slot", null);

      return;
    }

    const activeSceneName = slot?.sceneName || "nothing";
    const currentSceneName = currentSlot?.sceneName || "nothing";

    const activeCoordinates = await getSceneCoordinates(activeSceneName);
    const currentCoordinates = await getSceneCoordinates(currentSceneName);

    if (
      JSON.stringify(currentCoordinates) !== JSON.stringify(activeCoordinates)
    ) {
      console.log(
        `[UPDATE] Rerendering ${activeSceneName} until ${slot?.endTime}`
      );

      heartBeat.lastUpdatedAt = now;

      updateQueue.push(resetCoordinates);
      updateQueue.push(activeCoordinates);
    } else if (currentSlot?.endTime !== slot?.endTime) {
      console.log(
        `[UPDATE] ${activeSceneName} endTime changed to ${slot.endTime}`
      );
      heartBeat.lastUpdatedAt = now;
    }

    set("heartBeat", heartBeat);

    currentSlot = slot;
  } catch (e) {
    console.log("Error!", e);
  }
}, 2000);
