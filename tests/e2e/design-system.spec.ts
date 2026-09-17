import { test, expect, type Page } from "@playwright/test";

/**
 * Drafting-table design-system regression checks (handoff §6 verification
 * checklist). Manually re-running these three checks by hand for every route
 * this pass touched is exactly the kind of thing that regresses silently the
 * next time someone adds a button — this codifies them so CI catches it
 * instead of the next design review.
 *
 * Three checks per route, matched against <main> only (the persistent
 * AppShell nav rail intentionally carries its own permanent ink "you are
 * here" marker outside this budget — see components/glass/AppShell.tsx):
 *   1. The accent color (--primary) renders on at most one element.
 *   2. No element casts a box-shadow.
 *   3. No element has a border-radius over 2px, except fully round controls
 *      (rounded-full pills/avatars are exempt by design).
 */

const ROUTES = [
  "/",
  "/mission",
  "/practice",
  "/review",
  "/review/equipment-yard-allocation",
  "/readiness",
  "/planner",
  "/learn/m1/w1",
];

interface Sweep {
  accentCount: number;
  accentSamples: string[];
  shadowCount: number;
  radiusOffenders: string[];
}

async function sweepMain(page: Page): Promise<Sweep> {
  return page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const [h, s, l] = root
      .getPropertyValue("--primary")
      .trim()
      .split(" ")
      .map((v) => parseFloat(v));
    // Manual HSL->RGB so this matches the browser's own computed-style
    // serialization (rgb(...)), not a hex/hsl string comparison.
    function hslToRgb(h: number, s: number, l: number) {
      s /= 100;
      l /= 100;
      const k = (n: number) => (n + h / 30) % 12;
      const a = s * Math.min(l, 1 - l);
      const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
      return [f(0), f(8), f(4)].map((x) => Math.round(x * 255));
    }
    const [r, g, b] = hslToRgb(h, s, l);
    const target = `rgb(${r}, ${g}, ${b})`;

    const main = document.querySelector("main");
    const els = main ? main.querySelectorAll("*") : document.querySelectorAll("nothing");

    let shadowCount = 0;
    const radiusOffenders: string[] = [];
    const accentSamples: string[] = [];

    els.forEach((el) => {
      const cls = el.className.toString();
      const st = getComputedStyle(el);

      if (st.boxShadow && st.boxShadow !== "none") shadowCount++;

      const radius = parseFloat(st.borderTopLeftRadius);
      if (radius > 2 && !cls.includes("rounded-full")) {
        radiusOffenders.push(`${el.tagName}.${cls.slice(0, 60)}`);
      }

      if (st.color === target || st.backgroundColor === target || st.borderColor === target) {
        accentSamples.push(`${el.tagName}.${cls.slice(0, 60)}`);
      }
    });

    return { accentCount: accentSamples.length, accentSamples, shadowCount, radiusOffenders };
  });
}

for (const route of ROUTES) {
  test(`design system — ${route}`, async ({ page }) => {
    await page.goto(route);
    await page.waitForLoadState("networkidle");

    const { accentCount, accentSamples, shadowCount, radiusOffenders } = await sweepMain(page);

    // At most one accent element (rule 4.4). Zero is fine — not every route
    // has a live primary CTA in every state (e.g. an empty-state screen).
    expect(
      accentCount,
      `expected at most 1 accent element in <main>, found ${accentCount}: ${accentSamples.join(", ")}`
    ).toBeLessThanOrEqual(1);

    expect(shadowCount, "expected 0 box-shadow elements in <main>").toBe(0);

    expect(
      radiusOffenders.length,
      `expected 0 radius offenders (>2px, non-circular) in <main>, found: ${radiusOffenders.join(", ")}`
    ).toBe(0);
  });
}
