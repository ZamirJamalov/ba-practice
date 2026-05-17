import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_JUSTIFY, TA_CENTER
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily

# ── Fonts ──
pdfmetrics.registerFont(TTFont('Carlito', '/usr/share/fonts/truetype/english/Carlito-Regular.ttf'))
pdfmetrics.registerFont(TTFont('CarlitoBold', '/usr/share/fonts/truetype/english/Carlito-Bold.ttf'))
pdfmetrics.registerFont(TTFont('Tinos', '/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf'))
pdfmetrics.registerFont(TTFont('TinosBold', '/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf'))
registerFontFamily('Carlito', normal='Carlito', bold='CarlitoBold')
registerFontFamily('Tinos', normal='Tinos', bold='TinosBold')

# ── Colors ──
ACCENT = colors.HexColor('#2A6496')
DARK = colors.HexColor('#1A1A1A')
TEXT = colors.HexColor('#333333')
MUTED = colors.HexColor('#777777')
COMP_BG = colors.HexColor('#F0F4F8')

# ── Output ──
output_path = '/home/z/my-project/download/Zamir_Jamalov_IT_Project_Manager_CV.pdf'

doc = SimpleDocTemplate(
    output_path, pagesize=A4,
    leftMargin=1.5*cm, rightMargin=1.5*cm,
    topMargin=1.0*cm, bottomMargin=1.0*cm,
)

PAGE_W = A4[0] - 3.0*cm

# ── Styles ──
sName = ParagraphStyle('Name', fontName='Carlito', fontSize=22, leading=28, textColor=DARK, spaceAfter=1)
sTitle = ParagraphStyle('Title', fontName='Carlito', fontSize=12, leading=16, textColor=ACCENT, spaceAfter=4)
sContact = ParagraphStyle('Contact', fontName='Tinos', fontSize=10, leading=14, textColor=MUTED, alignment=TA_LEFT, spaceAfter=2)
sSectionHead = ParagraphStyle('SectionHead', fontName='Carlito', fontSize=10, leading=13, textColor=ACCENT, spaceBefore=8, spaceAfter=2)
sExpHeader = ParagraphStyle('ExpHeader', fontName='Carlito', fontSize=10, leading=13, textColor=DARK, spaceBefore=5, spaceAfter=0)
sExpRole = ParagraphStyle('ExpRole', fontName='Tinos', fontSize=9.5, leading=13, textColor=MUTED, spaceAfter=2)
sBody = ParagraphStyle('Body', fontName='Tinos', fontSize=9, leading=12.5, textColor=TEXT, alignment=TA_JUSTIFY, spaceAfter=2)
sBullet = ParagraphStyle('Bullet', fontName='Tinos', fontSize=9, leading=12, textColor=TEXT, leftIndent=16, bulletIndent=4, spaceAfter=1, alignment=TA_LEFT)
sSkillValue = ParagraphStyle('SkillValue', fontName='Tinos', fontSize=9, leading=12, textColor=TEXT, spaceAfter=2)
sEdu = ParagraphStyle('Edu', fontName='Tinos', fontSize=10, leading=15, textColor=TEXT, spaceAfter=2)


def section_hr():
    return HRFlowable(width="100%", thickness=1, color=ACCENT, spaceAfter=3, spaceBefore=1)

def bullet_text(text):
    return Paragraph('<bullet>&bull;</bullet> ' + text, sBullet)

def build():
    story = []

    # ══════════════════════════════════════
    # HEADER
    # ══════════════════════════════════════
    story.append(Paragraph('<b>ZAMIR JAMALOV</b>', sName))
    story.append(Paragraph('IT Project Manager  |  Fintech &amp; E-Commerce', sTitle))
    story.append(Paragraph(
        '+994 55 207 7228&nbsp;&nbsp;|&nbsp;&nbsp;jamalov.zamir@gmail.com&nbsp;&nbsp;|&nbsp;&nbsp;Baku, Azerbaijan',
        sContact
    ))
    story.append(Spacer(1, 4))
    story.append(HRFlowable(width="100%", thickness=1.5, color=ACCENT, spaceAfter=2))

    # ══════════════════════════════════════
    # PROFESSIONAL SUMMARY
    # ══════════════════════════════════════
    story.append(Paragraph('<b>PROFESSIONAL SUMMARY</b>', sSectionHead))
    story.append(section_hr())
    story.append(Paragraph(
        'IT Project Manager with <b>2+ years of project ownership</b> across fintech and e-commerce, '
        'having led 4 concurrent projects from inception to go-live on-time and within budget. '
        'Defined scope with WBS and SMART objectives, maintained Risk Registers, managed stakeholders via '
        'RACI and RAG reporting, and coordinated external vendor integrations. 15+ years engineering background '
        'enables technical oversight and vendor management. Skilled in Agile/Scrum, SQL, and Power BI.',
        sBody
    ))

    # ══════════════════════════════════════
    # CORE COMPETENCIES
    # ══════════════════════════════════════
    story.append(Paragraph('<b>CORE COMPETENCIES</b>', sSectionHead))
    story.append(section_hr())

    comp_data = [
        ['Scope Definition &amp; WBS',
         'Budget &amp; Resource Allocation',
         'Risk Register &amp; Mitigation'],
        ['Agile / Scrum / Waterfall / Hybrid',
         'Stakeholder Mgmt (RACI) &amp; RAG Reporting',
         'Change Management (CAB)'],
        ['Critical Path &amp; Milestone Tracking',
         'UAT Coordination &amp; Sign-off',
         'Vendor &amp; Dependency Management'],
    ]

    comp_cells = []
    for row in comp_data:
        comp_cells.append([
            Paragraph(f'<font color="{ACCENT.hexval()}">&#9679;</font> {item}', sSkillValue)
            for item in row
        ])

    comp_table = Table(comp_cells, colWidths=[PAGE_W/3]*3)
    comp_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), COMP_BG),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E0E0E0')),
    ]))
    story.append(comp_table)
    story.append(Spacer(1, 0))

    # ══════════════════════════════════════
    # PROFESSIONAL EXPERIENCE
    # ══════════════════════════════════════
    story.append(Paragraph('<b>PROFESSIONAL EXPERIENCE</b>', sSectionHead))
    story.append(section_hr())

    # --- Embafinans ---
    story.append(Paragraph('<b>Embafinans</b>  |  IT Project Manager', sExpHeader))
    story.append(Paragraph('2025 \u2013 Present  |  Fintech  |  Baku, Azerbaijan', sExpRole))

    story.append(Paragraph('<b>Projects Delivered (Full Ownership \u2014 Inception to Go-Live):</b>', sBody))
    story.append(bullet_text(
        'BNPL Credit Scoring \u2014 Owned end-to-end delivery; led team through scope, sprints, and UAT; '
        'achieved 2x faster decisions and on-time go-live'
    ))
    story.append(bullet_text(
        'B2C Sales Channel \u2014 Led full lifecycle delivery with payment gateway; managed workstreams '
        'across sales, IT, and vendors; delivered 300-500 daily applications'
    ))
    story.append(bullet_text(
        'Delivery Dashboard \u2014 Coordinated from requirements to sign-off; reduced errors by 50%'
    ))
    story.append(bullet_text(
        'Credit Lifecycle Platform \u2014 Oversaw delivery across 3 departments; zero critical defects at go-live'
    ))

    story.append(Spacer(1, 2))
    story.append(Paragraph('<b>Project Management Approach:</b>', sBody))
    story.append(bullet_text(
        'Scope &amp; WBS: Created Work Breakdown Structures and SMART objectives with KPIs and DoD'
    ))
    story.append(bullet_text(
        'Planning &amp; Execution: Built milestone roadmaps, tracked velocity/burndown in Jira, '
        'and managed critical path for on-time delivery'
    ))
    story.append(bullet_text(
        'Risk Management: Maintained Risk Register with probability/impact scoring; mitigated vendor delays, '
        'scope creep, and cross-team dependencies proactively'
    ))
    story.append(bullet_text(
        'Stakeholders &amp; Reporting: Implemented RACI matrix; delivered weekly RAG status reports to sponsors; '
        'aligned business and technical teams'
    ))
    story.append(bullet_text(
        'Budget: Allocated resources across 4 concurrent projects; tracked burn rate vs. baseline with contingency reserve'
    ))
    story.append(bullet_text(
        'Change &amp; Quality: Managed change requests via impact analysis; defined test strategy, '
        'coordinated UAT, led bug triage, and achieved sign-off across all releases'
    ))
    story.append(bullet_text(
        'Vendors: Managed external integrations (PayTabs, Kapital Bank, Cuzdan); '
        'coordinated sandbox testing, SLA compliance, and dependency resolution'
    ))

    # --- Birbonus ---
    story.append(Paragraph('<b>Birbonus</b>  |  IT Project Manager', sExpHeader))
    story.append(Paragraph('2024 \u2013 2025  |  Baku, Azerbaijan', sExpRole))

    story.append(bullet_text(
        'Owned end-to-end delivery of loyalty bonus system; led stakeholder alignment, scope, '
        'and partner onboarding; delivered on-time with full merchant adoption'
    ))
    story.append(bullet_text(
        'Built Power BI dashboards for data-driven project monitoring and executive reporting'
    ))

    # --- Umico ---
    story.append(Paragraph('<b>Umico</b>  |  L2 Support Team Lead', sExpHeader))
    story.append(Paragraph('2022 \u2013 2024  |  Baku, Azerbaijan', sExpRole))

    story.append(bullet_text(
        'Led L2 incident resolution team; managed SLA compliance via ELK Stack and cross-team coordination'
    ))
    story.append(bullet_text(
        'Supported partner API integration onboarding and vendor dependency management'
    ))

    # ══════════════════════════════════════
    # TECHNICAL FOUNDATION & EDUCATION
    # ══════════════════════════════════════
    story.append(Paragraph('<b>TECHNICAL FOUNDATION &amp; EDUCATION</b>', sSectionHead))
    story.append(section_hr())

    story.append(Paragraph(
        '15+ years across banking &amp; financial systems \u2014 software development, systems integration, '
        'and technical infrastructure: Central Bank of Azerbaijan (payment gateway &amp; Government Payment Portal), '
        'Unibank (mobile banking \u2014 Mobile Soft). C#/.NET, Oracle, MSSQL, PostgreSQL, MongoDB, Git, CI/CD, REST/SOAP APIs. '
        'Enables precise scope definition, technical oversight, and vendor management.',
        sBody
    ))
    story.append(Paragraph(
        '<b>Baku State University</b>  \u2014  BSc Applied Mathematics'
        '&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;'
        'Azerbaijani (Native)  |  Russian (Fluent)  |  English (Professional)',
        sEdu
    ))

    # Build
    doc.build(story)
    size = os.path.getsize(output_path)
    print(f"PDF created: {output_path}")
    print(f"Size: {size/1024:.1f} KB")

    try:
        import pdfplumber
        with pdfplumber.open(output_path) as pdf:
            print(f"Total pages: {len(pdf.pages)}")
    except Exception:
        print("Could not count pages")

build()
