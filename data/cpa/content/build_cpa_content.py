#!/usr/bin/env python3
"""
CPA Content Generator - Master Builder Script
Generates all CPA exam content: items, explanations, exams, labs, voice scripts
"""

import yaml
import json
import csv
import random
from pathlib import Path
from typing import List, Dict, Any
from datetime import datetime

# Base paths
BASE_PATH = Path(r"C:\Users\owner\OneDrive\Apps\Accountrix CPA Prep\CONTENT")
ITEMS_PATH = BASE_PATH / "items"
EXAMS_PATH = BASE_PATH / "exams"
EXPLANATIONS_PATH = BASE_PATH / "explanations"
LABS_PATH = BASE_PATH / "labs"
VOICE_PATH = BASE_PATH / "voice_cram" / "scripts"
REPORTS_PATH = BASE_PATH / "reports"
DIAGNOSTICS_PATH = BASE_PATH / "diagnostics"

# Ensure all directories exist
for path in [ITEMS_PATH, EXAMS_PATH, EXPLANATIONS_PATH, LABS_PATH, VOICE_PATH, REPORTS_PATH, DIAGNOSTICS_PATH]:
    path.mkdir(parents=True, exist_ok=True)

# ============================================================================
# BLUEPRINT DEFINITIONS - 2025 AICPA CPA Evolution
# ============================================================================

BLUEPRINTS = {
    "AUD": {
        "name": "Auditing and Attestation",
        "areas": {
            "Ethics, Professional Responsibilities & General Principles": 0.20,
            "Assessing Risk & Developing Responses": 0.30,
            "Performing Further Procedures & Obtaining Evidence": 0.35,
            "Forming Conclusions & Reporting": 0.15
        },
        "target_mcq": 500,
        "target_tbs": 60
    },
    "FAR": {
        "name": "Financial Accounting and Reporting",
        "areas": {
            "Financial Reporting Framework & Standards": 0.25,
            "Select Financial Statement Accounts": 0.30,
            "Select Transactions": 0.25,
            "State & Local Governments": 0.10,
            "Not-for-Profit Entities": 0.10
        },
        "target_mcq": 650,
        "target_tbs": 80
    },
    "REG": {
        "name": "Regulation",
        "areas": {
            "Ethics, Professional Responsibilities & Federal Tax Procedures": 0.15,
            "Business Law": 0.15,
            "Federal Taxation of Individuals": 0.25,
            "Federal Taxation of Entities": 0.35,
            "Federal Taxation of Property Transactions": 0.10
        },
        "target_mcq": 500,
        "target_tbs": 60
    },
    "BAR": {
        "name": "Business Analysis and Reporting",
        "areas": {
            "Complex Financial Reporting": 0.40,
            "Financial Statement Analysis": 0.25,
            "Data Analytics": 0.20,
            "Strategic Planning": 0.15
        },
        "target_mcq": 350,
        "target_tbs": 50
    },
    "ISC": {
        "name": "Information Systems and Controls",
        "areas": {
            "Information System Operations": 0.30,
            "Information System Security": 0.25,
            "System Development & Maintenance": 0.25,
            "Data Governance & Analytics": 0.20
        },
        "target_mcq": 150,
        "target_tbs": 20
    },
    "TCP": {
        "name": "Tax Compliance and Planning",
        "areas": {
            "Individual Tax Compliance": 0.25,
            "Entity Tax Compliance": 0.30,
            "Property Tax Compliance": 0.15,
            "Tax Planning & Strategy": 0.30
        },
        "target_mcq": 150,
        "target_tbs": 20
    }
}

DIFFICULTY_MIX = {
    "Easy": 0.25,
    "Medium": 0.50,
    "Hard": 0.25
}

# ============================================================================
# CONTENT TEMPLATES - Topic-specific question generators
# ============================================================================

AUD_TOPICS = {
    "Ethics": {
        "templates": [
            {
                "stem": "An auditor discovered that the client's CFO owns {percent}% of the auditing firm. Which independence rule is violated?",
                "correct": "Direct financial interest - independence is impaired",
                "distractors": [
                    "Indirect financial interest - independence not impaired if immaterial",
                    "No violation - ownership under 50%",
                    "Contingent fee arrangement violation"
                ],
                "explanation": "AICPA Code 1.200.001 prohibits direct financial interests regardless of materiality. CFO ownership in audit firm creates impermissible direct interest.",
                "refs": ["ET 1.200.001", "ET 1.110.010"]
            },
            {
                "stem": "CPA firm provides {service} services to an audit client. Is independence impaired?",
                "correct": "Yes, management decision-making impairs independence",
                "distractors": [
                    "No, if fee is less than 10% of total fees",
                    "No, if pre-approved by audit committee",
                    "Only impaired for public companies"
                ],
                "explanation": "ET 1.295 prohibits services where CPA makes management decisions for audit clients. This creates self-review threat.",
                "refs": ["ET 1.295.030", "ET 1.295.040"]
            }
        ],
        "variables": {
            "percent": [5, 10, 15, 25, 40],
            "service": ["bookkeeping", "payroll processing", "tax preparation", "IT system selection", "hiring decisions"]
        }
    },
    "Risk Assessment": {
        "templates": [
            {
                "stem": "Company operates in {country} with high corruption index and {control} controls. What is inherent risk?",
                "correct": "High - operating environment and weak controls increase risk",
                "distractors": [
                    "Low - can be mitigated by substantive procedures",
                    "Medium - fraud is rare in this industry",
                    "Depends on prior year results"
                ],
                "explanation": "AU-C 315 requires assessment of inherent risk before considering controls. Corrupt environment increases inherent risk independent of controls.",
                "refs": ["AU-C 315.11", "AU-C 315.A42"]
            }
        ],
        "variables": {
            "country": ["Country X", "an emerging market", "a high-risk jurisdiction"],
            "control": ["weak", "minimal", "poorly designed"]
        }
    },
    "Sampling": {
        "templates": [
            {
                "stem": "Population {pop_size}, tolerable misstatement {tm}, expected misstatement {em}. Calculate sample size for substantive test (assume sampling risk {risk}%).",
                "correct": "{calculated_size}",
                "distractors": ["{calc_minus_20}", "{calc_plus_30}", "{calc_times_2}"],
                "explanation": "AU-C 530: Sample size increases when tolerable misstatement decreases, expected misstatement increases, or acceptable sampling risk decreases.",
                "refs": ["AU-C 530.A11", "AU-C 530.A12"],
                "formula": "n ≈ (pop_size * RF) / tolerable_misstatement, adjusted for expected misstatement"
            }
        ],
        "variables": {
            "pop_size": [1000, 5000, 10000],
            "tm": [50000, 100000, 250000],
            "em": [10000, 25000, 50000],
            "risk": [5, 10]
        }
    }
}

FAR_TOPICS = {
    "Leases (ASC 842)": {
        "templates": [
            {
                "stem": "Lessee enters {term}-year lease, annual payments ${payment}, IBR {rate}%, no initial costs. Calculate initial lease liability.",
                "correct": "${pv_calculated}",
                "distractors": ["${payment * term}", "${pv_calculated * 1.06}", "${payment * (term - 1)}"],
                "explanation": "ASC 842-20: Lease liability = PV of lease payments using IBR. PV ordinary annuity: payment × PV factor.",
                "refs": ["ASC 842-20-30-1", "ASC 842-20-30-3"],
                "formula": "PV = Payment × [(1 - (1 + r)^-n) / r]"
            }
        ],
        "variables": {
            "term": [3, 5, 7, 10],
            "payment": [25000, 50000, 75000, 100000],
            "rate": [4, 5, 6, 7, 8]
        }
    },
    "Revenue (ASC 606)": {
        "templates": [
            {
                "stem": "Contract price ${total}, standalone selling prices: Product ${prod_price}, Service ${serv_price}, Warranty ${warr_price}. Allocate transaction price to Product.",
                "correct": "${allocated_prod}",
                "distractors": ["${prod_price}", "${allocated_prod * 1.1}", "${total * 0.5}"],
                "explanation": "ASC 606-10-32-31: Allocate based on relative standalone selling prices. Product allocation = (Product SSP / Total SSP) × Transaction Price.",
                "refs": ["ASC 606-10-32-28", "ASC 606-10-32-31"]
            }
        ],
        "variables": {
            "total": [100000, 250000, 500000],
            "prod_price": [60000, 150000, 300000],
            "serv_price": [30000, 75000, 150000],
            "warr_price": [10000, 25000, 50000]
        }
    },
    "Consolidations (ASC 810)": {
        "templates": [
            {
                "stem": "Parent owns {pct}% of Sub. Sub reports NI ${ni}, dividends ${div}. Calculate non-controlling interest in NI.",
                "correct": "${nci_ni}",
                "distractors": ["${ni}", "${div * (100 - pct) / 100}", "0"],
                "explanation": "ASC 810-10-45-19: NCI in net income = Sub's NI × NCI ownership %. NCI share: (100% - parent %) × NI.",
                "refs": ["ASC 810-10-45-19", "ASC 810-10-45-20"]
            }
        ],
        "variables": {
            "pct": [60, 70, 75, 80, 90],
            "ni": [100000, 250000, 500000],
            "div": [20000, 50000, 100000]
        }
    },
    "Government (GASB)": {
        "templates": [
            {
                "stem": "City received ${amt} grant for {purpose}. Grant requires expenditure before reimbursement. When recognize revenue?",
                "correct": "When eligibility requirements met (expenditure incurred)",
                "distractors": [
                    "When grant awarded",
                    "When cash received",
                    "Ratably over grant period"
                ],
                "explanation": "GASB 33: Revenue recognition for reimbursement grants occurs when eligibility requirements (including expenditure) are met.",
                "refs": ["GASB 33 para 16", "GASB 33 para 18"]
            }
        ],
        "variables": {
            "amt": [100000, 500000, 1000000],
            "purpose": ["road construction", "police equipment", "education programs"]
        }
    }
}

REG_TOPICS = {
    "Individual Tax - AGI": {
        "templates": [
            {
                "stem": "Taxpayer: Wages ${wages}, SE income ${se_income}, IRA contribution ${ira}, student loan interest ${sli}. Calculate AGI.",
                "correct": "${agi_calc}",
                "distractors": ["${wages + se_income}", "${agi_calc + ira + sli}", "${wages}"],
                "explanation": "IRC §62: AGI = Gross income - above-the-line deductions. SE tax deduction (SE inc × 0.9235 × 15.3% × 0.5), IRA, student loan interest are above-line.",
                "refs": ["IRC §62(a)", "IRC §164(f)", "IRC §221"],
                "formula": "AGI = Wages + SE Inc - SE tax deduction - IRA - Student loan interest"
            }
        ],
        "variables": {
            "wages": [80000, 100000, 150000],
            "se_income": [30000, 50000, 75000],
            "ira": [5000, 6000, 7000],
            "sli": [1000, 2000, 2500]
        }
    },
    "Entity Tax - Corp": {
        "templates": [
            {
                "stem": "C-Corp: Gross income ${gi}, deductible expenses ${exp}, dividends received ${div} from {pct}%-owned corp, charitable contribution ${char}. Calculate TI before DRD and charity.",
                "correct": "${ti_before}",
                "distractors": ["${gi - exp}", "${gi - exp - div}", "${gi}"],
                "explanation": "IRC §63: TI = GI - deductions. DRD and charitable (limited to 10% TI) calculated after initial TI determination.",
                "refs": ["IRC §63", "IRC §243", "IRC §170(b)(2)"]
            }
        ],
        "variables": {
            "gi": [1000000, 2000000, 5000000],
            "exp": [600000, 1200000, 3000000],
            "div": [100000, 250000, 500000],
            "pct": [15, 25, 80],
            "char": [30000, 50000, 100000]
        }
    },
    "Business Law - Contracts": {
        "templates": [
            {
                "stem": "Party A offers to sell equipment for ${price}. Party B responds: 'I accept, ship by {date}.' Is there a contract?",
                "correct": "Yes, acceptance with immaterial additional term under UCC",
                "distractors": [
                    "No, mirror image rule violated",
                    "No, shipping term is material modification",
                    "Yes, but only if Party A agrees to shipping date"
                ],
                "explanation": "UCC §2-207: Between merchants, additional terms become part of contract unless material. Shipping date is typically not material.",
                "refs": ["UCC §2-207(2)", "UCC §2-206"]
            }
        ],
        "variables": {
            "price": [10000, 25000, 50000],
            "date": ["January 15", "within 30 days", "by end of quarter"]
        }
    }
}

BAR_TOPICS = {
    "Business Combinations (ASC 805)": {
        "templates": [
            {
                "stem": "Acquirer purchases 100% of Target for ${price}. Target's book value ${bv}, FV of identifiable net assets ${fv}. Calculate goodwill.",
                "correct": "${goodwill}",
                "distractors": ["${price - bv}", "0", "${price}"],
                "explanation": "ASC 805-30-30-1: Goodwill = Consideration transferred - FV of identifiable net assets acquired. Book value is irrelevant.",
                "refs": ["ASC 805-30-30-1", "ASC 805-20-30-1"],
                "formula": "Goodwill = Purchase Price - FV Identifiable Net Assets"
            }
        ],
        "variables": {
            "price": [5000000, 10000000, 25000000],
            "bv": [3000000, 7000000, 15000000],
            "fv": [4000000, 8000000, 20000000]
        }
    },
    "Foreign Currency (ASC 830)": {
        "templates": [
            {
                "stem": "Foreign sub functional currency is {curr}. Year-end assets ${assets} at rate {rate_end}, avg rate {rate_avg}. Parent reports in USD. Translation or remeasurement?",
                "correct": "Translation - use current rate method, assets at year-end rate",
                "distractors": [
                    "Remeasurement - use temporal method",
                    "Translation - use average rate for all assets",
                    "No translation - functional currency = reporting currency"
                ],
                "explanation": "ASC 830-30: When foreign currency is functional currency, use translation (current rate method). Monetary & nonmonetary assets at current rate.",
                "refs": ["ASC 830-30-45-3", "ASC 830-30-45-9"]
            }
        ],
        "variables": {
            "curr": ["Euro", "British Pound", "local currency"],
            "assets": [1000000, 5000000, 10000000],
            "rate_end": [1.10, 1.15, 0.85],
            "rate_avg": [1.12, 1.18, 0.88]
        }
    },
    "Financial Ratios": {
        "templates": [
            {
                "stem": "Current assets ${ca}, inventory ${inv}, current liabilities ${cl}. Calculate quick ratio.",
                "correct": "{quick_ratio}",
                "distractors": ["{current_ratio}", "{ca / cl}", "{(ca - inv/2) / cl}"],
                "explanation": "Quick ratio = (Current assets - Inventory) / Current liabilities. Measures immediate liquidity without inventory liquidation.",
                "refs": ["Financial Analysis Standard"],
                "formula": "Quick Ratio = (CA - Inventory) / CL"
            }
        ],
        "variables": {
            "ca": [500000, 1000000, 2000000],
            "inv": [200000, 400000, 800000],
            "cl": [300000, 600000, 1200000]
        }
    }
}

# ============================================================================
# ITEM GENERATION FUNCTIONS
# ============================================================================

def generate_mcq_id(section: str, topic_short: str, number: int) -> str:
    """Generate unique MCQ ID"""
    return f"{section}-MCQ-{topic_short.upper()[:4]}-{number:04d}"

def generate_tbs_id(section: str, topic_short: str, number: int) -> str:
    """Generate unique TBS ID"""
    return f"{section}-TBS-{topic_short.upper()[:4]}-{number:04d}"

def calculate_pv_annuity(payment: float, rate: float, periods: int) -> float:
    """Calculate present value of ordinary annuity"""
    if rate == 0:
        return payment * periods
    pv_factor = (1 - (1 + rate) ** -periods) / rate
    return payment * pv_factor

def generate_mcq_from_template(section: str, topic: str, template: Dict, variables: Dict, item_num: int, difficulty: str) -> Dict:
    """Generate a single MCQ from template with variable substitution"""

    # Select random values for variables
    var_values = {}
    for var_name, var_options in variables.items():
        var_values[var_name] = random.choice(var_options)

    # Substitute variables in stem
    stem = template["stem"]
    for var_name, var_value in var_values.items():
        stem = stem.replace(f"{{{var_name}}}", str(var_value))

    # Calculate correct answer if formula present
    correct_text = template["correct"]
    if "formula" in template:
        # Handle formulas (simplified - would need more complex eval for real calculations)
        if "pv_calculated" in correct_text:
            pv = calculate_pv_annuity(
                var_values.get("payment", 50000),
                var_values.get("rate", 6) / 100,
                var_values.get("term", 5)
            )
            correct_text = f"${pv:,.0f}"

    # Build options
    options = [{"text": correct_text, "key": True}]
    for distractor in template["distractors"]:
        dist_text = distractor
        for var_name, var_value in var_values.items():
            dist_text = dist_text.replace(f"{{{var_name}}}", str(var_value))
        options.append({"text": dist_text, "key": False})

    # Shuffle options
    random.shuffle(options)

    # Build item
    item = {
        "id": generate_mcq_id(section, topic.split()[0], item_num),
        "section": section,
        "type": "MCQ",
        "difficulty": difficulty,
        "blueprint_area": topic,
        "topic": topic,
        "learning_obj": template.get("learning_obj", f"Apply {topic} concepts"),
        "stem": stem,
        "options": options,
        "explanation": template["explanation"],
        "refs": template["refs"]
    }

    return item

def generate_section_items(section: str, topics_dict: Dict, target_mcq: int, target_tbs: int) -> List[Dict]:
    """Generate all items for a section"""
    items = []

    # Calculate items per topic
    num_topics = len(topics_dict)
    mcq_per_topic = target_mcq // num_topics
    tbs_per_topic = target_tbs // num_topics

    item_counter = 1

    for topic_name, topic_data in topics_dict.items():
        # Determine difficulty split for this topic
        easy_count = int(mcq_per_topic * DIFFICULTY_MIX["Easy"])
        medium_count = int(mcq_per_topic * DIFFICULTY_MIX["Medium"])
        hard_count = mcq_per_topic - easy_count - medium_count

        # Generate MCQs
        for difficulty, count in [("Easy", easy_count), ("Medium", medium_count), ("Hard", hard_count)]:
            for _ in range(count):
                template = random.choice(topic_data["templates"])
                item = generate_mcq_from_template(
                    section, topic_name, template,
                    topic_data.get("variables", {}),
                    item_counter, difficulty
                )
                items.append(item)
                item_counter += 1

        # Generate TBS (simplified for now - would need more complex templates)
        for tbs_num in range(tbs_per_topic):
            tbs_item = {
                "id": generate_tbs_id(section, topic_name.split()[0], tbs_num + 1),
                "section": section,
                "type": "TBS",
                "difficulty": random.choice(["Easy", "Medium", "Medium", "Hard"]),  # weighted toward medium
                "blueprint_area": topic_name,
                "topic": topic_name,
                "learning_obj": f"Apply {topic_name} to complex scenario",
                "scenario": f"Multi-step problem requiring {topic_name} analysis",
                "tasks": [
                    f"Complete calculations for {topic_name}",
                    "Prepare supporting schedule",
                    "Document conclusion"
                ],
                "rubric": {
                    "calculations": 12,
                    "schedule": 5,
                    "conclusion": 3
                },
                "refs": topic_data["templates"][0]["refs"]
            }
            items.append(tbs_item)

    return items

# ============================================================================
# BUILD ITEM BANKS
# ============================================================================

def build_aud_items():
    """Build AUD item bank"""
    print("Building AUD items...")
    items = generate_section_items("AUD", AUD_TOPICS, 500, 60)

    # Save to YAML
    output_path = ITEMS_PATH / "items_AUD.yaml"
    with open(output_path, 'w') as f:
        yaml.dump_all(items, f, default_flow_style=False, sort_keys=False)

    print(f"[OK] Created {len(items)} AUD items at {output_path}")
    return items

def build_far_items():
    """Build FAR item bank"""
    print("Building FAR items...")
    items = generate_section_items("FAR", FAR_TOPICS, 650, 80)

    output_path = ITEMS_PATH / "items_FAR.yaml"
    with open(output_path, 'w') as f:
        yaml.dump_all(items, f, default_flow_style=False, sort_keys=False)

    print(f"[OK] Created {len(items)} FAR items at {output_path}")
    return items

def build_reg_items():
    """Build REG item bank"""
    print("Building REG items...")
    items = generate_section_items("REG", REG_TOPICS, 500, 60)

    output_path = ITEMS_PATH / "items_REG.yaml"
    with open(output_path, 'w') as f:
        yaml.dump_all(items, f, default_flow_style=False, sort_keys=False)

    print(f"[OK] Created {len(items)} REG items at {output_path}")
    return items

def build_bar_items():
    """Build BAR item bank"""
    print("Building BAR items...")
    items = generate_section_items("BAR", BAR_TOPICS, 350, 50)

    output_path = ITEMS_PATH / "items_BAR.yaml"
    with open(output_path, 'w') as f:
        yaml.dump_all(items, f, default_flow_style=False, sort_keys=False)

    print(f"[OK] Created {len(items)} BAR items at {output_path}")
    return items

def build_optional_items():
    """Build ISC and TCP optional item banks (minimal for now)"""
    print("Building ISC and TCP optional items...")

    # ISC - simplified
    isc_items = []
    for i in range(170):  # 150 MCQ + 20 TBS
        item_type = "MCQ" if i < 150 else "TBS"
        item = {
            "id": f"ISC-{item_type}-{i+1:04d}",
            "section": "ISC",
            "type": item_type,
            "difficulty": random.choice(["Easy", "Medium", "Hard"]),
            "blueprint_area": "Information System Security",
            "topic": "IT Controls",
            "stem": "ISC question placeholder" if item_type == "MCQ" else None,
            "scenario": "ISC TBS placeholder" if item_type == "TBS" else None
        }
        isc_items.append(item)

    with open(ITEMS_PATH / "items_ISC.yaml", 'w') as f:
        yaml.dump_all(isc_items, f, default_flow_style=False)

    # TCP - simplified
    tcp_items = []
    for i in range(170):  # 150 MCQ + 20 TBS
        item_type = "MCQ" if i < 150 else "TBS"
        item = {
            "id": f"TCP-{item_type}-{i+1:04d}",
            "section": "TCP",
            "type": item_type,
            "difficulty": random.choice(["Easy", "Medium", "Hard"]),
            "blueprint_area": "Tax Planning & Strategy",
            "topic": "Advanced Tax",
            "stem": "TCP question placeholder" if item_type == "MCQ" else None,
            "scenario": "TCP TBS placeholder" if item_type == "TBS" else None
        }
        tcp_items.append(item)

    with open(ITEMS_PATH / "items_TCP.yaml", 'w') as f:
        yaml.dump_all(tcp_items, f, default_flow_style=False)

    print(f"[OK] Created ISC and TCP optional items")

# ============================================================================
# BUILD EXPLANATIONS
# ============================================================================

def build_explanations(all_items: Dict[str, List[Dict]]):
    """Build explanations CSV for all items"""
    print("Building explanations...")

    for section, items in all_items.items():
        output_path = EXPLANATIONS_PATH / f"explanations_{section}.csv"

        with open(output_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['id', 'why_correct', 'why_others_wrong', 'cites'])

            for item in items:
                if item['type'] == 'MCQ':
                    item_id = item['id']
                    explanation = item.get('explanation', 'Explanation pending')

                    # Extract correct answer
                    correct_option = next((opt['text'] for opt in item.get('options', []) if opt.get('key')), 'N/A')

                    # Extract wrong answers
                    wrong_options = [opt['text'] for opt in item.get('options', []) if not opt.get('key')]
                    why_wrong = '; '.join(wrong_options[:2]) if wrong_options else 'See explanation'

                    # Citations
                    cites = ', '.join(item.get('refs', []))

                    writer.writerow([item_id, explanation, why_wrong, cites])

        print(f"[OK] Created explanations for {section} at {output_path}")

# ============================================================================
# BUILD EXAM FORMS
# ============================================================================

def build_exam_forms(all_items: Dict[str, List[Dict]]):
    """Build 3 exam forms per section"""
    print("Building exam forms...")

    exam_structure = {
        "AUD": {"mcq_count": 72, "tbs_count": 8, "time_minutes": 240},
        "FAR": {"mcq_count": 50, "tbs_count": 7, "time_minutes": 240},
        "REG": {"mcq_count": 72, "tbs_count": 8, "time_minutes": 240},
        "BAR": {"mcq_count": 50, "tbs_count": 7, "time_minutes": 240}
    }

    for section, items in all_items.items():
        if section in ["ISC", "TCP"]:
            continue  # Skip optional for now

        mcq_items = [item for item in items if item['type'] == 'MCQ']
        tbs_items = [item for item in items if item['type'] == 'TBS']

        structure = exam_structure[section]

        for form_num in range(1, 4):
            # Sample items for this form
            selected_mcqs = random.sample(mcq_items, min(structure['mcq_count'], len(mcq_items)))
            selected_tbs = random.sample(tbs_items, min(structure['tbs_count'], len(tbs_items)))

            exam_form = {
                "section": section,
                "form_id": f"{section}_form_{form_num:03d}",
                "mcq_ids": [item['id'] for item in selected_mcqs],
                "tbs_ids": [item['id'] for item in selected_tbs],
                "time_limit_minutes": structure['time_minutes'],
                "created_date": datetime.now().isoformat()
            }

            output_path = EXAMS_PATH / f"{section}_form_{form_num:03d}.json"
            with open(output_path, 'w') as f:
                json.dump(exam_form, f, indent=2)

            print(f"[OK] Created {section} Form {form_num}")

# ============================================================================
# MAIN EXECUTION
# ============================================================================

def main():
    """Main execution function"""
    print("=" * 70)
    print("CPA CONTENT GENERATOR - MASTER BUILDER")
    print("=" * 70)
    print()

    # Build item banks
    print("\n--- BUILDING ITEM BANKS ---")
    aud_items = build_aud_items()
    far_items = build_far_items()
    reg_items = build_reg_items()
    bar_items = build_bar_items()
    build_optional_items()

    all_items = {
        "AUD": aud_items,
        "FAR": far_items,
        "REG": reg_items,
        "BAR": bar_items
    }

    # Build explanations
    print("\n--- BUILDING EXPLANATIONS ---")
    build_explanations(all_items)

    # Build exam forms
    print("\n--- BUILDING EXAM FORMS ---")
    build_exam_forms(all_items)

    print("\n" + "=" * 70)
    print("CONTENT GENERATION COMPLETE!")
    print("=" * 70)
    print(f"\nTotal items created:")
    print(f"  AUD: {len(aud_items)} items")
    print(f"  FAR: {len(far_items)} items")
    print(f"  REG: {len(reg_items)} items")
    print(f"  BAR: {len(bar_items)} items")
    print(f"  ISC: 170 items (optional)")
    print(f"  TCP: 170 items (optional)")
    print(f"\nOutput location: {BASE_PATH}")
    print("\nNext steps:")
    print("  1. Review items for quality")
    print("  2. Run: python build_labs_and_voice.py")
    print("  3. Run: python generate_qc_reports.py")

if __name__ == "__main__":
    main()
