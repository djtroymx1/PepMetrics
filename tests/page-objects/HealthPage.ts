import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HealthPage extends BasePage {
  readonly pageHeading: Locator;

  // Garmin Import Section
  readonly garminImportCard: Locator;
  readonly garminImportTitle: Locator;
  readonly fileInput: Locator;
  readonly dropZone: Locator;
  readonly uploadProgress: Locator;
  readonly uploadSuccess: Locator;
  readonly uploadError: Locator;
  readonly howToExportButton: Locator;
  readonly importInstructions: Locator;

  // Health Metrics Cards
  readonly sleepScoreCard: Locator;
  readonly hrvCard: Locator;
  readonly stressCard: Locator;
  readonly stepsCard: Locator;
  readonly bodyBatteryCard: Locator;
  readonly restingHrCard: Locator;

  // Charts
  readonly sleepChart: Locator;
  readonly hrvChart: Locator;
  readonly activityChart: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.getByRole('heading', { name: /health metrics/i });

    // Garmin Import Section
    this.garminImportCard = page.locator('[data-slot="card-title"]').filter({ hasText: 'Import Your Garmin Data' }).locator('..').locator('..');
    this.garminImportTitle = page.locator('[data-slot="card-title"]').filter({ hasText: 'Import Your Garmin Data' });
    this.fileInput = page.locator('input[type="file"]');
    this.dropZone = page.locator('[class*="border-dashed"]');
    this.uploadProgress = page.locator('[role="progressbar"]');
    this.uploadSuccess = page.locator('text=Import successful');
    this.uploadError = page.locator('text=Import failed');
    this.howToExportButton = page.locator('text=How to export from Garmin Connect');
    this.importInstructions = page.locator('text=connect.garmin.com');

    // Health Metrics Cards
    this.sleepScoreCard = page.locator('text=Sleep Score').first();
    this.hrvCard = page.locator('text=HRV').first();
    this.stressCard = page.locator('text=Stress').first();
    this.stepsCard = page.locator('text=Steps').first();
    this.bodyBatteryCard = page.locator('text=Body Battery').first();
    this.restingHrCard = page.locator('text=Resting HR').first();

    // Charts
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

  async isGarminImportVisible(): Promise<boolean> {
    return this.garminImportTitle.isVisible();
  }

  async uploadGarminCSV(filePath: string): Promise<void> {
    await this.fileInput.setInputFiles(filePath);
  }

  async expandImportInstructions(): Promise<void> {
    const isExpanded = await this.importInstructions.isVisible();
    if (!isExpanded) {
      await this.howToExportButton.click();
    }
  }

  async waitForUploadComplete(): Promise<void> {
    // Wait for success or error state
    await this.page.waitForSelector(
      'text=Import Successful, text=Import Failed',
      { timeout: 30000 }
    );
  }

  async hasGarminData(): Promise<boolean> {
    // Check if any metrics have actual values (not just placeholders)
    const hrvText = await this.hrvCard.textContent();
    return hrvText !== null && !hrvText.includes('--');
  }
}
