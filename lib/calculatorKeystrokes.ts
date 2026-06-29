/**
 * BA II Plus keystroke drawer — topic → exact keystrokes + gotchas.
 *
 * Powers the per-question "calculator quick-ref" the owner asked for: tap a
 * topic and see the precise BA II Plus key sequence and the common mistakes.
 * Keyed by skill (SKILL_TAXONOMY ids) so it can surface automatically for the
 * current item. Pure data + lookup — no app dependency, fully testable.
 *
 * Conventions assumed (set once before a session): P/Y = C/Y = 1, BGN
 * indicator OFF unless an annuity due, money-out negative / money-in positive.
 */

export interface KeystrokeEntry {
  id: string;
  topic: string;
  skills: string[];
  /** ordered keystroke steps */
  steps: string[];
  /** gotchas / reminders */
  notes: string[];
}

export const KEYSTROKES: KeystrokeEntry[] = [
  {
    id: "fv-lump-sum",
    topic: "Future value of a lump sum",
    skills: ["tvm"],
    steps: ["2ND → CLR TVM", "N = years", "I/Y = annual rate", "PV = −present amount", "CPT FV"],
    notes: [
      "PV is entered negative (money out); FV returns positive.",
      "Verify P/Y = 1 and BGN is off.",
    ],
  },
  {
    id: "pv-lump-sum",
    topic: "Present value of a future amount",
    skills: ["tvm"],
    steps: ["2ND → CLR TVM", "N = years", "I/Y = rate", "FV = future amount", "CPT PV"],
    notes: ["Opposite signs on PV and FV, or you get Error 5.", "P/Y = C/Y = 1."],
  },
  {
    id: "ordinary-annuity",
    topic: "Ordinary annuity (PV or FV of level payments)",
    skills: ["tvm"],
    steps: [
      "2ND → CLR TVM",
      "N = number of payments",
      "I/Y = periodic rate",
      "PMT = payment",
      "CPT PV  (or CPT FV)",
    ],
    notes: [
      "END mode (default) for an ordinary annuity — payments at period end.",
      "Keep payment sign consistent with the cash-flow direction.",
    ],
  },
  {
    id: "annuity-due-bgn",
    topic: "Annuity due (payments at the beginning) — BGN mode",
    skills: ["tvm"],
    steps: [
      "2ND → BGN → 2ND → SET (shows BGN) → 2ND → QUIT",
      "2ND → CLR TVM",
      "N, I/Y, PMT",
      "CPT PV (or FV)",
      "When done: 2ND → BGN → 2ND → SET back to END",
    ],
    notes: [
      "The classic trap: forgetting to switch BGN on for an annuity due, or leaving it on for the next problem.",
      "Always set BGN back to END afterward.",
    ],
  },
  {
    id: "semiannual-bond",
    topic: "Bond price / yield (semiannual coupons)",
    skills: ["bond-valuation"],
    steps: [
      "2ND → CLR TVM",
      "N = years × 2",
      "I/Y = annual YTM ÷ 2",
      "PMT = annual coupon ÷ 2",
      "FV = par (usually 1000)",
      "CPT PV  (price; will be negative)",
    ],
    notes: [
      "Halve the rate and the coupon, double the periods for semiannual bonds.",
      "For YTM instead: enter price as −PV and CPT I/Y, then ×2 for the annual yield.",
      "Coupon > YTM → premium; coupon < YTM → discount; equal → par.",
    ],
  },
  {
    id: "npv-irr",
    topic: "NPV and IRR (uneven cash flows) — CF worksheet",
    skills: ["capital-budgeting", "tvm"],
    steps: [
      "CF → 2ND → CLR WORK",
      "CF0 = initial outlay (negative)",
      "C01 = year-1 CF, ENTER ↓; F01 = frequency ↓",
      "repeat for C02/F02 …",
      "NPV → I = discount rate, ENTER ↓ → CPT (NPV)",
      "IRR → CPT",
    ],
    notes: [
      "Use the CF worksheet, not separate PV calcs, to avoid rounding error.",
      "F0x sets how many years a cash flow repeats.",
      "IRR has no rate input — it is computed from the cash flows only.",
    ],
  },
  {
    id: "amortization-balance",
    topic: "Loan balance / amortization",
    skills: ["tvm", "debt-schedule"],
    steps: [
      "Solve the loan as a TVM problem first (CPT PMT)",
      "2ND → AMORT",
      "P1 = first payment number, ENTER ↓",
      "P2 = last payment number, ENTER ↓",
      "↓ to read BAL (remaining balance), PRN (principal), INT (interest)",
    ],
    notes: [
      "Compute PMT before entering AMORT.",
      "BAL after P2 is the balance remaining after that payment.",
    ],
  },
  {
    id: "ear",
    topic: "Effective annual rate (EAR) from a nominal rate",
    skills: ["tvm"],
    steps: [
      "2ND → ICONV",
      "NOM = nominal annual rate, ENTER ↓",
      "C/Y = compounding periods per year, ENTER ↓",
      "EFF → CPT",
    ],
    notes: [
      "ICONV converts between nominal (NOM) and effective (EFF).",
      "More frequent compounding → higher EAR. Continuous: use e^x via 2ND → LN.",
    ],
  },
];

const norm = (s: string) => s.toLowerCase().trim();

/**
 * Find keystroke entries by id, topic substring, or skill id.
 * Returns all matches (id/skill exact-ish first), empty if none.
 */
export function lookup(query: string): KeystrokeEntry[] {
  const q = norm(query);
  if (!q) return [];
  return KEYSTROKES.filter(
    (e) => norm(e.id) === q || e.skills.some((s) => norm(s) === q) || norm(e.topic).includes(q)
  );
}

/** All entries tagged with a given skill id. */
export function bySkill(skill: string): KeystrokeEntry[] {
  const q = norm(skill);
  return KEYSTROKES.filter((e) => e.skills.some((s) => norm(s) === q));
}
