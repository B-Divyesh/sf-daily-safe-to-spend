import { describe, expect, it } from "vitest";
import { calculateBudget, daysUntilPayday, isBudgetState, type BudgetState } from "./model";

const plan: BudgetState = {
  version: 1,
  balance: 1000,
  payday: "2026-09-06",
  currency: "USD",
  bills: [
    { id: "rent", name: "Rent", amount: 300, dueDate: "2026-09-01", paid: false },
    { id: "later", name: "Later", amount: 90, dueDate: "2026-09-12", paid: false },
    { id: "paid", name: "Paid", amount: 80, dueDate: "2026-09-02", paid: true },
  ],
  envelopes: [{ id: "buffer", name: "Buffer", amount: 200 }],
  history: [],
  updatedAt: "2026-08-27T10:00:00.000Z",
};

describe("safe-to-spend calculation", () => {
  it("deducts only unpaid bills due by payday and all protected money", () => {
    expect(calculateBudget(plan, "2026-08-27")).toMatchObject({
      days: 10,
      obligations: 300,
      protectedTotal: 200,
      available: 500,
      daily: 50,
      shortfall: 0,
    });
  });

  it("never presents a negative daily allowance", () => {
    const result = calculateBudget({ ...plan, balance: 100 }, "2026-08-27");
    expect(result.daily).toBe(0);
    expect(result.shortfall).toBe(400);
  });

  it("uses one day for payday today or an expired date", () => {
    expect(daysUntilPayday("2026-08-27", "2026-08-27")).toBe(1);
    expect(daysUntilPayday("2026-08-20", "2026-08-27")).toBe(1);
  });

  it("rejects unrelated import data", () => {
    expect(isBudgetState({ balance: 10 })).toBe(false);
    expect(isBudgetState(plan)).toBe(true);
  });

  it("rejects date-shaped impossible calendar dates before an import can replace a plan", () => {
    expect(isBudgetState({ ...plan, payday: "2026-13-01" })).toBe(false);
    expect(isBudgetState({ ...plan, bills: [{ ...plan.bills[0], dueDate: "2026-02-30" }] })).toBe(false);
  });

  it("rejects invalid timestamps in plan and balance history", () => {
    expect(isBudgetState({ ...plan, updatedAt: "not-a-date" })).toBe(false);
    expect(isBudgetState({ ...plan, updatedAt: "2026-02-30T10:00:00.000Z" })).toBe(false);
    expect(isBudgetState({ ...plan, history: [{ id: "snapshot", at: "2026-13-01T10:00:00.000Z", balance: 100 }] })).toBe(false);
  });
});
