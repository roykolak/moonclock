import { test, expect, Page } from "@playwright/test";
import { seedDatabase, TEST_PANEL_NAME } from "./support/seedDatabase";

const PEER_ORIGIN = "http://192.168.9.9";

const peer = {
  id: "peer-0001",
  name: "Bedroom",
  version: "0.97.0",
  host: "moonclock-2.local",
  address: "192.168.9.9",
  port: 80,
  hardwarePort: 3001,
};

const peerPreset = {
  id: "peer-preset-1",
  name: "Nightlight",
  sceneId: "moon",
  mode: "for",
  untilDay: "0",
  untilHour: "0",
  untilMinute: "0",
  forTime: "0:30",
};

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function peerState(scheduledPreset: unknown) {
  return {
    deviceId: peer.id,
    version: peer.version,
    hardwarePort: peer.hardwarePort,
    panel: {
      name: peer.name,
      brightness: 30,
      pwnLsbNanoseconds: 130,
      gpioSlowdown: 4,
      pwmBits: 11,
      hardwareMapping: "adafruit-hat",
      updateChannel: "stable",
      defaultPreset: {
        name: "Default",
        sceneId: "blank",
        mode: "for",
        untilDay: "0",
        untilHour: "0",
        untilMinute: "00",
        forTime: "0:00",
      },
    },
    presets: [peerPreset],
    scheduledPreset,
    nextVersion: null,
  };
}

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

test.describe("Administering another clock", () => {
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

  test("switches to a peer and drives it over its own API", async ({
    page,
  }) => {
    await stubNetwork(page, [peer]);

    let scheduled: { preset: unknown; endTime: string | null } | null = null;
    const scheduleRequests: unknown[] = [];

    await page.route(`${PEER_ORIGIN}/api/state`, (route) =>
      route.fulfill({ json: peerState(scheduled), headers: CORS_HEADERS }),
    );

    await page.route(`${PEER_ORIGIN}/api/scheduled-preset`, (route) => {
      if (route.request().method() === "OPTIONS") {
        return route.fulfill({ status: 204, headers: CORS_HEADERS });
      }
      const body = route.request().postDataJSON();
      scheduleRequests.push(body);
      scheduled = body;
      return route.fulfill({ json: { ok: true }, headers: CORS_HEADERS });
    });

    await page.goto("http://localhost:3000");

    // The local clock's own name is the switcher once a peer shows up.
    await expect(page.getByTestId("panel-name")).toHaveText(TEST_PANEL_NAME);
    await page.getByTestId("device-switcher").click();
    await page.getByRole("menuitem", { name: "Bedroom" }).click();

    // The whole screen is now the peer's: its name, and its presets.
    await expect(page.getByTestId("panel-name")).toHaveText("Bedroom");
    await expect(page.getByTestId("preset-dropdown")).toHaveText("Blank");

    await page.getByTestId("preset-dropdown").click();
    await page.getByRole("menuitem", { name: "Nightlight" }).click();

    // Applying it went to the peer, not to this clock...
    await expect(page.getByTestId("preset-dropdown")).toContainText(
      "Nightlight",
    );
    expect(scheduleRequests).toHaveLength(1);

    // ...and switching back leaves this clock as it was.
    await page.getByTestId("device-switcher").click();
    await page.getByRole("menuitem", { name: TEST_PANEL_NAME }).click();

    await expect(page.getByTestId("panel-name")).toHaveText(TEST_PANEL_NAME);
    await expect(page.getByTestId("preset-dropdown")).toHaveText("Blank");
  });

  test("offers a way back when the peer stops answering", async ({ page }) => {
    await stubNetwork(page, [peer]);

    await page.route(`${PEER_ORIGIN}/api/state`, (route) => route.abort());

    await page.goto("http://localhost:3000");

    await page.getByTestId("device-switcher").click();
    await page.getByRole("menuitem", { name: "Bedroom" }).click();

    await expect(page.getByText("Can't reach that clock")).toBeVisible();

    await page.getByRole("button", { name: "Back to this clock" }).click();

    await expect(page.getByTestId("panel-name")).toHaveText(TEST_PANEL_NAME);
  });
});
