# Treasury Stock Accounting

## Definition

**Treasury stock**: Corporation's own stock that has been **issued and subsequently reacquired** by the company (not retired)

## Key Principles

### 1. Treasury Stock is Contra-Equity
- **NOT an asset**
- **REDUCES** total stockholders' equity
- Reported as deduction in equity section

### 2. No Gain or Loss Recognition
**Company CANNOT recognize gain or loss on treasury stock transactions**

**Rationale**: Transactions with owners in their capacity as owners do not create income

### 3. Effect on Shares

| Type | Effect of Treasury Stock Purchase |
|------|-----------------------------------|
| **Authorized Shares** | No change |
| **Issued Shares** | No change (shares remain issued) |
| **Outstanding Shares** | **DECREASE** (treasury shares not outstanding) |

**Formula**:
```
Outstanding Shares = Issued Shares - Treasury Shares
```

## Cost Method (Most Common)

### Overview
Record treasury stock at **cost paid to reacquire**

### Purchase of Treasury Stock

**Entry**:
```
DR Treasury Stock (at cost)               $XXX
   CR Cash                                       $XXX
```

**Effect**:
- Reduces total stockholders' equity by cost paid
- Reduces shares outstanding
- Shares remain issued but not outstanding

### Example - Purchase

**Transaction**: Purchase 1,000 shares of own stock at $20/share

**Entry**:
```
DR Treasury Stock                  $20,000
   CR Cash                                 $20,000
```

**Effect on Equity**:
- Total stockholders' equity **decreases** by $20,000

**Effect on Shares**:
- Outstanding shares decrease by 1,000
- Issued shares unchanged

## Reissuance of Treasury Stock

### Above Cost

**When**: Reissue price **>** cost

**Entry**:
```
DR Cash (proceeds)                           $XXX
   CR Treasury Stock (at cost)                      $XXX
   CR Additional Paid-In Capital - Treasury Stock    XXX
```

**Result**: Excess goes to APIC - Treasury Stock

### Example - Reissue Above Cost

**Facts**:
- Purchased treasury stock at $20/share
- Reissue 500 shares at $25/share

**Entry**:
```
DR Cash (500 × $25)                $12,500
   CR Treasury Stock (500 × $20)           $10,000
   CR APIC - Treasury Stock                  2,500
```

**Effect**:
- Eliminates $10,000 treasury stock (increases equity)
- Adds $2,500 to APIC
- **Net equity increase**: $12,500
- **No gain recognized** (excess to APIC, not income)

### Below Cost

**When**: Reissue price **<** cost

**Priority**:
1. **First**: Reduce APIC from Treasury Stock
2. **Second**: If insufficient APIC-TS, reduce Retained Earnings

**Entry** (if sufficient APIC-TS):
```
DR Cash (proceeds)                           $XXX
DR APIC - Treasury Stock (difference)         XXX
   CR Treasury Stock (at cost)                      $XXX
```

**Entry** (if insufficient APIC-TS):
```
DR Cash (proceeds)                           $XXX
DR APIC - Treasury Stock (up to balance)      XXX
DR Retained Earnings (remainder)              XXX
   CR Treasury Stock (at cost)                      $XXX
```

### Example - Reissue Below Cost (Sufficient APIC)

**Facts**:
- Purchased treasury stock at $20/share
- Reissue 300 shares at $18/share
- APIC - Treasury Stock has balance of $5,000

**Entry**:
```
DR Cash (300 × $18)                 $5,400
DR APIC - Treasury Stock               600
   CR Treasury Stock (300 × $20)            $6,000
```

**Effect**:
- Eliminates $6,000 treasury stock
- Reduces APIC-TS by $600
- **No loss recognized** (reduction to APIC, not expense)

### Example - Reissue Below Cost (Insufficient APIC)

**Facts**:
- Purchased treasury stock at $20/share
- Reissue 300 shares at $15/share
- APIC - Treasury Stock has balance of $1,000

**Calculation**:
```
Proceeds:    300 × $15 = $4,500
Cost:        300 × $20 = $6,000
Shortfall:   $1,500

APIC-TS available:     $1,000
Remainder to RE:       $  500
```

**Entry**:
```
DR Cash                             $4,500
DR APIC - Treasury Stock            1,000
DR Retained Earnings                  500
   CR Treasury Stock                        $6,000
```

**Effect**:
- Uses all available APIC-TS ($1,000)
- Remainder ($500) reduces Retained Earnings
- **No loss recognized**

## Treasury Stock vs. Retired Stock

| Feature | Treasury Stock | Retired Stock |
|---------|---------------|---------------|
| **Status** | Held by corporation | Permanently removed |
| **Can reissue?** | Yes | No |
| **Shares issued** | No change | **Decreases** |
| **Shares outstanding** | **Decreases** | **Decreases** |
| **Accounting** | Contra-equity account | Reduce Common Stock and APIC |

## Dividends and Treasury Stock

**Key Rule**: Treasury shares **do NOT receive dividends** (not outstanding)

**Only outstanding shares receive dividends**

### Example - Dividend Calculation

**Facts**:
- Issued shares: 100,000
- Treasury shares: 5,000
- Declared dividend: $1.00 per share

**Calculation**:
```
Outstanding shares: 100,000 - 5,000 = 95,000
Total dividend: 95,000 × $1.00 = $95,000
```

**Entry**:
```
DR Retained Earnings               $95,000
   CR Dividends Payable                    $95,000
```

## Earnings Per Share and Treasury Stock

**Key Rule**: EPS denominator uses **outstanding shares** (excludes treasury shares)

### Example - EPS Calculation

**Facts**:
- Net income: $500,000
- Issued shares: 100,000
- Purchased 5,000 treasury shares on 7/1 (halfway through year)

**Weighted Average Outstanding Shares**:
```
Jan-Jun:  100,000 × 6/12 = 50,000
Jul-Dec:   95,000 × 6/12 = 47,500
                           ───────
Total:                     97,500
```

**EPS Calculation**:
```
EPS = $500,000 / 97,500 = $5.13 per share
```

## Shares Outstanding Calculation

### Example - Multiple Transactions

**Facts**:
- Beginning issued shares: 100,000
- Purchased 5,000 treasury shares
- Reissued 1,000 treasury shares

**Calculation**:
```
Issued shares:              100,000
Less: Treasury shares:
  Purchased                  (5,000)
  Reissued                    1,000
                            ────────
Net treasury shares:         (4,000)
                            ────────
Outstanding shares:          96,000
                            ════════
```

**Analysis**:
- Issued: 100,000 (unchanged)
- Treasury: 4,000 (net)
- Outstanding: 96,000

## Balance Sheet Presentation

### Stockholders' Equity Section

```
Stockholders' Equity:
  Common Stock, $1 par, 200,000 authorized,
    100,000 issued                                  $ 100,000
  Additional Paid-In Capital                          400,000
  Retained Earnings                                   500,000
  Accumulated Other Comprehensive Income               50,000
                                                    ──────────
                                                    1,050,000
  Less: Treasury Stock, 4,000 shares at cost          (80,000)
                                                    ──────────
Total Stockholders' Equity                          $ 970,000
                                                    ══════════
```

**Key Points**:
- Treasury stock shown as **deduction** (last line)
- Presented **at cost**
- Disclose number of shares

## Journal Entry Summary

### Purchase Treasury Stock
```
DR Treasury Stock (at cost)
   CR Cash
```

### Reissue Above Cost
```
DR Cash
   CR Treasury Stock (at cost)
   CR APIC - Treasury Stock (excess)
```

### Reissue Below Cost (Sufficient APIC)
```
DR Cash
DR APIC - Treasury Stock
   CR Treasury Stock (at cost)
```

### Reissue Below Cost (Insufficient APIC)
```
DR Cash
DR APIC - Treasury Stock (up to balance)
DR Retained Earnings (remainder)
   CR Treasury Stock (at cost)
```

## Par Value Method (Less Common)

**Description**: Alternative method - record treasury stock at par value rather than cost

**CPA Exam**: Typically tests **cost method**. Know that par value method exists but focus on cost method.

## CPA Exam Tips

1. **Contra-equity**: Treasury stock is **NOT an asset** - it's a reduction of equity

2. **No gain/loss**: Cannot recognize gain or loss on treasury stock transactions

3. **Reissue above cost**: Excess to **APIC - Treasury Stock**

4. **Reissue below cost**:
   - First: Reduce APIC-TS
   - Second: Reduce Retained Earnings (if insufficient APIC)

5. **Outstanding shares**: Issued shares **minus** treasury shares

6. **Dividends**: Treasury shares **do NOT** receive dividends

7. **EPS**: Use outstanding shares (exclude treasury) in denominator

8. **Balance sheet**: Treasury stock shown as **last item** (deduction from equity)

## Common Mistakes

1. **Treating treasury stock as asset**: It's contra-equity, not an asset

2. **Recognizing gain/loss**: Not allowed - adjustments go to APIC or RE

3. **Wrong order for reissuance below cost**:
   - Must reduce APIC-TS **first**
   - Then reduce RE if needed

4. **Including treasury shares in outstanding count**: Must exclude from outstanding

5. **Paying dividends on treasury shares**: Treasury shares don't receive dividends

6. **Not reducing equity on purchase**: Purchase reduces total equity

## Summary

### Key Points

- **Treasury stock = Contra-equity** (reduces total stockholders' equity)
- **Record at cost** when purchased (cost method)
- **No gain/loss** on treasury stock transactions
- **Reissue above cost** → Increase APIC - Treasury Stock
- **Reissue below cost** → Reduce APIC-TS first, then Retained Earnings
- **Outstanding Shares = Issued - Treasury**
- **Treasury shares don't receive dividends** (not outstanding)
- **Balance sheet**: Shown as deduction from equity (last line)

### Quick Reference

| Transaction | Debit | Credit |
|------------|-------|--------|
| **Purchase** | Treasury Stock (cost) | Cash |
| **Reissue > cost** | Cash | Treasury Stock (cost), APIC-TS |
| **Reissue < cost** | Cash, APIC-TS (or RE) | Treasury Stock (cost) |

### Effects Summary

| Transaction | Issued | Outstanding | Total Equity |
|------------|--------|-------------|--------------|
| **Purchase treasury** | No change | Decrease | Decrease |
| **Reissue treasury** | No change | Increase | Increase |
| **Retire stock** | Decrease | Decrease | Decrease |
