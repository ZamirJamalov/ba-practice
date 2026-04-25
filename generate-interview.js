const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, VerticalAlign, HeadingLevel,
  ShadingType, PageBreak,
} = require("docx");
const fs = require("fs");

const BLUE = "2A6496";
const DARK = "1A1A1A";
const BODY = "333333";
const GRAY = "777777";
const LIGHT_BG = "F2F7FC";
const LINE_CLR = "CCCCCC";
const FONT = { ascii: "Calibri", eastAsia: "Calibri" };
const NB = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: NB, bottom: NB, left: NB, right: NB };

// ── Helpers ──

function headerCell(text, width) {
  return new TableCell({
    width: { size: width, type: WidthType.PERCENTAGE },
    shading: { fill: BLUE, type: ShadingType.CLEAR, color: "auto" },
    verticalAlign: VerticalAlign.CENTER,
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: LINE_CLR },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: LINE_CLR },
      left: { style: BorderStyle.SINGLE, size: 1, color: LINE_CLR },
      right: { style: BorderStyle.SINGLE, size: 1, color: LINE_CLR },
    },
    children: [new Paragraph({
      spacing: { before: 60, after: 60 },
      children: [new TextRun({ text, font: FONT, size: 20, bold: true, color: "FFFFFF" })],
    })],
  });
}

function bodyCell(text, width, bold = false, shading = null) {
  return new TableCell({
    width: { size: width, type: WidthType.PERCENTAGE },
    shading: shading ? { fill: shading, type: ShadingType.CLEAR, color: "auto" } : undefined,
    verticalAlign: VerticalAlign.TOP,
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: LINE_CLR },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: LINE_CLR },
      left: { style: BorderStyle.SINGLE, size: 1, color: LINE_CLR },
      right: { style: BorderStyle.SINGLE, size: 1, color: LINE_CLR },
    },
    children: [new Paragraph({
      spacing: { before: 40, after: 40, line: 276 },
      children: [new TextRun({ text, font: FONT, size: 19, color: BODY, bold })],
    })],
  });
}

function questionNumber(num) {
  return new TableCell({
    width: { size: 8, type: WidthType.PERCENTAGE },
    shading: { fill: BLUE, type: ShadingType.CLEAR, color: "auto" },
    verticalAlign: VerticalAlign.CENTER,
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: LINE_CLR },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: LINE_CLR },
      left: { style: BorderStyle.SINGLE, size: 1, color: LINE_CLR },
      right: { style: BorderStyle.SINGLE, size: 1, color: LINE_CLR },
    },
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 40, after: 40 },
      children: [new TextRun({ text: String(num), font: FONT, size: 20, bold: true, color: "FFFFFF" })],
    })],
  });
}

function sectionTitle(text) {
  return new Paragraph({
    spacing: { before: 300, after: 100, line: 276 },
    children: [
      new TextRun({ text: "\u25A0 ", font: FONT, size: 22, bold: true, color: BLUE }),
      new TextRun({ text, font: FONT, size: 22, bold: true, color: BLUE }),
    ],
  });
}

function questionTable(num, question, answer, rowIdx) {
  const bg = rowIdx % 2 === 0 ? LIGHT_BG : undefined;
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [8, 25, 67],
    rows: [
      new TableRow({
        children: [
          questionNumber(num),
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            shading: bg ? { fill: bg, type: ShadingType.CLEAR, color: "auto" } : undefined,
            verticalAlign: VerticalAlign.TOP,
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: LINE_CLR },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: LINE_CLR },
              left: { style: BorderStyle.SINGLE, size: 1, color: LINE_CLR },
              right: { style: BorderStyle.SINGLE, size: 1, color: LINE_CLR },
            },
            children: [new Paragraph({
              spacing: { before: 40, after: 40, line: 276 },
              children: [new TextRun({ text: question, font: FONT, size: 19, bold: true, color: DARK })],
            })],
          }),
          new TableCell({
            width: { size: 67, type: WidthType.PERCENTAGE },
            shading: bg ? { fill: bg, type: ShadingType.CLEAR, color: "auto" } : undefined,
            verticalAlign: VerticalAlign.TOP,
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: LINE_CLR },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: LINE_CLR },
              left: { style: BorderStyle.SINGLE, size: 1, color: LINE_CLR },
              right: { style: BorderStyle.SINGLE, size: 1, color: LINE_CLR },
            },
            children: answer.split("\n").map(line => new Paragraph({
              spacing: { before: 20, after: 20, line: 276 },
              children: line.startsWith("- ")
                ? [new TextRun({ text: "\u2022 ", font: FONT, size: 19, color: BLUE }), new TextRun({ text: line.slice(2), font: FONT, size: 19, color: BODY })]
                : line.startsWith("  ")
                  ? [new TextRun({ text: line, font: FONT, size: 19, color: GRAY, italics: true })]
                  : [new TextRun({ text: line, font: FONT, size: 19, color: BODY })],
            })),
          }),
        ],
      }),
    ],
  });
}

function spacer(twips = 120) {
  return new Paragraph({ spacing: { before: twips, after: 0 }, children: [] });
}

// ══════════════════════════════════════
const children = [];

// ── COVER ──
children.push(new Paragraph({ spacing: { before: 2400 }, children: [] }));
children.push(new Paragraph({
  alignment: AlignmentType.LEFT,
  spacing: { before: 0, after: 200, line: 276 },
  children: [new TextRun({ text: "BA Interview Preparation", font: FONT, size: 40, bold: true, color: BLUE, characterSpacing: 60 })],
}));
children.push(new Paragraph({
  alignment: AlignmentType.LEFT,
  spacing: { before: 0, after: 100, line: 276 },
  children: [new TextRun({ text: "Kontakt Home \u2014 IT Business Analyst", font: FONT, size: 26, color: GRAY })],
}));

children.push(new Table({
  width: { size: 40, type: WidthType.PERCENTAGE },
  columnWidths: [3962],
  borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 4, color: BLUE } },
  rows: [new TableRow({ height: { value: 80, rule: "exact" }, children: [new TableCell({ borders: noBorders, children: [new Paragraph({ children: [] })] })] })],
}));

children.push(spacer(200));

const metaRows = [
  ["Prepared for", "Zamir Jamalov"],
  ["Position", "IT Business Analyst"],
  ["Target Company", "Kontakt Home"],
  ["Date", "April 2026"],
  ["Version", "1.0"],
];
metaRows.forEach(([label, value]) => {
  children.push(new Paragraph({
    spacing: { before: 30, after: 30, line: 260 },
    children: [
      new TextRun({ text: label + ":  ", font: FONT, size: 19, bold: true, color: GRAY }),
      new TextRun({ text: value, font: FONT, size: 19, color: BODY }),
    ],
  }));
});

// ── PAGE BREAK ──
children.push(new Paragraph({ children: [new PageBreak()] }));

// ── HOW TO USE ──
children.push(new Paragraph({
  spacing: { before: 100, after: 100, line: 276 },
  children: [new TextRun({ text: "How to Use This Document", font: FONT, size: 24, bold: true, color: BLUE })],
}));
children.push(new Paragraph({
  spacing: { before: 40, after: 40, line: 280 },
  children: [new TextRun({
    text: "This document contains 22 interview questions organized into 5 groups, with model answers based on real Embafinans, Birbonus, and Umico experience. Each answer is written as it should be spoken in an interview \u2014 not as a script, but as a reference point. Your goal is not to memorize, but to understand the logic and adapt to your own words.",
    font: FONT, size: 19, color: BODY,
  })],
}));

children.push(new Paragraph({
  spacing: { before: 60, after: 40, line: 280 },
  children: [new TextRun({ text: "Interview Tips:", font: FONT, size: 20, bold: true, color: DARK })],
}));

const tips = [
  "Answer in STAR format (Situation, Task, Action, Result) for experience questions",
  "Keep answers under 90 seconds \u2014 practice with a timer",
  "Always connect your answer back to Kontakt Home when relevant",
  "If you don\u2019t know something, say \u201CI don\u2019t have direct experience, but here\u2019s how I would approach it\u201D",
  "Ask clarifying questions before answering scenario-based questions",
];
tips.forEach(tip => {
  children.push(new Paragraph({
    spacing: { before: 20, after: 20, line: 260 },
    indent: { left: 200, hanging: 200 },
    children: [
      new TextRun({ text: "\u2022  ", font: FONT, size: 19, color: BLUE }),
      new TextRun({ text: tip, font: FONT, size: 19, color: BODY }),
    ],
  }));
});

children.push(spacer(100));

// ══════════════════════════════════════
// GROUP 1
// ══════════════════════════════════════
children.push(sectionTitle("Group 1: Self Introduction"));

const q1 = `Men 2 ildirn cox fintech ve e-commerce sektorlarinda IT Business Analyst kimi calisiram. Evvel Birbonus-da musteri loyaliti bonus sistemi uzerinde isledim \u2014 stakeholder sessiyalari kecdim, earning rules ve settlement workflows teyin etdim. Indi Embafinans-da 4 layihe teslim etmisem: Credit Scoring, B2C Sales Channel, Delivery Dashboard ve End-to-End Credit Lifecycle.

Onemli bir avantajim var: 15 illik software engineering arxaplanim var. C#, Oracle, PostgreSQL, MongoDB, REST API \u2014 bu bacariqlar sayesinde business telerifleri teknik spesifikasiyalara cevirmek menim ucun tabii prosesdir. Umico-da 2 il PostgreSQL developer ve L2 support olaraq calisibam \u2014 ELK Stack ile production incidentlari heck etmisem, bu da mene sistem nasil isleyir derin anlayis verir.

Muelkatda en cox sevdiyem hisse: muerekkeb stakeholder muxteliffehlidleri olan zaman, SQL ile data analizi edib evidence-based recommendation vermek. Bu yolla hemisheyi razilasmaqa getirirsin.`;

const q2 = `Men原先是software engineer \u2014 C# backend developer olaraq Merkez Banki, Unibank ve ASAN Service-de 15 il calisibam. Bu muddet icerisinde relations ve NoSQL databases, REST API, CI/CD pipelines ile isleyibem.

Umico-da PostgreSQL developer ve L2 support kimi calisarken, komanda icinde requirements toplamaq, prosesleri analyze etmeq ve developerlarla koordinasiya etmek tapilirirdim. Bu elave deyerlerimi gorendiler ve IT Business Analyst rolune kecdim.

Birbonus-da tam BA rolu aldım \u2014 BRD, FRD, User Stories, UAT. Embafinans-da ise en boyuk layihelerimi teslim etdim: Credit Scoring sistemi 2x suretli kredit qerarlarina gətirdi, B2C kanali 300-500 gundelik muracieti idare edir.

Engineering background-lari bir BA-ya verir: developer-larla laqebeli danisirsan, API spesifikasiya yazirsan, production problemi anlayirsan \u2014 bu sizi sadece "requirements yigan" deyil, "bridge between business and tech" edir.`;

const group1 = [
  ["Ozunu teqdim et, BA tecrubenden danis", q1],
  ["Biznes analitik nece oldun?", q2],
];

group1.forEach(([q, a], i) => {
  children.push(spacer(60));
  children.push(questionTable(i + 1, q, a, i));
});

// ══════════════════════════════════════
// GROUP 2
// ══════════════════════════════════════
children.push(sectionTitle("Group 2: BA Knowledge & Experience"));

const group2 = [
  // Q3: BRD structure
  ["BRD yazmisan, strukturunu izah et", `BRD-nin məqsədi biznes tələblərini sənədləşdirməkdir \u2014 "nə etmək lazımdır" sualına cavab verir, "necə etmək lazımdır" deyil.

Embafinans-da Credit Scoring layihəsi üçün BRD yazdım. Strukturum belə idi:

- Executive Summary \u2014 layihənin məqsədi və biznes dəyəri (2x sürətli kredit qərarları)
- Business Goals \u2014 measureable objectives: approval time < 60 saniyə, manual review azaltmaq
- Scope \u2014 in-scope (BNPL scoring, goods loan) və out-of-scope (post-loan monitoring) ayırmaq
- Stakeholders \u2014 kim təsir olunur: Risk Department, Sales, IT, Credit Committee, partner mağazalar
- Business Requirements \u2014 BR-101, BR-102 formatında biznes tələblər. Məsələn: "BR-101: Sistem 60 saniyə ərzində avtomatik skorinq etməlidir"
- Assumptions & Constraints \u2014 nə varsayıllar etdik, nə məhdudiyyətlər var
- Glossary \u2014 domain-specific terminlərin izahı

Əsas prinsip: BRD səndən sonra FRD yazmaq üçün əsasdır. FRD-də hər bir BR funksional detallara bölünür.`],

  // Q4: User Story
  ["User Story necə yazirsan? Nuve ver", `Embafinans-da hər sprint-ə əvvəl User Story yazıram. Format:

- As a [role], I want to [action], so that [benefit]

Nuve: Credit Scoring layihəsi

- US-101: As a customer, I want to submit a credit application via mobile app, so that I can apply for credit without visiting a branch.
- Acceptance Criteria (Gherkin):
  - Given I am a registered customer on the app
  - When I fill in my personal and financial details and submit
  - Then my application should be saved and sent for scoring
  - And I should see a confirmation with application ID

- US-102: As a risk analyst, I want to view automated scoring results, so that I can focus on manual review cases only.
  - Given an application has been scored
  - When the score is between 50-79
  - Then the application appears in my manual review queue with full scoring breakdown

Hər User Story-ya 3 Acceptance Criteria yazmağa çalışıram \u2014 happy path, edge case, və error case.`],

  // Q5: BPMN
  ["BPMN istifade edirsən, misal cək", `BPMN \u2014 Business Process Model and Notation. Prosesi vizual modelləşdirmək üçün istifadə olunur.

Embafinans-da Credit Scoring layihəsi üçün As-Is diagram çəkdim. Swimlan-lar:

- Customer | Scoring Engine | Risk Department | CRM

As-Is proses (əvvəl):
Customer müraciət edir \u2192 Risk Department manual yoxlayır (3-5 gün) \u2192 Committee görüşü \u2192 Qərar

To-Be proses (sonra):
Customer müraciət edir \u2192 Scoring Engine avtomatik qiymətləndirir (60 saniyə) \u2192 Score >= 80: Auto-approve | Score 50-79: Manual review queue | Score < 50: Auto-reject \u2192 CRM bildiriş

Əsas elementlər: Start/End events (dairələr), User Tasks (kvadratlar), Exclusive Gateways (romblar), Service Tasks (dairəvi kvadratlar), Timer Events (saat simvolu).

As-Is diagramı çəkmək vacibdir çünki: bottleneck-ləri göstərir, stakeholder-lərə vizual izah edir, To-Be ilə müqayisə üçün baza verir.`],

  // Q6: Sequence Diagram
  ["Sequence diagram nə vaxt cəkirsən?", `Sequence diagramı sistem-lər arası inteqrasiya axını göstərmək üçün çəkirəm. BPMN prosesi göstərir, Sequence diagram isə "hansı sistem hansı sistemə müraciət edir" göstərir.

Embafinans-da Credit Scoring üçün:

Participants: Customer App | API Gateway | Scoring Service | Credit Bureau | Risk Rules Engine | Notification Service | Database

Flow:
1. Customer App \u2192 API Gateway: POST /scoring/submit
2. API Gateway \u2192 Scoring Service: forward request
3. Scoring Service \u2192 Credit Bureau: GET /score (real-time bureau score)
4. Bureau \u2192 Scoring Service: return score (720)
5. Scoring Service \u2192 Risk Rules Engine: evaluate (income, debt ratio, etc.)
6. Rules Engine \u2192 Scoring Service: decision (APPROVED, score 85)
7. Scoring Service \u2192 Database: save result
8. Scoring Service \u2192 Notification Service: trigger SMS
9. Notification Service \u2192 Customer: SMS "Your credit is approved"

Bu diagram developer-lara handedərkən yazıram \u2014 onlar gorendlər ki, hansi API call-lar var, nə order-də, nə data transfer olunur.`],

  // Q7: Gap Analysis
  ["Gap Analysis nədir, etmisən?", `Gap Analysis \u2014 hazırkı vəziyyət (As-Is) ilə istənilən vəziyyət (To-Be) arasındakı fərqin müəyyən edilməsi.

Embafinans-da Credit Scoring üçün etdim. Table formatında:

- Area: Credit Decision Speed | As-Is: 5-7 gün manual | To-Be: <60 saniyə avtomatik | Gap: Kritik sürət bottleneck | Priority: High | Action: Avtomatik scoring engine

- Area: Risk Assessment | As-Is: Subjective manual evaluation | To-Be: Multi-factor weighted scoring | Gap: Qeyri-konsistent risk qiymətləndirmə | Priority: High | Action: 5 faktorlu scoring modeli

- Area: Bureau Integration | As-Is: Telefon/fax sorğuları | To-Be: Real-time API | Gap: Gecikmiş bureau data | Priority: High | Action: Bureau API inteqrasiya

Gap Analysis-i edəndən sonra RICE framework ilə hər gap-ı prioritetləşdirirəm. Bəzən bir gap həll etmək başqa gap-ları da həll edir \u2014 bunu da qeyd edirəm.`],

  // Q8: RICE
  ["RICE framework-ü izah et", `RICE \u2014 requirement-ləri prioritetləşdirmək üçün framework. 4 metrik:

- R (Reach): Bu requirement neçə istifadəçiyə təsir edəcək? (aylıq)
- I (Impact): Təsir dərəcəsi? 1 = Minimal, 2 = Major, 3 = Massive
- C (Confidence): Nə qədər əminik? 100% = High, 80% = Medium, 50% = Low
- E (Effort): Neçə həftə/vaxt lazımdır?

Formula: RICE Score = (R x I x C) / E

Embafinans-da Credit Scoring üçün nümunə:

- REQ-101: Automated scoring engine | Reach: 400/month | Impact: 3 | Confidence: 90% | Effort: 8 weeks | RICE = (400 x 3 x 0.9) / 8 = 135

- REQ-102: Bureau API integration | Reach: 400 | Impact: 3 | Confidence: 85% | Effort: 3 | RICE = (400 x 3 x 0.85) / 3 = 340

- REQ-103: SMS notifications | Reach: 400 | Impact: 2 | Confidence: 95% | Effort: 1 | RICE = (400 x 2 x 0.95) / 1 = 760

Nəticə: SMS ən yüksək RICE score-ə malikdir \u2014 az effort, yüksək reach. Scoring engine isə ən vacibdir ama ən çox effort tələb edir.

WSJF-dən fərqi: RICE daha sadədir və SAFe-a bağlı deyil. Kontakt Home SAFe istifadə etmirsə, RICE daha uyğundur.`],

  // Q9: UAT
  ["UAT necə keçirsən?", `UAT \u2014 User Acceptance Testing. Layihə production-a getmədən əvvəl business stakeholders tərəfindən test edilir.

Embafinans-da prosesim belədir:

1. UAT Test Plan hazırlayıram \u2014 hansi test case-lər var, kim iştirak edir, nə vaxt
2. Test case-ləri BRD/FRD-dən çıxarıram \u2014 hər REQ üçün minimum 1 test case
3. Stakeholder-lərə test session təyin edirəm \u2014 Risk Department, Sales, Operations
4. Test execution \u2014 stakeholder-lər test edir, mən qeydləri aparıram
5. Bug triage \u2014 QA və developer-lərlə birlikdə hər bug-u müzakirə edirəm: severity (Critical/Major/Minor) və priority (High/Medium/Low)
6. Sign-off \u2014 bütün Critical bug-lar həll olunduqdan sonra stakeholder imza atır

Nuve test case: "TC-101: Happy path auto-approval \u2014 Score >= 80 olan müraciət avtomatik təsdiq olunmalıdır"

Əsas prinsip: UAT-da mən test etmirəm \u2014 mən koordinasiya edirəm. Test edən business user-dır.`],

  // Q10: Swagger
  ["Swagger/OpenAPI bilirsən?", `Bəli, Embafinans-da Credit Scoring API və B2C Payment API üçün Swagger/OpenAPI 3.0 spesifikasiya yazmışam.

Nümunə endpoint:

POST /v1/scoring/submit \u2014 Kredit müraciətini scoring engine-ə göndərir

Request body: applicant data (name, PIN, income, employment), credit product, requested amount

Response: applicationId, overallScore (0-100), decision (AUTO_APPROVED / MANUAL_REVIEW / AUTO_REJECTED), riskLevel, recommendedLimit

Swagger-da hər endpoint üçün yazıram:
- Description \u2014 endpoint nə edir
- Parameters \u2014 path, query, header params
- Request Body \u2014 JSON schema ilə validation
- Responses \u2014 200, 400, 500 status codes və schema-lar
- Example values \u2014 developer-lar üçün real nümunə

Swagger-nı developer-lərə handoff edərkən istifadə edirəm \u2014 onlar Swagger UI-dən test edə bilər, Postman-a export edə bilər.`],
];

group2.forEach(([q, a], i) => {
  children.push(spacer(60));
  children.push(questionTable(i + 3, q, a, i));
});

// ══════════════════════════════════════
// GROUP 3
// ══════════════════════════════════════
children.push(sectionTitle("Group 3: Kontakt Home Context"));

const group3 = [
  // Q11
  ["Kontakt Home-da kredit prosesini yavaslatan sebəbler nə ola bilər?", `Bu sualda mən real observaşnlarımı və analitik düşünməmi göstərirəm. Kredit prosesini yavaşladan potensial səbəblər:

- Bank cavabı gecikməsi: Partner bank-ların (TBC, Kapital Bank) API response time-i yüksək ola bilər, ya da manual proses var
- Müştəri məlumat toplamaq: Şəxsiyyət vəsiqəsi, gəlir sənədi, iş yeri təsdiqi \u2014 bu sənədlərin toplamağı və yoxlanması vaxt apara bilər
- Daxili koordinasiya: Satıcı → müdir → bank təmsilçisi axınında hər addım üçün gözləmə var
- Sistem inteqrasiya yoxluğu: Əgər bank API-si yoxdursa, manual zəng/fax prosesi gedir
- Pre-approval olmaması: Müştəri mağazaya gələndə onun kredit həddi məlum deyil \u2014 bu da əlavə gözləmə yaradır

Ən böyük bottleneck-in bank response time olduğunu düşünürəm \u2014 çünki digər addımları daxili optimallaşdırmaq mümkündür, amma bankın prosesini birbaşa kontrol etmək çətindir.`],

  // Q12
  ["Kredit prosesini suretlendirmek tapşirılsaydı, necə yanaşırdın?", `6 addımlı yanaşma:

1. Discovery: Əvvəlcə hazırkı prosesi anlamaq \u2014 mağazada observation, satıcılarla müsahibə, bank təmsilçisi ilə söhbət. BPMN As-Is diagram çəkərdim.

2. Data toplamaq: Neçə müraciət gedir? Neçəsi gözləmə səbəbindən ləğv olur? Ortalama gözləmə vaxtı neçə dəqiqədir? SQL query-lərlə data analiz.

3. Root cause müəyyən etmək: Bottleneck haradadır? Bank cavabı? Sənəd toplama? Daxili proses?

4. To-Be proses dizaynı: Əgər bank API-si varsa, avtomatik pre-approval system qura bilərəm. Əgər yoxdursa, bankla API inteqrasiya danışıqları.

5. RICE ilə prioritetləşdirmək: Hansı həlli əvvəl etmək ən çox dəyər qatır?

6. Pilot: Bir mağazada test edib, KPI-ləri ölçüb, sonra genişləndirmək.

Məsələ ondadır ki, mən həlli təklif etməzdən əvvəl məlumat toplamalıyam \u2014 təxminə görə deyil, data-ya əsaslanaraq.`],

  // Q13
  ["Stakeholder-lər kim olar?", `Kredit prosesində stakeholder-lər:

- Customer: Kredit alan şəxs \u2014 əsas受益者, gözləmə vaxtını azaltmaq istəyir
- Sales Associate: Mağazada satıcı \u2014 kredit prosesini həyata keçirir, sürətli olmaq istəyir ki, satış qaçırmasın
- Store Manager: Mağaza müdiri \u2014 satış konversiyasını artırmaq istəyir
- Finance Department: Kredit riskini idarə edir \u2014 səhv təsdiqlərin az olmasını istəyir
- IT Department: Sistem inteqrasiyasını həyata keçirir \u2014 texniki həlli tətbiq edir
- Partner Bank: Kredit verən bank \u2014 öz risk meyarlarına əməl etmək istəyir
- Operations: Kredit sənədləşmə və monitoring \u2014 prosesin rahat idarə olmasını istəyir

Hər stakeholder-in fərqli maraqları var. Məsələn: Sales sürət istəyir, Finance diqqət istəyir. BA kimi mənim vəzifəm bu maraqları tarazlamaqdır.`],

  // Q14
  ["Hansi KPI-ləri izlemek lazımdır?", `3 kateqoriyada KPI-lər:

Process KPI-ləri:
- Average credit processing time (dəqiqə) \u2014 hazırkı vəziyyəti biləndən sonra target müəyyən etmək olar
- Credit approval rate \u2014 müraciətlərin neçə faizi təsdiq olunur
- Customer abandonment rate \u2014 gözləmə səbəbindən neçə müştəri gedir

Business KPI-ləri:
- Credit-to-cash conversion \u2014 kreditlə satılan məhsulların ümumi satışa nisbəti
- Average ticket size (credit vs cash) \u2014 kreditlə alanda orta səbət daha böyük olur
- Revenue per credit sale \u2014 kredit faizindən əlavə gəlir

Customer KPI-ləri:
- Customer satisfaction score (NPS) \u2014 kredit prosesi barədə rəyi
- Time to first payment \u2014 kreditdən sonra ilk ödənişə qədər vaxt
- Default rate \u2014 kredit geri qaytarma faizi (Finance ilə birlikdə)

Əsas prinsip: Hər KPI ölçülə bilən, actionable olmalıdır. "Müştəri razıdır" KPI deyil \u2014 "NPS score > 40" KPI-dir.`],

  // Q15
  ["SWOT analiz edə bilerseN?", `Kontakt Home-un kredit prosesi üçün SWOT:

Strengths:
- Geniş mağaza şəbəkəsi \u2014 çoxlu customer base var
- Elektronika və məişət texnikası \u2014 yüksək qiymətli məhsullar = kredit ehtiyacı yüksək
- Mövcud bank partnership-lər \u2014 artıq kredit infrastrukturu var

Weaknesses:
- Kredit prosesi manual ola bilər \u2014 sürət və müşteri experince aşağı
- Data visibility yoxluğu \u2014 real-time monitoring olmaya bilər
- Cross-department coordination zəif — satış, finance, IT ayrı işləyir

Opportunities:
- Online credit application \u2014 onlayn kanalda kredit imkanı
- Pre-approval system \u2014 müştəri mağazaya gələndə artıq limiti məlum olsun
- Multiple bank comparison — bir neçə bankdan ən yaxşı şərti təklif etmək

Threats:
- Onlayn rəqiblər — media markt, onlayn mağazalar daha sürətli kredit təklif edə bilər
- Dəyişən bank şərtləri — faiz dərəcələri artarsa, kredit tələbi azala bilər
- Ekonomik qeyri-sabitlik — default riski arta bilər`],
];

group3.forEach(([q, a], i) => {
  children.push(spacer(60));
  children.push(questionTable(i + 11, q, a, i));
});

// ══════════════════════════════════════
// GROUP 4
// ══════════════════════════════════════
children.push(sectionTitle("Group 4: Scenario-Based Questions"));

const group4 = [
  // Q16
  ["Satıcılar sistem istifade etmək istemir \u2014 ne edersən?", `Bu çox real bir scenario \u2014 Embafinans-da da bənzər vəziyyət olub. Yanaşma:

1. Root cause anlamaq: Satıcılar niyə istifadə etmirlər? Sistem çətindir? Təlim yoxdur? Əlavə vaxt aparır? Yoxlamaq üçün bir neçə satıcı ilə individual söhbət edərdim.

2. Empathy göstərmək: Onların vəziyyətini anladığımı bildirərdim: "Siz hər gün satış edirsiniz, əlavə sistem vaxt aparır \u2014 mən bunu anlayıram."

3. Value proposition: Sistem onlara necə fayda verir? Kredit prosesi sürətlənərsə, daha çox satış edəcək \u2014 bu onların bonusuna təsir edir.

4. Simplify: Əgər sistem çətindirsə, UX-i sadələşdirmək üçün feedback developer-lara ötürərdim. Ən vacib funksiyaları 1-2 click-ə endirmək.

5. Pilot: "Bir həftə sınayaq \u2014 əgər satışınız artarsa, davam edək" deyərək kiçik qrupda pilot başladardım.

6. Success story: Pilot-u uğurlu olan satıcının nəticəsini digərlərinə göstərərdim \u2014 peer influence ən güclü motivasiyadır.

Əsla: "İstifadə etmək məcburiyyətindəsiniz" demək. Bu əks təsir edir.`],

  // Q17
  ["2 department muxtelif prioritet deyir \u2014 necə hell edersən?", `Embafinans-da bu vaxtaşırı olur \u2014 Sales "sürətli approval" istəyir, Risk "diqqətli yoxlama" istəyir.

Addımlar:

1. Hər tərəfin arqumentini dinləyirəm \u2014 tək-tək, digəri qarşısında deyil. Müsahibə formatında, structured suallarla.

2. Data gətirirəm \u2014 təxmin yox, sübut. SQL query ilə: "Son 3 ayda manual review-da neçə müraciət olub? Onların neçə faizi sonradan default olub?" Əgər default rate aşağıdırsa, Risk-in narahatlığı əsassızdır.

3. Kompromis tapıram: Məsələn, "Score >= 80 avtomatik təsdiq (Sales xoşbəxt), Score 50-79 manual review ancaq 24 saat ərzində (Risk xoşbəxt)"

4. RICE ilə həlli prioritetləşdirirəm \u2014 hər tərəfin təklifini RICE score-la qiymətləndirirəm. Rəqəm danışır.

5. Əgər razılığa gəlinmirsə \u2014 sponsor-a (rəis/director) aparıram: "İki variant var, hər birinin RICE score-u və data-backed risk qiymətləndirməsi var. Sizin qərarınız."

Əsas prinsip: Data ilə danış, emosiyalarla deyil.`],

  // Q18
  ["Developer deyir ki requirement mumkun deyil \u2014 ne edersən?", `Bu vəziyyətdə mənim engineering background böyük üstünlükdür — developer-in dilini danışıram.

1. "Niyə mümkün deyil?" soruşuram — konkret səbəb: texniki məhdudiyyət? Müddət? 3-cü tərəf API support yoxdur?

2. Əgər texniki məhdudiyyətdirsə: "Alternativ yolu varmı?" deyərəm. Məsələn, bank API-si real-time support etmirsə — batch processing (hər 15 dəqiqə) variantını müzakirə edək.

3. Əgər müddət məsələsidirsə: RICE score-a əsasən prioritetləşdirirəm. "Bu requirement RICE score 120-dir — əgər bu sprint-ə sığmırsa, növbəti sprint-ə keçək. Amma aşağı RICE score-lu requirement-ləri kəsək."

4. Əgər 3-cü tərəf məsələsidirsə: Vendor-lə digər variantları araşdırmaq üçün IT ilə birlikdə çalışaq.

5. Heç vaxt: "Lazımdır, etməlisiniz" demək. Əvəzinə: "Bu requirement-in biznes dəyəri budur — sizin texniki təklifiniz nədir?" deyərəm.`],

  // Q19
  ["Resin deyir bu hefte bitirmek lazımdır \u2014 amma 2 hefte lazimdir", `Bu sualda əsas odur ki: yalan deməmək.

Doğru cavab: "Bu requirement-in scope-u bunu tamamlamaq üçün minimum 2 həftə tələb edir. Əgər 1 həftəyə sıxışdırısaq, keyfiyyət düşər \u2014 bu da production-da bug-lara səbəb ola bilər."

Amma alternativ təklif edirəm:

1. MVP (Minimum Viable Product): "Ən vacib funksiyanı 1 həftəyə tamamlayaq, qalanını növbəti sprint-ə axıdıq." Məsələn, full scoring engine yox, sadəcə pre-screen API.

2. Phase approach: "Phase 1: Basic functionality (1 həftə), Phase 2: Full features (2-ci həftə)." Rəisə seçim verirəm.

3. Trade-off göstərirəm: "1 həftəyə etsek \u2014 bunları qurban veririk: [siyahı]. 2 həftəyə etsek \u2014 tam scope tamam olur."

Ən vacib prinsip: Yalan danışmaq qısa müddətdə xilas edər, amma uzun müddətdə etibarı məhv edər. Production-da bug çıxdıqda sənə deyəcəklər: "Sən 1 həftə boldun deyərdin."`],
];

group4.forEach(([q, a], i) => {
  children.push(spacer(60));
  children.push(questionTable(i + 16, q, a, i));
});

// ══════════════════════════════════════
// GROUP 5
// ══════════════════════════════════════
children.push(sectionTitle("Group 5: Technical Questions"));

const group5 = [
  // Q20
  ["SQL JOIN novlerini izah et", `4 əsas JOIN növü:

1. INNER JOIN: Hər iki cədvəldə uyğun qeyd olan sənədləri qaytarır.
Nuve: credit_applications INNER JOIN scoring_results ON application_id = id
\-\-\- Yalnız scorinq olunmuş müraciətləri göstərir

2. LEFT JOIN: Sol cədvəlin bütün qeydlərini qaytarır, sağ cədvəldə uyğun olmasa NULL.
Nuve: customers LEFT JOIN credit_applications ON customer_id = id
\-\-\- Bütün müştəriləri göstərir, kredit almayıb olarsa NULL

3. RIGHT JOIN: Sağ cədvəlin bütün qeydlərini qaytarır, solda uyğun olmasa NULL. (Az istifadə olunur)

4. FULL OUTER JOIN: Hər iki cədvəldə bütün qeydləri qaytarır, uyğun olmayan yerdə NULL.

Embafinans-da ən çox LEFT JOIN istifadə edirəm \u2014 "hansı müştərilər kredit almayıb" sualı üçün. INNER JOIN isə "scoring results ilə application details" birləşdirmək üçün.`],

  // Q21
  ["REST API nedir? HTTP metodları?", `REST \u2014 Representational State Transfer. Web API-lar üçün memarlıq stil.

4 əsas HTTP metodu:

- GET: Məlumat oxumaq. Nuve: GET /api/applications/123 \u2014 müraciət detalı
- POST: Yeni məlumat yaratmaq. Nuve: POST /api/scoring/submit \u2014 yeni scoring müraciəti
- PUT: Məlumatı tam yeniləmək. Nuve: PUT /api/applications/123 \u2014 müraciəti yenilə
- DELETE: Məlumat silmək. Nuve: DELETE /api/applications/123 \u2014 müraciəti sil

Əlavə: PATCH (qismən yeniləmə), OPTIONS (mümkün metodları göstərmə).

REST prinsipləri:
- Stateless: Hər request öz-özlüyündə tam olmalıdır, server session saxlamır
- Resource-based: URL-lər resource göstərir (/applications, /customers)
- HTTP status codes: 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 404 (Not Found), 500 (Server Error)

Embafinans-da Credit Scoring API-ni REST principles ilə dizayn etdim. Swagger/OpenAPI 3.0 ilə sənədləşdirdim.`],

  // Q22
  ["SDLC phases nelerdir?", `SDLC \u2014 Software Development Life Cycle. 6 əsas faz:

1. Planning: Layihənin scope-u, resource-lar, timeline müəyyən edilir. BA burada business case hazırlayır.

2. Requirements Analysis: BA-nın əsas fazası. Stakeholder sessiyaları, BRD/FRD yazmaq, User Stories. Embafinans-da Discovery + Requirements Documentation addımları bura düşür.

3. Design: System architecture, database schema, API dizayn. BA burada sequence diagram, data mapping hazırlayır. Developer-lərə handoff.

4. Development (Implementation): Developer-lər kod yazır. BA burada clarification suallarına cavab verir, change request-ləri idarə edir.

5. Testing: Unit test (developer), Integration test (QA), UAT (business stakeholders). BA UAT koordinasiya edir, bug triage aparır.

6. Deployment & Maintenance: Production-a buraxılış. BA post-deployment monitoring, feedback toplamaq.

Embafinans-da 4 layihənin hamısı bu sikl ilə gedib. BA hər fazada iştirak edir, amma ən çox 2-ci və 5-ci fazada aktiv olur.`],
];

group5.forEach(([q, a], i) => {
  children.push(spacer(60));
  children.push(questionTable(i + 20, q, a, i));
});

// ══════════════════════════════════════
// FOOTER NOTE
// ══════════════════════════════════════
children.push(spacer(200));
children.push(new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  columnWidths: [9906],
  borders: { ...noBorders, top: { style: BorderStyle.SINGLE, size: 2, color: LINE_CLR } },
  rows: [new TableRow({
    height: { value: 60, rule: "exact" },
    children: [new TableCell({ borders: noBorders, children: [new Paragraph({ children: [] })] })],
  })],
}));
children.push(spacer(40));
children.push(new Paragraph({
  spacing: { before: 0, after: 0, line: 260 },
  children: [new TextRun({
    text: "Remember: Do not memorize. Understand the logic and adapt to your own words and experience.",
    font: FONT, size: 18, italics: true, color: GRAY,
  })],
}));

// ══════════════════════════════════════
const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: FONT, size: 19, color: BODY },
        paragraph: { spacing: { line: 276 } },
      },
    },
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 850, bottom: 700, left: 950, right: 950 },
      },
    },
    children: children,
  }],
});

const OUTPUT = "/home/z/my-project/download/BA_Interview_Preparation_Kontakt_Home.docx";
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(OUTPUT, buffer);
  console.log("Document generated: " + OUTPUT);
});
