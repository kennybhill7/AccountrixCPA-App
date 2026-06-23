# Earnings Per Share - Basic EPS

## Overview
Earnings per share (EPS) is one of the most widely watched financial metrics, showing profitability on a per-share basis. Public companies must report EPS.

---

## Who Must Report EPS

**Required for**:
- Public companies
- Complex capital structures (common stock plus potentially dilutive securities)

**Must report**: **BOTH Basic and Diluted EPS**

**Simple capital structure** (only common stock): Report **Basic EPS only**

---

## Basic EPS Formula

```
Basic EPS = Net Income - Preferred Dividends
            ─────────────────────────────────
            Weighted Average Common Shares Outstanding
```

---

## Numerator Calculation

### Start with Net Income
Bottom line from the income statement

### Subtract Preferred Dividends

**Cumulative Preferred**:
- Deduct dividends for current year **whether declared or not**
- Include dividends in arrears if cumulative

**Noncumulative Preferred**:
- Deduct **only if declared**

**Why?**: Preferred dividends reduce income available to common shareholders

### Example
- Net income: $500,000
- Cumulative preferred stock: 10,000 shares, $100 par, 6% dividend rate
- Preferred dividend = 10,000 × $100 × 6% = $60,000
- **Income available to common** = $500,000 - $60,000 = $440,000

---

## Denominator Calculation

### Weighted Average Shares Outstanding

**Formula**:
```
Weighted Average = Σ (Shares Outstanding × Fraction of Year Outstanding)
```

### Key Points
- **Weight by time** outstanding (months or days)
- **Exclude treasury shares**: Outstanding = Issued - Treasury
- Time-weight each change in shares during the year

---

## Stock Dividends and Stock Splits

### Retroactive Adjustment Rule
Stock dividends and splits treated **as if occurred at BEGINNING of year** (or beginning of earliest period presented)

### Apply to All Periods
Adjust weighted average shares for **all periods** presented retroactively

### Example
10% stock dividend on Dec 31
- Adjust **all shares** outstanding during year by 1.10 factor
- As if dividend occurred Jan 1

---

## Calculation Example 1: Basic Weighted Average

### Facts
- Net income: $600,000
- Preferred dividends: $50,000 (cumulative, all paid)
- Share transactions:
  - Jan 1: 100,000 shares outstanding
  - April 1: Issued 20,000 shares
  - July 1: Reacquired 10,000 treasury shares
  - October 1: Reissued 5,000 treasury shares

### Weighted Average Calculation

| Period | Shares | Months | Weighted |
|--------|--------|--------|----------|
| Jan 1 - Mar 31 | 100,000 | 3/12 | 25,000 |
| Apr 1 - Jun 30 | 120,000 | 3/12 | 30,000 |
| Jul 1 - Sep 30 | 110,000 | 3/12 | 27,500 |
| Oct 1 - Dec 31 | 115,000 | 3/12 | 28,750 |
| **Total weighted average** | | | **111,250** |

### Basic EPS Calculation
```
Basic EPS = ($600,000 - $50,000) / 111,250
          = $550,000 / 111,250
          = $4.94 per share
```

---

## Calculation Example 2: Stock Dividend

### Facts
- Net income: $400,000
- No preferred stock
- Share transactions:
  - Jan 1: 100,000 shares outstanding
  - June 30: Issued 20,000 shares for cash
  - Nov 30: 10% stock dividend

### Adjustment for Stock Dividend
**Retroactively adjust** all shares by 1.10 factor (as if stock dividend occurred Jan 1)

### Weighted Average Calculation

| Period | Shares | Adjustment | Adjusted Shares | Months | Weighted |
|--------|--------|------------|-----------------|--------|----------|
| Jan 1 - Jun 29 | 100,000 | × 1.10 | 110,000 | 6/12 | 55,000 |
| Jun 30 - Nov 29 | 120,000 | × 1.10 | 132,000 | 5/12 | 55,000 |
| Nov 30 - Dec 31 | 132,000 | (already adjusted) | 132,000 | 1/12 | 11,000 |
| **Total weighted average** | | | | | **121,000** |

### Basic EPS Calculation
```
Basic EPS = $400,000 / 121,000
          = $3.31 per share
```

---

## Calculation Example 3: Stock Split

### Facts
- Net income: $300,000
- No preferred stock
- Share transactions:
  - Jan 1: 50,000 shares outstanding
  - March 31: 2-for-1 stock split
  - June 30: Issued 10,000 shares for cash

### Adjustment for Split
**Retroactively adjust** all shares before split by factor of 2

### Weighted Average Calculation

| Period | Shares | Adjustment | Adjusted Shares | Months | Weighted |
|--------|--------|------------|-----------------|--------|----------|
| Jan 1 - Mar 30 | 50,000 | × 2 | 100,000 | 3/12 | 25,000 |
| Mar 31 - Jun 29 | 100,000 | (after split) | 100,000 | 3/12 | 25,000 |
| Jun 30 - Dec 31 | 110,000 | — | 110,000 | 6/12 | 55,000 |
| **Total weighted average** | | | | | **105,000** |

### Basic EPS Calculation
```
Basic EPS = $300,000 / 105,000
          = $2.86 per share
```

---

## Discontinued Operations EPS

### Separate Presentation Required
Report EPS separately for:
1. Income from continuing operations
2. Discontinued operations
3. Net income

### Example Format
```
Basic EPS:
  Continuing operations            $3.50
  Discontinued operations          (0.50)
  ─────────────────────────────────────
  Net income                       $3.00
```

---

## Comparative Statements

### Restatement Required
If stock dividend or split occurs, **restate EPS for all prior periods** presented

### Purpose
Ensure comparability across periods

---

## Preferred Stock Considerations

### Cumulative Preferred
Deduct **current year dividends** even if not declared (include dividends in arrears)

### Noncumulative Preferred
Deduct **only dividends actually declared**

### Participating Preferred
Deduct contractual dividends and any participating dividends declared

### Convertible Preferred
- **For basic EPS**: Treat as preferred (deduct dividends)
- **For diluted EPS**: May assume conversion (if dilutive)

---

## Simple vs. Complex Capital Structure

### Simple Capital Structure
- **Only common stock** (no potentially dilutive securities)
- Report **Basic EPS only**
- No diluted EPS required

### Complex Capital Structure
- Has potentially dilutive securities:
  - Stock options
  - Warrants
  - Convertible bonds
  - Convertible preferred
- Must report **both Basic and Diluted EPS**

---

## CPA Exam Tips

1. **Basic EPS** = (NI - Preferred Dividends) / Weighted Avg Shares

2. **Cumulative preferred**: Deduct dividends **whether declared or not**. Noncumulative: Only if declared.

3. **Weighted average**: Weight shares by **time outstanding** (months or days)

4. **Stock dividends and splits**: **Retroactive adjustment** as if occurred at beginning of year

5. **Treasury shares**: **Exclude** from outstanding shares (Outstanding = Issued - Treasury)

6. **Report separate EPS** for continuing ops, discontinued ops, and net income if discontinued ops present

---

## CPA Exam Calculation Steps

### Numerator Steps
1. Start with **net income**
2. Subtract **preferred dividends**:
   - Cumulative: Full amount for the year
   - Noncumulative: Only if declared
3. Result = **Income available to common shareholders**

### Denominator Steps
1. List all share transactions during year
2. Calculate shares outstanding for each period between transactions
3. **If stock dividend/split occurred**: Retroactively adjust all shares before the event
4. **Weight** each period's shares by time outstanding (months/12 or days/365)
5. **Sum** weighted shares = Weighted average

### Stock Dividend/Split Approach
Apply adjustment factor to **ALL shares** outstanding before the stock dividend/split date (as if event occurred at beginning of year)

---

## Common CPA Exam Mistakes

### Mistake 1: Cumulative Preferred
**Wrong**: Not deducting cumulative preferred dividends because not declared
**Correct**: **Always deduct** cumulative preferred dividends (even if not declared)

### Mistake 2: Treasury Shares
**Wrong**: Including treasury shares in outstanding shares
**Correct**: **Exclude** treasury shares (Outstanding = Issued - Treasury)

### Mistake 3: Stock Dividend/Split
**Wrong**: Not retroactively adjusting for stock dividends/splits
**Correct**: **Retroactively adjust** all shares as if event occurred at beginning of year

### Mistake 4: Weighting
**Wrong**: Applying stock dividend adjustment only to shares before the event
**Correct**: Apply adjustment to **all prior months/periods** in the year

---

## Summary

### Key Formulas

```
Basic EPS = Net Income - Preferred Dividends
            ─────────────────────────────────
            Weighted Average Common Shares Outstanding

Weighted Average = Σ (Shares Outstanding × Time Weight)

Outstanding Shares = Issued Shares - Treasury Shares
```

### Key Takeaways

1. **Basic EPS** = (Net Income - Preferred Dividends) / Weighted Average Common Shares Outstanding

2. **Cumulative preferred**: Always deduct dividends. **Noncumulative**: Only if declared.

3. **Weighted average shares**: Weight by time outstanding

4. **Stock dividends and splits**: **Retroactive adjustment** to all shares before event

5. **Outstanding shares** = Issued shares - Treasury shares

6. Report **separate EPS** for continuing operations, discontinued operations, and net income

### Quick Decision Tree

```
Does company have only common stock?
  ├─ YES → Simple capital structure → Report Basic EPS only
  └─ NO (has dilutive securities) → Complex → Report Basic AND Diluted EPS

Are preferred dividends cumulative?
  ├─ YES → Deduct whether declared or not
  └─ NO → Deduct only if declared

Was there a stock dividend or split?
  ├─ YES → Retroactively adjust all shares before the event
  └─ NO → No adjustment needed
```
