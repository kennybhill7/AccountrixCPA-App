'use client';

import React, { useState, useEffect } from 'react';
import { Brain, Building2, Users, Truck, Home, Factory, ShoppingCart, Briefcase, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import { CHART_OF_ACCOUNTS } from './ManualEntryForms';
import { COST_CODES, WIP_GL_ACCOUNTS } from '@/lib/costCodeMapping';

interface BusinessType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  chartOfAccounts: string[];
  costCodes: string[];
  defaultDashboard: string[];
  industrySpecific: boolean;
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface OnboardingAIProps {
  onComplete: (config: any) => void;
  onSkip: () => void;
}

const BUSINESS_TYPES: BusinessType[] = [
  {
    id: 'construction',
    name: 'Construction & Contracting',
    description: 'General contractors, specialty trades, residential and commercial builders',
    icon: <Building2 className="w-8 h-8" />,
    chartOfAccounts: ['1000', '1100', '1401', '1402', '1403', '1404', '1405', '2000', '2100', '3000', '4000', '5000', '6000'],
    costCodes: ['L001', 'L002', 'L003', 'L004', 'M001', 'M002', 'M003', 'E001', 'S001', 'S002', 'S003', 'O001'],
    defaultDashboard: ['jobProfitability', 'wipReporting', 'cashFlow', 'changeOrders'],
    industrySpecific: true
  },
  {
    id: 'professional_services',
    name: 'Professional Services',
    description: 'Consulting, legal, accounting, engineering, and other professional firms',
    icon: <Briefcase className="w-8 h-8" />,
    chartOfAccounts: ['1000', '1100', '1300', '1500', '2000', '2100', '3000', '4000', '6000', '6100', '6300', '6400'],
    costCodes: ['L001', 'O001', 'O002'],
    defaultDashboard: ['clientBilling', 'timeTracking', 'profitability', 'receivables'],
    industrySpecific: false
  },
  {
    id: 'retail',
    name: 'Retail & E-commerce',
    description: 'Online stores, brick-and-mortar retail, inventory-based businesses',
    icon: <ShoppingCart className="w-8 h-8" />,
    chartOfAccounts: ['1000', '1100', '1200', '1500', '2000', '2100', '3000', '4100', '5000', '6000', '6200'],
    costCodes: [],
    defaultDashboard: ['inventory', 'salesAnalytics', 'marginAnalysis', 'seasonality'],
    industrySpecific: false
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    description: 'Product manufacturing, assembly, and production companies',
    icon: <Factory className="w-8 h-8" />,
    chartOfAccounts: ['1000', '1100', '1200', '1401', '1402', '1500', '2000', '2100', '3000', '4100', '5000', '6000'],
    costCodes: ['L001', 'M001', 'M002', 'E001'],
    defaultDashboard: ['production', 'wipReporting', 'materialCosts', 'efficiency'],
    industrySpecific: true
  },
  {
    id: 'service_business',
    name: 'Service Business',
    description: 'General service providers, maintenance, repair, and other service-based companies',
    icon: <Users className="w-8 h-8" />,
    chartOfAccounts: ['1000', '1100', '1300', '1500', '2000', '2100', '3000', '4000', '6000', '6300'],
    costCodes: ['L001', 'O001'],
    defaultDashboard: ['serviceTracking', 'customerSatisfaction', 'profitability', 'scheduling'],
    industrySpecific: false
  },
  {
    id: 'real_estate',
    name: 'Real Estate',
    description: 'Property management, real estate development, and investment companies',
    icon: <Home className="w-8 h-8" />,
    chartOfAccounts: ['1000', '1100', '1500', '2000', '2500', '3000', '4000', '6000', '6200'],
    costCodes: ['O001', 'O002'],
    defaultDashboard: ['propertyAnalysis', 'rental', 'maintenance', 'occupancy'],
    industrySpecific: true
  }
];

export default function OnboardingAI({ onComplete, onSkip }: OnboardingAIProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedBusinessType, setSelectedBusinessType] = useState<BusinessType | null>(null);
  const [companyInfo, setCompanyInfo] = useState({
    name: '',
    industry: '',
    size: '',
    fiscalYearEnd: '12-31'
  });
  const [configuration, setConfiguration] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Accountrix AI',
      description: 'Let me help you set up your accounting system perfectly for your business',
      completed: false
    },
    {
      id: 'business_type',
      title: 'Select Your Business Type',
      description: 'Choose the option that best describes your business',
      completed: false
    },
    {
      id: 'company_details',
      title: 'Company Information',
      description: 'Tell me about your company for proper setup',
      completed: false
    },
    {
      id: 'ai_configuration',
      title: 'AI-Powered Setup',
      description: 'I\'ll configure your Chart of Accounts, Cost Codes, and Dashboard',
      completed: false
    },
    {
      id: 'review_setup',
      title: 'Review & Finalize',
      description: 'Review your configuration and make any adjustments',
      completed: false
    }
  ];

  const generateConfiguration = async () => {
    if (!selectedBusinessType) return;

    setIsGenerating(true);

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 3000));

    const config = {
      businessType: selectedBusinessType,
      companyInfo,
      chartOfAccounts: CHART_OF_ACCOUNTS.filter(account =>
        selectedBusinessType.chartOfAccounts.includes(account.code)
      ),
      costCodes: selectedBusinessType.industrySpecific ?
        COST_CODES.filter(code => selectedBusinessType.costCodes.includes(code.code)) : [],
      wipAccounts: selectedBusinessType.industrySpecific ? WIP_GL_ACCOUNTS : [],
      dashboardModules: selectedBusinessType.defaultDashboard,
      aiRecommendations: generateAIRecommendations(selectedBusinessType),
      postingRules: generatePostingRules(selectedBusinessType),
      reportingPackage: generateReportingPackage(selectedBusinessType)
    };

    setConfiguration(config);
    setIsGenerating(false);
  };

  const generateAIRecommendations = (businessType: BusinessType) => {
    const recommendations = {
      construction: [
        'Set up job costing with WIP reporting for accurate project profitability',
        'Enable change order tracking to monitor budget variations',
        'Configure percentage-of-completion revenue recognition',
        'Set up subcontractor management and 1099 tracking',
        'Enable equipment cost allocation across projects'
      ],
      professional_services: [
        'Configure time-based billing and client profitability tracking',
        'Set up project-based accounting for client engagements',
        'Enable automated expense reimbursement workflows',
        'Configure trust account management for client funds',
        'Set up professional liability and insurance tracking'
      ],
      retail: [
        'Enable inventory management with FIFO/LIFO costing',
        'Set up sales tax automation by location',
        'Configure seasonal reporting and trend analysis',
        'Enable multi-channel sales integration',
        'Set up margin analysis by product category'
      ],
      manufacturing: [
        'Configure work-in-progress and finished goods tracking',
        'Set up standard costing with variance analysis',
        'Enable material requirements planning integration',
        'Configure quality control cost tracking',
        'Set up production efficiency reporting'
      ],
      service_business: [
        'Configure service contract tracking and billing',
        'Set up recurring revenue recognition',
        'Enable customer satisfaction correlation with profitability',
        'Configure service warranty and callback cost tracking',
        'Set up technician productivity analysis'
      ],
      real_estate: [
        'Configure property-by-property profit and loss',
        'Set up depreciation schedules for properties',
        'Enable tenant billing and lease management',
        'Configure maintenance cost allocation',
        'Set up cash flow analysis by property'
      ]
    };

    return recommendations[businessType.id as keyof typeof recommendations] || [];
  };

  const generatePostingRules = (businessType: BusinessType) => {
    if (!businessType.industrySpecific) {
      return [
        'Standard chart of accounts with proper GAAP classification',
        'Automated expense categorization based on vendor patterns',
        'Revenue recognition rules based on business model',
        'Standard financial statement presentation'
      ];
    }

    return [
      'Cost codes automatically roll up to WIP GL accounts',
      'Job-specific cost allocation and tracking',
      'Percentage-of-completion calculations',
      'Industry-specific financial statement formats',
      'Compliance with industry accounting standards'
    ];
  };

  const generateReportingPackage = (businessType: BusinessType) => {
    const standardReports = [
      'Balance Sheet (GAAP compliant)',
      'Income Statement (Multi-step)',
      'Cash Flow Statement (Direct & Indirect)',
      'Trial Balance with drill-downs',
      'General Ledger Detail'
    ];

    const industryReports = {
      construction: [
        'Work in Progress (WIP) Report',
        'Job Profitability Analysis',
        'Cost Code Detail Report',
        'Change Order Summary',
        'Subcontractor Analysis'
      ],
      professional_services: [
        'Client Profitability Report',
        'Time and Billing Analysis',
        'Project Status Dashboard',
        'Realization Rate Analysis',
        'Professional Services Metrics'
      ],
      retail: [
        'Inventory Valuation Report',
        'Sales Analysis by Channel',
        'Margin Analysis by Category',
        'Seasonal Performance Report',
        'Customer Purchase Analysis'
      ],
      manufacturing: [
        'Manufacturing Cost Report',
        'Production Efficiency Analysis',
        'Variance Analysis Report',
        'Material Usage Report',
        'Quality Cost Analysis'
      ],
      service_business: [
        'Service Contract Analysis',
        'Recurring Revenue Report',
        'Customer Satisfaction Metrics',
        'Service Technician Analysis',
        'Route Optimization Report'
      ],
      real_estate: [
        'Property Performance Analysis',
        'Rent Roll and Vacancy Report',
        'Maintenance Cost Analysis',
        'Depreciation Schedule',
        'Cash Flow by Property'
      ]
    };

    return [
      ...standardReports,
      ...(industryReports[businessType.id as keyof typeof industryReports] || [])
    ];
  };

  const handleNext = () => {
    if (currentStep === 1 && !selectedBusinessType) {
      alert('Please select your business type to continue.');
      return;
    }
    if (currentStep === 2 && !companyInfo.name) {
      alert('Please enter your company name to continue.');
      return;
    }
    if (currentStep === 3 && !configuration) {
      generateConfiguration();
      return;
    }

    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const handleComplete = () => {
    onComplete(configuration);
  };

  const renderWelcomeStep = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto flex items-center justify-center">
        <Brain className="w-10 h-10 text-white" />
      </div>
      <div>
        <h2 className="text-3xl font-bold text-white mb-4">Welcome to Accountrix AI</h2>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          I'm your AI CPA assistant, and I'm here to set up your accounting system perfectly for your business.
          This will take just a few minutes, and I'll configure everything according to GAAP standards.
        </p>
      </div>
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6 text-left max-w-2xl mx-auto">
        <h3 className="text-blue-400 font-semibold mb-3 flex items-center space-x-2">
          <Sparkles className="w-5 h-5" />
          <span>What I'll set up for you:</span>
        </h3>
        <ul className="space-y-2 text-gray-300">
          <li className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>Custom Chart of Accounts for your industry</span>
          </li>
          <li className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>Cost codes and job tracking (if applicable)</span>
          </li>
          <li className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>Industry-specific dashboard and reports</span>
          </li>
          <li className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>Automated posting rules and workflows</span>
          </li>
          <li className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>Professional financial statement templates</span>
          </li>
        </ul>
      </div>
    </div>
  );

  const renderBusinessTypeStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">What type of business do you have?</h2>
        <p className="text-gray-400">This helps me configure the perfect accounting setup for your industry.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {BUSINESS_TYPES.map((type) => (
          <button
            key={type.id}
            onClick={() => setSelectedBusinessType(type)}
            className={`p-6 rounded-lg border text-left transition-all ${
              selectedBusinessType?.id === type.id
                ? 'border-purple-500 bg-purple-500/20'
                : 'border-white/20 bg-white/5 hover:bg-white/10'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-lg ${
                selectedBusinessType?.id === type.id
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'bg-white/10 text-gray-400'
              }`}>
                {type.icon}
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">{type.name}</h3>
                <p className="text-gray-400 text-sm">{type.description}</p>
                {type.industrySpecific && (
                  <span className="inline-block mt-2 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                    Industry-Specific Setup
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderCompanyDetailsStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Tell me about your company</h2>
        <p className="text-gray-400">This information helps me customize your accounting setup.</p>
      </div>
      <div className="max-w-2xl mx-auto space-y-4">
        <div>
          <label className="block text-white font-medium mb-2">Company Name *</label>
          <input
            type="text"
            value={companyInfo.name}
            onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
            placeholder="Your Company Name"
          />
        </div>
        <div>
          <label className="block text-white font-medium mb-2">Industry Details</label>
          <input
            type="text"
            value={companyInfo.industry}
            onChange={(e) => setCompanyInfo({...companyInfo, industry: e.target.value})}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
            placeholder="e.g., Residential Construction, IT Consulting"
          />
        </div>
        <div>
          <label className="block text-white font-medium mb-2">Company Size</label>
          <select
            value={companyInfo.size}
            onChange={(e) => setCompanyInfo({...companyInfo, size: e.target.value})}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
          >
            <option value="" className="bg-slate-800">Select Size</option>
            <option value="startup" className="bg-slate-800">Startup (1-5 employees)</option>
            <option value="small" className="bg-slate-800">Small Business (6-25 employees)</option>
            <option value="medium" className="bg-slate-800">Medium Business (26-100 employees)</option>
            <option value="large" className="bg-slate-800">Large Business (100+ employees)</option>
          </select>
        </div>
        <div>
          <label className="block text-white font-medium mb-2">Fiscal Year End</label>
          <select
            value={companyInfo.fiscalYearEnd}
            onChange={(e) => setCompanyInfo({...companyInfo, fiscalYearEnd: e.target.value})}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
          >
            <option value="12-31" className="bg-slate-800">December 31</option>
            <option value="06-30" className="bg-slate-800">June 30</option>
            <option value="03-31" className="bg-slate-800">March 31</option>
            <option value="09-30" className="bg-slate-800">September 30</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderConfigurationStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">AI-Powered Configuration</h2>
        <p className="text-gray-400">
          {isGenerating ? 'Generating your custom setup...' : 'Ready to configure your accounting system'}
        </p>
      </div>

      {isGenerating ? (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
          <div className="space-y-2">
            <p className="text-purple-400 font-medium">🧠 AI is working on your setup...</p>
            <p className="text-gray-400 text-sm">Analyzing {selectedBusinessType?.name} requirements</p>
            <p className="text-gray-400 text-sm">Configuring Chart of Accounts and Cost Codes</p>
            <p className="text-gray-400 text-sm">Setting up industry-specific workflows</p>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <button
            onClick={generateConfiguration}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-all"
          >
            🚀 Generate My Custom Setup
          </button>
          <p className="text-gray-400 text-sm mt-3">This takes about 30 seconds</p>
        </div>
      )}
    </div>
  );

  const renderReviewStep = () => {
    if (!configuration) return null;

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">🎉 Your Setup is Ready!</h2>
          <p className="text-gray-400">Review your AI-generated configuration below.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>Chart of Accounts</span>
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {configuration.chartOfAccounts.map((account: any) => (
                <div key={account.code} className="text-sm text-gray-300">
                  <span className="font-mono text-blue-400">{account.code}</span> - {account.name}
                </div>
              ))}
            </div>
          </div>

          {configuration.costCodes.length > 0 && (
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Cost Codes</span>
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {configuration.costCodes.map((code: any) => (
                  <div key={code.code} className="text-sm text-gray-300">
                    <span className="font-mono text-yellow-400">{code.code}</span> - {code.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>AI Recommendations</span>
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {configuration.aiRecommendations.map((rec: string, index: number) => (
                <div key={index} className="text-sm text-gray-300 flex items-start space-x-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>Reports Package</span>
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {configuration.reportingPackage.map((report: string, index: number) => (
                <div key={index} className="text-sm text-gray-300">
                  📊 {report}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <h4 className="text-green-400 font-semibold mb-2">✅ Setup Complete!</h4>
            <p className="text-gray-300 text-sm">
              Your Accountrix AI system is configured and ready to use. All GAAP standards are automatically enforced.
            </p>
          </div>

          <div className="flex space-x-4 justify-center">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              ← Back to Modify
            </button>
            <button
              onClick={handleComplete}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-lg font-semibold transition-all"
            >
              🚀 Launch Accountrix AI
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-white/20 rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
        {/* Progress Steps */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    index <= currentStep
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/10 text-gray-400'
                  }`}>
                    {index < currentStep ? <CheckCircle className="w-4 h-4" /> : index + 1}
                  </div>
                  <span className={`text-sm ${
                    index <= currentStep ? 'text-white' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-gray-400 ml-2" />
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={onSkip}
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Skip Setup
            </button>
          </div>
        </div>

        {/* Step Content */}
        <div className="p-8">
          {currentStep === 0 && renderWelcomeStep()}
          {currentStep === 1 && renderBusinessTypeStep()}
          {currentStep === 2 && renderCompanyDetailsStep()}
          {currentStep === 3 && renderConfigurationStep()}
          {currentStep === 4 && renderReviewStep()}
        </div>

        {/* Navigation */}
        <div className="p-6 border-t border-white/10 flex justify-between">
          <button
            onClick={() => setCurrentStep(prev => Math.max(prev - 1, 0))}
            disabled={currentStep === 0}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg transition-colors"
          >
            ← Previous
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={isGenerating}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="px-8 py-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-lg font-semibold transition-all"
            >
              🚀 Complete Setup
            </button>
          )}
        </div>
      </div>
    </div>
  );
}