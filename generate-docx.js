const fs = require("fs");
const path = require("path");
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  ShadingType,
  VerticalAlign,
  TableLayoutType,
  PageBreak,
  Tab,
  TabStopType,
  TabStopPosition,
  Header,
  Footer,
  PageNumber,
  NumberFormat,
} = require("docx");

// ============================================================
// CONSTANTS
// ============================================================
const BLUE = "2A6496";
const DARK_BLUE = "1B3A5C";
const LIGHT_BLUE = "F2F7FC";
const WHITE = "FFFFFF";
const GRAY = "CCCCCC";
const DARK_GRAY = "333333";
const MED_GRAY = "666666";
const FONT = "Calibri";
const FONT_SIZE_TITLE = 48;
const FONT_SIZE_SUBTITLE = 28;
const FONT_SIZE_H1 = 32;
const FONT_SIZE_H2 = 26;
const FONT_SIZE_H3 = 22;
const FONT_SIZE_BODY = 21;
const FONT_SIZE_SMALL = 18;
const FONT_SIZE_TABLE = 20;
const LINE_SPACING = 276;
const PAGE_WIDTH = 11906;
const PAGE_HEIGHT = 16838;
const MARGIN = 1440;
const CELL_PADDING = 80;

const today = new Date().toISOString().split("T")[0];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function thinBorder() {
  return {
    style: BorderStyle.SINGLE,
    size: 1,
    color: GRAY,
  };
}

function noBorder() {
  return { style: BorderStyle.NONE, size: 0, color: WHITE };
}

function tableBorders() {
  return {
    top: thinBorder(),
    bottom: thinBorder(),
    left: thinBorder(),
    right: thinBorder(),
    insideHorizontal: thinBorder(),
    insideVertical: thinBorder(),
  };
}

function createTitle(title, subtitle) {
  const children = [
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: title,
          font: FONT,
          size: FONT_SIZE_TITLE,
          bold: true,
          color: BLUE,
        }),
      ],
    }),
  ];
  if (subtitle) {
    children.push(
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: subtitle,
            font: FONT,
            size: FONT_SIZE_SUBTITLE,
            color: MED_GRAY,
          }),
        ],
      })
    );
  }
  return children;
}

function createMetadata(projectName, docVersion = "1.0", author = "Embafinans BA Team") {
  const metaTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      createMetaRow("Project", projectName),
      createMetaRow("Document Version", docVersion),
      createMetaRow("Date", today),
      createMetaRow("Author", author),
      createMetaRow("Status", "Draft"),
    ],
  });
  return [
    new Paragraph({
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: "Document Information",
          font: FONT,
          size: FONT_SIZE_H2,
          bold: true,
          color: BLUE,
        }),
      ],
    }),
    metaTable,
    new Paragraph({
      spacing: { before: 100, after: 100 },
      children: [
        new TextRun({
          text: "Confidentiality Notice: This document contains confidential information belonging to Embafinans. Unauthorized distribution is prohibited.",
          font: FONT,
          size: FONT_SIZE_SMALL,
          italics: true,
          color: MED_GRAY,
        }),
      ],
    }),
    new Paragraph({ children: [new TextRun({ break: 1 })] }),
  ];
}

function createMetaRow(label, value) {
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 30, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.SOLID, color: LIGHT_BLUE },
        borders: { top: thinBorder(), bottom: thinBorder(), left: thinBorder(), right: thinBorder() },
        margins: { top: CELL_PADDING, bottom: CELL_PADDING, left: CELL_PADDING, right: CELL_PADDING },
        children: [
          new Paragraph({
            children: [new TextRun({ text: label, font: FONT, size: FONT_SIZE_BODY, bold: true, color: DARK_BLUE })],
          }),
        ],
      }),
      new TableCell({
        width: { size: 70, type: WidthType.PERCENTAGE },
        borders: { top: thinBorder(), bottom: thinBorder(), left: thinBorder(), right: thinBorder() },
        margins: { top: CELL_PADDING, bottom: CELL_PADDING, left: CELL_PADDING, right: CELL_PADDING },
        children: [
          new Paragraph({
            children: [new TextRun({ text: value, font: FONT, size: FONT_SIZE_BODY, color: DARK_GRAY })],
          }),
        ],
      }),
    ],
  });
}

function heading1(text) {
  return new Paragraph({
    spacing: { before: 400, after: 200, line: LINE_SPACING },
    children: [
      new TextRun({
        text: text,
        font: FONT,
        size: FONT_SIZE_H1,
        bold: true,
        color: BLUE,
      }),
    ],
  });
}

function heading2(text) {
  return new Paragraph({
    spacing: { before: 300, after: 150, line: LINE_SPACING },
    children: [
      new TextRun({
        text: text,
        font: FONT,
        size: FONT_SIZE_H2,
        bold: true,
        color: DARK_BLUE,
      }),
    ],
  });
}

function heading3(text) {
  return new Paragraph({
    spacing: { before: 200, after: 100, line: LINE_SPACING },
    children: [
      new TextRun({
        text: text,
        font: FONT,
        size: FONT_SIZE_H3,
        bold: true,
        color: DARK_GRAY,
      }),
    ],
  });
}

function bodyText(text) {
  return new Paragraph({
    spacing: { after: 120, line: LINE_SPACING },
    children: [
      new TextRun({
        text: text,
        font: FONT,
        size: FONT_SIZE_BODY,
        color: DARK_GRAY,
      }),
    ],
  });
}

function boldBodyText(label, text) {
  return new Paragraph({
    spacing: { after: 120, line: LINE_SPACING },
    children: [
      new TextRun({ text: label, font: FONT, size: FONT_SIZE_BODY, bold: true, color: DARK_GRAY }),
      new TextRun({ text: text, font: FONT, size: FONT_SIZE_BODY, color: DARK_GRAY }),
    ],
  });
}

function bulletPoint(text, level = 0) {
  return new Paragraph({
    spacing: { after: 80, line: LINE_SPACING },
    indent: { left: 720 + level * 360 },
    children: [
      new TextRun({ text: "\u2022  ", font: FONT, size: FONT_SIZE_BODY, color: BLUE }),
      new TextRun({ text: text, font: FONT, size: FONT_SIZE_BODY, color: DARK_GRAY }),
    ],
  });
}

function numberedItem(number, text) {
  return new Paragraph({
    spacing: { after: 100, line: LINE_SPACING },
    indent: { left: 360 },
    children: [
      new TextRun({ text: `${number}.  `, font: FONT, size: FONT_SIZE_BODY, bold: true, color: BLUE }),
      new TextRun({ text: text, font: FONT, size: FONT_SIZE_BODY, color: DARK_GRAY }),
    ],
  });
}

function emptyLine() {
  return new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: "", size: 10 })] });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

// Table helper for gap analysis and data mapping
function createDataTable(headers, rows, colWidths) {
  const totalWidth = PAGE_WIDTH - 2 * MARGIN;
  const colSizes = colWidths || headers.map(() => Math.floor(totalWidth / headers.length));

  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) =>
      new TableCell({
        width: { size: colSizes[i], type: WidthType.DXA },
        shading: { type: ShadingType.SOLID, color: BLUE },
        borders: tableBorders(),
        margins: { top: CELL_PADDING, bottom: CELL_PADDING, left: CELL_PADDING, right: CELL_PADDING },
        verticalAlign: VerticalAlign.CENTER,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { line: LINE_SPACING },
            children: [new TextRun({ text: h, font: FONT, size: FONT_SIZE_TABLE, bold: true, color: WHITE })],
          }),
        ],
      })
    ),
  });

  const dataRows = rows.map((row, ri) =>
    new TableRow({
      children: row.map((cell, ci) =>
        new TableCell({
          width: { size: colSizes[ci], type: WidthType.DXA },
          shading: { type: ShadingType.SOLID, color: ri % 2 === 0 ? WHITE : LIGHT_BLUE },
          borders: tableBorders(),
          margins: { top: CELL_PADDING, bottom: CELL_PADDING, left: CELL_PADDING, right: CELL_PADDING },
          children: [
            new Paragraph({
              spacing: { line: LINE_SPACING },
              children: [new TextRun({ text: cell, font: FONT, size: FONT_SIZE_TABLE, color: DARK_GRAY })],
            }),
          ],
        })
      ),
    })
  );

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...dataRows],
    layout: TableLayoutType.AUTOFIT,
  });
}

function createDocument() {
  return {
    styles: {
      default: {
        document: {
          run: { font: FONT, size: FONT_SIZE_BODY, color: DARK_GRAY },
          paragraph: { spacing: { line: LINE_SPACING } },
        },
      },
    },
    sections: [],
  };
}

function addSection(docConfig, children) {
  docConfig.sections.push({
    properties: {
      page: {
        size: { width: PAGE_WIDTH, height: PAGE_HEIGHT, orientation: "portrait" },
        margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
      },
    },
    headers: {
      default: new Header({
        children: [
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({ text: "Embafinans \u2014 Confidential", font: FONT, size: FONT_SIZE_SMALL, italics: true, color: MED_GRAY }),
            ],
          }),
        ],
      }),
    },
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "Page ", font: FONT, size: FONT_SIZE_SMALL, color: MED_GRAY }),
              new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: FONT_SIZE_SMALL, color: MED_GRAY }),
              new TextRun({ text: " of ", font: FONT, size: FONT_SIZE_SMALL, color: MED_GRAY }),
              new TextRun({ children: [PageNumber.TOTAL_PAGES], font: FONT, size: FONT_SIZE_SMALL, color: MED_GRAY }),
            ],
          }),
        ],
      }),
    },
    children,
  });
}

async function writeDoc(docConfig, filePath) {
  const doc = new Document(docConfig);
  const buffer = await Packer.toBuffer(doc);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, buffer);
  const stats = fs.statSync(filePath);
  console.log(`  [OK] ${path.basename(filePath)} (${(stats.size / 1024).toFixed(1)} KB)`);
}

// ============================================================
// FILE 1: BRD Credit Scoring
// ============================================================
async function generateBRD_Credit_Scoring() {
  const doc = createDocument();
  const baseDir = "/home/z/my-project/embafinans/01-credit-scoring";
  const filePath = path.join(baseDir, "BRD_Credit_Scoring.docx");

  const children = [
    ...createTitle("Business Requirements Document", "BNPL Credit Scoring & Pre-Screen Risk Assessment"),
    ...createMetadata("Embafinans Credit Scoring System", "1.0"),

    // Table of Contents
    heading1("Table of Contents"),
    numberedItem(1, "Executive Summary"),
    numberedItem(2, "Business Goals"),
    numberedItem(3, "Scope"),
    numberedItem(4, "Stakeholders"),
    numberedItem(5, "Business Requirements"),
    numberedItem(6, "Assumptions & Constraints"),
    numberedItem(7, "Glossary"),
    pageBreak(),

    // 1. Executive Summary
    heading1("1. Executive Summary"),
    bodyText(
      "Embafinans seeks to implement an automated credit scoring and pre-screen risk assessment system to support its Buy-Now-Pay-Later (BNPL) and goods loan products. The current manual credit assessment process is time-consuming, inconsistent, and unable to scale with growing application volumes. This Business Requirements Document (BRD) defines the strategic objectives, functional scope, and key requirements for the proposed automated credit scoring system."
    ),
    bodyText(
      "The system will leverage multi-factor risk assessment methodologies including credit bureau scores, income verification, debt-to-income ratios, employment stability, and existing loan obligations to produce a standardized credit score. Based on predefined thresholds, the system will automatically approve, route for manual review, or reject credit applications, significantly reducing processing time and improving decision consistency."
    ),
    bodyText(
      "This document serves as the authoritative source of business requirements and will be used as the foundation for the subsequent Functional Requirements Document (FRD), technical design, and implementation planning."
    ),

    // 2. Business Goals
    heading1("2. Business Goals"),
    bodyText("The following business goals have been identified for the credit scoring system:"),
    heading3("2.1 Speed of Credit Decisions"),
    bulletPoint("Reduce average credit decision time from 5-7 business days to under 60 seconds for automated decisions."),
    bulletPoint("Achieve 2x faster credit decisions compared to the current manual process."),
    heading3("2.2 Reduce Manual Review Burden"),
    bulletPoint("Decrease manual review workload by at least 60% through automated pre-screening and scoring."),
    bulletPoint("Enable credit analysts to focus on borderline cases that genuinely require human judgment."),
    heading3("2.3 Increase Approval Rate"),
    bulletPoint("Increase overall application approval rate by 15-20% through consistent and objective scoring."),
    bulletPoint("Reduce false rejections caused by subjective manual assessment."),
    heading3("2.4 Risk Management"),
    bulletPoint("Maintain or improve current default rates while increasing throughput."),
    bulletPoint("Establish a standardized, auditable risk assessment framework."),
    heading3("2.5 Operational Efficiency"),
    bulletPoint("Eliminate dependency on physical committee meetings for standard approvals."),
    bulletPoint("Enable 24/7 credit decisioning capability."),

    // 3. Scope
    heading1("3. Scope"),
    heading2("3.1 In-Scope"),
    bulletPoint("BNPL (Buy-Now-Pay-Later) credit scoring for partner store purchases."),
    bulletPoint("Goods loan credit scoring for product financing."),
    bulletPoint("Pre-screen risk assessment for quick initial filtering."),
    bulletPoint("Integration with national Credit Bureau for real-time score retrieval."),
    bulletPoint("Automated decision engine with configurable thresholds."),
    bulletPoint("Manual review queue management for borderline applications."),
    bulletPoint("Scoring analytics dashboard for risk monitoring."),
    bulletPoint("SMS notification system for applicant decision communication."),
    heading2("3.2 Out-of-Scope"),
    bulletPoint("Post-loan monitoring and early warning systems."),
    bulletPoint("Collection and recovery management."),
    bulletPoint("Customer onboarding and KYC verification (handled by separate systems)."),
    bulletPoint("Accounting and general ledger integration."),
    bulletPoint("Mobile application development (separate project)."),
    bulletPoint("Partner store management portal enhancements."),

    // 4. Stakeholders
    heading1("4. Stakeholders"),
    createDataTable(
      ["Stakeholder", "Role", "Interest Level", "Key Concerns"],
      [
        ["Risk Department", "Primary Owner", "High", "Score accuracy, risk thresholds, regulatory compliance"],
        ["Sales Department", "Key User", "High", "Approval rates, speed of decisions, customer experience"],
        ["IT Development Team", "Implementer", "High", "Technical feasibility, integration complexity, system performance"],
        ["Credit Committee", "Decision Maker", "High", "Override capability, manual review queue, audit trail"],
        ["Partner Stores", "External User", "Medium", "Application turnaround time, approval notification"],
        ["Compliance/Legal", "Advisor", "Medium", "Data privacy, consent management, regulatory requirements"],
        ["End Customers", "Beneficiary", "Medium", "Fast decision, transparent communication"],
        ["Finance Department", "Support", "Low", "Cost of implementation, ROI tracking"],
      ],
      [2400, 1800, 1400, 4406]
    ),

    // 5. Business Requirements
    heading1("5. Business Requirements"),
    heading2("5.1 Automated Scoring (BR-101)"),
    boldBodyText("BR-101: ", "The system shall automatically score all incoming credit applications within 60 seconds of submission. The scoring process must be fully automated with no manual intervention required for standard applications."),
    bodyText("Rationale: Speed is the primary competitive advantage. Customers expect instant decisions for BNPL purchases."),

    heading2("5.2 Multi-Factor Assessment (BR-102)"),
    boldBodyText("BR-102: ", "The system shall support multi-factor risk assessment incorporating the following factors:"),
    bulletPoint("Credit Bureau Score (weight: 30%) \u2014 External credit history and rating."),
    bulletPoint("Income Level (weight: 25%) \u2014 Verified monthly income in AZN."),
    bulletPoint("Debt-to-Income Ratio (weight: 20%) \u2014 Total existing obligations vs. income."),
    bulletPoint("Employment Stability (weight: 15%) \u2014 Duration and type of current employment."),
    bulletPoint("Existing Loan Obligations (weight: 10%) \u2014 Number and status of active loans."),
    bodyText("Rationale: Multi-factor assessment provides a holistic view of applicant creditworthiness."),

    heading2("5.3 Auto-Approve Threshold (BR-103)"),
    boldBodyText("BR-103: ", "The system shall automatically approve credit applications with a composite score of 80 or above (on a 0-100 scale). Auto-approved applications must bypass manual review entirely and proceed directly to loan disbursement preparation."),
    bodyText("Rationale: High-score applicants represent low risk and should be processed immediately."),

    heading2("5.4 Manual Review Routing (BR-104)"),
    boldBodyText("BR-104: ", "The system shall route credit applications with a composite score between 50 and 79 (inclusive) to the manual review queue. The system must prioritize the queue by score (highest first) and assign applications to available credit analysts."),
    bodyText("Rationale: Borderline cases require human judgment to evaluate contextual factors not captured by the scoring model."),

    heading2("5.5 Auto-Reject Threshold (BR-105)"),
    boldBodyText("BR-105: ", "The system shall automatically reject credit applications with a composite score below 50. Rejected applications must be recorded with the reason code and score breakdown for audit purposes."),
    bodyText("Rationale: Low-score applicants present unacceptable risk levels and should not consume manual review resources."),

    heading2("5.6 Credit Bureau Integration (BR-106)"),
    boldBodyText("BR-106: ", "The system shall integrate with the national Credit Bureau via a secure API to retrieve applicant credit scores in real-time. The integration must handle timeouts gracefully and fall back to alternative assessment if the bureau is unavailable."),
    bodyText("Rationale: Bureau data is a critical input for accurate credit scoring."),

    heading2("5.7 Scoring Dashboard (BR-107)"),
    boldBodyText("BR-107: ", "The system shall provide a real-time analytics dashboard for monitoring scoring performance. The dashboard must display: total applications processed, approval/review/rejection rates, average processing time, score distribution, and daily/weekly/monthly trends."),
    bodyText("Rationale: Management visibility into scoring performance is essential for ongoing optimization."),

    // 6. Assumptions & Constraints
    heading1("6. Assumptions & Constraints"),
    heading2("6.1 Assumptions"),
    bulletPoint("The Credit Bureau API will be available 99.5% of the time with response times under 5 seconds."),
    bulletPoint("Applicant data (name, PIN, income, employment) will be pre-populated by the partner store or mobile app."),
    bulletPoint("The scoring model weights are configurable by the Risk Department without code changes."),
    bulletPoint("SMS gateway service is already available and can be integrated via API."),
    bulletPoint("All applicants have provided valid consent for credit bureau inquiry."),
    heading2("6.2 Constraints"),
    bulletPoint("The system must comply with Azerbaijani data protection regulations and banking supervision requirements."),
    bulletPoint("Maximum response time for automated scoring is 60 seconds (including bureau lookup)."),
    bulletPoint("The system must support a minimum of 500 concurrent application submissions."),
    bulletPoint("All scoring decisions must be logged and retained for a minimum of 7 years for audit purposes."),
    bulletPoint("Budget for the initial implementation phase is fixed and non-negotiable."),

    // 7. Glossary
    heading1("7. Glossary"),
    createDataTable(
      ["Term", "Definition"],
      [
        ["BNPL", "Buy-Now-Pay-Later \u2014 A short-term credit facility allowing customers to purchase goods and pay in installments."],
        ["Credit Bureau", "A centralized agency that collects and maintains consumer credit information."],
        ["Credit Score", "A numerical representation (0-100) of an applicant's creditworthiness."],
        ["DTI Ratio", "Debt-to-Income Ratio \u2014 The percentage of monthly income allocated to debt payments."],
        ["Pre-Screen", "An initial quick assessment to filter out obviously ineligible applicants."],
        ["Decision Engine", "The software component that applies business rules to determine credit outcomes."],
        ["Manual Review Queue", "A prioritized list of applications requiring human analyst evaluation."],
        ["PIN", "Personal Identification Number \u2014 A unique 7-character identifier for Azerbaijani citizens."],
        ["AZN", "Azerbaijani Manat \u2014 The official currency of Azerbaijan."],
        ["Disbursement", "The release of funds to the borrower or merchant after loan approval."],
      ],
      [2500, 7506]
    ),
  ];

  addSection(doc, children);
  await writeDoc(doc, filePath);
}

// ============================================================
// FILE 2: FRD Credit Scoring
// ============================================================
async function generateFRD_Credit_Scoring() {
  const doc = createDocument();
  const filePath = "/home/z/my-project/embafinans/01-credit-scoring/FRD_Credit_Scoring.docx";

  const children = [
    ...createTitle("Functional Requirements Document", "BNPL Credit Scoring System"),
    ...createMetadata("Embafinans Credit Scoring System", "1.0"),

    heading1("Table of Contents"),
    numberedItem(1, "Introduction"),
    numberedItem(2, "Functional Requirements"),
    numberedItem(3, "Data Requirements"),
    numberedItem(4, "Integration Requirements"),
    numberedItem(5, "Non-Functional Requirements"),
    pageBreak(),

    // 1. Introduction
    heading1("1. Introduction"),
    heading2("1.1 Purpose"),
    bodyText(
      "This Functional Requirements Document (FRD) specifies the functional capabilities of the Embafinans BNPL Credit Scoring System. It translates the business requirements defined in the BRD (BRD_Credit_Scoring.docx, v1.0) into detailed system behaviors and interactions."
    ),
    heading2("1.2 Document Scope"),
    bodyText(
      "This document covers all functional requirements for the credit scoring engine, decision automation, notification system, and analytics dashboard. Integration requirements and non-functional requirements are also specified."
    ),
    heading2("1.3 References"),
    bulletPoint("BRD_Credit_Scoring.docx (v1.0) \u2014 Business Requirements Document"),
    bulletPoint("Embafinans IT Architecture Standards (v2.1)"),
    bulletPoint("Azerbaijani Banking Regulation Guidelines for Consumer Credit (2024)"),
    heading2("1.4 Definitions and Acronyms"),
    bulletPoint("BRD: Business Requirements Document"),
    bulletPoint("FRD: Functional Requirements Document"),
    bulletPoint("API: Application Programming Interface"),
    bulletPoint("SMS: Short Message Service"),
    bulletPoint("CRM: Customer Relationship Management"),

    // 2. Functional Requirements
    heading1("2. Functional Requirements"),
    heading2("2.1 Application Submission (REQ-101)"),
    heading3("REQ-101.1: Customer submits credit application via mobile app"),
    boldBodyText("Description: ", "The system shall accept credit applications submitted through the Embafinans mobile application. The application form must capture: full name, phone number, PIN, monthly income, employment type, employer name, requested loan amount, and loan purpose."),
    boldBodyText("Input: ", "Application form data from mobile app."),
    boldBodyText("Output: ", "Application confirmation with unique application ID."),
    boldBodyText("Validation: ", "All mandatory fields must be completed; PIN must be exactly 7 characters; phone number must match +994XXXXXXXXX format."),
    boldBodyText("Business Rules: ", "System generates a unique application ID (format: APP-YYYYMMDD-XXXXX). System timestamps the submission and sets initial status to 'SUBMITTED'."),

    heading2("2.2 Pre-Screen Assessment (REQ-102)"),
    heading3("REQ-102.1: System performs quick pre-screen before full scoring"),
    boldBodyText("Description: ", "Before initiating the full credit scoring process, the system shall perform a quick pre-screen assessment to filter out applications that do not meet minimum eligibility criteria."),
    boldBodyText("Pre-Screen Checks: ", ""),
    bulletPoint("Minimum age requirement: Applicant must be 18 years or older (derived from PIN)."),
    bulletPoint("Minimum income: Monthly income must be at least 300 AZN."),
    bulletPoint("Maximum requested amount: Loan amount must not exceed 50,000 AZN."),
    bulletPoint("Minimum requested amount: Loan amount must be at least 100 AZN."),
    bulletPoint("Active bankruptcy check: Applicant must not have an active bankruptcy record."),
    boldBodyText("Output: ", "Pre-screen result (PASS/FAIL) with failure reason if applicable."),
    boldBodyText("Business Rules: ", "Applications that fail pre-screen are immediately rejected with a descriptive reason. No bureau inquiry is made for failed pre-screens."),

    heading2("2.3 Bureau Score Integration (REQ-103)"),
    heading3("REQ-103.1: System retrieves credit bureau score via API"),
    boldBodyText("Description: ", "The system shall connect to the national Credit Bureau API to retrieve the applicant's credit score and credit history summary."),
    boldBodyText("API Parameters: ", ""),
    bulletPoint("Endpoint: Credit Bureau REST API (HTTPS)"),
    bulletPoint("Authentication: OAuth 2.0 with client credentials"),
    bulletPoint("Input: Applicant PIN (7 characters)"),
    bulletPoint("Output: Bureau score (0-1000), credit history summary, active delinquencies flag"),
    boldBodyText("Error Handling: ", ""),
    bulletPoint("Timeout ( > 10s): Log error, attempt retry once, then use default neutral score (50)."),
    bulletPoint("Service Unavailable: Queue application for retry within 1 hour; notify operations team."),
    bulletPoint("Invalid PIN: Return error to application with 'Unable to verify identity' message."),
    boldBodyText("Data Storage: ", "Bureau score and response metadata stored with the application record for audit."),

    heading2("2.4 Multi-Factor Scoring (REQ-104)"),
    heading3("REQ-104.1: System calculates weighted score using 5 factors"),
    boldBodyText("Description: ", "The system shall calculate a composite credit score (0-100) using a weighted combination of five assessment factors. Each factor is scored individually on a 0-100 scale before applying the weight."),
    createDataTable(
      ["Factor", "Weight", "Score Range", "Scoring Logic"],
      [
        ["Credit Bureau Score", "30%", "0-100", "Bureau score normalized: (bureau_score / 1000) * 100"],
        ["Income Level", "25%", "0-100", "Based on income brackets: <300 AZN (0), 300-500 (40), 500-1000 (60), 1000-2000 (75), >2000 (95)"],
        ["Debt-to-Income Ratio", "20%", "0-100", "DTI < 20% (100), 20-40% (80), 40-60% (50), >60% (10)"],
        ["Employment Stability", "15%", "0-100", "Employed > 2yr (95), 1-2yr (75), 6mo-1yr (50), < 6mo (20), Self-employed (60)"],
        ["Existing Loans", "10%", "0-100", "0 loans (100), 1-2 active (70), 3-4 (40), >4 or any delinquent (10)"],
      ],
      [2200, 1000, 1200, 5516]
    ),
    boldBodyText("Formula: ", "Composite Score = (Bureau_Score * 0.30) + (Income_Score * 0.25) + (DTI_Score * 0.20) + (Employment_Score * 0.15) + (Loans_Score * 0.10)"),

    heading2("2.5 Decision Engine (REQ-105)"),
    heading3("REQ-105.1: System applies decision rules"),
    boldBodyText("Description: ", "Based on the composite credit score, the system shall automatically determine the credit decision."),
    createDataTable(
      ["Score Range", "Decision", "Action", "SLA"],
      [
        ["80 \u2013 100", "APPROVED", "Auto-approve, prepare disbursement", "Immediate (< 5s)"],
        ["50 \u2013 79", "MANUAL_REVIEW", "Queue for credit analyst review", "Assign within 4 hours"],
        ["0 \u2013 49", "REJECTED", "Auto-reject, record reason", "Immediate (< 5s)"],
      ],
      [1800, 2000, 3200, 3006]
    ),

    heading2("2.6 Notification (REQ-106)"),
    heading3("REQ-106.1: System sends SMS notification with decision result"),
    boldBodyText("Description: ", "The system shall send an SMS notification to the applicant's registered mobile number upon credit decision."),
    createDataTable(
      ["Decision", "SMS Template"],
      [
        ["APPROVED", "Embafinans: Sizin kredit muracietiniz tesdiq olunub. Mebleg: [AMOUNT] AZN. Endirim nomresi: [REF]. Tebrikler!"],
        ["MANUAL_REVIEW", "Embafinans: Sizin muracietiniz rezolvere gonderilib. Netice 24 saat erzinde SMS ile gonderilecek."],
        ["REJECTED", "Embafinans: Sizin kredit muracietiniz lehv edilib. Etrafli melumat ucun [PHONE] nomresine zeng edin."],
      ],
      [2200, 6806]
    ),

    heading2("2.7 Scoring History (REQ-107)"),
    heading3("REQ-107.1: System stores all scoring results for audit"),
    boldBodyText("Description: ", "The system shall maintain a complete audit trail of all credit scoring activities. Every scoring event must be recorded with full input data, calculated scores, decision outcome, and timestamps."),
    boldBodyText("Retention: ", "Minimum 7 years."),
    boldBodyText("Data Fields: ", "Application ID, timestamp, applicant PIN (hashed), all 5 factor scores, composite score, decision, reviewer ID (if manual), decision timestamp."),

    heading2("2.8 Risk Dashboard (REQ-108)"),
    heading3("REQ-108.1: System provides real-time scoring analytics"),
    boldBodyText("Description: ", "The system shall expose a web-based dashboard for risk managers to monitor scoring performance in real-time."),
    boldBodyText("Dashboard Components: ", ""),
    bulletPoint("Summary cards: Total applications today, approval rate, average score, average processing time."),
    bulletPoint("Trend charts: Daily application volume and approval rate over the past 30 days."),
    bulletPoint("Score distribution histogram showing the spread of composite scores."),
    bulletPoint("Manual review queue status: pending count, average wait time, oldest pending application."),
    bulletPoint("Filter and drill-down: By date range, partner store, decision type, score range."),

    // 3. Data Requirements
    heading1("3. Data Requirements"),
    heading2("3.1 Applicant Data Model"),
    createDataTable(
      ["Field Name", "Data Type", "Mandatory", "Validation", "Source"],
      [
        ["application_id", "String", "Yes", "Auto-generated (APP-YYYYMMDD-XXXXX)", "System"],
        ["applicant_full_name", "String(100)", "Yes", "Not null, trimmed", "App / Store"],
        ["applicant_mobile", "String(13)", "Yes", "Regex: ^\\+994[0-9]{9}$", "App / Store"],
        ["applicant_pin", "String(7)", "Yes", "Alphanumeric, exactly 7 chars", "App / Store"],
        ["monthly_income", "Decimal(10,2)", "Yes", "> 0, in AZN", "App / Store"],
        ["employment_type", "Enum", "Yes", "EMPLOYED | SELF_EMPLOYED | RETIRED | OTHER", "App / Store"],
        ["employer_name", "String(100)", "Conditional", "Max 100 chars, required if EMPLOYED", "App / Store"],
        ["requested_amount", "Decimal(12,2)", "Yes", "100 - 50,000 AZN", "App / Store"],
        ["loan_purpose", "Enum", "Yes", "BNPL | GOODS_LOAN", "App / Store"],
        ["submission_timestamp", "DateTime", "Yes", "ISO 8601", "System"],
      ],
      [2200, 1400, 1000, 3200, 1106]
    ),

    heading2("3.2 Scoring Result Data Model"),
    createDataTable(
      ["Field Name", "Data Type", "Description"],
      [
        ["scoring_id", "String", "Unique scoring event identifier"],
        ["application_id", "String", "FK to application"],
        ["bureau_score_raw", "Integer", "Raw score from credit bureau (0-1000)"],
        ["bureau_score_normalized", "Decimal(5,2)", "Normalized score (0-100)"],
        ["income_score", "Decimal(5,2)", "Income factor score (0-100)"],
        ["dti_score", "Decimal(5,2)", "Debt-to-income factor score (0-100)"],
        ["employment_score", "Decimal(5,2)", "Employment stability score (0-100)"],
        ["loans_score", "Decimal(5,2)", "Existing loans factor score (0-100)"],
        ["composite_score", "Decimal(5,2)", "Final weighted composite score (0-100)"],
        ["decision", "Enum", "APPROVED | MANUAL_REVIEW | REJECTED"],
        ["scoring_timestamp", "DateTime", "When scoring was completed"],
      ],
      [2500, 1500, 4906]
    ),

    // 4. Integration Requirements
    heading1("4. Integration Requirements"),
    heading2("4.1 Credit Bureau API"),
    bulletPoint("Protocol: HTTPS REST API with OAuth 2.0 authentication."),
    bulletPoint("Endpoint: /api/v2/credit-report"),
    bulletPoint("Timeout: 10 seconds (with 1 retry)."),
    bulletPoint("Data Exchange: JSON format."),
    bulletPoint("Availability SLA: 99.5% uptime."),
    heading2("4.2 SMS Gateway"),
    bulletPoint("Protocol: HTTPS REST API."),
    bulletPoint("Endpoint: /api/v1/send-sms"),
    bulletPoint("Authentication: API key in header."),
    bulletPoint("Supported: Single SMS, Unicode characters (Azerbaijani Latin script)."),
    bulletPoint("Delivery Receipt: Callback webhook for delivery status."),
    heading2("4.3 CRM Integration"),
    bulletPoint("Protocol: HTTPS REST API."),
    bulletPoint("Sync: Application status changes pushed to CRM in real-time."),
    bulletPoint("Data: Application ID, decision, timestamp, customer contact info."),

    // 5. Non-Functional Requirements
    heading1("5. Non-Functional Requirements"),
    createDataTable(
      ["Category", "Requirement", "Target"],
      [
        ["Performance", "Automated scoring response time", "< 60 seconds (including bureau lookup)"],
        ["Performance", "Dashboard page load time", "< 3 seconds"],
        ["Performance", "SMS delivery time", "< 30 seconds"],
        ["Availability", "System uptime", "99.5% (excluding scheduled maintenance)"],
        ["Availability", "Scheduled maintenance window", "Sundays 02:00-04:00 Baku time"],
        ["Scalability", "Concurrent applications", "Support 500 concurrent submissions"],
        ["Scalability", "Daily processing capacity", "Handle 5,000+ applications per day"],
        ["Security", "Data encryption", "AES-256 at rest, TLS 1.3 in transit"],
        ["Security", "Access control", "Role-based access control (RBAC)"],
        ["Security", "PIN storage", "Hashed with salt (SHA-256)"],
        ["Audit", "Audit trail", "All decisions logged with full context"],
        ["Audit", "Data retention", "Minimum 7 years"],
        ["Compliance", "Data protection", "Compliant with Azerbaijani data protection laws"],
        ["Compliance", "Consent management", "Applicant consent recorded before bureau inquiry"],
      ],
      [1800, 3200, 3906]
    ),
  ];

  addSection(doc, children);
  await writeDoc(doc, filePath);
}

// ============================================================
// FILE 3: Gap Analysis Credit Scoring
// ============================================================
async function generateGap_Analysis_Credit_Scoring() {
  const doc = createDocument();
  const filePath = "/home/z/my-project/embafinans/01-credit-scoring/Gap_Analysis_Credit_Scoring.docx";

  const children = [
    ...createTitle("Gap Analysis Report", "Manual vs Automated Credit Assessment"),
    ...createMetadata("Embafinans Credit Scoring System", "1.0"),

    heading1("Table of Contents"),
    numberedItem(1, "Introduction"),
    numberedItem(2, "Methodology"),
    numberedItem(3, "Gap Analysis Matrix"),
    numberedItem(4, "Priority Summary"),
    numberedItem(5, "Recommendations"),
    pageBreak(),

    heading1("1. Introduction"),
    bodyText(
      "This Gap Analysis document compares the current manual credit assessment process with the proposed automated credit scoring system. The analysis identifies gaps across key operational areas and provides prioritized recommendations to guide the implementation roadmap."
    ),
    bodyText(
      "The current state analysis is based on interviews with the Risk Department, Sales team, and IT Development, as well as process observation sessions conducted during Q4 2024. The future state reflects the capabilities defined in the BRD and FRD for the Embafinans Credit Scoring System."
    ),

    heading1("2. Methodology"),
    bodyText("The gap analysis follows a structured approach:"),
    numberedItem(1, "Process Mapping: Document current (As-Is) credit assessment workflows."),
    numberedItem(2, "Target Definition: Define desired (To-Be) automated capabilities based on BRD/FRD."),
    numberedItem(3, "Gap Identification: Compare As-Is vs To-Be across all functional areas."),
    numberedItem(4, "Priority Assessment: Rate each gap based on business impact and urgency."),
    numberedItem(5, "Recommendation: Propose actionable solutions for each identified gap."),
    bodyText("Priority levels are defined as:"),
    bulletPoint("High: Critical business impact; must be addressed in Phase 1."),
    bulletPoint("Medium: Significant improvement opportunity; addressed in Phase 2."),
    bulletPoint("Low: Nice-to-have enhancement; addressed in Phase 3 or later."),

    heading1("3. Gap Analysis Matrix"),
    bodyText("The following table presents the comprehensive gap analysis across all identified areas:"),
    emptyLine(),
    createDataTable(
      ["Area", "Current State (As-Is)", "Future State (To-Be)", "Gap Description", "Priority", "Recommendation"],
      [
        [
          "Credit Decision Speed",
          "5-7 business days manual processing through committee review",
          "< 60 seconds automated scoring with instant decision",
          "Critical speed bottleneck: current manual process cannot scale with growing application volumes and loses customers to competitors",
          "High",
          "Implement automated scoring engine with real-time bureau integration and configurable decision rules",
        ],
        [
          "Risk Assessment Methodology",
          "Subjective manual evaluation by individual analysts with varying experience levels",
          "Multi-factor weighted scoring model with 5 standardized factors",
          "Inconsistent risk evaluation leading to variable approval standards and potential bias in decision-making",
          "High",
          "Deploy scoring model with 5 weighted factors: bureau score (30%), income (25%), DTI (20%), employment (15%), loans (10%)",
        ],
        [
          "Credit Bureau Integration",
          "Phone and fax requests to bureau with 1-3 day turnaround",
          "Real-time API integration with < 5 second response time",
          "Delayed bureau data forces analysts to make decisions without complete information",
          "High",
          "Integrate with Credit Bureau REST API using OAuth 2.0 authentication with retry logic",
        ],
        [
          "Approval Workflow",
          "Credit committee meeting required for all applications (weekly schedule)",
          "Auto-approve for score >= 80; manual review queue for score 50-79",
          "Committee bottleneck creates delay; unnecessary for clear-cut approval and rejection cases",
          "High",
          "Implement automated decision engine with configurable thresholds and manual review queue management",
        ],
        [
          "Tracking & Reporting",
          "Excel spreadsheets maintained manually by each analyst",
          "Real-time web-based analytics dashboard with drill-down capabilities",
          "No real-time visibility into scoring performance; delayed and error-prone manual reporting",
          "Medium",
          "Build analytics dashboard with KPI cards, trend charts, score distribution, and queue monitoring",
        ],
        [
          "Customer Communication",
          "Phone call notifications by sales agents after committee decision",
          "Automated SMS notifications sent immediately upon decision",
          "Slow notification process; inconsistent messaging; no delivery tracking",
          "Low",
          "Implement SMS service integration with automated templates for approve/review/reject decisions",
        ],
        [
          "Audit Trail",
          "Paper-based files stored in physical cabinets",
          "Digital audit trail with full scoring context retained for 7 years",
          "No centralized digital record; difficult to retrieve historical decisions for compliance review",
          "Medium",
          "Implement comprehensive logging system with encrypted storage and compliance retention policy",
        ],
        [
          "Scalability",
          "Maximum ~50 applications per week with current team",
          "Support 5,000+ applications per day with automated system",
          "Cannot handle projected growth; seasonal peaks cause significant backlogs",
          "High",
          "Design horizontally scalable architecture with queue-based processing and auto-scaling",
        ],
        [
          "Pre-Screening",
          "No formal pre-screening; all applications go through full manual review",
          "Automated pre-screen filtering based on minimum eligibility criteria",
          "Resource waste on clearly ineligible applications; analysts spend time on obvious rejections",
          "Medium",
          "Implement pre-screen rules engine to reject applications failing minimum criteria before bureau inquiry",
        ],
        [
          "Score Configuration",
          "Scoring criteria defined informally and vary by analyst",
          "Configurable scoring weights and thresholds managed by Risk Department",
          "No formalized scoring framework; inability to quickly adjust risk appetite",
          "High",
          "Build admin interface for Risk team to configure scoring weights, thresholds, and decision rules",
        ],
      ],
      [1300, 1900, 1900, 1900, 800, 3106]
    ),

    pageBreak(),
    heading1("4. Priority Summary"),
    createDataTable(
      ["Priority", "Count", "Areas", "Implementation Phase"],
      [
        ["High", "7", "Decision Speed, Risk Assessment, Bureau Integration, Approval Workflow, Scalability, Score Configuration, Pre-Screening*", "Phase 1 (Q1 2025)"],
        ["Medium", "3", "Tracking & Reporting, Audit Trail, Pre-Screening", "Phase 2 (Q2 2025)"],
        ["Low", "1", "Customer Communication (SMS)", "Phase 3 (Q3 2025)"],
      ],
      [1400, 1000, 4400, 3106]
    ),
    bodyText("*Pre-Screening spans Medium priority for full implementation and High priority for basic rules."),

    heading1("5. Recommendations"),
    heading2("5.1 Immediate Actions (Phase 1)"),
    bulletPoint("Finalize credit scoring model design with Risk Department sign-off on factor weights and thresholds."),
    bulletPoint("Establish Credit Bureau API integration agreement and complete technical onboarding."),
    bulletPoint("Develop and deploy the core automated scoring engine with decision automation."),
    bulletPoint("Implement manual review queue with analyst assignment and prioritization logic."),
    heading2("5.2 Short-Term Actions (Phase 2)"),
    bulletPoint("Build and deploy the real-time analytics dashboard for risk monitoring."),
    bulletPoint("Implement digital audit trail system with 7-year retention policy."),
    bulletPoint("Enhance pre-screening with additional eligibility rules based on initial operational data."),
    heading2("5.3 Medium-Term Actions (Phase 3)"),
    bulletPoint("Deploy automated SMS notification system with Azerbaijani-language templates."),
    bulletPoint("Integrate dashboard with CRM for unified customer view."),
    bulletPoint("Implement machine learning model enhancement based on 6+ months of scoring data."),
  ];

  addSection(doc, children);
  await writeDoc(doc, filePath);
}

// ============================================================
// FILE 4: Data Mapping Credit Scoring
// ============================================================
async function generateData_Mapping_Scoring() {
  const doc = createDocument();
  const filePath = "/home/z/my-project/embafinans/01-credit-scoring/Data_Mapping_Scoring.docx";

  const children = [
    ...createTitle("Data Mapping Document", "Credit Scoring System Integration"),
    ...createMetadata("Embafinans Credit Scoring System", "1.0"),

    heading1("Table of Contents"),
    numberedItem(1, "Introduction"),
    numberedItem(2, "Source & Target Systems"),
    numberedItem(3, "Data Mapping Table"),
    numberedItem(4, "Transformation Rules Detail"),
    numberedItem(5, "Validation Rules Summary"),
    pageBreak(),

    heading1("1. Introduction"),
    bodyText(
      "This Data Mapping Document defines the field-level mapping between source systems (Partner Store Application and Mobile App) and the target Credit Scoring Engine. It specifies data types, transformation rules, and validation logic for each field to ensure data integrity and consistency throughout the credit scoring process."
    ),
    bodyText(
      "This document serves as the authoritative reference for the development team during integration implementation and for QA during testing."
    ),

    heading1("2. Source & Target Systems"),
    heading2("2.1 Source Systems"),
    createDataTable(
      ["System", "Type", "Data Format", "Connection", "Responsible Team"],
      [
        ["Partner Store Application", "Web Portal", "JSON via REST API", "HTTPS POST /api/submit", "E-Commerce Team"],
        ["Embafinans Mobile App", "Mobile (iOS/Android)", "JSON via REST API", "HTTPS POST /api/v1/application", "Mobile Team"],
      ],
      [2800, 1800, 1800, 2600, 1906]
    ),
    heading2("2.2 Target System"),
    createDataTable(
      ["System", "Type", "Technology", "Database", "Responsible Team"],
      [
        ["Credit Scoring Engine", "Microservice", "Java / Spring Boot", "PostgreSQL 15", "Backend Team"],
      ],
      [2800, 1800, 1800, 1800, 2706]
    ),

    heading1("3. Data Mapping Table"),
    bodyText("The following table provides the complete field-level mapping from source to target:"),
    emptyLine(),
    createDataTable(
      ["Source Field", "Source Description", "Target Field", "Target Description", "Data Type", "Transformation Rule", "Validation Rule"],
      [
        ["partner_full_name", "Applicant's full name as entered", "applicant_full_name", "Normalized full name", "VARCHAR(100)", "TRIM, Title Case, remove special chars", "NOT NULL, min 2 chars"],
        ["partner_phone", "Applicant mobile number", "applicant_mobile", "Formatted mobile number", "VARCHAR(13)", "Format to +994XXXXXXXXX", "Regex: ^\\+994[0-9]{9}$"],
        ["partner_pin", "Personal identification number", "applicant_pin", "Hashed PIN for storage", "VARCHAR(64)", "SHA-256 hash with salt", "Alphanumeric, exactly 7 chars"],
        ["partner_pin_raw", "PIN in plaintext (transit only)", "applicant_pin_raw", "PIN for bureau lookup", "VARCHAR(7)", "UPPER, trim whitespace", "Alphanumeric, 7 chars; not persisted"],
        ["partner_income", "Declared monthly income", "monthly_income", "Income in AZN", "DECIMAL(10,2)", "Convert to AZN if foreign currency (using daily rate)", "> 0, <= 1,000,000"],
        ["partner_income_currency", "Currency of declared income", "income_currency_original", "Original currency code", "VARCHAR(3)", "ISO 4217 currency code", "AZN, USD, EUR, GBP, TRY, RUB"],
        ["partner_employment", "Employment status", "employment_type", "Normalized employment enum", "ENUM", "Map: 'Ishci' -> EMPLOYED, 'Mudur' -> EMPLOYED, 'Musteri' -> SELF_EMPLOYED, 'Pensioner' -> RETIRED", "One of: EMPLOYED, SELF_EMPLOYED, RETIRED, OTHER"],
        ["partner_employer", "Current employer name", "employer_name", "Employer name", "VARCHAR(100)", "TRIM, Title Case", "Max 100 chars; required if EMPLOYED"],
        ["partner_employment_duration", "Months at current job", "employment_months", "Employment duration in months", "INTEGER", "Parse integer from string, default 0", ">= 0, <= 600 (50 years)"],
        ["partner_existing_loans", "Number of active loans", "active_loan_count", "Count of active loans", "INTEGER", "Parse integer, clamp >= 0", ">= 0"],
        ["partner_monthly_debt", "Total monthly debt payments", "monthly_debt_amount", "Monthly obligation amount", "DECIMAL(10,2)", "Sum all active loan payments, convert to AZN", ">= 0"],
        ["partner_loan_amount", "Requested loan amount", "requested_amount", "Requested credit amount", "DECIMAL(12,2)", "Round to 2 decimal places", ">= 100, <= 50,000 AZN"],
        ["partner_product_type", "Type of credit product", "loan_product_type", "Product category enum", "ENUM", "Map: 'bnpl' -> BNPL, 'goods' -> GOODS_LOAN", "BNPL or GOODS_LOAN"],
        ["partner_store_id", "ID of partner store", "store_id", "Partner store identifier", "VARCHAR(20)", "Lookup in store registry, resolve to internal ID", "Must exist in store master data"],
        ["partner_order_id", "Store order reference", "external_order_ref", "External order reference", "VARCHAR(50)", "TRIM, preserve original", "NOT NULL, max 50 chars"],
        ["submission_channel", "Source of application", "application_channel", "Channel identifier", "ENUM", "Map: 'store' -> PARTNER_PORTAL, 'mobile' -> MOBILE_APP, 'web' -> WEB_APP", "PARTNER_PORTAL, MOBILE_APP, WEB_APP"],
      ],
      [1300, 1300, 1300, 1300, 900, 1900, 2906]
    ),

    pageBreak(),
    heading1("4. Transformation Rules Detail"),
    heading2("4.1 Name Normalization"),
    bulletPoint("Input: Raw name string from source."),
    bulletPoint("Step 1: TRIM leading and trailing whitespace."),
    bulletPoint("Step 2: Replace multiple spaces with single space."),
    bulletPoint("Step 3: Convert to Title Case (first letter of each word uppercase)."),
    bulletPoint("Step 4: Remove any non-alphabetic characters except spaces and hyphens."),
    bulletPoint("Example: '  ali  mammadov  ' -> 'Ali Mammadov'"),
    heading2("4.2 Phone Number Formatting"),
    bulletPoint("Input: Various phone formats (0501234567, +994501234567, 9940501234567)."),
    bulletPoint("Step 1: Strip all non-digit characters."),
    bulletPoint("Step 2: If starts with '0', replace with '994'."),
    bulletPoint("Step 3: If exactly 9 digits, prefix with '994'."),
    bulletPoint("Step 4: Prepend '+' to form +994XXXXXXXXX format."),
    bulletPoint("Step 5: Validate length is exactly 13 characters."),
    heading2("4.3 Currency Conversion"),
    bulletPoint("Exchange rates sourced from Central Bank of Azerbaijan daily feed."),
    bulletPoint("Conversion applies to income and debt amounts if not in AZN."),
    bulletPoint("Rate applied: rate of the business day prior to application submission."),
    bulletPoint("Rounding: Round to 2 decimal places (banker's rounding)."),
    heading2("4.4 PIN Handling"),
    bulletPoint("Raw PIN used ONLY for bureau API lookup (transient, never persisted in plaintext)."),
    bulletPoint("Storage: SHA-256 hash with application-specific salt."),
    bulletPoint("Retrieval: Not possible (one-way hash) - re-entry required if needed."),

    heading1("5. Validation Rules Summary"),
    createDataTable(
      ["Rule ID", "Field", "Rule", "Error Code", "Error Message"],
      [
        ["VAL-001", "applicant_full_name", "NOT NULL, min 2 chars", "ERR_NAME_001", "Full name is required and must be at least 2 characters"],
        ["VAL-002", "applicant_mobile", "Regex: ^\\+994[0-9]{9}$", "ERR_PHONE_001", "Invalid phone number format. Must be +994XXXXXXXXX"],
        ["VAL-003", "applicant_pin", "Alphanumeric, exactly 7 chars", "ERR_PIN_001", "PIN must be exactly 7 alphanumeric characters"],
        ["VAL-004", "monthly_income", "> 0, <= 1,000,000", "ERR_INCOME_001", "Monthly income must be between 1 and 1,000,000 AZN"],
        ["VAL-005", "employment_type", "Valid enum value", "ERR_EMP_001", "Employment type must be one of: EMPLOYED, SELF_EMPLOYED, RETIRED, OTHER"],
        ["VAL-006", "employer_name", "Max 100 chars, required if EMPLOYED", "ERR_EMPLOYER_001", "Employer name is required for employed applicants"],
        ["VAL-007", "requested_amount", ">= 100, <= 50,000", "ERR_AMOUNT_001", "Requested amount must be between 100 and 50,000 AZN"],
        ["VAL-008", "loan_product_type", "BNPL or GOODS_LOAN", "ERR_PRODUCT_001", "Product type must be BNPL or GOODS_LOAN"],
        ["VAL-009", "store_id", "Must exist in store master data", "ERR_STORE_001", "Invalid store identifier"],
        ["VAL-010", "active_loan_count", ">= 0", "ERR_LOANS_001", "Active loan count cannot be negative"],
      ],
      [1200, 2000, 2400, 1500, 2806]
    ),
  ];

  addSection(doc, children);
  await writeDoc(doc, filePath);
}

// ============================================================
// FILE 5: FRD B2C Sales Channel
// ============================================================
async function generateFRD_B2C_Sales_Channel() {
  const doc = createDocument();
  const filePath = "/home/z/my-project/embafinans/02-b2c-sales-channel/FRD_B2C_Sales_Channel.docx";

  const children = [
    ...createTitle("Functional Requirements Document", "B2C Sales Channel & Payment Gateway"),
    ...createMetadata("Embafinans B2C Sales Channel", "1.0"),

    heading1("Table of Contents"),
    numberedItem(1, "Introduction"),
    numberedItem(2, "Functional Requirements"),
    numberedItem(3, "Integration Requirements"),
    numberedItem(4, "Non-Functional Requirements"),
    pageBreak(),

    heading1("1. Introduction"),
    heading2("1.1 Purpose"),
    bodyText(
      "This Functional Requirements Document defines the capabilities of the Embafinans B2C Sales Channel, enabling customers to browse products, apply for credit, and complete purchases online through an integrated payment gateway. The system bridges the gap between product discovery and credit-financed purchasing."
    ),
    heading2("1.2 Business Context"),
    bodyText(
      "Embafinans currently operates primarily through partner stores with limited direct-to-consumer digital presence. This B2C channel project aims to establish an online platform where customers can browse available products, select installment plans, apply for credit, and complete purchases\u2014all within a single digital journey."
    ),
    heading2("1.3 Scope"),
    bulletPoint("Product catalog browsing with credit pricing display."),
    bulletPoint("Credit application embedded in the purchase flow."),
    bulletPoint("Payment gateway integration for down payments and processing fees."),
    bulletPoint("Real-time order status tracking."),
    bulletPoint("Installment schedule generation and management."),
    bulletPoint("Notification delivery (SMS and email)."),
    bulletPoint("Out of scope: Physical product delivery logistics, partner store management."),

    heading1("2. Functional Requirements"),
    heading2("2.1 Product Browsing (REQ-101)"),
    heading3("REQ-101.1: Customer browses available products with credit pricing"),
    boldBodyText("Description: ", "The system shall display a browsable product catalog with filtering, sorting, and search capabilities. Each product listing must show the cash price and credit pricing (monthly installment amount, number of installments, total cost of credit)."),
    boldBodyText("Features: ", ""),
    bulletPoint("Category-based navigation (electronics, home appliances, furniture, etc.)."),
    bulletPoint("Full-text search with auto-suggestions."),
    bulletPoint("Price range and brand filters."),
    bulletPoint("Product detail page with image gallery, specifications, and credit calculator."),
    bulletPoint("Credit calculator: Customer inputs down payment, system shows monthly installment."),

    heading2("2.2 Order Creation (REQ-102)"),
    heading3("REQ-102.1: Customer creates credit order with installment plan selection"),
    boldBodyText("Description: ", "The system shall allow customers to create orders by adding products to cart, selecting installment plans, and providing delivery information."),
    boldBodyText("Process: ", ""),
    bulletPoint("Step 1: Customer adds product(s) to shopping cart."),
    bulletPoint("Step 2: Customer selects installment plan (3, 6, 12, 18, or 24 months)."),
    bulletPoint("Step 3: System calculates monthly installment, total interest, and total payment amount."),
    bulletPoint("Step 4: Customer enters delivery address and preferred delivery date."),
    bulletPoint("Step 5: Customer reviews order summary and proceeds to credit application."),
    boldBodyText("Business Rules: ", ""),
    bulletPoint("Minimum order amount: 100 AZN. Maximum: 50,000 AZN."),
    bulletPoint("Interest rate varies by installment period (3mo: 0%, 6mo: 2.5%, 12mo: 5%, 18mo: 7.5%, 24mo: 10%)."),
    bulletPoint("Order expires after 30 minutes if credit application is not submitted."),

    heading2("2.3 Credit Application (REQ-103)"),
    heading3("REQ-103.1: Customer submits credit application within order flow"),
    boldBodyText("Description: ", "The credit application form is embedded within the order creation flow. The system pre-fills available customer data and requires additional financial information."),
    boldBodyText("Application Fields: ", ""),
    bulletPoint("Pre-filled (from customer profile): Full name, phone number, email."),
    bulletPoint("Required input: PIN, monthly income, employment type, employer name, employment duration."),
    bulletPoint("Auto-calculated: Debt-to-income ratio (based on declared income and existing loans from bureau)."),
    boldBodyText("Integration: ", "Application data is submitted to the Credit Scoring Engine (REQ-103 from FRD_Credit_Scoring)."),

    heading2("2.4 Payment Gateway Integration (REQ-104)"),
    heading3("REQ-104.1: System processes online payment via payment provider"),
    boldBodyText("Description: ", "The system shall integrate with a payment gateway to process down payments (if applicable), processing fees, and full payments for non-credit purchases."),
    boldBodyText("Supported Payment Methods: ", ""),
    bulletPoint("Visa and Mastercard debit/credit cards."),
    bulletPoint("Local bank cards (all Azerbaijani banks)."),
    bulletPoint("Bank transfer (for orders > 10,000 AZN)."),
    boldBodyText("Payment Flow: ", ""),
    bulletPoint("Step 1: Customer selects payment method and enters card details."),
    bulletPoint("Step 2: System tokenizes card data (no card data stored locally)."),
    bulletPoint("Step 3: System sends payment request to payment gateway."),
    bulletPoint("Step 4: Gateway processes and returns authorization result."),
    bulletPoint("Step 5: System updates order payment status and notifies customer."),

    heading2("2.5 Order Status Tracking (REQ-105)"),
    heading3("REQ-105.1: Customer tracks order status in real-time"),
    boldBodyText("Description: ", "The system shall provide a real-time order tracking interface showing the current status of the order through all stages."),
    createDataTable(
      ["Status", "Description", "Customer Notification"],
      [
        ["ORDER_CREATED", "Order placed, awaiting credit application", "None (in-flow)"],
        ["CREDIT_APPLIED", "Credit application submitted", "SMS: Application received"],
        ["CREDIT_APPROVED", "Credit approved, ready for payment", "SMS: Credit approved"],
        ["CREDIT_REJECTED", "Credit application rejected", "SMS: Credit rejected with reason"],
        ["PAYMENT_PENDING", "Awaiting down payment", "Push notification"],
        ["PAYMENT_COMPLETED", "Down payment received", "Email: Payment confirmation"],
        ["PROCESSING", "Order being prepared for delivery", "SMS: Order processing"],
        ["IN_TRANSIT", "Delivery agent en route", "SMS with tracking link"],
        ["DELIVERED", "Order delivered successfully", "Email: Delivery confirmation"],
        ["CANCELLED", "Order cancelled", "SMS: Cancellation notification"],
      ],
      [2200, 3200, 3506]
    ),

    heading2("2.6 Payment Confirmation (REQ-106)"),
    heading3("REQ-106.1: System sends payment confirmation via SMS and email"),
    boldBodyText("Description: ", "Upon successful payment processing, the system shall send confirmation notifications to the customer via both SMS and email channels."),
    boldBodyText("SMS Content: ", "Embafinans: Odenis ugurla teleb olundu. Sifaris: [ORDER_ID], Mebleg: [AMOUNT] AZN."),
    boldBodyText("Email Content: ", "Formal confirmation with order details, payment receipt, and installment schedule summary."),

    heading2("2.7 Installment Schedule (REQ-107)"),
    heading3("REQ-107.1: System generates repayment schedule after approval"),
    boldBodyText("Description: ", "Upon credit approval and payment completion, the system shall automatically generate a repayment schedule based on the selected installment plan."),
    boldBodyText("Schedule Fields: ", ""),
    bulletPoint("Installment number (1 to N)."),
    bulletPoint("Due date (monthly, starting from first month after delivery)."),
    bulletPoint("Principal amount for each installment."),
    bulletPoint("Interest amount for each installment."),
    bulletPoint("Total payment amount per installment."),
    bulletPoint("Remaining balance after each payment."),
    bodyText("Example: 12,000 AZN purchase, 12-month installment, 5% interest rate:"),
    bulletPoint("Monthly principal: 1,000 AZN."),
    bulletPoint("Monthly interest: ~46 AZN (declining balance)."),
    bulletPoint("First installment due: 30 days after delivery date."),

    // 3. Integration Requirements
    heading1("3. Integration Requirements"),
    createDataTable(
      ["Integration", "Direction", "Protocol", "Data", "Purpose"],
      [
        ["Credit Scoring Engine", "B2C -> Scoring", "REST API (HTTPS)", "Application JSON", "Submit and retrieve credit decisions"],
        ["Payment Gateway", "B2C -> Gateway", "REST API (HTTPS)", "Payment token, amount", "Process card payments"],
        ["Bank API", "B2C -> Bank", "REST API (HTTPS)", "Account verification", "Verify bank account for refunds"],
        ["SMS Gateway", "B2C -> SMS", "REST API (HTTPS)", "Phone, message template", "Send transactional SMS"],
        ["Email Service", "B2C -> Email", "SMTP / API", "Email, template data", "Send confirmation emails"],
        ["Product Catalog", "Catalog -> B2C", "REST API (HTTPS)", "Product data, pricing", "Retrieve product information"],
        ["Delivery Service", "B2C -> Delivery", "REST API (HTTPS)", "Order, address", "Initiate product delivery"],
      ],
      [2000, 1600, 1800, 2000, 3506]
    ),

    // 4. Non-Functional Requirements
    heading1("4. Non-Functional Requirements"),
    createDataTable(
      ["Category", "Requirement", "Target"],
      [
        ["Performance", "Page load time (product listing)", "< 2 seconds"],
        ["Performance", "API response time (order operations)", "< 500ms"],
        ["Performance", "Credit application submission", "< 3 seconds (UI response, async scoring)"],
        ["Capacity", "Daily applications", "300-500 credit applications per day"],
        ["Capacity", "Concurrent users", "Support 200 concurrent users"],
        ["Availability", "Uptime", "99.5% (excluding maintenance)"],
        ["Security", "Payment data", "PCI-DSS compliant; no card data stored locally"],
        ["Security", "Session management", "JWT tokens with 30-minute expiry"],
        ["Security", "HTTPS", "TLS 1.3 enforced on all endpoints"],
        ["Usability", "Mobile responsiveness", "Fully responsive design for all screen sizes"],
        ["Usability", "Accessibility", "WCAG 2.1 Level AA compliance"],
      ],
      [1800, 3200, 3906]
    ),
  ];

  addSection(doc, children);
  await writeDoc(doc, filePath);
}

// ============================================================
// FILE 6: Data Mapping Payment
// ============================================================
async function generateData_Mapping_Payment() {
  const doc = createDocument();
  const filePath = "/home/z/my-project/embafinans/02-b2c-sales-channel/Data_Mapping_Payment.docx";

  const children = [
    ...createTitle("Data Mapping Document", "Payment Gateway Integration"),
    ...createMetadata("Embafinans B2C Sales Channel", "1.0"),

    heading1("Table of Contents"),
    numberedItem(1, "Introduction"),
    numberedItem(2, "Source & Target Systems"),
    numberedItem(3, "Payment Request Mapping"),
    numberedItem(4, "Payment Response Mapping"),
    numberedItem(5, "Webhook / Callback Mapping"),
    numberedItem(6, "Error Code Mapping"),
    pageBreak(),

    heading1("1. Introduction"),
    bodyText(
      "This Data Mapping Document defines the field-level data exchange between the Embafinans B2C platform and the Payment Gateway. It covers payment requests, responses, webhook notifications, and error code translations required for seamless payment processing."
    ),
    bodyText(
      "The payment gateway acts as the intermediary between the customer's bank and Embafinans, handling card authorization, capture, and settlement processes."
    ),

    heading1("2. Source & Target Systems"),
    heading2("2.1 Payment Request Flow"),
    bulletPoint("Source: Embafinans B2C Platform (Order Service)"),
    bulletPoint("Target: Payment Gateway (Processing API)"),
    heading2("2.2 Payment Response Flow"),
    bulletPoint("Source: Payment Gateway (Processing API)"),
    bulletPoint("Target: Embafinans B2C Platform (Order Service)"),
    heading2("2.3 Webhook / Callback Flow"),
    bulletPoint("Source: Payment Gateway (Notification API)"),
    bulletPoint("Target: Embafinans B2C Platform (Webhook Receiver)"),

    heading1("3. Payment Request Mapping"),
    bodyText("Fields sent from Embafinans to the Payment Gateway when initiating a payment:"),
    emptyLine(),
    createDataTable(
      ["Source Field", "Source Description", "Target Field", "Target Description", "Data Type", "Transformation Rule", "Validation Rule"],
      [
        ["order_id", "Internal order identifier", "merchant_reference", "Merchant order reference", "VARCHAR(50)", "Direct pass-through, no transformation", "NOT NULL, unique"],
        ["payment_amount", "Total payment amount in AZN", "amount", "Payment amount in minor units (qapik)", "INTEGER", "Multiply by 100 (e.g., 150.50 AZN -> 15050)", "> 0, <= 50,000,000 (qapik)"],
        ["payment_currency", "Transaction currency", "currency", "ISO 4217 currency code", "VARCHAR(3)", "Direct pass-through", "Always 'AZN'"],
        ["customer_name", "Customer full name", "customer_name", "Cardholder name", "VARCHAR(100)", "TRIM, max 100 chars", "NOT NULL"],
        ["customer_email", "Customer email address", "customer_email", "Cardholder email", "VARCHAR(100)", "TRIM, lowercase", "Valid email format"],
        ["customer_phone", "Customer phone number", "customer_phone", "Cardholder phone", "VARCHAR(13)", "Format +994XXXXXXXXX", "Valid phone format"],
        ["return_url", "Redirect URL after payment", "return_url", "Success redirect URL", "VARCHAR(500)", "URL encode, append order_id param", "Valid HTTPS URL"],
        ["callback_url", "Webhook notification URL", "callback_url", "Async notification URL", "VARCHAR(500)", "Direct pass-through", "Valid HTTPS URL"],
        ["payment_description", "Order description", "description", "Transaction description", "VARCHAR(200)", "Truncate to 200 chars", "NOT NULL"],
        ["language", "Customer language preference", "language", "Gateway UI language", "VARCHAR(2)", "Map: 'az' -> 'az', 'en' -> 'en', 'ru' -> 'ru'", "az, en, or ru"],
        ["installment_count", "Number of installments", "installment", "Bank installment plan", "INTEGER", "Pass 0 for lump sum, 3/6/12/18/24 for installments", "0, 3, 6, 12, 18, or 24"],
        ["ip_address", "Customer IP address", "customer_ip", "Customer IP for fraud detection", "VARCHAR(45)", "Direct pass-through (IPv4/IPv6)", "Valid IP address format"],
      ],
      [1200, 1200, 1200, 1200, 900, 1800, 2606]
    ),

    pageBreak(),
    heading1("4. Payment Response Mapping"),
    bodyText("Fields received from the Payment Gateway after payment processing:"),
    emptyLine(),
    createDataTable(
      ["Gateway Field", "Gateway Description", "Internal Field", "Internal Description", "Data Type", "Transformation Rule", "Validation Rule"],
      [
        ["transaction_id", "Unique transaction ID from gateway", "pg_transaction_id", "Payment gateway transaction reference", "VARCHAR(100)", "Direct pass-through, store as-is", "NOT NULL"],
        ["status", "Transaction status", "payment_status", "Normalized payment status", "ENUM", "Map: 'SUCCESS' -> COMPLETED, 'PENDING' -> PENDING, 'FAILED' -> FAILED, 'CANCELLED' -> CANCELLED", "Valid enum value"],
        ["response_code", "Gateway response code", "pg_response_code", "Raw gateway response code", "VARCHAR(10)", "Direct pass-through", "NOT NULL"],
        ["response_message", "Human-readable response", "pg_response_message", "Response description", "VARCHAR(500)", "TRIM, store original", "NOT NULL"],
        ["rrn", "Retrieval Reference Number", "bank_rrn", "Bank RRN for reconciliation", "VARCHAR(20)", "Direct pass-through", "Alphanumeric, max 20 chars"],
        ["approval_code", "Bank approval code", "bank_approval_code", "Authorization code from bank", "VARCHAR(10)", "Direct pass-through", "Alphanumeric, max 10 chars"],
        ["card_mask", "Masked card number", "card_last_four", "Last 4 digits of card", "VARCHAR(4)", "Extract last 4 digits from masked PAN (e.g., '****1234' -> '1234')", "Exactly 4 digits"],
        ["card_brand", "Card network type", "card_type", "Card brand (VISA/MC)", "ENUM", "Map: 'VISA' -> VISA, 'MASTERCARD' -> MASTERCARD, 'LOCAL' -> LOCAL", "Valid enum value"],
        ["3ds_status", "3D Secure authentication result", "three_ds_verified", "Whether 3DS was verified", "BOOLEAN", "Map: 'Y' -> true, 'A' -> true (attempted), 'N' -> false", "Boolean"],
        ["process_time", "Processing time in ms", "processing_time_ms", "Gateway processing duration", "INTEGER", "Parse as integer", "> 0"],
      ],
      [1200, 1200, 1200, 1200, 900, 1800, 2606]
    ),

    heading1("5. Webhook / Callback Mapping"),
    bodyText("Asynchronous webhook notifications from the Payment Gateway for status changes:"),
    emptyLine(),
    createDataTable(
      ["Webhook Field", "Description", "Internal Field", "Data Type", "Transformation"],
      [
        ["merchant_reference", "Order ID sent in request", "order_id", "VARCHAR(50)", "Direct lookup"],
        ["transaction_id", "Gateway transaction ID", "pg_transaction_id", "VARCHAR(100)", "Direct mapping"],
        ["new_status", "Updated transaction status", "payment_status", "ENUM", "Normalize to internal status"],
        ["amount", "Final processed amount", "settled_amount", "DECIMAL(12,2)", "Convert from minor units (divide by 100)"],
        ["currency", "Transaction currency", "payment_currency", "VARCHAR(3)", "Direct mapping"],
        ["timestamp", "Event timestamp (UTC)", "pg_event_timestamp", "DATETIME", "Parse ISO 8601, convert to Baku time (UTC+4)"],
        ["signature", "HMAC signature for verification", "pg_signature", "VARCHAR(256)", "Verify with shared secret before processing"],
        ["failure_reason", "Reason for failure (if applicable)", "failure_reason", "VARCHAR(500)", "TRIM, store original"],
      ],
      [1800, 2000, 1600, 1400, 2106]
    ),

    heading1("6. Error Code Mapping"),
    bodyText("Standard error codes and their translations for customer-facing messages:"),
    emptyLine(),
    createDataTable(
      ["Gateway Code", "Gateway Message", "Internal Code", "Customer Message (AZ)", "Action"],
      [
        ["001", "Transaction approved", "PAY_SUCCESS", "Odenis ugurla teleb olundu", "Update order to PAYMENT_COMPLETED"],
        ["002", "Insufficient funds", "PAY_INSUFFICIENT_FUNDS", "Kartda kifayet qeder vesait yoxdur", "Prompt customer to use different card"],
        ["003", "Expired card", "PAY_CARD_EXPIRED", "Kartin muddeti bitmisdir", "Prompt customer to update card"],
        ["004", "Invalid card number", "PAY_INVALID_CARD", "Kart nomresi yanlisdir", "Prompt customer to re-enter card"],
        ["005", "Transaction declined", "PAY_DECLINED", "Odenis lehv edilib. Zehmet olmasa basqa kart istifade edin", "Prompt retry with different card"],
        ["006", "Timeout", "PAY_TIMEOUT", "Odenis zamani kecdi. Zehmet olmasa yeniden cavab deyin", "Allow customer to retry"],
        ["007", "Duplicate transaction", "PAY_DUPLICATE", "Bu odenis artiq teleb olunub", "Check order status, prevent duplicate"],
        ["008", "3DS verification failed", "PAY_3DS_FAILED", "Dogrulama ugursuz oldu", "Restart 3DS flow"],
        ["099", "System error", "PAY_SYSTEM_ERROR", "Texniki xeta bas verdi. Zehmet olmasa biraz sonra yeniden cavab deyin", "Log error, alert ops team"],
      ],
      [1400, 1800, 1800, 2800, 2106]
    ),
  ];

  addSection(doc, children);
  await writeDoc(doc, filePath);
}

// ============================================================
// FILE 7: FRD Delivery Dashboard
// ============================================================
async function generateFRD_Delivery_Dashboard() {
  const doc = createDocument();
  const filePath = "/home/z/my-project/embafinans/03-delivery-dashboard/FRD_Delivery_Dashboard.docx";

  const children = [
    ...createTitle("Functional Requirements Document", "Goods Loan Delivery Tracking Dashboard"),
    ...createMetadata("Embafinans Delivery Management System", "1.0"),

    heading1("Table of Contents"),
    numberedItem(1, "Introduction"),
    numberedItem(2, "Functional Requirements"),
    numberedItem(3, "User Roles & Permissions"),
    numberedItem(4, "Non-Functional Requirements"),
    pageBreak(),

    heading1("1. Introduction"),
    heading2("1.1 Purpose"),
    bodyText(
      "This Functional Requirements Document defines the capabilities of the Embafinans Goods Loan Delivery Tracking Dashboard. The dashboard provides real-time visibility into the delivery lifecycle of goods purchased through credit financing, from warehouse pickup to customer doorstep."
    ),
    heading2("1.2 Business Context"),
    bodyText(
      "Embafinans finances goods purchases through its BNPL and goods loan products. Once a credit purchase is approved and paid, the physical product must be delivered to the customer. The current delivery process lacks visibility, with stakeholders relying on phone calls and WhatsApp messages to track delivery status. This project introduces a centralized, real-time tracking system."
    ),
    heading2("1.3 Scope"),
    bulletPoint("Real-time GPS tracking of delivery agents."),
    bulletPoint("Delivery checkpoint management (picked up, in transit, near customer, delivered)."),
    bulletPoint("E-signature capture for delivery confirmation."),
    bulletPoint("Real-time status push notifications to customers and internal stakeholders."),
    bulletPoint("Error and deviation alerting system."),
    bulletPoint("Delivery performance analytics."),
    bulletPoint("Out of scope: Route optimization algorithm, warehouse management."),

    heading1("2. Functional Requirements"),
    heading2("2.1 Real-Time GPS Tracking (REQ-101)"),
    heading3("REQ-101.1: Dashboard shows delivery agent location on map"),
    boldBodyText("Description: ", "The dashboard shall display the real-time GPS location of all active delivery agents on an interactive map. Each agent is represented by a marker showing their name, current delivery count, and assigned orders."),
    boldBodyText("Features: ", ""),
    bulletPoint("Interactive map with zoom, pan, and satellite view toggle."),
    bulletPoint("Agent markers with status indicators: available (green), in transit (blue), on break (yellow), offline (gray)."),
    bulletPoint("Click on agent marker to see assigned orders and current route."),
    bulletPoint("GPS update frequency: every 10 seconds during active delivery."),
    bulletPoint("Map auto-refreshes without manual page reload."),
    boldBodyText("Technical Details: ", ""),
    bulletPoint("Map provider: Leaflet.js with OpenStreetMap tiles (or Google Maps API if licensed)."),
    bulletPoint("Agent mobile app sends GPS coordinates via REST API every 10 seconds."),
    bulletPoint("Dashboard receives updates via WebSocket for real-time display."),

    heading2("2.2 Delivery Checkpoints (REQ-102)"),
    heading3("REQ-102.1: System logs delivery checkpoints"),
    boldBodyText("Description: ", "The system shall track and log delivery progress through predefined checkpoints. Each checkpoint update includes a timestamp, GPS coordinates, and optional photo proof."),
    createDataTable(
      ["Checkpoint", "Trigger", "Required Data", "Notification"],
      [
        ["ASSIGNED", "Order assigned to agent by dispatcher", "Agent ID, order ID", "Internal: Agent assigned"],
        ["PICKED_UP", "Agent confirms pickup from warehouse/store", "Photo of goods, GPS location", "Customer: Goods picked up"],
        ["IN_TRANSIT", "Agent starts route to customer", "GPS location", "Customer: On the way"],
        ["NEAR_CUSTOMER", "Agent within 500m of delivery address", "GPS location", "Customer: Almost there (push)"],
        ["DELIVERY_ATTEMPTED", "Agent arrives at customer location", "GPS location", "None (internal)"],
        ["DELIVERED", "Customer signs and confirms receipt", "E-signature, photo proof", "Customer: Delivered confirmation"],
        ["FAILED", "Delivery could not be completed", "Failure reason, photo", "Customer: Delivery rescheduled"],
        ["RESCHEDULED", "New delivery date agreed with customer", "New date/time", "Customer: New schedule confirmed"],
      ],
      [1800, 2200, 2200, 2606]
    ),

    heading2("2.3 E-Signature Capture (REQ-103)"),
    heading3("REQ-103.1: Customer signs digitally upon delivery confirmation"),
    boldBodyText("Description: ", "The delivery agent's mobile application shall capture the customer's electronic signature as proof of delivery. The e-signature is stored as part of the delivery record and is legally binding under Azerbaijani electronic signature regulations."),
    boldBodyText("E-Signature Flow: ", ""),
    bulletPoint("Step 1: Agent arrives at customer location and verifies customer identity (PIN or ID)."),
    bulletPoint("Step 2: Agent presents order summary on mobile device screen."),
    bulletPoint("Step 3: Customer reviews order details and signs on the device touch screen."),
    bulletPoint("Step 4: System captures signature as a vector graphic with timestamp."),
    bulletPoint("Step 5: Agent optionally takes photo of customer with goods for additional proof."),
    bulletPoint("Step 6: Signature and photos uploaded to server and linked to delivery record."),
    boldBodyText("Requirements: ", ""),
    bulletPoint("Signature pad must support smooth stroke rendering with anti-aliasing."),
    bulletPoint("Signature must include metadata: timestamp, GPS coordinates, device ID."),
    bulletPoint("Clear/redo option for customer before final submission."),
    bulletPoint("Offline support: Capture signature offline, sync when connectivity restored."),

    heading2("2.4 Delivery Status Updates (REQ-104)"),
    heading3("REQ-104.1: System pushes real-time status updates to stakeholders"),
    boldBodyText("Description: ", "The system shall push real-time delivery status updates to all relevant stakeholders via their preferred channels."),
    createDataTable(
      ["Stakeholder", "Channel", "Update Types", "Frequency"],
      [
        ["Customer", "SMS + Push", "Picked up, in transit, near, delivered, failed", "Real-time per checkpoint"],
        ["Operations Manager", "Dashboard + Email", "All checkpoints, errors, delays", "Real-time dashboard; hourly email summary"],
        ["Sales Agent", "Push Notification", "Delivered, failed", "Real-time"],
        ["Credit Department", "Dashboard", "Delivered (triggers disbursement confirmation)", "Real-time"],
        ["Partner Store", "Email", "Delivered confirmation", "Daily batch at 18:00"],
      ],
      [1800, 1800, 2600, 2706]
    ),

    heading2("2.5 Error Alert System (REQ-105)"),
    heading3("REQ-105.1: Dashboard alerts when delivery deviates from expected timeline"),
    boldBodyText("Description: ", "The system shall monitor delivery progress against expected timelines and generate alerts when deviations are detected."),
    boldBodyText("Alert Rules: ", ""),
    bulletPoint("Delayed Pickup: Order not picked up within 2 hours of assignment -> Alert operations."),
    bulletPoint("GPS Inactivity: Agent GPS not updating for > 5 minutes during active delivery -> Alert operations."),
    bulletPoint("Route Deviation: Agent moves > 2km away from expected route -> Alert operations."),
    bulletPoint("Delivery Timeout: Delivery not completed within expected time window -> Alert operations and customer."),
    bulletPoint("Failed Delivery: 2 consecutive failed delivery attempts -> Escalate to senior manager."),
    bulletPoint("High Failure Rate: Agent with > 15% failure rate in past 7 days -> Alert operations manager."),
    boldBodyText("Alert Channels: ", "Dashboard banner (red), SMS to operations manager, email escalation (if unresolved after 30 minutes)."),

    heading2("2.6 Performance Analytics (REQ-106)"),
    heading3("REQ-106.1: Dashboard shows delivery time, error rate, agent performance"),
    boldBodyText("Description: ", "The dashboard shall provide comprehensive analytics on delivery operations performance."),
    boldBodyText("KPIs: ", ""),
    bulletPoint("Average Delivery Time: From pickup to delivery confirmation."),
    bulletPoint("On-Time Delivery Rate: Percentage of deliveries completed within promised time window."),
    bulletPoint("First-Attempt Success Rate: Percentage of deliveries completed on first attempt."),
    bulletPoint("Delivery Error Rate: Percentage of failed or rescheduled deliveries."),
    bulletPoint("Agent Utilization: Percentage of agent working time spent on active deliveries."),
    bulletPoint("Customer Satisfaction Score: Post-delivery survey rating (1-5 stars)."),
    boldBodyText("Analytics Views: ", ""),
    bulletPoint("Daily/weekly/monthly trend charts for all KPIs."),
    bulletPoint("Agent leaderboard: ranked by delivery time, success rate, and customer rating."),
    bulletPoint("Geographic heat map: delivery density and failure hotspots."),
    bulletPoint("Export: CSV and PDF report generation for management review."),

    // 3. User Roles
    heading1("3. User Roles & Permissions"),
    createDataTable(
      ["Role", "Dashboard Access", "Actions", "Notifications"],
      [
        ["Operations Manager", "Full access (all views)", "Assign orders, reassign agents, view analytics, manage alerts", "All alerts, daily summary"],
        ["Dispatcher", "Order assignment, agent tracking", "Assign orders to agents, view agent locations, update order status", "Assignment alerts, GPS alerts"],
        ["Delivery Agent", "Mobile app only", "View assigned orders, update checkpoints, capture e-signature", "New assignment, route info"],
        ["Sales Agent", "Order status view", "View delivery status for their customers", "Delivery confirmation for their orders"],
        ["Credit Manager", "Delivery confirmation view", "View delivery confirmation status (disbursement trigger)", "Delivery confirmed notifications"],
        ["Senior Management", "Analytics view", "View performance reports, KPI dashboards", "Weekly summary email"],
      ],
      [1600, 1800, 2800, 2706]
    ),

    // 4. Non-Functional Requirements
    heading1("4. Non-Functional Requirements"),
    createDataTable(
      ["Category", "Requirement", "Target"],
      [
        ["Real-Time", "GPS update frequency", "Every 10 seconds"],
        ["Real-Time", "Dashboard refresh latency", "< 5 seconds from event to display"],
        ["Real-Time", "Push notification delivery", "< 10 seconds from event to notification"],
        ["Performance", "Dashboard page load", "< 3 seconds"],
        ["Performance", "Map rendering with 100 agents", "< 2 seconds"],
        ["Availability", "System uptime", "99% (GPS/real-time features); 99.5% (dashboard)"],
        ["Scalability", "Concurrent agents", "Support up to 200 active agents"],
        ["Scalability", "Daily deliveries", "Support up to 1,000 deliveries per day"],
        ["Offline", "Agent mobile app offline mode", "Full functionality for up to 4 hours offline"],
        ["Security", "GPS data encryption", "TLS 1.3 in transit, AES-256 at rest"],
        ["Security", "E-signature integrity", "SHA-256 hash with tamper-evident seal"],
        ["Compliance", "Data retention", "E-signatures and delivery records retained for 5 years"],
        ["Compliance", "GPS data privacy", "GPS history purged after 90 days; real-time only for active deliveries"],
      ],
      [1800, 3200, 3906]
    ),
  ];

  addSection(doc, children);
  await writeDoc(doc, filePath);
}

// ============================================================
// FILE 8: SRS Credit Lifecycle
// ============================================================
async function generateSRS_Credit_Lifecycle() {
  const doc = createDocument();
  const filePath = "/home/z/my-project/embafinans/04-credit-lifecycle/SRS_Credit_Lifecycle.docx";

  const children = [
    ...createTitle("Software Requirements Specification", "End-to-End Credit Lifecycle Management"),
    ...createMetadata("Embafinans Credit Lifecycle Platform", "1.0"),

    heading1("Table of Contents"),
    numberedItem(1, "Introduction"),
    numberedItem(2, "Overall Description"),
    numberedItem(3, "Functional Requirements"),
    numberedItem(4, "System Architecture"),
    numberedItem(5, "Non-Functional Requirements"),
    pageBreak(),

    heading1("1. Introduction"),
    heading2("1.1 Purpose"),
    bodyText(
      "This Software Requirements Specification (SRS) defines the comprehensive requirements for the Embafinans End-to-End Credit Lifecycle Management Platform. The platform covers the entire credit journey from initial application through disbursement, repayment, and collection, providing a unified system for all credit operations."
    ),
    heading2("1.2 Document Scope"),
    bodyText(
      "This document encompasses all software requirements for the credit lifecycle platform, including application intake, automated underwriting, approval workflows, loan disbursement, repayment management, overdue handling, and cross-functional coordination. It serves as the master requirements document for the full system implementation."
    ),
    heading2("1.3 References"),
    bulletPoint("BRD_Credit_Scoring.docx \u2014 Business Requirements for Credit Scoring"),
    bulletPoint("FRD_Credit_Scoring.docx \u2014 Functional Requirements for Credit Scoring"),
    bulletPoint("FRD_B2C_Sales_Channel.docx \u2014 Functional Requirements for B2C Channel"),
    bulletPoint("FRD_Delivery_Dashboard.docx \u2014 Functional Requirements for Delivery Tracking"),
    bulletPoint("Embafinans Enterprise Architecture Blueprint v3.0"),
    bulletPoint("Central Bank of Azerbaijan Consumer Credit Regulations 2024"),

    heading1("2. Overall Description"),
    heading2("2.1 System Context"),
    bodyText(
      "The Credit Lifecycle Platform sits at the core of Embafinans' operations, orchestrating interactions between multiple internal departments (Risk, Sales, Operations, Finance) and external systems (Credit Bureau, Payment Gateway, Banks, SMS/Email providers). It replaces the current fragmented landscape of spreadsheets, email-based workflows, and standalone tools."
    ),
    heading2("2.2 Product Perspective"),
    bodyText(
      "The platform is a suite of integrated microservices communicating via REST APIs and message queues. Each lifecycle stage is handled by a dedicated service, with an orchestration layer managing cross-service workflows and data consistency."
    ),
    heading2("2.3 User Characteristics"),
    createDataTable(
      ["User Type", "Description", "Technical Skill", "Primary Tasks"],
      [
        ["End Customer", "Individual applying for credit products", "Low (mobile app user)", "Submit applications, track status, make payments, view schedule"],
        ["Credit Analyst", "Risk department staff reviewing applications", "Medium (internal tools)", "Review borderline applications, override decisions, add notes"],
        ["Operations Staff", "Warehouse and delivery coordinators", "Medium (dispatch tools)", "Manage delivery assignments, track shipments, handle returns"],
        ["Sales Agent", "Partner store representatives", "Medium (POS system)", "Submit applications on behalf of customers, track approvals"],
        ["Finance Officer", "Accounting and reconciliation staff", "High (financial systems)", "Reconcile payments, manage disbursements, generate reports"],
        ["System Administrator", "IT operations and DevOps team", "High (server management)", "Configure system, monitor health, manage integrations"],
        ["Risk Manager", "Senior risk department leadership", "Medium (analytics tools)", "Monitor portfolio risk, adjust scoring parameters, review reports"],
      ],
      [1600, 2000, 1800, 3506]
    ),
    heading2("2.4 Constraints"),
    bulletPoint("Must integrate with existing partner store systems without requiring changes to their software."),
    bulletPoint("Must comply with Central Bank of Azerbaijan reporting requirements."),
    bulletPoint("Must support Azerbaijani language (Latin script) for all customer-facing interfaces."),
    bulletPoint("All financial calculations must use decimal arithmetic to avoid floating-point rounding errors."),
    bulletPoint("System must be deployable on-premises or in a certified local data center."),

    heading1("3. Functional Requirements"),
    heading2("3.1 Online Application (REQ-101)"),
    heading3("REQ-101.1: Customer submits application via mobile app"),
    boldBodyText("Description: ", "The system shall provide a multi-channel application submission capability. Customers can apply via the mobile app, partner store portal, or B2C website. All channels feed into a unified application processing pipeline."),
    boldBodyText("Features: ", ""),
    bulletPoint("Guided application wizard with step-by-step form sections."),
    bulletPoint("Auto-save draft applications; resume capability within 7 days."),
    bulletPoint("Document upload: salary certificate, bank statement (optional, for higher amounts)."),
    bulletPoint("Instant application validation with inline error messages."),
    bulletPoint("Application status page with real-time progress tracker."),
    boldBodyText("Supported Channels: ", "Mobile App (iOS/Android), Partner Store Portal, B2C Website, Call Center (agent-assisted)."),

    heading2("3.2 Automated Underwriting (REQ-102)"),
    heading3("REQ-102.1: System performs credit scoring and risk assessment"),
    boldBodyText("Description: ", "The system shall perform automated underwriting using the credit scoring engine. The underwriting process includes bureau inquiry, multi-factor scoring, fraud detection, and policy rule checks."),
    boldBodyText("Underwriting Pipeline: ", ""),
    bulletPoint("Step 1: Data validation and enrichment (validate all fields, normalize data)."),
    bulletPoint("Step 2: Pre-screen check (age, income, amount, bankruptcy)."),
    bulletPoint("Step 3: Credit bureau inquiry (real-time score retrieval)."),
    bulletPoint("Step 4: Fraud detection check (cross-reference blacklists, check for duplicate applications)."),
    bulletPoint("Step 5: Multi-factor scoring (5 weighted factors -> composite score 0-100)."),
    bulletPoint("Step 6: Policy rule engine (additional business rules beyond scoring model)."),
    bulletPoint("Step 7: Decision determination (approve/review/reject with reason codes)."),

    heading2("3.3 Approval Workflow (REQ-103)"),
    heading3("REQ-103.1: System supports auto-approve and manual review paths"),
    boldBodyText("Description: ", "The system shall implement a flexible approval workflow supporting both automated and human-in-the-loop decision paths."),
    createDataTable(
      ["Decision Path", "Score Range", "Process", "SLA"],
      [
        ["Auto-Approve", ">= 80", "Immediate approval, no human intervention", "< 5 seconds"],
        ["Manual Review", "50 - 79", "Queued for credit analyst, prioritized by score", "Assignment within 4 hours, decision within 24 hours"],
        ["Auto-Reject", "< 50", "Immediate rejection with reason code", "< 5 seconds"],
        ["Override", "Any", "Senior risk manager can override any decision", "Within 48 hours"],
      ],
      [1800, 1400, 3000, 2706]
    ),
    boldBodyText("Manual Review Features: ", ""),
    bulletPoint("Analyst workbench with all applicant data, bureau report, and scoring breakdown."),
    bulletPoint("Decision buttons: Approve, Reject, Request Additional Documents."),
    bulletPoint("Comment/note field for analyst justification (mandatory for override decisions)."),
    bulletPoint("Escalation path: Analyst -> Senior Analyst -> Risk Manager."),

    heading2("3.4 Loan Disbursement (REQ-104)"),
    heading3("REQ-104.1: System disburses approved loans via bank API"),
    boldBodyText("Description: ", "The system shall initiate loan disbursement upon credit approval and payment confirmation (for down payments). Disbursement transfers funds to the merchant/partner store account."),
    boldBodyText("Disbursement Process: ", ""),
    bulletPoint("Step 1: Verify credit approval status and all conditions are met."),
    bulletPoint("Step 2: Confirm down payment receipt (if applicable)."),
    bulletPoint("Step 3: Generate disbursement instruction with loan details."),
    bulletPoint("Step 4: Submit disbursement request to bank API."),
    bulletPoint("Step 5: Receive and record bank confirmation with transaction reference."),
    bulletPoint("Step 6: Update loan account status to 'DISBURSED'."),
    bulletPoint("Step 7: Trigger repayment schedule generation."),
    boldBodyText("Error Handling: ", "If bank API returns failure, system queues disbursement for retry (max 3 attempts) and alerts finance team."),

    heading2("3.5 Repayment Schedule (REQ-105)"),
    heading3("REQ-105.1: System generates and manages repayment schedules"),
    boldBodyText("Description: ", "The system shall automatically generate installment repayment schedules upon loan disbursement. The schedule defines all future payment obligations for the customer."),
    boldBodyText("Schedule Details: ", ""),
    bulletPoint("Payment frequency: Monthly, on the same calendar date each month."),
    bulletPoint("First payment due: 30 days after disbursement date."),
    bulletPoint("Each installment includes: principal portion, interest portion, and total due amount."),
    bulletPoint("Interest calculation: Declining balance method with daily interest accrual."),
    bulletPoint("Grace period: 5 calendar days after due date before late fee applies."),
    bulletPoint("Late fee: 0.5% of overdue amount per day, capped at 10% of outstanding balance."),
    boldBodyText("Schedule Management: ", ""),
    bulletPoint("Customers can view full schedule on mobile app."),
    bulletPoint("Early repayment option with interest recalculation."),
    bulletPoint("Schedule modification for approved restructurings."),

    heading2("3.6 Payment Collection (REQ-106)"),
    heading3("REQ-106.1: System collects payments and updates account status"),
    boldBodyText("Description: ", "The system shall support multiple payment channels for loan repayment and automatically update account status upon payment receipt."),
    boldBodyText("Payment Channels: ", ""),
    bulletPoint("Auto-debit from customer bank account (preferred method)."),
    bulletPoint("Bank transfer to designated collection account."),
    bulletPoint("Payment via mobile app (card payment)."),
    bulletPoint("Cash payment at partner store locations."),
    bulletPoint("Payment via payment kiosks (existing network)."),
    boldBodyText("Payment Processing: ", ""),
    bulletPoint("Real-time payment matching via unique reference codes."),
    bulletPoint("Partial payment support with pro-rata allocation (fees first, then interest, then principal)."),
    bulletPoint("Payment confirmation via SMS within 5 minutes."),
    bulletPoint("Automatic receipt generation (PDF) available in mobile app."),

    heading2("3.7 Overdue Management (REQ-107)"),
    heading3("REQ-107.1: System identifies overdue payments and triggers collection workflow"),
    boldBodyText("Description: ", "The system shall monitor all repayment schedules and automatically identify overdue payments. Upon overdue detection, the system triggers a graduated collection workflow."),
    createDataTable(
      ["Days Overdue", "Stage", "Action", "Responsible"],
      [
        ["1 - 5", "Grace Period", "No action; reminder SMS on day 3", "System (automated)"],
        ["6 - 15", "Early Collection", "SMS reminder on day 6 and day 10; push notification", "System (automated)"],
        ["16 - 30", "Active Collection", "Phone call from collection agent; email notification", "Collection Agent"],
        ["31 - 60", "Escalated Collection", "Senior agent call; formal demand letter (email/postal)", "Senior Collector"],
        ["61 - 90", "Pre-Legal", "Warning of legal action; final demand letter", "Collection Manager"],
        ["> 90", "Legal / Write-Off", "Legal department review; potential write-off recommendation", "Legal / Finance"],
      ],
      [1600, 1800, 3200, 2306]
    ),

    heading2("3.8 Cross-Functional Coordination (REQ-108)"),
    heading3("REQ-108.1: System coordinates between risk, sales, operations, and finance"),
    boldBodyText("Description: ", "The system shall provide cross-functional coordination capabilities ensuring all departments have visibility and can collaborate on credit lifecycle events."),
    boldBodyText("Coordination Features: ", ""),
    bulletPoint("Unified case view: All departments see the same customer/loan data from their perspective."),
    bulletPoint("Event-driven notifications: Department-specific alerts for relevant lifecycle events."),
    bulletPoint("Task management: Cross-department tasks assignable with tracking and SLA."),
    bulletPoint("Shared notes: All departments can add and view notes on customer accounts."),
    bulletPoint("Reporting: Cross-functional reports showing end-to-end pipeline metrics."),
    createDataTable(
      ["Event", "Risk Dept", "Sales Dept", "Operations", "Finance"],
      [
        ["Application Submitted", "View for scoring", "View (own applications)", "\u2014", "\u2014"],
        ["Credit Approved", "Decision recorded", "Notify customer", "Prepare delivery", "\u2014"],
        ["Delivery Completed", "Confirmation received", "Close sale", "Mark complete", "Initiate disbursement"],
        ["Disbursement Done", "Activate monitoring", "\u2014", "\u2014", "Record transaction"],
        ["Payment Overdue", "Monitor portfolio", "Customer contact", "\u2014", "Reconcile"],
        ["Default", "Loss provisioning", "Account review", "\u2014", "Write-off processing"],
      ],
      [2000, 2200, 2000, 1600, 2106]
    ),

    // 4. System Architecture
    heading1("4. System Architecture"),
    heading2("4.1 High-Level Architecture"),
    bodyText(
      "The Credit Lifecycle Platform is designed as a microservices architecture with the following core components:"
    ),
    boldBodyText("1. API Gateway: ", "Single entry point for all external requests; handles authentication, rate limiting, and routing."),
    boldBodyText("2. Application Service: ", "Manages credit applications, validation, and orchestration of the underwriting pipeline."),
    boldBodyText("3. Scoring Engine: ", "Multi-factor credit scoring with configurable weights and decision rules."),
    boldBodyText("4. Decision Service: ", "Automated decision engine with manual review queue management."),
    boldBodyText("5. Loan Management Service: ", "Handles loan accounts, repayment schedules, and payment processing."),
    boldBodyText("6. Collection Service: ", "Manages overdue detection, collection workflow, and escalation."),
    boldBodyText("7. Notification Service: ", "Centralized SMS and email delivery with template management."),
    boldBodyText("8. Integration Hub: ", "Manages external system connections (Credit Bureau, Banks, Payment Gateway, SMS/Email)."),
    boldBodyText("9. Analytics Engine: ", "Real-time and batch analytics for dashboards and reports."),
    boldBodyText("10. Event Bus: ", "Message queue (RabbitMQ/Kafka) for asynchronous inter-service communication."),
    bodyText("All services communicate via REST APIs for synchronous calls and the Event Bus for asynchronous event notifications. Data persistence uses PostgreSQL for relational data and Redis for caching and session management."),

    // 5. Non-Functional Requirements
    heading1("5. Non-Functional Requirements"),
    createDataTable(
      ["Category", "Requirement", "Target"],
      [
        ["Performance", "Application submission response", "< 3 seconds (UI)"],
        ["Performance", "Automated scoring end-to-end", "< 60 seconds"],
        ["Performance", "Dashboard page load", "< 3 seconds"],
        ["Performance", "API response time (95th percentile)", "< 500ms"],
        ["Availability", "Platform uptime", "99.5% overall"],
        ["Availability", "Payment processing", "99.9% during business hours (09:00-21:00)"],
        ["Scalability", "Concurrent users", "1,000+ concurrent users"],
        ["Scalability", "Daily applications", "10,000+ per day"],
        ["Scalability", "Active loan accounts", "100,000+ concurrent accounts"],
        ["Reliability", "Data durability", "Zero data loss (synchronous replication)"],
        ["Reliability", "Recovery time objective (RTO)", "< 4 hours"],
        ["Reliability", "Recovery point objective (RPO)", "< 15 minutes"],
        ["Security", "Encryption at rest", "AES-256"],
        ["Security", "Encryption in transit", "TLS 1.3"],
        ["Security", "Authentication", "OAuth 2.0 + JWT for APIs; session-based for web"],
        ["Security", "Authorization", "Role-based access control (RBAC) with 10+ defined roles"],
        ["Audit", "Audit trail", "All write operations logged with user, timestamp, before/after values"],
        ["Audit", "Retention", "7 years for financial data; 3 years for operational data"],
        ["Compliance", "Data protection", "Azerbaijani data protection law compliant"],
        ["Compliance", "Financial reporting", "Central Bank regulatory reporting formats"],
      ],
      [1800, 3200, 3906]
    ),
  ];

  addSection(doc, children);
  await writeDoc(doc, filePath);
}

// ============================================================
// FILE 9: Gap Analysis Lifecycle
// ============================================================
async function generateGap_Analysis_Lifecycle() {
  const doc = createDocument();
  const filePath = "/home/z/my-project/embafinans/04-credit-lifecycle/Gap_Analysis_Lifecycle.docx";

  const children = [
    ...createTitle("Gap Analysis Report", "Current vs Automated Credit Lifecycle"),
    ...createMetadata("Embafinans Credit Lifecycle Platform", "1.0"),

    heading1("Table of Contents"),
    numberedItem(1, "Introduction"),
    numberedItem(2, "Methodology"),
    numberedItem(3, "Gap Analysis Matrix"),
    numberedItem(4, "Priority Summary & Roadmap"),
    numberedItem(5, "Risk Assessment"),
    pageBreak(),

    heading1("1. Introduction"),
    bodyText(
      "This Gap Analysis document provides a comprehensive comparison between the current manual credit lifecycle management at Embafinans and the proposed automated Credit Lifecycle Platform. The analysis covers all stages from application intake through collection, identifying critical gaps and providing a prioritized implementation roadmap."
    ),
    bodyText(
      "The current state reflects Embafinans' operations as observed during the Q4 2024 assessment period. The future state is based on the requirements defined in the SRS_Credit_Lifecycle.docx (v1.0) and supporting FRD documents."
    ),

    heading1("2. Methodology"),
    bodyText("The analysis was conducted using the following approach:"),
    numberedItem(1, "Stakeholder Interviews: Sessions with Risk, Sales, Operations, Finance, and IT departments."),
    numberedItem(2, "Process Observation: Shadowing of credit analysts, collection agents, and operations staff."),
    numberedItem(3, "Document Review: Analysis of existing SOPs, checklists, and spreadsheet-based workflows."),
    numberedItem(4, "Gap Identification: Systematic comparison of current capabilities vs. target requirements."),
    numberedItem(5, "Impact Assessment: Business impact scoring for each gap (High/Medium/Low)."),
    bodyText("Each gap is assessed on two dimensions:"),
    bulletPoint("Business Impact: How significantly does the gap affect operations, revenue, or compliance?"),
    bulletPoint("Implementation Complexity: How difficult is it to close the gap (technical, organizational, cost)?"),

    heading1("3. Gap Analysis Matrix"),
    bodyText("The following table presents the gap analysis across all credit lifecycle stages:"),
    emptyLine(),
    createDataTable(
      ["Area", "Current State (As-Is)", "Future State (To-Be)", "Gap Description", "Priority", "Recommendation"],
      [
        [
          "Application Process",
          "Paper forms at partner stores; manual data entry into Excel; no application tracking",
          "Multi-channel digital submission (mobile, web, POS) with guided wizard and real-time status tracking",
          "No digital application channel; high error rate from manual data entry; no visibility into application pipeline",
          "High",
          "Deploy online application portal with mobile app integration and real-time status tracking",
        ],
        [
          "Credit Underwriting",
          "Analysts manually review each application; subjective assessment based on experience; no standardized model",
          "Automated multi-factor scoring engine with configurable weights; pre-screening and fraud detection",
          "Inconsistent underwriting decisions; no standardization; slow processing; high dependency on individual analysts",
          "High",
          "Implement automated scoring engine with 5-factor model and configurable decision rules",
        ],
        [
          "Approval Workflow",
          "Weekly credit committee meetings for all decisions; physical signature required; paper-based approval memos",
          "Automated decision engine with auto-approve/reject; digital manual review queue with analyst workbench",
          "Committee bottleneck causing 5-7 day delays; no priority handling; paper trail management overhead",
          "High",
          "Deploy automated decision engine with digital review queue and committee override capability",
        ],
        [
          "Loan Disbursement",
          "Manual bank transfer requests via email to finance; manual reconciliation; no tracking of disbursement status",
          "Automated disbursement via bank API with real-time status tracking and automatic reconciliation",
          "Manual process with delays; reconciliation errors; no real-time visibility into disbursement status",
          "High",
          "Integrate with bank API for automated disbursement initiation and status tracking",
        ],
        [
          "Repayment Tracking",
          "Excel spreadsheets tracking payment due dates; manual tick-off when payments received; no automated alerts",
          "Automated schedule generation with payment tracking, reminders, and multi-channel payment collection",
          "No automated tracking; missed payments go unnoticed; manual reconciliation is error-prone and time-consuming",
          "High",
          "Build automated repayment management with schedule generation, reminders, and payment matching",
        ],
        [
          "Collection Management",
          "Ad-hoc phone calls by sales agents; no escalation process; no tracking of collection activities",
          "Graduated collection workflow with automated stages, task assignment, SLA tracking, and escalation",
          "No structured collection process; inconsistent follow-up; no performance measurement; high write-off risk",
          "High",
          "Implement automated collection workflow with stage-based escalation and agent performance tracking",
        ],
        [
          "Cross-Department Coordination",
          "Email and WhatsApp communication between departments; no shared system; information silos",
          "Unified platform with shared case view, event-driven notifications, cross-functional task management",
          "Departments work in silos; information lost in email threads; no shared visibility; duplicate efforts",
          "High",
          "Deploy unified credit lifecycle platform with shared views and event-driven coordination",
        ],
        [
          "Customer Communication",
          "Phone calls by agents; inconsistent messaging; no delivery tracking; no self-service capability",
          "Automated multi-channel notifications (SMS, email, push) with self-service mobile app",
          "Slow and inconsistent communication; no delivery confirmation; customer cannot check status independently",
          "Medium",
          "Implement automated notification service and customer self-service portal in mobile app",
        ],
        [
          "Reporting & Analytics",
          "Manually compiled monthly Excel reports; no real-time data; limited KPI tracking",
          "Real-time analytics dashboards with customizable KPIs, trend analysis, and automated report generation",
          "No real-time visibility; delayed reporting; limited analysis capability; management decisions based on stale data",
          "Medium",
          "Build analytics platform with real-time dashboards, KPI tracking, and automated reporting",
        ],
        [
          "Compliance & Audit",
          "Physical paper files stored in cabinets; manual retrieval for audits; no centralized audit trail",
          "Digital audit trail with full lifecycle history; automated compliance reporting; 7-year retention",
          "Difficult audit preparation; risk of missing records; no proactive compliance monitoring",
          "Medium",
          "Implement comprehensive digital audit logging with compliance reporting and retention management",
        ],
      ],
      [1300, 1700, 1700, 1700, 800, 2706]
    ),

    pageBreak(),
    heading1("4. Priority Summary & Roadmap"),
    createDataTable(
      ["Priority", "Count", "Areas", "Implementation Phase", "Timeline"],
      [
        ["High", "7", "Application, Underwriting, Approval, Disbursement, Repayment, Collection, Coordination", "Phase 1: Core Platform", "Q1-Q2 2025"],
        ["Medium", "3", "Customer Communication, Reporting, Compliance", "Phase 2: Enhancement", "Q3 2025"],
        ["Low", "0", "\u2014", "\u2014", "\u2014"],
      ],
      [1200, 800, 3400, 2000, 2506]
    ),

    heading2("4.1 Phase 1: Core Platform (Q1-Q2 2025)"),
    bodyText("The core platform phase addresses all high-priority gaps with the following deliverables:"),
    numberedItem(1, "Digital Application Portal: Multi-channel submission with guided wizard (Month 1-2)."),
    numberedItem(2, "Credit Scoring Engine: Automated multi-factor scoring with decision automation (Month 2-3)."),
    numberedItem(3, "Approval Workflow: Digital review queue with analyst workbench (Month 3-4)."),
    numberedItem(4, "Disbursement Integration: Bank API integration with status tracking (Month 4-5)."),
    numberedItem(5, "Repayment Management: Schedule generation, tracking, and payment matching (Month 5-6)."),
    numberedItem(6, "Collection Workflow: Graduated collection stages with task management (Month 5-6)."),
    numberedItem(7, "Unified Platform: Cross-functional views and event-driven coordination (Month 6)."),

    heading2("4.2 Phase 2: Enhancement (Q3 2025)"),
    bodyText("The enhancement phase builds on the core platform with customer-facing and analytical features:"),
    numberedItem(1, "Automated Notifications: SMS and email service with template management."),
    numberedItem(2, "Analytics Dashboards: Real-time KPI monitoring and trend analysis."),
    numberedItem(3, "Compliance Module: Automated audit trail and regulatory reporting."),

    heading1("5. Risk Assessment"),
    createDataTable(
      ["Risk", "Probability", "Impact", "Mitigation"],
      [
        ["Stakeholder resistance to change", "Medium", "High", "Early stakeholder engagement; training program; phased rollout"],
        ["Integration complexity with banks", "Medium", "High", "Early API evaluation; fallback manual process; dedicated integration team"],
        ["Data quality issues in migration", "High", "Medium", "Data cleansing before migration; validation rules; parallel run period"],
        ["Scoring model accuracy concerns", "Medium", "High", "Champion-challenger testing; manual review safety net; model monitoring"],
        ["Budget overrun", "Medium", "Medium", "Phased implementation; MVP approach; regular cost tracking"],
        ["Vendor dependency for payment gateway", "Low", "High", "Multi-vendor strategy; abstraction layer for gateway integration"],
        ["Regulatory changes during implementation", "Low", "Medium", "Regulatory monitoring; flexible architecture for rule changes"],
      ],
      [2800, 1200, 1000, 3906]
    ),
  ];

  addSection(doc, children);
  await writeDoc(doc, filePath);
}

// ============================================================
// FILE 10: Data Mapping Lifecycle
// ============================================================
async function generateData_Mapping_Lifecycle() {
  const doc = createDocument();
  const filePath = "/home/z/my-project/embafinans/04-credit-lifecycle/Data_Mapping_Lifecycle.docx";

  const children = [
    ...createTitle("Data Mapping Document", "Credit Lifecycle System Integration"),
    ...createMetadata("Embafinans Credit Lifecycle Platform", "1.0"),

    heading1("Table of Contents"),
    numberedItem(1, "Introduction"),
    numberedItem(2, "Integration Overview"),
    numberedItem(3, "Application Data Mapping"),
    numberedItem(4, "Scoring Result Mapping"),
    numberedItem(5, "Disbursement Record Mapping"),
    numberedItem(6, "Repayment Schedule Mapping"),
    numberedItem(7, "Collection Record Mapping"),
    numberedItem(8, "Cross-System Data Flow Summary"),
    pageBreak(),

    heading1("1. Introduction"),
    bodyText(
      "This Data Mapping Document defines the field-level data exchange between multiple source systems and the unified Embafinans Credit Lifecycle Platform. It covers all lifecycle stages: application intake, credit scoring, loan disbursement, repayment management, and collection."
    ),
    bodyText(
      "The Credit Lifecycle Platform serves as the central data hub, aggregating information from partner stores, mobile app, credit bureau, payment gateway, banks, and internal departmental systems."
    ),

    heading1("2. Integration Overview"),
    createDataTable(
      ["Source System", "System Type", "Data Direction", "Integration Method", "Data Scope"],
      [
        ["Partner Store Portal", "Web Portal", "Store -> Platform", "REST API (HTTPS POST)", "Application data, product/order info"],
        ["Mobile App", "Mobile (iOS/Android)", "App -> Platform", "REST API (HTTPS POST)", "Application data, documents, payments"],
        ["B2C Website", "Web Application", "Web -> Platform", "REST API (HTTPS POST)", "Orders, applications, payments"],
        ["Credit Bureau", "External API", "Bureau -> Platform", "REST API (HTTPS GET)", "Credit score, credit history"],
        ["Payment Gateway", "External API", "Bidirectional", "REST API (HTTPS POST/GET)", "Payment requests, responses, webhooks"],
        ["Bank (Disbursement)", "External API", "Platform -> Bank", "REST API (HTTPS POST)", "Disbursement instructions"],
        ["Bank (Collection)", "External API", "Bank -> Platform", "REST API (HTTPS GET/Webhook)", "Payment confirmations, returns"],
        ["SMS Gateway", "External API", "Platform -> SMS", "REST API (HTTPS POST)", "Notification delivery"],
        ["Email Service", "External API", "Platform -> Email", "SMTP / REST API", "Notification delivery"],
        ["Delivery Service", "Internal Service", "Bidirectional", "REST API + WebSocket", "Delivery status, GPS, e-signature"],
      ],
      [1800, 1600, 1400, 2000, 3106]
    ),

    heading1("3. Application Data Mapping"),
    bodyText("Source: Partner Store Portal / Mobile App / B2C Website -> Target: Application Service"),
    emptyLine(),
    createDataTable(
      ["Source Field", "Source System", "Target Field", "Data Type", "Transformation", "Validation"],
      [
        ["full_name", "Store/App/Web", "applicant_full_name", "VARCHAR(100)", "TRIM, Title Case", "NOT NULL, min 2 chars"],
        ["phone_number", "Store/App/Web", "applicant_mobile", "VARCHAR(13)", "Format +994XXXXXXXXX", "Regex validation"],
        ["pin_code", "Store/App/Web", "applicant_pin_hash", "VARCHAR(64)", "SHA-256 hash with salt", "7 alphanumeric chars"],
        ["income_amount", "Store/App/Web", "monthly_income", "DECIMAL(10,2)", "Convert to AZN", "> 0"],
        ["income_currency", "Store/App", "income_original_currency", "VARCHAR(3)", "ISO 4217 code", "AZN/USD/EUR/GBP"],
        ["job_type", "Store/App/Web", "employment_type", "ENUM", "Normalize to enum", "Valid enum value"],
        ["company_name", "Store/App/Web", "employer_name", "VARCHAR(100)", "TRIM, Title Case", "Max 100 chars"],
        ["work_months", "Store/App/Web", "employment_months", "INTEGER", "Parse integer", ">= 0"],
        ["loan_amount", "Store/App/Web", "requested_amount", "DECIMAL(12,2)", "Round 2 decimals", "100-50,000 AZN"],
        ["product_category", "Store/Web", "loan_product_type", "ENUM", "Map to BNPL/GOODS_LOAN", "Valid enum"],
        ["store_identifier", "Store", "partner_store_id", "VARCHAR(20)", "Lookup internal ID", "Must exist"],
        ["channel_source", "All", "application_channel", "ENUM", "Detect channel type", "Valid enum"],
      ],
      [1200, 1200, 1200, 1000, 1600, 1706]
    ),

    heading1("4. Scoring Result Mapping"),
    bodyText("Source: Credit Scoring Engine -> Target: Credit Lifecycle Platform (Application Service)"),
    emptyLine(),
    createDataTable(
      ["Scoring Engine Field", "Description", "Platform Field", "Data Type", "Transformation", "Notes"],
      [
        ["application_id", "Application reference", "application_id", "VARCHAR(50)", "Direct pass-through", "FK link"],
        ["composite_score", "Final weighted score", "credit_score", "DECIMAL(5,2)", "Direct pass-through", "0-100 scale"],
        ["bureau_score_raw", "Raw bureau score", "bureau_score_raw", "INTEGER", "Direct pass-through", "0-1000 scale"],
        ["income_factor", "Income factor score", "income_factor_score", "DECIMAL(5,2)", "Direct pass-through", "0-100"],
        ["dti_factor", "DTI factor score", "dti_factor_score", "DECIMAL(5,2)", "Direct pass-through", "0-100"],
        ["employment_factor", "Employment factor score", "employment_factor_score", "DECIMAL(5,2)", "Direct pass-through", "0-100"],
        ["loans_factor", "Loans factor score", "loans_factor_score", "DECIMAL(5,2)", "Direct pass-through", "0-100"],
        ["decision", "Scoring decision", "scoring_decision", "ENUM", "Direct pass-through", "APPROVED/MANUAL_REVIEW/REJECTED"],
        ["decision_reason", "Decision reason code", "decision_reason_code", "VARCHAR(20)", "Direct pass-through", "Standard reason codes"],
        ["scored_at", "Scoring timestamp", "scoring_timestamp", "DATETIME", "Parse ISO 8601", "UTC -> Baku time"],
        ["model_version", "Scoring model version", "model_version", "VARCHAR(20)", "Direct pass-through", "For audit"],
      ],
      [1400, 1400, 1400, 1000, 1400, 1306]
    ),

    heading1("5. Disbursement Record Mapping"),
    bodyText("Source: Bank API (Disbursement) -> Target: Credit Lifecycle Platform (Loan Management Service)"),
    emptyLine(),
    createDataTable(
      ["Bank API Field", "Description", "Platform Field", "Data Type", "Transformation", "Validation"],
      [
        ["disbursement_ref", "Bank disbursement reference", "bank_disbursement_ref", "VARCHAR(50)", "Direct pass-through", "NOT NULL"],
        ["application_id", "Loan application reference", "application_id", "VARCHAR(50)", "Direct pass-through", "Must exist"],
        ["disbursement_status", "Processing status", "disbursement_status", "ENUM", "Map: PROCESSED->COMPLETED, FAILED->FAILED, PENDING->PENDING", "Valid enum"],
        ["transfer_amount", "Disbursed amount", "disbursed_amount", "DECIMAL(12,2)", "Convert from qapik to AZN (divide 100)", "> 0"],
        ["beneficiary_account", "Merchant account number", "merchant_account_number", "VARCHAR(30)", "Mask middle digits (show last 4)", "NOT NULL"],
        ["execution_date", "Bank execution date", "disbursement_date", "DATE", "Parse bank date format", "Valid date"],
        ["execution_time", "Bank execution time", "disbursement_time", "TIME", "Parse HH:MM:SS", "Valid time"],
        ["response_code", "Bank response code", "bank_response_code", "VARCHAR(10)", "Direct pass-through", "NOT NULL"],
        ["error_message", "Error description if failed", "bank_error_message", "VARCHAR(500)", "TRIM, store original", "If status is FAILED"],
      ],
      [1500, 1400, 1500, 1000, 1600, 1906]
    ),

    heading1("6. Repayment Schedule Mapping"),
    bodyText("Source: Loan Management Service (generated) -> Target: Credit Lifecycle Platform (shared data)"),
    emptyLine(),
    createDataTable(
      ["Generated Field", "Description", "Stored Field", "Data Type", "Calculation Logic", "Notes"],
      [
        ["loan_account_id", "Loan account identifier", "loan_account_id", "VARCHAR(50)", "Auto-generate format LOAN-YYYYMMDD-XXXXX", "Unique per loan"],
        ["installment_no", "Sequence number", "installment_number", "INTEGER", "Sequential: 1 to N", "N = installment count"],
        ["due_date", "Payment due date", "payment_due_date", "DATE", "Disbursement date + (installment_no * 30 days)", "Monthly from disbursement"],
        ["principal_amount", "Principal portion", "principal_due", "DECIMAL(12,2)", "Total principal / N (equal installments)", "Rounded to 2 decimals"],
        ["interest_amount", "Interest portion", "interest_due", "DECIMAL(12,2)", "Declining balance * monthly rate", "Recalculated each period"],
        ["total_due", "Total payment due", "total_amount_due", "DECIMAL(12,2)", "principal_due + interest_due", "Sum of components"],
        ["outstanding_balance", "Remaining after this payment", "remaining_balance", "DECIMAL(12,2)", "Previous balance - principal_due", "0 for last installment"],
        ["grace_period_end", "Grace period expiry", "grace_period_end_date", "DATE", "due_date + 5 calendar days", "5-day grace period"],
        ["late_fee_rate", "Daily late fee rate", "late_fee_daily_rate", "DECIMAL(5,4)", "0.0050 (0.5% per day)", "Configurable"],
        ["installment_status", "Current status", "payment_status", "ENUM", "Default: PENDING; updated on payment", "PENDING/PAID/OVERDUE/PARTIAL"],
      ],
      [1400, 1200, 1200, 1000, 2000, 2306]
    ),

    heading1("7. Collection Record Mapping"),
    bodyText("Source: Collection Service (generated) -> Target: Credit Lifecycle Platform (shared data)"),
    emptyLine(),
    createDataTable(
      ["Collection Field", "Description", "Platform Field", "Data Type", "Transformation", "Validation"],
      [
        ["loan_account_id", "Loan account reference", "loan_account_id", "VARCHAR(50)", "Direct pass-through", "Must exist"],
        ["overdue_days", "Days past due date", "days_overdue", "INTEGER", "Current date - due date (if > 0)", ">= 0"],
        ["overdue_amount", "Total overdue amount", "overdue_amount", "DECIMAL(12,2)", "Sum of unpaid installments + late fees", "> 0"],
        ["collection_stage", "Current collection stage", "collection_stage", "ENUM", "Determined by overdue days (GRACE/EARLY/ACTIVE/ESCALATED/PRE_LEGAL/LEGAL)", "Valid enum"],
        ["assigned_agent", "Collection agent ID", "collection_agent_id", "VARCHAR(50)", "Direct pass-through", "Must exist in user registry"],
        ["contact_method", "Method of contact", "last_contact_method", "ENUM", "SMS/PHONE/EMAIL/LETTER/VISIT", "Valid enum"],
        ["contact_date", "Last contact date", "last_contact_date", "DATETIME", "ISO 8601, convert to Baku time", "Not in future"],
        ["contact_result", "Outcome of contact", "last_contact_result", "ENUM", "REACHED/PROMISED/PARTIAL/REFUSED/UNREACHABLE", "Valid enum"],
        ["promised_amount", "Promised payment amount", "promised_payment_amount", "DECIMAL(12,2)", "Direct pass-through", ">= 0, if result is PROMISED"],
        ["promised_date", "Promised payment date", "promised_payment_date", "DATE", "Parse date format", "Valid date, not in past"],
        ["next_action", "Scheduled next action", "next_action", "ENUM", "CALL/SMS/LETTER/VISIT/ESCALATE/LEGAL", "Valid enum"],
        ["next_action_date", "Scheduled action date", "next_action_date", "DATETIME", "ISO 8601, convert to Baku time", "Valid date"],
        ["notes", "Agent notes", "collection_notes", "TEXT", "TRIM, preserve original", "Max 2000 chars"],
      ],
      [1200, 1200, 1200, 900, 2000, 1406]
    ),

    heading1("8. Cross-System Data Flow Summary"),
    bodyText("The following table summarizes the complete data flow across all systems in the credit lifecycle:"),
    emptyLine(),
    createDataTable(
      ["Lifecycle Stage", "Data Producer", "Data Consumer", "Key Data Elements", "Trigger"],
      [
        ["1. Application", "Partner Store / Mobile App", "Application Service", "Applicant data, product info, channel", "Customer submits application"],
        ["2. Scoring", "Scoring Engine", "Application Service", "Scores, decision, reason codes", "Application received"],
        ["3. Bureau Inquiry", "Credit Bureau", "Scoring Engine", "Bureau score, credit history", "Pre-screen passed"],
        ["4. Decision", "Decision Service", "Application Service, Notification", "Final decision, reason", "Scoring completed"],
        ["5. Manual Review", "Credit Analyst", "Decision Service", "Review outcome, notes", "Score 50-79"],
        ["6. Notification", "Notification Service", "Customer (SMS/Email)", "Decision result, next steps", "Decision made"],
        ["7. Disbursement", "Bank API", "Loan Management", "Disbursement status, reference", "Approved + payment confirmed"],
        ["8. Schedule Generation", "Loan Management", "All services (event)", "Installment schedule", "Disbursement completed"],
        ["9. Delivery", "Delivery Service", "Operations, Customer", "Checkpoints, GPS, e-signature", "Disbursement completed"],
        ["10. Payment Collection", "Bank / Payment Gateway", "Loan Management", "Payment confirmation", "Customer makes payment"],
        ["11. Overdue Detection", "Loan Management", "Collection Service", "Overdue installments, amounts", "Payment due date passed"],
        ["12. Collection", "Collection Service", "Customer, Notification", "Contact records, promises", "Overdue detected"],
        ["13. Reporting", "Analytics Engine", "Management Dashboard", "KPIs, trends, summaries", "Continuous / On-demand"],
      ],
      [1400, 1600, 1800, 2200, 1906]
    ),
  ];

  addSection(doc, children);
  await writeDoc(doc, filePath);
}

// ============================================================
// MAIN EXECUTION
// ============================================================
async function main() {
  console.log("=".repeat(70));
  console.log("  Embafinans BA Practice Artifacts - DOCX Generator");
  console.log("  Generating 10 professional documents...");
  console.log("=".repeat(70));

  const generators = [
    { fn: generateBRD_Credit_Scoring, name: "BRD Credit Scoring" },
    { fn: generateFRD_Credit_Scoring, name: "FRD Credit Scoring" },
    { fn: generateGap_Analysis_Credit_Scoring, name: "Gap Analysis Credit Scoring" },
    { fn: generateData_Mapping_Scoring, name: "Data Mapping Scoring" },
    { fn: generateFRD_B2C_Sales_Channel, name: "FRD B2C Sales Channel" },
    { fn: generateData_Mapping_Payment, name: "Data Mapping Payment" },
    { fn: generateFRD_Delivery_Dashboard, name: "FRD Delivery Dashboard" },
    { fn: generateSRS_Credit_Lifecycle, name: "SRS Credit Lifecycle" },
    { fn: generateGap_Analysis_Lifecycle, name: "Gap Analysis Lifecycle" },
    { fn: generateData_Mapping_Lifecycle, name: "Data Mapping Lifecycle" },
  ];

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < generators.length; i++) {
    const { fn, name } = generators[i];
    const num = String(i + 1).padStart(2, "0");
    console.log(`\n[${num}/10] Generating: ${name}...`);
    try {
      await fn();
      successCount++;
    } catch (err) {
      console.error(`  [FAIL] ${name}: ${err.message}`);
      failCount++;
    }
  }

  console.log("\n" + "=".repeat(70));
  console.log(`  Generation Complete: ${successCount} succeeded, ${failCount} failed`);
  console.log("=".repeat(70));
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
