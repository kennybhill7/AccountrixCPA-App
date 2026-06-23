# Share-Based Compensation - ASC 718

## Overview

### Fundamental Principle
Stock-based compensation measured at **GRANT DATE FAIR VALUE** and recognized as expense over the **vesting/service period**

### Scope
- Employee stock options
- Restricted stock
- Restricted stock units (RSUs)
- Stock appreciation rights (SARs)
- Employee stock purchase plans (ESPP)

### Measurement Date
**Grant date**: When employer and employee reach mutual understanding of terms

### No Remeasurement
Generally no remeasurement after grant date (except for liability-classified awards)

## Stock Options

### Grant Date Fair Value
Estimated using **option pricing model**:
- Black-Scholes model
- Binomial model

### Factors in Valuation
1. Stock price at grant date
2. Exercise price (strike price)
3. Expected term (life of option)
4. Expected volatility
5. Risk-free interest rate
6. Expected dividends

### Recognition
**Expense grant date fair value ratably over vesting period**

### Journal Entries

**At Grant Date**:
```
Memorandum entry only (no journal entry until expense recognized)
```

**During Vesting Period** (each period):
```
DR Compensation Expense                      $XXX
   CR Additional Paid-in Capital - Stock Options    $XXX
```

**At Exercise**:
```
DR Cash (exercise price × shares)            $XXX
DR APIC - Stock Options (amount accumulated)  XXX
   CR Common Stock (par value)                      $XXX
   CR APIC (excess over par)                         XXX
```

**If Forfeited** (reverse previously recognized compensation):
```
DR APIC - Stock Options                      $XXX
   CR Compensation Expense                          $XXX
```

### Example - Basic Stock Options

**Facts**:
- Grant 1,000 options on 1/1/Year 1
- Fair value: $10 per option
- Vest ratably over 3 years (cliff vesting)
- Exercise price: $25 per share
- Par value: $1 per share

**Total Compensation Cost**:
```
1,000 options × $10 = $10,000
```

**Annual Expense**:
```
$10,000 / 3 years = $3,333 per year (approximately)
```

**Entries**:

**Year 1**:
```
DR Compensation Expense           $3,333
   CR APIC - Stock Options               $3,333
```

**Year 2**:
```
DR Compensation Expense           $3,333
   CR APIC - Stock Options               $3,333
```

**Year 3**:
```
DR Compensation Expense           $3,334
   CR APIC - Stock Options               $3,334
```

**Cumulative after 3 years**:
- Compensation expense: $10,000
- APIC - Stock Options: $10,000

**Employee Exercises All Options** (assume stock price now $40):
```
DR Cash (1,000 × $25)            $25,000
DR APIC - Stock Options           10,000
   CR Common Stock (1,000 × $1)           $ 1,000
   CR APIC                                 34,000
```

## Vesting Approaches

### Cliff Vesting
**All options vest at once** after service period

**Example**: 1,000 options vest after 3 years (all or nothing)

**Expense Recognition**: Straight-line over 3 years

### Graded Vesting
**Options vest in tranches**

**Example**:
- 1,000 options total
- 333 vest end of Year 1
- 333 vest end of Year 2
- 334 vest end of Year 3

**Accounting Choice**:

**1. Straight-Line Method** (simpler):
- Treat as single award
- Expense evenly over total vesting period
- Same as cliff vesting

**2. Accelerated (Graded) Method**:
- Treat each tranche separately
- Front-loads expense

**Example - Graded Vesting with Accelerated Method**:
```
Tranche 1 (333 options, FV $10, vest Year 1):
  Year 1 expense: 333 × $10 = $3,330

Tranche 2 (333 options, FV $10, vest Year 2):
  Year 1 expense: (333 × $10) / 2 = $1,665
  Year 2 expense: (333 × $10) / 2 = $1,665

Tranche 3 (334 options, FV $10, vest Year 3):
  Year 1 expense: (334 × $10) / 3 = $1,113
  Year 2 expense: (334 × $10) / 3 = $1,113
  Year 3 expense: (334 × $10) / 3 = $1,114

Total by Year:
  Year 1: $3,330 + $1,665 + $1,113 = $6,108
  Year 2: $1,665 + $1,113 = $2,778
  Year 3: $1,114
  Total: $10,000
```

### Performance Vesting
Vesting contingent on performance targets (e.g., revenue, stock price)

**Accounting**:
- Estimate probability of achievement
- Adjust compensation expense if estimates change
- True-up at vesting date

## Restricted Stock Units (RSUs)

### Definition
**Promise to deliver shares in future** (upon vesting)

**Key Difference from Options**: No exercise price; employee receives shares directly upon vesting

### Grant Date Valuation
```
Fair value = Number of units × Stock price at grant date
```

### Accounting
Same as options - expense fair value over vesting period

### At Vesting
Issue shares:
```
DR APIC - RSUs                            $XXX
   CR Common Stock (par)                         $XXX
   CR APIC (excess)                               XXX
```

### RSUs vs. Restricted Stock
- **RSUs**: No shares issued until vesting. If employee leaves, no shares ever issued.
- **Restricted Stock**: Shares issued at grant, but subject to forfeiture if employee leaves before vesting.

### Example - RSUs

**Facts**:
- Grant 500 RSUs on 1/1/Year 1
- Stock price at grant: $30
- Vest after 2 years
- Par value: $1

**Total Compensation**:
```
500 RSUs × $30 = $15,000
```

**Annual Expense**:
```
$15,000 / 2 years = $7,500 per year
```

**Entries**:

**Year 1**:
```
DR Compensation Expense           $7,500
   CR APIC - RSUs                        $7,500
```

**Year 2**:
```
DR Compensation Expense           $7,500
   CR APIC - RSUs                        $7,500
```

**At Vesting** (end of Year 2):
```
DR APIC - RSUs                   $15,000
   CR Common Stock (500 × $1)            $  500
   CR APIC                                14,500
```

## Restricted Stock

### Definition
**Actual shares issued at grant**, but subject to **forfeiture** if employee leaves before vesting

### At Grant
```
DR Unearned Compensation (contra-equity)     $XXX
   CR Common Stock (par)                            $XXX
   CR APIC (excess over par)                         XXX
```

### During Vesting Period
```
DR Compensation Expense                      $XXX
   CR Unearned Compensation                        $XXX
```

### Dividends During Vesting
If paid to employees holding unvested shares, **treat as additional compensation expense**

### Example - Restricted Stock

**Facts**:
- Issue 1,000 restricted shares on 1/1/Year 1
- Stock price: $20
- Par value: $1
- Vest after 2 years

**At Grant**:
```
DR Unearned Compensation (contra-equity)  $20,000
   CR Common Stock (1,000 × $1)                  $ 1,000
   CR APIC                                        19,000
```

**Year 1**:
```
DR Compensation Expense                   $10,000
   CR Unearned Compensation                     $10,000
```

**Year 2**:
```
DR Compensation Expense                   $10,000
   CR Unearned Compensation                     $10,000
```

**After vesting**, shares are fully vested and unrestricted

## Employee Stock Purchase Plans (ESPP)

### Description
Employees purchase stock at a discount (typically 85% of market, or 15% discount)

### Compensatory vs. Non-Compensatory

**Non-Compensatory Criteria** (ALL must be met):
1. Substantially all employees may participate
2. No option features (beyond short reasonable enrollment period)
3. Discount ≤ 5% **OR** discount ≤ per-share cost of public offering

**If Non-Compensatory**: No compensation expense

**If Compensatory**: Measure discount at grant date, recognize as expense

### Example - Non-Compensatory ESPP

Discount of 5% or less → No compensation expense

### Example - Compensatory ESPP

Discount of 15% → Recognize 15% as compensation expense

## Stock Appreciation Rights (SARs)

### Definition
Right to receive **cash or stock** equal to appreciation in stock price

### Cash-Settled SARs
- **Liability award**
- **Remeasure to fair value each period** through vesting and settlement
- Recognize changes in fair value as compensation expense

### Stock-Settled SARs
- **Equity award**
- Measure at grant date
- **No remeasurement**
- Treated like stock options

## Forfeitures

### Accounting Policy Election

**Option 1: Estimate Forfeitures**:
- Reduce compensation expense for expected forfeitures
- True-up if actual differs from estimate

**Option 2: Account When They Occur**:
- Recognize full expense assuming all will vest
- Reverse expense when forfeiture actually occurs

### Example - Estimated Forfeitures

**Facts**:
- Grant 1,000 options, FV $10 each, vest in 3 years
- Estimate 10% will forfeit

**Total Compensation (reduced for expected forfeitures)**:
```
1,000 × $10 × 90% = $9,000
```

**Annual Expense**:
```
$9,000 / 3 = $3,000 per year
```

**If actual forfeitures differ**, adjust in period of change

### Example - Actual Forfeitures

**Facts**: Same as above, but don't estimate forfeitures

**Annual Expense** (assuming no forfeitures):
```
$10,000 / 3 = $3,333 per year
```

**If 100 options forfeited in Year 2**:
```
Reverse cumulative expense for forfeited options:
100 × $10 × (2/3) = $667

DR APIC - Stock Options              $667
   CR Compensation Expense                  $667
```

## Modifications

### Definition
Change to terms of award (e.g., reduce exercise price, extend term)

### Accounting
Recognize **incremental fair value**:
```
Incremental FV = FV after modification - FV before modification
```

### Minimum Rule
Must recognize **at least** original grant date fair value (can't reduce below original even if modification decreases FV)

### Example - Modification

**Facts**:
- Original options: FV $10 each
- Modified (reduced exercise price)
- New FV: $15 each

**Incremental Fair Value**:
```
$15 - $10 = $5 per option
```

**Treatment**: Recognize additional $5 per option as expense over remaining vesting period

## Tax Effects

### Incentive Stock Options (ISO)
- Company gets **no tax deduction**
- Employee pays capital gains tax (if holding period met)

### Non-Qualified Stock Options (NQSO)
- Company gets **tax deduction when employee exercises**
- Deduction = employee's ordinary income

### Deferred Tax Asset
Recognize DTA for future deductible amount as compensation expense recognized (for NQSOs)

### Excess Tax Benefit
If tax deduction exceeds book expense, recognize excess tax benefit in **income** (ASU 2016-09 changed from APIC treatment)

### Example - Tax Effect

**Facts**:
- Recognize $100K compensation expense for NQSOs
- Tax rate: 30%

**DTA Recognition**:
```
DR Deferred Tax Asset                $30,000
   CR Income Tax Benefit                    $30,000
```

**At Exercise** (assume tax deduction is $120K):
```
Tax benefit: $120K × 30% = $36,000
Excess tax benefit: $36K - $30K = $6,000

Recognize $6K excess in income (windfall)
```

## CPA Exam Tips

1. **Measurement date**: Grant date fair value - **do NOT remeasure** (except liability awards)

2. **Expense recognition**: Total FV / Vesting period = Annual expense

3. **Options vs. RSUs**:
   - Options: Use option pricing model
   - RSUs: Stock price × units

4. **Both expensed over vesting period**

5. **Forfeitures**: Either estimate or recognize when occur (policy election)

6. **Modifications**: Incremental FV = Additional expense (minimum = original grant FV)

7. **Common tested**: Basic expense calculation, journal entries at grant/vesting/exercise

8. **SARs**: Cash-settled = liability (remeasure), Stock-settled = equity (no remeasurement)

9. **No gain/loss on stock compensation**: It's equity transaction

## Common Mistakes

1. **Remeasuring equity awards**: Don't remeasure after grant date (only liability awards)

2. **Forgetting to expense RSUs**: Just because no exercise price doesn't mean no expense

3. **Wrong vesting period**: Must expense over entire vesting period

4. **Treating exercise as expense**: Exercise is equity transaction, not additional expense

5. **Confusing RSUs and restricted stock**:
   - RSUs: Shares delivered at vesting
   - Restricted stock: Shares issued at grant

6. **Not recognizing incremental FV on modifications**: Must recognize additional value

## Summary

### Key Points

- **Measure at grant date fair value** (options use pricing model, RSUs use stock price)
- **Recognize expense over vesting/service period** (straight-line typically)
- **Options**: Grant → Vest (expense) → Exercise (equity transaction)
- **RSUs**: Grant → Vest (expense + issue shares)
- **Restricted Stock**: Grant (issue shares) → Vest (expense)
- **Forfeitures**: Estimate or recognize when occur
- **Modifications**: Recognize incremental FV (minimum = original grant FV)
- **No remeasurement** after grant (except cash-settled SARs and similar liability awards)

### Quick Reference

| Type | Measurement | Remeasure? | Shares Issued |
|------|------------|------------|---------------|
| **Stock Options** | Option pricing model | No | At exercise |
| **RSUs** | Stock price × units | No | At vesting |
| **Restricted Stock** | Stock price × shares | No | At grant |
| **Cash SARs** | Fair value | Yes (each period) | N/A (cash) |
| **Stock SARs** | Fair value | No | At settlement |
