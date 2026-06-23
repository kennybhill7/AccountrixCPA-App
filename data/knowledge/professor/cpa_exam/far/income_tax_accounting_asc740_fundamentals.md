# Income Tax Accounting - ASC 740 Fundamentals

## Overview

**Standard**: ASC 740 (Income Taxes) - formerly SFAS 109

**Method**: **Asset and liability method** (balance sheet approach)

**Principle**: Recognize tax consequences of events in the **same period** as the events themselves

**Key Concept**: Deferred taxes arise from **temporary differences** between book basis and tax basis of assets/liabilities

## Fundamental Equation

### Total Income Tax Expense

```
Total Income Tax Expense = Current Tax Expense + Deferred Tax Expense
                                                (or - Deferred Tax Benefit)
```

### Components

**1. Current Tax Expense (Tax Payable)**:
- Taxes payable (or refundable) for current year based on taxable income
- Calculation: **Taxable Income × Tax Rate**
- Appears on balance sheet as: **Current Tax Payable** (or Receivable)

**2. Deferred Tax Expense/Benefit**:
- Change in deferred tax assets and liabilities during the year
- Calculation: **Ending DTA/DTL - Beginning DTA/DTL**
- Appears on balance sheet as: **Deferred Tax Assets** and **Deferred Tax Liabilities**

## Temporary vs. Permanent Differences

### Temporary Differences

**Definition**: Differences between book basis and tax basis of assets/liabilities that **will reverse** in future periods

**Create**: Deferred tax assets OR deferred tax liabilities

**Key Principle**: Results in taxable or deductible amounts in **future years**

#### Type 1: Taxable Temporary Differences

**Description**: Will result in **taxable amounts** in future when asset recovered or liability settled

**Creates**: **Deferred Tax LIABILITY (DTL)**

**Common Examples**:

| Item | Scenario | Basis Difference | Future Impact |
|------|----------|------------------|---------------|
| **Depreciation** | Tax depreciation (MACRS) > Book depreciation (SL) | Book basis > Tax basis | More taxable income in future |
| **Installment sales** | Revenue recognized for book now, tax uses installment method | Book revenue now, tax later | Future tax payments when collected |
| **Prepaid income** | Cash received and taxable now, but book defers revenue | Tax income now, book later | |

**Example - Depreciation**:
```
Asset cost: $100,000
Book depreciation (Year 1): $20,000 (straight-line, 5 years)
Tax depreciation (Year 1): $30,000 (MACRS)
Tax rate: 25%

Excess tax depreciation: $30,000 - $20,000 = $10,000 (taxable temporary difference)
Book basis: $80,000 (higher)
Tax basis: $70,000 (lower)

Deferred tax liability: $10,000 × 25% = $2,500

Interpretation: In future years, when book depreciation > tax depreciation,
               will pay $2,500 more in taxes

Entry concept:
DR Deferred Tax Expense                   $2,500
   CR Deferred Tax Liability                      $2,500
```

#### Type 2: Deductible Temporary Differences

**Description**: Will result in **deductible amounts** in future when asset recovered or liability settled

**Creates**: **Deferred Tax ASSET (DTA)**

**Common Examples**:

| Item | Scenario | Basis Difference | Future Impact |
|------|----------|------------------|---------------|
| **Warranty expense** | Book expenses when sold (accrual), tax deducts when paid | Book liability, no tax liability | Future tax deductions |
| **Bad debt expense** | Book uses allowance method, tax uses direct write-off | Book expense now, tax later | Future tax deductions |
| **Deferred compensation** | Book expenses when earned, tax deducts when paid | Book liability, no tax liability | Future tax deductions |
| **NOL carryforwards** | Tax losses available to offset future income | Loss now, benefit later | Future tax savings |

**Example - Warranty Expense**:
```
Warranty expense (book, Year 1): $50,000
Warranty payments (tax deduction, Year 1): $10,000
Tax rate: 25%

Warranty liability on books: $40,000 ($50,000 - $10,000)
This is deductible temporary difference
(Book has liability; tax has no liability)

Deferred tax asset: $40,000 × 25% = $10,000

Interpretation: When warranty costs paid in future, will save $10,000 in taxes

Entry concept:
DR Deferred Tax Asset                     $10,000
   CR Deferred Tax Benefit (reduces expense)       $10,000
```

### Permanent Differences

**Definition**: Differences between book income and taxable income that will **NEVER reverse**

**Create**: **NO deferred taxes** (only affect current tax expense)

**Impact**: Causes effective tax rate to differ from statutory rate

**Common Examples**:

| Item | Book Treatment | Tax Treatment | Impact on Rate |
|------|---------------|---------------|----------------|
| **Municipal bond interest** | Included in income | **Excluded** (tax-exempt) | Lowers effective rate |
| **Life insurance proceeds** | Included in income | **Excluded** | Lowers effective rate |
| **Life insurance premiums** (company is beneficiary) | Expense | **Not deductible** | Raises effective rate |
| **Meals and entertainment** | 100% expensed | Only **50% deductible** | Raises effective rate |
| **Fines and penalties** | Expense | **Not deductible** | Raises effective rate |
| **Dividends received deduction** | Income included | **Partial exclusion** (50%, 65%, or 100%) | Lowers effective rate |

### Identification Process

**Key Question**: **Will this difference reverse in the future?**

- **If YES** → **Temporary** difference → Creates DTA or DTL
- **If NO** → **Permanent** difference → Affects current tax only, no deferred tax

## Deferred Tax Calculations

### Deferred Tax Liability (DTL)

**When Created**: Taxable temporary differences

**Formula**:
```
DTL = Taxable Temporary Difference × Tax Rate
```

**Meaning**: Taxes that will be **paid** in future when difference reverses

### Deferred Tax Asset (DTA)

**When Created**: Deductible temporary differences or NOL carryforwards

**Formula**:
```
DTA = Deductible Temporary Difference × Tax Rate
```

**Meaning**: Taxes that will be **saved** in future when difference reverses

## Comprehensive Example

### Given Information

- **Pretax book income**: $500,000
- **Permanent differences**:
  - Municipal bond interest (in book income): $10,000
  - Fines and penalties (book expense): $5,000
- **Temporary differences**:
  - Depreciation: Tax $80,000, Book $50,000 (excess tax: $30,000)
  - Warranty expense: Book $40,000, Tax $15,000 (excess book: $25,000)
- **Tax rate**: 25%
- **Beginning balances**:
  - Deferred tax liability: $20,000
  - Deferred tax asset: $5,000

### Step-by-Step Calculation

**Step 1: Calculate Taxable Income**
```
Pretax book income                                   $500,000
Add: Fines and penalties (not deductible)             +5,000
Subtract: Municipal bond interest (not taxable)       -10,000
Add: Excess tax depreciation (tax deducted more)      +30,000
Subtract: Excess warranty expense (book more)         -25,000
                                                     ─────────
Taxable Income                                       $500,000
                                                     ═════════
```

**Step 2: Calculate Current Tax Expense (Tax Payable)**
```
Taxable Income × Tax Rate = $500,000 × 25% = $125,000

This is Current Tax Payable
```

**Step 3: Calculate Ending Deferred Tax Balances**
```
Deferred Tax Liability (from depreciation):
  Beginning DTL                                        $20,000
  Add: Current year taxable temporary difference:
       $30,000 × 25%                                    +7,500
                                                       ───────
  Ending DTL                                           $27,500
                                                       ═══════

Deferred Tax Asset (from warranty):
  Beginning DTA                                         $5,000
  Add: Current year deductible temporary difference:
       $25,000 × 25%                                    +6,250
                                                       ───────
  Ending DTA                                           $11,250
                                                       ═══════
```

**Step 4: Calculate Deferred Tax Expense/Benefit**
```
Change in DTL: $27,500 - $20,000 = $7,500 (Deferred Tax Expense)
Change in DTA: $11,250 - $5,000 = $6,250 (Deferred Tax Benefit)

Net Deferred Tax Expense: $7,500 - $6,250 = $1,250
```

**Step 5: Calculate Total Income Tax Expense**
```
Current Tax Expense              $125,000
Deferred Tax Expense               +1,250
                                 ─────────
Total Income Tax Expense         $126,250
                                 ═════════
```

**Step 6: Verify with Effective Tax Rate**
```
Effective Rate = Total Tax Expense / Pretax Book Income
               = $126,250 / $500,000
               = 25.25%

Close to 25% statutory rate (difference due to permanent items)
```

### Journal Entry

```
DR Income Tax Expense                    $126,250
DR Deferred Tax Asset                       6,250
   CR Deferred Tax Liability                        $7,500
   CR Income Tax Payable                          125,000

To record income tax expense and payable for the year
```

## Valuation Allowance

### Purpose

Reduce deferred tax asset to amount **more likely than not** (>50%) to be realized

### When Required

If it is **more likely than not** that some or all of DTA will **NOT** be realized

### Factors Requiring Allowance

- History of operating losses
- Expected future losses
- Short carryforward periods
- Lack of taxable income in carryback periods
- Unsettled circumstances that might adversely affect future income

### Factors Against Allowance

- History of profitability
- Expected future profitability
- Taxable temporary differences that will reverse in carryforward period
- Tax planning strategies available

### Accounting

**Establish Allowance**:
```
DR Income Tax Expense                    $XXX
   CR Valuation Allowance (contra-DTA)           $XXX
```

**Reduce Allowance**:
```
DR Valuation Allowance                   $XXX
   CR Income Tax Benefit (reduces expense)       $XXX
```

**Balance Sheet Presentation**:
```
Deferred Tax Asset                       $100,000
Less: Valuation Allowance                 (40,000)
                                         ─────────
Net Deferred Tax Asset                   $ 60,000
                                         ═════════
```

### Example

**Facts**:
- Deferred Tax Asset: $100,000 (from NOL carryforward)
- Company has history of losses
- More likely than not only $60,000 will be realized

**Calculation**:
```
Valuation Allowance needed: $100,000 - $60,000 = $40,000
```

**Entry**:
```
DR Income Tax Expense                    $40,000
   CR Valuation Allowance                        $40,000
```

## Tax Rate Changes

### Principle

Deferred tax assets and liabilities measured using **enacted tax rate** expected to apply when asset realized or liability settled

### When Rate Changes

**Adjustment Required**: Remeasure **all** deferred tax assets and liabilities using new rate

**Recognize Adjustment**: In income from continuing operations in period of **enactment**

**Not Retroactive**: Do not restate prior periods

### Example

**Facts**:
- Deferred Tax Liability: $50,000 (based on 25% rate)
- Tax rate increases to 30%
- Temporary difference: $50,000 / 25% = $200,000

**Calculation**:
```
New DTL: $200,000 × 30% = $60,000
Increase in DTL: $60,000 - $50,000 = $10,000
```

**Journal Entry**:
```
DR Income Tax Expense                    $10,000
   CR Deferred Tax Liability                     $10,000
```

**Explanation**: Higher future tax rate means larger future tax payment, so increase DTL now

## Net Operating Losses (NOLs)

### Definition

Tax loss that can be carried forward to offset future taxable income

### Accounting

Recognize deferred tax asset for tax benefit of NOL carryforward

### Calculation

```
DTA from NOL = NOL Carryforward × Expected Tax Rate
```

**Valuation allowance** required if more likely than not will not realize benefit

### Example

**Year 1 Facts**:
- Taxable loss: $100,000
- Tax rate: 25%
- Expected to generate profits in next 3 years

**Year 1 Entry**:
```
DR Deferred Tax Asset                    $25,000
   CR Income Tax Benefit                         $25,000

Explanation: Recognize benefit of NOL carryforward
```

**Year 2** (when NOL used to offset $100,000 taxable income):
```
DR Income Tax Expense                    $25,000
   CR Deferred Tax Asset                         $25,000

Current tax payable in Year 2: $0 (offset by NOL)
```

### Post-TCJA Rules (Tax Cuts and Jobs Act)

- **Carryback**: Generally not allowed (except certain losses)
- **Carryforward**: **Indefinite** (no expiration)
- **Limitation**: NOL can offset only **80%** of taxable income in carryforward years

## CPA Exam Strategies

### Systematic Approach

**Step 1**: Calculate taxable income
- Start with book income
- Adjust for permanent differences
- Adjust for temporary differences

**Step 2**: Calculate current tax expense
- Taxable income × tax rate

**Step 3**: Calculate ending DTA/DTL balances
- Beginning balance + change from temporary differences

**Step 4**: Calculate deferred tax expense
- Change in DTL - change in DTA

**Step 5**: Calculate total expense
- Current + deferred

### Identification Tips

**Temporary**:
- **Question**: Will this reverse?
- **If YES** → Temporary → Creates DTA or DTL

**Permanent**:
- **Question**: Will this reverse?
- **If NO** → Permanent → Affects only current tax, no deferred

**Taxable Temporary** (creates DTL):
- Book basis > Tax basis for assets, OR
- Book liability < Tax liability

**Deductible Temporary** (creates DTA):
- Book basis < Tax basis for assets, OR
- Book liability > Tax liability

### Common Mistakes

- Confusing temporary and permanent differences
- Wrong direction in taxable income calculation (adding when should subtract)
- Forgetting to multiply temporary differences by tax rate
- Not considering valuation allowance when DTA realization uncertain
- Using wrong tax rate (use enacted rate expected to apply)

### Memory Aids

**T = Temporary creates deferred Taxes**

**P = Permanent affects Present tax only**

**DTL**: Taxable temp diff × Rate = DTL (future Tax **Liability**)

**DTA**: Deductible temp diff × Rate = DTA (future Tax **Asset**)

## Summary

### Critical Concepts

- Income tax expense = **Current tax + Deferred tax expense** (or - deferred tax benefit)
- **Temporary** differences create deferred tax assets (deductible) or liabilities (taxable)
- **Permanent** differences affect only current tax, no deferred taxes
- **DTA** = Deductible temporary difference × Tax rate (future tax savings)
- **DTL** = Taxable temporary difference × Tax rate (future tax payments)
- **Valuation allowance** reduces DTA if realization not more likely than not
- **Tax rate changes** require remeasurement of DTAs and DTLs
- **NOL carryforwards** create DTA (with valuation allowance if needed)

### Key Formulas

**Taxable Income**:
```
Book Income ± Permanent Differences ± Temporary Differences
```

**Current Tax**:
```
Taxable Income × Tax Rate
```

**Deferred Tax Expense**:
```
Increase in DTL - Increase in DTA
```

**Total Tax Expense**:
```
Current Tax + Deferred Tax Expense
```

### Quick Reference

| Item | Temporary or Permanent | Creates |
|------|----------------------|---------|
| Depreciation (tax > book) | Temporary | DTL |
| Warranty expense (book > tax) | Temporary | DTA |
| Municipal bond interest | Permanent | Neither |
| Fines and penalties | Permanent | Neither |
| NOL carryforward | Temporary | DTA |
| Bad debt (book > tax) | Temporary | DTA |
