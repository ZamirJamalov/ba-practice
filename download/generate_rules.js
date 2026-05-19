const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  PageBreak, Header, Footer, PageNumber, NumberFormat,
  AlignmentType, HeadingLevel, WidthType, BorderStyle, ShadingType,
  TableLayoutType, LevelFormat,
} = require("docx");
const fs = require("fs");

// ─── Palette: DS-1 Deep Sea ───
const coverP = {
  bg: "0B1C2C",
  titleColor: "FFFFFF",
  subtitleColor: "B0B8C0",
  metaColor: "90989F",
  footerColor: "687078",
  accent: "529286",
};
const P = {
  primary: "0B1220",
  body: "1C2A3D",
  secondary: "5B6B7D",
  accent: "529286",
  surface: "F5F7FA",
};

const NB = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: NB, bottom: NB, left: NB, right: NB };
const allNoBorders = { top: NB, bottom: NB, left: NB, right: NB, insideHorizontal: NB, insideVertical: NB };

// ─── calcTitleLayout ───
function calcTitleLayout(title, maxWidthTwips, preferredPt = 40, minPt = 24) {
  const charWidth = (pt) => pt * 10; // English chars ~10 twips per pt
  const charsPerLine = (pt) => Math.floor(maxWidthTwips / charWidth(pt));
  let titlePt = preferredPt;
  let lines;
  while (titlePt >= minPt) {
    const cpl = charsPerLine(titlePt);
    if (cpl < 2) { titlePt -= 2; continue; }
    lines = title.split(" ").reduce((acc, word) => {
      if (!acc.length) return [word];
      const last = acc[acc.length - 1];
      if ((last + " " + word).length <= cpl) acc[acc.length - 1] = last + " " + word;
      else acc.push(word);
      return acc;
    }, []);
    if (lines.length <= 3) break;
    titlePt -= 2;
  }
  if (!lines || lines.length > 3) {
    const cpl = charsPerLine(minPt);
    lines = title.split(" ").reduce((acc, word) => {
      if (!acc.length) return [word];
      const last = acc[acc.length - 1];
      if ((last + " " + word).length <= cpl) acc[acc.length - 1] = last + " " + word;
      else acc.push(word);
      return acc;
    }, []);
    titlePt = minPt;
  }
  return { titlePt, titleLines: lines };
}

function calcCoverSpacing(params) {
  const {
    titleLineCount = 1, titlePt = 36, hasSubtitle = false,
    hasEnglishLabel = false, metaLineCount = 0,
    fixedHeight = 400, pageHeight = 16838,
  } = params;
  const SAFETY = 1200;
  const usableHeight = pageHeight - SAFETY;
  const titleHeight = titlePt * 23;
  const totalTitleHeight = titleHeight * titleLineCount + 200 * Math.max(0, titleLineCount - 1);
  const subtitleHeight = hasSubtitle ? 400 : 0;
  const englishLabelHeight = hasEnglishLabel ? 400 : 0;
  const metaHeight = metaLineCount * 300;
  const totalContentHeight = fixedHeight + englishLabelHeight + totalTitleHeight + subtitleHeight + metaHeight;
  const freeSpace = usableHeight - totalContentHeight;
  const topSpacing = Math.min(3600, Math.round(freeSpace * 0.4));
  const midSpacing = 400;
  const bottomSpacing = Math.min(3000, Math.max(200, freeSpace - topSpacing - midSpacing));
  return { topSpacing, midSpacing, bottomSpacing };
}

// ─── Cover R1 ───
function buildCoverR1(config) {
  const P = config.palette;
  const padL = 1200, padR = 800;
  const availableWidth = 11906 - padL - padR - 300;
  const { titlePt, titleLines } = calcTitleLayout(config.title, availableWidth, 40, 24);
  const titleSize = titlePt * 2;
  const spacing = calcCoverSpacing({
    titleLineCount: titleLines.length, titlePt,
    hasSubtitle: !!config.subtitle, hasEnglishLabel: !!config.englishLabel,
    metaLineCount: (config.metaLines || []).length,
    fixedHeight: 400,
  });
  const accentLeft = { style: BorderStyle.SINGLE, size: 8, color: P.accent, space: 12 };
  const children = [];
  children.push(new Paragraph({ spacing: { before: spacing.topSpacing } }));
  if (config.englishLabel) {
    children.push(new Paragraph({
      indent: { left: padL, right: padR }, spacing: { after: 500 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: P.accent, space: 8 } },
      children: [new TextRun({ text: config.englishLabel.split("").join("  "),
        size: 18, color: P.accent, font: { ascii: "Calibri" }, characterSpacing: 40 })],
    }));
  }
  for (let i = 0; i < titleLines.length; i++) {
    children.push(new Paragraph({
      indent: { left: padL },
      spacing: { after: i < titleLines.length - 1 ? 100 : 300, line: Math.ceil(titlePt * 23), lineRule: "atLeast" },
      children: [new TextRun({ text: titleLines[i], size: titleSize, bold: true,
        color: P.titleColor, font: { ascii: "Arial" } })],
    }));
  }
  if (config.subtitle) {
    children.push(new Paragraph({
      indent: { left: padL }, spacing: { after: 800 },
      children: [new TextRun({ text: config.subtitle, size: 24, color: P.subtitleColor,
        font: { ascii: "Arial" } })],
    }));
  }
  for (const line of (config.metaLines || [])) {
    children.push(new Paragraph({
      indent: { left: padL + 200 }, spacing: { after: 80 },
      border: { left: accentLeft },
      children: [new TextRun({ text: line, size: 24, color: P.metaColor, font: { ascii: "Arial" } })],
    }));
  }
  children.push(new Paragraph({ spacing: { before: spacing.bottomSpacing } }));
  children.push(new Paragraph({
    indent: { left: padL, right: padR },
    border: { top: { style: BorderStyle.SINGLE, size: 2, color: P.accent, space: 8 } },
    spacing: { before: 200 },
    children: [
      new TextRun({ text: config.footerLeft || "", size: 16, color: P.footerColor, font: { ascii: "Arial" } }),
      new TextRun({ text: "                                        " }),
      new TextRun({ text: config.footerRight || "", size: 16, color: P.footerColor, font: { ascii: "Arial" } }),
    ],
  }));
  return [new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    borders: allNoBorders,
    rows: [new TableRow({
      height: { value: 16838, rule: "exact" },
      children: [new TableCell({
        shading: { type: ShadingType.CLEAR, fill: P.bg }, borders: noBorders,
        children,
      })],
    })],
  })];
}

// ─── Helpers ───
function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 200, line: 312 },
    children: [new TextRun({ text, bold: true, size: 32, color: P.primary, font: { ascii: "Times New Roman" } })],
  });
}
function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 160, line: 312 },
    children: [new TextRun({ text, bold: true, size: 28, color: P.primary, font: { ascii: "Times New Roman" } })],
  });
}
function body(text) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 120, line: 312 },
    children: [new TextRun({ text, size: 24, color: P.body, font: { ascii: "Times New Roman" } })],
  });
}
function bodyBold(label, text) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 120, line: 312 },
    children: [
      new TextRun({ text: label, bold: true, size: 24, color: P.primary, font: { ascii: "Times New Roman" } }),
      new TextRun({ text, size: 24, color: P.body, font: { ascii: "Times New Roman" } }),
    ],
  });
}
function ruleBox(ruleNum, title, ruleText, exampleText) {
  // A table-based rule card with accent left border
  const accentBorder = { style: BorderStyle.SINGLE, size: 6, color: P.accent };
  const noBorderH = { style: BorderStyle.NONE };
  const noBorderV = { style: BorderStyle.NONE };
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: "E0E0E0" },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "E0E0E0" },
      left: noBorderV, right: noBorderV,
      insideHorizontal: noBorderH, insideVertical: noBorderV,
    },
    rows: [
      new TableRow({
        cantSplit: true,
        children: [
          new TableCell({
            width: { size: 8, type: WidthType.PERCENTAGE },
            borders: {
              top: noBorderH, bottom: noBorderH, right: noBorderV,
              left: { style: BorderStyle.SINGLE, size: 6, color: P.accent },
            },
            shading: { type: ShadingType.CLEAR, fill: "FFFFFF" },
            children: [new Paragraph({ children: [] })],
          }),
          new TableCell({
            width: { size: 92, type: WidthType.PERCENTAGE },
            borders: { top: noBorderH, bottom: noBorderH, left: noBorderV, right: noBorderV },
            shading: { type: ShadingType.CLEAR, fill: "FFFFFF" },
            margins: { top: 100, bottom: 100, left: 160, right: 120 },
            children: [
              new Paragraph({
                spacing: { after: 60, line: 312 },
                children: [
                  new TextRun({ text: "Rule " + ruleNum + ": ", bold: true, size: 24, color: P.accent, font: { ascii: "Times New Roman" } }),
                  new TextRun({ text: title, bold: true, size: 24, color: P.primary, font: { ascii: "Times New Roman" } }),
                ],
              }),
              new Paragraph({
                spacing: { after: 60, line: 312 },
                children: [new TextRun({ text: ruleText, size: 24, color: P.body, font: { ascii: "Times New Roman" } })],
              }),
              new Paragraph({
                spacing: { after: 40, line: 312 },
                children: [
                  new TextRun({ text: "Example: ", bold: true, italics: true, size: 22, color: P.secondary, font: { ascii: "Times New Roman" } }),
                  new TextRun({ text: exampleText, italics: true, size: 22, color: P.secondary, font: { ascii: "Times New Roman" } }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

function spacer(h = 120) {
  return new Paragraph({ spacing: { before: h } });
}

// ─── Build Document ───
const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: { ascii: "Times New Roman" }, size: 24, color: P.body },
        paragraph: { spacing: { line: 312 } },
      },
      heading1: {
        run: { font: { ascii: "Times New Roman" }, size: 32, bold: true, color: P.primary },
        paragraph: { spacing: { before: 360, after: 200, line: 312 } },
      },
      heading2: {
        run: { font: { ascii: "Times New Roman" }, size: 28, bold: true, color: P.primary },
        paragraph: { spacing: { before: 280, after: 160, line: 312 } },
      },
    },
  },
  sections: [
    // ─── Section 1: Cover ───
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 0, bottom: 0, left: 0, right: 0 },
        },
      },
      children: buildCoverR1({
        title: "BA Phase 1 Decision Rules",
        subtitle: "Quick Reference Guide for Interview Preparation",
        englishLabel: "Business Analyst Portfolio",
        metaLines: [
          "Project: E-Commerce Return Management System",
          "Company: Kontakt Home",
          "Candidate: Zamir Jamalov",
        ],
        footerLeft: "Confidential",
        footerRight: "2026",
        palette: coverP,
      }),
    },
    // ─── Section 2: Body ───
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 },
        },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: "BA Phase 1 Decision Rules", size: 18, color: P.secondary, font: { ascii: "Calibri" } })],
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: P.secondary })],
          })],
        }),
      },
      children: [
        // ─── Introduction ───
        h1("Introduction"),
        body("This document contains the key decision rules I follow during Phase 1 of a Business Analysis project. Phase 1 covers the period from the first stakeholder interview to the completion of all core business documents. These rules help me make consistent, high-quality decisions about what to write, how much detail to include, and when a document is ready for review."),
        body("Each rule includes a short explanation and a practical example from the Kontakt Home Return Management System project. I use these rules as mental checkpoints. They help me stay organized and make sure I do not miss important steps. Over time, these decisions become automatic, but in the beginning, it is helpful to have clear rules to follow."),

        spacer(200),

        // ─── Section A: Information Gathering ───
        h1("Part A: Information Gathering Rules"),
        body("Before writing any document, a Business Analyst must gather information. This section covers the decisions I make about who to talk to and what to write down during stakeholder interviews. These are the first and most important decisions because everything else depends on the quality of the information I collect."),

        spacer(80),

        ruleBox(
          "1",
          "Who to Interview",
          "Talk to the people who touch the process at each step, plus the people who hear about the problems. Do not interview everyone. Think about the process flow from start to finish. Each step has a person responsible for it. Interview those people. Also add one person who does not do the work but hears complaints, like customer support.",
          "For the Return Management System: store manager (receives returns), area manager (approves expensive returns), warehouse supervisor (handles pickup), finance officer (processes refunds), and customer support lead (hears complaints). Five people, not twenty."
        ),

        spacer(160),

        ruleBox(
          "2",
          "What to Write Down in Interviews",
          "Keep only three types of information: process steps, business rules, and pain points. Process steps are what people do (customer arrives, checks receipt, calls manager). Business rules are the official policies (14-day return policy, 200 AZN approval limit). Pain points are the problems people describe (2-3 hour wait, no tracking system). Everything else, like emotions, personal stories, and complaints about other departments, stay in your head for context only.",
          "Leyla talks for 40 minutes. I do not write 40 minutes of speech. I write: 'Return policy 14 days. Receipt required. Area manager approval for products over 200 AZN. Approval takes 1-4 hours. Warehouse pickup 2-3 hours.' That is it. Clean and structured."
        ),

        spacer(200),

        // ─── Section B: Gap Analysis Rules ───
        h1("Part B: Gap Analysis Rules"),
        body("After stakeholder interviews, I organize the information into a Gap Analysis document. This section covers how I structure the current state, how I define the future state, and how I identify the gaps between them. Each gap becomes a requirement in the BRD, so getting this right is very important."),

        spacer(80),

        ruleBox(
          "3",
          "How to Structure the Current State",
          "Write the Current State as a simple narrative with key facts. The audience is the project sponsor and stakeholders, who are business people, not technical people. A long story will bore them. A numbered list is too dry. A simple narrative with facts is the easiest to read and understand. The format decision always depends on who will read the document.",
          "'Currently, all returns are handled manually. Customers bring products to the store. Store staff check the receipt and call the area manager for approval. Approval takes 1-4 hours. Warehouse pickup takes 2-3 hours. Refunds are processed manually in Excel within 3-5 business days.' Simple, clear, factual."
        ),

        spacer(160),

        ruleBox(
          "4",
          "How to Define the Future State",
          "Take the stakeholder wishes, add the team's technical suggestions, and combine them into a proposed future state. Then present it for validation. The key word is 'proposed.' Never present it as final. Always say: 'This is my proposal based on what I heard. Please tell me if this matches your vision.' This protects you. If they say no, you change it. If they say yes, you move forward together.",
          "Stakeholders want: faster returns, online tracking. The lead developer says: 'We can build a web-based return portal with notifications.' I combine these into: 'Customers can submit return requests through a web portal. The system automatically checks eligibility and sends notifications at each step.' This is a proposal, not a final design."
        ),

        spacer(160),

        ruleBox(
          "5",
          "How Many Gaps to Identify",
          "Each gap should be large enough to become a separate feature or requirement, but small enough to be explained in one sentence. If a gap needs two sentences, it might be two gaps. If two gaps are almost the same, combine them into one. For a typical project, 4 to 8 gaps feels right. Not too many, not too few. Each gap must connect clearly to a stakeholder problem.",
          "I identified 6 gaps for the Return Management System: (1) No digital channel for return requests. (2) No automated eligibility check. (3) Slow manual approval process. (4) No customer tracking for return status. (5) Paper-based records with no central system. (6) No warehouse notification system. Each is one sentence, each becomes one BRD requirement."
        ),

        spacer(200),

        // ─── Section C: BRD Writing Rules ───
        h1("Part C: BRD Writing Rules"),
        body("The Business Requirements Document is the most important document in Phase 1. It defines what the system must do from a business perspective. This section covers how I decide the right level of detail for each requirement. The BRD must be detailed enough for the development team to understand, but not so detailed that it becomes a technical specification."),

        spacer(80),

        ruleBox(
          "6",
          "BRD Requirement Granularity",
          "Each requirement should answer three questions: What should the system do? Who benefits from it? What is the business rule or constraint? If a requirement answers all three questions, it has the right level of detail. If it answers only one, it needs more information. If it includes technical implementation details, it has too much detail and belongs in the FRD, not the BRD.",
          "BR-001: 'The system shall allow registered customers to submit return requests through the website.' What: submit return requests. Who: registered customers. Rule: through the website. That is enough. The technical details like 'use React for the form' go into the FRD later, not here."
        ),

        spacer(200),

        // ─── Section D: User Story Rules ───
        h1("Part D: User Story Rules"),
        body("User Stories break down the BRD requirements into smaller, deliverable pieces. Each story represents one user action that the development team can build and test in a single sprint. This section covers how I decide how many stories to write per requirement and how to keep each story at the right size."),

        spacer(80),

        ruleBox(
          "7",
          "How Many User Stories Per Requirement",
          "Write one User Story per user action. If a requirement involves three different actions, write three stories. Do not combine multiple actions into one big story, because the development team needs small, deliverable pieces. Do not split actions into too many tiny stories, because that creates overhead. Usually 2 to 4 User Stories per BRD requirement is the right balance.",
          "BR-001 is about online return requests. The customer can submit a return (US-001), view return status (US-002), and cancel a return (US-003). Three different actions, three User Stories. I do not combine them into one big story. I do not split 'submit a return' into five tiny stories."
        ),

        spacer(200),

        // ─── Section E: Acceptance Criteria Rules ───
        h1("Part E: Acceptance Criteria Rules"),
        body("Acceptance Criteria define the conditions that must be true for a User Story to be considered complete. They are the bridge between the BA and the tester. This section covers how I decide how many criteria to write and what types of scenarios to cover for each story."),

        spacer(80),

        ruleBox(
          "8",
          "Acceptance Criteria Depth",
          "Cover three types of scenarios: the happy path (everything works correctly), the main error cases (what happens when something goes wrong), and the most important edge cases (unusual but realistic situations). Do not try to cover every possible situation. Usually 4 to 7 criteria per story is the right range. More than 10 means the story is too large and should be split into two stories.",
          "US-001 (Submit Return Request) has 5 criteria: (1) Customer must be logged in. (2) System shows products purchased within 14 days. (3) Customer selects product, reason, and optional photo. (4) System creates return with status 'Pending Review.' (5) Customer cannot return an already-returned product. Happy path: criteria 1-4. Error case: criterion 5. Edge case: optional photo in criterion 3."
        ),

        spacer(200),

        // ─── Section F: Priority and Quality Rules ───
        h1("Part F: Priority and Quality Rules"),
        body("The last set of decisions a BA makes during Phase 1 is about priority and quality. Which stories should be built first? When is a document ready to share with the team? These decisions directly affect project success, so clear rules are essential."),

        spacer(80),

        ruleBox(
          "9",
          "How to Assign Priority",
          "Base priority on three factors: dependency, business impact, and complexity. If other stories depend on this one, it is High. If the project sponsor specifically asked for this feature, it is High. If a story is simple and can be built quickly, consider doing it early even if it is not the most important feature. Always check with the project manager and sponsor before finalizing priorities.",
          "US-001 (Submit Return Request) is High because it is the foundation and everything depends on it. US-010 (Warehouse Route Planning) is Medium because it is useful but not critical for version 1. US-015 (Advanced Analytics Dashboard) is Low because it is nice to have but can wait for version 2."
        ),

        spacer(160),

        ruleBox(
          "10",
          "When to Stop Writing and Start Reviewing",
          "A document is ready for review when you can read it from start to finish without stopping and thinking 'this part is unclear.' Before sending any document for review, check three things: First, every gap from the Gap Analysis must be covered in the BRD. Second, every BRD requirement must have at least one User Story. Third, every User Story must have Acceptance Criteria. If these three checks pass, send the documents. Do not wait for perfection.",
          "Before sending the BRD to the team, I run my three checks. All 6 gaps from Gap Analysis are covered in BR-001 through BR-006? Yes. Each BR has at least one User Story? Yes. Each US has Acceptance Criteria? Yes. I click send. I do not wait until the document is perfect, because perfect documents do not exist. Good enough documents that get reviewed and improved are better than perfect documents that never get shared."
        ),

        spacer(200),

        // ─── Section G: Phase 1 Timeline ───
        h1("Part G: Phase 1 Timeline"),
        body("This is a quick reference for the typical timeline of Phase 1. The actual timeline may vary depending on the project, but the general pattern remains the same. Understanding this timeline helps you plan your work and communicate progress to stakeholders."),

        spacer(80),

        // Timeline table
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 2, color: P.accent },
            bottom: { style: BorderStyle.SINGLE, size: 2, color: P.accent },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "E0E0E0" },
            insideVertical: { style: BorderStyle.NONE },
          },
          rows: [
            new TableRow({
              tableHeader: true,
              cantSplit: true,
              children: [
                new TableCell({
                  width: { size: 20, type: WidthType.PERCENTAGE },
                  shading: { type: ShadingType.CLEAR, fill: P.accent },
                  margins: { top: 80, bottom: 80, left: 120, right: 120 },
                  children: [new Paragraph({ children: [new TextRun({ text: "Day", bold: true, size: 22, color: "FFFFFF", font: { ascii: "Calibri" } })] })],
                }),
                new TableCell({
                  width: { size: 30, type: WidthType.PERCENTAGE },
                  shading: { type: ShadingType.CLEAR, fill: P.accent },
                  margins: { top: 80, bottom: 80, left: 120, right: 120 },
                  children: [new Paragraph({ children: [new TextRun({ text: "Activity", bold: true, size: 22, color: "FFFFFF", font: { ascii: "Calibri" } })] })],
                }),
                new TableCell({
                  width: { size: 25, type: WidthType.PERCENTAGE },
                  shading: { type: ShadingType.CLEAR, fill: P.accent },
                  margins: { top: 80, bottom: 80, left: 120, right: 120 },
                  children: [new Paragraph({ children: [new TextRun({ text: "Output", bold: true, size: 22, color: "FFFFFF", font: { ascii: "Calibri" } })] })],
                }),
                new TableCell({
                  width: { size: 25, type: WidthType.PERCENTAGE },
                  shading: { type: ShadingType.CLEAR, fill: P.accent },
                  margins: { top: 80, bottom: 80, left: 120, right: 120 },
                  children: [new Paragraph({ children: [new TextRun({ text: "Key Action", bold: true, size: 22, color: "FFFFFF", font: { ascii: "Calibri" } })] })],
                }),
              ],
            }),
            // Day 1-3
            makeTimelineRow("1-3", "Observe, meet people, read existing documents, understand the company", "Notes, contacts list, context", "Build relationships, learn the business", 0),
            // Day 4
            makeTimelineRow("4", "Receive project assignment, schedule stakeholder interviews", "Interview schedule", "Email 5 key stakeholders", 1),
            // Day 5-6
            makeTimelineRow("5-6", "Conduct stakeholder interviews (4-5 meetings)", "Interview notes (handwritten)", "Listen, ask questions, write key info only", 0),
            // Day 7
            makeTimelineRow("7", "Organize interview notes into structured document", "Stakeholder Interview document", "4-column table: name/role, what they said, problems, expectations", 1),
            // Day 8
            makeTimelineRow("8", "Send interview doc for review, start Gap Analysis", "Gap Analysis (Current + Future State + Gaps)", "Combine stakeholder input with team suggestions", 0),
            // Day 9
            makeTimelineRow("9", "Update Gap Analysis based on feedback, start BRD", "BRD (first draft, 40% complete)", "Turn each gap into a requirement (BR-001, BR-002...)", 1),
            // Day 10
            makeTimelineRow("10", "Continue BRD, complete all sections", "BRD (complete first draft)", "8 sections: Background, Objectives, Scope, Requirements...", 0),
            // Day 11-12
            makeTimelineRow("11-12", "Start User Stories + Acceptance Criteria (parallel with BRD review)", "User Stories + Acceptance Criteria", "Write US-001, then AC-001 to AC-005, then US-002...", 1),
            // Day 13
            makeTimelineRow("13", "Incorporate review feedback into all documents", "Updated BRD, US, AC", "Ramin: clarify requirements. Tural: add SMS. Aysel: make AC testable", 0),
            // Day 14
            makeTimelineRow("14", "Final review, hand off to development team", "All Phase 1 documents complete", "Sprint 1 starts next Monday", 1),
          ],
        }),

        spacer(200),

        // ─── Section H: Quick Memory Checklist ───
        h1("Part H: Quick Memory Checklist"),
        body("Use this checklist before and during the interview to quickly recall the most important points. Each item is a short reminder, not a full explanation. The detailed rules are in the sections above."),

        spacer(80),

        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 2, color: P.accent },
            bottom: { style: BorderStyle.SINGLE, size: 2, color: P.accent },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "E0E0E0" },
            insideVertical: { style: BorderStyle.NONE },
          },
          rows: [
            new TableRow({
              tableHeader: true,
              cantSplit: true,
              children: [
                new TableCell({
                  width: { size: 40, type: WidthType.PERCENTAGE },
                  shading: { type: ShadingType.CLEAR, fill: P.accent },
                  margins: { top: 80, bottom: 80, left: 120, right: 120 },
                  children: [new Paragraph({ children: [new TextRun({ text: "Topic", bold: true, size: 22, color: "FFFFFF", font: { ascii: "Calibri" } })] })],
                }),
                new TableCell({
                  width: { size: 60, type: WidthType.PERCENTAGE },
                  shading: { type: ShadingType.CLEAR, fill: P.accent },
                  margins: { top: 80, bottom: 80, left: 120, right: 120 },
                  children: [new Paragraph({ children: [new TextRun({ text: "Remember", bold: true, size: 22, color: "FFFFFF", font: { ascii: "Calibri" } })] })],
                }),
              ],
            }),
            ...[
              ["Interview Selection", "People at each process step + complaint listeners. Not everyone."],
              ["Interview Notes", "Only 3 things: process steps, business rules, pain points."],
              ["Current State", "Simple narrative with facts. Audience is business people."],
              ["Future State", "Combine stakeholder wishes + team input. Always say 'proposed.'"],
              ["Gaps", "One sentence each. Large enough to be a feature. 4-8 total."],
              ["BRD Detail", "3 questions per requirement: What? Who? Rule/Constraint?"],
              ["User Stories", "One story per user action. 2-4 stories per BRD requirement."],
              ["Acceptance Criteria", "Happy path + main errors + important edges. 4-7 per story."],
              ["Priority", "Three factors: dependency, business impact, complexity."],
              ["Quality Check", "3 checks: all gaps in BRD, all BR have US, all US have AC."],
              ["Parallel Work", "BRD leads by 1-2 requirements. US and AC follow closely behind."],
              ["Review Cycle", "Send to stakeholders + team. Update based on feedback. Repeat."],
            ].map((row, i) => makeChecklistRow(row[0], row[1], i)),
          ],
        }),
      ],
    },
  ],
});

function makeTimelineRow(day, activity, output, action, shadeIndex) {
  const fill = shadeIndex % 2 === 0 ? "FFFFFF" : P.surface;
  const makeCell = (text, width) => new TableCell({
    width: { size: width, type: WidthType.PERCENTAGE },
    shading: { type: ShadingType.CLEAR, fill },
    margins: { top: 60, bottom: 60, left: 120, right: 120 },
    children: [new Paragraph({
      spacing: { line: 312 },
      children: [new TextRun({ text, size: 21, color: P.body, font: { ascii: "Calibri" } })],
    })],
  });
  return new TableRow({
    cantSplit: true,
    children: [
      makeCell(day, 20),
      makeCell(activity, 30),
      makeCell(output, 25),
      makeCell(action, 25),
    ],
  });
}

function makeChecklistRow(topic, remember, index) {
  const fill = index % 2 === 0 ? "FFFFFF" : P.surface;
  const makeCell = (text, width, bold) => new TableCell({
    width: { size: width, type: WidthType.PERCENTAGE },
    shading: { type: ShadingType.CLEAR, fill },
    margins: { top: 60, bottom: 60, left: 120, right: 120 },
    children: [new Paragraph({
      spacing: { line: 312 },
      children: [new TextRun({ text, size: 21, color: P.body, font: { ascii: "Calibri" }, bold: !!bold })],
    })],
  });
  return new TableRow({
    cantSplit: true,
    children: [
      makeCell(topic, 40, true),
      makeCell(remember, 60, false),
    ],
  });
}

// ─── Generate ───
async function main() {
  const buffer = await Packer.toBuffer(doc);
  const outputPath = "/home/z/my-project/ba-practice/BA_Phase_1_Decision_Rules_Quick_Reference.docx";
  fs.writeFileSync(outputPath, buffer);
  console.log("Document generated: " + outputPath);
}
main().catch(console.error);
