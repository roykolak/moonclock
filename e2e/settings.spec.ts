import { test, expect } from "@playwright/test";
import { unlinkSync } from "fs";

test.describe("Updating panel settings", () => {
  test.beforeEach(() => {
    try {
      unlinkSync("./database-test.json");
      unlinkSync("./custom_scenes/automated-test-scene-123.json");
    } catch {}
  });

  test("updating settings", async ({ page }) => {
    await page.goto("http://localhost:3000");

    await expect(page.getByText("My Moonclock")).toBeVisible();

    await page.getByRole("link", { name: "Settings" }).click();

    await page.getByTestId("panel-name-input").fill("New Moonclock");

    await page.getByTestId("default-scene-select").click();
    await page.getByRole("option", { name: "bunny" }).click();

    await page.getByTestId("time-adjustment-select").click();
    await page.getByRole("option", { name: "1 hour" }).click();

    await page.getByRole("button", { name: "Save" }).click();

    await page.getByRole("link", { name: "Panel" }).click();

    await expect(page.getByTestId("panel-name")).toHaveText("New Moonclock");
    await expect(page.getByAltText("bunny scene")).toBeVisible();

    await page.getByRole("button", { name: "Moon" }).click();

    await expect(page.getByRole("button", { name: "+1 hour" })).toBeVisible();
    await expect(page.getByRole("button", { name: "-1 hour" })).toBeVisible();
  });
});
