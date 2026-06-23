# Foreign Currency Translation - ASC 830

## Overview

**Two distinct concepts**:
1. **Foreign Currency Transactions**: Individual transactions in foreign currency → **Net Income**
2. **Foreign Currency Translation**: Translating foreign subsidiary's statements → **OCI**

**Key Distinction**: Where gains/losses are reported

## Functional Currency

### Definition

**Functional currency**: Primary currency of entity's economic environment where it generates and expends cash

### Determination Factors

Consider:
- **Cash flows**: Currency that mainly affects sales prices and costs
- **Sales market**: Currency of country where products sold
- **Expenses**: Currency in which labor, materials, costs paid
- **Financing**: Currency in which funds generated
- **Intercompany transactions**: High volume suggests parent's currency

### Three Scenarios

| Scenario | Method | G/L Location |
|----------|--------|--------------|
| **Foreign currency is functional** | **Current Rate Method** | **OCI** |
| **USD is functional** | **Temporal Method** | **Net Income** |
| **Highly inflationary economy** (>100% over 3 years) | **Temporal Method** | **Net Income** |

## Current Rate Method

### When Used

**Foreign currency is functional currency** (subsidiary operates relatively independently)

### Translation Rates

| Item | Rate |
|------|------|
| **Assets and Liabilities** | **ALL** at **Current rate** (balance sheet date) |
| **Stockholders' Equity** | **Historical rates** (when transactions occurred) |
| **Retained Earnings** | Calculated: Beginning RE + NI - Dividends |
| **Revenues and Expenses** | **Average rate** for period |

### Translation Adjustment

**Result**: Translation adjustment (gain or loss)

**Location**: **Other Comprehensive Income (OCI)**

**Accumulation**: In equity as "Accumulated Other Comprehensive Income" - "Cumulative Translation Adjustment"

### Mnemonic

**CASE**:
- **C**urrent rate for Assets and liabilities
- equity at hi**S**torical
- income at av**E**rage

### Example

**Facts**:
- Foreign subsidiary with functional currency = Local Currency (LC)
- Cash: 100,000 LC
- Inventory: 200,000 LC
- PPE: 500,000 LC
- Payables: 150,000 LC
- Common Stock: 400,000 LC
- Current rate: $1 = 10 LC
- Historical rate (equity): $1 = 8 LC
- Average rate: $1 = 9 LC

**Translation (Balance Sheet)**:
```
Assets:
  Cash: 100,000 LC / 10 =        $ 10,000 (current)
  Inventory: 200,000 LC / 10 =     20,000 (current)
  PPE: 500,000 LC / 10 =           50,000 (current)
                                 ─────────
  Total Assets                   $ 80,000
                                 ═════════

Liabilities:
  Payables: 150,000 LC / 10 =    $ 15,000 (current)

Equity:
  Common Stock: 400,000 LC / 8 =  $50,000 (historical)
  Retained Earnings                 (Plug)
  Translation Adjustment            (Plug to balance)
                                 ─────────
  Total Liabilities & Equity     $ 80,000
                                 ═════════
```

**Translation Adjustment**: Goes to **OCI** (not net income)

## Temporal Method (Remeasurement)

### When Used

- **USD is functional currency** (subsidiary is extension of parent), OR
- **Highly inflationary economy** (>100% cumulative inflation over 3 years)

### Translation Rates

| Item | Rate |
|------|------|
| **Monetary items** (cash, receivables, payables, debt) | **Current rate** |
| **Nonmonetary items at cost** (inventory at cost, PPE, intangibles) | **Historical rate** |
| **Nonmonetary items at FV** | Rate when FV determined |
| **Stockholders' Equity** | **Historical rates** |
| **Revenues and Expenses** (most) | **Average rate** |
| **COGS, Depreciation, Amortization** | **Historical rate** |

### Remeasurement Gain/Loss

**Result**: Remeasurement gain or loss

**Location**: **Net Income** (NOT OCI)

### Mnemonic

**MUST**:
- **M**onetary at c**U**rrent
- nonmonetary at hi**ST**orical
- gain/loss in ne**T** income

### Example

**Facts**:
- Foreign subsidiary with functional currency = USD
- Cash: 100,000 LC
- Inventory (at cost): 200,000 LC
- PPE: 500,000 LC
- Payables: 150,000 LC
- Common Stock: 400,000 LC
- Current rate: $1 = 10 LC
- Historical rate (inventory): $1 = 9 LC
- Historical rate (PPE, equity): $1 = 8 LC

**Remeasurement (Balance Sheet)**:
```
Assets:
  Cash: 100,000 LC / 10 =          $ 10,000 (current - monetary)
  Inventory: 200,000 LC / 9 =        22,222 (historical - nonmonetary)
  PPE: 500,000 LC / 8 =              62,500 (historical - nonmonetary)
                                   ─────────
  Total Assets                     $ 94,722
                                   ═════════

Liabilities:
  Payables: 150,000 LC / 10 =      $ 15,000 (current - monetary)

Equity:
  Common Stock: 400,000 LC / 8 =    $50,000 (historical)
  Retained Earnings (includes         29,722 (Plug)
    remeasurement G/L)
                                   ─────────
  Total Liabilities & Equity       $ 94,722
                                   ═════════
```

**Remeasurement Gain/Loss**: Plugged amount goes to **Net Income** (not OCI)

## Income Statement Translation

### Current Rate Method

**Most items**: Average rate for period

**Example**:
```
Sales: 1,000,000 LC / 9 (avg) =    $111,111
Expenses: 800,000 LC / 9 (avg) =     88,889
                                   ─────────
Net Income                         $ 22,222
                                   ═════════
```

### Temporal Method

**Most revenues/expenses**: Average rate

**Exceptions** (related to nonmonetary items):
- **COGS**: Historical rate
- **Depreciation**: Historical rate
- **Amortization**: Historical rate

**Example**:
```
Sales: 1,000,000 LC / 9 (avg) =        $111,111
COGS: 600,000 LC / 9 (historical) =      66,667
Depreciation: 100,000 LC / 8 (hist) =    12,500
Other Expenses: 100,000 LC / 9 (avg) =   11,111
                                       ─────────
Net Income (before remeas. G/L)        $ 20,833
Remeasurement Gain/Loss                   (Plug)
                                       ─────────
Net Income                             $   ?
                                       ═════════
```

## Comparison Table

| Feature | Current Rate | Temporal |
|---------|-------------|----------|
| **Functional Currency** | Foreign currency | USD (or parent currency) |
| **Assets/Liabilities** | ALL at current | Monetary at current, nonmonetary at historical |
| **Equity** | Historical | Historical |
| **Revenue/Expenses** | Average | Average (mostly) |
| **COGS/Depreciation** | Average | **Historical** |
| **Gain/Loss** | **OCI** (translation adjustment) | **Net Income** (remeasurement G/L) |

## Highly Inflationary Economy

### Definition

**Cumulative inflation >100%** over **3-year period**

### Treatment

Use **USD as functional currency** regardless of economic indicators

**Method**: **Temporal Method**

**Reason**: Local currency too unstable to be meaningful functional currency

## Foreign Currency Transactions

### Definition

Single transaction (sale, purchase, loan) denominated in foreign currency

### Accounting Approach

**Transaction Date**: Record at spot rate

**Balance Sheet Date**: Revalue monetary items (receivables, payables) at current rate

**Gain/Loss**: Recognize in **net income**

**Settlement Date**: Record final gain/loss at settlement rate

### Example

**Dec 1**: Purchase inventory for 100,000 euros
- Spot rate: $1 = 1 euro
- **Record**: $100,000

**Dec 31** (Balance Sheet Date):
- New rate: $1 = 0.9 euros (euro strengthened)
- Payable now: $111,111 (100,000 / 0.9)
- **Recognize loss**: $11,111 in **net income**

**Entry**:
```
DR Foreign Exchange Loss           $11,111
   CR Accounts Payable (euros)            $11,111
```

**Jan 15** (Settlement):
- Settlement rate: $1 = 0.95 euros
- Payment: $105,263 (100,000 / 0.95)
- **Recognize gain**: $5,848 in **net income** ($111,111 - $105,263)

**Entry**:
```
DR Accounts Payable (euros)       $111,111
   CR Cash                                $105,263
   CR Foreign Exchange Gain                 5,848
```

## CPA Exam Tips

### 1. Key Distinction

**Transaction gains/losses** → **Net Income**

**Translation adjustments** → **OCI**

### 2. Method Selection

**Functional currency determination** drives method:
- **Foreign currency functional** → Current Rate Method → OCI
- **USD functional** (or highly inflationary) → Temporal Method → NI

### 3. Translation Rates

**Current Rate Method**:
- ALL assets/liabilities → Current
- G/L → OCI

**Temporal Method**:
- Monetary → Current
- Nonmonetary → Historical
- G/L → NI

### 4. COGS and Depreciation

**Current Rate Method**: Average rate

**Temporal Method**: **Historical rate** (key difference!)

### 5. Highly Inflationary

**>100% over 3 years** → Use Temporal Method (USD functional)

### 6. Common Tested

- Which method to use (functional currency determination)
- Where G/L reported (OCI vs. NI)
- Translation rates for specific items
- COGS/Depreciation rates (historical for temporal)

## Common Mistakes

1. **Confusing transaction G/L with translation adjustment**:
   - Transaction → NI
   - Translation → OCI

2. **Using current rate for all items under temporal**:
   - Should be monetary only
   - Nonmonetary at historical

3. **Using historical rate for revenues under current rate method**:
   - Should be average rate

4. **Forgetting highly inflationary rule**:
   - >100% over 3 years → Temporal method

5. **Wrong rate for COGS/Depreciation**:
   - Current Rate Method → Average
   - Temporal Method → Historical

## Summary

### Key Points

**Transaction vs. Translation**:
- **Transaction G/L** → **Net Income**
- **Translation Adjustment** → **OCI**

**Current Rate Method**:
- Foreign currency is functional
- **ALL** assets/liabilities at **current** rate
- Translation adjustment to **OCI**

**Temporal Method**:
- USD is functional (or highly inflationary)
- **Monetary** at current, **nonmonetary** at historical
- Remeasurement G/L to **Net Income**

**Highly Inflationary**:
- **>100% over 3 years** → Use temporal method

**COGS/Depreciation**:
- Current Rate Method = **Average** rate
- Temporal Method = **Historical** rate

### Quick Decision Framework

**Step 1**: Determine functional currency
- Economic indicators (cash flows, sales market, expenses, financing)

**Step 2**: Select method
- **If foreign currency functional** → Current Rate Method
- **If USD functional** → Temporal Method
- **If highly inflationary** → Temporal Method

**Step 3**: Apply rates
- Current Rate: ALL A/L at current, equity historical, income average
- Temporal: Monetary current, nonmonetary historical, COGS/dep historical

**Step 4**: Report G/L
- Current Rate → **OCI**
- Temporal → **Net Income**
