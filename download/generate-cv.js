const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, ShadingType, WidthType, TabStopType,
} = require("docx");
const fs = require("fs");

// ── Color Palette: Tech / Internet (Template A) ──
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

// ── Sidebar elements ──
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

// ── Right-side section heading (color bar) ──
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

// ── Experience entry ──
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

// ── Project entry ──
function projectEntry(name, tech, bullets) {
  const children = [
    new Paragraph({
      spacing: { before: 80, after: 20 },
      children: [
        new TextRun({ text: name, size: 20, bold: true, color: S.title, font: "Calibri" }),
        new TextRun({ text: "  |  " + tech, size: 16, color: S.sec, font: "Calibri", italics: true }),
      ],
    }),
  ];
  for (const b of bullets) {
    children.push(
      new Paragraph({
        spacing: { before: 15, after: 15, line: 276 },
        children: [
          new TextRun({ text: "\u25B8 ", size: 14, color: S.accent, font: "Calibri" }),
          new TextRun({ text: b, size: 17, color: S.body, font: "Calibri" }),
        ],
      })
    );
  }
  return children;
}

// ── Education entry ──
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

// ── Sidebar Content ──
const sidebarChildren = [
  photoPlaceholder(),
  sidebarName("Aynur Mammadova"),
  sidebarTitle("IT Business Analyst"),
  sidebarDivider(),
  sidebarSectionLabel("Contact"),
  sidebarInfoLine("Phone:", "+994 50 XXX XX XX"),
  sidebarInfoLine("Email:", "aynur.m@mail.com"),
  sidebarInfoLine("LinkedIn:", "linkedin.com/in/aynurm"),
  sidebarInfoLine("Location:", "Baku, Azerbaijan"),
  sidebarDivider(),
  sidebarSectionLabel("Skills"),
  sidebarSkillLine("BPMN / UML", 4),
  sidebarSkillLine("REST API / JSON", 4),
  sidebarSkillLine("SQL (JOIN, GROUP BY)", 4),
  sidebarSkillLine("BRD / FRD", 5),
  sidebarSkillLine("Jira / Confluence", 5),
  sidebarSkillLine("Agile / Scrum", 4),
  sidebarSkillLine("Postman / Swagger", 4),
  sidebarSkillLine("Visio / Draw.io", 4),
  sidebarSkillLine("ER Diagrams", 3),
  sidebarSkillLine("MS Office", 4),
  sidebarDivider(),
  sidebarSectionLabel("Languages"),
  sidebarLangLine("Azerbaijani", "Native"),
  sidebarLangLine("Russian", "Fluent"),
  sidebarLangLine("English", "B2 (Upper-Int)"),
  sidebarDivider(),
  sidebarSectionLabel("Education"),
  new Paragraph({
    spacing: { before: 30, after: 10 },
    children: [new TextRun({ text: "BSc, Information Technologies", size: 16, color: S.text, font: "Calibri" })],
  }),
  new Paragraph({
    spacing: { before: 10, after: 10 },
    children: [new TextRun({ text: "ADA University, Baku", size: 15, color: S.label, font: "Calibri" })],
  }),
  new Paragraph({
    spacing: { before: 10, after: 10 },
    children: [new TextRun({ text: "2019 - 2023", size: 15, color: S.label, font: "Calibri" })],
  }),
  sidebarDivider(),
  sidebarSectionLabel("Certifications"),
  new Paragraph({
    spacing: { before: 20, after: 10 },
    children: [new TextRun({ text: "ECBA - IIBA", size: 16, color: S.text, font: "Calibri" })],
  }),
  new Paragraph({
    spacing: { before: 10, after: 10 },
    children: [new TextRun({ text: "CSPO - Scrum Alliance", size: 16, color: S.text, font: "Calibri" })],
  }),
];

// ── Right Body Content ──
const bodyChildren = [
  // Profile Summary
  sectionHeading("Professional Summary", "Profile"),
  new Paragraph({
    spacing: { before: 80, after: 40, line: 276 },
    children: [
      new TextRun({
        text: "Results-driven IT Business Analyst with 2+ years of experience bridging business requirements and technical solutions in Agile environments. Skilled in gathering and documenting requirements (BRD/FRD), process modelling (BPMN), API specification, and SQL data analysis. Proven ability to collaborate cross-functionally with product, engineering, and marketing teams to deliver features aligned with business value. Strong communicator in Azerbaijani and Russian, comfortable working in fast-paced, international settings.",
        size: 18, color: S.body, font: "Calibri",
      }),
    ],
  }),

  // Work Experience
  sectionHeading("Work Experience", "Experience"),
  ...experienceEntry("Digital Solutions Ltd.", "IT Business Analyst", "Mar 2023 \u2014 Present", [
    "Gathered and analysed business requirements from stakeholders, producing structured BRD and FRD documents that reduced scope ambiguity by 30% across 4 major projects.",
    "Conducted as-is/to-be process analysis for order management and customer onboarding workflows, identifying 12 bottlenecks and proposing optimisation solutions adopted by operations team.",
    "Designed BPMN process models, use case diagrams, and sequence diagrams; authored user stories with detailed acceptance criteria for the development team.",
    "Evaluated business value of backlog items using ROI and impact-effort prioritisation framework, facilitating sprint planning with Product Owner.",
    "Collaborated with frontend, backend, and DB engineers on architecture decisions; prepared technical specifications for REST API endpoints (JSON) documented in Swagger/OpenAPI.",
    "Wrote and optimised SQL queries (JOIN, GROUP BY, subqueries) for data validation and analytical reporting, supporting quarterly business reviews.",
    "Participated in UAT by designing test scenarios, executing acceptance criteria validation, and coordinating defect resolution with QA team.",
    "Maintained comprehensive documentation in Confluence, including API guides, ER diagrams, and process flow references for cross-team alignment.",
  ]),

  ...experienceEntry("TechBridge LLC", "Junior Business Analyst", "Sep 2022 \u2014 Feb 2023", [
    "Assisted senior BA in requirements elicitation through stakeholder interviews and workshops, documenting findings in Jira tickets and Confluence pages.",
    "Created BPMN diagrams for internal HR and finance workflows, identifying automation opportunities that saved 15+ hours per week in manual processing.",
    "Tested REST API endpoints using Postman, verified response schemas against Swagger specifications, and logged discrepancies for developer resolution.",
    "Supported sprint ceremonies (daily stand-ups, planning, retrospectives) in a Scrum environment, tracking progress via Jira boards.",
  ]),

  // Key Projects
  sectionHeading("Key Projects", "Projects"),
  ...projectEntry("E-Commerce Platform Redesign", "REST API, PostgreSQL, BPMN, Jira", [
    "Led requirements analysis for the checkout and payment module, producing 25+ user stories with acceptance criteria aligned to PCI-DSS compliance standards.",
    "Designed sequence diagrams for payment gateway integration flows (3rd-party API), enabling smooth handoff to the backend team with zero rework requests.",
    "Built an ER diagram for the order management database schema, collaborating with DB architects to optimise query performance for reporting.",
    "Prioritised features using MoSCoW + business value scoring, resulting in a 20% faster time-to-market for the MVP launch.",
  ]),
  ...projectEntry("CRM System Migration", "Salesforce, SQL, Confluence, Swagger", [
    "Documented as-is CRM workflows across sales and support teams (BPMN), then designed to-be processes incorporating Salesforce automation features.",
    "Wrote SQL queries to extract and validate legacy customer data before migration, ensuring 99.5% data integrity across 50,000+ records.",
    "Created Swagger API specifications for 15 custom Salesforce integration endpoints used by internal BI dashboards.",
  ]),

  // Technical Tools
  sectionHeading("Tools & Technologies", "Tech Stack"),
  new Paragraph({
    spacing: { before: 60, after: 40, line: 276 },
    children: [
      new TextRun({ text: "BA Tools: ", size: 18, bold: true, color: S.title, font: "Calibri" }),
      new TextRun({ text: "Jira, Confluence, Trello, Miro, Draw.io, Lucidchart, Microsoft Visio", size: 17, color: S.body, font: "Calibri" }),
    ],
  }),
  new Paragraph({
    spacing: { before: 20, after: 20, line: 276 },
    children: [
      new TextRun({ text: "API & Testing: ", size: 18, bold: true, color: S.title, font: "Calibri" }),
      new TextRun({ text: "Postman, Swagger / OpenAPI, Insomnia, SoapUI", size: 17, color: S.body, font: "Calibri" }),
    ],
  }),
  new Paragraph({
    spacing: { before: 20, after: 20, line: 276 },
    children: [
      new TextRun({ text: "Database: ", size: 18, bold: true, color: S.title, font: "Calibri" }),
      new TextRun({ text: "SQL (PostgreSQL, MySQL), DBeaver", size: 17, color: S.body, font: "Calibri" }),
    ],
  }),
  new Paragraph({
    spacing: { before: 20, after: 20, line: 276 },
    children: [
      new TextRun({ text: "Other: ", size: 18, bold: true, color: S.title, font: "Calibri" }),
      new TextRun({ text: "Microsoft Office Suite, Google Workspace, Figma (basic), Git (basic)", size: 17, color: S.body, font: "Calibri" }),
    ],
  }),
];

// ── Build the document ──
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
                // Sidebar
                new TableCell({
                  width: { size: 3400, type: WidthType.DXA },
                  shading: { fill: S.bg, type: ShadingType.CLEAR },
                  borders: allNoBorders,
                  margins: { top: 300, bottom: 200, left: 200, right: 200 },
                  verticalAlign: "top",
                  children: sidebarChildren,
                }),
                // Body
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
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("/home/z/my-project/download/Business_Analyst_CV_Sample.docx", buffer);
  console.log("CV generated: /home/z/my-project/download/Business_Analyst_CV_Sample.docx");
});
