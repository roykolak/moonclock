// Imported first, ahead of skia-canvas, so its module-eval timestamp predates
// the ~29 MB skia.node dlopen and the first bootMark() can attribute that cost.
import { bootMark } from "./bootClock";
import { LedMatrix, GpioMapping, RuntimeFlag } from "rpi-led-matrix";
import { checkForNewDisplayConfig } from "./checkForNewDisplayConfig";
import { createDisplayEngine } from "../src/display-engine";
import { Dimensions, Pixel, Scene } from "../src/display-engine/types";
import { getData, setData } from "@/server/db";
import { Preset } from "@/types";
import { Canvas, FontLibrary } from "skia-canvas";
import { getEndDate } from "@/helpers/getEndDate";

// express and bonjour-service are loaded lazily (see startWebServer) so their
// module init stays off the boot loader's critical path. Only the Response type
// is needed at module scope, and `import type` is erased at compile time.
import type { Response as ExpressResponse } from "express";
import { exec } from "child_process";
import { promisify } from "util";
import os from "os";
import { getIpAddress } from "./getIpAddress";
import { shouldRunBootCode } from "./shouldRunBootCode";
import { getScene } from "@/helpers/getScene";
import { forgetWifiNetworks, isProvisioning } from "./wifi";
import {
  createHoldToResetScene,
  createNoNetworkScene,
  createSetupNeededScene,
} from "./wifi/scenes";
import { createStartupConnected, createStartupRing } from "@/scenes/startup";

const execAsync = promisify(exec);

// Minimum time the startup ring stays up before the connected check replaces
// it, and how long that check holds before the user's scene takes over.
const MIN_RING_MS = 1200;
const CONNECTED_HOLD_MS = 1500;

// The button's GPIO pin is fixed, not configurable: its pull-up is enabled by
// `gpio=25=ip,pu` in bootstrap.sh's boot config, and that pin has to match what
// we open here. 537 = global gpiochip offset 512 + BCM 25 (physical pin 22, a
// free pin under the adafruit-hat mapping, next to a GND).
const BUTTON_GPIO_PIN = 537;

let syncSpeed = 0;

const PANEL_WIDTH = 32;
const PANEL_HEIGHT = 32;

// How long to wait before re-arming sync() when there's no frame queued.
// sync() blocks the event loop until the panel finishes a frame — SwapOnVSync
// ends in an unbounded pthread_cond_wait — while the refresh thread keeps
// redisplaying the current frame on its own regardless. So syncing an empty
// queue buys nothing and parks the main thread for a frame period, delaying the
// web server, the SSE flush and the button handler behind it. A clock sits in
// that state nearly all the time: an `fps: 0` scene draws one frame and then
// queues nothing until the scene changes. Only applied when the queue is empty;
// a queued frame still goes out at `syncSpeed`.
const IDLE_SYNC_MS = 16;

const virtualPanel: { [k: string]: string } = {};

// Pixels whose colour has changed since the last SSE delta flush. Only real
// changes are recorded here, so a static scene accumulates nothing and costs
// the stream zero traffic.
const dirtyPixels = new Set<string>();

// Open Server-Sent Events connections mirroring the live panel.
const sseClients = new Set<ExpressResponse>();

let brightness: number | null = null;

function updateVirtualPanel(pixel: Pixel) {
  const hexA = pixel.rgba ? RGBAToHexA(pixel.rgba, true) : "000000";
  const key = pixel.x + ":" + pixel.y;
  const value = "#" + hexA;

  if (virtualPanel[key] !== value) {
    virtualPanel[key] = value;
    dirtyPixels.add(key);
  }

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

// Font registration is deferred: the startup loader is pure color and needs no
// fonts, so paying skia-canvas's font/fontconfig cost on its first frame just
// delays the loader. registerFonts() runs once, lazily, before the first scene
// that actually draws text (the wifi/setup prompts and the no-network state).
let fontsRegistered = false;
function registerFonts() {
  if (fontsRegistered) return;
  FontLibrary.use("Tiny5", "./public/fonts/Tiny5-Regular.ttf");
  FontLibrary.use("Silkscreen", "./public/fonts/Silkscreen-Regular.ttf");
  fontsRegistered = true;
  bootMark("fonts registered");
}

let firstCanvasLogged = false;
export async function createCanvas(dimensions: Dimensions) {
  const { width, height } = dimensions;

  const canvas = new Canvas(width, height);

  canvas.gpu = false;

  if (!firstCanvasLogged) {
    firstCanvasLogged = true;
    bootMark("skia canvas first created");
  }

  return canvas as unknown as HTMLCanvasElement;
}

(async () => {
  // First line of real work: everything imported above — including the ~29 MB
  // skia.node and the other native addons — has finished dlopen'ing and
  // evaluating by now. A large Δ here is the native-module load tax.
  bootMark("imports loaded (skia + native addons dlopen'd)");

  const args = process.argv.slice(2);
  const params: any = { emulate: false };

  args.forEach((arg) => {
    if (arg.startsWith("--")) {
      const key = arg.substring(2);
      params[key] = true;
    }
  });

  // The web server (SSE panel mirror + control API) and mDNS advertising are
  // brought up only after the loader is already on the panel — see the
  // startWebServer() calls below. express and bonjour-service are imported here,
  // lazily, so their module init never sits in front of the first frame.
  async function startWebServer() {
    const { default: express } = await import("express");
    const { default: Bonjour } = await import("bonjour-service");

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

    app.get("/api/reload", (req, res) => {
      runConditionalRenderUpdate();
      res.send(true);
    });

    // Live pixel mirror over Server-Sent Events. Sends the full panel once on
    // connect, then only changed pixels (see the flush interval below), so a
    // static scene streams nothing until it actually changes.
    app.get("/api/panel/stream", (req, res) => {
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      });

      res.write(`event: snapshot\ndata: ${JSON.stringify(virtualPanel)}\n\n`);

      sseClients.add(res);

      req.on("close", () => {
        sseClients.delete(res);
      });
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

    // Push accumulated pixel changes to every connected client, capped at ~16fps.
    // One timer for all clients; nothing is written while the panel is idle.
    setInterval(() => {
      if (dirtyPixels.size === 0 || sseClients.size === 0) return;

      const delta: { [k: string]: string } = {};
      for (const key of dirtyPixels) {
        delta[key] = virtualPanel[key];
      }
      dirtyPixels.clear();

      const payload = `event: delta\ndata: ${JSON.stringify(delta)}\n\n`;
      for (const client of sseClients) {
        client.write(payload);
      }
    }, 60);

    // Keep idle SSE connections alive through proxies.
    setInterval(() => {
      for (const client of sseClients) {
        client.write(`: ping\n\n`);
      }
    }, 15000);

    app.listen(port, () => {
      console.log(`[HARDWARE] Server running on port ${port}`);

      const bonjour = new Bonjour();
      // Advertise the WEB APP (port 80), not this control server on 3001 — the
      // app is what a person opens, and _http._tcp is the type network browsers
      // and "find devices on my network" tooling actually look for. The old
      // _moonclock._tcp record on 3001 advertised the wrong port under a type
      // nothing queries for.
      //
      // The instance name is the hostname, which avahi already guarantees unique
      // on the link, so multiple clocks can't collide here — and it matches the
      // <hostname>.local address the panel now points people at. A duplicate is
      // still rejected with "Service name is already in use", so handle the
      // error to keep a collision (e.g. a stale record after a hard restart)
      // non-fatal rather than throwing from bonjour's internals.
      const service = bonjour.publish({
        name: os.hostname(),
        type: "http",
        port: 80,
      });
      service.on("error", (error) => {
        console.error("[HARDWARE] mDNS publish error:", error);
      });
      console.log(
        `[HARDWARE] Advertising http://${os.hostname()}.local as _http._tcp via mDNS`,
      );
    });
  }

  const { panel } = await getData();
  bootMark("data loaded");

  let scene: Scene | null = getScene(panel.defaultPreset.sceneId);
  let preset: Preset = panel.defaultPreset;

  let updateQueue: Pixel[][] = [];
  // Flipped by the first non-empty frame that actually reaches the panel — the
  // real "time to first pixel" milestone.
  let firstFrameLogged = false;

  if (!params.emulate) {
    console.log("[HARDWARE] Initing LED Matrix...");
    const matrix = new LedMatrix(
      {
        ...LedMatrix.defaultMatrixOptions(),
        rows: PANEL_HEIGHT,
        cols: PANEL_WIDTH,
        chainLength: 1,
        hardwareMapping: panel.hardwareMapping as GpioMapping,
        // Ghosting/refresh timing. The shortest a row is lit for is
        // `pwmLsbNanoseconds * 2 ** (11 - pwmBits)`; when that approaches the
        // time it takes to clock 32 columns in (which happens with a low
        // pwmLsbNanoseconds, a high pwmBits, or a high gpioSlowdown), the panel
        // spends much of its lit time showing half-shifted data and you get
        // smearing. See hardware/test-matrix.ts to tune these against a panel.
        pwmLsbNanoseconds: panel.pwnLsbNanoseconds,
        pwmBits: panel.pwmBits,
        pwmDitherBits: panel.pwmDitherBits ?? 0,
        limitRefreshRateHz: panel.limitRefreshRateHz ?? 0,
        panelType: panel.panelType ?? "",
      },
      {
        ...LedMatrix.defaultRuntimeOptions(),
        gpioSlowdown: panel.gpioSlowdown,
        // The library defaults dropPrivileges to On, which setuids the whole
        // process from root to `daemon` (uid 1) right after GPIO init. That
        // silently breaks the long-press WiFi reset: `nmcli` and `reboot` then
        // run as uid 1, so NetworkManager/logind polkit denies them (our rule
        // only grants root). Stay root — this is a headless appliance whose
        // whole reset flow needs elevated privs.
        dropPrivileges: RuntimeFlag.Off,
      },
    );
    matrix.afterSync(() => {
      const pixelUpdates = updateQueue.shift();

      if (pixelUpdates) {
        if (!firstFrameLogged) {
          firstFrameLogged = true;
          bootMark("first pixel on panel");
        }

        // SetBrightness applies to pixels set after it, for every created
        // FrameCanvas, so one call a frame is equivalent to the per-pixel call
        // this replaces — and saves 1024 trips across the native boundary.
        matrix.brightness(brightness || panel.brightness);

        for (const pixel of pixelUpdates) {
          const hexA = updateVirtualPanel(pixel);
          matrix.fgColor(parseInt(hexA, 16)).setPixel(pixel.x, pixel.y);
        }
      }

      setTimeout(
        () => {
          matrix.sync();
        },
        pixelUpdates ? syncSpeed : Math.max(syncSpeed, IDLE_SYNC_MS),
      );
    });
    matrix.sync();
  } else {
    function fakeSync() {
      const pixelUpdates = updateQueue.shift();

      if (pixelUpdates) {
        for (const pixel of pixelUpdates) {
          updateVirtualPanel(pixel);
        }
      }

      setTimeout(
        fakeSync,
        pixelUpdates ? syncSpeed : Math.max(syncSpeed, IDLE_SYNC_MS),
      );
    }
    fakeSync();
    console.log("[HARDWARE] Emulating LED Matrix...");
  }

  bootMark("matrix ready");

  const engine = createDisplayEngine({
    dimensions: { width: PANEL_WIDTH, height: PANEL_HEIGHT },
    createCanvas,
    onPixelsChange: (pixels) => {
      updateQueue.push(pixels);
    },
  });
  bootMark("engine created");

  if (shouldRunBootCode()) {
    console.log("[HARDWARE] Running boot message");

    // Startup animation while we wait for the network to come up. The display
    // engine drives its own loop; rendering the next scene (setup prompt or the
    // connected check) replaces it, so there's nothing to tear down here.
    engine.render(createStartupRing());
    const ringStartedAt = Date.now();

    // Let the ring actually reach the panel before doing anything that blocks
    // the event loop. registerFonts() is a ~150ms synchronous font/fontconfig
    // load and startWebServer() imports express + bonjour — neither is needed
    // until well after boot (the no-network fallback, the API/mDNS), yet run
    // synchronously here they sit between "render the ring" and "first pixel"
    // and measurably delay it. Defer both past the first frame; 500ms clears
    // the render→first-pixel gap comfortably.
    setTimeout(() => {
      registerFonts();
      void startWebServer();
    }, 500);

    // Resolve the network state before reporting it. While the
    // wifi-connect setup portal is up, the device is offline and its own hotspot
    // hands out a gateway IP (e.g. 192.168.42.1) — so provisioning must take
    // precedence and we must NOT accept an address until it ends. Otherwise we
    // wait for a real IP (DHCP can lag a few seconds behind link-up on boot).
    let ipAddress: string | null = null;
    let showingSetupPrompt = false;
    const bootStartedAt = Date.now();

    while (true) {
      if (await isProvisioning()) {
        if (!showingSetupPrompt) {
          engine.render(createSetupNeededScene());
          showingSetupPrompt = true;
          console.log(
            "[HARDWARE] WiFi setup portal active — prompting on panel",
          );
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
        continue;
      }

      ipAddress = getIpAddress();
      if (ipAddress) {
        // Setup just finished: wifi-connect tears down its hotspot, so give
        // NetworkManager a moment to bring up the real connection before we
        // take its address as the real one.
        if (showingSetupPrompt) {
          await new Promise((resolve) => setTimeout(resolve, 3000));
          ipAddress = getIpAddress();
        }
        break;
      }

      // Not provisioning and still no IP after two minutes: give up waiting and
      // surface the disconnected state rather than hang the boot screen.
      if (Date.now() - bootStartedAt > 120000) break;

      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    if (ipAddress) {
      // The panel no longer reports the address, only that there is one: a
      // DHCP-assigned IP is a 12-character value that changes, and a 32x32 grid
      // can't hand one over without a marquee you have to sit and watch. The
      // address is now a constant — http://moonclock.local, published over mDNS
      // from the hostname install.sh sets — so it lives in the README and on the
      // setup page, and boot just confirms the clock is reachable.
      console.log(
        `[HARDWARE] Connected — http://${os.hostname()}.local (${ipAddress})`,
      );

      // A clock that was already on WiFi can reach this within a few hundred ms
      // of the ring appearing, which reads as a glitch rather than an animation.
      // Hold the loader long enough for it to register as one.
      const ringShownFor = Date.now() - ringStartedAt;
      if (ringShownFor < MIN_RING_MS) {
        await new Promise((resolve) =>
          setTimeout(resolve, MIN_RING_MS - ringShownFor),
        );
      }

      // Hand the ring's age over so its rotation carries through the handoff.
      engine.render(createStartupConnected(Date.now() - ringStartedAt));
      await new Promise((resolve) => setTimeout(resolve, CONNECTED_HOLD_MS));
    } else {
      console.log("[HARDWARE] No network after boot — showing offline state");
      engine.render(createNoNetworkScene());
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  } else {
    console.log("[HARDWARE] Skipping boot message");
    // No loader to front-load behind here, but keep the web server startup in
    // the same place relative to rendering as the boot path.
    void startWebServer();
  }

  // Non-boot path skips the loader above, so make sure fonts are ready before
  // the first user scene (which may draw text) renders. No-op if already done.
  registerFonts();

  engine.render(null);

  async function runConditionalRenderUpdate() {
    const result = await checkForNewDisplayConfig(preset);

    if (result) {
      updateQueue = [];

      ({ scene, preset } = result);

      brightness = preset.brightness || null;

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

  let currentPresetIndex = -1;
  let activePreview: {
    timeoutId: NodeJS.Timeout | null;
    cancelled: boolean;
    resolve: (() => void) | null;
  } | null = null;

  // Cycles through presets (then a clear step), exactly as a hardware
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

    console.log("[HARDWARE] Button pressed! Cycling to next preset...");

    const { presets } = getData();

    if (presets.length === 0) {
      console.log("[HARDWARE] No presets found");
      return;
    }

    currentPresetIndex = (currentPresetIndex + 1) % (presets.length + 1);

    if (currentPresetIndex === presets.length) {
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
      scene = getScene(preset.sceneId);
      brightness = preset.brightness || null;
      syncSpeed = 0;
      updateQueue = [];
      engine.render(scene);
      return;
    } else {
      const nextPreset = presets[currentPresetIndex];

      console.log(`[HARDWARE] Switching to preset: ${nextPreset.name}`);

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
            ctx.fillText(nextPreset.name, 0, 1);

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

  // Held-button action: forget saved WiFi and reboot into setup mode. Rebooting
  // (rather than juggling services live) keeps port 80 free for the wifi-connect
  // portal and is the robust way to re-enter provisioning when the device moves
  // to a new network.
  async function handleLongPress() {
    console.log("[HARDWARE] Long press — resetting WiFi and rebooting");

    engine.render({
      draw({ ctx }) {
        ctx.textBaseline = "top";
        ctx.font = "8px Tiny5";
        ctx.fillStyle = "#F87171";
        ctx.fillText("WiFi", 0, 2);
        ctx.fillText("reset", 0, 11);
        ctx.fillStyle = "#AAAAAA";
        ctx.fillText("reboot", 0, 22);
      },
    });

    await forgetWifiNetworks();
    await new Promise((resolve) => setTimeout(resolve, 3000));

    try {
      await execAsync("reboot");
    } catch (error) {
      console.error("[HARDWARE] Failed to reboot after WiFi reset:", error);
    }
  }

  try {
    const { Gpio } = await import("onoff");
    // Watch both edges so we can measure how long the button is held and tell
    // a short tap (cycle presets) apart from a long hold (reset WiFi).
    const button = new Gpio(BUTTON_GPIO_PIN, "in", "both", {
      debounceTimeout: 50,
    });

    const LONG_PRESS_MS = 5000;
    const HOLD_FEEDBACK_DELAY_MS = 1500;

    let longPressTimer: NodeJS.Timeout | null = null;
    let holdFeedbackTimer: NodeJS.Timeout | null = null;
    let longPressFired = false;

    button.watch((err, value) => {
      if (err) {
        console.error("[HARDWARE] Button watch error:", err);
        return;
      }

      // Active-low with a pull-up: 0 = pressed, 1 = released.
      if (value === 0) {
        longPressFired = false;

        // After a short delay (so quick taps don't flash it), show the
        // "keep holding to reset" progress until the threshold is reached.
        holdFeedbackTimer = setTimeout(() => {
          engine.render(
            createHoldToResetScene(LONG_PRESS_MS - HOLD_FEEDBACK_DELAY_MS),
          );
        }, HOLD_FEEDBACK_DELAY_MS);

        longPressTimer = setTimeout(() => {
          longPressFired = true;
          handleLongPress();
        }, LONG_PRESS_MS);
      } else {
        if (holdFeedbackTimer) clearTimeout(holdFeedbackTimer);
        if (longPressTimer) clearTimeout(longPressTimer);
        holdFeedbackTimer = null;
        longPressTimer = null;

        // The long-press action already fired (and is rebooting); ignore the
        // release. Otherwise treat it as a normal preset-cycling tap.
        if (!longPressFired) {
          handleButtonPress();
        }
      }
    });

    console.log(`[HARDWARE] Button initialized on GPIO ${BUTTON_GPIO_PIN}`);
  } catch (error) {
    console.error("[HARDWARE] Failed to initialize button GPIO:", error);
    console.error("[HARDWARE] Button functionality will be disabled");
    console.error("[HARDWARE] See instructions in README.");
  }

  setInterval(async () => {
    await runConditionalRenderUpdate();
  }, 2000);

  await runConditionalRenderUpdate();
})();
