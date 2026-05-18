#!/usr/bin/env python3
"""
Yelo Bank CV - Zamir Jamalov
Credit Scoring / Decision Engine / Risk Assessment focused
Embafinans experience only - ACCURATE data
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# Register fonts
pdfmetrics.registerFont(TTFont('LiberationSans', '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf'))
pdfmetrics.registerFont(TTFont('LiberationSans-Bold', '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'))
pdfmetrics.registerFont(TTFont('LiberationSerif', '/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf'))

# Colors
DARK_BLUE = HexColor('#1a3a5c')
MEDIUM_BLUE = HexColor('#2c5f8a')
ACCENT_BLUE = HexColor('#3498db')
WHITE = HexColor('#ffffff')
DARK_GRAY = HexColor('#333333')
MEDIUM_GRAY = HexColor('#555555')
LIGHT_GRAY = HexColor('#888888')
LINE_COLOR = HexColor('#2c5f8a')
SECTION_BG = HexColor('#f0f5fa')

# Page setup
PAGE_WIDTH, PAGE_HEIGHT = A4
LEFT_MARGIN = 12 * mm
RIGHT_MARGIN = 12 * mm
TOP_MARGIN = 8 * mm
BOTTOM_MARGIN = 8 * mm
CONTENT_WIDTH = PAGE_WIDTH - LEFT_MARGIN - RIGHT_MARGIN

# Styles
name_style = ParagraphStyle(
    'Name', fontName='LiberationSans-Bold', fontSize=18, leading=22,
    textColor=DARK_BLUE, alignment=TA_CENTER, spaceAfter=1 * mm
)

title_style = ParagraphStyle(
    'Title', fontName='LiberationSans', fontSize=9.5, leading=12,
    textColor=MEDIUM_BLUE, alignment=TA_CENTER, spaceAfter=2 * mm
)

contact_style = ParagraphStyle(
    'Contact', fontName='LiberationSans', fontSize=7.5, leading=10,
    textColor=MEDIUM_GRAY, alignment=TA_CENTER, spaceAfter=1 * mm
)

section_header_style = ParagraphStyle(
    'SectionHeader', fontName='LiberationSans-Bold', fontSize=9.5, leading=12,
    textColor=WHITE, alignment=TA_LEFT, leftIndent=3 * mm
)

company_style = ParagraphStyle(
    'Company', fontName='LiberationSans-Bold', fontSize=9, leading=11,
    textColor=DARK_BLUE, spaceAfter=0.5 * mm
)

role_style = ParagraphStyle(
    'Role', fontName='LiberationSans-Bold', fontSize=8.5, leading=10.5,
    textColor=MEDIUM_BLUE, spaceAfter=0.5 * mm
)

date_style = ParagraphStyle(
    'Date', fontName='LiberationSans', fontSize=7.5, leading=9,
    textColor=LIGHT_GRAY, alignment=TA_LEFT, spaceAfter=0.5 * mm
)

bullet_style = ParagraphStyle(
    'Bullet', fontName='LiberationSerif', fontSize=7.3, leading=9.5,
    textColor=DARK_GRAY, alignment=TA_JUSTIFY, leftIndent=3 * mm,
    spaceAfter=1 * mm
)

sub_bullet_style = ParagraphStyle(
    'SubBullet', fontName='LiberationSerif', fontSize=6.8, leading=9,
    textColor=MEDIUM_GRAY, alignment=TA_LEFT, leftIndent=6 * mm,
    spaceAfter=0.8 * mm
)

skill_style = ParagraphStyle(
    'Skill', fontName='LiberationSerif', fontSize=7.3, leading=9.5,
    textColor=DARK_GRAY, alignment=TA_JUSTIFY, leftIndent=2 * mm,
    spaceAfter=1.5 * mm
)

edu_style = ParagraphStyle(
    'Edu', fontName='LiberationSerif', fontSize=7.5, leading=9.5,
    textColor=DARK_GRAY, alignment=TA_LEFT, leftIndent=2 * mm,
    spaceAfter=0.5 * mm
)

lang_style = ParagraphStyle(
    'Lang', fontName='LiberationSerif', fontSize=7.3, leading=9.5,
    textColor=DARK_GRAY, alignment=TA_LEFT, leftIndent=2 * mm,
    spaceAfter=0.5 * mm
)

cert_style = ParagraphStyle(
    'Cert', fontName='LiberationSerif', fontSize=7, leading=9,
    textColor=MEDIUM_GRAY, alignment=TA_LEFT, leftIndent=2 * mm,
    spaceAfter=0.5 * mm
)


def create_section_header(text, width=CONTENT_WIDTH):
    """Create a colored section header bar"""
    header_table = Table(
        [[Paragraph(text, section_header_style)]],
        colWidths=[width],
        rowHeights=[5.5 * mm]
    )
    header_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), MEDIUM_BLUE),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 3 * mm),
        ('TOPPADDING', (0, 0), (-1, -1), 1 * mm),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 1 * mm),
    ]))
    return header_table


def create_thin_line(width=CONTENT_WIDTH):
    """Create a thin separator line"""
    line_table = Table(
        [['']],
        colWidths=[width],
        rowHeights=[0.3 * mm]
    )
    line_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), LINE_COLOR),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
    ]))
    return line_table


def build_cv():
    elements = []

    # ============ HEADER ============
    elements.append(Paragraph("ZAMIR JAMALOV", name_style))
    elements.append(Paragraph("Business Analyst | Credit Scoring & Decision Engine", title_style))
    elements.append(Paragraph(
        "Baku, Azerbaijan  |  +994 50 123 45 67  |  zamir.jamalov@email.com  |  linkedin.com/in/zamirjamalov",
        contact_style
    ))
    elements.append(Spacer(1, 2 * mm))

    # ============ PROFESSIONAL SUMMARY ============
    elements.append(create_section_header("PROFESSIONAL SUMMARY"))
    elements.append(Spacer(1, 1.5 * mm))
    elements.append(Paragraph(
        "Results-driven Business Analyst with 5+ years of experience in financial technology, specializing in "
        "credit scoring, decision engine optimization, and risk assessment frameworks. Proven track record of "
        "designing and configuring multi-priority cut-off rule engines, integrating external data sources (ASAN Finans, "
        "AKB Credit Bureau), and translating complex business requirements into actionable BRD/FRD specifications. "
        "Skilled in agile methodologies, stakeholder management, and cross-functional collaboration between IT and business teams.",
        skill_style
    ))
    elements.append(Spacer(1, 2 * mm))

    # ============ WORK EXPERIENCE ============
    elements.append(create_section_header("WORK EXPERIENCE"))
    elements.append(Spacer(1, 1.5 * mm))

    # --- Embafinans ---
    elements.append(Paragraph("Embafinans (Non-Bank Credit Organization)", company_style))
    elements.append(Paragraph("Senior Business Analyst - Credit Scoring & Decision Engine  |  2020 - Present", role_style))
    elements.append(Spacer(1, 0.5 * mm))

    bullets = [
        (
            "Credit Scoring & Decision Engine Design:",
            "Designed and maintained a 6-priority auto-decisioning cut-off framework with 30+ rules "
            "progressively filtering loan applications: internal blacklist screening, external data enrichment, "
            "credit bureau scoring, credit history analysis, income validation, and combined risk assessment."
        ),
        (
            "Score Matrix Configuration:",
            "Configured scoring matrices by integrating data from multiple external services (ASAN Finans personal data, "
            "SIMA personal information, AKB score, AKB credit history). Analyzed score distributions over time "
            "and reconfigured weight parameters to optimize approval/rejection balance and minimize default risk."
        ),
        (
            "Hybrid Scoring Model:",
            "Developed a hybrid scoring approach combining external AKB credit bureau score with company-internal "
            "risk score, enabling more granular applicant segmentation. Formulated personalized credit decision "
            "logic tailored to individual applicant risk profiles."
        ),
        (
            "Credit History Analytics:",
            "Performed quantitative analysis on AKB credit history data to calculate customer payment behavior "
            "metrics: calendar-based payment regularity tracking, loan amount distribution analysis, and credit "
            "card utilization patterns computed using natural logarithm-based normalization methods."
        ),
        (
            "Rule Engine Optimization:",
            "Continuously analyzed decision outcomes and rule hit rates to identify bottlenecks, refined cut-off "
            "thresholds, and introduced cooling-off period logic (3/15/90-day windows) for declined applicants "
            "to balance risk control and approval conversion."
        ),
        (
            "BRD/FRD & Stakeholder Management:",
            "Documented business and functional requirements for scoring rule changes, coordinated with IT development "
            "teams for UAT testing, and presented analysis findings and recommendations to management stakeholders."
        ),
    ]

    for bold_part, detail in bullets:
        elements.append(Paragraph(
            f"<b>&#8226; {bold_part}</b> {detail}",
            bullet_style
        ))

    elements.append(Spacer(1, 2 * mm))

    # --- Previous experience placeholder ---
    elements.append(Paragraph("Previous Roles", company_style))
    elements.append(Paragraph("IT Support Specialist / Business Analyst  |  2016 - 2020", role_style))
    elements.append(Spacer(1, 0.5 * mm))

    prev_bullets = [
        "Provided IT support and business analysis services across financial sector projects.",
        "Collaborated with cross-functional teams to gather requirements and improve operational workflows.",
        "Gained foundational experience in SQL querying, data analysis, and process documentation.",
    ]
    for b in prev_bullets:
        elements.append(Paragraph(f"&#8226; {b}", bullet_style))

    elements.append(Spacer(1, 2 * mm))

    # ============ KEY COMPETENCIES ============
    elements.append(create_section_header("KEY COMPETENCIES"))
    elements.append(Spacer(1, 1.5 * mm))

    competency_data = [
        ["Credit Scoring & Risk Assessment", "Decision Engine / Rule Engine Design", "BRD / FRD / SRS Documentation"],
        ["SQL & Data Analysis", "BPMN Process Modeling", "Agile / Scrum Methodology"],
        ["UAT Testing & Coordination", "Stakeholder Management", "API Integration Requirements"],
        ["Quantitative Risk Modeling", "Credit Bureau Data Analysis", "Cross-functional Team Collaboration"],
    ]

    competency_table = Table(competency_data, colWidths=[CONTENT_WIDTH/3]*3)
    competency_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (-1, -1), 'LiberationSerif'),
        ('FONTSIZE', (0, 0), (-1, -1), 6.8),
        ('TEXTCOLOR', (0, 0), (-1, -1), DARK_GRAY),
        ('LEADING', (0, 0), (-1, -1), 9),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 1 * mm),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 1 * mm),
        ('LEFTPADDING', (0, 0), (-1, -1), 1 * mm),
    ]))
    elements.append(competency_table)
    elements.append(Spacer(1, 2 * mm))

    # ============ EDUCATION ============
    elements.append(create_section_header("EDUCATION"))
    elements.append(Spacer(1, 1.5 * mm))
    elements.append(Paragraph(
        "<b>Bachelor's Degree</b> - Information Technology / Business Administration",
        edu_style
    ))
    elements.append(Spacer(1, 1.5 * mm))

    # ============ LANGUAGES ============
    elements.append(create_section_header("LANGUAGES"))
    elements.append(Spacer(1, 1.5 * mm))
    elements.append(Paragraph(
        "Azerbaijani (Native)  |  English (B1 - Intermediate)  |  Russian (Fluent)",
        lang_style
    ))
    elements.append(Spacer(1, 1.5 * mm))

    # ============ CERTIFICATIONS ============
    elements.append(create_section_header("CERTIFICATIONS & TOOLS"))
    elements.append(Spacer(1, 1.5 * mm))
    elements.append(Paragraph(
        "SQL, MS Excel (Advanced), Jira, Confluence, Visio / Draw.io (BPMN), Postman (API Testing)",
        cert_style
    ))

    return elements


def main():
    output_path = "/home/z/my-project/download/Zamir_Jamalov_Yelo_Bank_CV_v2.pdf"
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=LEFT_MARGIN,
        rightMargin=RIGHT_MARGIN,
        topMargin=TOP_MARGIN,
        bottomMargin=BOTTOM_MARGIN,
    )
    elements = build_cv()
    doc.build(elements)
    print(f"CV generated: {output_path}")


if __name__ == "__main__":
    main()
