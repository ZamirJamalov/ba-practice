#!/usr/bin/env python3
"""Generate Innovation Agency Cover Letter v2 - English B1 level - 1 page"""

from docx import Document
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH

doc = Document()

for section in doc.sections:
    section.top_margin = Inches(0.8)
    section.bottom_margin = Inches(0.6)
    section.left_margin = Inches(1.0)
    section.right_margin = Inches(1.0)

DARK = RGBColor(33, 37, 41)
GRAY = RGBColor(89, 89, 89)

def add_para(text, bold=False, size=11, color=None, alignment=WD_ALIGN_PARAGRAPH.LEFT,
             space_after=Pt(6), space_before=Pt(0)):
    p = doc.add_paragraph()
    p.alignment = alignment
    p.paragraph_format.space_after = space_after
    p.paragraph_format.space_before = space_before
    run = p.add_run(text)
    run.bold = bold
    run.font.size = Pt(size)
    run.font.name = 'Calibri'
    if color:
        run.font.color.rgb = color
    return p

# Header
add_para('ZAMIR JAMALOV', bold=True, size=16, space_after=Pt(2))
add_para('+994 55 207 7228  |  jamalov.zamir@gmail.com  |  Baku, Azerbaijan',
         size=10, color=GRAY, space_after=Pt(12))

# Date & Addressee on same line area
add_para('Baku, May 6, 2026', space_after=Pt(8))

add_para('Innovation and Digital Development Agency', space_after=Pt(1))
add_para('Baku, Azerbaijan', space_after=Pt(8))

# Subject
add_para(
    'Re: Application for Senior Business Analyst / Lead Specialist '
    '- Design and Improvement of Public Services',
    bold=True, space_after=Pt(8))

# Greeting
add_para('Dear Hiring Manager,', space_after=Pt(6))

# === BODY ===

# 1. OPENING - I understand your mission + I'm a fit
add_para(
    'I am applying for the Senior Business Analyst position because the '
    'Agency\'s mission to redesign and digitize government services directly '
    'matches my professional background. Over 18 years in IT, I have worked '
    'on both sides of government digital transformation: as a technical '
    'integrator connecting government systems, and as a business analyst '
    'designing end-to-end citizen services.',
    size=11, space_after=Pt(8))

# 2. PAIN POINT → SOLUTION: Multi-agency coordination + process design
add_para(
    'I understand that the Agency\'s biggest challenge is coordinating across '
    'multiple government institutions: each agency has its own processes, '
    'systems and stakeholders, and making them work together for a single '
    'citizen service is complex. I have solved this exact problem. At the '
    'Central Bank, I coordinated the integration of 10+ government '
    'organizations into the Government Payment Portal, defining data exchange '
    'requirements and building cross-system middleware. At the State Employment '
    'Agency, I led the digitization of the Labour and Employment Subsystem '
    '(LMAS) with a 15-member cross-functional team, where I had to align '
    'stakeholders from different departments around a unified service '
    'architecture.',
    size=11, space_after=Pt(8))

# 3. PAIN POINT → SOLUTION: Citizen-centered design + requirements
add_para(
    'I also understand that designing services is not only about technology '
    'but about putting citizens at the center. At the State Employment Agency, '
    'I analyzed the full citizen journey from application to result, identified '
    'bottlenecks, and designed a Telegram-based channel that allowed citizens '
    'to submit applications without visiting an office. I also built a '
    'monitoring dashboard for management to track application status, response '
    'times and service quality indicators in real time. These experiences gave '
    'me practical understanding of service journey analysis, SLA monitoring and '
    'citizen-centered design that the Agency applies in its work.',
    size=11, space_after=Pt(8))

# 4. WHY INNOVATION AGENCY - genuine motivation
add_para(
    'What brings me to the Agency is not just a job opportunity. I have '
    'experienced firsthand how government services can change when they are '
    'designed around citizens rather than institutions. Both the GPP and LMAS '
    'projects showed me the impact that well-designed digital services have on '
    'people\'s daily lives. The Innovation and Digital Development Agency is '
    'the driving force behind this transformation in Azerbaijan, and I want to '
    'contribute to that mission with my experience in multi-agency coordination, '
    'requirements documentation and government process design.',
    size=11, space_after=Pt(8))

# 5. CLOSING
add_para(
    'I would welcome the opportunity to discuss how my background can support '
    'the Agency\'s goals in an interview.',
    size=11, space_after=Pt(10))

# Closing signature
add_para('Sincerely,', space_before=Pt(6), space_after=Pt(2))
add_para('Zamir Jamalov', bold=True, size=11)

output = '/home/z/my-project/ba-practice/Zamir_Jamalov_Cover_Letter_Innovation_Agency_EN.docx'
doc.save(output)
print(f'Cover Letter EN saved: {output}')
