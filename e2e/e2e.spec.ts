import { test, expect } from "@playwright/test";
import { unlinkSync } from "fs";

test.describe("Test", () => {
  test.beforeEach(() => {
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

    await expect(page.getByText("Sleep Mode until...")).toBeVisible();
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

    await page.getByTestId("for-time-select").click();
    await page.getByRole("option", { name: "Forever", exact: true }).click();

    await page.getByRole("button", { name: "Save" }).click();

    await page.getByTestId("preset-form").waitFor({ state: "detached" });

    await expect(page.getByText("Custom until...")).toBeVisible();
    await expect(page.getByText("forever")).toBeVisible();

    await page.getByRole("button", { name: "Clear" }).click();

    await expect(
      page.getByRole("button", { name: "Sleep Mode" })
    ).toBeVisible();
  });

  test("create, edit, and delete a 'for mode' preset", async ({ page }) => {
    await page.goto("http://localhost:3000");

    await page.getByRole("link", { name: "Presets" }).click();

    await expect(page.getByTestId("preset-item")).toHaveCount(3);

    // Create Preset

    await page.getByRole("button", { name: "New Preset" }).click();

    await page.getByTestId("preset-name").fill("Custom preset");

    await page.getByTestId("for-time-select").click();
    await page.getByRole("option", { name: "30 minutes", exact: true }).click();

    await page.getByRole("button", { name: "Save" }).click();

    await page.getByTestId("preset-form").waitFor({ state: "detached" });

    const newPreset = page.getByTestId("preset-item").nth(3);

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

    await expect(page.getByTestId("preset-item")).toHaveCount(3);
  });

  test("updating settings", async ({ page }) => {
    await page.goto("http://localhost:3000");

    await expect(page.getByText("My Moonclock")).toBeVisible();

    await page.getByRole("link", { name: "Settings" }).click();

    await page.getByTestId("panel-name").fill("New Moonclock");

    await page.getByRole("button", { name: "Save" }).click();

    await page.goto("http://localhost:3000/panel");

    await expect(page.getByText("New Moonclock")).toBeVisible();
  });

  test.skip("creating, editting, and saving a new scene", async ({ page }) => {
    await page.goto("http://localhost:3000");

    await page.getByRole("link", { name: "Composer" }).click();

    await page.getByTestId("edit-scene-select").click();
    await page.getByRole("option", { name: "New scene" }).click();

    await page.getByTestId("new-scene-name").fill("cool-scene");

    await page.getByRole("button", { name: "Create" }).click();

    await page.getByTestId("color-0").click();
    await page.getByTestId("dot_0_1").click();
    await page.getByTestId("color-1").click();
    await page.getByTestId("dot_1_10").click();

    await page.getByRole("button", { name: "Save Scene" }).click();

    await wait(1000);

    const coordinates = JSON.parse(
      readFileSync(`./scenes/cool-scene.json`).toString()
    );

    expect(Object.keys(coordinates)).toEqual(["0:1", "1:10"]);
    expect(Object.values(coordinates)).toEqual(["#89CFF0", "#facc0d"]);
  });
});
