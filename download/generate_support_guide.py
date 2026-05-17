import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_JUSTIFY, TA_CENTER
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, PageBreak
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

# ── Output ──
output_path = '/home/z/my-project/download/IT_Support_Interview_Guide.pdf'

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
styles = {}

styles['doc_title'] = ParagraphStyle(
    'DocTitle', fontName='Carlito', fontSize=22, leading=28,
    textColor=DARK, alignment=TA_CENTER, spaceAfter=4
)
styles['doc_subtitle'] = ParagraphStyle(
    'DocSubtitle', fontName='Carlito', fontSize=12, leading=16,
    textColor=ACCENT, alignment=TA_CENTER, spaceAfter=6
)
styles['tip'] = ParagraphStyle(
    'Tip', fontName='Tinos', fontSize=10, leading=14,
    textColor=MUTED, alignment=TA_CENTER, spaceAfter=4,
    fontStyle='italic'
)
styles['topic_num'] = ParagraphStyle(
    'TopicNum', fontName='Carlito', fontSize=10, leading=14,
    textColor=ACCENT, spaceBefore=16, spaceAfter=2
)
styles['topic_title'] = ParagraphStyle(
    'TopicTitle', fontName='Carlito', fontSize=14, leading=20,
    textColor=DARK, spaceBefore=2, spaceAfter=6
)
styles['section_head'] = ParagraphStyle(
    'SectionHead', fontName='Carlito', fontSize=11, leading=16,
    textColor=ACCENT, spaceBefore=10, spaceAfter=4
)
styles['body'] = ParagraphStyle(
    'Body', fontName='Tinos', fontSize=10.5, leading=16,
    textColor=TEXT, alignment=TA_JUSTIFY, spaceAfter=6
)
styles['bullet'] = ParagraphStyle(
    'Bullet', fontName='Tinos', fontSize=10.5, leading=16,
    textColor=TEXT, leftIndent=20, bulletIndent=6,
    spaceAfter=4, alignment=TA_LEFT
)
styles['example_box'] = ParagraphStyle(
    'ExampleBox', fontName='Tinos', fontSize=10.5, leading=16,
    textColor=TEXT, alignment=TA_LEFT, leftIndent=8,
    spaceAfter=2, spaceBefore=2
)
styles['question'] = ParagraphStyle(
    'Question', fontName='Carlito', fontSize=10.5, leading=15,
    textColor=ORANGE_TEXT, spaceBefore=8, spaceAfter=2,
    backColor=ORANGE_BG, borderPadding=(6, 6, 6, 6)
)
styles['answer'] = ParagraphStyle(
    'Answer', fontName='Tinos', fontSize=10.5, leading=16,
    textColor=TEXT, alignment=TA_JUSTIFY, spaceAfter=4,
    backColor=GREEN_BG, borderPadding=(8, 8, 8, 8),
    leftIndent=4
)
styles['key_point'] = ParagraphStyle(
    'KeyPoint', fontName='Carlito', fontSize=10, leading=15,
    textColor=BLUE_TEXT, spaceBefore=6, spaceAfter=4,
    backColor=BLUE_BG, borderPadding=(6, 6, 6, 6),
    leftIndent=4
)
styles['footer'] = ParagraphStyle(
    'Footer', fontName='Carlito', fontSize=9, leading=12,
    textColor=MUTED, alignment=TA_CENTER, spaceBefore=8
)


def section_hr():
    return HRFlowable(width="100%", thickness=0.8, color=ACCENT, spaceAfter=6, spaceBefore=4)


def add_topic(story, number, title, what_is_it, why_important, how_it_works,
              key_tools, interview_q, sample_answer, extra_tip=None):
    """Add a complete topic section with generous spacing."""

    # Topic number + title
    story.append(Paragraph(f'<b>TOPIC {number}</b>', styles['topic_num']))
    story.append(Paragraph(f'<b>{title}</b>', styles['topic_title']))
    story.append(section_hr())

    # What is it?
    story.append(Paragraph('<b>What is this?</b>', styles['section_head']))
    story.append(Paragraph(what_is_it, styles['body']))

    # Why is it important?
    story.append(Paragraph('<b>Why is it important?</b>', styles['section_head']))
    story.append(Paragraph(why_important, styles['body']))

    # How it works
    story.append(Paragraph('<b>How does it work?</b>', styles['section_head']))
    story.append(Paragraph(how_it_works, styles['body']))

    # Key tools
    if key_tools:
        story.append(Paragraph(
            f'<b>Key Tools / Keywords:</b> {key_tools}',
            styles['key_point']
        ))

    # Interview question
    story.append(Paragraph(f'<b>Possible Interview Question:</b>', styles['topic_num']))
    story.append(Paragraph(f'Q: {interview_q}', styles['question']))
    story.append(Spacer(1, 6))
    story.append(Paragraph(f'<b>Sample Answer:</b>', styles['topic_num']))
    story.append(Paragraph(sample_answer, styles['answer']))

    # Extra tip
    if extra_tip:
        story.append(Spacer(1, 4))
        story.append(Paragraph(f'Tip: {extra_tip}', styles['tip']))

    story.append(Spacer(1, 8))


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# BUILD STORY
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
story = []

# ── Title Page ──
story.append(Spacer(1, 60))
story.append(Paragraph('<b>IT Support Specialist</b>', styles['doc_title']))
story.append(Paragraph('<b>Core Competencies Tutorial</b>', styles['doc_subtitle']))
story.append(Spacer(1, 10))
story.append(Paragraph(
    'Simple A1-level English explanations with examples and sample interview answers.',
    styles['tip']
))
story.append(Paragraph(
    'Read this guide before your interview. Practice saying the sample answers aloud.',
    styles['tip']
))
story.append(Spacer(1, 20))
story.append(HRFlowable(width="60%", thickness=2, color=ACCENT, spaceAfter=20))

story.append(Paragraph(
    'This guide explains every skill listed in your Core Competencies section. '
    'For each topic, you will find: what it is, why it is important, how it works, '
    'key tools, a possible interview question, and a sample answer you can use. '
    'All explanations are in simple English so you can understand and remember them easily.',
    styles['body']
))

story.append(Spacer(1, 20))

# ── Table of Contents ──
story.append(Paragraph('<b>CONTENTS</b>', styles['topic_num']))
story.append(section_hr())

toc_items = [
    '1. Merchant Onboarding & API Integration',
    '2. Incident Management & Troubleshooting',
    '3. Log Analysis & Root Cause Investigation',
    '4. Network Tools (ping, telnet, ipconfig, traceroute)',
    '5. REST API Testing & Postman',
    '6. Back-Office Administration',
    '7. Payment Processing Workflows',
    '8. Cybersecurity & Data Protection',
    '9. Technical Documentation & FAQs',
    '10. Client Service & Communication Skills',
    '11. Payment Error Codes & Card Operations',
]

for item in toc_items:
    story.append(Paragraph(item, styles['bullet']))

story.append(PageBreak())

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# TOPIC 1
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
add_topic(story,
    number=1,
    title='Merchant Onboarding & API Integration',
    what_is_it=(
        '<b>Merchant onboarding</b> means helping a new business (merchant) connect to a payment system. '
        'When a store or website wants to accept payments, they need to integrate with the payment '
        'company. This process is called "onboarding." '
        'As a support specialist, your job is to guide the merchant step by step: give them API keys, '
        'help them set up the test environment, explain how the API works, check their integration, '
        'and finally move them to the live (production) environment.'
        '<br/><br/>'
        '<b>API (Application Programming Interface)</b> is a way for two systems to talk to each other. '
        'For example, when a customer clicks "Pay" on a website, the website sends a request through '
        'the API to the payment company. The payment company processes the payment and sends back '
        'a response: "success" or "failed." Your job is to make sure this connection works correctly.'
    ),
    why_important=(
        'Without proper onboarding, merchants cannot accept payments. If the integration is broken, '
        'the merchant loses money and customers get angry. The payment company also loses business. '
        'A good onboarding experience makes merchants happy and they stay with the company for a long time. '
        'This is one of the most important responsibilities for an IT Support Specialist at a payment company.'
    ),
    how_it_works=(
        'The onboarding process has several steps:<br/><br/>'
        '1. <b>Registration:</b> The merchant signs up and creates an account.<br/>'
        '2. <b>Credential Setup:</b> You give the merchant API keys and access credentials.<br/>'
        '3. <b>Test Environment:</b> The merchant connects to the test (sandbox) environment. '
        'They can test payments without real money.<br/>'
        '4. <b>Integration Support:</b> The merchant\'s developers write code to connect to the API. '
        'If they have problems, you help them. You answer questions, check their requests, '
        'and explain error codes.<br/>'
        '5. <b>Testing:</b> You create test cases. You test different scenarios: successful payment, '
        'failed payment, refund, cancellation.<br/>'
        '6. <b>Go-Live:</b> After all tests pass, you move the merchant to the production (live) environment. '
        'Now they can accept real payments from real customers.'
    ),
    key_tools='API keys, Sandbox/Test environment, Postman, Test cases, Error codes, JSON, HTTP requests',
    interview_q='Can you explain the merchant onboarding process?',
    sample_answer=(
        'Of course. The merchant onboarding process has 6 main steps. '
        'First, the merchant registers and creates an account. Then I set up their API credentials '
        'and give them access to the test environment. The merchant\'s developers write code to '
        'connect to our API. During this time, I provide hands-on support: I answer their questions, '
        'help them understand error codes, and check their API requests. '
        'After the integration is ready, I create test cases and we test different scenarios together: '
        'successful payments, failed payments, refunds. When all tests pass, I move the merchant '
        'to the production environment so they can accept real payments.'
    ),
    extra_tip='Always say "test environment" and "production environment" - this shows you understand the process.'
)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# TOPIC 2
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
add_topic(story,
    number=2,
    title='Incident Management & Troubleshooting',
    what_is_it=(
        '<b>Incident management</b> means handling problems when something goes wrong. '
        'For example: a merchant cannot process payments, a transaction fails, '
        'the system is slow, or a merchant gets an error message. '
        'When a problem happens, it is called an "incident." '
        'Your job is to receive the incident report, investigate the problem, find the root cause, '
        'fix it, and inform the merchant.'
        '<br/><br/>'
        '<b>Troubleshooting</b> is the process of finding and fixing problems step by step. '
        'You start with the most common causes and check each one. For example, '
        'if a payment fails: Is the internet connection working? Are the API credentials correct? '
        'Is the merchant\'s code sending the right data? You check each possibility until you find the problem.'
    ),
    why_important=(
        'When merchants have problems, they cannot do business. Every minute of downtime means lost money. '
        'Fast incident management is critical for a payment company. '
        'If you fix problems quickly, merchants trust the company. If you are slow, merchants leave. '
        'Good troubleshooting skills also mean you solve problems permanently, not just temporarily. '
        'This prevents the same problem from happening again.'
    ),
    how_it_works=(
        'The incident management process:<br/><br/>'
        '1. <b>Receive:</b> A merchant reports a problem (via email, ticket, or phone). '
        'You create an incident ticket with details: who, what, when, error message.<br/>'
        '2. <b>Categorize:</b> How serious is the problem? '
        'Critical (system is down), High (some merchants affected), '
        'Medium (one merchant has a problem), Low (question or small issue).<br/>'
        '3. <b>Investigate:</b> You check logs, test the system, reproduce the error. '
        'You ask the merchant for more information if needed.<br/>'
        '4. <b>Fix:</b> You apply a solution. This might be: fixing a configuration, '
        'resetting credentials, escalating to the development team, or providing a workaround.<br/>'
        '5. <b>Verify:</b> You confirm with the merchant that the problem is fixed.<br/>'
        '6. <b>Document:</b> You write what happened, what you did, and how it was fixed. '
        'This helps if the same problem happens again.'
    ),
    key_tools='Ticket system (Jira), Priority levels (Critical/High/Medium/Low), Escalation, SLA',
    interview_q='How do you handle an incident when a merchant reports a payment failure?',
    sample_answer=(
        'First, I create a ticket with all the details: the merchant name, the error message, '
        'and when the problem started. Then I categorize the priority. If it is critical, '
        'I start investigating immediately. I check the system logs to see what happened. '
        'I try to reproduce the error in the test environment. '
        'If I find the root cause, I fix it - for example, if it is a credential problem, '
        'I reset the credentials. If it is a system bug, I escalate to the development team '
        'and provide them with all the details they need. '
        'After the fix, I contact the merchant to confirm the problem is resolved. '
        'Finally, I document the incident in our knowledge base for future reference.'
    ),
    extra_tip='Use the word "escalate" - it shows you know when to involve senior team members.'
)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# TOPIC 3
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
add_topic(story,
    number=3,
    title='Log Analysis & Root Cause Investigation',
    what_is_it=(
        '<b>Log analysis</b> means reading system logs to understand what happened. '
        'A log is a record of events that the system writes automatically. '
        'For example, every API request, every error, every payment transaction is recorded in a log. '
        'When something goes wrong, you read the logs to find out why.'
        '<br/><br/>'
        '<b>Root cause investigation</b> means finding the real reason why a problem happened. '
        'For example, a payment failed. The error message says "timeout." '
        'But "timeout" is just a symptom. The root cause might be: the database was slow, '
        'the network was down, or the merchant\'s server was overloaded. '
        'Your job is to find the ROOT cause, not just the symptom.'
    ),
    why_important=(
        'Without log analysis, you are guessing. You might fix the wrong thing and the problem '
        'comes back. Log analysis gives you facts and evidence. '
        'Root cause investigation is important because if you only fix the symptom, '
        'the same problem will happen again. For example, if you restart a server when it crashes '
        'but do not find out WHY it crashed, it will crash again tomorrow. '
        'Finding the root cause prevents future problems.'
    ),
    how_it_works=(
        'How to analyze logs:<br/><br/>'
        '1. <b>Identify the time:</b> When exactly did the problem happen? Look at the timestamp.<br/>'
        '2. <b>Search for errors:</b> Use keywords like "ERROR", "FAIL", "EXCEPTION", "TIMEOUT" '
        'to find relevant log entries.<br/>'
        '3. <b>Follow the chain:</b> Start from the error and trace backwards. '
        'What happened before the error? What was the system doing?<br/>'
        '4. <b>Check related systems:</b> If the API returned an error, check: '
        'was the database working? Was the network OK? Was the request format correct?<br/>'
        '5. <b>Find the root cause:</b> Ask "why" multiple times. '
        'The payment failed. Why? Timeout. Why? Database was slow. Why? '
        'A query was running too long. Why? Missing index. That is the root cause!<br/>'
        '6. <b>Document:</b> Write down what you found and share it with the team.'
    ),
    key_tools='ELK Stack (Elasticsearch, Logstash, Kibana), grep, log files, Kibana dashboard',
    interview_q='How do you use log analysis to find the root cause of a problem?',
    sample_answer=(
        'When I receive an incident report, the first thing I do is check the logs. '
        'I open our ELK Stack, which includes Kibana for log visualization. '
        'I search for the time of the incident and filter by the merchant ID. '
        'I look for error messages like "ERROR" or "EXCEPTION." '
        'When I find the error, I trace backwards to understand what happened before it. '
        'For example, if I see a "connection timeout" error, I check if the database was responding '
        'at that time, if the network was stable, and if the request was correct. '
        'I keep asking "why" until I find the real root cause. '
        'Once I identify it, I fix the problem and document my findings so the team can learn from it.'
    ),
    extra_tip='Always mention ELK Stack if you have used it - it is a very common tool in fintech.'
)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# TOPIC 4
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
add_topic(story,
    number=4,
    title='Network Tools (ping, telnet, ipconfig, traceroute)',
    what_is_it=(
        'These are simple command-line tools that help you check if a network connection is working. '
        'Think of them as basic tools for checking if two computers can talk to each other.'
        '<br/><br/>'
        '<b>ping:</b> Sends a small message to another computer and waits for a reply. '
        'It tells you: Can I reach this computer? How long does it take? '
        'Example: ping google.com - you send 4 messages and get 4 replies. '
        'If you do not get a reply, the computer is not reachable.'
        '<br/><br/>'
        '<b>telnet:</b> Connects to a specific port on another computer. '
        'It tells you: Is this service (port) open and working? '
        'Example: telnet api.payment.com 443 - checks if the API is accepting connections on port 443.'
        '<br/><br/>'
        '<b>ipconfig (Windows) / ifconfig (Linux):</b> Shows your computer\'s network configuration. '
        'It tells you: What is my IP address? What is my DNS server? '
        'This helps you check if your network settings are correct.'
        '<br/><br/>'
        '<b>traceroute (Linux) / tracert (Windows):</b> Shows the path that data takes from your '
        'computer to the destination. It tells you: Which routers does the data pass through? '
        'Where is the connection slow or broken? '
        'Example: traceroute api.payment.com - shows every "hop" (router) between you and the API.'
    ),
    why_important=(
        'Many problems are caused by network issues. A merchant might say "your API is not working" '
        'but the real problem is their network cannot reach your server. '
        'With these tools, you can quickly check: Is it a network problem or an application problem? '
        'This saves time because you do not waste time looking at application code when the problem '
        'is actually in the network.'
    ),
    how_it_works=(
        'When a merchant reports a connection problem, you use these tools step by step:<br/><br/>'
        '1. <b>ping the server:</b> Can you reach the API server? '
        'If yes, the server is alive. If no, the server might be down or blocked by a firewall.<br/>'
        '2. <b>telnet the port:</b> Is the API service running on the correct port? '
        'For example, HTTPS uses port 443. If telnet fails, the service is not running.<br/>'
        '3. <b>traceroute:</b> Where is the connection failing? '
        'If hop 3 shows a timeout, the problem is at hop 3 (a router or firewall).<br/>'
        '4. <b>ipconfig:</b> Check the merchant\'s DNS settings. '
        'Maybe they are using a DNS server that does not resolve your domain correctly.<br/>'
        '5. <b>Report findings:</b> Tell the merchant: "The problem is on your network at hop 3. '
        'Please contact your network administrator."'
    ),
    key_tools='ping, telnet, traceroute/tracert, ipconfig/ifconfig, nslookup, DNS, Firewall',
    interview_q='A merchant says they cannot connect to our API. How do you troubleshoot?',
    sample_answer=(
        'First, I ask the merchant for the error message and the time it happened. '
        'Then I start with basic network checks. I ping our API server from our side to confirm '
        'it is up and running. Then I ask the merchant to ping our server from their side. '
        'If they cannot ping it, I ask them to run a traceroute to see where the connection fails. '
        'If they can ping it but cannot connect to the API, I ask them to telnet our API port, '
        'usually port 443 for HTTPS. If telnet fails, it might be a firewall issue on their side. '
        'I also ask them to check their DNS settings with ipconfig and try using a public DNS. '
        'Based on the results, I either fix the issue on our side or guide the merchant '
        'to fix it on their network side.'
    ),
    extra_tip='Always say "I check from our side first, then ask the merchant to check from their side." This is systematic.'
)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# TOPIC 5
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
add_topic(story,
    number=5,
    title='REST API Testing & Postman',
    what_is_it=(
        '<b>REST API</b> is the most common way for systems to communicate over the internet. '
        'REST uses standard HTTP methods: GET (read data), POST (send/create data), '
        'PUT (update data), DELETE (remove data). '
        'When a merchant integrates with a payment system, they use REST API to send payment requests.'
        '<br/><br/>'
        '<b>Postman</b> is a tool for testing APIs without writing code. '
        'You enter the API URL, select the method (GET/POST), add headers and body data, '
        'and click "Send." Postman shows you the response: status code, response body, time taken. '
        'It is like a "browser for APIs" - you can test any API endpoint quickly and easily.'
    ),
    why_important=(
        'When a merchant has a problem with the API, you need to test it yourself. '
        'Postman lets you reproduce the exact same request the merchant is making. '
        'If the API works in Postman, the problem is on the merchant\'s side (their code). '
        'If the API also fails in Postman, the problem is on the server side. '
        'This helps you determine where the problem is and fix it faster.'
    ),
    how_it_works=(
        'How to test an API with Postman:<br/><br/>'
        '1. <b>Open Postman</b> and create a new request.<br/>'
        '2. <b>Select the method:</b> GET, POST, PUT, or DELETE.<br/>'
        '3. <b>Enter the URL:</b> For example, https://api.cibpay.az/v1/payments<br/>'
        '4. <b>Add headers:</b> For example, Authorization: Bearer YOUR_API_KEY, '
        'Content-Type: application/json<br/>'
        '5. <b>Add body (for POST):</b> The data you want to send. '
        'For example: {"amount": 100, "currency": "AZN", "merchant_id": "123"}<br/>'
        '6. <b>Click Send</b> and check the response.<br/>'
        '7. <b>Analyze the response:</b> Status code 200 = success, 400 = bad request, '
        '401 = unauthorized, 500 = server error.'
    ),
    key_tools='Postman, HTTP methods (GET/POST/PUT/DELETE), Status codes (200/400/401/500), JSON, Headers, API keys',
    interview_q='How do you use Postman to troubleshoot API issues?',
    sample_answer=(
        'When a merchant reports an API issue, I first reproduce the request in Postman. '
        'I enter the same URL, method, headers, and body that the merchant is using. '
        'I check the response: if I get a 200 success, then the problem is on the merchant\'s side '
        '- maybe their code has a bug or they are using wrong headers. '
        'If I also get an error, I check the status code and response body. '
        'For example, if I get a 401, the API key might be wrong. '
        'If I get a 500, it might be a server-side issue and I escalate to the development team. '
        'I also save my test requests in Postman collections for future use, '
        'so I can quickly retest when similar issues are reported.'
    ),
    extra_tip='Mention status codes: 200 = OK, 400 = Bad Request, 401 = Unauthorized, 404 = Not Found, 500 = Server Error.'
)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# TOPIC 6
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
add_topic(story,
    number=6,
    title='Back-Office Administration',
    what_is_it=(
        '<b>Back-office administration</b> means doing internal tasks in the company\'s admin panel '
        'that are not visible to customers but are necessary for the business to run. '
        'For a payment company, this includes: creating merchant accounts, setting up API credentials, '
        'managing permissions, configuring payment settings, and monitoring transactions.'
        '<br/><br/>'
        'Think of it like the "control room" of the payment company. '
        'While merchants see the public API, the back-office is where the company\'s staff manages '
        'everything behind the scenes.'
    ),
    why_important=(
        'Without back-office administration, merchants cannot be set up, '
        'transactions cannot be monitored, and problems cannot be investigated. '
        'The back-office is essential for daily operations. '
        'A support specialist uses the back-office every day to help merchants: '
        'reset their credentials, change their settings, check their transaction history, '
        'and configure new services.'
    ),
    how_it_works=(
        'Common back-office tasks:<br/><br/>'
        '1. <b>Merchant Account Management:</b> Create new accounts, update merchant details, '
        'activate or deactivate accounts.<br/>'
        '2. <b>Credential Management:</b> Generate API keys, reset passwords, '
        'manage access permissions. This is very important for security.<br/>'
        '3. <b>Transaction Monitoring:</b> View transaction history, check payment statuses, '
        'investigate disputed transactions.<br/>'
        '4. <b>Configuration:</b> Set up payment methods, currency settings, '
        'webhook URLs (where to send payment notifications).<br/>'
        '5. <b>Reporting:</b> Generate reports on transaction volumes, success rates, error rates.'
    ),
    key_tools='Admin panel, Dashboard, Webhooks, API keys, Transaction reports, Merchant settings',
    interview_q='What kind of back-office tasks have you done?',
    sample_answer=(
        'In my previous roles, I regularly used the admin panel for various back-office tasks. '
        'I created and managed merchant accounts, set up API credentials, and configured '
        'payment settings. I managed access permissions - for example, giving a merchant '
        'read-only access or full access depending on their needs. '
        'I also monitored transactions through the admin dashboard, checking payment statuses '
        'and investigating failed or disputed transactions. '
        'When a merchant needed to change their webhook URL or add a new payment method, '
        'I configured these settings in the back-office. '
        'Security was always a priority - I followed strict protocols when handling credentials '
        'and access permissions.'
    ),
    extra_tip='Always mention "security" and "strict protocols" when talking about credential management.'
)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# TOPIC 7
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
add_topic(story,
    number=7,
    title='Payment Processing Workflows',
    what_is_it=(
        '<b>Payment processing</b> is the complete journey of a payment from start to finish. '
        'When a customer clicks "Pay" on a website, many things happen in seconds:<br/><br/>'
        '1. The merchant\'s website sends a payment request to the payment company (CIBPay).<br/>'
        '2. CIBPay checks: Is this merchant active? Are the credentials valid?<br/>'
        '3. CIBPay sends the payment to the bank or card network (Visa, Mastercard).<br/>'
        '4. The bank checks: Does the customer have enough money? Is the card valid?<br/>'
        '5. The bank sends back: "Approved" or "Declined."<br/>'
        '6. CIBPay sends the result to the merchant.<br/>'
        '7. The merchant shows "Payment Successful" or "Payment Failed" to the customer.'
    ),
    why_important=(
        'As an IT Support Specialist at a payment company, you must understand this workflow. '
        'When a merchant reports a problem, you need to know WHERE in the workflow the problem is. '
        'Is the request not reaching CIBPay? Did CIBPay reject it? Did the bank decline it? '
        'Understanding the workflow helps you find the problem quickly and tell the merchant '
        'exactly what happened.'
    ),
    how_it_works=(
        'There are also additional workflows you should know:<br/><br/>'
        '<b>Refund:</b> A merchant wants to return money to a customer. '
        'The merchant sends a refund request through the API. CIBPay processes it and sends '
        'the money back to the customer\'s card.<br/><br/>'
        '<b>Settlement:</b> At the end of the day or week, CIBPay transfers the collected money '
        'to the merchant\'s bank account. This is called settlement.<br/><br/>'
        '<b>Reconciliation:</b> Comparing CIBPay\'s records with the bank\'s records '
        'to make sure all transactions match. If there is a difference, it must be investigated.<br/><br/>'
        '<b>Chargeback:</b> A customer contacts their bank and says "I did not make this payment." '
        'The bank takes the money back from the merchant. This is called a chargeback.'
    ),
    key_tools='Payment Gateway, Acquiring bank, Issuing bank, Card network (Visa/Mastercard), Settlement, Chargeback, Reconciliation',
    interview_q='Can you explain the payment processing workflow?',
    sample_answer=(
        'Yes. When a customer makes a payment, the process has several steps. '
        'First, the merchant sends a payment request to our payment gateway. '
        'We validate the request - check the merchant credentials and the payment details. '
        'Then we send the payment to the acquiring bank, which forwards it to the card network '
        'like Visa or Mastercard. The issuing bank checks if the customer has enough funds '
        'and sends back an approval or decline. '
        'We receive the result and send it back to the merchant. '
        'The whole process usually takes 1-3 seconds. '
        'I also understand related workflows like refunds, settlements, and chargebacks. '
        'This knowledge helps me identify exactly where a problem occurs when a merchant reports an issue. '
        'For example, at Embafinans I implemented a PayTabs card tokenization workflow for credit disbursements '
        'to customer cards via Kapital Bank. I managed the full process: card registration with verification, '
        'token issuance, and token-based payouts. This hands-on experience gave me deep understanding of how '
        'card operations work in practice.'
    ),
    extra_tip='Use the word "gateway" and mention "tokenization" - it shows you understand card operations hands-on.'
)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# TOPIC 8
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
add_topic(story,
    number=8,
    title='Cybersecurity & Data Protection',
    what_is_it=(
        '<b>Cybersecurity</b> means protecting systems, data, and networks from attacks. '
        'In a payment company, cybersecurity is extremely important because you handle '
        'people\'s money and personal information.'
        '<br/><br/>'
        '<b>Data protection</b> means keeping customer and merchant data safe. '
        'This includes: credit card numbers, personal information, transaction history, '
        'API keys, and passwords.'
        '<br/><br/>'
        'Key concepts you should know:<br/><br/>'
        '<b>Encryption:</b> Converting data into a secret code so only authorized people can read it. '
        'For example, HTTPS encrypts all data between the browser and the server.<br/><br/>'
        '<b>Authentication:</b> Verifying who someone is. '
        'For example, API keys, passwords, two-factor authentication (2FA).<br/><br/>'
        '<b>Authorization:</b> Controlling what someone can do. '
        'For example, a merchant can only see their own transactions, not other merchants\' transactions.<br/><br/>'
        '<b>PCI-DSS:</b> Payment Card Industry Data Security Standard. '
        'This is a set of security rules that all payment companies must follow. '
        'It says: never store full credit card numbers, use encryption, regularly test security systems.'
    ),
    why_important=(
        'A security breach at a payment company is catastrophic. '
        'If hackers steal credit card numbers, the company loses reputation, pays huge fines, '
        'and can go out of business. As a support specialist, you handle sensitive data every day: '
        'API keys, merchant credentials, transaction details. You must follow security best practices '
        'to protect this data.'
    ),
    how_it_works=(
        'How to apply security in your daily work:<br/><br/>'
        '1. <b>Never share credentials in plain text.</b> Always use secure channels.<br/>'
        '2. <b>Use strong passwords and API keys.</b> Never use default or weak passwords.<br/>'
        '3. <b>Principle of least privilege.</b> Give each merchant only the access they need, '
        'not more.<br/>'
        '4. <b>Always use HTTPS.</b> Never HTTP (without S). HTTPS encrypts all data.<br/>'
        '5. <b>Monitor for suspicious activity.</b> If a merchant suddenly makes 1000 transactions '
        'instead of their usual 10, investigate immediately.<br/>'
        '6. <b>Follow PCI-DSS rules.</b> Never store full card numbers, always mask them. '
        'For example, show 4XXX XXXX XXXX 1234 instead of the full number.<br/>'
        '7. <b>Report security incidents immediately.</b> If you see something suspicious, '
        'tell your security team right away.'
    ),
    key_tools='HTTPS/TLS, Encryption, PCI-DSS, 2FA, Access control, Firewall, API key management',
    interview_q='How do you ensure data protection and security in your daily work?',
    sample_answer=(
        'Security is a top priority for me. In my daily work, I follow several security practices. '
        'First, I never share API keys or credentials through unsecured channels like email. '
        'I always use the company\'s secure credential management system. '
        'Second, I follow the principle of least privilege - I give each merchant only the access '
        'they need. Third, I always verify that all connections use HTTPS, never plain HTTP. '
        'I also monitor for unusual activity - for example, if a merchant\'s transaction volume '
        'suddenly increases dramatically, I investigate to make sure it is legitimate. '
        'And of course, I follow PCI-DSS rules: I never store full card numbers, '
        'I always mask sensitive data, and I report any security concerns to our security team immediately.'
    ),
    extra_tip='Always mention "PCI-DSS" in a payment company interview. It shows you know the industry standard.'
)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# TOPIC 9
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
add_topic(story,
    number=9,
    title='Technical Documentation & FAQs',
    what_is_it=(
        '<b>Technical documentation</b> means writing guides and manuals that help merchants '
        'use the API and the payment system. This includes: API integration guides, '
        'troubleshooting manuals, error code references, and setup instructions.'
        '<br/><br/>'
        '<b>FAQ (Frequently Asked Questions)</b> is a list of common questions and answers. '
        'For example: "Why is my payment failing?" "How do I get my API key?" '
        '"What does error code 401 mean?" FAQs help merchants find answers quickly '
        'without contacting support.'
    ),
    why_important=(
        'Good documentation reduces the number of support requests. '
        'If merchants can find answers themselves, they do not need to contact you. '
        'This saves time for both merchants and the support team. '
        'Good documentation also makes the onboarding process faster because merchants '
        'can read the integration guide and set up by themselves. '
        'In a payment company, accurate documentation is critical because payment errors '
        'can cause financial loss.'
    ),
    how_it_works=(
        'Types of documentation you should create:<br/><br/>'
        '1. <b>API Integration Guide:</b> Step-by-step instructions for connecting to the API. '
        'Include: endpoint URLs, required headers, request/response examples, error codes.<br/>'
        '2. <b>Test Case Guide:</b> How to test the integration. '
        'Include: test card numbers, test scenarios, expected results.<br/>'
        '3. <b>Error Code Reference:</b> A table of all error codes with explanations. '
        'For example: "401 - Unauthorized: Check your API key."<br/>'
        '4. <b>Troubleshooting Guide:</b> Common problems and how to fix them. '
        'For example: "Payment timeout - Check your network connection and try again."<br/>'
        '5. <b>FAQ:</b> Questions that merchants ask most often, with clear answers.<br/><br/>'
        'Documentation should be: clear, simple, accurate, and up-to-date.'
    ),
    key_tools='Confluence, Wiki, Markdown, API documentation (Swagger/OpenAPI), Screenshots, Examples',
    interview_q='How do you create technical documentation for merchants?',
    sample_answer=(
        'I create different types of documentation for merchants. '
        'The API integration guide includes endpoint URLs, required headers, JSON examples '
        'for requests and responses, and error code explanations. '
        'I also create a troubleshooting guide with the most common problems and their solutions. '
        'For the FAQ, I collect questions that merchants ask most often and write clear answers. '
        'I use simple language and include screenshots and examples so that even non-technical '
        'merchants can understand. '
        'I also maintain the documentation - when the API changes, I update the docs immediately '
        'so merchants always have accurate information.'
    ),
    extra_tip='Say "simple language and screenshots" - this shows you think about non-technical users.'
)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# TOPIC 10
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
add_topic(story,
    number=10,
    title='Client Service & Communication Skills',
    what_is_it=(
        '<b>Client service</b> means helping merchants with their problems in a friendly, '
        'patient, and professional way. In a payment company, the IT Support Specialist is the '
        'primary contact for merchants. Merchants are not always technical people. They might be '
        'business owners, shop managers, or accountants. They do not understand API, JSON, or '
        'HTTP codes. Your job is to explain technical problems in simple language they can understand.'
        '<br/><br/>'
        '<b>Communication skills</b> means you can: listen carefully to the merchant\'s problem, '
        'ask the right questions to understand the issue, explain the solution clearly, '
        'and follow up to make sure the problem is resolved.'
        '<br/><br/>'
        'This role is 50% technical and 50% communication. You can be the best technician in the '
        'world, but if you cannot explain things to merchants clearly, you will not be successful '
        'in this role.'
    ),
    why_important=(
        'The vacancy says: "bridge the gap between complex payment technology and exceptional '
        'client service." This means CIBPay wants someone who is BOTH technical AND good with '
        'people. Many technical people are not good at communication. If you can show both skills, '
        'you have a big advantage over other candidates. '
        'Good communication also reduces the number of support requests because merchants understand '
        'your explanations and can fix simple problems themselves next time.'
    ),
    how_it_works=(
        'How to communicate effectively with merchants:<br/><br/>'
        '1. <b>Listen first:</b> Let the merchant explain their problem completely before you speak. '
        'Do not interrupt.<br/>'
        '2. <b>Ask clarifying questions:</b> "Can you share the error message?" '
        '"What time did this happen?" "Which endpoint are you calling?"<br/>'
        '3. <b>Explain in simple language:</b> Instead of saying "The API returned a 401 Unauthorized '
        'due to an invalid bearer token," say: "Your API key is not correct. Please check your API key '
        'in the back-office and try again."<br/>'
        '4. <b>Provide step-by-step instructions:</b> Break the solution into small steps. '
        'Use numbered lists. Include screenshots when possible.<br/>'
        '5. <b>Follow up:</b> After the fix, contact the merchant to confirm everything is working. '
        'This shows you care about their success.<br/>'
        "6. <b>Stay calm under pressure:</b> Merchants can be angry when payments are not working. "
        'Remember: they are not angry at you personally. Stay professional and solution-focused.<br/>'
        '7. <b>Use the right channel:</b> Email for detailed explanations with screenshots. '
        'Chat for quick questions. Phone calls for urgent or complex issues.'
    ),
    key_tools='Email, Chat, Phone, Ticket system, Screenshots, Step-by-step guides, Empathy, Patience',
    interview_q='How do you handle a frustrated merchant who is angry about a payment issue?',
    sample_answer=(
        'First, I listen carefully and let them explain the problem without interrupting. '
        'I understand that payment issues are stressful for merchants because it affects their '
        'business and their customers. I do not take their frustration personally. '
        'Then I apologize for the inconvenience and assure them I will help. '
        'I ask for specific details: the error message, the time, and the transaction ID. '
        'I explain what I am going to do step by step, so they know I am taking action. '
        'I keep them updated on progress. When the issue is resolved, I follow up to confirm '
        'everything is working and ask if they need anything else. '
        'This approach usually turns a frustrated merchant into a satisfied one. '
        'In my experience, patience and clear communication are key. For example, at Embafinans, '
        'I regularly communicated with external partners like Kapital Bank and PayTabs support teams '
        'to resolve transaction failures. I always kept all parties informed and followed up until '
        'the issue was completely resolved.'
    ),
    extra_tip='Show empathy: say "I understand how important this is for your business." Mention experience with external partners - it shows you can communicate beyond your own team.'
)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# TOPIC 11
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
add_topic(story,
    number=11,
    title='Payment Error Codes & Card Operations',
    what_is_it=(
        'When a payment fails, the system returns an error code. As a support specialist, '
        'you must know what each error code means and how to help the merchant fix it.'
        '<br/><br/>'
        '<b>Common API Error Codes:</b><br/>'
        '<b>200 - Success:</b> The payment was processed successfully.<br/>'
        '<b>400 - Bad Request:</b> The merchant sent incorrect data. '
        'For example: missing required field, wrong format, invalid amount.<br/>'
        '<b>401 - Unauthorized:</b> The API key is wrong, expired, or missing.<br/>'
        '<b>403 - Forbidden:</b> The merchant does not have permission for this action.<br/>'
        '<b>404 - Not Found:</b> The URL or resource does not exist.<br/>'
        '<b>408 - Request Timeout:</b> The request took too long. '
        'The merchant\'s server or network might be slow.<br/>'
        '<b>429 - Too Many Requests:</b> The merchant is sending too many requests too fast. '
        'They need to slow down.<br/>'
        '<b>500 - Internal Server Error:</b> Something is wrong on CIBPay\'s side. '
        'Escalate to the development team.<br/>'
        '<b>502 / 503 - Service Unavailable:</b> The server is temporarily down or under maintenance.<br/><br/>'
        '<b>Common Card Decline Reasons:</b><br/>'
        '<b>Insufficient funds:</b> The customer does not have enough money in their account.<br/>'
        '<b>Expired card:</b> The customer\'s card has expired.<br/>'
        '<b>Incorrect CVV:</b> The 3-digit security code on the back of the card is wrong.<br/>'
        '<b>Card blocked:</b> The customer\'s bank has blocked the card for security reasons.<br/>'
        '<b>Transaction limit exceeded:</b> The payment amount is higher than the card\'s limit.<br/><br/>'
        '<b>Important concepts:</b><br/>'
        '<b>3-D Secure (3DS):</b> An extra security step where the customer must enter a '
        'one-time password (OTP) sent by their bank. This is required for online payments in many countries.<br/>'
        '<b>Card Tokenization:</b> Replacing the real card number with a random token (like '
        '4XXX-XXXX-XXXX-1234). This makes transactions safer because the real card number is never stored.'
    ),
    why_important=(
        'Merchants will call you every day asking: "Why did this payment fail?" '
        'If you can quickly look at the error code and explain the reason, you solve the problem fast. '
        'If you do not know the error codes, you have to ask someone else, which wastes time and '
        'makes the merchant lose trust in you. Knowing card decline reasons is also important because '
        'merchants often ask: "The customer says they have money, why was the card declined?" '
        'You need to explain the possible reasons clearly.'
    ),
    how_it_works=(
        'How to handle error reports from merchants:<br/><br/>'
        '1. <b>Ask for the error code:</b> "Can you share the exact error message or code you received?"<br/>'
        '2. <b>Look up the error:</b> Check your error code reference table.<br/>'
        '3. <b>Determine the cause:</b> Is it a merchant-side issue (400, 401, 408) '
        'or a server-side issue (500, 502, 503)?<br/>'
        '4. <b>Explain to the merchant:</b> Tell them what the error means in simple language '
        'and what they need to do to fix it.<br/>'
        '5. <b>For card declines:</b> The merchant cannot fix these. '
        'Explain that the customer needs to contact their bank or use a different card.<br/>'
        '6. <b>For server errors:</b> Escalate to the development team immediately. '
        'Tell the merchant: "Our team is working on this. I will update you shortly."'
    ),
    key_tools='HTTP status codes, Card decline reasons, 3-D Secure (3DS), OTP, Card tokenization, Error code reference table',
    interview_q='A merchant says a payment was declined. How do you investigate?',
    sample_answer=(
        'First, I ask the merchant for the transaction ID and the error code. '
        'If the error code is a client-side error like 400, I check the request data - '
        'maybe the amount is invalid or a required field is missing. '
        'If it is a 401, I check their API key. '
        'If the payment was declined by the bank, I check the decline reason code. '
        'Common reasons are: insufficient funds, expired card, incorrect CVV, or card blocked. '
        'I explain the reason to the merchant and advise them to ask the customer to '
        'contact their bank or try a different payment method. '
        'If I see a 500 or 503 error, I know it is a server-side issue and I immediately escalate '
        'to our development team while keeping the merchant updated on the progress. '
        'In my experience at Embafinans, when card transactions failed during PayTabs payouts, '
        'I contacted both the Kapital Bank support team and the PayTabs support team to find the root cause. '
        'This cross-team coordination helped us resolve issues faster.'
    ),
    extra_tip='Mention that you have real experience coordinating with bank support teams - this is very valuable for a payment company.'
)

# ── Final Tips Section ──
story.append(Spacer(1, 10))
story.append(HRFlowable(width="100%", thickness=2, color=ACCENT, spaceAfter=12))

story.append(Paragraph('<b>FINAL INTERVIEW TIPS</b>', styles['topic_title']))
story.append(section_hr())

tips = [
    ('<b>Use the STAR Method:</b> S (Situation) = What was the problem? '
     'T (Task) = What did you need to do? A (Action) = What did YOU do? '
     'R (Result) = What was the outcome? Use this structure for every answer.'),
    ('<b>Use Numbers:</b> "300-500 daily transactions" is better than "many transactions." '
     'Numbers show measurable impact.'),
    ('<b>Connect Everything to Your Experience:</b> When they ask about theory, '
     'always give an example from your work at Embafinans, Birbonus, or Umico.'),
    ('<b>Be Honest:</b> If you do not know something, say: '
     '"I have basic knowledge of this and I am learning more." '
     'Then connect it to what you DO know.'),
    ('<b>Speak Confidently:</b> Your 15+ years of engineering background is a big advantage. '
     'Not many IT Support specialists have deep technical knowledge.'),
    ('<b>Ask Questions:</b> At the end, ask about the team, current challenges, '
     'and the tools they use. This shows interest and preparation.'),
]

for i, tip in enumerate(tips):
    story.append(Paragraph(f'{i+1}. {tip}', styles['body']))

story.append(Spacer(1, 10))
story.append(Paragraph(
    'Remember: You do not need to be perfect. You need to show that you can learn quickly '
    'and solve problems. Good luck!',
    styles['tip']
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
