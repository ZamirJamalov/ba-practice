#!/usr/bin/env python3
"""
Zamir Jamalov - IT Business Analyst CV for PLS (Digital Lending & B2C Channel)
Based on Yelo Bank CV template with enhanced Embafinans experience and LW architecture.
v5: B2C Sales Channel, Payment Gateway, Goods Loan Dashboard, Credit Lifecycle, LW Architecture, Java
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
name_style = ParagraphStyle(name='Name', fontName='CalB', fontSize=15, leading=18, textColor=ACCENT, alignment=TA_CENTER)
title_style = ParagraphStyle(name='Title', fontName='Cal', fontSize=9, leading=11, textColor=MUTED, alignment=TA_CENTER)
contact_style = ParagraphStyle(name='Contact', fontName='Cal', fontSize=8, leading=10, textColor=MUTED, alignment=TA_CENTER)
section_style = ParagraphStyle(name='Section', fontName='CalB', fontSize=9, leading=11, textColor=ACCENT, spaceBefore=2, spaceAfter=0.5)
body_style = ParagraphStyle(name='Body', fontName='Cal', fontSize=8.5, leading=11, textColor=DARK, spaceAfter=0.5, alignment=TA_JUSTIFY)
company_style = ParagraphStyle(name='Company', fontName='CalB', fontSize=8.5, leading=10.5, textColor=DARK, spaceBefore=1.5, spaceAfter=0.1)
date_style = ParagraphStyle(name='Date', fontName='CalI', fontSize=7.5, leading=9, textColor=MUTED, spaceAfter=0.2)
bullet_style = ParagraphStyle(name='Bullet', fontName='Cal', fontSize=8, leading=10.5, textColor=DARK, leftIndent=8, bulletIndent=0, spaceAfter=0.5)
subsec_style = ParagraphStyle(name='SubSec', fontName='CalI', fontSize=8, leading=10, textColor=ACCENT, spaceBefore=0.5, spaceAfter=0.2, leftIndent=2)
skill_cat_style = ParagraphStyle(name='SkillCat', fontName='CalB', fontSize=8, leading=10, textColor=DARK)
skill_val_style = ParagraphStyle(name='SkillVal', fontName='Cal', fontSize=8, leading=10, textColor=DARK)

def section(text):
    return [Spacer(1,1), HRFlowable(width="100%", thickness=0.5, color=ACCENT, spaceAfter=0.5), Paragraph(text, section_style)]

def body(text):
    return [Paragraph(text, body_style)]

def bullet(text):
    return [Paragraph(text, bullet_style)]

# -- Build --
OUTPUT = '/home/z/my-project/download/Zamir_Jamalov_PLS_CV.pdf'
W, H = A4
LM, RM, TM, BM = 1.2*cm, 1.2*cm, 0.8*cm, 0.8*cm
AW = W - LM - RM

doc = SimpleDocTemplate(OUTPUT, pagesize=A4, leftMargin=LM, rightMargin=RM, topMargin=TM, bottomMargin=BM)
story = []

# ===== HEADER =====
story.append(Paragraph('<b>ZAMIR JAMALOV</b>', name_style))
story.append(Paragraph('IT Business Analyst  |  Digital Lending &amp; Credit Operations', title_style))
story.append(Spacer(1,1))
story.append(Paragraph('+994 55 207 7228  |  jamalov.zamir@gmail.com  |  Baku, Azerbaijan', contact_style))

# ===== PROFILE =====
story.extend(section('PROFILE SUMMARY'))
story.extend(body(
    'Business Analyst with 2+ years in fintech credit scoring, digital lending, and real-time decision engine '
    'implementation. Led end-to-end scoring system setup and B2C digital sales channel processing 300-500 daily '
    'loan applications, from strategy definition through go-live and PSI-based monitoring. Deep understanding of '
    'microservices-based lending platform architecture (LW) including Java/Spring Boot backend services, event-driven '
    'scoring pipeline, and modular decision engine. Engineering background enables precise translation of risk logic '
    'and business requirements into developer-ready specifications.'
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
    [Paragraph('<b>Platform &amp; Technical:</b>', skill_cat_style),
     Paragraph('<b>Languages:</b>', skill_cat_style)],
    [Paragraph('LW Lending Platform Architecture | Java / Spring Boot (Backend Services) | '
              'Microservices | Event-Driven Scoring Pipeline | '
              'SQL (Advanced Analysis) | Python (pandas, NumPy, regression) | '
              'REST API &amp; JSON | Swagger / OpenAPI 3.0 | SOAP / XML | Oracle / PostgreSQL', skill_val_style),
     Paragraph('Azerbaijani (Native) | Russian (Fluent) | English (Professional / Technical Docs)', skill_val_style)],
]
sk_table = Table(sk_data, colWidths=[AW*0.54, AW*0.46], hAlign='LEFT')
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

story.extend(bullet('- <b>Scoring Strategy &amp; Decision Engine</b> — Led scoring strategy with Risk &amp; Compliance; defined 6 data '
                   'source requirements (ASAN Personal Info, ASAN Finance, Pension Info, AKB Score, AKB History, SIMA), '
                   'multi-stage decision logic and cut-off criteria; designed 6-stage real-time decision engine with '
                   'three-way routing (auto-approve / auto-reject / expert review) and full decision audit trail'))
story.extend(bullet('- <b>B2C Sales Channel &amp; Payment Gateway Integration</b> — Designed and launched B2C digital sales '
                   'channel processing 300-500 daily loan applications; integrated online payment gateway for real-time '
                   'disbursement and collection processing, enabling seamless end-to-end digital lending experience'))
story.extend(bullet('- <b>Goods Loan Delivery Tracking Dashboard</b> — Built real-time monitoring dashboard for goods loan '
                   'delivery lifecycle, reducing operational errors by 2x; implemented digital e-signature workflow for '
                   'paperless contract execution and automated delivery confirmation'))
story.extend(bullet('- <b>End-to-End Credit Lifecycle Management</b> — Managed full credit lifecycle from application intake '
                   'through disbursement, repayment tracking, and collection; coordinated cross-functional workflows across '
                   'Sales, Risk, IT, Operations, and Finance teams ensuring process alignment at each stage'))
story.extend(bullet('- <b>Scorecard Development</b> — Built additive point-based scorecard with Risk Team; '
                   'mapped AKB history attributes (9-month payment trend, overdue days, active loan count, '
                   'credit card utilization, loan amount distribution) to calibrated point adjustments '
                   'overlaid on bureau base score; natural logarithm normalization for skewed distributions'))
story.extend(bullet('- <b>UAT &amp; Model Governance</b> — Coordinated UAT with QA &amp; Risk; designed test scenarios for pass/fail '
                   'edge cases, executed champion-challenger validation; established PSI-based monitoring with monthly score '
                   'distribution analysis, cut-off efficiency tracking, rule versioning, and data quality governance'))
story.extend(bullet('- <b>Antifraud &amp; BA Documentation</b> — Structured pre-disbursement antifraud checks '
                   '(velocity checks, cross-source validation, behavioral pattern flags); delivered BRD/FRD/SRS '
                   'with full traceability, Swagger/OpenAPI specs for scoring service APIs'))

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
    'PL/SQL backend developer with deep expertise in enterprise banking systems. '
    'Led core banking system development — general ledger, chart of accounts, accounting transactions, '
    'currency exchange, and credit lifecycle modules — at Zaminbank. '
    'Designed and developed mobile banking platform (UMobileBank) at Unibank. '
    'Drove banking system modernization at Bank of Baku and Rabita Bank. '
    'Built e-commerce platform backend at Umico. '
    '15+ years spanning Central Bank of Azerbaijan, Unibank, Zaminbank, Bank of Baku, Rabita Bank, and ASAN Service — '
    'covering C# backend, Oracle / PostgreSQL / MongoDB, system integration, and CI/CD pipelines.'
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
