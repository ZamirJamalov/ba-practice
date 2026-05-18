#!/usr/bin/env python3
"""
Zamir Jamalov - IT Business Analyst CV for Yelo Bank (Risk Modeling / Scoring Squad)
Clean, readable format. 1 page. Minimal bold, clear structure.
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
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
registerFontFamily('Cal', normal='Cal', bold='CalB', italic='CalI')

# -- Colors --
ACCENT = colors.HexColor('#1a6b7a')
DARK = colors.HexColor('#2a2a2a')
MUTED = colors.HexColor('#666666')

# -- Styles (clean, readable) --
name_style = ParagraphStyle(name='Name', fontName='CalB', fontSize=16, leading=20, textColor=ACCENT, alignment=TA_CENTER)
title_style = ParagraphStyle(name='Title', fontName='Cal', fontSize=9.5, leading=12, textColor=MUTED, alignment=TA_CENTER)
contact_style = ParagraphStyle(name='Contact', fontName='Cal', fontSize=8.5, leading=11, textColor=MUTED, alignment=TA_CENTER)
section_style = ParagraphStyle(name='Section', fontName='CalB', fontSize=9.5, leading=12, textColor=ACCENT, spaceBefore=3, spaceAfter=1)
body_style = ParagraphStyle(name='Body', fontName='Cal', fontSize=9, leading=12, textColor=DARK, spaceAfter=1, alignment=TA_JUSTIFY)
company_style = ParagraphStyle(name='Company', fontName='CalB', fontSize=9, leading=11.5, textColor=DARK, spaceBefore=2, spaceAfter=0.2)
date_style = ParagraphStyle(name='Date', fontName='CalI', fontSize=8, leading=10, textColor=MUTED, spaceAfter=0.3)
bullet_style = ParagraphStyle(name='Bullet', fontName='Cal', fontSize=8.5, leading=11, textColor=DARK, leftIndent=8, bulletIndent=0, spaceAfter=0.8)
subsec_style = ParagraphStyle(name='SubSec', fontName='CalI', fontSize=8.5, leading=11, textColor=ACCENT, spaceBefore=1, spaceAfter=0.3, leftIndent=2)
skill_cat_style = ParagraphStyle(name='SkillCat', fontName='CalB', fontSize=8.5, leading=11, textColor=DARK)
skill_val_style = ParagraphStyle(name='SkillVal', fontName='Cal', fontSize=8.5, leading=11, textColor=DARK)

def section(text):
    return [Spacer(1,2), HRFlowable(width="100%", thickness=0.5, color=ACCENT, spaceAfter=1), Paragraph(text, section_style)]

def body(text):
    return [Paragraph(text, body_style)]

def bullet(text):
    return [Paragraph(text, bullet_style)]

# -- Build --
OUTPUT = '/home/z/my-project/download/Zamir_Jamalov_Yelo_Bank_CV.pdf'
W, H = A4
LM, RM, TM, BM = 1.4*cm, 1.4*cm, 1.2*cm, 1.2*cm
AW = W - LM - RM

doc = SimpleDocTemplate(OUTPUT, pagesize=A4, leftMargin=LM, rightMargin=RM, topMargin=TM, bottomMargin=BM)
story = []

# ===== HEADER =====
story.append(Paragraph('<b>ZAMIR JAMALOV</b>', name_style))
story.append(Paragraph('IT Business Analyst  |  Risk Modeling &amp; Scoring', title_style))
story.append(Spacer(1,2))
story.append(Paragraph('+994 55 207 7228  |  jamalov.zamir@gmail.com  |  Baku, Azerbaijan', contact_style))

# ===== PROFILE =====
story.extend(section('PROFILE SUMMARY'))
story.extend(body(
    'Business Analyst with 2+ years in fintech, specializing in credit scoring, decision engine rule design, '
    'and risk assessment change requests. Engineering background enables precise translation of complex risk logic '
    'into developer-ready specifications. Proficient in Python-based data analytics including descriptive and diagnostic analysis, '
    'hypothesis testing, and regression modeling. Having authored 25+ cut-off rules across a 6-priority tiered decision framework, '
    'looking to apply the same analytical approach to drive measurable risk optimization outcomes.'
))

# ===== SKILLS =====
story.extend(section('CORE SKILLS'))
sk_data = [
    [Paragraph('<b>Risk &amp; Scoring:</b>', skill_cat_style),
     Paragraph('<b>Business Analysis:</b>', skill_cat_style)],
    [Paragraph('Credit Scoring | Decision Engine / Rule Engine | Cut-off Rule Design '
              '(Auto-Reject / Auto-Approve / Expert Routing) | Scorecard Matrices | '
              'Hybrid Scoring Models | Risk Variables | Stop-Factor vs Soft-Factor | '
              'Cooling-off Periods | IFRS 9 Awareness', skill_val_style),
     Paragraph('BRD / FRD / SRS (REQ-101 Traceability) | User Stories &amp; Acceptance Criteria (Gherkin) | '
              'BPMN (As-Is / To-Be) | UML | Sequence Diagrams | Data Mapping | '
              'Gap Analysis | Stakeholder Interviews | RICE Prioritization', skill_val_style)],
    [Paragraph('<b>Technical:</b>', skill_cat_style),
     Paragraph('<b>Process &amp; Tools:</b>', skill_cat_style)],
    [Paragraph('SQL (Advanced Data Analysis) | Python (Data Analytics, pandas, NumPy) | REST API &amp; JSON | '
              'Swagger / OpenAPI 3.0 | Postman | Databases (Oracle, PostgreSQL, MongoDB)', skill_val_style),
     Paragraph('Agile / Scrum | Jira | Confluence | UAT Planning &amp; Coordination | '
              'Change Requests | Bug Triage (Critical / Major / Minor)', skill_val_style)],
    [Paragraph('<b>Data Analytics:</b> Descriptive &amp; Diagnostic Analysis | Hypothesis Testing | Regression Modeling | '
              'Statistical Analysis (Python)', skill_val_style),
     Paragraph('<b>Languages:</b> Azerbaijani (Native) | Russian (Fluent) | English (Professional / Technical Documentation)', skill_val_style)],
]
sk_table = Table(sk_data, colWidths=[AW*0.52, AW*0.48], hAlign='LEFT')
sk_table.setStyle(TableStyle([
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('LEFTPADDING', (0,0), (-1,-1), 0),
    ('RIGHTPADDING', (0,0), (-1,-1), 4),
    ('TOPPADDING', (0,0), (-1,-1), 0),
    ('BOTTOMPADDING', (0,0), (-1,-1), 0),
]))
story.append(sk_table)

# ===== EXPERIENCE =====
story.extend(section('PROFESSIONAL EXPERIENCE'))

# --- Embafinans ---
story.append(Paragraph('Embafinans  |  IT Business Analyst', company_style))
story.append(Paragraph('2025 - Present', date_style))

story.append(Paragraph('Decision Engine - Cut-off Rule Design', subsec_style))
story.extend(bullet('- Authored 25+ cut-off rules (R_1010 to R_6040) in a 6-priority tiered framework: '
                   'Loan Workbench > ASAN Finans (personal data, age limits) > AKB Skor Servisi '
                   '> AKB Credit History > Workplace/Pension validation > Combined rules'))
story.extend(bullet('- Designed three-way routing: Auto-Reject (hard stop-factors), Auto-Approve (high-score), '
                   'and Expert Review (borderline cases routed to Loan Officer)'))

story.append(Paragraph('Credit Scoring & Risk Variables', subsec_style))
story.extend(bullet('- Configured scoring matrices integrating data from ASAN Finans, SIMA, AKB score, and AKB credit history; '
                   'analyzed score distributions and reconfigured weight parameters to optimize approval/rejection balance'))
story.extend(bullet('- Developed hybrid scoring model combining external AKB bureau score with company-internal risk score; '
                   'formulated personalized credit decision logic for individual applicant risk profiles'))
story.extend(bullet('- Performed quantitative analysis on AKB credit history: payment regularity, loan amount distribution, '
                   'and credit card utilization computed using natural logarithm-based normalization'))

story.append(Paragraph('Risk Assessment & Delivery', subsec_style))
story.extend(bullet('- Authored BRD/FRD/SRS with REQ-101 traceability; prepared Swagger API specs and data mapping '
                   'documents; coordinated UAT with structured bug triage (Critical/Major/Minor)'))
story.extend(bullet('- Used SQL data analysis to resolve stakeholder conflicts; applied RICE framework '
                   'for backlog prioritization; achieved on-time delivery across 4 production projects'))

# --- Birbonus ---
story.append(Paragraph('Birbonus  |  IT Business Analyst', company_style))
story.append(Paragraph('2024 - 2025', date_style))
story.extend(bullet('- Designed a customer loyalty bonus system enabling shoppers to earn rewards on purchases and redeem across participating '
                   'partner merchants, conducting stakeholder sessions to define earning rules, eligibility criteria, and partner settlement workflows'))

# --- Umico ---
story.append(Paragraph('Umico  |  PostgreSQL Developer &amp; L2 Support', company_style))
story.append(Paragraph('2022 - 2024', date_style))
story.extend(bullet('- Built backend features using PostgreSQL, resolved L2 production incidents using ELK Stack log analysis and source code '
                   'investigation, and supported partner development teams with API integration onboarding'))

# ===== TECHNICAL FOUNDATION =====
story.extend(section('TECHNICAL FOUNDATION'))
story.extend(body(
    'As PL/SQL backend developer, participated in a core banking system built from scratch, developing key modules '
    'including general ledger / chart of accounts, accounting transactions and postings, currency exchange operations, '
    'and credit lifecycle module. Additionally, 15+ years across Central Bank of Azerbaijan, Unibank, and ASAN Service covering '
    'C# backend development, Oracle / MSSQL / PostgreSQL / MongoDB databases, system integration, Git, and CI/CD pipelines. '
    'Enables precise requirement-to-code translation and deep understanding of banking core systems.'
))

# ===== TRAINING & EDUCATION =====
story.extend(section('TRAINING &amp; EDUCATION'))
story.append(Paragraph('Innab Training Center  |  Corporate Data Analytics Trainer', company_style))
story.append(Paragraph('Delivered corporate Python data analytics training for Bank of Baku and SOCAR Upstream, adapting content '
                   'to each organization\'s real datasets. Focus on descriptive and diagnostic analysis, enabling professionals '
                   'to uncover patterns, trends, and root causes in their operational data.', body_style))
story.extend(body('Baku State University - Bachelor of Science in Applied Mathematics'))

# -- Build --
doc.build(story)

import os
from pypdf import PdfReader
r = PdfReader(OUTPUT)
print(f"PDF: {OUTPUT} ({os.path.getsize(OUTPUT)/1024:.1f} KB, {len(r.pages)} page)")
