import { drawSprite } from "../draw-sprite";
import { catSprite } from "./sprite";
import type { Scene, Sprite } from "../types";
import { SceneId } from "../types";

// --- Breathing -------------------------------------------------------------
// The loaf never translates — the "breath" is carried entirely by the mouth,
// which opens and closes. The full sprite is always drawn at its grounded
// origin so nothing bounces up and down.
const BREATH_PERIOD_MS = 6000;

// --- Vertical placement ----------------------------------------------------
// The 28x28 sprite box centers at panel origin (2,2), but its ink only spans
// rows 4-27 of the box, so a centered cat sits visually low. Lift every layer
// by this much when drawing. The drifting z is anchored to the same lift (see
// Z_ORIGIN) so it keeps emerging from the notch between the ears.
const SPRITE_LIFT = 1;

// --- Breath staging --------------------------------------------------------
// The breath is a two-beat sequence keyed to fractions of the cycle: the mouth
// opens at MOUTH_OPEN and closes at MOUTH_CLOSE, then the face rests until the
// cycle loops.
const MOUTH_OPEN = 0.12;
const MOUTH_CLOSE = 0.5;

// --- Inhale mouth ----------------------------------------------------------
// While the crown is lifted (the inhale), the resting `‿` smile grows two
// pixels downward, deepening into a small open mouth — as if the loaf is
// drawing a slow breath. The nose and smile stay planted; this patch only
// adds the extra depth below the mouth. The added pixels use a lighter tan
// than the #6e5238 mouth so they read as the softer inner-mouth opening
// rather than another line of the smile.
const INHALE_COLOR = "#cc8d52";
const inhaleSprite: Sprite = {
  width: catSprite.width,
  height: catSprite.height,
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
const Z_ORIGIN = { x: 15, y: 9 - SPRITE_LIFT };
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
  // the cycle, then pauses (nothing on screen) before a fresh z begins. The
  // drift/rise are keyed to the full cycle, so a smaller Z_FADE also means the
  // z vanishes lower in its arc — it dissolves well before the ears clear.
  const Z_FADE = 0.6;
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

interface CatState {
  full: HTMLCanvasElement;
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

export const catScene: Scene<CatState> = {
  id: SceneId.Cat,
  label: "Cat",
  framesPerSecond: 12,
  async init({ createCanvas }) {
    // Pre-render each layer once: the whole cat and the inhale-mouth patch.
    // Redrawing ~412 pixels every frame is wasteful.
    const full = await prerender(createCanvas, catSprite);
    const inhale = await prerender(createCanvas, inhaleSprite);
    return { full, inhale };
  },
  draw({ ctx, dimensions, elapsed, state }) {
    const ox = Math.floor((dimensions.width - catSprite.width) / 2);
    const oy =
      Math.floor((dimensions.height - catSprite.height) / 2) - SPRITE_LIFT;

    // Position within the breath cycle: 0 at rest, 0.5 at the deepest inhale.
    const cyclePos =
      (((elapsed % BREATH_PERIOD_MS) + BREATH_PERIOD_MS) % BREATH_PERIOD_MS) /
      BREATH_PERIOD_MS;

    // Layer A: the planted cat, always drawn first — it never translates.
    ctx.drawImage(state.full as unknown as CanvasImageSource, ox, oy);

    // Two-beat breath (see MOUTH_OPEN/MOUTH_CLOSE): the mouth opens, then
    // closes, and the face rests for the remainder of the cycle.
    if (cyclePos >= MOUTH_OPEN && cyclePos < MOUTH_CLOSE) {
      ctx.drawImage(state.inhale as unknown as CanvasImageSource, ox, oy);
    }

    for (const z of zList(elapsed)) drawZ(ctx, z);
  },
};
