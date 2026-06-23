# Comprehensive Income and Other Comprehensive Income (OCI)

## Overview
Comprehensive income represents the change in equity during a period from transactions and events from NON-OWNER sources. It includes all changes in equity except investments by owners and distributions to owners.

## Key Definitions

### Comprehensive Income
**Definition**: Change in equity from all sources except owner transactions

**Formula**:
```
Comprehensive Income = Net Income + Other Comprehensive Income (OCI)
```

### Net Income
Traditional "bottom line" on the income statement

### Other Comprehensive Income (OCI)
Revenues, expenses, gains, and losses that are included in comprehensive income but **EXCLUDED from net income**

---

## Components of OCI - "PUFF" Mnemonic

**P**ension adjustments
**U**nrealized gains/losses on AFS securities
**F**oreign currency translation adjustments
**F**air value hedges (cash flow hedges)

### 1. Unrealized Gains/Losses on AFS Securities

**Description**: Unrealized gains/losses on available-for-sale (AFS) debt securities

**When Reclassified to NI**: When AFS security is sold (reclassification adjustment)

**Example**:
```
Year 1: AFS bond increases in value $10K
Entry: DR Investment             $10,000
          CR OCI                          $10,000

When sold:
Entry: CR OCI                     $10,000
          DR Gain (NI)                    $10,000
```

**Note**: Trading securities NOT in OCI (unrealized gains/losses go to NI immediately)

### 2. Foreign Currency Translation Adjustments

**Description**: Foreign currency translation adjustments from translating foreign subsidiary's financial statements

**When Reclassified to NI**: When foreign subsidiary is sold or substantially liquidated

**Important Distinction**:
- **Translation adjustments** (consolidating foreign subsidiary) → **OCI**
- **Transaction gains/losses** (foreign currency transactions) → **Net Income immediately**

### 3. Pension Adjustments

**Description**: Prior service cost and actuarial gains/losses not yet recognized in pension expense

**Components**:
- Prior service cost from plan amendments
- Actuarial gains and losses

**When Reclassified to NI**: Amortized to pension expense over time using corridor method

### 4. Cash Flow Hedges

**Description**: Effective portion of unrealized gains/losses on cash flow hedges (derivatives hedging forecasted transactions)

**When Reclassified to NI**: When hedged forecasted transaction affects earnings

**Important Distinction**:
- **Fair value hedges** → Gains/losses go directly to **NI** (not OCI)
- **Cash flow hedges** → Effective portion goes to **OCI**

---

## Items NOT in OCI

1. **Trading securities unrealized gains/losses** → Go to NI
2. **Foreign currency transaction gains/losses** → Go to NI
3. **Ineffective portion of hedges** → Goes to NI immediately

---

## Presentation Options

### Option 1: Single Continuous Statement
**Format**: Single continuous statement of comprehensive income
- Start with revenues
- → Net income
- → OCI items
- → Comprehensive income

### Option 2: Two Separate Statements
**Format**: Separate income statement and statement of comprehensive income
- Income statement ends at **Net Income**
- Separate statement starts with **Net Income** → add OCI items → **Comprehensive income**

### Balance Sheet Location
**Accumulated OCI (AOCI)** reported in stockholders' equity section

---

## Accumulated OCI (AOCI)

### Definition
Cumulative amount of OCI items (similar concept to retained earnings for net income)

### Balance Sheet Presentation
**Stockholders' Equity Section**:
- Common stock
- Additional paid-in capital
- Retained earnings
- **Accumulated OCI**
- Treasury stock

### Formula
```
Ending AOCI = Beginning AOCI + Current Year OCI
```

---

## Reclassification Adjustments

### Purpose
Prevent double-counting when OCI item is realized and moved to net income

### Example: AFS Security Sale

**Year 1**: AFS bond purchased for $100,000

**Year 2**: Bond FV increases to $110,000
```
Entry: DR Investment             $10,000
          CR OCI                          $10,000
(Unrealized gain to OCI, not in NI)
```

**Year 3**: Bond sold for $110,000
```
Realized gain $10,000 goes to NI
Must reclassify OCI to prevent double-counting:

Entry: DR OCI                     $10,000
          CR Reclassification Adj         $10,000
(Reduces OCI)
```

**Result**: Year 3 comprehensive income shows:
- NI includes $10K gain
- OCI shows ($10K) reclassification
- Net effect $0 (prevents double-counting)

### Disclosure
Reclassification adjustments disclosed on face of statement or in notes

---

## Calculation Example

### Facts
**Year 3 data**:
- Net income: $500,000
- Unrealized gain on AFS securities: $20,000
- Foreign currency translation loss: ($8,000)
- Pension prior service cost amortization: ($5,000)
- Beginning AOCI: $30,000

### OCI Calculation
```
Unrealized AFS gain                 $20,000
Foreign currency loss               ($8,000)
Pension amortization                ($5,000)
  (reduces OCI, increases pension expense in NI)
─────────────────────────────────────────────
Total OCI                            $7,000
```

### Comprehensive Income
```
Net Income                         $500,000
Other Comprehensive Income            $7,000
─────────────────────────────────────────────
Comprehensive Income               $507,000
```

### Ending AOCI
```
Beginning AOCI                      $30,000
Current year OCI                     $7,000
─────────────────────────────────────────────
Ending AOCI (reported in equity)    $37,000
```

---

## Tax Effects

### Taxability
OCI items generally have deferred tax effects

### Presentation
May present OCI items:
- **Net of tax**: Show tax effect included
- **Gross with separate tax line**: Show OCI gross with separate deferred tax line

### Example
Unrealized AFS gain $10,000 pretax, tax rate 30%
- **Net of tax**: OCI = $7,000
- **Gross**: OCI $10,000 with deferred tax expense $3,000

---

## CPA Exam Tips

1. **PUFF mnemonic**: **P**ension, **U**nrealized AFS, **F**oreign translation, **F**air value (cash flow) hedges

2. **Trading securities NOT in OCI** (unrealized gains/losses go to NI immediately)

3. **Fair value hedges NOT in OCI** (go to NI). **Cash flow hedges** go to OCI.

4. **Reclassification adjustment** prevents double-counting when OCI realized

5. **AOCI is cumulative** (like retained earnings) reported in equity

6. **Comprehensive Income = Net Income + OCI**

---

## Common CPA Exam Mistakes

### Mistake 1: Including Trading Securities in OCI
**Wrong**: Trading security unrealized gain goes to OCI
**Correct**: Trading security unrealized gain goes to **Net Income**

### Mistake 2: Confusing Translation vs Transaction
**Translation** (consolidating foreign sub) → **OCI**
**Transaction** (foreign currency transaction) → **NI**

### Mistake 3: Confusing Fair Value vs Cash Flow Hedges
**Fair value hedge** → **NI**
**Cash flow hedge** (effective portion) → **OCI**

### Mistake 4: Forgetting Reclassification
When OCI item is realized, must reclassify to prevent double-counting

---

## CPA Exam Calculation Approach

1. **Start with Net Income**
2. **Add/subtract each OCI component** (use PUFF)
3. **Calculate Comprehensive Income** (NI + OCI)
4. **For AOCI**: Beginning AOCI + Current period OCI = Ending AOCI

---

## Summary

### Key Takeaways

- **Comprehensive Income = Net Income + Other Comprehensive Income (OCI)**
- **OCI components**: PUFF (Pension, Unrealized AFS, Foreign translation, Fair value/cash flow hedges)
- **Trading securities NOT in OCI** (go to NI)
- **AOCI** is cumulative balance in stockholders' equity
- **Reclassification adjustments** prevent double-counting when OCI realized
- **Two presentation options**: Single statement or two separate statements

### Quick Reference Table

| Item | Location |
|------|----------|
| Trading securities unrealized G/L | Net Income |
| AFS securities unrealized G/L | OCI |
| Foreign currency transaction G/L | Net Income |
| Foreign currency translation adj | OCI |
| Fair value hedge G/L | Net Income |
| Cash flow hedge (effective) | OCI |
| Cash flow hedge (ineffective) | Net Income |
| Pension prior service cost | OCI (then amortized) |
