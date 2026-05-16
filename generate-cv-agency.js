const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        AlignmentType, BorderStyle, ShadingType, WidthType, VerticalAlign,
        PageBreak, Header, Footer, PageNumber, TabStopType, TabStopPosition } = require("docx");
const fs = require("fs");

// ─── Color Palette: Government / Public Sector ───
const C = {
  dark: "1A3352",      // header banner (deep navy)
  accent: "2E86C1",    // accent (government blue)
  title: "1A2636",     // heading
  body: "2C3E50",      // body text
  sec: "6B8599",       // secondary info
  light: "E8EFF5",     // light background
  white: "FFFFFF",
};

const NB = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: NB, bottom: NB, left: NB, right: NB };
const allNoBorders = { top: NB, bottom: NB, left: NB, right: NB, insideHorizontal: NB, insideVertical: NB };

// ─── Helpers ───
function sectionHeading(text) {
  return new Paragraph({
    spacing: { before: 200, after: 60 },
    borders: { bottom: { style: BorderStyle.SINGLE, size: 2, color: C.accent, space: 4 } },
    children: [
      new TextRun({ text, size: 22, bold: true, color: C.accent, font: "Calibri" }),
    ],
  });
}

function experienceEntry(company, role, dates, bullets) {
  const children = [
    new Paragraph({
      spacing: { before: 140, after: 20 },
      tabStops: [{ type: TabStopType.RIGHT, position: 10200 }],
      children: [
        new TextRun({ text: company, size: 21, bold: true, color: C.title, font: "Calibri" }),
        new TextRun({ text: "  |  ", size: 18, color: C.sec, font: "Calibri" }),
        new TextRun({ text: role, size: 19, color: C.accent, font: "Calibri", italics: true }),
        new TextRun({ text: "\t" + dates, size: 17, color: C.sec, font: "Calibri" }),
      ],
    }),
  ];
  for (const b of bullets) {
    children.push(new Paragraph({
      spacing: { before: 20, after: 20, line: 276 },
      indent: { left: 280 },
      children: [
        new TextRun({ text: "\u2022  ", size: 17, color: C.accent, font: "Calibri" }),
        new TextRun({ text: b, size: 18, color: C.body, font: "Calibri" }),
      ],
    }));
  }
  return children;
}

// ─── Build Document ───
const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: { ascii: "Calibri" }, size: 20, color: C.body },
        paragraph: { spacing: { line: 276 } },
      },
    },
  },
  sections: [
    // ─── PAGE 1: Header Banner + Content ───
    {
      properties: {
        page: {
          margin: { top: 0, bottom: 600, left: 800, right: 800 },
          size: { width: 11906, height: 16838 },
        },
      },
      children: [
        // ─── Header Banner ───
        new Table({
          width: { size: 10306, type: WidthType.DXA },
          borders: allNoBorders,
          rows: [
            new TableRow({
              height: { value: 2200, rule: "exact" },
              children: [
                new TableCell({
                  width: { size: 10306, type: WidthType.DXA },
                  shading: { fill: C.dark, type: ShadingType.CLEAR },
                  verticalAlign: VerticalAlign.TOP,
                  borders: allNoBorders,
                  margins: { top: 260, bottom: 180, left: 600, right: 600 },
                  children: [
                    new Paragraph({
                      spacing: { after: 40, line: 300 },
                      children: [
                        new TextRun({ text: "ZAMIR JAMALOV", size: 40, bold: true, color: "FFFFFF", font: "Calibri" }),
                        new TextRun({ text: "  |  ", size: 28, color: "90A8C0", font: "Calibri" }),
                        new TextRun({ text: "Business Analyst", size: 28, color: "90A8C0", font: "Calibri" }),
                      ],
                    }),
                    new Paragraph({
                      spacing: { after: 30, line: 260 },
                      children: [
                        new TextRun({ text: "+994 55 207 7228", size: 18, color: "B0C4D8", font: "Calibri" }),
                        new TextRun({ text: "  |  ", size: 18, color: "5A7A94", font: "Calibri" }),
                        new TextRun({ text: "jamalov.zamir@gmail.com", size: 18, color: "B0C4D8", font: "Calibri" }),
                        new TextRun({ text: "  |  ", size: 18, color: "5A7A94", font: "Calibri" }),
                        new TextRun({ text: "Baku, Azerbaijan", size: 18, color: "B0C4D8", font: "Calibri" }),
                      ],
                    }),
                    new Paragraph({
                      spacing: { line: 260 },
                      children: [
                        new TextRun({ text: "Azerbaijani (Native)", size: 17, color: "B0C4D8", font: "Calibri" }),
                        new TextRun({ text: "  |  ", size: 17, color: "5A7A94", font: "Calibri" }),
                        new TextRun({ text: "Russian (Fluent)", size: 17, color: "B0C4D8", font: "Calibri" }),
                        new TextRun({ text: "  |  ", size: 17, color: "5A7A94", font: "Calibri" }),
                        new TextRun({ text: "English (Professional / Technical Documentation)", size: 17, color: "B0C4D8", font: "Calibri" }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),

        // ─── Profile Summary ───
        sectionHeading("Profile Summary"),
        new Paragraph({
          spacing: { before: 40, after: 60, line: 276 },
          children: [
            new TextRun({
              text: "Business Analyst with 4+ years of direct BA experience and 18 years in IT, including significant government sector exposure across the Central Bank, ASAN Service, and the State Employment Agency. Delivered production systems in fintech, e-commerce, and public services. Proven ability to lead cross-functional teams, coordinate multi-agency integrations (35+ organizations), and translate complex business requirements into actionable technical specifications. Seeking to apply combined BA methodology and government sector understanding to drive digital transformation of public services.",
              size: 18, color: C.body, font: "Calibri",
            }),
          ],
        }),

        // ─── Core Skills ───
        sectionHeading("Core Skills"),
        new Paragraph({
          spacing: { before: 40, after: 20, line: 276 },
          children: [
            new TextRun({ text: "Business Analysis:  ", size: 18, bold: true, color: C.title, font: "Calibri" }),
            new TextRun({ text: "BRD / FRD / SRS  |  User Stories & Acceptance Criteria (Gherkin)  |  BPMN (As-Is / To-Be)  |  UML & Sequence Diagrams  |  Gap Analysis  |  Stakeholder Interviews  |  Backlog Prioritization (RICE)  |  UAT Planning & Coordination", size: 17, color: C.body, font: "Calibri" }),
          ],
        }),
        new Paragraph({
          spacing: { before: 20, after: 20, line: 276 },
          children: [
            new TextRun({ text: "Technical:  ", size: 18, bold: true, color: C.title, font: "Calibri" }),
            new TextRun({ text: "REST API & JSON  |  Swagger / OpenAPI 3.0  |  Postman (API Testing)  |  SQL  |  SDLC  |  System Integration  |  Data-Driven Analysis (SQL, ELK Stack)", size: 17, color: C.body, font: "Calibri" }),
          ],
        }),
        new Paragraph({
          spacing: { before: 20, after: 60, line: 276 },
          children: [
            new TextRun({ text: "Process & Tools:  ", size: 18, bold: true, color: C.title, font: "Calibri" }),
            new TextRun({ text: "Agile / Scrum  |  Jira  |  Confluence  |  Cross-Functional Coordination  |  Government Sector Stakeholder Management  |  Process Digitization", size: 17, color: C.body, font: "Calibri" }),
          ],
        }),

        // ─── Professional Experience ───
        sectionHeading("Professional Experience"),

        ...experienceEntry("Embafinans", "Lead IT Business Analyst", "2025 \u2013 Present", [
          "Leading business analysis for fintech products including BNPL credit scoring, payment gateway integration, and goods loan tracking dashboard",
          "Authored BRDs, FRDs, and SRS documents; wrote User Stories with Gherkin Acceptance Criteria and maintained traceability across sprints",
          "Defined REST API specifications in Swagger/OpenAPI 3.0, created sequence diagrams for integration flows, and prepared data mapping documents for developer handoff",
          "Coordinated UAT execution with business stakeholders, led bug triage meetings, and achieved on-time sign-off across multiple release cycles",
          "Ranked requirements using RICE framework and leveraged SQL data analysis to resolve conflicting stakeholder priorities",
        ]),

        ...experienceEntry("Kapital Bank / Birbonus", "IT Business Analyst", "2024 \u2013 2025", [
          "Designed a customer loyalty bonus system (Birmarket) enabling shoppers to earn rewards on purchases and redeem across partner merchants",
          "Conducted stakeholder sessions to define earning rules, eligibility criteria, and partner settlement workflows for the loyalty platform",
        ]),

        ...experienceEntry("Umico", "IT Integration Specialist", "2022 \u2013 2024", [
          "Led API integration of 25+ partner companies into the Umico ecosystem, defining integration specifications and coordinating technical implementation",
          "Built backend features using PostgreSQL, resolved L2 production incidents using ELK Stack log analysis, and supported partner development teams",
        ]),

        ...experienceEntry("State Employment Agency (D\u00F6vl\u0259t M\u0259\u015Fgulluq Agentliyi)", "Innovation Department Lead & Business Analyst", "2021 \u2013 2022", [
          "Led the Innovation Department managing a 2-member team and coordinating with the 15-member EMAS project team, providing methodology guidance and knowledge transfer",
          "Served as Business Analyst for the EMAS (Employment Management Automation System), authoring requirements documentation and coordinating with technical teams during initial system development",
          "Designed a Telegram-based citizen service channel for real-time application submission and response processing, improving public service accessibility",
          "Developed a real-time web-based monitoring dashboard for the management board, enabling transparent tracking of citizen applications, response times, and service delivery performance metrics",
        ]),

        ...experienceEntry("Central Bank of Azerbaijan", "Integration Developer", "2007 \u2013 2012", [
          "Led technical integration of 10+ government organizations into the Government Payment Portal (GPP), defining data exchange specifications and coordinating with agencies on integration requirements",
          "Developed middleware for cross-system data communication between government institutions, enabling automated payment processing at national scale",
        ]),

        // ─── Additional Background ───
        sectionHeading("Additional Professional Background"),
        new Paragraph({
          spacing: { before: 40, after: 60, line: 276 },
          children: [
            new TextRun({
              text: "10+ years in software engineering and data analytics across Azerbaijan's banking and public sectors, including core banking development at Zaminbank, Unibank (UMobileBank project), Bank of Baku, and Rabita Bank; data analytics at ASAN Service supporting public service delivery; and backend development at Umico. This foundation provides deep understanding of enterprise systems, database architectures (Oracle, MSSQL, PostgreSQL, MongoDB), government service delivery patterns, and cross-organization integration.",
              size: 17, color: C.body, font: "Calibri",
            }),
          ],
        }),

        // ─── Education ───
        sectionHeading("Education"),
        new Paragraph({
          spacing: { before: 40, after: 60, line: 276 },
          children: [
            new TextRun({ text: "Baku State University", size: 20, bold: true, color: C.title, font: "Calibri" }),
            new TextRun({ text: "  \u2014  ", size: 18, color: C.sec, font: "Calibri" }),
            new TextRun({ text: "Bachelor of Science in Applied Mathematics", size: 18, color: C.body, font: "Calibri" }),
          ],
        }),
      ],
    },
  ],
});

// ─── Generate ───
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("Zamir_Jamalov_CV_BA_Innovation_Agency.docx", buf);
  console.log("CV generated successfully!");
});
