#!/usr/bin/env python3
"""
Power BI Interview Guide & Professional Handbook - DTank54
17 Sections - A1 English Level
Generated with ReportLab
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm, inch
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY, TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether, ListFlowable, ListItem, HRFlowable
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

# ─── Font Registration ────────────────────────────────────────────────
pdfmetrics.registerFont(TTFont('Carlito', '/usr/share/fonts/truetype/english/Carlito-Regular.ttf'))
pdfmetrics.registerFont(TTFont('Carlito-Bold', '/usr/share/fonts/truetype/english/Carlito-Bold.ttf'))
pdfmetrics.registerFont(TTFont('Carlito-Italic', '/usr/share/fonts/truetype/english/Carlito-Italic.ttf'))
pdfmetrics.registerFont(TTFont('Carlito-BoldItalic', '/usr/share/fonts/truetype/english/Carlito-BoldItalic.ttf'))
pdfmetrics.registerFont(TTFont('Tinos', '/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf'))
pdfmetrics.registerFont(TTFont('Tinos-Bold', '/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf'))
pdfmetrics.registerFont(TTFont('Tinos-Italic', '/usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf'))
pdfmetrics.registerFont(TTFont('Tinos-BoldItalic', '/usr/share/fonts/truetype/liberation/LiberationSerif-BoldItalic.ttf'))
pdfmetrics.registerFont(TTFont('DejaVuSans', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
pdfmetrics.registerFont(TTFont('DejaVuSans-Bold', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))

pdfmetrics.registerFontFamily('Carlito',
    normal='Carlito', bold='Carlito-Bold',
    italic='Carlito-Italic', boldItalic='Carlito-BoldItalic')
pdfmetrics.registerFontFamily('Tinos',
    normal='Tinos', bold='Tinos-Bold',
    italic='Tinos-Italic', boldItalic='Tinos-BoldItalic')

# ─── Color Palette ─────────────────────────────────────────────────────
PRIMARY = HexColor('#1B3A5C')       # Deep navy
SECONDARY = HexColor('#2E86AB')     # Blue
ACCENT = HexColor('#F18F01')        # Orange
SUCCESS = HexColor('#2ECC71')       # Green
WARNING = HexColor('#E74C3C')       # Red
LIGHT_BG = HexColor('#EBF5FB')      # Light blue
DARK_TEXT = HexColor('#2C3E50')     # Dark text
CODE_BG = HexColor('#F4F6F7')       # Code background
TABLE_HEADER = HexColor('#1B3A5C')
TABLE_ROW1 = HexColor('#F8F9FA')
TABLE_ROW2 = HexColor('#EBF5FB')
SECTION_BG = HexColor('#E8F4FD')

# ─── Styles ────────────────────────────────────────────────────────────
styles = getSampleStyleSheet()

# Cover styles
cover_title = ParagraphStyle(
    'CoverTitle', fontName='Carlito-Bold', fontSize=28, leading=34,
    textColor=PRIMARY, alignment=TA_CENTER, spaceAfter=6*mm
)
cover_subtitle = ParagraphStyle(
    'CoverSubtitle', fontName='Carlito', fontSize=16, leading=22,
    textColor=SECONDARY, alignment=TA_CENTER, spaceAfter=4*mm
)
cover_info = ParagraphStyle(
    'CoverInfo', fontName='Tinos', fontSize=11, leading=16,
    textColor=DARK_TEXT, alignment=TA_CENTER, spaceAfter=2*mm
)

# Section header
section_header = ParagraphStyle(
    'SectionHeader', fontName='Carlito-Bold', fontSize=18, leading=24,
    textColor=PRIMARY, spaceBefore=8*mm, spaceAfter=4*mm,
    borderPadding=3*mm, borderWidth=0
)

# Sub-header
sub_header = ParagraphStyle(
    'SubHeader', fontName='Carlito-Bold', fontSize=13, leading=18,
    textColor=SECONDARY, spaceBefore=5*mm, spaceAfter=2*mm
)

# Body text
body = ParagraphStyle(
    'BodyText2', fontName='Tinos', fontSize=10, leading=15,
    textColor=DARK_TEXT, alignment=TA_JUSTIFY, spaceAfter=2*mm
)

# Bullet text
bullet_style = ParagraphStyle(
    'BulletText', fontName='Tinos', fontSize=10, leading=14,
    textColor=DARK_TEXT, leftIndent=12*mm, spaceAfter=1.5*mm,
    bulletIndent=5*mm, bulletFontName='DejaVuSans', bulletFontSize=8
)

# Code style
code_style = ParagraphStyle(
    'CodeStyle', fontName='DejaVuSans', fontSize=8.5, leading=13,
    textColor=HexColor('#1A1A2E'), backColor=CODE_BG,
    leftIndent=5*mm, rightIndent=5*mm, spaceBefore=1*mm, spaceAfter=2*mm,
    borderPadding=(2*mm, 2*mm, 2*mm, 2*mm)
)

# Table cell styles
tbl_header_style = ParagraphStyle(
    'TblHeader', fontName='Carlito-Bold', fontSize=9, leading=12,
    textColor=white, alignment=TA_CENTER
)
tbl_cell_style = ParagraphStyle(
    'TblCell', fontName='Tinos', fontSize=9, leading=13,
    textColor=DARK_TEXT, alignment=TA_LEFT
)
tbl_cell_center = ParagraphStyle(
    'TblCellCenter', fontName='Tinos', fontSize=9, leading=13,
    textColor=DARK_TEXT, alignment=TA_CENTER
)
tbl_code_style = ParagraphStyle(
    'TblCode', fontName='DejaVuSans', fontSize=7.5, leading=11,
    textColor=HexColor('#1A1A2E'), backColor=CODE_BG
)

# Tip box style
tip_style = ParagraphStyle(
    'TipStyle', fontName='Carlito-Bold', fontSize=10, leading=14,
    textColor=HexColor('#1A5276'), spaceBefore=1*mm, spaceAfter=1*mm
)
tip_body = ParagraphStyle(
    'TipBody', fontName='Tinos', fontSize=9.5, leading=14,
    textColor=HexColor('#1A5276'), leftIndent=3*mm, spaceAfter=1*mm
)

# Footer style
footer_style = ParagraphStyle(
    'Footer', fontName='Carlito', fontSize=8, leading=10,
    textColor=HexColor('#95A5A6'), alignment=TA_CENTER
)

# TOC styles
toc_title = ParagraphStyle(
    'TOCTitle', fontName='Carlito-Bold', fontSize=20, leading=26,
    textColor=PRIMARY, alignment=TA_CENTER, spaceAfter=8*mm
)
toc_section = ParagraphStyle(
    'TOCSection', fontName='Tinos', fontSize=11, leading=18,
    textColor=DARK_TEXT, leftIndent=5*mm, spaceAfter=1.5*mm
)

# ─── Helper Functions ──────────────────────────────────────────────────
def section(num, title, story):
    """Create a colored section header bar."""
    data = [[Paragraph(f'<b>SECTION {num}</b>  |  {title}', section_header)]]
    t = Table(data, colWidths=[170*mm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_BG),
        ('TOPPADDING', (0,0), (-1,-1), 3*mm),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3*mm),
        ('LEFTPADDING', (0,0), (-1,-1), 4*mm),
        ('LINEBELOW', (0,0), (-1,-1), 1.5, SECONDARY),
        ('LINEABOVE', (0,0), (-1,-1), 1.5, SECONDARY),
    ]))
    story.append(t)
    story.append(Spacer(1, 4*mm))

def subsec(title, story):
    story.append(Paragraph(f'<b>{title}</b>', sub_header))

def p(text, story):
    story.append(Paragraph(text, body))

def bullet(text, story):
    story.append(Paragraph(f'<bullet>&bull;</bullet> {text}', bullet_style))

def code(text, story):
    story.append(Paragraph(text.replace('\n', '<br/>'), code_style))

def tip_box(title, text, story):
    data = [[Paragraph(title, tip_style)], [Paragraph(text, tip_body)]]
    t = Table(data, colWidths=[160*mm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), HexColor('#D6EAF8')),
        ('TOPPADDING', (0,0), (-1,-1), 2*mm),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2*mm),
        ('LEFTPADDING', (0,0), (-1,-1), 3*mm),
        ('RIGHTPADDING', (0,0), (-1,-1), 3*mm),
        ('BOX', (0,0), (-1,-1), 1, SECONDARY),
    ]))
    story.append(Spacer(1, 2*mm))
    story.append(t)
    story.append(Spacer(1, 2*mm))

def warning_box(title, text, story):
    data = [[Paragraph(title, ParagraphStyle('WT', fontName='Carlito-Bold', fontSize=10, leading=14, textColor=HexColor('#922B21')))],
            [Paragraph(text, ParagraphStyle('WB', fontName='Tinos', fontSize=9.5, leading=14, textColor=HexColor('#922B21'), leftIndent=3*mm))]]
    t = Table(data, colWidths=[160*mm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), HexColor('#FDEDEC')),
        ('TOPPADDING', (0,0), (-1,-1), 2*mm),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2*mm),
        ('LEFTPADDING', (0,0), (-1,-1), 3*mm),
        ('RIGHTPADDING', (0,0), (-1,-1), 3*mm),
        ('BOX', (0,0), (-1,-1), 1, WARNING),
    ]))
    story.append(Spacer(1, 2*mm))
    story.append(t)
    story.append(Spacer(1, 2*mm))

def make_table(headers, rows, col_widths=None):
    """Create a styled table with headers and rows."""
    hdr = [Paragraph(h, tbl_header_style) for h in headers]
    data = [hdr]
    for row in rows:
        data.append([Paragraph(str(c), tbl_cell_style) for c in row])
    if col_widths is None:
        col_widths = [170*mm / len(headers)] * len(headers)
    t = Table(data, colWidths=col_widths, repeatRows=1)
    style_cmds = [
        ('BACKGROUND', (0,0), (-1,0), TABLE_HEADER),
        ('TEXTCOLOR', (0,0), (-1,0), white),
        ('FONTNAME', (0,0), (-1,0), 'Carlito-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 9),
        ('ALIGN', (0,0), (-1,0), 'CENTER'),
        ('TOPPADDING', (0,0), (-1,-1), 2*mm),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2*mm),
        ('LEFTPADDING', (0,0), (-1,-1), 2*mm),
        ('RIGHTPADDING', (0,0), (-1,-1), 2*mm),
        ('GRID', (0,0), (-1,-1), 0.5, HexColor('#BDC3C7')),
        ('BOX', (0,0), (-1,-1), 1, PRIMARY),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]
    for i in range(1, len(data)):
        bg = TABLE_ROW1 if i % 2 == 0 else TABLE_ROW2
        style_cmds.append(('BACKGROUND', (0,i), (-1,i), bg))
    t.setStyle(TableStyle(style_cmds))
    return t

def spacer(story, h=3):
    story.append(Spacer(1, h*mm))

def hr(story):
    story.append(HRFlowable(width="100%", thickness=0.5, color=HexColor('#BDC3C7'), spaceAfter=3*mm, spaceBefore=3*mm))


# ═══════════════════════════════════════════════════════════════════════
#  MAIN BUILD
# ═══════════════════════════════════════════════════════════════════════
OUTPUT = '/home/z/my-project/download/PowerBI_Interview_Guide_DAX_Facts.pdf'

doc = SimpleDocTemplate(
    OUTPUT,
    pagesize=A4,
    topMargin=18*mm,
    bottomMargin=18*mm,
    leftMargin=20*mm,
    rightMargin=20*mm
)

story = []

# ──────────────────────────────────────────────────────────────────────
# COVER PAGE
# ──────────────────────────────────────────────────────────────────────
story.append(Spacer(1, 30*mm))
story.append(Paragraph('POWER BI', ParagraphStyle('Big', fontName='Carlito-Bold', fontSize=42, leading=48, textColor=PRIMARY, alignment=TA_CENTER)))
story.append(Spacer(1, 3*mm))
story.append(Paragraph('Interview Guide &amp; Professional Handbook', cover_title))
story.append(Spacer(1, 5*mm))

# Decorative line
line_data = [['']]
line_t = Table(line_data, colWidths=[100*mm])
line_t.setStyle(TableStyle([
    ('LINEBELOW', (0,0), (-1,-1), 2, ACCENT),
    ('TOPPADDING', (0,0), (-1,-1), 0),
    ('BOTTOMPADDING', (0,0), (-1,-1), 0),
]))
story.append(line_t)
story.append(Spacer(1, 8*mm))

story.append(Paragraph('DAX Functions | Architecture | Data Modeling | Interview Q&amp;A', cover_subtitle))
story.append(Paragraph('Professional Workflow | Installation Tutorial | Data Sources | Best Practices', cover_subtitle))
story.append(Spacer(1, 10*mm))
story.append(Paragraph('DTank54 Group | A1 English Level', cover_info))
story.append(Paragraph('Complete Reference for Power BI Learners', cover_info))
story.append(Spacer(1, 8*mm))

# Section count box
box_data = [[Paragraph('<b>17 SECTIONS</b>', ParagraphStyle('BC', fontName='Carlito-Bold', fontSize=14, textColor=white, alignment=TA_CENTER))]]
box_t = Table(box_data, colWidths=[50*mm])
box_t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), SECONDARY),
    ('TOPPADDING', (0,0), (-1,-1), 3*mm),
    ('BOTTOMPADDING', (0,0), (-1,-1), 3*mm),
    ('ALIGN', (0,0), (-1,-1), 'CENTER'),
    ('BOX', (0,0), (-1,-1), 1, PRIMARY),
]))
story.append(box_t)
story.append(PageBreak())

# ──────────────────────────────────────────────────────────────────────
# TABLE OF CONTENTS
# ──────────────────────────────────────────────────────────────────────
story.append(Paragraph('TABLE OF CONTENTS', toc_title))
story.append(Spacer(1, 3*mm))

toc_items = [
    ('1', 'What is Power BI?', 'Understanding the platform and its ecosystem'),
    ('2', 'Power BI Architecture', 'How Power BI works behind the scenes'),
    ('3', 'DAX Basics', 'What is DAX and why it matters'),
    ('4', 'DAX Functions - 6 Categories', 'All important DAX functions grouped'),
    ('5', 'CALCULATE Deep Dive', 'The most powerful DAX function explained'),
    ('6', 'Filter Context vs Row Context', 'The two most important concepts'),
    ('7', 'Iterator Functions (X-Functions)', 'Functions that loop through rows'),
    ('8', 'Data Modeling (Star Schema)', 'How to organize your data model'),
    ('9', 'Date Table', 'Why every report needs a date table'),
    ('10', '15 Interview Q&amp;A', 'Most asked Power BI interview questions'),
    ('11', 'Quick Tips &amp; Shortcuts', 'Speed up your daily work'),
    ('12', 'DAX Patterns', 'Common formulas you will use in every project'),
    ('13', 'Quick Reference Card', 'All key facts on one page'),
    ('14', 'Professional Workflow Sequence', 'Step-by-step: how experts do projects'),
    ('15', 'Free Power BI Desktop Installation Tutorial', 'Install and start learning today'),
    ('16', 'Realistic Data Sources for Practice', 'Where to find free real data'),
    ('17', 'Best Practices &amp; Advanced Approach', 'Rules professionals follow'),
]

for num, title, desc in toc_items:
    toc_line = f'<b>Section {num}:</b>  {title}<br/><font size="8" color="#7F8C8D">{desc}</font>'
    story.append(Paragraph(toc_line, toc_section))

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════
# SECTION 1: What is Power BI?
# ═══════════════════════════════════════════════════════════════════════
section(1, 'What is Power BI?', story)

p('Power BI is a business intelligence tool made by Microsoft. It helps people see and understand their data. With Power BI, you can connect to many data sources, make beautiful reports, and share them with your team. Companies all over the world use Power BI every day to make better decisions.', story)
p('Think of Power BI as a bridge between raw data and clear answers. You have data in Excel, SQL, websites, or cloud systems. Power BI takes all this data, cleans it, connects it, and shows it in visual charts and dashboards. This means you do not need to be a programmer to use it. The goal of Power BI is simple: help anyone understand data quickly and easily.', story)

subsec('The Three Parts of Power BI', story)
p('Power BI has three main parts. Each part does something different but they all work together:', story)

story.append(make_table(
    ['Part', 'What It Does', 'Cost'],
    [
        ['Power BI Desktop', 'The main tool on your computer. You build reports here. This is where you write DAX, make charts, and connect data.', 'FREE'],
        ['Power BI Service (Cloud)', 'The online version. You upload your reports here and share them with other people through a web browser.', 'Free / Pro ($10/month)'],
        ['Power BI Mobile', 'The phone app. You can view your dashboards on your phone or tablet anytime.', 'Free'],
    ],
    [35*mm, 100*mm, 35*mm]
))

spacer(story, 3)
tip_box('Remember', 'Power BI Desktop is 100% free. You only pay for the cloud service (Pro or Premium) if you want to share reports online. But for learning, the free Desktop is everything you need.', story)

subsec('What Can You Do With Power BI?', story)
bullet('Connect to Excel files, SQL databases, web pages, APIs, and 100+ other data sources', story)
bullet('Clean and transform data with Power Query (no coding needed)', story)
bullet('Create interactive charts: bar charts, line charts, maps, tables, cards, and many more', story)
bullet('Write DAX formulas to calculate custom business metrics', story)
bullet('Build dashboards that update automatically when data changes', story)
bullet('Share reports with your team through Power BI Service or Teams', story)
bullet('Ask questions in natural language with AI-powered Q&amp;A', story)

subsec('Power BI vs Other Tools', story)

story.append(make_table(
    ['Feature', 'Power BI', 'Tableau', 'Excel'],
    [
        ['Price', 'Free Desktop + Paid Cloud', 'Expensive', 'Part of Office'],
        ['DAX / Calculations', 'Very strong (DAX)', 'Good (LOD)', 'Limited'],
        ['Data Connections', '100+ sources', '80+ sources', 'Limited'],
        ['Learning Curve', 'Easy to start', 'Medium', 'Easy to start'],
        ['Best For', 'Microsoft ecosystem', 'Visual analytics', 'Quick analysis'],
        ['Sharing', 'Easy (Cloud)', 'Server needed', 'Email / OneDrive'],
    ],
    [35*mm, 45*mm, 45*mm, 45*mm]
))

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════
# SECTION 2: Power BI Architecture
# ═══════════════════════════════════════════════════════════════════════
section(2, 'Power BI Architecture', story)

p('Understanding the architecture of Power BI is important for interviews and for real work. Power BI has many parts that work together like a system. Each part has a clear job. When you understand the architecture, you can explain to managers and clients how Power BI works from start to finish.', story)

subsec('The Big Picture', story)
p('Power BI works in layers. Think of it like a building with floors. Each floor does a different job:', story)

story.append(make_table(
    ['Layer', 'What Happens Here', 'Tools Used'],
    [
        ['1. Data Layer', 'Data lives here. It can be in databases, files, cloud, or APIs. This is where your raw data is stored.', 'SQL Server, Azure, Excel, SharePoint, Web API'],
        ['2. Data Integration', 'Data is collected, cleaned, and transformed. Power Query connects and shapes the data.', 'Power Query (M language), Dataflows'],
        ['3. Data Modeling', 'Create relationships between tables. Build the star schema. This is the engine of your report.', 'Power Pivot, DAX, Model view'],
        ['4. Visualization', 'Build charts, tables, maps, and dashboards. This is what users see and interact with.', 'Report view, Visualizations pane'],
        ['5. Sharing Layer', 'Publish reports to the cloud. Set permissions. Users view reports in browser or mobile.', 'Power BI Service, Workspaces, Apps'],
    ],
    [30*mm, 80*mm, 60*mm]
))

spacer(story, 3)
subsec('Power Query vs DAX vs Power Pivot', story)
p('Many students get confused about the difference between Power Query, DAX, and Power Pivot. These are three different tools inside Power BI, and each one has a different job. Understanding this difference is a common interview question.', story)

story.append(make_table(
    ['Tool', 'Language', 'Job', 'When to Use'],
    [
        ['Power Query', 'M language', 'Clean and transform data before it loads', 'When you need to filter rows, change column types, merge tables, or add new columns from existing data'],
        ['DAX', 'DAX language', 'Create calculations on the loaded data model', 'When you need new measures, calculated columns, or dynamic aggregations like year-to-date totals'],
        ['Power Pivot', 'DAX + Model', 'Build the data model and relationships', 'When you need to connect tables, define relationships, and organize the star schema'],
    ],
    [28*mm, 22*mm, 50*mm, 70*mm]
))

spacer(story, 3)
tip_box('Interview Tip', 'If someone asks "What is the difference between Power Query and DAX?" say: "Power Query cleans the data BEFORE it loads into the model. DAX creates calculations AFTER the data is already in the model." This answer shows deep understanding.', story)

subsec('Data Refresh', story)
p('When your source data changes, your Power BI reports need to update. This is called "refresh." There are different types of refresh in Power BI:', story)
bullet('<b>Manual Refresh:</b> You click the Refresh button in Power BI Desktop to update data right now', story)
bullet('<b>Scheduled Refresh:</b> Power BI Service automatically refreshes data at times you choose (for example, every day at 8 AM)', story)
bullet('<b>DirectQuery:</b> No refresh needed. Power BI talks to the database directly. Every time you open the report, it gets the latest data', story)
bullet('<b>Incremental Refresh:</b> Only refresh new or changed data (not all data). This is faster for very large datasets', story)

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════
# SECTION 3: DAX Basics
# ═══════════════════════════════════════════════════════════════════════
section(3, 'DAX Basics', story)

p('DAX stands for Data Analysis Expressions. It is the formula language of Power BI. You use DAX to create calculations that go beyond simple counting and summing. DAX is very powerful and learning it well will make you stand out in interviews and at work.', story)
p('DAX looks similar to Excel formulas, but it is very different behind the scenes. In Excel, each cell calculates independently. In DAX, calculations work with entire tables and columns. DAX also has concepts like filter context and row context, which do not exist in Excel. This makes DAX more powerful but also more complex.', story)

subsec('Two Types of DAX Calculations', story)

story.append(make_table(
    ['Type', 'What It Is', 'Where It Lives', 'Memory'],
    [
        ['Calculated Column', 'A new column you add to a table. Each row gets a value calculated from other columns in the same row.', 'In the table (like any other column)', 'Uses more memory (stored in the table)'],
        ['Measure', 'A dynamic calculation. It changes based on filters, slicers, and what the user selects in the report.', 'In the model (not in any table)', 'Uses less memory (calculated on demand)'],
    ],
    [30*mm, 60*mm, 40*mm, 40*mm]
))

spacer(story, 3)
code('CALCULATED COLUMN example:', story)
code('Sales Table = ADDCOLUMNS(Sales, "Profit", Sales[Amount] - Sales[Cost])', story)
code('-- Or simply in the table:', story)
code('Profit = Sales[Amount] - Sales[Cost]', story)
spacer(story, 2)

code('MEASURE example:', story)
code('Total Sales = SUM(Sales[Amount])', story)
code('Average Sales = AVERAGE(Sales[Amount])', story)
code('Count of Orders = COUNTROWS(Sales)', story)

spacer(story, 3)
tip_box('Golden Rule', 'Always try to use Measures instead of Calculated Columns. Measures use less memory and give more flexible results. Only use Calculated Columns when you need the value in a row filter or as a relationship key.', story)

subsec('Basic DAX Syntax', story)
p('Every DAX formula follows a simple pattern. Understanding the syntax is the first step to writing good DAX:', story)

code('Measure Name = FUNCTION(Table[Column])', story)
code('', story)
code('Examples:', story)
code('Total Revenue = SUM(Sales[Revenue])', story)
code('Product Count = DISTINCTCOUNT(Product[Name])', story)
code('Max Price = MAX(Product[Price])', story)
code('Orders Over 100 = COUNTROWS(FILTER(Sales, Sales[Amount] > 100))', story)

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════
# SECTION 4: DAX Functions - 6 Categories
# ═══════════════════════════════════════════════════════════════════════
section(4, 'DAX Functions - 6 Categories', story)

p('DAX has hundreds of functions. But do not worry, you do not need to memorize all of them. In real work and interviews, you will use the same 30-40 functions again and again. This section groups the most important functions into 6 categories so you can learn them in a structured way.', story)

subsec('Category 1: Aggregation Functions', story)
p('These functions calculate a single value from many values. They are the most basic and most used DAX functions:', story)

story.append(make_table(
    ['Function', 'What It Does', 'Example'],
    [
        ['SUM()', 'Adds all values in a column', 'SUM(Sales[Amount])'],
        ['AVERAGE()', 'Calculates the mean (average)', 'AVERAGE(Sales[Amount])'],
        ['MIN()', 'Finds the smallest value', 'MIN(Sales[Amount])'],
        ['MAX()', 'Finds the largest value', 'MAX(Sales[Amount])'],
        ['COUNT()', 'Counts numeric values', 'COUNT(Sales[ID])'],
        ['COUNTA()', 'Counts non-blank values', 'COUNTA(Customer[Name])'],
        ['DISTINCTCOUNT()', 'Counts unique values', 'DISTINCTCOUNT(Sales[Product])'],
        ['COUNTROWS()', 'Counts rows in a table', 'COUNTROWS(Sales)'],
    ],
    [35*mm, 65*mm, 70*mm]
))

spacer(story, 3)
subsec('Category 2: Filter Functions', story)
p('Filter functions are used to control which rows are included in a calculation. They are very important for creating dynamic reports:', story)

story.append(make_table(
    ['Function', 'What It Does', 'Example'],
    [
        ['FILTER()', 'Returns a table with filtered rows', 'FILTER(Sales, Sales[Amount] > 100)'],
        ['ALL()', 'Removes all filters from a table or column', 'ALL(Sales[Region])'],
        ['ALLEXCEPT()', 'Removes all filters except specified ones', 'ALLEXCEPT(Sales, Sales[Year])'],
        ['CALCULATE()', 'Changes the filter context for a measure', 'CALCULATE(SUM(Sales), Sales[Year]=2024)'],
        ['HASONEVALUE()', 'Checks if a column has exactly one value', 'HASONEVALUE(Product[Category])'],
        ['SELECTEDVALUE()', 'Returns the single value if only one exists', 'SELECTEDVALUE(Product[Category])'],
        ['VALUES()', 'Returns unique values of a column', 'VALUES(Customer[City])'],
        ['EARLIER()', 'Accesses an earlier row context', 'Used in calculated columns'],
    ],
    [35*mm, 70*mm, 65*mm]
))

spacer(story, 3)
subsec('Category 3: Time Intelligence Functions', story)
p('Time Intelligence functions are used to calculate values over time periods like months, quarters, and years. They are extremely important for business reports. Every report that shows trends needs these functions:', story)

story.append(make_table(
    ['Function', 'What It Does', 'Example'],
    [
        ['TOTALYTD()', 'Year-to-date total', 'TOTALYTD(SUM(Sales[Amount]), Date[Date])'],
        ['TOTALQTD()', 'Quarter-to-date total', 'TOTALQTD(SUM(Sales[Amount]), Date[Date])'],
        ['TOTALMTD()', 'Month-to-date total', 'TOTALMTD(SUM(Sales[Amount]), Date[Date])'],
        ['SAMEPERIODLASTYEAR()', 'Same period last year', 'CALCULATE(SUM(Sales), SAMEPERIODLASTYEAR(Date[Date]))'],
        ['DATEADD()', 'Shift dates by interval', 'DATEADD(Date[Date], -1, MONTH)'],
        ['PREVIOUSDAY()', 'Returns previous day', 'CALCULATE(SUM(Sales), PREVIOUSDAY(Date[Date]))'],
        ['NEXTMONTH()', 'Returns next month', 'CALCULATE(SUM(Sales), NEXTMONTH(Date[Date]))'],
        ['STARTOFMONTH()', 'First day of month', 'STARTOFMONTH(Date[Date])'],
        ['ENDOFMONTH()', 'Last day of month', 'ENDOFMONTH(Date[Date])'],
        ['DATESYTD()', 'Year to date dates', 'DATESYTD(Date[Date])'],
    ],
    [42*mm, 55*mm, 73*mm]
))

story.append(PageBreak())

subsec('Category 4: Relationship Functions', story)
p('These functions help you work with related tables. When you have a star schema with fact and dimension tables, these functions let you move between them:', story)

story.append(make_table(
    ['Function', 'What It Does', 'Example'],
    [
        ['RELATED()', 'Gets a value from a related table (many-to-one)', 'RELATED(Product[Category])'],
        ['RELATEDTABLE()', 'Gets rows from a related table (one-to-many)', 'RELATEDTABLE(Sales)'],
        ['USERELATIONSHIP()', 'Activates an inactive relationship', 'CALCULATE(MEASURE, USERELATIONSHIP(Table1[Col], Table2[Col]))'],
        ['CROSSFILTER()', 'Changes filter direction of a relationship', 'CROSSFILTER(Sales[ProductID], Product[ID], BOTH)'],
    ],
    [35*mm, 65*mm, 70*mm]
))

spacer(story, 3)
subsec('Category 5: Logical Functions', story)
p('Logical functions help you build conditions and make decisions in your formulas. They work like IF-THEN-ELSE statements:', story)

story.append(make_table(
    ['Function', 'What It Does', 'Example'],
    [
        ['IF()', 'Returns one value if condition is true, another if false', 'IF(Sales[Amount] > 100, "High", "Low")'],
        ['SWITCH()', 'Checks many conditions (like multiple IF)', 'SWITCH(Product[Category], "A", 1, "B", 2, 3)'],
        ['AND()', 'Returns TRUE if all conditions are TRUE', 'IF(AND(A > 10, B > 10), "Both High", "No")'],
        ['OR()', 'Returns TRUE if any condition is TRUE', 'IF(OR(A > 100, B > 100), "One High", "No")'],
        ['COALESCE()', 'Returns first non-blank value', 'COALESCE(Table1[Col], Table2[Col], 0)'],
        ['ISBLANK()', 'Checks if a value is blank', 'IF(ISBLANK(Sales[Discount]), 0, Sales[Discount])'],
        ['ISNUMBER()', 'Checks if a value is a number', 'IF(ISNUMBER(Value), Value, 0)'],
        ['ISERROR()', 'Checks if an expression causes an error', 'IF(ISERROR(1/0), "Error", "OK")'],
    ],
    [35*mm, 65*mm, 70*mm]
))

spacer(story, 3)
subsec('Category 6: Text and Information Functions', story)
p('These functions work with text strings and give you information about values. They are useful for data cleaning and display:', story)

story.append(make_table(
    ['Function', 'What It Does', 'Example'],
    [
        ['CONCATENATE()', 'Joins text strings together', 'CONCATENATE(FirstName, " ", LastName)'],
        ['LEFT() / RIGHT()', 'Gets characters from left or right', 'LEFT(ProductCode, 3)'],
        ['SEARCH()', 'Finds text within text (case-insensitive)', 'SEARCH("phone", Description)'],
        ['FORMAT()', 'Converts value to text with format', 'FORMAT(Date, "MMM-YYYY")'],
        ['LEN()', 'Returns the number of characters', 'LEN(Product[Name])'],
        ['UPPER() / LOWER()', 'Converts to uppercase or lowercase', 'UPPER(Customer[Name])'],
        ['TRIM()', 'Removes extra spaces from text', 'TRIM(Customer[Name])'],
        ['REPLACE()', 'Replaces part of a text string', 'REPLACE(Phone, 1, 3, "+994")'],
    ],
    [35*mm, 65*mm, 70*mm]
))

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════
# SECTION 5: CALCULATE Deep Dive
# ═══════════════════════════════════════════════════════════════════════
section(5, 'CALCULATE Deep Dive', story)

p('CALCULATE is the most important function in DAX. It is the answer to many interview questions. If you can master CALCULATE, you can solve 80% of all DAX problems. CALCULATE changes the filter context of a measure. This means it can modify what data is included in a calculation, even after the user has applied filters.', story)

subsec('Basic Syntax', story)
code('CALCULATE(Expression, Filter1, Filter2, ...)', story)
spacer(story, 2)
p('The first argument is always the expression (what you want to calculate). After that, you can add one or more filter arguments. Each filter changes which rows are included in the calculation.', story)

subsec('Simple Examples', story)
code('-- Total sales for year 2024 only:', story)
code('Sales 2024 = CALCULATE(SUM(Sales[Amount]), Sales[Year] = 2024)', story)
spacer(story, 1)
code('-- Total sales for a specific product:', story)
code('Phone Sales = CALCULATE(SUM(Sales[Amount]), Product[Name] = "Phone")', story)
spacer(story, 1)
code('-- Combine multiple filters:', story)
code('Sales 2024 Phones = CALCULATE(', story)
code('    SUM(Sales[Amount]),', story)
code('    Sales[Year] = 2024,', story)
code('    Product[Category] = "Electronics"', story)
code(')', story)

spacer(story, 3)
subsec('CALCULATE with ALL()', story)
p('One of the most powerful combinations is CALCULATE with ALL(). The ALL() function removes existing filters, and then CALCULATE applies new ones. This is how you create "ignore all filters and show me this specific thing" calculations:', story)

code('-- Total of ALL sales (ignore all filters from slicers):', story)
code('Total All Sales = CALCULATE(SUM(Sales[Amount]), ALL(Sales))', story)
spacer(story, 1)
code('-- Percentage of total:', story)
code('% of Total = DIVIDE(', story)
code('    SUM(Sales[Amount]),', story)
code('    CALCULATE(SUM(Sales[Amount]), ALL(Sales))', story)
code(')', story)

spacer(story, 3)
tip_box('Interview Must-Know', '"What does CALCULATE do?" Answer: "CALCULATE is the only function in DAX that can modify the filter context. It evaluates its expression in a modified filter context created by its filter arguments. This makes it the most versatile and important function in DAX."', story)

subsec('CALCULATETABLE', story)
p('CALCULATETABLE is like CALCULATE but it returns a table instead of a single value. You use it when you need to filter an entire table and then use that table in another function:', story)

code('-- Get a filtered table and count its rows:', story)
code('Big Orders = COUNTROWS(', story)
code('    CALCULATETABLE(Sales, Sales[Amount] > 1000)', story)
code(')', story)

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════
# SECTION 6: Filter Context vs Row Context
# ═══════════════════════════════════════════════════════════════════════
section(6, 'Filter Context vs Row Context', story)

p('Filter Context and Row Context are the two most important concepts in DAX. Understanding them is the difference between a beginner and an expert. Many students find this confusing at first, but with clear examples it becomes simple. Let us break it down.', story)

subsec('What is Filter Context?', story)
p('Filter Context is the set of filters that are applied to a calculation at any given moment. These filters come from many sources: slicers, visual-level filters, page-level filters, report-level filters, and even the CALCULATE function itself. Filter Context determines WHICH rows are included in a calculation.', story)

code('Example:', story)
code('-- If you have a slicer on Year = 2024, and a chart showing Sales by Region:', story)
code('Total Sales = SUM(Sales[Amount])', story)
code('-- The filter context here is: Year = 2024 (from slicer)', story)
code('-- Only sales from 2024 are included in the sum', story)
spacer(story, 1)
p('The key point is: Filter Context comes from the OUTSIDE. It comes from the report design, from user selections, and from CALCULATE. You do not see filter context in the DAX formula itself (unless using CALCULATE).', story)

subsec('What is Row Context?', story)
p('Row Context is different. Row Context exists when DAX is looking at one row at a time. This happens in two situations: in a Calculated Column (where DAX calculates a value for each row) and in Iterator functions like SUMX, AVERAGEX, FILTER (where DAX loops through rows one by one).', story)

code('Example:', story)
code('-- In a Calculated Column, DAX looks at ONE row at a time:', story)
code('Tax = Sales[Amount] * 0.20', story)
code('-- Row Context means: "For THIS specific row, take the Amount and multiply by 0.20"', story)
code('-- DAX does this for every row in the table, one by one', story)

spacer(story, 3)
subsec('Key Differences', story)

story.append(make_table(
    ['Aspect', 'Filter Context', 'Row Context'],
    [
        ['What it does', 'Determines WHICH rows are visible', 'Looks at ONE row at a time'],
        ['Where it comes from', 'Slicers, filters, CALCULATE', 'Calculated columns, X-functions'],
        ['How it works', 'Filters the data first, then calculates', 'Goes row by row and calculates'],
        ['Can it be nested?', 'Yes, with CALCULATE', 'No, only one row at a time'],
        ['Example function', 'CALCULATE changes filter context', 'SUMX, FILTER create row context'],
    ],
    [40*mm, 65*mm, 65*mm]
))

spacer(story, 3)
warning_box('Common Mistake', 'Many students try to use SUM(Sales[Amount]) * 0.20 inside a measure and expect it to work like a column. But measures do NOT have row context by default. If you need row-by-row calculation in a measure, use SUMX(Sales, Sales[Amount] * 0.20).', story)

subsec('How Context Transition Works', story)
p('Context transition is the bridge between Row Context and Filter Context. When you use a measure inside a row context (for example, inside SUMX), DAX automatically converts the row context into a filter context. This is called "context transition" and it is one of the most advanced topics in DAX. You do not need to understand every detail for now, but knowing that it exists will help you later.', story)

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════
# SECTION 7: Iterator Functions (X-Functions)
# ═══════════════════════════════════════════════════════════════════════
section(7, 'Iterator Functions (X-Functions)', story)

p('Iterator functions are special DAX functions that end with the letter "X" (like SUMX, AVERAGEX, COUNTX). What makes them special is that they work row by row. Regular aggregation functions like SUM() look at an entire column at once. But SUMX() goes through each row one by one, calculates something for that row, and then adds up all the results. This gives you much more flexibility.', story)

subsec('How Iterators Work', story)
p('Every iterator function has two parts: a table and an expression. First, it loops through each row of the table. For each row, it evaluates the expression. Finally, it combines all the results into one value (by summing, averaging, etc.).', story)

code('SUMX(Table, Expression)', story)
code('-- Step 1: Go to Row 1, evaluate Expression for Row 1', story)
code('-- Step 2: Go to Row 2, evaluate Expression for Row 2', story)
code('-- Step 3: ... continue for all rows ...', story)
code('-- Step 4: Add up all the results', story)

spacer(story, 3)
subsec('All Iterator Functions', story)

story.append(make_table(
    ['Function', 'What It Does', 'Example'],
    [
        ['SUMX()', 'Adds up a row-by-row calculation', 'SUMX(Sales, Sales[Price] * Sales[Qty])'],
        ['AVERAGEX()', 'Average of a row-by-row calculation', 'AVERAGEX(Sales, Sales[Revenue] - Sales[Cost])'],
        ['MINX()', 'Minimum of a row-by-row calculation', 'MINX(Sales, Sales[Amount] * 0.9)'],
        ['MAXX()', 'Maximum of a row-by-row calculation', 'MAXX(Sales, Sales[Price] * Sales[Discount])'],
        ['COUNTX()', 'Counts results of a row-by-row calculation', 'COUNTX(Sales, Sales[Product])'],
        ['CONCATENATEX()', 'Joins text from rows', 'CONCATENATEX(VALUES(Product[Name]), [Name], ", ")'],
        ['RANKX()', 'Ranks items based on an expression', 'RANKX(ALL(Customer), [Total Sales])'],
        ['GENERATE()', 'Creates a table by cross-joining', 'Used for advanced table generation'],
    ],
    [35*mm, 65*mm, 70*mm]
))

spacer(story, 3)
subsec('Real Example: Profit Calculation', story)
p('This is a classic example where you MUST use SUMX instead of SUM:', story)

code('-- This is WRONG (SUM can not multiply columns row by row):', story)
code('Total Profit Wrong = SUM(Sales[Price]) - SUM(Sales[Cost])', story)
code('-- This gives wrong result because it sums all prices, then subtracts all costs', story)
spacer(story, 1)
code('-- This is CORRECT (SUMX multiplies row by row first):', story)
code('Total Profit Correct = SUMX(Sales, Sales[Price] - Sales[Cost])', story)
code('-- Or even better:', story)
code('Total Profit = SUMX(Sales, Sales[Qty] * (Sales[Price] - Sales[UnitCost]))', story)

spacer(story, 3)
tip_box('When to Use X-Functions', 'Use SUM, AVERAGE, MIN, MAX when you only need one column. Use SUMX, AVERAGEX when your calculation involves multiple columns or conditional logic per row. If your formula has more than one column reference inside the aggregation, you probably need an X-function.', story)

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════
# SECTION 8: Data Modeling (Star Schema)
# ═══════════════════════════════════════════════════════════════════════
section(8, 'Data Modeling (Star Schema)', story)

p('Data modeling is the process of organizing your tables and relationships so that Power BI works efficiently. A good data model makes your reports fast, accurate, and easy to build. A bad data model leads to slow reports, wrong numbers, and confusing visuals. The Star Schema is the best practice for Power BI data modeling.', story)

subsec('What is a Star Schema?', story)
p('A Star Schema is a way to organize tables that looks like a star when you draw it. In the center, there is one large table called the Fact Table. Around it, there are several smaller tables called Dimension Tables. The Fact Table contains numbers (sales amounts, quantities, costs). The Dimension Tables contain descriptions (product names, dates, customer information). Lines connect each Dimension to the Fact in the center, forming a star shape.', story)

subsec('Fact Table vs Dimension Table', story)

story.append(make_table(
    ['Aspect', 'Fact Table', 'Dimension Table'],
    [
        ['Contains', 'Numbers, measurements, transactions', 'Descriptions, categories, attributes'],
        ['Rows', 'Many rows (thousands or millions)', 'Fewer rows (hundreds or thousands)'],
        ['Example', 'Sales: OrderID, Date, ProductID, Amount, Qty, Cost', 'Product: ProductID, Name, Category, Color, Brand'],
        ['Relationship', 'Many-to-one with Dimensions', 'One-to-many with Fact'],
        ['Primary Key', 'Composite key (usually)', 'Single column (ID)'],
    ],
    [30*mm, 70*mm, 70*mm]
))

spacer(story, 3)
subsec('Common Dimension Tables', story)
p('In most business reports, you will build these standard dimension tables:', story)
bullet('<b>Date Table:</b> Every date from your data range, with columns for Year, Month, Quarter, Week, Day Name. This is the most important dimension.', story)
bullet('<b>Product Table:</b> Product ID, Name, Category, Subcategory, Brand, Color, Size. One row per product.', story)
bullet('<b>Customer Table:</b> Customer ID, Name, City, Country, Segment, Industry. One row per customer.', story)
bullet('<b>Store/Location Table:</b> Store ID, Name, City, Region, Country, Manager. One row per location.', story)
bullet('<b>Employee Table:</b> Employee ID, Name, Department, Title, Hire Date. One row per employee.', story)

spacer(story, 3)
subsec('Relationship Rules', story)
p('When you connect tables in Power BI, follow these rules:', story)
bullet('Use Single direction (one-to-many) relationships. The filter goes from Dimension (one side) to Fact (many side).', story)
bullet('The Dimension table is on the "one" side (has the unique ID). The Fact table is on the "many" side (has the foreign key).', story)
bullet('Avoid bi-directional relationships unless you really need them. They can cause confusion and slow performance.', story)
bullet('Always connect through common columns (like Date, ProductID, CustomerID).', story)

tip_box('Interview Tip', '"Why is Star Schema the best practice?" Answer: "Star Schema is best because it gives clear separation between facts and dimensions, makes DAX calculations simpler, improves report performance, and is easy for other developers to understand and maintain."', story)

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════
# SECTION 9: Date Table
# ═══════════════════════════════════════════════════════════════════════
section(9, 'Date Table', story)

p('A Date Table is a special table that contains one row for every date in your data range. It has columns for Year, Month, Quarter, Week, and Day Name. Every professional Power BI report needs a Date Table because many DAX functions (especially Time Intelligence functions) require it.', story)
p('Without a Date Table, you cannot use functions like TOTALYTD, SAMEPERIODLASTYEAR, or DATEADD. You also cannot filter by month or quarter properly in your reports. Think of the Date Table as the backbone of time-based analysis in Power BI.', story)

subsec('How to Create a Date Table', story)
p('There are two ways to create a Date Table in Power BI:', story)

p('<b>Method 1: Auto Date/Time (Easy but Limited)</b>', story)
p('Power BI can create a hidden date table automatically. Go to File &gt; Options &gt; Data Load &gt; and check "Auto Date/Time." This is easy but it does not work well with multiple date columns or custom calendars.', story)

p('<b>Method 2: Create Your Own (Best Practice)</b>', story)
p('You create your own Date Table using DAX or Power Query. This gives you full control. Here is the DAX method:', story)

code('DateTable =', story)
code('ADDCOLUMNS(', story)
code('    CALENDAR(DATE(2020,1,1), DATE(2025,12,31)),', story)
code('    "Year", YEAR([Date]),', story)
code('    "Month", MONTH([Date]),', story)
code('    "MonthName", FORMAT([Date], "MMMM"),', story)
code('    "Quarter", "Q" & CEILING(MONTH([Date])/3, 1),', story)
code('    "YearQuarter", "Q" & CEILING(MONTH([Date])/3, 1) & " " & YEAR([Date]),', story)
code('    "WeekNum", WEEKNUM([Date]),', story)
code('    "DayName", FORMAT([Date], "dddd"),', story)
code('    "IsWeekend", IF(WEEKDAY([Date],2) >= 6, "Yes", "No"),', story)
code('    "YearMonth", FORMAT([Date], "YYYY-MM")', story)
code(')', story)

spacer(story, 3)
subsec('How to Mark as Date Table', story)
p('After creating the Date Table, you must tell Power BI that it is a Date Table. This is important for Time Intelligence functions:', story)
bullet('Step 1: Go to the Table view (the table icon on the left)', story)
bullet('Step 2: Click on your Date Table', story)
bullet('Step 3: On the top ribbon, click "Mark as Date Table"', story)
bullet('Step 4: Select the Date column as the date identifier', story)

spacer(story, 2)
warning_box('Important', 'Your Date Table must have continuous dates (no gaps). Every single date from start to end must exist. If you have missing dates, your Time Intelligence calculations will give wrong results. Also, the date column must be a Date/Time data type.', story)

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════
# SECTION 10: 15 Interview Q&A
# ═══════════════════════════════════════════════════════════════════════
section(10, '15 Interview Q&amp;A', story)

p('These are the most frequently asked Power BI interview questions. Study them carefully. For each question, there is a simple answer that shows you understand the topic. Practice saying these answers out loud before your interview.', story)

qna = [
    ('Q1: What is Power BI?',
     'Power BI is a business intelligence tool by Microsoft. It connects to data sources, transforms data with Power Query, builds interactive reports and dashboards, and shares them online. It has three parts: Power BI Desktop (free), Power BI Service (cloud), and Power BI Mobile (app).'),

    ('Q2: What is the difference between Power BI Desktop and Power BI Service?',
     'Power BI Desktop is the free application where you build reports on your computer. Power BI Service is the cloud platform where you publish, share, and manage reports. You build in Desktop, share in Service.'),

    ('Q3: What is DAX?',
     'DAX stands for Data Analysis Expressions. It is the formula language used in Power BI to create custom calculations. You can build measures and calculated columns with DAX. It is more powerful than Excel formulas because it works with entire tables and has concepts like filter context.'),

    ('Q4: What is the difference between a Measure and a Calculated Column?',
     'A Calculated Column adds a new column to a table and calculates a value for each row. It uses more memory. A Measure is a dynamic calculation that changes based on filters and user selections. It uses less memory because it calculates on demand. Always prefer Measures.'),

    ('Q5: What is CALCULATE and why is it important?',
     'CALCULATE is the most important DAX function. It is the only function that can modify the filter context. It takes an expression and one or more filter conditions, then calculates the expression in the modified context. Example: CALCULATE(SUM(Sales), Year=2024) gives sales only for 2024.'),

    ('Q6: What is Filter Context?',
     'Filter Context is the set of filters that determine which rows are included in a calculation. Filters come from slicers, visual filters, page filters, and CALCULATE. It answers the question: "Which data should I look at?"'),

    ('Q7: What is Row Context?',
     'Row Context exists when DAX looks at one row at a time. This happens in Calculated Columns and in iterator functions like SUMX and FILTER. Row Context answers the question: "For this specific row, what is the value?"'),

    ('Q8: What is a Star Schema?',
     'Star Schema is a data model design where one central Fact Table (with numbers) is connected to several Dimension Tables (with descriptions). It looks like a star. It is the best practice because it makes DAX simpler and reports faster.'),

    ('Q9: What is a Date Table and why do you need it?',
     'A Date Table is a table with one row per date and columns for Year, Month, Quarter, etc. You need it because Time Intelligence DAX functions (like TOTALYTD, SAMEPERIODLASTYEAR) require a proper Date Table to work correctly.'),

    ('Q10: What is the difference between SUM and SUMX?',
     'SUM adds all values in a single column. SUMX goes row by row through a table, evaluates an expression for each row, and then adds up all results. Use SUM for simple column totals. Use SUMX when you need to combine or calculate across multiple columns.'),

    ('Q11: What is Power Query?',
     'Power Query is the data transformation tool inside Power BI. It uses M language behind the scenes. You use it to clean data: remove columns, filter rows, split text, merge tables, and change data types. Power Query runs BEFORE the data loads into the model.'),

    ('Q12: What is the difference between DirectQuery and Import mode?',
     'In Import mode, Power BI copies all data into its own memory. Reports are fast but data needs to be refreshed. In DirectQuery, Power BI sends queries directly to the source database. Data is always live but reports may be slower.'),

    ('Q13: What is a relationship cardinality?',
     'Cardinality defines how tables relate: Many-to-One (one product has many sales), One-to-One (one employee has one badge), or Many-to-Many (special cases). Most relationships in Power BI are Many-to-One (Dimension to Fact).'),

    ('Q14: What are incremental refresh and its benefits?',
     'Incremental refresh means Power BI only refreshes new or changed data instead of the entire dataset. This makes refresh faster, uses less memory, and allows working with datasets that are larger than your computer can handle.'),

    ('Q15: How do you optimize a slow Power BI report?',
     'I would: (1) Remove unnecessary columns and tables, (2) Use Star Schema instead of flat tables, (3) Use Measures instead of Calculated Columns, (4) Avoid bi-directional relationships, (5) Use Aggregations for large tables, (6) Reduce visual count on each page, (7) Check Performance Analyzer to find bottlenecks.'),
]

for q, a in qna:
    story.append(Paragraph(f'<b>{q}</b>', ParagraphStyle('Q', fontName='Carlito-Bold', fontSize=10.5, leading=15, textColor=PRIMARY, spaceBefore=4*mm, spaceAfter=1.5*mm)))
    story.append(Paragraph(a, ParagraphStyle('A', fontName='Tinos', fontSize=9.5, leading=14, textColor=DARK_TEXT, leftIndent=3*mm, spaceAfter=2*mm)))

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════
# SECTION 11: Quick Tips & Shortcuts
# ═══════════════════════════════════════════════════════════════════════
section(11, 'Quick Tips &amp; Shortcuts', story)

p('These tips and shortcuts will speed up your daily work in Power BI. Professional developers use these every day. Learn them and you will work faster and look more professional.', story)

subsec('Keyboard Shortcuts', story)
story.append(make_table(
    ['Shortcut', 'What It Does'],
    [
        ['Ctrl + S', 'Save your Power BI file (.pbix)'],
        ['Ctrl + Z', 'Undo last action'],
        ['Ctrl + Y', 'Redo (undo the undo)'],
        ['Ctrl + D', 'Duplicate a visual on the report page'],
        ['Alt + Click', 'Select multiple visuals at once'],
        ['Ctrl + Click', 'Select multiple visuals (add to selection)'],
        ['Esc', 'Exit editing mode / deselect all'],
        ['Ctrl + Enter', 'Confirm formula in DAX editor'],
        ['Ctrl + Shift + Enter', 'Confirm and close the formula bar'],
    ],
    [40*mm, 130*mm]
))

spacer(story, 3)
subsec('Performance Tips', story)
bullet('<b>Hide unused columns:</b> Right-click columns you do not use in visuals and select "Hide in report view." This reduces file size.', story)
bullet('<b>Use Measures not Columns:</b> Measures calculate on demand. Columns store data. Measures save memory.', story)
bullet('<b>Avoid bi-directional filters:</b> They cause slow performance. Use single direction (Dimension to Fact) instead.', story)
bullet('<b>Remove unnecessary tables:</b> If a table is not connected to your model, delete it. It just wastes memory.', story)
bullet('<b>Use Performance Analyzer:</b> Go to View &gt; Performance Analyzer to see which visuals load slowly.', story)

spacer(story, 3)
subsec('DAX Tips', story)
bullet('<b>Use variables (VAR):</b> Variables make your DAX easier to read and sometimes faster:', story)
code('Total Profit =', story)
code('VAR Revenue = SUMX(Sales, Sales[Qty] * Sales[Price])', story)
code('VAR Cost = SUMX(Sales, Sales[Qty] * Sales[UnitCost])', story)
code('RETURN Revenue - Cost', story)
spacer(story, 1)
bullet('<b>Always use DIVIDE instead of / :</b> DIVIDE handles division by zero errors:', story)
code('-- Good (handles zero division):', story)
code('Ratio = DIVIDE([Numerator], [Denominator], 0)', story)
code('-- Bad (shows error if denominator is zero):', story)
code('Ratio = [Numerator] / [Denominator]  -- ERROR if zero!', story)

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════
# SECTION 12: DAX Patterns
# ═══════════════════════════════════════════════════════════════════════
section(12, 'DAX Patterns', story)

p('DAX Patterns are reusable formulas that solve common business problems. Every Power BI developer uses these patterns in almost every project. Learn these patterns and you can build powerful reports quickly. You do not need to memorize them exactly, but understand the logic behind each one.', story)

subsec('Pattern 1: Year-to-Date (YTD)', story)
code('Total YTD = TOTALYTD(SUM(Sales[Amount]), Date[Date])', story)
p('This calculates the running total from January 1 to the current date. It is one of the most requested calculations in business reports. Managers always want to see "How are we doing so far this year compared to last year?"', story)

subsec('Pattern 2: Same Period Last Year (SPLY)', story)
code('Sales SPLY = CALCULATE(', story)
code('    SUM(Sales[Amount]),', story)
code('    SAMEPERIODLASTYEAR(Date[Date])', story)
code(')', story)
p('This gives you the sales for the same period (same month, same quarter) in the previous year. You use it with YTD to create a comparison. For example, YTD 2024 vs YTD 2023.', story)

subsec('Pattern 3: Year-over-Year Growth', story)
code('YoY Growth = DIVIDE(', story)
code('    [Total YTD] - [Sales SPLY],', story)
code('    [Sales SPLY],', story)
code('    0', story)
code(')', story)
p('This calculates the percentage change compared to last year. A positive number means growth. A negative number means decline. This is the single most important KPI for most businesses.', story)

subsec('Pattern 4: Moving Average (7-Day, 30-Day)', story)
code('7-Day Avg Sales = AVERAGEX(', story)
code('    DATESINPERIOD(Date[Date], LASTDATE(Date[Date]), -7, DAY),', story)
code('    [Daily Sales]', story)
code(')', story)
p('Moving averages smooth out daily ups and downs to show the real trend. A 7-day moving average is good for weekly patterns. A 30-day moving average is good for monthly patterns.', story)

subsec('Pattern 5: Rank Products by Sales', story)
code('Product Rank = RANKX(', story)
code('    ALL(Product[Name]),', story)
code('    CALCULATE(SUM(Sales[Amount])),', story)
code('    DESC, SKIP', story)
code(')', story)
p('This ranks all products from best-selling to worst-selling. You can show this rank in a table visual. It answers the question "What are our top 10 products?"', story)

subsec('Pattern 6: Pareto (80/20) Analysis', story)
code('Running % = DIVIDE(', story)
code('    SUMX(', story)
code('        TOPN(', story)
code('            RANKX(ALL(Product), [Total Sales], DESC),', story)
code('            ALL(Product),', story)
code('            [Total Sales], DESC', story)
code('        ),', story)
code('        [Total Sales]', story)
code('    ),', story)
code('    CALCULATE(SUM(Sales[Amount]), ALL(Product))', story)
code(')', story)
p('Pareto analysis shows which 20% of products bring 80% of revenue. This is a classic business analysis technique.', story)

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════
# SECTION 13: Quick Reference Card
# ═══════════════════════════════════════════════════════════════════════
section(13, 'Quick Reference Card', story)

p('This page is your cheat sheet. Keep it open when you work on Power BI projects. It has all the most important facts, functions, and rules in one place.', story)

subsec('DAX Essentials', story)
story.append(make_table(
    ['Concept', 'Key Fact'],
    [
        ['DAX stands for', 'Data Analysis Expressions'],
        ['Two calculation types', 'Measures (dynamic) and Calculated Columns (row-by-row)'],
        ['Most important function', 'CALCULATE (only function that modifies filter context)'],
        ['Two contexts', 'Filter Context (which rows) and Row Context (one row at a time)'],
        ['X-Functions', 'SUMX, AVERAGEX, etc. Loop row by row, then aggregate'],
        ['Best practice', 'Always prefer Measures over Calculated Columns'],
        ['Division', 'Always use DIVIDE() instead of / to handle zero division'],
        ['Variables', 'Use VAR and RETURN to make DAX readable and fast'],
        ['Date Table', 'Required for Time Intelligence. Must have continuous dates.'],
        ['Star Schema', 'Fact Table (numbers) in center, Dimension Tables around it'],
    ],
    [45*mm, 125*mm]
))

spacer(story, 3)
subsec('Top 10 DAX Functions', story)
story.append(make_table(
    ['Function', 'Category', 'Purpose'],
    [
        ['CALCULATE', 'Filter', 'Modify filter context for a measure'],
        ['SUMX', 'Iterator', 'Row-by-row sum with expression'],
        ['FILTER', 'Filter', 'Return a table with filtered rows'],
        ['ALL', 'Filter', 'Remove all filters from a column or table'],
        ['RELATED', 'Relationship', 'Get value from a related table'],
        ['TOTALYTD', 'Time Intel', 'Year-to-date total'],
        ['SAMEPERIODLASTYEAR', 'Time Intel', 'Same dates in previous year'],
        ['DIVIDE', 'Math', 'Safe division (handles zero)'],
        ['DISTINCTCOUNT', 'Aggregation', 'Count unique values'],
        ['IF / SWITCH', 'Logical', 'Conditional logic'],
    ],
    [45*mm, 25*mm, 100*mm]
))

spacer(story, 3)
subsec('Model View Checklist', story)
bullet('Is there a Date Table? Is it marked as Date Table?', story)
bullet('Are all relationships Single direction (Dimension to Fact)?', story)
bullet('Are there any bi-directional relationships? (avoid if possible)', story)
bullet('Are there any inactive relationships? (use USERELATIONSHIP to activate)', story)
bullet('Are all Dimension tables on the "one" side?', story)
bullet('Are there any orphan tables (not connected)?', story)
bullet('Are unnecessary columns hidden?', story)

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════
# SECTION 14: Professional Workflow Sequence
# ═══════════════════════════════════════════════════════════════════════
section(14, 'Professional Workflow Sequence', story)

p('This section shows you the exact step-by-step process that professional Power BI developers follow when they work on a real project. This is not just theory. This is what happens in real companies, real projects, and real interviews. If you can explain this workflow, you will stand out as someone who understands how Power BI projects really work.', story)

p('Every professional Power BI project follows a clear sequence. If you skip steps, you will have problems later. The key is to follow the steps in order. Let us go through each step one by one.', story)

subsec('Step 1: Understand the Business Requirements', story)
p('Before you open Power BI, you must understand what the business needs. This is the most important step and many beginners skip it. Sit down with the business users (managers, directors, analysts) and ask questions. What questions do they need to answer? What decisions will they make based on this report? What data is available?', story)
bullet('<b>Ask:</b> "What is the main business question you want to answer?"', story)
bullet('<b>Ask:</b> "Who will use this report? How technically skilled are they?"', story)
bullet('<b>Ask:</b> "What data sources do we have? Where is the data stored?"', story)
bullet('<b>Ask:</b> "Do you have any sample reports or dashboards you like?"', story)
bullet('<b>Ask:</b> "What is the deadline? How often does the data need to update?"', story)
bullet('<b>Deliverable:</b> A requirements document (even a simple list of questions and answers)', story)

subsec('Step 2: Explore and Profile the Data', story)
p('Now you look at the actual data. Open Excel files, connect to the SQL database, or explore the data source. Your goal is to understand what you are working with. How many tables are there? How clean is the data? Are there missing values? What are the column types? This step often takes more time than people expect.', story)
bullet('<b>Check:</b> How many rows and columns does each table have?', story)
bullet('<b>Check:</b> Are there duplicate values in key columns?', story)
bullet('<b>Check:</b> Are there missing (null) values? How will you handle them?', story)
bullet('<b>Check:</b> Are dates in the correct format?', story)
bullet('<b>Check:</b> Are there any data quality issues (typos, wrong formats, mixed types)?', story)

subsec('Step 3: Data Transformation with Power Query', story)
p('This is where you clean the data. You use Power Query to fix problems, remove unwanted data, and shape the data into the right format for your model. This step is critical. Good data quality leads to good reports. Bad data leads to confusing and wrong reports.', story)
bullet('Remove columns you do not need (reduces file size and memory)', story)
bullet('Filter out rows that are not relevant (for example, test data, cancelled orders)', story)
bullet('Fix data types (text should be text, dates should be dates, numbers should be numbers)', story)
bullet('Handle missing values (fill with default values or remove the rows)', story)
bullet('Merge tables from different sources into one clean table', story)
bullet('Split or combine columns as needed', story)
bullet('Rename columns to clear, consistent names', story)
bullet('Remove duplicates', story)

subsec('Step 4: Build the Data Model (Star Schema)', story)
p('Now you organize the tables into a Star Schema. Create relationships between tables. Make sure the Fact table is in the center with Dimension tables around it. Set the correct cardinality (many-to-one) and filter direction (single direction, from Dimension to Fact). This is the foundation of your entire report.', story)
bullet('Create the Date Table and mark it as Date Table', story)
bullet('Connect all tables through their ID columns', story)
bullet('Make sure the filter flows from Dimension to Fact', story)
bullet('Hide unnecessary columns from report view', story)
bullet('Set the correct data categories (for example, mark a column as "City" for map visuals)', story)

story.append(PageBreak())

subsec('Step 5: Write DAX Measures', story)
p('With your data model ready, now you create the calculations. Write measures for all the key business metrics. Start with the basic ones (Total Sales, Total Cost, Profit) and then build more complex ones (YTD, Growth %, Rankings). Use VAR and RETURN to make your code readable. Test each measure in a table visual before putting it in charts.', story)
bullet('Start simple: Total Sales = SUM(Fact[SalesAmount])', story)
bullet('Then add: Total Cost, Profit, Profit Margin', story)
bullet('Add Time Intelligence: YTD, SPLY, YoY Growth', story)
bullet('Add rankings and categories', story)
bullet('Test every measure in a simple table visual first', story)

subsec('Step 6: Design the Report Pages', story)
p('Now you build the visual report. Start with the layout. Think about what the user needs to see first. Put the most important KPIs at the top. Create a logical flow from summary to detail. Use consistent colors and fonts. Make it clean and professional, not cluttered.', story)
bullet('<b>Page 1 - Dashboard:</b> High-level KPIs, key charts, summary numbers', story)
bullet('<b>Page 2 - Details:</b> Drill-down into specific areas (by product, region, time)', story)
bullet('<b>Page 3 - Analysis:</b> Trends, comparisons, rankings', story)
bullet('<b>Use bookmarks:</b> Create buttons for navigation between pages', story)
bullet('<b>Use consistent formatting:</b> Same colors, same font sizes, same layout on every page', story)
bullet('<b>Add slicers:</b> Let users filter the data (by date, region, product, etc.)', story)

subsec('Step 7: Testing and Quality Check', story)
p('Before you share the report, test everything. Check every number against the source data. Make sure all filters work correctly. Make sure the report looks good on different screen sizes. Ask a colleague to review the report and give feedback.', story)
bullet('Check: Do the total numbers match the source system?', story)
bullet('Check: Do all slicers and filters work correctly?', story)
bullet('Check: Are there any DAX errors or blank values?', story)
bullet('Check: Is the report fast enough? Use Performance Analyzer', story)
bullet('Check: Does the report look clean and professional?', story)

subsec('Step 8: Publish and Share', story)
p('The final step is to publish the report to Power BI Service and share it with the users. Set up a workspace, upload the .pbix file, configure data refresh, and set permissions. Create an app if multiple users need access. Document what the report shows and how to use it.', story)
bullet('Publish to Power BI Service (cloud)', story)
bullet('Set up scheduled refresh or DirectQuery', story)
bullet('Share with stakeholders via workspace or app', story)
bullet('Set row-level security (RLS) if needed (so users see only their own data)', story)
bullet('Write documentation on how to use the report', story)

spacer(story, 3)
tip_box('Summary', 'The professional workflow is: Requirements &gt; Data Exploration &gt; Power Query (clean) &gt; Data Model (star schema) &gt; DAX Measures &gt; Report Design &gt; Testing &gt; Publish &amp; Share. Never skip the first 3 steps. Most report problems come from bad data, not bad visuals.', story)

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════
# SECTION 15: Free Power BI Desktop Installation Tutorial
# ═══════════════════════════════════════════════════════════════════════
section(15, 'Free Power BI Desktop Installation Tutorial', story)

p('Power BI Desktop is 100% free. You do not need to pay anything to install it and start learning. This section will guide you step by step from download to your first report. Follow each step carefully and you will have Power BI running on your computer in less than 30 minutes.', story)

subsec('Step 1: Check System Requirements', story)
p('Before you install Power BI Desktop, make sure your computer meets these minimum requirements:', story)

story.append(make_table(
    ['Requirement', 'Minimum', 'Recommended'],
    [
        ['Operating System', 'Windows 10 (64-bit)', 'Windows 11 (64-bit)'],
        ['Processor (CPU)', '1 GHz or faster', '2+ GHz dual-core'],
        ['Memory (RAM)', '4 GB', '8 GB or more'],
        ['Disk Space', '2 GB free space', '10 GB free space'],
        ['Screen', '1280 x 720', '1920 x 1080 or higher'],
        ['Internet', 'Required for some features', 'High-speed recommended'],
    ],
    [35*mm, 65*mm, 70*mm]
))

spacer(story, 3)
subsec('Step 2: Download Power BI Desktop', story)
p('Follow these exact steps to download Power BI Desktop for free:', story)
bullet('<b>Step 2.1:</b> Open your web browser (Chrome, Edge, or Firefox)', story)
bullet('<b>Step 2.2:</b> Go to this website: <b>www.microsoft.com/en-us/download/details.aspx?id=58494</b>', story)
bullet('<b>Step 2.3:</b> Or simply search Google for "Download Power BI Desktop Free"', story)
bullet('<b>Step 2.4:</b> Click the big blue "Download" button', story)
bullet('<b>Step 2.5:</b> Choose "Power BI Desktop (x64)" for 64-bit systems (most computers)', story)
bullet('<b>Step 2.6:</b> The download will start automatically (file size is about 500 MB)', story)

spacer(story, 2)
tip_box('Alternative Method', 'You can also download from the Microsoft Store: Open Microsoft Store on Windows, search "Power BI Desktop," and click Install. This version updates automatically. Both methods give you the same Power BI Desktop.', story)

subsec('Step 3: Install Power BI Desktop', story)
bullet('<b>Step 3.1:</b> After the download finishes, open the downloaded file (PBIDesktopSetup.exe)', story)
bullet('<b>Step 3.2:</b> Click "Next" on the welcome screen', story)
bullet('<b>Step 3.3:</b> Read the license terms and click "I Accept"', story)
bullet('<b>Step 3.4:</b> Choose the installation folder (default is fine, just click Next)', story)
bullet('<b>Step 3.5:</b> Click "Install" and wait (this takes 3-5 minutes)', story)
bullet('<b>Step 3.6:</b> Click "Finish" when installation is complete', story)
bullet('<b>Step 3.7:</b> Power BI Desktop will open automatically. You will see the welcome screen.', story)

subsec('Step 4: Your First Report - Hands-On Tutorial', story)
p('Now let us build your very first Power BI report together. We will use a simple Excel file as data source. Follow every step.', story)

p('<b>Step 4.1: Get Sample Data</b>', story)
p('Create a simple Excel file with this data:', story)
story.append(make_table(
    ['Month', 'Sales', 'Cost'],
    [
        ['January', '12000', '8000'],
        ['February', '15000', '9000'],
        ['March', '18000', '11000'],
        ['April', '14000', '8500'],
        ['May', '20000', '12000'],
        ['June', '22000', '13000'],
    ],
    [55*mm, 55*mm, 55*mm]
))
p('Save this Excel file on your computer as "sample_sales.xlsx"', story)

p('<b>Step 4.2: Connect to Data</b>', story)
bullet('Open Power BI Desktop', story)
bullet('On the Home ribbon, click "Get Data"', story)
bullet('Click "Excel" (in the Common data sources section)', story)
bullet('Browse to your sample_sales.xlsx file and click "Open"', story)
bullet('In the Navigator window, check the box next to your sheet name', story)
bullet('Click "Load" (data will load into Power BI)', story)

p('<b>Step 4.3: Create Your First Chart</b>', story)
bullet('On the right side, you see the Data, Model, and Report views. Click Report view (the chart icon)', story)
bullet('From the Visualizations pane (right side), click the "Clustered Bar Chart" icon', story)
bullet('A blank chart appears on the canvas', story)
bullet('From the Fields pane (right side), drag "Month" to the Axis area', story)
bullet('Drag "Sales" to the Values area', story)
bullet('Your first chart is ready! You should see a bar chart with monthly sales.', story)

p('<b>Step 4.4: Add More Visuals</b>', story)
bullet('Click on empty space on the canvas', story)
bullet('Click the "Line Chart" icon from Visualizations', story)
bullet('Drag "Month" to Axis, "Sales" to Values', story)
bullet('Now you have two charts side by side', story)

story.append(PageBreak())

p('<b>Step 4.5: Write Your First DAX Measure</b>', story)
bullet('On the right side, in the Fields pane, right-click on your table name', story)
bullet('Click "New Measure"', story)
bullet('A formula bar appears at the top', story)
bullet('Type: <b>Profit = [Sales] - [Cost]</b>', story)
bullet('Press Enter', story)
bullet('Now "Profit" appears in your Fields list', story)
bullet('Add Profit to your chart (drag it to Values)', story)

p('<b>Step 4.6: Save and Explore</b>', story)
bullet('Press Ctrl + S to save your file', story)
bullet('Save it as "my_first_report.pbix"', story)
bullet('Try clicking on different bars in your chart - notice how other visuals respond', story)
bullet('This is called "cross-filtering" and it is one of the best features of Power BI', story)

spacer(story, 3)
tip_box('Congratulations!', 'You just built your first Power BI report! You connected to data, created two chart types, wrote a DAX measure, and saved your file. This is the foundation of everything in Power BI. Now keep practicing with more data and more complex reports.', story)

subsec('What to Learn Next (in Order)', story)
story.append(make_table(
    ['Priority', 'What to Learn', 'How Long'],
    [
        ['1', 'Power Query basics: connect, clean, transform data', '1-2 weeks'],
        ['2', 'Build simple reports with basic visuals', '1 week'],
        ['3', 'Data modeling: create relationships, star schema', '1-2 weeks'],
        ['4', 'DAX basics: measures, simple calculations', '2-3 weeks'],
        ['5', 'DAX advanced: CALCULATE, Time Intelligence', '2-3 weeks'],
        ['6', 'Publishing and sharing on Power BI Service', '1 week'],
        ['7', 'Advanced: M language, performance tuning, RLS', 'Ongoing'],
    ],
    [25*mm, 100*mm, 45*mm]
))

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════
# SECTION 16: Realistic Data Sources for Practice
# ═══════════════════════════════════════════════════════════════════════
section(16, 'Realistic Data Sources for Practice', story)

p('To become good at Power BI, you need to practice with real data. Do not use small fake data with 10 rows. Use large, realistic datasets that have thousands or millions of rows. This will teach you how to handle real-world data problems. Below are the best free data sources for Power BI practice, from easiest to hardest.', story)

subsec('Level 1: Beginner (Easy, Small Datasets)', story)

story.append(make_table(
    ['Source', 'What You Get', 'URL / How to Access'],
    [
        ['Microsoft Sample Datasets', 'Excel files made by Microsoft for Power BI learning. Sales, Finance, HR data.', 'In Power BI Desktop: Get Data &gt; Sample Reports &gt; Download sample datasets. Or search "Power BI sample datasets" on Microsoft docs.'],
        ['Adventure Works', 'Sample database for SQL Server. Has Sales, Products, Customers, Orders tables. Very popular.', 'Download from Microsoft: search "Adventure Works sample database." Also available as CSV files.'],
        ['World Wide Importers', 'Newer Microsoft sample database. Bigger and more realistic than Adventure Works.', 'Search "Wide World Importers sample database" on Microsoft docs.'],
        ['Kaggle Datasets', 'Thousands of free datasets from real companies and researchers. CSV files you can download.', 'www.kaggle.com/datasets - Search for: sales, financial, HR, weather, COVID, sports data.'],
    ],
    [35*mm, 65*mm, 70*mm]
))

spacer(story, 3)
subsec('Level 2: Intermediate (Medium Datasets)', story)

story.append(make_table(
    ['Source', 'What You Get', 'URL / How to Access'],
    [
        ['Data.gov', 'US government open data. Population, economy, health, education, weather. Hundreds of thousands of datasets.', 'www.data.gov - Filter by format (CSV) and topic. Download and connect directly.'],
        ['World Bank Open Data', 'Economic indicators for every country: GDP, population, education, health, trade.', 'data.worldbank.org - Download CSV or use their API directly from Power BI.'],
        ['Google Public Data', 'Google-curated public datasets. Easy to explore with Google Data Explorer.', 'www.google.com/publicdata - Browse topics, download as CSV.'],
        ['WHO Data', 'Health statistics from the World Health Organization. Disease data, vaccination rates, mortality.', 'www.who.int/data - Download datasets on global health topics.'],
        ['European Data Portal', 'Open data from European countries. Economy, transport, environment, agriculture.', 'www.europeandataportal.eu - Search and download datasets.'],
    ],
    [35*mm, 65*mm, 70*mm]
))

spacer(story, 3)
subsec('Level 3: Advanced (Large, Real-World Datasets)', story)

story.append(make_table(
    ['Source', 'What You Get', 'URL / How to Access'],
    [
        ['NYC Open Data', 'Massive dataset from New York City. Taxi rides (1 billion+ rows), 311 complaints, crime data, restaurant inspections.', 'data.cityofnewyork.us - Use DirectQuery or import. Great for performance testing.'],
        ['GitHub Public Datasets', 'Millions of code repositories, commit history, issue tracking data.', 'www.github.com - Use GitHub API connector in Power BI.'],
        ['IMDb Datasets', 'Movie ratings, cast, crew, box office. Millions of movies and TV shows.', 'www.imdb.com/interfaces - Download as TSV files.'],
        ['Financial Data (Yahoo)', 'Stock prices, company financials. Historical data for thousands of stocks.', 'Use Power BI Web connector with Yahoo Finance API. Or download from finance.yahoo.com.'],
        ['COVID-19 Data', 'Johns Hopkins University dashboard data. Cases, deaths, vaccinations by country and region.', 'github.com/CSSEGISandData/COVID-19 - Updated daily, great for time series analysis.'],
    ],
    [35*mm, 65*mm, 70*mm]
))

spacer(story, 3)
subsec('Practice Project Ideas', story)
p('Do not just download data and look at it. Build real reports with these practice projects:', story)

story.append(make_table(
    ['Project', 'Data Source', 'What You Build', 'Skills You Practice'],
    [
        ['1. Sales Dashboard', 'Adventure Works or Kaggle Sales', 'Revenue, profit, trends by product and region', 'Star Schema, DAX, Time Intelligence, Charts'],
        ['2. Stock Analysis', 'Yahoo Finance Data', 'Price trends, moving averages, company comparison', 'Line charts, DAX, Date Table, Variables'],
        ['3. HR Analytics', 'Any HR dataset', 'Employee count by dept, salary analysis, turnover rate', 'Bar charts, DAX, Calculated Columns, Slicers'],
        ['4. COVID Tracker', 'Johns Hopkins Data', 'Cases over time, country comparison, vaccination rates', 'Maps, Time Intelligence, Line charts, Slicers'],
        ['5. Weather Report', 'NOAA or Data.gov', 'Temperature trends, city comparison, seasonal patterns', 'Date functions, Comparisons, Maps, Cards'],
        ['6. Financial Report', 'Company financial data', 'Revenue, expenses, profit margins, budget vs actual', 'DAX patterns, Gauges, KPIs, Tables'],
    ],
    [30*mm, 35*mm, 55*mm, 50*mm]
))

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════
# SECTION 17: Best Practices & Advanced Approach
# ═══════════════════════════════════════════════════════════════════════
section(17, 'Best Practices &amp; Advanced Approach', story)

p('This section shows you the rules, standards, and methods that professional Power BI developers follow when they work on real projects. These are not optional tips. These are the standards that separate professionals from beginners. If you follow these rules, your reports will be faster, cleaner, more reliable, and easier to maintain. In interviews, mentioning these best practices shows that you have real-world experience.', story)

subsec('17.1 Data Modeling Best Practices', story)
p('The data model is the foundation of every Power BI report. A good model makes everything else easier. A bad model creates problems that are hard to fix later. These are the golden rules of data modeling:', story)

bullet('<b>Always use Star Schema:</b> One central Fact Table connected to Dimension Tables. Avoid snowflake schemas (dimensions connected to other dimensions) and flat single-table models. Star Schema makes DAX simple and reports fast.', story)
bullet('<b>Fact Table = Numbers Only:</b> The Fact Table should contain only keys (IDs) and numeric measures (amounts, quantities, costs). All descriptive information belongs in Dimension Tables.', story)
bullet('<b>Dimension Table = One Row Per Entity:</b> Each Dimension Table should have exactly one row for each unique entity. One row per product, one row per customer, one row per date. No duplicates.', story)
bullet('<b>Use Surrogate Keys:</b> Use integer ID columns (1, 2, 3...) as primary keys, not business keys (like product codes or email addresses). Integer keys are faster for relationships and DAX.', story)
bullet('<b>Single Direction Relationships:</b> Always set filter direction from Dimension (one) to Fact (many). Avoid bi-directional relationships unless absolutely necessary. They can cause unexpected results and slow performance.', story)
bullet('<b>Hide Foreign Key Columns:</b> In the Fact Table, the foreign key columns (ProductID, CustomerID) are only used for relationships. Hide them from report view to keep the field list clean.', story)

spacer(story, 2)
warning_box('Anti-Pattern: Single Flat Table', 'Many beginners put all data into one big flat table and try to build reports from it. This is a bad practice. It makes DAX complicated, causes filter problems, and produces slow reports. Always split your data into Facts and Dimensions.', story)

subsec('17.2 DAX Best Practices', story)
p('Writing good DAX is a skill that takes practice. These rules will help you write DAX that is correct, fast, and maintainable:', story)

bullet('<b>Use Measures, Not Calculated Columns:</b> Measures calculate on demand and use less memory. Only use Calculated Columns when you need the value in a row filter or as a relationship key. In most cases, you can replace a Calculated Column with a Measure and the report will be faster.', story)
bullet('<b>Always Use DIVIDE() Instead of / :</b> The DIVIDE function handles division by zero gracefully. Using / will show errors when the denominator is zero. DIVIDE(Measure1, Measure2, 0) returns 0 instead of an error.', story)
bullet('<b>Use Variables (VAR) for Readability:</b> Break complex DAX into steps using VAR and RETURN. This makes the code easier to read, debug, and maintain. It can also improve performance because Power BI evaluates each variable once.', story)
bullet('<b>Avoid Using FILTER on the Entire Table:</b> Instead of FILTER(Sales, Sales[Year] = 2024), use the more efficient approach of putting the filter directly in CALCULATE: CALCULATE([Measure], Sales[Year] = 2024). This avoids scanning the entire table.', story)
bullet('<b>Name Measures Clearly:</b> Use a naming convention. Common patterns: prefix with the table name or use brackets. Examples: "Total Sales", "Avg Order Value", "YTD Revenue". The name should clearly describe what the measure calculates.', story)
bullet('<b>Do Not Use IF to Replace FILTER:</b> IF works row by row. FILTER returns a filtered table. They are different tools for different purposes. Use CALCULATE for filtering, not IF.', story)
bullet('<b>Test Measures in a Simple Table First:</b> Before putting a measure in a complex chart, test it in a simple table visual with all the columns visible. This helps you see if the calculation is correct.', story)

spacer(story, 2)
code('-- BAD DAX (calculated column when measure is better):', story)
code('Profit Column = Sales[Revenue] - Sales[Cost]  -- Stored in every row!', story)
spacer(story, 1)
code('-- GOOD DAX (measure, calculated on demand):', story)
code('Total Profit = SUMX(Sales, Sales[Revenue] - Sales[Cost])  -- Fast!', story)
spacer(story, 1)
code('-- GOOD DAX with variables (clean and readable):', story)
code('Profit Margin % =', story)
code('VAR TotalRevenue = SUMX(Sales, Sales[Qty] * Sales[Price])', story)
code('VAR TotalCost = SUMX(Sales, Sales[Qty] * Sales[UnitCost])', story)
code('VAR Profit = TotalRevenue - TotalCost', story)
code('RETURN DIVIDE(Profit, TotalRevenue, 0)', story)

story.append(PageBreak())

subsec('17.3 Power Query Best Practices', story)
p('Power Query is where your data gets cleaned and shaped before it enters the data model. Clean data in Power Query means less DAX complexity later. Follow these rules:', story)

bullet('<b>Do All Cleaning in Power Query, Not DAX:</b> Power Query runs once during data load. DAX runs every time a user interacts with the report. Cleaning data in Power Query is much more efficient than fixing it with DAX.', story)
bullet('<b>Remove Unused Columns Early:</b> Every column takes memory. If you do not need a column in your report, remove it in Power Query. This is the single biggest thing you can do to reduce file size.', story)
bullet('<b>Remove Unused Rows Early:</b> Filter out rows you do not need (for example, test data, old data, cancelled records) as early as possible in Power Query. Less data means faster everything.', story)
bullet('<b>Disable Privacy Settings for Performance:</b> If Power Query is slow, go to File &gt; Options &gt; Privacy and set it to "Always Ignore." This prevents Power Query from checking privacy levels at every step.', story)
bullet('<b>Use Query Folding:</b> Query folding means Power Query pushes operations to the source database instead of doing them locally. This is much faster for large datasets. To keep query folding, use native Power Query steps (Filter, Remove Columns, Merge) instead of custom M code.', story)
bullet('<b>Replace Blanks with Values:</b> Null values can cause DAX errors. In Power Query, replace null values with 0 for numbers or with empty string for text.', story)

subsec('17.4 Report Design Best Practices', story)
p('Good report design makes the difference between a report that people actually use and one that they ignore. These design rules are based on how people read and process visual information:', story)

bullet('<b>Put the Most Important KPIs at the Top:</b> Users look at the top of the page first. Put your key numbers (total sales, profit margin, growth rate) in large card visuals at the top of the dashboard page.', story)
bullet('<b>Limit Visuals per Page:</b> Do not put 20 charts on one page. Use 5-8 visuals per page maximum. Too many visuals confuse users and slow down the report. Create multiple pages if needed.', story)
bullet('<b>Use Consistent Colors:</b> Choose a color palette (3-5 colors) and use it consistently across all pages. Blue for positive, Red for negative, Gray for neutral. Do not use random colors for each chart.', story)
bullet('<b>Add Titles and Labels:</b> Every visual should have a clear title. Every axis should have labels. Users should understand the chart without asking questions.', story)
bullet('<b>Use Slicers for Interactivity:</b> Add slicers for Date, Region, Product Category, and other key filters. Place them at the top or left of the page so users can filter data easily.', story)
bullet('<b>Create a Logical Page Flow:</b> Page 1 should be the summary dashboard. Page 2 should drill into details. Page 3 should show trends and analysis. The flow should be from overview to detail.', story)
bullet('<b>Use Bookmarks and Buttons:</b> Bookmarks save the current state of a page. Buttons let users navigate between pages. This makes your report feel like a real application.', story)
bullet('<b>Mobile-Optimized Layout:</b> If users will view reports on phones, create separate mobile-optimized layouts. Go to View &gt; Mobile Layout and design for the smaller screen.', story)

spacer(story, 2)
subsec('17.5 Performance Optimization Best Practices', story)
p('A slow report frustrates users and makes them stop using it. These rules will keep your reports fast and responsive:', story)

story.append(make_table(
    ['Rule', 'Why It Matters', 'How to Do It'],
    [
        ['Remove unused columns', 'Each column uses memory. More columns = slower report', 'Right-click column in Fields pane &gt; "Hide in report view" or remove in Power Query'],
        ['Remove unused tables', 'Unconnected tables waste memory and confuse the model', 'Delete any table not connected to your Star Schema'],
        ['Use Import mode for small data', 'Imported data is stored in memory = fast visuals', 'Choose "Import" mode for datasets under 1 GB'],
        ['Use DirectQuery for large data', 'Large datasets cannot fit in memory', 'Choose "DirectQuery" for databases with millions of rows'],
        ['Avoid bi-directional filters', 'They cause ambiguity and slow calculations', 'Set all relationships to Single direction'],
        ['Use Aggregations', 'Pre-calculated summary tables for very large data', 'Enable Aggregations in Power BI Service for Premium workspaces'],
        ['Limit visual complexity', 'Each visual sends a query to the data model', 'Use fewer visuals per page (5-8 max)'],
        ['Use Performance Analyzer', 'Shows which visuals are slow and why', 'View &gt; Performance Analyzer &gt; Start Recording'],
    ],
    [38*mm, 55*mm, 77*mm]
))

spacer(story, 3)
subsec('17.6 Naming Conventions (Advanced)', story)
p('Professional teams follow naming conventions so everyone can understand the model and code. Consistent names make collaboration easier and reduce errors:', story)

story.append(make_table(
    ['Object', 'Convention', 'Example'],
    [
        ['Tables (Fact)', 'Prefix with "Fact"', 'FactSales, FactOrders, FactTransactions'],
        ['Tables (Dimension)', 'Prefix with "Dim"', 'DimProduct, DimCustomer, DimDate, DimEmployee'],
        ['Tables (Bridge/Mapping)', 'Prefix with "Bridge"', 'BridgeProductCategory, BridgeEmployeeManager'],
        ['Measures', 'Descriptive name, no prefix', 'Total Revenue, Avg Order Value, YTD Profit'],
        ['Columns', 'PascalCase, descriptive', 'SalesAmount, OrderDate, CustomerName, UnitPrice'],
        ['DAX Variables', 'Start with lowercase', 'totalRevenue, taxRate, filteredTable'],
        ['Slicers', 'Name with "Slicer"', 'SlicerYear, SlicerRegion, SlicerProduct'],
        ['Pages', 'Numbered + descriptive', '01_Dashboard, 02_Sales_Detail, 03_Trends'],
    ],
    [38*mm, 55*mm, 77*mm]
))

story.append(PageBreak())

subsec('17.7 Error Handling and Data Quality', story)
p('Professional reports handle errors gracefully. Users should never see DAX error messages or blank charts without explanation. Follow these rules to make your reports robust:', story)

bullet('<b>Use DIVIDE with the third parameter:</b> DIVIDE([A], [B], 0) returns 0 instead of an error when B is zero. Always provide a default value.', story)
bullet('<b>Use ISBLANK to handle null values:</b> IF(ISBLANK([Measure]), 0, [Measure]) ensures you never show blank values to users.', story)
bullet('<b>Use COALESCE for multiple fallbacks:</b> COALESCE([Measure1], [Measure2], 0) tries Measure1 first, then Measure2, then returns 0.', story)
bullet('<b>Use IFERROR for critical calculations:</b> IFERROR(DIVIDE([A], [B]), 0) catches any unexpected error and returns 0.', story)
bullet('<b>Validate data in Power Query:</b> Before data enters the model, check for issues: negative prices, future dates, duplicate keys, missing required fields.', story)
bullet('<b>Add data quality checks as measures:</b> Create hidden measures that count data quality issues. Use them to show a "Data Quality Score" card on the dashboard.', story)

subsec('17.8 Documentation and Collaboration', story)
p('In professional teams, your Power BI reports will be used and maintained by other people. Good documentation saves everyone time:', story)

bullet('<b>Document your DAX measures:</b> Add comments in DAX using // for single-line comments. Explain what complex measures calculate and why.', story)
bullet('<b>Create a Data Dictionary:</b> A simple document that lists every table, column, and measure with its description and calculation logic.', story)
bullet('<b>Use Description Fields:</b> In Power BI, every table and measure has a Description field. Fill it in. This helps other developers understand your work.', story)
bullet('<b>Version Control:</b> Save different versions of your .pbix file with dates. Use naming like: Sales_Report_v1_2024-01.pbix, Sales_Report_v2_2024-02.pbix.', story)
bullet('<b>Use Power BI Source File Format:</b> Starting from Power BI Desktop update, you can save reports in the new Power BI Project format (.pbip). This is a folder-based format that works with Git for version control.', story)

spacer(story, 2)
subsec('17.9 Row-Level Security (RLS)', story)
p('Row-Level Security is an advanced feature that controls which data each user can see. For example, a regional manager should only see data from their region. This is very important for enterprise reports:', story)

bullet('<b>How RLS Works:</b> You create roles (like "Manager West", "Manager East") and define filter rules for each role. When a user opens the report, Power BI applies the role automatically based on their login.', story)
bullet('<b>How to Set Up RLS:</b> Go to Modeling &gt; Manage Roles &gt; Create Role &gt; Add a DAX filter table expression. For example: Customer[Region] = USERNAME() or check against a mapping table.', story)
bullet('<b>Dynamic RLS:</b> Create a mapping table that connects user emails to regions/departments. Use LOOKUPVALUE in the RLS filter to check which rows each user can access.', story)
bullet('<b>Testing RLS:</b> In Power BI Desktop, go to Modeling &gt; View As Roles to test what different users will see.', story)

spacer(story, 2)
tip_box('Interview Tip', 'If someone asks about best practices, mention these: Star Schema, Measures over Columns, DIVIDE instead of /, VAR for readability, Power Query for cleaning, consistent naming, Performance Analyzer, and Row-Level Security. This shows you know what professionals do.', story)

subsec('17.10 Professional Development Path', story)
p('Here is the recommended path to become a professional Power BI developer. Each level builds on the previous one:', story)

story.append(make_table(
    ['Level', 'Timeline', 'What to Learn', 'How to Prove It'],
    [
        ['Beginner', '1-2 months', 'Power BI basics, connect to Excel, create basic charts, simple DAX', 'Build 3-5 simple reports from Excel data'],
        ['Intermediate', '3-4 months', 'Star Schema, Power Query, CALCULATE, Time Intelligence, publishing', 'Build a complete dashboard from raw data to shared report'],
        ['Advanced', '5-8 months', 'Complex DAX, performance tuning, RLS, incremental refresh, M language', 'Build reports with 1M+ rows, complex DAX patterns'],
        ['Professional', '8-12 months', 'Enterprise features, deployment pipelines, XMLA endpoints, governance', 'Manage Power BI for a team, build reusable templates'],
        ['Expert', '1+ year', 'Custom visuals, R/Python integration, Azure integration, mentoring', 'Microsoft PL-300 certification, blog posts, community answers'],
    ],
    [22*mm, 22*mm, 65*mm, 61*mm]
))

spacer(story, 3)
p('The journey from beginner to professional takes time, but every step you take makes you more valuable in the job market. Power BI skills are in high demand and this demand is growing every year. Companies in every industry need people who can turn data into decisions. If you follow the workflow, best practices, and learning path described in this guide, you will be well on your way to becoming a confident and skilled Power BI professional.', story)


# ──────────────────────────────────────────────────────────────────────
# BUILD PDF
# ──────────────────────────────────────────────────────────────────────
print("Building PDF...")
doc.build(story)
print(f"PDF created: {OUTPUT}")
print(f"File size: {os.path.getsize(OUTPUT) / 1024:.1f} KB")
