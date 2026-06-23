# Error Corrections and Prior Period Adjustments

## Definition

**Errors** = Mistakes in recognition, measurement, presentation, or disclosure in previously issued financial statements

**Not errors**: Changes in estimates or changes in accounting principles

## Types of Errors

- Mathematical mistakes
- Mistakes in application of GAAP
- Oversight or misuse of facts
- Misappropriation of assets (fraud)

## Errors vs. Changes in Estimates vs. Changes in Principles

| Type | Treatment | Example |
|------|-----------|---------|
| **Error** | **Restate prior periods** (retroactive correction) | Inventory counted incorrectly |
| **Change in estimate** | **Prospective** application (no restatement) | Revise useful life of asset |
| **Change in principle** | **Retrospective** application (adjust beginning RE, not error) | Change from FIFO to weighted average |

**Key distinction**: Errors are **mistakes**; changes in estimates reflect **new information**

## Correction Method

### Retrospective Restatement

**Correct prior period financial statements as if error never occurred**

**Steps**:
1. Adjust beginning retained earnings of earliest period presented for cumulative effect
2. Restate all affected prior period amounts
3. Disclose nature of error and impact

**Entry pattern**:
```
DR or CR Retained Earnings (beginning)     $XXX
   DR or CR Affected account                    $XXX
```

## Common Errors

### 1. Inventory Errors

**Effect**: Impacts COGS, net income, and retained earnings

**Self-correcting**: YES - corrects itself over **two years** if not discovered

**Example - Ending Inventory Overstated by $10,000**:

**Year 1 impact**:
```
Ending inventory: Overstated $10,000
COGS: Understated $10,000 (COGS = Beg + Purch - End)
Net income: Overstated $10,000 (before tax)
Retained earnings: Overstated (at Year 1 end)
```

**Year 2 impact**:
```
Beginning inventory: Overstated $10,000
COGS: Overstated $10,000
Net income: Understated $10,000
Retained earnings: No net effect by Year 2 end (self-corrected)
```

**Tax effect** (assume 30% rate):
```
After-tax impact: $10,000 × 70% = $7,000
```

**Correction if discovered in Year 3** (after Year 2 closed):
- No entry needed for Year 3 statements
- Error self-corrected by end of Year 2

**Correction if discovered during Year 2**:
```
DR Retained Earnings                       $7,000
DR Deferred Tax Asset                       3,000
   CR Inventory                                   $10,000
```

### 2. Accrual Errors

**Example**: Failed to record $5,000 accrued expense at Year 1 end

**Impact**:
```
Year 1: Expenses understated $5,000
        Net income overstated $5,000
        Liability understated $5,000
```

**Correction (when discovered)**:
```
DR Retained Earnings                       $XXX
   CR Accrued Liability                           $XXX

(After-tax amount)
```

### 3. Depreciation Errors

**Example**: Failed to record $20,000 depreciation in Year 1

**Impact**:
```
Year 1: Depreciation expense understated $20,000
        Net income overstated $20,000
        Accumulated depreciation understated $20,000
```

**Correction**:
```
DR Retained Earnings                       $14,000  (after tax: $20K × 70%)
DR Deferred Tax Asset                        6,000
   CR Accumulated Depreciation                     $20,000
```

**Note**: Depreciation errors are **non-counterbalancing** (do NOT self-correct)

### 4. Revenue Recognition Errors

**Example**: Recorded $30,000 revenue in Year 1 that should have been deferred to Year 2

**Correction** (if discovered in Year 2 before revenue earned):
```
DR Retained Earnings                       $21,000  (after tax)
DR Deferred Tax Asset                        9,000
   CR Unearned Revenue                            $30,000
```

## Counterbalancing vs. Non-Counterbalancing

### Counterbalancing Errors

**Definition**: Errors that **self-correct over two accounting periods**

**Examples**:
- Inventory errors
- Accrual errors (if properly recorded next period)
- Prepayment errors

**Note**: Even though self-correcting, must restate if discovered before self-correction completes

### Non-Counterbalancing Errors

**Definition**: Errors that do **NOT** self-correct

**Examples**:
- Depreciation errors
- Capitalization vs. expense errors (capitalize when should expense, or vice versa)
- Omission of asset or liability that persists

**Require correction** regardless of when discovered

## Journal Entry Patterns

### Error Overstated Asset or Revenue
```
DR Retained Earnings (if prior period)     $XXX
   CR Asset or Receivable                          $XXX

Or:
DR Retained Earnings                       $XXX
   CR Revenue (if current period corrected)        $XXX
```

### Error Understated Liability or Expense
```
DR Retained Earnings                       $XXX
   CR Liability                                    $XXX

Or:
DR Expense (if current period)             $XXX
   CR Payable                                      $XXX
```

## Impact Formula

**If inventory overstated** → COGS understated → NI overstated → RE overstated

**If expense understated** → NI overstated → RE overstated

**If revenue overstated** → NI overstated → RE overstated

**If asset overstated** → Usually RE overstated (depends on nature)

## CPA Exam Tips

### Key Distinctions

- **Errors** = Restate prior periods (retroactive)
- **Changes in estimates** = Prospective (no restatement)

### Inventory Errors

- Self-correct over 2 years
- Must restate if discovered during self-correction period
- Formula: End inventory ↑ → COGS ↓ → NI ↑

### Tax Effects

- Error adjustments are **after-tax amounts**
- If income overstated, retained earnings overstated after-tax
- Must consider deferred tax impact

### Self-Correction

- Counterbalancing errors self-correct over 2 years
- Non-counterbalancing errors do not self-correct
- Even if self-correcting, restate if discovered early

### Common Test Pattern

Given: Error discovered after financial statements issued

Required: Determine impact on prior year's net income or retained earnings

Approach:
1. Identify what was wrong
2. Determine impact on NI/RE
3. Calculate after-tax effect
4. Prepare correction entry

## Summary

### Key Points

- **Errors** = Restate prior periods (retrospective correction)
- **Adjust beginning retained earnings** of earliest period presented for cumulative effect
- **Inventory errors** self-correct over 2 years (but must restate if discovered)
- **Changes in estimates ≠ errors** (estimates are prospective)
- **Counterbalancing** errors self-correct; **non-counterbalancing** don't
- **Tax effects**: Use after-tax amounts for retained earnings adjustments

### Quick Formula

**Impact on Retained Earnings**:
```
If asset/revenue overstated → RE overstated
If liability/expense understated → RE overstated

If asset/revenue understated → RE understated
If liability/expense overstated → RE understated

All after tax
```

### Inventory Error Pattern

```
End inventory overstated:
  Year 1: COGS ↓, NI ↑, RE ↑
  Year 2: COGS ↑, NI ↓, RE corrects
```

### Memorization Aid

**Error = RESTATE** (retroactive correction)

**Estimate = PROSPECTIVE** (no restatement)

**Inventory errors = 2-year self-correction**
