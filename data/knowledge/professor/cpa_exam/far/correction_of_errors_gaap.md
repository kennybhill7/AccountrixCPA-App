# Correction of Errors - GAAP Requirements

## Overview
Understanding how to identify, classify, and correct errors is critical for proper financial statement presentation and retrospective application.

## Definition of Error
**Error**: Mistake in recognition, measurement, presentation, or disclosure in previously issued financial statements

**Causes**:
- Mathematical mistakes
- Misapplication of GAAP
- Oversight or misuse of facts available at the time

---

## Error vs. Change in Estimate

### Error
**Nature**: Mistake (should have known better with information available at the time)

**Treatment**: **Retrospective correction** (restate prior periods)

**Example**: Failed to record depreciation (should have been known)

### Change in Estimate
**Nature**: New information, not a mistake

**Treatment**: **Prospective** (no restatement)

**Example**: Change in useful life based on new information

### Key Distinction
- **Error** = Mistake → Restate
- **Estimate** = New info → Don't restate

---

## Correction Method

### Retrospective Restatement
Restate prior periods **as if the error never occurred**

### If Prior Year Books Closed
Adjust **beginning retained earnings** of earliest period presented

### Entry Format
```
DR/CR accounts as needed to correct error
   Offsetting entry to Retained Earnings
```

### Comparative Statements
Restate **all prior periods presented** in comparative financial statements

---

## Types of Errors

### Counterbalancing Errors

**Definition**: Errors that self-correct over **two accounting periods**

**Examples**:
- Inventory errors
- Accrual errors (if corrected next period)
- Prepaid/deferred errors
- Unrecorded revenue/expenses

**Important Note**: Even though they self-correct, **MUST restate** if discovered before self-correction completes

### Non-Counterbalancing Errors

**Definition**: Errors that do **NOT self-correct**

**Examples**:
- Depreciation errors
- Capitalize vs. expense errors
- Long-term asset/liability errors
- Amortization errors

**Correction**: Requires adjusting entry **regardless of when discovered**

---

## Inventory Error Example (Counterbalancing)

### Error Discovered
Year 1 ending inventory **overstated $10,000**. Tax rate 30%.

### Impact on Year 1
```
Ending inventory overstated        $10,000
→ COGS understated                 $10,000
→ Pretax income overstated         $10,000
→ Net income overstated            $ 7,000 (after 30% tax)
→ Retained earnings overstated     $ 7,000
```

### Impact on Year 2
```
Beginning inventory overstated     $10,000
→ COGS overstated                  $10,000
→ Pretax income understated        $10,000
→ Net income understated           $ 7,000 (after 30% tax)
→ Error SELF-CORRECTS by end of Year 2
```

### Correction Entry - Discovered During Year 2 (Before Close)
```
DR Retained Earnings                  $7,000
DR Deferred Tax Asset                  3,000
   CR Inventory                               $10,000
```

### If Discovered After Year 2 Closes (Preparing Year 3)
**No entry needed** - error already self-corrected

---

## Depreciation Error Example (Non-Counterbalancing)

### Error Discovered
Failed to record depreciation **$5,000 per year for 3 years**. Tax rate 30%.

### Cumulative Impact
```
Depreciation expense understated (3 years)  $15,000
→ Pretax income overstated                  $15,000
→ Net income overstated                     $10,500 (after tax)
→ Retained earnings overstated              $10,500
→ Accumulated depreciation understated      $15,000
```

### Correction Entry
```
DR Retained Earnings                 $10,500
DR Deferred Tax Asset                 4,500
   CR Accumulated Depreciation               $15,000
```

**Note**: Non-counterbalancing (doesn't self-correct). Requires adjustment **whenever discovered**.

---

## Capitalize vs. Expense Error

### Expensed When Should Have Capitalized

**Error**: Purchased equipment $20,000, expensed immediately. Should have capitalized and depreciated over 5 years (straight-line). Discovered end of Year 2.

**Impact**:
- Year 1: Expense overstated $20,000, should have been $4,000 depreciation
  - Overstatement: $16,000 pretax
- Year 2: Expense understated $4,000 (missed depreciation)
  - Understatement: $4,000 pretax
- Net cumulative: $12,000 pretax ($8,400 after 30% tax)

**Correction Entry (End of Year 2)**:
```
DR Equipment                         $20,000
DR Deferred Tax Asset                  3,600
   CR Accumulated Depreciation                $ 8,000
   CR Retained Earnings                        15,600
```

### Capitalized When Should Have Expensed

**Error**: Expensed item capitalized as asset

**Impact**: Asset overstated, expenses understated

**Correction**: Reduce asset, adjust retained earnings

---

## Tax Effects of Error Corrections

### After-Tax Adjustment to RE
Error corrections adjust Retained Earnings for **after-tax** effect

### Deferred Tax Adjustments
May need to adjust deferred tax assets/liabilities

### Example
Overstated revenue $10,000. Tax rate 30%.

**Correction**:
```
DR Revenue                           $10,000
   CR Accounts Receivable                     $10,000

DR Deferred Tax Asset                 $3,000
DR Retained Earnings                   7,000
   CR Income Tax Payable (or benefit)         $10,000
```

**Retained Earnings Impact**: $7,000 (after-tax)

---

## Disclosure Requirements

### Required Disclosures
1. **Nature of error**: Describe what the error was
2. **Effect on each financial statement line item** and per-share amounts for each prior period presented
3. **Cumulative effect on retained earnings** at beginning of earliest period presented

### Example Disclosure
"During 20X3, the Company discovered it had failed to record depreciation expense for equipment purchased in 20X1. The financial statements for 20X1 and 20X2 have been restated to correct this error. The cumulative effect decreased retained earnings as of January 1, 20X1 by $XX (net of tax of $XX)."

---

## Materiality Consideration

### Material Errors
**Must restate** prior period financial statements

### Immaterial Errors
May correct in current period (no restatement required)

### Judgment Required
Assess both quantitative and qualitative factors

---

## SEC Considerations (Public Companies)

### Material Errors
- May need to file amended reports (Form 8-K)
- "Little r" restatement (correction of error)

### Restatement vs. Revision
- **Restatement**: Correction of error (more serious)
- **Revision**: Update for other reasons

---

## CPA Exam Correction Approach

### Step-by-Step Process

1. **Identify the error** and periods affected

2. **Determine error type**:
   - Counterbalancing (self-correcting over 2 years)?
   - Non-counterbalancing (doesn't self-correct)?

3. **Calculate cumulative effect on RE** (after-tax)

4. **Adjust beginning RE** and restate prior periods

5. **Consider deferred tax effects**

---

## Inventory Error Shortcut

### Quick Analysis
```
Ending inventory OVERSTATED
→ COGS UNDERSTATED
→ Net Income OVERSTATED
→ Retained Earnings OVERSTATED (Year 1)

Beginning inventory OVERSTATED (Year 2)
→ COGS OVERSTATED
→ Net Income UNDERSTATED
→ OPPOSITE effect Year 2 (self-corrects)
```

---

## CPA Exam Tips

1. **Error = Mistake** → Retrospective correction (restate prior periods)

2. **Change in estimate = New info** → Prospective (no restatement)

3. **Counterbalancing errors** self-correct over 2 years (but **still restate** if discovered before self-correction)

4. **Non-counterbalancing errors** don't self-correct (always require adjustment)

5. **Adjust beginning RE** of earliest period presented

6. **Tax effect**: Error corrections after-tax to Retained Earnings

---

## Common CPA Exam Mistakes

### Mistake 1: Error vs. Estimate
**Wrong**: Treating error as change in estimate (no restatement)
**Correct**: Errors require **retrospective restatement**

### Mistake 2: Counterbalancing Errors
**Wrong**: Not restating because error will self-correct
**Correct**: Must **restate even if self-correcting** (if discovered before completion)

### Mistake 3: Tax Effect
**Wrong**: Forgetting tax effect on RE adjustment
**Correct**: Adjust RE **after-tax**

### Mistake 4: Deferred Taxes
**Wrong**: Not revaluing deferred tax accounts
**Correct**: Adjust **deferred tax assets/liabilities** when correcting errors

---

## Summary Table

| Error Type | Self-Correct? | Examples | Correction |
|-----------|--------------|----------|------------|
| **Counterbalancing** | Yes (2 years) | Inventory errors, accruals | Restate if discovered before self-correction |
| **Non-counterbalancing** | No | Depreciation, capitalize/expense | Always requires adjustment |

---

## Summary

### Key Takeaways

1. **Error = Mistake** → **Retrospective restatement** (restate prior periods)

2. **Change in estimate = New info** → **Prospective** (no restatement)

3. **Counterbalancing**: Self-correct over 2 years (inventory, accruals)

4. **Non-counterbalancing**: Don't self-correct (depreciation, capitalize/expense)

5. **Adjust beginning RE** of earliest period (after-tax)

6. **Restate comparative statements** for all prior periods presented

### Correction Entry Format
```
DR/CR various accounts (to correct the error)
DR/CR Retained Earnings (plug, after-tax amount)
DR/CR Deferred Tax Asset/Liability (if applicable)
```
