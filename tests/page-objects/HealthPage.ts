import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HealthPage extends BasePage {
  readonly pageHeading: Locator;
  readonly garminConnect: Locator;
  readonly sleepScoreCard: Locator;
  readonly hrvCard: Locator;
  readonly stressCard: Locator;
  readonly stepsCard: Locator;
  readonly sleepChart: Locator;
  readonly hrvChart: Locator;
  readonly activityChart: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.getByRole('heading', { name: /health metrics/i });
    this.garminConnect = page.locator('text=Garmin Connect').first();
    this.sleepScoreCard = page.locator('text=Sleep Score').first();
    this.hrvCard = page.locator('text=HRV').first();
    this.stressCard = page.locator('text=Stress').first();
    this.stepsCard = page.locator('text=Steps').first();
    this.sleepChart = page.locator('text=Sleep Stages').first();
    this.hrvChart = page.locator('text=HRV Trend').first();
    this.activityChart = page.locator('text=Activity').first();
  }

  async goto() {
    await super.goto('/health');
  }

  async isLoaded(): Promise<boolean> {
    await this.pageHeading.waitFor({ state: 'visible' });
    return true;
  }

  async isGarminConnectVisible(): Promise<boolean> {
    return this.garminConnect.isVisible();
  }
}
