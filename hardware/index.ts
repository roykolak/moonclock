import { LedMatrix, GpioMapping } from "rpi-led-matrix";
import { checkForNewDisplayConfig } from "./checkForNewDisplayConfig";
import { createDisplayEngine } from "../src/display-engine";
import { Macro, Pixel } from "../src/display-engine/types";
import { coordinates, marquee, text } from "../src/display-engine/marcoConfigs";
import { getData } from "@/server/db";
import { transformPresetToDisplayMacros } from "@/server/actions/transformPresetToDisplayMacros";
import { PanelField, Preset, PresetField, QueuedFramesSnapshot } from "@/types";

import express from "express";
import { waitForIpAddress } from "./getIpAddress";
import { shouldRunBootCode } from "./shouldRunBootCode";

let syncSpeed = 0;
const virtualPanel: { [k: string]: string } = {};

let brightness: number | null = null;

function updateVirtualPanel(pixel: Pixel) {
  const hexA = pixel.rgba ? RGBAToHexA(pixel.rgba, true) : "000000";
  virtualPanel[pixel.x + ":" + pixel.y] = "#" + hexA;
  return hexA;
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
      virtualPanel,
      brightness: brightness || panel[PanelField.Brightness],
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
          const hexA = updateVirtualPanel(pixel);
          matrix
            .brightness(brightness || panel[PanelField.Brightness])
            .fgColor(parseInt(hexA, 16))
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
      const pixelUpdates = updateQueue.shift();

      recordQueuedFramesSnapshot(updateQueue.length);

      if (pixelUpdates) {
        for (const pixel of pixelUpdates) {
          updateVirtualPanel(pixel);
        }
      }

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

  if (shouldRunBootCode()) {
    console.log("[HARDWARE] Running boot message");

    let loadingBit = true;

    const connectionLoadingInterval = setInterval(() => {
      loadingBit = loadingBit ? false : true;
      engine.render([
        coordinates({
          coordinates: loadingBit
            ? { "0:0": "#6495ED", "0:1": "#000000" }
            : { "0:0": "#000000", "0:1": "#facc0d" },
        }),
      ]);
    }, 500);

    const ipAddress = await waitForIpAddress();

    clearInterval(connectionLoadingInterval);

    engine.render([
      text({
        text: "Starting",
        color: "#AAA",
        fontSize: 9,
        startingRow: 1,
      }),
      marquee({
        text: ipAddress || "",
        direction: "horizontal",
        speed: 40,
        startingRow: 12,
        fontSize: 16,
        color: "#008000",
      }),
    ]);

    await new Promise((resolve) => setTimeout(resolve, 10000));
  } else {
    console.log("[HARDWARE] Skipping boot message");
  }

  engine.render([]);

  async function runConditionalRenderUpdate() {
    lastLoopRunAt = new Date().toJSON();

    const result = await checkForNewDisplayConfig(preset);

    if (result) {
      updateQueue = [];
      queuedFramesSnapshots = [];

      ({ displayConfig, renderedAt, preset } = result);

      brightness = preset[PresetField.Brightness] || null;

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
  }

  setInterval(async () => {
    await runConditionalRenderUpdate();
  }, 2000);

  await runConditionalRenderUpdate();
})();
