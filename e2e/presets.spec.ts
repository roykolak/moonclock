import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";
import { clearDatabase } from "./support/seedDatabase";

test.describe("Test", () => {
  test.beforeEach(() => {
    clearDatabase();
  });

  test("create, edit, and delete a 'for mode' preset", async ({ page }) => {
    await page.goto("http://localhost:3000");

    // Create Preset

    await page.getByTestId("preset-dropdown").click();
    await page.getByRole("menuitem", { name: "Create new preset" }).click();

    await expect(
      page.getByRole("heading", { name: "Create New Preset" }),
    ).toBeVisible();

    await page.getByTestId("preset-name").fill("Custom preset");

    await page.getByTestId("change-expiration").click();

    const forTimeSelect = page.getByTestId("for-time-select");
    await expect(forTimeSelect).toBeVisible();

    await page.waitForTimeout(350);

    await page.getByTestId("for-time-select").click();

    await page.getByRole("option", { name: "30 minutes", exact: true }).click();

    await page.getByRole("button", { name: "Create Preset" }).click();

    // New preset appears in the dropdown menu
    await page.getByTestId("preset-dropdown").click();
    await expect(
      page.getByRole("menuitem", { name: "Custom preset" }),
    ).toBeVisible();

    // Edit Preset via the dropdown's edit button

    await page.getByRole("button", { name: "Edit Custom preset" }).click();

    await expect(
      page.getByRole("heading", { name: "Edit Preset" }),
    ).toBeVisible();

    await page.getByTestId("preset-name").fill("Updated custom preset");

    await page.getByTestId("change-expiration").click();

    await expect(forTimeSelect).toBeVisible();

    await page.waitForTimeout(350);

    await page.getByTestId("for-time-select").click();

    await page.getByRole("option", { name: "1 hour 30 minutes" }).click();

    await page.getByTestId("scene-option-cat").click();

    await page.getByRole("button", { name: "Update Preset" }).click();

    // Updated name appears in the dropdown menu
    await page.getByTestId("preset-dropdown").click();
    await expect(
      page.getByRole("menuitem", { name: "Updated custom preset" }),
    ).toBeVisible();

    // Delete Preset via the dropdown's edit button

    await page
      .getByRole("button", { name: "Edit Updated custom preset" })
      .click();

    await page.getByRole("button", { name: "Delete Preset" }).click();

    // Preset is gone from the dropdown menu
    await page.getByTestId("preset-dropdown").click();
    await expect(
      page.getByRole("menuitem", { name: "Updated custom preset" }),
    ).toHaveCount(0);
  });

  test("renaming the active preset renames it in the dropdown", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000");

    await page.getByTestId("preset-dropdown").click();
    await page.getByRole("menuitem", { name: "Moon" }).click();
    await expect(page.getByTestId("preset-dropdown")).toContainText("Moon");

    await page.getByTestId("preset-dropdown").click();
    await page.getByRole("button", { name: "Edit Moon" }).click();
    await page.getByTestId("preset-name").fill("Moonrise");
    await page.getByRole("button", { name: "Update Preset" }).click();

    await expect(page.getByTestId("preset-dropdown")).toContainText("Moonrise");

    const { scheduledPreset } = JSON.parse(
      readFileSync("./database-test.json", "utf8"),
    );
    expect(scheduledPreset.preset.name).toBe("Moonrise");
  });

  test("presets appear in the dropdown menu", async ({ page }) => {
    await page.goto("http://localhost:3000");

    await page.getByTestId("preset-dropdown").click();

    await expect(page.getByRole("menuitem", { name: "Moon" })).toHaveCount(1);
    await expect(page.getByRole("menuitem", { name: "Cat" })).toHaveCount(1);
  });
});
