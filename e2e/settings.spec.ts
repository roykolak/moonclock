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

  // The panel timing fields are what you tune to chase ghosting, so they have
  // to survive a round trip through the settings form. Saving is driven by the
  // name input rather than the selects themselves: no Select inside the
  // Advanced accordion opens its dropdown under Playwright's webkit (the
  // pre-existing Hardware Mapping one included), so this covers the wiring —
  // database to form to database — without depending on that interaction.
  test("panel timing settings survive a save", async ({ page }) => {
    seedDatabase({
      panel: {
        pwmBits: 9,
        pwnLsbNanoseconds: 300,
        pwmDitherBits: 2,
        limitRefreshRateHz: 120,
        panelType: "FM6126A",
      },
    });

    await page.goto("http://localhost:3000");
    await page.getByTestId("open-settings").click();
    await page.getByRole("button", { name: "Advanced Settings" }).click();

    // The stored values reach the form.
    await expect(page.getByTestId("panel-type-select")).toHaveValue("FM6126A");
    await expect(
      page.getByTestId("pwm-dither-bits-slider").getByRole("slider"),
    ).toHaveAttribute("aria-valuenow", "2");
    await expect(
      page.getByTestId("limit-refresh-hz-slider").getByRole("slider"),
    ).toHaveAttribute("aria-valuenow", "120");

    await page.getByTestId("panel-name-input").fill("Tuned Moonclock");
    await page.getByRole("button", { name: "Save" }).click();
    await page.keyboard.press("Escape");
    await expect(page.getByTestId("panel-name")).toHaveText("Tuned Moonclock");

    // ...and back out again, rather than being dropped on submit.
    const { panel } = JSON.parse(readFileSync("./database-test.json", "utf8"));
    expect(panel).toMatchObject({
      pwmBits: 9,
      pwnLsbNanoseconds: 300,
      pwmDitherBits: 2,
      limitRefreshRateHz: 120,
      panelType: "FM6126A",
    });
  });

  test("erasing the clock starts it over on the factory defaults", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000");
    await expect(page.getByTestId("panel-name")).toHaveText(TEST_PANEL_NAME);

    await page.getByTestId("open-settings").click();
    await page.getByTestId("erase-clock-button").click();
    await page.getByTestId("confirm-erase-clock-button").click();

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
