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

  // Due Today Section
  readonly dueTodaySection: Locator;
  readonly dueTodayCount: Locator;

  // Weekly Overview
  readonly weeklyOverview: Locator;
  readonly viewCalendarLink: Locator;

  // AI Insights Widget
  readonly insightsWidget: Locator;
  readonly insightsWidgetTitle: Locator;
  readonly insightsWidgetContent: Locator;
  readonly viewInsightsLink: Locator;

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

    // Due Today Section
    this.dueTodaySection = page.locator('text=Due Today').first();
    this.dueTodayCount = page.locator('text=/\\d+ done/');

    // Weekly Overview
    this.weeklyOverview = page.locator('text=Weekly Overview').first();
    this.viewCalendarLink = page.getByRole('link', { name: /view calendar/i });

    // AI Insights Widget
    this.insightsWidget = page.locator('text=AI Insights').first().locator('..').locator('..');
    this.insightsWidgetTitle = page.locator('text=AI Insights').first();
    this.insightsWidgetContent = page.locator('text=/insights discovered|Get Started|No insights/i');
    this.viewInsightsLink = page.getByRole('link', { name: /view all|get started/i });
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

  async isInsightsWidgetVisible(): Promise<boolean> {
    return this.insightsWidgetTitle.isVisible();
  }

  async clickViewInsights(): Promise<void> {
    await this.viewInsightsLink.click();
  }

  async getDueTodayStats(): Promise<{ done: number; total: number }> {
    const text = await this.dueTodayCount.textContent() ?? '0 done / 0 total';
    const match = text.match(/(\d+)\s*done.*?(\d+)\s*total/i);
    if (match) {
      return { done: parseInt(match[1]), total: parseInt(match[2]) };
    }
    return { done: 0, total: 0 };
  }
}
