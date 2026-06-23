# Lease Modifications - ASC 842

## Overview

**Definition**: A change to the terms and conditions of a contract that results in a change in the **scope** or **consideration** of the lease

**Scope**: What is being leased (e.g., additional space, extended term, different asset)

**Consideration**: Lease payments

**Key Principle**: Accounting treatment depends on whether modification creates a **separate contract** or modifies the **existing lease**

## Lessee Accounting for Modifications

### Step 1: Test for Separate Contract

**Both criteria must be met**:
1. Lease grants **additional right-of-use** (increases scope)
2. Consideration increases by amount **commensurate with standalone price** for the increase in scope

**If BOTH met** → Account for as **separate lease**

**If NOT met** → Account for as **modification of existing lease**

#### Example - Separate Contract

**Scenario**: Lessee leases 5,000 sq ft of office space. During lease term, adds 2,000 sq ft at market rate.

**Analysis**:
```
Criterion 1: Additional ROU? YES - 2,000 additional sq ft
Criterion 2: At standalone price? YES - at current market rate

Result: SEPARATE CONTRACT
```

**Accounting**:
- Original lease for 5,000 sq ft continues unchanged
- Account for additional 2,000 sq ft as new, separate lease
- No remeasurement of original lease

### Step 2: Modification of Existing Lease

**If modification does not qualify as separate contract, account for as modification:**

#### General Treatment

**Actions**:
1. **Remeasure lease liability**:
   - Use **revised lease payments**
   - Use **revised discount rate** (reassess at modification date)
2. **Adjust ROU asset** by amount of remeasurement

**Entry**:
```
DR ROU Asset (or CR if decrease)         $XXX
   CR Lease Liability (or DR if decrease)      $XXX
```

#### Special Case 1: Modification Decreases Scope

**When**: Lessee gives up right to use asset (e.g., returns part of leased space, shortens lease term significantly)

**Treatment**:
1. **Decrease ROU asset** in proportion to decrease in scope
2. **Decrease lease liability** by remeasuring with revised payments
3. Recognize **gain or loss** for the difference

**Example**: Lessee returns 1,000 sq ft of 5,000 sq ft lease (20% decrease)

**Entries**:
```
Step 1 - Decrease ROU asset proportionally:
DR Lease Liability                       $XXX
DR Loss (if applicable)                  $XXX
   CR ROU Asset (20% of balance)                $XXX
   CR Gain (if applicable)                      $XXX

Step 2 - Remeasure remaining lease:
DR ROU Asset                             $XXX
   CR Lease Liability                            $XXX
```

#### Special Case 2: Modification Only Changes Payments (No Scope Change)

**When**: Lease term and scope unchanged, but payments modified (e.g., rent concession, payment restructuring)

**Treatment**:
1. Remeasure lease liability with revised payments
2. Adjust ROU asset by remeasurement amount

**No gain or loss recognition** - adjust ROU asset

### Example - Lease Extension

**Scenario**: Lessee extends lease term from 5 years to 7 years (adds 2 years)

**Original Facts**:
- Original lease liability balance: $200,000
- Remaining term before modification: 3 years
- Original discount rate: 5%

**Modification Facts**:
- Extension adds 2 years beyond original 5-year term
- Additional payments: $40,000/year for years 6-7
- Revised discount rate at modification: 7%
- Remaining payments after modification: Years 1-7

**Accounting**:

**Step 1**: Does NOT qualify as separate contract (not adding distinct space; modifying term)

**Step 2**: Remeasure lease liability
```
Remeasure with:
  - All remaining payments (original 3 years + additional 2 years)
  - Revised discount rate of 7%

Calculate new lease liability
Calculate adjustment needed from current $200,000
```

**Step 3**: Adjust ROU asset
```
DR or CR ROU Asset                       $XXX
   CR or DR Lease Liability                     $XXX

(For amount of remeasurement)
```

**Going Forward**:
- Amortize ROU asset over remaining lease term (now 5 years from modification date)
- Accrete lease liability using revised 7% rate

### Decision Tree - Lessee

```
Lease Modification Occurs
    ↓
Does it grant additional ROU at standalone price?
    ↓
YES → Separate contract (no remeasurement of original)
NO → Continue
    ↓
Does modification decrease scope?
    ↓
YES → Decrease ROU asset proportionally + remeasure liability
      Recognize gain/loss on difference
NO → Continue
    ↓
Changes only payments (not scope)?
    ↓
YES → Remeasure liability + adjust ROU asset
      No gain/loss
    ↓
All other modifications:
Remeasure liability with revised terms and rate + adjust ROU asset
```

## Lessor Accounting for Modifications

### General Approach

**Apply classification tests to modified lease as if it were a new lease**

**Re-evaluate**:
1. Does modified lease meet **sales-type** lease criteria?
2. Does modified lease meet **direct financing** lease criteria?
3. Otherwise, **operating lease**

### If Modification Creates Separate Contract

**Account for as new lease** - apply classification tests to new lease

**Original lease continues** under its original classification

### If Modification Does Not Create Separate Contract

**Step 1**: Determine if modified lease would be classified differently

**Step 2**:
- **If classification changes**: Account for as **new lease** from modification date
  - Derecognize old lease
  - Recognize new lease
- **If classification unchanged**: Account for as **continuation** with adjustments

### Example - Operating Lease Extension

**Original**: 5-year operating lease

**Modification**: Extend 2 years at market rate

**Analysis**:
- Does not create separate contract (extension, not additional distinct asset)
- Re-test classification: Still operating lease

**Accounting**: Continue as operating lease with updated lease term and payments

### Example - Operating to Sales-Type

**Original**: 3-year operating lease

**Modification**: Extend to 10 years (now exceeds major part of economic life)

**Analysis**:
- Classification changes to sales-type lease

**Accounting**:
1. Derecognize operating lease (remove asset, recognize gain/loss)
2. Recognize new sales-type lease from modification date

## Common Modification Scenarios

### 1. Lease Extension

**Lessee**:
- Test for separate contract (usually no)
- Remeasure liability with all remaining payments including extension
- Use revised discount rate
- Adjust ROU asset

**Lessor**:
- Re-test classification (extension may change classification if it now meets major part of economic life or PV test)

### 2. Additional Space at Market Rate

**Lessee**:
- Test for separate contract (usually yes if truly at market rate)
- Account for as separate lease

**Lessor**:
- Separate lease if criteria met

### 3. Rent Concession (Payment Reduction)

**Lessee**:
- Remeasure lease liability with reduced payments
- Adjust ROU asset (increases because liability decreased)
- No gain recognition (adjustment to ROU asset)

**Lessor**:
- May recognize loss if modification reduces expected collections

### 4. Early Termination

**Lessee**:
- Derecognize ROU asset and lease liability
- Recognize gain or loss for difference
- Pay any termination penalty

**Lessor**:
- Derecognize lease receivable (finance lease) or continue depreciating asset (operating)
- Recognize gain or loss

## Practical Considerations

### Reassessing Discount Rate

**At modification date, reassess**:
- Incremental borrowing rate (lessee)
- Rate implicit in lease (if determinable)

**Do NOT use original discount rate** - use rate at modification date

### Lease Term Reassessment

**Modification may trigger reassessment of**:
- Lease term (if options become more/less likely)
- Purchase option likelihood
- Residual value guarantees

### Remeasurement vs. Reassessment

**Remeasurement**: Required for modifications
- Use revised lease payments
- Use revised discount rate

**Reassessment**: May be required for non-modification events
- Use revised lease term or payment estimates
- Use original discount rate (key difference)

## CPA Exam Tips

### High-Yield Topics

**Most tested**: Lease extension scenarios requiring remeasurement

**Process**:
1. Test for separate contract first
2. If separate (additional space at market rate) → New lease, original unchanged
3. Otherwise → Remeasure existing lease

### Key Points to Remember

- **Separate contract requires BOTH**: Additional ROU + at standalone price
- **Remeasure** with revised payments AND revised rate
- **Decrease in scope**: Recognize gain or loss
- **Only payment changes**: Adjust ROU asset (no gain/loss)
- **Lessor**: Re-apply classification tests

### Common Mistakes

- Using original discount rate instead of revised rate
- Forgetting to test for separate contract first
- Not recognizing gain/loss when scope decreases
- Confusing modification accounting with reassessment accounting

### Exam Approach

1. Identify that a modification occurred (scope or consideration changed)
2. Test for separate contract (additional ROU at standalone price?)
3. If yes → separate lease
4. If no → remeasure existing lease
5. Determine if scope decreased (if yes, gain/loss recognition)
6. Show calculation of revised lease liability
7. Show adjustment to ROU asset

## Summary

### Key Points

- **Modification** = change in scope or consideration
- **Separate contract** if adds ROU at standalone price (both required)
- **Otherwise**: Remeasure lease liability with revised terms and **revised rate**
- **Adjust ROU asset** for remeasurement amount
- **Decrease in scope**: Recognize gain/loss for difference
- **Only payment change**: No gain/loss (adjust ROU asset)
- **Lessor**: Re-apply classification tests to modified lease

### Quick Reference

**Lessee Decision Process**:
1. Additional ROU at market rate? → Separate contract
2. Scope decrease? → Gain/loss recognition
3. All others → Remeasure and adjust ROU asset

**Remember**:
- Use **revised discount rate** for modifications
- Use **original discount rate** for reassessments
