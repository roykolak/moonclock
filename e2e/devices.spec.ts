import { test, expect, Page } from "@playwright/test";
import { seedDatabase, TEST_PANEL_NAME } from "./support/seedDatabase";

const PEER_ORIGIN = "http://192.168.9.9";

const peer = {
  id: "peer-0001",
  name: "Bedroom",
  version: "0.97.0",
  address: "192.168.9.9",
  port: 80,
  hardwarePort: 3001,
};

async function stubNetwork(page: Page, devices: unknown[]) {
  const network = { devices, searches: 0 };

  await page.route("**/api/peers", (route) =>
    route.fulfill({ json: { deviceId: "local", devices: network.devices } }),
  );

  await page.route("**/api/peers/refresh", async (route) => {
    network.searches += 1;
    await route.fulfill({ json: { ok: true } });
  });

  return network;
}

test.describe("Switching to another clock", () => {
  test.beforeEach(() => {
    seedDatabase();
  });

  test("offers the switcher even when this is the only clock", async ({
    page,
  }) => {
    await stubNetwork(page, []);

    await page.goto("http://localhost:3000");

    await expect(page.getByTestId("panel-name")).toHaveText(TEST_PANEL_NAME);

    await page.getByTestId("device-switcher").click();

    await expect(page.getByRole("menuitem")).toHaveCount(2);
    await expect(
      page.getByRole("menuitem", { name: TEST_PANEL_NAME }),
    ).toBeVisible();
    await expect(page.getByTestId("search-for-clocks")).toBeVisible();
  });

  test("looks for more clocks and lists what the search turns up", async ({
    page,
  }) => {
    const network = await stubNetwork(page, []);

    await page.goto("http://localhost:3000");

    await page.getByTestId("device-switcher").click();
    await expect(page.getByRole("menuitem", { name: "Bedroom" })).toHaveCount(
      0,
    );

    network.devices = [peer];
    await page.getByTestId("search-for-clocks").click();

    await expect(page.getByRole("menuitem", { name: "Bedroom" })).toBeVisible();
    expect(network.searches).toBe(1);
  });

  test("stays open when a clock turns up while you are reading it", async ({
    page,
  }) => {
    const network = await stubNetwork(page, []);

    await page.goto("http://localhost:3000");
    await expect(page.getByTestId("panel-name")).toHaveText(TEST_PANEL_NAME);

    await page.getByTestId("device-switcher").click();
    await expect(page.getByTestId("search-for-clocks")).toBeVisible();

    network.devices = [peer];

    // Arrives on the next poll, so allow comfortably more than one interval.
    await expect(page.getByRole("menuitem", { name: "Bedroom" })).toBeVisible({
      timeout: 15000,
    });
    await expect(page.getByTestId("search-for-clocks")).toBeVisible();
  });

  test("shows the search running while the clock is listening", async ({
    page,
  }) => {
    await stubNetwork(page, []);

    await page.route("**/api/peers/refresh", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await route.fulfill({ json: { ok: true } });
    });

    await page.goto("http://localhost:3000");

    await page.getByTestId("device-switcher").click();
    await page.getByTestId("search-for-clocks").click();

    await expect(page.getByTestId("searching")).toBeVisible();
    await expect(page.getByText("Look for more clocks")).toBeVisible();

    await expect(page.getByTestId("searching")).toHaveCount(0, {
      timeout: 5000,
    });
  });

  test("opens the other clock's own app when you pick it", async ({ page }) => {
    await stubNetwork(page, [peer]);

    await page.route(`${PEER_ORIGIN}/**`, (route) =>
      route.fulfill({
        contentType: "text/html",
        body: "<title>Bedroom</title>",
      }),
    );

    await page.goto("http://localhost:3000");

    await page.getByTestId("device-switcher").click();
    await page.getByRole("menuitem", { name: "Bedroom" }).click();

    await expect(page).toHaveURL(`${PEER_ORIGIN}/`);
  });

  test("stays on this clock when the other one doesn't answer", async ({
    page,
  }) => {
    await stubNetwork(page, [peer]);

    await page.route(`${PEER_ORIGIN}/**`, (route) => route.abort());

    await page.goto("http://localhost:3000");

    await page.getByTestId("device-switcher").click();
    await page.getByRole("menuitem", { name: "Bedroom" }).click();

    await expect(page.getByText("Can't reach Bedroom")).toBeVisible();
    await expect(page).toHaveURL(/localhost:3000/);
    await expect(page.getByTestId("panel-name")).toHaveText(TEST_PANEL_NAME);
  });
});
