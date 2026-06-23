# Pensions and Postretirement Benefits - ASC 715

## Overview

**ASC 715**: Accounting for employer-sponsored pension and postretirement benefit plans

**Key Challenge**: Complex actuarial calculations and multi-component expense recognition

## Plan Types

### Defined Contribution Plan

**Description**: Employer contributes a **fixed amount** (e.g., % of salary)

**Examples**:
- 401(k) plans
- Profit-sharing plans

**Accounting**: **Simple**
```
Expense = Contribution Amount

DR Pension Expense               $XXX
   CR Cash (or Payable)                 $XXX
```

**Risk Bearer**: **Employee** bears investment risk and longevity risk

**No balance sheet asset/liability**: Employer's obligation ends with contribution

### Defined Benefit Plan

**Description**: Employer promises specific **benefit** at retirement (e.g., monthly payment based on salary and years of service)

**Examples**: Traditional pension plans

**Accounting**: **Complex** - requires actuarial calculations

**Risk Bearer**: **Employer** bears investment risk and longevity risk

**Balance sheet recognition**: Report funded status (asset or liability)

**Focus of this topic**: Defined benefit plans (high CPA exam weight)

## Defined Benefit Plans - Key Terms

### Projected Benefit Obligation (PBO)

**Definition**: Present value of all benefits earned to date, using **future salary levels**

**Includes**: Estimated future salary increases

**Use**: Used for expense calculation and funded status

### Accumulated Benefit Obligation (ABO)

**Definition**: Present value of benefits earned to date, using **current salary levels**

**Excludes**: Future salary increases

**Use**: Used for certain disclosures; less common than PBO

### Fair Value of Plan Assets

**Definition**: Current market value of assets held in pension trust

**Assets**: Stocks, bonds, other investments held separately from employer

### Funded Status

**Definition**: **Fair value of plan assets - PBO**

**If Positive (Assets > PBO)**: **Overfunded** → Report **asset** on balance sheet

**If Negative (Assets < PBO)**: **Underfunded** → Report **liability** on balance sheet

**ASC 715 requirement**: Report funded status on balance sheet

## Pension Expense Components

### Formula
```
Pension Expense = Service Cost
                + Interest Cost
                - Expected Return on Assets
                + Amortization of Prior Service Cost
                + Amortization of Net Gain/Loss
```

### 1. Service Cost

**Definition**: Present value of benefits **earned by employees during current year**

**Effect**: **Always increases** expense

**Reasoning**: Current year's labor cost

### 2. Interest Cost

**Definition**: Interest on the PBO (passage of time increases present value of obligation)

**Calculation**: **Beginning PBO × Discount Rate**

**Effect**: **Always increases** expense

**Reasoning**: Obligation grows as employees get closer to retirement

### 3. Expected Return on Assets

**Definition**: Expected earnings on plan assets for the year

**Calculation**: **Beginning Fair Value of Assets × Expected Return Rate**

**Effect**: **Always decreases** expense (or increases income)

**Reasoning**: Investment returns offset cost of providing benefits

**Note**: Use **expected return**, not actual return. Difference flows through gain/loss.

### 4. Amortization of Prior Service Cost

**Definition**: Cost of retroactive benefits granted by plan amendments

**Treatment**:
- Initially recognized in **OCI** (not expense)
- **Amortized to expense** over:
  - Remaining service period of active employees, OR
  - Average remaining service period

**Effect**: **Increases** expense (when amortized)

### 5. Amortization of Net Gain/Loss

**Sources of gains/losses**:
- Actuarial assumption changes (discount rate, mortality, turnover)
- Difference between expected and actual return on assets

**Initial treatment**: Recognize in **OCI** (not expense)

**Amortization**: Only if outside **corridor**

**Corridor**: 10% × Greater of (PBO or FV of assets)

**If outside corridor**: Amortize **excess** over remaining service period

**Effect**: Increases (loss) or decreases (gain) expense

## Example - Pension Expense Calculation

### Facts

- Beginning PBO: $1,000,000
- Service cost: $120,000
- Discount rate: 6%
- Beginning FV of plan assets: $800,000
- Expected return rate: 8%
- Amortization of prior service cost: $10,000
- Net loss amortization: $5,000

### Calculation

**Service Cost**: $120,000

**Interest Cost**: $1,000,000 × 6% = $60,000

**Expected Return on Assets**: $800,000 × 8% = $(64,000) (reduces expense)

**Prior Service Cost Amortization**: $10,000

**Net Loss Amortization**: $5,000

**Total Pension Expense**:
```
Service cost                       $120,000
+ Interest cost                      60,000
- Expected return on assets         (64,000)
+ Amortization of PSC                10,000
+ Amortization of net loss            5,000
                                   ─────────
Pension Expense                    $131,000
                                   ═════════
```

### Journal Entry

```
DR Pension Expense                $131,000
DR Plan Assets (if contribution)   XXX,XXX
   CR Cash                                  $XXX,XXX
   CR PBO (for service & interest)           XXX,XXX
   CR/DR OCI (various components)            XXX,XXX
```

**Note**: Actual journal entry complex; simplified for exam focus on expense calculation

## Funded Status Calculation

### Formula
```
Funded Status = Fair Value of Plan Assets - PBO
```

### Example

**Facts**:
- Fair value of plan assets: $800,000
- PBO: $1,000,000

**Calculation**:
```
FV of Assets                       $  800,000
- PBO                              (1,000,000)
                                   ───────────
Funded Status                      $ (200,000)
                                   ═══════════
```

**Conclusion**: **Underfunded by $200,000**

**Balance Sheet**: Report as **pension liability** of $200,000

## Other Comprehensive Income (OCI)

### Components Flowing Through OCI

1. **Actuarial Gains/Losses**:
   - Changes in PBO due to assumption changes
   - Difference between expected and actual return on assets
   - **Initially to OCI**, then amortized to expense (if outside corridor)

2. **Prior Service Cost**:
   - Cost of plan amendments granting retroactive benefits
   - **Initially to OCI**, then amortized to expense over service period

### Flow

```
1. Occurs → Recognize in OCI
2. Accumulate in Accumulated OCI (equity)
3. Amortize from AOCI to Pension Expense over time
```

### Example - Prior Service Cost

**Year 1**: Plan amended, granting $100,000 of retroactive benefits

**Entry (Year 1)**:
```
DR Other Comprehensive Income (loss)  $100,000
   CR PBO                                     $100,000
```

**Years 1-10**: Amortize $10,000 per year (assume 10-year service period)

**Entry (each year)**:
```
DR Pension Expense                    $10,000
   CR OCI (reclassification)                  $10,000
```

## Corridor Approach for Gain/Loss Amortization

### Corridor Definition
```
Corridor = 10% × Greater of (Beginning PBO or Beginning FV of Assets)
```

### Amortization Rule

**If net gain/loss ≤ Corridor**: No amortization (defer in AOCI)

**If net gain/loss > Corridor**: Amortize **excess** over remaining service period

### Formula
```
Amortization = (Net Gain/Loss - Corridor) / Average Remaining Service Period
```

### Example - Corridor Amortization

**Facts**:
- Beginning PBO: $1,000,000
- Beginning FV of assets: $900,000
- Net loss in AOCI: $150,000
- Average remaining service period: 10 years

**Step 1: Calculate Corridor**:
```
10% × Greater of ($1,000,000 or $900,000)
= 10% × $1,000,000
= $100,000
```

**Step 2: Calculate Excess**:
```
Net loss                           $150,000
- Corridor                         (100,000)
                                   ─────────
Excess                             $ 50,000
```

**Step 3: Calculate Amortization**:
```
Excess / Service period = $50,000 / 10 = $5,000 per year
```

**Effect**: Add $5,000 to pension expense (loss amortization)

## PBO Changes During Year

### Beginning PBO
```
+ Service cost
+ Interest cost
- Benefits paid to retirees
+/- Actuarial gains/losses
+/- Prior service cost (plan amendments)
= Ending PBO
```

### Example

**Facts**:
- Beginning PBO: $1,000,000
- Service cost: $120,000
- Interest cost: $60,000
- Benefits paid: $80,000
- Actuarial loss (assumption change): $30,000

**Calculation**:
```
Beginning PBO                      $1,000,000
+ Service cost                        120,000
+ Interest cost                        60,000
- Benefits paid                       (80,000)
+ Actuarial loss                       30,000
                                   ───────────
Ending PBO                         $1,130,000
                                   ═══════════
```

## Plan Assets Changes During Year

### Beginning FV of Assets
```
+ Actual return on assets
+ Employer contributions
- Benefits paid to retirees
= Ending FV of Assets
```

### Example

**Facts**:
- Beginning FV: $800,000
- Actual return: $70,000
- Employer contribution: $150,000
- Benefits paid: $80,000

**Calculation**:
```
Beginning FV of Assets             $  800,000
+ Actual return                        70,000
+ Employer contribution               150,000
- Benefits paid                       (80,000)
                                   ───────────
Ending FV of Assets                $  940,000
                                   ═══════════
```

## CPA Exam Tips

1. **Pension Expense Components** (memorize):
   - **Service cost**: Always **increases** expense
   - **Interest cost**: Always **increases** expense
   - **Expected return**: Always **decreases** expense
   - Amortizations: Usually increase expense

2. **Funded Status**:
   - FV Assets - PBO = Funded Status
   - **Negative** = Underfunded = **Liability**
   - **Positive** = Overfunded = **Asset**

3. **OCI vs. Expense**:
   - Gains/losses and prior service cost initially to **OCI**
   - Then **amortized** to expense over time

4. **Corridor**:
   - 10% × Greater of (PBO or FV Assets)
   - Only amortize **excess** over corridor

5. **Common tested**:
   - Calculate pension expense (all components)
   - Calculate funded status
   - Determine corridor and amortization

6. **PBO vs. ABO**:
   - **PBO** includes future salary increases (most common)
   - **ABO** uses current salaries only

## Common Mistakes

1. **Wrong sign for expected return**: Should **reduce** expense (it's a negative component)

2. **Using actual return in expense**: Use **expected** return (actual affects gain/loss)

3. **Forgetting interest cost**: Always include PBO × discount rate

4. **Corridor confusion**: Only amortize if **outside** corridor (excess over 10%)

5. **Funded status direction**: Assets - PBO (not PBO - Assets)

6. **Not recognizing funded status on balance sheet**: ASC 715 requires recognition

## Summary

### Key Points

**Plan Types**:
- **Defined contribution**: Simple (expense = contribution)
- **Defined benefit**: Complex (multiple expense components)

**Pension Expense Formula**:
```
= Service Cost
+ Interest Cost
- Expected Return on Assets
+ Amortization of Prior Service Cost
+ Amortization of Net Gain/Loss
```

**Funded Status**:
```
= FV of Plan Assets - PBO
Negative = Liability
Positive = Asset
```

**OCI Treatment**:
- Gains/losses and prior service cost initially to **OCI**
- Amortized to expense over time

**Corridor**:
- 10% × Greater of (PBO or FV Assets)
- Amortize only excess over corridor

### Quick Reference

| Component | Effect on Expense |
|-----------|------------------|
| Service cost | Increase |
| Interest cost | Increase |
| Expected return on assets | **Decrease** |
| Prior service cost amortization | Increase |
| Loss amortization | Increase |
| Gain amortization | Decrease |

### Calculation Checklist

**Pension Expense**:
1. ✓ Service cost (given)
2. ✓ Interest cost (PBO × rate)
3. ✓ Expected return (FV assets × rate) - **subtract**
4. ✓ Amortizations (PSC and G/L if applicable)

**Funded Status**:
1. ✓ FV of plan assets
2. ✓ PBO
3. ✓ Subtract: Assets - PBO
4. ✓ Report liability (if negative) or asset (if positive)
