#!/usr/bin/env python3
"""
Power BI A-Z Beginner Workshop Guide (1-Hour Workshop)
For people with ZERO Power BI knowledge
A1 English level
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm, inch
from reportlab.lib.colors import HexColor, white, black, Color
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle,
    PageBreak, KeepTogether, HRFlowable, ListFlowable, ListItem
)
from reportlab.platypus.frames import Frame
from reportlab.platypus.doctemplate import PageTemplate, BaseDocTemplate
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

# Register fonts with ReportLab
pdfmetrics.registerFont(TTFont('LiberationSerif', '/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf'))
pdfmetrics.registerFont(TTFont('LiberationSerif-Bold', '/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf'))
pdfmetrics.registerFont(TTFont('Carlito', '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf'))
pdfmetrics.registerFont(TTFont('Carlito-Bold', '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'))
pdfmetrics.registerFont(TTFont('LiberationMono', '/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf'))
pdfmetrics.registerFont(TTFont('LiberationMono-Bold', '/usr/share/fonts/truetype/liberation/LiberationMono-Bold.ttf'))

from reportlab.pdfbase.pdfmetrics import registerFontFamily
registerFontFamily('LiberationSerif', normal='LiberationSerif', bold='LiberationSerif-Bold')
registerFontFamily('Carlito', normal='Carlito', bold='Carlito-Bold')
registerFontFamily('LiberationMono', normal='LiberationMono', bold='LiberationMono-Bold')

OUT = "/home/z/my-project/download"
IMG = "/home/z/my-project/download/powerbi_images"
PDF_FILE = os.path.join(OUT, "PowerBI_AZ_Beginner_Workshop_Guide.pdf")

# Colors
DARK_BLUE = HexColor("#1B3A5C")
MED_BLUE = HexColor("#2E75B6")
LIGHT_BLUE = HexColor("#D9E2F3")
ACCENT_GREEN = HexColor("#2E7D32")
ACCENT_ORANGE = HexColor("#E65100")
ACCENT_RED = HexColor("#D32F2F")
BG_LIGHT = HexColor("#F5F7FA")
BG_WARN = HexColor("#FFF3E0")
DARK_GRAY = HexColor("#333333")
LIGHT_GRAY = HexColor("#EEEEEE")

# Fonts
BODY_FONT = "LiberationSerif"
HEADING_FONT = "Carlito"
MONO_FONT = "LiberationMono"

styles = getSampleStyleSheet()

# Custom styles
styles.add(ParagraphStyle(
    'CoverTitle', fontName=HEADING_FONT, fontSize=32, leading=40,
    textColor=white, alignment=TA_CENTER, spaceAfter=10
))
styles.add(ParagraphStyle(
    'CoverSubtitle', fontName=HEADING_FONT, fontSize=16, leading=22,
    textColor=HexColor("#B0C4DE"), alignment=TA_CENTER, spaceAfter=8
))
styles.add(ParagraphStyle(
    'SectionHeader', fontName=HEADING_FONT, fontSize=20, leading=26,
    textColor=DARK_BLUE, spaceBefore=16, spaceAfter=10
))
styles.add(ParagraphStyle(
    'SubHeader', fontName=HEADING_FONT, fontSize=15, leading=20,
    textColor=MED_BLUE, spaceBefore=12, spaceAfter=6
))
styles.add(ParagraphStyle(
    'BodyText2', fontName=BODY_FONT, fontSize=11, leading=17,
    textColor=DARK_GRAY, alignment=TA_JUSTIFY, spaceAfter=8,
    firstLineIndent=0
))
styles.add(ParagraphStyle(
    'BodyTextIndent', fontName=BODY_FONT, fontSize=11, leading=17,
    textColor=DARK_GRAY, alignment=TA_JUSTIFY, spaceAfter=6,
    leftIndent=15
))
styles.add(ParagraphStyle(
    'CodeBlock', fontName=MONO_FONT, fontSize=9, leading=13,
    textColor=DARK_BLUE, backColor=HexColor("#F0F4FA"),
    borderColor=MED_BLUE, borderWidth=1, borderPadding=8,
    spaceAfter=8, leftIndent=15
))
styles.add(ParagraphStyle(
    'TipBox', fontName=BODY_FONT, fontSize=10, leading=15,
    textColor=HexColor("#1B5E20"), backColor=HexColor("#E8F5E9"),
    borderColor=ACCENT_GREEN, borderWidth=1, borderPadding=8,
    spaceAfter=8, leftIndent=10
))
styles.add(ParagraphStyle(
    'WarningBox', fontName=BODY_FONT, fontSize=10, leading=15,
    textColor=HexColor("#BF360C"), backColor=HexColor("#FFF3E0"),
    borderColor=ACCENT_ORANGE, borderWidth=1, borderPadding=8,
    spaceAfter=8, leftIndent=10
))
styles.add(ParagraphStyle(
    'TimeBadge', fontName=HEADING_FONT, fontSize=12, leading=16,
    textColor=white, backColor=MED_BLUE, alignment=TA_CENTER,
    spaceAfter=4, spaceBefore=8
))
styles.add(ParagraphStyle(
    'StepNumber', fontName=HEADING_FONT, fontSize=13, leading=18,
    textColor=MED_BLUE, spaceBefore=10, spaceAfter=4
))
styles.add(ParagraphStyle(
    'SmallNote', fontName=BODY_FONT, fontSize=9, leading=13,
    textColor=HexColor("#757575"), spaceAfter=4
))
styles.add(ParagraphStyle(
    'TableHeader', fontName=HEADING_FONT, fontSize=10, leading=14,
    textColor=white, alignment=TA_CENTER
))
styles.add(ParagraphStyle(
    'TableCell', fontName=BODY_FONT, fontSize=10, leading=14,
    textColor=DARK_GRAY, alignment=TA_LEFT
))


def section_divider():
    return HRFlowable(width="100%", thickness=2, color=MED_BLUE, spaceAfter=10, spaceBefore=5)


def time_badge(text):
    """Create a time badge like [0:00 - 5:00]"""
    t = Table([[Paragraph(text, styles['TimeBadge'])]], colWidths=[140])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), MED_BLUE),
        ('TEXTCOLOR', (0,0), (-1,-1), white),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('ROUNDEDCORNERS', [6, 6, 6, 6]),
    ]))
    return t


def term_table(term, definition):
    """Create a styled term definition box."""
    t = Table([
        [Paragraph(f'<b>{term}</b>', styles['StepNumber']), Paragraph(definition, styles['BodyText2'])]
    ], colWidths=[130, 380])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,-1), LIGHT_BLUE),
        ('BACKGROUND', (1,0), (1,-1), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, MED_BLUE),
        ('INNERGRID', (0,0), (-1,-1), 0.5, LIGHT_BLUE),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    return t


def add_image(filename, width=480):
    """Add an image from the powerbi_images folder."""
    path = os.path.join(IMG, filename)
    if os.path.exists(path):
        return Image(path, width=width, height=width*0.67, kind='proportional')
    return Paragraph(f"[Image not found: {filename}]", styles['BodyText2'])


# ============================================================
# Build PDF
# ============================================================
doc = SimpleDocTemplate(
    PDF_FILE,
    pagesize=A4,
    topMargin=20*mm,
    bottomMargin=20*mm,
    leftMargin=20*mm,
    rightMargin=20*mm,
    title="Power BI A-Z Beginner Workshop Guide",
    author="DTank54 - Business Analytics",
    subject="1-Hour Power BI Workshop for Absolute Beginners"
)

story = []
PW = A4[0] - 40*mm  # page width for content


# ============================================================
# COVER PAGE
# ============================================================
# Cover background table
cover = Table([
    [Paragraph("", styles['BodyText2'])],
    [Paragraph("", styles['BodyText2'])],
    [Spacer(1, 30)],
    [Paragraph("POWER BI", styles['CoverTitle'])],
    [Paragraph("A-Z BEGINNER WORKSHOP", styles['CoverTitle'])],
    [Spacer(1, 15)],
    [Paragraph("From Zero Knowledge to Complete Understanding", styles['CoverSubtitle'])],
    [Paragraph("1-Hour Hands-On Workshop Guide", styles['CoverSubtitle'])],
    [Spacer(1, 30)],
    [Paragraph("DTank54 - Business Analytics Group", ParagraphStyle(
        'coverorg', fontName=HEADING_FONT, fontSize=12, textColor=HexColor("#B0C4DE"), alignment=TA_CENTER
    ))],
    [Spacer(1, 10)],
    [Paragraph("A1 English Level | Step-by-Step | Visual Guide", ParagraphStyle(
        'coverlang', fontName=BODY_FONT, fontSize=10, textColor=HexColor("#90A4AE"), alignment=TA_CENTER
    ))],
], colWidths=[PW])

cover.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), DARK_BLUE),
    ('ALIGN', (0,0), (-1,-1), 'CENTER'),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('TOPPADDING', (0,0), (-1,-1), 0),
    ('BOTTOMPADDING', (0,0), (-1,-1), 0),
    ('ROUNDEDCORNERS', [10, 10, 10, 10]),
]))
story.append(cover)
story.append(PageBreak())


# ============================================================
# WORKSHOP OVERVIEW
# ============================================================
story.append(Paragraph("Workshop Overview", styles['SectionHeader']))
story.append(section_divider())

story.append(Paragraph(
    "Welcome to this Power BI workshop! This guide is made for people who have "
    "never used Power BI before. You do not need any special computer skills to follow this guide. "
    "We will go step by step, from the very beginning to a complete dashboard. "
    "After this 1-hour workshop, you will understand what Power BI is, how it works, "
    "and you will be able to create your own simple reports.",
    styles['BodyText2']
))

story.append(Spacer(1, 8))

# Workshop timeline table
timeline_data = [
    [Paragraph('<b>Time</b>', styles['TableHeader']),
     Paragraph('<b>Section</b>', styles['TableHeader']),
     Paragraph('<b>What You Will Learn</b>', styles['TableHeader'])],
    [Paragraph('0:00 - 5:00', styles['TableCell']),
     Paragraph('What is Power BI?', styles['TableCell']),
     Paragraph('Understand what Power BI does and why it is useful', styles['TableCell'])],
    [Paragraph('5:00 - 15:00', styles['TableCell']),
     Paragraph('Power BI Desktop Tour', styles['TableCell']),
     Paragraph('Learn the interface: ribbon, canvas, fields, visuals', styles['TableCell'])],
    [Paragraph('15:00 - 25:00', styles['TableCell']),
     Paragraph('Loading Your First Data', styles['TableCell']),
     Paragraph('Import Excel data and see it in Power BI', styles['TableCell'])],
    [Paragraph('25:00 - 35:00', styles['TableCell']),
     Paragraph('Building Your First Chart', styles['TableCell']),
     Paragraph('Create bar charts, line charts, cards, and maps', styles['TableCell'])],
    [Paragraph('35:00 - 45:00', styles['TableCell']),
     Paragraph('Data Cleaning with Power Query', styles['TableCell']),
     Paragraph('Clean and prepare your data like a professional', styles['TableCell'])],
    [Paragraph('45:00 - 52:00', styles['TableCell']),
     Paragraph('DAX Formulas (Simple)', styles['TableCell']),
     Paragraph('Write your first calculation formulas', styles['TableCell'])],
    [Paragraph('52:00 - 58:00', styles['TableCell']),
     Paragraph('Building a Dashboard', styles['TableCell']),
     Paragraph('Put everything together in a professional dashboard', styles['TableCell'])],
    [Paragraph('58:00 - 60:00', styles['TableCell']),
     Paragraph('Publish and Share', styles['TableCell']),
     Paragraph('Share your report online with others', styles['TableCell'])],
]

t = Table(timeline_data, colWidths=[80, 140, 290])
t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), DARK_BLUE),
    ('TEXTCOLOR', (0,0), (-1,0), white),
    ('BACKGROUND', (0,1), (-1,-1), white),
    ('ROWBACKGROUNDS', (0,1), (-1,-1), [white, BG_LIGHT]),
    ('BOX', (0,0), (-1,-1), 1, MED_BLUE),
    ('INNERGRID', (0,0), (-1,-1), 0.5, LIGHT_BLUE),
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('TOPPADDING', (0,0), (-1,-1), 5),
    ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ('LEFTPADDING', (0,0), (-1,-1), 6),
    ('RIGHTPADDING', (0,0), (-1,-1), 6),
]))
story.append(t)
story.append(Spacer(1, 12))

# What you need box
story.append(Paragraph(
    '<b>What You Need Before We Start:</b>',
    styles['SubHeader']
))
need_items = [
    "A computer with Windows operating system (Power BI Desktop works on Windows)",
    "Power BI Desktop installed (it is FREE - download from microsoft.com/power-bi/desktop)",
    "The Financial Sample Excel file (we will give you this file)",
    "An internet connection (only needed for the last step - publishing)",
]
for item in need_items:
    story.append(Paragraph(f"&nbsp;&nbsp;&nbsp;&bull;&nbsp;&nbsp;{item}", styles['BodyText2']))

story.append(Spacer(1, 8))
story.append(Paragraph(
    '<b>TIP:</b> Do not worry if you cannot remember everything. This guide is like a recipe book. '
    'You can always come back and check the steps again. The goal is to understand the PROCESS, '
    'not to memorize every button.',
    styles['TipBox']
))

story.append(PageBreak())


# ============================================================
# SECTION 1: WHAT IS POWER BI? (0:00 - 5:00)
# ============================================================
story.append(time_badge("0:00 - 5:00"))
story.append(Paragraph("Section 1: What is Power BI?", styles['SectionHeader']))
story.append(section_divider())

story.append(Paragraph(
    "Think about this: You have a big Excel file with thousands of rows of sales data. "
    "Your manager asks you: <i>\"How much did we sell last year? Which product was the best? "
    "Which country makes the most money?\"</i> If you use Excel, you need to create many formulas, "
    "many pivot tables, and many charts. This takes hours or even days.",
    styles['BodyText2']
))

story.append(Paragraph(
    "<b>Power BI is a tool that makes this work fast and easy.</b> It is made by Microsoft, "
    "and it takes your data (Excel, databases, websites, etc.) and turns it into beautiful, "
    "interactive charts and reports. The best part? You do not need to write complex formulas. "
    "Most of the time, you just click and drag.",
    styles['BodyText2']
))

story.append(Paragraph("Why Companies Use Power BI", styles['SubHeader']))
reasons = [
    "<b>Speed:</b> Create a full report in minutes, not hours. What takes a full day in Excel can take 15 minutes in Power BI.",
    "<b>Interactivity:</b> Your charts are interactive. You can click a country name and ALL charts update automatically. This is not possible in a normal Excel chart.",
    "<b>Sharing:</b> You can publish your report online and share it with a link. Your team can see it from anywhere, even from their phone.",
    "<b>Big Data:</b> Excel has a limit of about 1 million rows. Power BI can handle much more data, sometimes millions or billions of rows.",
    "<b>Free:</b> Power BI Desktop is completely free to download and use. You only pay if you want the online cloud features.",
]
for r in reasons:
    story.append(Paragraph(f"&nbsp;&nbsp;&bull;&nbsp;&nbsp;{r}", styles['BodyText2']))

story.append(Spacer(1, 6))

# Three parts of Power BI
story.append(Paragraph("The Three Parts of Power BI", styles['SubHeader']))
story.append(Paragraph(
    "Power BI is not just one program. It has three parts that work together:",
    styles['BodyText2']
))

parts_data = [
    [Paragraph('<b>Part</b>', styles['TableHeader']),
     Paragraph('<b>What is it?</b>', styles['TableHeader']),
     Paragraph('<b>What does it do?</b>', styles['TableHeader']),
     Paragraph('<b>Cost</b>', styles['TableHeader'])],
    [Paragraph('Power BI\nDesktop', styles['TableCell']),
     Paragraph('A program you install on your computer', styles['TableCell']),
     Paragraph('This is where you build your reports. You connect data, create charts, and write formulas here.', styles['TableCell']),
     Paragraph('FREE', styles['TableCell'])],
    [Paragraph('Power BI\nService', styles['TableCell']),
     Paragraph('A website (in the cloud)', styles['TableCell']),
     Paragraph('After you build a report in Desktop, you publish it here. Your team views reports in a web browser.', styles['TableCell']),
     Paragraph('Free or\nPaid', styles['TableCell'])],
    [Paragraph('Power BI\nMobile', styles['TableCell']),
     Paragraph('An app for phone and tablet', styles['TableCell']),
     Paragraph('Your team can view dashboards on their phones when they are traveling or at meetings.', styles['TableCell']),
     Paragraph('Free with\nService', styles['TableCell'])],
]

t = Table(parts_data, colWidths=[70, 120, 220, 70])
t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), DARK_BLUE),
    ('TEXTCOLOR', (0,0), (-1,0), white),
    ('ROWBACKGROUNDS', (0,1), (-1,-1), [white, BG_LIGHT]),
    ('BOX', (0,0), (-1,-1), 1, MED_BLUE),
    ('INNERGRID', (0,0), (-1,-1), 0.5, LIGHT_BLUE),
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('TOPPADDING', (0,0), (-1,-1), 5),
    ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ('LEFTPADDING', (0,0), (-1,-1), 5),
    ('RIGHTPADDING', (0,0), (-1,-1), 5),
]))
story.append(t)

story.append(Spacer(1, 8))
story.append(Paragraph(
    '<b>IMPORTANT:</b> In this workshop, we will only use Power BI Desktop (the free program on your computer). '
    'This is the most important part. Once you learn Desktop, the other parts are very easy.',
    styles['WarningBox']
))

story.append(Paragraph("What Power BI is NOT", styles['SubHeader']))
story.append(Paragraph(
    "Sometimes people confuse Power BI with other tools. Let me be clear about what Power BI is NOT, "
    "so you understand its purpose better:",
    styles['BodyText2']
))
not_items = [
    "Power BI is NOT a database. It does not store your company's data. It reads data FROM databases and Excel files.",
    "Power BI is NOT Excel. Excel is a spreadsheet where you type numbers. Power BI is a reporting tool that reads your numbers and shows them as charts.",
    "Power BI is NOT a programming language. You do not need to know coding to use Power BI. Most things are done by clicking.",
    "Power BI is NOT just charts. Yes, it creates charts, but it can also answer business questions like \"Why did sales drop last month?\" through interactive exploration.",
]
for item in not_items:
    story.append(Paragraph(f"&nbsp;&nbsp;&bull;&nbsp;&nbsp;{item}", styles['BodyText2']))

story.append(PageBreak())


# ============================================================
# SECTION 2: POWER BI DESKTOP TOUR (5:00 - 15:00)
# ============================================================
story.append(time_badge("5:00 - 15:00"))
story.append(Paragraph("Section 2: Power BI Desktop Tour", styles['SectionHeader']))
story.append(section_divider())

story.append(Paragraph(
    "Before we do anything, let us learn what you see when you open Power BI Desktop. "
    "Think of it like learning where the steering wheel, gas pedal, and brakes are in a car. "
    "You need to know these locations before you can drive. It is the same with Power BI. "
    "Let us look at the screen together.",
    styles['BodyText2']
))

story.append(Spacer(1, 6))
story.append(Paragraph("The Main Screen Explained", styles['SubHeader']))
story.append(Paragraph(
    "When you open Power BI Desktop, you will see a big window with different areas. "
    "Each area has a job to do. Look at the picture below. We numbered each part from 1 to 7. "
    "Let me explain what each number means:",
    styles['BodyText2']
))

# Insert UI diagram
story.append(add_image("01_pbi_desktop_ui.png", width=470))
story.append(Spacer(1, 6))
story.append(Paragraph(
    '<i>Figure 1: Power BI Desktop main interface with labeled parts</i>',
    styles['SmallNote']
))
story.append(Spacer(1, 8))

# Part descriptions
parts_desc = [
    ("1. Title Bar (Top)", "This shows the name of your report. When you save your file, this name appears here. "
     "Think of it like the title of a document in Microsoft Word."),
    ("2. Ribbon (Below Title)", "This is like the ribbon in Microsoft Office. It has buttons for everything you can do: "
     "load data, change format, add new pages, and more. The most used tab is \"Home\". We will use buttons from here many times."),
    ("3. Pages Panel (Left)", "A Power BI report can have many pages, like slides in PowerPoint. This panel shows all your pages. "
     "You can click a page name to switch to that page. You can also add new pages here."),
    ("4. Report Canvas (Middle)", "This is the big area in the center. This is your workspace. When you create charts, they appear here. "
     "You can put many charts on one page, move them, and resize them."),
    ("5. Visualizations Pane (Right, Top)", "This shows all the types of charts you can create: bar chart, line chart, pie chart, map, "
     "table, card (for showing a single number), and many more. Just click one to create it."),
    ("6. Fields Pane (Right, Bottom)", "This is VERY important. It shows all the columns from your data. Each column name appears here. "
     "You drag these names to your chart to show that data. For example, drag \"Product\" to make a chart show products."),
    ("7. Status Bar (Bottom)", "This shows helpful information: how many rows your data has, how much memory Power BI is using, "
     "and if there are any errors."),
]
for title, desc in parts_desc:
    story.append(term_table(title, desc))
    story.append(Spacer(1, 4))

story.append(Spacer(1, 6))

# Field types explanation
story.append(Paragraph("Understanding Field Types in the Fields Pane", styles['SubHeader']))
story.append(Paragraph(
    "When you look at the Fields pane on the right side, you will see column names with small icons next to them. "
    "These icons tell you what TYPE of data is in that column. There are three main types:",
    styles['BodyText2']
))

ft_data = [
    [Paragraph('<b>Icon</b>', styles['TableHeader']),
     Paragraph('<b>Type</b>', styles['TableHeader']),
     Paragraph('<b>Meaning</b>', styles['TableHeader']),
     Paragraph('<b>Example</b>', styles['TableHeader'])],
    [Paragraph('Calendar\n(ABC with date)', styles['TableCell']),
     Paragraph('Date', styles['TableCell']),
     Paragraph('Contains dates like day, month, year. Power BI uses this for time-based charts.', styles['TableCell']),
     Paragraph('01/01/2013', styles['TableCell'])],
    [Paragraph('Abc', styles['TableCell']),
     Paragraph('Text', styles['TableCell']),
     Paragraph('Contains words or letters. Cannot be used for math calculations.', styles['TableCell']),
     Paragraph('Montana, USA', styles['TableCell'])],
    [Paragraph('123\n(Sigma icon)', styles['TableCell']),
     Paragraph('Number', styles['TableCell']),
     Paragraph('Contains numbers. Can be used for math: sum, average, min, max.', styles['TableCell']),
     Paragraph('$1,275, 250', styles['TableCell'])],
]
t = Table(ft_data, colWidths=[90, 60, 210, 110])
t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), DARK_BLUE),
    ('TEXTCOLOR', (0,0), (-1,0), white),
    ('ROWBACKGROUNDS', (0,1), (-1,-1), [white, BG_LIGHT]),
    ('BOX', (0,0), (-1,-1), 1, MED_BLUE),
    ('INNERGRID', (0,0), (-1,-1), 0.5, LIGHT_BLUE),
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('TOPPADDING', (0,0), (-1,-1), 5),
    ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ('LEFTPADDING', (0,0), (-1,-1), 5),
    ('RIGHTPADDING', (0,0), (-1,-1), 5),
]))
story.append(t)

story.append(Spacer(1, 8))
story.append(Paragraph(
    '<b>REMEMBER:</b> You do NOT need to memorize all these parts right now. Come back to this page when you forget. '
    'The most important parts are: the Report Canvas (where your charts go), the Visualizations pane (where you pick chart types), '
    'and the Fields pane (where your data columns are). If you know these three, you can do 80% of the work.',
    styles['TipBox']
))

story.append(PageBreak())


# ============================================================
# SECTION 3: LOADING YOUR FIRST DATA (15:00 - 25:00)
# ============================================================
story.append(time_badge("15:00 - 25:00"))
story.append(Paragraph("Section 3: Loading Your First Data", styles['SectionHeader']))
story.append(section_divider())

story.append(Paragraph(
    "Now let us do something real! We will load our Excel file into Power BI. This is the first step "
    "in every Power BI project. You always start by loading data. Without data, Power BI has nothing to show.",
    styles['BodyText2']
))

story.append(Paragraph("Our Sample Data: Financial Sample Excel", styles['SubHeader']))
story.append(Paragraph(
    "We will use a file called <b>\"Financial Sample.xlsx\"</b>. This is a practice file from Microsoft that contains "
    "fake sales data for a company. It has 700 rows (700 sales records) and 12 columns. Here is what each column means:",
    styles['BodyText2']
))

col_data = [
    [Paragraph('<b>Column</b>', styles['TableHeader']),
     Paragraph('<b>Type</b>', styles['TableHeader']),
     Paragraph('<b>What It Means</b>', styles['TableHeader']),
     Paragraph('<b>Example</b>', styles['TableHeader'])],
    [Paragraph('Date', styles['TableCell']), Paragraph('Date', styles['TableCell']),
     Paragraph('The date of the sale', styles['TableCell']), Paragraph('01/01/2013', styles['TableCell'])],
    [Paragraph('Product', styles['TableCell']), Paragraph('Text', styles['TableCell']),
     Paragraph('The name of the product sold', styles['TableCell']), Paragraph('Montana, Paseo', styles['TableCell'])],
    [Paragraph('Segment', styles['TableCell']), Paragraph('Text', styles['TableCell']),
     Paragraph('The customer type (Government, Enterprise, etc.)', styles['TableCell']), Paragraph('Government', styles['TableCell'])],
    [Paragraph('Country', styles['TableCell']), Paragraph('Text', styles['TableCell']),
     Paragraph('The country where the sale was made', styles['TableCell']), Paragraph('USA, Canada', styles['TableCell'])],
    [Paragraph('Units Sold', styles['TableCell']), Paragraph('Number', styles['TableCell']),
     Paragraph('How many items were sold', styles['TableCell']), Paragraph('250', styles['TableCell'])],
    [Paragraph('Sale Price', styles['TableCell']), Paragraph('Number', styles['TableCell']),
     Paragraph('Price of one item', styles['TableCell']), Paragraph('$5.10', styles['TableCell'])],
    [Paragraph('Sales', styles['TableCell']), Paragraph('Number', styles['TableCell']),
     Paragraph('Total money from the sale (Units x Price)', styles['TableCell']), Paragraph('$1,275', styles['TableCell'])],
    [Paragraph('Profit', styles['TableCell']), Paragraph('Number', styles['TableCell']),
     Paragraph('Money earned after costs', styles['TableCell']), Paragraph('$320', styles['TableCell'])],
    [Paragraph('Discounts', styles['TableCell']), Paragraph('Number', styles['TableCell']),
     Paragraph('Price reduction given to customer', styles['TableCell']), Paragraph('$50', styles['TableCell'])],
    [Paragraph('COGS', styles['TableCell']), Paragraph('Number', styles['TableCell']),
     Paragraph('Cost of making the product', styles['TableCell']), Paragraph('$850', styles['TableCell'])],
]
t = Table(col_data, colWidths=[75, 50, 220, 100])
t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), DARK_BLUE),
    ('TEXTCOLOR', (0,0), (-1,0), white),
    ('ROWBACKGROUNDS', (0,1), (-1,-1), [white, BG_LIGHT]),
    ('BOX', (0,0), (-1,-1), 1, MED_BLUE),
    ('INNERGRID', (0,0), (-1,-1), 0.5, LIGHT_BLUE),
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('TOPPADDING', (0,0), (-1,-1), 4),
    ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ('LEFTPADDING', (0,0), (-1,-1), 4),
    ('RIGHTPADDING', (0,0), (-1,-1), 4),
    ('FONTSIZE', (0,0), (-1,-1), 8),
]))
story.append(t)

story.append(Spacer(1, 10))
story.append(Paragraph("Step-by-Step: Loading the Data", styles['SubHeader']))

steps_load = [
    ("<b>Step 1: Open Power BI Desktop.</b> Find it in your Start menu or desktop shortcut. "
     "When it opens, you will see the welcome screen. Click the X to close it, or click 'Get Data'."),
    ("<b>Step 2: Click 'Get Data' on the Home ribbon.</b> Look at the top of the screen. "
     "Find the button that says 'Get Data'. Click it. A menu will appear."),
    ("<b>Step 3: Choose 'Excel'.</b> In the menu, look for 'Excel' and click it. "
     "Then click the 'Connect' button at the bottom of the window."),
    ("<b>Step 4: Find your file.</b> A file browser window will open. Navigate to where you saved "
     "the 'Financial Sample.xlsx' file. Click on it and click 'Open'."),
    ("<b>Step 5: The Navigator window appears.</b> This is an important window. It shows you what is inside your Excel file. "
     "You will see 'Financials' and 'Sheet1'. Select 'Financials' by checking the box next to it. "
     "On the right side, you can preview the data."),
]
for i, step in enumerate(steps_load):
    story.append(Paragraph(step, styles['BodyText2']))

story.append(Spacer(1, 4))
story.append(add_image("02_navigator_dialog.png", width=420))
story.append(Paragraph(
    '<i>Figure 2: The Navigator window - select your data and preview it before loading</i>',
    styles['SmallNote']
))
story.append(Spacer(1, 6))

steps_load2 = [
    ("<b>Step 6: Click 'Load'.</b> After selecting 'Financials' and seeing the preview, click the 'Load' button. "
     "Power BI will now import the data. This takes only a few seconds."),
    ("<b>Step 7: Look at the Fields pane.</b> After loading, look at the right side of your screen. "
     "You should see a table called 'Financials' with 12 column names under it. These are the 12 columns "
     "from your Excel file. They are now in Power BI and ready to use."),
]
for step in steps_load2:
    story.append(Paragraph(step, styles['BodyText2']))

story.append(Spacer(1, 6))
story.append(Paragraph(
    '<b>Congratulations!</b> You just loaded your first data into Power BI! This is the foundation of everything. '
    'Every Power BI project starts with loading data. Now your data is ready, and we can start creating charts.',
    styles['TipBox']
))

story.append(PageBreak())


# ============================================================
# SECTION 4: BUILDING YOUR FIRST CHARTS (25:00 - 35:00)
# ============================================================
story.append(time_badge("25:00 - 35:00"))
story.append(Paragraph("Section 4: Building Your First Charts", styles['SectionHeader']))
story.append(section_divider())

story.append(Paragraph(
    "This is the most fun part! Now you will create charts. In Power BI, creating a chart is very simple. "
    "You do not need to draw anything. You just pick a chart type and drag your data into it. Power BI "
    "draws the chart for you. Let me show you the process step by step.",
    styles['BodyText2']
))

story.append(add_image("05_build_visualization.png", width=470))
story.append(Paragraph(
    '<i>Figure 3: How to build a visualization - 3 simple steps: find field, drag to canvas, format</i>',
    styles['SmallNote']
))
story.append(Spacer(1, 8))

story.append(Paragraph("How to Create ANY Chart (The Golden Rule)", styles['SubHeader']))
story.append(Paragraph(
    "Every chart in Power BI is created the same way. Remember these three steps, and you can create any chart:",
    styles['BodyText2']
))

golden_steps = [
    "<b>Step 1: Click a chart icon.</b> Go to the Visualizations pane on the right side. Click the type of chart you want. "
    "For example, click the 'Stacked Column Chart' icon (it looks like 3 vertical bars). An empty chart will appear on your canvas.",
    "<b>Step 2: Drag fields to the chart.</b> Look at the Fields pane below. You will see areas under the chart like 'Axis', 'Legend', and 'Values'. "
    "Drag column names from the Fields pane into these areas. For example, drag 'Product' to 'Axis' and 'Sales' to 'Values'.",
    "<b>Step 3: The chart is ready!</b> Power BI automatically fills the chart with your data. If it does not look right, "
    "you can remove a field (click the X next to the field name) and try a different one.",
]
for step in golden_steps:
    story.append(Paragraph(f"&nbsp;&nbsp;&bull;&nbsp;&nbsp;{step}", styles['BodyText2']))

story.append(Spacer(1, 8))

# Chart exercises
story.append(Paragraph("Practice Exercises: Create These 5 Charts", styles['SubHeader']))
story.append(Paragraph(
    "Now let us practice. Follow these instructions exactly. I will tell you what to click and drag. "
    "Each chart will answer a different business question:",
    styles['BodyText2']
))

exercises = [
    ("Chart 1: Sales by Product (Bar Chart)",
     "This answers: <i>\"Which product sells the most?\"</i>",
     "1. Click the Stacked Column Chart icon (vertical bars).<br/>"
     "2. Drag 'Product' from Fields pane to the 'Axis' area.<br/>"
     "3. Drag 'Sales' from Fields pane to the 'Values' area.<br/>"
     "4. Done! You should see bars for each product with their total sales."),
    ("Chart 2: Revenue Trend Over Time (Line Chart)",
     "This answers: <i>\"Are sales going up or down over months?\"</i>",
     "1. Click the Line Chart icon (looks like a line going up).<br/>"
     "2. Drag 'Date' to the 'Axis' area.<br/>"
     "3. Drag 'Sales' to the 'Values' area.<br/>"
     "4. Power BI groups dates by month or year automatically."),
    ("Chart 3: Show Total Revenue (Card)",
     "This answers: <i>\"What is our total revenue?\"</i>",
     "1. Click the Card icon (it shows a big number like a KPI).<br/>"
     "2. Drag 'Sales' to the 'Fields' area under the chart.<br/>"
     "3. Done! A big number appears. This is the total of all sales."),
    ("Chart 4: Revenue by Country (Map)",
     "This answers: <i>\"Which countries make the most money?\"</i>",
     "1. Click the Filled Map icon (looks like a world map).<br/>"
     "2. Drag 'Country' to the 'Location' area.<br/>"
     "3. Drag 'Sales' to the 'Size' area.<br/>"
     "4. A map appears with circles for each country. Bigger circle = more sales."),
    ("Chart 5: Segment Split (Pie Chart)",
     "This answers: <i>\"What percentage of sales comes from each customer type?\"</i>",
     "1. Click the Pie Chart icon.<br/>"
     "2. Drag 'Segment' to the 'Legend' area.<br/>"
     "3. Drag 'Sales' to the 'Values' area.<br/>"
     "4. A pie chart appears showing the share of each segment."),
]

for title, question, steps in exercises:
    story.append(Paragraph(title, styles['StepNumber']))
    story.append(Paragraph(question, styles['BodyTextIndent']))
    story.append(Paragraph(steps, styles['CodeBlock']))

story.append(Spacer(1, 6))
story.append(Paragraph(
    '<b>TIP:</b> If a chart looks wrong, do not worry! The most common mistake is putting a text field in '
    'the "Values" area. The "Values" area should always have a NUMBER field (like Sales, Profit). The "Axis" '
    'or "Legend" area should have TEXT fields (like Product, Country). If you make a mistake, just click the X '
    'next to the field name to remove it and try again.',
    styles['WarningBox']
))

story.append(PageBreak())


# ============================================================
# SECTION 5: POWER QUERY - DATA CLEANING (35:00 - 45:00)
# ============================================================
story.append(time_badge("35:00 - 45:00"))
story.append(Paragraph("Section 5: Data Cleaning with Power Query", styles['SectionHeader']))
story.append(section_divider())

story.append(Paragraph(
    "In real life, data is never perfect. Sometimes column names are unclear, sometimes there are empty rows, "
    "sometimes dates are in the wrong format. Before you can create good charts, you need to clean your data. "
    "Power BI has a built-in tool for this called <b>Power Query Editor</b>.",
    styles['BodyText2']
))

story.append(term_table("Power Query Editor",
    "A separate window inside Power BI where you clean and transform (change) your data before using it for charts. "
    "Think of it like a washing machine for data: it takes dirty data and makes it clean and ready to use."))

story.append(Spacer(1, 6))
story.append(Paragraph("What Power Query Editor Looks Like", styles['SubHeader']))
story.append(Paragraph(
    "To open Power Query Editor, click 'Transform Data' on the Home ribbon. A new window will open. "
    "Let me show you what you see:",
    styles['BodyText2']
))

story.append(add_image("03_power_query_editor.png", width=470))
story.append(Paragraph(
    '<i>Figure 4: Power Query Editor - the data cleaning workspace</i>',
    styles['SmallNote']
))
story.append(Spacer(1, 6))

story.append(Paragraph("The Three Areas of Power Query Editor", styles['SubHeader']))

pq_areas = [
    ("1. Query List (Left Side)", "Shows all your data tables. If you have multiple Excel sheets, you will see multiple items here. "
     "Click on any item to see its data in the center."),
    ("2. Data Preview (Center)", "Shows your data in a table format. This is where you see the actual data rows and columns. "
     "You can click on a column header to sort it, right-click to remove a column, or use the ribbon buttons to make changes."),
    ("3. Applied Steps (Right Side)", "This is VERY important. Every change you make (remove a column, rename something, filter rows) "
     "is recorded here as a 'step'. You can click on any step to see how your data looked before that step. "
     "If you make a mistake, you can delete a step and the change is undone. This is like having an 'undo' history that you can go back to anytime."),
]
for title, desc in pq_areas:
    story.append(term_table(title, desc))
    story.append(Spacer(1, 3))

story.append(Spacer(1, 6))
story.append(Paragraph("Common Cleaning Tasks (Practice These)", styles['SubHeader']))
story.append(Paragraph(
    "Here are the most common data cleaning operations you will do. Try each one with your sample data:",
    styles['BodyText2']
))

clean_tasks = [
    ("<b>Rename a Column:</b> Right-click the column header and select 'Rename'. Type a new name. "
     "For example, rename 'COGS' to 'Cost of Goods Sold' so other people can understand it better."),
    ("<b>Remove a Column:</b> Right-click the column header and select 'Remove'. This deletes the column. "
     "Do this when a column is not needed for your analysis. Do NOT delete columns you might need later."),
    ("<b>Remove Empty Rows:</b> Go to Home ribbon > Remove Rows > Remove Blank Rows. "
     "Empty rows can cause errors in your charts. Always remove them."),
    ("<b>Change Data Type:</b> Sometimes Power BI reads a number as text. Click the column header, then go to the ribbon "
     "and change the type from 'Text' to 'Decimal Number' or 'Whole Number'. The small icon next to the column name shows the current type."),
    ("<b>Filter Rows:</b> Click the filter icon (small triangle) at the top of a column. Uncheck the values you do NOT want. "
     "For example, you can filter to show only 'USA' in the Country column."),
]
for task in clean_tasks:
    story.append(Paragraph(f"&nbsp;&nbsp;&bull;&nbsp;&nbsp;{task}", styles['BodyText2']))

story.append(Spacer(1, 6))
story.append(Paragraph(
    '<b>REMEMBER:</b> After you finish cleaning in Power Query Editor, click "Close & Apply" in the top-left corner. '
    'This saves all your changes and takes you back to the main Power BI window. If you forget to click this, '
    'your changes will NOT be saved!',
    styles['WarningBox']
))

story.append(PageBreak())


# ============================================================
# SECTION 6: DAX FORMULAS - SIMPLE (45:00 - 52:00)
# ============================================================
story.append(time_badge("45:00 - 52:00"))
story.append(Paragraph("Section 6: DAX Formulas (Simple Ones!)", styles['SectionHeader']))
story.append(section_divider())

story.append(Paragraph(
    "Sometimes the data in your file is not enough. For example, your file has 'Sales' and 'COGS' (cost), "
    "but it does not have 'Profit Margin' (profit as a percentage). You want to show Profit Margin in your chart. "
    "How? You write a DAX formula to calculate it.",
    styles['BodyText2']
))

story.append(term_table("DAX",
    "Data Analysis Expressions. It is a formula language used in Power BI to create custom calculations. "
    "It looks a bit like Excel formulas but is more powerful. You write DAX to create new columns or new measures."))

story.append(Spacer(1, 4))

story.append(term_table("Measure",
    "A DAX formula that calculates a result (like a total or average). Measures are dynamic - they change based on "
    "filters. For example, a 'Total Sales' measure shows the total for ALL data, but if you add a Country filter, "
    "it automatically shows the total for just that country. This is the magic of measures!"))

story.append(Spacer(1, 6))
story.append(add_image("08_dax_concept.png", width=460))
story.append(Paragraph(
    '<i>Figure 5: DAX formula explained - 3 parts: Name, Equals, Calculation</i>',
    styles['SmallNote']
))
story.append(Spacer(1, 6))

story.append(Paragraph("How to Write a DAX Measure", styles['SubHeader']))
story.append(Paragraph(
    "There are two ways to create a measure in Power BI:",
    styles['BodyText2']
))
story.append(Paragraph(
    "&nbsp;&nbsp;&bull;&nbsp;&nbsp;<b>Way 1:</b> Click 'New Measure' on the Home ribbon",
    styles['BodyText2']
))
story.append(Paragraph(
    "&nbsp;&nbsp;&bull;&nbsp;&nbsp;<b>Way 2:</b> Right-click on your table name in the Fields pane, then select 'New Measure'",
    styles['BodyText2']
))
story.append(Paragraph(
    "Both ways open a formula bar at the top where you type your formula. After typing, press Enter.",
    styles['BodyText2']
))

story.append(Spacer(1, 6))
story.append(Paragraph("5 Simple DAX Formulas to Practice", styles['SubHeader']))

dax_formulas = [
    ("Total Sales", "SUM(Financials[Sales])",
     "Adds up all values in the Sales column. SUM means 'total'. The result is one big number: total sales for all 700 rows."),
    ("Average Profit", "AVERAGE(Financials[Profit])",
     "Calculates the average (mean) of the Profit column. Divide total profit by the number of rows to get the average profit per sale."),
    ("Total Orders", "COUNTROWS(Financials)",
     "Counts how many rows (records) are in the table. Since each row is one sale, this tells you how many sales you had in total."),
    ("Profit Margin %", "DIVIDE(SUM(Financials[Profit]), SUM(Financials[Sales]))",
     "Divides total profit by total sales. The result is a decimal like 0.42, which means 42%. Click the % icon on the ribbon to format it."),
    ("High Value Sales", "CALCULATE(SUM(Financials[Sales]), Financials[Sales] > 1000)",
     "Shows the total of sales, but ONLY for sales where the amount is more than 1000. CALCULATE is a filter function - it changes what the measure calculates."),
]

for i, (name, formula, explanation) in enumerate(dax_formulas, 1):
    story.append(Paragraph(f"<b>{i}. {name}</b>", styles['StepNumber']))
    story.append(Paragraph(f'<font face="{MONO_FONT}" color="{MED_BLUE.hexval()}">{name} = {formula}</font>', styles['CodeBlock']))
    story.append(Paragraph(explanation, styles['BodyText2']))

story.append(Spacer(1, 6))
story.append(Paragraph(
    '<b>Do Not Worry!</b> DAX can be very complex, but you do NOT need to learn everything today. '
    'Start with SUM, AVERAGE, and COUNTROWS. These three formulas cover 80% of what beginners need. '
    'As you use Power BI more, you will naturally learn more formulas.',
    styles['TipBox']
))

story.append(PageBreak())


# ============================================================
# SECTION 7: BUILDING A DASHBOARD (52:00 - 58:00)
# ============================================================
story.append(time_badge("52:00 - 58:00"))
story.append(Paragraph("Section 7: Building a Complete Dashboard", styles['SectionHeader']))
story.append(section_divider())

story.append(Paragraph(
    "A dashboard is a collection of charts on one or more pages that tells a story about your data. "
    "Think of it like the dashboard in a car: it shows speed, fuel, temperature all in one place. "
    "A Power BI dashboard shows sales, profit, trends, and comparisons all in one place.",
    styles['BodyText2']
))

story.append(Paragraph("What Makes a Good Dashboard?", styles['SubHeader']))
story.append(Paragraph(
    "A good dashboard is not just random charts. It follows a structure. Here is the best structure for beginners:",
    styles['BodyText2']
))

dash_structure = [
    ("<b>Top Row: KPI Cards.</b> Show 3-4 big numbers at the top: Total Revenue, Total Profit, Total Units Sold, Average Discount. "
     "These give the viewer an instant summary. Use the Card visualization for these."),
    ("<b>Middle Row: Main Charts.</b> Put your most important charts here. A bar chart for Sales by Product on the left, "
     "and a line chart for Revenue Trend over time on the right. These are the charts that answer the main business questions."),
    ("<b>Bottom Row: Details.</b> A pie chart for Segment breakdown, a map for Country distribution, and a slicer (filter) "
     "so users can interact with the dashboard."),
    ("<b>Slicers (Filters):</b> Add 1-2 slicers so users can filter the entire dashboard. A 'Country' slicer and a 'Year' slicer "
     "are very useful. When a user clicks 'USA', ALL charts update to show only USA data."),
]
for item in dash_structure:
    story.append(Paragraph(f"&nbsp;&nbsp;&bull;&nbsp;&nbsp;{item}", styles['BodyText2']))

story.append(Spacer(1, 6))
story.append(add_image("06_dashboard_layout.png", width=470))
story.append(Paragraph(
    '<i>Figure 6: A complete dashboard layout - cards on top, charts in middle, details and slicers at bottom</i>',
    styles['SmallNote']
))
story.append(Spacer(1, 6))

story.append(Paragraph("What is a Slicer? (Important!)", styles['SubHeader']))
story.append(Paragraph(
    "A slicer is a special visualization that acts as a FILTER for your entire dashboard. When you click a button in a slicer, "
    "ALL charts on that page change to show only that filtered data. For example, if you have a 'Country' slicer with buttons "
    "for USA, Canada, and Germany, and you click 'USA', then your bar chart, line chart, pie chart, and card all change to show "
    "only data for USA. This is the most powerful feature of Power BI.",
    styles['BodyText2']
))

story.append(Paragraph(
    "<b>To create a slicer:</b> Click the Slicer icon in Visualizations (it looks like a funnel or filter). "
    "Then drag 'Country' (or any column) from Fields to the 'Field' area. The slicer appears with buttons for each country. "
    "Try clicking different countries and watch all your other charts change!",
    styles['BodyText2']
))

story.append(Spacer(1, 6))
story.append(Paragraph("How to Resize and Move Charts", styles['SubHeader']))
story.append(Paragraph(
    "To make your dashboard look professional, you need to arrange your charts neatly:",
    styles['BodyText2']
))
arrange_tips = [
    "<b>Move a chart:</b> Click on the chart and hold the mouse button. Then drag it to a new position.",
    "<b>Resize a chart:</b> Click on the chart. You will see small dots (handles) on the edges and corners. "
    "Click and drag any handle to make the chart bigger or smaller.",
    "<b>Align charts:</b> Select two or more charts (hold Ctrl and click each one). Then go to the ribbon and click "
    "'Align' > 'Align Left' or 'Distribute Vertically'. This makes charts line up perfectly.",
    "<b>Turn on Snap to Grid:</b> Go to View ribbon and turn on 'Snap to Grid'. This makes charts automatically align "
    "to an invisible grid, keeping everything neat and organized.",
]
for tip in arrange_tips:
    story.append(Paragraph(f"&nbsp;&nbsp;&bull;&nbsp;&nbsp;{tip}", styles['BodyText2']))

story.append(PageBreak())


# ============================================================
# SECTION 8: DATA MODEL (Bonus)
# ============================================================
story.append(Paragraph("Understanding the Data Model", styles['SectionHeader']))
story.append(section_divider())

story.append(Paragraph(
    "When you work with more complex data (multiple tables), you need to connect the tables together. "
    "This is called 'Data Modeling'. Think of it like connecting puzzle pieces. Each table is a puzzle piece, "
    "and the connections between them create the full picture.",
    styles['BodyText2']
))

story.append(term_table("Data Model",
    "The structure that defines how tables in your data connect to each other. For example, your sales table "
    "connects to your product table through a shared 'ProductKey' column. This connection lets you create charts "
    "that use columns from multiple tables."))

story.append(Spacer(1, 6))
story.append(add_image("04_data_model.png", width=440))
story.append(Paragraph(
    '<i>Figure 7: Data Model view - Fact table in center, Dimension tables connected around it (Star Schema)</i>',
    styles['SmallNote']
))
story.append(Spacer(1, 6))

story.append(Paragraph("The Star Schema (Best Practice)", styles['SubHeader']))
story.append(Paragraph(
    "The best way to organize data in Power BI is called a 'Star Schema'. It has one big table in the center "
    "called the <b>Fact table</b> (it contains the numbers - sales, profit, quantities), and several smaller tables "
    "around it called <b>Dimension tables</b> (they contain descriptions - product names, country names, dates). "
    "The Dimension tables connect to the Fact table through shared columns (keys).",
    styles['BodyText2']
))

star_data = [
    [Paragraph('<b>Table Type</b>', styles['TableHeader']),
     Paragraph('<b>Purpose</b>', styles['TableHeader']),
     Paragraph('<b>Contains</b>', styles['TableHeader']),
     Paragraph('<b>Example</b>', styles['TableHeader'])],
    [Paragraph('Fact Table\n(Center)', styles['TableCell']),
     Paragraph('Stores the numbers and events', styles['TableCell']),
     Paragraph('Sales, Profit, Units Sold, Dates, Keys', styles['TableCell']),
     Paragraph('Financials\n(700 rows)', styles['TableCell'])],
    [Paragraph('Dim Tables\n(Around)', styles['TableCell']),
     Paragraph('Stores descriptions and categories', styles['TableCell']),
     Paragraph('Product names, Country names, Segment types', styles['TableCell']),
     Paragraph('DimProduct\nDimCountry', styles['TableCell'])],
]
t = Table(star_data, colWidths=[80, 130, 160, 100])
t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), DARK_BLUE),
    ('TEXTCOLOR', (0,0), (-1,0), white),
    ('ROWBACKGROUNDS', (0,1), (-1,-1), [white, BG_LIGHT]),
    ('BOX', (0,0), (-1,-1), 1, MED_BLUE),
    ('INNERGRID', (0,0), (-1,-1), 0.5, LIGHT_BLUE),
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('TOPPADDING', (0,0), (-1,-1), 5),
    ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ('LEFTPADDING', (0,0), (-1,-1), 5),
    ('RIGHTPADDING', (0,0), (-1,-1), 5),
]))
story.append(t)

story.append(Spacer(1, 6))
story.append(Paragraph(
    '<b>NOTE:</b> If your data comes from a single Excel sheet (like our Financial Sample), you do not NEED to create '
    'a data model. Power BI works fine with one table. But when you work with real company data, you will usually have '
    'multiple tables, and then the data model becomes very important. This is a topic for the next level of learning.',
    styles['WarningBox']
))

story.append(PageBreak())


# ============================================================
# SECTION 8: PUBLISH AND SHARE (58:00 - 60:00)
# ============================================================
story.append(time_badge("58:00 - 60:00"))
story.append(Paragraph("Section 8: Publish and Share Your Report", styles['SectionHeader']))
story.append(section_divider())

story.append(Paragraph(
    "You built your dashboard on your computer. But what if you want your manager or team to see it? "
    "You need to publish it to the cloud. Power BI makes this very easy.",
    styles['BodyText2']
))

story.append(add_image("07_publish_flow.png", width=460))
story.append(Paragraph(
    '<i>Figure 8: Publishing flow - from Desktop to Cloud to Sharing with your team</i>',
    styles['SmallNote']
))
story.append(Spacer(1, 6))

story.append(Paragraph("How to Publish (3 Simple Steps)", styles['SubHeader']))
pub_steps = [
    ("<b>Step 1: Save your file.</b> Press Ctrl+S or click File > Save. Choose a location and save your .pbix file. "
     "This is like saving any document. The .pbix file is your Power BI report file."),
    ("<b>Step 2: Click 'Publish'.</b> Go to the Home ribbon and click the 'Publish' button. "
     "A window will appear asking you to select a workspace. Choose 'My workspace' (the default) and click 'Select'. "
     "Power BI uploads your report to the cloud."),
    ("<b>Step 3: View it online.</b> After publishing, a link appears. Click it. Your default web browser opens "
     "and shows your report in Power BI Service. From here, you can share it with others by clicking the 'Share' button."),
]
for step in pub_steps:
    story.append(Paragraph(f"&nbsp;&nbsp;&bull;&nbsp;&nbsp;{step}", styles['BodyText2']))

story.append(Spacer(1, 8))
story.append(Paragraph(
    '<b>What You Need for Publishing:</b> A free Microsoft account (like Outlook.com or Hotmail.com). '
    'If you have a work email with Microsoft 365, that works too. You sign in to Power BI Service '
    '(app.powerbi.com) with this account. The free account lets you publish and share with a few people. '
    'Companies that need to share with many people buy a Power BI Pro license.',
    styles['TipBox']
))

story.append(Spacer(1, 6))
story.append(Paragraph("What Happens After Publishing?", styles['SubHeader']))
after_pub = [
    "<b>Your report is online:</b> Anyone with the link can view your dashboard in a web browser. They do not need Power BI installed.",
    "<b>It stays interactive:</b> Viewers can still click slicers, hover over charts, and explore the data just like you can in Desktop.",
    "<b>Automatic refresh:</b> If your source data (like an Excel file) changes, you can set up automatic refresh so your report updates too.",
    "<b>Mobile access:</b> Viewers can install the Power BI mobile app on their phone or tablet and view the dashboard on the go.",
]
for item in after_pub:
    story.append(Paragraph(f"&nbsp;&nbsp;&bull;&nbsp;&nbsp;{item}", styles['BodyText2']))

story.append(PageBreak())


# ============================================================
# SUMMARY PAGE
# ============================================================
story.append(Paragraph("Workshop Summary: What You Learned Today", styles['SectionHeader']))
story.append(section_divider())

story.append(Paragraph(
    "Congratulations! You completed the 1-hour Power BI workshop. Let us review what you learned. "
    "You started with zero knowledge, and now you understand the complete process. Here is everything "
    "we covered:",
    styles['BodyText2']
))

summary_items = [
    ("<b>What Power BI is:</b> A free tool by Microsoft that turns data into beautiful, interactive charts and reports.",
     "You understand that Power BI is faster than Excel for reporting, can handle more data, and lets you share results online."),
    ("<b>The Power BI Desktop interface:</b> You know where everything is - the ribbon, canvas, visualizations pane, and fields pane.",
     "You can navigate the interface without getting lost."),
    ("<b>Loading data:</b> You successfully loaded an Excel file into Power BI using the Get Data button.",
     "You know about the Navigator window and how to preview data before loading."),
    ("<b>Creating charts:</b> You built 5 types of charts: bar chart, line chart, card, map, and pie chart.",
     "You know the golden rule: click a chart icon, drag fields to Axis/Values, and the chart is ready."),
    ("<b>Power Query Editor:</b> You learned how to clean data - rename columns, remove columns, filter rows, and change data types.",
     "You know the difference between Data Preview, Query List, and Applied Steps."),
    ("<b>DAX formulas:</b> You wrote 5 simple measures: SUM, AVERAGE, COUNTROWS, DIVIDE, and CALCULATE.",
     "You understand the three parts of a DAX formula: Name = Function(Table[Column])."),
    ("<b>Building a dashboard:</b> You know the best layout: KPI cards on top, main charts in the middle, details at the bottom, with slicers.",
     "You can resize, move, and align charts to make a professional-looking dashboard."),
    ("<b>Publishing:</b> You know how to publish your report to the cloud and share it with a link.",
     "You understand the three parts of Power BI: Desktop, Service, and Mobile."),
]

for i, (title, detail) in enumerate(summary_items, 1):
    story.append(Paragraph(f"<b>{i}.</b> {title}", styles['BodyText2']))
    story.append(Paragraph(f"&nbsp;&nbsp;&nbsp;&nbsp;{detail}", styles['BodyTextIndent']))

story.append(Spacer(1, 10))
story.append(Paragraph("The Power BI Workflow (Remember This!)", styles['SubHeader']))
story.append(Paragraph(
    "Every Power BI project follows the same steps. Memorize this workflow and you can build any report:",
    styles['BodyText2']
))

workflow_steps = [
    ("1", "Load Data", "Get Data > Excel > Select file > Load"),
    ("2", "Clean Data", "Transform Data > Clean in Power Query > Close & Apply"),
    ("3", "Build Model", "Connect tables with relationships (if you have multiple tables)"),
    ("4", "Create Measures", "New Measure > Write DAX formula > Press Enter"),
    ("5", "Build Charts", "Click chart icon > Drag fields from Fields pane"),
    ("6", "Make Dashboard", "Arrange charts, add slicers, format and align"),
    ("7", "Publish", "Publish button > Share link with your team"),
]

wf_data = [[Paragraph('<b>Step</b>', styles['TableHeader']),
            Paragraph('<b>Action</b>', styles['TableHeader']),
            Paragraph('<b>How</b>', styles['TableHeader'])]]
for step, action, how in workflow_steps:
    wf_data.append([
        Paragraph(f'<b>{step}</b>', styles['TableCell']),
        Paragraph(action, styles['TableCell']),
        Paragraph(how, styles['TableCell'])
    ])

t = Table(wf_data, colWidths=[40, 110, 320])
t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), DARK_BLUE),
    ('TEXTCOLOR', (0,0), (-1,0), white),
    ('ROWBACKGROUNDS', (0,1), (-1,-1), [white, BG_LIGHT]),
    ('BOX', (0,0), (-1,-1), 1, MED_BLUE),
    ('INNERGRID', (0,0), (-1,-1), 0.5, LIGHT_BLUE),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('TOPPADDING', (0,0), (-1,-1), 5),
    ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ('LEFTPADDING', (0,0), (-1,-1), 5),
    ('RIGHTPADDING', (0,0), (-1,-1), 5),
]))
story.append(t)

story.append(Spacer(1, 12))

# Next steps
story.append(Paragraph("What to Do Next (Your Homework)", styles['SubHeader']))
next_steps = [
    "Download the Financial Sample Excel file and practice loading it on your own computer.",
    "Create each of the 5 charts we practiced. Try changing the fields to see different results.",
    "Write the 5 DAX measures we learned. Change the column names and see what happens.",
    "Build a complete dashboard with all charts, KPI cards, and at least one slicer.",
    "Publish your report and share the link with someone in the study group.",
    "Try loading a DIFFERENT data source: a CSV file, a web page, or another Excel file.",
]
for i, step in enumerate(next_steps, 1):
    story.append(Paragraph(f"&nbsp;&nbsp;&bull;&nbsp;&nbsp;{step}", styles['BodyText2']))

story.append(Spacer(1, 10))
story.append(Paragraph(
    '<b>Final Message:</b> You now know the A-Z process of Power BI. This is the foundation. '
    'As you practice more, you will become faster and more confident. Do not be afraid to experiment - '
    'you cannot break anything in Power BI. Every mistake can be fixed. The more you click, drag, and explore, '
    'the better you will become. Good luck on your Power BI journey!',
    styles['TipBox']
))


# ============================================================
# Build PDF
# ============================================================
doc.build(story)
print(f"PDF created: {PDF_FILE}")
file_size = os.path.getsize(PDF_FILE)
print(f"File size: {file_size / 1024:.1f} KB")
