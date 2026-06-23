# Impairment of Long-Lived Assets - ASC 360

## Scope
- **Applies to**: Long-lived assets to be held and used (PPE, finite-lived intangibles)
- **Excludes**: Goodwill (ASC 350), indefinite-lived intangibles

## When to Test
Test when **events or circumstances** indicate carrying amount may not be recoverable

## Impairment Indicators
- Significant decrease in market price
- Significant adverse change in use or physical condition
- Significant adverse change in legal or business climate
- Cost overruns on construction
- Operating or cash flow losses
- Expectation asset will be sold/disposed before end of useful life

## Two-Step Impairment Test

### Step 1: Recoverability Test

**Compare**: Carrying amount to sum of **UNDISCOUNTED** future cash flows

**Decision**:
- **Cash flows ≥ Carrying amount** → NO impairment (stop here)
- **Carrying amount > Cash flows** → Not recoverable (proceed to Step 2)

**Key**: Use **UNDISCOUNTED** cash flows (no present value calculation in Step 1)

### Step 2: Measurement

**Calculate**:
```
Impairment Loss = Carrying Amount - Fair Value
```

**Fair Value** determined using:
- Market price
- Comparable transactions
- Present value of future cash flows (**discounted**)

**Recognize**:
```
DR Impairment Loss
   CR Asset (or CR Accumulated Impairment)
```

**New Basis**: Fair value becomes new cost basis

**No Reversal**: Impairment losses **CANNOT be reversed** (GAAP)

## Calculation Example

### Facts
- Equipment carrying amount: $500,000
- Undiscounted future cash flows: $450,000
- Fair value: $400,000

### Step 1: Recoverability Test
```
Carrying amount:  $500,000
Undiscounted CF:  $450,000

$500,000 > $450,000 → Not recoverable
Proceed to Step 2
```

### Step 2: Measurement
```
Impairment Loss = $500,000 - $400,000 = $100,000
```

### Journal Entry
```
DR Impairment Loss              $100,000
   CR Equipment (or Accumulated Impairment)  $100,000
```

### New Carrying Amount
$400,000 (cannot be increased later even if FV recovers)

## Assets Held for Sale

### Classification Criteria
All must be met:
- Management commits to plan to sell
- Asset available for **immediate sale** in present condition
- Active program to locate buyer initiated
- Sale **probable within one year**
- Asset marketed at **reasonable price**
- Unlikely significant changes to plan will be made

### Measurement
**Lower of**:
- Carrying amount, OR
- Fair value less cost to sell

### Depreciation
**STOP depreciating** once classified as held for sale

### Presentation
Separately present on balance sheet

## Discontinued Operations

### When Applicable
If asset held for sale represents:
- Separate component
- Discrete operations and cash flows

### Presentation
Report in **separate section** of income statement (below income from continuing operations)

## Comparison: Goodwill vs. Long-Lived Assets

| Feature | Goodwill (ASC 350) | Long-Lived Assets (ASC 360) |
|---------|-------------------|---------------------------|
| **Test frequency** | Annual + indicators | Indicators only |
| **Step 1** | N/A | **Undiscounted** CF test |
| **Step 2** | FV vs. CA | **Fair value** measurement |
| **Reversal** | NO | NO |
| **Amortization** | NO (unless elected) | YES |

## CPA Exam Tips

1. **Step 1 (recoverability)**: **UNDISCOUNTED** cash flows vs. carrying amount

2. **Step 2 (measurement)**: **FAIR VALUE** (discounted often) to calculate loss

3. **No reversal** allowed under GAAP

4. **Held for sale**:
   - Stop depreciation
   - Lower of CA or (FV - costs to sell)

5. **Don't confuse** with goodwill impairment (different test)

## Common Mistakes

### Mistake 1: Discounting in Step 1
**Wrong**: Using discounted cash flows in Step 1
**Correct**: Step 1 uses **UNDISCOUNTED** cash flows

### Mistake 2: Fair Value in Step 1
**Wrong**: Using fair value to test recoverability
**Correct**: Step 1 = Undiscounted CF; Step 2 = Fair value

### Mistake 3: Reversal
**Wrong**: Reversing impairment when FV recovers
**Correct**: Impairment **CANNOT be reversed** under GAAP

### Mistake 4: Held for Sale Depreciation
**Wrong**: Continuing to depreciate held-for-sale assets
**Correct**: **STOP depreciating** when classified as held for sale

## Summary

### Key Points
- Test for impairment when **indicators present**
- **Step 1**: Recoverability test using **undiscounted** cash flows
- **Step 2**: If not recoverable, impairment = CA - FV
- **No reversal** of impairment losses
- **Held for sale**: Stop depreciation, measure at lower of CA or (FV - cost to sell)

### Two-Step Process
```
Step 1: RECOVERABILITY
  Carrying Amount vs. Undiscounted Future Cash Flows
  If CA > CF → Not recoverable → Go to Step 2
  If CA ≤ CF → No impairment → STOP

Step 2: MEASUREMENT
  Impairment Loss = Carrying Amount - Fair Value
  Record loss
  FV becomes new basis
  Cannot reverse
```
