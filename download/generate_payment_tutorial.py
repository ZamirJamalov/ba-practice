import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_JUSTIFY, TA_CENTER
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, PageBreak, KeepTogether
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily

# ── Fonts ──
pdfmetrics.registerFont(TTFont('Carlito', '/usr/share/fonts/truetype/english/Carlito-Regular.ttf'))
pdfmetrics.registerFont(TTFont('CarlitoBold', '/usr/share/fonts/truetype/english/Carlito-Bold.ttf'))
pdfmetrics.registerFont(TTFont('Tinos', '/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf'))
pdfmetrics.registerFont(TTFont('TinosBold', '/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf'))
registerFontFamily('Carlito', normal='Carlito', bold='CarlitoBold')
registerFontFamily('Tinos', normal='Tinos', bold='TinosBold')

# ── Colors ──
ACCENT = colors.HexColor('#2A6496')
DARK = colors.HexColor('#1A1A1A')
TEXT = colors.HexColor('#333333')
MUTED = colors.HexColor('#666666')
GREEN_BG = colors.HexColor('#E8F5E9')
GREEN_TEXT = colors.HexColor('#2E7D32')
BLUE_BG = colors.HexColor('#E3F2FD')
BLUE_TEXT = colors.HexColor('#1565C0')
ORANGE_BG = colors.HexColor('#FFF3E0')
ORANGE_TEXT = colors.HexColor('#E65100')
PURPLE_BG = colors.HexColor('#F3E5F5')
PURPLE_TEXT = colors.HexColor('#7B1FA2')
YELLOW_BG = colors.HexColor('#FFFDE7')
YELLOW_TEXT = colors.HexColor('#F57F17')

# ── Output ──
output_path = '/home/z/my-project/download/Payment_Ecosystem_Tutorial.pdf'

doc = SimpleDocTemplate(
    output_path,
    pagesize=A4,
    leftMargin=2.0*cm,
    rightMargin=2.0*cm,
    topMargin=1.8*cm,
    bottomMargin=1.8*cm,
)

PAGE_W = A4[0] - 4.0*cm

# ── Styles ──
s = {}

s['doc_title'] = ParagraphStyle(
    'DocTitle', fontName='Carlito', fontSize=22, leading=28,
    textColor=DARK, alignment=TA_CENTER, spaceAfter=4
)
s['doc_subtitle'] = ParagraphStyle(
    'DocSubtitle', fontName='Carlito', fontSize=13, leading=18,
    textColor=ACCENT, alignment=TA_CENTER, spaceAfter=6
)
s['tip'] = ParagraphStyle(
    'Tip', fontName='Tinos', fontSize=10, leading=14,
    textColor=MUTED, alignment=TA_CENTER, spaceAfter=4,
    fontStyle='italic'
)
s['chapter_num'] = ParagraphStyle(
    'ChapterNum', fontName='Carlito', fontSize=10, leading=14,
    textColor=ACCENT, spaceBefore=14, spaceAfter=2
)
s['chapter_title'] = ParagraphStyle(
    'ChapterTitle', fontName='Carlito', fontSize=14, leading=20,
    textColor=DARK, spaceBefore=2, spaceAfter=6
)
s['section_head'] = ParagraphStyle(
    'SectionHead', fontName='Carlito', fontSize=11, leading=16,
    textColor=ACCENT, spaceBefore=10, spaceAfter=4
)
s['body'] = ParagraphStyle(
    'Body', fontName='Tinos', fontSize=10.5, leading=16,
    textColor=TEXT, alignment=TA_JUSTIFY, spaceAfter=6
)
s['bullet'] = ParagraphStyle(
    'Bullet', fontName='Tinos', fontSize=10.5, leading=16,
    textColor=TEXT, leftIndent=20, bulletIndent=6,
    spaceAfter=3, alignment=TA_LEFT
)
s['step'] = ParagraphStyle(
    'Step', fontName='Tinos', fontSize=10.5, leading=16,
    textColor=TEXT, leftIndent=24, bulletIndent=8,
    spaceAfter=3, alignment=TA_LEFT
)
s['highlight'] = ParagraphStyle(
    'Highlight', fontName='Carlito', fontSize=10, leading=15,
    textColor=BLUE_TEXT, spaceBefore=6, spaceAfter=4,
    backColor=BLUE_BG, borderPadding=(8, 8, 8, 8),
    leftIndent=4
)
s['green_box'] = ParagraphStyle(
    'GreenBox', fontName='Tinos', fontSize=10.5, leading=16,
    textColor=TEXT, alignment=TA_JUSTIFY, spaceAfter=4,
    backColor=GREEN_BG, borderPadding=(8, 8, 8, 8),
    leftIndent=4
)
s['orange_box'] = ParagraphStyle(
    'OrangeBox', fontName='Carlito', fontSize=10.5, leading=15,
    textColor=ORANGE_TEXT, spaceBefore=6, spaceAfter=4,
    backColor=ORANGE_BG, borderPadding=(8, 8, 8, 8),
    leftIndent=4
)
s['purple_box'] = ParagraphStyle(
    'PurpleBox', fontName='Tinos', fontSize=10.5, leading=16,
    textColor=PURPLE_TEXT, alignment=TA_JUSTIFY, spaceAfter=4,
    backColor=PURPLE_BG, borderPadding=(8, 8, 8, 8),
    leftIndent=4
)
s['yellow_box'] = ParagraphStyle(
    'YellowBox', fontName='Carlito', fontSize=10, leading=15,
    textColor=YELLOW_TEXT, spaceBefore=6, spaceAfter=4,
    backColor=YELLOW_BG, borderPadding=(8, 8, 8, 8),
    leftIndent=4
)
s['table_header'] = ParagraphStyle(
    'TableHeader', fontName='Carlito', fontSize=10, leading=14,
    textColor=colors.white, alignment=TA_CENTER
)
s['table_cell'] = ParagraphStyle(
    'TableCell', fontName='Tinos', fontSize=9.5, leading=14,
    textColor=TEXT, alignment=TA_LEFT
)
s['table_cell_center'] = ParagraphStyle(
    'TableCellCenter', fontName='Tinos', fontSize=9.5, leading=14,
    textColor=TEXT, alignment=TA_CENTER
)


def section_hr():
    return HRFlowable(width="100%", thickness=0.8, color=ACCENT, spaceAfter=6, spaceBefore=4)


def step_text(num, text):
    return Paragraph(f'<b>Step {num}:</b> {text}', s['step'])


def key_term(term, definition):
    return Paragraph(f'<b>{term}:</b> {definition}', s['body'])


def build():
    story = []

    # ══════════════════════════════════════
    # TITLE PAGE
    # ══════════════════════════════════════
    story.append(Spacer(1, 50))
    story.append(Paragraph('<b>Payment Ecosystem</b>', s['doc_title']))
    story.append(Paragraph('<b>Complete Tutorial</b>', s['doc_subtitle']))
    story.append(Spacer(1, 8))
    story.append(Paragraph(
        'How money moves between banks, merchants, and customers.',
        s['tip']
    ))
    story.append(Paragraph(
        'Written in simple A1-level English. Read this before your CIBPay interview.',
        s['tip']
    ))
    story.append(Spacer(1, 16))
    story.append(HRFlowable(width="60%", thickness=2, color=ACCENT, spaceAfter=16))

    story.append(Paragraph(
        'This tutorial explains the complete payment ecosystem: who are the players, '
        'how money moves from one bank to another, and what role a payment system like CIBPay plays '
        'in this process. You will learn about acquiring banks, issuing banks, card networks, '
        'settlement, clearing, and much more. Every explanation is in simple English so you can '
        'understand and remember easily.',
        s['body']
    ))

    story.append(Spacer(1, 12))

    # ── Table of Contents ──
    story.append(Paragraph('<b>CONTENTS</b>', s['chapter_num']))
    story.append(section_hr())

    toc_items = [
        '1. Key Players in the Payment Ecosystem',
        '2. What is an Acquiring Bank (Ekvaring)?',
        '3. What is an Issuing Bank (Emitent)?',
        '4. What is a Payment System / Payment Gateway?',
        '5. What is a Card Network?',
        '6. Step-by-Step: How Money Moves Between Banks',
        '7. Settlement and Clearing: The Real Money Movement',
        '8. Real Example: Customer Buys for 50 AZN',
        '9. Other Important Workflows',
        '10. CIBPay\'s Role in Detail',
        '11. Interview Questions and Sample Answers',
    ]

    for item in toc_items:
        story.append(Paragraph(item, s['bullet']))

    story.append(PageBreak())

    # ══════════════════════════════════════
    # CHAPTER 1: KEY PLAYERS
    # ══════════════════════════════════════
    story.append(Paragraph('<b>CHAPTER 1</b>', s['chapter_num']))
    story.append(Paragraph('<b>Key Players in the Payment Ecosystem</b>', s['chapter_title']))
    story.append(section_hr())

    story.append(Paragraph(
        'When a customer buys something online and pays with a card, many different organizations '
        'work together to make this happen. Think of it like a team: each player has a different job, '
        'but they all work together to complete the payment. Let us meet each player.',
        s['body']
    ))

    story.append(Paragraph('<b>The 6 Key Players:</b>', s['section_head']))

    # Table of players
    player_data = [
        [Paragraph('<b>Player</b>', s['table_header']),
         Paragraph('<b>Also Called</b>', s['table_header']),
         Paragraph('<b>Simple Explanation</b>', s['table_header'])],
        [Paragraph('Customer', s['table_cell']),
         Paragraph('Cardholder', s['table_cell']),
         Paragraph('The person who buys something and pays with a card. The customer has a bank account and a card.', s['table_cell'])],
        [Paragraph('Merchant', s['table_cell']),
         Paragraph('Shop / Seller', s['table_cell']),
         Paragraph('The business that sells something. The merchant wants to receive money from the customer.', s['table_cell'])],
        [Paragraph('Acquiring Bank', s['table_cell']),
         Paragraph('Ekvaring / Merchant Bank', s['table_cell']),
         Paragraph('The merchant\'s bank. This bank receives the payment request and holds the merchant\'s money.', s['table_cell'])],
        [Paragraph('Issuing Bank', s['table_cell']),
         Paragraph('Emitent / Cardholder Bank', s['table_cell']),
         Paragraph('The customer\'s bank. This bank issued the customer\'s card and holds the customer\'s money.', s['table_cell'])],
        [Paragraph('Payment System', s['table_cell']),
         Paragraph('Payment Gateway / PSP', s['table_cell']),
         Paragraph('The company that connects the merchant to the banks. Like CIBPay. This is the "bridge."', s['table_cell'])],
        [Paragraph('Card Network', s['table_cell']),
         Paragraph('Visa / Mastercard / MilliKart', s['table_cell']),
         Paragraph('The network that connects acquiring banks and issuing banks. Like a "highway" between banks.', s['table_cell'])],
    ]

    player_table = Table(player_data, colWidths=[3.2*cm, 3.5*cm, PAGE_W - 6.7*cm])
    player_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), ACCENT),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('BACKGROUND', (0, 1), (-1, 1), colors.HexColor('#F8F9FA')),
        ('BACKGROUND', (0, 3), (-1, 3), colors.HexColor('#F8F9FA')),
        ('BACKGROUND', (0, 5), (-1, 5), colors.HexColor('#F8F9FA')),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CCCCCC')),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(player_table)
    story.append(Spacer(1, 8))

    story.append(Paragraph(
        'Let us look at a simple picture. The customer wants to buy a product from an online shop. '
        'The customer uses their card. The payment must travel from the customer\'s bank to the '
        'merchant\'s bank. But these two banks are different! They need a way to communicate. '
        'This is where the payment system and card network help.',
        s['body']
    ))

    story.append(Paragraph(
        '<b>Think of it like sending a letter:</b> The customer puts a letter (payment request) in the '
        'mailbox. The payment system (CIBPay) picks it up and takes it to the post office (card network). '
        'The post office delivers it to the recipient\'s bank (issuing bank). The issuing bank checks: '
        '"Does this customer have enough money?" and sends back an answer: "Yes" or "No." The answer '
        'travels back the same way to the merchant.',
        s['green_box']
    ))

    story.append(Spacer(1, 6))

    # ══════════════════════════════════════
    # CHAPTER 2: ACQUIRING BANK
    # ══════════════════════════════════════
    story.append(Paragraph('<b>CHAPTER 2</b>', s['chapter_num']))
    story.append(Paragraph('<b>What is an Acquiring Bank (Ekvaring)?</b>', s['chapter_title']))
    story.append(section_hr())

    story.append(Paragraph(
        'The <b>acquiring bank</b> (also called "ekvaring bank" or "merchant bank") is the bank that '
        'works with the <b>merchant</b>. Every merchant that accepts card payments must have a contract '
        'with an acquiring bank. This bank provides the merchant with a "merchant account" where the '
        'payment money will be collected.',
        s['body']
    ))

    story.append(Paragraph('<b>What does the acquiring bank do?</b>', s['section_head']))

    story.append(Paragraph(
        '<bullet>&bull;</bullet> <b>Opens a merchant account:</b> When a business wants to accept card '
        'payments, they sign a contract with an acquiring bank. The bank creates a special account '
        'called a "merchant account." All customer payments go into this account.', s['step']
    ))
    story.append(Paragraph(
        '<bullet>&bull;</bullet> <b>Receives payment requests:</b> When a customer pays, the payment '
        'request goes to the acquiring bank first. The acquiring bank checks: "Is this merchant active? '
        'Is the merchant account in good status?"', s['step']
    ))
    story.append(Paragraph(
        '<bullet>&bull;</bullet> <b>Forwards to the card network:</b> After the acquiring bank approves '
        'the merchant, it sends the payment request to the card network (Visa, Mastercard, MilliKart). '
        'The card network then sends it to the issuing bank.', s['step']
    ))
    story.append(Paragraph(
        '<bullet>&bull;</bullet> <b>Receives the money from issuing bank:</b> After the customer\'s bank '
        '(issuing bank) confirms the payment, the money eventually arrives at the acquiring bank\'s '
        'merchant account.', s['step']
    ))
    story.append(Paragraph(
        '<bullet>&bull;</bullet> <b>Sets up the merchant to the payment system:</b> The acquiring bank '
        'often works with a payment system like CIBPay to process transactions. The merchant connects '
        'to CIBPay, and CIBPay connects to the acquiring bank.', s['step']
    ))
    story.append(Paragraph(
        '<bullet>&bull;</bullet> <b>Charges fees:</b> The acquiring bank charges the merchant a fee for '
        'each transaction. This is usually a percentage of the transaction amount (for example, 1.5% - 3%). '
        'This is called the "merchant discount rate" or MDR.', s['step']
    ))

    story.append(Spacer(1, 4))

    story.append(Paragraph(
        '<b>Example in Azerbaijan:</b> If an online shop signs a contract with Kapital Bank to accept '
        'card payments, then Kapital Bank is the acquiring bank (ekvaring) for this merchant. '
        'All customer payments will go through Kapital Bank before reaching the merchant.',
        s['highlight']
    ))

    story.append(Spacer(1, 6))

    # ══════════════════════════════════════
    # CHAPTER 3: ISSUING BANK
    # ══════════════════════════════════════
    story.append(Paragraph('<b>CHAPTER 3</b>', s['chapter_num']))
    story.append(Paragraph('<b>What is an Issuing Bank (Emitent)?</b>', s['chapter_title']))
    story.append(section_hr())

    story.append(Paragraph(
        'The <b>issuing bank</b> (also called "emitent bank" or "cardholder bank") is the bank that '
        'gave the card to the <b>customer</b>. When you go to a bank and ask for a debit card or credit '
        'card, that bank is your issuing bank. Your issuing bank holds your money and manages your card.',
        s['body']
    ))

    story.append(Paragraph('<b>What does the issuing bank do?</b>', s['section_head']))

    story.append(Paragraph(
        '<bullet>&bull;</bullet> <b>Issues cards to customers:</b> The bank creates cards for its customers. '
        'Each card has a unique number, an expiry date, and a CVV code. The bank links the card to the '
        'customer\'s bank account.', s['step']
    ))
    story.append(Paragraph(
        '<bullet>&bull;</bullet> <b>Checks the customer\'s balance:</b> When a payment request arrives, '
        'the issuing bank checks: "Does this customer have enough money in their account?" If yes, '
        'the bank approves the payment. If no, the bank declines the payment.', s['step']
    ))
    story.append(Paragraph(
        '<bullet>&bull;</bullet> <b>Validates the card:</b> The bank checks: Is this card valid? '
        'Is it expired? Is it blocked? Is the CVV correct? If anything is wrong, the payment is declined.', s['step']
    ))
    story.append(Paragraph(
        '<bullet>&bull;</bullet> <b>Deducts money from the customer\'s account:</b> When the payment is '
        'approved, the bank deducts (removes) the money from the customer\'s bank account. '
        'The customer sees this as a charge on their bank statement.', s['step']
    ))
    story.append(Paragraph(
        '<bullet>&bull;</bullet> <b>Sends money to the acquiring bank:</b> Through the card network '
        'and the clearing/settlement process, the issuing bank sends the money to the acquiring bank '
        'where the merchant\'s account is.', s['step']
    ))
    story.append(Paragraph(
        '<bullet>&bull;</bullet> <b>Manages security:</b> The issuing bank monitors transactions for '
        'fraud. If the bank sees a suspicious transaction (for example, a payment in another country '
        'at 3 AM), it can block the transaction for security.', s['step']
    ))

    story.append(Spacer(1, 4))

    story.append(Paragraph(
        '<b>Example:</b> If Zamir has a card from Pasha Bank, then Pasha Bank is his issuing bank. '
        'When Zamir buys something online, Pasha Bank checks if Zamir has enough money and deducts '
        'the amount from his account.',
        s['highlight']
    ))

    story.append(Spacer(1, 4))

    story.append(Paragraph(
        '<b>Important:</b> The acquiring bank and issuing bank can be the SAME bank or DIFFERENT banks. '
        'If the customer and the merchant use the same bank, the process is simpler. '
        'But in most cases, they use different banks. This is where the card network becomes important.',
        s['yellow_box']
    ))

    story.append(Spacer(1, 6))

    # ══════════════════════════════════════
    # CHAPTER 4: PAYMENT SYSTEM
    # ══════════════════════════════════════
    story.append(Paragraph('<b>CHAPTER 4</b>', s['chapter_num']))
    story.append(Paragraph('<b>What is a Payment System / Payment Gateway?</b>', s['chapter_title']))
    story.append(section_hr())

    story.append(Paragraph(
        'A <b>payment system</b> or <b>payment gateway</b> is a technology company that connects '
        'merchants to banks. It is like a "bridge" between the merchant\'s website and the banking system. '
        'CIBPay is a payment system. Other examples: PayTabs, Stripe, PayPal.',
        s['body']
    ))

    story.append(Paragraph('<b>What does the payment system do?</b>', s['section_head']))

    story.append(Paragraph(
        '<bullet>&bull;</bullet> <b>Provides the API:</b> The payment system gives the merchant an API '
        '(a way to connect). The merchant\'s developer writes code that sends payment requests to the '
        'payment system\'s API.', s['step']
    ))
    story.append(Paragraph(
        '<bullet>&bull;</bullet> <b>Validates the merchant:</b> When a payment request arrives, the '
        'payment system first checks: "Is this merchant registered? Are the API credentials correct? '
        'Is the request format valid?"', s['step']
    ))
    story.append(Paragraph(
        '<bullet>&bull;</bullet> <b>Routes to the acquiring bank:</b> After validation, the payment '
        'system sends the request to the acquiring bank. The payment system knows which acquiring bank '
        'to use for each merchant.', s['step']
    ))
    story.append(Paragraph(
        '<bullet>&bull;</bullet> <b>Manages merchant accounts:</b> The payment system has a back-office '
        '(admin panel) where support specialists can create merchant accounts, manage API keys, '
        'check transaction history, and investigate problems.', s['step']
    ))
    story.append(Paragraph(
        '<bullet>&bull;</bullet> <b>Provides technical support:</b> When a merchant has a problem, '
        'they contact the payment system\'s support team. The IT Support Specialist helps the merchant '
        'fix integration issues, understand error codes, and resolve transaction problems.', s['step']
    ))
    story.append(Paragraph(
        '<bullet>&bull;</bullet> <b>Handles multiple payment methods:</b> The payment system can connect '
        'to multiple acquiring banks, card networks, and payment methods (Visa, Mastercard, MilliKart, '
        'digital wallets, etc.). The merchant does not need to integrate with each bank separately.', s['step']
    ))

    story.append(Spacer(1, 4))

    story.append(Paragraph(
        '<b>Think of the payment system as a translator:</b> The merchant speaks "website language" and '
        'the bank speaks "banking language." The payment system translates between them. The merchant '
        'sends a simple API request, and the payment system converts it into the bank\'s required format. '
        'The bank sends back a response, and the payment system converts it into a simple format the '
        'merchant can understand.',
        s['green_box']
    ))

    story.append(Spacer(1, 6))

    # ══════════════════════════════════════
    # CHAPTER 5: CARD NETWORK
    # ══════════════════════════════════════
    story.append(Paragraph('<b>CHAPTER 5</b>', s['chapter_num']))
    story.append(Paragraph('<b>What is a Card Network?</b>', s['chapter_title']))
    story.append(section_hr())

    story.append(Paragraph(
        'A <b>card network</b> (also called "card scheme" or "payment network") is the organization '
        'that creates the rules and infrastructure for card payments. The most famous card networks are '
        '<b>Visa</b>, <b>Mastercard</b>, and in Azerbaijan, <b>MilliKart</b>.',
        s['body']
    ))

    story.append(Paragraph('<b>What does the card network do?</b>', s['section_head']))

    story.append(Paragraph(
        '<bullet>&bull;</bullet> <b>Creates the rules:</b> The card network defines how card payments '
        'work. For example: maximum transaction amount, security requirements (like 3-D Secure), '
        'and how disputes (chargebacks) are handled.', s['step']
    ))
    story.append(Paragraph(
        '<bullet>&bull;</bullet> <b>Connects acquiring and issuing banks:</b> The card network is the '
        '"highway" between banks. The acquiring bank sends a message to the card network, and the card '
        'network routes it to the correct issuing bank. Think of it like a telephone network: '
        'you dial a number, and the network connects you to the right person.', s['step']
    ))
    story.append(Paragraph(
        '<bullet>&bull;</bullet> <b>Operates the clearing and settlement system:</b> At the end of the day, '
        'the card network calculates how much each bank owes to other banks and transfers the money '
        'between them. This is called "clearing and settlement."', s['step']
    ))
    story.append(Paragraph(
        '<bullet>&bull;</bullet> <b>Provides security technology:</b> The card network provides security '
        'features like 3-D Secure (3DS), EMV chip technology, and fraud detection systems.', s['step']
    ))

    story.append(Spacer(1, 4))

    story.append(Paragraph(
        '<b>In Azerbaijan:</b> Most local card payments use MilliKart. International cards use Visa or '
        'Mastercard. A payment system like CIBPay needs to be connected to all three networks to accept '
        'different types of cards.',
        s['highlight']
    ))

    story.append(Spacer(1, 6))

    # ══════════════════════════════════════
    # CHAPTER 6: STEP BY STEP
    # ══════════════════════════════════════
    story.append(Paragraph('<b>CHAPTER 6</b>', s['chapter_num']))
    story.append(Paragraph('<b>Step-by-Step: How Money Moves Between Banks</b>', s['chapter_title']))
    story.append(section_hr())

    story.append(Paragraph(
        'Now let us see the complete journey of a payment. We will follow the money from the '
        'customer\'s click to the actual money transfer. This is the most important chapter.',
        s['body']
    ))

    story.append(Paragraph('<b>Part 1: Authorization (Real-Time, 1-3 seconds)</b>', s['section_head']))

    story.append(Paragraph(
        'Authorization is when the system checks if the payment is possible. The money does NOT move yet. '
        'The system only checks: "Can we do this payment?" The customer sees "Payment Successful" but the '
        'merchant does not have the money yet.',
        s['body']
    ))

    story.append(step_text(1,
        'The <b>customer</b> clicks "Pay" on the merchant\'s website and enters their card details '
        '(card number, expiry date, CVV).'
    ))
    story.append(step_text(2,
        'The <b>merchant\'s website</b> sends a payment request to the <b>payment system</b> (CIBPay) '
        'via API. The request contains: amount, currency, card details, and merchant ID.'
    ))
    story.append(step_text(3,
        'The <b>payment system</b> (CIBPay) validates the request: checks merchant credentials, '
        'request format, and API key. If valid, CIBPay sends the request to the <b>acquiring bank</b>.'
    ))
    story.append(step_text(4,
        'The <b>acquiring bank</b> checks the merchant status. If the merchant is active and in good '
        'standing, the acquiring bank sends the request to the <b>card network</b> (Visa/Mastercard/MilliKart).'
    ))
    story.append(step_text(5,
        'The <b>card network</b> looks at the card number and identifies the <b>issuing bank</b>. '
        'For example, if the card starts with 4XXX, it is a Visa card issued by Pasha Bank. '
        'The card network routes the request to Pasha Bank.'
    ))
    story.append(step_text(6,
        'The <b>issuing bank</b> performs several checks: Is the card valid? Is it expired? '
        'Is the CVV correct? Does the customer have enough money? Is the transaction suspicious? '
        'The issuing bank sends back a response: "APPROVED" or "DECLINED" with a reason code.'
    ))
    story.append(step_text(7,
        'The response travels back: issuing bank -> card network -> acquiring bank -> '
        'payment system (CIBPay) -> merchant. The whole process takes 1-3 seconds.'
    ))
    story.append(step_text(8,
        'The <b>merchant</b> shows the result to the customer: "Payment Successful" or "Payment Failed." '
        'The customer receives an order confirmation.'
    ))

    story.append(Spacer(1, 4))

    story.append(Paragraph(
        '<b>IMPORTANT:</b> At this point, the money has NOT moved yet! The customer\'s bank balance '
        'is "reserved" (held) but not yet deducted. The merchant does not have the money. '
        'This is only a promise that the payment will happen. The actual money movement happens later, '
        'during settlement.',
        s['orange_box']
    ))

    story.append(Spacer(1, 6))

    story.append(Paragraph('<b>Part 2: Clearing (Batch Process, End of Day)</b>', s['section_head']))

    story.append(Paragraph(
        '<b>Clearing</b> is when banks exchange transaction information. At the end of each day, '
        'all the transactions from that day are collected and sent between the banks. Think of it like '
        'a teacher collecting all homework at the end of the day and distributing it to the correct '
        'graders.',
        s['body']
    ))

    story.append(step_text(1,
        'The <b>acquiring bank</b> collects all transactions from the day for all its merchants.'
    ))
    story.append(step_text(2,
        'The <b>card network</b> receives all transaction data from all acquiring banks.'
    ))
    story.append(step_text(3,
        'The <b>card network</b> sorts the transactions by issuing bank and sends each batch '
        'to the correct issuing bank. For example: all Pasha Bank card transactions go to Pasha Bank, '
        'all Kapital Bank card transactions go to Kapital Bank.'
    ))
    story.append(step_text(4,
        'The <b>issuing banks</b> receive the transaction lists and verify them against their own records. '
        'Now all banks agree on what happened today.'
    ))

    story.append(Spacer(1, 4))

    story.append(Paragraph('<b>Part 3: Settlement (Actual Money Movement, T+1 to T+3 days)</b>', s['section_head']))

    story.append(Paragraph(
        '<b>Settlement</b> is when the actual money changes hands. This usually happens 1-3 business days '
        'after the transaction. "T+1" means "transaction day plus 1 business day." '
        'This is the real money movement.',
        s['body']
    ))

    story.append(step_text(1,
        'The <b>issuing bank</b> deducts (removes) the money from the customer\'s account. '
        'The customer sees this as a completed charge on their bank statement.'
    ))
    story.append(step_text(2,
        'The <b>issuing bank</b> transfers the money to the <b>card network\'s settlement account</b>.'
    ))
    story.append(step_text(3,
        'The <b>card network</b> calculates net amounts: for example, if Pasha Bank\'s customers '
        'spent 100,000 AZN at merchants, and Pasha Bank\'s merchants received 80,000 AZN from customers, '
        'then Pasha Bank needs to pay 20,000 AZN to the card network.'
    ))
    story.append(step_text(4,
        'The <b>card network</b> transfers the money to the <b>acquiring bank</b>.'
    ))
    story.append(step_text(5,
        'The <b>acquiring bank</b> credits (adds) the money to the <b>merchant\'s account</b>. '
        'After deducting fees, the merchant receives the money. The merchant can now use this money.'
    ))

    story.append(Spacer(1, 4))

    story.append(Paragraph(
        '<b>Summary of the timeline:</b> Authorization (1-3 seconds) -> Clearing (end of day) -> '
        'Settlement (T+1 to T+3 days). The customer sees the charge immediately, but the merchant '
        'receives the money 1-3 days later.',
        s['yellow_box']
    ))

    story.append(Spacer(1, 6))

    # ══════════════════════════════════════
    # CHAPTER 7: SETTLEMENT AND CLEARING
    # ══════════════════════════════════════
    story.append(Paragraph('<b>CHAPTER 7</b>', s['chapter_num']))
    story.append(Paragraph('<b>Settlement and Clearing: The Real Money Movement</b>', s['chapter_title']))
    story.append(section_hr())

    story.append(Paragraph(
        'This chapter explains the difference between clearing and settlement in more detail. '
        'Many people confuse these two terms, but they are different.',
        s['body']
    ))

    story.append(Paragraph(
        '<b>Clearing = Exchanging Information</b><br/>'
        'Clearing is when banks send transaction data to each other. No money moves during clearing. '
        'Banks only exchange information: "On Monday, your customer paid 100 AZN at my merchant." '
        'After clearing, all banks have the same list of transactions. This usually happens at the end '
        'of each business day.',
        s['body']
    ))

    story.append(Paragraph(
        '<b>Settlement = Moving Money</b><br/>'
        'Settlement is when the actual money is transferred between banks. After clearing, the card '
        'network calculates the net amounts: how much each bank owes to other banks. Then the money '
        'is transferred. This usually happens 1-3 business days after the transaction.',
        s['body']
    ))

    story.append(Paragraph(
        '<b>Why does settlement take 1-3 days?</b><br/>'
        'In the past, settlement took longer because banks had to physically process paper checks. '
        'Today, with electronic systems, it is faster, but there are still reasons for the delay: '
        'time zone differences, weekends, holidays, and the need for verification. In some modern '
        'systems, settlement can happen on the same day (real-time settlement).',
        s['body']
    ))

    story.append(Spacer(1, 4))

    story.append(Paragraph(
        '<b>Simple analogy:</b> Clearing is like restaurants sharing orders at the end of the day: '
        '"My customers ordered 50 pizzas from your restaurant, and your customers ordered 30 pizzas '
        'from my restaurant." Settlement is when they actually pay each other the difference.',
        s['green_box']
    ))

    story.append(Spacer(1, 6))

    # ══════════════════════════════════════
    # CHAPTER 8: REAL EXAMPLE
    # ══════════════════════════════════════
    story.append(Paragraph('<b>CHAPTER 8</b>', s['chapter_num']))
    story.append(Paragraph('<b>Real Example: Customer Buys for 50 AZN</b>', s['chapter_title']))
    story.append(section_hr())

    story.append(Paragraph(
        'Let us follow a real example. Zamir buys a product for 50 AZN from an online shop using '
        'his Pasha Bank Visa card. The merchant uses CIBPay and their acquiring bank is Kapital Bank.',
        s['body']
    ))

    story.append(Paragraph('<b>Authorization Phase (Real-Time):</b>', s['section_head']))

    example_data = [
        [Paragraph('<b>Step</b>', s['table_header']),
         Paragraph('<b>Who</b>', s['table_header']),
         Paragraph('<b>What Happens</b>', s['table_header'])],
        [Paragraph('1', s['table_cell_center']),
         Paragraph('Zamir', s['table_cell']),
         Paragraph('Clicks "Pay" and enters Pasha Bank Visa card details on the shop website.', s['table_cell'])],
        [Paragraph('2', s['table_cell_center']),
         Paragraph('Merchant website', s['table_cell']),
         Paragraph('Sends API request to CIBPay: amount=50, currency=AZN, card=4XXX..., merchant_id=M123.', s['table_cell'])],
        [Paragraph('3', s['table_cell_center']),
         Paragraph('CIBPay', s['table_cell']),
         Paragraph('Validates the request (API key OK, format OK). Routes to acquiring bank (Kapital Bank).', s['table_cell'])],
        [Paragraph('4', s['table_cell_center']),
         Paragraph('Kapital Bank (Acquiring)', s['table_cell']),
         Paragraph('Checks merchant M123 status (active, OK). Sends to Visa card network.', s['table_cell'])],
        [Paragraph('5', s['table_cell_center']),
         Paragraph('Visa Network', s['table_cell']),
         Paragraph('Identifies the card as issued by Pasha Bank. Routes to Pasha Bank.', s['table_cell'])],
        [Paragraph('6', s['table_cell_center']),
         Paragraph('Pasha Bank (Issuing)', s['table_cell']),
         Paragraph('Checks: card valid, not expired, CVV OK, balance = 200 AZN (enough). Response: APPROVED.', s['table_cell'])],
        [Paragraph('7', s['table_cell_center']),
         Paragraph('Response back', s['table_cell']),
         Paragraph('APPROVED travels back: Pasha Bank -> Visa -> Kapital Bank -> CIBPay -> Merchant.', s['table_cell'])],
        [Paragraph('8', s['table_cell_center']),
         Paragraph('Merchant', s['table_cell']),
         Paragraph('Shows "Payment Successful" to Zamir. Order confirmed.', s['table_cell'])],
    ]

    ex_table = Table(example_data, colWidths=[1.3*cm, 3.5*cm, PAGE_W - 4.8*cm])
    ex_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), ACCENT),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('BACKGROUND', (0, 1), (-1, 1), colors.HexColor('#F8F9FA')),
        ('BACKGROUND', (0, 3), (-1, 3), colors.HexColor('#F8F9FA')),
        ('BACKGROUND', (0, 5), (-1, 5), colors.HexColor('#F8F9FA')),
        ('BACKGROUND', (0, 7), (-1, 7), colors.HexColor('#F8F9FA')),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CCCCCC')),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(ex_table)
    story.append(Spacer(1, 6))

    story.append(Paragraph('<b>Settlement Phase (T+1 to T+3 days):</b>', s['section_head']))

    story.append(step_text(1,
        '<b>Pasha Bank</b> (issuing) deducts 50 AZN from Zamir\'s account. '
        'Zamir sees: "Online Shop -50 AZN" on his bank statement.'
    ))
    story.append(step_text(2,
        '<b>Pasha Bank</b> transfers 50 AZN to the Visa settlement account.'
    ))
    story.append(step_text(3,
        '<b>Visa</b> calculates net amounts for all banks and transfers money to <b>Kapital Bank</b> '
        '(acquiring). Visa deducts a small interchange fee (for example, 1-2%).'
    ))
    story.append(step_text(4,
        '<b>Kapital Bank</b> credits 50 AZN to the merchant\'s account, minus the acquiring bank fee '
        '(for example, 1%). The merchant receives approximately 49 AZN.'
    ))
    story.append(step_text(5,
        'If the merchant uses CIBPay, CIBPay may also deduct its own fee before the money reaches '
        'the merchant\'s final bank account.'
    ))

    story.append(Spacer(1, 4))

    story.append(Paragraph(
        '<b>Where does the money go? (Fee breakdown example for 50 AZN)</b>',
        s['section_head']
    ))

    fee_data = [
        [Paragraph('<b>Fee Type</b>', s['table_header']),
         Paragraph('<b>Who Charges</b>', s['table_header']),
         Paragraph('<b>Amount</b>', s['table_header']),
         Paragraph('<b>Explanation</b>', s['table_header'])],
        [Paragraph('Interchange Fee', s['table_cell']),
         Paragraph('Issuing Bank (Pasha)', s['table_cell']),
         Paragraph('~1.0 AZN', s['table_cell_center']),
         Paragraph('Fee paid by the acquiring bank to the issuing bank for processing the card payment.', s['table_cell'])],
        [Paragraph('Scheme Fee', s['table_cell']),
         Paragraph('Card Network (Visa)', s['table_cell']),
         Paragraph('~0.15 AZN', s['table_cell_center']),
         Paragraph('Fee paid to Visa for using their network.', s['table_cell'])],
        [Paragraph('Acquiring Fee', s['table_cell']),
         Paragraph('Acquiring Bank (Kapital)', s['table_cell']),
         Paragraph('~0.75 AZN', s['table_cell_center']),
         Paragraph('Acquiring bank\'s margin for providing the merchant account.', s['table_cell'])],
        [Paragraph('PSP Fee', s['table_cell']),
         Paragraph('Payment System (CIBPay)', s['table_cell']),
         Paragraph('~0.50 AZN', s['table_cell_center']),
         Paragraph('CIBPay\'s fee for providing the payment gateway service.', s['table_cell'])],
        [Paragraph('<b>Merchant Receives</b>', s['table_cell']),
         Paragraph('', s['table_cell']),
         Paragraph('<b>~47.60 AZN</b>', s['table_cell_center']),
         Paragraph('The merchant receives the remaining amount after all fees.', s['table_cell'])],
    ]

    fee_table = Table(fee_data, colWidths=[2.8*cm, 3.5*cm, 2.2*cm, PAGE_W - 8.5*cm])
    fee_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), ACCENT),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('BACKGROUND', (0, 5), (-1, 5), colors.HexColor('#E8F5E9')),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CCCCCC')),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(fee_table)

    story.append(Spacer(1, 6))

    # ══════════════════════════════════════
    # CHAPTER 9: OTHER WORKFLOWS
    # ══════════════════════════════════════
    story.append(Paragraph('<b>CHAPTER 9</b>', s['chapter_num']))
    story.append(Paragraph('<b>Other Important Workflows</b>', s['chapter_title']))
    story.append(section_hr())

    story.append(Paragraph('<b>9.1 Refund</b>', s['section_head']))
    story.append(Paragraph(
        'A <b>refund</b> is when the merchant returns money to the customer. This happens when: '
        'the customer cancels an order, the product is defective, or the merchant made a mistake.',
        s['body']
    ))
    story.append(Paragraph(
        'The process: The merchant sends a refund request to CIBPay. CIBPay sends it to the acquiring '
        'bank. The acquiring bank sends it through the card network to the issuing bank. The issuing bank '
        'credits (adds) the money back to the customer\'s account. The money is returned to the customer\'s '
        'card. This usually takes 3-7 business days.',
        s['body']
    ))
    story.append(Paragraph(
        '<b>Important:</b> The refund goes back to the original card. You cannot refund to a different card. '
        'If the customer\'s card is expired or closed, the refund will fail.',
        s['yellow_box']
    ))

    story.append(Paragraph('<b>9.2 Chargeback</b>', s['section_head']))
    story.append(Paragraph(
        'A <b>chargeback</b> is when the customer contacts their bank and says: "I did not make this '
        'payment" or "I never received the product." The issuing bank opens a dispute and takes the '
        'money back from the merchant. This is different from a refund because the merchant does NOT '
        'agree to it.',
        s['body']
    ))
    story.append(Paragraph(
        'The process: Customer contacts their issuing bank. The issuing bank creates a chargeback '
        'request. The money is taken from the merchant\'s acquiring bank account and returned to the '
        'customer. The merchant can dispute the chargeback by providing evidence (delivery confirmation, '
        'communication with customer, etc.).',
        s['body']
    ))

    story.append(Paragraph('<b>9.3 3-D Secure (3DS)</b>', s['section_head']))
    story.append(Paragraph(
        '<b>3-D Secure</b> (3DS) is an extra security layer for online payments. When the customer '
        'enters their card details, a popup appears from their bank asking them to enter a one-time '
        'password (OTP) sent to their phone. This proves that the real cardholder is making the payment.',
        s['body']
    ))
    story.append(Paragraph(
        'The process: Customer enters card details. The payment system checks if 3DS is required. '
        'If yes, a redirect happens to the issuing bank\'s 3DS page. The customer enters their OTP. '
        'The bank confirms the identity and sends back an authentication result. The payment continues.',
        s['body']
    ))
    story.append(Paragraph(
        '<b>Benefit:</b> If a 3DS-authenticated transaction is later disputed (chargeback), '
        'the merchant is protected because they have proof that the real cardholder made the payment.',
        s['green_box']
    ))

    story.append(Paragraph('<b>9.4 Card Tokenization</b>', s['section_head']))
    story.append(Paragraph(
        '<b>Card tokenization</b> is a security feature. Instead of storing the real card number, '
        'the system replaces it with a random string called a "token." For example, the real card '
        'number 4111-XXXX-XXXX-1234 is replaced with a token like tok_a8f3k2m9. This token can be '
        'used for future payments instead of the real card number.',
        s['body']
    ))
    story.append(Paragraph(
        'The process: The customer enters their card details once. The payment system sends the card '
        'details to the card network or tokenization provider. The provider creates a token and returns '
        'it. Future payments use only the token. The real card number is never stored or transmitted again.',
        s['body']
    ))
    story.append(Paragraph(
        '<b>Use case:</b> Tokenization is used for recurring payments (subscriptions), '
        'card-on-file (saving a card for future purchases), and payouts (sending money to customer cards). '
        'At Embafinans, we used PayTabs tokenization for credit disbursements to customer cards.',
        s['highlight']
    ))

    story.append(Paragraph('<b>9.5 Payout / Disbursement</b>', s['section_head']))
    story.append(Paragraph(
        'A <b>payout</b> (or disbursement) is when money is sent TO a customer\'s card or wallet. '
        'This is the opposite of a regular payment. Instead of the customer paying the merchant, '
        'the merchant (or system) pays the customer.',
        s['body']
    ))
    story.append(Paragraph(
        '<b>Card Payout:</b> The system sends money to a customer\'s registered card. '
        'The process: The system uses a stored token (from tokenization) to identify the card. '
        'A payout request is sent through the payment system to the acquiring bank. '
        'The bank routes it through the card network to the issuing bank. The issuing bank credits '
        'the customer\'s account.',
        s['body']
    ))
    story.append(Paragraph(
        '<b>Wallet Payout:</b> The system sends money directly to a customer\'s digital wallet '
        '(like Cuzdan) via API. This does not go through a bank or card network. '
        'The system sends an API request to the wallet provider. The wallet provider credits the '
        'customer\'s wallet balance. The wallet provider returns a success or failure response.',
        s['body']
    ))

    story.append(Spacer(1, 6))

    # ══════════════════════════════════════
    # CHAPTER 10: CIBPAY'S ROLE
    # ══════════════════════════════════════
    story.append(Paragraph('<b>CHAPTER 10</b>', s['chapter_num']))
    story.append(Paragraph('<b>CIBPay\'s Role in Detail</b>', s['chapter_title']))
    story.append(section_hr())

    story.append(Paragraph(
        'Now let us look at what CIBPay specifically does in the payment ecosystem. '
        'CIBPay is a <b>Payment Service Provider (PSP)</b>. This means CIBPay sits between '
        'the merchant and the banking system.',
        s['body']
    ))

    story.append(Paragraph('<b>What CIBPay does:</b>', s['section_head']))

    story.append(Paragraph(
        '<bullet>&bull;</bullet> <b>Provides the API:</b> CIBPay gives merchants a REST API '
        'with endpoints for payments, refunds, voids, and status checks. The merchant\'s developer '
        'integrates with this API to accept payments on their website.', s['step']
    ))
    story.append(Paragraph(
        '<bullet>&bull;</bullet> <b>Test and production environments:</b> CIBPay provides a sandbox '
        '(test) environment where merchants can test their integration without real money. '
        'After testing, CIBPay moves the merchant to the production (live) environment.', s['step']
    ))
    story.append(Paragraph(
        '<bullet>&bull;</bullet> <b>Routes to the correct bank:</b> CIBPay knows which acquiring bank '
        'to use for each merchant. When a payment request comes in, CIBPay routes it to the correct bank '
        'and card network automatically.', s['step']
    ))
    story.append(Paragraph(
        '<bullet>&bull;</bullet> <b>Handles multiple payment methods:</b> CIBPay can process Visa, '
        'Mastercard, MilliKart, and potentially other methods like digital wallets. The merchant does not '
        'need separate integrations for each card type.', s['step']
    ))
    story.append(Paragraph(
        '<bullet>&bull;</bullet> <b>Manages webhooks:</b> After a payment, CIBPay sends a notification '
        '(webhook) to the merchant\'s server with the payment result. This tells the merchant: '
        '"Payment 12345 is successful, amount = 50 AZN."', s['step']
    ))
    story.append(Paragraph(
        '<bullet>&bull;</bullet> <b>Provides a back-office panel:</b> CIBPay has an admin panel where '
        'the support team can manage merchant accounts, check transactions, investigate problems, '
        'and configure settings.', s['step']
    ))
    story.append(Paragraph(
        '<bullet>&bull;</bullet> <b>Technical support:</b> CIBPay\'s IT Support team helps merchants '
        'with integration problems, error resolution, and payment investigations. This is YOUR role '
        'if you work at CIBPay.', s['step']
    ))

    story.append(Spacer(1, 4))

    story.append(Paragraph('<b>Where CIBPay fits in the payment flow:</b>', s['section_head']))

    story.append(Paragraph(
        'Customer -> Merchant Website -> <b>CIBPay (API)</b> -> Acquiring Bank -> '
        'Card Network -> Issuing Bank',
        s['highlight']
    ))

    story.append(Paragraph(
        'CIBPay is the FIRST technology layer after the merchant. Everything that happens between '
        'the merchant and CIBPay is your responsibility. If a merchant has an API problem, '
        'an error they do not understand, or a transaction question, they come to you.',
        s['body']
    ))

    story.append(Paragraph(
        '<b>Your daily work at CIBPay would include:</b><br/><br/>'
        '1. Helping merchants integrate with CIBPay API (onboarding).<br/>'
        '2. Troubleshooting API errors (checking logs, testing with Postman).<br/>'
        '3. Investigating failed transactions (authorization declines, timeouts, network issues).<br/>'
        '4. Managing merchant accounts in the back-office (credentials, webhooks, permissions).<br/>'
        '5. Creating and maintaining documentation (API guides, error code references, FAQs).<br/>'
        '6. Communicating with acquiring banks when there are bank-side issues.<br/>'
        '7. Following up with merchants to ensure their problems are resolved.',
        s['green_box']
    ))

    story.append(Spacer(1, 6))

    # ══════════════════════════════════════
    # CHAPTER 11: INTERVIEW Q&A
    # ══════════════════════════════════════
    story.append(Paragraph('<b>CHAPTER 11</b>', s['chapter_num']))
    story.append(Paragraph('<b>Interview Questions and Sample Answers</b>', s['chapter_title']))
    story.append(section_hr())

    story.append(Paragraph(
        'This chapter has interview questions related to the payment ecosystem with sample answers '
        'in simple English. Practice these answers before your CIBPay interview.',
        s['body']
    ))

    # Q1
    story.append(Spacer(1, 6))
    story.append(Paragraph('Q1: What is the difference between an acquiring bank and an issuing bank?', s['orange_box']))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        '<b>Sample Answer:</b> The acquiring bank is the merchant\'s bank. It holds the merchant\'s '
        'account and receives payment requests. The issuing bank is the customer\'s bank. It issued the '
        'customer\'s card and holds the customer\'s money. When a payment happens, the acquiring bank '
        'receives the request and the issuing bank checks if the customer has enough money. They can be '
        'the same bank or different banks. In most cases, they are different banks, and the card network '
        'connects them.',
        s['green_box']
    ))

    # Q2
    story.append(Spacer(1, 6))
    story.append(Paragraph('Q2: Can you explain how money moves from one bank to another?', s['orange_box']))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        '<b>Sample Answer:</b> Yes, there are three phases. First is authorization, which is real-time '
        'and takes 1-3 seconds. The customer pays, the merchant sends the request through the payment '
        'system to the acquiring bank, then to the card network, then to the issuing bank. The issuing '
        'bank checks the balance and responds with approved or declined. Second is clearing, which happens '
        'at the end of the day. Banks exchange transaction data through the card network. Third is settlement, '
        'which happens 1-3 business days later. The actual money moves from the issuing bank to the '
        'acquiring bank through the card network, and then to the merchant\'s account.',
        s['green_box']
    ))

    # Q3
    story.append(Spacer(1, 6))
    story.append(Paragraph('Q3: What role does a payment system like CIBPay play?', s['orange_box']))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        '<b>Sample Answer:</b> CIBPay is the bridge between the merchant and the banking system. '
        'CIBPay provides the API that the merchant uses to accept payments. When a payment request comes '
        'in, CIBPay validates the merchant, checks the API credentials and request format, and then routes '
        'the request to the correct acquiring bank. CIBPay also provides a test environment for merchants '
        'to test their integration, a back-office panel for managing merchant accounts, webhook notifications '
        'for payment results, and technical support for integration issues.',
        s['green_box']
    ))

    # Q4
    story.append(Spacer(1, 6))
    story.append(Paragraph('Q4: What is card tokenization and why is it important?', s['orange_box']))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        '<b>Sample Answer:</b> Card tokenization is a security feature. It replaces the real card number '
        'with a random token. For example, instead of storing 4111-XXXX-XXXX-1234, the system stores '
        'a token like tok_a8f3k2m9. The real card number is never stored or transmitted again. This is '
        'important for PCI-DSS compliance and security. I have hands-on experience with this. '
        'At Embafinans, I implemented a PayTabs card tokenization workflow for credit payouts to '
        'customer cards via Kapital Bank. The process was: register the card with a small verification '
        'amount, receive a token from PayTabs, and then use that token for all future payouts.',
        s['green_box']
    ))

    # Q5
    story.append(Spacer(1, 6))
    story.append(Paragraph('Q5: What is 3-D Secure and how does it work?', s['orange_box']))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        '<b>Sample Answer:</b> 3-D Secure, or 3DS, is an extra security step for online payments. '
        'When the customer enters their card details, a popup appears from their bank asking them to '
        'enter a one-time password, or OTP, sent to their phone. This proves that the real cardholder '
        'is making the payment. The process is: the customer enters card details, the payment system '
        'checks if 3DS is required, if yes, a redirect happens to the issuing bank\'s 3DS page, '
        'the customer enters the OTP, the bank confirms the identity, and the payment continues. '
        'The benefit is that if a 3DS-authenticated transaction is later disputed, the merchant is '
        'protected because they have proof of the customer\'s identity.',
        s['green_box']
    ))

    # Q6
    story.append(Spacer(1, 6))
    story.append(Paragraph('Q6: What is the difference between clearing and settlement?', s['orange_box']))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        '<b>Sample Answer:</b> Clearing is when banks exchange transaction information. It happens '
        'at the end of each business day. No money moves during clearing. Banks only share data about '
        'what transactions happened. Settlement is when the actual money is transferred between banks. '
        'This happens 1-3 business days after the transaction. The card network calculates the net amounts '
        'between banks and transfers the money. A simple analogy: clearing is like sharing a restaurant '
        'bill to see who ordered what, and settlement is when everyone actually pays their part.',
        s['green_box']
    ))

    # Q7
    story.append(Spacer(1, 6))
    story.append(Paragraph('Q7: A merchant says their payment is failing. How do you investigate?', s['orange_box']))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        '<b>Sample Answer:</b> First, I ask the merchant for the error message and the transaction ID. '
        'Then I check where in the payment flow the failure happened. Did the request reach CIBPay? '
        'If not, it is a merchant-side issue - maybe their code or network. If the request reached '
        'CIBPay, did CIBPay send it to the acquiring bank? If the bank declined it, I check the decline '
        'reason code. Common reasons: insufficient funds, expired card, incorrect CVV, card blocked. '
        'I explain the reason to the merchant in simple language and advise them on what to do. '
        'If it is a server-side error, I escalate to our development team. '
        'I also have experience investigating deeper issues. At Embafinans, when card tokenization '
        'payouts failed, I analyzed application and API logs, identified the error, and coordinated '
        'with both Kapital Bank support and PayTabs support to resolve the issue.',
        s['green_box']
    ))

    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=2, color=ACCENT, spaceAfter=10))

    story.append(Paragraph(
        '<b>Final Tip:</b> In the interview, when they ask about payment workflows, always mention that '
        'you understand the COMPLETE flow: authorization (real-time) -> clearing (end of day) -> '
        'settlement (T+1 to T+3). This shows you understand not just the API layer, but the actual '
        'banking process behind it. Also mention your hands-on experience with card tokenization and '
        'wallet integration - this proves you have practical knowledge, not just theory.',
        s['purple_box']
    ))

    # Build
    doc.build(story)

    size = os.path.getsize(output_path)
    print(f"PDF created: {output_path}")
    print(f"Size: {size/1024:.1f} KB")

    try:
        import pdfplumber
        with pdfplumber.open(output_path) as pdf:
            print(f"Total pages: {len(pdf.pages)}")
    except Exception:
        print("Could not count pages")


build()
