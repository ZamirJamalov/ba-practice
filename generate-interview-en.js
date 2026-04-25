const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, ShadingType, WidthType, VerticalAlign,
  PageBreak, HeadingLevel
} = require("docx");
const fs = require("fs");

// ─── Color Palette ───
const C = {
  blue: "2A6496",
  darkBlue: "1B3A5C",
  darkText: "1A1A1A",
  bodyText: "333333",
  white: "FFFFFF",
  lightBg: "F2F7FC",
  border: "CCCCCC",
  gray: "666666",
};

// ─── Border Definitions ───
const thinBorder = { style: BorderStyle.SINGLE, size: 1, color: C.border };
const cellBorders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };
const noBorder = { style: BorderStyle.NONE, size: 0, color: C.white };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

// ─── Helper: Number Cell (blue bg, white bold, centered) ───
function numCell(number) {
  return new TableCell({
    width: { size: 8, type: WidthType.PERCENTAGE },
    verticalAlign: VerticalAlign.CENTER,
    shading: { fill: C.blue, type: ShadingType.CLEAR },
    borders: cellBorders,
    margins: { top: 80, bottom: 80, left: 100, right: 100 },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { line: 276 },
        children: [
          new TextRun({ text: String(number), font: "Calibri", size: 20, bold: true, color: C.white }),
        ],
      }),
    ],
  });
}

// ─── Helper: Question Cell (bold, dark) ───
function questionCell(questionText) {
  return new TableCell({
    width: { size: 25, type: WidthType.PERCENTAGE },
    verticalAlign: VerticalAlign.TOP,
    borders: cellBorders,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [
      new Paragraph({
        spacing: { line: 276 },
        children: [
          new TextRun({ text: questionText, font: "Calibri", size: 20, bold: true, color: C.darkText }),
        ],
      }),
    ],
  });
}

// ─── Helper: Build Answer Paragraphs (returns array of Paragraph objects) ───
function buildAnswerParagraphs(paragraphs) {
  const children = [];
  for (let i = 0; i < paragraphs.length; i++) {
    const p = paragraphs[i];
    if (typeof p === "string") {
      // Regular text line
      const isLast = i === paragraphs.length - 1;
      children.push(
        new Paragraph({
          spacing: { line: 276, before: isLast ? 0 : 40, after: isLast ? 0 : 40 },
          children: [
            new TextRun({ text: p, font: "Calibri", size: 20, color: C.bodyText }),
          ],
        })
      );
    } else if (p.type === "bullet") {
      children.push(
        new Paragraph({
          spacing: { line: 276, before: 40, after: 40 },
          children: [
            new TextRun({ text: "\u25CF ", font: "Calibri", size: 18, color: C.blue }),
            new TextRun({ text: p.text, font: "Calibri", size: 20, color: C.bodyText }),
          ],
        })
      );
    } else if (p.type === "sub-bullet") {
      children.push(
        new Paragraph({
          spacing: { line: 276, before: 20, after: 20 },
          indent: { left: 360 },
          children: [
            new TextRun({ text: "\u25CF ", font: "Calibri", size: 14, color: C.gray }),
            new TextRun({ text: p.text, font: "Calibri", size: 19, color: C.bodyText }),
          ],
        })
      );
    } else if (p.type === "text") {
      children.push(
        new Paragraph({
          spacing: { line: 276, before: 40, after: 40 },
          children: [
            new TextRun({ text: p.text, font: "Calibri", size: 20, color: p.bold ? C.darkText : C.bodyText, bold: p.bold || false }),
          ],
        })
      );
    } else if (p.type === "empty") {
      children.push(new Paragraph({ spacing: { line: 276 }, children: [] }));
    }
  }
  return children;
}

// ─── Helper: Table Header Row ───
function tableHeaderRow() {
  const headerCellOpts = {
    verticalAlign: VerticalAlign.CENTER,
    shading: { fill: C.darkBlue, type: ShadingType.CLEAR },
    borders: cellBorders,
    margins: { top: 80, bottom: 80, left: 100, right: 100 },
  };
  return new TableRow({
    tableHeader: true,
    children: [
      new TableCell({
        ...headerCellOpts,
        width: { size: 8, type: WidthType.PERCENTAGE },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "#", font: "Calibri", size: 20, bold: true, color: C.white })] })],
      }),
      new TableCell({
        ...headerCellOpts,
        width: { size: 25, type: WidthType.PERCENTAGE },
        children: [new Paragraph({ children: [new TextRun({ text: "Question", font: "Calibri", size: 20, bold: true, color: C.white })] })],
      }),
      new TableCell({
        ...headerCellOpts,
        width: { size: 67, type: WidthType.PERCENTAGE },
        children: [new Paragraph({ children: [new TextRun({ text: "Model Answer", font: "Calibri", size: 20, bold: true, color: C.white })] })],
      }),
    ],
  });
}

// ─── Helper: Question Table Row ───
function questionRow(num, question, answerParagraphs, altRow = false) {
  const bgFill = altRow ? C.lightBg : C.white;
  const answerChildren = buildAnswerParagraphs(answerParagraphs);
  const row = new TableRow({
    children: [
      new TableCell({
        width: { size: 8, type: WidthType.PERCENTAGE },
        verticalAlign: VerticalAlign.CENTER,
        shading: { fill: C.blue, type: ShadingType.CLEAR },
        borders: cellBorders,
        margins: { top: 80, bottom: 80, left: 100, right: 100 },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { line: 276 },
            children: [new TextRun({ text: String(num), font: "Calibri", size: 20, bold: true, color: C.white })],
          }),
        ],
      }),
      new TableCell({
        width: { size: 25, type: WidthType.PERCENTAGE },
        verticalAlign: VerticalAlign.TOP,
        shading: { fill: bgFill, type: ShadingType.CLEAR },
        borders: cellBorders,
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [
          new Paragraph({
            spacing: { line: 276 },
            children: [new TextRun({ text: question, font: "Calibri", size: 20, bold: true, color: C.darkText })],
          }),
        ],
      }),
      new TableCell({
        width: { size: 67, type: WidthType.PERCENTAGE },
        verticalAlign: VerticalAlign.TOP,
        shading: { fill: bgFill, type: ShadingType.CLEAR },
        borders: cellBorders,
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: answerChildren,
      }),
    ],
  });
  return row;
}

// ─── Helper: Section Title ───
function sectionTitle(text) {
  return new Paragraph({
    spacing: { before: 300, after: 200, line: 276 },
    children: [
      new TextRun({ text: text, font: "Calibri", size: 44, bold: true, color: C.blue }),
    ],
  });
}

// ─── Helper: Spacer ───
function spacer(before = 100) {
  return new Paragraph({ spacing: { before }, children: [] });
}

// ─── Helper: Question Table (header + rows) ───
function buildQuestionTable(questions) {
  const rows = [tableHeaderRow()];
  questions.forEach((q, i) => {
    rows.push(questionRow(q.num, q.question, q.answer, i % 2 === 1));
  });
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [770, 2419, 6482],
    rows,
  });
}

// ═══════════════════════════════════════════════════════════════════
// COVER PAGE
// ═══════════════════════════════════════════════════════════════════
const coverChildren = [
  // Top decorative bar
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        height: { value: 200, rule: "exact" },
        children: [
          new TableCell({
            shading: { fill: C.blue, type: ShadingType.CLEAR },
            borders: noBorders,
            width: { size: 100, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [] })],
          }),
        ],
      }),
    ],
  }),
  spacer(1600),
  // Title
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200, line: 276 },
    children: [
      new TextRun({ text: "BA Interview Preparation", font: "Calibri", size: 80, bold: true, color: C.blue }),
    ],
  }),
  // Subtitle
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 100, line: 276 },
    children: [
      new TextRun({ text: "Questions & Model Answers", font: "Calibri", size: 48, color: C.gray }),
    ],
  }),
  // Divider line
  new Table({
    width: { size: 40, type: WidthType.PERCENTAGE },
    alignment: AlignmentType.CENTER,
    rows: [
      new TableRow({
        height: { value: 30, rule: "exact" },
        children: [
          new TableCell({
            shading: { fill: C.blue, type: ShadingType.CLEAR },
            borders: noBorders,
            children: [new Paragraph({ children: [] })],
          }),
        ],
      }),
    ],
  }),
  spacer(400),
  // Position
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 80, line: 276 },
    children: [
      new TextRun({ text: "Position: ", font: "Calibri", size: 24, color: C.gray }),
      new TextRun({ text: "IT Business Analyst", font: "Calibri", size: 24, bold: true, color: C.darkText }),
    ],
  }),
  // Company
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 80, line: 276 },
    children: [
      new TextRun({ text: "Company: ", font: "Calibri", size: 24, color: C.gray }),
      new TextRun({ text: "Kontakt Home", font: "Calibri", size: 24, bold: true, color: C.darkText }),
    ],
  }),
  // Candidate
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 80, line: 276 },
    children: [
      new TextRun({ text: "Candidate: ", font: "Calibri", size: 24, color: C.gray }),
      new TextRun({ text: "Zamir Camalov", font: "Calibri", size: 24, bold: true, color: C.darkText }),
    ],
  }),
  spacer(300),
  // Metadata table
  new Table({
    width: { size: 50, type: WidthType.PERCENTAGE },
    alignment: AlignmentType.CENTER,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: { top: noBorder, bottom: thinBorder, left: noBorder, right: noBorder },
            margins: { top: 60, bottom: 60, left: 200, right: 200 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: "Date: ", font: "Calibri", size: 20, color: C.gray }),
                  new TextRun({ text: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }), font: "Calibri", size: 20, bold: true, color: C.darkText }),
                ],
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: { top: noBorder, bottom: thinBorder, left: noBorder, right: noBorder },
            margins: { top: 60, bottom: 60, left: 200, right: 200 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: "Version: ", font: "Calibri", size: 20, color: C.gray }),
                  new TextRun({ text: "1.0", font: "Calibri", size: 20, bold: true, color: C.darkText }),
                ],
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: { top: noBorder, bottom: thinBorder, left: noBorder, right: noBorder },
            margins: { top: 60, bottom: 60, left: 200, right: 200 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: "Questions: ", font: "Calibri", size: 20, color: C.gray }),
                  new TextRun({ text: "22 (5 groups)", font: "Calibri", size: 20, bold: true, color: C.darkText }),
                ],
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: { top: noBorder, bottom: thinBorder, left: noBorder, right: noBorder },
            margins: { top: 60, bottom: 60, left: 200, right: 200 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: "Language: ", font: "Calibri", size: 20, color: C.gray }),
                  new TextRun({ text: "English", font: "Calibri", size: 20, bold: true, color: C.darkText }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  }),
  spacer(800),
  // Bottom decorative bar
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        height: { value: 200, rule: "exact" },
        children: [
          new TableCell({
            shading: { fill: C.blue, type: ShadingType.CLEAR },
            borders: noBorders,
            width: { size: 100, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [] })],
          }),
        ],
      }),
    ],
  }),
];

// ═══════════════════════════════════════════════════════════════════
// HOW TO USE THIS DOCUMENT
// ═══════════════════════════════════════════════════════════════════
const howToUseChildren = [
  sectionTitle("How to Use This Document"),
  spacer(60),
  new Paragraph({
    spacing: { after: 120, line: 276 },
    children: [
      new TextRun({ text: "This document contains 22 interview questions organized into 5 thematic groups, each with a detailed model answer. Use this guide to prepare effectively for your Kontakt Home BA position interview.", font: "Calibri", size: 21, color: C.bodyText }),
    ],
  }),
  spacer(100),
  new Paragraph({
    spacing: { after: 80, line: 276 },
    children: [
      new TextRun({ text: "Interview Tips:", font: "Calibri", size: 24, bold: true, color: C.darkText }),
    ],
  }),
  ...[
    "Read each question carefully before reviewing the answer. Try to formulate your own response first, then compare with the model answer.",
    "Personalize the answers with your own experience and examples. The model answers provide a framework, not a script to memorize.",
    "Use the STAR method (Situation, Task, Action, Result) when answering behavioral questions to provide structured and compelling responses.",
    "Focus on demonstrating business impact with measurable results (percentages, time saved, revenue increased) rather than just listing activities.",
    "Practice speaking your answers aloud. Written answers and spoken answers feel different; aim for natural, conversational delivery.",
    "Prepare questions to ask the interviewer about Kontakt Home's business processes, technology stack, and team structure.",
    "Research Kontakt Home's credit process, store network, and market position before the interview to show genuine interest and preparation.",
    "Be ready to discuss how your technical background (SQL, API, databases) gives you an edge as a BA who can bridge business and technology.",
  ].map((tip) =>
    new Paragraph({
      spacing: { before: 60, after: 60, line: 276 },
      children: [
        new TextRun({ text: "\u25CF ", font: "Calibri", size: 18, color: C.blue }),
        new TextRun({ text: tip, font: "Calibri", size: 21, color: C.bodyText }),
      ],
    })
  ),
  spacer(100),
  new Paragraph({
    spacing: { after: 80, line: 276 },
    children: [
      new TextRun({ text: "Question Groups:", font: "Calibri", size: 24, bold: true, color: C.darkText }),
    ],
  }),
  ...[
    "Group 1: Self Introduction (Q1\u2013Q2) \u2014 Background, career journey, and key differentiators",
    "Group 2: BA Knowledge & Experience (Q3\u2013Q10) \u2014 Core BA skills, artifacts, and methodologies",
    "Group 3: Kontakt Home Context (Q11\u2013Q15) \u2014 Domain-specific analysis for the target company",
    "Group 4: Scenario-Based Questions (Q16\u2013Q19) \u2014 Behavioral and situational responses",
    "Group 5: Technical Questions (Q20\u2013Q22) \u2014 SQL, REST API, and SDLC knowledge",
  ].map((item) =>
    new Paragraph({
      spacing: { before: 40, after: 40, line: 276 },
      indent: { left: 240 },
      children: [
        new TextRun({ text: "\u25CF ", font: "Calibri", size: 16, color: C.blue }),
        new TextRun({ text: item, font: "Calibri", size: 21, color: C.bodyText }),
      ],
    })
  ),
];

// ═══════════════════════════════════════════════════════════════════
// ALL 22 QUESTIONS AND ANSWERS
// ═══════════════════════════════════════════════════════════════════

// GROUP 1: Self Introduction
const group1Questions = [
  {
    num: 1,
    question: "Tell me about yourself and your BA experience",
    answer: [
      "I have 2+ years of Business Analyst experience across fintech and e-commerce. At Birbonus, I designed a customer loyalty bonus system \u2014 conducted stakeholder sessions to define earning rules, eligibility criteria, and partner settlement workflows. At Embafinans, I have delivered 4 production projects: Credit Scoring (2x faster credit decisions), B2C Sales Channel (300\u2013500 daily applications), Goods Loan Delivery Dashboard (real-time monitoring, 2x fewer errors), and End-to-End Credit Lifecycle management.",
      { type: "empty" },
      "A key differentiator is my 15-year software engineering background. I have worked with C#, Oracle, PostgreSQL, MongoDB, REST API, and CI/CD pipelines. At Umico, I spent 2 years as a PostgreSQL developer and L2 production support engineer \u2014 resolving incidents using ELK Stack log analysis. This means I can translate business requirements into technical specifications naturally, and I understand how systems work under the hood.",
    ],
  },
  {
    num: 2,
    question: "How did you become a Business Analyst?",
    answer: [
      "I spent 15 years as a software engineer \u2014 C# backend developer at the Central Bank of Azerbaijan, Unibank, and ASAN Service. During that time, I worked extensively with relational and NoSQL databases, REST API design, and CI/CD pipelines.",
      { type: "empty" },
      "At Umico, while working as a PostgreSQL developer and L2 support engineer, I found myself naturally gravitating toward requirements gathering, process analysis, and coordinating with developers. My team recognized these additional skills, and I transitioned into the IT Business Analyst role.",
      { type: "empty" },
      "At Birbonus, I took on a full BA role \u2014 writing BRDs, FRDs, User Stories with Gherkin Acceptance Criteria, and coordinating UAT. At Embafinans, I delivered my largest projects: the Credit Scoring system reduced decision time by 2x, and the B2C channel now handles 300\u2013500 daily applications.",
      { type: "empty" },
      "An engineering background gives a BA a significant advantage: you speak the developers' language, you can write API specifications, and you understand production issues \u2014 making you not just a \"requirements gatherer\" but a true bridge between business and technology.",
    ],
  },
];

// GROUP 2: BA Knowledge & Experience
const group2Questions = [
  {
    num: 3,
    question: "You have written BRDs \u2014 explain the structure",
    answer: [
      "The purpose of a BRD is to document business requirements \u2014 it answers \"what needs to be done,\" not \"how to do it.\"",
      { type: "empty" },
      "At Embafinans, I wrote a BRD for the Credit Scoring project. Here is the structure I used:",
      { type: "bullet", text: "Executive Summary \u2014 project purpose and business value (2x faster credit decisions)" },
      { type: "bullet", text: "Business Goals \u2014 measurable objectives: approval time under 60 seconds, reduce manual reviews" },
      { type: "bullet", text: "Scope \u2014 in-scope (BNPL scoring, goods loan) and out-of-scope (post-loan monitoring) clearly separated" },
      { type: "bullet", text: "Stakeholders \u2014 who is impacted: Risk Department, Sales, IT, Credit Committee, partner stores" },
      { type: "bullet", text: "Business Requirements \u2014 BR-101, BR-102 format. Example: \"BR-101: The system shall automatically score credit applications within 60 seconds\"" },
      { type: "bullet", text: "Assumptions and Constraints \u2014 what we assumed, what limitations exist" },
      { type: "bullet", text: "Glossary \u2014 definitions of domain-specific terms" },
      { type: "empty" },
      { type: "text", text: "Key principle: ", bold: true },
      { type: "text", text: "the BRD serves as the foundation for the FRD. Every BR item gets broken down into functional details in the FRD." },
    ],
  },
  {
    num: 4,
    question: "How do you write User Stories? Give an example",
    answer: [
      "At Embafinans, I write User Stories at the beginning of each sprint using this format:",
      { type: "empty" },
      { type: "bullet", text: "As a [role], I want to [action], so that [benefit]" },
      { type: "empty" },
      { type: "text", text: "Example from the Credit Scoring project:", bold: true },
      { type: "bullet", text: 'US-101: As a customer, I want to submit a credit application via mobile app, so that I can apply for credit without visiting a branch.' },
      { type: "sub-bullet", text: "Acceptance Criteria (Gherkin):" },
      { type: "sub-bullet", text: "Given I am a registered customer on the app" },
      { type: "sub-bullet", text: "When I fill in my personal and financial details and submit" },
      { type: "sub-bullet", text: "Then my application should be saved and sent for scoring" },
      { type: "sub-bullet", text: "And I should see a confirmation with application ID" },
      { type: "empty" },
      { type: "bullet", text: "US-102: As a risk analyst, I want to view automated scoring results, so that I can focus on manual review cases only." },
      { type: "sub-bullet", text: "Given an application has been scored" },
      { type: "sub-bullet", text: "When the score is between 50-79" },
      { type: "sub-bullet", text: "Then the application appears in my manual review queue with full scoring breakdown" },
      { type: "empty" },
      "I aim to write 3 Acceptance Criteria per User Story \u2014 happy path, edge case, and error case.",
    ],
  },
  {
    num: 5,
    question: "You use BPMN \u2014 give an example",
    answer: [
      "BPMN stands for Business Process Model and Notation. It is used to visually model business processes.",
      { type: "empty" },
      "For the Embafinans Credit Scoring project, I created both As-Is and To-Be diagrams with swimlanes:",
      { type: "empty" },
      { type: "text", text: "Swimlanes: ", bold: true },
      "Customer | Scoring Engine | Risk Department | CRM",
      { type: "empty" },
      { type: "text", text: "As-Is process (before):", bold: true },
      "Customer applies manually \u2014 Risk Department reviews manually (3\u20135 days) \u2014 Committee meeting \u2014 Decision",
      { type: "empty" },
      { type: "text", text: "To-Be process (after):", bold: true },
      "Customer submits via app \u2014 Scoring Engine evaluates automatically (60 seconds) \u2014 Score >= 80: Auto-approve | Score 50\u201379: Manual review queue | Score < 50: Auto-reject \u2014 CRM notification",
      { type: "empty" },
      { type: "text", text: "Key BPMN elements I use:", bold: true },
      { type: "bullet", text: "Start/End events (circles)" },
      { type: "bullet", text: "User Tasks (rectangles with rounded corners)" },
      { type: "bullet", text: "Exclusive Gateways (diamonds) for decision points" },
      { type: "bullet", text: "Service Tasks (rectangles with gear icon) for automated actions" },
      { type: "bullet", text: "Timer Events (clock icon) for waiting periods" },
      { type: "empty" },
      "The As-Is diagram is critical because it reveals bottlenecks, provides visual explanation to stakeholders, and serves as the baseline for comparison with the To-Be state.",
    ],
  },
  {
    num: 6,
    question: "When do you draw Sequence Diagrams?",
    answer: [
      "Sequence diagrams show the interaction flow between systems \u2014 while BPMN shows the business process, Sequence Diagrams show \"which system calls which system and in what order.\"",
      { type: "empty" },
      "For the Credit Scoring project at Embafinans, I drew a sequence diagram with these participants:",
      { type: "empty" },
      "Customer App | API Gateway | Scoring Service | Credit Bureau | Risk Rules Engine | Notification Service | Database",
      { type: "empty" },
      { type: "text", text: "Flow:", bold: true },
      { type: "bullet", text: "1. Customer App sends POST /scoring/submit to API Gateway" },
      { type: "bullet", text: "2. API Gateway forwards request to Scoring Service" },
      { type: "bullet", text: "3. Scoring Service calls Credit Bureau GET /score for real-time bureau score" },
      { type: "bullet", text: "4. Bureau returns score (e.g., 720)" },
      { type: "bullet", text: "5. Scoring Service sends data to Risk Rules Engine for evaluation" },
      { type: "bullet", text: "6. Rules Engine returns decision (APPROVED, score 85)" },
      { type: "bullet", text: "7. Scoring Service saves result to Database" },
      { type: "bullet", text: "8. Scoring Service triggers Notification Service" },
      { type: "bullet", text: "9. Notification Service sends SMS to Customer" },
      { type: "empty" },
      "I create this diagram during the Technical Specification phase \u2014 it serves as the primary handoff artifact for developers. They can see exactly which API calls are needed, in what order, and what data flows between systems.",
    ],
  },
  {
    num: 7,
    question: "What is Gap Analysis? Have you done one?",
    answer: [
      "Gap Analysis is the process of identifying the differences between the current state (As-Is) and the desired state (To-Be).",
      { type: "empty" },
      "I performed a Gap Analysis for the Credit Scoring project at Embafinans. Here is a sample of the table format I used:",
      { type: "empty" },
      { type: "bullet", text: "Area: Credit Decision Speed" },
      { type: "sub-bullet", text: "As-Is: 5\u20137 days manual processing" },
      { type: "sub-bullet", text: "To-Be: Under 60 seconds automated scoring" },
      { type: "sub-bullet", text: "Gap: Critical speed bottleneck" },
      { type: "sub-bullet", text: "Priority: High" },
      { type: "sub-bullet", text: "Action: Implement automated scoring engine" },
      { type: "empty" },
      { type: "bullet", text: "Area: Risk Assessment" },
      { type: "sub-bullet", text: "As-Is: Subjective manual evaluation by committee" },
      { type: "sub-bullet", text: "To-Be: Multi-factor weighted scoring model" },
      { type: "sub-bullet", text: "Gap: Inconsistent risk evaluation across analysts" },
      { type: "sub-bullet", text: "Priority: High" },
      { type: "sub-bullet", text: "Action: Deploy 5-factor scoring model" },
      { type: "empty" },
      { type: "bullet", text: "Area: Bureau Integration" },
      { type: "sub-bullet", text: "As-Is: Phone/fax-based bureau inquiries" },
      { type: "sub-bullet", text: "To-Be: Real-time API integration" },
      { type: "sub-bullet", text: "Gap: Delayed bureau data retrieval" },
      { type: "sub-bullet", text: "Priority: High" },
      { type: "sub-bullet", text: "Action: Integrate Credit Bureau API" },
      { type: "empty" },
      "After completing the Gap Analysis, I prioritize each gap using the RICE framework. Sometimes resolving one gap also resolves others \u2014 I note these dependencies as well.",
    ],
  },
  {
    num: 8,
    question: "Explain the RICE framework",
    answer: [
      "RICE is a framework for prioritizing requirements based on 4 metrics:",
      { type: "empty" },
      { type: "bullet", text: "R (Reach): How many users/month will this requirement impact?" },
      { type: "bullet", text: "I (Impact): How much value? 1 = Minimal, 2 = Major, 3 = Massive" },
      { type: "bullet", text: "C (Confidence): How confident are we? 100% = High, 80% = Medium, 50% = Low" },
      { type: "bullet", text: "E (Effort): How many person-weeks will it take?" },
      { type: "empty" },
      { type: "text", text: "Formula: RICE Score = (R \u00D7 I \u00D7 C) / E", bold: true },
      { type: "empty" },
      { type: "text", text: "Example from Embafinans Credit Scoring:", bold: true },
      { type: "bullet", text: "REQ-101: Automated Scoring Engine | Reach: 400/month | Impact: 3 | Confidence: 90% | Effort: 8 weeks | RICE = (400 \u00D7 3 \u00D7 0.9) / 8 = 135" },
      { type: "bullet", text: "REQ-102: Credit Bureau API Integration | Reach: 400 | Impact: 3 | Confidence: 85% | Effort: 3 | RICE = (400 \u00D7 3 \u00D7 0.85) / 3 = 340" },
      { type: "bullet", text: "REQ-103: SMS Notifications | Reach: 400 | Impact: 2 | Confidence: 95% | Effort: 1 | RICE = (400 \u00D7 2 \u00D7 0.95) / 1 = 760" },
      { type: "empty" },
      { type: "text", text: "Result: ", bold: true },
      "SMS has the highest RICE score \u2014 low effort, high reach. The scoring engine is the most critical but requires the most effort.",
      { type: "empty" },
      { type: "text", text: "Why RICE over WSJF? ", bold: true },
      "RICE is simpler and not tied to SAFe. Kontakt Home does not use SAFe, so RICE is more appropriate.",
    ],
  },
  {
    num: 9,
    question: "How do you conduct UAT?",
    answer: [
      "UAT stands for User Acceptance Testing \u2014 the phase where business stakeholders test the system before it goes to production.",
      { type: "empty" },
      "My UAT process at Embafinans follows these steps:",
      { type: "empty" },
      { type: "bullet", text: "1. UAT Test Plan \u2014 I define which test cases exist, who participates, and the schedule" },
      { type: "bullet", text: "2. Test Cases \u2014 I derive test cases from BRD/FRD \u2014 minimum 1 test case per requirement" },
      { type: "bullet", text: "3. Test Sessions \u2014 I schedule sessions with stakeholders from Risk, Sales, and Operations" },
      { type: "bullet", text: "4. Test Execution \u2014 Stakeholders test while I document observations" },
      { type: "bullet", text: "5. Bug Triage \u2014 Together with QA and developers, I discuss each bug: severity (Critical/Major/Minor) and priority (High/Medium/Low)" },
      { type: "bullet", text: "6. Sign-off \u2014 Once all Critical bugs are resolved, the stakeholder signs off" },
      { type: "empty" },
      { type: "text", text: "Example test case: ", bold: true },
      "\"TC-101: Happy path auto-approval \u2014 Application with score >= 80 shall be automatically approved\"",
      { type: "empty" },
      { type: "text", text: "Key principle: ", bold: true },
      "During UAT, I do not test \u2014 I coordinate. The business user is the tester.",
    ],
  },
  {
    num: 10,
    question: "Do you know Swagger/OpenAPI?",
    answer: [
      "Yes, at Embafinans I wrote Swagger/OpenAPI 3.0 specifications for the Credit Scoring API and the B2C Payment API.",
      { type: "empty" },
      { type: "text", text: "Example endpoint:", bold: true },
      { type: "empty" },
      { type: "bullet", text: "POST /v1/scoring/submit \u2014 Submits a credit application to the scoring engine" },
      { type: "empty" },
      { type: "text", text: "Request body includes: ", bold: true },
      "applicant data (name, PIN, income, employment type), credit product type, requested amount",
      { type: "empty" },
      { type: "text", text: "Response includes: ", bold: true },
      "applicationId, overallScore (0\u2013100), decision (AUTO_APPROVED / MANUAL_REVIEW / AUTO_REJECTED), riskLevel, recommendedLimit",
      { type: "empty" },
      { type: "text", text: "For each endpoint, I document:", bold: true },
      { type: "bullet", text: "Description of what the endpoint does" },
      { type: "bullet", text: "Parameters (path, query, header)" },
      { type: "bullet", text: "Request body with JSON schema and validation rules" },
      { type: "bullet", text: "Response schemas for all status codes (200, 400, 500)" },
      { type: "bullet", text: "Example values for developers to test with" },
      { type: "empty" },
      "I use Swagger as a handoff artifact to developers \u2014 they can test endpoints via Swagger UI and export collections to Postman.",
    ],
  },
];

// GROUP 3: Kontakt Home Context
const group3Questions = [
  {
    num: 11,
    question: "What could be slowing down the credit process at Kontakt Home?",
    answer: [
      "Based on my experience in fintech, here are the potential bottlenecks in a retail credit process:",
      { type: "bullet", text: "Bank response time: Partner banks (TBC, Kapital Bank) may have slow API response times, or the process may still be manual" },
      { type: "bullet", text: "Customer document collection: ID card, income proof, employment verification \u2014 collecting and verifying these documents takes time" },
      { type: "bullet", text: "Internal coordination: The flow from Sales Associate to Store Manager to bank representative involves waiting at each step" },
      { type: "bullet", text: "Lack of system integration: If there is no bank API, the process relies on phone calls or faxes" },
      { type: "bullet", text: "No pre-approval: When a customer enters the store, their credit limit is unknown \u2014 this creates additional waiting time during the purchase decision" },
      { type: "empty" },
      "I believe the biggest bottleneck is likely the bank response time \u2014 because while other steps can be optimized internally, the bank's process is harder to control directly.",
    ],
  },
  {
    num: 12,
    question: "If tasked with speeding up the credit process, how would you approach it?",
    answer: [
      "I would follow a 6-step approach:",
      { type: "empty" },
      { type: "text", text: "1. Discovery: ", bold: true },
      "First, understand the current process \u2014 in-store observation, interviews with sales staff, conversation with bank representatives. I would draw a BPMN As-Is diagram.",
      { type: "empty" },
      { type: "text", text: "2. Data Collection: ", bold: true },
      "How many credit applications per day? How many are abandoned due to waiting? What is the average wait time? I would run SQL queries to extract this data.",
      { type: "empty" },
      { type: "text", text: "3. Root Cause Analysis: ", bold: true },
      "Where exactly is the bottleneck? Bank response time? Document collection? Internal process steps?",
      { type: "empty" },
      { type: "text", text: "4. To-Be Process Design: ", bold: true },
      "If a bank API exists, I would design an automated pre-approval system. If not, I would initiate API integration discussions with the bank.",
      { type: "empty" },
      { type: "text", text: "5. RICE Prioritization: ", bold: true },
      "Which solution delivers the most value with the least effort? Prioritize accordingly.",
      { type: "empty" },
      { type: "text", text: "6. Pilot: ", bold: true },
      "Test in one store first, measure KPIs, then roll out to all stores.",
      { type: "empty" },
      { type: "text", text: "The key point is: ", bold: true },
      "I would never propose a solution before gathering data \u2014 estimates are not enough, I need evidence-based analysis.",
    ],
  },
  {
    num: 13,
    question: "Who would be the stakeholders?",
    answer: [
      "In the credit process, the stakeholders would be:",
      { type: "bullet", text: "Customer: The person applying for credit \u2014 wants faster processing and a seamless experience" },
      { type: "bullet", text: "Sales Associate: In-store staff executing the credit process \u2014 wants speed so they do not lose sales" },
      { type: "bullet", text: "Store Manager: Responsible for store revenue \u2014 wants higher credit-to-cash conversion rate" },
      { type: "bullet", text: "Finance Department: Manages credit risk \u2014 wants low default rates and proper due diligence" },
      { type: "bullet", text: "IT Department: Implements system integrations \u2014 needs clear technical specifications" },
      { type: "bullet", text: "Partner Bank: The lending institution \u2014 has its own risk criteria and compliance requirements" },
      { type: "bullet", text: "Operations: Handles documentation and monitoring \u2014 wants process efficiency" },
      { type: "empty" },
      "Each stakeholder has different priorities. For example, Sales wants speed while Finance wants thoroughness. As a BA, my job is to balance these competing interests.",
    ],
  },
  {
    num: 14,
    question: "What KPIs would you track?",
    answer: [
      "I would track KPIs across 3 categories:",
      { type: "empty" },
      { type: "text", text: "Process KPIs:", bold: true },
      { type: "bullet", text: "Average credit processing time (in minutes) \u2014 need current baseline to set a target" },
      { type: "bullet", text: "Credit approval rate \u2014 percentage of applications approved" },
      { type: "bullet", text: "Customer abandonment rate \u2014 how many customers leave due to waiting" },
      { type: "empty" },
      { type: "text", text: "Business KPIs:", bold: true },
      { type: "bullet", text: "Credit-to-cash conversion rate \u2014 percentage of sales made on credit vs cash" },
      { type: "bullet", text: "Average ticket size (credit vs cash) \u2014 credit purchases typically have higher basket values" },
      { type: "bullet", text: "Revenue per credit sale \u2014 additional income from credit interest/fees" },
      { type: "empty" },
      { type: "text", text: "Customer KPIs:", bold: true },
      { type: "bullet", text: "Net Promoter Score (NPS) \u2014 customer satisfaction with the credit process" },
      { type: "bullet", text: "Time to first payment \u2014 days from credit approval to first installment" },
      { type: "bullet", text: "Default rate \u2014 percentage of credits that go unpaid (tracked with Finance)" },
      { type: "empty" },
      { type: "text", text: 'Key principle: ', bold: true },
      { type: "text", text: 'Every KPI must be measurable and actionable. "Customer is happy" is not a KPI \u2014 "NPS score above 40" is a KPI.' },
    ],
  },
  {
    num: 15,
    question: "Can you do a SWOT analysis?",
    answer: [
      { type: "text", text: "SWOT for Kontakt Home's credit process:", bold: true },
      { type: "empty" },
      { type: "text", text: "Strengths:", bold: true },
      { type: "bullet", text: "Extensive store network \u2014 large existing customer base" },
      { type: "bullet", text: "Electronics and home appliances \u2014 high-ticket items create natural credit demand" },
      { type: "bullet", text: "Existing bank partnerships \u2014 credit infrastructure is already in place" },
      { type: "empty" },
      { type: "text", text: "Weaknesses:", bold: true },
      { type: "bullet", text: "Potentially manual credit process \u2014 slow speed and poor customer experience" },
      { type: "bullet", text: "Limited data visibility \u2014 may lack real-time monitoring dashboards" },
      { type: "bullet", text: "Weak cross-department coordination \u2014 Sales, Finance, and IT may operate in silos" },
      { type: "empty" },
      { type: "text", text: "Opportunities:", bold: true },
      { type: "bullet", text: "Online credit application \u2014 extend credit capability to the online channel" },
      { type: "bullet", text: "Pre-approval system \u2014 customers arrive at the store with a known credit limit" },
      { type: "bullet", text: "Multi-bank comparison \u2014 offer customers the best terms from multiple lending partners" },
      { type: "empty" },
      { type: "text", text: "Threats:", bold: true },
      { type: "bullet", text: "Online competitors \u2014 international and local online retailers may offer faster credit experiences" },
      { type: "bullet", text: "Changing bank terms \u2014 rising interest rates could reduce credit demand" },
      { type: "bullet", text: "Economic instability \u2014 increased default risk during economic downturns" },
    ],
  },
];

// GROUP 4: Scenario-Based Questions
const group4Questions = [
  {
    num: 16,
    question: "Store staff refuse to use the new system \u2014 what do you do?",
    answer: [
      "This is a very common scenario \u2014 I encountered something similar at Embafinans. My approach:",
      { type: "empty" },
      { type: "text", text: "1. Understand the root cause: ", bold: true },
      "Why are they resisting? Is the system too complex? Was there no training? Does it add extra work? I would conduct individual conversations with several sales associates.",
      { type: "empty" },
      { type: "text", text: "2. Show empathy: ", bold: true },
      "\"I understand you make sales every day, and an additional system takes extra time \u2014 I hear your concern.\"",
      { type: "empty" },
      { type: "text", text: "3. Demonstrate value: ", bold: true },
      "If the credit process becomes faster, they will close more sales \u2014 this directly impacts their bonuses.",
      { type: "empty" },
      { type: "text", text: "4. Simplify: ", bold: true },
      "If the UX is the problem, I would collect specific feedback and pass it to the development team with clear priorities. The goal is to reduce the most-used function to 1\u20132 clicks.",
      { type: "empty" },
      { type: "text", text: "5. Run a pilot: ", bold: true },
      "\"Let us try it for one week in this store \u2014 if your sales numbers go up, we continue.\" A small pilot reduces perceived risk.",
      { type: "empty" },
      { type: "text", text: "6. Share success stories: ", bold: true },
      "I would highlight the results from the pilot store \u2014 peer influence is the strongest motivator.",
      { type: "empty" },
      { type: "text", text: "What I would never do: ", bold: true },
      "\"Using the system is mandatory.\" This creates resentment and passive resistance.",
    ],
  },
  {
    num: 17,
    question: "Two departments disagree on priorities \u2014 how do you resolve it?",
    answer: [
      "At Embafinans, this happens regularly \u2014 Sales wants \"faster approvals\" while Risk wants \"thorough review.\"",
      { type: "empty" },
      "My approach:",
      { type: "empty" },
      { type: "text", text: "1. Listen to each side separately ", bold: true },
      "\u2014 in a structured interview format, not in front of the other party.",
      { type: "empty" },
      { type: "text", text: "2. Bring data: ", bold: true },
      "Not estimates, but evidence. I would run a SQL query: \"In the last 3 months, how many applications went through manual review? What percentage of those defaulted?\" If the default rate is low, Risk's concern may be less justified.",
      { type: "empty" },
      { type: "text", text: "3. Find a compromise: ", bold: true },
      "For example, \"Score >= 80 auto-approve (Sales is happy), Score 50\u201379 manual review but with a 24-hour SLA (Risk is happy because they still review borderline cases).\"",
      { type: "empty" },
      { type: "text", text: "4. Use RICE to prioritize: ", bold: true },
      "Score each proposal using RICE \u2014 numbers speak louder than opinions.",
      { type: "empty" },
      { type: "text", text: "5. If no agreement is reached, escalate to the sponsor ", bold: true },
      "with both options: \"Option A has RICE score X and risk assessment Y. Option B has RICE score Z and risk assessment W. Your decision.\"",
      { type: "empty" },
      { type: "text", text: "Key principle: ", bold: true },
      "Let data drive the conversation, not emotions or organizational hierarchy.",
    ],
  },
  {
    num: 18,
    question: "A developer says your requirement is impossible \u2014 what do you do?",
    answer: [
      "In this situation, my engineering background is a significant advantage \u2014 I speak the developer's language.",
      { type: "empty" },
      { type: "text", text: '1. "Why is it impossible?" ', bold: true },
      "I ask for the specific reason: technical limitation? Timeline constraint? Third-party API not supported?",
      { type: "empty" },
      { type: "text", text: "2. If it is a technical limitation: ", bold: true },
      "\"Is there an alternative approach?\" For example, if the bank API does not support real-time responses, we could discuss batch processing every 15 minutes as a compromise.",
      { type: "empty" },
      { type: "text", text: "3. If it is a timeline issue: ", bold: true },
      'I prioritize using RICE scores. "This requirement has a RICE score of 120 \u2014 if it does not fit in this sprint, we move it to the next. But let us cut lower-RICE requirements first."',
      { type: "empty" },
      { type: "text", text: "4. If it is a third-party issue: ", bold: true },
      "\"Let us work with IT to explore alternative vendors or integration approaches.\"",
      { type: "empty" },
      { type: "text", text: "5. What I would never say: ", bold: true },
      '"It must be done." Instead: "The business value of this requirement is X \u2014 what is your technical proposal to achieve it?"',
    ],
  },
  {
    num: 19,
    question: "Your manager says finish this week, but you need 2 weeks \u2014 what do you do?",
    answer: [
      { type: "text", text: "The key principle here is: never lie about timelines.", bold: true },
      { type: "empty" },
      'My response: "The full scope of this requirement requires a minimum of 2 weeks. If we compress it to 1 week, quality will suffer \u2014 which leads to bugs in production."',
      { type: "empty" },
      "But I always offer alternatives:",
      { type: "empty" },
      { type: "text", text: "1. MVP approach: ", bold: true },
      "\"Let us deliver the most critical functionality this week, and defer the rest to the next sprint.\" For example, instead of a full scoring engine, just the pre-screen API.",
      { type: "empty" },
      { type: "text", text: "2. Phased delivery: ", bold: true },
      "\"Phase 1: Basic functionality (1 week). Phase 2: Full feature set (week 2).\" I give the manager a clear choice.",
      { type: "empty" },
      { type: "text", text: "3. Show the trade-off: ", bold: true },
      '"If we do it in 1 week, we sacrifice: [list of items]. If we take 2 weeks, the full scope is delivered with quality."',
      { type: "empty" },
      { type: "text", text: "The most important principle: ", bold: true },
      'Lying buys you short-term relief but destroys long-term trust. When bugs appear in production, they will say: "You told us it would be done."',
    ],
  },
];

// GROUP 5: Technical Questions
const group5Questions = [
  {
    num: 20,
    question: "Explain SQL JOIN types",
    answer: [
      "There are 4 main JOIN types:",
      { type: "empty" },
      { type: "text", text: "1. INNER JOIN: ", bold: true },
      "Returns only rows that have matching records in both tables.",
      { type: "sub-bullet", text: "Example: credit_applications INNER JOIN scoring_results ON application_id = id" },
      { type: "sub-bullet", text: "Shows only applications that have been scored" },
      { type: "empty" },
      { type: "text", text: "2. LEFT JOIN: ", bold: true },
      "Returns all rows from the left table, with NULL for non-matching rows in the right table.",
      { type: "sub-bullet", text: "Example: customers LEFT JOIN credit_applications ON customer_id = id" },
      { type: "sub-bullet", text: "Shows all customers, even those who have never applied for credit" },
      { type: "empty" },
      { type: "text", text: "3. RIGHT JOIN: ", bold: true },
      "Returns all rows from the right table, with NULL for non-matching rows in the left table. (Rarely used in practice)",
      { type: "empty" },
      { type: "text", text: "4. FULL OUTER JOIN: ", bold: true },
      "Returns all rows from both tables, with NULL where there is no match.",
      { type: "empty" },
      "At Embafinans, I use LEFT JOIN most frequently \u2014 for questions like \"which customers have not applied for credit?\" INNER JOIN is used for combining scoring results with application details.",
    ],
  },
  {
    num: 21,
    question: "What is REST API? What are the HTTP methods?",
    answer: [
      "REST stands for Representational State Transfer \u2014 an architectural style for web APIs.",
      { type: "empty" },
      { type: "text", text: "The 4 main HTTP methods:", bold: true },
      { type: "bullet", text: "GET: Read data. Example: GET /api/applications/123 \u2014 retrieve application details" },
      { type: "bullet", text: "POST: Create new data. Example: POST /api/scoring/submit \u2014 submit a new scoring request" },
      { type: "bullet", text: "PUT: Update existing data (full replacement). Example: PUT /api/applications/123 \u2014 update an application" },
      { type: "bullet", text: "DELETE: Remove data. Example: DELETE /api/applications/123 \u2014 delete an application" },
      { type: "empty" },
      { type: "text", text: "Additional methods: ", bold: true },
      "PATCH (partial update), OPTIONS (list allowed methods).",
      { type: "empty" },
      { type: "text", text: "REST principles:", bold: true },
      { type: "bullet", text: "Stateless \u2014 each request must contain all information needed, the server does not store sessions" },
      { type: "bullet", text: "Resource-based \u2014 URLs represent resources (/applications, /customers)" },
      { type: "bullet", text: "HTTP status codes \u2014 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 404 (Not Found), 500 (Server Error)" },
      { type: "empty" },
      "At Embafinans, I designed the Credit Scoring API following REST principles and documented it using Swagger/OpenAPI 3.0.",
    ],
  },
  {
    num: 22,
    question: "What are the SDLC phases?",
    answer: [
      "SDLC stands for Software Development Life Cycle. The 6 main phases:",
      { type: "empty" },
      { type: "text", text: "1. Planning ", bold: true },
      "\u2014 Define project scope, resources, and timeline. The BA contributes by preparing the business case.",
      { type: "empty" },
      { type: "text", text: "2. Requirements Analysis ", bold: true },
      "\u2014 The BA's primary phase. Stakeholder sessions, BRD/FRD writing, User Stories. At Embafinans, this maps to the Discovery and Requirements Documentation methodology steps.",
      { type: "empty" },
      { type: "text", text: "3. Design ", bold: true },
      "\u2014 System architecture, database schema, API design. The BA contributes sequence diagrams and data mapping documents as part of the developer handoff.",
      { type: "empty" },
      { type: "text", text: "4. Development (Implementation) ", bold: true },
      "\u2014 Developers write code. The BA answers clarification questions and manages change requests.",
      { type: "empty" },
      { type: "text", text: "5. Testing ", bold: true },
      "\u2014 Unit tests (developers), Integration tests (QA), UAT (business stakeholders). The BA coordinates UAT and leads bug triage.",
      { type: "empty" },
      { type: "text", text: "6. Deployment and Maintenance ", bold: true },
      "\u2014 Release to production. The BA monitors post-deployment and collects feedback.",
      { type: "empty" },
      "At Embafinans, all 4 projects followed this cycle. The BA is involved in every phase but is most active during phases 2 and 5.",
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════
// BUILD DOCUMENT
// ═══════════════════════════════════════════════════════════════════

const doc = new Document({
  styles: {
    default: {
      document: {
        run: {
          font: "Calibri",
          size: 22,
          color: C.bodyText,
        },
        paragraph: {
          spacing: { line: 276 },
        },
      },
    },
  },
  sections: [
    // ─── COVER PAGE ───
    {
      properties: {
        page: {
          margin: { top: 850, bottom: 700, left: 950, right: 950 },
          size: { width: 11906, height: 16838 },
        },
      },
      children: coverChildren,
    },
    // ─── HOW TO USE + GROUP 1 ───
    {
      properties: {
        page: {
          margin: { top: 850, bottom: 700, left: 950, right: 950 },
          size: { width: 11906, height: 16838 },
        },
      },
      children: [
        ...howToUseChildren,
        spacer(200),
        // Group 1 title
        sectionTitle("Group 1: Self Introduction"),
        buildQuestionTable(group1Questions),
      ],
    },
    // ─── GROUP 2 ───
    {
      properties: {
        page: {
          margin: { top: 850, bottom: 700, left: 950, right: 950 },
          size: { width: 11906, height: 16838 },
        },
      },
      children: [
        sectionTitle("Group 2: BA Knowledge & Experience"),
        buildQuestionTable(group2Questions),
      ],
    },
    // ─── GROUP 3 ───
    {
      properties: {
        page: {
          margin: { top: 850, bottom: 700, left: 950, right: 950 },
          size: { width: 11906, height: 16838 },
        },
      },
      children: [
        sectionTitle("Group 3: Kontakt Home Context"),
        buildQuestionTable(group3Questions),
      ],
    },
    // ─── GROUP 4 ───
    {
      properties: {
        page: {
          margin: { top: 850, bottom: 700, left: 950, right: 950 },
          size: { width: 11906, height: 16838 },
        },
      },
      children: [
        sectionTitle("Group 4: Scenario-Based Questions"),
        buildQuestionTable(group4Questions),
      ],
    },
    // ─── GROUP 5 + FOOTER ───
    {
      properties: {
        page: {
          margin: { top: 850, bottom: 700, left: 950, right: 950 },
          size: { width: 11906, height: 16838 },
        },
      },
      children: [
        sectionTitle("Group 5: Technical Questions"),
        buildQuestionTable(group5Questions),
        spacer(400),
        // Footer divider
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              height: { value: 30, rule: "exact" },
              children: [
                new TableCell({
                  shading: { fill: C.border, type: ShadingType.CLEAR },
                  borders: noBorders,
                  children: [new Paragraph({ children: [] })],
                }),
              ],
            }),
          ],
        }),
        spacer(100),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { line: 276 },
          children: [
            new TextRun({ text: "This document was prepared for interview preparation purposes only.", font: "Calibri", size: 18, color: C.gray, italics: true }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { line: 276, before: 40 },
          children: [
            new TextRun({ text: "All answers are based on real experience and should be personalized before the interview.", font: "Calibri", size: 18, color: C.gray, italics: true }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { line: 276, before: 40 },
          children: [
            new TextRun({ text: `Generated on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} | Version 1.0`, font: "Calibri", size: 18, color: C.gray }),
          ],
        }),
      ],
    },
  ],
});

// ─── Generate File ───
const outputPath = "/home/z/my-project/download/BA_Interview_Preparation_Kontakt_Home.docx";
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outputPath, buffer);
  console.log(`Document generated successfully: ${outputPath}`);
  console.log(`File size: ${(buffer.length / 1024).toFixed(1)} KB`);
}).catch((err) => {
  console.error("Error generating document:", err);
  process.exit(1);
});
