#!/usr/bin/env python3
"""
Generate: Amazon_Analytics_Business_Intelligence_Guide.pdf
A comprehensive guide explaining what business questions can be answered
with the 1M-row Amazon analytics CSV dataset.
Written in A1-level English for accessibility.
"""

import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch, cm
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.lib import colors
from reportlab.platypus import (
    Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, Image
)
from reportlab.platypus.tableofcontents import TableOfContents
from reportlab.platypus import SimpleDocTemplate
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
import hashlib

# =============================================================================
# PALETTE (auto-generated)
# =============================================================================
ACCENT       = colors.HexColor('#c6243f')
TEXT_PRIMARY  = colors.HexColor('#242320')
TEXT_MUTED    = colors.HexColor('#8f8c83')
BG_SURFACE   = colors.HexColor('#dedcd6')
BG_PAGE      = colors.HexColor('#f3f2f0')

TABLE_HEADER_COLOR = ACCENT
TABLE_HEADER_TEXT  = colors.white
TABLE_ROW_EVEN     = colors.white
TABLE_ROW_ODD      = BG_SURFACE

# =============================================================================
# FONT REGISTRATION
# =============================================================================
pdfmetrics.registerFont(TTFont('Times New Roman', '/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf'))
pdfmetrics.registerFont(TTFont('Calibri', '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf'))
pdfmetrics.registerFont(TTFont('DejaVuSans', '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'))

registerFontFamily('Times New Roman', normal='Times New Roman', bold='Times New Roman')
registerFontFamily('Calibri', normal='Calibri', bold='Calibri')
registerFontFamily('DejaVuSans', normal='DejaVuSans', bold='DejaVuSans')

# =============================================================================
# STYLES
# =============================================================================
styles = getSampleStyleSheet()

# Cover styles
cover_title = ParagraphStyle(
    name='CoverTitle', fontName='Times New Roman', fontSize=36,
    leading=44, alignment=TA_LEFT, textColor=TEXT_PRIMARY, spaceAfter=12
)
cover_subtitle = ParagraphStyle(
    name='CoverSubtitle', fontName='Times New Roman', fontSize=16,
    leading=22, alignment=TA_LEFT, textColor=TEXT_MUTED, spaceAfter=8
)
cover_meta = ParagraphStyle(
    name='CoverMeta', fontName='Times New Roman', fontSize=12,
    leading=16, alignment=TA_LEFT, textColor=TEXT_MUTED
)

# Body styles
h1_style = ParagraphStyle(
    name='H1', fontName='Times New Roman', fontSize=20,
    leading=26, alignment=TA_LEFT, textColor=TEXT_PRIMARY,
    spaceBefore=18, spaceAfter=10
)
h2_style = ParagraphStyle(
    name='H2', fontName='Times New Roman', fontSize=15,
    leading=20, alignment=TA_LEFT, textColor=ACCENT,
    spaceBefore=14, spaceAfter=8
)
h3_style = ParagraphStyle(
    name='H3', fontName='Times New Roman', fontSize=12,
    leading=16, alignment=TA_LEFT, textColor=TEXT_PRIMARY,
    spaceBefore=10, spaceAfter=6
)
body_style = ParagraphStyle(
    name='Body', fontName='Times New Roman', fontSize=11,
    leading=17, alignment=TA_JUSTIFY, textColor=TEXT_PRIMARY,
    spaceBefore=0, spaceAfter=6
)
body_left = ParagraphStyle(
    name='BodyLeft', fontName='Times New Roman', fontSize=11,
    leading=17, alignment=TA_LEFT, textColor=TEXT_PRIMARY,
    spaceBefore=0, spaceAfter=6
)
bullet_style = ParagraphStyle(
    name='Bullet', fontName='Times New Roman', fontSize=11,
    leading=17, alignment=TA_LEFT, textColor=TEXT_PRIMARY,
    leftIndent=24, bulletIndent=12, spaceBefore=2, spaceAfter=4
)
question_style = ParagraphStyle(
    name='Question', fontName='Times New Roman', fontSize=11,
    leading=17, alignment=TA_LEFT, textColor=ACCENT,
    leftIndent=18, bulletIndent=6, spaceBefore=4, spaceAfter=2
)
answer_style = ParagraphStyle(
    name='Answer', fontName='Times New Roman', fontSize=11,
    leading=17, alignment=TA_JUSTIFY, textColor=TEXT_PRIMARY,
    leftIndent=18, spaceBefore=2, spaceAfter=8
)
caption_style = ParagraphStyle(
    name='Caption', fontName='Times New Roman', fontSize=10,
    leading=14, alignment=TA_CENTER, textColor=TEXT_MUTED,
    spaceBefore=3, spaceAfter=6
)
callout_style = ParagraphStyle(
    name='Callout', fontName='Times New Roman', fontSize=11,
    leading=17, alignment=TA_LEFT, textColor=ACCENT,
    leftIndent=12, rightIndent=12, spaceBefore=6, spaceAfter=6,
    borderWidth=0, borderPadding=6
)

# Table styles
header_cell_style = ParagraphStyle(
    name='HeaderCell', fontName='Times New Roman', fontSize=10,
    leading=14, alignment=TA_CENTER, textColor=colors.white
)
cell_style = ParagraphStyle(
    name='Cell', fontName='Times New Roman', fontSize=10,
    leading=14, alignment=TA_LEFT, textColor=TEXT_PRIMARY
)
cell_center = ParagraphStyle(
    name='CellCenter', fontName='Times New Roman', fontSize=10,
    leading=14, alignment=TA_CENTER, textColor=TEXT_PRIMARY
)

# =============================================================================
# DOCUMENT TEMPLATE WITH TOC
# =============================================================================
class TocDocTemplate(SimpleDocTemplate):
    def afterFlowable(self, flowable):
        if hasattr(flowable, 'bookmark_name'):
            level = getattr(flowable, 'bookmark_level', 0)
            text = getattr(flowable, 'bookmark_text', '')
            key = getattr(flowable, 'bookmark_key', '')
            self.notify('TOCEntry', (level, text, self.page, key))

# Page dimensions
PAGE_W, PAGE_H = A4
LEFT_M = 1.0 * inch
RIGHT_M = 1.0 * inch
TOP_M = 0.8 * inch
BOTTOM_M = 0.8 * inch
AVAILABLE_W = PAGE_W - LEFT_M - RIGHT_M
H1_ORPHAN = (PAGE_H - TOP_M - BOTTOM_M) * 0.15

OUTPUT_FILE = "Amazon_Analytics_Business_Intelligence_Guide.pdf"

doc = TocDocTemplate(
    OUTPUT_FILE, pagesize=A4,
    leftMargin=LEFT_M, rightMargin=RIGHT_M,
    topMargin=TOP_M, bottomMargin=BOTTOM_M,
    title="Amazon Analytics Business Intelligence Guide",
    author="Z.ai",
    subject="Business Intelligence Guide for Amazon Analytics 1M Row Dataset"
)

# =============================================================================
# HELPERS
# =============================================================================
def add_heading(text, style, level=0):
    key = 'h_%s' % hashlib.md5(text.encode()).hexdigest()[:8]
    p = Paragraph('<a name="%s"/>%s' % (key, text), style)
    p.bookmark_name = text
    p.bookmark_level = level
    p.bookmark_text = text
    p.bookmark_key = key
    return p

def safe_keep(elements):
    from reportlab.platypus import KeepTogether
    total = 0
    for e in elements:
        w, h = e.wrap(AVAILABLE_W, PAGE_H)
        total += h
    if total <= PAGE_H * 0.4:
        return [KeepTogether(elements)]
    elif len(elements) >= 2:
        return [KeepTogether(elements[:2])] + list(elements[2:])
    return list(elements)

def P(text, style=body_style):
    return Paragraph(text, style)

def H1(text):
    return [Spacer(1, 6), CondPageBreak(H1_ORPHAN), add_heading('<b>%s</b>' % text, h1_style, 0)]

def H2(text):
    return [add_heading('<b>%s</b>' % text, h2_style, 1)]

def H3(text):
    return [add_heading('<b>%s</b>' % text, h3_style, 2)]

from reportlab.platypus import CondPageBreak

def make_table(headers, rows, col_ratios=None):
    """Create a styled table with Paragraph-wrapped cells."""
    if col_ratios is None:
        n = len(headers)
        col_ratios = [1.0/n] * n
    col_widths = [r * AVAILABLE_W for r in col_ratios]

    data = [[Paragraph('<b>%s</b>' % h, header_cell_style) for h in headers]]
    for row in rows:
        data.append([Paragraph(str(c), cell_style) for c in row])

    t = Table(data, colWidths=col_widths, hAlign='CENTER')
    style_cmds = [
        ('BACKGROUND', (0, 0), (-1, 0), TABLE_HEADER_COLOR),
        ('TEXTCOLOR', (0, 0), (-1, 0), TABLE_HEADER_TEXT),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('GRID', (0, 0), (-1, -1), 0.5, TEXT_MUTED),
    ]
    for i in range(1, len(data)):
        bg = TABLE_ROW_EVEN if i % 2 == 1 else TABLE_ROW_ODD
        style_cmds.append(('BACKGROUND', (0, i), (-1, i), bg))
    t.setStyle(TableStyle(style_cmds))
    return t

def qa_block(question_text, answer_text):
    """Create a Q&A block."""
    return [
        P('<b>Q: %s</b>' % question_text, question_style),
        P(answer_text, answer_style)
    ]

# =============================================================================
# BUILD STORY
# =============================================================================
story = []

# ── COVER ──
story.append(Spacer(1, 160))
story.append(P('<b>Amazon Analytics</b>', cover_title))
story.append(P('<b>Business Intelligence Guide</b>', cover_title))
story.append(Spacer(1, 20))
story.append(P('A Complete Guide to Business Questions<br/>and Analysis with 1 Million Rows of E-Commerce Data', cover_subtitle))
story.append(Spacer(1, 40))
story.append(P('Dataset: 1,000,000 Orders | 48 Columns | 200,000 Customers | 10,000 Products', cover_meta))
story.append(Spacer(1, 8))
story.append(P('Written in Simple English (A1 Level)', cover_meta))
story.append(Spacer(1, 8))
story.append(P('May 2025', cover_meta))
story.append(PageBreak())

# ── TABLE OF CONTENTS ──
toc = TableOfContents()
toc.levelStyles = [
    ParagraphStyle(name='TOC1', fontSize=13, leftIndent=20, fontName='Times New Roman', leading=20, spaceBefore=6, spaceAfter=4),
    ParagraphStyle(name='TOC2', fontSize=11, leftIndent=40, fontName='Times New Roman', leading=18, spaceBefore=2, spaceAfter=2),
]
story.append(P('<b>Table of Contents</b>', h1_style))
story.append(Spacer(1, 12))
story.append(toc)
story.append(PageBreak())

# =============================================================================
# CHAPTER 1: WHAT DOES 1 MILLION ROWS MEAN?
# =============================================================================
story.extend(H1('1. What Does 1 Million Rows Mean for a Business?'))

story.extend(H2('1.1 Understanding the Size'))
story.append(P(
    'When we say "1 million rows," it means 1,000,000 individual records. '
    'Each row is one customer order. Think about it this way: if a store '
    'gets 2,740 orders every single day for one full year, that is about '
    '1 million orders. This is a lot of data. Real companies like Amazon '
    'handle billions of orders per year. But for learning and practice, '
    '1 million rows is a very good size. It is big enough to show real '
    'patterns and trends, but small enough to work with on a normal computer.'
))
story.append(P(
    'In the real world, data analysts and business intelligence teams '
    'work with datasets of all sizes. Sometimes they look at a few thousand '
    'rows to answer a quick question. Sometimes they use millions of rows '
    'to find small but important patterns. With 1 million rows, you can '
    'practice both kinds of work. You can find big trends (like "which '
    'month had the most sales?") and also small patterns (like "do Prime '
    'members buy more expensive items on weekends?").'
))

story.extend(H2('1.2 What Is Inside This Dataset?'))
story.append(P(
    'This dataset has 48 columns (fields) of information for each order. '
    'Here is a summary of the key numbers:'
))

story.append(Spacer(1, 10))
summary_data = [
    ['Number of Orders', '1,000,000'],
    ['Number of Customers', '200,000'],
    ['Number of Products', '10,000'],
    ['Number of Columns', '48'],
    ['Product Categories', '6 (Electronics, Computers, Smart Home, Home and Kitchen, Sports, Books)'],
    ['Number of Brands', '42'],
    ['Time Period', 'Full year 2025'],
    ['Geography', '30 US States, 3 Regions (West, Central, East)'],
]
t = make_table(['Item', 'Value'], summary_data, [0.40, 0.60])
story.append(t)
story.append(P('<b>Table 1.</b> Dataset Summary', caption_style))
story.append(Spacer(1, 12))

story.extend(H2('1.3 Why 1 Million Rows Is Powerful'))
story.append(P(
    'With 1 million rows, you can do many types of analysis that are not '
    'possible with smaller datasets. First, you can find <b>statistical significance</b>. '
    'This means you can trust your results more. For example, if you find '
    'that customers in California spend 5% more than customers in Texas, '
    'with 1 million rows you can be sure this difference is real and not '
    'just random luck. With only 100 rows, you could not trust this result.'
))
story.append(P(
    'Second, you can find <b>segment-level patterns</b>. This means you can '
    'look at smaller groups inside the data. For example, you can look at '
    'only "Prime members who use mobile app and buy electronics." Even this '
    'small group has thousands of rows, which is enough for good analysis. '
    'In real business, these niche segments are where companies make the most '
    'profit because they can target these groups with special offers.'
))
story.append(P(
    'Third, you can practice <b>time-series analysis</b>. This means looking '
    'at how things change over time. With a full year of data, you can see '
    'weekly patterns, monthly trends, and seasonal effects. For example, '
    'you can see how sales change from Monday to Sunday, or how November '
    '(Black Friday) compares to January. These time-based patterns are very '
    'important for business planning, inventory management, and marketing.'
))

story.extend(H2('1.4 The Business Perspective'))
story.append(P(
    'From a business point of view, 1 million orders represents a medium-sized '
    'e-commerce operation. In 2024, Amazon had over 7 billion orders worldwide. '
    'But many smaller companies and third-party sellers on Amazon handle between '
    '100,000 and 5 million orders per year. So this dataset is very realistic '
    'for a medium-sized seller or a regional e-commerce company.'
))
story.append(P(
    'The total revenue in this dataset (if we estimate an average order of '
    '$75) would be about $75 million per year. This is the kind of revenue '
    'that a successful mid-sized online business makes. The decisions that a '
    'business analyst makes with this data have real impact: a 1% improvement '
    'in conversion rate could mean $750,000 more in revenue. A 5% reduction '
    'in return rate could save millions in logistics costs. This is why '
    'business intelligence is so valuable.'
))

# =============================================================================
# CHAPTER 2: THE 48 COLUMNS EXPLAINED
# =============================================================================
story.extend(H1('2. The 48 Columns Explained'))

story.append(P(
    'Each row in the dataset has 48 pieces of information (columns). '
    'These columns are grouped into logical categories. Understanding what '
    'each column means is the first step to doing good analysis. Below, '
    'we explain each group of columns in simple terms.'
))

story.extend(H2('2.1 Order and Transaction Data'))
story.append(P(
    'These columns tell you the basic information about each order. '
    'Every row has a unique Order_ID so you can track individual orders. '
    'The Session_ID shows which shopping session the order came from. '
    'One session can have multiple orders, or a customer can visit many '
    'sessions before placing an order. Order_Date tells you exactly when '
    'the order was placed, including the hour and minute. This is useful '
    'for time-based analysis like "what hour of the day has the most orders?"'
))

order_cols = [
    ['Order_ID', 'A unique number for each order (like AMZN-10000001)'],
    ['Session_ID', 'The shopping session number'],
    ['Order_Date', 'Date and time when the order was placed'],
    ['Actual_Delivery_Date', 'When the order was delivered (empty if not delivered)'],
    ['Total_Amount', 'The final price the customer paid (including tax and shipping)'],
    ['Net_Profit', 'Revenue minus cost of goods and shipping'],
    ['Quantity', 'How many units of the product were ordered'],
    ['Order_Status', 'Delivered, Shipped, Processing, Cancelled, or Returned'],
    ['Payment_Method', 'Credit Card, Amazon Pay, PayPal, Gift Card, Debit Card, Venmo'],
]
story.append(Spacer(1, 10))
t = make_table(['Column', 'What It Means'], order_cols, [0.28, 0.72])
story.append(t)
story.append(P('<b>Table 2.</b> Order and Transaction Columns', caption_style))
story.append(Spacer(1, 12))

story.extend(H2('2.2 Product Data'))
story.append(P(
    'These columns describe the product that was ordered. Each product has '
    'an ASIN (Amazon Standard Identification Number), which is a unique code. '
    'The Product_Category tells you which of the 6 categories the product '
    'belongs to. Product_Name includes the brand name and product type. '
    'The Unit_Price is the selling price, and COGS_Price is the cost to '
    'the seller (Cost of Goods Sold). The difference between price and COGS '
    'is the gross margin, which is a key business metric.'
))

product_cols = [
    ['ASIN', 'Amazon product code (unique identifier)'],
    ['Product_Category', 'Electronics, Computers, Smart Home, Home and Kitchen, Sports and Outdoors, Books'],
    ['Product_Name', 'Full name including brand and model'],
    ['Unit_Price', 'Selling price per unit in dollars'],
    ['COGS_Price', 'Cost price per unit (what the seller paid)'],
    ['Competitor_Price_At_Order', 'Price of the same product at competitors'],
    ['Price_Elasticity_Score', 'How sensitive customers are to price changes (0.5 to 2.5)'],
    ['Product_Rating', 'Customer rating from 3.0 to 5.0 stars'],
    ['Review_Count', 'Number of customer reviews for the product'],
    ['Buy_Box_Eligible', 'Yes or No - can this seller win the Buy Box?'],
]
story.append(Spacer(1, 10))
t = make_table(['Column', 'What It Means'], product_cols, [0.30, 0.70])
story.append(t)
story.append(P('<b>Table 3.</b> Product Columns', caption_style))
story.append(Spacer(1, 12))

story.extend(H2('2.3 Customer Data'))
story.append(P(
    'These columns are about the customer who placed the order. Customer_ID '
    'is a unique code for each customer. The same customer can appear in '
    'many rows because customers can place many orders. Is_Prime_Member '
    'tells you if the customer has an Amazon Prime subscription. Customer_'
    'Lifetime_Value (CLV) is the total amount of money this customer has '
    'spent across all their orders. CLV is one of the most important metrics '
    'in business because it tells you how much each customer is worth.'
))

customer_cols = [
    ['Customer_ID', 'Unique customer code (like CUST-100000)'],
    ['Is_Prime_Member', '1 = Prime member, 0 = not a member'],
    ['Customer_Lifetime_Value', 'Total money spent by this customer (all orders combined)'],
    ['Customer_State', 'US State where the order was shipped (30 states)'],
    ['Customer_Region', 'West, Central, or East region'],
]
story.append(Spacer(1, 10))
t = make_table(['Column', 'What It Means'], customer_cols, [0.30, 0.70])
story.append(t)
story.append(P('<b>Table 4.</b> Customer Columns', caption_style))
story.append(Spacer(1, 12))

story.extend(H2('2.4 Marketing and Traffic Data'))
story.append(P(
    'These columns show how the customer found the product. Traffic_Source '
    'tells you where they came from: a Google search, a TikTok ad, an '
    'Instagram influencer, Amazon internal search, a direct link, or a '
    'YouTube review. Keywords_Used shows what search words the customer '
    'typed. Ad_Campaign_ID links the order to a specific advertising '
    'campaign. This data is very important for marketing teams because it '
    'shows which channels bring the most sales.'
))

mktg_cols = [
    ['Traffic_Source', 'Where the customer came from'],
    ['Keywords_Used', 'Search words the customer typed'],
    ['Ad_Campaign_ID', 'Advertising campaign code (if from an ad)'],
    ['Device_Type', 'Mobile App, Desktop, or Mobile Web'],
    ['Time_On_Page_Sec', 'How many seconds the customer spent on the product page'],
    ['Click_Stream_Count', 'How many times the customer clicked before ordering'],
    ['Cart_Abandonment_History', 'How many times this customer left items in cart without buying'],
]
story.append(Spacer(1, 10))
t = make_table(['Column', 'What It Means'], mktg_cols, [0.30, 0.70])
story.append(t)
story.append(P('<b>Table 5.</b> Marketing and Traffic Columns', caption_style))
story.append(Spacer(1, 12))

story.extend(H2('2.5 Logistics and Delivery Data'))
story.append(P(
    'These columns are about shipping and delivery. The Warehouse_ID shows '
    'which fulfillment center processed the order. The Shipping_Carrier shows '
    'which delivery company (Amazon Logistics, UPS, FedEx, DHL, USPS) '
    'handled the package. Delivery_Days_Estimated is how many days the '
    'customer was told the delivery would take. By comparing the estimated '
    'days with the actual delivery date, you can measure delivery performance. '
    'Package_Weight_kg and Package_Dimensions_cm are physical attributes '
    'that affect shipping cost and warehouse space planning.'
))

logistics_cols = [
    ['Seller_Type', 'Sold by Amazon or 3rd-Party Merchant'],
    ['Warehouse_ID', 'Fulfillment center code (like FC-LAX-1)'],
    ['Shipping_Carrier', 'Amazon Logistics, UPS, FedEx, DHL, USPS'],
    ['Delivery_Days_Estimated', 'Expected delivery time in days'],
    ['Package_Weight_kg', 'Package weight in kilograms'],
    ['Package_Dimensions_cm', 'Package size (length x width x height in cm)'],
    ['Lead_Time_Days', 'How many days the seller needs to prepare the product'],
    ['Hazmat_Status', '1 if the product contains hazardous materials, 0 if not'],
]
story.append(Spacer(1, 10))
t = make_table(['Column', 'What It Means'], logistics_cols, [0.30, 0.70])
story.append(t)
story.append(P('<b>Table 6.</b> Logistics and Delivery Columns', caption_style))
story.append(Spacer(1, 12))

story.extend(H2('2.6 Risk and Return Data'))
story.append(P(
    'These columns help measure risk and customer satisfaction. Fraud_Score '
    'is a number between 0 and 1 that shows how likely the order is to be '
    'fraudulent (fake or stolen payment). A higher score means higher risk. '
    'Return_Probability_Score shows how likely the product is to be returned. '
    'Return_Reason tells you why a returned product was sent back (Defective, '
    'Wrong Item, Changed Mind, etc.). This information helps the business '
    'reduce losses from fraud and returns.'
))

risk_cols = [
    ['Return_Probability_Score', 'How likely the product will be returned (0.01 to 0.85)'],
    ['Fraud_Score', 'Risk of fraud for this order (0.0 to 0.99)'],
    ['Return_Reason', 'Why the product was returned (if returned)'],
    ['Promotion_Type', 'Type of discount used (Lightning Deal, Coupon, etc.)'],
    ['Discount_Amount', 'How much money was taken off the price'],
    ['Tax_Amount', 'Tax paid on the order'],
    ['Shipping_Fee', 'Shipping cost (free for Prime members)'],
]
story.append(Spacer(1, 10))
t = make_table(['Column', 'What It Means'], risk_cols, [0.30, 0.70])
story.append(t)
story.append(P('<b>Table 7.</b> Risk and Return Columns', caption_style))
story.append(Spacer(1, 12))

# =============================================================================
# CHAPTER 3: BUSINESS QUESTIONS - SALES AND REVENUE
# =============================================================================
story.extend(H1('3. Business Questions: Sales and Revenue'))

story.append(P(
    'The first thing any business wants to know is: how much money are we '
    'making? This section covers questions about total revenue, profit, and '
    'how sales change over time. These are the most common questions that '
    'business managers and executives ask. You can answer all of these '
    'questions using SQL queries, Power BI dashboards, or Python analysis.'
))

story.extend(H2('3.1 Total Revenue and Profit'))

story.extend(qa_block(
    'What is the total revenue and net profit for the year?',
    'You can add up the Total_Amount column to get total revenue. You can '
    'add up the Net_Profit column to get total profit. In SQL, you would '
    'use SUM(Total_Amount) and SUM(Net_Profit). The difference between '
    'revenue and profit tells you the total cost (COGS, shipping, taxes). '
    'A healthy e-commerce business has a net profit margin of 10-20%. '
    'If your profit margin is lower, it means costs are too high.'
))

story.extend(qa_block(
    'What is the average order value (AOV)?',
    'Average Order Value = Total Revenue / Number of Orders. In SQL, this '
    'is AVG(Total_Amount). The AOV is important because it tells you how '
    'much money each customer spends per order. If the AOV is $75 and you '
    'want to increase revenue, you can try to increase the AOV (upselling) '
    'or increase the number of orders. For example, if you recommend related '
    'products at checkout, customers might add more items to their cart.'
))

story.extend(qa_block(
    'How does revenue change by month?',
    'Group the data by month using Order_Date. For each month, calculate '
    'SUM(Total_Amount). You will see that November and December have the '
    'highest revenue because of Black Friday and holiday shopping. July '
    'also has a spike because of Prime Day. January and February are '
    'typically the slowest months. This pattern is called <b>seasonality</b>, '
    'and understanding it helps businesses plan their inventory and marketing.'
))

story.extend(H2('3.2 Revenue by Category'))

story.extend(qa_block(
    'Which product category makes the most revenue?',
    'Group the data by Product_Category and sum Total_Amount for each group. '
    'Electronics and Computers usually make the most revenue because their '
    'prices are high ($20-$1,900). But Books might sell more units even '
    'though each book is cheap ($8-$46). This is the difference between '
    '<b>revenue</b> (total dollars) and <b>volume</b> (number of items sold). '
    'Both are important: high revenue categories bring more money, while '
    'high volume categories bring more customers.'
))

story.extend(qa_block(
    'Which category has the best profit margin?',
    'Profit margin = (Unit_Price - COGS_Price) / Unit_Price. For each category, '
    'calculate the average profit margin. Books often have the highest margin '
    '(50-70%) because printing costs are low. Electronics has lower margins '
    '(25-45%) because hardware is expensive to make. A business should focus '
    'on high-margin categories when possible, but also offer low-margin '
    'categories to attract customers who might buy other things too.'
))

story.extend(H2('3.3 Revenue by Time'))

story.extend(qa_block(
    'What day of the week has the most orders?',
    'Extract the day of the week from Order_Date and count orders for each '
    'day. You will likely see that Saturday and Sunday have the most orders '
    'because people have more free time to shop. Monday through Friday are '
    'lower but more consistent. This information helps with staffing '
    '(customer service teams) and server capacity planning.'
))

story.extend(qa_block(
    'What hour of the day do people shop the most?',
    'Extract the hour from Order_Date and group by hour. You will see a '
    'pattern: orders are low at night (midnight to 6 AM), increase during '
    'the day, and peak in the evening (6 PM to 10 PM). This makes sense '
    'because most people shop after work. Marketing teams can use this to '
    'schedule ads and email campaigns at the best times.'
))

story.extend(qa_block(
    'How do Prime Day and Black Friday affect sales?',
    'Filter the data for specific events. Prime Day is July 15-16. Black '
    'Friday is the week of November 24-30. Compare the daily revenue during '
    'these events with normal days. You will see a massive spike - these '
    'event days can generate 5-10 times more revenue than a normal day. '
    'This shows why promotional events are so important for e-commerce.'
))

# =============================================================================
# CHAPTER 4: BUSINESS QUESTIONS - CUSTOMER BEHAVIOR
# =============================================================================
story.extend(H1('4. Business Questions: Customer Behavior'))

story.append(P(
    'Understanding customers is the key to growing any business. This section '
    'covers questions about who the customers are, how they behave, and how '
    'much they are worth to the business. Customer analysis helps businesses '
    'decide where to spend their marketing money and how to improve the '
    'shopping experience.'
))

story.extend(H2('4.1 Customer Segmentation'))

story.extend(qa_block(
    'How many orders does each customer place?',
    'Group by Customer_ID and count the orders. You will see that most '
    'customers place 1-5 orders, but some customers place 15-20 orders. '
    'These high-frequency customers are very valuable because they generate '
    'more revenue per person. The 80/20 rule often applies: 20% of customers '
    'generate 80% of revenue. Finding these top customers and keeping them '
    'happy is a key strategy.'
))

story.extend(qa_block(
    'How many Prime members vs non-Prime members are there?',
    'Count customers where Is_Prime_Member = 1 vs 0. In this dataset, '
    'about 62% of customers are Prime members. Prime members are important '
    'because they spend more, order more often, and are more loyal. '
    'Comparing the average order value and lifetime value of Prime vs non-Prime '
    'customers shows the value of the Prime program.'
))

story.extend(qa_block(
    'What is the average Customer Lifetime Value (CLV)?',
    'CLV = SUM(Total_Amount) for each customer. The average CLV tells you '
    'how much money a customer is worth over their entire relationship with '
    'the business. If the average CLV is $350 and it costs $50 to acquire '
    'a new customer, the return on investment is 7:1, which is excellent. '
    'You can also segment CLV by Prime status, region, or device type.'
))

story.extend(H2('4.2 Device and Shopping Behavior'))

story.extend(qa_block(
    'Do mobile users buy differently than desktop users?',
    'Compare orders by Device_Type. Mobile_App users (55% of traffic) tend '
    'to spend less time on each page (8-90 seconds) and click fewer times '
    '(2-12 clicks). Desktop users spend more time (45-480 seconds) and '
    'click more (6-35 times). This might mean desktop users research products '
    'more carefully before buying. The business should make the mobile app '
    'faster and simpler, while desktop can show more detailed information.'
))

story.extend(qa_block(
    'What is the cart abandonment rate?',
    'Cart_Abandonment_History shows how many times a customer left items in '
    'their cart without buying. If most customers have 0-1 abandoned carts, '
    'that is good. If many customers have 3-7 abandoned carts, the business '
    'has a problem. Common reasons for cart abandonment: high shipping costs, '
    'complicated checkout, or the customer found a better price elsewhere. '
    'Solutions include free shipping, simplified checkout, and retargeting ads.'
))

story.extend(H2('4.3 Geographic Analysis'))

story.extend(qa_block(
    'Which states generate the most revenue?',
    'Group by Customer_State and sum Total_Amount. Large states like '
    'California (CA), Texas (TX), Florida (FL), and New York (NY) will '
    'generate the most revenue simply because they have more people. But '
    'if you look at revenue per customer, smaller states might perform '
    'better. This helps decide where to open new warehouses and where to '
    'run local marketing campaigns.'
))

story.extend(qa_block(
    'Is there a difference between regions?',
    'Compare West, Central, and East regions. Look at average order value, '
    'delivery times, and return rates. If one region has much longer '
    'delivery times, the business might need a new warehouse there. If '
    'one region has higher return rates, there might be a quality issue '
    'with products shipped to that area.'
))

# =============================================================================
# CHAPTER 5: BUSINESS QUESTIONS - MARKETING
# =============================================================================
story.extend(H1('5. Business Questions: Marketing and Traffic'))

story.append(P(
    'Marketing is how a business finds new customers and keeps existing ones '
    'buying. This section covers questions about which marketing channels '
    'work best, which keywords bring the most sales, and how advertising '
    'campaigns perform. Marketing analysis helps businesses spend their '
    'advertising budget more wisely.'
))

story.extend(H2('5.1 Traffic Source Analysis'))

story.extend(qa_block(
    'Which traffic source brings the most orders?',
    'Group by Traffic_Source and count orders. The top sources are usually '
    'Amazon Internal Search (30%) and Google Search (28%), followed by '
    'Direct Link (15%), TikTok Ad (12%), Instagram Influencer (10%), and '
    'YouTube Review (5%). Internal search is powerful because it means '
    'customers are already on Amazon and searching for products. External '
    'sources like TikTok and Instagram bring new customers who might not '
    'have found the products otherwise.'
))

story.extend(qa_block(
    'Which traffic source brings the highest-value orders?',
    'Group by Traffic_Source and calculate AVG(Total_Amount). This is '
    'different from the total count. For example, YouTube Review might '
    'bring fewer orders but each order might have a higher value because '
    'the customer watched a detailed review and is more confident about '
    'buying. TikTok might bring many small orders. Knowing this helps '
    'decide which channels to invest in for quality vs quantity.'
))

story.extend(qa_block(
    'Which keywords bring the most sales?',
    'Filter rows where Keywords_Used is not empty, then group by Keywords_Used '
    'and sum Total_Amount. This shows which search terms are most valuable. '
    'For example, "best wireless headphones" might bring $500,000 in revenue '
    'while "cheap wireless headphones" might bring $200,000. The business '
    'can use these keywords in their SEO strategy and advertising.'
))

story.extend(H2('5.2 Advertising Campaign Performance'))

story.extend(qa_block(
    'How do ad campaigns perform?',
    'Filter rows where Ad_Campaign_ID is not empty. Group by Ad_Campaign_ID '
    'and calculate: number of orders, total revenue, average order value, and '
    'return rate. Compare different campaigns to see which ones are most '
    'profitable. A good campaign has high revenue, low return rate, and '
    'attracts new customers. If a campaign has high sales but many returns, '
    'it might be misleading customers with false promises.'
))

story.extend(H2('5.3 Promotion Effectiveness'))

story.extend(qa_block(
    'Which promotion type is most effective?',
    'Group by Promotion_Type and compare metrics. Lightning Deals (15-30% '
    'discount) generate urgency and quick sales. Coupons (5-15%) attract '
    'price-sensitive customers. Subscribe and Save (5-15%) builds recurring '
    'revenue. Prime Exclusive Discount (8-12%) rewards loyalty. Compare '
    'the revenue, profit, and customer retention for each type. A promotion '
    'that brings revenue but destroys profit margin is not sustainable.'
))

story.extend(qa_block(
    'How do discounts affect profit?',
    'Compare orders with discounts vs without discounts. Calculate the '
    'average Net_Profit for discounted orders vs full-price orders. You '
    'might find that discounted orders have lower profit per order but '
    'bring more total volume. The key is to find the right balance. Also '
    'check if discounted customers come back and buy at full price later.'
))

# =============================================================================
# CHAPTER 6: BUSINESS QUESTIONS - LOGISTICS
# =============================================================================
story.extend(H1('6. Business Questions: Logistics and Delivery'))

story.append(P(
    'Logistics is about getting products to customers quickly and cheaply. '
    'This section covers questions about delivery performance, warehouse '
    'efficiency, and shipping costs. Good logistics is a competitive advantage '
    'because customers expect fast and reliable delivery.'
))

story.extend(H2('6.1 Delivery Performance'))

story.extend(qa_block(
    'What percentage of orders are delivered on time?',
    'Compare Actual_Delivery_Date with Order_Date plus Delivery_Days_Estimated. '
    'If the actual delivery took more days than estimated, it is late. In this '
    'dataset, about 15% of orders are delivered late. A 15% late rate is '
    'common in e-commerce, but reducing it to 10% would significantly '
    'improve customer satisfaction. You can also check if certain carriers '
    'or regions have higher late rates.'
))

story.extend(qa_block(
    'Which shipping carrier is the most reliable?',
    'Group by Shipping_Carrier and calculate the late delivery percentage '
    'for each carrier. Compare Amazon Logistics, UPS, FedEx, DHL, and USPS. '
    'Also look at the average delivery time for each carrier. The fastest '
    'carrier is not always the best if they have a high late rate. The '
    'business should balance speed, reliability, and cost when choosing carriers.'
))

story.extend(H2('6.2 Warehouse Analysis'))

story.extend(qa_block(
    'Which warehouses handle the most orders?',
    'Group by Warehouse_ID and count orders. The distribution depends on '
    'customer locations. Warehouses in high-population regions (East and '
    'West) handle more orders. If one warehouse is overloaded, the business '
    'might need to add capacity or redistribute orders to nearby warehouses.'
))

story.extend(qa_block(
    'Do regional warehouses improve delivery times?',
    'Compare delivery times when the warehouse and customer are in the same '
    'region vs different regions. Same-region orders take 1-2 days, while '
    'cross-region orders take 3-5 days. This confirms that having warehouses '
    'close to customers is important. The business should consider opening '
    'warehouses in under-served areas where delivery times are long.'
))

story.extend(H2('6.3 Shipping Cost Analysis'))

story.extend(qa_block(
    'How much does shipping cost the business?',
    'Shipping_Fee shows the cost for each order. Prime members get free '
    'shipping (fee is $0). Non-Prime members pay $4.99-$7.99 per order. '
    'Calculate the total shipping revenue and compare it with estimated '
    'actual shipping costs. If the business offers free shipping to Prime '
    'members, that cost must be covered by the product margin or the Prime '
    'subscription fee.'
))

# =============================================================================
# CHAPTER 7: BUSINESS QUESTIONS - PRODUCT PERFORMANCE
# =============================================================================
story.extend(H1('7. Business Questions: Product Performance'))

story.append(P(
    'Knowing which products perform well and which do not is essential for '
    'product management. This section covers questions about product ratings, '
    'reviews, returns, and brand performance. These insights help the business '
    'decide which products to promote, which to improve, and which to remove.'
))

story.extend(H2('7.1 Product Ratings and Reviews'))

story.extend(qa_block(
    'How do ratings affect sales?',
    'Group products by Product_Rating (or create rating ranges like 3.0-3.5, '
    '3.5-4.0, 4.0-4.5, 4.5-5.0) and calculate the total revenue and average '
    'order quantity for each group. Products with higher ratings (4.0+) should '
    'sell more because customers trust them more. If low-rated products still '
    'sell well, it might be because they are cheap or have no competition.'
))

story.extend(qa_block(
    'Do products with more reviews sell more?',
    'Create groups by Review_Count (low: 0-100, medium: 100-1000, high: 1000+). '
    'Compare the revenue and order volume for each group. Products with more '
    'reviews generally sell more because customers read reviews before buying. '
    'If a product has low sales and few reviews, the business should encourage '
    'customers to leave reviews after purchase.'
))

story.extend(H2('7.2 Brand Performance'))

story.extend(qa_block(
    'Which brands generate the most revenue?',
    'Extract the brand name from Product_Name (the first word before the space) '
    'and group by brand. Calculate total revenue and profit for each brand. '
    'Top brands like Sony, Samsung, Apple, and Nike will generate the most '
    'revenue. But niche brands might have better profit margins. The business '
    'should stock more of the top-selling brands and negotiate better prices '
    'with suppliers.'
))

story.extend(H2('7.3 Return Analysis'))

story.extend(qa_block(
    'Which categories have the highest return rate?',
    'Filter orders with Order_Status = "Returned" and group by Product_Category. '
    'Calculate the return rate as: (Returned Orders / Total Orders) for each '
    'category. Electronics typically has the highest return rate (8-25%) '
    'because products might be defective or not meet expectations. Books '
    'have the lowest return rate (1-6%). High return categories need better '
    'quality control and more accurate product descriptions.'
))

story.extend(qa_block(
    'What are the most common return reasons?',
    'Group returned orders by Return_Reason. Common reasons include: '
    'Changed Mind (25%), Defective (20%), Not as Described (20%), Better '
    'Price Found (15%), Wrong Item Shipped (10%), and Arrived Too Late (10%). '
    'Each reason requires a different solution. "Changed Mind" might need '
    'better product photos. "Defective" needs quality control. "Arrived Too '
    'Late" needs faster shipping.'
))

# =============================================================================
# CHAPTER 8: BUSINESS QUESTIONS - PRICING
# =============================================================================
story.extend(H1('8. Business Questions: Pricing Strategy'))

story.append(P(
    'Pricing is one of the most powerful levers in business. A small change '
    'in price can have a big impact on revenue and profit. This section '
    'covers questions about price elasticity, competitive pricing, and '
    'how the Buy Box affects sales.'
))

story.extend(H2('8.1 Price and Elasticity'))

story.extend(qa_block(
    'What is the price elasticity for each category?',
    'Price_Elasticity_Score tells you how sensitive customers are to price '
    'changes. A score of 2.5 means very sensitive (customers will buy much '
    'less if price increases). A score of 0.5 means not sensitive (customers '
    'will buy about the same amount even if price changes). Average the '
    'elasticity score by category. Electronics might be more elastic because '
    'customers compare prices online. Books might be less elastic because '
    'readers want specific titles.'
))

story.extend(qa_block(
    'How does our price compare to competitors?',
    'Compare Unit_Price with Competitor_Price_At_Order. Calculate the '
    'average price difference by category. If your price is consistently '
    'higher than competitors, you might lose sales. If it is lower, you '
    'might be leaving money on the table. The ideal is to match or slightly '
    'beat competitor prices while maintaining good profit margins.'
))

story.extend(H2('8.2 Buy Box Analysis'))

story.extend(qa_block(
    'Does Buy Box eligibility affect sales?',
    'Group by Buy_Box_Eligible (Yes vs No) and compare the order volume and '
    'revenue. The Buy Box is the "Add to Cart" button on Amazon. Only one '
    'seller wins the Buy Box for each product. If you are not eligible, '
    'customers must click "See All Buying Options" to find you, which '
    'greatly reduces your chances of making a sale. About 82% of orders '
    'come from Buy Box listings.'
))

# =============================================================================
# CHAPTER 9: BUSINESS QUESTIONS - RISK AND FRAUD
# =============================================================================
story.extend(H1('9. Business Questions: Risk and Fraud'))

story.append(P(
    'Fraud and risk management protect the business from losing money to '
    'fake orders, stolen credit cards, and other types of fraud. This '
    'section covers questions about fraud patterns and how to identify '
    'high-risk orders. Effective fraud detection saves businesses millions '
    'of dollars per year.'
))

story.extend(H2('9.1 Fraud Pattern Analysis'))

story.extend(qa_block(
    'What is the average fraud score?',
    'Calculate the average Fraud_Score across all orders. Most legitimate '
    'orders have a low score (0.0-0.3). Suspicious orders have higher '
    'scores (0.5+). Orders with status "Cancelled" often have the highest '
    'fraud scores (0.3-0.99) because cancellation is a fraud indicator. '
    'The business should set a threshold (for example, 0.5) and manually '
    'review all orders above that threshold.'
))

story.extend(qa_block(
    'What factors increase fraud risk?',
    'Analyze the correlation between Fraud_Score and other columns. You '
    'will find that: (1) New customers have higher fraud scores, (2) Orders '
    'paid with Gift Cards have higher fraud scores, (3) High-value orders '
    '(over $500) have higher fraud scores, (4) Customers with low CLV '
    'have higher fraud scores. These factors are combined to create the '
    'fraud score. This multi-factor approach is called a "risk model" and '
    'it is standard practice in e-commerce fraud prevention.'
))

story.extend(qa_block(
    'How much money is at risk from fraud?',
    'Filter orders with Fraud_Score > 0.5 and sum their Total_Amount. This '
    'shows the total value of high-risk orders. Not all of these are actual '
    'fraud, but they represent potential losses. If 5% of high-risk orders '
    'turn out to be fraudulent, the actual loss is 5% of the total. This '
    'calculation helps the business decide how much to invest in fraud '
    'prevention systems and staff.'
))

# =============================================================================
# CHAPTER 10: KEY BUSINESS METRICS (KPIs)
# =============================================================================
story.extend(H1('10. Key Performance Indicators (KPIs)'))

story.append(P(
    'KPIs are the most important numbers that a business tracks. Every CEO, '
    'manager, and analyst looks at KPIs to understand how the business is '
    'performing. Below are the most important KPIs you can calculate from '
    'this dataset, along with how to calculate them and what they mean.'
))

kpi_data = [
    ['Total Revenue', 'SUM(Total_Amount)', 'Total money received from all orders'],
    ['Net Profit', 'SUM(Net_Profit)', 'Revenue minus all costs'],
    ['Profit Margin', 'Net Profit / Revenue', 'Percentage of revenue that is profit'],
    ['Average Order Value', 'AVG(Total_Amount)', 'Average spending per order'],
    ['Total Orders', 'COUNT(Order_ID)', 'Total number of orders placed'],
    ['Unique Customers', 'COUNT(DISTINCT Customer_ID)', 'Number of different customers'],
    ['Orders per Customer', 'Total Orders / Unique Customers', 'How often customers buy'],
    ['Average CLV', 'AVG(Customer_Lifetime_Value)', 'Average total spend per customer'],
    ['Prime Membership Rate', 'COUNT(Prime) / Total Customers', 'Percentage of Prime members'],
    ['Delivery On-Time Rate', 'On-Time Orders / Delivered Orders', 'Percentage delivered on time'],
    ['Return Rate', 'Returned Orders / Total Orders', 'Percentage of orders returned'],
    ['Cancellation Rate', 'Cancelled Orders / Total Orders', 'Percentage of cancelled orders'],
    ['Average Fraud Score', 'AVG(Fraud_Score)', 'Average risk level of all orders'],
    ['Cart Abandonment Rate', 'Customers with Cart_Abandon > 0 / Total', 'Percentage who left cart'],
]

story.append(Spacer(1, 10))
t = make_table(['KPI', 'How to Calculate', 'What It Means'], kpi_data, [0.22, 0.35, 0.43])
story.append(t)
story.append(P('<b>Table 8.</b> Key Performance Indicators from the Dataset', caption_style))
story.append(Spacer(1, 12))

story.append(P(
    'These KPIs are the foundation of any business dashboard. In Power BI, '
    'you would create visual cards for each KPI at the top of your '
    'dashboard. In SQL, you would write SELECT statements to calculate '
    'each one. The important thing is not just calculating these numbers, '
    'but understanding what they mean and what actions to take. For example, '
    'if the return rate is 8%, you should investigate which categories have '
    'the highest returns and why. If the AOV is declining month over month, '
    'you should check if discounting is the cause.'
))

# =============================================================================
# CHAPTER 11: HOW TO ANALYZE - TOOLS AND APPROACHES
# =============================================================================
story.extend(H1('11. How to Analyze: Tools and Approaches'))

story.append(P(
    'You can analyze this dataset using many different tools. The three most '
    'common tools for business analysis are SQL, Power BI, and Python. Each '
    'tool has its strengths. Below, we explain when to use each tool and '
    'give practical tips for getting started.'
))

story.extend(H2('11.1 Using SQL'))
story.append(P(
    'SQL (Structured Query Language) is the best tool for asking specific '
    'questions about data. You write a query, run it, and get a precise '
    'answer. SQL is fast, efficient, and works with any size of data. Here '
    'are some common SQL patterns you will use with this dataset:'
))

sql_examples = [
    ['Basic Aggregation', 'SELECT SUM(Total_Amount) FROM orders', 'Calculate total revenue'],
    ['Group By', 'SELECT Product_Category, AVG(Total_Amount) FROM orders GROUP BY Product_Category', 'Revenue by category'],
    ['Time Filter', 'SELECT DATE(Order_Date) as day, COUNT(*) FROM orders GROUP BY day', 'Daily order count'],
    ['Multiple Groups', 'SELECT Customer_State, Product_Category, SUM(Net_Profit) FROM orders GROUP BY Customer_State, Product_Category', 'Profit by state and category'],
    ['Subquery', 'SELECT * FROM orders WHERE Fraud_Score > (SELECT AVG(Fraud_Score) FROM orders)', 'High-risk orders'],
    ['Window Function', 'SELECT *, RANK() OVER (PARTITION BY Product_Category ORDER BY Net_Profit DESC) FROM orders', 'Top products per category'],
]

story.append(Spacer(1, 10))
t = make_table(['Pattern', 'SQL Example', 'Purpose'], sql_examples, [0.18, 0.52, 0.30])
story.append(t)
story.append(P('<b>Table 9.</b> Common SQL Patterns for This Dataset', caption_style))
story.append(Spacer(1, 12))

story.extend(H2('11.2 Using Power BI'))
story.append(P(
    'Power BI is the best tool for creating interactive dashboards and '
    'visual reports. Unlike SQL, which gives you numbers in a table, '
    'Power BI shows your data as charts, graphs, and maps. This makes it '
    'easier to see patterns and share insights with others. Here is how '
    'to build a dashboard with this dataset:'
))
story.append(P(
    '<b>Step 1:</b> Import the CSV file into Power BI Desktop. The 48 columns '
    'will be automatically detected with their data types.', body_left))
story.append(P(
    '<b>Step 2:</b> Create a data model. Most of your analysis will use a '
    'single table, so no complex relationships are needed.', body_left))
story.append(P(
    '<b>Step 3:</b> Add KPI cards at the top: Total Revenue, Net Profit, '
    'Average Order Value, Total Orders, and Return Rate.', body_left))
story.append(P(
    '<b>Step 4:</b> Add a line chart showing Revenue by Month to see trends '
    'over time.', body_left))
story.append(P(
    '<b>Step 5:</b> Add a bar chart showing Revenue by Product Category.', body_left))
story.append(P(
    '<b>Step 6:</b> Add a map showing Revenue by Customer_State (use the '
    'state codes for location data).', body_left))
story.append(P(
    '<b>Step 7:</b> Add a pie chart showing Order Status distribution '
    '(Delivered, Shipped, Cancelled, Returned).', body_left))
story.append(P(
    '<b>Step 8:</b> Add slicers (filters) for Is_Prime_Member, Device_Type, '
    'and Traffic_Source so users can interact with the data.', body_left))

story.extend(H2('11.3 Using Python'))
story.append(P(
    'Python is the best tool for advanced analysis and machine learning. '
    'With libraries like pandas, matplotlib, and scikit-learn, you can do '
    'things that SQL and Power BI cannot do easily. Python is especially '
    'good for: (1) Cleaning and preprocessing large datasets, (2) Building '
    'predictive models, (3) Creating custom visualizations, (4) Automating '
    'repetitive analysis tasks.'
))
story.append(P(
    'For this dataset, you could use Python to build a fraud detection model '
    '(using Fraud_Score and other features as training data), a customer '
    'segmentation model (using K-means clustering on CLV, order frequency, '
    'and category preferences), or a sales forecasting model (using time-series '
    'analysis on monthly revenue data). These advanced analyses go beyond '
    'simple queries and provide predictive insights that help businesses '
    'make proactive decisions.'
))

# =============================================================================
# CHAPTER 12: PRACTICAL ANALYSIS SCENARIOS
# =============================================================================
story.extend(H1('12. Practical Analysis Scenarios'))

story.append(P(
    'This chapter gives you real-world scenarios that a business analyst '
    'might face. For each scenario, we explain the business problem, which '
    'columns to use, and how to approach the analysis. These scenarios '
    'combine multiple skills and are excellent for practice.'
))

story.extend(H2('12.1 Scenario: The CEO Wants to Know Where to Invest'))

story.append(P(
    '<b>Business Problem:</b> The CEO asks: "We have $500,000 for marketing '
    'next quarter. Where should we spend it?"', body_left))
story.append(P(
    '<b>Approach:</b> First, analyze which Traffic_Source brings the highest '
    'revenue and profit. Then look at which sources bring new customers '
    '(customers with only 1 order). Also check which sources have the lowest '
    'return rates. The best channel is one that brings high revenue, new '
    'customers, and low returns. You might recommend investing 40% in Google '
    'Search (high volume), 30% in TikTok Ads (new customers), and 30% in '
    'Amazon Internal Search optimization (SEO).', body_left))

story.extend(H2('12.2 Scenario: Logistics Team Needs Faster Delivery'))

story.append(P(
    '<b>Business Problem:</b> The logistics manager says: "15% of orders are '
    'late. Can you help us understand why?"', body_left))
story.append(P(
    '<b>Approach:</b> First, identify which orders are late by comparing '
    'Actual_Delivery_Date with Order_Date + Delivery_Days_Estimated. Then '
    'group late orders by Shipping_Carrier, Warehouse_ID, and Customer_'
    'Region. You might find that cross-region shipments are the main problem, '
    'or that one specific carrier has a much higher late rate. Also check '
    'if holiday and weekend orders are more likely to be late. The solution '
    'might be to change carriers, add warehouses, or adjust delivery estimates.'
))

story.extend(H2('12.3 Scenario: Product Team Wants to Reduce Returns'))

story.append(P(
    '<b>Business Problem:</b> The product manager says: "Our return rate is '
    'too high. What can we do?"', body_left))
story.append(P(
    '<b>Approach:</b> Analyze returned orders by Product_Category, Return_'
    'Reason, and Product_Rating. You might find that Electronics has the '
    'highest return rate and "Defective" is the top reason. For "Not as '
    'Described" returns, check if low-rated products have higher return rates. '
    'Also compare return rates between Prime and non-Prime customers. '
    'Recommendations might include: better quality control for Electronics, '
    'more detailed product descriptions, better product photos, and a '
    'stricter review process before listing new products.'
))

story.extend(H2('12.4 Scenario: Finance Team Wants to Improve Profit Margins'))

story.append(P(
    '<b>Business Problem:</b> The CFO asks: "Our profit margin is only 12%. '
    'How can we improve it?"', body_left))
story.append(P(
    '<b>Approach:</b> First, calculate the profit margin by category, brand, '
    'and promotion type. You might find that discounted orders have very low '
    'or negative margins. Check if Lightning Deals and Coupons are eating '
    'too much profit. Also compare seller types: Amazon might have better '
    'margins than third-party sellers. Look at shipping costs for non-Prime '
    'members. Recommendations might include: reducing discount depth, '
    'increasing prices for high-elasticity products, negotiating better '
    'COGS with suppliers, and encouraging more Prime sign-ups (free shipping '
    'costs are covered by subscription fees).'
))

# =============================================================================
# CHAPTER 13: SUMMARY OF BUSINESS EXPECTATIONS
# =============================================================================
story.extend(H1('13. Summary: What the Business Expects'))

story.append(P(
    'When a business has 1 million rows of order data, the management team '
    'expects the data team to answer questions that lead to actionable decisions. '
    'Here is a summary of the key business expectations:'
))

expectations = [
    ['Increase Revenue', 'Find which products, categories, and channels generate the most revenue and grow them'],
    ['Reduce Costs', 'Identify areas where costs are high (shipping, returns, fraud) and reduce them'],
    ['Improve Customer Experience', 'Understand what customers want and remove friction from the buying process'],
    ['Optimize Marketing Spend', 'Know which marketing channels bring the best return on investment'],
    ['Manage Risk', 'Detect fraud early and prevent losses from fake orders'],
    ['Improve Operations', 'Make logistics faster and more reliable'],
    ['Grow Customer Base', 'Find new customer segments and increase customer lifetime value'],
    ['Make Data-Driven Decisions', 'Replace guesses with facts based on data analysis'],
]

story.append(Spacer(1, 10))
t = make_table(['Business Expectation', 'How Data Helps'], expectations, [0.28, 0.72])
story.append(t)
story.append(P('<b>Table 10.</b> Key Business Expectations and How Data Helps', caption_style))
story.append(Spacer(1, 12))

story.append(P(
    'The most important thing to remember is that data analysis is not just '
    'about numbers. It is about finding answers to business questions and '
    'recommending actions that improve the business. Every chart, table, and '
    'number should answer the question: "So what? What should we do about '
    'this?" If your analysis shows that November sales are 3 times higher '
    'than February, the "so what" is that the business should prepare more '
    'inventory and staff for November, and consider running promotions in '
    'February to boost slow sales.'
))

story.append(P(
    'With 1 million rows and 48 columns, this dataset gives you the raw '
    'material to practice all of these skills. Whether you use SQL, Power BI, '
    'or Python, the key is to always start with a clear business question, '
    'use the right data to answer it, and communicate your findings in a way '
    'that helps the business make better decisions. This is the core skill '
    'of a business analyst, and this dataset is your training ground.'
))

# =============================================================================
# BUILD
# =============================================================================
doc.multiBuild(story)
print(f"PDF generated: {OUTPUT_FILE}")
print(f"Size: {os.path.getsize(OUTPUT_FILE) / 1024:.1f} KB")
