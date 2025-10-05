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

export function colorToRgba(hexOrRgbString: string) {
  if (hexOrRgbString.includes("rgb")) {
    const result = hexOrRgbString.match(
      /^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i
    );
    if (result) {
      return {
        r: parseInt(result[1], 10),
        g: parseInt(result[2], 10),
        b: parseInt(result[3], 10),
        a: parseInt(result[4], 10) || 255,
      };
    }
  } else {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
      hexOrRgbString
    );
    if (result) {
      return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: 255,
      };
    }
  }

  return { r: 0, g: 0, b: 0, a: 0 };
}
