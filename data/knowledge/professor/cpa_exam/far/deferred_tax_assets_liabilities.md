# Deferred Tax Assets and Liabilities - Deep Dive

## Basis Difference Approach

### Concept
Compare **book basis** vs. **tax basis** of assets and liabilities

### Formula for Assets
```
If Book Basis > Tax Basis
  → Taxable Temporary Difference
  → DEFERRED TAX LIABILITY (DTL)

If Book Basis < Tax Basis
  → Deductible Temporary Difference
  → DEFERRED TAX ASSET (DTA)
```

### Formula for Liabilities
```
If Book Liability > Tax Liability
  → Deductible Temporary Difference
  → DEFERRED TAX ASSET (DTA)

If Book Liability < Tax Liability
  → Taxable Temporary Difference
  → DEFERRED TAX LIABILITY (DTL)
```

### Example - Asset
**Equipment**:
- Book basis: $80,000
- Tax basis: $50,000 (due to accelerated depreciation)
- Difference: $30,000 **taxable** temporary difference
- Result: **DTL** = $30,000 × tax rate

### Example - Liability
**Warranty Liability**:
- Book: $40,000
- Tax: $0 (not recognized until paid)
- Difference: $40,000 **deductible** temporary difference
- Result: **DTA** = $40,000 × tax rate

## Common Sources of DTAs

- Warranty liabilities
- Bad debt reserves
- Deferred compensation
- Accrued expenses (book accrued, tax cash basis)
- NOL carryforwards
- Tax credit carryforwards
- Unrealized losses (certain situations)

## Common Sources of DTLs

- Depreciation (tax accelerated)
- Prepaid expenses (tax deducted immediately)
- Installment sales (book recognizes revenue now, tax later)
- Undistributed earnings of foreign subsidiaries

## Valuation Allowance

### When Required
When realization of DTA is **NOT "more likely than not"**

**More likely than not** = **>50% probability**

### Assessment Factors
- Future taxable income projections
- History of utilization
- Tax planning strategies
- Carryforward periods

### Journal Entry

**Establish Valuation Allowance**:
```
DR Income Tax Expense
   CR Valuation Allowance
```

**Release Valuation Allowance**:
```
DR Valuation Allowance
   CR Income Tax Benefit
```

## Classification on Balance Sheet

### Current vs. Noncurrent
Based on related asset/liability classification

If not related to specific asset/liability:
- Classify by expected reversal timing

### Offsetting
Offset DTAs and DTLs only if:
- **Same tax jurisdiction**, AND
- **Legally right to offset** exists

## Detailed Example

### Facts
**Equipment Purchase**: $100,000
- **Book depreciation**: Straight-line over 10 years = $10,000/year
- **Tax depreciation**: Accelerated (MACRS) = $20,000 Year 1

### Year 1 Analysis
```
Book basis after Year 1:
  $100,000 - $10,000 = $90,000

Tax basis after Year 1:
  $100,000 - $20,000 = $80,000

Temporary difference:
  Book basis ($90,000) > Tax basis ($80,000)
  = $10,000 TAXABLE temporary difference

Deferred Tax Liability:
  $10,000 × 30% tax rate = $3,000 DTL
```

### Entry
```
DR Income Tax Expense (current)
DR Deferred Tax Liability            $3,000
   CR Income Tax Payable
   CR Deferred Tax Liability                 $3,000
```

## Tax Rate Changes

### Requirement
**Remeasure** all DTAs and DTLs when tax rate changes

### Effect
- Increased rate → Increase DTLs, Decrease DTAs (income statement impact)
- Decreased rate → Decrease DTLs, Increase DTAs (income statement impact)

### Example
```
Existing DTL: $10,000 (at 30% rate)
Tax rate changes to 25%

New DTL: Temporary difference × 25%

Adjustment needed to reflect new rate
```

## CPA Exam Calculation Steps

### Step 1: Identify Temporary Differences
Compare book vs. tax basis for all assets and liabilities

### Step 2: Classify Each Difference
- Taxable temporary difference → DTL
- Deductible temporary difference → DTA

### Step 3: Calculate DTA/DTL
Temporary difference × Current tax rate

### Step 4: Assess Valuation Allowance
Is realization more likely than not (>50%)?
- If NO → Valuation allowance needed

### Step 5: Classify
Current vs. noncurrent based on related item

## CPA Exam Tips

1. **Calculate basis differences systematically**
   - Book basis vs. tax basis for each item

2. **Remember direction**:
   - Higher book basis of asset → DTL
   - Higher book liability → DTA

3. **Don't forget valuation allowance assessment**
   - Required if realization not more likely than not

4. **Tax rate changes require remeasurement**
   - Adjust all DTAs and DTLs

5. **NOLs and credits**:
   - Create DTAs
   - Often require valuation allowance analysis

## Common Mistakes

1. **Wrong direction**: Confusing when to record DTA vs. DTL

2. **Forgetting valuation allowance**: Required assessment for all DTAs

3. **Not remeasuring for rate changes**: Must adjust when rates change

4. **Improper classification**: Must classify as current vs. noncurrent

## Summary

### Key Points
- **DTAs** = Future tax deductions (will reduce future taxes)
- **DTLs** = Future tax payments (will increase future taxes)
- **Basis difference approach**: Compare book vs. tax basis
- **Valuation allowance** if realization not more likely than not (>50%)
- **Remeasure** for tax rate changes

### Quick Reference

| Item | Book vs. Tax | Result |
|------|-------------|--------|
| Asset: Book > Tax | Taxable diff | DTL |
| Asset: Book < Tax | Deductible diff | DTA |
| Liability: Book > Tax | Deductible diff | DTA |
| Liability: Book < Tax | Taxable diff | DTL |

### Formula
```
DTA or DTL = Temporary Difference × Tax Rate
```
