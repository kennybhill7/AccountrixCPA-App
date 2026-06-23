# Contract Modifications Under ASC 606

## Overview

**Definition**: A contract modification is a change in the scope or price (or both) of a contract that is approved by the parties to the contract.

**Approval**: May be written, oral, or implied by customary business practices

**Key Principle**: Different modification treatments result in different timing and amounts of revenue recognition

## What is a Contract Modification?

### Required Elements

**Both must be present**:
1. **Change in scope or price** (or both)
2. **Approval by both parties** (mutual agreement required)

### Forms of Approval

- **Written amendment** - Clearest evidence
- **Oral agreement** - May be evidenced by emails, notes, partial performance
- **Implied by customary business practices** - Entity always accepts certain change requests

### NOT a Modification

| Scenario | Reason | Example |
|----------|--------|---------|
| **Exercise of option in original contract** | Part of original contract | Software contract grants option to add 100 users at $50/user specified in contract |
| **Resolution of variable consideration** | Update to transaction price | Performance bonus earned when completion date met |
| **Unilateral price concession** | Change in transaction price, not modification | Entity waives late fees without customer agreement |

## Four Modification Treatments

### Decision Framework

**Step 1**: Does modification add **distinct** goods/services at their **standalone selling price (SSP)**?
- **If YES** → Treatment #1: **Separate Contract**
- **If NO** → Proceed to Step 2

**Step 2**: Are remaining goods/services **distinct from those already transferred**?
- **If YES** → Treatment #2: **Prospective**
- **If NO** → Treatment #3: **Cumulative Catch-Up**
- **If MIXED** → Treatment #4: **Combination**

## Treatment #1: Separate Contract

### When to Use

Use when **BOTH** criteria met:
1. Modification adds **distinct** goods or services
2. Price for additions reflects their **standalone selling price (SSP)**

**Both required** - if only one met, this treatment does not apply

### Accounting Treatment

- **Original contract**: Continue unchanged
- **Modification**: Account for as separate new contract
- **No adjustment** to past revenue

### Example - Software License

**Facts**:
- Original contract (Jan 1): 500 user licenses for $500,000 annual
- SSP: $1,000 per user license per year
- Modification (June 1): Add 100 licenses for $50,000 (7 months remaining)
- Annualized price: $100,000 = SSP

**Analysis**:
- Criterion 1 (distinct): ✓ YES - Licenses sold separately regularly
- Criterion 2 (at SSP): ✓ YES - $100,000 annual equals SSP
- **Treatment**: SEPARATE CONTRACT

**Accounting**:
```
Original contract: $500,000 recognized over Year 1
Separate contract: $50,000 recognized from June-December (7 months)
Total Year 1 revenue: $550,000
```

**Entry - June 1**:
```
DR Cash                                    $50,000
   CR Contract Liability - New Contract            $50,000
```

**Monthly (June-December)**:
```
DR Contract Liability - New Contract        $7,143
   CR Revenue                                       $7,143

($50,000 / 7 months)
```

### CPA Exam Tips

- Look for: "at market price," "at SSP," "at normal rates"
- Entity regularly sells items separately → Criterion 1 likely met
- This is **simplest** treatment - original contract unaffected
- This is the **exception** - most modifications don't qualify

## Treatment #2: Prospective

### When to Use

- Modification does **NOT** qualify as separate contract (failed Treatment #1)
- **AND** remaining goods/services **are distinct** from those already transferred

### Accounting Treatment

**Terminate old contract, create new contract for remaining POs**

**Steps**:
1. Calculate new transaction price = Original remaining balance + Modification consideration
2. Calculate new obligations = Original remaining + Modification additions
3. Allocate new price to new obligations
4. Recognize revenue prospectively
5. **Do NOT adjust** revenue previously recognized

**Formula**:
```
New Transaction Price = Original TP - Revenue Recognized to Date + Modification Consideration
```

### Example - Consulting Services

**Facts**:
- Original: 1,000 hours at $300/hour = $300,000
- Through June 30: 400 hours delivered, $120,000 revenue recognized
- Remaining: 600 hours, $180,000
- Modification (July 1): Add 500 hours for $120,000 (discounted from $150,000 SSP)

**Analysis**:
- Distinct? YES - Consulting hours distinct
- At SSP? NO - $120,000 < $150,000 SSP (20% discount)
- Remaining distinct from delivered? YES
- **Treatment**: PROSPECTIVE

**Calculation**:
```
New transaction price:
  Remaining: $180,000
  + Modification: $120,000
  = Total: $300,000

New total hours:
  Remaining: 600
  + Modification: 500
  = Total: 1,100 hours

New rate per hour:
  $300,000 / 1,100 hours = $272.73/hour

Going forward: Recognize $272.73/hour (was $300/hour)
No adjustment to $120,000 already recognized
```

**Entries**:
```
July 1:
DR Accounts Receivable                  $120,000
   CR Contract Liability - Modified             $120,000

As services delivered after July 1:
DR Contract Asset/Liability              $XXX
   CR Revenue                                   $XXX

(At new rate of $272.73/hour)
```

### CPA Exam Tips

- **Prospective** = no adjustment to past revenue
- Calculate **new combined** price and **new combined** work
- Remaining services must be **distinct from already delivered**
- Common for time-and-materials or unit-based contracts

## Treatment #3: Cumulative Catch-Up

### When to Use

- Modification does **NOT** qualify as separate contract
- **AND** remaining goods/services are **NOT distinct** from those already transferred

### Accounting Treatment

**Account for modification as if it had been part of original contract from inception**

**Steps**:
1. Calculate modified total transaction price = Original + Modification
2. Calculate modified total PO = Original scope + Additions
3. Determine **percentage complete** based on modified totals
4. Calculate cumulative revenue should have been recognized = Modified total × % complete
5. Compare to revenue actually recognized
6. Recognize **catch-up adjustment** for difference

**Formulas**:
```
Modified Transaction Price = Original TP + Modification Consideration
Modified Total Costs = Original Costs + Modification Costs
Percentage Complete = Costs Incurred to Date / Modified Total Costs
Cumulative Revenue = Modified TP × Percentage Complete
Catch-Up Adjustment = Cumulative Revenue - Revenue Already Recognized
```

### Example - Construction Contract

**Facts**:
- Original: Build office building for $10M, estimated costs $8M
- Through June 30: Costs incurred $3.2M (40% complete)
- Revenue recognized through June 30: $4M (40% × $10M)
- Modification (July 1): Add floor for $2M, estimated costs $1.2M

**Analysis**:
- Distinct? NO - Additional floor integrated into building
- Remaining distinct from delivered? NO
- **Treatment**: CUMULATIVE CATCH-UP

**Calculation**:
```
Modified total transaction price:
  $10,000,000 + $2,000,000 = $12,000,000

Modified total costs:
  $8,000,000 + $1,200,000 = $9,200,000

Costs to date: $3,200,000 (no change yet)

Modified percentage complete:
  $3,200,000 / $9,200,000 = 34.78%

Cumulative revenue should have recognized:
  $12,000,000 × 34.78% = $4,173,600

Revenue already recognized: $4,000,000

Catch-up adjustment:
  $4,173,600 - $4,000,000 = $173,600 additional revenue
```

**Note**: Percentage complete decreased from 40% to 34.78% because project is now larger, but higher modification price more than offsets the dilution.

**Entries**:
```
July 1 - Record modification:
DR Accounts Receivable                $2,000,000
   CR Contract Liability                       $2,000,000

July 1 - Recognize catch-up adjustment:
DR Contract Asset                       $173,600
   CR Revenue (Catch-Up Adjustment)            $173,600
```

**Going Forward**:
- Future revenue based on modified total of $12M
- Future % complete uses modified costs of $9.2M

**Example - Dec 31** (if costs incurred total $5M):
```
Percentage complete: $5,000,000 / $9,200,000 = 54.35%
Cumulative revenue: $12,000,000 × 54.35% = $6,522,000
Less already recognized: $4,173,600
Second half Year 1 revenue: $2,348,400
```

### CPA Exam Tips

- **Cumulative catch-up** = adjust as if modification in original contract
- Common for **construction, development, integrated projects**
- Catch-up can be **positive** (more revenue) or **negative** (less revenue)
- **Negative** occurs when % complete decreases due to expanded scope
- Always show **revised % complete** calculation - often tested!

## Treatment #4: Combination

### When to Use

Modification includes **BOTH**:
- Some remaining goods/services that **ARE distinct** from delivered
- Some remaining goods/services that are **NOT distinct** from delivered

### Accounting Treatment

**Apply combination of treatments**:
- **Distinct** remaining items → Apply **prospective** treatment (Treatment #2)
- **Non-distinct** remaining items → Apply **cumulative catch-up** (Treatment #3)

### Example - Construction and Consulting

**Facts**:
- Original: (1) Construct facility $8M, (2) Training $500K = $8.5M total
- Through modification: Construction 50% complete ($4M recognized), Training not started
- Modification: Add features to facility (non-distinct) for $1.2M, Add training modules (distinct) for $300K

**Analysis**:
- Construction modification: NOT distinct (integrated into facility)
- Training modification: Distinct (separate modules)
- **Treatment**: COMBINATION

**Accounting**:

**Construction (Cumulative Catch-Up)**:
```
Modified price: $8,000,000 + $1,200,000 = $9,200,000
Assume 50% complete after modification
Cumulative revenue: $9,200,000 × 50% = $4,600,000
Already recognized: $4,000,000
Catch-up adjustment: $600,000
```

**Training (Prospective)**:
```
Remaining from original: $500,000
Added by modification: $300,000
New combined training: $800,000
Recognize prospectively as training delivered
```

### CPA Exam Tips

- Less commonly tested but can appear in complex simulations
- **Separately analyze** each performance obligation
- Apply appropriate treatment to each category
- Show your work clearly - partial credit available

## Comparison Table

| Treatment | When to Use | Impact on Original | Adjust Past Revenue? | Example |
|-----------|-------------|-------------------|---------------------|---------|
| **1. Separate Contract** | Adds distinct at SSP | No impact - continues unchanged | No | Add user licenses at standard price |
| **2. Prospective** | Remaining distinct from delivered | Terminate for remaining POs | No | Add consulting hours |
| **3. Cumulative Catch-Up** | Remaining NOT distinct | Adjust as if in original | Yes - catch-up | Add floor to building |
| **4. Combination** | Mix of distinct/non-distinct | Varies by PO | Yes, for non-distinct only | Add features (non-distinct) + training (distinct) |

## Special Considerations

### Unapproved Change Orders

**Scenario**: Entity performed work pursuant to change order not yet approved

**Accounting**:
- **General rule**: Do NOT account for as modification until approved
- **Exception**: May recognize revenue if:
  - **Highly probable** customer will approve AND
  - Amount can be **reasonably estimated**
- Apply **constraint** on variable consideration

**Example**: Contractor performs $100K extra work, will claim $150K. Customer hasn't approved but acknowledged work needed. If highly probable customer will pay, may recognize revenue (possibly constrained below $150K).

### Contract Renewals and Extensions

**Is it a modification?**

| Scenario | Treatment | Rationale |
|----------|-----------|-----------|
| **Option in original contract** | NOT a modification | Part of original contract - evaluate if material right |
| **Renewal after original ends** | NEW contract | Original ended; new one begins |
| **Extension before original ends** | MODIFICATION | Apply four-treatment framework |

### Price Changes Without Scope Changes

**Scenario**: Parties agree to change price but scope stays same

**Is it a modification?** YES - can be change in price, scope, or both

**Analysis**: No additional goods/services, so cannot be separate contract. Apply prospective or cumulative catch-up depending on whether remaining services distinct.

**Example**: Consulting contract 1,000 hours at $200/hour = $200K. After 400 hours, parties reduce total to $150K. Remaining 600 hours distinct from delivered 400.

**Prospective treatment**:
```
New price for remaining: $150,000 - $80,000 already recognized = $70,000
Remaining hours: 600
New rate: $70,000 / 600 = $116.67/hour going forward
```

## CPA Exam Strategies

### Multiple Choice Tips

- **Identify** modification questions quickly - look for "amended," "changed scope," "added services"
- **First test**: At SSP? If yes and distinct → separate contract (easiest)
- **Second test**: Remaining distinct from delivered? (Often the key question)
- **Cumulative catch-up** for integrated projects where modification can't be separated
- **Construction with scope increase** → think cumulative catch-up
- **Service contract with additional distinct services** → think prospective or separate

### Simulation Strategies

- Read facts carefully - what was original vs. modification
- Create **timeline**: original contract → performance to date → modification
- Work through **decision framework** systematically
- For cumulative catch-up: clearly show modified total and % complete
- For prospective: clearly show new combined price for remaining work
- Prepare supporting schedules before journal entries
- Label catch-up adjustments clearly

### Common Mistakes

- Assuming all modifications are separate contracts (this is rare!)
- Forgetting to test **BOTH** criteria for separate contract (distinct AND at SSP)
- Confusing prospective and cumulative catch-up
- Using old % complete instead of recalculating based on modified total
- Forgetting prospective means NO adjustment to past revenue
- Not stating which treatment you're applying

## Summary

### Key Points

- **Modification** = change in scope or price approved by both parties
- **Four treatments** depending on specific facts
- **Separate contract**: Distinct + SSP (both required)
- **Prospective**: Remaining services distinct from delivered → no past adjustment
- **Cumulative catch-up**: Remaining NOT distinct → adjust past revenue
- **Combination**: Mix of distinct/non-distinct
- Work through decision framework systematically
- Cumulative catch-up requires recalculating % complete
- Prospective never adjusts past revenue

### Decision Framework Summary

```
Modification exists (scope or price change, approved by both parties)
    ↓
Distinct goods/services at SSP?
    YES → Treatment #1: SEPARATE CONTRACT
    NO → Continue
    ↓
Remaining distinct from delivered?
    YES → Treatment #2: PROSPECTIVE
    NO → Treatment #3: CUMULATIVE CATCH-UP
    MIXED → Treatment #4: COMBINATION
```

### Memorization Aid

**Decision Path**:
- **Separate** (distinct + SSP) → **Prospective** (remaining distinct) → **Catch-up** (remaining not distinct)

**Key Differences**:
- **Prospective** = distinct remaining → no past adjustment
- **Catch-up** = integrated remaining → adjust past
