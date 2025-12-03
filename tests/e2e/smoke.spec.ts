import { test, expect } from '@playwright/test';
import { DashboardPage } from '../page-objects/DashboardPage';
import { ProtocolsPage } from '../page-objects/ProtocolsPage';
import { HealthPage } from '../page-objects/HealthPage';
import { ProgressPage } from '../page-objects/ProgressPage';
import { CalendarPage } from '../page-objects/CalendarPage';
import { InsightsPage } from '../page-objects/InsightsPage';
import { BloodworkPage } from '../page-objects/BloodworkPage';
import { SettingsPage } from '../page-objects/SettingsPage';

test.describe('Smoke Tests - All Pages Load', () => {
  test('Dashboard (/) loads correctly', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();

    // Verify page loads
    await expect(dashboard.greeting).toBeVisible();

    // Verify key elements are present
    await expect(dashboard.mainContent).toBeVisible();

    // Check for greeting text containing "Troy"
    const greetingText = await dashboard.getGreetingText();
    expect(greetingText).toContain('Troy');
  });

  test('Protocols (/protocols) loads correctly', async ({ page }) => {
    const protocols = new ProtocolsPage(page);
    await protocols.goto();

    // Verify page loads
    await expect(protocols.pageHeading).toBeVisible();

    // Verify key elements
    await expect(protocols.newProtocolButton).toBeVisible();
    await expect(protocols.mainContent).toBeVisible();
  });

  test('Health (/health) loads correctly', async ({ page }) => {
    const health = new HealthPage(page);
    await health.goto();

    // Verify page loads
    await expect(health.pageHeading).toBeVisible();

    // Verify key elements
    await expect(health.mainContent).toBeVisible();
  });

  test('Progress (/progress) loads correctly', async ({ page }) => {
    const progress = new ProgressPage(page);
    await progress.goto();

    // Verify page loads without errors
    await expect(progress.mainContent).toBeVisible();
  });

  test('Calendar (/calendar) loads correctly', async ({ page }) => {
    const calendar = new CalendarPage(page);
    await calendar.goto();

    // Verify page loads without errors
    await expect(calendar.mainContent).toBeVisible();
  });

  test('Insights (/insights) loads correctly', async ({ page }) => {
    const insights = new InsightsPage(page);
    await insights.goto();

    // Verify page loads without errors
    await expect(insights.mainContent).toBeVisible();
  });

  test('Bloodwork (/bloodwork) loads correctly', async ({ page }) => {
    const bloodwork = new BloodworkPage(page);
    await bloodwork.goto();

    // Verify page loads without errors
    await expect(bloodwork.mainContent).toBeVisible();
  });

  test('Settings (/settings) loads correctly', async ({ page }) => {
    const settings = new SettingsPage(page);
    await settings.goto();

    // Verify page loads
    await expect(settings.pageHeading).toBeVisible();

    // Verify key sections are present
    await expect(settings.profileSection).toBeVisible();
    await expect(settings.appearanceSection).toBeVisible();
    await expect(settings.integrationsSection).toBeVisible();
    await expect(settings.notificationsSection).toBeVisible();
    await expect(settings.dataManagementSection).toBeVisible();
  });
});

test.describe('Navigation Tests', () => {
  // Skip on mobile - mobile nav uses different selectors and has dev overlay issues
  test('can navigate between pages using sidebar', async ({ page, isMobile }) => {
    test.skip(!!isMobile, 'Skipping sidebar navigation test on mobile - uses bottom nav');

    // Start at dashboard
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /good morning/i })).toBeVisible();

    // Navigate to Protocols
    await page.getByRole('link', { name: /protocols/i }).first().click();
    await expect(page.getByRole('heading', { name: /protocol management/i })).toBeVisible();

    // Navigate to Health
    await page.getByRole('link', { name: /health/i }).first().click();
    await expect(page.getByRole('heading', { name: /health metrics/i })).toBeVisible();

    // Navigate to Settings
    await page.getByRole('link', { name: /settings/i }).first().click();
    await expect(page.getByRole('heading', { name: /settings/i })).toBeVisible();

    // Navigate back to Dashboard
    await page.getByRole('link', { name: /dashboard/i }).first().click();
    await expect(page.getByRole('heading', { name: /good morning/i })).toBeVisible();
  });
});

test.describe('Dashboard Specific Tests', () => {
  test('dashboard shows all key cards', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();

    // Verify fasting-related content is visible
    await expect(page.locator('text=/fasting/i').first()).toBeVisible();

    // Verify Due Today section is visible
    await expect(page.locator('text=/due today/i').first()).toBeVisible();

    // Verify Weekly Overview is visible
    await expect(page.locator('text=/weekly overview/i').first()).toBeVisible();

    // Verify health metrics section (Weight, HRV, Water, Sleep cards)
    await expect(page.locator('text=/weight/i').first()).toBeVisible();
  });
});

test.describe('Settings Specific Tests', () => {
  test('settings shows user profile with Troy', async ({ page }) => {
    const settings = new SettingsPage(page);
    await settings.goto();

    // Check that the display name field shows Troy
    const displayName = await settings.getDisplayName();
    expect(displayName).toBe('Troy');
  });
});
