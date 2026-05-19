const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, ShadingType, WidthType, VerticalAlign,
  PageBreak
} = require("docx");
const fs = require("fs");

// ─── Color Palette (Tech: Deep Blue-Purple) ───
const S = {
  bg: "1A1F36",       // sidebar background
  text: "D8E2E8",     // sidebar text (white-ish)
  label: "8BA0AD",    // sidebar secondary text
  accent: "667eea",   // accent color (amethyst blue)
  title: "1A1A1A",    // body heading
  body: "2C2C2C",     // body content
  sec: "6B6B6B",      // secondary info (dates etc.)
};

const NB = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: NB, bottom: NB, left: NB, right: NB };
const allNoBorders = { top: NB, bottom: NB, left: NB, right: NB, insideHorizontal: NB, insideVertical: NB };

// ─── Helper: Sidebar Text Run ───
function sidebarRun(text, opts = {}) {
  return new TextRun({
    text,
    font: "Calibri",
    color: opts.color || S.text,
    size: opts.size || 18,
    bold: opts.bold || false,
    ...opts,
  });
}

// ─── Helper: Body Text Run ───
function bodyRun(text, opts = {}) {
  return new TextRun({
    text,
    font: "Calibri",
    color: opts.color || S.body,
    size: opts.size || 19,
    bold: opts.bold || false,
    ...opts,
  });
}

// ─── Sidebar Section Label ───
function sidebarLabel(text) {
  return new Paragraph({
    spacing: { before: 160, after: 60 },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        font: "Calibri",
        color: S.accent,
        size: 16,
        bold: true,
        characterSpacing: 60,
      }),
    ],
  });
}

// ─── Sidebar Paragraph ───
function sidebarPara(text, opts = {}) {
  return new Paragraph({
    spacing: { before: opts.spaceBefore || 30, after: opts.spaceAfter || 30 },
    children: [
      sidebarRun(text, { color: opts.color || S.text, size: opts.size || 17 }),
    ],
  });
}

// ─── Sidebar Contact Line ───
function contactLine(label, value) {
  return new Paragraph({
    spacing: { before: 25, after: 25 },
    children: [
      sidebarRun(label + "  ", { color: S.accent, size: 16 }),
      sidebarRun(value, { color: S.text, size: 16 }),
    ],
  });
}

// ─── Skill Item (dot rating) ───
function skillItem(name, level, detail) {
  const filled = "\u25CF".repeat(level);
  const empty = "\u25CB".repeat(5 - level);
  return new Paragraph({
    spacing: { before: 30, after: 30 },
    children: [
      sidebarRun(name, { size: 16, bold: true }),
      sidebarRun(`  ${filled}${empty}`, { size: 11, color: S.accent }),
      detail ? sidebarRun(`  ${detail}`, { size: 14, color: S.label }) : new TextRun({ text: "", size: 10 }),
    ],
  });
}

// ─── Right Section Heading (color bar) ───
function sectionHeading(text) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [8506],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { fill: S.accent, type: ShadingType.CLEAR },
            margins: { top: 40, bottom: 40, left: 180, right: 100 },
            borders: allNoBorders,
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text,
                    size: 21,
                    bold: true,
                    color: "FFFFFF",
                    font: "Calibri",
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

// ─── Experience Entry ───
function expEntry(company, title, date, bullets) {
  const children = [
    // Company + Title + Date
    new Paragraph({
      spacing: { before: 120, after: 30 },
      children: [
        bodyRun(company, { size: 21, bold: true, color: S.title }),
        bodyRun("  |  ", { size: 18, color: S.sec }),
        bodyRun(title, { size: 19, color: S.accent }),
        bodyRun("\t" + date, { size: 17, color: S.sec }),
        new TextRun({
          text: "\t" + date,
          size: 17,
          color: S.sec,
          font: "Calibri",
        }),
      ],
    }),
  ];
  // Remove duplicate date text (the tab one)
  // Actually let me fix this - just one date with tab
  children[0] = new Paragraph({
    spacing: { before: 120, after: 30 },
    tabStops: [{ type: "right", position: 8200 }],
    children: [
      bodyRun(company, { size: 21, bold: true, color: S.title }),
      bodyRun("  |  ", { size: 18, color: S.sec }),
      bodyRun(title, { size: 19, color: S.accent }),
      new TextRun({ text: "\t" + date, font: "Calibri", size: 17, color: S.sec }),
    ],
  });

  for (const b of bullets) {
    children.push(
      new Paragraph({
        spacing: { before: 20, after: 20 },
        children: [
          bodyRun("\u25B8 ", { size: 14, color: S.accent }),
          bodyRun(b, { size: 18 }),
        ],
      })
    );
  }
  return children;
}

// ─── Build Sidebar Content ───
const sidebarChildren = [
  // Name
  new Paragraph({
    spacing: { before: 200, after: 60 },
    alignment: AlignmentType.LEFT,
    children: [
      new TextRun({
        text: "Zamir",
        font: "Calibri",
        size: 48,
        bold: true,
        color: "FFFFFF",
      }),
    ],
  }),
  new Paragraph({
    spacing: { before: 0, after: 30 },
    alignment: AlignmentType.LEFT,
    children: [
      new TextRun({
        text: "Camalov",
        font: "Calibri",
        size: 48,
        bold: true,
        color: "FFFFFF",
      }),
    ],
  }),
  // Title
  new Paragraph({
    spacing: { before: 40, after: 120 },
    children: [
      new TextRun({
        text: "IT Business Analyst",
        font: "Calibri",
        size: 22,
        color: S.accent,
        bold: true,
      }),
    ],
  }),

  // Contact
  sidebarLabel("Contact"),
  contactLine("Phone", "+994 55 207 7228"),
  contactLine("Email", "jamalov.zamir@gmail.com"),
  contactLine("Location", "Baku, Azerbaijan"),

  // Skills
  sidebarLabel("Core Skills"),
  skillItem("BRD / FRD / SRS", 5),
  skillItem("BPMN Modeling", 5),
  skillItem("REST API / Swagger", 5),
  skillItem("Postman Testing", 4),
  skillItem("SQL (Oracle, MSSQL)", 5),
  skillItem("Agile / Scrum", 5),
  skillItem("Jira / Confluence", 5),
  skillItem("UAT Coordination", 5),
  skillItem("SDLC", 4),

  sidebarLabel("Technical"),
  skillItem("C# / T-SQL", 4),
  skillItem("Python / Power BI", 4),
  skillItem("JSON / XML", 5),
  skillItem("Figma / Prototyping", 4),
  skillItem("ELK Stack / Logging", 3),

  // Languages
  sidebarLabel("Languages"),
  sidebarPara("Azerbaijani \u2014 Native", { size: 16 }),
  sidebarPara("Russian \u2014 Professional (Fluent)", { size: 16 }),
  sidebarPara("English \u2014 Professional", { size: 16 }),

  // Education
  sidebarLabel("Education"),
  sidebarPara("Baku State University", { size: 16, bold: true }),
  sidebarPara("Applied Mathematics (BSc)", { size: 15, color: S.label }),
];

// ─── Build Right Body Content (Page 1) ───
const rightChildrenP1 = [
  // Profile Summary
  sectionHeading("PROFILE SUMMARY"),
  new Paragraph({
    spacing: { before: 100, after: 80 },
    children: [
      bodyRun(
        "Results-driven IT Business Analyst with 15+ years of cross-functional experience spanning fintech, e-commerce, and public sector digital transformation. Proven ability to bridge business requirements and technical implementation through BRD/FRD documentation, BPMN process modeling, and REST API specifications. Former backend developer background enables precise translation of business needs into technical specifications (SRS) with 100% requirement coverage. Skilled in end-to-end SDLC management, UAT coordination, and data-driven decision making using SQL and Power BI. Experienced in multi-stakeholder vendor integrations (PayTabs, Sima, ASAN) and cross-functional team leadership across international environments.",
        { size: 18 },
      ),
    ],
  }),

  // Work Experience
  sectionHeading("WORK EXPERIENCE"),
];

// Embafinans
rightChildrenP1.push(
  ...expEntry("Embafinans", "IT Business Analyst", "2025 \u2013 Present", [
    "Led BNPL and 1C system integration for \u201cOnePoint\u201d platform, aligning technical specifications with finance, sales, and risk stakeholders to automate credit financial reporting workflows.",
    "Automated credit scoring with cut-off threshold approach, redesigned BPMN workflows, and improved overall credit processing speed by 25%.",
    "Managed product backlog using WSJF and RICE prioritization frameworks, directing IT resources toward high-impact strategic initiatives.",
    "Designed REST API (JSON) technical specifications and sequence diagrams for vendor integrations including PayTabs, Sima, and ASAN, coordinating end-to-end testing via Postman.",
    "Acted as technical bridge between business and development teams, leveraging former backend developer experience to ensure 100% requirement-to-SRS translation accuracy.",
    "Designed end-to-end digital customer journey from credit application to payment, including card top-up mechanisms and fund distribution logic.",
    "Integrated video-call (Sima) and digital signature flows to transition the credit process to a fully paperless (paperless) model.",
  ])
);

// BirMarket
rightChildrenP1.push(
  ...expEntry("BirMarket (E-Commerce)", "Business & System Analyst", "2022 \u2013 2025", [
    "Onboarded new marketplace partners (sellers and logistics companies) by defining business and technical requirements (FRD), documenting processes from scratch, and coordinating technical integrations.",
    "Built database-level business logic to ensure accurate transfer of business requirements to the development team, supporting Oracle RDBMS, MSSQL, and PostgreSQL environments.",
    "Conducted L2 support-level monitoring and root cause analysis using ELK Stack and Logstash, analyzing system logs and code repositories to identify production incidents at the code level.",
    "Coordinated with developers for rapid issue resolution, reducing mean-time-to-resolution for critical production incidents.",
  ])
);

// ─── Build Right Body Content (Page 2) ───
const rightChildrenP2 = [
  sectionHeading("WORK EXPERIENCE (continued)"),
];

// Earlier experience
rightChildrenP2.push(
  ...expEntry("Central Bank / Unibank / ASAN Service", "Technical Project Specialist / Developer", "2007 \u2013 2022", [
    "Localized system requirements for global vendors (CheckFree, CMA) at the Central Bank, managing cross-team coordination across international development teams.",
    "Contributed to technical development and QA for Unibank\u2019s UMobile mobile application.",
    "Optimized citizen service processes at ASAN Service through data analysis, supporting public-sector digital transformation initiatives.",
  ])
);

// Training
rightChildrenP2.push(
  sectionHeading("TRAINING & CORPORATE EDUCATION"),
  ...expEntry("DIV Academy & Innab Training Center", "Data Analytics Instructor (Part-time)", "2022 \u2013 2026", [
    "Delivered SQL and Python courses using real-world business case studies, developing strong stakeholder management and presentation skills.",
    "Conducted corporate training programs for Bank of Baku, SOCAR, and other organizations, performing root cause analysis using their internal data.",
  ])
);

// Education on page 2 (already in sidebar but add detail)
rightChildrenP2.push(
  sectionHeading("EDUCATION"),
  new Paragraph({
    spacing: { before: 80, after: 40 },
    children: [
      bodyRun("Baku State University", { size: 21, bold: true, color: S.title }),
      bodyRun("  |  ", { size: 18, color: S.sec }),
      bodyRun("Bachelor of Science in Applied Mathematics", { size: 19, color: S.accent }),
    ],
  }),
);

// Key Strengths
rightChildrenP2.push(
  sectionHeading("KEY STRENGTHS"),
  new Paragraph({
    spacing: { before: 80, after: 40 },
    children: [
      bodyRun("\u25B8 ", { size: 14, color: S.accent }),
      bodyRun("Unique hybrid profile: ", { size: 18, bold: true }),
      bodyRun("Combines deep technical skills (C#, T-SQL, API design, ELK Stack log analysis) with business analysis expertise (BRD/FRD, BPMN, UAT, stakeholder management).", { size: 18 }),
    ],
  }),
  new Paragraph({
    spacing: { before: 20, after: 40 },
    children: [
      bodyRun("\u25B8 ", { size: 14, color: S.accent }),
      bodyRun("End-to-end ownership: ", { size: 18, bold: true }),
      bodyRun("From requirements gathering through API specification, Postman testing, UAT coordination, and production incident root cause analysis.", { size: 18 }),
    ],
  }),
  new Paragraph({
    spacing: { before: 20, after: 40 },
    children: [
      bodyRun("\u25B8 ", { size: 14, color: S.accent }),
      bodyRun("Vendor integration experience: ", { size: 18, bold: true }),
      bodyRun("Successfully coordinated multi-stakeholder integrations with PayTabs, Sima, ASAN, CheckFree, and CMA across fintech and public sector.", { size: 18 }),
    ],
  }),
  new Paragraph({
    spacing: { before: 20, after: 40 },
    children: [
      bodyRun("\u25B8 ", { size: 14, color: S.accent }),
      bodyRun("Bilingual communication: ", { size: 18, bold: true }),
      bodyRun("Professional proficiency in Azerbaijani, Russian, and English \u2014 experienced in cross-cultural and international team coordination.", { size: 18 }),
    ],
  }),
);

// ─── Build Main Table (Sidebar + Body) ───
const mainTable = new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  columnWidths: [3400, 8506],
  borders: allNoBorders,
  rows: [
    new TableRow({
      height: { value: 16038, rule: "exact" },
      children: [
        // Sidebar
        new TableCell({
          shading: { fill: S.bg, type: ShadingType.CLEAR },
          borders: allNoBorders,
          verticalAlign: VerticalAlign.TOP,
          margins: { top: 200, bottom: 200, left: 250, right: 200 },
          width: { size: 3400, type: WidthType.DXA },
          children: sidebarChildren,
        }),
        // Right body
        new TableCell({
          shading: { fill: "FFFFFF", type: ShadingType.CLEAR },
          borders: allNoBorders,
          verticalAlign: VerticalAlign.TOP,
          margins: { top: 200, bottom: 200, left: 280, right: 250 },
          width: { size: 8506, type: WidthType.DXA },
          children: rightChildrenP1,
        }),
      ],
    }),
  ],
});

// ─── Build Document ───
const doc = new Document({
  styles: {
    default: {
      document: {
        run: {
          font: "Calibri",
          size: 22,
          color: S.body,
        },
        paragraph: {
          spacing: { line: 276 },
        },
      },
    },
  },
  sections: [
    // Page 1: Sidebar + Body
    {
      properties: {
        page: {
          margin: { top: 0, bottom: 0, left: 0, right: 0 },
          size: { width: 11906, height: 16838 },
        },
      },
      children: [mainTable],
    },
    // Page 2: Full-width continued content
    {
      properties: {
        page: {
          margin: { top: 600, bottom: 600, left: 800, right: 800 },
          size: { width: 11906, height: 16838 },
        },
      },
      children: [
        // Name bar at top
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          columnWidths: [10306],
          borders: allNoBorders,
          rows: [
            new TableRow({
              cantSplit: true,
              height: { value: 400, rule: "atLeast" },
              children: [
                new TableCell({
                  shading: { fill: S.bg, type: ShadingType.CLEAR },
                  borders: allNoBorders,
                  margins: { top: 50, bottom: 50, left: 200, right: 200 },
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({ text: "Zamir Camalov", size: 20, bold: true, color: "FFFFFF", font: "Calibri" }),
                        new TextRun({ text: "  |  IT Business Analyst", size: 17, color: S.accent, font: "Calibri" }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new Paragraph({ spacing: { before: 100 }, children: [] }),
        ...rightChildrenP2,
      ],
    },
  ],
});

// ─── Generate File ───
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("/home/z/my-project/download/Zamir_Camalov_BA_CV_EN.docx", buffer);
  console.log("CV generated successfully!");
});
