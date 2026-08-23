// PURE — no fs, no next/*, no "use server". Bundles into the hardware
// esbuild bundle and the Next server. Keep it that way.
//
// Startup / boot animation — the Moonclock intro shown on the panel while the
// device comes up (wired into hardware/index.ts's boot sequence). Lives
// entirely in `draw`, following the same convention as the curated scenes and
// the wifi/scenes.ts boot scenes: a factory returning a display-engine `Scene`
// (no catalog id/label — it isn't user-selectable).
//
// Constraints:
//   - Centered on the panel at (16, 16).
//   - The art stays inside a centered 16x16 box; each draw clips to it as a
//     hard guarantee (max radius 7.5 keeps everything comfortably within).

import type { Scene } from "@/display-engine/types";

const CX = 16;
const CY = 16;
const TAU = Math.PI * 2;

/** Confine drawing to the centered 16x16 box. The engine wraps each frame in
 *  save()/restore(), so this resets automatically next frame. */
function clipBox(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.rect(CX - 8, CY - 8, 16, 16);
  ctx.clip();
}

/** A soft-edged blob: a solid core out to `core` of the radius, then a feathered
 *  falloff to transparent. Feathering keeps fast sub-pixel motion from popping
 *  pixels on and off — the flicker hard-edged dots produce on the low-res grid. */
function softDisc(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  solid: string,
  clear: string,
  core = 0.5,
) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, solid);
  g.addColorStop(core, solid);
  g.addColorStop(1, clear);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
  ctx.fill();
}

// ---------------------------------------------------------------------------
// The orbiting ring, shared by the loader and its resolution beat below.
// Soft dots hold a fixed radius, drifting slowly around the center — no
// convergence, no center flash. Each dot carries its own hue, evenly spaced
// around the color wheel, so the ring reads as a slowly rotating rainbow.
// ---------------------------------------------------------------------------

const RING_R = 4.4; // orbit radius — keeps the soft dots inside the box
const DOT_R = 1.3; // travelling-dot radius (soft-edged, so this reads smaller)
const ROT = 0.0003; // rad/ms — gentle drift of the whole ring
const RING_ALPHA = 0.7;

const DOT_COUNT = 10;

const DOTS = Array.from({ length: DOT_COUNT }, (_, i) => ({
  angle: -Math.PI / 2 + i * (TAU / DOT_COUNT),
  hue: (i / DOT_COUNT) * 360, // evenly spaced around the color wheel
}));

/** `phase` is time-since-the-ring-appeared, not scene elapsed, so the handoff
 *  from loader to resolution beat can continue the same rotation instead of
 *  snapping back to the start angle. */
function drawRing(
  ctx: CanvasRenderingContext2D,
  phase: number,
  alpha = RING_ALPHA,
  radiusScale = 1,
) {
  if (alpha <= 0) return;

  const rot = phase * ROT;
  ctx.globalAlpha = alpha;
  for (const { angle, hue } of DOTS) {
    softDisc(
      ctx,
      CX + Math.cos(angle + rot) * RING_R * radiusScale,
      CY + Math.sin(angle + rot) * RING_R * radiusScale,
      DOT_R,
      `hsl(${hue}, 85%, 65%)`,
      `hsla(${hue}, 85%, 65%, 0)`,
    );
  }
  ctx.globalAlpha = 1;
}

/** The boot loader: the ring, drifting indefinitely while the device comes up. */
export function createStartupRing(): Scene {
  return {
    framesPerSecond: 30,
    draw({ ctx, elapsed }) {
      clipBox(ctx);
      drawRing(ctx, elapsed);
    },
  };
}

// ---------------------------------------------------------------------------
// "Connected": the ring's resolution beat. The dots gather inward and fade as a
// check strokes in, then it holds. This is the panel's whole report on the
// network now — the address people actually type is the fixed mDNS name
// (http://moonclock.local), so the last boot frame only has to confirm state
// rather than transmit a DHCP-assigned value through a 32x32 grid.
//
// Called standalone (no `phase`) it is just the check: see createStartupConnected.
// ---------------------------------------------------------------------------

const GREEN = "#22C55E";

// Polyline of the check, inside the centered 16x16 box (x/y both 8..24).
const CHECK = [
  { x: 10.5, y: 16.5 },
  { x: 14, y: 20 },
  { x: 21.5, y: 11.5 },
];

const FADE_MS = 320; // ring gathers in and dims out
const DRAW_DELAY_MS = 160; // check starts while the ring is still fading
const DRAW_MS = 420; // stroke-on time

const clamp01 = (n: number) => Math.min(Math.max(n, 0), 1);
/** Ease-out — fast to start, settling at the end. Keeps both the ring's collapse
 *  and the check's stroke from ending on an abrupt stop. */
const easeOut = (t: number) => 1 - (1 - t) * (1 - t);

/** `phase` is the ring's age when this scene took over — see drawRing.
 *
 *  Omit it when no ring preceded this scene. A post-update restart confirms an
 *  update that has already finished, so there is no work for a loader to stand
 *  for: drawing the ring there would put a spinner on screen for ~200ms purely
 *  to collapse it again — the same "reads as a glitch rather than an animation"
 *  that MIN_RING_MS exists to prevent on the boot path. Without a phase the
 *  check strokes in on its own, from the first frame. */
export function createStartupConnected(phase?: number): Scene {
  const legs = CHECK.slice(1).map((point, i) =>
    Math.hypot(point.x - CHECK[i].x, point.y - CHECK[i].y),
  );
  const totalLength = legs.reduce((sum, leg) => sum + leg, 0);

  /** Stroke the first `progress` of the polyline, interpolating within whichever
   *  leg the tip currently falls in. */
  function strokeCheck(ctx: CanvasRenderingContext2D, progress: number) {
    let remaining = totalLength * progress;

    ctx.strokeStyle = GREEN;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(CHECK[0].x, CHECK[0].y);

    for (let i = 0; i < legs.length && remaining > 0; i++) {
      const t = Math.min(remaining / legs[i], 1);
      ctx.lineTo(
        CHECK[i].x + (CHECK[i + 1].x - CHECK[i].x) * t,
        CHECK[i].y + (CHECK[i + 1].y - CHECK[i].y) * t,
      );
      remaining -= legs[i];
    }

    ctx.stroke();
  }

  return {
    framesPerSecond: 30,
    draw({ ctx, elapsed }) {
      clipBox(ctx);

      if (phase !== undefined) {
        const fade = easeOut(clamp01(elapsed / FADE_MS));
        drawRing(
          ctx,
          phase + elapsed,
          RING_ALPHA * (1 - fade),
          1 - 0.55 * fade, // gather toward the center as they go
        );
      }

      const delay = phase === undefined ? 0 : DRAW_DELAY_MS;
      const drawn = clamp01((elapsed - delay) / DRAW_MS);
      if (drawn > 0) strokeCheck(ctx, easeOut(drawn));
    },
  };
}
