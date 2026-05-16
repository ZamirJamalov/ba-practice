#!/usr/bin/env python3
"""
Financial Sample Power BI - Complete Step-by-Step Guide
From raw Excel file to professional dashboard
A1 English Level - DTank54 Group
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm, inch
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY, TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

# ─── Font Registration ────────────────────────────────────────────────
pdfmetrics.registerFont(TTFont('Carlito', '/usr/share/fonts/truetype/english/Carlito-Regular.ttf'))
pdfmetrics.registerFont(TTFont('Carlito-Bold', '/usr/share/fonts/truetype/english/Carlito-Bold.ttf'))
pdfmetrics.registerFont(TTFont('Carlito-Italic', '/usr/share/fonts/truetype/english/Carlito-Italic.ttf'))
pdfmetrics.registerFont(TTFont('Carlito-BoldItalic', '/usr/share/fonts/truetype/english/Carlito-BoldItalic.ttf'))
pdfmetrics.registerFont(TTFont('LiberationSerif', '/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf'))
pdfmetrics.registerFont(TTFont('LiberationSerif-Bold', '/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf'))
pdfmetrics.registerFont(TTFont('LiberationSerif-Italic', '/usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf'))
pdfmetrics.registerFont(TTFont('DejaVuSans', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
pdfmetrics.registerFont(TTFont('DejaVuSans-Bold', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))

# ─── Color Palette ─────────────────────────────────────────────────────
NAVY = HexColor('#1B3A5C')
BLUE = HexColor('#2E86AB')
ORANGE = HexColor('#F18F01')
GREEN = HexColor('#27AE60')
RED = HexColor('#E74C3C')
LIGHT_BLUE = HexColor('#EBF5FB')
DARK = HexColor('#2C3E50')
CODE_BG = HexColor('#F4F6F7')
HEADER_BG = HexColor('#1B3A5C')
ROW1 = HexColor('#F8F9FA')
ROW2 = HexColor('#EBF5FB')
LIGHT_GREEN = HexColor('#E8F8F5')
LIGHT_ORANGE = HexColor('#FEF5E7')
LIGHT_RED = HexColor('#FDEDEC')
LIGHT_PURPLE = HexColor('#F4ECF7')
MID_GRAY = HexColor('#7F8C8D')

# ─── Styles ────────────────────────────────────────────────────────────
styles = getSampleStyleSheet()

cover_title = ParagraphStyle('CoverTitle', fontName='Carlito-Bold', fontSize=30, leading=36, textColor=NAVY, alignment=TA_CENTER, spaceAfter=6*mm)
cover_sub = ParagraphStyle('CoverSub', fontName='Carlito', fontSize=15, leading=20, textColor=BLUE, alignment=TA_CENTER, spaceAfter=4*mm)
cover_info = ParagraphStyle('CoverInfo', fontName='LiberationSerif', fontSize=11, leading=16, textColor=DARK, alignment=TA_CENTER, spaceAfter=2*mm)

sec_style = ParagraphStyle('Sec', fontName='Carlito-Bold', fontSize=18, leading=24, textColor=NAVY, spaceBefore=6*mm, spaceAfter=3*mm)
sub_style = ParagraphStyle('Sub', fontName='Carlito-Bold', fontSize=13, leading=18, textColor=BLUE, spaceBefore=5*mm, spaceAfter=2*mm)
sub2_style = ParagraphStyle('Sub2', fontName='Carlito-Bold', fontSize=11, leading=15, textColor=HexColor('#1A5276'), spaceBefore=3*mm, spaceAfter=1.5*mm)
body_style = ParagraphStyle('Body', fontName='LiberationSerif', fontSize=10, leading=15, textColor=DARK, alignment=TA_JUSTIFY, spaceAfter=2*mm)
bullet_style = ParagraphStyle('Bullet', fontName='LiberationSerif', fontSize=10, leading=14, textColor=DARK, leftIndent=12*mm, spaceAfter=1.5*mm, bulletIndent=5*mm, bulletFontName='DejaVuSans', bulletFontSize=8)
code_style = ParagraphStyle('Code', fontName='DejaVuSans', fontSize=8.5, leading=13, textColor=HexColor('#1A1A2E'), backColor=CODE_BG, leftIndent=5*mm, rightIndent=5*mm, spaceBefore=1*mm, spaceAfter=2*mm, borderPadding=(2*mm, 2*mm, 2*mm, 2*mm))
step_title = ParagraphStyle('StepTitle', fontName='Carlito-Bold', fontSize=12, leading=16, textColor=white, alignment=TA_LEFT)
step_body = ParagraphStyle('StepBody', fontName='LiberationSerif', fontSize=10, leading=15, textColor=DARK, alignment=TA_JUSTIFY, spaceAfter=2*mm)
tbl_h = ParagraphStyle('TH', fontName='Carlito-Bold', fontSize=9, leading=12, textColor=white, alignment=TA_CENTER)
tbl_c = ParagraphStyle('TC', fontName='LiberationSerif', fontSize=9, leading=13, textColor=DARK, alignment=TA_LEFT)
tbl_cc = ParagraphStyle('TCC', fontName='LiberationSerif', fontSize=9, leading=13, textColor=DARK, alignment=TA_CENTER)
biz_style = ParagraphStyle('Biz', fontName='Carlito-Bold', fontSize=11, leading=15, textColor=GREEN, spaceBefore=3*mm, spaceAfter=1.5*mm)
biz_body = ParagraphStyle('BizB', fontName='LiberationSerif', fontSize=9.5, leading=14, textColor=DARK, leftIndent=3*mm, spaceAfter=1.5*mm, alignment=TA_JUSTIFY)
tech_style = ParagraphStyle('Tech', fontName='Carlito-Bold', fontSize=11, leading=15, textColor=BLUE, spaceBefore=3*mm, spaceAfter=1.5*mm)
tech_body = ParagraphStyle('TechB', fontName='LiberationSerif', fontSize=9.5, leading=14, textColor=DARK, leftIndent=3*mm, spaceAfter=1.5*mm, alignment=TA_JUSTIFY)
toc_s = ParagraphStyle('TOC', fontName='LiberationSerif', fontSize=11, leading=18, textColor=DARK, leftIndent=5*mm, spaceAfter=1.5*mm)

# ─── Helpers ──────────────────────────────────────────────────────────
def section_bar(num, title, story):
    data = [[Paragraph(f'<b>SECTION {num}</b>  |  {title}', sec_style)]]
    t = Table(data, colWidths=[170*mm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_BLUE),
        ('TOPPADDING', (0,0), (-1,-1), 3*mm),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3*mm),
        ('LEFTPADDING', (0,0), (-1,-1), 4*mm),
        ('LINEBELOW', (0,0), (-1,-1), 1.5, BLUE),
        ('LINEABOVE', (0,0), (-1,-1), 1.5, BLUE),
    ]))
    story.append(t)
    story.append(Spacer(1, 4*mm))

def step_box(num, title, story, color=BLUE, bg=LIGHT_BLUE):
    data = [[Paragraph(f'<b>STEP {num}:  {title}</b>', step_title)]]
    t = Table(data, colWidths=[170*mm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), color),
        ('TOPPADDING', (0,0), (-1,-1), 2.5*mm),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5*mm),
        ('LEFTPADDING', (0,0), (-1,-1), 4*mm),
    ]))
    story.append(Spacer(1, 2*mm))
    story.append(t)
    story.append(Spacer(1, 2*mm))

def sub(title, story):
    story.append(Paragraph(f'<b>{title}</b>', sub_style))

def sub2(title, story):
    story.append(Paragraph(f'<b>{title}</b>', sub2_style))

def p(text, story):
    story.append(Paragraph(text, body_style))

def b(text, story):
    story.append(Paragraph(f'<bullet>&bull;</bullet> {text}', bullet_style))

def c(text, story):
    story.append(Paragraph(text.replace('\n', '<br/>'), code_style))

def biz(text, story):
    story.append(Paragraph(f'[BUSINESS]  {text}', biz_style))

def bizp(text, story):
    story.append(Paragraph(text, biz_body))

def tech(text, story):
    story.append(Paragraph(f'[TECHNICAL]  {text}', tech_style))

def techp(text, story):
    story.append(Paragraph(text, tech_body))

def tip_box(title, text, story, bg=LIGHT_BLUE, clr=BLUE):
    data = [[Paragraph(title, ParagraphStyle('TT', fontName='Carlito-Bold', fontSize=10, leading=14, textColor=clr, spaceBefore=1*mm, spaceAfter=1*mm))],
            [Paragraph(text, ParagraphStyle('TB', fontName='LiberationSerif', fontSize=9.5, leading=14, textColor=DARK, leftIndent=3*mm, spaceAfter=1*mm, alignment=TA_JUSTIFY))]]
    t = Table(data, colWidths=[160*mm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), bg),
        ('TOPPADDING', (0,0), (-1,-1), 2*mm),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2*mm),
        ('LEFTPADDING', (0,0), (-1,-1), 3*mm),
        ('RIGHTPADDING', (0,0), (-1,-1), 3*mm),
        ('BOX', (0,0), (-1,-1), 1, clr),
    ]))
    story.append(Spacer(1, 2*mm))
    story.append(t)
    story.append(Spacer(1, 2*mm))

def warn_box(title, text, story):
    tip_box(title, text, story, LIGHT_RED, RED)

def make_table(headers, rows, widths=None):
    hdr = [Paragraph(h, tbl_h) for h in headers]
    data = [hdr]
    for row in rows:
        data.append([Paragraph(str(c), tbl_c) for c in row])
    if widths is None:
        widths = [170*mm / len(headers)] * len(headers)
    t = Table(data, colWidths=widths, repeatRows=1)
    cmds = [
        ('BACKGROUND', (0,0), (-1,0), HEADER_BG),
        ('TEXTCOLOR', (0,0), (-1,0), white),
        ('TOPPADDING', (0,0), (-1,-1), 2*mm),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2*mm),
        ('LEFTPADDING', (0,0), (-1,-1), 2*mm),
        ('RIGHTPADDING', (0,0), (-1,-1), 2*mm),
        ('GRID', (0,0), (-1,-1), 0.5, HexColor('#BDC3C7')),
        ('BOX', (0,0), (-1,-1), 1, NAVY),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]
    for i in range(1, len(data)):
        bg = ROW1 if i % 2 == 0 else ROW2
        cmds.append(('BACKGROUND', (0,i), (-1,i), bg))
    t.setStyle(TableStyle(cmds))
    return t

def sp(story, h=3):
    story.append(Spacer(1, h*mm))

def hr(story):
    story.append(HRFlowable(width="100%", thickness=0.5, color=HexColor('#BDC3C7'), spaceAfter=3*mm, spaceBefore=3*mm))


# ═══════════════════════════════════════════════════════════════════════
OUTPUT = '/home/z/my-project/download/PowerBI_Financial_Sample_StepByStep_Guide.pdf'

doc = SimpleDocTemplate(
    OUTPUT, pagesize=A4,
    topMargin=18*mm, bottomMargin=18*mm,
    leftMargin=20*mm, rightMargin=20*mm
)

story = []

# ──────────────────────────────────────────────────────────────────────
# COVER PAGE
# ──────────────────────────────────────────────────────────────────────
story.append(Spacer(1, 25*mm))
story.append(Paragraph('POWER BI', ParagraphStyle('Big', fontName='Carlito-Bold', fontSize=42, leading=48, textColor=NAVY, alignment=TA_CENTER)))
story.append(Spacer(1, 3*mm))

line_data = [['']]
line_t = Table(line_data, colWidths=[100*mm])
line_t.setStyle(TableStyle([('LINEBELOW', (0,0), (-1,-1), 2, ORANGE), ('TOPPADDING', (0,0), (-1,-1), 0), ('BOTTOMPADDING', (0,0), (-1,-1), 0)]))
story.append(line_t)
story.append(Spacer(1, 8*mm))

story.append(Paragraph('Financial Sample', cover_title))
story.append(Paragraph('Complete Step-by-Step Guide', cover_title))
story.append(Spacer(1, 5*mm))
story.append(Paragraph('From Raw Excel File to Professional Dashboard', cover_sub))
story.append(Paragraph('Technical Steps + Business Analysis', cover_sub))
story.append(Spacer(1, 12*mm))

# Two info boxes
box_data = [[
    Paragraph('<b>10 SECTIONS</b>', ParagraphStyle('BC1', fontName='Carlito-Bold', fontSize=12, textColor=white, alignment=TA_CENTER)),
    Paragraph('<b>A1 ENGLISH</b>', ParagraphStyle('BC2', fontName='Carlito-Bold', fontSize=12, textColor=white, alignment=TA_CENTER)),
]]
box_t = Table(box_data, colWidths=[50*mm, 50*mm])
box_t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (0,0), BLUE), ('BACKGROUND', (1,0), (1,0), NAVY),
    ('TOPPADDING', (0,0), (-1,-1), 3*mm), ('BOTTOMPADDING', (0,0), (-1,-1), 3*mm),
    ('ALIGN', (0,0), (-1,-1), 'CENTER'),
    ('BOX', (0,0), (-1,-1), 1, NAVY),
]))
story.append(box_t)
story.append(Spacer(1, 10*mm))
story.append(Paragraph('DTank54 Group', cover_info))
story.append(Paragraph('Hands-On Practice Guide', cover_info))
story.append(PageBreak())

# ──────────────────────────────────────────────────────────────────────
# TABLE OF CONTENTS
# ──────────────────────────────────────────────────────────────────────
story.append(Paragraph('TABLE OF CONTENTS', ParagraphStyle('TOC_T', fontName='Carlito-Bold', fontSize=20, leading=26, textColor=NAVY, alignment=TA_CENTER, spaceAfter=8*mm)))
story.append(Spacer(1, 3*mm))

toc_items = [
    ('1', 'Understanding the Financial Sample Data', 'What this file contains, columns explained, business context'),
    ('2', 'Business Questions & Goals', 'What we want to find out from this data'),
    ('3', 'Loading the Data into Power BI', 'Step-by-step: Get Data, Navigator, Load'),
    ('4', 'Data Exploration & Profiling', 'Understanding what we have: rows, columns, data types'),
    ('5', 'Power Query: Cleaning & Transforming', 'Fix data types, rename columns, prepare for model'),
    ('6', 'Building the Data Model', 'Star Schema, Date Table, relationships'),
    ('7', 'Writing DAX Measures', 'Key business metrics: Revenue, Profit, Margin, Growth'),
    ('8', 'Building the Dashboard', 'Page layout, visuals, slicers, interactivity'),
    ('9', 'Business Analysis & Insights', 'What the numbers tell us, KPIs, recommendations'),
    ('10', 'Summary & Next Steps', 'What you learned and how to continue improving'),
]
for num, title, desc in toc_items:
    line = f'<b>Section {num}:</b>  {title}<br/><font size="8" color="#{MID_GRAY.hexval()[2:]}">{desc}</font>'
    story.append(Paragraph(line, toc_s))

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════
# SECTION 1: Understanding the Data
# ═══════════════════════════════════════════════════════════════════════
section_bar(1, 'Understanding the Financial Sample Data', story)

p('The Financial Sample is a free Excel file provided by Microsoft for learning Power BI. It contains realistic sales data for a company that sells multiple products in multiple countries. This data is perfect for learning because it has the same structure and problems that you will find in real business data. In this section, we will understand exactly what this file contains before we start working with it in Power BI.', story)

sub('1.1 Where Does This Data Come From?', story)
p('Microsoft created this sample dataset to help people learn Power BI. You can download it from the Microsoft website or from inside Power BI Desktop (Go to Home &gt; Get Data &gt; Sample &gt; Financial Sample Excel file). The data simulates a real company that sells products in several countries over a period of time. It has about 700 rows of sales transactions, which is a good size for learning.', story)

sub('1.2 Column-by-Column Explanation', story)
p('Each column in the Financial Sample has a specific meaning and purpose. Understanding every column is the first step before building any report. Here is a complete explanation of every column:', story)

story.append(make_table(
    ['Column Name', 'Data Type', 'What It Means', 'Example Values'],
    [
        ['Date', 'Date', 'The date when the sale happened', '01/01/2013, 15/03/2014'],
        ['Product', 'Text', 'The product that was sold', 'Montana, Dakota, Paseo, VTT, Carretera, Velo, Amarilla'],
        ['Segment', 'Text', 'The customer segment (type of buyer)', 'Government, Midmarket, SMB, Enterprise, Channel Partners'],
        ['Country', 'Text', 'The country where the sale was made', 'USA, Canada, France, Germany, Mexico'],
        ['Units Sold', 'Number', 'How many units of the product were sold', '100, 250, 1800, 3500'],
        ['Manufacturing Price', 'Currency ($)', 'The cost to make one unit', '$3, $5, $10, $20'],
        ['Sale Price', 'Currency ($)', 'The price that the customer paid per unit', '$10, $15, $25, $50'],
        ['Gross Sales', 'Currency ($)', 'Units Sold x Sale Price (total before discount)', '$1,000, $5,000, $25,000'],
        ['Discounts', 'Currency ($)', 'The discount amount given to the customer', '$100, $500, $2,000'],
        ['Sales', 'Currency ($)', 'Gross Sales minus Discounts (actual revenue)', '$900, $4,500, $23,000'],
        ['COGS', 'Currency ($)', 'Cost of Goods Sold = Units Sold x Manufacturing Price', '$300, $1,250, $8,000'],
        ['Profit', 'Currency ($)', 'Sales minus COGS (net profit from this transaction)', '$600, $3,250, $15,000'],
    ],
    [28*mm, 20*mm, 60*mm, 62*mm]
))

sp(story, 3)
sub('1.3 Key Relationships Between Columns', story)
p('The columns are not independent. They have mathematical relationships that are very important to understand. These relationships are the basis of all calculations we will create later in DAX:', story)

b('<b>Gross Sales = Units Sold x Sale Price</b> (How much we would earn without any discount)', story)
b('<b>Sales = Gross Sales - Discounts</b> (The actual money we received from the customer)', story)
b('<b>COGS = Units Sold x Manufacturing Price</b> (How much it cost us to make these products)', story)
b('<b>Profit = Sales - COGS</b> (The real money we earned after paying all costs)', story)

sp(story, 2)
tip_box('Why This Matters', 'When you understand these relationships, you can check if your DAX calculations are correct. For example, if your Profit measure gives a different result than Sales minus COGS, you know there is a mistake in your formula. Always verify your calculations against the source data.', story)

sub('1.4 Products in the Dataset', story)
story.append(make_table(
    ['Product', 'Type', 'Description'],
    [
        ['Montana', 'Bicycle', 'A mountain bicycle for outdoor riding'],
        ['Dakota', 'Bicycle', 'A road bicycle for speed riding'],
        ['Paseo', 'Accessory', 'A helmet for bicycle safety'],
        ['VTT', 'Bicycle', 'A touring bicycle for long distance'],
        ['Carretera', 'Bicycle', 'A premium road bicycle'],
        ['Velo', 'Accessory', 'A bicycle light for night riding'],
        ['Amarilla', 'Accessory', 'A bicycle water bottle'],
    ],
    [30*mm, 30*mm, 110*mm]
))

sub('1.5 Customer Segments Explained', story)
story.append(make_table(
    ['Segment', 'What It Means', 'Typical Behavior'],
    [
        ['Government', 'Government agencies and public institutions', 'Large orders, long contracts, slow payment'],
        ['Enterprise', 'Large corporations with many employees', 'High volume, requires negotiation, long-term deals'],
        ['Midmarket', 'Medium-sized companies', 'Moderate orders, regular purchasing, good margins'],
        ['SMB', 'Small and medium businesses', 'Smaller orders, frequent purchases, price-sensitive'],
        ['Channel Partners', 'Resellers who sell our products to end users', 'Bulk purchases, lower margins, high volume'],
    ],
    [30*mm, 70*mm, 70*mm]
))

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════
# SECTION 2: Business Questions & Goals
# ═══════════════════════════════════════════════════════════════════════
section_bar(2, 'Business Questions & Goals', story)

p('Before we open Power BI, we must understand what business questions we want to answer. This is the most important step that many beginners skip. A professional does not just "make charts." A professional first asks: "What does the business need to know?" Then they design the report to answer those questions. In this section, we define the business goals for our Financial Sample dashboard.', story)

sub('2.1 Who Will Use This Report?', story)
p('Let us imagine a real scenario. We are building this dashboard for the Sales Director of a bicycle and accessories company. The Sales Director needs to make decisions about pricing, marketing, and sales strategy. They need to see the big picture and also be able to drill down into details. The dashboard should answer their daily questions quickly and clearly.', story)

sub('2.2 Key Business Questions', story)
p('Here are the questions that our dashboard must answer. Each question will become one or more visuals in our report:', story)

story.append(make_table(
    ['#', 'Business Question', 'Why This Matters', 'Visual Type'],
    [
        ['Q1', 'What is our total revenue (Sales)?', 'The most basic and important number. Is the company making money?', 'Card (big number)'],
        ['Q2', 'What is our total profit?', 'Revenue minus costs. This shows if the business is actually profitable.', 'Card'],
        ['Q3', 'What is our profit margin (%)?', 'Profit divided by Revenue. Higher margin means more efficient business.', 'Card or Gauge'],
        ['Q4', 'Which products sell the most?', 'Best-sellers need more inventory and marketing support.', 'Bar Chart'],
        ['Q5', 'Which products are most profitable?', 'High sales does not always mean high profit. Some products have better margins.', 'Bar Chart'],
        ['Q6', 'Which countries/regions perform best?', 'We need to know where to focus sales efforts and marketing budget.', 'Map or Bar Chart'],
        ['Q7', 'How do segments compare?', 'Enterprise vs SMB vs Government - which brings more money?', 'Bar Chart'],
        ['Q8', 'What are the monthly/quarterly trends?', 'Are sales growing or declining? Is there seasonality?', 'Line Chart'],
        ['Q9', 'How much discount are we giving?', 'Too much discount hurts profit. Are we discounting wisely?', 'Bar Chart or KPI'],
        ['Q10', 'Year-over-year growth?', 'How does this year compare to last year? Are we improving?', 'Line Chart + KPI'],
    ],
    [10*mm, 50*mm, 60*mm, 50*mm]
))

sp(story, 3)
sub('2.3 Dashboard Structure Plan', story)
p('Based on these questions, we will organize our dashboard into pages:', story)

story.append(make_table(
    ['Page', 'Name', 'Purpose', 'Visuals'],
    [
        ['1', 'Executive Summary', 'High-level KPIs for management', '4 KPI Cards + Revenue by Country Bar + Revenue Trend Line + Top Products Bar'],
        ['2', 'Product Analysis', 'Deep dive into product performance', 'Sales by Product + Profit Margin by Product + Units Sold Trend + Discount Analysis'],
        ['3', 'Geographic Analysis', 'Country and regional performance', 'Map + Revenue by Country + Segment mix by Country'],
        ['4', 'Time Analysis', 'Trends over time, monthly/quarterly', 'Revenue Trend Line + Profit Trend + YoY Growth + Seasonal Pattern'],
    ],
    [12*mm, 35*mm, 50*mm, 73*mm]
))

sp(story, 2)
tip_box('Remember', 'Every visual on your dashboard should answer at least one business question. If a visual does not answer a question, remove it. Clean dashboards with fewer visuals are more effective than cluttered dashboards with too many charts.', story)

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════
# SECTION 3: Loading the Data
# ═══════════════════════════════════════════════════════════════════════
section_bar(3, 'Loading the Data into Power BI', story)

p('Now we start the technical work. In this section, we will load the Financial Sample Excel file into Power BI Desktop. This is the first step in every Power BI project. Follow each step exactly as described.', story)

step_box(1, 'Open Power BI Desktop', story)
p('Open Power BI Desktop on your computer. You will see the Start screen with options to get data, open recent files, or open other reports. If you already have Power BI open, click File &gt; New to start a new blank report.', story)

step_box(2, 'Click "Get Data"', story)
p('On the Home ribbon (the toolbar at the top), find and click the "Get Data" button. It has an icon that looks like a database with an arrow. When you click it, a menu will appear with many data source options.', story)

step_box(3, 'Select "Excel" as Data Source', story)
p('In the Get Data menu, you will see categories like "Common", "Database", "Azure", "Online Services", and "Other." Under the "Common" category, click on "Excel" (it has an Excel icon). This tells Power BI that your data is in an Excel file.', story)

step_box(4, 'Browse to the Financial Sample File', story)
p('A file browser window will open. Navigate to the folder where you saved the Financial Sample Excel file. Click on the file and then click "Open." The file is usually named "Financial Sample.xlsx."', story)

step_box(5, 'The Navigator Window', story)
p('After you select the file, the Navigator window will appear. This is a very important window. It shows you what is inside the Excel file. You will see two items on the left side:', story)

story.append(make_table(
    ['Item in Navigator', 'What It Is', 'Should You Select It?'],
    [
        ['Financials', 'The main data sheet with all sales transactions (about 700 rows)', 'YES - Check this box'],
        ['Sheet1', 'An empty or helper sheet with no useful data', 'NO - Leave it unchecked'],
    ],
    [40*mm, 80*mm, 50*mm]
))

sp(story, 2)
p('<b>Action:</b> Check (tick) the box next to "Financials" only. Do NOT check "Sheet1." On the right side of the Navigator, you will see a preview of the data. Check that the preview shows columns like Date, Product, Segment, Country, Sales, Profit, etc.', story)

step_box(6, 'Click "Load"', story)
p('At the bottom of the Navigator window, there are two buttons:', story)
b('<b>Load:</b> Loads the data directly into Power BI. This is what we want now. Click "Load."', story)
b('<b>Transform Data:</b> Opens Power Query Editor where you can clean and transform the data. We will use this in the next section, but for now, just click "Load."', story)

sp(story, 2)
p('After clicking Load, Power BI will process the data. This usually takes just a few seconds. When it is done, you will see the main Power BI Desktop window with your data loaded.', story)

step_box(7, 'Verify the Data Loaded Correctly', story)
p('After loading, look at the right side of the screen. You should see:', story)
b('In the <b>Fields</b> pane: A table named "Financials" with all 12 columns listed under it', story)
b('On the <b>Data</b> view (click the table icon on the left): You can see the actual rows of data', story)
b('On the <b>Model</b> view (click the relationship icon): You will see the Financials table box', story)

sp(story, 2)
tip_box('Success Check', 'If you see the Financials table in the Fields pane with all 12 columns (Date, Product, Segment, Country, Units Sold, Manufacturing Price, Sale Price, Gross Sales, Discounts, Sales, COGS, Profit), then the data loaded successfully. You are ready for the next step!', story)

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════
# SECTION 4: Data Exploration
# ═══════════════════════════════════════════════════════════════════════
section_bar(4, 'Data Exploration &amp; Profiling', story)

p('Before we start building charts and writing DAX, we must explore and understand our data. This step is called "data profiling." In a real project, this step can take hours or even days. For our Financial Sample, it is much simpler because the data is clean and well-structured. But the principle is the same: always explore your data before building anything.', story)

sub('4.1 Check the Data View', story)
p('Click on the "Data" icon (the table icon) on the left side of Power BI Desktop. This shows you the data in a table format, similar to Excel. Here you can see every row and every column. Take some time to look through the data and notice any patterns or issues.', story)

sub('4.2 Key Data Facts', story)

story.append(make_table(
    ['Property', 'Value', 'What This Means'],
    [
        ['Total Rows', '~700 rows', 'This is a small dataset. Good for learning. Real datasets often have millions of rows.'],
        ['Total Columns', '12 columns', 'Each column represents a different piece of information about each sale.'],
        ['Date Range', '2013 to 2015', 'We have 3 years of data. This is enough for year-over-year comparisons.'],
        ['Products', '7 unique products', 'Montana, Dakota, Paseo, VTT, Carretera, Velo, Amarilla (5 bicycles + 2 accessories)'],
        ['Segments', '5 unique segments', 'Government, Midmarket, Enterprise, SMB, Channel Partners'],
        ['Countries', '5 unique countries', 'USA, Canada, France, Germany, Mexico'],
    ],
    [30*mm, 40*mm, 100*mm]
))

sp(story, 3)
sub('4.3 Check Data Types', story)
p('In the Data view, click on each column header and look at the column type shown in the ribbon at the top. The data type tells Power BI how to treat each column in calculations:', story)

story.append(make_table(
    ['Column', 'Current Type', 'Correct Type', 'If Wrong, Change To'],
    [
        ['Date', 'Date', 'Date', 'If it shows "Text", change to Date'],
        ['Product', 'Text', 'Text', 'This is correct'],
        ['Segment', 'Text', 'Text', 'This is correct'],
        ['Country', 'Text', 'Text', 'This is correct'],
        ['Units Sold', 'Whole Number', 'Whole Number', 'If decimal, change to Whole Number'],
        ['Manufacturing Price', 'Decimal Number', 'Fixed Decimal Number (2)', 'For currency with 2 decimal places'],
        ['Sale Price', 'Decimal Number', 'Fixed Decimal Number (2)', 'For currency with 2 decimal places'],
        ['Gross Sales', 'Decimal Number', 'Fixed Decimal Number (2)', 'For currency with 2 decimal places'],
        ['Discounts', 'Decimal Number', 'Fixed Decimal Number (2)', 'For currency with 2 decimal places'],
        ['Sales', 'Decimal Number', 'Fixed Decimal Number (2)', 'For currency with 2 decimal places'],
        ['COGS', 'Decimal Number', 'Fixed Decimal Number (2)', 'For currency with 2 decimal places'],
        ['Profit', 'Decimal Number', 'Fixed Decimal Number (2)', 'For currency with 2 decimal places'],
    ],
    [30*mm, 30*mm, 45*mm, 65*mm]
))

sp(story, 2)
tip_box('Professional Tip', 'In real projects, checking data types is very important. If a date column is stored as Text, Power BI will not recognize it as a date and you cannot use Time Intelligence functions. Always verify data types after loading data.', story)

sub('4.4 Check for Data Quality Issues', story)
p('While exploring the data, look for common problems:', story)
b('<b>Missing Values:</b> Are there any blank cells? In our Financial Sample, there should not be any blanks, but always check.', story)
b('<b>Duplicates:</b> Are there duplicate rows? In real data, this happens often because of data entry errors.', story)
b('<b>Negative Values:</b> Are there any negative sales or profit values? This could indicate returns or data errors.', story)
b('<b>Date Format:</b> Are all dates in a consistent format? (MM/DD/YYYY or DD/MM/YYYY)', story)
b('<b>Text Consistency:</b> Are product names and country names spelled consistently? ("USA" vs "U.S.A." vs "United States")', story)

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════
# SECTION 5: Power Query Cleaning
# ═══════════════════════════════════════════════════════════════════════
section_bar(5, 'Power Query: Cleaning &amp; Transforming', story)

p('Power Query is the data cleaning engine inside Power BI. In this section, we will use Power Query to prepare our data for the data model. Even though the Financial Sample is already quite clean, we will still apply some professional transformations. This is good practice because in real projects, data is almost never clean when you first load it.', story)

step_box(1, 'Open Power Query Editor', story)
p('There are two ways to open Power Query Editor:', story)
b('<b>Method 1:</b> Go to Home &gt; click "Transform Data" button on the ribbon', story)
b('<b>Method 2:</b> If the data is already loaded, go to Home &gt; "Transform Data"', story)
p('The Power Query Editor will open in a new window. You will see your Financials table with all rows and columns.', story)

step_box(2, 'Rename the Query', story)
p('On the left side of Power Query, in the Queries pane, you will see "Financials." This is the name of your data query. In professional projects, it is good practice to give clear names. Let us rename it:', story)
b('Right-click on "Financials" in the Queries pane', story)
b('Select "Rename"', story)
b('Type: <b>FactFinancials</b> (this name follows the naming convention for fact tables)', story)
p('Using "Fact" prefix makes it clear that this is a Fact table (a table with numbers and transactions).', story)

step_box(3, 'Fix Data Types', story)
p('Click on each column header and check the data type shown in the ribbon. Change if needed:', story)
b('Click on the <b>Date</b> column &gt; In the ribbon, set type to "Date"', story)
b('Click on each <b>currency column</b> (Manufacturing Price, Sale Price, Gross Sales, Discounts, Sales, COGS, Profit) &gt; Set type to "Fixed Decimal Number" or "Currency"', story)
b('Click on <b>Units Sold</b> &gt; Set type to "Whole Number"', story)

step_box(4, 'Verify Column Names', story)
p('Check that all column names are clear and consistent. In the Financial Sample, the column names are already good. They are single words without spaces and they describe what each column contains. No changes needed here, but in real projects you often need to rename columns to remove special characters or spaces.', story)

step_box(5, 'Check for and Remove Duplicates', story)
p('To check for duplicate rows:', story)
b('Go to Home ribbon', story)
b('Click "Remove Rows" &gt; "Remove Duplicates"', story)
p('Power Query will tell you how many duplicate rows were removed. In our sample data, there should be zero duplicates. If Power Query removes rows, be careful and check why.', story)

step_box(6, 'Close and Apply', story)
p('When you are done with all transformations in Power Query:', story)
b('Click the "Close &amp; Apply" button in the top-left corner of the Power Query Editor', story)
b('Power Query will save all your changes and load the cleaned data into Power BI', story)
b('This may take a few seconds. Wait for the "Applying changes" message to finish.', story)

sp(story, 2)
tip_box('Power Query vs DAX Rule', 'Remember: Power Query cleans data BEFORE it loads. DAX calculates AFTER data is loaded. Do as much cleaning as possible in Power Query. This makes your DAX simpler and your report faster. Only use DAX for calculations that need to be dynamic (change with filters and slicers).', story)

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════
# SECTION 6: Building the Data Model
# ═══════════════════════════════════════════════════════════════════════
section_bar(6, 'Building the Data Model', story)

p('The data model is the foundation of your entire report. A good data model makes your DAX simple, your reports fast, and your visuals accurate. In this section, we will transform our single flat table into a proper Star Schema with a Date Table. This is what professionals do in real projects.', story)

sub('6.1 Understanding the Current Situation', story)
p('Right now, we have one flat table called FactFinancials with all 12 columns. This is called a "flat table" or "single table model." It works for very simple reports, but it has limitations. We cannot easily build a proper Date Table, and some DAX functions work better with a Star Schema.', story)

sub('6.2 Creating Dimension Tables from FactFinancials', story)
p('We will create separate dimension tables from the unique values in our fact table. Here is how to do it step by step:', story)

step_box('6a', 'Create the Product Dimension Table', story)
p('In Power BI Desktop, go to Modeling &gt; New Table. Enter this DAX formula:', story)
c('DimProduct =\nDISTINCT(FactFinancials[Product])', story)
p('This creates a new table with all unique product names. Each product appears exactly once. Now we have a proper Product dimension table.', story)

step_box('6b', 'Create the Segment Dimension Table', story)
c('DimSegment =\nDISTINCT(FactFinancials[Segment])', story)
p('This creates a table with all 5 customer segments: Government, Enterprise, Midmarket, SMB, Channel Partners.', story)

step_box('6c', 'Create the Country Dimension Table', story)
c('DimCountry =\nDISTINCT(FactFinancials[Country])', story)
p('This creates a table with all 5 countries: USA, Canada, France, Germany, Mexico.', story)

step_box('6d', 'Create the Date Dimension Table', story)
c('DimDate =\nADDCOLUMNS(\n    CALENDAR(\n        MIN(FactFinancials[Date]),\n        MAX(FactFinancials[Date])\n    ),\n    "Year", YEAR([Date]),\n    "Month", MONTH([Date]),\n    "MonthName", FORMAT([Date], "MMMM"),\n    "Quarter", "Q" & CEILING(MONTH([Date])/3, 1),\n    "YearQuarter", "Q" & CEILING(MONTH([Date])/3, 1) & " " & YEAR([Date]),\n    "WeekNum", WEEKNUM([Date]),\n    "DayName", FORMAT([Date], "dddd"),\n    "YearMonth", FORMAT([Date], "YYYY-MM")\n)', story)
p('This creates a Date Table with one row for every date in our data range. It includes Year, Month, Quarter, and other time columns. This is essential for Time Intelligence DAX functions.', story)

sp(story, 2)
step_box('6e', 'Mark the Date Table', story)
p('After creating DimDate, you must tell Power BI that it is a Date Table:', story)
b('Click on the DimDate table in the Fields pane', story)
b('Go to the Table Tools ribbon at the top', story)
b('Click "Mark as Date Table"', story)
b('Select the "Date" column as the date identifier', story)

sub('6.3 Creating Relationships', story)
p('Now we connect all the tables. Go to the Model view (the relationship icon on the left). You will see 5 table boxes. Create relationships by dragging:', story)

story.append(make_table(
    ['From Table', 'From Column', 'To Table', 'To Column', 'Cardinality'],
    [
        ['DimProduct', 'Product', 'FactFinancials', 'Product', 'One-to-Many (1:*)'],
        ['DimSegment', 'Segment', 'FactFinancials', 'Segment', 'One-to-Many (1:*)'],
        ['DimCountry', 'Country', 'FactFinancials', 'Country', 'One-to-Many (1:*)'],
        ['DimDate', 'Date', 'FactFinancials', 'Date', 'One-to-Many (1:*)'],
    ],
    [28*mm, 25*mm, 38*mm, 25*mm, 54*mm]
))

sp(story, 2)
p('After creating these relationships, your model should look like a star: FactFinancials in the center with DimProduct, DimSegment, DimCountry, and DimDate connected to it from the outside. This is the Star Schema.', story)

sp(story, 2)
tip_box('Verify Relationships', 'In the Model view, you should see 4 lines connecting the tables. Each line should have a "1" on the Dimension side and a "*" on the Fact side. The filter direction arrow should point FROM the Dimension TO the Fact. If you see this, your model is correct!', story)

sub('6.4 Hide Unnecessary Columns', story)
p('In the fact table, the columns Product, Segment, Country, and Date are now just foreign keys (they connect to dimension tables). We do not need them in the report because the dimension tables provide these columns. To keep the Fields pane clean:', story)
b('In the Fields pane, right-click on FactFinancials &gt; Product &gt; select "Hide in report view"', story)
b('Do the same for: FactFinancials &gt; Segment, FactFinancials &gt; Country, FactFinancials &gt; Date', story)
p('Now the Fields pane is cleaner. Users will only see the Product, Segment, Country, and Date columns from the Dimension tables, not from the Fact table.', story)

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════
# SECTION 7: DAX Measures
# ═══════════════════════════════════════════════════════════════════════
section_bar(7, 'Writing DAX Measures', story)

p('Now the exciting part: writing DAX measures! These are the calculations that will power our dashboard. Each measure answers a specific business question. We will write them one by one, starting from simple to advanced. Open your Power BI Desktop file and follow along.', story)

sub('7.1 How to Create a Measure', story)
p('To create a new measure in Power BI Desktop:', story)
b('In the Fields pane, <b>right-click</b> on the FactFinancials table', story)
b('Select <b>"New Measure"</b>', story)
b('A formula bar will appear at the top of the screen', story)
b('Type the DAX formula and press Enter', story)

sp(story, 2)
sub('7.2 Basic Revenue Measures', story)

step_box('M1', 'Total Revenue (Total Sales)', story, GREEN, LIGHT_GREEN)
c('Total Revenue = SUM(FactFinancials[Sales])', story)
biz('What This Means for Business:', story)
bizp('This measure shows the total amount of money the company earned from all sales after discounts. This is the most important number in any sales report. The Sales Director will look at this number first every morning. It answers the question: "How much money did we make?"', story)

step_box('M2', 'Total Gross Sales (Before Discounts)', story, GREEN, LIGHT_GREEN)
c('Total Gross Sales = SUM(FactFinancials[Gross Sales])', story)
biz('What This Means for Business:', story)
bizp('This shows the total sales amount BEFORE any discounts. By comparing Total Gross Sales with Total Revenue, the company can see how much money was lost to discounts. If discounts are very high compared to gross sales, the company may need to reconsider its discount policy.', story)

step_box('M3', 'Total Discounts Given', story, GREEN, LIGHT_GREEN)
c('Total Discounts = SUM(FactFinancials[Discounts])', story)
biz('What This Means for Business:', story)
bizp('This shows the total amount of discounts given to customers. High discounts can eat into profits. The Sales Director needs to monitor this number to make sure the sales team is not giving too many discounts to close deals.', story)

sp(story, 2)
sub('7.3 Profit Measures', story)

step_box('M4', 'Total COGS (Cost of Goods Sold)', story, GREEN, LIGHT_GREEN)
c('Total COGS = SUM(FactFinancials[COGS])', story)
biz('What This Means for Business:', story)
bizp('COGS represents the total cost to produce or buy the products that were sold. This includes manufacturing costs, raw materials, and direct labor. Lower COGS means higher profit margins. The company should always try to reduce COGS through better manufacturing processes or supplier negotiations.', story)

step_box('M5', 'Total Profit', story, GREEN, LIGHT_GREEN)
c('Total Profit = SUM(FactFinancials[Profit])', story)
biz('What This Means for Business:', story)
bizp('Profit is what remains after subtracting all costs from revenue. This is the bottom line. Positive profit means the company is making money. Negative profit means the company is losing money. Every business decision should ultimately aim to increase profit.', story)

step_box('M6', 'Profit Margin (%)', story, GREEN, LIGHT_GREEN)
c('Profit Margin % =\nVAR Revenue = [Total Revenue]\nVAR Cost = [Total COGS]\nVAR Margin = DIVIDE(Revenue - Cost, Revenue, 0)\nRETURN Margin', story)
biz('What This Means for Business:', story)
bizp('Profit Margin tells you what percentage of revenue is actual profit. For example, if Profit Margin is 30%, it means for every $100 of sales, the company keeps $30 as profit. A higher margin means a more efficient business. Different industries have different typical margins. The company should track margin over time to see if it is improving.', story)

story.append(PageBreak())

step_box('M7', 'Discount Rate (%)', story, GREEN, LIGHT_GREEN)
c('Discount Rate % =\nVAR Gross = [Total Gross Sales]\nVAR Discount = [Total Discounts]\nRETURN DIVIDE(Discount, Gross, 0)', story)
biz('What This Means for Business:', story)
bizp('The Discount Rate shows what percentage of gross sales is given away as discounts. For example, if the rate is 15%, it means the company gives away $15 in discounts for every $100 of potential revenue. A high discount rate may indicate that the sales team is relying too heavily on discounts to close deals instead of selling on value.', story)

sp(story, 2)
sub('7.4 Advanced Measures with CALCULATE', story)

step_box('M8', 'Revenue by Product (Top N Analysis)', story, ORANGE, LIGHT_ORANGE)
c('Revenue Product Rank =\nRANKX(\n    ALL(DimProduct[Product]),\n    [Total Revenue],\n    DESC\n)', story)
biz('What This Means for Business:', story)
bizp('This measure ranks all products from highest revenue to lowest. The Sales Director can quickly see which products are the top performers and which ones need more attention. Products at the bottom of the ranking may need better marketing or may need to be discontinued.', story)

step_box('M9', 'Total Units Sold', story, ORANGE, LIGHT_ORANGE)
c('Total Units Sold = SUM(FactFinancials[Units Sold])', story)
biz('What This Means for Business:', story)
bizp('This shows the total number of product units sold. Revenue alone does not tell the full story. A product with low revenue but high units sold may be a low-priced item that drives customer traffic. Understanding units sold helps with inventory planning and production scheduling.', story)

step_box('M10', 'Average Sale Price per Unit', story, ORANGE, LIGHT_ORANGE)
c('Avg Price Per Unit =\nDIVIDE([Total Revenue], [Total Units Sold], 0)', story)
biz('What This Means for Business:', story)
bizp('This shows the average price that customers pay per unit. This is useful for pricing analysis. If the average price is dropping over time, it may mean that more discounts are being given or that cheaper products are becoming more popular. The company should monitor this to maintain profitable pricing.', story)

sp(story, 2)
sub('7.5 Time Intelligence Measures', story)
p('These measures require the Date Table (DimDate) that we created in Section 6. They allow us to analyze trends over time:', story)

step_box('M11', 'Revenue Year-to-Date (YTD)', story, HexColor('#8E44AD'), LIGHT_PURPLE)
c('Revenue YTD =\nTOTALYTD([Total Revenue], DimDate[Date])', story)
biz('What This Means for Business:', story)
bizp('Year-to-Date revenue shows the cumulative revenue from January 1 to the current selected date. For example, if we are looking at data for May 2014, YTD Revenue shows total sales from January 2014 through May 2014. This is the most commonly requested time-based metric in business reports.', story)

step_box('M12', 'Revenue Same Period Last Year', story, HexColor('#8E44AD'), LIGHT_PURPLE)
c('Revenue SPLY =\nCALCULATE(\n    [Total Revenue],\n    SAMEPERIODLASTYEAR(DimDate[Date])\n)', story)
biz('What This Means for Business:', story)
bizp('SPLY shows the revenue for the exact same time period in the previous year. For example, if we are looking at Q2 2014, SPLY shows Q2 2013 revenue. This is essential for year-over-year comparisons. The Sales Director uses this to answer: "Are we doing better or worse than last year?"', story)

step_box('M13', 'Revenue Year-over-Year Growth (%)', story, HexColor('#8E44AD'), LIGHT_PURPLE)
c('Revenue YoY Growth % =\nVAR CurrentYTD = [Revenue YTD]\nVAR LastYTD = [Revenue SPLY]\nRETURN DIVIDE(CurrentYTD - LastYTD, LastYTD, 0)', story)
biz('What This Means for Business:', story)
bizp('YoY Growth is the single most important performance indicator. A positive number (like 15%) means revenue grew by 15% compared to the same period last year. A negative number (like -5%) means revenue declined. The company board and investors pay close attention to this number. Consistent positive YoY growth shows a healthy, growing business.', story)

story.append(PageBreak())

sub('7.6 All Measures Summary', story)

story.append(make_table(
    ['Measure Name', 'DAX Pattern', 'Business Purpose'],
    [
        ['Total Revenue', 'SUM(Sales)', 'Total money earned after discounts'],
        ['Total Gross Sales', 'SUM(Gross Sales)', 'Total potential revenue before discounts'],
        ['Total Discounts', 'SUM(Discounts)', 'Total money given away as discounts'],
        ['Total COGS', 'SUM(COGS)', 'Total cost of products sold'],
        ['Total Profit', 'SUM(Profit)', 'Bottom line: revenue minus costs'],
        ['Profit Margin %', 'DIVIDE(Revenue - COGS, Revenue)', 'Efficiency: what % of revenue is profit'],
        ['Discount Rate %', 'DIVIDE(Discounts, Gross Sales)', 'How much discount we are giving'],
        ['Total Units Sold', 'SUM(Units Sold)', 'Total number of items sold'],
        ['Avg Price Per Unit', 'Revenue / Units Sold', 'Average selling price'],
        ['Revenue YTD', 'TOTALYTD(Revenue)', 'Cumulative revenue this year'],
        ['Revenue SPLY', 'CALCULATE + SAMEPERIODLASTYEAR', 'Same period revenue last year'],
        ['YoY Growth %', '(YTD - SPLY) / SPLY', 'Growth compared to last year'],
        ['Product Rank', 'RANKX(ALL Product)', 'Best-selling to worst-selling product'],
    ],
    [30*mm, 50*mm, 90*mm]
))

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════
# SECTION 8: Building the Dashboard
# ═══════════════════════════════════════════════════════════════════════
section_bar(8, 'Building the Dashboard', story)

p('Now we bring everything together and build the visual dashboard. This is where all the data model work and DAX measures pay off. In this section, we will create 4 report pages with specific visuals on each page. Follow each step carefully to build the complete dashboard.', story)

sub('8.1 Dashboard Design Principles', story)
p('Before we start, here are the design rules we will follow:', story)
b('<b>Clean Layout:</b> Each page has 5-8 visuals maximum. No clutter.', story)
b('<b>Consistent Colors:</b> Use the same color theme on all pages. Blue for positive, Red for negative.', story)
b('<b>Clear Titles:</b> Every visual has a title that explains what it shows.', story)
b('<b>Slicers on Top or Left:</b> Place filters where users can find them easily.', story)
b('<b>Big Numbers First:</b> KPI cards at the top so users see key metrics immediately.', story)

step_box('D1', 'Create Page 1: Executive Summary', story, NAVY, LIGHT_BLUE)

sub2('Visual 1: Total Revenue KPI Card', story)
p('From the Visualizations pane (right side), click the "Card" icon (it looks like a number card). A card visual appears on the canvas. Then:', story)
b('From the Fields pane, drag <b>Total Revenue</b> measure into the card', story)
b('Click on the card, go to Format (paintbrush icon) &gt; set Data Label to large font size', story)
b('Set Display Units to "Millions" so it shows like "$2.5M" instead of "$2,500,000"', story)

sub2('Visual 2: Total Profit KPI Card', story)
p('Click empty space on the canvas. Add another Card visual. Drag <b>Total Profit</b> into it. Format the same way as Revenue.', story)

sub2('Visual 3: Profit Margin % Card', story)
p('Add a third Card visual. Drag <b>Profit Margin %</b> into it. Go to Format &gt; set Display Units to percentage. It should show something like "32.5%".', story)

sub2('Visual 4: YoY Growth % Card', story)
p('Add a fourth Card visual. Drag <b>Revenue YoY Growth %</b>. This shows growth compared to last year. Format as percentage. If positive, the business is growing. If negative, it is declining.', story)

sub2('Visual 5: Revenue by Country Bar Chart', story)
p('Add a Clustered Bar Chart. Drag <b>DimCountry[Country]</b> to Axis. Drag <b>Total Revenue</b> to Values. Sort the bars from highest to lowest by clicking the three dots on the chart &gt; Sort axis &gt; Total Revenue &gt; Descending.', story)

sub2('Visual 6: Revenue Trend Line Chart', story)
p('Add a Line Chart. Drag <b>DimDate[YearMonth]</b> to Axis. Drag <b>Total Revenue</b> to Values. This shows how revenue changes over time. You should see a line going up and down over the months.', story)

sub2('Add Slicers for Page 1', story)
p('Slicers allow users to filter the data. Add a Slicer visual and drag <b>DimCountry[Country]</b> into it. Add another Slicer and drag <b>DimProduct[Product]</b> into it. Place these slicers at the top of the page. Now users can click on a country or product to filter all visuals on the page.', story)

sp(story, 2)
step_box('D2', 'Create Page 2: Product Analysis', story, NAVY, LIGHT_BLUE)
p('Click the + button at the bottom of Power BI to add a new page. On this page, create:', story)
b('<b>Bar Chart:</b> Revenue by Product (DimProduct[Product] on Axis, Total Revenue in Values)', story)
b('<b>Bar Chart:</b> Profit by Product (DimProduct[Product] on Axis, Total Profit in Values)', story)
b('<b>Bar Chart:</b> Units Sold by Product (DimProduct[Product] on Axis, Total Units Sold in Values)', story)
b('<b>Table:</b> Product Performance Table (Product, Revenue, Profit, Margin, Units, Rank)', story)
b('<b>Slicer:</b> Segment (DimSegment[Segment]) - so users can filter by customer type', story)

step_box('D3', 'Create Page 3: Geographic Analysis', story, NAVY, LIGHT_BLUE)
p('Add a new page. Create:', story)
b('<b>Map:</b> Filled Map visual. Drag DimCountry[Country] to Location. Drag Total Revenue to Size. The map will show circles on each country, bigger circles = more revenue.', story)
b('<b>Bar Chart:</b> Revenue by Country', story)
b('<b>Stacked Column Chart:</b> Revenue by Country, split by Segment (Country on Axis, Revenue in Values, Segment in Legend)', story)
b('<b>Donut Chart:</b> Revenue share by Country (Country in Legend, Revenue in Values)', story)

step_box('D4', 'Create Page 4: Time Analysis', story, NAVY, LIGHT_BLUE)
p('Add a new page for time trends:', story)
b('<b>Line Chart:</b> Revenue YTD vs Revenue SPLY (DimDate[MonthName] on Axis, both measures in Values)', story)
b('<b>Area Chart:</b> Profit Margin trend over time (DimDate[YearMonth] on Axis, Profit Margin % in Values)', story)
b('<b>Bar Chart:</b> Revenue by Quarter (DimDate[YearQuarter] on Axis, Total Revenue in Values)', story)
b('<b>Slicer:</b> Year (DimDate[Year]) - filter by specific year', story)
b('<b>Slicer:</b> Quarter (DimDate[Quarter]) - filter by Q1, Q2, Q3, Q4', story)

sp(story, 2)
tip_box('Dashboard Tips', 'Use the Format pane (paintbrush icon) to make your charts look professional. Set consistent colors, add titles, adjust font sizes. A clean, consistent design looks much more professional than a messy one with random colors.', story)

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════
# SECTION 9: Business Analysis & Insights
# ═══════════════════════════════════════════════════════════════════════
section_bar(9, 'Business Analysis &amp; Insights', story)

p('Building a dashboard is not just about creating charts. The real value comes from understanding what the data tells you and making business decisions based on those insights. In this section, we discuss the key business insights that the Financial Sample data reveals and what actions a manager would take based on these insights.', story)

sub('9.1 Key Performance Indicators (KPIs)', story)
p('Based on the Financial Sample data, here are the typical KPI ranges you will observe:', story)

story.append(make_table(
    ['KPI', 'What It Shows', 'Good Range', 'Bad Signal'],
    [
        ['Total Revenue', 'Total money earned', 'Growing year over year', 'Declining or flat revenue'],
        ['Profit Margin %', 'Efficiency of sales', '25% - 40%', 'Below 15% is concerning'],
        ['Discount Rate %', 'Discount dependency', '5% - 15%', 'Above 20% means too much discounting'],
        ['YoY Growth %', 'Business momentum', '10% - 25% is healthy', 'Negative growth is a warning'],
        ['Units Sold Trend', 'Demand direction', 'Steady or increasing', 'Declining units = losing customers'],
    ],
    [30*mm, 40*mm, 40*mm, 60*mm]
))

sp(story, 3)
sub('9.2 Product Insights', story)
p('When you look at the data by product, you will notice important patterns. Not all products are equal. Some bring more revenue, some bring more profit, and some sell more units. Understanding these differences is the key to making good product decisions:', story)

b('<b>High Revenue, High Profit Products:</b> These are your star products. They bring in the most money and have the best margins. The company should invest more in marketing these products, ensure they are always in stock, and protect them from competitors.', story)
b('<b>High Revenue, Low Profit Products:</b> These products sell well but the margins are thin. The company should try to negotiate better manufacturing prices or increase the selling price. Alternatively, use these as "traffic drivers" to attract customers who may also buy higher-margin products.', story)
b('<b>Low Revenue, High Profit Products:</b> These niche products may have low sales volume but great margins. Consider increasing marketing efforts to boost sales, as each additional sale is very profitable.', story)
b('<b>Low Revenue, Low Profit Products:</b> These are the weakest products. Consider discontinuing them to save resources. The money spent on marketing and inventory for these products could be better used for the star products.', story)

sp(story, 3)
sub('9.3 Geographic Insights', story)
p('The country analysis reveals where the company is strong and where it has opportunities:', story)
b('<b>Top Performing Country:</b> Identify which country brings the most revenue. This market is working well. Consider increasing investment here (more sales team, more marketing budget).', story)
b('<b>Growing Markets:</b> Look for countries where YoY growth is high. These are emerging opportunities. The company should focus expansion efforts on these markets.', story)
b('<b>Declining Markets:</b> If a country shows declining revenue, investigate why. Is it competition, economic conditions, or poor sales execution? Develop a recovery plan or consider reallocating resources.', story)
b('<b>Untapped Potential:</b> If some countries have low revenue but high growth, they may represent future opportunities. Invest in market research and targeted marketing for these regions.', story)

sp(story, 3)
sub('9.4 Segment Insights', story)
p('The customer segment analysis tells you who your best customers are:', story)
b('<b>Enterprise:</b> Large companies usually bring the highest revenue per deal but may require longer sales cycles and more negotiation. Profit margins may be lower because of volume discounts.', story)
b('<b>Government:</b> Government contracts are large but slow. Payment terms may be longer. However, they provide stable, predictable revenue.', story)
b('<b>Midmarket:</b> Medium-sized companies often offer the best balance of revenue volume and profit margin. They are easier to sell to than enterprise and buy more than SMB.', story)
b('<b>SMB:</b> Small businesses have smaller order sizes but there are many of them. They can collectively contribute significant revenue if the company can serve them efficiently at scale.', story)
b('<b>Channel Partners:</b> Resellers buy in bulk but at lower margins. The advantage is that they handle the end-customer relationship. Evaluate if the margin loss is worth the volume gain.', story)

sp(story, 3)
sub('9.5 Time-Based Insights', story)
p('Looking at revenue over time reveals patterns that are critical for planning:', story)
b('<b>Seasonality:</b> Is there a pattern where some months or quarters consistently have higher or lower sales? For example, if Q4 is always the strongest, the company should plan inventory and staffing accordingly.', story)
b('<b>Growth Trend:</b> Is overall revenue growing year over year? A consistent upward trend indicates a healthy business. A flat or declining trend needs immediate attention.', story)
b('<b>Best and Worst Months:</b> Identify which months have the highest and lowest revenue. Plan promotions and marketing campaigns to boost slow months.', story)

story.append(PageBreak())

sub('9.6 Actionable Recommendations', story)
p('Based on the Financial Sample data analysis, here is a sample list of business recommendations that a professional Power BI developer would present to management:', story)

story.append(make_table(
    ['#', 'Finding', 'Recommendation', 'Priority'],
    [
        ['1', 'One product has low profit margin', 'Review pricing strategy or reduce manufacturing costs for this product', 'High'],
        ['2', 'Discount rate is above 15%', 'Implement stricter discount approval process. Train sales team on value selling.', 'High'],
        ['3', 'One country shows declining revenue', 'Investigate root cause. Assign a dedicated sales manager for this market.', 'High'],
        ['4', 'Enterprise segment has best margins', 'Increase sales effort targeting enterprise customers. Hire more enterprise sales reps.', 'Medium'],
        ['5', 'Q4 has the highest revenue every year', 'Plan inventory and staffing increases before Q4. Consider Q4 promotions.', 'Medium'],
        ['6', 'SMB segment has many small orders', 'Develop self-service ordering system to serve SMB customers efficiently.', 'Low'],
    ],
    [10*mm, 50*mm, 75*mm, 35*mm]
))

sp(story, 2)
tip_box('Professional Insight', 'The most valuable Power BI developer is not the one who makes the most beautiful charts. It is the one who can look at the data, find the story, and present actionable insights to management. Always ask yourself: "So what? What should the business DO with this information?"', story)

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════
# SECTION 10: Summary & Next Steps
# ═══════════════════════════════════════════════════════════════════════
section_bar(10, 'Summary &amp; Next Steps', story)

p('Congratulations on completing this guide! You have learned the complete professional workflow for working with the Financial Sample data in Power BI. Let us review everything you have accomplished and plan your next steps for continued learning.', story)

sub('10.1 What You Learned', story)
p('In this guide, you went through the entire professional Power BI project workflow from start to finish. Here is a summary of all the skills you practiced:', story)

story.append(make_table(
    ['Skill Area', 'What You Did', 'Why It Matters'],
    [
        ['Data Understanding', 'Examined every column, understood data types, checked data quality', 'You cannot build good reports without understanding your data first'],
        ['Business Analysis', 'Defined business questions, planned dashboard structure', 'Every report should answer real business questions, not just show charts'],
        ['Data Loading', 'Connected to Excel, used Navigator, loaded data', 'This is the first step in every Power BI project'],
        ['Data Profiling', 'Explored data view, checked types, identified issues', 'Catching data problems early saves hours of debugging later'],
        ['Power Query', 'Cleaned data, fixed types, renamed query', 'Clean data leads to clean reports and accurate calculations'],
        ['Data Modeling', 'Created Star Schema with 4 dimension tables and relationships', 'Good data model is the foundation of fast, accurate reports'],
        ['DAX Measures', 'Wrote 13 measures from basic SUM to advanced YoY Growth', 'DAX measures bring your data to life with dynamic calculations'],
        ['Dashboard Design', 'Built 4 pages with KPIs, charts, maps, slicers', 'Visual storytelling turns data into decisions'],
        ['Business Insights', 'Analyzed product, geographic, segment, and time patterns', 'The ultimate goal is actionable insights, not just pretty charts'],
    ],
    [28*mm, 60*mm, 82*mm]
))

sp(story, 3)
sub('10.2 The Complete Workflow Recap', story)
p('Here is the exact sequence you followed in this guide. This is the same sequence that professionals follow in real projects:', story)

story.append(make_table(
    ['Step', 'What You Did', 'Tool Used'],
    [
        ['1', 'Understood the data and business questions', 'Excel (to look at the data)'],
        ['2', 'Defined dashboard goals and page structure', 'Paper / Notes'],
        ['3', 'Loaded data into Power BI', 'Get Data &gt; Excel &gt; Navigator'],
        ['4', 'Explored and profiled the data', 'Data View in Power BI'],
        ['5', 'Cleaned and prepared data', 'Power Query Editor'],
        ['6', 'Built the Star Schema model', 'Model View + DAX calculated tables'],
        ['7', 'Created Date Table and relationships', 'Model View + Mark as Date Table'],
        ['8', 'Wrote DAX measures', 'DAX formula bar'],
        ['9', 'Built dashboard pages with visuals', 'Report View'],
        ['10', 'Analyzed business insights', 'Dashboard + business thinking'],
    ],
    [15*mm, 80*mm, 75*mm]
))

sp(story, 3)
sub('10.3 Challenges to Try on Your Own', story)
p('Now that you have completed the basic guide, here are some challenges to test and improve your skills:', story)

story.append(make_table(
    ['Challenge', 'What to Do', 'Skills Practiced'],
    [
        ['1. Add a Forecast', 'Use the Analytics pane on a line chart to add a forecast line', 'Power BI analytics features'],
        ['2. Create a Tooltip Page', 'Create a hidden page that shows details when hovering over a chart element', 'Tooltip pages, page navigation'],
        ['3. Add Bookmarks', 'Create bookmarks for different views and add navigation buttons', 'Bookmarks, buttons, interactivity'],
        ['4. Conditional Formatting', 'Color the profit bar chart: green for positive, red for negative', 'Conditional formatting, visual design'],
        ['5. Calculate Market Share', 'Create a measure that shows each products share of total revenue', 'Advanced DAX: DIVIDE with ALL'],
        ['6. Add a What-If Parameter', 'Create a slider that simulates different discount rates and shows impact on profit', 'What-If parameters, scenario analysis'],
        ['7. Build a Mobile Layout', 'Create a phone-optimized version of the executive summary page', 'Mobile layout design'],
        ['8. Publish to Power BI Service', 'Upload your report to Power BI Service and share it', 'Publishing, sharing, cloud'],
    ],
    [30*mm, 75*mm, 65*mm]
))

sp(story, 3)
sub('10.4 Next Steps in Your Power BI Journey', story)
p('This Financial Sample project gave you hands-on experience with the most important Power BI skills. Here is the recommended path for your continued learning:', story)

b('<b>Practice with Different Data:</b> Download other sample datasets (Adventure Works, Contoso) and repeat the same workflow. Each dataset will teach you something new.', story)
b('<b>Learn Advanced DAX:</b> Study CALCULATE deeper, learn about context transition, and practice complex scenarios. DAX is the most in-demand Power BI skill.', story)
b('<b>Master Power Query:</b> Learn M language basics. Practice merging, appending, pivoting, and unpivoting data. These skills save hours of work.', story)
b('<b>Study for PL-300 Exam:</b> The Microsoft PL-300 certification (Power BI Data Analyst) is the industry standard. Passing this exam proves your skills to employers.', story)
b('<b>Build a Portfolio:</b> Create 3-5 different dashboards with different datasets. These will be your portfolio to show in job interviews.', story)
b('<b>Join the Community:</b> Follow Power BI experts on LinkedIn, join the Power BI community forum, and participate in challenges like "Weekend Tips" and "Workout Wednesday."', story)

sp(story, 3)
tip_box('Final Advice', 'The best way to learn Power BI is by doing. Reading guides and watching videos is helpful, but nothing replaces hands-on practice. Open Power BI Desktop every day and build something. Even 30 minutes of daily practice will make you proficient in a few months. You have already completed the hardest part: understanding the workflow. Now keep building!', story)


# ──────────────────────────────────────────────────────────────────────
# BUILD
# ──────────────────────────────────────────────────────────────────────
print("Building PDF...")
doc.build(story)
print(f"PDF created: {OUTPUT}")
print(f"File size: {os.path.getsize(OUTPUT) / 1024:.1f} KB")
