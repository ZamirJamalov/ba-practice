# BA Practice — Business Analysis Samples

> Practical Business Analysis artifacts used in training sessions at **DIV Academy** and **Innab Training Center** since 2022. Centralized in this repository for students' convenience.

## About

This repository contains real-world Business Analysis samples based on a consistent scenario: **Product Return Process Digitization** at an electronics retail company. All artifacts demonstrate the end-to-end BA workflow from requirements gathering through UAT sign-off.

## Scenario

A large electronics retailer processes 500+ product return requests per month manually via phone calls, email, and paper forms. The business wants to digitize this process to reduce processing time, improve customer experience, and gain data visibility.

## Repository Structure

```
ba-practice/
├── 01-requirements-gathering/         # FRD, User Stories, Acceptance Criteria
├── 02-process-modeling/               # BPMN diagrams (As-Is / To-Be), Gap Analysis
├── 03-api-documentation/             # REST API specification (Swagger/OpenAPI 3.0)
├── 04-data-analysis/                  # SQL queries for return analytics
└── 05-uat/                           # UAT test plan, test cases, triage matrix
```

## Artifacts Overview

### 01 — Requirements Gathering
| Artifact | Description |
|----------|-------------|
| `FRD_Product_Returns.pdf` | Functional Requirements Document with REQ-101 numbered format |
| `user-stories-acceptance.xlsx` | User Stories with Given/When/Then Acceptance Criteria (Jira-compatible) |

### 02 — Process Modeling
| Artifact | Description |
|----------|-------------|
| `as-is-returns-process.png` | Current manual return process modeled in BPMN 2.0 |
| `to-be-returns-process.png` | Proposed digital return process modeled in BPMN 2.0 |
| `gap-analysis.pdf` | Identified gaps between As-Is and To-Be with recommendations |

### 03 — API Documentation
| Artifact | Description |
|----------|-------------|
| `returns-api-openapi3.yaml` | OpenAPI 3.0 specification for return management endpoints |

### 04 — Data Analysis
| Artifact | Description |
|----------|-------------|
| `return-analytics.sql` | SQL queries for return volume, category analysis, and trend reporting |
| `query-results-analysis.md` | Interpretation of query results with business recommendations |

### 05 — UAT
| Artifact | Description |
|----------|-------------|
| `uat-test-plan-returns.xlsx` | UAT test plan with scenarios, expected results, and pass/fail status |

## Tools Demonstrated
- **Documentation:** BRD/FRD (REQ-101 format), User Stories (Gherkin), Gap Analysis
- **Process Modeling:** BPMN 2.0 (swimlanes, exclusive gateways, timer events)
- **API Design:** REST API, OpenAPI 3.0 (Swagger), JSON
- **Testing:** Postman collections, UAT coordination, Bug triage
- **Data:** SQL (JOIN, GROUP BY, Subqueries), data-driven decision making
- **Project Management:** Jira, Confluence, Agile/Scrum

---

*Materials developed and used in training sessions since 2022. Centralized in this repository in 2026.*
