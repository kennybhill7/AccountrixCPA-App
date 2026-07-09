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
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Download,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle,
  FileText,
  Save,
  HelpCircle,
  Calendar,
  DollarSign,
  Percent,
  Eye,
  Edit2,
  Copy,
  History,
} from 'lucide-react';

// ============================================================================
// TypeScript Interfaces
// ============================================================================

interface AIAApplication {
  id: string;
  applicationNumber: number;
  periodEndDate: string;
  projectInfo: {
    owner: string;
    project: string;
    contractFor: string;
    contractDate: string;
    architect?: string;
    contractNumber?: string;
  };
  contract: {
    originalSum: number;
    changeOrders: ChangeOrder[];
    netChangeOrders: number;
    contractSumToDate: number;
  };
  workItems: WorkItem[];
  retainagePercent: number;
  previousCertificates: number;
  createdDate: string;
  lastModified: string;
}

interface WorkItem {
  id: string;
  itemNumber: number;
  description: string;
  scheduledValue: number;
  workCompletedPrevious: number;
  workCompletedThisPeriod: number;
  materialsStored: number;
  totalCompleted: number;
  percentComplete: number;
  balanceToFinish: number;
}

interface ChangeOrder {
  id: string;
  number: string;
  date: string;
  amount: number;
  description: string;
  approved: boolean;
}

interface ValidationResult {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

interface Template {
  name: string;
  description: string;
  workItems: Omit<WorkItem, 'id' | 'totalCompleted' | 'percentComplete' | 'balanceToFinish'>[];
}

// ============================================================================
// Pre-built Templates
// ============================================================================

const TEMPLATES: Record<string, Template> = {
  commercial: {
    name: 'Commercial Building',
    description: '10 standard line items for commercial construction',
    workItems: [
      { itemNumber: 1, description: 'General Conditions', scheduledValue: 150000, workCompletedPrevious: 0, workCompletedThisPeriod: 0, materialsStored: 0 },
      { itemNumber: 2, description: 'Site Work & Excavation', scheduledValue: 200000, workCompletedPrevious: 0, workCompletedThisPeriod: 0, materialsStored: 0 },
      { itemNumber: 3, description: 'Concrete & Foundation', scheduledValue: 350000, workCompletedPrevious: 0, workCompletedThisPeriod: 0, materialsStored: 0 },
      { itemNumber: 4, description: 'Masonry', scheduledValue: 250000, workCompletedPrevious: 0, workCompletedThisPeriod: 0, materialsStored: 0 },
      { itemNumber: 5, description: 'Structural Steel', scheduledValue: 400000, workCompletedPrevious: 0, workCompletedThisPeriod: 0, materialsStored: 0 },
      { itemNumber: 6, description: 'Rough Carpentry', scheduledValue: 180000, workCompletedPrevious: 0, workCompletedThisPeriod: 0, materialsStored: 0 },
      { itemNumber: 7, description: 'Roofing & Waterproofing', scheduledValue: 220000, workCompletedPrevious: 0, workCompletedThisPeriod: 0, materialsStored: 0 },
      { itemNumber: 8, description: 'MEP Systems', scheduledValue: 500000, workCompletedPrevious: 0, workCompletedThisPeriod: 0, materialsStored: 0 },
      { itemNumber: 9, description: 'Interior Finishes', scheduledValue: 450000, workCompletedPrevious: 0, workCompletedThisPeriod: 0, materialsStored: 0 },
      { itemNumber: 10, description: 'Site Improvements', scheduledValue: 150000, workCompletedPrevious: 0, workCompletedThisPeriod: 0, materialsStored: 0 },
    ],
  },
  residential: {
    name: 'Residential Construction',
    description: '8 line items for residential building',
    workItems: [
      { itemNumber: 1, description: 'General Requirements', scheduledValue: 50000, workCompletedPrevious: 0, workCompletedThisPeriod: 0, materialsStored: 0 },
      { itemNumber: 2, description: 'Site Preparation', scheduledValue: 75000, workCompletedPrevious: 0, workCompletedThisPeriod: 0, materialsStored: 0 },
      { itemNumber: 3, description: 'Foundation & Concrete', scheduledValue: 120000, workCompletedPrevious: 0, workCompletedThisPeriod: 0, materialsStored: 0 },
      { itemNumber: 4, description: 'Framing & Rough Carpentry', scheduledValue: 180000, workCompletedPrevious: 0, workCompletedThisPeriod: 0, materialsStored: 0 },
      { itemNumber: 5, description: 'Roofing', scheduledValue: 90000, workCompletedPrevious: 0, workCompletedThisPeriod: 0, materialsStored: 0 },
      { itemNumber: 6, description: 'Plumbing & HVAC', scheduledValue: 110000, workCompletedPrevious: 0, workCompletedThisPeriod: 0, materialsStored: 0 },
      { itemNumber: 7, description: 'Electrical', scheduledValue: 95000, workCompletedPrevious: 0, workCompletedThisPeriod: 0, materialsStored: 0 },
      { itemNumber: 8, description: 'Interior & Exterior Finishes', scheduledValue: 200000, workCompletedPrevious: 0, workCompletedThisPeriod: 0, materialsStored: 0 },
    ],
  },
  highway: {
    name: 'Road/Highway',
    description: '12 line items for road construction',
    workItems: [
      { itemNumber: 1, description: 'Mobilization', scheduledValue: 250000, workCompletedPrevious: 0, workCompletedThisPeriod: 0, materialsStored: 0 },
      { itemNumber: 2, description: 'Clearing & Grubbing', scheduledValue: 180000, workCompletedPrevious: 0, workCompletedThisPeriod: 0, materialsStored: 0 },
      { itemNumber: 3, description: 'Earthwork', scheduledValue: 850000, workCompletedPrevious: 0, workCompletedThisPeriod: 0, materialsStored: 0 },
      { itemNumber: 4, description: 'Drainage Structures', scheduledValue: 420000, workCompletedPrevious: 0, workCompletedThisPeriod: 0, materialsStored: 0 },
      { itemNumber: 5, description: 'Base Course', scheduledValue: 380000, workCompletedPrevious: 0, workCompletedThisPeriod: 0, materialsStored: 0 },
      { itemNumber: 6, description: 'Asphalt Paving', scheduledValue: 620000, workCompletedPrevious: 0, workCompletedThisPeriod: 0, materialsStored: 0 },
      { itemNumber: 7, description: 'Concrete Pavement', scheduledValue: 480000, workCompletedPrevious: 0, workCompletedThisPeriod: 0, materialsStored: 0 },
      { itemNumber: 8, description: 'Bridge Work', scheduledValue: 750000, workCompletedPrevious: 0, workCompletedThisPeriod: 0, materialsStored: 0 },
      { itemNumber: 9, description: 'Guardrail & Safety', scheduledValue: 220000, workCompletedPrevious: 0, workCompletedThisPeriod: 0, materialsStored: 0 },
      { itemNumber: 10, description: 'Striping & Signage', scheduledValue: 150000, workCompletedPrevious: 0, workCompletedThisPeriod: 0, materialsStored: 0 },
      { itemNumber: 11, description: 'Landscaping', scheduledValue: 180000, workCompletedPrevious: 0, workCompletedThisPeriod: 0, materialsStored: 0 },
      { itemNumber: 12, description: 'Traffic Control', scheduledValue: 120000, workCompletedPrevious: 0, workCompletedThisPeriod: 0, materialsStored: 0 },
    ],
  },
};

// ============================================================================
// Practice Scenarios
// ============================================================================

const SCENARIOS: Record<string, Partial<AIAApplication>> = {
  simple: {
    applicationNumber: 1,
    periodEndDate: new Date().toISOString().split('T')[0],
    projectInfo: {
      owner: 'ABC Development Corp',
      project: 'Retail Plaza Construction',
      contractFor: 'General Construction Services',
      contractDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      architect: 'Smith & Associates',
    },
    contract: {
      originalSum: 500000,
      changeOrders: [],
      netChangeOrders: 0,
      contractSumToDate: 500000,
    },
    workItems: [
      { id: '1', itemNumber: 1, description: 'Site Work', scheduledValue: 100000, workCompletedPrevious: 0, workCompletedThisPeriod: 50000, materialsStored: 0, totalCompleted: 50000, percentComplete: 50, balanceToFinish: 50000 },
      { id: '2', itemNumber: 2, description: 'Foundation', scheduledValue: 120000, workCompletedPrevious: 0, workCompletedThisPeriod: 60000, materialsStored: 0, totalCompleted: 60000, percentComplete: 50, balanceToFinish: 60000 },
      { id: '3', itemNumber: 3, description: 'Framing', scheduledValue: 150000, workCompletedPrevious: 0, workCompletedThisPeriod: 75000, materialsStored: 0, totalCompleted: 75000, percentComplete: 50, balanceToFinish: 75000 },
      { id: '4', itemNumber: 4, description: 'MEP', scheduledValue: 80000, workCompletedPrevious: 0, workCompletedThisPeriod: 40000, materialsStored: 0, totalCompleted: 40000, percentComplete: 50, balanceToFinish: 40000 },
      { id: '5', itemNumber: 5, description: 'Finishes', scheduledValue: 50000, workCompletedPrevious: 0, workCompletedThisPeriod: 25000, materialsStored: 0, totalCompleted: 25000, percentComplete: 50, balanceToFinish: 25000 },
    ],
    retainagePercent: 10,
    previousCertificates: 0,
  },
  midProject: {
    applicationNumber: 5,
    periodEndDate: new Date().toISOString().split('T')[0],
    projectInfo: {
      owner: 'Metro City Government',
      project: 'Downtown Office Complex',
      contractFor: 'Complete Construction per Plans & Specifications',
      contractDate: new Date(Date.now() - 240 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      architect: 'Urban Design Group',
    },
    contract: {
      originalSum: 2000000,
      changeOrders: [
        { id: 'co1', number: 'CO-001', date: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 75000, description: 'Additional HVAC units', approved: true },
        { id: 'co2', number: 'CO-002', date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: -25000, description: 'Value engineering savings', approved: true },
        { id: 'co3', number: 'CO-003', date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 50000, description: 'Owner-requested upgrades', approved: true },
      ],
      netChangeOrders: 100000,
      contractSumToDate: 2100000,
    },
    workItems: [
      { id: '1', itemNumber: 1, description: 'General Conditions', scheduledValue: 180000, workCompletedPrevious: 150000, workCompletedThisPeriod: 20000, materialsStored: 0, totalCompleted: 170000, percentComplete: 94.4, balanceToFinish: 10000 },
      { id: '2', itemNumber: 2, description: 'Site Work', scheduledValue: 250000, workCompletedPrevious: 250000, workCompletedThisPeriod: 0, materialsStored: 0, totalCompleted: 250000, percentComplete: 100, balanceToFinish: 0 },
      { id: '3', itemNumber: 3, description: 'Concrete', scheduledValue: 350000, workCompletedPrevious: 320000, workCompletedThisPeriod: 30000, materialsStored: 0, totalCompleted: 350000, percentComplete: 100, balanceToFinish: 0 },
      { id: '4', itemNumber: 4, description: 'Steel', scheduledValue: 420000, workCompletedPrevious: 380000, workCompletedThisPeriod: 40000, materialsStored: 0, totalCompleted: 420000, percentComplete: 100, balanceToFinish: 0 },
      { id: '5', itemNumber: 5, description: 'Masonry', scheduledValue: 180000, workCompletedPrevious: 120000, workCompletedThisPeriod: 40000, materialsStored: 0, totalCompleted: 160000, percentComplete: 88.9, balanceToFinish: 20000 },
      { id: '6', itemNumber: 6, description: 'MEP Systems', scheduledValue: 500000, workCompletedPrevious: 200000, workCompletedThisPeriod: 100000, materialsStored: 50000, totalCompleted: 350000, percentComplete: 70, balanceToFinish: 150000 },
      { id: '7', itemNumber: 7, description: 'Drywall & Finishes', scheduledValue: 220000, workCompletedPrevious: 80000, workCompletedThisPeriod: 60000, materialsStored: 10000, totalCompleted: 150000, percentComplete: 68.2, balanceToFinish: 70000 },
    ],
    retainagePercent: 10,
    previousCertificates: 900000,
  },
  final: {
    applicationNumber: 12,
    periodEndDate: new Date().toISOString().split('T')[0],
    projectInfo: {
      owner: 'Regional Hospital District',
      project: 'Medical Center Expansion',
      contractFor: 'Construction of 3-Story Addition',
      contractDate: new Date(Date.now() - 540 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      architect: 'Healthcare Design Partners',
    },
    contract: {
      originalSum: 3500000,
      changeOrders: [
        { id: 'co1', number: 'CO-001', date: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 125000, description: 'Medical gas system upgrade', approved: true },
        { id: 'co2', number: 'CO-002', date: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 80000, description: 'Additional shielding for imaging room', approved: true },
        { id: 'co3', number: 'CO-003', date: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: -45000, description: 'Deleted alternate finishes', approved: true },
        { id: 'co4', number: 'CO-004', date: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 90000, description: 'Code-required fire suppression', approved: true },
      ],
      netChangeOrders: 250000,
      contractSumToDate: 3750000,
    },
    workItems: [
      { id: '1', itemNumber: 1, description: 'General Conditions', scheduledValue: 280000, workCompletedPrevious: 280000, workCompletedThisPeriod: 0, materialsStored: 0, totalCompleted: 280000, percentComplete: 100, balanceToFinish: 0 },
      { id: '2', itemNumber: 2, description: 'Site & Foundation', scheduledValue: 450000, workCompletedPrevious: 450000, workCompletedThisPeriod: 0, materialsStored: 0, totalCompleted: 450000, percentComplete: 100, balanceToFinish: 0 },
      { id: '3', itemNumber: 3, description: 'Structure', scheduledValue: 820000, workCompletedPrevious: 820000, workCompletedThisPeriod: 0, materialsStored: 0, totalCompleted: 820000, percentComplete: 100, balanceToFinish: 0 },
      { id: '4', itemNumber: 4, description: 'Exterior Envelope', scheduledValue: 520000, workCompletedPrevious: 520000, workCompletedThisPeriod: 0, materialsStored: 0, totalCompleted: 520000, percentComplete: 100, balanceToFinish: 0 },
      { id: '5', itemNumber: 5, description: 'MEP Systems', scheduledValue: 980000, workCompletedPrevious: 950000, workCompletedThisPeriod: 30000, materialsStored: 0, totalCompleted: 980000, percentComplete: 100, balanceToFinish: 0 },
      { id: '6', itemNumber: 6, description: 'Interior Finishes', scheduledValue: 620000, workCompletedPrevious: 590000, workCompletedThisPeriod: 25000, materialsStored: 0, totalCompleted: 615000, percentComplete: 99.2, balanceToFinish: 5000 },
      { id: '7', itemNumber: 7, description: 'Punch List Items', scheduledValue: 80000, workCompletedPrevious: 50000, workCompletedThisPeriod: 25000, materialsStored: 0, totalCompleted: 75000, percentComplete: 93.8, balanceToFinish: 5000 },
    ],
    retainagePercent: 0, // Final retainage release
    previousCertificates: 3380000,
  },
};

// ============================================================================
// Calculation Helper Functions
// ============================================================================

function calculateWorkItemTotals(item: Partial<WorkItem>): WorkItem {
  const totalCompleted =
    (item.workCompletedPrevious || 0) +
    (item.workCompletedThisPeriod || 0) +
    (item.materialsStored || 0);
  const percentComplete =
    item.scheduledValue && item.scheduledValue > 0
      ? (totalCompleted / item.scheduledValue) * 100
      : 0;
  const balanceToFinish = (item.scheduledValue || 0) - totalCompleted;

  return {
    id: item.id || generateId(),
    itemNumber: item.itemNumber || 0,
    description: item.description || '',
    scheduledValue: item.scheduledValue || 0,
    workCompletedPrevious: item.workCompletedPrevious || 0,
    workCompletedThisPeriod: item.workCompletedThisPeriod || 0,
    materialsStored: item.materialsStored || 0,
    totalCompleted,
    percentComplete,
    balanceToFinish,
  };
}

function calculateRetainage(totalEarned: number, percent: number): number {
  return (totalEarned * percent) / 100;
}

function calculateCurrentPaymentDue(application: AIAApplication): number {
  const totalEarned = application.workItems.reduce(
    (sum, item) => sum + item.totalCompleted,
    0
  );
  const retainageAmount = calculateRetainage(
    totalEarned,
    application.retainagePercent
  );
  const totalEarnedLessRetainage = totalEarned - retainageAmount;
  const currentPaymentDue =
    totalEarnedLessRetainage - application.previousCertificates;
  return currentPaymentDue;
}

function calculateApplicationSummary(application: AIAApplication) {
  const totalEarned = application.workItems.reduce(
    (sum, item) => sum + item.totalCompleted,
    0
  );
  const retainageAmount = calculateRetainage(
    totalEarned,
    application.retainagePercent
  );
  const totalEarnedLessRetainage = totalEarned - retainageAmount;
  const currentPaymentDue =
    totalEarnedLessRetainage - application.previousCertificates;
  const balanceToFinish = application.contract.contractSumToDate - totalEarned;
  const percentComplete =
    application.contract.contractSumToDate > 0
      ? (totalEarned / application.contract.contractSumToDate) * 100
      : 0;

  return {
    totalEarned,
    retainageAmount,
    totalEarnedLessRetainage,
    currentPaymentDue,
    balanceToFinish,
    percentComplete,
  };
}

function validateApplication(
  application: AIAApplication
): ValidationResult[] {
  const results: ValidationResult[] = [];

  // Required fields
  if (!application.projectInfo.owner) {
    results.push({
      field: 'owner',
      message: 'Owner name is required',
      severity: 'error',
    });
  }
  if (!application.projectInfo.project) {
    results.push({
      field: 'project',
      message: 'Project name is required',
      severity: 'error',
    });
  }
  if (!application.periodEndDate) {
    results.push({
      field: 'periodEndDate',
      message: 'Period end date is required',
      severity: 'error',
    });
  }

  // Contract validation
  if (application.contract.originalSum <= 0) {
    results.push({
      field: 'originalSum',
      message: 'Original contract sum must be greater than zero',
      severity: 'error',
    });
  }

  // Work items validation
  if (application.workItems.length === 0) {
    results.push({
      field: 'workItems',
      message: 'At least one work item is required',
      severity: 'error',
    });
  }

  application.workItems.forEach((item) => {
    if (!item.description) {
      results.push({
        field: `workItem-${item.id}`,
        message: `Item ${item.itemNumber}: Description is required`,
        severity: 'error',
      });
    }
    if (item.totalCompleted > item.scheduledValue) {
      results.push({
        field: `workItem-${item.id}`,
        message: `Item ${item.itemNumber}: Work completed exceeds scheduled value`,
        severity: 'warning',
      });
    }
    if (item.percentComplete > 100) {
      results.push({
        field: `workItem-${item.id}`,
        message: `Item ${item.itemNumber}: Completion exceeds 100%`,
        severity: 'warning',
      });
    }
  });

  // Payment validation
  const summary = calculateApplicationSummary(application);
  if (summary.currentPaymentDue < 0) {
    results.push({
      field: 'payment',
      message: 'Current payment due is negative. Check previous certificates amount.',
      severity: 'warning',
    });
  }

  // Retainage validation
  if (application.retainagePercent < 0 || application.retainagePercent > 100) {
    results.push({
      field: 'retainage',
      message: 'Retainage percentage must be between 0 and 100',
      severity: 'error',
    });
  }

  return results;
}

// ============================================================================
// Export Functions
// ============================================================================

function generateG702PDF(application: AIAApplication): void {
  const summary = calculateApplicationSummary(application);
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>AIA G702 - Application ${application.applicationNumber}</title>
      <style>
        @page { size: letter; margin: 0.5in; }
        body { font-family: Arial, sans-serif; font-size: 10pt; line-height: 1.3; }
        .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 16pt; }
        .header p { margin: 2px 0; font-size: 9pt; }
        .section { margin: 15px 0; }
        .section-title { font-weight: bold; background: #f0f0f0; padding: 5px; margin-bottom: 10px; border: 1px solid #000; }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .field { margin: 8px 0; }
        .field-label { font-weight: bold; font-size: 8pt; color: #666; }
        .field-value { border-bottom: 1px solid #000; padding: 2px 0; min-height: 18px; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { border: 1px solid #000; padding: 6px; text-align: left; }
        th { background: #f0f0f0; font-weight: bold; font-size: 9pt; }
        td { font-size: 9pt; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .total-row { font-weight: bold; background: #f9f9f9; }
        .signature-section { margin-top: 40px; }
        .signature-line { border-top: 1px solid #000; width: 300px; margin-top: 40px; padding-top: 5px; }
        .highlight { background: #ffffcc; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>APPLICATION AND CERTIFICATE FOR PAYMENT</h1>
        <p>AIA Document G702 - Application for Payment</p>
      </div>

      <div class="two-col">
        <div class="section">
          <div class="section-title">PROJECT INFORMATION</div>
          <div class="field">
            <div class="field-label">TO OWNER:</div>
            <div class="field-value">${application.projectInfo.owner}</div>
          </div>
          <div class="field">
            <div class="field-label">PROJECT:</div>
            <div class="field-value">${application.projectInfo.project}</div>
          </div>
          <div class="field">
            <div class="field-label">CONTRACT FOR:</div>
            <div class="field-value">${application.projectInfo.contractFor}</div>
          </div>
          ${application.projectInfo.architect ? `
          <div class="field">
            <div class="field-label">ARCHITECT:</div>
            <div class="field-value">${application.projectInfo.architect}</div>
          </div>
          ` : ''}
        </div>

        <div class="section">
          <div class="section-title">APPLICATION DETAILS</div>
          <div class="field">
            <div class="field-label">APPLICATION NUMBER:</div>
            <div class="field-value">${application.applicationNumber}</div>
          </div>
          <div class="field">
            <div class="field-label">PERIOD TO:</div>
            <div class="field-value">${new Date(application.periodEndDate).toLocaleDateString()}</div>
          </div>
          <div class="field">
            <div class="field-label">CONTRACT DATE:</div>
            <div class="field-value">${new Date(application.projectInfo.contractDate).toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">CONTRACT SUMMARY</div>
        <table>
          <tr>
            <td style="width: 70%">1. ORIGINAL CONTRACT SUM</td>
            <td class="text-right" style="width: 30%">$${formatCurrency(application.contract.originalSum)}</td>
          </tr>
          <tr>
            <td>2. NET CHANGE BY CHANGE ORDERS</td>
            <td class="text-right">$${formatCurrency(application.contract.netChangeOrders)}</td>
          </tr>
          <tr class="total-row">
            <td>3. CONTRACT SUM TO DATE (Line 1 Â± 2)</td>
            <td class="text-right">$${formatCurrency(application.contract.contractSumToDate)}</td>
          </tr>
        </table>
      </div>

      <div class="section">
        <div class="section-title">WORK COMPLETED</div>
        <table>
          <tr>
            <td style="width: 70%">4. TOTAL COMPLETED AND STORED TO DATE</td>
            <td class="text-right" style="width: 30%">$${formatCurrency(summary.totalEarned)}</td>
          </tr>
          <tr>
            <td>5. RETAINAGE (${application.retainagePercent}%)</td>
            <td class="text-right">$${formatCurrency(summary.retainageAmount)}</td>
          </tr>
          <tr class="total-row">
            <td>6. TOTAL EARNED LESS RETAINAGE (Line 4 - 5)</td>
            <td class="text-right">$${formatCurrency(summary.totalEarnedLessRetainage)}</td>
          </tr>
          <tr>
            <td>7. LESS PREVIOUS CERTIFICATES FOR PAYMENT</td>
            <td class="text-right">$${formatCurrency(application.previousCertificates)}</td>
          </tr>
          <tr class="total-row highlight">
            <td>8. CURRENT PAYMENT DUE (Line 6 - 7)</td>
            <td class="text-right">$${formatCurrency(summary.currentPaymentDue)}</td>
          </tr>
          <tr>
            <td>9. BALANCE TO FINISH, INCLUDING RETAINAGE</td>
            <td class="text-right">$${formatCurrency(summary.balanceToFinish + summary.retainageAmount)}</td>
          </tr>
        </table>
      </div>

      ${application.contract.changeOrders.length > 0 ? `
      <div class="section">
        <div class="section-title">CHANGE ORDERS</div>
        <table>
          <thead>
            <tr>
              <th style="width: 15%">Number</th>
              <th style="width: 20%">Date</th>
              <th style="width: 45%">Description</th>
              <th style="width: 20%" class="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${application.contract.changeOrders.map(co => `
              <tr>
                <td>${co.number}</td>
                <td>${new Date(co.date).toLocaleDateString()}</td>
                <td>${co.description}</td>
                <td class="text-right">$${formatCurrency(co.amount)}</td>
              </tr>
            `).join('')}
            <tr class="total-row">
              <td colspan="3" class="text-right">NET CHANGE BY CHANGE ORDERS:</td>
              <td class="text-right">$${formatCurrency(application.contract.netChangeOrders)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      ` : ''}

      <div class="signature-section">
        <p style="margin-bottom: 60px;"><strong>CONTRACTOR'S CERTIFICATION:</strong> The undersigned Contractor certifies that to the best of the Contractor's knowledge, information and belief, the Work covered by this Application for Payment has been completed in accordance with the Contract Documents.</p>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
          <div>
            <div class="signature-line">
              <div style="font-size: 8pt;">Contractor Signature</div>
            </div>
          </div>
          <div>
            <div class="signature-line">
              <div style="font-size: 8pt;">Date</div>
            </div>
          </div>
        </div>
      </div>

      <div style="page-break-before: always;"></div>

      <!-- G703 Continuation Sheet -->
      <div class="header">
        <h1>CONTINUATION SHEET</h1>
        <p>AIA Document G703 - Application for Payment No. ${application.applicationNumber}</p>
        <p>${application.projectInfo.project}</p>
      </div>

      <table style="font-size: 8pt;">
        <thead>
          <tr>
            <th style="width: 5%">Item</th>
            <th style="width: 25%">Description</th>
            <th style="width: 12%" class="text-right">Scheduled Value</th>
            <th style="width: 12%" class="text-right">Previous</th>
            <th style="width: 12%" class="text-right">This Period</th>
            <th style="width: 10%" class="text-right">Materials</th>
            <th style="width: 12%" class="text-right">Total Complete</th>
            <th style="width: 6%" class="text-center">%</th>
            <th style="width: 12%" class="text-right">Balance</th>
          </tr>
        </thead>
        <tbody>
          ${application.workItems.map(item => `
            <tr>
              <td class="text-center">${item.itemNumber}</td>
              <td>${item.description}</td>
              <td class="text-right">$${formatCurrency(item.scheduledValue)}</td>
              <td class="text-right">$${formatCurrency(item.workCompletedPrevious)}</td>
              <td class="text-right">$${formatCurrency(item.workCompletedThisPeriod)}</td>
              <td class="text-right">$${formatCurrency(item.materialsStored)}</td>
              <td class="text-right">$${formatCurrency(item.totalCompleted)}</td>
              <td class="text-center">${item.percentComplete.toFixed(1)}%</td>
              <td class="text-right">$${formatCurrency(item.balanceToFinish)}</td>
            </tr>
          `).join('')}
          <tr class="total-row">
            <td colspan="2" class="text-right">TOTALS:</td>
            <td class="text-right">$${formatCurrency(application.workItems.reduce((sum, item) => sum + item.scheduledValue, 0))}</td>
            <td class="text-right">$${formatCurrency(application.workItems.reduce((sum, item) => sum + item.workCompletedPrevious, 0))}</td>
            <td class="text-right">$${formatCurrency(application.workItems.reduce((sum, item) => sum + item.workCompletedThisPeriod, 0))}</td>
            <td class="text-right">$${formatCurrency(application.workItems.reduce((sum, item) => sum + item.materialsStored, 0))}</td>
            <td class="text-right">$${formatCurrency(summary.totalEarned)}</td>
            <td class="text-center">${summary.percentComplete.toFixed(1)}%</td>
            <td class="text-right">$${formatCurrency(summary.balanceToFinish)}</td>
          </tr>
        </tbody>
      </table>

      <div style="margin-top: 30px; font-size: 8pt; text-align: center; color: #666;">
        Generated by Accountrix AIA Form Builder on ${new Date().toLocaleString()}
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  setTimeout(() => {
    printWindow.print();
  }, 250);
}

function generateG703Excel(application: AIAApplication): void {
  const summary = calculateApplicationSummary(application);
  let csvContent = 'data:text/csv;charset=utf-8,';

  // G703 Header
  csvContent += `AIA G703 - CONTINUATION SHEET\n`;
  csvContent += `Application for Payment No. ${application.applicationNumber}\n`;
  csvContent += `Project: ${application.projectInfo.project}\n`;
  csvContent += `Owner: ${application.projectInfo.owner}\n`;
  csvContent += `Period Ending: ${new Date(application.periodEndDate).toLocaleDateString()}\n\n`;

  // Column headers
  csvContent += `Item,Description,Scheduled Value,Work Completed (Previous),Work Completed (This Period),Materials Stored,Total Completed,% Complete,Balance to Finish\n`;

  // Work items
  application.workItems.forEach((item) => {
    csvContent += `${item.itemNumber},"${item.description}",${item.scheduledValue},${item.workCompletedPrevious},${item.workCompletedThisPeriod},${item.materialsStored},${item.totalCompleted},${item.percentComplete.toFixed(1)}%,${item.balanceToFinish}\n`;
  });

  // Totals
  csvContent += `\nTOTALS,,${application.workItems.reduce((sum, item) => sum + item.scheduledValue, 0)},${application.workItems.reduce((sum, item) => sum + item.workCompletedPrevious, 0)},${application.workItems.reduce((sum, item) => sum + item.workCompletedThisPeriod, 0)},${application.workItems.reduce((sum, item) => sum + item.materialsStored, 0)},${summary.totalEarned},${summary.percentComplete.toFixed(1)}%,${summary.balanceToFinish}\n`;

  // Payment Summary
  csvContent += `\nPAYMENT SUMMARY\n`;
  csvContent += `Total Completed and Stored to Date,$${summary.totalEarned.toFixed(2)}\n`;
  csvContent += `Retainage (${application.retainagePercent}%),$${summary.retainageAmount.toFixed(2)}\n`;
  csvContent += `Total Earned Less Retainage,$${summary.totalEarnedLessRetainage.toFixed(2)}\n`;
  csvContent += `Less Previous Certificates,$${application.previousCertificates.toFixed(2)}\n`;
  csvContent += `CURRENT PAYMENT DUE,$${summary.currentPaymentDue.toFixed(2)}\n`;

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute(
    'download',
    `AIA_G703_App${application.applicationNumber}_${new Date().toISOString().split('T')[0]}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================================================
// Main Component
// ============================================================================

export default function AIAFormBuilder() {
  const [application, setApplication] = useState<AIAApplication>({
    id: generateId(),
    applicationNumber: 1,
    periodEndDate: new Date().toISOString().split('T')[0],
    projectInfo: {
      owner: '',
      project: '',
      contractFor: '',
      contractDate: new Date().toISOString().split('T')[0],
    },
    contract: {
      originalSum: 0,
      changeOrders: [],
      netChangeOrders: 0,
      contractSumToDate: 0,
    },
    workItems: [],
    retainagePercent: 10,
    previousCertificates: 0,
    createdDate: new Date().toISOString(),
    lastModified: new Date().toISOString(),
  });

  const [showHelp, setShowHelp] = useState<Record<string, boolean>>({});
  const [editingChangeOrder, setEditingChangeOrder] = useState<string | null>(null);

  // Calculate summary
  const summary = useMemo(
    () => calculateApplicationSummary(application),
    [application]
  );

  // Validate application
  const validationResults = useMemo(
    () => validateApplication(application),
    [application]
  );

  const hasErrors = validationResults.some((r) => r.severity === 'error');

  // Update contract sum when original sum or change orders change
  React.useEffect(() => {
    const netChangeOrders = application.contract.changeOrders
      .filter((co) => co.approved)
      .reduce((sum, co) => sum + co.amount, 0);
    const contractSumToDate = application.contract.originalSum + netChangeOrders;
    setApplication((prev) => ({
      ...prev,
      contract: {
        ...prev.contract,
        netChangeOrders,
        contractSumToDate,
      },
      lastModified: new Date().toISOString(),
    }));
  }, [application.contract.originalSum, application.contract.changeOrders]);

  // Load template
  const loadTemplate = (templateKey: string) => {
    const template = TEMPLATES[templateKey];
    if (template) {
      const workItems = template.workItems.map((item, index) =>
        calculateWorkItemTotals({ ...item, id: generateId(), itemNumber: index + 1 })
      );
      setApplication((prev) => ({
        ...prev,
        workItems,
        contract: {
          ...prev.contract,
          originalSum: workItems.reduce((sum, item) => sum + item.scheduledValue, 0),
        },
        lastModified: new Date().toISOString(),
      }));
    }
  };

  // Load scenario
  const loadScenario = (scenarioKey: string) => {
    const scenario = SCENARIOS[scenarioKey];
    if (scenario) {
      setApplication((prev) => ({
        ...prev,
        ...scenario,
        id: generateId(),
        createdDate: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      } as AIAApplication));
    }
  };

  // Add work item
  const addWorkItem = () => {
    const newItem = calculateWorkItemTotals({
      id: generateId(),
      itemNumber: application.workItems.length + 1,
      description: '',
      scheduledValue: 0,
      workCompletedPrevious: 0,
      workCompletedThisPeriod: 0,
      materialsStored: 0,
    });
    setApplication((prev) => ({
      ...prev,
      workItems: [...prev.workItems, newItem],
      lastModified: new Date().toISOString(),
    }));
  };

  // Update work item
  const updateWorkItem = (id: string, updates: Partial<WorkItem>) => {
    setApplication((prev) => ({
      ...prev,
      workItems: prev.workItems.map((item) =>
        item.id === id ? calculateWorkItemTotals({ ...item, ...updates }) : item
      ),
      lastModified: new Date().toISOString(),
    }));
  };

  // Delete work item
  const deleteWorkItem = (id: string) => {
    setApplication((prev) => ({
      ...prev,
      workItems: prev.workItems
        .filter((item) => item.id !== id)
        .map((item, index) => ({ ...item, itemNumber: index + 1 })),
      lastModified: new Date().toISOString(),
    }));
  };

  // Add change order
  const addChangeOrder = () => {
    const newCO: ChangeOrder = {
      id: generateId(),
      number: `CO-${String(application.contract.changeOrders.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      description: '',
      approved: false,
    };
    setApplication((prev) => ({
      ...prev,
      contract: {
        ...prev.contract,
        changeOrders: [...prev.contract.changeOrders, newCO],
      },
      lastModified: new Date().toISOString(),
    }));
    setEditingChangeOrder(newCO.id);
  };

  // Update change order
  const updateChangeOrder = (id: string, updates: Partial<ChangeOrder>) => {
    setApplication((prev) => ({
      ...prev,
      contract: {
        ...prev.contract,
        changeOrders: prev.contract.changeOrders.map((co) =>
          co.id === id ? { ...co, ...updates } : co
        ),
      },
      lastModified: new Date().toISOString(),
    }));
  };

  // Delete change order
  const deleteChangeOrder = (id: string) => {
    setApplication((prev) => ({
      ...prev,
      contract: {
        ...prev.contract,
        changeOrders: prev.contract.changeOrders.filter((co) => co.id !== id),
      },
      lastModified: new Date().toISOString(),
    }));
  };

  // Save to localStorage
  const saveApplication = () => {
    const saved = localStorage.getItem('aia-applications');
    const applications = saved ? JSON.parse(saved) : [];
    const existingIndex = applications.findIndex((app: AIAApplication) => app.id === application.id);

    if (existingIndex >= 0) {
      applications[existingIndex] = application;
    } else {
      applications.push(application);
    }

    localStorage.setItem('aia-applications', JSON.stringify(applications));
    alert('Application saved successfully!');
  };

  return (
    <TooltipProvider>
      <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              AIA Form Builder
            </h1>
            <p className="text-muted-foreground mt-1">
              Generate G702 Application and G703 Continuation Sheet for Progress Billing
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowHelp((prev) => ({ ...prev, main: !prev.main }))}
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Help
            </Button>
          </div>
        </div>

        {/* Help Panel */}
        {showHelp.main && (
          <Card className="bg-accent border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <HelpCircle className="w-5 h-5 mr-2" />
                AIA Forms Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <strong>What are AIA Forms?</strong>
                <p>
                  AIA G702 and G703 are standardized forms used in construction for progress billing.
                  The G702 summarizes the payment application, while the G703 provides detailed line items.
                </p>
              </div>
              <div>
                <strong>Best Practices:</strong>
                <ul className="list-disc list-inside ml-2 space-y-1">
                  <li>Keep detailed records of work completed each period</li>
                  <li>Document all change orders with proper approvals</li>
                  <li>Review retainage percentage with contract terms</li>
                  <li>Submit applications on consistent schedule (typically monthly)</li>
                  <li>Include supporting documentation for materials stored on site</li>
                </ul>
              </div>
              <div>
                <strong>Common Mistakes to Avoid:</strong>
                <ul className="list-disc list-inside ml-2 space-y-1">
                  <li>Billing over 100% on any line item</li>
                  <li>Forgetting to include approved change orders</li>
                  <li>Incorrect retainage calculations</li>
                  <li>Missing required signatures or dates</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Load Scenarios */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Load Templates & Scenarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Project Templates (Work Items Only):</h4>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => loadTemplate('commercial')}
                  >
                    Commercial Building (10 items)
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => loadTemplate('residential')}
                  >
                    Residential (8 items)
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => loadTemplate('highway')}
                  >
                    Road/Highway (12 items)
                  </Button>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Practice Scenarios (Complete Applications):</h4>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => loadScenario('simple')}
                  >
                    Scenario 1: Simple First Application
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => loadScenario('midProject')}
                  >
                    Scenario 2: Mid-Project with Change Orders
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => loadScenario('final')}
                  >
                    Scenario 3: Final Application
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Validation Alerts */}
        {validationResults.length > 0 && (
          <div className="space-y-2">
            {validationResults.map((result, index) => (
              <Alert
                key={index}
                variant={result.severity === 'error' ? 'destructive' : 'default'}
              >
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>{result.severity === 'error' ? 'Error' : 'Warning'}:</strong>{' '}
                  {result.message}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Project Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Project Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="owner">
                  TO OWNER
                  <Tooltip>
                    <TooltipTrigger className="ml-1">
                      <HelpCircle className="w-3 h-3 inline text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      The project owner or client receiving the payment application
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  id="owner"
                  value={application.projectInfo.owner}
                  onChange={(e) =>
                    setApplication((prev) => ({
                      ...prev,
                      projectInfo: { ...prev.projectInfo, owner: e.target.value },
                    }))
                  }
                  placeholder="Owner name or organization"
                />
              </div>

              <div>
                <Label htmlFor="project">
                  PROJECT NAME
                  <Tooltip>
                    <TooltipTrigger className="ml-1">
                      <HelpCircle className="w-3 h-3 inline text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Name or description of the construction project
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  id="project"
                  value={application.projectInfo.project}
                  onChange={(e) =>
                    setApplication((prev) => ({
                      ...prev,
                      projectInfo: { ...prev.projectInfo, project: e.target.value },
                    }))
                  }
                  placeholder="Project name"
                />
              </div>

              <div>
                <Label htmlFor="contractFor">CONTRACT FOR</Label>
                <Input
                  id="contractFor"
                  value={application.projectInfo.contractFor}
                  onChange={(e) =>
                    setApplication((prev) => ({
                      ...prev,
                      projectInfo: { ...prev.projectInfo, contractFor: e.target.value },
                    }))
                  }
                  placeholder="Description of work"
                />
              </div>

              <div>
                <Label htmlFor="architect">ARCHITECT (Optional)</Label>
                <Input
                  id="architect"
                  value={application.projectInfo.architect || ''}
                  onChange={(e) =>
                    setApplication((prev) => ({
                      ...prev,
                      projectInfo: { ...prev.projectInfo, architect: e.target.value },
                    }))
                  }
                  placeholder="Architect or engineer"
                />
              </div>

              <div>
                <Label htmlFor="applicationNumber">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  APPLICATION NUMBER
                </Label>
                <Input
                  id="applicationNumber"
                  type="number"
                  value={application.applicationNumber}
                  onChange={(e) =>
                    setApplication((prev) => ({
                      ...prev,
                      applicationNumber: parseInt(e.target.value) || 1,
                    }))
                  }
                  min="1"
                />
              </div>

              <div>
                <Label htmlFor="periodEndDate">PERIOD TO</Label>
                <Input
                  id="periodEndDate"
                  type="date"
                  value={application.periodEndDate}
                  onChange={(e) =>
                    setApplication((prev) => ({
                      ...prev,
                      periodEndDate: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="contractDate">CONTRACT DATE</Label>
                <Input
                  id="contractDate"
                  type="date"
                  value={application.projectInfo.contractDate}
                  onChange={(e) =>
                    setApplication((prev) => ({
                      ...prev,
                      projectInfo: { ...prev.projectInfo, contractDate: e.target.value },
                    }))
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contract Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Contract Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="originalSum">
                  ORIGINAL CONTRACT SUM
                  <Tooltip>
                    <TooltipTrigger className="ml-1">
                      <HelpCircle className="w-3 h-3 inline text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      The base contract amount before any change orders
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  id="originalSum"
                  type="number"
                  value={application.contract.originalSum}
                  onChange={(e) =>
                    setApplication((prev) => ({
                      ...prev,
                      contract: {
                        ...prev.contract,
                        originalSum: parseFloat(e.target.value) || 0,
                      },
                    }))
                  }
                  placeholder="0.00"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <Label>NET CHANGE BY CHANGE ORDERS (Auto-calculated)</Label>
                <div className="text-2xl font-bold mt-2">
                  ${formatCurrency(application.contract.netChangeOrders)}
                </div>
              </div>

              <div className="bg-accent p-4 rounded-lg md:col-span-2">
                <Label>CONTRACT SUM TO DATE (Auto-calculated)</Label>
                <div className="text-3xl font-bold mt-2 text-primary">
                  ${formatCurrency(application.contract.contractSumToDate)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Original Sum + Net Change Orders
                </p>
              </div>
            </div>

            {/* Change Orders */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">Change Orders</h4>
                <Button size="sm" onClick={addChangeOrder}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Change Order
                </Button>
              </div>

              {application.contract.changeOrders.length === 0 ? (
                <p className="text-muted-foreground text-sm italic">
                  No change orders yet. Click "Add Change Order" to create one.
                </p>
              ) : (
                <div className="space-y-2">
                  {application.contract.changeOrders.map((co) => (
                    <Card key={co.id} className="bg-gray-50">
                      <CardContent className="p-4">
                        {editingChangeOrder === co.id ? (
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label className="text-xs">Number</Label>
                                <Input
                                  value={co.number}
                                  onChange={(e) =>
                                    updateChangeOrder(co.id, { number: e.target.value })
                                  }
                                  size={10}
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Date</Label>
                                <Input
                                  type="date"
                                  value={co.date}
                                  onChange={(e) =>
                                    updateChangeOrder(co.id, { date: e.target.value })
                                  }
                                />
                              </div>
                            </div>
                            <div>
                              <Label className="text-xs">Description</Label>
                              <Input
                                value={co.description}
                                onChange={(e) =>
                                  updateChangeOrder(co.id, { description: e.target.value })
                                }
                                placeholder="Description of change"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label className="text-xs">Amount</Label>
                                <Input
                                  type="number"
                                  value={co.amount}
                                  onChange={(e) =>
                                    updateChangeOrder(co.id, {
                                      amount: parseFloat(e.target.value) || 0,
                                    })
                                  }
                                  placeholder="0.00"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Status</Label>
                                <Select
                                  value={co.approved ? 'approved' : 'pending'}
                                  onValueChange={(value) =>
                                    updateChangeOrder(co.id, {
                                      approved: value === 'approved',
                                    })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => setEditingChangeOrder(null)}
                              >
                                Done
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  deleteChangeOrder(co.id);
                                  setEditingChangeOrder(null);
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{co.number}</span>
                                <Badge variant={co.approved ? 'default' : 'secondary'}>
                                  {co.approved ? 'Approved' : 'Pending'}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{co.description}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(co.date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span
                                className={`text-xl font-bold ${
                                  co.amount >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}
                              >
                                {co.amount >= 0 ? '+' : ''}${formatCurrency(co.amount)}
                              </span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingChangeOrder(co.id)}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Work Items (G703) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Work Items (G703 Continuation Sheet)
              </span>
              <Button onClick={addWorkItem}>
                <Plus className="w-4 h-4 mr-1" />
                Add Item
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {application.workItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No work items yet.</p>
                <p className="text-sm">
                  Add items manually or load a template above.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Table Header - Desktop */}
                <div className="hidden lg:grid grid-cols-12 gap-2 text-xs font-semibold text-muted-foreground border-b pb-2">
                  <div className="col-span-1">#</div>
                  <div className="col-span-3">Description</div>
                  <div className="col-span-1 text-right">Scheduled</div>
                  <div className="col-span-1 text-right">Previous</div>
                  <div className="col-span-1 text-right">This Period</div>
                  <div className="col-span-1 text-right">Materials</div>
                  <div className="col-span-1 text-right">Total</div>
                  <div className="col-span-1 text-right">%</div>
                  <div className="col-span-1 text-right">Balance</div>
                  <div className="col-span-1"></div>
                </div>

                {/* Work Items */}
                {application.workItems.map((item) => (
                  <Card key={item.id} className="bg-gray-50">
                    <CardContent className="p-3">
                      {/* Desktop Layout */}
                      <div className="hidden lg:grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-1 font-semibold">{item.itemNumber}</div>
                        <div className="col-span-3">
                          <Input
                            value={item.description}
                            onChange={(e) =>
                              updateWorkItem(item.id, { description: e.target.value })
                            }
                            placeholder="Description"
                            className="text-sm"
                          />
                        </div>
                        <div className="col-span-1">
                          <Input
                            type="number"
                            value={item.scheduledValue}
                            onChange={(e) =>
                              updateWorkItem(item.id, {
                                scheduledValue: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="text-sm text-right"
                          />
                        </div>
                        <div className="col-span-1">
                          <Input
                            type="number"
                            value={item.workCompletedPrevious}
                            onChange={(e) =>
                              updateWorkItem(item.id, {
                                workCompletedPrevious: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="text-sm text-right"
                          />
                        </div>
                        <div className="col-span-1">
                          <Input
                            type="number"
                            value={item.workCompletedThisPeriod}
                            onChange={(e) =>
                              updateWorkItem(item.id, {
                                workCompletedThisPeriod: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="text-sm text-right"
                          />
                        </div>
                        <div className="col-span-1">
                          <Input
                            type="number"
                            value={item.materialsStored}
                            onChange={(e) =>
                              updateWorkItem(item.id, {
                                materialsStored: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="text-sm text-right"
                          />
                        </div>
                        <div className="col-span-1 text-right font-semibold text-sm">
                          ${formatCurrency(item.totalCompleted)}
                        </div>
                        <div className="col-span-1 text-right text-sm">
                          <Badge
                            variant={
                              item.percentComplete > 100
                                ? 'destructive'
                                : item.percentComplete === 100
                                ? 'default'
                                : 'secondary'
                            }
                          >
                            {item.percentComplete.toFixed(1)}%
                          </Badge>
                        </div>
                        <div className="col-span-1 text-right text-sm">
                          ${formatCurrency(item.balanceToFinish)}
                        </div>
                        <div className="col-span-1 flex justify-end">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteWorkItem(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Mobile Layout */}
                      <div className="lg:hidden space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Item {item.itemNumber}</span>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteWorkItem(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <Input
                          value={item.description}
                          onChange={(e) =>
                            updateWorkItem(item.id, { description: e.target.value })
                          }
                          placeholder="Description"
                        />
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <Label className="text-xs">Scheduled</Label>
                            <Input
                              type="number"
                              value={item.scheduledValue}
                              onChange={(e) =>
                                updateWorkItem(item.id, {
                                  scheduledValue: parseFloat(e.target.value) || 0,
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Previous</Label>
                            <Input
                              type="number"
                              value={item.workCompletedPrevious}
                              onChange={(e) =>
                                updateWorkItem(item.id, {
                                  workCompletedPrevious: parseFloat(e.target.value) || 0,
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label className="text-xs">This Period</Label>
                            <Input
                              type="number"
                              value={item.workCompletedThisPeriod}
                              onChange={(e) =>
                                updateWorkItem(item.id, {
                                  workCompletedThisPeriod: parseFloat(e.target.value) || 0,
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Materials</Label>
                            <Input
                              type="number"
                              value={item.materialsStored}
                              onChange={(e) =>
                                updateWorkItem(item.id, {
                                  materialsStored: parseFloat(e.target.value) || 0,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="flex justify-between pt-2 border-t">
                          <span className="text-sm">
                            Total: <strong>${formatCurrency(item.totalCompleted)}</strong>
                          </span>
                          <span className="text-sm">
                            Complete: <Badge>{item.percentComplete.toFixed(1)}%</Badge>
                          </span>
                          <span className="text-sm">
                            Balance: ${formatCurrency(item.balanceToFinish)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Totals Row */}
                {application.workItems.length > 0 && (
                  <Card className="bg-accent border-primary/40">
                    <CardContent className="p-3">
                      <div className="hidden lg:grid grid-cols-12 gap-2 items-center font-bold">
                        <div className="col-span-4">TOTALS:</div>
                        <div className="col-span-1 text-right">
                          ${formatCurrency(
                            application.workItems.reduce(
                              (sum, item) => sum + item.scheduledValue,
                              0
                            )
                          )}
                        </div>
                        <div className="col-span-1 text-right">
                          ${formatCurrency(
                            application.workItems.reduce(
                              (sum, item) => sum + item.workCompletedPrevious,
                              0
                            )
                          )}
                        </div>
                        <div className="col-span-1 text-right">
                          ${formatCurrency(
                            application.workItems.reduce(
                              (sum, item) => sum + item.workCompletedThisPeriod,
                              0
                            )
                          )}
                        </div>
                        <div className="col-span-1 text-right">
                          ${formatCurrency(
                            application.workItems.reduce(
                              (sum, item) => sum + item.materialsStored,
                              0
                            )
                          )}
                        </div>
                        <div className="col-span-1 text-right text-primary">
                          ${formatCurrency(summary.totalEarned)}
                        </div>
                        <div className="col-span-1 text-right">
                          {summary.percentComplete.toFixed(1)}%
                        </div>
                        <div className="col-span-2 text-right">
                          ${formatCurrency(summary.balanceToFinish)}
                        </div>
                      </div>
                      <div className="lg:hidden space-y-2">
                        <div className="font-bold text-center">TOTALS</div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>Scheduled: ${formatCurrency(
                            application.workItems.reduce(
                              (sum, item) => sum + item.scheduledValue,
                              0
                            )
                          )}</div>
                          <div>Total Earned: <span className="text-primary">${formatCurrency(summary.totalEarned)}</span></div>
                          <div>Complete: {summary.percentComplete.toFixed(1)}%</div>
                          <div>Balance: ${formatCurrency(summary.balanceToFinish)}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Retainage & Payment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Percent className="w-5 h-5 mr-2" />
              Retainage & Payment Calculation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="retainagePercent">
                  RETAINAGE PERCENTAGE
                  <Tooltip>
                    <TooltipTrigger className="ml-1">
                      <HelpCircle className="w-3 h-3 inline text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Percentage withheld from each payment (typically 5-10%). Set to 0 for final retainage release.
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  id="retainagePercent"
                  type="number"
                  value={application.retainagePercent}
                  onChange={(e) =>
                    setApplication((prev) => ({
                      ...prev,
                      retainagePercent: parseFloat(e.target.value) || 0,
                    }))
                  }
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>

              <div>
                <Label htmlFor="previousCertificates">
                  PREVIOUS CERTIFICATES FOR PAYMENT
                  <Tooltip>
                    <TooltipTrigger className="ml-1">
                      <HelpCircle className="w-3 h-3 inline text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Total amount paid to contractor in all previous applications
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  id="previousCertificates"
                  type="number"
                  value={application.previousCertificates}
                  onChange={(e) =>
                    setApplication((prev) => ({
                      ...prev,
                      previousCertificates: parseFloat(e.target.value) || 0,
                    }))
                  }
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-gradient-to-br from-background to-indigo-50 p-6 rounded-lg border-2 border-border">
              <h4 className="font-semibold text-lg mb-4">Payment Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span>Total Completed and Stored to Date:</span>
                  <span className="font-semibold text-lg">
                    ${formatCurrency(summary.totalEarned)}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span>Less Retainage ({application.retainagePercent}%):</span>
                  <span className="font-semibold text-lg text-red-600">
                    -${formatCurrency(summary.retainageAmount)}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span>Total Earned Less Retainage:</span>
                  <span className="font-semibold text-lg">
                    ${formatCurrency(summary.totalEarnedLessRetainage)}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span>Less Previous Certificates:</span>
                  <span className="font-semibold text-lg text-red-600">
                    -${formatCurrency(application.previousCertificates)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 bg-card rounded p-3">
                  <span className="text-xl font-bold">CURRENT PAYMENT DUE:</span>
                  <span className="text-3xl font-bold text-green-600">
                    ${formatCurrency(summary.currentPaymentDue)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 text-sm text-muted-foreground">
                  <span>Balance to Finish (including retainage):</span>
                  <span className="font-semibold">
                    ${formatCurrency(summary.balanceToFinish + summary.retainageAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Calculation Explanation */}
            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <h5 className="font-semibold mb-2 flex items-center">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  How is this calculated?
                </h5>
                <div className="space-y-1 text-sm text-foreground font-mono">
                  <p>Total Earned = Sum of all work items' total completed</p>
                  <p>Retainage = Total Earned Ã— Retainage %</p>
                  <p>Current Payment = (Total Earned - Retainage) - Previous Certificates</p>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Generate & Export</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => generateG702PDF(application)}
                disabled={hasErrors}
                size="lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Generate PDF (G702 + G703)
              </Button>
              <Button
                onClick={() => generateG703Excel(application)}
                disabled={hasErrors}
                variant="outline"
                size="lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Excel (G703)
              </Button>
              <Button onClick={saveApplication} variant="outline" size="lg">
                <Save className="w-4 h-4 mr-2" />
                Save Application
              </Button>
            </div>
            {hasErrors && (
              <p className="text-sm text-red-600 mt-2">
                Please fix all errors before generating forms.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Educational Footer */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h4 className="font-semibold text-lg mb-2">Congratulations!</h4>
                <p className="text-sm text-foreground">
                  You've learned how to create AIA payment applications - a critical skill in construction accounting.
                  Complete a full application from scratch to earn <strong>75 XP</strong>!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
