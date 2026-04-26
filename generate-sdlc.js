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
  return new docx.Paragraph({ children: [new docx.TextRun({ text, bold: true, size: sizes[level] || 22, color: colors[level] || COLORS.dark, font: "Calibri" })], heading: level, spacing: { before: level === 1 ? 360 : 240, after: 120 } });
}
function para(text, opts = {}) {
  return new docx.Paragraph({ children: [new docx.TextRun({ text, size: 22, color: COLORS.dark, font: "Calibri", ...opts })], spacing: { after: 120, line: 276 } });
}
function bullet(text, level = 0) {
  return new docx.Paragraph({ children: [new docx.TextRun({ text, size: 22, color: COLORS.dark, font: "Calibri" })], bullet: { level }, spacing: { after: 60 } });
}
function codeBlock(text) {
  return text.split("\n").map((line, idx, arr) => new docx.Paragraph({ children: [new docx.TextRun({ text: line || " ", size: 18, color: COLORS.dark, font: "Consolas" })], shading: { fill: COLORS.lightGray, type: "clear" }, spacing: { before: idx === 0 ? 80 : 0, after: idx === arr.length - 1 ? 80 : 0, line: 240 }, indent: { left: 240, right: 240 } }));
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

// ========== COVER ==========
function coverPage() {
  return [
    new docx.Paragraph({ spacing: { before: 3600 }, children: [] }),
    new docx.Paragraph({ children: [new docx.TextRun({ text: "KONTAKT HOME", bold: true, size: 56, color: COLORS.deepSea, font: "Calibri" })], alignment: "center", spacing: { after: 80 } }),
    new docx.Paragraph({ children: [new docx.TextRun({ text: "Software Development Life Cycle (SDLC)", bold: true, size: 40, color: COLORS.ocean, font: "Calibri" })], alignment: "center", spacing: { after: 200 } }),
    new docx.Paragraph({ children: [new docx.TextRun({ text: "Return Management System", size: 28, color: COLORS.accent, font: "Calibri" })], alignment: "center", spacing: { after: 100 } }),
    new docx.Paragraph({ children: [new docx.TextRun({ text: "Methodology, Process Framework, Delivery Phases,", size: 22, color: COLORS.gray, font: "Calibri" })], alignment: "center", spacing: { after: 40 } }),
    new docx.Paragraph({ children: [new docx.TextRun({ text: "Quality Gates, and Project Governance", size: 22, color: COLORS.gray, font: "Calibri" })], alignment: "center", spacing: { after: 600 } }),
    new docx.Paragraph({ children: [new docx.TextRun({ text: "________________________________________", color: COLORS.ocean, size: 24, font: "Calibri" })], alignment: "center", spacing: { after: 300 } }),
    new docx.Paragraph({ children: [new docx.TextRun({ text: "Document Version: 1.0", size: 22, color: COLORS.gray, font: "Calibri" })], alignment: "center", spacing: { after: 80 } }),
    new docx.Paragraph({ children: [new docx.TextRun({ text: "Date: April 26, 2026", size: 22, color: COLORS.gray, font: "Calibri" })], alignment: "center", spacing: { after: 80 } }),
    new docx.Paragraph({ children: [new docx.TextRun({ text: "Author: Zamir Jamalov, Business Analyst", size: 22, color: COLORS.gray, font: "Calibri" })], alignment: "center", spacing: { after: 80 } }),
    new docx.Paragraph({ children: [new docx.TextRun({ text: "Classification: Confidential", size: 22, color: COLORS.red, font: "Calibri", bold: true })], alignment: "center" }),
  ];
}

// ========== CONTENT ==========
const c = [];

// TOC
c.push(heading("Table of Contents", 1));
[
  "1. Introduction and Purpose",
  "2. SDLC Methodology Selection",
  "3. Project Governance Structure",
  "4. SDLC Phases Overview",
  "5. Phase 1: Planning and Initiation",
  "6. Phase 2: Requirements Analysis",
  "7. Phase 3: Design",
  "8. Phase 4: Development",
  "9. Phase 5: Testing",
  "10. Phase 6: Deployment",
  "11. Phase 7: Maintenance and Operations",
  "12. Quality Gates and Checkpoints",
  "13. DevOps and CI/CD Pipeline",
  "14. Configuration Management",
  "15. Risk Management",
  "16. Project Schedule and Milestones",
  "17. Team Structure and Resource Allocation",
  "18. Metrics and Measurement Framework",
  "19. Tools and Technology Stack",
  "20. Appendices",
].forEach(t => c.push(new docx.Paragraph({ children: [new docx.TextRun({ text: t, size: 22, color: COLORS.dark, font: "Calibri" })], spacing: { after: 60 } })));

// ========== 1. INTRODUCTION ==========
c.push(heading("1. Introduction and Purpose", 1));
c.push(para("This Software Development Life Cycle (SDLC) document defines the end-to-end process framework for the Kontakt Home Return Management System (RMS) project. It establishes the methodology, phases, governance structure, quality gates, and operational procedures that guide the project from initial concept through ongoing production operations. The SDLC provides a structured, repeatable, and measurable approach to software delivery that ensures consistent quality, predictable timelines, and alignment with business objectives."));
c.push(para("The Kontakt Home RMS project aims to digitize the product return and exchange process for Azerbaijan's largest electronics retailer. Currently processing over 500 return requests per month with an average handling time of 12-15 days and a customer satisfaction rate of 62%, the project targets a reduction in processing time to 3-5 days, an improvement in customer satisfaction to 85% or above, and a 30% reduction in operational costs through automation. The SDLC framework defined in this document governs how these business objectives are translated into working software through a disciplined, phased approach."));
c.push(para("This document serves multiple audiences: project stakeholders who need visibility into the development process, the development team who need clear guidance on methodology and practices, quality assurance personnel who need to understand testing integration points, operations teams who need to prepare for deployment and maintenance, and auditors who need evidence of a controlled software development process. Each section provides sufficient detail for its primary audience while remaining accessible to all stakeholders."));

c.push(heading("1.1 Document Objectives", 2));
c.push(bullet("Define the SDLC methodology (Agile/Scrum with Hybrid elements) and its adaptation for this project"));
c.push(bullet("Describe each SDLC phase with entry/exit criteria, activities, and deliverables"));
c.push(bullet("Establish the project governance structure with roles, responsibilities, and decision authority"));
c.push(bullet("Define quality gates between phases to ensure deliverables meet defined standards"));
c.push(bullet("Outline the DevOps and CI/CD pipeline for continuous integration and delivery"));
c.push(bullet("Describe the configuration management approach for source code, environments, and releases"));
c.push(bullet("Provide the risk management framework with identification, assessment, and mitigation strategies"));
c.push(bullet("Establish metrics and KPIs for measuring project health and delivery quality"));
c.push(bullet("Define the tools and technology stack used across all SDLC phases"));

c.push(heading("1.2 Referenced Documents", 2));
c.push(createTable(
  ["Document", "Version", "Relevance"],
  [
    ["Business Requirements Document (BRD)", "1.0", "Business context, KPIs, stakeholder analysis"],
    ["Functional Requirements Document (FRD)", "1.0", "Detailed functional specifications"],
    ["Software Requirements Specification (SRS)", "1.0", "Technical requirements and constraints"],
    ["RICE Backlog Prioritization", "1.0", "Feature prioritization and sprint allocation"],
    ["UAT Planning & Coordination", "1.0", "User acceptance testing strategy"],
    ["Postman API Testing Specification", "1.0", "API test suite and automation"],
    ["Swagger / OpenAPI 3.0 Specification", "1.0", "API contract definition"],
    ["As-Is / To-Be Gap Analysis", "1.0", "Process transformation baseline"],
  ]
));

// ========== 2. METHODOLOGY ==========
c.push(heading("2. SDLC Methodology Selection", 1));
c.push(para("The Kontakt Home RMS project adopts a hybrid SDLC methodology that combines Agile/Scrum practices for iterative development with waterfall-style governance for project planning, budgeting, and compliance reporting. This hybrid approach was selected based on the project's characteristics: a well-defined scope with clear business objectives (favoring waterfall planning), evolving functional details that benefit from iterative refinement (favoring agile execution), regulatory compliance requirements that demand documentation and traceability (favoring waterfall governance), and a fixed timeline with milestone-driven delivery expectations from the business (favoring structured phase gates)."));

c.push(heading("2.1 Methodology Comparison and Selection Rationale", 2));
c.push(createTable(
  ["Criteria", "Pure Waterfall", "Pure Agile", "Hybrid (Selected)"],
  [
    ["Requirements stability", "Requires complete upfront", "Evolves continuously", "Core fixed, details adaptive"],
    ["Client involvement", "Low (milestone reviews)", "High (continuous)", "Medium (sprint reviews)"],
    ["Change management", "Rigid (change control board)", "Flexible (backlog reprioritization)", "Balanced (gated changes)"],
    ["Documentation", "Heavy upfront + phase docs", "Lightweight (working software)", "Adequate + living docs"],
    ["Risk visibility", "Late discovery (after testing)", "Early discovery (each sprint)", "Balanced (phase gates + sprints)"],
    ["Compliance readiness", "Strong (planned audits)", "Weak (minimal docs)", "Strong (gated + documented)"],
    ["Time-to-value", "Late (after full delivery)", "Early (incremental releases)", "Balanced (sprint releases)"],
    ["Suitability for RMS", "Moderate", "Moderate", "High"],
  ]
));

c.push(heading("2.2 Agile Framework: Scrum with Kanban Overlay", 2));
c.push(para("The development execution follows the Scrum framework with two-week sprints, enhanced with Kanban principles for flow visualization and work-in-progress limits. This combination provides the structure and predictability of timeboxed sprints while maintaining the flexibility and throughput visibility of Kanban. The sprint cadence aligns with the project's five-sprint delivery plan as defined in the RICE Backlog Prioritization document."));
c.push(createTable(
  ["Scrum Element", "Configuration for RMS Project", "Rationale"],
  [
    ["Sprint Duration", "2 weeks (10 business days)", "Balances speed with stability for enterprise features"],
    ["Sprint Capacity", "40 story points per sprint", "Based on 6-person dev team velocity calculation"],
    ["Daily Standup", "09:30 AM, 15 minutes", "Aligns with team availability across departments"],
    ["Sprint Planning", "First Monday of each sprint, 2 hours", "Detailed planning for upcoming sprint deliverables"],
    ["Sprint Review", "Last Friday of each sprint, 1.5 hours", "Demo to stakeholders, collect feedback"],
    ["Sprint Retrospective", "Last Friday of sprint, 1 hour", "Continuous process improvement"],
    ["Backlog Refinement", "Wednesday of week 1, 1.5 hours", "Prepare stories for next sprint planning"],
    ["Definition of Done", "See Section 2.3 below", "Quality gate for story completion"],
  ]
));

c.push(heading("2.3 Definition of Done (DoD)", 2));
c.push(para("The Definition of Done is a comprehensive checklist that every user story must satisfy before it is considered complete within a sprint. The DoD ensures consistent quality across all deliverables and prevents partial or untested work from being marked as done. The DoD is enforced by the Scrum Master and verified during the sprint review demonstration."));
c.push(createTable(
  ["Category", "DoD Criteria", "Verification"],
  [
    ["Code Quality", "All code reviewed by at least one peer", "Pull request approval in Git"],
    ["Code Quality", "No critical or high static analysis findings", "SonarQube scan report"],
    ["Code Quality", "Unit test coverage > 80% for new code", "Coverage report from CI pipeline"],
    ["Code Quality", "All unit tests passing in CI", "Automated CI test results"],
    ["Documentation", "API documentation updated (OpenAPI spec)", "Swagger UI verification"],
    ["Documentation", "User story acceptance criteria documented", "Jira story verification"],
    ["Documentation", "Technical debt items logged (if any)", "Jira tech debt labels"],
    ["Testing", "All acceptance criteria tested and passing", "QA sign-off on story"],
    ["Testing", "Integration tests passing for affected modules", "CI integration test results"],
    ["Testing", "No regression in existing functionality", "Automated regression suite"],
    ["Security", "No new OWASP Top 10 vulnerabilities introduced", "Security scan results"],
    ["Performance", "Response time within defined SLA baselines", "Performance test results"],
    ["Deployment", "Deployed to staging environment successfully", "Deployment pipeline logs"],
    ["Deployment", "Database migration scripts tested (if applicable)", "Migration test results"],
    ["Approval", "Product Owner acceptance of sprint demo", "Verbal/written PO confirmation"],
  ]
));

// ========== 3. GOVERNANCE ==========
c.push(heading("3. Project Governance Structure", 1));
c.push(para("Project governance establishes the decision-making framework, escalation paths, and accountability structure for the RMS project. Effective governance ensures that the project stays aligned with business objectives, manages risks proactively, and delivers value within the defined constraints of scope, timeline, and budget. The governance structure operates at three levels: strategic (steering committee), tactical (project management), and operational (development team)."));

c.push(heading("3.1 Organizational Structure", 2));
c.push(createTable(
  ["Role", "Person", "Responsibility", "Authority Level", "Time Commitment"],
  [
    ["Project Sponsor", "Elvin Hasanov (IT Director)", "Budget approval, strategic direction, issue escalation", "Final authority on scope/budget", "4 hrs/week"],
    ["Product Owner", "Gulnara Sultanova", "Backlog prioritization, acceptance, stakeholder alignment", "Accept/reject deliverables", "Full-time"],
    ["Business Analyst", "Zamir Jamalov", "Requirements, documentation, UAT coordination, process analysis", "Requirements authority", "Full-time"],
    ["Scrum Master", "Aysel Karimova", "Process facilitation, impediment removal, sprint management", "Process authority", "Full-time"],
    ["Tech Lead / Architect", "Tural Mamedov", "Technical design, code standards, architecture decisions", "Technical authority", "Full-time"],
    ["Backend Developer (x2)", "Dev Team", "API development, database design, ERP integration", "Implementation", "Full-time"],
    ["Frontend Developer (x2)", "Dev Team", "Portal, dashboard, mobile app UI development", "Implementation", "Full-time"],
    ["QA Engineer (x2)", "QA Team", "Test planning, test automation, defect management", "Quality authority", "Full-time"],
    ["DevOps Engineer", "Ops Team", "CI/CD pipeline, infrastructure, deployment, monitoring", "Infrastructure authority", "Full-time"],
    ["UX Designer", "Design Team", "User research, wireframes, usability testing", "Design authority", "Part-time (50%)"],
    ["Database Administrator", "Ops Team", "Database design, optimization, backup, migration", "Database authority", "Part-time (50%)"],
  ]
));

c.push(heading("3.2 Governance Meetings", 2));
c.push(createTable(
  ["Meeting", "Frequency", "Duration", "Participants", "Purpose", "Output"],
  [
    ["Steering Committee", "Monthly", "1 hour", "Sponsor, PO, SM, Tech Lead", "Strategic review, budget, escalations", "Decision record"],
    ["Sprint Planning", "Bi-weekly", "2 hours", "PO, SM, Dev Team, QA", "Plan sprint scope and commitments", "Sprint backlog"],
    ["Daily Standup", "Daily", "15 min", "Dev Team, SM, QA", "Progress, blockers, coordination", "Updated board"],
    ["Backlog Refinement", "Weekly", "1.5 hours", "PO, BA, SM, Tech Lead", "Prepare and estimate stories", "Refined backlog"],
    ["Sprint Review", "Bi-weekly", "1.5 hours", "All stakeholders", "Demo completed work, collect feedback", "Stakeholder feedback"],
    ["Sprint Retrospective", "Bi-weekly", "1 hour", "Dev Team, SM, QA", "Process improvement", "Action items"],
    ["Architecture Review", "As needed", "1 hour", "Tech Lead, DevOps, DBA", "Technical design decisions", "Design decision record"],
    ["Release Planning", "Per release", "2 hours", "PO, SM, QA Lead, DevOps", "Plan release scope and deployment", "Release plan"],
  ]
));

c.push(heading("3.3 Escalation Matrix", 2));
c.push(para("Issues that cannot be resolved at the operational level are escalated through the governance structure following the defined escalation matrix. Escalation timelines are calibrated to the severity of the issue to prevent delays in decision-making while avoiding unnecessary escalation of minor issues."));
c.push(createTable(
  ["Issue Type", "Level 1 (Team)", "Level 2 (Project Manager)", "Level 3 (Sponsor)", "Max Resolution Time"],
  [
    ["Technical blocker", "SM + Tech Lead (4 hrs)", "PO + Tech Lead (1 day)", "Sponsor (2 days)", "2 business days"],
    ["Scope change request", "BA + PO (1 day)", "PO + Sponsor (2 days)", "Steering Committee", "5 business days"],
    ["Resource conflict", "SM (same day)", "PO + Department Head (2 days)", "Sponsor (3 days)", "3 business days"],
    ["Budget overrun risk", "PO + SM (1 day)", "Sponsor + Finance (2 days)", "Executive Board", "5 business days"],
    ["Critical defect (S1)", "QA Lead + Dev (4 hrs)", "Tech Lead + PO (1 day)", "Sponsor (2 days)", "2 business days"],
    ["Vendor/external dependency", "Tech Lead (1 day)", "PO + Legal (3 days)", "Sponsor (5 days)", "5 business days"],
  ]
));

// ========== 4. PHASES OVERVIEW ==========
c.push(heading("4. SDLC Phases Overview", 1));
c.push(para("The Kontakt Home RMS project follows a seven-phase SDLC model that spans the complete software product lifecycle from initial concept through ongoing production operations. Each phase has clearly defined objectives, activities, deliverables, and quality gates. The phases are designed to be sequential in their governance (each phase's gate must be passed before the next begins) while allowing iterative execution within the development phase through the sprint cadence."));
c.push(createTable(
  ["Phase", "Name", "Duration", "Key Deliverables", "Quality Gate"],
  [
    ["1", "Planning and Initiation", "2 weeks", "Project charter, stakeholder map, RICE backlog", "Project Kickoff Approval"],
    ["2", "Requirements Analysis", "3 weeks", "BRD, FRD, SRS, User Stories, Acceptance Criteria", "Requirements Sign-off"],
    ["3", "Design", "3 weeks", "Architecture, DB schema, API spec, UI wireframes", "Design Review Approval"],
    ["4", "Development", "10 weeks (5 sprints)", "Working software per sprint, API, frontend, integrations", "Sprint Review + DoD"],
    ["5", "Testing", "4 weeks (SIT + UAT)", "Test reports, defect resolution, regression results", "UAT Sign-off (Go/No-Go)"],
    ["6", "Deployment", "1 week", "Production release, cutover plan, rollback plan", "Go-Live Approval"],
    ["7", "Maintenance and Ops", "Ongoing", "Support tickets, enhancements, monitoring reports", "Quarterly SLA Review"],
  ]
));

// ========== 5. PHASE 1: PLANNING ==========
c.push(heading("5. Phase 1: Planning and Initiation", 1));
c.push(para("The Planning and Initiation phase establishes the project's foundation by defining its business justification, scope boundaries, stakeholder expectations, and delivery approach. This phase transforms the initial business need (digitizing the return process) into a structured project with clear objectives, constraints, and a realistic delivery plan. The phase outputs the project charter and the RICE-prioritized feature backlog that guide all subsequent phases."));

c.push(heading("5.1 Phase Objectives", 2));
c.push(bullet("Define the business case and project justification with quantifiable ROI targets"));
c.push(bullet("Identify and engage all stakeholders across the five departments involved in returns"));
c.push(bullet("Establish the project governance structure and communication framework"));
c.push(bullet("Define the project scope with clear in-scope and out-of-scope boundaries"));
c.push(bullet("Conduct stakeholder interviews to gather current-state pain points and requirements"));
c.push(bullet("Perform As-Is / To-Be gap analysis to identify transformation requirements"));
c.push(bullet("Prioritize features using the RICE framework (Reach, Impact, Confidence, Effort)"));
c.push(bullet("Develop the initial project schedule with milestones and resource allocation"));

c.push(heading("5.2 Phase Activities", 2));
c.push(createTable(
  ["Activity", "Description", "Owner", "Duration", "Deliverable"],
  [
    ["Business case development", "Document ROI, cost-benefit analysis, strategic alignment", "BA + PO", "3 days", "Business case document"],
    ["Stakeholder identification", "Map all stakeholders, assess influence and interest", "BA", "2 days", "Stakeholder register"],
    ["Stakeholder interviews", "Conduct structured interviews with 10+ stakeholders", "BA", "5 days", "Interview summaries"],
    ["As-Is process analysis", "Document current return process with metrics and pain points", "BA", "3 days", "As-Is process map"],
    ["To-Be process design", "Define future-state return process with automation points", "BA", "3 days", "To-Be process map"],
    ["Gap analysis", "Identify gaps between current and target state", "BA", "2 days", "Gap analysis report"],
    ["Feature identification", "Brainstorm and catalog all potential features", "BA + PO", "2 days", "Feature catalog"],
    ["RICE prioritization", "Score and rank features using RICE methodology", "BA + PO", "2 days", "RICE backlog"],
    ["Sprint allocation", "Assign features to sprints based on priority and dependencies", "BA + Tech Lead", "2 days", "Sprint plan"],
    ["Project charter creation", "Consolidate all planning artifacts into project charter", "BA + PO", "2 days", "Project charter"],
    ["Kickoff preparation", "Prepare and schedule project kickoff meeting", "BA + SM", "1 day", "Kickoff presentation"],
  ]
));

c.push(heading("5.3 Phase Deliverables", 2));
c.push(createTable(
  ["Deliverable", "Format", "Audience", "Status"],
  [
    ["Business Case", "PDF", "Steering Committee", "Completed"],
    ["Stakeholder Register", "Excel", "Project Team", "Completed"],
    ["Stakeholder Interview Summaries", "DOCX", "BA + PO", "Completed"],
    ["As-Is / To-Be Gap Analysis", "DOCX", "All stakeholders", "Completed"],
    ["RICE Backlog Prioritization", "DOCX", "PO + Dev Team", "Completed"],
    ["Project Charter", "DOCX", "Steering Committee", "Completed"],
    ["High-Level Project Schedule", "MS Project / Excel", "All stakeholders", "Completed"],
  ]
));

c.push(heading("5.4 Phase Quality Gate", 2));
c.push(createTable(
  ["Gate Criterion", "Verification Method", "Approver", "Status"],
  [
    ["Business case approved by steering committee", "Signed approval", "Sponsor", "Passed"],
    ["All key stakeholders identified and engaged", "Stakeholder register reviewed", "BA", "Passed"],
    ["RICE backlog contains all Must-Have features", "Backlog review with PO", "PO", "Passed"],
    ["Sprint plan covers 5 sprints with allocated features", "Schedule review", "SM + Tech Lead", "Passed"],
    ["Project charter signed by sponsor", "Document sign-off", "Sponsor", "Passed"],
    ["Budget allocated for full project duration", "Finance confirmation", "Finance", "Passed"],
  ]
));

// ========== 6. PHASE 2: REQUIREMENTS ==========
c.push(heading("6. Phase 2: Requirements Analysis", 1));
c.push(para("The Requirements Analysis phase translates the prioritized backlog and stakeholder input into detailed, testable specifications that guide design and development. This phase produces the core requirements documents (BRD, FRD, SRS), user stories with acceptance criteria, and the complete requirements traceability chain. The phase follows a progressive elaboration approach where requirements are defined at an appropriate level of detail for each sprint, with sprint-1 items fully elaborated and later sprints elaborated during the preceding sprint."));

c.push(heading("6.1 Phase Activities", 2));
c.push(createTable(
  ["Activity", "Description", "Owner", "Duration", "Deliverable"],
  [
    ["BRD elaboration", "Expand business requirements with KPIs, constraints, assumptions", "BA", "4 days", "BRD v1.0"],
    ["FRD development", "Define detailed functional requirements per feature", "BA", "5 days", "FRD v1.0"],
    ["SRS development", "Define technical requirements, interfaces, constraints", "BA + Tech Lead", "5 days", "SRS v1.0"],
    ["User story creation", "Break features into user stories with role-goal-benefit format", "BA", "4 days", "User Stories v1.0"],
    ["Acceptance criteria definition", "Define Given-When-Then criteria for each story", "BA + QA", "4 days", "Acceptance Criteria v1.0"],
    ["Non-functional requirements", "Define performance, security, reliability, scalability requirements", "Tech Lead", "3 days", "NFR document"],
    ["Data requirements", "Define data entities, relationships, migration needs", "BA + DBA", "3 days", "Data model draft"],
    ["Integration requirements", "Define ERP, email, SMS, barcode scanner interfaces", "Tech Lead", "2 days", "Integration spec"],
    ["Requirements review", "Formal review of all requirement documents with stakeholders", "BA", "3 days", "Review feedback"],
    ["Requirements baseline", "Freeze requirements and establish baseline version", "BA + PO", "1 day", "Baselined requirements"],
  ]
));

c.push(heading("6.2 Requirements Traceability", 2));
c.push(para("Every requirement is assigned a unique identifier (REQ-101 through REQ-112) and traced through the complete development lifecycle. The traceability chain links business requirements to functional requirements, functional requirements to user stories, user stories to acceptance criteria, acceptance criteria to test cases, and test cases to code commits. This chain enables impact analysis when changes are requested and provides evidence of complete requirement coverage during testing and audit."));
c.push(createTable(
  ["Requirement ID", "Title", "Priority", "Feature", "User Stories", "Test Coverage"],
  [
    ["REQ-101", "Customer self-service return submission", "Must-Have", "FEAT-001", "US-001 to US-003", "UAT-TC-001 to TC-005"],
    ["REQ-102", "Automated eligibility validation", "Must-Have", "FEAT-002", "US-004, US-005", "UAT-TC-006 to TC-007"],
    ["REQ-103", "RMA number generation", "Must-Have", "FEAT-003", "US-006", "UAT-TC-001"],
    ["REQ-104", "Warehouse barcode scanning", "Must-Have", "FEAT-004", "US-007", "UAT-TC-012"],
    ["REQ-105", "Quality inspection grading", "Must-Have", "FEAT-005", "US-008, US-009", "UAT-TC-013 to TC-015"],
    ["REQ-106", "Automated refund calculation", "Must-Have", "FEAT-006", "US-010", "UAT-TC-016 to TC-018"],
    ["REQ-107", "ERP financial integration", "Must-Have", "FEAT-007", "US-011", "UAT-TC-019"],
    ["REQ-108", "Multi-channel notifications", "Should-Have", "FEAT-008", "US-012, US-013", "UAT-TC-020 to TC-022"],
    ["REQ-109", "Management analytics dashboard", "Should-Have", "FEAT-009", "US-014, US-015", "UAT-TC-023 to TC-026"],
    ["REQ-110", "Role-based access control", "Must-Have", "FEAT-011", "US-016", "UAT-TC-033 to TC-036"],
    ["REQ-111", "Audit trail", "Should-Have", "FEAT-012", "US-017", "UAT-TC-040 to TC-042"],
    ["REQ-112", "Policy rule configuration", "Should-Have", "FEAT-013", "US-018", "UAT-TC-027 to TC-029"],
  ]
));

c.push(heading("6.3 Phase Quality Gate", 2));
c.push(createTable(
  ["Gate Criterion", "Verification", "Approver"],
  [
    ["All Must-Have requirements fully elaborated with acceptance criteria", "Document review", "PO + QA Lead"],
    ["All user stories estimated and assigned to sprints", "Backlog review", "SM"],
    ["Requirements reviewed and approved by business stakeholders", "Sign-off meeting", "Department heads"],
    ["Non-functional requirements defined and baselined", "Document review", "Tech Lead"],
    ["Integration requirements defined for all external systems", "Document review", "Tech Lead + DevOps"],
    ["Requirements traceability matrix established", "Matrix review", "BA"],
    ["Change control process defined for requirement modifications", "Process review", "SM"],
  ]
));

// ========== 7. PHASE 3: DESIGN ==========
c.push(heading("7. Phase 3: Design", 1));
c.push(para("The Design phase translates the elaborated requirements into detailed technical and user experience designs that guide development. This phase produces the system architecture, database schema, API specifications, user interface designs, and integration designs. The design follows a principles-driven approach that prioritizes scalability, maintainability, security, and user experience. All design decisions are documented in Architecture Decision Records (ADRs) for future reference and audit purposes."));

c.push(heading("7.1 Architecture Design", 2));
c.push(para("The system follows a modern microservices-inspired architecture deployed on Microsoft Azure, with a React-based frontend, Node.js/Express API layer, PostgreSQL database, Redis caching, and integration with SAP ERP for financial processing. The architecture supports horizontal scaling for each component independently, enabling cost-effective scaling as the system grows."));
c.push(createTable(
  ["Layer", "Technology", "Purpose", "Scaling Strategy"],
  [
    ["Frontend (Web)", "React 18 + TypeScript, Tailwind CSS", "Customer portal, agent dashboard, admin console", "Azure CDN + App Service"],
    ["Frontend (Mobile)", "React Native / PWA", "Warehouse mobile app with barcode scanning", "PWA (no app store)"],
    ["API Gateway", "Azure API Management", "Rate limiting, authentication, routing", "Auto-scale"],
    ["Backend API", "Node.js 20 + Express, TypeScript", "Business logic, orchestration", "Azure App Service (3+ instances)"],
    ["Database", "Azure PostgreSQL Flexible Server", "Primary data store", "Read replicas for analytics"],
    ["Cache", "Azure Redis Cache", "Session management, API response caching", "Standard tier"],
    ["Message Queue", "Azure Service Bus", "Async notifications, event-driven processing", "Standard tier"],
    ["File Storage", "Azure Blob Storage", "Product photos, shipping labels, reports", "Standard tier"],
    ["Monitoring", "Azure Application Insights + Log Analytics", "APM, logging, alerting", "Included with App Service"],
    ["CI/CD", "GitHub Actions + Azure DevOps", "Build, test, deploy automation", "Self-hosted runners"],
  ]
));

c.push(heading("7.2 Database Design", 2));
c.push(para("The database schema is designed following third normal form (3NF) with strategic denormalization for read-heavy analytics queries. The core entities include Users, Orders, ReturnRequests, ReturnItems, Inspections, Refunds, Notifications, AuditLogs, PolicyRules, and Products. Entity relationships enforce referential integrity while allowing for the historical tracking required by the audit trail feature (REQ-111). Soft deletes are used for all entities to preserve data integrity and support compliance requirements."));

c.push(heading("7.3 API Design", 2));
c.push(para("The RESTful API follows OpenAPI 3.0 specification with 24 endpoints organized across 8 resource groups: Authentication (3 endpoints), Return Requests (5 endpoints), Validation (2 endpoints), Warehouse (3 endpoints), Refunds (3 endpoints), Notifications (2 endpoints), Analytics (3 endpoints), and Admin (3 endpoints). The API design follows HATEOAS principles for discoverability and uses JWT Bearer token authentication with role-based authorization."));
c.push(createTable(
  ["Design Decision", "Choice", "Rationale"],
  [
    ["API Style", "REST (not GraphQL)", "Simpler tooling, better caching, wider team familiarity"],
    ["API Versioning", "URL path (/api/v1/)", "Explicit, simple, CDN-friendly"],
    ["Authentication", "JWT Bearer (OAuth 2.0)", "Stateless, scalable, industry standard"],
    ["Error Format", "RFC 7807 Problem Details", "Standardized, machine-readable, client-friendly"],
    ["Pagination", "Offset-based with metadata", "Simple to implement, sufficient for data volumes"],
    ["Content Negotiation", "JSON only (no XML)", "Consistent with modern frontend frameworks"],
    ["Rate Limiting", "Per-role tiered limits", "Fair usage, protects against abuse"],
  ]
));

c.push(heading("7.4 UI/UX Design", 2));
c.push(para("The user interface design follows a mobile-first responsive approach that adapts seamlessly from desktop to mobile screen sizes. The design system uses a consistent component library built with Tailwind CSS, ensuring visual coherence across all user interfaces. Five distinct interfaces are designed for each user role, each optimized for their specific workflow patterns and device preferences."));
c.push(createTable(
  ["Interface", "Primary Device", "Key Design Principles", "Target Users"],
  [
    ["Customer Portal", "Mobile (PWA)", "Simple, guided, minimal steps", "End customers"],
    ["Support Agent Dashboard", "Desktop", "Information-dense, filterable, sortable", "Customer service team"],
    ["Warehouse Mobile App", "Mobile (PWA)", "Large touch targets, barcode-first", "Warehouse staff"],
    ["Manager Analytics Dashboard", "Desktop", "Visual, drill-down, exportable", "Operations management"],
    ["Admin Console", "Desktop", "Form-based, confirmation dialogs, audit visible", "IT administration"],
  ]
));

c.push(heading("7.5 Phase Deliverables", 2));
c.push(createTable(
  ["Deliverable", "Format", "Owner"],
  [
    ["System Architecture Document", "Confluence + ADRs", "Tech Lead"],
    ["Database Schema (ERD + DDL scripts)", "dbdiagram.io + SQL files", "DBA + Tech Lead"],
    ["API Specification (OpenAPI 3.0)", "Swagger YAML + Postman collection", "Backend Dev"],
    ["UI Wireframes and Prototypes", "Figma", "UX Designer"],
    ["Integration Design Document", "Confluence", "Tech Lead + DevOps"],
    ["Security Architecture", "Confluence", "Tech Lead"],
    ["Deployment Architecture", "Azure diagrams", "DevOps"],
  ]
));

// ========== 8. PHASE 4: DEVELOPMENT ==========
c.push(heading("8. Phase 4: Development", 1));
c.push(para("The Development phase is the core execution phase where the design specifications are translated into working software through iterative sprint cycles. The phase spans five two-week sprints, each delivering a potentially shippable increment of the system. Development follows test-driven development (TDD) practices, with unit tests written before implementation code, and continuous integration ensuring that code quality is maintained with every commit."));

c.push(heading("8.1 Sprint Allocation and Scope", 2));
c.push(createTable(
  ["Sprint", "Duration", "Focus", "Key Features", "Story Points"],
  [
    ["Sprint 1", "Jan 6-17, 2026", "Foundation", "RBAC, Auth, Validation Engine, Customer Portal base", "42"],
    ["Sprint 2", "Jan 20-31, 2026", "Core Return Flow", "Return CRUD, Agent Dashboard, Notifications base", "44"],
    ["Sprint 3", "Feb 3-14, 2026", "Warehouse Ops", "Barcode scanning, Receiving, Inspection, Grading", "46"],
    ["Sprint 4", "Feb 17-28, 2026", "Financial Processing", "Refund calculation, ERP integration, Status automation", "48"],
    ["Sprint 5", "Mar 2-13, 2026", "Analytics + Admin", "Dashboards, Reports, Policy config, Audit trail, Polish", "40"],
  ]
));

c.push(heading("8.2 Development Workflow", 2));
c.push(para("Each user story follows a structured development workflow from sprint backlog assignment through deployment to the staging environment. The workflow ensures code quality, peer review, automated testing, and continuous integration at every step."));
c.push(createTable(
  ["Step", "Activity", "Owner", "Tool", "Quality Check"],
  [
    ["1", "Story picked from sprint backlog", "Developer", "Jira", "Story meets DoD definition"],
    ["2", "Create feature branch (feature/US-XXX)", "Developer", "Git", "Branch naming convention"],
    ["3", "Write unit tests (TDD - red phase)", "Developer", "Jest + Supertest", "Tests fail (expected)"],
    ["4", "Write implementation code (TDD - green)", "Developer", "VS Code", "All tests pass"],
    ["5", "Refactor and optimize (TDD - refactor)", "Developer", "VS Code + SonarQube", "No quality regressions"],
    ["6", "Create pull request with description", "Developer", "GitHub PR", "Template filled, screenshots attached"],
    ["7", "Peer code review (1 reviewer minimum)", "Team member", "GitHub", "PR approved, no unresolved comments"],
    ["8", "Automated CI checks (build + test + scan)", "GitHub Actions", "CI pipeline", "All checks green"],
    ["9", "Merge to develop branch", "Developer", "GitHub", "Merge commit created"],
    ["10", "Auto-deploy to staging environment", "DevOps pipeline", "Azure DevOps", "Deployment successful"],
    ["11", "QA functional verification on staging", "QA Engineer", "Staging env", "Feature works as specified"],
    ["12", "Story marked Done in sprint board", "Developer", "Jira", "All DoD criteria met"],
  ]
));

c.push(heading("8.3 Coding Standards and Practices", 2));
c.push(bullet("TypeScript strict mode enabled for all backend and frontend code with no implicit any types"));
c.push(bullet("ESLint + Prettier configured with shared rulesets enforced via pre-commit hooks (Husky)"));
c.push(bullet("Conventional Commits specification for all commit messages (feat:, fix:, docs:, test:, refactor:)"));
c.push(bullet("Maximum function complexity of 10 cyclomatic complexity points enforced by SonarQube"));
c.push(bullet("All API endpoints must have OpenAPI documentation updated in the Swagger specification"));
c.push(bullet("Database changes must use migration scripts (Flyway) applied in version order"));
c.push(bullet("Sensitive data (passwords, tokens) must never appear in code - use Azure Key Vault references"));
c.push(bullet("All user inputs must be validated and sanitized before processing (OWASP input validation)"));
c.push(bullet("Error responses must follow RFC 7807 Problem Details format with correlation IDs"));

c.push(heading("8.4 Sprint Review and Increment", 2));
c.push(para("At the end of each sprint, the team conducts a sprint review where completed stories are demonstrated to stakeholders. The increment (working software) is deployed to the staging environment for stakeholder access. Feedback collected during the review is prioritized and either addressed in the current sprint (if minor) or added to the product backlog for future sprints. The sprint review serves as a key governance checkpoint where stakeholders can verify that development is aligned with business expectations."));

// ========== 9. PHASE 5: TESTING ==========
c.push(heading("9. Phase 5: Testing", 1));
c.push(para("The Testing phase validates the complete system through multiple testing levels to ensure that the software meets all requirements, integrates correctly with external systems, performs within defined baselines, and provides a satisfactory user experience. The testing phase includes System Integration Testing (SIT) conducted by the QA team, User Acceptance Testing (UAT) conducted by business users, and Performance and Security testing conducted by specialized resources."));

c.push(heading("9.1 Testing Levels", 2));
c.push(createTable(
  ["Testing Level", "Scope", "Executor", "Duration", "Entry Criteria", "Key Deliverable"],
  [
    ["Unit Testing", "Individual functions and methods", "Developers", "Continuous", "Code written", "Coverage report (>80%)"],
    ["Integration Testing", "API endpoints, database, external systems", "QA Team", "2 weeks", "Sprint 5 complete", "Integration test report"],
    ["System Integration (SIT)", "Complete system with all integrations", "QA Team", "1 week", "Integration tests pass", "SIT test report"],
    ["User Acceptance (UAT)", "Business scenario validation", "Business users", "3 weeks", "SIT 95%+ pass", "UAT sign-off document"],
    ["Performance Testing", "Load, stress, scalability", "QA + DevOps", "1 week", "SIT complete", "Performance baseline report"],
    ["Security Testing", "Vulnerability, penetration, RBAC", "Security team", "3 days", "SIT complete", "Security assessment report"],
  ]
));

c.push(heading("9.2 Test Automation Strategy", 2));
c.push(para("The test automation strategy maximizes regression testing efficiency by automating repetitive test scenarios that must be executed frequently. The automation pyramid defines the target distribution of test types, with unit tests forming the broad base, API tests forming the middle layer, and UI tests forming the focused top layer."));
c.push(createTable(
  ["Test Type", "Framework", "Execution", "Target Count", "Coverage Target"],
  [
    ["Unit Tests", "Jest", "Every commit (CI)", "500+", "80%+ code coverage"],
    ["API Integration Tests", "Supertest + Jest", "Every commit (CI)", "200+", "All 24 endpoints"],
    ["E2E API Tests (Postman)", "Newman", "Daily + CI gate", "45+", "All critical workflows"],
    ["UI Tests", "Playwright", "Nightly + pre-release", "50+", "Critical user paths"],
    ["Performance Tests", "k6 / Artillery", "Weekly + pre-release", "20 scenarios", "P95 SLA baselines"],
    ["Security Scans", "OWASP ZAP + SonarQube", "Weekly + CI", "Continuous", "OWASP Top 10"],
  ]
));

c.push(heading("9.3 Testing Phase Timeline", 2));
c.push(createTable(
  ["Week", "Dates", "Activity", "Environment", "Focus"],
  [
    ["Week 1", "Mar 16-20", "SIT preparation + integration tests", "Staging", "API + DB + external integration"],
    ["Week 2", "Mar 23-27", "SIT execution + defect fixing", "Staging", "Full system testing, regression"],
    ["Week 3", "Mar 30 - Apr 3", "UAT Phase 1-2 (Core + Alternate)", "UAT", "Business user testing"],
    ["Week 4", "Apr 6-10", "UAT Phase 3-4 (E2E + Regression)", "UAT", "Cross-role workflows, retest"],
    ["Week 5", "Apr 13-17", "Performance + Security testing", "Staging + Perf", "Load, stress, pen testing"],
    ["Week 6", "Apr 20-24", "UAT Phase 5 (Sign-off)", "UAT", "Go/No-Go decision"],
  ]
));

// ========== 10. PHASE 6: DEPLOYMENT ==========
c.push(heading("10. Phase 6: Deployment", 1));
c.push(para("The Deployment phase manages the transition of the validated system from the UAT environment to production. This phase includes production environment preparation, data migration, deployment execution, smoke testing, and cutover management. Given that the system handles customer financial transactions (refunds), the deployment follows a blue-green deployment strategy with an automated rollback capability to minimize risk and ensure business continuity."));

c.push(heading("10.1 Deployment Strategy", 2));
c.push(para("A blue-green deployment strategy is used to eliminate downtime and enable instant rollback if issues are detected. The production environment maintains two identical infrastructure slots (Blue = current production, Green = new release). The new version is deployed to the Green slot, validated through smoke testing, and then traffic is switched from Blue to Green. If any critical issues are detected post-switch, traffic is immediately reverted to the Blue slot."));
c.push(createTable(
  ["Deployment Step", "Activity", "Owner", "Duration", "Rollback Trigger"],
  [
    ["Pre-deploy", "Production environment health check", "DevOps", "30 min", "Any infrastructure issue"],
    ["Pre-deploy", "Database migration dry run on staging copy", "DBA", "1 hour", "Migration script failure"],
    ["Deploy", "Deploy application to Green slot", "DevOps pipeline", "30 min", "Build/deploy failure"],
    ["Validate", "Run automated smoke test suite (50 tests)", "QA + CI", "15 min", "Any smoke test failure"],
    ["Validate", "Manual smoke test by DevOps lead", "DevOps", "30 min", "Critical functional issue"],
    ["Migrate", "Execute database migration on production", "DBA", "30 min", "Migration error"],
    ["Switch", "Change traffic routing: Blue to Green", "DevOps", "5 min", "Immediate if smoke fails"],
    ["Monitor", "Enhanced monitoring for 1 hour", "DevOps + QA", "60 min", "Error rate spike"],
    ["Confirm", "Post-deployment validation complete", "Tech Lead", "30 min", "Any critical issue"],
    ["Cleanup", "Scale down Blue slot (retain 24h)", "DevOps", "15 min", "N/A"],
  ]
));

c.push(heading("10.2 Production Environment Specification", 2));
c.push(createTable(
  ["Component", "Production Specification", "Scaling"],
  [
    ["Application Server", "Azure App Service, P2v3 (4 vCPU, 16 GB RAM), 3 instances", "Auto-scale: 3-10 instances"],
    ["Database", "Azure PostgreSQL Flexible Server, General Purpose, 8 vCPU, 64 GB", "Read replicas: 2"],
    ["Redis Cache", "Azure Redis Cache, Premium P1 (6 GB)", "Cluster: 2 nodes"],
    ["API Management", "Azure APIM, Premium tier", "Auto-scale"],
    ["CDN", "Azure Front Door", "Global edge locations"],
    ["Monitoring", "Application Insights + Log Analytics Workspace", "Standard tier"],
    ["Storage", "Azure Blob Storage (RA-GRS)", "Geo-redundant replication"],
    ["Backup", "Daily DB backup, 30-day retention", "Automated"],
  ]
));

c.push(heading("10.3 Go-Live Checklist", 2));
c.push(createTable(
  ["Item", "Description", "Verified By", "Status"],
  [
    ["All UAT exit criteria met", "UAT sign-off document approved", "UAT Sponsor", ""],
    ["No open Critical or High defects", "Jira defect dashboard", "QA Lead", ""],
    ["Production environment provisioned and verified", "Infrastructure checklist", "DevOps", ""],
    ["Database migration tested and validated", "Migration dry run results", "DBA", ""],
    ["ERP production connection tested", "Integration test with SAP production", "Tech Lead", ""],
    ["Monitoring and alerting configured", "Alert rules verified", "DevOps", ""],
    ["Rollback plan documented and tested", "Rollback drill completed", "DevOps", ""],
    ["Support team trained and ready", "Training completion record", "BA", ""],
    ["User communication sent", "Go-live announcement", "Marketing + CS", ""],
    ["Data migration plan approved", "Migration sign-off", "DBA + PO", ""],
    ["Performance baseline validated", "Load test on production-equivalent", "QA", ""],
    ["Security scan passed (production)", "Latest scan results", "Security team", ""],
  ]
));

// ========== 11. PHASE 7: MAINTENANCE ==========
c.push(heading("11. Phase 7: Maintenance and Operations", 1));
c.push(para("The Maintenance and Operations phase begins immediately after successful go-live and continues for the lifetime of the system. This phase ensures the system remains stable, secure, and aligned with evolving business needs through proactive monitoring, incident management, regular updates, and continuous improvement. The phase establishes the operational support model that transitions ownership from the project team to the operations team."));

c.push(heading("11.1 Support Model", 2));
c.push(createTable(
  ["Support Tier", "Scope", "Team", "Response SLA", "Resolution SLA"],
  [
    ["Tier 1 (L1)", "User guidance, password resets, basic queries", "Helpdesk", "30 minutes", "4 hours"],
    ["Tier 2 (L2)", "Application issues, data corrections, configuration", "Application Support", "2 hours", "8 hours"],
    ["Tier 3 (L3)", "Code defects, performance issues, security incidents", "Development Team", "4 hours", "24 hours"],
    ["Tier 4 (L4)", "Infrastructure, network, database, cloud services", "DevOps / Infrastructure", "1 hour", "4 hours"],
  ]
));

c.push(heading("11.2 Maintenance Activities", 2));
c.push(createTable(
  ["Activity", "Frequency", "Owner", "Description"],
  [
    ["Application monitoring", "24/7", "Automated (PagerDuty alerts)", "APM, error tracking, SLA monitoring"],
    ["Security patching", "Monthly", "DevOps", "OS and dependency security updates"],
    ["Database optimization", "Weekly", "DBA", "Index maintenance, vacuum, statistics"],
    ["Log review", "Weekly", "DevOps + Tech Lead", "Error trends, performance anomalies"],
    ["Backup verification", "Weekly", "DBA", "Restore drill from latest backup"],
    ["Dependency updates", "Monthly", "DevOps", "npm package updates, vulnerability scan"],
    ["SLA reporting", "Monthly", "BA + DevOps", "Uptime, response times, incident metrics"],
    ["User feedback review", "Bi-weekly", "BA + PO", "Analyze feedback, prioritize improvements"],
    ["Minor enhancements", "Per sprint", "Dev Team", "Small improvements and UX refinements"],
    ["Major feature releases", "Quarterly", "Dev Team", "Planned feature releases from backlog"],
    ["Disaster recovery drill", "Quarterly", "DevOps", "Full DR failover test"],
    ["Capacity planning review", "Quarterly", "Tech Lead + DevOps", "Resource utilization and scaling needs"],
  ]
));

c.push(heading("11.3 Incident Management Process", 2));
c.push(para("All production incidents follow a structured incident management process to ensure timely resolution and continuous learning. Incidents are classified by severity (S1-Sev1 through S4-Sev4) and managed through the defined lifecycle from detection through post-incident review."));
c.push(createTable(
  ["Severity", "Definition", "Example", "Response Time", "Comms Cadence"],
  [
    ["S1-Sev1", "Complete system outage or data breach", "RMS down for all users", "15 minutes", "Every 30 min"],
    ["S2-Sev2", "Major feature failure affecting many users", "Refund processing failed", "30 minutes", "Every 2 hours"],
    ["S3-Sev3", "Minor feature failure with workaround", "Report export timing out", "2 hours", "Daily update"],
    ["S4-Sev4", "Cosmetic or low-impact issue", "Dashboard chart misalignment", "24 hours", "Next release"],
  ]
));

// ========== 12. QUALITY GATES ==========
c.push(heading("12. Quality Gates and Checkpoints", 1));
c.push(para("Quality gates are formal checkpoints between SDLC phases that ensure deliverables meet defined quality standards before proceeding to the next phase. Each gate has specific entry criteria that must be satisfied, evaluation criteria that are assessed, and exit criteria that must be met for gate passage. Gates are reviewed by designated gate reviewers who have the authority to approve, reject, or conditionally pass the gate."));

c.push(heading("12.1 Gate Summary", 2));
c.push(createTable(
  ["Gate", "Between Phases", "Key Criteria", "Reviewer", "Decision Authority"],
  [
    ["G1: Project Kickoff", "Pre-Phase 1", "Business case, budget, sponsor approval", "Sponsor", "Sponsor"],
    ["G2: Requirements Baseline", "Phase 2 to Phase 3", "All requirements documented, reviewed, signed", "PO + Dept Heads", "PO"],
    ["G3: Design Complete", "Phase 3 to Phase 4", "Architecture, DB, API, UI designs approved", "Tech Lead + PO", "Tech Lead"],
    ["G4: Sprint Review", "Each sprint end", "DoD met, demo accepted, no critical defects", "PO", "PO"],
    ["G5: SIT Complete", "Phase 5a to Phase 5b", "95%+ pass rate, no critical defects", "QA Lead", "QA Lead"],
    ["G6: UAT Sign-off", "Phase 5 to Phase 6", "Exit criteria met, Go/No-Go passed", "Sponsor", "Sponsor"],
    ["G7: Go-Live Approval", "Phase 6 to Phase 7", "Go-live checklist complete, rollback tested", "Sponsor + Ops", "Sponsor"],
    ["G8: Post-Launch Review", "30 days after go-live", "SLA met, no critical incidents", "Steering Committee", "Sponsor"],
  ]
));

// ========== 13. DEVOPS ==========
c.push(heading("13. DevOps and CI/CD Pipeline", 1));
c.push(para("The DevOps practice integrates development and operations through automated pipelines that enable continuous integration, continuous delivery, and infrastructure as code. The CI/CD pipeline ensures that every code change is automatically built, tested, scanned for security vulnerabilities, and deployed to the appropriate environment, reducing manual effort and human error while increasing deployment frequency and reliability."));

c.push(heading("13.1 CI/CD Pipeline Stages", 2));
c.push(createTable(
  ["Stage", "Trigger", "Activities", "Duration", "Failure Action"],
  [
    ["Build", "Push to feature branch", "npm install, TypeScript compile, bundle", "3 min", "Block merge, notify developer"],
    ["Unit Test", "After build", "Jest unit tests, coverage report", "5 min", "Block merge, show failures"],
    ["Lint + Format", "After unit test", "ESLint, Prettier check", "1 min", "Block merge, show violations"],
    ["Security Scan", "After lint", "SonarQube analysis, npm audit, SAST", "5 min", "Block merge for critical/high"],
    ["Integration Test", "After security", "Supertest API integration tests", "8 min", "Block merge, create defect"],
    ["Deploy to Staging", "Merge to develop", "Azure App Service deployment", "5 min", "Alert DevOps, block further"],
    ["E2E Test", "After staging deploy", "Postman Newman + Playwright E2E", "10 min", "Alert team, investigate"],
    ["Deploy to UAT", "Tag release/vX.Y.Z", "UAT environment deployment", "5 min", "Alert DevOps, retry"],
  ]
));

c.push(heading("13.2 Branch Strategy", 2));
c.push(para("The repository follows a trunk-based development model with short-lived feature branches. The main branch (main) is always in a deployable state, with all features developed on feature branches that are merged via pull requests after passing all CI checks and code reviews. Release branches are created from main when preparing for UAT or production deployment."));
c.push(createTable(
  ["Branch", "Naming Convention", "Lifetime", "Protection"],
  [
    ["main", "main", "Permanent", "Require PR, 2 approvals, CI pass"],
    ["develop", "develop", "Permanent", "Require PR, 1 approval, CI pass"],
    ["Feature", "feature/US-XXX-short-description", "1-5 days", "CI pass required for merge"],
    ["Bugfix", "bugfix/RMS-XXX-short-description", "1-3 days", "CI pass required for merge"],
    ["Release", "release/v1.0.0", "Until deployment", "Require PR from main"],
    ["Hotfix", "hotfix/v1.0.1-short-description", "1 day", "Require PR + fast-track review"],
  ]
));

c.push(heading("13.3 Environment Promotion", 2));
c.push(para("Code is promoted through environments in a structured sequence: Development (feature branches), Staging (develop branch merge), UAT (release tag), and Production (release approval). Each environment promotion requires the previous environment's quality gates to be passed. Data is not promoted between environments; each has its own dataset appropriate for its purpose."));

// ========== 14. CONFIG MGMT ==========
c.push(heading("14. Configuration Management", 1));
c.push(para("Configuration management ensures that all project artifacts (source code, infrastructure, environment settings, data, and documentation) are version-controlled, tracked, and auditable throughout the SDLC. This section defines the configuration management approach for each artifact category and the processes for managing changes to controlled items."));

c.push(heading("14.1 Configuration Items", 2));
c.push(createTable(
  ["Category", "Items", "Repository", "Version Control", "Change Process"],
  [
    ["Source Code", "Backend, Frontend, Mobile, Shared libraries", "GitHub", "Git (branch + tag)", "Pull Request + Review"],
    ["Database", "Schema migrations, seed data, stored procedures", "GitHub (db/migrations/)", "Flyway versioning", "Migration PR + Review"],
    ["Infrastructure", "Terraform IaC, ARM templates, Dockerfiles", "GitHub (infra/)", "Git + Terraform state", "Infra PR + Plan review"],
    ["API Specification", "OpenAPI YAML, Postman collection", "GitHub (api/)", "Git (committed with code)", "PR + backward compat check"],
    ["Environment Config", "Connection strings, API keys, feature flags", "Azure Key Vault + App Config", "Key Vault versioning", "Admin console + audit"],
    ["Documentation", "Requirements, design, test plans, UAT", "GitHub (docs/)", "Git (markdown/DOCX)", "Review + approval"],
    ["Test Artifacts", "Test scripts, test data, automation code", "GitHub (tests/)", "Git (committed with tests)", "PR + review"],
  ]
));

// ========== 15. RISK MGMT ==========
c.push(heading("15. Risk Management", 1));
c.push(para("Risk management is a continuous activity throughout the SDLC that identifies, assesses, mitigates, and monitors risks that could impact project delivery. The risk management framework follows a proactive approach where risks are identified early and mitigation strategies are implemented before risks materialize. The risk register is reviewed at every governance meeting and updated as the project progresses."));

c.push(heading("15.1 Project Risk Register", 2));
c.push(createTable(
  ["ID", "Risk", "Phase", "Probability", "Impact", "Score", "Mitigation", "Owner", "Status"],
  [
    ["R-01", "ERP integration complexity exceeds estimates", "Design + Dev", "High", "High", "16", "Early proof-of-concept; SAP team co-located; mock fallback", "Tech Lead", "Active"],
    ["R-02", "Scope creep from stakeholder change requests", "All phases", "High", "Medium", "12", "Strict change control; sprint commitment protection; buffer sprint", "PO", "Active"],
    ["R-03", "Key team member departure", "Dev + Test", "Low", "High", "8", "Knowledge sharing; pair programming; documentation; cross-training", "SM", "Monitoring"],
    ["R-04", "Barcode scanner hardware compatibility", "Design + Dev", "Medium", "Medium", "9", "Early POC with actual devices; web fallback option", "Tech Lead", "Active"],
    ["R-05", "Production performance issues at scale", "Test + Deploy", "Medium", "High", "12", "Early performance testing; caching strategy; auto-scaling config", "DevOps", "Monitoring"],
    ["R-06", "Data migration issues from legacy systems", "Deploy", "Medium", "High", "12", "Migration scripts tested in staging; rollback plan; data validation", "DBA", "Monitoring"],
    ["R-07", "User adoption resistance", "Maintenance", "Medium", "Medium", "9", "Training program; phased rollout; champion users; support", "BA", "Monitoring"],
    ["R-08", "Security vulnerability discovery", "All phases", "Low", "Critical", "12", "Continuous security scanning; OWASP practices; pen testing; WAF", "Tech Lead", "Active"],
  ]
));

c.push(heading("15.2 Risk Assessment Matrix", 2));
c.push(para("Risks are assessed on a 4x4 probability-impact matrix. The risk score determines the management approach: Critical (12-16) risks require immediate mitigation and executive attention; High (8-11) risks require active mitigation and regular monitoring; Medium (4-7) risks are monitored with contingency plans; Low (1-3) risks are accepted and reviewed periodically."));

// ========== 16. SCHEDULE ==========
c.push(heading("16. Project Schedule and Milestones", 1));
c.push(para("The project follows a 24-week timeline from planning initiation through post-launch review. The schedule is organized around the seven SDLC phases with clearly defined milestones that serve as governance checkpoints. The schedule includes contingency buffers at each phase boundary to absorb unforeseen delays without impacting the overall project deadline."));

c.push(heading("16.1 Master Project Schedule", 2));
c.push(createTable(
  ["Milestone", "Phase", "Target Date", "Dependencies", "Deliverable", "Gate"],
  [
    ["M1: Project Kickoff", "Phase 1", "Dec 23, 2025", "Budget approval", "Project charter signed", "G1"],
    ["M2: Requirements Baseline", "Phase 2", "Jan 17, 2026", "Stakeholder interviews", "BRD, FRD, SRS, US signed off", "G2"],
    ["M3: Design Complete", "Phase 3", "Feb 5, 2026", "Requirements baselined", "Architecture, DB, API, UI designs", "G3"],
    ["M4: Sprint 1 Complete", "Phase 4", "Jan 17, 2026", "Design approval", "Auth + Validation + Portal base", "G4"],
    ["M5: Sprint 2 Complete", "Phase 4", "Jan 31, 2026", "Sprint 1 done", "Return CRUD + Agent dashboard", "G4"],
    ["M6: Sprint 3 Complete", "Phase 4", "Feb 14, 2026", "Sprint 2 done", "Warehouse receiving + inspection", "G4"],
    ["M7: Sprint 4 Complete", "Phase 4", "Feb 28, 2026", "Sprint 3 done", "Refund calc + ERP integration", "G4"],
    ["M8: Sprint 5 Complete", "Phase 4", "Mar 13, 2026", "Sprint 4 done", "Analytics + Admin + Polish", "G4"],
    ["M9: SIT Complete", "Phase 5", "Mar 27, 2026", "All sprints done", "SIT test report (95%+ pass)", "G5"],
    ["M10: UAT Sign-off", "Phase 5", "Apr 24, 2026", "SIT passed", "Go/No-Go decision", "G6"],
    ["M11: Go-Live", "Phase 6", "Apr 28, 2026", "UAT signed off", "Production deployment", "G7"],
    ["M12: Post-Launch Review", "Phase 7", "May 28, 2026", "30 days in production", "Operational metrics report", "G8"],
  ]
));

// ========== 17. TEAM ==========
c.push(heading("17. Team Structure and Resource Allocation", 1));
c.push(para("The project team is organized as a cross-functional Scrum team with all the skills necessary to design, develop, test, and deploy the system. The team structure follows the Spotify model of squads, with the RMS squad being a self-contained unit that includes product, design, development, QA, and DevOps capabilities. The team operates with a flat structure during daily execution, escalating to the governance hierarchy only when decisions exceed team-level authority."));

c.push(heading("17.1 Resource Allocation by Phase", 2));
c.push(createTable(
  ["Role", "Phase 1-2", "Phase 3", "Phase 4", "Phase 5", "Phase 6-7"],
  [
    ["Business Analyst", "100%", "50%", "25%", "75% (UAT coord)", "50%"],
    ["Product Owner", "50%", "75%", "25%", "50%", "25%"],
    ["Scrum Master", "25%", "25%", "100%", "50%", "25%"],
    ["Tech Lead", "25%", "100%", "100%", "50%", "50%"],
    ["Backend Developer (x2)", "0%", "25%", "100%", "50%", "25%"],
    ["Frontend Developer (x2)", "0%", "25%", "100%", "25%", "25%"],
    ["QA Engineer (x2)", "0%", "25%", "100%", "100%", "75%"],
    ["DevOps Engineer", "0%", "50%", "50%", "50%", "100%"],
    ["UX Designer", "0%", "100%", "50%", "25%", "0%"],
    ["DBA", "0%", "50%", "25%", "25%", "25%"],
  ]
));

// ========== 18. METRICS ==========
c.push(heading("18. Metrics and Measurement Framework", 1));
c.push(para("The metrics framework provides objective, quantifiable measures of project health, delivery quality, and operational performance. Metrics are collected at three levels: project-level metrics tracked throughout the SDLC, sprint-level metrics tracked during development, and operational metrics tracked after go-live. Each metric has a defined target, data source, collection frequency, and responsible owner."));

c.push(heading("18.1 Project-Level Metrics", 2));
c.push(createTable(
  ["Metric", "Definition", "Target", "Data Source", "Frequency"],
  [
    ["Requirements Coverage", "% of requirements with passing test cases", "100%", "Traceability matrix", "Per test phase"],
    ["Scope Change Rate", "Number of approved scope changes / total requirements", "< 10%", "Change request log", "Monthly"],
    ["Budget Variance", "(Actual spend - Planned spend) / Planned spend", "< 10%", "Finance reports", "Monthly"],
    ["Schedule Variance", "(Actual progress - Planned progress) / Planned", "< 1 week", "Project schedule", "Bi-weekly"],
    ["Defect Density", "Defects per 1000 lines of code", "< 5", "Jira + SonarQube", "Per sprint"],
    ["Defect Removal Efficiency", "Defects found before release / total defects", "> 90%", "Jira", "Per release"],
    ["Risk Realization Rate", "Materialized risks / identified risks", "< 20%", "Risk register", "Monthly"],
  ]
));

c.push(heading("18.2 Sprint-Level Metrics", 2));
c.push(createTable(
  ["Metric", "Definition", "Target", "Data Source", "Frequency"],
  [
    ["Velocity", "Story points completed per sprint", "40 SP (steady)", "Jira sprint report", "Per sprint"],
    ["Sprint Scope Completion", "% of committed stories completed", "> 85%", "Jira sprint report", "Per sprint"],
    ["Cycle Time", "Average time from story start to done", "< 5 days", "Jira control chart", "Per sprint"],
    ["Code Coverage", "% of code covered by unit tests", "> 80%", "CI pipeline report", "Per commit"],
    ["Code Quality", "SonarQube quality gate pass rate", "100%", "SonarQube dashboard", "Per commit"],
    ["Technical Debt Ratio", "Time on tech debt / total development time", "< 15%", "Jira labels", "Per sprint"],
    ["Build Success Rate", "% of CI builds that pass", "> 95%", "CI pipeline logs", "Daily"],
    ["Deployment Frequency", "Deployments to staging per sprint", "> 10", "DevOps pipeline", "Per sprint"],
  ]
));

c.push(heading("18.3 Operational Metrics (Post-Launch)", 2));
c.push(createTable(
  ["Metric", "Definition", "Target", "Data Source", "Frequency"],
  [
    ["System Uptime", "% of time system is available", "> 99.9%", "Azure Monitor", "Monthly"],
    ["API Response Time (P95)", "95th percentile response time", "< 500ms", "Application Insights", "Daily"],
    ["Error Rate", "API error responses / total responses", "< 1%", "Application Insights", "Daily"],
    ["Customer Satisfaction (CSAT)", "Post-return survey score", "> 85%", "Survey system", "Monthly"],
    ["Mean Time to Resolution", "Average time to resolve support tickets", "< 4 hours", "Helpdesk system", "Weekly"],
    ["Return Processing Time", "Average days from submission to refund", "3-5 days", "RMS analytics", "Weekly"],
    ["Auto-Approval Rate", "% of returns auto-approved (Grade A/B)", "> 70%", "RMS analytics", "Weekly"],
    ["Incident Rate", "Production incidents per month", "< 5 (S1-S2)", "PagerDuty", "Monthly"],
  ]
));

// ========== 19. TOOLS ==========
c.push(heading("19. Tools and Technology Stack", 1));
c.push(para("The project uses a curated set of industry-standard tools for each SDLC activity. Tool selection criteria include team familiarity, community support, integration capabilities, cost-effectiveness, and security compliance. All tools are cloud-based where possible to minimize infrastructure overhead and enable remote team collaboration."));

c.push(heading("19.1 Complete Tool Chain", 2));
c.push(createTable(
  ["SDLC Activity", "Tool", "Purpose", "License"],
  [
    ["Project Management", "Jira Software (Cloud)", "Backlog, sprints, boards, tracking", "Enterprise"],
    ["Documentation", "Confluence", "Knowledge base, design docs, meeting notes", "Enterprise"],
    ["Version Control", "GitHub Enterprise", "Source code, reviews, branch management", "Enterprise"],
    ["CI/CD", "GitHub Actions + Azure DevOps", "Build, test, deploy automation", "Included"],
    ["Code Quality", "SonarQube", "Static analysis, code smells, coverage tracking", "Community"],
    ["API Development", "Postman + Newman", "API testing, documentation, mock server", "Team"],
    ["IDE", "Visual Studio Code + WebStorm", "Code editing, debugging, refactoring", "Enterprise"],
    ["UI Design", "Figma", "Wireframes, prototypes, design system", "Organization"],
    ["Database", "Azure PostgreSQL + pgAdmin", "Production database + management", "Azure"],
    ["Monitoring", "Application Insights + Grafana", "APM, logging, dashboards, alerting", "Azure + OSS"],
    ["Containerization", "Docker + Azure Container Apps", "Container builds and deployment", "Azure"],
    ["Infrastructure", "Terraform + Azure ARM", "Infrastructure as Code", "OSS + Azure"],
    ["Communication", "Microsoft Teams + Outlook", "Chat, video, email, calendar", "M365"],
    ["Security", "OWASP ZAP + Azure Key Vault", "Security scanning, secrets management", "OSS + Azure"],
    ["Test Management", "TestRail", "Test case management, execution tracking", "Team"],
  ]
));

// ========== 20. APPENDICES ==========
c.push(heading("20. Appendices", 1));

c.push(heading("20.1 SDLC Phase Deliverable Summary", 2));
c.push(createTable(
  ["Phase", "Deliverable", "Format", "Status"],
  [
    ["1-Planning", "Project Charter", "Confluence", "Complete"],
    ["1-Planning", "RICE Backlog Prioritization", "DOCX", "Complete"],
    ["1-Planning", "Stakeholder Interview Summaries", "DOCX", "Complete"],
    ["1-Planning", "As-Is / To-Be Gap Analysis", "DOCX", "Complete"],
    ["2-Requirements", "Business Requirements Document (BRD)", "DOCX", "Complete"],
    ["2-Requirements", "Functional Requirements Document (FRD)", "DOCX", "Complete"],
    ["2-Requirements", "Software Requirements Specification (SRS)", "DOCX", "Complete"],
    ["2-Requirements", "User Stories", "DOCX", "Complete"],
    ["2-Requirements", "Acceptance Criteria", "DOCX", "Complete"],
    ["3-Design", "System Architecture Document", "Confluence", "In Progress"],
    ["3-Design", "Database Schema (ERD)", "dbdiagram.io", "In Progress"],
    ["3-Design", "REST API Specification (OpenAPI 3.0)", "DOCX + YAML", "Complete"],
    ["3-Design", "UI Wireframes", "Figma", "In Progress"],
    ["3-Design", "Integration Design Document", "Confluence", "Planned"],
    ["4-Development", "Source Code (Backend + Frontend)", "GitHub", "In Progress"],
    ["4-Development", "API Documentation (Swagger)", "DOCX + YAML", "Complete"],
    ["5-Testing", "Postman API Testing Specification", "DOCX", "Complete"],
    ["5-Testing", "UAT Planning & Coordination", "DOCX", "Complete"],
    ["5-Testing", "Test Execution Reports", "PDF", "Planned"],
    ["6-Deployment", "Deployment Runbook", "Confluence", "Planned"],
    ["6-Deployment", "Rollback Plan", "Confluence", "Planned"],
    ["7-Operations", "SLA Report", "PDF", "Ongoing"],
    ["7-Operations", "Incident Log", "Jira Service Desk", "Ongoing"],
  ]
));

c.push(heading("20.2 Glossary", 2));
c.push(createTable(
  ["Term", "Definition"],
  [
    ["SDLC", "Software Development Life Cycle - the process framework for software development"],
    ["Agile", "Iterative software development methodology that embraces change and continuous feedback"],
    ["Scrum", "Agile framework with timeboxed sprints, defined roles, and iterative delivery"],
    ["Kanban", "Flow-based workflow visualization method with work-in-progress limits"],
    ["CI/CD", "Continuous Integration / Continuous Delivery - automated build, test, deploy pipeline"],
    ["DoD", "Definition of Done - the quality checklist that every story must satisfy"],
    ["RICE", "Reach, Impact, Confidence, Effort - feature prioritization framework"],
    ["RBAC", "Role-Based Access Control - security mechanism restricting access by user role"],
    ["RMA", "Return Merchandise Authorization - unique tracking number for each return"],
    ["ADR", "Architecture Decision Record - documentation of significant design decisions"],
    ["SIT", "System Integration Testing - testing complete system integrations"],
    ["UAT", "User Acceptance Testing - final testing by business users"],
    ["SLA", "Service Level Agreement - defined performance and support commitments"],
    ["IaC", "Infrastructure as Code - managing infrastructure through version-controlled definitions"],
    ["WIP", "Work in Progress - items currently being worked on in the development workflow"],
    ["PO", "Product Owner - the role responsible for maximizing product value"],
    ["SM", "Scrum Master - the facilitator of the Scrum process"],
    ["TDD", "Test-Driven Development - write tests before implementation code"],
    ["OWASP", "Open Web Application Security Project - web security best practices"],
    ["SAST", "Static Application Security Testing - analyzing source code for vulnerabilities"],
  ]
));

c.push(heading("20.3 Document Revision History", 2));
c.push(createTable(
  ["Version", "Date", "Author", "Changes"],
  [
    ["1.0", "April 26, 2026", "Zamir Jamalov", "Initial SDLC document creation"],
  ]
));

// ========== BUILD ==========
async function buildDocument() {
  const doc = new docx.Document({
    creator: "Zamir Jamalov",
    title: "Kontakt Home - Software Development Life Cycle (SDLC)",
    description: "SDLC methodology and process framework for the Kontakt Home Return Management System",
    styles: { default: { document: { run: { font: "Calibri", size: 22, color: COLORS.dark } } } },
    sections: [{ properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } }, children: [...coverPage(), new docx.PageBreak(), ...c] }],
  });
  const buffer = await docx.Packer.toBuffer(doc);
  const outputPath = "/home/z/my-project/ba-practice/Kontakt_Home_SDLC_Return_Management_System.docx";
  fs.writeFileSync(outputPath, buffer);
  console.log("Document generated:", outputPath);
  return outputPath;
}

buildDocument().catch(console.error);
