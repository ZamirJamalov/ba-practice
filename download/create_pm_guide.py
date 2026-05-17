import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_JUSTIFY, TA_CENTER
from reportlab.lib import colors
from reportlab.lib.units import inch, cm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    KeepTogether, HRFlowable
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily

# ── Fonts ──
pdfmetrics.registerFont(TTFont('Carlito', '/usr/share/fonts/truetype/english/Carlito-Regular.ttf'))
pdfmetrics.registerFont(TTFont('Tinos', '/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf'))
pdfmetrics.registerFont(TTFont('DejaVuSans', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
registerFontFamily('Carlito', normal='Carlito', bold='Carlito')
registerFontFamily('Tinos', normal='Tinos', bold='Tinos')

# ── Colors (from palette) ──
ACCENT = colors.HexColor('#1a7898')
TEXT_PRIMARY = colors.HexColor('#252422')
TEXT_MUTED = colors.HexColor('#8d8881')
BG_SURFACE = colors.HexColor('#e0dcd5')
BG_PAGE = colors.HexColor('#f4f3f2')
GREEN_BG = colors.HexColor('#e8f5e9')
GREEN_TEXT = colors.HexColor('#2e7d32')
ORANGE_BG = colors.HexColor('#fff3e0')
ORANGE_TEXT = colors.HexColor('#e65100')

# ── Output ──
output_path = '/home/z/my-project/download/PM_Interview_Preparation_Guide.pdf'

doc = SimpleDocTemplate(
    output_path,
    pagesize=A4,
    leftMargin=1.8*cm,
    rightMargin=1.8*cm,
    topMargin=1.5*cm,
    bottomMargin=1.5*cm,
)

available_width = A4[0] - 3.6*cm

# ── Styles ──
styles = {}

styles['doc_title'] = ParagraphStyle(
    name='DocTitle', fontName='Carlito', fontSize=22, leading=28,
    textColor=TEXT_PRIMARY, alignment=TA_CENTER, spaceAfter=4
)
styles['doc_subtitle'] = ParagraphStyle(
    name='DocSubtitle', fontName='Carlito', fontSize=11, leading=16,
    textColor=ACCENT, alignment=TA_CENTER, spaceAfter=6
)
styles['part_title'] = ParagraphStyle(
    name='PartTitle', fontName='Carlito', fontSize=16, leading=22,
    textColor=colors.white, alignment=TA_CENTER, spaceBefore=16, spaceAfter=4
)
styles['h1'] = ParagraphStyle(
    name='H1', fontName='Carlito', fontSize=13, leading=18,
    textColor=ACCENT, spaceBefore=16, spaceAfter=6
)
styles['h2'] = ParagraphStyle(
    name='H2', fontName='Carlito', fontSize=11, leading=16,
    textColor=TEXT_PRIMARY, spaceBefore=10, spaceAfter=4
)
styles['body'] = ParagraphStyle(
    name='Body', fontName='Tinos', fontSize=10, leading=15,
    textColor=TEXT_PRIMARY, alignment=TA_JUSTIFY, spaceAfter=6
)
styles['body_indent'] = ParagraphStyle(
    name='BodyIndent', fontName='Tinos', fontSize=10, leading=15,
    textColor=TEXT_PRIMARY, alignment=TA_LEFT, leftIndent=18, spaceAfter=4
)
styles['example_label'] = ParagraphStyle(
    name='ExampleLabel', fontName='Carlito', fontSize=10, leading=14,
    textColor=GREEN_TEXT, spaceBefore=8, spaceAfter=2
)
styles['example'] = ParagraphStyle(
    name='Example', fontName='Tinos', fontSize=9.5, leading=14,
    textColor=TEXT_PRIMARY, alignment=TA_LEFT, leftIndent=12, spaceAfter=2,
    backColor=GREEN_BG, borderPadding=(6, 6, 6, 6)
)
styles['question'] = ParagraphStyle(
    name='Question', fontName='Carlito', fontSize=10, leading=14,
    textColor=ORANGE_TEXT, spaceBefore=6, spaceAfter=2,
    backColor=ORANGE_BG, borderPadding=(6, 6, 6, 6)
)
styles['tip'] = ParagraphStyle(
    name='Tip', fontName='Tinos', fontSize=9.5, leading=14,
    textColor=TEXT_MUTED, alignment=TA_LEFT, leftIndent=12, spaceAfter=4,
    fontStyle='italic'
)
styles['bullet'] = ParagraphStyle(
    name='Bullet', fontName='Tinos', fontSize=10, leading=14,
    textColor=TEXT_PRIMARY, alignment=TA_LEFT, leftIndent=24, bulletIndent=12,
    spaceAfter=3
)
styles['footer'] = ParagraphStyle(
    name='Footer', fontName='Carlito', fontSize=8, leading=10,
    textColor=TEXT_MUTED, alignment=TA_CENTER
)

# ── Helpers ──
def add_topic(story, number, title, explanation, why, interview_q, sample_answer, extra_tips=None):
    """Add a complete topic section."""
    # Title
    story.append(Paragraph(f'<b>Topic {number}: {title}</b>', styles['h1']))
    story.append(HRFlowable(width="40%", thickness=1, color=ACCENT, spaceAfter=8))

    # What is it?
    story.append(Paragraph('<b>What is this?</b>', styles['h2']))
    story.append(Paragraph(explanation, styles['body']))

    # Why it matters
    story.append(Paragraph('<b>Why is it important?</b>', styles['h2']))
    story.append(Paragraph(why, styles['body']))

    # Interview question
    story.append(Paragraph(f'<b>Possible Interview Question:</b>', styles['example_label']))
    story.append(Paragraph(f'Q: {interview_q}', styles['question']))
    story.append(Spacer(1, 4))
    story.append(Paragraph(f'<b>Sample Answer:</b>', styles['example_label']))
    story.append(Paragraph(sample_answer, styles['example']))
    
    if extra_tips:
        story.append(Spacer(1, 4))
        for tip in extra_tips:
            story.append(Paragraph(tip, styles['tip']))
    
    story.append(Spacer(1, 10))


def make_part_header(title, width):
    """Create a colored header bar."""
    data = [[Paragraph(f'<b>{title}</b>', styles['part_title'])]]
    t = Table(data, colWidths=[width])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), ACCENT),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    return t


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# BUILD STORY
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
story = []

# Title
story.append(Paragraph('<b>IT Project Manager</b>', styles['doc_title']))
story.append(Paragraph('<b>Interview Preparation Guide</b>', styles['doc_subtitle']))
story.append(Spacer(1, 4))
story.append(Paragraph('Simple explanations with examples. Read before your interview.', styles['tip']))
story.append(Spacer(1, 6))
story.append(HRFlowable(width="100%", thickness=2, color=ACCENT, spaceAfter=12))

# ── Introduction ──
story.append(Paragraph(
    'This guide explains every requirement from the job description. '
    'For each topic, you will find: a simple explanation, why it matters, '
    'a possible interview question, and a sample answer you can use. '
    'Practice saying the sample answers out loud before your interview.',
    styles['body']
))
story.append(Spacer(1, 10))

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PART 1: CANDIDATE REQUIREMENTS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
story.append(make_part_header('PART 1: CANDIDATE REQUIREMENTS', available_width))
story.append(Spacer(1, 12))

# Topic 1: Higher Education
add_topic(story, 1, 'Higher Education',
    'The job requires a university degree in management, economics, applied mathematics, '
    'information technologies, computer science, engineering, or business analytics. '
    'This means you studied a subject that is related to the job. A PM needs both business '
    'knowledge (to understand what the company needs) and technical knowledge (to understand '
    'how IT systems work). Your degree in Applied Mathematics from Baku State University '
    'is a perfect match because mathematics teaches logical thinking and problem solving.',
    'Employers want to see that you have a strong educational foundation. A university degree '
    'shows that you can study, analyze information, and complete complex tasks. For IT Project '
    'Management, both business and technical degrees are accepted.',
    '"What is your educational background and how does it relate to this position?"',
    '"I have a Bachelor of Science in Applied Mathematics from Baku State University. '
    'Mathematics taught me analytical thinking, logical problem solving, and data analysis. '
    'These skills are essential for project management because a PM must analyze problems, '
    'make data-driven decisions, and think logically. Additionally, my 15 years of software '
    'engineering experience gave me deep technical knowledge that helps me understand IT '
    'projects from both business and technical perspectives."',
    ['Tip: Always connect your education to the job. Explain HOW your degree helps you as a PM.']
)

# Topic 2: IT Project Management Experience
add_topic(story, 2, 'IT Project Management Experience (Minimum 1 Year)',
    'The job requires at least 1 year of experience in IT project management. This means you '
    'have led or managed at least one IT project from start to finish. Experience includes: '
    'planning a project, coordinating a team, tracking progress, managing risks, and delivering '
    'results. In your case, you have 2+ years of project delivery experience at Embafinans and '
    'Birbonus. You managed projects like credit scoring systems, payment gateway integration, '
    'and loyalty bonus systems.',
    'Project management experience shows that you can handle real-world challenges. '
    'It is not enough to know theory. Employers want to see that you have actually managed '
    'projects, solved problems, and delivered results. Your experience at Embafinans '
    'demonstrates that you can manage cross-functional teams and deliver production systems.',
    '"Tell me about your IT project management experience."',
    '"I have over 2 years of hands-on project delivery experience in fintech. '
    'At Embafinans, I led the delivery of 4 major projects: a BNPL Credit Scoring system '
    'that reduced credit decision time by 50%, a B2C Sales Channel processing 300-500 daily '
    'applications, a real-time delivery tracking dashboard, and an end-to-end credit lifecycle '
    'platform. In each project, I managed scope, coordinated cross-functional teams, tracked '
    'progress using Jira, and ensured on-time delivery. Before that, at Birbonus, I led the '
    'design and delivery of a customer loyalty bonus system."',
    ['Tip: Use numbers and results in your answer. Say "300-500 applications" not just "many applications".']
)

# Topic 3: Agile, Scrum, Waterfall & Power BI
add_topic(story, 3, 'Agile, Scrum, Waterfall and Power BI',
    'These are methodologies and tools that a PM uses every day. '
    '<b>Agile</b> means working in short cycles (sprints). Instead of planning everything at the '
    'beginning, you plan a little, build a little, test a little, and repeat. '
    '<b>Scrum</b> is a type of Agile. It has specific roles (Scrum Master, Product Owner, Team), '
    'events (Sprint Planning, Daily Standup, Sprint Review, Retrospective), and artifacts '
    '(Product Backlog, Sprint Backlog, Burndown Chart). '
    '<b>Waterfall</b> is the traditional approach: you plan everything first, then build, then '
    'test, then deliver. Each phase must finish before the next one starts. '
    '<b>Power BI</b> is a Microsoft tool for creating visual dashboards and reports from data. '
    'A PM uses Power BI to show project status, KPIs, and trends to stakeholders.',
    'Every IT company uses Agile or Scrum today. Waterfall is used for projects with fixed '
    'requirements (like government projects). Power BI is increasingly required because '
    'stakeholders want visual reports, not text documents.',
    '"Which project management methodologies have you used?"',
    '"In my projects at Embafinans, I primarily used Agile and Scrum methodologies. '
    'We worked in 2-week sprints with Sprint Planning at the start, Daily Standups for '
    'coordination, and Sprint Reviews to demonstrate completed features to stakeholders. '
    'I used Jira for sprint boards, burndown charts, and backlog management. For stakeholder '
    'reporting, I created Power BI dashboards that showed project KPIs like application volume, '
    'error rates, and team velocity. This gave stakeholders a clear visual view of project '
    'status without reading long text reports."',
    ['Tip: If they ask about Waterfall, say: "I understand Waterfall and can use it when '
     'requirements are fixed and well-defined. However, Agile is my preferred approach for '
     'IT projects because it allows flexibility and faster feedback."']
)

# Topic 4: Analytical Thinking & Problem Solving
add_topic(story, 4, 'Analytical Thinking and Problem Solving',
    'Analytical thinking means you can look at a problem, break it into smaller parts, '
    'understand the root cause, and find a solution. Problem solving means you do not just '
    'identify problems but actually fix them. For example, if a project is delayed, an '
    'analytical PM will find out WHY (is it a technical issue? a resource issue? a scope issue?) '
    'and then propose a solution (add more developers? remove some features? extend the deadline?).',
    'This is one of the most important skills for a PM. Every project has problems. '
    'A PM who can analyze and solve problems quickly keeps the project on track.',
    '"Give me an example of a problem you solved in a project."',
    '"During the BNPL Credit Scoring project, we faced conflicting stakeholder priorities. '
    'The risk team wanted stricter rules, while the sales team wanted faster approvals. '
    'I analyzed the situation using SQL data queries to understand the actual default rates '
    'and approval patterns. Based on the data, I proposed a balanced solution: medium-risk '
    'applications could be auto-approved while high-risk ones required manual review. This '
    'satisfied both teams and we achieved 2x faster credit decisions."',
    ['Tip: Always mention DATA in your answer. Employers love PMs who make decisions based on data, not feelings.']
)

# Topic 5: Project Planning, Budget & Resource Management
add_topic(story, 5, 'Project Planning, Budget and Resource Management',
    '<b>Project Planning</b> means creating a roadmap for the project: What are the goals? '
    'What tasks need to be done? Who will do each task? When will each task be completed? '
    'What are the milestones (important dates)? '
    '<b>Budget Management</b> means tracking how much money the project uses. Every project '
    'has a money limit. The PM must check regularly: Are we spending more than planned? '
    'If yes, why? How can we fix it? '
    '<b>Resource Management</b> means managing people and tools. Who is working on what? '
    'Does anyone have too much work? Does anyone have too little work? Are we using our '
    'tools and licenses efficiently?',
    'A project without planning will fail. Without budget management, the project will cost '
    'too much. Without resource management, the team will be overloaded or underutilized. '
    'These three skills together ensure that a project finishes on time, within budget, '
    'and with the right use of resources.',
    '"How do you plan a project and manage its budget and resources?"',
    '"I start by defining the project scope and goals with stakeholders. Then I break the '
    'project into tasks using a work breakdown structure, assign tasks to team members, '
    'and set milestones in Jira. For budget management, I track delivery costs and resource '
    'usage weekly, aligned with project timelines, ensuring optimal use of available budget. '
    'For resource management, I distribute team members across concurrent projects based on '
    'priority and capacity. For example, when we had Credit Scoring and Payment Gateway '
    'projects running simultaneously, I allocated 2 developers to the higher-priority project '
    'and 1 to the other, while sharing QA resources."',
    ['Tip: "Budget" does not always mean direct money. Time and people are also resources that have cost.']
)

# Topic 6: Priority Setting
add_topic(story, 6, 'Priority Setting',
    'Priority setting means deciding which tasks or features are most important and should be '
    'done first. When you have 20 tasks but only time for 10, you must choose the most '
    'valuable ones. There are frameworks for this. The most common ones are: '
    '<b>RICE Framework:</b> Reach (how many users will benefit?), Impact (how much value?), '
    'Confidence (how sure are we?), Effort (how much time/money?). Score = (R x I x C) / E. '
    '<b>MoSCoW Method:</b> Must have (critical), Should have (important), Could have (nice), '
    'Won\'t have (not this time). '
    '<b>Eisenhower Matrix:</b> Urgent+Important (do now), Important+Not Urgent (plan), '
    'Urgent+Not Important (delegate), Not Urgent+Not Important (skip).',
    'A PM must set priorities every day. If priorities are wrong, the team works on low-value '
    'tasks while important tasks are delayed. Good priority setting = maximum business value '
    'with limited time and resources.',
    '"How do you prioritize tasks and requirements?"',
    '"I use the RICE framework to prioritize requirements. For each requirement, I evaluate '
    'Reach (how many users or stakeholders benefit), Impact (how much business value it '
    'creates), Confidence (how certain we are about our estimates), and Effort (how much '
    'time and resources it needs). Then I calculate the RICE score and rank requirements '
    'by score. This ensures that our sprint planning focuses on the highest-value tasks. '
    'I also use the MoSCoW method to classify requirements into Must, Should, Could, and '
    'Won\'t categories for clear scope management."',
    ['Tip: Write RICE on paper and remember: Reach x Impact x Confidence / Effort.']
)

# Topic 7: PM Certifications
add_topic(story, 7, 'PM Certifications (PMP, Scrum Master)',
    'The job description says PMP, Scrum Master, or other PM certifications are an advantage. '
    '<b>PMP (Project Management Professional)</b> is a global certification from PMI. It covers '
    'all aspects of project management: planning, executing, monitoring, closing. It requires '
    '35 hours of training and 3-5 years of experience. '
    '<b>Scrum Master (CSM or PSM)</b> is a certification for Scrum methodology. It shows that '
    'you understand Agile/Scrum roles, events, and artifacts. It is easier and faster to get '
    'than PMP. '
    'Other certifications: CAPM (entry-level PM), PRINCE2 (popular in Europe), ITIL (service '
    'management), PMI-ACP (Agile certified practitioner).',
    'Certifications show that you have formal knowledge of project management. They are not '
    'always required, but they give you an advantage over other candidates, especially when '
    'experience levels are similar.',
    '"Do you have any PM certifications?"',
    '"While I do not currently hold a formal PM certification, I have extensive hands-on '
    'experience applying PM best practices in real projects. I am actively preparing for '
    'the PMP certification and have been studying the PMBOK guide. My daily work at Embafinans '
    'already involves all the core PM competencies that these certifications test: scope '
    'management, stakeholder management, risk management, and Agile methodologies. I plan to '
    'complete my PMP certification in the near future."',
    ['Tip: If you do not have a certificate, say you are studying for one. This shows motivation.']
)

# Topic 8: Teamwork & Responsibility
add_topic(story, 8, 'Teamwork and Responsibility',
    'Teamwork means you can work well with other people: developers, testers, business analysts, '
    'managers, and stakeholders. A PM does not work alone. The PM connects all team members '
    'and makes sure everyone works toward the same goal. '
    'Responsibility means you take ownership of your work and your project. If something goes '
    'wrong, you do not blame others. You take responsibility, find the problem, and fix it. '
    'If a project succeeds, you share the credit with the team.',
    'IT projects are always team efforts. A PM who cannot work with people will fail, even '
    'with perfect technical skills. Employers look for PMs who can build trust, resolve '
    'conflicts, and keep the team motivated.',
    '"How do you work with teams and handle responsibility?"',
    '"In my role, I work with cross-functional teams every day: developers, QA engineers, '
    'business analysts, risk managers, and operations teams. I facilitate alignment meetings '
    'to ensure everyone understands the project goals and their responsibilities. I believe '
    'in transparent communication and regular status updates. When issues arise, I take '
    'responsibility for finding solutions rather than assigning blame. For example, during '
    'UAT testing, when we found critical bugs, I immediately organized a bug triage meeting '
    'with QA and developers to prioritize and assign fixes, rather than pointing fingers."',
    ['Tip: Use words like "facilitate," "coordinate," "align" instead of "boss" or "command".']
)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PART 2: JOB RESPONSIBILITIES
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
story.append(make_part_header('PART 2: JOB RESPONSIBILITIES', available_width))
story.append(Spacer(1, 12))

# Topic 9: Project Goals & Strategy
add_topic(story, 9, 'Defining Project Goals and Execution Strategy',
    'This means the PM must answer: What is this project trying to achieve? (Goals) '
    'How will we achieve it? (Strategy). Goals should be SMART: Specific, Measurable, '
    'Achievable, Relevant, Time-bound. Strategy means creating a plan that includes: '
    'phases of the project, key milestones, team structure, risk assessment, and '
    'success criteria.',
    'Without clear goals, the team does not know what they are building. Without a '
    'strategy, the team does not know HOW to build it. The PM must define both at the '
    'start and communicate them to everyone.',
    '"How do you define project goals and strategy?"',
    '"I start by conducting stakeholder sessions to understand what the business needs. '
    'Then I define SMART goals: for example, instead of "improve credit decisions," I would '
    'say "reduce credit decision time from 24 hours to 12 hours by March 2025." '
    'For strategy, I create a phased plan with clear milestones: Phase 1 is discovery '
    'and scope definition, Phase 2 is development, Phase 3 is UAT testing, and Phase 4 '
    'is go-live. I also define success criteria so we know when the project is complete."',
)

# Topic 10: Task Monitoring & Team Coordination
add_topic(story, 10, 'Monitoring Tasks and Coordinating the Team',
    'This means the PM checks: Is each team member doing their tasks? Are tasks on schedule? '
    'Are there any blockers? The PM uses tools like Jira to see task status daily. '
    'Coordination means making sure all team members work together smoothly. If the backend '
    'developer finishes an API, the frontend developer needs to know so they can start '
    'integration. The PM connects people.',
    'A PM who does not monitor tasks will discover problems too late. A PM who does not '
    'coordinate the team will have developers waiting for each other and wasting time.',
    '"How do you monitor tasks and coordinate your team?"',
    '"I use Jira as my primary tool for task monitoring. Every morning, I check the sprint '
    'board and burndown chart to see: Which tasks are completed? Which are in progress? '
    'Which are blocked? For team coordination, I organize daily standup meetings where each '
    'team member answers 3 questions: What did I do yesterday? What will I do today? Is '
    'anything blocking me? If there is a blocker, I immediately work on removing it. '
    'I also ensure that when one team member finishes a task (like API development), '
    'the next person (like frontend integration) is ready to start."',
)

# Topic 11: Progress Tracking & Risk Management
add_topic(story, 11, 'Tracking Project Progress and Managing Risks',
    '<b>Progress Tracking:</b> The PM regularly checks: Are we on schedule? Are we within '
    'budget? Are we meeting quality standards? This is done through status reports, '
    'dashboards, and meetings with stakeholders. '
    '<b>Risk Management:</b> A risk is something that MIGHT go wrong in the future. '
    'For example: a key developer might leave, a server might crash, requirements might change. '
    'The PM must: identify risks early, assess their impact (high/medium/low), plan mitigation '
    'actions (what will we do if the risk happens?), and monitor risks throughout the project.',
    'Without progress tracking, the PM does not know if the project is on track until it is '
    'too late. Without risk management, the PM reacts to problems instead of preventing them.',
    '"How do you track progress and manage risks?"',
    '"For progress tracking, I generate weekly sprint reports in Jira showing completed tasks, '
    'remaining tasks, burndown velocity, and any deviations from the plan. I share these with '
    'stakeholders in weekly status meetings. For risk management, I maintain a risk register '
    'that lists all identified risks, their probability and impact, and mitigation plans. '
    'For example, during the Credit Lifecycle project, I identified the risk of changing '
    'regulations as high-impact. My mitigation plan was to maintain flexibility in the scoring '
    'rules so we could adjust quickly. I review the risk register weekly and update it as needed."',
)

# Topic 12: Stakeholder Communication & Reporting
add_topic(story, 12, 'Effective Stakeholder Communication and Reporting',
    'Stakeholders are all the people who care about the project: managers, business owners, '
    'developers, testers, end users. The PM must communicate with all of them regularly. '
    'Communication means: sharing good news AND bad news, asking for decisions when needed, '
    'managing expectations (what is possible and what is not), and resolving conflicts between '
    'different stakeholders. '
    'Reporting means creating status reports, dashboards, and presentations that show project '
    'progress. Good reports are clear, concise, and visual.',
    'Poor communication is the #1 cause of project failure. If stakeholders do not know '
    'what is happening, they make wrong decisions. If the PM does not manage expectations, '
    'stakeholders will be disappointed even if the project is successful.',
    '"How do you communicate with stakeholders and create reports?"',
    '"I believe in proactive and transparent communication. I schedule regular meetings '
    'with different stakeholder groups: weekly status meetings with managers, sprint reviews '
    'with the development team, and UAT coordination meetings with business users. '
    'For reporting, I create Power BI dashboards that show key metrics visually, combined '
    'with written status summaries for context. When there is bad news, I share it early '
    'along with a proposed solution. I find that stakeholders appreciate honesty and '
    'action-oriented communication more than hidden problems."',
)

# Topic 13: IT Project Planning, Management & Coordination
add_topic(story, 13, 'IT Project Planning, Management and Coordination',
    'This combines all the PM skills: planning (scope, timeline, resources), management '
    '(tracking, controlling, adjusting), and coordination (connecting people, managing '
    'dependencies). For IT projects specifically, the PM also needs to understand technical '
    'concepts: software development lifecycle, API integration, testing, deployment, '
    'and infrastructure. Your 15+ years of engineering background gives you a significant '
    'advantage here because you can understand technical discussions and make informed decisions.',
    'IT projects are more complex than other projects because technology changes fast and '
    'technical issues are harder to predict. A PM who understands technology can better '
    'plan, estimate, and manage IT projects.',
    '"What makes IT project management different from other project management?"',
    '"IT projects have unique challenges: requirements often change during development, '
    'technical dependencies between systems can cause delays, and testing requires '
    'specialized environments. My 15 years of software engineering experience helps me '
    'understand these challenges. For example, when a developer says an API integration '
    'will take 2 weeks, I can evaluate if that estimate is realistic based on my technical '
    'background. This helps me create more accurate plans and manage stakeholder expectations '
    'better than a non-technical PM could."',
    ['Tip: Your 15 years engineering background is your BIGGEST advantage. Always mention it.']
)

# Topic 14: Resource & Budget Management
add_topic(story, 14, 'Efficient Resource and Budget Management',
    '<b>Resource Management:</b> Resources include people (developers, testers, analysts), '
    'tools (Jira licenses, servers, Power BI), and time (hours, days, sprints). The PM must '
    'ensure resources are used efficiently: no one is overloaded, no one is idle, tools are '
    'not wasted, and time is used productively. '
    '<b>Budget Management:</b> Budget is the money available for the project. The PM tracks '
    'planned vs actual spending. Key terms: Cost Estimation (predicting costs before project '
    'starts), Cost Tracking (monitoring spending during project), Budget Variance (difference '
    'between planned and actual costs).',
    'Efficient resource management saves money and time. Good budget management prevents '
    'projects from running out of money before completion. These are core PM competencies '
    'that every employer expects.',
    '"How do you manage resources and budget in your projects?"',
    '"I manage resources by distributing team members across projects based on priority and '
    'capacity. For example, when we had multiple projects running at Embafinans, I used Jira '
    'to track each developer\'s workload and ensure no one was overloaded. I also used the '
    'RICE framework to prioritize tasks so the team always works on the highest-value items. '
    'For budget management, I track delivery costs aligned with project timelines and monitor '
    'weekly whether we are within planned budget. If I see a potential over-budget situation, '
    'I immediately analyze the cause and propose corrective actions to management."',
)

# Topic 15: PMIS & New Approaches
add_topic(story, 15, 'Implementing PMIS and New Project Management Approaches',
    '<b>PMIS</b> (Project Management Information System) is a software system that helps a PM '
    'manage all project information in one place. The most popular PMIS tools in IT are: '
    '<b>Jira:</b> For Agile projects. Sprint boards, backlog, burndown charts, velocity tracking. '
    '<b>MS Project:</b> For Waterfall projects. Gantt charts, critical path analysis. '
    '<b>Asana / Monday.com:</b> For general project management. Task boards, timelines. '
    'A PMIS gives you visibility: you can see all tasks, all risks, all resources, and all '
    'costs in one dashboard. Without a PMIS, a PM uses Excel and email, which is slow and '
    'error-prone. <b>New approaches</b> mean the PM should always look for better ways to '
    'manage projects: new tools, new processes, new methodologies.',
    'A PMIS makes a PM more efficient and organized. It also provides transparency because '
    'stakeholders can see project status themselves. Implementing new approaches shows that '
    'the PM is proactive and always improving.',
    '"What PMIS tools have you used and how?"',
    '"I implemented Jira-based project management workflows for sprint planning, task tracking, '
    'burndown reporting, and milestone management. I set up sprint boards for each project, '
    'configured burndown charts to monitor velocity, and created dashboards for stakeholders. '
    'Jira served as our PMIS, giving the entire team and stakeholders real-time visibility '
    'into project progress. I also used Confluence for documentation, which integrated with '
    'Jira for requirement traceability."',
)

# Topic 16: Test Strategy & Risk/Change Management
add_topic(story, 16, 'Test Strategy, Risk Management and Change Management',
    '<b>Test Strategy:</b> A plan that defines HOW a project will be tested before go-live. '
    'It answers: What will we test? (features, reports, payments) When? (after development) '
    'Who? (QA team, business users) How? (manual, automated, UAT). The PM participates in '
    'test strategy planning and coordinates UAT with business stakeholders. '
    '<b>Risk Management:</b> Identifying what might go wrong, assessing impact, and planning '
    'mitigation. Risks are tracked in a risk register. '
    '<b>Change Management:</b> Handling changes DURING a project. When someone says "please '
    'add this new feature," the PM must analyze the impact on time and budget, get approval, '
    'and update the plan. Without change management, scope creep happens (the project keeps '
    'growing and never finishes).',
    'These three skills together ensure that the final product is high quality (test strategy), '
    'problems are prevented (risk management), and the project stays on track despite changes '
    '(change management).',
    '"Tell me about your experience with test strategy, risks, and change management."',
    '"I participated in test strategy planning alongside QA teams. I helped define test scope, '
    'coordinated UAT execution with business stakeholders, and led bug triage meetings to '
    'prioritize fixes. For risk management, I maintained a risk register and reviewed it weekly. '
    'For change management, when stakeholders requested changes, I analyzed the impact on '
    'timeline and resources, presented options to management, and after approval, updated '
    'the project plan and added new tasks to Jira. This structured approach prevented scope '
    'creep and kept the project focused on agreed objectives."',
)

# ── Final Tips Section ──
story.append(Spacer(1, 10))
story.append(HRFlowable(width="100%", thickness=2, color=ACCENT, spaceAfter=10))

story.append(Paragraph('<b>FINAL INTERVIEW TIPS</b>', styles['h1']))
story.append(Spacer(1, 6))

tips = [
    '<b>Use the STAR Method:</b> S (Situation) = What was the problem? T (Task) = What did you need to do? A (Action) = What did YOU do? R (Result) = What was the outcome? Every answer should follow this structure.',
    '<b>Use Numbers:</b> "300-500 applications" is better than "many applications." Numbers show measurable impact.',
    '<b>Connect Everything to Your Experience:</b> When they ask about theory, always give an example from Embafinans, Birbonus, or Umico.',
    '<b>Be Honest:</b> If you do not know something, say: "I have basic knowledge and I am learning more." Then connect it to what you DO know.',
    '<b>Speak Confidently:</b> Your 15+ years of engineering background is a significant advantage. Not many PMs have deep technical knowledge.',
    '<b>Ask Questions:</b> At the end, ask about the team structure, current projects, and challenges. This shows interest and preparation.',
]

for i, tip in enumerate(tips):
    story.append(Paragraph(f'{i+1}. {tip}', styles['body_indent']))

# Build
doc.build(story)

size = os.path.getsize(output_path)
print(f"PDF created: {output_path}")
print(f"Size: {size/1024:.1f} KB")

import pdfplumber
with pdfplumber.open(output_path) as pdf:
    print(f"Total pages: {len(pdf.pages)}")
