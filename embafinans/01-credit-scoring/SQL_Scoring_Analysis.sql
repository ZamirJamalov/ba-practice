-- ============================================================
-- Credit Scoring Data Analysis Queries
-- Embafinans — BNPL Credit Scoring & Pre-Screen Risk Assessment
-- ============================================================

-- 1. Scoring Decision Distribution
-- Purpose: Analyze the distribution of automated scoring decisions
-- to measure system effectiveness and identify bias patterns
SELECT
    decision,
    COUNT(*) AS application_count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) AS percentage,
    ROUND(AVG(overall_score), 1) AS avg_score,
    ROUND(AVG(requested_amount), 2) AS avg_requested_amount
FROM credit_applications
WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '3 months'
GROUP BY decision
ORDER BY application_count DESC;

-- 2. Scoring Factor Performance
-- Purpose: Evaluate which scoring factors have the strongest correlation
-- with loan repayment to optimize the scoring model weights
SELECT
    sf.factor_name,
    sf.weight,
    ROUND(AVG(sf.value_normalized), 3) AS avg_factor_value,
    COUNT(DISTINCT sf.application_id) AS total_applications,
    ROUND(
        SUM(CASE WHEN ca.repayment_status = 'ON_TIME' THEN 1 ELSE 0 END) * 100.0
        / NULLIF(COUNT(DISTINCT sf.application_id), 0), 2
    ) AS on_time_repayment_rate
FROM scoring_factors sf
JOIN credit_applications ca ON sf.application_id = ca.id
WHERE ca.disbursement_date >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '6 months'
GROUP BY sf.factor_name, sf.weight
ORDER BY on_time_repayment_rate DESC;

-- 3. Bureau Score vs Internal Score Correlation
-- Purpose: Compare external credit bureau scores with internal scoring
-- results to identify discrepancies requiring model recalibration
SELECT
    CASE
        WHEN cb.score >= 700 THEN 'High (700+)'
        WHEN cb.score >= 500 THEN 'Medium (500-699)'
        ELSE 'Low (<500)'
    END AS bureau_score_range,
    COUNT(*) AS applications,
    ROUND(AVG(cs.overall_score), 1) AS avg_internal_score,
    ROUND(
        SUM(CASE WHEN cs.decision = 'AUTO_APPROVED' THEN 1 ELSE 0 END) * 100.0
        / NULLIF(COUNT(*), 0), 2
    ) AS auto_approval_rate,
    ROUND(
        SUM(CASE WHEN ca.repayment_status IN ('OVERDUE_30', 'OVERDUE_60', 'OVERDUE_90') THEN 1 ELSE 0 END) * 100.0
        / NULLIF(COUNT(*), 0), 2
    ) AS overdue_rate
FROM credit_applications ca
JOIN credit_scores cs ON ca.id = cs.application_id
JOIN credit_bureau cb ON ca.applicant_pin = cb.pin
WHERE ca.created_at >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '6 months'
GROUP BY 1
ORDER BY bureau_score_range;

-- 4. Risk Score Distribution by Product Type
-- Purpose: Understand risk profiles across different credit products
-- (BNPL, Goods Loan, Consumer Loan) for product-level risk management
SELECT
    credit_product,
    CASE
        WHEN overall_score >= 80 THEN 'Low Risk'
        WHEN overall_score >= 60 THEN 'Medium Risk'
        WHEN overall_score >= 40 THEN 'High Risk'
        ELSE 'Very High Risk'
    END AS risk_category,
    COUNT(*) AS applications,
    ROUND(AVG(requested_amount), 2) AS avg_amount,
    ROUND(SUM(requested_amount), 2) AS total_amount
FROM credit_applications
WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '3 months'
GROUP BY credit_product, risk_category
ORDER BY credit_product, risk_category;

-- 5. Monthly Trend: Applications, Approvals, Disbursements
-- Purpose: Track monthly volume trends for capacity planning
-- and business performance monitoring
SELECT
    DATE_TRUNC('month', created_at) AS month,
    COUNT(*) AS total_applications,
    SUM(CASE WHEN decision = 'AUTO_APPROVED' THEN 1 ELSE 0 END) AS auto_approved,
    SUM(CASE WHEN decision = 'MANUAL_REVIEW' THEN 1 ELSE 0 END) AS manual_review,
    SUM(CASE WHEN decision = 'AUTO_REJECTED' THEN 1 ELSE 0 END) AS auto_rejected,
    ROUND(SUM(CASE WHEN decision = 'AUTO_APPROVED' THEN 1 ELSE 0 END) * 100.0
        / NULLIF(COUNT(*), 0), 2) AS approval_rate,
    ROUND(AVG(EXTRACT(EPOCH FROM (decision_made_at - created_at)) / 60), 1) AS avg_processing_minutes
FROM credit_applications
WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '12 months'
GROUP BY 1
ORDER BY month DESC;

-- 6. Manual Review Conversion Rate
-- Purpose: Measure how many applications sent to manual review
-- result in approval, to calibrate the auto-approve threshold
SELECT
    DATE_TRUNC('week', created_at) AS week,
    COUNT(*) AS manual_review_count,
    SUM(CASE WHEN final_decision = 'APPROVED' THEN 1 ELSE 0 END) AS approved_after_review,
    SUM(CASE WHEN final_decision = 'REJECTED' THEN 1 ELSE 0 END) AS rejected_after_review,
    ROUND(
        SUM(CASE WHEN final_decision = 'APPROVED' THEN 1 ELSE 0 END) * 100.0
        / NULLIF(COUNT(*), 0), 2
    ) AS conversion_rate
FROM credit_applications
WHERE decision = 'MANUAL_REVIEW'
  AND created_at >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '3 months'
GROUP BY 1
ORDER BY week DESC;
