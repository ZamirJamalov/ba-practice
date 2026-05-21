#!/usr/bin/env python3
"""
SQL Analytical Tasks - Step by Step Guide for Tank54
5 Examples + 15 Practice Exercises | A1 English | Oracle HR Schema
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
STEP_NUM = colors.HexColor('#1a6b7a')
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
bullet_style = ParagraphStyle('Bullet', fontName='Cal', fontSize=9, leading=12, textColor=DARK, leftIndent=14, bulletIndent=0, spaceAfter=1.5)
task_style = ParagraphStyle('Task', fontName='Cal', fontSize=9, leading=12.5, textColor=DARK, leftIndent=6, spaceAfter=1)
label_style = ParagraphStyle('Label', fontName='CalI', fontSize=8, leading=10, textColor=MUTED, spaceAfter=1)
num_style = ParagraphStyle('Num', fontName='CalB', fontSize=9, leading=12, textColor=ACCENT, spaceAfter=1)

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
    'Topics: SELECT, WHERE, JOINs, GROUP BY, HAVING, Aggregate Functions, Subqueries, ORDER BY',
    ParagraphStyle('Topics', fontName='CalI', fontSize=9, leading=12, textColor=MUTED, alignment=TA_CENTER)
))

story.append(PageBreak())

# ============ ORACLE HR SCHEMA TABLES ============
story.append(Paragraph('Oracle HR Schema - Tables', h1_style))
story.append(HRFlowable(width="100%", thickness=0.5, color=ACCENT, spaceAfter=4))
story.append(Paragraph(
    'We use the Oracle HR database. This database has information about employees, departments, jobs, and salaries. '
    'Here are the main tables we use in this guide.',
    body_style))
story.append(Spacer(1, 4))

tables_info = [
    ['Table Name', 'What is inside?'],
    ['EMPLOYEES', 'Employee ID, first name, last name, email, phone, hire date, job, salary, manager, department'],
    ['DEPARTMENTS', 'Department ID, department name, location, manager'],
    ['JOBS', 'Job ID, job title, min salary, max salary'],
    ['JOB_HISTORY', 'Employee, start date, end date, job, department'],
    ['LOCATIONS', 'Location ID, street address, city, country'],
]

t_data = []
for i, row in enumerate(tables_info):
    if i == 0:
        t_data.append([Paragraph(f'<b>{c}</b>', ParagraphStyle('TH', fontName='CalB', fontSize=8.5, leading=11, textColor=WHITE)) for c in row])
    else:
        t_data.append([Paragraph(c, ParagraphStyle('TD1', fontName='Mono' if c.isupper() else 'Cal', fontSize=8.5, leading=11, textColor=DARK)) for c in row])

t = Table(t_data, colWidths=[AW*0.22, AW*0.78])
t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), ACCENT),
    ('TEXTCOLOR', (0,0), (-1,0), WHITE),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('LEFTPADDING', (0,0), (-1,-1), 6),
    ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ('TOPPADDING', (0,0), (-1,-1), 4),
    ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, LIGHT_BG]),
    ('GRID', (0,0), (-1,-1), 0.3, colors.HexColor('#cccccc')),
]))
story.append(t)
story.append(Spacer(1, 8))

story.append(Paragraph('Important Columns in EMPLOYEES table:', h3_style))
cols = [
    ['Column', 'Type', 'Example'],
    ['EMPLOYEE_ID', 'Number', '100'],
    ['FIRST_NAME', 'Text', 'Steven'],
    ['LAST_NAME', 'Text', 'King'],
    ['HIRE_DATE', 'Date', '17-JUN-03'],
    ['JOB_ID', 'Text', 'AD_PRES'],
    ['SALARY', 'Number', '24000'],
    ['DEPARTMENT_ID', 'Number', '90'],
    ['MANAGER_ID', 'Number', '(null or number)'],
]
tc = []
for i, row in enumerate(cols):
    if i == 0:
        tc.append([Paragraph(f'<b>{c}</b>', ParagraphStyle('TH2', fontName='CalB', fontSize=8, leading=10, textColor=WHITE)) for c in row])
    else:
        tc.append([Paragraph(c, ParagraphStyle('TD2', fontName='Mono' if c.isupper() else 'Cal', fontSize=8, leading=10, textColor=DARK)) for c in row])
tc_t = Table(tc, colWidths=[AW*0.3, AW*0.2, AW*0.5])
tc_t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), ACCENT),
    ('TEXTCOLOR', (0,0), (-1,0), WHITE),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('LEFTPADDING', (0,0), (-1,-1), 6),
    ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ('TOPPADDING', (0,0), (-1,-1), 3),
    ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ('GRID', (0,0), (-1,-1), 0.3, colors.HexColor('#cccccc')),
]))
story.append(tc_t)

story.append(PageBreak())

# ============ PART 1: EXAMPLES ============
story.append(Paragraph('PART 1: Examples', h1_style))
story.append(HRFlowable(width="100%", thickness=0.5, color=ACCENT, spaceAfter=4))
story.append(Paragraph(
    'In this part, we show 5 examples. Each example has 3 parts: the task, the steps, and the SQL query. '
    'Read each step carefully. Try to understand the logic before you look at the SQL code.',
    body_style))

# ---------- EXAMPLE 1 ----------
story.append(Spacer(1, 6))
story.append(Paragraph('Example 1: Average Salary by Department', h2_style))
story.append(HRFlowable(width="100%", thickness=0.3, color=ACCENT, spaceAfter=3))

story.append(Paragraph('<b>Task:</b>', label_style))
story.append(Paragraph(
    'Find the average salary for each department. Show only departments where the average salary '
    'is more than 10000. Order the result by average salary from high to low.',
    task_style))

story.append(Spacer(1, 3))
story.append(Paragraph('<b>Step-by-Step:</b>', label_style))
story.append(Paragraph('<b>Step 1:</b> What tables do we need? We need EMPLOYEES (for salary) and DEPARTMENTS (for department name).', step_style))
story.append(Paragraph('<b>Step 2:</b> We need to connect the tables. EMPLOYEES.DEPARTMENT_ID = DEPARTMENTS.DEPARTMENT_ID. This is an INNER JOIN.', step_style))
story.append(Paragraph('<b>Step 3:</b> We need the average salary for each department. So we use GROUP BY department name. And we use AVG(salary).', step_style))
story.append(Paragraph('<b>Step 4:</b> We only want departments with average salary > 10000. After GROUP BY, we use HAVING (not WHERE).', step_style))
story.append(Paragraph('<b>Step 5:</b> Order by average salary from high to low: ORDER BY ... DESC.', step_style))

story.append(Spacer(1, 3))
story.append(Paragraph('<b>SQL Query:</b>', label_style))
story.append(Paragraph(
    'SELECT d.department_name,<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ROUND(AVG(e.salary), 2) AS avg_salary<br/>'
    'FROM employees e<br/>'
    'INNER JOIN departments d<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ON e.department_id = d.department_id<br/>'
    'GROUP BY d.department_name<br/>'
    'HAVING AVG(e.salary) &gt; 10000<br/>'
    'ORDER BY avg_salary DESC;',
    sql_style))

# ---------- EXAMPLE 2 ----------
story.append(Spacer(1, 6))
story.append(Paragraph('Example 2: Employees Who Earn More Than Their Manager', h2_style))
story.append(HRFlowable(width="100%", thickness=0.3, color=ACCENT, spaceAfter=3))

story.append(Paragraph('<b>Task:</b>', label_style))
story.append(Paragraph(
    'Find all employees whose salary is higher than their manager\'s salary. Show employee name, '
    'employee salary, manager name, and manager salary.',
    task_style))

story.append(Spacer(1, 3))
story.append(Paragraph('<b>Step-by-Step:</b>', label_style))
story.append(Paragraph('<b>Step 1:</b> We need to find each employee and their manager. The MANAGER_ID in EMPLOYEES points to another EMPLOYEE_ID. So we need to join EMPLOYEES with itself. This is called a SELF JOIN.', step_style))
story.append(Paragraph('<b>Step 2:</b> We use two aliases: "e" for the employee and "m" for the manager. The join condition is: e.manager_id = m.employee_id.', step_style))
story.append(Paragraph('<b>Step 3:</b> The filter is simple: the employee salary must be more than the manager salary. e.salary > m.salary.', step_style))
story.append(Paragraph('<b>Step 4:</b> We show first name, last name, and salary for both the employee and the manager.', step_style))

story.append(Spacer(1, 3))
story.append(Paragraph('<b>SQL Query:</b>', label_style))
story.append(Paragraph(
    'SELECT e.first_name || \' \' || e.last_name AS employee_name,<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;e.salary AS employee_salary,<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;m.first_name || \' \' || m.last_name AS manager_name,<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;m.salary AS manager_salary<br/>'
    'FROM employees e<br/>'
    'INNER JOIN employees m<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ON e.manager_id = m.employee_id<br/>'
    'WHERE e.salary &gt; m.salary<br/>'
    'ORDER BY e.salary DESC;',
    sql_style))

# ---------- EXAMPLE 3 ----------
story.append(Spacer(1, 6))
story.append(Paragraph('Example 3: Department with Most Employees', h2_style))
story.append(HRFlowable(width="100%", thickness=0.3, color=ACCENT, spaceAfter=3))

story.append(Paragraph('<b>Task:</b>', label_style))
story.append(Paragraph(
    'Find the department name that has the most employees. Show the department name and the number of employees.',
    task_style))

story.append(Spacer(1, 3))
story.append(Paragraph('<b>Step-by-Step:</b>', label_style))
story.append(Paragraph('<b>Step 1:</b> We need to count employees in each department. So we use COUNT(*) with GROUP BY department_id.', step_style))
story.append(Paragraph('<b>Step 2:</b> We join EMPLOYEES with DEPARTMENTS to get the department name, not just the ID.', step_style))
story.append(Paragraph('<b>Step 3:</b> We order by count DESC and take only the first row with FETCH FIRST 1 ROW ONLY (or ROWNUM = 1 in older Oracle).', step_style))

story.append(Spacer(1, 3))
story.append(Paragraph('<b>SQL Query:</b>', label_style))
story.append(Paragraph(
    'SELECT d.department_name,<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;COUNT(e.employee_id) AS total_employees<br/>'
    'FROM employees e<br/>'
    'INNER JOIN departments d<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ON e.department_id = d.department_id<br/>'
    'GROUP BY d.department_name<br/>'
    'ORDER BY total_employees DESC<br/>'
    'FETCH FIRST 1 ROW ONLY;',
    sql_style))

# ---------- EXAMPLE 4 ----------
story.append(Spacer(1, 6))
story.append(Paragraph('Example 4: Salary Gap - Highest and Lowest by Job', h2_style))
story.append(HRFlowable(width="100%", thickness=0.3, color=ACCENT, spaceAfter=3))

story.append(Paragraph('<b>Task:</b>', label_style))
story.append(Paragraph(
    'For each job title, find the difference between the highest salary and the lowest salary. '
    'Show only jobs where the gap is more than 5000.',
    task_style))

story.append(Spacer(1, 3))
story.append(Paragraph('<b>Step-by-Step:</b>', label_style))
story.append(Paragraph('<b>Step 1:</b> We need the job title, so we join EMPLOYEES with JOBS on job_id.', step_style))
story.append(Paragraph('<b>Step 2:</b> For each job, we find the max salary (MAX) and min salary (MIN). This needs GROUP BY job_title.', step_style))
story.append(Paragraph('<b>Step 3:</b> The gap = MAX(salary) - MIN(salary). We can calculate this in SELECT.', step_style))
story.append(Paragraph('<b>Step 4:</b> We filter with HAVING, because the filter is on the result of an aggregate function (MAX - MIN > 5000).', step_style))

story.append(Spacer(1, 3))
story.append(Paragraph('<b>SQL Query:</b>', label_style))
story.append(Paragraph(
    'SELECT j.job_title,<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MAX(e.salary) AS highest_salary,<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MIN(e.salary) AS lowest_salary,<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MAX(e.salary) - MIN(e.salary) AS salary_gap<br/>'
    'FROM employees e<br/>'
    'INNER JOIN jobs j<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ON e.job_id = j.job_id<br/>'
    'GROUP BY j.job_title<br/>'
    'HAVING MAX(e.salary) - MIN(e.salary) &gt; 5000<br/>'
    'ORDER BY salary_gap DESC;',
    sql_style))

# ---------- EXAMPLE 5 ----------
story.append(Spacer(1, 6))
story.append(Paragraph('Example 5: Employees Earning Above Average', h2_style))
story.append(HRFlowable(width="100%", thickness=0.3, color=ACCENT, spaceAfter=3))

story.append(Paragraph('<b>Task:</b>', label_style))
story.append(Paragraph(
    'Find all employees who earn more than the average salary of the whole company. Show employee name, '
    'job title, salary, and how much more they earn than the average.',
    task_style))

story.append(Spacer(1, 3))
story.append(Paragraph('<b>Step-by-Step:</b>', label_style))
story.append(Paragraph('<b>Step 1:</b> First, we need the average salary of the whole company. We can get this with a subquery: SELECT AVG(salary) FROM employees.', step_style))
story.append(Paragraph('<b>Step 2:</b> We use this subquery in the WHERE clause. Each employee\'s salary must be > the result of the subquery.', step_style))
story.append(Paragraph('<b>Step 3:</b> We join EMPLOYEES with JOBS to show the job title. We also calculate the difference: salary - average.', step_style))
story.append(Paragraph('<b>Step 4:</b> In the SELECT list, we can write the subquery again to show the difference: salary - (SELECT AVG(salary) FROM employees).', step_style))

story.append(Spacer(1, 3))
story.append(Paragraph('<b>SQL Query:</b>', label_style))
story.append(Paragraph(
    'SELECT e.first_name || \' \' || e.last_name AS employee_name,<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;j.job_title,<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;e.salary,<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;e.salary - (SELECT AVG(salary) FROM employees) AS above_avg<br/>'
    'FROM employees e<br/>'
    'INNER JOIN jobs j<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ON e.job_id = j.job_id<br/>'
    'WHERE e.salary &gt; (SELECT AVG(salary) FROM employees)<br/>'
    'ORDER BY above_avg DESC;',
    sql_style))

story.append(PageBreak())

# ============ PART 2: PRACTICE TASKS ============
story.append(Paragraph('PART 2: Practice Tasks', h1_style))
story.append(HRFlowable(width="100%", thickness=0.5, color=ACCENT, spaceAfter=4))
story.append(Paragraph(
    'Now it is your turn! Solve these 15 tasks. Write your SQL queries on paper or in a database tool. '
    'Use the Oracle HR schema. Good luck!',
    body_style))

tasks = [
    {
        'num': 1,
        'title': 'Total Salary Cost',
        'text': 'Find the total salary cost (sum of all salaries) for each department. Show department name and total salary. Order by total salary from high to low.',
        'topic': 'JOIN + GROUP BY + SUM',
    },
    {
        'num': 2,
        'title': 'Employee Count by Department',
        'text': 'Count how many employees work in each department. Show department name and count. Show only departments with more than 5 employees.',
        'topic': 'JOIN + GROUP BY + HAVING + COUNT',
    },
    {
        'num': 3,
        'title': 'Highest Paid Employee in Each Department',
        'text': 'Find the employee with the highest salary in each department. Show department name, employee name, and salary.',
        'topic': 'JOIN + GROUP BY + MAX + Subquery',
    },
    {
        'num': 4,
        'title': 'Average Salary by Job Title',
        'text': 'Find the average salary for each job title. Show job title and average salary. Order by average salary from low to high.',
        'topic': 'JOIN + GROUP BY + AVG + ORDER BY',
    },
    {
        'num': 5,
        'title': 'Employees Without a Department',
        'text': 'Find all employees who do not have a department (department_id is null). Show their name and job title.',
        'topic': 'LEFT JOIN + IS NULL',
    },
    {
        'num': 6,
        'title': 'Salary Range Analysis',
        'text': 'For each job title, show the minimum salary, maximum salary, and average salary. Use the JOBS table to show job titles. Order by the salary range (max - min) from big to small.',
        'topic': 'JOIN + GROUP BY + MIN + MAX + AVG',
    },
    {
        'num': 7,
        'title': 'New Hires in 2024-2025',
        'text': 'Find employees hired in the years 2024 and 2025. Show their name, hire date, and department name. Order by hire date (newest first).',
        'topic': 'WHERE + BETWEEN or date filter + JOIN',
    },
    {
        'num': 8,
        'title': 'Departments with High Average Salary',
        'text': 'Find departments where the average salary is higher than the company average. Show department name and average salary. Use a subquery for the company average.',
        'topic': 'GROUP BY + HAVING + Subquery',
    },
    {
        'num': 9,
        'title': 'Employees Who Changed Jobs',
        'text': 'Find employees who have a record in the JOB_HISTORY table. This means they changed their job. Show employee name, old job, new job, and the dates.',
        'topic': 'Subquery + JOIN (employees, jobs, job_history)',
    },
    {
        'num': 10,
        'title': 'Salary Comparison: Employee vs Department Average',
        'text': 'For each employee, show their salary and their department average salary. Show the difference. Show only employees who earn less than their department average.',
        'topic': 'Subquery + JOIN + Arithmetic',
    },
    {
        'num': 11,
        'title': 'Managers and Their Team Size',
        'text': 'For each manager, count how many employees they manage. Show manager name and team size. Show only managers with more than 3 employees.',
        'topic': 'SELF JOIN + GROUP BY + HAVING + COUNT',
    },
    {
        'num': 12,
        'title': 'Salary Percentile: Top 5 Earners',
        'text': 'Find the top 5 highest paid employees in the whole company. Show their name, job title, and salary.',
        'topic': 'ORDER BY + FETCH FIRST (or ROWNUM)',
    },
    {
        'num': 13,
        'title': 'Salary Distribution by Department',
        'text': 'For each department, count how many employees earn more than 10000 and how many earn 10000 or less. Show department name and both counts.',
        'topic': 'CASE WHEN + GROUP BY + SUM',
    },
    {
        'num': 14,
        'title': 'Average Years of Service by Department',
        'text': 'Find the average number of years employees have worked in each department. Use the HIRE_DATE column. Show department name and average years. Order by longest average service first.',
        'topic': 'Date Functions + GROUP BY + AVG + JOIN',
    },
    {
        'num': 15,
        'title': 'Cross-Department Salary Analysis',
        'text': 'Find all pairs of departments where the average salary difference is more than 3000. Use a self-join on a subquery that calculates average salary per department.',
        'topic': 'Subquery + Self JOIN + HAVING',
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
        ('ROUNDEDCORNERS', [4,4,0,0]),
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
        ('ROUNDEDCORNERS', [0,0,4,4]),
    ]))
    story.append(tb_table)


# -- Build --
doc.build(story)

import os
from pypdf import PdfReader
r = PdfReader(OUTPUT)
print(f"PDF: {OUTPUT} ({os.path.getsize(OUTPUT)/1024:.1f} KB, {len(r.pages)} pages)")
