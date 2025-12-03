import { type Page, type Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  readonly sidebar: Locator;
  readonly mobileNav: Locator;
  readonly mainContent: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidebar = page.locator('[data-testid="app-sidebar"]').or(page.locator('nav').filter({ hasText: 'Dashboard' }));
    this.mobileNav = page.locator('[data-testid="mobile-nav"]').or(page.locator('nav.lg\\:hidden'));
    this.mainContent = page.locator('main');
  }

  async goto(path: string) {
    await this.page.goto(path);
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async getPageHeading(): Promise<string> {
    const heading = this.mainContent.locator('h1').first();
    return heading.textContent() ?? '';
  }

  async navigateTo(linkText: string) {
    await this.sidebar.getByRole('link', { name: linkText }).click();
  }

  async hasNoConsoleErrors(): Promise<boolean> {
    const errors: string[] = [];
    this.page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    await this.page.waitForTimeout(1000);
    return errors.length === 0;
  }
}
