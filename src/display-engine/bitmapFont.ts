import { $Font } from "bdfparser";
import fetchline from "fetchline";
import { Pixel } from "./types";

export interface BitmapChar {
  char: string;
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
  bitmap: boolean[][];
}

export interface BitmapFont {
  name: string;
  size: number;
  chars: Map<string, BitmapChar>;
  lineHeight: number;
  baseline: number;
}

export class BitmapFontLoader {
  private static fontCache = new Map<string, BitmapFont>();

  static async loadFont(fontIdentifier: string): Promise<BitmapFont> {
    if (this.fontCache.has(fontIdentifier)) {
      return this.fontCache.get(fontIdentifier)!;
    }

    try {
      let fontUrl: string;

      // Determine font URL based on environment
      if (typeof window === "undefined") {
        // Node.js environment - use file:// URL
        const { join } = await import("path");
        const fontPath = join(process.cwd(), "fonts", `${fontIdentifier}.bdf`);
        fontUrl = `file://${fontPath}`;
      } else {
        // Browser environment - use HTTP URL
        fontUrl = `/fonts/${fontIdentifier}.bdf`;
      }

      // Use fetchline to get font data
      const fontData = await fetchline(fontUrl);

      // Parse font using bdfparser
      const font = await $Font(fontData);

      console.log(font);

      const bitmapFont: BitmapFont = {
        name: font.props.family_name || "Unknown",
        size: 6, //font.props.pixel_size || 8,
        chars: new Map(),
        lineHeight: 6, // font.props.PIXEL_SIZE || 8,
        baseline: 5, //font.props.FONT_ASCENT || 6,
      };

      console.log(font.glyph("a"));
      // Convert parsed characters to our format
      for (const glyph of font.glyphs as unknown as any[]) {
        const char = String.fromCharCode(glyph.code);
        const bitmap: boolean[][] = [];

        // Convert bitmap to boolean 2D array
        const glyphBitmap = glyph.bitmap;
        if (glyphBitmap && glyphBitmap.length > 0) {
          for (let y = 0; y < glyph.bbh; y++) {
            const row: boolean[] = [];
            for (let x = 0; x < glyph.bbw; x++) {
              row.push(glyphBitmap[y * glyph.bbw + x] === 1);
            }
            bitmap.push(row);
          }
        }

        const bitmapChar: BitmapChar = {
          char,
          width: glyph.bbw,
          height: glyph.bbh,
          offsetX: glyph.bbx,
          offsetY: glyph.bby,
          bitmap,
        };

        bitmapFont.chars.set(char, bitmapChar);
      }

      this.fontCache.set(fontIdentifier, bitmapFont);
      return bitmapFont;
    } catch (error) {
      console.error(`Failed to load font ${fontIdentifier}:`, error);
      throw error;
    }
  }
}

export function renderTextToPixels(
  text: string,
  font: BitmapFont,
  options: {
    color: string;
    startX: number;
    startY: number;
    spaceBetweenLetters?: number;
    spaceBetweenLines?: number;
    width?: number;
    alignment?: "left" | "center" | "right";
  }
): Pixel[] {
  const pixels: Pixel[] = [];
  const {
    color,
    startX,
    startY,
    spaceBetweenLetters = 1,
    spaceBetweenLines = 1,
    width,
    alignment = "left",
  } = options;

  // Parse color to RGBA
  const rgba = hexToRgba(color);

  const lines = text.split("\n");
  let currentY = startY;

  for (const line of lines) {
    let currentX = startX;

    // Calculate line width for alignment
    if (alignment !== "left" && width) {
      const lineWidth = calculateLineWidth(line, font, spaceBetweenLetters);
      if (alignment === "center") {
        currentX = startX + Math.floor((width - lineWidth) / 2);
      } else if (alignment === "right") {
        currentX = startX + (width - lineWidth);
      }
    }

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const bitmapChar = font.chars.get(char);

      if (!bitmapChar) {
        // Skip unknown characters, but advance cursor
        currentX += font.size / 2;
        continue;
      }

      // Render character bitmap
      for (let y = 0; y < bitmapChar.bitmap.length; y++) {
        for (let x = 0; x < bitmapChar.bitmap[y].length; x++) {
          if (bitmapChar.bitmap[y][x]) {
            const pixelX = currentX + x + bitmapChar.offsetX;
            const pixelY =
              currentY +
              y +
              (font.baseline - bitmapChar.offsetY - bitmapChar.height);

            pixels.push({
              x: pixelX,
              y: pixelY,
              rgba: new Uint8ClampedArray(rgba),
            });
          }
        }
      }

      // Advance cursor
      currentX += bitmapChar.width + spaceBetweenLetters;
    }

    // Move to next line
    currentY += font.lineHeight + spaceBetweenLines;
  }

  return pixels;
}

function calculateLineWidth(
  line: string,
  font: BitmapFont,
  spaceBetweenLetters: number
): number {
  let width = 0;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const bitmapChar = font.chars.get(char);
    width += (bitmapChar?.width || font.size / 2) + spaceBetweenLetters;
  }
  return Math.max(0, width - spaceBetweenLetters); // Remove trailing space
}

function hexToRgba(hex: string): [number, number, number, number] {
  // Remove # if present
  hex = hex.replace("#", "");

  // Convert 3-digit hex to 6-digit
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return [r, g, b, 255];
}
