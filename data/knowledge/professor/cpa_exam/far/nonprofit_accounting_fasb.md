# Nonprofit Accounting - FASB Standards

## Overview

**Standard Setter**: FASB (same as for-profit entities, but with special nonprofit guidance)

**Accounting Basis**: **Full accrual** (like for-profit)

**Key Difference**: Focus on **NET ASSETS** (not equity), classified by **donor restrictions**

**No Fund Accounting**: Unlike government, nonprofits use **single entity approach** (not fund accounting)

## Financial Statements

### Four Required Statements

**1. Statement of Financial Position** (Balance Sheet):
- **Assets** and **Liabilities** (like for-profit)
- **Net Assets** (instead of equity):
  - Without Donor Restrictions
  - With Donor Restrictions

**2. Statement of Activities** (Income Statement):
- Shows **changes in net assets** by class
- **Revenues** and **Expenses**
- Displays activities for each net asset class

**3. Statement of Cash Flows**:
- Required (similar to for-profit)
- Can use direct or indirect method

**4. Statement of Functional Expenses**:
- **Required for**: Voluntary Health & Welfare Organizations (VHWOs)
- **Optional for**: Other nonprofits
- Shows expenses by **function AND nature** (matrix format)

## Net Asset Classifications

### Two Classes (ASU 2016-14)

**1. Without Donor Restrictions**:
- **Description**: No donor-imposed restrictions
- **Formerly**: "Unrestricted net assets"
- **Includes**:
  - Unrestricted contributions
  - Earned revenues (fees, sales)
  - Board-designated funds (board can change designation)
- **Note**: Board designations ≠ restrictions (board can remove anytime)

**2. With Donor Restrictions**:
- **Description**: Donor-imposed restrictions (purpose or time)
- **Formerly**: "Temporarily restricted" and "Permanently restricted" (now combined)
- **Three Types**:

  **a. Purpose Restrictions**:
  - Must be used for specific program/purpose
  - Example: Donation for education program

  **b. Time Restrictions**:
  - Cannot be used until future period
  - Example: Pledge payable in 3 years

  **c. Perpetual Restrictions**:
  - Endowments - maintain principal forever
  - Only earnings may be spent
  - Example: $1M endowment principal must remain intact

### Release from Restrictions

**When**: Purpose accomplished OR time requirement met

**Accounting**: Reclassify from "with restrictions" to "without restrictions"

**Entry** (on Statement of Activities):
```
Net Assets Released from Restrictions:
  DR With Donor Restrictions       $(XXX)
  CR Without Donor Restrictions     XXX
```

## Contributions

### Definition

**Contribution**: Unconditional transfer of cash or other assets (or settlement of liabilities) to nonprofit

### Recognition Rule

Recognize revenue when **RECEIVED** or **UNCONDITIONALLY PROMISED**

### Conditional vs. Unconditional Promises

**Critical Distinction**: Determines WHEN to recognize revenue

#### Unconditional Promise

**Recognition**: **Immediately** as contribution revenue and receivable

**Characteristics**:
- No barriers to overcome
- Commitment is firm

**Example**:
- Donor promises $100,000 payable in 3 years
- **Recognition**: NOW (at present value)

#### Conditional Promise

**Recognition**: Do **NOT** recognize until **condition substantially met**

**Indicators of Condition**:
- **Barrier** that must be overcome
- **Right of return** or release from obligation if barrier not overcome
- **Key words**: "when," "if," "matching requirement"

**Examples**:
- "Donate $100K **if** nonprofit raises matching $100K from others"
  - **Conditional** - recognize when match achieved
- "Grant $50K **when** you complete the research project"
  - **Conditional** - recognize when project complete

### Classification

**Without donor restrictions**:
- No donor-imposed restrictions
- Can be used for any purpose

**With donor restrictions**:
- Purpose restriction (specific program)
- Time restriction (future period)
- Perpetual restriction (endowment)

### Multiyear Pledges

**Present Value**: Record at **PV** of future cash flows

**Discount**: Recognize contribution revenue discount as revenue over time

**Example**:
- $100,000 pledge payable in 3 years
- Discount rate: 5%
- PV = $86,384

**Entry Year 1**:
```
DR Pledge Receivable              $100,000
   CR Contribution Revenue - With Restrictions  $86,384
   CR Discount on Pledge Receivable             13,616
```

**Each year**: Amortize discount as additional contribution revenue

## Restrictions and Releases - Examples

### Example 1: Purpose Restriction

**Facts**: Donor gives $50,000 for education program

**Initial Receipt**:
```
DR Cash                                    $50,000
   CR Contribution Revenue - With Restrictions    $50,000

(Purpose: education program)
```

**When Spent on Education Program**:
```
Statement of Activities shows:
  Net Assets Released - With Restrictions    $(50,000)
  Net Assets Released - Without Restrictions   50,000

DR Program Expense - Education             $50,000
   CR Cash                                         $50,000
```

### Example 2: Time Restriction

**Facts**: Donor pledges $30,000 for next year's operations

**Receipt This Year**:
```
DR Cash                                    $30,000
   CR Contribution Revenue - With Restrictions    $30,000

(Time restriction: next year)
```

**Next Year** (when time passes):
```
Statement of Activities shows:
  Net Assets Released - With Restrictions    $(30,000)
  Net Assets Released - Without Restrictions   30,000
```

### Example 3: Perpetual Endowment

**Facts**: Donor gives $1,000,000 endowment. Principal must remain intact. Earnings unrestricted.

**Receipt**:
```
DR Cash                                 $1,000,000
   CR Contribution Revenue - With Restrictions   $1,000,000

(Perpetual restriction)
```

**Investment Earnings** (assume $40,000):
```
DR Cash                                    $40,000
   CR Investment Income - Without Restrictions    $40,000

(Earnings unrestricted per donor specification)
```

**Principal**: **NEVER released** (perpetual restriction)

## Donated Services

### Recognition Criteria

Recognize as **contribution revenue** and **expense** if **EITHER**:

1. **Create or enhance nonfinancial assets**, OR
2. **Require specialized skills** + Provided by individuals **possessing those skills** + Would **typically need to be purchased** if not donated

### Examples

**Recognize**:
- ✓ Doctor providing medical services
- ✓ Accountant performing audit
- ✓ Carpenter building facility
- ✓ Lawyer providing legal counsel

**Do NOT Recognize**:
- ✗ General volunteers stuffing envelopes
- ✗ Board members' unpaid time
- ✗ Volunteers providing routine tasks

### Measurement

At **fair value** of services

### Journal Entry

```
DR Expense (or Asset if creating asset)    $XXX
   CR Contribution Revenue - Donated Services    $XXX
```

### Example

**Facts**: Accountant donates 100 hours of audit services. Normal billing rate: $150/hour.

**Entry**:
```
DR Professional Fees Expense           $15,000
   CR Contribution Revenue - Donated Services   $15,000

(100 hours × $150 = $15,000)
```

## Donated Assets

### Cash

Contribution revenue at amount received

### Noncash Assets

Contribution revenue at **fair value** of asset received

### Example

**Donor gives land (FV $200,000)**:
```
DR Land                                $200,000
   CR Contribution Revenue                      $200,000

(Classify based on any restrictions)
```

## Functional Expense Classification

### Three Categories

**1. Program Services**:
- **Description**: Activities that fulfill organization's mission
- **Examples**: Educational programs, medical services, research, social services
- **Typically**: Majority of expenses

**2. Management and General**:
- **Description**: Oversight and administration
- **Examples**: Executive salaries, accounting, HR, board meetings
- **Also called**: Supporting services

**3. Fundraising**:
- **Description**: Soliciting contributions
- **Examples**: Fundraising events, donor cultivation, grant writing, donor communications

### Allocation

**Expenses serving multiple functions** must be allocated using **reasonable basis**

**Example**: Executive Director spends:
- 60% on program activities
- 30% on management
- 10% on fundraising

**Allocate salary** based on time spent in each function

### Statement of Functional Expenses

**Format**: Matrix showing expenses by **BOTH**:
- **Function** (rows): Program, Management, Fundraising
- **Nature** (columns): Salaries, Rent, Supplies, etc.

**Required for**: Voluntary Health & Welfare Organizations

**Optional for**: Other nonprofits

## Special Events

### Accounting Approaches

**Goal**: Separate **contribution portion** from **exchange transaction portion**

### Gross Method

**Report**:
- Gross revenues
- Gross expenses
- Net shown

**Example**:
- Fundraising gala raises $100,000
- Costs: $30,000
- **Report**: $100,000 revenue, $30,000 fundraising expense
- **Net**: $70,000

### Exchange Transactions

If attendees receive **commensurate value** (e.g., dinner worth ticket price):
- That portion is **exchange transaction** (not contribution)
- Report separately or net

**Example**:
- Ticket: $500
- Dinner value: $200
- **Contribution portion**: $300
- **Exchange portion**: $200

## Statement of Activities Format

### Columns

| Without Donor Restrictions | With Donor Restrictions | Total |
|----------------------------|-------------------------|-------|

### Typical Format

```
Revenues:
  Contributions                              $XXX    $XXX    $XXX
  Grants                                      XXX     XXX     XXX
  Program service fees                        XXX      -      XXX
  Investment income                           XXX     XXX     XXX
  Other revenues                              XXX      -      XXX
  Net assets released from restrictions       XXX    (XXX)     -
                                            ─────   ─────   ─────
  Total revenues                             $XXX    $XXX    $XXX

Expenses:
  Program services                            XXX      -      XXX
  Management and general                      XXX      -      XXX
  Fundraising                                 XXX      -      XXX
                                            ─────   ─────   ─────
  Total expenses                              XXX      -      XXX
                                            ─────   ─────   ─────
Change in Net Assets                         $XXX    $XXX    $XXX

Net Assets, beginning of year                XXX     XXX     XXX
                                            ─────   ─────   ─────
Net Assets, end of year                     $XXX    $XXX    $XXX
                                            ═════   ═════   ═════
```

## Endowments

### Types

**1. True Endowment**:
- **Donor-imposed perpetual restriction** on principal
- Only earnings may be spent (per donor or policy)
- **Classification**: With Donor Restrictions (perpetual)

**2. Board-Designated Endowment**:
- **Board sets aside** funds to function as endowment
- Board can change designation anytime
- **Classification**: **Without Donor Restrictions** (no donor restriction exists)

### Investment Returns

Classify based on donor restriction on endowment:
- If true endowment with **no restriction on earnings** → Earnings are **without restrictions**
- If donor **restricts earnings** to specific purpose → Earnings are **with restrictions**

## CPA Exam Tips

### 1. Net Assets

**Two classes**: Without restrictions, With restrictions

**Release**: When purpose/time met, reclassify to without restrictions

### 2. Conditional vs. Unconditional

**Conditional** (barrier, right of return):
- Do **NOT** recognize until condition met

**Unconditional**:
- Recognize **immediately** (even if future payment)

### 3. Donated Services

**Recognize if**:
- Create/enhance assets, OR
- Specialized skill + typically purchased

**At fair value**

### 4. Functional Expenses

**Three functions**: Program, Management & General, Fundraising

Must allocate shared expenses

### 5. Common Tested

- Net asset classification
- Conditional promises (when to recognize)
- Donated services recognition criteria
- Functional expense allocation

## Common Mistakes

1. **Board designation = restriction**: Board designation is NOT a donor restriction (still "without restrictions")

2. **Recognizing conditional contributions too early**: Must wait until condition substantially met

3. **Not recognizing qualified donated services**: Specialized skills + typically purchased = recognize

4. **Forgetting to release restrictions**: When purpose/time met, must reclassify

5. **Endowment classification**: True endowment = with restrictions. Board-designated = without restrictions.

## Summary

### Key Points

**Net Assets**:
- **Two classes**: Without donor restrictions, With donor restrictions
- **Release** when purpose/time met

**Contributions**:
- Recognize when **received** or **unconditionally promised**
- **Conditional**: Don't recognize until condition met
- **Multiyear pledges**: At present value

**Donated Services**:
- Recognize if **specialized + typically purchased** OR **create/enhance assets**
- At **fair value**

**Functional Expenses**:
- **Program**, **Management & General**, **Fundraising**
- Allocate shared expenses
- Matrix statement required for VHWOs

**Endowments**:
- **True**: Donor restriction (perpetual) - **with restrictions**
- **Board-designated**: No donor restriction - **without restrictions**

### Quick Reference

**Conditional vs. Unconditional**:
- **Unconditional** → Recognize now
- **Conditional** (barrier/right of return) → Wait until met

**Donated Services Recognition**:
- Specialized + typically purchased? → **YES**
- Create/enhance assets? → **YES**
- General volunteer time? → **NO**
