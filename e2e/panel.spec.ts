import { test, expect } from "@playwright/test";
import { unlinkSync } from "fs";

test.describe("Test", () => {
  test.beforeEach(() => {
    try {
      unlinkSync("./database-test.json");
      unlinkSync("./custom_scenes/automated-test-scene-123.json");
    } catch {}
  });

  test("activating a preset and clearing it", async ({ page }) => {
    await page.goto("http://localhost:3000");

    await expect(page.getByTestId("preset-dropdown")).toHaveText("Blank");

    await page.getByTestId("preset-dropdown").click();
    await page.getByRole("menuitem", { name: "Moon" }).click();

    await expect(page.getByTestId("preset-dropdown")).toContainText("Moon");
    await expect(page.getByTestId("end-time")).toContainText("7:00 AM");

    await page.getByTestId("panel-menu").click();
    await page.getByRole("menuitem", { name: "Clear Panel" }).click();

    await expect(page.getByTestId("preset-dropdown")).toHaveText("Blank");
    await expect(page.getByTestId("end-time")).toHaveCount(0);
  });

  test("activating a preset and editting it", async ({ page }) => {
    await page.goto("http://localhost:3000");

    await page.getByTestId("preset-dropdown").click();
    await page.getByRole("menuitem", { name: "Moon" }).click();

    await page.getByTestId("panel-menu").click();
    await page.getByRole("menuitem", { name: "Edit Preset" }).click();

    await expect(
      page.getByRole("heading", { name: "Update Preset" }),
    ).toBeVisible();

    await page.getByTestId("preset-name").fill("Preset 123");

    await page.getByRole("button", { name: "Update", exact: true }).click();

    await expect(page.getByTestId("preset-dropdown")).toContainText(
      "Preset 123",
    );
  });
});
