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
// "Ring": soft dots orbit a fixed radius, drifting slowly around the center —
// no convergence, no center flash. Each dot carries its own hue, evenly spaced
// around the color wheel, so the ring reads as a slowly rotating rainbow.
// ---------------------------------------------------------------------------
export function createStartupRing(): Scene {
  const N = 10;
  const RING_R = 4.4; // orbit radius — keeps the soft dots inside the box
  const DOT_R = 1.3; // travelling-dot radius (soft-edged, so this reads smaller)
  const ROT = 0.0003; // rad/ms — gentle drift of the whole ring
  const dots = Array.from({ length: N }, (_, i) => ({
    angle: -Math.PI / 2 + i * (TAU / N),
    hue: (i / N) * 360, // evenly spaced around the color wheel
  }));

  return {
    framesPerSecond: 30,
    draw({ ctx, elapsed }) {
      clipBox(ctx);

      const rot = elapsed * ROT;
      ctx.globalAlpha = 0.7;
      for (const { angle, hue } of dots) {
        softDisc(
          ctx,
          CX + Math.cos(angle + rot) * RING_R,
          CY + Math.sin(angle + rot) * RING_R,
          DOT_R,
          `hsl(${hue}, 85%, 65%)`,
          `hsla(${hue}, 85%, 65%, 0)`,
        );
      }
      ctx.globalAlpha = 1;
    },
  };
}
