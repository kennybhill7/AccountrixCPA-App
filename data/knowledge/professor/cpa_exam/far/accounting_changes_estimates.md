# Accounting Changes and Estimates - ASC 250

## Three Types of Changes

### 1. Change in Accounting Principle
**Definition**: Change from one GAAP method to another GAAP method

**Examples**:
- FIFO to weighted average inventory
- Straight-line to accelerated depreciation
- Completed contract to percentage of completion

**Treatment**: **RETROSPECTIVE** application
- Restate prior periods as if new principle always used

**Disclosure**: Reason for change, method of applying change, effect on income

### 2. Change in Accounting Estimate
**Definition**: Change based on NEW information or experience (not an error)

**Examples**:
- Change in useful life of asset
- Change in salvage value
- Change in allowance for doubtful accounts
- Change in warranty liability estimate

**Treatment**: **PROSPECTIVE** application
- Current and future periods only
- **NO restatement** of prior periods

**Disclosure**: Effect on income if material

### 3. Change in Reporting Entity
**Definition**: Change resulting in financial statements of different entity

**Examples**:
- Consolidating subsidiary previously not consolidated
- Change in subsidiaries in consolidated group

**Treatment**: **RETROSPECTIVE** application
- Restate all prior periods presented

**Disclosure**: Nature and reason for change

## Retrospective vs. Prospective

### Retrospective Application

**When Used**:
- Change in principle
- Change in reporting entity
- Error corrections

**How**:
- Restate prior period financial statements as if new method always used
- Adjust beginning retained earnings of earliest period presented for cumulative effect

**Disclosure**: Show effect of change on prior periods

### Prospective Application

**When Used**:
- Change in estimate
- Some specific principle changes (e.g., depreciation method change treated as estimate change)

**How**:
- Apply new estimate to current and future periods only
- **NO restatement** of prior periods

**Example**: Change useful life from 10 to 8 years → Use remaining book value and depreciate over remaining 8 years going forward

## Calculation Example: Change in Principle

### Scenario
- Company changes from FIFO to weighted average on Jan 1, Year 3
- Prior years:
  - Year 1: FIFO COGS $100K (weighted avg would have been $110K)
  - Year 2: FIFO COGS $120K (weighted avg would have been $130K)
- Tax rate: 30%

### Cumulative Effect Calculation
```
Year 1 effect:
  COGS increased $10K
  → NI decreased $7K after tax

Year 2 effect:
  COGS increased $10K
  → NI decreased $7K after tax

Cumulative effect on RE at start of Year 3:
  $14K decrease (after tax)
```

### Retrospective Adjustment Entry
```
DR Retained Earnings              $14,000  (cumulative after-tax)
DR Deferred Tax Asset              6,000   (tax effect: $20K × 30%)
   CR Inventory                            $20,000  (cumulative pretax)
```

### Restatement
- Restate Year 1 and Year 2 financial statements
- Show weighted average COGS and lower NI
- Year 3 forward: Use weighted average method

## Calculation Example: Change in Estimate

### Scenario
- Equipment cost: $100,000
- Originally estimated: 10-year life, $10,000 salvage
- After 4 years (BV = $64,000): Change estimate to 12-year **total** life
- No change to salvage value

### Original Depreciation
```
($100,000 - $10,000) / 10 years = $9,000 per year
```

### After 4 Years
```
Accumulated depreciation:  $36,000
Book value:                $64,000
```

### New Estimate
```
Total life: 12 years
Already used: 4 years
Remaining: 8 years
```

### New Depreciation (Prospective)
```
($64,000 - $10,000) / 8 years = $6,750 per year going forward
```

### NO Adjustment to Prior Years
Do **NOT** restate Years 1-4. Just use new depreciation rate prospectively.

### Journal Entry (Year 5 forward)
```
DR Depreciation Expense           $6,750
   CR Accumulated Depreciation            $6,750
```

## Specific Principle Changes

### Depreciation Method Change
**Unique Treatment**: Treated as change in **ESTIMATE**, not principle

**Application**: **PROSPECTIVE** (no restatement)

**Reason**: Change in estimate of pattern of consumption

### Inventory Method Change
**Treatment**: **Retrospective** (restate prior periods)

**Common on Exam**: FIFO to weighted average or vice versa

### Long-Term Contract Method
**Treatment**: **Retrospective**

**Example**: Completed contract to percentage of completion

## Indirect Effects

**Definition**: Changes to current or future cash flows resulting from change in principle

**Examples**:
- Profit-sharing based on new income
- Bonus arrangements affected by restated income

**Treatment**: Report in period of change, do **NOT** restate prior periods

## Impracticability Exception

**If Impracticable**: If retrospective application impracticable (cannot determine cumulative effect), apply prospectively from earliest date practicable

**Disclosure**: Explain why retrospective application impracticable

## Error Corrections Comparison

| Type | Nature | Treatment |
|------|--------|-----------|
| **Error** | Mistake in prior period | RESTATE prior periods, adjust beginning RE |
| **Change in Estimate** | NOT a mistake, new information | PROSPECTIVE, no restatement |
| **Change in Principle** | Voluntary change between GAAP methods | RETROSPECTIVE restatement |

## CPA Exam Tips

1. **Principle = Retrospective** (restate prior periods)
   **Estimate = Prospective** (going forward only)

2. Error corrections look like retrospective principle changes but are **CORRECTIONS** not voluntary changes

3. **Depreciation method change** = treated as **ESTIMATE** (prospective), not principle

4. **Cumulative effect** goes to beginning Retained Earnings of earliest period presented

5. **Identification clues**:
   - "New information" or "based on experience" → Change in **ESTIMATE** (prospective)
   - "Company decided to switch from X to Y" → Change in **PRINCIPLE** (retrospective)

## CPA Exam Identification Keywords

### Principle Change Keywords
- "Switch from"
- "Change from FIFO to weighted average"
- "Decided to change method"

### Estimate Change Keywords
- "Revised estimate"
- "New information"
- "Based on experience"
- "Change in useful life"
- "Change in salvage value"

### Error Keywords
- "Discovered"
- "Mistake"
- "Should have been"
- "Failed to record"

## Calculation Approaches

### Retrospective Steps (Principle Change)
1. Calculate what prior years' income **WOULD have been** under new method
2. Calculate cumulative after-tax effect on retained earnings
3. Adjust beginning RE of earliest period presented
4. Restate prior period comparative statements

### Prospective Steps (Estimate Change)
1. Take current book value (or carrying amount)
2. Apply new estimate going forward (new life, new salvage, etc.)
3. **NO adjustment** to prior periods

## Common CPA Exam Traps

1. **Don't restate** prior periods for change in estimate (prospective only)

2. **Don't confuse** depreciation method change (estimate treatment) with inventory method change (principle treatment)

3. **Remember** to calculate AFTER-TAX cumulative effect for principle changes

4. **Don't forget** to adjust deferred taxes when restating for principle change

## Summary

### Key Takeaways

| Type | Treatment | Prior Periods |
|------|-----------|--------------|
| **Change in Principle** | Retrospective | Restate |
| **Change in Estimate** | Prospective | No restatement |
| **Error Correction** | Retrospective | Restate |
| **Depreciation Method Change** | Prospective (as estimate) | No restatement |

### Quick Decision Tree
```
Is it a mistake?
  ├─ YES → Error correction → Retrospective restatement
  └─ NO → Is it based on new information?
           ├─ YES → Change in estimate → Prospective
           └─ NO → Change in principle → Retrospective
```
