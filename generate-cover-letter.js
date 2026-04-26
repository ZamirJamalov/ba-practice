const docx = require("docx");
const fs = require("fs");

const C = {
  deepSea: "1B3A5C", ocean: "2E86AB", accent: "1B6B93",
  dark: "0F2439", gray: "666666",
};

function txt(text, opts = {}) {
  return new docx.TextRun({ text, size: 22, color: C.dark, font: "Calibri", ...opts });
}
function p(text, opts = {}) {
  return new docx.Paragraph({ children: [txt(text, opts)], spacing: { after: 160, line: 312 } });
}

const c = [];

// ===== SENDER INFO (compact) =====
c.push(new docx.Paragraph({ children: [
  txt("Zamir Jamalov", { bold: true, size: 26, color: C.deepSea }),
], spacing: { after: 20 } }));
c.push(new docx.Paragraph({ children: [
  txt("Baku, Azerbaijan  |  +994 55 207 7228  |  jamalov.zamir@gmail.com", { size: 20, color: C.gray }),
], spacing: { after: 280 } }));

// ===== DATE =====
c.push(new docx.Paragraph({ children: [txt("April 26, 2026", { size: 20, color: C.gray })], spacing: { after: 280 } }));

// ===== RECIPIENT =====
c.push(p("Hiring Manager", { size: 20 }));
c.push(p("Kontakt Home", { bold: true, size: 20 }));
c.push(new docx.Paragraph({ spacing: { after: 280 }, children: [] }));

// ===== GREETING =====
c.push(p("Dear Hiring Manager,", { bold: true }));
c.push(new docx.Paragraph({ spacing: { after: 160 }, children: [] }));

// ===== PARAGRAPH 1: THE HOOK =====
c.push(p("When I walked into a Kontakt Home store last year and watched a customer spend twenty minutes at the return counter filling out paper forms while a queue grew behind them, I saw something I have spent my entire career solving: a process that desperately needs structure, digitization, and a human-centered redesign. That moment stayed with me, because I knew I had the exact skills to fix it. I am applying for the Business Analyst position at Kontakt Home because I want to turn moments like that into seamless digital experiences."));

// ===== PARAGRAPH 2: WHY ME (concise, not CV repeat) =====
c.push(p("I bring a unique combination to this role. For the past two years at Embafinans, I have been the person who sits between business teams and developers, translating ambitions into working software. I have mapped complex As-Is processes, authored BRDs and FRDs, designed API specifications, coordinated UAT cycles, and resolved stakeholder conflicts with data rather than opinions. Before transitioning to business analysis, I spent fifteen years building systems at the Central Bank of Azerbaijan, Unibank, and ASAN Service. This engineering foundation means I do not just document requirements; I understand the technical reality behind them, which allows me to write specifications that developers actually can build without ambiguity."));

// ===== PARAGRAPH 3: WHY KONTAKT HOME (motivation, domain fit) =====
c.push(p("Kontakt Home is at an inflection point. As Azerbaijan's largest electronics retailer, the company is moving from traditional retail operations toward a digital-first customer experience. That transition requires someone who understands both the retail mindset and the technology landscape. My experience spans fintech (Embafinans, where I digitized credit decision workflows), e-commerce loyalty systems (Birbonus, where I designed multi-partner reward ecosystems), and production systems operations (Umico, where I resolved live incidents). Every one of these experiences taught me how to align technology with real customer needs, which is exactly what Kontakt Home needs as it scales its digital operations."));

// ===== PARAGRAPH 4: CLOSING ENERGY =====
c.push(p("I am not just looking for a job. I am looking for a place where my work directly impacts thousands of customers every day. Kontakt Home, with its scale, ambition, and commitment to growth, is that place. I would welcome the opportunity to sit down with your team and discuss how I can contribute to building processes and products that your customers and employees will genuinely appreciate."));

c.push(new docx.Paragraph({ spacing: { after: 60 }, children: [] }));
c.push(p("Thank you for your time and consideration."));
c.push(new docx.Paragraph({ spacing: { after: 300 }, children: [] }));

// ===== SIGNATURE =====
c.push(new docx.Paragraph({ children: [txt("Yours sincerely,", { italics: true })], spacing: { after: 200 } }));
c.push(new docx.Paragraph({ children: [txt("Zamir Jamalov", { bold: true, size: 24, color: C.deepSea })], spacing: { after: 20 } }));

// ===== BUILD =====
async function main() {
  const doc = new docx.Document({
    sections: [{
      properties: {
        page: { margin: { top: 1080, bottom: 1080, left: 1260, right: 1260 } },
      },
      children: c,
    }],
  });

  const buffer = await docx.Packer.toBuffer(doc);
  const out = "/home/z/my-project/ba-practice/Zamir_Jamalov_Cover_Letter_Kontakt_Home.docx";
  fs.writeFileSync(out, buffer);
  console.log("Generated: " + out);
  console.log("Size: " + (buffer.length / 1024).toFixed(1) + " KB");
}

main().catch(err => { console.error(err); process.exit(1); });
