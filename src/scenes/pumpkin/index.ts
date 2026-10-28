import { drawSprite } from "../draw-sprite";
import { carvedPixels, pumpkinSprite } from "./sprite";
import type { Scene } from "../types";
import { SceneId } from "../types";

const GUTTER_CYCLE_MS = 7300;
const GUTTER_MS = 380;
export const FLAME_FLOOR = 0.12;

export const CANDLE_RAMP: [number, number, number][] = [
  [0xd0, 0x48, 0x00],
  [0xff, 0x8a, 0x10],
  [0xff, 0xc8, 0x3a],
  [0xff, 0xf0, 0xa0],
];

const CARVED = carvedPixels.map((key) => key.split(":").map(Number));

function wave(t: number, periodMs: number, phase: number): number {
  return Math.sin((2 * Math.PI * t) / periodMs + phase);
}

export function flame(elapsed: number): number {
  const waver =
    0.5 * wave(elapsed, 1730, 0) +
    0.3 * wave(elapsed, 610, 1.3) +
    0.2 * wave(elapsed, 233, 0.4);
  const g = ((elapsed % GUTTER_CYCLE_MS) + GUTTER_CYCLE_MS) % GUTTER_CYCLE_MS;
  const gutter = g < GUTTER_MS ? Math.sin((g / GUTTER_MS) * Math.PI) : 0;
  return Math.min(1, Math.max(FLAME_FLOOR, 0.7 + 0.2 * waver - 0.35 * gutter));
}

export function candleColor(level: number): [number, number, number] {
  const p = Math.min(0.999, Math.max(0, level)) * (CANDLE_RAMP.length - 1);
  const i = Math.floor(p);
  const f = p - i;
  const [from, to] = [CANDLE_RAMP[i], CANDLE_RAMP[i + 1]];
  return [0, 1, 2].map((k) => Math.round(from[k] + (to[k] - from[k]) * f)) as [
    number,
    number,
    number,
  ];
}

interface PumpkinState {
  rind: HTMLCanvasElement;
}

export const pumpkinScene: Scene<PumpkinState> = {
  id: SceneId.Pumpkin,
  label: "Pumpkin",
  framesPerSecond: 12,
  async init({ createCanvas }) {
    const box = { width: pumpkinSprite.width, height: pumpkinSprite.height };
    const rind = await createCanvas(box);
    const rindCtx = rind.getContext("2d") as CanvasRenderingContext2D;
    drawSprite(rindCtx, box, pumpkinSprite, { anchor: "top-left" });
    return { rind };
  },
  draw({ ctx, dimensions, elapsed, state }) {
    const ox = Math.floor((dimensions.width - pumpkinSprite.width) / 2);
    const oy = Math.floor((dimensions.height - pumpkinSprite.height) / 2);
    ctx.drawImage(state.rind as unknown as CanvasImageSource, ox, oy);

    const [r, g, b] = candleColor(flame(elapsed));
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    for (const [x, y] of CARVED) ctx.fillRect(ox + x, oy + y, 1, 1);
  },
};
