const docx = require("docx");
const fs = require("fs");

const C = { deepSea: "1B3A5C", ocean: "2E86AB", dark: "0F2439", gray: "666666" };

function txt(t, o = {}) { return new docx.TextRun({ text: t, size: 22, color: C.dark, font: "Calibri", ...o }); }
function p(t, o = {}) { return new docx.Paragraph({ children: [txt(t, o)], spacing: { after: 160, line: 312 } }); }
function empty() { return new docx.Paragraph({ spacing: { after: 100 }, children: [] }); }

const c = [];

// Header
c.push(new docx.Paragraph({ children: [txt("Zamir Jamalov", { bold: true, size: 26, color: C.deepSea })], spacing: { after: 20 } }));
c.push(new docx.Paragraph({ children: [txt("Baku, Azerbaijan  |  +994 55 207 7228  |  jamalov.zamir@gmail.com", { size: 20, color: C.gray })], spacing: { after: 300 } }));

// Date + Recipient
c.push(p("April 26, 2026", { size: 20, color: C.gray }));
c.push(empty());
c.push(p("HR Department", { size: 20 }));
c.push(p("Business Development Directorate", { bold: true, size: 20 }));
c.push(p("Kontakt Home", { bold: true, size: 20 }));
c.push(empty());

// Greeting
c.push(p("Dear HR Team,", { bold: true }));
c.push(empty());

// Opening — directly states role + department
c.push(p("I would like to submit my candidacy for the Business Analyst position within the Business Development department at Kontakt Home. I believe my professional background aligns well with the responsibilities of this role, and I would like to briefly outline why."));

// Para 2 — Business Development context
c.push(p("A Business Analyst in a Business Development department sits at the intersection of company strategy and operational execution. The role requires understanding business goals, analyzing processes, identifying inefficiencies, proposing solutions, and working with cross-functional teams to implement changes. Over the past two years at Embafinans, this is exactly what I have been doing in practice: conducting stakeholder interviews across risk, sales, and operations departments; mapping As-Is processes and designing To-Be workflows; authoring formal requirements documentation (BRD, FRD, SRS); defining API specifications for development teams; prioritizing work using the RICE framework; and coordinating UAT cycles with business users until sign-off. These are the core deliverables that a Business Development function relies on to make informed decisions and drive projects forward."));

// Para 3 — Specific results + retail relevance
c.push(p("The systems I delivered at Embafinans had measurable outcomes: a credit scoring engine that reduced decision time by 50%, a digital sales channel handling 300-500 daily applications, and a real-time delivery tracking dashboard that cut error rates in half. At Birbonus, I designed a customer loyalty system operating across multiple partner merchants, which required defining reward rules, eligibility criteria, and settlement workflows. This experience is directly relevant to a retail context where customer-facing processes, partner coordination, and operational efficiency are daily priorities."));

// Para 4 — Engineering edge as differentiator (short)
c.push(p("Additionally, my fifteen-year background in software engineering at the Central Bank of Azerbaijan, Unibank, and ASAN Service allows me to evaluate technical feasibility during requirements discussions and produce specifications that development teams can implement without ambiguity. This reduces the communication gap between business and IT, which is a common source of project delays."));

// Para 5 — Call to action
c.push(p("I would be glad to discuss my candidacy in more detail at your convenience. Thank you for reviewing my application."));
c.push(empty());

// Signature
c.push(p("Yours sincerely,", { italics: true }));
c.push(new docx.Paragraph({ spacing: { after: 200 }, children: [] }));
c.push(new docx.Paragraph({ children: [txt("Zamir Jamalov", { bold: true, size: 24, color: C.deepSea })], spacing: { after: 20 } }));

// Build
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
