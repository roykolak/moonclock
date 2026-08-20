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
//   - A cool cornflower-blue palette anchored on #6495ED, the color of the
//     old boot indicator, so the new intro reads as "same device, better
//     dressed".

import type { Scene } from "@/display-engine/types";

// --- Palette ---------------------------------------------------------------
const WHITE = "#EAF0FF"; // bright core / caps — white with a cool cast
const LIGHT = "#A9C7FF"; // lighter blue — travelling dots / accents

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

function disc(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
  ctx.fill();
}

// ---------------------------------------------------------------------------
// "Converge": dots rush inward, accelerating through the center where they
// cross paths — then keep going and re-form the ring on the far side, never
// pausing. A signed radius swings +R → 0 → -R → 0 → +R so every dot slides
// across the center to the opposite slot and back, while the whole
// constellation slowly rotates so successive passes never quite retrace
// themselves.
// ---------------------------------------------------------------------------
export function createStartupConverge(): Scene {
  const N = 10;
  const START_R = 6.6; // dot + radius stays within the 16x16 box at full extent
  const PERIOD = 4200; // ms for one full there-through-and-back swing
  const ROT = 0.0003; // rad/ms — gentle drift of the whole ring
  const angles = Array.from(
    { length: N },
    (_, i) => -Math.PI / 2 + i * (TAU / N),
  );

  return {
    framesPerSecond: 30,
    draw({ ctx, elapsed }) {
      clipBox(ctx);

      // Signed radius: cos swings +1 → 0 → -1 → 0 → +1 with no dwell. At the
      // extremes the dots slow to a near stop out on the ring; through zero
      // they move fastest, so they feel like they pass through one another and
      // emerge on the opposite side rather than gathering and stopping.
      const phase = ((elapsed % PERIOD) / PERIOD) * TAU;
      const signed = Math.cos(phase);
      const r = START_R * signed;
      const rot = elapsed * ROT;

      // Brightest at the crossing, faint (but visible) orbiting the ring.
      const crossing = 1 - Math.abs(signed);
      ctx.fillStyle = LIGHT;
      ctx.globalAlpha = 0.55 + 0.45 * crossing;
      for (const a of angles) {
        disc(ctx, CX + Math.cos(a + rot) * r, CY + Math.sin(a + rot) * r, 1.1);
      }
      ctx.globalAlpha = 1;

      // A brief bright bloom right as the dots sweep through each other.
      if (crossing > 0.6) {
        ctx.fillStyle = WHITE;
        disc(ctx, CX, CY, (crossing - 0.6) * 3.5);
      }
    },
  };
}
