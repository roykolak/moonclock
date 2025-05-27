import { LedMatrix, GpioMapping } from "rpi-led-matrix";
import { checkForNewDisplayConfig } from "./checkForNewDisplayConfig";
import {
  createDisplayEngine,
  Macro,
  marquee,
  text,
  Pixel,
} from "../src/display-engine";
import { getData } from "@/server/db";
import { transformPresetToDisplayMacros } from "@/server/actions/transformPresetToDisplayMacros";
import { PanelField, Preset, QueuedFramesSnapshot } from "@/types";

import express from "express";
import { getIpAddress } from "./getIpAddress";

let syncSpeed = 0;

(async () => {
  const args = process.argv.slice(2);
  const params: any = { emulate: false };

  args.forEach((arg) => {
    if (arg.startsWith("--")) {
      const key = arg.substring(2);
      params[key] = true;
    }
  });

  function recordQueuedFramesSnapshot(count: number) {
    queuedFramesSnapshots.push({
      timestamp: Date.now(),
      count: count > 50 ? 75 : count,
    });

    if (queuedFramesSnapshots.length > 2000) {
      queuedFramesSnapshots.shift();
    }
  }

  const app = express();
  const port = 3001;

  app.use((req: any, res: any, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // Allow all origins
    res.header("Access-Control-Allow-Methods", "GET");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    // Handle preflight requests
    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }

    next();
  });

  app.use(express.json());

  app.get("/api/state", (req, res) => {
    res.send({
      queuedFramesSnapshots,
      preset,
      renderedAt,
      lastLoopRunAt,
      syncSpeed,
    });
  });

  app.post("/api/throttle", (req, res) => {
    syncSpeed = req.body.value;
    res.send(true);
  });

  app.listen(port, () => {
    console.log(`[HARDWARE] Server running on port ${port}`);
  });

  const { panel } = await getData();

  let displayConfig: Macro[] = await transformPresetToDisplayMacros(
    panel.defaultPreset
  );
  let preset: Preset = panel.defaultPreset;
  let renderedAt: string = new Date().toJSON();
  let lastLoopRunAt: string = "";

  let updateQueue: Pixel[][] = [];
  let queuedFramesSnapshots: QueuedFramesSnapshot[] = [];

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
    console.log("[HARDWARE] Initing LED Matrix...");
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

      recordQueuedFramesSnapshot(updateQueue.length);

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

      setTimeout(() => {
        matrix.sync();
      }, syncSpeed);
    });
    matrix.sync();
  } else {
    function fakeSync() {
      updateQueue.shift();

      recordQueuedFramesSnapshot(updateQueue.length);

      setTimeout(fakeSync, syncSpeed);
    }
    fakeSync();
    console.log("[HARDWARE] Emulating LED Matrix...");
  }

  const engine = createDisplayEngine({
    dimensions: { width: 32, height: 32 },
    onPixelsChange: (pixels) => {
      updateQueue.push(pixels);
    },
  });

  engine.render([
    text({
      text: "Starting",
      color: "#AAA",
      fontSize: 9,
      startingRow: 1,
    }),
    marquee({
      text: getIpAddress() || "",
      direction: "horizontal",
      speed: 20,
      startingRow: 12,
      fontSize: 16,
      color: "#DDD",
    }),
  ]);

  await new Promise((resolve) => setTimeout(resolve, 6000));

  setInterval(async () => {
    lastLoopRunAt = new Date().toJSON();

    const result = await checkForNewDisplayConfig(preset);

    if (result) {
      updateQueue = [];
      queuedFramesSnapshots = [];

      ({ displayConfig, renderedAt, preset } = result);

      syncSpeed = 0;

      engine.render(displayConfig);
    }

    if (updateQueue.length > 10) {
      console.log(`[HARDWARE] Update queue lagging`, updateQueue.length);
    }

    if (updateQueue.length > 50) {
      updateQueue = [];
      console.log(`[HARDWARE] Reset update queue`);
    }
  }, 2000);
})();
