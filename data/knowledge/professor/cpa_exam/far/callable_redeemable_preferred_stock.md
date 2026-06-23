# Callable and Redeemable Preferred Stock

## Overview
Understanding the classification and accounting for preferred stock with redemption features is critical for proper balance sheet presentation and equity vs. liability classification.

---

## Callable Preferred Stock

### Definition
**Issuer** has the right to redeem (call) shares at a specified price after a specified date

### Classification
**Usually EQUITY** (issuer's choice to call)

### Call Price
Typically above par value (includes call premium)

### Accounting Upon Call
```
DR Preferred Stock (par value)
DR APIC - Preferred
DR Retained Earnings (call premium)
   CR Cash
```

**Important**: No gain or loss recognized (equity transaction)

---

## Redeemable Preferred Stock

### Definition
**Holder** has the right to require issuer to redeem shares (put option)

### Classification Depends on Terms

| Redemption Type | Classification |
|----------------|----------------|
| **Mandatory** (fixed date/certain event) | **LIABILITY** |
| **Holder's option** | **Temporary equity (Mezzanine)** |
| **Issuer's option** | **Equity** |

### SEC Guidance
Redeemable at holder's option or on fixed date: Report **outside of permanent equity** (mezzanine equity)

---

## Mandatorily Redeemable Preferred Stock

### Definition
Issuer **MUST** redeem on specified date or upon event certain to occur

### Classification
**LIABILITY** (not equity)

### ASC 480 Guidance
- Classified as liability
- Measured at settlement amount
- Accrete to redemption value

### Example
**Facts**: Preferred stock mandatorily redeemable in 5 years for $1 million

**Classification**: Liability

**Accounting**: Accrete to $1 million over 5 years

### Calculation Example - Mandatorily Redeemable

**Facts**:
- Issue mandatorily redeemable preferred for $1,000,000 cash
- Redeemable in 5 years for $1,200,000
- Use straight-line accretion

**Issuance**:
```
DR Cash                                        $1,000,000
   CR Mandatorily Redeemable Preferred (liability)        $1,000,000
```

**Annual Accretion**:
```
($1,200,000 - $1,000,000) / 5 = $40,000

DR Interest Expense (or Retained Earnings)        $40,000
   CR Mandatorily Redeemable Preferred                      $40,000
```

**At Maturity**:
```
DR Mandatorily Redeemable Preferred           $1,200,000
   CR Cash                                                  $1,200,000
```

---

## Mezzanine Equity (Temporary Equity)

### Definition
Equity that is not permanent (redeemable at holder's option)

### Presentation
**Separate section** between liabilities and stockholders' equity on balance sheet

**Balance Sheet Format**:
```
ASSETS
Total assets                                   $X,XXX

LIABILITIES
Total liabilities                              $X,XXX

MEZZANINE EQUITY (Temporary Equity)
Redeemable preferred stock                      $XXX

STOCKHOLDERS' EQUITY
Common stock                                    $XXX
Retained earnings                               $XXX
Total stockholders' equity                     $X,XXX
```

### Key Points
- **Not included** in total shareholders' equity
- **Excluded** from permanent equity
- **Accrete** to redemption value over time if date certain or probable

### Accretion for Mezzanine Equity
```
DR Retained Earnings
   CR Mezzanine Equity (Redeemable Preferred)
```

Increase carrying amount to redemption value over time.

---

## Redemption Accounting

### Redemption at Par
```
DR Preferred Stock
   CR Cash
```

### Redemption Above Par
```
DR Preferred Stock (par value)
DR APIC - Preferred (if any)
DR Retained Earnings (excess payment)
   CR Cash
```

### Redemption Below Par
```
DR Preferred Stock (par value)
   CR APIC - Preferred (or APIC)
   CR Cash
```

### Important Rule
**No gain or loss recognized** - redemption is equity transaction (doesn't affect income statement)

---

## Calculation Example - Callable Preferred

**Facts**:
- Callable preferred stock: 10,000 shares, $10 par, $12 call price
- APIC - Preferred: $15,000
- Company calls all shares

**Book Value**:
- Preferred Stock: $100,000 (10,000 × $10)
- APIC - Preferred: $15,000
- Total book value: $115,000

**Cash paid**: $120,000 (10,000 × $12)
**Excess over book value**: $5,000

**Entry**:
```
DR Preferred Stock                    $100,000
DR APIC - Preferred                     $15,000
DR Retained Earnings                     $5,000
   CR Cash                                         $120,000
```

**Note**: Excess $5,000 over book value reduces Retained Earnings (no gain/loss)

---

## Participating and Cumulative Preferred

### Participating Preferred
**Definition**: Preferred stock that participates in dividends beyond stated rate (if common receives more)

**Accounting**: Affects dividend allocation (not specifically related to callability/redeemability)

### Cumulative Preferred
**Definition**: Dividends in arrears must be paid before common receives dividends

### Impact on EPS
Cumulative preferred dividends (whether declared or not) reduce income available to common shareholders in basic EPS calculation

---

## Classification Decision Tree

```
Is redemption MANDATORY or certain to occur?
  ├─ YES → Classify as LIABILITY
  └─ NO → Is redemption at HOLDER's option?
            ├─ YES → Classify as MEZZANINE EQUITY (temporary)
            └─ NO → Is redemption at ISSUER's option?
                      └─ YES → Classify as EQUITY (permanent)
```

---

## CPA Exam Tips

1. **Callable (issuer's option)**: **Equity**. Redemption reduces equity (no gain/loss).

2. **Redeemable at holder's option**: **Mezzanine equity** (between liabilities and equity)

3. **Mandatorily redeemable**: **LIABILITY**. Accrete to redemption value.

4. **Redemption above book value**: Reduce Retained Earnings for excess (no gain/loss in income statement)

5. **Mezzanine equity**: Not included in total shareholders' equity

6. **Accrete mezzanine equity** to redemption value over time (debit RE)

---

## Common CPA Exam Mistakes

### Mistake 1: Classification Error
**Wrong**: Mandatorily redeemable classified as equity
**Correct**: Mandatorily redeemable is a **LIABILITY**

### Mistake 2: Equity Total Error
**Wrong**: Including mezzanine equity in total shareholders' equity
**Correct**: Mezzanine equity **excluded** from total shareholders' equity

### Mistake 3: Gain/Loss Recognition
**Wrong**: Recognizing gain/loss on redemption
**Correct**: Equity transaction - **no gain/loss** recognized

### Mistake 4: Forgetting Accretion
**Wrong**: Not accreting mandatorily redeemable to redemption value
**Correct**: Accrete carrying amount to redemption value over time

---

## Summary

### Classification Quick Reference

| Feature | Classification | Location |
|---------|---------------|----------|
| Issuer's option to call | Equity | Stockholders' equity |
| Holder's option to redeem | Mezzanine | Between liabilities & equity |
| Mandatory redemption | Liability | Liabilities |

### Key Accounting Points

1. **Callable (issuer's option)**: Equity. Redeemable (holder's option): Mezzanine. Mandatorily redeemable: Liability.

2. **Redemption entry**: DR Preferred/APIC/RE, CR Cash. No gain/loss (equity transaction).

3. **Mandatorily redeemable**: Accrete to redemption value over time (classify as liability)

4. **Mezzanine equity**: Between liabilities and equity on balance sheet, not included in total equity

5. **Excess payment** over book value reduces Retained Earnings (not gain/loss in IS)
