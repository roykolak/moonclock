const FRAME_RATE = 1000 / 60;
let lastTime = 0;

export function getAnimationFrame(
  callback: (timestamp: number) => void,
  framerate?: number
) {
  const currentTime = performance.now();
  const timeToCall = Math.max(
    0,
    (framerate || FRAME_RATE) - (currentTime - lastTime)
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
