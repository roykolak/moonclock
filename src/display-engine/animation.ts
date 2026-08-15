import { AnimationConfig } from "./types";

/** A `setTimeout`-based frame scheduler, one instance per animated scene.
 *
 *  Each instance tracks its own `lastTime`, so concurrent scenes pace
 *  independently and each scene's `framesPerSecond` is honored correctly. */
export function createAnimationLoop(options: AnimationConfig) {
  const frameRate = 1000 / options.framesPerSecond;
  let lastTime = 0;
  let timeoutId: NodeJS.Timeout | undefined;
  let stopped = false;

  return {
    schedule(callback: () => void) {
      if (stopped) return;

      const currentTime = performance.now();
      const timeToCall = Math.max(
        0,
        Math.min(frameRate - (currentTime - lastTime), frameRate),
      );

      timeoutId = setTimeout(() => {
        lastTime = performance.now();
        callback();
      }, timeToCall);
    },
    stop() {
      stopped = true;
      if (timeoutId) clearTimeout(timeoutId);
    },
  };
}
