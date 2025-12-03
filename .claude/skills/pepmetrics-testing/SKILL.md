---
name: pepmetrics-testing
description: Testing patterns and utilities for PepMetrics. Use when writing or debugging tests.
---

# PepMetrics Testing Guide

## Test Framework

- **E2E Testing**: Playwright
- **Test Directory**: `tests/`
  - `tests/e2e/` - End-to-end tests
  - `tests/fixtures/` - Test data
  - `tests/page-objects/` - Page object models

## Running Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run tests with UI
npm run test:e2e:ui

# Show test report
npm run test:e2e:report

# Run specific test file
npx playwright test smoke.spec.ts

# Run in headed mode (see browser)
npx playwright test --headed

# Run specific project (chromium/mobile)
npx playwright test --project=chromium
```

## Page Object Models

All page objects extend `BasePage`:

```typescript
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  readonly greeting: Locator;

  constructor(page: Page) {
    super(page);
    this.greeting = page.getByRole('heading', { name: /good morning/i });
  }

  async goto() {
    await super.goto('/');
  }
}
```

### Available Page Objects
- `BasePage` - Common selectors (sidebar, mobile nav, main content)
- `DashboardPage` - Dashboard with greeting, fasting card, etc.
- `ProtocolsPage` - Protocol management page
- `HealthPage` - Health metrics page
- `ProgressPage` - Progress tracking
- `CalendarPage` - Calendar view
- `InsightsPage` - Insights/analytics
- `BloodworkPage` - Bloodwork tracking
- `SettingsPage` - Settings with profile, integrations

## Common Selectors

### By Role (Preferred)
```typescript
page.getByRole('heading', { name: /settings/i })
page.getByRole('button', { name: /new protocol/i })
page.getByRole('link', { name: /dashboard/i })
page.getByLabel(/display name/i)
```

### By Text
```typescript
page.locator('text=Protocol Management')
page.locator('text=/fasting/i')  // case insensitive
```

### By Test ID (when available)
```typescript
page.locator('[data-testid="app-sidebar"]')
```

## Test Data Conventions

User data (from `tests/fixtures/test-data.ts`):
- **User**: Troy (troy@example.com, Pro Member)
- **Peptides**: Retatrutide, BPC-157, MOTS-c, TB-500, Tesamorelin, Epithalon, GHK-Cu, SS-31

```typescript
import { testUser, peptides, routes } from '../fixtures/test-data';

test('shows user name', async ({ page }) => {
  // Use test data
  await expect(page.locator(`text=${testUser.name}`)).toBeVisible();
});
```

## Writing Tests

### Basic Page Test
```typescript
test('page loads correctly', async ({ page }) => {
  const myPage = new MyPage(page);
  await myPage.goto();

  // Wait for load
  await expect(myPage.pageHeading).toBeVisible();

  // Check key elements
  await expect(myPage.mainContent).toBeVisible();
});
```

### Navigation Test
```typescript
test('can navigate between pages', async ({ page }) => {
  await page.goto('/');

  // Click nav link
  await page.getByRole('link', { name: /protocols/i }).click();

  // Verify navigation
  await expect(page).toHaveURL('/protocols');
  await expect(page.getByRole('heading', { name: /protocol/i })).toBeVisible();
});
```

### Form Interaction Test
```typescript
test('can update settings', async ({ page }) => {
  const settings = new SettingsPage(page);
  await settings.goto();

  // Get current value
  const displayName = await settings.getDisplayName();
  expect(displayName).toBe('Troy');

  // Update value
  await settings.displayNameInput.fill('New Name');
});
```

## Debugging Failed Tests

### View traces
```bash
npx playwright show-trace trace.zip
```

### Run in debug mode
```bash
npx playwright test --debug
```

### Take screenshots
```typescript
await page.screenshot({ path: 'debug.png' });
```

### Pause test execution
```typescript
await page.pause();  // Opens inspector
```

### Check for console errors
```typescript
page.on('console', msg => {
  if (msg.type() === 'error') {
    console.log('Console error:', msg.text());
  }
});
```

## CI/CD

Tests run automatically on:
- Push to `main`
- Pull requests

Configuration in `.github/workflows/test.yml`

## Best Practices

1. **Use page objects** - Don't put selectors directly in tests
2. **Wait for visibility** - Use `toBeVisible()` instead of `toHaveCount(1)`
3. **Use semantic selectors** - Prefer `getByRole` over CSS selectors
4. **Test user journeys** - Focus on what users actually do
5. **Keep tests independent** - Each test should work in isolation
6. **Use realistic data** - Use the peptide names and user data from fixtures
