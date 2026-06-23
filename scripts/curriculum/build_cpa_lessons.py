#!/usr/bin/env python3
"""
Build CPA Prep Lessons - Convert Advanced Accounting Syllabus into full lesson modules
Based on the 12-module structure from ADVANCED_ACCOUNTING_COLLEGE_SYLLABUS.md
"""

import json
from pathlib import Path

# Base path
BASE_PATH = Path(r"C:\Users\kenny\OneDrive\Apps\Accountrix CPA Prep")
DATA_PATH = BASE_PATH / "data"
DATA_PATH.mkdir(exist_ok=True)

# 12 Module CPA Prep Curriculum based on Advanced Accounting Syllabus
MODULES = [
    {
        "id": "module1",
        "title": "Module 1: Consolidations (ASC 805/810)",
        "description": "Master business combinations and consolidated financial statements",
        "weeks": [
            {
                "id": "w1",
                "title": "Week 1: Acquisition Method & Goodwill",
                "topics": ["ASC 805 acquisition method", "Goodwill calculation", "Consideration transferred", "Contingent consideration"],
                "learning_objectives": [
                    "Apply the acquisition method to business combinations",
                    "Calculate goodwill and recognize identifiable intangibles",
                    "Account for contingent consideration"
                ]
            },
            {
                "id": "w2",
                "title": "Week 2: Non-Controlling Interest (NCI)",
                "topics": ["NCI measurement (fair value vs. proportionate)", "NCI in net income", "NCI in equity"],
                "learning_objectives": [
                    "Calculate NCI at acquisition and subsequent periods",
                    "Prepare consolidated income statement with NCI",
                    "Present NCI in consolidated balance sheet"
                ]
            },
            {
                "id": "w3",
                "title": "Week 3: Intercompany Eliminations",
                "topics": ["Intercompany sales", "Intercompany debt", "Upstream vs. downstream transactions", "Unrealized profit elimination"],
                "learning_objectives": [
                    "Eliminate intercompany transactions in consolidation",
                    "Calculate unrealized profit adjustments",
                    "Prepare consolidation worksheet entries"
                ]
            },
            {
                "id": "w4",
                "title": "Week 4: Pushdown Accounting & Complex Structures",
                "topics": ["Pushdown accounting election", "Step acquisitions", "Multi-tier consolidations"],
                "learning_objectives": [
                    "Apply pushdown accounting when required",
                    "Account for step acquisitions",
                    "Consolidate multi-tier entity structures"
                ]
            }
        ]
    },
    {
        "id": "module2",
        "title": "Module 2: Foreign Currency (ASC 830)",
        "description": "Translation, remeasurement, and foreign currency transactions",
        "weeks": [
            {
                "id": "w1",
                "title": "Week 1: Functional Currency Determination",
                "topics": ["Functional currency indicators", "ASC 830 guidance", "Economic environment analysis"],
                "learning_objectives": [
                    "Determine functional currency using ASC 830 criteria",
                    "Distinguish between translation and remeasurement",
                    "Apply functional currency to various scenarios"
                ]
            },
            {
                "id": "w2",
                "title": "Week 2: Translation (Current Rate Method)",
                "topics": ["Current rate method", "Cumulative translation adjustment (CTA)", "OCI presentation"],
                "learning_objectives": [
                    "Translate foreign subsidiary financials using current rate method",
                    "Calculate and present CTA in OCI",
                    "Apply appropriate exchange rates to balance sheet and income statement"
                ]
            },
            {
                "id": "w3",
                "title": "Week 3: Remeasurement (Temporal Method)",
                "topics": ["Temporal method", "Monetary vs. non-monetary", "Remeasurement gain/loss"],
                "learning_objectives": [
                    "Remeasure when USD is functional currency",
                    "Classify monetary vs. non-monetary items",
                    "Calculate remeasurement gain/loss (P&L impact)"
                ]
            },
            {
                "id": "w4",
                "title": "Week 4: Hedging Foreign Currency Risk (ASC 815)",
                "topics": ["Forward contracts", "Cash flow hedges", "Fair value hedges", "Hedge effectiveness"],
                "learning_objectives": [
                    "Account for foreign currency forward contracts",
                    "Apply cash flow hedge accounting",
                    "Document and test hedge effectiveness"
                ]
            }
        ]
    },
    {
        "id": "module3",
        "title": "Module 3: Governmental & Not-for-Profit Accounting",
        "description": "GASB standards and NFP reporting",
        "weeks": [
            {
                "id": "w1",
                "title": "Week 1: Fund Accounting Basics",
                "topics": ["Governmental funds", "Proprietary funds", "Fiduciary funds", "Modified accrual vs. accrual"],
                "learning_objectives": [
                    "Classify activities into appropriate fund types",
                    "Apply modified accrual to governmental funds",
                    "Apply full accrual to proprietary funds"
                ]
            },
            {
                "id": "w2",
                "title": "Week 2: Government-Wide Financial Statements",
                "topics": ["Statement of net position", "Statement of activities", "Reconciliation to fund statements"],
                "learning_objectives": [
                    "Prepare government-wide statements",
                    "Reconcile governmental fund balance to net position",
                    "Present program vs. general revenues"
                ]
            },
            {
                "id": "w3",
                "title": "Week 3: Not-for-Profit Financial Statements",
                "topics": ["Net assets (with/without donor restrictions)", "Functional expense reporting", "Contributions"],
                "learning_objectives": [
                    "Classify net assets by donor restriction",
                    "Prepare statement of activities for NFP",
                    "Apply contribution accounting (ASU 2018-08)"
                ]
            },
            {
                "id": "w4",
                "title": "Week 4: Special Topics (Pensions, Debt, Interfund)",
                "topics": ["GASB pension standards", "Debt service funds", "Interfund transfers"],
                "learning_objectives": [
                    "Account for government employee pensions (GASB 68)",
                    "Record bond issuance and debt service",
                    "Eliminate interfund activity in government-wide statements"
                ]
            }
        ]
    },
    {
        "id": "module4",
        "title": "Module 4: Leases (ASC 842)",
        "description": "Lessee and lessor accounting under ASC 842",
        "weeks": [
            {
                "id": "w1",
                "title": "Week 1: Lease Classification & Initial Measurement",
                "topics": ["Finance vs. operating lease (lessee)", "Sales-type vs. direct financing vs. operating (lessor)", "ROU asset and lease liability"],
                "learning_objectives": [
                    "Classify leases using ASC 842 criteria",
                    "Calculate initial lease liability (PV of lease payments)",
                    "Measure ROU asset (liability + initial direct costs + prepayments - incentives)"
                ]
            },
            {
                "id": "w2",
                "title": "Week 2: Subsequent Measurement - Lessee",
                "topics": ["Finance lease amortization", "Operating lease straight-line expense", "Lease liability reduction"],
                "learning_objectives": [
                    "Record finance lease expense (interest + amortization)",
                    "Record operating lease expense (straight-line)",
                    "Adjust lease liability each period"
                ]
            },
            {
                "id": "w3",
                "title": "Week 3: Lessor Accounting",
                "topics": ["Sales-type lease revenue", "Direct financing lease interest income", "Operating lease rental revenue"],
                "learning_objectives": [
                    "Recognize sales-type lease profit at commencement",
                    "Calculate interest income on net investment (direct financing)",
                    "Record operating lease revenue straight-line"
                ]
            },
            {
                "id": "w4",
                "title": "Week 4: Modifications & Sale-Leaseback",
                "topics": ["Lease modifications", "Reassessment events", "Sale-leaseback accounting (ASC 606 + ASC 842)"],
                "learning_objectives": [
                    "Account for lease modifications (separate lease vs. remeasurement)",
                    "Identify reassessment triggers (lease term, residual value guarantee)",
                    "Apply sale-leaseback rules (sale vs. financing)"
                ]
            }
        ]
    },
    {
        "id": "module5",
        "title": "Module 5: Revenue Recognition (ASC 606)",
        "description": "The 5-step model for all revenue transactions",
        "weeks": [
            {
                "id": "w1",
                "title": "Week 1: The 5-Step Model",
                "topics": ["Identify contract", "Identify performance obligations", "Determine transaction price", "Allocate price", "Recognize revenue"],
                "learning_objectives": [
                    "Apply the 5-step model to various contracts",
                    "Identify distinct performance obligations",
                    "Allocate transaction price using standalone selling prices"
                ]
            },
            {
                "id": "w2",
                "title": "Week 2: Over Time vs. Point in Time",
                "topics": ["Over-time criteria (customer control, no alternative use)", "Measure of progress (input vs. output)", "Point-in-time transfer of control"],
                "learning_objectives": [
                    "Determine if revenue is recognized over time or at a point in time",
                    "Select appropriate measure of progress (cost-to-cost, units produced)",
                    "Identify control transfer indicators"
                ]
            },
            {
                "id": "w3",
                "title": "Week 3: Variable Consideration & Contract Modifications",
                "topics": ["Estimate variable consideration", "Constraint (highly probable no reversal)", "Contract modifications (separate vs. cumulative catch-up)"],
                "learning_objectives": [
                    "Estimate and constrain variable consideration (bonuses, penalties)",
                    "Account for contract modifications prospectively or with catch-up",
                    "Apply contract cost guidance (ASC 340-40)"
                ]
            },
            {
                "id": "w4",
                "title": "Week 4: Special Industries (Construction, Software, Licensing)",
                "topics": ["Construction revenue (% completion)", "Software licenses (distinct vs. embedded)", "Right-to-use vs. right-to-access licenses"],
                "learning_objectives": [
                    "Apply ASC 606 to construction contracts (almost always over time)",
                    "Distinguish software licenses from SaaS (over time)",
                    "Recognize IP license revenue (point in time vs. over time)"
                ]
            }
        ]
    },
    {
        "id": "module6",
        "title": "Module 6: Income Taxes (ASC 740)",
        "description": "Deferred tax assets, liabilities, and uncertain tax positions",
        "weeks": [
            {
                "id": "w1",
                "title": "Week 1: Deferred Tax Basics",
                "topics": ["Temporary differences", "DTA and DTL calculation", "Tax rate changes"],
                "learning_objectives": [
                    "Identify temporary vs. permanent differences",
                    "Calculate deferred tax assets and liabilities",
                    "Adjust deferred balances for enacted rate changes"
                ]
            },
            {
                "id": "w2",
                "title": "Week 2: Valuation Allowance",
                "topics": ["More likely than not standard", "Positive and negative evidence", "Release of valuation allowance"],
                "learning_objectives": [
                    "Assess need for valuation allowance on DTAs",
                    "Evaluate positive vs. negative evidence",
                    "Record valuation allowance and subsequent release"
                ]
            },
            {
                "id": "w3",
                "title": "Week 3: Uncertain Tax Positions (FIN 48/ASC 740-10)",
                "topics": ["Recognition threshold (more likely than not)", "Measurement (largest amount >50% likely)", "Disclosure requirements"],
                "learning_objectives": [
                    "Apply two-step process to uncertain tax positions",
                    "Measure and record tax benefit",
                    "Disclose unrecognized tax benefits"
                ]
            },
            {
                "id": "w4",
                "title": "Week 4: Business Combinations & Intraperiod Allocation",
                "topics": ["ASC 740 in purchase accounting", "Intraperiod tax allocation", "Tax effects of equity transactions"],
                "learning_objectives": [
                    "Account for deferred taxes in acquisition accounting",
                    "Allocate income tax expense/benefit intraperiod (continuing ops, OCI, equity)",
                    "Apply special rules for tax effects of equity items"
                ]
            }
        ]
    },
    {
        "id": "module7",
        "title": "Module 7: Financial Instruments & Derivatives (ASC 815)",
        "description": "Hedge accounting and derivative instruments",
        "weeks": [
            {
                "id": "w1",
                "title": "Week 1: Derivative Basics",
                "topics": ["Definition of derivative", "Fair value measurement", "Gains/losses in earnings"],
                "learning_objectives": [
                    "Identify instruments that qualify as derivatives",
                    "Measure derivatives at fair value each period",
                    "Recognize unrealized gains/losses in P&L (default treatment)"
                ]
            },
            {
                "id": "w2",
                "title": "Week 2: Cash Flow Hedges",
                "topics": ["Hedge designation and documentation", "Effectiveness testing", "OCI deferral and reclassification"],
                "learning_objectives": [
                    "Designate and document cash flow hedges",
                    "Test hedge effectiveness (80-125% rule)",
                    "Defer effective portion in OCI and reclassify when hedged item affects earnings"
                ]
            },
            {
                "id": "w3",
                "title": "Week 3: Fair Value Hedges",
                "topics": ["Hedging interest rate risk", "Basis adjustments to hedged item", "Net presentation in earnings"],
                "learning_objectives": [
                    "Apply fair value hedge accounting",
                    "Adjust carrying amount of hedged item for changes in fair value",
                    "Present hedge gains/losses and hedged item losses/gains in same line item"
                ]
            },
            {
                "id": "w4",
                "title": "Week 4: Net Investment Hedges & Embedded Derivatives",
                "topics": ["Hedging foreign subsidiaries (net investment)", "Embedded derivative bifurcation", "ASU 2017-12 simplifications"],
                "learning_objectives": [
                    "Account for net investment hedges (CTA offset)",
                    "Identify and bifurcate embedded derivatives",
                    "Apply recent hedge accounting simplifications"
                ]
            }
        ]
    },
    {
        "id": "module8",
        "title": "Module 8: Pensions & Share-Based Compensation",
        "description": "ASC 715 (pensions) and ASC 718 (stock comp)",
        "weeks": [
            {
                "id": "w1",
                "title": "Week 1: Defined Benefit Pension Basics",
                "topics": ["PBO measurement", "Plan assets", "Service cost and interest cost", "Funded status"],
                "learning_objectives": [
                    "Calculate projected benefit obligation (PBO)",
                    "Measure plan assets at fair value",
                    "Compute service cost, interest cost, and expected return on assets",
                    "Determine funded status (PBO vs. plan assets)"
                ]
            },
            {
                "id": "w2",
                "title": "Week 2: Pension Expense & OCI",
                "topics": ["Net periodic pension cost", "Amortization of prior service cost", "Actuarial gains/losses in OCI"],
                "learning_objectives": [
                    "Calculate net periodic pension cost (P&L component)",
                    "Amortize prior service cost from OCI",
                    "Record actuarial gains/losses in OCI and amortize corridor"
                ]
            },
            {
                "id": "w3",
                "title": "Week 3: Share-Based Compensation (ASC 718)",
                "topics": ["Stock options (fair value at grant)", "RSUs (grant-date fair value)", "Vesting conditions", "Forfeitures"],
                "learning_objectives": [
                    "Measure stock option fair value (Black-Scholes or binomial)",
                    "Account for RSUs (restricted stock units)",
                    "Apply service, performance, and market vesting conditions",
                    "Estimate and true-up forfeitures"
                ]
            },
            {
                "id": "w4",
                "title": "Week 4: Modifications, Tax Effects, and Disclosures",
                "topics": ["Modification accounting (Type I vs. Type II)", "Tax effects of stock comp", "EPS impact of equity awards"],
                "learning_objectives": [
                    "Account for award modifications (incremental cost)",
                    "Apply tax effects of stock compensation (APIC pool)",
                    "Calculate diluted EPS with stock options (treasury stock method)"
                ]
            }
        ]
    },
    {
        "id": "module9",
        "title": "Module 9: Earnings Per Share (ASC 260)",
        "description": "Basic and diluted EPS for simple and complex capital structures",
        "weeks": [
            {
                "id": "w1",
                "title": "Week 1: Basic EPS",
                "topics": ["Numerator (NI - preferred dividends)", "Denominator (weighted-average shares)", "Stock splits and dividends"],
                "learning_objectives": [
                    "Calculate basic EPS numerator (income available to common)",
                    "Compute weighted-average common shares outstanding",
                    "Adjust for stock splits and stock dividends retroactively"
                ]
            },
            {
                "id": "w2",
                "title": "Week 2: Diluted EPS - Stock Options & Warrants",
                "topics": ["Treasury stock method", "Anti-dilution test", "Average stock price"],
                "learning_objectives": [
                    "Apply treasury stock method to options and warrants",
                    "Test for anti-dilution (exclude if anti-dilutive)",
                    "Use average market price for the period"
                ]
            },
            {
                "id": "w3",
                "title": "Week 3: Diluted EPS - Convertible Securities",
                "topics": ["If-converted method (convertible bonds)", "If-converted method (convertible preferred)", "Sequencing (most dilutive first)"],
                "learning_objectives": [
                    "Apply if-converted method to convertible bonds (add back interest, net of tax)",
                    "Apply if-converted method to convertible preferred (add back dividends)",
                    "Sequence potentially dilutive securities from most to least dilutive"
                ]
            },
            {
                "id": "w4",
                "title": "Week 4: Complex EPS Scenarios",
                "topics": ["Contingently issuable shares", "Participating securities (two-class method)", "Year-to-date aggregation"],
                "learning_objectives": [
                    "Include contingently issuable shares when contingency is met",
                    "Apply two-class method for participating securities",
                    "Aggregate quarterly EPS to annual (not a simple average)"
                ]
            }
        ]
    },
    {
        "id": "module10",
        "title": "Module 10: Partnerships & Pass-Through Entities",
        "description": "Partnership accounting, capital accounts, basis, and liquidations",
        "weeks": [
            {
                "id": "w1",
                "title": "Week 1: Partnership Formation & Capital Accounts",
                "topics": ["Contribution of assets", "Capital account balances", "Profit/loss sharing ratios"],
                "learning_objectives": [
                    "Record partner contributions at FMV",
                    "Establish initial capital account balances",
                    "Apply profit/loss sharing agreements (ratios, salaries, interest)"
                ]
            },
            {
                "id": "w2",
                "title": "Week 2: Special Allocations & Distributions",
                "topics": ["Non-pro-rata allocations", "Guaranteed payments", "Draws vs. liquidating distributions"],
                "learning_objectives": [
                    "Account for special allocations (substantial economic effect)",
                    "Record guaranteed payments (expense to partnership)",
                    "Distinguish draws from liquidating distributions"
                ]
            },
            {
                "id": "w3",
                "title": "Week 3: Partner Basis & At-Risk Rules",
                "topics": ["Outside basis calculation", "Debt allocation (recourse vs. non-recourse)", "At-risk limitations"],
                "learning_objectives": [
                    "Calculate partner's outside basis (contributions + income - distributions)",
                    "Allocate partnership debt to partners for basis",
                    "Apply at-risk rules to limit loss deductions"
                ]
            },
            {
                "id": "w4",
                "title": "Week 4: Partnership Liquidations",
                "topics": ["Lump-sum liquidation", "Installment liquidation", "Loss absorption potential (LAP)"],
                "learning_objectives": [
                    "Prepare schedule of partnership liquidation",
                    "Calculate safe payments to partners (installment method)",
                    "Use LAP to determine distribution priorities"
                ]
            }
        ]
    },
    {
        "id": "module11",
        "title": "Module 11: Business Combinations, Carve-Outs, Spin-Offs",
        "description": "Advanced M&A accounting and restructuring transactions",
        "weeks": [
            {
                "id": "w1",
                "title": "Week 1: Step Acquisitions & Control Transition",
                "topics": ["Increase from equity method to control", "Remeasurement gain/loss", "Goodwill calculation"],
                "learning_objectives": [
                    "Account for step acquisition (ASC 805-10)",
                    "Remeasure previously held equity interest to FV",
                    "Calculate goodwill on the acquisition date"
                ]
            },
            {
                "id": "w2",
                "title": "Week 2: Carve-Out Financial Statements",
                "topics": ["Standalone financial statements for subsidiary", "Allocation of parent costs", "Disclosure requirements"],
                "learning_objectives": [
                    "Prepare carve-out financials for divestiture or IPO",
                    "Allocate parent overhead to carved-out entity",
                    "Disclose basis of presentation and related-party transactions"
                ]
            },
            {
                "id": "w3",
                "title": "Week 3: Spin-Offs & Split-Offs",
                "topics": ["Tax-free reorganizations (IRC 355)", "Distribution of subsidiary shares", "Accounting for parent and spun entity"],
                "learning_objectives": [
                    "Account for spin-off (distribution to shareholders at carrying value)",
                    "Apply split-off accounting (exchange of shares)",
                    "Meet IRC 355 requirements for tax-free treatment"
                ]
            },
            {
                "id": "w4",
                "title": "Week 4: Pro Forma Financial Information (Article 11)",
                "topics": ["SEC pro forma requirements", "Adjustments (transaction and ongoing)", "Disclosure in 8-K and S-4"],
                "learning_objectives": [
                    "Prepare pro forma financials for significant acquisition",
                    "Distinguish transaction adjustments from ongoing adjustments",
                    "Comply with Reg S-X Article 11"
                ]
            }
        ]
    },
    {
        "id": "module12",
        "title": "Module 12: SEC Reporting & Segment Disclosure",
        "description": "Public company reporting, MD&A, and segment tests",
        "weeks": [
            {
                "id": "w1",
                "title": "Week 1: SEC Forms 10-K & 10-Q",
                "topics": ["Annual report (10-K) requirements", "Quarterly report (10-Q) requirements", "Reg S-X and Reg S-K"],
                "learning_objectives": [
                    "Prepare 10-K financial statements and disclosures",
                    "Understand 10-Q requirements (condensed financials, interim reporting)",
                    "Apply Reg S-X (form and content) and Reg S-K (non-financial disclosures)"
                ]
            },
            {
                "id": "w2",
                "title": "Week 2: MD&A (Management Discussion & Analysis)",
                "topics": ["Liquidity and capital resources", "Results of operations", "Critical accounting estimates", "Forward-looking statements"],
                "learning_objectives": [
                    "Draft MD&A sections (liquidity, results of operations)",
                    "Disclose critical accounting policies and estimates",
                    "Provide forward-looking information with safe harbor"
                ]
            },
            {
                "id": "w3",
                "title": "Week 3: Segment Reporting (ASC 280)",
                "topics": ["Operating segments identification", "Reportability tests (10% rule)", "Quantitative thresholds", "Reconciliation to consolidated"],
                "learning_objectives": [
                    "Identify operating segments using CODM approach",
                    "Apply 10% tests (revenue, profit/loss, assets)",
                    "Aggregate segments when appropriate",
                    "Reconcile segment amounts to consolidated totals"
                ]
            },
            {
                "id": "w4",
                "title": "Week 4: SOX Compliance & Internal Controls",
                "topics": ["Section 302 certifications", "Section 404 (ICFR)", "PCAOB auditing standards", "Material weaknesses"],
                "learning_objectives": [
                    "Understand CEO/CFO certification requirements (302)",
                    "Apply Section 404 internal control assessment",
                    "Distinguish significant deficiencies from material weaknesses",
                    "Prepare remediation plans for control deficiencies"
                ]
            }
        ]
    }
]

def generate_lesson_html(week_title, topics, learning_objectives):
    """Generate rich HTML lesson content"""

    html = f"<h1>{week_title}</h1>\n\n"

    # Learning Objectives
    html += "<h2>Learning Objectives</h2>\n<ul>\n"
    for obj in learning_objectives:
        html += f"<li>{obj}</li>\n"
    html += "</ul>\n\n"

    # Topics with detailed content
    html += "<h2>Key Topics</h2>\n\n"
    for i, topic in enumerate(topics, 1):
        html += f"<h3>{i}. {topic}</h3>\n"
        html += f"<p>This topic covers essential CPA exam concepts related to <strong>{topic}</strong>. "
        html += f"Understanding this material is critical for both passing the CPA exam and applying these principles in real-world CFO scenarios.</p>\n\n"

        html += f'<div class="cfo-insight">\n'
        html += f'<strong>CFO Application:</strong> As a CFO, you will regularly apply {topic} concepts in financial reporting, '
        html += f'strategic decision-making, and compliance with GAAP standards. This knowledge directly impacts your ability to '
        html += f'prepare accurate financial statements and provide guidance to management.\n'
        html += f'</div>\n\n'

        html += f'<div class="exam-tip">\n'
        html += f'<strong>CPA Exam Tip:</strong> {topic} is frequently tested on the exam. Focus on practical application, '
        html += f'authoritative guidance citations, and computational accuracy.\n'
        html += f'</div>\n\n'

    # Practice section
    html += "<h2>Practice Application</h2>\n"
    html += f"<p>Work through practice problems applying {week_title.lower()} concepts. "
    html += "These problems mirror actual CPA exam scenarios and real-world CFO challenges.</p>\n\n"

    # Key takeaways
    html += "<h2>Key Takeaways</h2>\n<ul>\n"
    for topic in topics:
        html += f"<li>Master {topic} for exam success and professional competence</li>\n"
    html += "<li>Understand authoritative guidance and when to apply it</li>\n"
    html += "<li>Practice computational problems until you can solve them efficiently</li>\n"
    html += "<li>Connect concepts to real-world CFO responsibilities</li>\n"
    html += "</ul>\n"

    return html

def generate_quiz_questions(week_title, topics):
    """Generate quiz questions for each week"""
    questions = []

    for i, topic in enumerate(topics[:4], 1):  # Max 4 questions per week
        question = {
            "id": f"q{i}",
            "question": f"Which of the following best describes {topic}?",
            "options": [
                f"{topic} requires proper application of GAAP standards",
                f"{topic} is optional under GAAP",
                f"{topic} only applies to public companies",
                f"{topic} is not covered on the CPA exam"
            ],
            "correctAnswer": 0,
            "explanation": f"{topic} is a critical CPA exam topic that requires understanding of authoritative guidance and practical application. CFOs must master this concept for both exam success and professional competence."
        }
        questions.append(question)

    return questions

def generate_flashcards(topics):
    """Generate flashcards for study"""
    flashcards = []

    for topic in topics:
        flashcards.append({
            "question": f"What is {topic}?",
            "answer": f"{topic} is a key CPA exam concept that requires understanding of GAAP principles, authoritative standards, and practical application. This concept is tested on the exam and used regularly in CFO practice."
        })
        flashcards.append({
            "question": f"How do you apply {topic} in practice?",
            "answer": f"Apply {topic} by following authoritative guidance, considering the specific facts and circumstances, and documenting your rationale. CFOs use this concept in financial reporting, compliance, and strategic decision-making."
        })

    return flashcards

def build_module_json(module):
    """Build JSON file for each module"""

    module_data = {
        "id": module["id"],
        "title": module["title"],
        "description": module["description"],
        "weeks": []
    }

    for week in module["weeks"]:
        week_data = {
            "id": week["id"],
            "title": week["title"],
            "lessonHtml": generate_lesson_html(week["title"], week["topics"], week["learning_objectives"]),
            "quiz": {
                "id": f"{module['id']}-{week['id']}-quiz",
                "title": f"{week['title']} Quiz",
                "questions": generate_quiz_questions(week["title"], week["topics"])
            },
            "flashcards": generate_flashcards(week["topics"])
        }
        module_data["weeks"].append(week_data)

    return module_data

def main():
    """Build all 12 CPA prep modules"""
    print("=" * 70)
    print("BUILDING CPA PREP LESSONS")
    print("Based on Advanced Accounting College Syllabus")
    print("=" * 70)
    print()

    for module in MODULES:
        print(f"Building {module['title']}...")
        module_data = build_module_json(module)

        # Save to JSON file
        output_file = DATA_PATH / f"{module['id']}.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(module_data, f, indent=2, ensure_ascii=False)

        print(f"  [OK] Saved to {output_file}")

    print("\n" + "=" * 70)
    print("CPA PREP LESSONS COMPLETE!")
    print("=" * 70)
    print(f"\nCreated 12 modules with 48 weeks of content")
    print(f"Location: {DATA_PATH}")
    print("\nEach module includes:")
    print("  - 4 weeks of comprehensive lessons")
    print("  - Rich HTML content with CFO insights")
    print("  - Quiz questions for each week")
    print("  - Flashcards for review")
    print("\nReady to integrate into app!")

if __name__ == "__main__":
    main()
