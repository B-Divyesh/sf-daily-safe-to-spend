import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

function isoInDays(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}

const consoleErrors = new WeakMap<Page, string[]>();

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  consoleErrors.set(page, errors);
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page.evaluate(async () => {
    localStorage.clear();
    await new Promise<void>((resolve) => {
      const request = indexedDB.deleteDatabase("today-money");
      request.onsuccess = () => resolve();
      request.onerror = () => resolve();
      request.onblocked = () => resolve();
    });
  });
  await page.reload();
});

test.afterEach(async ({ page }) => {
  expect(consoleErrors.get(page) ?? []).toEqual([]);
});

test("builds a conservative plan and checks a purchase", async ({ page }) => {
  await page.getByLabel("Spendable cash right now").fill("1000");
  await page.getByLabel("Next payday").fill(isoInDays(10));
  await page.getByRole("button", { name: "Show my daily amount" }).click();

  await page.getByRole("button", { name: "Add bill" }).first().click();
  await page.getByLabel("Bill name").fill("Rent");
  await page.getByLabel("Amount", { exact: true }).fill("300");
  await page.getByLabel("Due date").fill(isoInDays(3));
  await page.getByRole("button", { name: "Save changes" }).click();

  await page.getByRole("button", { name: "Protect money" }).first().click();
  await page.getByLabel("Name").fill("Emergency buffer");
  await page.getByLabel("Amount to protect").fill("200");
  await page.getByRole("button", { name: "Save changes" }).click();

  await expect(page.getByText(/\$50\.00/).first()).toBeVisible();
  await page.getByLabel("Purchase amount").fill("75");
  await expect(page.getByText("Yes, it fits.")).toBeVisible();
  await expect(page.getByText(/above today’s \$50\.00 pace/)).toBeVisible();

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((item) => ["serious", "critical"].includes(item.impact ?? ""))).toEqual([]);
});

test("saved plan reloads while offline", async ({ page, context }) => {
  await page.getByLabel("Spendable cash right now").fill("420");
  await page.getByLabel("Next payday").fill(isoInDays(7));
  await page.getByRole("button", { name: "Show my daily amount" }).click();
  await expect(page.getByRole("heading", { name: "Your daily amount" })).toBeVisible();
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole("heading", { name: "Your daily amount" })).toBeVisible();
  await expect(page.getByText(/\$60\.00/).first()).toBeVisible();
});

test("rejects semantic-date imports without replacing the saved local plan", async ({ page }) => {
  await page.getByLabel("Spendable cash right now").fill("50");
  await page.getByLabel("Next payday").fill(isoInDays(10));
  await page.getByRole("button", { name: "Show my daily amount" }).click();
  await expect(page.locator(".measurements").getByText("$50.00", { exact: true }).first()).toBeVisible();

  let destructiveConfirmationShown = false;
  page.on("dialog", (dialog) => {
    destructiveConfirmationShown = true;
    void dialog.dismiss();
  });
  await page.locator("#import-json").setInputFiles({
    name: "invalid-calendar-plan.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify({
      version: 1,
      balance: 10,
      payday: "2026-13-01",
      currency: "USD",
      bills: [],
      envelopes: [],
      history: [],
      updatedAt: "not-a-date",
    })),
  });

  await expect(page.getByText("That file is not a valid Today Money plan.")).toBeVisible();
  expect(destructiveConfirmationShown).toBe(false);
  await page.reload();
  await expect(page.getByRole("heading", { name: "Your daily amount" })).toBeVisible();
  await expect(page.locator(".measurements").getByText("$50.00", { exact: true }).first()).toBeVisible();
});

test("offers a reset route for a legacy unreadable local plan", async ({ page }) => {
  await page.evaluate(async () => {
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.open("today-money", 1);
      request.onupgradeneeded = () => request.result.createObjectStore("budget");
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction("budget", "readwrite");
        transaction.objectStore("budget").put({
          version: 1, balance: 10, payday: "2026-13-01", currency: "USD",
          bills: [], envelopes: [], history: [], updatedAt: "not-a-date",
        }, "current");
        transaction.oncomplete = () => { db.close(); resolve(); };
        transaction.onerror = () => reject(transaction.error);
      };
    });
  });
  await page.reload();
  await expect(page.getByRole("heading", { name: "Your saved plan could not be opened." })).toBeVisible();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Clear this unreadable plan" }).click();
  await expect(page.getByRole("heading", { name: "See what you can spend today" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "See what you can spend today" })).toBeVisible();
});

test("keyboard opens and closes a plan dialog without losing focus", async ({ page }) => {
  await page.getByLabel("Spendable cash right now").fill("100");
  await page.getByLabel("Next payday").fill(isoInDays(7));
  await page.getByRole("button", { name: "Show my daily amount" }).click();

  const addBill = page.getByRole("button", { name: "Add bill" }).first();
  await addBill.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByLabel("Bill name")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(addBill).toBeFocused();
});

test("landing and legal pages have accessible document structure", async ({ page }) => {
  let results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((item) => ["serious", "critical"].includes(item.impact ?? ""))).toEqual([]);
  for (const path of ["/demo", "/privacy/", "/terms/", "/missing-sheet"]) {
    await page.goto(path);
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveCount(1);
    results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((item) => ["serious", "critical"].includes(item.impact ?? ""))).toEqual([]);
  }
});

test("reduced motion, 200 percent text, and 390px layout keep the core controls usable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/demo");
  const motion = await page.locator(".daily-amount").evaluate((element) => Number.parseFloat(getComputedStyle(element, "::after").animationDuration));
  expect(motion).toBeLessThan(0.001);
  await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
  await expect(page.getByRole("button", { name: "Update balance" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Add bill" }).first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
});

test("Plus encrypted backup restores the original local plan", async ({ page }) => {
  await page.getByLabel("Spendable cash right now").fill("700");
  await page.getByLabel("Next payday").fill(isoInDays(7));
  await page.getByRole("button", { name: "Show my daily amount" }).click();
  await page.evaluate(() => {
    localStorage.setItem("sb_license:daily-safe-to-spend", "local-test-license");
    localStorage.setItem("sb_license:daily-safe-to-spend:verdict", JSON.stringify({ valid: true, checkedAt: Date.now() }));
  });
  await page.reload();
  await expect(page.getByText("PLUS UNLOCKED")).toBeVisible();

  await page.getByLabel("Backup password").fill("correct-horse");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download encrypted backup" }).click();
  const download = await downloadPromise;
  const backupPath = await download.path();
  expect(backupPath).not.toBeNull();

  await page.getByRole("button", { name: "Update balance" }).click();
  await page.getByLabel("Spendable cash right now").fill("100");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.locator(".measurements").getByText(/\$100\.00/).first()).toBeVisible();

  await page.getByLabel("Restore password").fill("correct-horse");
  await page.locator("#encrypted-file").setInputFiles(backupPath!);
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Restore encrypted backup" }).click();
  await expect(page.locator(".measurements").getByText(/\$700\.00/).first()).toBeVisible();
});
