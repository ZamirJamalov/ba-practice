const { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle, TabStopType } = require("docx");
const fs = require("fs");

const C = {
  body: "2C3E50",
  dark: "1A2636",
  accent: "2E86C1",
  sec: "6B8599",
};

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: { ascii: "Calibri" }, size: 22, color: C.body },
        paragraph: { spacing: { line: 312 } },
      },
    },
  },
  sections: [
    {
      properties: {
        page: {
          margin: { top: 1200, bottom: 1200, left: 1200, right: 1200 },
          size: { width: 11906, height: 16838 },
        },
      },
      children: [
        // ─── Header ───
        new Paragraph({
          spacing: { after: 0, line: 276 },
          children: [
            new TextRun({ text: "ZAMIR JAMALOV", size: 28, bold: true, color: C.dark, font: "Calibri" }),
          ],
        }),
        new Paragraph({
          spacing: { after: 20, line: 260 },
          children: [
            new TextRun({ text: "+994 55 207 7228  |  jamalov.zamir@gmail.com  |  Baku, Azerbaijan", size: 18, color: C.sec, font: "Calibri" }),
          ],
        }),
        new Paragraph({ spacing: { after: 200 }, children: [] }),

        // ─── Date ───
        new Paragraph({
          spacing: { after: 200, line: 276 },
          children: [new TextRun({ text: "May 6, 2026", size: 22, color: C.body, font: "Calibri" })],
        }),

        // ─── Recipient ───
        new Paragraph({
          spacing: { after: 20, line: 276 },
          children: [new TextRun({ text: "Hiring Manager", size: 22, color: C.body, font: "Calibri" })],
        }),
        new Paragraph({
          spacing: { after: 20, line: 276 },
          children: [new TextRun({ text: "Innovation and Digital Development Agency", size: 22, color: C.body, font: "Calibri" })],
        }),
        new Paragraph({
          spacing: { after: 300, line: 276 },
          children: [new TextRun({ text: "Baku, Azerbaijan", size: 22, color: C.body, font: "Calibri" })],
        }),

        // ─── Subject ───
        new Paragraph({
          spacing: { after: 300, line: 276 },
          children: [
            new TextRun({ text: "Subject: ", size: 22, bold: true, color: C.dark, font: "Calibri" }),
            new TextRun({ text: "Application for Senior Business Analyst / Lead Specialist Position", size: 22, color: C.body, font: "Calibri" }),
          ],
        }),

        // ─── Salutation ───
        new Paragraph({
          spacing: { after: 200, line: 312 },
          children: [new TextRun({ text: "Dear Hiring Manager,", size: 22, color: C.body, font: "Calibri" })],
        }),

        // ─── Body Paragraphs ───
        new Paragraph({
          spacing: { after: 180, line: 312 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun({
              text: "I am writing to express my strong interest in the Senior Business Analyst / Lead Specialist position at the Innovation and Digital Development Agency. With over 18 years in IT, including 4+ years in business analysis and significant experience working within Azerbaijan's government sector, I believe my background aligns closely with the Agency's mission to digitize and transform public services.",
              size: 22, color: C.body, font: "Calibri",
            }),
          ],
        }),

        new Paragraph({
          spacing: { after: 180, line: 312 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun({
              text: "My career has been shaped by a consistent theme: bridging the gap between government institutions and technology. At the Central Bank of Azerbaijan, I led the technical integration of 10+ government organizations into the Government Payment Portal (GPP), which required me to define data exchange specifications, coordinate with multiple agencies, and develop middleware for cross-system communication at national scale. This experience gave me firsthand understanding of how government systems interact, where integration challenges arise, and how to resolve them through structured analysis and clear documentation.",
              size: 22, color: C.body, font: "Calibri",
            }),
          ],
        }),

        new Paragraph({
          spacing: { after: 180, line: 312 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun({
              text: "At the State Employment Agency, I led the Innovation Department and served as Business Analyst for the EMAS (Employment Management Automation System) project. I worked with a 15-member project team, authored requirements documentation, and coordinated with technical teams during the initial system development phase. Beyond traditional BA responsibilities, I designed a Telegram-based citizen service channel that enabled real-time application submission and response processing, directly improving service accessibility for citizens. I also developed a real-time web-based monitoring dashboard for the management board, which provided transparent tracking of citizen applications, response times, and service delivery performance metrics. These initiatives gave me practical experience in user-centered service design, SLA/KPI monitoring, and the end-to-end approach to digital government services that your Agency champions.",
              size: 22, color: C.body, font: "Calibri",
            }),
          ],
        }),

        new Paragraph({
          spacing: { after: 180, line: 312 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun({
              text: "In my current role at Embafinans, I lead business analysis for fintech products, authoring BRDs, FRDs, and SRS documents, writing User Stories with Gherkin Acceptance Criteria, and defining REST API specifications in Swagger/OpenAPI 3.0. I have hands-on experience with BPMN process modeling (As-Is / To-Be), sequence diagrams, backlog prioritization using the RICE framework, and UAT coordination with business stakeholders. I also bring 10+ years of software engineering background, which enables me to translate business needs into precise technical specifications and communicate effectively with development teams.",
              size: 22, color: C.body, font: "Calibri",
            }),
          ],
        }),

        new Paragraph({
          spacing: { after: 180, line: 312 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun({
              text: "What draws me most to this position is the Agency's focus on life-event-based service design, end-to-end process architecture, and multi-agency coordination. These are not abstract concepts for me. I have lived them through the GPP multi-agency integration, the EMAS employment service digitization, and the citizen-facing Telegram channel. I understand how government institutions operate, how to engage stakeholders across different agencies, and how to design services that put citizens at the center while satisfying institutional requirements.",
              size: 22, color: C.body, font: "Calibri",
            }),
          ],
        }),

        new Paragraph({
          spacing: { after: 180, line: 312 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun({
              text: "I am confident that my combination of business analysis methodology, government sector experience, and technical background would enable me to contribute meaningfully to the Agency's digital transformation initiatives from day one. I would welcome the opportunity to discuss how my experience and skills can support the Agency's goals.",
              size: 22, color: C.body, font: "Calibri",
            }),
          ],
        }),

        // ─── Closing ───
        new Paragraph({
          spacing: { before: 200, after: 100, line: 312 },
          children: [new TextRun({ text: "Sincerely,", size: 22, color: C.body, font: "Calibri" })],
        }),
        new Paragraph({
          spacing: { before: 300, after: 0, line: 276 },
          children: [new TextRun({ text: "Zamir Jamalov", size: 22, bold: true, color: C.dark, font: "Calibri" })],
        }),
      ],
    },
  ],
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("Zamir_Jamalov_Cover_Letter_Innovation_Agency.docx", buf);
  console.log("Cover Letter generated successfully!");
});
