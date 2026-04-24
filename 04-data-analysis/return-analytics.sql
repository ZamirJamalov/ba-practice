-- =============================================================================
-- RETURN ANALYTICS — Product Return Process
-- Electronics Retail Company (Sample Data)
-- =============================================================================
-- These queries demonstrate how a BA uses SQL to analyze return data
-- and provide data-driven recommendations to business stakeholders.
-- =============================================================================

-- =============================================================================
-- SAMPLE DATABASE SCHEMA
-- =============================================================================
-- returns (
--   return_id        VARCHAR(20) PRIMARY KEY,
--   order_id         VARCHAR(20),
--   customer_name    VARCHAR(100),
--   customer_phone   VARCHAR(20),
--   product_id       VARCHAR(10),
--   product_name     VARCHAR(200),
--   category         VARCHAR(50),
--   return_reason    VARCHAR(50),
--   status           VARCHAR(30),
--   request_date     DATE,
--   completed_date   DATE,
--   refund_amount    DECIMAL(10,2),
--   store_id         VARCHAR(10),
--   store_location   VARCHAR(100)
-- )
--
-- return_items (
--   item_id          INT PRIMARY KEY,
--   return_id        VARCHAR(20),
--   product_id       VARCHAR(10),
--   quantity         INT,
--   condition_notes  VARCHAR(200),
--   inspection_result VARCHAR(30)
-- )
--
-- users (
--   user_id          INT PRIMARY KEY,
--   full_name        VARCHAR(100),
--   role             VARCHAR(30),
--   department       VARCHAR(50)
-- )

-- =============================================================================
-- QUERY 1: Monthly Return Volume Trend (Last 6 Months)
-- Business Question: "How many returns do we process per month?"
-- Used for: Stakeholder presentation to justify digitization investment
-- =============================================================================

SELECT
    TO_CHAR(request_date, 'YYYY-MM')     AS month,
    COUNT(*)                              AS total_returns,
    COUNT(DISTINCT customer_name)         AS unique_customers,
    ROUND(SUM(refund_amount), 2)          AS total_refund_amount,
    ROUND(AVG(refund_amount), 2)          AS avg_refund_amount
FROM returns
WHERE request_date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '6 months')
GROUP BY TO_CHAR(request_date, 'YYYY-MM')
ORDER BY month DESC;

-- Expected Output:
-- | month    | total_returns | unique_customers | total_refund_amount | avg_refund |
-- |----------|---------------|------------------|---------------------|------------|
-- | 2026-04  | 87            | 73               | 42,350.00           | 486.78     |
-- | 2026-03  | 94            | 81               | 51,200.00           | 544.68     |
-- | 2026-02  | 102           | 88               | 55,800.00           | 547.06     |
-- | 2026-01  | 78            | 65               | 38,900.00           | 498.72     |
-- | 2025-12  | 115           | 96               | 62,400.00           | 542.61     |
-- | 2025-11  | 91            | 78               | 48,700.00           | 535.16     |


-- =============================================================================
-- QUERY 2: Top 5 Product Categories by Return Rate
-- Business Question: "Which categories have the highest return rates?"
-- Used for: Identifying product quality issues and informing procurement
-- =============================================================================

SELECT
    r.category,
    COUNT(*)                              AS return_count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2)
                                           AS return_percentage,
    ROUND(SUM(r.refund_amount), 2)        AS total_refund,
    COUNT(CASE WHEN r.inspection_result = 'DEFECTIVE' THEN 1 END) AS defective_count
FROM returns r
WHERE r.request_date >= CURRENT_DATE - INTERVAL '3 months'
GROUP BY r.category
ORDER BY return_count DESC
LIMIT 5;

-- Expected Output:
-- | category            | return_count | return_pct | total_refund | defective |
-- |---------------------|--------------|------------|--------------|-----------|
-- | Smartphones         | 45           | 18.75      | 35,600.00    | 12        |
-- | Large Appliances    | 38           | 15.83      | 28,400.00    | 8         |
-- | Small Appliances    | 34           | 14.17      | 12,300.00    | 6         |
-- | TV & Audio          | 29           | 12.08      | 18,900.00    | 5         |
-- | Accessories         | 25           | 10.42      | 5,200.00     | 2         |


-- =============================================================================
-- QUERY 3: Return Processing Time Analysis
-- Business Question: "How long does it take to process a return on average?"
-- Used for: Measuring current process efficiency (baseline for digitization)
-- =============================================================================

SELECT
    status,
    COUNT(*)                              AS count,
    ROUND(AVG(completed_date - request_date), 1) AS avg_days_to_complete,
    ROUND(MAX(completed_date - request_date), 0) AS max_days,
    ROUND(MIN(completed_date - request_date), 0) AS min_days
FROM returns
WHERE status IN ('REFUNDED', 'REJECTED', 'CLOSED')
  AND request_date >= CURRENT_DATE - INTERVAL '3 months'
GROUP BY status
ORDER BY avg_days_to_complete DESC;

-- Expected Output:
-- | status   | count | avg_days | max_days | min_days |
-- |----------|-------|----------|----------|----------|
-- | REFUNDED | 189   | 8.3      | 22       | 3        |
-- | REJECTED | 14    | 5.1      | 12       | 1        |
-- | CLOSED   | 7     | 15.2     | 28       | 7        |


-- =============================================================================
-- QUERY 4: Return Reason Distribution
-- Business Question: "Why are customers returning products?"
-- Used for: Identifying root causes and informing business improvement
-- =============================================================================

SELECT
    return_reason,
    COUNT(*)                              AS count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2)
                                           AS percentage
FROM returns
WHERE request_date >= CURRENT_DATE - INTERVAL '6 months'
GROUP BY return_reason
ORDER BY count DESC;

-- Expected Output:
-- | return_reason          | count | percentage |
-- |------------------------|-------|------------|
-- | DEFECTIVE              | 98    | 20.58      |
-- | WRONG_ITEM_DELIVERED   | 82    | 17.23      |
-- | NOT_AS_DESCRIBED       | 71    | 14.92      |
-- | CHANGED_MIND           | 65    | 13.66      |
-- | DAMAGED_DELIVERY       | 58    | 12.18      |
-- | WARRANTY_CLAIM         | 52    | 10.92      |
-- | OTHER                  | 50    | 10.50      |


-- =============================================================================
-- QUERY 5: Store-wise Return Performance
-- Business Question: "Which stores have the highest return volumes?"
-- Used for: Identifying stores that need process improvement or training
-- =============================================================================

SELECT
    store_location,
    COUNT(*)                              AS total_returns,
    ROUND(SUM(refund_amount), 2)         AS total_refund,
    ROUND(AVG(completed_date - request_date), 1) AS avg_processing_days
FROM returns
WHERE request_date >= CURRENT_DATE - INTERVAL '3 months'
  AND status IN ('REFUNDED', 'REJECTED', 'CLOSED')
GROUP BY store_location
ORDER BY total_returns DESC;

-- Expected Output:
-- | store_location    | total_returns | total_refund | avg_days |
-- |-------------------|---------------|--------------|----------|
-- | Baku - 28 Mall    | 62            | 38,200.00    | 7.2      |
-- | Baku - Ganjlik    | 48            | 28,900.00    | 8.5      |
-- | Baku - Park Bulvar| 41            | 24,100.00    | 9.1      |
-- | Sumgait            | 22            | 12,800.00    | 10.3     |
-- | Ganja              | 18            | 10,500.00    | 11.2     |


-- =============================================================================
-- BUSINESS RECOMMENDATIONS (based on analysis)
-- =============================================================================
-- 1. Smartphones have highest return rate (18.75%) with 12 defective units
--    → Recommend: Tighter quality check with suppliers before shelf placement
--
-- 2. Average processing time is 8.3 days for refunds, 15.2 days for closures
--    → Recommend: Digitization can reduce to 3-5 days (target: 50% reduction)
--
-- 3. "Defective" and "Wrong Item Delivered" account for 37.8% of returns
--    → Recommend: Warehouse picking verification and supplier feedback loop
--
-- 4. Baku - 28 Mall has highest volume but best processing time (7.2 days)
--    → Recommend: Use 28 Mall as pilot store for digitization rollout
