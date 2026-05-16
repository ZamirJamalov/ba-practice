const docx = require("docx");
const fs = require("fs");

// Deep Sea Color Palette
const COLORS = {
  deepSea: "1B3A5C",
  ocean: "2E86AB",
  sky: "A3CEF1",
  light: "E8F4F8",
  white: "FFFFFF",
  dark: "0F2439",
  gray: "666666",
  lightGray: "F5F5F5",
  accent: "1B6B93",
  green: "2E7D32",
  orange: "E65100",
  red: "C62828",
  purple: "6A1B9A",
  teal: "00796B",
  amber: "F57F17",
};

function heading(text, level = 1) {
  const sizes = { 1: 32, 2: 26, 3: 22, 4: 18 };
  const colors = { 1: COLORS.deepSea, 2: COLORS.ocean, 3: COLORS.accent, 4: COLORS.dark };
  return new docx.Paragraph({
    children: [new docx.TextRun({ text, bold: true, size: sizes[level] || 22, color: colors[level] || COLORS.dark, font: "Calibri" })],
    heading: level,
    spacing: { before: level === 1 ? 360 : 240, after: 120 },
  });
}

function para(text, opts = {}) {
  return new docx.Paragraph({
    children: [new docx.TextRun({ text, size: 22, color: COLORS.dark, font: "Calibri", ...opts })],
    spacing: { after: 120, line: 276 },
  });
}

function bullet(text, level = 0) {
  return new docx.Paragraph({
    children: [new docx.TextRun({ text, size: 22, color: COLORS.dark, font: "Calibri" })],
    bullet: { level },
    spacing: { after: 60 },
  });
}

function createTable(headers, rows) {
  const headerRow = new docx.TableRow({
    children: headers.map(h => new docx.TableCell({
      children: [new docx.Paragraph({ children: [new docx.TextRun({ text: h, bold: true, size: 20, color: COLORS.white, font: "Calibri" })] })],
      shading: { fill: COLORS.deepSea },
      width: { size: Math.floor(9000 / headers.length), type: "dxa" },
    })),
  });
  const dataRows = rows.map((row, idx) => new docx.TableRow({
    children: row.map((cell, ci) => new docx.TableCell({
      children: [new docx.Paragraph({ children: [new docx.TextRun({ text: String(cell), size: 20, color: COLORS.dark, font: "Calibri" })] })],
      shading: { fill: idx % 2 === 0 ? COLORS.light : COLORS.white },
      width: { size: Math.floor(9000 / headers.length), type: "dxa" },
    })),
  }));
  return new docx.Table({ rows: [headerRow, ...dataRows], width: { size: 9000, type: "dxa" } });
}

function divider() {
  return new docx.Paragraph({ spacing: { before: 80, after: 80 }, children: [] });
}

function coloredPara(text, color) {
  return new docx.Paragraph({
    children: [new docx.TextRun({ text, size: 22, color: color, font: "Calibri" })],
    spacing: { after: 120, line: 276 },
  });
}

// ========== RICE DATA ==========
const riceItems = [
  // Sprint 1 - Foundation
  {
    id: "FEAT-001",
    name: "Customer Self-Service Return Portal",
    reqRef: "REQ-101, REQ-102, REQ-103",
    category: "Customer-Facing",
    userStory: "US-001 to US-003",
    reach: 6000,
    impact: 3,
    confidence: 0.9,
    effort: 13,
    sprint: "Sprint 1",
    description: "Web-based portal allowing customers to submit return requests online, select products, specify return reasons, upload photos, and choose resolution type (refund/exchange). Eliminates dependency on phone calls and in-store visits for return initiation. Includes order verification via order number and email lookup against ERP data.",
    reachJustification: "Estimated 500 returns/month x 12 months = 6,000 customers impacted annually. Also benefits the 35% of customers who currently abandon returns due to inconvenient process, adding approximately 1,500 potential users.",
    impactJustification: "Massive (3): Directly addresses PP-01 (processing time) and PP-08 (reactive communication). Enables 24/7 availability, reducing inbound calls by an estimated 65%. Improves CSAT by 15-20 percentage points based on industry benchmarks for self-service portals.",
    confidenceJustification: "High (90%): Strong industry evidence from comparable retailers. Customer survey (n=200) showed 78% prefer online submission. Technical feasibility confirmed by IT assessment. Limited unknowns in web form development.",
    effortJustification: "13 person-weeks: Frontend development (5 weeks), backend API for order verification (3 weeks), database schema design (2 weeks), integration with ERP for order lookup (2 weeks), testing and UAT (1 week).",
  },
  {
    id: "FEAT-002",
    name: "Automated Return Validation Engine",
    reqRef: "REQ-101, REQ-104",
    category: "Core System",
    userStory: "US-004, US-005",
    reach: 6000,
    impact: 3,
    confidence: 0.85,
    effort: 8,
    sprint: "Sprint 1",
    description: "Configurable rules engine that automatically validates return requests against business policies: 14-day return window, non-returnable product categories, warranty status, customer return frequency threshold, and product condition requirements. Returns immediate approval, rejection, or escalation decision with detailed reasoning.",
    reachJustification: "All 6,000 annual return requests pass through this engine. Additionally, the ~200 requests per month that are currently manually rejected benefit from faster, more consistent communication.",
    impactJustification: "Massive (3): Eliminates PP-03 (inconsistent policy enforcement) and PP-04 (refund calculation errors). Reduces agent workload by 40% for initial validation. Ensures 100% consistent policy application regardless of agent experience.",
    confidenceJustification: "High (85%): Rule-based validation is a well-understood pattern. Policy rules are clearly defined in existing Return Policy v3.2. Minor uncertainty in edge cases (loyalty tiers, seasonal extensions) that require configuration flexibility.",
    effortJustification: "8 person-weeks: Rules engine architecture (2 weeks), policy rule configuration module (2 weeks), integration with return portal (2 weeks), edge case handling and testing (1 week), documentation (1 week).",
  },
  {
    id: "FEAT-003",
    name: "RMA Number Generation and Return Shipping Label",
    reqRef: "REQ-102, REQ-107",
    category: "Core System",
    userStory: "US-006",
    reach: 4800,
    impact: 2,
    confidence: 0.95,
    effort: 5,
    sprint: "Sprint 1",
    description: "Automatic generation of unique RMA numbers (format: RMA-YYYY-NNNNNN) for approved return requests. System creates branded PDF shipping labels with company return address, customer address, RMA barcode, and handling instructions. Label is emailed to customer and available for download in the portal.",
    reachJustification: "80% of returns (4,800/year) use shipped returns. The remaining 20% are in-store drop-offs. Shipping label impacts every shipped return customer directly.",
    impactJustification: "High (2): Reduces PP-01 by eliminating manual coordination. Professional branded label improves customer perception. Barcode integration accelerates warehouse receiving. Eliminates customer confusion about return shipping address and instructions.",
    confidenceJustification: "Very High (95%): Standard barcode generation libraries are mature. PDF generation is well-established technology. Label format follows common logistics standards. Very low technical risk.",
    effortJustification: "5 person-weeks: RMA number sequence generation (1 week), PDF label template design (1 week), barcode generation integration (1 week), email delivery with attachment (1 week), testing with sample shipments (1 week).",
  },
  // Sprint 2 - Operations
  {
    id: "FEAT-004",
    name: "Digital Warehouse Receiving and Inspection Module",
    reqRef: "REQ-105, REQ-106",
    category: "Operations",
    userStory: "US-007, US-008",
    reach: 2400,
    impact: 3,
    confidence: 0.8,
    effort: 10,
    sprint: "Sprint 2",
    description: "Mobile-optimized web application for warehouse staff to receive returned items by scanning RMA barcode, verify expected item details, perform visual quality inspection using a standardized digital form with photo capture, assign condition grades (A/B/C/D), and record disposition decisions (restock/refurbish/dispose).",
    reachJustification: "6,000 annual returns processed by 6 warehouse staff. Each staff member processes approximately 1,000 returns/year. Primary users are warehouse staff, but the data flows to 8 support agents and 3 finance staff downstream.",
    impactJustification: "Massive (3): Eliminates PP-06 (paper-based warehouse). Reduces inspection time by 50% (from 1-3 days to 0.5-1 day). Photo documentation eliminates disputes about item condition. Standardized grading improves consistency from estimated 75% to 95%+.",
    confidenceJustification: "Medium-High (80%): Mobile web development is well-established. Barcode scanning via device camera has proven libraries. Minor uncertainty in warehouse Wi-Fi coverage and device compatibility. Pilot testing recommended.",
    effortJustification: "10 person-weeks: Mobile-responsive UI development (3 weeks), barcode scanning integration (2 weeks), photo capture and storage (2 weeks), inspection workflow and grading logic (2 weeks), warehouse pilot testing (1 week).",
  },
  {
    id: "FEAT-005",
    name: "Automated Refund Calculation and Processing",
    reqRef: "REQ-108, REQ-109",
    category: "Finance",
    userStory: "US-009, US-010",
    reach: 5700,
    impact: 3,
    confidence: 0.85,
    effort: 10,
    sprint: "Sprint 2",
    description: "Automated refund amount calculation based on original purchase price, product condition grade, and return policy rules. Supports full refund (grade A/B), partial refund (grade C), store credit with 5% bonus (grade D), and rejection. Integrates with ERP financial module via API for refund execution. Replaces batch processing with daily automated processing.",
    reachJustification: "95% of returns (5,700/year) result in some form of financial resolution. Directly impacts 3 finance team members and 8 support agents who currently handle calculations manually. Every customer receiving a refund is affected.",
    impactJustification: "Massive (3): Eliminates PP-04 (3% refund calculation error rate = ~171 erroneous refunds/year). Reduces refund processing time from 1-3 days to same-day. Shifts from batch (2x/week) to daily processing, reducing average delay by 2.5 days. Enables ERP integration for financial reconciliation.",
    confidenceJustification: "High (85%): Calculation logic is rule-based and well-defined. ERP API integration requires coordination with ERP vendor. Financial accuracy testing will be extensive but straightforward. Minor uncertainty in ERP API response times and reliability.",
    effortJustification: "10 person-weeks: Calculation engine development (3 weeks), ERP API integration (3 weeks), financial reconciliation module (2 weeks), accuracy testing and audit validation (1 week), documentation (1 week).",
  },
  {
    id: "FEAT-006",
    name: "Multi-Channel Notification System",
    reqRef: "REQ-110",
    category: "Customer-Facing",
    userStory: "US-011, US-012",
    reach: 6000,
    impact: 2,
    confidence: 0.9,
    effort: 5,
    sprint: "Sprint 2",
    description: "Automated notification system sending email and SMS alerts at all key return process milestones: request submitted, request approved/rejected, RMA generated, item received by warehouse, inspection completed, refund processed, return completed. Configurable notification templates with branding. Customer preference management for notification channel.",
    reachJustification: "All 6,000 annual return customers receive multiple notifications (average 5-7 per return = 30,000-42,000 notifications/year). Benefits all customers and reduces inbound inquiries for 8 support agents.",
    impactJustification: "High (2): Directly addresses PP-08 (reactive communication). Expected to reduce inbound customer calls by 80% (from 2.3 calls/return to 0.3 calls/return). Improves customer perception and reduces agent workload significantly.",
    confidenceJustification: "High (90%): Email (SMTP) and SMS gateway APIs are mature and reliable. Template-based notification systems are well-proven. Known quantity from IT perspective with established vendor relationships.",
    effortJustification: "5 person-weeks: Notification engine architecture (1 week), email template design and implementation (1 week), SMS gateway integration (1 week), customer preference management (1 week), testing and template approval (1 week).",
  },
  // Sprint 3 - Management & Intelligence
  {
    id: "FEAT-007",
    name: "Return Request Status Tracking and Customer Portal",
    reqRef: "REQ-103, REQ-111",
    category: "Customer-Facing",
    userStory: "US-013, US-014",
    reach: 6000,
    impact: 2,
    confidence: 0.85,
    effort: 7,
    sprint: "Sprint 3",
    description: "Real-time return status tracking accessible to customers via the web portal using RMA number or email/order reference. Visual timeline showing current stage of return processing with estimated completion dates. Includes downloadable documents (return confirmation, refund receipt, shipping label). Agent view with complete return history and communication log.",
    reachJustification: "All 6,000 return customers use tracking. Additionally, an estimated 3,000 potential customers who call to check status before submitting returns benefit from visibility into the process. 8 support agents use the agent view daily.",
    impactJustification: "High (2): Addresses PP-02 (no visibility for customers). Reduces status inquiry calls by estimated 70%. Provides audit trail for compliance. Visual timeline improves customer understanding and reduces anxiety during the return process.",
    confidenceJustification: "High (85%): Tracking interfaces are standard web development. Status workflow is well-defined from process modeling. Minor uncertainty in estimated completion date accuracy (depends on warehouse and finance processing times).",
    effortJustification: "7 person-weeks: Customer tracking page with visual timeline (3 weeks), document generation and download module (2 weeks), agent history view (1 week), integration with all process stages (1 week).",
  },
  {
    id: "FEAT-008",
    name: "Management Analytics Dashboard",
    reqRef: "REQ-112",
    category: "Analytics",
    userStory: "US-015",
    reach: 30,
    impact: 3,
    confidence: 0.75,
    effort: 10,
    sprint: "Sprint 3",
    description: "Comprehensive real-time analytics dashboard providing management with visibility into return volume trends, category analysis, reason distribution, processing time metrics, agent performance, financial impact, and customer satisfaction scores. Interactive charts with drill-down capability. Automated weekly/monthly report generation with PDF/Excel export.",
    reachJustification: "Direct users: 2 operations managers, 1 finance manager, 1 IT manager, and 1 C-level executive = 5-6 direct users. Indirect benefit to all department heads who receive automated reports. Impact extends to strategic decisions affecting the entire organization.",
    impactJustification: "Massive (3): Addresses PP-05 (no trend data for management). Enables data-driven decisions on product quality, supplier management, and policy adjustments. Replaces 2-day monthly manual compilation effort. Identifies early warning signals for defective products or policy abuse. Estimated value of improved decision-making: 50,000+ AZN annually in avoided losses.",
    confidenceJustification: "Medium (75%): Dashboard development is well-established. Uncertainty lies in data quality from the transition period and user adoption rates. Report requirements may evolve based on management feedback. Stakeholder workshops confirmed top-priority metrics.",
    effortJustification: "10 person-weeks: Dashboard UI with interactive charts (3 weeks), data aggregation and KPI calculation engine (3 weeks), report generation and export module (2 weeks), user acceptance testing with management (1 week), iteration based on feedback (1 week).",
  },
  // Sprint 4 - Advanced
  {
    id: "FEAT-009",
    name: "Agent Console and Queue Management",
    reqRef: "REQ-103, REQ-104",
    category: "Operations",
    userStory: "US-015 (Agent aspects)",
    reach: 96,
    impact: 2,
    confidence: 0.8,
    effort: 8,
    sprint: "Sprint 4",
    description: "Dedicated web-based agent console providing a unified workspace for support agents to manage return requests. Features include prioritized work queue, SLA tracking with escalation alerts, bulk action capabilities, customer communication history, and quick-access to policy rules. Includes supervisor view for workload distribution and performance monitoring.",
    reachJustification: "8 support agents as primary users (daily usage). 2 supervisors for workload monitoring. Indirectly benefits 6,000+ annual customers through faster, more consistent service delivery.",
    impactJustification: "High (2): Reduces agent per-request handling time by 50%. Enables SLA tracking and proactive escalations. Bulk actions for high-volume periods reduce repetitive work. Supervisor view improves workforce management during peak periods (e.g., post-holiday returns).",
    confidenceJustification: "Medium-High (80%): Console development follows standard patterns. Queue management algorithms are well-understood. Minor uncertainty in SLA thresholds and escalation rules that require operational team input for fine-tuning.",
    effortJustification: "8 person-weeks: Console UI development (3 weeks), queue engine with SLA tracking (2 weeks), bulk action framework (1 week), supervisor dashboard (1 week), agent training and UAT (1 week).",
  },
  {
    id: "FEAT-010",
    name: "ERP System Integration Layer",
    reqRef: "REQ-107, REQ-108, REQ-109",
    category: "Integration",
    userStory: "Cross-cutting (US-005, US-009, US-010)",
    reach: 6000,
    impact: 3,
    confidence: 0.7,
    effort: 15,
    sprint: "Sprint 4",
    description: "Robust integration layer connecting the Return Management System with Kontakt Home's existing ERP system for bidirectional data synchronization. Handles customer data lookup, order verification, inventory updates upon return receipt, refund processing via ERP financial module, and real-time product availability checks. Includes error handling, retry logic, and data reconciliation capabilities.",
    reachJustification: "All 6,000 annual returns require ERP interaction at multiple stages (order lookup, inventory update, refund). All 5 user roles depend on ERP data accuracy. Integration reliability affects every aspect of the system.",
    impactJustification: "Massive (3): ERP integration is the backbone that enables automation across the entire return process. Without reliable integration, the system cannot automate refunds, update inventory, or verify orders. Eliminates manual data re-entry that currently causes errors and delays. Enables real-time inventory accuracy affecting sales operations beyond returns.",
    confidenceJustification: "Medium (70%): Largest technical uncertainty in the project. ERP API documentation may be limited. Response times and reliability need empirical testing. Legacy ERP may have constraints on API call frequency. Requires close collaboration with ERP vendor. Mitigation: early proof-of-concept in Sprint 1.",
    effortJustification: "15 person-weeks: API discovery and documentation (2 weeks), integration architecture design (2 weeks), core integration module development (4 weeks), error handling and retry logic (2 weeks), data reconciliation engine (2 weeks), comprehensive integration testing (2 weeks), performance optimization (1 week).",
  },
  {
    id: "FEAT-011",
    name: "Return Policy Configuration Module",
    reqRef: "REQ-104, REQ-112",
    category: "Core System",
    userStory: "US-004 (Admin aspects)",
    reach: 5,
    impact: 1,
    confidence: 0.85,
    effort: 6,
    sprint: "Sprint 4",
    description: "Admin-facing configuration module allowing business users to modify return policy rules without developer intervention. Supports configuration of return windows by product category, non-returnable product list management, condition grading criteria, refund calculation rules, and seasonal policy extensions. Includes audit trail for all policy changes and impact simulation before deployment.",
    reachJustification: "Primary users: 1 admin, 1 operations manager, 1 finance manager = 3 direct users. Indirectly affects all 6,000+ annual return customers through policy changes. Enables rapid response to market conditions.",
    impactJustification: "Medium (1): Provides operational agility to adapt return policies without development cycles. Supports seasonal promotions (e.g., extended holiday returns). Reduces dependency on IT for policy updates. Impact is significant for operations but limited user base.",
    confidenceJustification: "High (85%): Configuration management is a standard software pattern. Rule editing interfaces are well-understood. Impact simulation requires business logic modeling but is achievable. Audit trail requirements are clearly defined.",
    effortJustification: "6 person-weeks: Configuration UI development (2 weeks), rule engine integration (1 week), impact simulation module (1 week), audit trail implementation (1 week), admin training and documentation (1 week).",
  },
  {
    id: "FEAT-012",
    name: "Duplicate Return Detection and Fraud Prevention",
    reqRef: "REQ-104",
    category: "Core System",
    userStory: "US-005",
    reach: 6000,
    impact: 2,
    confidence: 0.75,
    effort: 6,
    sprint: "Sprint 4",
    description: "System-level detection of duplicate return requests for the same order/product combination. Tracks customer return frequency patterns and flags suspicious activity. Implements configurable thresholds for return frequency limits. Cross-references serial numbers and product identifiers. Generates alerts for potential fraud patterns (e.g., repeated returns of high-value items).",
    reachJustification: "All 6,000 annual return requests are checked. Currently, approximately 5-8% of returns are estimated duplicates or fraudulent based on finance team analysis (300-480 cases/year). Directly protects revenue.",
    impactJustification: "High (2): Addresses PP-09 (duplicate requests). Prevents estimated 150,000-250,000 AZN annual loss from fraudulent returns based on average high-value return of 500-1,000 AZN. Reduces manual checking burden on agents. Builds data foundation for future AI-based fraud detection.",
    confidenceJustification: "Medium (75%): Basic duplicate detection is straightforward (same order + same product). Pattern-based fraud detection requires historical data analysis to establish baselines. False positive rate needs calibration to avoid frustrating legitimate customers.",
    effortJustification: "6 person-weeks: Duplicate detection algorithm (1 week), return frequency tracking (1 week), alert and flagging system (1 week), admin review interface (1 week), threshold calibration with historical data (1 week), testing (1 week).",
  },
  {
    id: "FEAT-013",
    name: "Manager Escalation and Approval Workflow",
    reqRef: "REQ-106, REQ-109",
    category: "Operations",
    userStory: "US-008, US-010",
    reach: 1800,
    impact: 2,
    confidence: 0.8,
    effort: 5,
    sprint: "Sprint 4",
    description: "Structured workflow for escalating return requests that require manager approval, including grade C/D items, high-value returns (above threshold), warranty exception requests, and customer dispute resolutions. Provides managers with complete case context, recommended actions, and one-click approve/reject capability. SLA tracking for escalation response times with automated reminders.",
    reachJustification: "30% of returns (1,800/year) require some form of manager escalation or approval. 2 operations managers are primary users. 8 agents benefit from streamlined escalation process.",
    impactJustification: "High (2): Reduces escalation processing time from 1-2 days to 1-4 hours. Provides managers with complete context for informed decisions. SLA tracking ensures timely resolution. Reduces customer frustration from delayed escalations.",
    confidenceJustification: "Medium-High (80%): Approval workflows are a mature software pattern. SLA tracking is straightforward. Minor uncertainty in approval threshold definitions that need management input. Escalation criteria are partially defined in existing policy documents.",
    effortJustification: "5 person-weeks: Workflow engine for escalation routing (2 weeks), manager approval interface (1 week), SLA monitoring and reminders (1 week), testing and threshold calibration (1 week).",
  },
  {
    id: "FEAT-014",
    name: "Return Reason Analytics and Product Quality Insights",
    reqRef: "REQ-112",
    category: "Analytics",
    userStory: "US-015 (Advanced analytics)",
    reach: 30,
    impact: 2,
    confidence: 0.7,
    effort: 7,
    sprint: "Sprint 5",
    description: "Advanced analytics module for analyzing return reasons, identifying product quality patterns, correlating returns with suppliers and product batches, and generating product quality scorecards. Includes trend analysis, seasonality detection, and predictive indicators for potential product issues. Automated alerts for unusual return rate spikes by product or category.",
    reachJustification: "Direct users: 2 managers, 1 finance manager, 1 procurement specialist = 4-5 users. Indirect impact on product sourcing decisions affecting the entire company's product portfolio and supplier relationships.",
    impactJustification: "High (2): Identifies systemic product quality issues early, potentially reducing future returns by 10-15%. Enables data-driven supplier negotiations (return rate as KPI). Product quality scorecards inform purchasing decisions. Estimated annual savings: 30,000-50,000 AZN through reduced returns and improved supplier terms.",
    confidenceJustification: "Medium (70%): Analytics algorithms are standard. Uncertainty in data quality during initial months. Correlation analysis requires sufficient historical data volume (6+ months of digital data). Product categorization may need refinement.",
    effortJustification: "7 person-weeks: Analytics engine development (2 weeks), product quality scoring algorithm (2 weeks), trend detection and alerting (1 week), report and scorecard templates (1 week), testing with historical data (1 week).",
  },
  {
    id: "FEAT-015",
    name: "Customer Feedback and Satisfaction Survey Module",
    reqRef: "REQ-112",
    category: "Customer-Facing",
    userStory: "US-015 (CSAT aspects)",
    reach: 6000,
    impact: 1,
    confidence: 0.8,
    effort: 4,
    sprint: "Sprint 5",
    description: "Automated post-return customer satisfaction surveys triggered upon return completion. Short, mobile-optimized surveys measuring overall satisfaction, ease of process, communication quality, and likelihood to recommend (NPS). Results aggregated in the analytics dashboard with trend tracking and drill-down by return type, category, and agent.",
    reachJustification: "All 6,000 annual return customers receive survey invitation. Expected response rate: 25-35% (1,500-2,100 responses/year). Management and quality team review results quarterly.",
    impactJustification: "Medium (1): Provides measurable CSAT data to track improvement from baseline 62% to target 90%+. Identifies specific process pain points through open-ended feedback. Supports continuous improvement culture. NPS tracking provides executive-level metric.",
    confidenceJustification: "Medium-High (80%): Survey tools and methodology are well-established. Response rate assumption is conservative based on industry benchmarks. Analytics integration is straightforward. Minor uncertainty in survey question effectiveness.",
    effortJustification: "4 person-weeks: Survey form design and implementation (1 week), automated trigger logic (1 week), analytics dashboard integration (1 week), survey template management (0.5 week), testing and launch (0.5 week).",
  },
  {
    id: "FEAT-016",
    name: "Data Migration and Historical Record Import",
    reqRef: "Cross-cutting",
    category: "Infrastructure",
    userStory: "N/A (Technical prerequisite)",
    reach: 12000,
    impact: 1,
    confidence: 0.6,
    effort: 8,
    sprint: "Sprint 5",
    description: "Migration of existing return records from Excel spreadsheets, paper forms, and email archives into the new RMS database. Includes data cleansing, deduplication, format standardization, and validation. Creates a complete historical reference for trend analysis. Ensures continuity of open return requests during system transition.",
    reachJustification: "Impacts all historical and ongoing returns. Estimated 8,000-12,000 historical records spanning 2+ years. Current open requests (estimated 150-200) must be migrated to ensure continuity. All management reports depend on historical data for trend comparison.",
    impactJustification: "Medium (1): Essential for system credibility and management trust. Without historical data, analytics dashboard shows no trends. Enables before/after comparison to demonstrate ROI. Open request continuity prevents customer disruption during transition.",
    confidenceJustification: "Medium-Low (60%): Data quality in existing sources is poor (8% error rate in Excel, incomplete paper records). Deduplication is complex due to inconsistent data entry. Format standardization requires mapping decisions. Risk of data loss during migration.",
    effortJustification: "8 person-weeks: Data audit and quality assessment (1 week), cleansing and deduplication scripts (2 weeks), migration tool development (2 weeks), validation and reconciliation (2 weeks), rollback plan and dry runs (1 week).",
  },
  {
    id: "FEAT-017",
    name: "System Security, RBAC, and Audit Trail",
    reqRef: "REQ-104, REQ-112",
    category: "Infrastructure",
    userStory: "Cross-cutting (Security)",
    reach: 50,
    impact: 3,
    confidence: 0.85,
    effort: 8,
    sprint: "Sprint 1",
    description: "Role-Based Access Control (RBAC) system with 5 defined roles (Customer, Support Agent, Warehouse Staff, Manager, Admin). Fine-grained permission management for all system functions. Comprehensive audit trail logging all user actions, data modifications, status changes, and financial transactions. Compliance with data protection requirements. Session management and authentication integration with existing corporate identity provider.",
    reachJustification: "All 50+ system users across 5 roles. Compliance requirement affects the entire organization. Audit trail protects all departments in case of disputes. Security is a cross-cutting concern affecting every system interaction.",
    impactJustification: "Massive (3): Addresses PP-10 (no audit trail). Essential for financial compliance and dispute resolution. RBAC ensures data privacy and operational security. Required for management trust and regulatory compliance. Without proper security, the system cannot be deployed to production.",
    confidenceJustification: "High (85%): RBAC is a well-established security pattern. Authentication integration with existing identity provider is standard. Audit logging is technically straightforward. Security requirements are clearly defined by IT department.",
    effortJustification: "8 person-weeks: RBAC architecture and permission model (2 weeks), authentication integration (2 weeks), audit trail implementation (2 weeks), security testing and penetration testing coordination (1 week), documentation (1 week).",
  },
  {
    id: "FEAT-018",
    name: "Performance Monitoring, Logging, and Alerting",
    reqRef: "REQ-112",
    category: "Infrastructure",
    userStory: "Cross-cutting (DevOps)",
    reach: 50,
    impact: 2,
    confidence: 0.85,
    effort: 5,
    sprint: "Sprint 5",
    description: "Application performance monitoring (APM) with real-time dashboards for system health, API response times, error rates, and resource utilization. Centralized logging with searchable log repository. Automated alerting for system anomalies (high error rates, slow response times, integration failures). Daily health check reports for IT operations team.",
    reachJustification: "IT operations team (2 staff) as primary users. Indirectly benefits all 50+ system users through system reliability. All 6,000+ annual return customers depend on system availability.",
    impactJustification: "High (2): Ensures system reliability and uptime (target: 99.5%). Reduces mean time to detection (MTTD) and mean time to resolution (MTTR) for issues. Enables proactive issue resolution before customer impact. Essential for production operations.",
    confidenceJustification: "High (85%): APM tools and logging frameworks are mature technology. Monitoring patterns are well-established. Integration with notification channels is straightforward. IT team has experience with monitoring tools.",
    effortJustification: "5 person-weeks: APM dashboard setup and configuration (1 week), centralized logging implementation (1 week), alert rule configuration (1 week), health check automation (1 week), runbook documentation (1 week).",
  },
];

// Calculate RICE scores
riceItems.forEach(item => {
  item.riceScore = Math.round((item.reach * item.impact * item.confidence) / item.effort);
});

// Sort by RICE score descending
const sortedItems = [...riceItems].sort((a, b) => b.riceScore - a.riceScore);

// Assign priorities
sortedItems.forEach((item, idx) => {
  item.priority = idx + 1;
});

// Sprint grouping
const sprintGroups = {};
riceItems.forEach(item => {
  if (!sprintGroups[item.sprint]) sprintGroups[item.sprint] = [];
  sprintGroups[item.sprint].push(item);
});

// Category groups
const categoryGroups = {};
riceItems.forEach(item => {
  if (!categoryGroups[item.category]) categoryGroups[item.category] = [];
  categoryGroups[item.category].push(item);
});

// ========== BUILD DOCUMENT ==========
const coverChildren = [
  new docx.Paragraph({ spacing: { before: 2400 }, children: [] }),
  new docx.Paragraph({
    alignment: docx.AlignmentType.CENTER,
    children: [new docx.TextRun({ text: "BACKLOG PRIORITIZATION", size: 48, bold: true, color: COLORS.deepSea, font: "Calibri" })],
  }),
  new docx.Paragraph({
    alignment: docx.AlignmentType.CENTER,
    children: [new docx.TextRun({ text: "RICE SCORING FRAMEWORK", size: 48, bold: true, color: COLORS.deepSea, font: "Calibri" })],
  }),
  new docx.Paragraph({
    alignment: docx.AlignmentType.CENTER,
    spacing: { before: 200 },
    children: [new docx.TextRun({ text: "\u2500".repeat(40), size: 24, color: COLORS.ocean, font: "Calibri" })],
  }),
  new docx.Paragraph({
    alignment: docx.AlignmentType.CENTER,
    spacing: { before: 200 },
    children: [new docx.TextRun({ text: "Kontakt Home", size: 36, bold: true, color: COLORS.ocean, font: "Calibri" })],
  }),
  new docx.Paragraph({
    alignment: docx.AlignmentType.CENTER,
    spacing: { before: 100 },
    children: [new docx.TextRun({ text: "Return Management System (RMS)", size: 28, color: COLORS.accent, font: "Calibri" })],
  }),
  new docx.Paragraph({
    alignment: docx.AlignmentType.CENTER,
    spacing: { before: 100 },
    children: [new docx.TextRun({ text: "Product Return & Exchange Process Digitization", size: 24, color: COLORS.gray, font: "Calibri", italics: true })],
  }),
  new docx.Paragraph({ spacing: { before: 1200 }, children: [] }),
  new docx.Paragraph({
    alignment: docx.AlignmentType.CENTER,
    children: [new docx.TextRun({ text: "Version 1.0", size: 22, color: COLORS.dark, font: "Calibri" })],
  }),
  new docx.Paragraph({
    alignment: docx.AlignmentType.CENTER,
    spacing: { before: 80 },
    children: [new docx.TextRun({ text: "Date: April 26, 2026", size: 22, color: COLORS.dark, font: "Calibri" })],
  }),
  new docx.Paragraph({
    alignment: docx.AlignmentType.CENTER,
    spacing: { before: 80 },
    children: [new docx.TextRun({ text: "Prepared by: Zamir Jamalov", size: 22, color: COLORS.dark, font: "Calibri" })],
  }),
  new docx.Paragraph({
    alignment: docx.AlignmentType.CENTER,
    spacing: { before: 80 },
    children: [new docx.TextRun({ text: "Classification: Confidential", size: 22, color: COLORS.gray, font: "Calibri", italics: true })],
  }),
];

const tocItems = [
  "Document Control",
  "1. Executive Summary",
  "2. Introduction to RICE Prioritization",
  "   2.1 Purpose and Objectives",
  "   2.2 What is RICE?",
  "   2.3 Scoring Methodology",
  "   2.4 Scope and Assumptions",
  "   2.5 Stakeholder Alignment",
  "3. Product Backlog Overview",
  "   3.1 Feature Inventory Summary",
  "   3.2 Category Distribution",
  "   3.3 Requirements Mapping",
  "4. RICE Score Detailed Analysis",
  "   4.1 Scoring Criteria Definitions",
  "   4.2 Feature-by-Feature RICE Analysis",
  "5. Prioritized Backlog Ranking",
  "   5.1 Complete RICE Score Ranking",
  "   5.2 Tier Classification (Must / Should / Could / Won't)",
  "   5.3 Quick Wins vs. Strategic Investments",
  "6. Sprint Allocation Plan",
  "   6.1 Sprint 1: Foundation (Weeks 1-4)",
  "   6.2 Sprint 2: Core Operations (Weeks 5-8)",
  "   6.3 Sprint 3: Intelligence Layer (Weeks 9-12)",
  "   6.4 Sprint 4: Advanced Capabilities (Weeks 13-17)",
  "   6.5 Sprint 5: Optimization & Migration (Weeks 18-21)",
  "7. Effort and Resource Planning",
  "   7.1 Total Effort Estimate",
  "   7.2 Team Capacity Requirements",
  "   7.3 Risk-Adjusted Timeline",
  "8. Dependencies and Critical Path",
  "   8.1 Feature Dependency Map",
  "   8.2 Critical Path Analysis",
  "   8.3 Mitigation Strategies",
  "9. Sensitivity Analysis",
  "   9.1 Impact of Confidence Variations",
  "   9.2 Impact of Effort Variations",
  "   9.3 What-If Scenario Analysis",
  "10. Alignment with Business Objectives",
  "11. Recommendations and Next Steps",
  "12. Appendices",
];

const tocChildren = [
  new docx.Paragraph({
    children: [new docx.TextRun({ text: "Table of Contents", bold: true, size: 32, color: COLORS.deepSea, font: "Calibri" })],
    spacing: { after: 300 },
  }),
  ...tocItems.map(t => new docx.Paragraph({
    children: [new docx.TextRun({ text: t, size: 22, color: t.startsWith("   ") ? COLORS.gray : COLORS.deepSea, font: "Calibri", bold: !t.startsWith("   ") })],
    spacing: { after: 40 },
  })),
];

// Build feature detail sections
function buildFeatureDetail(item, rank) {
  const lines = [
    heading(`${item.id}: ${item.name}`, 3),
    new docx.Paragraph({
      children: [
        new docx.TextRun({ text: "Priority Rank: ", bold: true, size: 22, color: COLORS.deepSea, font: "Calibri" }),
        new docx.TextRun({ text: `#${rank}`, bold: true, size: 22, color: COLORS.red, font: "Calibri" }),
        new docx.TextRun({ text: "    |    ", size: 22, color: COLORS.gray, font: "Calibri" }),
        new docx.TextRun({ text: "RICE Score: ", bold: true, size: 22, color: COLORS.deepSea, font: "Calibri" }),
        new docx.TextRun({ text: `${item.riceScore}`, bold: true, size: 22, color: COLORS.green, font: "Calibri" }),
        new docx.TextRun({ text: "    |    ", size: 22, color: COLORS.gray, font: "Calibri" }),
        new docx.TextRun({ text: "Sprint: ", bold: true, size: 22, color: COLORS.deepSea, font: "Calibri" }),
        new docx.TextRun({ text: `${item.sprint}`, bold: true, size: 22, color: COLORS.ocean, font: "Calibri" }),
      ],
      spacing: { after: 80 },
    }),
    createTable(
      ["Attribute", "Value"],
      [
        ["Requirement References", item.reqRef],
        ["Category", item.category],
        ["User Stories", item.userStory],
        ["Reach (R)", `${item.reach.toLocaleString()} customers/transactions per year`],
        ["Impact (I)", `${item.impact} - ${item.impact === 3 ? "Massive" : item.impact === 2 ? "High" : "Medium"}`],
        ["Confidence (C)", `${(item.confidence * 100).toFixed(0)}% - ${item.confidence >= 0.9 ? "Very High" : item.confidence >= 0.8 ? "High" : item.confidence >= 0.7 ? "Medium" : "Low"}`],
        ["Effort (E)", `${item.effort} person-weeks`],
        ["RICE Score", `${item.riceScore} = (${item.reach} x ${item.impact} x ${item.confidence}) / ${item.effort}`],
      ]
    ),
    divider(),
    para(item.description),
    new docx.Paragraph({
      children: [new docx.TextRun({ text: "Reach Justification", bold: true, size: 22, color: COLORS.accent, font: "Calibri" })],
      spacing: { before: 120, after: 60 },
    }),
    para(item.reachJustification),
    new docx.Paragraph({
      children: [new docx.TextRun({ text: "Impact Justification", bold: true, size: 22, color: COLORS.accent, font: "Calibri" })],
      spacing: { before: 120, after: 60 },
    }),
    para(item.impactJustification),
    new docx.Paragraph({
      children: [new docx.TextRun({ text: "Confidence Justification", bold: true, size: 22, color: COLORS.accent, font: "Calibri" })],
      spacing: { before: 120, after: 60 },
    }),
    para(item.confidenceJustification),
    new docx.Paragraph({
      children: [new docx.TextRun({ text: "Effort Justification", bold: true, size: 22, color: COLORS.accent, font: "Calibri" })],
      spacing: { before: 120, after: 60 },
    }),
    para(item.effortJustification),
    divider(),
  ];
  return lines;
}

// Build the main content
const mainChildren = [
  // Document Control
  heading("Document Control"),
  createTable(
    ["Attribute", "Detail"],
    [
      ["Document Title", "Backlog Prioritization (RICE) - Kontakt Home Return Management System"],
      ["Document ID", "RMS-RICE-001"],
      ["Version", "1.0"],
      ["Date", "April 26, 2026"],
      ["Author", "Zamir Jamalov"],
      ["Status", "Approved"],
      ["Classification", "Confidential"],
    ]
  ),
  divider(),
  createTable(
    ["Version", "Date", "Author", "Change Description"],
    [
      ["0.1", "April 22, 2026", "Zamir Jamalov", "Initial draft with feature inventory and preliminary scoring"],
      ["0.2", "April 24, 2026", "Zamir Jamalov", "Completed RICE scoring for all 18 features with detailed justifications"],
      ["0.3", "April 25, 2026", "Zamir Jamalov", "Added sprint allocation, sensitivity analysis, and dependency mapping"],
      ["1.0", "April 26, 2026", "Zamir Jamalov", "Final version with stakeholder review comments incorporated"],
    ]
  ),
  divider(),

  // 1. Executive Summary
  heading("1. Executive Summary"),
  para("This Backlog Prioritization document applies the RICE scoring framework (Reach, Impact, Confidence, Effort) to systematically evaluate and rank 18 features planned for the Kontakt Home Return Management System (RMS). The RICE framework provides an objective, quantitative basis for prioritizing development efforts, ensuring that the highest-value features are delivered first while managing risk and resource constraints effectively."),
  para("The analysis identifies the Customer Self-Service Return Portal (FEAT-001) and the Automated Return Validation Engine (FEAT-002) as the top-priority features, each achieving a RICE score of 1,246 and 1,913 respectively. These two features alone address the most critical pain points identified in the Gap Analysis: long processing times (PP-01), inconsistent policy enforcement (PP-03), and the lack of customer self-service capability. Together, they form the foundation of the digitized return process and should be delivered in Sprint 1 alongside the essential security infrastructure (FEAT-017, RICE score 161)."),
  para("The total estimated effort across all 18 features is 127 person-weeks, distributed across 5 sprints spanning approximately 21 weeks (5 months). Sprint allocation has been optimized to deliver a minimum viable product by Sprint 2, with core customer-facing capabilities operational by Sprint 1 and end-to-end process automation by Sprint 3. The sensitivity analysis demonstrates that the top 6 features maintain their priority ranking even under pessimistic assumptions, confirming the robustness of the prioritization decisions."),
  para("Key findings from the RICE analysis include: (1) Customer-facing features consistently score highest due to their broad reach (6,000+ customers/year), (2) ERP integration (FEAT-010) carries the highest effort but also one of the highest impact scores, making it the most critical technical risk in the project, (3) Analytics and reporting features have lower reach but massive strategic impact for management decision-making, and (4) Infrastructure features, while lower in RICE score, are essential prerequisites that enable the higher-scoring features. The recommended approach balances quick wins with strategic investments to maximize value delivery throughout the project lifecycle."),

  // 2. Introduction to RICE
  heading("2. Introduction to RICE Prioritization"),

  heading("2.1 Purpose and Objectives", 2),
  para("The purpose of this document is to provide a transparent, data-driven approach to prioritizing the product backlog for the Kontakt Home Return Management System. In a project of this scope, involving 18 distinct features, multiple stakeholders with competing priorities, and limited development resources, a structured prioritization framework is essential to ensure that the team focuses on delivering maximum value at every sprint."),
  para("The specific objectives of this RICE prioritization exercise are:"),
  bullet("Establish a single, agreed-upon priority ranking for all backlog items that reflects business value, technical feasibility, and resource requirements"),
  bullet("Provide a quantitative basis for sprint planning and release planning that all stakeholders can understand and support"),
  bullet("Identify dependencies between features and optimize the delivery sequence to minimize blocking and maximize incremental value"),
  bullet("Enable transparent communication with project sponsors and executive stakeholders about why specific features are prioritized over others"),
  bullet("Create a living document that can be re-evaluated as new information becomes available during the development lifecycle"),
  bullet("Support risk-informed decision-making by incorporating confidence levels into the scoring model"),

  heading("2.2 What is RICE?", 2),
  para("RICE is a widely adopted product prioritization framework developed by Sean McBride at Intercom. The acronym represents four dimensions that, when combined, provide a holistic view of a feature's relative value compared to its cost of implementation. The framework has gained broad adoption across the technology industry because of its simplicity, transparency, and effectiveness in preventing common prioritization biases such as the HIPPO effect (Highest Paid Person's Opinion) or recency bias."),
  para("The four components of the RICE framework are:"),
  bullet("Reach (R): The number of customers, users, or transactions that will be affected by the feature within a defined time period. For the Kontakt Home RMS, reach is measured as the number of customers or internal users impacted per year. A higher reach means the feature benefits more people."),
  bullet("Impact (I): The degree to which the feature will improve the experience, efficiency, or revenue for the affected users. Impact is scored on a scale of 0.25 (Minimal), 0.5 (Low), 1 (Medium), 2 (High), to 3 (Massive). This logarithmic scale reflects that the difference between 'Minimal' and 'Massive' is typically much larger than the numbers suggest."),
  bullet("Confidence (C): The team's level of certainty in the Reach, Impact, and Effort estimates. Scored as a percentage (50% = Low, 80% = Medium, 100% = High). Lower confidence reduces the effective score, appropriately reflecting the higher risk of uncertain estimates."),
  bullet("Effort (E): The total amount of person-time (in weeks or months) required to design, develop, test, and deploy the feature. Higher effort reduces the score because it represents more resource consumption and opportunity cost."),
  para("The RICE score is calculated using the formula: RICE = (Reach x Impact x Confidence) / Effort. This formula ensures that features with high reach and high impact are prioritized, while features requiring significant effort are penalized. The confidence multiplier provides a risk adjustment that prevents over-committing to uncertain features."),

  heading("2.3 Scoring Methodology", 2),
  para("The scoring for this backlog was conducted through a multi-step process involving data analysis, stakeholder input, and structured estimation sessions. The methodology followed these steps:"),
  para("Step 1 - Data Collection: Quantitative data was gathered from multiple sources including the Gap Analysis document (pain points PP-01 to PP-10), historical return data (October 2025 - March 2026), customer survey results (n=200), stakeholder interviews (12 interviews across 4 departments), and industry benchmarks for retail return management systems."),
  para("Step 2 - Individual Estimation: Each feature was independently scored by three evaluators: the Business Analyst (Zamir Jamalov), the Technical Lead, and the Product Owner. Evaluators used a standardized scoring template to ensure consistency."),
  para("Step 3 - Consensus Session: A structured 4-hour workshop was held to discuss discrepancies, share assumptions, and reach consensus on final scores. Where consensus could not be reached, the average score was used with a notation of the disagreement range."),
  para("Step 4 - Validation: Final scores were validated against the project's strategic objectives, available budget, and team capacity to ensure the resulting prioritization was both analytically sound and practically feasible."),
  para("Scoring specifics for each dimension:"),
  bullet("Reach: Annualized based on current return volume (500-600/month) and projected growth. Internal user counts based on team sizes. Reach for customer-impacting features includes both direct users and those who benefit from improved service."),
  bullet("Impact: Scored using the standard 0.25-3 scale. Benchmarked against pain point severity from Gap Analysis (Critical = 3, High = 2, Medium = 1). Adjusted for measurable outcomes where available."),
  bullet("Confidence: Based on availability of data, technical maturity, and stakeholder agreement. Features with well-defined requirements and proven technology scored 80-95%. Features with dependencies on external systems (ERP) or uncertain data quality scored 60-75%."),
  bullet("Effort: Estimated in person-weeks by the technical team, including design, development, testing, documentation, and deployment. Includes a 15% buffer for unplanned work. Effort assumes a team of 4-5 developers."),

  heading("2.4 Scope and Assumptions", 2),
  para("This prioritization covers all 18 features identified in the FRD (REQ-101 to REQ-112), SRS, User Stories, and Acceptance Criteria documents. The following assumptions underpin the analysis:"),
  bullet("The development team consists of 4-5 full-stack developers, 1 QA engineer, and 1 UI/UX designer"),
  bullet("Each sprint is 4 weeks long with a 1-week buffer between sprints for release and retrospective"),
  bullet("All estimates are in person-weeks and assume productive working hours (excluding meetings, administrative tasks, and leave)"),
  bullet("The ERP integration (FEAT-010) can begin a proof-of-concept during Sprint 1 to reduce confidence uncertainty"),
  bullet("Customer volume will remain within the current range of 500-600 returns/month during the development period"),
  bullet("No major changes to the business environment or regulatory framework are expected during the project timeline"),
  bullet("The project has secured budget approval for the full 21-week development timeline"),
  para("Out of scope for this prioritization: future enhancement requests beyond the 18 identified features, infrastructure hosting costs, third-party software licensing decisions, and post-launch operational support planning."),

  heading("2.5 Stakeholder Alignment", 2),
  para("The following stakeholder groups reviewed and approved the RICE scoring methodology and results:"),
  createTable(
    ["Stakeholder", "Role in Prioritization", "Approval Status"],
    [
      ["Rashid Mammadov, Operations Director", "Executive sponsor; validated business impact scores", "Approved"],
      ["Aysel Karimova, Customer Service Manager", "Validated reach estimates and customer impact assumptions", "Approved"],
      ["Elvin Hasanov, IT Manager", "Validated effort estimates and technical confidence scores", "Approved"],
      ["Nigar Aliyeva, Finance Manager", "Validated financial impact assumptions and ROI projections", "Approved"],
      ["Zamir Jamalov, Business Analyst", "Compiled scoring data; facilitated consensus sessions", "Approved"],
    ]
  ),
  divider(),

  // 3. Product Backlog Overview
  heading("3. Product Backlog Overview"),

  heading("3.1 Feature Inventory Summary", 2),
  para("The Return Management System backlog consists of 18 features organized across 6 categories. These features have been derived from the functional requirements defined in the FRD (REQ-101 through REQ-112), the user stories (US-001 through US-015), and the acceptance criteria developed during the requirements phase. The following table provides a complete inventory of all backlog items with their category, sprint assignment, and RICE score."),
  createTable(
    ["ID", "Feature Name", "Category", "Sprint", "Effort (wks)", "RICE Score"],
    riceItems.map(item => [item.id, item.name, item.category, item.sprint, String(item.effort), String(item.riceScore)])
  ),
  divider(),
  para("The 18 features span a total estimated effort of " + riceItems.reduce((sum, item) => sum + item.effort, 0) + " person-weeks. The average RICE score is " + Math.round(riceItems.reduce((sum, item) => sum + item.riceScore, 0) / riceItems.length) + ", with a range from " + sortedItems[sortedItems.length - 1].riceScore + " to " + sortedItems[0].riceScore + ", indicating significant variation in value density across the backlog."),

  heading("3.2 Category Distribution", 2),
  para("Features are organized into six categories reflecting the functional areas of the Return Management System. The distribution across categories provides insight into the project's structural focus:"),
  createTable(
    ["Category", "Feature Count", "Total Effort (wks)", "Avg. RICE Score", "% of Total Effort"],
    Object.keys(categoryGroups).map(cat => {
      const items = categoryGroups[cat];
      const totalEffort = items.reduce((s, i) => s + i.effort, 0);
      const avgRice = Math.round(items.reduce((s, i) => s + i.riceScore, 0) / items.length);
      return [cat, String(items.length), String(totalEffort), String(avgRice), ((totalEffort / riceItems.reduce((s, i) => s + i.effort, 0)) * 100).toFixed(1) + "%"];
    })
  ),
  divider(),
  para("Customer-Facing features represent the largest category with 5 features and the highest average RICE score, reflecting the strong business case for customer self-service capabilities. Core System features carry significant effort but deliver foundational value that enables all other features. Infrastructure features, while lower in RICE score, are non-negotiable prerequisites for system deployment."),

  heading("3.3 Requirements Mapping", 2),
  para("Each backlog feature maps to one or more functional requirements from the FRD, ensuring complete requirements coverage. The following table summarizes the traceability between FRD requirements and backlog features:"),
  createTable(
    ["Requirement", "Description", "Mapped Features"],
    [
      ["REQ-101", "Online return request submission", "FEAT-001, FEAT-002"],
      ["REQ-102", "Return request validation and approval", "FEAT-001, FEAT-002, FEAT-003"],
      ["REQ-103", "Return status tracking", "FEAT-001, FEAT-007, FEAT-009"],
      ["REQ-104", "Return policy management", "FEAT-002, FEAT-011, FEAT-012, FEAT-017"],
      ["REQ-105", "Warehouse receiving module", "FEAT-004"],
      ["REQ-106", "Inspection and grading workflow", "FEAT-004, FEAT-013"],
      ["REQ-107", "ERP integration for data sync", "FEAT-010, FEAT-003"],
      ["REQ-108", "Automated refund calculation", "FEAT-005, FEAT-010"],
      ["REQ-109", "Refund processing via ERP", "FEAT-005, FEAT-010, FEAT-013"],
      ["REQ-110", "Customer notifications", "FEAT-006"],
      ["REQ-111", "Return history and audit trail", "FEAT-007, FEAT-017"],
      ["REQ-112", "Analytics and reporting dashboard", "FEAT-008, FEAT-014, FEAT-015"],
    ]
  ),
  divider(),

  // 4. RICE Score Detailed Analysis
  heading("4. RICE Score Detailed Analysis"),

  heading("4.1 Scoring Criteria Definitions", 2),
  para("The following tables define the specific criteria and scales used for each RICE dimension in the context of the Kontakt Home RMS project:"),
  heading("4.1.1 Reach (R) Scale", 3),
  createTable(
    ["Score Range", "Definition", "Example"],
    [
      ["< 100", "Niche - Affects a small number of specialized users", "Admin-only configuration features"],
      ["100 - 1,000", "Moderate - Affects a specific team or user group", "Warehouse inspection module (6 staff, 1,000+ transactions)"],
      ["1,000 - 5,000", "Broad - Affects a significant user base or transaction volume", "High-value return escalations (~1,800/year)"],
      ["5,000 - 10,000", "Very Broad - Affects most customers or all transactions", "Return validation engine (all 6,000 returns/year)"],
      ["> 10,000", "Universal - Affects all users and transactions plus indirect benefits", "Historical data migration (12,000+ records)"],
    ]
  ),
  divider(),
  heading("4.1.2 Impact (I) Scale", 3),
  createTable(
    ["Score", "Label", "Definition", "RMS Example"],
    [
      ["0.25", "Minimal", "Marginal improvement; unlikely to be noticed by users", "Minor UI polish or label changes"],
      ["0.5", "Low", "Noticeable improvement but does not change behavior significantly", "Survey module adds CSAT data but limited immediate action"],
      ["1", "Medium", "Meaningful improvement that changes user behavior measurably", "Policy configuration module improves operational agility"],
      ["2", "High", "Significant improvement that substantially changes outcomes", "Notification system reduces 80% of inbound calls"],
      ["3", "Massive", "Transformational change that fundamentally alters the process", "Self-service portal eliminates phone dependency entirely"],
    ]
  ),
  divider(),
  heading("4.1.3 Confidence (C) Scale", 3),
  createTable(
    ["Score", "Label", "Definition", "Evidence Required"],
    [
      ["100%", "High", "Proven with data; no significant unknowns", "User research, A/B test results, production data from similar systems"],
      ["80%", "Medium-High", "Validated with strong evidence; minor unknowns", "Industry benchmarks, expert input, prototype testing"],
      ["60%", "Medium", "Reasonable estimates; several significant unknowns", "Analogy to similar projects, stakeholder interviews"],
      ["50%", "Low", "Rough estimates; many unknowns; high risk of change", "Early-stage ideas, limited market research"],
    ]
  ),
  divider(),
  heading("4.1.4 Effort (E) Scale", 3),
  createTable(
    ["Score (Person-Weeks)", "Label", "Definition", "RMS Example"],
    [
      ["1-3", "Small", "Can be completed within a single sprint by 1 developer", "Survey module, notification templates"],
      ["4-6", "Medium", "Requires focused effort by 1-2 developers within a sprint", "Shipping label generation, manager approval workflow"],
      ["7-10", "Large", "Multi-week effort requiring 2+ developers or cross-team coordination", "Warehouse module, refund processing, analytics dashboard"],
      ["11-15", "Extra Large", "Major feature requiring dedicated team attention across sprints", "ERP integration, self-service portal, data migration"],
    ]
  ),
  divider(),

  heading("4.2 Feature-by-Feature RICE Analysis", 2),
  para("The following sections provide the detailed RICE analysis for each of the 18 backlog features, including the scoring rationale and justification for each dimension. Features are presented in their ranked priority order."),
  divider(),
  ...sortedItems.flatMap(item => buildFeatureDetail(item, item.priority)),

  // 5. Prioritized Backlog Ranking
  heading("5. Prioritized Backlog Ranking"),

  heading("5.1 Complete RICE Score Ranking", 2),
  para("The following table presents all 18 features ranked by their RICE score in descending order. This ranking represents the recommended delivery priority, subject to dependency constraints and sprint capacity limitations discussed in Section 6."),
  createTable(
    ["Rank", "ID", "Feature Name", "RICE Score", "Reach", "Impact", "Confidence", "Effort"],
    sortedItems.map((item, idx) => [
      String(idx + 1),
      item.id,
      item.name,
      String(item.riceScore),
      item.reach.toLocaleString(),
      String(item.impact),
      (item.confidence * 100).toFixed(0) + "%",
      String(item.effort) + " wks",
    ])
  ),
  divider(),
  para("The ranking reveals a clear tier structure. The top 4 features (FEAT-001 through FEAT-006) all score above 900, forming a distinct 'high-priority' cluster. Features ranked 5-12 score between 200-600, representing 'medium-priority' items. The bottom 6 features score below 200, comprising 'lower-priority' items that include important infrastructure prerequisites and advanced analytics capabilities."),

  heading("5.2 Tier Classification (MoSCoW)", 2),
  para("Based on the RICE scores, strategic dependencies, and stakeholder input, the features have been classified using the MoSCoW prioritization framework. This dual classification ensures that both quantitative scoring and qualitative business judgment are reflected in the final prioritization:"),
  createTable(
    ["Tier", "Classification", "Features", "Justification"],
    [
      ["Must Have", "Sprint 1-2", "FEAT-001, FEAT-002, FEAT-003, FEAT-006, FEAT-017", "Minimum viable system: customer self-service, validation, notifications, and security. Without these, the system cannot go live."],
      ["Should Have", "Sprint 2-3", "FEAT-004, FEAT-005, FEAT-007, FEAT-010", "Core operations: warehouse digitalization, refund automation, tracking, and ERP integration. Needed for end-to-end process automation."],
      ["Could Have", "Sprint 3-4", "FEAT-008, FEAT-009, FEAT-011, FEAT-012, FEAT-013", "Advanced capabilities: analytics, agent console, policy config, fraud prevention. Significantly enhance value but system is functional without them."],
      ["Won't Have (v1.0)", "Post-MVP", "FEAT-014, FEAT-015, FEAT-016, FEAT-018", "Deferred to v1.1: advanced product analytics, survey module, full data migration, comprehensive monitoring. Important but not required for launch."],
    ]
  ),
  divider(),

  heading("5.3 Quick Wins vs. Strategic Investments", 2),
  para("An important dimension of backlog prioritization is the distinction between quick wins (high RICE score, low effort) and strategic investments (high impact but requiring significant effort). The following analysis identifies features in each category:"),
  para("Quick Wins (Highest RICE per Person-Week):"),
  bullet("FEAT-003 (RMA and Shipping Label): RICE Score 1,296, Effort 5 weeks = 259 score/person-week. Proven technology, low risk, immediate customer value."),
  bullet("FEAT-006 (Notification System): RICE Score 1,080, Effort 5 weeks = 216 score/person-week. Reduces 80% of inbound calls, mature technology stack."),
  bullet("FEAT-017 (Security and RBAC): RICE Score 161, Effort 8 weeks = 20 score/person-week. While lower absolute score, this is a non-negotiable prerequisite for any production deployment."),
  para("Strategic Investments (High Impact, Higher Effort):"),
  bullet("FEAT-010 (ERP Integration): RICE Score 840, Effort 15 weeks = 56 score/person-week. Highest effort item but fundamental enabler for automation. Recommended to start proof-of-concept early."),
  bullet("FEAT-004 (Warehouse Module): RICE Score 480, Effort 10 weeks = 48 score/person-week. Requires mobile optimization and warehouse-specific UX design. High confidence in long-term value."),
  bullet("FEAT-001 (Customer Portal): RICE Score 1,246, Effort 13 weeks = 96 score/person-week. Largest frontend effort but highest absolute reach and impact. Cornerstone of the digitization strategy."),

  // 6. Sprint Allocation Plan
  heading("6. Sprint Allocation Plan"),
  para("The following sprint allocation plan distributes the 18 features across 5 sprints, optimizing for incremental value delivery, dependency management, and team capacity. Each sprint is designed to deliver a coherent set of features that can be potentially released to production."),

  heading("6.1 Sprint 1: Foundation (Weeks 1-4)", 2),
  para("Sprint 1 focuses on establishing the foundational capabilities that enable all subsequent features. The sprint delivers the customer-facing entry point (return portal), the core validation logic, and the essential security infrastructure. By the end of Sprint 1, customers can submit return requests online, receive automated validation decisions, and the system has production-ready security controls."),
  createTable(
    ["Feature", "Effort (wks)", "RICE Score", "Key Deliverable"],
    sprintGroups["Sprint 1"].map(i => [i.name, String(i.effort), String(i.riceScore), i.description.split(".")[0] + "."])
  ),
  new docx.Paragraph({
    children: [
      new docx.TextRun({ text: "Sprint 1 Total: ", bold: true, size: 22, color: COLORS.deepSea, font: "Calibri" }),
      new docx.TextRun({ text: `${sprintGroups["Sprint 1"].reduce((s, i) => s + i.effort, 0)} person-weeks across 4 features. Team utilization: ${Math.round(sprintGroups["Sprint 1"].reduce((s, i) => s + i.effort, 0) / 4 * 10) / 10} weeks per developer (within 4-week sprint with 5-person team).`, size: 22, color: COLORS.dark, font: "Calibri" }),
    ],
    spacing: { before: 120, after: 120 },
  }),
  coloredPara("Sprint 1 Goal: Customer can submit return request online and receive automated approval/rejection. System is secure and production-ready for beta testing.", COLORS.green),

  heading("6.2 Sprint 2: Core Operations (Weeks 5-8)", 2),
  para("Sprint 2 adds the operational backbone of the return process: warehouse receiving and inspection, refund calculation and processing, and the multi-channel notification system. By the end of Sprint 2, the system supports the complete return lifecycle from submission to refund for standard cases."),
  createTable(
    ["Feature", "Effort (wks)", "RICE Score", "Key Deliverable"],
    sprintGroups["Sprint 2"].map(i => [i.name, String(i.effort), String(i.riceScore), i.description.split(".")[0] + "."])
  ),
  new docx.Paragraph({
    children: [
      new docx.TextRun({ text: "Sprint 2 Total: ", bold: true, size: 22, color: COLORS.deepSea, font: "Calibri" }),
      new docx.TextRun({ text: `${sprintGroups["Sprint 2"].reduce((s, i) => s + i.effort, 0)} person-weeks across 3 features. Note: FEAT-010 (ERP Integration) spans across Sprints 2 and 4.`, size: 22, color: COLORS.dark, font: "Calibri" }),
    ],
    spacing: { before: 120, after: 120 },
  }),
  coloredPara("Sprint 2 Goal: End-to-end automated return processing for standard cases. Warehouse staff use digital tools. Customers receive proactive notifications.", COLORS.green),

  heading("6.3 Sprint 3: Intelligence Layer (Weeks 9-12)", 2),
  para("Sprint 3 adds the visibility and intelligence layer that provides value to management and customers. The tracking portal enables real-time status visibility, and the analytics dashboard delivers the management reporting capability that was identified as a critical gap in the As-Is analysis."),
  createTable(
    ["Feature", "Effort (wks)", "RICE Score", "Key Deliverable"],
    sprintGroups["Sprint 3"].map(i => [i.name, String(i.effort), String(i.riceScore), i.description.split(".")[0] + "."])
  ),
  new docx.Paragraph({
    children: [
      new docx.TextRun({ text: "Sprint 3 Total: ", bold: true, size: 22, color: COLORS.deepSea, font: "Calibri" }),
      new docx.TextRun({ text: `${sprintGroups["Sprint 3"].reduce((s, i) => s + i.effort, 0)} person-weeks across 2 features.`, size: 22, color: COLORS.dark, font: "Calibri" }),
    ],
    spacing: { before: 120, after: 120 },
  }),
  coloredPara("Sprint 3 Goal: Full visibility for customers (real-time tracking) and management (analytics dashboard). System demonstrates measurable ROI through reporting.", COLORS.green),

  heading("6.4 Sprint 4: Advanced Capabilities (Weeks 13-17)", 2),
  para("Sprint 4 delivers advanced operational capabilities that significantly enhance efficiency but are not required for the core workflow. The agent console improves support team productivity, the policy configuration module enables operational agility, and the fraud prevention features protect revenue. This sprint also completes the ERP integration, which is the largest technical work item."),
  createTable(
    ["Feature", "Effort (wks)", "RICE Score", "Key Deliverable"],
    sprintGroups["Sprint 4"].map(i => [i.name, String(i.effort), String(i.riceScore), i.description.split(".")[0] + "."])
  ),
  new docx.Paragraph({
    children: [
      new docx.TextRun({ text: "Sprint 4 Total: ", bold: true, size: 22, color: COLORS.deepSea, font: "Calibri" }),
      new docx.TextRun({ text: `${sprintGroups["Sprint 4"].reduce((s, i) => s + i.effort, 0)} person-weeks across 5 features. Note: This sprint is 5 weeks to accommodate the ERP integration completion and agent training.`, size: 22, color: COLORS.dark, font: "Calibri" }),
    ],
    spacing: { before: 120, after: 120 },
  }),
  coloredPara("Sprint 4 Goal: Advanced operational efficiency with agent console, policy management, and fraud prevention. ERP integration fully complete. System ready for full production rollout.", COLORS.green),

  heading("6.5 Sprint 5: Optimization and Migration (Weeks 18-21)", 2),
  para("Sprint 5 focuses on data migration, system optimization, and advanced analytics that complete the feature set. Historical data migration ensures continuity and enables trend analysis. Advanced product quality analytics and the customer satisfaction survey module provide the intelligence capabilities for continuous improvement beyond the initial deployment."),
  createTable(
    ["Feature", "Effort (wks)", "RICE Score", "Key Deliverable"],
    sprintGroups["Sprint 5"].map(i => [i.name, String(i.effort), String(i.riceScore), i.description.split(".")[0] + "."])
  ),
  new docx.Paragraph({
    children: [
      new docx.TextRun({ text: "Sprint 5 Total: ", bold: true, size: 22, color: COLORS.deepSea, font: "Calibri" }),
      new docx.TextRun({ text: `${sprintGroups["Sprint 5"].reduce((s, i) => s + i.effort, 0)} person-weeks across 4 features. This sprint includes parallel workstreams for migration and optimization.`, size: 22, color: COLORS.dark, font: "Calibri" }),
    ],
    spacing: { before: 120, after: 120 },
  }),
  coloredPara("Sprint 5 Goal: Complete data migration, advanced analytics operational, monitoring and alerting active. Full system feature-complete and production-hardened.", COLORS.green),

  // 7. Effort and Resource Planning
  heading("7. Effort and Resource Planning"),

  heading("7.1 Total Effort Estimate", 2),
  para("The total estimated effort for all 18 features is " + riceItems.reduce((sum, item) => sum + item.effort, 0) + " person-weeks, distributed as follows:"),
  createTable(
    ["Sprint", "Features", "Effort (Person-Weeks)", "Cumulative Effort"],
    Object.keys(sprintGroups).map(sprint => {
      const items = sprintGroups[sprint];
      const effort = items.reduce((s, i) => s + i.effort, 0);
      return [sprint, String(items.length), String(effort), ""];
    })
  ),
  new docx.Paragraph({
    children: [
      new docx.TextRun({ text: "Grand Total: ", bold: true, size: 22, color: COLORS.deepSea, font: "Calibri" }),
      new docx.TextRun({ text: `${riceItems.reduce((sum, item) => sum + item.effort, 0)} person-weeks across 18 features in 5 sprints.`, size: 22, color: COLORS.dark, font: "Calibri" }),
    ],
    spacing: { before: 120, after: 120 },
  }),

  heading("7.2 Team Capacity Requirements", 2),
  para("Based on the total effort estimate and 21-week timeline, the following team composition is recommended:"),
  createTable(
    ["Role", "FTE Count", "Primary Responsibilities", "Sprint Focus"],
    [
      ["Full-Stack Developer (Senior)", "2", "Core system architecture, ERP integration, validation engine", "All sprints"],
      ["Full-Stack Developer (Mid-Level)", "2", "Frontend development, API development, testing", "All sprints"],
      ["QA Engineer", "1", "Test planning, test execution, regression testing, UAT coordination", "All sprints"],
      ["UI/UX Designer", "1", "Interface design, prototype creation, usability testing (0.5 FTE from Sprint 3)", "Sprint 1-3"],
      ["Business Analyst", "0.5", "Requirements clarification, acceptance testing, stakeholder communication", "All sprints"],
      ["DevOps Engineer", "0.5", "CI/CD pipeline, environment setup, monitoring configuration (Sprint 4-5)", "Sprint 1, 4-5"],
      ["Project Manager", "0.5", "Sprint planning, risk management, stakeholder reporting", "All sprints"],
    ]
  ),
  divider(),
  para("The recommended team size of 7-8 FTE provides sufficient capacity to deliver the 127 person-weeks of estimated work within 21 weeks. With an effective team of 5 full-time developers and supporting roles, the team delivers approximately 6-7 person-weeks per calendar week, resulting in a comfortable fit within the 21-week timeline including a 15% buffer for unplanned work and technical debt."),

  heading("7.3 Risk-Adjusted Timeline", 2),
  para("The following risk factors have been considered and may impact the timeline:"),
  createTable(
    ["Risk", "Probability", "Impact", "Mitigation", "Timeline Impact"],
    [
      ["ERP API documentation gaps", "High (60%)", "2-4 weeks delay", "Start POC in Sprint 1; allocate dedicated ERP integration developer", "+2 weeks buffer in Sprint 4"],
      ["Data migration complexity", "Medium (40%)", "1-3 weeks delay", "Early data audit; phased migration approach", "+2 weeks buffer in Sprint 5"],
      ["Scope creep from stakeholders", "Medium (50%)", "3-5 weeks delay", "Strict change control; defer non-critical requests to v1.1", "Built into sprint buffers"],
      ["Team member availability", "Low (20%)", "1-2 weeks delay", "Cross-training; knowledge documentation", "Buffer in each sprint"],
      ["Third-party service outages", "Low (15%)", "Minimal (< 1 week)", "Fallback procedures; offline capabilities for critical paths", "Negligible"],
    ]
  ),
  divider(),
  para("Risk-adjusted timeline: 21 weeks base + 4 weeks buffer = 25 weeks maximum. Target completion remains 21 weeks with 4 weeks of identified contingency. The project should be communicated to stakeholders with a 21-week target and 25-week worst-case estimate."),

  // 8. Dependencies and Critical Path
  heading("8. Dependencies and Critical Path"),

  heading("8.1 Feature Dependency Map", 2),
  para("The following table documents the dependencies between features, which influence the sprint allocation and sequencing decisions:"),
  createTable(
    ["Feature", "Depends On", "Enables", "Dependency Type"],
    [
      ["FEAT-001 (Customer Portal)", "FEAT-017 (Security/RBAC)", "FEAT-002, FEAT-003, FEAT-006, FEAT-007", "Blocking"],
      ["FEAT-002 (Validation Engine)", "FEAT-017 (Security/RBAC)", "FEAT-005, FEAT-012", "Blocking"],
      ["FEAT-003 (RMA/Shipping Label)", "FEAT-001, FEAT-002", "FEAT-004 (barcode scanning)", "Sequential"],
      ["FEAT-004 (Warehouse Module)", "FEAT-003 (RMA generation)", "FEAT-005, FEAT-013", "Sequential"],
      ["FEAT-005 (Refund Processing)", "FEAT-004 (inspection data), FEAT-010 (ERP)", "FEAT-013", "Blocking"],
      ["FEAT-006 (Notifications)", "FEAT-001 (return data)", "N/A", "Independent"],
      ["FEAT-007 (Status Tracking)", "FEAT-001, FEAT-004, FEAT-005", "FEAT-008", "Data flow"],
      ["FEAT-008 (Analytics Dashboard)", "FEAT-007 (status data), FEAT-005 (financial data)", "FEAT-014, FEAT-015", "Data aggregation"],
      ["FEAT-009 (Agent Console)", "FEAT-001, FEAT-002", "N/A", "Independent"],
      ["FEAT-010 (ERP Integration)", "FEAT-017 (security)", "FEAT-005, FEAT-007", "Blocking"],
      ["FEAT-011 (Policy Config)", "FEAT-002 (rules engine)", "N/A", "Independent"],
      ["FEAT-012 (Fraud Detection)", "FEAT-002 (validation data)", "N/A", "Independent"],
      ["FEAT-013 (Manager Escalation)", "FEAT-004, FEAT-005", "N/A", "Sequential"],
      ["FEAT-014 (Product Analytics)", "FEAT-008 (base analytics)", "N/A", "Sequential"],
      ["FEAT-015 (Survey Module)", "FEAT-007 (completion data)", "N/A", "Sequential"],
      ["FEAT-016 (Data Migration)", "Database schema", "FEAT-008 (historical trends)", "Independent"],
      ["FEAT-017 (Security/RBAC)", "None (prerequisite)", "All other features", "Foundation"],
      ["FEAT-018 (Monitoring)", "All features", "N/A", "Independent"],
    ]
  ),
  divider(),

  heading("8.2 Critical Path Analysis", 2),
  para("The critical path through the project dependency graph is: FEAT-017 (Security/RBAC) -> FEAT-001 (Customer Portal) -> FEAT-002 (Validation Engine) -> FEAT-003 (RMA/Label) -> FEAT-004 (Warehouse Module) -> FEAT-010 (ERP Integration) -> FEAT-005 (Refund Processing). This path represents the minimum sequence required to achieve end-to-end automated return processing and spans all critical business functionality."),
  para("The critical path length is approximately 15 weeks (excluding parallel work on non-blocking features). The ERP integration (FEAT-010) represents the highest-risk item on the critical path due to its effort (15 weeks), external dependencies (ERP vendor cooperation), and confidence uncertainty (70%). It is recommended to begin the ERP proof-of-concept during Sprint 1 to reduce uncertainty and accelerate the integration timeline."),

  heading("8.3 Mitigation Strategies", 2),
  para("To manage dependency risks and protect the timeline, the following mitigation strategies are recommended:"),
  bullet("Early Start on ERP Integration: Begin proof-of-concept development during Sprint 1, running in parallel with the customer portal. Allocate 1 senior developer to ERP API discovery and documentation. This reduces the risk of Sprint 4 delays by providing early visibility into integration complexity."),
  bullet("Parallel Development Tracks: Structure the team to work on independent features simultaneously. For example, the notification system (FEAT-006) can be developed by a separate developer in Sprint 2 while the warehouse module (FEAT-004) and refund processing (FEAT-005) are being built by the core team."),
  bullet("Feature Flags: Implement feature flags to decouple deployment from development. Features can be merged to the main branch and deployed to production in a disabled state, allowing integration testing without blocking other features."),
  bullet("Staged ERP Integration: If the full ERP integration proves more complex than estimated, implement a two-phase approach: Phase 1 (read-only integration for order verification and customer lookup) can be delivered in Sprint 2, while Phase 2 (write integration for refunds and inventory updates) can be delivered in Sprint 4."),

  // 9. Sensitivity Analysis
  heading("9. Sensitivity Analysis"),

  heading("9.1 Impact of Confidence Variations", 2),
  para("To assess the robustness of the prioritization, the following table shows how feature rankings change when confidence scores are adjusted by plus or minus 15 percentage points (simulating the range of uncertainty in our estimates):"),
  createTable(
    ["Feature", "Base RICE", "C-15% RICE", "C+15% RICE", "Rank Change"],
    sortedItems.slice(0, 10).map(item => {
      const lowConf = Math.max(0.1, item.confidence - 0.15);
      const highConf = Math.min(1.0, item.confidence + 0.15);
      const lowRice = Math.round((item.reach * item.impact * lowConf) / item.effort);
      const highRice = Math.round((item.reach * item.impact * highConf) / item.effort);
      const rankChange = Math.abs(lowRice - highRice) / Math.round(item.riceScore * 2) * 100;
      return [item.name, String(item.riceScore), String(lowRice), String(highRice), rankChange.toFixed(0) + "% variance"];
    })
  ),
  divider(),
  para("The sensitivity analysis confirms that the top 6 features maintain their relative ranking even under pessimistic confidence assumptions. The largest variance is observed in FEAT-010 (ERP Integration), which has the lowest base confidence (70%). However, even at 55% confidence, the ERP integration remains in the top 6 due to its exceptionally high reach and impact scores. This provides confidence in the robustness of the prioritization decisions."),

  heading("9.2 Impact of Effort Variations", 2),
  para("Effort estimates are inherently uncertain, particularly for features involving external integrations or new technology stacks. The following table shows the impact of 30% effort overruns on RICE scores for the top 10 features:"),
  createTable(
    ["Feature", "Base Effort", "Base RICE", "+30% Effort RICE", "Score Reduction"],
    sortedItems.slice(0, 10).map(item => {
      const highEffort = Math.round(item.effort * 1.3);
      const highEffortRice = Math.round((item.reach * item.impact * item.confidence) / highEffort);
      const reduction = ((item.riceScore - highEffortRice) / item.riceScore * 100).toFixed(0);
      return [item.name, item.effort + " wks", String(item.riceScore), String(highEffortRice) + ` (${highEffort} wks)`, reduction + "%"];
    })
  ),
  divider(),
  para("Even with a 30% effort overrun, all top 6 features maintain RICE scores above 500, which remains significantly higher than the lower-ranked features. This analysis suggests that the prioritization is resilient to moderate estimation errors. The one area of concern is FEAT-004 (Warehouse Module), where a 30% overrun would reduce its RICE score to 369, potentially making it competitive with infrastructure features. Close monitoring of warehouse module development progress is recommended."),

  heading("9.3 What-If Scenario Analysis", 2),
  para("Three scenarios have been modeled to test the prioritization under different conditions:"),
  coloredPara("Scenario A: Budget Cut (30% reduction in available person-weeks)", COLORS.deepSea),
  para("If the budget is reduced by 30% (from 127 to ~89 person-weeks), the recommended scope reduction removes FEAT-014, FEAT-015, FEAT-016, and FEAT-018 entirely, defers FEAT-008 (Analytics Dashboard) to a future phase, and reduces the scope of FEAT-010 (ERP Integration) to read-only Phase 1. The resulting 14-feature scope delivers the core return process digitization while sacrificing analytics, migration, and monitoring capabilities. This scenario delivers approximately 75% of the total value at 70% of the cost, making it a viable option if budget constraints emerge."),
  coloredPara("Scenario B: Aggressive Timeline (16 weeks instead of 21)", COLORS.deepSea),
  para("If the timeline is compressed to 16 weeks, the recommended approach is to run Sprint 1 and Sprint 2 in parallel (requiring 7-8 developers instead of 4-5), defer all 'Could Have' features to a v1.1 release, and implement the ERP integration in two phases. The compressed timeline delivers 11 features (all Must Have and Should Have) within 16 weeks. The trade-off is increased team coordination overhead and reduced time for testing and iteration."),
  coloredPara("Scenario C: Scope Expansion (Add 3 new features)", COLORS.deepSea),
  para("If three additional high-priority features are requested (e.g., mobile app, chatbot integration, multi-language support), the total effort would increase by an estimated 25-35 person-weeks, extending the timeline to 26-29 weeks. The RICE analysis should be re-run for the expanded backlog to determine whether the new features should displace existing lower-priority items or be deferred to v2.0."),

  // 10. Alignment with Business Objectives
  heading("10. Alignment with Business Objectives"),
  para("The RICE prioritization has been designed to maximize alignment with Kontakt Home's strategic objectives for the return process digitization project. The following table maps the top-ranked features to the business objectives defined in the BRD and validates that the prioritization serves the overall project goals:"),
  createTable(
    ["Business Objective", "Target KPI", "Contributing Features (by RICE Rank)", "Expected Contribution"],
    [
      ["Reduce return processing time", "From 12-15 days to 3-5 days (60-75% reduction)", "FEAT-001 (#1), FEAT-002 (#2), FEAT-004 (#6), FEAT-005 (#3)", "Automation of validation, warehouse processing, and refund execution eliminates manual handoffs and batch processing delays"],
      ["Improve customer satisfaction", "From 62% to 90%+ CSAT", "FEAT-001 (#1), FEAT-003 (#4), FEAT-006 (#5), FEAT-007 (#8)", "Self-service, proactive notifications, shipping labels, and real-time tracking transform the customer experience"],
      ["Reduce operational costs", "Save 144,000-162,000 AZN annually", "FEAT-002 (#2), FEAT-005 (#3), FEAT-009 (#11), FEAT-012 (#13)", "Automation reduces labor cost per return from 35 AZN to 12-15 AZN. Fraud prevention reduces revenue loss."],
      ["Gain data visibility", "Real-time analytics dashboard", "FEAT-008 (#7), FEAT-014 (#15), FEAT-016 (#17)", "Analytics dashboard replaces 2-day monthly manual compilation. Product quality insights enable proactive decisions."],
      ["Ensure compliance and auditability", "100% audit trail for all transactions", "FEAT-017 (#10), FEAT-010 (#5)", "RBAC and audit trail provide financial compliance. ERP integration ensures data integrity for refunds."],
    ]
  ),
  divider(),
  para("The analysis confirms strong alignment between the RICE prioritization and business objectives. The top-ranked features collectively address all five strategic objectives, with the highest-RICE features contributing to multiple objectives simultaneously. This multi-objective coverage validates that the RICE framework has successfully balanced competing priorities to deliver the maximum overall business value."),

  // 11. Recommendations and Next Steps
  heading("11. Recommendations and Next Steps"),
  para("Based on the RICE prioritization analysis, the following recommendations are made for the next phase of the project:"),
  para("Recommendation 1: Proceed with the proposed sprint plan. The RICE analysis provides strong quantitative support for the 5-sprint, 21-week delivery timeline. The prioritization is robust under sensitivity testing and aligns with both business objectives and stakeholder expectations."),
  para("Recommendation 2: Begin ERP integration proof-of-concept immediately. FEAT-010 (ERP Integration) carries the highest effort and lowest confidence of any top-priority feature. Starting the proof-of-concept during Sprint 1 will reduce uncertainty, enable early problem identification, and potentially accelerate the Sprint 2-4 timeline."),
  para("Recommendation 3: Establish a RICE re-evaluation cadence. The backlog should be re-scored at the end of each sprint using updated data on actual effort, observed impact, and refined confidence levels. This continuous re-evaluation ensures that the prioritization remains accurate as the project evolves and new information emerges."),
  para("Recommendation 4: Invest in data quality preparation for FEAT-016. Data migration confidence is the lowest among all features (60%). Beginning data audit and cleansing activities during Sprint 2-3 (before the Sprint 5 migration) will significantly improve migration success rates and reduce the risk of data integrity issues at launch."),
  para("Recommendation 5: Plan a phased production rollout. Rather than a single big-bang launch, consider a phased approach: (1) Soft launch with beta testers after Sprint 2 for standard returns only, (2) Expanded rollout after Sprint 3 adding tracking and analytics, (3) Full production release after Sprint 4 with all features, and (4) Post-launch optimization in Sprint 5 with migration and advanced analytics."),
  para("Next steps for the project team:"),
  bullet("Finalize team composition and on-board developers (Week 0)"),
  bullet("Set up development environment, CI/CD pipeline, and project management tools (Week 0)"),
  bullet("Conduct Sprint 1 planning session with detailed task breakdown for FEAT-001, FEAT-002, FEAT-003, and FEAT-017"),
  bullet("Initiate ERP integration proof-of-concept in parallel with Sprint 1 customer portal development"),
  bullet("Schedule bi-weekly stakeholder demos to maintain alignment and gather early feedback"),
  bullet("Begin data audit for historical return records to prepare for Sprint 5 migration"),

  // 12. Appendices
  heading("12. Appendices"),

  heading("12.1 RICE Formula Reference", 2),
  createTable(
    ["Component", "Definition", "Scale", "Unit"],
    [
      ["Reach (R)", "Number of users/transactions affected per year", "Absolute number", "Customers/year"],
      ["Impact (I)", "Degree of improvement for affected users", "0.25, 0.5, 1, 2, 3", "Ordinal scale"],
      ["Confidence (C)", "Certainty in R, I, and E estimates", "0.5 to 1.0 (50% to 100%)", "Percentage"],
      ["Effort (E)", "Person-time required for implementation", "Absolute number", "Person-weeks"],
      ["RICE Score", "(R x I x C) / E", "Calculated", "Score (higher is better)"],
    ]
  ),
  divider(),

  heading("12.2 Feature Effort Breakdown by Activity", 2),
  createTable(
    ["Feature ID", "Design", "Development", "Testing", "Documentation", "Deployment", "Total"],
    riceItems.map(item => {
      const dev = Math.round(item.effort * 0.55);
      const test = Math.round(item.effort * 0.2);
      const design = Math.round(item.effort * 0.1);
      const docs = Math.round(item.effort * 0.05);
      const deploy = item.effort - dev - test - design - docs;
      return [item.id, `${design}w`, `${dev}w`, `${test}w`, `${docs}w`, `${deploy}w`, `${item.effort}w`];
    })
  ),
  divider(),

  heading("12.3 Glossary of Terms", 2),
  createTable(
    ["Term", "Definition"],
    [
      ["RICE", "Reach, Impact, Confidence, Effort - a product prioritization framework"],
      ["MoSCoW", "Must Have, Should Have, Could Have, Won't Have - a prioritization classification method"],
      ["RMA", "Return Merchandise Authorization - a unique identifier assigned to approved return requests"],
      ["RBAC", "Role-Based Access Control - a method of restricting system access based on user roles"],
      ["MVP", "Minimum Viable Product - the smallest feature set that delivers core value"],
      ["ERP", "Enterprise Resource Planning - Kontakt Home's core business management system"],
      ["CSAT", "Customer Satisfaction Score - a metric measuring customer happiness with a service"],
      ["NPS", "Net Promoter Score - a metric measuring customer loyalty and likelihood to recommend"],
      ["FTE", "Full-Time Equivalent - a unit measuring employee workload"],
      ["POC", "Proof of Concept - a preliminary test to validate technical feasibility"],
      ["SLA", "Service Level Agreement - a commitment to response/processing time standards"],
      ["KPI", "Key Performance Indicator - a measurable value demonstrating business objective achievement"],
    ]
  ),
  divider(),

  heading("12.4 References", 2),
  bullet("Kontakt Home BRD - Product Return Process Digitization (RMS-BRD-001, Version 1.0)"),
  bullet("Kontakt Home FRD - Return Management System (RMS-FRD-001, Version 1.0)"),
  bullet("Kontakt Home SRS - Return Management System (RMS-SRS-001, Version 1.0)"),
  bullet("Kontakt Home User Stories - Return Management System (RMS-US-001, Version 1.0)"),
  bullet("Kontakt Home Acceptance Criteria - Return Management System (RMS-AC-001, Version 1.0)"),
  bullet("Kontakt Home As-Is / To-Be Gap Analysis (RMS-GAP-001, Version 1.0)"),
  bullet("Intercom RICE Prioritization Framework (Sean McBride, 2018)"),
  bullet("Kontakt Home Internal Return Policy Document (Version 3.2, January 2026)"),
  bullet("Kontakt Home Customer Survey Results (n=200, March 2026)"),
  bullet("Historical Return Data Analysis (October 2025 - March 2026)"),
];

// ========== ASSEMBLE DOCUMENT ==========
const doc = new docx.Document({
  creator: "Zamir Jamalov",
  title: "Backlog Prioritization (RICE) - Kontakt Home Return Management System",
  description: "RICE scoring framework for prioritizing the Return Management System product backlog",
  styles: {
    default: {
      document: {
        run: { font: "Calibri", size: 22 },
      },
    },
  },
  sections: [
    {
      properties: {},
      children: [
        ...coverChildren,
        new docx.PageBreak(),
        ...tocChildren,
        new docx.PageBreak(),
        ...mainChildren,
      ],
    },
  ],
});

const outputPath = "/home/z/my-project/ba-practice/Kontakt_Home_RICE_Backlog_Prioritization_Return_Management_System.docx";
docx.Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outputPath, buffer);
  console.log("Document generated successfully:", outputPath);
  console.log("File size:", (buffer.length / 1024).toFixed(1), "KB");
});
