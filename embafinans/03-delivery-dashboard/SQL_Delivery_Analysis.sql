-- ============================================================
-- Delivery Dashboard Data Analysis Queries
-- Embafinans — Goods Loan Delivery Tracking Dashboard
-- ============================================================

-- 1. Delivery Error Rate by Category
-- Purpose: Identify which types of delivery errors occur most frequently
-- to prioritize fixes and reduce manual corrections
SELECT
    error_category,
    error_type,
    COUNT(*) AS error_count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) AS percentage,
    ROUND(AVG(EXTRACT(EPOCH FROM (resolved_at - occurred_at)) / 3600), 1) AS avg_resolution_hours
FROM delivery_errors
WHERE occurred_at >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '3 months'
GROUP BY error_category, error_type
ORDER BY error_count DESC;

-- 2. Delivery Performance Metrics
-- Purpose: Track key delivery KPIs including average delivery time,
-- on-time rate, and customer satisfaction scores
SELECT
    DATE_TRUNC('week', delivery_date) AS week,
    COUNT(*) AS total_deliveries,
    ROUND(AVG(EXTRACT(EPOCH FROM (delivered_at - dispatched_at)) / 3600), 1) AS avg_delivery_hours,
    SUM(CASE WHEN delivered_at <= promised_date THEN 1 ELSE 0 END) AS on_time_deliveries,
    ROUND(
        SUM(CASE WHEN delivered_at <= promised_date THEN 1 ELSE 0 END) * 100.0
        / NULLIF(COUNT(*), 0), 2
    ) AS on_time_rate,
    ROUND(AVG(satisfaction_score), 2) AS avg_satisfaction
FROM deliveries
WHERE delivery_date >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '3 months'
GROUP BY 1
ORDER BY week DESC;

-- 3. E-Signature Adoption Rate
-- Purpose: Track digital signature adoption trend to measure
-- process digitization success (before vs after dashboard implementation)
SELECT
    DATE_TRUNC('month', created_at) AS month,
    COUNT(*) AS total_signatures,
    SUM(CASE WHEN signature_type = 'DIGITAL' THEN 1 ELSE 0 END) AS digital_signatures,
    SUM(CASE WHEN signature_type = 'PAPER' THEN 1 ELSE 0 END) AS paper_signatures,
    ROUND(
        SUM(CASE WHEN signature_type = 'DIGITAL' THEN 1 ELSE 0 END) * 100.0
        / NULLIF(COUNT(*), 0), 2
    ) AS digital_adoption_rate
FROM delivery_signatures
WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '6 months'
GROUP BY 1
ORDER BY month;

-- 4. Delivery Agent Performance
-- Purpose: Compare delivery agent performance metrics
-- for resource allocation and performance management
SELECT
    da.agent_name,
    COUNT(d.id) AS total_deliveries,
    ROUND(AVG(EXTRACT(EPOCH FROM (d.delivered_at - d.dispatched_at)) / 3600), 1) AS avg_hours,
    ROUND(
        SUM(CASE WHEN d.delivered_at <= d.promised_date THEN 1 ELSE 0 END) * 100.0
        / NULLIF(COUNT(d.id), 0), 2
    ) AS on_time_rate,
    ROUND(AVG(d.satisfaction_score), 2) AS avg_rating,
    SUM(CASE WHEN d.status = 'ESCALATED' THEN 1 ELSE 0 END) AS escalations
FROM delivery_agents da
LEFT JOIN deliveries d ON da.id = d.agent_id
WHERE d.delivery_date >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '3 months'
GROUP BY da.agent_name
ORDER BY on_time_rate DESC, avg_rating DESC;

-- 5. Real-Time Dashboard: Active Deliveries
-- Purpose: Query used by the delivery tracking dashboard
-- to display real-time delivery status across all active orders
SELECT
    d.id AS delivery_id,
    o.order_number,
    c.full_name AS customer_name,
    d.current_status,
    d.last_checkpoint,
    d.last_checkpoint_time,
    da.agent_name,
    EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - d.last_checkpoint_time)) / 3600 AS hours_since_update
FROM deliveries d
JOIN orders o ON d.order_id = o.id
JOIN customers c ON o.customer_id = c.id
LEFT JOIN delivery_agents da ON d.agent_id = da.id
WHERE d.current_status NOT IN ('DELIVERED', 'CANCELLED')
  AND d.dispatched_at >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY d.last_checkpoint_time DESC;

-- 6. Before vs After Dashboard Implementation
-- Purpose: Compare error rates before and after dashboard launch
-- to quantify the "2x fewer errors" improvement metric
SELECT
    CASE
        WHEN d.dispatched_at < '2025-09-01' THEN 'Before Dashboard'
        ELSE 'After Dashboard'
    END AS period,
    COUNT(*) AS total_deliveries,
    SUM(CASE WHEN de.id IS NOT NULL THEN 1 ELSE 0 END) AS deliveries_with_errors,
    ROUND(
        SUM(CASE WHEN de.id IS NOT NULL THEN 1 ELSE 0 END) * 100.0
        / NULLIF(COUNT(*), 0), 2
    ) AS error_rate,
    ROUND(AVG(EXTRACT(EPOCH FROM (d.delivered_at - d.dispatched_at)) / 3600), 1) AS avg_delivery_hours
FROM deliveries d
LEFT JOIN delivery_errors de ON d.id = de.delivery_id
WHERE d.dispatched_at >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '6 months'
GROUP BY 1
ORDER BY period;
