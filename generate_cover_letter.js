const {
  Document, Packer, Paragraph, TextRun, AlignmentType,
} = require("docx");
const fs = require("fs");

const C = { name: "1A1A1A", body: "2C2C2C", secondary: "555555" };

const name = "Zamir Jamalov";
const contact = "Baku, Azerbaijan  |  +994 55 207 7228  |  jamalov.zamir@gmail.com";
const date = "April 27, 2026";
const salutation = "Dear HR Team,";

const para1 = "I am applying for the Business Analyst (E-Commerce) position at Kontakt Home. As the leading home appliance retailer in Azerbaijan, Kontakt Home is growing fast in digital, and I would like to be part of that growth.";

const para2 = "My background is in fintech, not e-commerce, and I want to be honest about that. But the job of a Business Analyst is to understand business needs and turn them into clear documents for developers, and that is exactly what I have been doing for two years at Embafinans across four real projects. The way of working does not change from one industry to another.";

const para3 = "Before becoming a BA, I worked as a software engineer for fifteen years at the Central Bank of Azerbaijan, Unibank, and ASAN Service. This background helps me write requirements that developers understand without extra questions. Some results from my work: one system became 50% faster after my documentation, another one handles 300 to 500 requests every day, and a third one cut mistakes by half. Also, at Birbonus I worked with many partner companies at the same time, and I believe this is very similar to e-commerce, where product, operations, and marketing teams need to work together closely.";

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
  console.log("V7 cover letter generated!");
});
