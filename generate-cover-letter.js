const docx = require("docx");
const fs = require("fs");

const COLORS = {
  deepSea: "1B3A5C", ocean: "2E86AB", sky: "A3CEF1", light: "E8F4F8",
  white: "FFFFFF", dark: "0F2439", gray: "666666", lightGray: "F5F5F5",
  accent: "1B6B93", green: "2E7D32",
};

function heading(text, level = 1) {
  const sizes = { 1: 32, 2: 26, 3: 22, 4: 18 };
  const colors = { 1: COLORS.deepSea, 2: COLORS.ocean, 3: COLORS.accent, 4: COLORS.dark };
  return new docx.Paragraph({ children: [new docx.TextRun({ text, bold: true, size: sizes[level] || 22, color: colors[level] || COLORS.dark, font: "Calibri" })], heading: level, spacing: { before: level === 1 ? 360 : 240, after: 120 } });
}
function para(text, opts = {}) {
  return new docx.Paragraph({ children: [new docx.TextRun({ text, size: 22, color: COLORS.dark, font: "Calibri", ...opts })], spacing: { after: 120, line: 276 } });
}
function boldPara(text) {
  return new docx.Paragraph({ children: [new docx.TextRun({ text, size: 22, color: COLORS.dark, font: "Calibri", bold: true })], spacing: { after: 120, line: 276 } });
}
function italicPara(text) {
  return new docx.Paragraph({ children: [new docx.TextRun({ text, size: 22, color: COLORS.gray, font: "Calibri", italics: true })], spacing: { after: 120, line: 276 } });
}

const c = [];

// ========== COVER PAGE ==========
c.push(new docx.Paragraph({ spacing: { before: 2400 }, children: [] }));
c.push(new docx.Paragraph({ children: [new docx.TextRun({ text: "ZAMIR JAMALOV", bold: true, size: 44, color: COLORS.deepSea, font: "Calibri" })], alignment: "center", spacing: { after: 120 } }));
c.push(new docx.Paragraph({ children: [new docx.TextRun({ text: "IT Business Analyst", size: 28, color: COLORS.ocean, font: "Calibri" })], alignment: "center", spacing: { after: 400 } }));
c.push(new docx.Paragraph({ children: [new docx.TextRun({ text: "________________________________________", color: COLORS.ocean, size: 24, font: "Calibri" })], alignment: "center", spacing: { after: 300 } }));
c.push(new docx.Paragraph({ children: [new docx.TextRun({ text: "Cover Letter", bold: true, size: 36, color: COLORS.deepSea, font: "Calibri" })], alignment: "center", spacing: { after: 80 } }));
c.push(new docx.Paragraph({ children: [new docx.TextRun({ text: "Application for Business Analyst Position", size: 24, color: COLORS.accent, font: "Calibri" })], alignment: "center", spacing: { after: 80 } }));
c.push(new docx.Paragraph({ children: [new docx.TextRun({ text: "Kontakt Home", size: 24, color: COLORS.accent, font: "Calibri" })], alignment: "center", spacing: { after: 600 } }));

// ========== LETTER CONTENT ==========
c.push(heading("Cover Letter", 1));

// Sender info
c.push(new docx.Paragraph({ children: [
  new docx.TextRun({ text: "Zamir Jamalov", bold: true, size: 22, color: COLORS.dark, font: "Calibri" }),
], spacing: { after: 40, line: 276 } }));
c.push(new docx.Paragraph({ children: [
  new docx.TextRun({ text: "IT Business Analyst", size: 22, color: COLORS.dark, font: "Calibri" }),
], spacing: { after: 40, line: 276 } }));
c.push(new docx.Paragraph({ children: [
  new docx.TextRun({ text: "Baku, Azerbaijan", size: 22, color: COLORS.dark, font: "Calibri" }),
], spacing: { after: 40, line: 276 } }));
c.push(new docx.Paragraph({ children: [
  new docx.TextRun({ text: "+994 55 207 7228  |  jamalov.zamir@gmail.com", size: 22, color: COLORS.dark, font: "Calibri" }),
], spacing: { after: 40, line: 276 } }));
c.push(new docx.Paragraph({ children: [
  new docx.TextRun({ text: "linkedin.com/in/zamir-jamalov", size: 22, color: COLORS.ocean, font: "Calibri" }),
], spacing: { after: 300, line: 276 } }));

// Date
c.push(new docx.Paragraph({ children: [
  new docx.TextRun({ text: "April 26, 2026", size: 22, color: COLORS.dark, font: "Calibri" }),
], spacing: { after: 300, line: 276 } }));

// Recipient
c.push(new docx.Paragraph({ children: [
  new docx.TextRun({ text: "Hiring Manager", size: 22, color: COLORS.dark, font: "Calibri" }),
], spacing: { after: 40, line: 276 } }));
c.push(new docx.Paragraph({ children: [
  new docx.TextRun({ text: "HR Department", size: 22, color: COLORS.dark, font: "Calibri" }),
], spacing: { after: 40, line: 276 } }));
c.push(new docx.Paragraph({ children: [
  new docx.TextRun({ text: "Kontakt Home", size: 22, color: COLORS.dark, font: "Calibri", bold: true }),
], spacing: { after: 40, line: 276 } }));
c.push(new docx.Paragraph({ children: [
  new docx.TextRun({ text: "Baku, Azerbaijan", size: 22, color: COLORS.dark, font: "Calibri" }),
], spacing: { after: 300, line: 276 } }));

// Subject
c.push(boldPara("Subject: Application for Business Analyst Position"));
c.push(new docx.Paragraph({ spacing: { after: 240 }, children: [] }));

// ========== BODY ==========
c.push(para("Dear Hiring Manager,"));
c.push(new docx.Paragraph({ spacing: { after: 120 }, children: [] }));

// PARAGRAPH 1 - Opening
c.push(para("I am writing to express my strong interest in the Business Analyst position at Kontakt Home. As an IT Business Analyst with over two years of hands-on experience in fintech and e-commerce domains, combined with a fifteen-year engineering background spanning Central Bank of Azerbaijan, Unibank, and ASAN Service, I bring a rare combination of deep technical expertise and business analysis proficiency. I have been following Kontakt Home's growth as Azerbaijan's leading electronics retailer, and I am genuinely excited about the opportunity to contribute to the company's digital transformation and operational excellence initiatives."));

// PARAGRAPH 2 - Why Kontakt Home
c.push(heading("Why Kontakt Home", 2));
c.push(para("Kontakt Home occupies a unique position in Azerbaijan's retail technology landscape. As the country's largest electronics retailer operating across multiple cities with a growing e-commerce presence, Kontakt Home faces the kind of complex operational challenges that demand structured business analysis: multi-channel customer experience management, supply chain optimization, inventory control across physical and digital channels, and the need to digitize processes that currently rely on manual coordination. My experience directly maps to these challenges. At Embafinans, I worked on digitizing credit decision workflows that required coordinating across risk, sales, and operations teams, while at Birbonus I designed customer-facing loyalty systems that involved partner merchant onboarding and settlement workflows. Both experiences required the same core competency that Kontakt Home needs: the ability to analyze complex cross-departmental processes, translate business requirements into precise technical specifications, and drive delivery from discovery through go-live."));

// PARAGRAPH 3 - Relevant Experience
c.push(heading("Relevant Experience and Value Proposition", 2));
c.push(para("Throughout my career as a Business Analyst, I have consistently delivered measurable business outcomes by applying structured methodologies and a data-driven approach to decision making. My key achievements that align directly with Kontakt Home's needs include the following:"));

c.push(boldPara("End-to-End Business Analysis Delivery"));
c.push(para("At Embafinans, I owned the complete requirements lifecycle for multiple production systems. I conducted structured stakeholder interviews with risk analysts, sales managers, and operations teams to map existing As-Is workflows, identify pain points, and design To-Be process models using BPMN notation. I authored comprehensive Business Requirements Documents (BRDs), Functional Requirements Documents (FRDs), and Software Requirements Specifications (SRS) with numbered requirement identifiers (REQ-101 format) that enabled precise traceability from business objectives through test cases. This disciplined documentation approach ensured that development teams had unambiguous specifications and that UAT sign-off was achieved on time across multiple release cycles, directly applicable to any process digitization initiative at Kontakt Home."));

c.push(boldPara("Technical Specification and API Design"));
c.push(para("I defined REST API specifications using Swagger/OpenAPI 3.0 for system integrations, created sequence diagrams for inter-service communication flows, and prepared detailed data mapping documents for developer handoff. My ability to speak the language of both business stakeholders and development teams, stemming from my engineering background, enables me to bridge the communication gap that often causes project delays. For Kontakt Home's technology-driven operations, this means I can produce specifications that developers can implement without ambiguity while ensuring business requirements are faithfully translated into working software."));

c.push(boldPara("Data-Driven Decision Making and Stakeholder Alignment"));
c.push(para("One of my most valued capabilities is using data analysis to resolve conflicting stakeholder priorities. At Embafinans, I leveraged SQL queries against production databases to present evidence-based recommendations when business units disagreed on requirements prioritization. This approach not only accelerated consensus but also built trust with both technical and non-technical stakeholders. In a retail environment like Kontakt Home, where decisions impact customer experience, inventory management, and financial operations simultaneously, the ability to ground discussions in data rather than opinions is essential."));

c.push(boldPara("Cross-Functional Coordination and Delivery Management"));
c.push(para("I coordinated UAT execution with business stakeholders, led bug triage meetings with QA engineers and developers, and managed backlog prioritization using the RICE framework to align sprint planning with business value. My experience at Birbonus designing a customer loyalty bonus system involved managing requirements across multiple partner merchants, defining earning rules, eligibility criteria, and settlement workflows, which is directly analogous to managing multi-stakeholder requirements in a retail ecosystem like Kontakt Home."));

// PARAGRAPH 4 - Engineering Edge
c.push(heading("Engineering Background as a Differentiator", 2));
c.push(para("What sets me apart from many Business Analysts is my fifteen-year career in software engineering before transitioning to business analysis. Having built production systems at the Central Bank of Azerbaijan, Unibank, and ASAN Service, I possess an intuitive understanding of system architecture, database design, integration patterns, and the technical constraints that shape solution feasibility. This background enables me to evaluate technical options during requirements workshops, identify integration risks early, and communicate effectively with development teams using precise technical language. During my subsequent role at Umico as a PostgreSQL Developer and L2 Support Engineer, I resolved production incidents using ELK Stack log analysis, which gives me firsthand appreciation for the operational impact of requirements decisions. For Kontakt Home, this means faster requirement-to-delivery cycles, fewer technical misunderstandings, and higher quality specifications."));

// PARAGRAPH 5 - Language & Cultural Fit
c.push(heading("Language Proficiency and Local Market Understanding", 2));
c.push(para("I am fluent in Azerbaijani (native), Russian (fluent), and English (professional proficiency with extensive technical documentation experience). This trilingual capability is particularly valuable for Kontakt Home's diverse workforce and customer base. I have authored all my business analysis deliverables, including BRDs, FRDs, SRS documents, and API specifications, in English, demonstrating my ability to operate in international and corporate environments. My deep understanding of the Azerbaijani market, gained through years of working with local financial institutions and e-commerce platforms, provides immediate contextual awareness that an externally hired analyst would need months to develop."));

// PARAGRAPH 6 - Closing
c.push(heading("Closing Statement", 2));
c.push(para("I am confident that my combination of business analysis expertise, engineering depth, fintech and e-commerce domain knowledge, and trilingual communication skills makes me a strong candidate for the Business Analyst position at Kontakt Home. I am eager to bring my structured approach to requirements management, my ability to bridge business and technology, and my commitment to delivering measurable business outcomes to your team. I would welcome the opportunity to discuss how my experience and skills can contribute to Kontakt Home's continued growth and digital transformation journey."));
c.push(new docx.Paragraph({ spacing: { after: 120 }, children: [] }));
c.push(para("Thank you for considering my application. I look forward to the possibility of contributing to Kontakt Home's success."));
c.push(new docx.Paragraph({ spacing: { after: 300 }, children: [] }));

// Signature
c.push(para("Yours sincerely,"));
c.push(new docx.Paragraph({ spacing: { after: 40 }, children: [] }));
c.push(new docx.Paragraph({ children: [
  new docx.TextRun({ text: "Zamir Jamalov", bold: true, size: 24, color: COLORS.deepSea, font: "Calibri" }),
], spacing: { after: 40, line: 276 } }));
c.push(new docx.Paragraph({ children: [
  new docx.TextRun({ text: "IT Business Analyst", size: 22, color: COLORS.accent, font: "Calibri" }),
], spacing: { after: 40, line: 276 } }));
c.push(new docx.Paragraph({ children: [
  new docx.TextRun({ text: "+994 55 207 7228  |  jamalov.zamir@gmail.com", size: 20, color: COLORS.gray, font: "Calibri" }),
], spacing: { after: 40, line: 276 } }));

// ========== BUILD ==========
async function main() {
  const doc = new docx.Document({
    sections: [
      {
        properties: {
          page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } },
        },
        headers: {
          default: new docx.Header({
            children: [new docx.Paragraph({
              children: [new docx.TextRun({ text: "Zamir Jamalov  |  Cover Letter  |  Kontakt Home Application", size: 16, color: COLORS.gray, font: "Calibri", italics: true })],
              alignment: "right",
            })],
          }),
        },
        footers: {
          default: new docx.Footer({
            children: [new docx.Paragraph({
              children: [
                new docx.TextRun({ text: "Page ", size: 16, color: COLORS.gray, font: "Calibri" }),
                new docx.TextRun({ children: [docx.PageNumber.CURRENT], size: 16, color: COLORS.gray, font: "Calibri" }),
              ],
              alignment: "center",
            })],
          }),
        },
        children: c,
      },
    ],
  });

  const buffer = await docx.Packer.toBuffer(doc);
  const outputPath = "/home/z/my-project/ba-practice/download/Zamir_Jamalov_Cover_Letter_Kontakt_Home.docx";
  fs.writeFileSync(outputPath, buffer);
  console.log("Cover letter generated: " + outputPath);
  console.log("Size: " + (buffer.length / 1024).toFixed(1) + " KB");
}

main().catch(err => { console.error(err); process.exit(1); });
