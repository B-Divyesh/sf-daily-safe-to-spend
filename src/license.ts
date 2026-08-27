export const LICENSE_KEY = "sb_license:daily-safe-to-spend";
const VERDICT_KEY = `${LICENSE_KEY}:verdict`;
const API = "https://api.sociobot.in/api/v1/products/daily-safe-to-spend";
const DAY = 86_400_000;

export interface LicenseState {
  unlocked: boolean;
  checking: boolean;
  notice: string;
}

interface Verdict { valid: boolean; checkedAt: number }

export function checkoutUrl(): string { return `${API}/checkout`; }

export function captureLicenseFromUrl(): string | null {
  const url = new URL(location.href);
  const token = url.searchParams.get("license");
  if (!token) return localStorage.getItem(LICENSE_KEY);
  localStorage.setItem(LICENSE_KEY, token);
  localStorage.removeItem(VERDICT_KEY);
  url.searchParams.delete("license");
  history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  return token;
}

export function storeLicense(token: string): void {
  localStorage.setItem(LICENSE_KEY, token.trim());
  localStorage.removeItem(VERDICT_KEY);
}

export function cachedLicenseState(): LicenseState {
  const token = localStorage.getItem(LICENSE_KEY);
  const cached = localStorage.getItem(VERDICT_KEY);
  if (!token || !cached) return { unlocked: false, checking: Boolean(token), notice: "" };
  try {
    const verdict = JSON.parse(cached) as Verdict;
    return { unlocked: verdict.valid, checking: Date.now() - verdict.checkedAt > DAY, notice: "" };
  } catch {
    return { unlocked: false, checking: true, notice: "" };
  }
}

export async function verifyLicense(force = false): Promise<LicenseState> {
  const token = localStorage.getItem(LICENSE_KEY);
  if (!token) return { unlocked: false, checking: false, notice: "" };
  const cached = localStorage.getItem(VERDICT_KEY);
  if (!force && cached) {
    try {
      const verdict = JSON.parse(cached) as Verdict;
      if (Date.now() - verdict.checkedAt < DAY) {
        return { unlocked: verdict.valid, checking: false, notice: verdict.valid ? "" : "License no longer active." };
      }
    } catch { /* verify below */ }
  }
  try {
    const response = await fetch(`${API}/verify?license=${encodeURIComponent(token)}`);
    if (!response.ok) throw new Error("Verification unavailable");
    const result = await response.json() as { valid: boolean };
    localStorage.setItem(VERDICT_KEY, JSON.stringify({ valid: result.valid, checkedAt: Date.now() }));
    return { unlocked: result.valid, checking: false, notice: result.valid ? "Plus unlocked on this device." : "License no longer active." };
  } catch {
    const optimistic = cachedLicenseState();
    return { ...optimistic, checking: false, notice: optimistic.unlocked ? "Offline — using your last verified license." : "Could not verify the license. Check your connection and try again." };
  }
}
