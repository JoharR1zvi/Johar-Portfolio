import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// WCAG 2.2 AA is the project's accessibility target (docs/architecture.md).
// English only: these are structural/semantic checks (landmarks, contrast,
// labels, heading order), not translation correctness, so locale doesn't
// change the result. /projects/f1-race-predictor is a stand-in for the
// dynamic case-study route — any published slug would do.
const PAGES = [
  '/en',
  '/en/projects',
  '/en/projects/f1-race-predictor',
  '/en/resume',
  '/en/lab',
  '/en/lab/f1-explorer',
  '/en/lab/swiggy-simulator',
  '/en/notes',
  '/en/privacy',
];

for (const path of PAGES) {
  test(`${path} has no automatically detectable accessibility violations`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });
}
