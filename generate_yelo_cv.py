#!/usr/bin/env python3
"""
Zamir Jamalov - IT Business Analyst CV for Yelo Bank (Risk Modeling / Scoring Squad)
Version 2: Professional depth without excessive detail. 1 page.
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
DARK = colors.HexColor('#1e1e1e')
MUTED = colors.HexColor('#555555')

# -- Styles --
name_style = ParagraphStyle(name='Name', fontName='CalB', fontSize=17, leading=21, textColor=ACCENT, alignment=TA_CENTER)
title_style = ParagraphStyle(name='Title', fontName='Cal', fontSize=9.5, leading=12, textColor=MUTED, alignment=TA_CENTER)
contact_style = ParagraphStyle(name='Contact', fontName='Cal', fontSize=8, leading=10, textColor=MUTED, alignment=TA_CENTER)
section_style = ParagraphStyle(name='Section', fontName='CalB', fontSize=9.5, leading=12, textColor=ACCENT, spaceBefore=4, spaceAfter=1)
sub_style = ParagraphStyle(name='Sub', fontName='CalB', fontSize=8.5, leading=11, textColor=DARK, spaceBefore=2, spaceAfter=0.5)
body_style = ParagraphStyle(name='Body', fontName='Cal', fontSize=8, leading=10.5, textColor=DARK, spaceAfter=1.5, alignment=TA_JUSTIFY)
bullet_style = ParagraphStyle(name='Bullet', fontName='Cal', fontSize=7.8, leading=10, textColor=DARK, leftIndent=7, bulletIndent=0, spaceAfter=0.5)
skill_style = ParagraphStyle(name='Skill', fontName='Cal', fontSize=7.8, leading=10, textColor=DARK, leftIndent=3, spaceAfter=0.3)
small_muted = ParagraphStyle(name='SmallM', fontName='CalI', fontSize=7, leading=9, textColor=MUTED, spaceAfter=0.5)
tag_style = ParagraphStyle(name='Tag', fontName='CalB', fontSize=7.5, leading=9.5, textColor=ACCENT)

def section(text):
    return [Spacer(1,2), HRFlowable(width="100%", thickness=0.7, color=ACCENT, spaceAfter=1), Paragraph(text, section_style)]

def sub(text):
    return [Paragraph(text, sub_style)]

def body(text):
    return [Paragraph(text, body_style)]

def bullet(text):
    return [Paragraph(text, bullet_style)]

# -- Build --
OUTPUT = '/home/z/my-project/download/Zamir_Jamalov_Yelo_Bank_CV.pdf'
W, H = A4
LM, RM, TM, BM = 1.3*cm, 1.3*cm, 1.1*cm, 1.1*cm
AW = W - LM - RM

doc = SimpleDocTemplate(OUTPUT, pagesize=A4, leftMargin=LM, rightMargin=RM, topMargin=TM, bottomMargin=BM)
story = []

# ===== HEADER =====
story.append(Paragraph('<b>ZAMIR JAMALOV</b>', name_style))
story.append(Paragraph('IT Business Analyst | Risk Modeling &amp; Scoring', title_style))
story.append(Spacer(1,1))
story.append(Paragraph('+994 55 207 7228 | jamalov.zamir@gmail.com | Baku, Azerbaijan', contact_style))

# ===== PROFILE =====
story.extend(section('PROFILE SUMMARY'))
story.extend(body(
    'Business Analyst with 2+ years in fintech, specializing in <b>credit scoring, decision engine rule design, '
    'and risk assessment</b> change requests. Authored 25+ cut-off rules across a 6-priority tiered decision '
    'framework for straight-through processing. 15+ years of software engineering background enables precise '
    'translation of complex risk logic into developer-ready specifications.'
))

# ===== SKILLS =====
story.extend(section('CORE SKILLS'))
sk_data = [[
    Paragraph('<b>Risk &amp; Scoring:</b> Credit Scoring | Decision Engine / Rule Engine | Cut-off Rule Design '
              '(Auto-Reject / Auto-Approve / Expert Routing) | Scorecard Matrices | DTI Analysis | '
              'Risk Variables (Delay Ratio, Credit History Depth) | Stop-Factor vs Soft-Factor Logic | '
              'Cooling-off Periods | Exception Handling | IFRS 9 Awareness', skill_style),
    Paragraph('<b>Technical:</b> SQL (Advanced Data Analysis) | REST API &amp; JSON | Swagger/OpenAPI 3.0 | '
              'Postman | Database Concepts (Oracle, PostgreSQL, MongoDB) | BPMN Process Modeling | '
              'Data Mapping | Sequence Diagrams', skill_style),
], [
    Paragraph('<b>BA Toolkit:</b> BRD / FRD / SRS (REQ-101 Traceability) | User Stories (Gherkin Acceptance Criteria) | '
              'Change Requests | UAT Planning &amp; Bug Triage | RICE Prioritization | '
              'Jira | Confluence | Agile/Scrum', skill_style),
    Paragraph('<b>Languages:</b> Azerbaijani (Native) | Russian (Fluent) | English (Professional / Technical Documentation)', skill_style),
]]
sk_table = Table(sk_data, colWidths=[AW*0.52, AW*0.48], hAlign='LEFT')
sk_table.setStyle(TableStyle([
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('LEFTPADDING', (0,0), (-1,-1), 0),
    ('RIGHTPADDING', (0,0), (-1,-1), 3),
    ('TOPPADDING', (0,0), (-1,-1), 0),
    ('BOTTOMPADDING', (0,0), (-1,-1), 0),
]))
story.append(sk_table)

# ===== EXPERIENCE =====
story.extend(section('PROFESSIONAL EXPERIENCE'))

# --- Embafinans ---
story.extend(sub('<b>Embafinans</b> | IT Business Analyst'))
story.append(Paragraph('2025 - Present', small_muted))
story.append(Paragraph('Risk Modeling / Scoring Squad - Cash Loan (RCASH) Decision Engine', small_muted))

story.extend(body('<b>Decision Engine - Cut-off Rule Design:</b>'))
story.extend(bullet('- Authored <b>25+ cut-off rules</b> (R_1010 to R_6040) organized in a <b>6-priority tiered framework</b>: '
                   'Loan Workbench (blacklist, DTI, credit history) > ASAN Finans (age limits) > AKB Skor Servisi '
                   '(stop-factors, scoring balance) > AKB Credit History (delinquency, active loan limits) > '
                   'Workplace/Pension validation > Combined rules with exception logic'))
story.extend(bullet('- Designed three-way routing: <b>Auto-Reject</b> (hard stop-factors with cooling-off periods), '
                   '<b>Auto-Approve</b> (high-score customers, straight-through processing), and <b>Expert Review</b> '
                   '(borderline cases routed to Loan Officer with decision window)'))
story.extend(bullet('- Defined <b>stop-factors</b> (blacklist, active delinquency, expired contracts) vs '
                   '<b>soft-factors</b> (thin credit file, new-to-credit, minor delinquency) triggering manual review'))

story.extend(body('<b>Credit Scoring &amp; Risk Variables:</b>'))
story.extend(bullet('- Configured scoring input variables: DTI (max 150%), residual income (min living costs by family size), '
                   'delay ratio (overdue days / payment months), max overdue days (24-month lookback), active loan count limits'))
story.extend(bullet('- Designed scorecard decision ranges (200-750: manual review, 751-1000: auto-approve) and '
                   'integrated AKB Skor Servisi + ASAN Finans data for hybrid scoring'))
story.extend(bullet('- Defined cooling-off rules: repeat application blocks after rejection (3/15/90 days by rejection type) '
                   'and exception logic for customers with positive Embafinans history'))

story.extend(body('<b>Risk Assessment &amp; Delivery:</b>'))
story.extend(bullet('- Authored BRD/FRD/SRS with REQ-101 traceability; prepared Swagger API specs and data mapping '
                   'documents for developer handoff; coordinated UAT with structured bug triage (Critical/Major/Minor)'))
story.extend(bullet('- Used SQL data analysis to resolve stakeholder conflicts (risk vs. sales); applied RICE framework '
                   'for backlog prioritization; achieved on-time delivery across 4 production projects'))

# --- Birbonus ---
story.extend(sub('<b>Birbonus</b> | IT Business Analyst'))
story.append(Paragraph('2024 - 2025', small_muted))
story.extend(bullet('- Designed customer loyalty bonus system with earning rules, eligibility criteria, and partner settlement workflows; authored BRD and API specs'))

# --- Umico ---
story.extend(sub('<b>Umico</b> | PostgreSQL Developer &amp; L2 Support'))
story.append(Paragraph('2022 - 2024', small_muted))
story.extend(bullet('- PostgreSQL backend development; L2 production incident resolution via ELK Stack log analysis; API integration onboarding support'))

# ===== TECHNICAL FOUNDATION =====
story.extend(section('TECHNICAL FOUNDATION'))
story.extend(body(
    '15+ years in software engineering (Central Bank of Azerbaijan, Unibank, ASAN Service) - C# backend, '
    'databases (Oracle, MSSQL, PostgreSQL, MongoDB), system integration, CI/CD pipelines. '
    'Enables precise requirement-to-code translation and deep understanding of banking core systems, '
    'credit lifecycle, and regulatory compliance (Central Bank requirements).'
))

# ===== EDUCATION =====
story.extend(section('EDUCATION'))
story.extend(body('Baku State University - Bachelor of Science in Applied Mathematics'))

# -- Build --
doc.build(story)

import os
from pypdf import PdfReader
r = PdfReader(OUTPUT)
print(f"PDF: {OUTPUT} ({os.path.getsize(OUTPUT)/1024:.1f} KB, {len(r.pages)} page)")
