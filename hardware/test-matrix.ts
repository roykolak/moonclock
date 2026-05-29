// Standalone rpi-led-matrix smoke test.
//
// build.js bundles this to dist/hardware/test-matrix.cjs, next to the prebuilt
// rpi-led-matrix.node. Run it on the Pi from a deployed release's hardware dir:
//   cd /usr/local/bin/moonclock/current/dist/hardware
//   sudo node test-matrix.cjs
//
// Options (all optional, --key=value form; flags survive sudo, env vars do not):
//   --rows=32 --cols=32 --chain=1 --mapping=AdafruitHat --slowdown=4
//   --panel='{"pwmBits":11,"pwnLsbNanoseconds":130,"gpioSlowdown":4,"brightness":50}'
// --mapping is a GpioMapping key (e.g. Regular, AdafruitHat, AdafruitHatPwm).
// --panel takes the panel JSON from the DB; individual flags override its fields.
//
// Ctrl+C to quit. The matrix lib needs root for GPIO, hence sudo.

import {
  LedMatrix,
  GpioMapping,
  type MatrixOptions,
  type RuntimeOptions,
} from "rpi-led-matrix";
import type { Panel } from "@/types";

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

const rows = Number(args.rows ?? 32) as MatrixOptions["rows"];
const cols = Number(args.cols ?? 32) as MatrixOptions["cols"];
const chainLength = Number(args.chain ?? 1) as MatrixOptions["chainLength"];
const gpioSlowdown = Number(
  args.slowdown ?? panel.gpioSlowdown ?? 4,
) as RuntimeOptions["gpioSlowdown"];
const brightness = Number(args.brightness ?? panel.brightness ?? 50);
const mappingKey = args.mapping ?? "AdafruitHat";

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
};
if (panel.pwnLsbNanoseconds !== undefined) {
  matrixOptions.pwmLsbNanoseconds = panel.pwnLsbNanoseconds;
}
if (panel.pwmBits !== undefined) {
  matrixOptions.pwmBits = panel.pwmBits;
}

console.log("rpi-led-matrix loaded OK");
console.log(
  `Config: rows=${rows} cols=${cols} chain=${chainLength} mapping=${mappingKey} ` +
    `slowdown=${gpioSlowdown} brightness=${brightness} ` +
    `pwmBits=${matrixOptions.pwmBits} pwmLsbNanoseconds=${matrixOptions.pwmLsbNanoseconds}`,
);

const matrix = new LedMatrix(matrixOptions, {
  ...LedMatrix.defaultRuntimeOptions(),
  gpioSlowdown,
});

console.log("LedMatrix constructed OK");

const width = cols * chainLength;
const height = rows;
const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffffff];
let frame = 0;

matrix.afterSync(() => {
  matrix.clear().brightness(brightness);

  // Phase 1 (first ~4s): solid color fills, one per second.
  if (frame < 4 * 30) {
    const color = colors[Math.floor(frame / 30) % colors.length];
    matrix.fgColor(color).fill();
  } else {
    // Phase 2: a single white pixel sweeping across the panel.
    const i = frame % (width * height);
    const x = i % width;
    const y = Math.floor(i / width);
    matrix.fgColor(0xffffff).setPixel(x, y);
  }

  frame++;
  setTimeout(() => matrix.sync(), 1000 / 30); // ~30fps
});

console.log(
  "Starting render loop — you should see R/G/B/white fills, then a sweeping pixel.",
);
matrix.sync();
