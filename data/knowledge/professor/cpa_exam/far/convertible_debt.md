# Convertible Debt - ASC 470

## Definition
Bonds that can be converted into common stock at **bondholder's option** at specified conversion ratio.

## Key Accounting Rule
**NO separation** of debt and equity components at issuance (all proceeds recorded as debt)

### Rationale
Conversion feature is **inseparable** from bond (not detachable like warrants)

## Issuance Accounting

### Entry
```
DR Cash
   CR Bonds Payable (or CR Bonds + CR Premium if issued above face)
```

### NO Equity Component
Do **NOT** allocate proceeds to equity (unlike detachable warrants)

### Example
Issue $100,000 face convertible bonds for $108,000

```
DR Cash                    $108,000
   CR Bonds Payable                 $108,000

OR

DR Cash                    $108,000
   CR Bonds Payable                 $100,000
   CR Premium on Bonds               $8,000
```

## Conversion Accounting

### Book Value Method (Most Common)
- Remove carrying amount of bonds
- Issue stock at that carrying amount
- **NO gain or loss**

### Entry
```
DR Bonds Payable
DR Premium (or CR Discount)
   CR Common Stock (par)
   CR Additional Paid-in Capital (plug)
```

### Example
Convert $100,000 face bonds (carrying amount $102,000 including premium) into 10,000 shares ($1 par)

```
DR Bonds Payable           $100,000
DR Premium on Bonds           2,000
   CR Common Stock                   $10,000
   CR APIC                            92,000
```

**Result**: No gain or loss recognized

## Induced Conversion

### Definition
Issuer offers additional consideration to induce early conversion ("sweetener")

### Accounting
Recognize **EXPENSE** for fair value of additional consideration

### Example
Offer $5,000 cash bonus to convert early

```
DR Loss on Induced Conversion    $5,000
   CR Cash                                $5,000
```

(Plus normal conversion entry)

## Beneficial Conversion Feature

### Definition
If conversion price < market price at issuance, creates immediate value to bondholder

### Accounting
Allocate proceeds:
- Portion to debt (creates discount)
- Portion to equity (APIC)

### Calculation
```
Intrinsic Value = (Market Price - Conversion Price) × Shares Issuable
(Limited to proceeds received)
```

### Example
- Issue $100,000 bonds convertible into 10,000 shares
- Market price: $12
- Conversion price: $10
- Intrinsic value = ($12 - $10) × 10,000 = $20,000

**Entry at Issuance**:
```
DR Cash                          $100,000
DR Discount on Bonds               20,000
   CR Bonds Payable                        $100,000
   CR APIC                                   20,000
```

## Diluted EPS Impact

### If-Converted Method
Assume bonds converted at beginning of year (or issuance date if later)
- Add back interest expense (net of tax)
- Add shares from conversion

### Formula
```
Adjusted NI = NI + [Interest Expense × (1 - Tax Rate)]

Adjusted Shares = Weighted Average Shares + Shares from Conversion

Diluted EPS = Adjusted NI / Adjusted Shares
```

### Antidilution Test
If including convertible bonds **increases** EPS → **Antidilutive** (exclude from diluted EPS)

## Calculation Example: Diluted EPS

### Facts
- Net income: $500,000
- Shares outstanding: 100,000
- 1,000 convertible bonds ($1,000 face each)
- Convertible into 20 shares each (20,000 total shares)
- Interest: 6%
- Tax rate: 30%
- Basic EPS: $5.00

### If-Converted Calculation
```
Interest add-back:
$1,000,000 × 6% × (1 - 0.30) = $42,000

Shares added: 20,000

Diluted EPS = ($500,000 + $42,000) / (100,000 + 20,000)
            = $542,000 / 120,000
            = $4.52
```

### Conclusion
$4.52 < $5.00 → **Dilutive**. Include in diluted EPS.

## Comparison to Detachable Warrants

| Feature | Convertible Bonds | Bonds with Detachable Warrants |
|---------|------------------|-------------------------------|
| Separation at issuance | **NO** (all to debt) | **YES** (allocate using relative FV) |
| Conversion method | Book value method (no gain/loss) | Warrants exercised for cash |
| Equity component | Not recorded | Allocated at issuance |

## CPA Exam Tips

1. **Convertible bonds**: **NO allocation** at issuance (all proceeds to debt)

2. **Conversion**: Book value method (no gain/loss)
   - DR Bonds + Premium/Discount
   - CR Common Stock + APIC

3. **Induced conversion**: Recognize **expense** for additional consideration (sweetener)

4. **Diluted EPS**: If-converted method
   - Add back interest net of tax
   - Add shares from conversion

5. **Beneficial conversion feature**: Allocate intrinsic value to equity (creates discount)

6. **Compare to detachable warrants**: Convertible bonds are **inseparable** (no allocation)

## Common Mistakes

### Mistake 1: Allocation at Issuance
**Wrong**: Allocating proceeds between debt and equity
**Correct**: Convertible bonds **not separated** at issuance (all to debt)

### Mistake 2: Gain/Loss on Conversion
**Wrong**: Recognizing gain/loss on conversion
**Correct**: Use **book value method** with **no gain/loss**

### Mistake 3: Tax Effect for Diluted EPS
**Wrong**: Forgetting tax effect on interest add-back
**Correct**: Add back interest **net of tax**: Interest × (1 - Tax Rate)

### Mistake 4: Antidilution
**Wrong**: Including antidilutive convertible bonds in diluted EPS
**Correct**: If diluted EPS > basic EPS → **Antidilutive** (exclude)

## Summary

### Key Points

1. **Convertible bonds**: All proceeds to **debt** (no allocation to equity)

2. **Conversion**: Book value method
   - DR Bonds/Premium
   - CR Common Stock/APIC
   - **No gain/loss**

3. **Induced conversion**: **Expense** for additional consideration (sweetener)

4. **Diluted EPS**: If-converted method
   - Add interest net of tax
   - Add shares from conversion

5. **Beneficial conversion feature**: Allocate intrinsic value to APIC (creates discount)

6. **Compare to detachable warrants**: Convertible bonds **not separated** at issuance

### Decision Tree

```
Is feature detachable?
  ├─ NO (Convertible bonds) → All proceeds to debt
  └─ YES (Detachable warrants) → Allocate using relative FV

Conversion method?
  └─ Book value (no gain/loss)

For diluted EPS:
  1. Add back interest × (1 - tax rate)
  2. Add shares from conversion
  3. Calculate diluted EPS
  4. Compare to basic EPS
     ├─ If diluted < basic → Dilutive (include)
     └─ If diluted > basic → Antidilutive (exclude)
```
