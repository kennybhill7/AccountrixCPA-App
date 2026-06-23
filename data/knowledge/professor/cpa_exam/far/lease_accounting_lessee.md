# Lease Accounting for Lessees - ASC 842

## ASC 842 Overview
ASC 842 (effective 2019-2022) changed lessee accounting by requiring virtually all leases to be recorded on the balance sheet

### Key Model
**Single recognition model**: All leases create ROU asset and lease liability
- Classification as finance or operating affects subsequent measurement and presentation

### Scope Exclusions
- Short-term leases (12 months or less)
- Leases of intangible assets
- Leases to explore for/use minerals, oil, natural gas
- Leases of biological assets

## Lease Classification

### Two Types
1. **Finance lease**: Lessee has substantially all risks and rewards of ownership (similar to purchase)
2. **Operating lease**: Lessee doesn't have substantially all risks/rewards (true rental)

### Five Classification Criteria
**Finance lease if ANY ONE criterion met:**

1. **Transfer of ownership**: Lease transfers ownership to lessee by end of lease term

2. **Purchase option**: Lessee reasonably certain to exercise purchase option

3. **Lease term**: Major part of economic life
   - Bright-line: **≥75%** of asset's remaining economic life

4. **Present value**: PV substantially all of fair value
   - Bright-line: PV **≥90%** of asset's fair value

5. **Specialized asset**: No alternative use to lessor at end of lease term

**Default**: If NONE of five criteria met → **Operating lease**

## Initial Measurement

### Lease Liability
**Present value** of lease payments not yet paid, discounted at commencement date

**Lease Payments Included**:
- Fixed payments
- Variable payments based on index/rate (at commencement)
- Purchase option price (if reasonably certain to exercise)
- Termination penalties (if lease term reflects termination)
- Amounts probable under residual value guarantee

**Lease Payments Excluded**:
- Variable payments not based on index/rate
- Executory costs paid separately to third party

**Discount Rate**:
1. Rate implicit in lease (if readily determinable)
2. Lessee's incremental borrowing rate (IBR)

### Right-of-Use Asset
```
ROU Asset = Lease Liability
          + Initial Direct Costs
          + Prepayments
          - Lease Incentives Received
```

### Example - Initial Measurement

**Facts**:
- Lease term: 5 years
- Annual payment: $100,000 (end of year)
- Lessee's IBR: 6%
- Lease incentive received: $10,000
- Initial direct costs: $5,000

**Calculation**:
```
PV of lease payments:
$100,000 × 4.2124 (PV factor 6%, 5 years) = $421,240

Lease Liability: $421,240

ROU Asset:
  Lease liability         $421,240
  Initial direct costs      +5,000
  Lease incentive          -10,000
  ─────────────────────────────────
  ROU Asset               $416,240
```

**Entry at Commencement**:
```
DR Right-of-Use Asset         $416,240
DR Cash (incentive received)    10,000
   CR Lease Liability                   $421,240
   CR Cash (initial costs)                 5,000
```

## Subsequent Measurement - Finance Lease

### Lease Liability
- Increase for interest (effective interest method)
- Decrease for lease payments made

### ROU Asset
- Amortize (straight-line or other systematic basis)
- Over shorter of lease term or useful life (if ownership transfers)

### Income Statement
- **Interest expense** (on lease liability)
- **Amortization expense** (on ROU asset)
- **SEPARATE presentation** - like financing a purchase

### Example - Finance Lease Year 1

**Facts**: Using example from initial measurement

**Year 1**:
```
Beginning lease liability:    $421,240
Interest (6%):                × 6% = $25,274
Payment:                              -100,000
─────────────────────────────────────────────
Ending lease liability:       $346,514

Amortization: $416,240 / 5 = $83,248
```

**Entries**:
```
Interest accrual:
DR Interest Expense            $25,274
   CR Lease Liability                   $25,274

Lease payment:
DR Lease Liability            $100,000
   CR Cash                             $100,000

ROU amortization:
DR Amortization Expense        $83,248
   CR ROU Asset                         $83,248
```

## Subsequent Measurement - Operating Lease

### Approach
Produce **straight-line total lease cost** over lease term

### Income Statement
- **Single lease expense** (straight-line)
- Reported within operating expenses

### Calculation
```
Annual Lease Expense = Total Lease Payments / Lease Term
```

### Example - Operating Lease Year 1

**Facts**: Same as initial measurement, but operating lease

**Total payments**: $100,000 × 5 = $500,000
**Annual lease expense**: $500,000 / 5 = $100,000

**Year 1 breakdown**:
```
Lease expense (total):        $100,000
Interest portion:               25,274 (same as finance)
Liability reduction:            74,726
ROU amortization (plug):        74,726
```

**Entry**:
```
DR Lease Expense              $100,000
   CR Right-of-Use Asset                $74,726
   CR Lease Liability                    25,274
```

## Short-Term Lease Exemption

**Definition**: Lease with term ≤12 months AND does not contain purchase option reasonably certain to exercise

**Election**: May elect NOT to recognize ROU asset and lease liability
- Recognize lease payments as expense (straight-line)

**Scope**: Election made by class of underlying asset

## Lease Term

### Components
- Noncancellable period
- Periods covered by extension option (if reasonably certain to exercise)
- Periods covered by termination option (if reasonably certain NOT to exercise)

### "Reasonably Certain" Factors
- Economic incentives (leasehold improvements, favorable terms)
- Business reasons
- Past practice
- Penalties

## Balance Sheet Presentation

| Item | Finance Lease | Operating Lease |
|------|--------------|-----------------|
| ROU Asset | PP&E (or separate line) | Separate from PP&E |
| Lease Liability | Current/Noncurrent | Current/Noncurrent |

## CPA Exam Tips

1. **All leases on balance sheet** (except short-term election)

2. **Classification**: Test all five criteria - only ONE needed for finance

3. **Bright-line tests**:
   - 75% of economic life
   - 90% of fair value

4. **Lease liability** = PV of lease payments at discount rate

5. **ROU asset** = Lease liability + adjustments

6. **Finance lease**: Interest expense + Amortization expense (separate)

7. **Operating lease**: Single straight-line lease expense

## Common Mistakes

1. Not testing all five classification criteria

2. Forgetting to adjust ROU asset for prepayments/incentives/initial direct costs

3. Using wrong discount rate (implicit vs. IBR)

4. Including variable payments not based on index/rate in lease liability

5. Not producing straight-line expense for operating lease

## Summary

### Key Formulas

**Lease Liability**:
```
PV of Lease Payments at Discount Rate
```

**ROU Asset**:
```
Lease Liability + Initial Direct Costs + Prepayments - Lease Incentives
```

**Finance Lease - Year 1**:
```
Interest Expense = Beginning Liability × Discount Rate
Amortization = ROU Asset / Lease Term
```

**Operating Lease**:
```
Annual Lease Expense = Total Payments / Lease Term
```

### Key Points
- All leases on balance sheet (except short-term election)
- Finance vs. operating affects income statement and amortization
- Five classification criteria - only one needed for finance
- Finance: Separate interest and amortization
- Operating: Single straight-line lease expense
