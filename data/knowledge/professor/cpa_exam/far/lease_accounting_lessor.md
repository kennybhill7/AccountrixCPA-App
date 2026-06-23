# Lease Accounting for Lessors - ASC 842

## Overview

**Lessor accounting** has **THREE classifications**:
1. **Sales-Type Lease** (recognize profit at commencement)
2. **Direct Financing Lease** (no profit at commencement, only interest over time)
3. **Operating Lease** (rental income model)

Classification affects **profit recognition timing** and **asset treatment**.

## Classification Process

### Step 1: Test Finance Lease Criteria

**Same 5 criteria as lessee** - Finance lease if **ANY ONE** met:

1. **Transfer of ownership**: Lease transfers ownership by end of term
2. **Purchase option**: Lessee reasonably certain to exercise
3. **Lease term**: ≥ **75%** of remaining economic life
4. **Present value**: PV ≥ **90%** of fair value
5. **Specialized asset**: No alternative use to lessor at end

### Step 2: If Finance Lease, Determine Type

| Type | When Used |
|------|-----------|
| **Sales-Type** | Finance lease AND (selling profit/loss exists) |
| **Direct Financing** | Finance lease AND no selling profit/loss |
| **Operating** | Does NOT meet any finance lease criterion |

**Selling Profit/Loss Test**: Compare **Fair Value** vs. **Carrying Amount**
- FV ≠ Carrying Amount → **Sales-Type**
- FV ≈ Carrying Amount → **Direct Financing**

## Sales-Type Lease

### Characteristics

- Lessor is typically a **manufacturer or dealer**
- Recognizes **selling profit at commencement**
- **Derecognizes** underlying asset from books
- Most common for: Equipment manufacturers leasing their products

### Accounting at Commencement

**Derecognize**: Remove asset at carrying amount

**Recognize**: Net investment in lease
- Lease receivable (PV of lease payments)
- Unguaranteed residual asset (PV of unguaranteed residual)

**Recognize Revenue and Cost**:
- **Revenue**: At fair value
- **Cost of Goods Sold**: Carrying amount - PV of unguaranteed residual
- **Gross Profit**: Revenue - COGS

### Net Investment in Lease

```
Net Investment = Lease Receivable + Unguaranteed Residual Asset
```

### Example - Sales-Type Lease

**Facts**:
- Equipment cost/carrying amount: $300,000
- Fair value: $400,000
- Lease term: 5 years
- Annual payment (end of year): $90,000
- Unguaranteed residual value: $50,000
- Implicit rate: 8%

**Step 1: Calculate PV**:
```
PV of lease payments:
$90,000 × 3.9927 (PV annuity, 8%, 5 periods) = $359,343

PV of unguaranteed residual:
$50,000 × 0.6806 (PV single sum, 8%, 5 periods) = $34,030

Net investment in lease:
$359,343 + $34,030 = $393,373
```

**Step 2: Calculate Profit**:
```
Revenue (at FV):                $400,000

COGS:
  Carrying amount               $300,000
  Less: PV of unguaranteed      (34,030)
  residual
  ─────────────────────────────────────
  COGS                          $265,970

Gross Profit:
$400,000 - $265,970 = $134,030
```

**Journal Entry at Commencement**:
```
DR Lease Receivable               $359,343
DR Unguaranteed Residual Asset      34,030
DR Cost of Goods Sold              265,970
   CR Equipment                            $300,000
   CR Sales Revenue                         400,000
   CR Deferred Profit (unguaranteed)        34,030 *
```

*Deferred profit on unguaranteed residual recognized over lease term

### Subsequent Measurement

**Each Period**: Recognize **interest income** using effective interest method on net investment

**Example - Year 1 Interest**:
```
Beginning net investment:      $393,373
× Implicit rate:                × 8%
─────────────────────────────────────
Interest income:               $ 31,470
```

**Entry**:
```
DR Cash                         $90,000
   CR Lease Receivable                  $58,530
   CR Interest Income                    31,470
```

## Direct Financing Lease

### Characteristics

- **No selling profit** (FV ≈ Carrying amount)
- Typically a **financial institution** or lessor who purchased asset specifically to lease
- Derecognizes underlying asset
- Profit comes only from **interest income** over lease term

### Accounting at Commencement

**Derecognize**: Remove asset at carrying amount

**Recognize**: Net investment in lease (same formula as sales-type)

**NO gross profit** recognized at commencement

### Example - Direct Financing Lease

**Facts**: Same as sales-type example, except:
- Fair value: $300,000 (equals carrying amount)

**Calculation**:
```
PV of lease payments: $269,343 (recalculated at rate that makes FV = CA)
PV of unguaranteed residual: $34,030
Net investment: $303,373 ≈ Carrying amount of $300,000
```

**Journal Entry at Commencement**:
```
DR Lease Receivable               $269,343
DR Unguaranteed Residual Asset      34,030
   CR Equipment                            $300,000
   CR Deferred Profit                        3,373
```

**Note**: Small deferred profit recognized over lease term as adjustment to interest income (no immediate gross profit)

### Subsequent Measurement

Recognize **interest income** over lease term using effective interest method

## Operating Lease (Lessor)

### Characteristics

- Lessor **retains ownership** and substantially all risks/rewards
- Asset remains on lessor's balance sheet
- **Continues to depreciate** asset
- Most like traditional rental arrangement

### Accounting

**Asset Treatment**:
- **Keep on balance sheet**
- **Depreciate** using normal depreciation methods

**Revenue Recognition**:
- Recognize lease payments as **rental revenue**
- Typically **straight-line** over lease term

**Initial Direct Costs**:
- Defer and amortize over lease term

### Example - Operating Lease

**Facts**:
- Equipment cost: $300,000
- Useful life: 10 years
- Lease term: 3 years
- Annual payment: $50,000

**Annual Entries**:

**Receive Payment**:
```
DR Cash                          $50,000
   CR Rental Revenue                     $50,000
```

**Depreciation**:
```
DR Depreciation Expense          $30,000
   CR Accumulated Depreciation           $30,000

($300,000 / 10 years = $30,000 per year)
```

**Key Point**: Depreciation continues regardless of lease - based on asset's useful life

## Initial Direct Costs

### Definition
Incremental costs directly attributable to negotiating and arranging lease

### Treatment by Lease Type

| Lease Type | Treatment |
|------------|-----------|
| **Sales-type (with selling profit)** | **Expense** at commencement |
| **Sales-type (no selling profit)** | Defer and amortize as yield adjustment |
| **Direct financing** | Defer and amortize as yield adjustment |
| **Operating** | Defer and amortize over lease term |

## Comparison Table

| Aspect | Sales-Type | Direct Financing | Operating |
|--------|-----------|-----------------|-----------|
| **Classification** | Finance + profit exists | Finance, no profit | Not finance |
| **Asset** | **Derecognized** | **Derecognized** | **Retained & depreciated** |
| **Profit at start** | **YES** - gross profit | **NO** | **NO** |
| **Income recognized** | Interest income | Interest income | Rental revenue |
| **Balance sheet** | Net investment in lease | Net investment in lease | Asset (net of depreciation) |
| **Typical lessor** | Manufacturer/dealer | Finance company | Equipment owner/lessor |

## Classification Examples

### Example 1: Manufacturer Lessor

**Facts**:
- Manufacturer's cost: $80,000
- Fair value: $100,000
- Lease term: 4 years of 5-year life (80%)

**Analysis**:
- Meets finance lease criterion (80% > 75%)
- FV ($100K) > Cost ($80K) → Profit exists

**Classification**: **Sales-Type Lease**

**At commencement**: Recognize $20,000 gross profit

### Example 2: Bank Lessor

**Facts**:
- Bank purchases equipment for $100,000
- Fair value: $100,000
- Immediately leases to customer
- Lease term: 4 years of 5-year life (80%)

**Analysis**:
- Meets finance lease criterion (80% > 75%)
- FV ($100K) = Cost ($100K) → No profit

**Classification**: **Direct Financing Lease**

**At commencement**: No gross profit, only interest over time

### Example 3: Rental Company

**Facts**:
- Equipment cost: $50,000
- Fair value: $50,000
- Lease term: 2 years of 8-year life (25%)
- PV of payments: $20,000 (40% of FV)

**Analysis**:
- Lease term: 25% < 75% ✗
- PV: 40% < 90% ✗
- Fails all finance lease criteria

**Classification**: **Operating Lease**

**Accounting**: Keep asset, depreciate, recognize rental income

## CPA Exam Tips

1. **Classification process**:
   - First test 5 criteria for finance lease
   - If finance, check for selling profit (FV vs. CA)

2. **Sales-type is most tested**:
   - Know gross profit calculation
   - Revenue = FV
   - COGS = CA - PV of unguaranteed residual

3. **Key differences**:
   - Sales-type: **Immediate** profit recognition
   - Direct financing: **No** immediate profit
   - Operating: Asset stays on books

4. **Net investment formula**:
   ```
   Net Investment = PV of Lease Payments + PV of Unguaranteed Residual
   ```

5. **Asset treatment**:
   - Finance leases (both types): **Derecognize** asset
   - Operating lease: **Keep** asset, depreciate

6. **Common mistakes**:
   - Forgetting to subtract PV of unguaranteed residual from COGS
   - Confusing sales-type with direct financing
   - Not derecognizing asset for finance leases

## Summary

### Key Points

- **Three lessor classifications**: Sales-type, direct financing, operating
- **Finance lease criteria**: Same 5 as lessee (ANY ONE sufficient)
- **Sales-type**: Manufacturer/dealer, recognizes **gross profit at commencement**
- **Direct financing**: No selling profit, only **interest income over time**
- **Operating**: Lessor keeps asset, recognizes **rental income and depreciation**
- **Net investment in lease**: PV of lease payments + PV of unguaranteed residual

### Decision Tree

**Start**: Test 5 finance lease criteria

**If ANY ONE met**:
- Finance lease → Check FV vs. CA
  - FV > CA → **Sales-Type**
  - FV ≈ CA → **Direct Financing**

**If NONE met**:
- **Operating Lease**

### Quick Reference

**Sales-Type at Commencement**:
```
DR Lease Receivable (PV of payments)
DR Unguaranteed Residual Asset (PV)
DR Cost of Goods Sold (CA - PV of unguaranteed)
   CR Asset (carrying amount)
   CR Sales Revenue (FV)
   CR Deferred Profit (unguaranteed residual)
```

**Operating - Each Period**:
```
DR Cash
   CR Rental Revenue

DR Depreciation Expense
   CR Accumulated Depreciation
```
