# Stock Warrants and Stock Rights

## Definitions

**Stock Warrant**: Right to purchase shares at specified price (exercise price) for specified period. Often issued with bonds to make offering more attractive.

**Stock Right**: Short-term privilege to purchase additional shares, typically given to existing shareholders (preemptive rights)

## Detachable vs. Nondetachable Warrants

### Detachable Warrants

**Definition**: Can be separated from bond and traded independently

**Accounting**: **Allocate proceeds** between bonds and warrants using **relative fair value method**

**Reason**: Two separate securities with independent values

### Nondetachable Warrants

**Definition**: Cannot be separated from bond (must exercise both together)

**Accounting**: **No allocation**. All proceeds assigned to bonds. Warrants have no separate value.

**Reason**: Economically one security (similar to convertible bond)

## Allocation of Proceeds (Detachable Warrants)

### Method

**Relative fair value (proportional) allocation**

**Formula**:
```
Bond proceeds = Total proceeds × (FV of bonds / Total FV)

Warrant proceeds = Total proceeds × (FV of warrants / Total FV)

Where: Total FV = FV of bonds + FV of warrants
```

**Bond discount/premium**: Bonds recorded at allocated amount (usually less than face value → creates discount)

**APIC - Warrants**: Warrants recorded in Additional Paid-In Capital - Stock Warrants

### Example - Issuance

**Facts**:
- Issue $100,000 face value bonds with 1,000 detachable warrants
- Total proceeds: $108,000
- Fair values:
  - Bonds without warrants: $104,000
  - Warrants: $4,000
  - Total FV: $108,000

**Allocation**:
```
To bonds: $108,000 × ($104,000 / $108,000) = $104,000
To warrants: $108,000 × ($4,000 / $108,000) = $4,000
```

**Entry**:
```
DR Cash                                   $108,000
   CR Bonds Payable                              $104,000
   CR APIC - Stock Warrants                         4,000
```

**Note**: Bonds issued at premium in this example ($104,000 > $100,000 face). This follows from allocation method.

### Alternative - Incremental Method

**If only one FV known**: Can use incremental method
- Allocate known FV first
- Residual to other security

**Example**:
- Total proceeds: $108,000
- FV of bonds: $105,000 (known)
- FV of warrants: Unknown

**Allocation**:
```
To bonds: $105,000
To warrants: $108,000 - $105,000 = $3,000 (residual)
```

## Warrant Exercise

**Cash received**: Warrant holders pay exercise price

**Entry Pattern**:
```
DR Cash (exercise price × warrants)       $XXX
DR APIC - Stock Warrants (original)       $XXX
   CR Common Stock (par × shares)                 $XXX
   CR APIC (excess over par)                      $XXX
```

### Example

**Facts**:
- 1,000 warrants (APIC $4,000) exercised at $10 each
- Par value: $1 per share
- 1,000 shares issued

**Entry**:
```
DR Cash (1,000 × $10)                     $10,000
DR APIC - Stock Warrants                    4,000
   CR Common Stock (1,000 × $1)                    $1,000
   CR APIC                                        13,000
```

## Warrant Expiration

**If not exercised**: Transfer APIC - Stock Warrants to APIC (or other paid-in capital)

**Entry**:
```
DR APIC - Stock Warrants                  $XXX
   CR APIC                                        $XXX
```

**Note**: No gain or loss on expiration (already in equity)

## Stock Rights to Shareholders

**Issuance**: Usually no entry when rights granted (unless represents dividend)

**Exercise**: Record stock issuance at exercise price

**Purpose**: Allow existing shareholders to maintain proportionate ownership (preemptive rights)

## Diluted EPS Impact

**Warrants are dilutive**: Use **treasury stock method** (same as stock options)

**Calculation**:
```
Assume warrants exercised
Proceeds used to buy back shares at average market price

Net increase in shares = Warrants exercised
                       - (Proceeds / Market price)

Where: Proceeds = Warrants × Exercise price
```

**Example**:
```
1,000 warrants, exercise price $10, market price $20

Shares from exercise: 1,000
Shares repurchased: (1,000 × $10) / $20 = 500
Net increase: 1,000 - 500 = 500 shares (dilutive effect)
```

## Comparison to Convertible Bonds

| Feature | Convertible Bonds | Bonds with Detachable Warrants |
|---------|------------------|-------------------------------|
| **Allocation** | No allocation - all to debt | Allocate between debt and equity |
| **Standard** | ASC 470 | ASC 470 |
| **Separable** | No | Yes |
| **Entry** | DR Cash, CR Bonds Payable | DR Cash, CR Bonds, CR APIC-Warrants |

## CPA Exam Tips

- **Detachable warrants**: Allocate proceeds using relative FV
- **Nondetachable warrants**: All proceeds to bonds (no allocation)
- **Allocation** reduces bond proceeds → Creates or increases bond discount
- **Exercise**: DR Cash + APIC-Warrants, CR Common Stock + APIC
- **Expiration**: Transfer within equity (no gain/loss)
- **Diluted EPS**: Warrants use treasury stock method

### Common Mistakes

- Allocating proceeds for nondetachable warrants (should not)
- Forgetting to use relative FV method
- Not reducing bonds payable for warrant allocation
- Recording gain/loss on warrant expiration (transfer within equity)

## Summary

### Key Points

- **Detachable warrants**: Allocate proceeds using relative FV method
- **Nondetachable warrants**: No allocation, all proceeds to bonds
- **Allocation**: Bonds get portion (usually creates discount), Warrants to APIC
- **Exercise**: DR Cash + APIC-Warrants, CR Common Stock + APIC
- **Expiration**: Transfer APIC-Warrants to APIC (no gain/loss)
- **Diluted EPS**: Use treasury stock method for warrants

### Quick Reference

**Allocation Formula**:
```
Bond portion = Proceeds × (Bond FV / Total FV)
Warrant portion = Proceeds × (Warrant FV / Total FV)
```

**Exercise Entry**:
```
DR Cash (exercise price)
DR APIC - Warrants (original allocation)
   CR Common Stock (par)
   CR APIC (plug)
```
