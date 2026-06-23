# Investments in Debt and Equity Securities - ASC 320

## Overview

ASC 320 governs accounting for investments in **debt securities** and **equity securities**

Classification determines:
- Measurement basis (fair value vs. amortized cost)
- Where unrealized gains/losses are reported (income vs. OCI)

## Debt Securities - Three Classifications

### 1. Held-to-Maturity (HTM)

**Criteria**: Positive **intent and ability** to hold to maturity

**Requirements**:
- ONLY for debt securities with **fixed maturity date**
- Cannot be used for equity securities (no maturity date)

**Measurement**: **Amortized cost**

**Unrealized Gains/Losses**: **Not recognized**

**Interest Income**: Recognize using effective interest method (amortize premium/discount)

**Example HTM Entry**:
```
Purchase $100,000 bonds at 98 (discount):
DR HTM Securities                $98,000
   CR Cash                              $98,000

At maturity, bonds will be worth $100,000
Amortize $2,000 discount over life as interest income
```

### 2. Available-for-Sale (AFS)

**Criteria**: Not HTM and not Trading (default classification)

**Most common classification**

**Measurement**: **Fair value**

**Unrealized Gains/Losses**: Report in **OCI (Other Comprehensive Income)** - Equity section, NOT net income

**Interest Income**: Recognize at coupon rate

**Realized Gains/Losses**: When sold, recognize in **net income**

**Example AFS Entries**:
```
Purchase:
DR AFS Securities                $98,000
   CR Cash                              $98,000

Year-end (FV now $101,000):
DR AFS Securities                 $3,000
   CR Unrealized Gain - OCI            $3,000

When sold at $103,000:
DR Cash                         $103,000
   CR AFS Securities                  $101,000
   CR Realized Gain (income)            $2,000

Reclassify from OCI to income:
DR Unrealized Gain - OCI         $3,000
   CR Realized Gain (income)           $3,000
```

### 3. Trading

**Criteria**: Held for **short-term profit taking**

**Typical users**: Active traders, financial institutions, dealers

**Measurement**: **Fair value**

**Unrealized Gains/Losses**: Report in **net income** (each period)

**Interest Income**: Recognize at coupon rate

**Realized Gains/Losses**: When sold, recognize in net income

**Example Trading Entries**:
```
Purchase:
DR Trading Securities            $98,000
   CR Cash                              $98,000

Year-end (FV now $101,000):
DR Trading Securities             $3,000
   CR Unrealized Gain (income)          $3,000

When sold at $103,000:
DR Cash                         $103,000
   CR Trading Securities               $101,000
   CR Realized Gain (income)            $2,000
```

## Debt Securities Comparison Table

| Feature | HTM | AFS | Trading |
|---------|-----|-----|---------|
| **Balance Sheet** | Amortized cost | Fair value | Fair value |
| **Unrealized G/L** | Not recognized | **OCI** (equity) | **Net income** |
| **Interest Income** | Amortize premium/discount (effective interest) | Coupon rate | Coupon rate |
| **Realized G/L** | Income (when sold - rare) | Income (when sold) | Income (when sold) |
| **Typical use** | Long-term investment | General investment | Active trading |

## Equity Securities - Classification by Ownership

### <20% Ownership (No Significant Influence)

**Method**: **Fair Value Method**

**Measurement**: Fair value with changes in **net income**

**Treatment**:
```
Purchase:
DR Equity Investment              $XXX
   CR Cash                               $XXX

Year-end (FV changed):
DR Equity Investment              $XXX
   CR Unrealized Gain (income)          $XXX

Dividends received:
DR Cash                           $XXX
   CR Dividend Income                    $XXX
```

### 20-50% Ownership (Significant Influence)

**Method**: **Equity Method**

**Measurement**: Cost + Share of income - Dividends

**Key Concept**: Investor recognizes **share of investee's income**, regardless of dividends. Dividends reduce investment balance (return of capital).

**Initial Investment**:
```
DR Investment in Investee         $XXX
   CR Cash                               $XXX
```

**Record Share of Investee's Income**:
```
DR Investment in Investee         $XXX
   CR Equity in Investee Income          $XXX

(Record X% of investee's net income)
```

**Record Dividends Received**:
```
DR Cash                           $XXX
   CR Investment in Investee             $XXX

(Dividends REDUCE investment balance)
```

### Example - Equity Method

**Facts**:
- Purchase 30% of Company B for $500,000
- Company B reports net income of $100,000
- Company B declares dividends of $40,000

**Entries**:

**Initial Investment**:
```
DR Investment in Company B       $500,000
   CR Cash                               $500,000
```

**Record Share of Income** (30% × $100,000 = $30,000):
```
DR Investment in Company B        $30,000
   CR Equity in Company B Income         $30,000
```

**Record Dividends** (30% × $40,000 = $12,000):
```
DR Cash                           $12,000
   CR Investment in Company B            $12,000
```

**Investment Balance**:
```
Initial                          $500,000
+ Share of income                  30,000
- Dividends received              (12,000)
                                 ─────────
Ending balance                   $518,000
```

### >50% Ownership (Control)

**Method**: **Consolidation**

**Treatment**: Prepare consolidated financial statements

**Note**: Covered separately in consolidations topic

## Impairment

### Current Guidance (ASC 326 - CECL)

**Credit Loss Model** for debt securities:

**Measurement**: Allowance for credit losses (expected credit losses over life of instrument)

**Recognition**: Recognize in income when expected credit loss identified

**HTM Securities**: Use allowance account (like AR)
```
DR Credit Loss Expense            $XXX
   CR Allowance for Credit Losses       $XXX
```

**AFS Securities**: If FV below amortized cost due to credit loss, write down
```
DR Credit Loss Expense            $XXX
   CR AFS Securities                    $XXX
```

### Equity Securities

**Impairment model eliminated** for equity securities measured at fair value (changes recognized in income)

**For equity without readily determinable FV**: Qualitative impairment indicators assessed

## Transfers Between Categories

### General Rule
Transfers accounted for at **fair value on transfer date**

### HTM to AFS
- Transfer at fair value
- Recognize unrealized gain/loss in **OCI**

### AFS to HTM
- Transfer at fair value
- Keep accumulated OCI
- Amortize over remaining life

### To Trading
- Transfer at fair value
- Recognize unrealized gain/loss in **income**

### Restriction
Frequent transfers OUT of HTM call into question the entity's intent and ability to hold to maturity
- May "taint" all HTM securities and require reclassification

## Fair Value Option

**Election**: Entity may irrevocably elect FV measurement for certain financial instruments

**Effect**: If elected, measure at FV with changes in net income (like trading securities)

## CPA Exam Tips

### Classification Keywords
- **"Intent to hold to maturity"** → HTM
- **"Short-term profit"** or **"active trading"** → Trading
- **Otherwise** → AFS (default)

### Unrealized Gains/Losses
- **AFS** → OCI (balance sheet equity)
- **Trading** → Net income
- **HTM** → Not recognized

### Equity Method
- Record **% of investee's INCOME** (not dividends)
- Dividends **reduce** investment balance
- Ownership 20-50% typically indicates significant influence

### Common Calculations
- **HTM**: Amortize discount/premium using effective interest
- **AFS**: Adjust to FV with unrealized G/L to OCI
- **Trading**: Adjust to FV with unrealized G/L to income
- **Equity Method**: Investment + Share of income - Dividends

### Remember
1. **Debt** securities can be HTM, AFS, or Trading
2. **Equity** securities: FV method (<20%) or Equity method (20-50%)
3. **OCI vs. Income**: AFS unrealized goes to OCI, Trading unrealized goes to income
4. **Equity method**: Income increases investment, dividends decrease investment

## Common Mistakes

1. **Classifying equity securities as HTM**: Only debt can be HTM (equity has no maturity)

2. **Wrong location for AFS unrealized G/L**: Goes to OCI, NOT net income

3. **Forgetting to amortize discount/premium for HTM**: Must use effective interest method

4. **Equity method dividends as income**: Dividends reduce investment (not income)

5. **Not recording equity method income**: Must record share of investee's income (whether or not dividends received)

6. **Reclassifying from OCI**: When AFS sold, accumulated OCI reclassified to income as realized gain/loss

## Summary

### Key Points

**Debt Securities Classification**:
- **HTM**: Amortized cost, no unrealized G/L recognized
- **AFS**: Fair value, unrealized G/L in OCI
- **Trading**: Fair value, unrealized G/L in net income

**Equity Securities**:
- **<20%**: Fair value method (unrealized G/L in income)
- **20-50%**: Equity method (record share of income, dividends reduce investment)
- **>50%**: Consolidate

**Key Formulas**:
```
Equity Method Investment Balance:
  Beginning balance
  + Share of investee's net income
  - Dividends received
  = Ending balance

Pension Expense (preview for pensions):
  Service cost + Interest cost - Expected return + Amortizations
```

### Quick Reference

| Security Type | Ownership | Method | Balance Sheet | Unrealized G/L |
|--------------|-----------|--------|---------------|----------------|
| Debt - HTM | N/A | Amortized cost | Amortized cost | Not recognized |
| Debt - AFS | N/A | Fair value | Fair value | OCI |
| Debt - Trading | N/A | Fair value | Fair value | Net income |
| Equity | <20% | Fair value | Fair value | Net income |
| Equity | 20-50% | Equity method | Cost + Income - Div | N/A |
| Equity | >50% | Consolidation | Consolidated | N/A |
