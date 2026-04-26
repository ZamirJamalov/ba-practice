const {
  Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle,
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

const para1 = "I am applying for the Business Analyst (E-Commerce) position at Kontakt Home. My background is in fintech and payment systems, not e-commerce, and I want to be upfront about that. However, the skills your vacancy requires \u2014 gathering requirements, mapping As-Is and To-Be processes in BPMN, writing BRDs, FRDs, user stories with acceptance criteria, prioritizing backlogs using RICE, defining REST APIs in OpenAPI 3.0, and coordinating UAT through sign-off \u2014 are exactly what I have been doing at Embafinans for the past two years across four production projects. Process digitization is domain-agnostic; the methodology remains the same whether the subject is a credit decision workflow or a return management flow.";

const para2 = "What I believe sets me apart from other BA candidates is my fifteen-year prior career in software engineering at the Central Bank of Azerbaijan, Unibank, and ASAN Service. This is not just a line on my CV. It means that when I sit in an architecture discussion, I can evaluate frontend, backend, and database trade-offs alongside the development team rather than relying on them to translate my requirements into technical decisions. At Embafinans, this allowed me to define API specifications that developers implemented without rework, write SQL queries to validate data integrity and resolve stakeholder disagreements with evidence, and create sequence and ER diagrams in Confluence that served as the single source of truth for cross-functional teams. The BNPL credit scoring engine I documented reduced decision time by 50%, the digital sales channel I specified processes 300 to 500 daily applications, and the delivery tracking dashboard I coordinated cut operational errors in half.";

const para3 = "My experience at Birbonus is the closest I have to e-commerce. I designed a customer loyalty system that operated across multiple partner merchants, which required defining earning rules, eligibility criteria, and settlement workflows while balancing the interests of different business stakeholders. Managing cross-partner requirements in a platform where customer transactions, merchant operations, and financial settlements intersect is structurally similar to the coordination between product, operations, and marketing teams that your vacancy describes.";

const para4 = "I understand that switching from fintech to e-commerce requires learning the specifics of your business, and I am prepared to invest that effort. I would welcome the opportunity to discuss this further. Thank you for your time.";

const closing = "Yours sincerely,";
const senderName = "Zamir Jamalov";

// ─── Build Document ───
const doc = new Document({
  styles: {
    default: {
      document: {
        run: {
          font: { ascii: "Calibri", eastAsia: "Calibri" },
          size: 22, // 11pt
          color: C.body,
        },
        paragraph: {
          spacing: { line: 276 }, // 1.15x - compact for cover letter
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
            new TextRun({
              text: name,
              bold: true,
              size: 28, // 14pt
              color: C.name,
              font: "Calibri",
            }),
          ],
        }),
        // Contact
        new Paragraph({
          spacing: { after: 300 },
          children: [
            new TextRun({
              text: contact,
              size: 18, // 9pt
              color: C.secondary,
              font: "Calibri",
            }),
          ],
        }),
        // Date - right aligned
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: date,
              size: 22,
              color: C.body,
              font: "Calibri",
            }),
          ],
        }),
        // Addressee
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({
              text: "HR Department",
              size: 22,
              color: C.body,
              font: "Calibri",
            }),
          ],
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: "Kontakt Home",
              size: 22,
              color: C.body,
              font: "Calibri",
            }),
          ],
        }),
        // Salutation
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: salutation,
              size: 22,
              color: C.body,
              font: "Calibri",
            }),
          ],
        }),
        // Paragraph 1
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200, line: 276 },
          children: [
            new TextRun({
              text: para1,
              size: 22,
              color: C.body,
              font: "Calibri",
            }),
          ],
        }),
        // Paragraph 2
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200, line: 276 },
          children: [
            new TextRun({
              text: para2,
              size: 22,
              color: C.body,
              font: "Calibri",
            }),
          ],
        }),
        // Paragraph 3
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200, line: 276 },
          children: [
            new TextRun({
              text: para3,
              size: 22,
              color: C.body,
              font: "Calibri",
            }),
          ],
        }),
        // Paragraph 4
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 300, line: 276 },
          children: [
            new TextRun({
              text: para4,
              size: 22,
              color: C.body,
              font: "Calibri",
            }),
          ],
        }),
        // Closing - right aligned
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          spacing: { after: 60 },
          children: [
            new TextRun({
              text: closing,
              size: 22,
              color: C.body,
              font: "Calibri",
            }),
          ],
        }),
        // Sender name - right aligned
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          spacing: { after: 0 },
          children: [
            new TextRun({
              text: senderName,
              bold: true,
              size: 22,
              color: C.name,
              font: "Calibri",
            }),
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
  console.log("Cover letter generated successfully!");
});
