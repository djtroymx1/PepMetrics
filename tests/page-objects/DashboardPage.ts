import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  readonly greeting: Locator;
  readonly fastingCard: Locator;
  readonly activityCard: Locator;
  readonly sleepCard: Locator;
  readonly waterTrackerCard: Locator;
  readonly protocolCard: Locator;
  readonly scheduleCard: Locator;
  readonly weightCard: Locator;
  readonly hrvCard: Locator;

  constructor(page: Page) {
    super(page);
    this.greeting = page.getByRole('heading', { name: /good morning/i });
    this.fastingCard = page.locator('text=Fasting').first();
    this.activityCard = page.locator('text=Steps').first();
    this.sleepCard = page.locator('text=Sleep').first();
    this.waterTrackerCard = page.locator('text=Water').first();
    this.protocolCard = page.locator('text=Protocol').first();
    this.scheduleCard = page.locator('text=Schedule').first();
    this.weightCard = page.locator('text=Weight').first();
    this.hrvCard = page.locator('text=HRV').first();
  }

  async goto() {
    await super.goto('/');
  }

  async getGreetingText(): Promise<string> {
    return this.greeting.textContent() ?? '';
  }

  async isLoaded(): Promise<boolean> {
    await this.greeting.waitFor({ state: 'visible' });
    return true;
  }
}
