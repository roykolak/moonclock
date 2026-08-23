// Prepares the database at install time: mints this clock's device id if it
// doesn't have one yet, then applies any LED panel settings passed on the
// command line.
//
// install.sh runs this (as `NODE_ENV=production node configure-panel.cjs ...`)
// before starting the services, so the panel can be configured at install time
// instead of by hand on the Settings page after first boot -- and so the whole
// database is created by this one process rather than by whichever service
// happens to read it first. Only the fields you pass are changed; every other
// panel field and all presets are left alone. Passing no flags still settles
// the identity, but leaves the panel untouched.
//
//   node configure-panel.cjs \
//     --brightness=50 --hardware-mapping=adafruit-hat-pwm \
//     --pwm-bits=11 --gpio-slowdown=4 --pwm-lsb-nanoseconds=130 \
//     --pwm-dither-bits=0 --limit-refresh-hz=0 --panel-type=
//
// getData()/setData() choose the database file from NODE_ENV (see
// databaseFile() in src/server/utils.ts), so run with NODE_ENV=production to
// target /var/lib/moonclock/database.json.

import { prepareDatabase, setData } from "@/server/db";
import type { Panel, PanelType } from "@/types";

const HARDWARE_MAPPINGS = [
  "regular",
  "adafruit-hat",
  "adafruit-hat-pwm",
  "regular-pi1",
];

const PANEL_TYPES = ["", "FM6126A", "FM6127"];

function parseArgs(argv: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const arg of argv) {
    const match = arg.match(/^--([^=]+)=(.*)$/);
    if (match) {
      out[match[1]] = match[2];
    } else {
      fail(`Unrecognized argument: ${arg} (expected --flag=value)`);
    }
  }
  return out;
}

function fail(message: string): never {
  console.error(`configure-panel: ${message}`);
  process.exit(1);
}

// Parses an integer flag and checks it falls within [min, max] inclusive.
function intInRange(
  args: Record<string, string>,
  flag: string,
  min: number,
  max: number,
): number | undefined {
  const raw = args[flag];
  if (raw === undefined) return undefined;
  if (!/^-?\d+$/.test(raw.trim())) {
    fail(`--${flag} must be an integer, got "${raw}"`);
  }
  const value = Number(raw);
  if (value < min || value > max) {
    fail(`--${flag} must be between ${min} and ${max}, got ${value}`);
  }
  return value;
}

const args = parseArgs(process.argv.slice(2));

const KNOWN_FLAGS = [
  "brightness",
  "hardware-mapping",
  "pwm-bits",
  "gpio-slowdown",
  "pwm-lsb-nanoseconds",
  "pwm-dither-bits",
  "limit-refresh-hz",
  "panel-type",
];
for (const flag of Object.keys(args)) {
  if (!KNOWN_FLAGS.includes(flag)) {
    fail(`Unknown flag --${flag}. Known flags: ${KNOWN_FLAGS.join(", ")}`);
  }
}

const overrides: Partial<Panel> = {};

const brightness = intInRange(args, "brightness", 0, 100);
if (brightness !== undefined) overrides.brightness = brightness;

const pwmBits = intInRange(args, "pwm-bits", 1, 11);
if (pwmBits !== undefined) overrides.pwmBits = pwmBits as Panel["pwmBits"];

const gpioSlowdown = intInRange(args, "gpio-slowdown", 0, 4);
if (gpioSlowdown !== undefined) {
  overrides.gpioSlowdown = gpioSlowdown as Panel["gpioSlowdown"];
}

const pwnLsbNanoseconds = intInRange(args, "pwm-lsb-nanoseconds", 1, 100000);
if (pwnLsbNanoseconds !== undefined) {
  overrides.pwnLsbNanoseconds = pwnLsbNanoseconds;
}

const pwmDitherBits = intInRange(args, "pwm-dither-bits", 0, 2);
if (pwmDitherBits !== undefined) {
  overrides.pwmDitherBits = pwmDitherBits as Panel["pwmDitherBits"];
}

const limitRefreshRateHz = intInRange(args, "limit-refresh-hz", 0, 10000);
if (limitRefreshRateHz !== undefined) {
  overrides.limitRefreshRateHz = limitRefreshRateHz;
}

if (args["panel-type"] !== undefined) {
  const panelType = args["panel-type"];
  if (!PANEL_TYPES.includes(panelType)) {
    fail(
      `--panel-type must be one of ${PANEL_TYPES.map((t) => t || '""').join(", ")}, got "${panelType}"`,
    );
  }
  overrides.panelType = panelType as PanelType;
}

if (args["hardware-mapping"] !== undefined) {
  const mapping = args["hardware-mapping"];
  if (!HARDWARE_MAPPINGS.includes(mapping)) {
    fail(
      `--hardware-mapping must be one of ${HARDWARE_MAPPINGS.join(", ")}, got "${mapping}"`,
    );
  }
  overrides.hardwareMapping = mapping;
}

const { deviceId, panel } = prepareDatabase();
console.log(`configure-panel: device id ${deviceId}`);

if (Object.keys(overrides).length === 0) {
  console.log(
    "configure-panel: no panel flags passed, leaving the panel alone",
  );
  process.exit(0);
}

setData({ panel: { ...panel, ...overrides } });

const applied = Object.entries(overrides)
  .map(([key, value]) => `${key}=${value}`)
  .join(" ");
console.log(`configure-panel: applied ${applied}`);
