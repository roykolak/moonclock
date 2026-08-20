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

    await expect(page.getByTestId("panel-name")).toHaveText("My Moonclock");

    await page.getByTestId("open-settings").click();

    await page.getByTestId("panel-name-input").fill("New Moonclock");

    await expect(page.getByTestId("update-channel-select")).toHaveValue(
      "Stable",
    );

    await page.getByTestId("update-channel-select").click();
    await page.getByRole("option", { name: "Beta" }).click();

    await page.getByRole("button", { name: "Save" }).click();

    await page.keyboard.press("Escape");

    await expect(page.getByTestId("panel-name")).toHaveText("New Moonclock");

    await page.getByTestId("preset-dropdown").click();
    await page.getByRole("menuitem", { name: "Moon" }).click();

    await page.getByTestId("open-settings").click();

    await expect(page.getByTestId("update-channel-select")).toHaveValue("Beta");
  });
});
