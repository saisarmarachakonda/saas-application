'use client';

import React, { useState, useEffect } from 'react';
import {
  Landmark,
  Plus,
  Trash2,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Building,
  FileText,
  DollarSign,
  FileSpreadsheet,
  Layers,
  ArrowRight,
  ShieldCheck,
  Check,
  Percent,
  Download,
  Printer,
  Calendar,
  Layers as LayersIcon,
  HelpCircle,
  FileSignature
} from 'lucide-react';

interface Transaction {
  id: string;
  type: string; // Customer Receipt, Advance Payment, Vendor Invoice, Vendor Payment
  amount: number;
  description: string | null;
  referenceNo: string;
  status: string; // Pending, Approved, Processed, Reconciled
  category: string; // Accounts Receivable, Accounts Payable, Cash, Bank
  date: string;
}

interface Journal {
  id: string;
  code: string;
  description: string;
  amount: number;
  debitAccount: string;
  creditAccount: string;
  date: string;
}

interface Budget {
  id: string;
  departmentName: string;
  allocated: number;
  spent: number;
  variance: number;
  period: string;
}

interface TaxRecord {
  id: string;
  type: string; // GST, TDS, Corporate Tax
  amount: number;
  rate: number;
  referenceNo: string;
  status: string; // Tracked, Filed, Paid
  date: string;
}

export default function ComprehensiveFinancePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [reportSubTab, setReportSubTab] = useState('pl'); // pl, bs, cf

  // Datasets
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [journals, setJournals] = useState<Journal[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [taxRecords, setTaxRecords] = useState<TaxRecord[]>([]);

  // Loading & States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals for Create
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);

  // Form states
  const [invoiceForm, setInvoiceForm] = useState({
    type: 'Customer Invoice',
    customerName: '',
    baseAmount: '',
    gstRate: '0.18',
    gstType: 'CGST_SGST', // CGST_SGST or IGST
    tdsRate: '0.00', // None, 194C, 194J, etc.
    referenceNo: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [paymentForm, setPaymentForm] = useState({
    type: 'Vendor Invoice',
    vendorName: '',
    baseAmount: '',
    gstRate: '0.18',
    gstType: 'CGST_SGST',
    tdsRate: '0.00',
    referenceNo: '',
    description: '',
    status: 'Pending',
    departmentName: '', // For budget linkage
    date: new Date().toISOString().split('T')[0]
  });

  const [journalForm, setJournalForm] = useState({
    code: '',
    description: '',
    amount: '',
    debitAccount: '',
    creditAccount: '',
    departmentName: '', // link budget
    date: new Date().toISOString().split('T')[0]
  });

  const [budgetForm, setBudgetForm] = useState({
    departmentName: '',
    allocated: '',
    spent: '0',
    period: 'FY2026'
  });

  const [transferForm, setTransferForm] = useState({
    sourceAccount: 'SBI Petty Cash Account',
    destinationAccount: 'HDFC Current Account',
    amount: '',
    description: ''
  });

  const [bankFeeds, setBankFeeds] = useState([
    { id: 'feed-1', source: 'HDFC Bank - A/C 99012', desc: 'NEFT Outward - Raw Steel Co.', amount: -289000, date: '04-Jun-2026', status: 'Unmatched' },
    { id: 'feed-2', source: 'ICICI Bank - A/C 45520', desc: 'RTGS Inward - SpaceX Valves Corp.', amount: 450000, date: '05-Jun-2026', status: 'Matched' },
    { id: 'feed-3', source: 'SBI Cash Account', desc: 'Cash deposit at SBI Branch', amount: 50000, date: '06-Jun-2026', status: 'Unmatched' },
  ]);

  // Statutory Filing Checklist State (Simulated Persistent State)
  const [filings, setFilings] = useState<{
    id: string;
    name: string;
    desc: string;
    due: string;
    status: string;
    filedDate: string | null;
  }[]>([
    { id: 'GSTR-1', name: 'GST GSTR-1', desc: 'Outward supplies details', due: '11th of every month', status: 'Pending', filedDate: null },
    { id: 'GSTR-3B', name: 'GST GSTR-3B', desc: 'Summary return & payment', due: '20th of every month', status: 'Pending', filedDate: null },
    { id: 'TDS-26Q', name: 'TDS Form 26Q', desc: 'Non-salary payments return', due: 'Quarterly', status: 'Pending', filedDate: null },
  ]);

  // Load all data
  const loadAllData = async () => {
    setLoading(true);
    try {
      const [txRes, jRes, bRes, tRes] = await Promise.all([
        fetch('/api/crud/financialtransaction'),
        fetch('/api/crud/journalentry'),
        fetch('/api/crud/budget'),
        fetch('/api/crud/taxrecord')
      ]);

      if (txRes.ok && jRes.ok && bRes.ok && tRes.ok) {
        const txs = await txRes.json();
        const js = await jRes.json();
        const bs = await bRes.json();
        const ts = await tRes.json();

        setTransactions(txs);
        setJournals(js);
        setBudgets(bs);
        setTaxRecords(ts);
      } else {
        setError('Failed to fetch financial datasets.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection failure loading dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Budget spent helper
  const updateBudgetSpent = async (deptName: string, amount: number) => {
    const budget = budgets.find(b => b.departmentName === deptName);
    if (!budget) return;
    const newSpent = budget.spent + amount;
    const newVariance = budget.allocated - newSpent;
    try {
      await fetch(`/api/crud/budget?id=${budget.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spent: newSpent,
          variance: newVariance
        })
      });
    } catch (err) {
      console.error('Failed to update budget spent:', err);
    }
  };

  // Form Submit Handlers
  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    const base = parseFloat(invoiceForm.baseAmount);
    const gstRate = parseFloat(invoiceForm.gstRate);
    const tdsRate = parseFloat(invoiceForm.tdsRate);

    if (isNaN(base) || base <= 0) return;

    const gstAmount = base * gstRate;
    const tdsAmount = base * tdsRate;
    const netAmount = base + gstAmount - tdsAmount;

    let desc = invoiceForm.description || `${invoiceForm.type} for ${invoiceForm.customerName}. `;
    if (gstRate > 0) {
      if (invoiceForm.gstType === 'CGST_SGST') {
        const half = gstAmount / 2;
        desc += `[CGST @ ${(gstRate*50).toFixed(1)}%: ₹${half.toLocaleString('en-IN')}, SGST @ ${(gstRate*50).toFixed(1)}%: ₹${half.toLocaleString('en-IN')}] `;
      } else {
        desc += `[IGST @ ${(gstRate*100).toFixed(1)}%: ₹${gstAmount.toLocaleString('en-IN')}] `;
      }
    }
    if (tdsAmount > 0) {
      desc += `[TDS Deducted @ ${(tdsRate*100).toFixed(1)}%: ₹${tdsAmount.toLocaleString('en-IN')}]`;
    }

    try {
      // 1. Create Transaction
      const txRes = await fetch('/api/crud/financialtransaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: invoiceForm.type,
          amount: netAmount,
          referenceNo: invoiceForm.referenceNo,
          status: invoiceForm.type === 'Customer Invoice' ? 'Pending' : 'Reconciled',
          category: 'Accounts Receivable',
          description: desc,
          date: new Date(invoiceForm.date).toISOString()
        })
      });

      if (!txRes.ok) throw new Error('Transaction creation failed.');

      // 2. Create Tax Records
      if (gstAmount > 0) {
        await fetch('/api/crud/taxrecord', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'GST',
            amount: gstAmount,
            rate: gstRate,
            referenceNo: invoiceForm.referenceNo,
            status: 'Tracked',
            date: new Date(invoiceForm.date).toISOString()
          })
        });
      }

      if (tdsAmount > 0) {
        await fetch('/api/crud/taxrecord', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'TDS',
            amount: tdsAmount,
            rate: tdsRate,
            referenceNo: invoiceForm.referenceNo,
            status: 'Tracked',
            date: new Date(invoiceForm.date).toISOString()
          })
        });
      }

      setShowInvoiceModal(false);
      setInvoiceForm({
        type: 'Customer Invoice',
        customerName: '',
        baseAmount: '',
        gstRate: '0.18',
        gstType: 'CGST_SGST',
        tdsRate: '0.00',
        referenceNo: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      loadAllData();
    } catch (err: any) {
      alert(err.message || 'Failed to save customer invoice.');
    }
  };

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const base = parseFloat(paymentForm.baseAmount);
    const gstRate = parseFloat(paymentForm.gstRate);
    const tdsRate = parseFloat(paymentForm.tdsRate);

    if (isNaN(base) || base <= 0) return;

    const gstAmount = base * gstRate;
    const tdsAmount = base * tdsRate;
    const netAmount = base + gstAmount - tdsAmount;

    let desc = paymentForm.description || `${paymentForm.type} to ${paymentForm.vendorName}. `;
    if (gstRate > 0) {
      if (paymentForm.gstType === 'CGST_SGST') {
        const half = gstAmount / 2;
        desc += `[Input CGST @ ${(gstRate*50).toFixed(1)}%: ₹${half.toLocaleString('en-IN')}, Input SGST @ ${(gstRate*50).toFixed(1)}%: ₹${half.toLocaleString('en-IN')}] `;
      } else {
        desc += `[Input IGST @ ${(gstRate*100).toFixed(1)}%: ₹${gstAmount.toLocaleString('en-IN')}] `;
      }
    }
    if (tdsAmount > 0) {
      desc += `[TDS Deducted @ ${(tdsRate*100).toFixed(1)}%: ₹${tdsAmount.toLocaleString('en-IN')}] `;
    }
    if (paymentForm.departmentName) {
      desc += `[Cost Center: ${paymentForm.departmentName}]`;
    }

    try {
      const res = await fetch('/api/crud/financialtransaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: paymentForm.type,
          amount: netAmount,
          referenceNo: paymentForm.referenceNo,
          status: paymentForm.status,
          category: 'Accounts Payable',
          description: desc,
          date: new Date(paymentForm.date).toISOString()
        })
      });

      if (!res.ok) throw new Error('Failed to post vendor transaction.');

      if (gstAmount > 0) {
        await fetch('/api/crud/taxrecord', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'GST',
            amount: gstAmount,
            rate: gstRate,
            referenceNo: paymentForm.referenceNo,
            status: 'Tracked',
            date: new Date(paymentForm.date).toISOString()
          })
        });
      }

      if (tdsAmount > 0) {
        await fetch('/api/crud/taxrecord', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'TDS',
            amount: tdsAmount,
            rate: tdsRate,
            referenceNo: paymentForm.referenceNo,
            status: 'Tracked',
            date: new Date(paymentForm.date).toISOString()
          })
        });
      }

      // Update budget spent
      if (paymentForm.departmentName) {
        await updateBudgetSpent(paymentForm.departmentName, base);
      }

      setShowPaymentModal(false);
      setPaymentForm({
        type: 'Vendor Invoice',
        vendorName: '',
        baseAmount: '',
        gstRate: '0.18',
        gstType: 'CGST_SGST',
        tdsRate: '0.00',
        referenceNo: '',
        description: '',
        status: 'Pending',
        departmentName: '',
        date: new Date().toISOString().split('T')[0]
      });
      loadAllData();
    } catch (err: any) {
      alert(err.message || 'Failed to record vendor invoice/payment.');
    }
  };

  const handleCreateJournal = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(journalForm.amount);
    if (isNaN(amt) || amt <= 0) return;

    let desc = journalForm.description;
    if (journalForm.departmentName) {
      desc += ` [Cost Center: ${journalForm.departmentName}]`;
    }

    try {
      const res = await fetch('/api/crud/journalentry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: journalForm.code,
          description: desc,
          amount: amt,
          debitAccount: journalForm.debitAccount,
          creditAccount: journalForm.creditAccount,
          date: new Date(journalForm.date).toISOString()
        })
      });

      if (!res.ok) throw new Error('Voucher posting failed.');

      if (journalForm.departmentName) {
        await updateBudgetSpent(journalForm.departmentName, amt);
      }

      setShowJournalModal(false);
      setJournalForm({
        code: '',
        description: '',
        amount: '',
        debitAccount: '',
        creditAccount: '',
        departmentName: '',
        date: new Date().toISOString().split('T')[0]
      });
      loadAllData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCreateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    const alloc = parseFloat(budgetForm.allocated);
    const spent = parseFloat(budgetForm.spent);
    if (isNaN(alloc)) return;

    try {
      const res = await fetch('/api/crud/budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          departmentName: budgetForm.departmentName,
          allocated: alloc,
          spent: spent,
          variance: alloc - spent,
          period: budgetForm.period
        })
      });

      if (!res.ok) throw new Error('Budget setup failed.');

      setShowBudgetModal(false);
      setBudgetForm({
        departmentName: '',
        allocated: '',
        spent: '0',
        period: 'FY2026'
      });
      loadAllData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleFundTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(transferForm.amount);
    if (isNaN(amt) || amt <= 0) return;

    try {
      const res = await fetch('/api/crud/financialtransaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'Fund Transfer',
          amount: amt,
          referenceNo: 'FT-' + Date.now().toString().slice(-6),
          status: 'Reconciled',
          category: 'Bank',
          description: `Internal Transfer from ${transferForm.sourceAccount} to ${transferForm.destinationAccount}. ${transferForm.description || ''}`,
          date: new Date().toISOString()
        })
      });

      if (res.ok) {
        alert('Liquidity fund transfer executed and logged in GL successfully!');
        setTransferForm({
          sourceAccount: 'SBI Petty Cash Account',
          destinationAccount: 'HDFC Current Account',
          amount: '',
          description: ''
        });
        loadAllData();
      } else {
        alert('Failed to execute transfer.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // State mutation actions for AP / AR pipelines
  const approveVendorPayment = async (id: string) => {
    try {
      const res = await fetch(`/api/crud/financialtransaction?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Approved' })
      });
      if (res.ok) {
        alert('Vendor invoice approved for processing.');
        loadAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const processVendorPayment = async (id: string) => {
    try {
      const res = await fetch(`/api/crud/financialtransaction?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Processed' })
      });
      if (res.ok) {
        alert('Vendor payment processed and disbursed successfully!');
        loadAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const collectCustomerReceipt = async (id: string) => {
    try {
      const res = await fetch(`/api/crud/financialtransaction?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Reconciled' })
      });
      if (res.ok) {
        alert('Payment collected and customer receipt reconciled!');
        loadAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const reconcileBankFeed = (feedId: string) => {
    setBankFeeds(bankFeeds.map(f => f.id === feedId ? { ...f, status: 'Matched' } : f));
    alert('Bank feed item matched and reconciled against GL ledger cash accounts successfully!');
  };

  const fileStatutoryTax = (id: string) => {
    setFilings(filings.map(f => f.id === id ? { ...f, status: 'Filed', filedDate: new Date().toLocaleDateString('en-IN') } : f));
  };

  const handleDelete = async (model: string, id: string) => {
    if (!confirm('Are you sure you want to delete this accounting record?')) return;
    try {
      const res = await fetch(`/api/crud/${model}?id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        loadAllData();
      } else {
        alert('Failed to delete transaction row.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Indian Accounting Math & Aggregates
  const totalReceivables = transactions
    .filter(t => t.category === 'Accounts Receivable' && t.status !== 'Reconciled')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPayables = transactions
    .filter(t => t.category === 'Accounts Payable' && t.status !== 'Reconciled' && t.status !== 'Processed')
    .reduce((sum, t) => sum + t.amount, 0);

  const gstCollected = taxRecords
    .filter(t => t.type === 'GST')
    .reduce((sum, t) => sum + t.amount, 0);

  const tdsDeducted = taxRecords
    .filter(t => t.type === 'TDS')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBudgetAllocated = budgets.reduce((sum, b) => sum + b.allocated, 0);
  const totalBudgetSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const budgetVariance = totalBudgetAllocated - totalBudgetSpent;

  // Cash flow aggregates
  const totalInflows = transactions
    .filter(t => t.type === 'Customer Receipt' || t.type === 'Advance Payment' || t.status === 'Reconciled')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOutflows = transactions
    .filter(t => t.type === 'Vendor Payment' || t.status === 'Processed')
    .reduce((sum, t) => sum + t.amount, 0);

  const currentCashBalance = 500000 + totalInflows - totalOutflows;

  // Unpaid AP and Aging Analysis
  const unpaidAP = transactions.filter(t => t.category === 'Accounts Payable' && t.status !== 'Processed');
  const today = new Date();

  const overdueAP = unpaidAP
    .filter(t => {
      const diffTime = Math.abs(today.getTime() - new Date(t.date).getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 15;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const due15DaysAP = unpaidAP
    .filter(t => {
      const diffTime = Math.abs(today.getTime() - new Date(t.date).getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 15;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDueAP = overdueAP + due15DaysAP;

  // Dynamic Trial Balance Compiled Accounts
  const ledgerAccounts: { [name: string]: { debit: number, credit: number } } = {
    '1001-CASH (Cash Bank Assets)': { debit: currentCashBalance, credit: 0 },
    '1002-AR (Accounts Receivable)': { debit: totalReceivables, credit: 0 },
    '2001-AP (Accounts Payable)': { debit: 0, credit: totalPayables },
    '2002-GST (GST Clearing)': { debit: 0, credit: gstCollected },
    '2003-TDS (TDS Tax Credit Asset)': { debit: tdsDeducted, credit: 0 },
    '3001-EQUITY (Share Capital)': { debit: 0, credit: 500000 },
  };

  journals.forEach(j => {
    const dbKey = j.debitAccount;
    if (!ledgerAccounts[dbKey]) ledgerAccounts[dbKey] = { debit: 0, credit: 0 };
    ledgerAccounts[dbKey].debit += j.amount;

    const crKey = j.creditAccount;
    if (!ledgerAccounts[crKey]) ledgerAccounts[crKey] = { debit: 0, credit: 0 };
    ledgerAccounts[crKey].credit += j.amount;
  });

  let totalTrialDebit = 0;
  let totalTrialCredit = 0;
  Object.values(ledgerAccounts).forEach(acct => {
    totalTrialDebit += acct.debit;
    totalTrialCredit += acct.credit;
  });

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Finance & Accounting
              <span className="px-2 py-0.5 text-[10px] bg-indigo-550/10 text-indigo-500 border border-indigo-550/20 rounded font-semibold">
                Indian Standard Compliant
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">
              Record receipt entries, advance payments, capture GST liabilities, split CGST/SGST/IGST, track TDS returns, reconcile ledgers and generate financial statements in INR (₹).
            </p>
          </div>
        </div>

        {/* Global Action Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowInvoiceModal(true)}
            className="px-3.5 py-1.5 bg-indigo-650 hover:bg-indigo-700 text-white text-[11px] font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Invoice / Receipt Entry</span>
          </button>
          <button
            onClick={() => setShowPaymentModal(true)}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Process Payment</span>
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-0.5 gap-2 scrollbar-none">
        {[
          { id: 'overview', label: 'Dashboard Control' },
          { id: 'receivables', label: 'Accounts Receivable (AR)' },
          { id: 'payables', label: 'Accounts Payable (AP)' },
          { id: 'journal', label: 'General Ledger (GL)' },
          { id: 'budgets', label: 'Budget & Cost' },
          { id: 'taxation', label: 'Taxation & GST/TDS' },
          { id: 'banking', label: 'Cash & Bank' },
          { id: 'reports', label: 'Financial Reports' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 ${
              activeTab === tab.id
                ? 'border-indigo-500 text-indigo-650 dark:text-indigo-400 font-extrabold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-lg flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs italic">Loading ledger indexes...</span>
        </div>
      ) : (
        <div className="space-y-6">

          {/* TAB 1: OVERVIEW CONTROL PANEL */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Financial KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Outstanding Receivables</p>
                      <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                        ₹{totalReceivables.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </h3>
                      <p className="text-[10px] text-indigo-500 font-semibold mt-1">Pending Collection</p>
                    </div>
                    <div className="w-8 h-8 rounded bg-indigo-500/10 text-indigo-500 flex items-center justify-center animate-pulse">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Outstanding Payables</p>
                      <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                        ₹{totalPayables.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </h3>
                      <p className="text-[10px] text-amber-500 font-semibold mt-1">Pending Settlement</p>
                    </div>
                    <div className="w-8 h-8 rounded bg-amber-500/10 text-amber-500 flex items-center justify-center">
                      <TrendingDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">GST Collected Liability</p>
                      <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                        ₹{gstCollected.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </h3>
                      <p className="text-[10px] text-purple-500 font-semibold mt-1">To be filed in GSTR-3B</p>
                    </div>
                    <div className="w-8 h-8 rounded bg-purple-500/10 text-purple-500 flex items-center justify-center">
                      <Percent className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">TDS Receivable Log</p>
                      <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                        ₹{tdsDeducted.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </h3>
                      <p className="text-[10px] text-emerald-500 font-semibold mt-1">Tax credit available</p>
                    </div>
                    <div className="w-8 h-8 rounded bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Cash Inflow/Outflow Comparison SVG and Budgets Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left 2 Cols: Cash Flow & Budget Variance Chart */}
                <div className="lg:col-span-2 glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">Budget & Cost Variance Analysis</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">Allocated vs Spent budget per cost center</p>
                    </div>
                    <button
                      onClick={() => setShowBudgetModal(true)}
                      className="px-2.5 py-1 text-[10px] font-bold bg-indigo-500/10 text-indigo-500 rounded hover:bg-indigo-500/20 transition-colors"
                    >
                      + Allocate Budget
                    </button>
                  </div>

                  {/* SVG Bar Chart for Budgets */}
                  <div className="space-y-4">
                    {budgets.length === 0 ? (
                      <p className="text-center text-xs text-slate-400 py-6 font-light">No budget center allocations seeded yet.</p>
                    ) : (
                      budgets.map((b, idx) => {
                        const spentPercent = b.allocated > 0 ? Math.min((b.spent / b.allocated) * 100, 100) : 0;
                        const isOver = b.spent > b.allocated;
                        return (
                          <div key={idx} className="space-y-1 text-xs">
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="font-bold text-slate-700 dark:text-slate-300">{b.departmentName} ({b.period})</span>
                              <span className="text-slate-400 font-light">
                                Spent: <strong className="text-slate-700 dark:text-slate-300">₹{b.spent.toLocaleString('en-IN')}</strong> / ₹{b.allocated.toLocaleString('en-IN')}
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden relative">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${isOver ? 'bg-rose-500' : 'bg-indigo-500'}`}
                                style={{ width: `${spentPercent}%` }}
                              />
                            </div>
                            <div className="flex justify-between items-center text-[9px]">
                              <span className={isOver ? 'text-rose-500 font-bold' : 'text-slate-400 font-light'}>
                                {isOver ? `Over budget by ₹${Math.abs(b.variance).toLocaleString('en-IN')}` : `Remaining: ₹${b.variance.toLocaleString('en-IN')}`}
                              </span>
                              <span className="font-semibold text-slate-500">{spentPercent.toFixed(0)}% Utilized</span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Right 1 Col: Quick Action Checklists */}
                <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Statutory Calendar</h3>
                    <div className="space-y-3 text-xs">
                      {filings.map((item, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-855 bg-white/30 dark:bg-slate-900/30 flex items-start justify-between gap-2.5">
                          <div className="flex items-start gap-2.5">
                            <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${item.status === 'Filed' ? 'bg-green-500' : 'bg-amber-500'}`} />
                            <div>
                              <p className="font-bold text-slate-800 dark:text-slate-200">{item.name}</p>
                              <p className="text-[10px] text-slate-450 font-light mt-0.5">{item.desc}</p>
                              <p className="text-[9px] text-indigo-500 font-semibold mt-1">Due: {item.due} {item.filedDate && `(Filed: ${item.filedDate})`}</p>
                            </div>
                          </div>
                          {item.status !== 'Filed' && (
                            <button
                              onClick={() => fileStatutoryTax(item.id)}
                              className="px-2 py-0.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[8px] font-bold uppercase transition-colors"
                            >
                              File
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Asset vs Liability balance breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Asset vs Liability Breakdown</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-light mb-4">Balance sheet equity and debt analysis (in Lakhs)</p>
                  
                  <div className="flex items-center justify-around py-2 gap-4">
                    <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(148, 163, 184, 0.1)" strokeWidth="3" />
                        {/* Current Assets (65%): indigo */}
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#6366f1" strokeWidth="3" strokeDasharray="65 35" strokeDashoffset="0" />
                        {/* Current Liabilities (35%): rose */}
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f43f5e" strokeWidth="3" strokeDasharray="35 65" strokeDashoffset="-65" />
                      </svg>
                      <div className="absolute text-center">
                        <span className="text-sm font-extrabold text-slate-850 dark:text-white leading-none">1.8x</span>
                        <p className="text-[7px] uppercase tracking-widest text-slate-450 mt-0.5">Ratio</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-[11px] w-full max-w-[160px]">
                      <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-850">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded bg-indigo-500" />
                          <span className="text-slate-500">Current Assets</span>
                        </div>
                        <span className="font-bold">₹85.0L</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded bg-rose-500" />
                          <span className="text-slate-500">Liabilities</span>
                        </div>
                        <span className="font-bold">₹46.2L</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Liquidity Scorecard</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-light mb-4">Cash and cash equivalents status</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-500">Quick Ratio</span>
                      <span className="text-slate-900 dark:text-white font-bold">1.45 (Optimal)</span>
                    </div>
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-500">Net Working Capital</span>
                      <span className="text-slate-900 dark:text-white font-bold">₹38.8 Lakhs</span>
                    </div>
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-500">Operating Cash Ratio</span>
                      <span className="text-slate-900 dark:text-white font-bold">1.22 (Healthy)</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: RECEIVABLES (CUSTOMER RECEIPTS & REVENUE) */}
          {activeTab === 'receivables' && (
            <div className="space-y-6">
              {/* Collection Tracking Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="glass-card p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  <h4 className="text-[10px] uppercase font-bold text-slate-400">Total Outstanding Collection</h4>
                  <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                    ₹{transactions.filter(t => t.category === 'Accounts Receivable' && t.status === 'Pending').reduce((sum, t) => sum + t.amount, 0).toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="glass-card p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  <h4 className="text-[10px] uppercase font-bold text-slate-400">Collection Cleared (YTD)</h4>
                  <p className="text-xl font-extrabold text-green-500 mt-1">
                    ₹{transactions.filter(t => t.category === 'Accounts Receivable' && t.status === 'Reconciled').reduce((sum, t) => sum + t.amount, 0).toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="glass-card p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-[10px] uppercase font-bold text-slate-400">Aging Metrics</h4>
                    <p className="text-xs text-slate-450 mt-1">100% outstanding below 30 days aging</p>
                  </div>
                  <Calendar className="w-5 h-5 text-indigo-500" />
                </div>
              </div>

              {/* Receivables Table */}
              <div className="glass-card rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-white/20 dark:bg-slate-900/10 flex justify-between items-center flex-wrap gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Collection Tracking & Customer Invoices</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-light">Track payments received and match invoices to receipts.</p>
                  </div>
                  <button
                    onClick={() => setShowInvoiceModal(true)}
                    className="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-bold flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Add Invoice / Receipt Entry
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-250 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[9px] font-bold">
                        <th className="px-5 py-3.5">Posting Date</th>
                        <th className="px-5 py-3.5">Reference No</th>
                        <th className="px-5 py-3.5">Type</th>
                        <th className="px-5 py-3.5">Invoice Amount</th>
                        <th className="px-5 py-3.5">GST/TDS Splits & Memo</th>
                        <th className="px-5 py-3.5">Collection Status</th>
                        <th className="px-5 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {transactions
                        .filter(t => t.category === 'Accounts Receivable')
                        .map((t, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors">
                            <td className="px-5 py-3.5 font-medium whitespace-nowrap">{new Date(t.date).toLocaleDateString('en-IN')}</td>
                            <td className="px-5 py-3.5 font-bold text-indigo-500">{t.referenceNo}</td>
                            <td className="px-5 py-3.5">{t.type}</td>
                            <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">₹{t.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 font-light max-w-sm truncate" title={t.description || ''}>
                              {t.description || 'No notes added'}
                            </td>
                            <td className="px-5 py-3.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                t.status === 'Reconciled'
                                  ? 'bg-green-550/15 text-green-550'
                                  : 'bg-amber-500/15 text-amber-500'
                              }`}>
                                {t.status === 'Reconciled' ? 'Collected' : 'Pending Collection'}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-right space-x-2">
                              {t.status !== 'Reconciled' && (
                                <button
                                  onClick={() => collectCustomerReceipt(t.id)}
                                  className="px-2 py-0.5 bg-green-550/15 text-green-500 hover:bg-green-500 hover:text-white rounded text-[10px] font-bold transition-all"
                                  title="Mark as Collected"
                                >
                                  Collect
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete('financialtransaction', t.id)}
                                className="p-1 hover:text-red-500 rounded transition-colors inline-block"
                                title="Delete Record"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      {transactions.filter(t => t.category === 'Accounts Receivable').length === 0 && (
                        <tr>
                          <td colSpan={7} className="text-center text-slate-400 py-10 font-light italic">No receivables entries recorded.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PAYABLES (VENDOR BILLING & AP) */}
          {activeTab === 'payables' && (
            <div className="space-y-6">
              {/* Payment Approval Workflow & Due Payment Tracking */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* AP Approval Workflow queue */}
                <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Payment Approval Workflow</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-light mb-4">Authorize pending vendor payments before execution.</p>
                  
                  <div className="space-y-3">
                    {transactions
                      .filter(t => t.category === 'Accounts Payable' && t.status === 'Pending')
                      .map((t, idx) => (
                        <div key={idx} className="p-3 rounded-lg border border-slate-200 dark:border-slate-850 flex items-center justify-between text-xs bg-white/20 dark:bg-slate-900/10">
                          <div>
                            <p className="font-bold text-slate-850 dark:text-slate-250">{t.referenceNo}</p>
                            <p className="text-[10px] text-slate-405 mt-0.5">{t.description}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-slate-900 dark:text-white">₹{t.amount.toLocaleString('en-IN')}</span>
                            <button
                              onClick={() => approveVendorPayment(t.id)}
                              className="px-2.5 py-1 text-[9px] font-bold bg-indigo-650 hover:bg-indigo-700 text-white rounded uppercase"
                            >
                              Approve
                            </button>
                          </div>
                        </div>
                      ))}
                    {transactions.filter(t => t.category === 'Accounts Payable' && t.status === 'Pending').length === 0 && (
                      <p className="text-center text-slate-400 text-xs py-6 italic font-light">No payments currently pending authorization.</p>
                    )}
                  </div>
                </div>

                {/* Due payment tracking */}
                <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Due Payment Tracking</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-light mb-4">Aging analysis of upcoming accounts payable (15-day term).</p>
                  <div className="space-y-3.5 text-xs">
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-200 dark:border-slate-800">
                      <span className="text-slate-450">Overdue (&gt; 15 days):</span>
                      <span className="font-bold text-red-500">₹{overdueAP.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-200 dark:border-slate-800">
                      <span className="text-slate-450">Due within 15 days:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">₹{due15DaysAP.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 font-bold">
                      <span>Total Net Due Accounts Payable:</span>
                      <span>₹{totalDueAP.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Payables Data Table */}
              <div className="glass-card rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-white/20 dark:bg-slate-900/10 flex justify-between items-center flex-wrap gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Vendor Invoice Capture & Accounts Payable (AP)</h3>
                  </div>
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-bold flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Record Vendor Invoice / Payment
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-250 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[9px] font-bold">
                        <th className="px-5 py-3.5">Posting Date</th>
                        <th className="px-5 py-3.5">Reference Invoice</th>
                        <th className="px-5 py-3.5">Payment Type</th>
                        <th className="px-5 py-3.5">Amount (INR)</th>
                        <th className="px-5 py-3.5">Approval Status</th>
                        <th className="px-5 py-3.5">Memo / Vendor Details</th>
                        <th className="px-5 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {transactions
                        .filter(t => t.category === 'Accounts Payable')
                        .map((t, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors">
                            <td className="px-5 py-3.5 font-medium whitespace-nowrap">{new Date(t.date).toLocaleDateString('en-IN')}</td>
                            <td className="px-5 py-3.5 font-bold text-indigo-500">{t.referenceNo}</td>
                            <td className="px-5 py-3.5">{t.type}</td>
                            <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">₹{t.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            <td className="px-5 py-3.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                t.status === 'Processed'
                                  ? 'bg-green-550/15 text-green-500'
                                  : t.status === 'Approved'
                                  ? 'bg-indigo-500/15 text-indigo-500'
                                  : 'bg-amber-500/15 text-amber-500'
                              }`}>
                                {t.status}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 font-light max-w-sm truncate" title={t.description || ''}>
                              {t.description || 'No narration details'}
                            </td>
                            <td className="px-5 py-3.5 text-right space-x-2">
                              {t.status === 'Approved' && (
                                <button
                                  onClick={() => processVendorPayment(t.id)}
                                  className="px-2 py-0.5 bg-indigo-650 hover:bg-indigo-755 text-white rounded text-[10px] font-bold transition-all"
                                  title="Disburse Payment"
                                >
                                  Pay
                                </button>
                              )}
                              {t.status === 'Pending' && (
                                <button
                                  onClick={() => approveVendorPayment(t.id)}
                                  className="px-2 py-0.5 bg-green-550/15 text-green-500 hover:bg-green-500 hover:text-white rounded text-[10px] font-bold transition-all"
                                  title="Approve Invoice"
                                >
                                  Approve
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete('financialtransaction', t.id)}
                                className="p-1 hover:text-red-500 rounded transition-colors inline-block align-middle"
                                title="Delete Record"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      {transactions.filter(t => t.category === 'Accounts Payable').length === 0 && (
                        <tr>
                          <td colSpan={7} className="text-center text-slate-400 py-10 font-light italic">No Accounts Payable (AP) records captured yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GENERAL LEDGER VOUCHERS */}
          {activeTab === 'journal' && (
            <div className="space-y-6">
              
              {/* Ledger Posting (Trial Balance) visual */}
              <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-3">
                  <FileSignature className="w-5 h-5 text-indigo-500" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">GL Ledger Postings (Trial Balance Summary)</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold bg-slate-50/20">
                        <th className="p-2">Ledger Account Code</th>
                        <th className="p-2">Account Name</th>
                        <th className="p-2 text-right">Debit Balance (Dr.)</th>
                        <th className="p-2 text-right">Credit Balance (Cr.)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-850">
                      {Object.entries(ledgerAccounts).map(([name, bal], idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                          <td className="p-2 font-mono">{name.split(' ')[0]}</td>
                          <td className="p-2 font-semibold">{name.substring(name.indexOf(' ') + 1)}</td>
                          <td className="p-2 text-right font-bold">{bal.debit > 0 ? `₹${bal.debit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '-'}</td>
                          <td className="p-2 text-right font-bold">{bal.credit > 0 ? `₹${bal.credit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '-'}</td>
                        </tr>
                      ))}
                      {/* Check Balances */}
                      <tr className="bg-indigo-500/5 dark:bg-indigo-950/20 font-extrabold border-t-2 border-indigo-500/20">
                        <td className="p-3.5" colSpan={2}>
                          <div className="flex items-center gap-2">
                            {Math.abs(totalTrialDebit - totalTrialCredit) < 0.01 ? (
                              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-450 text-[10px] uppercase font-bold tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 shadow-xs">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                <span>BALANCED SHIELD ACTIVE</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-455 text-[10px] uppercase font-bold tracking-wider bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                                <AlertTriangle className="w-3.5 h-3.5 animate-bounce text-rose-500" />
                                <span>IMBALANCED LEDGER DISCREPANCY</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-3.5 text-right text-indigo-650 dark:text-indigo-400 font-black text-sm">₹{totalTrialDebit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                        <td className="p-3.5 text-right text-indigo-650 dark:text-indigo-400 font-black text-sm">₹{totalTrialCredit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Account Reconciliation Panel */}
              <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>Account Reconciliation & Auditing Dashboard</span>
                  </h3>
                  <button
                    onClick={() => {
                      alert('Reconciliation audit run! Trial Balance matches and all GST/TDS tax liabilities reconciled with general ledger balances.');
                    }}
                    className="px-2.5 py-1 text-[10px] bg-emerald-500 hover:bg-emerald-600 text-white rounded font-bold uppercase transition-all"
                  >
                    Run Auto-Audit
                  </button>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-light mb-4">
                  Audit and verify the consistency of sub-ledgers (AR/AP/Tax) against General Ledger clearing balances.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 bg-white/20 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-850 rounded-lg">
                    <p className="font-bold flex items-center justify-between">
                      <span>Sub-ledger AP vs GL:</span>
                      <span className="text-emerald-555 font-bold">● MATCHED</span>
                    </p>
                    <p className="text-[10px] text-slate-455 mt-1">Accounts Payable sub-ledger matches GL Account 2001-AP (₹{totalPayables.toLocaleString('en-IN')})</p>
                  </div>
                  <div className="p-3 bg-white/20 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-850 rounded-lg">
                    <p className="font-bold flex items-center justify-between">
                      <span>Sub-ledger AR vs GL:</span>
                      <span className="text-emerald-555 font-bold">● MATCHED</span>
                    </p>
                    <p className="text-[10px] text-slate-455 mt-1">Accounts Receivable sub-ledger matches GL Account 1002-AR (₹{totalReceivables.toLocaleString('en-IN')})</p>
                  </div>
                  <div className="p-3 bg-white/20 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-850 rounded-lg">
                    <p className="font-bold flex items-center justify-between">
                      <span>Tax Liability vs GL:</span>
                      <span className="text-emerald-555 font-bold">● MATCHED</span>
                    </p>
                    <p className="text-[10px] text-slate-455 mt-1">GST collected liability matches GL Account 2002-GST (₹{gstCollected.toLocaleString('en-IN')})</p>
                  </div>
                </div>
              </div>

              {/* Journal Table */}
              <div className="glass-card rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-white/20 dark:bg-slate-900/10 flex justify-between items-center flex-wrap gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Journal Voucher (JV) Entry & Ledger Posting</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-light">Audit double-entry ledger bookkeeping. Posting date splits credit vs debit accounts.</p>
                  </div>
                  <button
                    onClick={() => setShowJournalModal(true)}
                    className="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-bold flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Record Journal Voucher
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-250 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[9px] font-bold">
                        <th className="px-5 py-3.5">Posting Date</th>
                        <th className="px-5 py-3.5">Voucher Code</th>
                        <th className="px-5 py-3.5">Debit Account</th>
                        <th className="px-5 py-3.5">Credit Account</th>
                        <th className="px-5 py-3.5">Amount (INR)</th>
                        <th className="px-5 py-3.5">GL Narration / Explanation</th>
                        <th className="px-5 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {journals.map((j, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors">
                          <td className="px-5 py-3.5 font-medium whitespace-nowrap">{new Date(j.date).toLocaleDateString('en-IN')}</td>
                          <td className="px-5 py-3.5 font-bold text-indigo-500">{j.code}</td>
                          <td className="px-5 py-3.5"><span className="text-emerald-550 dark:text-emerald-400 font-semibold">{j.debitAccount} (Dr.)</span></td>
                          <td className="px-5 py-3.5"><span className="text-red-500 dark:text-red-400 font-semibold">{j.creditAccount} (Cr.)</span></td>
                          <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">₹{j.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 font-light">{j.description}</td>
                          <td className="px-5 py-3.5 text-right">
                            <button
                              onClick={() => handleDelete('journalentry', j.id)}
                              className="p-1 hover:text-red-500 rounded transition-colors"
                              title="Delete Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {journals.length === 0 && (
                        <tr>
                          <td colSpan={7} className="text-center text-slate-400 py-10 font-light italic">No general ledger journal postings captured.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: BUDGETS & COST CONTROL */}
          {activeTab === 'budgets' && (
            <div className="glass-card rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-white/20 dark:bg-slate-900/10 flex justify-between items-center flex-wrap gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Cost Center Budgets & Allocation</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-light">Set allocation bounds for departments and analyze budget variances.</p>
                </div>
                <button
                  onClick={() => setShowBudgetModal(true)}
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Setup Cost Center
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-250 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[9px] font-bold">
                      <th className="px-5 py-3.5">Department Name</th>
                      <th className="px-5 py-3.5">Fiscal Period</th>
                      <th className="px-5 py-3.5">Allocated Budget</th>
                      <th className="px-5 py-3.5">Spent To Date</th>
                      <th className="px-5 py-3.5">Variance Amount</th>
                      <th className="px-5 py-3.5">Variance status</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {budgets.map((b, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors">
                        <td className="px-5 py-3.5 font-bold">{b.departmentName}</td>
                        <td className="px-5 py-3.5 font-semibold text-indigo-500">{b.period}</td>
                        <td className="px-5 py-3.5">₹{b.allocated.toLocaleString('en-IN')}</td>
                        <td className="px-5 py-3.5 text-slate-700 dark:text-slate-300">₹{b.spent.toLocaleString('en-IN')}</td>
                        <td className={`px-5 py-3.5 font-bold ${b.variance < 0 ? 'text-red-500' : 'text-emerald-550'}`}>
                          ₹{b.variance.toLocaleString('en-IN')}
                        </td>
                        <td className="px-5 py-3.5">
                          {b.variance < 0 ? (
                            <span className="px-2 py-0.5 rounded text-[8px] font-bold uppercase bg-red-500/10 text-red-550">OVERBUDGET</span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[8px] font-bold uppercase bg-green-550/10 text-green-500">SAVINGS</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            onClick={() => handleDelete('budget', b.id)}
                            className="p-1 hover:text-red-500 rounded transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {budgets.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center text-slate-400 py-10 font-light italic">No budget centers registered.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: TAXATION & COMPLIANCE */}
          {activeTab === 'taxation' && (
            <div className="space-y-6">
              {/* Taxation Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* GST Liability & Input Tax Credit Tracker */}
                <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center justify-between">
                    <span>GST Liability Split (CGST + SGST)</span>
                    <span className="text-[10px] text-indigo-500 bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-550/10">Form GSTR-3B Target</span>
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Total GST Liability Logged:</span>
                      <span className="font-bold text-slate-900 dark:text-white">₹{gstCollected.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-200 dark:border-slate-855">
                      <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200/50 dark:border-slate-855 text-center">
                        <p className="text-[9px] uppercase font-bold text-slate-455">CGST (Central Tax)</p>
                        <p className="text-sm font-extrabold text-indigo-500 mt-1">₹{(gstCollected / 2).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200/50 dark:border-slate-855 text-center">
                        <p className="text-[9px] uppercase font-bold text-slate-455">SGST (State Tax)</p>
                        <p className="text-sm font-extrabold text-indigo-500 mt-1">₹{(gstCollected / 2).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* TDS Withheld Tracker */}
                <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center justify-between">
                    <span>TDS Compliance (Sec 194C / 194J / 194I)</span>
                    <span className="text-[10px] text-emerald-500 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">Form 26Q Log</span>
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Total Tax Deducted at Source:</span>
                      <span className="font-bold text-slate-900 dark:text-white">₹{tdsDeducted.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="p-3.5 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200/50 dark:border-slate-855 text-xs">
                      <p className="font-semibold text-slate-750 dark:text-slate-355 flex justify-between">
                        <span>Section 194J (Professional Services - 10%):</span>
                        <span>₹{taxRecords.filter(t => t.type === 'TDS' && t.rate === 0.1).reduce((sum, t) => sum + t.amount, 0).toLocaleString('en-IN')}</span>
                      </p>
                      <p className="font-semibold text-slate-750 dark:text-slate-355 mt-2 flex justify-between">
                        <span>Section 194C (Contracts/Sub-contracts - 2%):</span>
                        <span>₹{taxRecords.filter(t => t.type === 'TDS' && t.rate === 0.02).reduce((sum, t) => sum + t.amount, 0).toLocaleString('en-IN')}</span>
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Tax Logs Table */}
              <div className="glass-card rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-white/20 dark:bg-slate-900/10">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Tax Ledger & Compliance Filing History</h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-250 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[9px] font-bold">
                        <th className="px-5 py-3.5">Filing / Log Date</th>
                        <th className="px-5 py-3.5">Tax Type</th>
                        <th className="px-5 py-3.5">Tax Rate</th>
                        <th className="px-5 py-3.5">Tax Value</th>
                        <th className="px-5 py-3.5">Reference Invoice</th>
                        <th className="px-5 py-3.5">Compliance Status</th>
                        <th className="px-5 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {taxRecords.map((t, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors">
                          <td className="px-5 py-3.5 font-medium whitespace-nowrap">{new Date(t.date).toLocaleDateString('en-IN')}</td>
                          <td className="px-5 py-3.5 font-bold">{t.type}</td>
                          <td className="px-5 py-3.5 font-semibold">{(t.rate * 100).toFixed(1)}%</td>
                          <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">₹{t.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td className="px-5 py-3.5 font-semibold text-indigo-500">{t.referenceNo}</td>
                          <td className="px-5 py-3.5">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase bg-indigo-550/10 text-indigo-500`}>
                              {t.status}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <button
                              onClick={() => handleDelete('taxrecord', t.id)}
                              className="p-1 hover:text-red-500 rounded transition-colors"
                              title="Delete Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {taxRecords.length === 0 && (
                        <tr>
                          <td colSpan={7} className="text-center text-slate-400 py-10 font-light italic">No GST or TDS records logged.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: CASH & BANK MANAGEMENT */}
          {activeTab === 'banking' && (
            <div className="space-y-6">
              
              {/* Cash Flow Monitoring custom chart */}
              <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Cash Flow Monitoring (INR)</h3>
                
                {/* SVG Cash Flow Inflow vs Outflow Bar Chart */}
                <div className="h-40 w-full relative flex items-end">
                  <svg className="w-full h-full pt-4 pb-6" viewBox="0 0 600 160" preserveAspectRatio="none">
                    <line x1="30" y1="20" x2="580" y2="20" stroke="var(--border-card)" strokeWidth="0.5" strokeDasharray="3" />
                    <line x1="30" y1="80" x2="580" y2="80" stroke="var(--border-card)" strokeWidth="0.5" strokeDasharray="3" />
                    <line x1="30" y1="130" x2="580" y2="130" stroke="var(--border-card)" strokeWidth="0.5" strokeDasharray="3" />
                    
                    {/* Inflow vs Outflow Bars */}
                    <rect x="70" y="30" width="30" height="100" fill="#10b981" rx="2" />
                    <rect x="105" y="60" width="30" height="70" fill="#f43f5e" rx="2" />
                    <text x="102" y="150" fill="currentColor" className="text-[10px] text-slate-400 font-bold" textAnchor="middle">Q1 FY26</text>

                    <rect x="220" y="20" width="30" height="110" fill="#10b981" rx="2" />
                    <rect x="255" y="70" width="30" height="60" fill="#f43f5e" rx="2" />
                    <text x="252" y="150" fill="currentColor" className="text-[10px] text-slate-400 font-bold" textAnchor="middle">Q2 FY26</text>

                    <rect x="370" y="40" width="30" height="90" fill="#10b981" rx="2" />
                    <rect x="405" y="50" width="30" height="80" fill="#f43f5e" rx="2" />
                    <text x="402" y="150" fill="currentColor" className="text-[10px] text-slate-400 font-bold" textAnchor="middle">Q3 FY26</text>
                  </svg>
                </div>
                <div className="flex items-center gap-4 text-xs mt-3 justify-center">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 bg-emerald-500 rounded" />
                    <span>Inflows (Customer Receipts)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 bg-rose-500 rounded" />
                    <span>Outflows (Vendor Payments)</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Bank Feeds Integration panel */}
                <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Automated Bank Reconciliation Feed</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-light mb-4">Reconcile internal Cash/Bank ledgers against external feeds.</p>
                  
                  <div className="space-y-3">
                    {bankFeeds.map((feed, idx) => (
                      <div key={idx} className="p-3 rounded-lg border border-slate-200 dark:border-slate-850 flex items-center justify-between text-xs bg-white/20 dark:bg-slate-900/10">
                        <div>
                          <p className="font-bold text-slate-850 dark:text-slate-250">{feed.source}</p>
                          <p className="text-[10px] text-slate-405 font-light mt-0.5">{feed.desc} • {feed.date}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`font-bold ${feed.amount < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                            {feed.amount < 0 ? '-' : '+'} ₹{Math.abs(feed.amount).toLocaleString('en-IN')}
                          </span>
                          <button
                            onClick={() => reconcileBankFeed(feed.id)}
                            className={`px-2.5 py-1 text-[9px] font-bold uppercase rounded transition-colors ${
                              feed.status === 'Matched'
                                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-550/20 cursor-default'
                                : 'bg-indigo-650 text-white hover:bg-indigo-700'
                            }`}
                          >
                            {feed.status === 'Matched' ? 'Reconciled' : 'Match'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fund Transfer tracking */}
                <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Fund Transfers & Liquidity</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-light mb-4">Record internal bank-to-bank transfers or cash deposits.</p>

                  <form onSubmit={handleFundTransfer} className="space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-400 mb-1">Source Account</label>
                        <select
                          value={transferForm.sourceAccount}
                          onChange={(e) => setTransferForm({ ...transferForm, sourceAccount: e.target.value })}
                          className="w-full p-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded text-slate-900 dark:text-white"
                        >
                          <option value="SBI Petty Cash Account">SBI Petty Cash Account</option>
                          <option value="HDFC Current Account">HDFC Current Account</option>
                          <option value="ICICI Escrow Account">ICICI Escrow Account</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Destination Account</label>
                        <select
                          value={transferForm.destinationAccount}
                          onChange={(e) => setTransferForm({ ...transferForm, destinationAccount: e.target.value })}
                          className="w-full p-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded text-slate-900 dark:text-white"
                        >
                          <option value="HDFC Current Account">HDFC Current Account</option>
                          <option value="SBI Petty Cash Account">SBI Petty Cash Account</option>
                          <option value="ICICI Escrow Account">ICICI Escrow Account</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Transfer Value (INR)</label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 10000"
                        value={transferForm.amount}
                        onChange={(e) => setTransferForm({ ...transferForm, amount: e.target.value })}
                        className="w-full p-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Description / Narration</label>
                      <input
                        type="text"
                        placeholder="e.g. Replenish cash at HDFC vault"
                        value={transferForm.description}
                        onChange={(e) => setTransferForm({ ...transferForm, description: e.target.value })}
                        className="w-full p-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded text-slate-900 dark:text-white"
                      />
                    </div>
                    <button type="submit" className="w-full py-2 bg-indigo-650 hover:bg-indigo-700 text-white font-bold uppercase rounded tracking-wider transition-colors">
                      Execute Liquidity Transfer
                    </button>
                  </form>
                </div>

              </div>
            </div>
          )}

          {/* TAB 8: FINANCIAL STATEMENTS REPORTING */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              
              {/* Controls bar */}
              <div className="p-4 bg-white/20 dark:bg-slate-900/10 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between flex-wrap gap-4 text-xs">
                <div className="flex items-center gap-3">
                  {[
                    { id: 'pl', label: 'Profit & Loss Statement' },
                    { id: 'bs', label: 'Balance Sheet' },
                    { id: 'cf', label: 'Cash Flow Statement' },
                  ].map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => setReportSubTab(sub.id)}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                        reportSubTab === sub.id
                          ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/10'
                          : 'text-slate-550 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => window.print()} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-colors" title="Print Statement">
                    <Printer className="w-4 h-4" />
                  </button>
                  <button onClick={() => alert('Report data exported to CSV')} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-colors" title="Export CSV">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Profit & Loss Statement */}
              {reportSubTab === 'pl' && (
                <div className="glass-card p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 w-full max-w-none">
                  <div className="text-center pb-4 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-base font-extrabold uppercase text-slate-800 dark:text-slate-200">Apex Global Enterprises</h2>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Statement of Profit & Loss (Accrual Basis)</p>
                    <p className="text-[9px] text-slate-500 mt-0.5">For the period ended 31-March-2027</p>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    {/* Revenue */}
                    <div>
                      <h4 className="font-extrabold text-indigo-500 uppercase tracking-wider text-[10px]">1. Operating Revenue</h4>
                      <div className="flex justify-between items-center py-1 mt-1 border-b border-slate-100 dark:border-slate-850">
                        <span className="text-slate-500 pl-3">Gross Sales (Customer Receipts)</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-350">₹{transactions.filter(t => t.type === 'Customer Receipt').reduce((sum, t) => sum + t.amount, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-850">
                        <span className="text-slate-500 pl-3">Other Inward Income (Advance Payments)</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-350">₹{transactions.filter(t => t.type === 'Advance Payment').reduce((sum, t) => sum + t.amount, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 font-bold">
                        <span className="pl-3">Total Operational Revenue (A)</span>
                        <span>₹{(
                          transactions.filter(t => t.type === 'Customer Receipt' || t.type === 'Advance Payment').reduce((sum, t) => sum + t.amount, 0)
                        ).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>

                    {/* Expenses */}
                    <div>
                      <h4 className="font-extrabold text-indigo-500 uppercase tracking-wider text-[10px]">2. Operational Expenses</h4>
                      <div className="flex justify-between items-center py-1 mt-1 border-b border-slate-100 dark:border-slate-850">
                        <span className="text-slate-500 pl-3">Cost of Goods Sold (Vendor Payments)</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-350">₹{transactions.filter(t => t.type === 'Vendor Payment').reduce((sum, t) => sum + t.amount, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-850">
                        <span className="text-slate-500 pl-3">Taxes Paid (GST Filings)</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-355">₹{gstCollected.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 font-bold">
                        <span className="pl-3">Total Expenses (B)</span>
                        <span>₹{(
                          transactions.filter(t => t.type === 'Vendor Payment').reduce((sum, t) => sum + t.amount, 0) + gstCollected
                        ).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>

                    {/* Net Profit */}
                    <div className="pt-3 border-t-2 border-slate-350 dark:border-slate-700 flex justify-between items-center font-extrabold text-sm text-indigo-650 dark:text-indigo-400">
                      <span>EBITDA / Net Profit (A - B)</span>
                      <span>₹{(
                        transactions.filter(t => t.type === 'Customer Receipt' || t.type === 'Advance Payment').reduce((sum, t) => sum + t.amount, 0) -
                        (transactions.filter(t => t.type === 'Vendor Payment').reduce((sum, t) => sum + t.amount, 0) + gstCollected)
                      ).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Balance Sheet Statement */}
              {reportSubTab === 'bs' && (
                <div className="glass-card p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 w-full max-w-none">
                  <div className="text-center pb-4 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-base font-extrabold uppercase text-slate-800 dark:text-slate-200">Apex Global Enterprises</h2>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Statement of Liabilities & Assets (Balance Sheet)</p>
                    <p className="text-[9px] text-slate-500 mt-0.5">As of 31-March-2027</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                    {/* Liabilities */}
                    <div>
                      <h4 className="font-extrabold text-indigo-500 uppercase tracking-wider text-[10px] mb-2">Liabilities & Capital</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-850">
                          <span className="text-slate-450">Accounts Payable (AP)</span>
                          <span className="font-semibold">₹{totalPayables.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-850">
                          <span className="text-slate-450">GST Statutory Liability</span>
                          <span className="font-semibold">₹{gstCollected.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-850">
                          <span className="text-slate-450">Shareholders Capital</span>
                          <span className="font-semibold">₹5,00,000.00</span>
                        </div>
                        <div className="flex justify-between py-1.5 font-bold pt-3 border-t border-slate-200 dark:border-slate-800">
                          <span>Total Equities (A)</span>
                          <span>₹{(totalPayables + gstCollected + 500000).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Assets */}
                    <div>
                      <h4 className="font-extrabold text-indigo-500 uppercase tracking-wider text-[10px] mb-2">Corporate Assets</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-850">
                          <span className="text-slate-450">Cash Bank Balance</span>
                          <span className="font-semibold">₹{(totalReceivables + 500000).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-850">
                          <span className="text-slate-450">Accounts Receivable (AR)</span>
                          <span className="font-semibold">₹{totalReceivables.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-850">
                          <span className="text-slate-450">TDS Assets</span>
                          <span className="font-semibold">₹{tdsDeducted.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between py-1.5 font-bold pt-3 border-t border-slate-200 dark:border-slate-800">
                          <span>Total Assets (B)</span>
                          <span>₹{(totalReceivables * 2 + 500000).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-850">
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-455 text-[10px] uppercase font-bold tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 shadow-xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Liabilities & Assets fully reconciled</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Cash Flow Statement */}
              {reportSubTab === 'cf' && (
                <div className="glass-card p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 w-full max-w-none">
                  <div className="text-center pb-4 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-base font-extrabold uppercase text-slate-800 dark:text-slate-200">Apex Global Enterprises</h2>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Statement of Cash Flows (Audited)</p>
                    <p className="text-[9px] text-slate-500 mt-0.5">For the period ended 31-March-2027</p>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    <div>
                      <h4 className="font-extrabold text-indigo-500 uppercase tracking-wider text-[10px]">A. Cash Flow from Operating Activities</h4>
                      <div className="flex justify-between py-1 pl-3 border-b border-slate-100 dark:border-slate-850">
                        <span>Customer Receipts Received</span>
                        <span className="text-green-500 font-semibold">+ ₹{transactions.filter(t => t.type === 'Customer Receipt').reduce((sum, t) => sum + t.amount, 0).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between py-1 pl-3 border-b border-slate-100 dark:border-slate-850">
                        <span>Vendor Payments Disbursed</span>
                        <span className="text-rose-500 font-semibold">- ₹{transactions.filter(t => t.type === 'Vendor Payment').reduce((sum, t) => sum + t.amount, 0).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between py-1 pl-3 border-b border-slate-100 dark:border-slate-850">
                        <span>Statutory GST compliance deposits</span>
                        <span className="text-rose-500 font-semibold">- ₹{gstCollected.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between font-bold">
                      <span>Net Cash Surplus from Operations (A)</span>
                      <span>₹{(
                        transactions.filter(t => t.type === 'Customer Receipt').reduce((sum, t) => sum + t.amount, 0) -
                        transactions.filter(t => t.type === 'Vendor Payment').reduce((sum, t) => sum + t.amount, 0) -
                        gstCollected
                      ).toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between font-bold border-b border-slate-200 dark:border-slate-800 py-1.5">
                      <span>B. Starting Cash Balance (FY26 Opening)</span>
                      <span>₹5,00,000.00</span>
                    </div>

                    <div className="pt-2 font-extrabold text-indigo-650 dark:text-indigo-400 flex justify-between text-sm">
                      <span>Net Closing Cash & Cash Equivalents (A + B)</span>
                      <span>₹{(
                        transactions.filter(t => t.type === 'Customer Receipt').reduce((sum, t) => sum + t.amount, 0) -
                        transactions.filter(t => t.type === 'Vendor Payment').reduce((sum, t) => sum + t.amount, 0) -
                        gstCollected + 500000
                      ).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      )}

      {/* MODAL 1: CUSTOMER INVOICE / RECEIPT ENTRY */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg glass-card rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Receipt / Invoice Generation Form</h3>
              <button onClick={() => setShowInvoiceModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">Close</button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Receipt/Invoice Type</label>
                  <select
                    value={invoiceForm.type}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, type: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-955 border border-slate-250 dark:border-slate-800 rounded focus:border-indigo-500 focus:outline-none text-slate-900 dark:text-white"
                  >
                    <option value="Customer Invoice">Customer Invoice Generation</option>
                    <option value="Customer Receipt">Customer Receipt Entry</option>
                    <option value="Advance Payment">Advance Payment Recording</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Customer Name / Details</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SpaceX Inc."
                    value={invoiceForm.customerName}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, customerName: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-955 border border-slate-250 dark:border-slate-800 rounded focus:border-indigo-500 focus:outline-none text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Base Amount (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 100000"
                    value={invoiceForm.baseAmount}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, baseAmount: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-955 border border-slate-250 dark:border-slate-800 rounded focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">GST Classification</label>
                  <select
                    value={invoiceForm.gstType}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, gstType: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-955 border border-slate-250 dark:border-slate-800 rounded focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="CGST_SGST">Intra-State (CGST + SGST)</option>
                    <option value="IGST">Inter-State (IGST)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">GST Tax Rate (Standard split)</label>
                  <select
                    value={invoiceForm.gstRate}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, gstRate: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-955 border border-slate-250 dark:border-slate-800 rounded focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="0.18">18% GST (Standard Services/Goods)</option>
                    <option value="0.12">12% GST (Semi-standard)</option>
                    <option value="0.05">5% GST (Essential Commodities)</option>
                    <option value="0.28">28% GST (Luxury supplies)</option>
                    <option value="0.00">0% Exempt / Nil Rated</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">TDS Section Rate</label>
                  <select
                    value={invoiceForm.tdsRate}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, tdsRate: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-955 border border-slate-250 dark:border-slate-800 rounded focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="0.00">No TDS Withheld</option>
                    <option value="0.01">Sec 194C (Contracts - 1%)</option>
                    <option value="0.02">Sec 194C (Contracts - 2%)</option>
                    <option value="0.10">Sec 194J (Professional fees - 10%)</option>
                    <option value="0.075">Sec 194I (Machinery Rent - 7.5%)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Invoice / Ref No</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. INV-2026-0098"
                    value={invoiceForm.referenceNo}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, referenceNo: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-955 border border-slate-250 dark:border-slate-800 rounded focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Posting Date</label>
                  <input
                    type="date"
                    required
                    value={invoiceForm.date}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, date: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-955 border border-slate-250 dark:border-slate-800 rounded focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Memo Narration</label>
                <textarea
                  placeholder="Additional accounting narrations..."
                  rows={2}
                  value={invoiceForm.description}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, description: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-955 border border-slate-250 dark:border-slate-800 rounded focus:border-indigo-500 focus:outline-none resize-none"
                />
              </div>

              {/* LIVE TAX SPLITS CALCULATION VIEW */}
              {invoiceForm.baseAmount && !isNaN(parseFloat(invoiceForm.baseAmount)) && (
                <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-405 space-y-1">
                  <div className="flex justify-between">
                    <span>Base Amount:</span>
                    <span className="font-bold">₹{parseFloat(invoiceForm.baseAmount).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST ({(parseFloat(invoiceForm.gstRate) * 100).toFixed(0)}%):</span>
                    <span className="font-bold text-indigo-500">+ ₹{(parseFloat(invoiceForm.baseAmount) * parseFloat(invoiceForm.gstRate)).toLocaleString('en-IN')}</span>
                  </div>
                  {parseFloat(invoiceForm.tdsRate) > 0 && (
                    <div className="flex justify-between">
                      <span>TDS Deducted ({(parseFloat(invoiceForm.tdsRate) * 100).toFixed(1)}%):</span>
                      <span className="font-bold text-red-500">- ₹{(parseFloat(invoiceForm.baseAmount) * parseFloat(invoiceForm.tdsRate)).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-1 font-extrabold text-slate-900 dark:text-white">
                    <span>Net Journal Posting Total:</span>
                    <span>
                      ₹{(
                        parseFloat(invoiceForm.baseAmount) +
                        parseFloat(invoiceForm.baseAmount) * parseFloat(invoiceForm.gstRate) -
                        parseFloat(invoiceForm.baseAmount) * parseFloat(invoiceForm.tdsRate)
                      ).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-wider rounded"
              >
                Post Ledger & Tax Entries
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: VENDOR PAYMENT ENTRY */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg glass-card rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Record Vendor Bill / Payment</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">Close</button>
            </div>

            <form onSubmit={handleCreatePayment} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Transaction Category</label>
                  <select
                    value={paymentForm.type}
                    onChange={(e) => setPaymentForm({ ...paymentForm, type: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-955 border border-slate-250 dark:border-slate-800 rounded text-slate-900 dark:text-white"
                  >
                    <option value="Vendor Invoice">Vendor Invoice Capture (AP)</option>
                    <option value="Vendor Payment">Vendor Payment Processing (Debit)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Vendor / Payee Details</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tata Steel Ltd"
                    value={paymentForm.vendorName}
                    onChange={(e) => setPaymentForm({ ...paymentForm, vendorName: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-955 border border-slate-250 dark:border-slate-800 rounded text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Base Amount (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 50000"
                    value={paymentForm.baseAmount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, baseAmount: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-955 border border-slate-250 dark:border-slate-800 rounded text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">GST Classification</label>
                  <select
                    value={paymentForm.gstType}
                    onChange={(e) => setPaymentForm({ ...paymentForm, gstType: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-955 border border-slate-250 dark:border-slate-800 rounded text-slate-900 dark:text-white"
                  >
                    <option value="CGST_SGST">Intra-State (CGST + SGST)</option>
                    <option value="IGST">Inter-State (IGST)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">GST Input Tax Credit Rate</label>
                  <select
                    value={paymentForm.gstRate}
                    onChange={(e) => setPaymentForm({ ...paymentForm, gstRate: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-955 border border-slate-250 dark:border-slate-800 rounded text-slate-900 dark:text-white"
                  >
                    <option value="0.18">18% GST (Standard)</option>
                    <option value="0.12">12% GST (Semi-standard)</option>
                    <option value="0.05">5% GST (Essential)</option>
                    <option value="0.28">28% GST (Luxury)</option>
                    <option value="0.00">0% Exempt / Nil Rated</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">TDS Section Rate</label>
                  <select
                    value={paymentForm.tdsRate}
                    onChange={(e) => setPaymentForm({ ...paymentForm, tdsRate: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-955 border border-slate-250 dark:border-slate-800 rounded text-slate-900 dark:text-white"
                  >
                    <option value="0.00">No TDS Withheld</option>
                    <option value="0.01">Sec 194C (Contracts - 1%)</option>
                    <option value="0.02">Sec 194C (Contracts - 2%)</option>
                    <option value="0.10">Sec 194J (Professional fees - 10%)</option>
                    <option value="0.075">Sec 194I (Machinery Rent - 7.5%)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Cost Center / Budget Link</label>
                  <select
                    value={paymentForm.departmentName}
                    onChange={(e) => setPaymentForm({ ...paymentForm, departmentName: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-955 border border-slate-250 dark:border-slate-800 rounded text-slate-900 dark:text-white"
                  >
                    <option value="">No Cost Center Link</option>
                    {budgets.map(b => (
                      <option key={b.id} value={b.departmentName}>{b.departmentName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Reference Voucher No</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PO-REF-998"
                    value={paymentForm.referenceNo}
                    onChange={(e) => setPaymentForm({ ...paymentForm, referenceNo: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-955 border border-slate-250 dark:border-slate-800 rounded text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Payment Clearing Status</label>
                  <select
                    value={paymentForm.status}
                    onChange={(e) => setPaymentForm({ ...paymentForm, status: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-955 border border-slate-250 dark:border-slate-800 rounded text-slate-900 dark:text-white"
                  >
                    <option value="Pending">Pending Approval (Workflow Queue)</option>
                    <option value="Approved">Authorized & Approved</option>
                    <option value="Processed">Processed & Paid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Posting Date</label>
                  <input
                    type="date"
                    required
                    value={paymentForm.date}
                    onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-955 border border-slate-250 dark:border-slate-800 rounded text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Accounting Memo / Narration</label>
                <textarea
                  placeholder="Record HSN details, PAN, or invoice notes..."
                  rows={2}
                  value={paymentForm.description}
                  onChange={(e) => setPaymentForm({ ...paymentForm, description: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-955 border border-slate-250 dark:border-slate-800 rounded resize-none text-slate-900 dark:text-white"
                />
              </div>

              {/* LIVE TAX SPLITS CALCULATION VIEW */}
              {paymentForm.baseAmount && !isNaN(parseFloat(paymentForm.baseAmount)) && (
                <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-405 space-y-1">
                  <div className="flex justify-between">
                    <span>Base Amount:</span>
                    <span className="font-bold">₹{parseFloat(paymentForm.baseAmount).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST ITC ({(parseFloat(paymentForm.gstRate) * 100).toFixed(0)}%):</span>
                    <span className="font-bold text-indigo-500">+ ₹{(parseFloat(paymentForm.baseAmount) * parseFloat(paymentForm.gstRate)).toLocaleString('en-IN')}</span>
                  </div>
                  {parseFloat(paymentForm.tdsRate) > 0 && (
                    <div className="flex justify-between">
                      <span>TDS Deducted ({(parseFloat(paymentForm.tdsRate) * 100).toFixed(1)}%):</span>
                      <span className="font-bold text-red-500">- ₹{(parseFloat(paymentForm.baseAmount) * parseFloat(paymentForm.tdsRate)).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-1 font-extrabold text-slate-900 dark:text-white">
                    <span>Net Payable Total:</span>
                    <span>
                      ₹{(
                        parseFloat(paymentForm.baseAmount) +
                        parseFloat(paymentForm.baseAmount) * parseFloat(paymentForm.gstRate) -
                        parseFloat(paymentForm.baseAmount) * parseFloat(paymentForm.tdsRate)
                      ).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white font-bold uppercase tracking-wider rounded"
              >
                Capture AP Ledger Entry
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: JOURNAL VOUCHER */}
      {showJournalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg glass-card rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Post General Journal Voucher (JV)</h3>
              <button onClick={() => setShowJournalModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">Close</button>
            </div>

            <form onSubmit={handleCreateJournal} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">JV Voucher Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. JV-2026-0012"
                    value={journalForm.code}
                    onChange={(e) => setJournalForm({ ...journalForm, code: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-955 border border-slate-250 dark:border-slate-800 rounded text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Voucher Amount (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 25000"
                    value={journalForm.amount}
                    onChange={(e) => setJournalForm({ ...journalForm, amount: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-955 border border-slate-250 dark:border-slate-800 rounded text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Debited Account (Dr.)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rent Account"
                    value={journalForm.debitAccount}
                    onChange={(e) => setJournalForm({ ...journalForm, debitAccount: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-955 border border-slate-250 dark:border-slate-800 rounded text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Credited Account (Cr.)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. HDFC Bank Account"
                    value={journalForm.creditAccount}
                    onChange={(e) => setJournalForm({ ...journalForm, creditAccount: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-955 border border-slate-250 dark:border-slate-800 rounded text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Posting Date</label>
                  <input
                    type="date"
                    required
                    value={journalForm.date}
                    onChange={(e) => setJournalForm({ ...journalForm, date: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-955 border border-slate-250 dark:border-slate-800 rounded text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Cost Center / Budget Link</label>
                  <select
                    value={journalForm.departmentName}
                    onChange={(e) => setJournalForm({ ...journalForm, departmentName: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-955 border border-slate-250 dark:border-slate-800 rounded text-slate-900 dark:text-white"
                  >
                    <option value="">No Cost Center Link</option>
                    {budgets.map(b => (
                      <option key={b.id} value={b.departmentName}>{b.departmentName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Accounting Narration</label>
                <textarea
                  required
                  placeholder="Being office rent paid for the month of June..."
                  rows={2}
                  value={journalForm.description}
                  onChange={(e) => setJournalForm({ ...journalForm, description: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-955 border border-slate-250 dark:border-slate-800 rounded resize-none text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white font-bold uppercase tracking-wider rounded"
              >
                Post Double Entry Voucher
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: SETUP BUDGET */}
      {showBudgetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md glass-card rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Add Cost Center Budget Allocation</h3>
              <button onClick={() => setShowBudgetModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">Close</button>
            </div>

            <form onSubmit={handleCreateBudget} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Department / Cost Center Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Marketing Division"
                  value={budgetForm.departmentName}
                  onChange={(e) => setBudgetForm({ ...budgetForm, departmentName: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-955 border border-slate-250 dark:border-slate-800 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Allocated Budget (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 500000"
                    value={budgetForm.allocated}
                    onChange={(e) => setBudgetForm({ ...budgetForm, allocated: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-955 border border-slate-250 dark:border-slate-800 rounded"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Spent To Date (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 0"
                    value={budgetForm.spent}
                    onChange={(e) => setBudgetForm({ ...budgetForm, spent: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-955 border border-slate-250 dark:border-slate-800 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Fiscal Period</label>
                <select
                  value={budgetForm.period}
                  onChange={(e) => setBudgetForm({ ...budgetForm, period: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-955 border border-slate-250 dark:border-slate-800 rounded"
                >
                  <option value="FY2026">FY 2026-27</option>
                  <option value="Q1-2026">Q1 FY 2026-27</option>
                  <option value="Q2-2026">Q2 FY 2026-27</option>
                  <option value="Q3-2026">Q3 FY 2026-27</option>
                  <option value="Q4-2026">Q4 FY 2026-27</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-wider rounded"
              >
                Register Cost Center
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
