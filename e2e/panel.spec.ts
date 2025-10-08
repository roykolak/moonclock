import { test, expect } from "@playwright/test";
import { unlinkSync } from "fs";

test.describe("Test", () => {
  test.beforeEach(() => {
    try {
      unlinkSync("./database-test.json");
      unlinkSync("./custom_scenes/automated-test-scene-123.json");
    } catch {}
  });

  test("activating a preset, adjusting the end time, and clearing it", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000");

    await page.getByRole("button", { name: "Moon" }).click();

    const endTime = page.getByTestId("end-time");

    await expect(page.getByText("Moon until...")).toBeVisible();
    await expect(endTime).toHaveText("7:00 AM");

    await page.getByRole("button", { name: "+5 min" }).click();
    await expect(endTime).toHaveText("7:05 AM");

    await page.getByRole("button", { name: "+5 min" }).click();
    await expect(endTime).toHaveText("7:10 AM");

    await page.getByRole("button", { name: "-5 min" }).click();
    await expect(endTime).toHaveText("7:05 AM");

    await page.getByTestId("panel-menu").click();
    await page.getByRole("menuitem", { name: "Clear Panel" }).click();

    await expect(page.getByRole("button", { name: "Moon" })).toBeVisible();
  });

  test("activating a preset and editting it", async ({ page }) => {
    await page.goto("http://localhost:3000");

    await page.getByRole("button", { name: "Moon" }).click();

    await page.getByTestId("panel-menu").click();
    await page.getByRole("menuitem", { name: "Edit Preset" }).click();

    await expect(page.getByText("Update Preset")).toBeVisible();

    await page.getByTestId("preset-name").fill("Preset 123");

    await page.getByRole("button", { name: "Update" }).click();

    await expect(page.getByText("Preset 123 until...")).toBeVisible();
  });

  test("activating a custom preset and clearing it", async ({ page }) => {
    await page.goto("http://localhost:3000");

    await page.getByRole("button", { name: "Custom" }).click();

    await expect(page.getByText("Set custom preset")).toBeVisible();

    await page.getByTestId("change-expiration").click();

    await page.getByTestId("for-time-select").click();
    await page.getByRole("option", { name: "Forever", exact: true }).click();

    await page.getByRole("button", { name: "Apply now" }).click();

    await page.getByTestId("preset-form").waitFor({ state: "detached" });

    await expect(page.getByText("Custom until...")).toBeVisible();
    await expect(page.getByText("forever")).toBeVisible();

    await page.getByTestId("panel-menu").click();
    await page.getByRole("menuitem", { name: "Clear Panel" }).click();

    await expect(page.getByRole("button", { name: "Moon" })).toBeVisible();
  });
});
