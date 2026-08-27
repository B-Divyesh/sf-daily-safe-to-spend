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
  await page.getByRole("button", { name: "Make my plan" }).click();

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
  await page.getByRole("button", { name: "Make my plan" }).click();
  await expect(page.getByRole("heading", { name: "Your spending line" })).toBeVisible();
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole("heading", { name: "Your spending line" })).toBeVisible();
  await expect(page.getByText(/\$60\.00/).first()).toBeVisible();
});

test("landing and legal pages have accessible document structure", async ({ page }) => {
  let results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((item) => ["serious", "critical"].includes(item.impact ?? ""))).toEqual([]);
  for (const path of ["/privacy/", "/terms/"]) {
    await page.goto(path);
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveCount(1);
    results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((item) => ["serious", "critical"].includes(item.impact ?? ""))).toEqual([]);
  }
});

test("Plus encrypted backup restores the original local plan", async ({ page }) => {
  await page.getByLabel("Spendable cash right now").fill("700");
  await page.getByLabel("Next payday").fill(isoInDays(7));
  await page.getByRole("button", { name: "Make my plan" }).click();
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
