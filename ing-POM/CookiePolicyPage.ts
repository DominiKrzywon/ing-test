import { Page, Locator, expect } from "@playwright/test";

export class CookiePolicyPage {
  private readonly page: Page;

  private readonly customizeButton: Locator;
  private readonly analyticalToggle: Locator;
  private readonly acceptSelectedButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.customizeButton = page.locator(
      ".js-cookie-policy-main-settings-button",
    );
    this.analyticalToggle = page.locator("#header-2-analytical");
    this.acceptSelectedButton = page.locator(
      ".js-cookie-policy-settings-decline-button",
    );
  }

  async open(): Promise<void> {
    await this.page.goto("/");
  }

  async openCustomize(): Promise<void> {
    await expect(this.customizeButton).toBeVisible();
    await this.customizeButton.click();
  }

  async enableAnalytical(): Promise<void> {
    await expect(this.analyticalToggle).toBeVisible();
    await this.analyticalToggle.click();
  }

  async acceptSelected(): Promise<void> {
    await expect(this.acceptSelectedButton).toBeVisible();
    await this.acceptSelectedButton.click();
  }

  async expectBannerDismissed(): Promise<void> {
    await expect(this.customizeButton).toBeHidden();
  }
}
