import { useEffect, useRef, useState } from "react";
import { createDisplayEngine, Dimensions, Scene } from "../display-engine";

const dimensions = { height: 32, width: 32 };

async function createCanvas(dimensions: Dimensions) {
  const { width, height } = dimensions;

  const tiny5Font = new FontFace("Tiny5", "url(/fonts/Tiny5-Regular.ttf)");
  const loadedTiny5Font = await tiny5Font.load();

  document.fonts.add(loadedTiny5Font);

  await document.fonts.ready;

  const canvas = document.createElement("canvas");

  canvas.width = width;
  canvas.height = height;

  return canvas;
}

/** Runs `scene` through the display engine on an offscreen canvas and
 *  returns the rendered frame as a data URL, re-rendering whenever
 *  `sceneKey` changes. Used by PresetPreview to run scene definitions (with
 *  animation, fonts, etc.) through the display engine on an offscreen canvas.
 *
 *  `sceneKey` identifies what's being requested, not a serialization of
 *  `scene` itself — a Scene's `draw`/`init` are functions, which
 *  JSON.stringify silently drops. */
export function useScenePreview(
  scene: Scene | null,
  sceneKey: string,
  { staticFrame = false }: { staticFrame?: boolean } = {},
): string | null {
  const [imageData, setImageData] = useState<string | null>(null);

  const [engine, setEngine] = useState<any>();
  const engineRef = useRef<any>(null);
  const hasRenderedFirstFrame = useRef(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const canvas = await createCanvas(dimensions);
      const ctx = canvas.getContext("2d");

      const displayEngine = createDisplayEngine({
        dimensions,
        createCanvas,
        onPixelsChange: (pixels) => {
          requestAnimationFrame(() => {
            for (const pixel of pixels) {
              if (!pixel.rgba) return;

              const id = ctx?.createImageData(1, 1);

              if (!id) continue;

              const d = id.data;

              d[0] = pixel.rgba[0];
              d[1] = pixel.rgba[1];
              d[2] = pixel.rgba[2];
              d[3] = pixel.rgba[3];

              ctx?.putImageData(id, pixel.x, pixel.y);
            }

            const dataURL = canvas.toDataURL("png");
            setImageData(dataURL);

            if (staticFrame && !hasRenderedFirstFrame.current) {
              hasRenderedFirstFrame.current = true;
              displayEngine.stop();
            }
          });
        },
      });

      // The component may have unmounted while the engine was being created
      // asynchronously; stop it immediately so it never starts running.
      if (cancelled) {
        displayEngine.stop();
        return;
      }

      engineRef.current = displayEngine;
      setEngine(displayEngine);
    })();

    return () => {
      cancelled = true;
      engineRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    if (!engine) return;
    hasRenderedFirstFrame.current = false;
    engine.render(scene);
  }, [engine, sceneKey]);

  return imageData;
}
