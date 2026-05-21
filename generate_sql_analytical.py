#!/usr/bin/env python3
"""
SQL Analytical Tasks - Step by Step Guide for Tank54
5 Examples + 15 Practice Exercises | A1 English | Oracle HR Schema
Only topics covered: SELECT, WHERE, ORDER BY, Aggregate, GROUP BY, HAVING, CASE WHEN
NO JOINS, NO Subqueries (not covered yet!)
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm, mm
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, KeepTogether, PageBreak
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

W, H = A4
LM, RM, TM, BM = 1.5*cm, 1.5*cm, 1.2*cm, 1.2*cm
AW = W - LM - RM

OUTPUT = '/home/z/my-project/download/SQL_Analytical_Tasks_Tank54.pdf'
doc = SimpleDocTemplate(OUTPUT, pagesize=A4, leftMargin=LM, rightMargin=RM, topMargin=TM, bottomMargin=BM)

story = []

# ============ COVER ============
story.append(Spacer(1, 3*cm))
story.append(Paragraph('SQL Analytical Tasks', title_style))
story.append(Paragraph('Step-by-Step Guide', subtitle_style))
story.append(Spacer(1, 0.5*cm))
story.append(HRFlowable(width="60%", thickness=1.5, color=ACCENT, spaceAfter=6))
story.append(Paragraph('Tank54 Group | Oracle HR Schema', ParagraphStyle('Sub2', fontName='Cal', fontSize=10, leading=13, textColor=MUTED, alignment=TA_CENTER, spaceAfter=4)))
story.append(Spacer(1, 1*cm))
story.append(Paragraph('What is in this book?', ParagraphStyle('Q', fontName='CalB', fontSize=11, leading=14, textColor=DARK, alignment=TA_CENTER, spaceAfter=4)))
story.append(Paragraph(
    'This guide has two parts. <b>Part 1</b> shows 5 examples. Each example has a task, '
    'step-by-step explanation, and the SQL query. <b>Part 2</b> has 15 practice tasks for you to solve.',
    ParagraphStyle('CoverBody', fontName='Cal', fontSize=9.5, leading=14, textColor=DARK, alignment=TA_CENTER, leftIndent=1.5*cm, rightIndent=1.5*cm)
))
story.append(Spacer(1, 0.8*cm))
story.append(Paragraph(
    'Topics: SELECT, WHERE, ORDER BY, Aggregate Functions, GROUP BY, HAVING, CASE WHEN',
    ParagraphStyle('Topics', fontName='CalI', fontSize=9, leading=12, textColor=MUTED, alignment=TA_CENTER)
))

story.append(PageBreak())

# ============ EMPLOYEES TABLE ============
story.append(Paragraph('Oracle HR Schema - EMPLOYEES Table', h1_style))
story.append(HRFlowable(width="100%", thickness=0.5, color=ACCENT, spaceAfter=4))
story.append(Paragraph(
    'We use the Oracle HR database. For all tasks in this guide, we use only the <b>EMPLOYEES</b> table. '
    'This table has information about every employee in the company.',
    body_style))
story.append(Spacer(1, 4))

cols = [
    ['Column', 'Type', 'Example', 'Description'],
    ['EMPLOYEE_ID', 'Number', '100', 'Unique ID for each employee'],
    ['FIRST_NAME', 'Text', 'Steven', 'First name of the employee'],
    ['LAST_NAME', 'Text', 'King', 'Last name of the employee'],
    ['EMAIL', 'Text', 'SKING', 'Email of the employee'],
    ['PHONE_NUMBER', 'Text', '515.123.4567', 'Phone number'],
    ['HIRE_DATE', 'Date', '17-JUN-03', 'Date when the employee started'],
    ['JOB_ID', 'Text', 'AD_PRES', 'Job role code'],
    ['SALARY', 'Number', '24000', 'Monthly salary'],
    ['COMMISSION_PCT', 'Number', '0.3', 'Commission percent (some jobs)'],
    ['MANAGER_ID', 'Number', '(null)', 'ID of the employee\'s manager'],
    ['DEPARTMENT_ID', 'Number', '90', 'ID of the department'],
]
tc = []
for i, row in enumerate(cols):
    if i == 0:
        tc.append([Paragraph(f'<b>{c}</b>', ParagraphStyle('TH2', fontName='CalB', fontSize=8, leading=10, textColor=WHITE)) for c in row])
    else:
        tc.append([Paragraph(c, ParagraphStyle('TD2', fontName='Mono' if c.isupper() else 'Cal', fontSize=8, leading=10, textColor=DARK)) for c in row])
tc_t = Table(tc, colWidths=[AW*0.22, AW*0.12, AW*0.22, AW*0.44])
tc_t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), ACCENT),
    ('TEXTCOLOR', (0,0), (-1,0), WHITE),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('LEFTPADDING', (0,0), (-1,-1), 5),
    ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ('TOPPADDING', (0,0), (-1,-1), 3),
    ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, LIGHT_BG]),
    ('GRID', (0,0), (-1,-1), 0.3, colors.HexColor('#cccccc')),
]))
story.append(tc_t)

story.append(Spacer(1, 8))

# ============ KEY CONCEPTS REMINDER ============
story.append(Paragraph('Quick Reminder - Key Concepts', h2_style))
story.append(HRFlowable(width="100%", thickness=0.3, color=ACCENT, spaceAfter=3))

concepts = [
    ['Concept', 'What it does', 'Example'],
    ['COUNT(*)', 'Counts rows', 'SELECT COUNT(*) FROM employees'],
    ['SUM(column)', 'Adds all values', 'SELECT SUM(salary) FROM employees'],
    ['AVG(column)', 'Calculates average', 'SELECT AVG(salary) FROM employees'],
    ['MIN(column)', 'Finds smallest value', 'SELECT MIN(salary) FROM employees'],
    ['MAX(column)', 'Finds largest value', 'SELECT MAX(salary) FROM employees'],
    ['GROUP BY', 'Groups rows by a column', 'GROUP BY department_id'],
    ['HAVING', 'Filters after GROUP BY', 'HAVING COUNT(*) > 5'],
    ['WHERE', 'Filters rows before grouping', 'WHERE salary > 10000'],
    ['ORDER BY', 'Sorts the result', 'ORDER BY salary DESC'],
    ['CASE WHEN', 'Conditional logic', 'CASE WHEN salary > 10000 THEN \'High\' ELSE \'Low\' END'],
]

cc = []
for i, row in enumerate(concepts):
    if i == 0:
        cc.append([Paragraph(f'<b>{c}</b>', ParagraphStyle('TH3', fontName='CalB', fontSize=7.5, leading=10, textColor=WHITE)) for c in row])
    else:
        cc.append([Paragraph(c, ParagraphStyle('TD3', fontName='Mono' if j == 0 else ('Mono' if '(' in c else 'Cal'), fontSize=7.5, leading=10, textColor=DARK)) for j, c in enumerate(row)])
cc_t = Table(cc, colWidths=[AW*0.18, AW*0.34, AW*0.48])
cc_t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), ACCENT),
    ('TEXTCOLOR', (0,0), (-1,0), WHITE),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('LEFTPADDING', (0,0), (-1,-1), 5),
    ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ('TOPPADDING', (0,0), (-1,-1), 3),
    ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ('GRID', (0,0), (-1,-1), 0.3, colors.HexColor('#cccccc')),
]))
story.append(cc_t)

story.append(PageBreak())

# ============ PART 1: EXAMPLES (NO JOINS) ============
story.append(Paragraph('PART 1: Examples', h1_style))
story.append(HRFlowable(width="100%", thickness=0.5, color=ACCENT, spaceAfter=4))
story.append(Paragraph(
    'In this part, we show 5 examples. Each example has 3 parts: the task, the steps, and the SQL query. '
    'Read each step carefully. Try to understand the logic before you look at the SQL code. '
    'All examples use only the EMPLOYEES table. No JOINs are used.',
    body_style))

# ---------- EXAMPLE 1 ----------
story.append(Spacer(1, 6))
story.append(Paragraph('Example 1: Employee Count by Department', h2_style))
story.append(HRFlowable(width="100%", thickness=0.3, color=ACCENT, spaceAfter=3))

story.append(Paragraph('<b>Task:</b>', label_style))
story.append(Paragraph(
    'Count how many employees work in each department. Show department ID and the count. '
    'Show only departments with more than 5 employees.',
    task_style))

story.append(Spacer(1, 3))
story.append(Paragraph('<b>Step-by-Step:</b>', label_style))
story.append(Paragraph('<b>Step 1:</b> What do we want to count? Employees in each department. So we need COUNT(*) to count rows.', step_style))
story.append(Paragraph('<b>Step 2:</b> We need to count by department, so we use GROUP BY department_id. This puts employees into groups by their department.', step_style))
story.append(Paragraph('<b>Step 3:</b> We only want departments with more than 5 employees. Because 5 is about the COUNT result, we use HAVING (not WHERE).', step_style))
story.append(Paragraph('<b>Step 4:</b> Remember: WHERE filters rows before grouping. HAVING filters groups after grouping.', step_style))

story.append(Spacer(1, 3))
story.append(Paragraph('<b>SQL Query:</b>', label_style))
story.append(Paragraph(
    'SELECT department_id,<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;COUNT(*) AS employee_count<br/>'
    'FROM employees<br/>'
    'GROUP BY department_id<br/>'
    'HAVING COUNT(*) &gt; 5<br/>'
    'ORDER BY employee_count DESC;',
    sql_style))

# ---------- EXAMPLE 2 ----------
story.append(Spacer(1, 6))
story.append(Paragraph('Example 2: Average, Min and Max Salary', h2_style))
story.append(HRFlowable(width="100%", thickness=0.3, color=ACCENT, spaceAfter=3))

story.append(Paragraph('<b>Task:</b>', label_style))
story.append(Paragraph(
    'Find the average, minimum, and maximum salary for each job. Show job ID and all three values. '
    'Order by average salary from high to low.',
    task_style))

story.append(Spacer(1, 3))
story.append(Paragraph('<b>Step-by-Step:</b>', label_style))
story.append(Paragraph('<b>Step 1:</b> We need three aggregate functions: AVG(salary), MIN(salary), and MAX(salary). All three work on the SALARY column.', step_style))
story.append(Paragraph('<b>Step 2:</b> We want these values for each job, so we use GROUP BY job_id.', step_style))
story.append(Paragraph('<b>Step 3:</b> We use ROUND() to make the average salary show only 2 decimal places. This makes the result cleaner.', step_style))
story.append(Paragraph('<b>Step 4:</b> We order by the average salary in DESC order (high to low). We can use the alias "avg_sal" in ORDER BY.', step_style))

story.append(Spacer(1, 3))
story.append(Paragraph('<b>SQL Query:</b>', label_style))
story.append(Paragraph(
    'SELECT job_id,<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ROUND(AVG(salary), 2) AS avg_sal,<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MIN(salary) AS min_sal,<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MAX(salary) AS max_sal<br/>'
    'FROM employees<br/>'
    'GROUP BY job_id<br/>'
    'ORDER BY avg_sal DESC;',
    sql_style))

# ---------- EXAMPLE 3 ----------
story.append(Spacer(1, 6))
story.append(Paragraph('Example 3: Employees with Salary in a Range', h2_style))
story.append(HRFlowable(width="100%", thickness=0.3, color=ACCENT, spaceAfter=3))

story.append(Paragraph('<b>Task:</b>', label_style))
story.append(Paragraph(
    'Find all employees whose salary is between 5000 and 15000. Show their full name, job ID, and salary. '
    'Order by salary from high to low.',
    task_style))

story.append(Spacer(1, 3))
story.append(Paragraph('<b>Step-by-Step:</b>', label_style))
story.append(Paragraph('<b>Step 1:</b> We need a range filter: salary must be between 5000 and 15000. We can use BETWEEN for this.', step_style))
story.append(Paragraph('<b>Step 2:</b> BETWEEN includes both numbers. So salary >= 5000 AND salary <= 1500. This is the same as BETWEEN 5000 AND 15000.', step_style))
story.append(Paragraph('<b>Step 3:</b> We need the full name. We use || to join first_name and last_name with a space in between.', step_style))
story.append(Paragraph('<b>Step 4:</b> We also want the job_id column to see what job each employee has.', step_style))

story.append(Spacer(1, 3))
story.append(Paragraph('<b>SQL Query:</b>', label_style))
story.append(Paragraph(
    'SELECT first_name || \' \' || last_name AS employee_name,<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;job_id,<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;salary<br/>'
    'FROM employees<br/>'
    'WHERE salary BETWEEN 5000 AND 15000<br/>'
    'ORDER BY salary DESC;',
    sql_style))

# ---------- EXAMPLE 4 ----------
story.append(Spacer(1, 6))
story.append(Paragraph('Example 4: Salary Ranges - Counting Groups', h2_style))
story.append(HRFlowable(width="100%", thickness=0.3, color=ACCENT, spaceAfter=3))

story.append(Paragraph('<b>Task:</b>', label_style))
story.append(Paragraph(
    'Put employees into 3 salary groups: Low (salary &lt; 5000), Medium (5000 to 10000), High (&gt; 10000). '
    'Count how many employees are in each group.',
    task_style))

story.append(Spacer(1, 3))
story.append(Paragraph('<b>Step-by-Step:</b>', label_style))
story.append(Paragraph('<b>Step 1:</b> We need to create a group label for each employee based on their salary. We use CASE WHEN for this.', step_style))
story.append(Paragraph('<b>Step 2:</b> CASE WHEN salary &lt; 5000 THEN \'Low\' WHEN salary &lt;= 10000 THEN \'Medium\' ELSE \'High\' END. The conditions check from top to bottom.', step_style))
story.append(Paragraph('<b>Step 3:</b> To group by the CASE result, we write the full CASE expression in GROUP BY (not the alias). In Oracle, we can use the alias in ORDER BY.', step_style))
story.append(Paragraph('<b>Step 4:</b> COUNT(*) counts the rows in each group. We order the result by count from high to low.', step_style))

story.append(Spacer(1, 3))
story.append(Paragraph('<b>SQL Query:</b>', label_style))
story.append(Paragraph(
    'SELECT CASE<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;WHEN salary &lt; 5000 THEN \'Low\'<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;WHEN salary &lt;= 10000 THEN \'Medium\'<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ELSE \'High\'<br/>'
    'END AS salary_group,<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;COUNT(*) AS employee_count<br/>'
    'FROM employees<br/>'
    'GROUP BY CASE<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;WHEN salary &lt; 5000 THEN \'Low\'<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;WHEN salary &lt;= 10000 THEN \'Medium\'<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ELSE \'High\'<br/>'
    'END<br/>'
    'ORDER BY employee_count DESC;',
    sql_style))

# ---------- EXAMPLE 5 ----------
story.append(Spacer(1, 6))
story.append(Paragraph('Example 5: Total Salary Cost per Department', h2_style))
story.append(HRFlowable(width="100%", thickness=0.3, color=ACCENT, spaceAfter=3))

story.append(Paragraph('<b>Task:</b>', label_style))
story.append(Paragraph(
    'Find the total salary cost for each department. Also find how many employees work in each department. '
    'Show department ID, employee count, and total salary. Order by total salary from high to low.',
    task_style))

story.append(Spacer(1, 3))
story.append(Paragraph('<b>Step-by-Step:</b>', label_style))
story.append(Paragraph('<b>Step 1:</b> We need two things: the count of employees and the sum of salaries. We use COUNT(*) and SUM(salary).', step_style))
story.append(Paragraph('<b>Step 2:</b> We group by department_id because we want these numbers for each department.', step_style))
story.append(Paragraph('<b>Step 3:</b> We exclude departments with no employees by checking department_id IS NOT NULL in the WHERE clause.', step_style))
story.append(Paragraph('<b>Step 4:</b> We order by the total salary (SUM result) from high to low to see which department costs the most.', step_style))

story.append(Spacer(1, 3))
story.append(Paragraph('<b>SQL Query:</b>', label_style))
story.append(Paragraph(
    'SELECT department_id,<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;COUNT(*) AS employee_count,<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SUM(salary) AS total_salary<br/>'
    'FROM employees<br/>'
    'WHERE department_id IS NOT NULL<br/>'
    'GROUP BY department_id<br/>'
    'ORDER BY total_salary DESC;',
    sql_style))

story.append(PageBreak())

# ============ PART 2: PRACTICE TASKS (NO JOINS) ============
story.append(Paragraph('PART 2: Practice Tasks', h1_style))
story.append(HRFlowable(width="100%", thickness=0.5, color=ACCENT, spaceAfter=4))
story.append(Paragraph(
    'Now it is your turn! Solve these 15 tasks. Write your SQL queries on paper or in a database tool. '
    'Use only the EMPLOYEES table. No JOINs are needed. Good luck!',
    body_style))

tasks = [
    {
        'num': 1,
        'title': 'Total Salary Cost of the Company',
        'text': 'Find the total salary cost of the whole company. This means: add up all employee salaries. Show the total as one number.',
        'topic': 'SUM',
    },
    {
        'num': 2,
        'title': 'How Many Employees in the Company?',
        'text': 'Count the total number of employees in the company. Show the count as one number.',
        'topic': 'COUNT',
    },
    {
        'num': 3,
        'title': 'Salary Statistics',
        'text': 'Find the average, minimum, and maximum salary in the whole company. Show all three values in one result.',
        'topic': 'AVG + MIN + MAX',
    },
    {
        'num': 4,
        'title': 'Employee Count by Department',
        'text': 'Count how many employees are in each department. Show department ID and the count. Order by count from high to low.',
        'topic': 'GROUP BY + COUNT',
    },
    {
        'num': 5,
        'title': 'Average Salary by Job',
        'text': 'Find the average salary for each job ID. Show job ID and average salary (round to 2 decimals). Order by average salary from high to low.',
        'topic': 'GROUP BY + AVG + ORDER BY',
    },
    {
        'num': 6,
        'title': 'Departments with More Than 10 Employees',
        'text': 'Find departments that have more than 10 employees. Show department ID and the count. Order by count from high to low.',
        'topic': 'GROUP BY + HAVING + COUNT',
    },
    {
        'num': 7,
        'title': 'High-Earning Jobs',
        'text': 'Find jobs where the average salary is more than 10000. Show job ID and average salary. Order by average salary from high to low.',
        'topic': 'GROUP BY + HAVING + AVG',
    },
    {
        'num': 8,
        'title': 'Employees with High Salary',
        'text': 'Find all employees whose salary is more than 15000. Show their full name, job ID, and salary. Order by salary from high to low.',
        'topic': 'WHERE + ORDER BY',
    },
    {
        'num': 9,
        'title': 'Commission vs No-Commission Employees',
        'text': 'Count how many employees have a commission and how many do not. Use CASE WHEN to create two groups: Has Commission and No Commission. Show both counts.',
        'topic': 'CASE WHEN + COUNT',
    },
    {
        'num': 10,
        'title': 'Employees Hired in a Specific Year',
        'text': 'Find all employees who were hired in the year 2005. Show their full name, hire date, and salary. Order by hire date from old to new.',
        'topic': 'WHERE + Date Filter + ORDER BY',
    },
    {
        'num': 11,
        'title': 'Commission Employees',
        'text': 'Find all employees who have a commission (commission_pct is not null). Count how many such employees exist. Show the count.',
        'topic': 'WHERE IS NOT NULL + COUNT',
    },
    {
        'num': 12,
        'title': 'Salary Ranges - Low, Medium, High',
        'text': 'Group employees into 3 salary ranges: Low (less than 5000), Medium (5000 to 10000), High (more than 10000). Count how many employees are in each range. Use CASE WHEN.',
        'topic': 'CASE WHEN + GROUP BY + COUNT',
    },
    {
        'num': 13,
        'title': 'Employees per Manager',
        'text': 'Count how many employees each manager has. Show manager ID and the count. Show only managers who have more than 5 employees. Order by count from high to low.',
        'topic': 'GROUP BY + HAVING + COUNT',
    },
    {
        'num': 14,
        'title': 'Highest Salary per Department',
        'text': 'Find the highest salary in each department. Show department ID and the maximum salary. Order by maximum salary from high to low.',
        'topic': 'GROUP BY + MAX + ORDER BY',
    },
    {
        'num': 15,
        'title': 'Departments with Highest and Lowest Salary Gap',
        'text': 'For each department, find the difference between the highest and lowest salary. Show department ID and the salary gap. Show only departments where the gap is more than 8000. Order by gap from big to small.',
        'topic': 'GROUP BY + MAX - MIN + HAVING',
    },
]

for t in tasks:
    story.append(Spacer(1, 4))
    task_header = [
        [Paragraph(f'<b>Task {t["num"]}</b>', ParagraphStyle('TH3', fontName='CalB', fontSize=9, leading=12, textColor=WHITE)),
         Paragraph(f'{t["title"]}', ParagraphStyle('TH4', fontName='CalB', fontSize=9, leading=12, textColor=WHITE)),
         Paragraph(f'{t["topic"]}', ParagraphStyle('TH5', fontName='CalI', fontSize=8, leading=10, textColor=WHITE))]
    ]
    th_table = Table(task_header, colWidths=[AW*0.12, AW*0.48, AW*0.40])
    th_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), ACCENT),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(th_table)

    task_body = [[Paragraph(t['text'], ParagraphStyle('TaskBody', fontName='Cal', fontSize=9, leading=12.5, textColor=DARK))]]
    tb_table = Table(task_body, colWidths=[AW*1.0])
    tb_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_BG),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('BOX', (0,0), (-1,-1), 0.5, ACCENT),
    ]))
    story.append(tb_table)


# -- Build --
doc.build(story)

import os
from pypdf import PdfReader
r = PdfReader(OUTPUT)
print(f"PDF: {OUTPUT} ({os.path.getsize(OUTPUT)/1024:.1f} KB, {len(r.pages)} pages)")
