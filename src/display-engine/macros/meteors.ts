import { syncFromCanvas } from "../canvas";
import { MacroFn } from "../types";
import { colorToRgba } from "./ripple";

interface Meteor {
  tailLength: number;
  speed: number;
  depth: number;
  moveCount: number;
  complete: boolean;
  startingX: number;
  path: { x: number; y: number }[];
}

export const startMeteors: MacroFn = async ({
  macroConfig,
  dimensions,
  index,
  ctx,
  updatePixels,
}) => {
  const config = {
    color: "#FFFFFF",
    meteorCount: 40,
    maxTailLength: 20,
    minTailLength: 5,
    maxDepth: 10,
    minSpeed: 100,
    maxSpeed: 10,
    width: dimensions.width,
    height: dimensions.height,
    ...macroConfig,
  };

  const rgba = colorToRgba(config.color);

  const meteors: Meteor[] = [];
  const validStartingPoints: number[] = [];

  for (let i = 0; i < config.width + config.height; i++) {
    validStartingPoints.push(i);
  }

  const generateMeteor = (): Meteor => {
    const tailLength =
      Math.floor(
        Math.random() * (config.maxTailLength - config.minTailLength)
      ) + config.minTailLength;

    const depth = Math.floor(Math.random() * config.maxDepth) + 1;

    const startingX =
      validStartingPoints[
        Math.floor(Math.random() * validStartingPoints.length)
      ];

    return {
      tailLength: tailLength,
      speed:
        Math.floor(Math.random() * (config.minSpeed - config.maxSpeed)) +
        config.maxSpeed,
      depth,
      moveCount: 0,
      complete: false,
      startingX: startingX,
      path: [
        {
          x: startingX,
          y: 0,
        },
      ],
    };
  };

  const seedMeteor = () => {
    const meteor = generateMeteor();
    meteors.push(meteor);
    const index = validStartingPoints.indexOf(meteor.path[0].x);
    validStartingPoints.splice(index, 1);
  };

  for (let i = 0; i < config.meteorCount; i++) {
    seedMeteor();
  }

  const interval = setInterval(() => {
    const filteredMeteors = meteors.filter(function (meteor) {
      return meteor.complete == false;
    });

    for (let i = filteredMeteors.length; i < config.meteorCount; i++) {
      seedMeteor();
    }

    meteors.forEach((meteor, i) => {
      meteors[i].moveCount += 10;

      if (meteors[i].moveCount > meteor.speed) {
        meteors[i].moveCount = 0;

        if (config.height + meteor.tailLength > meteor.path[0].y) {
          meteors[i].path.unshift({
            x: meteor.path[0].x - 1,
            y: meteor.path[0].y + 1,
          });
          if (meteors[i].path.length > meteor.tailLength) {
            meteors[i].path.pop();
          }
        } else {
          meteors[i].complete = true;
          validStartingPoints.push(meteor.startingX);
        }

        const meteorDepthAlphaPercentage = meteor.depth / config.maxDepth;

        meteor.path.forEach((dot, i) => {
          const meteorDotAlphaPercentage =
            (meteor.tailLength - i) / meteor.tailLength;
          const id = ctx.createImageData(1, 1);
          const d = id.data;
          d[0] = rgba?.r as number;
          d[1] = rgba?.g as number;
          d[2] = rgba?.b as number;
          d[3] =
            meteorDotAlphaPercentage *
            meteorDepthAlphaPercentage *
            (rgba?.a as number);
          ctx.putImageData(id, dot.x, dot.y);
        });
      }
    });

    const pixels = syncFromCanvas(ctx, dimensions);
    updatePixels(pixels, index);
  }, 10);

  return Promise.resolve(() => clearInterval(interval));
};
