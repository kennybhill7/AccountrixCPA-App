# Foreign Currency Transactions and Translation

## Overview

Two distinct concepts:
1. **Foreign Currency Transactions**: Individual transactions denominated in foreign currency
2. **Foreign Currency Translation**: Converting foreign subsidiary's entire financial statements

## Part 1: Foreign Currency Transactions

### Definition
Transactions denominated in a currency **other than the entity's functional currency**

### Examples
- US company purchases inventory from supplier requiring payment in euros
- US company makes sale to customer requiring payment in yen
- US company borrows money denominated in British pounds

## Functional Currency

### Definition
The currency of the **primary economic environment** in which the entity operates

### Indicators
- Currency of cash flows
- Currency of sales prices
- Currency of financing
- Currency of expenses

**For most US companies**: USD is functional currency

## Recording Foreign Currency Transactions

### Two-Transaction Perspective
**Separate** the purchase/sale transaction from the foreign currency exchange

### Three Key Dates

1. **Transaction Date**: When transaction occurs
2. **Balance Sheet Date**: End of reporting period (if applicable)
3. **Settlement Date**: When payment made

### Exchange Rates

**Spot rate**: Exchange rate on a specific date

**Notation**: "1 USD = X foreign currency" or "1 foreign currency = X USD"

## Recording Process

### Transaction Date

**Record at spot rate on transaction date**

**Example - Purchase**:
- US company purchases inventory on account for 10,000 euros
- Spot rate: 1 EUR = $1.10 USD
- Amount: 10,000 × $1.10 = $11,000

**Entry**:
```
DR Inventory                   $11,000
   CR Accounts Payable (EUR)           $11,000
```

### Balance Sheet Date (if not yet settled)

**Adjust payable/receivable to current spot rate**

**Continuing example**:
- Balance sheet date before payment
- New spot rate: 1 EUR = $1.08 USD
- Payable now: 10,000 × $1.08 = $10,800
- Adjustment: $11,000 - $10,800 = **$200 gain**

**Entry**:
```
DR Accounts Payable (EUR)         $200
   CR Foreign Currency Gain              $200
```

**Why**: US company's obligation decreased from $11,000 to $10,800 (euro weakened)

### Settlement Date

**Adjust to spot rate on settlement date, recognize final gain/loss**

**Continuing example**:
- Payment made when spot rate: 1 EUR = $1.12 USD
- Payment amount: 10,000 × $1.12 = $11,200
- Carrying amount: $10,800 (after BS adjustment)
- Additional loss: $11,200 - $10,800 = **$400 loss**

**Entry**:
```
DR Accounts Payable (EUR)      $10,800
DR Foreign Currency Loss            400
   CR Cash                                 $11,200
```

### Net Effect Over All Periods
```
Original transaction:     $11,000 debit to Inventory
BS date adjustment:       $   200 gain
Settlement adjustment:    $   400 loss
──────────────────────────────────────────
Net cash paid:            $11,200
Net foreign exchange:     $   200 loss ($11,200 - $11,000)
```

## Sale Transaction Example

**Facts**:
- US company makes sale on account for 50,000 British pounds
- Transaction date spot rate: 1 GBP = $1.30 USD
- Balance sheet date spot rate: 1 GBP = $1.28 USD
- Settlement date spot rate: 1 GBP = $1.32 USD

### Transaction Date
```
Sale: 50,000 × $1.30 = $65,000

DR Accounts Receivable (GBP)    $65,000
   CR Sales Revenue                      $65,000
```

### Balance Sheet Date
```
Receivable: 50,000 × $1.28 = $64,000
Adjustment: $65,000 - $64,000 = $1,000 loss

DR Foreign Currency Loss         $1,000
   CR Accounts Receivable (GBP)          $1,000
```

**Why**: Receivable worth less in USD (pound weakened)

### Settlement Date
```
Cash received: 50,000 × $1.32 = $66,000
Carrying amount: $64,000
Gain: $66,000 - $64,000 = $2,000

DR Cash                         $66,000
   CR Accounts Receivable (GBP)          $64,000
   CR Foreign Currency Gain               $2,000
```

### Net Effect
```
Original sale:            $65,000 credit to Sales
BS adjustment:            $ 1,000 loss
Settlement adjustment:    $ 2,000 gain
──────────────────────────────────────────
Net cash received:        $66,000
Net foreign exchange:     $ 1,000 gain ($66,000 - $65,000)
```

## Gain or Loss Recognition

### Where Reported
**Income statement** - typically within "Other Income and Expenses"

### Not Extraordinary
Foreign currency gains/losses are **not** extraordinary items (they are ordinary)

## Hedging Foreign Currency Risk

### Forward Contract
Agreement to exchange currencies at a **predetermined rate** on a future date

### Effect
**Locks in** exchange rate, eliminating uncertainty

### Accounting
- Forward contract recorded as derivative
- May qualify for hedge accounting under ASC 815
- Outside scope of basic FAR exam questions

## Part 2: Foreign Currency Translation

### Scenario
US parent company has foreign subsidiary maintaining books in foreign currency (e.g., euro)

### Requirement
**Translate** subsidiary's financial statements to USD for consolidated statements

## Functional Currency Determination

### Two Scenarios

**Scenario 1: Foreign currency is functional currency**
- Foreign operations relatively self-contained
- **Use current rate method**

**Scenario 2: USD is functional currency**
- Foreign operations are extension of parent
- **Use remeasurement method (temporal method)**

## Current Rate Method

### When Used
Foreign currency is the functional currency

### Translation Rates

| Item | Rate |
|------|------|
| **Assets and Liabilities** | Current rate (balance sheet date) |
| **Stockholders' Equity** | Historical rates |
| **Revenues and Expenses** | Average rate for period |
| **Dividends** | Rate when declared |

### Translation Adjustment

**Result**: Translation adjustment (gain or loss)

**Reported**: **Other Comprehensive Income (OCI)**
- **NOT in net income**
- Accumulated in equity as "Cumulative Translation Adjustment"

### Example - Current Rate Method

**Facts**:
- Foreign subsidiary has net assets of 100,000 euros
- Historical rate (when acquired): 1 EUR = $1.20
- Current rate (BS date): 1 EUR = $1.25
- Average rate: 1 EUR = $1.22

**Balance Sheet Translation**:
```
Assets: 100,000 EUR × $1.25 = $125,000
Equity (historical): 100,000 EUR × $1.20 = $120,000
──────────────────────────────────────────────
Translation Adjustment (to OCI): $5,000 gain
```

## Remeasurement Method (Temporal Method)

### When Used
US dollar is the functional currency (foreign operations are extension of parent)

### Remeasurement Rates

| Item | Rate |
|------|------|
| **Monetary assets/liabilities** | Current rate |
| **Nonmonetary assets/liabilities** | Historical rate |
| **Revenues and Expenses** | Average rate (or historical for COGS, depreciation) |

### Remeasurement Gain/Loss

**Result**: Remeasurement gain or loss

**Reported**: **Net income** (NOT OCI)

### Monetary vs. Nonmonetary

**Monetary**:
- Cash
- Receivables
- Payables
- Bonds payable

**Nonmonetary**:
- Inventory (at cost)
- Fixed assets
- Equity
- Common stock
- Retained earnings (beginning)

### Example - Remeasurement Method

**Facts**:
- Foreign subsidiary has:
  - Cash: 50,000 EUR
  - Inventory (at cost): 30,000 EUR (acquired when rate was $1.18)
  - Equipment: 100,000 EUR (acquired when rate was $1.15)
  - Payables: 40,000 EUR
- Current rate: 1 EUR = $1.25
- Average rate: 1 EUR = $1.22

**Remeasurement**:
```
Cash (monetary): 50,000 × $1.25 (current) = $62,500
Inventory (nonmonetary): 30,000 × $1.18 (historical) = $35,400
Equipment (nonmonetary): 100,000 × $1.15 (historical) = $115,000
Payables (monetary): 40,000 × $1.25 (current) = $50,000

Net assets in USD: $162,900
```

**Remeasurement gain/loss**: Calculated as plug to balance equity

**Reported**: In **net income**

## Summary Comparison

### Current Rate Method vs. Remeasurement

| Feature | Current Rate | Remeasurement |
|---------|--------------|---------------|
| **When used** | Foreign currency is functional | USD is functional |
| **Assets/Liabilities** | All at current rate | Monetary at current, nonmonetary at historical |
| **Gain/Loss reported** | **OCI** | **Net Income** |
| **Name of adjustment** | Translation adjustment | Remeasurement gain/loss |

## CPA Exam Tips

### Foreign Currency Transactions

1. **Three dates**: Transaction, balance sheet (if applicable), settlement
2. **Adjust to current rate** at each balance sheet and settlement date
3. **Gains/losses to income**: Include in net income, not extraordinary
4. **Direction**:
   - Payable + Foreign currency strengthens = Loss
   - Payable + Foreign currency weakens = Gain
   - Receivable + Foreign currency strengthens = Gain
   - Receivable + Foreign currency weakens = Loss

### Foreign Currency Translation

1. **Determine functional currency first**: Determines method
2. **Current rate method**:
   - Assets and liabilities: Current rate
   - Equity: Historical
   - Translation adjustment to **OCI**
3. **Remeasurement method**:
   - Monetary: Current rate
   - Nonmonetary: Historical rate
   - Gain/loss to **net income**

4. **Most commonly tested**: Current rate method and where translation adjustment is reported (OCI)

## Common Mistakes

### Transactions

1. **Not adjusting at balance sheet date**: Must adjust if not settled

2. **Recording inventory/sale at settlement rate**: Record at transaction date rate

3. **Wrong direction of gain/loss**:
   - Payable in strengthening currency = Loss (you owe more)
   - Receivable in weakening currency = Loss (you receive less)

### Translation

1. **Confusing OCI vs. net income**:
   - Current rate method → **OCI**
   - Remeasurement → **Net income**

2. **Using current rate for everything in remeasurement**: Must use historical for nonmonetary items

3. **Not identifying functional currency first**: Determines which method to use

## Summary

### Key Points

**Foreign Currency Transactions**:
- Record at spot rate on transaction date
- Adjust to spot rate at balance sheet and settlement dates
- Recognize gains/losses in **net income**

**Foreign Currency Translation**:
- **Current rate method**: Foreign currency functional → Translation adjustment to **OCI**
- **Remeasurement method**: USD functional → Remeasurement gain/loss to **net income**

### Quick Decision Framework

**For Transactions**:
1. Record at transaction date rate
2. Adjust at BS date (if not settled)
3. Adjust at settlement date
4. Gains/losses to income statement

**For Translation**:
1. Determine functional currency
2. If foreign currency → Current rate method → OCI
3. If USD → Remeasurement → Net income
