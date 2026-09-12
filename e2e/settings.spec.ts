import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";
import { seedDatabase, TEST_PANEL_NAME } from "./support/seedDatabase";

test.describe("Updating panel settings", () => {
  test.beforeEach(() => {
    seedDatabase();
  });

  test("updating settings", async ({ page }) => {
    await page.goto("http://localhost:3000");

    await expect(page.getByTestId("panel-name")).toHaveText(TEST_PANEL_NAME);

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

  test("keeps the hardware fields it no longer renders", async ({ page }) => {
    seedDatabase({
      panel: {
        pwmBits: 9,
        pwnLsbNanoseconds: 300,
        pwmDitherBits: 2,
        limitRefreshRateHz: 120,
        panelType: "FM6126A",
        hardwareMapping: "adafruit-hat-pwm",
      },
    });

    await page.goto("http://localhost:3000");
    await page.getByTestId("open-settings").click();

    await page.getByTestId("panel-name-input").fill("Tuned Moonclock");
    await page.getByRole("button", { name: "Save" }).click();
    await page.keyboard.press("Escape");
    await expect(page.getByTestId("panel-name")).toHaveText("Tuned Moonclock");

    const { panel } = JSON.parse(readFileSync("./database-test.json", "utf8"));
    expect(panel).toMatchObject({
      pwmBits: 9,
      pwnLsbNanoseconds: 300,
      pwmDitherBits: 2,
      limitRefreshRateHz: 120,
      panelType: "FM6126A",
      hardwareMapping: "adafruit-hat-pwm",
    });
  });

  test("keeps the erase control behind a collapsed Danger Zone", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000");
    await page.getByTestId("open-settings").click();

    await expect(page.getByTestId("erase-clock-button")).toBeHidden();

    await page.getByRole("button", { name: "Danger Zone" }).click();

    await expect(page.getByTestId("erase-clock-button")).toBeVisible();
  });

  test("erasing the clock starts it over on the factory defaults", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000");
    await expect(page.getByTestId("panel-name")).toHaveText(TEST_PANEL_NAME);

    await page.getByTestId("open-settings").click();
    await page.getByRole("button", { name: "Danger Zone" }).click();
    await page.getByTestId("erase-clock-button").click();
    await page.getByTestId("confirm-erase-clock-button").click();

    await expect(page.getByTestId("setup-jumper-step")).toBeVisible();
    await expect(page.getByTestId("panel-name")).not.toHaveText(
      TEST_PANEL_NAME,
    );

    const { panel, presets, scheduledPreset } = JSON.parse(
      readFileSync("./database-test.json", "utf8"),
    );
    expect(panel.name).not.toBe(TEST_PANEL_NAME);
    expect(presets.map(({ name }: { name: string }) => name)).toEqual([
      "Moon",
      "Cat",
    ]);
    expect(scheduledPreset.preset).toBeNull();
  });
});
