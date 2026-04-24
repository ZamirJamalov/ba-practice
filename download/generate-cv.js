const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, ShadingType, WidthType, TabStopType,
  VerticalAlign,
} = require("docx");
const fs = require("fs");

const C = {
  name: "1A1A1A", accent: "2A6496", title: "1A1A1A", body: "333333",
  sec: "777777", line: "CCCCCC",
};

const FONT = { ascii: "Calibri", eastAsia: "Microsoft YaHei" };
const NB = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const allNoBorders = { top: NB, bottom: NB, left: NB, right: NB, insideHorizontal: NB, insideVertical: NB };

function sectionHeading(text) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE }, columnWidths: [9906],
    borders: allNoBorders,
    rows: [new TableRow({
      height: { value: 320, rule: "exact" },
      children: [new TableCell({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: { top: NB, bottom: { style: BorderStyle.SINGLE, size: 6, color: C.accent }, left: NB, right: NB },
        verticalAlign: VerticalAlign.BOTTOM,
        children: [new Paragraph({
          spacing: { before: 60, after: 30 },
          children: [new TextRun({ text: text.toUpperCase(), font: FONT, size: 19, bold: true, color: C.accent, characterSpacing: 80 })],
        })],
      })],
    })],
  });
}

function bullet(text) {
  return new Paragraph({
    spacing: { before: 16, after: 16, line: 260 },
    indent: { left: 160, hanging: 160 },
    children: [
      new TextRun({ text: "\u2022", font: FONT, size: 17, color: C.accent }),
      new TextRun({ text: "  " + text, font: FONT, size: 17, color: C.body }),
    ],
  });
}

function subHeading(text) {
  return new Paragraph({
    spacing: { before: 100, after: 20, line: 260 },
    children: [
      new TextRun({ text: text, font: FONT, size: 18, bold: true, italics: true, color: C.title, characterSpacing: 40 }),
    ],
  });
}

function projectBullet(name, keywords) {
  return new Paragraph({
    spacing: { before: 10, after: 10, line: 250 },
    indent: { left: 200, hanging: 200 },
    children: [
      new TextRun({ text: "\u2022", font: FONT, size: 17, color: C.accent }),
      new TextRun({ text: "  " + name + "  ", font: FONT, size: 17, bold: true, color: C.title }),
      new TextRun({ text: keywords, font: FONT, size: 16, color: C.sec }),
    ],
  });
}

function experienceHeader(title, company, dateRange) {
  return new Paragraph({
    spacing: { before: 120, after: 16, line: 260 },
    tabStops: [{ type: TabStopType.RIGHT, position: 9906 }],
    children: [
      new TextRun({ text: company, font: FONT, size: 20, bold: true, color: C.title }),
      new TextRun({ text: "  |  ", font: FONT, size: 18, color: C.sec }),
      new TextRun({ text: title, font: FONT, size: 18, color: C.body, italics: true }),
      new TextRun({ text: "\t", font: FONT }),
      new TextRun({ text: dateRange, font: FONT, size: 16, color: C.sec }),
    ],
  });
}

function skillRow(category, skills) {
  return new Paragraph({
    spacing: { before: 30, after: 30, line: 260 },
    children: [
      new TextRun({ text: category, font: FONT, size: 18, bold: true, color: C.title }),
      new TextRun({ text: "   ", font: FONT, size: 18 }),
      new TextRun({ text: skills, font: FONT, size: 18, color: C.body }),
    ],
  });
}

function spacer(twips = 60) {
  return new Paragraph({ spacing: { before: twips, after: 0 }, children: [] });
}

// ══════════════════════════════════════
const children = [];

// ── NAME ──
children.push(new Paragraph({
  alignment: AlignmentType.LEFT, spacing: { before: 160, after: 30, line: 276 },
  children: [new TextRun({ text: "ZAMIR JAMALOV", font: FONT, size: 34, bold: true, color: C.name, characterSpacing: 120 })],
}));

// ── TARGET POSITION ──
children.push(new Paragraph({
  spacing: { before: 0, after: 50, line: 276 },
  children: [new TextRun({ text: "IT Business Analyst  |  E-Commerce & Fintech", font: FONT, size: 21, color: C.accent })],
}));

// ── CONTACT LINE ──
children.push(new Table({
  width: { size: 100, type: WidthType.PERCENTAGE }, columnWidths: [9906], borders: allNoBorders,
  rows: [new TableRow({
    height: { value: 260, rule: "atLeast" },
    children: [new TableCell({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: { ...allNoBorders, bottom: { style: BorderStyle.SINGLE, size: 2, color: C.line } },
      verticalAlign: VerticalAlign.CENTER,
      children: [new Paragraph({
        spacing: { before: 30, after: 30 },
        children: [
          new TextRun({ text: "+994 55 207 7228", font: FONT, size: 16, color: C.sec }),
          new TextRun({ text: "   |   ", font: FONT, size: 16, color: C.line }),
          new TextRun({ text: "jamalov.zamir@gmail.com", font: FONT, size: 16, color: C.sec }),
          new TextRun({ text: "   |   ", font: FONT, size: 16, color: C.line }),
          new TextRun({ text: "Baku, Azerbaijan", font: FONT, size: 16, color: C.sec }),
        ],
      })],
    })],
  })],
}));

children.push(spacer(50));

// ══════════════════════════════════════
// PROFILE SUMMARY
// ══════════════════════════════════════
children.push(sectionHeading("Profile Summary"));
children.push(spacer(30));

children.push(new Paragraph({
  spacing: { before: 16, after: 16, line: 260 },
  alignment: AlignmentType.JUSTIFIED,
  children: [new TextRun({
    text: "Business Analyst with 4 years across e-commerce and fintech, specializing in process digitization, requirements documentation, and end-to-end delivery coordination. Uniquely combines BA methodology with a software engineering background \u2014 enabling precise translation of business needs into technical specifications and seamless collaboration with development teams. Delivered production systems spanning credit scoring, B2C sales channels, operational dashboards, and end-to-end credit lifecycle management.",
    font: FONT, size: 18, color: C.body,
  })],
}));

children.push(spacer(50));

// ══════════════════════════════════════
// CORE SKILLS
// ══════════════════════════════════════
children.push(sectionHeading("Core Skills"));
children.push(spacer(30));

children.push(skillRow("Business Analysis", "BRD / FRD / SRS  |  User Stories & Acceptance Criteria (Gherkin)  |  BPMN (As-Is / To-Be) | UML | Sequence Diagrams  |  Gap Analysis  |  Stakeholder Interviews  |  Backlog Prioritization (RICE)"));
children.push(skillRow("Technical", "REST API & JSON  |  Swagger / OpenAPI 3.0  |  Postman (API Testing)  |  SQL (JOIN, GROUP BY, Subqueries)  |  SDLC"));
children.push(skillRow("Process & Tools", "Agile / Scrum  |  Jira  |  Confluence  |  UAT Planning & Coordination  |  L2 Production Support (ELK Stack)"));
children.push(skillRow("Languages", "Azerbaijani (Native)  |  Russian (Fluent)  |  English (Professional / Technical Documentation)"));

children.push(spacer(50));

// ══════════════════════════════════════
// PROFESSIONAL EXPERIENCE
// ══════════════════════════════════════
children.push(sectionHeading("Professional Experience"));
children.push(spacer(30));

// Embafinans — Two-Layer Structure: Projects + Methodology
children.push(experienceHeader("IT Business Analyst", "Embafinans", "2025 \u2013 Present"));

// Layer 1: Projects Delivered
children.push(subHeading("Projects Delivered"));
children.push(projectBullet(
  "BNPL Credit Scoring & Pre-Screen Risk Assessment",
  "(2x Faster Credit Decisions, Automated Multi-Factor Assessment)"
));
children.push(projectBullet(
  "B2C Sales Channel & Payment Gateway Integration",
  "(300\u2013500 Daily Applications, Online Payment Processing)"
));
children.push(projectBullet(
  "Goods Loan Delivery Tracking Dashboard",
  "(Real-Time Monitoring, 2x Fewer Errors, Digital E-Signature)"
));
children.push(projectBullet(
  "End-to-End Credit Lifecycle",
  "(Application, Disbursement, Collection, Cross-Functional)"
));

// Layer 2: Delivery Methodology (5-step BA lifecycle)
children.push(subHeading("Delivery Methodology"));
children.push(bullet(
  "Discovery & Process Modeling: Conducted structured stakeholder sessions with risk, sales, and operations teams to map As-Is workflows, identify pain points, and design To-Be BPMN process models and sequence diagrams for system interaction flows"
));
children.push(bullet(
  "Requirements Documentation: Authored detailed BRDs, FRDs, and SRS documents with REQ-101 numbered requirements, wrote User Stories with Gherkin Acceptance Criteria, and maintained traceability across sprints"
));
children.push(bullet(
  "Technical Specification: Defined REST API specifications in Swagger/OpenAPI 3.0, created sequence diagrams for integration flows, and prepared data mapping documents for seamless developer handoff"
));
children.push(bullet(
  "UAT & Delivery Coordination: Coordinated UAT execution with business stakeholders, led bug triage meetings with QA and developers, and achieved on-time sign-off across multiple release cycles"
));
children.push(bullet(
  "Backlog Prioritization: Ranked requirements and user stories using RICE framework to align sprint planning with business value and stakeholder priorities"
));
children.push(bullet(
  "Data-Driven Decision Making: Leveraged SQL data analysis to resolve conflicting stakeholder priorities, presenting evidence-based recommendations to drive consensus"
));

// Birbank — 3 bullets
children.push(experienceHeader("Business Analyst", "Birbank", "2022 \u2013 2025"));

children.push(bullet(
  "Designed and documented the end-to-end seller onboarding process from scratch, conducting stakeholder interviews with operations, logistics, and warehouse teams to capture all edge cases and define measurable Acceptance Criteria"
));
children.push(bullet(
  "Analyzed seller performance and inventory data using SQL queries (complex JOINs, GROUP BY aggregations), identified fulfillment bottlenecks, and presented prioritized improvement recommendations to the product team with supporting data"
));
children.push(bullet(
  "Collaborated with marketing and product teams on CMS-driven content changes and promotional campaigns, ensuring business copy requirements were accurately documented and delivered within sprint cycles without scope creep"
));

children.push(spacer(50));

// ══════════════════════════════════════
// TECHNICAL FOUNDATION
// ══════════════════════════════════════
children.push(sectionHeading("Technical Foundation"));
children.push(spacer(30));

children.push(new Paragraph({
  spacing: { before: 16, after: 16, line: 260 },
  alignment: AlignmentType.JUSTIFIED,
  children: [new TextRun({
    text: "15+ years in software engineering (Central Bank of Azerbaijan, Unibank, ASAN Service) covering backend development (C#, T-SQL), database architecture (Oracle, MSSQL, PostgreSQL), and system integration. Enables precise requirement-to-code translation and rapid root cause analysis during production incidents.",
    font: FONT, size: 18, color: C.body,
  })],
}));

children.push(spacer(50));

// ══════════════════════════════════════
// EDUCATION
// ══════════════════════════════════════
children.push(sectionHeading("Education"));
children.push(spacer(30));

children.push(new Paragraph({
  spacing: { before: 16, after: 16, line: 260 },
  children: [
    new TextRun({ text: "Baku State University", font: FONT, size: 19, bold: true, color: C.title }),
    new TextRun({ text: "  \u2014  ", font: FONT, size: 18, color: C.sec }),
    new TextRun({ text: "Bachelor of Science in Applied Mathematics", font: FONT, size: 18, color: C.body }),
  ],
}));

// ══════════════════════════════════════
const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: FONT, size: 18, color: C.body },
        paragraph: { spacing: { line: 260 } },
      },
    },
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 550, bottom: 450, left: 950, right: 950 },
      },
    },
    children: children,
  }],
});

const OUTPUT = "/home/z/my-project/download/Zamir_Camalov_BA_CV_EN.docx";
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(OUTPUT, buffer);
  console.log("CV generated: " + OUTPUT);
});
