# Dividends and Stock Splits

## Overview
Understanding dividends and stock splits is essential for properly accounting for distributions to shareholders and changes in capital structure.

---

## Important Dates

### Declaration Date
**When**: Board of directors declares the dividend

**Accounting**: Record dividend liability

**Entry**:
```
DR Retained Earnings
   CR Dividends Payable
```

**Important**: Creates **legal liability** to pay dividend

### Date of Record
**When**: Date to determine who receives dividend

**Shareholders on this date**: Will receive the dividend

**Accounting**: **NO entry** (informational only)

**Note**: Stock price usually drops on ex-dividend date (1 business day before record date)

### Payment Date
**When**: Dividend actually paid to shareholders

**Accounting**: Pay the dividend liability

**Entry**:
```
DR Dividends Payable
   CR Cash
```

---

## Cash Dividends

### Description
Distribution of cash to shareholders

### Accounting

**Declaration**:
```
DR Retained Earnings
   CR Dividends Payable (or Cash Dividend Payable)
```

**Payment**:
```
DR Dividends Payable
   CR Cash
```

### Effect on Equity
- Reduces retained earnings
- Reduces total stockholders' equity

### Example
Declare $1 per share cash dividend on 10,000 outstanding shares.

**Declaration**:
```
DR Retained Earnings            $10,000
   CR Dividends Payable                 $10,000
```

**Payment**:
```
DR Dividends Payable            $10,000
   CR Cash                              $10,000
```

---

## Property Dividends

### Description
Distribution of non-cash assets (inventory, investments, equipment)

### Measurement
Record at **FAIR VALUE** of asset distributed

### Gain or Loss
Recognize gain/loss if FV ≠ book value of asset

### Accounting

**Declaration**:
1. Adjust asset to fair value (recognize gain/loss)
2. Record dividend at fair value

**Payment**:
```
DR Property Dividend Payable
   CR Asset
```

### Example
Declare dividend of investment securities. Book value $8,000, Fair value $10,000.

**Declaration**:
```
Step 1: Adjust to FV
DR Investment                     $2,000
   CR Gain on Investment                  $2,000

Step 2: Record dividend
DR Retained Earnings             $10,000
   CR Property Dividend Payable          $10,000
```

**Payment**:
```
DR Property Dividend Payable     $10,000
   CR Investment                         $10,000
```

---

## Stock Dividends

### Definition
Distribution of additional shares to existing shareholders (not cash)

### Small Stock Dividend (<20-25%)

**Size**: Less than 20-25% of outstanding shares

**Measurement**: Use **FAIR VALUE** (market price) per share

**Entry**:
```
DR Retained Earnings (shares × FV)
   CR Common Stock Dividend Distributable (shares × par)
   CR Additional Paid-in Capital (plug)
```

**Example**:
10% stock dividend. 10,000 shares outstanding, $1 par, market $20. Distribute 1,000 shares.

```
DR Retained Earnings             $20,000  (1,000 × $20)
   CR Common Stock Div Distrib            $ 1,000  (1,000 × $1)
   CR APIC                                 19,000
```

### Large Stock Dividend (≥20-25%)

**Size**: 20-25% or more of outstanding shares

**Measurement**: Use **PAR VALUE** per share (not market value)

**Entry**:
```
DR Retained Earnings (shares × par)
   CR Common Stock Dividend Distributable (shares × par)
```

**Example**:
30% stock dividend. 10,000 shares outstanding, $1 par. Distribute 3,000 shares.

```
DR Retained Earnings              $3,000  (3,000 × $1)
   CR Common Stock Div Distrib             $3,000
```

### Distribution Entry (Both Small and Large)
When shares actually distributed:
```
DR Common Stock Dividend Distributable
   CR Common Stock
```

### Effects
- **Reclassifies within equity** (RE to Common Stock and APIC)
- **Total equity UNCHANGED**
- **No cash effect** - stock dividends do NOT reduce assets or total equity

---

## Stock Splits

### Definition
Increase in number of shares outstanding with proportional decrease in par value per share

### Accounting
**NO journal entry** (memo entry only)

### Effect
- Proportionally increases shares outstanding
- Proportionally decreases par value per share
- **Total par value of common stock UNCHANGED**

### Example: 2-for-1 Stock Split
**Before split**:
- 10,000 shares outstanding
- $10 par value
- Common Stock account: $100,000

**After split**:
- 20,000 shares outstanding
- $5 par value
- Common Stock account: $100,000 (unchanged)

**Entry**: None (memo entry only)

### Comparison to Stock Dividend
- **Stock splits**: No entry, par value changes
- **Stock dividends**: Entry required to reclassify RE, par value per share unchanged

---

## Reverse Stock Split

### Definition
Decrease in shares outstanding, proportional increase in par value

### Example: 1-for-2 Reverse Split
**Before**:
- 10,000 shares, $1 par

**After**:
- 5,000 shares, $2 par

### Accounting
**NO journal entry** (memo entry only)

### Purpose
Often used to increase stock price (when trading below $1, at risk of delisting from exchange)

---

## Comparison Table

| Type | Entry Required? | Total Equity | Shares Outstanding | Par Value per Share |
|------|----------------|--------------|-------------------|-------------------|
| **Cash dividend** | Yes (DR RE, CR Cash) | **Decreases** | No change | No change |
| **Small stock div** | Yes (DR RE at FV) | No change | Increases | No change |
| **Large stock div** | Yes (DR RE at par) | No change | Increases | No change |
| **Stock split** | **NO entry** (memo only) | No change | Increases | **Decreases proportionally** |

---

## Other Dividend Types

### Liquidating Dividend

**Definition**: Dividend that exceeds retained earnings (returns capital to shareholders)

**Entry**:
```
DR Retained Earnings (up to available balance)
DR Additional Paid-In Capital (remainder)
   CR Dividends Payable
```

**Disclosure**: Must disclose to shareholders that dividend is liquidating (returning capital)

### Scrip Dividend

**Definition**: Promissory note (IOU) to pay dividend in future

**Entry**:
```
DR Retained Earnings
   CR Notes Payable (or Scrip Dividend Payable)
```

**Interest**: May accrue interest until paid

---

## Complex Example

### Facts
- 100,000 shares outstanding, $2 par, market $30
- Board declares:
  1. 5% stock dividend
  2. $0.50 per share cash dividend (after stock dividend)

### Step 1: Stock Dividend (Small - 5%)

Shares issued: 5,000 (100,000 × 5%)

```
DR Retained Earnings            $150,000  (5,000 × $30 FV)
   CR Common Stock Div Distrib            $ 10,000  (5,000 × $2 par)
   CR APIC                                 140,000
```

### Step 2: Distribution of Stock Dividend

```
DR Common Stock Div Distrib      $10,000
   CR Common Stock                        $10,000
```

Now 105,000 shares outstanding.

### Step 3: Cash Dividend

Calculation: 105,000 shares × $0.50 = $52,500

```
DR Retained Earnings             $52,500
   CR Dividends Payable                   $52,500
```

### Total RE Reduction
$150,000 (stock div) + $52,500 (cash div) = $202,500

---

## CPA Exam Tips

1. **Declaration date** creates liability (record entry). **Record date** = no entry. **Payment date** = pay liability.

2. **Small stock dividend** (<20-25%): Use **FAIR VALUE**. Large (≥20-25%): Use **PAR VALUE**.

3. **Stock split**: **NO entry** (memo only), par value changes

4. **Stock dividend**: Entry required (DR RE, CR CS Div Dist), par value per share stays same

5. **Property dividend**: Record at **FV**, recognize gain/loss on asset

6. **Treasury stock doesn't receive dividends** (only outstanding shares)

---

## Common CPA Exam Mistakes

### Mistake 1: Stock Dividend Measurement
**Wrong**: Using FV for large stock dividend
**Correct**: Large stock dividend (≥20-25%) uses **PAR VALUE**

### Mistake 2: Stock Split Entry
**Wrong**: Recording journal entry for stock split
**Correct**: Stock split requires **NO entry** (memo only)

### Mistake 3: Subsequent Cash Dividend
**Wrong**: Forgetting to multiply cash dividend by new shares outstanding after stock dividend
**Correct**: Calculate based on **shares outstanding after** stock dividend

### Mistake 4: Treasury Shares
**Wrong**: Including treasury shares in dividend calculations
**Correct**: Only **outstanding shares** receive dividends (issued - treasury)

---

## CPA Exam Decision Framework

### Is it cash?
- **Yes** → Cash dividend: DR RE, CR Div Payable

### Is it stock?
- **Less than 20-25%?**
  - Yes → Small stock div: Use **FV**
  - No → Large stock div: Use **PAR**

### Does par value change?
- **Yes** → Stock split: **NO entry**
- **No** → Stock dividend: **Entry required**

---

## Summary

### Key Takeaways

1. **Declaration date**: Record liability. **Record date**: No entry. **Payment date**: Pay liability.

2. **Cash dividend**: Reduces RE and total equity

3. **Small stock dividend** (<20-25%): DR RE at **fair value**

4. **Large stock dividend** (≥20-25%): DR RE at **par value**

5. **Stock split**: **No entry**, par value changes proportionally

6. **Property dividend**: Use **FV**, recognize gain/loss

7. **Stock dividends and splits** don't reduce total equity (only reclassify)

### Quick Reference

| Dividend Type | Measurement | Entry? | Equity Effect |
|--------------|-------------|--------|---------------|
| Cash | N/A | Yes | Decreases |
| Property | Fair Value | Yes | Decreases |
| Small Stock | Fair Value | Yes | No change |
| Large Stock | Par Value | Yes | No change |
| Stock Split | N/A | No | No change |
