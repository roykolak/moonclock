import { describe, it } from "node:test";
import assert from "node:assert";
import { setupScene } from "./setup";

const dimensions = { width: 32, height: 32 };

const BACKGROUND = "#000000";
const WHITE = "#FFFFFF";
const BLUE = "#3B82F6";
const RED = "#EF4444";
const YELLOW = "#FACC15";

type Painted = {
  byColor: Map<string, Set<string>>;
  visible: Map<string, string>;
};

function paint(): Painted {
  const byColor = new Map<string, Set<string>>();
  const visible = new Map<string, string>();

  const ctx = {
    fillStyle: "",
    fillRect(x: number, y: number, width: number, height: number) {
      const color = (ctx as { fillStyle: string }).fillStyle;
      for (let row = y; row < y + height; row++) {
        for (let column = x; column < x + width; column++) {
          const key = `${column}:${row}`;
          if (!byColor.has(color)) byColor.set(color, new Set());
          byColor.get(color)!.add(key);
          visible.set(key, color);
        }
      }
    },
  };

  setupScene.draw({
    ctx: ctx as unknown as CanvasRenderingContext2D,
    dimensions,
    elapsed: 0,
    state: undefined,
  });

  return { byColor, visible };
}

function pixels({ byColor }: Painted, color: string) {
  return [...(byColor.get(color) ?? [])].map((key) => {
    const [x, y] = key.split(":").map(Number);
    return { x, y };
  });
}

function extent(points: { x: number; y: number }[]) {
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  };
}

describe("createSetupScene", () => {
  const painted = paint();
  const dots = pixels(painted, WHITE);
  const circle = pixels(painted, BLUE);
  const outerCircle = pixels(painted, RED);
  const cross = pixels(painted, YELLOW);

  it("keeps four pixels of padding around everything it draws", () => {
    for (const { x, y } of [...dots, ...circle, ...outerCircle, ...cross]) {
      assert.ok(x >= 4 && x <= 27, `x=${x} escapes the padding`);
      assert.ok(y >= 4 && y <= 27, `y=${y} escapes the padding`);
    }
  });

  it("fills the whole panel black behind the pattern", () => {
    assert.equal(painted.byColor.get(BACKGROUND)?.size, 32 * 32);
  });

  it("puts one white dot in each corner of the padded box", () => {
    assert.deepEqual(
      dots.map(({ x, y }) => `${x}:${y}`).sort(),
      ["27:27", "27:4", "4:27", "4:4"].sort(),
    );
  });

  it("draws a blue circle ten pixels across", () => {
    const { minX, maxX, minY, maxY } = extent(circle);
    assert.equal(maxX - minX + 1, 10);
    assert.equal(maxY - minY + 1, 10);
  });

  it("keeps the circle a single pixel thick", () => {
    const lit = new Set(circle.map(({ x, y }) => `${x}:${y}`));
    for (const { x, y } of circle) {
      const block = [
        `${x}:${y}`,
        `${x + 1}:${y}`,
        `${x}:${y + 1}`,
        `${x + 1}:${y + 1}`,
      ];
      assert.ok(
        !block.every((key) => lit.has(key)),
        `solid 2x2 block at ${x}:${y}`,
      );
    }
  });

  it("wraps the blue circle in a red one", () => {
    const outer = extent(outerCircle);
    const inner = extent(circle);
    assert.equal(outer.maxX - outer.minX + 1, 14);
    assert.ok(outer.minX < inner.minX && outer.maxX > inner.maxX);
    assert.ok(outer.minY < inner.minY && outer.maxY > inner.maxY);
  });

  it("leaves one dark pixel between the two circles", () => {
    const columnsAt = (points: { x: number; y: number }[], row: number) =>
      points
        .filter((point) => point.y === row)
        .map((point) => point.x)
        .sort((a, b) => a - b);
    const rowsAt = (points: { x: number; y: number }[], column: number) =>
      points
        .filter((point) => point.x === column)
        .map((point) => point.y)
        .sort((a, b) => a - b);

    const [redLeft, redRight] = columnsAt(outerCircle, 16);
    const [blueLeft, blueRight] = columnsAt(circle, 16);
    assert.equal(blueLeft - redLeft - 1, 1, "gap left of centre");
    assert.equal(redRight - blueRight - 1, 1, "gap right of centre");

    const [redTop, redBottom] = rowsAt(outerCircle, 16);
    const [blueTop, blueBottom] = rowsAt(circle, 16);
    assert.equal(blueTop - redTop - 1, 1, "gap above centre");
    assert.equal(redBottom - blueBottom - 1, 1, "gap below centre");
  });

  it("never lets the two circles share an edge", () => {
    const inner = new Set(circle.map(({ x, y }) => `${x}:${y}`));
    for (const { x, y } of outerCircle) {
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        assert.ok(
          !inner.has(`${x + dx}:${y + dy}`),
          `red ${x}:${y} runs into the blue circle`,
        );
      }
    }
  });

  it("keeps the red circle a single pixel thick", () => {
    const lit = new Set(outerCircle.map(({ x, y }) => `${x}:${y}`));
    for (const { x, y } of outerCircle) {
      const block = [
        `${x}:${y}`,
        `${x + 1}:${y}`,
        `${x}:${y + 1}`,
        `${x + 1}:${y + 1}`,
      ];
      assert.ok(
        !block.every((key) => lit.has(key)),
        `solid 2x2 block at ${x}:${y}`,
      );
    }
  });

  it("draws a yellow X that reaches past the circle", () => {
    const cross_ = extent(cross);
    const circle_ = extent(circle);
    assert.ok(cross_.minX < circle_.minX && cross_.maxX > circle_.maxX);
    assert.ok(cross_.minY < circle_.minY && cross_.maxY > circle_.maxY);
  });

  it("keeps the X to two one-pixel diagonals", () => {
    for (const { x, y } of cross) {
      assert.ok(x === y || x + y === 31, `${x}:${y} is off both diagonals`);
    }
    assert.equal(cross.length, 32);
  });

  it("lays the X over the circle where they cross", () => {
    const crossings = cross.filter(({ x, y }) =>
      circle.some((point) => point.x === x && point.y === y),
    );
    assert.equal(crossings.length, 4);
    for (const { x, y } of crossings) {
      assert.equal(painted.visible.get(`${x}:${y}`), YELLOW);
    }
  });
});
