import { test, expect } from '@playwright/test';

test.describe('Simulator E2E Flow', () => {
  test('should navigate from landing to simulator and run a successful simulation', async ({ page }) => {
    // Start on homepage
    await page.goto('/');
    
    // Expect the hero title to be present
    await expect(page.locator('h1').filter({ hasText: /Simulate Before You Commit/i })).toBeVisible();

    // Click "Try Simulator" in navbar or "Business Simulator" in the "Start Here" grid
    const simButton = page.locator('a[href="/simulator"]').first();
    await simButton.click();

    // Verify we reached the simulator dashboard
    // Wait for the onboarding dialog and dismiss it if it appears
    const onboardingButton = page.locator('button:has-text("Start Exploring")');
    if (await onboardingButton.isVisible({ timeout: 5000 })) {
      await onboardingButton.click();
      await expect(page.locator('div[role="dialog"]')).toBeHidden();
    }

    // Navigate directly to the build page to avoid flaky clicks on Link components
    await page.goto('/simulator/new');
    
    // Verify we are on the build page
    await expect(page).toHaveURL(/.*\/simulator\/new/);
    await expect(page.locator('h1', { hasText: 'Build Simulation' })).toBeVisible();

    // Wait for defaults to load
    await expect(page.locator('input[placeholder="e.g. Q2 Workforce Planning"]')).toBeVisible({ timeout: 10000 });

    // The Run Simulation button should be visible
    const runButton = page.locator('button', { hasText: 'Run Simulation' });
    await expect(runButton).toBeVisible();

    // Run the simulation
    await runButton.click();

    // Verify we transition to the results page
    await expect(page).toHaveURL(/.*\/simulator\/sim_.+/);
    
    // Expect the recommendation panel and best margin text
    await expect(page.locator('text="Reux Decision Readout"')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text="Weekly Margin"').first()).toBeVisible();
    
    // The scenario comparison table should be visible at the bottom
    await expect(page.locator('text="Scenario Comparison"')).toBeVisible();
    await expect(page.locator('table')).toBeVisible();
  });
});
