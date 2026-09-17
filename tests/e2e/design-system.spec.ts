import { test, expect, type Page } from "@playwright/test";

/**
 * Drafting-table design-system regression checks (handoff §6 verification
 * checklist). Manually re-running these three checks by hand for every route
 * this pass touched is exactly the kind of thing that regresses silently the
 * next time someone adds a button — this codifies them so CI catches it
 * instead of the next design review.
 *
 * Sweeps the whole page (document.body), not just <main> — an earlier
 * version of this test scoped to <main> only, which missed three globally-
 * mounted overlays (AskAI, SmartNotes, ScratchpadOverlay — all rendered as
 * siblings of AppShell in app/layout.tsx, outside <main>, on every route)
 * that were carrying --primary/gradient fills undetected on every single
 * page. Caught live via a manual scan of app/layout.tsx, not by this test,
 * which is exactly why the scope was widened afterward.
 *
 * Three checks per route:
 *   1. The accent color (--primary) renders on at most one element, EXCEPT
 *      an element explicitly marked data-brand="logo" — the nav rail's
 *      Accountrix wordmark is a deliberate letterhead signature, not page
 *      content competing for the one-accent budget rule 4.4 governs.
 *   2. No element casts a box-shadow, EXCEPT an element explicitly marked
 *      data-elevation="fab" — a circular (or pill) floating-action-button
 *      trigger's shadow is a real elevation/interaction cue (it signals
 *      "this floats above the page"), not decorative surface styling, so
 *      it's a documented, deliberate exception rather than a bug. Currently:
 *      the AskAI tutor trigger, the ScratchpadOverlay pencil trigger, and
 *      the SmartNotes trigger.
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
  "/calculator",
  "/apply",
  "/exam",
  "/mastery",
  "/scratchpad",
  "/learn",
  "/mistakes",
  "/finance",
  "/cpa",
];

interface Sweep {
  accentCount: number;
  accentSamples: string[];
  shadowCount: number;
  radiusOffenders: string[];
}

async function sweepPage(page: Page): Promise<Sweep> {
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

    const els = document.body.querySelectorAll("*");

    let shadowCount = 0;
    const radiusOffenders: string[] = [];
    const accentSamples: string[] = [];

    els.forEach((el) => {
      const cls = el.className.toString();
      const st = getComputedStyle(el);

      if (st.boxShadow && st.boxShadow !== "none" && el.getAttribute("data-elevation") !== "fab") {
        shadowCount++;
      }

      const radius = parseFloat(st.borderTopLeftRadius);
      if (radius > 2 && !cls.includes("rounded-full")) {
        radiusOffenders.push(`${el.tagName}.${cls.slice(0, 60)}`);
      }

      if (
        (st.color === target || st.backgroundColor === target || st.borderColor === target) &&
        el.getAttribute("data-brand") !== "logo"
      ) {
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

    const { accentCount, accentSamples, shadowCount, radiusOffenders } = await sweepPage(page);

    // At most one accent element (rule 4.4). Zero is fine — not every route
    // has a live primary CTA in every state (e.g. an empty-state screen).
    expect(
      accentCount,
      `expected at most 1 accent element on the page, found ${accentCount}: ${accentSamples.join(", ")}`
    ).toBeLessThanOrEqual(1);

    expect(
      shadowCount,
      'expected 0 box-shadow elements on the page (excluding data-elevation="fab")'
    ).toBe(0);

    expect(
      radiusOffenders.length,
      `expected 0 radius offenders (>2px, non-circular) on the page, found: ${radiusOffenders.join(", ")}`
    ).toBe(0);
  });
}
