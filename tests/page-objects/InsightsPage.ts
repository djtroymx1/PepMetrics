import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class InsightsPage extends BasePage {
  readonly pageHeading: Locator;
  readonly weeklySummary: Locator;
  readonly discoveredPatterns: Locator;
  readonly chatInput: Locator;
  readonly suggestedQuestions: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.getByRole('heading', { name: /ai insights/i });
    this.weeklySummary = page.locator('text=Weekly Summary').first();
    this.discoveredPatterns = page.locator('text=Discovered Patterns').first();
    this.chatInput = page.getByPlaceholder(/ask a question/i);
    this.suggestedQuestions = page.locator('text=Suggested questions').first();
  }

  async goto() {
    await super.goto('/insights');
  }

  async isLoaded(): Promise<boolean> {
    await this.pageHeading.waitFor({ state: 'visible' });
    return true;
  }

  async askQuestion(question: string) {
    await this.chatInput.fill(question);
    await this.chatInput.press('Enter');
  }
}
