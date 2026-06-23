# Governmental Accounting - GASB Standards

## Overview

**Standard Setter**: GASB (Governmental Accounting Standards Board)

**Key Difference from For-Profit**: **Fund accounting** - separate accounting entities for different purposes

**Dual Reporting Perspective**:
1. **Government-wide** financial statements (accrual basis)
2. **Fund** financial statements (mostly modified accrual)

## Fund Categories

### Three Categories of Funds

| Category | Types | Basis | Focus |
|----------|-------|-------|-------|
| **Governmental** | 5 types | Modified accrual | Current financial resources |
| **Proprietary** | 2 types | Full accrual | Economic resources |
| **Fiduciary** | 4 types | Full accrual | Resources held for others |

## Governmental Funds (5 Types)

### Characteristics

**Measurement Focus**: **Current financial resources** (not all economic resources)

**Accounting Basis**: **Modified accrual**

**Statements**:
- Balance Sheet
- Statement of Revenues, Expenditures, and Changes in Fund Balances

### Five Types

**1. General Fund**:
- **Purpose**: Primary operating fund (default fund)
- **Always major fund**: Yes - reported separately
- **Examples**: General government operations, police, fire, administration

**2. Special Revenue Funds**:
- **Purpose**: Specific revenue sources restricted for specific purposes
- **Examples**: Gas tax fund, grants, hotel tax for tourism

**3. Capital Projects Funds**:
- **Purpose**: Construction/acquisition of major capital assets
- **Examples**: New building construction, infrastructure projects

**4. Debt Service Funds**:
- **Purpose**: Accumulate resources for debt principal and interest payments
- **Examples**: Bond principal and interest payments

**5. Permanent Funds**:
- **Purpose**: Earnings (not principal) used for government programs
- **Examples**: Cemetery perpetual care fund, scholarship endowment

## Modified Accrual Basis

### Revenue Recognition

**Rule**: Revenues recognized when **"available and measurable"**

**Available**: Collectible within current period or **soon enough** to pay current liabilities (typically **within 60 days** of year-end)

**Measurable**: Amount can be determined

### Expenditure Recognition

**General Rule**: When **liability incurred** (with exceptions)

### Key Differences from Full Accrual

| Item | Modified Accrual (Gov't Funds) | Full Accrual |
|------|-------------------------------|--------------|
| **Capital asset purchase** | **Expenditure** | Capitalize as asset |
| **Depreciation** | **NOT recorded** | Record depreciation expense |
| **Debt proceeds** | **Other Financing Source** | Liability |
| **Debt principal payment** | **Expenditure** | Reduce liability |
| **Interest on long-term debt** | Expenditure **when due** | Accrue interest expense |

### Example Entries - Modified Accrual

**Purchase Equipment for $100,000**:
```
DR Expenditures - Capital Outlay    $100,000
   CR Cash                                   $100,000

(Equipment NOT capitalized in governmental fund)
```

**Issue Bonds for $1,000,000**:
```
DR Cash                            $1,000,000
   CR Other Financing Sources - Bonds       $1,000,000

(Bonds NOT recorded as liability in governmental fund)
```

**Pay Bond Principal $50,000**:
```
DR Expenditures - Debt Service        $50,000
   CR Cash                                    $50,000
```

## Proprietary Funds (2 Types)

### Characteristics

**Measurement Focus**: **Economic resources** (all assets and liabilities)

**Accounting Basis**: **Full accrual** (like commercial accounting)

**Statements**:
- Statement of Net Position (like balance sheet)
- Statement of Revenues, Expenses, and Changes in Net Position (like income statement)
- **Statement of Cash Flows** (required)

### Two Types

**1. Enterprise Funds**:
- **Purpose**: Business-type activities (fees charged to external users)
- **Examples**: Water/sewer utility, parking garages, airports, golf courses
- **Accounting**: Like a business - capitalize assets, depreciate, accrue liabilities

**2. Internal Service Funds**:
- **Purpose**: Services provided to other government departments
- **Examples**: Motor pool, IT services, self-insurance, central purchasing
- **Accounting**: Full accrual
- **Government-wide treatment**: Typically included in **governmental activities**

## Fiduciary Funds (4 Types)

### Characteristics

**Purpose**: Resources **held for others** (not for government's own programs)

**Basis**: Full accrual

**Government-wide**: **NOT included** (resources don't belong to government)

### Four Types

1. **Pension Trust Funds**: Employee pension plans
2. **Investment Trust Funds**: External investment pools
3. **Private-Purpose Trust Funds**: Scholarships, other trusts benefiting individuals
4. **Custodial Funds**: Temporary holdings (taxes collected for other governments)

## Government-Wide Financial Statements

### Basis and Focus

**Accounting Basis**: **Full accrual**

**Measurement Focus**: **Economic resources**

### Two Statements

**1. Statement of Net Position** (like balance sheet):
- **Columns**: Governmental Activities | Business-Type Activities | Total
- **Reports**: All assets, liabilities (including long-term), net position

**2. Statement of Activities** (like income statement):
- **Format**: By function (public safety, education, etc.)
- **Shows**: Revenues netted against expenses by function

### What's Included

**Governmental Activities**: Derived from governmental funds (plus adjustments)
- Capital assets capitalized
- Long-term debt reported
- Depreciation recorded

**Business-Type Activities**: Enterprise funds

**NOT Included**: Fiduciary funds (held for others)

**Internal Service Funds**: Typically included in governmental activities

### Reconciliation Required

Must reconcile between:
- **Fund statements** (modified accrual for governmental funds)
- **Government-wide statements** (full accrual)

**Major reconciling items**:
- Capital assets (not in fund BS, but in government-wide)
- Long-term debt (not in fund BS, but in government-wide)
- Depreciation (not in fund statements, but in government-wide)

## Fund Balance Classifications

### Applies To

**Governmental funds only** (not proprietary or fiduciary)

### Five Classifications (Hierarchy)

**Listed from most to least restricted**:

**1. Nonspendable**:
- **Cannot be spent** due to form
- **Examples**: Inventory, prepaid items, permanent fund principal
- **Constraint**: Form of asset

**2. Restricted**:
- **Externally imposed** constraints
- **Sources**: Laws, grantors, creditors, enabling legislation
- **Example**: Grant funds that must be used for specific program
- **Constraint**: External

**3. Committed**:
- **Self-imposed** by highest level of government
- **Examples**: City council resolution committing funds for project
- **Constraint**: Internal - high level (requires same level action to remove)

**4. Assigned**:
- **Intended** for specific purpose (less formal than committed)
- **Examples**: Funds set aside by management for future purchase
- **Constraint**: Internal - lower level

**5. Unassigned**:
- **Residual** classification
- **Only in General Fund** can have positive unassigned balance
- **Other funds**: Can have negative unassigned (deficit)
- **Constraint**: None

### Mnemonic

**N-R-C-A-U**: Nonspendable, Restricted, Committed, Assigned, Unassigned

### Spending Order

When expenditure incurred, spend in this order (unless policy specifies otherwise):
1. Restricted
2. Committed
3. Assigned
4. Unassigned

## Major Revenue Sources

### Property Taxes

**Recognition (Modified Accrual)**:
- When **levied** and **available**
- Adjust for uncollectible amounts
- Amounts not available within 60 days → **Deferred Inflows**

**Entry**:
```
DR Property Tax Receivable           $1,000,000
   CR Allowance for Uncollectible          $50,000
   CR Property Tax Revenue                 900,000
   CR Deferred Inflows of Resources         50,000

(Amounts not available within 60 days deferred)
```

### Sales Taxes

**Recognition**: When underlying transaction occurs if measurable and available

**Often**: Collected by state and remitted to locality

### Intergovernmental Revenues

**Grants and shared revenues**

**Recognition**: **Eligibility requirements** must be met

**Types**:
- **Reimbursement grants**: Recognize revenue when eligible expenditures incurred
- **Entitlement grants**: Recognize when time requirement met

### Charges for Services

**Recognition**: When service provided (in enterprise funds - full accrual)

## Capital Assets

### Governmental Funds

Capital outlays recorded as **Expenditures** (NOT capitalized in fund statements)

**Entry**:
```
DR Expenditures - Capital Outlay      $XXX
   CR Cash                                  $XXX
```

**No depreciation** in governmental fund statements

### Government-Wide Statements

Capital assets **capitalized and depreciated**

**Infrastructure** (roads, bridges):
- Capitalize and depreciate, OR
- Use "modified approach" (condition assessment without depreciation)

## Long-Term Debt

### Governmental Funds

**Issuance**: Other Financing Source (like revenue)
```
DR Cash                               $XXX
   CR Other Financing Sources              $XXX
```

**Principal Payment**: Expenditure
```
DR Expenditures - Debt Service        $XXX
   CR Cash                                  $XXX
```

**Balance**: NOT reported in fund balance sheet

### Government-Wide Statements

Long-term debt **reported as liability**

### Proprietary Funds

Long-term debt **reported as liability** (full accrual)

## Interfund Transactions

### Three Types

**1. Interfund Loans**:
- **Treatment**: Receivable/Payable (Due from/Due to)
- **Expected repayment**: Short-term

**2. Interfund Transfers**:
- **Treatment**: Operating Transfers In/Out (or just "Transfers")
- **One-way**: Not expected to be repaid
- **Examples**: Transfer from General Fund to Debt Service Fund

**3. Interfund Services**:
- **Treatment**: Expenditure/Revenue (quasi-external transaction)
- **Example**: General Fund pays Internal Service Fund for IT services

## CPA Exam Tips

### 1. Fund Identification

**Governmental**: Modified accrual, current resources, 5 types

**Proprietary**: Full accrual, economic resources, 2 types (Enterprise, Internal Service)

**Fiduciary**: Full accrual, held for others, NOT in government-wide

### 2. Modified Accrual Key Points

- **Revenue**: Available + Measurable
- **Expenditure**: When liability incurred
- **Capital purchases**: Expenditures (not capitalized)
- **No depreciation**: In governmental funds

### 3. Fund Balance Hierarchy

**Mnemonic**: N-R-C-A-U
- Nonspendable, Restricted, Committed, Assigned, Unassigned

### 4. Government-Wide

- **Full accrual**: Capital assets capitalized, long-term debt reported
- **Reconcile** to fund statements

### 5. Common Tested

- Modified accrual revenue recognition
- Fund balance classifications
- Reconciliation between fund and government-wide statements
- Capital assets and long-term debt treatment differences

## Common Mistakes

1. **Capitalizing assets in governmental funds**: Should be expenditure

2. **Recording debt as liability in governmental funds**: Should be Other Financing Source

3. **Depreciating in governmental funds**: No depreciation in governmental funds

4. **Including fiduciary funds in government-wide**: They're excluded

5. **Wrong fund balance classification order**: Remember N-R-C-A-U

6. **Forgetting "available" for revenue recognition**: Must be collectible within 60 days

## Summary

### Key Points

**Fund Categories**:
- **Governmental** (5 types): Modified accrual, current resources
- **Proprietary** (2 types): Full accrual, economic resources
- **Fiduciary** (4 types): Full accrual, held for others (NOT in government-wide)

**Modified Accrual**:
- Revenue: **Available + Measurable**
- Capital purchases = **Expenditures**
- Debt proceeds = **Other Financing Sources**
- **No depreciation** in governmental funds

**Government-Wide**:
- **Full accrual**: Capitalizes assets, reports long-term debt
- Reconcile to fund statements

**Fund Balance**:
- **N-R-C-A-U** hierarchy: Nonspendable → Restricted → Committed → Assigned → Unassigned

**General Fund**:
- Always major fund
- Primary operating fund

### Quick Reference

**Modified Accrual vs. Full Accrual**:

| Item | Modified Accrual | Full Accrual |
|------|------------------|--------------|
| Capital purchase | Expenditure | Capitalize |
| Depreciation | Not recorded | Record |
| Debt proceeds | Other Financing Source | Liability |
| Debt payment | Expenditure | Reduce liability |
| Interest | When due | Accrue |

**Fund Types Summary**:

- **Governmental** (5): General, Special Revenue, Capital Projects, Debt Service, Permanent
- **Proprietary** (2): Enterprise, Internal Service
- **Fiduciary** (4): Pension Trust, Investment Trust, Private-Purpose Trust, Custodial
