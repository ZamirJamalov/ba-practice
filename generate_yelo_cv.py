#!/usr/bin/env python3
"""
Zamir Jamalov - IT Business Analyst CV for Yelo Bank (Risk Modeling / Scoring Squad)
1 page, compressed format.
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm, mm
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily

# -- Fonts --
pdfmetrics.registerFont(TTFont('Cal', '/usr/share/fonts/truetype/english/Carlito-Regular.ttf'))
pdfmetrics.registerFont(TTFont('CalB', '/usr/share/fonts/truetype/english/Carlito-Bold.ttf'))
pdfmetrics.registerFont(TTFont('CalI', '/usr/share/fonts/truetype/english/Carlito-Italic.ttf'))
pdfmetrics.registerFont(TTFont('CalBI', '/usr/share/fonts/truetype/english/Carlito-BoldItalic.ttf'))
registerFontFamily('Cal', normal='Cal', bold='CalB', italic='CalI', boldItalic='CalBI')

# -- Colors --
ACCENT = colors.HexColor('#1a6b7a')
DARK = colors.HexColor('#1e1e1e')
MUTED = colors.HexColor('#555555')
LINE = colors.HexColor('#cccccc')
LIGHT_BG = colors.HexColor('#f7f9fa')

# -- Styles --
name_style = ParagraphStyle(name='Name', fontName='CalB', fontSize=18, leading=22, textColor=ACCENT, alignment=TA_CENTER)
title_style = ParagraphStyle(name='Title', fontName='Cal', fontSize=10, leading=13, textColor=MUTED, alignment=TA_CENTER)
contact_style = ParagraphStyle(name='Contact', fontName='Cal', fontSize=8.5, leading=11, textColor=MUTED, alignment=TA_CENTER)

section_style = ParagraphStyle(name='Section', fontName='CalB', fontSize=10, leading=13, textColor=ACCENT, spaceBefore=5, spaceAfter=2)
sub_style = ParagraphStyle(name='Sub', fontName='CalB', fontSize=9, leading=12, textColor=DARK, spaceBefore=3, spaceAfter=1)
body_style = ParagraphStyle(name='Body', fontName='Cal', fontSize=8.5, leading=11.5, textColor=DARK, spaceAfter=1, alignment=TA_JUSTIFY)
bullet_style = ParagraphStyle(name='Bullet', fontName='Cal', fontSize=8, leading=10.5, textColor=DARK, leftIndent=8, bulletIndent=0, spaceAfter=0.5)
skill_style = ParagraphStyle(name='Skill', fontName='Cal', fontSize=8, leading=10.5, textColor=DARK, leftIndent=4, spaceAfter=0.3)
small_muted = ParagraphStyle(name='SmallM', fontName='CalI', fontSize=7.5, leading=10, textColor=MUTED, spaceAfter=1)

# -- Helpers --
def section(text):
    return [
        Spacer(1, 3),
        HRFlowable(width="100%", thickness=0.8, color=ACCENT, spaceAfter=1),
        Paragraph(text, section_style),
    ]

def sub(text):
    return [Paragraph(text, sub_style)]

def body(text):
    return [Paragraph(text, body_style)]

def bullet(text):
    return [Paragraph(text, bullet_style)]

def skill_line(text):
    return [Paragraph(text, skill_line)]

# -- Build --
OUTPUT = '/home/z/my-project/download/Zamir_Jamalov_Yelo_Bank_CV.pdf'
W, H = A4
LM, RM, TM, BM = 1.4*cm, 1.4*cm, 1.2*cm, 1.2*cm
AW = W - LM - RM

doc = SimpleDocTemplate(OUTPUT, pagesize=A4, leftMargin=LM, rightMargin=RM, topMargin=TM, bottomMargin=BM)

story = []

# ===== HEADER =====
story.append(Paragraph('<b>ZAMIR JAMALOV</b>', name_style))
story.append(Paragraph('IT Business Analyst | Risk Modeling &amp; Scoring', title_style))
story.append(Spacer(1, 2))
story.append(Paragraph('+994 55 207 7228 | jamalov.zamir@gmail.com | Baku, Azerbaijan', contact_style))
story.append(Spacer(1, 4))

# ===== PROFILE SUMMARY =====
story.extend(section('PROFILE SUMMARY'))
story.extend(body(
    'Business Analyst with 2+ years in fintech, specializing in <b>credit scoring, antifraud systems, '
    'risk assessment, and decision engine</b> change requests. Engineering background (15+ years) enables '
    'precise translation of complex risk rules into technical specifications for development teams. '
    'Delivered production scoring and credit lifecycle systems, bridging business, risk, and IT.'
))

# ===== CORE SKILLS =====
story.extend(section('CORE SKILLS'))

# Skills table - 2 columns
skills_left = [
    '<b>Risk &amp; Scoring:</b> Credit Scoring Models | Decision Engine &amp; Rule Engine | Antifraud Systems | '
    'Risk Assessment | Scorecards | Cut-off Matrices | DTI / Residual Income | IFRS 9 Classification',
    '<b>BA Documentation:</b> BRD / FRD / SRS | User Stories (Gherkin) | BPMN (As-Is / To-Be) | '
    'UML | Use Cases | Process Flow | Change Requests | API Specification (Swagger/OpenAPI 3.0)',
]
skills_right = [
    '<b>Technical:</b> SQL (Advanced - Data Analysis &amp; Validation) | REST API &amp; JSON | Postman | '
    'Database Concepts (Oracle, PostgreSQL, MongoDB) | BPM/JBPM Workflow | Data Mapping',
    '<b>Tools &amp; Methods:</b> Jira | Confluence | Agile/Scrum | UAT Planning &amp; Bug Triage | '
    'RICE Prioritization | L2 Production Support (ELK Stack)',
]

sk_data = [[
    Paragraph(skills_left[0], skill_style),
    Paragraph(skills_right[0], skill_style),
], [
    Paragraph(skills_left[1], skill_style),
    Paragraph(skills_right[1], skill_style),
], [
    Paragraph('<b>Languages:</b> Azerbaijani (Native) | Russian (Fluent) | English (Professional / Technical)', skill_style),
    Paragraph('', skill_style),
]]
sk_table = Table(sk_data, colWidths=[AW*0.52, AW*0.48], hAlign='LEFT')
sk_table.setStyle(TableStyle([
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('LEFTPADDING', (0,0), (-1,-1), 0),
    ('RIGHTPADDING', (0,0), (-1,-1), 4),
    ('TOPPADDING', (0,0), (-1,-1), 0),
    ('BOTTOMPADDING', (0,0), (-1,-1), 0),
]))
story.append(sk_table)

# ===== PROFESSIONAL EXPERIENCE =====
story.extend(section('PROFESSIONAL EXPERIENCE'))

# --- Embafinans ---
story.append(Paragraph('<b>Embafinans</b> | IT Business Analyst', sub_style))
story.append(Paragraph('2025 - Present', small_muted))
story.extend(body('Risk Modeling &amp; Scoring Squad - Credit Scoring, Antifraud, Risk Assessment, Decision Engine'))

story.extend(body('<b>Credit Scoring Systems:</b>'))
story.extend(bullet('- Designed hybrid scoring algorithms integrating ASAN Finans and AKB data for customer risk scoring; formulated DTI and Residual Income validation rules with auto-reject logic (code 005)'))
story.extend(bullet('- Architected Scorecard matrices (0-149: Auto Reject, 150-750: Manual Review, >750: Auto Approve) and defined complex scoring variables (Monthly Delay Ratio, Max Overdue Days) for Clojure scripts'))

story.extend(body('<b>Antifraud Systems:</b>'))
story.extend(bullet('- Designed SIMA KYC biometric verification integration with async validation and auto-block scenarios (error codes 1001, 1003)'))
story.extend(bullet('- Implemented Sanction Scanner and Blacklist checking with auto-reject logic (code 180) and dynamic cooling-off rules (15/90 day blocks) for repeat fraudulent applications'))

story.extend(body('<b>Risk Assessment:</b>'))
story.extend(bullet('- Formulated pre/post-disbursement risk rules including age limit bypass, PAR/IFRS 9 classification logic (Stage 1/2/3), and collateral LTV ratio calculations for credit limit management'))

story.extend(body('<b>Decision Engine &amp; Workflow:</b>'))
story.extend(bullet('- Systematized 7-level priority cut-off rules (R_1020 to R_5030) for straight-through processing with auto-cancel triggers; designed smart routing algorithms for auto-assignment to Loan Officers based on amount/risk'))
story.extend(bullet('- Designed refinancing (close-open) scenarios with auto-deduction waterfall (principal + interest + penalty) and BPM/JBPM lifecycle transitions (S001-S006)'))

story.extend(body('<b>Delivery &amp; Coordination:</b>'))
story.extend(bullet('- Authored BRD/FRD/SRS with REQ-101 traceability; prepared Swagger API specs and data mapping documents for developer handoff; coordinated UAT with bug triage'))
story.extend(bullet('- Used SQL data analysis to resolve stakeholder conflicts (risk vs. sales); applied RICE framework for backlog prioritization'))

# --- Birbonus ---
story.append(Paragraph('<b>Birbonus</b> | IT Business Analyst', sub_style))
story.append(Paragraph('2024 - 2025', small_muted))
story.extend(bullet('- Designed customer loyalty bonus system with earning rules, eligibility criteria, and partner settlement workflows; authored BRD and API integration specs'))

# --- Umico ---
story.append(Paragraph('<b>Umico</b> | PostgreSQL Developer &amp; L2 Support', sub_style))
story.append(Paragraph('2022 - 2024', small_muted))
story.extend(bullet('- Built backend features using PostgreSQL; resolved L2 production incidents via ELK Stack log analysis; supported partner teams with API integration onboarding'))

# ===== TECHNICAL FOUNDATION =====
story.extend(section('TECHNICAL FOUNDATION'))
story.extend(body(
    '15+ years in software engineering (Central Bank of Azerbaijan, Unibank, ASAN Service) - C# backend, '
    'databases (Oracle, MSSQL, PostgreSQL, MongoDB), system integration, CI/CD pipelines. '
    'Enables precise requirement-to-code translation and rapid root cause analysis. Deep understanding '
    'of banking core systems, credit lifecycle, and regulatory compliance.'
))

# ===== EDUCATION =====
story.extend(section('EDUCATION'))
story.extend(body('Baku State University - Bachelor of Science in Applied Mathematics'))

# -- Build --
doc.build(story)

# Check page count
import os
size = os.path.getsize(OUTPUT)
print(f"PDF: {OUTPUT} ({size/1024:.1f} KB)")
