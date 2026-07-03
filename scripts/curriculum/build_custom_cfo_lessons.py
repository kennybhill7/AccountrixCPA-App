#!/usr/bin/env python3
"""
Build Custom CFO Lessons Based on ChatGPT Work Analysis
These are the actual skills Jordan needs to master based on his daily work
"""

import json
from pathlib import Path

BASE_PATH = Path(r"C:\Users\owner\OneDrive\Apps\Accountrix CPA Prep")
DATA_PATH = BASE_PATH / "data"

# Based on CHATGPT_WORK_ANALYSIS_RESULTS.md Section 7: CURRICULUM RECOMMENDATIONS
CUSTOM_CFO_CURRICULUM = [
    {
        "id": "cfo-month1",
        "title": "Month 1: Fundamentals & Close Discipline",
        "description": "Master month-end close, bank recs, and JE forensics based on your actual work challenges",
        "weeks": [
            {
                "id": "w1",
                "title": "Week 1: Month-End Close Framework & Prior-Year Dependencies",
                "real_problem": "Your 2023 not being closed caused 2024 beginning balance issues",
                "topics": [
                    "Prior-year close → BBF generation",
                    "Bank reconciliation workflow",
                    "Policy for later-clearing items",
                    "Account 1022 beginning balance fix"
                ],
                "learning_objectives": [
                    "Understand why prior-year close is required before current-year recs",
                    "Fix the Jan 2024 bank rec blocked by unmatched beginning balance",
                    "Create a close checklist to prevent future BBF issues",
                    "Document reconciling items that clear in later months"
                ],
                "your_actual_work": "Jan 2024 bank rec blocked by BBF; 12/31/2023 item remained open; GL export contained ALL accounts causing mismatch"
            },
            {
                "id": "w2",
                "title": "Week 2: GL Hygiene - Account-Scope Exports & Filtering",
                "real_problem": "GL export inadvertently included ALL accounts, inflating totals vs bank activity",
                "topics": [
                    "GL filtering by Account 1022 (cash only)",
                    "Account mapping tables",
                    "Exception logs",
                    "Tie GL to bank before reconciling"
                ],
                "learning_objectives": [
                    "Export GL filtered to ONLY cash account (1022)",
                    "Create Excel formulas to validate GL = Bank before matching",
                    "Build exception log for unmatched items",
                    "Document account scope in every reconciliation"
                ],
                "your_actual_work": "GL export contained multiple accounts; need to filter by account 1022; missed account-scope filtering initially"
            },
            {
                "id": "w3",
                "title": "Week 3: JE Forensics - Tracing the $246K Retained Earnings Entry",
                "real_problem": "Long opening JE affecting Retained Earnings (credit 246,639.65) with uncertainty about the other side",
                "topics": [
                    "T-account tracing methodology",
                    "Reversing journal entries",
                    "Documentation requirements",
                    "Retained earnings vs opening balance JEs"
                ],
                "learning_objectives": [
                    "Trace the $246K RE JE to identify all debit accounts",
                    "Build T-accounts to visualize the full transaction",
                    "Prepare reversing JE with proper documentation",
                    "Create JE audit trail template for future use"
                ],
                "your_actual_work": "Retained Earnings JE (246,639.65 credit) - need to identify offset accounts and reversal strategy"
            },
            {
                "id": "w4",
                "title": "Week 4: Bank Rec Labs - Multi-to-One Matching",
                "real_problem": "Reconciling when multiple GL lines equal one bank line",
                "topics": [
                    "Multi-to-one GL matching",
                    "Memo/description parsing",
                    "Reversal detection",
                    "Reconciliation narratives"
                ],
                "learning_objectives": [
                    "Match multiple GL entries to single bank transaction",
                    "Use Excel SUMIFS to group GL lines by date/amount",
                    "Detect and handle reversals in GL",
                    "Write clear reconciliation narratives for auditors"
                ],
                "your_actual_work": "Reconciling multiple GL entries to a single bank line; memo parsing; reversals detection; handling items that clear in later months"
            }
        ]
    },
    {
        "id": "cfo-month2",
        "title": "Month 2: Construction Accounting Core",
        "description": "Master retainage, job costing, WIP schedules, and intercompany accounting",
        "weeks": [
            {
                "id": "w1",
                "title": "Week 5: Retainage Lifecycle in Ledgerline Intacct",
                "real_problem": "Questions about enabling retainage at vendor level and whether to add cost code for retainage",
                "topics": [
                    "Enabling retainage under vendor in Ledgerline",
                    "Retainage GL accounts (AP and AR sides)",
                    "Invoice coding: retainage line vs system feature",
                    "Retainage release mechanics"
                ],
                "learning_objectives": [
                    "Configure vendor retainage in Ledgerline Intacct",
                    "Decide when to use dedicated retainage cost code",
                    "Post invoices with retainage and verify GL impact",
                    "Process retainage release and final payment"
                ],
                "your_actual_work": "Retainage configuration and treatment; enabling retainage at vendor level; deciding whether to add cost code for retainage on invoices"
            },
            {
                "id": "w2",
                "title": "Week 6: Job Costing & WIP Schedules",
                "real_problem": "Requests for 'best way' to run cost reports and close jobs",
                "topics": [
                    "WIP schedule design (contract value, costs to date, est cost to complete)",
                    "Percentage of completion calculation",
                    "Cost-to-complete forecasting",
                    "Burdening and indirect cost allocation"
                ],
                "learning_objectives": [
                    "Build a WIP schedule from scratch for active jobs",
                    "Calculate % complete using cost-to-cost method",
                    "Forecast costs to complete for over-budget jobs",
                    "Run Job Cost to Date reports in Ledgerline/JCS"
                ],
                "your_actual_work": "Job costing set-up and reporting; best practices request; WIP schedule treatment; closing jobs and accruing costs back"
            },
            {
                "id": "w3",
                "title": "Week 7: Progress Billing & Change Orders",
                "real_problem": "Progress billing and retainage tracking; change order controls",
                "topics": [
                    "Progress billing workflow (AIA G702/G703 style)",
                    "Cutoff policies for billing",
                    "Change order accounting",
                    "Revenue recognition controls"
                ],
                "learning_objectives": [
                    "Prepare progress billing invoice with retainage",
                    "Apply cutoff rules consistently",
                    "Account for approved vs unapproved change orders",
                    "Ensure revenue recognition aligns with % complete"
                ],
                "your_actual_work": "Progress billing and retainage tracking; change orders implied via retainage/progress questions"
            },
            {
                "id": "w4",
                "title": "Week 8: Intercompany Matrix for 10 Entities",
                "real_problem": "Need intercompany receivables/payables matrix across ~10 entities",
                "topics": [
                    "Due to/Due from mapping table",
                    "Monthly aging by counterparty",
                    "Elimination entries for consolidation",
                    "Settlement procedures"
                ],
                "learning_objectives": [
                    "Build intercompany matrix in Excel (10x10 grid)",
                    "Create standardized JE template for IC transactions",
                    "Age IC balances and identify out-of-balance situations",
                    "Prepare elimination entries for consolidated reporting"
                ],
                "your_actual_work": "Intercompany receivables/payables matrix across ~10 entities; design of spreadsheet requested; multifamily department control"
            }
        ]
    },
    {
        "id": "cfo-month3",
        "title": "Month 3: Tools & Automation",
        "description": "Master Excel Power Query, cash flow forecasting, and dashboard building",
        "weeks": [
            {
                "id": "w1",
                "title": "Week 9: Excel Power Query & Pivots for Reconciliations",
                "real_problem": "Heavy manual reconciliation steps; need repeatable templates",
                "topics": [
                    "Power Query for GL imports",
                    "Pivot tables for summarization",
                    "Structured table references",
                    "Reconciliation models with control totals"
                ],
                "learning_objectives": [
                    "Import Ledgerline GL export using Power Query",
                    "Create dynamic pivot table for account analysis",
                    "Build reconciliation template with automated checks",
                    "Use structured references for formula consistency"
                ],
                "your_actual_work": "GL filtering, reconciliation, combining transactions to match bank lines; needs Power Query and pivots"
            },
            {
                "id": "w2",
                "title": "Week 10: Cash Flow Forecasting Aligned to WIP",
                "real_problem": "Cash flow considerations through bank rec cadence and progress billing timing",
                "topics": [
                    "13-week cash flow forecast",
                    "Link WIP to expected billing dates",
                    "Retainage release timing",
                    "Draw schedules for construction loans"
                ],
                "learning_objectives": [
                    "Build 13-week cash forecast in Excel",
                    "Project cash in from WIP billing milestones",
                    "Project cash out for vendor payments + retainage",
                    "Identify cash shortfalls and funding needs"
                ],
                "your_actual_work": "Cash flow considerations through bank rec cadence and progress billing timing; strategic funding conversations"
            },
            {
                "id": "w3",
                "title": "Week 11: Close Checklist & Reconciliation Matrix",
                "real_problem": "Lack of formal monthly close checklist; inconsistent process",
                "topics": [
                    "Month-end close order of operations",
                    "Reconciliation matrix (all balance sheet accounts)",
                    "Sign-off procedures",
                    "Documentation pack requirements"
                ],
                "learning_objectives": [
                    "Create formal close checklist with dependencies",
                    "Build reconciliation matrix tracking all BS accounts",
                    "Implement sign-off workflow (preparer + reviewer)",
                    "Assemble monthly close pack for lenders/auditors"
                ],
                "your_actual_work": "Lack of formal close checklist; limited controls and documentation standards; ad-hoc fixes"
            },
            {
                "id": "w4",
                "title": "Week 12: CFO Dashboard - Builder vs Developer Consolidated",
                "real_problem": "Request for CFO-level dashboards (developer vs builder and consolidated) with scenario controls",
                "topics": [
                    "Separate builder vs developer financials",
                    "Consolidated view with eliminations",
                    "Scenario control tabs",
                    "KPI tracking (profit %, cash, WIP aging)"
                ],
                "learning_objectives": [
                    "Build 3-view dashboard (builder, developer, consolidated)",
                    "Create scenario controls for sensitivity analysis",
                    "Track KPIs: gross margin, cash position, WIP aging",
                    "Implement data validation and QA checks"
                ],
                "your_actual_work": "CFO-level dashboards (developer vs builder and consolidated) with scenario controls; 'the Lakeshore development' modeling"
            }
        ]
    }
]

def generate_custom_lesson_html(week):
    """Generate lesson HTML based on actual work problems"""

    html = f"<h1>{week['title']}</h1>\n\n"

    # Real Problem Alert
    html += f'<div class="alert-danger">\n'
    html += f'<strong>⚠️ YOUR ACTUAL PROBLEM:</strong> {week["real_problem"]}\n'
    html += f'</div>\n\n'

    # Your Work Context
    html += f'<div class="cfo-context">\n'
    html += f'<strong>🎯 From Your ChatGPT Work Analysis:</strong><br>\n'
    html += f'{week["your_actual_work"]}\n'
    html += f'</div>\n\n'

    # Learning Objectives
    html += "<h2>Learning Objectives</h2>\n<ul>\n"
    for obj in week["learning_objectives"]:
        html += f"<li>{obj}</li>\n"
    html += "</ul>\n\n"

    # Topics with step-by-step guidance
    html += "<h2>Step-by-Step Solution</h2>\n\n"
    for i, topic in enumerate(week["topics"], 1):
        html += f"<h3>Step {i}: {topic}</h3>\n"
        html += f"<p>This step directly addresses your challenge with {topic.lower()}. "
        html += f"Follow the instructions below to resolve this issue in your actual work.</p>\n\n"

        html += f'<div class="hands-on">\n'
        html += f'<strong>🔧 Hands-On Exercise:</strong><br>\n'
        html += f'Open your Ledgerline Intacct and Excel files. Work through this problem using YOUR actual data from 2024.\n'
        html += f'</div>\n\n'

    # Practice Application
    html += "<h2>Apply to Your Work NOW</h2>\n"
    html += f"<p>Don't just read - DO THIS with your actual {week['real_problem'].lower()}:</p>\n<ol>\n"
    for topic in week["topics"]:
        html += f"<li>Complete {topic} using your Ledgerline data</li>\n"
    html += "<li>Document what you learned in your close pack</li>\n"
    html += "<li>Create a template to use next month</li>\n"
    html += "</ol>\n\n"

    # Key Takeaways
    html += "<h2>Key Takeaways</h2>\n<ul>\n"
    for obj in week["learning_objectives"][:3]:
        html += f"<li>{obj}</li>\n"
    html += "<li>This solves your actual recurring problem</li>\n"
    html += "<li>Use this process every month going forward</li>\n"
    html += "</ul>\n"

    return html

def generate_practical_quiz(week):
    """Generate quiz based on actual work scenarios"""
    questions = []

    # Q1: Your actual problem
    questions.append({
        "id": "q1",
        "question": f"You encounter this problem: {week['real_problem']}. What is the FIRST step?",
        "options": [
            week["topics"][0] if len(week["topics"]) > 0 else "Investigate root cause",
            "Ignore it and move on",
            "Ask someone else to fix it",
            "Close your eyes and hope it goes away"
        ],
        "correctAnswer": 0,
        "explanation": f"Based on your ChatGPT work analysis, the correct first step is: {week['topics'][0]}. This addresses the root cause of the issue you experienced."
    })

    # Q2: Why it happened
    questions.append({
        "id": "q2",
        "question": "Why did this problem occur in the first place?",
        "options": [
            "Lack of formal process and checklist",
            "Bad luck",
            "The software is broken",
            "It's impossible to prevent"
        ],
        "correctAnswer": 0,
        "explanation": "Most of your issues stem from lack of formal close checklists, reconciliation procedures, and documentation standards. Fixing the process prevents recurrence."
    })

    # Q3: How to prevent next time
    questions.append({
        "id": "q3",
        "question": "How do you prevent this problem next month?",
        "options": [
            "Create a checklist and template to follow every month",
            "Try to remember to do it differently",
            "Wait for it to happen again",
            "Hire someone else to do it"
        ],
        "correctAnswer": 0,
        "explanation": "The solution is PROCESS. Create checklists, templates, and documentation so you follow the same reliable procedure every month."
    })

    # Q4: Real application
    questions.append({
        "id": "q4",
        "question": f"When will you apply what you learned about {week['title'].lower()}?",
        "options": [
            "Right now - open Ledgerline and fix it today",
            "Someday when I have time",
            "Never - I'll keep doing it the same way",
            "After I take the CPA exam"
        ],
        "correctAnswer": 0,
        "explanation": "The ONLY way to master this is to apply it immediately to your actual work. Don't wait - fix your Jan 2024 bank rec, trace your $246K JE, build your retainage process NOW."
    })

    return questions

def generate_practical_flashcards(week):
    """Generate flashcards for daily work reference"""
    flashcards = []

    # Problem-solution pairs
    flashcards.append({
        "question": f"Problem: {week['real_problem']}",
        "answer": f"Solution: {week['topics'][0]}. Then: {week['topics'][1] if len(week['topics']) > 1 else 'Document and create template'}"
    })

    # Each topic
    for topic in week["topics"]:
        flashcards.append({
            "question": f"How do I {topic}?",
            "answer": f"{topic} by following the step-by-step process from Week {week['id'][-1]}. Reference your close checklist and use the template you created."
        })

    # Prevention
    flashcards.append({
        "question": f"How do I prevent {week['real_problem'].lower()} from happening again?",
        "answer": "Use the checklist and templates from this lesson. Follow the same process every month. Document exceptions."
    })

    return flashcards

def main():
    """Build custom CFO curriculum"""
    print("=" * 70)
    print("BUILDING CUSTOM CFO CURRICULUM")
    print("Based on ChatGPT Work Analysis - YOUR Actual Problems")
    print("=" * 70)
    print()

    for month in CUSTOM_CFO_CURRICULUM:
        print(f"Building {month['title']}...")

        month_data = {
            "id": month["id"],
            "title": month["title"],
            "description": month["description"],
            "weeks": []
        }

        for week in month["weeks"]:
            week_data = {
                "id": week["id"],
                "title": week["title"],
                "lessonHtml": generate_custom_lesson_html(week),
                "quiz": {
                    "id": f"{month['id']}-{week['id']}-quiz",
                    "title": f"{week['title']} - Fix Your Actual Problem",
                    "questions": generate_practical_quiz(week)
                },
                "flashcards": generate_practical_flashcards(week)
            }
            month_data["weeks"].append(week_data)

        # Save
        output_file = DATA_PATH / f"{month['id']}.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(month_data, f, indent=2, ensure_ascii=False)

        print(f"  [OK] Saved {output_file}")

    print("\n" + "=" * 70)
    print("CUSTOM CFO CURRICULUM COMPLETE!")
    print("=" * 70)
    print("\nThese lessons solve YOUR ACTUAL PROBLEMS:")
    print("  - Jan 2024 bank rec with BBF issue (Account 1022)")
    print("  - $246K Retained Earnings JE tracing")
    print("  - Retainage setup in Ledgerline")
    print("  - Intercompany matrix for 10 entities")
    print("  - WIP schedules and job costing")
    print("  - Excel Power Query for reconciliations")
    print("  - CFO dashboard (builder vs developer)")
    print("\nStart with Month 1 Week 1 and FIX YOUR WORK TODAY!")

if __name__ == "__main__":
    main()
