import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProgressPage extends BasePage {
  readonly pageHeading: Locator;
  readonly addPhotoButton: Locator;
  readonly weightTrendCard: Locator;
  readonly measurementsTracker: Locator;
  readonly photoGallery: Locator;
  readonly checkinTable: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.getByRole('heading', { name: /progress tracking/i });
    this.addPhotoButton = page.getByRole('button', { name: /add photo/i });
    this.weightTrendCard = page.locator('text=Weight Trend').first();
    this.measurementsTracker = page.locator('text=Measurements').first();
    this.photoGallery = page.locator('text=Progress Photos').first();
    this.checkinTable = page.locator('text=Check-in').first();
  }

  async goto() {
    await super.goto('/progress');
  }

  async isLoaded(): Promise<boolean> {
    await this.pageHeading.waitFor({ state: 'visible' });
    return true;
  }
}
