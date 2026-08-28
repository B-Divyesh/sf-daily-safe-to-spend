import { isBudgetState, type BudgetState } from "./model";

const REAL_DB_NAME = "today-money";
const DEMO_DB_NAME = "today-money-demo";
const STORE = "budget";
const KEY = "current";

function openDb(demo = false): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(demo ? DEMO_DB_NAME : REAL_DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Could not open local storage"));
  });
}

export async function loadBudget(demo = false): Promise<BudgetState | null> {
  const db = await openDb(demo);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const request = tx.objectStore(STORE).get(KEY);
    request.onsuccess = () => resolve((request.result as BudgetState | undefined) ?? null);
    request.onerror = () => reject(request.error ?? new Error("Could not read your plan"));
    tx.oncomplete = () => db.close();
  });
}

export async function saveBudget(state: BudgetState, demo = false): Promise<void> {
  if (!isBudgetState(state)) throw new Error("The plan contains invalid data and was not saved.");
  const db = await openDb(demo);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(state, KEY);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => reject(tx.error ?? new Error("Could not save your plan"));
  });
}

export async function clearBudget(demo = false): Promise<void> {
  const db = await openDb(demo);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(KEY);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => reject(tx.error ?? new Error("Could not clear your plan"));
  });
}
