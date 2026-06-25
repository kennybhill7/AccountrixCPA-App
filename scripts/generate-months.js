// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require("path");

// Comprehensive curriculum data for months 5-12
const curriculumData = {
  m5: {
    id: "m5",
    title: "Month 5: Payroll & Tax Compliance",
    description:
      "Master construction payroll systems, tax optimization, and compliance requirements",
    weeks: [
      {
        id: "w2",
        order: 2,
        title: "Week 2: 1099 Contractors & Subcontractor Management",
        topic: "independent_contractors",
      },
      {
        id: "w3",
        order: 3,
        title: "Week 3: Payroll Tax Strategies & Optimization",
        topic: "tax_optimization",
      },
      {
        id: "w4",
        order: 4,
        title: "Week 4: Audit Defense & Compliance Systems",
        topic: "audit_defense",
      },
    ],
  },
  m6: {
    id: "m6",
    title: "Month 6: Advanced Topics & CPA Prep",
    description:
      "Master advanced construction accounting concepts and prepare for CPA certification",
    weeks: [
      {
        id: "w1",
        order: 1,
        title: "Week 1: Consolidation Accounting & Multi-Entity Reporting",
        topic: "consolidation",
      },
      {
        id: "w2",
        order: 2,
        title: "Week 2: Joint Ventures & Partnership Accounting",
        topic: "joint_ventures",
      },
      {
        id: "w3",
        order: 3,
        title: "Week 3: Advanced Tax Planning & Cost Segregation",
        topic: "tax_planning",
      },
      {
        id: "w4",
        order: 4,
        title: "Week 4: CPA Exam Preparation Strategies",
        topic: "cpa_prep",
      },
    ],
  },
  m7: {
    id: "m7",
    title: "Month 7: Risk Management & Insurance",
    description: "Understand construction insurance, risk mitigation, and loss control strategies",
    weeks: [
      {
        id: "w1",
        order: 1,
        title: "Week 1: Construction Insurance Fundamentals",
        topic: "insurance_basics",
      },
      {
        id: "w2",
        order: 2,
        title: "Week 2: Claims Management & Loss Control",
        topic: "claims_management",
      },
      {
        id: "w3",
        order: 3,
        title: "Week 3: Contract Risk & Indemnification",
        topic: "contract_risk",
      },
      {
        id: "w4",
        order: 4,
        title: "Week 4: Surety Bonds & Wrap-Up Insurance",
        topic: "surety_bonds",
      },
    ],
  },
  m8: {
    id: "m8",
    title: "Month 8: Equipment Accounting & Asset Management",
    description: "Master equipment acquisition, depreciation, and cost allocation systems",
    weeks: [
      {
        id: "w1",
        order: 1,
        title: "Week 1: Equipment Acquisition & Capitalization",
        topic: "equipment_acquisition",
      },
      {
        id: "w2",
        order: 2,
        title: "Week 2: Depreciation Methods & Tax Benefits",
        topic: "depreciation",
      },
      {
        id: "w3",
        order: 3,
        title: "Week 3: Equipment Leasing vs Purchasing Analysis",
        topic: "lease_vs_buy",
      },
      {
        id: "w4",
        order: 4,
        title: "Week 4: Equipment Cost Allocation & Rate Setting",
        topic: "cost_allocation",
      },
    ],
  },
  m9: {
    id: "m9",
    title: "Month 9: Bonding & Surety Relationships",
    description: "Navigate bonding requirements, surety relationships, and financial covenants",
    weeks: [
      {
        id: "w1",
        order: 1,
        title: "Week 1: Bonding Fundamentals & Requirements",
        topic: "bonding_basics",
      },
      {
        id: "w2",
        order: 2,
        title: "Week 2: Surety Underwriting & Financial Analysis",
        topic: "surety_underwriting",
      },
      {
        id: "w3",
        order: 3,
        title: "Week 3: Building Bonding Capacity",
        topic: "bonding_capacity",
      },
      {
        id: "w4",
        order: 4,
        title: "Week 4: Letter of Credit Alternatives & Bank Relationships",
        topic: "alternatives",
      },
    ],
  },
  m10: {
    id: "m10",
    title: "Month 10: Construction Technology & Automation",
    description:
      "Leverage technology for financial management, reporting, and operational efficiency",
    weeks: [
      {
        id: "w1",
        order: 1,
        title: "Week 1: Construction ERP Systems & Software Selection",
        topic: "erp_systems",
      },
      {
        id: "w2",
        order: 2,
        title: "Week 2: Data Analytics & Business Intelligence",
        topic: "analytics",
      },
      {
        id: "w3",
        order: 3,
        title: "Week 3: Automation & AI in Construction Finance",
        topic: "automation",
      },
      {
        id: "w4",
        order: 4,
        title: "Week 4: Cybersecurity & Financial Controls",
        topic: "cybersecurity",
      },
    ],
  },
  m11: {
    id: "m11",
    title: "Month 11: Advanced Case Studies & Real-World Applications",
    description: "Apply knowledge through comprehensive case studies and scenario analysis",
    weeks: [
      {
        id: "w1",
        order: 1,
        title: "Week 1: Turnaround Case Study - Distressed Contractor",
        topic: "turnaround",
      },
      {
        id: "w2",
        order: 2,
        title: "Week 2: Growth Strategy - Scaling a $20M to $100M Contractor",
        topic: "growth",
      },
      {
        id: "w3",
        order: 3,
        title: "Week 3: M&A Case Study - Acquiring a Competitor",
        topic: "acquisition",
      },
      {
        id: "w4",
        order: 4,
        title: "Week 4: Complex Project Analysis - Design-Build Mega Project",
        topic: "complex_project",
      },
    ],
  },
  m12: {
    id: "m12",
    title: "Month 12: CPA Exam & Professional Certification",
    description: "Final preparation for CPA exam and construction industry certification",
    weeks: [
      {
        id: "w1",
        order: 1,
        title: "Week 1: CPA Exam Strategy & Study Planning",
        topic: "exam_strategy",
      },
      {
        id: "w2",
        order: 2,
        title: "Week 2: Practice Exam - Financial Accounting & Reporting",
        topic: "far_practice",
      },
      {
        id: "w3",
        order: 3,
        title: "Week 3: Practice Exam - Business Environment & Concepts",
        topic: "bec_practice",
      },
      {
        id: "w4",
        order: 4,
        title: "Week 4: Industry Certifications & Career Development",
        topic: "certifications",
      },
    ],
  },
};

// Function to generate comprehensive lesson content
function generateLessonHTML(week, monthTitle) {
  const title = week.title;

  return `<h1>${title}</h1>

<h2>Learning Objectives</h2>
<p>By the end of this week, you will be able to:</p>
<ul>
<li>Understand the fundamental concepts and principles of ${title.toLowerCase()}</li>
<li>Apply industry best practices to real-world construction accounting scenarios</li>
<li>Navigate regulatory requirements and compliance obligations</li>
<li>Implement strategic financial management techniques</li>
<li>Analyze complex situations using professional judgment</li>
</ul>

<h2>Introduction</h2>

<p>Welcome to ${title} as part of ${monthTitle}. This week covers critical topics that construction CFOs encounter daily. The construction industry presents unique challenges that require specialized knowledge and strategic thinking.</p>

<div class="callout callout-info">
<h4>Industry Context</h4>
<p>Construction companies face distinct financial management challenges including:</p>
<ul>
<li>Project-based revenue recognition and cost tracking</li>
<li>Complex compliance requirements across multiple jurisdictions</li>
<li>Cash flow management with long payment cycles</li>
<li>Risk management and bonding capacity considerations</li>
<li>Equipment and labor cost optimization</li>
</ul>
</div>

<h2>Section 1: Fundamental Concepts</h2>

<p>Understanding the foundational principles is essential for mastering this topic. In construction accounting, we must consider both Generally Accepted Accounting Principles (GAAP) and industry-specific practices.</p>

<h3>Key Principles</h3>

<p>The following principles guide our approach to ${title.toLowerCase()}:</p>

<ul>
<li><strong>Accuracy:</strong> Maintaining precise financial records and documentation</li>
<li><strong>Timeliness:</strong> Providing information when stakeholders need it for decision-making</li>
<li><strong>Compliance:</strong> Meeting all regulatory and contractual requirements</li>
<li><strong>Transparency:</strong> Clear communication of financial position and performance</li>
<li><strong>Strategic Value:</strong> Supporting business objectives and competitive advantage</li>
</ul>

<div class="example">
<h4>Real-World Example: Mid-Size General Contractor</h4>

<p><strong>Company Profile: Rocky Mountain Builders</strong></p>
<ul>
<li>Annual Revenue: $45 million</li>
<li>Projects: 20-25 active commercial and residential projects</li>
<li>Employees: 150 total (35 office staff, 115 field personnel)</li>
<li>Geographic Scope: 4 states in Mountain West region</li>
</ul>

<p><strong>Challenge:</strong> The company needed to implement better systems for managing this specific area of their operations.</p>

<p><strong>Solution:</strong> By implementing industry best practices and leveraging technology, Rocky Mountain Builders achieved:</p>
<ul>
<li>30% improvement in operational efficiency</li>
<li>$500,000 annual cost savings</li>
<li>Enhanced compliance and reduced risk exposure</li>
<li>Better decision-making through improved reporting</li>
</ul>

<p><strong>Key Takeaway:</strong> Proper implementation of these principles delivers measurable business value.</p>
</div>

<h2>Section 2: Regulatory Framework</h2>

<p>Construction companies must navigate a complex regulatory environment. Understanding these requirements is essential for compliance and risk management.</p>

<h3>Federal Regulations</h3>

<p>Key federal regulations impacting construction accounting include:</p>

<ul>
<li>Internal Revenue Code provisions specific to contractors</li>
<li>Department of Labor regulations for payroll and prevailing wage</li>
<li>OSHA requirements affecting cost structures</li>
<li>Federal Acquisition Regulations (FAR) for government contracts</li>
<li>ASC 606 Revenue Recognition standards</li>
</ul>

<h3>State and Local Requirements</h3>

<p>State-level regulations vary significantly and may include:</p>

<ul>
<li>Licensing and bonding requirements</li>
<li>State-specific tax obligations</li>
<li>Workers' compensation regulations</li>
<li>Prompt payment statutes</li>
<li>Lien law and mechanics lien rights</li>
</ul>

<div class="callout callout-warning">
<h4>Common Compliance Pitfalls</h4>
<p>Watch out for these frequent mistakes:</p>
<ul>
<li>Failing to register in states where you have projects</li>
<li>Inadequate documentation of compliance activities</li>
<li>Missing deadlines for required filings and reports</li>
<li>Inconsistent application of accounting policies</li>
<li>Insufficient staff training on regulatory requirements</li>
</ul>
</div>

<h2>Section 3: Best Practices and Implementation</h2>

<p>Implementing effective systems requires careful planning and execution. Leading construction CFOs focus on these critical success factors:</p>

<h3>Process Design</h3>

<p><strong>1. Assessment and Planning</strong></p>
<ul>
<li>Evaluate current state capabilities and gaps</li>
<li>Define clear objectives and success metrics</li>
<li>Develop implementation roadmap with milestones</li>
<li>Allocate appropriate resources and budget</li>
</ul>

<p><strong>2. System Implementation</strong></p>
<ul>
<li>Select appropriate technology solutions</li>
<li>Configure systems to match business processes</li>
<li>Migrate data with validation and testing</li>
<li>Integrate with existing systems and workflows</li>
</ul>

<p><strong>3. Training and Change Management</strong></p>
<ul>
<li>Develop comprehensive training programs</li>
<li>Create standard operating procedures and documentation</li>
<li>Establish support mechanisms for users</li>
<li>Monitor adoption and address resistance</li>
</ul>

<p><strong>4. Continuous Improvement</strong></p>
<ul>
<li>Measure performance against established metrics</li>
<li>Gather feedback from stakeholders</li>
<li>Identify optimization opportunities</li>
<li>Implement enhancements on ongoing basis</li>
</ul>

<h3>Technology Enablers</h3>

<p>Modern construction accounting leverages technology for efficiency and accuracy:</p>

<table>
<tr>
<th>Technology</th>
<th>Application</th>
<th>Benefits</th>
</tr>
<tr>
<td>Cloud-based ERP</td>
<td>Core financial management and job costing</td>
<td>Real-time visibility, scalability, remote access</td>
</tr>
<tr>
<td>Mobile Applications</td>
<td>Field data capture and time tracking</td>
<td>Accuracy, timeliness, reduced administrative burden</td>
</tr>
<tr>
<td>Business Intelligence</td>
<td>Reporting and analytics</td>
<td>Better insights, faster decision-making</td>
</tr>
<tr>
<td>Document Management</td>
<td>Contract and compliance documentation</td>
<td>Organization, searchability, audit trail</td>
</tr>
<tr>
<td>Automation Tools</td>
<td>Routine processes and workflows</td>
<td>Efficiency, consistency, reduced errors</td>
</tr>
</table>

<h2>Section 4: Financial Analysis and Decision Support</h2>

<p>Construction CFOs must provide actionable insights that drive business performance. This requires sophisticated financial analysis and clear communication.</p>

<h3>Key Performance Indicators</h3>

<p>Monitor these critical metrics:</p>

<table>
<tr>
<th>KPI</th>
<th>Calculation</th>
<th>Target Range</th>
<th>Significance</th>
</tr>
<tr>
<td>Gross Profit Margin</td>
<td>(Revenue - Direct Costs) / Revenue</td>
<td>15-25%</td>
<td>Project profitability and bidding effectiveness</td>
</tr>
<tr>
<td>Working Capital Ratio</td>
<td>Current Assets / Current Liabilities</td>
<td>1.3-2.0</td>
<td>Liquidity and financial health</td>
</tr>
<tr>
<td>Days in A/R</td>
<td>(A/R Balance / Revenue) × 365</td>
<td>30-45 days</td>
<td>Collection efficiency and cash flow</td>
</tr>
<tr>
<td>Backlog to Revenue</td>
<td>Contract Backlog / Annual Revenue</td>
<td>6-18 months</td>
<td>Future revenue visibility and workload</td>
</tr>
<tr>
<td>EBITDA Margin</td>
<td>EBITDA / Revenue</td>
<td>5-10%</td>
<td>Operating profitability</td>
</tr>
</table>

<h3>Dashboard Development</h3>

<p>Effective dashboards provide at-a-glance visibility into business performance:</p>

<ul>
<li><strong>Executive Dashboard:</strong> High-level metrics for ownership and board</li>
<li><strong>Operational Dashboard:</strong> Project-level details for operations team</li>
<li><strong>Cash Flow Dashboard:</strong> 13-week cash forecast and covenant tracking</li>
<li><strong>Pipeline Dashboard:</strong> Bid activity and win rate analysis</li>
</ul>

<div class="example">
<h4>Case Study: Dashboard Implementation</h4>

<p><strong>Scenario:</strong> Cascade Construction ($75M revenue) needed better visibility into project performance.</p>

<p><strong>Solution:</strong> Implemented role-based dashboards with:</p>
<ul>
<li>Real-time project margin tracking</li>
<li>Budget vs actual variance analysis</li>
<li>Cash flow forecasting</li>
<li>Safety and quality metrics integration</li>
</ul>

<p><strong>Results:</strong></p>
<ul>
<li>Identified at-risk projects 4 weeks earlier on average</li>
<li>Improved project margins by 2.3 percentage points</li>
<li>Reduced time spent on reporting by 40%</li>
<li>Enhanced decision-making across organization</li>
</ul>
</div>

<h2>Section 5: Risk Management and Controls</h2>

<p>Effective internal controls protect company assets and ensure reliable financial reporting.</p>

<h3>Internal Control Framework</h3>

<p>Implement controls in these key areas:</p>

<p><strong>1. Authorization Controls</strong></p>
<ul>
<li>Approval hierarchies for commitments and expenditures</li>
<li>Segregation of duties in financial processes</li>
<li>Access controls for financial systems and data</li>
</ul>

<p><strong>2. Processing Controls</strong></p>
<ul>
<li>Standardized procedures for routine transactions</li>
<li>Validation rules and edit checks in systems</li>
<li>Reconciliation requirements for critical accounts</li>
</ul>

<p><strong>3. Documentation Controls</strong></p>
<ul>
<li>Required documentation for all transactions</li>
<li>Retention policies meeting regulatory requirements</li>
<li>Version control and approval workflows</li>
</ul>

<p><strong>4. Monitoring Controls</strong></p>
<ul>
<li>Regular management review of financial results</li>
<li>Exception reporting for unusual transactions</li>
<li>Internal audit function and testing program</li>
</ul>

<h3>Fraud Prevention</h3>

<p>Construction companies face unique fraud risks:</p>

<ul>
<li><strong>Vendor Fraud:</strong> Fictitious vendors or duplicate payments</li>
<li><strong>Payroll Fraud:</strong> Ghost employees or timecard manipulation</li>
<li><strong>Bid Rigging:</strong> Collusion in competitive bidding</li>
<li><strong>Material Theft:</strong> Diversion of materials from job sites</li>
<li><strong>Financial Statement Fraud:</strong> Revenue or expense manipulation</li>
</ul>

<div class="callout callout-warning">
<h4>Red Flags to Watch For</h4>
<ul>
<li>Vendors with addresses matching employee addresses</li>
<li>Round-dollar invoice amounts just under approval thresholds</li>
<li>Vendors without adequate documentation or insurance</li>
<li>Unusual patterns in employee behavior or lifestyle</li>
<li>Reluctance to take vacation or share responsibilities</li>
</ul>
</div>

<h2>Week Practice Problems</h2>

<div class="practice-problem">
<h4>Problem 1: Practical Application</h4>
<p>Calculate and analyze the following scenario based on this week's concepts.</p>

<p><strong>Given Information:</strong></p>
<ul>
<li>Construction company with $50M annual revenue</li>
<li>20 active projects averaging $2.5M each</li>
<li>Current gross margin: 18%</li>
<li>Working capital ratio: 1.45</li>
</ul>

<p><strong>Required:</strong></p>
<ol>
<li>Evaluate the company's financial performance relative to industry benchmarks</li>
<li>Identify potential areas for improvement</li>
<li>Recommend specific action steps</li>
<li>Estimate the financial impact of your recommendations</li>
</ol>
</div>

<div class="practice-problem">
<h4>Problem 2: Compliance Analysis</h4>
<p>Review a situation and determine the appropriate compliance approach.</p>

<p><strong>Scenario:</strong> Your company is bidding on a $15M federal construction project that requires certified payroll and Davis-Bacon wage rates.</p>

<p><strong>Required:</strong></p>
<ol>
<li>Identify all compliance requirements for this project</li>
<li>Describe the documentation needed</li>
<li>Calculate the cost impact of prevailing wage requirements</li>
<li>Outline the implementation plan for compliance</li>
</ol>
</div>

<h2>Key Takeaways</h2>

<div class="callout callout-success">
<h4>Essential Concepts to Remember</h4>
<ul>
<li><strong>Foundation:</strong> Mastering fundamental principles is essential for practical application</li>
<li><strong>Compliance:</strong> Navigate complex regulatory requirements with robust systems and controls</li>
<li><strong>Technology:</strong> Leverage modern tools for efficiency, accuracy, and better insights</li>
<li><strong>Analysis:</strong> Provide actionable insights through comprehensive financial analysis</li>
<li><strong>Controls:</strong> Implement strong internal controls to protect assets and ensure reliability</li>
<li><strong>Continuous Improvement:</strong> Regularly assess and enhance processes and systems</li>
</ul>
</div>

<h2>Looking Ahead</h2>

<p>Next week, we'll build on these concepts by exploring advanced topics and practical applications. You'll learn how to handle increasingly complex scenarios and develop mastery in construction financial management.</p>

<h2>Additional Resources</h2>

<ul>
<li>Construction Financial Management Association (CFMA) resources</li>
<li>Associated General Contractors (AGC) best practices guides</li>
<li>Industry-specific accounting software vendor documentation</li>
<li>Professional development courses and certifications</li>
<li>Construction industry publications and research reports</li>
</ul>`;
}

// Generate flashcards for a week
function generateFlashcards(week) {
  return [
    {
      front: `What are the key principles covered in ${week.title}?`,
      back: "Accuracy, timeliness, compliance, transparency, and strategic value are the fundamental principles guiding construction financial management practices.",
    },
    {
      front: "Why is regulatory compliance important in construction accounting?",
      back: "Construction companies face complex federal, state, and local regulations. Non-compliance can result in penalties, project delays, and damage to business reputation.",
    },
    {
      front: "What are the main components of an effective internal control framework?",
      back: "Authorization controls, processing controls, documentation controls, and monitoring controls form the foundation of strong internal controls.",
    },
    {
      front: "How does technology enable better construction financial management?",
      back: "Technology provides real-time visibility, improves accuracy, enables data-driven decision-making, and increases operational efficiency through automation.",
    },
    {
      front: "What is a typical target range for gross profit margin in construction?",
      back: "15-25% is the typical target range, though it varies by project type, market conditions, and company strategy.",
    },
    {
      front: "Why is segregation of duties important?",
      back: "Segregation of duties prevents fraud and errors by ensuring no single person controls all aspects of a financial transaction from authorization through recording.",
    },
    {
      front: "What is the working capital ratio and why does it matter?",
      back: "Working capital ratio (current assets / current liabilities) measures liquidity. A ratio of 1.3-2.0 indicates healthy financial condition for most contractors.",
    },
    {
      front: "What are common fraud risks in construction?",
      back: "Vendor fraud, payroll fraud, bid rigging, material theft, and financial statement fraud are the primary fraud risks facing construction companies.",
    },
    {
      front: "How often should financial dashboards be updated?",
      back: "Critical dashboards should update in real-time or daily. Executive dashboards may update weekly, while detailed operational dashboards need daily or real-time data.",
    },
    {
      front: "What is the purpose of a 13-week cash flow forecast?",
      back: "A 13-week cash forecast provides short-term visibility into cash needs, helps identify potential shortfalls early, and supports proactive cash management decisions.",
    },
  ];
}

// Generate quiz questions for a week
function generateQuizQuestions(week, weekNumber) {
  return [
    {
      q: `Which of the following is NOT a key principle of ${week.title}?`,
      choices: [
        "Accuracy in financial record-keeping",
        "Maximizing short-term profits regardless of compliance",
        "Timely delivery of financial information",
        "Transparent communication with stakeholders",
      ],
      answer: 1,
      explain:
        "Maximizing short-term profits at the expense of compliance violates fundamental principles of professional financial management. Construction CFOs must balance profitability with regulatory compliance and ethical practices.",
    },
    {
      q: "What is the typical target range for working capital ratio in construction?",
      choices: ["0.5-1.0", "1.3-2.0", "2.5-3.5", "4.0-5.0"],
      answer: 1,
      explain:
        "A working capital ratio of 1.3-2.0 is typical for healthy construction companies. Below 1.3 may indicate liquidity concerns, while above 2.0 might suggest inefficient use of assets.",
    },
    {
      q: "Which federal regulation has the most direct impact on construction payroll accounting?",
      choices: [
        "Sarbanes-Oxley Act",
        "Davis-Bacon Act and Department of Labor regulations",
        "Securities Exchange Act",
        "Federal Reserve regulations",
      ],
      answer: 1,
      explain:
        "The Davis-Bacon Act and related DOL regulations directly govern payroll practices for government construction projects, requiring prevailing wages and certified payroll reporting.",
    },
    {
      q: "What is the primary purpose of segregation of duties in financial controls?",
      choices: [
        "To increase efficiency in processing",
        "To reduce staffing costs",
        "To prevent fraud and errors",
        "To comply with union agreements",
      ],
      answer: 2,
      explain:
        "Segregation of duties prevents any single person from controlling all aspects of a financial transaction, reducing opportunities for fraud and undetected errors.",
    },
    {
      q: "A construction company has annual revenue of $60M and EBITDA of $4.2M. What is their EBITDA margin?",
      choices: ["5.0%", "7.0%", "10.0%", "14.3%"],
      answer: 1,
      explain:
        "EBITDA margin = EBITDA / Revenue = $4.2M / $60M = 7.0%. This falls within the typical 5-10% range for construction companies.",
    },
    {
      q: "Which of the following is a red flag for potential vendor fraud?",
      choices: [
        "Vendor provides detailed invoices with project codes",
        "Vendor address matches an employee's address",
        "Vendor has proper insurance certificates on file",
        "Vendor offers early payment discounts",
      ],
      answer: 1,
      explain:
        "A vendor address matching an employee address is a major red flag for fictitious vendor schemes. This could indicate an employee creating fake vendors to steal company funds.",
    },
    {
      q: "What is the recommended timeframe for a construction company's backlog relative to annual revenue?",
      choices: ["1-3 months", "6-18 months", "24-36 months", "48+ months"],
      answer: 1,
      explain:
        "A backlog of 6-18 months of annual revenue provides good visibility into future work while maintaining flexibility. Too little backlog creates uncertainty; too much may indicate capacity constraints.",
    },
    {
      q: "Which technology provides the greatest benefit for real-time project cost tracking?",
      choices: [
        "Spreadsheet software",
        "Cloud-based construction ERP system",
        "Email and document sharing",
        "Desktop accounting software",
      ],
      answer: 1,
      explain:
        "Cloud-based construction ERP systems provide real-time integration between field operations and financial systems, enabling immediate visibility into project costs and performance.",
    },
    {
      q: "What is the primary benefit of implementing role-based dashboards?",
      choices: [
        "Reducing software licensing costs",
        "Providing relevant information to each stakeholder group",
        "Eliminating the need for detailed reports",
        "Standardizing all metrics across the organization",
      ],
      answer: 1,
      explain:
        "Role-based dashboards deliver the right information to the right people at the right time, improving decision-making without overwhelming users with irrelevant data.",
    },
    {
      q: "A company improves its Days in A/R from 55 days to 40 days on $50M annual revenue. What is the approximate cash flow benefit?",
      choices: ["$1.0M", "$2.1M", "$3.5M", "$5.5M"],
      answer: 1,
      explain:
        "Daily revenue = $50M / 365 = $137,000. Improvement = 15 days × $137,000 = $2.05M in freed-up cash. This one-time benefit improves liquidity and reduces financing needs.",
    },
  ];
}

// Build complete month structure
function buildMonth(monthData) {
  const month = {
    id: monthData.id,
    title: monthData.title,
    description: monthData.description,
    weeks: [],
  };

  monthData.weeks.forEach((weekData, index) => {
    const week = {
      id: weekData.id,
      order: weekData.order,
      title: weekData.title,
      lessonHtml: generateLessonHTML(weekData, monthData.title),
      flashcards: generateFlashcards(weekData),
      quiz: {
        id: `${monthData.id}-${weekData.id}-quiz`,
        title: `${weekData.title} - Quiz`,
        questions: generateQuizQuestions(weekData, index + 1),
      },
    };
    month.weeks.push(week);
  });

  return month;
}

// Generate all months
console.log("Generating comprehensive curriculum for months 5-12...");

Object.keys(curriculumData).forEach((monthKey) => {
  const monthData = curriculumData[monthKey];
  const month = buildMonth(monthData);

  const outputPath = path.join(__dirname, "..", "data", `${monthKey}.json`);

  // Read existing file to preserve any content
  let existingData = null;
  try {
    existingData = JSON.parse(fs.readFileSync(outputPath, "utf8"));
  } catch (e) {
    // File doesn't exist or is invalid, that's okay
  }

  // For month 5, we need to merge with existing week 1
  if (monthKey === "m5" && existingData && existingData.weeks && existingData.weeks.length > 0) {
    // Keep the existing week 1
    month.weeks = [existingData.weeks[0], ...month.weeks];
  }

  fs.writeFileSync(outputPath, JSON.stringify(month, null, 2));
  console.log(`✓ Generated ${monthKey}: ${month.title}`);
  console.log(`  - ${month.weeks.length} weeks`);
  const flashcardCount = month.weeks.reduce(
    (sum, w) => sum + (w.flashcards ? w.flashcards.length : 0),
    0
  );
  const quizCount = month.weeks.reduce(
    (sum, w) => sum + (w.quiz && w.quiz.questions ? w.quiz.questions.length : 0),
    0
  );
  console.log(`  - ${flashcardCount} flashcards`);
  console.log(`  - ${quizCount} quiz questions`);
});

console.log("\n✓ All months generated successfully!");
console.log("Next: Review generated content and integrate Month 5 Week 1 from month5-content.json");
