#!/usr/bin/env python3
"""
Generate: Amazon_Analytics_Excel_Analysis_Guide.pdf
A comprehensive guide explaining how to answer ALL business questions
from the 1M-row Amazon analytics CSV using ONLY Microsoft Excel.
Written in A1-level English for accessibility.
"""

import os, hashlib
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch, cm
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.lib import colors
from reportlab.platypus import (
    Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
)
from reportlab.platypus.tableofcontents import TableOfContents
from reportlab.platypus import SimpleDocTemplate
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily

# =============================================================================
# PALETTE
# =============================================================================
ACCENT       = colors.HexColor('#bb2b43')
TEXT_PRIMARY  = colors.HexColor('#272623')
TEXT_MUTED    = colors.HexColor('#88847b')
BG_SURFACE   = colors.HexColor('#e0ddd7')
BG_PAGE      = colors.HexColor('#efeeec')
TABLE_HEADER_COLOR = ACCENT
TABLE_HEADER_TEXT  = colors.white
TABLE_ROW_EVEN     = colors.white
TABLE_ROW_ODD      = BG_SURFACE

# =============================================================================
# FONT REGISTRATION
# =============================================================================
pdfmetrics.registerFont(TTFont('TNR', '/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf'))
pdfmetrics.registerFont(TTFont('Calibri', '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf'))
pdfmetrics.registerFont(TTFont('DV', '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'))
registerFontFamily('TNR', normal='TNR', bold='TNR')
registerFontFamily('Calibri', normal='Calibri', bold='Calibri')

# =============================================================================
# STYLES
# =============================================================================
cover_title = ParagraphStyle(name='CT', fontName='TNR', fontSize=36, leading=44, alignment=TA_LEFT, textColor=TEXT_PRIMARY)
cover_sub = ParagraphStyle(name='CS', fontName='TNR', fontSize=16, leading=22, alignment=TA_LEFT, textColor=TEXT_MUTED)
cover_meta = ParagraphStyle(name='CM', fontName='TNR', fontSize=12, leading=16, alignment=TA_LEFT, textColor=TEXT_MUTED)

h1_style = ParagraphStyle(name='H1', fontName='TNR', fontSize=20, leading=26, alignment=TA_LEFT, textColor=TEXT_PRIMARY, spaceBefore=18, spaceAfter=10)
h2_style = ParagraphStyle(name='H2', fontName='TNR', fontSize=15, leading=20, alignment=TA_LEFT, textColor=ACCENT, spaceBefore=14, spaceAfter=8)
h3_style = ParagraphStyle(name='H3', fontName='TNR', fontSize=12, leading=16, alignment=TA_LEFT, textColor=TEXT_PRIMARY, spaceBefore=10, spaceAfter=6)

body_style = ParagraphStyle(name='Body', fontName='TNR', fontSize=11, leading=17, alignment=TA_JUSTIFY, textColor=TEXT_PRIMARY, spaceAfter=6)
body_left = ParagraphStyle(name='BL', fontName='TNR', fontSize=11, leading=17, alignment=TA_LEFT, textColor=TEXT_PRIMARY, spaceAfter=6)
bullet_style = ParagraphStyle(name='Bul', fontName='TNR', fontSize=11, leading=17, alignment=TA_LEFT, textColor=TEXT_PRIMARY, leftIndent=24, bulletIndent=12, spaceAfter=4)

question_style = ParagraphStyle(name='QS', fontName='TNR', fontSize=11, leading=17, alignment=TA_LEFT, textColor=ACCENT, leftIndent=18, bulletIndent=6, spaceBefore=4, spaceAfter=2)
answer_style = ParagraphStyle(name='AS', fontName='TNR', fontSize=11, leading=17, alignment=TA_JUSTIFY, textColor=TEXT_PRIMARY, leftIndent=18, spaceBefore=2, spaceAfter=8)
caption_style = ParagraphStyle(name='Cap', fontName='TNR', fontSize=10, leading=14, alignment=TA_CENTER, textColor=TEXT_MUTED, spaceBefore=3, spaceAfter=6)

header_cell = ParagraphStyle(name='HC', fontName='TNR', fontSize=10, leading=14, alignment=TA_CENTER, textColor=colors.white)
cell_style = ParagraphStyle(name='CE', fontName='TNR', fontSize=10, leading=14, alignment=TA_LEFT, textColor=TEXT_PRIMARY)
cell_c = ParagraphStyle(name='CC', fontName='TNR', fontSize=10, leading=14, alignment=TA_CENTER, textColor=TEXT_PRIMARY)

# Code / formula style
code_style = ParagraphStyle(name='Code', fontName='DV', fontSize=9, leading=14, alignment=TA_LEFT, textColor=TEXT_PRIMARY, leftIndent=18, spaceBefore=4, spaceAfter=4, backColor=BG_SURFACE)
step_style = ParagraphStyle(name='Step', fontName='TNR', fontSize=11, leading=17, alignment=TA_LEFT, textColor=TEXT_PRIMARY, leftIndent=18, spaceBefore=2, spaceAfter=4)

# =============================================================================
# TEMPLATE
# =============================================================================
class TocDocTemplate(SimpleDocTemplate):
    def afterFlowable(self, flowable):
        if hasattr(flowable, 'bookmark_name'):
            level = getattr(flowable, 'bookmark_level', 0)
            text = getattr(flowable, 'bookmark_text', '')
            key = getattr(flowable, 'bookmark_key', '')
            self.notify('TOCEntry', (level, text, self.page, key))

PAGE_W, PAGE_H = A4
LM = 1.0 * inch; RM = 1.0 * inch; TM = 0.8 * inch; BM = 0.8 * inch
AW = PAGE_W - LM - RM
H1_ORPHAN = (PAGE_H - TM - BM) * 0.15
OUTPUT = "Amazon_Analytics_Excel_Analysis_Guide.pdf"

doc = TocDocTemplate(OUTPUT, pagesize=A4, leftMargin=LM, rightMargin=RM,
    topMargin=TM, bottomMargin=BM,
    title="Amazon Analytics Excel Analysis Guide",
    author="Z.ai", subject="Excel-based Business Analysis Guide")

from reportlab.platypus import CondPageBreak

# =============================================================================
# HELPERS
# =============================================================================
def add_heading(text, style, level=0):
    key = 'h_%s' % hashlib.md5(text.encode()).hexdigest()[:8]
    p = Paragraph('<a name="%s"/>%s' % (key, text), style)
    p.bookmark_name = text; p.bookmark_level = level
    p.bookmark_text = text; p.bookmark_key = key
    return p

def P(t, s=body_style): return Paragraph(t, s)
def H1(t): return [Spacer(1, 6), CondPageBreak(H1_ORPHAN), add_heading('<b>%s</b>' % t, h1_style, 0)]
def H2(t): return [add_heading('<b>%s</b>' % t, h2_style, 1)]
def H3(t): return [add_heading('<b>%s</b>' % t, h3_style, 2)]
def QA(q, a): return [P('<b>Q: %s</b>' % q, question_style), P(a, answer_style)]
def STEP(n, t): return P('<b>Step %d:</b> %s' % (n, t), step_style)
def CODE(t): return P(t, code_style)

def make_table(headers, rows, ratios=None):
    if ratios is None:
        ratios = [1.0/len(headers)] * len(headers)
    cw = [r * AW for r in ratios]
    data = [[Paragraph('<b>%s</b>' % h, header_cell) for h in headers]]
    for row in rows:
        data.append([Paragraph(str(c), cell_style) for c in row])
    t = Table(data, colWidths=cw, hAlign='CENTER')
    cmds = [
        ('BACKGROUND', (0, 0), (-1, 0), TABLE_HEADER_COLOR),
        ('TEXTCOLOR', (0, 0), (-1, 0), TABLE_HEADER_TEXT),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 8), ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 6), ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('GRID', (0, 0), (-1, -1), 0.5, TEXT_MUTED),
    ]
    for i in range(1, len(data)):
        bg = TABLE_ROW_EVEN if i % 2 == 1 else TABLE_ROW_ODD
        cmds.append(('BACKGROUND', (0, i), (-1, i), bg))
    t.setStyle(TableStyle(cmds))
    return t

# =============================================================================
# BUILD STORY
# =============================================================================
story = []

# ── COVER ──
story.append(Spacer(1, 140))
story.append(P('<b>Amazon Analytics</b>', cover_title))
story.append(P('<b>Excel Analysis Guide</b>', cover_title))
story.append(Spacer(1, 20))
story.append(P('How to Answer Every Business Question<br/>Using Only Microsoft Excel', cover_sub))
story.append(Spacer(1, 40))
story.append(P('Dataset: 1,000,000 Orders | 48 Columns | 200,000 Customers', cover_meta))
story.append(Spacer(1, 8))
story.append(P('Step-by-Step Excel Instructions for Business Analysts', cover_meta))
story.append(Spacer(1, 8))
story.append(P('May 2025', cover_meta))
story.append(PageBreak())

# ── TOC ──
toc = TableOfContents()
toc.levelStyles = [
    ParagraphStyle(name='TOC1', fontSize=13, leftIndent=20, fontName='TNR', leading=20, spaceBefore=6, spaceAfter=4),
    ParagraphStyle(name='TOC2', fontSize=11, leftIndent=40, fontName='TNR', leading=18, spaceBefore=2, spaceAfter=2),
]
story.append(P('<b>Table of Contents</b>', h1_style))
story.append(Spacer(1, 12))
story.append(toc)
story.append(PageBreak())

# =============================================================================
# CHAPTER 1: GETTING STARTED WITH EXCEL
# =============================================================================
story.extend(H1('1. Getting Started with Excel'))

story.extend(H2('1.1 Loading the CSV File'))
story.append(P(
    'Before you can analyze data, you need to load it into Excel. The CSV file '
    'has 1 million rows and 48 columns. Normal Excel has a limit of 1,048,576 rows, '
    'so this file will fit. But it is close to the limit, so you need to be careful.'
))
story.append(STEP(1, 'Open Microsoft Excel (version 2016 or newer).'))
story.append(STEP(2, 'Go to File > Open > Browse. Find the CSV file (amazon_perfect_analytics_1m.csv).'))
story.append(STEP(3, 'Excel will ask how to open the file. Choose "Text/CSV" and click "Load". '
    'Excel will use Power Query to import the data. This is important because Power Query '
    'can handle large files better than normal Excel.'))
story.append(STEP(4, 'After the data loads, you will see it in a new worksheet. The 48 columns will '
    'appear as headers in row 1, and the data starts from row 2.'))
story.append(P(
    '<b>Important Tip:</b> If Excel is slow with 1 million rows, you can use a '
    'sample instead. Take the first 100,000 rows for quick testing. To do this, '
    'open the CSV in Notepad, copy the header row and first 100,000 data rows, '
    'paste into a new file, and save as CSV. Use this smaller file for practice.'
))

story.extend(H2('1.2 Preparing Your Data'))
story.append(P(
    'After loading, you need to prepare the data for analysis. This means making '
    'sure Excel understands the data types correctly.'
))
story.append(STEP(1, 'Check the Order_Date column. It should be in Date format. If Excel shows it as text, '
    'select the column, go to Data > Text to Columns, choose "Delimited", and finish.'))
story.append(STEP(2, 'Check the Total_Amount, Net_Profit, Unit_Price, and COGS_Price columns. '
    'They should be in Number format with 2 decimal places.'))
story.append(STEP(3, 'Check Is_Prime_Member. It should be a number (0 or 1), not text.'))
story.append(STEP(4, 'Give your data a Table name: Select all data (Ctrl+A), then go to '
    'Insert > Table. Check "My table has headers". In the Table Design tab, name it '
    '"Orders" (no spaces). This makes formulas easier to read.'))
story.append(P(
    'Now your data is ready for analysis. Every technique in this guide uses '
    'this prepared data as the starting point.'
))

story.extend(H2('1.3 Excel Tools You Will Use'))
story.append(P(
    'This guide uses only standard Excel features. You do not need any add-ins '
    'or special software. The main tools are:'
))

tools_data = [
    ['Formulas', 'SUM, AVERAGE, COUNTIF, SUMIF, VLOOKUP, IF, and more'],
    ['Pivot Tables', 'Summarize data by any category, date, or group'],
    ['Pivot Charts', 'Visual charts from pivot tables'],
    ['Filters', 'Show only rows that match your criteria'],
    ['Conditional Formatting', 'Color cells based on their values'],
    ['Sorting', 'Order data from highest to lowest (or A to Z)'],
    ['Text to Columns', 'Split one column into multiple columns'],
    ['Charts', 'Bar, Line, Pie, and Scatter charts'],
]
story.append(Spacer(1, 10))
t = make_table(['Excel Tool', 'What You Use It For'], tools_data, [0.25, 0.75])
story.append(t)
story.append(P('<b>Table 1.</b> Excel Tools Used in This Guide', caption_style))
story.append(Spacer(1, 12))

# =============================================================================
# CHAPTER 2: SALES AND REVENUE IN EXCEL
# =============================================================================
story.extend(H1('2. Sales and Revenue Analysis in Excel'))

story.extend(H2('2.1 Total Revenue and Total Profit'))
story.append(P(
    '<b>Question:</b> What is the total revenue and net profit for the year?', question_style))
story.append(P(
    'This is the simplest calculation. You need two numbers: the sum of the '
    'Total_Amount column (revenue) and the sum of the Net_Profit column (profit).', answer_style))
story.append(STEP(1, 'Click on an empty cell where you want the result.'))
story.append(STEP(2, 'Type: <b>=SUM(Orders[Total_Amount])</b> and press Enter. This gives you total revenue.'))
story.append(STEP(3, 'In another cell, type: <b>=SUM(Orders[Net_Profit])</b> and press Enter. This gives you total profit.'))
story.append(STEP(4, 'To calculate profit margin, type: <b>=B2/B1</b> (where B2 is profit and B1 is revenue). '
    'Format as percentage. A good result is 10-20%.'))
story.append(CODE('Revenue:   =SUM(Orders[Total_Amount])'))
story.append(CODE('Profit:    =SUM(Orders[Net_Profit])'))
story.append(CODE('Margin:    =Profit / Revenue'))

story.extend(H2('2.2 Average Order Value (AOV)'))
story.append(P(
    '<b>Question:</b> What is the average order value?', question_style))
story.append(P(
    'AOV tells you how much money each customer spends per order. This is a '
    'very important metric. If AOV is $75, it means on average every order '
    'brings $75 in revenue.', answer_style))
story.append(STEP(1, 'In an empty cell, type: <b>=AVERAGE(Orders[Total_Amount])</b> and press Enter.'))
story.append(STEP(2, 'To also see the median (middle value), type: <b>=MEDIAN(Orders[Total_Amount])</b>. '
    'If AOV is much higher than median, it means a few very large orders pull the average up.'))
story.append(CODE('AOV:     =AVERAGE(Orders[Total_Amount])'))
story.append(CODE('Median:  =MEDIAN(Orders[Total_Amount])'))
story.append(CODE('Min:     =MIN(Orders[Total_Amount])'))
story.append(CODE('Max:     =MAX(Orders[Total_Amount])'))

story.extend(H2('2.3 Revenue by Month (Pivot Table)'))
story.append(P(
    '<b>Question:</b> How does revenue change by month?', question_style))
story.append(P(
    'To answer this, you need to group 1 million orders by month and sum the '
    'revenue for each month. A Pivot Table is the perfect tool for this. '
    'Pivot Tables can summarize millions of rows in seconds.', answer_style))
story.append(STEP(1, 'Select any cell inside your data table.'))
story.append(STEP(2, 'Go to Insert > PivotTable. Excel will ask where to put it. Choose "New Worksheet" and click OK.'))
story.append(STEP(3, 'On the right side, you see the PivotTable Fields panel. Drag <b>Order_Date</b> to the "Rows" area.'))
story.append(STEP(4, 'Excel will group dates automatically. If not, right-click any date in the pivot and choose '
    '"Group". Select "Months" and "Years". Click OK.'))
story.append(STEP(5, 'Drag <b>Total_Amount</b> to the "Values" area. Excel will show "Sum of Total_Amount".'))
story.append(STEP(6, 'To see revenue per order (not just total), drag <b>Order_ID</b> to Values. Change it from '
    '"Count" to "Count" (it counts the number of orders per month).'))
story.append(STEP(7, 'Select the pivot table and go to Insert > PivotChart. Choose a Line chart. '
    'This shows the revenue trend over the year. You will see spikes in July (Prime Day) '
    'and November (Black Friday).'))
story.append(P(
    '<b>Tip:</b> You can also calculate this with formulas. Create a new column called "Month" '
    'with the formula <b>=TEXT(Orders[@Order_Date],"YYYY-MM")</b>. Then use a Pivot Table on '
    'the Month column. Or use <b>=SUMIF(Orders[Month],"2025-01",Orders[Total_Amount])</b> for each month.'
))

story.extend(H2('2.4 Revenue by Category'))
story.append(P(
    '<b>Question:</b> Which product category makes the most revenue?', question_style))
story.append(P(
    'This is another perfect task for a Pivot Table. You will see that Electronics '
    'and Computers generate the most revenue because their prices are high.', answer_style))
story.append(STEP(1, 'Insert a new PivotTable (Insert > PivotTable > New Worksheet).'))
story.append(STEP(2, 'Drag <b>Product_Category</b> to the "Rows" area.'))
story.append(STEP(3, 'Drag <b>Total_Amount</b> to the "Values" area. It shows "Sum of Total_Amount".'))
story.append(STEP(4, 'Also drag <b>Net_Profit</b> to Values. Now you see both revenue and profit per category.'))
story.append(STEP(5, 'Click the pivot, go to Insert > PivotChart. Choose a Bar chart.'))
story.append(STEP(6, 'Right-click the values in the pivot and choose "Sort > Sort Largest to Smallest".'))
story.append(P(
    'To add profit margin to the pivot, click inside the pivot, go to PivotTable '
    'Analyze > Fields, Items and Sets > Calculated Field. Name it "Profit_Margin", '
    'formula: <b>=Net_Profit/Total_Amount</b>. Format as percentage.'
))

story.extend(H2('2.5 Revenue by Day of Week and Hour'))
story.append(P(
    '<b>Question:</b> What day and hour have the most orders?', question_style))
story.append(P(
    'For this, you need to extract the day of the week and the hour from the Order_Date '
    'column. You do this with helper columns.', answer_style))
story.append(STEP(1, 'Create a new column called "DayOfWeek" next to Order_Date.'))
story.append(STEP(2, 'In the first data row, type: <b>=TEXT([@Order_Date],"DDDD")</b>. This gives "Monday", "Tuesday", etc.'))
story.append(STEP(3, 'Create another column called "Hour". Type: <b>=HOUR([@Order_Date])</b>. This gives 0-23.'))
story.append(STEP(4, 'Create a PivotTable. Drag "DayOfWeek" to Rows, and drag "Order_ID" to Values '
    '(change to Count). Sort by count descending.'))
story.append(STEP(5, 'For hourly analysis, create another PivotTable with "Hour" in Rows and "Order_ID" '
    'count in Values. Insert a Column chart. You will see the peak is 6-10 PM.'))
story.append(CODE('Day of Week:  =TEXT([@Order_Date],"DDDD")'))
story.append(CODE('Hour:         =HOUR([@Order_Date])'))
story.append(CODE('Month:        =TEXT([@Order_Date],"YYYY-MM")'))
story.append(CODE('Week Number:  =WEEKNUM([@Order_Date])'))

# =============================================================================
# CHAPTER 3: CUSTOMER BEHAVIOR IN EXCEL
# =============================================================================
story.extend(H1('3. Customer Behavior Analysis in Excel'))

story.extend(H2('3.1 Customer Segmentation (Pivot Table)'))
story.append(P(
    '<b>Question:</b> How many orders does each customer place?', question_style))
story.append(P(
    'To answer this, you group the data by Customer_ID and count orders per customer. '
    'This tells you which customers are one-time buyers and which are repeat customers.', answer_style))
story.append(STEP(1, 'Insert a PivotTable.'))
story.append(STEP(2, 'Drag <b>Customer_ID</b> to the "Rows" area.'))
story.append(STEP(3, 'Drag <b>Order_ID</b> to the "Values" area. Change it to "Count" (it counts orders).'))
story.append(STEP(4, 'Right-click a value and choose "Group". Set "Starting at" to 1, "Ending at" to 20, "By" to 5.'))
story.append(STEP(5, 'Now you see how many customers placed 1-5 orders, 6-10 orders, 11-15, and 16-20.'))
story.append(P(
    '<b>Important Note:</b> With 200,000 unique customers, the pivot table will have '
    '200,000 rows. This can be slow. To speed it up, group the values as described in Step 4. '
    'You can also add Customer_Lifetime_Value to the Values area to see the total spend per group.'
))

story.extend(H2('3.2 Prime vs Non-Prime Members'))
story.append(P(
    '<b>Question:</b> Do Prime members spend more than non-Prime members?', question_style))
story.append(P(
    'You can answer this with a simple Pivot Table or with formulas.', answer_style))
story.append(STEP(1, 'For a Pivot Table: Insert PivotTable. Drag Is_Prime_Member to Rows. '
    'Drag Total_Amount and Order_ID to Values. Total_Amount shows SUM, Order_ID shows COUNT.'))
story.append(STEP(2, 'For a formula approach:'))
story.append(CODE('Prime Revenue:    =SUMIF(Orders[Is_Prime_Member],1,Orders[Total_Amount])'))
story.append(CODE('Non-Prime Revenue: =SUMIF(Orders[Is_Prime_Member],0,Orders[Total_Amount])'))
story.append(CODE('Prime Orders:     =COUNTIF(Orders[Is_Prime_Member],1)'))
story.append(CODE('Prime AOV:        =Prime_Revenue / Prime_Orders'))
story.append(STEP(3, 'To compare CLV: use <b>=AVERAGEIF(Orders[Is_Prime_Member],1,Orders[Customer_Lifetime_Value])</b>.'))
story.append(P(
    'You will likely find that Prime members have higher AOV, higher CLV, and more orders. '
    'This shows the value of the Prime program for customer loyalty.'
))

story.extend(H2('3.3 Customer Lifetime Value Analysis'))
story.append(P(
    '<b>Question:</b> What is the average CLV and how is it distributed?', question_style))
story.append(P(
    'Customer Lifetime Value (CLV) is already calculated in the data. It represents the '
    'total money each customer has spent across all their orders. You need to analyze the '
    'distribution of this value.', answer_style))
story.append(STEP(1, 'Create a PivotTable. Drag Customer_Lifetime_Value to Rows.'))
story.append(STEP(2, 'Right-click the values and choose "Group". Set ranges: 0-100, 100-250, 250-500, 500-1000, 1000+.'))
story.append(STEP(3, 'Drag Customer_ID to Values (Count). This shows how many customers fall in each CLV range.'))
story.append(STEP(4, 'For quick statistics, use formulas:'))
story.append(CODE('Average CLV:  =AVERAGE(Orders[Customer_Lifetime_Value])'))
story.append(CODE('Median CLV:   =MEDIAN(Orders[Customer_Lifetime_Value])'))
story.append(CODE('Top 10% CLV:  =PERCENTILE.INC(Orders[Customer_Lifetime_Value],0.9)'))
story.append(P(
    'Use a histogram chart to visualize CLV distribution. Select the CLV column, '
    'go to Insert > Statistical Chart > Histogram. This shows you if most customers '
    'are low-spenders or if there is a good spread of customer value.'
))

story.extend(H2('3.4 Device Behavior Comparison'))
story.append(P(
    '<b>Question:</b> Do mobile users behave differently than desktop users?', question_style))
story.append(P(
    'Compare Device_Type groups using a Pivot Table.', answer_style))
story.append(STEP(1, 'Insert PivotTable. Drag Device_Type to Rows.'))
story.append(STEP(2, 'Add these to Values: Total_Amount (SUM), Total_Amount (AVERAGE), '
    'Time_On_Page_Sec (AVERAGE), Click_Stream_Count (AVERAGE), Cart_Abandonment_History (AVERAGE).'))
story.append(STEP(3, 'This shows you the AOV, average time on page, average clicks, and average '
    'cart abandonment for each device type.'))
story.append(P(
    'Expected results: Desktop users spend more time on pages and click more. '
    'Mobile App users have the shortest time on page but the highest order volume. '
    'Mobile Web users have the highest cart abandonment rate.'
))

story.extend(H2('3.5 Geographic Analysis'))
story.append(P(
    '<b>Question:</b> Which states and regions generate the most revenue?', question_style))
story.append(P(
    'Use two Pivot Tables - one for states and one for regions.', answer_style))
story.append(STEP(1, 'PivotTable 1: Drag Customer_State to Rows, Total_Amount and Net_Profit to Values. '
    'Sort by Total_Amount descending.'))
story.append(STEP(2, 'PivotTable 2: Drag Customer_Region to Rows, Total_Amount (SUM and AVERAGE) '
    'and Delivery_Days_Estimated (AVERAGE) to Values.'))
story.append(STEP(3, 'You can also add a calculated field for AOV: Total_Amount / Count of Order_ID.'))
story.append(STEP(4, 'To visualize regions on a map: Insert > Maps > Filled Map. Select the Region column. '
    '(Note: maps work best with country/state data, not custom regions.)'))

# =============================================================================
# CHAPTER 4: MARKETING ANALYSIS IN EXCEL
# =============================================================================
story.extend(H1('4. Marketing and Traffic Analysis in Excel'))

story.extend(H2('4.1 Traffic Source Performance'))
story.append(P(
    '<b>Question:</b> Which traffic source brings the most orders and revenue?', question_style))
story.append(P(
    'A Pivot Table gives you a complete picture of each traffic source.', answer_style))
story.append(STEP(1, 'Insert PivotTable. Drag Traffic_Source to Rows.'))
story.append(STEP(2, 'Add to Values: Order_ID (Count = total orders), Total_Amount (SUM = revenue), '
    'Total_Amount (AVERAGE = AOV), Net_Profit (SUM = profit).'))
story.append(STEP(3, 'Sort by revenue descending. This shows which channel brings the most money.'))
story.append(STEP(4, 'Also sort by AOV descending. A channel with fewer orders but higher AOV '
    'might be more valuable per customer.'))
story.append(STEP(5, 'Create a Pie Chart from the pivot to show the revenue share of each channel.'))
story.append(P(
    'Expected results: Amazon Internal Search and Google Search bring the most orders. '
    'YouTube Review might bring fewer but higher-value orders.'
))

story.extend(H2('4.2 Ad Campaign Analysis'))
story.append(P(
    '<b>Question:</b> Which ad campaigns perform the best?', question_style))
story.append(P(
    'Not all orders have an Ad_Campaign_ID. Only orders from TikTok Ads, Instagram '
    'Influencers, and YouTube Reviews have campaign IDs. You need to filter first.', answer_style))
story.append(STEP(1, 'Filter the data: Click the arrow on the Ad_Campaign_ID header. Uncheck "(Blanks)" '
    'to show only rows with a campaign ID.'))
story.append(STEP(2, 'Insert PivotTable on the filtered data. Drag Ad_Campaign_ID to Rows.'))
story.append(STEP(3, 'Add to Values: Order_ID (Count), Total_Amount (SUM), Net_Profit (SUM).'))
story.append(STEP(4, 'Add a calculated field for AOV: <b>=Total_Amount / Order_ID_count</b>.'))
story.append(STEP(5, 'Sort by Total_Amount descending to see the top campaigns.'))
story.append(P(
    '<b>Alternative (without filtering):</b> Use a formula to count campaign orders: '
    '<b>=COUNTIF(Orders[Ad_Campaign_ID],"&lt;&gt;")</b> (not empty). '
    'Or use <b>=SUMIF(Orders[Traffic_Source],"TikTok Ad",Orders[Total_Amount])</b> to sum revenue from TikTok.'
))

story.extend(H2('4.3 Keyword Analysis'))
story.append(P(
    '<b>Question:</b> Which keywords bring the most sales?', question_style))
story.append(P(
    'Keywords are in the Keywords_Used column. Only some orders have keywords '
    '(those from Amazon Internal Search and Google Search).', answer_style))
story.append(STEP(1, 'Filter Keywords_Used to exclude blanks (remove empty values).'))
story.append(STEP(2, 'Insert PivotTable. Drag Keywords_Used to Rows.'))
story.append(STEP(3, 'Drag Total_Amount to Values (SUM). Sort descending.'))
story.append(STEP(4, 'Also add Order_ID count. The best keywords have high revenue AND high order count.'))
story.append(P(
    'This analysis helps SEO and advertising teams focus on the most profitable keywords.'
))

story.extend(H2('4.4 Promotion Effectiveness'))
story.append(P(
    '<b>Question:</b> Which promotion type works best?', question_style))
story.append(P(
    'Compare the 6 promotion types: None, Lightning Deal, Coupon, Subscribe and Save, '
    'Prime Exclusive Discount, Buy X Get Y.', answer_style))
story.append(STEP(1, 'PivotTable. Drag Promotion_Type to Rows.'))
story.append(STEP(2, 'Values: Order_ID (Count), Total_Amount (SUM), Discount_Amount (SUM), '
    'Net_Profit (SUM).'))
story.append(STEP(3, 'Add calculated field for Avg Discount: <b>=Discount_Amount / Order_ID_count</b>.'))
story.append(STEP(4, 'Add calculated field for Profit Margin: <b>=Net_Profit / Total_Amount</b>.'))
story.append(STEP(5, 'Compare: "None" promotion should have the highest profit margin. '
    '"Lightning Deal" should have the highest order volume but lowest margin.'))
story.append(CODE('Lightning Deal Revenue:  =SUMIF(Orders[Promotion_Type],"Lightning Deal",Orders[Total_Amount])'))
story.append(CODE('Avg Discount by Type:  =AVERAGEIF(Orders[Promotion_Type],"Coupon",Orders[Discount_Amount])'))

# =============================================================================
# CHAPTER 5: LOGISTICS ANALYSIS IN EXCEL
# =============================================================================
story.extend(H1('5. Logistics and Delivery Analysis in Excel'))

story.extend(H2('5.1 Delivery On-Time Rate'))
story.append(P(
    '<b>Question:</b> What percentage of orders are delivered on time?', question_style))
story.append(P(
    'You need to calculate the actual delivery days and compare with the estimated days. '
    'This requires a helper column with a formula.', answer_style))
story.append(STEP(1, 'Create a helper column called "Actual_Delivery_Days". Only delivered and returned orders have '
    'a delivery date. For those, calculate the difference between dates.'))
story.append(STEP(2, 'Formula: <b>=IF([@[Actual_Delivery_Date]]="", "", '
    '[@[Actual_Delivery_Date]]-[@[Order_Date]])</b>. This gives the number of days for delivery.'))
story.append(STEP(3, 'Create another column "Is_Late": <b>=IF([@[Actual_Delivery_Days]]="","",'
    'IF([@[Actual_Delivery_Days]]>[@[Delivery_Days_Estimated]],1,0))</b>.'))
story.append(STEP(4, 'On-time rate formula:'))
story.append(CODE('Total Delivered:      =COUNTIF(Orders[Order_Status],"Delivered")'))
story.append(CODE('Late Deliveries:      =SUM(Orders[Is_Late])'))
story.append(CODE('On-Time Rate:         =1 - (Late_Deliveries / Total_Delivered)'))
story.append(CODE('                      Format as percentage. Expected: ~85%'))
story.append(P(
    '<b>Note:</b> With 1 million rows, these COUNTIF and SUM formulas will take a few seconds to calculate. '
    'Be patient. You can also use a Pivot Table: Rows = Order_Status, Values = count of orders.'
))

story.extend(H2('5.2 Carrier Performance Comparison'))
story.append(P(
    '<b>Question:</b> Which shipping carrier is the most reliable?', question_style))
story.append(P(
    'Compare carriers by their late delivery rate using a Pivot Table.', answer_style))
story.append(STEP(1, 'First, make sure you have the "Is_Late" column from section 5.1.'))
story.append(STEP(2, 'Insert PivotTable. Drag Shipping_Carrier to Rows.'))
story.append(STEP(3, 'Values: Is_Late (SUM = total late orders), Order_ID (Count = total orders for that carrier).'))
story.append(STEP(4, 'Add a calculated field for Late Rate: <b>=Is_Late / Order_ID_count</b>. Format as %.'))
story.append(STEP(5, 'Also add Delivery_Days_Estimated (AVERAGE) to Values.'))
story.append(STEP(6, 'Sort by late rate ascending (lowest = best).'))
story.append(P(
    'Expected results: Amazon Logistics might have the highest volume but also higher late rate. '
    'UPS and FedEx might be more reliable but more expensive.'
))

story.extend(H2('5.3 Warehouse Efficiency'))
story.append(P(
    '<b>Question:</b> Which warehouses handle the most orders?', question_style))
story.append(STEP(1, 'PivotTable. Drag Warehouse_ID to Rows, Order_ID (Count) and Total_Amount (SUM) to Values.'))
story.append(STEP(2, 'Sort by count descending.'))
story.append(STEP(3, 'Also add a cross-analysis: Rows = Warehouse_ID, Columns = Customer_Region. '
    'This shows which warehouses serve which regions.'))
story.append(P(
    'You can also check if same-region shipments are faster. Add Delivery_Days_Estimated '
    '(AVERAGE) to Values. Same-region warehouse-customer pairs should have lower average days.'
))

story.extend(H2('5.4 Holiday and Weekend Delivery Impact'))
story.append(P(
    '<b>Question:</b> Do holidays and weekends cause delivery delays?', question_style))
story.append(STEP(1, 'Create a helper column "DayType": <b>=IF(WEEKDAY([@Order_Date],2)&gt;5,"Weekend","Weekday")</b>.'))
story.append(STEP(2, 'PivotTable. Rows = DayType, Values = Is_Late (SUM), Order_ID (Count).'))
story.append(STEP(3, 'Compare the late rate for weekend vs weekday orders.'))
story.append(P(
    'Expected results: Weekend orders might have a slightly higher late rate (+1-3%) '
    'because warehouses and carriers may not operate at full capacity on weekends.'
))

# =============================================================================
# CHAPTER 6: PRODUCT PERFORMANCE IN EXCEL
# =============================================================================
story.extend(H1('6. Product Performance Analysis in Excel'))

story.extend(H2('6.1 Product Ratings vs Sales'))
story.append(P(
    '<b>Question:</b> Do higher-rated products sell more?', question_style))
story.append(P(
    'You need to group products by rating and compare the total revenue for each group. '
    'Use a Pivot Table with rating ranges.', answer_style))
story.append(STEP(1, 'PivotTable. Drag Product_Rating to Rows.'))
story.append(STEP(2, 'Values: Total_Amount (SUM = revenue), Order_ID (Count = orders), Net_Profit (SUM).'))
story.append(STEP(3, 'Right-click the rating values, choose "Group". Set: Starting at 3.0, Ending at 5.0, By 0.5.'))
story.append(STEP(4, 'Now you see 4 groups: 3.0-3.5, 3.5-4.0, 4.0-4.5, 4.5-5.0.'))
story.append(STEP(5, 'Compare the revenue per group. The 4.0+ groups should have much higher revenue.'))
story.append(STEP(6, 'Create a Bar chart to visualize this clearly.'))
story.append(P(
    'You can also calculate the average discount for each rating group. '
    'Use <b>=AVERAGEIF(Orders[Product_Rating],"&gt;=4",Orders[Discount_Amount])</b> '
    'to see if low-rated products need more discounting to sell.'
))

story.extend(H2('6.2 Brand Revenue Ranking'))
story.append(P(
    '<b>Question:</b> Which brands generate the most revenue?', question_style))
story.append(P(
    'The brand name is the first word in the Product_Name column (before the space). '
    'You need to extract it first.', answer_style))
story.append(STEP(1, 'Create a helper column "Brand": <b>=LEFT([@Product_Name],FIND(" ",[@Product_Name])-1)</b>.'))
story.append(STEP(2, 'PivotTable. Drag Brand to Rows.'))
story.append(STEP(3, 'Values: Total_Amount (SUM), Net_Profit (SUM), Order_ID (Count).'))
story.append(STEP(4, 'Sort by Total_Amount descending.'))
story.append(STEP(5, 'Add a calculated field for Profit Margin: <b>=Net_Profit / Total_Amount</b>.'))
story.append(CODE('Brand Extract:  =LEFT([@Product_Name],FIND(" ",[@Product_Name])-1)'))
story.append(P(
    'Expected results: Sony, Samsung, Apple, Nike, Dell will be among the top brands. '
    'Compare their profit margins to see which brand is most profitable.'
))

story.extend(H2('6.3 Return Analysis'))
story.append(P(
    '<b>Question:</b> Which categories have the highest return rate?', question_style))
story.append(P(
    'Return rate is the percentage of orders that were returned. You calculate '
    'it by dividing returned orders by total orders for each category.', answer_style))
story.append(STEP(1, 'PivotTable. Drag Product_Category to Rows.'))
story.append(STEP(2, 'Drag Order_Status to Columns.'))
story.append(STEP(3, 'Drag Order_ID to Values (Count).'))
story.append(STEP(4, 'This shows a matrix: categories as rows, statuses as columns, counts as values.'))
story.append(STEP(5, 'Look at the "Returned" column. Divide it by the total for each row to get return rate.'))
story.append(P(
    'For formulas, calculate the overall return rate:'))
story.append(CODE('Total Returns:  =COUNTIF(Orders[Order_Status],"Returned")'))
story.append(CODE('Total Orders:   =COUNTA(Orders[Order_ID])'))
story.append(CODE('Return Rate:    =Total_Returns / Total_Orders  (Format as %)'))

story.extend(H2('6.4 Return Reasons Breakdown'))
story.append(P(
    '<b>Question:</b> What are the most common reasons for returns?', question_style))
story.append(STEP(1, 'Filter data: Order_Status = "Returned".'))
story.append(STEP(2, 'PivotTable on filtered data. Drag Return_Reason to Rows, Order_ID (Count) to Values.'))
story.append(STEP(3, 'Sort by count descending.'))
story.append(STEP(4, 'Create a Pie Chart. You will see "Changed Mind" and "Defective" '
    'are the top reasons.'))
story.append(P(
    'You can also cross-analyze: Rows = Product_Category, Columns = Return_Reason. '
    'This shows which categories have which return problems. For example, Electronics '
    'might have more "Defective" returns, while Books might have more "Changed Mind" returns.'
))

# =============================================================================
# CHAPTER 7: PRICING ANALYSIS IN EXCEL
# =============================================================================
story.extend(H1('7. Pricing Strategy Analysis in Excel'))

story.extend(H2('7.1 Price vs Competitor Price'))
story.append(P(
    '<b>Question:</b> How does our price compare to competitors?', question_style))
story.append(P(
    'You have both Unit_Price and Competitor_Price_At_Order. The difference shows '
    'if you are cheaper or more expensive than competitors.', answer_style))
story.append(STEP(1, 'Create a helper column "Price_Diff": <b>=[@Unit_Price]-[@[Competitor_Price_At_Order]]</b>.'))
story.append(STEP(2, 'Create "Price_Status": <b>=IF([@Price_Diff]&lt;0,"Cheaper",IF([@Price_Diff]=0,"Same","More Expensive"))</b>.'))
story.append(STEP(3, 'PivotTable. Drag Price_Status to Rows, Order_ID (Count) and Total_Amount (SUM) to Values.'))
story.append(STEP(4, 'You can also group by Product_Category: Rows = Product_Category, Columns = Price_Status.'))
story.append(CODE('Price Difference:  =[@Unit_Price] - [@[Competitor_Price_At_Order]]'))
story.append(CODE('Average Diff:      =AVERAGE(Orders[Price_Diff])'))
story.append(CODE('                  Negative = we are cheaper, Positive = we are more expensive'))
story.append(P(
    'Use conditional formatting on Price_Diff: Green for negative (cheaper), Red for '
    'positive (more expensive). Select the column > Home > Conditional Formatting > '
    'Color Scales > Red-Yellow-Green. Invert the order so green = lowest prices.'
))

story.extend(H2('7.2 Buy Box Analysis'))
story.append(P(
    '<b>Question:</b> Does Buy Box eligibility affect sales?', question_style))
story.append(STEP(1, 'PivotTable. Drag Buy_Box_Eligible to Rows.'))
story.append(STEP(2, 'Values: Order_ID (Count), Total_Amount (SUM), Total_Amount (AVERAGE).'))
story.append(STEP(3, 'Compare "Yes" vs "No" rows. "Yes" should have much higher order count and revenue.'))
story.append(P(
    'For formulas:'))
story.append(CODE('Buy Box Orders:   =COUNTIF(Orders[Buy_Box_Eligible],"Yes")'))
story.append(CODE('No Buy Box:       =COUNTIF(Orders[Buy_Box_Eligible],"No")'))
story.append(CODE('Buy Box Share:    =Buy_Box_Orders / (Buy_Box_Orders + No_Buy_Box)'))

story.extend(H2('7.3 Profit Margin by Category'))
story.append(P(
    '<b>Question:</b> Which category has the best profit margin?', question_style))
story.append(STEP(1, 'Create helper "Gross_Margin": <b>=([@Unit_Price]-[@COGS_Price])/@Unit_Price</b>.'))
story.append(STEP(2, 'PivotTable. Drag Product_Category to Rows.'))
story.append(STEP(3, 'Values: Gross_Margin (AVERAGE), Net_Profit (SUM), Total_Amount (SUM).'))
story.append(STEP(4, 'Sort by Gross_Margin descending.'))
story.append(CODE('Gross Margin:     =([@Unit_Price] - [@COGS_Price]) / [@Unit_Price]'))
story.append(CODE('                  Format as %. Books usually have highest margin (50-70%)'))

# =============================================================================
# CHAPTER 8: RISK AND FRAUD IN EXCEL
# =============================================================================
story.extend(H1('8. Risk and Fraud Analysis in Excel'))

story.extend(H2('8.1 Fraud Score Distribution'))
story.append(P(
    '<b>Question:</b> What is the average fraud score and distribution?', question_style))
story.append(STEP(1, 'Basic statistics with formulas:'))
story.append(CODE('Average Fraud Score:  =AVERAGE(Orders[Fraud_Score])'))
story.append(CODE('Max Fraud Score:      =MAX(Orders[Fraud_Score])'))
story.append(CODE('95th Percentile:      =PERCENTILE.INC(Orders[Fraud_Score],0.95)'))
story.append(STEP(2, 'Create a Histogram: Select the Fraud_Score column. Insert > Statistical Chart > Histogram. '
    'This shows the distribution of fraud scores.'))
story.append(STEP(3, 'Use Conditional Formatting to highlight high-risk orders: '
    'Select the Fraud_Score column > Conditional Formatting > Highlight Cell Rules > '
    'Greater Than > type 0.5 > choose Red fill.'))
story.append(P(
    'This highlights all orders with fraud score above 0.5 in red, making it '
    'easy for the fraud team to review them manually.'
))

story.extend(H2('8.2 High-Risk Order Analysis'))
story.append(P(
    '<b>Question:</b> What are the characteristics of high-risk orders?', question_style))
story.append(P(
    'Filter the data to show only high-risk orders and then compare their characteristics '
    'with normal orders.', answer_style))
story.append(STEP(1, 'Filter: Fraud_Score > 0.5.'))
story.append(STEP(2, 'On the filtered data, calculate averages:'))
story.append(CODE('High-Risk Avg Value:  =AVERAGE(Orders[Total_Amount])'))
story.append(CODE('High-Risk Gift Card:  =COUNTIF(Orders[Payment_Method],"Gift Card") / COUNTA(Orders[Order_ID])'))
story.append(STEP(3, 'Compare with the overall averages (remove filter):'))
story.append(CODE('Overall Avg Value:    =AVERAGE(Orders[Total_Amount])'))
story.append(STEP(4, 'Create a comparison Pivot Table:'))
story.append(P(
    'Create a helper column "Risk_Level": <b>=IF([@Fraud_Score]&gt;=0.5,"High",'
    'IF([@Fraud_Score]&gt;=0.3,"Medium","Low"))</b>.'))
story.append(P(
    'PivotTable: Rows = Risk_Level. Values: Total_Amount (AVERAGE), Order_ID (Count), '
    'Is_Prime_Member (AVERAGE), Customer_Lifetime_Value (AVERAGE). '
    'Compare the characteristics of each risk level.'
))

story.extend(H2('8.3 Fraud by Payment Method'))
story.append(P(
    '<b>Question:</b> Which payment methods have the highest fraud scores?', question_style))
story.append(STEP(1, 'PivotTable. Drag Payment_Method to Rows.'))
story.append(STEP(2, 'Values: Fraud_Score (AVERAGE), Total_Amount (SUM), Order_ID (Count).'))
story.append(STEP(3, 'Sort by Fraud_Score (AVERAGE) descending.'))
story.append(P(
    'Expected: Gift Card payments will have the highest average fraud score. '
    'Credit Card and Amazon Pay will have lower scores.'
))

# =============================================================================
# CHAPTER 9: ALL KPIs IN EXCEL
# =============================================================================
story.extend(H1('9. Building a KPI Dashboard in Excel'))

story.append(P(
    'A KPI dashboard shows the most important metrics on one page. This is what '
    'managers and executives want to see. Below is a complete guide to building '
    'a dashboard with all 14 KPIs from the dataset.'
))

story.extend(H2('9.1 KPI Formulas'))

kpi_data = [
    ['Total Revenue', '=SUM(Orders[Total_Amount])', 'Format as Currency ($)'],
    ['Net Profit', '=SUM(Orders[Net_Profit])', 'Format as Currency ($)'],
    ['Profit Margin', '=Net_Profit / Total_Revenue', 'Format as Percentage (%)'],
    ['Average Order Value', '=AVERAGE(Orders[Total_Amount])', 'Format as Currency ($)'],
    ['Total Orders', '=COUNTA(Orders[Order_ID])', 'Format as Number'],
    ['Unique Customers', '=SUMPRODUCT(1/COUNTIF(Orders[Customer_ID],Orders[Customer_ID]))', 'Format as Number'],
    ['Orders per Customer', '=Total_Orders / Unique_Customers', 'Format as 2 decimal places'],
    ['Average CLV', '=AVERAGE(Orders[Customer_Lifetime_Value])', 'Format as Currency ($)'],
    ['Prime Rate', '=COUNTIF(Orders[Is_Prime_Member],1)/COUNTA(Orders[Order_ID])', 'Format as Percentage (%)'],
    ['Delivery On-Time Rate', '=1-(SUM(Orders[Is_Late])/COUNTIF(Orders[Order_Status],"Delivered"))', 'Format as Percentage (%)'],
    ['Return Rate', '=COUNTIF(Orders[Order_Status],"Returned")/COUNTA(Orders[Order_ID])', 'Format as Percentage (%)'],
    ['Cancellation Rate', '=COUNTIF(Orders[Order_Status],"Cancelled")/COUNTA(Orders[Order_ID])', 'Format as Percentage (%)'],
    ['Average Fraud Score', '=AVERAGE(Orders[Fraud_Score])', 'Format as 2 decimal places'],
    ['Cart Abandon Rate', '=COUNTIF(Orders[Cart_Abandonment_History],"&gt;0")/COUNTA(Orders[Order_ID])', 'Format as Percentage (%)'],
]

story.append(Spacer(1, 10))
t = make_table(['KPI', 'Excel Formula', 'Format'], kpi_data, [0.22, 0.55, 0.23])
story.append(t)
story.append(P('<b>Table 2.</b> All 14 KPIs with Excel Formulas', caption_style))
story.append(Spacer(1, 12))

story.append(P(
    '<b>Important Note on Unique Customers:</b> The formula <b>=SUMPRODUCT(1/COUNTIF(...))</b> '
    'is a classic Excel trick to count unique values. However, with 1 million rows, this formula '
    'is VERY slow (it may take 1-2 minutes). A faster alternative is to copy the Customer_ID '
    'column to a new sheet, use Data > Remove Duplicates, and then use <b>=COUNTA()</b> '
    'on the deduplicated list.'
))

story.extend(H2('9.2 Dashboard Layout Tips'))
story.append(P(
    'Here is how to organize your KPI dashboard in Excel:', body_left))
story.append(STEP(1, '<b>Row 1-2:</b> Title "Amazon Analytics Dashboard" in large font.'))
story.append(STEP(2, '<b>Row 4:</b> Revenue, Profit, Profit Margin - three cells side by side.'))
story.append(STEP(3, '<b>Row 5:</b> AOV, Total Orders, Unique Customers - three cells side by side.'))
story.append(STEP(4, '<b>Row 6:</b> Prime Rate, Return Rate, On-Time Rate - three cells side by side.'))
story.append(STEP(5, '<b>Row 8-10:</b> Revenue by Month Line Chart (from PivotTable in Chapter 2.3).'))
story.append(STEP(6, '<b>Row 8-10 (right):</b> Revenue by Category Bar Chart (from PivotTable in Chapter 2.4).'))
story.append(STEP(7, '<b>Row 11-13:</b> Traffic Source Pie Chart (from PivotTable in Chapter 4.1).'))
story.append(STEP(8, '<b>Row 11-13 (right):</b> Order Status Pie Chart (PivotTable: Order_Status vs count).'))
story.append(P(
    '<b>Tip:</b> Use large font sizes (18-24pt) for KPI numbers so they are easy to read. '
    'Use cell borders and background colors to create "cards" around each KPI. '
    'Go to Home > Cell Styles to apply professional-looking number formats.'
))

# =============================================================================
# CHAPTER 10: ADVANCED EXCEL TECHNIQUES
# =============================================================================
story.extend(H1('10. Advanced Excel Techniques'))

story.extend(H2('10.1 SUMIFS for Multi-Condition Analysis'))
story.append(P(
    'SUMIF works with one condition. SUMIFS works with multiple conditions. '
    'This is one of the most powerful Excel functions for business analysis.', body_left))
story.append(CODE('Revenue from Electronics in California:'))
story.append(CODE('=SUMIFS(Orders[Total_Amount],Orders[Product_Category],"Electronics",Orders[Customer_State],"CA")'))
story.append(Spacer(1, 6))
story.append(CODE('Profit from Prime members who use Credit Card:'))
story.append(CODE('=SUMIFS(Orders[Net_Profit],Orders[Is_Prime_Member],1,Orders[Payment_Method],"Credit Card")'))
story.append(Spacer(1, 6))
story.append(CODE('Count of high-risk orders in Electronics:'))
story.append(CODE('=COUNTIFS(Orders[Fraud_Score],"&gt;0.5",Orders[Product_Category],"Electronics")'))
story.append(P(
    'You can add up to 127 condition pairs in a single SUMIFS formula. '
    'This makes it possible to answer very specific business questions without Pivot Tables.'
))

story.extend(H2('10.2 VLOOKUP for Product Lookup'))
story.append(P(
    'VLOOKUP lets you find information about a specific product, customer, or order. '
    'For example, if you want to see all details for a specific ASIN or Order_ID.', body_left))
story.append(CODE('Find the product name for ASIN B01234567:'))
story.append(CODE('=VLOOKUP("B01234567",Orders[[ASIN]:[Product_Name]],2,FALSE)'))
story.append(Spacer(1, 6))
story.append(P(
    'In newer Excel versions (365, 2021), you can use XLOOKUP which is easier:'))
story.append(CODE('=XLOOKUP("B01234567",Orders[ASIN],Orders[Product_Name])'))
story.append(P(
    'You can also use INDEX-MATCH which is more flexible:'))
story.append(CODE('=INDEX(Orders[Product_Name],MATCH("B01234567",Orders[ASIN],0))'))

story.extend(H2('10.3 Conditional Formatting for Insights'))
story.append(P(
    'Conditional Formatting automatically colors cells based on rules. '
    'This is very useful for quick visual analysis.', body_left))
story.append(P('<b>Fraud Detection:</b> Select Fraud_Score column. Conditional Formatting > '
    'Color Scale > Red-Yellow-Green. High scores will be red, low scores green.', body_left))
story.append(P('<b>Top Sellers:</b> Select Total_Amount. Conditional Formatting > Top/Bottom Rules > '
    'Top 10%. This highlights the highest-value orders.', body_left))
story.append(P('<b>Late Deliveries:</b> Select the "Is_Late" column (from Chapter 5.1). '
    'Conditional Formatting > Highlight Cell Rules > Equal To > 1 > Red fill.', body_left))
story.append(P('<b>Low Ratings:</b> Select Product_Rating. Conditional Formatting > Highlight Cell Rules > '
    'Less Than > 3.5 > Yellow fill. This shows products with poor ratings.', body_left))

story.extend(H2('10.4 IF Formulas for Business Rules'))
story.append(P(
    'IF formulas help you create business rules and classifications.', body_left))
story.append(CODE('Risk Classification:'))
story.append(CODE('=IF([@Fraud_Score]&gt;=0.5,"HIGH RISK",IF([@Fraud_Score]&gt;=0.3,"MEDIUM","LOW"))'))
story.append(Spacer(1, 6))
story.append(CODE('Customer Segment:'))
story.append(CODE('=IF([@[Customer_Lifetime_Value]]&gt;500,"VIP",IF([@[Customer_Lifetime_Value]]&gt;200,"Regular","New"))'))
story.append(Spacer(1, 6))
story.append(CODE('Delivery Performance:'))
story.append(CODE('=IF([@[Actual_Delivery_Days]]&gt;[@[Delivery_Days_Estimated]],"LATE",IF([@[Actual_Delivery_Days]]=[@[Delivery_Days_Estimated]],"ON TIME","EARLY"))'))
story.append(Spacer(1, 6))
story.append(CODE('Price Position:'))
story.append(CODE('=IF([@[Unit_Price]]&lt;[@[Competitor_Price_At_Order]],"Below Market","Above Market"))'))

story.extend(H2('10.5 Power Query for Data Cleaning'))
story.append(P(
    'Power Query is built into Excel and is excellent for cleaning and transforming data. '
    'You access it from the Data tab when you load the CSV.', body_left))
story.append(STEP(1, 'When you load the CSV, Excel opens the Power Query Editor.'))
story.append(STEP(2, 'Here you can: Remove columns you do not need (reduces file size), '
    'Filter rows (e.g., only Delivered orders), Split columns (extract brand from product name), '
    'Change data types (text to date, text to number), Pivot and Unpivot columns, Merge queries (join tables).'))
story.append(STEP(3, 'After cleaning, click "Close and Load" to put the clean data into your worksheet.'))
story.append(P(
    '<b>Tip:</b> Power Query remembers your steps. If the source CSV changes, you can '
    'just click "Refresh All" (Data > Refresh All) and Excel will repeat all cleaning steps. '
    'This saves a lot of time when working with updated data.'
))

# =============================================================================
# CHAPTER 11: PRACTICAL EXCEL WORKFLOWS
# =============================================================================
story.extend(H1('11. Practical Excel Workflows'))

story.extend(H2('11.1 Workflow: Monthly Revenue Report'))
story.append(P(
    '<b>Goal:</b> Create a monthly revenue report that the finance team can use.', body_left))
story.append(STEP(1, 'Create a helper column "Month" with <b>=TEXT([@Order_Date],"YYYY-MM")</b>.'))
story.append(STEP(2, 'PivotTable. Rows = Month, Values = Total_Amount (SUM), Net_Profit (SUM), Order_ID (Count).'))
story.append(STEP(3, 'Add calculated field AOV: Total_Amount / Order_ID_count.'))
story.append(STEP(4, 'Add calculated field Margin: Net_Profit / Total_Amount.'))
story.append(STEP(5, 'Insert a Line Chart for revenue trend and a Column Chart for order count.'))
story.append(STEP(6, 'Copy the pivot table results and paste as values into a report sheet.'))
story.append(STEP(7, 'Add month-over-month growth: <b>=(B3-B2)/B2</b> (current month minus previous month, divided by previous).'))

story.extend(H2('11.2 Workflow: Category Performance Report'))
story.append(P(
    '<b>Goal:</b> Compare all 6 product categories on key metrics.', body_left))
story.append(STEP(1, 'PivotTable. Rows = Product_Category.'))
story.append(STEP(2, 'Values: Total_Amount (SUM), Net_Profit (SUM), Order_ID (Count), '
    'Product_Rating (AVERAGE), Return_Probability_Score (AVERAGE), Fraud_Score (AVERAGE).'))
story.append(STEP(3, 'Add calculated fields: AOV, Profit Margin, Return Rate.'))
story.append(STEP(4, 'Sort by Total_Amount descending.'))
story.append(STEP(5, 'Format: Currency for money, Percentage for rates, 1 decimal for ratings.'))
story.append(STEP(6, 'Use Conditional Formatting to highlight the best and worst values in each column.'))

story.extend(H2('11.3 Workflow: Customer Health Check'))
story.append(P(
    '<b>Goal:</b> Identify VIP customers, at-risk customers, and new customers.', body_left))
story.append(STEP(1, 'Create a separate pivot: Rows = Customer_ID.'))
story.append(STEP(2, 'Values: Order_ID (Count), Total_Amount (SUM), Customer_Lifetime_Value (MAX).'))
story.append(STEP(3, 'Create a new column "Segment":'))
story.append(CODE('=IF([@[Count of Order_ID]]&gt;=10,"VIP",IF([@[Count of Order_ID]]&gt;=5,"Regular",IF([@[Count of Order_ID]]&gt;=2,"Occasional","New")))'  ))
story.append(STEP(4, 'Create a PivotTable on the segment. Rows = Segment. Values: Count, CLV (AVERAGE), Total_Amount (SUM).'))
story.append(STEP(5, 'This shows how many customers are in each segment and how much they are worth.'))

story.extend(H2('11.4 Workflow: Marketing ROI Summary'))
story.append(P(
    '<b>Goal:</b> Show which marketing channels and campaigns are most profitable.', body_left))
story.append(STEP(1, 'PivotTable. Rows = Traffic_Source.'))
story.append(STEP(2, 'Values: Order_ID (Count), Total_Amount (SUM), Net_Profit (SUM), '
    'Total_Amount (AVERAGE = AOV), Discount_Amount (SUM).'))
story.append(STEP(3, 'Add calculated fields: Profit Margin, Revenue per Order, Cost per Order (Discount as proxy).'))
story.append(STEP(4, 'For campaigns: Filter Ad_Campaign_ID to exclude blanks, then repeat the pivot.'))
story.append(STEP(5, 'Create a stacked Bar Chart: Traffic_Source vs Revenue (showing profit as a second series).'))

# =============================================================================
# CHAPTER 12: EXCEL FORMULA REFERENCE
# =============================================================================
story.extend(H1('12. Quick Excel Formula Reference'))

story.append(P(
    'This chapter provides a quick reference of all the most useful Excel formulas '
    'for analyzing the Amazon dataset. You can copy and paste these formulas directly '
    'into your Excel file.'
))

formula_data = [
    ['SUM', '=SUM(column)', 'Add all values in a column'],
    ['AVERAGE', '=AVERAGE(column)', 'Calculate the mean'],
    ['COUNTA', '=COUNTA(column)', 'Count non-empty cells'],
    ['COUNTIF', '=COUNTIF(range,"value")', 'Count cells matching a condition'],
    ['COUNTIFS', '=COUNTIFS(range1,"val1",range2,"val2")', 'Count with multiple conditions'],
    ['SUMIF', '=SUMIF(range,"value",sum_range)', 'Sum values matching a condition'],
    ['SUMIFS', '=SUMIFS(sum_range,range1,"val1",range2,"val2")', 'Sum with multiple conditions'],
    ['AVERAGEIF', '=AVERAGEIF(range,"value",avg_range)', 'Average matching a condition'],
    ['MEDIAN', '=MEDIAN(column)', 'Middle value (not affected by outliers)'],
    ['PERCENTILE', '=PERCENTILE.INC(column,0.9)', 'Value at 90th percentile'],
    ['MIN / MAX', '=MIN(column) / =MAX(column)', 'Smallest / largest value'],
    ['IF', '=IF(condition,"yes","no")', 'Return different values based on condition'],
    ['TEXT', '=TEXT(date,"YYYY-MM")', 'Convert date to text in a format'],
    ['LEFT', '=LEFT(text,n)', 'Extract first n characters'],
    ['FIND', '=FIND("search",text)', 'Find position of text within text'],
    ['HOUR', '=HOUR(datetime)', 'Extract hour from date/time'],
    ['WEEKDAY', '=WEEKDAY(date,2)', 'Day of week (1=Monday, 7=Sunday)'],
    ['VLOOKUP', '=VLOOKUP(value,table,col,FALSE)', 'Look up a value in a table'],
    ['XLOOKUP', '=XLOOKUP(value,lookup,return)', 'Modern lookup (Excel 365)'],
    ['SUMPRODUCT', '=SUMPRODUCT(1/COUNTIF(range,range))', 'Count unique values'],
]

story.append(Spacer(1, 10))
t = make_table(['Function', 'Example', 'Description'], formula_data, [0.15, 0.50, 0.35])
story.append(t)
story.append(P('<b>Table 3.</b> Excel Formula Quick Reference', caption_style))
story.append(Spacer(1, 12))

story.append(P(
    'These 20 formulas cover 95% of what you need to analyze the Amazon dataset in Excel. '
    'Combine them with Pivot Tables and Charts, and you can answer every business question '
    'in this guide. The key to becoming good at Excel analysis is practice: try each formula, '
    'experiment with different conditions, and build your own dashboards. Every time you answer '
    'a business question, you are building skills that real companies value highly.'
))

# =============================================================================
# BUILD
# =============================================================================
doc.multiBuild(story)
print(f"PDF generated: {OUTPUT}")
print(f"Size: {os.path.getsize(OUTPUT) / 1024:.1f} KB")
