const {
  Document, Packer, Paragraph, TextRun,
} = require("docx");
const fs = require("fs");

const C = { q: "1A1A1A", a: "2C2C2C", label: "777777" };

// ─── Q&A Data ───
const qaEntries = [
  {
    question: "What personal qualities do you need to become a professional Business Analyst and prepare BA documents like these?",
    answer: `I think there are six important qualities.

First, you need to be curious. A Business Analyst always asks "why?" and "how?" because understanding the real problem is more important than writing documents. If you do not understand the business, your documents will be wrong.

Second, you need to be a good listener. Most of my time goes to talking with people: business owners, developers, testers, and managers. Each of them has different needs, and you need to listen carefully to understand what they really want.

Third, you need to think in a structured way. A BRD document, for example, has many sections: business goals, stakeholders, scope, requirements, and acceptance criteria. You need to organize information in a clear and logical order.

Fourth, you need attention to detail. One missing requirement or one unclear acceptance criterion can cause big problems in development. So you need to check your work many times.

Fifth, you need patience. Writing a good BRD or FRD takes time. You write, you review, you get feedback, and you rewrite. Sometimes you need five or six versions before the document is ready.

And sixth, you need to be able to explain complex things in simple words. Not everyone is technical, so you need to write in a way that a business person can understand and a developer can follow.`
  },
  {
    question: "What do you need to know to explain complex things in simple words?",
    answer: `For me, there are three things.

First, you need to understand the business yourself before you write anything. For example, when I wrote the BRD for the Return Management System, I first needed to understand how product returns work in a store: what happens when a customer brings a product back, who checks it, who decides if it can be resold, and how the money goes back to the customer. If you do not understand the real process, you cannot explain it simply.

Second, you need to know your audience. A business manager does not care about API endpoints or database tables. They care about: does this solve my problem? How long will it take? How much will it cost? But a developer does not care about business goals. They need to know: what should I build? What are the rules? What happens if something goes wrong? So you need to write the same thing in two different ways.

Third, you need to know how to use examples and pictures. Instead of writing a long paragraph about how a return works, you can draw a simple flowchart: customer brings product, store checks it, system creates return request, warehouse receives it, system updates inventory. One picture is better than ten paragraphs.`
  },
];

// ─── Build Document ───
const children = [
  new Paragraph({ spacing: { after: 200 }, children: [
    new TextRun({ text: "Interview Practice: BA Portfolio Q&A", bold: true, size: 28, color: C.q, font: "Calibri" }),
  ]}),
  new Paragraph({ spacing: { after: 400 }, children: [
    new TextRun({ text: "Kontakt Home - Return Management System Documents", size: 20, color: C.label, font: "Calibri" }),
  ]}),
];

qaEntries.forEach((entry, i) => {
  // Question
  children.push(
    new Paragraph({ spacing: { before: 300, after: 100 }, borders: { bottom: { style: "single", size: 1, color: "DDDDDD" } }, children: [
      new TextRun({ text: `Q${i + 1}`, bold: true, size: 22, color: C.q, font: "Calibri" }),
      new TextRun({ text: `  ${entry.question}`, size: 22, color: C.q, font: "Calibri" }),
    ]})
  );
  // Answer
  const lines = entry.answer.trim().split("\n\n");
  lines.forEach(line => {
    children.push(
      new Paragraph({ spacing: { after: 120, line: 276 }, children: [
        new TextRun({ text: line.trim(), size: 22, color: C.a, font: "Calibri" }),
      ]})
    );
  });
});

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: { ascii: "Calibri", eastAsia: "Calibri" }, size: 22, color: C.a },
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
    children,
  }],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("/home/z/my-project/ba-practice/Interview_Practice_BA_Portfolio_QA.docx", buffer);
  console.log("Q&A document updated!");
});
