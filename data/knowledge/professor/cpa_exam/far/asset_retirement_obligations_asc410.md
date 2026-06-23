# Asset Retirement Obligations - ASC 410

## Definition
Legal obligation to remove/restore asset at end of useful life
- Environmental cleanup
- Removal costs
- Restoration costs

## When Recognized
When **legal obligation exists**:
- Contractual obligation
- Statutory obligation
- Constructive obligation

## Initial Recognition

### Measurement
**Present value** of estimated future retirement costs

### Discount Rate
Credit-adjusted risk-free rate (entity's borrowing rate)

### Capitalize to Asset
Add PV of obligation to asset's cost

### Entry
```
DR Asset (or ARO Asset)
   CR Asset Retirement Obligation Liability
```

## Subsequent Measurement

### Accretion Expense
Increase liability over time using interest method (unwind discount)

**Formula**:
```
Accretion = Beginning Liability × Discount Rate
```

**Entry Each Period**:
```
DR Accretion Expense (Income Statement)
   CR ARO Liability
```

### Depreciation
Depreciate ARO asset over useful life (along with main asset)

## Calculation Example

### Facts
- Oil rig costs $1,000,000
- Must be removed at end of 10-year life
- Estimated removal cost: $200,000
- Discount rate: 6%

### Initial ARO
```
PV of $200,000 in 10 years at 6%
= $200,000 / (1.06)^10
= $111,700
```

### Initial Entry
```
DR Oil Rig                        $111,700
   CR ARO Liability                        $111,700

Total rig cost: $1,000,000 + $111,700 = $1,111,700
```

### Year 1

**Accretion**:
```
$111,700 × 6% = $6,702

DR Accretion Expense               $6,702
   CR ARO Liability                         $6,702

Liability now: $111,700 + $6,702 = $118,402
```

**Depreciation**:
```
$1,111,700 / 10 years = $111,170

DR Depreciation Expense          $111,170
   CR Accumulated Depreciation           $111,170
```

### Year 10
Liability accretes to $200,000 (original estimated cost)

## Changes in Estimates

### Increased Costs
Increase asset and liability (prospectively)

### Decreased Costs
Decrease asset (limited to carrying amount) and liability

### Timing Changes
Adjust discount (change in interest rate affects PV)

## Actual Retirement

### If Costs Equal Liability
```
DR ARO Liability
   CR Cash
```
No gain/loss

### If Costs Differ
Recognize gain (costs < liability) or loss (costs > liability)

**Example**: Liability $200K, Actual costs $210K
```
DR ARO Liability                  $200,000
DR Loss on Retirement               10,000
   CR Cash                                  $210,000
```

## Conditional ARO

### Definition
Obligation dependent on future event (timing uncertain)

### Recognition
Recognize if probability-weighted estimate can be reasonably estimated

### Example
Building with asbestos. Obligation to remove **IF** building demolished. Recognize if can estimate probability and costs.

## Disclosure Requirements
- Description of AROs
- Reconciliation of beginning and ending liability
  - Additions
  - Accretion
  - Settlements
  - Revisions
- Significant assumptions (discount rates, inflation, timing)

## CPA Exam Tips

1. **ARO recognized at PV** of estimated future costs

2. **Capitalize PV to asset** (increases asset cost)

3. **Each period**: Accretion expense increases liability (interest on liability)

4. **Depreciate ARO asset** over useful life of main asset

5. **Accretion expense** = Beginning liability × Discount rate

6. **Final liability** should equal estimated retirement cost

## Calculation Steps

### Initial Recognition
1. Estimate future retirement cost
2. Discount to PV using credit-adjusted rate
3. DR Asset (PV), CR ARO Liability (PV)

### Subsequent Periods
1. **Accretion**: Liability × Rate = Accretion expense
2. DR Accretion Expense, CR ARO Liability
3. **Depreciate ARO asset**: Total asset cost / Useful life

## Common Mistakes

1. **Not capitalizing ARO to asset** (should increase asset cost)

2. **Forgetting accretion expense** (liability grows over time)

3. **Using straight-line to increase liability** (should use interest method)

4. **Not depreciating ARO asset** (should depreciate like main asset)

## Summary

### Key Points
- ARO: Legal obligation to remove/restore asset at end of life
- Initial: Capitalize PV of retirement cost to asset, recognize liability
- Each period: Accretion expense (unwind discount), depreciate ARO asset
- Accretion = Beginning liability × Discount rate
- Final liability equals estimated retirement cost
- Changes in estimates: Adjust asset and liability prospectively

### Formula Summary
```
Initial ARO = PV of Future Retirement Cost

Annual Accretion = Beginning Liability × Discount Rate

Annual Depreciation = (Original Asset Cost + ARO) / Useful Life
```
