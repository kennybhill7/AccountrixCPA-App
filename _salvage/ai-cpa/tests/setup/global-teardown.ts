import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Running Accountrix AI CPA E2E Test Suite cleanup...');

  // Cleanup any global resources created during testing
  // For example: test databases, external services, etc.

  try {
    // Add any cleanup logic here
    console.log('✅ Test cleanup completed successfully');
  } catch (error) {
    console.error('❌ Test cleanup failed:', error);
  }

  console.log('🏁 Accountrix AI CPA E2E Test Suite completed');
}

export default globalTeardown;