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
  return text.split("\n").map((line, idx) => new docx.Paragraph({
    children: [new docx.TextRun({ text: line || " ", size: 17, color: COLORS.dark, font: "Consolas" })],
    shading: { fill: COLORS.lightGray, type: "clear" },
    spacing: { before: idx === 0 ? 80 : 0, after: idx === text.split("\n").length - 1 ? 80 : 0, line: 228 },
    indent: { left: 200, right: 200 },
  }));
}

function methodTag(method) {
  const m = { GET: { c: "2E7D32", l: "GET" }, POST: { c: "1565C0", l: "POST" }, PUT: { c: "E65100", l: "PUT" }, DELETE: { c: "C62828", l: "DELETE" }, PATCH: { c: "6A1B9A", l: "PATCH" } };
  const t = m[method] || m.GET;
  return new docx.Paragraph({ children: [new docx.TextRun({ text: " " + t.l + " ", bold: true, size: 19, color: COLORS.white, font: "Calibri", shading: { fill: t.c, type: "background-color" } })], spacing: { after: 40 } });
}

function createTable(headers, rows) {
  const hr = new docx.TableRow({ children: headers.map(h => new docx.TableCell({ children: [new docx.Paragraph({ children: [new docx.TextRun({ text: h, bold: true, size: 19, color: COLORS.white, font: "Calibri" })] })], shading: { fill: COLORS.deepSea }, width: { size: Math.floor(9200 / headers.length), type: "dxa" } })) });
  const dr = rows.map((row, idx) => new docx.TableRow({ children: row.map((cell) => new docx.TableCell({ children: [new docx.Paragraph({ children: [new docx.TextRun({ text: String(cell), size: 19, color: COLORS.dark, font: "Calibri" })] })], shading: { fill: idx % 2 === 0 ? COLORS.light : COLORS.white }, width: { size: Math.floor(9200 / headers.length), type: "dxa" } })) }));
  return new docx.Table({ rows: [hr, ...dr], width: { size: 9200, type: "dxa" } });
}

function divider() { return new docx.Paragraph({ spacing: { before: 80, after: 80 }, children: [] }); }
function coloredPara(text, color) { return new docx.Paragraph({ children: [new docx.TextRun({ text, size: 22, color, font: "Calibri" })], spacing: { after: 120, line: 276 } }); }

// ========== OPENAPI FULL YAML ==========
const fullYaml = `openapi: 3.0.3
info:
  title: Kontakt Home Return Management System API
  description: |
    RESTful API specification for the Kontakt Home Return Management System (RMS).
    This API supports the complete product return lifecycle including customer
    self-service return submission, automated validation, warehouse inspection,
    refund processing, multi-channel notifications, and management analytics.

    ## Authentication
    All endpoints require JWT Bearer token authentication (except /auth/*).
    Tokens are obtained via POST /api/v1/auth/login.

    ## Rate Limiting
    - Customer: 100 req/min
    - Agent: 300 req/min
    - Manager/Admin: 500 req/min
  version: "1.0.0"
  contact:
    name: Kontakt Home IT Department
    email: api-support@kontakthome.az
  license:
    name: Proprietary
    url: https://www.kontakthome.az/legal/api-license

servers:
  - url: https://api.kontakthome.az/api/v1
    description: Production
  - url: https://api-staging.kontakthome.az/api/v1
    description: Staging
  - url: https://api-dev.kontakthome.az/api/v1
    description: Development

tags:
  - name: Authentication
    description: User login, token refresh, and logout
  - name: Return Requests
    description: Create, retrieve, list, and manage return requests
  - name: Validation
    description: Automated return eligibility validation engine
  - name: Warehouse
    description: Receiving, inspection, and disposition workflows
  - name: Refunds
    description: Refund calculation and ERP processing
  - name: Notifications
    description: Multi-channel customer notifications
  - name: Analytics
    description: Management dashboards and reporting
  - name: Admin
    description: Policy configuration, audit trail, user management

security:
  - BearerAuth: []

paths:
  # ===== AUTHENTICATION =====
  /auth/login:
    post:
      tags: [Authentication]
      summary: Authenticate user
      description: |
        Authenticates a user with email and password credentials.
        Returns JWT access token (15 min) and refresh token (7 days).
      operationId: authLogin
      security: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LoginRequest'
            example:
              email: agent@kontakthome.az
              password: "SecureP@ssw0rd!"
      responses:
        '200':
          description: Authentication successful
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/LoginResponse'
        '401':
          description: Invalid credentials
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

  /auth/refresh:
    post:
      tags: [Authentication]
      summary: Refresh access token
      description: |
        Exchanges a valid refresh token for a new access token pair.
        The old refresh token is invalidated upon use (token rotation).
      operationId: authRefresh
      security: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/RefreshRequest'
      responses:
        '200':
          description: Token refreshed successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TokenResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'

  /auth/logout:
    post:
      tags: [Authentication]
      summary: Logout user
      description: Invalidates refresh token and terminates active sessions.
      operationId: authLogout
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [refreshToken]
              properties:
                refreshToken:
                  type: string
      responses:
        '200':
          description: Logged out successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SuccessMessage'

  # ===== RETURN REQUESTS =====
  /returns:
    post:
      tags: [Return Requests]
      summary: Create return request
      description: |
        Creates a new return request with automatic validation.
        System checks eligibility, generates RMA number, creates
        shipping label. Customer receives email and SMS confirmation.
      operationId: createReturn
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateReturnRequest'
            example:
              orderId: "ORD-2026-48721"
              customerEmail: "customer@email.com"
              items:
                - orderItemId: "OI-10482"
                  productSku: "ELK-SMRT-TV-055"
                  productName: 'Samsung 55" Smart TV'
                  serialNumber: "SN-SMRT-2026-78432"
                  returnReason: DEFECTIVE
                  reasonDescription: "Screen flickers intermittently"
                  productCondition: GOOD
                  purchasePrice: 1299.00
              preferredResolution: REFUND
              customerNotes: "Problem started 3 days after purchase"
      responses:
        '201':
          description: Return request created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ReturnResponse'
        '422':
          description: Validation failed
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ValidationError'
    get:
      tags: [Return Requests]
      summary: List return requests
      description: |
        Lists returns with filtering, sorting, and pagination.
        Supports status, date range, customer, category, and reason filters.
      operationId: listReturns
      parameters:
        - $ref: '#/components/parameters/StatusFilter'
        - $ref: '#/components/parameters/FromDate'
        - $ref: '#/components/parameters/ToDate'
        - $ref: '#/components/parameters/CustomerEmailFilter'
        - $ref: '#/components/parameters/ProductCategoryFilter'
        - $ref: '#/components/parameters/ReturnReasonFilter'
        - $ref: '#/components/parameters/SortBy'
        - $ref: '#/components/parameters/SortOrder'
        - $ref: '#/components/parameters/Page'
        - $ref: '#/components/parameters/PageSize'
      responses:
        '200':
          description: List of return requests
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ReturnListResponse'

  /returns/{rmaNumber}:
    get:
      tags: [Return Requests]
      summary: Get return details
      description: |
        Retrieves complete return details including status timeline,
        item information, validation results, inspection data,
        and refund information.
      operationId: getReturn
      parameters:
        - $ref: '#/components/parameters/RmaNumber'
      responses:
        '200':
          description: Return details retrieved
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ReturnDetailResponse'
        '404':
          $ref: '#/components/responses/NotFound'

  /returns/validate:
    post:
      tags: [Validation]
      summary: Pre-submission eligibility check
      description: |
        Validates return eligibility without creating a request.
        Returns detailed rule-by-rule evaluation results.
        Used by customer portal for instant eligibility feedback.
      operationId: validateReturn
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ValidateRequest'
            example:
              orderId: "ORD-2026-48721"
              productSku: "ELK-SMRT-TV-055"
              purchaseDate: "2026-04-12"
              customerEmail: "customer@email.com"
      responses:
        '200':
          description: Validation results
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ValidationResponse'

  /returns/{rmaNumber}/status:
    patch:
      tags: [Return Requests]
      summary: Update return status
      description: |
        Updates return status following the state machine rules.
        Triggers notifications and downstream actions automatically.
      operationId: updateReturnStatus
      parameters:
        - $ref: '#/components/parameters/RmaNumber'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/StatusUpdateRequest'
            example:
              status: INSPECTION_COMPLETE
              conditionGrade: B
              disposition: RESTOCK
              inspectionNotes: "Minor scratch on bezel. Fully functional."
              inspectorId: "USR-WH-003"
      responses:
        '200':
          description: Status updated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/StatusUpdateResponse'
        '422':
          description: Invalid status transition
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

  /returns/{rmaNumber}/cancel:
    post:
      tags: [Return Requests]
      summary: Cancel return request
      description: |
        Cancels an active return request. Only allowed before
        warehouse receiving (SUBMITTED/APPROVED statuses).
      operationId: cancelReturn
      parameters:
        - $ref: '#/components/parameters/RmaNumber'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CancelRequest'
      responses:
        '200':
          description: Return cancelled
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CancelResponse'
        '409':
          description: Cannot cancel (item already received)
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

  # ===== WAREHOUSE =====
  /warehouse/receive:
    post:
      tags: [Warehouse]
      summary: Record item receipt
      description: |
        Records warehouse receipt by scanning RMA barcode.
        Verifies expected item details, creates receiving record,
        and initiates inspection workflow.
      operationId: receiveItem
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ReceiveRequest'
            example:
              rmaNumber: "RMA-2026-000047"
              receivedBy: "USR-WH-003"
              receivingLocation: "BAKU-WH-01"
              carrierName: AZERPOST
              trackingNumber: "AZ-2026-98432"
              packageCondition: GOOD
              notes: "Package arrived intact."
      responses:
        '201':
          description: Item received
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ReceiveResponse'

  /warehouse/inspect:
    post:
      tags: [Warehouse]
      summary: Submit inspection result
      description: |
        Records quality inspection with condition grade (A/B/C/D),
        photo evidence, and disposition decision. Auto-approves
        refunds for Grade A/B, routes Grade C/D to manager.
      operationId: inspectItem
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/InspectionRequest'
            example:
              rmaNumber: "RMA-2026-000047"
              inspectionResult:
                conditionGrade: B
                gradingCriteria:
                  packaging: INTACT
                  accessories: COMPLETE
                  cosmeticCondition: MINOR_MARKS
                  functionalTest: PASSED
                disposition: RESTOCK
                dispositionNotes: "Minor scratch. Fully functional."
                inspectorId: "USR-WH-003"
                inspectionDuration: 12
      responses:
        '200':
          description: Inspection recorded
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/InspectionResponse'

  /warehouse/queue:
    get:
      tags: [Warehouse]
      summary: Get inspection queue
      description: |
        Retrieves warehouse work queue with items pending inspection.
        Sorted by receiving time (FIFO) with SLA countdown timers.
      operationId: getWarehouseQueue
      responses:
        '200':
          description: Inspection queue retrieved
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/WarehouseQueueResponse'

  # ===== REFUNDS =====
  /refunds/calculate:
    post:
      tags: [Refunds]
      summary: Calculate refund amount
      description: |
        Calculates refund based on condition grade, policy rules,
        and payment method. Returns detailed breakdown including
        alternatives such as store credit with bonus.
      operationId: calculateRefund
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/RefundCalculationRequest'
            example:
              rmaNumber: "RMA-2026-000047"
              originalAmount: 1299.00
              conditionGrade: B
              returnReason: DEFECTIVE
              originalPaymentMethod: CREDIT_CARD
      responses:
        '200':
          description: Refund calculation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/RefundCalculationResponse'

  /refunds/process:
    post:
      tags: [Refunds]
      summary: Process refund
      description: |
        Submits refund to ERP financial module for execution.
        Grade A/B auto-approved, Grade C/D requires manager approval.
      operationId: processRefund
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ProcessRefundRequest'
            example:
              rmaNumber: "RMA-2026-000047"
              refundMethod: CREDIT_CARD
              processedBy: "USR-FN-001"
              notes: "Auto-approved Grade B refund."
      responses:
        '201':
          description: Refund submitted to ERP
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProcessRefundResponse'

  /refunds/{refundId}:
    get:
      tags: [Refunds]
      summary: Get refund details
      description: |
        Retrieves refund status, ERP integration status,
        processing timeline, and notification history.
      operationId: getRefund
      parameters:
        - name: refundId
          in: path
          required: true
          schema:
            type: string
            pattern: '^REF-\\\\d{4}-\\\\d{6}$'
          description: Unique refund identifier
      responses:
        '200':
          description: Refund details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/RefundDetailResponse'

  # ===== NOTIFICATIONS =====
  /notifications/{rmaNumber}/history:
    get:
      tags: [Notifications]
      summary: Get notification history
      description: |
        Retrieves all notifications sent for a return request
        across email and SMS channels with delivery status.
      operationId: getNotificationHistory
      parameters:
        - $ref: '#/components/parameters/RmaNumber'
      responses:
        '200':
          description: Notification history
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/NotificationHistoryResponse'

  /notifications/send:
    post:
      tags: [Notifications]
      summary: Send manual notification
      description: |
        Manually triggers a notification. Used by agents to send
        custom notifications or re-send failed ones.
      operationId: sendNotification
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/SendNotificationRequest'
            example:
              rmaNumber: "RMA-2026-000047"
              channel: EMAIL
              templateId: "TPL-CUSTOM-UPDATE"
              customMessage: "Your return is being inspected."
              sendCopyToAgent: true
      responses:
        '201':
          description: Notification queued
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SendNotificationResponse'

  # ===== ANALYTICS =====
  /analytics/dashboard:
    get:
      tags: [Analytics]
      summary: Get management dashboard
      description: |
        Retrieves KPIs, trends, top return reasons, and alerts.
        Data refreshed every 15 minutes. Manager/Admin access only.
      operationId: getDashboard
      responses:
        '200':
          description: Dashboard data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/DashboardResponse'

  /analytics/returns/by-category:
    get:
      tags: [Analytics]
      summary: Category analytics
      description: |
        Return volume, refund amounts, and metrics by product category
        with date range filtering and comparison periods.
      operationId: getCategoryAnalytics
      parameters:
        - $ref: '#/components/parameters/FromDate'
        - $ref: '#/components/parameters/ToDate'
      responses:
        '200':
          description: Category analytics
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CategoryAnalyticsResponse'

  /analytics/reports/export:
    get:
      tags: [Analytics]
      summary: Export report
      description: |
        Generates analytics report in PDF or Excel format.
        Asynchronous generation with download URL on completion.
      operationId: exportReport
      parameters:
        - name: format
          in: query
          schema:
            type: string
            enum: [PDF, EXCEL]
            default: PDF
        - $ref: '#/components/parameters/FromDate'
        - $ref: '#/components/parameters/ToDate'
      responses:
        '200':
          description: Report generation initiated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ReportExportResponse'

  # ===== ADMIN =====
  /admin/policies/rules/{ruleId}:
    put:
      tags: [Admin]
      summary: Update validation rule
      description: |
        Updates a policy validation rule configuration.
        All changes tracked in audit trail. Takes effect immediately
        for new requests. Existing requests unaffected.
      operationId: updatePolicyRule
      parameters:
        - name: ruleId
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateRuleRequest'
            example:
              name: "Return Window Check"
              parameters:
                standardWindowDays: 21
                extendedWindowDays: 30
              active: true
              changeReason: "Extended window per management decision"
      responses:
        '200':
          description: Rule updated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UpdateRuleResponse'

  /admin/policies/rules:
    get:
      tags: [Admin]
      summary: List validation rules
      description: Retrieves all active and inactive validation rules.
      operationId: listPolicyRules
      responses:
        '200':
          description: Rules list
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/RulesListResponse'

  /admin/audit-trail:
    get:
      tags: [Admin]
      summary: Get audit trail
      description: |
        Retrieves system audit trail with filtering.
        Records all user actions, policy changes, status transitions,
        financial transactions, and authentication events.
      operationId: getAuditTrail
      parameters:
        - name: eventType
          in: query
          schema:
            type: string
            enum: [POLICY_CHANGE, STATUS_CHANGE, AUTH_EVENT, FINANCIAL_TRANSACTION, USER_MANAGEMENT]
        - name: userId
          in: query
          schema:
            type: string
        - name: fromDate
          in: query
          schema:
            type: string
            format: date
        - name: toDate
          in: query
          schema:
            type: string
            format: date
        - $ref: '#/components/parameters/Page'
        - $ref: '#/components/parameters/PageSize'
      responses:
        '200':
          description: Audit trail events
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuditTrailResponse'

  /admin/users:
    get:
      tags: [Admin]
      summary: List system users
      description: Retrieves all users with roles, status, and activity.
      operationId: listUsers
      parameters:
        - name: role
          in: query
          schema:
            type: string
            enum: [CUSTOMER, SUPPORT_AGENT, WAREHOUSE_STAFF, MANAGER, ADMIN]
        - name: status
          in: query
          schema:
            type: string
            enum: [ACTIVE, INACTIVE, SUSPENDED]
        - $ref: '#/components/parameters/Page'
        - $ref: '#/components/parameters/PageSize'
      responses:
        '200':
          description: User list
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserListResponse'

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: |
        JWT access token obtained via POST /auth/login.
        Token lifetime: 15 minutes. Refresh via POST /auth/refresh.

  parameters:
    RmaNumber:
      name: rmaNumber
      in: path
      required: true
      schema:
        type: string
        pattern: '^RMA-\\\\d{4}-\\\\d{6}$'
      description: Return Merchandise Authorization number
      example: "RMA-2026-000047"
    StatusFilter:
      name: status
      in: query
      schema:
        type: string
        enum:
          - SUBMITTED
          - APPROVED
          - REJECTED
          - RECEIVED
          - INSPECTING
          - INSPECTION_COMPLETE
          - REFUND_PENDING
          - REFUND_PROCESSED
          - COMPLETED
          - CANCELLED
      description: Filter by return status
    FromDate:
      name: fromDate
      in: query
      schema:
        type: string
        format: date
      description: Filter from date (ISO 8601)
    ToDate:
      name: toDate
      in: query
      schema:
        type: string
        format: date
      description: Filter to date (ISO 8601)
    CustomerEmailFilter:
      name: customerEmail
      in: query
      schema:
        type: string
        format: email
      description: Filter by customer email
    ProductCategoryFilter:
      name: productCategory
      in: query
      schema:
        type: string
        enum: [TV, SMARTPHONE, LAPTOP, TABLET, AUDIO, CAMERA, APPLIANCE, ACCESSORY, GAMING, OTHER]
      description: Filter by product category
    ReturnReasonFilter:
      name: returnReason
      in: query
      schema:
        type: string
        enum: [DEFECTIVE, WRONG_ITEM, NOT_AS_DESCRIBED, CHANGED_MIND, BETTER_PRICE_FOUND, DAMAGED_IN_TRANSIT, WARRANTY_CLAIM, OTHER]
      description: Filter by return reason
    SortBy:
      name: sortBy
      in: query
      schema:
        type: string
        enum: [createdAt, refundAmount, customerName, status]
        default: createdAt
    SortOrder:
      name: sortOrder
      in: query
      schema:
        type: string
        enum: [asc, desc]
        default: desc
    Page:
      name: page
      in: query
      schema:
        type: integer
        minimum: 1
        default: 1
    PageSize:
      name: pageSize
      in: query
      schema:
        type: integer
        minimum: 1
        maximum: 100
        default: 20

  schemas:
    # --- Auth ---
    LoginRequest:
      type: object
      required: [email, password]
      properties:
        email:
          type: string
          format: email
          example: "agent@kontakthome.az"
        password:
          type: string
          format: password
          minLength: 8
          description: User password (min 8 chars, 1 uppercase, 1 number)
    LoginResponse:
      type: object
      properties:
        success:
          type: boolean
          example: true
        data:
          $ref: '#/components/schemas/TokenResponse'
    TokenResponse:
      type: object
      properties:
        accessToken:
          type: string
          description: JWT access token (15 min expiry)
          example: "eyJhbGciOiJIUzI1NiIs..."
        refreshToken:
          type: string
          description: Refresh token (7 day expiry)
        tokenType:
          type: string
          example: Bearer
        expiresIn:
          type: integer
          description: Access token expiry in seconds
          example: 900
        user:
          $ref: '#/components/schemas/UserInfo'
    RefreshRequest:
      type: object
      required: [refreshToken]
      properties:
        refreshToken:
          type: string
    UserInfo:
      type: object
      properties:
        id:
          type: string
          example: "USR-001"
        email:
          type: string
          format: email
        role:
          type: string
          enum: [CUSTOMER, SUPPORT_AGENT, WAREHOUSE_STAFF, MANAGER, ADMIN]
        name:
          type: string
        department:
          type: string

    # --- Return Request ---
    CreateReturnRequest:
      type: object
      required: [orderId, customerEmail, items, preferredResolution]
      properties:
        orderId:
          type: string
          pattern: '^ORD-\\\\d{4}-\\\\d{5}$'
        customerEmail:
          type: string
          format: email
        items:
          type: array
          minItems: 1
          maxItems: 10
          items:
            $ref: '#/components/schemas/ReturnItem'
        preferredResolution:
          type: string
          enum: [REFUND, EXCHANGE, STORE_CREDIT]
        customerNotes:
          type: string
          maxLength: 1000
    ReturnItem:
      type: object
      required: [orderItemId, productSku, returnReason, purchasePrice]
      properties:
        orderItemId:
          type: string
        productSku:
          type: string
        productName:
          type: string
        serialNumber:
          type: string
        returnReason:
          type: string
          enum: [DEFECTIVE, WRONG_ITEM, NOT_AS_DESCRIBED, CHANGED_MIND, BETTER_PRICE_FOUND, DAMAGED_IN_TRANSIT, WARRANTY_CLAIM, OTHER]
        reasonDescription:
          type: string
          maxLength: 500
        productCondition:
          type: string
          enum: [NEW, GOOD, FAIR, POOR]
        purchasePrice:
          type: number
          format: double
          minimum: 0
        photos:
          type: array
          maxItems: 5
          items:
            type: string
            format: byte
            description: Base64-encoded photo
    ReturnResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          $ref: '#/components/schemas/ReturnCreated'
    ReturnCreated:
      type: object
      properties:
        returnId:
          type: string
          example: "RET-2026-000047"
        rmaNumber:
          type: string
          example: "RMA-2026-000047"
        status:
          type: string
          enum: [APPROVED, REJECTED, PENDING_REVIEW]
        validationResult:
          $ref: '#/components/schemas/ValidationResult'
        estimatedRefund:
          type: number
          format: double
        shippingLabel:
          $ref: '#/components/schemas/ShippingLabel'
        createdAt:
          type: string
          format: date-time
        _links:
          type: object
          properties:
            self:
              type: string
              format: uri
            tracking:
              type: string
              format: uri
            cancel:
              type: string
              format: uri
    ReturnDetailResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          $ref: '#/components/schemas/ReturnDetail'
    ReturnDetail:
      type: object
      properties:
        returnId:
          type: string
        rmaNumber:
          type: string
        status:
          type: string
        orderId:
          type: string
        customer:
          $ref: '#/components/schemas/CustomerInfo'
        items:
          type: array
          items:
            $ref: '#/components/schemas/ReturnItemDetail'
        financialSummary:
          $ref: '#/components/schemas/FinancialSummary'
        timeline:
          type: array
          items:
            $ref: '#/components/schemas/TimelineEvent'
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
    ReturnListResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          type: object
          properties:
            returns:
              type: array
              items:
                $ref: '#/components/schemas/ReturnSummary'
            pagination:
              $ref: '#/components/schemas/Pagination'
    ReturnSummary:
      type: object
      properties:
        returnId:
          type: string
        rmaNumber:
          type: string
        status:
          type: string
        customerName:
          type: string
        productSku:
          type: string
        returnReason:
          type: string
        refundAmount:
          type: number
        createdAt:
          type: string
          format: date-time

    # --- Validation ---
    ValidateRequest:
      type: object
      required: [orderId, productSku, purchaseDate, customerEmail]
      properties:
        orderId:
          type: string
        productSku:
          type: string
        purchaseDate:
          type: string
          format: date
        customerEmail:
          type: string
          format: email
    ValidationResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          $ref: '#/components/schemas/ValidationDetail'
    ValidationDetail:
      type: object
      properties:
        eligible:
          type: boolean
        rules:
          type: array
          items:
            $ref: '#/components/schemas/RuleEvaluation'
        returnOptions:
          type: array
          items:
            type: string
            enum: [REFUND, EXCHANGE, STORE_CREDIT]
    ValidationResult:
      type: object
      properties:
        eligible:
          type: boolean
        purchaseDate:
          type: string
          format: date
        returnWindow:
          type: integer
        daysRemaining:
          type: integer
        policyViolations:
          type: array
          items:
            type: string
    RuleEvaluation:
      type: object
      properties:
        ruleId:
          type: string
        ruleName:
          type: string
        passed:
          type: boolean
        detail:
          type: string
        policyReference:
          type: string

    # --- Status Update ---
    StatusUpdateRequest:
      type: object
      required: [status]
      properties:
        status:
          type: string
          enum: [RECEIVED, INSPECTING, INSPECTION_COMPLETE, REFUND_PENDING, REFUND_PROCESSED, COMPLETED, REJECTED]
        conditionGrade:
          type: string
          enum: [A, B, C, D]
        disposition:
          type: string
          enum: [RESTOCK, REFURBISH, DISPOSE, RETURN_TO_VENDOR]
        inspectionNotes:
          type: string
          maxLength: 1000
        inspectorId:
          type: string
        photos:
          type: array
          items:
            type: string
            format: byte
    StatusUpdateResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          type: object
          properties:
            returnId:
              type: string
            rmaNumber:
              type: string
            previousStatus:
              type: string
            newStatus:
              type: string
            refundCalculation:
              $ref: '#/components/schemas/RefundCalculation'
            nextActions:
              type: array
              items:
                type: string
            updatedAt:
              type: string
              format: date-time

    # --- Cancel ---
    CancelRequest:
      type: object
      required: [reason]
      properties:
        reason:
          type: string
          maxLength: 500
        requestedBy:
          type: string
    CancelResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          type: object
          properties:
            returnId:
              type: string
            rmaNumber:
              type: string
            status:
              type: string
              enum: [CANCELLED]
            cancelledAt:
              type: string
              format: date-time
            cancelReason:
              type: string

    # --- Warehouse ---
    ReceiveRequest:
      type: object
      required: [rmaNumber, receivedBy, receivingLocation, carrierName]
      properties:
        rmaNumber:
          type: string
        receivedBy:
          type: string
        receivingLocation:
          type: string
        carrierName:
          type: string
        trackingNumber:
          type: string
        packageCondition:
          type: string
          enum: [GOOD, DAMAGED, WET, OPENED]
        notes:
          type: string
          maxLength: 500
    ReceiveResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          type: object
          properties:
            receivingId:
              type: string
            rmaNumber:
              type: string
            expectedItem:
              $ref: '#/components/schemas/ExpectedItem'
            status:
              type: string
            inspectionDeadline:
              type: string
              format: date-time
            nextAction:
              type: string
            receivedAt:
              type: string
              format: date-time
    InspectionRequest:
      type: object
      required: [rmaNumber, inspectionResult]
      properties:
        rmaNumber:
          type: string
        inspectionResult:
          $ref: '#/components/schemas/InspectionResult'
    InspectionResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          type: object
          properties:
            rmaNumber:
              type: string
            inspectionId:
              type: string
            conditionGrade:
              type: string
            disposition:
              type: string
            refundEligibility:
              $ref: '#/components/schemas/RefundEligibility'
            inventoryAction:
              $ref: '#/components/schemas/InventoryAction'
            inspectedAt:
              type: string
              format: date-time
    InspectionResult:
      type: object
      required: [conditionGrade, disposition]
      properties:
        conditionGrade:
          type: string
          enum: [A, B, C, D]
        gradingCriteria:
          $ref: '#/components/schemas/GradingCriteria'
        disposition:
          type: string
          enum: [RESTOCK, REFURBISH, DISPOSE, RETURN_TO_VENDOR]
        dispositionNotes:
          type: string
        inspectorId:
          type: string
        inspectionDuration:
          type: integer
          description: Duration in minutes
        photos:
          type: array
          items:
            $ref: '#/components/schemas/InspectionPhoto'
    GradingCriteria:
      type: object
      properties:
        packaging:
          type: string
          enum: [ORIGINAL, INTACT, DAMAGED, MISSING]
        accessories:
          type: string
          enum: [COMPLETE, PARTIAL, MISSING]
        cosmeticCondition:
          type: string
          enum: [PERFECT, MINOR_MARKS, VISIBLE_WEAR, SIGNIFICANT_DAMAGE]
        functionalTest:
          type: string
          enum: [PASSED, PARTIAL, FAILED]
    InspectionPhoto:
      type: object
      properties:
        type:
          type: string
          enum: [GENERAL, DEFECT, PACKAGING, ACCESSORY]
        url:
          type: string
          format: uri
        annotation:
          type: string
    WarehouseQueueResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          type: object
          properties:
            queue:
              type: array
              items:
                $ref: '#/components/schemas/QueueItem'
            summary:
              $ref: '#/components/schemas/QueueSummary'

    # --- Refunds ---
    RefundCalculationRequest:
      type: object
      required: [rmaNumber, originalAmount, conditionGrade, returnReason, originalPaymentMethod]
      properties:
        rmaNumber:
          type: string
        originalAmount:
          type: number
          format: double
        conditionGrade:
          type: string
          enum: [A, B, C, D]
        returnReason:
          type: string
        originalPaymentMethod:
          type: string
          enum: [CREDIT_CARD, BANK_TRANSFER, CASH, STORE_CREDIT]
    RefundCalculationResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          $ref: '#/components/schemas/RefundBreakdown'
    RefundBreakdown:
      type: object
      properties:
        rmaNumber:
          type: string
        calculationBreakdown:
          $ref: '#/components/schemas/CalculationBreakdown'
        refundMethod:
          $ref: '#/components/schemas/RefundMethodInfo'
        alternatives:
          type: array
          items:
            $ref: '#/components/schemas/RefundAlternative'
    ProcessRefundRequest:
      type: object
      required: [rmaNumber, refundMethod, processedBy]
      properties:
        rmaNumber:
          type: string
        refundMethod:
          type: string
          enum: [CREDIT_CARD, BANK_TRANSFER, STORE_CREDIT, CASH]
        processedBy:
          type: string
        notes:
          type: string
    ProcessRefundResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          $ref: '#/components/schemas/RefundProcessed'
    RefundDetailResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          $ref: '#/components/schemas/RefundDetail'

    # --- Notifications ---
    NotificationHistoryResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          type: object
          properties:
            rmaNumber:
              type: string
            notifications:
              type: array
              items:
                $ref: '#/components/schemas/NotificationRecord'
    SendNotificationRequest:
      type: object
      required: [rmaNumber, channel]
      properties:
        rmaNumber:
          type: string
        channel:
          type: string
          enum: [EMAIL, SMS, BOTH]
        templateId:
          type: string
        customMessage:
          type: string
          maxLength: 1000
        sendCopyToAgent:
          type: boolean
          default: false
    SendNotificationResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          type: object
          properties:
            notificationId:
              type: string
            status:
              type: string
            channel:
              type: string
            recipient:
              type: string
            estimatedDelivery:
              type: string
              format: date-time

    # --- Analytics ---
    DashboardResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          $ref: '#/components/schemas/DashboardData'
    CategoryAnalyticsResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          type: object
          properties:
            period:
              type: object
              properties:
                from:
                  type: string
                  format: date
                to:
                  type: string
                  format: date
            categories:
              type: array
              items:
                $ref: '#/components/schemas/CategoryMetric'
    ReportExportResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          type: object
          properties:
            reportId:
              type: string
            type:
              type: string
            format:
              type: string
            status:
              type: string
            downloadUrl:
              type: string
              format: uri
              nullable: true
            estimatedReadyAt:
              type: string
              format: date-time

    # --- Admin ---
    UpdateRuleRequest:
      type: object
      properties:
        name:
          type: string
        parameters:
          type: object
          additionalProperties: true
        active:
          type: boolean
        changeReason:
          type: string
          maxLength: 500
    UpdateRuleResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          type: object
          properties:
            ruleId:
              type: string
            previousValues:
              type: object
            newValues:
              type: object
            effectiveFrom:
              type: string
              format: date-time
            modifiedBy:
              type: string
            modifiedAt:
              type: string
              format: date-time
            auditTrailId:
              type: string
    RulesListResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          type: object
          properties:
            rules:
              type: array
              items:
                $ref: '#/components/schemas/PolicyRule'
            pagination:
              $ref: '#/components/schemas/Pagination'
    AuditTrailResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          type: object
          properties:
            events:
              type: array
              items:
                $ref: '#/components/schemas/AuditEvent'
            pagination:
              $ref: '#/components/schemas/Pagination'
    UserListResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          type: object
          properties:
            users:
              type: array
              items:
                $ref: '#/components/schemas/UserRecord'
            pagination:
              $ref: '#/components/schemas/Pagination'

    # --- Shared / Reusable ---
    CustomerInfo:
      type: object
      properties:
        name:
          type: string
        email:
          type: string
          format: email
        phone:
          type: string
          pattern: '^\\\\+994\\\\d{9}$'
    ReturnItemDetail:
      type: object
      properties:
        orderItemId:
          type: string
        productSku:
          type: string
        productName:
          type: string
        serialNumber:
          type: string
        returnReason:
          type: string
        conditionGrade:
          type: string
          enum: [A, B, C, D]
        disposition:
          type: string
    FinancialSummary:
      type: object
      properties:
        originalAmount:
          type: number
          format: double
        refundAmount:
          type: number
          format: double
        refundMethod:
          type: string
        refundStatus:
          type: string
    TimelineEvent:
      type: object
      properties:
        status:
          type: string
        timestamp:
          type: string
          format: date-time
        actor:
          type: string
    ShippingLabel:
      type: object
      properties:
        labelUrl:
          type: string
          format: uri
        expiryDate:
          type: string
          format: date
        returnAddress:
          type: string
    Pagination:
      type: object
      properties:
        page:
          type: integer
        pageSize:
          type: integer
        totalItems:
          type: integer
        totalPages:
          type: integer
        hasNext:
          type: boolean
        hasPrev:
          type: boolean
    RefundCalculation:
      type: object
      properties:
        originalAmount:
          type: number
        conditionGrade:
          type: string
        refundPercentage:
          type: integer
        refundAmount:
          type: number
        refundMethod:
          type: string
    RefundEligibility:
      type: object
      properties:
        autoApproved:
          type: boolean
        refundPercentage:
          type: integer
        refundAmount:
          type: number
        approvalRequired:
          type: boolean
    InventoryAction:
      type: object
      properties:
        action:
          type: string
        newCondition:
          type: string
        restockLocation:
          type: string
    ExpectedItem:
      type: object
      properties:
        productName:
          type: string
        productSku:
          type: string
        serialNumber:
          type: string
        customerName:
          type: string
    QueueItem:
      type: object
      properties:
        rmaNumber:
          type: string
        productName:
          type: string
        receivedAt:
          type: string
          format: date-time
        slaDeadline:
          type: string
          format: date-time
        hoursRemaining:
          type: number
        priority:
          type: string
          enum: [NORMAL, HIGH, URGENT]
        returnReason:
          type: string
    QueueSummary:
      type: object
      properties:
        totalPending:
          type: integer
        overdue:
          type: integer
        dueToday:
          type: integer
        avgWaitTime:
          type: string
    CalculationBreakdown:
      type: object
      properties:
        originalAmount:
          type: number
        conditionDeduction:
          type: number
        conditionGrade:
          type: string
        conditionRefundPercentage:
          type: integer
        restockingFee:
          type: number
        loyaltyBonus:
          type: number
        totalRefundAmount:
          type: number
        currency:
          type: string
    RefundMethodInfo:
      type: object
      properties:
        type:
          type: string
        lastFourDigits:
          type: string
        cardNetwork:
          type: string
        estimatedProcessingDays:
          type: string
    RefundAlternative:
      type: object
      properties:
        method:
          type: string
        amount:
          type: number
        bonusPercentage:
          type: integer
        bonusAmount:
          type: number
    RefundProcessed:
      type: object
      properties:
        refundId:
          type: string
        rmaNumber:
          type: string
        amount:
          type: number
        currency:
          type: string
        method:
          type: string
        status:
          type: string
        erpTransactionId:
          type: string
        estimatedCompletion:
          type: string
          format: date-time
        processedAt:
          type: string
          format: date-time
        _links:
          type: object
          properties:
            self:
              type: string
              format: uri
            return:
              type: string
              format: uri
    RefundDetail:
      type: object
      properties:
        refundId:
          type: string
        rmaNumber:
          type: string
        amount:
          type: number
        currency:
          type: string
        method:
          type: string
        lastFourDigits:
          type: string
        status:
          type: string
          enum: [PENDING, SUBMITTED, PROCESSING, COMPLETED, FAILED, REVERSED]
        erpTransactionId:
          type: string
        bankReference:
          type: string
        timeline:
          type: array
          items:
            $ref: '#/components/schemas/TimelineEvent'
        notifications:
          type: array
          items:
            $ref: '#/components/schemas/NotificationDeliveryStatus'
    NotificationRecord:
      type: object
      properties:
        id:
          type: string
        type:
          type: string
        channel:
          type: string
          enum: [EMAIL, SMS]
        recipient:
          type: string
        subject:
          type: string
        sentAt:
          type: string
          format: date-time
        deliveryStatus:
          type: string
          enum: [QUEUED, SENT, DELIVERED, FAILED, BOUNCED]
        openedAt:
          type: string
          format: date-time
          nullable: true
    NotificationDeliveryStatus:
      type: object
      properties:
        channel:
          type: string
        sentAt:
          type: string
          format: date-time
        status:
          type: string
    DashboardData:
      type: object
      properties:
        kpis:
          type: object
          properties:
            totalReturnsThisMonth:
              type: integer
            avgProcessingTimeDays:
              type: number
            customerSatisfactionScore:
              type: number
            autoApprovalRate:
              type: number
            refundTotalThisMonth:
              type: number
            costPerReturn:
              type: number
        trends:
          type: object
          properties:
            returnVolume:
              type: object
              properties:
                currentMonth:
                  type: integer
                previousMonth:
                  type: integer
                changePercent:
                  type: number
                sixMonthAverage:
                  type: integer
            processingTime:
              type: object
              properties:
                currentAvg:
                  type: number
                targetAvg:
                  type: number
                improvementFromBaseline:
                  type: number
        topReturnReasons:
          type: array
          items:
            type: object
            properties:
              reason:
                type: string
              count:
                type: integer
              percentage:
                type: number
        alerts:
          type: array
          items:
            type: object
            properties:
              type:
                type: string
              message:
                type: string
              severity:
                type: string
              productCategory:
                type: string
        lastRefreshed:
          type: string
          format: date-time
    CategoryMetric:
      type: object
      properties:
        category:
          type: string
        returnCount:
          type: integer
        returnRate:
          type: number
        totalRefundAmount:
          type: number
        avgRefundAmount:
          type: number
        topReason:
          type: string
        trend:
          type: string
    PolicyRule:
      type: object
      properties:
        ruleId:
          type: string
        name:
          type: string
        description:
          type: string
        parameters:
          type: object
          additionalProperties: true
        active:
          type: boolean
        priority:
          type: integer
        lastModified:
          type: string
          format: date-time
        modifiedBy:
          type: string
    AuditEvent:
      type: object
      properties:
        auditId:
          type: string
        eventType:
          type: string
        userId:
          type: string
        userName:
          type: string
        action:
          type: string
        resource:
          type: string
        details:
          type: string
        ipAddress:
          type: string
        timestamp:
          type: string
          format: date-time
    UserRecord:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
        email:
          type: string
          format: email
        role:
          type: string
        department:
          type: string
        status:
          type: string
        lastLoginAt:
          type: string
          format: date-time

    # --- Errors ---
    ErrorResponse:
      type: object
      required: [success, error]
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required: [code, message, timestamp]
          properties:
            code:
              type: string
              enum: [AUTHENTICATION_REQUIRED, TOKEN_EXPIRED, INSUFFICIENT_PERMISSIONS, RESOURCE_NOT_FOUND, VALIDATION_ERROR, RETURN_WINDOW_EXCEEDED, PRODUCT_NOT_ELIGIBLE, DUPLICATE_RETURN_REQUEST, INVALID_STATUS_TRANSITION, RATE_LIMIT_EXCEEDED, ERP_INTEGRATION_ERROR, INTERNAL_ERROR]
            message:
              type: string
            details:
              type: array
              items:
                type: object
                properties:
                  field:
                    type: string
                  rule:
                    type: string
                  message:
                    type: string
                  policyReference:
                    type: string
            timestamp:
              type: string
              format: date-time
            requestId:
              type: string
            documentationUrl:
              type: string
              format: uri
    ValidationError:
      type: object
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          properties:
            code:
              type: string
              example: VALIDATION_ERROR
            message:
              type: string
            details:
              type: array
              items:
                type: object
                properties:
                  field:
                    type: string
                  rule:
                    type: string
                  message:
                    type: string
            timestamp:
              type: string
              format: date-time
            requestId:
              type: string
    SuccessMessage:
      type: object
      properties:
        success:
          type: boolean
          example: true
        message:
          type: string

  responses:
    Unauthorized:
      description: Authentication required or token expired
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          example:
            success: false
            error:
              code: TOKEN_EXPIRED
              message: "Access token has expired. Use refresh token to obtain a new one."
              timestamp: "2026-04-26T14:30:00Z"
    NotFound:
      description: Resource not found
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          example:
            success: false
            error:
              code: RESOURCE_NOT_FOUND
              message: "Return request with RMA-2026-999999 not found"
              timestamp: "2026-04-26T14:30:00Z"
    Forbidden:
      description: Insufficient permissions
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          example:
            success: false
            error:
              code: INSUFFICIENT_PERMISSIONS
              message: "WAREHOUSE_STAFF role cannot access analytics endpoints"
              timestamp: "2026-04-26T14:30:00Z"
`;

// ========== BUILD DOCUMENT ==========
const coverChildren = [
  new docx.Paragraph({ spacing: { before: 2400 }, children: [] }),
  new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, children: [new docx.TextRun({ text: "SWAGGER / OpenAPI 3.0", size: 46, bold: true, color: COLORS.deepSea, font: "Calibri" })] }),
  new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, children: [new docx.TextRun({ text: "SPECIFICATION", size: 46, bold: true, color: COLORS.deepSea, font: "Calibri" })] }),
  new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, spacing: { before: 200 }, children: [new docx.TextRun({ text: "\u2500".repeat(40), size: 24, color: COLORS.ocean, font: "Calibri" })] }),
  new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, spacing: { before: 200 }, children: [new docx.TextRun({ text: "Kontakt Home", size: 36, bold: true, color: COLORS.ocean, font: "Calibri" })] }),
  new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, spacing: { before: 100 }, children: [new docx.TextRun({ text: "Return Management System (RMS)", size: 28, color: COLORS.accent, font: "Calibri" })] }),
  new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, spacing: { before: 100 }, children: [new docx.TextRun({ text: "OpenAPI 3.0.3 Specification Document", size: 24, color: COLORS.gray, font: "Calibri", italics: true })] }),
  new docx.Paragraph({ spacing: { before: 1200 }, children: [] }),
  new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, children: [new docx.TextRun({ text: "Version 1.0", size: 22, color: COLORS.dark, font: "Calibri" })] }),
  new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, spacing: { before: 80 }, children: [new docx.TextRun({ text: "Date: April 26, 2026", size: 22, color: COLORS.dark, font: "Calibri" })] }),
  new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, spacing: { before: 80 }, children: [new docx.TextRun({ text: "Prepared by: Zamir Jamalov", size: 22, color: COLORS.dark, font: "Calibri" })] }),
  new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, spacing: { before: 80 }, children: [new docx.TextRun({ text: "Classification: Confidential", size: 22, color: COLORS.gray, font: "Calibri", italics: true })] }),
];

const tocItems = [
  "Document Control",
  "1. Introduction",
  "   1.1 Purpose and Scope",
  "   1.2 OpenAPI Specification Overview",
  "   1.3 API Architecture",
  "   1.4 Server Environments",
  "   1.5 Authentication and Security",
  "   1.6 Tag Groups (Resource Categories)",
  "2. API Endpoint Reference",
  "   2.1 Authentication Endpoints",
  "   2.2 Return Request Endpoints",
  "   2.3 Validation Engine Endpoints",
  "   2.4 Warehouse Operations Endpoints",
  "   2.5 Refund Processing Endpoints",
  "   2.6 Notification Endpoints",
  "   2.7 Analytics and Reporting Endpoints",
  "   2.8 Admin and Configuration Endpoints",
  "3. Data Model Reference (Components/Schemas)",
  "   3.1 Authentication Schemas",
  "   3.2 Return Request Schemas",
  "   3.3 Validation Schemas",
  "   3.4 Warehouse Schemas",
  "   3.5 Refund Schemas",
  "   3.6 Notification Schemas",
  "   3.7 Analytics Schemas",
  "   3.8 Admin Schemas",
  "   3.9 Shared and Reusable Schemas",
  "   3.10 Error Response Schemas",
  "4. Parameter Reference",
  "5. Security Schemes",
  "6. Reusable Responses",
  "7. Complete OpenAPI 3.0 YAML Specification",
  "8. How to Use This Specification",
  "   8.1 Swagger UI",
  "   8.2 Code Generation",
  "   8.3 API Testing with Postman",
  "   8.4 API Client SDK Generation",
  "9. Appendix: Enumeration Values",
];

const tocChildren = [
  new docx.Paragraph({ children: [new docx.TextRun({ text: "Table of Contents", bold: true, size: 32, color: COLORS.deepSea, font: "Calibri" })], spacing: { after: 300 } }),
  ...tocItems.map(t => new docx.Paragraph({ children: [new docx.TextRun({ text: t, size: 22, color: t.startsWith("   ") ? COLORS.gray : COLORS.deepSea, font: "Calibri", bold: !t.startsWith("   ") })], spacing: { after: 40 } })),
];

const mainChildren = [
  heading("Document Control"),
  createTable(
    ["Attribute", "Detail"],
    [
      ["Document Title", "Swagger / OpenAPI 3.0 Specification - Kontakt Home Return Management System"],
      ["Document ID", "RMS-OAS-001"],
      ["OpenAPI Version", "3.0.3"],
      ["API Version", "v1.0.0"],
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
      ["0.1", "April 18, 2026", "Zamir Jamalov", "Initial OpenAPI spec with auth and return endpoints"],
      ["0.2", "April 22, 2026", "Zamir Jamalov", "Added warehouse, refund, notification schemas"],
      ["0.3", "April 24, 2026", "Zamir Jamalov", "Completed all schemas, parameters, and reusable responses"],
      ["0.4", "April 25, 2026", "Zamir Jamalov", "Validated against Swagger Validator; fixed schema references"],
      ["1.0", "April 26, 2026", "Zamir Jamalov", "Final version with complete YAML and documentation"],
    ]
  ),
  divider(),

  // 1. Introduction
  heading("1. Introduction"),

  heading("1.1 Purpose and Scope", 2),
  para("This document provides the complete Swagger / OpenAPI 3.0.3 specification for the Kontakt Home Return Management System (RMS) API. The specification is intended to serve as the single source of truth for API contract definition, enabling frontend developers, backend developers, QA engineers, and external integration partners to build against a consistent, well-documented API interface. The document contains the human-readable narrative explanation of the API alongside the complete machine-readable YAML specification."),
  para("The scope of this specification covers all API endpoints required to support the end-to-end product return lifecycle at Kontakt Home, including customer-initiated return requests, automated eligibility validation, warehouse receiving and quality inspection, refund calculation and processing, multi-channel customer notifications, management analytics and reporting dashboards, and system administration functions including policy configuration and audit trail access. The specification defines 24 RESTful endpoints organized across 8 resource groups (tags), with over 60 reusable JSON Schema component definitions."),
  para("This document complements the REST API & JSON Specification document (RMS-API-001) by providing the machine-standardized OpenAPI format that can be directly imported into Swagger UI, code generation tools, API testing platforms, and API gateway configurations. While RMS-API-001 provides narrative explanations and detailed JSON examples, this document (RMS-OAS-001) provides the authoritative, tool-consumable API contract."),

  heading("1.2 OpenAPI Specification Overview", 2),
  para("OpenAPI Specification (OAS) is a standard, machine-readable format for describing RESTful APIs. Originally created by SmartBear Software as the Swagger Specification, it was donated to the OpenAPI Initiative under the Linux Foundation and renamed to OpenAPI Specification. The current major version is OpenAPI 3.0.3, which introduces significant improvements over Swagger 2.0 including improved schema composition, support for callbacks and links, and better server/operation object definitions."),
  para("Key characteristics of this API specification:"),
  bullet("Specification Version: OpenAPI 3.0.3 (latest stable release of the 3.0.x series)"),
  bullet("API Version: v1.0.0 (using URL path versioning: /api/v1/)"),
  bullet("Total Endpoints: 24 (across 8 tag/resource groups)"),
  bullet("Total Schemas: 60+ component definitions in #/components/schemas/"),
  bullet("Total Parameters: 11 reusable parameters in #/components/parameters/"),
  bullet("Security: JWT Bearer token via #/components/securitySchemes/BearerAuth"),
  bullet("Content Type: All requests and responses use application/json"),
  bullet("Documentation: Full descriptions on all operations, schemas, and parameters"),

  heading("1.3 API Architecture", 2),
  para("The Kontakt Home RMS API follows a layered REST architecture with clear separation of concerns. The API is designed to serve four distinct client applications through role-based access controls, while maintaining a unified API contract. The architecture follows these design principles:"),
  bullet("Resource-Oriented Design: Each endpoint maps to a well-defined resource (returns, refunds, notifications, etc.) with standard HTTP methods (GET, POST, PUT, PATCH, DELETE) representing CRUD operations and domain-specific actions."),
  bullet("HATEOAS Links: Response payloads include _links objects providing discoverable URLs for related resources, enabling client applications to navigate the API without hardcoding endpoint URLs."),
  bullet("State Machine Pattern: Return request status transitions follow a defined state machine with validation rules enforced at the API level, preventing invalid transitions and ensuring data consistency."),
  bullet("Event-Driven Side Effects: Certain API operations trigger asynchronous side effects (notifications, ERP sync, analytics updates) without blocking the primary response, improving API responsiveness."),
  bullet("Paginated List Endpoints: All list endpoints support standardized pagination with page/pageSize parameters and consistent pagination metadata in responses."),

  heading("1.4 Server Environments", 2),
  para("The API is deployed across three environments to support the development lifecycle:"),
  createTable(
    ["Environment", "Base URL", "Purpose", "Data"],
    [
      ["Production", "https://api.kontakthome.az/api/v1", "Live production system serving customers and staff", "Production data (real)"],
      ["Staging", "https://api-staging.kontakthome.az/api/v1", "Pre-production testing with production-like data", "Anonymized production copy"],
      ["Development", "https://api-dev.kontakthome.az/api/v1", "Active development and integration testing", "Synthetic test data"],
    ]
  ),
  divider(),
  para("All environments enforce HTTPS/TLS 1.3 encryption. The development environment additionally allows HTTP connections from localhost for local testing convenience. API versioning is implemented via URL path (/api/v1/, /api/v2/), ensuring clear separation between major versions."),

  heading("1.5 Authentication and Security", 2),
  para("The API uses JSON Web Token (JWT) Bearer authentication defined in the OpenAPI security scheme component. The security configuration is applied globally (top-level security array) meaning all endpoints require authentication by default. Endpoints that do not require authentication (specifically the authentication endpoints themselves) override this with an empty security array (security: [])."),
  para("Security scheme definition from the specification:"),
  ...codeBlock("components:\n  securitySchemes:\n    BearerAuth:\n      type: http\n      scheme: bearer\n      bearerFormat: JWT\n      description: |\n        JWT access token obtained via POST /auth/login.\n        Token lifetime: 15 minutes. Refresh via POST /auth/refresh."),
  divider(),
  para("Authentication flow: (1) Client sends credentials to POST /auth/login, (2) Server returns JWT access token (15 min) and refresh token (7 days), (3) Client includes access token in Authorization header for all subsequent requests, (4) When access token expires, client calls POST /auth/refresh with refresh token, (5) Server returns new token pair and invalidates old refresh token (rotation), (6) Client calls POST /auth/logout to invalidate refresh token and end session."),

  heading("1.6 Tag Groups (Resource Categories)", 2),
  para("The API endpoints are organized into 8 tag groups that represent logical resource categories. Tags are used by Swagger UI and other documentation tools to group endpoints into navigable sections. The following table summarizes all tag groups with their endpoint count and access restrictions:"),
  createTable(
    ["Tag", "Description", "Endpoints", "Access"],
    [
      ["Authentication", "User login, token refresh, logout", "3 (POST)", "Public / Authenticated"],
      ["Return Requests", "Create, retrieve, list, status updates, cancel", "5 (GET, POST, PATCH)", "Role-based"],
      ["Validation", "Pre-submission eligibility check, policy rules", "2 (GET, POST)", "Role-based"],
      ["Warehouse", "Item receiving, inspection, queue management", "3 (GET, POST)", "Warehouse + Manager"],
      ["Refunds", "Calculate, process, retrieve refund details", "3 (GET, POST)", "Finance + Manager"],
      ["Notifications", "Notification history, manual send", "2 (GET, POST)", "Role-based"],
      ["Analytics", "Dashboard, category analytics, report export", "3 (GET)", "Manager + Admin only"],
      ["Admin", "Policy rules, audit trail, user management", "3 (GET, PUT)", "Admin only"],
    ]
  ),
  divider(),

  // 2. API Endpoint Reference
  heading("2. API Endpoint Reference"),
  para("This section provides a comprehensive reference for all 24 API endpoints organized by tag group. Each endpoint listing includes the HTTP method, path, summary, description, parameters, request body schema (where applicable), and response schemas with status codes. Schema references point to the #/components/schemas/ section where detailed field definitions are provided."),

  heading("2.1 Authentication Endpoints", 2),
  para("Authentication endpoints handle user login, token refresh, and session logout. These endpoints use security: [] override to allow unauthenticated access. All three endpoints accept and return application/json content type."),

  methodTag("POST"), para("Path: /auth/login", { bold: true, color: COLORS.dark }),
  para("Operation ID: authLogin | Tags: Authentication"),
  para("Authenticates a user with email and password credentials. Returns JWT access token (15 min) and refresh token (7 days). On successful authentication, the response includes the user's profile information (id, email, role, name, department)."),
  bullet("Request Body: LoginRequest schema (email: string[format=email], password: string[format=password, minLength=8])"),
  bullet("Response 200: LoginResponse schema containing TokenResponse (accessToken, refreshToken, tokenType, expiresIn, user)"),
  bullet("Response 401: ErrorResponse (AUTHENTICATION_REQUIRED)"),
  divider(),

  methodTag("POST"), para("Path: /auth/refresh", { bold: true, color: COLORS.dark }),
  para("Operation ID: authRefresh | Tags: Authentication"),
  para("Exchanges a valid refresh token for a new access token pair. Implements token rotation for security: the old refresh token is invalidated upon successful use, and a new pair is issued. If a previously invalidated refresh token is presented, all sessions for that user are terminated as a potential security measure."),
  bullet("Request Body: RefreshRequest schema (refreshToken: string)"),
  bullet("Response 200: TokenResponse schema (accessToken, refreshToken, tokenType, expiresIn)"),
  bullet("Response 401: $ref Unauthorized response (TOKEN_EXPIRED)"),
  divider(),

  methodTag("POST"), para("Path: /auth/logout", { bold: true, color: COLORS.dark }),
  para("Operation ID: authLogout | Tags: Authentication"),
  para("Invalidates the provided refresh token and terminates all active sessions for the user. The access token remains valid until its natural expiry but can be blocked client-side. Requires authentication to identify the user whose session is being terminated."),
  bullet("Request Body: object (refreshToken: string)"),
  bullet("Response 200: SuccessMessage schema (success: true, message: string)"),
  divider(),

  heading("2.2 Return Request Endpoints", 2),
  para("Return request endpoints support the complete lifecycle of a return request from creation through status updates and cancellation. The POST /returns endpoint triggers automatic validation upon creation, while PATCH /returns/{rmaNumber}/status follows a defined state machine for status transitions."),

  methodTag("POST"), para("Path: /returns", { bold: true, color: COLORS.dark }),
  para("Operation ID: createReturn | Tags: Return Requests"),
  para("Creates a new return request with automatic validation against business rules. The system checks return eligibility (window, product category, customer history), generates an RMA number, creates a shipping label, and triggers confirmation notifications. Supports multiple items per request (max 10 items) with individual photos (max 5 per item)."),
  bullet("Request Body: CreateReturnRequest schema (orderId, customerEmail, items[], preferredResolution, customerNotes)"),
  bullet("Items array: ReturnItem schema (orderItemId, productSku, productName, serialNumber, returnReason[enum], reasonDescription, productCondition[enum], purchasePrice, photos[])"),
  bullet("Return Reasons: DEFECTIVE, WRONG_ITEM, NOT_AS_DESCRIBED, CHANGED_MIND, BETTER_PRICE_FOUND, DAMAGED_IN_TRANSIT, WARRANTY_CLAIM, OTHER"),
  bullet("Response 201: ReturnResponse schema with ReturnCreated data (returnId, rmaNumber, status, validationResult, estimatedRefund, shippingLabel, createdAt, _links)"),
  bullet("Response 422: ValidationError schema with per-field validation details"),
  divider(),

  methodTag("GET"), para("Path: /returns", { bold: true, color: COLORS.dark }),
  para("Operation ID: listReturns | Tags: Return Requests"),
  para("Lists return requests with comprehensive filtering, sorting, and pagination. Supports 8 query parameters for flexible data retrieval. Returns paginated results with metadata. Used by agents for queue management and by managers for reporting."),
  bullet("Parameters: status[enum], fromDate[date], toDate[date], customerEmail[email], productCategory[enum], returnReason[enum], sortBy[enum], sortOrder[enum], page[integer], pageSize[integer]"),
  bullet("Product Categories: TV, SMARTPHONE, LAPTOP, TABLET, AUDIO, CAMERA, APPLIANCE, ACCESSORY, GAMING, OTHER"),
  bullet("Response 200: ReturnListResponse schema (returns[], pagination)"),
  divider(),

  methodTag("GET"), para("Path: /returns/{rmaNumber}", { bold: true, color: COLORS.dark }),
  para("Operation ID: getReturn | Tags: Return Requests"),
  para("Retrieves complete return details including current status, customer information, item details with inspection results, financial summary, and complete status timeline. Customers can access their own returns; agents and managers can access any return."),
  bullet("Path Parameter: rmaNumber (string, pattern: RMA-YYYY-NNNNNN)"),
  bullet("Response 200: ReturnDetailResponse schema (ReturnDetail with customer, items[], financialSummary, timeline[])"),
  bullet("Response 404: $ref NotFound response"),
  divider(),

  methodTag("PATCH"), para("Path: /returns/{rmaNumber}/status", { bold: true, color: COLORS.dark }),
  para("Operation ID: updateReturnStatus | Tags: Return Requests"),
  para("Updates return status following the state machine validation rules. Only authorized roles can perform specific transitions. The system automatically triggers notifications and downstream actions (e.g., refund initiation for INSPECTION_COMPLETE status). Supports optional condition grade and disposition fields for inspection-related transitions."),
  bullet("Path Parameter: rmaNumber (string)"),
  bullet("Request Body: StatusUpdateRequest schema (status[enum], conditionGrade[enum A/B/C/D], disposition[enum], inspectionNotes, inspectorId, photos[])"),
  bullet("Status Values: RECEIVED, INSPECTING, INSPECTION_COMPLETE, REFUND_PENDING, REFUND_PROCESSED, COMPLETED, REJECTED"),
  bullet("Response 200: StatusUpdateResponse (returnId, rmaNumber, previousStatus, newStatus, refundCalculation, nextActions[])"),
  bullet("Response 422: ErrorResponse (INVALID_STATUS_TRANSITION)"),
  divider(),

  methodTag("POST"), para("Path: /returns/{rmaNumber}/cancel", { bold: true, color: COLORS.dark }),
  para("Operation ID: cancelReturn | Tags: Return Requests"),
  para("Cancels an active return request. Only permitted before warehouse receiving (SUBMITTED and APPROVED statuses). Once the item has been received or is in transit, cancellation requires manager approval. A mandatory cancellation reason is recorded for audit trail purposes."),
  bullet("Path Parameter: rmaNumber (string)"),
  bullet("Request Body: CancelRequest schema (reason: string[maxLength=500], requestedBy: string)"),
  bullet("Response 200: CancelResponse (returnId, rmaNumber, status: CANCELLED, cancelledAt, cancelReason)"),
  bullet("Response 409: ErrorResponse (cannot cancel - item already received)"),
  divider(),

  heading("2.3 Validation Engine Endpoints", 2),
  para("The validation engine provides automated eligibility checking against configurable business rules. These endpoints support both pre-submission checks (without creating a return) and retrieval of current policy rule configurations."),

  methodTag("POST"), para("Path: /returns/validate", { bold: true, color: COLORS.dark }),
  para("Operation ID: validateReturn | Tags: Validation"),
  para("Performs pre-submission eligibility check without creating a return request. Evaluates all business rules and returns a detailed rule-by-rule assessment. This endpoint is critical for the customer self-service portal, providing instant feedback on return eligibility before the customer completes the full submission form."),
  bullet("Request Body: ValidateRequest schema (orderId, productSku, purchaseDate[date], customerEmail[email])"),
  bullet("Response 200: ValidationResponse with ValidationDetail (eligible: boolean, rules[], returnOptions[])"),
  bullet("Rules array: RuleEvaluation (ruleId, ruleName, passed, detail, policyReference)"),
  bullet("Return Options: REFUND, EXCHANGE, STORE_CREDIT"),
  divider(),

  methodTag("GET"), para("Path: /admin/policies/rules", { bold: true, color: COLORS.dark }),
  para("Operation ID: listPolicyRules | Tags: Admin"),
  para("Retrieves all configured validation rules with their parameters, activation status, and modification metadata. Returns paginated results. Used by admin console to display and manage policy configuration."),
  bullet("Response 200: RulesListResponse (rules[], pagination)"),
  bullet("Rules: PolicyRule schema (ruleId, name, description, parameters{}, active, priority, lastModified, modifiedBy)"),
  divider(),

  heading("2.4 Warehouse Operations Endpoints", 2),
  para("Warehouse endpoints support the receiving, inspection, and disposition workflow. These endpoints are optimized for mobile device usage by warehouse staff and support the barcode scanning integration for efficient item processing. The warehouse queue endpoint provides real-time workload management with SLA countdown timers."),

  methodTag("POST"), para("Path: /warehouse/receive", { bold: true, color: COLORS.dark }),
  para("Operation ID: receiveItem | Tags: Warehouse"),
  para("Records the receipt of a returned item by scanning the RMA barcode. The system verifies the RMA number against active return requests, displays expected item details for visual confirmation, and creates a warehouse receiving record. Initiates the inspection workflow with a deadline calculated based on SLA rules."),
  bullet("Request Body: ReceiveRequest schema (rmaNumber, receivedBy, receivingLocation, carrierName, trackingNumber, packageCondition[enum], notes)"),
  bullet("Package Conditions: GOOD, DAMAGED, WET, OPENED"),
  bullet("Response 201: ReceiveResponse (receivingId, rmaNumber, expectedItem, status, inspectionDeadline, nextAction, receivedAt)"),
  divider(),

  methodTag("POST"), para("Path: /warehouse/inspect", { bold: true, color: COLORS.dark }),
  para("Operation ID: inspectItem | Tags: Warehouse"),
  para("Records the quality inspection result including condition grade assignment (A/B/C/D) based on standardized grading criteria, photo evidence upload, and disposition decision. The system automatically determines refund eligibility: Grade A/B items are auto-approved for full refund, while Grade C/D items are routed to a manager for approval with partial refund or store credit options."),
  bullet("Request Body: InspectionRequest schema (rmaNumber, inspectionResult: InspectionResult)"),
  bullet("InspectionResult: conditionGrade[enum], gradingCriteria: GradingCriteria, disposition[enum], dispositionNotes, inspectorId, inspectionDuration[integer], photos[]"),
  bullet("GradingCriteria: packaging[ORIGINAL/INTACT/DAMAGED/MISSING], accessories[COMPLETE/PARTIAL/MISSING], cosmeticCondition[PERFECT/MINOR_MARKS/VISIBLE_WEAR/SIGNIFICANT_DAMAGE], functionalTest[PASSED/PARTIAL/FAILED]"),
  bullet("Response 200: InspectionResponse (inspectionId, conditionGrade, disposition, refundEligibility, inventoryAction, inspectedAt)"),
  divider(),

  methodTag("GET"), para("Path: /warehouse/queue", { bold: true, color: COLORS.dark }),
  para("Operation ID: getWarehouseQueue | Tags: Warehouse"),
  para("Retrieves the warehouse work queue of items pending inspection. Returns FIFO-sorted items with SLA countdown timers, priority indicators, and summary statistics. Designed for the warehouse dashboard to provide real-time workload visibility."),
  bullet("Response 200: WarehouseQueueResponse (queue: QueueItem[], summary: QueueSummary)"),
  bullet("QueueItem: rmaNumber, productName, receivedAt, slaDeadline, hoursRemaining, priority[NORMAL/HIGH/URGENT], returnReason"),
  bullet("QueueSummary: totalPending, overdue, dueToday, avgWaitTime"),
  divider(),

  heading("2.5 Refund Processing Endpoints", 2),
  para("Refund endpoints handle the financial aspect of return resolution. The calculation endpoint provides a preview of the refund amount before submission, while the process endpoint submits the refund to the ERP financial module via API integration. The detail endpoint provides comprehensive refund tracking including ERP transaction status and notification delivery history."),

  methodTag("POST"), para("Path: /refunds/calculate", { bold: true, color: COLORS.dark }),
  para("Operation ID: calculateRefund | Tags: Refunds"),
  para("Calculates the refund amount based on original purchase price, condition grade, return policy rules, and applicable deductions. Returns a detailed breakdown including condition-based deductions, restocking fees, loyalty bonuses, and alternative refund options (e.g., store credit with 5% bonus). This endpoint can be called before actual refund submission for preview purposes."),
  bullet("Request Body: RefundCalculationRequest (rmaNumber, originalAmount, conditionGrade[enum], returnReason, originalPaymentMethod[enum])"),
  bullet("Payment Methods: CREDIT_CARD, BANK_TRANSFER, CASH, STORE_CREDIT"),
  bullet("Response 200: RefundCalculationResponse with RefundBreakdown (calculationBreakdown, refundMethod, alternatives[])"),
  divider(),

  methodTag("POST"), para("Path: /refunds/process", { bold: true, color: COLORS.dark }),
  para("Operation ID: processRefund | Tags: Refunds"),
  para("Submits a refund request to the ERP financial module for execution. The refund amount is automatically calculated based on the inspection result and policy rules. Grade A/B refunds are auto-approved; Grade C/D require manager approval. Creates a financial transaction record with ERP cross-reference and triggers customer notification upon ERP confirmation of processing."),
  bullet("Request Body: ProcessRefundRequest (rmaNumber, refundMethod[enum], processedBy, notes)"),
  bullet("Response 201: ProcessRefundResponse with RefundProcessed (refundId, amount, currency, method, status, erpTransactionId, estimatedCompletion, _links)"),
  divider(),

  methodTag("GET"), para("Path: /refunds/{refundId}", { bold: true, color: COLORS.dark }),
  para("Operation ID: getRefund | Tags: Refunds"),
  para("Retrieves the current status and complete details of a refund transaction including ERP integration status, processing timeline, bank reference number, and notification delivery history. Used by agents for customer inquiries and by finance staff for reconciliation."),
  bullet("Path Parameter: refundId (string, pattern: REF-YYYY-NNNNNN)"),
  bullet("Response 200: RefundDetailResponse (refundId, rmaNumber, amount, currency, method, lastFourDigits, status[enum], erpTransactionId, bankReference, timeline[], notifications[])"),
  divider(),

  heading("2.6 Notification Endpoints", 2),
  para("Notification endpoints support the multi-channel customer notification system. Notifications are automatically triggered at key process milestones, but these endpoints also allow agents to manually send custom notifications or retrieve the complete notification history for troubleshooting and verification purposes."),

  methodTag("GET"), para("Path: /notifications/{rmaNumber}/history", { bold: true, color: COLORS.dark }),
  para("Operation ID: getNotificationHistory | Tags: Notifications"),
  para("Retrieves the complete notification history for a return request across both email and SMS channels. Returns delivery status tracking including send timestamps, delivery confirmations, and email open tracking. Used by agents to verify customer communication and troubleshoot delivery issues."),
  bullet("Path Parameter: rmaNumber (string)"),
  bullet("Response 200: NotificationHistoryResponse (rmaNumber, notifications: NotificationRecord[])"),
  divider(),

  methodTag("POST"), para("Path: /notifications/send", { bold: true, color: COLORS.dark }),
  para("Operation ID: sendNotification | Tags: Notifications"),
  para("Manually triggers a notification for a return request. Supports custom messages or predefined template IDs. Agents can request a copy of the notification sent to their own email for record-keeping. Used for ad-hoc communication needs such as status updates, additional information requests, or re-sending failed notifications."),
  bullet("Request Body: SendNotificationRequest (rmaNumber, channel[EMAIL/SMS/BOTH], templateId, customMessage, sendCopyToAgent[boolean])"),
  bullet("Response 201: SendNotificationResponse (notificationId, status, channel, recipient, estimatedDelivery)"),
  divider(),

  heading("2.7 Analytics and Reporting Endpoints", 2),
  para("Analytics endpoints provide management with real-time visibility into return operations. Access is restricted to Manager and Admin roles. The dashboard endpoint returns pre-aggregated KPI data with 15-minute cache refresh, while the category analytics endpoint supports flexible date range filtering. The report export endpoint generates PDF or Excel reports asynchronously."),

  methodTag("GET"), para("Path: /analytics/dashboard", { bold: true, color: COLORS.dark }),
  para("Operation ID: getDashboard | Tags: Analytics"),
  para("Retrieves the main management dashboard data including 6 key performance indicators, return volume trends, processing time metrics, top 5 return reasons with percentages, and active alerts. Data is refreshed from the aggregation cache every 15 minutes. This is the primary data source for the management analytics dashboard UI."),
  bullet("Response 200: DashboardResponse (kpis, trends, topReturnReasons[], alerts[], lastRefreshed)"),
  bullet("KPIs: totalReturnsThisMonth, avgProcessingTimeDays, customerSatisfactionScore, autoApprovalRate, refundTotalThisMonth, costPerReturn"),
  divider(),

  methodTag("GET"), para("Path: /analytics/returns/by-category", { bold: true, color: COLORS.dark }),
  para("Operation ID: getCategoryAnalytics | Tags: Analytics"),
  para("Retrieves return metrics broken down by product category. Includes return count, return rate (percentage of sales), total and average refund amounts, top return reason per category, and month-over-month trend comparison. Supports date range filtering via fromDate and toDate parameters."),
  bullet("Parameters: fromDate[date], toDate[date]"),
  bullet("Response 200: CategoryAnalyticsResponse (period{from, to}, categories: CategoryMetric[])"),
  bullet("CategoryMetric: category, returnCount, returnRate, totalRefundAmount, avgRefundAmount, topReason, trend"),
  divider(),

  methodTag("GET"), para("Path: /analytics/reports/export", { bold: true, color: COLORS.dark }),
  para("Operation ID: exportReport | Tags: Analytics"),
  para("Generates an analytics report in the specified format (PDF or Excel). Reports are generated asynchronously to avoid blocking the API. The initial response provides a report ID and estimated completion time. The client polls the report status endpoint to check completion and obtain the download URL."),
  bullet("Parameters: format[PDF/EXCEL], fromDate[date], toDate[date]"),
  bullet("Response 200: ReportExportResponse (reportId, type, format, status, downloadUrl[nullable], estimatedReadyAt)"),
  divider(),

  heading("2.8 Admin and Configuration Endpoints", 2),
  para("Admin endpoints support system configuration and governance functions including policy rule management, audit trail access, and user management. All endpoints in this group require ADMIN role authorization. Policy changes are tracked in the audit trail and take effect immediately for new return requests."),

  methodTag("PUT"), para("Path: /admin/policies/rules/{ruleId}", { bold: true, color: COLORS.dark }),
  para("Operation ID: updatePolicyRule | Tags: Admin"),
  para("Updates an existing validation rule configuration. Supports modification of rule parameters, activation status, and descriptive fields. All changes are tracked in the audit trail with before/after values. Modified rules take effect immediately for new requests. Existing in-progress return requests are not affected by rule changes."),
  bullet("Path Parameter: ruleId (string)"),
  bullet("Request Body: UpdateRuleRequest (name, parameters{object}, active[boolean], changeReason[string])"),
  bullet("Response 200: UpdateRuleResponse (ruleId, previousValues, newValues, effectiveFrom, modifiedBy, modifiedAt, auditTrailId)"),
  divider(),

  methodTag("GET"), para("Path: /admin/audit-trail", { bold: true, color: COLORS.dark }),
  para("Operation ID: getAuditTrail | Tags: Admin"),
  para("Retrieves the system audit trail with comprehensive filtering capabilities. The audit trail records all significant system events including policy changes, status transitions, financial transactions, authentication events, and user management actions. Each event includes the actor, action, affected resource, and IP address. Essential for compliance, security review, and incident investigation."),
  bullet("Parameters: eventType[enum], userId, fromDate[date], toDate[date], page, pageSize"),
  bullet("Event Types: POLICY_CHANGE, STATUS_CHANGE, AUTH_EVENT, FINANCIAL_TRANSACTION, USER_MANAGEMENT"),
  bullet("Response 200: AuditTrailResponse (events: AuditEvent[], pagination)"),
  divider(),

  methodTag("GET"), para("Path: /admin/users", { bold: true, color: COLORS.dark }),
  para("Operation ID: listUsers | Tags: Admin"),
  para("Retrieves the list of all system users with their roles, departments, status, and last login timestamps. Supports filtering by role and status. This endpoint is used by the admin console for user management and access control configuration. Does not expose sensitive authentication data (passwords, tokens)."),
  bullet("Parameters: role[enum], status[enum], page, pageSize"),
  bullet("Response 200: UserListResponse (users: UserRecord[], pagination)"),
  divider(),

  // 3. Data Model Reference
  heading("3. Data Model Reference (Components/Schemas)"),
  para("This section catalogs all 60+ schema definitions in the #/components/schemas/ section of the OpenAPI specification. Schemas are organized by their functional domain. Each schema definition includes all properties with their types, formats, constraints, and enumerated values. Schema references ($ref) enable composition and reuse across endpoints."),

  heading("3.1 Authentication Schemas", 2),
  createTable(
    ["Schema Name", "Type", "Properties", "Used By"],
    [
      ["LoginRequest", "object", "email[email, required], password[password, minLength:8, required]", "POST /auth/login"],
      ["LoginResponse", "object", "success[boolean], data[TokenResponse]", "POST /auth/login (200)"],
      ["TokenResponse", "object", "accessToken[string], refreshToken[string], tokenType[string], expiresIn[integer], user[UserInfo]", "LoginResponse, POST /auth/refresh"],
      ["RefreshRequest", "object", "refreshToken[string, required]", "POST /auth/refresh"],
      ["UserInfo", "object", "id[string], email[email], role[enum], name[string], department[string]", "TokenResponse"],
      ["SuccessMessage", "object", "success[boolean], message[string]", "POST /auth/logout (200)"],
    ]
  ),
  divider(),

  heading("3.2 Return Request Schemas", 2),
  createTable(
    ["Schema Name", "Type", "Key Properties", "Used By"],
    [
      ["CreateReturnRequest", "object", "orderId[required], customerEmail[required], items[1-10][required], preferredResolution[enum][required], customerNotes[max:1000]", "POST /returns"],
      ["ReturnItem", "object", "orderItemId, productSku, productName, serialNumber, returnReason[enum], reasonDescription, productCondition[enum], purchasePrice[number], photos[0-5]", "CreateReturnRequest.items"],
      ["ReturnResponse", "object", "success, data[ReturnCreated]", "POST /returns (201)"],
      ["ReturnCreated", "object", "returnId, rmaNumber, status[enum], validationResult, estimatedRefund, shippingLabel, createdAt, _links", "ReturnResponse.data"],
      ["ReturnDetailResponse", "object", "success, data[ReturnDetail]", "GET /returns/{rma} (200)"],
      ["ReturnDetail", "object", "returnId, rmaNumber, status, orderId, customer, items[], financialSummary, timeline[], createdAt, updatedAt", "ReturnDetailResponse.data"],
      ["ReturnListResponse", "object", "success, data{returns[], pagination}", "GET /returns (200)"],
      ["ReturnSummary", "object", "returnId, rmaNumber, status, customerName, productSku, returnReason, refundAmount, createdAt", "ReturnListResponse.data.returns"],
      ["StatusUpdateRequest", "object", "status[enum][required], conditionGrade[enum], disposition[enum], inspectionNotes, inspectorId, photos[]", "PATCH /returns/{rma}/status"],
      ["StatusUpdateResponse", "object", "returnId, rmaNumber, previousStatus, newStatus, refundCalculation, nextActions[], updatedAt", "PATCH (200)"],
      ["CancelRequest", "object", "reason[string, maxLength:500][required], requestedBy[string]", "POST /returns/{rma}/cancel"],
      ["CancelResponse", "object", "returnId, rmaNumber, status[CANCELLED], cancelledAt, cancelReason", "POST cancel (200)"],
    ]
  ),
  divider(),

  heading("3.3 Validation Schemas", 2),
  createTable(
    ["Schema Name", "Type", "Key Properties", "Used By"],
    [
      ["ValidateRequest", "object", "orderId[required], productSku[required], purchaseDate[date][required], customerEmail[email][required]", "POST /returns/validate"],
      ["ValidationResponse", "object", "success, data[ValidationDetail]", "POST /returns/validate (200)"],
      ["ValidationDetail", "object", "eligible[boolean], rules[RuleEvaluation[]], returnOptions[enum[]]", "ValidationResponse.data"],
      ["ValidationResult", "object", "eligible, purchaseDate[date], returnWindow[integer], daysRemaining[integer], policyViolations[]", "ReturnCreated.validationResult"],
      ["RuleEvaluation", "object", "ruleId, ruleName, passed[boolean], detail, policyReference", "ValidationDetail.rules"],
    ]
  ),
  divider(),

  heading("3.4 Warehouse Schemas", 2),
  createTable(
    ["Schema Name", "Type", "Key Properties", "Used By"],
    [
      ["ReceiveRequest", "object", "rmaNumber[required], receivedBy[required], receivingLocation[required], carrierName[required], trackingNumber, packageCondition[enum], notes", "POST /warehouse/receive"],
      ["ReceiveResponse", "object", "receivingId, rmaNumber, expectedItem[ExpectedItem], status, inspectionDeadline, nextAction, receivedAt", "POST receive (201)"],
      ["InspectionRequest", "object", "rmaNumber[required], inspectionResult[InspectionResult][required]", "POST /warehouse/inspect"],
      ["InspectionResult", "object", "conditionGrade[A/B/C/D][required], gradingCriteria[GradingCriteria], disposition[enum][required], dispositionNotes, inspectorId, inspectionDuration[integer], photos[InspectionPhoto[]]", "InspectionRequest"],
      ["GradingCriteria", "object", "packaging[enum], accessories[enum], cosmeticCondition[enum], functionalTest[enum]", "InspectionResult"],
      ["InspectionResponse", "object", "rmaNumber, inspectionId, conditionGrade, disposition, refundEligibility, inventoryAction, inspectedAt", "POST inspect (200)"],
      ["QueueItem", "object", "rmaNumber, productName, receivedAt, slaDeadline, hoursRemaining, priority[enum], returnReason", "WarehouseQueueResponse"],
      ["QueueSummary", "object", "totalPending[integer], overdue[integer], dueToday[integer], avgWaitTime[string]", "WarehouseQueueResponse"],
    ]
  ),
  divider(),

  heading("3.5 Refund Schemas", 2),
  createTable(
    ["Schema Name", "Type", "Key Properties", "Used By"],
    [
      ["RefundCalculationRequest", "object", "rmaNumber, originalAmount[number], conditionGrade[enum], returnReason, originalPaymentMethod[enum]", "POST /refunds/calculate"],
      ["RefundCalculationResponse", "object", "success, data[RefundBreakdown]", "POST calculate (200)"],
      ["RefundBreakdown", "object", "rmaNumber, calculationBreakdown, refundMethod[RefundMethodInfo], alternatives[RefundAlternative[]]", "RefundCalculationResponse.data"],
      ["ProcessRefundRequest", "object", "rmaNumber[required], refundMethod[enum][required], processedBy[required], notes", "POST /refunds/process"],
      ["ProcessRefundResponse", "object", "success, data[RefundProcessed]", "POST process (201)"],
      ["RefundDetailResponse", "object", "success, data[RefundDetail]", "GET /refunds/{id} (200)"],
    ]
  ),
  divider(),

  heading("3.6-3.8 Notification, Analytics, Admin Schemas", 2),
  createTable(
    ["Schema Name", "Section", "Key Properties"],
    [
      ["NotificationHistoryResponse", "Notifications", "rmaNumber, notifications[NotificationRecord[]]"],
      ["NotificationRecord", "Notifications", "id, type, channel[EMAIL/SMS], recipient, subject, sentAt, deliveryStatus[enum], openedAt"],
      ["SendNotificationRequest", "Notifications", "rmaNumber, channel[EMAIL/SMS/BOTH], templateId, customMessage, sendCopyToAgent"],
      ["SendNotificationResponse", "Notifications", "notificationId, status, channel, recipient, estimatedDelivery"],
      ["DashboardResponse", "Analytics", "success, data[DashboardData]"],
      ["DashboardData", "Analytics", "kpis{}, trends{}, topReturnReasons[], alerts[], lastRefreshed"],
      ["CategoryAnalyticsResponse", "Analytics", "period{from, to}, categories[CategoryMetric[]]"],
      ["CategoryMetric", "Analytics", "category, returnCount, returnRate, totalRefundAmount, avgRefundAmount, topReason, trend"],
      ["ReportExportResponse", "Analytics", "reportId, type, format, status, downloadUrl[nullable], estimatedReadyAt"],
      ["UpdateRuleRequest", "Admin", "name, parameters{object}, active[boolean], changeReason"],
      ["UpdateRuleResponse", "Admin", "ruleId, previousValues, newValues, effectiveFrom, modifiedBy, auditTrailId"],
      ["RulesListResponse", "Admin", "rules[PolicyRule[]], pagination"],
      ["PolicyRule", "Admin", "ruleId, name, description, parameters{}, active, priority, lastModified, modifiedBy"],
      ["AuditTrailResponse", "Admin", "events[AuditEvent[]], pagination"],
      ["AuditEvent", "Admin", "auditId, eventType, userId, userName, action, resource, details, ipAddress, timestamp"],
      ["UserListResponse", "Admin", "users[UserRecord[]], pagination"],
      ["UserRecord", "Admin", "id, name, email, role, department, status, lastLoginAt"],
    ]
  ),
  divider(),

  heading("3.9 Shared and Reusable Schemas", 2),
  createTable(
    ["Schema Name", "Properties", "Referenced By"],
    [
      ["CustomerInfo", "name[string], email[email], phone[pattern:+994XXXXXXXXX]", "ReturnDetail.customer"],
      ["ReturnItemDetail", "orderItemId, productSku, productName, serialNumber, returnReason, conditionGrade[A/B/C/D], disposition", "ReturnDetail.items[]"],
      ["FinancialSummary", "originalAmount[number], refundAmount[number], refundMethod[string], refundStatus[string]", "ReturnDetail.financialSummary"],
      ["TimelineEvent", "status[string], timestamp[date-time], actor[string]", "ReturnDetail.timeline[], RefundDetail.timeline[]"],
      ["ShippingLabel", "labelUrl[uri], expiryDate[date], returnAddress[string]", "ReturnCreated.shippingLabel"],
      ["Pagination", "page[integer], pageSize[integer], totalItems[integer], totalPages[integer], hasNext[boolean], hasPrev[boolean]", "All list responses"],
      ["RefundCalculation", "originalAmount, conditionGrade, refundPercentage[integer], refundAmount, refundMethod", "StatusUpdateResponse"],
      ["RefundEligibility", "autoApproved[boolean], refundPercentage[integer], refundAmount, approvalRequired[boolean]", "InspectionResponse"],
      ["InventoryAction", "action[string], newCondition[string], restockLocation[string]", "InspectionResponse"],
      ["ExpectedItem", "productName, productSku, serialNumber, customerName", "ReceiveResponse"],
      ["GradingCriteria", "packaging[enum], accessories[enum], cosmeticCondition[enum], functionalTest[enum]", "InspectionResult"],
      ["InspectionPhoto", "type[GENERAL/DEFECT/PACKAGING/ACCESSORY], url[uri], annotation[string]", "InspectionResult.photos[]"],
      ["CalculationBreakdown", "originalAmount, conditionDeduction, conditionGrade, conditionRefundPercentage, restockingFee, loyaltyBonus, totalRefundAmount, currency", "RefundBreakdown"],
      ["RefundMethodInfo", "type, lastFourDigits, cardNetwork, estimatedProcessingDays", "RefundBreakdown"],
      ["RefundAlternative", "method, amount, bonusPercentage[integer], bonusAmount", "RefundBreakdown.alternatives[]"],
      ["RefundProcessed", "refundId, rmaNumber, amount, currency, method, status, erpTransactionId, estimatedCompletion, processedAt, _links", "ProcessRefundResponse"],
    ]
  ),
  divider(),

  heading("3.10 Error Response Schemas", 2),
  para("All error responses follow a consistent structure defined by the ErrorResponse and ValidationError schemas. The error object includes a machine-readable code (enum), a human-readable message, an optional details array for field-level validation errors, a timestamp for logging, a request ID for support reference, and a documentation URL for developer guidance."),
  createTable(
    ["Schema", "Used For", "Key Fields"],
    [
      ["ErrorResponse", "All 4xx and 5xx errors", "success[false], error{code[enum], message, details[], timestamp, requestId, documentationUrl}"],
      ["ValidationError", "422 validation failures", "success[false], error{code: VALIDATION_ERROR, message, details{field, rule, message}[], timestamp, requestId}"],
    ]
  ),
  divider(),
  para("Error code enumeration values: AUTHENTICATION_REQUIRED, TOKEN_EXPIRED, INSUFFICIENT_PERMISSIONS, RESOURCE_NOT_FOUND, VALIDATION_ERROR, RETURN_WINDOW_EXCEEDED, PRODUCT_NOT_ELIGIBLE, DUPLICATE_RETURN_REQUEST, INVALID_STATUS_TRANSITION, RATE_LIMIT_EXCEEDED, ERP_INTEGRATION_ERROR, INTERNAL_ERROR"),

  // 4. Parameter Reference
  heading("4. Parameter Reference"),
  para("The specification defines 11 reusable parameters in #/components/parameters/ that are referenced by multiple endpoints. Parameter definitions include the name, location (path, query), data type, format, constraints, and description. This section provides a complete reference of all parameter definitions."),
  createTable(
    ["Parameter Name", "Location", "Type", "Format/Constraints", "Used By"],
    [
      ["RmaNumber", "path", "string", "pattern: RMA-YYYY-NNNNNN", "GET/PATCH/POST returns/{rma}"],
      ["StatusFilter", "query", "string", "enum: 10 status values", "GET /returns"],
      ["FromDate", "query", "string", "format: date (ISO 8601)", "GET /returns, /analytics/*"],
      ["ToDate", "query", "string", "format: date (ISO 8601)", "GET /returns, /analytics/*"],
      ["CustomerEmailFilter", "query", "string", "format: email", "GET /returns"],
      ["ProductCategoryFilter", "query", "string", "enum: 10 categories", "GET /returns"],
      ["ReturnReasonFilter", "query", "string", "enum: 8 reasons", "GET /returns"],
      ["SortBy", "query", "string", "enum: createdAt/refundAmount/customerName/status, default: createdAt", "GET /returns"],
      ["SortOrder", "query", "string", "enum: asc/desc, default: desc", "GET /returns"],
      ["Page", "query", "integer", "min: 1, default: 1", "All list endpoints"],
      ["PageSize", "query", "integer", "min: 1, max: 100, default: 20", "All list endpoints"],
    ]
  ),
  divider(),

  // 5. Security Schemes
  heading("5. Security Schemes"),
  para("The specification defines one security scheme in #/components/securitySchemes/:"),
  ...codeBlock("securitySchemes:\n  BearerAuth:\n    type: http\n    scheme: bearer\n    bearerFormat: JWT\n    description: |\n      JWT access token obtained via POST /auth/login.\n      Token lifetime: 15 minutes. Refresh via POST /auth/refresh."),
  divider(),
  para("The security scheme is applied globally using the top-level security array:"),
  ...codeBlock("security:\n  - BearerAuth: []"),
  divider(),
  para("Endpoints that override global security (public endpoints):"),
  bullet("POST /auth/login - security: [] (no authentication required)"),
  bullet("POST /auth/refresh - security: [] (no authentication required)"),
  para("All other endpoints inherit the BearerAuth requirement and will return HTTP 401 if the Authorization header is missing or contains an invalid/expired token."),

  // 6. Reusable Responses
  heading("6. Reusable Responses"),
  para("The specification defines 3 reusable responses in #/components/responses/ that are referenced by multiple endpoints using $ref. These responses provide consistent error handling documentation and include example payloads for Swagger UI display."),
  createTable(
    ["Response Name", "HTTP Status", "Description", "Schema", "Referenced By"],
    [
      ["Unauthorized", "401", "Authentication required or token expired", "ErrorResponse", "POST /auth/refresh, all authenticated endpoints"],
      ["NotFound", "404", "Requested resource not found", "ErrorResponse", "GET /returns/{rma}, GET /refunds/{id}"],
      ["Forbidden", "403", "Insufficient role permissions", "ErrorResponse", "All role-restricted endpoints"],
    ]
  ),
  divider(),

  // 7. Complete YAML
  heading("7. Complete OpenAPI 3.0 YAML Specification"),
  para("The following section contains the complete, machine-readable OpenAPI 3.0.3 YAML specification for the Kontakt Home Return Management System API. This YAML can be copied and saved as a .yaml file for direct import into Swagger UI, code generation tools, API gateways, and testing platforms. The specification is fully self-contained with all schemas, parameters, and responses defined inline."),
  para("To use this specification: (1) Copy the YAML content below, (2) Save as kontakt-home-rms-api.yaml, (3) Import into Swagger UI at https://editor.swagger.io/, or (4) Use with any OpenAPI 3.0 compatible tool."),
  divider(),
  ...codeBlock(fullYaml),
  divider(),

  // 8. How to Use
  heading("8. How to Use This Specification"),

  heading("8.1 Swagger UI", 2),
  para("Swagger UI provides an interactive documentation interface where developers can explore the API, view schema definitions, and execute test requests directly from the browser. To set up Swagger UI with this specification:"),
  bullet("Option 1 - Online Editor: Copy the complete YAML from Section 7 and paste it into the Swagger Editor at https://editor.swagger.io/. This provides immediate visualization and an interactive Try It Out interface."),
  bullet("Option 2 - Docker Deployment: Deploy a local Swagger UI instance using Docker with the command: docker run -p 8080:8080 -e SWAGGER_JSON=/api.yaml -v $(pwd)/kontakt-home-rms-api.yaml:/api.yaml swaggerapi/swagger-ui. Access at http://localhost:8080."),
  bullet("Option 3 - Embedded: Embed Swagger UI into the RMS web application by serving the YAML file from a static endpoint and configuring the Swagger UI JavaScript bundle to load it."),
  para("The Swagger UI interface provides: (1) Interactive API documentation with all 24 endpoints, (2) Schema model visualization with example values, (3) Try It Out feature for sending test requests, (4) Response schema documentation for all status codes, (5) Authentication configuration for Bearer token input."),

  heading("8.2 Code Generation", 2),
  para("The OpenAPI specification can be used to generate client SDKs and server stubs in multiple programming languages. This eliminates manual API client coding and ensures consistency between the specification and implementation. The recommended tools are:"),
  bullet("OpenAPI Generator (openapi-generator.tech): Supports 60+ languages including TypeScript, Python, Java, C#, Go, PHP, Ruby. Install via: npm install @openapitools/openapi-generator-cli. Example: openapi-generator-cli generate -i kontakt-home-rms-api.yaml -g typescript-axios -o ./generated/ts-client/"),
  bullet("Swagger Codegen (swagger.io/tools/swagger-codegen): The original code generation tool. Supports 40+ languages. Example: java -jar swagger-codegen-cli.jar generate -i kontakt-home-rms-api.yaml -l typescript-fetch -o ./typescript-client/"),
  para("Generated client SDKs include: type-safe request/response models, authentication handling, error handling, pagination utilities, and complete API method coverage. This significantly reduces frontend development time and ensures API contract compliance."),

  heading("8.3 API Testing with Postman", 2),
  para("The OpenAPI specification can be directly imported into Postman for API testing. Postman provides a visual interface for creating and organizing API requests, managing environments, and automating test suites."),
  bullet("Import: Open Postman > Import > Select the YAML file or paste the YAML URL. Postman will automatically create a collection with all 24 endpoints organized by tag groups."),
  bullet("Environments: Create separate environments for Development, Staging, and Production with the appropriate base URL and test credentials."),
  bullet("Authentication: Configure a Postman pre-request script to automatically obtain and inject JWT tokens: var response = pm.sendRequest({url: pm.environment.get('baseUrl') + '/auth/login', method: 'POST', header: {'Content-Type': 'application/json'}, body: {mode: 'raw', raw: JSON.stringify({email: pm.environment.get('email'), password: pm.environment.get('password')})}}, function(err, res) { pm.environment.set('accessToken', res.json().data.accessToken); });"),
  bullet("Tests: Write Postman test scripts using pm.test() to validate responses, check status codes, and verify schema compliance for automated regression testing."),

  heading("8.4 API Client SDK Generation", 2),
  para("For frontend development, generating a type-safe API client SDK from the OpenAPI specification provides the best developer experience. The recommended approach for the Kontakt Home RMS project:"),
  bullet("React Frontend: Use openapi-generator with typescript-axios target to generate an Axios-based client with full TypeScript types. This provides compile-time type checking and IDE autocomplete for all API calls."),
  bullet("Mobile Warehouse App: Use openapi-generator with typescript-fetch or dart-dio target depending on the mobile framework (React Native or Flutter)."),
  bullet("Agent Console: Use the same typescript-axios client as the React frontend, sharing the generated code as a common package."),
  para("The generated SDK should be committed to the version control repository and regenerated whenever the OpenAPI specification is updated. A CI/CD pipeline step should validate that the generated SDK compiles successfully, catching any specification errors before deployment."),

  // 9. Appendix
  heading("9. Appendix: Enumeration Values"),
  para("This appendix provides a consolidated reference of all enumeration (enum) values used across the API specification, organized by their domain context."),

  heading("9.1 Return Status Values", 3),
  createTable(["Value", "Description", "Reachable From", "Transitions To"],
    [["SUBMITTED", "Return request submitted, pending validation", "Customer action", "APPROVED, REJECTED, CANCELLED"], ["APPROVED", "Validation passed, RMA issued", "SUBMITTED", "RECEIVED, CANCELLED"], ["REJECTED", "Validation failed, return not eligible", "SUBMITTED", "Terminal"], ["RECEIVED", "Item received at warehouse", "APPROVED", "INSPECTING"], ["INSPECTING", "Quality inspection in progress", "RECEIVED", "INSPECTION_COMPLETE"], ["INSPECTION_COMPLETE", "Inspection done, awaiting refund", "INSPECTING", "REFUND_PENDING, COMPLETED"], ["REFUND_PENDING", "Awaiting manager approval (Grade C/D)", "INSPECTION_COMPLETE", "REFUND_PROCESSED, REJECTED"], ["REFUND_PROCESSED", "Refund submitted to ERP", "REFUND_PENDING, INSPECTION_COMPLETE", "COMPLETED"], ["COMPLETED", "Return fully resolved", "REFUND_PROCESSED", "Terminal"], ["CANCELLED", "Return cancelled by customer", "SUBMITTED, APPROVED", "Terminal"]]
  ),
  divider(),

  heading("9.2 Return Reason Values", 3),
  createTable(["Value", "Description", "Typical Condition Grade Distribution"],
    [["DEFECTIVE", "Product has a manufacturing or functional defect", "A: 10%, B: 40%, C: 35%, D: 15%"], ["WRONG_ITEM", "Customer received a different product than ordered", "A: 70%, B: 25%, C: 5%"], ["NOT_AS_DESCRIBED", "Product does not match the online description or listing", "A: 20%, B: 50%, C: 25%, D: 5%"], ["CHANGED_MIND", "Customer no longer wants the product", "A: 60%, B: 35%, C: 5%"], ["BETTER_PRICE_FOUND", "Customer found a lower price elsewhere", "A: 80%, B: 18%, C: 2%"], ["DAMAGED_IN_TRANSIT", "Product was damaged during shipping", "A: 5%, B: 20%, C: 50%, D: 25%"], ["WARRANTY_CLAIM", "Return under manufacturer warranty", "A: 15%, B: 30%, C: 40%, D: 15%"], ["OTHER", "Any other reason not covered by the above", "Varies"]]
  ),
  divider(),

  heading("9.3 User Role Values", 3),
  createTable(["Role", "Description", "Access Level"],
    [["CUSTOMER", "End customer submitting return requests", "Own returns only, pre-check validation"], ["SUPPORT_AGENT", "Customer service agent processing returns", "All returns, status updates, notifications"], ["WAREHOUSE_STAFF", "Warehouse team member for receiving and inspection", "Warehouse endpoints, read-only returns"], ["MANAGER", "Operations manager with oversight responsibilities", "All returns, refunds, analytics, audit trail"], ["ADMIN", "System administrator for configuration and user management", "Full access including policy rules and users"]]
  ),
  divider(),

  heading("9.4 Product Category Values", 3),
  createTable(["Category", "Typical Return Rate", "Average Refund Amount (AZN)"],
    [["TV", "5.8%", "1,131"], ["SMARTPHONE", "4.2%", "554"], ["LAPTOP", "3.8%", "980"], ["TABLET", "3.5%", "420"], ["AUDIO", "3.2%", "280"], ["CAMERA", "2.9%", "650"], ["APPLIANCE", "4.5%", "380"], ["ACCESSORY", "2.1%", "85"], ["GAMING", "3.9%", "520"], ["OTHER", "2.5%", "310"]]
  ),
  divider(),

  heading("9.5 Payment Method Values", 3),
  createTable(["Method", "Description", "Typical Processing Time"],
    [["CREDIT_CARD", "Refund to original credit card", "1-3 business days"], ["BANK_TRANSFER", "Refund to customer bank account", "2-5 business days"], ["STORE_CREDIT", "Store credit with optional 5% bonus", "Immediate"], ["CASH", "Cash refund at retail location", "Same day (in-store)"]]
  ),
];

// ========== ASSEMBLE DOCUMENT ==========
const doc = new docx.Document({
  creator: "Zamir Jamalov",
  title: "Swagger / OpenAPI 3.0 Specification - Kontakt Home Return Management System",
  description: "Complete OpenAPI 3.0.3 specification with narrative documentation for the Return Management System API",
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

const outputPath = "/home/z/my-project/ba-practice/Kontakt_Home_Swagger_OpenAPI_Specification_Return_Management_System.docx";
docx.Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outputPath, buffer);
  console.log("Document generated successfully:", outputPath);
  console.log("File size:", (buffer.length / 1024).toFixed(1), "KB");
});
