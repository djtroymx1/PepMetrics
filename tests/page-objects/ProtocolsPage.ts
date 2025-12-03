import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProtocolsPage extends BasePage {
  readonly pageHeading: Locator;
  readonly newProtocolButton: Locator;
  readonly protocolList: Locator;
  readonly vialInventory: Locator;
  readonly reconCalculator: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.getByRole('heading', { name: /protocol management/i });
    this.newProtocolButton = page.getByRole('button', { name: /new protocol/i });
    this.protocolList = page.locator('text=Active Protocols').first();
    this.vialInventory = page.locator('text=Vial Inventory').first();
    this.reconCalculator = page.locator('text=Reconstitution').first();
  }

  async goto() {
    await super.goto('/protocols');
  }

  async isLoaded(): Promise<boolean> {
    await this.pageHeading.waitFor({ state: 'visible' });
    return true;
  }

  async clickNewProtocol() {
    await this.newProtocolButton.click();
  }
}
