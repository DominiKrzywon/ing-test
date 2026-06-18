import { defineConfig, devices } from "@playwright/test";

const authFile = "playwright/.auth/user.json";

export default defineConfig({
  testDir: "./ing-test",
  timeout: 60 * 1000,
  expect: { timeout: 10 * 1000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [["html", { open: "never" }], ["list"]],
  use: {
    baseURL: "https://www.ing.pl",
    locale: "pl-PL",
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    video: "retain-on-failure",
  },
  projects: [
    // Runs first — saves Imperva session to playwright/.auth/user.json
    // Skipped automatically when the file already exists (CI secret injection)
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },

    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], storageState: authFile },
      dependencies: ["setup"],
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"], storageState: authFile },
      dependencies: ["setup"],
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"], storageState: authFile },
      dependencies: ["setup"],
    },
  ],
});
