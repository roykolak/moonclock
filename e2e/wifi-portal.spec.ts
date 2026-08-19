import { test, expect, Page } from "@playwright/test";
import http from "http";
import fs from "fs";
import path from "path";
import { AddressInfo } from "net";

// The captive portal (wifi-connect-ui/) is a static folder served by the
// wifi-connect binary on the pi, not by the Next app. So instead of the shared
// dev server, these tests serve the folder from a throwaway static server and
// mock wifi-connect's two HTTP endpoints — GET /networks and POST /connect —
// with Playwright request interception.

const UI_DIR = path.resolve("wifi-connect-ui");

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".png": "image/png",
  ".ttf": "font/ttf",
};

interface Network {
  ssid: string;
  security: string;
}

const NETWORKS: Network[] = [
  { ssid: "Skynet-5G", security: "wpa2" },
  { ssid: "Skynet-5G", security: "wpa2" }, // duplicate — should be deduped
  { ssid: "CoffeeShop Guest", security: "" }, // open — no password
  { ssid: "Campus-Secure", security: "enterprise" }, // 802.1x — needs a username
];

const SSIDS = ["Skynet-5G", "CoffeeShop Guest", "Campus-Secure"];

let server: http.Server;
let baseURL: string;

test.beforeAll(async () => {
  server = http.createServer((req, res) => {
    const urlPath = (req.url || "/").split("?")[0];
    const rel = urlPath === "/" ? "index.html" : urlPath.replace(/^\/+/, "");
    const file = path.join(UI_DIR, rel);
    if (!file.startsWith(UI_DIR)) {
      res.statusCode = 403;
      res.end("forbidden");
      return;
    }
    fs.readFile(file, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end("not found");
        return;
      }
      res.setHeader(
        "Content-Type",
        MIME[path.extname(file)] || "application/octet-stream",
      );
      res.end(data);
    });
  });
  await new Promise<void>((resolve) => server.listen(0, () => resolve()));
  baseURL = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});

test.afterAll(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()));
});

async function gotoPortal(
  page: Page,
  opts: {
    networks?: Network[];
    networksStatus?: number;
    onConnect?: (body: unknown) => { status: number };
  } = {},
) {
  await page.route("**/networks", (route) => {
    if (opts.networksStatus && opts.networksStatus !== 200) {
      return route.fulfill({ status: opts.networksStatus, body: "error" });
    }
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(opts.networks ?? NETWORKS),
    });
  });

  await page.route("**/connect", (route) => {
    const body: unknown = route.request().postDataJSON();
    const result = opts.onConnect ? opts.onConnect(body) : { status: 200 };
    return route.fulfill({ status: result.status, body: "" });
  });

  await page.goto(baseURL);
}

test.describe("WiFi setup portal", () => {
  test("lists each network once, even when the scan returns duplicates", async ({
    page,
  }) => {
    await gotoPortal(page);
    await expect(page.getByLabel("WiFi network").locator("option")).toHaveText(
      SSIDS,
    );
  });

  test("shows a password but no username for a WPA2 network", async ({
    page,
  }) => {
    await gotoPortal(page);
    await expect(page.getByLabel("WiFi network")).toHaveValue("Skynet-5G");
    await expect(page.getByLabel("Password", { exact: true })).toBeVisible();
    await expect(page.getByLabel("Username", { exact: true })).toBeHidden();
  });

  test("hides the password entirely for an open network", async ({ page }) => {
    await gotoPortal(page);
    await page.getByLabel("WiFi network").selectOption("CoffeeShop Guest");
    await expect(page.getByLabel("Password", { exact: true })).toBeHidden();
    await expect(page.getByLabel("Username", { exact: true })).toBeHidden();
  });

  test("reveals a username for an enterprise network", async ({ page }) => {
    await gotoPortal(page);
    await page.getByLabel("WiFi network").selectOption("Campus-Secure");
    await expect(page.getByLabel("Username", { exact: true })).toBeVisible();
    await expect(page.getByLabel("Password", { exact: true })).toBeVisible();
  });

  test("toggles password visibility", async ({ page }) => {
    await gotoPortal(page);
    const pass = page.getByLabel("Password", { exact: true });
    await expect(pass).toHaveAttribute("type", "password");
    await page.getByRole("button", { name: "Show password" }).click();
    await expect(pass).toHaveAttribute("type", "text");
  });

  test("submits credentials and shows the success screen", async ({ page }) => {
    let posted: unknown;
    await gotoPortal(page, {
      onConnect: (body) => {
        posted = body;
        return { status: 200 };
      },
    });

    await page.getByLabel("Password", { exact: true }).fill("hunter2");
    await page.getByRole("button", { name: "Connect" }).click();

    await expect(page.getByText("ALMOST THERE")).toBeVisible();
    await expect(page.getByText("Skynet-5G")).toBeVisible();
    expect(posted).toEqual({
      ssid: "Skynet-5G",
      identity: "",
      passphrase: "hunter2",
    });
  });

  test("includes the username when joining an enterprise network", async ({
    page,
  }) => {
    let posted: unknown;
    await gotoPortal(page, {
      onConnect: (body) => {
        posted = body;
        return { status: 200 };
      },
    });

    await page.getByLabel("WiFi network").selectOption("Campus-Secure");
    await page.getByLabel("Username", { exact: true }).fill("student01");
    await page.getByLabel("Password", { exact: true }).fill("s3cret");
    await page.getByRole("button", { name: "Connect" }).click();

    await expect(page.getByText("ALMOST THERE")).toBeVisible();
    expect(posted).toEqual({
      ssid: "Campus-Secure",
      identity: "student01",
      passphrase: "s3cret",
    });
  });

  test("surfaces an error and re-enables Connect when the join fails", async ({
    page,
  }) => {
    await gotoPortal(page, { onConnect: () => ({ status: 500 }) });

    await page.getByLabel("Password", { exact: true }).fill("wrongpass");
    const connect = page.getByRole("button", { name: "Connect" });
    await connect.click();

    await expect(page.getByText(/couldn.t connect/i)).toBeVisible();
    await expect(connect).toBeEnabled();
  });

  test("offers a retry when the scan fails, then loads on retry", async ({
    page,
  }) => {
    await gotoPortal(page, { networksStatus: 500 });
    await expect(page.getByText(/couldn.t load networks/i)).toBeVisible();

    // Let the next scan succeed; the newer route takes precedence.
    await page.route("**/networks", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(NETWORKS),
      }),
    );
    await page.getByRole("button", { name: /try again/i }).click();

    await expect(page.getByLabel("WiFi network").locator("option")).toHaveText(
      SSIDS,
    );
  });
});
