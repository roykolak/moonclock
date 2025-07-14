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

    await page.getByTestId("panel-menu").click();
    await page.getByRole("menuitem", { name: "Clear Panel" }).click();

    await expect(
      page.getByRole("button", { name: "Sleep Mode" })
    ).toBeVisible();
  });

  test("activating a custom preset and clearing it", async ({ page }) => {
    await page.goto("http://localhost:3000");

    await page.getByRole("button", { name: "Custom" }).click();

    await expect(page.getByText("Set custom preset")).toBeVisible();

    await page.getByTestId("preset-name").fill("Custom preset");

    await page.getByTestId("change-expiration").click();

    await page.getByTestId("for-time-select").click();
    await page.getByRole("option", { name: "Forever", exact: true }).click();

    await page.getByRole("button", { name: "Apply now" }).click();

    await page.getByTestId("preset-form").waitFor({ state: "detached" });

    await expect(page.getByText("Custom until...")).toBeVisible();
    await expect(page.getByText("forever")).toBeVisible();

    await page.getByTestId("panel-menu").click();
    await page.getByRole("menuitem", { name: "Clear Panel" }).click();

    await expect(
      page.getByRole("button", { name: "Sleep Mode" })
    ).toBeVisible();
  });
});
