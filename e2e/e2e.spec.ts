import { test, expect } from "@playwright/test";
import { unlinkSync } from "fs";

test.describe("Test", () => {
  test.afterEach(() => {
    try {
      unlinkSync("./database-test.json");
    } catch {}
  });

  test("loads default database presets", async ({ page }) => {
    await page.goto("http://localhost:3000");

    await expect(
      page.getByRole("button", { name: "Sleep Mode" })
    ).toBeVisible();

    await expect(page.getByRole("button", { name: "Nap Mode" })).toBeVisible();
  });

  test("activating a preset, adjusting the end time, and clearing it", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000");

    await page.getByRole("button", { name: "Sleep Mode" }).click();

    const endTime = page.getByTestId("end-time");

    await expect(page.getByText("Showing moon until...")).toBeVisible();
    await expect(endTime).toHaveText("7:00 AM");

    await page.getByRole("button", { name: "+5 min" }).click();
    await expect(endTime).toHaveText("7:05 AM");

    await page.getByRole("button", { name: "+5 min" }).click();
    await expect(endTime).toHaveText("7:10 AM");

    await page.getByRole("button", { name: "-5 min" }).click();
    await expect(endTime).toHaveText("7:05 AM");

    await page.getByRole("button", { name: "Clear" }).click();

    await expect(
      page.getByRole("button", { name: "Sleep Mode" })
    ).toBeVisible();
  });

  test("activating a custom preset and clearing it", async ({ page }) => {
    await page.goto("http://localhost:3000");

    await page.getByRole("button", { name: "Custom" }).click();

    await expect(page.getByText("Custom Preset")).toBeVisible();

    await page.getByRole("button", { name: "Save" }).click();

    await page.getByTestId("preset-form").waitFor({ state: "detached" });

    await expect(page.getByText("Showing bunny until...")).toBeVisible();
    await expect(page.getByText("forever")).toBeVisible();

    await page.getByRole("button", { name: "Clear" }).click();

    await expect(
      page.getByRole("button", { name: "Sleep Mode" })
    ).toBeVisible();
  });

  test("create, edit, and delete a 'for mode' preset", async ({ page }) => {
    await page.goto("http://localhost:3000");

    await page.getByRole("link", { name: "Presets" }).click();

    await expect(page.getByTestId("preset-item")).toHaveCount(2);

    // Create Preset

    await page.getByRole("button", { name: "New Preset" }).click();

    await page.getByTestId("preset-name").fill("Custom preset");

    await page.getByTestId("scene-select").click();
    await page.getByRole("option", { name: "moon" }).click();

    await page.getByTestId("for-time-select").click();
    await page.getByRole("option", { name: "30 minutes", exact: true }).click();

    await page.getByRole("button", { name: "Save" }).click();

    await page.getByTestId("preset-form").waitFor({ state: "detached" });

    const newPreset = page.getByTestId("preset-item").nth(2);

    await expect(newPreset).toBeVisible();

    await expect(newPreset.getByText("Custom preset")).toBeVisible();
    await expect(newPreset.getByText("For 30 minutes")).toBeVisible();
    await expect(newPreset.getByAltText("moon scene")).toBeVisible();

    // Edit Preset

    await newPreset.getByRole("button", { name: "Edit" }).click();

    await page.getByTestId("preset-name").fill("Updated custom preset");

    await page.getByTestId("for-time-select").click();
    await page.getByRole("option", { name: "1 hour 30 minutes" }).click();

    await page.getByTestId("scene-select").click();
    await page.getByRole("option", { name: "bunny" }).click();

    await page.getByRole("button", { name: "Save" }).click();

    await page.getByTestId("preset-form").waitFor({ state: "detached" });

    await expect(newPreset.getByText("Updated custom preset")).toBeVisible();
    await expect(newPreset.getByText("For 1 hours & 30 mins")).toBeVisible();
    await expect(newPreset.getByAltText("bunny scene")).toBeVisible();

    // Delete Preset

    await newPreset.getByRole("button", { name: "Edit" }).click();

    await page.getByTitle("Delete preset").click();

    await page.getByTestId("preset-form").waitFor({ state: "detached" });

    await expect(page.getByTestId("preset-item")).toHaveCount(2);
  });
});
