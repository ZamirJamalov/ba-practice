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

// === PARAGRAPH 1: OPENING ===
c.push(p("I am applying for the Business Analyst (E-Commerce) position at Kontakt Home. Over the past two years at Embafinans, I have been delivering production systems that follow the exact workflow your vacancy describes: gathering business requirements, documenting them in BRD and FRD format, analyzing As-Is processes, designing To-Be models in BPMN, and writing user stories with acceptance criteria through to UAT sign-off. This is the cycle I have repeated across four projects, each with measurable results."));

// === PARAGRAPH 2: SPECIFIC RESULTS + VACANCY SKILLS ===
c.push(p("The core of this role, as I understand it, is translating business needs into specifications that development teams can build without ambiguity. At Embafinans, I did precisely that: I defined REST API specifications in OpenAPI 3.0, created sequence and ER diagrams in Confluence, wrote SQL queries to validate data and resolve conflicting stakeholder priorities, and participated in architecture discussions where my engineering background allowed me to evaluate frontend, backend, and database options with the development team. These were not theoretical exercises; the BNPL credit scoring engine I documented reduced decision time by 50%, the digital sales channel I specified now processes 300 to 500 daily applications, and the delivery tracking dashboard I coordinated cut operational errors in half."));

// === PARAGRAPH 3: CROSS-FUNCTIONAL + RETAIL RELEVANCE ===
c.push(p("Your vacancy also emphasizes collaboration with product, operations, and marketing teams. At Embafinans, my daily work involved coordinating across risk, sales, and operations departments to align requirements. At Birbonus, I designed a loyalty system that required managing requirements from multiple partner merchants simultaneously, defining earning rules, eligibility criteria, and settlement workflows. This experience of balancing diverse stakeholder interests and translating them into structured documentation is directly applicable to an e-commerce environment where product, operations, and marketing priorities frequently intersect."));

// === PARAGRAPH 4: CALL TO ACTION ===
c.push(p("I would welcome the opportunity to discuss how my skills and experience match your team's needs. Thank you for your consideration."));
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
