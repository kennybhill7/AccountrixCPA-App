# Equity Method Investments - ASC 323

## When Required
Investor has **SIGNIFICANT INFLUENCE** over investee

**Presumption**: 20-50% ownership

**Evaluate**: Other factors beyond ownership percentage

## Significant Influence Indicators
- Representation on board of directors
- Participation in policy-making
- Material intercompany transactions
- Interchange of managerial personnel
- Technological dependency

## Ownership Levels

| Ownership | Presumption | Method |
|-----------|-------------|--------|
| **< 20%** | NO significant influence | Fair value method (ASC 321) |
| **20-50%** | Significant influence | **Equity method** |
| **> 50%** | Control | Consolidation required |

## Initial Recording
```
DR Investment (at cost)
   CR Cash
```

## Equity Method Adjustments

### Investee Reports Income
```
DR Investment
   CR Equity in Investee Income
```
Record investor's share of investee's net income

### Investee Declares Dividends
```
DR Cash (or Dividends Receivable)
   CR Investment
```
**Key**: Dividends **reduce investment** (not income)

### Formula
```
Investment Balance = Cost
                   + Share of Income
                   - Dividends Received
                   - Amortization of Basis Difference
                   +/- Share of Investee OCI
```

## Basis Difference

### Definition
Excess of cost over book value of net assets acquired (or vice versa)

### Allocation
1. **Undervalued/overvalued identifiable assets** → Amortize over useful life
2. **Goodwill** → NO amortization

### Amortization
- Amortize basis difference assigned to depreciable/amortizable assets
- **Reduces** equity in income

### Example
Purchase 30% for $150,000
- Book value of net assets: $400,000
- Investor's share: 30% × $400,000 = $120,000
- Basis difference: $150,000 - $120,000 = $30,000

**Allocation**:
- $20,000 to equipment (10-year life) → Amortize $2,000/year
- $10,000 to goodwill → NO amortization

## Calculation Example - Year 1

### Facts
- Jan 1: Purchase 30% of investee for $200,000
- Investee BV of net assets: $600,000 (30% = $180,000)
- Basis difference: $20,000 attributed to equipment (10-year life)
- Investee reports NI: $100,000
- Investee pays dividends: $40,000

### Calculations
```
Equity in income:
  Share of NI: $100,000 × 30% =              $30,000
  Less: Amortization: $20,000 / 10 =          (2,000)
  ────────────────────────────────────────────────
  Net equity income                          $28,000

Dividends received:
  $40,000 × 30% =                            $12,000
```

### Entries
```
Purchase:
DR Investment                    $200,000
   CR Cash                                   $200,000

Income:
DR Investment                     $28,000
   CR Equity in Investee Income              $28,000

Dividends:
DR Cash                           $12,000
   CR Investment                             $12,000
```

### Investment Balance
```
Beginning                        $200,000
Add: Equity income                 28,000
Less: Dividends                   (12,000)
────────────────────────────────────────
Ending balance                   $216,000
```

## Investee Reports OCI
Investor recognizes share of investee's OCI:
```
DR Investment
   CR OCI
```

## Investee Reports Loss

### Recognition
```
DR Equity in Investee Loss
   CR Investment
```

### Zero Balance Rule
- Reduce investment to zero, then **stop**
- Exception: If investor has guaranteed obligations or committed to provide support

### Subsequent Income
If investee subsequently profitable:
- First **recover suspended losses**
- Then recognize income

## Impairment

### When to Test
When indicators of impairment (other-than-temporary decline)

### Test
If FV < carrying amount and decline is **other-than-temporary**:
- Recognize impairment loss
- **NO reversal** of impairment losses

## Sale of Investment

### Gain/Loss Calculation
```
Gain or Loss = Proceeds - Carrying Amount of Investment
```

### Entry
```
DR Cash (proceeds)
   CR Investment (carrying amount)
   CR Gain on Sale (or DR Loss)
```

## Intercompany Transactions

### Upstream Sale
**Investee sells to investor**
- Defer investor's share of profit until realized

### Downstream Sale
**Investor sells to investee**
- Defer **100% of profit** until realized (investor controls transaction)

### Example
- Investor owns 40%
- Investee sells inventory (cost $60K) to investor for $100K
- Investor resells for $120K
- Unrealized profit: $100K - $60K = $40K
- **Investor's share**: 40% × $40K = $16K
- **Defer** $16K equity income until inventory sold to third party

## "One-Line Consolidation"
Equity method called "one-line consolidation" because:
- Investor's share of investee's net income reported as **single line item**
- "Equity in Investee Income" on income statement

## CPA Exam Tips

1. **Equity method**: 20-50% ownership + significant influence

2. **Investment increases** by share of income, **decreases** by dividends

3. **Amortize** basis difference on depreciable assets (reduces equity income)

4. **Goodwill** in basis difference **NOT amortized**

5. **Dividends reduce investment** (not income)

6. **Equity income** = Share of NI - Amortization of basis difference

7. **Defer** unrealized profit on intercompany transactions

## Investment Balance Calculation

```
Beginning balance
+ Share of investee net income
- Amortization of basis difference
- Dividends received
+/- Share of investee OCI
═══════════════════════════════
Ending balance
```

## Basis Difference Allocation Steps

1. Calculate: Cost - (Ownership % × Investee BV)
2. Allocate to specific identifiable assets (FV - BV)
3. Remainder = Goodwill
4. Amortize identifiable assets over useful life
5. Goodwill not amortized (test for impairment)

## Common Mistakes

### Mistake 1: Dividend Treatment
**Wrong**: Recording dividends as income
**Correct**: Dividends **reduce investment** (not income)

### Mistake 2: Basis Difference
**Wrong**: Forgetting to amortize basis difference
**Correct**: Amortize depreciable portion (reduces equity income)

### Mistake 3: Goodwill Amortization
**Wrong**: Amortizing goodwill portion
**Correct**: Goodwill **not amortized** (test for impairment only)

### Mistake 4: Intercompany Profit
**Wrong**: Not deferring intercompany profit
**Correct**: **Defer** unrealized profit until realized

### Mistake 5: Consolidation
**Wrong**: Using equity method when >50% ownership
**Correct**: **Consolidate** instead (equity method not used in consolidated statements)

## Summary

### Key Points
- Equity method: 20-50% ownership + significant influence
- Investment **increases** by share of income, **decreases** by dividends
- Equity income = Share of NI - Amortization of basis difference
- Basis difference: Allocate to identifiable assets (amortize) and goodwill (no amortization)
- Dividends received **reduce investment** (not income)
- Defer unrealized profit on intercompany transactions
- Investment balance = Cost + Income - Dividends - Amortization +/- OCI

### Quick Formula
```
Equity in Investee Income = (Investee NI × Ownership %) - Amortization
```
