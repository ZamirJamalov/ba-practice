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
    new docx.Paragraph({ children: [new docx.TextRun({ text: "System Design Document (SDD)", bold: true, size: 40, color: COLORS.ocean, font: "Calibri" })], alignment: "center", spacing: { after: 200 } }),
    new docx.Paragraph({ children: [new docx.TextRun({ text: "Return Management System", size: 28, color: COLORS.accent, font: "Calibri" })], alignment: "center", spacing: { after: 100 } }),
    new docx.Paragraph({ children: [new docx.TextRun({ text: "Architecture, Data Model, API Design, Integration,", size: 22, color: COLORS.gray, font: "Calibri" })], alignment: "center", spacing: { after: 40 } }),
    new docx.Paragraph({ children: [new docx.TextRun({ text: "Security, Deployment, and Performance", size: 22, color: COLORS.gray, font: "Calibri" })], alignment: "center", spacing: { after: 600 } }),
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
  "1. Introduction",
  "2. System Overview and Context",
  "3. Architecture Design",
  "4. High-Level System Architecture",
  "5. Component Design",
  "6. Data Architecture and Database Design",
  "7. API Design and Integration Layer",
  "8. Security Architecture",
  "9. Non-Functional Requirements Mapping",
  "10. Deployment Architecture",
  "11. Technology Stack",
  "12. Interface Design Specifications",
  "13. Error Handling and Resilience Patterns",
  "14. Scalability and Performance Strategy",
  "15. Glossary and References",
].forEach(t => c.push(new docx.Paragraph({ children: [new docx.TextRun({ text: t, size: 22, color: COLORS.dark, font: "Calibri" })], spacing: { after: 60 } })));

// ========== 1. INTRODUCTION ==========
c.push(heading("1. Introduction", 1));
c.push(para("This System Design Document (SDD) provides the comprehensive technical blueprint for the Kontakt Home Return Management System (RMS). It defines the system architecture, component interactions, data models, API contracts, security mechanisms, deployment topology, and non-functional design decisions that collectively describe how the system will be built, deployed, and operated. This document serves as the authoritative technical reference for the development team, architects, DevOps engineers, and quality assurance personnel involved in delivering the RMS."));
c.push(para("The Kontakt Home RMS is designed to digitize and automate the product return and exchange process for Azerbaijan's largest electronics retailer. The system currently handles over 500 return requests per month with an average processing time of 12-15 days and a customer satisfaction rate of 62%. The target state envisions processing time reduced to 3-5 days, customer satisfaction improved to 85% or above, and a 30% reduction in operational costs. The system design addresses these business objectives through a modern, cloud-native architecture built on Microsoft Azure."));
c.push(para("This document is intended for the technical team responsible for implementing the RMS, including the Tech Lead (Tural Mamedov), Backend Developers, Frontend Developers, DevOps Engineers, QA Engineers, and the Database Administrator. It also serves as a reference for the Business Analyst (Zamir Jamalov) who needs to understand technical constraints and capabilities when analyzing requirements, and for project stakeholders who need visibility into the technical approach and its alignment with business objectives."));

c.push(heading("1.1 Document Scope", 2));
c.push(bullet("System architecture: high-level topology, component decomposition, and interaction patterns"));
c.push(bullet("Data architecture: entity-relationship model, database schema, data flow, and storage strategy"));
c.push(bullet("API design: RESTful endpoint specifications, authentication, error handling, and versioning"));
c.push(bullet("Integration design: SAP ERP, email/SMS gateways, barcode scanner, and third-party services"));
c.push(bullet("Security architecture: authentication, authorization, data encryption, and compliance controls"));
c.push(bullet("Deployment architecture: environment topology, infrastructure as code, and scaling strategy"));
c.push(bullet("Non-functional requirements: performance, availability, scalability, and disaster recovery"));

c.push(heading("1.2 Referenced Documents", 2));
c.push(createTable(
  ["Document", "Version", "Relevance to SDD"],
  [
    ["Business Requirements Document (BRD)", "1.0", "Business context, KPIs, constraints"],
    ["Functional Requirements Document (FRD)", "1.0", "Functional specifications mapped to components"],
    ["Software Requirements Specification (SRS)", "1.0", "Technical requirements and system constraints"],
    ["REST API & JSON Specification", "1.0", "API contract definition and endpoint details"],
    ["Swagger / OpenAPI 3.0 Specification", "1.0", "Formal API schema and data models"],
    ["As-Is / To-Be Gap Analysis", "1.0", "Current state and target state process flows"],
    ["RICE Backlog Prioritization", "1.0", "Feature priority and sprint allocation"],
    ["SDLC Document", "1.0", "Development methodology and governance"],
  ]
));

c.push(heading("1.3 Design Principles", 2));
c.push(para("The system design is guided by a set of core architectural principles that ensure consistency, quality, and alignment with both technical and business objectives. These principles were established collaboratively by the Tech Lead, Business Analyst, and Product Owner during the Design phase of the SDLC and are referenced in all Architecture Decision Records (ADRs) throughout the project."));
c.push(createTable(
  ["Principle", "Description", "Application in RMS"],
  [
    ["Separation of Concerns", "Each component has a single, well-defined responsibility", "Frontend, API, and data layers are independently deployable"],
    ["Domain-Driven Design", "Business logic organized around return process domain concepts", "Entities reflect ReturnRequest, Inspection, Refund domain objects"],
    ["API-First Design", "API contracts defined before implementation begins", "OpenAPI 3.0 spec drives frontend-backend parallel development"],
    ["Security by Design", "Security controls embedded at every architectural layer", "AuthN/AuthZ, encryption, input validation at all entry points"],
    ["Scalability by Default", "Components designed for horizontal scaling from day one", "Stateless API, read replicas, async processing with queues"],
    ["Observability First", "Comprehensive logging, tracing, and metrics from the start", "Application Insights, structured logging, correlation IDs"],
    ["Fail-Safe Defaults", "System degrades gracefully rather than failing catastrophically", "Circuit breakers, retry policies, rollback mechanisms"],
    ["Convention over Configuration", "Standardized patterns reduce decision fatigue", "Shared ESLint, naming conventions, project templates"],
  ]
));

// ========== 2. SYSTEM OVERVIEW ==========
c.push(heading("2. System Overview and Context", 1));
c.push(para("The Kontakt Home Return Management System operates as a comprehensive platform that manages the complete lifecycle of product returns and exchanges. The system serves five distinct user roles (Customer, Support Agent, Warehouse Staff, Manager, and Admin) and integrates with multiple external systems including SAP ERP for financial processing, email and SMS gateways for notifications, and barcode scanning hardware for warehouse operations. Understanding the system context is essential for making informed architectural decisions."));
c.push(para("The system processes an average of 500 return requests per month, with seasonal peaks reaching 800-1000 requests during holiday periods and sale events. Each return request follows a multi-stage workflow: submission, validation, approval, receiving, quality inspection, refund processing, and closure. The system must handle concurrent requests from multiple users across different departments while maintaining data consistency and real-time status visibility."));

c.push(heading("2.1 Business Context Diagram", 2));
c.push(para("The system interacts with the following external actors and systems, each of which influences the architectural design decisions documented in subsequent sections of this document. The business context defines the boundaries of the RMS and identifies all integration points that must be designed for reliability, security, and performance."));
c.push(createTable(
  ["Actor / System", "Type", "Interaction", "Integration Method", "Data Volume"],
  [
    ["End Customer", "Human Actor", "Submit return requests, track status, upload photos", "Web Portal (PWA)", "~500/month"],
    ["Support Agent", "Human Actor", "Review requests, approve/reject, communicate with customers", "Agent Dashboard", "~20 agents"],
    ["Warehouse Staff", "Human Actor", "Receive items, scan barcodes, perform inspections", "Mobile App (PWA)", "~8 staff"],
    ["Operations Manager", "Human Actor", "Monitor KPIs, review reports, manage policies", "Analytics Dashboard", "~5 managers"],
    ["System Admin", "Human Actor", "Configure users, roles, policies, system settings", "Admin Console", "~2 admins"],
    ["SAP ERP (S/4HANA)", "External System", "Order lookup, refund posting, inventory updates", "REST API + IDoc", "~500 transactions/month"],
    ["Email Gateway (SendGrid)", "External System", "Notification emails to customers and agents", "REST API", "~2000 emails/month"],
    ["SMS Gateway (Twilio)", "External System", "SMS notifications for status updates", "REST API", "~1500 SMS/month"],
    ["Barcode Scanner", "Hardware Device", "Scan product barcodes for receiving and inspection", "Web Bluetooth API", "~500 scans/month"],
    ["Azure AD / Entra ID", "External System", "Corporate SSO for agent and admin authentication", "OAuth 2.0 / OIDC", "All internal users"],
  ]
));

c.push(heading("2.2 System Boundaries", 2));
c.push(para("The RMS has clearly defined boundaries that distinguish its responsibilities from those of external systems. Understanding these boundaries is critical for designing integration contracts and managing dependencies. The RMS owns the complete return workflow from customer submission through refund processing, while delegating financial transactions to SAP ERP and communication delivery to SendGrid and Twilio."));
c.push(createTable(
  ["Boundary", "Inside RMS (Owned)", "Outside RMS (Delegated)"],
  [
    ["Return Workflow", "Full lifecycle management: submission through closure", "N/A (core domain)"],
    ["Financial Processing", "Refund calculation, approval workflow", "Actual financial posting to SAP ERP"],
    ["Inventory Management", "Return item tracking, inspection status", "Stock level updates in SAP ERP"],
    ["Communication", "Template management, notification rules, delivery tracking", "Actual email/SMS delivery via SendGrid/Twilio"],
    ["Authentication", "Internal session management, role-based access", "Identity verification via Azure AD"],
    ["Product Catalog", "Product lookup for return validation", "Master product data in SAP ERP"],
    ["Customer Data", "Customer profile for return tracking", "Master customer data in SAP CRM"],
  ]
));

// ========== 3. ARCHITECTURE DESIGN ==========
c.push(heading("3. Architecture Design", 1));
c.push(para("The Kontakt Home RMS adopts a layered, modular architecture inspired by microservices principles but implemented as a modular monolith for the initial release. This approach provides clear separation of concerns, independent deployability of modules, and the ability to extract microservices in the future if scaling demands require it. The architecture is designed to support the five user roles, 17 features (FEAT-001 through FEAT-017), 24 API endpoints, and 12 core requirements (REQ-101 through REQ-112) defined in the project's requirements documents."));

c.push(heading("3.1 Architecture Style Selection", 2));
c.push(para("The architecture style selection was driven by a careful evaluation of the project's current and anticipated needs. A modular monolith with clear module boundaries was chosen over pure microservices for the initial release, while the architecture is designed to allow extraction of individual modules into microservices in future phases if required by scaling demands."));
c.push(createTable(
  ["Architecture Style", "Pros", "Cons", "Suitability"],
  [
    ["Monolithic", "Simple deployment, easy debugging, low operational overhead", "Tight coupling, difficult to scale independently", "Low - too rigid"],
    ["Microservices", "Independent scaling, technology flexibility, fault isolation", "Complex operations, network latency, distributed data", "Low for MVP - too complex"],
    ["Modular Monolith (Selected)", "Clear boundaries, simple ops, future microservice extraction", "Single deployment unit, shared database", "High - best balance"],
    ["Event-Driven", "Loose coupling, real-time processing, async workflows", "Complex debugging, eventual consistency", "Medium - for specific modules"],
  ]
));

c.push(heading("3.2 Architectural Decisions (ADR Summary)", 2));
c.push(para("All significant architectural decisions are documented as Architecture Decision Records (ADRs) and stored in the project repository. The following table summarizes the key decisions that have the greatest impact on the system design and implementation approach."));
c.push(createTable(
  ["ADR #", "Decision", "Status", "Rationale Summary"],
  [
    ["ADR-001", "Modular monolith with modular monolith architecture", "Accepted", "Balance simplicity with future extensibility"],
    ["ADR-002", "Node.js + TypeScript for backend API", "Accepted", "Team expertise, rich ecosystem, JSON-native"],
    ["ADR-003", "React 18 + TypeScript for frontend", "Accepted", "Component reusability, strong typing, large community"],
    ["ADR-004", "PostgreSQL for primary data store", "Accepted", "ACID compliance, JSON support, mature tooling"],
    ["ADR-005", "Azure Redis Cache for session and response caching", "Accepted", "Low latency, Azure integration, pub/sub capability"],
    ["ADR-006", "JWT Bearer tokens for authentication", "Accepted", "Stateless, scalable, Azure AD compatible"],
    ["ADR-007", "Azure Service Bus for async message processing", "Accepted", "Managed service, dead-letter queues, transactions"],
    ["ADR-008", "PWA over native mobile apps for warehouse", "Accepted", "No app store, instant updates, lower cost"],
    ["ADR-009", "Azure Blob Storage for file and document storage", "Accepted", "Scalable, cheap, CDN integration"],
    ["ADR-010", "Flyway for database schema migrations", "Accepted", "Version-controlled, repeatable, team-friendly"],
    ["ADR-011", "Tailwind CSS for UI styling", "Accepted", "Utility-first, rapid development, consistent design"],
    ["ADR-012", "SAP ERP integration via REST API (not IDoc)", "Accepted", "Simpler, real-time, better error handling"],
  ]
));

// ========== 4. HIGH-LEVEL ARCHITECTURE ==========
c.push(heading("4. High-Level System Architecture", 1));
c.push(para("The high-level system architecture defines the major tiers, components, and data flows that comprise the RMS. The architecture follows a three-tier pattern (Presentation, Application, Data) with cross-cutting concerns (Security, Monitoring, Logging) that span all tiers. Each tier is independently scalable and can be deployed to multiple instances for high availability."));

c.push(heading("4.1 Architecture Tiers", 2));
c.push(createTable(
  ["Tier", "Components", "Responsibility", "Technology"],
  [
    ["Presentation Tier", "Customer Portal, Agent Dashboard, Warehouse App, Manager Dashboard, Admin Console", "User interface rendering, client-side validation, state management", "React 18, TypeScript, Tailwind CSS, Vite"],
    ["Application Tier", "API Gateway, Auth Service, Return Service, Validation Engine, Warehouse Service, Refund Service, Notification Service, Analytics Service, Admin Service", "Business logic, orchestration, workflow management, data transformation", "Node.js 20, Express, TypeScript"],
    ["Data Tier", "PostgreSQL Database, Redis Cache, Azure Blob Storage, Azure Service Bus", "Persistent storage, caching, file storage, async messaging", "Azure PostgreSQL, Redis, Blob, Service Bus"],
    ["Integration Tier", "SAP ERP Connector, Email Gateway, SMS Gateway, Barcode Scanner Interface", "External system communication, protocol adaptation, data mapping", "Axios HTTP client, Web Bluetooth API"],
    ["Infrastructure Tier", "Azure App Service, Azure AD, Application Insights, Key Vault, CDN", "Hosting, identity, monitoring, secrets, content delivery", "Microsoft Azure services"],
  ]
));

c.push(heading("4.2 Data Flow Overview", 2));
c.push(para("The primary data flow through the system follows the return request lifecycle. When a customer submits a return request, the data flows through multiple components in a coordinated sequence. Each step involves validation, state transitions, and notifications that keep all stakeholders informed of the return progress."));
c.push(bullet("Step 1 (Customer Portal): Customer submits return request with order details, reason, and photos"));
c.push(bullet("Step 2 (API Gateway): Request authenticated via Azure AD JWT token, rate-limited, routed to Return Service"));
c.push(bullet("Step 3 (Return Service): Request validated, RMA number generated (REQ-103), saved to PostgreSQL"));
c.push(bullet("Step 4 (Validation Engine): Eligibility checked against policy rules (REQ-102), SAP order verified"));
c.push(bullet("Step 5 (Notification Service): Confirmation email/SMS sent to customer, task assigned to agent"));
c.push(bullet("Step 6 (Agent Dashboard): Agent reviews request, approves/rejects, communicates with customer"));
c.push(bullet("Step 7 (Warehouse App): Item received via barcode scan (REQ-104), inspection performed (REQ-105)"));
c.push(bullet("Step 8 (Refund Service): Refund calculated (REQ-106), posted to SAP ERP (REQ-107), notification sent"));
c.push(bullet("Step 9 (Analytics Service): Metrics updated in real-time for management dashboards (REQ-109)"));
c.push(bullet("Step 10 (Audit Trail): Every action logged with timestamp, user, and change details (REQ-111)"));

c.push(heading("4.3 Component Interaction Diagram", 2));
c.push(para("The following table describes the key component interactions that define how data and control flow between the major system components. These interactions are the foundation for the detailed API design documented in Section 7 and the integration design documented in Section 12."));
c.push(createTable(
  ["Source Component", "Target Component", "Interaction Type", "Protocol", "Description"],
  [
    ["Customer Portal", "API Gateway", "Synchronous Request", "HTTPS/REST", "Submit, track, cancel return requests"],
    ["API Gateway", "Auth Service", "Synchronous Request", "In-process", "JWT token validation and role extraction"],
    ["API Gateway", "Return Service", "Synchronous Request", "In-process", "Return CRUD operations"],
    ["Return Service", "Validation Engine", "Synchronous Request", "In-process", "Eligibility and policy rule evaluation"],
    ["Return Service", "SAP ERP Connector", "Synchronous Request", "HTTPS/REST", "Order lookup and inventory verification"],
    ["Return Service", "Notification Service", "Asynchronous Message", "Azure Service Bus", "Send confirmation and status update notifications"],
    ["Warehouse App", "Warehouse Service", "Synchronous Request", "HTTPS/REST", "Receive items, record inspections"],
    ["Warehouse Service", "Refund Service", "Asynchronous Message", "Azure Service Bus", "Trigger refund calculation after inspection"],
    ["Refund Service", "SAP ERP Connector", "Synchronous Request", "HTTPS/REST", "Post refund to financial system"],
    ["Analytics Service", "PostgreSQL", "Synchronous Query", "TCP/SQL", "Aggregate metrics for dashboards"],
    ["All Services", "Audit Logger", "Synchronous Event", "In-process", "Record all state changes for audit trail"],
    ["Admin Console", "Admin Service", "Synchronous Request", "HTTPS/REST", "User management, policy configuration"],
  ]
));

// ========== 5. COMPONENT DESIGN ==========
c.push(heading("5. Component Design", 1));
c.push(para("Each component in the application tier is designed as an independent module with well-defined interfaces, responsibilities, and dependencies. The component design follows the Dependency Inversion Principle, where high-level business modules define interfaces that are implemented by lower-level infrastructure modules. This design enables unit testing through dependency injection and facilitates future extraction of modules into separate services if scaling requires it."));

c.push(heading("5.1 Auth Service Module", 2));
c.push(para("The Auth Service is responsible for all authentication and authorization operations within the RMS. It integrates with Microsoft Azure AD (Entra ID) for internal user authentication (agents, warehouse staff, managers, admins) and provides a local authentication mechanism for customer portal access. The module implements Role-Based Access Control (RBAC) with five roles matching the user personas defined in the BRD."));
c.push(createTable(
  ["Component", "Responsibility", "Key Methods", "Dependencies"],
  [
    ["Token Validator", "Validate JWT tokens, extract claims", "validateToken(), extractRoles()", "Azure AD JWKS endpoint"],
    ["Session Manager", "Manage user sessions and refresh tokens", "createSession(), refreshSession(), revokeSession()", "Redis Cache"],
    ["RBAC Engine", "Enforce role-based access control", "checkPermission(), getAccessibleResources()", "Policy Store (PostgreSQL)"],
    ["Customer Auth", "Handle customer portal authentication", "register(), login(), passwordReset()", "PostgreSQL, SendGrid"],
    ["API Key Manager", "Manage API keys for external integrations", "generateKey(), validateKey(), revokeKey()", "Azure Key Vault"],
  ]
));

c.push(heading("5.2 Return Service Module", 2));
c.push(para("The Return Service is the core business module that manages the complete lifecycle of return requests. It orchestrates interactions with the Validation Engine, SAP ERP, Notification Service, and Warehouse Service to process returns from submission through closure. The module implements the state machine pattern to manage the eight return statuses defined in the business requirements."));
c.push(createTable(
  ["Component", "Responsibility", "Key Methods", "Related REQs"],
  [
    ["Return Controller", "Handle HTTP requests for return operations", "createReturn(), getReturn(), listReturns(), updateReturn()", "REQ-101, REQ-103"],
    ["Return State Machine", "Manage return status transitions", "transitionTo(), getValidTransitions(), getHistory()", "REQ-101"],
    ["RMA Generator", "Generate unique RMA numbers", "generateRMA(), validateRMA()", "REQ-103"],
    ["Return Validator", "Validate return request data", "validateCreate(), validateUpdate()", "REQ-102"],
    ["Document Handler", "Manage photo and document uploads", "uploadPhoto(), getPhoto(), deletePhoto()", "REQ-101"],
    ["Return Repository", "Data access layer for return entities", "findById(), save(), update(), query()", "All return REQs"],
  ]
));

c.push(heading("5.3 Validation Engine Module", 2));
c.push(para("The Validation Engine is a rule-based system that evaluates return requests against configurable business policies. It determines eligibility for returns based on product type, purchase date, return reason, product condition, and customer return history. The engine uses a policy rule configuration system (REQ-112) that allows business users to modify validation rules without code changes."));
c.push(createTable(
  ["Component", "Responsibility", "Key Methods", "Related REQs"],
  [
    ["Rule Engine", "Evaluate business rules against return data", "evaluate(), addRule(), removeRule()", "REQ-102, REQ-112"],
    ["Eligibility Checker", "Determine if return request is eligible", "checkEligibility(), getRejectionReasons()", "REQ-102"],
    ["Policy Rule Store", "Manage configurable policy rules", "getRules(), updateRules(), getRuleHistory()", "REQ-112"],
    ["Policy Compiler", "Compile policy rules into executable format", "compile(), validate(), deploy()", "REQ-112"],
    ["Audit Logger", "Log all validation decisions for audit", "logDecision(), getDecisionHistory()", "REQ-111"],
  ]
));

c.push(heading("5.4 Warehouse Service Module", 2));
c.push(para("The Warehouse Service handles all warehouse operations related to returns, including item receiving, barcode scanning, quality inspection, and grading. The service is optimized for mobile-first interaction, with large touch targets and simplified workflows designed for warehouse environments where staff may be wearing gloves or operating in low-light conditions."));
c.push(createTable(
  ["Component", "Responsibility", "Key Methods", "Related REQs"],
  [
    ["Receiving Controller", "Handle warehouse receiving operations", "startReceiving(), scanItem(), confirmReceiving()", "REQ-104"],
    ["Barcode Processor", "Process barcode scans and match items", "scanBarcode(), matchItem(), validateScan()", "REQ-104"],
    ["Inspection Handler", "Manage quality inspection workflow", "startInspection(), recordFinding(), gradeItem()", "REQ-105"],
    ["Grading Engine", "Assign quality grades to returned items", "calculateGrade(), getGradeCriteria()", "REQ-105"],
    ["Warehouse Repository", "Data access for warehouse entities", "findInspection(), saveInspection()", "REQ-104, REQ-105"],
  ]
));

c.push(heading("5.5 Refund Service Module", 2));
c.push(para("The Refund Service manages the financial processing of approved returns, including refund calculation, approval workflows, and ERP integration for financial posting. The service implements complex business rules for refund amounts based on product condition, return reason, warranty status, and store credit versus original payment method preferences."));
c.push(createTable(
  ["Component", "Responsibility", "Key Methods", "Related REQs"],
  [
    ["Refund Calculator", "Calculate refund amounts based on rules", "calculateRefund(), applyDeductions()", "REQ-106"],
    ["Refund Approver", "Manage refund approval workflow", "submitForApproval(), approve(), reject()", "REQ-106"],
    ["ERP Connector", "Post refund transactions to SAP ERP", "postRefund(), checkStatus(), reconcile()", "REQ-107"],
    ["Refund Repository", "Data access for refund entities", "findRefund(), saveRefund()", "REQ-106, REQ-107"],
    ["Reconciliation Engine", "Reconcile RMS refunds with SAP records", "reconcile(), reportDiscrepancies()", "REQ-107"],
  ]
));

c.push(heading("5.6 Notification Service Module", 2));
c.push(para("The Notification Service handles all outbound communications to customers and internal stakeholders via email and SMS channels. The service uses a template-based approach where notification templates are stored in the database and can be modified by administrators without code changes. The service supports multi-language notifications in Azerbaijani, Russian, and English to serve Kontakt Home's diverse customer base."));
c.push(createTable(
  ["Component", "Responsibility", "Key Methods", "Related REQs"],
  [
    ["Notification Dispatcher", "Route notifications to appropriate channel", "dispatch(), getChannelPreference()", "REQ-108"],
    ["Email Sender", "Send emails via SendGrid gateway", "sendEmail(), sendTemplate()", "REQ-108"],
    ["SMS Sender", "Send SMS via Twilio gateway", "sendSMS(), checkDelivery()", "REQ-108"],
    ["Template Manager", "Manage notification templates", "getTemplate(), renderTemplate()", "REQ-108"],
    ["Delivery Tracker", "Track notification delivery status", "recordDelivery(), getDeliveryStatus()", "REQ-108"],
  ]
));

c.push(heading("5.7 Analytics Service Module", 2));
c.push(para("The Analytics Service provides real-time and historical data aggregation for the management analytics dashboard. It precomputes key metrics on a scheduled basis and provides APIs for on-demand queries. The service supports drill-down analysis from high-level KPIs to individual return records, enabling managers to identify trends and areas for improvement in the return process."));
c.push(createTable(
  ["Component", "Responsibility", "Key Methods", "Related REQs"],
  [
    ["Metrics Aggregator", "Aggregate return metrics from raw data", "calculateMetrics(), refreshCache()", "REQ-109"],
    ["Dashboard API", "Provide data APIs for dashboard widgets", "getOverview(), getTrend(), getBreakdown()", "REQ-109"],
    ["Report Generator", "Generate exportable reports in PDF/Excel", "generateReport(), scheduleReport()", "REQ-109"],
    ["Data Exporter", "Export data for external analysis", "exportCSV(), exportJSON()", "REQ-109"],
  ]
));

c.push(heading("5.8 Admin Service Module", 2));
c.push(para("The Admin Service provides system administration capabilities including user management, role assignment, policy configuration, and system settings. The service enforces strict access controls ensuring that only authorized administrators can modify system configuration. All administrative actions are logged to the audit trail for compliance and accountability purposes."));
c.push(createTable(
  ["Component", "Responsibility", "Key Methods", "Related REQs"],
  [
    ["User Manager", "Manage system users and roles", "createUser(), assignRole(), deactivateUser()", "REQ-110"],
    ["Policy Configurator", "Manage business policy rules", "updatePolicy(), getPolicyHistory()", "REQ-112"],
    ["System Settings", "Manage global system configuration", "getSettings(), updateSettings()", "REQ-110"],
    ["Audit Viewer", "View and export audit trail data", "getAuditLog(), exportAudit()", "REQ-111"],
  ]
));

// ========== 6. DATA ARCHITECTURE ==========
c.push(heading("6. Data Architecture and Database Design", 1));
c.push(para("The data architecture defines how the RMS stores, retrieves, and manages data throughout the return lifecycle. The primary data store is Azure PostgreSQL Flexible Server, chosen for its ACID compliance, JSON support for semi-structured data, read replica capability for analytics, and mature ecosystem. The database schema is designed in third normal form (3NF) with strategic denormalization for read-heavy analytics queries. All entities use soft deletes (deleted_at column) to preserve data integrity and support the audit trail requirement (REQ-111)."));

c.push(heading("6.1 Entity-Relationship Overview", 2));
c.push(para("The RMS data model consists of 12 core entities organized around the return request lifecycle. The central entity is ReturnRequest, which links to Users, Orders, ReturnItems, Inspections, Refunds, and Notifications. PolicyRule and AuditLog entities provide configuration and compliance support respectively. The following table describes each entity and its role in the system."));
c.push(createTable(
  ["Entity", "Table Name", "Description", "Key Fields", "Relationships"],
  [
    ["User", "users", "System users across all five roles", "id, email, role, status, azure_ad_id", "1:N to ReturnRequest, AuditLog"],
    ["Product", "products", "Product catalog for return validation", "id, sku, name, category, return_policy_days", "1:N to ReturnItem"],
    ["Order", "orders", "Customer orders from SAP ERP", "id, sap_order_id, customer_id, order_date, total", "1:N to ReturnRequest"],
    ["ReturnRequest", "return_requests", "Central entity for return lifecycle", "id, rma_number, status, customer_id, order_id", "N:1 to User, Order; 1:N to ReturnItem"],
    ["ReturnItem", "return_items", "Individual items within a return", "id, return_request_id, product_id, quantity, reason", "N:1 to ReturnRequest, Product; 1:1 to Inspection"],
    ["Inspection", "inspections", "Warehouse quality inspection records", "id, return_item_id, grade, findings, inspector_id", "N:1 to ReturnItem, User"],
    ["Refund", "refunds", "Financial refund transactions", "id, return_request_id, amount, method, status, sap_refund_id", "N:1 to ReturnRequest"],
    ["Notification", "notifications", "Communication records sent to users", "id, return_request_id, channel, template, status", "N:1 to ReturnRequest"],
    ["PolicyRule", "policy_rules", "Configurable business rules for validation", "id, rule_type, condition, action, active", "Standalone config entity"],
    ["AuditLog", "audit_logs", "Immutable audit trail of all system actions", "id, entity_type, entity_id, action, user_id, timestamp", "N:1 to User; polymorphic to all entities"],
    ["Attachment", "attachments", "Photos and documents uploaded to returns", "id, return_request_id, file_url, file_type", "N:1 to ReturnRequest"],
    ["IntegrationLog", "integration_logs", "External system interaction records", "id, system, direction, request, response, status", "Standalone logging entity"],
  ]
));

c.push(heading("6.2 Return Request Status State Machine", 2));
c.push(para("The ReturnRequest entity follows a defined state machine with eight statuses. Each status transition is validated by the business rules engine and logged to the audit trail. The state machine prevents invalid transitions and ensures that returns follow the correct business process sequence."));
c.push(createTable(
  ["Status Code", "Status Name", "Description", "Valid Next States", "Responsible Role"],
  [
    ["DRAFT", "Draft", "Return request created but not yet submitted by customer", "SUBMITTED, CANCELLED", "Customer"],
    ["SUBMITTED", "Submitted", "Return request submitted and pending agent review", "APPROVED, REJECTED, CANCELLED", "Customer"],
    ["APPROVED", "Approved", "Return request approved by support agent", "RECEIVING, CANCELLED", "Support Agent"],
    ["REJECTED", "Rejected", "Return request rejected with reason", "CLOSED", "Support Agent"],
    ["RECEIVING", "Receiving", "Item being received at warehouse", "INSPECTING, RECEIVED", "Warehouse Staff"],
    ["INSPECTING", "Inspecting", "Item undergoing quality inspection", "INSPECTED", "Warehouse Staff"],
    ["INSPECTED", "Inspected", "Inspection complete, awaiting refund processing", "REFUNDING, CANCELLED", "Warehouse Staff"],
    ["REFUNDING", "Refunding", "Refund being processed", "REFUNDED, REFUND_FAILED", "System (automated)"],
    ["REFUNDED", "Refunded", "Refund successfully processed and posted", "CLOSED", "System (automated)"],
    ["REFUND_FAILED", "Refund Failed", "Refund processing failed, requires manual intervention", "REFUNDING, ESCALATED", "Manager"],
    ["CLOSED", "Closed", "Return request completed", "None (terminal state)", "System / Agent"],
    ["CANCELLED", "Cancelled", "Return request cancelled by customer or agent", "None (terminal state)", "Customer / Agent"],
  ]
));

c.push(heading("6.3 Database Schema Details", 2));
c.push(para("The following subsections provide the detailed column definitions for the most critical tables in the system. All tables include standard audit columns (created_at, updated_at, created_by, updated_by) and use UUID primary keys for distributed system compatibility."));

c.push(heading("6.3.1 return_requests Table", 3));
c.push(createTable(
  ["Column", "Type", "Constraints", "Description"],
  [
    ["id", "UUID", "PK, DEFAULT uuid_generate_v4()", "Unique return request identifier"],
    ["rma_number", "VARCHAR(20)", "UNIQUE, NOT NULL", "RMA-YYYY-NNNNNN format"],
    ["status", "VARCHAR(30)", "NOT NULL, DEFAULT 'DRAFT'", "Current return status (state machine)"],
    ["customer_id", "UUID", "FK to users, NOT NULL", "Customer who submitted the return"],
    ["order_id", "UUID", "FK to orders, NOT NULL", "Original order being returned"],
    ["return_reason", "VARCHAR(50)", "NOT NULL", "DEFECTIVE, WRONG_ITEM, NOT_NEEDED, etc."],
    ["return_description", "TEXT", "NULLABLE", "Customer's description of the issue"],
    ["preferred_resolution", "VARCHAR(20)", "NOT NULL", "REFUND, EXCHANGE, STORE_CREDIT"],
    ["total_estimated_refund", "DECIMAL(10,2)", "NULLABLE", "Estimated refund amount"],
    ["actual_refund_amount", "DECIMAL(10,2)", "NULLABLE", "Final approved refund amount"],
    ["submitted_at", "TIMESTAMP", "NULLABLE", "When customer submitted the request"],
    ["approved_at", "TIMESTAMP", "NULLABLE", "When agent approved the request"],
    ["rejected_at", "TIMESTAMP", "NULLABLE", "When agent rejected the request"],
    ["rejection_reason", "TEXT", "NULLABLE", "Reason for rejection"],
    ["closed_at", "TIMESTAMP", "NULLABLE", "When the return was closed"],
    ["created_at", "TIMESTAMP", "NOT NULL, DEFAULT NOW()", "Record creation timestamp"],
    ["updated_at", "TIMESTAMP", "NOT NULL, DEFAULT NOW()", "Last update timestamp"],
    ["deleted_at", "TIMESTAMP", "NULLABLE", "Soft delete timestamp"],
  ]
));

c.push(heading("6.3.2 inspections Table", 3));
c.push(createTable(
  ["Column", "Type", "Constraints", "Description"],
  [
    ["id", "UUID", "PK, DEFAULT uuid_generate_v4()", "Unique inspection identifier"],
    ["return_item_id", "UUID", "FK to return_items, NOT NULL", "Item being inspected"],
    ["inspector_id", "UUID", "FK to users, NOT NULL", "Warehouse staff who performed inspection"],
    ["grade", "VARCHAR(20)", "NOT NULL", "A (like new), B (good), C (fair), D (poor), F (unusable)"],
    ["physical_condition", "VARCHAR(30)", "NOT NULL", "EXCELLENT, GOOD, FAIR, DAMAGED, MISSING_PARTS"],
    ["functional_test", "BOOLEAN", "NOT NULL", "Whether the item passed functional testing"],
    ["findings", "TEXT", "NULLABLE", "Detailed inspection notes and findings"],
    ["photos", "JSONB", "NULLABLE", "Array of photo URLs taken during inspection"],
    ["inspected_at", "TIMESTAMP", "NOT NULL, DEFAULT NOW()", "When inspection was performed"],
    ["created_at", "TIMESTAMP", "NOT NULL, DEFAULT NOW()", "Record creation timestamp"],
    ["updated_at", "TIMESTAMP", "NOT NULL, DEFAULT NOW()", "Last update timestamp"],
  ]
));

c.push(heading("6.3.3 refunds Table", 3));
c.push(createTable(
  ["Column", "Type", "Constraints", "Description"],
  [
    ["id", "UUID", "PK, DEFAULT uuid_generate_v4()", "Unique refund identifier"],
    ["return_request_id", "UUID", "FK to return_requests, NOT NULL", "Associated return request"],
    ["amount", "DECIMAL(10,2)", "NOT NULL", "Refund amount"],
    ["currency", "VARCHAR(3)", "NOT NULL, DEFAULT 'AZN'", "Currency code"],
    ["method", "VARCHAR(20)", "NOT NULL", "ORIGINAL_PAYMENT, STORE_CREDIT, BANK_TRANSFER"],
    ["status", "VARCHAR(20)", "NOT NULL, DEFAULT 'PENDING'", "PENDING, PROCESSING, COMPLETED, FAILED"],
    ["sap_refund_id", "VARCHAR(50)", "NULLABLE", "SAP ERP refund document reference"],
    ["approved_by", "UUID", "FK to users, NULLABLE", "Manager who approved the refund"],
    ["processed_at", "TIMESTAMP", "NULLABLE", "When refund was posted to SAP"],
    ["failure_reason", "TEXT", "NULLABLE", "Reason if refund processing failed"],
    ["created_at", "TIMESTAMP", "NOT NULL, DEFAULT NOW()", "Record creation timestamp"],
    ["updated_at", "TIMESTAMP", "NOT NULL, DEFAULT NOW()", "Last update timestamp"],
  ]
));

c.push(heading("6.4 Indexing Strategy", 2));
c.push(para("The database indexing strategy is designed to optimize query performance for the most common access patterns identified through the API design and analytics requirements. Primary indexes support the main workflow queries, while secondary indexes support filtering, sorting, and analytics operations."));
c.push(createTable(
  ["Index", "Table", "Columns", "Type", "Purpose"],
  [
    ["idx_return_rma", "return_requests", "rma_number", "UNIQUE B-Tree", "Fast RMA number lookup"],
    ["idx_return_customer", "return_requests", "customer_id, created_at DESC", "B-Tree", "Customer's return history (paginated)"],
    ["idx_return_status", "return_requests", "status, created_at DESC", "B-Tree", "Agent queue by status"],
    ["idx_return_order", "return_requests", "order_id", "B-Tree", "Returns by order lookup"],
    ["idx_inspection_item", "inspections", "return_item_id", "UNIQUE B-Tree", "Inspection by return item"],
    ["idx_inspection_inspector", "inspections", "inspector_id, inspected_at DESC", "B-Tree", "Inspector workload tracking"],
    ["idx_refund_return", "refunds", "return_request_id", "UNIQUE B-Tree", "Refund by return request"],
    ["idx_refund_status", "refunds", "status, created_at DESC", "B-Tree", "Pending refund queue"],
    ["idx_audit_entity", "audit_logs", "entity_type, entity_id, created_at DESC", "B-Tree", "Audit trail by entity"],
    ["idx_audit_user", "audit_logs", "user_id, created_at DESC", "B-Tree", "User activity history"],
    ["idx_notification_return", "notifications", "return_request_id, created_at DESC", "B-Tree", "Notifications by return"],
    ["idx_analytics_date", "return_requests", "created_at", "B-Tree", "Analytics date range queries"],
  ]
));

c.push(heading("6.5 Data Migration Strategy", 2));
c.push(para("The data migration strategy addresses the initial data load from SAP ERP and the ongoing synchronization between systems. The initial migration will transfer product catalog data, historical order data (last 12 months), and active return records. Ongoing synchronization uses real-time API calls for transactional data and batch synchronization for reference data updates."));
c.push(bullet("Initial Load: Product catalog (5,000+ SKUs), order history (12 months, ~6,000 orders), active returns (~120 in-flight)"));
c.push(bullet("Real-time Sync: Order lookup, customer verification, refund posting (bidirectional via API)"));
c.push(bullet("Batch Sync: Product catalog updates (nightly), pricing changes (weekly), customer data (daily)"));
c.push(bullet("Migration Tooling: Custom ETL scripts using Node.js, with validation and rollback capability"));
c.push(bullet("Data Validation: Pre-migration data profiling, post-migration reconciliation, parallel run period"));

// ========== 7. API DESIGN ==========
c.push(heading("7. API Design and Integration Layer", 1));
c.push(para("The API layer provides the contract between the frontend applications and the backend services. The API follows RESTful design principles with OpenAPI 3.0 specification, JWT Bearer authentication, RFC 7807 error format, and consistent pagination patterns. The complete API specification is documented in the Swagger / OpenAPI 3.0 document and the REST API & JSON Specification document. This section provides the design rationale and architectural patterns that govern the API layer."));

c.push(heading("7.1 API Architecture Pattern", 2));
c.push(para("The API layer implements a layered architecture pattern with clear separation between the API Gateway (routing, authentication, rate limiting), Controllers (HTTP request/response handling), Services (business logic), and Repositories (data access). This pattern ensures that each layer can be tested independently and modified without affecting adjacent layers."));
c.push(createTable(
  ["Layer", "Responsibility", "Components", "Error Handling"],
  [
    ["API Gateway", "Request routing, auth validation, rate limiting, CORS", "Azure API Management + Express middleware", "Returns 401/403/429 with RFC 7807 format"],
    ["Controller Layer", "HTTP request parsing, validation, response formatting", "Express route handlers", "Returns 400/422 with field-level errors"],
    ["Service Layer", "Business logic, orchestration, state management", "Domain service classes", "Throws domain exceptions caught by controllers"],
    ["Repository Layer", "Database queries, connection management, caching", "TypeORM repositories + Redis cache", "Throws database exceptions caught by services"],
    ["Integration Layer", "External system communication, retry, fallback", "HTTP clients with circuit breakers", "Returns integration exceptions with fallback"],
  ]
));

c.push(heading("7.2 Endpoint Design Summary", 2));
c.push(para("The RMS exposes 24 RESTful endpoints organized across 8 resource groups. All endpoints follow consistent URL patterns, authentication requirements, and response formats. The endpoint design prioritizes clarity, consistency, and usability for frontend developers."));
c.push(createTable(
  ["Resource Group", "Base Path", "Endpoints", "Auth Required", "Rate Limit"],
  [
    ["Authentication", "/api/v1/auth", "POST /login, POST /refresh, POST /logout (3)", "None (login), JWT (refresh/logout)", "20 req/min (login)"],
    ["Return Requests", "/api/v1/returns", "GET (list), GET /:id, POST (create), PUT /:id, DELETE /:id (5)", "JWT (Customer/Agent/Manager)", "60 req/min"],
    ["Validation", "/api/v1/returns/:id", "POST /validate, POST /check-eligibility (2)", "JWT (Customer/Agent)", "30 req/min"],
    ["Warehouse", "/api/v1/warehouse", "POST /receive, POST /inspect, GET /queue (3)", "JWT (Warehouse Staff)", "60 req/min"],
    ["Refunds", "/api/v1/refunds", "POST /calculate, POST /process, GET /:id/status (3)", "JWT (Agent/Manager)", "30 req/min"],
    ["Notifications", "/api/v1/notifications", "GET /history, POST /preferences (2)", "JWT (all roles)", "60 req/min"],
    ["Analytics", "/api/v1/analytics", "GET /overview, GET /trends, GET /exports (3)", "JWT (Manager/Admin)", "20 req/min"],
    ["Admin", "/api/v1/admin", "GET /users, PUT /users/:id, GET /policies, PUT /policies/:id, GET /audit-logs (5)", "JWT (Admin only)", "30 req/min"],
  ]
));

c.push(heading("7.3 Authentication and Authorization Flow", 2));
c.push(para("The authentication flow differs for internal users (authenticated via Azure AD SSO) and external customers (authenticated via local credentials). Both flows produce JWT tokens that are used for subsequent API calls. The authorization layer enforces role-based access control at the endpoint level using Express middleware."));
c.push(bullet("Internal Users (Agent, Warehouse, Manager, Admin): Azure AD OAuth 2.0 redirect flow, JWT token with roles from Azure AD groups"));
c.push(bullet("External Users (Customer): Local email/password registration, email verification via SendGrid, JWT token with 'customer' role"));
c.push(bullet("Token Format: JWT with 15-minute access token expiry, 7-day refresh token, RS256 signing with Azure AD keys"));
c.push(bullet("Token Claims: sub (user ID), email, role, name, exp, iat, jti (token ID for revocation tracking)"));
c.push(bullet("Authorization Middleware: Per-endpoint role requirements defined in route configuration, 403 response for insufficient permissions"));

c.push(heading("7.4 Error Handling Design", 2));
c.push(para("All API errors follow the RFC 7807 Problem Details for HTTP APIs specification. This provides a consistent, machine-readable error format that enables frontend applications to handle errors gracefully. Each error includes a unique correlation ID that links to the corresponding log entry in Application Insights for debugging."));
c.push(createTable(
  ["HTTP Status", "Error Type", "When Used", "Example"],
  [
    ["400", "Validation Error", "Invalid request body or parameters", "Missing required field 'return_reason'"],
    ["401", "Authentication Error", "Missing or invalid token", "JWT token expired or malformed"],
    ["403", "Authorization Error", "Insufficient permissions", "Customer attempting admin operation"],
    ["404", "Not Found", "Resource does not exist", "Return request RMA-2026-000123 not found"],
    ["409", "Conflict", "Business rule violation", "Return already in INSPECTING status"],
    ["422", "Unprocessable Entity", "Semantic validation failure", "Return window of 14 days has expired"],
    ["429", "Rate Limited", "Too many requests", "Rate limit of 60 req/min exceeded"],
    ["500", "Internal Error", "Unexpected server error", "Database connection failure (correlation ID)"],
    ["502", "Bad Gateway", "External system unavailable", "SAP ERP connection timeout"],
    ["503", "Service Unavailable", "System maintenance or overload", "Service temporarily unavailable"],
  ]
));

// ========== 8. SECURITY ARCHITECTURE ==========
c.push(heading("8. Security Architecture", 1));
c.push(para("The security architecture implements a defense-in-depth strategy with security controls at every layer of the system: network, application, data, and identity. The design follows OWASP Top 10 guidelines and implements industry best practices for web application security. Security is not treated as an afterthought but is integrated into every architectural decision, from API design to database access patterns."));

c.push(heading("8.1 Security Layers", 2));
c.push(createTable(
  ["Security Layer", "Controls", "Implementation", "OWASP Coverage"],
  [
    ["Network Security", "TLS 1.3, WAF, IP allowlisting for admin", "Azure Front Door + WAF policy", "A05 (Security Misconfiguration)"],
    ["Identity & Access", "Azure AD SSO, RBAC, MFA for admin", "Entra ID + custom RBAC middleware", "A01 (Broken Access Control), A07 (Auth Failures)"],
    ["Application Security", "Input validation, output encoding, CSRF protection", "Joi validation, Helmet.js, csurf", "A03 (Injection), A05 (XSS)"],
    ["Data Security", "Encryption at rest (AES-256), in transit (TLS 1.3)", "Azure SQL TDE, Azure Blob encryption", "A02 (Cryptographic Failures)"],
    ["API Security", "JWT validation, rate limiting, API key rotation", "Azure API Management policies", "A01 (BOLA), A04 (Insecure Design)"],
    ["Audit & Logging", "Immutable audit trail, real-time alerting", "audit_logs table + Application Insights", "A09 (Logging Failures)"],
    ["Dependency Security", "Automated vulnerability scanning, SCA", "Snyk + Dependabot + npm audit", "A06 (Vulnerable Components)"],
    ["Secrets Management", "No secrets in code, key rotation, access logging", "Azure Key Vault + environment variables", "A05 (Security Misconfiguration)"],
  ]
));

c.push(heading("8.2 Data Classification and Protection", 2));
c.push(para("All data processed by the RMS is classified into sensitivity levels that determine the security controls applied to it. This classification drives encryption requirements, access controls, retention policies, and compliance obligations. The classification is aligned with Azerbaijan's data protection regulations and Kontakt Home's corporate data governance policies."));
c.push(createTable(
  ["Classification", "Data Examples", "Encryption at Rest", "Encryption in Transit", "Access Control", "Retention"],
  [
    ["Highly Confidential", "Customer PII (phone, email), payment info", "AES-256 (Azure SQL TDE)", "TLS 1.3 + field-level", "RBAC + MFA + audit", "3 years after closure"],
    ["Confidential", "Return details, inspection findings, refund amounts", "AES-256 (Azure SQL TDE)", "TLS 1.3", "RBAC + audit", "2 years after closure"],
    ["Internal", "User accounts, system settings, policy rules", "AES-256 (Azure SQL TDE)", "TLS 1.3", "RBAC", "Indefinite"],
    ["Public", "Return policy pages, FAQ content, status descriptions", "Standard", "TLS 1.3", "Anonymous read", "Indefinite"],
  ]
));

c.push(heading("8.3 Security Testing Strategy", 2));
c.push(bullet("Static Application Security Testing (SAST): SonarQube integrated into CI pipeline, blocking on critical findings"));
c.push(bullet("Dynamic Application Security Testing (DAST): OWASP ZAP automated scans against staging environment weekly"));
c.push(bullet("Dependency Scanning: Snyk automated vulnerability scanning on every pull request and daily full scan"));
c.push(bullet("Penetration Testing: Annual third-party penetration test before go-live and annually thereafter"));
c.push(bullet("Security Code Review: All code changes involving authentication, authorization, or data handling require security review"));
c.push(bullet("Secret Detection: Git-secrets pre-commit hook scans for accidentally committed credentials or API keys"));

// ========== 9. NFR MAPPING ==========
c.push(heading("9. Non-Functional Requirements Mapping", 1));
c.push(para("This section maps each non-functional requirement to its architectural implementation, ensuring traceability from business requirements to technical design decisions. The non-functional requirements are derived from the SRS document and the business KPIs defined in the BRD. Each NFR is assigned a target metric, measurement method, and the architectural component responsible for meeting it."));

c.push(heading("9.1 Performance Requirements", 2));
c.push(createTable(
  ["NFR ID", "Requirement", "Target Metric", "Measurement", "Architectural Implementation"],
  [
    ["NFR-P01", "API response time (standard operations)", "95th percentile < 200ms", "Application Insights APM", "Redis caching, connection pooling, query optimization"],
    ["NFR-P02", "API response time (complex operations)", "95th percentile < 500ms", "Application Insights APM", "Async processing, pagination, query optimization"],
    ["NFR-P03", "Dashboard load time", "Initial render < 2 seconds", "Lighthouse + RUM", "Precomputed metrics, lazy loading, CDN"],
    ["NFR-P04", "Return form submission", "End-to-end < 3 seconds", "Synthetic monitoring", "Optimized API, parallel validation, optimistic UI"],
    ["NFR-P05", "Concurrent users support", "200 concurrent users", "Load testing (k6)", "Azure App Service auto-scale (3-10 instances)"],
    ["NFR-P06", "Database query time", "95th percentile < 100ms", "PostgreSQL query logs", "Strategic indexing, query optimization, read replicas"],
  ]
));

c.push(heading("9.2 Availability and Reliability", 2));
c.push(createTable(
  ["NFR ID", "Requirement", "Target Metric", "Measurement", "Implementation"],
  [
    ["NFR-A01", "System uptime (production)", "99.5% monthly SLA", "Azure Monitor + synthetic probes", "Multi-instance deployment, health checks, auto-recovery"],
    ["NFR-A02", "Recovery Time Objective (RTO)", "< 1 hour", "Disaster recovery drills", "Azure automated backups, infrastructure as code"],
    ["NFR-A03", "Recovery Point Objective (RPO)", "< 15 minutes data loss", "Backup verification", "Continuous backup with point-in-time restore"],
    ["NFR-A04", "Mean Time Between Failures (MTBF)", "> 720 hours (30 days)", "Incident tracking", "Redundant components, circuit breakers, retry policies"],
    ["NFR-A05", "Mean Time To Recovery (MTTR)", "< 30 minutes", "Incident management", "Automated alerting, runbooks, auto-scaling"],
  ]
));

c.push(heading("9.3 Scalability Requirements", 2));
c.push(createTable(
  ["NFR ID", "Requirement", "Target Metric", "Implementation"],
  [
    ["NFR-S01", "Horizontal scaling (API)", "Support 3-10 instances without code change", "Stateless API design, Azure App Service auto-scale"],
    ["NFR-S02", "Database scaling (reads)", "Read replicas for analytics queries", "Azure PostgreSQL read replicas, connection routing"],
    ["NFR-S03", "File storage scaling", "Unlimited storage growth", "Azure Blob Storage (auto-scaling)"],
    ["NFR-S04", "Async processing scaling", "Handle burst loads of 5x normal", "Azure Service Bus (partitioned queues)"],
    ["NFR-S05", "CDN for static assets", "Global edge caching", "Azure CDN for frontend assets"],
  ]
));

c.push(heading("9.4 Security Requirements", 2));
c.push(createTable(
  ["NFR ID", "Requirement", "Target Metric", "Implementation"],
  [
    ["NFR-SE01", "Authentication security", "OAuth 2.0 + MFA for internal users", "Azure AD SSO + conditional access policies"],
    ["NFR-SE02", "Data encryption at rest", "AES-256 for all stored data", "Azure SQL TDE + Blob Storage encryption"],
    ["NFR-SE03", "Data encryption in transit", "TLS 1.3 for all communications", "Azure Front Door + enforced TLS"],
    ["NFR-SE04", "Vulnerability scan coverage", "Zero critical vulnerabilities in production", "SAST + DAST + dependency scanning in CI/CD"],
    ["NFR-SE05", "Secret management", "Zero secrets in source code", "Azure Key Vault + pre-commit detection"],
    ["NFR-SE06", "Audit logging completeness", "100% of state changes logged", "Audit middleware on all write operations"],
  ]
));

// ========== 10. DEPLOYMENT ARCHITECTURE ==========
c.push(heading("10. Deployment Architecture", 1));
c.push(para("The deployment architecture defines how the RMS is deployed across environments, from development through production. The system uses a multi-environment strategy with Infrastructure as Code (IaC) for consistent and repeatable deployments. All environments are hosted on Microsoft Azure with clear separation between development, testing, staging, and production."));

c.push(heading("10.1 Environment Strategy", 2));
c.push(createTable(
  ["Environment", "Purpose", "Infrastructure", "Data", "Access", "Deployment Frequency"],
  [
    ["Development (DEV)", "Developer workstation and unit testing", "Local Docker containers + Azure Dev", "Synthetic seed data", "Developers only", "On every commit"],
    ["Integration (INT)", "Feature integration and API testing", "Azure App Service (1 instance)", "Anonymized production subset", "Dev + QA teams", "Daily (CI pipeline)"],
    ["Staging (UAT)", "User acceptance testing and pre-production validation", "Azure App Service (2 instances)", "Full anonymized copy", "All stakeholders", "Per sprint release"],
    ["Production (PROD)", "Live system serving end users", "Azure App Service (3-10 instances auto)", "Real production data", "End users + ops team", "Per release (after UAT)"],
  ]
));

c.push(heading("10.2 Infrastructure Components", 2));
c.push(createTable(
  ["Component", "Service", "Tier/Size", "Purpose", "Cost Estimate (Monthly)"],
  [
    ["Frontend Hosting", "Azure Static Web Apps + CDN", "Standard", "Serve React SPA with global CDN", "$45"],
    ["Backend API", "Azure App Service (Linux)", "P2v3 (2 vCPU, 8GB), 3-10 instances", "Node.js API hosting", "$600-2000"],
    ["Database", "Azure PostgreSQL Flexible Server", "Standard_B2ms (2 vCPU, 8GB)", "Primary data store", "$350"],
    ["Read Replica", "Azure PostgreSQL Read Replica", "Standard_B1ms (1 vCPU, 2GB)", "Analytics query offload", "$80"],
    ["Cache", "Azure Redis Cache", "Standard C1 (1GB)", "Session and response caching", "$80"],
    ["Message Queue", "Azure Service Bus", "Standard tier (1,000 ops/sec)", "Async notification processing", "$50"],
    ["File Storage", "Azure Blob Storage", "Standard LRS (100GB)", "Photos, shipping labels, reports", "$3"],
    ["Monitoring", "Application Insights + Log Analytics", "Standard (5GB/month)", "APM, logging, alerting", "$35"],
    ["Secrets", "Azure Key Vault", "Standard", "Secrets, certificates, keys", "$1"],
    ["Identity", "Azure AD (Entra ID)", "P1 license (20 users)", "SSO, MFA, conditional access", "$180"],
  ]
));

c.push(heading("10.3 CI/CD Pipeline Architecture", 2));
c.push(para("The CI/CD pipeline is implemented using GitHub Actions for continuous integration and Azure DevOps Pipelines for deployment orchestration. The pipeline is triggered on every pull request and commit to the main branch, with environment-specific deployment stages and quality gates between each stage."));
c.push(createTable(
  ["Pipeline Stage", "Trigger", "Steps", "Quality Gate", "Duration"],
  [
    ["CI (Build + Test)", "Every PR and push to develop", "Lint, build, unit test, SAST scan, dependency check", "All tests pass, zero critical findings", "5-8 min"],
    ["Integration Test", "After CI on develop branch", "Deploy to INT, run integration tests, API contract tests", "All integration tests pass", "10-15 min"],
    ["Staging Deploy", "After sprint release branch merge", "Deploy to UAT, run smoke tests, notify QA team", "Smoke tests pass", "8-10 min"],
    ["UAT Validation", "Manual trigger after staging deploy", "QA runs UAT test cases on staging", "UAT sign-off from QA Lead", "5-10 days"],
    ["Production Deploy", "After UAT approval + Go/No-Go", "Blue-green deploy to PROD, smoke tests, health checks", "Health checks pass, no errors in 30 min", "10-15 min"],
    ["Rollback", "Automated on failure or manual", "Swap traffic back to previous version, verify health", "All health checks pass", "5 min"],
  ]
));

c.push(heading("10.4 Disaster Recovery Plan", 2));
c.push(para("The disaster recovery strategy ensures business continuity in the event of a major system failure or data loss incident. The plan defines recovery procedures, responsibilities, and tested runbooks that the operations team can execute to restore service within the defined RTO and RPO targets."));
c.push(createTable(
  ["Scenario", "Impact", "Recovery Procedure", "RTO", "RPO"],
  [
    ["Single instance failure", "Degraded performance", "Auto-scale replaces failed instance", "< 5 min (automatic)", "None"],
    ["Database primary failure", "Write operations unavailable", "Azure auto-failover to secondary", "< 1 min (automatic)", "< 5 min"],
    ["Full region outage", "Complete system unavailable", "Activate DR in paired Azure region", "< 1 hour", "< 15 min"],
    ["Data corruption", "Data integrity compromised", "Restore from latest backup + point-in-time", "< 1 hour", "< 15 min"],
    ["Security breach", "Data exposure risk", "Isolate affected systems, forensic analysis, credential rotation", "< 2 hours", "N/A"],
  ]
));

// ========== 11. TECHNOLOGY STACK ==========
c.push(heading("11. Technology Stack", 1));
c.push(para("The technology stack is selected based on team expertise, ecosystem maturity, cloud service availability, and long-term maintainability. The stack prioritizes TypeScript end-to-end for type safety and developer productivity, open-source frameworks for flexibility and community support, and Azure-native services for managed operations and reduced DevOps burden."));

c.push(heading("11.1 Complete Technology Matrix", 2));
c.push(createTable(
  ["Category", "Technology", "Version", "License", "Purpose"],
  [
    ["Frontend Framework", "React", "18.3", "MIT", "UI component rendering and state management"],
    ["Frontend Language", "TypeScript", "5.4", "Apache-2.0", "Type-safe client-side development"],
    ["CSS Framework", "Tailwind CSS", "3.4", "MIT", "Utility-first styling and responsive design"],
    ["Build Tool", "Vite", "5.2", "MIT", "Fast frontend build and dev server"],
    ["State Management", "React Query + Zustand", "5.x / 4.x", "MIT", "Server state + client state management"],
    ["Charting Library", "Recharts", "2.12", "MIT", "Analytics dashboard charts"],
    ["Backend Runtime", "Node.js", "20 LTS", "MIT", "Server-side JavaScript runtime"],
    ["Backend Language", "TypeScript", "5.4", "Apache-2.0", "Type-safe server-side development"],
    ["API Framework", "Express.js", "4.19", "MIT", "HTTP server and middleware"],
    ["ORM", "TypeORM", "0.3.20", "MIT", "Database access and entity mapping"],
    ["Validation", "Joi", "17.12", "BSD-3", "Request validation and schema definition"],
    ["Authentication", "Azure AD / Passport.js", "Latest / 0.7", "MIT", "OAuth 2.0 / OIDC authentication"],
    ["Testing (Unit)", "Jest", "29.7", "MIT", "Unit and integration testing"],
    ["Testing (E2E)", "Supertest", "6.3", "MIT", "API endpoint testing"],
    ["Testing (E2E UI)", "Playwright", "1.43", "Apache-2.0", "Browser automation testing"],
    ["Database", "PostgreSQL", "16", "PostgreSQL", "Primary relational data store"],
    ["Cache", "Redis", "7.2", "BSD-3", "Session and response caching"],
    ["Message Queue", "Azure Service Bus", "Managed", "Azure", "Async message processing"],
    ["Cloud Platform", "Microsoft Azure", "N/A", "Azure", "Infrastructure and managed services"],
    ["CI/CD", "GitHub Actions + Azure DevOps", "N/A", "GitHub/Microsoft", "Build, test, deploy automation"],
    ["Containerization", "Docker", "24", "Apache-2.0", "Container packaging for deployment"],
    ["IaC", "Terraform", "1.7", "BSL-1.1", "Infrastructure as Code for Azure resources"],
    ["Monitoring", "Azure Application Insights", "N/A", "Azure", "APM, logging, alerting"],
    ["API Docs", "Swagger UI + OpenAPI", "3.0", "Apache-2.0", "Interactive API documentation"],
    ["Code Quality", "SonarQube + ESLint + Prettier", "10.x / 9.x / 3.x", "LGPL / MIT / MIT", "Static analysis and code formatting"],
    ["DB Migration", "Flyway", "10.x", "Apache-2.0", "Version-controlled schema migrations"],
    ["Security Scanning", "Snyk + OWASP ZAP", "N/A", "Commercial / Apache-2.0", "Dependency and DAST scanning"],
    ["Project Management", "Jira + Confluence", "N/A", "Atlassian", "Agile project management and documentation"],
  ]
));

// ========== 12. INTERFACE DESIGN ==========
c.push(heading("12. Interface Design Specifications", 1));
c.push(para("This section defines the user interface specifications for each of the five system interfaces. Each interface is designed for its primary user role, device type, and usage context. The design follows a consistent design system built with Tailwind CSS components, ensuring visual coherence while optimizing each interface for its specific workflow requirements."));

c.push(heading("12.1 Interface Summary", 2));
c.push(createTable(
  ["Interface", "URL Path", "Technology", "Auth Method", "Primary Device", "Key Workflows"],
  [
    ["Customer Portal", "/portal", "React PWA", "Email/Password (JWT)", "Mobile-first", "Submit return, track status, upload photos"],
    ["Agent Dashboard", "/agent", "React SPA", "Azure AD SSO", "Desktop", "Review returns, approve/reject, communicate"],
    ["Warehouse App", "/warehouse", "React PWA", "Azure AD SSO", "Mobile", "Scan barcodes, receive items, inspect, grade"],
    ["Manager Dashboard", "/manager", "React SPA", "Azure AD SSO", "Desktop", "View KPIs, analyze trends, export reports"],
    ["Admin Console", "/admin", "React SPA", "Azure AD SSO + MFA", "Desktop", "Manage users, configure policies, view audit"],
  ]
));

c.push(heading("12.2 Customer Portal Design", 2));
c.push(para("The Customer Portal is designed as a mobile-first Progressive Web App (PWA) that provides a simple, guided return submission experience. The portal is optimized for customers who may be using their mobile phone in a store or at home, with large touch targets, clear visual feedback, and minimal steps to complete a return request. The design prioritizes simplicity over feature richness, presenting only the information and actions relevant to the customer's context."));
c.push(createTable(
  ["Screen", "Key Elements", "User Actions", "API Endpoints"],
  [
    ["Home / Return Start", "Order selector, return reason picker, photo upload", "Select order, choose reason, upload photos", "GET /orders, POST /returns"],
    ["Return Confirmation", "RMA number display, summary, next steps", "Review details, track return", "GET /returns/:id"],
    ["Return Tracking", "Status timeline, estimated completion, messages", "View status, send message", "GET /returns/:id, GET /notifications"],
    ["Return History", "List of past returns with status badges", "Filter, sort, view details", "GET /returns?customer_id=:id"],
    ["Profile / Settings", "Notification preferences, language selection", "Update preferences", "PUT /notifications/preferences"],
  ]
));

c.push(heading("12.3 Support Agent Dashboard Design", 2));
c.push(para("The Agent Dashboard is a desktop-optimized single-page application designed for information density and efficient workflow management. Support agents typically handle 30-50 return requests per day and need quick access to customer details, order history, return photos, and communication history. The dashboard features a queue-based layout where pending returns are displayed in a sortable, filterable list with inline quick actions."));
c.push(createTable(
  ["Screen", "Key Elements", "User Actions", "API Endpoints"],
  [
    ["Queue View", "Return list with status filters, search, sort", "Filter by status, search by RMA/name, sort", "GET /returns?status=:status"],
    ["Return Detail", "Full return info, order details, photos, timeline", "Approve, reject, request more info, communicate", "GET /returns/:id, PUT /returns/:id"],
    ["Validation Panel", "Eligibility check results, policy rule details", "Review auto-validation, override if needed", "POST /returns/:id/validate"],
    ["Communication", "Message thread with customer, templates", "Send message, use template, add note", "POST /notifications"],
    ["Bulk Actions", "Multi-select returns for batch operations", "Batch approve, batch reject, batch assign", "PUT /returns/bulk"],
  ]
));

c.push(heading("12.4 Warehouse Mobile App Design", 2));
c.push(para("The Warehouse App is a mobile-optimized PWA designed for hands-on warehouse operations. The interface features large touch targets (minimum 48x48px), high-contrast text for readability in warehouse lighting conditions, and a barcode-first workflow that minimizes manual data entry. The app works offline for critical scanning operations, syncing data when connectivity is restored."));
c.push(createTable(
  ["Screen", "Key Elements", "User Actions", "API Endpoints"],
  [
    ["Receive Queue", "List of approved returns awaiting receiving", "Select return, start receiving process", "GET /warehouse/queue"],
    ["Barcode Scanner", "Camera viewfinder with scan overlay", "Scan product barcode, match to return item", "POST /warehouse/receive"],
    ["Item Confirmation", "Scanned item details, quantity verification", "Confirm or flag discrepancy", "POST /warehouse/receive"],
    ["Inspection Form", "Condition checklist, grade selector, photo capture", "Record findings, assign grade, add notes", "POST /warehouse/inspect"],
    ["Completion Summary", "Inspection results, next step routing", "Review and submit inspection", "GET /warehouse/:id/status"],
  ]
));

c.push(heading("12.5 Manager Analytics Dashboard Design", 2));
c.push(para("The Manager Dashboard provides real-time operational intelligence through interactive charts, trend analysis, and drill-down capabilities. The design emphasizes visual clarity with chart-heavy layouts that allow managers to quickly assess return processing performance, identify bottlenecks, and make data-driven decisions. All charts support click-through drill-down from high-level KPIs to individual return records."));
c.push(createTable(
  ["Widget", "Visualization", "Data Source", "Drill-Down"],
  [
    ["KPI Overview Cards", "Number cards with trend arrows", "Precomputed daily metrics", "Click to filter all charts"],
    ["Return Volume Trend", "Line chart (daily/weekly/monthly)", "return_requests.created_at", "Click to see daily breakdown"],
    ["Returns by Category", "Pie/donut chart", "Product categories", "Click to see category details"],
    ["Processing Time Distribution", "Histogram", "Status transition timestamps", "Click to see slow returns"],
    ["Reason Analysis", "Bar chart with Pareto line", "return_requests.return_reason", "Click to see reason details"],
    ["Refund Amount Analysis", "Bar chart by period", "refunds.amount", "Click to see individual refunds"],
    ["Team Performance", "Stacked bar chart by agent", "audit_logs.user_id + timestamps", "Click to see agent details"],
    ["Export Reports", "Button with format selector", "Precomputed report data", "Download PDF/Excel"],
  ]
));

c.push(heading("12.6 Admin Console Design", 2));
c.push(para("The Admin Console provides system administration capabilities with a form-based interface that emphasizes clear labeling, confirmation dialogs for destructive actions, and comprehensive audit trail visibility. The console requires MFA in addition to standard Azure AD authentication and logs all administrative actions to the immutable audit trail."));
c.push(createTable(
  ["Screen", "Key Elements", "User Actions", "API Endpoints"],
  [
    ["User Management", "User list with role badges, search, filters", "Create user, assign role, deactivate, reset MFA", "GET/PUT/POST /admin/users"],
    ["Role Configuration", "Role permissions matrix", "Edit role permissions, view permission audit", "GET/PUT /admin/roles"],
    ["Policy Rule Editor", "Rule list with enable/disable toggles, edit forms", "Add rule, edit rule, toggle active, view history", "GET/PUT /admin/policies"],
    ["Audit Log Viewer", "Filterable log table with export", "Filter by entity, user, date, action; export CSV", "GET /admin/audit-logs"],
    ["System Settings", "Configuration form with sections", "Update settings, view change history", "GET/PUT /admin/settings"],
    ["Integration Health", "External system status dashboard", "View status, retry failed, view logs", "GET /admin/integrations"],
  ]
));

// ========== 13. ERROR HANDLING ==========
c.push(heading("13. Error Handling and Resilience Patterns", 1));
c.push(para("The system implements a comprehensive error handling strategy that ensures graceful degradation under failure conditions rather than catastrophic failure. The strategy employs circuit breaker patterns for external integrations, retry policies for transient failures, dead-letter queues for unprocessable messages, and comprehensive logging for debugging and audit purposes."));

c.push(heading("13.1 Resilience Patterns", 2));
c.push(createTable(
  ["Pattern", "Implementation", "Configuration", "Applied To"],
  [
    ["Circuit Breaker", "Custom middleware wrapping HTTP clients", "Open after 5 failures, 30s half-open, 10 test requests", "SAP ERP, SendGrid, Twilio integrations"],
    ["Retry with Backoff", "Exponential backoff retry middleware", "3 retries, 1s/2s/4s backoff, jitter", "All outbound HTTP calls"],
    ["Timeout", "Request timeout configuration", "5s (standard), 15s (batch), 30s (export)", "All API calls to external systems"],
    ["Bulkhead", "Connection pool limits per integration", "10 connections to SAP, 20 to SendGrid", "Database and HTTP connection pools"],
    ["Dead-Letter Queue", "Azure Service Bus dead-lettering", "Max 5 delivery attempts before DLQ", "Notification messages, refund triggers"],
    ["Graceful Degradation", "Fallback responses for non-critical features", "Cached data for analytics, static pages for portal", "Analytics, dashboard widgets"],
    ["Rate Limiting", "Token bucket algorithm", "Per-role limits (see Section 7.2)", "All API endpoints"],
  ]
));

c.push(heading("13.2 Logging and Observability Strategy", 2));
c.push(para("The logging strategy follows a structured logging approach where all log entries include a correlation ID, timestamp, log level, source component, and structured context data. This enables efficient searching, filtering, and analysis in Application Insights and Log Analytics. The correlation ID is generated at the API Gateway and propagated through all service calls and external integrations."));
c.push(createTable(
  ["Log Level", "When Used", "Examples", "Retention"],
  [
    ["ERROR", "Failures requiring immediate attention", "Database connection failure, SAP timeout, unhandled exceptions", "90 days"],
    ["WARNING", "Degraded operation or near-failure conditions", "Circuit breaker open, retry exhausted, rate limit approaching", "60 days"],
    ["INFO", "Significant business operations and state changes", "Return submitted, status changed, refund processed", "30 days"],
    ["DEBUG", "Detailed diagnostic information for troubleshooting", "Query execution plans, request/response payloads", "7 days"],
    ["TRACE", "Fine-grained execution flow (development only)", "Function entry/exit, variable values", "1 day (dev only)"],
  ]
));

// ========== 14. SCALABILITY ==========
c.push(heading("14. Scalability and Performance Strategy", 1));
c.push(para("The scalability strategy ensures the system can handle growth in both data volume and user traffic without architectural changes. The design supports vertical scaling within component instances and horizontal scaling across multiple instances. Performance optimization is built into the architecture through caching, query optimization, async processing, and CDN distribution."));

c.push(heading("14.1 Scaling Triggers and Responses", 2));
c.push(createTable(
  ["Metric", "Threshold", "Scale-Up Action", "Scale-Down Condition", "Max Instances"],
  [
    ["CPU Utilization", "> 70% for 5 minutes", "Add 1 instance", "< 30% for 10 minutes", "10 instances"],
    ["Memory Utilization", "> 80% for 5 minutes", "Add 1 instance", "< 40% for 10 minutes", "10 instances"],
    ["Request Queue Length", "> 100 requests for 2 minutes", "Add 1 instance", "< 10 requests for 10 minutes", "10 instances"],
    ["Response Time (P95)", "> 500ms for 5 minutes", "Add 1 instance", "< 200ms for 10 minutes", "10 instances"],
    ["Database Connections", "> 80% pool utilization", "Add read replica", "< 50% utilization", "3 replicas"],
    ["Redis Memory", "> 80% capacity", "Upgrade cache tier", "< 40% capacity", "C3 tier"],
  ]
));

c.push(heading("14.2 Performance Optimization Techniques", 2));
c.push(bullet("Database Query Optimization: Strategic indexing (12 indexes defined), query plan analysis, N+1 query prevention via eager loading"));
c.push(bullet("API Response Caching: Redis caching for frequently accessed data (product catalog, policy rules, user permissions) with 5-60 minute TTLs"));
c.push(bullet("CDN Distribution: Azure CDN for all static assets (JS, CSS, images) with 1-year cache headers and content-based versioning"));
c.push(bullet("Async Processing: Non-blocking notification delivery, refund processing, and analytics computation via Azure Service Bus queues"));
c.push(bullet("Connection Pooling: PostgreSQL connection pool (20 connections per instance), HTTP keep-alive for external integrations"));
c.push(bullet("Pagination: Cursor-based pagination for large datasets, offset-based for standard list views (max 100 items per page)"));
c.push(bullet("Image Optimization: WebP format with JPEG fallback, responsive images with srcset, lazy loading for below-fold content"));
c.push(bullet("Code Splitting: React lazy loading for route-level code splitting, reducing initial bundle size by approximately 60%"));

// ========== 15. GLOSSARY ==========
c.push(heading("15. Glossary and References", 1));

c.push(heading("15.1 Glossary of Terms", 2));
c.push(createTable(
  ["Term", "Definition"],
  [
    ["ADR", "Architecture Decision Record - a document capturing an important architectural decision"],
    ["Azure AD (Entra ID)", "Microsoft's cloud-based identity and access management service"],
    ["CDN", "Content Delivery Network - distributed server network for fast content delivery"],
    ["CI/CD", "Continuous Integration / Continuous Delivery - automated build, test, and deploy pipeline"],
    ["DoD", "Definition of Done - criteria that must be met for a user story to be considered complete"],
    ["ERP", "Enterprise Resource Planning - integrated business management software (SAP S/4HANA)"],
    ["JWT", "JSON Web Token - compact, URL-safe token format for authentication claims"],
    ["KPI", "Key Performance Indicator - measurable value demonstrating business objective achievement"],
    ["MFA", "Multi-Factor Authentication - security method requiring two or more verification factors"],
    ["MVP", "Minimum Viable Product - initial release with core features only"],
    ["PWA", "Progressive Web App - web application with native app-like capabilities"],
    ["RBAC", "Role-Based Access Control - authorization mechanism based on user roles"],
    ["RMA", "Return Merchandise Authorization - unique identifier assigned to each return request"],
    ["RPO", "Recovery Point Objective - maximum acceptable data loss measured in time"],
    ["RTO", "Recovery Time Objective - maximum acceptable system downtime duration"],
    ["SAST/DAST", "Static/Dynamic Application Security Testing"],
    ["SLA", "Service Level Agreement - commitment to system availability and performance"],
    ["SRS", "Software Requirements Specification"],
    ["TDD", "Test-Driven Development - development practice where tests are written before code"],
  ]
));

c.push(heading("15.2 References", 2));
c.push(bullet("OWASP Top 10 (2021): https://owasp.org/www-project-top-ten/"));
c.push(bullet("RFC 7807 Problem Details for HTTP APIs: https://datatracker.ietf.org/doc/html/rfc7807"));
c.push(bullet("OpenAPI Specification 3.0: https://spec.openapis.org/oas/v3.0.0"));
c.push(bullet("Azure Well-Architected Framework: https://learn.microsoft.com/en-us/azure/well-architected/"));
c.push(bullet("12-Factor App Methodology: https://12factor.net/"));
c.push(bullet("Microsoft REST API Guidelines: https://github.com/microsoft/api-guidelines"));

// ========== BUILD DOCUMENT ==========
async function main() {
  const doc = new docx.Document({
    sections: [
      {
        properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
        children: coverPage(),
      },
      {
        properties: {
          page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } },
          titlePage: true,
        },
        headers: {
          default: new docx.Header({
            children: [new docx.Paragraph({
              children: [
                new docx.TextRun({ text: "Kontakt Home  |  System Design Document  |  Confidential", size: 16, color: COLORS.gray, font: "Calibri", italics: true }),
              ],
              alignment: "right",
            })],
          }),
        },
        footers: {
          default: new docx.Footer({
            children: [new docx.Paragraph({
              children: [
                new docx.TextRun({ text: "Page ", size: 16, color: COLORS.gray, font: "Calibri" }),
                new docx.TextRun({ children: [docx.PageNumber.CURRENT], size: 16, color: COLORS.gray, font: "Calibri" }),
                new docx.TextRun({ text: "  |  Version 1.0  |  April 2026", size: 16, color: COLORS.gray, font: "Calibri" }),
              ],
              alignment: "center",
            })],
          }),
        },
        children: c,
      },
    ],
  });

  const buffer = await docx.Packer.toBuffer(doc);
  const outputPath = "/home/z/my-project/ba-practice/Kontakt_Home_System_Design_Return_Management_System.docx";
  fs.writeFileSync(outputPath, buffer);
  console.log("Document generated: " + outputPath);
  console.log("Size: " + (buffer.length / 1024).toFixed(1) + " KB");
}

main().catch(err => { console.error(err); process.exit(1); });
