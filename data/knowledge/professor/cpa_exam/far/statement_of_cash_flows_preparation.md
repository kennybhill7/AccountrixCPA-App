# Statement of Cash Flows - Preparation and Classification

## Overview

**Purpose**: Report cash receipts and cash payments during a period, classified by operating, investing, and financing activities

**Required for**: All entities that provide balance sheet and income statement

**Format Options**:
1. **Indirect method** (most common - starts with net income)
2. **Direct method** (shows gross cash receipts and payments)

## Three Categories of Cash Flows

### Operating Activities

**Definition**: Principal revenue-producing activities and other activities not classified as investing or financing

**Cash Inflows**:
- Cash from customers
- Interest received
- Dividends received

**Cash Outflows**:
- Cash paid to suppliers and employees
- Interest paid
- Income taxes paid

### Investing Activities

**Definition**: Acquisition and disposition of long-term assets and investments not included in cash equivalents

**Cash Inflows**:
- Sale of property, plant, equipment
- Sale of investments (stocks, bonds)
- Collection of loan principal made to others

**Cash Outflows**:
- Purchase of PPE
- Purchase of investments
- Loans made to others

### Financing Activities

**Definition**: Activities resulting in changes in size and composition of equity capital and borrowings

**Cash Inflows**:
- Issuance of stock
- Issuance of bonds/notes
- Borrowing from bank

**Cash Outflows**:
- Payment of dividends
- Repurchase of stock (treasury stock)
- Repayment of debt **principal**
- Payment of finance lease principal

## Indirect Method (Reconciliation Method)

### Overview
- Used by **>99% of companies**
- Starts with **net income**
- Adjusts for noncash items and changes in working capital

### Operating Section Format

```
Net Income                                          $XXX
Adjustments to reconcile to cash from operations:
  + Depreciation and amortization                    XXX
  + Amortization of bond discount                    XXX
  - Amortization of bond premium                    (XXX)
  + Loss on sale of assets                           XXX
  - Gain on sale of assets                          (XXX)
  - Increase in accounts receivable                 (XXX)
  + Decrease in accounts receivable                  XXX
  - Increase in inventory                           (XXX)
  + Decrease in inventory                            XXX
  - Increase in prepaid assets                      (XXX)
  + Decrease in prepaid assets                       XXX
  + Increase in accounts payable                     XXX
  - Decrease in accounts payable                    (XXX)
  + Increase in accrued liabilities                  XXX
  - Decrease in accrued liabilities                 (XXX)
                                                    ─────
Cash from Operating Activities                      $XXX
                                                    ═════
```

### Logic Behind Adjustments

**1. Add Back Noncash Expenses**:
- Depreciation, amortization reduce net income but don't use cash
- Must add back to net income

**2. Gains/Losses on Investing/Financing Activities**:
- **Add back losses** (or subtract gains)
- **Rationale**: Actual cash flow reported in investing/financing sections
- Remove from operating to avoid double counting

**3. Working Capital Changes**:

**Current Assets**:
- **Increase** = Use of cash (subtract)
- **Decrease** = Source of cash (add)

**Current Liabilities**:
- **Increase** = Source of cash (add)
- **Decrease** = Use of cash (subtract)

**Memory Aid: ALDI**
- **A**ssets ↓ = **A**dd
- **L**iabilities ↑ = Add

### Example - Indirect Method

**Given**:
- Net Income: $100,000
- Depreciation expense: $20,000
- Loss on sale of equipment: $5,000
- Accounts receivable decreased: $10,000
- Inventory increased: $15,000
- Accounts payable increased: $8,000

**Calculation**:
```
Net Income                              $100,000
Adjustments:
  + Depreciation expense                  20,000
  + Loss on sale of equipment              5,000
  + Decrease in AR (collected more)       10,000
  - Increase in inventory (bought more)  (15,000)
  + Increase in AP (paid less)             8,000
                                        ─────────
Cash from Operating Activities          $128,000
                                        ═════════
```

## Direct Method

### Overview
- Rarely used (<1% of companies)
- FASB prefers it
- Shows gross cash receipts and payments

### Operating Section Format

```
Cash received from customers                    $XXX
Cash paid to suppliers                          (XXX)
Cash paid to employees                          (XXX)
Cash paid for operating expenses                (XXX)
Interest paid                                   (XXX)
Income taxes paid                               (XXX)
                                               ─────
Cash from Operating Activities                  $XXX
                                               ═════
```

### Reconciliation Required
If direct method used, must **also provide reconciliation** of net income to cash from operations (essentially showing indirect method)

### Key Calculations

**Cash from Customers**:
```
Sales Revenue
- Increase in AR (or + Decrease in AR)
= Cash from Customers
```

**Cash to Suppliers**:
```
COGS
+ Increase in Inventory (- Decrease)
- Increase in AP (+ Decrease)
= Cash to Suppliers
```

### Example - Direct Method

**Facts**:
- Sales: $500,000
- Beginning AR: $50,000
- Ending AR: $60,000

**Cash from Customers**:
```
Sales                               $500,000
- Increase in AR ($60K - $50K)       (10,000)
                                    ─────────
Cash from Customers                 $490,000
                                    ═════════
```

**Explanation**: Sold $500K but only collected $490K (AR increased $10K)

## Classification Rules

| Item | Classification |
|------|---------------|
| **Interest paid** | **Operating** (controversial, but required) |
| Interest received | Operating |
| Dividends received | Operating |
| **Dividends paid** | **Financing** |
| Income taxes paid | Operating (unless directly related to I/F transaction) |
| Purchase of PPE | Investing |
| Sale of PPE | Investing (full proceeds, regardless of gain/loss) |
| Issuance of stock | Financing |
| Repurchase of stock (treasury) | Financing |
| Issuance of bonds | Financing |
| Repayment of bonds | Financing (principal only) |
| Finance lease principal payment | Financing |
| Operating lease payment | Operating |
| Stock dividend/split | **Noncash** (not reported in body) |

## Special Situations

### Gain or Loss on Sale of Assets

**Income Statement**: Gain or loss reported in net income

**Cash Flow Statement**:

**Operating Section** (indirect method):
- **Add back loss** or **Subtract gain**
- **Rationale**: Remove noncash effect on net income

**Investing Section**:
- Report **full cash proceeds** from sale

### Example - Sale with Gain

**Facts**:
- Equipment book value: $80,000
- Sold for: $100,000
- Gain: $20,000

**Operating Section** (indirect method):
```
Net Income (includes $20K gain)         $XXX
- Gain on sale of equipment           (20,000)
```

**Investing Section**:
```
Proceeds from sale of equipment        $100,000
```

**Result**: Gain removed from operating, actual cash of $100K in investing

### Noncash Investing and Financing

**Definition**: Significant transactions that don't affect cash

**Examples**:
- Conversion of bonds to stock
- Acquisition of assets by issuing stock or debt
- Exchange of noncash assets
- Stock dividend or stock split

**Disclosure**: **NOT reported in statement body**. Disclosed in **supplemental schedule or notes**.

### Example - Noncash Transaction

**Transaction**: Issued $500,000 of common stock to acquire land

**Cash Flow Statement**: No entry in body

**Supplemental Disclosure**:
> "Acquired land valued at $500,000 by issuing common stock."

### Finance Lease Accounting

**At Inception**:
- Noncash investing and financing activity
- Supplemental disclosure

**Subsequent Payments**:
- **Interest portion** → Operating
- **Principal portion** → Financing

### Operating Lease Accounting (ASC 842)

**Lease Payments**: Classified as **operating** cash outflows

## Common Adjustments - Indirect Method

### Always Add Back
- Depreciation expense
- Amortization of intangibles
- Amortization of bond discount
- Loss on sale of assets
- Loss on impairment
- Loss on debt extinguishment
- Deferred tax expense (increase in DTL)
- Decrease in deferred tax asset

### Always Subtract
- Gain on sale of assets
- Amortization of bond premium
- Deferred tax benefit (decrease in DTL)
- Increase in deferred tax asset

### Working Capital Changes

| Change | Effect on Cash | Adjustment to NI |
|--------|---------------|------------------|
| Current asset **increase** | Use of cash | **Subtract** |
| Current asset **decrease** | Source of cash | **Add** |
| Current liability **increase** | Source of cash | **Add** |
| Current liability **decrease** | Use of cash | **Subtract** |

## Comprehensive Example

### Given

**Income Statement Items**:
- Net Income: $200,000
- Depreciation expense: $50,000
- Gain on sale of land: $10,000

**Balance Sheet Changes**:
- Accounts receivable decreased: $5,000
- Inventory increased: $15,000
- Prepaid insurance decreased: $2,000
- Accounts payable increased: $8,000
- Accrued wages decreased: $3,000

### Operating Section - Indirect Method

```
Cash Flows from Operating Activities:
Net Income                                      $200,000
Adjustments:
  Depreciation expense                            50,000
  Gain on sale of land                           (10,000)
  Decrease in accounts receivable                  5,000
  Increase in inventory                          (15,000)
  Decrease in prepaid insurance                    2,000
  Increase in accounts payable                     8,000
  Decrease in accrued wages                       (3,000)
                                                ─────────
Cash from Operating Activities                  $237,000
                                                ═════════
```

## Investing Section Example

**Transactions**:
- Purchased equipment: $100,000
- Sold equipment (BV $40K): $45,000
- Purchased investments: $30,000
- Sold investments (cost $20K): $18,000

**Presentation**:
```
Cash Flows from Investing Activities:
  Purchase of equipment                      $(100,000)
  Proceeds from sale of equipment               45,000
  Purchase of investments                      (30,000)
  Proceeds from sale of investments             18,000
                                             ──────────
Net cash used in investing activities        $ (67,000)
                                             ══════════
```

**Operating Adjustments**:
- Gain on equipment sale ($5K): Subtract from NI
- Loss on investment sale ($2K): Add to NI

## Financing Section Example

**Transactions**:
- Issued common stock: $150,000
- Paid cash dividends: $40,000
- Repurchased treasury stock: $25,000
- Borrowed from bank: $200,000
- Repaid long-term debt: $50,000

**Presentation**:
```
Cash Flows from Financing Activities:
  Proceeds from issuance of common stock     $150,000
  Payments of cash dividends                  (40,000)
  Purchase of treasury stock                  (25,000)
  Proceeds from bank loan                     200,000
  Repayment of long-term debt                 (50,000)
                                             ─────────
Net cash provided by financing activities    $235,000
                                             ═════════
```

## Reconciliation to Balance Sheet

### Formula
```
Beginning Cash
+ Cash from Operations
+ Cash from Investing
+ Cash from Financing
─────────────────────
= Ending Cash
```

**Verification**: Ending cash on cash flow statement must equal cash on balance sheet

## Free Cash Flow (Non-GAAP)

### Definition
```
Free Cash Flow = Cash from Operations
               - Capital Expenditures
               - Dividends (optional)
```

### Purpose
Measure of cash available for expansion, debt repayment, or distribution to shareholders

**Note**: This is non-GAAP metric, not reported on statement of cash flows itself

## CPA Exam Tips

### 1. Indirect Method Most Tested
- Start with NI
- Add back noncash expenses (depreciation)
- Adjust for gains/losses on I/F activities
- Adjust for working capital changes

### 2. Working Capital Changes
**Memory Aid**: ALDI
- Assets ↓ = Add
- Liabilities ↑ = Add

**Or Think**:
- If asset ↑, cash ↓ (used cash) → Subtract
- If liability ↑, cash ↑ (deferred payment) → Add

### 3. Gain/Loss Treatment
- Add back **losses**, subtract **gains** (indirect method)
- Full proceeds in investing/financing sections

### 4. Classification
- Interest/dividends RECEIVED + interest PAID = **Operating**
- Dividends PAID = **Financing**
- PPE purchase/sale = **Investing**

### 5. Noncash Transactions
- Disclosed supplementally, **NOT in statement body**

### 6. Common Mistakes
- Wrong direction for working capital changes
- Forgetting to add back depreciation
- Including noncash transactions in statement
- Wrong classification of interest paid (it's operating)

## Common Mistakes

1. **Working capital direction wrong**: Remember ALDI or think about effect on cash

2. **Forgetting depreciation**: Always add back (noncash expense)

3. **Gain/loss confusion**: Gains reduce operating cash (subtract), losses increase (add back)

4. **Interest classification**: Interest PAID is operating (even though seems like financing)

5. **Noncash in body**: Stock dividends, conversions belong in supplemental disclosure only

6. **Not reconciling**: Ending cash must match balance sheet

## Summary

### Key Points

- **Three sections**: Operating, Investing, Financing
- **Indirect method**: Start with NI, adjust for noncash and working capital
- **Add back noncash expenses**: Depreciation, amortization
- **Adjust for gains/losses**: Add losses, subtract gains (indirect)
- **Working capital**: Assets ↑ subtract, ↓ add. Liabilities ↑ add, ↓ subtract
- **Interest/dividends received, interest paid** = Operating
- **Dividends paid** = Financing
- **Noncash transactions**: Supplemental disclosure only
- **Ending cash reconciles** to balance sheet

### Quick Reference

| Adjustment | Add or Subtract from NI? |
|-----------|-------------------------|
| Depreciation | Add |
| Amortization | Add |
| Loss on sale | Add |
| Gain on sale | Subtract |
| AR increase | Subtract |
| AR decrease | Add |
| Inventory increase | Subtract |
| AP increase | Add |
| AP decrease | Subtract |
