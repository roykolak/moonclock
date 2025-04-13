let lastTime = 0;

export function getAnimationFrame(
  callback: (timestamp: number) => void,
  options: {
    framesPerSecond: number;
  }
) {
  const frameRate = 1000 / options.framesPerSecond;

  const currentTime = performance.now();
  const timeToCall = Math.min(frameRate - (currentTime - lastTime), frameRate);

  const timeoutId = setTimeout(() => {
    lastTime = performance.now();
    callback(lastTime);
  }, timeToCall);

  return timeoutId;
}

export function stopAnimationFrame(id: NodeJS.Timeout) {
  clearTimeout(id);
}
