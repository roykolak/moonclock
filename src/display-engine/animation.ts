const FRAME_RATE = 1000 / 15;
let lastTime = 0;

export function getAnimationFrame(callback: (timestamp: number) => void) {
  const currentTime = performance.now();
  const timeToCall = Math.min(
    FRAME_RATE - (currentTime - lastTime),
    FRAME_RATE
  );

  const timeoutId = setTimeout(() => {
    lastTime = performance.now();
    callback(lastTime);
  }, timeToCall);

  return timeoutId;
}

export function stopAnimationFrame(id: NodeJS.Timeout) {
  clearTimeout(id);
}
