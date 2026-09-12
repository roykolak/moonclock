import { test, expect, Page } from "@playwright/test";
import { readFileSync } from "fs";
import { seedDatabase } from "./support/seedDatabase";
import { recommendedPanelSettings } from "../src/helpers/recommendedPanelSettings";
import { DataTypes } from "../src/types";

const TUNING_FIELDS = [
  "pwnLsbNanoseconds",
  "gpioSlowdown",
  "pwmBits",
  "pwmDitherBits",
  "limitRefreshRateHz",
] as const;

function readDatabase(): DataTypes {
  return JSON.parse(readFileSync("./database-test.json", "utf8"));
}

async function reachTuningStep(page: Page, answer: "Yes" | "No" = "No") {
  await page.goto("http://localhost:3000");
  await expect(page.getByTestId("setup-jumper-step")).toBeVisible();
  await page.getByText(`${answer} —`).click();
  await page.getByTestId("setup-continue").click();
  await expect(page.getByTestId("setup-tuning-step")).toBeVisible();
}

test.describe("First run setup", () => {
  test.beforeEach(() => {
    seedDatabase({ setup: { completedAt: null } });
  });

  test("opens itself on a clock that has never been set up", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000");

    await expect(
      page.getByRole("heading", { name: "Did you solder the jumper wire?" }),
    ).toBeVisible();
  });

  test("turns the jumper wire answer into a hardware mapping", async ({
    page,
  }) => {
    await reachTuningStep(page, "Yes");

    await expect
      .poll(() => readDatabase().panel.hardwareMapping)
      .toBe("adafruit-hat-pwm");
  });

  test("holds a test pattern lease while the tuning step is open", async ({
    page,
  }) => {
    await reachTuningStep(page);

    await expect
      .poll(() => {
        const until = readDatabase().setup?.testPatternUntil;
        return until != null && new Date(until).getTime() > Date.now();
      })
      .toBe(true);
  });

  test("saves and reloads the hardware as soon as a slider moves", async ({
    page,
  }) => {
    await reachTuningStep(page);

    const panelSaved = page.waitForRequest(
      (request) =>
        request.url().endsWith("/api/panel") && request.method() === "PUT",
    );

    await page
      .getByTestId("pwn-lsb-nanoseconds-slider")
      .getByRole("slider")
      .press("ArrowRight");

    await panelSaved;
    await expect.poll(() => readDatabase().panel.pwnLsbNanoseconds).toBe(554);
  });

  test("puts every tuning slider back to the recommended level", async ({
    page,
  }) => {
    seedDatabase({
      setup: { completedAt: null },
      panel: {
        brightness: 90,
        pwnLsbNanoseconds: 130,
        gpioSlowdown: 0,
        pwmBits: 11,
        pwmDitherBits: 2,
        limitRefreshRateHz: 200,
      },
    });

    await reachTuningStep(page);

    await page.getByTestId("use-recommended-settings").click();

    await expect
      .poll(() => {
        const { panel } = readDatabase();
        return Object.fromEntries(
          TUNING_FIELDS.map((field) => [field, panel[field]]),
        );
      })
      .toEqual(
        Object.fromEntries(
          TUNING_FIELDS.map((field) => [
            field,
            recommendedPanelSettings[field],
          ]),
        ),
      );

    expect(readDatabase().panel.brightness).toBe(90);
  });

  test("hands the panel back and stays gone once it is finished", async ({
    page,
  }) => {
    await reachTuningStep(page);

    await page.getByTestId("finish-setup").click();

    await expect(page.getByTestId("setup-tuning-step")).toBeHidden();
    await expect.poll(() => readDatabase().setup?.completedAt).not.toBeNull();
    await expect.poll(() => readDatabase().setup?.testPatternUntil).toBeNull();

    await page.reload();
    await expect(page.getByTestId("panel-name")).toBeVisible();
    await expect(page.getByTestId("setup-jumper-step")).toBeHidden();
  });
});

test.describe("Rerunning setup", () => {
  test.beforeEach(() => {
    seedDatabase();
  });

  test("does not open on its own once setup is done", async ({ page }) => {
    await page.goto("http://localhost:3000");

    await expect(page.getByTestId("panel-name")).toBeVisible();
    await expect(page.getByTestId("setup-jumper-step")).toBeHidden();
  });

  test("can be started again from settings", async ({ page }) => {
    await page.goto("http://localhost:3000");

    await page.getByTestId("open-settings").click();
    await page.getByTestId("run-setup-button").click();

    await expect(page.getByTestId("setup-jumper-step")).toBeVisible();
  });
});
