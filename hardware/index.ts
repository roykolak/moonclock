import { LedMatrix, GpioMapping } from "rpi-led-matrix";
import { checkForNewDisplayConfig } from "./checkForNewDisplayConfig";
import { createDisplayEngine } from "../src/display-engine";
import { Dimensions, Macro, Pixel } from "../src/display-engine/types";
import { coordinates, text } from "../src/display-engine/marcoConfigs";
import { getData } from "@/server/db";
import { transformPresetToDisplayMacros } from "@/server/actions/transformPresetToDisplayMacros";
import { PanelField, Preset, PresetField, QueuedFramesSnapshot } from "@/types";
import express, { Response } from "express";
import { waitForIpAddress } from "./getIpAddress";
import { shouldRunBootCode } from "./shouldRunBootCode";
import getline from "readlineiter";

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

export async function createCanvas(dimensions: Dimensions) {
  const { width, height } = dimensions;

  const { Canvas } = await import("skia-canvas");

  return new Canvas(width, height) as unknown as HTMLCanvasElement;
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
      brightness: brightness || panel[PanelField.Brightness],
    });
  });

  app.get("/api/reload", (req, res) => {
    runConditionalRenderUpdate();
    res.send(true);
  });

  app.post("/api/throttle", (req, res) => {
    syncSpeed = req.body.value;
    res.send(true);
  });

  function broadcast(data: any) {
    const message = `data: ${JSON.stringify(data)}\n\n`;
    clients.forEach((client) => {
      try {
        client.write(message);
      } catch (error) {
        console.log(error);
        clients.delete(client);
      }
    });
  }

  const clients = new Set<Response>();

  app.get("/api/events", (req, res) => {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Cache-Control",
    });

    clients.add(res);
    console.log(`Client connected. Total: ${clients.size}`);

    broadcast({
      type: "update",
      timestamp: new Date().toISOString(),
      data: virtualPanel,
    });

    res.write(
      'data: {"type": "connected", "message": "Connected to server"}\n\n'
    );

    req.on("close", () => {
      clients.delete(res);
      console.log(`Client disconnected. Total: ${clients.size}`);
    });
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

      if (pixelUpdates && pixelUpdates?.length > 0) {
        for (const pixel of pixelUpdates) {
          updateVirtualPanel(pixel);
        }

        broadcast({
          type: "update",
          timestamp: new Date().toISOString(),
          data: virtualPanel,
        });
      }

      setTimeout(fakeSync, syncSpeed);
    }
    fakeSync();
    console.log("[HARDWARE] Emulating LED Matrix...");
  }

  const engine = createDisplayEngine({
    dimensions: { width: 32, height: 32 },
    createCanvas,
    fonts: {
      "4x6": getline("public/fonts/4x6.bdf"),
    },
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
        font: "Tiny5",
        color: "#AAA",
        fontSize: 8,
        startingRow: 1,
      }),
      text({
        text: ipAddress,
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
