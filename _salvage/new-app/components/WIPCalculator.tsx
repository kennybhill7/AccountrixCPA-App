'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Download,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calculator,
  Eye,
  EyeOff,
  RefreshCw,
  Copy,
} from 'lucide-react';

// ============================================================================
// TypeScript Interfaces
// ============================================================================

interface WIPProject {
  id: string;
  name: string;
  contractValue: number;
  costsIncurred: number;
  estimatedTotalCosts: number;
  billingsToDate: number;
  method: 'cost-to-cost' | 'units-of-delivery' | 'efforts-expended';
  // For units method:
  unitsCompleted?: number;
  totalUnits?: number;
  // For efforts method:
  hoursUsed?: number;
  totalEstimatedHours?: number;
}

interface WIPCalculation {
  percentComplete: number;
  revenueToRecognize: number;
  grossProfit: number;
  grossProfitPercent: number;
  overUnderBilling: number;
  status: 'healthy' | 'caution' | 'alert';
  warnings: string[];
}

interface PortfolioSummary {
  totalContractValue: number;
  totalCostsToDate: number;
  totalRevenue: number;
  totalGrossProfit: number;
  averageGPPercent: number;
  projectCount: number;
}

// ============================================================================
// Pre-built Scenarios
// ============================================================================

const SCENARIOS: Record<string, WIPProject> = {
  healthy: {
    id: '1',
    name: 'Tower One Construction',
    contractValue: 5000000,
    costsIncurred: 2000000,
    estimatedTotalCosts: 4000000,
    billingsToDate: 2100000,
    method: 'cost-to-cost',
  },
  earlyStage: {
    id: '2',
    name: 'Bridge Project - Early Stage',
    contractValue: 3000000,
    costsIncurred: 300000,
    estimatedTotalCosts: 2500000,
    billingsToDate: 150000,
    method: 'cost-to-cost',
  },
  nearlyComplete: {
    id: '3',
    name: 'Office Building - Final Phase',
    contractValue: 8000000,
    costsIncurred: 7200000,
    estimatedTotalCosts: 7500000,
    billingsToDate: 7800000,
    method: 'cost-to-cost',
  },
  lossPosition: {
    id: '4',
    name: 'Problem Project - Cost Overrun',
    contractValue: 2000000,
    costsIncurred: 1800000,
    estimatedTotalCosts: 2500000,
    billingsToDate: 1500000,
    method: 'cost-to-cost',
  },
  overBilled: {
    id: '5',
    name: 'Residential Development - Over-billed',
    contractValue: 4000000,
    costsIncurred: 1000000,
    estimatedTotalCosts: 3200000,
    billingsToDate: 2000000,
    method: 'cost-to-cost',
  },
  unitsMethod: {
    id: '6',
    name: 'Housing Development - 60 Homes',
    contractValue: 12000000,
    costsIncurred: 3000000,
    estimatedTotalCosts: 9600000,
    billingsToDate: 3200000,
    method: 'units-of-delivery',
    unitsCompleted: 15,
    totalUnits: 60,
  },
  effortsMethod: {
    id: '7',
    name: 'Custom Design Build',
    contractValue: 1500000,
    costsIncurred: 500000,
    estimatedTotalCosts: 1200000,
    billingsToDate: 450000,
    method: 'efforts-expended',
    hoursUsed: 500,
    totalEstimatedHours: 2000,
  },
};

// ============================================================================
// Calculation Helper Functions
// ============================================================================

function calculateCostToCost(project: WIPProject): WIPCalculation {
  const percentComplete =
    project.estimatedTotalCosts > 0
      ? (project.costsIncurred / project.estimatedTotalCosts) * 100
      : 0;

  const revenueToRecognize = (project.contractValue * percentComplete) / 100;
  const grossProfit = revenueToRecognize - project.costsIncurred;
  const grossProfitPercent =
    revenueToRecognize > 0 ? (grossProfit / revenueToRecognize) * 100 : 0;
  const overUnderBilling = project.billingsToDate - revenueToRecognize;

  const warnings = generateWarnings(project, {
    percentComplete,
    revenueToRecognize,
    grossProfit,
    grossProfitPercent,
    overUnderBilling,
    status: 'healthy',
    warnings: [],
  });

  const status = determineStatus(grossProfitPercent, warnings.length);

  return {
    percentComplete,
    revenueToRecognize,
    grossProfit,
    grossProfitPercent,
    overUnderBilling,
    status,
    warnings,
  };
}

function calculateUnitsOfDelivery(project: WIPProject): WIPCalculation {
  const percentComplete =
    project.totalUnits && project.totalUnits > 0
      ? ((project.unitsCompleted || 0) / project.totalUnits) * 100
      : 0;

  const revenueToRecognize = (project.contractValue * percentComplete) / 100;
  const grossProfit = revenueToRecognize - project.costsIncurred;
  const grossProfitPercent =
    revenueToRecognize > 0 ? (grossProfit / revenueToRecognize) * 100 : 0;
  const overUnderBilling = project.billingsToDate - revenueToRecognize;

  const warnings = generateWarnings(project, {
    percentComplete,
    revenueToRecognize,
    grossProfit,
    grossProfitPercent,
    overUnderBilling,
    status: 'healthy',
    warnings: [],
  });

  const status = determineStatus(grossProfitPercent, warnings.length);

  return {
    percentComplete,
    revenueToRecognize,
    grossProfit,
    grossProfitPercent,
    overUnderBilling,
    status,
    warnings,
  };
}

function calculateEffortsExpended(project: WIPProject): WIPCalculation {
  const percentComplete =
    project.totalEstimatedHours && project.totalEstimatedHours > 0
      ? ((project.hoursUsed || 0) / project.totalEstimatedHours) * 100
      : 0;

  const revenueToRecognize = (project.contractValue * percentComplete) / 100;
  const grossProfit = revenueToRecognize - project.costsIncurred;
  const grossProfitPercent =
    revenueToRecognize > 0 ? (grossProfit / revenueToRecognize) * 100 : 0;
  const overUnderBilling = project.billingsToDate - revenueToRecognize;

  const warnings = generateWarnings(project, {
    percentComplete,
    revenueToRecognize,
    grossProfit,
    grossProfitPercent,
    overUnderBilling,
    status: 'healthy',
    warnings: [],
  });

  const status = determineStatus(grossProfitPercent, warnings.length);

  return {
    percentComplete,
    revenueToRecognize,
    grossProfit,
    grossProfitPercent,
    overUnderBilling,
    status,
    warnings,
  };
}

function generateWarnings(
  project: WIPProject,
  calc: WIPCalculation
): string[] {
  const warnings: string[] = [];

  // Check for over 100% complete
  if (calc.percentComplete > 100) {
    warnings.push(
      `Project is ${calc.percentComplete.toFixed(
        1
      )}% complete - exceeds 100%. Review cost estimates.`
    );
  }

  // Check for cost overrun
  if (project.costsIncurred > project.estimatedTotalCosts) {
    const overrun = project.costsIncurred - project.estimatedTotalCosts;
    warnings.push(
      `Cost overrun detected: $${formatCurrency(
        overrun
      )} over estimated total costs.`
    );
  }

  // Check for loss position
  if (calc.grossProfitPercent < 0) {
    warnings.push(
      `LOSS POSITION: Project is showing a ${Math.abs(
        calc.grossProfitPercent
      ).toFixed(1)}% loss. Immediate attention required.`
    );
  }

  // Check for low margin
  if (calc.grossProfitPercent >= 0 && calc.grossProfitPercent < 10) {
    warnings.push(
      `Low margin warning: GP% is ${calc.grossProfitPercent.toFixed(
        1
      )}%. Target is typically 15-25%.`
    );
  }

  // Check for significant over-billing
  if (calc.overUnderBilling > 0) {
    const overBillingPercent =
      (calc.overUnderBilling / project.contractValue) * 100;
    if (overBillingPercent > 25) {
      warnings.push(
        `Significant over-billing: $${formatCurrency(
          calc.overUnderBilling
        )} (${overBillingPercent.toFixed(
          1
        )}% of contract). May indicate timing issues.`
      );
    }
  }

  // Check for significant under-billing
  if (calc.overUnderBilling < 0) {
    const underBillingPercent =
      (Math.abs(calc.overUnderBilling) / project.contractValue) * 100;
    if (underBillingPercent > 20) {
      warnings.push(
        `Significant under-billing: $${formatCurrency(
          Math.abs(calc.overUnderBilling)
        )} (${underBillingPercent.toFixed(1)}% of contract). Cash flow risk.`
      );
    }
  }

  // Check if estimated total costs seem unrealistic
  if (
    project.estimatedTotalCosts < project.costsIncurred &&
    calc.percentComplete < 100
  ) {
    warnings.push(
      'Estimated total costs are less than costs incurred, but project is not complete. Update estimates.'
    );
  }

  return warnings;
}

function determineStatus(
  grossProfitPercent: number,
  warningCount: number
): 'healthy' | 'caution' | 'alert' {
  if (grossProfitPercent < 5 || warningCount >= 2) {
    return 'alert';
  }
  if (grossProfitPercent >= 5 && grossProfitPercent < 15) {
    return 'caution';
  }
  return 'healthy';
}

function calculatePortfolioSummary(
  projects: WIPProject[]
): PortfolioSummary {
  const calculations = projects.map((p) => ({
    project: p,
    calc: calculateProject(p),
  }));

  const totalContractValue = projects.reduce(
    (sum, p) => sum + p.contractValue,
    0
  );
  const totalCostsToDate = projects.reduce(
    (sum, p) => sum + p.costsIncurred,
    0
  );
  const totalRevenue = calculations.reduce(
    (sum, c) => sum + c.calc.revenueToRecognize,
    0
  );
  const totalGrossProfit = calculations.reduce(
    (sum, c) => sum + c.calc.grossProfit,
    0
  );
  const averageGPPercent =
    totalRevenue > 0 ? (totalGrossProfit / totalRevenue) * 100 : 0;

  return {
    totalContractValue,
    totalCostsToDate,
    totalRevenue,
    totalGrossProfit,
    averageGPPercent,
    projectCount: projects.length,
  };
}

function calculateProject(project: WIPProject): WIPCalculation {
  switch (project.method) {
    case 'units-of-delivery':
      return calculateUnitsOfDelivery(project);
    case 'efforts-expended':
      return calculateEffortsExpended(project);
    case 'cost-to-cost':
    default:
      return calculateCostToCost(project);
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(value));
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

function generateId(): string {
  return `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================================================
// Export Functions
// ============================================================================

function exportToExcel(projects: WIPProject[]): void {
  const calculations = projects.map((p) => ({
    project: p,
    calc: calculateProject(p),
  }));

  let csvContent = 'data:text/csv;charset=utf-8,';

  // Headers
  csvContent +=
    'Project Name,Method,Contract Value,Costs Incurred,Estimated Total Costs,Billings to Date,% Complete,Revenue to Recognize,Gross Profit,GP %,Over/(Under) Billed,Status\n';

  // Data rows
  calculations.forEach(({ project, calc }) => {
    csvContent += `"${project.name}",${project.method},$${project.contractValue},$${project.costsIncurred},$${project.estimatedTotalCosts},$${project.billingsToDate},${calc.percentComplete.toFixed(1)}%,$${calc.revenueToRecognize.toFixed(2)},$${calc.grossProfit.toFixed(2)},${calc.grossProfitPercent.toFixed(1)}%,$${calc.overUnderBilling.toFixed(2)},${calc.status}\n`;
  });

  // Portfolio summary
  const summary = calculatePortfolioSummary(projects);
  csvContent += '\nPORTFOLIO SUMMARY\n';
  csvContent += `Total Projects,${summary.projectCount}\n`;
  csvContent += `Total Contract Value,$${summary.totalContractValue}\n`;
  csvContent += `Total Costs to Date,$${summary.totalCostsToDate}\n`;
  csvContent += `Total Revenue,$${summary.totalRevenue.toFixed(2)}\n`;
  csvContent += `Total Gross Profit,$${summary.totalGrossProfit.toFixed(2)}\n`;
  csvContent += `Average GP %,${summary.averageGPPercent.toFixed(1)}%\n`;

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `WIP_Schedule_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function exportProjectToPDF(project: WIPProject, calc: WIPCalculation): void {
  // For a real implementation, you would use a library like jsPDF
  // This is a simplified version that creates a printable HTML page
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>WIP Schedule - ${project.name}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 10px; text-align: left; border: 1px solid #ddd; }
        th { background-color: #f4f4f4; font-weight: bold; }
        .status-${calc.status} { color: ${calc.status === 'healthy' ? 'green' : calc.status === 'caution' ? 'orange' : 'red'}; font-weight: bold; }
        .warnings { background-color: #fff3cd; padding: 10px; margin: 10px 0; border-left: 4px solid #ffc107; }
      </style>
    </head>
    <body>
      <h1>Work-in-Progress Schedule</h1>
      <h2>${project.name}</h2>
      <p><strong>Method:</strong> ${project.method.replace('-', ' ').toUpperCase()}</p>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>

      <table>
        <tr><th colspan="2">INPUT VALUES</th></tr>
        <tr><td>Contract Value</td><td>$${formatCurrency(project.contractValue)}</td></tr>
        <tr><td>Costs Incurred to Date</td><td>$${formatCurrency(project.costsIncurred)}</td></tr>
        <tr><td>Estimated Total Costs</td><td>$${formatCurrency(project.estimatedTotalCosts)}</td></tr>
        <tr><td>Billings to Date</td><td>$${formatCurrency(project.billingsToDate)}</td></tr>
        ${project.method === 'units-of-delivery' ? `
          <tr><td>Units Completed</td><td>${project.unitsCompleted}</td></tr>
          <tr><td>Total Units</td><td>${project.totalUnits}</td></tr>
        ` : ''}
        ${project.method === 'efforts-expended' ? `
          <tr><td>Hours Used</td><td>${project.hoursUsed}</td></tr>
          <tr><td>Total Estimated Hours</td><td>${project.totalEstimatedHours}</td></tr>
        ` : ''}
      </table>

      <table>
        <tr><th colspan="2">CALCULATED VALUES</th></tr>
        <tr><td>Percentage Complete</td><td>${formatPercent(calc.percentComplete)}</td></tr>
        <tr><td>Revenue to Recognize</td><td>$${formatCurrency(calc.revenueToRecognize)}</td></tr>
        <tr><td>Gross Profit</td><td>$${formatCurrency(calc.grossProfit)}</td></tr>
        <tr><td>Gross Profit %</td><td class="status-${calc.status}">${formatPercent(calc.grossProfitPercent)}</td></tr>
        <tr><td>Over/(Under) Billed</td><td>$${calc.overUnderBilling >= 0 ? '' : '('}${formatCurrency(calc.overUnderBilling)}${calc.overUnderBilling < 0 ? ')' : ''}</td></tr>
        <tr><td>Status</td><td class="status-${calc.status}">${calc.status.toUpperCase()}</td></tr>
      </table>

      ${calc.warnings.length > 0 ? `
        <div class="warnings">
          <h3>Warnings & Alerts:</h3>
          <ul>
            ${calc.warnings.map(w => `<li>${w}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      <p style="margin-top: 40px; font-size: 12px; color: #666;">
        Generated by Accountrix WIP Calculator on ${new Date().toLocaleString()}
      </p>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  setTimeout(() => {
    printWindow.print();
  }, 250);
}

// ============================================================================
// Main Component
// ============================================================================

export default function WIPCalculator() {
  const [projects, setProjects] = useState<WIPProject[]>([]);
  const [showFormulas, setShowFormulas] = useState<Record<string, boolean>>({});
  const [compareMode, setCompareMode] = useState(false);
  const [selectedCompareProjects, setSelectedCompareProjects] = useState<
    [string | null, string | null]
  >([null, null]);

  // Calculate all project results
  const projectCalculations = useMemo(() => {
    return projects.map((project) => ({
      project,
      calculation: calculateProject(project),
    }));
  }, [projects]);

  // Calculate portfolio summary
  const portfolioSummary = useMemo(() => {
    return calculatePortfolioSummary(projects);
  }, [projects]);

  // Add a new blank project
  const addProject = () => {
    const newProject: WIPProject = {
      id: generateId(),
      name: `Project ${projects.length + 1}`,
      contractValue: 0,
      costsIncurred: 0,
      estimatedTotalCosts: 0,
      billingsToDate: 0,
      method: 'cost-to-cost',
    };
    setProjects([...projects, newProject]);
  };

  // Load a scenario
  const loadScenario = (scenarioKey: string) => {
    const scenario = SCENARIOS[scenarioKey];
    if (scenario) {
      setProjects([...projects, { ...scenario, id: generateId() }]);
    }
  };

  // Update a project
  const updateProject = (id: string, updates: Partial<WIPProject>) => {
    setProjects(
      projects.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  // Delete a project
  const deleteProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  // Duplicate a project
  const duplicateProject = (id: string) => {
    const project = projects.find((p) => p.id === id);
    if (project) {
      const duplicate = {
        ...project,
        id: generateId(),
        name: `${project.name} (Copy)`,
      };
      setProjects([...projects, duplicate]);
    }
  };

  // Toggle formula display
  const toggleFormula = (id: string) => {
    setShowFormulas((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Reset all projects
  const resetAll = () => {
    if (
      confirm('Are you sure you want to clear all projects? This cannot be undone.')
    ) {
      setProjects([]);
      setShowFormulas({});
    }
  };

  return (
    <TooltipProvider>
      <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              WIP Calculator
            </h1>
            <p className="text-gray-600 mt-1">
              Work-in-Progress Schedule - ASC 606 Revenue Recognition
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setCompareMode(!compareMode)}
            >
              {compareMode ? 'Exit Compare' : 'Compare Projects'}
            </Button>
            {projects.length > 0 && (
              <>
                <Button
                  variant="outline"
                  onClick={() => exportToExcel(projects)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Excel
                </Button>
                <Button variant="outline" onClick={resetAll}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset All
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Quick Load Scenarios */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Load Scenarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => loadScenario('healthy')}
              >
                Healthy Project (50% complete)
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => loadScenario('earlyStage')}
              >
                Early Stage (10% complete)
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => loadScenario('nearlyComplete')}
              >
                Nearly Complete (95%)
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => loadScenario('lossPosition')}
              >
                Loss Position
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => loadScenario('overBilled')}
              >
                Over-billed Situation
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => loadScenario('unitsMethod')}
              >
                Units of Delivery
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => loadScenario('effortsMethod')}
              >
                Efforts Expended
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Projects List */}
        {projectCalculations.length > 0 ? (
          <div className="space-y-4">
            {projectCalculations.map(({ project, calculation }) => (
              <ProjectCard
                key={project.id}
                project={project}
                calculation={calculation}
                showFormula={showFormulas[project.id] || false}
                onUpdate={updateProject}
                onDelete={deleteProject}
                onDuplicate={duplicateProject}
                onToggleFormula={toggleFormula}
                onExportPDF={() => exportProjectToPDF(project, calculation)}
                compareMode={compareMode}
                isSelectedForCompare={selectedCompareProjects.includes(
                  project.id
                )}
                onSelectForCompare={(id) => {
                  if (selectedCompareProjects[0] === id) {
                    setSelectedCompareProjects([null, selectedCompareProjects[1]]);
                  } else if (selectedCompareProjects[1] === id) {
                    setSelectedCompareProjects([selectedCompareProjects[0], null]);
                  } else if (selectedCompareProjects[0] === null) {
                    setSelectedCompareProjects([id, selectedCompareProjects[1]]);
                  } else if (selectedCompareProjects[1] === null) {
                    setSelectedCompareProjects([selectedCompareProjects[0], id]);
                  }
                }}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calculator className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Projects Yet
              </h3>
              <p className="text-gray-600 mb-4">
                Add a project or load a scenario to get started
              </p>
            </CardContent>
          </Card>
        )}

        {/* Add Project Button */}
        <Button onClick={addProject} className="w-full" size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Add New Project
        </Button>

        {/* Portfolio Summary */}
        {projects.length > 1 && (
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-2xl">Portfolio Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Projects</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {portfolioSummary.projectCount}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Total Contract Value
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${formatCurrency(portfolioSummary.totalContractValue)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Total Costs to Date
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${formatCurrency(portfolioSummary.totalCostsToDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${formatCurrency(portfolioSummary.totalRevenue)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Total Gross Profit
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      portfolioSummary.totalGrossProfit >= 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    ${formatCurrency(portfolioSummary.totalGrossProfit)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Average GP %</p>
                  <p
                    className={`text-2xl font-bold ${
                      portfolioSummary.averageGPPercent >= 15
                        ? 'text-green-600'
                        : portfolioSummary.averageGPPercent >= 5
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  >
                    {formatPercent(portfolioSummary.averageGPPercent)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Compare Mode Display */}
        {compareMode &&
          selectedCompareProjects[0] &&
          selectedCompareProjects[1] && (
            <ComparisonView
              project1={projects.find((p) => p.id === selectedCompareProjects[0])!}
              project2={projects.find((p) => p.id === selectedCompareProjects[1])!}
              calculation1={calculateProject(
                projects.find((p) => p.id === selectedCompareProjects[0])!
              )}
              calculation2={calculateProject(
                projects.find((p) => p.id === selectedCompareProjects[1])!
              )}
            />
          )}
      </div>
    </TooltipProvider>
  );
}

// ============================================================================
// Project Card Component
// ============================================================================

interface ProjectCardProps {
  project: WIPProject;
  calculation: WIPCalculation;
  showFormula: boolean;
  onUpdate: (id: string, updates: Partial<WIPProject>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onToggleFormula: (id: string) => void;
  onExportPDF: () => void;
  compareMode: boolean;
  isSelectedForCompare: boolean;
  onSelectForCompare: (id: string) => void;
}

function ProjectCard({
  project,
  calculation,
  showFormula,
  onUpdate,
  onDelete,
  onDuplicate,
  onToggleFormula,
  onExportPDF,
  compareMode,
  isSelectedForCompare,
  onSelectForCompare,
}: ProjectCardProps) {
  const statusColors = {
    healthy: 'bg-green-100 text-green-800 border-green-300',
    caution: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    alert: 'bg-red-100 text-red-800 border-red-300',
  };

  const statusIcons = {
    healthy: <CheckCircle className="w-4 h-4" />,
    caution: <AlertTriangle className="w-4 h-4" />,
    alert: <XCircle className="w-4 h-4" />,
  };

  return (
    <Card
      className={`${statusColors[calculation.status]} border-2 ${
        isSelectedForCompare ? 'ring-4 ring-blue-400' : ''
      }`}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Input
              value={project.name}
              onChange={(e) => onUpdate(project.id, { name: e.target.value })}
              className="text-xl font-bold mb-2 bg-white"
              placeholder="Project Name"
            />
            <div className="flex items-center gap-2 mt-2">
              <Label>Calculation Method:</Label>
              <Select
                value={project.method}
                onValueChange={(value: WIPProject['method']) =>
                  onUpdate(project.id, { method: value })
                }
              >
                <SelectTrigger className="w-64 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cost-to-cost">
                    Cost-to-Cost Method
                  </SelectItem>
                  <SelectItem value="units-of-delivery">
                    Units of Delivery Method
                  </SelectItem>
                  <SelectItem value="efforts-expended">
                    Efforts Expended Method
                  </SelectItem>
                </SelectContent>
              </Select>
              <Tooltip>
                <TooltipTrigger>
                  <AlertTriangle className="w-4 h-4 text-gray-500" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p className="font-semibold mb-1">Method Descriptions:</p>
                  <p className="text-sm">
                    <strong>Cost-to-Cost:</strong> Most common. Uses costs
                    incurred vs. estimated total costs.
                  </p>
                  <p className="text-sm mt-1">
                    <strong>Units of Delivery:</strong> For countable units
                    (homes, floors, etc.)
                  </p>
                  <p className="text-sm mt-1">
                    <strong>Efforts Expended:</strong> Based on labor hours used
                    vs. estimated hours.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={statusColors[calculation.status]}>
              {statusIcons[calculation.status]}
              <span className="ml-1">{calculation.status.toUpperCase()}</span>
            </Badge>
            {compareMode && (
              <Button
                size="sm"
                variant={isSelectedForCompare ? 'default' : 'outline'}
                onClick={() => onSelectForCompare(project.id)}
              >
                {isSelectedForCompare ? 'Selected' : 'Select'}
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => onToggleFormula(project.id)}
            >
              {showFormula ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </Button>
            <Button size="sm" variant="outline" onClick={onExportPDF}>
              <Download className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDuplicate(project.id)}
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(project.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white rounded-lg">
          <div>
            <Label htmlFor={`${project.id}-contract`}>
              Contract Value
              <Tooltip>
                <TooltipTrigger className="ml-1">
                  <AlertTriangle className="w-3 h-3 inline text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  Total contract amount for the project
                </TooltipContent>
              </Tooltip>
            </Label>
            <Input
              id={`${project.id}-contract`}
              type="number"
              value={project.contractValue}
              onChange={(e) =>
                onUpdate(project.id, {
                  contractValue: parseFloat(e.target.value) || 0,
                })
              }
              className="mt-1"
              placeholder="0"
            />
          </div>

          <div>
            <Label htmlFor={`${project.id}-costs`}>
              Costs Incurred to Date
              <Tooltip>
                <TooltipTrigger className="ml-1">
                  <AlertTriangle className="w-3 h-3 inline text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  All costs incurred on the project to date
                </TooltipContent>
              </Tooltip>
            </Label>
            <Input
              id={`${project.id}-costs`}
              type="number"
              value={project.costsIncurred}
              onChange={(e) =>
                onUpdate(project.id, {
                  costsIncurred: parseFloat(e.target.value) || 0,
                })
              }
              className="mt-1"
              placeholder="0"
            />
          </div>

          <div>
            <Label htmlFor={`${project.id}-estimated`}>
              Estimated Total Costs
              <Tooltip>
                <TooltipTrigger className="ml-1">
                  <AlertTriangle className="w-3 h-3 inline text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  Your best estimate of total costs at completion
                </TooltipContent>
              </Tooltip>
            </Label>
            <Input
              id={`${project.id}-estimated`}
              type="number"
              value={project.estimatedTotalCosts}
              onChange={(e) =>
                onUpdate(project.id, {
                  estimatedTotalCosts: parseFloat(e.target.value) || 0,
                })
              }
              className="mt-1"
              placeholder="0"
            />
          </div>

          <div>
            <Label htmlFor={`${project.id}-billings`}>
              Billings to Date
              <Tooltip>
                <TooltipTrigger className="ml-1">
                  <AlertTriangle className="w-3 h-3 inline text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  Total amount billed to customer to date
                </TooltipContent>
              </Tooltip>
            </Label>
            <Input
              id={`${project.id}-billings`}
              type="number"
              value={project.billingsToDate}
              onChange={(e) =>
                onUpdate(project.id, {
                  billingsToDate: parseFloat(e.target.value) || 0,
                })
              }
              className="mt-1"
              placeholder="0"
            />
          </div>

          {/* Additional fields for Units of Delivery method */}
          {project.method === 'units-of-delivery' && (
            <>
              <div>
                <Label htmlFor={`${project.id}-units-completed`}>
                  Units Completed
                </Label>
                <Input
                  id={`${project.id}-units-completed`}
                  type="number"
                  value={project.unitsCompleted || 0}
                  onChange={(e) =>
                    onUpdate(project.id, {
                      unitsCompleted: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="mt-1"
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor={`${project.id}-total-units`}>
                  Total Units
                </Label>
                <Input
                  id={`${project.id}-total-units`}
                  type="number"
                  value={project.totalUnits || 0}
                  onChange={(e) =>
                    onUpdate(project.id, {
                      totalUnits: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="mt-1"
                  placeholder="0"
                />
              </div>
            </>
          )}

          {/* Additional fields for Efforts Expended method */}
          {project.method === 'efforts-expended' && (
            <>
              <div>
                <Label htmlFor={`${project.id}-hours-used`}>
                  Labor Hours Used
                </Label>
                <Input
                  id={`${project.id}-hours-used`}
                  type="number"
                  value={project.hoursUsed || 0}
                  onChange={(e) =>
                    onUpdate(project.id, {
                      hoursUsed: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="mt-1"
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor={`${project.id}-total-hours`}>
                  Total Estimated Hours
                </Label>
                <Input
                  id={`${project.id}-total-hours`}
                  type="number"
                  value={project.totalEstimatedHours || 0}
                  onChange={(e) =>
                    onUpdate(project.id, {
                      totalEstimatedHours: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="mt-1"
                  placeholder="0"
                />
              </div>
            </>
          )}
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Project Progress</span>
            <span className="text-sm font-bold">
              {formatPercent(calculation.percentComplete)}
            </span>
          </div>
          <Progress
            value={Math.min(calculation.percentComplete, 100)}
            className="h-3"
          />
        </div>

        {/* Calculations Display */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-white rounded-lg">
          <div>
            <p className="text-sm text-gray-600 mb-1">% Complete</p>
            <p className="text-xl font-bold">
              {formatPercent(calculation.percentComplete)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Revenue to Recognize</p>
            <p className="text-xl font-bold text-green-600">
              ${formatCurrency(calculation.revenueToRecognize)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Gross Profit</p>
            <p
              className={`text-xl font-bold ${
                calculation.grossProfit >= 0
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              ${formatCurrency(calculation.grossProfit)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">GP %</p>
            <p
              className={`text-xl font-bold ${
                calculation.grossProfitPercent >= 15
                  ? 'text-green-600'
                  : calculation.grossProfitPercent >= 5
                  ? 'text-yellow-600'
                  : 'text-red-600'
              }`}
            >
              {formatPercent(calculation.grossProfitPercent)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Over/(Under) Billed</p>
            <p
              className={`text-xl font-bold ${
                calculation.overUnderBilling > 0
                  ? 'text-blue-600'
                  : 'text-orange-600'
              }`}
            >
              {calculation.overUnderBilling >= 0 ? '' : '('}$
              {formatCurrency(calculation.overUnderBilling)}
              {calculation.overUnderBilling < 0 ? ')' : ''}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {calculation.overUnderBilling > 0 ? 'OVER' : 'UNDER'}
            </p>
          </div>
        </div>

        {/* Formula Display */}
        {showFormula && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold mb-2">Calculation Formulas:</h4>
            <div className="space-y-2 text-sm font-mono">
              {project.method === 'cost-to-cost' && (
                <>
                  <p>
                    % Complete = ${formatCurrency(project.costsIncurred)} ÷ $
                    {formatCurrency(project.estimatedTotalCosts)} ={' '}
                    {formatPercent(calculation.percentComplete)}
                  </p>
                  <p>
                    Revenue = ${formatCurrency(project.contractValue)} ×{' '}
                    {formatPercent(calculation.percentComplete)} = $
                    {formatCurrency(calculation.revenueToRecognize)}
                  </p>
                </>
              )}
              {project.method === 'units-of-delivery' && (
                <>
                  <p>
                    % Complete = {project.unitsCompleted} ÷ {project.totalUnits}{' '}
                    = {formatPercent(calculation.percentComplete)}
                  </p>
                  <p>
                    Revenue = ${formatCurrency(project.contractValue)} ×{' '}
                    {formatPercent(calculation.percentComplete)} = $
                    {formatCurrency(calculation.revenueToRecognize)}
                  </p>
                </>
              )}
              {project.method === 'efforts-expended' && (
                <>
                  <p>
                    % Complete = {project.hoursUsed} hours ÷{' '}
                    {project.totalEstimatedHours} hours ={' '}
                    {formatPercent(calculation.percentComplete)}
                  </p>
                  <p>
                    Revenue = ${formatCurrency(project.contractValue)} ×{' '}
                    {formatPercent(calculation.percentComplete)} = $
                    {formatCurrency(calculation.revenueToRecognize)}
                  </p>
                </>
              )}
              <p>
                Gross Profit = ${formatCurrency(calculation.revenueToRecognize)}{' '}
                - ${formatCurrency(project.costsIncurred)} = $
                {formatCurrency(calculation.grossProfit)}
              </p>
              <p>
                GP % = ${formatCurrency(calculation.grossProfit)} ÷ $
                {formatCurrency(calculation.revenueToRecognize)} ={' '}
                {formatPercent(calculation.grossProfitPercent)}
              </p>
              <p>
                Over/(Under) = ${formatCurrency(project.billingsToDate)} - $
                {formatCurrency(calculation.revenueToRecognize)} = $
                {calculation.overUnderBilling >= 0 ? '' : '('}
                {formatCurrency(calculation.overUnderBilling)}
                {calculation.overUnderBilling < 0 ? ')' : ''}
              </p>
            </div>
          </div>
        )}

        {/* Warnings */}
        {calculation.warnings.length > 0 && (
          <div className="space-y-2">
            {calculation.warnings.map((warning, index) => (
              <Alert key={index} variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{warning}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Comparison View Component
// ============================================================================

interface ComparisonViewProps {
  project1: WIPProject;
  project2: WIPProject;
  calculation1: WIPCalculation;
  calculation2: WIPCalculation;
}

function ComparisonView({
  project1,
  project2,
  calculation1,
  calculation2,
}: ComparisonViewProps) {
  const metrics = [
    {
      label: '% Complete',
      value1: formatPercent(calculation1.percentComplete),
      value2: formatPercent(calculation2.percentComplete),
      diff: calculation1.percentComplete - calculation2.percentComplete,
      format: (v: number) => formatPercent(v),
    },
    {
      label: 'Revenue to Recognize',
      value1: `$${formatCurrency(calculation1.revenueToRecognize)}`,
      value2: `$${formatCurrency(calculation2.revenueToRecognize)}`,
      diff: calculation1.revenueToRecognize - calculation2.revenueToRecognize,
      format: (v: number) => `$${formatCurrency(v)}`,
    },
    {
      label: 'Gross Profit',
      value1: `$${formatCurrency(calculation1.grossProfit)}`,
      value2: `$${formatCurrency(calculation2.grossProfit)}`,
      diff: calculation1.grossProfit - calculation2.grossProfit,
      format: (v: number) => `$${formatCurrency(v)}`,
    },
    {
      label: 'GP %',
      value1: formatPercent(calculation1.grossProfitPercent),
      value2: formatPercent(calculation2.grossProfitPercent),
      diff: calculation1.grossProfitPercent - calculation2.grossProfitPercent,
      format: (v: number) => formatPercent(v),
    },
    {
      label: 'Over/(Under) Billed',
      value1: `$${formatCurrency(calculation1.overUnderBilling)}`,
      value2: `$${formatCurrency(calculation2.overUnderBilling)}`,
      diff: calculation1.overUnderBilling - calculation2.overUnderBilling,
      format: (v: number) => `$${formatCurrency(v)}`,
    },
  ];

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
      <CardHeader>
        <CardTitle>Project Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left p-3 font-semibold">Metric</th>
                <th className="text-right p-3 font-semibold">
                  {project1.name}
                </th>
                <th className="text-right p-3 font-semibold">
                  {project2.name}
                </th>
                <th className="text-right p-3 font-semibold">Difference</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-white/50"
                >
                  <td className="p-3">{metric.label}</td>
                  <td className="p-3 text-right font-mono">{metric.value1}</td>
                  <td className="p-3 text-right font-mono">{metric.value2}</td>
                  <td
                    className={`p-3 text-right font-mono font-semibold ${
                      metric.diff > 0
                        ? 'text-green-600'
                        : metric.diff < 0
                        ? 'text-red-600'
                        : 'text-gray-600'
                    }`}
                  >
                    {metric.diff > 0 ? '+' : ''}
                    {metric.format(metric.diff)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
