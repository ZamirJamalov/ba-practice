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
c.push(p("Hiring Manager", { size: 20 }));
c.push(p("Kontakt Home", { bold: true, size: 20 }));
c.push(empty());

// Greeting
c.push(p("Dear Hiring Manager,", { bold: true }));
c.push(empty());

// Opening — specific, not generic
c.push(p("I am applying for the Business Analyst position at Kontakt Home. With two years of focused BA experience in fintech and e-commerce, backed by fifteen years in software engineering across Azerbaijan's banking and public sector, I offer a strong mix of analytical skills and technical depth that fits well with the demands of a large-scale retail technology environment."));

// Why You — facts from CV, impact-focused, not bullet copy
c.push(p("At Embafinans, I delivered four production systems from requirements discovery through UAT sign-off: a BNPL credit scoring engine that cut decision time by half, a B2C sales channel processing 300 to 500 daily applications, a real-time loan delivery tracking dashboard, and an end-to-end credit lifecycle platform. In each case, my role covered the full spectrum: stakeholder interviews, As-Is/To-Be process mapping, BRD/FRD/SRS authoring, API specification in OpenAPI 3.0, backlog prioritization with RICE, and UAT coordination with business users. Prior to this, at Birbonus I designed a multi-partner loyalty system, which gave me direct experience with the kind of cross-merchant workflows and customer reward logic that retail platforms rely on. My earlier engineering career at the Central Bank of Azerbaijan, Unibank, and ASAN Service means I can evaluate technical feasibility during requirements workshops and write specifications that development teams can implement without ambiguity."));

// Why Them — real knowledge, no fabricated stories
c.push(p("Kontakt Home is Azerbaijan's leading electronics retailer with a significant physical and digital presence. Scaling operations across multiple stores while improving the online customer experience requires disciplined process analysis, clear technical documentation, and someone who can align business goals with delivery teams. My experience in both fintech process digitization and e-commerce platform development maps directly to these needs. I am confident I can add value from day one."));

// Call to action
c.push(p("I would welcome the opportunity to discuss how my background and skills align with your team's priorities. Thank you for your consideration."));
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
