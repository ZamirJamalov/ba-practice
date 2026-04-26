const docx = require("docx");
const fs = require("fs");

const COLORS = {
  deepSea: "1B3A5C", ocean: "2E86AB", sky: "A3CEF1", light: "E8F4F8",
  white: "FFFFFF", dark: "0F2439", gray: "666666", lightGray: "F5F5F5",
  accent: "1B6B93", green: "2E7D32", orange: "E65100", red: "C62828",
  purple: "6A1B9A", teal: "00796B", amber: "F57F17",
};

function heading(text, level = 1) {
  const sizes = { 1: 32, 2: 26, 3: 22, 4: 18 };
  const colors = { 1: COLORS.deepSea, 2: COLORS.ocean, 3: COLORS.accent, 4: COLORS.dark };
  return new docx.Paragraph({
    children: [new docx.TextRun({ text, bold: true, size: sizes[level] || 22, color: colors[level] || COLORS.dark, font: "Calibri" })],
    heading: level, spacing: { before: level === 1 ? 360 : 240, after: 120 },
  });
}

function para(text, opts = {}) {
  return new docx.Paragraph({ children: [new docx.TextRun({ text, size: 22, color: COLORS.dark, font: "Calibri", ...opts })], spacing: { after: 120, line: 276 } });
}

function bullet(text, level = 0) {
  return new docx.Paragraph({ children: [new docx.TextRun({ text, size: 22, color: COLORS.dark, font: "Calibri" })], bullet: { level }, spacing: { after: 60 } });
}

function codeBlock(text) {
  return text.split("\n").map((line, idx, arr) => new docx.Paragraph({
    children: [new docx.TextRun({ text: line || " ", size: 18, color: COLORS.dark, font: "Consolas" })],
    shading: { fill: COLORS.lightGray, type: "clear" },
    spacing: { before: idx === 0 ? 80 : 0, after: idx === arr.length - 1 ? 80 : 0, line: 240 },
    indent: { left: 240, right: 240 },
  }));
}

function createTable(headers, rows) {
  const hr = new docx.TableRow({ children: headers.map(h => new docx.TableCell({ children: [new docx.Paragraph({ children: [new docx.TextRun({ text: h, bold: true, size: 20, color: COLORS.white, font: "Calibri" })] })], shading: { fill: COLORS.deepSea }, width: { size: Math.floor(9000 / headers.length), type: "dxa" } })) });
  const dr = rows.map((row, idx) => new docx.TableRow({ children: row.map(cell => new docx.TableCell({ children: [new docx.Paragraph({ children: [new docx.TextRun({ text: String(cell), size: 20, color: COLORS.dark, font: "Calibri" })] })], shading: { fill: idx % 2 === 0 ? COLORS.light : COLORS.white }, width: { size: Math.floor(9000 / headers.length), type: "dxa" } })) }));
  return new docx.Table({ rows: [hr, ...dr], width: { size: 9000, type: "dxa" } });
}

function coloredPara(text, color) {
  return new docx.Paragraph({ children: [new docx.TextRun({ text, size: 22, color, font: "Calibri" })], spacing: { after: 120, line: 276 } });
}
function divider() { return new docx.Paragraph({ spacing: { before: 80, after: 80 }, children: [] }); }

// ========== COVER PAGE ==========
function coverPage() {
  return [
    new docx.Paragraph({ spacing: { before: 3600 }, children: [] }),
    new docx.Paragraph({ children: [new docx.TextRun({ text: "KONTAKT HOME", bold: true, size: 56, color: COLORS.deepSea, font: "Calibri" })], alignment: "center", spacing: { after: 80 } }),
    new docx.Paragraph({ children: [new docx.TextRun({ text: "UAT Planning & Coordination", bold: true, size: 40, color: COLORS.ocean, font: "Calibri" })], alignment: "center", spacing: { after: 200 } }),
    new docx.Paragraph({ children: [new docx.TextRun({ text: "Return Management System", size: 28, color: COLORS.accent, font: "Calibri" })], alignment: "center", spacing: { after: 100 } }),
    new docx.Paragraph({ children: [new docx.TextRun({ text: "Test Strategy, Scenarios, Scheduling, Roles,", size: 22, color: COLORS.gray, font: "Calibri" })], alignment: "center", spacing: { after: 40 } }),
    new docx.Paragraph({ children: [new docx.TextRun({ text: "Defect Management, and Go/No-Go Decision Framework", size: 22, color: COLORS.gray, font: "Calibri" })], alignment: "center", spacing: { after: 600 } }),
    new docx.Paragraph({ children: [new docx.TextRun({ text: "________________________________________", color: COLORS.ocean, size: 24, font: "Calibri" })], alignment: "center", spacing: { after: 300 } }),
    new docx.Paragraph({ children: [new docx.TextRun({ text: "Document Version: 1.0", size: 22, color: COLORS.gray, font: "Calibri" })], alignment: "center", spacing: { after: 80 } }),
    new docx.Paragraph({ children: [new docx.TextRun({ text: "Date: April 26, 2026", size: 22, color: COLORS.gray, font: "Calibri" })], alignment: "center", spacing: { after: 80 } }),
    new docx.Paragraph({ children: [new docx.TextRun({ text: "Author: Zamir Jamalov, Business Analyst", size: 22, color: COLORS.gray, font: "Calibri" })], alignment: "center", spacing: { after: 80 } }),
    new docx.Paragraph({ children: [new docx.TextRun({ text: "Classification: Confidential", size: 22, color: COLORS.red, font: "Calibri", bold: true })], alignment: "center" }),
  ];
}

// ========== CONTENT ==========
const content = [];

// TOC
content.push(heading("Table of Contents", 1));
const tocItems = [
  "1. Introduction and Purpose",
  "2. UAT Scope and Objectives",
  "3. UAT Strategy and Approach",
  "4. Test Environment Setup",
  "5. UAT Roles and Responsibilities",
  "6. UAT Test Scenarios and Test Cases",
  "7. UAT Test Data Requirements",
  "8. UAT Schedule and Timeline",
  "9. Entry and Exit Criteria",
  "10. Defect Management Process",
  "11. UAT Execution Guidelines",
  "12. Go/No-Go Decision Framework",
  "13. Sign-off Process",
  "14. Communication Plan",
  "15. Risk Assessment and Mitigation",
  "16. UAT Metrics and KPIs",
  "17. Requirement Traceability Matrix",
  "18. Appendices",
];
tocItems.forEach(t => content.push(new docx.Paragraph({ children: [new docx.TextRun({ text: t, size: 22, color: COLORS.dark, font: "Calibri" })], spacing: { after: 60 } })));

// ========== 1. INTRODUCTION ==========
content.push(heading("1. Introduction and Purpose", 1));
content.push(para("This document defines the User Acceptance Testing (UAT) strategy, planning, and coordination framework for the Kontakt Home Return Management System (RMS). UAT is the final phase of the software testing lifecycle where the actual business users validate that the system meets their requirements and is ready for production deployment. This document serves as the single source of truth for all UAT-related activities, ensuring that testing is systematic, well-coordinated, and aligned with business objectives."));
content.push(para("The Kontakt Home RMS is being developed to digitize the product return and exchange process for Azerbaijan's largest electronics retailer. Currently, the company processes over 500 return requests per month with an average processing time of 12-15 days and a customer satisfaction rate of 62%. The new system targets a reduction in processing time to 3-5 days and an improvement in customer satisfaction to 85% or above. UAT is critical to validate that the system achieves these business objectives and delivers the expected return on investment."));
content.push(para("The primary objectives of this UAT planning document are to define the scope of user acceptance testing for all RMS modules, establish clear roles and responsibilities for the UAT team, provide a comprehensive catalog of test scenarios covering all 18 features and 12 requirements, define the testing timeline with milestones and dependencies, establish entry and exit criteria for UAT commencement and completion, describe the defect management process with severity classification and escalation paths, and provide the Go/No-Go decision framework that stakeholders will use to authorize production release."));

content.push(heading("1.1 Document Scope", 2));
content.push(para("This UAT plan covers the complete Return Management System including all modules that have been developed through Sprint 1 to Sprint 5 as defined in the RICE Backlog Prioritization document. The testing scope includes the customer self-service return portal, the support agent dashboard, the warehouse mobile application, the manager analytics dashboard, the admin configuration console, and all backend API integrations including ERP financial module, email/SMS notification gateways, and barcode scanning services."));

content.push(heading("1.2 Referenced Documents", 2));
content.push(createTable(
  ["Document", "Version", "Purpose"],
  [
    ["Business Requirements Document (BRD)", "1.0", "Business context, KPIs, stakeholder map"],
    ["Functional Requirements Document (FRD)", "1.0", "Detailed functional specifications"],
    ["Software Requirements Specification (SRS)", "1.0", "System-level technical requirements"],
    ["User Stories", "1.0", "Agile user stories with acceptance criteria"],
    ["Acceptance Criteria", "1.0", "Detailed acceptance criteria for all features"],
    ["RICE Backlog Prioritization", "1.0", "Feature prioritization and sprint allocation"],
    ["REST API & JSON Specification", "1.0", "API contract for integration testing"],
    ["Swagger / OpenAPI 3.0 Specification", "1.0", "API schema validation reference"],
    ["Postman API Testing", "1.0", "API test suite for reference"],
    ["As-Is / To-Be Gap Analysis", "1.0", "Process transformation reference"],
  ]
));

// ========== 2. SCOPE ==========
content.push(heading("2. UAT Scope and Objectives", 1));
content.push(para("The UAT scope is defined by the features prioritized in the RICE Backlog and the requirements specified in the SRS (REQ-101 through REQ-112). The testing scope encompasses all Must-Have and Should-Have features across the five sprint releases, covering the complete return lifecycle from customer submission through refund processing and analytics reporting. This section clearly delineates what is in scope for UAT and what is explicitly excluded to manage stakeholder expectations."));

content.push(heading("2.1 In-Scope Items", 2));
content.push(createTable(
  ["Module", "Features", "Priority", "Sprint"],
  [
    ["Customer Portal", "Return submission, eligibility check, order lookup", "Must-Have", "Sprint 1-2"],
    ["Support Agent Dashboard", "Return queue, status updates, manual notifications", "Must-Have", "Sprint 2-3"],
    ["Validation Engine", "Auto-eligibility rules, policy enforcement", "Must-Have", "Sprint 1"],
    ["Warehouse Mobile App", "Barcode scanning, receiving, inspection, grading", "Must-Have", "Sprint 3-4"],
    ["Refund Processing", "Auto-calculation, ERP integration, status tracking", "Must-Have", "Sprint 4"],
    ["Notification System", "Email and SMS at each milestone", "Should-Have", "Sprint 2-3"],
    ["Manager Dashboard", "KPIs, trends, category analytics", "Should-Have", "Sprint 4-5"],
    ["Report Export", "PDF and Excel report generation", "Should-Have", "Sprint 5"],
    ["Admin Console", "Policy rules, user management, audit trail", "Should-Have", "Sprint 4-5"],
    ["RBAC & Security", "Role-based access for 5 user types", "Must-Have", "Sprint 1"],
  ]
));

content.push(heading("2.2 Out-of-Scope Items", 2));
content.push(bullet("Integration with third-party logistics providers (DHL, UPS) - planned for Phase 2"));
content.push(bullet("Mobile native applications (iOS/Android) - currently web-based PWA only"));
content.push(bullet("Multi-language support beyond Azerbaijani and English"));
content.push(bullet("AI-powered return prediction and recommendation engine"));
content.push(bullet("Integration with accounting software beyond the ERP financial module"));
content.push(bullet("Customer loyalty points adjustment for returns (future enhancement)"));
content.push(bullet("Real-time chat support integration within the return portal"));
content.push(bullet("Batch return processing for corporate/B2B customers"));

content.push(heading("2.3 UAT Objectives", 2));
content.push(para("The UAT process is designed to achieve the following measurable objectives that directly align with the business goals defined in the BRD. Each objective has a quantifiable target that will be used to determine UAT success during the Go/No-Go evaluation:"));
content.push(createTable(
  ["Objective", "Target", "Measurement Method"],
  [
    ["Validate all Must-Have features work as specified", "100% pass rate", "Test case execution results"],
    ["Validate all Should-Have features work as specified", "95% pass rate", "Test case execution results"],
    ["Verify end-to-end return lifecycle completes without errors", "10/10 scenarios pass", "E2E workflow test runs"],
    ["Confirm response time meets SLA requirements", "P95 within baseline", "Performance monitoring"],
    ["Validate all 5 user roles can perform their workflows", "100% role coverage", "Role-based test execution"],
    ["Verify RBAC enforcement across all endpoints", "0 unauthorized access", "Security test results"],
    ["Confirm ERP integration processes refunds correctly", "100% accuracy", "Financial reconciliation"],
    ["Validate notification delivery rate", "98%+ delivery", "Notification logs review"],
    ["Measure customer workflow completion time", "< 5 minutes", "Time tracking per scenario"],
    ["Identify critical and high severity defects", "0 critical at exit", "Defect metrics"],
  ]
));

// ========== 3. STRATEGY ==========
content.push(heading("3. UAT Strategy and Approach", 1));
content.push(para("The UAT strategy for the Kontakt Home RMS follows a risk-based, multi-phase approach that combines scenario-based testing with exploratory testing to maximize defect discovery while respecting the time constraints of the UAT schedule. The strategy is designed to involve real business users from each department who bring domain expertise that cannot be replicated by the QA team alone. Their involvement ensures that the system not only meets technical specifications but also aligns with actual business workflows and user expectations."));

content.push(heading("3.1 Testing Types", 2));
content.push(heading("3.1.1 Scenario-Based Testing", 3));
content.push(para("Scenario-based testing forms the backbone of the UAT effort. Each test scenario represents a real-world business situation that a user would encounter in their daily work. Scenarios are derived directly from the user stories documented in the User Stories document and the acceptance criteria defined in the Acceptance Criteria document. Each scenario includes preconditions, step-by-step instructions, expected results, and post-conditions. The scenarios cover both the happy path (normal flow) and alternate paths (exceptions, edge cases) for every feature."));

content.push(heading("3.1.2 Exploratory Testing", 3));
content.push(para("Exploratory testing sessions give UAT participants the freedom to navigate the system organically, trying combinations of actions that may not be covered by scripted test cases. This approach is particularly valuable for discovering usability issues, workflow friction points, and unexpected system behaviors that arise from the complex interactions between features. Each exploratory session is time-boxed to 60 minutes and follows a charter that defines the area of focus while allowing the tester freedom in their approach."));

content.push(heading("3.1.3 Regression Testing", 3));
content.push(para("Regression testing ensures that fixes applied to defects discovered during UAT do not introduce new issues in previously working functionality. The regression test suite consists of a prioritized subset of test cases covering the most critical business flows. Any defect fix triggers the execution of the regression suite relevant to the affected module. Full regression is executed before each UAT milestone review and before the final Go/No-Go decision."));

content.push(heading("3.1.4 Integration Testing", 3));
content.push(para("Integration testing during UAT validates the interactions between the RMS and external systems including the ERP financial module for refund processing, the email gateway for customer notifications, the SMS gateway for mobile notifications, and the barcode scanner hardware for warehouse operations. These tests use the staging environment with real (or production-like) external system connections to verify end-to-end data flow and transaction integrity."));

content.push(heading("3.2 Testing Phases", 2));
content.push(createTable(
  ["Phase", "Duration", "Focus", "Participants", "Deliverable"],
  [
    ["Phase 0: UAT Prep", "3 days", "Environment setup, data loading, orientation", "BA + QA Lead + Dev", "UAT Readiness Checklist"],
    ["Phase 1: Core Scenarios", "5 days", "Happy path for all Must-Have features", "All UAT participants", "Test Execution Report"],
    ["Phase 2: Alternate Flows", "4 days", "Error handling, edge cases, exceptions", "Agent + Warehouse users", "Defect Log"],
    ["Phase 3: E2E Workflows", "3 days", "Full return lifecycle across roles", "Cross-role teams", "E2E Results Matrix"],
    ["Phase 4: Regression", "2 days", "Verify defect fixes, no regressions", "QA Lead + UAT leads", "Regression Report"],
    ["Phase 5: Sign-off", "1 day", "Go/No-Go evaluation, sign-off meeting", "All stakeholders", "UAT Sign-off Document"],
  ]
));

// ========== 4. ENVIRONMENT ==========
content.push(heading("4. Test Environment Setup", 1));
content.push(para("The UAT environment must closely replicate the production environment to ensure that test results are representative of actual system behavior. The environment includes the complete technology stack, pre-loaded test data, configured integrations, and access credentials for all UAT participants. This section details the hardware, software, network, and data requirements for the UAT testing environment."));

content.push(heading("4.1 Environment Architecture", 2));
content.push(createTable(
  ["Component", "UAT Specification", "Production Equivalent"],
  [
    ["Application Server", "3x Azure B3ms (4 vCPU, 16 GB RAM)", "3x Azure B3ms (same)"],
    ["Database Server", "Azure PostgreSQL Flexible Server, 4 vCPU, 32 GB", "Same specification"],
    ["Cache Layer", "Azure Redis Cache, Standard C1", "Same specification"],
    ["API Gateway", "Azure API Management, Developer tier", "Premium tier (production)"],
    ["Storage", "Azure Blob Storage (documents, photos)", "Same specification"],
    ["Email Gateway", "SendGrid staging environment", "SendGrid production"],
    ["SMS Gateway", "Twilio staging (messages logged, not sent)", "Twilio production"],
    ["ERP Connection", "SAP staging instance (mirror of production data)", "SAP production"],
    ["Monitoring", "Azure Application Insights", "Same with production alerts"],
    ["URL", "https://rms-uat.kontakthome.az", "https://rms.kontakthome.az"],
  ]
));

content.push(heading("4.2 UAT Readiness Checklist", 2));
content.push(para("Before UAT can commence, the following prerequisites must be verified and confirmed by the QA Lead. Each item must be marked as complete before the UAT kick-off meeting. This checklist ensures that the testing environment is fully functional and that UAT participants have everything they need to begin testing effectively from day one."));
content.push(createTable(
  ["Item", "Description", "Owner", "Status"],
  [
    ["UAT-ENV-01", "Application deployed to UAT environment", "DevOps", "Pending"],
    ["UAT-ENV-02", "Database seeded with test data (orders, customers, products)", "DBA", "Pending"],
    ["UAT-ENV-03", "All API endpoints responding with 200 OK health check", "Backend Dev", "Pending"],
    ["UAT-ENV-04", "ERP staging integration verified (refund submit + query)", "Integration Dev", "Pending"],
    ["UAT-ENV-05", "Email gateway connected and test email received", "Backend Dev", "Pending"],
    ["UAT-ENV-06", "SMS gateway connected and test SMS logged", "Backend Dev", "Pending"],
    ["UAT-ENV-07", "User accounts created for all UAT participants", "Admin", "Pending"],
    ["UAT-ENV-08", "Role-based access verified for all 5 roles", "QA Lead", "Pending"],
    ["UAT-ENV-09", "Barcode scanner paired with warehouse test device", "QA Lead", "Pending"],
    ["UAT-ENV-10", "All test data files loaded (orders, products, serial numbers)", "BA", "Pending"],
    ["UAT-ENV-11", "Defect tracking tool configured (Jira UAT project)", "QA Lead", "Pending"],
    ["UAT-ENV-12", "UAT orientation session completed with all participants", "BA", "Pending"],
    ["UAT-ENV-13", "Test scenario document distributed to all testers", "BA", "Pending"],
    ["UAT-ENV-14", "Communication channels set up (Teams group, email list)", "BA", "Pending"],
    ["UAT-ENV-15", "Performance baseline established from initial test run", "QA Lead", "Pending"],
  ]
));

content.push(heading("4.3 Test Data Requirements", 2));
content.push(para("Realistic test data is essential for effective UAT. The test data must represent the variety of situations that users encounter in production, including different product categories, return reasons, customer profiles, order histories, and edge conditions. The BA team is responsible for preparing the test data set in consultation with business users to ensure accuracy and comprehensiveness."));
content.push(createTable(
  ["Data Category", "Quantity", "Description", "Source"],
  [
    ["Customer accounts", "25", "Mix of new, regular, and VIP customers", "Anonymized production export"],
    ["Orders with items", "50", "Various product categories and price points", "Test data factory"],
    ["Products (returnable)", "30", "TVs, smartphones, laptops, audio, appliances", "Product catalog copy"],
    ["Products (non-returnable)", "5", "Clearance, gift cards, software licenses", "Policy configuration"],
    ["Serial numbers", "50", "Matched to products for warehouse scanning", "Generated"],
    ["Return history records", "20", "Previous returns for repeat customer testing", "Historical data"],
    ["Expired warranty items", "5", "For warranty validation testing", "Historical data"],
    ["Edge case orders", "10", "International orders, bulk orders, partial returns", "Custom created"],
  ]
));

// ========== 5. ROLES ==========
content.push(heading("5. UAT Roles and Responsibilities", 1));
content.push(para("Clear role definition is critical for efficient UAT execution. Each participant has specific responsibilities aligned with their domain expertise and system access level. The UAT team comprises business users from four departments (Customer Service, Warehouse, Finance, IT Management) supported by the project team (Business Analyst, QA Lead, Development Lead). This section defines each role, its responsibilities during UAT, and the expected time commitment."));

content.push(heading("5.1 UAT Team Roster", 2));
content.push(createTable(
  ["Role", "Name / Representative", "Department", "UAT Responsibilities", "Time Commitment"],
  [
    ["UAT Sponsor", "Elvin Hasanov (IT Director)", "IT Management", "Go/No-Go decision, escalate blockers, resource approval", "2 hrs/week"],
    ["UAT Coordinator", "Zamir Jamalov (BA)", "IT / Project", "Plan, schedule, facilitate, report, coordinate", "Full-time"],
    ["QA Lead", "Aysel Karimova", "QA Team", "Environment, defect triage, regression, metrics", "Full-time"],
    ["Dev Lead", "Tural Mamedov", "Development", "Fix defects, deployment, technical support", "On-call"],
    ["Customer Tester 1", "Leyla Aliyeva", "Customer Service", "Test customer portal, verify notifications", "3 hrs/day"],
    ["Customer Tester 2", "Rashad Huseynov", "Customer Service", "Test agent dashboard, return queue mgmt", "3 hrs/day"],
    ["Warehouse Tester 1", "Samir Novruzov", "Warehouse Ops", "Test receiving, inspection, barcode scan", "3 hrs/day"],
    ["Warehouse Tester 2", "Nigar Mehdiyeva", "Warehouse Ops", "Test grading criteria, disposition flows", "3 hrs/day"],
    ["Finance Tester", "Vusal Ahmadov", "Finance", "Test refund calculations, ERP integration", "2 hrs/day"],
    ["Manager Tester", "Gulnara Sultanova", "Operations Mgmt", "Test analytics dashboard, report export", "2 hrs/day"],
    ["Admin Tester", "Elvin Hasanov", "IT Management", "Test policy rules, audit trail, users", "1 hr/day"],
  ]
));

content.push(heading("5.2 RACI Matrix", 2));
content.push(para("The RACI matrix below defines the responsibility assignments for key UAT activities. R = Responsible (does the work), A = Accountable (approves the outcome), C = Consulted (provides input), I = Informed (kept up to date)."));
content.push(createTable(
  ["Activity", "Sponsor", "Coord (BA)", "QA Lead", "Dev Lead", "Testers"],
  [
    ["Define UAT scope and objectives", "A", "R", "C", "C", "I"],
    ["Prepare test scenarios and data", "I", "R", "C", "C", "C"],
    ["Set up UAT environment", "I", "C", "R", "R", "I"],
    ["Conduct UAT orientation", "I", "R", "R", "C", "C"],
    ["Execute test scenarios", "I", "C", "C", "I", "R"],
    ["Log and report defects", "I", "C", "R", "C", "R"],
    ["Triage and prioritize defects", "I", "C", "R", "R", "C"],
    ["Fix defects and redeploy", "I", "I", "C", "R", "I"],
    ["Execute regression tests", "I", "C", "R", "I", "C"],
    ["Prepare UAT summary report", "I", "R", "R", "C", "I"],
    ["Go/No-Go decision", "R", "C", "C", "C", "I"],
    ["Sign-off approval", "R", "A", "C", "I", "I"],
  ]
));

// ========== 6. TEST SCENARIOS ==========
content.push(heading("6. UAT Test Scenarios and Test Cases", 1));
content.push(para("This section presents the complete catalog of UAT test scenarios organized by business module. Each scenario represents a real-world user workflow and contains multiple individual test cases with detailed steps, expected results, and mapping to system requirements. The scenarios are prioritized based on business criticality and are designed to be executed by business users without requiring technical knowledge. In total, the UAT test suite comprises 45 test cases across 12 test scenarios covering all major system functionalities."));

content.push(heading("6.1 Scenario Overview", 2));
content.push(createTable(
  ["ID", "Scenario Name", "Module", "Test Cases", "Priority", "Mapped REQs"],
  [
    ["UAT-S01", "Customer Return Submission", "Customer Portal", "5", "P0 - Critical", "REQ-101, REQ-102, REQ-103"],
    ["UAT-S02", "Return Eligibility Validation", "Validation Engine", "4", "P0 - Critical", "REQ-102, REQ-110"],
    ["UAT-S03", "Agent Return Queue Management", "Agent Dashboard", "4", "P0 - Critical", "REQ-101, REQ-108"],
    ["UAT-S04", "Warehouse Receiving and Inspection", "Warehouse Ops", "5", "P0 - Critical", "REQ-104, REQ-105"],
    ["UAT-S05", "Refund Calculation and Processing", "Refund Module", "4", "P0 - Critical", "REQ-106, REQ-107"],
    ["UAT-S06", "Notification Delivery", "Notifications", "3", "P1 - High", "REQ-108"],
    ["UAT-S07", "Analytics Dashboard and Reporting", "Analytics", "4", "P1 - High", "REQ-109"],
    ["UAT-S08", "Admin Policy Configuration", "Admin Console", "3", "P1 - High", "REQ-111, REQ-112"],
    ["UAT-S09", "Return Cancellation Workflow", "Cross-Module", "3", "P1 - High", "REQ-101"],
    ["UAT-S10", "Role-Based Access Control", "Security", "4", "P0 - Critical", "REQ-110"],
    ["UAT-S11", "End-to-End Return Lifecycle", "E2E", "3", "P0 - Critical", "REQ-101 to REQ-108"],
    ["UAT-S12", "Audit Trail and Compliance", "Admin Console", "3", "P2 - Medium", "REQ-111"],
  ]
));

// --- UAT-S01 ---
content.push(heading("6.2 UAT-S01: Customer Return Submission", 2));
content.push(para("This scenario validates the complete customer-facing return submission workflow. The customer logs into the portal, searches for their order, selects items to return, provides return reasons and condition assessment, uploads photos, submits the return request, and receives confirmation via email and SMS. The scenario covers both the happy path (eligible return) and alternate paths (ineligible return, partial return, multi-item return)."));
content.push(heading("Test Case UAT-TC-001: Submit Eligible Single-Item Return", 3));
content.push(createTable(
  ["Step", "Action", "Expected Result", "Pass/Fail"],
  [
    ["1", "Navigate to https://rms-uat.kontakthome.az and log in as customer", "Login successful, dashboard displayed", ""],
    ["2", "Click 'Start Return' and enter order number ORD-2026-48721", "Order found, items displayed with details", ""],
    ["3", "Select Samsung 55\" Smart TV (OI-10482) for return", "Item highlighted, reason selection enabled", ""],
    ["4", "Choose 'DEFECTIVE' as return reason, enter description", "Description field accepts up to 500 chars", ""],
    ["5", "Select product condition 'GOOD', upload 2 defect photos", "Photos uploaded, thumbnails displayed", ""],
    ["6", "Select preferred resolution 'REFUND'", "Resolution option highlighted", ""],
    ["7", "Review return summary and click 'Submit Return'", "RMA number generated (RMA-YYYY-NNNNNN)", ""],
    ["8", "Verify confirmation email received at customer email", "Email received within 60 seconds", ""],
    ["9", "Verify SMS confirmation received", "SMS received within 60 seconds", ""],
    ["10", "Click 'Download Shipping Label' link", "PDF label downloads with correct address", ""],
  ]
));

content.push(heading("Test Case UAT-TC-002: Return Eligibility Check Before Submission", 3));
content.push(createTable(
  ["Step", "Action", "Expected Result", "Pass/Fail"],
  [
    ["1", "Navigate to 'Check Return Eligibility' page", "Eligibility form displayed", ""],
    ["2", "Enter order number and product SKU ELK-SMRT-TV-055", "System validates order exists", ""],
    ["3", "Click 'Check Eligibility'", "Eligibility result: ELIGIBLE displayed", ""],
    ["4", "Verify all 4 validation rules show PASSED", "Return Window, Category, History, Warranty all PASS", ""],
    ["5", "Verify available resolutions listed", "REFUND, EXCHANGE, STORE_CREDIT options shown", ""],
    ["6", "Click 'Proceed with Return'", "Redirected to return submission form pre-filled", ""],
  ]
));

content.push(heading("Test Case UAT-TC-003: Submit Ineligible Return (Expired Window)", 3));
content.push(createTable(
  ["Step", "Action", "Expected Result", "Pass/Fail"],
  [
    ["1", "Navigate to eligibility check, enter order ORD-2026-44010", "Order found (purchase date 60+ days ago)", ""],
    ["2", "Click 'Check Eligibility'", "Result: NOT ELIGIBLE displayed in red", ""],
    ["3", "Verify Return Window rule shows FAILED", "Rule detail shows 'outside 14-day window'", ""],
    ["4", "Verify no resolution options available", "Options section is empty or hidden", ""],
    ["5", "Verify helpful message displayed to customer", "Message explains return policy and contact info", ""],
  ]
));

content.push(heading("Test Cases UAT-TC-004 and UAT-TC-005: Multi-Item Return and Partial Return", 3));
content.push(para("UAT-TC-004 tests submitting a return for multiple items within the same order (up to the maximum of 10 items). The tester adds 3 items from order ORD-2026-49880, assigns different return reasons to each, and verifies that the total estimated refund matches the sum of individual item prices. UAT-TC-005 tests returning only a subset of items from a multi-item order, verifying that the remaining items are not affected and the order status is updated correctly to reflect the partial return."));

// --- UAT-S02 ---
content.push(heading("6.3 UAT-S02: Return Eligibility Validation", 2));
content.push(para("This scenario focuses specifically on the validation engine's rule enforcement. Test cases verify each of the four primary validation rules (return window, product category, return history, warranty status) independently and in combination. The scenario also tests rule boundary conditions such as purchases made exactly on the window boundary date and customers with return counts exactly at the threshold."));

content.push(heading("Test Case UAT-TC-006: All Validation Rules Pass", 3));
content.push(createTable(
  ["Rule Tested", "Test Data", "Expected Result", "Pass/Fail"],
  [
    ["Return Window", "Purchase date: 3 days ago", "PASS - 11 days remaining", ""],
    ["Product Category", "Product: ELK-SMRT-TV-055 (TV)", "PASS - TV is returnable", ""],
    ["Return History", "Customer has 1 return in 12 months", "PASS - Below threshold of 5", ""],
    ["Warranty Status", "Product warranty expires in 11 months", "PASS - Within warranty", ""],
  ]
));

content.push(heading("Test Case UAT-TC-007: Product Category Non-Returnable", 3));
content.push(createTable(
  ["Rule Tested", "Test Data", "Expected Result", "Pass/Fail"],
  [
    ["Return Window", "Purchase date: 2 days ago", "PASS", ""],
    ["Product Category", "Product: CLEARANCE-SPEAKER-01", "FAIL - Clearance not returnable", ""],
  ]
));
content.push(para("The tester expects to see the system reject the return with a clear message indicating that clearance items are not eligible for return, along with a reference to the relevant policy section (Return Policy v3.2, Section 3.1)."));

// --- UAT-S03 ---
content.push(heading("6.4 UAT-S03: Agent Return Queue Management", 2));
content.push(para("This scenario validates the support agent's ability to view, filter, sort, and manage return requests in their queue. Test cases cover filtering by status, searching by customer name or RMA number, updating return statuses, adding internal notes, and manually triggering notifications. The scenario ensures that agents can efficiently manage their workload and provide timely customer support through the return process."));
content.push(createTable(
  ["Test Case ID", "Description", "Key Validation Points", "Priority"],
  [
    ["UAT-TC-008", "View and filter return queue by status", "Correct returns shown for each status filter", "P0"],
    ["UAT-TC-009", "Search return by RMA number", "Exact match returned, full details accessible", "P0"],
    ["UAT-TC-010", "Update return status with notes", "Status changes, timeline updated, notification sent", "P0"],
    ["UAT-TC-011", "Send manual notification to customer", "Notification queued, copy sent to agent", "P1"],
  ]
));

// --- UAT-S04 ---
content.push(heading("6.5 UAT-S04: Warehouse Receiving and Inspection", 2));
content.push(para("This scenario validates the warehouse operations workflow including barcode scanning for item receipt, condition assessment and grading, photographic evidence capture, and disposition assignment. Test cases cover the complete warehouse flow from receiving an item through completing inspection and triggering the refund process. The scenario tests both the web interface and the mobile barcode scanning functionality."));

content.push(heading("Test Case UAT-TC-012: Receive Item via Barcode Scan", 3));
content.push(createTable(
  ["Step", "Action", "Expected Result", "Pass/Fail"],
  [
    ["1", "Open warehouse mobile app, log in as warehouse staff", "Dashboard with queue displayed", ""],
    ["2", "Scan RMA barcode on package (RMA-2026-000047)", "RMA details displayed for verification", ""],
    ["3", "Verify expected item matches physical item", "Product name, SKU, serial displayed", ""],
    ["4", "Select carrier: AZERPOST, enter tracking number", "Carrier info saved", ""],
    ["5", "Select package condition: GOOD", "Condition recorded", ""],
    ["6", "Tap 'Confirm Receipt'", "Status changes to RECEIVED, inspection timer starts", ""],
    ["7", "Verify item appears in inspection queue", "Item visible with 24h SLA countdown", ""],
  ]
));

content.push(heading("Test Case UAT-TC-013: Complete Quality Inspection - Grade B", 3));
content.push(createTable(
  ["Step", "Action", "Expected Result", "Pass/Fail"],
  [
    ["1", "Select item from inspection queue", "Inspection form opens", ""],
    ["2", "Set packaging: INTACT, accessories: COMPLETE", "Fields accepted", ""],
    ["3", "Set cosmetic condition: MINOR_MARKS", "Grade indicator updates", ""],
    ["4", "Set functional test: PASSED", "Grade indicator shows B", ""],
    ["5", "Select disposition: RESTOCK", "Disposition saved", ""],
    ["6", "Take 2 photos (general + defect annotation)", "Photos uploaded and linked", ""],
    ["7", "Enter inspection notes, tap 'Complete Inspection'", "Inspection saved, refund auto-triggered", ""],
    ["8", "Verify refund auto-approved message displayed", "Grade B auto-approve confirmation shown", ""],
  ]
));

content.push(heading("Test Case UAT-TC-014: Grade D Inspection Routes to Manager", 3));
content.push(para("This test verifies that when a Grade D condition is assigned (severe damage, non-functional), the system routes the return to a manager for approval rather than auto-approving the refund. The warehouse tester completes the inspection with a Grade D result and verifies that: (1) the refund is NOT auto-approved, (2) a manager approval task is created in the manager queue, (3) the customer receives a notification that the return is under review, and (4) the return status changes to REFUND_PENDING instead of REFUND_PROCESSED."));

content.push(heading("Test Case UAT-TC-015: Inspection SLA Warning and Breach", 3));
content.push(para("This test verifies that the system correctly displays SLA countdown timers on the warehouse queue and triggers warnings when the 24-hour inspection deadline is approaching. The QA Lead pre-loads a test item that was received 23 hours ago. The warehouse tester verifies that: (1) the item shows a red warning indicator, (2) the remaining time displays correctly, and (3) if the deadline passes, the item is flagged as overdue in the queue and a notification is sent to the warehouse supervisor."));

// --- UAT-S05 ---
content.push(heading("6.6 UAT-S05: Refund Calculation and Processing", 2));
content.push(para("This scenario validates the financial aspects of the return process including automated refund calculation based on condition grade and policy rules, submission of refunds to the ERP system, tracking of refund status through the complete lifecycle, and reconciliation of refund amounts with the original purchase. The Finance tester is the primary executor of these test cases given their domain expertise in financial transactions."));
content.push(createTable(
  ["Test Case ID", "Description", "Expected Calculation", "Priority"],
  [
    ["UAT-TC-016", "Grade A full refund", "100% of 1299.00 AZN = 1299.00 AZN", "P0"],
    ["UAT-TC-017", "Grade B full refund (no deductions)", "100% of 1299.00 AZN = 1299.00 AZN", "P0"],
    ["UAT-TC-018", "Store credit with 5% bonus", "105% of 1299.00 AZN = 1363.95 AZN", "P1"],
    ["UAT-TC-019", "ERP refund submission and tracking", "ERP transaction ID generated, status trackable", "P0"],
  ]
));

content.push(heading("Test Case UAT-TC-019: End-to-End ERP Integration", 3));
content.push(createTable(
  ["Step", "Action", "Expected Result", "Pass/Fail"],
  [
    ["1", "Navigate to refund detail for RMA-2026-000047", "Refund details displayed", ""],
    ["2", "Verify refund amount: 1299.00 AZN", "Amount matches calculation", ""],
    ["3", "Verify payment method: CREDIT_CARD (ending 4532)", "Card details shown", ""],
    ["4", "Click 'Process Refund'", "Confirmation dialog displayed", ""],
    ["5", "Confirm refund submission", "Status: SUBMITTED_TO_ERP, ERP ID generated", ""],
    ["6", "Wait for ERP processing (auto-poll or manual check)", "Status progresses to PROCESSING then COMPLETED", ""],
    ["7", "Verify bank reference number populated", "VISA-REF-YYYY-NNNNNN displayed", ""],
    ["8", "Verify customer notification sent on completion", "Email and SMS delivery confirmed", ""],
    ["9", "Cross-check with ERP staging dashboard", "Transaction visible in SAP staging", ""],
  ]
));

// --- UAT-S06 through UAT-S12 (condensed) ---
content.push(heading("6.7 UAT-S06: Notification Delivery", 2));
content.push(para("This scenario validates the multi-channel notification system. Test cases verify that automated notifications are sent at every key milestone of the return process, that the content is accurate and personalized, and that delivery tracking correctly reports the status of each notification. The tester checks both email and SMS channels and verifies the notification content includes the correct RMA number, status update, and action instructions."));
content.push(createTable(
  ["Test Case ID", "Description", "Validation", "Priority"],
  [
    ["UAT-TC-020", "Email notification on return approval", "Correct template, RMA number, shipping instructions", "P1"],
    ["UAT-TC-021", "SMS notification on refund completion", "Short message with refund amount and card info", "P1"],
    ["UAT-TC-022", "Manual notification by agent", "Custom message delivered, copy to agent confirmed", "P1"],
  ]
));

content.push(heading("6.8 UAT-S07: Analytics Dashboard and Reporting", 2));
content.push(para("This scenario validates the management analytics module. Test cases verify KPI accuracy, chart rendering, date range filtering, category drill-down, and report export functionality. The Operations Manager tester compares dashboard KPI values against manually calculated baseline values to verify data accuracy. Report export tests verify that generated PDF and Excel files contain the correct data, formatting, and branding."));
content.push(createTable(
  ["Test Case ID", "Description", "Validation", "Priority"],
  [
    ["UAT-TC-023", "Dashboard KPI accuracy", "Values match manual calculation within 1%", "P1"],
    ["UAT-TC-024", "Date range filter on analytics", "Data filtered to specified date range", "P1"],
    ["UAT-TC-025", "Category drill-down analytics", "TV, Phone, Laptop data correct and consistent", "P1"],
    ["UAT-TC-026", "PDF report export", "Report generated with correct data and formatting", "P2"],
  ]
));

content.push(heading("6.9 UAT-S08: Admin Policy Configuration", 2));
content.push(para("This scenario validates the admin console functionality for managing validation rules, user accounts, and audit trail. The Admin tester verifies that policy rules can be viewed and modified with proper audit trail entries, that user accounts can be created and role-assigned, and that the audit trail correctly records all significant system events with timestamps and actor information."));
content.push(createTable(
  ["Test Case ID", "Description", "Validation", "Priority"],
  [
    ["UAT-TC-027", "View and list policy rules", "All 8 rules displayed with parameters", "P1"],
    ["UAT-TC-028", "Update return window rule", "Change applied, old value preserved in audit", "P1"],
    ["UAT-TC-029", "View audit trail with filters", "Events filtered correctly by type and date", "P2"],
  ]
));

content.push(heading("6.10 UAT-S09: Return Cancellation Workflow", 2));
content.push(createTable(
  ["Test Case ID", "Description", "Validation", "Priority"],
  [
    ["UAT-TC-030", "Cancel return before receipt", "Status CANCELLED, no refund processed", "P1"],
    ["UAT-TC-031", "Attempt cancel after receipt (should fail)", "Error: Cannot cancel received item", "P1"],
    ["UAT-TC-032", "Cancel return as agent on behalf of customer", "Cancellation recorded with agent as actor", "P1"],
  ]
));

content.push(heading("6.11 UAT-S10: Role-Based Access Control", 2));
content.push(createTable(
  ["Test Case ID", "Description", "Validation", "Priority"],
  [
    ["UAT-TC-033", "Customer cannot access admin endpoints", "403 Forbidden on admin URLs", "P0"],
    ["UAT-TC-034", "Agent cannot access warehouse operations", "Warehouse menu hidden / 403 on API", "P0"],
    ["UAT-TC-035", "Warehouse staff cannot process refunds", "Refund menu hidden / 403 on API", "P0"],
    ["UAT-TC-036", "Manager can view all dashboards but not modify rules", "View: 200, Modify: 403", "P0"],
  ]
));

content.push(heading("6.12 UAT-S11: End-to-End Return Lifecycle", 2));
content.push(para("This is the most critical scenario in the entire UAT suite. It validates the complete return lifecycle across all five user roles from initial customer submission through final refund processing. The test is executed as a coordinated cross-role exercise where each participant performs their part of the workflow in sequence. Three independent E2E runs are performed covering different product types, return reasons, and resolution types."));
content.push(createTable(
  ["Test Case ID", "Scenario", "Product", "Reason", "Resolution"],
  [
    ["UAT-TC-037", "E2E: TV Defective Return to Refund", "Samsung 55\" TV (1299 AZN)", "DEFECTIVE", "REFUND"],
    ["UAT-TC-038", "E2E: Phone Wrong Item to Exchange", "iPhone 15 (899 AZN)", "WRONG_ITEM", "EXCHANGE"],
    ["UAT-TC-039", "E2E: Laptop Damaged in Transit to Store Credit", "MacBook Air (2499 AZN)", "DAMAGED_IN_TRANSIT", "STORE_CREDIT"],
  ]
));

content.push(heading("E2E Test Case UAT-TC-037: Full Lifecycle Flow", 3));
content.push(createTable(
  ["Phase", "Actor", "Action", "Expected Result"],
  [
    ["1", "Customer", "Submit return for defective TV", "RMA generated, auto-approved"],
    ["2", "System", "Send email + SMS confirmation", "Both notifications delivered"],
    ["3", "Agent", "View return in queue, verify details", "All details correct, status APPROVED"],
    ["4", "Customer", "Print shipping label, ship item", "Label PDF downloads correctly"],
    ["5", "Warehouse", "Receive package via barcode scan", "Status: RECEIVED, inspection timer starts"],
    ["6", "Warehouse", "Complete inspection (Grade B)", "Auto-approved, refund triggered"],
    ["7", "System", "Calculate refund: 1299.00 AZN", "Calculation correct, no deductions"],
    ["8", "Finance", "Verify refund in queue, process via ERP", "ERP transaction created"],
    ["9", "System", "Refund completed notification", "Email + SMS with refund details"],
    ["10", "Manager", "View return in analytics dashboard", "Return counted in KPIs"],
    ["11", "Admin", "Verify audit trail completeness", "All 11 events recorded"],
  ]
));

content.push(heading("6.13 UAT-S12: Audit Trail and Compliance", 2));
content.push(createTable(
  ["Test Case ID", "Description", "Validation", "Priority"],
  [
    ["UAT-TC-040", "All user actions logged in audit trail", "Every action has timestamp, actor, details", "P2"],
    ["UAT-TC-041", "Audit trail filterable by event type", "5 event types filter correctly", "P2"],
    ["UAT-TC-042", "Audit trail export to CSV", "Export contains all filtered events", "P2"],
  ]
));

// ========== 7. TEST DATA ==========
content.push(heading("7. UAT Test Data Requirements", 1));
content.push(para("Effective UAT requires carefully curated test data that represents the full spectrum of real-world scenarios. This section details the specific test data sets needed for each test scenario, including customer profiles, orders, products, and edge case data. All test data is pre-loaded into the UAT environment before testing begins and is isolated from production data to prevent any risk of data contamination."));

content.push(heading("7.1 Customer Profiles", 2));
content.push(createTable(
  ["Profile ID", "Name", "Email", "Return History", "Account Type", "Purpose"],
  [
    ["CUS-001", "Ramin Aliev", "ramin@test.com", "0 returns", "Regular", "New customer return"],
    ["CUS-002", "Aytan Mammadova", "aytan@test.com", "2 returns (6 mo)", "Regular", "Repeat customer"],
    ["CUS-003", "Kamran Qasimov", "kamran@test.com", "4 returns (12 mo)", "Regular", "Near threshold"],
    ["CUS-004", "Lala Huseynova", "lala@test.com", "6 returns (12 mo)", "Regular", "Exceeds threshold"],
    ["CUS-005", "Farid Ismayilov", "farid@test.com", "0 returns", "VIP / Loyalty", "VIP customer bonus"],
  ]
));

content.push(heading("7.2 Order and Product Data", 2));
content.push(createTable(
  ["Order ID", "Product", "SKU", "Price (AZN)", "Purchase Date", "Returnable"],
  [
    ["ORD-2026-48721", "Samsung 55\" Smart TV", "ELK-SMRT-TV-055", "1299.00", "3 days ago", "Yes"],
    ["ORD-2026-48800", "iPhone 15 Pro", "APL-IPH15-256", "1899.00", "7 days ago", "Yes"],
    ["ORD-2026-49001", "MacBook Air M3", "APL-MBA-M3-512", "2499.00", "10 days ago", "Yes"],
    ["ORD-2026-44100", "Sony WH-1000XM5", "SNY-WH1000-XM5", "349.00", "45 days ago", "No (expired)"],
    ["ORD-2026-44200", "Clearance Bluetooth Speaker", "CLR-BT-SPK-01", "49.00", "5 days ago", "No (clearance)"],
    ["ORD-2026-49100", "Samsung Galaxy S24", "SMS-GS24-128", "899.00", "14 days ago", "Yes (boundary)"],
  ]
));

// ========== 8. SCHEDULE ==========
content.push(heading("8. UAT Schedule and Timeline", 1));
content.push(para("The UAT execution is planned over a 3-week period (15 business days), beginning after the successful completion of System Integration Testing (SIT) and UAT environment readiness verification. The schedule includes dedicated time for orientation, test execution, defect resolution, regression testing, and the formal sign-off process. The timeline is designed to accommodate the availability constraints of business user testers who will be balancing UAT responsibilities with their regular operational duties."));

content.push(heading("8.1 UAT Timeline", 2));
content.push(createTable(
  ["Day", "Date", "Phase", "Activities", "Participants"],
  [
    ["Day 1", "May 5, 2026", "Preparation", "Environment verification, data load, account setup", "BA + QA + Dev"],
    ["Day 2", "May 6, 2026", "Preparation", "UAT orientation session, tool walkthrough", "All participants"],
    ["Day 3", "May 7, 2026", "Preparation", "Smoke test run, finalize test data, address blockers", "BA + QA"],
    ["Day 4-5", "May 8-9", "Phase 1", "UAT-S01: Customer Portal tests (TC-001 to TC-005)", "Customer testers"],
    ["Day 5-6", "May 9-10", "Phase 1", "UAT-S02: Validation Engine tests (TC-006 to TC-007)", "Customer testers"],
    ["Day 7-8", "May 12-13", "Phase 1", "UAT-S03: Agent Dashboard tests (TC-008 to TC-011)", "Agent testers"],
    ["Day 8-9", "May 13-14", "Phase 1", "UAT-S10: RBAC tests (TC-033 to TC-036)", "All roles"],
    ["Day 10", "May 15", "Phase 1", "Phase 1 review meeting, defect triage", "All participants"],
    ["Day 11-12", "May 16, 19", "Phase 2", "UAT-S04: Warehouse tests (TC-012 to TC-015)", "Warehouse testers"],
    ["Day 12-13", "May 19-20", "Phase 2", "UAT-S05: Refund tests (TC-016 to TC-019)", "Finance tester"],
    ["Day 13", "May 20", "Phase 2", "UAT-S06: Notification tests (TC-020 to TC-022)", "Agent testers"],
    ["Day 14", "May 21", "Phase 2", "Phase 2 review meeting, defect triage", "All participants"],
    ["Day 15-16", "May 22-23", "Phase 3", "UAT-S11: E2E lifecycle (TC-037 to TC-039)", "Cross-role teams"],
    ["Day 16", "May 23", "Phase 3", "UAT-S07-S12: Analytics, Admin, Cancellation, Audit", "Manager + Admin"],
    ["Day 17", "May 26", "Phase 3", "Phase 3 review meeting, final defect triage", "All participants"],
    ["Day 18-19", "May 27-28", "Phase 4", "Defect fix deployment, regression testing", "QA + Dev"],
    ["Day 20", "May 29", "Phase 4", "Regression complete, metrics compilation", "BA + QA"],
    ["Day 21", "May 30, 2026", "Phase 5", "Go/No-Go meeting, UAT sign-off", "Stakeholders"],
  ]
));

content.push(heading("8.2 Daily Schedule", 2));
content.push(para("UAT testers dedicate the first 3 hours of their workday (09:00-12:00) to UAT activities to minimize impact on their regular operational duties. The BA and QA Lead are available throughout the full business day for support, defect logging, and coordination."));
content.push(createTable(
  ["Time", "Activity", "Participants"],
  [
    ["09:00 - 09:15", "Daily standup (status, blockers, priorities)", "BA + QA + active testers"],
    ["09:15 - 12:00", "Test execution (dedicated UAT time)", "Business user testers"],
    ["12:00 - 13:00", "Lunch break", "-"],
    ["13:00 - 14:00", "Defect logging and clarification (as needed)", "Testers + BA"],
    ["14:00 - 16:00", "Defect fixing and redeployment (Dev team)", "Dev Lead + developers"],
    ["16:00 - 17:00", "Defect retesting and progress update", "QA Lead + testers"],
    ["17:00 - 17:30", "End-of-day summary and next day planning", "BA + QA Lead"],
  ]
));

// ========== 9. ENTRY/EXIT CRITERIA ==========
content.push(heading("9. Entry and Exit Criteria", 1));
content.push(para("Clear entry and exit criteria ensure that UAT begins only when the system is ready for user testing and concludes only when the quality gates are met. These criteria are non-negotiable and must be formally verified before transitioning between phases."));

content.push(heading("9.1 Entry Criteria", 2));
content.push(createTable(
  ["ID", "Criterion", "Verification Method", "Verified By", "Status"],
  [
    ["EC-01", "System Integration Testing (SIT) completed with 95%+ pass rate", "SIT test report", "QA Lead", ""],
    ["EC-02", "All critical and high severity SIT defects resolved", "Jira defect tracker", "Dev Lead", ""],
    ["EC-03", "UAT environment deployed and verified (15-item checklist)", "UAT Readiness Checklist", "QA Lead", ""],
    ["EC-04", "Test data loaded and verified against specifications", "Data validation script", "BA", ""],
    ["EC-05", "All UAT participant accounts created and access verified", "Login test for each role", "Admin", ""],
    ["EC-06", "External integrations (ERP, email, SMS) verified on staging", "Integration test results", "Dev Lead", ""],
    ["EC-07", "UAT test scenarios documented and distributed to testers", "Document shared (this doc)", "BA", ""],
    ["EC-08", "Defect tracking tool configured with UAT project", "Jira project setup", "QA Lead", ""],
    ["EC-09", "UAT orientation session completed with all testers", "Attendance sheet", "BA", ""],
    ["EC-10", "Stakeholder sign-off on UAT plan obtained", "Signed approval email", "UAT Sponsor", ""],
  ]
));

content.push(heading("9.2 Exit Criteria", 2));
content.push(createTable(
  ["ID", "Criterion", "Target", "Actual", "Status"],
  [
    ["XC-01", "All P0 (Critical) test cases executed", "100%", "", ""],
    ["XC-02", "All P0 test cases passed", "100%", "", ""],
    ["XC-03", "All P1 (High) test cases executed", "100%", "", ""],
    ["XC-04", "P1 test case pass rate", "> 95%", "", ""],
    ["XC-05", "All P2 (Medium) test cases executed", "> 80%", "", ""],
    ["XC-06", "Open Critical defects", "0", "", ""],
    ["XC-07", "Open High severity defects", "0 (or accepted with workaround)", "", ""],
    ["XC-08", "Open Medium severity defects", "< 5 (with approved workarounds)", "", ""],
    ["XC-09", "All E2E lifecycle scenarios passed", "3/3", "", ""],
    ["XC-10", "Regression test suite passed", "100%", "", ""],
    ["XC-11", "Performance baselines met (P95)", "Within SLA", "", ""],
    ["XC-12", "ERP integration tested and verified", "100% accuracy", "", ""],
    ["XC-13", "UAT sign-off obtained from all stakeholders", "Signed", "", ""],
  ]
));

// ========== 10. DEFECT MANAGEMENT ==========
content.push(heading("10. Defect Management Process", 1));
content.push(para("A structured defect management process ensures that all issues discovered during UAT are properly documented, classified, prioritized, tracked to resolution, and verified before closure. The defect management workflow is integrated with Jira and follows the severity and priority classification scheme defined below. All UAT participants are trained on the defect reporting process during the orientation session."));

content.push(heading("10.1 Severity Classification", 2));
content.push(createTable(
  ["Severity", "Definition", "Example", "Response SLA", "Fix SLA"],
  [
    ["Critical (S1)", "System is down, data loss, or complete feature failure. No workaround available.", "Return creation fails for all users; refund sent to wrong bank account", "1 hour", "24 hours"],
    ["High (S2)", "Major feature broken or significantly degraded. Workaround exists but is impractical.", "Warehouse barcode scanner not working; notifications not sending; incorrect refund calculation", "4 hours", "48 hours"],
    ["Medium (S3)", "Feature partially broken with reasonable workaround. Minor impact on user workflow.", "Dashboard chart not rendering correctly; email template formatting issue; sort filter not working", "8 hours", "Next sprint"],
    ["Low (S4)", "Cosmetic issue or minor inconvenience. No functional impact.", "Typo in label text; icon misalignment; color inconsistency in report export", "24 hours", "Backlog"],
    ["Enhancement (S5)", "Suggestion for improvement or new feature that would enhance user experience.", "Add bulk export for analytics; support dark mode; keyboard shortcuts for agents", "Acknowledged", "Product backlog"],
  ]
));

content.push(heading("10.2 Defect Lifecycle", 2));
content.push(para("Each defect follows a defined lifecycle from discovery to closure. The lifecycle ensures clear ownership at each stage and prevents defects from being lost or forgotten. The BA is responsible for tracking defect status and escalating overdue items to the appropriate stakeholders."));
content.push(createTable(
  ["Status", "Description", "Owner", "Next Action"],
  [
    ["New", "Defect reported by tester, awaiting triage", "Reporter", "Auto-assigned to QA Lead"],
    ["Triaged", "Severity and priority assigned by QA Lead", "QA Lead", "Assigned to Dev team"],
    ["In Progress", "Developer actively working on fix", "Dev Lead", "Code fix + deploy to UAT"],
    ["Ready for Retest", "Fix deployed to UAT, awaiting verification", "QA Lead", "Assign to original reporter"],
    ["Retest Passed", "Defect verified as fixed by tester", "Tester", "Close defect"],
    ["Retest Failed", "Fix did not resolve the issue or introduced regression", "Tester", "Reassign to Dev (Back to In Progress)"],
    ["Deferred", "Accepted as known issue with workaround", "UAT Sponsor", "Document workaround, track in backlog"],
    ["Closed", "Defect resolved and verified", "QA Lead", "No further action"],
  ]
));

content.push(heading("10.3 Defect Reporting Template", 2));
content.push(para("All UAT defects are reported using the following standardized template in Jira. Complete and accurate defect reports expedite the triage and resolution process. The BA is available to assist testers in writing clear defect descriptions if needed."));
content.push(...codeBlock(`Summary: [UAT] [Module] Brief description of the defect
Environment: UAT (https://rms-uat.kontakthome.az)
Browser/Device: Chrome 124 / Samsung Galaxy S24
Test Case: UAT-TC-XXX (Scenario name)
Severity: Critical / High / Medium / Low
Priority: P0 / P1 / P2

Steps to Reproduce:
1. Log in as [role] with credentials [test account]
2. Navigate to [page/section]
3. Click [button/link]
4. Enter [data]
5. Observe [behavior]

Expected Result:
[What should happen according to the test case / requirement]

Actual Result:
[What actually happened - be specific about the incorrect behavior]

Evidence:
- Screenshot: [attached]
- Video recording: [link if available]
- Console errors: [copy/paste from browser DevTools]
- Network response: [relevant API response if applicable]

Workaround:
[If a workaround exists, describe it here]

Related Requirements:
REQ-XXX, FEAT-XXX`));

// ========== 11. EXECUTION ==========
content.push(heading("11. UAT Execution Guidelines", 1));
content.push(para("This section provides practical guidance for UAT participants on how to execute their assigned test scenarios effectively. Following these guidelines ensures consistency in test execution, improves defect reporting quality, and maximizes the value of the UAT process for all stakeholders."));

content.push(heading("11.1 Pre-Execution Preparation", 2));
content.push(bullet("Review your assigned test scenarios the day before execution to understand the expected workflow"));
content.push(bullet("Ensure you have access to the UAT environment and can log in with your test credentials"));
content.push(bullet("Verify your test data is available (customer accounts, orders, products as specified in the scenario)"));
content.push(bullet("Have the defect reporting template ready (Jira access, screenshot tool configured)"));
content.push(bullet("Report any blockers to the BA or QA Lead immediately via the dedicated Teams channel"));

content.push(heading("11.2 During Execution", 2));
content.push(bullet("Follow each test step exactly as documented - do not skip steps even if they seem trivial"));
content.push(bullet("Record the actual result for each step (Pass/Fail) in the shared results tracker"));
content.push(bullet("If a step fails, do not continue with subsequent steps that depend on the failed step"));
content.push(bullet("Take a screenshot of every failure and attach it to the defect report"));
content.push(bullet("If you discover an issue not covered by the test steps, still report it as a defect"));
content.push(bullet("Perform exploratory testing after completing your scripted scenarios to find additional issues"));
content.push(bullet("Note any usability concerns, confusing workflows, or suggestions for improvement"));

content.push(heading("11.3 Post-Execution", 2));
content.push(bullet("Update the shared results tracker with final Pass/Fail status for all executed test cases"));
content.push(bullet("Ensure all discovered defects are logged in Jira with complete information"));
content.push(bullet("Participate in the daily standup and end-of-day summary meetings"));
content.push(bullet("Provide feedback on the test scenarios themselves (unclear steps, missing cases)"));

// ========== 12. GO/NO-GO ==========
content.push(heading("12. Go/No-Go Decision Framework", 1));
content.push(para("The Go/No-Go decision is the formal evaluation point where stakeholders determine whether the Return Management System is ready for production deployment. This decision is based on objective metrics derived from UAT execution results, defect status, and compliance with exit criteria. The Go/No-Go meeting is chaired by the UAT Sponsor with input from all UAT participants and is documented with a formal decision record."));

content.push(heading("12.1 Decision Criteria and Thresholds", 2));
content.push(createTable(
  ["Criterion", "Go Threshold", "Conditional Go", "No-Go Threshold", "Weight"],
  [
    ["P0 test case pass rate", "100%", "N/A (must be 100%)", "< 100%", "Critical"],
    ["P1 test case pass rate", "> 95%", "90-95%", "< 90%", "High"],
    ["Open S1 (Critical) defects", "0", "0", "> 0", "Critical"],
    ["Open S2 (High) defects", "0", "< 3 (with workarounds)", "> 3", "High"],
    ["E2E lifecycle scenarios passed", "3/3", "2/3", "< 2/3", "Critical"],
    ["ERP integration verified", "100% accuracy", "N/A", "Any discrepancy", "Critical"],
    ["Performance within SLA (P95)", "All baselines met", "< 10% deviation", "> 10% deviation", "Medium"],
    ["Regression test pass rate", "100%", "> 98%", "< 98%", "High"],
    ["Security (RBAC) verified", "0 violations", "0 violations", "Any violation", "Critical"],
    ["Stakeholder confidence", "All sign", "Majority sign with conditions", "Key stakeholder objects", "High"],
  ]
));

content.push(heading("12.2 Decision Outcomes", 2));
content.push(heading("Go Decision", 3));
content.push(para("All exit criteria are met, all critical and high severity defects are resolved, and all stakeholders have signed off. The system proceeds to production deployment planning with a targeted go-live date within 5 business days. A deployment readiness checklist is executed and a production support plan is activated."));

content.push(heading("Conditional Go Decision", 3));
content.push(para("The system is fundamentally ready for production with a small number of known issues that have documented workarounds and do not impact core business functionality. The conditional go requires written acceptance of the known issues by the UAT Sponsor, a committed fix timeline for each deferred defect (maximum 2 weeks post-launch), and enhanced production monitoring for the affected features. The deployment proceeds with the contingency plan activated."));

content.push(heading("No-Go Decision", 3));
content.push(para("The system has significant issues that prevent safe production deployment. Common reasons include unresolved critical or high severity defects, failure of core E2E scenarios, ERP integration discrepancies, or RBAC violations. The No-Go decision triggers a dedicated fix cycle (maximum 5 business days) followed by a targeted retest of the failed areas only. The full UAT cycle is not repeated, only the specific areas that caused the No-Go."));

// ========== 13. SIGN-OFF ==========
content.push(heading("13. Sign-off Process", 1));
content.push(para("The UAT sign-off is the formal acknowledgment by key stakeholders that the system has been adequately tested and meets the requirements for production deployment. Sign-off is obtained through a structured sign-off meeting where the UAT Coordinator presents the test execution summary, defect status, and metrics analysis. Each stakeholder reviews the evidence and provides their formal approval or rejection."));

content.push(heading("13.1 Sign-off Approvers", 2));
content.push(createTable(
  ["Role", "Name", "Department", "Sign-off Authority", "Decision"],
  [
    ["IT Director", "Elvin Hasanov", "IT Management", "Final Go/No-Go authority", ""],
    ["Customer Service Manager", "Leyla Aliyeva", "Customer Service", "Customer-facing feature approval", ""],
    ["Warehouse Operations Manager", "Samir Novruzov", "Warehouse", "Warehouse feature approval", ""],
    ["Finance Manager", "Vusal Ahmadov", "Finance", "Financial accuracy approval", ""],
    ["QA Manager", "Aysel Karimova", "QA", "Test quality assurance", ""],
    ["Business Analyst", "Zamir Jamalov", "Project Office", "Requirements traceability confirmation", ""],
  ]
));

content.push(heading("13.2 Sign-off Record Template", 2));
content.push(createTable(
  ["Field", "Value"],
  [
    ["Project Name", "Kontakt Home Return Management System"],
    ["UAT Period", "May 5-30, 2026 (15 business days)"],
    ["Test Cases Executed", "[TBD - populated after execution]"],
    ["Test Cases Passed", "[TBD]"],
    ["Overall Pass Rate", "[TBD]"],
    ["Critical Defects at Sign-off", "[TBD]"],
    ["High Defects at Sign-off", "[TBD]"],
    ["Decision", "GO / CONDITIONAL GO / NO-GO"],
    ["Conditions (if Conditional Go)", "[List of accepted conditions]"],
    ["Target Go-Live Date", "[TBD]"],
    ["Signed by (IT Director)", "_________________ Date: _______"],
    ["Signed by (Customer Service)", "_________________ Date: _______"],
    ["Signed by (Warehouse)", "_________________ Date: _______"],
    ["Signed by (Finance)", "_________________ Date: _______"],
    ["Signed by (QA)", "_________________ Date: _______"],
  ]
));

// ========== 14. COMMUNICATION ==========
content.push(heading("14. Communication Plan", 1));
content.push(para("Effective communication is essential for successful UAT execution. This section defines the communication channels, meeting cadences, and reporting mechanisms used throughout the UAT period. All stakeholders are informed of progress, issues, and decisions through the appropriate channels in a timely manner."));

content.push(heading("14.1 Communication Channels", 2));
content.push(createTable(
  ["Channel", "Purpose", "Participants", "Frequency"],
  [
    ["Microsoft Teams - UAT Channel", "Real-time Q&A, blockers, quick updates", "All UAT participants", "Continuous"],
    ["Email Distribution", "Formal updates, daily summary reports", "All stakeholders", "Daily (EOD)"],
    ["Daily Standup Meeting", "Status, blockers, re-prioritization", "BA + QA + active testers", "Daily (09:00)"],
    ["Phase Review Meeting", "Phase completion review, defect triage", "All participants", "End of each phase"],
    ["UAT Steering Committee", "Executive status, critical escalations", "Sponsor + Dept Heads", "Weekly (Monday)"],
    ["Go/No-Go Meeting", "Final evaluation and decision", "All sign-off approvers", "End of UAT"],
  ]
));

content.push(heading("14.2 Reporting Cadence", 2));
content.push(createTable(
  ["Report", "Audience", "Content", "Frequency", "Format"],
  [
    ["Daily Test Status", "All participants", "Cases executed/passed/failed, new defects, blockers", "Daily EOD", "Email + Teams"],
    ["Weekly UAT Progress", "Steering committee", "Cumulative metrics, risk status, phase completion %", "Weekly", "Email (PDF)"],
    ["Defect Status Report", "Dev team + QA", "Open/Resolved by severity, aging, SLA compliance", "Daily", "Jira dashboard"],
    ["UAT Summary Report", "All stakeholders", "Final metrics, sign-off recommendation, risks", "End of UAT", "Formal document"],
  ]
));

// ========== 15. RISK ==========
content.push(heading("15. Risk Assessment and Mitigation", 1));
content.push(para("UAT execution carries inherent risks that could impact the testing timeline, quality, or effectiveness. This section identifies the key risks, assesses their probability and impact, and defines mitigation strategies to reduce risk exposure. The BA monitors these risks throughout the UAT period and escalates any materialized risks to the UAT Steering Committee."));

content.push(createTable(
  ["ID", "Risk", "Probability", "Impact", "Mitigation Strategy", "Contingency"],
  [
    ["R-01", "Business users unavailable due to operational demands", "High", "High", "Pre-agreed dedicated UAT time (09:00-12:00); backup testers identified for each role", "Extend UAT by 2-3 days; engage additional department staff"],
    ["R-02", "UAT environment instability (downtime, data corruption)", "Medium", "Critical", "Environment monitored 24/7; daily DB backups; DevOps on-call for rapid recovery", "Rebuild environment from backup; extend UAT timeline accordingly"],
    ["R-03", "High volume of critical defects discovered late in UAT", "Medium", "High", "Early Phase 1 focus on critical paths; daily defect triage; dedicated dev resources", "Additional dev resources allocated; targeted retest cycle after fixes"],
    ["R-04", "ERP staging integration failures", "Medium", "High", "ERP integration tested before UAT start; SAP team available during UAT", "Use ERP mock mode; defer ERP integration testing to post-UAT"],
    ["R-05", "Test data issues (missing, incorrect, or stale data)", "Low", "Medium", "Data validation script run before UAT; BA available to fix data issues", "Regenerate test data; adjust test cases to use available data"],
    ["R-06", "Scope creep (new requirements added during UAT)", "Medium", "Medium", "Strict change control: any new items require sponsor approval and timeline impact assessment", "Defer new items to Phase 2; document for future release"],
    ["R-07", "Barcode scanner hardware malfunction", "Low", "Medium", "Spare scanner available; manual entry fallback in the app", "Use manual RMA entry as temporary workaround"],
    ["R-08", "Communication gaps between remote participants", "Medium", "Low", "Dedicated Teams channel; daily video standup; clear escalation paths", "Increase meeting frequency; assign buddy system for remote testers"],
  ]
));

// ========== 16. METRICS ==========
content.push(heading("16. UAT Metrics and KPIs", 1));
content.push(para("UAT metrics provide objective, quantifiable measures of testing progress and quality. These metrics are tracked daily and reported to stakeholders through the communication channels defined in Section 14. Metrics are used to make data-driven decisions about the Go/No-Go evaluation and to identify areas that may need additional testing focus."));

content.push(heading("16.1 Execution Metrics", 2));
content.push(createTable(
  ["Metric", "Definition", "Target", "Data Source"],
  [
    ["Test Case Execution Rate", "% of planned test cases executed", "> 90% by end of Phase 3", "Results tracker"],
    ["Test Case Pass Rate", "% of executed test cases that passed", "> 95% overall", "Results tracker"],
    ["Defect Discovery Rate", "Number of defects found per test execution day", "5-10 per day (trending down)", "Jira"],
    ["Test Coverage", "% of requirements with at least 1 passing test case", "100%", "Traceability matrix"],
    ["Environment Availability", "% of scheduled UAT hours with environment up", "> 99%", "Monitoring logs"],
    ["Tester Participation", "% of scheduled UAT sessions attended by testers", "> 90%", "Standup attendance"],
  ]
));

content.push(heading("16.2 Defect Metrics", 2));
content.push(createTable(
  ["Metric", "Definition", "Target", "Data Source"],
  [
    ["Defect Density", "Defects per test case executed", "< 0.5", "Jira / Results tracker"],
    ["Critical Defect Count", "Total S1 defects discovered", "0", "Jira"],
    ["Defect Fix Rate", "% of defects resolved within SLA", "> 90%", "Jira"],
    ["Defect Reopen Rate", "% of closed defects that were reopened", "< 10%", "Jira"],
    ["Defect Aging", "Average days from New to Closed", "< 3 days", "Jira"],
    ["Deferred Defect Count", "S3+ defects accepted with workarounds", "< 5", "Jira"],
  ]
));

content.push(heading("16.3 Daily Metrics Dashboard", 2));
content.push(para("The BA maintains a daily metrics dashboard that is updated at the end of each UAT day and shared via the Teams channel and email distribution. The dashboard includes a summary table showing cumulative and daily metrics, a trend chart showing defect discovery over time, and a defect severity distribution chart. This dashboard provides at-a-glance visibility into UAT progress for all stakeholders."));
content.push(createTable(
  ["Metric", "Day 1", "Day 2", "Day 3", "...", "Cumulative"],
  [
    ["Test Cases Executed", "-", "-", "-", "...", ""],
    ["Test Cases Passed", "-", "-", "-", "...", ""],
    ["Test Cases Failed", "-", "-", "-", "...", ""],
    ["Pass Rate (%)", "-", "-", "-", "...", ""],
    ["New Defects (S1/S2/S3/S4)", "-", "-", "-", "...", ""],
    ["Defects Resolved", "-", "-", "-", "...", ""],
    ["Open Defects", "-", "-", "-", "...", ""],
    ["Environment Uptime (%)", "-", "-", "-", "...", ""],
  ]
));

// ========== 17. TRACEABILITY ==========
content.push(heading("17. Requirement Traceability Matrix", 1));
content.push(para("The traceability matrix provides a bidirectional mapping between system requirements, features, user stories, and UAT test cases. This matrix ensures that every requirement is validated through at least one UAT test case and that every test case maps back to a specific requirement. The matrix serves as evidence for audit and compliance purposes and helps identify any gaps in test coverage."));
content.push(createTable(
  ["Requirement", "Description", "Feature", "User Stories", "UAT Test Cases"],
  [
    ["REQ-101", "Customer self-service return submission", "FEAT-001", "US-001 to US-003", "TC-001, TC-003, TC-004, TC-005, TC-030, TC-031, TC-037"],
    ["REQ-102", "Automated eligibility validation", "FEAT-002", "US-004, US-005", "TC-002, TC-003, TC-006, TC-007"],
    ["REQ-103", "RMA number generation", "FEAT-003", "US-006", "TC-001, TC-037"],
    ["REQ-104", "Warehouse barcode scanning", "FEAT-004", "US-007", "TC-012, TC-037"],
    ["REQ-105", "Quality inspection grading", "FEAT-005", "US-008, US-009", "TC-013, TC-014, TC-015, TC-037"],
    ["REQ-106", "Automated refund calculation", "FEAT-006", "US-010", "TC-016, TC-017, TC-018, TC-037"],
    ["REQ-107", "ERP financial integration", "FEAT-007", "US-011", "TC-019, TC-037"],
    ["REQ-108", "Multi-channel notifications", "FEAT-008", "US-012, US-013", "TC-001, TC-020, TC-021, TC-022, TC-037"],
    ["REQ-109", "Management analytics dashboard", "FEAT-009, FEAT-010", "US-014, US-015", "TC-023, TC-024, TC-025, TC-026"],
    ["REQ-110", "Role-based access control", "FEAT-011", "US-016", "TC-033, TC-034, TC-035, TC-036"],
    ["REQ-111", "Audit trail", "FEAT-012", "US-017", "TC-028, TC-029, TC-040, TC-041, TC-042"],
    ["REQ-112", "Policy rule configuration", "FEAT-013", "US-018", "TC-027, TC-028"],
  ]
));

// ========== 18. APPENDIX ==========
content.push(heading("18. Appendices", 1));

content.push(heading("18.1 UAT Test Case Execution Tracker Template", 2));
content.push(para("The following template is used to track test case execution results during UAT. Each tester fills in their assigned test cases and updates the status daily. The BA consolidates results into the daily metrics dashboard."));
content.push(createTable(
  ["Test Case ID", "Scenario", "Description", "Assigned To", "Status", "Result", "Defect ID"],
  [
    ["UAT-TC-001", "S01", "Submit Eligible Single-Item Return", "", "Not Started", "", ""],
    ["UAT-TC-002", "S01", "Return Eligibility Check Before Submission", "", "Not Started", "", ""],
    ["...", "...", "...", "", "", "", ""],
  ]
));

content.push(heading("18.2 UAT Environment Access Credentials", 2));
content.push(para("Credentials for the UAT environment are distributed to testers during the orientation session via a secure password manager (Bitwarden). Credentials are not included in this document for security purposes. Each tester receives role-specific credentials that enforce the RBAC policies being tested."));
content.push(createTable(
  ["Role", "Login URL", "Credentials Source", "Access Level"],
  [
    ["Customer", "https://rms-uat.kontakthome.az/portal", "Bitwarden: UAT-Customer-01 to 05", "Customer portal only"],
    ["Support Agent", "https://rms-uat.kontakthome.az/agent", "Bitwarden: UAT-Agent-01 to 02", "Agent dashboard"],
    ["Warehouse Staff", "https://rms-uat.kontakthome.az/warehouse", "Bitwarden: UAT-Warehouse-01 to 02", "Warehouse mobile app"],
    ["Manager", "https://rms-uat.kontakthome.az/manager", "Bitwarden: UAT-Manager-01", "Analytics dashboard"],
    ["Admin", "https://rms-uat.kontakthome.az/admin", "Bitwarden: UAT-Admin-01", "Full admin access"],
  ]
));

content.push(heading("18.3 Glossary", 2));
content.push(createTable(
  ["Term", "Definition"],
  [
    ["UAT", "User Acceptance Testing - final testing phase performed by business users"],
    ["SIT", "System Integration Testing - pre-UAT testing of system integrations"],
    ["RMA", "Return Merchandise Authorization - unique tracking number for each return"],
    ["RBAC", "Role-Based Access Control - security mechanism restricting access by user role"],
    ["SLA", "Service Level Agreement - defined performance and response time targets"],
    ["E2E", "End-to-End - testing complete workflow across all system modules and user roles"],
    ["RACI", "Responsible, Accountable, Consulted, Informed - responsibility assignment matrix"],
    ["Go/No-Go", "Decision gate determining production deployment readiness"],
    ["S1/S2/S3/S4", "Severity levels from Critical (S1) to Low (S4)"],
    ["Jira", "Atlassian issue tracking tool used for defect management"],
    ["ERP", "Enterprise Resource Planning - financial system for refund processing"],
    ["P0/P1/P2", "Priority levels from Critical (P0) to Medium (P2)"],
  ]
));

content.push(heading("18.4 Document Revision History", 2));
content.push(createTable(
  ["Version", "Date", "Author", "Changes"],
  [
    ["1.0", "April 26, 2026", "Zamir Jamalov", "Initial UAT Planning document creation"],
  ]
));

// ========== BUILD ==========
async function buildDocument() {
  const doc = new docx.Document({
    creator: "Zamir Jamalov",
    title: "Kontakt Home - UAT Planning & Coordination",
    description: "User Acceptance Testing planning and coordination for the Kontakt Home Return Management System",
    styles: { default: { document: { run: { font: "Calibri", size: 22, color: COLORS.dark } } } },
    sections: [{
      properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
      children: [...coverPage(), new docx.PageBreak(), ...content],
    }],
  });
  const buffer = await docx.Packer.toBuffer(doc);
  const outputPath = "/home/z/my-project/ba-practice/Kontakt_Home_UAT_Planning_Coordination_Return_Management_System.docx";
  fs.writeFileSync(outputPath, buffer);
  console.log("Document generated:", outputPath);
  return outputPath;
}

buildDocument().catch(console.error);
