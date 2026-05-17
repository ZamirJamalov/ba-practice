import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_JUSTIFY, TA_CENTER, TA_RIGHT
from reportlab.lib import colors
from reportlab.lib.units import cm, mm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, KeepTogether
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily

# ── Fonts ──
pdfmetrics.registerFont(TTFont('Carlito', '/usr/share/fonts/truetype/english/Carlito-Regular.ttf'))
pdfmetrics.registerFont(TTFont('CarlitoBold', '/usr/share/fonts/truetype/english/Carlito-Bold.ttf'))
pdfmetrics.registerFont(TTFont('Tinos', '/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf'))
pdfmetrics.registerFont(TTFont('TinosBold', '/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf'))
pdfmetrics.registerFont(TTFont('DejaVuSans', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
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
output_path = '/home/z/my-project/download/Zamir_Jamalov_IT_Support_Specialist_CV.pdf'

doc = SimpleDocTemplate(
    output_path,
    pagesize=A4,
    leftMargin=1.8*cm,
    rightMargin=1.8*cm,
    topMargin=1.2*cm,
    bottomMargin=1.2*cm,
)

PAGE_W = A4[0] - 3.6*cm  # available width

# ── Styles ──
sName = ParagraphStyle(
    'Name', fontName='Carlito', fontSize=24, leading=30,
    textColor=DARK, spaceAfter=2
)
sTitle = ParagraphStyle(
    'Title', fontName='Carlito', fontSize=13, leading=18,
    textColor=ACCENT, spaceAfter=6
)
sContact = ParagraphStyle(
    'Contact', fontName='Tinos', fontSize=10, leading=14,
    textColor=MUTED, alignment=TA_CENTER, spaceAfter=2
)
sSectionHead = ParagraphStyle(
    'SectionHead', fontName='Carlito', fontSize=11, leading=16,
    textColor=ACCENT, spaceBefore=14, spaceAfter=4
)
sExpHeader = ParagraphStyle(
    'ExpHeader', fontName='Carlito', fontSize=11, leading=16,
    textColor=DARK, spaceBefore=10, spaceAfter=2
)
sExpRole = ParagraphStyle(
    'ExpRole', fontName='Tinos', fontSize=10, leading=14,
    textColor=MUTED, spaceAfter=4
)
sBody = ParagraphStyle(
    'Body', fontName='Tinos', fontSize=10, leading=15,
    textColor=TEXT, alignment=TA_JUSTIFY, spaceAfter=4
)
sBullet = ParagraphStyle(
    'Bullet', fontName='Tinos', fontSize=10, leading=15,
    textColor=TEXT, leftIndent=18, bulletIndent=6,
    spaceAfter=4, alignment=TA_LEFT
)
sSkillLabel = ParagraphStyle(
    'SkillLabel', fontName='Carlito', fontSize=10, leading=14,
    textColor=DARK, spaceAfter=1
)
sSkillValue = ParagraphStyle(
    'SkillValue', fontName='Tinos', fontSize=10, leading=14,
    textColor=TEXT, spaceAfter=6
)
sEdu = ParagraphStyle(
    'Edu', fontName='Tinos', fontSize=10, leading=15,
    textColor=TEXT, spaceAfter=2
)


def section_hr():
    return HRFlowable(width="100%", thickness=1.2, color=ACCENT, spaceAfter=6, spaceBefore=2)

def bullet_text(text):
    return Paragraph('<bullet>&bull;</bullet> ' + text, sBullet)

def build():
    story = []

    # ══════════════════════════════════════
    # HEADER
    # ══════════════════════════════════════
    story.append(Paragraph('<b>ZAMIR JAMALOV</b>', sName))
    story.append(Paragraph('IT Support Specialist  |  Fintech &amp; Payment Systems', sTitle))
    story.append(Paragraph(
        '+994 55 207 7228&nbsp;&nbsp;|&nbsp;&nbsp;jamalov.zamir@gmail.com&nbsp;&nbsp;|&nbsp;&nbsp;Baku, Azerbaijan',
        sContact
    ))
    story.append(Spacer(1, 6))
    story.append(HRFlowable(width="100%", thickness=1.5, color=ACCENT, spaceAfter=4))

    # ══════════════════════════════════════
    # PROFESSIONAL SUMMARY
    # ══════════════════════════════════════
    story.append(Paragraph('<b>PROFESSIONAL SUMMARY</b>', sSectionHead))
    story.append(section_hr())
    story.append(Paragraph(
        'Results-driven IT Support Specialist with hands-on experience in merchant onboarding, '
        'API integration support, incident management, and back-office administration across fintech '
        'and e-commerce platforms. Proven ability to guide merchants through full technical integration '
        'lifecycles \u2014 from test environment setup and test case execution to production go-live. '
        'Strong foundation in networking essentials, log analysis, REST API troubleshooting, and '
        'payment processing workflows. Backed by 15+ years of engineering experience in the banking '
        'sector, enabling rapid root cause analysis and precise technical communication with both '
        'technical and non-technical stakeholders.',
        sBody
    ))

    # ══════════════════════════════════════
    # CORE COMPETENCIES
    # ══════════════════════════════════════
    story.append(Paragraph('<b>CORE COMPETENCIES</b>', sSectionHead))
    story.append(section_hr())

    comp_data = [
        ['Merchant Onboarding &amp; API Integration',
         'Incident Management &amp; Troubleshooting',
         'Log Analysis &amp; Root Cause Investigation'],
        ['Network Diagnostics (DNS, IP, HTTP/S)',
         'REST API Testing &amp; Postman',
         'Back-Office Administration &amp; Configuration'],
        ['Payment Processing Workflows',
         'Technical Documentation &amp; FAQs',
         'Credential &amp; Access Management'],
        ['SQL &amp; PostgreSQL',
         'Agile / Scrum / Jira',
         'Stakeholder Communication'],
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
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E0E0E0')),
    ]))
    story.append(comp_table)
    story.append(Spacer(1, 6))

    # ══════════════════════════════════════
    # PROFESSIONAL EXPERIENCE
    # ══════════════════════════════════════
    story.append(Paragraph('<b>PROFESSIONAL EXPERIENCE</b>', sSectionHead))
    story.append(section_hr())

    # --- Embafinans ---
    story.append(Paragraph('<b>Embafinans</b>  |  Business Analyst / Integration Support', sExpHeader))
    story.append(Paragraph('2025 \u2013 Present  |  Baku, Azerbaijan', sExpRole))

    story.append(bullet_text(
        'Managed end-to-end API integration lifecycle for merchant partners, guiding them through '
        'technical onboarding via developer communication, test environment configuration, and '
        'comprehensive test case design and execution'
    ))
    story.append(bullet_text(
        'Coordinated with merchant development teams through direct communication channels to '
        'troubleshoot integration issues, validate API endpoints, and ensure seamless data exchange'
    ))
    story.append(bullet_text(
        'Executed full integration testing in test environments before authorizing production go-live, '
        'verifying payment transactions, error handling, and credential configurations'
    ))
    story.append(bullet_text(
        'Developed and maintained technical documentation including API integration guides, '
        'troubleshooting manuals, and FAQ resources for merchant self-service support'
    ))
    story.append(bullet_text(
        'Defined REST API specifications in Swagger/OpenAPI 3.0 and performed endpoint testing '
        'using Postman to validate request/response structures and error codes'
    ))
    story.append(bullet_text(
        'Administered back-office operations within internal systems, managing merchant credentials, '
        'configuration settings, and access permissions with strict security protocols'
    ))
    story.append(bullet_text(
        'Delivered 4 major fintech projects including BNPL Credit Scoring system (2x faster decisions) '
        'and B2C Payment Gateway (300\u2013500 daily transactions)'
    ))

    # --- Birbonus ---
    story.append(Paragraph('<b>Birbonus</b>  |  Business Analyst / Merchant Integration', sExpHeader))
    story.append(Paragraph('2024 \u2013 2025  |  Baku, Azerbaijan', sExpRole))

    story.append(bullet_text(
        'Onboarded partner merchants onto the loyalty bonus platform, providing hands-on '
        'technical support for API-based integration and payment configuration workflows'
    ))
    story.append(bullet_text(
        'Created detailed test cases and conducted integration testing to verify merchant '
        'transaction flows, bonus accumulation logic, and settlement processes'
    ))
    story.append(bullet_text(
        'Served as the primary technical point of contact for merchant partners, translating '
        'complex integration requirements into clear step-by-step guidance for non-technical stakeholders'
    ))
    story.append(bullet_text(
        'Managed merchant credentials, backend access permissions, and configuration settings '
        'within the platform admin panel'
    ))

    # --- Umico ---
    story.append(Paragraph('<b>Umico</b>  |  PostgreSQL Developer &amp; L2 Support Specialist', sExpHeader))
    story.append(Paragraph('2022 \u2013 2024  |  Baku, Azerbaijan', sExpRole))

    story.append(bullet_text(
        'Resolved L2 production incidents by analyzing system logs (ELK Stack), identifying root causes '
        'of transaction failures, and implementing fixes to restore service availability'
    ))
    story.append(bullet_text(
        'Utilized network diagnostic tools (ping, traceroute, nslookup) and HTTP/S protocol knowledge '
        'to troubleshoot connectivity issues between microservices and external APIs'
    ))
    story.append(bullet_text(
        'Administered PostgreSQL databases including query optimization, data migration, and '
        'performance monitoring for high-traffic e-commerce operations'
    ))
    story.append(bullet_text(
        'Provided technical support to partner development teams for API integration onboarding, '
        'including endpoint configuration, authentication setup, and error resolution'
    ))
    story.append(bullet_text(
        'Documented recurring issues and solutions in knowledge base articles to streamline '
        'incident resolution and enable L1 support team self-service'
    ))

    # ══════════════════════════════════════
    # TECHNICAL FOUNDATION
    # ══════════════════════════════════════
    story.append(Paragraph('<b>TECHNICAL FOUNDATION</b>', sSectionHead))
    story.append(section_hr())

    story.append(Paragraph(
        '<b>Central Bank of Azerbaijan &amp; Unibank</b>  |  Software Engineer',
        sExpHeader
    ))
    story.append(Paragraph(
        '15+ years of engineering experience in the banking and financial services sector, '
        'specializing in payment processing systems, secure transaction handling, and '
        'data protection protocols. Built and maintained core banking applications using '
        'C#/.NET, Oracle, MSSQL, and PostgreSQL. Deep understanding of DNS, IP addressing, '
        'HTTP/S protocols, and cybersecurity principles as applied to financial systems. '
        'This foundation enables rapid diagnosis of technical issues in payment ecosystems.',
        sBody
    ))

    # ══════════════════════════════════════
    # EDUCATION
    # ══════════════════════════════════════
    story.append(Paragraph('<b>EDUCATION</b>', sSectionHead))
    story.append(section_hr())

    story.append(Paragraph(
        '<b>Baku State University</b>  \u2014  Bachelor of Science in Applied Mathematics',
        sEdu
    ))
    story.append(Paragraph(
        'Relevant coursework: Discrete Mathematics, Algorithms &amp; Data Structures, '
        'Database Systems, Probability &amp; Statistics, Mathematical Modeling',
        ParagraphStyle('EduDetail', fontName='Tinos', fontSize=9.5, leading=14,
                       textColor=MUTED, leftIndent=0, spaceAfter=2)
    ))

    # ══════════════════════════════════════
    # LANGUAGES
    # ══════════════════════════════════════
    story.append(Paragraph('<b>LANGUAGES</b>', sSectionHead))
    story.append(section_hr())

    lang_data = [
        ['Azerbaijani', 'Native'],
        ['Russian', 'Fluent'],
        ['English', 'Professional Working Proficiency'],
    ]
    lang_cells = []
    for lang, level in lang_data:
        lang_cells.append([
            Paragraph(f'<b>{lang}</b>', sSkillLabel),
            Paragraph(level, sSkillValue),
        ])

    lang_table = Table(lang_cells, colWidths=[PAGE_W*0.3, PAGE_W*0.7])
    lang_table.setStyle(TableStyle([
        ('TOPPADDING', (0, 0), (-1, -1), 2),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(lang_table)

    # Build
    doc.build(story)

    size = os.path.getsize(output_path)
    print(f"PDF created: {output_path}")
    print(f"Size: {size/1024:.1f} KB")

    # Page count
    try:
        import pdfplumber
        with pdfplumber.open(output_path) as pdf:
            print(f"Total pages: {len(pdf.pages)}")
    except Exception:
        print("Could not count pages")

build()
