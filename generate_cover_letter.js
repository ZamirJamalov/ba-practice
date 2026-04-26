const {
  Document, Packer, Paragraph, TextRun, AlignmentType,
} = require("docx");
const fs = require("fs");

const C = { name: "1A1A1A", body: "2C2C2C", secondary: "555555" };

const name = "Zamir Jamalov";
const contact = "Baku, Azerbaijan  |  +994 55 207 7228  |  jamalov.zamir@gmail.com";
const date = "April 27, 2026";
const salutation = "Dear HR Team,";

const para1 = "I am applying for the Business Analyst (E-Commerce) position at Kontakt Home. The way you are growing your online sales and connecting the store experience with digital channels makes this role very interesting to me.";

const para2 = "For the past year at Embafinans, I have been working as a Business Analyst, turning business needs into clear requirements for developers. In my previous banking experience, I also worked with payment gateways and omnichannel solutions, where customers could start a process on one channel and continue on another. These experiences are directly connected to e-commerce.";

const para3 = "My software engineering background helps me write requirements that developers understand without extra questions. At Embafinans, I reached concrete results: the credit scoring system I documented became 50% faster, the digital sales channel I specified handles 300 to 500 applications every day, and the delivery tracking dashboard I coordinated cut mistakes by half. At Birbonus, I managed requirements for many partner companies where customers, merchants, and payments all had to work together, and this is the same kind of coordination that e-commerce needs.";

const para4 = "I would be happy to talk about how I can help Kontakt Home. Thank you for your time.";

const closing = "Yours sincerely,";
const senderName = "Zamir Jamalov";

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: { ascii: "Calibri", eastAsia: "Calibri" }, size: 22, color: C.body },
        paragraph: { spacing: { line: 276 } },
      },
    },
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1200, bottom: 1200, left: 1500, right: 1500 },
      },
    },
    children: [
      new Paragraph({ spacing: { after: 60 }, children: [
        new TextRun({ text: name, bold: true, size: 28, color: C.name, font: "Calibri" }),
      ]}),
      new Paragraph({ spacing: { after: 300 }, children: [
        new TextRun({ text: contact, size: 18, color: C.secondary, font: "Calibri" }),
      ]}),
      new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 200 }, children: [
        new TextRun({ text: date, size: 22, color: C.body, font: "Calibri" }),
      ]}),
      new Paragraph({ spacing: { after: 60 }, children: [
        new TextRun({ text: "HR Department", size: 22, color: C.body, font: "Calibri" }),
      ]}),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun({ text: "Kontakt Home", size: 22, color: C.body, font: "Calibri" }),
      ]}),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun({ text: salutation, size: 22, color: C.body, font: "Calibri" }),
      ]}),
      new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 200, line: 276 }, children: [
        new TextRun({ text: para1, size: 22, color: C.body, font: "Calibri" }),
      ]}),
      new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 200, line: 276 }, children: [
        new TextRun({ text: para2, size: 22, color: C.body, font: "Calibri" }),
      ]}),
      new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 200, line: 276 }, children: [
        new TextRun({ text: para3, size: 22, color: C.body, font: "Calibri" }),
      ]}),
      new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 300, line: 276 }, children: [
        new TextRun({ text: para4, size: 22, color: C.body, font: "Calibri" }),
      ]}),
      new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 60 }, children: [
        new TextRun({ text: closing, size: 22, color: C.body, font: "Calibri" }),
      ]}),
      new Paragraph({ alignment: AlignmentType.RIGHT, children: [
        new TextRun({ text: senderName, bold: true, size: 22, color: C.name, font: "Calibri" }),
      ]}),
    ],
  }],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("/home/z/my-project/ba-practice/Zamir_Jamalov_Cover_Letter_Kontakt_Home.docx", buffer);
  console.log("V9 cover letter generated!");
});
