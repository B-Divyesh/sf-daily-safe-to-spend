import { readFile } from "node:fs/promises";
import { expect, test, type Browser, type Page } from "@playwright/test";

function isoInDays(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}

async function cleanDemo(page: Page): Promise<void> {
  await page.goto("/");
  await page.evaluate(async () => {
    localStorage.clear();
    for (const name of ["today-money", "today-money-demo"]) {
      await new Promise<void>((resolve) => {
        const request = indexedDB.deleteDatabase(name);
        request.onsuccess = () => resolve();
        request.onerror = () => resolve();
        request.onblocked = () => resolve();
      });
    }
  });
  await page.goto("/demo");
  await expect(page.getByText("Demo — sample data, nothing is saved")).toBeVisible();
}

test.beforeEach(async ({ page }) => cleanDemo(page));

test("@claim:manual-plan @claim:daily-calculation shows the sample inputs and computed daily amount", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Your demo daily amount" })).toBeVisible();
  await expect(page.locator(".measurements").getByText("$1,240.00", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "$60.00" })).toBeVisible();
  await expect(page.getByText("For manual budgeters who need a daily amount without connecting a bank.")).toHaveCount(0);
  await page.getByRole("link", { name: "Today Money home" }).click();
  await expect(page.getByText("For manual budgeters who need a daily amount without connecting a bank.")).toBeVisible();
});

test("@claim:visible-assumptions exposes cash, bills, protected money, days, and formula", async ({ page }) => {
  await expect(page.locator(".measurements").getByText("$1,240.00", { exact: true })).toBeVisible();
  await expect(page.locator(".measurements").getByText("− $390.00", { exact: true })).toBeVisible();
  await expect(page.locator(".measurements").getByText("− $250.00", { exact: true })).toBeVisible();
  await page.getByText("Show the working").click();
  await expect(page.getByText(/\$1,240\.00 cash − \$390\.00 bills − \$250\.00 protected ÷ 10 days/)).toBeVisible();
});

test("@claim:purchase-check @claim:purchase-check-nondestructive checks without changing the plan", async ({ page }) => {
  const before = await page.locator(".daily-amount").textContent();
  await page.getByLabel("Purchase amount").fill("75");
  await expect(page.getByText("Yes, it fits.")).toBeVisible();
  await expect(page.getByText(/above today’s \$60\.00 pace/)).toBeVisible();
  expect(await page.locator(".daily-amount").textContent()).toBe(before);
  await page.reload();
  await expect(page.getByRole("heading", { name: "$60.00" })).toBeVisible();
});

test("@claim:bill-rules shows due, paid, and overdue bill handling", async ({ page }) => {
  await expect(page.getByText(/Due .*\d{4}/).first()).toBeVisible();
  await expect(page.getByText("Overdue — included")).toBeVisible();
  await expect(page.getByText("Paid — excluded")).toBeVisible();
  await page.getByRole("button", { name: "Mark Phone bill unpaid" }).click();
  await expect(page.locator(".measurements").getByText("− $440.00", { exact: true })).toBeVisible();
});

test("@claim:history records a balance update", async ({ page }) => {
  await page.getByRole("button", { name: "Update balance" }).click();
  await page.getByLabel("Spendable cash right now").fill("1300");
  await page.getByRole("button", { name: "Save changes" }).click();
  await page.getByText(/Balance history \(3\)/).click();
  await expect(page.locator(".history").getByText("$1,300.00")).toBeVisible();
  await expect(page.locator(".history").getByText("$1,240.00")).toBeVisible();
});

test("@claim:json-export @claim:csv-export downloads valid ownership files", async ({ page }) => {
  let pending = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export JSON" }).click();
  let download = await pending;
  let path = await download.path();
  const json = JSON.parse(await readFile(path!, "utf8"));
  expect(json.balance).toBe(1240);
  expect(json.bills).toHaveLength(3);
  pending = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export CSV" }).click();
  download = await pending;
  path = await download.path();
  const csv = await readFile(path!, "utf8");
  expect(csv.split("\n")[0]).toBe('"type","name","amount","date/status"');
  expect(csv).toContain('"bill","Electric bill","90"');
  expect(csv).toContain('"protected","Emergency savings","250","protected"');
});

test("@claim:json-import imports a valid backup inside demo storage", async ({ page }) => {
  page.once("dialog", (dialog) => dialog.accept());
  await page.locator("#import-json").setInputFiles({
    name: "plan.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify({
      version: 1, balance: 800, payday: isoInDays(8), currency: "USD", bills: [], envelopes: [],
      history: [], updatedAt: new Date().toISOString(),
    })),
  });
  await expect(page.locator(".measurements").getByText("$800.00", { exact: true }).first()).toBeVisible();
  await page.reload();
  await expect(page.locator(".measurements").getByText("$800.00", { exact: true }).first()).toBeVisible();
});

test("@claim:local-plan-storage @claim:demo-sandbox keeps real and demo plans separate, resets, and discards demo on exit", async ({ page }) => {
  await page.getByRole("link", { name: "Start for real" }).click();
  await page.getByLabel("Spendable cash right now").fill("333");
  await page.getByLabel("Next payday").fill(isoInDays(3));
  await page.getByRole("button", { name: "Show my daily amount" }).click();
  await expect(page.locator(".measurements").getByText("$333.00", { exact: true }).first()).toBeVisible();
  await page.getByRole("link", { name: "Demo" }).click();
  await expect(page.locator(".measurements").getByText("$1,240.00", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Update balance" }).click();
  await page.getByLabel("Spendable cash right now").fill("999");
  await page.getByRole("button", { name: "Save changes" }).click();
  await page.getByRole("button", { name: "Reset demo" }).first().click();
  await expect(page.locator(".measurements").getByText("$1,240.00", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Update balance" }).click();
  await page.getByLabel("Spendable cash right now").fill("999");
  await page.getByRole("button", { name: "Save changes" }).click();
  await page.getByRole("link", { name: "Start for real" }).click();
  await expect(page.locator(".measurements").getByText("$333.00", { exact: true }).first()).toBeVisible();
  await page.getByRole("link", { name: "Demo" }).click();
  await expect(page.locator(".measurements").getByText("$1,240.00", { exact: true })).toBeVisible();
  await page.goto("/?demo=1");
  await expect(page).toHaveTitle("Demo — Today Money");
  await expect(page.getByText("Demo — sample data, nothing is saved")).toBeVisible();
});

test("@claim:local-data @claim:no-bank-connection @claim:no-tracking @claim:no-account @claim:no-third-party-request keeps the full demo flow on-origin", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.getByRole("button", { name: "Add bill" }).first().click();
  await page.getByLabel("Bill name").fill("Water bill");
  await page.getByLabel("Amount", { exact: true }).fill("25");
  await page.getByLabel("Due date").fill(isoInDays(2));
  await page.getByRole("button", { name: "Save changes" }).click();
  await page.getByLabel("Purchase amount").fill("25");
  const pending = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export JSON" }).click();
  await pending;
  expect(requests.every((url) => new URL(url).origin === "http://127.0.0.1:4173")).toBe(true);
  expect(requests.join(" ")).not.toMatch(/analytics|segment|google|facebook|bank|account|login/i);
  await expect(page.getByRole("link", { name: /sign|log in|account/i })).toHaveCount(0);
});

test("@claim:offline-reload reloads the seeded demo without a connection", async ({ page, context }) => {
  await page.keyboard.press("Tab");
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByText("Demo — sample data, nothing is saved")).toBeVisible();
  await expect(page.getByRole("heading", { name: "$60.00" })).toBeVisible();
});

test("@claim:installable-pwa ships a standalone manifest and active offline worker", async ({ page }) => {
  const manifest = await page.evaluate(async () => fetch("/manifest.webmanifest").then((response) => response.json()));
  expect(manifest.display).toBe("standalone");
  expect(manifest.start_url).toContain("?source=pwa&v=2");
  expect(manifest.icons.some((item: { sizes: string }) => item.sizes === "512x512")).toBe(true);
  await page.keyboard.press("Tab");
  const scope = await page.evaluate(async () => (await navigator.serviceWorker.ready).scope);
  expect(scope).toBe("http://127.0.0.1:4173/");
});

test("@claim:price-one-time states the planned price consistently", async ({ page }) => {
  await page.getByRole("link", { name: "Today Money home" }).click();
  await expect(page.getByText("Core plan is free; Plus is planned at $12 once")).toBeVisible();
  await expect(page.getByText("The planned Today Money Plus price is US$12 once.")).toBeVisible();
  await expect(page.getByText("Purchases are not open yet.")).toBeVisible();
  await expect(page.getByRole("link", { name: /Buy Plus/ })).toHaveCount(0);
});

test("@claim:core-free keeps the core workflow and ordinary exports free", async ({ page }) => {
  const requests: string[] = [];
  await page.route("https://api.sociobot.in/**", async (route) => {
    requests.push(route.request().url());
    await route.abort("blockedbyclient");
  });
  await expect(page.getByText("PLUS UNLOCKED")).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem("sb_license:daily-safe-to-spend"))).toBeNull();

  await page.getByRole("button", { name: "Update balance" }).click();
  await page.getByLabel("Spendable cash right now").fill("1250");
  await page.getByRole("button", { name: "Save changes" }).click();
  await page.getByLabel("Purchase amount").fill("40");
  await expect(page.getByText("Yes, it fits.")).toBeVisible();

  let pending = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export JSON" }).click();
  let downloadPath = await (await pending).path();
  expect(downloadPath).not.toBeNull();
  expect(JSON.parse(await readFile(downloadPath!, "utf8")).balance).toBe(1250);
  pending = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export CSV" }).click();
  downloadPath = await (await pending).path();
  expect(downloadPath).not.toBeNull();
  expect(await readFile(downloadPath!, "utf8")).toContain('"balance","Current cash","1250"');
  expect(requests).toEqual([]);
});

async function unlockFixture(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.setItem("sb_license:daily-safe-to-spend", "claim-fixture-license");
    localStorage.setItem("sb_license:daily-safe-to-spend:verdict", JSON.stringify({ valid: true, checkedAt: Date.now() }));
  });
  await page.reload();
  await expect(page.getByText("PLUS UNLOCKED")).toBeVisible();
}

async function newRestorePage(browser: Browser): Promise<{ page: Page; close: () => Promise<void> }> {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto("/demo");
  await unlockFixture(page);
  return { page, close: () => context.close() };
}

test("@claim:encrypted-backup creates and restores an encrypted plan in a fresh context", async ({ page, browser }) => {
  await unlockFixture(page);
  await page.getByRole("button", { name: "Update balance" }).click();
  await page.getByLabel("Spendable cash right now").fill("1350");
  await page.getByRole("button", { name: "Save changes" }).click();
  await page.getByRole("button", { name: "Add bill" }).first().click();
  await page.getByLabel("Bill name").fill("Vet appointment");
  await page.getByLabel("Amount", { exact: true }).fill("65");
  await page.getByLabel("Due date").fill(isoInDays(2));
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText("Vet appointment", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Protect money" }).first().click();
  await page.getByLabel("Name").fill("Travel home");
  await page.getByLabel("Amount to protect").fill("80");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText("Travel home", { exact: true })).toBeVisible();

  await page.getByLabel("Backup password").fill("claim-password");
  const pending = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download encrypted backup" }).click();
  const path = (await pending).path();
  const backupPath = await path;
  expect(backupPath).not.toBeNull();
  const packed = JSON.parse(await readFile(backupPath!, "utf8"));
  expect(packed.format).toBe("today-money-encrypted-v1");
  expect(JSON.stringify(packed)).not.toContain('"balance":1350');
  expect(JSON.stringify(packed)).not.toContain("Vet appointment");

  const restore = await newRestorePage(browser);
  try {
    await expect(restore.page.locator(".measurements").getByText("$1,240.00", { exact: true })).toBeVisible();
    await restore.page.getByLabel("Restore password").fill("claim-password");
    await restore.page.locator("#encrypted-file").setInputFiles(backupPath!);
    restore.page.once("dialog", (dialog) => dialog.accept());
    await restore.page.getByRole("button", { name: "Restore encrypted backup" }).click();
    await expect(restore.page.locator(".measurements").getByText("$1,350.00", { exact: true })).toBeVisible();
    await expect(restore.page.getByText("Vet appointment", { exact: true })).toBeVisible();
    await expect(restore.page.getByText("Travel home", { exact: true })).toBeVisible();
    await restore.page.reload();
    await expect(restore.page.locator(".measurements").getByText("$1,350.00", { exact: true })).toBeVisible();
  } finally {
    await restore.close();
  }
});

test("@claim:keyboard-flow supports Tab, Enter, Escape, and focus return", async ({ page }) => {
  await page.keyboard.press("Tab");
  expect(await page.evaluate(() => document.activeElement?.tagName)).not.toBe("BODY");
  const addBill = page.getByRole("button", { name: "Add bill" }).first();
  await addBill.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByLabel("Bill name")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(addBill).toBeFocused();
});

test("@claim:shortfall-clamp @claim:exact-shortfall @claim:payday-and-overdue-rules proves calculation boundaries", async ({ page }) => {
  await expect(page.getByText("Overdue — included")).toBeVisible();
  await expect(page.getByText("Paid — excluded")).toBeVisible();
  await page.getByRole("button", { name: "Update balance" }).click();
  await page.getByLabel("Spendable cash right now").fill("100");
  await page.getByLabel("Next payday").fill(isoInDays(0));
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("heading", { name: "$0.00" })).toBeVisible();
  await expect(page.getByText(/Short by \$240\.00/)).toBeVisible();
  await expect(page.getByText(/uses one day/)).toBeVisible();
});

test("@claim:route-accessibility gives routes unique titles, focus, legal links, and a designed 404", async ({ page }) => {
  await page.getByRole("link", { name: "Privacy" }).first().click();
  await expect(page).toHaveTitle("Privacy — Today Money");
  await expect(page.getByRole("heading", { name: "Your money stays yours" })).toBeFocused();
  await page.goBack();
  await expect(page.getByRole("heading", { name: "Your demo daily amount" })).toBeFocused();
  await page.goForward();
  await expect(page.getByRole("heading", { name: "Your money stays yours" })).toBeFocused();
  await page.goto("/not-a-real-sheet");
  await expect(page).toHaveTitle("Page not found — Today Money");
  await expect(page.getByRole("heading", { name: "This page does not exist" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Return to Today Money" })).toBeVisible();
});
