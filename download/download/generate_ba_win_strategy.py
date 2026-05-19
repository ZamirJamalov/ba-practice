import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
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
ACCENT = colors.HexColor('#297088')
DARK = colors.HexColor('#1a1a1a')
TEXT = colors.HexColor('#333333')
MUTED = colors.HexColor('#777777')
SAY_BG = colors.HexColor('#f0f9f0')
QUESTION_BG = colors.HexColor('#fff8e1')
TIP_BG = colors.HexColor('#e8f4f8')
STRATEGY_BG = colors.HexColor('#f3e8ff')
SECRET_BG = colors.HexColor('#fff0f0')
DONT_BG = colors.HexColor('#f5f5f5')

# ── Output ──
output_path = '/home/z/my-project/download/BA_Interview_Win_Strategy_Guide.pdf'

doc = SimpleDocTemplate(
    output_path, pagesize=A4,
    leftMargin=1.8*cm, rightMargin=1.8*cm,
    topMargin=1.5*cm, bottomMargin=1.5*cm,
)

PAGE_W = A4[0] - 3.6*cm

# ── Styles ──
sCoverTitle = ParagraphStyle(
    'CoverTitle', fontName='CarlitoBold', fontSize=28, leading=36,
    textColor=DARK, alignment=TA_CENTER, spaceAfter=6
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
    textColor=ACCENT, spaceBefore=12, spaceAfter=4
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
    textColor=colors.HexColor('#1a5c2e'), leftIndent=8, rightIndent=8, spaceAfter=2
)
sQuestion = ParagraphStyle(
    'Question', fontName='CarlitoBold', fontSize=9.5, leading=13,
    textColor=colors.HexColor('#7a4a00'), leftIndent=8, spaceAfter=2, spaceBefore=2
)
sTip = ParagraphStyle(
    'Tip', fontName='Tinos', fontSize=9, leading=13,
    textColor=colors.HexColor('#1a5c5c'), leftIndent=8, rightIndent=8, spaceAfter=2
)
sStrategy = ParagraphStyle(
    'Strategy', fontName='Tinos', fontSize=9.5, leading=14,
    textColor=colors.HexColor('#4a1a7a'), leftIndent=8, rightIndent=8, spaceAfter=2
)
sBullet = ParagraphStyle(
    'Bullet', fontName='Tinos', fontSize=9.5, leading=13,
    textColor=TEXT, leftIndent=18, bulletIndent=6, spaceAfter=2, alignment=TA_LEFT
)
sNumber = ParagraphStyle(
    'Number', fontName='Tinos', fontSize=9.5, leading=13,
    textColor=TEXT, leftIndent=18, bulletIndent=6, spaceAfter=3, alignment=TA_LEFT
)

def hr():
    return HRFlowable(width="100%", thickness=1, color=ACCENT, spaceAfter=4, spaceBefore=2)

def thin_hr():
    return HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#ddd'), spaceAfter=3, spaceBefore=3)

def say_box(text):
    inner = Paragraph(text, sSay)
    t = Table([[inner]], colWidths=[PAGE_W - 0.6*cm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), SAY_BG),
        ('TOPPADDING', (0,0), (-1,-1), 6), ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 10), ('RIGHTPADDING', (0,0), (-1,-1), 10),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#c8e6c9')),
    ]))
    return t

def question_box(text):
    inner = Paragraph(text, sQuestion)
    t = Table([[inner]], colWidths=[PAGE_W - 0.6*cm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), QUESTION_BG),
        ('TOPPADDING', (0,0), (-1,-1), 5), ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 10), ('RIGHTPADDING', (0,0), (-1,-1), 10),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#ffe0b2')),
    ]))
    return t

def tip_box(text):
    inner = Paragraph(text, sTip)
    t = Table([[inner]], colWidths=[PAGE_W - 0.6*cm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), TIP_BG),
        ('TOPPADDING', (0,0), (-1,-1), 5), ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 10), ('RIGHTPADDING', (0,0), (-1,-1), 10),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#b3e5fc')),
    ]))
    return t

def strategy_box(text):
    inner = Paragraph(text, sStrategy)
    t = Table([[inner]], colWidths=[PAGE_W - 0.6*cm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), STRATEGY_BG),
        ('TOPPADDING', (0,0), (-1,-1), 6), ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 10), ('RIGHTPADDING', (0,0), (-1,-1), 10),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#d8b4fe')),
    ]))
    return t

def dont_box(text):
    inner = Paragraph(
        '<font color="#cc0000">X</font> ' + text,
        ParagraphStyle('Dont', fontName='Tinos', fontSize=9.5, leading=14,
                       textColor=colors.HexColor('#cc0000'), leftIndent=8, rightIndent=8)
    )
    t = Table([[inner]], colWidths=[PAGE_W - 0.6*cm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), DONT_BG),
        ('TOPPADDING', (0,0), (-1,-1), 5), ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 10), ('RIGHTPADDING', (0,0), (-1,-1), 10),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#ffcccc')),
    ]))
    return t

def body(text):
    return Paragraph(text, sBody)

def subhead(text):
    return Paragraph(text, sSubHead)

def section(text):
    return Paragraph(text, sSectionHead)

def numbered(num, text):
    return Paragraph(f'<b>{num}.</b> {text}', sNumber)

def bullet(text):
    return Paragraph('<bullet>&bull;</bullet> ' + text, sBullet)


def build():
    story = []

    # ══════════════════════════════════════
    # COVER PAGE
    # ══════════════════════════════════════
    story.append(Spacer(1, 70))
    story.append(Paragraph('Interview Win Strategy', sCoverTitle))
    story.append(Paragraph('for Business Analyst Role', sCoverTitle))
    story.append(Spacer(1, 14))
    story.append(HRFlowable(width="50%", thickness=2, color=ACCENT, spaceAfter=12, spaceBefore=4))
    story.append(Paragraph('How to Make Them Say:', sCoverSub))
    story.append(Paragraph('"This is Our Best Candidate"', ParagraphStyle(
        'Highlight', fontName='CarlitoBold', fontSize=16, leading=22,
        textColor=colors.HexColor('#1a5c2e'), alignment=TA_CENTER, spaceAfter=8
    )))
    story.append(Spacer(1, 30))
    story.append(Paragraph('Simple English (A1-A2 Level)', sCoverInfo))
    story.append(Paragraph('Zamir Jamalov', sCoverInfo))
    story.append(Spacer(1, 40))
    story.append(Paragraph('This guide is NOT about reading your CV.', sCoverInfo))
    story.append(Paragraph('This guide is about understanding what interviewers', sCoverInfo))
    story.append(Paragraph('REALLY want and giving it to them.', sCoverInfo))

    story.append(PageBreak())

    # ══════════════════════════════════════
    # TABLE OF CONTENTS
    # ══════════════════════════════════════
    story.append(section('TABLE OF CONTENTS'))
    story.append(hr())

    toc_items = [
        '1.  The Big Secret: What Interviewers Really Want',
        '2.  The 3 Things Every Interviewer Checks',
        '3.  Strategy: How to Show You Are the Best Fit',
        '4.  Your Superpower: Engineering + BA Combination',
        '5.  How to Talk About Projects (Not Read CV)',
        '6.  Words and Phrases That Win Interviews',
        '7.  Body Language That Shows Confidence',
        '8.  How to End the Interview Strong',
        '9.  The "Why Should We Hire You?" Answer',
        '10. Practice Plan: What to Do Before Each Interview',
    ]
    for item in toc_items:
        story.append(Paragraph(item, ParagraphStyle(
            'TOC', fontName='Tinos', fontSize=10, leading=16,
            textColor=TEXT, leftIndent=12, spaceAfter=2
        )))

    story.append(PageBreak())

    # ══════════════════════════════════════
    # SECTION 1: THE BIG SECRET
    # ══════════════════════════════════════
    story.append(section('1. The Big Secret: What Interviewers Really Want'))
    story.append(hr())

    strategy_box(
        '<b>THE SECRET:</b> Interviewers do NOT want to hear your CV read back to them. '
        'They already read your CV before the interview. They want to see 3 things: '
        '<b>Can you do the job?</b> <b>Will you fit the team?</b> <b>Do you want THIS job?</b>'
    )
    story.append(Spacer(1, 4))

    body_text = (
        'Most candidates make one big mistake: they talk about their CV. '
        'They say "I worked here, I did this, I used that tool." This is boring for the interviewer. '
        'They already know this from your CV!'
    )
    story.append(body(body_text))
    story.append(Spacer(1, 3))

    story.append(subhead('The Winning Mindset:'))
    story.append(body(
        'Instead of thinking "How do I explain my CV?", think: '
        '<b>"What does this company need, and how can I show them I am the solution?"</b>'
    ))
    story.append(Spacer(1, 3))

    story.append(body(
        'Every company has problems. They are hiring because they need someone to solve these problems. '
        'Your job in the interview is to show them: <b>"I understand your problem, and I can solve it."</b>'
    ))
    story.append(Spacer(1, 3))

    story.append(subhead('Example:'))
    story.append(body(
        'Imagine the company is a bank. They need a BA who can work with developers and business people. '
        'If you say: "I have 2 years of BA experience." - This is just a fact. It is boring.<br/><br/>'
        'But if you say: "I am the perfect person for this role because I understand both sides. '
        'I can talk to the business team about what they need, AND I can talk to the developers '
        'because I was a software engineer for 15 years. I speak both languages." '
        '<b>- This is powerful. This makes them think: "We need this person."</b>'
    ))
    story.append(Spacer(1, 4))

    dont_box(
        'Do NOT say: "As you can see in my CV..." - This is the worst way to start an answer. '
        'It tells the interviewer: "I have nothing new to say, I will just repeat my CV."'
    )

    story.append(PageBreak())

    # ══════════════════════════════════════
    # SECTION 2: THE 3 THINGS
    # ══════════════════════════════════════
    story.append(section('2. The 3 Things Every Interviewer Checks'))
    story.append(hr())

    story.append(body(
        'Every interviewer is checking 3 things. If you pass all 3, you get the job. '
        'Here is what they check and how to pass each one.'
    ))
    story.append(Spacer(1, 4))

    # Thing 1
    story.append(subhead('Check #1: Can You Do the Job? (Competence)'))
    story.append(body(
        'The interviewer wants to know: <b>Can this person actually do the work?</b><br/><br/>'
        'How to show this: Do NOT just list your skills. Instead, tell <b>stories with results</b>.<br/><br/>'
        'Bad answer: "I have experience with BRD, FRD, and User Stories."<br/>'
        'Good answer: "At Embafinans, I wrote a BRD for a credit scoring system. '
        'The development team used my document directly, and we delivered the project in time. '
        'The result: credit decisions became 2 times faster."'
    ))
    story.append(Spacer(1, 3))
    story.append(strategy_box(
        '<b>Strategy:</b> For every skill, have one story. The story format is: '
        '<b>Problem + What I did + Result (with numbers).</b>'
    ))
    story.append(Spacer(1, 6))

    # Thing 2
    story.append(subhead('Check #2: Will You Fit the Team? (Cultural Fit)'))
    story.append(body(
        'The interviewer wants to know: <b>Will this person work well with our team?</b><br/><br/>'
        'How to show this: Use words that show collaboration. Show that you listen, you communicate, '
        'you respect other people\'s ideas.<br/><br/>'
        'Bad answer: "I told the developers what to do and they built it."<br/>'
        'Good answer: "I worked <b>together</b> with the risk team, the sales team, and the developers. '
        'I listened to everyone\'s needs and found a solution that worked for all teams. '
        'When the risk team and sales team had different opinions, I used data to help them agree."'
    ))
    story.append(Spacer(1, 3))
    story.append(strategy_box(
        '<b>Strategy:</b> Use these words often: "together", "collaborated", "listened", '
        '"understood", "team", "we". Do NOT use: "I alone", "I decided", "I told them".'
    ))
    story.append(Spacer(1, 6))

    # Thing 3
    story.append(subhead('Check #3: Do You Want THIS Job? (Motivation)'))
    story.append(body(
        'The interviewer wants to know: <b>Does this person really want to work HERE, '
        'or are they just looking for any job?</b><br/><br/>'
        'How to show this: Before the interview, research the company. '
        'Find something specific about them and mention it.<br/><br/>'
        'Bad answer: "I want this job because I need a job."<br/>'
        'Good answer: "I have been following your company. I know you are working on [mention a project '
        'or product]. I am excited about this because my experience in fintech can contribute to this. '
        'I specifically want to work here because [give a reason connected to their company]."'
    ))
    story.append(Spacer(1, 3))
    story.append(strategy_box(
        '<b>Strategy:</b> Before every interview, find 2-3 facts about the company '
        '(from their website, LinkedIn, or news). Mention these facts naturally in your answers.'
    ))

    story.append(PageBreak())

    # ══════════════════════════════════════
    # SECTION 3: SHOW BEST FIT
    # ══════════════════════════════════════
    story.append(section('3. Strategy: How to Show You Are the Best Fit'))
    story.append(hr())

    story.append(body(
        'Here is the most important strategy: <b>Connect your experience to their needs.</b><br/><br/>'
        'Do NOT wait for them to ask the right question. YOU should connect the dots for them.<br/><br/>'
        'Here is how this works in practice:'
    ))
    story.append(Spacer(1, 4))

    story.append(subhead('Example: They Ask About BPMN'))
    story.append(question_box(
        '<b>Interviewer:</b> "Do you have experience with process modeling?"'
    ))
    story.append(Spacer(1, 3))
    story.append(say_box(
        '<b>What to say:</b><br/><br/>'
        '"Yes, absolutely. At Embafinans, I drew BPMN process diagrams for the credit lifecycle. '
        'I drew the As-Is process first, identified the bottlenecks, '
        'and then designed the To-Be process with the team. '
        'This helped everyone see the problems and agree on the solution.<br/><br/>'
        'I think process modeling is very important because it helps business people and technical people '
        'see the same picture. And I know your team works a lot with process improvements, '
        'so this is something I can contribute to immediately."'
    ))
    story.append(Spacer(1, 3))
    story.append(tip_box(
        '<b>Notice the magic:</b> You answered the question AND connected it to their company. '
        '"I know your team works a lot with process improvements" - this shows you researched them. '
        'This makes you stand out from other candidates.'
    ))
    story.append(Spacer(1, 6))

    story.append(subhead('The "Connect to Them" Formula:'))
    story.append(numbered(1, '<b>Answer the question</b> with a real example.'))
    story.append(numbered(2, '<b>Show the result</b> with a number or achievement.'))
    story.append(numbered(3, '<b>Connect to their company</b> by saying why this matters for them.'))
    story.append(numbered(4, '<b>Show enthusiasm</b> by saying you want to do this for their team.'))
    story.append(Spacer(1, 4))

    story.append(subhead('Another Example: They Ask About Agile'))
    story.append(question_box(
        '<b>Interviewer:</b> "Tell me about your experience with Agile methodology."'
    ))
    story.append(Spacer(1, 3))
    story.append(say_box(
        '<b>What to say:</b><br/><br/>'
        '"I work in Agile/Scrum every day at Embafinans. I manage the backlog in Jira, '
        'write user stories, and participate in sprint planning and reviews. '
        'I also use the RICE framework to prioritize requirements.<br/><br/>'
        'But more importantly, I understand <b>why</b> Agile works. '
        'It works because it brings business and IT together. As a BA, my role in Agile is to be '
        'the bridge between these two worlds. I make sure the development team builds '
        'what the business actually needs, not what they think they need.<br/><br/>'
        'I understand your team also works in Agile, so I can start contributing from day one '
        'without any onboarding time."'
    ))
    story.append(Spacer(1, 3))
    story.append(strategy_box(
        '<b>"From day one" / "Without onboarding time"</b> - These phrases are very powerful. '
        'They tell the employer: "You do not need to train me. I can start working immediately." '
        'Every employer loves to hear this.'
    ))

    story.append(PageBreak())

    # ══════════════════════════════════════
    # SECTION 4: SUPERPOWER
    # ══════════════════════════════════════
    story.append(section('4. Your Superpower: Engineering + BA Combination'))
    story.append(hr())

    story.append(body(
        'This is your BIGGEST advantage. Most BAs do not have a technical background. '
        'Most engineers cannot do business analysis. <b>You can do both.</b><br/><br/>'
        'This is your unique selling point. You must use it in every interview.'
    ))
    story.append(Spacer(1, 4))

    story.append(subhead('How to Present This:'))
    story.append(say_box(
        '<b>What to say:</b><br/><br/>'
        '"I believe my biggest advantage is my combination of engineering and business analysis. '
        'Let me explain why this is important for your team:<br/><br/>'
        'Most BAs can talk to the business side. But when the development team asks technical questions, '
        'they get confused. With me, this does not happen. '
        'I can read a JSON response and understand it. I can look at an API specification '
        'and find problems. I can look at a database schema and understand the data model.<br/><br/>'
        'This means: I write better requirements because I know what developers need. '
        'I reduce back-and-forth between teams because I understand both sides. '
        'And when there is a production incident, I can do root cause analysis faster '
        'because I understand the code.<br/><br/>'
        'In short: <b>I am a bridge between business and technology.</b> '
        'And I think every team needs a person like this."'
    ))
    story.append(Spacer(1, 4))

    story.append(strategy_box(
        '<b>The Bridge Metaphor:</b> Use the word "bridge" (korpri) many times. '
        '"I am a bridge between business and IT." This is simple, clear, and powerful. '
        'Everyone understands what a bridge does: it connects two sides.'
    ))
    story.append(Spacer(1, 4))

    story.append(subhead('If They Ask: "Are You Overqualified?"'))
    story.append(say_box(
        '<b>What to say:</b><br/><br/>'
        '"That is a fair question, but I see it differently. '
        'My 15 years of engineering experience is not extra weight. It is like a superpower for BA work. '
        'Think about it: a doctor with 15 years of experience is better than a doctor with 2 years, right? '
        'Same for me. More experience means better results.<br/><br/>'
        'I am not looking for a big title or a big salary. '
        'I am looking for a role where I can use my skills and deliver value. '
        'And at the end of the day, what matters is results. '
        'I delivered 4 projects at Embafinans. That is what I can do for your team too."'
    ))
    story.append(Spacer(1, 4))

    dont_box(
        'Do NOT sound defensive when they ask about overqualification. Do NOT say "No, I am not overqualified." '
        'Instead, agree that it is a fair question and then reframe it as an advantage. Stay calm and confident.'
    )

    story.append(PageBreak())

    # ══════════════════════════════════════
    # SECTION 5: HOW TO TALK ABOUT PROJECTS
    # ══════════════════════════════════════
    story.append(section('5. How to Talk About Projects (Not Read CV)'))
    story.append(hr())

    story.append(body(
        'When they ask about a project, do NOT describe the project like a Wikipedia page. '
        'Nobody wants to hear: "The project was about a credit scoring system with multi-factor assessment..."<br/><br/>'
        'Instead, tell the <b>story of the problem and the solution</b>. Make the interviewer feel like they were there.'
    ))
    story.append(Spacer(1, 4))

    story.append(subhead('The Story Framework: PPR (Problem - Action - Result)'))
    story.append(Spacer(1, 3))

    story.append(numbered(1, '<b>Problem:</b> What was wrong? What was painful? Use feelings.'))
    story.append(numbered(2, '<b>Action:</b> What did YOU do to fix it? Be specific.'))
    story.append(numbered(3, '<b>Result:</b> What changed? Use numbers.'))
    story.append(Spacer(1, 4))

    story.append(subhead('Example: Credit Scoring Project'))
    story.append(say_box(
        '<b>Problem:</b> "The credit approval process was very slow. '
        'Customers waited too long. The risk team was overwhelmed with manual work. '
        'Sometimes it took days to approve one application."<br/><br/>'
        '<b>Action:</b> "I sat down with the risk team and asked them: what takes the most time? '
        'They showed me the process. I drew a BPMN diagram of the current process. '
        'I saw that 3 steps were manual and could be automated. '
        'I wrote a BRD for the new automated system, defined the API specifications, '
        'and coordinated UAT with the risk team to make sure it worked correctly."<br/><br/>'
        '<b>Result:</b> "After we launched the new system, credit decisions became <b>2 times faster</b>. '
        'The risk team could focus on complex cases instead of simple ones. '
        'Customer satisfaction increased. This was one of the most impactful projects I delivered."'
    ))
    story.append(Spacer(1, 4))

    story.append(tip_box(
        '<b>Notice:</b> You did NOT say "BNPL Credit Scoring and Pre-Screen Risk Assessment System". '
        'You said "the credit approval process was very slow." This is human language. '
        'The interviewer can feel the pain. This is much more powerful than a project title.'
    ))
    story.append(Spacer(1, 6))

    story.append(subhead('Example: Sales Channel Project'))
    story.append(say_box(
        '<b>Problem:</b> "The company had no online channel. Customers had to go to a physical office '
        'to apply for credit. This was inconvenient for customers, and the company was losing potential clients."<br/><br/>'
        '<b>Action:</b> "I led the requirements for a B2C online sales channel with payment gateway integration. '
        'I defined the API specifications in Swagger, created sequence diagrams for the payment flow, '
        'and coordinated UAT testing with the sales and IT teams."<br/><br/>'
        '<b>Result:</b> "The system now processes <b>300-500 applications per day</b>. '
        'Customers can apply from home. The company increased its customer base significantly."'
    ))
    story.append(Spacer(1, 4))

    story.append(strategy_box(
        '<b>Key Rule:</b> Always start with the PROBLEM, not the solution. '
        'When people hear a problem, they pay attention. When people hear a solution first, they get bored. '
        'Think of it like a movie: every good movie starts with a problem.'
    ))

    story.append(PageBreak())

    # ══════════════════════════════════════
    # SECTION 6: WINNING WORDS
    # ══════════════════════════════════════
    story.append(section('6. Words and Phrases That Win Interviews'))
    story.append(hr())

    story.append(body(
        'Some words make interviewers like you more. Some words make them lose interest. '
        'Here is a list of words to use and words to avoid.'
    ))
    story.append(Spacer(1, 4))

    story.append(subhead('Power Words (Use These Often):'))
    pw_data = [
        ['<b>Delivered</b>', 'Not: "I worked on" / Say: "I delivered"'],
        ['<b>Together</b>', 'Not: "I did" / Say: "We worked together"'],
        ['<b>Result</b>', 'Not: "I did this task" / Say: "The result was..."'],
        ['<b>Understood</b>', 'Not: "I listened" / Say: "I understood their needs"'],
        ['<b>Contributed</b>', 'Not: "I was there" / Say: "I contributed to..."'],
        ['<b>Immediately</b>', 'Not: "I can learn" / Say: "I can start immediately"'],
        ['<b>Confident</b>', 'Not: "I think" / Say: "I am confident that"'],
        ['<b>Bridge</b>', 'Use this metaphor: "I am a bridge between business and IT"'],
    ]

    pw_style = ParagraphStyle('PW', fontName='Tinos', fontSize=9, leading=13, textColor=TEXT)
    pw_head = ParagraphStyle('PWH', fontName='CarlitoBold', fontSize=9.5, leading=13, textColor=DARK)

    pw_cells = []
    for word, example in pw_data:
        pw_cells.append([
            Paragraph(word, pw_head),
            Paragraph(example, pw_style),
        ])

    pw_table = Table(pw_cells, colWidths=[PAGE_W*0.22, PAGE_W*0.78])
    pw_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8faf8')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#ddd')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(pw_table)
    story.append(Spacer(1, 8))

    story.append(subhead('Weak Words (Avoid These):'))
    weak_data = [
        ['<b>"I think..."</b>', 'Sounds uncertain. Say: "In my experience..." or "I believe..."'],
        ['<b>"Maybe..."</b>', 'Sounds like you are not sure. Say: "Yes" or explain your answer.'],
        ['<b>"As you can see in my CV..."</b>', 'Boring. They already read your CV.'],
        ['<b>"I do not know."</b>', 'Never stop here. Add: "...but I have similar experience with..."'],
        ['<b>"I was just a..."</b>', 'Never minimize your role. You are not "just" anything.'],
        ['<b>"To be honest..."</b>', 'This makes it sound like you were lying before.'],
    ]

    weak_cells = []
    for word, explanation in weak_data:
        weak_cells.append([
            Paragraph(word, ParagraphStyle('WW', fontName='CarlitoBold', fontSize=9, leading=13,
                                           textColor=colors.HexColor('#cc0000'))),
            Paragraph(explanation, pw_style),
        ])

    weak_table = Table(weak_cells, colWidths=[PAGE_W*0.30, PAGE_W*0.70])
    weak_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#fff5f5')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#ffcccc')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(weak_table)
    story.append(Spacer(1, 6))

    story.append(subhead('Phrases That Make Them Love You:'))
    story.append(say_box(
        '<b>"I can start contributing from day one."</b> - Shows you need no training.<br/><br/>'
        '<b>"I delivered [X] at my current company, and I can deliver the same for you."</b> - Shows results.<br/><br/>'
        '<b>"I understand the challenge you are facing, and here is how I would approach it."</b> - Shows problem-solving.<br/><br/>'
        '<b>"I am excited about this opportunity because..."</b> - Shows motivation and enthusiasm.<br/><br/>'
        '<b>"In my experience, the best way to handle this is..."</b> - Shows expertise without arrogance.'
    ))

    story.append(PageBreak())

    # ══════════════════════════════════════
    # SECTION 7: BODY LANGUAGE
    # ══════════════════════════════════════
    story.append(section('7. Body Language That Shows Confidence'))
    story.append(hr())

    story.append(body(
        'Studies show that <b>55% of communication is body language</b>. '
        'Even if your English is not perfect, your body language can make you look confident and professional.'
    ))
    story.append(Spacer(1, 4))

    story.append(subhead('Before You Speak (First 10 Seconds):'))
    story.append(numbered(1, '<b>Smile.</b> A real smile, not a fake one. Show them you are happy to be there.'))
    story.append(numbered(2, '<b>Make eye contact.</b> Look at the interviewer\'s eyes. Not at the table, not at the wall.'))
    story.append(numbered(3, '<b>Stand/sit straight.</b> Do not lean back (looks lazy) or lean forward too much (looks aggressive).'))
    story.append(numbered(4, '<b>Greet confidently.</b> "Good morning! Nice to meet you!" - Say this with energy.'))
    story.append(numbered(5, '<b>Firm handshake.</b> If they offer a handshake, hold it firmly (not too strong, not too weak).'))

    story.append(Spacer(1, 6))
    story.append(subhead('During the Interview:'))
    story.append(numbered(1, '<b>Nod your head</b> when they are speaking. This shows you are listening.'))
    story.append(numbered(2, '<b>Use your hands</b> when you talk. Natural hand movements make you look confident. But do not wave them too much.'))
    story.append(numbered(3, '<b>Do not cross your arms.</b> This looks defensive or closed. Keep your hands on the table or in your lap.'))
    story.append(numbered(4, '<b>Slow down.</b> When you speak, speak 20% slower than normal. This makes you sound more confident and gives you time to think.'))
    story.append(numbered(5, '<b>Pause before answering.</b> When they ask a question, take 2-3 seconds before you answer. This shows you are thinking, not just talking.'))
    story.append(numbered(6, '<b>Lean forward slightly</b> when they ask an important question. This shows interest and engagement.'))

    story.append(Spacer(1, 6))
    story.append(subhead('Power Poses (Do at Home, Not in the Interview):'))
    story.append(body(
        'Before the interview, go to the bathroom or a private place. Stand like Superman for 2 minutes: '
        'hands on your hips, chest out, chin up. Research shows this actually reduces stress hormones '
        'and increases confidence hormones. It sounds crazy, but it works!'
    ))

    story.append(Spacer(1, 4))
    story.append(tip_box(
        '<b>Pro tip:</b> Record yourself on video answering interview questions at home. '
        'Watch the video. You will see your body language mistakes. Fix them before the real interview. '
        'This is the fastest way to improve.'
    ))

    story.append(PageBreak())

    # ══════════════════════════════════════
    # SECTION 8: END STRONG
    # ══════════════════════════════════════
    story.append(section('8. How to End the Interview Strong'))
    story.append(hr())

    story.append(body(
        'The last 5 minutes of the interview are very important. '
        'This is your last chance to leave a strong impression. '
        'Most candidates waste this chance by saying "No questions" or asking about salary.'
    ))
    story.append(Spacer(1, 4))

    story.append(subhead('Always Ask Questions (This Shows Interest):'))
    story.append(body(
        'At the end, the interviewer will ask: "Do you have any questions for us?" '
        '<b>Always say YES.</b> Asking questions shows that you are interested, prepared, and thinking about the role.'
    ))
    story.append(Spacer(1, 3))

    story.append(say_box(
        '<b>Good questions to ask:</b><br/><br/>'
        '<b>1.</b> "What are the biggest challenges for this role in the first 3-6 months?"<br/>'
        '<i>Why this is good:</i> It shows you are already thinking about how to contribute.<br/><br/>'
        '<b>2.</b> "How does the BA role interact with the development team here?"<br/>'
        '<i>Why this is good:</i> It shows you care about collaboration and teamwork.<br/><br/>'
        '<b>3.</b> "What does success look like for this role after one year?"<br/>'
        '<i>Why this is good:</i> It shows you are goal-oriented and want to deliver results.<br/><br/>'
        '<b>4.</b> "Is there anything about my background or experience that makes you hesitate?"<br/>'
        '<i>Why this is good:</i> This is a brave question. It gives you a chance to address any concerns directly.'
    ))
    story.append(Spacer(1, 4))

    dont_box(
        'Do NOT ask these questions at the end: "What is the salary?", "How many vacation days?", '
        '"Can I work from home?", "When will you decide?" - Save salary and benefits questions '
        'for the HR person or after they offer you the job.'
    )
    story.append(Spacer(1, 6))

    story.append(subhead('Your Closing Statement (Very Important):'))
    story.append(body(
        'When the interview is ending, say this (or something similar):'
    ))
    story.append(say_box(
        '<b>What to say:</b><br/><br/>'
        '"Thank you for your time today. I really enjoyed learning more about your team and the role. '
        'After our conversation, I am even more confident that this is the right fit for me. '
        'My experience in fintech BA work, combined with my 15 years of engineering background, '
        'allows me to be a bridge between business and technology from day one. '
        'I am very excited about the opportunity to contribute to your team."'
    ))
    story.append(Spacer(1, 4))

    story.append(strategy_box(
        '<b>The "Day One" Rule:</b> Say "from day one" or "immediately" at least 2 times during the interview. '
        'This tells them: "This person needs no training. This person can start working NOW." '
        'This is one of the most powerful things you can say.'
    ))

    story.append(PageBreak())

    # ══════════════════════════════════════
    # SECTION 9: WHY SHOULD WE HIRE YOU
    # ══════════════════════════════════════
    story.append(section('9. The "Why Should We Hire You?" Answer'))
    story.append(hr())

    story.append(body(
        'This is the most important question in every interview. If they ask this, they are giving you '
        'a chance to close the deal. <b>This is your moment to shine.</b>'
    ))
    story.append(Spacer(1, 4))

    story.append(question_box(
        '<b>Interviewer:</b> "Why should we hire you? What makes you different from other candidates?"'
    ))
    story.append(Spacer(1, 3))

    story.append(say_box(
        '<b>What to say:</b><br/><br/>'
        '"There are three reasons why I believe I am the best candidate for this role:<br/><br/>'
        '<b>First, I have a proven track record.</b> At Embafinans, I delivered 4 major projects '
        'in a short time: a credit scoring system, an online sales channel, a delivery tracking dashboard, '
        'and a full credit lifecycle system. I do not just write requirements. I deliver results.<br/><br/>'
        '<b>Second, I have a unique combination of skills.</b> I am a Business Analyst with 15 years '
        'of software engineering experience. This means I can talk to business people and developers '
        'in their own language. I am a bridge between two worlds. Most BAs cannot do this.<br/><br/>'
        '<b>Third, I am passionate about this work.</b> I chose to transition from engineering to BA '
        'because I love understanding business problems and designing solutions. '
        'I am not here just for a job. I am here because I genuinely enjoy this work and I want '
        'to bring value to your team.<br/><br/>'
        'So: proven results, unique skills, and real passion. '
        'I believe this combination makes me the best fit for your team."'
    ))
    story.append(Spacer(1, 4))

    story.append(strategy_box(
        '<b>The "3 Reasons" Structure:</b> When they ask "Why should we hire you?", '
        'give exactly 3 reasons. Not 2 (not enough), not 4 (too many). '
        '<b>Three is the magic number.</b> Our brain remembers 3 things best.'
    ))
    story.append(Spacer(1, 4))

    story.append(tip_box(
        '<b>Practice this answer 30 times.</b> This is the most important answer in any interview. '
        'When you know this answer perfectly, you will feel confident for the entire interview. '
        'Record yourself and listen. Keep improving until it sounds natural, not memorized.'
    ))

    story.append(PageBreak())

    # ══════════════════════════════════════
    # SECTION 10: PRACTICE PLAN
    # ══════════════════════════════════════
    story.append(section('10. Practice Plan: What to Do Before Each Interview'))
    story.append(hr())

    story.append(body(
        'Confidence comes from preparation. Here is your step-by-step plan before each interview.'
    ))
    story.append(Spacer(1, 4))

    story.append(subhead('3 Days Before the Interview:'))
    story.append(numbered(1, '<b>Research the company</b> - Visit their website, read their LinkedIn, find 2-3 facts about them.'))
    story.append(numbered(2, '<b>Read the job description again</b> - Highlight the 3-4 most important requirements.'))
    story.append(numbered(3, '<b>Match your stories</b> - For each requirement, choose one project story that proves you can do it.'))
    story.append(numbered(4, '<b>Prepare your "Why should we hire you?" answer</b> - Use the 3-reasons structure.'))

    story.append(Spacer(1, 4))
    story.append(subhead('1 Day Before the Interview:'))
    story.append(numbered(1, '<b>Say your elevator pitch 10 times</b> - In front of a mirror.'))
    story.append(numbered(2, '<b>Say your "Why should we hire you?" answer 10 times</b> - Record on your phone.'))
    story.append(numbered(3, '<b>Prepare 4 questions to ask</b> - Write them on a small paper.'))
    story.append(numbered(4, '<b>Print your CV</b> - Bring 2 copies.'))
    story.append(numbered(5, '<b>Choose your clothes</b> - Professional, clean, comfortable.'))

    story.append(Spacer(1, 4))
    story.append(subhead('Morning of the Interview:'))
    story.append(numbered(1, '<b>Eat a good meal</b> - Do not go to an interview hungry.'))
    story.append(numbered(2, '<b>Arrive 10 minutes early</b> - Not 30 minutes (looks desperate), not on time (rushed).'))
    story.append(numbered(3, '<b>Go to the bathroom</b> - Do the Superman power pose for 2 minutes.'))
    story.append(numbered(4, '<b>Take 5 deep breaths</b> - In through nose (4 seconds), out through mouth (6 seconds).'))
    story.append(numbered(5, '<b>Smile</b> - Put a smile on your face before you walk in.'))

    story.append(Spacer(1, 6))
    story.append(subhead('During the Interview - Quick Rules:'))
    story.append(bullet('Speak 20% slower than normal.'))
    story.append(bullet('Use "I" for your actions, "We" for team results.'))
    story.append(bullet('Always include a number in every project story.'))
    story.append(bullet('Connect your answer to their company when possible.'))
    story.append(bullet('Say "from day one" at least 2 times.'))
    story.append(bullet('Use the "bridge" metaphor at least once.'))
    story.append(bullet('Ask questions at the end.'))
    story.append(bullet('Close with a strong statement.'))
    story.append(bullet('Smile and thank them.'))

    story.append(Spacer(1, 8))
    story.append(thin_hr())
    story.append(Spacer(1, 6))

    story.append(Paragraph(
        '<b>Final Thought:</b><br/><br/>'
        'The interviewer wants you to succeed. They invited you because your CV looks good. '
        'They are not trying to trick you. They just want to see the real person behind the CV.<br/><br/>'
        'Be yourself. Be honest. Be confident. Show them you understand their needs '
        'and you are ready to deliver.<br/><br/>'
        '<b>You are not just a candidate. You are the solution.</b>',
        ParagraphStyle('Final', fontName='Tinos', fontSize=10.5, leading=16,
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
