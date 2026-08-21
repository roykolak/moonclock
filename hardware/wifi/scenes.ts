import { Scene } from "../../src/display-engine/types";

// Shown on the panel while the device is offline and the wifi-connect setup
// portal is up. Slowly crossfades between a WiFi glyph and an exclamation mark
// (~4s round trip) so it reads as "your wifi needs attention" — a call to set
// it up, not a "connecting" progress animation. Amber throughout. Both glyphs
// stay inside a centered 24x24 box, leaving >=4px of blank padding on every
// edge. No text or QR, since neither reads well on a 32x32 matrix; the
// discoverable "Moonclock" hotspot carries the rest.
export function createSetupNeededScene(): Scene {
  const bright = "#FACC0D"; // amber — "attention"

  const cx = 16;
  const cy = 22;
  const radii = [4, 8, 12]; // outer arc + lineWidth keeps x within cols 4..27
  const startAngle = (222 * Math.PI) / 180; // top-opening fan...
  const endAngle = (318 * Math.PI) / 180; // ...centered on straight up (270deg)

  function drawFan(ctx: CanvasRenderingContext2D, alpha: number) {
    ctx.lineCap = "round";
    ctx.lineWidth = 2;
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = bright;
    for (const r of radii) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, startAngle, endAngle);
      ctx.stroke();
    }
    ctx.fillStyle = bright;
    ctx.beginPath();
    ctx.arc(cx, cy, 1.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  function drawBang(ctx: CanvasRenderingContext2D, alpha: number) {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = bright;
    ctx.fillRect(cx - 1, 7, 3, 13); // stem
    ctx.beginPath();
    ctx.arc(cx + 0.5, 24, 1.8, 0, Math.PI * 2); // dot
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  return {
    framesPerSecond: 20,
    draw({ ctx, dimensions, elapsed }) {
      const { width, height } = dimensions;

      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      // 0 = full WiFi glyph, 1 = full exclamation; sinusoid gives a slow, held
      // crossfade in each direction (~4s round trip).
      const toBang = (Math.sin((elapsed / 2000) * Math.PI) + 1) / 2;
      drawFan(ctx, 0.85 * (1 - toBang));
      drawBang(ctx, 0.95 * toBang);
    },
  };
}

// Progress feedback shown while the physical button is held, warning the user a
// WiFi reset is about to fire. `durationMs` is the remaining hold time until the
// reset triggers, so the bar fills exactly as the threshold is reached.
export function createHoldToResetScene(durationMs: number): Scene {
  return {
    framesPerSecond: 20,
    draw({ ctx, dimensions, elapsed }) {
      const { width, height } = dimensions;

      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      ctx.textBaseline = "top";
      ctx.font = "8px Tiny5";
      ctx.fillStyle = "#F87171";
      ctx.fillText("Reset", 0, 3);
      ctx.fillText("WiFi?", 0, 12);

      const progress = Math.min(elapsed / durationMs, 1);
      const barWidth = Math.floor(progress * width);
      ctx.fillStyle = "#F87171";
      ctx.fillRect(0, height - 3, barWidth, 2);
    },
  };
}

// Shown when boot gives up waiting for an address: the setup portal isn't
// running (so createSetupNeededScene would be a lie) and no IP ever arrived —
// the device is on, but joined nothing. Static text rather than the marquee the
// IP used to get: there's nothing here to scroll, and a held frame can be read
// whenever someone happens to look up.
export function createNoNetworkScene(): Scene {
  return {
    draw({ ctx, dimensions }) {
      const { width, height } = dimensions;

      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      ctx.textBaseline = "top";
      ctx.font = "8px Tiny5";
      ctx.fillStyle = "#F87171";
      ctx.fillText("No", 0, 5);
      ctx.fillText("network", 0, 14);
    },
  };
}
