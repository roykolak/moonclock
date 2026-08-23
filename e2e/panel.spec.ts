import { test, expect } from "@playwright/test";
import { clearDatabase } from "./support/seedDatabase";

test.describe("Test", () => {
  test.beforeEach(() => {
    clearDatabase();
  });

  test("activating a preset and toggling it back off", async ({ page }) => {
    await page.goto("http://localhost:3000");

    await expect(page.getByTestId("preset-dropdown")).toHaveText("Blank");

    // Activate the preset from the dropdown.
    await page.getByTestId("preset-dropdown").click();
    await page.getByRole("menuitem", { name: "Moon" }).click();

    await expect(page.getByTestId("preset-dropdown")).toContainText("Moon");
    await expect(page.getByTestId("end-time")).toContainText("7:00 AM");

    // Selecting the active preset again clears it.
    await page.getByTestId("preset-dropdown").click();
    await page.getByRole("menuitem", { name: "Moon" }).click();

    await expect(page.getByTestId("preset-dropdown")).toHaveText("Blank");
    await expect(page.getByTestId("end-time")).toHaveCount(0);
  });
});
