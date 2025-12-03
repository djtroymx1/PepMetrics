import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SettingsPage extends BasePage {
  readonly pageHeading: Locator;
  readonly profileSection: Locator;
  readonly appearanceSection: Locator;
  readonly integrationsSection: Locator;
  readonly notificationsSection: Locator;
  readonly dataManagementSection: Locator;
  readonly displayNameInput: Locator;
  readonly emailInput: Locator;
  readonly themeToggle: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.getByRole('heading', { name: /settings/i }).first();
    this.profileSection = page.locator('text=Profile').first();
    this.appearanceSection = page.locator('text=Appearance').first();
    this.integrationsSection = page.locator('text=Integrations').first();
    this.notificationsSection = page.locator('text=Notifications').first();
    this.dataManagementSection = page.locator('text=Data Management').first();
    this.displayNameInput = page.getByLabel(/display name/i);
    this.emailInput = page.getByLabel(/email/i);
    this.themeToggle = page.locator('text=Dark Mode').first();
  }

  async goto() {
    await super.goto('/settings');
  }

  async isLoaded(): Promise<boolean> {
    await this.pageHeading.waitFor({ state: 'visible' });
    return true;
  }

  async getDisplayName(): Promise<string> {
    return this.displayNameInput.inputValue();
  }
}
