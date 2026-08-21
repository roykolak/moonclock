// Standalone rpi-led-matrix smoke test and ghosting tuning rig.
//
// build.js bundles this to dist/hardware/test-matrix.cjs, next to the prebuilt
// rpi-led-matrix.node. Run it on the Pi from a deployed release's hardware dir:
//   cd /usr/local/bin/moonclock/current/dist/hardware
//   sudo node test-matrix.cjs
//
// Options (all optional, --key=value form; flags survive sudo, env vars do not):
//   --rows=32 --cols=32 --chain=1 --mapping=AdafruitHat --brightness=50
//   --panel='{"pwmBits":11,"pwnLsbNanoseconds":130,"gpioSlowdown":4}'
//   --pattern=ghost|smoke     ghost (default) shows the ghosting test patterns
//   --color=cycle|white|red|green|blue
//
// Panel timing (each overrides the matching --panel field):
//   --slowdown=N --pwm-bits=N --pwm-lsb-nanoseconds=N --pwm-dither-bits=N
//   --limit-refresh-hz=N --panel-type=FM6126A --scan-mode=0|1
//
// --mapping is a GpioMapping key (e.g. Regular, AdafruitHat, AdafruitHatPwm).
// --panel takes the panel JSON from the DB; individual flags override its fields.
//
// Tuning ghosting: the number that matters is the shortest time a row is lit
// for, printed below as "min OE pulse". The library builds its bitplane timings
// as `pwmLsbNanoseconds * 2 ** bit` and skips the lowest `11 - pwmBits` of them,
// so raising pwmLsbNanoseconds or lowering pwmBits both lengthen it. When that
// pulse gets close to the time it takes to clock 32 columns of data in (which
// happens on a short pulse, or a high --slowdown), the panel spends much of its
// lit time displaying half-shifted data and you see smearing and column ghosts.
//
// Ctrl+C to quit. The matrix lib needs root for GPIO, hence sudo.

import {
  LedMatrix,
  GpioMapping,
  ScanMode,
  type MatrixOptions,
  type RuntimeOptions,
} from "rpi-led-matrix";
import type { Panel } from "@/types";

// The library only pulses Output Enable in hardware when OE sits on GPIO 18 or
// GPIO 12 (see HardwarePinPulser::CanHandle). Every other mapping silently
// falls back to a busy-wait timer, whose jitter shows up as ghosting.
const HARDWARE_PULSED_MAPPINGS = ["regular", "adafruit-hat-pwm", "regular-pi1"];

// Fixed in the library: colors are stored as 11 bitplanes.
const BIT_PLANES = 11;

function parseArgs(argv: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const arg of argv) {
    const match = arg.match(/^--([^=]+)=(.*)$/);
    if (match) out[match[1]] = match[2];
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));

let panel: Partial<Panel> = {};
if (args.panel !== undefined) {
  try {
    panel = JSON.parse(args.panel);
  } catch (e) {
    console.error(`--panel must be valid JSON: ${(e as Error).message}`);
    process.exit(1);
  }
}

function num(flag: string, fallback: number): number {
  const raw = args[flag];
  if (raw === undefined) return fallback;
  const value = Number(raw);
  if (!Number.isFinite(value)) {
    console.error(`--${flag} must be a number, got "${raw}"`);
    process.exit(1);
  }
  return value;
}

const rows = num("rows", 32) as MatrixOptions["rows"];
const cols = num("cols", 32) as MatrixOptions["cols"];
const chainLength = num("chain", 1) as MatrixOptions["chainLength"];
const gpioSlowdown = num(
  "slowdown",
  panel.gpioSlowdown ?? 4,
) as RuntimeOptions["gpioSlowdown"];
const brightness = num("brightness", panel.brightness ?? 50);
const pwmBits = num(
  "pwm-bits",
  panel.pwmBits ?? 11,
) as MatrixOptions["pwmBits"];
const pwmLsbNanoseconds = num(
  "pwm-lsb-nanoseconds",
  panel.pwnLsbNanoseconds ?? 130,
);
const pwmDitherBits = num("pwm-dither-bits", panel.pwmDitherBits ?? 0);
const limitRefreshRateHz = num(
  "limit-refresh-hz",
  panel.limitRefreshRateHz ?? 0,
);
const scanMode = num("scan-mode", ScanMode.Progressive) as ScanMode;
const panelType = (args["panel-type"] ??
  panel.panelType ??
  "") as MatrixOptions["panelType"];
const mappingKey = args.mapping ?? "AdafruitHat";
const pattern = args.pattern ?? "ghost";
const colorArg = args.color ?? "cycle";

const hardwareMapping = GpioMapping[mappingKey as keyof typeof GpioMapping];
if (hardwareMapping === undefined) {
  console.error(
    `Unknown --mapping=${mappingKey}. Valid keys: ${Object.keys(GpioMapping).join(", ")}`,
  );
  process.exit(1);
}

const matrixOptions: MatrixOptions = {
  ...LedMatrix.defaultMatrixOptions(),
  rows,
  cols,
  chainLength,
  hardwareMapping,
  pwmBits,
  pwmLsbNanoseconds,
  pwmDitherBits,
  limitRefreshRateHz,
  panelType,
  scanMode,
  // Makes the library print the rate it's actually achieving, which is the
  // number to compare against "est. refresh" below.
  showRefreshRate: true,
};

// What the timings above actually mean on the panel. Bitplane `b` is lit for
// `pwmLsbNanoseconds * 2 ** b`, and DumpToMatrix walks planes
// `BIT_PLANES - pwmBits` through `BIT_PLANES - 1` for each of the rows/2
// double-rows, so the whole frame is the sum of the planes it didn't skip.
const minOePulseNs = pwmLsbNanoseconds * 2 ** (BIT_PLANES - pwmBits);
const planeSum = 2 ** BIT_PLANES - 2 ** (BIT_PLANES - pwmBits);
const frameNs = (rows / 2) * pwmLsbNanoseconds * planeSum;

console.log("rpi-led-matrix loaded OK");
console.log(
  `Config: rows=${rows} cols=${cols} chain=${chainLength} mapping=${mappingKey} ` +
    `slowdown=${gpioSlowdown} brightness=${brightness}`,
);
console.log(
  `Timing: pwmBits=${pwmBits} pwmLsbNanoseconds=${pwmLsbNanoseconds} ` +
    `pwmDitherBits=${pwmDitherBits} limitRefreshHz=${limitRefreshRateHz} ` +
    `scanMode=${scanMode} panelType="${panelType}"`,
);
console.log(
  `        min OE pulse ${minOePulseNs}ns · est. frame ${(frameNs / 1e6).toFixed(2)}ms · ` +
    `est. refresh ${Math.round(1e9 / frameNs)}Hz`,
);

if (!HARDWARE_PULSED_MAPPINGS.includes(hardwareMapping)) {
  console.warn(
    `\n!! mapping "${hardwareMapping}" puts Output Enable on a pin the library\n` +
      `!! can't pulse in hardware, so every OE pulse is a busy-wait subject to\n` +
      `!! scheduler jitter. That is a large source of ghosting and flicker on\n` +
      `!! its own, and no timing value below will fully compensate for it.\n` +
      `!! Bridging GPIO 4 to GPIO 18 on the HAT and using AdafruitHatPwm moves\n` +
      `!! OE onto the hardware PWM peripheral.\n`,
  );
}

const matrix = new LedMatrix(matrixOptions, {
  ...LedMatrix.defaultRuntimeOptions(),
  gpioSlowdown,
});

console.log("LedMatrix constructed OK");

const width = cols * chainLength;
const height = rows;

const COLORS: Record<string, [number, number, number]> = {
  white: [255, 255, 255],
  red: [255, 0, 0],
  green: [0, 255, 0],
  blue: [0, 0, 255],
};
const COLOR_CYCLE = ["white", "green", "red", "blue"];

if (colorArg !== "cycle" && !COLORS[colorArg]) {
  console.error(
    `Unknown --color=${colorArg}. Valid: cycle, ${Object.keys(COLORS).join(", ")}`,
  );
  process.exit(1);
}

// Worst cases for the two artifacts we're chasing. Bars and checker stress the
// column drivers (a lit column next to a dark one is what leaves a ghost in the
// dark one); block and dot leave large dark areas where a trailing smear or a
// stray column ghost is obvious against black.
const PATTERNS = ["bars", "block", "dot", "checker"] as const;
type PatternName = (typeof PATTERNS)[number];

function isLit(name: PatternName, x: number, y: number): boolean {
  switch (name) {
    case "bars":
      // 1px vertical stripes: every lit column is adjacent to a dark one.
      return x % 2 === 0;
    case "block":
      // A bright square with black to its right — a horizontal smear trails
      // out of the right edge, and column ghosts appear above and below.
      return (
        x >= 4 &&
        x < 4 + Math.floor(width / 4) &&
        y >= Math.floor(height / 4) &&
        y < Math.floor(height / 4) + Math.floor(height / 2)
      );
    case "dot":
      // The purest column-ghost test: one lit pixel, everything else dark.
      return x === Math.floor(width / 2) && y === Math.floor(height / 2);
    case "checker":
      return (x + y) % 2 === 0;
  }
}

const frameBuffer = Buffer.alloc(width * height * 3);

function drawPattern(name: PatternName, colorName: string) {
  const [r, g, b] = COLORS[colorName];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const offset = (y * width + x) * 3;
      const lit = isLit(name, x, y);
      frameBuffer[offset] = lit ? r : 0;
      frameBuffer[offset + 1] = lit ? g : 0;
      frameBuffer[offset + 2] = lit ? b : 0;
    }
  }
  matrix.brightness(brightness).drawBuffer(frameBuffer, width, height);
}

const PATTERN_HOLD_MS = 2500;
let step = -1;
let smokeFrame = 0;

matrix.afterSync(() => {
  if (pattern === "smoke") {
    matrix.clear().brightness(brightness);

    // Phase 1 (first ~4s): solid color fills, one per second.
    if (smokeFrame < 4 * 30) {
      const name =
        COLOR_CYCLE[Math.floor(smokeFrame / 30) % COLOR_CYCLE.length];
      const [r, g, b] = COLORS[name];
      matrix.fgColor({ r, g, b }).fill();
    } else {
      // Phase 2: a single white pixel sweeping across the panel.
      const i = smokeFrame % (width * height);
      matrix.fgColor(0xffffff).setPixel(i % width, Math.floor(i / width));
    }

    smokeFrame++;
    setTimeout(() => matrix.sync(), 1000 / 30); // ~30fps
    return;
  }

  // Ghost patterns are static between changes, so only redraw when the step
  // rolls over. Keeping the main thread idle matters here: on a mapping without
  // hardware OE pulsing, CPU we burn is CPU the refresh thread doesn't get.
  const next = Math.floor(Date.now() / PATTERN_HOLD_MS);
  if (next !== step) {
    step = next;
    const name = PATTERNS[step % PATTERNS.length];
    const colorName =
      colorArg === "cycle"
        ? COLOR_CYCLE[Math.floor(step / PATTERNS.length) % COLOR_CYCLE.length]
        : colorArg;
    console.log(`Pattern: ${name} (${colorName})`);
    drawPattern(name, colorName);
  }

  setTimeout(() => matrix.sync(), 100);
});

if (pattern === "smoke") {
  console.log(
    "Starting render loop — you should see R/G/B/white fills, then a sweeping pixel.",
  );
} else {
  console.log(
    `\nCycling ${PATTERNS.join(", ")} every ${PATTERN_HOLD_MS}ms. Look for a faint copy of a\n` +
      `lit pixel elsewhere in its column, and for bright pixels trailing sideways.\n` +
      `Re-run with different --pwm-bits / --pwm-lsb-nanoseconds / --slowdown to compare.\n`,
  );
}
matrix.sync();
