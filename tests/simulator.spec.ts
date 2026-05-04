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
    await page.goto('/simulator/new?preset=optimization');
    
    // Verify we are on the build page
    await expect(page).toHaveURL(/.*\/simulator\/new/);
    await expect(page.locator('h1', { hasText: 'Build Simulation' })).toBeVisible();

    // Verify template cards render with titles visible
    const templateCards = page.locator('button:has(h4)');
    await expect(templateCards.first()).toBeVisible({ timeout: 5000 });
    // All 4 template cards should show their titles
    await expect(templateCards).toHaveCount(4);
    await expect(page.locator('h4', { hasText: 'Operations Decision' })).toBeVisible();
    await expect(page.locator('h4', { hasText: 'Capacity Planning' })).toBeVisible();
    await expect(page.locator('h4', { hasText: 'Staffing Plan' })).toBeVisible();
    await expect(page.locator('h4', { hasText: 'Pricing Strategy' })).toBeVisible();

    // Wait for defaults to load
    await expect(page.locator('input[placeholder="e.g. Q2 Workforce Planning"]')).toBeVisible({ timeout: 10000 });

    // The Run Simulation button should be visible
    const runButton = page.locator('button', { hasText: 'Run Simulation' });
    await expect(runButton).toBeVisible();
    await expect(runButton).toBeEnabled({ timeout: 10000 });

    // Run the simulation
    await runButton.click();

    // Verify we transition to the results page
    await expect(page).toHaveURL(/.*\/simulator\/(sim_|live_).+/);
    
    // Expect the recommendation panel and best margin text
    await expect(page.getByRole('heading', { name: 'Recommendation' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'Best Path Forward' })).toBeVisible();
    await expect(page.locator('text="Weekly Margin"').first()).toBeVisible();
    
    // The scenario comparison table should be visible at the bottom
    await expect(page.locator('text="Scenario Comparison"')).toBeVisible();
    await expect(page.locator('table')).toBeVisible();

    // Confirm Founder Pilot CTA/form is visible
    const pilotForm = page.locator('form[id^="pilot-"]');
    await expect(pilotForm).toBeVisible();
    await expect(page.locator('h2', { hasText: /Turn this result into a founder pilot|Request a founder pilot/ })).toBeVisible();

    // Mock API response for operator page to avoid Railway dependency
    await page.route('**/api/pilot-requests*', async (route) => {
      if (route.request().method() === 'GET') {
        const request = {
          id: 'req_123',
          receivedAt: new Date().toISOString(),
          name: 'Test Founder',
          email: 'test@example.com',
          decision: 'Need to test the pilot workflow',
          operatorStatus: 'new',
        };
        const isDetailRequest = route.request().url().includes('/api/pilot-requests/req_123');
        const json = isDetailRequest ? { request } : { requests: [request] };
        await route.fulfill({ json });
      } else {
        await route.continue();
      }
    });

    // Navigate to operator page
    await page.goto('/operator/pilot-requests');

    // Confirm token input is required
    const tokenInput = page.getByPlaceholder('REUX_DEMO_SETUP_TOKEN');
    await expect(tokenInput).toBeVisible();

    // Enter token and access dashboard
    await tokenInput.fill('mock-token');
    await page.getByRole('button', { name: 'Load' }).click();

    // Confirm lead-management UI and mocked data render
    await expect(page.getByText('Test Founder')).toBeVisible();
    await expect(page.getByText('Need to test the pilot workflow')).toBeVisible();
    await expect(page.getByRole('button', { name: 'New' }).first()).toBeVisible();
  });
});
