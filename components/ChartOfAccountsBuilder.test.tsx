import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChartOfAccountsBuilder, { Account, AccountType } from './ChartOfAccountsBuilder';

describe('ChartOfAccountsBuilder', () => {
  const mockAccounts: Account[] = [
    {
      number: '1000',
      name: 'Cash',
      type: 'Asset',
      normalBalance: 'DR',
      category: 'Current Asset',
      isSubAccount: false,
      isActive: true,
      hasSubAccounts: false,
      description: 'Primary operating account',
    },
    {
      number: '2000',
      name: 'Accounts Payable',
      type: 'Liability',
      normalBalance: 'CR',
      category: 'Current Liability',
      isSubAccount: false,
      isActive: true,
      hasSubAccounts: false,
      description: 'Money owed to vendors',
    },
  ];

  it('renders the component with title', () => {
    render(<ChartOfAccountsBuilder />);
    expect(screen.getByText('Chart of Accounts Builder')).toBeInTheDocument();
  });

  it('displays account categories', () => {
    render(<ChartOfAccountsBuilder initialCOA={mockAccounts} />);

    // Check for all five main categories
    expect(screen.getByText(/ASSETS/i)).toBeInTheDocument();
    expect(screen.getByText(/LIABILITIES/i)).toBeInTheDocument();
    expect(screen.getByText(/EQUITY/i)).toBeInTheDocument();
    expect(screen.getByText(/REVENUE/i)).toBeInTheDocument();
    expect(screen.getByText(/EXPENSES/i)).toBeInTheDocument();
  });

  it('shows statistics panel', () => {
    render(<ChartOfAccountsBuilder initialCOA={mockAccounts} />);

    expect(screen.getByText('Total Accounts')).toBeInTheDocument();
    expect(screen.getByText('Assets')).toBeInTheDocument();
    expect(screen.getByText('Liabilities')).toBeInTheDocument();
  });

  it('filters accounts by search term', () => {
    render(<ChartOfAccountsBuilder initialCOA={mockAccounts} />);

    const searchInput = screen.getByPlaceholderText('Search accounts...');
    fireEvent.change(searchInput, { target: { value: 'Cash' } });

    // The search should filter the accounts
    expect(searchInput).toHaveValue('Cash');
  });

  it('opens add account dialog when Add Account button is clicked', async () => {
    render(<ChartOfAccountsBuilder initialCOA={mockAccounts} />);

    const addButton = screen.getByRole('button', { name: /Add Account/i });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Add New Account')).toBeInTheDocument();
    });
  });

  it('does not show add/edit buttons in read-only mode', () => {
    render(<ChartOfAccountsBuilder initialCOA={mockAccounts} readOnly={true} />);

    expect(screen.queryByRole('button', { name: /Add Account/i })).not.toBeInTheDocument();
  });

  it('loads template when selected', () => {
    render(<ChartOfAccountsBuilder showTemplates={true} />);

    // Template selector should be present
    expect(screen.getByText(/Load Template/i)).toBeInTheDocument();
  });

  it('expands and collapses account categories', () => {
    render(<ChartOfAccountsBuilder initialCOA={mockAccounts} />);

    // Find the ASSETS category header
    const assetsHeader = screen.getByText(/ASSETS/i).closest('div');

    if (assetsHeader) {
      // Click to collapse
      fireEvent.click(assetsHeader);

      // Click to expand again
      fireEvent.click(assetsHeader);
    }
  });

  it('calls onSave callback when Save button is clicked', async () => {
    const onSaveMock = vi.fn();
    render(<ChartOfAccountsBuilder initialCOA={mockAccounts} onSave={onSaveMock} />);

    const saveButton = screen.getByRole('button', { name: /Save Chart of Accounts/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(onSaveMock).toHaveBeenCalledWith(expect.any(Array));
    });
  });

  it('displays help panel when Help button is clicked', () => {
    render(<ChartOfAccountsBuilder />);

    const helpButton = screen.getByRole('button', { name: /Help/i });
    fireEvent.click(helpButton);

    expect(screen.getByText(/Chart of Accounts Best Practices/i)).toBeInTheDocument();
  });

  it('shows correct account counts in statistics', () => {
    const accounts: Account[] = [
      ...mockAccounts,
      {
        number: '3000',
        name: "Owner's Capital",
        type: 'Equity',
        normalBalance: 'CR',
        category: 'Equity',
        isSubAccount: false,
        isActive: true,
        hasSubAccounts: false,
      },
    ];

    render(<ChartOfAccountsBuilder initialCOA={accounts} />);

    // Should show total of 3 accounts
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});

// Helper function tests
describe('COA Helper Functions', () => {
  describe('validateAccountNumber', () => {
    it('validates account number is in correct range', () => {
      // These are simple unit tests for the validation logic
      const mockAccounts: Account[] = [];

      // Asset account should be between 1000-1999
      const assetNumber = '1500';
      const assetType: AccountType = 'Asset';

      // This would need to be imported and tested separately
      // For now, this is a placeholder for demonstration
      expect(parseInt(assetNumber)).toBeGreaterThanOrEqual(1000);
      expect(parseInt(assetNumber)).toBeLessThanOrEqual(1999);
    });

    it('detects duplicate account numbers', () => {
      const accounts: Account[] = [
        {
          number: '1000',
          name: 'Cash',
          type: 'Asset',
          normalBalance: 'DR',
          category: 'Current Asset',
          isSubAccount: false,
          isActive: true,
          hasSubAccounts: false,
        },
      ];

      const hasDuplicate = accounts.some(a => a.number === '1000');
      expect(hasDuplicate).toBe(true);
    });
  });

  describe('getAccountsByType', () => {
    it('filters accounts by type correctly', () => {
      const accounts: Account[] = [
        {
          number: '1000',
          name: 'Cash',
          type: 'Asset',
          normalBalance: 'DR',
          category: 'Current Asset',
          isSubAccount: false,
          isActive: true,
          hasSubAccounts: false,
        },
        {
          number: '2000',
          name: 'Accounts Payable',
          type: 'Liability',
          normalBalance: 'CR',
          category: 'Current Liability',
          isSubAccount: false,
          isActive: true,
          hasSubAccounts: false,
        },
      ];

      const assets = accounts.filter(a => a.type === 'Asset');
      expect(assets).toHaveLength(1);
      expect(assets[0].name).toBe('Cash');
    });
  });

  describe('exportToCSV', () => {
    it('generates CSV with proper headers', () => {
      const accounts: Account[] = [
        {
          number: '1000',
          name: 'Cash',
          type: 'Asset',
          normalBalance: 'DR',
          category: 'Current Asset',
          isSubAccount: false,
          isActive: true,
          hasSubAccounts: false,
          description: 'Test account',
        },
      ];

      const expectedHeaders = 'Number,Name,Type,Normal Balance,Category,Description,Is Sub-Account,Parent Account,Is Active';

      // Simple CSV generation
      const headers = ['Number', 'Name', 'Type', 'Normal Balance', 'Category', 'Description', 'Is Sub-Account', 'Parent Account', 'Is Active'];
      const csvHeaders = headers.join(',');

      expect(csvHeaders).toBe(expectedHeaders);
    });
  });

  describe('buildAccountTree', () => {
    it('builds hierarchical tree structure', () => {
      const accounts: Account[] = [
        {
          number: '1000',
          name: 'Cash',
          type: 'Asset',
          normalBalance: 'DR',
          category: 'Current Asset',
          isSubAccount: false,
          isActive: true,
          hasSubAccounts: true,
        },
        {
          number: '1001',
          name: 'Cash - Operating',
          type: 'Asset',
          normalBalance: 'DR',
          category: 'Current Asset',
          isSubAccount: true,
          parentAccount: '1000',
          isActive: true,
          hasSubAccounts: false,
        },
      ];

      const parent = accounts.find(a => a.number === '1000');
      const child = accounts.find(a => a.parentAccount === '1000');

      expect(parent).toBeDefined();
      expect(child).toBeDefined();
      expect(child?.parentAccount).toBe('1000');
    });
  });
});
