/** Flat route registry for the command palette (⌘K) and quick navigation. */
export interface NavRoute {
  label: string;
  href: string;
  group: string;
  keywords?: string;
}

export const ALL_ROUTES: NavRoute[] = [
  // Daily loop
  { label: "Today", href: "/", group: "Daily", keywords: "home session start dashboard" },
  {
    label: "Study Plan",
    href: "/planner",
    group: "Daily",
    keywords: "planner schedule exam date calendar day by day",
  },
  {
    label: "Mock Exam",
    href: "/exam",
    group: "Daily",
    keywords: "timed simulated test practice exam score pass",
  },
  { label: "Practice", href: "/practice", group: "Daily", keywords: "drill mcq weak spots reps" },
  {
    label: "Method Cards",
    href: "/methods",
    group: "Daily",
    keywords: "formula recall if you see this trap",
  },
  {
    label: "Calculator Lab",
    href: "/calculator",
    group: "Daily",
    keywords: "ba ii plus keystrokes tvm",
  },
  {
    label: "Apply Lab",
    href: "/apply",
    group: "Daily",
    keywords: "cases workpapers controller cfo",
  },
  { label: "Mastery", href: "/mastery", group: "Daily", keywords: "readiness progress exam ready" },
  {
    label: "Notebook",
    href: "/scratchpad",
    group: "Daily",
    keywords: "handwriting apple pencil scratch",
  },
  // Lessons & tracks
  {
    label: "Learn (CMA)",
    href: "/learn",
    group: "Lessons",
    keywords: "curriculum months weeks path",
  },
  {
    label: "Finance",
    href: "/finance",
    group: "Lessons",
    keywords: "corporate finance tvm bonds wacc",
  },
  { label: "CPA Lessons", href: "/cpa", group: "Lessons", keywords: "far aud reg bar isc tcp" },
  {
    label: "CPA Practice",
    href: "/crossover",
    group: "Lessons",
    keywords: "mcq exam questions bank",
  },
  {
    label: "Flashcards",
    href: "/flashcards",
    group: "Lessons",
    keywords: "srs spaced repetition deck",
  },
  { label: "Study Tracks", href: "/tracks", group: "Lessons", keywords: "paths overview" },
  // Diagnose & review
  {
    label: "Diagnostic",
    href: "/diagnostic",
    group: "Review",
    keywords: "assessment weak areas placement",
  },
  { label: "Readiness", href: "/readiness", group: "Review", keywords: "exam ready score" },
  { label: "Mistakes", href: "/mistakes", group: "Review", keywords: "review queue missed errors" },
  {
    label: "Review Mode",
    href: "/review",
    group: "Review",
    keywords: "workpaper defect catch the error sign off tick and tie reviewer",
  },
  { label: "Mission Control", href: "/mission", group: "Review", keywords: "plan today weekly" },
  { label: "Reference", href: "/reference", group: "Review", keywords: "formulas cheat sheet" },
  // Apply & tools
  {
    label: "WIP schedule case",
    href: "/apply/meridian-building-group/wip-schedule",
    group: "Controller",
    keywords: "percentage of completion underbilled",
  },
  {
    label: "Bank rec case",
    href: "/apply/meridian-building-group/bank-rec",
    group: "Controller",
    keywords: "reconciliation cash outstanding",
  },
  {
    label: "Month-end close case",
    href: "/apply/meridian-building-group/month-end-close",
    group: "Controller",
    keywords: "close journal entries",
  },
  {
    label: "AP aging case",
    href: "/apply/meridian-building-group/ap-aging",
    group: "Controller",
    keywords: "payables disbursement",
  },
  {
    label: "Cash forecast case",
    href: "/apply/meridian-building-group/cash-forecast",
    group: "Controller",
    keywords: "13 week liquidity",
  },
  {
    label: "Chart of Accounts builder",
    href: "/coa-builder",
    group: "Controller",
    keywords: "coa gl accounts",
  },
  {
    label: "Cost-code → WIP simulator",
    href: "/tools/cost-codes",
    group: "Controller",
    keywords: "job cost posting",
  },
  { label: "Simulations", href: "/sims", group: "Controller", keywords: "tbs essay task based" },
  // Account & info
  { label: "Profile", href: "/profile", group: "Account", keywords: "stats xp streak" },
  {
    label: "Settings",
    href: "/settings",
    group: "Account",
    keywords: "export import sync preferences",
  },
  { label: "Notes", href: "/notes", group: "Account", keywords: "typed notes" },
  { label: "Search", href: "/search", group: "Account", keywords: "find lessons" },
  {
    label: "All Pages",
    href: "/map",
    group: "Account",
    keywords: "sitemap routes index everything",
  },
  { label: "Help", href: "/help", group: "Account", keywords: "faq support" },
];
