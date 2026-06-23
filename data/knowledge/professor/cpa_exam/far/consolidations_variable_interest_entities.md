# Consolidations and Variable Interest Entities - ASC 810

## Overview

**Consolidation**: Combining parent and subsidiary financial statements into single set of consolidated statements

**When Required**: Parent has **controlling financial interest** in subsidiary

**Two Models**:
1. **Voting Interest Model** (traditional)
2. **Variable Interest Entity (VIE) Model** (special entities)

## Voting Interest Model

### Control Test

**Consolidate if**: Parent owns **>50%** of subsidiary's voting stock

### Consolidation Procedure

**Three Steps**:
1. **Combine 100%** of parent and subsidiary assets, liabilities, revenues, expenses
2. **Eliminate** intercompany balances and transactions
3. **Recognize noncontrolling interest (NCI)** for portion not owned by parent

### Key Elimination Entries

#### 1. Investment in Subsidiary vs. Subsidiary's Equity

**Purpose**: Eliminate parent's investment account against subsidiary's equity accounts

**Entry**:
```
DR Common Stock (Subsidiary)          $XXX
DR APIC (Subsidiary)                   XXX
DR Retained Earnings (Subsidiary)      XXX
   CR Investment in Subsidiary              $XXX
   CR Noncontrolling Interest                XXX
```

**Calculation**:
- Investment account = Parent's % × Sub's equity
- NCI = NCI % × Sub's equity

#### 2. Intercompany Sales/Purchases

**Purpose**: Eliminate intercompany revenue and expense

**Entry**:
```
DR Sales (selling entity)             $XXX
   CR Cost of Goods Sold (buying entity)    $XXX
```

**Why**: Transaction between members of consolidated group - not an external transaction

#### 3. Intercompany Receivables/Payables

**Purpose**: Eliminate intercompany balances

**Entry**:
```
DR Accounts Payable                   $XXX
   CR Accounts Receivable                   $XXX
```

#### 4. Intercompany Profit in Inventory

**Purpose**: Eliminate unrealized profit on unsold inventory

**Entry**:
```
DR Cost of Goods Sold (or Retained Earnings)  $XXX
   CR Inventory                                    $XXX
```

**When**: Selling entity sold inventory to buying entity at profit, and buyer still holds inventory at year-end

**Calculation**: Profit = Sales price - Cost to seller

#### 5. Intercompany Dividends

**Purpose**: Eliminate dividend income and dividends paid between group members

**Entry**:
```
DR Dividend Income (parent)           $XXX
   CR Dividends Paid (subsidiary)           $XXX
```

### Example - Basic Consolidation

**Facts**:
- Parent owns 80% of Sub (acquired at book value = fair value)
- Sub's equity: Common Stock $100,000, Retained Earnings $200,000 (Total $300,000)
- Year 1: Sub reports net income $50,000, pays dividends $20,000
- Intercompany: Parent sold inventory to Sub for $100,000 (cost $80,000). Sub still holds all inventory at year-end.

**Elimination Entries**:

**1. Eliminate Investment and Sub's Equity**:
```
DR Common Stock (Sub)                 $100,000
DR Retained Earnings (Sub)             200,000
   CR Investment in Sub                        $240,000
   CR Noncontrolling Interest                   60,000

(Parent's 80% × $300K = $240K)
(NCI's 20% × $300K = $60K)
```

**2. Eliminate Intercompany Sale**:
```
DR Sales                              $100,000
   CR Cost of Goods Sold                       $100,000
```

**3. Eliminate Unrealized Profit in Inventory**:
```
DR Cost of Goods Sold                  $20,000
   CR Inventory                                 $20,000

(Profit = $100,000 - $80,000 = $20,000)
```

**Note**: Profit unrealized because Sub still holds inventory

## Noncontrolling Interest (NCI)

### Definition

**NCI** (formerly "minority interest"): Equity in subsidiary **not attributable to parent**

### Balance Sheet Measurement

```
NCI = NCI % × Subsidiary's Equity
```

### NCI Changes During Year

```
Beginning NCI
+ NCI share of subsidiary's net income
- NCI share of subsidiary's dividends
= Ending NCI
```

### Example - NCI Calculation

**Facts**: 20% NCI, Sub has:
- Beginning equity: $300,000
- Net income: $50,000
- Dividends: $20,000

**Calculation**:
```
Beginning NCI: 20% × $300,000        =  $60,000
+ NCI's share of NI: 20% × $50,000   =   10,000
- NCI's share of dividends: 20% × $20K = (4,000)
                                      ─────────
Ending NCI:                          =  $66,000
                                      ═════════
```

### Income Statement Presentation

**Consolidated Net Income** includes **100%** of subsidiary's income

**Then subtract** NCI's share to arrive at **Net Income attributable to parent**

**Example**:
```
Consolidated Net Income (100%)       $XXX,XXX
Less: Net Income attributable to NCI   (X,XXX)
                                     ─────────
Net Income attributable to Parent    $XXX,XXX
                                     ═════════
```

### Balance Sheet Presentation

**NCI** reported in **equity section** (separately from parent shareholders' equity)

## Variable Interest Entities (VIE)

### VIE Definition

Entity that meets **ANY** of:

1. **Insufficient equity** investment at risk (typically <10% of assets)
2. **Equity holders lack** decision-making ability
3. **Equity holders not exposed** to losses/returns proportionate to ownership

### Purpose

Addresses special purpose entities (SPEs) and off-balance-sheet financing structures

### Primary Beneficiary (PB)

**Primary Beneficiary**: Entity that must **consolidate** the VIE

**PB Criteria (BOTH required)**:

1. **Power**: Power to direct activities that most significantly impact VIE's economic performance

2. **Economics**: Obligation to absorb losses OR right to receive benefits that could be significant to VIE

**If entity is PB**: **Consolidate** the VIE

**If not PB**: Do not consolidate, but disclose involvement

### Examples of VIEs

- Special purpose entities (SPEs)
- Asset-backed securitization entities
- Entities with insufficient equity
- Joint ventures with unusual risk/reward structures
- Certain leasing arrangements

### VIE Consolidation Example

**Scenario**: Company creates SPE to hold assets
- Company provides 5% equity (insufficient - VIE)
- Company guarantees SPE's debt (absorbs losses)
- Company directs SPE's activities (power)

**Analysis**:
- VIE? Yes (insufficient equity)
- Company has power? Yes (directs activities)
- Company has economics? Yes (guarantees debt)

**Result**: Company is **primary beneficiary** → **Consolidate SPE**

## Acquisition Method

### At Acquisition Date

**Measure**: Subsidiary's identifiable assets and liabilities at **fair value**

**Goodwill Calculation**:
```
Goodwill = Consideration Paid
         + Fair Value of NCI
         - Fair Value of Identifiable Net Assets
```

**Entry (Conceptual)**:
```
DR Assets (at fair value)             $XXX
DR Goodwill                             XXX
   CR Liabilities (at fair value)          $XXX
   CR Investment in Subsidiary              XXX
   CR Noncontrolling Interest               XXX
```

### Subsequent Periods

- **Amortize** fair value adjustments (e.g., depreciation on FV step-up)
- **Test goodwill** for impairment annually
- **Continue eliminations** for intercompany transactions

## Intercompany Transactions - Additional Details

### Intercompany Profit in Inventory - Upstream vs. Downstream

**Downstream**: Parent sells to subsidiary
- **Eliminate 100%** of profit
- Reduces **parent's income**

**Upstream**: Subsidiary sells to parent
- **Eliminate 100%** of profit
- But **allocate** reduction between parent and NCI
- Reduces **consolidated income** and **NCI's share**

### Intercompany Fixed Asset Sales

**If one entity sells fixed asset to another**:
- Eliminate gain/loss on sale
- Adjust depreciation expense (based on cost, not intercompany transfer price)

**Example**:
- Parent sells equipment to Sub for $100K (book value $80K, gain $20K)
- Sub depreciates over 5 years ($20K/year)
- But should depreciate based on $80K cost ($16K/year)

**Eliminations**:
```
Year 1:
DR Gain on Sale                        $20,000
   CR Equipment                                $20,000

DR Accumulated Depreciation             $4,000
   CR Depreciation Expense                     $4,000

(Excess depreciation: $20K - $16K = $4K)
```

## CPA Exam Tips

### 1. Consolidation Trigger

**Voting Interest**: >50% ownership → **Consolidate**

**VIE**: Primary beneficiary (power + economics) → **Consolidate**

### 2. Common Tested Eliminations

- Investment vs. equity (most fundamental)
- Intercompany sales/COGS
- Intercompany inventory profit
- Intercompany dividends
- Intercompany AR/AP

### 3. NCI Calculation

```
NCI = NCI % × Subsidiary's Equity

Update each period:
+ Share of income
- Share of dividends
```

### 4. VIE Identification

**Look for**:
- Insufficient equity
- Special structure
- Disproportionate risk/reward

**Test**: Power + Economics = Primary Beneficiary

### 5. Remember

- **Eliminate 100%** of intercompany transactions (even if less than 100% ownership)
- **NCI gets share** of subsidiary's income and equity
- **Upstream vs. downstream** matters for profit allocation

## Common Mistakes

1. **Not eliminating 100%** of intercompany transactions (eliminate full amount regardless of ownership %)

2. **Incorrect NCI calculation**: Must adjust for share of income and dividends

3. **Forgetting to eliminate intercompany profit** in ending inventory

4. **Including NCI in wrong section**: NCI is in equity, not liability

5. **VIE consolidation**: Forgetting to test BOTH power and economics (both required for PB)

6. **Not eliminating intercompany dividends**: Parent's dividend income from sub must be eliminated

## Summary

### Key Points

**Consolidation When**:
- **>50% voting control**, OR
- **Primary beneficiary of VIE**

**Consolidation Process**:
1. Combine 100% of parent and subsidiary
2. Eliminate intercompany items
3. Recognize NCI

**NCI**:
- NCI % × Subsidiary's equity
- Adjust for share of income and dividends
- Report in equity section

**VIE**:
- Insufficient equity, lack of power, or disproportionate risk/reward
- Primary Beneficiary = **Power AND Economics**
- PB consolidates the VIE

**Key Eliminations**:
- Investment vs. subsidiary equity
- Intercompany sales/COGS
- Intercompany inventory profits (unrealized)
- Intercompany AR/AP
- Intercompany dividends

**Goodwill**:
```
= Consideration + FV of NCI - FV of Identifiable Net Assets
```

### Quick Reference

**Voting Interest Model**:
```
>50% ownership → Consolidate
```

**VIE Model**:
```
Is it a VIE? → Test characteristics
↓
Who is Primary Beneficiary? → Power + Economics
↓
Consolidate if PB
```

**NCI Reconciliation**:
```
Beginning NCI
+ NCI's share of Sub's income
- NCI's share of Sub's dividends
= Ending NCI
```
