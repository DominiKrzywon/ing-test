import { test, expect } from "@playwright/test";
import { CookiePolicyPage } from "../ing-POM/CookiePolicyPage";

test.describe("ing.pl cookie consent", () => {
  test("user enables analytical cookies and the choice is persisted", async ({
    page,
    context,
  }) => {
    const cookiePage = new CookiePolicyPage(page);

    await test.step("Open ing.pl and customize the cookie banner", async () => {
      await cookiePage.open();
      await cookiePage.openCustomize();
    });

    await test.step("Enable analytical cookies and confirm selection", async () => {
      await cookiePage.enableAnalytical();
      await cookiePage.acceptSelected();
    });

    await test.step("Banner is dismissed after the decision", async () => {
      await cookiePage.expectBannerDismissed();
    });

    await test.step("Consent cookie is persisted in the browser", async () => {
      const cookies = await context.cookies();
      console.log(cookies);

      const consentCookie = cookies.find((c) => c.name === "cookiePolicyGDPR");
      const detailsCookie = cookies.find(
        (c) => c.name === "cookiePolicyGDPR__details",
      );

      expect(
        consentCookie,
        "Expected cookiePolicyGDPR cookie to be saved",
      ).toBeDefined();
      expect(
        detailsCookie,
        "Expected cookiePolicyGDPR__details cookie to be saved",
      ).toBeDefined();

      const ANALYTICAL_BIT = 2;
      const consentMask = Number(consentCookie!.value);

      expect(
        consentMask & ANALYTICAL_BIT,
        `Expected analytical consent in cookiePolicyGDPR (mask=${consentMask})`,
      ).toBe(ANALYTICAL_BIT);
    });
  });
});
