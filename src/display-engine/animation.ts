import { AnimationConfig } from "./types";

/** A `setTimeout`-based frame scheduler, one instance per animated macro.
 *
 *  Each instance tracks its own `lastTime`. The previous implementation
 *  kept `lastTime` at module scope, shared by every animated macro in the
 *  process — so two concurrently-running macros (e.g. a scene with two
 *  animated layers) would clobber each other's pacing and neither macro's
 *  `framesPerSecond` was honored correctly. */
export function createAnimationLoop(options: AnimationConfig) {
  const frameRate = 1000 / options.framesPerSecond;
  let lastTime = 0;
  let timeoutId: NodeJS.Timeout | undefined;
  let stopped = false;

  return {
    schedule(callback: (timestamp: number) => void) {
      if (stopped) return;

      const currentTime = performance.now();
      const timeToCall = Math.max(
        0,
        Math.min(frameRate - (currentTime - lastTime), frameRate),
      );

      timeoutId = setTimeout(() => {
        lastTime = performance.now();
        callback(lastTime);
      }, timeToCall);
    },
    stop() {
      stopped = true;
      if (timeoutId) clearTimeout(timeoutId);
    },
  };
}
