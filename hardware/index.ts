import { LedMatrix, GpioMapping } from "rpi-led-matrix";
import { checkForNewDisplayConfig } from "./checkForNewDisplayConfig";
import { createDisplayEngine } from "../src/display-engine";
import { Dimensions, Pixel, Scene } from "../src/display-engine/types";
import { getData, setData } from "@/server/db";
import { PanelField, Preset, PresetField, QueuedFramesSnapshot } from "@/types";
import { Canvas, FontLibrary } from "skia-canvas";
import { getEndDate } from "@/helpers/getEndDate";

import express from "express";
import Bonjour from "bonjour-service";
import { waitForIpAddress } from "./getIpAddress";
import { shouldRunBootCode } from "./shouldRunBootCode";
import { getScene } from "@/helpers/getScene";

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

  FontLibrary.use("Tiny5", "./public/fonts/Tiny5-Regular.ttf");
  FontLibrary.use("Silkscreen", "./public/fonts/Silkscreen-Regular.ttf");

  const canvas = new Canvas(width, height);

  canvas.gpu = false;

  return canvas as unknown as HTMLCanvasElement;
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
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
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

  app.get("/api/reload", (req, res) => {
    runConditionalRenderUpdate();
    res.send(true);
  });

  app.post("/api/throttle", (req, res) => {
    syncSpeed = req.body.value;
    res.send(true);
  });

  // Simulate a hardware button press from the UI. Drives the same cycling
  // logic as the GPIO watcher, so it works in emulator mode too.
  app.post("/api/button-press", async (req, res) => {
    await handleButtonPress();
    res.send(true);
  });

  app.listen(port, () => {
    console.log(`[HARDWARE] Server running on port ${port}`);

    const bonjour = new Bonjour();
    bonjour.publish({ name: "moonclock", type: "moonclock", port });
    console.log(`[HARDWARE] Advertising as _moonclock._tcp via mDNS`);

    const browser = bonjour.find({ type: "moonclock" });
    browser.on("up", (service) => {
      console.log(
        `[HARDWARE] Discovered peer: ${service.name} at ${service.addresses?.[0]}:${service.port}`,
      );
    });
    browser.on("down", (service) => {
      console.log(`[HARDWARE] Peer went offline: ${service.name}`);
    });
  });

  const { panel } = await getData();

  let scene: Scene | null = getScene(panel.defaultPreset[PresetField.SceneId]);
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
        hardwareMapping: panel[PanelField.HardwareMapping] as GpioMapping,
        pwmLsbNanoseconds: panel[PanelField.PwnLsbNanoseconds],
        pwmBits: panel[PanelField.PwmBits],
      },
      {
        ...LedMatrix.defaultRuntimeOptions(),
        gpioSlowdown: panel[PanelField.GpioSlowdown],
      },
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
    createCanvas,
    onPixelsChange: (pixels) => {
      updateQueue.push(pixels);
    },
  });

  if (shouldRunBootCode()) {
    console.log("[HARDWARE] Running boot message");

    let loadingBit = true;

    const connectionLoadingInterval = setInterval(() => {
      loadingBit = loadingBit ? false : true;
      engine.render({
        draw({ ctx }) {
          ctx.fillStyle = loadingBit ? "#6495ED" : "#000000";
          ctx.fillRect(0, 0, 1, 1);
          ctx.fillStyle = loadingBit ? "#000000" : "#facc0d";
          ctx.fillRect(0, 1, 1, 1);
        },
      });
    }, 500);

    await new Promise((resolve) => setTimeout(resolve, 5000));

    const ipAddress = await waitForIpAddress();

    clearInterval(connectionLoadingInterval);

    const ipText = ipAddress || "Not connected :(";
    const ipSpeed = 20; // px/sec, was the marquee macro's fps (1px/frame @ 20fps)

    engine.render({
      framesPerSecond: 20,
      async init({ ctx, createCanvas }) {
        ctx.font = "15px Arial";
        const width = Math.ceil(ctx.measureText(ipText).width);

        const canvas = await createCanvas({ width, height: 19 });
        const ipCtx = canvas.getContext("2d") as CanvasRenderingContext2D;
        ipCtx.textBaseline = "top";
        ipCtx.font = "15px Arial";
        ipCtx.fillStyle = "#FFFFFF";
        ipCtx.fillText(ipText, 0, 0);

        return { canvas, width };
      },
      draw({ ctx, dimensions, elapsed, state }) {
        ctx.textBaseline = "top";
        ctx.font = "8px Tiny5";
        ctx.fillStyle = "#AAA";
        ctx.fillText("Starting", 0, 1);

        const cycle = dimensions.width + state.width;
        const x = dimensions.width - (((elapsed / 1000) * ipSpeed) % cycle);
        ctx.drawImage(state.canvas as unknown as CanvasImageSource, x, 12);
      },
    });

    await new Promise((resolve) => setTimeout(resolve, 10000));
  } else {
    console.log("[HARDWARE] Skipping boot message");
  }

  engine.render(null);

  async function runConditionalRenderUpdate() {
    lastLoopRunAt = new Date().toJSON();

    const result = await checkForNewDisplayConfig(preset);

    if (result) {
      updateQueue = [];
      queuedFramesSnapshots = [];

      ({ scene, renderedAt, preset } = result);

      brightness = preset[PresetField.Brightness] || null;

      syncSpeed = 0;

      engine.render(scene);
    }

    if (updateQueue.length > 10) {
      console.log(`[HARDWARE] Update queue lagging`, updateQueue.length);
    }

    if (updateQueue.length > 50) {
      updateQueue = [];
      console.log(`[HARDWARE] Reset update queue`);
    }
  }

  let currentPinnedIndex = -1;
  let activePreview: {
    timeoutId: NodeJS.Timeout | null;
    cancelled: boolean;
    resolve: (() => void) | null;
  } | null = null;

  // Cycles through pinned presets (then a clear step), exactly as a hardware
  // button press would. Exposed so both the GPIO watcher and the
  // POST /api/button-press endpoint drive the identical code path.
  async function handleButtonPress() {
    if (activePreview) {
      activePreview.cancelled = true;
      if (activePreview.timeoutId) clearTimeout(activePreview.timeoutId);
      // Resolve the parked preview promise so the superseded handler
      // unwinds (hits its `op.cancelled` guard) instead of hanging forever.
      if (activePreview.resolve) activePreview.resolve();
    }
    const op: {
      timeoutId: NodeJS.Timeout | null;
      cancelled: boolean;
      resolve: (() => void) | null;
    } = {
      timeoutId: null,
      cancelled: false,
      resolve: null,
    };
    activePreview = op;

    console.log("[HARDWARE] Button pressed! Cycling to next pinned preset...");

    const { presets } = getData();
    const pinnedPresets = presets.filter((p) => p[PresetField.Pinned]);

    if (pinnedPresets.length === 0) {
      console.log("[HARDWARE] No pinned presets found");
      return;
    }

    currentPinnedIndex = (currentPinnedIndex + 1) % (pinnedPresets.length + 1);

    if (currentPinnedIndex === pinnedPresets.length) {
      console.log("[HARDWARE] Clearing scheduled preset");

      setData({
        scheduledPreset: null,
      });

      // Preview screens are painted straight to the engine without updating
      // `preset`, so checkForNewDisplayConfig's sceneMatch can wrongly think
      // the default is already showing and skip the render — leaving a stale
      // preview frozen on screen. Render the default directly so the clear
      // is always visible.
      const { panel: latestPanel } = getData();
      preset = latestPanel.defaultPreset;
      renderedAt = new Date().toJSON();
      scene = getScene(preset[PresetField.SceneId]);
      brightness = preset[PresetField.Brightness] || null;
      syncSpeed = 0;
      updateQueue = [];
      queuedFramesSnapshots = [];
      engine.render(scene);
      return;
    } else {
      const nextPreset = pinnedPresets[currentPinnedIndex];

      console.log(
        `[HARDWARE] Switching to preset: ${nextPreset[PresetField.Name]}`,
      );

      const endDate = getEndDate(nextPreset);

      if (endDate) {
        const hours24 = endDate.getHours();
        const hours12 = hours24 % 12 || 12;
        const minutes = endDate.getMinutes().toString().padStart(2, "0");
        const period = hours24 >= 12 ? "PM" : "AM";
        const endTimeText = `${hours12}:${minutes} ${period}`;

        const previewDurationMs = 3000;

        engine.render({
          framesPerSecond: 20,
          draw({ ctx, dimensions, elapsed }) {
            ctx.textBaseline = "top";
            ctx.font = "8px Tiny5";

            ctx.fillStyle = "#FFF";
            ctx.fillText(nextPreset[PresetField.Name], 0, 1);

            ctx.fillStyle = "#999";
            ctx.fillText("Until..", 0, 9);
            ctx.fillText(endTimeText, 0, 18);

            const progress = Math.min(elapsed / previewDurationMs, 1);
            const barWidth = Math.floor(progress * dimensions.width);
            if (barWidth > 0) {
              ctx.fillStyle = "#009900";
              ctx.fillRect(0, dimensions.height - 2, barWidth, 1);
            }
          },
        });

        await new Promise<void>((resolve) => {
          op.resolve = resolve;
          op.timeoutId = setTimeout(resolve, previewDurationMs);
        });

        if (op.cancelled) {
          console.log("[HARDWARE] Operation aborted by new button press");
          return;
        }
      }

      setData({
        scheduledPreset: {
          preset: nextPreset,
          endTime: endDate ? endDate.toJSON() : null,
          updatedAt: new Date().toJSON(),
        },
      });
    }

    await runConditionalRenderUpdate();
  }

  if (panel[PanelField.ButtonEnabled]) {
    try {
      const { Gpio } = await import("onoff");
      const button = new Gpio(
        panel[PanelField.ButtonGpioPin],
        "in",
        "falling",
        { debounceTimeout: 50 },
      );

      button.watch((err) => {
        if (err) {
          console.error("[HARDWARE] Button watch error:", err);
          return;
        }
        handleButtonPress();
      });

      console.log(
        `[HARDWARE] Button initialized on GPIO ${panel[PanelField.ButtonGpioPin]}`,
      );
    } catch (error) {
      console.error("[HARDWARE] Failed to initialize button GPIO:", error);
      console.error("[HARDWARE] Button functionality will be disabled");
      console.error("[HARDWARE] See instructions in README.");
    }
  }

  setInterval(async () => {
    await runConditionalRenderUpdate();
  }, 2000);

  await runConditionalRenderUpdate();
})();
