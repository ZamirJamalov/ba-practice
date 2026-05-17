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
    leftMargin=1.5*cm,
    rightMargin=1.5*cm,
    topMargin=1.0*cm,
    bottomMargin=1.0*cm,
)

PAGE_W = A4[0] - 3.0*cm  # available width

# ── Styles ──
sName = ParagraphStyle(
    'Name', fontName='Carlito', fontSize=22, leading=28,
    textColor=DARK, spaceAfter=1
)
sTitle = ParagraphStyle(
    'Title', fontName='Carlito', fontSize=12, leading=16,
    textColor=ACCENT, spaceAfter=4
)
sContact = ParagraphStyle(
    'Contact', fontName='Tinos', fontSize=10, leading=14,
    textColor=MUTED, alignment=TA_LEFT, spaceAfter=2
)
sSectionHead = ParagraphStyle(
    'SectionHead', fontName='Carlito', fontSize=10, leading=13,
    textColor=ACCENT, spaceBefore=8, spaceAfter=2
)
sExpHeader = ParagraphStyle(
    'ExpHeader', fontName='Carlito', fontSize=10, leading=13,
    textColor=DARK, spaceBefore=6, spaceAfter=0
)
sExpRole = ParagraphStyle(
    'ExpRole', fontName='Tinos', fontSize=9.5, leading=13,
    textColor=MUTED, spaceAfter=2
)
sBody = ParagraphStyle(
    'Body', fontName='Tinos', fontSize=9, leading=13,
    textColor=TEXT, alignment=TA_JUSTIFY, spaceAfter=2
)
sBullet = ParagraphStyle(
    'Bullet', fontName='Tinos', fontSize=9, leading=13,
    textColor=TEXT, leftIndent=16, bulletIndent=4,
    spaceAfter=2, alignment=TA_LEFT
)
sSkillLabel = ParagraphStyle(
    'SkillLabel', fontName='Carlito', fontSize=10, leading=14,
    textColor=DARK, spaceAfter=1
)
sSkillValue = ParagraphStyle(
    'SkillValue', fontName='Tinos', fontSize=9, leading=12,
    textColor=TEXT, spaceAfter=2
)
sEdu = ParagraphStyle(
    'Edu', fontName='Tinos', fontSize=10, leading=15,
    textColor=TEXT, spaceAfter=2
)


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
    story.append(Paragraph('IT Support Specialist  |  Fintech &amp; Payment Systems', sTitle))
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
        'Results-driven IT Support Specialist with hands-on experience in merchant onboarding, '
        'API integration support, incident management, and back-office administration across fintech '
        'and e-commerce platforms. Guided merchants through full integration lifecycles \u2014 from test '
        'environment setup to production go-live. Strong foundation in networking, log analysis, REST API '
        'troubleshooting, and payment processing workflows. Leveraging a strong engineering background in '
        'banking systems for rapid root cause analysis and effective collaboration with external partners.',
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
        ['Network Tools (ping, telnet, ipconfig, traceroute)',
         'REST API Testing &amp; Postman',
         'Back-Office Administration'],
        ['Payment Processing Workflows',
         'Cybersecurity &amp; Data Protection',
         'Technical Documentation &amp; FAQs'],
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
    story.append(Paragraph('<b>Embafinans</b>  |  Integration &amp; Support Specialist', sExpHeader))
    story.append(Paragraph('2025 \u2013 Present  |  Baku, Azerbaijan', sExpRole))

    story.append(bullet_text(
        'Managed end-to-end merchant onboarding \u2014 from sandbox/test environment setup and API key '
        'provisioning to test case execution and production go-live'
    ))
    story.append(bullet_text(
        'Tested REST API endpoints using Postman, validated JSON payloads, HTTP status codes, '
        'and error responses; troubleshot integration issues by coordinating with merchant dev teams'
    ))
    story.append(bullet_text(
        'Created technical documentation (Confluence) including API integration guides, '
        'error code references, and troubleshooting manuals for merchant self-service'
    ))
    story.append(bullet_text(
        'Administered back-office operations: managed merchant credentials, webhook URLs, and '
        'access permissions following PCI-DSS security standards'
    ))
    story.append(bullet_text(
        'Built PayTabs card tokenization workflow for credit payouts via Kapital Bank \u2014 card registration, '
        'token issuance, and reconciliation; coordinated with bank and PayTabs support on failed transactions'
    ))
    story.append(bullet_text(
        'Integrated Cuzdan wallet via direct API for automated credit disbursements to customer accounts; '
        'analyzed application and API logs to diagnose integration failures'
    ))

    # --- Birbonus ---
    story.append(Paragraph('<b>Birbonus</b>  |  Merchant Integration Specialist', sExpHeader))
    story.append(Paragraph('2024 \u2013 2025  |  Baku, Azerbaijan', sExpRole))

    story.append(bullet_text(
        'Onboarded partner merchants with hands-on API integration support and payment configuration'
    ))
    story.append(bullet_text(
        'Created test cases and conducted integration testing to verify transaction '
        'flows, bonus logic, and settlement processes'
    ))
    story.append(bullet_text(
        'Served as primary technical contact for merchants, translating complex integration '
        'requirements into step-by-step guidance; managed credentials and admin panel settings'
    ))

    # --- Umico ---
    story.append(Paragraph('<b>Umico</b>  |  L2 Support Specialist', sExpHeader))
    story.append(Paragraph('2022 \u2013 2024  |  Baku, Azerbaijan', sExpRole))

    story.append(bullet_text(
        'Resolved L2 production incidents via ELK Stack/Kibana log analysis, identifying root causes '
        'of transaction failures, escalating to dev teams when needed, and meeting SLA targets'
    ))
    story.append(bullet_text(
        'Used network diagnostic tools (ping, telnet, ipconfig, traceroute, nslookup) and HTTP/S '
        'knowledge to troubleshoot connectivity issues between services and external APIs'
    ))
    story.append(bullet_text(
        'Provided technical support to partner teams for API integration onboarding \u2014 endpoint '
        'configuration, authentication setup, and error resolution'
    ))

    # ══════════════════════════════════════
    # TECHNICAL FOUNDATION & EDUCATION
    # ══════════════════════════════════════
    story.append(Paragraph('<b>TECHNICAL FOUNDATION &amp; EDUCATION</b>', sSectionHead))
    story.append(section_hr())

    story.append(Paragraph(
        '<b>15+</b> years across banking &amp; financial systems \u2014 hands-on in software development, '
        'systems integration, and technical infrastructure: Central Bank of Azerbaijan (payment gateway '
        'systems &amp; Government Payment Portal \u2014 systems integrator), Unibank (mobile banking '
        'backend \u2014 Mobile Soft). Deep understanding of DNS, IP, HTTPS/TLS, and cybersecurity principles.',
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

    # Page count
    try:
        import pdfplumber
        with pdfplumber.open(output_path) as pdf:
            print(f"Total pages: {len(pdf.pages)}")
    except Exception:
        print("Could not count pages")

build()
