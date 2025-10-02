import { checkmark } from "../emojis/checkmark";
import { flame } from "../emojis/flame";
import { smile } from "../emojis/smile";
import { tada } from "../emojis/tada";
import { thumbsdown } from "../emojis/thumbsdown";
import { thumbsup } from "../emojis/thumbsup";
import { x } from "../emojis/x";
import { MacroFn } from "../types";
import { startCoordinates } from "./coordinates";
import { startText } from "./text";

export const startEmoji: MacroFn = async ({
  macroConfig,
  dimensions,
  fonts,
  index,
  updatePixels,
}) => {
  const coordinates = getEmojiCoordinates(macroConfig.name);

  if (!coordinates) {
    startText({
      dimensions,
      index,
      fonts,
      updatePixels,
      macroConfig: {
        text: "?",
        startingColumn: 11,
        startingRow: 8,
        fontSize: 20,
        color: "#888",
      },
    });
  } else {
    startCoordinates({
      dimensions,
      fonts,
      index,
      updatePixels,
      macroConfig: {
        coordinates,
      },
    });
  }

  return async () => {};
};

function getEmojiCoordinates(name?: string) {
  if (name === "smile") {
    return smile;
  } else if (name === "checkmark") {
    return checkmark;
  } else if (name === "thumbsup") {
    return thumbsup;
  } else if (name === "thumbsdown") {
    return thumbsdown;
  } else if (name === "flame") {
    return flame;
  } else if (name === "x") {
    return x;
  } else if (name === "tada") {
    return tada;
  }

  return null;
}
