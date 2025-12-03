import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class BloodworkPage extends BasePage {
  readonly pageHeading: Locator;
  readonly uploadButton: Locator;
  readonly optimalMarkersCard: Locator;
  readonly needsAttentionCard: Locator;
  readonly lastUpdatedCard: Locator;
  readonly hormonesSection: Locator;
  readonly metabolicSection: Locator;
  readonly lipidsSection: Locator;
  readonly inflammationSection: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.getByRole('heading', { name: /bloodwork/i }).first();
    this.uploadButton = page.getByRole('button', { name: /upload lab report/i });
    this.optimalMarkersCard = page.locator('text=Optimal Markers').first();
    this.needsAttentionCard = page.locator('text=Needs Attention').first();
    this.lastUpdatedCard = page.locator('text=Last Updated').first();
    this.hormonesSection = page.locator('text=Hormones').first();
    this.metabolicSection = page.locator('text=Metabolic').first();
    this.lipidsSection = page.locator('text=Lipids').first();
    this.inflammationSection = page.locator('text=Inflammation').first();
  }

  async goto() {
    await super.goto('/bloodwork');
  }

  async isLoaded(): Promise<boolean> {
    await this.pageHeading.waitFor({ state: 'visible' });
    return true;
  }
}
