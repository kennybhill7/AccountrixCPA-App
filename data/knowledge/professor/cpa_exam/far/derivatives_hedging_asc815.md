# Derivatives and Hedging - ASC 815

## Overview

ASC 815 governs accounting for **derivatives** and **hedge accounting**

**Key principle**: All derivatives measured at **fair value** with changes typically in **income**

**Exception**: Hedge accounting allows special treatment to match derivative gains/losses with hedged item

## Derivative Definition

### Three Characteristics (ALL required)

A derivative must have **ALL THREE**:

#### 1. Underlying and Notional Amount

**Underlying**: Variable (price, rate, index) that determines settlement

**Notional Amount**: Number of units specified in contract

**Examples**:
- Interest rate swap: Underlying = interest rate, Notional = principal amount
- Stock option: Underlying = stock price, Notional = # of shares
- Foreign currency forward: Underlying = exchange rate, Notional = currency amount

#### 2. Little or No Initial Investment

Requires **no** initial net investment OR **smaller** investment than required for other contracts with similar response to market changes

**Examples**:
- ✓ Forward contract (no upfront payment)
- ✓ Option (small premium relative to underlying asset value)
- ✗ Purchasing the actual asset (requires full investment)

#### 3. Net Settlement

Contract can be settled net (without delivering/receiving underlying asset) OR provides for delivery that puts recipient in position not substantially different from net settlement

**Examples**:
- ✓ Cash-settled futures
- ✓ Forward contract with net settlement provision
- ✓ Contract for asset readily convertible to cash

### Examples of Derivatives

- Forward contracts
- Futures contracts
- Options (calls and puts)
- Swaps (interest rate, currency, commodity)
- Some convertible instruments (embedded derivatives)

## Basic Derivative Accounting

### Default Treatment

**All derivatives**:
- Measured at **fair value** on balance sheet
- Changes in FV recognized in **net income** each period

**Balance Sheet Presentation**:
- **Derivative asset** (if positive fair value)
- **Derivative liability** (if negative fair value)

### Example - No Hedge Designation

**Facts**:
- Company enters interest rate swap with FV of $0 at inception
- End of Year 1: FV = $10,000 (favorable to company)
- End of Year 2: FV = $(5,000) (unfavorable)

**Year 1 Entry**:
```
DR Derivative Asset               $10,000
   CR Gain on Derivative                   $10,000
```

**Year 2 Entry**:
```
DR Loss on Derivative             $15,000
   CR Derivative Asset                     $15,000

(Write down from $10,000 to $(5,000) liability position)
```

**Note**: Both gain and loss in **net income** - can cause earnings volatility

## Hedge Accounting

### Purpose

**Match timing** of derivative gains/losses with hedged item to **avoid income statement volatility**

**Without hedge accounting**: Derivative marked to market through income, hedged item may not be

**With hedge accounting**: Special treatment aligns recognition

### Qualification Requirements (ALL must be met)

1. **Formal documentation** at inception:
   - Hedging relationship
   - Risk management objective
   - Strategy

2. **Hedge must be highly effective**:
   - Offset **80-125%** of hedged risk

3. **Effectiveness assessed**:
   - At inception
   - Ongoing (at least quarterly)

4. **Hedged item** must be:
   - Specifically identified
   - Eligible for hedge accounting

## Three Types of Hedges

### 1. Fair Value Hedge

**Hedges**: Exposure to changes in **fair value** of:
- Recognized asset or liability, OR
- Firm commitment

**Examples**:
- Hedging fixed-rate debt with interest rate swap
- Hedging inventory with commodity future
- Hedging firm commitment to purchase/sell

**Accounting**:
- **Derivative** adjusted to FV → Change in **income**
- **Hedged item** adjusted to FV → Change in **income**
- **Result**: Gains/losses **offset in income** (if highly effective)

**Example**:

**Facts**:
- Fixed-rate debt: $1,000,000
- Interest rate swap to convert to variable
- Swap FV increases $20,000
- Debt FV decreases $19,000 (rates changed)

**Entry**:
```
DR Derivative Asset               $20,000
   CR Gain on Derivative                   $20,000

DR Loss on Hedged Item            $19,000
   CR Debt                                 $19,000
```

**Net income impact**: $20,000 gain - $19,000 loss = $1,000 net gain

**If highly effective**: Gains/losses largely offset

### 2. Cash Flow Hedge

**Hedges**: Exposure to **variability in cash flows** of:
- Recognized asset or liability, OR
- Forecasted transaction

**Examples**:
- Hedging variable-rate debt with interest rate swap
- Hedging forecasted purchase/sale
- Hedging future foreign currency transaction

**Accounting**:
- **Derivative** adjusted to FV:
  - **Effective portion** → **OCI** (equity)
  - **Ineffective portion** → **Income**
- **Hedged item**: No FV adjustment
- **Later**: Reclassify from OCI to income when hedged transaction affects income

**Example**:

**Facts**:
- Forecasted inventory purchase in 3 months
- Commodity forward to lock in price
- Forward FV increases $80,000 (80% effective)

**Entry**:
```
DR Derivative Asset               $80,000
   CR OCI - Cash Flow Hedge                $64,000 (80% effective)
   CR Gain on Derivative                    16,000 (20% ineffective)
```

**When inventory purchased and sold**:
```
DR Cost of Goods Sold             $64,000
   CR OCI - Cash Flow Hedge                $64,000

(Reclassify from OCI to income when hedged item affects earnings)
```

**Key Point**: OCI defers gain/loss until hedged transaction impacts income

### 3. Net Investment Hedge

**Hedges**: Foreign currency exposure of **net investment in foreign operation**

**Example**: Forward contract to hedge investment in foreign subsidiary

**Accounting**: Similar to cash flow hedge
- **Effective portion** → **OCI** (as part of cumulative translation adjustment)
- **Ineffective portion** → **Income**

**Purpose**: Offsets foreign currency translation adjustments on foreign subsidiary

## Comparison Table

| Type | Hedged Item | Derivative G/L | Hedged Item Adjustment | Where Reported |
|------|------------|---------------|----------------------|----------------|
| **Fair Value** | FV of asset/liability or firm commitment | In income | Adjust to FV, change in income | **Both in income** (offset) |
| **Cash Flow** | Cash flow variability | Effective → **OCI**, Ineffective → Income | No FV adjustment | **Deferred in OCI**, later reclassify |
| **Net Investment** | FX of foreign investment | Effective → **CTA (OCI)**, Ineffective → Income | Normal translation | **Offset FX translation in OCI** |

## Effectiveness Testing

### Requirement

Hedge must be **highly effective**: Offset **80-125%** of hedged item's changes attributable to hedged risk

### Testing Frequency

- **At inception**
- **Ongoing**: At least quarterly

### Methods

- Dollar-offset method
- Regression analysis
- Other statistical methods

### If Not Effective

- **Discontinue** hedge accounting prospectively
- Reclassify amounts in OCI per guidance
- Continue to mark derivative to FV through income

## Embedded Derivatives

### Definition

**Embedded derivative**: Derivative implicitly or explicitly contained in another contract (**hybrid instrument**)

### Examples

- Convertible bonds (conversion option is embedded derivative)
- Bonds with equity kickers
- Leases with foreign currency provisions
- Contracts with commodity-indexed payments

### Bifurcation Test

**Separate** embedded derivative from host contract if **ALL THREE**:

1. **Economic characteristics** not clearly and closely related to host
2. Hybrid instrument **not measured at FV** through income
3. Separate instrument with same terms **would be** a derivative

### If Bifurcated

- **Embedded derivative**: Account at FV through income
- **Host contract**: Account under normal rules

### Example

**Convertible Bond**:
- **Host**: Debt instrument (amortized cost)
- **Embedded**: Conversion option (derivative)

**If bifurcated**:
- Debt at amortized cost
- Conversion option at FV through income

## CPA Exam Tips

### 1. Derivative Identification

**Three characteristics** (memorize):
- Underlying + Notional amount
- Little/no initial investment
- Net settlement

**Common test**: Is this a derivative? Check all three.

### 2. Default Accounting

**ALL derivatives**: FV with changes in **income**

**Unless**: Designated as hedge AND qualifies for hedge accounting

### 3. Hedge Type Identification

**Keywords**:
- "Fixed-rate," "firm commitment" → **Fair value hedge**
- "Variable," "forecasted," "future" → **Cash flow hedge**
- "Foreign subsidiary," "net investment" → **Net investment hedge**

### 4. Where G/L Go

**Fair value hedge**: **Both** derivative and hedged item G/L in **income**

**Cash flow hedge**: Effective portion in **OCI**, ineffective in income

**Remember**: Fair value = both in income, Cash flow = OCI

### 5. Common Tested Scenarios

- Identifying whether instrument is derivative
- Classifying hedge type
- Determining where gains/losses reported
- Effectiveness testing (80-125%)

### 6. Common Mistakes

- Forgetting "little/no initial investment" requirement for derivatives
- Confusing fair value hedge with cash flow hedge
- Thinking all derivative G/L go to income (cash flow hedge uses OCI)
- Not understanding reclassification from OCI to income

## Summary

### Key Points

- **All derivatives** measured at **fair value**
- **Default**: Changes in FV → **net income**
- **Hedge accounting**: Special treatment to match timing with hedged item

**Three Hedge Types**:

1. **Fair Value Hedge**:
   - Hedges FV changes
   - **Both** derivative and hedged item to FV through **income**
   - Gains/losses **offset**

2. **Cash Flow Hedge**:
   - Hedges cash flow variability
   - **Effective portion** → **OCI**
   - Ineffective → Income
   - **Reclassify** from OCI when hedged transaction affects income

3. **Net Investment Hedge**:
   - Hedges FX of foreign investment
   - Similar to cash flow hedge
   - Offsets CTA

**Qualification**:
- Documentation
- Highly effective (80-125%)
- Ongoing assessment

**Embedded derivatives**:
- Separate if not clearly/closely related
- Account at FV through income

### Quick Reference

**Decision Tree**:

**Is it a derivative?**
1. Underlying + Notional? → If NO, not a derivative
2. Little/no initial investment? → If NO, not a derivative
3. Net settlement? → If NO, not a derivative
→ If YES to all, it's a derivative

**If derivative designated as hedge**:
- **Hedging FV** of existing item? → Fair value hedge (both in income)
- **Hedging cash flow variability**? → Cash flow hedge (OCI)
- **Hedging foreign subsidiary**? → Net investment hedge (OCI)

**If not designated or doesn't qualify**:
→ Mark to FV through **income** (default)
