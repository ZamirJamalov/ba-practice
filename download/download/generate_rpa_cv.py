import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_JUSTIFY, TA_CENTER
from reportlab.lib import colors
from reportlab.lib.units import cm, mm
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
LIGHT_LINE = colors.HexColor('#CCCCCC')
COMP_BG = colors.HexColor('#F0F4F8')

# ── Output ──
output_path = '/home/z/my-project/download/Zamir_Jamalov_RPA_Developer_CV.pdf'

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
sExpHeader = ParagraphStyle('ExpHeader', fontName='Carlito', fontSize=10, leading=13, textColor=DARK, spaceBefore=6, spaceAfter=0)
sExpRole = ParagraphStyle('ExpRole', fontName='Tinos', fontSize=9.5, leading=13, textColor=MUTED, spaceAfter=2)
sBody = ParagraphStyle('Body', fontName='Tinos', fontSize=9, leading=13, textColor=TEXT, alignment=TA_JUSTIFY, spaceAfter=2)
sBullet = ParagraphStyle('Bullet', fontName='Tinos', fontSize=9, leading=13, textColor=TEXT, leftIndent=16, bulletIndent=4, spaceAfter=2, alignment=TA_LEFT)
sSkillLabel = ParagraphStyle('SkillLabel', fontName='Carlito', fontSize=10, leading=14, textColor=DARK, spaceAfter=1)
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
    story.append(Paragraph('RPA Developer  |  Process Automation &amp; API Integration', sTitle))
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
        'Results-driven RPA Developer with hands-on experience in business process analysis, '
        'API integration, and automation delivery across fintech and e-commerce platforms. '
        'Strong foundation in C#/.NET, SQL, REST/SOAP APIs, and system integration. '
        'Proven ability to analyze As-Is workflows, design automated processes, and deliver solutions '
        'that reduce manual effort. Leveraging 15+ years in software engineering for rapid development '
        'and cross-system data exchange.',
        sBody
    ))

    # ══════════════════════════════════════
    # CORE COMPETENCIES
    # ══════════════════════════════════════
    story.append(Paragraph('<b>CORE COMPETENCIES</b>', sSectionHead))
    story.append(section_hr())

    comp_data = [
        ['Business Process Analysis &amp; Automation',
         'RPA Bot Development &amp; UiPath',
         'API Integration (REST/SOAP, JSON/XML)'],
        ['SQL Queries &amp; Data Analysis',
         'C# / .NET &amp; Python',
         'Git &amp; CI/CD Pipelines'],
        ['UAT Planning &amp; Coordination',
         'Technical Documentation (BRD/FRD/SRS)',
         'ERP Systems &amp; Data Exchange'],
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
    story.append(Paragraph('<b>Embafinans</b>  |  IT Business Analyst / Automation Specialist', sExpHeader))
    story.append(Paragraph('2025 \u2013 Present  |  Baku, Azerbaijan', sExpRole))

    story.append(bullet_text(
        'Analyzed business processes using BPMN As-Is/To-Be modeling; identified manual steps '
        'for automation, reducing credit processing time by 2x'
    ))
    story.append(bullet_text(
        'Designed REST API specs in Swagger/OpenAPI 3.0 for payment gateway and wallet systems; '
        'managed cross-system data exchange with external partners via JSON/XML'
    ))
    story.append(bullet_text(
        'Built automated credit pre-screen system: replaced manual multi-factor evaluation '
        'with automated workflow, achieving 2x faster decisions'
    ))
    story.append(bullet_text(
        'Developed real-time delivery tracking dashboard with digital e-signature, '
        'automating document flow and reducing errors by 2x'
    ))
    story.append(bullet_text(
        'Coordinated UAT with stakeholders, led bug triage, and achieved on-time sign-off '
        'across 4 major release cycles'
    ))
    story.append(bullet_text(
        'Authored BRD/FRD/SRS with REQ-101 requirements and traceability matrix for developer handoff'
    ))
    story.append(bullet_text(
        'Used SQL (JOIN, GROUP BY, Subqueries) to resolve stakeholder conflicts and '
        'present data-driven process improvement recommendations'
    ))

    # --- Birbonus ---
    story.append(Paragraph('<b>Birbonus</b>  |  IT Business Analyst', sExpHeader))
    story.append(Paragraph('2024 \u2013 2025  |  Baku, Azerbaijan', sExpRole))

    story.append(bullet_text(
        'Analyzed loyalty workflows; designed automated earning rules, eligibility criteria, '
        'and partner settlement processes'
    ))
    story.append(bullet_text(
        'Defined API integration requirements for partner merchant onboarding '
        'and real-time transaction data exchange'
    ))

    # --- Umico ---
    story.append(Paragraph('<b>Umico</b>  |  PostgreSQL Developer &amp; L2 Support', sExpHeader))
    story.append(Paragraph('2022 \u2013 2024  |  Baku, Azerbaijan', sExpRole))

    story.append(bullet_text(
        'Built backend features with PostgreSQL and Python; resolved L2 incidents via ELK Stack log analysis'
    ))
    story.append(bullet_text(
        'Supported partner API integration: endpoint configuration, JSON validation, '
        'and error resolution for cross-system data exchange'
    ))

    # ══════════════════════════════════════
    # TECHNICAL FOUNDATION & EDUCATION
    # ══════════════════════════════════════
    story.append(Paragraph('<b>TECHNICAL FOUNDATION &amp; EDUCATION</b>', sSectionHead))
    story.append(section_hr())

    story.append(Paragraph(
        '<b>Software Engineer</b> \u2014 15+ years: Central Bank of Azerbaijan (payment gateway &amp; '
        'Government Payment Portal), Unibank (mobile banking \u2014 Mobile Soft). C#/.NET backend, '
        'Oracle, MSSQL, PostgreSQL, MongoDB, Git, CI/CD, REST/SOAP APIs, XML data exchange.',
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
