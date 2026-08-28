export type CurrencyCode = "USD" | "GBP" | "EUR" | "CAD" | "AUD" | "INR" | "JPY";

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  paid: boolean;
}

export interface Envelope {
  id: string;
  name: string;
  amount: number;
}

export interface BalanceSnapshot {
  id: string;
  at: string;
  balance: number;
}

export interface BudgetState {
  version: 1;
  balance: number;
  payday: string;
  currency: CurrencyCode;
  bills: Bill[];
  envelopes: Envelope[];
  history: BalanceSnapshot[];
  updatedAt: string;
}

export interface Calculation {
  days: number;
  obligations: number;
  protectedTotal: number;
  available: number;
  daily: number;
  shortfall: number;
  includedBills: Bill[];
}

export const currencies: CurrencyCode[] = ["USD", "GBP", "EUR", "CAD", "AUD", "INR", "JPY"];

export function todayIso(now = new Date()): string {
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

export function defaultPayday(now = new Date()): string {
  const next = new Date(now);
  next.setDate(next.getDate() + 14);
  return todayIso(next);
}

export function daysUntilPayday(payday: string, today = todayIso()): number {
  const start = Date.parse(`${today}T00:00:00Z`);
  const end = Date.parse(`${payday}T00:00:00Z`);
  if (!Number.isFinite(end) || end <= start) return 1;
  return Math.max(1, Math.round((end - start) / 86_400_000));
}

export function calculateBudget(state: BudgetState, today = todayIso()): Calculation {
  const includedBills = state.bills.filter((bill) => !bill.paid && bill.dueDate <= state.payday);
  const obligations = includedBills.reduce((sum, bill) => sum + bill.amount, 0);
  const protectedTotal = state.envelopes.reduce((sum, item) => sum + item.amount, 0);
  const available = state.balance - obligations - protectedTotal;
  const days = daysUntilPayday(state.payday, today);
  return {
    days,
    obligations,
    protectedTotal,
    available,
    daily: Math.max(0, available / days),
    shortfall: Math.max(0, -available),
    includedBills,
  };
}

export function money(value: number, currency: CurrencyCode): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "JPY" ? 0 : 2,
  }).format(value);
}

export function newId(): string {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
}

/** Accept only real Gregorian calendar dates in the app's YYYY-MM-DD format. */
function isCalendarDate(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

/**
 * JSON exports use Date#toISOString(). Keep imports to that unambiguous UTC
 * representation so a corrupted timestamp cannot reach date formatting later.
 */
function isIsoTimestamp(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) return false;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) && date.toISOString() === value;
}

export function isBudgetState(value: unknown): value is BudgetState {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<BudgetState>;
  const validMoney = (amount: unknown): amount is number => typeof amount === "number" && Number.isFinite(amount) && amount >= 0;
  return item.version === 1 && validMoney(item.balance) && isCalendarDate(item.payday) &&
    currencies.includes(item.currency as CurrencyCode) && Array.isArray(item.bills) &&
    item.bills.every((bill) => bill && typeof bill.id === "string" && typeof bill.name === "string" && validMoney(bill.amount) && isCalendarDate(bill.dueDate) && typeof bill.paid === "boolean") &&
    Array.isArray(item.envelopes) && item.envelopes.every((envelope) => envelope && typeof envelope.id === "string" && typeof envelope.name === "string" && validMoney(envelope.amount)) &&
    Array.isArray(item.history) && item.history.every((entry) => entry && typeof entry.id === "string" && isIsoTimestamp(entry.at) && validMoney(entry.balance)) &&
    isIsoTimestamp(item.updatedAt);
}
