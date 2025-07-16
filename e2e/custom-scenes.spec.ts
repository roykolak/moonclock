import { test, expect } from "@playwright/test";
import { readFileSync, unlinkSync } from "fs";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

test.describe("Test", () => {
  test.beforeEach(() => {
    try {
      unlinkSync("./database-test.json");
      unlinkSync("./custom_scenes/automated-test-scene-123.json");
    } catch {}
  });

  test("creating, editting, and saving a new scene", async ({ page }) => {
    await page.goto("http://localhost:3000");

    await page.getByRole("link", { name: "Composer" }).click();

    await page.getByTestId("edit-scene-select").click();
    await page.getByRole("option", { name: "New scene" }).click();

    await page.getByTestId("new-scene-name").fill("automated-test-scene-123");

    await page.getByRole("button", { name: "Create" }).click();

    await page.getByTestId("color-0").click();
    await page.getByTestId("dot-0-1").click();
    await page.getByTestId("color-1").click();
    await page.getByTestId("dot-1-10").click();

    await page.getByRole("button", { name: "Save Scene" }).click();

    await wait(1000);

    const coordinates = JSON.parse(
      readFileSync(`./custom_scenes/automated-test-scene-123.json`).toString()
    );

    expect(Object.keys(coordinates)).toEqual(["0:1", "1:10"]);
    expect(Object.values(coordinates)).toEqual(["#89CFF0", "#facc0d"]);
  });

  test("editting the raw data of custom scene", async ({ page }) => {
    await page.goto("http://localhost:3000");

    await page.getByRole("link", { name: "Composer" }).click();

    await page.getByTestId("edit-scene-select").click();
    await page.getByRole("option", { name: "New scene" }).click();

    await page.getByTestId("new-scene-name").fill("automated-test-scene-123");

    await page.getByRole("button", { name: "Create" }).click();

    await page.getByRole("tab", { name: "Raw Data" }).click();

    await page.getByTestId("raw-data-textarea").fill('{"0:1": "#89CFF0"}');

    await page.getByRole("button", { name: "Save Scene" }).click();

    await wait(1000);

    const coordinates = JSON.parse(
      readFileSync(`./custom_scenes/automated-test-scene-123.json`).toString()
    );

    expect(Object.keys(coordinates)).toEqual(["0:1"]);
    expect(Object.values(coordinates)).toEqual(["#89CFF0"]);
  });
});
