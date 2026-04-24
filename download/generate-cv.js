const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, ShadingType, WidthType, TabStopType,
  VerticalAlign,
} = require("docx");
const fs = require("fs");

// ── Minimalist palette ──
const C = {
  name: "1A1A1A",
  accent: "2A6496",
  title: "1A1A1A",
  body: "333333",
  sec: "777777",
  line: "CCCCCC",
};

const FONT = { ascii: "Calibri", eastAsia: "Microsoft YaHei" };
const NB = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: NB, bottom: NB, left: NB, right: NB };
const allNoBorders = { ...noBorders, insideHorizontal: NB, insideVertical: NB };

// ── Section heading with accent underline ──
function sectionHeading(text) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [9506],
    borders: allNoBorders,
    rows: [
      new TableRow({
        height: { value: 350, rule: "exact" },
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: NB, bottom: { style: BorderStyle.SINGLE, size: 6, color: C.accent },
              left: NB, right: NB,
            },
            verticalAlign: VerticalAlign.BOTTOM,
            children: [
              new Paragraph({
                spacing: { before: 80, after: 40 },
                children: [
                  new TextRun({
                    text: text.toUpperCase(),
                    font: FONT, size: 20, bold: true, color: C.accent,
                    characterSpacing: 80,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

// ── Bullet point ──
function bullet(text) {
  return new Paragraph({
    spacing: { before: 30, after: 30, line: 276 },
    indent: { left: 180, hanging: 180 },
    children: [
      new TextRun({ text: "\u2022", font: FONT, size: 19, color: C.accent }),
      new TextRun({ text: "  " + text, font: FONT, size: 19, color: C.body }),
    ],
  });
}

// ── Experience header ──
function experienceHeader(title, company, dateRange) {
  return new Paragraph({
    spacing: { before: 140, after: 20, line: 276 },
    tabStops: [{ type: TabStopType.RIGHT, position: 9506 }],
    children: [
      new TextRun({ text: company, font: FONT, size: 21, bold: true, color: C.title }),
      new TextRun({ text: "  |  ", font: FONT, size: 19, color: C.sec }),
      new TextRun({ text: title, font: FONT, size: 19, color: C.body, italics: true }),
      new TextRun({ text: "\t", font: FONT }),
      new TextRun({ text: dateRange, font: FONT, size: 17, color: C.sec }),
    ],
  });
}

// ── Skill row ──
function skillRow(category, skills) {
  return new Paragraph({
    spacing: { before: 40, after: 40, line: 276 },
    children: [
      new TextRun({ text: category, font: FONT, size: 19, bold: true, color: C.title }),
      new TextRun({ text: "   ", font: FONT, size: 19 }),
      new TextRun({ text: skills, font: FONT, size: 19, color: C.body }),
    ],
  });
}

// ── Spacer ──
function spacer(twips = 80) {
  return new Paragraph({ spacing: { before: twips, after: 0 }, children: [] });
}

// ══════════════════════════════════════
// BUILD DOCUMENT
// ══════════════════════════════════════
const children = [];

// ── NAME ──
children.push(
  new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { before: 200, after: 40, line: 276 },
    children: [
      new TextRun({
        text: "ZAMIR CAMALOV",
        font: FONT, size: 36, bold: true, color: C.name, characterSpacing: 120,
      }),
    ],
  })
);

// ── TARGET POSITION ──
children.push(
  new Paragraph({
    spacing: { before: 0, after: 60, line: 276 },
    children: [
      new TextRun({
        text: "IT Business Analyst  |  E-Commerce & Fintech",
        font: FONT, size: 22, color: C.accent,
      }),
    ],
  })
);

// ── CONTACT LINE ──
children.push(
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [9506],
    borders: allNoBorders,
    rows: [
      new TableRow({
        height: { value: 280, rule: "atLeast" },
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: { ...allNoBorders, bottom: { style: BorderStyle.SINGLE, size: 2, color: C.line } },
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                spacing: { before: 40, after: 40 },
                children: [
                  new TextRun({ text: "+994 55 207 7228", font: FONT, size: 17, color: C.sec }),
                  new TextRun({ text: "   |   ", font: FONT, size: 17, color: C.line }),
                  new TextRun({ text: "jamalov.zamir@gmail.com", font: FONT, size: 17, color: C.sec }),
                  new TextRun({ text: "   |   ", font: FONT, size: 17, color: C.line }),
                  new TextRun({ text: "Baku, Azerbaijan", font: FONT, size: 17, color: C.sec }),
                  new TextRun({ text: "   |   ", font: FONT, size: 17, color: C.line }),
                  new TextRun({
                    text: "github.com/ZamirJamalov/ba-practice",
                    font: FONT, size: 17, color: C.accent,
                    underline: { type: "single", color: C.accent },
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  })
);

children.push(spacer(100));

// ══════════════════════════════════════
// PROFILE SUMMARY
// ══════════════════════════════════════
children.push(sectionHeading("Profile Summary"));
children.push(spacer(60));

children.push(
  new Paragraph({
    spacing: { before: 20, after: 20, line: 276 },
    alignment: AlignmentType.JUSTIFIED,
    children: [
      new TextRun({
        text: "IT Business Analyst with 3+ years of focused experience in E-Commerce (Marketplace) and Fintech (B2B integrations). Proven ability to discover business needs through stakeholder interviews, translate them into precise BRD/FRD specifications with User Stories and Acceptance Criteria, and coordinate end-to-end delivery from requirements gathering through UAT sign-off. Skilled in BPMN process modeling (As-Is / To-Be), REST API documentation (Swagger), and data-driven decision making via SQL analytics. Background in software engineering enables fluent communication with development teams and accurate technical translation of business requirements.",
        font: FONT, size: 19, color: C.body,
      }),
    ],
  })
);

children.push(spacer(100));

// ══════════════════════════════════════
// CORE SKILLS
// ══════════════════════════════════════
children.push(sectionHeading("Core Skills"));
children.push(spacer(60));

children.push(skillRow("Business Analysis", "BRD / FRD / SRS  |  User Stories & Acceptance Criteria (Gherkin)  |  BPMN (As-Is / To-Be)  |  Gap Analysis  |  Stakeholder Interviews  |  Backlog Prioritization (WSJF / RICE)"));
children.push(skillRow("Technical", "REST API & JSON  |  Swagger / OpenAPI 3.0  |  Postman (API Testing)  |  SQL (JOIN, GROUP BY, Subqueries)  |  SDLC"));
children.push(skillRow("Process & Tools", "Agile / Scrum  |  Jira  |  Confluence  |  UAT Planning & Coordination  |  L2 Production Support (ELK Stack)"));
children.push(skillRow("Languages", "Azerbaijani (Native)  |  Russian (Fluent)  |  English (Professional / Technical Documentation)"));

children.push(spacer(100));

// ══════════════════════════════════════
// PROFESSIONAL EXPERIENCE
// ══════════════════════════════════════
children.push(sectionHeading("Professional Experience"));
children.push(spacer(60));

// Embafinans
children.push(experienceHeader("IT Business Analyst", "Embafinans", "2025 \u2013 Present"));

children.push(bullet(
  "Conducted structured discovery sessions with credit risk experts and finance teams to map the As-Is BNPL credit scoring workflow, identified 3 bottleneck stages, and designed To-Be BPMN process models with exclusive gateways \u2014 reducing credit decision time by 50%"
));
children.push(bullet(
  "Authored detailed FRDs with numbered requirements (REQ-101 format) and designed REST API specifications with Swagger/OpenAPI 3.0 documentation for 8+ endpoints covering partner onboarding, application management, and payment processing \u2014 ensuring zero-ambiguity handoff to the development team"
));
children.push(bullet(
  "Wrote User Stories with Given/When/Then Acceptance Criteria in Jira/Confluence, coordinated UAT execution with business stakeholders, and led bug triage meetings with QA and developers \u2014 achieving on-time sign-off for 3 release cycles"
));
children.push(bullet(
  "Resolved conflicting priorities between Risk and Sales departments by presenting SQL-based data analysis (conversion funnel metrics) to both stakeholders, facilitating agreement on a unified partner onboarding workflow"
));
children.push(bullet(
  "Managed PayTabs and payment provider integrations by creating REST API specifications, building Postman test collections for end-to-end validation, and coordinating cross-team testing with QA and vendor technical leads"
));

// BirMarket (Umico)
children.push(experienceHeader("Business Analyst", "BirMarket (Umico)", "2022 \u2013 2025"));

children.push(bullet(
  "Designed and documented the end-to-end seller onboarding process from scratch, conducting stakeholder interviews with operations, logistics, and warehouse teams to capture all edge cases and define measurable Acceptance Criteria"
));
children.push(bullet(
  "Analyzed seller performance and inventory data using SQL queries (complex JOINs, GROUP BY aggregations), identified fulfillment bottlenecks, and presented prioritized improvement recommendations to the product team with supporting data"
));
children.push(bullet(
  "Collaborated with marketing and product teams on CMS-driven content changes and promotional campaigns, ensuring business copy requirements were accurately documented and delivered within sprint cycles without scope creep"
));
children.push(bullet(
  "Provided L2 production support during critical marketplace incidents by analyzing ELK Stack system logs, identifying root causes at the code level, and coordinating rapid resolution with the development team"
));

children.push(spacer(100));

// ══════════════════════════════════════
// TECHNICAL FOUNDATION
// ══════════════════════════════════════
children.push(sectionHeading("Technical Foundation"));
children.push(spacer(60));

children.push(
  new Paragraph({
    spacing: { before: 20, after: 20, line: 276 },
    alignment: AlignmentType.JUSTIFIED,
    children: [
      new TextRun({
        text: "15+ years in software engineering (Central Bank of Azerbaijan, Unibank, ASAN Service) covering backend development (C#, T-SQL), database architecture (Oracle, MSSQL, PostgreSQL), and system integration. This technical background enables precise requirement-to-code translation, efficient developer communication, and rapid root cause analysis during production incidents.",
        font: FONT, size: 19, color: C.body,
      }),
    ],
  })
);

children.push(spacer(100));

// ══════════════════════════════════════
// EDUCATION
// ══════════════════════════════════════
children.push(sectionHeading("Education"));
children.push(spacer(60));

children.push(
  new Paragraph({
    spacing: { before: 20, after: 20, line: 276 },
    children: [
      new TextRun({ text: "Baku State University", font: FONT, size: 20, bold: true, color: C.title }),
      new TextRun({ text: "  \u2014  ", font: FONT, size: 19, color: C.sec }),
      new TextRun({ text: "Bachelor of Science in Applied Mathematics", font: FONT, size: 19, color: C.body }),
    ],
  })
);

// ══════════════════════════════════════
// ASSEMBLE DOCUMENT
// ══════════════════════════════════════
const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: FONT, size: 19, color: C.body },
        paragraph: { spacing: { line: 276 } },
      },
    },
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 700, bottom: 600, left: 1200, right: 1200 },
        },
      },
      children: children,
    },
  ],
});

const OUTPUT = "/home/z/my-project/download/Zamir_Camalov_BA_CV_EN.docx";

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(OUTPUT, buffer);
  console.log("CV generated: " + OUTPUT);
});
