/**
 * Method cards — the operational "if you see THIS, do THAT" layer. Each card is
 * a compact play: the trigger wording, the formula, the steps, the classic
 * trap, and one worked example. This is recognition-first teaching (blueprint
 * "Learn" mode) that pairs with the drill engine — read the play, then rep it.
 */

import { SKILL_LABELS, SKILL_AREAS } from "./mastery";

export interface MethodCard {
  skill: string;
  label: string;
  area: string;
  trigger: string;
  formula: string;
  steps: string[];
  trap: string;
  example: string;
}

const RAW: Omit<MethodCard, "label" | "area">[] = [
  {
    skill: "tvm",
    trigger: "a single amount moving across time — “invest today”, “worth in N years”, “value today of a future payment”.",
    formula: "FV = PV(1 + r)^n     PV = FV ÷ (1 + r)^n",
    steps: ["Decide whether you're solving for PV or FV.", "Put r and n on the same time basis.", "Apply the formula (or N, I/Y, PV, FV on the BA II Plus)."],
    trap: "Mixing an annual rate with monthly periods — convert r and n to the same basis first.",
    example: "$1,000 for 5 yrs at 8%: FV = 1000(1.08)^5 = $1,469.33.",
  },
  {
    skill: "interest-rates",
    trigger: "a nominal rate “compounded quarterly/monthly” and they ask for the true/effective rate.",
    formula: "EAR = (1 + i ÷ m)^m − 1",
    steps: ["m = compounding periods per year.", "Divide nominal by m, add 1, raise to the m.", "Subtract 1."],
    trap: "Comparing loans on the nominal rate — always convert to EAR first.",
    example: "12% compounded monthly: (1 + .12/12)^12 − 1 = 12.68%.",
  },
  {
    skill: "capital-budgeting",
    trigger: "a project with an upfront cost and future cash flows; “should we invest?”.",
    formula: "NPV = Σ CFt ÷ (1 + r)^t − CF0   →  accept if NPV > 0",
    steps: ["List each period's cash flow.", "Discount each future flow to today at r.", "Sum them and subtract the initial outlay."],
    trap: "The initial outlay sits at t = 0 (not discounted) — don't discount it twice.",
    example: "−1000, +600, +600 at 10%: −1000 + 600/1.1 + 600/1.21 = +41.32 → accept.",
  },
  {
    skill: "bond-valuation",
    trigger: "a bond with a coupon, face value, YTM, and years to maturity.",
    formula: "Price = PV(coupons, an annuity) + PV(face) at the YTM",
    steps: ["Semiannual? N×2, coupon÷2, YTM÷2.", "N, I/Y, PMT = coupon, FV = face → CPT PV.", "Read the price (mind the sign)."],
    trap: "Semiannual bonds: halve the rate and coupon, double N. Price moves opposite to yield.",
    example: "$1,000 par, 6% coupon, 5 yr, YTM 8% → ~$920 (a discount bond).",
  },
  {
    skill: "risk-return",
    trigger: "beta, a risk-free rate, and a market return; “required / expected return”.",
    formula: "r = rf + β(rm − rf)",
    steps: ["Market risk premium = rm − rf.", "Multiply by beta.", "Add the risk-free rate."],
    trap: "Using rm instead of the premium (rm − rf).",
    example: "rf 3%, β 1.2, rm 9%: 3 + 1.2(6) = 10.2%.",
  },
  {
    skill: "cost-of-capital",
    trigger: "a firm financed with debt and equity; “weighted average cost of capital”.",
    formula: "WACC = wd · rd(1 − T) + we · re",
    steps: ["Weights = each source ÷ total capital.", "After-tax cost of debt = rd(1 − T).", "Weight each and sum."],
    trap: "Forgetting the (1 − T) tax shield on debt; using book weights when market weights are given.",
    example: "60% equity @12%, 40% debt @7%, T = 25%: .6(12) + .4(7)(.75) = 9.3%.",
  },
  {
    skill: "stock-valuation",
    trigger: "a dividend that grows at a constant rate forever.",
    formula: "P0 = D1 ÷ (r − g)",
    steps: ["D1 = next year's dividend (D0 × (1 + g) if you're given D0).", "Subtract g from r.", "Divide."],
    trap: "Using D0 instead of D1; the model needs r > g.",
    example: "D1 $2, r 10%, g 4%: 2 ÷ .06 = $33.33.",
  },
  {
    skill: "dupont",
    trigger: "“decompose ROE” into margin, turnover, and leverage.",
    formula: "ROE = Net Margin × Asset Turnover × Equity Multiplier",
    steps: ["Net margin = NI ÷ Sales.", "Turnover = Sales ÷ Assets.", "Multiplier = Assets ÷ Equity.", "Multiply the three."],
    trap: "Margin × turnover = ROA; × multiplier = ROE. Don't double-count sales.",
    example: "10% × 2.0 × 1.5 = 30% ROE.",
  },
  {
    skill: "ratio-analysis",
    trigger: "any “X ratio” — current, quick, turnover, debt-to-equity.",
    formula: "ratio = numerator ÷ denominator (know which is which)",
    steps: ["Identify the two line items the ratio names.", "Divide.", "Read it as a multiple."],
    trap: "Quick ratio excludes inventory; current includes it. Inventory turnover uses COGS, AR turnover uses Sales.",
    example: "CA 300k ÷ CL 150k = 2.0 current ratio.",
  },
  {
    skill: "depreciation",
    trigger: "an asset's cost, salvage value, and life; “annual depreciation”.",
    formula: "SL = (cost − salvage) ÷ life     DDB yr1 = cost × (2 ÷ life)",
    steps: ["Straight-line: subtract salvage, divide by life.", "DDB: apply 2/life to book value, ignore salvage in the rate."],
    trap: "DDB ignores salvage in the rate but never depreciates below salvage.",
    example: "$50k, $5k salvage, 5 yr straight-line = $9,000/yr.",
  },
  {
    skill: "inventory",
    trigger: "beginning inventory, purchases, and ending inventory; “COGS”.",
    formula: "COGS = Beginning + Purchases − Ending",
    steps: ["Start with beginning inventory.", "Add purchases.", "Subtract ending inventory."],
    trap: "Rising prices: FIFO → lower COGS / higher profit; LIFO → higher COGS / lower tax.",
    example: "20k + 100k − 30k = $90k COGS.",
  },
  {
    skill: "eps",
    trigger: "net income, preferred dividends, and shares; “basic EPS”.",
    formula: "EPS = (NI − preferred dividends) ÷ weighted-average common shares",
    steps: ["Subtract preferred dividends from net income.", "Divide by weighted-average common shares."],
    trap: "Forgetting to remove preferred dividends; using year-end shares instead of the weighted average.",
    example: "$1.0M NI, $100k preferred, 300k shares = $3.00.",
  },
  {
    skill: "cvp",
    trigger: "fixed costs, price, and variable cost; “break-even” or “target profit”.",
    formula: "BE units = FC ÷ (price − VC)     CM ratio = (price − VC) ÷ price",
    steps: ["CM per unit = price − variable cost.", "Break-even = FC ÷ CM per unit.", "Target profit: (FC + profit) ÷ CM per unit."],
    trap: "Wanting units but dividing by the CM ratio — divide FC by CM per unit for units.",
    example: "FC $60k, price $50, VC $30: 60,000 ÷ 20 = 3,000 units.",
  },
  {
    skill: "financial-statements",
    trigger: "“ending retained earnings” or statement articulation.",
    formula: "Ending RE = Beginning RE + Net Income − Dividends",
    steps: ["Start with beginning retained earnings.", "Add net income.", "Subtract dividends declared."],
    trap: "Dividends declared (not just paid) reduce RE; net income flows in from the income statement.",
    example: "$200k + $160k − $30k = $330k.",
  },
  {
    skill: "cost-behavior",
    trigger: "high and low activity levels with total costs; “variable cost per unit”.",
    formula: "VC per unit = (cost_high − cost_low) ÷ (units_high − units_low)",
    steps: ["Take the highest and lowest ACTIVITY points.", "Δcost ÷ Δunits = variable rate.", "Fixed = total − VC × units at either point."],
    trap: "Use the highest/lowest activity (units), not the highest/lowest cost.",
    example: "(90k − 50k) ÷ (10k − 2k) = $5/unit.",
  },
  {
    skill: "performance",
    trigger: "operating income and invested capital; “ROI” or “residual income”.",
    formula: "ROI = operating income ÷ invested capital     RI = income − (rate × investment)",
    steps: ["ROI: divide income by investment.", "RI: subtract a capital charge (rate × investment) from income."],
    trap: "ROI can reject good projects that beat the firm's hurdle rate; residual income fixes that.",
    example: "$200k income on $2M = 10% ROI.",
  },
];

export const METHODS: MethodCard[] = RAW.map((m) => ({
  ...m,
  label: SKILL_LABELS[m.skill] ?? m.skill,
  area: SKILL_AREAS[m.skill] ?? "Other",
}));

export function methodFor(skill: string): MethodCard | undefined {
  return METHODS.find((m) => m.skill === skill);
}
