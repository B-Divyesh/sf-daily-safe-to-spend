import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  workers: 1,
  retries: 1,
  use: {
    baseURL: "http://127.0.0.1:4173",
    channel: "chromium",
    trace: "retain-on-failure",
    launchOptions: { args: ["--disable-gpu"] },
  },
  projects: [
    { name: "mobile-390", use: { viewport: { width: 390, height: 844 } } },
    { name: "desktop", use: { viewport: { width: 1440, height: 1000 } } },
  ],
  webServer: {
    command: "npm run preview -- --port 4173",
    port: 4173,
    reuseExistingServer: true,
  },
});
