// Cost Code to WIP GL Account Mapping System
// CRITICAL: Cost codes are NOT GL accounts - they roll up to WIP GLs only

export interface CostCode {
  code: string;
  name: string;
  category: 'Labor' | 'Materials' | 'Equipment' | 'Subcontractor' | 'Other';
  wipGLAccount: string;
  isActive: boolean;
  description?: string;
}

export interface WIPGLAccount {
  accountCode: string;
  accountName: string;
  category: 'WIP_Labor' | 'WIP_Materials' | 'WIP_Equipment' | 'WIP_Subcontractor' | 'WIP_Other';
  isActive: boolean;
}

export interface JobPosting {
  id: string;
  jobId: string;
  jobName: string;
  costCode: string;
  costCodeName: string;
  description: string;
  amount: number;
  date: string;
  wipGLAccount: string;
  sourceDocument?: string;
  postedBy: string;
  timestamp: string;
}

// WIP GL Accounts - These are the ONLY accounts that appear in the chart of accounts
export const WIP_GL_ACCOUNTS: WIPGLAccount[] = [
  {
    accountCode: '1401',
    accountName: 'Work in Progress - Labor',
    category: 'WIP_Labor',
    isActive: true
  },
  {
    accountCode: '1402',
    accountName: 'Work in Progress - Materials',
    category: 'WIP_Materials',
    isActive: true
  },
  {
    accountCode: '1403',
    accountName: 'Work in Progress - Equipment',
    category: 'WIP_Equipment',
    isActive: true
  },
  {
    accountCode: '1404',
    accountName: 'Work in Progress - Subcontractors',
    category: 'WIP_Subcontractor',
    isActive: true
  },
  {
    accountCode: '1405',
    accountName: 'Work in Progress - Other Direct Costs',
    category: 'WIP_Other',
    isActive: true
  }
];

// Cost Codes - These are for job tracking only, never appear as GL accounts
export const COST_CODES: CostCode[] = [
  // Labor Cost Codes (Roll to 1401)
  { code: 'L001', name: 'Project Manager', category: 'Labor', wipGLAccount: '1401', isActive: true, description: 'Project management and oversight' },
  { code: 'L002', name: 'Superintendent', category: 'Labor', wipGLAccount: '1401', isActive: true, description: 'On-site supervision and coordination' },
  { code: 'L003', name: 'Foreman', category: 'Labor', wipGLAccount: '1401', isActive: true, description: 'Crew leadership and task coordination' },
  { code: 'L004', name: 'Carpenter - Rough', category: 'Labor', wipGLAccount: '1401', isActive: true, description: 'Rough carpentry and framing' },
  { code: 'L005', name: 'Carpenter - Finish', category: 'Labor', wipGLAccount: '1401', isActive: true, description: 'Finish carpentry and trim work' },
  { code: 'L006', name: 'Electrician', category: 'Labor', wipGLAccount: '1401', isActive: true, description: 'Electrical installation and wiring' },
  { code: 'L007', name: 'Plumber', category: 'Labor', wipGLAccount: '1401', isActive: true, description: 'Plumbing installation and repairs' },
  { code: 'L008', name: 'HVAC Technician', category: 'Labor', wipGLAccount: '1401', isActive: true, description: 'Heating, ventilation, and air conditioning' },
  { code: 'L009', name: 'Laborer - General', category: 'Labor', wipGLAccount: '1401', isActive: true, description: 'General labor and support tasks' },
  { code: 'L010', name: 'Equipment Operator', category: 'Labor', wipGLAccount: '1401', isActive: true, description: 'Heavy equipment operation' },

  // Materials Cost Codes (Roll to 1402)
  { code: 'M001', name: 'Lumber - Framing', category: 'Materials', wipGLAccount: '1402', isActive: true, description: 'Framing lumber and structural wood' },
  { code: 'M002', name: 'Lumber - Finish', category: 'Materials', wipGLAccount: '1402', isActive: true, description: 'Finish lumber and trim materials' },
  { code: 'M003', name: 'Drywall & Insulation', category: 'Materials', wipGLAccount: '1402', isActive: true, description: 'Drywall, insulation, and related materials' },
  { code: 'M004', name: 'Roofing Materials', category: 'Materials', wipGLAccount: '1402', isActive: true, description: 'Shingles, underlayment, and roofing supplies' },
  { code: 'M005', name: 'Concrete & Masonry', category: 'Materials', wipGLAccount: '1402', isActive: true, description: 'Concrete, cement, blocks, and masonry supplies' },
  { code: 'M006', name: 'Electrical Materials', category: 'Materials', wipGLAccount: '1402', isActive: true, description: 'Wire, conduit, fixtures, and electrical supplies' },
  { code: 'M007', name: 'Plumbing Materials', category: 'Materials', wipGLAccount: '1402', isActive: true, description: 'Pipes, fixtures, and plumbing supplies' },
  { code: 'M008', name: 'HVAC Materials', category: 'Materials', wipGLAccount: '1402', isActive: true, description: 'Ductwork, units, and HVAC components' },
  { code: 'M009', name: 'Hardware & Fasteners', category: 'Materials', wipGLAccount: '1402', isActive: true, description: 'Nails, screws, bolts, and hardware' },
  { code: 'M010', name: 'Paint & Finishes', category: 'Materials', wipGLAccount: '1402', isActive: true, description: 'Paint, stain, and finishing materials' },

  // Equipment Cost Codes (Roll to 1403)
  { code: 'E001', name: 'Excavator Rental', category: 'Equipment', wipGLAccount: '1403', isActive: true, description: 'Excavator equipment rental' },
  { code: 'E002', name: 'Bulldozer Rental', category: 'Equipment', wipGLAccount: '1403', isActive: true, description: 'Bulldozer equipment rental' },
  { code: 'E003', name: 'Crane Rental', category: 'Equipment', wipGLAccount: '1403', isActive: true, description: 'Crane equipment rental' },
  { code: 'E004', name: 'Concrete Pump Rental', category: 'Equipment', wipGLAccount: '1403', isActive: true, description: 'Concrete pump rental' },
  { code: 'E005', name: 'Generator Rental', category: 'Equipment', wipGLAccount: '1403', isActive: true, description: 'Generator and temporary power' },
  { code: 'E006', name: 'Tool Rental', category: 'Equipment', wipGLAccount: '1403', isActive: true, description: 'Power tools and equipment rental' },

  // Subcontractor Cost Codes (Roll to 1404)
  { code: 'S001', name: 'Site Preparation', category: 'Subcontractor', wipGLAccount: '1404', isActive: true, description: 'Site preparation and excavation contractors' },
  { code: 'S002', name: 'Foundation', category: 'Subcontractor', wipGLAccount: '1404', isActive: true, description: 'Foundation and concrete contractors' },
  { code: 'S003', name: 'Framing', category: 'Subcontractor', wipGLAccount: '1404', isActive: true, description: 'Framing and structural contractors' },
  { code: 'S004', name: 'Roofing', category: 'Subcontractor', wipGLAccount: '1404', isActive: true, description: 'Roofing contractors' },
  { code: 'S005', name: 'Electrical', category: 'Subcontractor', wipGLAccount: '1404', isActive: true, description: 'Electrical contractors' },
  { code: 'S006', name: 'Plumbing', category: 'Subcontractor', wipGLAccount: '1404', isActive: true, description: 'Plumbing contractors' },
  { code: 'S007', name: 'HVAC', category: 'Subcontractor', wipGLAccount: '1404', isActive: true, description: 'HVAC contractors' },
  { code: 'S008', name: 'Drywall', category: 'Subcontractor', wipGLAccount: '1404', isActive: true, description: 'Drywall contractors' },
  { code: 'S009', name: 'Flooring', category: 'Subcontractor', wipGLAccount: '1404', isActive: true, description: 'Flooring contractors' },
  { code: 'S010', name: 'Painting', category: 'Subcontractor', wipGLAccount: '1404', isActive: true, description: 'Painting contractors' },

  // Other Direct Costs (Roll to 1405)
  { code: 'O001', name: 'Permits & Fees', category: 'Other', wipGLAccount: '1405', isActive: true, description: 'Building permits and regulatory fees' },
  { code: 'O002', name: 'Testing & Inspection', category: 'Other', wipGLAccount: '1405', isActive: true, description: 'Third-party testing and inspection' },
  { code: 'O003', name: 'Job Site Utilities', category: 'Other', wipGLAccount: '1405', isActive: true, description: 'Temporary utilities and services' },
  { code: 'O004', name: 'Job Site Security', category: 'Other', wipGLAccount: '1405', isActive: true, description: 'Security services and equipment' },
  { code: 'O005', name: 'Job Site Cleanup', category: 'Other', wipGLAccount: '1405', isActive: true, description: 'Cleanup and disposal services' }
];

/**
 * POSTING ENGINE: Maps cost code transactions to WIP GL accounts
 * RULE: Cost codes are NEVER posted as GL accounts - they always roll up to WIP
 */
export class CostCodePostingEngine {

  /**
   * Post a job cost transaction to the appropriate WIP GL account
   * @param jobPosting Job posting details with cost code
   * @returns Journal entry with WIP GL account (never the cost code itself)
   */
  static postJobCost(jobPosting: {
    jobId: string;
    costCode: string;
    amount: number;
    description: string;
    date: string;
    sourceDocument?: string;
    postedBy: string;
  }) {
    const costCode = COST_CODES.find(cc => cc.code === jobPosting.costCode);

    if (!costCode) {
      throw new Error(`Invalid cost code: ${jobPosting.costCode}`);
    }

    const wipAccount = WIP_GL_ACCOUNTS.find(wip => wip.accountCode === costCode.wipGLAccount);

    if (!wipAccount) {
      throw new Error(`WIP GL account not found for cost code: ${jobPosting.costCode}`);
    }

    // Create journal entry that posts to WIP GL account (NOT the cost code)
    const journalEntry = {
      id: `JE-${Date.now()}`,
      date: jobPosting.date,
      description: `${jobPosting.description} - Job: ${jobPosting.jobId} - Cost Code: ${costCode.code}`,
      entries: [
        {
          account: wipAccount.accountCode, // WIP GL account
          accountName: wipAccount.accountName,
          debit: jobPosting.amount,
          credit: 0
        },
        {
          account: '2000', // Accounts Payable or similar
          accountName: 'Accounts Payable',
          debit: 0,
          credit: jobPosting.amount
        }
      ],
      jobTracking: {
        jobId: jobPosting.jobId,
        costCode: costCode.code,
        costCodeName: costCode.name,
        wipGLAccount: wipAccount.accountCode
      },
      sourceDocument: jobPosting.sourceDocument,
      postedBy: jobPosting.postedBy,
      timestamp: new Date().toISOString()
    };

    return journalEntry;
  }

  /**
   * Get WIP GL account for a cost code
   * @param costCodeId Cost code identifier
   * @returns WIP GL account that this cost code rolls up to
   */
  static getWIPAccountForCostCode(costCodeId: string): WIPGLAccount | null {
    const costCode = COST_CODES.find(cc => cc.code === costCodeId);
    if (!costCode) return null;

    return WIP_GL_ACCOUNTS.find(wip => wip.accountCode === costCode.wipGLAccount) || null;
  }

  /**
   * Validate that an account code is a valid WIP GL account (not a cost code)
   * @param accountCode Account code to validate
   * @returns true if it's a valid WIP GL account, false if it's a cost code or invalid
   */
  static isValidGLAccount(accountCode: string): boolean {
    // Cost codes (alpha-prefixed dimensions) must NEVER be used as GL accounts.
    const isCostCode = COST_CODES.some(cc => cc.code === accountCode);
    if (isCostCode) {
      console.error(`CRITICAL ERROR: Attempted to use cost code ${accountCode} as GL account. Cost codes must roll up to WIP GL accounts.`);
      return false;
    }

    // Reject anything *shaped* like a cost code (category letter L/M/E/S/O + digit),
    // even if not in COST_CODES, so a stray "L999" can never post as a GL account.
    if (/^[LMESO]\d/i.test(accountCode)) {
      return false;
    }

    // Valid if it is a known WIP control account, or otherwise a numeric GL account
    // code (e.g. 2000 AP). Anything else is rejected rather than silently accepted.
    const isWIPAccount = WIP_GL_ACCOUNTS.some(wip => wip.accountCode === accountCode);
    return isWIPAccount || /^\d/.test(accountCode);
  }

  /**
   * Get job cost summary by WIP GL account
   * @param jobId Job identifier
   * @returns Summary of costs by WIP GL account
   */
  static getJobCostSummary(jobId: string, jobPostings: JobPosting[]) {
    const jobCosts = jobPostings.filter(jp => jp.jobId === jobId);

    const summary = WIP_GL_ACCOUNTS.map(wipAccount => {
      const relatedCostCodes = COST_CODES.filter(cc => cc.wipGLAccount === wipAccount.accountCode);
      const totalCosts = jobCosts
        .filter(jc => relatedCostCodes.some(cc => cc.code === jc.costCode))
        .reduce((sum, jc) => sum + jc.amount, 0);

      const costCodeBreakdown = relatedCostCodes.map(cc => {
        const costCodeTotal = jobCosts
          .filter(jc => jc.costCode === cc.code)
          .reduce((sum, jc) => sum + jc.amount, 0);

        return {
          costCode: cc.code,
          costCodeName: cc.name,
          amount: costCodeTotal,
          postings: jobCosts.filter(jc => jc.costCode === cc.code)
        };
      }).filter(breakdown => breakdown.amount > 0);

      return {
        wipGLAccount: wipAccount.accountCode,
        wipGLAccountName: wipAccount.accountName,
        category: wipAccount.category,
        totalAmount: totalCosts,
        costCodeBreakdown
      };
    }).filter(summary => summary.totalAmount > 0);

    return summary;
  }

  /**
   * Monthly WIP rollforward calculation
   * @param period Month/Year period
   * @returns WIP rollforward by GL account
   */
  static calculateWIPRollforward(period: string, jobPostings: JobPosting[]) {
    // This would integrate with the GL to get beginning balances, additions, transfers, and ending balances
    // Cost codes provide the detail, but the GL accounts hold the balances

    return WIP_GL_ACCOUNTS.map(wipAccount => {
      // Get all postings for this WIP account in the period
      const relatedCostCodes = COST_CODES.filter(cc => cc.wipGLAccount === wipAccount.accountCode);
      const periodPostings = jobPostings.filter(jp =>
        jp.date.startsWith(period) &&
        relatedCostCodes.some(cc => cc.code === jp.costCode)
      );

      const additions = periodPostings.reduce((sum, jp) => sum + jp.amount, 0);

      // In a real system, you'd get beginning balance from GL and calculate transfers to COGS
      const beginningBalance = 0; // Would come from GL
      const transfersToCOGS = 0; // Based on job completion percentage or billing
      const endingBalance = beginningBalance + additions - transfersToCOGS;

      return {
        wipGLAccount: wipAccount.accountCode,
        wipGLAccountName: wipAccount.accountName,
        beginningBalance,
        additions,
        transfersToCOGS,
        endingBalance,
        period
      };
    });
  }
}

export default CostCodePostingEngine;