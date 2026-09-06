import { DIGIT_GLYPHS, DIGIT_HEIGHT, DIGIT_WIDTH } from "./font";
import type { Scene } from "../types";
import { SceneId } from "../types";

const CASE_HIGHLIGHT = "#ffab4d";
const CASE_BODY = "#ff8c1a";
const CASE_SHADOW = "#b35c0a";
const BOARD = "#141009";
const CARD_TOP = "#3a2c1a";
const CARD_BOTTOM = "#2b1f12";
const CARD_BEHIND = "#1d150c";
const SEAM = "#0d0a06";
const DIGIT = "#ffe9b8";
const DIGIT_AT_SEAM = "#8a7449";

export const CASE_LEFT = 3;
export const CASE_RIGHT = 28;
export const CASE_TOP = 8;
export const CASE_BOTTOM = 24;
const CORNER = 2;

export const FEET_COLUMNS = [7, 8, 9, 22, 23, 24];
export const FEET_ROW = 25;

export const BOARD_LEFT = 5;
export const BOARD_RIGHT = 26;
export const BOARD_TOP = 11;
export const BOARD_BOTTOM = 21;

export const CARD_WIDTH = DIGIT_WIDTH;
export const CARD_HEIGHT = 11;
export const CARD_COLUMNS = [5, 10, 18, 23];
const DIGIT_INSET_Y = 1;
const SEAM_ROW = Math.floor(CARD_HEIGHT / 2);

const FLIP_MS = 420;

function isChamfered(x: number, y: number): boolean {
  const fromSide = Math.min(x - CASE_LEFT, CASE_RIGHT - x);
  const fromEnd = Math.min(y - CASE_TOP, CASE_BOTTOM - y);
  return (
    (fromSide === 0 && fromEnd < CORNER) || (fromEnd === 0 && fromSide < CORNER)
  );
}

function paintChrome(ctx: CanvasRenderingContext2D): void {
  for (let y = CASE_TOP; y <= CASE_BOTTOM; y++) {
    for (let x = CASE_LEFT; x <= CASE_RIGHT; x++) {
      if (isChamfered(x, y)) continue;
      ctx.fillStyle =
        y === CASE_TOP
          ? CASE_HIGHLIGHT
          : y === CASE_BOTTOM
            ? CASE_SHADOW
            : CASE_BODY;
      ctx.fillRect(x, y, 1, 1);
    }
  }

  ctx.fillStyle = CASE_SHADOW;
  for (const x of FEET_COLUMNS) ctx.fillRect(x, FEET_ROW, 1, 1);

  ctx.clearRect(
    CASE_LEFT + 1,
    CASE_TOP + 2,
    CASE_RIGHT - CASE_LEFT - 1,
    CASE_BOTTOM - CASE_TOP - 3,
  );

  ctx.fillStyle = BOARD;
  ctx.fillRect(
    BOARD_LEFT,
    BOARD_TOP,
    BOARD_RIGHT - BOARD_LEFT + 1,
    BOARD_BOTTOM - BOARD_TOP + 1,
  );
}

function onGlyph(digit: string, x: number, y: number): boolean {
  const rows = DIGIT_GLYPHS[digit];
  const glyphY = y - DIGIT_INSET_Y;
  if (!rows || glyphY < 0 || glyphY >= DIGIT_HEIGHT) return false;
  return x >= 0 && x < DIGIT_WIDTH && rows[glyphY][x] === "1";
}

function cardTone(digit: string | null, x: number, y: number): string {
  const lit = digit !== null && onGlyph(digit, x, y);
  if (y === SEAM_ROW) return lit ? DIGIT_AT_SEAM : SEAM;
  if (lit) return DIGIT;
  if (digit === null) return CARD_BEHIND;
  return y < SEAM_ROW ? CARD_TOP : CARD_BOTTOM;
}

function paintCardRow(
  ctx: CanvasRenderingContext2D,
  originX: number,
  originY: number,
  digit: string | null,
  sourceY: number,
  destinationY: number,
): void {
  for (let x = 0; x < CARD_WIDTH; x++) {
    ctx.fillStyle = cardTone(digit, x, sourceY);
    ctx.fillRect(originX + x, originY + destinationY, 1, 1);
  }
}

function paintCard(
  ctx: CanvasRenderingContext2D,
  originX: number,
  originY: number,
  current: string,
  previous: string | null,
  progress: number | null,
): void {
  const flipping =
    progress !== null && previous !== null && previous !== current;

  const settled = !flipping ? current : progress < 0.5 ? previous : current;
  for (let y = SEAM_ROW; y < CARD_HEIGHT; y++) {
    paintCardRow(ctx, originX, originY, settled, y, y);
  }

  if (!flipping) {
    for (let y = 0; y < SEAM_ROW; y++) {
      paintCardRow(ctx, originX, originY, current, y, y);
    }
    return;
  }

  for (let y = 0; y < SEAM_ROW; y++) {
    paintCardRow(ctx, originX, originY, null, y, y);
  }

  const squash = progress < 0.5 ? 1 - progress * 2 : (progress - 0.5) * 2;
  if (squash <= 0.02) return;

  const folding = progress < 0.5 ? previous : current;
  const visibleRows = Math.round(SEAM_ROW * squash);
  for (let step = 1; step <= visibleRows; step++) {
    const sourceY = Math.round(SEAM_ROW - step / squash);
    if (sourceY < 0) continue;
    paintCardRow(ctx, originX, originY, folding, sourceY, SEAM_ROW - step);
  }
}

export function timeDigits(now: Date): string[] {
  const hours = String(now.getHours() % 12 || 12).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return [hours[0], hours[1], minutes[0], minutes[1]];
}

interface DigitalClockState {
  chrome: HTMLCanvasElement;
  shown: string[];
  previous: (string | null)[];
  flippedAt: number[];
}

export const digitalClockScene: Scene<DigitalClockState> = {
  id: SceneId.DigitalClock,
  label: "Digital clock",
  framesPerSecond: 12,
  async init({ createCanvas, dimensions }) {
    const chrome = await createCanvas(dimensions);
    paintChrome(chrome.getContext("2d") as CanvasRenderingContext2D);
    return {
      chrome,
      shown: timeDigits(new Date()),
      previous: [null, null, null, null],
      flippedAt: [0, 0, 0, 0],
    };
  },
  draw({ ctx, elapsed, state }) {
    ctx.drawImage(state.chrome as unknown as CanvasImageSource, 0, 0);

    const wanted = timeDigits(new Date());
    for (let i = 0; i < CARD_COLUMNS.length; i++) {
      if (wanted[i] === state.shown[i]) continue;
      state.previous[i] = state.shown[i];
      state.shown[i] = wanted[i];
      state.flippedAt[i] = elapsed;
    }

    for (let i = 0; i < CARD_COLUMNS.length; i++) {
      const since = (elapsed - state.flippedAt[i]) / FLIP_MS;
      paintCard(
        ctx,
        CARD_COLUMNS[i],
        BOARD_TOP,
        state.shown[i],
        state.previous[i],
        since >= 0 && since < 1 ? since : null,
      );
    }
  },
};
