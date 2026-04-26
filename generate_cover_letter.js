const {
  Document, Packer, Paragraph, TextRun, AlignmentType,
} = require("docx");
const fs = require("fs");

const C = { name: "1A1A1A", body: "2C2C2C", secondary: "555555" };

const name = "Zamir Jamalov";
const contact = "Baku, Azerbaijan  |  +994 55 207 7228  |  jamalov.zamir@gmail.com";
const date = "April 27, 2026";
const salutation = "Dear HR Team,";

const para1 = "I am applying for the Business Analyst (E-Commerce) position at Kontakt Home. As the leading home appliance retailer in Azerbaijan, Kontakt Home is growing fast in digital, and I would like to contribute to that growth with my experience.";

const para2 = "As a Business Analyst, I worked at Embafinans for one year, delivering four production projects, and before that at Birbonus, where I designed the payment and refund flow with bonuses. In both roles, I worked closely with developers, testers, and business teams, managing the full project cycle from the first analysis to release and ongoing monitoring. Together with these teams, we achieved concrete results: the credit scoring system now makes lending decisions 50% faster, the digital sales channel handles 300 to 500 loan applications every day, and the delivery tracking dashboard cut operational mistakes by half.";

const para3 = "Before becoming a BA, I worked as a software engineer on large projects like the Government Payment Portal and MobilBank. That experience taught me how to build reliable systems, work with large teams, and document processes clearly, skills that I now use every day. It also gave me a deep understanding of omnichannel solutions and payment gateways from the inside.";

const para4 = "I would be happy to share more about my experience and skills in an interview.";

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
  console.log("V16 cover letter generated!");
});
