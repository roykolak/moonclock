import { test, expect } from "@playwright/test";
import { unlinkSync } from "fs";

test.describe("Test", () => {
  test.beforeEach(() => {
    try {
      unlinkSync("./database-test.json");
      unlinkSync("./custom_scenes/automated-test-scene-123.json");
    } catch {}
  });

  test("create, edit, and delete a 'for mode' preset", async ({ page }) => {
    await page.goto("http://localhost:3000");

    // Create Preset

    await page.getByTestId("preset-dropdown").click();
    await page.getByRole("menuitem", { name: "Create new preset" }).click();

    await expect(page.getByText("Create New Preset")).toBeVisible();

    await page.getByTestId("preset-name").fill("Custom preset");

    await page.getByTestId("change-expiration").click();

    const forTimeSelect = page.getByTestId("for-time-select");
    await expect(forTimeSelect).toBeVisible();

    await page.waitForTimeout(350);

    await page.getByTestId("for-time-select").click();

    await page.getByRole("option", { name: "30 minutes", exact: true }).click();

    await page.getByRole("button", { name: "Create Preset" }).click();

    // New preset appears as a launch button on the idle panel
    await expect(
      page.getByRole("button", { name: "Custom preset" }),
    ).toBeVisible();

    // Edit Preset via the dropdown's edit button

    await page.getByTestId("preset-dropdown").click();
    await page.getByRole("button", { name: "Edit Custom preset" }).click();

    await expect(page.getByText("Edit Preset")).toBeVisible();

    await page.getByTestId("preset-name").fill("Updated custom preset");

    await page.getByTestId("change-expiration").click();

    await expect(forTimeSelect).toBeVisible();

    await page.waitForTimeout(350);

    await page.getByTestId("for-time-select").click();

    await page.getByRole("option", { name: "1 hour 30 minutes" }).click();

    await page.getByTestId("scene-option-bunny").click();

    await page.getByRole("button", { name: "Update Preset" }).click();

    await expect(
      page.getByRole("button", { name: "Updated custom preset" }),
    ).toBeVisible();

    // Delete Preset via the dropdown's edit button

    await page.getByTestId("preset-dropdown").click();
    await page
      .getByRole("button", { name: "Edit Updated custom preset" })
      .click();

    await page.getByRole("button", { name: "Delete Preset" }).click();

    await expect(
      page.getByRole("button", { name: "Updated custom preset" }),
    ).toHaveCount(0);
  });

  test("presets appear as launch buttons on the panel", async ({ page }) => {
    await page.goto("http://localhost:3000");

    await expect(page.getByRole("button", { name: "Moon" })).toHaveCount(1);
    await expect(page.getByRole("button", { name: "Bunny" })).toHaveCount(1);
  });
});
