import { test, expect } from "@playwright/test";
import { clearDatabase, seedDatabase } from "./support/seedDatabase";

test.describe("Test", () => {
  test.beforeEach(() => {
    clearDatabase();
  });

  test("activating a preset and toggling it back off", async ({ page }) => {
    await page.goto("http://localhost:3000");

    await expect(page.getByTestId("preset-dropdown")).toHaveText("Default");

    // Activate the preset from the dropdown.
    await page.getByTestId("preset-dropdown").click();
    await page.getByRole("menuitem", { name: "Moon" }).click();

    await expect(page.getByTestId("preset-dropdown")).toContainText("Moon");
    await expect(page.getByTestId("end-time")).toContainText("7:00 AM");

    // Selecting the active preset again clears it.
    await page.getByTestId("preset-dropdown").click();
    await page.getByRole("menuitem", { name: "Moon" }).click();

    await expect(page.getByTestId("preset-dropdown")).toHaveText("Default");
    await expect(page.getByTestId("end-time")).toHaveCount(0);
  });

  test("names the default preset rather than the scene it runs", async ({
    page,
  }) => {
    seedDatabase({
      panel: {
        defaultPreset: {
          name: "All Off",
          sceneId: "blank",
          mode: "for",
          untilDay: "0",
          untilHour: "0",
          untilMinute: "00",
          forTime: "0:00",
        },
      },
    });

    await page.goto("http://localhost:3000");

    await expect(page.getByTestId("preset-dropdown")).toHaveText("All Off");
  });

  test("rebooting the machine from the panel menu", async ({ page }) => {
    await page.goto("http://localhost:3000");

    await page.route("**/api/reboot", (route) =>
      route.fulfill({ json: { ok: true } }),
    );

    const rebootRequest = page.waitForRequest(
      (request) =>
        request.url().endsWith("/api/reboot") && request.method() === "POST",
    );

    await page.getByTestId("panel-menu").click();
    await page.getByTestId("reboot-machine").click();

    await rebootRequest;
    await expect(page.getByText("Rebooting machine")).toBeVisible();
  });
});
