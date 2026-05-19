import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.lib import colors
from reportlab.lib.units import cm, mm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, KeepTogether, PageBreak
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

# ── Palette ──
ACCENT = colors.HexColor('#297088')
DARK = colors.HexColor('#181715')
TEXT = colors.HexColor('#333333')
MUTED = colors.HexColor('#908d86')
LIGHT_LINE = colors.HexColor('#cfc9b9')
TIP_BG = colors.HexColor('#e8f4f8')
SAY_BG = colors.HexColor('#f0f9f0')
WARN_BG = colors.HexColor('#fff8e1')
QUESTION_BG = colors.HexColor('#f3f2f1')

# ── Output ──
output_path = '/home/z/my-project/download/BA_Interview_Self_Expression_Guide.pdf'

doc = SimpleDocTemplate(
    output_path,
    pagesize=A4,
    leftMargin=1.8*cm,
    rightMargin=1.8*cm,
    topMargin=1.5*cm,
    bottomMargin=1.5*cm,
)

PAGE_W = A4[0] - 3.6*cm
PAGE_H = A4[1] - 3.0*cm

# ── Styles ──
sCoverTitle = ParagraphStyle(
    'CoverTitle', fontName='CarlitoBold', fontSize=28, leading=36,
    textColor=DARK, alignment=TA_CENTER, spaceAfter=8
)
sCoverSub = ParagraphStyle(
    'CoverSub', fontName='Carlito', fontSize=14, leading=20,
    textColor=ACCENT, alignment=TA_CENTER, spaceAfter=4
)
sCoverInfo = ParagraphStyle(
    'CoverInfo', fontName='Tinos', fontSize=11, leading=16,
    textColor=MUTED, alignment=TA_CENTER, spaceAfter=2
)
sSectionHead = ParagraphStyle(
    'SectionHead', fontName='CarlitoBold', fontSize=13, leading=18,
    textColor=ACCENT, spaceBefore=14, spaceAfter=4
)
sSubHead = ParagraphStyle(
    'SubHead', fontName='CarlitoBold', fontSize=10.5, leading=14,
    textColor=DARK, spaceBefore=8, spaceAfter=3
)
sBody = ParagraphStyle(
    'Body', fontName='Tinos', fontSize=9.5, leading=14,
    textColor=TEXT, alignment=TA_JUSTIFY, spaceAfter=3
)
sSay = ParagraphStyle(
    'Say', fontName='Tinos', fontSize=9.5, leading=14,
    textColor=colors.HexColor('#1a5c2e'), alignment=TA_LEFT,
    spaceAfter=2, leftIndent=8, rightIndent=8
)
sQuestion = ParagraphStyle(
    'Question', fontName='CarlitoBold', fontSize=9.5, leading=13,
    textColor=colors.HexColor('#7a4a00'), spaceBefore=4, spaceAfter=2,
    leftIndent=8
)
sTip = ParagraphStyle(
    'Tip', fontName='Tinos', fontSize=9, leading=13,
    textColor=colors.HexColor('#1a5c5c'), spaceAfter=2,
    leftIndent=8, rightIndent=8
)
sBullet = ParagraphStyle(
    'Bullet', fontName='Tinos', fontSize=9.5, leading=13,
    textColor=TEXT, leftIndent=18, bulletIndent=6,
    spaceAfter=2, alignment=TA_LEFT
)
sNumber = ParagraphStyle(
    'Number', fontName='Tinos', fontSize=9.5, leading=13,
    textColor=TEXT, leftIndent=18, bulletIndent=6,
    spaceAfter=3, alignment=TA_LEFT
)

def hr():
    return HRFlowable(width="100%", thickness=1, color=ACCENT, spaceAfter=4, spaceBefore=2)

def thin_hr():
    return HRFlowable(width="100%", thickness=0.5, color=LIGHT_LINE, spaceAfter=3, spaceBefore=3)

def say_box(text):
    """Green box for 'What to say' examples."""
    inner = Paragraph(text, sSay)
    t = Table([[inner]], colWidths=[PAGE_W - 0.6*cm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), SAY_BG),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#c8e6c9')),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    return t

def question_box(text):
    """Orange box for interview questions."""
    inner = Paragraph(text, sQuestion)
    t = Table([[inner]], colWidths=[PAGE_W - 0.6*cm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), WARN_BG),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#ffe0b2')),
    ]))
    return t

def tip_box(text):
    """Blue box for tips."""
    inner = Paragraph(text, sTip)
    t = Table([[inner]], colWidths=[PAGE_W - 0.6*cm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), TIP_BG),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#b3e5fc')),
    ]))
    return t

def bullet(text):
    return Paragraph('<bullet>&bull;</bullet> ' + text, sBullet)

def numbered(num, text):
    return Paragraph(f'<b>{num}.</b> {text}', sNumber)

def body(text):
    return Paragraph(text, sBody)

def subhead(text):
    return Paragraph(text, sSubHead)

def section(text):
    return Paragraph(text, sSectionHead)


def build():
    story = []

    # ══════════════════════════════════════
    # COVER PAGE
    # ══════════════════════════════════════
    story.append(Spacer(1, 80))
    story.append(Paragraph('BA Interview', sCoverTitle))
    story.append(Paragraph('Self-Expression Guide', sCoverTitle))
    story.append(Spacer(1, 12))
    story.append(HRFlowable(width="60%", thickness=2, color=ACCENT, spaceAfter=12, spaceBefore=4))
    story.append(Paragraph('How to Talk About Your CV in Interviews', sCoverSub))
    story.append(Paragraph('Simple English (A1-A2 Level)', sCoverSub))
    story.append(Spacer(1, 30))
    story.append(Paragraph('Based on: Business Analyst CV', sCoverInfo))
    story.append(Paragraph('Zamir Jamalov', sCoverInfo))
    story.append(Spacer(1, 50))
    story.append(Paragraph('This guide helps you explain every part of your CV', sCoverInfo))
    story.append(Paragraph('in a clear, confident, and simple way.', sCoverInfo))

    story.append(PageBreak())

    # ══════════════════════════════════════
    # TABLE OF CONTENTS
    # ══════════════════════════════════════
    story.append(section('TABLE OF CONTENTS'))
    story.append(hr())

    toc_items = [
        '1.  How to Introduce Yourself (Elevator Pitch)',
        '2.  How to Explain Your Professional Summary',
        '3.  How to Talk About Your Skills',
        '4.  How to Talk About Each Job',
        '5.  How to Explain Your Projects at Embafinans',
        '6.  How to Talk About Your Technical Foundation',
        '7.  How to Explain Your Education',
        '8.  Common Interview Questions and Answers',
        '9.  Difficult Questions and How to Answer Them',
        '10. Tips for Confidence in Interviews',
    ]
    for item in toc_items:
        story.append(Paragraph(item, ParagraphStyle(
            'TOCItem', fontName='Tinos', fontSize=10, leading=16,
            textColor=TEXT, leftIndent=12, spaceAfter=2
        )))

    story.append(PageBreak())

    # ══════════════════════════════════════
    # SECTION 1: ELEVATOR PITCH
    # ══════════════════════════════════════
    story.append(section('1. How to Introduce Yourself (Elevator Pitch)'))
    story.append(hr())

    body_text = (
        'The first question in every interview is: <b>"Tell me about yourself."</b> '
        'This is your most important answer. You have 60-90 seconds (1-2 minutes) to make a good impression. '
        'Do NOT read your CV. Tell a <b>short story</b> about who you are, what you do, and why you are here.'
    )
    story.append(body(body_text))
    story.append(Spacer(1, 4))

    story.append(subhead('What to Say (Practice This Many Times):'))
    story.append(say_box(
        '<b>"Hi, my name is Zamir Jamalov.</b><br/><br/>'
        'I am a Business Analyst with <b>2+ years of experience</b> in fintech and e-commerce. '
        'Before this, I worked <b>15+ years as a Software Engineer</b> in banking systems. '
        'So I have both technical skills and business analysis skills.<br/><br/>'
        'In my current role at <b>Embafinans</b>, I delivered 4 big projects: '
        'a credit scoring system, an online sales channel, a delivery tracking dashboard, '
        'and a full credit lifecycle system. I worked with risk teams, sales teams, and developers.<br/><br/>'
        'Before Embafinans, I worked at <b>Birbonus</b> as a BA, designing a loyalty bonus system. '
        'And before that, at <b>Umico</b> as a PostgreSQL Developer and L2 Support Specialist.<br/><br/>'
        'My engineering background helps me <b>understand technical teams</b> very well. '
        'I can speak both business language and technical language. '
        'I am here because I want to bring my experience to your team and deliver real results."'
    ))
    story.append(Spacer(1, 4))

    story.append(tip_box(
        '<b>TIP:</b> Practice this speech 20-30 times at home. Stand in front of a mirror. '
        'Speak slowly. Smile. When you know this by heart, you will feel confident at the start of every interview.'
    ))
    story.append(Spacer(1, 4))

    story.append(subhead('Key Points to Remember:'))
    story.append(numbered(1, '<b>Start with your name and current role.</b> "I am Zamir Jamalov, a Business Analyst..."'))
    story.append(numbered(2, '<b>Mention your years of experience.</b> "2+ years as BA, 15+ years as Software Engineer."'))
    story.append(numbered(3, '<b>Name your current company and key projects.</b> "At Embafinans, I delivered 4 projects..."'))
    story.append(numbered(4, '<b>Quickly mention previous companies.</b> "Before that, Birbonus and Umico."'))
    story.append(numbered(5, '<b>Explain your unique value.</b> "My engineering background helps me understand technical teams."'))
    story.append(numbered(6, '<b>Finish with why you are here.</b> "I want to bring my experience to your team."'))

    story.append(PageBreak())

    # ══════════════════════════════════════
    # SECTION 2: PROFESSIONAL SUMMARY
    # ══════════════════════════════════════
    story.append(section('2. How to Explain Your Professional Summary'))
    story.append(hr())

    story.append(question_box(
        '<b>Interviewer may ask:</b> "I see your profile summary says you specialize in process digitization '
        'and requirements documentation. Can you tell me more about that?"'
    ))
    story.append(Spacer(1, 4))

    story.append(say_box(
        '<b>What to say:</b><br/><br/>'
        '"Yes. As a Business Analyst, my main job is to <b>understand what the business needs</b> '
        'and write it down in a clear way that developers can understand.<br/><br/>'
        'For example, at Embafinans, the risk team told me they need a faster credit scoring system. '
        'I talked to them, understood their process, and created <b>BRD, FRD, and User Stories</b>. '
        'Then I worked with the development team to build it. The result was <b>2 times faster</b> credit decisions.<br/><br/>'
        'So process digitization means: I take a manual or slow business process, analyze it, '
        'design a better digital version, and work with IT to build it."'
    ))
    story.append(Spacer(1, 4))

    story.append(body(
        'Your CV summary says: <i>"Engineering background enables precise translation of business needs '
        'into technical specifications."</i> If they ask about this:'
    ))
    story.append(say_box(
        '<b>What to say:</b><br/><br/>'
        '"Because I was a Software Engineer for 15 years, I know how developers think. '
        'When a business person says <i>\'I want a faster process\'</i>, I can translate that '
        'into specific technical requirements. I know what API endpoints are, what database tables are, '
        'what a deployment means. So I can write requirements that are <b>clear, precise, and actionable</b>. '
        'This saves time for everyone."'
    ))

    story.append(PageBreak())

    # ══════════════════════════════════════
    # SECTION 3: SKILLS
    # ══════════════════════════════════════
    story.append(section('3. How to Talk About Your Skills'))
    story.append(hr())

    story.append(body(
        'Your CV has 4 skill groups. The interviewer may ask about any of them. '
        'Here is how to explain each group in simple words.'
    ))
    story.append(Spacer(1, 4))

    # Business Analysis Skills
    story.append(subhead('A. Business Analysis Skills'))
    story.append(question_box(
        '<b>Interviewer:</b> "I see you work with BRD, FRD, User Stories, and BPMN. '
        'Can you explain your experience with these?"'
    ))
    story.append(Spacer(1, 3))
    story.append(say_box(
        '<b>What to say:</b><br/><br/>'
        '"Of course. Let me explain each one with my real experience:<br/><br/>'
        '<b>BRD (Business Requirements Document):</b> This is the main document. '
        'It explains WHAT the business needs. At Embafinans, I wrote BRDs for all 4 projects. '
        'For example, the BNPL credit scoring project started with a BRD that described '
        'the business problem, goals, and success criteria.<br/><br/>'
        '<b>User Stories and Acceptance Criteria:</b> I write user stories in the format: '
        '<i>\'As a [user], I want [action], so that [benefit].\'</i> '
        'I also write Gherkin Given-When-Then acceptance criteria. '
        'At Birbonus, I wrote user stories for the loyalty bonus system rules.<br/><br/>'
        '<b>BPMN (As-Is / To-Be):</b> I draw process diagrams. First, I draw the current process (As-Is). '
        'Then I design the improved process (To-Be). At Embafinans, I drew BPMN diagrams for the credit lifecycle '
        'to show how applications flow from submission to disbursement to collection."'
    ))
    story.append(Spacer(1, 6))

    # Technical Skills
    story.append(subhead('B. Technical Skills'))
    story.append(question_box(
        '<b>Interviewer:</b> "You list REST API, Swagger, Postman, and SQL. '
        'How do you use these as a BA?"'
    ))
    story.append(Spacer(1, 3))
    story.append(say_box(
        '<b>What to say:</b><br/><br/>'
        '"As a BA with an engineering background, I use these tools in my daily work:<br/><br/>'
        '<b>REST API and JSON:</b> I understand how APIs work. When I write requirements for a new feature, '
        'I can define the API endpoints, request/response formats, and error codes. '
        'At Embafinans, I defined REST API specifications for the payment gateway integration.<br/><br/>'
        '<b>Swagger / OpenAPI 3.0:</b> I use Swagger to document APIs. I create API specifications '
        'that developers can directly use. This makes the handoff from BA to development very smooth.<br/><br/>'
        '<b>Postman:</b> I test APIs during UAT. I send requests, check responses, and verify that '
        'the system works correctly before the user accepts it.<br/><br/>'
        '<b>SQL:</b> I use SQL to analyze data and resolve stakeholder disagreements. '
        'For example, if two teams have different priorities, I run SQL queries to get real data '
        'and show evidence-based recommendations."'
    ))
    story.append(Spacer(1, 6))

    # Process & Tools
    story.append(subhead('C. Process and Tools'))
    story.append(question_box(
        '<b>Interviewer:</b> "Tell me about your experience with Agile, Scrum, and Jira."'
    ))
    story.append(Spacer(1, 3))
    story.append(say_box(
        '<b>What to say:</b><br/><br/>'
        '"I work in Agile/Scrum environment. At Embafinans, we have sprint planning, '
        'daily standups, and sprint reviews. I manage the backlog in <b>Jira</b> '
        'and create user stories with acceptance criteria and priority.<br/><br/>'
        'I also use <b>Confluence</b> for documentation. I create pages for BRDs, '
        'meeting notes, and technical specifications. '
        'For UAT, I coordinate with business stakeholders to test the system '
        'and collect their feedback before release."'
    ))
    story.append(Spacer(1, 6))

    # Languages
    story.append(subhead('D. Languages'))
    story.append(body(
        'If they ask about your English level, say:'
    ))
    story.append(say_box(
        '<b>What to say:</b><br/><br/>'
        '"I speak Azerbaijani as my native language, Russian fluently, '
        'and English at a professional level. I read and write technical documentation in English every day. '
        'I have experience working with international teams and external vendors like PayTabs."'
    ))

    story.append(PageBreak())

    # ══════════════════════════════════════
    # SECTION 4: PROFESSIONAL EXPERIENCE
    # ══════════════════════════════════════
    story.append(section('4. How to Talk About Each Job'))
    story.append(hr())

    story.append(body(
        'The interviewer will likely ask: <b>"Walk me through your CV."</b> '
        'This means they want you to explain each job from top to bottom. '
        'Start with your most recent job and go backward.'
    ))
    story.append(Spacer(1, 4))

    # Embafinans
    story.append(subhead('A. Embafinans (Current Job - Most Important)'))
    story.append(body(
        'This is your most recent and longest experience. Spend the most time here (2-3 minutes). '
        'Focus on projects and methodology.'
    ))
    story.append(Spacer(1, 3))
    story.append(say_box(
        '<b>What to say:</b><br/><br/>'
        '"I joined Embafinans in 2025 as an IT Business Analyst. '
        'This is a fintech company that provides consumer finance products.<br/><br/>'
        'In my time here, I delivered <b>4 major projects</b>:<br/><br/>'
        'First, a <b>BNPL Credit Scoring System</b>. The business needed faster credit decisions. '
        'I worked with the risk team to design a pre-screen assessment with multiple factors. '
        'The result was credit decisions that are <b>2 times faster</b>.<br/><br/>'
        'Second, a <b>B2C Sales Channel with Payment Gateway Integration</b>. '
        'We built an online application system where customers can apply for credit online '
        'and make payments. This system handles <b>300-500 daily applications</b>.<br/><br/>'
        'Third, a <b>Goods Loan Delivery Tracking Dashboard</b>. '
        'We had problems with delivery errors. I designed a real-time monitoring dashboard '
        'with digital e-signature. This reduced errors by <b>2 times</b>.<br/><br/>'
        'Fourth, I managed the <b>End-to-End Credit Lifecycle</b> '
        'from application to disbursement to collection, working with cross-functional teams.<br/><br/>'
        'My methodology is: Discovery (talk to stakeholders), Process Modeling (BPMN), '
        'Requirements Documentation (BRD, FRD, User Stories), Technical Specification (API specs), '
        'UAT Coordination (testing with business), and Backlog Prioritization (RICE framework)."'
    ))
    story.append(Spacer(1, 6))

    # Birbonus
    story.append(subhead('B. Birbonus'))
    story.append(say_box(
        '<b>What to say:</b><br/><br/>'
        '"Before Embafinans, I worked at Birbonus as a Business Analyst in 2024-2025. '
        'Birbonus is a customer loyalty platform. My main project was designing a <b>bonus system</b> '
        'where shoppers earn rewards on purchases and redeem them at partner merchants.<br/><br/>'
        'I conducted stakeholder sessions to define earning rules, eligibility criteria, '
        'and partner settlement workflows. This was a great experience in designing systems '
        'that connect multiple businesses together."'
    ))
    story.append(Spacer(1, 6))

    # Umico
    story.append(subhead('C. Umico'))
    story.append(say_box(
        '<b>What to say:</b><br/><br/>'
        '"Before Birbonus, I worked at Umico from 2022 to 2024 as a PostgreSQL Developer '
        'and L2 Support Specialist. Here I built backend features using PostgreSQL and resolved '
        'production incidents using <b>ELK Stack log analysis</b>.<br/><br/>'
        'I also supported partner teams with API integration onboarding. '
        'This role gave me strong technical skills that help me in my current BA role, '
        'because I understand the technical side very well."'
    ))
    story.append(Spacer(1, 4))

    story.append(tip_box(
        '<b>TIP:</b> When talking about jobs, always answer in this order: '
        '<b>When</b> you worked there, <b>What</b> your role was, '
        '<b>What</b> you achieved (with numbers if possible), and <b>Why</b> it matters.'
    ))

    story.append(PageBreak())

    # ══════════════════════════════════════
    # SECTION 5: PROJECTS
    # ══════════════════════════════════════
    story.append(section('5. How to Explain Your Projects at Embafinans'))
    story.append(hr())

    story.append(body(
        'The interviewer will probably ask about your projects in detail. '
        'For each project, use the <b>STAR method</b>: '
        '<b>S</b>ituation (the problem), <b>T</b>ask (your job), '
        '<b>A</b>ction (what you did), <b>R</b>esult (the outcome).'
    ))
    story.append(Spacer(1, 4))

    # Project 1
    story.append(subhead('Project 1: BNPL Credit Scoring'))
    story.append(say_box(
        '<b>S - Situation:</b> "The credit approval process was slow. '
        'It took too long to evaluate customer credit applications."<br/><br/>'
        '<b>T - Task:</b> "The risk team asked me to design a faster, automated credit scoring system."<br/><br/>'
        '<b>A - Action:</b> "I conducted stakeholder sessions with the risk team, '
        'mapped the As-Is process with BPMN, designed the To-Be process, '
        'wrote BRD and FRD with detailed requirements, and created user stories. '
        'I also defined API specifications for integration with external data sources."<br/><br/>'
        '<b>R - Result:</b> "The new system made credit decisions <b>2 times faster</b>. '
        'The automated multi-factor assessment reduced manual work significantly."'
    ))
    story.append(Spacer(1, 6))

    # Project 2
    story.append(subhead('Project 2: B2C Sales Channel'))
    story.append(say_box(
        '<b>S - Situation:</b> "The company only had offline channels for credit applications. '
        'They wanted an online presence."<br/><br/>'
        '<b>T - Task:</b> "Design and deliver an online B2C sales channel '
        'with payment gateway integration."<br/><br/>'
        '<b>A - Action:</b> "I worked with sales, IT, and payment teams. '
        'I wrote detailed requirements, defined API specifications in Swagger, '
        'and coordinated UAT testing. I also created sequence diagrams for the integration flow."<br/><br/>'
        '<b>R - Result:</b> "The system now processes <b>300-500 daily applications</b> '
        'with online payment processing."'
    ))
    story.append(Spacer(1, 6))

    # Project 3
    story.append(subhead('Project 3: Delivery Tracking Dashboard'))
    story.append(say_box(
        '<b>S - Situation:</b> "Delivery tracking was manual and had many errors. '
        'There was no real-time visibility."<br/><br/>'
        '<b>T - Task:</b> "Design a digital dashboard for real-time delivery monitoring."<br/><br/>'
        '<b>A - Action:</b> "I analyzed the existing delivery process, designed a digital workflow '
        'with real-time monitoring, and added digital e-signature capability. '
        'I wrote requirements and coordinated with the development team."<br/><br/>'
        '<b>R - Result:</b> "<b>2 times fewer errors</b> in delivery tracking. '
        'Real-time visibility for all stakeholders."'
    ))
    story.append(Spacer(1, 6))

    story.append(tip_box(
        '<b>TIP:</b> Always mention <b>numbers</b> when you can. "2 times faster", "300-500 daily", '
        '"2 times fewer errors". Numbers make your answer more powerful and believable.'
    ))

    story.append(PageBreak())

    # ══════════════════════════════════════
    # SECTION 6: TECHNICAL FOUNDATION
    # ══════════════════════════════════════
    story.append(section('6. How to Talk About Your Technical Foundation'))
    story.append(hr())

    story.append(body(
        'Your CV shows <b>15+ years in software engineering</b>. This is one of your strongest points, '
        'but it can also create difficult questions. Here is how to handle it.'
    ))
    story.append(Spacer(1, 4))

    story.append(question_box(
        '<b>Interviewer may ask:</b> "I see you have 15+ years as a Software Engineer. '
        'Why did you switch to Business Analysis?"'
    ))
    story.append(Spacer(1, 3))
    story.append(say_box(
        '<b>What to say:</b><br/><br/>'
        '"In my 15 years as a Software Engineer, I worked at the Central Bank of Azerbaijan, '
        'Unibank, and ASAN Service. I built payment gateway systems, mobile banking backends, '
        'and government platforms using C#, Oracle, PostgreSQL, and MongoDB.<br/><br/>'
        'Over the years, I realized that I enjoy the <b>planning and analysis part</b> more '
        'than the coding part. I am good at understanding business needs, talking to stakeholders, '
        'and translating requirements into technical specifications.<br/><br/>'
        'So I made a natural transition to Business Analysis. My engineering background is not a weakness '
        'it is a <b>strength</b>. It means I can understand both the business side and the technical side. '
        'I can write better requirements because I know what developers need. '
        'And during production incidents, I can do root cause analysis faster because I understand the code."'
    ))
    story.append(Spacer(1, 4))

    story.append(question_box(
        '<b>Interviewer may ask:</b> "Are you overqualified for this role?"'
    ))
    story.append(Spacer(1, 3))
    story.append(say_box(
        '<b>What to say:</b><br/><br/>'
        '"I understand why you might think that. But my engineering experience is a tool that helps me '
        'be a <b>better Business Analyst</b>, not something that makes me overqualified. '
        'I am passionate about business analysis. I enjoy understanding business problems, '
        'designing solutions, and delivering them. Every project I delivered at Embafinans '
        'proves that I am focused on BA work and I deliver results."'
    ))
    story.append(Spacer(1, 4))

    story.append(tip_box(
        '<b>TIP:</b> Never say "I got tired of coding" or "I want a less stressful job". '
        'Always say you made a <b>positive choice</b> toward BA because you <b>enjoy</b> it. '
        'Frame your engineering background as a <b>superpower</b> for BA work.'
    ))

    story.append(PageBreak())

    # ══════════════════════════════════════
    # SECTION 7: EDUCATION
    # ══════════════════════════════════════
    story.append(section('7. How to Explain Your Education'))
    story.append(hr())

    story.append(question_box(
        '<b>Interviewer may ask:</b> "Tell me about your educational background."'
    ))
    story.append(Spacer(1, 3))
    story.append(say_box(
        '<b>What to say:</b><br/><br/>'
        '"I have a Bachelor of Science in <b>Applied Mathematics</b> from Baku State University. '
        'This degree gave me strong analytical and problem-solving skills. '
        'Mathematics is the foundation of both software engineering and business analysis. '
        'It helps me think logically, analyze data, and make evidence-based decisions."'
    ))
    story.append(Spacer(1, 4))

    story.append(body(
        'Keep this answer short. Do not spend more than 30 seconds on education. '
        'The interviewer is more interested in your experience than your degree.'
    ))

    story.append(PageBreak())

    # ══════════════════════════════════════
    # SECTION 8: COMMON QUESTIONS
    # ══════════════════════════════════════
    story.append(section('8. Common Interview Questions and Answers'))
    story.append(hr())

    story.append(body(
        'Here are the most common interview questions for a BA position, with sample answers based on your CV.'
    ))
    story.append(Spacer(1, 4))

    # Q1
    story.append(question_box(
        '<b>Q1:</b> "Why do you want to work at our company?"'
    ))
    story.append(Spacer(1, 3))
    story.append(say_box(
        '<b>What to say:</b><br/><br/>'
        '"I have been following your company and I am impressed by your work in [mention something specific '
        'about the company from their website or LinkedIn]. My experience in fintech and e-commerce, '
        'combined with my engineering background, makes me a strong fit for this role. '
        'I want to use my skills to deliver real results for your team."'
    ))
    story.append(Spacer(1, 4))

    story.append(tip_box(
        '<b>IMPORTANT:</b> Before every interview, research the company. Visit their website, '
        'read their LinkedIn page, and find 1-2 specific things about them. '
        'Mention these things in your answer. This shows you are prepared.'
    ))
    story.append(Spacer(1, 6))

    # Q2
    story.append(question_box(
        '<b>Q2:</b> "What is your biggest achievement?"'
    ))
    story.append(Spacer(1, 3))
    story.append(say_box(
        '<b>What to say:</b><br/><br/>'
        '"My biggest achievement is delivering the <b>BNPL Credit Scoring System</b> at Embafinans. '
        'I started with stakeholder sessions, mapped the existing process, designed a new automated system, '
        'wrote all requirements documents, and coordinated UAT. The result was credit decisions '
        'that are <b>2 times faster</b>. This project showed me that good business analysis '
        'directly impacts business results."'
    ))
    story.append(Spacer(1, 6))

    # Q3
    story.append(question_box(
        '<b>Q3:</b> "How do you handle conflicts between stakeholders?"'
    ))
    story.append(Spacer(1, 3))
    story.append(say_box(
        '<b>What to say:</b><br/><br/>'
        '"At Embafinans, I had a situation where the risk team and the sales team had different priorities '
        'about the credit scoring system. The risk team wanted more checks, the sales team wanted faster approvals. '
        'I used <b>SQL data analysis</b> to get real numbers about approval rates, decline reasons, '
        'and processing times. I presented this data to both teams and proposed a solution '
        'that balanced speed and risk. Both teams agreed because the decision was based on data, not opinions."'
    ))
    story.append(Spacer(1, 6))

    # Q4
    story.append(question_box(
        '<b>Q4:</b> "How do you prioritize requirements?"'
    ))
    story.append(Spacer(1, 3))
    story.append(say_box(
        '<b>What to say:</b><br/><br/>'
        '"I use the <b>RICE framework</b>. RICE stands for Reach, Impact, Confidence, and Effort. '
        'I score each requirement on these 4 factors and calculate a priority score. '
        'This helps the team focus on requirements that bring the highest business value. '
        'At Embafinans, I used RICE to prioritize the credit scoring system features, '
        'and it helped us deliver the most important features first."'
    ))
    story.append(Spacer(1, 6))

    # Q5
    story.append(question_box(
        '<b>Q5:</b> "Describe your BA methodology."'
    ))
    story.append(Spacer(1, 3))
    story.append(say_box(
        '<b>What to say:</b><br/><br/>'
        '"My methodology has 6 steps:<br/><br/>'
        '<b>1. Discovery:</b> I talk to stakeholders to understand the business problem.<br/>'
        '<b>2. Process Modeling:</b> I draw As-Is and To-Be BPMN diagrams.<br/>'
        '<b>3. Requirements Documentation:</b> I write BRD, FRD, and User Stories with Gherkin criteria.<br/>'
        '<b>4. Technical Specification:</b> I define API specs in Swagger and create sequence diagrams.<br/>'
        '<b>5. UAT Coordination:</b> I organize testing with business stakeholders and lead bug triage.<br/>'
        '<b>6. Backlog Prioritization:</b> I rank requirements using the RICE framework for sprint planning."'
    ))

    story.append(PageBreak())

    # ══════════════════════════════════════
    # SECTION 9: DIFFICULT QUESTIONS
    # ══════════════════════════════════════
    story.append(section('9. Difficult Questions and How to Answer Them'))
    story.append(hr())

    story.append(body(
        'These are the questions that worry most candidates. Here is how to answer them with confidence.'
    ))
    story.append(Spacer(1, 4))

    # Difficult Q1
    story.append(question_box(
        '<b>Q:</b> "You have 15+ years of experience. Why are you applying for a mid-level BA role?"'
    ))
    story.append(Spacer(1, 3))
    story.append(say_box(
        '<b>What to say:</b><br/><br/>'
        '"Because I am making a career transition from Software Engineering to Business Analysis, '
        'my formal BA experience is 2+ years. But every year of my engineering career '
        'adds value to my BA work. I understand systems, I understand code, I understand databases. '
        'This means I can do the job <b>better and faster</b> than someone without a technical background. '
        'I am not looking for a senior title. I am looking for a role where I can deliver value."'
    ))
    story.append(Spacer(1, 6))

    # Difficult Q2
    story.append(question_box(
        '<b>Q:</b> "Why did you leave your previous job?"'
    ))
    story.append(Spacer(1, 3))
    story.append(say_box(
        '<b>What to say:</b><br/><br/>'
        '"I am looking for new challenges and growth opportunities. '
        'At my current company, I have successfully delivered several major projects. '
        'Now I want to bring my experience to a new environment where I can contribute '
        'to different types of projects and continue learning."'
    ))
    story.append(Spacer(1, 4))

    story.append(tip_box(
        '<b>IMPORTANT:</b> Never say anything negative about your current or previous employer. '
        'Keep the answer positive and focused on growth and new challenges.'
    ))
    story.append(Spacer(1, 6))

    # Difficult Q3
    story.append(question_box(
        '<b>Q:</b> "What is your salary expectation?"'
    ))
    story.append(Spacer(1, 3))
    story.append(say_box(
        '<b>What to say:</b><br/><br/>'
        '"I am more focused on finding the right role where I can contribute and grow. '
        'I am open to discussing salary based on the responsibilities of the position. '
        'Could you tell me the budget range for this role?"'
    ))
    story.append(Spacer(1, 4))

    story.append(tip_box(
        '<b>TIP:</b> Try to let the company say the number first. '
        'If they insist, give a range based on market research.'
    ))
    story.append(Spacer(1, 6))

    # Difficult Q4
    story.append(question_box(
        '<b>Q:</b> "What is your weakness?"'
    ))
    story.append(Spacer(1, 3))
    story.append(say_box(
        '<b>What to say:</b><br/><br/>'
        '"Because I came from an engineering background, sometimes I focus too much on technical details '
        'when I should focus on business value. But I am aware of this and I actively work on it. '
        'For example, in stakeholder meetings, I always start with business questions first, '
        'not technical questions. This helps me stay focused on what matters most to the business."'
    ))
    story.append(Spacer(1, 4))

    story.append(tip_box(
        '<b>TIP:</b> Choose a real but minor weakness and always explain how you are fixing it. '
        'Never say "I have no weaknesses" or "I work too hard". These are fake answers.'
    ))

    story.append(PageBreak())

    # ══════════════════════════════════════
    # SECTION 10: TIPS FOR CONFIDENCE
    # ══════════════════════════════════════
    story.append(section('10. Tips for Confidence in Interviews'))
    story.append(hr())

    story.append(body(
        'Many candidates know the answers but cannot express them well because of nervousness. '
        'Here are practical tips to help you feel confident and speak clearly.'
    ))
    story.append(Spacer(1, 6))

    story.append(subhead('Before the Interview'))
    story.append(numbered(1, '<b>Research the company:</b> Visit their website, read their LinkedIn, find 1-2 specific facts about them. Mention these facts in your answers.'))
    story.append(numbered(2, '<b>Practice your elevator pitch:</b> Say your introduction 20-30 times at home. Stand in front of a mirror. Record yourself on your phone.'))
    story.append(numbered(3, '<b>Prepare 3-4 stories:</b> Each story should follow the STAR method. Use stories from your Embafinans projects.'))
    story.append(numbered(4, '<b>Print your CV:</b> Bring 2 copies. One for you, one for the interviewer. Highlight key points with a pen.'))
    story.append(numbered(5, '<b>Prepare questions to ask:</b> At the end, they will ask "Do you have questions for us?". Always say yes. Ask about the team, projects, or tools they use.'))

    story.append(Spacer(1, 6))
    story.append(subhead('During the Interview'))
    story.append(numbered(1, '<b>Speak slowly:</b> Nervous people speak fast. Take a breath before each answer. Speak 20% slower than normal.'))
    story.append(numbered(2, '<b>Use the STAR method:</b> Situation, Task, Action, Result. This structure keeps your answer organized.'))
    story.append(numbered(3, '<b>Use numbers:</b> "2 times faster", "300-500 daily", "4 projects". Numbers are powerful.'))
    story.append(numbered(4, '<b>It is OK to pause:</b> If you need time to think, say: "That is a good question. Let me think about the best example." Take 3-5 seconds.'))
    story.append(numbered(5, '<b>Do not be afraid to ask for clarification:</b> If you do not understand a question, say: "Could you please repeat or clarify the question?" This is better than giving a wrong answer.'))
    story.append(numbered(6, '<b>Body language:</b> Sit straight, make eye contact, smile. Good body language makes you look confident even if you feel nervous.'))

    story.append(Spacer(1, 6))
    story.append(subhead('What to Say When You Do Not Know an Answer'))
    story.append(say_box(
        '<b>What to say:</b><br/><br/>'
        '"I do not have direct experience with [specific tool/process], '
        'but I have similar experience with [related thing]. '
        'For example, at Embafinans I used [your experience]. '
        'I am a fast learner and I am confident I can learn [specific thing] quickly."'
    ))
    story.append(Spacer(1, 4))

    story.append(tip_box(
        '<b>TIP:</b> Never say "I do not know" and stop. Always connect to something you DO know. '
        'Show that you are a learner. Employers value people who can learn new things quickly.'
    ))

    story.append(Spacer(1, 6))
    story.append(subhead('Questions to Ask the Interviewer (Always Ask 2-3)'))
    story.append(numbered(1, '<b>"What are the biggest challenges for this role in the first 6 months?"</b> This shows you are thinking about how you can contribute.'))
    story.append(numbered(2, '<b>"What tools and methodologies does the team use?"</b> This shows you are interested in the technical environment.'))
    story.append(numbered(3, '<b>"Can you tell me about the team I would be working with?"</b> This shows you care about collaboration.'))
    story.append(numbered(4, '<b>"What does success look like in this role after 1 year?"</b> This shows you are goal-oriented.'))

    story.append(Spacer(1, 10))
    story.append(thin_hr())
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        '<b>Remember:</b> The interviewer is not your enemy. They want you to succeed. '
        'They invited you because your CV looks good. Now you just need to show them '
        'that the person behind the CV is confident, prepared, and capable.',
        ParagraphStyle('Final', fontName='Tinos', fontSize=10, leading=15,
                       textColor=ACCENT, alignment=TA_CENTER, spaceBefore=4)
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
