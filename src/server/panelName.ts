import { randomInt } from "crypto";

const ADJECTIVES = [
  "Amber",
  "Ashen",
  "Cobalt",
  "Copper",
  "Dim",
  "Distant",
  "Drowsy",
  "Dusky",
  "Faint",
  "Frosted",
  "Gentle",
  "Glassy",
  "Golden",
  "Hazy",
  "Hushed",
  "Lilac",
  "Low",
  "Mellow",
  "Midnight",
  "Misty",
  "Muted",
  "Pale",
  "Quiet",
  "Rosy",
  "Silent",
  "Silver",
  "Sleepy",
  "Slow",
  "Soft",
  "Still",
  "Velvet",
  "Wandering",
];

const NOUNS = [
  "Basin",
  "Beacon",
  "Beam",
  "Cove",
  "Crater",
  "Crescent",
  "Dune",
  "Eclipse",
  "Ember",
  "Field",
  "Glow",
  "Grove",
  "Halo",
  "Harbor",
  "Highland",
  "Lagoon",
  "Lantern",
  "Marsh",
  "Meadow",
  "Moth",
  "Orbit",
  "Owl",
  "Peak",
  "Ridge",
  "Sea",
  "Shadow",
  "Shore",
  "Tide",
  "Twilight",
  "Valley",
  "Wake",
  "Willow",
];

export function randomPanelName() {
  const adjective = ADJECTIVES[randomInt(ADJECTIVES.length)];
  const noun = NOUNS[randomInt(NOUNS.length)];

  return `${adjective} ${noun}`;
}

export const panelNameVocabulary = { adjectives: ADJECTIVES, nouns: NOUNS };
