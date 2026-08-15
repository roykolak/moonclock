import { drawSprite } from "../draw-sprite";
import { moonSprite } from "./sprite";
import type { Scene } from "../types";
import { SceneId } from "../types";

// Ported from the old macros/star-twinkle.ts (pixel-macro era). The moon
// sprite and the star pulse are now drawn together in one function, so the
// star positions below are guaranteed to stay lined up with the matching
// grey star pixels baked into moonSprite — they can never drift apart the
// way two independent layers could.
const TWINKLE_STARS = [
  { x: 5, y: 6 },
  { x: 15, y: 9 },
  { x: 30, y: 22 },
  { x: 12, y: 29 },
];

const PULSE_DURATION = 1; // seconds
const DELAY_BETWEEN_PIXELS = 1; // seconds
const SEQUENCE_DELAY = 5; // seconds
const SEQUENCE_DURATION =
  TWINKLE_STARS.length * DELAY_BETWEEN_PIXELS + PULSE_DURATION;
const TOTAL_CYCLE_DURATION = SEQUENCE_DURATION + SEQUENCE_DELAY;

const GLOW_COLOR = "#0f0ade";

function shuffle<T>(unshuffled: T[]): T[] {
  return unshuffled
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

interface MoonState {
  cycleIndex: number;
  twinkleStars: { x: number; y: number }[];
}

export const moonScene: Scene<MoonState> = {
  id: SceneId.Moon,
  label: "Moon",
  framesPerSecond: 15,
  async init() {
    return { cycleIndex: -1, twinkleStars: shuffle(TWINKLE_STARS) };
  },
  draw({ ctx, dimensions, elapsed, state }) {
    // anchor: "center" centers a 29x29 sprite at origin (1,1); +offsetX: 1
    // lands it at (2,1), exactly the legacy scene data's minX/minY — this
    // is pixel-identical to the original moon (see draw-sprite.test.ts).
    drawSprite(ctx, dimensions, moonSprite, {
      anchor: "center",
      offsetX: 1,
      offsetY: 0,
    });

    const elapsedSeconds = elapsed / 1000;
    const cycleIndex = Math.floor(elapsedSeconds / TOTAL_CYCLE_DURATION);
    if (cycleIndex !== state.cycleIndex) {
      state.cycleIndex = cycleIndex;
      state.twinkleStars = shuffle(TWINKLE_STARS);
    }

    const sequenceTime = elapsedSeconds % TOTAL_CYCLE_DURATION;
    if (sequenceTime > SEQUENCE_DURATION) return;

    for (let i = 0; i < TWINKLE_STARS.length; i++) {
      const star = state.twinkleStars[i];
      const pixelTime = sequenceTime - i * DELAY_BETWEEN_PIXELS;
      if (pixelTime < 0 || pixelTime > PULSE_DURATION) continue;

      const alpha = Math.sin((pixelTime / PULSE_DURATION) * Math.PI);

      ctx.globalAlpha = alpha;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(star.x, star.y, 1, 1);

      ctx.globalAlpha = alpha / 2;
      ctx.fillStyle = GLOW_COLOR;
      ctx.fillRect(star.x, star.y - 1, 1, 1);
      ctx.fillRect(star.x, star.y + 1, 1, 1);
      ctx.fillRect(star.x - 1, star.y, 1, 1);
      ctx.fillRect(star.x + 1, star.y, 1, 1);

      ctx.globalAlpha = 1;
    }
  },
};
