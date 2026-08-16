import { drawSprite } from "../draw-sprite";
import { bunnySprite } from "./sprite";
import type { Scene, Sprite } from "../types";
import { SceneId } from "../types";

// --- Breathing -------------------------------------------------------------
// Only the loaf's crown rises. These are the top-of-head pixels (sprite-box
// coords); at the inhale peak they're painted one row higher over the planted
// cat, so the crown gently lifts while the ears, face, paws and cushion stay
// put. The full sprite is always drawn at its grounded origin first, so the
// whole cat never translates up and down — only the crown moves.
const BACK_KEYS = new Set([
  "12:9",
  "13:9",
  "14:9",
  "15:9",
  "11:10",
  "12:10",
  "13:10",
  "14:10",
  "15:10",
  "16:10",
]);
const BREATH_PERIOD_MS = 2600;

const backSprite: Sprite = {
  width: bunnySprite.width,
  height: bunnySprite.height,
  pixels: Object.fromEntries(
    Object.entries(bunnySprite.pixels).filter(([k]) => BACK_KEYS.has(k)),
  ),
};

// --- Eyes ------------------------------------------------------------------
// The two closed `‿‿` eyes (sprite-box coords). Coupled to the breath but
// phase-lagged: they rise a beat AFTER the crown lifts and settle a beat
// BEFORE it falls (EYE_RISE/EYE_FALL sit inside the crown's [0.25, 0.75]
// window), so the face gives a small secondary "stir" as the loaf inhales.
const EYE_KEYS = [
  "8:16",
  "11:16",
  "9:17",
  "10:17",
  "16:16",
  "19:16",
  "17:17",
  "18:17",
];
const EYE_RISE = 0.34; // fraction of the breath cycle when the eyes lift
const EYE_FALL = 0.66; // ...and when they settle back down

// A patch that both erases the planted eyes (backfilling face cream) and
// repaints them one row higher, so drawing it over the grounded cat lifts the
// eyes 1px with no doubled arc. Built from the sprite's own colours.
const EYE_COLOR = bunnySprite.pixels[EYE_KEYS[0]];
const FACE_FILL = bunnySprite.pixels["13:13"];
const eyesUpPixels: Record<string, string> = {};
for (const k of EYE_KEYS) {
  const [x, y] = k.split(":").map(Number);
  eyesUpPixels[`${x}:${y}`] = FACE_FILL; // erase the resting eye
}
for (const k of EYE_KEYS) {
  const [x, y] = k.split(":").map(Number);
  eyesUpPixels[`${x}:${y - 1}`] = EYE_COLOR; // repaint one row up
}
const eyesUpSprite: Sprite = {
  width: bunnySprite.width,
  height: bunnySprite.height,
  pixels: eyesUpPixels,
};

// --- Drifting "z" ----------------------------------------------------------
// Panel-absolute coords (the 28x28 sprite lands at origin (2,2)). A single
// small "z" emerges from the notch between the ears and drifts slowly up and to
// the RIGHT, fading to nothing partway up; then a fresh one begins after a
// short beat. Unlike the sprite, it may drift off the top / upper-right of the
// panel (those rows aren't buffered) — it just clips away.
const Z_ORIGIN = { x: 15, y: 11 };
const Z_COLOR = "#8a90a3";
const Z_CYCLE = 5400;
const Z_RISE = 10;
const Z_DRIFT = 11;
const Z_GLYPH = ["111", "..1", ".1.", "111"];

interface Zed {
  cx: number;
  cy: number;
  alpha: number;
}

function zList(elapsed: number): Zed[] {
  // One z at a time: it rises up-right and fades out over the first Z_FADE of
  // the cycle, then pauses (nothing on screen) before a fresh z begins.
  const Z_FADE = 0.82;
  const p = (((elapsed % Z_CYCLE) + Z_CYCLE) % Z_CYCLE) / Z_CYCLE;
  if (p >= Z_FADE) return [];
  const alpha = Math.sin((p / Z_FADE) * Math.PI);
  if (alpha <= 0.02) return [];
  return [{ cx: Z_ORIGIN.x + p * Z_DRIFT, cy: Z_ORIGIN.y - p * Z_RISE, alpha }];
}

function drawZ(ctx: CanvasRenderingContext2D, z: Zed): void {
  const g = Z_GLYPH;
  const w = g[0].length;
  const h = g.length;
  const ox = Math.round(z.cx - w / 2);
  const oy = Math.round(z.cy - h / 2);
  ctx.globalAlpha = z.alpha;
  ctx.fillStyle = Z_COLOR;
  for (let yy = 0; yy < h; yy++) {
    for (let xx = 0; xx < w; xx++) {
      if (g[yy][xx] === "1") ctx.fillRect(ox + xx, oy + yy, 1, 1);
    }
  }
  ctx.globalAlpha = 1;
}

interface BunnyState {
  full: HTMLCanvasElement;
  back: HTMLCanvasElement;
  eyes: HTMLCanvasElement;
}

async function prerender(
  createCanvas: (d: {
    width: number;
    height: number;
  }) => Promise<HTMLCanvasElement>,
  sprite: Sprite,
): Promise<HTMLCanvasElement> {
  const canvas = await createCanvas({
    width: sprite.width,
    height: sprite.height,
  });
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  drawSprite(ctx, { width: sprite.width, height: sprite.height }, sprite, {
    anchor: "top-left",
  });
  return canvas;
}

export const bunnyScene: Scene<BunnyState> = {
  id: SceneId.Bunny,
  label: "Cat",
  framesPerSecond: 12,
  async init({ createCanvas }) {
    // Pre-render each layer once: the whole cat, the crown pixels that
    // breathe, and the raised-eye patch. Redrawing ~412 pixels every frame is
    // wasteful.
    const full = await prerender(createCanvas, bunnySprite);
    const back = await prerender(createCanvas, backSprite);
    const eyes = await prerender(createCanvas, eyesUpSprite);
    return { full, back, eyes };
  },
  draw({ ctx, dimensions, elapsed, state }) {
    const ox = Math.floor((dimensions.width - bunnySprite.width) / 2);
    const oy = Math.floor((dimensions.height - bunnySprite.height) / 2);

    // 0 → 1 → 0: a slow inhale that lifts the crown by a single pixel.
    const breath = Math.round(
      0.5 - 0.5 * Math.cos((elapsed / BREATH_PERIOD_MS) * Math.PI * 2),
    );

    // Layer A: the planted cat. Layer B: the raised crown, one row up at the
    // inhale peak (layer A backs the row it lifts from, so no gap appears).
    ctx.drawImage(state.full as unknown as CanvasImageSource, ox, oy);
    if (breath) {
      ctx.drawImage(
        state.back as unknown as CanvasImageSource,
        ox,
        oy - breath,
      );
    }

    // Layer C: the eyes, lifted a beat after the crown and settled a beat
    // before it drops. The patch is pre-baked one row up, so no extra offset.
    const cyclePos =
      (((elapsed % BREATH_PERIOD_MS) + BREATH_PERIOD_MS) % BREATH_PERIOD_MS) /
      BREATH_PERIOD_MS;
    if (cyclePos >= EYE_RISE && cyclePos < EYE_FALL) {
      ctx.drawImage(state.eyes as unknown as CanvasImageSource, ox, oy);
    }

    for (const z of zList(elapsed)) drawZ(ctx, z);
  },
};
