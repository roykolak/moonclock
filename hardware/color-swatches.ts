// Standalone rpi-led-matrix color-swatch tool.
//
// Renders candidate hex colors on the real panel so you can pick the shades
// that survive the LED's gamma/brightness quirks before baking them into
// scenes. It drives the exact brightness().fgColor().setPixel() path the real
// renderer uses (see hardware/index.ts), so what you see is what scenes render.
//
// build.js bundles this to dist/hardware/color-swatches.cjs, next to the
// prebuilt rpi-led-matrix.node. Run it on the Pi from a deployed release's
// hardware dir:
//   cd /usr/local/bin/moonclock/current/dist/hardware
//   sudo node color-swatches.cjs --colors='#ff8080,#81450e,#3355ff'
//   sudo node color-swatches.cjs --file=palette.txt --mode=cycle
//
// Candidate colors (combined, file entries first, then --colors):
//   --colors=#aabbcc,#112233   comma/space separated hex list
//   --file=palette.txt         one hex per line; blank lines and # comments ok
//
// Modes:
//   --mode=grid   (default) tile every color as a swatch; console prints a
//                 cell -> hex map since we can't label on-panel. Best for
//                 comparing shades side by side.
//   --mode=cycle  full-panel fill, one color at a time, logging each hex. The
//                 truest read of whether a single shade renders.
//   --seconds=2   cycle dwell time per color
//   --gutter=1    black gap (px) between grid swatches; 0 to pack tight
//
// Panel/config options (same as test-matrix; --key=value, flags survive sudo):
//   --rows=32 --cols=32 --chain=1 --mapping=AdafruitHat --slowdown=4
//   --brightness=50
//   --panel='{"pwmBits":11,"pwnLsbNanoseconds":130,"gpioSlowdown":4,"brightness":50}'
// --mapping is a GpioMapping key (e.g. Regular, AdafruitHat, AdafruitHatPwm).
// --panel takes the panel JSON from the DB; individual flags override its fields.
//
// Ctrl+C to quit. The matrix lib needs root for GPIO, hence sudo.

import { readFileSync } from "node:fs";
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

// Accepts "#rrggbb" or "rrggbb" (and 3-digit shorthand); returns { hex, value }
// where value is the 0xRRGGBB int fgColor() wants. Throws on anything else.
function parseColor(raw: string): { hex: string; value: number } {
  const cleaned = raw.trim().replace(/^#/, "").toLowerCase();
  const full =
    cleaned.length === 3
      ? cleaned
          .split("")
          .map((c) => c + c)
          .join("")
      : cleaned;
  if (!/^[0-9a-f]{6}$/.test(full)) {
    throw new Error(`not a hex color: "${raw}"`);
  }
  return { hex: `#${full}`, value: parseInt(full, 16) };
}

function looksLikeHex(token: string): boolean {
  return /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.test(token);
}

function collectColors(args: Record<string, string>) {
  const raw: string[] = [];

  if (args.file !== undefined) {
    let contents: string;
    try {
      contents = readFileSync(args.file, "utf8");
    } catch (e) {
      console.error(`--file could not be read: ${(e as Error).message}`);
      process.exit(1);
    }
    for (const line of contents.split("\n")) {
      // "#" is both the hex prefix and the comment marker, so tokenize the
      // line and stop at the first "#" token that isn't a hex color — the rest
      // of the line is a trailing comment (or the whole line, for "# note").
      for (const token of line.split(/[\s,]+/).filter(Boolean)) {
        if (token.startsWith("#") && !looksLikeHex(token)) break;
        raw.push(token);
      }
    }
  }

  if (args.colors !== undefined) {
    for (const token of args.colors.split(/[\s,]+/)) {
      if (token) raw.push(token);
    }
  }

  if (raw.length === 0) {
    console.error(
      "No colors given. Pass --colors=#aabbcc,#112233 and/or --file=palette.txt",
    );
    process.exit(1);
  }

  const colors: { hex: string; value: number }[] = [];
  for (const token of raw) {
    try {
      colors.push(parseColor(token));
    } catch (e) {
      console.error((e as Error).message);
      process.exit(1);
    }
  }
  return colors;
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

const colors = collectColors(args);

const mode = args.mode ?? "grid";
if (mode !== "grid" && mode !== "cycle") {
  console.error(`Unknown --mode=${mode}. Valid modes: grid, cycle`);
  process.exit(1);
}
const dwellSeconds = Number(args.seconds ?? 2);
const gutter = Number(args.gutter ?? 1);

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
const fps = 30;

// Grid layout: square-ish tiling that fits every color on the panel.
const gridCols = Math.ceil(Math.sqrt(colors.length));
const gridRows = Math.ceil(colors.length / gridCols);
const cellW = Math.floor(width / gridCols);
const cellH = Math.floor(height / gridRows);

function drawSwatch(i: number) {
  const gc = i % gridCols;
  const gr = Math.floor(i / gridCols);
  const x0 = gc * cellW;
  const y0 = gr * cellH;
  matrix.fgColor(colors[i].value);
  for (let x = x0; x < x0 + cellW - gutter && x < width; x++) {
    for (let y = y0; y < y0 + cellH - gutter && y < height; y++) {
      matrix.setPixel(x, y);
    }
  }
}

if (mode === "grid") {
  if (cellW - gutter < 1 || cellH - gutter < 1) {
    console.error(
      `Too many colors (${colors.length}) for a ${width}x${height} panel with ` +
        `--gutter=${gutter}; each swatch would be under 1px. Use fewer colors, ` +
        `--gutter=0, or --mode=cycle.`,
    );
    process.exit(1);
  }
  console.log(
    `\nGrid: ${gridCols} cols x ${gridRows} rows, ${cellW}x${cellH}px cells`,
  );
  console.log("Cell map (row,col from top-left) -> hex:");
  colors.forEach((c, i) => {
    const gc = i % gridCols;
    const gr = Math.floor(i / gridCols);
    console.log(`  [${gr},${gc}]  ${c.hex}`);
  });
} else {
  console.log(`\nCycling ${colors.length} colors, ${dwellSeconds}s each.`);
}

let frame = 0;
let lastCycleIdx = -1;

matrix.afterSync(() => {
  matrix.clear().brightness(brightness);

  if (mode === "grid") {
    for (let i = 0; i < colors.length; i++) drawSwatch(i);
  } else {
    const framesPerColor = Math.max(1, Math.round(fps * dwellSeconds));
    const idx = Math.floor(frame / framesPerColor) % colors.length;
    if (idx !== lastCycleIdx) {
      console.log(`  ${idx + 1}/${colors.length}  ${colors[idx].hex}`);
      lastCycleIdx = idx;
    }
    matrix.fgColor(colors[idx].value).fill();
  }

  frame++;
  setTimeout(() => matrix.sync(), 1000 / fps);
});

console.log("\nStarting render loop — Ctrl+C to quit.");
matrix.sync();
