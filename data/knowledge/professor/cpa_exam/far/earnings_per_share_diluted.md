# Earnings Per Share - Diluted EPS

## Definition
Diluted EPS shows EPS that would result if all potentially dilutive securities were converted to common stock

## Purpose
Warns investors of potential dilution from conversion of securities

## Formula
```
Diluted EPS = Net Income - Preferred Dividends + Adjustments
              ───────────────────────────────────────────────
              Weighted Avg Shares + Dilutive Potential Shares
```

## Potentially Dilutive Securities
- Stock options and warrants
- Convertible bonds
- Convertible preferred stock
- Contingently issuable shares

## Treasury Stock Method

### Used For
Stock options and warrants

### Assumption
Options/warrants exercised at beginning of year (or grant date if later)
Proceeds used to buy back shares at average market price

### Steps
1. Calculate shares issued upon exercise (number of options × 1)
2. Calculate proceeds from exercise (number of options × exercise price)
3. Calculate shares repurchased (proceeds / average market price)
4. Net shares added to denominator = Shares issued - Shares repurchased

### Formula
```
Incremental Shares = Options × (1 - (Exercise Price / Average Market Price))

OR

Incremental Shares = Options × (Market Price - Exercise Price)
                     ─────────────────────────────────────────
                              Market Price
```

### Only if Dilutive
Include only if exercise price < average market price (options are "in the money")
- If exercise price > market price → Options are antidilutive (ignore)

## If-Converted Method

### Used For
Convertible bonds and convertible preferred stock

### Convertible Bonds

**Numerator Adjustment**:
Add back interest expense (net of tax) that would not have been paid if converted

**Denominator Adjustment**:
Add shares that would be issued upon conversion

**Formula**:
```
Add to numerator: Interest Expense × (1 - Tax Rate)
Add to denominator: Shares from Conversion
```

### Convertible Preferred

**Numerator Adjustment**:
Add back preferred dividends (that were subtracted in basic EPS)

**Denominator Adjustment**:
Add shares that would be issued upon conversion

**Note**: NO tax effect on preferred dividends (dividends not deductible)

### Assumption
Conversion occurred at beginning of year (or issuance date if later)

## Antidilution

### Definition
Security that would INCREASE EPS if included (rather than decrease)

Antidilutive securities **EXCLUDED** from diluted EPS

### Test
If including security **increases** EPS → It's antidilutive (don't include)

### Rule
**Diluted EPS must be LESS THAN OR EQUAL TO basic EPS (never higher)**

## Example 1: Stock Options

### Facts
- Basic EPS: $5.00
- Net income: $500,000
- Weighted avg shares: 100,000
- Stock options outstanding: 10,000 options
- Exercise price: $20
- Average market price: $25

### Treasury Stock Method
```
Shares issued:          10,000
Proceeds:               10,000 × $20 = $200,000
Shares repurchased:     $200,000 / $25 = 8,000
────────────────────────────────────────────
Incremental shares:     10,000 - 8,000 = 2,000
```

### Diluted EPS Calculation
```
$500,000 / (100,000 + 2,000) = $4.90 per share
```

**Dilutive** because $4.90 < $5.00 basic EPS

## Example 2: Convertible Bonds

### Facts
- Basic EPS: $4.00
- Net income: $400,000
- Weighted avg shares: 100,000
- Convertible bonds: $1M face, 6% interest
- Convertible into 20,000 common shares
- Tax rate: 30%

### If-Converted Adjustments
```
Interest expense:        $1,000,000 × 6% = $60,000
Tax effect:              $60,000 × 30% = $18,000
Net interest add-back:   $60,000 - $18,000 = $42,000
Shares added:            20,000
```

### Diluted EPS Calculation
```
($400,000 + $42,000) / (100,000 + 20,000)
= $442,000 / 120,000
= $3.68 per share
```

**Dilutive** because $3.68 < $4.00 basic EPS

## Example 3: Convertible Preferred

### Facts
- Net income: $500,000
- Preferred dividends: $50,000
- Weighted avg shares: 100,000
- Basic EPS: $4.50
- Convertible preferred: Convertible into 15,000 common shares

### If-Converted Adjustments
```
Add back preferred dividends:  $50,000 (NO tax effect)
Shares added:                  15,000
```

### Diluted EPS Calculation
```
($500,000 - $50,000 + $50,000) / (100,000 + 15,000)
= $500,000 / 115,000
= $4.35 per share
```

**Dilutive** because $4.35 < $4.50 basic EPS

## Multiple Securities - Sequential Testing

### Facts
- Net income: $600,000
- No preferred
- Weighted avg shares: 100,000
- Basic EPS: $6.00
- (A) Options: 5,000, exercise $30, avg market $40
- (B) Convertible bonds: $500K face, 8%, convertible to 10,000 shares, tax 30%

### Step 1: Test Options
```
Incremental shares = 5,000 × (1 - $30/$40)
                   = 5,000 × 0.25
                   = 1,250

Impact on EPS = $600,000 / (100,000 + 1,250) = $5.926
```

### Step 2: Test Convertible Bonds
```
Interest add-back = $500,000 × 8% × (1 - 0.30) = $28,000
Shares added = 10,000

Impact on EPS = ($600,000 + $28,000) / (100,000 + 10,000) = $5.709
```

### Order of Inclusion
Include most dilutive first
- Options: $5.926
- Bonds: $5.709 (more dilutive)

### Final Diluted EPS
```
Include bonds:
$628,000 / 110,000 = $5.709 (dilutive vs $6.00)

Then test options:
($628,000 + $0) / (110,000 + 1,250) = $5.645 (still dilutive)

Diluted EPS: $5.645 (include both)
```

## Antidilution Example

### Facts
- Net income: $100,000
- Weighted avg shares: 20,000
- Basic EPS: $3.50 [($100,000 - $30,000) / 20,000]
- Convertible preferred: $30,000 dividends, converts to 3,000 shares

### Test
```
Basic EPS: ($100,000 - $30,000) / 20,000 = $3.50

If converted:
($100,000 - $30,000 + $30,000) / (20,000 + 3,000)
= $100,000 / 23,000
= $4.35
```

### Conclusion
$4.35 > $3.50 → **ANTIDILUTIVE**
- Exclude from diluted EPS
- Diluted EPS = $3.50 (same as basic)

## Contingently Issuable Shares

### Definition
Shares issuable upon meeting certain conditions (e.g., earnings targets, stock price targets)

### Include If
Conditions have been **met** as of end of reporting period

### Do NOT Include If
Conditions not yet met (even if likely to be met in future)

## CPA Exam Tips

1. **Diluted EPS ≤ Basic EPS**
   - If diluted > basic, it's antidilutive (exclude it)

2. **Treasury stock method**: Options/warrants
   - Formula: Options × (1 - Exercise/Market)
   - Only if "in the money" (exercise < market)

3. **If-converted method**: Convertible bonds/preferred
   - Add back interest (net of tax) or dividends
   - Add shares

4. **Test each security individually** for dilution
   - Include only dilutive securities

5. **Multiple securities**: Include most dilutive first
   - Retest others sequentially

6. **Tax effects**:
   - Convertible bonds: Tax-effect the interest add-back
   - Convertible preferred: NO tax effect on dividends

## Calculation Approach

1. Calculate Basic EPS first
2. For each potentially dilutive security:
   - Options: Treasury stock method (incremental shares)
   - Convertible bonds: Add interest × (1-tax), add shares
   - Convertible preferred: Add dividends, add shares
3. Calculate diluted EPS including each security
4. Exclude any antidilutive securities
5. If multiple securities: Include most dilutive first, retest sequentially

## Quick Formulas

### Options Incremental Shares
```
Options × (Market Price - Exercise Price) / Market Price
```

### Convertible Bonds Numerator
```
Add: Interest Expense × (1 - Tax Rate)
```

### Convertible Preferred Numerator
```
Add: Preferred Dividends (no tax adjustment)
```

## Common Mistakes

1. Including antidilutive securities (diluted EPS must be ≤ basic EPS)

2. Forgetting tax effect on convertible bond interest add-back

3. Including options that are out of the money (exercise price > market price)

4. Not testing securities sequentially when multiple potentially dilutive securities exist

5. Using wrong average market price for treasury stock method

## Summary

### Key Points
- Diluted EPS shows potential dilution from conversion of securities
- **Treasury stock method**: Options/warrants (if in the money)
  - Incremental shares = Options × (1 - Exercise/Market)
- **If-converted method**:
  - Convertible bonds: Add interest net of tax, add shares
  - Convertible preferred: Add dividends, add shares
- Exclude antidilutive securities (those that would increase EPS)
- **Diluted EPS ≤ Basic EPS** (never higher)
- Test multiple securities sequentially, include most dilutive first
