# Loss Contingencies - Detailed Accounting Treatment

## Overview

**Standard**: ASC 450 (Contingencies)

**Definition**: Existing condition, situation, or set of circumstances involving **uncertainty** as to possible loss that will ultimately be resolved when future event occurs or fails to occur

**Key Question**: Should loss contingency be **accrued**, **disclosed**, or **neither**?

## Three-Level Framework

### Probability Levels

| Level | Definition | Accounting Treatment |
|-------|------------|---------------------|
| **Probable** | Likely to occur (>75%) | **Accrue** loss + **Disclose** |
| **Reasonably Possible** | More than remote but less than probable (~5-75%) | **Disclose** only |
| **Remote** | Slight chance (<5%) | **No accrual**, **no disclosure** |

### Accrual Criteria (Both Required)

Loss contingency must be **accrued** if **BOTH** conditions met:
1. It is **probable** that liability has been incurred (or asset impaired)
2. Amount of loss can be **reasonably estimated**

**If both met** → **DR Loss/Expense, CR Liability**

**If only one met** → **Disclose** only (no accrual)

**If neither met** → **No accrual**, consider disclosure if reasonably possible

## Litigation Contingencies

### Probable Loss

**Situation**: Lawsuit where loss is probable and estimable

**Accounting**: **Accrue** estimated loss

**Entry**:
```
DR Loss from Litigation                  $XXX
   CR Liability for Lawsuit                     $XXX
```

**Disclosure**: Describe nature, amount accrued, and any additional exposure

**Example**:
- Company sued for $500,000
- Legal counsel advises loss is probable
- Estimate: Will likely settle for $300,000

**Entry**:
```
DR Loss from Litigation                  $300,000
   CR Litigation Liability                      $300,000
```

### Reasonably Possible Loss

**Situation**: Lawsuit where loss is reasonably possible but not probable

**Accounting**: **No accrual**

**Disclosure**: Describe nature of contingency and estimate of possible loss (or range, or statement that estimate cannot be made)

**Example**:
- Company sued for $1,000,000
- Legal counsel believes loss is reasonably possible but not probable

**Treatment**: **Disclose** in footnotes; **no journal entry**

### Remote Loss

**Situation**: Lawsuit where loss is remote

**Accounting**: **No accrual**, **no disclosure** (generally)

**Exception**: Some guarantees require disclosure even if remote

### Special Case: Settlement After Year-End But Before Issuance

**Situation**: Lawsuit settled after balance sheet date but before financial statements issued

**Question**: Is this a Type I or Type II subsequent event?

**Analysis**:
- **If lawsuit related to conditions existing at balance sheet date** → **Type I** (recognized event)
  - Provides evidence about amount of loss
  - **Adjust** financial statements

**Example**:
- Balance sheet date: December 31, Year 1
- Lawsuit pending at 12/31, outcome uncertain
- Settlement: January 15, Year 2 for $400,000
- Financial statements issued: February 1, Year 2

**Treatment**: **Recognize** $400,000 loss in Year 1 financial statements (Type I subsequent event provides evidence of amount)

### Range of Estimates with No Best Estimate

**Situation**: Loss is probable and estimable, but estimate is a range with no amount more likely than others

**Accounting**: Accrue the **minimum** amount in the range

**Disclose**: Indicate that loss could be higher (disclose range)

**Example**:
- Environmental cleanup estimated between $2M and $5M
- No amount more likely than others

**Entry**:
```
DR Environmental Remediation Expense     $2,000,000
   CR Environmental Liability                   $2,000,000
```

**Disclosure**: "Loss could be as high as $5,000,000"

## Product Warranties

### Accounting Method

**Principle**: Expense warranty cost **when sale is made** (matching principle)

**Not** when warranty cost is incurred

**Estimate Based On**:
- Historical experience
- Percentage of sales
- Units sold
- Statistical analysis

### Journal Entries

**At Sale** (recognize expense and liability):
```
DR Warranty Expense                      $XXX
   CR Warranty Liability                        $XXX
```

**When Warranty Cost Incurred**:
```
DR Warranty Liability                    $XXX
   CR Cash / Inventory / Payroll                $XXX
```

### Example

**Facts**:
- Sales for year: $1,000,000
- Estimated warranty cost: 2% of sales
- Actual warranty costs incurred during year: $15,000

**Entry at Year-End**:
```
Sales: $1,000,000
Estimated warranty: $1,000,000 × 2% = $20,000

DR Warranty Expense                       $20,000
   CR Warranty Liability                         $20,000

(To record estimated warranty obligation)
```

**When Costs Incurred**:
```
DR Warranty Liability                     $15,000
   CR Cash / Inventory                           $15,000

(To record actual warranty costs paid)
```

**Resulting Warranty Liability Balance**: $20,000 - $15,000 = $5,000 remaining

### Service-Type vs. Assurance-Type Warranties

**Assurance-Type Warranty**:
- Guarantees product complies with agreed specifications
- Included in sale price
- **Account for as contingency** (accrue expense as shown above)

**Service-Type Warranty**:
- Provides service beyond assurance
- Customer can purchase separately
- **Account for as separate performance obligation** (revenue recognition)

## Self-Insurance

### Key Principle

**Do NOT accrue for self-insurance arrangements**

**Rationale**: No liability exists until loss event actually occurs

### Common Mistake

**Incorrect** (do not do this):
```
DR Self-Insurance Expense                $XXX
   CR Self-Insurance Reserve                    $XXX
```

**Reason**: Accruing creates a reserve that is not a liability (no obligating event has occurred)

### Correct Accounting

**When Loss Event Occurs**:
```
DR Loss from [specific event]            $XXX
   CR Cash / Liability                          $XXX

(Recognize actual loss when it happens)
```

### Disclosure

**Disclose** self-insurance arrangements in footnotes:
- Nature of self-insurance
- Types of risks self-insured
- Any amounts set aside (but not accrued as liability)

### Example

**Company self-insures for property damage**:
- Do **NOT** accrue estimated future losses
- **Disclose** that company self-insures
- When fire occurs causing $50,000 damage:
  ```
  DR Loss from Fire Damage               $50,000
     CR Cash                                     $50,000
  ```

## Guarantees

### Standard

**ASC 460** (Guarantees) provides specific guidance

### Recognition

**At Inception**: Recognize liability at **fair value** of guarantee obligation

**Key Point**: Recognize **even if payment is remote**

### Measurement

**Fair value** of guarantee = what third party would charge to assume the guarantee

### Disclosure

**Always disclose** guarantees, even if remote:
- Nature of guarantee
- Maximum potential payment
- Carrying amount of liability
- Recourse provisions

### Example

**Company guarantees subsidiary's $1,000,000 debt**:

**At Inception**:
```
Assume FV of guarantee = $15,000

DR Expense (or Asset if for consideration)  $15,000
   CR Guarantee Liability                           $15,000

(To record guarantee at fair value)
```

**If Subsidiary Defaults**:
```
DR Guarantee Liability                      $15,000
DR Loss on Guarantee                       $985,000
   CR Cash                                       $1,000,000

(To record payment under guarantee)
```

**Disclosure**: Required regardless of probability

## Environmental Liabilities

### Recognition

**Accrue when**:
1. **Probable** that liability has been incurred (often triggered by legal requirements or site assessment)
2. Amount can be **reasonably estimated**

### Common Triggers

- **Legal requirements** for cleanup (EPA directive)
- **Site assessment** identifies contamination
- **Participation** in cleanup required by law
- **Voluntary commitment** to remediate

### Measurement Issues

**Challenges**:
- Long time horizon (cleanup may take years)
- Uncertainty about remediation technology
- Regulatory changes
- Shared responsibility with other parties

**Discount to Present Value**:
- **If** timing and amount of cash flows are **reliably determinable**
- **Then** may discount to present value using risk-free rate

### Example

**Facts**:
- EPA identifies company's site requires cleanup
- Estimated cost: $3,000,000
- Cleanup will take 3 years
- Timing and amounts reliably determinable
- Risk-free rate: 5%

**Calculation**:
```
PV of $3,000,000 over 3 years at 5%

Could use present value if cash flows determinable
```

**Entry**:
```
DR Environmental Remediation Expense     $XXX
   CR Environmental Liability                   $XXX

(Amount is PV if conditions met, otherwise gross amount)
```

**Subsequent Periods**: Accrete liability using interest method if discounted

### Disclosure

- Nature of obligation
- Estimate of costs
- Timing of payments
- Uncertainty factors
- Other potentially responsible parties

## CPA Exam Tips

### Key Decision Rules

| Scenario | Accounting Treatment |
|----------|---------------------|
| **Warranties** | **Always accrue** when sale made (matching principle) |
| **Self-insurance** | **Never accrue** until loss event occurs |
| **Guarantees** | **Recognize liability at FV** at inception + always disclose |
| **Litigation - probable** | Accrue + disclose |
| **Litigation - reasonably possible** | Disclose only |
| **Environmental - probable & estimable** | Accrue + disclose |

### Common Test Patterns

**Warranty Question**:
- Look for sales amount and estimated warranty percentage
- Accrue at time of sale
- DR Warranty Expense, CR Warranty Liability

**Self-Insurance Question**:
- Look for attempt to accrue future losses
- **Do not accrue** until event occurs
- Common wrong answer: Accrue reserve

**Guarantee Question**:
- Recognize at FV at inception
- Always disclose (even if remote)

**Litigation Question**:
- Assess probability (probable, reasonably possible, remote)
- Apply accrual criteria
- Watch for settlements after year-end

**Range with No Best Estimate**:
- Accrue **minimum** amount
- Disclose potential for higher loss

### Memory Aids

**Warranties**: **Accrue** at sale (matching principle)

**Self-Insurance**: **Accrue** when loss **Actually** occurs

**Guarantees**: **FV** at inception, **Always** disclose

**Litigation**: **P**robable + **E**stimable = **A**ccrue (**PEA**)

## Summary

### Key Points

- **Accrual criteria**: **Probable** + **Estimable** (both required)
- **Warranties**: Accrue at time of sale (matching principle)
- **Self-insurance**: No accrual until loss event occurs (no obligating event)
- **Guarantees**: Recognize liability at FV at inception + always disclose
- **Environmental**: Accrue when probable and estimable (often from legal requirements)
- **Litigation**:
  - Probable → Accrue + disclose
  - Reasonably possible → Disclose only
  - Remote → Generally no disclosure
- **Range with no best estimate**: Accrue minimum, disclose range
- **Subsequent event** (settlement after year-end): Type I if relates to conditions at balance sheet date

### Quick Reference

**Warranty Entries**:
```
At Sale:
DR Warranty Expense
   CR Warranty Liability

When Incurred:
DR Warranty Liability
   CR Cash/Inventory
```

**Self-Insurance**:
```
NO accrual until event occurs

When Event Occurs:
DR Loss
   CR Cash
```

**Guarantee**:
```
At Inception:
DR Expense
   CR Guarantee Liability (at FV)
```

**Litigation (if probable and estimable)**:
```
DR Loss
   CR Litigation Liability
```

### Exam Focus

Loss contingencies are **MEDIUM weight** with **MEDIUM difficulty**

**Most tested**:
- Warranty accounting (accrual at sale)
- Self-insurance (no accrual until event)
- Guarantee recognition (FV, always disclose)
- Litigation probability assessment

**Key Distinction**: Warranties vs. self-insurance
- Warranties → **Accrue** (obligating event is the sale)
- Self-insurance → **Don't accrue** (no obligating event until loss)
