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

    // Create Preset

    await page.getByRole("button", { name: "New Preset" }).click();

    await expect(page.getByText("Create New Preset")).toBeVisible();

    await page.getByTestId("preset-name").fill("Custom preset");

    await page.getByTestId("new-scene-button").click();

    await page.getByTestId("change-expiration").click();

    const forTimeSelect = page.getByTestId("for-time-select");
    await expect(forTimeSelect).toBeVisible();

    await page.waitForTimeout(350);

    await page.getByTestId("for-time-select").click();

    await page.getByRole("option", { name: "30 minutes", exact: true }).click();

    await page.getByRole("button", { name: "Create Preset" }).click();

    const newPreset = page.getByTestId("preset-item").last();

    await expect(newPreset).toBeVisible();

    await expect(newPreset.getByText("Custom preset")).toBeVisible();
    await expect(newPreset.getByText("For 30 minutes")).toBeVisible();
    await expect(newPreset.getByAltText("moon scene")).toBeVisible();

    // Edit Preset

    await newPreset.getByRole("button", { name: "Edit" }).click();

    await expect(page.getByText("Edit Preset")).toBeVisible();

    await page.getByTestId("preset-name").fill("Updated custom preset");

    await page.getByTestId("change-expiration").click();

    await expect(forTimeSelect).toBeVisible();

    await page.waitForTimeout(350);

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

    const lastPreset = page.getByTestId("preset-item").last();
    await expect(lastPreset).not.toHaveText("Updated custom preset");
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

    const newPreset = page.getByTestId("preset-item").last();

    await expect(newPreset).toBeVisible();

    await expect(newPreset.getByAltText("moon, marquee scene")).toBeVisible();
  });

  test("pinning a preset", async ({ page }) => {
    await page.goto("http://localhost:3000");

    await expect(page.getByRole("button", { name: "Twinkle" })).toHaveCount(0);

    await page.getByRole("link", { name: "Presets" }).click();

    const bunnyPreset = page.getByTestId("preset-item").nth(3);

    await bunnyPreset.getByTestId("pin-toggle").click();

    await page.getByRole("link", { name: "Panel" }).click();

    await expect(page.getByRole("button", { name: "Twinkle" })).toHaveCount(1);
  });

  test("reordering scenes via drag and drop", async ({ page }) => {
    await page.goto("http://localhost:3000");

    await page.getByRole("link", { name: "Presets" }).click();

    await page.getByRole("button", { name: "New Preset" }).click();

    await expect(page.getByText("Create New Preset")).toBeVisible();

    await page.getByTestId("preset-name").fill("Scene reorder test");

    // Add three different scenes
    await page.getByTestId("new-scene-button").click();
    await page.getByTestId("scene-0-select").click();
    await page.getByRole("option", { name: "moon" }).click();

    await page.getByTestId("new-scene-button").click();
    await page.getByTestId("scene-1-select").click();
    await page.getByRole("option", { name: "twinkle" }).click();

    await page.getByTestId("new-scene-button").click();
    await page.getByTestId("scene-2-select").click();
    await page.getByRole("option", { name: "ripple" }).click();

    // Verify initial order
    const scene0 = page.getByTestId("scene-0-select");
    const scene1 = page.getByTestId("scene-1-select");
    const scene2 = page.getByTestId("scene-2-select");

    await expect(scene0).toHaveValue("moon");
    await expect(scene1).toHaveValue("twinkle");
    await expect(scene2).toHaveValue("ripple");

    // Get the drag handle and target positions
    const dragHandle0 = page.getByTestId("scene-0-drag-handle");
    const dragHandle2 = page.getByTestId("scene-2-drag-handle");

    // Get bounding boxes
    const handle0Box = await dragHandle0.boundingBox();
    const handle2Box = await dragHandle2.boundingBox();

    if (handle0Box && handle2Box) {
      // Drag scene 0 (moon) to scene 2's position (ripple)
      await dragHandle0.hover();
      await page.mouse.down();

      // Move to scene 2's position with smooth animation
      await page.mouse.move(
        handle2Box.x + handle2Box.width / 2,
        handle2Box.y + handle2Box.height / 2,
        { steps: 10 }
      );

      await page.mouse.up();

      // Wait for the drag animation and reorder to complete
      await page.waitForTimeout(500);

      // Verify the new order - moon should now be at position 2
      await expect(page.getByTestId("scene-0-select")).toHaveValue("twinkle");
      await expect(page.getByTestId("scene-1-select")).toHaveValue("ripple");
      await expect(page.getByTestId("scene-2-select")).toHaveValue("moon");
    }

    // Create the preset to verify the order persists
    await page.getByRole("button", { name: "Create Preset" }).click();

    const newPreset = page.getByTestId("preset-item").last();
    await expect(newPreset).toBeVisible();
    await expect(
      newPreset.getByAltText("twinkle, ripple, moon scene")
    ).toBeVisible();
  });
});
