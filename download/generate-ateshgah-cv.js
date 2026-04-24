const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, ShadingType, WidthType, TabStopType,
  TabStopPosition, ExternalHyperlink, VerticalAlign,
} = require("docx");
const fs = require("fs");

// ── Minimalist palette (warm neutral, no sidebar) ──
const C = {
  name: "1A1A1A",
  accent: "2A6496",     // professional blue accent
  title: "1A1A1A",
  body: "333333",
  sec: "777777",
  light: "F5F5F5",
  line: "CCCCCC",
  skillBg: "F0F4F8",
};

const FONT = { ascii: "Calibri", eastAsia: "Microsoft YaHei" };
const noBorders = {
  top: { style: BorderStyle.NONE, size: 0 },
  bottom: { style: BorderStyle.NONE, size: 0 },
  left: { style: BorderStyle.NONE, size: 0 },
  right: { style: BorderStyle.NONE, size: 0 },
};
const allNoBorders = { ...noBorders, insideHorizontal: noBorders.top, insideVertical: noBorders.top };

// ── Helper: section heading with left accent line ──
function sectionHeading(text) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [8805],
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        height: { value: 350, rule: "exact" },
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.SINGLE, size: 6, color: C.accent },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            verticalAlign: VerticalAlign.BOTTOM,
            children: [
              new Paragraph({
                spacing: { before: 80, after: 40 },
                children: [
                  new TextRun({
                    text: text.toUpperCase(),
                    font: FONT,
                    size: 20,
                    bold: true,
                    color: C.accent,
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

// ── Helper: bullet point ──
function bullet(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 30, after: 30, line: 276 },
    indent: { left: 180, hanging: 180 },
    children: [
      new TextRun({
        text: "\u2022",
        font: FONT,
        size: 19,
        color: C.accent,
      }),
      new TextRun({
        text: "  " + text,
        font: FONT,
        size: 19,
        color: opts.color || C.body,
      }),
    ],
  });
}

// ── Helper: experience header ──
function experienceHeader(title, company, dateRange) {
  return new Paragraph({
    spacing: { before: 140, after: 20, line: 276 },
    tabStops: [{ type: TabStopType.RIGHT, position: 8805 }],
    children: [
      new TextRun({
        text: title,
        font: FONT,
        size: 21,
        bold: true,
        color: C.title,
      }),
      new TextRun({
        text: "  |  ",
        font: FONT,
        size: 19,
        color: C.sec,
      }),
      new TextRun({
        text: company,
        font: FONT,
        size: 19,
        color: C.body,
        italics: true,
      }),
      new TextRun({
        text: "\t",
        font: FONT,
      }),
      new TextRun({
        text: dateRange,
        font: FONT,
        size: 17,
        color: C.sec,
      }),
    ],
  });
}

// ── Helper: skill row ──
function skillRow(category, skills) {
  return new Paragraph({
    spacing: { before: 40, after: 40, line: 276 },
    children: [
      new TextRun({
        text: category,
        font: FONT,
        size: 19,
        bold: true,
        color: C.title,
      }),
      new TextRun({
        text: "   ",
        font: FONT,
        size: 19,
      }),
      new TextRun({
        text: skills,
        font: FONT,
        size: 19,
        color: C.body,
      }),
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
        font: FONT,
        size: 36,
        bold: true,
        color: C.name,
        characterSpacing: 120,
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
        text: "Business Analyst / No-Code Developer",
        font: FONT,
        size: 22,
        color: C.accent,
      }),
    ],
  })
);

// ── CONTACT LINE ──
children.push(
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [8805],
    borders: allNoBorders,
    rows: [
      new TableRow({
        height: { value: 280, rule: "atLeast" },
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              ...allNoBorders,
              bottom: { style: BorderStyle.SINGLE, size: 2, color: C.line },
            },
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                spacing: { before: 40, after: 40 },
                children: [
                  new TextRun({ text: "Baku, Azerbaijan", font: FONT, size: 17, color: C.sec }),
                  new TextRun({ text: "   |   ", font: FONT, size: 17, color: C.line }),
                  new TextRun({ text: "+994 XX XXX XX XX", font: FONT, size: 17, color: C.sec }),
                  new TextRun({ text: "   |   ", font: FONT, size: 17, color: C.line }),
                  new TextRun({ text: "email@example.com", font: FONT, size: 17, color: C.sec }),
                  new TextRun({ text: "   |   ", font: FONT, size: 17, color: C.line }),
                  new TextRun({
                    text: "github.com/ZamirJamalov/ba-practice",
                    font: FONT,
                    size: 17,
                    color: C.accent,
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

children.push(spacer(160));

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
        text: "Business Analyst with 3+ years of experience in requirements engineering, process modeling (BPMN 2.0), and UAT coordination across fintech and e-commerce sectors, backed by a 15-year career in software development (C#/.NET, PostgreSQL). This dual perspective enables rapid translation of business needs into actionable specifications and accelerates adoption of no-code/low-code platforms. Proven ability to bridge the gap between technical teams and business stakeholders through structured documentation, data-driven analysis, and cross-functional collaboration.",
        font: FONT,
        size: 19,
        color: C.body,
      }),
    ],
  })
);

children.push(spacer(120));

// ══════════════════════════════════════
// CORE SKILLS
// ══════════════════════════════════════
children.push(sectionHeading("Core Skills"));
children.push(spacer(60));

children.push(skillRow("Business Analysis", "BPMN 2.0  |  FRD / BRD  |  User Stories (Gherkin)  |  Gap Analysis  |  UAT  |  Stakeholder Discovery"));
children.push(skillRow("Technical Foundation", "REST API  |  OpenAPI 3.0 / Swagger  |  PostgreSQL  |  MS SQL Server  |  C# / .NET  |  OOP & Design Patterns"));
children.push(skillRow("No-Code Readiness", "Process Automation Mindset  |  Dashboard & Reporting Design  |  Rapid Platform Adaptation"));
children.push(skillRow("Tools", "Jira  |  Confluence  |  Postman  |  pgAdmin  |  draw.io / Visio  |  SSMS  |  Git"));

children.push(spacer(120));

// ══════════════════════════════════════
// WORK EXPERIENCE
// ══════════════════════════════════════
children.push(sectionHeading("Work Experience"));
children.push(spacer(60));

// BA Experience - Embafinans (current)
children.push(experienceHeader("Business Analyst", "Embafinans, Baku", "2023 \u2013 Present"));

children.push(bullet(
  "Conducted SME discovery sessions across 5+ departments to map As-Is/To-Be business processes in BPMN 2.0, identifying automation opportunities that reduced manual processing time by an estimated 30%"
));
children.push(bullet(
  "Authored Functional Requirements Documents (FRD) in REQ-101 format with 10+ requirements per project, covering business rules, data models, and acceptance criteria aligned with stakeholder priorities"
));
children.push(bullet(
  "Designed REST API specifications in OpenAPI 3.0 covering 8+ endpoints spanning partner onboarding, application management, and payment processing workflows"
));
children.push(bullet(
  "Built UAT test plans with 14+ test cases including edge scenarios, managed bug triage using severity/priority matrices, and coordinated sign-off with business stakeholders"
));
children.push(bullet(
  "Created SQL analytics queries (JOIN, GROUP BY, Subqueries) for process analysis, delivering data-driven recommendations that informed strategic decisions by leadership"
));

// BA Experience - Umico (previous)
children.push(experienceHeader("Business Analyst", "Umico, Baku", "2022 \u2013 2023"));

children.push(bullet(
  "Analyzed e-commerce business workflows and translated requirements into user stories with Gherkin acceptance criteria for the product development team"
));
children.push(bullet(
  "Performed gap analysis between current system capabilities and target business needs, producing prioritized recommendations for platform enhancement"
));
children.push(bullet(
  "Resolved stakeholder conflicts by presenting quantitative cost-benefit analysis, aligning divergent priorities between operations and IT departments"
));

// Developer Experience
children.push(experienceHeader("Senior Software Developer", "Various Companies, Baku", "2007 \u2013 2022"));

children.push(bullet(
  "Designed and developed enterprise applications using C#/.NET, applying OOP principles, SOLID architecture, and design patterns across 10+ projects in fintech and government sectors"
));
children.push(bullet(
  "Developed and maintained PostgreSQL databases including schema design, stored procedures, functions, and query performance tuning for high-volume transactional systems"
));
children.push(bullet(
  "Built and consumed RESTful APIs, integrating third-party systems including payment gateways, state registries, and insurance platforms \u2014 directly relevant to no-code integration workflows"
));
children.push(bullet(
  "Collaborated closely with business analysts, translating functional requirements into technical specifications, mentoring junior developers, and conducting code reviews"
));

children.push(spacer(120));

// ══════════════════════════════════════
// EDUCATION
// ══════════════════════════════════════
children.push(sectionHeading("Education"));
children.push(spacer(60));

children.push(
  new Paragraph({
    spacing: { before: 20, after: 20, line: 276 },
    tabStops: [{ type: TabStopType.RIGHT, position: 8805 }],
    children: [
      new TextRun({
        text: "Bachelor of Science in Computer Science",
        font: FONT,
        size: 20,
        bold: true,
        color: C.title,
      }),
      new TextRun({
        text: "\t",
        font: FONT,
      }),
      new TextRun({
        text: "【University Name】, Baku",
        font: FONT,
        size: 18,
        color: C.sec,
      }),
    ],
  })
);

children.push(spacer(120));

// ══════════════════════════════════════
// LANGUAGES
// ══════════════════════════════════════
children.push(sectionHeading("Languages"));
children.push(spacer(60));

children.push(
  new Paragraph({
    spacing: { before: 20, after: 20, line: 276 },
    children: [
      new TextRun({ text: "Azerbaijani", font: FONT, size: 19, bold: true, color: C.title }),
      new TextRun({ text: " (Native)    ", font: FONT, size: 19, color: C.sec }),
      new TextRun({ text: "English", font: FONT, size: 19, bold: true, color: C.title }),
      new TextRun({ text: " (Fluent)    ", font: FONT, size: 19, color: C.sec }),
      new TextRun({ text: "Russian", font: FONT, size: 19, bold: true, color: C.title }),
      new TextRun({ text: " (Intermediate)", font: FONT, size: 19, color: C.sec }),
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
        run: {
          font: FONT,
          size: 19,
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
          size: { width: 11906, height: 16838 },
          margin: { top: 700, bottom: 600, left: 1200, right: 1200 },
        },
      },
      children: children,
    },
  ],
});

// ── Generate ──
const OUTPUT = "/home/z/my-project/download/Zamir_Camalov_BA_NoCode_CV_EN.docx";

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(OUTPUT, buffer);
  console.log("CV generated: " + OUTPUT);
});
