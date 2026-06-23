# Inventory Estimation Methods

## Overview

When physical counts are impractical or impossible, two estimation methods are available:
1. **Gross Profit Method**
2. **Retail Inventory Method**

## Gross Profit Method

### Purpose
Estimate ending inventory when physical count unavailable:
- Insurance claims (fire, theft)
- Interim period estimates
- Test reasonableness of physical count

### Formula
```
Sales                           $XXX
× Gross Profit %                × XX%
─────────────────────────────────────
Estimated Gross Profit          $XXX

Sales                           $XXX
- Estimated Gross Profit        (XXX)
─────────────────────────────────────
Estimated Cost of Goods Sold    $XXX

Beginning Inventory             $XXX
+ Purchases                      XXX
─────────────────────────────────────
Goods Available                 $XXX
- Estimated COGS                (XXX)
─────────────────────────────────────
Estimated Ending Inventory      $XXX
```

### Key Point
Can use either:
- **Gross profit percentage** on sales, OR
- **Markup percentage** on cost

### Converting Between Percentages

**From Markup on Cost to GP%**:
```
If markup on cost = 25%
Cost = $100, Selling Price = $125

GP% = $25 / $125 = 20%
```

**Formula**:
```
GP% = Markup on Cost / (1 + Markup on Cost)
```

### Example - Gross Profit Method

**Facts**:
- Beginning inventory: $50,000
- Purchases: $200,000
- Sales: $300,000
- Historical gross profit: 40% of sales

**Calculation**:
```
Sales                           $300,000
× GP%                           × 40%
─────────────────────────────────────────
Estimated Gross Profit          $120,000

Sales                           $300,000
- Estimated Gross Profit        (120,000)
─────────────────────────────────────────
Estimated COGS                  $180,000

Beginning Inventory             $ 50,000
+ Purchases                      200,000
─────────────────────────────────────────
Goods Available                 $250,000
- Estimated COGS                (180,000)
─────────────────────────────────────────
Estimated Ending Inventory      $ 70,000
```

### Example - Using Markup on Cost

**Facts**:
- Beginning inventory: $40,000
- Purchases: $160,000
- Sales: $250,000
- Historical markup: 25% on cost

**Step 1: Convert to GP%**:
```
GP% = 25% / (1 + 25%) = 25% / 125% = 20%
```

**Step 2: Calculate**:
```
Sales                           $250,000
× GP%                           × 20%
─────────────────────────────────────────
Estimated Gross Profit          $ 50,000

Sales                           $250,000
- Estimated Gross Profit         (50,000)
─────────────────────────────────────────
Estimated COGS                  $200,000

Beginning Inventory             $ 40,000
+ Purchases                      160,000
─────────────────────────────────────────
Goods Available                 $200,000
- Estimated COGS                (200,000)
─────────────────────────────────────────
Estimated Ending Inventory      $      0
```

## Retail Inventory Method

### Purpose
Used by retailers to estimate inventory at cost using retail prices

### Approach
1. Track inventory at both **cost** and **retail**
2. Calculate **cost-to-retail ratio**
3. Apply ratio to ending inventory at retail

### Basic Formula
```
                            Cost        Retail
Beginning Inventory         $XXX        $XXX
+ Purchases (net)            XXX         XXX
─────────────────────────────────────────────
Goods Available             $XXX        $XXX

Cost-to-Retail Ratio = Cost / Retail

Sales at Retail                         (XXX)
─────────────────────────────────────────────
Ending Inventory at Retail              $XXX

Ending Inventory at Cost = Ending Retail × Cost-to-Retail Ratio
```

### Variations

| Method | Treatment in Ratio | Approximates |
|--------|-------------------|--------------|
| **Conventional (LCM)** | Include markups, EXCLUDE markdowns | Lower of Cost or Market |
| **Average Cost** | Include markups AND markdowns | Average Cost |
| **FIFO** | Exclude beginning inventory from ratio | FIFO Cost |
| **LIFO** | Calculate for current year only | LIFO Cost |

### Example - Conventional Retail (LCM)

**Facts**:
```
                            Cost        Retail
Beginning Inventory         $30,000     $ 50,000
Purchases                    90,000      150,000
Markups (net)                    -       10,000
Markdowns (net)                  -       (5,000)
Sales                            -     (160,000)
```

**Calculation**:
```
                            Cost        Retail
Beginning Inventory         $30,000     $ 50,000
+ Purchases                  90,000      150,000
+ Net Markups                     -       10,000
─────────────────────────────────────────────────
Goods Available (for ratio) $120,000    $210,000

Cost-to-Retail Ratio = $120,000 / $210,000 = 57.14%

                            Cost        Retail
Goods Available             $120,000    $210,000
+ Net Markdowns                   -      (5,000)
─────────────────────────────────────────────────
Goods Available (total)     $120,000    $205,000
- Sales                           -    (160,000)
─────────────────────────────────────────────────
Ending Inventory at Retail              $ 45,000

Ending Inventory at Cost = $45,000 × 57.14% = $25,713
```

### Example - Average Cost Method

**Facts**: Same as above

**Difference**: Include markdowns in ratio calculation

**Calculation**:
```
                            Cost        Retail
Beginning Inventory         $30,000     $ 50,000
+ Purchases                  90,000      150,000
+ Net Markups                     -       10,000
+ Net Markdowns                   -       (5,000)
─────────────────────────────────────────────────
Goods Available             $120,000    $205,000

Cost-to-Retail Ratio = $120,000 / $205,000 = 58.54%

Ending Inventory at Retail              $ 45,000
× Cost-to-Retail Ratio                  × 58.54%
─────────────────────────────────────────────────
Ending Inventory at Cost                $ 26,343
```

## Special Adjustments

### Freight-In
Add to **cost** column only

### Purchase Returns
Subtract from both cost and retail

### Purchase Discounts
Subtract from **cost** column only

### Employee Discounts
Subtract from **retail** (sales) column

### Normal Shrinkage/Spoilage
Subtract from **retail** column before calculating ending inventory

### Abnormal Shrinkage/Loss
Subtract from both cost and retail

## CPA Exam Tips

### Gross Profit Method

1. **Watch for markup vs. GP%**:
   - Markup on cost must be converted
   - Formula: `GP% = Markup / (1 + Markup)`

2. **Common structure**:
   - Start with sales
   - Calculate estimated GP
   - Back into estimated COGS
   - Use basic inventory formula

3. **Use cases**:
   - Insurance claims
   - Interim estimates
   - Audit testing

### Retail Inventory Method

1. **Know the variations**:
   - Conventional (LCM): Exclude markdowns from ratio
   - Average cost: Include markdowns in ratio
   - Key difference is markdown treatment

2. **Cost-to-Retail Ratio**:
   - Always cost divided by retail
   - Be careful what to include in denominator

3. **Markups vs. Markdowns**:
   - Markups = Increases in selling price above original
   - Markdowns = Decreases in selling price below original
   - **Net** amounts (after cancellations)

4. **Two-step calculation**:
   - Step 1: Calculate ratio (may exclude markdowns)
   - Step 2: Calculate ending retail (include all adjustments)

5. **Common tested**:
   - Conventional retail method (most common)
   - Converting markup to GP%
   - Handling abnormal shrinkage

## Common Mistakes

### Gross Profit Method

1. **Using markup on cost as GP%**: Must convert first

2. **Wrong formula direction**:
   - Don't multiply COGS by GP% to get sales
   - Multiply sales by GP% to get GP

3. **Forgetting basic inventory equation**:
   - BI + Purchases - COGS = EI

### Retail Inventory Method

1. **Including markdowns in conventional method ratio**:
   - Should EXCLUDE for LCM approximation

2. **Calculating ratio wrong**:
   - Must be cost / retail (not retail / cost)

3. **Forgetting to include all items in ending retail**:
   - Markdowns affect ending inventory calculation

4. **Misclassifying adjustments**:
   - Freight-in: Cost only
   - Employee discounts: Retail (sales) only
   - Purchase discounts: Cost only

## Summary

### Key Formulas

**Gross Profit Method**:
```
COGS = Sales × (1 - GP%)
or
COGS = Sales - (Sales × GP%)

Ending Inventory = BI + Purchases - COGS
```

**GP% Conversion**:
```
GP% = Markup on Cost / (1 + Markup on Cost)
```

**Retail Inventory Method**:
```
Cost-to-Retail Ratio = Cost / Retail

Ending Inventory at Cost = Ending Retail × Ratio
```

### Quick Reference

| Method | When Used | Key Feature |
|--------|-----------|-------------|
| **Gross Profit** | No physical count, interim periods | Uses historical GP% |
| **Retail (Conventional)** | Retailers, LCM approximation | Exclude markdowns from ratio |
| **Retail (Average)** | Retailers, average cost | Include markdowns in ratio |

### Key Points

- **Gross Profit Method**: Quick estimate using historical relationships
- **Retail Method**: More precise, requires detailed retail records
- **Conventional Retail**: Most conservative (LCM), exclude markdowns from ratio
- **Markup ≠ GP%**: Must convert if given markup on cost
- **Cost-to-Retail Ratio**: Foundation of retail inventory method
