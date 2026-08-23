import { drawSprite } from "../draw-sprite";
import {
  MOON_SHADOW_TONE,
  MOON_TERMINATOR_TONE,
  MoonTone,
  moonSprite,
} from "./sprite";
import type { Scene, Sprite } from "../types";
import { SceneId } from "../types";

const MS_PER_DAY = 86_400_000;
const SYNODIC_MONTH_DAYS = 29.530588853;
const NEW_MOON_EPOCH_MS = Date.UTC(2000, 0, 6, 18, 14);

const PHASE_STEPS = 720;
const TERMINATOR_SOFTNESS = 1;

const STARS = [
  { x: 2, y: 4 },
  { x: 29, y: 6 },
  { x: 27, y: 28 },
  { x: 4, y: 27 },
  { x: 30, y: 17 },
  { x: 8, y: 2 },
];
const STAR_COLOR = "#E1E8F8";
const STAR_REST_ALPHA = 0.22;
const STAR_PULSE_MS = 2400;
const STAR_STAGGER_MS = 3600;
const TWINKLE_CYCLE_MS = 26_000;

export function lunarPhase(atMs: number): number {
  const days = (atMs - NEW_MOON_EPOCH_MS) / MS_PER_DAY;
  const age =
    ((days % SYNODIC_MONTH_DAYS) + SYNODIC_MONTH_DAYS) % SYNODIC_MONTH_DAYS;
  return age / SYNODIC_MONTH_DAYS;
}

function currentPhaseStep(): number {
  return Math.floor(lunarPhase(Date.now()) * PHASE_STEPS);
}

export function phaseSprite(phase: number): Sprite {
  const radius = moonSprite.width / 2;
  const waxing = phase <= 0.5;
  const squash = Math.cos(2 * Math.PI * phase);
  const pixels: { [key: string]: string } = {};

  for (const key in moonSprite.pixels) {
    const [x, y] = key.split(":").map(Number);
    const dx = x + 0.5 - radius;
    const dy = y + 0.5 - radius;
    const halfChord = Math.sqrt(Math.max(0, radius * radius - dy * dy));
    const terminatorX = squash * halfChord;
    const face = moonSprite.pixels[key];

    if (waxing ? dx < terminatorX : dx > terminatorX) {
      pixels[key] = MOON_SHADOW_TONE[face];
    } else if (
      Math.abs(dx - terminatorX) < TERMINATOR_SOFTNESS &&
      face !== MoonTone.Limb
    ) {
      pixels[key] = MOON_TERMINATOR_TONE;
    } else {
      pixels[key] = face;
    }
  }

  return { width: moonSprite.width, height: moonSprite.height, pixels };
}

function paintPhase(ctx: CanvasRenderingContext2D, phase: number): void {
  const box = { width: moonSprite.width, height: moonSprite.height };
  ctx.clearRect(0, 0, box.width, box.height);
  drawSprite(ctx, box, phaseSprite(phase), { anchor: "top-left" });
}

function drawStars(ctx: CanvasRenderingContext2D, elapsed: number): void {
  const cycle =
    ((elapsed % TWINKLE_CYCLE_MS) + TWINKLE_CYCLE_MS) % TWINKLE_CYCLE_MS;

  ctx.fillStyle = STAR_COLOR;
  for (let i = 0; i < STARS.length; i++) {
    const pulse = cycle - i * STAR_STAGGER_MS;
    const peak =
      pulse >= 0 && pulse <= STAR_PULSE_MS
        ? Math.sin((pulse / STAR_PULSE_MS) * Math.PI)
        : 0;
    ctx.globalAlpha = STAR_REST_ALPHA + (1 - STAR_REST_ALPHA) * peak;
    ctx.fillRect(STARS[i].x, STARS[i].y, 1, 1);
  }
  ctx.globalAlpha = 1;
}

interface MoonState {
  face: HTMLCanvasElement;
  faceCtx: CanvasRenderingContext2D;
  phaseStep: number;
}

export const moonScene: Scene<MoonState> = {
  id: SceneId.Moon,
  label: "Moon",
  framesPerSecond: 12,
  async init({ createCanvas }) {
    const face = await createCanvas({
      width: moonSprite.width,
      height: moonSprite.height,
    });
    const faceCtx = face.getContext("2d") as CanvasRenderingContext2D;
    const phaseStep = currentPhaseStep();
    paintPhase(faceCtx, phaseStep / PHASE_STEPS);
    return { face, faceCtx, phaseStep };
  },
  draw({ ctx, dimensions, elapsed, state }) {
    const phaseStep = currentPhaseStep();
    if (phaseStep !== state.phaseStep) {
      state.phaseStep = phaseStep;
      paintPhase(state.faceCtx, phaseStep / PHASE_STEPS);
    }

    const ox = Math.floor((dimensions.width - moonSprite.width) / 2);
    const oy = Math.floor((dimensions.height - moonSprite.height) / 2);
    ctx.drawImage(state.face as unknown as CanvasImageSource, ox, oy);

    drawStars(ctx, elapsed);
  },
};
