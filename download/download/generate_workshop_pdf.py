#!/usr/bin/env python3
"""
Power BI Zero to Hero - 1 Hour Workshop Guide
Complete beginner A-Z process with Financial Sample
A1 English - DTank54 Group

REWRITE: Mission-driven approach - every section has clear
WHAT, WHY, and CONNECTION so learners always know the objective.
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, HRFlowable, Image
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

# ─── Fonts ────────────────────────────────────────────────────────────
pdfmetrics.registerFont(TTFont('Carlito', '/usr/share/fonts/truetype/english/Carlito-Regular.ttf'))
pdfmetrics.registerFont(TTFont('Carlito-Bold', '/usr/share/fonts/truetype/english/Carlito-Bold.ttf'))
pdfmetrics.registerFont(TTFont('Carlito-Italic', '/usr/share/fonts/truetype/english/Carlito-Italic.ttf'))
pdfmetrics.registerFont(TTFont('Serif', '/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf'))
pdfmetrics.registerFont(TTFont('Serif-Bold', '/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf'))
pdfmetrics.registerFont(TTFont('DejaVu', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
pdfmetrics.registerFont(TTFont('DejaVu-Bold', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))

# ─── Colors ───────────────────────────────────────────────────────────
NAVY = HexColor('#1B3A5C')
BLUE = HexColor('#2E86AB')
ORANGE = HexColor('#F18F01')
GREEN = HexColor('#27AE60')
RED = HexColor('#E74C3C')
PURPLE = HexColor('#8E44AD')
LIGHT_BLUE = HexColor('#EBF5FB')
DARK = HexColor('#2C3E50')
CODE_BG = HexColor('#F4F6F7')
HDR_BG = HexColor('#1B3A5C')
R1 = HexColor('#F8F9FA')
R2 = HexColor('#EBF5FB')
GRAY = HexColor('#7F8C8D')
YELLOW_BG = HexColor('#FEF9E7')
GREEN_BG = HexColor('#E8F8F5')
ORANGE_BG = HexColor('#FEF5E7')
RED_BG = HexColor('#FDEDEC')
PURPLE_BG = HexColor('#F4ECF7')
MISSION_BG = HexColor('#FFF3E0')
MISSION_BORDER = HexColor('#E65100')
PURPOSE_BG = HexColor('#E3F2FD')
PURPOSE_BORDER = HexColor('#1565C0')

# ─── Image directory ─────────────────────────────────────────────────
IMG_DIR = '/home/z/my-project/download/powerbi_images'

# ─── Styles ───────────────────────────────────────────────────────────
cover_title = ParagraphStyle('CT', fontName='Carlito-Bold', fontSize=34, leading=40, textColor=NAVY, alignment=TA_CENTER, spaceAfter=5*mm)
cover_sub = ParagraphStyle('CS', fontName='Carlito', fontSize=16, leading=22, textColor=BLUE, alignment=TA_CENTER, spaceAfter=3*mm)
cover_info = ParagraphStyle('CI', fontName='Serif', fontSize=12, leading=16, textColor=DARK, alignment=TA_CENTER, spaceAfter=2*mm)

sec = ParagraphStyle('SEC', fontName='Carlito-Bold', fontSize=18, leading=24, textColor=NAVY, spaceBefore=6*mm, spaceAfter=3*mm)
sub = ParagraphStyle('SUB', fontName='Carlito-Bold', fontSize=13, leading=18, textColor=BLUE, spaceBefore=5*mm, spaceAfter=2*mm)
sub2 = ParagraphStyle('SUB2', fontName='Carlito-Bold', fontSize=11, leading=15, textColor=HexColor('#1A5276'), spaceBefore=3*mm, spaceAfter=1.5*mm)
body = ParagraphStyle('BD', fontName='Serif', fontSize=10, leading=15, textColor=DARK, alignment=TA_JUSTIFY, spaceAfter=2*mm)
bul = ParagraphStyle('BL', fontName='Serif', fontSize=10, leading=14, textColor=DARK, leftIndent=12*mm, spaceAfter=1.5*mm, bulletIndent=5*mm, bulletFontName='DejaVu', bulletFontSize=8)
cod = ParagraphStyle('CD', fontName='DejaVu', fontSize=8.5, leading=13, textColor=HexColor('#1A1A2E'), backColor=CODE_BG, leftIndent=5*mm, rightIndent=5*mm, spaceBefore=1*mm, spaceAfter=2*mm, borderPadding=(2*mm,2*mm,2*mm,2*mm))
toc_s = ParagraphStyle('TOC', fontName='Serif', fontSize=11, leading=18, textColor=DARK, leftIndent=5*mm, spaceAfter=1.5*mm)

th = ParagraphStyle('TH', fontName='Carlito-Bold', fontSize=9, leading=12, textColor=white, alignment=TA_CENTER)
tc = ParagraphStyle('TC', fontName='Serif', fontSize=9, leading=13, textColor=DARK, alignment=TA_LEFT)

# Mission page styles
mission_title = ParagraphStyle('MT', fontName='Carlito-Bold', fontSize=20, leading=26, textColor=MISSION_BORDER, alignment=TA_CENTER, spaceAfter=4*mm)
mission_body = ParagraphStyle('MB', fontName='Serif', fontSize=10.5, leading=15, textColor=DARK, alignment=TA_JUSTIFY, spaceAfter=2*mm)
mission_bold = ParagraphStyle('MXB', fontName='Carlito-Bold', fontSize=11, leading=16, textColor=DARK, alignment=TA_CENTER, spaceAfter=2*mm)
purpose_title_s = ParagraphStyle('PTS', fontName='Carlito-Bold', fontSize=13, leading=18, textColor=PURPOSE_BORDER, alignment=TA_CENTER, spaceAfter=2*mm)

# ─── Helpers ──────────────────────────────────────────────────────────
def section_bar(title, time_str, story):
    data = [[Paragraph(f'<b>{title}</b>', sec), Paragraph(f'<b>{time_str}</b>', ParagraphStyle('TM', fontName='Carlito-Bold', fontSize=16, leading=22, textColor=white, alignment=TA_CENTER))]]
    t = Table(data, colWidths=[135*mm, 35*mm])
    t.setStyle(TableStyle([('BACKGROUND', (0,0), (-1,-1), NAVY), ('TOPPADDING', (0,0), (-1,-1), 3*mm), ('BOTTOMPADDING', (0,0), (-1,-1), 3*mm), ('LEFTPADDING', (0,0), (-1,-1), 4*mm), ('RIGHTPADDING', (0,0), (-1,-1), 4*mm), ('VALIGN', (0,0), (-1,-1), 'MIDDLE')]))
    story.append(t)
    story.append(Spacer(1, 3*mm))

def time_box(minutes, story):
    data = [[Paragraph(f'{minutes} MINUTES', ParagraphStyle('TB', fontName='Carlito-Bold', fontSize=11, leading=14, textColor=white, alignment=TA_CENTER))]]
    t = Table(data, colWidths=[35*mm])
    t.setStyle(TableStyle([('BACKGROUND', (0,0), (-1,-1), ORANGE), ('TOPPADDING', (0,0), (-1,-1), 2*mm), ('BOTTOMPADDING', (0,0), (-1,-1), 2*mm), ('ALIGN', (0,0), (-1,-1), 'CENTER')]))
    story.append(t)

def goal_box(title, text, story, bg=GREEN_BG, clr=GREEN):
    data = [[Paragraph(f'<b>GOAL:</b> {title}', ParagraphStyle('GT', fontName='Carlito-Bold', fontSize=10, leading=14, textColor=clr))],
            [Paragraph(text, ParagraphStyle('GB', fontName='Serif', fontSize=9.5, leading=14, textColor=DARK, leftIndent=3*mm, alignment=TA_JUSTIFY))]]
    t = Table(data, colWidths=[160*mm])
    t.setStyle(TableStyle([('BACKGROUND', (0,0), (-1,-1), bg), ('TOPPADDING', (0,0), (-1,-1), 2*mm), ('BOTTOMPADDING', (0,0), (-1,-1), 2*mm), ('LEFTPADDING', (0,0), (-1,-1), 3*mm), ('RIGHTPADDING', (0,0), (-1,-1), 3*mm), ('BOX', (0,0), (-1,-1), 1, clr)]))
    story.append(Spacer(1, 2*mm)); story.append(t); story.append(Spacer(1, 2*mm))

def what_why_box(what_text, why_text, story):
    data = [[Paragraph(f'<b>WHAT you will do:</b>', ParagraphStyle('WT', fontName='Carlito-Bold', fontSize=10, leading=14, textColor=BLUE))],
            [Paragraph(what_text, ParagraphStyle('WB', fontName='Serif', fontSize=9.5, leading=14, textColor=DARK, leftIndent=3*mm))],
            [Paragraph(f'<b>WHY this matters:</b>', ParagraphStyle('WY', fontName='Carlito-Bold', fontSize=10, leading=14, textColor=GREEN))],
            [Paragraph(why_text, ParagraphStyle('WYB', fontName='Serif', fontSize=9.5, leading=14, textColor=DARK, leftIndent=3*mm))]]
    t = Table(data, colWidths=[160*mm])
    t.setStyle(TableStyle([('BACKGROUND', (0,0), (-1,-1), LIGHT_BLUE), ('TOPPADDING', (0,0), (-1,-1), 2*mm), ('BOTTOMPADDING', (0,0), (-1,-1), 2*mm), ('LEFTPADDING', (0,0), (-1,-1), 3*mm), ('RIGHTPADDING', (0,0), (-1,-1), 3*mm), ('BOX', (0,0), (-1,-1), 1, BLUE)]))
    story.append(Spacer(1, 2*mm)); story.append(t); story.append(Spacer(1, 2*mm))

def tip(title, text, story, bg=YELLOW_BG, clr=ORANGE):
    data = [[Paragraph(f'<b>{title}</b>', ParagraphStyle('TT', fontName='Carlito-Bold', fontSize=10, leading=14, textColor=clr))],
            [Paragraph(text, ParagraphStyle('TB2', fontName='Serif', fontSize=9.5, leading=14, textColor=DARK, leftIndent=3*mm))]]
    t = Table(data, colWidths=[160*mm])
    t.setStyle(TableStyle([('BACKGROUND', (0,0), (-1,-1), bg), ('TOPPADDING', (0,0), (-1,-1), 2*mm), ('BOTTOMPADDING', (0,0), (-1,-1), 2*mm), ('LEFTPADDING', (0,0), (-1,-1), 3*mm), ('RIGHTPADDING', (0,0), (-1,-1), 3*mm), ('BOX', (0,0), (-1,-1), 1, clr)]))
    story.append(Spacer(1, 2*mm)); story.append(t); story.append(Spacer(1, 2*mm))

def warn(title, text, story):
    tip(title, text, story, RED_BG, RED)

def step(n, title, story, color=BLUE, bg=LIGHT_BLUE):
    data = [[Paragraph(f'<b>STEP {n}:  {title}</b>', ParagraphStyle('ST', fontName='Carlito-Bold', fontSize=11, leading=15, textColor=white))]]
    t = Table(data, colWidths=[170*mm])
    t.setStyle(TableStyle([('BACKGROUND', (0,0), (-1,-1), color), ('TOPPADDING', (0,0), (-1,-1), 2.5*mm), ('BOTTOMPADDING', (0,0), (-1,-1), 2.5*mm), ('LEFTPADDING', (0,0), (-1,-1), 4*mm)]))
    story.append(Spacer(1, 2*mm)); story.append(t); story.append(Spacer(1, 2*mm))

def S(title, story): story.append(Paragraph(f'<b>{title}</b>', sub))
def S2(title, story): story.append(Paragraph(f'<b>{title}</b>', sub2))
def P(text, story): story.append(Paragraph(text, body))
def B(text, story): story.append(Paragraph(f'<bullet>&bull;</bullet> {text}', bul))
def C(text, story): story.append(Paragraph(text.replace('\n', '<br/>'), cod))
def SP(h=3, story=None): story.append(Spacer(1, h*mm))

def make_table(headers, rows, widths=None):
    hdr = [Paragraph(h, th) for h in headers]
    data = [hdr]
    for row in rows:
        data.append([Paragraph(str(c), tc) for c in row])
    if widths is None: widths = [170*mm / len(headers)] * len(headers)
    t = Table(data, colWidths=widths, repeatRows=1)
    cmds = [('BACKGROUND', (0,0), (-1,0), HDR_BG), ('TEXTCOLOR', (0,0), (-1,0), white),
            ('TOPPADDING', (0,0), (-1,-1), 2*mm), ('BOTTOMPADDING', (0,0), (-1,-1), 2*mm),
            ('LEFTPADDING', (0,0), (-1,-1), 2*mm), ('RIGHTPADDING', (0,0), (-1,-1), 2*mm),
            ('GRID', (0,0), (-1,-1), 0.5, HexColor('#BDC3C7')), ('BOX', (0,0), (-1,-1), 1, NAVY), ('VALIGN', (0,0), (-1,-1), 'TOP')]
    for i in range(1, len(data)):
        cmds.append(('BACKGROUND', (0,i), (-1,i), R1 if i % 2 == 0 else R2))
    t.setStyle(TableStyle(cmds))
    return t

def add_image(filename, story, w=460, h=308):
    """Add an image from the powerbi_images directory."""
    path = os.path.join(IMG_DIR, filename)
    if os.path.exists(path):
        story.append(Spacer(1, 2*mm))
        story.append(Image(path, width=w, height=h, kind='proportional'))
        story.append(Spacer(1, 2*mm))
    else:
        warn(f'Image Not Found: {filename}', f'Expected at: {path}', story)

# ─── NEW: Mission Box (for the Workshop Mission page) ────────────────
def mission_box(objective, why, connection, story):
    """Creates a prominent orange-bordered mission box with objective, why, and connection."""
    s_title = ParagraphStyle('MBT', fontName='Carlito-Bold', fontSize=11, leading=15, textColor=MISSION_BORDER)
    s_label = ParagraphStyle('MBL', fontName='Carlito-Bold', fontSize=10, leading=14, textColor=ORANGE)
    s_text = ParagraphStyle('MBX', fontName='Serif', fontSize=10, leading=14, textColor=DARK, leftIndent=3*mm, alignment=TA_JUSTIFY)
    data = [
        [Paragraph(f'<b>OBJECTIVE:</b>', s_label)],
        [Paragraph(objective, s_text)],
        [Paragraph(f'<b>WHY IT MATTERS:</b>', s_label)],
        [Paragraph(why, s_text)],
        [Paragraph(f'<b>CONNECTION:</b>', s_label)],
        [Paragraph(connection, s_text)],
    ]
    t = Table(data, colWidths=[160*mm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), MISSION_BG),
        ('TOPPADDING', (0,0), (-1,-1), 2*mm),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2*mm),
        ('LEFTPADDING', (0,0), (-1,-1), 4*mm),
        ('RIGHTPADDING', (0,0), (-1,-1), 4*mm),
        ('BOX', (0,0), (-1,-1), 2.5, MISSION_BORDER),
    ]))
    story.append(Spacer(1, 3*mm))
    story.append(t)
    story.append(Spacer(1, 3*mm))

# ─── NEW: Purpose Block (at the start of every Part) ─────────────────
def purpose_block(objective_text, why_text, connection_text, story, minutes='5'):
    """Creates a big, highly visible 'WHY ARE WE DOING THIS?' box at the start of each Part.
    
    Shows: MISSION FOR THIS BLOCK, OBJECTIVE, WHY, CONNECTION to next step.
    """
    s_header = ParagraphStyle('PBH', fontName='Carlito-Bold', fontSize=12, leading=16, textColor=white, alignment=TA_CENTER)
    s_label = ParagraphStyle('PBL', fontName='Carlito-Bold', fontSize=10.5, leading=14, textColor=PURPOSE_BORDER)
    s_text = ParagraphStyle('PBT', fontName='Serif', fontSize=10, leading=14, textColor=DARK, leftIndent=2*mm, alignment=TA_JUSTIFY)
    
    header_data = [[Paragraph(f'WHY ARE WE DOING THIS?  ({minutes} MINUTES)', s_header)]]
    header_t = Table(header_data, colWidths=[170*mm])
    header_t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), PURPOSE_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 2.5*mm),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5*mm),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
    ]))
    
    body_data = [
        [Paragraph(f'<b>OBJECTIVE:</b> {objective_text}', s_text)],
        [Paragraph(f'<b>WHY THIS MATTERS:</b> {why_text}', s_text)],
        [Paragraph(f'<b>HOW THIS CONNECTS:</b> {connection_text}', s_text)],
    ]
    body_t = Table(body_data, colWidths=[170*mm])
    body_t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), PURPOSE_BG),
        ('TOPPADDING', (0,0), (-1,-1), 2.5*mm),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5*mm),
        ('LEFTPADDING', (0,0), (-1,-1), 4*mm),
        ('RIGHTPADDING', (0,0), (-1,-1), 4*mm),
        ('BOX', (0,0), (-1,-1), 2, PURPOSE_BORDER),
        ('LINEBELOW', (0,0), (-1,0), 0.5, PURPOSE_BORDER),
        ('LINEBELOW', (0,1), (-1,1), 0.5, PURPOSE_BORDER),
    ]))
    
    story.append(Spacer(1, 2*mm))
    story.append(header_t)
    story.append(body_t)
    story.append(Spacer(1, 3*mm))


# ═══════════════════════════════════════════════════════════════════════
OUTPUT = '/home/z/my-project/download/PowerBI_1Hour_Workshop_Zero_to_Hero.pdf'
doc = SimpleDocTemplate(OUTPUT, pagesize=A4, topMargin=18*mm, bottomMargin=18*mm, leftMargin=20*mm, rightMargin=20*mm)
story = []

# ──────────────────────────────────────────────────────────────────────
# COVER
# ──────────────────────────────────────────────────────────────────────
story.append(Spacer(1, 20*mm))
story.append(Paragraph('POWER BI', ParagraphStyle('BG', fontName='Carlito-Bold', fontSize=44, leading=50, textColor=NAVY, alignment=TA_CENTER)))
story.append(Spacer(1, 2*mm))
story.append(Paragraph('ZERO to HERO', ParagraphStyle('BG2', fontName='Carlito-Bold', fontSize=36, leading=42, textColor=ORANGE, alignment=TA_CENTER)))
story.append(Spacer(1, 6*mm))

line_data = [['']]
line_t = Table(line_data, colWidths=[80*mm])
line_t.setStyle(TableStyle([('LINEBELOW', (0,0), (-1,-1), 2, BLUE), ('TOPPADDING', (0,0), (-1,-1), 0), ('BOTTOMPADDING', (0,0), (-1,-1), 0), ('ALIGN', (0,0), (-1,-1), 'CENTER')]))
story.append(line_t)
story.append(Spacer(1, 8*mm))

story.append(Paragraph('1-Hour Complete Workshop Guide', cover_sub))
story.append(Paragraph('For Absolute Beginners - No Experience Needed', cover_sub))
story.append(Spacer(1, 15*mm))

# Workshop info boxes
info_data = [
    [Paragraph('<b>DURATION</b>', ParagraphStyle('I1', fontName='Carlito-Bold', fontSize=10, textColor=white, alignment=TA_CENTER)),
     Paragraph('<b>LEVEL</b>', ParagraphStyle('I2', fontName='Carlito-Bold', fontSize=10, textColor=white, alignment=TA_CENTER)),
     Paragraph('<b>DATA</b>', ParagraphStyle('I3', fontName='Carlito-Bold', fontSize=10, textColor=white, alignment=TA_CENTER))],
    [Paragraph('60 Minutes', ParagraphStyle('I4', fontName='Carlito', fontSize=14, textColor=NAVY, alignment=TA_CENTER)),
     Paragraph('Zero Beginner', ParagraphStyle('I5', fontName='Carlito', fontSize=14, textColor=NAVY, alignment=TA_CENTER)),
     Paragraph('Financial Sample', ParagraphStyle('I6', fontName='Carlito', fontSize=14, textColor=NAVY, alignment=TA_CENTER))]
]
info_t = Table(info_data, colWidths=[53*mm, 53*mm, 53*mm])
info_t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (0,0), NAVY), ('BACKGROUND', (1,0), (1,0), BLUE), ('BACKGROUND', (2,0), (2,0), ORANGE),
    ('TOPPADDING', (0,0), (-1,-1), 2*mm), ('BOTTOMPADDING', (0,0), (-1,-1), 2*mm),
    ('ALIGN', (0,0), (-1,-1), 'CENTER'), ('BOX', (0,0), (-1,-1), 1, NAVY)
]))
story.append(info_t)
story.append(Spacer(1, 15*mm))
story.append(Paragraph('DTank54 Group', cover_info))
story.append(Paragraph('You will build your first dashboard in 1 hour', cover_info))
story.append(PageBreak())

# ──────────────────────────────────────────────────────────────────────
# WORKSHOP MISSION (NEW - The Most Important Page)
# ──────────────────────────────────────────────────────────────────────
story.append(Spacer(1, 5*mm))
story.append(Paragraph('WORKSHOP MISSION', mission_title))
story.append(Spacer(1, 3*mm))

# Big mission statement
mission_stmt_data = [[Paragraph(
    '<b>In 60 minutes, we will transform a raw Excel file with 700 rows of boring numbers '
    'into an interactive business dashboard that answers REAL business questions.</b>',
    ParagraphStyle('MS', fontName='Carlito-Bold', fontSize=13, leading=19, textColor=MISSION_BORDER, alignment=TA_CENTER))]]
mission_stmt_t = Table(mission_stmt_data, colWidths=[160*mm])
mission_stmt_t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), HexColor('#FFF8E1')),
    ('TOPPADDING', (0,0), (-1,-1), 4*mm),
    ('BOTTOMPADDING', (0,0), (-1,-1), 4*mm),
    ('LEFTPADDING', (0,0), (-1,-1), 5*mm),
    ('RIGHTPADDING', (0,0), (-1,-1), 5*mm),
    ('BOX', (0,0), (-1,-1), 2.5, MISSION_BORDER),
]))
story.append(mission_stmt_t)
story.append(Spacer(1, 5*mm))

# BEFORE vs AFTER comparison
story.append(Paragraph('<b>BEFORE vs AFTER: The Transformation</b>', ParagraphStyle('BVA', fontName='Carlito-Bold', fontSize=13, leading=18, textColor=NAVY, alignment=TA_CENTER, spaceAfter=3*mm)))
story.append(Spacer(1, 2*mm))

before_style = ParagraphStyle('BS', fontName='Serif', fontSize=9.5, leading=13, textColor=RED)
after_style = ParagraphStyle('AS', fontName='Serif', fontSize=9.5, leading=13, textColor=GREEN)
before_hdr = ParagraphStyle('BH', fontName='Carlito-Bold', fontSize=10, leading=14, textColor=white, alignment=TA_CENTER)
after_hdr = ParagraphStyle('AH', fontName='Carlito-Bold', fontSize=10, leading=14, textColor=white, alignment=TA_CENTER)

bva_data = [
    [Paragraph('<b>BEFORE THE WORKSHOP</b>', before_hdr),
     Paragraph('<b>AFTER THE WORKSHOP</b>', after_hdr)],
    [Paragraph('A boring Excel file with 700 rows of numbers that nobody wants to read', before_style),
     Paragraph('An interactive dashboard with colorful charts, KPI cards, and slicers', after_style)],
    [Paragraph('Questions like "Which country makes the most money?" take 30 minutes to answer in Excel', before_style),
     Paragraph('Click one button on the slicer and the answer appears instantly', after_style)],
    [Paragraph('Static reports that are outdated as soon as new data arrives', before_style),
     Paragraph('Live reports that update automatically when you refresh the data', after_style)],
    [Paragraph('Your manager has to ask you for every number', before_style),
     Paragraph('Your manager can explore the data themselves by clicking around', after_style)],
    [Paragraph('You feel confused looking at rows and columns', before_style),
     Paragraph('You feel confident because you can see patterns and stories in the data', after_style)],
]
bva_t = Table(bva_data, colWidths=[85*mm, 85*mm])
bva_t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (0,0), RED),
    ('BACKGROUND', (1,0), (1,0), GREEN),
    ('TOPPADDING', (0,0), (-1,-1), 2*mm),
    ('BOTTOMPADDING', (0,0), (-1,-1), 2*mm),
    ('LEFTPADDING', (0,0), (-1,-1), 3*mm),
    ('RIGHTPADDING', (0,0), (-1,-1), 3*mm),
    ('GRID', (0,0), (-1,-1), 0.5, HexColor('#BDC3C7')),
    ('BOX', (0,0), (-1,-1), 1, NAVY),
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('BACKGROUND', (0,1), (0,-1), HexColor('#FFF0F0')),
    ('BACKGROUND', (1,1), (1,-1), HexColor('#F0FFF0')),
]))
story.append(bva_t)
story.append(Spacer(1, 4*mm))

# BUSINESS QUESTIONS we will answer
story.append(Paragraph('<b>7 BUSINESS QUESTIONS We Will Answer Today</b>', ParagraphStyle('BQ', fontName='Carlito-Bold', fontSize=13, leading=18, textColor=NAVY, alignment=TA_CENTER, spaceAfter=3*mm)))
story.append(Spacer(1, 2*mm))
P('By the end of this workshop, your dashboard will be able to answer all of these questions with one click:', story)

questions = [
    ['Q1', 'Which country makes the most money from sales?', 'Bar chart: Revenue by Country'],
    ['Q2', 'How do our sales change over time? Are we growing or shrinking?', 'Line chart: Sales Over Time'],
    ['Q3', 'What is our total revenue, profit, and cost?', '4 KPI cards at the top of the dashboard'],
    ['Q4', 'Which product is the most profitable?', 'Slicer + bar chart: filter by Product'],
    ['Q5', 'What is our profit margin percentage?', 'DAX measure: Profit Margin %'],
    ['Q6', 'How many sales transactions do we have?', 'DAX measure: Number of Sales'],
    ['Q7', 'How does performance differ by customer segment?', 'Slicer + all charts: filter by Segment'],
]
story.append(make_table(
    ['#', 'Business Question', 'Dashboard Element That Answers It'],
    questions,
    [10*mm, 80*mm, 80*mm]
))

story.append(Spacer(1, 4*mm))

# WHY each time block exists
story.append(Paragraph('<b>WHY Each Time Block Exists</b>', ParagraphStyle('WBH', fontName='Carlito-Bold', fontSize=13, leading=18, textColor=NAVY, alignment=TA_CENTER, spaceAfter=3*mm)))
story.append(Spacer(1, 2*mm))
P('Every minute of this workshop has a purpose. Here is exactly why we spend time on each block:', story)

story.append(make_table(
    ['Time Block', 'What We Do', 'Why We Spend Time On This'],
    [
        ['5 min (Part 1)', 'Welcome and understand Power BI', 'Without understanding WHY we use Power BI, the rest of the workshop is just clicking buttons blindly. You need the big picture first.'],
        ['10 min (Part 2)', 'Install Power BI and download data', 'Without software and data, we cannot do anything. This is the mandatory setup step. Skip it and nothing else works.'],
        ['10 min (Part 3)', 'Load data into Power BI', 'Loading data is step 1 of EVERY Power BI project ever created. Master this and you can start any project.'],
        ['10 min (Part 4)', 'Explore and understand the data', 'If you do not know your data, you cannot build good charts. This step prevents mistakes later. Like reading a recipe before cooking.'],
        ['15 min (Part 5)', 'Build the dashboard (charts, cards, slicers)', 'This is the CORE SKILL of Power BI. This is what you came here to learn. We spend the most time here because it is the most important.'],
        ['5 min (Part 6)', 'Add DAX formulas (custom calculations)', 'DAX transforms your dashboard from "showing raw numbers" to "showing smart answers." This is what separates beginners from intermediate users.'],
        ['5 min (Part 7)', 'Summary and next steps', 'Without reflection, you forget 80% of what you learned. We review so you remember, and we plan next steps so you keep learning after today.'],
    ],
    [22*mm, 48*mm, 100*mm]
))

story.append(Spacer(1, 4*mm))

# What you will have at the end
story.append(Paragraph('<b>What You Will Have at the End of This Workshop</b>', ParagraphStyle('WYH', fontName='Carlito-Bold', fontSize=13, leading=18, textColor=NAVY, alignment=TA_CENTER, spaceAfter=3*mm)))
story.append(Spacer(1, 1*mm))
B('A working Power BI report file (My_First_Dashboard.pbix) saved on your computer', story)
B('A dashboard with 4 KPI cards, a bar chart, a line chart, and 3 interactive slicers', story)
B('2 custom DAX measures (Profit Margin % and Average Sale Size)', story)
B('The ability to answer 7 real business questions from your data', story)
B('Understanding of the complete Power BI workflow (the same process professionals use)', story)
B('A clear learning path to go from beginner to professional', story)

story.append(PageBreak())

# ──────────────────────────────────────────────────────────────────────
# WORKSHOP OVERVIEW (Agenda)
# ──────────────────────────────────────────────────────────────────────
story.append(Paragraph('WORKSHOP AGENDA', ParagraphStyle('AG', fontName='Carlito-Bold', fontSize=22, leading=28, textColor=NAVY, alignment=TA_CENTER, spaceAfter=6*mm)))
story.append(Spacer(1, 3*mm))
P('This workshop takes you from zero Power BI knowledge to building your own dashboard in just 60 minutes. You do not need any prior experience. Just follow each step exactly as shown. By the end, you will say: "I understand how Power BI works and I can build basic reports."', story)

SP(3, story)
story.append(make_table(
    ['Time', 'Section', 'What You Will Do', 'Result'],
    [
        ['0:00 - 0:05', 'Part 1: Welcome', 'Understand what Power BI is and why companies use it', 'You know the big picture'],
        ['0:05 - 0:15', 'Part 2: Setup', 'Install Power BI Desktop and open the application', 'Software is ready to use'],
        ['0:15 - 0:25', 'Part 3: Load Data', 'Connect to Financial Sample Excel file and load it', 'Data is inside Power BI'],
        ['0:25 - 0:35', 'Part 4: Explore Data', 'Look at your data, understand columns and rows', 'You know your data'],
        ['0:35 - 0:50', 'Part 5: Build Dashboard', 'Create charts, KPIs, and slicers step by step', 'Your first dashboard!'],
        ['0:50 - 0:55', 'Part 6: Add DAX', 'Write your first DAX measure (simple calculation)', 'Report becomes smart'],
        ['0:55 - 1:00', 'Part 7: Summary', 'Review what you learned and plan next steps', 'You know the full process'],
    ],
    [22*mm, 28*mm, 70*mm, 50*mm]
))

SP(5, story)
tip('Workshop Rules', '1) Follow every step in order. Do not skip steps. 2) If something looks different on your screen, do not worry - just find the closest match. 3) Ask questions anytime. There are no stupid questions in this workshop. 4) Take your time. It is better to understand slowly than to rush and get confused.', story)

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════
# PART 1: Welcome (5 min)
# ═══════════════════════════════════════════════════════════════════════
section_bar('PART 1: Welcome - What is Power BI?', '5 MINUTES', story)

purpose_block(
    'Understand the big picture: what Power BI is, why companies use it, and what YOU will build today.',
    'Without understanding WHY we use Power BI, the rest of the workshop is just clicking buttons blindly. You need to know the destination before you start the journey. This 5 minutes gives you the map.',
    'This connects directly to Part 2 (Setup) because once you understand what Power BI does, you will be motivated to install it and get started immediately.',
    story, minutes='5'
)

P('Welcome to the workshop! In this first 5 minutes, you will understand the big picture. What is Power BI? Why do companies use it? What will YOU be able to do after this workshop? Let us start from the very beginning.', story)

S('1.1 The Problem: Too Much Data, No Clear Answers', story)
P('Imagine you work for a company. Your manager gives you an Excel file with 700 rows of sales data. The file has 12 columns: Date, Product, Country, Sales Amount, Profit, and more. Your manager says: "I need a report that shows me how our business is doing." What do you do?', story)
P('In the old days, you would spend hours in Excel making charts, copying data, and creating formulas. And every time the data changes, you have to do it all again. This is slow, boring, and error-prone. There must be a better way.', story)

S('1.2 The Solution: Power BI', story)
P('Power BI is a free tool from Microsoft that solves this problem. It takes your raw data (like an Excel file) and turns it into beautiful, interactive reports and dashboards. With Power BI, you can:', story)
B('Connect to your data source (Excel, database, web, etc.) in one click', story)
B('Create beautiful charts and visualizations by dragging and dropping (no coding!)', story)
B('Build dashboards that update automatically when data changes', story)
B('Share reports with your team through the web', story)
B('Ask questions in plain English and get visual answers', story)

S('1.3 Power BI is Like...', story)
story.append(make_table(
    ['Think of It As...', 'Because...', 'Power BI Equivalent'],
    [
        ['A translator', 'It translates raw numbers into visual stories that humans can understand', 'Charts and dashboards'],
        ['A camera', 'It takes a "picture" of your data at a specific moment in time', 'Snapshot of current data'],
        ['A calculator', 'It does complex math automatically (sums, averages, percentages)', 'DAX measures'],
        ['A filter', 'It lets you focus on specific parts of your data (one country, one month)', 'Slicers and filters'],
        ['A bridge', 'It connects raw data to human understanding', 'The entire Power BI workflow'],
    ],
    [30*mm, 70*mm, 70*mm]
))

S('1.4 What You Will Build Today', story)
P('By the end of this 1-hour workshop, you will build a complete dashboard from scratch using a real financial dataset. Your dashboard will have:', story)
B('4 big number cards showing key business metrics (Total Revenue, Total Profit, etc.)', story)
B('A bar chart showing sales by country', story)
B('A line chart showing sales over time', story)
B('3 interactive slicers that let you filter everything with one click', story)
P('This is exactly the kind of work that professional Power BI developers do every day. The only difference is that their dashboards are bigger. The process is the same.', story)

goal_box('After Part 1, you should understand:', 'Power BI is a free Microsoft tool that turns raw data into interactive visual reports. Companies use it to make faster, better decisions. Today you will build your first dashboard from scratch.', story)

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════
# PART 2: Setup (10 min)
# ═══════════════════════════════════════════════════════════════════════
section_bar('PART 2: Setup - Install and Prepare', '10 MINUTES', story)

purpose_block(
    'Install Power BI Desktop (free) on your computer and download the Financial Sample Excel data file.',
    'Without the Power BI software, we cannot build anything. Without the data file, we have nothing to visualize. This is the mandatory foundation step - like buying ingredients before you start cooking. Skip this and nothing else works.',
    'This connects directly to Part 3 (Load Data) where we will take the data file you just downloaded and load it into Power BI. You need both pieces ready before we can start building.',
    story, minutes='10'
)

P('Before we can build anything, we need two things: the Power BI software and the sample data file. This part takes about 10 minutes. Follow each step carefully.', story)

S('2.1 Important Words to Know', story)
P('Before we start, let me explain a few words that you will see many times. These words are simple, but knowing what they mean will help you follow the instructions:', story)

story.append(make_table(
    ['Word', 'What It Means (Simple)', 'Example'],
    [
        ['Power BI Desktop', 'The free program you install on your computer. You build reports here.', 'Like Microsoft Word, but for data reports instead of documents.'],
        ['Dashboard', 'One page that shows the most important numbers and charts at a glance.', 'Like the main screen in a car: speed, fuel, warnings.'],
        ['Visual', 'Any chart, graph, map, or number card in your report.', 'A bar chart is a visual. A map is a visual. A KPI card is a visual.'],
        ['Data Source', 'The file or database where your raw data lives (like an Excel file).', 'Your Excel file with 700 rows of sales data is your data source.'],
        ['Field', 'Another word for "column" in your data. Like "Date" or "Sales" or "Country".', 'When you see "Fields pane," it means "list of all your columns."'],
        ['Slicer', 'A clickable filter. Click on "France" and all charts show only France data.', 'Like a button that filters your entire dashboard with one click.'],
        ['Measure', 'A dynamic calculation. Changes when you change filters. Created with DAX.', 'Total Sales = SUM(Sales) is a measure. If you filter to France, it shows France sales only.'],
        ['DAX', 'The formula language of Power BI. Like Excel formulas but more powerful.', 'Instead of =SUM(A1:A100), you write Total Sales = SUM(Sales[Amount]).'],
    ],
    [28*mm, 75*mm, 67*mm]
))

SP(3, story)
S('2.2 Step-by-Step: Install Power BI Desktop', story)

step(1, 'Open Your Web Browser', story, GREEN, GREEN_BG)
P('Open Chrome, Edge, or Firefox on your computer. You will use it to download the free Power BI software.', story)

step(2, 'Go to the Download Page', story, GREEN, GREEN_BG)
P('Type this address in your browser address bar and press Enter:', story)
C('https://www.microsoft.com/en-us/download/details.aspx?id=58494', story)
P('Or you can search Google for: "Download Power BI Desktop Free"', story)

step(3, 'Download the File', story, GREEN, GREEN_BG)
P('On the Microsoft page, click the big blue "Download" button. Choose "Power BI Desktop (x64)." The file is about 500 MB. Wait for the download to finish.', story)

step(4, 'Install Power BI Desktop', story, GREEN, GREEN_BG)
P('After the download finishes, open the downloaded file (PBIDesktopSetup.exe). Then:', story)
B('Click "Next" on the welcome screen', story)
B('Click "I Accept" for the license terms', story)
B('Click "Next" for the installation folder (default is fine)', story)
B('Click "Install" and wait 3-5 minutes', story)
B('Click "Finish" when installation is complete', story)
P('Power BI Desktop will open automatically. You will see a welcome screen with options to get data, open files, or open recent reports.', story)

step(5, 'Download the Financial Sample Data', story, ORANGE, ORANGE_BG)
P('You need sample data to practice with. Download the Microsoft Financial Sample file:', story)
C('https://learn.microsoft.com/en-us/power-bi/create-reports/sample-financial-download', story)
P('Or search Google for: "Microsoft Financial Sample Excel Power BI." Download the Excel file and save it to your Desktop. The file is called "Financial Sample.xlsx."', story)

warn('If You Already Have Power BI Installed', 'Skip Steps 1-4 and go directly to Step 5 to download the data file. If you already have the Financial Sample file, you can skip Step 5 too. Go to Part 3.', story)

goal_box('After Part 2, you should have:', '1) Power BI Desktop installed and open on your computer. 2) Financial Sample Excel file saved on your Desktop. You are ready to start building!', story)

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════
# PART 3: Load Data (10 min)
# ═══════════════════════════════════════════════════════════════════════
section_bar('PART 3: Load Data into Power BI', '10 MINUTES', story)

purpose_block(
    'Connect the Financial Sample Excel file to Power BI and load all 700 rows and 12 columns.',
    'Loading data is step 1 of EVERY Power BI project in the real world. Whether you work at a small company or Microsoft, every dashboard starts by loading data. Master this step and you can start any Power BI project. Without data inside Power BI, there is nothing to visualize.',
    'This connects to Part 4 (Explore Data) where we will look at the data we just loaded to understand it before building charts. You must load data before you can explore it.',
    story, minutes='10'
)

P('Now the real work begins. In this part, you will load the Financial Sample Excel file into Power BI. This is like opening a document in Microsoft Word. Once the data is loaded, Power BI knows about all your rows and columns and can start working with them.', story)

S('3.1 Understanding the Financial Sample Data', story)
P('Before loading, let us understand what is inside the Excel file. This file simulates a real company that sells bicycles and accessories in 5 countries over 3 years (2013-2015). Here is what each column means:', story)

story.append(make_table(
    ['Column', 'Type', 'Simple Explanation', 'Example'],
    [
        ['Date', 'Date', 'When the sale happened', 'January 1, 2014'],
        ['Product', 'Text', 'What was sold (bicycle or accessory)', 'Montana, Dakota, Paseo'],
        ['Segment', 'Text', 'Who bought it (type of customer)', 'Government, Enterprise, SMB'],
        ['Country', 'Text', 'Where it was sold', 'USA, France, Germany, Canada, Mexico'],
        ['Units Sold', 'Number', 'How many items were sold', '100, 250, 1800'],
        ['Sale Price', 'Money', 'Price per item', '$10, $25, $50'],
        ['Sales', 'Money', 'Total money received (after discounts)', '$1,000, $5,000'],
        ['COGS', 'Money', 'Cost of making the products', '$300, $1,250'],
        ['Profit', 'Money', 'Sales minus COGS (money we earned)', '$600, $3,250'],
    ],
    [25*mm, 18*mm, 70*mm, 57*mm]
))

SP(2, story)
tip('The Most Important Columns', 'For our dashboard, we will mainly use 6 columns: Date, Product, Segment, Country, Sales, and Profit. The other columns are useful but not needed for the basic dashboard we build today.', story)

S('3.2 Step-by-Step: Load the Data', story)

step(1, 'Open Power BI Desktop', story)
P('Open Power BI Desktop on your computer. You will see the start screen. It shows "Get Data," "Recent," and "Open other reports" options.', story)

step(2, 'Click "Get Data"', story)
P('Find the "Get Data" button on the Home ribbon at the top of the screen. It has a database icon with an arrow. Click it. A menu will appear with many data source options.', story)

step(3, 'Select "Excel"', story)
P('In the menu, find "Excel" under the "Common" category (it has an Excel icon). Click on it. A file browser window will open.', story)

step(4, 'Browse to Your File', story)
P('In the file browser, find the Financial Sample.xlsx file on your Desktop. Click on it, then click "Open."', story)

step(5, 'The Navigator Window', story)
P('A Navigator window appears. It shows what is inside your Excel file. You will see:', story)
B('<b>Financials</b> - This is the main data sheet (about 700 rows). CHECK this box.', story)
B('<b>Sheet1</b> - An empty sheet. Do NOT check this.', story)
P('On the right side, you can see a preview of the data with all the columns (Date, Product, Segment, Country, Sales, Profit, etc.). This confirms you have the right file.', story)

# Navigator dialog image
add_image('02_navigator_dialog.png', story, w=440, h=280)

step(6, 'Click "Load"', story)
P('At the bottom of the Navigator window, click "Load." Power BI will read all the data from the Excel file. This takes a few seconds. When it is done, you will see the main Power BI window with your data loaded.', story)

S('3.3 Verify the Data Loaded Correctly', story)
P('After loading, check these things to make sure everything worked:', story)
B('On the right side, in the <b>Fields pane</b>, you should see a table called "Financials"', story)
B('Under "Financials," you should see all 12 column names listed', story)
B('The columns should include: Date, Product, Segment, Country, Units Sold, Manufacturing Price, Sale Price, Gross Sales, Discounts, Sales, COGS, Profit', story)
B('If you click on the <b>Data</b> view icon (table icon on the left), you can see the actual rows of data', story)

warn('If You Do Not See the Fields Pane', 'If the right panel is not visible, go to the top menu and click "View" then check "Fields pane." Sometimes panels get hidden accidentally.', story)

goal_box('After Part 3, you should have:', 'The Financial Sample data loaded into Power BI. You can see all 12 columns in the Fields pane on the right side. Your data is ready for the next step.', story)

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════
# PART 4: Explore Data (10 min)
# ═══════════════════════════════════════════════════════════════════════
section_bar('PART 4: Explore and Understand Your Data', '10 MINUTES', story)

purpose_block(
    'Look at your data rows, check data types, and understand the structure (700 rows, 12 columns, 7 products, 5 countries, 3 years).',
    'Understanding your data before building charts is like reading the recipe before cooking. If you know your ingredients, you can cook a better meal. If you know your data, you can build a better report. This step prevents mistakes later - for example, if the Date column has the wrong type, your time charts will not work.',
    'This connects directly to Part 5 (Build Dashboard) where we will use the columns we just explored to create charts. You need to know your columns (Country, Sales, Profit, Date, etc.) before you can drag them onto charts.',
    story, minutes='10'
)

P('Before we build any charts, we need to understand our data. This is a very important step that many beginners skip. If you do not know your data, you cannot build good reports. In this part, we will look at our data carefully and understand what we are working with.', story)

S('4.1 Understanding the Power BI Desktop Screen', story)
P('Before we explore data, let us understand the Power BI Desktop interface. Look at your screen. There are 4 important areas:', story)

story.append(make_table(
    ['Area', 'Where It Is', 'What It Does'],
    [
        ['Canvas', 'Center (big white area)', 'This is where you build your report. All your charts go here.'],
        ['Fields Pane', 'Right side', 'Shows all your columns. You drag fields from here onto charts.'],
        ['Visualizations Pane', 'Right side (below Fields)', 'Icons for all chart types: bar, line, map, table, card, slicer.'],
        ['Top Ribbon', 'Top of screen', 'Buttons for formatting, data tools, and model tools.'],
    ],
    [30*mm, 40*mm, 100*mm]
))

# Power BI Desktop UI image
add_image('01_pbi_desktop_ui.png', story, w=460, h=300)

S('4.2 Switch to Data View', story)
P('On the left side of the Power BI window, there are 3 icons. Click the <b>second icon</b> (it looks like a table). This is the Data View. Here you can see your data in a table format, similar to Excel. You can scroll through all 700 rows and see every value in every column.', story)

S('4.3 Check the Data View', story)
P('While looking at the Data View, notice these important things:', story)
B('How many rows do you see? (Scroll to the bottom - there should be about 700 rows)', story)
B('How many columns are there? (12 columns)', story)
B('Do all columns have data, or are some cells empty?', story)
B('Are dates showing correctly? (They should look like dates, not random numbers)', story)

S('4.4 Check Data Types', story)
P('Data types tell Power BI how to treat each column. Click on each column header in the Data View. Then look at the top ribbon to see the current data type. Here is what each column should be:', story)

story.append(make_table(
    ['Column', 'Should Be', 'Why It Matters'],
    [
        ['Date', 'Date type', 'Power BI needs to know this is a date so it can create time-based charts'],
        ['Product', 'Text type', 'Text is correct for names and categories'],
        ['Segment', 'Text type', 'Text is correct for names and categories'],
        ['Country', 'Text type', 'Text is correct for names and categories'],
        ['Sales', 'Decimal Number', 'Must be a number so Power BI can do math (sum, average, etc.)'],
        ['Profit', 'Decimal Number', 'Must be a number so Power BI can do math'],
        ['COGS', 'Decimal Number', 'Must be a number so Power BI can do math'],
    ],
    [30*mm, 35*mm, 105*mm]
))

tip('What If a Column Has the Wrong Type?', 'If the Date column shows as "Text" instead of "Date," click on the column header, go to the top ribbon, and change the type to "Date." Wrong data types cause problems later, especially for time-based charts. Always verify types after loading data.', story)

S('4.5 Key Facts About Our Data', story)
story.append(make_table(
    ['Fact', 'Value', 'What This Means for Our Dashboard'],
    [
        ['Total Rows', 'About 700', '700 sales transactions. Small enough to work fast.'],
        ['Date Range', '2013 to 2015', '3 years of data. Enough to see trends and compare years.'],
        ['Products', '7 unique products', '5 bicycles + 2 accessories. We can compare their performance.'],
        ['Segments', '5 customer types', 'Government, Enterprise, Midmarket, SMB, Channel Partners.'],
        ['Countries', '5 countries', 'USA, Canada, France, Germany, Mexico. We can compare regions.'],
        ['Money Columns', 'Sales, Profit, COGS', 'We can calculate profit margins and revenue.'],
    ],
    [25*mm, 35*mm, 110*mm]
))

S('4.6 Switch to Report View', story)
P('Now click the <b>first icon</b> on the left side (it looks like a bar chart). This is the Report View. This is where we will build our dashboard. The canvas (the big white area in the center) is empty. We will fill it with charts in the next part.', story)

goal_box('After Part 4, you should understand:', 'Your data has 700 rows, 12 columns, 7 products, 5 countries, and covers 3 years (2013-2015). The Sales and Profit columns contain the numbers we want to analyze. The Product, Segment, Country, and Date columns are our categories for grouping and filtering.', story)

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════
# PART 5: Build Dashboard (15 min)
# ═══════════════════════════════════════════════════════════════════════
section_bar('PART 5: Build Your First Dashboard', '15 MINUTES', story)

purpose_block(
    'Build a complete dashboard with 4 KPI cards, a bar chart (revenue by country), a line chart (sales over time), and 3 interactive slicers.',
    'This is the CORE SKILL of Power BI. Every dashboard in every company is built using the same drag-and-drop process you will learn now. We spend the most time on this part (15 minutes) because this is the most important skill. If you master this, you can build any basic dashboard for any data.',
    'This connects to Part 6 (Add DAX) where we will make our dashboard smarter with custom calculations. Right now our dashboard shows raw numbers - DAX will turn it into a tool that answers business questions.',
    story, minutes='15'
)

P('This is the most exciting part! In the next 15 minutes, you will build a complete dashboard with 4 KPI cards, 2 charts, and 3 slicers. Follow every step exactly. Do not worry if your dashboard does not look perfect. The goal is to understand the process, not to make a beautiful design.', story)

S('5.1 The Fundamental Process', story)
P('Every chart in Power BI is built the same way. Learn this process once and you can build any chart:', story)
B('<b>Step A:</b> Click a visual icon in the Visualizations pane (right side)', story)
B('<b>Step B:</b> Drag a field from the Fields pane to the "Axis" area', story)
B('<b>Step C:</b> Drag a field from the Fields pane to the "Values" area', story)
P('That is it! You repeat this 3-step process for every chart, card, and slicer. This is the fundamental skill of Power BI.', story)

# Build visualization image
add_image('05_build_visualization.png', story, w=460, h=300)

S('5.2 KPI Card 1: Total Revenue', story)

step(1, 'Click the Card Icon', story, GREEN, GREEN_BG)
P('In the Visualizations pane (right side), find the icon that looks like a number "123" in a card. This is the "Card" visual. Click it once. A blank card appears on your canvas.', story)

step(2, 'Drag Sales to the Card', story, GREEN, GREEN_BG)
P('In the Fields pane (right side), find the column called "Sales" under the Financials table. Click on it, hold the mouse button, and drag it onto the card visual. The card now shows a big number: the total of all sales in the dataset.', story)

step(3, 'Format the Card', story, GREEN, GREEN_BG)
P('Click on the card. Then click the paintbrush icon (Format) in the Visualizations pane. Set "Data label" to display units as "Millions" if available. This makes the big number easier to read (like $2.5M instead of $2,500,000). Resize the card by dragging its edges.', story)

S('5.3 KPI Card 2: Total Profit', story)
step(4, 'Create Another Card', story, GREEN, GREEN_BG)
P('Click on an empty area of the canvas. Click the Card icon again. Drag the "Profit" column from the Fields pane onto this card. Now you have two cards: one showing Total Revenue and one showing Total Profit. Position them side by side at the top of the canvas.', story)

S('5.4 KPI Card 3: Total COGS', story)
step(5, 'Create a Third Card', story, GREEN, GREEN_BG)
P('Click on empty canvas space. Click Card icon. Drag "COGS" onto it. Position it next to the other two cards.', story)

S('5.5 KPI Card 4: Number of Sales', story)
step(6, 'Create a Fourth Card', story, GREEN, GREEN_BG)
P('Click on empty canvas space. Click Card icon. This time, instead of dragging a column, right-click on "Financials" in the Fields pane and select "New measure." In the formula bar at the top, type:', story)
C('Number of Sales = COUNTROWS(Financials)', story)
P('Press Enter. A new measure called "Number of Sales" appears in the Fields pane (with a calculator icon). Drag it onto the card.', story)

tip('What Is a Measure?', 'A measure is a dynamic calculation. COUNTROWS(Financials) counts how many rows are in your data. When you filter the data (for example, to France), the measure automatically recalculates to show only French sales count. This is what makes measures powerful.', story)

S('5.6 Bar Chart: Revenue by Country', story)

step(7, 'Click the Bar Chart Icon', story, BLUE, LIGHT_BLUE)
P('Click on an empty area of the canvas. In the Visualizations pane, find the "Clustered bar chart" icon (it looks like vertical bars). Click it. A blank chart appears.', story)

step(8, 'Drag Country to Axis', story, BLUE, LIGHT_BLUE)
P('Find "Country" in the Fields pane. Drag it to the "Axis" area in the Visualizations pane (below the chart icon). The chart now shows country names on the X-axis.', story)

step(9, 'Drag Sales to Values', story, BLUE, LIGHT_BLUE)
P('Find "Sales" in the Fields pane. Drag it to the "Values" area. The chart now shows bars for each country, where the bar height represents total sales for that country. You can see which country has the highest and lowest sales.', story)

step(10, 'Sort the Chart', story, BLUE, LIGHT_BLUE)
P('To sort the bars from highest to lowest: click the three dots (...) on the top-right of the chart. Click "Sort axis." Select "Sales" and choose "Descending." Now the tallest bar is on the left.', story)

S('5.7 Line Chart: Sales Over Time', story)

step(11, 'Click the Line Chart Icon', story, PURPLE, PURPLE_BG)
P('Click on empty canvas space. Click the "Line chart" icon (looks like a line going up and down). A blank line chart appears.', story)

step(12, 'Drag Date to Axis', story, PURPLE, PURPLE_BG)
P('Drag "Date" from the Fields pane to the "Axis" area. The chart shows dates along the bottom (X-axis).', story)

step(13, 'Drag Sales to Values', story, PURPLE, PURPLE_BG)
P('Drag "Sales" to the "Values" area. A line appears showing how sales changed over time. You can see if sales went up, down, or stayed the same.', story)

S('5.8 Slicer 1: Country Filter', story)

step(14, 'Click the Slicer Icon', story, ORANGE, ORANGE_BG)
P('Click on empty canvas space. In the Visualizations pane, find the "Slicer" icon (looks like a funnel). Click it. A blank slicer appears.', story)

step(15, 'Drag Country to the Slicer', story, ORANGE, ORANGE_BG)
P('Drag "Country" from the Fields pane onto the slicer. The slicer now shows a list of all 5 countries: USA, Canada, France, Germany, Mexico. Each country is clickable.', story)

step(16, 'Test the Slicer', story, ORANGE, ORANGE_BG)
P('Click on "France" in the slicer. Watch what happens: ALL charts and ALL cards on the page change to show only data for France. The Total Revenue card shows only French revenue. The bar chart shows only France. Click on "France" again to deselect it, and all visuals return to showing all countries.', story)

tip('This Is the Magic of Power BI!', 'The fact that clicking one slicer changes ALL visuals is called "cross-filtering." This is what makes Power BI so powerful. Users can explore data interactively without any coding or formulas. This single feature is why companies choose Power BI over static Excel reports.', story)

S('5.9 Slicer 2: Product Filter', story)
step(17, 'Add Another Slicer', story, ORANGE, ORANGE_BG)
P('Click on empty canvas space. Click the Slicer icon. Drag "Product" onto it. Now you have a second slicer showing all 7 products. Click on different products and watch the dashboard respond.', story)

S('5.10 Slicer 3: Segment Filter', story)
step(18, 'Add a Third Slicer', story, ORANGE, ORANGE_BG)
P('Click on empty canvas space. Click the Slicer icon. Drag "Segment" onto it. Now you have a third slicer showing all 5 customer segments. Try clicking different combinations: "France" + "Montana" + "Enterprise." The dashboard shows exactly that slice of data.', story)

S('5.11 Arrange Your Dashboard', story)
P('Now arrange all your visuals on the canvas. Here is the target layout we are aiming for:', story)

# Dashboard layout image
add_image('06_dashboard_layout.png', story, w=460, h=300)

P('Here is a good layout structure to follow:', story)
B('<b>Top row:</b> The 4 KPI cards side by side (Revenue, Profit, COGS, Number of Sales)', story)
B('<b>Left side:</b> The 3 slicers stacked vertically (Country, Product, Segment)', story)
B('<b>Center:</b> The bar chart (Revenue by Country)', story)
B('<b>Bottom:</b> The line chart (Sales Over Time)', story)

warn('Save Your Work!', 'Press Ctrl + S on your keyboard to save your report. Save it as "My_First_Dashboard.pbix" on your Desktop. You can open this file later to continue working on it.', story)

goal_box('After Part 5, you have built:', 'A complete interactive dashboard with 4 KPI cards, a bar chart, a line chart, and 3 slicers. When you click on any slicer value, all visuals update automatically. This is the core skill of Power BI! You can now build basic dashboards for any data.', story)

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════
# PART 6: Add DAX (5 min)
# ═══════════════════════════════════════════════════════════════════════
section_bar('PART 6: Add DAX - Make It Smart', '5 MINUTES', story)

purpose_block(
    'Write your first DAX measures: Profit Margin % and Average Sale Size. These are custom calculations that do NOT exist in the original Excel file.',
    'Right now your dashboard shows raw numbers (Sales = $X, Profit = $Y). But business people want percentages and ratios, not just totals. The original data has "Sales" and "Profit" columns but does NOT have "Profit Margin %." With DAX, you create this calculation yourself. This transforms your dashboard from "showing numbers" to "answering business questions." This is what separates beginners from intermediate users.',
    'This connects to Part 7 (Summary) where we will review everything you learned and plan your next steps. After DAX, you have experienced the complete Power BI workflow.',
    story, minutes='5'
)

P('Your dashboard looks great, but right now it only shows raw numbers from the data file. In this short part, you will write your first DAX measure. DAX is the formula language of Power BI. It lets you create custom calculations that do not exist in your original data.', story)

# DAX concept image
add_image('08_dax_concept.png', story, w=440, h=260)

S('6.1 What Is DAX? (Simple Explanation)', story)
P('DAX stands for Data Analysis Expressions. Think of it as "Excel formulas on steroids." In Excel, you write =SUM(A1:A100) to add numbers. In DAX, you write Total Sales = SUM(Sales[Amount]). The difference is that DAX formulas automatically respond to filters and slicers. If you filter to France, a DAX measure recalculates to show only French numbers. Excel formulas cannot do this.', story)

S('6.2 Create Your First DAX Measure', story)

step(1, 'Open the Measure Creator', story, PURPLE, PURPLE_BG)
P('In the Fields pane, find your "Financials" table. <b>Right-click</b> on it. A menu appears. Click <b>"New Measure."</b> A formula bar appears at the top of the screen (similar to the formula bar in Excel).', story)

step(2, 'Type the Formula', story, PURPLE, PURPLE_BG)
P('In the formula bar, type this formula exactly:', story)
C('Profit Margin % =', story)
C('VAR Revenue = SUM(Financials[Sales])', story)
C('VAR Cost = SUM(Financials[COGS])', story)
C('VAR Profit = Revenue - Cost', story)
C('RETURN DIVIDE(Profit, Revenue, 0)', story)
P('Press Enter. A new item called "Profit Margin %" appears in the Fields pane with a calculator icon (this is how you know it is a measure, not a column).', story)

step(3, 'Add the Measure to Your Dashboard', story, PURPLE, PURPLE_BG)
P('Create a new Card visual on the canvas. Drag "Profit Margin %" from the Fields pane onto the card. The card now shows a percentage (like 32.5%). This means for every $100 of sales, the company keeps about $32.50 as profit.', story)

step(4, 'Test It with Slicers', story, PURPLE, PURPLE_BG)
P('Click on different countries in the Country slicer. Watch the Profit Margin card change. Does France have a different margin than Germany? Click on different products. Does one product have a better margin than others? This is the power of DAX measures: they respond to every interaction.', story)

S('6.3 Understanding the Formula', story)
P('Let me explain what the formula does, line by line:', story)

story.append(make_table(
    ['Formula Line', 'What It Means (Plain English)'],
    [
        ['Profit Margin % =', 'This is the name of our measure. You will see this name in the Fields pane.'],
        ['VAR Revenue = SUM(Financials[Sales])', 'Create a temporary variable called "Revenue" that holds the total of the Sales column.'],
        ['VAR Cost = SUM(Financials[COGS])', 'Create a temporary variable called "Cost" that holds the total of the COGS column.'],
        ['VAR Profit = Revenue - Cost', 'Create a variable called "Profit" that is Revenue minus Cost.'],
        ['RETURN DIVIDE(Profit, Revenue, 0)', 'Divide Profit by Revenue to get the percentage. The 0 means: if Revenue is zero, show 0 instead of an error.'],
    ],
    [50*mm, 120*mm]
))

tip('Why Use VAR (Variables)?', 'Variables make DAX formulas easier to read and debug. Instead of one long formula, we break it into small steps. VAR Revenue = ... defines the value. RETURN ... uses the value. This is like writing notes to yourself: first calculate A, then B, then C, and finally return the result.', story)

S('6.4 Create a Second Measure: Average Sale Size', story)
step(5, 'Create Another Measure', story, PURPLE, PURPLE_BG)
P('Right-click on Financials in the Fields pane. Click "New Measure." Type:', story)
C('Avg Sale Size = DIVIDE(SUM(Financials[Sales]), COUNTROWS(Financials), 0)', story)
P('This divides total sales by the number of sales to get the average size of one sale. Add it as a card to your dashboard.', story)

goal_box('After Part 6, you should understand:', 'DAX is a formula language that creates dynamic calculations. Measures respond to slicers and filters. You created two measures: Profit Margin % and Average Sale Size. These are custom calculations that did not exist in the original data.', story)

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════
# PART 7: Summary (5 min)
# ═══════════════════════════════════════════════════════════════════════
section_bar('PART 7: Summary & Next Steps', '5 MINUTES', story)

purpose_block(
    'Review everything you built, understand the complete Power BI process, and plan your learning path to go from beginner to professional.',
    'Without reflection, you forget 80% of what you learned within 24 hours. We review the full process so it sticks in your memory. We also plan next steps because this 1-hour workshop only covers the basics - there is a whole world of Power BI skills waiting for you.',
    'This is the final part. After this, you will have the complete picture. You can go back to your dashboard and keep improving it, or start a new one with your own data.',
    story, minutes='5'
)

P('Congratulations! You just completed the entire Power BI workflow from zero to a working dashboard. Let us review what you learned and plan your next steps.', story)

S('7.1 What You Accomplished Today', story)
story.append(make_table(
    ['#', 'What You Did', 'Why It Matters'],
    [
        ['1', 'Understood what Power BI is', 'You know the purpose and value of Power BI'],
        ['2', 'Installed Power BI Desktop', 'You have the free tool on your computer'],
        ['3', 'Loaded data from an Excel file', 'You completed step 1 of every Power BI project'],
        ['4', 'Explored and understood your data', 'You verified data types and structure'],
        ['5', 'Built 4 KPI cards', 'You know how to show key metrics'],
        ['6', 'Built a bar chart', 'You know how to compare categories'],
        ['7', 'Built a line chart', 'You know how to show trends over time'],
        ['8', 'Created 3 slicers', 'You know how to make reports interactive'],
        ['9', 'Wrote 3 DAX measures', 'You know how to create custom calculations'],
        ['10', 'Built a complete dashboard', 'You know the full process from start to finish'],
    ],
    [8*mm, 60*mm, 102*mm]
))

S('7.2 The Complete Power BI Process', story)
P('Every Power BI project follows the same process. Whether you are a beginner or a professional with 10 years of experience, the steps are the same. The only difference is that professionals work with bigger and more complex data. Here is the process you followed today:', story)

story.append(make_table(
    ['Step', 'What You Do', 'How Long (Beginner)', 'How Long (Professional)'],
    [
        ['1. Understand', 'Learn what the business needs', '30 minutes', '1-2 days'],
        ['2. Get Data', 'Load data into Power BI', '5 minutes', '1-4 hours'],
        ['3. Explore', 'Check and understand the data', '10 minutes', '2-8 hours'],
        ['4. Clean (Power Query)', 'Fix problems, remove extra columns', 'Skipped today', '2-16 hours'],
        ['5. Model', 'Create relationships, date table', 'Skipped today', '2-8 hours'],
        ['6. Calculate (DAX)', 'Write measures and formulas', '5 minutes', '4-16 hours'],
        ['7. Visualize', 'Build charts and dashboards', '15 minutes', '4-16 hours'],
        ['8. Share', 'Publish to Power BI Service', 'Skipped today', '1-2 hours'],
    ],
    [28*mm, 55*mm, 40*mm, 47*mm]
))

SP(3, story)
tip('You Already Know Steps 1, 2, 3, 6, and 7!', 'Today you completed 5 out of 8 steps. The remaining steps (Power Query cleaning, data modeling, and publishing) are more advanced topics that you can learn next. But the core workflow is the same.', story)

S('7.3 How Professionals Work (The Difference)', story)
P('You might wonder: "What do professional Power BI developers do differently from what I just did?" Here is the honest answer:', story)

story.append(make_table(
    ['Area', 'What You Did Today', 'What Professionals Do'],
    [
        ['Data Loading', 'Loaded one Excel file', 'Connect to databases, APIs, multiple files, merge them'],
        ['Data Cleaning', 'Skipped (data was clean)', 'Use Power Query to clean messy data (takes 50% of project time)'],
        ['Data Modeling', 'Used one flat table', 'Build Star Schema with Fact and Dimension tables'],
        ['DAX', 'Wrote 3 simple measures', 'Write 50+ measures including Time Intelligence, RANKX, etc.'],
        ['Visuals', '4 cards + 2 charts + 3 slicers', '20+ visuals across 5+ pages with formatting and bookmarks'],
        ['Sharing', 'Saved on computer', 'Publish to Power BI Service, set permissions, schedule refresh'],
    ],
    [30*mm, 55*mm, 85*mm]
))

P('The key insight is: the <b>process is the same</b>. Professionals do more of each step, and they do it for bigger data, but the workflow (load, explore, clean, model, calculate, visualize, share) is identical. What you learned today is the foundation. Everything else is building on this foundation.', story)

S('7.4 Your Next Steps (Learning Path)', story)
story.append(make_table(
    ['Priority', 'What to Learn', 'How to Practice', 'Time'],
    [
        ['1', 'Power Query basics', 'Load your own Excel files and practice cleaning data', '1-2 weeks'],
        ['2', 'Star Schema modeling', 'Create DimProduct, DimDate tables from your data', '1-2 weeks'],
        ['3', 'More DAX functions', 'Learn CALCULATE, TOTALYTD, SAMEPERIODLASTYEAR', '2-3 weeks'],
        ['4', 'Report design tips', 'Colors, layout, formatting, conditional formatting', '1 week'],
        ['5', 'Publish to Power BI Service', 'Upload your report and share it online', '1-2 days'],
        ['6', 'Microsoft PL-300 exam', 'Get the official Power BI certification', '2-3 months'],
    ],
    [12*mm, 40*mm, 80*mm, 38*mm]
))

S('7.5 Quick Reference: What You Learned', story)

story.append(make_table(
    ['Skill', 'How to Do It', 'Remember This'],
    [
        ['Load data', 'Home &gt; Get Data &gt; Excel &gt; select file &gt; Load', 'Always start by loading data'],
        ['Create a card', 'Click Card icon &gt; drag a field to it', 'Cards show big summary numbers'],
        ['Create a bar chart', 'Click Bar Chart icon &gt; drag field to Axis &gt; drag field to Values', 'Axis = categories, Values = numbers'],
        ['Create a line chart', 'Click Line Chart icon &gt; drag date to Axis &gt; drag number to Values', 'Line charts show trends over time'],
        ['Create a slicer', 'Click Slicer icon &gt; drag a field to it', 'Slicers make everything interactive'],
        ['Write a DAX measure', 'Right-click table &gt; New Measure &gt; type formula &gt; Enter', 'Measures respond to filters'],
        ['Save your work', 'Press Ctrl + S', 'Save often!'],
    ],
    [30*mm, 70*mm, 70*mm]
))

S('7.6 Publishing Your Dashboard (What Comes Next)', story)
P('Right now your dashboard lives on your computer. The next step is to share it with others by publishing to the Power BI Service (online). Here is how the publish flow works:', story)

# Publish flow image
add_image('07_publish_flow.png', story, w=440, h=280)

P('The publish process is simple: File &gt; Publish &gt; select your Power BI account &gt; your report appears online. From there, you can share it with colleagues, set up automatic data refresh, and even create dashboards from your reports. This is a more advanced topic that you can explore after today.', story)

SP(3, story)
P('You have completed the 1-hour Power BI workshop. You started with zero knowledge and you now have a working dashboard with interactive charts and custom calculations. The process you learned today is the same process used by professional Power BI developers around the world. Keep practicing, keep learning, and you will become a Power BI expert.', story)

tip('Final Advice', 'The best way to get better at Power BI is to build dashboards. Open Power BI Desktop every day for 30 minutes and build something new. Connect to different data files, create different charts, write new DAX measures. Every dashboard you build makes you better. In 2-3 months of daily practice, you will be ready for professional Power BI projects.', story)

# ──────────────────────────────────────────────────────────────────────
# BUILD
# ──────────────────────────────────────────────────────────────────────
print("Building PDF...")
doc.build(story)
print(f"PDF created: {OUTPUT}")
print(f"File size: {os.path.getsize(OUTPUT) / 1024:.1f} KB")
