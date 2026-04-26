const docx = require("docx");
const fs = require("fs");

const C = { deepSea: "1B3A5C", dark: "0F2439", gray: "666666" };

function txt(t, o = {}) { return new docx.TextRun({ text: t, size: 22, color: C.dark, font: "Calibri", ...o }); }
function p(t, o = {}) { return new docx.Paragraph({ children: [txt(t, o)], spacing: { after: 160, line: 312 } }); }
function empty() { return new docx.Paragraph({ spacing: { after: 100 }, children: [] }); }

const c = [];

// === HEADER ===
c.push(new docx.Paragraph({ children: [txt("Zamir Jamalov", { bold: true, size: 26, color: C.deepSea })], spacing: { after: 20 } }));
c.push(new docx.Paragraph({ children: [txt("Baku, Azerbaijan  |  +994 55 207 7228  |  jamalov.zamir@gmail.com", { size: 20, color: C.gray })], spacing: { after: 300 } }));

c.push(p("April 26, 2026", { size: 20, color: C.gray }));
c.push(empty());
c.push(p("HR Department"));
c.push(p("Kontakt Home", { bold: true }));
c.push(empty());

c.push(p("Dear HR Team,", { bold: true }));
c.push(empty());

// === PARAGRAPH 1: HONEST OPENING ===
c.push(p("I am applying for the Business Analyst (E-Commerce) position at Kontakt Home. My background is in fintech and payment systems, not e-commerce, and I want to be upfront about that. However, the skills your vacancy requires, gathering requirements, mapping As-Is and To-Be processes in BPMN, writing BRDs, FRDs, user stories with acceptance criteria, prioritizing backlogs using RICE, defining REST APIs in OpenAPI 3.0, and coordinating UAT through sign-off, are exactly what I have been doing at Embafinans for the past two years across four production projects. Process digitization is domain-agnostic; the methodology remains the same whether the subject is a credit decision workflow or a return management flow."));

// === PARAGRAPH 2: ENGINEERING EDGE AS REAL DIFFERENTIATOR ===
c.push(p("What I believe sets me apart from other BA candidates is my fifteen-year prior career in software engineering at the Central Bank of Azerbaijan, Unibank, and ASAN Service. This is not just a line on my CV. It means that when I sit in an architecture discussion, I can evaluate frontend, backend, and database trade-offs alongside the development team rather than relying on them to translate my requirements into technical decisions. At Embafinans, this allowed me to define API specifications that developers implemented without rework, write SQL queries to validate data integrity and resolve stakeholder disagreements with evidence, and create sequence and ER diagrams in Confluence that served as the single source of truth for cross-functional teams. The BNPL credit scoring engine I documented reduced decision time by 50%, the digital sales channel I specified processes 300 to 500 daily applications, and the delivery tracking dashboard I coordinated cut operational errors in half."));

// === PARAGRAPH 3: BIRBONUS AS CLOSEST TO E-COMMERCE ===
c.push(p("My experience at Birbonus is the closest I have to e-commerce. I designed a customer loyalty system that operated across multiple partner merchants, which required defining earning rules, eligibility criteria, and settlement workflows while balancing the interests of different business stakeholders. Managing cross-partner requirements in a platform where customer transactions, merchant operations, and financial settlements intersect is structurally similar to the coordination between product, operations, and marketing teams that your vacancy describes."));

// === PARAGRAPH 4: CALL TO ACTION ===
c.push(p("I understand that switching from fintech to e-commerce requires learning the specifics of your business, and I am prepared to invest that effort. I would welcome the opportunity to discuss this further. Thank you for your time."));
c.push(empty());

// === SIGNATURE ===
c.push(p("Yours sincerely,", { italics: true }));
c.push(new docx.Paragraph({ spacing: { after: 200 }, children: [] }));
c.push(new docx.Paragraph({ children: [txt("Zamir Jamalov", { bold: true, size: 24, color: C.deepSea })], spacing: { after: 20 } }));

// === BUILD ===
async function main() {
  const doc = new docx.Document({
    sections: [{
      properties: { page: { margin: { top: 1080, bottom: 1080, left: 1260, right: 1260 } } },
      children: c,
    }],
  });
  const buf = await docx.Packer.toBuffer(doc);
  const out = "/home/z/my-project/ba-practice/Zamir_Jamalov_Cover_Letter_Kontakt_Home.docx";
  fs.writeFileSync(out, buf);
  console.log("OK: " + out + " (" + (buf.length / 1024).toFixed(1) + " KB)");
}
main().catch(e => { console.error(e); process.exit(1); });
