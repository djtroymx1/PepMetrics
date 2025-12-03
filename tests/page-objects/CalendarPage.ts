import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CalendarPage extends BasePage {
  readonly pageHeading: Locator;
  readonly monthCalendar: Locator;
  readonly upcomingSchedule: Locator;
  readonly calendarLegend: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.getByRole('heading', { name: /calendar/i }).first();
    this.monthCalendar = page.locator('text=December').or(page.locator('text=January')).or(page.locator('text=February')).first();
    this.upcomingSchedule = page.locator('text=Upcoming').first();
    this.calendarLegend = page.locator('text=Legend').or(page.locator('text=Injection')).first();
  }

  async goto() {
    await super.goto('/calendar');
  }

  async isLoaded(): Promise<boolean> {
    await this.pageHeading.waitFor({ state: 'visible' });
    return true;
  }
}
