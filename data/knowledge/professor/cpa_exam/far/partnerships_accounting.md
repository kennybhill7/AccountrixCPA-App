# Partnership Accounting

## Partnership Characteristics

**Definition**: Unincorporated business owned by two or more persons

**Key Features**:
- **Unlimited liability** for partners
- **Pass-through taxation** (no entity-level tax)
- **Mutual agency** (each partner can bind partnership)
- **Limited life** (dissolved if partner leaves)
- Each partner has separate **capital account** tracking their equity

## Formation

### Contribution of Assets

**Assets contributed recorded at FAIR VALUE** (not book value from partner's books)

**Example**:
```
Partner contributes land with book value $70,000, FV $100,000

DR Land                                   $100,000
   CR Partner Capital                            $100,000

(Use fair value, not book value)
```

### Contribution with Liabilities

If partner contributes asset with attached liability, partnership assumes liability

**Example**:
```
Partner contributes land (FV $100,000) with mortgage ($40,000)

DR Land                                   $100,000
   CR Mortgage Payable                            $40,000
   CR Partner Capital                             60,000

(Partner's capital = FV of asset - liability assumed)
```

**Goodwill at Formation**: Generally NOT recognized unless specifically agreed (use fair values of identifiable assets)

## Income Allocation

### Priority Order

1. **Salary allowances** (if specified in partnership agreement)
2. **Interest on capital balances** (if specified)
3. **Bonus to managing partner** (if specified)
4. **Remainder split per profit/loss ratio**

**Important**: Salaries and interest are **ALLOCATIONS of income**, not expenses (partnership doesn't record salary expense to partners)

**If income insufficient**: Allocate in order above even if creates negative remainder (then allocate shortage per profit/loss ratio)

### Example - Income Allocation

**Facts**:
- Partnership agreement:
  - Partner A: $30,000 salary
  - Partner B: $20,000 salary
  - 10% interest on beginning capital (A: $100,000, B: $150,000)
  - Remainder split 60/40 (A/B)
- Partnership income: $100,000

**Allocation**:
```
Salaries:
  A: $30,000
  B: $20,000
  Total: $50,000

Interest:
  A: $10,000 (10% × $100,000)
  B: $15,000 (10% × $150,000)
  Total: $25,000

Remainder:
  $100,000 - $50,000 - $25,000 = $25,000
  A: $15,000 (60%)
  B: $10,000 (40%)

Total Allocation:
  A: $30,000 + $10,000 + $15,000 = $55,000
  B: $20,000 + $15,000 + $10,000 = $45,000
```

### Example - Loss Allocation

**Same facts, but partnership loss: $(20,000)**

**Allocation**:
```
Salaries:      A: $30,000    B: $20,000    Total: $50,000
Interest:      A: $10,000    B: $15,000    Total: $25,000
Remainder:     $(20,000) - $50,000 - $25,000 = $(95,000)
  Split 60/40: A: $(57,000)  B: $(38,000)

Total:         A: $30,000 + $10,000 - $57,000 = $(17,000) loss
               B: $20,000 + $15,000 - $38,000 = $(3,000) loss
```

## Admission of New Partner

### Two Methods

#### 1. Purchase of Interest

**Description**: New partner buys interest from existing partner(s) - **personal transaction**

**Accounting**: Transfer from selling partner's capital to new partner's capital. **No change to total partnership capital**.

**Payment**: Goes to selling partner personally (not to partnership)

**Entry**:
```
DR Selling Partner Capital                $XXX
   CR New Partner Capital                        $XXX

(At agreed amount)
```

#### 2. Investment in Partnership

**Description**: New partner invests directly in partnership - **increases partnership assets and capital**

**Three Scenarios**:

**a) Investment equals proportionate book value**: No bonus
```
DR Cash                                   $XXX
   CR New Partner Capital                        $XXX
```

**b) Bonus to old partners**: New partner invests MORE than proportionate book value
- Excess is bonus to old partners (allocated per profit ratio)

**c) Bonus to new partner**: New partner invests LESS than proportionate book value
- Old partners give bonus to new partner (goodwill or special contribution)

### Bonus Method - Examples

#### Bonus to Old Partners

**Facts**:
- Partnership capital before: A $60,000, B $40,000 (total $100,000)
- New partner C invests $60,000 for 1/3 interest
- A and B split profits equally

**Calculation**:
```
Total capital after admission: $100,000 + $60,000 = $160,000
C's proportionate share: $160,000 × 1/3 = $53,333
Bonus to old partners: $60,000 - $53,333 = $6,667
Split equally: A gets $3,333, B gets $3,334
```

**Entry**:
```
DR Cash                                    $60,000
   CR A Capital                                    $3,333
   CR B Capital                                     3,334
   CR C Capital                                    53,333
```

#### Bonus to New Partner

**Facts**:
- Partnership capital: A $60,000, B $40,000 (total $100,000)
- New partner C invests $20,000 for 1/4 interest
- A and B split equally

**Calculation**:
```
Total capital after: $100,000 + $20,000 = $120,000
C's proportionate share: $120,000 × 1/4 = $30,000
Bonus from old partners: $30,000 - $20,000 = $10,000
Split from A and B: A gives $5,000, B gives $5,000
```

**Entry**:
```
DR Cash                                    $20,000
DR A Capital                                 5,000
DR B Capital                                 5,000
   CR C Capital                                   $30,000
```

## Withdrawal of Partner

**Payment = Capital**: No bonus
```
DR Partner Capital                        $XXX
   CR Cash                                        $XXX
```

**Payment > Capital**: Bonus to withdrawing partner
```
DR Partner Capital                        $XXX
DR Remaining Partners' Capital            $XXX
   CR Cash                                        $XXX
```

**Payment < Capital**: Bonus to remaining partners
```
DR Partner Capital                        $XXX
   CR Remaining Partners' Capital                 $XXX
   CR Cash                                        $XXX
```

## Partnership Liquidation

### Process Steps

1. **Sell noncash assets** (record gain or loss)
2. **Allocate gain or loss** to partners per profit/loss ratio
3. **Pay outside creditors**
4. **Distribute remaining cash** to partners per capital balances

**Right of offset**: If partner has debit capital balance (deficit), partner must contribute to partnership. If partner cannot pay, deficit absorbed by other partners per their profit/loss ratio.

### Example

**Facts**:
- Capital balances: A $40,000, B $30,000, C $10,000
- Profit ratio: 50/30/20
- Sell all assets (BV $100,000) for $70,000
- Pay creditors $20,000

**Step 1 - Loss on Sale**:
```
Loss: $30,000
Allocate: A $(15,000), B $(9,000), C $(6,000)
```

**Step 2 - Adjust Capital**:
```
A: $40,000 - $15,000 = $25,000
B: $30,000 - $9,000 = $21,000
C: $10,000 - $6,000 = $4,000
```

**Step 3 - Pay Creditors**:
```
Cash: $70,000 - $20,000 = $50,000 remaining
```

**Step 4 - Distribute to Partners**:
```
Pay A $25,000, B $21,000, C $4,000 (total $50,000)
```

### Deficit Capital Balance

**If partner has deficit but cannot pay**:
- Deficit absorbed by remaining partners per their profit/loss ratio
- Reduces their distributions

**Example**: C has $(5,000) deficit but cannot pay. A and B absorb per their ratio (50:30 or 5:3).
- A absorbs: $3,125
- B absorbs: $1,875

## CPA Exam Tips

- **Formation**: Contribute assets at FAIR VALUE (not book value)
- **Income allocation priority**: Salaries → Interest → Bonus → Remainder per ratio
- **Purchase of interest**: No change to total partnership capital (just transfer)
- **Investment in partnership**: Increases capital. Calculate bonus if investment ≠ proportionate BV.
- **Liquidation**: Sell assets → Allocate gain/loss → Pay creditors → Distribute per capital
- **Deficit capital**: Partner must pay in, or remaining partners absorb per ratio

## Summary

### Key Points

- **Formation**: Assets at fair value, liabilities assumed
- **Income allocation**: Salaries → Interest → Remainder per profit/loss ratio
- **Purchase of interest**: No change to total capital (transfer)
- **Investment in partnership**: Increases capital, may create bonus
- **Bonus**: Investment ≠ proportionate capital → Bonus to/from partners
- **Liquidation**: Sell assets → Allocate gain/loss → Pay creditors → Distribute per capital
- **Deficit capital**: Partner pays in or remaining partners absorb per ratio

### Quick Formula

**Bonus Calculation**:
```
Total capital after admission × New partner's % = New partner's capital
Compare to investment:
  If investment > capital → Bonus to old partners
  If investment < capital → Bonus to new partner
```
