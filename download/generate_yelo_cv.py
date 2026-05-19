#!/usr/bin/env python3
"""
Zamir Jamalov - IT Business Analyst CV for Yelo Bank (Risk Modeling / Scoring Squad)
Clean, readable format. 1 page. Minimal bold, clear structure.
v4: Expert-level scoring language, multi-stage decisioning, real-time, audit trail,
    rule lifecycle, hybrid scoring weights, expanded antifraud
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

# -- Styles --
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
LM, RM, TM, BM = 1.3*cm, 1.3*cm, 1.0*cm, 1.0*cm
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
    'Business Analyst with 2+ years in fintech credit scoring and real-time decision engine implementation. '
    'Led end-to-end scoring system setup from strategy definition through go-live and PSI-based monitoring for a '
    'custom-built lending platform — working closely with Risk, Compliance, IT, and QA teams across the full project lifecycle. '
    'Engineering background enables precise translation of risk logic into developer-ready specifications.'
))

# ===== SKILLS =====
story.extend(section('CORE SKILLS'))
sk_data = [
    [Paragraph('<b>Risk &amp; Scoring:</b>', skill_cat_style),
     Paragraph('<b>Business Analysis:</b>', skill_cat_style)],
    [Paragraph('Credit Scoring | Real-Time Decision Engine | Multi-Stage Cut-off Design | '
              'Scorecard Matrices | Additive Point-Based Scorecard | '
              'PSI Monitoring | Score Distribution Analysis | '
              'Champion-Challenger Testing | Decision Audit Trail | Antifraud Rules', skill_val_style),
     Paragraph('BRD / FRD / SRS | User Stories (Gherkin) | '
              'BPMN (As-Is / To-Be) | Data Mapping | '
              'Gap Analysis | Use Case | RICE Prioritization', skill_val_style)],
    [Paragraph('<b>Technical:</b>', skill_cat_style),
     Paragraph('<b>Languages:</b>', skill_cat_style)],
    [Paragraph('SQL (Advanced Analysis) | Python (pandas, NumPy, regression) | REST API &amp; JSON | '
              'Swagger / OpenAPI 3.0 | SOAP / XML | Oracle / PostgreSQL', skill_val_style),
     Paragraph('Azerbaijani (Native) | Russian (Fluent) | English (Professional / Technical Docs)', skill_val_style)],
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

story.extend(bullet('- <b>Strategy &amp; Requirements</b> — Led scoring strategy definition with Risk &amp; Compliance teams; '
                   'conducted stakeholder interviews, analyzed as-is credit approval process, defined 6 data source requirements '
                   '(ASAN Personal Info, ASAN Finance, ASAN Pension Info, AKB Score, AKB History, SIMA), '
                   'multi-stage decision logic, segment boundaries, and cut-off acceptance criteria'))
story.extend(bullet('- <b>Decision Engine Design</b> — Designed 6-stage real-time decision engine with IT team; '
                   'each stage applies cut-off thresholds to pass, reject, or route to next stage '
                   '(local checks → ASAN Personal Info → AKB Score → AKB History → ASAN Finance → Pension Info); '
                   'three-way routing (auto-approve / auto-reject / expert review) with full decision audit trail'))
story.extend(bullet('- <b>Scorecard Development</b> — Built additive point-based scorecard with Risk Team; '
                   'mapped AKB history attributes (9-month payment trend, overdue days, active loan count, '
                   'credit card utilization, loan amount distribution) to calibrated point adjustments '
                   'overlaid on bureau base score; natural logarithm normalization for skewed distributions'))
story.extend(bullet('- <b>UAT &amp; Go-Live</b> — Coordinated UAT with QA &amp; Risk through go-live; '
                   'designed test scenarios for pass/fail edge cases per stage, executed champion-challenger validation '
                   '(new cut-offs vs. production baseline), triaged bugs by severity, signed off production readiness'))
story.extend(bullet('- <b>Model Governance</b> — Established PSI-based monitoring post go-live; '
                   'monthly score distribution analysis for population shifts, cut-off efficiency tracking '
                   '(actual vs. expected pass rates), rule versioning with rollback readiness, and data quality governance '
                   '(missing-value policies, outlier thresholds, null-handling rules) per scoring input'))
story.extend(bullet('- <b>Antifraud Rules</b> — Structured pre-disbursement antifraud checks within decision engine; '
                   'velocity checks for rapid repeat applications, cross-source data consistency validation '
                   '(identity match across ASAN/AKB/SIMA), and behavioral pattern flags for identity verification'))
story.extend(bullet('- <b>BA Documentation</b> — Delivered BRD/FRD/SRS with end-to-end requirements traceability, '
                   'Swagger/OpenAPI specs for scoring service APIs, and data mapping between '
                   'external data sources and internal decision engine input schemas'))

# --- Birbonus ---
story.append(Paragraph('Birbonus  |  IT Business Analyst', company_style))
story.append(Paragraph('2024 - 2025', date_style))
story.extend(bullet('- Designed a customer loyalty bonus system — defined earning rules, spend eligibility criteria, '
                   'partner settlement workflows, and API integration specs; prepared BRD'))

# --- Umico ---
story.append(Paragraph('Umico  |  PostgreSQL Developer &amp; L2 Support', company_style))
story.append(Paragraph('2022 - 2024', date_style))
story.extend(bullet('- PostgreSQL backend development; L2 production incident resolution via ELK Stack log analysis; '
                   'API integration onboarding and troubleshooting for partner teams'))

# ===== TECHNICAL FOUNDATION =====
story.extend(section('TECHNICAL FOUNDATION'))
story.extend(body(
    'PL/SQL backend developer; participated in core banking system development including general ledger, '
    'chart of accounts, accounting transactions, currency exchange, and credit lifecycle modules. '
    '15+ years across Central Bank of Azerbaijan, Unibank, and ASAN Service covering C# backend, '
    'Oracle / PostgreSQL / MongoDB, system integration, and CI/CD pipelines.'
))

# ===== TRAINING & EDUCATION =====
story.extend(section('TRAINING &amp; EDUCATION'))
story.append(Paragraph('Innab Training Center  |  Corporate Data Analytics Trainer', company_style))
story.append(Paragraph(
    'Delivered corporate Python data analytics training for Bank of Baku and SOCAR Upstream — '
    'adapted content to each organization\'s real datasets; focus on descriptive/diagnostic analysis, '
    'hypothesis testing, regression modeling, and pandas/NumPy-based data exploration.',
    body_style))
story.extend(body('Baku State University - BS in Applied Mathematics'))

# -- Build --
doc.build(story)

import os
from pypdf import PdfReader
r = PdfReader(OUTPUT)
print(f"PDF: {OUTPUT} ({os.path.getsize(OUTPUT)/1024:.1f} KB, {len(r.pages)} page)")
