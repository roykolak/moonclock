import { unlinkSync, writeFileSync } from "fs";
import { defaultData } from "../../src/server/db";
import { DataTypes, Panel } from "../../src/types";

const DATABASE_FILE = "./database-test.json";

export const TEST_PANEL_NAME = "My Moonclock";

interface SeedOverrides extends Partial<Omit<DataTypes, "panel">> {
  panel?: Partial<Panel>;
}

export function seedDatabase({ panel, ...overrides }: SeedOverrides = {}) {
  clearDatabase();

  writeFileSync(
    DATABASE_FILE,
    JSON.stringify({
      ...defaultData,
      ...overrides,
      panel: { ...defaultData.panel, name: TEST_PANEL_NAME, ...panel },
    }),
  );
}

export function clearDatabase() {
  for (const file of [
    DATABASE_FILE,
    "./custom_scenes/automated-test-scene-123.json",
  ]) {
    try {
      unlinkSync(file);
    } catch {}
  }
}
