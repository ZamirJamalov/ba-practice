const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, ShadingType, WidthType, TabStopType,
} = require("docx");
const fs = require("fs");

// ── Color Palette: Tech / Internet (Template A) — SAME as Kontakt Home CV ──
const S = {
  bg: "1A1F36",       // sidebar background (deep blue-purple)
  text: "E0E4EC",     // sidebar text
  label: "8B95A8",    // sidebar secondary text
  accent: "667eea",   // accent color (amethyst)
  title: "1A2D38",    // body heading
  body: "2C3E4A",     // body content
  sec: "6B8592",      // secondary info (dates etc.)
};

const NB = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: NB, bottom: NB, left: NB, right: NB };
const allNoBorders = { top: NB, bottom: NB, left: NB, right: NB, insideHorizontal: NB, insideVertical: NB };

// ── Sidebar elements (identical to Kontakt Home design) ──
function photoPlaceholder() {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 120 },
    children: [
      new TextRun({ text: "\u25A1", size: 72, color: S.label, font: "Calibri" }),
    ],
  });
}

function sidebarName(name) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 80, after: 40 },
    children: [
      new TextRun({ text: name, size: 32, bold: true, color: "FFFFFF", font: "Calibri" }),
    ],
  });
}

function sidebarTitle(title) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [
      new TextRun({ text: title, size: 18, color: S.accent, font: "Calibri" }),
    ],
  });
}

function sidebarDivider() {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "3A4565", space: 4 } },
    children: [],
  });
}

function sidebarSectionLabel(label) {
  return new Paragraph({
    spacing: { before: 160, after: 60 },
    children: [
      new TextRun({ text: label.toUpperCase(), size: 15, bold: true, color: S.accent, font: "Calibri", characterSpacing: 60 }),
    ],
  });
}

function sidebarInfoLine(label, value) {
  return new Paragraph({
    spacing: { before: 30, after: 30 },
    children: [
      new TextRun({ text: label + " ", size: 17, color: S.label, font: "Calibri" }),
      new TextRun({ text: value, size: 17, color: S.text, font: "Calibri" }),
    ],
  });
}

function sidebarSkillLine(name, level) {
  const filled = "\u25CF".repeat(level);
  const empty = "\u25CB".repeat(5 - level);
  return new Paragraph({
    spacing: { before: 30, after: 30 },
    children: [
      new TextRun({ text: name + "  ", size: 16, color: S.text, font: "Calibri" }),
      new TextRun({ text: filled, size: 13, color: S.accent, font: "Calibri" }),
      new TextRun({ text: empty, size: 13, color: "3A4565", font: "Calibri" }),
    ],
  });
}

function sidebarLangLine(lang, level) {
  return new Paragraph({
    spacing: { before: 20, after: 20 },
    children: [
      new TextRun({ text: lang + " ", size: 16, color: S.text, font: "Calibri" }),
      new TextRun({ text: "\u2014 ", size: 16, color: S.label, font: "Calibri" }),
      new TextRun({ text: level, size: 16, color: S.label, font: "Calibri" }),
    ],
  });
}

// ── Right-side section heading (color bar) — SAME as Kontakt Home ──
function sectionHeading(cnText, enText) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: allNoBorders,
    rows: [
      new TableRow({
        height: { value: 340, rule: "exact" },
        children: [
          new TableCell({
            shading: { fill: S.accent, type: ShadingType.CLEAR },
            borders: allNoBorders,
            margins: { top: 40, bottom: 40, left: 160, right: 80 },
            verticalAlign: "center",
            children: [
              new Paragraph({
                spacing: { line: 276 },
                children: [
                  new TextRun({ text: cnText, size: 21, bold: true, color: "FFFFFF", font: "Calibri" }),
                  new TextRun({ text: "  " + enText, size: 16, color: "C8D8F0", font: "Calibri", italics: true }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

// ── Experience entry — SAME format as Kontakt Home ──
function experienceEntry(company, role, date, bullets) {
  const children = [
    new Paragraph({
      spacing: { before: 120, after: 30 },
      tabStops: [{ type: TabStopType.RIGHT, position: 7200 }],
      children: [
        new TextRun({ text: company, size: 21, bold: true, color: S.title, font: "Calibri" }),
        new TextRun({ text: "    " + role, size: 18, color: S.accent, font: "Calibri" }),
        new TextRun({ text: "\t" + date, size: 16, color: S.sec, font: "Calibri" }),
      ],
    }),
  ];
  for (const b of bullets) {
    children.push(
      new Paragraph({
        spacing: { before: 20, after: 20, line: 276 },
        children: [
          new TextRun({ text: "\u25B8 ", size: 14, color: S.accent, font: "Calibri" }),
          new TextRun({ text: b, size: 18, color: S.body, font: "Calibri" }),
        ],
      })
    );
  }
  return children;
}

// ── Education entry — SAME as Kontakt Home ──
function educationEntry(school, degree, date) {
  return [
    new Paragraph({
      spacing: { before: 60, after: 20 },
      tabStops: [{ type: TabStopType.RIGHT, position: 7200 }],
      children: [
        new TextRun({ text: school, size: 20, bold: true, color: S.title, font: "Calibri" }),
        new TextRun({ text: "\t" + date, size: 16, color: S.sec, font: "Calibri" }),
      ],
    }),
    new Paragraph({
      spacing: { before: 10, after: 40 },
      children: [
        new TextRun({ text: degree, size: 17, color: S.body, font: "Calibri" }),
      ],
    }),
  ];
}

// ══════════════════════════════════════════════════
// SIDEBAR CONTENT — Zamir Camalov (Ateşgah version)
// ══════════════════════════════════════════════════
const sidebarChildren = [
  photoPlaceholder(),
  sidebarName("Zamir Camalov"),
  sidebarTitle("BA / No-Code Developer"),
  sidebarDivider(),
  sidebarSectionLabel("Contact"),
  sidebarInfoLine("Phone:", "+994 XX XXX XX XX"),
  sidebarInfoLine("Email:", "email@example.com"),
  sidebarInfoLine("GitHub:", "ZamirJamalov/ba-practice"),
  sidebarInfoLine("Location:", "Baku, Azerbaijan"),
  sidebarDivider(),
  sidebarSectionLabel("BA Skills"),
  sidebarSkillLine("BPMN 2.0", 4),
  sidebarSkillLine("FRD / BRD", 5),
  sidebarSkillLine("User Stories / Gherkin", 4),
  sidebarSkillLine("Gap Analysis", 4),
  sidebarSkillLine("UAT / Testing", 4),
  sidebarSkillLine("Stakeholder Discovery", 4),
  sidebarDivider(),
  sidebarSectionLabel("Technical Skills"),
  sidebarSkillLine("REST API / OpenAPI", 4),
  sidebarSkillLine("PostgreSQL", 4),
  sidebarSkillLine("MS SQL Server", 5),
  sidebarSkillLine("C# / .NET", 5),
  sidebarSkillLine("OOP / Design Patterns", 4),
  sidebarSkillLine("Jira / Confluence", 4),
  sidebarSkillLine("Postman / Swagger", 4),
  sidebarDivider(),
  sidebarSectionLabel("Languages"),
  sidebarLangLine("Azerbaijani", "Native"),
  sidebarLangLine("English", "Fluent"),
  sidebarLangLine("Russian", "Intermediate"),
  sidebarDivider(),
  sidebarSectionLabel("Education"),
  new Paragraph({
    spacing: { before: 30, after: 10 },
    children: [new TextRun({ text: "BSc, Computer Science", size: 16, color: S.text, font: "Calibri" })],
  }),
  new Paragraph({
    spacing: { before: 10, after: 10 },
    children: [new TextRun({ text: "【University Name】, Baku", size: 15, color: S.label, font: "Calibri" })],
  }),
];

// ══════════════════════════════════════════════════
// RIGHT BODY CONTENT — Ateşgah-focused
// ══════════════════════════════════════════════════
const bodyChildren = [
  // Profile Summary
  sectionHeading("Professional Summary", "Profile"),
  new Paragraph({
    spacing: { before: 80, after: 40, line: 276 },
    children: [
      new TextRun({
        text: "Business Analyst with 3+ years of experience in requirements engineering, process modelling (BPMN 2.0), and UAT coordination across fintech and e-commerce sectors, backed by a 15-year career in software development (C#/.NET, PostgreSQL). This dual perspective enables rapid translation of business needs into actionable specifications and accelerates adoption of no-code/low-code platforms. Proven ability to bridge the gap between technical teams and business stakeholders through structured documentation, data-driven analysis, and cross-functional collaboration.",
        size: 18, color: S.body, font: "Calibri",
      }),
    ],
  }),

  // Work Experience
  sectionHeading("Work Experience", "Experience"),

  ...experienceEntry("Embafinans", "Business Analyst", "2023 \u2014 Present", [
    "Conducted SME discovery sessions across 5+ departments to map As-Is/To-Be business processes in BPMN 2.0, identifying automation opportunities that reduced manual processing time by an estimated 30%.",
    "Authored Functional Requirements Documents (FRD) in REQ-101 format with 10+ requirements per project, covering business rules, data models, and acceptance criteria aligned with stakeholder priorities.",
    "Designed REST API specifications in OpenAPI 3.0 covering 8+ endpoints spanning partner onboarding, application management, and payment processing workflows.",
    "Built UAT test plans with 14+ test cases including edge scenarios, managed bug triage using severity/priority matrices, and coordinated sign-off with business stakeholders.",
    "Created SQL analytics queries (JOIN, GROUP BY, Subqueries) for process analysis, delivering data-driven recommendations that informed strategic decisions by leadership.",
  ]),

  ...experienceEntry("Umico", "Business Analyst", "2022 \u2014 2023", [
    "Analysed e-commerce business workflows and translated requirements into user stories with Gherkin acceptance criteria for the product development team.",
    "Performed gap analysis between current system capabilities and target business needs, producing prioritised recommendations for platform enhancement.",
    "Resolved stakeholder conflicts by presenting quantitative cost-benefit analysis, aligning divergent priorities between operations and IT departments.",
  ]),

  ...experienceEntry("Various Companies", "Senior Software Developer", "2007 \u2014 2022", [
    "Designed and developed enterprise applications using C#/.NET, applying OOP principles, SOLID architecture, and design patterns across 10+ projects in fintech and government sectors.",
    "Developed and maintained PostgreSQL databases including schema design, stored procedures, functions, and query performance tuning for high-volume transactional systems.",
    "Built and consumed RESTful APIs, integrating third-party systems including payment gateways, state registries, and insurance platforms \u2014 directly relevant to no-code integration workflows.",
    "Collaborated closely with business analysts, translating functional requirements into technical specifications, mentoring junior developers, and conducting code reviews.",
  ]),

  // Tools & Technologies
  sectionHeading("Tools & Technologies", "Tech Stack"),
  new Paragraph({
    spacing: { before: 60, after: 40, line: 276 },
    children: [
      new TextRun({ text: "BA & PM Tools: ", size: 18, bold: true, color: S.title, font: "Calibri" }),
      new TextRun({ text: "Jira, Confluence, Draw.io, Visio, Miro", size: 17, color: S.body, font: "Calibri" }),
    ],
  }),
  new Paragraph({
    spacing: { before: 20, after: 20, line: 276 },
    children: [
      new TextRun({ text: "API & Testing: ", size: 18, bold: true, color: S.title, font: "Calibri" }),
      new TextRun({ text: "Postman, Swagger / OpenAPI 3.0, UAT Planning", size: 17, color: S.body, font: "Calibri" }),
    ],
  }),
  new Paragraph({
    spacing: { before: 20, after: 20, line: 276 },
    children: [
      new TextRun({ text: "Database: ", size: 18, bold: true, color: S.title, font: "Calibri" }),
      new TextRun({ text: "PostgreSQL (pgAdmin), MS SQL Server (SSMS), SQL Analytics", size: 17, color: S.body, font: "Calibri" }),
    ],
  }),
  new Paragraph({
    spacing: { before: 20, after: 20, line: 276 },
    children: [
      new TextRun({ text: "Development: ", size: 18, bold: true, color: S.title, font: "Calibri" }),
      new TextRun({ text: "C# / .NET, REST API, Git, OOP & Design Patterns", size: 17, color: S.body, font: "Calibri" }),
    ],
  }),
];

// ══════════════════════════════════════════════════
// BUILD DOCUMENT — Same Template A layout
// ══════════════════════════════════════════════════
const doc = new Document({
  styles: {
    default: {
      document: {
        run: {
          font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" },
          size: 18,
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
          size: { width: 11906, height: 16838, orientation: 0 },
          margin: { top: 0, bottom: 0, left: 0, right: 0 },
        },
      },
      children: [
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          columnWidths: [3400, 8506],
          borders: allNoBorders,
          rows: [
            new TableRow({
              height: { value: 16038, rule: "exact" },
              cantSplit: true,
              children: [
                // Sidebar (left)
                new TableCell({
                  width: { size: 3400, type: WidthType.DXA },
                  shading: { fill: S.bg, type: ShadingType.CLEAR },
                  borders: allNoBorders,
                  margins: { top: 300, bottom: 200, left: 200, right: 200 },
                  verticalAlign: "top",
                  children: sidebarChildren,
                }),
                // Body (right)
                new TableCell({
                  width: { size: 8506, type: WidthType.DXA },
                  borders: allNoBorders,
                  margins: { top: 300, bottom: 200, left: 300, right: 300 },
                  verticalAlign: "top",
                  children: bodyChildren,
                }),
              ],
            }),
          ],
        }),
      ],
    },
  ],
});

// ── Export ──
const OUTPUT = "/home/z/my-project/download/Zamir_Camalov_BA_NoCode_CV_EN.docx";

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(OUTPUT, buffer);
  console.log("CV generated: " + OUTPUT);
});
