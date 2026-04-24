const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, ShadingType, WidthType, VerticalAlign,
  TabStopType, TabStopPosition
} = require("docx");
const fs = require("fs");

// ─── Minimalist Color Palette ───
const C = {
  dark: "1A1A1A",
  accent: "3B5998",
  body: "333333",
  sec: "777777",
  line: "D0D0D0",
  light: "F5F5F5",
};

const NB = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: NB, bottom: NB, left: NB, right: NB };
const allNoBorders = { top: NB, bottom: NB, left: NB, right: NB, insideHorizontal: NB, insideVertical: NB };

// ─── Helpers ───
function bodyRun(text, opts = {}) {
  return new TextRun({
    text,
    font: "Calibri",
    color: opts.color || C.body,
    size: opts.size || 20,
    bold: opts.bold || false,
    italics: opts.italics || false,
  });
}

function bullet(text) {
  return new Paragraph({
    spacing: { before: 40, after: 40, line: 260 },
    indent: { left: 260, hanging: 200 },
    children: [
      bodyRun("\u2022  ", { size: 18, color: C.accent }),
      bodyRun(text, { size: 19 }),
    ],
  });
}

function sectionHeading(text) {
  return new Paragraph({
    spacing: { before: 260, after: 80 },
    borders: { bottom: { style: BorderStyle.SINGLE, size: 6, color: C.accent, space: 4 } },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        font: "Calibri",
        size: 21,
        bold: true,
        color: C.accent,
        characterSpacing: 40,
      }),
    ],
  });
}

function subHeading(company, title, date) {
  return new Paragraph({
    spacing: { before: 140, after: 30 },
    tabStops: [{ type: TabStopType.RIGHT, position: 10000 }],
    children: [
      bodyRun(company, { size: 21, bold: true, color: C.dark }),
      bodyRun("  |  ", { size: 18, color: C.sec }),
      bodyRun(title, { size: 19, color: C.accent, italics: true }),
      new TextRun({ text: "\t" + date, font: "Calibri", size: 18, color: C.sec }),
    ],
  });
}

function skillLine(category, items) {
  return new Paragraph({
    spacing: { before: 50, after: 50, line: 270 },
    children: [
      bodyRun(category + ": ", { size: 19, bold: true, color: C.dark }),
      bodyRun(items, { size: 19 }),
    ],
  });
}

// ─── Build Document ───
const doc = new Document({
  styles: {
    default: {
      document: {
        run: {
          font: "Calibri",
          size: 20,
          color: C.body,
        },
        paragraph: {
          spacing: { line: 276 },
        },
      },
    },
  },
  sections: [
    {
      properties: {
        page: {
          margin: { top: 700, bottom: 600, left: 900, right: 900 },
          size: { width: 11906, height: 16838 },
        },
      },
      children: [
        // ─── NAME ───
        new Paragraph({
          spacing: { after: 20 },
          children: [
            new TextRun({ text: "ZAMIR CAMALOV", font: "Calibri", size: 36, bold: true, color: C.dark }),
          ],
        }),
        // ─── TITLE ───
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({ text: "IT Business Analyst  |  E-Commerce & Fintech", font: "Calibri", size: 22, color: C.accent }),
          ],
        }),
        // ─── CONTACT ───
        new Paragraph({
          spacing: { after: 60 },
          children: [
            bodyRun("+994 55 207 7228", { size: 18, color: C.sec }),
            bodyRun("   |   ", { size: 18, color: C.line }),
            bodyRun("jamalov.zamir@gmail.com", { size: 18, color: C.sec }),
            bodyRun("   |   ", { size: 18, color: C.line }),
            bodyRun("Baku, Azerbaijan", { size: 18, color: C.sec }),
          ],
        }),

        // ─── PROFILE SUMMARY ───
        sectionHeading("Profile Summary"),
        new Paragraph({
          spacing: { before: 80, after: 60, line: 280 },
          children: [
            bodyRun(
              "IT Business Analyst with 3+ years of focused experience in E-Commerce (Marketplace) and Fintech (B2B integrations). Proven ability to discover business needs through stakeholder interviews, translate them into precise BRD/FRD specifications with User Stories and Acceptance Criteria, and coordinate end-to-end delivery from requirements gathering through UAT sign-off. Skilled in BPMN process modeling (As-Is / To-Be), REST API documentation (Swagger), and data-driven decision making via SQL analytics. Background in software engineering enables fluent communication with development teams and accurate technical translation of business requirements.",
              { size: 19 }
            ),
          ],
        }),

        // ─── CORE SKILLS ───
        sectionHeading("Core Skills"),
        skillLine("Business Analysis", "BRD / FRD / SRS, User Stories & Acceptance Criteria (Gherkin), BPMN (As-Is / To-Be), Gap Analysis, Stakeholder Interviews, Backlog Prioritization (WSJF / RICE)"),
        skillLine("Technical", "REST API & JSON, Swagger / OpenAPI 3.0, Postman (API Testing), SQL (JOIN, GROUP BY, Subqueries), SDLC"),
        skillLine("Process & Tools", "Agile / Scrum, Jira, Confluence, UAT Planning & Coordination, L2 Production Support (ELK Stack)"),
        skillLine("Languages", "Azerbaijani (Native), Russian (Fluent), English (Professional / Technical Documentation)"),

        // ─── WORK EXPERIENCE ───
        sectionHeading("Professional Experience"),

        // --- Embafinans ---
        subHeading("Embafinans", "IT Business Analyst", "2025 \u2013 Present"),
        bullet("Conducted structured discovery sessions with credit risk experts and finance teams to map the As-Is BNPL credit scoring workflow, identified 3 bottleneck stages, and designed To-Be BPMN process models with exclusive gateways \u2014 reducing credit decision time by 50%."),
        bullet("Authored detailed FRDs with numbered requirements (REQ-101 format) and designed REST API specifications with Swagger/OpenAPI 3.0 documentation for 8+ endpoints covering partner onboarding, application management, and payment processing \u2014 ensuring zero-ambiguity handoff to the development team."),
        bullet("Wrote User Stories with Given/When/Then Acceptance Criteria in Jira/Confluence, coordinated UAT execution with business stakeholders, and led bug triage meetings with QA and developers \u2014 achieving on-time sign-off for 3 release cycles."),
        bullet("Resolved conflicting priorities between Risk and Sales departments by presenting SQL-based data analysis (conversion funnel metrics) to both stakeholders, facilitating agreement on a unified partner onboarding workflow."),
        bullet("Managed PayTabs and payment provider integrations by creating REST API specifications, building Postman test collections for end-to-end validation, and coordinating cross-team testing with QA and vendor technical leads."),

        // --- BirMarket ---
        subHeading("BirMarket (Umico)", "Business Analyst", "2022 \u2013 2025"),
        bullet("Designed and documented the end-to-end seller onboarding process from scratch, conducting stakeholder interviews with operations, logistics, and warehouse teams to capture all edge cases and define measurable Acceptance Criteria."),
        bullet("Analyzed seller performance and inventory data using SQL queries (complex JOINs, GROUP BY aggregations), identified fulfillment bottlenecks, and presented prioritized improvement recommendations to the product team with supporting data."),
        bullet("Collaborated with marketing and product teams on CMS-driven content changes and promotional campaigns, ensuring business copy requirements were accurately documented and delivered within sprint cycles without scope creep."),
        bullet("Provided L2 production support during critical marketplace incidents by analyzing ELK Stack system logs, identifying root causes at the code level, and coordinating rapid resolution with the development team."),

        // ─── TECHNICAL FOUNDATION ───
        sectionHeading("Technical Foundation"),
        new Paragraph({
          spacing: { before: 60, after: 60, line: 280 },
          children: [
            bodyRun("15+ years in software engineering (Central Bank of Azerbaijan, Unibank, ASAN Service) covering backend development (C#, T-SQL), database architecture (Oracle, MSSQL, PostgreSQL), and system integration. This technical background enables precise requirement-to-code translation, efficient developer communication, and rapid root cause analysis during production incidents.", { size: 19 }),
          ],
        }),

        // ─── EDUCATION ───
        sectionHeading("Education"),
        new Paragraph({
          spacing: { before: 60, after: 40 },
          children: [
            bodyRun("Baku State University", { size: 20, bold: true, color: C.dark }),
            bodyRun("  \u2014  Bachelor of Science in Applied Mathematics", { size: 19 }),
          ],
        }),
      ],
    },
  ],
});

// ─── Generate ───
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("/home/z/my-project/download/Zamir_Camalov_BA_CV_EN.docx", buffer);
  console.log("Minimalist CV generated successfully!");
});
