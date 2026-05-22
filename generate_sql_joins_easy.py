#!/usr/bin/env python3
"""
SQL JOINs - Easy Guide for Tank54
Step-by-Step with simple examples | A1 English | Oracle HR Schema
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, PageBreak
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily

# -- Fonts --
pdfmetrics.registerFont(TTFont('Cal', '/usr/share/fonts/truetype/english/Carlito-Regular.ttf'))
pdfmetrics.registerFont(TTFont('CalB', '/usr/share/fonts/truetype/english/Carlito-Bold.ttf'))
pdfmetrics.registerFont(TTFont('CalI', '/usr/share/fonts/truetype/english/Carlito-Italic.ttf'))
pdfmetrics.registerFont(TTFont('Mono', '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'))
registerFontFamily('Cal', normal='Cal', bold='CalB', italic='CalI')

# -- Colors --
ACCENT = colors.HexColor('#1a6b7a')
DARK = colors.HexColor('#2a2a2a')
MUTED = colors.HexColor('#666666')
LIGHT_BG = colors.HexColor('#f0f7f8')
SQL_BG = colors.HexColor('#f5f5f0')
WHITE = colors.white
GREEN_BG = colors.HexColor('#e8f5e9')
YELLOW_BG = colors.HexColor('#fff8e1')
RED_BG = colors.HexColor('#fce4ec')
BLUE_BG = colors.HexColor('#e3f2fd')

# -- Styles --
title_style = ParagraphStyle('Title', fontName='CalB', fontSize=18, leading=22, textColor=ACCENT, alignment=TA_CENTER, spaceAfter=2)
subtitle_style = ParagraphStyle('Sub', fontName='Cal', fontSize=10, leading=13, textColor=MUTED, alignment=TA_CENTER, spaceAfter=4)
h1_style = ParagraphStyle('H1', fontName='CalB', fontSize=13, leading=16, textColor=ACCENT, spaceBefore=10, spaceAfter=4)
h2_style = ParagraphStyle('H2', fontName='CalB', fontSize=11, leading=14, textColor=ACCENT, spaceBefore=6, spaceAfter=3)
h3_style = ParagraphStyle('H3', fontName='CalB', fontSize=9.5, leading=12, textColor=DARK, spaceBefore=4, spaceAfter=2)
body_style = ParagraphStyle('Body', fontName='Cal', fontSize=9, leading=13, textColor=DARK, spaceAfter=2, alignment=TA_JUSTIFY)
sql_style = ParagraphStyle('SQL', fontName='Mono', fontSize=7.8, leading=11, textColor=DARK, spaceAfter=2,
                           backColor=SQL_BG, borderPadding=4, leftIndent=6, rightIndent=6)
step_style = ParagraphStyle('Step', fontName='Cal', fontSize=9, leading=12.5, textColor=DARK, leftIndent=14, spaceAfter=1.5)
label_style = ParagraphStyle('Label', fontName='CalI', fontSize=8, leading=10, textColor=MUTED, spaceAfter=1)
task_style = ParagraphStyle('Task', fontName='Cal', fontSize=9, leading=12.5, textColor=DARK, leftIndent=6, spaceAfter=1)
tip_style = ParagraphStyle('Tip', fontName='Cal', fontSize=8.5, leading=12, textColor=DARK, leftIndent=6, rightIndent=6, spaceAfter=2)
header_cell = ParagraphStyle('HC', fontName='CalB', fontSize=8, leading=10, textColor=WHITE)
data_cell = ParagraphStyle('DC', fontName='Cal', fontSize=8, leading=10, textColor=DARK)
mono_cell = ParagraphStyle('MC', fontName='Mono', fontSize=7.5, leading=10, textColor=DARK)

W, H = A4
LM, RM, TM, BM = 1.5*cm, 1.5*cm, 1.2*cm, 1.2*cm
AW = W - LM - RM

OUTPUT = '/home/z/my-project/download/SQL_JOINS_Easy_Guide_Tank54.pdf'
doc = SimpleDocTemplate(OUTPUT, pagesize=A4, leftMargin=LM, rightMargin=RM, topMargin=TM, bottomMargin=BM)

story = []

# ============ COVER ============
story.append(Spacer(1, 2.5*cm))
story.append(Paragraph('SQL JOINs', title_style))
story.append(Paragraph('Easy Step-by-Step Guide', subtitle_style))
story.append(Spacer(1, 0.5*cm))
story.append(HRFlowable(width="60%", thickness=1.5, color=ACCENT, spaceAfter=6))
story.append(Paragraph('Tank54 Group | Oracle HR Schema', ParagraphStyle('Sub2', fontName='Cal', fontSize=10, leading=13, textColor=MUTED, alignment=TA_CENTER, spaceAfter=4)))
story.append(Spacer(1, 0.8*cm))
story.append(Paragraph('What is a JOIN?', ParagraphStyle('Q', fontName='CalB', fontSize=11, leading=14, textColor=DARK, alignment=TA_CENTER, spaceAfter=4)))
story.append(Paragraph(
    'A JOIN puts together data from two tables. For example, the EMPLOYEES table has department_id, '
    'but not the department name. The DEPARTMENTS table has the department name. '
    'With a JOIN, we can see the employee name and the department name together in one result.',
    ParagraphStyle('CoverBody', fontName='Cal', fontSize=9.5, leading=14, textColor=DARK, alignment=TA_CENTER, leftIndent=1.5*cm, rightIndent=1.5*cm)
))
story.append(Spacer(1, 0.6*cm))
story.append(Paragraph(
    'This guide explains INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN with simple examples.',
    ParagraphStyle('Topics', fontName='CalI', fontSize=9, leading=12, textColor=MUTED, alignment=TA_CENTER)
))

story.append(PageBreak())

# ============ THE TWO TABLES ============
story.append(Paragraph('The Two Tables We Will Use', h1_style))
story.append(HRFlowable(width="100%", thickness=0.5, color=ACCENT, spaceAfter=4))
story.append(Paragraph(
    'For all examples, we use two tables: <b>EMPLOYEES</b> and <b>DEPARTMENTS</b>. They are connected '
    'by a common column: <b>DEPARTMENT_ID</b>. This column exists in both tables. '
    'We use this column to join the tables together.',
    body_style))
story.append(Spacer(1, 4))

# EMPLOYEES mini table
story.append(Paragraph('EMPLOYEES Table (sample rows):', h3_style))
emp_data = [
    [Paragraph('<b>EMPLOYEE_ID</b>', header_cell), Paragraph('<b>FIRST_NAME</b>', header_cell),
     Paragraph('<b>LAST_NAME</b>', header_cell), Paragraph('<b>JOB_ID</b>', header_cell),
     Paragraph('<b>SALARY</b>', header_cell), Paragraph('<b>DEPARTMENT_ID</b>', header_cell)],
    [Paragraph('100', mono_cell), Paragraph('Steven', data_cell), Paragraph('King', data_cell),
     Paragraph('AD_PRES', mono_cell), Paragraph('24000', mono_cell), Paragraph('90', mono_cell)],
    [Paragraph('101', mono_cell), Paragraph('Neena', data_cell), Paragraph('Kochhar', data_cell),
     Paragraph('AD_VP', mono_cell), Paragraph('17000', mono_cell), Paragraph('90', mono_cell)],
    [Paragraph('102', mono_cell), Paragraph('Lex', data_cell), Paragraph('De Haan', data_cell),
     Paragraph('AD_VP', mono_cell), Paragraph('17000', mono_cell), Paragraph('90', mono_cell)],
    [Paragraph('107', mono_cell), Paragraph('Diana', data_cell), Paragraph('Lorentz', data_cell),
     Paragraph('IT_PROG', mono_cell), Paragraph('4200', mono_cell), Paragraph('60', mono_cell)],
    [Paragraph('178', mono_cell), Paragraph('Kimberely', data_cell), Paragraph('Grant', data_cell),
     Paragraph('SA_REP', mono_cell), Paragraph('7000', mono_cell), Paragraph('null', mono_cell)],
]
emp_t = Table(emp_data, colWidths=[AW*0.16, AW*0.16, AW*0.16, AW*0.16, AW*0.16, AW*0.20])
emp_t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), ACCENT),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('LEFTPADDING', (0,0), (-1,-1), 4),
    ('RIGHTPADDING', (0,0), (-1,-1), 4),
    ('TOPPADDING', (0,0), (-1,-1), 3),
    ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ('GRID', (0,0), (-1,-1), 0.3, colors.HexColor('#cccccc')),
    ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, LIGHT_BG]),
]))
story.append(emp_t)

story.append(Spacer(1, 6))

# DEPARTMENTS mini table
story.append(Paragraph('DEPARTMENTS Table (sample rows):', h3_style))
dept_data = [
    [Paragraph('<b>DEPARTMENT_ID</b>', header_cell), Paragraph('<b>DEPARTMENT_NAME</b>', header_cell),
     Paragraph('<b>LOCATION_ID</b>', header_cell)],
    [Paragraph('10', mono_cell), Paragraph('Administration', data_cell), Paragraph('1700', mono_cell)],
    [Paragraph('60', mono_cell), Paragraph('IT', data_cell), Paragraph('1400', mono_cell)],
    [Paragraph('90', mono_cell), Paragraph('Executive', data_cell), Paragraph('1700', mono_cell)],
    [Paragraph('270', mono_cell), Paragraph('Payroll', data_cell), Paragraph('1700', mono_cell)],
]
dept_t = Table(dept_data, colWidths=[AW*0.25, AW*0.45, AW*0.30])
dept_t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), ACCENT),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('LEFTPADDING', (0,0), (-1,-1), 4),
    ('RIGHTPADDING', (0,0), (-1,-1), 4),
    ('TOPPADDING', (0,0), (-1,-1), 3),
    ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ('GRID', (0,0), (-1,-1), 0.3, colors.HexColor('#cccccc')),
    ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, LIGHT_BG]),
]))
story.append(dept_t)

story.append(Spacer(1, 6))

# Key idea box
key_box = [[Paragraph(
    '<b>Key Idea:</b> EMPLOYEES.DEPARTMENT_ID = DEPARTMENTS.DEPARTMENT_ID<br/>'
    'This is the <b>join condition</b>. It tells SQL: "match the employee\'s department ID '
    'with the department\'s ID, and put the data together".',
    tip_style)]]
kb_table = Table(key_box, colWidths=[AW*0.98])
kb_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), BLUE_BG),
    ('LEFTPADDING', (0,0), (-1,-1), 8),
    ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ('TOPPADDING', (0,0), (-1,-1), 6),
    ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ('BOX', (0,0), (-1,-1), 0.8, ACCENT),
]))
story.append(kb_table)

story.append(PageBreak())

# ============ JOIN TYPES OVERVIEW ============
story.append(Paragraph('JOIN Types - Overview', h1_style))
story.append(HRFlowable(width="100%", thickness=0.5, color=ACCENT, spaceAfter=4))

story.append(Paragraph(
    'There are 4 main types of JOINs. Each type shows different rows in the result. '
    'The table below explains each type in simple words.',
    body_style))
story.append(Spacer(1, 4))

overview = [
    [Paragraph('<b>JOIN Type</b>', header_cell), Paragraph('<b>What does it do?</b>', header_cell),
     Paragraph('<b>Simple English</b>', header_cell)],
    [Paragraph('<b>INNER JOIN</b>', data_cell),
     Paragraph('Shows ONLY matching rows from both tables.', data_cell),
     Paragraph('Give me employees who have a department, and show me the department name.', data_cell)],
    [Paragraph('<b>LEFT JOIN</b>', data_cell),
     Paragraph('Shows ALL rows from the left table + matching rows from the right table.', data_cell),
     Paragraph('Give me ALL employees. If they have a department, show it. If not, show null.', data_cell)],
    [Paragraph('<b>RIGHT JOIN</b>', data_cell),
     Paragraph('Shows ALL rows from the right table + matching rows from the left table.', data_cell),
     Paragraph('Give me ALL departments. If they have employees, show them. If not, show null.', data_cell)],
    [Paragraph('<b>FULL OUTER JOIN</b>', data_cell),
     Paragraph('Shows ALL rows from both tables. Matching + non-matching.', data_cell),
     Paragraph('Give me everything. All employees and all departments, matched or not.', data_cell)],
]

ov_t = Table(overview, colWidths=[AW*0.20, AW*0.38, AW*0.42])
ov_t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), ACCENT),
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('LEFTPADDING', (0,0), (-1,-1), 6),
    ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ('TOPPADDING', (0,0), (-1,-1), 4),
    ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ('GRID', (0,0), (-1,-1), 0.3, colors.HexColor('#cccccc')),
    ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, LIGHT_BG]),
]))
story.append(ov_t)

story.append(Spacer(1, 8))

# Important tip
tip_box = [[Paragraph(
    '<b>Remember:</b><br/>'
    '- "Left" table = the table you write first (after FROM)<br/>'
    '- "Right" table = the table you write second (after JOIN)<br/>'
    '- "Match" = the join condition (ON ... = ...)',
    tip_style)]]
tb_table = Table(tip_box, colWidths=[AW*0.98])
tb_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), YELLOW_BG),
    ('LEFTPADDING', (0,0), (-1,-1), 8),
    ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ('TOPPADDING', (0,0), (-1,-1), 6),
    ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ('BOX', (0,0), (-1,-1), 0.8, colors.HexColor('#f9a825')),
]))
story.append(tb_table)

story.append(PageBreak())

# ============ INNER JOIN ============
story.append(Paragraph('1. INNER JOIN', h1_style))
story.append(HRFlowable(width="100%", thickness=0.5, color=ACCENT, spaceAfter=4))

story.append(Paragraph('<b>Task:</b>', label_style))
story.append(Paragraph(
    'Show each employee\'s first name, last name, and their department name. '
    'Show only employees who HAVE a department.',
    task_style))

story.append(Spacer(1, 3))
story.append(Paragraph('<b>Step-by-Step:</b>', label_style))
story.append(Paragraph('<b>Step 1:</b> We need data from two tables: EMPLOYEES (for name) and DEPARTMENTS (for department name).', step_style))
story.append(Paragraph('<b>Step 2:</b> The common column is DEPARTMENT_ID. EMPLOYEES.DEPARTMENT_ID must equal DEPARTMENTS.DEPARTMENT_ID.', step_style))
story.append(Paragraph('<b>Step 3:</b> We use table aliases: "e" for EMPLOYEES and "d" for DEPARTMENTS. This makes the query shorter.', step_style))
story.append(Paragraph('<b>Step 4:</b> INNER JOIN shows ONLY rows that match in both tables. Employee 178 (Kimberely) has null department_id, so she will NOT appear in the result. Department 270 (Payroll) has no employees, so it will NOT appear either.', step_style))

story.append(Spacer(1, 3))
story.append(Paragraph('<b>SQL Query:</b>', label_style))
story.append(Paragraph(
    'SELECT e.first_name,<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;e.last_name,<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;d.department_name<br/>'
    'FROM employees e<br/>'
    'INNER JOIN departments d<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ON e.department_id = d.department_id<br/>'
    'ORDER BY e.last_name;',
    sql_style))

story.append(Spacer(1, 4))

# Result preview
story.append(Paragraph('<b>Result (sample):</b>', label_style))
res_inner = [
    [Paragraph('<b>First Name</b>', header_cell), Paragraph('<b>Last Name</b>', header_cell), Paragraph('<b>Department Name</b>', header_cell)],
    [Paragraph('Diana', data_cell), Paragraph('Lorentz', data_cell), Paragraph('IT', data_cell)],
    [Paragraph('Lex', data_cell), Paragraph('De Haan', data_cell), Paragraph('Executive', data_cell)],
    [Paragraph('Neena', data_cell), Paragraph('Kochhar', data_cell), Paragraph('Executive', data_cell)],
    [Paragraph('Steven', data_cell), Paragraph('King', data_cell), Paragraph('Executive', data_cell)],
]
ri_t = Table(res_inner, colWidths=[AW*0.30, AW*0.30, AW*0.40])
ri_t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#4caf50')),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('LEFTPADDING', (0,0), (-1,-1), 4),
    ('RIGHTPADDING', (0,0), (-1,-1), 4),
    ('TOPPADDING', (0,0), (-1,-1), 3),
    ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ('GRID', (0,0), (-1,-1), 0.3, colors.HexColor('#cccccc')),
    ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, GREEN_BG]),
]))
story.append(ri_t)

story.append(Spacer(1, 4))
note1 = [[Paragraph(
    '<b>Note:</b> Employee Kimberely is NOT in the result (she has no department). '
    'Department Payroll is NOT in the result (it has no employees). This is how INNER JOIN works.',
    tip_style)]]
n1_t = Table(note1, colWidths=[AW*0.98])
n1_t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), GREEN_BG),
    ('LEFTPADDING', (0,0), (-1,-1), 8),
    ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ('TOPPADDING', (0,0), (-1,-1), 6),
    ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ('BOX', (0,0), (-1,-1), 0.8, colors.HexColor('#4caf50')),
]))
story.append(n1_t)


# ============ LEFT JOIN ============
story.append(Spacer(1, 10))
story.append(Paragraph('2. LEFT JOIN', h1_style))
story.append(HRFlowable(width="100%", thickness=0.5, color=ACCENT, spaceAfter=4))

story.append(Paragraph('<b>Task:</b>', label_style))
story.append(Paragraph(
    'Show ALL employees and their department name. If an employee has no department, show null.',
    task_style))

story.append(Spacer(1, 3))
story.append(Paragraph('<b>Step-by-Step:</b>', label_style))
story.append(Paragraph('<b>Step 1:</b> EMPLOYEES is the left table (it comes after FROM). DEPARTMENTS is the right table (after JOIN).', step_style))
story.append(Paragraph('<b>Step 2:</b> LEFT JOIN keeps ALL rows from the left table (EMPLOYEES). For matching rows, it shows the department name. For non-matching rows, it shows null.', step_style))
story.append(Paragraph('<b>Step 3:</b> Employee 178 (Kimberely) has null department_id. With LEFT JOIN, she WILL appear in the result, but her department_name will be null.', step_style))
story.append(Paragraph('<b>Step 4:</b> Department 270 (Payroll) still does NOT appear, because it is in the right table and has no matching employees.', step_style))

story.append(Spacer(1, 3))
story.append(Paragraph('<b>SQL Query:</b>', label_style))
story.append(Paragraph(
    'SELECT e.first_name,<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;e.last_name,<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;d.department_name<br/>'
    'FROM employees e<br/>'
    'LEFT JOIN departments d<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ON e.department_id = d.department_id<br/>'
    'ORDER BY e.last_name;',
    sql_style))

story.append(Spacer(1, 4))
story.append(Paragraph('<b>Result (sample):</b>', label_style))
res_left = [
    [Paragraph('<b>First Name</b>', header_cell), Paragraph('<b>Last Name</b>', header_cell), Paragraph('<b>Department Name</b>', header_cell)],
    [Paragraph('Diana', data_cell), Paragraph('Lorentz', data_cell), Paragraph('IT', data_cell)],
    [Paragraph('Kimberely', data_cell), Paragraph('Grant', data_cell), Paragraph('null', ParagraphStyle('Red', fontName='Mono', fontSize=8, leading=10, textColor=colors.HexColor('#e53935')))],
    [Paragraph('Lex', data_cell), Paragraph('De Haan', data_cell), Paragraph('Executive', data_cell)],
    [Paragraph('Neena', data_cell), Paragraph('Kochhar', data_cell), Paragraph('Executive', data_cell)],
    [Paragraph('Steven', data_cell), Paragraph('King', data_cell), Paragraph('Executive', data_cell)],
]
rl_t = Table(res_left, colWidths=[AW*0.30, AW*0.30, AW*0.40])
rl_t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1e88e5')),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('LEFTPADDING', (0,0), (-1,-1), 4),
    ('RIGHTPADDING', (0,0), (-1,-1), 4),
    ('TOPPADDING', (0,0), (-1,-1), 3),
    ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ('GRID', (0,0), (-1,-1), 0.3, colors.HexColor('#cccccc')),
    ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, BLUE_BG]),
    ('BACKGROUND', (1,2), (2,2), RED_BG),
]))
story.append(rl_t)

story.append(Spacer(1, 4))
note2 = [[Paragraph(
    '<b>Note:</b> Kimberely appears now (with null department)! Department Payroll is still missing '
    '(it is in the right table). The red row shows the difference from INNER JOIN.',
    tip_style)]]
n2_t = Table(note2, colWidths=[AW*0.98])
n2_t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), BLUE_BG),
    ('LEFTPADDING', (0,0), (-1,-1), 8),
    ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ('TOPPADDING', (0,0), (-1,-1), 6),
    ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ('BOX', (0,0), (-1,-1), 0.8, colors.HexColor('#1e88e5')),
]))
story.append(n2_t)


# ============ RIGHT JOIN ============
story.append(PageBreak())
story.append(Paragraph('3. RIGHT JOIN', h1_style))
story.append(HRFlowable(width="100%", thickness=0.5, color=ACCENT, spaceAfter=4))

story.append(Paragraph('<b>Task:</b>', label_style))
story.append(Paragraph(
    'Show ALL departments and their employees. If a department has no employees, show null for the employee.',
    task_style))

story.append(Spacer(1, 3))
story.append(Paragraph('<b>Step-by-Step:</b>', label_style))
story.append(Paragraph('<b>Step 1:</b> EMPLOYEES is the left table. DEPARTMENTS is the right table. RIGHT JOIN keeps ALL rows from the right table (DEPARTMENTS).', step_style))
story.append(Paragraph('<b>Step 2:</b> Department 270 (Payroll) has no employees. With RIGHT JOIN, it WILL appear in the result, but the employee columns will be null.', step_style))
story.append(Paragraph('<b>Step 3:</b> Employee 178 (Kimberely) is still missing because she is in the left table and has no matching department.', step_style))

story.append(Spacer(1, 3))
story.append(Paragraph('<b>SQL Query:</b>', label_style))
story.append(Paragraph(
    'SELECT e.first_name,<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;e.last_name,<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;d.department_name<br/>'
    'FROM employees e<br/>'
    'RIGHT JOIN departments d<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ON e.department_id = d.department_id<br/>'
    'ORDER BY d.department_name;',
    sql_style))

story.append(Spacer(1, 4))
story.append(Paragraph('<b>Result (sample):</b>', label_style))
res_right = [
    [Paragraph('<b>First Name</b>', header_cell), Paragraph('<b>Last Name</b>', header_cell), Paragraph('<b>Department Name</b>', header_cell)],
    [Paragraph('Lex', data_cell), Paragraph('De Haan', data_cell), Paragraph('Executive', data_cell)],
    [Paragraph('Neena', data_cell), Paragraph('Kochhar', data_cell), Paragraph('Executive', data_cell)],
    [Paragraph('Steven', data_cell), Paragraph('King', data_cell), Paragraph('Executive', data_cell)],
    [Paragraph('Diana', data_cell), Paragraph('Lorentz', data_cell), Paragraph('IT', data_cell)],
    [Paragraph('null', ParagraphStyle('Red2', fontName='Mono', fontSize=8, leading=10, textColor=colors.HexColor('#e53935'))),
     Paragraph('null', ParagraphStyle('Red3', fontName='Mono', fontSize=8, leading=10, textColor=colors.HexColor('#e53935'))),
     Paragraph('Payroll', data_cell)],
]
rr_t = Table(res_right, colWidths=[AW*0.30, AW*0.30, AW*0.40])
rr_t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#e65100')),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('LEFTPADDING', (0,0), (-1,-1), 4),
    ('RIGHTPADDING', (0,0), (-1,-1), 4),
    ('TOPPADDING', (0,0), (-1,-1), 3),
    ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ('GRID', (0,0), (-1,-1), 0.3, colors.HexColor('#cccccc')),
    ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, YELLOW_BG]),
    ('BACKGROUND', (0,5), (1,5), RED_BG),
]))
story.append(rr_t)

story.append(Spacer(1, 4))
note3 = [[Paragraph(
    '<b>Note:</b> Payroll appears now (with null employees)! Kimberely is still missing. '
    'RIGHT JOIN = opposite of LEFT JOIN.',
    tip_style)]]
n3_t = Table(note3, colWidths=[AW*0.98])
n3_t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), YELLOW_BG),
    ('LEFTPADDING', (0,0), (-1,-1), 8),
    ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ('TOPPADDING', (0,0), (-1,-1), 6),
    ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ('BOX', (0,0), (-1,-1), 0.8, colors.HexColor('#f9a825')),
]))
story.append(n3_t)


# ============ FULL OUTER JOIN ============
story.append(Spacer(1, 10))
story.append(Paragraph('4. FULL OUTER JOIN', h1_style))
story.append(HRFlowable(width="100%", thickness=0.5, color=ACCENT, spaceAfter=4))

story.append(Paragraph('<b>Task:</b>', label_style))
story.append(Paragraph(
    'Show ALL employees and ALL departments. Matched pairs show both names. '
    'Unmatched employees show null department. Unmatched departments show null employee.',
    task_style))

story.append(Spacer(1, 3))
story.append(Paragraph('<b>Step-by-Step:</b>', label_style))
story.append(Paragraph('<b>Step 1:</b> FULL OUTER JOIN shows everything. All rows from both tables. Nothing is left out.', step_style))
story.append(Paragraph('<b>Step 2:</b> Kimberely (no department) appears with null department_name.', step_style))
story.append(Paragraph('<b>Step 3:</b> Payroll (no employees) appears with null employee names.', step_style))
story.append(Paragraph('<b>Step 4:</b> All other matched rows appear normally, like in INNER JOIN.', step_style))

story.append(Spacer(1, 3))
story.append(Paragraph('<b>SQL Query:</b>', label_style))
story.append(Paragraph(
    'SELECT e.first_name,<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;e.last_name,<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;d.department_name<br/>'
    'FROM employees e<br/>'
    'FULL OUTER JOIN departments d<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ON e.department_id = d.department_id<br/>'
    'ORDER BY d.department_name, e.last_name;',
    sql_style))

story.append(Spacer(1, 4))
story.append(Paragraph('<b>Result (sample):</b>', label_style))
res_full = [
    [Paragraph('<b>First Name</b>', header_cell), Paragraph('<b>Last Name</b>', header_cell), Paragraph('<b>Department Name</b>', header_cell)],
    [Paragraph('Lex', data_cell), Paragraph('De Haan', data_cell), Paragraph('Executive', data_cell)],
    [Paragraph('Neena', data_cell), Paragraph('Kochhar', data_cell), Paragraph('Executive', data_cell)],
    [Paragraph('Steven', data_cell), Paragraph('King', data_cell), Paragraph('Executive', data_cell)],
    [Paragraph('Diana', data_cell), Paragraph('Lorentz', data_cell), Paragraph('IT', data_cell)],
    [Paragraph('null', ParagraphStyle('R4', fontName='Mono', fontSize=8, leading=10, textColor=colors.HexColor('#e53935'))),
     Paragraph('null', ParagraphStyle('R5', fontName='Mono', fontSize=8, leading=10, textColor=colors.HexColor('#e53935'))),
     Paragraph('Payroll', data_cell)],
    [Paragraph('Kimberely', data_cell), Paragraph('Grant', data_cell),
     Paragraph('null', ParagraphStyle('R6', fontName='Mono', fontSize=8, leading=10, textColor=colors.HexColor('#e53935')))],
]
rf_t = Table(res_full, colWidths=[AW*0.30, AW*0.30, AW*0.40])
rf_t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#7b1fa2')),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('LEFTPADDING', (0,0), (-1,-1), 4),
    ('RIGHTPADDING', (0,0), (-1,-1), 4),
    ('TOPPADDING', (0,0), (-1,-1), 3),
    ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ('GRID', (0,0), (-1,-1), 0.3, colors.HexColor('#cccccc')),
    ('BACKGROUND', (0,5), (1,5), RED_BG),
    ('BACKGROUND', (2,6), (2,6), RED_BG),
]))
story.append(rf_t)

story.append(Spacer(1, 4))
note4 = [[Paragraph(
    '<b>Note:</b> EVERYTHING appears! Kimberely, Payroll, and all matched rows. '
    'FULL OUTER JOIN = INNER JOIN + LEFT JOIN unmatched + RIGHT JOIN unmatched.',
    tip_style)]]
n4_t = Table(note4, colWidths=[AW*0.98])
n4_t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f3e5f5')),
    ('LEFTPADDING', (0,0), (-1,-1), 8),
    ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ('TOPPADDING', (0,0), (-1,-1), 6),
    ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ('BOX', (0,0), (-1,-1), 0.8, colors.HexColor('#7b1fa2')),
]))
story.append(n4_t)


# ============ SUMMARY TABLE ============
story.append(PageBreak())
story.append(Paragraph('Quick Summary', h1_style))
story.append(HRFlowable(width="100%", thickness=0.5, color=ACCENT, spaceAfter=4))

summary = [
    [Paragraph('<b>JOIN Type</b>', header_cell),
     Paragraph('<b>Kimberely<br/>(no dept)</b>', header_cell),
     Paragraph('<b>Payroll dept<br/>(no employees)</b>', header_cell),
     Paragraph('<b>Matched rows<br/>(e.g. Steven)</b>', header_cell)],
    [Paragraph('INNER JOIN', data_cell), Paragraph('NO', data_cell), Paragraph('NO', data_cell), Paragraph('YES', data_cell)],
    [Paragraph('LEFT JOIN', data_cell), Paragraph('YES', data_cell), Paragraph('NO', data_cell), Paragraph('YES', data_cell)],
    [Paragraph('RIGHT JOIN', data_cell), Paragraph('NO', data_cell), Paragraph('YES', data_cell), Paragraph('YES', data_cell)],
    [Paragraph('FULL OUTER JOIN', data_cell), Paragraph('YES', data_cell), Paragraph('YES', data_cell), Paragraph('YES', data_cell)],
]

sum_t = Table(summary, colWidths=[AW*0.25, AW*0.25, AW*0.25, AW*0.25])
sum_t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), ACCENT),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('LEFTPADDING', (0,0), (-1,-1), 6),
    ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ('TOPPADDING', (0,0), (-1,-1), 4),
    ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ('GRID', (0,0), (-1,-1), 0.3, colors.HexColor('#cccccc')),
    ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, LIGHT_BG]),
    ('ALIGN', (1,1), (-1,-1), 'CENTER'),
]))
story.append(sum_t)

story.append(Spacer(1, 10))

# WHEN TO USE
story.append(Paragraph('When to Use Which JOIN?', h2_style))
story.append(HRFlowable(width="100%", thickness=0.3, color=ACCENT, spaceAfter=4))

when_data = [
    [Paragraph('<b>Situation</b>', header_cell), Paragraph('<b>Use This JOIN</b>', header_cell)],
    [Paragraph('I only want employees who have a department.', data_cell), Paragraph('INNER JOIN', data_cell)],
    [Paragraph('I want ALL employees, even those with no department.', data_cell), Paragraph('LEFT JOIN', data_cell)],
    [Paragraph('I want ALL departments, even those with no employees.', data_cell), Paragraph('RIGHT JOIN', data_cell)],
    [Paragraph('I want everything from both tables.', data_cell), Paragraph('FULL OUTER JOIN', data_cell)],
]
w_t = Table(when_data, colWidths=[AW*0.60, AW*0.40])
w_t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), ACCENT),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('LEFTPADDING', (0,0), (-1,-1), 6),
    ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ('TOPPADDING', (0,0), (-1,-1), 4),
    ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ('GRID', (0,0), (-1,-1), 0.3, colors.HexColor('#cccccc')),
    ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, LIGHT_BG]),
]))
story.append(w_t)

story.append(Spacer(1, 10))

# TIP: Table alias
tip_final = [[Paragraph(
    '<b>Useful Tip - Table Aliases:</b><br/>'
    'Always use short aliases for table names in JOINs:<br/>'
    '- employees e (short and easy)<br/>'
    '- departments d<br/><br/>'
    'Then use the alias before column names:<br/>'
    '- e.first_name (from employees)<br/>'
    '- d.department_name (from departments)<br/><br/>'
    'If two tables have a column with the same name (like department_id), '
    'you MUST use the alias: e.department_id, d.department_id.',
    tip_style)]]
tf_t = Table(tip_final, colWidths=[AW*0.98])
tf_t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), BLUE_BG),
    ('LEFTPADDING', (0,0), (-1,-1), 8),
    ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ('TOPPADDING', (0,0), (-1,-1), 6),
    ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ('BOX', (0,0), (-1,-1), 0.8, ACCENT),
]))
story.append(tf_t)


# -- Build --
doc.build(story)

import os
from pypdf import PdfReader
r = PdfReader(OUTPUT)
print(f"PDF: {OUTPUT} ({os.path.getsize(OUTPUT)/1024:.1f} KB, {len(r.pages)} pages)")
