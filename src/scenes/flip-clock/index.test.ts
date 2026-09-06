import { describe, it } from "node:test";
import assert from "node:assert";
import {
  BOARD_BOTTOM,
  BOARD_LEFT,
  BOARD_RIGHT,
  BOARD_TOP,
  CARD_COLUMNS,
  CARD_HEIGHT,
  CARD_WIDTH,
  CASE_BOTTOM,
  CASE_LEFT,
  CASE_RIGHT,
  CASE_TOP,
  FEET_COLUMNS,
  FEET_ROW,
  timeDigits,
} from "./index";
import { DIGIT_GLYPHS, DIGIT_HEIGHT, DIGIT_WIDTH } from "./font";

const PANEL = 32;
const MARGIN = 3;

describe("flip clock font", () => {
  it("has a glyph for every digit", () => {
    for (let n = 0; n <= 9; n++) {
      assert.ok(DIGIT_GLYPHS[String(n)], `missing ${n}`);
    }
  });

  it("declares every glyph at the declared size", () => {
    for (const [digit, rows] of Object.entries(DIGIT_GLYPHS)) {
      assert.equal(rows.length, DIGIT_HEIGHT, `${digit} height`);
      for (const [index, row] of rows.entries()) {
        assert.equal(row.length, DIGIT_WIDTH, `${digit} row ${index} width`);
        assert.match(row, /^[01]+$/, `${digit} row ${index} content`);
      }
    }
  });

  it("keeps a hollow centre in the round digits", () => {
    for (const digit of ["0", "6", "8", "9"]) {
      const hollow = DIGIT_GLYPHS[digit].some((row) => row.includes("0110"));
      assert.ok(hollow, `${digit} closed up`);
    }
  });

  it("gives every digit a distinct shape", () => {
    const shapes = Object.values(DIGIT_GLYPHS).map((rows) => rows.join());
    assert.equal(new Set(shapes).size, shapes.length);
  });
});

describe("flip clock layout", () => {
  it("keeps the whole scene inside the panel's safe area", () => {
    const left = CASE_LEFT;
    const right = PANEL - 1 - CASE_RIGHT;
    const top = CASE_TOP;
    const bottom = PANEL - 1 - Math.max(CASE_BOTTOM, FEET_ROW);
    for (const [edge, value] of Object.entries({ left, right, top, bottom })) {
      assert.ok(value >= MARGIN, `${edge} padding is ${value}px`);
    }
  });

  it("stands the feet under the case, not beside it", () => {
    assert.equal(FEET_ROW, CASE_BOTTOM + 1);
    for (const x of FEET_COLUMNS) {
      assert.ok(x > CASE_LEFT && x < CASE_RIGHT, `foot at ${x}`);
    }
  });

  it("mirrors the case and the feet about the panel's centre", () => {
    assert.equal(CASE_LEFT + CASE_RIGHT, PANEL - 1);
    const mirrored = FEET_COLUMNS.map((x) => PANEL - 1 - x).sort(
      (a, b) => a - b,
    );
    assert.deepEqual(
      mirrored,
      [...FEET_COLUMNS].sort((a, b) => a - b),
    );
  });

  it("leaves a black band between the case and the board", () => {
    assert.ok(BOARD_LEFT - CASE_LEFT >= 2, "left band");
    assert.ok(CASE_RIGHT - BOARD_RIGHT >= 2, "right band");
    assert.ok(BOARD_TOP - CASE_TOP >= 3, "top band");
    assert.ok(CASE_BOTTOM - BOARD_BOTTOM >= 3, "bottom band");
  });

  it("fits every card inside the board", () => {
    for (const x of CARD_COLUMNS) {
      assert.ok(x >= BOARD_LEFT, `card at ${x} runs off the left`);
      assert.ok(x + CARD_WIDTH - 1 <= BOARD_RIGHT, `card at ${x} overflows`);
    }
    assert.equal(BOARD_BOTTOM - BOARD_TOP + 1, CARD_HEIGHT);
  });

  it("never overlaps two cards", () => {
    for (let i = 1; i < CARD_COLUMNS.length; i++) {
      const gap = CARD_COLUMNS[i] - (CARD_COLUMNS[i - 1] + CARD_WIDTH);
      assert.ok(gap >= 1, `cards ${i - 1} and ${i} are ${gap}px apart`);
    }
  });

  it("separates hours from minutes by more than it separates digits", () => {
    const within = CARD_COLUMNS[1] - (CARD_COLUMNS[0] + CARD_WIDTH);
    const centre = CARD_COLUMNS[2] - (CARD_COLUMNS[1] + CARD_WIDTH);
    assert.ok(centre > within, `centre ${centre}px vs digit gap ${within}px`);
    assert.equal(CARD_COLUMNS[3] - (CARD_COLUMNS[2] + CARD_WIDTH), within);
  });
});

describe("timeDigits", () => {
  const at = (hours: number, minutes: number) =>
    timeDigits(new Date(2026, 0, 1, hours, minutes)).join("");

  it("reads midnight and noon as twelve", () => {
    assert.equal(at(0, 0), "1200");
    assert.equal(at(12, 0), "1200");
  });

  it("wraps the afternoon back to a twelve-hour face", () => {
    assert.equal(at(13, 5), "0105");
    assert.equal(at(23, 59), "1159");
  });

  it("pads the hour so the board never goes blank", () => {
    assert.equal(at(9, 7).length, 4);
    assert.equal(at(1, 0), "0100");
  });

  it("only ever emits digits the font can draw", () => {
    for (let hours = 0; hours < 24; hours++) {
      for (const minutes of [0, 7, 30, 59]) {
        for (const digit of timeDigits(new Date(2026, 0, 1, hours, minutes))) {
          assert.ok(DIGIT_GLYPHS[digit], `${hours}:${minutes} -> ${digit}`);
        }
      }
    }
  });
});
