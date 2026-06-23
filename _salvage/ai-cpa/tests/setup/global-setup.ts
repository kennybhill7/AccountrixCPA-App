import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting Accountrix AI CPA E2E Test Suite...');

  const { baseURL, storageState } = config.projects[0].use;

  // Create a browser instance for setup
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log(`📍 Base URL: ${baseURL}`);

  try {
    // Verify application is accessible
    console.log('🔍 Verifying application accessibility...');
    await page.goto(baseURL || 'http://localhost:3000');

    // Wait for app to be ready
    await page.waitForSelector('h1, [data-testid="app-ready"]', { timeout: 30000 });

    console.log('✅ Application is accessible and ready');

    // Set up any global test data or authentication if needed
    // For now, Accountrix runs without authentication in demo mode

    // Save storage state if authentication was performed
    if (storageState) {
      await context.storageState({ path: storageState as string });
    }

  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }

  console.log('✅ Global setup completed successfully');
}

export default globalSetup;