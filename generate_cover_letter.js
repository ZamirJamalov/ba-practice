const {
  Document, Packer, Paragraph, TextRun, AlignmentType,
} = require("docx");
const fs = require("fs");

// ─── Color Palette ───
const C = {
  name: "1A1A1A",
  body: "2C2C2C",
  accent: "1B4F72",
  secondary: "555555",
};

// ─── Content ───
const name = "Zamir Jamalov";
const contact = "Baku, Azerbaijan  |  +994 55 207 7228  |  jamalov.zamir@gmail.com";
const date = "April 27, 2026";

const salutation = "Dear HR Team,";

const para1 = "I am applying for the Business Analyst (E-Commerce) position at Kontakt Home. As Azerbaijan's leading home appliance retailer, Kontakt Home is at an exciting stage where digital transformation directly impacts customer experience and operational efficiency \u2014 and that is exactly where I want to contribute.";

const para2 = "My background is in fintech, not e-commerce, and I want to be upfront about that. However, the core BA skills your vacancy requires \u2014 BRD, FRD, BPMN process mapping, RICE backlog prioritization, REST API specification in OpenAPI 3.0, and UAT coordination \u2014 are the same tools I have used to deliver four production systems at Embafinans. Process digitization is domain-agnostic; the methodology does not change whether the process is a credit decision or a return management flow.";

const para3 = "What sets me apart is my fifteen years in software engineering before becoming a BA. This means I can evaluate technical trade-offs alongside developers, write SQL to validate data integrity, and define APIs that require zero rework. Concrete results: the credit scoring engine I documented reduced decision time by 50%, the digital sales channel I specified processes 300\u2013500 daily applications, and the delivery tracking dashboard I coordinated cut operational errors by half. My loyalty platform experience at Birbonus \u2014 managing cross-partner requirements across merchants, transactions, and settlements \u2014 is structurally close to the multi-stakeholder coordination that e-commerce demands.";

const para4 = "I would welcome the opportunity to discuss how I can contribute to Kontakt Home's digital goals. Thank you for your time.";

const closing = "Yours sincerely,";
const senderName = "Zamir Jamalov";

// ─── Build Document ───
const doc = new Document({
  styles: {
    default: {
      document: {
        run: {
          font: { ascii: "Calibri", eastAsia: "Calibri" },
          size: 22,
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
          margin: { top: 1200, bottom: 1200, left: 1500, right: 1500 },
        },
      },
      children: [
        // Name
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({ text: name, bold: true, size: 28, color: C.name, font: "Calibri" }),
          ],
        }),
        // Contact
        new Paragraph({
          spacing: { after: 300 },
          children: [
            new TextRun({ text: contact, size: 18, color: C.secondary, font: "Calibri" }),
          ],
        }),
        // Date - right aligned
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          spacing: { after: 200 },
          children: [
            new TextRun({ text: date, size: 22, color: C.body, font: "Calibri" }),
          ],
        }),
        // Addressee
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({ text: "HR Department", size: 22, color: C.body, font: "Calibri" }),
          ],
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun({ text: "Kontakt Home", size: 22, color: C.body, font: "Calibri" }),
          ],
        }),
        // Salutation
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun({ text: salutation, size: 22, color: C.body, font: "Calibri" }),
          ],
        }),
        // Paragraph 1 - Introduction + Why Kontakt Home
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200, line: 276 },
          children: [
            new TextRun({ text: para1, size: 22, color: C.body, font: "Calibri" }),
          ],
        }),
        // Paragraph 2 - Why I'm a good fit (domain-agnostic)
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200, line: 276 },
          children: [
            new TextRun({ text: para2, size: 22, color: C.body, font: "Calibri" }),
          ],
        }),
        // Paragraph 3 - Differentiator + results + Birbonus
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200, line: 276 },
          children: [
            new TextRun({ text: para3, size: 22, color: C.body, font: "Calibri" }),
          ],
        }),
        // Paragraph 4 - Closing
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 300, line: 276 },
          children: [
            new TextRun({ text: para4, size: 22, color: C.body, font: "Calibri" }),
          ],
        }),
        // Closing - right aligned
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          spacing: { after: 60 },
          children: [
            new TextRun({ text: closing, size: 22, color: C.body, font: "Calibri" }),
          ],
        }),
        // Sender name - right aligned
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [
            new TextRun({ text: senderName, bold: true, size: 22, color: C.name, font: "Calibri" }),
          ],
        }),
      ],
    },
  ],
});

// ─── Export ───
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(
    "/home/z/my-project/ba-practice/Zamir_Jamalov_Cover_Letter_Kontakt_Home.docx",
    buffer
  );
  console.log("Cover letter V6 generated successfully!");
});
