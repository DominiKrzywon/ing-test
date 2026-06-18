import { test as setup } from "@playwright/test";
import * as fs from "fs";

/**
 * Auth setup — runs once before any browser project.
 *
 * Goal: save the Imperva session cookies to playwright/.auth/user.json
 * so that subsequent test runs skip the hCaptcha challenge.
 *
 * The setup does NOT accept the cookie-consent banner on purpose —
 * that flow is tested in cookies.spec.ts.
 *
 * On CI the auth file is injected from the PLAYWRIGHT_AUTH_JSON secret,
 * so this setup step is skipped automatically.
 */

const authFile = "playwright/.auth/user.json";

setup.skip(
  () => fs.existsSync(authFile),
  "Auth file already exists — skipping setup (CI or repeat local run)",
);

setup("bypass hCaptcha and save Imperva session", async ({ page }) => {
  await page.goto("/");

  // Imperva/hCaptcha challenge page — requires manual resolution on first local run
  const captchaHeading = page.getByText("Jestem człowiekiem");
  const isCaptchaVisible = await captchaHeading
    .isVisible({ timeout: 5_000 })
    .catch(() => false);

  if (isCaptchaVisible) {
    console.log("\n⚠️  hCaptcha detected!");
    console.log("   Solve the checkbox in the opened browser window.");
    console.log("   Waiting up to 2 minutes...\n");

    // Wait until cookie banner appears — that means we passed the challenge
    await page
      .locator(".js-cookie-policy-main-settings-button")
      .waitFor({ state: "visible", timeout: 120_000 });

    console.log("✓ hCaptcha solved — saving session.\n");
  }

  fs.mkdirSync("playwright/.auth", { recursive: true });
  await page.context().storageState({ path: authFile });

  console.log(`✓ Session saved to ${authFile}`);
});
