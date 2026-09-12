import { unlinkSync, writeFileSync } from "fs";
import { defaultData } from "../../src/server/db";
import { DataTypes, Panel, Setup } from "../../src/types";

const DATABASE_FILE = "./database-test.json";

export const TEST_PANEL_NAME = "My Moonclock";

const COMPLETED_SETUP: Setup = {
  completedAt: "2025-01-01T00:00:00.000Z",
  testPatternUntil: null,
};

interface SeedOverrides extends Partial<Omit<DataTypes, "panel" | "setup">> {
  panel?: Partial<Panel>;
  setup?: Partial<Setup>;
}

export function seedDatabase({
  panel,
  setup,
  ...overrides
}: SeedOverrides = {}) {
  clearDatabase();

  writeFileSync(
    DATABASE_FILE,
    JSON.stringify({
      ...defaultData,
      ...overrides,
      panel: { ...defaultData.panel, name: TEST_PANEL_NAME, ...panel },
      setup: { ...COMPLETED_SETUP, ...setup },
    }),
  );
}

export function clearDatabase() {
  try {
    unlinkSync(DATABASE_FILE);
  } catch {}
}
