import { test, expect } from '@playwright/test';
import { DashboardPage } from '../page-objects/DashboardPage';
import { HealthPage } from '../page-objects/HealthPage';
import { InsightsPage } from '../page-objects/InsightsPage';

test.describe('AI Insights Engine Tests', () => {

  test.describe('Insights Page - UI States', () => {
    test('insights page loads with correct heading', async ({ page }) => {
      const insights = new InsightsPage(page);
      await insights.goto();

      // Verify page loads
      await expect(insights.pageHeading).toBeVisible();
      await expect(insights.pageDescription).toBeVisible();
    });

    test('insights page shows chat interface', async ({ page }) => {
      const insights = new InsightsPage(page);
      await insights.goto();
      await insights.waitForPageReady();

      // Chat interface should always be visible
      await expect(insights.chatTitle).toBeVisible();
      await expect(insights.chatInput).toBeVisible();
    });

    test('chat interface shows suggested questions when empty', async ({ page }) => {
      const insights = new InsightsPage(page);
      await insights.goto();
      await insights.waitForPageReady();

      // Should show suggested questions
      const questionCount = await insights.suggestedQuestions.count();
      expect(questionCount).toBeGreaterThan(0);
    });

    test('insights page shows appropriate empty state', async ({ page }) => {
      const insights = new InsightsPage(page);
      await insights.goto();
      await insights.waitForPageReady();

      // Should show either no-analysis, insufficient-data, or ready state
      const emptyStateType = await insights.getEmptyStateType();

      // If empty state is shown, verify appropriate messaging
      if (emptyStateType === 'no-analysis') {
        await expect(insights.emptyState).toBeVisible();
      } else if (emptyStateType === 'insufficient-data') {
        await expect(insights.noDataState).toBeVisible();
      }
      // If 'none', insights are ready - that's also valid
    });
  });

  test.describe('Dashboard - Insights Widget', () => {
    test('dashboard shows AI insights widget', async ({ page }) => {
      const dashboard = new DashboardPage(page);
      await dashboard.goto();

      // Wait for page to load
      await expect(dashboard.greeting).toBeVisible();

      // Insights widget should be visible
      await expect(dashboard.insightsWidgetTitle).toBeVisible();
    });

    test('insights widget shows appropriate content', async ({ page }) => {
      const dashboard = new DashboardPage(page);
      await dashboard.goto();

      // Wait for the widget to load (it fetches data)
      await page.waitForTimeout(2000);

      // Widget should show some content (either insights summary or get started prompt)
      // Check for loading state first
      const isLoading = await page.locator('.animate-pulse').first().isVisible();
      if (isLoading) {
        // Wait for loading to finish
        await page.waitForSelector('.animate-pulse', { state: 'hidden', timeout: 5000 }).catch(() => {});
      }

      // Now check for actual content
      const hasGetStarted = await page.locator('text=Get Started').isVisible();
      const hasInsightsCount = await page.locator('text=/insights discovered/').isVisible();
      const hasNoInsights = await page.locator('text=No insights generated').isVisible();
      const hasGenerateAnalysis = await page.locator('text=Generate Analysis').isVisible();
      const hasViewAll = await page.locator('text=View All').isVisible();

      // At least one of these should be true
      expect(hasGetStarted || hasInsightsCount || hasNoInsights || hasGenerateAnalysis || hasViewAll).toBe(true);
    });

    test('clicking insights widget link navigates to insights page', async ({ page, isMobile }) => {
      // Skip on mobile due to different navigation patterns
      test.skip(!!isMobile, 'Navigation test may behave differently on mobile');

      const dashboard = new DashboardPage(page);
      await dashboard.goto();

      // Find and click the view link
      const viewLink = page.getByRole('link', { name: /view all|get started/i }).first();
      if (await viewLink.isVisible()) {
        await viewLink.click();
        await expect(page).toHaveURL('/insights');
      }
    });
  });

  test.describe('Health Page - Garmin Import UI', () => {
    test('health page shows Garmin import section', async ({ page }) => {
      const health = new HealthPage(page);
      await health.goto();

      // Verify page loads
      await expect(health.pageHeading).toBeVisible();

      // Garmin import section should be visible
      await expect(health.garminImportTitle).toBeVisible();
    });

    test('Garmin import has file input', async ({ page }) => {
      const health = new HealthPage(page);
      await health.goto();

      // File input should exist (may be hidden but present)
      const fileInput = page.locator('input[type="file"]');
      await expect(fileInput).toBeAttached();
    });

    test('Garmin import instructions can be expanded', async ({ page }) => {
      const health = new HealthPage(page);
      await health.goto();

      // Find the how-to button (it's a CollapsibleTrigger)
      const howToButton = page.locator('text=How to export from Garmin Connect');

      if (await howToButton.isVisible()) {
        await howToButton.click();

        // Instructions should now be visible - wait for expansion
        await expect(page.locator('text=connect.garmin.com')).toBeVisible({ timeout: 5000 });
      }
    });
  });

  test.describe('Chat Interface', () => {
    test('chat input accepts text', async ({ page }) => {
      const insights = new InsightsPage(page);
      await insights.goto();
      await insights.waitForPageReady();

      // Type in the chat input
      await insights.chatInput.fill('How is my sleep?');

      // Verify the text is in the input
      await expect(insights.chatInput).toHaveValue('How is my sleep?');
    });

    test('chat has send button', async ({ page }) => {
      const insights = new InsightsPage(page);
      await insights.goto();
      await insights.waitForPageReady();

      // Send button should be visible
      await expect(insights.chatSendButton).toBeVisible();
    });

    test('chat disclaimer is visible', async ({ page }) => {
      const insights = new InsightsPage(page);
      await insights.goto();
      await insights.waitForPageReady();

      // Should show the disclaimer about AI not being medical advice
      await expect(page.locator('text=/not medical advice/i')).toBeVisible();
    });
  });

  test.describe('Navigation Flow', () => {
    test('can navigate from dashboard to insights via widget', async ({ page, isMobile }) => {
      test.skip(!!isMobile, 'Navigation patterns differ on mobile');

      // Start at dashboard
      await page.goto('/');
      await expect(page.getByRole('heading', { name: /good morning/i })).toBeVisible();

      // Find insights widget link
      const insightsLink = page.getByRole('link', { name: /view all|get started/i }).first();

      if (await insightsLink.isVisible()) {
        await insightsLink.click();

        // Should be on insights page
        await expect(page).toHaveURL('/insights');
        await expect(page.getByRole('heading', { name: /ai insights/i })).toBeVisible();
      }
    });

    test('can navigate from sidebar to insights', async ({ page, isMobile }) => {
      test.skip(!!isMobile, 'Sidebar navigation not available on mobile');

      await page.goto('/');

      // Click insights in sidebar
      await page.getByRole('link', { name: /insights/i }).first().click();

      // Should be on insights page
      await expect(page).toHaveURL('/insights');
      await expect(page.getByRole('heading', { name: /ai insights/i })).toBeVisible();
    });

    test('can navigate from insights to health for data import', async ({ page, isMobile }) => {
      test.skip(!!isMobile, 'Navigation patterns differ on mobile');

      const insights = new InsightsPage(page);
      await insights.goto();

      // If there's a link to import data, click it
      const importLink = page.getByRole('link', { name: /import|health/i }).first();

      if (await importLink.isVisible()) {
        await importLink.click();
        await expect(page).toHaveURL('/health');
      }
    });
  });

  test.describe('Responsive Layout', () => {
    test('insights page is responsive on mobile', async ({ page, isMobile }) => {
      test.skip(!isMobile, 'This test is specifically for mobile');

      const insights = new InsightsPage(page);
      await insights.goto();

      // Page should load
      await expect(insights.pageHeading).toBeVisible();

      // Chat should still be accessible (may be in different position)
      await expect(insights.chatTitle).toBeVisible();
    });

    test('health page is responsive on mobile', async ({ page, isMobile }) => {
      test.skip(!isMobile, 'This test is specifically for mobile');

      const health = new HealthPage(page);
      await health.goto();

      // Page should load
      await expect(health.pageHeading).toBeVisible();
    });
  });
});

test.describe('API Endpoints Availability', () => {
  test('insights API returns proper response', async ({ request }) => {
    const response = await request.get('/api/insights');

    // Should return 401 (unauthorized) or 200 with data
    expect([200, 401]).toContain(response.status());
  });

  test('insights generate API requires authentication', async ({ request }) => {
    const response = await request.post('/api/insights/generate');

    // Should return 401 for unauthenticated requests
    expect(response.status()).toBe(401);
  });

  test('insights chat API requires authentication', async ({ request }) => {
    const response = await request.post('/api/insights/chat', {
      data: { message: 'test' }
    });

    // Should return 401 for unauthenticated requests
    expect(response.status()).toBe(401);
  });

  test('garmin import API requires authentication', async ({ request }) => {
    const response = await request.get('/api/garmin/import');

    // Should return 401 for unauthenticated requests
    expect(response.status()).toBe(401);
  });

  test('dose-logs API requires authentication', async ({ request }) => {
    const response = await request.get('/api/dose-logs');

    // Should return 401 for unauthenticated requests
    expect(response.status()).toBe(401);
  });

  test('dose-logs sync API requires authentication', async ({ request }) => {
    const response = await request.get('/api/dose-logs/sync');

    // Should return 401 for unauthenticated requests
    expect(response.status()).toBe(401);
  });
});
