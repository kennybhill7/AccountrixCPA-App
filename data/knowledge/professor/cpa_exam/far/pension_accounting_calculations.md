# Pension Accounting Calculations and Journal Entries

## Overview

Pension accounting requires understanding **five pension expense components**, reconciling **Projected Benefit Obligation (PBO)** and **plan assets**, and preparing journal entries.

**Standard**: ASC 715 (Compensation - Retirement Benefits)

**Key Concept**: Employer reports net funded status on balance sheet (plan assets - PBO)

## Five Components of Pension Expense

### 1. Service Cost

**Definition**: Present value of benefits earned by employees during the current period

**Provided by**: Actuary

**Direction**: **Increases** pension expense (always positive component)

**Example**: $150,000

### 2. Interest Cost

**Definition**: Interest on the beginning PBO for the passage of time

**Formula**:
```
Interest Cost = Beginning PBO × Discount Rate
```

**Discount Rate**: Market rate on high-quality corporate bonds

**Direction**: **Increases** pension expense (always positive)

**Example**:
```
Beginning PBO: $2,000,000
Discount rate: 5%
Interest Cost: $2,000,000 × 5% = $100,000
```

### 3. Expected Return on Plan Assets

**Definition**: Expected long-term rate of return applied to beginning plan assets

**Formula**:
```
Expected Return = Beginning Plan Assets (FV) × Expected Rate of Return
```

**Direction**: **Decreases** pension expense (shown as negative)

**Key Point**: Use **expected** return (not actual) for expense calculation

**Example**:
```
Beginning plan assets: $1,800,000
Expected return rate: 7%
Expected Return: $1,800,000 × 7% = $126,000 (reduces expense)
```

**Note**: Difference between actual and expected return goes to OCI

### 4. Amortization of Prior Service Cost

**Definition**: Cost of retroactive benefits granted in plan amendments, amortized over remaining service life

**When Created**: Plan amendment grants retroactive benefits

**Direction**: **Increases** pension expense

**Amortization**: Straight-line over average remaining service period of active employees

**Example**: $20,000 (given amount for current year)

### 5. Amortization of Net Gain or Loss (Corridor Approach)

**Definition**: Amortization of actuarial gains/losses and differences between expected and actual returns

**Corridor**: 10% of greater of beginning PBO or beginning plan assets (FV)

**Amortization** (if outside corridor):
```
Amortization = (Net Loss or Gain - Corridor) / Average Remaining Service Life
```

**Direction**:
- Net **loss** → **Increases** expense
- Net **gain** → **Decreases** expense

**Example Calculation**:
```
Beginning PBO: $2,000,000
Beginning plan assets: $1,800,000
Net loss in AOCI: $300,000

Greater of PBO or assets: $2,000,000
Corridor: $2,000,000 × 10% = $200,000

Net loss ($300,000) > Corridor ($200,000)
Excess: $300,000 - $200,000 = $100,000

Assuming average remaining service life of 10 years:
Amortization: $100,000 / 10 years = $10,000 (increases expense)
```

## Total Pension Expense Formula

```
Pension Expense = Service Cost
                + Interest Cost
                - Expected Return on Plan Assets
                + Amortization of Prior Service Cost
                + Amortization of Net Loss (or - Net Gain)
```

## Comprehensive Example

### Given Information

- **PBO 1/1**: $2,000,000
- **Plan assets FV 1/1**: $1,800,000
- **Service cost**: $150,000
- **Discount rate**: 5%
- **Expected return rate**: 7%
- **Actual return**: $140,000
- **Employer contribution**: $200,000
- **Benefits paid**: $100,000
- **Prior service cost amortization**: $20,000
- **Net loss 1/1 in AOCI**: $300,000
- **Average remaining service life**: 10 years
- **Actuarial loss during year**: $50,000

### Step 1: Calculate Pension Expense

**Service Cost**:
```
Service cost                                         $150,000
```

**Interest Cost**:
```
Beginning PBO × Discount rate
$2,000,000 × 5%                                      $100,000
```

**Expected Return on Plan Assets**:
```
Beginning plan assets × Expected return rate
$1,800,000 × 7%                                     $(126,000)
```

**Amortization of Prior Service Cost**:
```
Given                                                 $20,000
```

**Amortization of Net Loss (Corridor)**:
```
Greater of beginning PBO or plan assets:
Greater of ($2,000,000, $1,800,000) =               $2,000,000

Corridor: $2,000,000 × 10% =                         $200,000

Net loss in AOCI: $300,000
Excess over corridor: $300,000 - $200,000 =          $100,000

Amortization: $100,000 / 10 years =                   $10,000
```

**Total Pension Expense**:
```
Service cost                                         $150,000
Interest cost                                        +100,000
Expected return on plan assets                       -126,000
Amortization of prior service cost                    +20,000
Amortization of net loss                              +10,000
                                                     ─────────
Total Pension Expense                                $154,000
                                                     ═════════
```

### Step 2: Reconcile PBO

```
Beginning PBO                                      $2,000,000
+ Service cost                                        +150,000
+ Interest cost                                       +100,000
- Benefits paid to retirees                           -100,000
+ Actuarial loss during year                           +50,000
                                                   ───────────
Ending PBO                                         $2,200,000
                                                   ═══════════
```

**Key Points**:
- Service cost and interest cost **increase** PBO
- Benefits paid **decrease** PBO
- Actuarial gains/losses adjust PBO
- Prior service cost grants would increase PBO (not in this example)

### Step 3: Reconcile Plan Assets

```
Beginning plan assets (FV)                         $1,800,000
+ Actual return on plan assets                        +140,000
+ Employer contribution                               +200,000
- Benefits paid to retirees                           -100,000
                                                   ───────────
Ending plan assets (FV)                            $2,040,000
                                                   ═══════════
```

**Key Points**:
- **Actual** return affects plan assets (not expected)
- Contributions **increase** plan assets
- Benefits paid **decrease** plan assets

### Step 4: Calculate Funded Status

```
Plan assets (FV)                                   $2,040,000
Less: PBO                                          -2,200,000
                                                   ───────────
Funded Status                                       $(160,000)
                                                   ═══════════

Underfunded → Report as Pension Liability on balance sheet
```

**If positive** → Overfunded → Report as Pension Asset

### Step 5: Journal Entry

```
DR Pension Expense                                   $154,000
DR Plan Assets                                        200,000
   CR Cash (contribution)                                      $200,000
   CR Pension Liability (net)                                   154,000

To record pension expense and employer contribution
```

**Alternative Presentation**:
```
DR Pension Expense                                   $154,000
   CR Pension Liability                                        $154,000

DR Pension Liability                                 $200,000
   CR Cash                                                     $200,000

(Records expense, then contribution separately)
```

**Net Effect on Pension Liability**:
```
Beginning liability: $(200,000)  [Assets $1.8M - PBO $2M]
Expense increases liability:    $(154,000)
Contribution decreases liability: $200,000
Ending liability:               $(154,000)  (calculated directly below)
```

**Direct Calculation of Balance Sheet Liability**:
```
Ending plan assets:              $2,040,000
Ending PBO:                      -2,200,000
                                 ───────────
Ending pension liability:         $(160,000)
                                 ═══════════

(Small difference from calculation above due to rounding or
 other comprehensive income adjustments not shown)
```

## Key Relationships

### PBO Changes

**PBO Increases from**:
- Service cost (benefits earned this period)
- Interest cost (passage of time)
- Actuarial losses (assumptions change unfavorably)
- Plan amendments granting prior service cost (retroactive benefits)

**PBO Decreases from**:
- Benefits paid to retirees
- Actuarial gains (assumptions change favorably)
- Plan curtailments (reduce benefits)

### Plan Assets Changes

**Plan Assets Increase from**:
- Employer contributions
- Actual return on investments (if positive)

**Plan Assets Decrease from**:
- Benefits paid to retirees
- Negative actual returns (investment losses)

### Benefits Paid

**Key Point**: Benefits paid **reduce BOTH** PBO and plan assets by the same amount

**Effect**: Wash - does not change funded status

## Common CPA Exam Scenarios

### Scenario 1: Calculate Pension Expense

**Most common question type**

**Approach**:
1. List five components
2. Calculate each (formulas provided above)
3. Sum to get total expense

**Watch for**: Expected return (not actual) used in expense

### Scenario 2: Determine Funded Status

**Question**: What is the funded status? What appears on balance sheet?

**Calculation**:
```
Funded Status = Plan Assets (FV) - PBO

If negative: Liability (underfunded)
If positive: Asset (overfunded)
```

### Scenario 3: Corridor Amortization

**Given**: Beginning PBO, plan assets, net loss/gain in AOCI

**Steps**:
1. Determine corridor: 10% × Greater of (PBO, Plan Assets)
2. Calculate excess: Net loss/gain - Corridor
3. If no excess, no amortization
4. If excess, amortize over average remaining service life

### Scenario 4: Reconcile PBO or Plan Assets

**Given**: Beginning balance and some changes

**Required**: Calculate ending balance

**Approach**: Use reconciliation formulas shown above

## CPA Exam Tips

### Key Points to Remember

**Expected vs. Actual Return**:
- **Expected return** → Reduces pension **expense**
- **Actual return** → Affects plan **assets**
- Difference between two goes to **OCI** (Other Comprehensive Income)

**Benefits Paid**:
- Reduce **BOTH** PBO and plan assets
- **Wash** effect on funded status
- Does **NOT** affect pension expense

**Interest Cost Formula**:
```
Interest Cost = Beginning PBO × Discount Rate
```

**Expected Return Formula**:
```
Expected Return = Beginning Plan Assets × Expected Return Rate
```

**Corridor**:
```
Corridor = 10% × Greater of (Beginning PBO or Beginning Plan Assets FV)
```

**Amortize** only if net loss/gain exceeds corridor

### Common Mistakes

- Using actual return instead of expected return in expense
- Forgetting that benefits paid reduce BOTH PBO and assets
- Using wrong beginning balances for interest cost or expected return
- Not checking if outside corridor before amortizing gains/losses
- Adding expected return instead of subtracting (it reduces expense)

### Memorization Aid

**Pension Expense Components** (in order):
1. **S**ervice cost (+)
2. **I**nterest cost (+)
3. **E**xpected return (-)
4. **P**rior service cost amortization (+)
5. **G**ain/Loss amortization (+/-)

**Mnemonic**: **"SI-E-PG"** or **"Service, Interest, Expected, Prior, Gain/Loss"**

## Summary

### Key Points

- **Pension expense** = Service + Interest - Expected return + Amortizations
- **PBO increases**: Service cost, interest cost, actuarial losses, plan amendments
- **PBO decreases**: Benefits paid, actuarial gains
- **Plan assets increase**: Contributions, actual returns
- **Plan assets decrease**: Benefits paid
- **Benefits paid** reduce BOTH PBO and assets (wash)
- **Funded status** = Plan assets - PBO (reported on balance sheet)
- **Expected return** reduces expense; **actual return** affects assets
- **Corridor**: 10% × Greater of (PBO or assets)
- Amortize gain/loss only if outside corridor

### Quick Formula Reference

| Component | Formula |
|-----------|---------|
| **Interest Cost** | Beginning PBO × Discount rate |
| **Expected Return** | Beginning plan assets × Expected return rate |
| **Corridor** | 10% × Greater of (Beg. PBO, Beg. Plan Assets) |
| **Gain/Loss Amort** | (Net loss/gain - Corridor) / Avg service life |
| **Funded Status** | Plan assets (FV) - PBO |

### Exam Focus

Pension questions are **HIGH weight** and **HIGH difficulty**

**Most tested**:
- Calculate total pension expense (all 5 components)
- Corridor amortization calculation
- Reconcile PBO or plan assets
- Determine funded status

**Practice**: Work through comprehensive examples multiple times until formulas are automatic
