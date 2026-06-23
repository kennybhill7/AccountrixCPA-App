# Variable Consideration Under ASC 606

## Overview

**Definition**: Any amount of consideration that can vary due to discounts, rebates, refunds, credits, price concessions, incentives, performance bonuses, penalties, or similar items

**Key Principle**: Variable consideration is part of transaction price (Step 3), but must be **estimated** and **constrained** before inclusion

## Common Forms of Variable Consideration

- Volume-based discounts or rebates
- Performance bonuses or penalties
- Right of return
- Price concessions
- Contingent consideration
- Sales-based or usage-based royalties
- Credits or incentives
- Refunds or rebates

## Two Estimation Methods

### Overview

**Entity must use ONE method** - whichever better predicts the amount entity will be entitled to

### Method 1: Expected Value

**Description**: Sum of probability-weighted amounts in a range of possible outcomes

**Formula**:
```
Expected Value = Σ(Possible Amount × Probability)
```

**When to Use**:
- Large number of contracts with similar characteristics
- Range of possible outcomes with varying probabilities
- Historical data available to predict probabilities

#### Example - Volume Rebates

**Scenario**: Software company offers volume rebates based on historical patterns

**Facts**:
- Scenario 1: $100K purchases (30% probability) → No rebate → Revenue $100K
- Scenario 2: $150K purchases (50% probability) → 5% rebate → Revenue $142.5K
- Scenario 3: $200K purchases (20% probability) → 10% rebate → Revenue $180K

**Calculation**:
```
Expected value = ($100K × 0.30) + ($142.5K × 0.50) + ($180K × 0.20)
Expected value = $30K + $71.25K + $36K = $137,250
```

**Conclusion**: Include $137,250 in transaction price (subject to constraint)

### Method 2: Most Likely Amount

**Description**: The **single most likely** amount in a range of possible outcomes (the outcome with highest probability)

**NOT a probability-weighted average** - it's the single most likely outcome

**When to Use**:
- Contract has only two possible outcomes (binary)
- One outcome significantly more likely than others
- All-or-nothing scenarios

#### Example - Completion Bonus

**Scenario**: Construction with completion bonus

**Facts**:
- Base contract: $5,000,000
- Bonus: $500,000 if completed within 12 months
- Entity has 70% probability of completing on time

**Analysis**:
```
Two possible outcomes:
  Outcome 1 (70%): Complete on time → Total $5,500,000
  Outcome 2 (30%): Complete late → Total $5,000,000

Most likely amount = $5,500,000 (highest probability)
```

**Conclusion**: Include $5,500,000 in transaction price (subject to constraint)

### Method Selection

**Principle**: Use method that better predicts amount entity will be entitled to

**Practical Guidance**:
| Scenario | Appropriate Method |
|----------|-------------------|
| **Binary/two outcomes** | Most likely amount |
| **Many possible outcomes** | Expected value |
| **Limited experience** | Most likely amount |
| **Large portfolio with history** | Expected value |

## Constraint on Variable Consideration

### The Principle

**Include variable consideration in transaction price ONLY TO THE EXTENT that it is PROBABLE that a significant reversal in cumulative revenue will NOT occur when uncertainty is resolved**

**Threshold**: "Probable" means "likely to occur" - generally >75% probability
- Higher than "more likely than not" (>50%)

**Objective**: Prevent recognition of revenue that may need to be reversed later

### Factors Increasing Likelihood of Reversal

| Factor | Description | Examples |
|--------|-------------|----------|
| **Outside entity's influence** | Highly susceptible to factors entity can't control | Market volatility, regulatory actions, weather, technology changes |
| **Long time period** | Uncertainty not resolved for long time | Longer periods increase uncertainty |
| **Limited experience** | Entity lacks historical data | New products, new markets, new contract types |
| **Practice of concessions** | History of price concessions or changing terms | Pattern suggests estimates may not hold |
| **Broad range of outcomes** | Large number and broad range of possible amounts | Wide range indicates high uncertainty |

### Application Process

**Step 1**: Estimate variable consideration (expected value or most likely amount)

**Step 2**: Assess factors that increase reversal likelihood

**Step 3**: Determine: Is it probable (>75%) that significant reversal will NOT occur?

**Step 4**:
- **If yes**: Include full estimated amount
- **If no**: Include only amount for which significant reversal is not probable (may be $0)

### Example - Constraint Applied

**Scenario**: Pharmaceutical company with contingent milestone

**Facts**:
- Base payment: $10M
- Contingent payment: $5M if drug receives regulatory approval
- Entity estimates 60% chance of approval
- Most likely amount: $15M (approval is most likely)

**Constraint Analysis**:
```
Reversal factors present:
  ✓ Highly susceptible to third-party actions (regulator)
  ✓ Long resolution period (2+ years)
  ✓ May have limited experience with regulatory process

Conclusion: NOT probable that significant reversal would not occur

Constrained amount: Include only $10M base payment
Recognize $5M contingent only when approval obtained
```

## Specific Types of Variable Consideration

### Volume Discounts and Rebates

**Description**: Customer receives discount/rebate if purchases exceed threshold

**Example**: 5% rebate if annual purchases exceed $1M

**Approach**:
1. Estimate total purchases for year
2. Determine probability of exceeding threshold
3. Use expected value or most likely amount
4. Apply constraint
5. Update estimate each reporting period

**Accounting**: Reduce revenue by estimated rebate; accrue rebate liability

### Performance Bonuses and Penalties

**Description**: Entity receives bonus for meeting targets or incurs penalty for failing

**Example**: $100K bonus for early completion; $50K penalty for late

**Approach**:
- Estimate likelihood of each outcome
- Apply most likely amount method (typically)
- Apply constraint considering entity's control
- If strong track record, may include bonus

### Rights of Return

**Description**: Customer can return product and receive refund

**Accounting Treatment**:
1. Recognize revenue for products **not expected to be returned**
2. Recognize **refund liability** for products expected to be returned (at transaction price)
3. Recognize **asset for right to recover** products (at carrying amount less recovery costs)
4. Do NOT recognize revenue for expected returns
5. Update estimates each period

#### Example - Sale with Returns

**Facts**: Sell 1,000 units at $100 each; estimate 5% return rate; cost $60/unit

**At Sale**:
```
DR Cash/Accounts Receivable            $100,000
DR COGS                                  57,000  (95% × 1,000 × $60)
DR Right to Recover Asset                 3,000  (5% × 1,000 × $60)
   CR Revenue                                    $95,000  (95% × $100,000)
   CR Refund Liability                            5,000  (5% × $100,000)
   CR Inventory                                  60,000
```

**When Customer Returns 40 Units**:
```
DR Refund Liability                      $4,000
DR Inventory                              2,400  (40 × $60)
   CR Cash                                        $4,000
   CR Right to Recover Asset                      2,400
```

### Price Concessions

**Description**: Entity's practice of accepting less than stated contract price

**Key Point**: If entity has history or intention of granting concessions, stated price is NOT transaction price

**Example**: Software company regularly accepts 80-90% of invoiced amount

**Accounting**:
- Transaction price is estimated amount entity expects to collect (e.g., 85% of stated)
- This is **variable consideration**, NOT bad debt
- Bad debt not appropriate because collectibility affects contract existence (Step 1), not revenue measurement

### Sales or Usage-Based Royalties on IP Licenses

**Description**: Consideration based on customer's sales or usage

**Special Rule - Exception**: For licenses of intellectual property:

**Recognize royalty revenue only when (or as) the LATER of**:
1. Subsequent sale or usage occurs, OR
2. Performance obligation is satisfied (or partially satisfied)

**Rationale**: Exception prevents recognizing revenue before customer's sales/usage occurs

**Example**: License software with 5% royalty on customer's product sales

**Accounting**: Recognize royalty revenue **as customer makes sales**, even if license granted earlier. Track customer's sales each period and recognize 5% as revenue.

## Subsequent Changes in Estimates

### Principle

**Reassess estimated variable consideration at end of each reporting period**

### Accounting for Changes

1. Change in transaction price (Step 3)
2. Allocate change using same allocation method as at inception (Step 4)
3. Recognize change as adjustment to revenue (Step 5):
   - **Satisfied POs**: Adjust revenue in period of change (catch-up)
   - **Unsatisfied/partially satisfied POs**: Adjust prospectively or catch-up

### Example - Service Contract with Bonus

**Facts**: Service contract with year-end bonus based on customer satisfaction

**Timeline**:

**Jan 1 (Inception)**:
```
Estimate: $1M base + $100K bonus (70% probability)
Most likely amount: $1.1M
Constraint: Include bonus (entity has strong track record)
Transaction price: $1.1M
```

**June 30 (Q2)**:
```
New info: Customer feedback very positive; probability increases to 90%
Revised: $1.1M (no change - still most likely to earn bonus)
```

**Sept 30 (Q3)**:
```
New info: Service issues arose; probability drops to 40%
Revised most likely amount: $1.0M (now more likely to NOT earn)
Impact: Reduce transaction price by $100K; adjust revenue to date
```

## Allocation of Variable Consideration

### General Rule

**Allocate variable consideration to all performance obligations** based on relative standalone selling prices

### Exception

**Allocate entirely to one or more (not all) specific POs if**:
1. Terms relate specifically to efforts for that PO (or specific outcome)
2. Allocation entirely to that PO is consistent with allocation objective

### Example

**Scenario**: Software license + implementation + support

**Variable consideration**: Bonus for completing implementation within 30 days

**Analysis**: Bonus relates specifically to implementation PO

**Allocation**: Allocate bonus entirely to implementation; allocate fixed consideration across all three POs

## CPA Exam Strategies

### Identification

**Look for key words**: "bonus," "penalty," "rebate," "discount," "contingent," "refund," "return"

### Methodology Selection

| Situation | Method |
|-----------|--------|
| **Two outcomes or one dominant** | Most likely amount |
| **Many outcomes with data** | Expected value |
| **When in doubt** | Show both, explain choice |

### Constraint Application

**Always mention the constraint** - even if concluding it doesn't prevent inclusion

**Process**:
1. List factors present that affect reversal risk
2. State conclusion: Is significant reversal probable or not?
3. If reversal probable, exclude or include conservative amount

### Common Mistakes

- Forgetting to apply constraint after calculating estimate
- Using probability-weighted average when most likely amount appropriate
- Confusing "probable" (>75%) with "more likely than not" (>50%)
- Treating price concessions as bad debt instead of revenue reduction

## Summary

### Key Points

- **Two methods**: Expected value (probability-weighted) or Most likely amount (single outcome)
- **Expected value** = Σ(amount × probability)
- **Most likely** = single most likely outcome (NOT weighted average)
- **Constraint**: Probable (>75%) that significant reversal will NOT occur
- **Reversal risk factors**: Outside influence, long time, limited experience, broad range
- **Reassess** estimates each reporting period
- **Returns**: Refund liability + right to recover asset
- **Royalty exception**: Recognize only when/as customer's sales occur
- **Allocation**: Can allocate specifically to one PO if criteria met

### Quick Reference

**Method Selection**:
- Binary outcomes → Most likely amount
- Many outcomes → Expected value

**Constraint Test**:
- Is it >75% likely that significant reversal will NOT occur?
- If NO → Constrain (reduce or exclude variable consideration)

**Common Types**:
- Volume discounts → Estimate using probabilities
- Performance bonuses → Most likely amount + constraint
- Returns → Refund liability + recovery asset
- Price concessions → Variable consideration (not bad debt)
- Royalties on IP → Recognize as customer's sales occur
