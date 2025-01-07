import { LedMatrix, GpioMapping } from "rpi-led-matrix";
import { Command } from "commander";
import { Coordinates } from "../src/types";
import { checkForUpdates } from "./checkForUpdates";

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

setInterval(async () => {
  for (const update of await checkForUpdates()) {
    updateQueue.push(update);
  }
}, 2000);
