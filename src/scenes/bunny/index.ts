import { drawSprite } from "../draw-sprite";
import { bunnySprite } from "./sprite";
import type { Scene, Sprite } from "../types";
import { SceneId } from "../types";

// --- Breathing -------------------------------------------------------------
// The loaf never translates — the "breath" is carried entirely by the face:
// the mouth opens and the eyes stir. The full sprite is always drawn at its
// grounded origin so nothing bounces up and down.
const BREATH_PERIOD_MS = 4200;

// --- Breath staging --------------------------------------------------------
// The breath is a four-beat sequence, each beat keyed to a fraction of the
// cycle. The mouth and eye windows OVERLAP in a staggered "canon" rather than
// nesting, so the order over p:0→1 is:
//   1. mouth opens
//   2. eyes rise
//   3. mouth closes   (a short beat after the eyes rise)
//   4. eyes fall
// then the face rests until the cycle loops.
const MOUTH_OPEN = 0.12; // mouth opens
const EYES_RISE = 0.4; //   eyes rise
const MOUTH_CLOSE = 0.5; //  mouth closes (just after the eyes rise)
const EYES_FALL = 0.78; //   eyes fall

// --- Eyes ------------------------------------------------------------------
// The two closed `‿‿` eyes (sprite-box coords). They are the innermost beat
// of the breath (see EYES_ON): they lift LAST on the inhale and lower FIRST
// on the exhale, a small secondary "stir" that peaks with the deepest breath.
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

// A patch that both erases the planted eyes (backfilling face cream) and
// repaints them one row higher, so drawing it over the grounded cat lifts the
// eyes 1px with no doubled arc. The lifted eyes use a lighter warm brown than
// the resting `#2b1d0f` line, so they soften as they rise — reading as a
// gentle stir toward waking rather than the hard sleeping line.
const EYE_UP_COLOR = "#6e5238";
const FACE_FILL = bunnySprite.pixels["13:13"];
const eyesUpPixels: Record<string, string> = {};
for (const k of EYE_KEYS) {
  const [x, y] = k.split(":").map(Number);
  eyesUpPixels[`${x}:${y}`] = FACE_FILL; // erase the resting eye
}
for (const k of EYE_KEYS) {
  const [x, y] = k.split(":").map(Number);
  eyesUpPixels[`${x}:${y - 1}`] = EYE_UP_COLOR; // repaint one row up, lighter
}
const eyesUpSprite: Sprite = {
  width: bunnySprite.width,
  height: bunnySprite.height,
  pixels: eyesUpPixels,
};

// --- Inhale mouth ----------------------------------------------------------
// While the crown is lifted (the inhale), the resting `‿` smile grows two
// pixels downward, deepening into a small open mouth — as if the loaf is
// drawing a slow breath. The nose and smile stay planted; this patch only
// adds the extra depth below the mouth. The added pixels use a lighter tan
// than the #6e5238 mouth so they read as the softer inner-mouth opening
// rather than another line of the smile.
const INHALE_COLOR = "#ffb066";
const inhaleSprite: Sprite = {
  width: bunnySprite.width,
  height: bunnySprite.height,
  pixels: {
    "13:21": INHALE_COLOR,
    "14:21": INHALE_COLOR,
  },
};

// --- Drifting "z" ----------------------------------------------------------
// Panel-absolute coords (the 28x28 sprite lands at origin (2,2)). A single
// small "z" emerges from the notch between the ears and drifts slowly up and to
// the RIGHT, fading to nothing partway up; then a fresh one begins after a
// short beat. Unlike the sprite, it may drift off the top / upper-right of the
// panel (those rows aren't buffered) — it just clips away.
const Z_ORIGIN = { x: 15, y: 9 };
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
  eyes: HTMLCanvasElement;
  inhale: HTMLCanvasElement;
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
    // Pre-render each layer once: the whole cat, the raised-eye patch, and
    // the inhale-mouth patch. Redrawing ~412 pixels every frame is wasteful.
    const full = await prerender(createCanvas, bunnySprite);
    const eyes = await prerender(createCanvas, eyesUpSprite);
    const inhale = await prerender(createCanvas, inhaleSprite);
    return { full, eyes, inhale };
  },
  draw({ ctx, dimensions, elapsed, state }) {
    const ox = Math.floor((dimensions.width - bunnySprite.width) / 2);
    const oy = Math.floor((dimensions.height - bunnySprite.height) / 2);

    // Position within the breath cycle: 0 at rest, 0.5 at the deepest inhale.
    const cyclePos =
      (((elapsed % BREATH_PERIOD_MS) + BREATH_PERIOD_MS) % BREATH_PERIOD_MS) /
      BREATH_PERIOD_MS;

    // Layer A: the planted cat, always drawn first — it never translates.
    ctx.drawImage(state.full as unknown as CanvasImageSource, ox, oy);

    // Four-beat breath (see the *_OPEN/*_RISE/*_CLOSE/*_FALL thresholds): the
    // mouth opens, the eyes rise, the mouth closes just after, then the eyes
    // fall. The mouth and eye windows overlap, so the beats stagger.
    if (cyclePos >= MOUTH_OPEN && cyclePos < MOUTH_CLOSE) {
      ctx.drawImage(state.inhale as unknown as CanvasImageSource, ox, oy);
    }
    if (cyclePos >= EYES_RISE && cyclePos < EYES_FALL) {
      ctx.drawImage(state.eyes as unknown as CanvasImageSource, ox, oy);
    }

    for (const z of zList(elapsed)) drawZ(ctx, z);
  },
};
