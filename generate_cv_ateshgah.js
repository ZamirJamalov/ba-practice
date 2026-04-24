const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, ShadingType, WidthType, VerticalAlign,
  TabStopType
} = require("docx");
const fs = require("fs");

// ─── Minimalist Color Palette ───
const C = {
  dark: "1A1A1A",
  accent: "1B5E20",      // Insurance green
  body: "333333",
  sec: "777777",
  line: "D0D0D0",
};

const NB = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const allNoBorders = { top: NB, bottom: NB, left: NB, right: NB, insideHorizontal: NB, insideVertical: NB };

function bodyRun(text, opts = {}) {
  return new TextRun({
    text, font: "Calibri", color: opts.color || C.body, size: opts.size || 20,
    bold: opts.bold || false, italics: opts.italics || false,
  });
}

function bullet(text) {
  return new Paragraph({
    spacing: { before: 40, after: 40, line: 260 },
    indent: { left: 260, hanging: 200 },
    children: [
      bodyRun("\u2022  ", { size: 18, color: C.accent }),
      bodyRun(text, { size: 19 }),
    ],
  });
}

function sectionHeading(text) {
  return new Paragraph({
    spacing: { before: 240, after: 80 },
    borders: { bottom: { style: BorderStyle.SINGLE, size: 6, color: C.accent, space: 4 } },
    children: [
      new TextRun({
        text: text.toUpperCase(), font: "Calibri", size: 21, bold: true,
        color: C.accent, characterSpacing: 40,
      }),
    ],
  });
}

function subHeading(company, title, date) {
  return new Paragraph({
    spacing: { before: 140, after: 30 },
    tabStops: [{ type: TabStopType.RIGHT, position: 10000 }],
    children: [
      bodyRun(company, { size: 21, bold: true, color: C.dark }),
      bodyRun("  |  ", { size: 18, color: C.sec }),
      bodyRun(title, { size: 19, color: C.accent, italics: true }),
      new TextRun({ text: "\t" + date, font: "Calibri", size: 18, color: C.sec }),
    ],
  });
}

function skillLine(category, items) {
  return new Paragraph({
    spacing: { before: 50, after: 50, line: 270 },
    children: [
      bodyRun(category + ": ", { size: 19, bold: true, color: C.dark }),
      bodyRun(items, { size: 19 }),
    ],
  });
}

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: "Calibri", size: 20, color: C.body },
        paragraph: { spacing: { line: 276 } },
      },
    },
  },
  sections: [
    {
      properties: {
        page: {
          margin: { top: 700, bottom: 600, left: 900, right: 900 },
          size: { width: 11906, height: 16838 },
        },
      },
      children: [
        // ─── NAME ───
        new Paragraph({
          spacing: { after: 20 },
          children: [
            new TextRun({ text: "\u0417\u0410\u041C\u0418\u0420 \u0414\u0416\u0410\u041C\u0410\u041B\u041E\u0412", font: "Calibri", size: 36, bold: true, color: C.dark }),
          ],
        }),
        // ─── TITLE ───
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({ text: "Business Analyst / No-code Developer", font: "Calibri", size: 22, color: C.accent }),
          ],
        }),
        // ─── CONTACT ───
        new Paragraph({
          spacing: { after: 30 },
          children: [
            bodyRun("+994 55 207 7228", { size: 18, color: C.sec }),
            bodyRun("   |   ", { size: 18, color: C.line }),
            bodyRun("jamalov.zamir@gmail.com", { size: 18, color: C.sec }),
            bodyRun("   |   ", { size: 18, color: C.line }),
            bodyRun("\u0411\u0430\u043A\u0443, \u0410\u0437\u0435\u0440\u0431\u0430\u0439\u0434\u0436\u0430\u043D", { size: 18, color: C.sec }),
          ],
        }),
        new Paragraph({
          spacing: { after: 60 },
          children: [
            bodyRun("github.com/ZamirJamalov/ba-practice", { size: 17, color: C.accent }),
            bodyRun("  \u2014  \u041F\u0440\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0435 \u043F\u0440\u0438\u043C\u0435\u0440\u044B: BRD, BPMN, Swagger, SQL, UAT", { size: 17, color: C.sec }),
          ],
        }),

        // ─── PROFILE SUMMARY ───
        sectionHeading("\u041E \u0441\u0435\u0431\u0435"),
        new Paragraph({
          spacing: { before: 80, after: 60, line: 280 },
          children: [
            bodyRun(
              "IT Business Analyst \u0441 3-\u043B\u0435\u0442\u043D\u0438\u043C \u043E\u043F\u044B\u0442\u043E\u043C \u0432 E-Commerce \u0438 Fintech, \u0441\u0438\u043B\u044C\u043D\u043E \u0432 \u0441\u0431\u043E\u0440\u0435 \u0438 \u0430\u043D\u0430\u043B\u0438\u0437\u0435 \u0442\u0440\u0435\u0431\u043E\u0432\u0430\u043D\u0438\u0439, \u043C\u043E\u0434\u0435\u043B\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0438 \u0431\u0438\u0437\u043D\u0435\u0441-\u043F\u0440\u043E\u0446\u0435\u0441\u0441\u043E\u0432 (BPMN 2.0) \u0438 \u0440\u0430\u0431\u043E\u0442\u0435 \u0441 REST API. \u0424\u043E\u043D \u0432 \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u043A\u0435 (C#, T-SQL, 15+ \u043B\u0435\u0442) \u043F\u043E\u0437\u0432\u043E\u043B\u044F\u0435\u0442 \u0433\u043B\u0443\u0431\u043E\u043A\u043E \u043F\u043E\u043D\u0438\u043C\u0430\u0442\u044C \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u043E \u0411\u0414, \u043E\u041E\u041F \u0438 \u0430\u043B\u0433\u043E\u0440\u0438\u0442\u043C\u0438\u043A\u0443 \u2014 \u0447\u0442\u043E \u043D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0434\u043B\u044F \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0431\u0438\u0437\u043D\u0435\u0441-\u043B\u043E\u0433\u0438\u043A\u0438 \u0438 \u0438\u043D\u0442\u0435\u0433\u0440\u0430\u0446\u0438\u0439 \u043D\u0430 No-code \u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u0435. \u0418\u0449\u0443 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u044C \u043F\u0440\u0438\u043C\u0435\u043D\u0438\u0442\u044C \u0430\u043D\u0430\u043B\u0438\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0435 \u0438 \u0442\u0435\u0445\u043D\u0438\u0447\u0435\u0441\u043A\u0438\u0435 \u043D\u0430\u0432\u044B\u043A\u0438 \u0432 \u043A\u0440\u0443\u043F\u043D\u043E\u043C \u0441\u0442\u0440\u0430\u0445\u043E\u0432\u043E\u043C \u0431\u0438\u0437\u043D\u0435\u0441\u0435 \u043D\u0430 \u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u0435 Creatio.",
              { size: 19 }
            ),
          ],
        }),

        // ─── KEY SKILLS ───
        sectionHeading("\u041A\u043B\u044E\u0447\u0435\u0432\u044B\u0435 \u043D\u0430\u0432\u044B\u043A\u0438"),
        skillLine("Business Analysis", "BRD / FRD / SRS, User Stories \u0438 Acceptance Criteria (Gherkin), BPMN 2.0 (As-Is / To-Be), Gap Analysis, \u0421\u0431\u043E\u0440 \u0442\u0440\u0435\u0431\u043E\u0432\u0430\u043D\u0438\u0439, \u041F\u0440\u0438\u043E\u0440\u0438\u0442\u0438\u0437\u0430\u0446\u0438\u044F \u0431\u044D\u043A\u043B\u043E\u0433\u0430 (WSJF / RICE)"),
        skillLine("\u0422\u0435\u0445\u043D\u0438\u0447\u0435\u0441\u043A\u0438\u0435", "REST API / JSON, Swagger / OpenAPI 3.0, Postman, SQL (JOIN, GROUP BY, \u041F\u043E\u0434\u0437\u0430\u043F\u0440\u043E\u0441\u044B), \u041E\u041E\u041F (C#, \u043A\u043B\u0430\u0441\u0441\u044B, \u043C\u0435\u0442\u043E\u0434\u044B, \u043D\u0430\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u043D\u0438\u0435), \u0420\u0435\u043B\u044F\u0446\u0438\u043E\u043D\u043D\u044B\u0435 \u0411\u0414 (Oracle, MSSQL, PostgreSQL)"),
        skillLine("\u041F\u0440\u043E\u0446\u0435\u0441\u044B \u0438 \u0438\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442\u044B", "Agile / Scrum, Jira, Confluence, UAT (\u0442\u0435\u0441\u0442-\u043F\u043B\u0430\u043D\u044B, \u0442\u0440\u0438\u0430\u0436 \u0431\u0430\u0433\u043E\u0432), \u0410\u043D\u0430\u043B\u0438\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0435 \u0434\u0430\u0448\u0431\u043E\u0440\u0434\u044B (SQL + Power BI), ELK Stack (L2 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0430)"),
        skillLine("\u042F\u0437\u044B\u043A\u0438", "\u0420\u0443\u0441\u0441\u043A\u0438\u0439 (C1, \u0441\u0432\u043E\u0431\u043E\u0434\u043D\u043E\u0435 \u0432\u043B\u0430\u0434\u0435\u043D\u0438\u0435), \u0410\u0437\u0435\u0440\u0431\u0430\u0439\u0434\u0436\u0430\u043D\u0441\u043A\u0438\u0439 (\u0440\u043E\u0434\u043D\u043E\u0439), \u0410\u043D\u0433\u043B\u0438\u0439\u0441\u043A\u0438\u0439 (\u043F\u0440\u043E\u0444\u0435\u0441\u0441\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0439)"),

        // ─── WORK EXPERIENCE ───
        sectionHeading("\u041E\u043F\u044B\u0442 \u0440\u0430\u0431\u043E\u0442\u044B"),

        // --- Embafinans ---
        subHeading("Embafinans", "IT Business Analyst", "2025 \u2013 \u043D\u0430\u0441\u0442\u043E\u044F\u0449\u0435\u0435 \u0432\u0440\u0435\u043C\u044F"),
        bullet("\u0421\u0431\u0438\u0440\u0430\u043B \u0442\u0440\u0435\u0431\u043E\u0432\u0430\u043D\u0438\u044F \u0443 \u0432\u043D\u0443\u0442\u0440\u0435\u043D\u043D\u0438\u0445 \u0437\u0430\u043A\u0430\u0437\u0447\u0438\u043A\u043E\u0432 (\u0440\u0438\u0441\u043A-\u043E\u0442\u0434\u0435\u043B, \u0444\u0438\u043D\u0430\u043D\u0441\u044B, \u043F\u0440\u043E\u0434\u0430\u0436\u0438) \u0447\u0435\u0440\u0435\u0437 \u0441\u0442\u0440\u0443\u043A\u0442\u0443\u0440\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0435 \u0438\u043D\u0442\u0435\u0440\u0432\u044C\u044E, \u043C\u043E\u0434\u0435\u043B\u0438\u0440\u043E\u0432\u0430\u043B As-Is / To-Be \u043F\u0440\u043E\u0446\u0435\u0441\u0441\u044B \u0432 BPMN 2.0 \u0438 \u0441\u0444\u043E\u0440\u043C\u0443\u043B\u0438\u0440\u043E\u0432\u0430\u043B FRD \u0441 \u043D\u0443\u043C\u0435\u0440\u0430\u0446\u0438\u0435\u0439 \u0442\u0440\u0435\u0431\u043E\u0432\u0430\u043D\u0438\u0439 (REQ-101)."),
        bullet("\u0421\u043F\u0440\u043E\u0435\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043B REST API (\u0441\u043F\u0435\u0446\u0438\u0444\u0438\u043A\u0430\u0446\u0438\u0438 Swagger / OpenAPI 3.0 \u0434\u043B\u044F 8+ \u044D\u043D\u0434\u043F\u043E\u0439\u043D\u0442\u043E\u0432) \u0438 \u043D\u0430\u0441\u0442\u0440\u0430\u0438\u0432\u0430\u043B \u0442\u0435\u0441\u0442\u043E\u0432\u044B\u0435 \u043A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u0438 \u0432 Postman \u0434\u043B\u044F \u0438\u043D\u0442\u0435\u0433\u0440\u0430\u0446\u0438\u0439 \u0441 PayTabs, Sima, ASAN."),
        bullet("\u041F\u0438\u0441\u0430\u043B User Stories \u0441 Acceptance Criteria (Given/When/Then) \u0432 Jira/Confluence, \u043A\u043E\u043E\u0440\u0434\u0438\u043D\u0438\u0440\u043E\u0432\u0430\u043B UAT \u0438 \u0442\u0440\u0438\u0430\u0436 \u0431\u0430\u0433\u043E\u0432 \u0441 QA \u0438 \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u0447\u0438\u043A\u0430\u043C\u0438 \u2014 sign-off 3 \u0440\u0435\u043B\u0438\u0437\u043E\u0432 \u0432 \u0441\u0440\u043E\u043A."),
        bullet("\u0420\u0435\u0448\u0430\u043B \u043A\u043E\u043D\u0444\u043B\u0438\u043A\u0442\u044B \u043C\u0435\u0436\u0434\u0443 \u043E\u0442\u0434\u0435\u043B\u0430\u043C\u0438 \u0447\u0435\u0440\u0435\u0437 SQL-\u0430\u043D\u0430\u043B\u0438\u0437 \u0434\u0430\u043D\u043D\u044B\u0445 (JOIN, GROUP BY) \u0438 \u043F\u0440\u0435\u0434\u0441\u0442\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u043E\u0432 \u0441\u0442\u0435\u0439\u043A\u0445\u043E\u043B\u0434\u0435\u0440\u0430\u043C."),

        // --- BirMarket ---
        subHeading("BirMarket (Umico)", "Business Analyst", "2022 \u2013 2025"),
        bullet("\u0421\u043E\u0431\u0438\u0440\u0430\u043B \u0442\u0440\u0435\u0431\u043E\u0432\u0430\u043D\u0438\u044F \u0443 \u043E\u043F\u0435\u0440\u0430\u0446\u0438\u043E\u043D\u043D\u044B\u0445 \u043A\u043E\u043C\u0430\u043D\u0434 (\u0441\u043A\u043B\u0430\u0434, \u043B\u043E\u0433\u0438\u0441\u0442\u0438\u043A\u0430) \u0438 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0438\u0440\u043E\u0432\u0430\u043B \u043F\u0440\u043E\u0446\u0435\u0441\u0441 onboarding \u043F\u0440\u043E\u0434\u0430\u0432\u0446\u043E\u0432 \u043E\u0442 \u043D\u0443\u043B\u044F \u0434\u043E FRD \u0441 Acceptance Criteria."),
        bullet("\u0410\u043D\u0430\u043B\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u043B \u0434\u0430\u043D\u043D\u044B\u0435 SQL-\u0437\u0430\u043F\u0440\u043E\u0441\u0430\u043C\u0438 (complex JOINs, GROUP BY), \u0432\u044B\u044F\u0432\u043B\u044F\u043B \u0443\u0437\u043A\u0438\u0435 \u043C\u0435\u0441\u0442\u0430 \u0438 \u043F\u0440\u0435\u0434\u0441\u0442\u0430\u0432\u043B\u044F\u043B \u0440\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0430\u0446\u0438\u0438 \u043F\u0440\u043E\u0434\u0443\u043A\u0442\u043E\u0432\u043E\u0439 \u043A\u043E\u043C\u0430\u043D\u0434\u0435."),
        bullet("\u041E\u0431\u0435\u0441\u043F\u0435\u0447\u0438\u0432\u0430\u043B L2 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0443 production: \u0430\u043D\u0430\u043B\u0438\u0437 \u0441\u0438\u0441\u0442\u0435\u043C\u043D\u044B\u0445 \u043B\u043E\u0433\u043E\u0432 (ELK Stack), \u0438\u0434\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0446\u0438\u044F \u043A\u043E\u0440\u043D\u0435\u0432\u044B\u0445 \u043F\u0440\u0438\u0447\u0438\u043D \u0438\u043D\u0446\u0438\u0434\u0435\u043D\u0442\u043E\u0432, \u043A\u043E\u043E\u0440\u0434\u0438\u043D\u0430\u0446\u0438\u044F \u0441 \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u043A\u043E\u0439."),

        // ─── TECHNICAL FOUNDATION ───
        sectionHeading("\u0422\u0435\u0445\u043D\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u0431\u0430\u0437\u0430"),
        new Paragraph({
          spacing: { before: 60, after: 60, line: 280 },
          children: [
            bodyRun("15+ \u043B\u0435\u0442 \u0432 \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u043A\u0435 \u041F\u041E (\u041C\u0435\u0440\u043A\u0437\u0438\u0439 \u0431\u0430\u043D\u043A, Unibank, ASAN): backend (C#, T-SQL), \u0430\u0440\u0445\u0438\u0442\u0435\u043A\u0442\u0443\u0440\u0430 \u0420\u0411\u0414 (Oracle, MSSQL, PostgreSQL), \u043E\u041E\u041F (\u043A\u043B\u0430\u0441\u0441\u044B, \u043C\u0435\u0442\u043E\u0434\u044B, \u043D\u0430\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u043D\u0438\u0435, \u043C\u0430\u0441\u0441\u0438\u0432\u044B). \u042D\u0442\u043E \u043F\u043E\u0437\u0432\u043E\u043B\u044F\u0435\u0442 \u0431\u044B\u0441\u0442\u0440\u043E \u043E\u0441\u0432\u043E\u0438\u0442\u044C No-code/\u041C\u0430\u0441\u0442\u0435\u0440-data \u043C\u043E\u0434\u0435\u043B\u0438 \u0438 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0443 \u0431\u0438\u0437\u043D\u0435\u0441-\u043B\u043E\u0433\u0438\u043A\u0438 \u043D\u0430 \u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u0435 Creatio. \u041E\u043F\u044B\u0442 \u0441 \u0438\u043D\u0442\u0435\u0433\u0440\u0430\u0446\u0438\u044F\u043C\u0438 (REST, JSON) \u0438 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u043E\u0439 \u043F\u0440\u043E\u0446\u0435\u0441\u0441\u043E\u0432 (BPMN) \u043F\u0440\u044F\u043C\u043E \u043F\u0435\u0440\u0435\u043D\u043E\u0441\u0438\u043C\u044B \u043D\u0430 Creatio.", { size: 19 }),
          ],
        }),

        // ─── TRAINING ───
        sectionHeading("\u041E\u0431\u0443\u0447\u0435\u043D\u0438\u0435"),
        new Paragraph({
          spacing: { before: 60, after: 40 },
          tabStops: [{ type: TabStopType.RIGHT, position: 10000 }],
          children: [
            bodyRun("DIV Academy / Innab", { size: 21, bold: true, color: C.dark }),
            bodyRun("  |  ", { size: 18, color: C.sec }),
            bodyRun("\u0418\u043D\u0441\u0442\u0440\u0443\u043A\u0442\u043E\u0440 SQL \u0438 Data Analytics", { size: 19, color: C.accent, italics: true }),
            new TextRun({ text: "\t2022 \u2013 2026", font: "Calibri", size: 18, color: C.sec }),
          ],
        }),
        bullet("\u041F\u0440\u043E\u0432\u043E\u0434\u0438\u043B \u043A\u043E\u0440\u043F\u043E\u0440\u0430\u0442\u0438\u0432\u043D\u043E\u0435 \u043E\u0431\u0443\u0447\u0435\u043D\u0438\u0435 (Bank of Baku, SOCAR): \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u043A\u0430 \u043C\u0430\u0442\u0435\u0440\u0438\u0430\u043B\u043E\u0432, \u0438\u043D\u0441\u0442\u0440\u0443\u043A\u0446\u0438\u0439, \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 \u043F\u0440\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0445 \u0437\u0430\u0434\u0430\u043D\u0438\u0439 \u2014 \u043E\u043F\u044B\u0442 \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u044F \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430\u0446\u0438\u0438 \u0438 \u043E\u0431\u0443\u0447\u0435\u043D\u0438\u044F \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u0439."),

        // ─── EDUCATION ───
        sectionHeading("\u041E\u0431\u0440\u0430\u0437\u043E\u0432\u0430\u043D\u0438\u0435"),
        new Paragraph({
          spacing: { before: 60, after: 40 },
          children: [
            bodyRun("\u0411\u0430\u043A\u0438\u043D\u0441\u043A\u0438\u0439 \u0433\u043E\u0441\u0443\u0434\u0430\u0440\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0439 \u0443\u043D\u0438\u0432\u0435\u0440\u0441\u0438\u0442\u0435\u0442", { size: 20, bold: true, color: C.dark }),
            bodyRun("  \u2014  \u041F\u0440\u0438\u043A\u043B\u0430\u0434\u043D\u0430\u044F \u043C\u0430\u0442\u0435\u043C\u0430\u0442\u0438\u043A\u0430 (\u0431\u0430\u043A\u0430\u043B\u0430\u0432\u0440)", { size: 19 }),
          ],
        }),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("/home/z/my-project/download/Zamir_Camalov_BA_NoCode_CV_RU.docx", buffer);
  console.log("CV for Ateshgah generated successfully!");
});
