import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run build && npm run start',
    // Deliberately not the homepage: readiness should prove the Next.js
    // process itself is up, not that the database is reachable. /robots.txt
    // is a static, dependency-free route (see src/app/robots.ts) that
    // always returns 200, so a database outage can't block every e2e run
    // from even starting.
    url: 'http://localhost:3000/robots.txt',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
