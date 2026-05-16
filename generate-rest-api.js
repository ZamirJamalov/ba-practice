const docx = require("docx");
const fs = require("fs");

const COLORS = {
  deepSea: "1B3A5C", ocean: "2E86AB", sky: "A3CEF1", light: "E8F4F8",
  white: "FFFFFF", dark: "0F2439", gray: "666666", lightGray: "F5F5F5",
  accent: "1B6B93", green: "2E7D32", orange: "E65100", red: "C62828",
  purple: "6A1B9A", teal: "00796B", amber: "F57F17", get: "2E7D32",
  post: "1565C0", put: "E65100", delete: "C62828", patch: "6A1B9A",
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

function codeBlock(text) {
  const lines = text.split("\n");
  return lines.map((line, idx) => new docx.Paragraph({
    children: [new docx.TextRun({ text: line || " ", size: 18, color: COLORS.dark, font: "Consolas" })],
    shading: { fill: COLORS.lightGray, type: "clear" },
    spacing: { before: idx === 0 ? 80 : 0, after: idx === lines.length - 1 ? 80 : 0, line: 240 },
    indent: { left: 240, right: 240 },
  }));
}

function methodBadge(method, path) {
  const colorMap = { GET: COLORS.get, POST: COLORS.post, PUT: COLORS.put, DELETE: COLORS.delete, PATCH: COLORS.patch };
  return new docx.Paragraph({
    children: [
      new docx.TextRun({ text: ` ${method} `, bold: true, size: 20, color: COLORS.white, font: "Calibri", shading: { fill: colorMap[method] || COLORS.deepSea, type: "background-color" } }),
      new docx.TextRun({ text: `  ${path}`, size: 20, color: COLORS.dark, font: "Consolas", bold: true }),
    ],
    spacing: { before: 160, after: 40 },
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
    children: row.map((cell) => new docx.TableCell({
      children: [new docx.Paragraph({ children: [new docx.TextRun({ text: String(cell), size: 20, color: COLORS.dark, font: "Calibri" })] })],
      shading: { fill: idx % 2 === 0 ? COLORS.light : COLORS.white },
      width: { size: Math.floor(9000 / headers.length), type: "dxa" },
    })),
  }));
  return new docx.Table({ rows: [headerRow, ...dataRows], width: { size: 9000, type: "dxa" } });
}

function coloredPara(text, color) {
  return new docx.Paragraph({
    children: [new docx.TextRun({ text, size: 22, color: color, font: "Calibri" })],
    spacing: { after: 120, line: 276 },
  });
}

function divider() { return new docx.Paragraph({ spacing: { before: 80, after: 80 }, children: [] }); }

function statusTable() {
  return createTable(
    ["Status Code", "Meaning", "When Used"],
    [
      ["200 OK", "Request successful", "Successful GET, PUT, PATCH, DELETE operations"],
      ["201 Created", "Resource created", "Successful POST operations (e.g., create return request)"],
      ["204 No Content", "Success with no body", "Successful DELETE operations"],
      ["400 Bad Request", "Invalid request", "Malformed JSON, missing required fields, invalid parameters"],
      ["401 Unauthorized", "Authentication required", "Missing or invalid authentication token"],
      ["403 Forbidden", "Insufficient permissions", "Valid token but insufficient role permissions"],
      ["404 Not Found", "Resource not found", "Invalid endpoint or non-existent resource ID"],
      ["409 Conflict", "Resource conflict", "Duplicate return request, conflicting status update"],
      ["422 Unprocessable Entity", "Validation failed", "Business rule violation (e.g., outside return window)"],
      ["429 Too Many Requests", "Rate limit exceeded", "API rate limit threshold reached"],
      ["500 Internal Server Error", "Server error", "Unexpected server-side failure"],
      ["502 Bad Gateway", "Upstream failure", "ERP integration service unavailable"],
      ["503 Service Unavailable", "Service down", "System maintenance or temporary unavailability"],
    ]
  );
}

// ========== API ENDPOINTS DATA ==========
const endpoints = [
  // AUTH
  {
    group: "Authentication", groupDesc: "Endpoints for user authentication and token management. All subsequent API calls require a valid JWT token obtained through the authentication flow.",
    endpoints: [
      {
        method: "POST", path: "/api/v1/auth/login",
        desc: "Authenticates a user with email and password credentials. Returns a JWT access token (15-minute expiry) and a refresh token (7-day expiry) upon successful authentication. The access token must be included in the Authorization header of all subsequent API requests.",
        reqHeaders: [["Content-Type", "application/json"]],
        reqBody: '{\n  "email": "agent@kontakthome.az",\n  "password": "SecureP@ssw0rd!"\n}',
        resBody: '{\n  "success": true,\n  "data": {\n    "accessToken": "eyJhbGciOiJIUzI1NiIs...",\n    "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2g...",\n    "tokenType": "Bearer",\n    "expiresIn": 900,\n    "user": {\n      "id": "USR-001",\n      "email": "agent@kontakthome.az",\n      "role": "SUPPORT_AGENT",\n      "name": "Aysel Karimova",\n      "department": "Customer Service"\n    }\n  }\n}',
        resStatus: "200 OK",
      },
      {
        method: "POST", path: "/api/v1/auth/refresh",
        desc: "Exchanges a valid refresh token for a new access token. This endpoint should be called when the access token has expired (HTTP 401). The refresh token is rotated upon each use for security; the old refresh token is invalidated immediately.",
        reqHeaders: [["Content-Type", "application/json"]],
        reqBody: '{\n  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2g..."\n}',
        resBody: '{\n  "success": true,\n  "data": {\n    "accessToken": "eyJhbGciOiJIUzI1NiIs...",\n    "refreshToken": "bmV3IHJlZnJlc2ggdG9rZW4...",\n    "tokenType": "Bearer",\n    "expiresIn": 900\n  }\n}',
        resStatus: "200 OK",
      },
      {
        method: "POST", path: "/api/v1/auth/logout",
        desc: "Invalidates the current refresh token, effectively logging the user out. The access token remains valid until its natural expiry (15 minutes) but can be added to a client-side blocklist. All active sessions for the user are terminated.",
        reqHeaders: [["Authorization", "Bearer {accessToken}"]],
        reqBody: '{\n  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2g..."\n}',
        resBody: '{\n  "success": true,\n  "message": "Successfully logged out"\n}',
        resStatus: "200 OK",
      },
    ],
  },
  // RETURN REQUESTS
  {
    group: "Return Requests", groupDesc: "Core endpoints for managing product return requests. These endpoints support the complete lifecycle of a return request from creation through completion. Role-based access controls determine which operations each user role can perform.",
    endpoints: [
      {
        method: "POST", path: "/api/v1/returns",
        desc: "Creates a new return request. The system automatically validates the request against business rules (return window, product eligibility, customer history) and generates an approval decision. If approved, a unique RMA number is generated and a shipping label PDF is created. The customer receives confirmation via email and SMS.",
        reqHeaders: [["Authorization", "Bearer {accessToken}"], ["Content-Type", "application/json"]],
        reqBody: '{\n  "orderId": "ORD-2026-48721",\n  "customerEmail": "customer@email.com",\n  "items": [\n    {\n      "orderItemId": "OI-10482",\n      "productSku": "ELK-SMRT-TV-055",\n      "productName": "Samsung 55\" Smart TV",\n      "serialNumber": "SN-SMRT-2026-78432",\n      "returnReason": "DEFECTIVE",\n      "reasonDescription": "Screen flickers intermittently after 30 minutes of use",\n      "productCondition": "GOOD",\n      "purchasePrice": 1299.00,\n      "photos": [\n        "data:image/jpeg;base64,/9j/4AAQ...",\n        "data:image/jpeg;base64,/9j/4AAQ..."\n      ]\n    }\n  ],\n  "preferredResolution": "REFUND",\n  "customerNotes": "Problem started 3 days after purchase"\n}',
        resBody: '{\n  "success": true,\n  "data": {\n    "returnId": "RET-2026-000047",\n    "rmaNumber": "RMA-2026-000047",\n    "status": "APPROVED",\n    "validationResult": {\n      "eligible": true,\n      "purchaseDate": "2026-04-12",\n      "returnWindow": 14,\n      "daysRemaining": 8,\n      "policyViolations": []\n    },\n    "estimatedRefund": 1299.00,\n    "shippingLabel": {\n      "labelUrl": "/api/v1/returns/RMA-2026-000047/label",\n      "expiryDate": "2026-05-10",\n      "returnAddress": "Kontakt Home Returns Center, Baku Industrial Zone 2"\n    },\n    "createdAt": "2026-04-26T14:30:00Z",\n    "_links": {\n      "self": "/api/v1/returns/RMA-2026-000047",\n      "tracking": "/api/v1/returns/RMA-2026-000047/tracking",\n      "cancel": "/api/v1/returns/RMA-2026-000047/cancel"\n    }\n  }\n}',
        resStatus: "201 Created",
      },
      {
        method: "GET", path: "/api/v1/returns/{rmaNumber}",
        desc: "Retrieves the complete details of a specific return request by its RMA number. Returns the full return object including current status, item details, validation results, inspection data (if available), refund information (if processed), and the complete status history timeline. Customers can access their own returns; agents and managers can access any return.",
        reqHeaders: [["Authorization", "Bearer {accessToken}"]],
        reqBody: null,
        resBody: '{\n  "success": true,\n  "data": {\n    "returnId": "RET-2026-000047",\n    "rmaNumber": "RMA-2026-000047",\n    "status": "RECEIVED",\n    "orderId": "ORD-2026-48721",\n    "customer": {\n      "name": "Ramin Aliev",\n      "email": "customer@email.com",\n      "phone": "+994501234567"\n    },\n    "items": [\n      {\n        "orderItemId": "OI-10482",\n        "productSku": "ELK-SMRT-TV-055",\n        "productName": "Samsung 55\\" Smart TV",\n        "serialNumber": "SN-SMRT-2026-78432",\n        "returnReason": "DEFECTIVE",\n        "conditionGrade": "B",\n        "disposition": "RESTOCK"\n      }\n    ],\n    "financialSummary": {\n      "originalAmount": 1299.00,\n      "refundAmount": 1299.00,\n      "refundMethod": "CREDIT_CARD",\n      "refundStatus": "PENDING"\n    },\n    "timeline": [\n      { "status": "SUBMITTED", "timestamp": "2026-04-26T14:30:00Z", "actor": "CUSTOMER" },\n      { "status": "APPROVED", "timestamp": "2026-04-26T14:30:01Z", "actor": "SYSTEM" },\n      { "status": "RECEIVED", "timestamp": "2026-04-28T09:15:00Z", "actor": "WAREHOUSE" }\n    ],\n    "createdAt": "2026-04-26T14:30:00Z",\n    "updatedAt": "2026-04-28T09:15:00Z"\n  }\n}',
        resStatus: "200 OK",
      },
      {
        method: "GET", path: "/api/v1/returns",
        desc: "Lists return requests with filtering, sorting, and pagination capabilities. Supports multiple filter criteria including status, date range, customer, product category, and return reason. Returns paginated results with metadata. This endpoint is primarily used by agents and managers for queue management and reporting.",
        reqHeaders: [["Authorization", "Bearer {accessToken}"]],
        reqBody: null,
        resBody: '{\n  "success": true,\n  "data": {\n    "returns": [\n      {\n        "returnId": "RET-2026-000047",\n        "rmaNumber": "RMA-2026-000047",\n        "status": "RECEIVED",\n        "customerName": "Ramin Aliev",\n        "productSku": "ELK-SMRT-TV-055",\n        "returnReason": "DEFECTIVE",\n        "refundAmount": 1299.00,\n        "createdAt": "2026-04-26T14:30:00Z"\n      }\n    ],\n    "pagination": {\n      "page": 1,\n      "pageSize": 20,\n      "totalItems": 547,\n      "totalPages": 28,\n      "hasNext": true,\n      "hasPrev": false\n    }\n  }\n}',
        resStatus: "200 OK",
        queryParams: [["status", "string", "Filter by status (SUBMITTED, APPROVED, REJECTED, RECEIVED, INSPECTING, INSPECTION_COMPLETE, REFUND_PENDING, REFUND_PROCESSED, COMPLETED, CANCELLED)", "No"], ["fromDate", "date", "Filter returns created from this date (ISO 8601)", "No"], ["toDate", "date", "Filter returns created until this date (ISO 8601)", "No"], ["customerEmail", "string", "Filter by customer email address", "No"], ["productCategory", "string", "Filter by product category (TV, PHONE, LAPTOP, etc.)", "No"], ["returnReason", "string", "Filter by return reason code (DEFECTIVE, WRONG_ITEM, etc.)", "No"], ["sortBy", "string", "Sort field (createdAt, refundAmount, customerName)", "No"], ["sortOrder", "string", "Sort direction (asc, desc)", "No"], ["page", "integer", "Page number (default: 1)", "No"], ["pageSize", "integer", "Items per page (default: 20, max: 100)", "No"]],
      },
      {
        method: "PATCH", path: "/api/v1/returns/{rmaNumber}/status",
        desc: "Updates the status of a return request. Status transitions follow a defined state machine with validation rules. Only authorized roles can perform specific transitions (e.g., WAREHOUSE can transition to INSPECTION_COMPLETE, MANAGER can approve escalations). The system automatically triggers notifications and downstream actions (e.g., refund initiation) on certain transitions.",
        reqHeaders: [["Authorization", "Bearer {accessToken}"], ["Content-Type", "application/json"]],
        reqBody: '{\n  "status": "INSPECTION_COMPLETE",\n  "conditionGrade": "B",\n  "disposition": "RESTOCK",\n  "inspectionNotes": "Minor cosmetic scratch on bezel. Screen fully functional. Packaging intact. Item suitable for restocking as Grade B.",\n  "inspectorId": "USR-WH-003",\n  "photos": [\n    "data:image/jpeg;base64,/9j/4AAQ..."\n  ]\n}',
        resBody: '{\n  "success": true,\n  "data": {\n    "returnId": "RET-2026-000047",\n    "rmaNumber": "RMA-2026-000047",\n    "previousStatus": "INSPECTING",\n    "newStatus": "INSPECTION_COMPLETE",\n    "refundCalculation": {\n      "originalAmount": 1299.00,\n      "conditionGrade": "B",\n      "refundPercentage": 100,\n      "refundAmount": 1299.00,\n      "refundMethod": "CREDIT_CARD"\n    },\n    "nextActions": ["Process refund (automatic)", "Notify customer"],\n    "updatedAt": "2026-04-28T11:45:00Z"\n  }\n}',
        resStatus: "200 OK",
      },
      {
        method: "POST", path: "/api/v1/returns/{rmaNumber}/cancel",
        desc: "Cancels an active return request. Cancellation is only allowed before the item has been received by the warehouse (statuses: SUBMITTED, APPROVED). Once the item is in transit or received, cancellation requires manager approval. A cancellation reason must be provided for audit trail purposes.",
        reqHeaders: [["Authorization", "Bearer {accessToken}"], ["Content-Type", "application/json"]],
        reqBody: '{\n  "reason": "Customer changed mind",\n  "requestedBy": "USR-001"\n}',
        resBody: '{\n  "success": true,\n  "data": {\n    "returnId": "RET-2026-000047",\n    "rmaNumber": "RMA-2026-000047",\n    "status": "CANCELLED",\n    "cancelledAt": "2026-04-27T10:00:00Z",\n    "cancelReason": "Customer changed mind"\n  }\n}',
        resStatus: "200 OK",
      },
    ],
  },
  // VALIDATION
  {
    group: "Validation Engine", groupDesc: "Endpoints for the automated return validation engine. The validation engine checks return eligibility against configurable business rules including return windows, product category restrictions, warranty status, customer return history, and fraud indicators.",
    endpoints: [
      {
        method: "POST", path: "/api/v1/returns/validate",
        desc: "Performs a pre-submission eligibility check without creating a return request. This endpoint is useful for customer self-service pages to provide instant feedback on return eligibility before the customer completes the full submission form. Returns detailed validation results including all rule evaluations and policy references.",
        reqHeaders: [["Authorization", "Bearer {accessToken}"], ["Content-Type", "application/json"]],
        reqBody: '{\n  "orderId": "ORD-2026-48721",\n  "productSku": "ELK-SMRT-TV-055",\n  "purchaseDate": "2026-04-12",\n  "customerEmail": "customer@email.com"\n}',
        resBody: '{\n  "success": true,\n  "data": {\n    "eligible": true,\n    "rules": [\n      {\n        "ruleId": "RULE-001",\n        "ruleName": "Return Window Check",\n        "passed": true,\n        "detail": "Purchase date 2026-04-12 is within 14-day return window (8 days remaining)",\n        "policyReference": "Return Policy v3.2, Section 2.1"\n      },\n      {\n        "ruleId": "RULE-002",\n        "ruleName": "Product Category Check",\n        "passed": true,\n        "detail": "Product category TV is eligible for return",\n        "policyReference": "Return Policy v3.2, Section 3.1"\n      },\n      {\n        "ruleId": "RULE-003",\n        "ruleName": "Return History Check",\n        "passed": true,\n        "detail": "Customer has 1 return in the last 12 months (threshold: 5)",\n        "policyReference": "Return Policy v3.2, Section 4.2"\n      },\n      {\n        "ruleId": "RULE-004",\n        "ruleName": "Warranty Status Check",\n        "passed": true,\n        "detail": "Product is within manufacturer warranty period",\n        "policyReference": "Return Policy v3.2, Section 2.3"\n      }\n    ],\n    "returnOptions": ["REFUND", "EXCHANGE", "STORE_CREDIT"]\n  }\n}',
        resStatus: "200 OK",
      },
      {
        method: "GET", path: "/api/v1/policies/rules",
        desc: "Retrieves the current active validation rules configured in the system. Returns rule definitions, parameters, and activation status. This endpoint is used by the admin console to display the current policy configuration and by agents to understand why specific validation decisions were made.",
        reqHeaders: [["Authorization", "Bearer {accessToken}"]],
        reqBody: null,
        resBody: '{\n  "success": true,\n  "data": {\n    "rules": [\n      {\n        "ruleId": "RULE-001",\n        "name": "Return Window Check",\n        "description": "Verifies purchase is within the allowed return window",\n        "parameters": {\n          "standardWindowDays": 14,\n          "extendedWindowDays": 30,\n          "seasonalExtension": null\n        },\n        "active": true,\n        "priority": 1,\n        "lastModified": "2026-04-01T10:00:00Z",\n        "modifiedBy": "admin@kontakthome.az"\n      },\n      {\n        "ruleId": "RULE-002",\n        "name": "Product Category Check",\n        "description": "Checks if product category is eligible for return",\n        "parameters": {\n          "nonReturnableCategories": ["CLEARANCE", "GIFT_CARD", "SOFTWARE_LICENSE", "HYGIENE_PRODUCTS"]\n        },\n        "active": true,\n        "priority": 2,\n        "lastModified": "2026-04-01T10:00:00Z",\n        "modifiedBy": "admin@kontakthome.az"\n      }\n    ],\n    "pagination": {\n      "page": 1,\n      "pageSize": 20,\n      "totalItems": 8,\n      "totalPages": 1\n    }\n  }\n}',
        resStatus: "200 OK",
      },
    ],
  },
  // WAREHOUSE
  {
    group: "Warehouse Operations", groupDesc: "Endpoints for warehouse receiving, inspection, and disposition workflows. These endpoints are optimized for mobile device usage by warehouse staff and support barcode scanning integration for efficient item processing.",
    endpoints: [
      {
        method: "POST", path: "/api/v1/warehouse/receive",
        desc: "Records the receipt of a returned item by scanning the RMA barcode. The system verifies the RMA number, displays expected item details for visual confirmation, and creates a warehouse receiving record. This endpoint initiates the inspection workflow automatically.",
        reqHeaders: [["Authorization", "Bearer {accessToken}"], ["Content-Type", "application/json"]],
        reqBody: '{\n  "rmaNumber": "RMA-2026-000047",\n  "receivedBy": "USR-WH-003",\n  "receivingLocation": "BAKU-WH-01",\n  "carrierName": "AZERPOST",\n  "trackingNumber": "AZ-2026-98432",\n  "packageCondition": "GOOD",\n  "notes": "Package arrived intact. No visible external damage."\n}',
        resBody: '{\n  "success": true,\n  "data": {\n    "receivingId": "RCV-2026-000123",\n    "rmaNumber": "RMA-2026-000047",\n    "expectedItem": {\n      "productName": "Samsung 55\\" Smart TV",\n      "productSku": "ELK-SMRT-TV-055",\n      "serialNumber": "SN-SMRT-2026-78432",\n      "customerName": "Ramin Aliev"\n    },\n    "status": "RECEIVED",\n    "inspectionDeadline": "2026-04-29T18:00:00Z",\n    "nextAction": "Perform quality inspection",\n    "receivedAt": "2026-04-28T09:15:00Z"\n  }\n}',
        resStatus: "201 Created",
      },
      {
        method: "POST", path: "/api/v1/warehouse/inspect",
        desc: "Records the results of the quality inspection for a received item. The inspector assigns a condition grade (A/B/C/D) based on standardized criteria, uploads photographic evidence, and records a disposition recommendation. The system may automatically approve the refund (Grade A/B) or route to a manager for approval (Grade C/D) based on the condition grade and policy rules.",
        reqHeaders: [["Authorization", "Bearer {accessToken}"], ["Content-Type", "application/json"]],
        reqBody: '{\n  "rmaNumber": "RMA-2026-000047",\n  "inspectionResult": {\n    "conditionGrade": "B",\n    "gradingCriteria": {\n      "packaging": "INTACT",\n      "accessories": "COMPLETE",\n      "cosmeticCondition": "MINOR_MARKS",\n      "functionalTest": "PASSED",\n      "screenCondition": "NO_DEAD_PIXELS"\n    },\n    "disposition": "RESTOCK",\n    "dispositionNotes": "Minor cosmetic scratch on bottom bezel. All accessories included. Fully functional. Suitable for restock as open-box.",\n    "inspectorId": "USR-WH-003",\n    "inspectionDuration": 12,\n    "photos": [\n      {\n        "type": "GENERAL",\n        "url": "/api/v1/files/IMG-2026-04-28-001.jpg"\n      },\n      {\n        "type": "DEFECT",\n        "url": "/api/v1/files/IMG-2026-04-28-002.jpg",\n        "annotation": "Scratch on bottom bezel, 3cm long"\n      }\n    ]\n  }\n}',
        resBody: '{\n  "success": true,\n  "data": {\n    "rmaNumber": "RMA-2026-000047",\n    "inspectionId": "INS-2026-000089",\n    "conditionGrade": "B",\n    "disposition": "RESTOCK",\n    "refundEligibility": {\n      "autoApproved": true,\n      "refundPercentage": 100,\n      "refundAmount": 1299.00,\n      "approvalRequired": false\n    },\n    "inventoryAction": {\n      "action": "UPDATE_INVENTORY",\n      "newCondition": "OPEN_BOX",\n      "restockLocation": "BAKU-WH-01-SHELF-B3"\n    },\n    "inspectedAt": "2026-04-28T11:45:00Z"\n  }\n}',
        resStatus: "200 OK",
      },
      {
        method: "GET", path: "/api/v1/warehouse/queue",
        desc: "Retrieves the warehouse work queue of items pending inspection. Returns items sorted by receiving time (FIFO) with SLA countdown timers. Supports filtering by priority and location. This endpoint is designed for the warehouse dashboard showing real-time workload.",
        reqHeaders: [["Authorization", "Bearer {accessToken}"]],
        reqBody: null,
        resBody: '{\n  "success": true,\n  "data": {\n    "queue": [\n      {\n        "rmaNumber": "RMA-2026-000047",\n        "productName": "Samsung 55\\" Smart TV",\n        "receivedAt": "2026-04-28T09:15:00Z",\n        "slaDeadline": "2026-04-29T18:00:00Z",\n        "hoursRemaining": 29.75,\n        "priority": "NORMAL",\n        "returnReason": "DEFECTIVE"\n      }\n    ],\n    "summary": {\n      "totalPending": 12,\n      "overdue": 1,\n      "dueToday": 5,\n      "avgWaitTime": "6.2 hours"\n    }\n  }\n}',
        resStatus: "200 OK",
      },
    ],
  },
  // REFUNDS
  {
    group: "Refund Processing", groupDesc: "Endpoints for automated refund calculation, processing, and reconciliation. Refunds are calculated based on condition grade and return policy rules, then submitted to the ERP financial module via API integration for execution.",
    endpoints: [
      {
        method: "POST", path: "/api/v1/refunds/calculate",
        desc: "Calculates the refund amount for a return based on the original purchase price, condition grade, return policy rules, and any applicable deductions or bonuses. Returns a detailed breakdown of the calculation including all factors considered. This endpoint can be called before actual refund submission for preview purposes.",
        reqHeaders: [["Authorization", "Bearer {accessToken}"], ["Content-Type", "application/json"]],
        reqBody: '{\n  "rmaNumber": "RMA-2026-000047",\n  "originalAmount": 1299.00,\n  "conditionGrade": "B",\n  "returnReason": "DEFECTIVE",\n  "originalPaymentMethod": "CREDIT_CARD"\n}',
        resBody: '{\n  "success": true,\n  "data": {\n    "rmaNumber": "RMA-2026-000047",\n    "calculationBreakdown": {\n      "originalAmount": 1299.00,\n      "conditionDeduction": 0.00,\n      "conditionGrade": "B",\n      "conditionRefundPercentage": 100,\n      "restockingFee": 0.00,\n      "loyaltyBonus": 0.00,\n      "totalRefundAmount": 1299.00,\n      "currency": "AZN"\n    },\n    "refundMethod": {\n      "type": "CREDIT_CARD",\n      "lastFourDigits": "4532",\n      "cardNetwork": "VISA",\n      "estimatedProcessingDays": "1-3"\n    },\n    "alternatives": [\n      {\n        "method": "STORE_CREDIT",\n        "amount": 1363.95,\n        "bonusPercentage": 5,\n        "bonusAmount": 64.95\n      }\n    ]\n  }\n}',
        resStatus: "200 OK",
      },
      {
        method: "POST", path: "/api/v1/refunds/process",
        desc: "Submits a refund request to the ERP financial module for execution. The refund amount is calculated automatically based on the inspection result and policy rules. For Grade A/B items, refunds are auto-approved. For Grade C/D items, manager approval is required before submission. The system creates a financial transaction record and triggers customer notification upon successful processing.",
        reqHeaders: [["Authorization", "Bearer {accessToken}"], ["Content-Type", "application/json"]],
        reqBody: '{\n  "rmaNumber": "RMA-2026-000047",\n  "refundMethod": "CREDIT_CARD",\n  "processedBy": "USR-FN-001",\n  "notes": "Auto-approved refund for Grade B condition. Original payment via Visa ending 4532."\n}',
        resBody: '{\n  "success": true,\n  "data": {\n    "refundId": "REF-2026-000023",\n    "rmaNumber": "RMA-2026-000047",\n    "amount": 1299.00,\n    "currency": "AZN",\n    "method": "CREDIT_CARD",\n    "status": "SUBMITTED_TO_ERP",\n    "erpTransactionId": "ERP-FIN-2026-47291",\n    "estimatedCompletion": "2026-04-30T18:00:00Z",\n    "processedAt": "2026-04-28T12:00:00Z",\n    "_links": {\n      "self": "/api/v1/refunds/REF-2026-000023",\n      "return": "/api/v1/returns/RMA-2026-000047"\n    }\n  }\n}',
        resStatus: "201 Created",
      },
      {
        method: "GET", path: "/api/v1/refunds/{refundId}",
        desc: "Retrieves the current status and details of a specific refund transaction. Includes ERP integration status, processing timeline, and customer notification history. Used by agents for customer inquiries and by finance staff for reconciliation.",
        reqHeaders: [["Authorization", "Bearer {accessToken}"]],
        reqBody: null,
        resBody: '{\n  "success": true,\n  "data": {\n    "refundId": "REF-2026-000023",\n    "rmaNumber": "RMA-2026-000047",\n    "amount": 1299.00,\n    "currency": "AZN",\n    "method": "CREDIT_CARD",\n    "lastFourDigits": "4532",\n    "status": "COMPLETED",\n    "erpTransactionId": "ERP-FIN-2026-47291",\n    "bankReference": "VISA-REF-2026-88721",\n    "timeline": [\n      { "status": "SUBMITTED", "timestamp": "2026-04-28T12:00:00Z", "actor": "SYSTEM" },\n      { "status": "SUBMITTED_TO_ERP", "timestamp": "2026-04-28T12:00:05Z", "actor": "SYSTEM" },\n      { "status": "PROCESSING", "timestamp": "2026-04-28T14:30:00Z", "actor": "ERP" },\n      { "status": "COMPLETED", "timestamp": "2026-04-29T10:15:00Z", "actor": "ERP" }\n    ],\n    "notifications": [\n      { "channel": "EMAIL", "sentAt": "2026-04-29T10:16:00Z", "status": "DELIVERED" },\n      { "channel": "SMS", "sentAt": "2026-04-29T10:16:00Z", "status": "DELIVERED" }\n    ]\n  }\n}',
        resStatus: "200 OK",
      },
    ],
  },
  // NOTIFICATIONS
  {
    group: "Notifications", groupDesc: "Endpoints for managing multi-channel customer notifications. The system sends automated notifications at every key return process milestone via email and SMS. These endpoints support notification preferences, history retrieval, and manual notification triggers for agents.",
    endpoints: [
      {
        method: "GET", path: "/api/v1/notifications/{rmaNumber}/history",
        desc: "Retrieves the complete notification history for a specific return request. Returns all notifications sent across all channels (email, SMS) with delivery status tracking. Used by agents to verify customer communication and troubleshoot notification issues.",
        reqHeaders: [["Authorization", "Bearer {accessToken}"]],
        reqBody: null,
        resBody: '{\n  "success": true,\n  "data": {\n    "rmaNumber": "RMA-2026-000047",\n    "notifications": [\n      {\n        "id": "NOTIF-2026-001",\n        "type": "RETURN_APPROVED",\n        "channel": "EMAIL",\n        "recipient": "customer@email.com",\n        "subject": "Your Return Request Has Been Approved - RMA-2026-000047",\n        "sentAt": "2026-04-26T14:30:05Z",\n        "deliveryStatus": "DELIVERED",\n        "openedAt": "2026-04-26T15:02:00Z"\n      },\n      {\n        "id": "NOTIF-2026-002",\n        "type": "RETURN_APPROVED",\n        "channel": "SMS",\n        "recipient": "+994501234567",\n        "message": "Your return RMA-2026-000047 has been approved. Ship to: Kontakt Home Returns Center...",\n        "sentAt": "2026-04-26T14:30:05Z",\n        "deliveryStatus": "DELIVERED"\n      }\n    ]\n  }\n}',
        resStatus: "200 OK",
      },
      {
        method: "POST", path: "/api/v1/notifications/send",
        desc: "Manually triggers a notification for a return request. This endpoint is used by agents when they need to send a custom notification or re-send a failed notification. Supports both email and SMS channels. The notification content can be customized or use predefined templates.",
        reqHeaders: [["Authorization", "Bearer {accessToken}"], ["Content-Type", "application/json"]],
        reqBody: '{\n  "rmaNumber": "RMA-2026-000047",\n  "channel": "EMAIL",\n  "templateId": "TPL-CUSTOM-UPDATE",\n  "customMessage": "Dear Ramin, your return is currently being inspected. We will update you within 24 hours with the results and refund details.",\n  "sendCopyToAgent": true\n}',
        resBody: '{\n  "success": true,\n  "data": {\n    "notificationId": "NOTIF-2026-015",\n    "status": "QUEUED",\n    "channel": "EMAIL",\n    "recipient": "customer@email.com",\n    "estimatedDelivery": "2026-04-28T12:05:00Z"\n  }\n}',
        resStatus: "201 Created",
      },
    ],
  },
  // ANALYTICS
  {
    group: "Analytics and Reporting", groupDesc: "Endpoints for management analytics, KPI dashboards, and report generation. These endpoints provide aggregated return data, trend analysis, financial summaries, and exportable reports. Access is restricted to MANAGER and ADMIN roles.",
    endpoints: [
      {
        method: "GET", path: "/api/v1/analytics/dashboard",
        desc: "Retrieves the main management dashboard data including key performance indicators, recent trends, and alerts. Returns a comprehensive summary designed for the analytics dashboard UI. Data is refreshed every 15 minutes from the aggregation cache.",
        reqHeaders: [["Authorization", "Bearer {accessToken}"]],
        reqBody: null,
        resBody: '{\n  "success": true,\n  "data": {\n    "kpis": {\n      "totalReturnsThisMonth": 547,\n      "avgProcessingTimeDays": 4.2,\n      "customerSatisfactionScore": 87.3,\n      "autoApprovalRate": 72.1,\n      "refundTotalThisMonth": 384720.00,\n      "costPerReturn": 14.80\n    },\n    "trends": {\n      "returnVolume": {\n        "currentMonth": 547,\n        "previousMonth": 512,\n        "changePercent": 6.8,\n        "sixMonthAverage": 498\n      },\n      "processingTime": {\n        "currentAvg": 4.2,\n        "targetAvg": 3.5,\n        "improvementFromBaseline": 70.7\n      }\n    },\n    "topReturnReasons": [\n      { "reason": "DEFECTIVE", "count": 187, "percentage": 34.2 },\n      { "reason": "WRONG_ITEM", "count": 98, "percentage": 17.9 },\n      { "reason": "NOT_AS_DESCRIBED", "count": 76, "percentage": 13.9 },\n      { "reason": "CHANGED_MIND", "count": 65, "percentage": 11.9 },\n      { "reason": "BETTER_PRICE_FOUND", "count": 54, "percentage": 9.9 }\n    ],\n    "alerts": [\n      {\n        "type": "SPIKE",\n        "message": "TV returns increased 45% this week (32 vs 22)",\n        "severity": "WARNING",\n        "productCategory": "TV"\n      }\n    ],\n    "lastRefreshed": "2026-04-26T14:45:00Z"\n  }\n}',
        resStatus: "200 OK",
      },
      {
        method: "GET", path: "/api/v1/analytics/returns/by-category",
        desc: "Retrieves return volume, refund amounts, and key metrics broken down by product category. Supports date range filtering and comparison periods. Used by management for product quality analysis and category-level decision making.",
        reqHeaders: [["Authorization", "Bearer {accessToken}"]],
        reqBody: null,
        resBody: '{\n  "success": true,\n  "data": {\n    "period": { "from": "2026-04-01", "to": "2026-04-26" },\n    "categories": [\n      {\n        "category": "TV",\n        "returnCount": 87,\n        "returnRate": 5.8,\n        "totalRefundAmount": 98420.00,\n        "avgRefundAmount": 1131.26,\n        "topReason": "DEFECTIVE",\n        "trend": "+12.3% vs previous month"\n      },\n      {\n        "category": "SMARTPHONE",\n        "returnCount": 124,\n        "returnRate": 4.2,\n        "totalRefundAmount": 68720.00,\n        "avgRefundAmount": 554.19,\n        "topReason": "DEFECTIVE",\n        "trend": "-3.1% vs previous month"\n      },\n      {\n        "category": "LAPTOP",\n        "returnCount": 56,\n        "returnRate": 3.8,\n        "totalRefundAmount": 54890.00,\n        "avgRefundAmount": 980.18,\n        "topReason": "NOT_AS_DESCRIBED",\n        "trend": "+2.7% vs previous month"\n      }\n    ]\n  }\n}',
        resStatus: "200 OK",
      },
      {
        method: "GET", path: "/api/v1/analytics/reports/export",
        desc: "Generates and exports an analytics report in the specified format (PDF or Excel). Reports include return volume trends, category analysis, financial summaries, agent performance metrics, and customer satisfaction data. Exported reports are generated asynchronously; this endpoint returns a download link when the report is ready.",
        reqHeaders: [["Authorization", "Bearer {accessToken}"]],
        reqBody: null,
        resBody: '{\n  "success": true,\n  "data": {\n    "reportId": "RPT-2026-04-012",\n    "type": "MONTHLY_SUMMARY",\n    "format": "PDF",\n    "period": { "from": "2026-04-01", "to": "2026-04-26" },\n    "status": "PROCESSING",\n    "downloadUrl": null,\n    "estimatedReadyAt": "2026-04-26T15:00:00Z",\n    "_links": {\n      "status": "/api/v1/analytics/reports/RPT-2026-04-012/status"\n    }\n  }\n}',
        resStatus: "200 OK",
      },
    ],
  },
  // ADMIN / CONFIG
  {
    group: "Admin and Configuration", groupDesc: "Endpoints for system administration including policy rule management, user management, system settings, and audit trail access. All endpoints in this group require ADMIN role authorization.",
    endpoints: [
      {
        method: "PUT", path: "/api/v1/admin/policies/rules/{ruleId}",
        desc: "Updates an existing validation rule configuration. Changes to policy rules are tracked in the audit trail. Modified rules take effect immediately for new return requests. Existing in-progress returns are not affected by rule changes. Impact simulation is available before applying changes.",
        reqHeaders: [["Authorization", "Bearer {accessToken}"], ["Content-Type", "application/json"]],
        reqBody: '{\n  "name": "Return Window Check",\n  "parameters": {\n    "standardWindowDays": 21,\n    "extendedWindowDays": 30,\n    "seasonalExtension": {\n      "active": true,\n      "fromDate": "2026-11-15",\n      "toDate": "2027-01-15",\n      "extendedDays": 14\n    }\n  },\n  "active": true,\n  "changeReason": "Extended return window from 14 to 21 days per management decision (MD-2026-04-25)"\n}',
        resBody: '{\n  "success": true,\n  "data": {\n    "ruleId": "RULE-001",\n    "name": "Return Window Check",\n    "previousValues": { "standardWindowDays": 14 },\n    "newValues": { "standardWindowDays": 21 },\n    "effectiveFrom": "2026-04-26T15:00:00Z",\n    "affectedReturns": "New requests only (existing returns unaffected)",\n    "modifiedBy": "admin@kontakthome.az",\n    "modifiedAt": "2026-04-26T15:00:00Z",\n    "auditTrailId": "AUD-2026-000341"\n  }\n}',
        resStatus: "200 OK",
      },
      {
        method: "GET", path: "/api/v1/admin/audit-trail",
        desc: "Retrieves the system audit trail with filtering capabilities. The audit trail records all significant system events including user actions, policy changes, status transitions, financial transactions, and authentication events. Essential for compliance, security review, and incident investigation.",
        reqHeaders: [["Authorization", "Bearer {accessToken}"]],
        reqBody: null,
        resBody: '{\n  "success": true,\n  "data": {\n    "events": [\n      {\n        "auditId": "AUD-2026-000341",\n        "eventType": "POLICY_CHANGE",\n        "userId": "USR-ADM-001",\n        "userName": "Elvin Hasanov",\n        "action": "UPDATE_RULE",\n        "resource": "RULE-001",\n        "details": "Changed standardWindowDays from 14 to 21",\n        "ipAddress": "192.168.1.45",\n        "timestamp": "2026-04-26T15:00:00Z"\n      },\n      {\n        "auditId": "AUD-2026-000340",\n        "eventType": "STATUS_CHANGE",\n        "userId": "USR-WH-003",\n        "userName": "Tural Mamedov",\n        "action": "INSPECTION_COMPLETE",\n        "resource": "RMA-2026-000047",\n        "details": "Grade B assigned, RESTOCK disposition",\n        "ipAddress": "192.168.1.78",\n        "timestamp": "2026-04-28T11:45:00Z"\n      }\n    ],\n    "pagination": {\n      "page": 1,\n      "pageSize": 50,\n      "totalItems": 1243,\n      "totalPages": 25\n    }\n  }\n}',
        resStatus: "200 OK",
      },
      {
        method: "GET", path: "/api/v1/admin/users",
        desc: "Retrieves the list of all system users with their roles, status, and last activity timestamp. Supports filtering by role, department, and status. This endpoint is used by the admin console for user management and access control configuration.",
        reqHeaders: [["Authorization", "Bearer {accessToken}"]],
        reqBody: null,
        resBody: '{\n  "success": true,\n  "data": {\n    "users": [\n      {\n        "id": "USR-001",\n        "name": "Aysel Karimova",\n        "email": "agent@kontakthome.az",\n        "role": "SUPPORT_AGENT",\n        "department": "Customer Service",\n        "status": "ACTIVE",\n        "lastLoginAt": "2026-04-28T08:30:00Z"\n      },\n      {\n        "id": "USR-WH-003",\n        "name": "Tural Mamedov",\n        "email": "warehouse@kontakthome.az",\n        "role": "WAREHOUSE_STAFF",\n        "department": "Warehouse",\n        "status": "ACTIVE",\n        "lastLoginAt": "2026-04-28T09:00:00Z"\n      }\n    ],\n    "pagination": {\n      "page": 1,\n      "pageSize": 20,\n      "totalItems": 24,\n      "totalPages": 2\n    }\n  }\n}',
        resStatus: "200 OK",
      },
    ],
  },
];

// ========== BUILD DOCUMENT ==========
const coverChildren = [
  new docx.Paragraph({ spacing: { before: 2400 }, children: [] }),
  new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, children: [new docx.TextRun({ text: "REST API & JSON", size: 48, bold: true, color: COLORS.deepSea, font: "Calibri" })] }),
  new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, children: [new docx.TextRun({ text: "SPECIFICATION", size: 48, bold: true, color: COLORS.deepSea, font: "Calibri" })] }),
  new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, spacing: { before: 200 }, children: [new docx.TextRun({ text: "\u2500".repeat(40), size: 24, color: COLORS.ocean, font: "Calibri" })] }),
  new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, spacing: { before: 200 }, children: [new docx.TextRun({ text: "Kontakt Home", size: 36, bold: true, color: COLORS.ocean, font: "Calibri" })] }),
  new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, spacing: { before: 100 }, children: [new docx.TextRun({ text: "Return Management System (RMS)", size: 28, color: COLORS.accent, font: "Calibri" })] }),
  new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, spacing: { before: 100 }, children: [new docx.TextRun({ text: "API Reference Document - v1.0", size: 24, color: COLORS.gray, font: "Calibri", italics: true })] }),
  new docx.Paragraph({ spacing: { before: 1200 }, children: [] }),
  new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, children: [new docx.TextRun({ text: "Version 1.0", size: 22, color: COLORS.dark, font: "Calibri" })] }),
  new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, spacing: { before: 80 }, children: [new docx.TextRun({ text: "Date: April 26, 2026", size: 22, color: COLORS.dark, font: "Calibri" })] }),
  new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, spacing: { before: 80 }, children: [new docx.TextRun({ text: "Prepared by: Zamir Jamalov", size: 22, color: COLORS.dark, font: "Calibri" })] }),
  new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, spacing: { before: 80 }, children: [new docx.TextRun({ text: "Classification: Confidential", size: 22, color: COLORS.gray, font: "Calibri", italics: true })] }),
];

const tocItems = [
  "Document Control",
  "1. API Overview",
  "   1.1 Introduction",
  "   1.2 Base URL and Versioning",
  "   1.3 Authentication and Authorization",
  "   1.4 Rate Limiting",
  "   1.5 Common Request Headers",
  "   1.6 Standard Response Format",
  "   1.7 HTTP Status Codes",
  "   1.8 Error Response Format",
  "   1.9 Pagination",
  "   1.10 Data Types and Formats",
  "2. Authentication Endpoints",
  "   2.1 POST /auth/login",
  "   2.2 POST /auth/refresh",
  "   2.3 POST /auth/logout",
  "3. Return Request Endpoints",
  "   3.1 POST /returns",
  "   3.2 GET /returns/{rmaNumber}",
  "   3.3 GET /returns",
  "   3.4 PATCH /returns/{rmaNumber}/status",
  "   3.5 POST /returns/{rmaNumber}/cancel",
  "4. Validation Engine Endpoints",
  "   4.1 POST /returns/validate",
  "   4.2 GET /policies/rules",
  "5. Warehouse Operations Endpoints",
  "   5.1 POST /warehouse/receive",
  "   5.2 POST /warehouse/inspect",
  "   5.3 GET /warehouse/queue",
  "6. Refund Processing Endpoints",
  "   6.1 POST /refunds/calculate",
  "   6.2 POST /refunds/process",
  "   6.3 GET /refunds/{refundId}",
  "7. Notification Endpoints",
  "   7.1 GET /notifications/{rmaNumber}/history",
  "   7.2 POST /notifications/send",
  "8. Analytics and Reporting Endpoints",
  "   8.1 GET /analytics/dashboard",
  "   8.2 GET /analytics/returns/by-category",
  "   8.3 GET /analytics/reports/export",
  "9. Admin and Configuration Endpoints",
  "   9.1 PUT /admin/policies/rules/{ruleId}",
  "   9.2 GET /admin/audit-trail",
  "   9.3 GET /admin/users",
  "10. JSON Schema Definitions",
  "   10.1 Return Request Schema",
  "   10.2 Inspection Result Schema",
  "   10.3 Refund Schema",
  "   10.4 Error Response Schema",
  "   10.5 Pagination Metadata Schema",
  "11. API Changelog",
];

const tocChildren = [
  new docx.Paragraph({ children: [new docx.TextRun({ text: "Table of Contents", bold: true, size: 32, color: COLORS.deepSea, font: "Calibri" })], spacing: { after: 300 } }),
  ...tocItems.map(t => new docx.Paragraph({
    children: [new docx.TextRun({ text: t, size: 22, color: t.startsWith("   ") ? COLORS.gray : COLORS.deepSea, font: "Calibri", bold: !t.startsWith("   ") })],
    spacing: { after: 40 },
  })),
];

function buildEndpointSection(ep, sectionNum) {
  const lines = [
    heading(`${sectionNum} ${ep.method} ${ep.path}`, 3),
    methodBadge(ep.method, "/api/v1" + ep.path),
    para(ep.desc),
  ];

  if (ep.reqHeaders && ep.reqHeaders.length > 0) {
    lines.push(new docx.Paragraph({ children: [new docx.TextRun({ text: "Request Headers", bold: true, size: 21, color: COLORS.accent, font: "Calibri" })], spacing: { before: 120, after: 40 } }));
    lines.push(createTable(["Header", "Value", "Required"], ep.reqHeaders.map(h => [...h, "Yes"])));
    lines.push(divider());
  }

  if (ep.queryParams && ep.queryParams.length > 0) {
    lines.push(new docx.Paragraph({ children: [new docx.TextRun({ text: "Query Parameters", bold: true, size: 21, color: COLORS.accent, font: "Calibri" })], spacing: { before: 120, after: 40 } }));
    lines.push(createTable(["Parameter", "Type", "Description", "Required"], ep.queryParams));
    lines.push(divider());
  }

  if (ep.reqBody) {
    lines.push(new docx.Paragraph({ children: [new docx.TextRun({ text: "Request Body (JSON)", bold: true, size: 21, color: COLORS.accent, font: "Calibri" })], spacing: { before: 120, after: 40 } }));
    lines.push(...codeBlock(ep.reqBody));
    lines.push(divider());
  } else {
    lines.push(new docx.Paragraph({ children: [new docx.TextRun({ text: "Request Body: None", bold: true, size: 21, color: COLORS.gray, font: "Calibri", italics: true })], spacing: { before: 120, after: 40 } }));
  }

  lines.push(new docx.Paragraph({ children: [new docx.TextRun({ text: "Response (" + ep.resStatus + ")", bold: true, size: 21, color: COLORS.accent, font: "Calibri" })], spacing: { before: 120, after: 40 } }));
  lines.push(...codeBlock(ep.resBody));

  lines.push(divider());
  return lines;
}

const mainChildren = [
  heading("Document Control"),
  createTable(
    ["Attribute", "Detail"],
    [
      ["Document Title", "REST API & JSON Specification - Kontakt Home Return Management System"],
      ["Document ID", "RMS-API-001"],
      ["API Version", "v1.0"],
      ["Base URL", "https://api.kontakthome.az/api/v1"],
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
      ["0.1", "April 18, 2026", "Zamir Jamalov", "Initial API design draft with core return endpoints"],
      ["0.2", "April 22, 2026", "Zamir Jamalov", "Added warehouse, refund, and notification endpoints"],
      ["0.3", "April 24, 2026", "Zamir Jamalov", "Added analytics, admin, and configuration endpoints"],
      ["0.4", "April 25, 2026", "Zamir Jamalov", "Added JSON schema definitions and error response specifications"],
      ["1.0", "April 26, 2026", "Zamir Jamalov", "Final version with complete JSON examples and HATEOAS links"],
    ]
  ),
  divider(),

  // 1. API Overview
  heading("1. API Overview"),

  heading("1.1 Introduction", 2),
  para("This document provides the complete REST API specification for the Kontakt Home Return Management System (RMS). The API follows RESTful design principles and uses JSON as the primary data format for all request and response payloads. The specification covers all endpoints required to support the end-to-end return management lifecycle, from customer-initiated return requests through warehouse inspection, refund processing, and management analytics."),
  para("The API is designed to serve four distinct client applications: the customer self-service web portal, the agent console desktop application, the warehouse mobile application, and the management analytics dashboard. Each client interacts with the same API but through role-based access controls that restrict available operations based on the authenticated user's role. The API supports five defined user roles: Customer, Support Agent, Warehouse Staff, Manager, and Administrator."),
  para("The API follows industry best practices including HATEOAS (Hypermedia as the Engine of Application State) links for resource discovery, consistent error response formatting, pagination for list endpoints, and comprehensive audit logging for compliance requirements. All API communication is encrypted via TLS 1.3 and authenticated via JWT (JSON Web Token) bearer tokens."),

  heading("1.2 Base URL and Versioning", 2),
  para("All API endpoints are prefixed with a version identifier to ensure backward compatibility as the API evolves. The current production version is v1."),
  ...codeBlock("Production:   https://api.kontakthome.az/api/v1\nStaging:     https://api-staging.kontakthome.az/api/v1\nDevelopment: https://api-dev.kontakthome.az/api/v1"),
  divider(),
  para("API versioning follows the URL path strategy (e.g., /api/v1/, /api/v2/). When a new major version is released, the previous version will be maintained for a minimum of 12 months with a deprecation notice. Minor changes within a version (backward-compatible) are deployed without version increment."),

  heading("1.3 Authentication and Authorization", 2),
  para("The API uses JSON Web Token (JWT) based authentication with a two-token strategy consisting of short-lived access tokens and longer-lived refresh tokens. All API endpoints except the authentication endpoints require a valid access token in the Authorization header."),
  ...codeBlock("Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."),
  divider(),
  para("Token specifications:"),
  createTable(
    ["Token Type", "Lifetime", "Purpose", "Storage"],
    [
      ["Access Token", "15 minutes", "Authenticate API requests", "Memory / HTTP-only cookie (frontend)"],
      ["Refresh Token", "7 days", "Obtain new access tokens", "HTTP-only cookie / Secure storage"],
    ]
  ),
  divider(),
  para("Role-Based Access Control (RBAC) restricts endpoint access based on the authenticated user's role. The following table defines the access permissions for each role across API resource groups:"),
  createTable(
    ["Resource Group", "Customer", "Agent", "Warehouse", "Manager", "Admin"],
    [
      ["Authentication", "Login only", "Full", "Login only", "Full", "Full"],
      ["Return Requests", "Own returns", "All returns", "Read only", "All returns", "All returns"],
      ["Validation Engine", "Pre-check only", "Full", "Read only", "Full", "Full"],
      ["Warehouse Ops", "None", "Read only", "Full", "Full", "Full"],
      ["Refund Processing", "Own refunds", "Create/Read", "Read only", "Full", "Full"],
      ["Notifications", "Own history", "Send + History", "Read only", "Full", "Full"],
      ["Analytics", "None", "Limited", "None", "Full", "Full"],
      ["Admin/Config", "None", "None", "None", "Read policies", "Full"],
    ]
  ),
  divider(),

  heading("1.4 Rate Limiting", 2),
  para("To protect the API from abuse and ensure fair usage, rate limiting is applied per authenticated user and per IP address for unauthenticated requests. The following rate limits apply:"),
  createTable(
    ["Client Type", "Limit", "Window", "Scope"],
    [
      ["Customer (portal)", "100 requests", "Per minute", "Per user"],
      ["Support Agent", "300 requests", "Per minute", "Per user"],
      ["Warehouse Staff", "200 requests", "Per minute", "Per user"],
      ["Manager / Admin", "500 requests", "Per minute", "Per user"],
      ["Unauthenticated", "20 requests", "Per minute", "Per IP"],
      ["Batch operations", "50 requests", "Per hour", "Per user"],
    ]
  ),
  divider(),
  para("When a rate limit is exceeded, the API returns HTTP 429 Too Many Requests with the following headers:"),
  bullet("X-RateLimit-Limit: The maximum number of requests allowed in the current window"),
  bullet("X-RateLimit-Remaining: The number of requests remaining in the current window"),
  bullet("X-RateLimit-Reset: Unix timestamp when the rate limit window resets"),
  bullet("Retry-After: Number of seconds until the client should retry"),

  heading("1.5 Common Request Headers", 2),
  para("The following headers are commonly used across API endpoints:"),
  createTable(
    ["Header", "Required", "Description", "Example"],
    [
      ["Authorization", "Yes (except auth)", "Bearer token for authentication", "Bearer eyJhbGci..."],
      ["Content-Type", "Yes (POST/PUT/PATCH)", "Request body format", "application/json"],
      ["Accept", "No", "Preferred response format", "application/json"],
      ["Accept-Language", "No", "Preferred language for responses", "az, en"],
      ["X-Request-ID", "No", "Client-generated request ID for tracing", "req-abc123-def456"],
      ["X-Correlation-ID", "No", "Correlation ID for distributed tracing", "corr-xyz789"],
    ]
  ),
  divider(),

  heading("1.6 Standard Response Format", 2),
  para("All API responses follow a consistent envelope format to simplify client-side parsing and error handling. The response envelope includes a success indicator, the response data, and optional metadata fields:"),
  ...codeBlock('{\n  "success": true,\n  "data": { ... },\n  "message": "Operation completed successfully",\n  "meta": {\n    "requestId": "req-abc123-def456",\n    "timestamp": "2026-04-26T14:30:00Z",\n    "processingTimeMs": 45\n  }\n}'),
  divider(),
  para("For successful operations, the success field is true and the data field contains the response payload. For errors, the success field is false and an error object is returned instead of the data field. The meta object provides request-level metadata useful for debugging and monitoring."),

  heading("1.7 HTTP Status Codes", 2),
  para("The API uses standard HTTP status codes to indicate the result of each request. The following table documents all status codes used by the API:"),
  statusTable(),
  divider(),

  heading("1.8 Error Response Format", 2),
  para("All error responses follow a consistent structure that provides detailed information about the error, including a machine-readable error code, a human-readable message, and optional validation details for input errors:"),
  ...codeBlock('{\n  "success": false,\n  "error": {\n    "code": "VALIDATION_ERROR",\n    "message": "Return request validation failed",\n    "details": [\n      {\n        "field": "items[0].purchaseDate",\n        "rule": "RETURN_WINDOW_EXCEEDED",\n        "message": "Purchase date 2026-03-01 is outside the 14-day return window",\n        "policyReference": "Return Policy v3.2, Section 2.1"\n      }\n    ],\n    "timestamp": "2026-04-26T14:30:00Z",\n    "requestId": "req-abc123-def456",\n    "documentationUrl": "https://api.kontakthome.az/docs/errors/VALIDATION_ERROR"\n  }\n}'),
  divider(),
  para("Common error codes include:"),
  createTable(
    ["Error Code", "HTTP Status", "Description"],
    [
      ["AUTHENTICATION_REQUIRED", "401", "No valid access token provided"],
      ["TOKEN_EXPIRED", "401", "Access token has expired, use refresh token"],
      ["INSUFFICIENT_PERMISSIONS", "403", "User role does not have permission for this operation"],
      ["RESOURCE_NOT_FOUND", "404", "The requested resource does not exist"],
      ["VALIDATION_ERROR", "400", "Request body fails validation rules"],
      ["RETURN_WINDOW_EXCEEDED", "422", "Return request is outside the allowed time window"],
      ["PRODUCT_NOT_ELIGIBLE", "422", "Product category is in the non-returnable list"],
      ["DUPLICATE_RETURN_REQUEST", "409", "A return request already exists for this order item"],
      ["INVALID_STATUS_TRANSITION", "422", "Requested status transition is not allowed"],
      ["RATE_LIMIT_EXCEEDED", "429", "API rate limit threshold has been reached"],
      ["ERP_INTEGRATION_ERROR", "502", "Upstream ERP service returned an error"],
      ["INTERNAL_ERROR", "500", "Unexpected server-side error (contact support)"],
    ]
  ),
  divider(),

  heading("1.9 Pagination", 2),
  para("All list endpoints support pagination using page and pageSize query parameters. The default page size is 20 items with a maximum of 100 items per page. Pagination metadata is included in every paginated response:"),
  ...codeBlock("GET /api/v1/returns?page=2&pageSize=50\n\nResponse pagination object:\n{\n  \"pagination\": {\n    \"page\": 2,\n    \"pageSize\": 50,\n    \"totalItems\": 547,\n    \"totalPages\": 11,\n    \"hasNext\": true,\n    \"hasPrev\": true\n  }\n}"),
  divider(),
  para("Cursor-based pagination is also available for large datasets by using the cursor parameter instead of page. Cursor pagination provides more consistent performance for datasets exceeding 10,000 records and is recommended for analytics and reporting endpoints."),

  heading("1.10 Data Types and Formats", 2),
  para("The API uses consistent data types and formats across all endpoints. All dates and timestamps are in ISO 8601 format (UTC timezone). All monetary amounts are in AZN (Azerbaijani Manat) with two decimal places. The following table documents the standard data types used throughout the API:"),
  createTable(
    ["Type", "Format", "Example", "Description"],
    [
      ["Timestamp", "ISO 8601 (UTC)", "\"2026-04-26T14:30:00Z\"", "All datetime fields use UTC with Z suffix"],
      ["Date", "ISO 8601 (date only)", "\"2026-04-26\"", "Dates without time component"],
      ["Money", "Number (2 decimal)", "1299.00", "AZN currency, always 2 decimal places"],
      ["Email", "RFC 5322", "\"user@example.com\"", "Validated email address format"],
      ["Phone", "E.164", "\"+994501234567\"", "International phone number format"],
      ["UUID", "RFC 4122", "\"550e8400-e29b-41d4-a716-446655440000\"", "For internal identifiers"],
      ["RMA Number", "Custom format", "\"RMA-2026-000047\"", "RMA-YYYY-NNNNNN format"],
      ["Enum", "UPPER_SNAKE_CASE", "\"DEFECTIVE\"", "Enumeration values in uppercase"],
      ["Base64 Image", "Data URI", "\"data:image/jpeg;base64,...\"", "Encoded image for photo uploads"],
    ]
  ),
  divider(),

  // 2-9: Endpoint sections
  ...endpoints.flatMap((group, gIdx) => {
    const groupLines = [
      heading(`${gIdx + 2}. ${group.group} Endpoints`),
      para(group.groupDesc),
      divider(),
    ];
    const epLines = group.endpoints.flatMap((ep, eIdx) => {
      const sectionNum = `${gIdx + 2}.${eIdx + 1}`;
      return buildEndpointSection(ep, sectionNum);
    });
    return [...groupLines, ...epLines];
  }),

  // 10. JSON Schema Definitions
  heading("10. JSON Schema Definitions"),
  para("This section defines the canonical JSON schemas for the primary data models used throughout the API. These schemas serve as the contract between API consumers and producers, ensuring data consistency and enabling automated validation. All schemas follow JSON Schema Draft 2020-12 specification."),

  heading("10.1 Return Request Schema", 2),
  ...codeBlock(`{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["orderId", "customerEmail", "items", "preferredResolution"],
  "properties": {
    "orderId": {
      "type": "string",
      "pattern": "^ORD-\\\\d{4}-\\\\d{5}$",
      "description": "Original order reference number from ERP"
    },
    "customerEmail": {
      "type": "string",
      "format": "email",
      "description": "Email address associated with the original order"
    },
    "items": {
      "type": "array",
      "minItems": 1,
      "maxItems": 10,
      "items": {
        "type": "object",
        "required": ["orderItemId", "productSku", "returnReason", "purchasePrice"],
        "properties": {
          "orderItemId": { "type": "string" },
          "productSku": { "type": "string" },
          "productName": { "type": "string" },
          "serialNumber": { "type": "string" },
          "returnReason": {
            "type": "string",
            "enum": ["DEFECTIVE", "WRONG_ITEM", "NOT_AS_DESCRIBED",
                     "CHANGED_MIND", "BETTER_PRICE_FOUND",
                     "DAMAGED_IN_TRANSIT", "OTHER"]
          },
          "reasonDescription": { "type": "string", "maxLength": 500 },
          "productCondition": {
            "type": "string",
            "enum": ["NEW", "GOOD", "FAIR", "POOR"]
          },
          "purchasePrice": { "type": "number", "minimum": 0 },
          "photos": {
            "type": "array",
            "maxItems": 5,
            "items": { "type": "string", "contentEncoding": "base64" }
          }
        }
      }
    },
    "preferredResolution": {
      "type": "string",
      "enum": ["REFUND", "EXCHANGE", "STORE_CREDIT"]
    },
    "customerNotes": { "type": "string", "maxLength": 1000 }
  }
}`),
  divider(),

  heading("10.2 Inspection Result Schema", 2),
  ...codeBlock(`{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["rmaNumber", "inspectionResult"],
  "properties": {
    "rmaNumber": {
      "type": "string",
      "pattern": "^RMA-\\\\d{4}-\\\\d{6}$"
    },
    "inspectionResult": {
      "type": "object",
      "required": ["conditionGrade", "disposition"],
      "properties": {
        "conditionGrade": {
          "type": "string",
          "enum": ["A", "B", "C", "D"],
          "description": "A=Like New, B=Good with minor marks,
                       C=Fair with visible wear, D=Poor/not functional"
        },
        "gradingCriteria": {
          "type": "object",
          "properties": {
            "packaging": {
              "type": "string",
              "enum": ["ORIGINAL", "INTACT", "DAMAGED", "MISSING"]
            },
            "accessories": {
              "type": "string",
              "enum": ["COMPLETE", "PARTIAL", "MISSING"]
            },
            "cosmeticCondition": {
              "type": "string",
              "enum": ["PERFECT", "MINOR_MARKS", "VISIBLE_WEAR",
                       "SIGNIFICANT_DAMAGE"]
            },
            "functionalTest": {
              "type": "string",
              "enum": ["PASSED", "PARTIAL", "FAILED"]
            }
          }
        },
        "disposition": {
          "type": "string",
          "enum": ["RESTOCK", "REFURBISH", "DISPOSE", "RETURN_TO_VENDOR"]
        },
        "dispositionNotes": { "type": "string", "maxLength": 1000 },
        "inspectorId": { "type": "string" },
        "inspectionDuration": {
          "type": "integer",
          "description": "Inspection time in minutes"
        },
        "photos": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "type": {
                "type": "string",
                "enum": ["GENERAL", "DEFECT", "PACKAGING", "ACCESSORY"]
              },
              "url": { "type": "string" },
              "annotation": { "type": "string" }
            }
          }
        }
      }
    }
  }
}`),
  divider(),

  heading("10.3 Refund Schema", 2),
  ...codeBlock(`{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "refundId": {
      "type": "string",
      "pattern": "^REF-\\\\d{4}-\\\\d{6}$"
    },
    "rmaNumber": { "type": "string" },
    "amount": {
      "type": "number",
      "minimum": 0,
      "description": "Refund amount in AZN"
    },
    "currency": { "type": "string", "enum": ["AZN"] },
    "method": {
      "type": "string",
      "enum": ["CREDIT_CARD", "BANK_TRANSFER", "STORE_CREDIT", "CASH"]
    },
    "status": {
      "type": "string",
      "enum": ["PENDING", "SUBMITTED", "PROCESSING",
               "COMPLETED", "FAILED", "REVERSED"]
    },
    "erpTransactionId": { "type": "string" },
    "bankReference": { "type": "string" },
    "processedBy": { "type": "string" },
    "processedAt": { "type": "string", "format": "date-time" },
    "completedAt": { "type": "string", "format": "date-time" }
  }
}`),
  divider(),

  heading("10.4 Error Response Schema", 2),
  ...codeBlock(`{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["success", "error"],
  "properties": {
    "success": { "type": "boolean", "const": false },
    "error": {
      "type": "object",
      "required": ["code", "message", "timestamp"],
      "properties": {
        "code": {
          "type": "string",
          "enum": ["AUTHENTICATION_REQUIRED", "TOKEN_EXPIRED",
                   "INSUFFICIENT_PERMISSIONS", "RESOURCE_NOT_FOUND",
                   "VALIDATION_ERROR", "RETURN_WINDOW_EXCEEDED",
                   "PRODUCT_NOT_ELIGIBLE", "DUPLICATE_RETURN_REQUEST",
                   "INVALID_STATUS_TRANSITION", "RATE_LIMIT_EXCEEDED",
                   "ERP_INTEGRATION_ERROR", "INTERNAL_ERROR"]
        },
        "message": {
          "type": "string",
          "description": "Human-readable error message"
        },
        "details": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "field": { "type": "string" },
              "rule": { "type": "string" },
              "message": { "type": "string" },
              "policyReference": { "type": "string" }
            }
          }
        },
        "timestamp": { "type": "string", "format": "date-time" },
        "requestId": { "type": "string" },
        "documentationUrl": { "type": "string", "format": "uri" }
      }
    }
  }
}`),
  divider(),

  heading("10.5 Pagination Metadata Schema", 2),
  ...codeBlock(`{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["page", "pageSize", "totalItems", "totalPages"],
  "properties": {
    "page": {
      "type": "integer",
      "minimum": 1,
      "description": "Current page number (1-indexed)"
    },
    "pageSize": {
      "type": "integer",
      "minimum": 1,
      "maximum": 100,
      "description": "Number of items per page"
    },
    "totalItems": {
      "type": "integer",
      "minimum": 0,
      "description": "Total number of items across all pages"
    },
    "totalPages": {
      "type": "integer",
      "minimum": 0,
      "description": "Total number of pages"
    },
    "hasNext": {
      "type": "boolean",
      "description": "Whether a next page exists"
    },
    "hasPrev": {
      "type": "boolean",
      "description": "Whether a previous page exists"
    }
  }
}`),
  divider(),

  // 11. API Changelog
  heading("11. API Changelog"),
  para("This changelog documents all notable changes to the Kontakt Home RMS API. Changes are organized by version in reverse chronological order (newest first)."),

  heading("Version 1.0.0 (April 26, 2026)", 2),
  coloredPara("Initial production release", COLORS.green),
  createTable(
    ["Change Type", "Endpoint / Component", "Description"],
    [
      ["NEW", "POST /api/v1/auth/login", "User authentication with JWT token generation"],
      ["NEW", "POST /api/v1/auth/refresh", "Token refresh endpoint for access token renewal"],
      ["NEW", "POST /api/v1/auth/logout", "Session invalidation and token revocation"],
      ["NEW", "POST /api/v1/returns", "Create new return request with auto-validation"],
      ["NEW", "GET /api/v1/returns/{rmaNumber}", "Retrieve return request details with full timeline"],
      ["NEW", "GET /api/v1/returns", "List returns with filtering, sorting, and pagination"],
      ["NEW", "PATCH /api/v1/returns/{rmaNumber}/status", "Update return status with state machine validation"],
      ["NEW", "POST /api/v1/returns/{rmaNumber}/cancel", "Cancel an active return request"],
      ["NEW", "POST /api/v1/returns/validate", "Pre-submission eligibility check without creating request"],
      ["NEW", "GET /api/v1/policies/rules", "Retrieve current validation rule configuration"],
      ["NEW", "POST /api/v1/warehouse/receive", "Record receipt of returned item by RMA barcode"],
      ["NEW", "POST /api/v1/warehouse/inspect", "Submit quality inspection results with photo evidence"],
      ["NEW", "GET /api/v1/warehouse/queue", "Retrieve warehouse inspection work queue with SLA timers"],
      ["NEW", "POST /api/v1/refunds/calculate", "Calculate refund amount based on condition and policy"],
      ["NEW", "POST /api/v1/refunds/process", "Submit refund to ERP for execution"],
      ["NEW", "GET /api/v1/refunds/{refundId}", "Retrieve refund transaction status and timeline"],
      ["NEW", "GET /api/v1/notifications/{rmaNumber}/history", "Retrieve notification delivery history"],
      ["NEW", "POST /api/v1/notifications/send", "Manually trigger a notification"],
      ["NEW", "GET /api/v1/analytics/dashboard", "Management KPI dashboard data"],
      ["NEW", "GET /api/v1/analytics/returns/by-category", "Category-level return analytics"],
      ["NEW", "GET /api/v1/analytics/reports/export", "Generate and export analytics reports"],
      ["NEW", "PUT /api/v1/admin/policies/rules/{ruleId}", "Update validation rule configuration"],
      ["NEW", "GET /api/v1/admin/audit-trail", "Retrieve system audit trail"],
      ["NEW", "GET /api/v1/admin/users", "List system users with role and status information"],
    ]
  ),
  divider(),
  heading("Planned for v1.1 (Q3 2026)", 2),
  coloredPara("Upcoming features (not yet released)", COLORS.orange),
  bullet("GET /api/v1/returns/{rmaNumber}/label - Download return shipping label as PDF"),
  bullet("POST /api/v1/returns/{rmaNumber}/exchange - Process product exchange requests"),
  bullet("GET /api/v1/analytics/agents/performance - Agent performance metrics endpoint"),
  bullet("POST /api/v1/warehouse/dispose - Record item disposal with waste tracking"),
  bullet("GET /api/v1/analytics/product-quality - Advanced product quality correlation analysis"),
  bullet("POST /api/v1/returns/bulk - Batch return request processing for B2B customers"),
  bullet("GET /api/v1/returns/export - Export return data in CSV/Excel format"),
  bullet("WebSocket /ws/v1/returns/{rmaNumber} - Real-time return status updates via WebSocket"),
  divider(),
  heading("Planned for v2.0 (Q4 2026)", 2),
  coloredPara("Future major version (breaking changes possible)", COLORS.purple),
  bullet("GraphQL API alongside REST for flexible data querying"),
  bullet("OAuth 2.0 / OpenID Connect for customer authentication (replacing custom JWT)"),
  bullet("API key authentication for partner/B2B integrations"),
  bullet("Async webhook notifications for ERP and third-party integrations"),
  bullet("Multi-currency support for international orders"),
];

// ========== ASSEMBLE DOCUMENT ==========
const doc = new docx.Document({
  creator: "Zamir Jamalov",
  title: "REST API & JSON Specification - Kontakt Home Return Management System",
  description: "Complete API reference for the Return Management System including all endpoints, JSON schemas, and authentication details",
  styles: { default: { document: { run: { font: "Calibri", size: 22 } } } },
  sections: [{
    properties: {},
    children: [
      ...coverChildren,
      new docx.PageBreak(),
      ...tocChildren,
      new docx.PageBreak(),
      ...mainChildren,
    ],
  }],
});

const outputPath = "/home/z/my-project/ba-practice/Kontakt_Home_REST_API_JSON_Specification_Return_Management_System.docx";
docx.Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outputPath, buffer);
  console.log("Document generated successfully:", outputPath);
  console.log("File size:", (buffer.length / 1024).toFixed(1), "KB");
});
