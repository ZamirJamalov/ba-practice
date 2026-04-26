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

// === PARAGRAPH 1: OPENING (attention-grabbing + position) ===
c.push(p("As an IT Business Analyst with a track record of delivering four production systems at Embafinans and designing a multi-partner loyalty platform at Birbonus, I am writing to express my interest in the Business Analyst position at Kontakt Home. What draws me to your company is the scale of your operations across physical retail and e-commerce, and the complexity this creates for process optimization, cross-departmental coordination, and technology-driven decision-making. This is the type of challenge my background was built for."));

// === PARAGRAPH 2: YOUR VALUE (evidence-based, measurable) ===
c.push(p("At Embafinans, I was responsible for the full delivery cycle from stakeholder interviews through UAT sign-off. The results were measurable: a BNPL credit scoring engine that reduced decision time by 50%, a digital sales channel processing 300 to 500 daily applications, and a loan delivery tracking dashboard that cut operational errors by half. Each of these required structured process analysis, formal requirements documentation (BRD, FRD, SRS), API specification in OpenAPI 3.0, and backlog prioritization using the RICE framework. At Birbonus, I translated multi-stakeholder business rules into a working loyalty system across partner merchants. These experiences taught me how to operate in environments where business goals, customer experience, and technical constraints must be balanced simultaneously, a dynamic that is central to any large-scale retail operation."));

// === PARAGRAPH 3: FIT (why them specifically + differentiator) ===
c.push(p("Kontakt Home is not just a retailer; it is a technology-enabled business where every process improvement directly affects customer satisfaction and operational cost. My fifteen-year engineering background at the Central Bank of Azerbaijan, Unibank, and ASAN Service gives me an additional advantage: I can assess technical feasibility during requirements workshops and write specifications that development teams implement without ambiguity. This reduces the cycle from idea to delivery and minimizes the rework that often results from unclear requirements."));

// === PARAGRAPH 4: CALL TO ACTION ===
c.push(p("I would welcome the opportunity to discuss how my experience can contribute to Kontakt Home. Please find my CV attached for detailed information. Thank you for your time and consideration."));
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
  const words = c.flatMap(x => x.root ? [] : []).length;
  console.log("OK: " + out + " (" + (buf.length / 1024).toFixed(1) + " KB)");
}
main().catch(e => { console.error(e); process.exit(1); });
