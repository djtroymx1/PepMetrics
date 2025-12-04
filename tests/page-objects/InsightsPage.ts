import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class InsightsPage extends BasePage {
  readonly pageHeading: Locator;
  readonly pageDescription: Locator;

  // States
  readonly loadingState: Locator;
  readonly generatingState: Locator;
  readonly emptyState: Locator;
  readonly noDataState: Locator;
  readonly errorState: Locator;

  // Ready state elements
  readonly generateButton: Locator;
  readonly weeklySummary: Locator;
  readonly discoveredPatterns: Locator;
  readonly insightCards: Locator;

  // Chat interface
  readonly chatCard: Locator;
  readonly chatTitle: Locator;
  readonly chatInput: Locator;
  readonly chatSendButton: Locator;
  readonly chatMessages: Locator;
  readonly suggestedQuestions: Locator;
  readonly clearChatButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.getByRole('heading', { name: /ai insights/i });
    this.pageDescription = page.locator('text=Personalized analysis and correlations');

    // States
    this.loadingState = page.locator('.animate-pulse').first();
    this.generatingState = page.locator('text=Analyzing your data');
    this.emptyState = page.locator('text=Generate Your First Analysis');
    this.noDataState = page.locator('text=Not Enough Data Yet');
    this.errorState = page.locator('text=Something went wrong');

    // Ready state elements
    this.generateButton = page.getByRole('button', { name: /generate|new analysis/i });
    this.weeklySummary = page.locator('text=Weekly Summary');
    this.discoveredPatterns = page.locator('text=Discovered Patterns');
    this.insightCards = page.locator('[class*="insight"]');

    // Chat interface
    this.chatCard = page.locator('text=Ask About Your Data').locator('..');
    this.chatTitle = page.locator('text=Ask About Your Data');
    this.chatInput = page.getByPlaceholder(/ask about your protocols/i);
    this.chatSendButton = page.getByRole('button', { name: /send message/i });
    this.chatMessages = page.locator('[class*="rounded-2xl"][class*="px-4"]');
    this.suggestedQuestions = page.locator('button').filter({ hasText: /sleep|correlations|peptides|compliance/i });
    this.clearChatButton = page.getByRole('button', { name: /clear chat/i });
  }

  async goto() {
    await super.goto('/insights');
  }

  async isLoaded(): Promise<boolean> {
    await this.pageHeading.waitFor({ state: 'visible', timeout: 10000 });
    return true;
  }

  async waitForPageReady(): Promise<void> {
    // Wait for loading to finish
    await this.page.waitForFunction(() => {
      const loading = document.querySelector('.animate-pulse');
      return !loading || !loading.closest('main');
    }, { timeout: 10000 });
  }

  async askQuestion(question: string): Promise<void> {
    await this.chatInput.fill(question);
    await this.chatSendButton.click();
  }

  async clickSuggestedQuestion(index: number = 0): Promise<void> {
    const questions = await this.suggestedQuestions.all();
    if (questions.length > index) {
      await questions[index].click();
    }
  }

  async getEmptyStateType(): Promise<'no-analysis' | 'insufficient-data' | 'none'> {
    if (await this.emptyState.isVisible()) {
      return 'no-analysis';
    }
    if (await this.noDataState.isVisible()) {
      return 'insufficient-data';
    }
    return 'none';
  }

  async isChatVisible(): Promise<boolean> {
    return this.chatTitle.isVisible();
  }

  async getChatMessageCount(): Promise<number> {
    return this.chatMessages.count();
  }
}
