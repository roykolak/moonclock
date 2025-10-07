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

    await page.getByRole("link", { name: "Presets" }).click();

    await expect(page.getByTestId("preset-item")).toHaveCount(2);

    // Create Preset

    await page.getByRole("button", { name: "New Preset" }).click();

    await expect(page.getByText("Create New Preset")).toBeVisible();

    await page.getByTestId("preset-name").fill("Custom preset");

    await page.getByTestId("new-scene-button").click();

    await page.getByTestId("change-expiration").click();

    await page.getByTestId("for-time-select").click();
    await page.getByRole("option", { name: "30 minutes", exact: true }).click();

    await page.getByRole("button", { name: "Create Preset" }).click();

    const newPreset = page.getByTestId("preset-item").nth(2);

    await expect(newPreset).toBeVisible();

    await expect(newPreset.getByText("Custom preset")).toBeVisible();
    await expect(newPreset.getByText("For 30 minutes")).toBeVisible();
    await expect(newPreset.getByAltText("moon scene")).toBeVisible();

    // Edit Preset

    await newPreset.getByRole("button", { name: "Edit" }).click();

    await expect(page.getByText("Edit Preset")).toBeVisible();

    await page.getByTestId("preset-name").fill("Updated custom preset");

    await page.getByTestId("change-expiration").click();

    await page.getByTestId("for-time-select").click();
    await page.getByRole("option", { name: "1 hour 30 minutes" }).click();

    await page.getByTestId("scene-0-select").click();
    await page.getByRole("option", { name: "bunny" }).click();

    await page.getByRole("button", { name: "Update Preset" }).click();

    await expect(newPreset.getByText("Updated custom preset")).toBeVisible();
    await expect(newPreset.getByText("For 1 hours & 30 mins")).toBeVisible();
    await expect(newPreset.getByAltText("bunny scene")).toBeVisible();

    // Delete Preset

    await newPreset.getByRole("button", { name: "Edit" }).click();

    await page.getByRole("button", { name: "Delete preset" }).click();

    await expect(page.getByTestId("preset-item")).toHaveCount(2);
  });

  test("creating a new, multiple scene, preset", async ({ page }) => {
    await page.goto("http://localhost:3000");

    await page.getByRole("link", { name: "Presets" }).click();

    await page.getByRole("button", { name: "New Preset" }).click();

    await expect(page.getByText("Create New Preset")).toBeVisible();

    await page.getByTestId("preset-name").fill("multi-scene preset");

    await page.getByTestId("new-scene-button").click();

    await page.getByTestId("new-scene-button").click();

    await page.getByTestId("scene-1-select").click();
    await page.getByRole("option", { name: "marquee" }).click();

    await page.getByRole("button", { name: "Create Preset" }).click();

    const newPreset = page.getByTestId("preset-item").nth(2);

    await expect(newPreset).toBeVisible();

    await expect(newPreset.getByAltText("moon, marquee scene")).toBeVisible();
  });
});
