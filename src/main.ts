import "./styles.css";
import { clearBudget, loadBudget, saveBudget } from "./db";
import {
  calculateBudget, currencies, defaultPayday, isBudgetState, money, newId, todayIso,
  type Bill, type BudgetState, type CurrencyCode, type Envelope,
} from "./model";
import {
  cachedLicenseState, captureLicenseFromUrl, checkoutUrl, storeLicense, verifyLicense,
  type LicenseState,
} from "./license";

const root = document.querySelector<HTMLDivElement>("#app")!;
let state: BudgetState | null = null;
let loadError = "";
let license: LicenseState = { unlocked: false, checking: false, notice: "" };
let installPrompt: BeforeInstallPromptEvent | null = null;

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const escapeHtml = (value: string): string => value.replace(/[&<>'"]/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
}[char] ?? char));

const icon = (name: "mark" | "plus" | "bill" | "shield" | "check" | "pencil" | "trash"): string => {
  const paths = {
    mark: '<circle cx="12" cy="12" r="8"/><path d="M12 2v20M2 12h20M7 17l10-10"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    bill: '<path d="M5 3h14v18l-3-2-4 2-4-2-3 2V3Z"/><path d="M8 8h8M8 12h6"/>',
    shield: '<path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-5"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    pencil: '<path d="m4 20 4-1L19 8l-3-3L5 16l-1 4ZM14 7l3 3"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"/>',
  };
  return `<svg aria-hidden="true" viewBox="0 0 24 24">${paths[name]}</svg>`;
};

function shell(content: string): string {
  return `
    <header class="site-header">
      <a class="brand" href="/" aria-label="Today Money home">
        <span class="brand-mark">${icon("mark")}</span>
        <span><strong>Today Money</strong><small>DAILY SPENDING PLAN</small></span>
      </a>
      <div class="header-tools">
        <span class="privacy-stamp">${icon("shield")} ON-DEVICE</span>
        <button class="button button-quiet install-button" type="button" data-action="install">Install app</button>
      </div>
    </header>
    ${content}
    <footer>
      <p>Your plan stays in this browser. No bank connection. No tracking.</p>
      <nav aria-label="Legal"><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a><span>Generated illustration</span></nav>
    </footer>
    <div id="toast" class="toast" role="status" aria-live="polite" hidden></div>`;
}

function loadingView(): void {
  root.innerHTML = shell(`<main id="main" class="loading-view"><p class="coordinate">SHEET 01 / LOADING</p><h1>Unrolling your plan…</h1><div class="loading-line" aria-hidden="true"></div></main>`);
}

function errorView(): void {
  root.innerHTML = shell(`<main id="main" class="empty-view"><p class="coordinate">STORAGE NOTE</p><h1>Your saved plan could not be opened.</h1><p>${escapeHtml(loadError)} Your browser may be blocking local storage.</p><button class="button button-primary" data-action="reload">Try again</button></main>`);
}

function onboardingView(): void {
  root.innerHTML = shell(`
    <main id="main" class="onboarding">
      <section class="intro-copy">
        <p class="eyebrow">A SMALL PLAN FOR ONE BIG QUESTION</p>
        <h1>What can you safely spend today?</h1>
        <p class="lede">Set aside every bill and protected pot first. Today Money divides only what is truly left until payday.</p>
        <ul class="promise-list">
          <li>${icon("check")} Works offline</li>
          <li>${icon("check")} No bank login</li>
          <li>${icon("check")} Every assumption stays visible</li>
        </ul>
        <picture class="hero-drawing">
          <source srcset="/assets/drafting-wallet.avif" type="image/avif" />
          <source srcset="/assets/drafting-wallet.webp" type="image/webp" />
          <img src="/assets/drafting-wallet.webp" width="768" height="512" fetchpriority="high" alt="Blueprint drawing of an open wallet measured with a drafting compass" />
        </picture>
      </section>
      <section class="setup-sheet" aria-labelledby="setup-title">
        <p class="coordinate">STARTING MEASUREMENTS / 01</p>
        <h2 id="setup-title">Draw your spending line</h2>
        <p>Use money you can actually spend: current accounts and cash, minus any card balance you must clear.</p>
        <form id="setup-form">
          <label for="setup-balance">Spendable cash right now</label>
          <div class="money-input"><span aria-hidden="true">#</span><input id="setup-balance" name="balance" inputmode="decimal" type="number" min="0" step="0.01" required autocomplete="off" /></div>
          <p class="field-help">Do not include your upcoming pay.</p>
          <div class="field-grid">
            <div><label for="setup-payday">Next payday</label><input id="setup-payday" name="payday" type="date" min="${todayIso()}" value="${defaultPayday()}" required /></div>
            <div><label for="setup-currency">Currency</label><select id="setup-currency" name="currency">${currencies.map((item) => `<option>${item}</option>`).join("")}</select></div>
          </div>
          <button class="button button-primary button-wide" type="submit">Make my plan <span aria-hidden="true">→</span></button>
          <p class="fine-print">This is a planning aid, not financial advice. Your entries never leave this device.</p>
        </form>
      </section>
    </main>`);
  bindCommon();
  document.querySelector<HTMLInputElement>("#setup-balance")?.focus();
  document.querySelector<HTMLFormElement>("#setup-form")?.addEventListener("submit", setupBudget);
}

function dashboardView(): void {
  if (!state) return;
  const calc = calculateBudget(state);
  const paydayPast = state.payday <= todayIso();
  const statusClass = calc.shortfall > 0 ? "is-short" : "is-safe";
  const dailyText = calc.shortfall > 0 ? money(0, state.currency) : money(calc.daily, state.currency);
  const formula = `${money(state.balance, state.currency)} cash − ${money(calc.obligations, state.currency)} bills − ${money(calc.protectedTotal, state.currency)} protected ÷ ${calc.days} ${calc.days === 1 ? "day" : "days"}`;
  root.innerHTML = shell(`
    <main id="main" class="workspace">
      <div class="page-heading">
        <div><p class="coordinate">PLAN UPDATED ${formatDateTime(state.updatedAt).toUpperCase()}</p><h1>Your spending line</h1></div>
        <button class="button button-outline" type="button" data-action="edit-plan">${icon("pencil")} Update balance</button>
      </div>
      ${paydayPast ? `<div class="notice notice-warning" role="alert"><strong>Payday needs updating.</strong> Your saved date is today or earlier, so this plan uses one day. <button class="text-button" data-action="edit-plan">Update it now</button></div>` : ""}
      <div class="plan-grid">
        <section class="result-zone ${statusClass}" aria-labelledby="today-result">
          <div class="result-copy">
            <p class="eyebrow">SAFE TO SPEND TODAY</p>
            <h2 id="today-result" class="daily-amount">${dailyText}</h2>
            ${calc.shortfall > 0
              ? `<p class="result-message"><strong>Short by ${money(calc.shortfall, state.currency)}</strong> before payday. Reduce protected money, delay an obligation if appropriate, or add funds.</p>`
              : `<p class="result-message">per day for the next <strong>${calc.days} ${calc.days === 1 ? "day" : "days"}</strong>, without touching the money below.</p>`}
            <details class="formula"><summary>Show the working</summary><p>${formula}</p><p>Payday itself is not counted as a spending day. Unpaid and overdue bills stay included until marked paid.</p></details>
          </div>
          <picture class="result-illustration">
            <source srcset="/assets/drafting-wallet.avif" type="image/avif" />
            <source srcset="/assets/drafting-wallet.webp" type="image/webp" />
            <img src="/assets/drafting-wallet.webp" width="768" height="512" alt="Blueprint drawing of an open wallet measured with a drafting compass" />
          </picture>
          <div class="measurements" aria-label="Plan totals">
            <div><span>Current cash</span><strong>${money(state.balance, state.currency)}</strong></div>
            <div><span>Bills by payday</span><strong>− ${money(calc.obligations, state.currency)}</strong></div>
            <div><span>Protected</span><strong>− ${money(calc.protectedTotal, state.currency)}</strong></div>
            <div class="remainder"><span>Left to divide</span><strong>${money(calc.available, state.currency)}</strong></div>
          </div>
        </section>

        <aside class="decision-zone" aria-labelledby="purchase-title">
          <p class="coordinate">QUICK CHECK / 02</p>
          <h2 id="purchase-title">Can I buy this?</h2>
          <p>Test a purchase without changing your plan.</p>
          <label for="purchase-amount">Purchase amount</label>
          <div class="money-input"><span aria-hidden="true">#</span><input id="purchase-amount" inputmode="decimal" type="number" min="0" step="0.01" /></div>
          <div id="purchase-answer" class="purchase-answer" aria-live="polite"><span class="answer-mark">?</span><p>Enter an amount to check it against the plan.</p></div>
        </aside>
      </div>

      <section class="schedule-section" aria-labelledby="bills-title">
        <div class="section-heading"><div><p class="coordinate">OBLIGATIONS / 03</p><h2 id="bills-title">Bills before payday</h2><p>Only unpaid bills due on or before ${formatDate(state.payday)} reduce the daily amount.</p></div><button class="button button-outline" data-action="add-bill">${icon("plus")} Add bill</button></div>
        ${renderBills(state.bills, state.currency, state.payday)}
      </section>

      <section class="schedule-section" aria-labelledby="envelopes-title">
        <div class="section-heading"><div><p class="coordinate">PROTECTED MONEY / 04</p><h2 id="envelopes-title">Do not spend</h2><p>Keep emergency money, savings, and other protected pots outside the daily calculation.</p></div><button class="button button-outline" data-action="add-envelope">${icon("plus")} Protect money</button></div>
        ${renderEnvelopes(state.envelopes, state.currency)}
      </section>

      <section class="records-section" aria-labelledby="records-title">
        <div><p class="coordinate">OWN YOUR DATA / 05</p><h2 id="records-title">Plan records</h2><p>Everything is stored locally. Export a readable copy whenever you like.</p></div>
        <div class="record-actions">
          <button class="button button-outline" data-action="export-json">Export JSON</button>
          <button class="button button-outline" data-action="export-csv">Export CSV</button>
          <label class="button button-outline file-button">Import JSON<input id="import-json" type="file" accept="application/json,.json" /></label>
        </div>
        ${renderHistory(state)}
      </section>

      ${renderPlus()}

      <section class="danger-zone" aria-labelledby="reset-title"><div><h2 id="reset-title">Start over</h2><p>Erase this plan and all balance history from this browser.</p></div><button class="button button-danger" data-action="reset">Erase local plan</button></section>
    </main>`);
  bindDashboard();
}

function renderBills(bills: Bill[], currency: CurrencyCode, payday: string): string {
  if (!bills.length) return `<div class="empty-row"><span class="empty-icon">${icon("bill")}</span><div><strong>No bills listed yet</strong><p>Add rent, subscriptions, repayments, or anything else that must be paid first.</p></div><button class="text-button" data-action="add-bill">Add the first bill</button></div>`;
  return `<ul class="item-list">${[...bills].sort((a, b) => a.dueDate.localeCompare(b.dueDate)).map((bill) => {
    const excluded = bill.paid || bill.dueDate > payday;
    const timing = bill.paid ? "Paid — excluded" : bill.dueDate < todayIso() ? "Overdue — included" : bill.dueDate > payday ? "After payday — excluded" : `Due ${formatDate(bill.dueDate)}`;
    return `<li class="plan-item ${excluded ? "is-excluded" : ""}"><button class="check-button" data-action="toggle-bill" data-id="${bill.id}" aria-label="Mark ${escapeHtml(bill.name)} ${bill.paid ? "unpaid" : "paid"}" aria-pressed="${bill.paid}">${bill.paid ? icon("check") : ""}</button><div class="item-copy"><strong>${escapeHtml(bill.name)}</strong><span>${timing}</span></div><strong class="item-amount">${money(bill.amount, currency)}</strong><div class="item-actions"><button data-action="edit-bill" data-id="${bill.id}" aria-label="Edit ${escapeHtml(bill.name)}">${icon("pencil")}</button><button data-action="delete-bill" data-id="${bill.id}" aria-label="Delete ${escapeHtml(bill.name)}">${icon("trash")}</button></div></li>`;
  }).join("")}</ul>`;
}

function renderEnvelopes(envelopes: Envelope[], currency: CurrencyCode): string {
  if (!envelopes.length) return `<div class="empty-row"><span class="empty-icon">${icon("shield")}</span><div><strong>No protected money yet</strong><p>Add an emergency buffer or savings pot you do not want counted as spendable.</p></div><button class="text-button" data-action="add-envelope">Protect some money</button></div>`;
  return `<ul class="item-list">${envelopes.map((item) => `<li class="plan-item"><span class="static-icon">${icon("shield")}</span><div class="item-copy"><strong>${escapeHtml(item.name)}</strong><span>Always protected</span></div><strong class="item-amount">${money(item.amount, currency)}</strong><div class="item-actions"><button data-action="edit-envelope" data-id="${item.id}" aria-label="Edit ${escapeHtml(item.name)}">${icon("pencil")}</button><button data-action="delete-envelope" data-id="${item.id}" aria-label="Delete ${escapeHtml(item.name)}">${icon("trash")}</button></div></li>`).join("")}</ul>`;
}

function renderHistory(current: BudgetState): string {
  if (!current.history.length) return `<p class="history-empty">Balance changes will appear here.</p>`;
  return `<details class="history"><summary>Balance history (${current.history.length})</summary><ol>${current.history.slice(0, 12).map((entry) => `<li><time datetime="${entry.at}">${formatDateTime(entry.at)}</time><strong>${money(entry.balance, current.currency)}</strong></li>`).join("")}</ol></details>`;
}

function renderPlus(): string {
  if (license.unlocked) return `<section class="plus-section is-unlocked" aria-labelledby="plus-title"><div class="plus-heading"><span class="plus-badge">PLUS UNLOCKED</span><h2 id="plus-title">Encrypted portable backup</h2><p>Create a password-protected copy for another device. We never receive the file or password.</p></div><div class="backup-grid"><form id="encrypt-form"><label for="backup-password">Backup password <span>8+ characters</span></label><input id="backup-password" name="password" type="password" minlength="8" required autocomplete="new-password" /><button class="button button-primary" type="submit">Download encrypted backup</button></form><form id="decrypt-form"><label for="restore-password">Restore password</label><input id="restore-password" name="password" type="password" minlength="8" required autocomplete="current-password" /><label class="button button-outline file-button">Choose encrypted backup<input id="encrypted-file" type="file" accept="application/json,.tmbackup" required /></label><button class="button button-outline" type="submit">Restore encrypted backup</button></form></div><p class="license-note">${license.notice || "License verified for this device."}</p></section>`;
  return `<section class="plus-section" aria-labelledby="plus-title"><div class="plus-heading"><span class="plus-badge">ONE-TIME UNLOCK</span><h2 id="plus-title">Take an encrypted copy with you</h2><p><strong>Today Money Plus — US$12 once.</strong> Unlock password-protected backup and restore across your own devices. The complete daily plan and normal JSON/CSV exports stay free.</p></div><div class="plus-actions"><a class="button button-primary" href="${checkoutUrl()}">Buy Plus — $12 once</a><form id="license-form"><label for="license-token">Have a license? Paste it here</label><div class="inline-form"><input id="license-token" name="license" type="text" required autocomplete="off" spellcheck="false" /><button class="button button-outline" type="submit">Verify license</button></div></form></div><p class="license-note">${license.checking ? "Checking license…" : escapeHtml(license.notice)} Sociobot/Dodo is the merchant of record. <a href="/terms/">Refund terms</a>.</p></section>`;
}

function bindCommon(): void {
  document.querySelectorAll<HTMLElement>("[data-action='install']").forEach((button) => button.addEventListener("click", installApp));
  document.querySelectorAll<HTMLElement>("[data-action='reload']").forEach((button) => button.addEventListener("click", () => location.reload()));
}

function bindDashboard(): void {
  bindCommon();
  document.querySelector<HTMLInputElement>("#purchase-amount")?.addEventListener("input", updatePurchaseAnswer);
  root.querySelectorAll<HTMLElement>("[data-action]").forEach((button) => button.addEventListener("click", handleAction));
  document.querySelector<HTMLInputElement>("#import-json")?.addEventListener("change", importJson);
  document.querySelector<HTMLFormElement>("#license-form")?.addEventListener("submit", restoreLicense);
  document.querySelector<HTMLFormElement>("#encrypt-form")?.addEventListener("submit", encryptBackup);
  document.querySelector<HTMLFormElement>("#decrypt-form")?.addEventListener("submit", decryptBackup);
}

async function setupBudget(event: SubmitEvent): Promise<void> {
  event.preventDefault();
  const data = new FormData(event.currentTarget as HTMLFormElement);
  const balance = Number(data.get("balance"));
  const payday = String(data.get("payday"));
  if (!Number.isFinite(balance) || balance < 0 || payday < todayIso()) return showToast("Enter a valid balance and a future payday.", "error");
  const now = new Date().toISOString();
  state = { version: 1, balance, payday, currency: data.get("currency") as CurrencyCode, bills: [], envelopes: [], history: [{ id: newId(), at: now, balance }], updatedAt: now };
  await persist("Plan started on this device.");
}

function handleAction(event: Event): void {
  const button = event.currentTarget as HTMLElement;
  const action = button.dataset.action;
  const id = button.dataset.id;
  if (action === "install") return;
  if (action === "edit-plan") openPlanDialog();
  if (action === "add-bill") openBillDialog();
  if (action === "edit-bill" && id) openBillDialog(id);
  if (action === "toggle-bill" && id) toggleBill(id);
  if (action === "delete-bill" && id) deleteBill(id);
  if (action === "add-envelope") openEnvelopeDialog();
  if (action === "edit-envelope" && id) openEnvelopeDialog(id);
  if (action === "delete-envelope" && id) deleteEnvelope(id);
  if (action === "export-json") exportJson();
  if (action === "export-csv") exportCsv();
  if (action === "reset") resetPlan();
}

function openDialog(title: string, body: string, onSubmit: (form: HTMLFormElement) => void): void {
  const previous = document.activeElement as HTMLElement | null;
  const dialog = document.createElement("dialog");
  dialog.className = "edit-dialog";
  dialog.innerHTML = `<form method="dialog" class="dialog-shell"><div class="dialog-heading"><p class="coordinate">PLAN DETAIL</p><h2>${title}</h2><button class="close-button" value="cancel" aria-label="Close">×</button></div>${body}<div class="dialog-actions"><button class="button button-quiet" value="cancel">Cancel</button><button class="button button-primary" type="submit" value="save">Save changes</button></div></form>`;
  document.body.append(dialog);
  const form = dialog.querySelector<HTMLFormElement>("form")!;
  form.addEventListener("submit", (event) => {
    const submitter = (event as SubmitEvent).submitter as HTMLButtonElement | null;
    if (submitter?.value === "cancel") return;
    event.preventDefault();
    if (form.reportValidity()) onSubmit(form);
  });
  dialog.addEventListener("close", () => { dialog.remove(); previous?.focus(); });
  dialog.showModal();
  dialog.querySelector<HTMLElement>("input, select")?.focus();
}

function openPlanDialog(): void {
  if (!state) return;
  openDialog("Update the plan", `<label for="plan-balance">Spendable cash right now</label><input id="plan-balance" name="balance" type="number" inputmode="decimal" min="0" step="0.01" value="${state.balance}" required /><label for="plan-payday">Next payday</label><input id="plan-payday" name="payday" type="date" min="${todayIso()}" value="${state.payday}" required /><label for="plan-currency">Currency</label><select id="plan-currency" name="currency">${currencies.map((item) => `<option ${item === state?.currency ? "selected" : ""}>${item}</option>`).join("")}</select>`, async (form) => {
    if (!state) return;
    const data = new FormData(form); const balance = Number(data.get("balance"));
    if (balance !== state.balance) state.history = [{ id: newId(), at: new Date().toISOString(), balance }, ...state.history].slice(0, 100);
    state.balance = balance; state.payday = String(data.get("payday")); state.currency = data.get("currency") as CurrencyCode;
    form.closest("dialog")?.close(); await persist("Balance and payday updated.");
  });
}

function openBillDialog(id?: string): void {
  if (!state) return;
  const bill = state.bills.find((item) => item.id === id);
  openDialog(bill ? "Edit bill" : "Add a bill", `<label for="bill-name">Bill name</label><input id="bill-name" name="name" maxlength="60" value="${escapeHtml(bill?.name ?? "")}" required /><label for="bill-amount">Amount</label><input id="bill-amount" name="amount" type="number" inputmode="decimal" min="0.01" step="0.01" value="${bill?.amount ?? ""}" required /><label for="bill-date">Due date</label><input id="bill-date" name="date" type="date" value="${bill?.dueDate ?? state.payday}" required />`, async (form) => {
    if (!state) return; const data = new FormData(form); const amount = Number(data.get("amount"));
    if (bill) Object.assign(bill, { name: String(data.get("name")).trim(), amount, dueDate: String(data.get("date")) });
    else state.bills.push({ id: newId(), name: String(data.get("name")).trim(), amount, dueDate: String(data.get("date")), paid: false });
    form.closest("dialog")?.close(); await persist(bill ? "Bill updated." : "Bill added to the plan.");
  });
}

function openEnvelopeDialog(id?: string): void {
  if (!state) return;
  const envelope = state.envelopes.find((item) => item.id === id);
  openDialog(envelope ? "Edit protected money" : "Protect money", `<label for="envelope-name">Name</label><input id="envelope-name" name="name" maxlength="60" value="${escapeHtml(envelope?.name ?? "")}" required /><label for="envelope-amount">Amount to protect</label><input id="envelope-amount" name="amount" type="number" inputmode="decimal" min="0.01" step="0.01" value="${envelope?.amount ?? ""}" required />`, async (form) => {
    if (!state) return; const data = new FormData(form); const amount = Number(data.get("amount"));
    if (envelope) Object.assign(envelope, { name: String(data.get("name")).trim(), amount });
    else state.envelopes.push({ id: newId(), name: String(data.get("name")).trim(), amount });
    form.closest("dialog")?.close(); await persist(envelope ? "Protected amount updated." : "Money protected from daily spending.");
  });
}

async function toggleBill(id: string): Promise<void> { if (!state) return; const bill = state.bills.find((item) => item.id === id); if (!bill) return; bill.paid = !bill.paid; await persist(bill.paid ? `${bill.name} marked paid.` : `${bill.name} returned to the plan.`); }
async function deleteBill(id: string): Promise<void> { if (!state) return; const bill = state.bills.find((item) => item.id === id); if (!bill || !confirm(`Delete “${bill.name}” from this plan?`)) return; state.bills = state.bills.filter((item) => item.id !== id); await persist(`${bill.name} deleted.`); }
async function deleteEnvelope(id: string): Promise<void> { if (!state) return; const item = state.envelopes.find((entry) => entry.id === id); if (!item || !confirm(`Stop protecting “${item.name}”?`)) return; state.envelopes = state.envelopes.filter((entry) => entry.id !== id); await persist(`${item.name} removed.`); }

function updatePurchaseAnswer(): void {
  if (!state) return;
  const input = document.querySelector<HTMLInputElement>("#purchase-amount")!;
  const output = document.querySelector<HTMLDivElement>("#purchase-answer")!;
  const amount = Number(input.value); const calc = calculateBudget(state);
  if (!input.value || !Number.isFinite(amount) || amount < 0) { output.className = "purchase-answer"; output.innerHTML = `<span class="answer-mark">?</span><p>Enter an amount to check it against the plan.</p>`; return; }
  const remaining = calc.available - amount; const revised = Math.max(0, remaining / calc.days);
  if (amount <= calc.available) {
    const pace = amount <= calc.daily ? "It is within today’s daily amount." : `It fits the protected-bills plan, but is above today’s ${money(calc.daily, state.currency)} pace.`;
    output.className = "purchase-answer answer-yes"; output.innerHTML = `<span class="answer-mark">${icon("check")}</span><p><strong>Yes, it fits.</strong> ${pace} You would have ${money(Math.max(0, remaining), state.currency)} left, or ${money(revised, state.currency)} per day.</p>`;
  } else {
    output.className = "purchase-answer answer-no"; output.innerHTML = `<span class="answer-mark">×</span><p><strong>Not without crossing the line.</strong> It is ${money(amount - calc.available, state.currency)} more than the unprotected money left before payday.</p>`;
  }
}

async function persist(message: string): Promise<void> {
  if (!state) return;
  state.updatedAt = new Date().toISOString();
  try { await saveBudget(state); dashboardView(); showToast(message); }
  catch (error) { showToast(error instanceof Error ? error.message : "Your change could not be saved.", "error"); }
}

function download(content: BlobPart, filename: string, type: string): void {
  const url = URL.createObjectURL(new Blob([content], { type })); const link = document.createElement("a");
  link.href = url; link.download = filename; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function exportJson(): void { if (state) download(JSON.stringify(state, null, 2), `today-money-${todayIso()}.json`, "application/json"); }
function csvCell(value: string | number): string { return `"${String(value).replaceAll('"', '""')}"`; }
function exportCsv(): void {
  if (!state) return;
  const rows = [["type", "name", "amount", "date/status"], ["balance", "Current cash", state.balance, state.updatedAt], ...state.bills.map((item) => ["bill", item.name, item.amount, item.paid ? "paid" : item.dueDate]), ...state.envelopes.map((item) => ["protected", item.name, item.amount, "protected"])];
  download(rows.map((row) => row.map(csvCell).join(",")).join("\n"), `today-money-${todayIso()}.csv`, "text/csv");
}

async function importJson(event: Event): Promise<void> {
  const file = (event.currentTarget as HTMLInputElement).files?.[0]; if (!file) return;
  try {
    const imported: unknown = JSON.parse(await file.text());
    if (!isBudgetState(imported)) throw new Error("That file is not a valid Today Money plan.");
    if (!confirm("Replace the plan on this device with the imported plan?")) return;
    state = imported; await persist("Imported plan saved on this device.");
  } catch (error) { showToast(error instanceof Error ? error.message : "The import could not be read.", "error"); }
}

function bytesToBase64(bytes: Uint8Array): string { return btoa(String.fromCharCode(...bytes)); }
function base64ToBytes(value: string): Uint8Array { return Uint8Array.from(atob(value), (char) => char.charCodeAt(0)); }
async function deriveKey(password: string, salt: Uint8Array, usage: KeyUsage[]): Promise<CryptoKey> {
  const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey({ name: "PBKDF2", salt: salt as BufferSource, iterations: 250_000, hash: "SHA-256" }, material, { name: "AES-GCM", length: 256 }, false, usage);
}
async function encryptBackup(event: SubmitEvent): Promise<void> {
  event.preventDefault(); if (!state || !license.unlocked) return;
  const password = String(new FormData(event.currentTarget as HTMLFormElement).get("password"));
  try { const salt = crypto.getRandomValues(new Uint8Array(16)); const iv = crypto.getRandomValues(new Uint8Array(12)); const key = await deriveKey(password, salt, ["encrypt"]); const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(JSON.stringify(state))); download(JSON.stringify({ format: "today-money-encrypted-v1", salt: bytesToBase64(salt), iv: bytesToBase64(iv), data: bytesToBase64(new Uint8Array(cipher)) }), `today-money-${todayIso()}.tmbackup`, "application/json"); showToast("Encrypted backup downloaded."); }
  catch { showToast("The encrypted backup could not be created.", "error"); }
}
async function decryptBackup(event: SubmitEvent): Promise<void> {
  event.preventDefault(); if (!license.unlocked) return;
  const form = event.currentTarget as HTMLFormElement; const password = String(new FormData(form).get("password")); const file = form.querySelector<HTMLInputElement>("#encrypted-file")?.files?.[0];
  if (!file) return showToast("Choose an encrypted backup first.", "error");
  try { const packed = JSON.parse(await file.text()) as { format: string; salt: string; iv: string; data: string }; if (packed.format !== "today-money-encrypted-v1") throw new Error(); const salt = base64ToBytes(packed.salt); const iv = base64ToBytes(packed.iv); const key = await deriveKey(password, salt, ["decrypt"]); const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: iv as BufferSource }, key, base64ToBytes(packed.data) as BufferSource); const restored: unknown = JSON.parse(new TextDecoder().decode(plain)); if (!isBudgetState(restored)) throw new Error(); if (!confirm("Replace the current plan with this encrypted backup?")) return; state = restored; await persist("Encrypted backup restored."); }
  catch { showToast("Could not unlock that backup. Check the file and password.", "error"); }
}

async function restoreLicense(event: SubmitEvent): Promise<void> {
  event.preventDefault(); const token = String(new FormData(event.currentTarget as HTMLFormElement).get("license")).trim(); if (!token) return;
  storeLicense(token); license = { unlocked: false, checking: true, notice: "" }; dashboardView(); license = await verifyLicense(true); dashboardView(); showToast(license.notice || "License checked.", license.unlocked ? "success" : "error");
}

async function resetPlan(): Promise<void> { if (!confirm("Erase this plan, every bill, protected pot, and balance record from this browser? This cannot be undone.")) return; try { await clearBudget(); state = null; onboardingView(); showToast("Local plan erased."); } catch { showToast("The plan could not be erased.", "error"); } }

function formatDate(value: string): string { return new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`)); }
function formatDateTime(value: string): string { return new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }).format(new Date(value)); }
function showToast(message: string, type: "success" | "error" = "success", action?: string): void { const toast = document.querySelector<HTMLDivElement>("#toast"); if (!toast) return; toast.className = `toast toast-${type}`; toast.innerHTML = `<span>${escapeHtml(message)}</span>${action ?? ""}`; toast.hidden = false; if (!action) setTimeout(() => { toast.hidden = true; }, 3600); }

async function installApp(): Promise<void> { if (!installPrompt) return showToast("Use your browser menu and choose “Install app” or “Add to Home Screen”."); await installPrompt.prompt(); await installPrompt.userChoice; installPrompt = null; document.querySelectorAll<HTMLElement>(".install-button").forEach((button) => { button.hidden = true; }); }

function bindConnectivity(): void {
  window.addEventListener("online", () => showToast("Back online. Your plan stayed on this device."));
  window.addEventListener("offline", () => showToast("Offline — the full plan still works."));
  window.addEventListener("beforeinstallprompt", (event) => { event.preventDefault(); installPrompt = event as BeforeInstallPromptEvent; });
}

async function registerServiceWorker(): Promise<void> {
  if (!("serviceWorker" in navigator) || import.meta.env.DEV) return;
  const hadController = Boolean(navigator.serviceWorker.controller);
  const registration = await navigator.serviceWorker.register("/sw.js");
  if (registration.waiting) showUpdate(registration);
  registration.addEventListener("updatefound", () => registration.installing?.addEventListener("statechange", () => { if (registration.waiting && navigator.serviceWorker.controller) showUpdate(registration); }));
  let refreshing = false; navigator.serviceWorker.addEventListener("controllerchange", () => { if (hadController && !refreshing) { refreshing = true; location.reload(); } });
}
function showUpdate(registration: ServiceWorkerRegistration): void { showToast("A fresh drawing is ready.", "success", `<button id="apply-update" class="text-button">Update now</button>`); document.querySelector("#apply-update")?.addEventListener("click", () => registration.waiting?.postMessage({ type: "SKIP_WAITING" })); }

function scheduleServiceWorker(): void {
  let started = false;
  let timer = 0;
  const register = () => {
    if (started) return;
    started = true;
    window.clearTimeout(timer);
    registerServiceWorker().catch(() => showToast("Offline setup is temporarily unavailable.", "error"));
  };
  const arm = () => {
    timer = window.setTimeout(register, 30_000);
    window.addEventListener("pointerdown", register, { once: true, passive: true });
    window.addEventListener("keydown", register, { once: true });
  };
  if (document.readyState === "complete") arm();
  else window.addEventListener("load", arm, { once: true });
}

async function init(): Promise<void> {
  bindConnectivity(); captureLicenseFromUrl(); license = cachedLicenseState();
  onboardingView();
  let initializing = true;
  const loadingTimer = window.setTimeout(() => { if (initializing) loadingView(); }, 1000);
  try { state = await loadBudget(); initializing = false; window.clearTimeout(loadingTimer); if (state && !isBudgetState(state)) throw new Error("The saved data format is not recognized."); if (state) dashboardView(); else if (document.querySelector(".loading-view")) onboardingView(); }
  catch (error) { initializing = false; window.clearTimeout(loadingTimer); loadError = error instanceof Error ? error.message : "Unknown storage error."; errorView(); }
  scheduleServiceWorker();
  if (localStorage.getItem("sb_license:daily-safe-to-spend")) { license = await verifyLicense(); if (state) dashboardView(); }
}

init();
