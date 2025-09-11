export function mixColors({
  newColor,
  baseColor,
}: {
  newColor: Uint8ClampedArray | null;
  baseColor: Uint8ClampedArray;
}) {
  if (newColor === null) return baseColor;

  const baseAlpha = baseColor[3] / 255;
  const newAlpha = newColor[3] / 255;

  const mix = [];
  mix[3] = 1 - (1 - newAlpha) * (1 - baseAlpha); // alpha
  mix[0] = Math.round(
    (newColor[0] * newAlpha) / mix[3] +
      (baseColor[0] * baseAlpha * (1 - newAlpha)) / mix[3]
  ); // red
  mix[1] = Math.round(
    (newColor[1] * newAlpha) / mix[3] +
      (baseColor[1] * baseAlpha * (1 - newAlpha)) / mix[3]
  ); // green
  mix[2] = Math.round(
    (newColor[2] * newAlpha) / mix[3] +
      (baseColor[2] * baseAlpha * (1 - newAlpha)) / mix[3]
  ); // blue

  mix[3] = mix[3] * 255;

  return new Uint8ClampedArray(mix);
}

export function toHex(uint8ClampedArray: Uint8ClampedArray) {
  let hex = "";
  for (let i = 0; i < uint8ClampedArray.length; i++) {
    hex += uint8ClampedArray[i].toString(16).padStart(2, "0");
  }
  return "#" + hex;
}
