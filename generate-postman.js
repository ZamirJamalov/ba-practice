const docx = require("docx");
const fs = require("fs");

const COLORS = {
  deepSea: "1B3A5C", ocean: "2E86AB", sky: "A3CEF1", light: "E8F4F8",
  white: "FFFFFF", dark: "0F2439", gray: "666666", lightGray: "F5F5F5",
  accent: "1B6B93", green: "2E7D32", orange: "E65100", red: "C62828",
  purple: "6A1B9A", teal: "00796B", amber: "F57F17",
  get: "2E7D32", post: "1565C0", put: "E65100", delete: "C62828", patch: "6A1B9A",
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
  return new docx.Paragraph({ children: [new docx.TextRun({ text, size: 22, color: color, font: "Calibri" })], spacing: { after: 120, line: 276 } });
}

function divider() { return new docx.Paragraph({ spacing: { before: 80, after: 80 }, children: [] }); }

// ========== COVER PAGE ==========
function coverPage() {
  return [
    new docx.Paragraph({ spacing: { before: 3600 }, children: [] }),
    new docx.Paragraph({
      children: [new docx.TextRun({ text: "KONTAKT HOME", bold: true, size: 56, color: COLORS.deepSea, font: "Calibri" })],
      alignment: "center", spacing: { after: 80 },
    }),
    new docx.Paragraph({
      children: [new docx.TextRun({ text: "Postman API Testing", bold: true, size: 40, color: COLORS.ocean, font: "Calibri" })],
      alignment: "center", spacing: { after: 200 },
    }),
    new docx.Paragraph({
      children: [new docx.TextRun({ text: "Return Management System", size: 28, color: COLORS.accent, font: "Calibri" })],
      alignment: "center", spacing: { after: 100 },
    }),
    new docx.Paragraph({
      children: [new docx.TextRun({ text: "Comprehensive API Test Collection, Environment Configuration,", size: 22, color: COLORS.gray, font: "Calibri" })],
      alignment: "center", spacing: { after: 40 },
    }),
    new docx.Paragraph({
      children: [new docx.TextRun({ text: "Automated Test Scripts, and CI/CD Integration Guide", size: 22, color: COLORS.gray, font: "Calibri" })],
      alignment: "center", spacing: { after: 600 },
    }),
    // Decorative line
    new docx.Paragraph({
      children: [new docx.TextRun({ text: "________________________________________", color: COLORS.ocean, size: 24, font: "Calibri" })],
      alignment: "center", spacing: { after: 300 },
    }),
    new docx.Paragraph({
      children: [new docx.TextRun({ text: "Document Version: 1.0", size: 22, color: COLORS.gray, font: "Calibri" })],
      alignment: "center", spacing: { after: 80 },
    }),
    new docx.Paragraph({
      children: [new docx.TextRun({ text: "Date: April 26, 2026", size: 22, color: COLORS.gray, font: "Calibri" })],
      alignment: "center", spacing: { after: 80 },
    }),
    new docx.Paragraph({
      children: [new docx.TextRun({ text: "Author: Zamir Jamalov, Business Analyst", size: 22, color: COLORS.gray, font: "Calibri" })],
      alignment: "center", spacing: { after: 80 },
    }),
    new docx.Paragraph({
      children: [new docx.TextRun({ text: "Classification: Confidential", size: 22, color: COLORS.red, font: "Calibri", bold: true })],
      alignment: "center", spacing: { after: 80 },
    }),
  ];
}

// ========== DOCUMENT CONTENT ==========
const content = [];

// TOC Placeholder
content.push(heading("Table of Contents", 1));
content.push(para("Please right-click and select 'Update Table' in Microsoft Word to refresh the Table of Contents."));
content.push(new docx.Paragraph({
  children: [new docx.TextRun({ text: "1. Introduction and Purpose", size: 22, color: COLORS.dark, font: "Calibri" })],
  spacing: { after: 60 },
}));
content.push(new docx.Paragraph({
  children: [new docx.TextRun({ text: "2. Postman Collection Overview", size: 22, color: COLORS.dark, font: "Calibri" })],
  spacing: { after: 60 },
}));
content.push(new docx.Paragraph({
  children: [new docx.TextRun({ text: "3. Environment Configuration", size: 22, color: COLORS.dark, font: "Calibri" })],
  spacing: { after: 60 },
}));
content.push(new docx.Paragraph({
  children: [new docx.TextRun({ text: "4. Authentication Test Suite", size: 22, color: COLORS.dark, font: "Calibri" })],
  spacing: { after: 60 },
}));
content.push(new docx.Paragraph({
  children: [new docx.TextRun({ text: "5. Return Requests Test Suite", size: 22, color: COLORS.dark, font: "Calibri" })],
  spacing: { after: 60 },
}));
content.push(new docx.Paragraph({
  children: [new docx.TextRun({ text: "6. Validation Engine Test Suite", size: 22, color: COLORS.dark, font: "Calibri" })],
  spacing: { after: 60 },
}));
content.push(new docx.Paragraph({
  children: [new docx.TextRun({ text: "7. Warehouse Operations Test Suite", size: 22, color: COLORS.dark, font: "Calibri" })],
  spacing: { after: 60 },
}));
content.push(new docx.Paragraph({
  children: [new docx.TextRun({ text: "8. Refund Processing Test Suite", size: 22, color: COLORS.dark, font: "Calibri" })],
  spacing: { after: 60 },
}));
content.push(new docx.Paragraph({
  children: [new docx.TextRun({ text: "9. Notifications Test Suite", size: 22, color: COLORS.dark, font: "Calibri" })],
  spacing: { after: 60 },
}));
content.push(new docx.Paragraph({
  children: [new docx.TextRun({ text: "10. Analytics and Reporting Test Suite", size: 22, color: COLORS.dark, font: "Calibri" })],
  spacing: { after: 60 },
}));
content.push(new docx.Paragraph({
  children: [new docx.TextRun({ text: "11. Admin and Configuration Test Suite", size: 22, color: COLORS.dark, font: "Calibri" })],
  spacing: { after: 60 },
}));
content.push(new docx.Paragraph({
  children: [new docx.TextRun({ text: "12. Test Data Management", size: 22, color: COLORS.dark, font: "Calibri" })],
  spacing: { after: 60 },
}));
content.push(new docx.Paragraph({
  children: [new docx.TextRun({ text: "13. Negative and Edge Case Testing", size: 22, color: COLORS.dark, font: "Calibri" })],
  spacing: { after: 60 },
}));
content.push(new docx.Paragraph({
  children: [new docx.TextRun({ text: "14. Performance and Load Testing", size: 22, color: COLORS.dark, font: "Calibri" })],
  spacing: { after: 60 },
}));
content.push(new docx.Paragraph({
  children: [new docx.TextRun({ text: "15. Security Testing", size: 22, color: COLORS.dark, font: "Calibri" })],
  spacing: { after: 60 },
}));
content.push(new docx.Paragraph({
  children: [new docx.TextRun({ text: "16. Mock Server Configuration", size: 22, color: COLORS.dark, font: "Calibri" })],
  spacing: { after: 60 },
}));
content.push(new docx.Paragraph({
  children: [new docx.TextRun({ text: "17. CI/CD Pipeline Integration", size: 22, color: COLORS.dark, font: "Calibri" })],
  spacing: { after: 60 },
}));
content.push(new docx.Paragraph({
  children: [new docx.TextRun({ text: "18. Test Reporting and Coverage", size: 22, color: COLORS.dark, font: "Calibri" })],
  spacing: { after: 60 },
}));
content.push(new docx.Paragraph({
  children: [new docx.TextRun({ text: "19. Best Practices and Standards", size: 22, color: COLORS.dark, font: "Calibri" })],
  spacing: { after: 60 },
}));
content.push(new docx.Paragraph({
  children: [new docx.TextRun({ text: "20. Appendix", size: 22, color: COLORS.dark, font: "Calibri" })],
  spacing: { after: 120 },
}));

// ========== 1. INTRODUCTION ==========
content.push(heading("1. Introduction and Purpose", 1));
content.push(para("This document provides a comprehensive Postman API testing specification for the Kontakt Home Return Management System (RMS) API. It serves as the definitive guide for QA engineers, developers, and DevOps teams responsible for ensuring the reliability, correctness, and performance of all 24 API endpoints across 8 resource groups that power the return management platform."));
content.push(para("The Postman collection described in this document covers the complete end-to-end testing lifecycle, from initial authentication through return request creation, warehouse receiving, inspection processing, refund calculation and execution, notification delivery, analytics retrieval, and administrative operations. Each test case includes detailed pre-request scripts for environment setup, comprehensive test assertions using Postman's built-in Chai.js assertion library, and variable extraction for chaining requests into realistic business workflows."));
content.push(para("The primary objectives of this Postman testing suite are to validate that all API endpoints conform to the OpenAPI 3.0 specification documented separately, ensure business logic correctness across all return process state transitions, verify role-based access control (RBAC) enforcement for all five user roles (Customer, Support Agent, Warehouse Staff, Manager, and Admin), confirm proper error handling and HTTP status code usage, test integration points with the ERP financial module, and establish a regression test suite that can be executed automatically within the CI/CD pipeline on every code deployment."));

content.push(heading("1.1 Document Scope", 2));
content.push(para("This testing specification encompasses functional testing for all positive and negative scenarios, integration testing covering ERP, email/SMS gateway, and barcode scanner interfaces, security testing including authentication, authorization, input validation, and rate limiting, performance baseline testing to establish response time benchmarks for each endpoint, and contract testing to verify API responses match the documented schemas. The collection is designed to work across three environments: Development (https://api-dev.kontakthome.az/api/v1), Staging (https://api-staging.kontakthome.az/api/v1), and Production (https://api.kontakthome.az/api/v1)."));

content.push(heading("1.2 Intended Audience", 2));
content.push(bullet("QA Engineers: Primary users responsible for executing, maintaining, and expanding the test collection"));
content.push(bullet("Backend Developers: Reference for understanding expected API behavior and troubleshooting failing tests"));
content.push(bullet("DevOps Engineers: Configuration and execution of automated test runs within CI/CD pipelines"));
content.push(bullet("Business Analysts: Understanding of test coverage and quality metrics for project reporting"));
content.push(bullet("Project Managers: Tracking of testing progress, defect identification, and release readiness"));

content.push(heading("1.3 Prerequisites", 2));
content.push(bullet("Postman Desktop Application v11.0+ or Postman Web App"));
content.push(bullet("A Postman account (free tier sufficient for basic collection execution)"));
content.push(bullet("Valid test credentials for each of the five user roles"));
content.push(bullet("Network access to at least one of the configured API environments"));
content.push(bullet("Node.js v18+ installed locally for Newman CLI execution in CI/CD"));

// ========== 2. COLLECTION OVERVIEW ==========
content.push(heading("2. Postman Collection Overview", 1));
content.push(para("The Kontakt Home RMS API Postman collection is organized into a hierarchical folder structure that mirrors the API's resource groups and business domains. This organization ensures that related endpoints are grouped logically, making it easy for testers to navigate, execute specific test suites, and understand the business context of each request. The collection contains 24 primary test requests organized across 8 folders, plus 15 negative test cases, 8 security test cases, and 5 end-to-end workflow scenarios."));

content.push(heading("2.1 Collection Structure", 2));
content.push(createTable(
  ["Folder", "Tests", "Key Endpoints", "Priority"],
  [
    ["Authentication", "3", "Login, Refresh Token, Logout", "P0 - Critical"],
    ["Return Requests", "5", "Create, Get, List, Update Status, Cancel", "P0 - Critical"],
    ["Validation Engine", "2", "Pre-validate, List Rules", "P0 - Critical"],
    ["Warehouse Operations", "3", "Receive, Inspect, Queue", "P1 - High"],
    ["Refund Processing", "3", "Calculate, Process, Get Details", "P1 - High"],
    ["Notifications", "2", "History, Send Manual", "P2 - Medium"],
    ["Analytics & Reporting", "3", "Dashboard, Category, Export", "P2 - Medium"],
    ["Admin & Configuration", "3", "Update Rule, Audit Trail, Users", "P1 - High"],
    ["Negative & Edge Cases", "15", "Error scenarios across all groups", "P0 - Critical"],
    ["Security Tests", "8", "Auth bypass, injection, rate limits", "P0 - Critical"],
    ["E2E Workflows", "5", "Full return lifecycle scenarios", "P0 - Critical"],
  ]
));

content.push(heading("2.2 Collection Variables", 2));
content.push(para("Collection-level variables are used to store shared configuration that applies across all requests regardless of the selected environment. These variables are defined at the collection scope and provide default values that can be overridden by environment variables when needed."));
content.push(createTable(
  ["Variable Name", "Default Value", "Description"],
  [
    ["base_url", "{{protocol}}://{{host}}{{basePath}}", "Constructed from environment parts"],
    ["protocol", "https", "API protocol (https in all environments)"],
    ["api_version", "v1", "API version identifier"],
    ["auth_token", "", "JWT access token (set dynamically)"],
    ["refresh_token", "", "JWT refresh token (set dynamically)"],
    ["rma_number", "", "Current test RMA number (chained)"],
    ["return_id", "", "Current test return ID (chained)"],
    ["refund_id", "", "Current test refund ID (chained)"],
    ["order_id", "ORD-2026-48721", "Default test order ID"],
    ["customer_email", "test-customer@kontakthome.az", "Default test customer email"],
    ["test_timestamp", "", "Current test run timestamp"],
    ["request_timeout", "5000", "Default request timeout in milliseconds"],
  ]
));

// ========== 3. ENVIRONMENT CONFIGURATION ==========
content.push(heading("3. Environment Configuration", 1));
content.push(para("The Postman collection uses environment variables to switch between different deployment targets without modifying any request URLs or test scripts. Three pre-configured environments are provided for Development, Staging, and Production. Each environment defines the connection parameters, test user credentials, and feature flags specific to that deployment tier."));

content.push(heading("3.1 Development Environment", 2));
content.push(createTable(
  ["Variable", "Value", "Notes"],
  [
    ["host", "api-dev.kontakthome.az", "Dev API server"],
    ["basePath", "/api/v1", "API base path"],
    ["agent_email", "dev-agent@kontakthome.az", "Support Agent test account"],
    ["agent_password", "DevAgent@2026!", "Support Agent password"],
    ["customer_email", "dev-customer@test.com", "Customer test account"],
    ["customer_password", "DevCustomer@2026!", "Customer password"],
    ["warehouse_email", "dev-warehouse@kontakthome.az", "Warehouse Staff test account"],
    ["warehouse_password", "DevWarehouse@2026!", "Warehouse password"],
    ["manager_email", "dev-manager@kontakthome.az", "Manager test account"],
    ["manager_password", "DevManager@2026!", "Manager password"],
    ["admin_email", "dev-admin@kontakthome.az", "Admin test account"],
    ["admin_password", "DevAdmin@2026!", "Admin password"],
    ["mock_enabled", "true", "Use mock responses for unavailable services"],
    ["erp_mock", "true", "Mock ERP integration in dev"],
    ["sms_mock", "true", "Capture SMS without actual delivery"],
  ]
));

content.push(heading("3.2 Staging Environment", 2));
content.push(createTable(
  ["Variable", "Value", "Notes"],
  [
    ["host", "api-staging.kontakthome.az", "Staging API server"],
    ["basePath", "/api/v1", "API base path"],
    ["agent_email", "stg-agent@kontakthome.az", "Staging agent account"],
    ["agent_password", "{{STG_AGENT_PWD}}", "From vault"],
    ["customer_email", "stg-customer@test.com", "Staging customer account"],
    ["customer_password", "{{STG_CUSTOMER_PWD}}", "From vault"],
    ["warehouse_email", "stg-warehouse@kontakthome.az", "Staging warehouse account"],
    ["manager_email", "stg-manager@kontakthome.az", "Staging manager account"],
    ["admin_email", "stg-admin@kontakthome.az", "Staging admin account"],
    ["mock_enabled", "false", "Real integrations in staging"],
    ["erp_mock", "false", "Real ERP in staging"],
    ["sms_mock", "true", "SMS still mocked in staging"],
  ]
));

content.push(heading("3.3 Production Environment", 2));
content.push(para("The production environment is configured with read-only test credentials for smoke testing and health verification only. Destructive operations (create, update, delete) use dedicated test data that is cleaned up after each test run. Production credentials are stored in a shared Postman vault with restricted access."));
content.push(createTable(
  ["Variable", "Value", "Notes"],
  [
    ["host", "api.kontakthome.az", "Production API server"],
    ["basePath", "/api/v1", "API base path"],
    ["agent_email", "prod-smoke@kontakthome.az", "Smoke test agent"],
    ["mock_enabled", "false", "All real integrations"],
    ["erp_mock", "false", "Real ERP integration"],
    ["sms_mock", "false", "Real SMS delivery"],
    ["rate_limit_aware", "true", "Respect production rate limits"],
    ["cleanup_after_run", "true", "Auto-cleanup test data"],
  ]
));

// ========== 4. AUTH TEST SUITE ==========
content.push(heading("4. Authentication Test Suite", 1));
content.push(para("The authentication test suite validates the JWT-based authentication mechanism that secures all API endpoints. This suite is executed first in every test run because all subsequent requests depend on obtaining a valid access token. The suite covers successful login, token refresh, logout, credential validation, token expiry handling, and session management across all five user roles."));

content.push(heading("4.1 POST /auth/login - Successful Authentication", 2));
content.push(para("This test verifies that a valid user can authenticate with correct credentials and receive a JWT access token and refresh token. The test extracts both tokens into collection variables for use by subsequent requests. It also validates the user metadata returned in the response payload, including role assignment and department information."));
content.push(heading("Request Configuration", 3));
content.push(createTable(
  ["Property", "Value"],
  [
    ["Method", "POST"],
    ["URL", "{{base_url}}/auth/login"],
    ["Headers", "Content-Type: application/json"],
    ["Body Type", "JSON (raw)"],
    ["Timeout", "5000ms"],
  ]
));
content.push(heading("Request Body", 3));
content.push(...codeBlock('{\n  "email": "{{agent_email}}",\n  "password": "{{agent_password}}"\n}'));
content.push(heading("Expected Response", 3));
content.push(createTable(
  ["Field", "Expected Value", "Validation"],
  [
    ["HTTP Status", "200 OK", "Exact match"],
    ["success", "true", "Boolean assertion"],
    ["data.accessToken", "Non-empty string", "Length > 100, starts with 'eyJ'"],
    ["data.refreshToken", "Non-empty string", "Length > 20"],
    ["data.tokenType", "Bearer", "Exact match"],
    ["data.expiresIn", "900", "Integer, equals 900 (15 min)"],
    ["data.user.role", "SUPPORT_AGENT", "Enum validation"],
    ["data.user.email", "{{agent_email}}", "Exact match"],
    ["Response Time", "< 500ms", "Performance assertion"],
  ]
));
content.push(heading("Post-Response Test Script", 3));
content.push(...codeBlock(`// Extract tokens for subsequent requests
const jsonData = pm.response.json();

// Validate response structure
pm.test("Status code is 200", () => {
    pm.response.to.have.status(200);
});

pm.test("Response has success: true", () => {
    pm.expect(jsonData.success).to.be.true;
});

pm.test("Access token is present and valid JWT", () => {
    pm.expect(jsonData.data.accessToken).to.be.a('string');
    pm.expect(jsonData.data.accessToken.length).to.be.above(100);
    pm.expect(jsonData.data.accessToken.split('.')[0]).to.eq('eyJ');
});

pm.test("Refresh token is present", () => {
    pm.expect(jsonData.data.refreshToken).to.be.a('string');
    pm.expect(jsonData.data.refreshToken.length).to.be.above(20);
});

pm.test("Token type is Bearer", () => {
    pm.expect(jsonData.data.tokenType).to.eql('Bearer');
});

pm.test("Token expires in 900 seconds (15 min)", () => {
    pm.expect(jsonData.data.expiresIn).to.eql(900);
});

pm.test("User role is SUPPORT_AGENT", () => {
    pm.expect(jsonData.data.user.role).to.eql('SUPPORT_AGENT');
});

pm.test("User email matches request", () => {
    pm.expect(jsonData.data.user.email).to.eql(
        pm.environment.get('agent_email')
    );
});

pm.test("Response time is under 500ms", () => {
    pm.expect(pm.response.responseTime).to.be.below(500);
});

// Store tokens as collection variables
pm.collectionVariables.set('auth_token', jsonData.data.accessToken);
pm.collectionVariables.set('refresh_token', jsonData.data.refreshToken);
console.log('Tokens stored successfully for subsequent requests');`));

content.push(heading("4.2 POST /auth/login - Invalid Credentials", 2));
content.push(para("This negative test verifies that the API correctly rejects authentication attempts with incorrect credentials. The test confirms that no tokens are returned, the error message is generic (not revealing whether the email or password is wrong), and the response time is consistent regardless of credential validity (to prevent timing-based enumeration attacks)."));
content.push(createTable(
  ["Property", "Value"],
  [
    ["Method", "POST"],
    ["URL", "{{base_url}}/auth/login"],
    ["Body", '{"email": "{{agent_email}}", "password": "WrongPassword123"}'],
    ["Expected Status", "401 Unauthorized"],
  ]
));
content.push(...codeBlock(`const jsonData = pm.response.json();

pm.test("Status code is 401 Unauthorized", () => {
    pm.response.to.have.status(401);
});

pm.test("Error response contains error code", () => {
    pm.expect(jsonData.error).to.exist;
    pm.expect(jsonData.error.code).to.eql('INVALID_CREDENTIALS');
});

pm.test("No tokens leaked in error response", () => {
    pm.expect(jsonData.data).to.be.undefined;
    pm.expect(jsonData.accessToken).to.be.undefined;
});

pm.test("Response time is similar to valid login (anti-timing)", () => {
    pm.expect(pm.response.responseTime).to.be.above(100);
    pm.expect(pm.response.responseTime).to.be.below(1500);
});`));

content.push(heading("4.3 POST /auth/refresh - Token Rotation", 2));
content.push(para("This test validates the token refresh mechanism that enables long-lived sessions without requiring re-authentication. The test verifies that a valid refresh token can be exchanged for a new access token pair, that the old refresh token is invalidated (rotation), and that the new tokens are structurally valid JWT tokens with correct claims."));
content.push(createTable(
  ["Property", "Value"],
  [
    ["Method", "POST"],
    ["URL", "{{base_url}}/auth/refresh"],
    ["Body", '{"refreshToken": "{{refresh_token}}"}'],
    ["Expected Status", "200 OK"],
  ]
));
content.push(...codeBlock(`const jsonData = pm.response.json();

pm.test("Status code is 200", () => {
    pm.response.to.have.status(200);
});

pm.test("New access token is different from previous", () => {
    const oldToken = pm.collectionVariables.get('auth_token');
    pm.expect(jsonData.data.accessToken).to.be.a('string');
    pm.expect(jsonData.data.accessToken).to.not.eql(oldToken);
});

pm.test("New refresh token is different (token rotation)", () => {
    const oldRefresh = pm.collectionVariables.get('refresh_token');
    pm.expect(jsonData.data.refreshToken).to.not.eql(oldRefresh);
});

pm.test("New tokens are stored for subsequent requests", () => {
    pm.collectionVariables.set('auth_token', jsonData.data.accessToken);
    pm.collectionVariables.set('refresh_token', jsonData.data.refreshToken);
});

// Verify old refresh token is invalidated (re-use test)
// This is tested in a separate request below`));

content.push(heading("4.4 POST /auth/refresh - Reuse of Old Refresh Token", 2));
content.push(para("This security-critical test verifies that the token rotation mechanism correctly invalidates the old refresh token after a successful refresh. An attacker who obtains a previously used refresh token should not be able to use it to generate new access tokens. This test attempts to use the previous refresh token and expects a 401 Unauthorized response."));
content.push(...codeBlock(`pm.test("Old refresh token is rejected (401)", () => {
    pm.response.to.have.status(401);
});

pm.test("Error indicates token reuse detected", () => {
    const jsonData = pm.response.json();
    pm.expect(jsonData.error.code).to.eql('TOKEN_REVOKED');
});`));

content.push(heading("4.5 POST /auth/logout - Session Termination", 2));
content.push(para("This test verifies that the logout endpoint correctly invalidates the refresh token, preventing further token refreshes. After logout, the access token remains valid until its natural expiry (15 minutes), but no new tokens can be obtained. This test logs out and then attempts to refresh the now-invalidated token."));
content.push(createTable(
  ["Property", "Value"],
  [
    ["Method", "POST"],
    ["URL", "{{base_url}}/auth/logout"],
    ["Headers", "Authorization: Bearer {{auth_token}}"],
    ["Body", '{"refreshToken": "{{refresh_token}}"}'],
    ["Expected Status", "200 OK"],
  ]
));

// ========== 5. RETURN REQUESTS TEST SUITE ==========
content.push(heading("5. Return Requests Test Suite", 1));
content.push(para("The Return Requests test suite is the most comprehensive suite in the collection, covering all CRUD operations for return requests. This suite validates the complete return request lifecycle including creation with automatic validation, retrieval of individual and list views, status transitions following the state machine rules, and cancellation workflows. Each test generates realistic test data and chains responses to enable end-to-end workflow testing."));

content.push(heading("5.1 Pre-request Script - Authentication Guard", 2));
content.push(para("Every request in the Return Requests folder shares a common pre-request script that ensures a valid authentication token is available. If the current token has expired (or is missing), the script automatically attempts to refresh it. This guard prevents test failures due to token expiration during long test runs."));
content.push(...codeBlock(`// Pre-request Script: Auth Guard
// Automatically refreshes expired tokens before each request
const token = pm.collectionVariables.get('auth_token');

if (!token) {
    console.warn('No auth token found. Skipping auto-refresh.');
    console.warn('Run the Auth > Login request first.');
} else {
    // Decode JWT to check expiration (without verification)
    try {
        const payload = JSON.parse(
            Buffer.from(token.split('.')[1], 'base64').toString()
        );
        const expTime = payload.exp * 1000; // Convert to ms
        const now = Date.now();
        const buffer = 30000; // 30-second buffer

        if (now >= (expTime - buffer)) {
            console.log('Token expiring soon. Auto-refreshing...');
            // Send refresh request
            pm.sendRequest({
                url: pm.variables.get('base_url') + '/auth/refresh',
                method: 'POST',
                header: { 'Content-Type': 'application/json' },
                body: {
                    mode: 'raw',
                    raw: JSON.stringify({
                        refreshToken: pm.collectionVariables.get('refresh_token')
                    })
                }
            }, (err, res) => {
                if (!err && res.code === 200) {
                    const data = res.json().data;
                    pm.collectionVariables.set('auth_token', data.accessToken);
                    pm.collectionVariables.set('refresh_token', data.refreshToken);
                    console.log('Token refreshed successfully');
                } else {
                    console.error('Token refresh failed:', err || res.json());
                }
            });
        }
    } catch (e) {
        console.error('Error decoding JWT:', e.message);
    }
}`));

content.push(heading("5.2 POST /returns - Create Return Request", 2));
content.push(para("This is the primary test for creating a new return request. It sends a fully populated request body with one return item and validates the complete response including the generated RMA number, validation results, estimated refund amount, shipping label information, and HATEOAS links. The test stores the generated RMA number and return ID as collection variables for use by subsequent requests in the workflow chain."));
content.push(heading("Request Configuration", 3));
content.push(createTable(
  ["Property", "Value"],
  [
    ["Method", "POST"],
    ["URL", "{{base_url}}/returns"],
    ["Headers", "Authorization: Bearer {{auth_token}}, Content-Type: application/json"],
    ["Timeout", "10000ms"],
  ]
));
content.push(heading("Request Body", 3));
content.push(...codeBlock(`{\n  "orderId": "{{order_id}}",\n  "customerEmail": "{{customer_email}}",\n  "items": [\n    {\n      "orderItemId": "OI-{{\\$timestamp}}",\n      "productSku": "ELK-SMRT-TV-055",\n      "productName": "Samsung 55\\" Smart TV",\n      "serialNumber": "SN-SMRT-{{$timestamp}}",\n      "returnReason": "DEFECTIVE",\n      "reasonDescription": "Screen flickers intermittently after 30 min",\n      "productCondition": "GOOD",\n      "purchasePrice": 1299.00\n    }\n  ],\n  "preferredResolution": "REFUND",\n  "customerNotes": "Automated test - Postman collection run"\n}`));
content.push(heading("Test Assertions", 3));
content.push(...codeBlock(`const jsonData = pm.response.json();

pm.test("Status code is 201 Created", () => {
    pm.response.to.have.status(201);
});

pm.test("Response contains returnId", () => {
    pm.expect(jsonData.data.returnId).to.match(/^RET-\\d{4}-\\d{6}$/);
});

pm.test("RMA number follows correct format", () => {
    pm.expect(jsonData.data.rmaNumber).to.match(/^RMA-\\d{4}-\\d{6}$/);
});

pm.test("Status is APPROVED (auto-validated)", () => {
    pm.expect(['APPROVED', 'PENDING_REVIEW']).to.include(
        jsonData.data.status
    );
});

pm.test("Validation result shows eligible", () => {
    pm.expect(jsonData.data.validationResult.eligible).to.be.true;
});

pm.test("Estimated refund matches purchase price", () => {
    pm.expect(jsonData.data.estimatedRefund).to.eql(1299.00);
});

pm.test("Shipping label URL is provided", () => {
    pm.expect(jsonData.data.shippingLabel.labelUrl).to.be.a('string');
});

pm.test("HATEOAS _links contain self, tracking, cancel", () => {
    const links = jsonData.data._links;
    pm.expect(links).to.have.property('self');
    pm.expect(links).to.have.property('tracking');
    pm.expect(links).to.have.property('cancel');
});

pm.test("Response time under 2 seconds", () => {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

// Store generated IDs for chained requests
pm.collectionVariables.set('rma_number', jsonData.data.rmaNumber);
pm.collectionVariables.set('return_id', jsonData.data.returnId);
console.log('Created return:', jsonData.data.rmaNumber);`));

content.push(heading("5.3 GET /returns - List Returns with Filtering", 2));
content.push(para("This test verifies the list endpoint with multiple query parameter combinations. It tests status filtering, date range filtering, pagination, and sorting. The test includes assertions for the response structure, pagination metadata correctness, and data consistency with the filter parameters applied. Multiple iterations test different filter combinations."));
content.push(heading("Test Scenarios", 3));
content.push(createTable(
  ["Scenario", "Query Parameters", "Expected Behavior"],
  [
    ["All returns", "page=1&pageSize=20", "Returns first 20 results with pagination"],
    ["Filter by status", "status=SUBMITTED", "Only SUBMITTED returns returned"],
    ["Date range filter", "fromDate=2026-04-01&toDate=2026-04-30", "Returns within April 2026"],
    ["Customer filter", "customerEmail={{customer_email}}", "Only test customer returns"],
    ["Sort ascending", "sortBy=createdAt&sortOrder=asc", "Oldest returns first"],
    ["Combined filters", "status=APPROVED&productCategory=TV", "Approved TV returns only"],
    ["Empty result", "status=COMPLETED&customerEmail=nonexistent@test.com", "Empty array with pagination"],
    ["Page beyond range", "page=9999", "Empty array, valid pagination metadata"],
  ]
));
content.push(heading("Test Script (Primary Scenario)", 3));
content.push(...codeBlock(`const jsonData = pm.response.json();

pm.test("Status code is 200", () => {
    pm.response.to.have.status(200);
});

pm.test("Response is paginated", () => {
    pm.expect(jsonData.data.pagination).to.exist;
    pm.expect(jsonData.data.pagination).to.have.all.keys(
        'page', 'pageSize', 'totalItems', 'totalPages', 'hasNext', 'hasPrev'
    );
});

pm.test("Returns array is present", () => {
    pm.expect(jsonData.data.returns).to.be.an('array');
});

pm.test("Page size matches request", () => {
    pm.expect(jsonData.data.returns.length).to.be.at.most(20);
});

pm.test("Each return has required fields", () => {
    jsonData.data.returns.forEach(ret => {
        pm.expect(ret).to.have.all.keys(
            'returnId', 'rmaNumber', 'status', 'customerName',
            'productSku', 'returnReason', 'refundAmount', 'createdAt'
        );
    });
});

pm.test("Pagination metadata is consistent", () => {
    const pg = jsonData.data.pagination;
    pm.expect(pg.totalPages).to.eql(
        Math.ceil(pg.totalItems / pg.pageSize)
    );
    pm.expect(pg.hasNext).to.eql(pg.page < pg.totalPages);
    pm.expect(pg.hasPrev).to.eql(pg.page > 1);
});`));

content.push(heading("5.4 GET /returns/{rmaNumber} - Return Details", 2));
content.push(para("This test retrieves the complete details of a specific return request using the RMA number stored from the create test. It validates the full response structure including customer information, item details, financial summary, status timeline, and timestamp fields. The test also verifies data consistency with the original creation request."));
content.push(...codeBlock(`const jsonData = pm.response.json();
const rma = pm.collectionVariables.get('rma_number');

pm.test("Status code is 200", () => {
    pm.response.to.have.status(200);
});

pm.test("RMA number matches request", () => {
    pm.expect(jsonData.data.rmaNumber).to.eql(rma);
});

pm.test("Complete customer info is returned", () => {
    pm.expect(jsonData.data.customer).to.have.all.keys(
        'name', 'email', 'phone'
    );
});

pm.test("Items array contains expected product", () => {
    const items = jsonData.data.items;
    pm.expect(items).to.be.an('array');
    pm.expect(items.length).to.be.at.least(1);
    pm.expect(items[0].productSku).to.eql('ELK-SMRT-TV-055');
});

pm.test("Timeline has at least 2 events", () => {
    pm.expect(jsonData.data.timeline).to.be.an('array');
    pm.expect(jsonData.data.timeline.length).to.be.at.least(2);
});

pm.test("Financial summary is present", () => {
    pm.expect(jsonData.data.financialSummary).to.exist;
    pm.expect(jsonData.data.financialSummary).to.have.property('originalAmount');
    pm.expect(jsonData.data.financialSummary).to.have.property('refundAmount');
});

pm.test("Timestamps are valid ISO 8601", () => {
    const dateRegex = /^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}/;
    pm.expect(jsonData.data.createdAt).to.match(dateRegex);
    pm.expect(jsonData.data.updatedAt).to.match(dateRegex);
});`));

content.push(heading("5.5 PATCH /returns/{rmaNumber}/status - Status Update", 2));
content.push(para("This test validates the status update endpoint, which is the central mechanism for advancing return requests through the state machine. The test covers a valid status transition (from RECEIVED to INSPECTION_COMPLETE), verifies that the transition triggers the expected downstream effects (refund calculation), and confirms that the next actions are returned correctly. A separate test verifies that invalid transitions are rejected."));
content.push(...codeBlock(`const jsonData = pm.response.json();

pm.test("Status code is 200", () => {
    pm.response.to.have.status(200);
});

pm.test("Previous and new status are returned", () => {
    pm.expect(jsonData.data.previousStatus).to.eql('INSPECTING');
    pm.expect(jsonData.data.newStatus).to.eql('INSPECTION_COMPLETE');
});

pm.test("Refund calculation is triggered", () => {
    pm.expect(jsonData.data.refundCalculation).to.exist;
    pm.expect(jsonData.data.refundCalculation.refundAmount).to.eql(1299.00);
    pm.expect(jsonData.data.refundCalculation.conditionGrade).to.eql('B');
});

pm.test("Next actions are suggested", () => {
    pm.expect(jsonData.data.nextActions).to.be.an('array');
    pm.expect(jsonData.data.nextActions.length).to.be.at.least(1);
});

pm.test("Updated timestamp is recent", () => {
    const updatedAt = new Date(jsonData.data.updatedAt);
    const now = new Date();
    const diffMs = now - updatedAt;
    pm.expect(diffMs).to.be.below(60000); // Within 1 minute
});`));

content.push(heading("5.6 POST /returns/{rmaNumber}/cancel - Cancellation", 2));
content.push(para("This test verifies the cancellation workflow for return requests. Cancellation is only permitted before the item has been received by the warehouse. The test creates a fresh return request, then cancels it before it reaches the RECEIVED state, and validates that the status transitions to CANCELLED with the correct audit information. A separate test verifies that cancellation of already-received items is rejected with a 409 Conflict response."));

// ========== 6. VALIDATION ENGINE ==========
content.push(heading("6. Validation Engine Test Suite", 1));
content.push(para("The Validation Engine test suite verifies the automated return eligibility checking system that enforces business rules at the point of return creation. This suite tests all validation rules including return window verification, product category eligibility, return history thresholds, warranty status checks, and serial number validation. Each test includes assertions for both the overall eligibility decision and the individual rule evaluation results."));

content.push(heading("6.1 POST /returns/validate - Eligible Return", 2));
content.push(para("This test submits a valid return eligibility check and expects all validation rules to pass. The test verifies that the response includes detailed rule-by-rule evaluation results with policy references, and that all available resolution options (REFUND, EXCHANGE, STORE_CREDIT) are returned for eligible products."));
content.push(...codeBlock(`const jsonData = pm.response.json();

pm.test("Status code is 200", () => {
    pm.response.to.have.status(200);
});

pm.test("Return is eligible", () => {
    pm.expect(jsonData.data.eligible).to.be.true;
});

pm.test("All rules passed", () => {
    jsonData.data.rules.forEach(rule => {
        pm.expect(rule.passed, \`\${rule.ruleName} failed: \${rule.detail}\`).to.be.true;
    });
});

pm.test("Return Window Check passed", () => {
    const rule = jsonData.data.rules.find(r => r.ruleId === 'RULE-001');
    pm.expect(rule.passed).to.be.true;
    pm.expect(rule.policyReference).to.include('Section 2.1');
});

pm.test("All resolution options available", () => {
    const options = jsonData.data.returnOptions;
    pm.expect(options).to.include.members(
        ['REFUND', 'EXCHANGE', 'STORE_CREDIT']
    );
});`));

content.push(heading("6.2 POST /returns/validate - Ineligible Return (Expired Window)", 2));
content.push(para("This negative test verifies that the validation engine correctly rejects returns submitted outside the allowed return window. The test uses a purchase date that is beyond the standard 14-day return window and validates that the system correctly identifies the policy violation, returns the specific rule that failed, and excludes resolution options for ineligible products."));
content.push(...codeBlock(`const jsonData = pm.response.json();

pm.test("Status code is 200", () => {
    pm.response.to.have.status(200);
});

pm.test("Return is NOT eligible", () => {
    pm.expect(jsonData.data.eligible).to.be.false;
});

pm.test("Return Window Check rule failed", () => {
    const rule = jsonData.data.rules.find(r => r.ruleId === 'RULE-001');
    pm.expect(rule.passed).to.be.false;
    pm.expect(rule.detail).to.include('outside');
});

pm.test("No resolution options for ineligible return", () => {
    pm.expect(jsonData.data.returnOptions).to.be.an('array');
    pm.expect(jsonData.data.returnOptions.length).to.eql(0);
});`));

// ========== 7. WAREHOUSE OPERATIONS ==========
content.push(heading("7. Warehouse Operations Test Suite", 1));
content.push(para("The Warehouse Operations test suite covers the receiving, inspection, and queue management endpoints used by warehouse staff. These tests simulate the physical warehouse workflow of receiving returned items, performing quality inspections, and managing the inspection queue. The tests verify data integrity throughout the warehouse process, including correct status transitions, SLA tracking, and inventory action triggers."));

content.push(heading("7.1 POST /warehouse/receive - Item Receipt", 2));
content.push(para("This test simulates the warehouse receiving process where a returned item is scanned and registered into the warehouse system. The test verifies that the system correctly creates a receiving record, displays the expected item details for visual confirmation, sets the inspection deadline SLA, and triggers the inspection workflow initiation."));
content.push(...codeBlock(`const jsonData = pm.response.json();

pm.test("Status code is 201 Created", () => {
    pm.response.to.have.status(201);
});

pm.test("Receiving ID generated", () => {
    pm.expect(jsonData.data.receivingId).to.match(/^RCV-\\d{4}-\\d{6}$/);
});

pm.test("Expected item details displayed for verification", () => {
    pm.expect(jsonData.data.expectedItem).to.have.all.keys(
        'productName', 'productSku', 'serialNumber', 'customerName'
    );
});

pm.test("Status is RECEIVED", () => {
    pm.expect(jsonData.data.status).to.eql('RECEIVED');
});

pm.test("Inspection SLA deadline is set (24h from receipt)", () => {
    const deadline = new Date(jsonData.data.inspectionDeadline);
    const received = new Date(jsonData.data.receivedAt);
    const hoursDiff = (deadline - received) / (1000 * 60 * 60);
    pm.expect(hoursDiff).to.be.at.most(24);
    pm.expect(hoursDiff).to.be.at.least(23);
});

pm.test("Next action suggests inspection", () => {
    pm.expect(jsonData.data.nextAction).to.include('inspection');
});`));

content.push(heading("7.2 POST /warehouse/inspect - Quality Inspection", 2));
content.push(para("This test covers the quality inspection submission, which is the most complex warehouse operation. The inspector assigns a condition grade (A through D) based on standardized grading criteria, records the disposition recommendation, and provides detailed notes. The test validates that Grade B inspections are auto-approved for refund, inventory actions are triggered, and all photographic evidence references are recorded."));
content.push(...codeBlock(`const jsonData = pm.response.json();

pm.test("Status code is 200", () => {
    pm.response.to.have.status(200);
});

pm.test("Inspection ID generated", () => {
    pm.expect(jsonData.data.inspectionId).to.match(/^INS-\\d{4}-\\d{6}$/);
});

pm.test("Condition grade B recorded", () => {
    pm.expect(jsonData.data.conditionGrade).to.eql('B');
});

pm.test("Disposition is RESTOCK", () => {
    pm.expect(jsonData.data.disposition).to.eql('RESTOCK');
});

pm.test("Grade B refund is auto-approved", () => {
    pm.expect(jsonData.data.refundEligibility.autoApproved).to.be.true;
    pm.expect(jsonData.data.refundEligibility.approvalRequired).to.be.false;
    pm.expect(jsonData.data.refundEligibility.refundPercentage).to.eql(100);
});

pm.test("Inventory action triggered", () => {
    pm.expect(jsonData.data.inventoryAction).to.exist;
    pm.expect(jsonData.data.inventoryAction.action).to.eql('UPDATE_INVENTORY');
    pm.expect(jsonData.data.inventoryAction.newCondition).to.eql('OPEN_BOX');
});`));

content.push(heading("7.3 GET /warehouse/queue - Inspection Queue", 2));
content.push(para("This test retrieves the warehouse inspection work queue, which shows all items pending inspection sorted by FIFO with SLA countdown timers. The test validates the queue structure, SLA calculations, summary statistics, and priority assignments."));

// ========== 8. REFUND PROCESSING ==========
content.push(heading("8. Refund Processing Test Suite", 1));
content.push(para("The Refund Processing test suite validates the financial operations of the return management system, including refund calculation, submission to the ERP module, and status tracking. These tests are critical because they deal with monetary transactions and must ensure exact calculation accuracy, proper ERP integration, and complete audit trails for every financial operation."));

content.push(heading("8.1 POST /refunds/calculate - Refund Calculation", 2));
content.push(para("This test verifies the refund calculation engine that determines the exact refund amount based on the condition grade, return reason, original payment method, and applicable policy rules. The test validates the detailed breakdown including condition deductions, restocking fees, loyalty bonuses, and alternative refund options such as store credit with bonus percentage."));
content.push(...codeBlock(`const jsonData = pm.response.json();
const calc = jsonData.data.calculationBreakdown;

pm.test("Status code is 200", () => {
    pm.response.to.have.status(200);
});

pm.test("Original amount matches input", () => {
    pm.expect(calc.originalAmount).to.eql(1299.00);
});

pm.test("Grade B has zero condition deduction", () => {
    pm.expect(calc.conditionDeduction).to.eql(0.00);
    pm.expect(calc.conditionRefundPercentage).to.eql(100);
});

pm.test("Total refund equals original (no deductions)", () => {
    pm.expect(calc.totalRefundAmount).to.eql(1299.00);
});

pm.test("Currency is AZN", () => {
    pm.expect(calc.currency).to.eql('AZN');
});

pm.test("Store credit alternative includes 5% bonus", () => {
    const alt = jsonData.data.refundMethod; // primary
    const storeCredit = jsonData.data.alternatives.find(
        a => a.method === 'STORE_CREDIT'
    );
    pm.expect(storeCredit).to.exist;
    pm.expect(storeCredit.bonusPercentage).to.eql(5);
    pm.expect(storeCredit.bonusAmount).to.eql(64.95);
    pm.expect(storeCredit.amount).to.eql(1363.95);
});`));

content.push(heading("8.2 POST /refunds/process - Submit to ERP", 2));
content.push(para("This test validates the refund submission process that creates a financial transaction in the ERP system. The test verifies that the refund is created with a unique refund ID, the ERP transaction reference is returned, the status transitions through the expected lifecycle (SUBMITTED > SUBMITTED_TO_ERP), and HATEOAS links are provided for status tracking."));
content.push(...codeBlock(`const jsonData = pm.response.json();

pm.test("Status code is 201 Created", () => {
    pm.response.to.have.status(201);
});

pm.test("Refund ID follows format", () => {
    pm.expect(jsonData.data.refundId).to.match(/^REF-\\d{4}-\\d{6}$/);
    pm.collectionVariables.set('refund_id', jsonData.data.refundId);
});

pm.test("Refund amount is correct", () => {
    pm.expect(jsonData.data.amount).to.eql(1299.00);
});

pm.test("ERP transaction ID is generated", () => {
    pm.expect(jsonData.data.erpTransactionId).to.match(/^ERP-FIN-\\d{4}-\\d+/);
});

pm.test("Status is SUBMITTED_TO_ERP", () => {
    pm.expect(jsonData.data.status).to.eql('SUBMITTED_TO_ERP');
});

pm.test("HATEOAS links for self and return", () => {
    pm.expect(jsonData.data._links).to.have.all.keys('self', 'return');
});`));

content.push(heading("8.3 GET /refunds/{refundId} - Refund Status Tracking", 2));
content.push(para("This test retrieves the complete status and timeline of a refund transaction. It validates the timeline structure, ERP integration status, bank reference information (when available), and notification delivery history. The test verifies that all financial events are properly audited and traceable."));

// ========== 9. NOTIFICATIONS ==========
content.push(heading("9. Notifications Test Suite", 1));
content.push(para("The Notifications test suite verifies the multi-channel notification system that keeps customers informed at every stage of the return process. Tests cover notification history retrieval, manual notification sending by agents, delivery status tracking, and template management. The suite tests both email and SMS channels."));

content.push(heading("9.1 GET /notifications/{rmaNumber}/history", 2));
content.push(para("This test retrieves the complete notification history for a return request and validates that automated notifications were triggered at the correct process milestones. The test verifies that each notification record includes the channel, recipient, delivery status, and timestamp."));
content.push(...codeBlock(`const jsonData = pm.response.json();

pm.test("Status code is 200", () => {
    pm.response.to.have.status(200);
});

pm.test("Notifications array is present", () => {
    pm.expect(jsonData.data.notifications).to.be.an('array');
});

pm.test("At least one EMAIL notification sent", () => {
    const emails = jsonData.data.notifications.filter(
        n => n.channel === 'EMAIL'
    );
    pm.expect(emails.length).to.be.at.least(1);
});

pm.test("At least one SMS notification sent", () => {
    const sms = jsonData.data.notifications.filter(
        n => n.channel === 'SMS'
    );
    pm.expect(sms.length).to.be.at.least(1);
});

pm.test("All notifications have delivery status", () => {
    jsonData.data.notifications.forEach(notif => {
        pm.expect(notif.deliveryStatus).to.be.oneOf(
            ['DELIVERED', 'PENDING', 'FAILED', 'BOUNCED']
        );
    });
});`));

content.push(heading("9.2 POST /notifications/send - Manual Notification", 2));
content.push(para("This test verifies that agents can manually send notifications to customers. The test creates a custom notification using a template, verifies the notification is queued successfully, and checks that a copy is sent to the agent when requested."));

// ========== 10. ANALYTICS ==========
content.push(heading("10. Analytics and Reporting Test Suite", 1));
content.push(para("The Analytics and Reporting test suite validates the management dashboard, category-level analytics, and report export functionality. These endpoints provide aggregated data for business intelligence and decision-making. Tests verify data accuracy, KPI calculations, trend analysis, and the asynchronous report generation workflow."));

content.push(heading("10.1 GET /analytics/dashboard - KPI Validation", 2));
content.push(para("This test retrieves the management dashboard data and validates the structure and reasonableness of all KPI values. The test includes assertions for total returns count, average processing time, customer satisfaction score, auto-approval rate, refund totals, and cost per return metrics."));
content.push(...codeBlock(`const jsonData = pm.response.json();
const kpis = jsonData.data.kpis;

pm.test("Status code is 200", () => {
    pm.response.to.have.status(200);
});

pm.test("All KPI fields are present and positive numbers", () => {
    pm.expect(kpis.totalReturnsThisMonth).to.be.above(0);
    pm.expect(kpis.avgProcessingTimeDays).to.be.above(0);
    pm.expect(kpis.customerSatisfactionScore).to.be.at.least(0);
    pm.expect(kpis.customerSatisfactionScore).to.be.at.most(100);
    pm.expect(kpis.autoApprovalRate).to.be.at.least(0);
    pm.expect(kpis.autoApprovalRate).to.be.at.most(100);
    pm.expect(kpis.refundTotalThisMonth).to.be.above(0);
    pm.expect(kpis.costPerReturn).to.be.above(0);
});

pm.test("Top return reasons are sorted by count", () => {
    const reasons = jsonData.data.topReturnReasons;
    for (let i = 1; i < reasons.length; i++) {
        pm.expect(reasons[i-1].count).to.be.at.least(reasons[i].count);
    }
    pm.expect(reasons.reduce((s, r) => s + r.percentage, 0)).to.be.at.most(100);
});

pm.test("Trend data includes comparison values", () => {
    const trends = jsonData.data.trends;
    pm.expect(trends.returnVolume.currentMonth).to.be.a('number');
    pm.expect(trends.returnVolume.previousMonth).to.be.a('number');
    pm.expect(trends.returnVolume.changePercent).to.be.a('number');
});

pm.test("Alerts array is present", () => {
    pm.expect(jsonData.data.alerts).to.be.an('array');
});

pm.test("Data refresh timestamp is recent", () => {
    const refreshed = new Date(jsonData.data.lastRefreshed);
    const minutesAgo = (Date.now() - refreshed) / 60000;
    pm.expect(minutesAgo).to.be.below(30); // Within 30 minutes
});`));

content.push(heading("10.2 GET /analytics/returns/by-category - Category Analytics", 2));
content.push(para("This test validates the category-level analytics endpoint that provides return volume, refund amounts, and trend data broken down by product category. The test verifies that the date range filter is correctly applied, that all returned categories have complete data sets, and that the trend calculations are accurate."));

content.push(heading("10.3 GET /analytics/reports/export - Report Generation", 2));
content.push(para("This test triggers an asynchronous report export and validates the response structure. Since report generation is asynchronous, the test verifies that a report ID is returned, the status is PROCESSING, and an estimated completion time is provided. A separate chained request polls for completion and validates the download URL."));

// ========== 11. ADMIN TEST SUITE ==========
content.push(heading("11. Admin and Configuration Test Suite", 1));
content.push(para("The Admin and Configuration test suite covers the system administration endpoints that are restricted to ADMIN role users. These tests validate policy rule management (view and update), audit trail retrieval with filtering, and user management functionality. All tests in this suite verify that RBAC restrictions are properly enforced."));

content.push(heading("11.1 PUT /admin/policies/rules/{ruleId} - Rule Update", 2));
content.push(para("This test verifies that an admin can update a validation rule configuration. The test validates that the change is recorded with both previous and new values, an audit trail entry is created, the effective date is set correctly, and the system confirms that existing in-progress returns are not affected."));
content.push(...codeBlock(`const jsonData = pm.response.json();

pm.test("Status code is 200", () => {
    pm.response.to.have.status(200);
});

pm.test("Previous and new values are recorded", () => {
    pm.expect(jsonData.data.previousValues).to.exist;
    pm.expect(jsonData.data.newValues).to.exist;
});

pm.test("Audit trail ID is created", () => {
    pm.expect(jsonData.data.auditTrailId).to.match(/^AUD-\\d{4}-\\d+/);
});

pm.test("Effective date is now or future", () => {
    const effectiveDate = new Date(jsonData.data.effectiveFrom);
    pm.expect(effectiveDate.getTime()).to.be.at.most(Date.now() + 60000);
});

pm.test("Affected returns scope is specified", () => {
    pm.expect(jsonData.data.affectedReturns).to.be.a('string');
});`));

content.push(heading("11.2 GET /admin/audit-trail - Audit Filtering", 2));
content.push(para("This test validates the audit trail retrieval endpoint with various filter combinations including event type, user ID, and date range. The test verifies pagination, event structure consistency, and that the ordering respects the specified sort parameters."));

content.push(heading("11.3 GET /admin/users - User Management", 2));
content.push(para("This test retrieves the user list and validates role-based filtering, status filtering, and pagination. The test verifies that all returned user objects contain the required fields and that sensitive data (passwords) is never exposed in the response."));

// ========== 12. TEST DATA MANAGEMENT ==========
content.push(heading("12. Test Data Management", 1));
content.push(para("Effective test data management is critical for maintaining reliable and repeatable test runs. This section describes the test data strategy including data factory patterns, cleanup procedures, and data isolation mechanisms used in the Kontakt Home RMS Postman collection."));

content.push(heading("12.1 Test Data Factory", 2));
content.push(para("The collection uses a centralized test data factory pattern implemented in a pre-request script at the collection level. This factory generates unique test data for each run using timestamp-based identifiers to prevent data collisions between parallel test executions. The factory provides methods for creating test orders, products, customers, and return requests with realistic data."));

content.push(heading("Test Data Factory Script", 3));
content.push(...codeBlock(`// Collection-level Pre-request Script: Test Data Factory
const timestamp = Date.now();

// Generate unique identifiers for this test run
pm.collectionVariables.set('test_timestamp', timestamp);
pm.collectionVariables.set('unique_order_id', 'ORD-' + timestamp);
pm.collectionVariables.set('unique_serial', 'SN-TEST-' + timestamp);
pm.collectionVariables.set('unique_email', 'test-' + timestamp + '@kontakthome.az');

// Create reusable test data objects
const testDataFactory = {
    validReturnItem: () => ({
        orderItemId: 'OI-' + timestamp,
        productSku: 'ELK-SMRT-TV-055',
        productName: 'Samsung 55" Smart TV',
        serialNumber: 'SN-TEST-' + timestamp,
        returnReason: 'DEFECTIVE',
        reasonDescription: 'Automated test - Postman test data factory',
        productCondition: 'GOOD',
        purchasePrice: 1299.00
    }),
    validCreateReturnRequest: () => ({
        orderId: pm.collectionVariables.get('unique_order_id'),
        customerEmail: pm.collectionVariables.get('unique_email'),
        items: [testDataFactory.validReturnItem()],
        preferredResolution: 'REFUND',
        customerNotes: 'Automated test - Postman collection run ' + timestamp
    })
};

// Store factory in globals for use in individual requests
pm.globals.set('testDataFactory', JSON.stringify(testDataFactory));
console.log('Test data factory initialized for run:', timestamp);`));

content.push(heading("12.2 Test Data Cleanup", 2));
content.push(para("A dedicated cleanup request runs after each test collection execution to remove test data from the system. The cleanup script identifies all test records created during the run (using the unique timestamp prefix) and deletes them in reverse dependency order: refund records first, then inspection records, then receiving records, then return requests, and finally customer records. In environments where deletion is not permitted, the cleanup script tags records with a TEST_DATA flag for periodic bulk cleanup."));

// ========== 13. NEGATIVE & EDGE CASES ==========
content.push(heading("13. Negative and Edge Case Testing", 1));
content.push(para("Negative testing is essential for validating the robustness of error handling across all API endpoints. This section describes the comprehensive negative test cases that verify the system's behavior when subjected to invalid inputs, boundary conditions, and unexpected usage patterns. Each negative test validates both the HTTP status code and the error response structure to ensure consistency and security."));

content.push(heading("13.1 Authentication Negative Tests", 2));
content.push(createTable(
  ["Test Case", "Input", "Expected Status", "Expected Error Code"],
  [
    ["Empty credentials", '{"email":"","password":""}', "400 Bad Request", "VALIDATION_ERROR"],
    ["Missing email field", '{"password":"test"}', "400 Bad Request", "VALIDATION_ERROR"],
    ["Invalid email format", '{"email":"not-email","password":"Test123"}', "400 Bad Request", "VALIDATION_ERROR"],
    ["Short password", '{"email":"a@b.com","password":"Ab1"}', "400 Bad Request", "VALIDATION_ERROR"],
    ["SQL injection in email", '{"email":"a@b.com; DROP TABLE--","password":"Test1234"}', "400 Bad Request", "VALIDATION_ERROR"],
    ["Empty refresh token", '{"refreshToken":""}', "401 Unauthorized", "INVALID_TOKEN"],
    ["Malformed JWT as token", '{"refreshToken":"not.a.jwt"}', "401 Unauthorized", "INVALID_TOKEN"],
    ["Expired access token", "Authorization: Bearer expired_token", "401 Unauthorized", "TOKEN_EXPIRED"],
  ]
));

content.push(heading("13.2 Return Request Negative Tests", 2));
content.push(createTable(
  ["Test Case", "Input", "Expected Status", "Description"],
  [
    ["Missing required fields", '{"orderId":"ORD-001"}', "422 Unprocessable", "Missing items and email"],
    ["Invalid order ID format", '{"orderId":"INVALID","customerEmail":"a@b.com","items":[]}', "400 Bad Request", "Pattern mismatch"],
    ["Empty items array", '{"orderId":"ORD-2026-48721","customerEmail":"a@b.com","items":[]}', "422 Unprocessable", "minItems: 1 violated"],
    ["Too many items (11)", "Request with 11 items", "422 Unprocessable", "maxItems: 10 violated"],
    ["Invalid return reason", '{"returnReason":"INVALID_REASON"}', "422 Unprocessable", "Enum violation"],
    ["Negative purchase price", '{"purchasePrice": -100}', "422 Unprocessable", "minimum: 0 violated"],
    ["Non-existent RMA number", "GET /returns/RMA-9999-999999", "404 Not Found", "Resource not found"],
    ["Invalid status transition", "PATCH with status COMPLETED from SUBMITTED", "422 Unprocessable", "State machine violation"],
    ["Cancel after receipt", "POST cancel for RECEIVED return", "409 Conflict", "Cannot cancel received"],
    ["XSS in customer notes", '{"customerNotes":"<script>alert(1)</script>"}', "200 OK", "Input sanitized/stored safely"],
  ]
));

content.push(heading("13.3 Validation Negative Tests", 2));
content.push(createTable(
  ["Test Case", "Input", "Expected Status", "Description"],
  [
    ["Expired return window", "purchaseDate 60 days ago", "200 OK", "eligible: false"],
    ["Non-returnable category", "productSku: CLEARANCE-ITEM", "200 OK", "eligible: false"],
    ["Excessive return history", "Customer with 6+ returns", "200 OK", "eligible: false"],
    ["Expired warranty", "Product outside warranty", "200 OK", "eligible: false"],
    ["Missing required fields", '{"orderId":"ORD-001"}', "400 Bad Request", "Validation error"],
  ]
));

content.push(heading("13.4 Edge Case Tests", 2));
content.push(createTable(
  ["Test Case", "Description", "Expected Behavior"],
  [
    ["Unicode in names", "Customer name with Azerbaijani characters", "Correctly stored and retrieved"],
    ["Maximum field lengths", "customerNotes with 1000 characters", "Accepted at boundary"],
    ["Exceed max field length", "customerNotes with 1001 characters", "422 validation error"],
    ["Pagination boundary", "pageSize=100 (maximum)", "Returns up to 100 items"],
    ["Pagination exceed", "pageSize=101 (over maximum)", "400 validation error"],
    ["Decimal precision", "purchasePrice with 3 decimal places", "Rounded to 2 places"],
    ["Concurrent requests", "Multiple creates with same order", "409 conflict on duplicates"],
    ["Large request payload", "Request with 10 items and 5 photos each", "Accepted within timeout"],
  ]
));

// ========== 14. PERFORMANCE & LOAD TESTING ==========
content.push(heading("14. Performance and Load Testing", 1));
content.push(para("Performance testing establishes baseline response time metrics for each endpoint and validates that the API meets the defined SLA requirements. The Postman collection includes performance assertions in every test request, and a dedicated performance testing runner script using Newman is provided for more rigorous load testing scenarios."));

content.push(heading("14.1 Response Time Baselines", 2));
content.push(para("The following table defines the target response time baselines for each endpoint category. These baselines are used as assertions in the Postman collection and as benchmarks in the Newman performance test runner. Baselines are defined at the 95th percentile to account for occasional network variations."));
content.push(createTable(
  ["Endpoint Category", "P50 Target", "P95 Target", "P99 Target", "Timeout"],
  [
    ["Authentication (Login)", "200ms", "500ms", "1000ms", "5000ms"],
    ["Create Return", "500ms", "2000ms", "3000ms", "10000ms"],
    ["Get Return Details", "200ms", "500ms", "1000ms", "5000ms"],
    ["List Returns", "300ms", "1000ms", "2000ms", "5000ms"],
    ["Validation Check", "300ms", "1000ms", "2000ms", "5000ms"],
    ["Warehouse Operations", "500ms", "2000ms", "3000ms", "10000ms"],
    ["Refund Calculate", "300ms", "1000ms", "2000ms", "5000ms"],
    ["Refund Process", "1000ms", "3000ms", "5000ms", "15000ms"],
    ["Notification History", "200ms", "500ms", "1000ms", "5000ms"],
    ["Analytics Dashboard", "1000ms", "3000ms", "5000ms", "10000ms"],
    ["Report Export", "500ms", "2000ms", "3000ms", "10000ms"],
    ["Admin Operations", "300ms", "1000ms", "2000ms", "5000ms"],
  ]
));

content.push(heading("14.2 Newman Performance Runner", 2));
content.push(para("The following Newman CLI command executes the full collection with performance reporting enabled, including response time histograms, assertions by category, and a summary report. This script is designed to be run from CI/CD pipelines or manually from the command line for ad-hoc performance testing."));
content.push(...codeBlock(`# Newman Performance Test Runner
# Run with response time tracking and HTML report
newman run kontakt-home-rms-collection.json \\
  --environment kontakt-home-staging.json \\
  --iteration-count 50 \\
  --reporters cli,json,html \\
  --reporter-json-export performance-results.json \\
  --reporter-html-export performance-report.html \\
  --delay-request 100 \\
  --timeout-request 15000

# For load testing with concurrent runners
# Install: npm install -g loadtest
# Then use the API base URL with loadtest for concurrent requests:
loadtest -c 10 -n 500 -k \\
  -H "Authorization: Bearer $TOKEN" \\
  https://api-staging.kontakthome.az/api/v1/returns \\
  --reporter-loadtest-html loadtest-report.html`));

content.push(heading("14.3 Performance Test Assertions", 2));
content.push(para("In addition to per-request response time assertions, the collection includes a post-run script that aggregates performance data across all iterations and generates a performance summary. This script checks for performance degradation compared to established baselines and flags any endpoints that exceed their P95 thresholds."));
content.push(...codeBlock(`// Collection-level Test Script: Performance Summary
const executions = pm.info.executions || [];
const responseTimes = {};

executions.forEach(exec => {
    const name = exec.item.name;
    const time = exec.response.responseTime;
    if (!responseTimes[name]) responseTimes[name] = [];
    responseTimes[name].push(time);
});

console.log('\\n=== PERFORMANCE SUMMARY ===');
Object.entries(responseTimes).forEach(([name, times]) => {
    times.sort((a, b) => a - b);
    const p50 = times[Math.floor(times.length * 0.5)];
    const p95 = times[Math.floor(times.length * 0.95)];
    const avg = times.reduce((s, t) => s + t, 0) / times.length;
    console.log(\`\${name}: P50=\${p50}ms P95=\${p95}ms Avg=\${avg}ms (n=\${times.length})\`);
});`));

// ========== 15. SECURITY TESTING ==========
content.push(heading("15. Security Testing", 1));
content.push(para("The security testing suite validates the API's protection against common web application vulnerabilities and ensures proper enforcement of authentication, authorization, and input validation mechanisms. These tests are critical for maintaining the security posture of the system, particularly given that the API handles customer personal data and financial transactions."));

content.push(heading("15.1 Authentication Security Tests", 2));
content.push(createTable(
  ["Test ID", "Test Name", "Method", "Description", "Pass Criteria"],
  [
    ["SEC-001", "No auth token", "GET", "Request without Authorization header", "401 Unauthorized"],
    ["SEC-002", "Invalid token format", "GET", "Malformed JWT token", "401 Unauthorized"],
    ["SEC-003", "Expired token", "GET", "Token with expired exp claim", "401 TOKEN_EXPIRED"],
    ["SEC-004", "Token with wrong audience", "GET", "JWT with incorrect aud claim", "401 Unauthorized"],
    ["SEC-005", "Token with wrong issuer", "GET", "JWT with incorrect iss claim", "401 Unauthorized"],
    ["SEC-006", "Tampered token", "GET", "Modified token payload", "401 Unauthorized"],
    ["SEC-007", "Customer accesses admin", "GET", "Customer role calls admin endpoint", "403 Forbidden"],
    ["SEC-008", "Agent accesses warehouse", "POST", "Agent calls warehouse receive", "403 Forbidden"],
  ]
));

content.push(heading("15.2 RBAC Enforcement Matrix", 2));
content.push(para("The following matrix documents the expected access control behavior for each endpoint group and user role. Each cell indicates whether the role should receive a 200 OK response (Access) or a 403 Forbidden response (Denied) when calling endpoints in that group. The security test suite automatically verifies each cell in this matrix."));
content.push(createTable(
  ["Endpoint Group", "Customer", "Agent", "Warehouse", "Manager", "Admin"],
  [
    ["POST /auth/login", "Access", "Access", "Access", "Access", "Access"],
    ["POST /returns", "Access", "Access", "Denied", "Access", "Access"],
    ["GET /returns (all)", "Denied", "Access", "Denied", "Access", "Access"],
    ["PATCH /returns/{id}/status", "Denied", "Access", "Access", "Access", "Access"],
    ["POST /warehouse/receive", "Denied", "Denied", "Access", "Access", "Access"],
    ["POST /warehouse/inspect", "Denied", "Denied", "Access", "Access", "Access"],
    ["POST /refunds/process", "Denied", "Denied", "Denied", "Access", "Access"],
    ["GET /analytics/dashboard", "Denied", "Denied", "Denied", "Access", "Access"],
    ["PUT /admin/policies/*", "Denied", "Denied", "Denied", "Denied", "Access"],
    ["GET /admin/users", "Denied", "Denied", "Denied", "Access", "Access"],
  ]
));

content.push(heading("15.3 Input Validation Security Tests", 2));
content.push(para("These tests verify that the API properly validates and sanitizes all user input to prevent injection attacks and other input-based vulnerabilities. Each test sends a malicious payload and verifies that it is either rejected with an appropriate error response or safely handled without introducing a vulnerability."));
content.push(createTable(
  ["Test ID", "Vulnerability", "Payload", "Target Endpoint", "Expected Result"],
  [
    ["INJ-001", "SQL Injection", "email: ' OR 1=1 --", "POST /auth/login", "400 Bad Request"],
    ["INJ-002", "NoSQL Injection", "email: {$ne: ''}", "POST /auth/login", "400 Bad Request"],
    ["INJ-003", "XSS (Stored)", "notes: <script>alert('xss')</script>", "POST /returns", "200 OK (sanitized)"],
    ["INJ-004", "Path Traversal", "rmaNumber: ../../../etc/passwd", "GET /returns/{id}", "404 Not Found"],
    ["INJ-005", "Command Injection", "orderId: ORD-001; ls -la", "POST /returns", "422 Validation Error"],
    ["INJ-006", "XML External Entity", "Content-Type: text/xml + XXE payload", "Any endpoint", "415 Unsupported"],
    ["INJ-007", "Prototype Pollution", '{"__proto__":{"admin":true}}', "Any POST", "400 Bad Request"],
    ["INJ-008", "Mass Assignment", '{"role":"ADMIN","email":"test@test.com"}', "PATCH /returns/{id}", "403 or ignored"],
  ]
));

content.push(heading("15.4 Rate Limiting Tests", 2));
content.push(para("The following tests verify that rate limiting is correctly enforced for each user role tier. The test sends requests at a rate exceeding the defined limit and verifies that a 429 Too Many Requests response is returned with the correct Retry-After header."));
content.push(createTable(
  ["Role", "Rate Limit", "Test Method", "Expected Result"],
  [
    ["Customer", "100 req/min", "Send 110 requests in 60 seconds", "429 after ~100 requests"],
    ["Support Agent", "300 req/min", "Send 310 requests in 60 seconds", "429 after ~300 requests"],
    ["Manager/Admin", "500 req/min", "Send 510 requests in 60 seconds", "429 after ~500 requests"],
    ["Unauthenticated", "20 req/min", "Send 25 requests without token", "429 after ~20 requests"],
  ]
));

// ========== 16. MOCK SERVER ==========
content.push(heading("16. Mock Server Configuration", 1));
content.push(para("Postman Mock Servers enable frontend development and testing to proceed independently from backend API implementation. This section describes the mock server configuration for the Kontakt Home RMS API, including example responses for all 24 endpoints, custom response rules for testing different scenarios, and the mock server URL structure for use in development environments."));

content.push(heading("16.1 Mock Server Setup", 2));
content.push(para("The mock server is configured with the following settings to simulate the production API behavior as closely as possible. Mock responses include realistic data, proper HTTP status codes, and configurable headers that match the actual API responses documented in the OpenAPI 3.0 specification."));
content.push(createTable(
  ["Setting", "Value"],
  [
    ["Mock Server Name", "Kontakt Home RMS Mock"],
    ["Base URL", "https://mock.pstmn.io/Kontakt-Home-RMS"],
    ["Default Latency", "200-500ms (randomized)"],
    ["Stateful Responses", "Enabled (remembers created returns)"],
    ["Error Simulation", "Configurable via query parameter ?_error=code"],
  ]
));

content.push(heading("16.2 Mock Response Examples", 2));
content.push(para("Each endpoint has a primary mock response that matches the documented schema exactly. Additionally, alternative mock responses are configured for common error scenarios, allowing testers to develop and test error handling logic without needing to trigger actual error conditions. The following table lists the mock response configurations for key endpoints."));
content.push(createTable(
  ["Endpoint", "Response Name", "Status", "Trigger Condition"],
  [
    ["POST /auth/login", "Success", "200", "Valid credentials"],
    ["POST /auth/login", "Invalid Credentials", "401", "email: wrong@test.com"],
    ["POST /auth/login", "Account Locked", "423", "email: locked@test.com"],
    ["POST /returns", "Approved", "201", "Valid return request"],
    ["POST /returns", "Rejected - Window", "422", "purchaseDate > 14 days ago"],
    ["POST /returns", "Rejected - Category", "422", "productSku: CLEARANCE-*"],
    ["POST /warehouse/inspect", "Grade A - Auto Approve", "200", "conditionGrade: A"],
    ["POST /warehouse/inspect", "Grade C - Manager Review", "200", "conditionGrade: C"],
    ["POST /refunds/process", "ERP Success", "201", "Default"],
    ["POST /refunds/process", "ERP Unavailable", "502", "?_error=502"],
    ["GET /returns", "Empty List", "200", "status: NON_EXISTENT"],
    ["GET /returns/{id}", "Not Found", "404", "RMA-0000-000000"],
  ]
));

content.push(heading("16.3 Mock Server Integration in Tests", 2));
content.push(para("To enable mock server responses during testing, the environment variable mock_enabled can be set to true. When enabled, a pre-request script intercepts the base_url variable and redirects all requests to the mock server URL while preserving the path structure. This allows the same test scripts to run against either the real API or the mock without any modifications."));
content.push(...codeBlock(`// Pre-request Script: Mock Server Redirect
if (pm.environment.get('mock_enabled') === 'true') {
    const mockBaseUrl = 'https://mock.pstmn.io/Kontakt-Home-RMS';
    pm.request.url = pm.request.url.replace(
        pm.variables.get('base_url'),
        mockBaseUrl
    );
    console.log('Redirected to mock server:', pm.request.url);
}`));

// ========== 17. CI/CD INTEGRATION ==========
content.push(heading("17. CI/CD Pipeline Integration", 1));
content.push(para("Automated API testing within the CI/CD pipeline ensures that every code change is validated against the full test suite before deployment. This section provides the complete configuration for integrating the Postman collection into the software delivery pipeline using GitHub Actions, including Newman execution, report generation, test result artifacts, and quality gate thresholds."));

content.push(heading("17.1 Newman CLI Installation", 2));
content.push(para("Newman is Postman's command-line collection runner that enables headless execution of Postman collections. It is installed as an npm package and supports all Postman features including environments, variables, data files, reporters, and response time tracking."));
content.push(...codeBlock(`# Install Newman globally
npm install -g newman

# Install Newman HTML reporter (for visual reports)
npm install -g newman-reporter-htmlextra

# Verify installation
newman --version`));

content.push(heading("17.2 GitHub Actions Workflow", 2));
content.push(para("The following GitHub Actions workflow file defines the complete CI/CD pipeline for API testing. The workflow triggers on pull requests and pushes to the main branch, runs the Newman test suite against the staging environment, generates HTML and JSON reports, uploads artifacts, and enforces quality gate thresholds."));
content.push(...codeBlock(`# .github/workflows/api-tests.yml
name: RMS API Tests

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main]
  schedule:
    - cron: '0 6 * * 1-5'  # Weekdays at 6 AM

jobs:
  api-testing:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Newman
        run: |
          npm install -g newman
          npm install -g newman-reporter-htmlextra

      - name: Run API Tests (Staging)
        run: |
          newman run kontakt-home-rms-collection.json \\
            --environment staging-environment.json \\
            --reporters cli,htmlextra,json \\
            --reporter-htmlextra-export reports/newman-report.html \\
            --reporter-json-export reports/newman-results.json \\
            --insecure \\
            --color on
        continue-on-error: false

      - name: Upload Test Report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: api-test-report
          path: reports/
          retention-days: 30

      - name: Quality Gate Check
        run: |
          RESULTS=$(cat reports/newman-results.json)
          TOTAL=$(echo $RESULTS | jq '.run.stats.assertions.total')
          FAILED=$(echo $RESULTS | jq '.run.stats.assertions.failed')

          echo "Total assertions: $TOTAL"
          echo "Failed assertions: $FAILED"

          # Fail pipeline if any assertion failed
          if [ "$FAILED" -gt 0 ]; then
            echo "::error::$FAILED of $TOTAL assertions failed"
            exit 1
          fi

          echo "All $TOTAL assertions passed successfully"`));

content.push(heading("17.3 Test Execution Strategy", 2));
content.push(para("The CI/CD pipeline executes API tests in three phases to balance execution speed with thoroughness. The first phase runs the critical path tests (authentication, return creation, refund processing) as a fast feedback loop. The second phase runs the full collection including negative and security tests. The third phase runs the performance baseline tests to detect regressions."));
content.push(createTable(
  ["Phase", "Tests", "Duration", "When", "Blocking"],
  [
    ["1. Smoke Tests", "Auth + 5 core endpoints", "~30 seconds", "Every PR", "Yes - blocks merge"],
    ["2. Full Suite", "All 24 endpoints + negatives", "~3 minutes", "Every PR to main", "Yes - blocks deploy"],
    ["3. Performance", "50 iterations of critical path", "~5 minutes", "Nightly + pre-release", "Warning only"],
    ["4. Security Scan", "RBAC + injection + rate limits", "~2 minutes", "Weekly + pre-release", "Yes - blocks release"],
  ]
));

content.push(heading("17.4 Slack Notification Integration", 2));
content.push(para("Test results are automatically posted to the development Slack channel with a summary including pass/fail status, response time trends, and direct links to the detailed HTML report. This ensures the team has immediate visibility into the health of the API without needing to check the CI/CD dashboard manually."));
content.push(...codeBlock(`# Slack notification step (add to GitHub Actions)
- name: Notify Slack
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: \${{ job.status }}
    fields: repo,message,commit,author
    text: |
      *API Test Results: \${{ job.status }}*
      Environment: Staging
      Assertions: \${{ steps.results.outputs.total }} total, \${{ steps.results.outputs.failed }} failed
      Avg Response Time: \${{ steps.results.outputs.avg_time }}ms
      Report: \${{ steps.results.outputs.report_url }}
  env:
    SLACK_WEBHOOK_URL: \${{ secrets.SLACK_WEBHOOK_URL }}`));

// ========== 18. TEST REPORTING ==========
content.push(heading("18. Test Reporting and Coverage", 1));
content.push(para("Comprehensive test reporting provides visibility into the quality and coverage of the API test suite. This section describes the reporting mechanisms, coverage metrics, and dashboards used to track testing effectiveness and communicate results to stakeholders."));

content.push(heading("18.1 Report Types", 2));
content.push(createTable(
  ["Report", "Format", "Generated By", "Audience", "Frequency"],
  [
    ["Newman CLI Summary", "Console", "Newman", "Developers", "Every run"],
    ["HTML Detailed Report", "HTML", "htmlextra reporter", "QA Team", "Every run"],
    ["JSON Machine-Readable", "JSON", "Newman", "CI/CD Pipeline", "Every run"],
    ["JUNIT XML", "XML", "Newman", "Test Management Tools", "Every run"],
    ["Trend Analysis Report", "HTML", "Custom script", "QA Lead", "Weekly"],
    ["Executive Summary", "PDF", "Custom script", "Management", "Monthly"],
  ]
));

content.push(heading("18.2 Coverage Matrix", 2));
content.push(para("The coverage matrix tracks the mapping between API endpoints, test types, and test cases. This matrix ensures complete coverage across all testing dimensions and identifies any gaps that need to be addressed. The following table shows the test coverage for each endpoint group."));
content.push(createTable(
  ["Endpoint Group", "Endpoints", "Positive Tests", "Negative Tests", "Security Tests", "Coverage"],
  [
    ["Authentication", "3", "3", "5", "3", "100%"],
    ["Return Requests", "5", "5", "8", "2", "100%"],
    ["Validation Engine", "2", "2", "4", "1", "100%"],
    ["Warehouse Operations", "3", "3", "3", "1", "100%"],
    ["Refund Processing", "3", "3", "4", "1", "100%"],
    ["Notifications", "2", "2", "2", "0", "100%"],
    ["Analytics", "3", "3", "3", "1", "100%"],
    ["Admin", "3", "3", "3", "2", "100%"],
    ["Total", "24", "24", "32", "11", "100%"],
  ]
));

content.push(heading("18.3 Coverage by Requirement Traceability", 2));
content.push(para("Each test case is traceable to one or more system requirements from the SRS document (REQ-101 through REQ-112). This traceability matrix ensures that all documented requirements are verified through automated testing and provides evidence for audit and compliance purposes. The following table shows the requirement-to-test mapping for critical requirements."));
content.push(createTable(
  ["Requirement", "Description", "Test Cases", "Status"],
  [
    ["REQ-101", "Customer self-service return submission", "POST /returns, POST /returns/validate", "Covered"],
    ["REQ-102", "Automated eligibility validation", "POST /returns/validate (eligible + ineligible)", "Covered"],
    ["REQ-103", "RMA number generation", "POST /returns (RMA format assertion)", "Covered"],
    ["REQ-104", "Warehouse barcode scanning", "POST /warehouse/receive", "Covered"],
    ["REQ-105", "Quality inspection grading", "POST /warehouse/inspect (Grade A/B/C/D)", "Covered"],
    ["REQ-106", "Automated refund calculation", "POST /refunds/calculate", "Covered"],
    ["REQ-107", "ERP financial integration", "POST /refunds/process, GET /refunds/{id}", "Covered"],
    ["REQ-108", "Multi-channel notifications", "GET /notifications/history, POST /notifications/send", "Covered"],
    ["REQ-109", "Management analytics dashboard", "GET /analytics/dashboard, /by-category", "Covered"],
    ["REQ-110", "Role-based access control", "SEC-007, SEC-008, RBAC Matrix", "Covered"],
    ["REQ-111", "Audit trail", "GET /admin/audit-trail", "Covered"],
    ["REQ-112", "Policy rule configuration", "PUT /admin/policies/rules/{id}", "Covered"],
  ]
));

// ========== 19. BEST PRACTICES ==========
content.push(heading("19. Best Practices and Standards", 1));
content.push(para("This section documents the coding standards, naming conventions, and organizational practices used throughout the Postman collection. Adherence to these standards ensures consistency across the test suite, makes tests easier to maintain and understand, and facilitates collaboration among team members."));

content.push(heading("19.1 Naming Conventions", 2));
content.push(createTable(
  ["Element", "Convention", "Example"],
  [
    ["Collection", "PascalCase with version", "Kontakt Home RMS API v1"],
    ["Folder", "PascalCase (business domain)", "Return Requests, Warehouse Operations"],
    ["Request", "METHOD /path - Description", "POST /returns - Create Return Request"],
    ["Environment", "kebab-case", "kontakt-home-dev, kontakt-home-staging"],
    ["Variable", "camelCase", "authToken, rmaNumber, refundId"],
    ["Test name", "Descriptive sentence", "Status code is 201 Created"],
  ]
));

content.push(heading("19.2 Test Script Standards", 2));
content.push(bullet("Always use pm.test() wrapper for every assertion to ensure proper reporting"));
content.push(bullet("Include descriptive test names that explain the expected behavior in plain English"));
content.push(bullet("Group related assertions within a single pm.test() block using multiple expect() calls"));
content.push(bullet("Log relevant information using console.log() for debugging during local development"));
content.push(bullet("Use meaningful error messages in expect() calls to identify failure root cause quickly"));
content.push(bullet("Store extracted variables immediately after the assertion that validates them"));
content.push(bullet("Handle both success and error response structures in every test script"));
content.push(bullet("Avoid hardcoded values where collection or environment variables should be used"));
content.push(bullet("Include response time assertions (pm.response.responseTime) in every request"));
content.push(bullet("Validate response headers (Content-Type, Cache-Control) for state-changing operations"));

content.push(heading("19.3 Collection Maintenance Guidelines", 2));
content.push(para("The Postman collection is a living artifact that must be maintained alongside the API it tests. The following guidelines ensure the collection remains accurate and effective over time. When the API is updated, the corresponding tests must be updated in the same pull request. New endpoints must include at minimum a positive test and one negative test before merging. Deprecated endpoints should be moved to an 'Archived' folder rather than deleted, preserving the test history. The collection version should be incremented following Semantic Versioning when significant changes are made."));

// ========== 20. APPENDIX ==========
content.push(heading("20. Appendix", 1));

content.push(heading("20.1 HTTP Status Code Reference", 2));
content.push(createTable(
  ["Code", "Name", "Usage in RMS API"],
  [
    ["200", "OK", "Successful GET, PUT, PATCH operations"],
    ["201", "Created", "Successful POST (create return, receive item, process refund)"],
    ["204", "No Content", "Successful DELETE operations"],
    ["400", "Bad Request", "Malformed JSON, missing required fields"],
    ["401", "Unauthorized", "Missing, invalid, or expired authentication token"],
    ["403", "Forbidden", "Insufficient role permissions for the operation"],
    ["404", "Not Found", "Invalid endpoint path or non-existent resource"],
    ["409", "Conflict", "Duplicate return, conflicting status update"],
    ["415", "Unsupported Media Type", "Invalid Content-Type header"],
    ["422", "Unprocessable Entity", "Business rule validation failure"],
    ["429", "Too Many Requests", "Rate limit exceeded"],
    ["500", "Internal Server Error", "Unexpected server-side failure"],
    ["502", "Bad Gateway", "ERP integration service unavailable"],
    ["503", "Service Unavailable", "System maintenance or temporary outage"],
  ]
));

content.push(heading("20.2 Error Response Schema", 2));
content.push(para("All error responses follow a consistent schema structure across all endpoints. This ensures that error handling logic can be standardized in client applications. The error response includes an error code, a human-readable message, a correlation ID for support tracing, and optional field-level validation errors."));
content.push(...codeBlock(`{\n  "error": {\n    "code": "VALIDATION_ERROR",\n    "message": "The request body contains invalid fields",\n    "details": [\n      {\n        "field": "items[0].returnReason",\n        "rule": "ENUM",\n        "message": "Must be one of: DEFECTIVE, WRONG_ITEM, NOT_AS_DESCRIBED, CHANGED_MIND, BETTER_PRICE_FOUND, DAMAGED_IN_TRANSIT, WARRANTY_CLAIM, OTHER"\n      }\n    ],\n    "correlationId": "corr-2026-04-26-abc123",\n    "timestamp": "2026-04-26T14:30:00Z",\n    "documentationUrl": "https://api-docs.kontakthome.az/errors/VALIDATION_ERROR"\n  }\n}`));

content.push(heading("20.3 Return Status State Machine", 2));
content.push(para("The following table documents all valid status transitions in the return request state machine. Status update tests validate that only these transitions are permitted and that all other transition attempts are rejected with a 422 Unprocessable Entity response."));
content.push(createTable(
  ["From Status", "Valid Transitions", "Triggered By"],
  [
    ["SUBMITTED", "APPROVED, REJECTED", "SYSTEM (automated validation)"],
    ["APPROVED", "RECEIVED, CANCELLED", "WAREHOUSE (scanning), CUSTOMER/AGENT"],
    ["REJECTED", "(terminal)", "No further transitions allowed"],
    ["RECEIVED", "INSPECTING", "WAREHOUSE (starts inspection)"],
    ["INSPECTING", "INSPECTION_COMPLETE", "WAREHOUSE (submits inspection)"],
    ["INSPECTION_COMPLETE", "REFUND_PENDING, REJECTED", "SYSTEM (auto) / MANAGER (escalation)"],
    ["REFUND_PENDING", "REFUND_PROCESSED", "SYSTEM (ERP confirms)"],
    ["REFUND_PROCESSED", "COMPLETED", "SYSTEM (auto-close after 24h)"],
    ["COMPLETED", "(terminal)", "No further transitions allowed"],
    ["CANCELLED", "(terminal)", "No further transitions allowed"],
  ]
));

content.push(heading("20.4 Postman Collection JSON Structure", 2));
content.push(para("The complete Postman collection is exported as a single JSON file that can be imported into any Postman client or executed via Newman. The collection file follows Postman's Collection v2.1 format and includes all requests, scripts, environments, and test configurations described in this document. The file should be version-controlled alongside the application source code to ensure tests and API remain synchronized."));
content.push(...codeBlock(`{\n  "info": {\n    "name": "Kontakt Home RMS API v1",\n    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"\n  },\n  "variable": [\n    { "key": "base_url", "value": "{{protocol}}://{{host}}{{basePath}}" },\n    { "key": "auth_token", "value": "" },\n    { "key": "rma_number", "value": "" },\n    { "key": "refund_id", "value": "" }\n  ],\n  "item": [\n    {\n      "name": "Authentication",\n      "item": [\n        {\n          "name": "POST /auth/login - Login",\n          "request": { "method": "POST", "url": "{{base_url}}/auth/login" },\n          "event": [{ "listen": "test", "script": { "exec": ["// test assertions..."] } }]\n        }\n      ]\n    },\n    {\n      "name": "Return Requests",\n      "item": [ "..." ]\n    }\n  ]\n}`));

content.push(heading("20.5 Glossary", 2));
content.push(createTable(
  ["Term", "Definition"],
  [
    ["Newman", "Postman's command-line collection runner for CI/CD integration"],
    ["Collection", "A group of related API requests organized in Postman"],
    ["Environment", "A set of variables defining the target API configuration"],
    ["Pre-request Script", "JavaScript executed before sending an API request"],
    ["Test Script", "JavaScript executed after receiving an API response"],
    ["Assertion", "A validation check that passes or fails based on response data"],
    ["Chaining", "Passing data from one response to subsequent requests via variables"],
    ["RBAC", "Role-Based Access Control - restricting API access by user role"],
    ["RMA", "Return Merchandise Authorization - unique identifier for a return"],
    ["Mock Server", "Postman service simulating API responses for development"],
    ["HATEOAS", "Hypermedia as the Engine of Application State (REST principle)"],
    ["SLA", "Service Level Agreement - defined performance thresholds"],
    ["P50/P95/P99", "Percentile measurements for response time distribution"],
    ["ERP", "Enterprise Resource Planning - financial system integration"],
  ]
));

// ========== BUILD DOCUMENT ==========
async function buildDocument() {
  const doc = new docx.Document({
    creator: "Zamir Jamalov",
    title: "Kontakt Home - Postman API Testing Specification",
    description: "Comprehensive Postman API testing specification for the Kontakt Home Return Management System",
    styles: {
      default: {
        document: { run: { font: "Calibri", size: 22, color: COLORS.dark } },
      },
    },
    numbering: {
      config: [],
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
          },
        },
        children: [...coverPage(), new docx.PageBreak(), ...content],
      },
    ],
  });

  const buffer = await docx.Packer.toBuffer(doc);
  const outputPath = "/home/z/my-project/ba-practice/Kontakt_Home_Postman_API_Testing_Return_Management_System.docx";
  fs.writeFileSync(outputPath, buffer);
  console.log("Document generated successfully:", outputPath);
  return outputPath;
}

buildDocument().catch(console.error);
