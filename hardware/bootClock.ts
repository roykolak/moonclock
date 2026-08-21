// Lightweight boot instrumentation — a timestamped waterfall of the milestones
// between process launch and the first pixel on the panel. It exists to answer
// one question with real numbers instead of guesswork: where does the time to
// the boot loader actually go?
//
// This module is imported FIRST in hardware/index.ts, ahead of the heavy
// skia-canvas import. ESM evaluates imports in source order, so `moduleEvalStart`
// below is captured right after Node's own bootstrap and BEFORE the ~29 MB
// skia.node dlopen — which lets the first bootMark() attribute native-module
// load time rather than hide it.
//
// performance.now() is milliseconds since the perf time origin (≈ process
// start), so every mark's "since start" reads as time-since-launch with no extra
// bookkeeping. Read the log on-device with:
//   journalctl -u moonclock-hardware.service -b | grep BOOT
// and correlate where the service itself starts in the boot with:
//   systemd-analyze critical-chain moonclock-hardware.service
import { performance } from "perf_hooks";

// Evaluated before skia-canvas is imported (see import order in index.ts), so
// this timestamp predates the skia dlopen.
export const moduleEvalStart = performance.now();

let lastMark = moduleEvalStart;

/** Log `label` with ms-since-launch and the delta since the previous mark. The
 *  delta column is where the cost lives — a big Δ points straight at the slow
 *  step (e.g. the skia dlopen folded into "imports loaded"). */
export function bootMark(label: string) {
  const now = performance.now();
  const sinceStart = now.toFixed(0).padStart(5);
  const sinceLast = (now - lastMark).toFixed(0).padStart(5);
  lastMark = now;
  console.log(`[BOOT +${sinceStart}ms  Δ${sinceLast}ms] ${label}`);
}
