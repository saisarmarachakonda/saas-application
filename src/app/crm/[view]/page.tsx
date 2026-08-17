'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import InplaceCrud, { ModelConfig } from '@/components/crud/InplaceCrud';
import { Compass, Sparkles, HelpCircle, FileSpreadsheet, ShoppingBag, Plus, ArrowRight, DollarSign, CheckCircle2 } from 'lucide-react';

interface Deal {
  id: string;
  name: string;
  company: string;
  value: number;
  stage: 'Discovery' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
  expectedClose: string;
}

export default function CRMViewPage() {
  const { view } = useParams() as { view: string };

  const [deals, setDeals] = useState<Deal[]>([]);
  const [showAddDeal, setShowAddDeal] = useState(false);
  const [newDealForm, setNewDealForm] = useState({
    name: '',
    company: '',
    value: '',
    stage: 'Discovery' as Deal['stage'],
    expectedClose: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0]
  });
  const [feedback, setFeedback] = useState('');

  // Initial load for deals Kanban
  useEffect(() => {
    const saved = localStorage.getItem('tfmc_crm_deals');
    if (saved) {
      try {
        setDeals(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    } else {
      const mockDeals: Deal[] = [
        { id: 'deal-1', name: 'Cloud ERP Migration 2026', company: 'Titan Industries', value: 145000, stage: 'Proposal', expectedClose: '2026-09-15' },
        { id: 'deal-2', name: 'Smart Warehouse IoT Sensors', company: 'Reliance Logistics', value: 92000, stage: 'Negotiation', expectedClose: '2026-08-30' },
        { id: 'deal-3', name: 'Facilities Management Suite', company: 'L&T Infrastructure', value: 210000, stage: 'Discovery', expectedClose: '2026-10-10' },
        { id: 'deal-4', name: 'Supply Chain Analytics Engine', company: 'Tata Motors', value: 180000, stage: 'Won', expectedClose: '2026-07-28' },
      ];
      setDeals(mockDeals);
      localStorage.setItem('tfmc_crm_deals', JSON.stringify(mockDeals));
    }
  }, []);

  const moveDealStage = (dealId: string, targetStage: Deal['stage']) => {
    const updated = deals.map(d => d.id === dealId ? { ...d, stage: targetStage } : d);
    setDeals(updated);
    localStorage.setItem('tfmc_crm_deals', JSON.stringify(updated));
    setFeedback(`Deal moved to ${targetStage} stage successfully!`);
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDealForm.name || !newDealForm.company || !newDealForm.value) return;

    const created: Deal = {
      id: 'deal_' + Math.random().toString(36).substring(2, 9),
      name: newDealForm.name,
      company: newDealForm.company,
      value: parseFloat(newDealForm.value) || 0,
      stage: newDealForm.stage,
      expectedClose: newDealForm.expectedClose
    };

    const updated = [created, ...deals];
    setDeals(updated);
    localStorage.setItem('tfmc_crm_deals', JSON.stringify(updated));
    setShowAddDeal(false);
    setNewDealForm({ name: '', company: '', value: '', stage: 'Discovery', expectedClose: new Date().toISOString().split('T')[0] });
    setFeedback(`Opportunity "${created.name}" created!`);
    setTimeout(() => setFeedback(''), 3000);
  };

  const viewMapping: { [key: string]: { tab: string; icon: React.ReactNode; label: string } } = {
    'leads': { tab: 'lead', label: 'Leads Pipeline', icon: <Compass className="w-5 h-5" /> },
    'opportunities': { tab: 'opportunity', label: 'Opportunities Tracking', icon: <Sparkles className="w-5 h-5" /> },
    'rfqs': { tab: 'rfqcrm', label: 'Customer RFQs', icon: <HelpCircle className="w-5 h-5" /> },
    'quotations': { tab: 'quotation', label: 'Quotations Management', icon: <FileSpreadsheet className="w-5 h-5" /> },
    'sales-orders': { tab: 'salesorder', label: 'Sales Orders List', icon: <ShoppingBag className="w-5 h-5" /> },
  };

  const currentView = viewMapping[view];
  if (!currentView) {
    return <div className="p-8 text-center text-slate-500">Workspace CRM View '{view}' not found.</div>;
  }

  const configs: ModelConfig[] = [
    {
      name: 'lead',
      label: 'Lead Management',
      fields: [
        { name: 'name', label: 'Lead Name', type: 'text', required: true },
        { name: 'email', label: 'Contact Email', type: 'email', required: true },
        { name: 'phone', label: 'Contact Phone', type: 'text' },
        { name: 'company', label: 'Target Company', type: 'text', required: true },
        {
          name: 'status',
          label: 'Lead Pipeline Status',
          type: 'select',
          required: true,
          options: [
            { label: 'New Lead', value: 'New' },
            { label: 'Contacted', value: 'Contacted' },
            { label: 'Qualified (Hot)', value: 'Qualified' },
            { label: 'Lost Lead', value: 'Lost' },
          ],
        },
        {
          name: 'source',
          label: 'Acquisition Source',
          type: 'select',
          required: true,
          options: [
            { label: 'Company Website', value: 'Website' },
            { label: 'Client Referral', value: 'Referral' },
            { label: 'Trade Show / Expo', value: 'Trade Show' },
            { label: 'Cold Outreach', value: 'Cold Outreach' },
          ],
        },
        { name: 'assignedTo', label: 'Assigned Sales Owner', type: 'text' },
        { name: 'customerId', label: 'Associated Customer Profile', type: 'select', refModel: 'customer', refLabelField: 'name' },
      ],
      columns: ['name', 'company', 'status', 'assignedTo', 'customerId'],
    },
    {
      name: 'opportunity',
      label: 'Opportunities',
      fields: [
        { name: 'leadId', label: 'Originating Lead', type: 'select', refModel: 'lead', refLabelField: 'company', required: true },
        { name: 'name', label: 'Opportunity Name', type: 'text', required: true },
        {
          name: 'stage',
          label: 'Sales Pipeline Stage',
          type: 'select',
          required: true,
          options: [
            { label: 'Discovery & Needs', value: 'Discovery' },
            { label: 'Proposal Submitted', value: 'Proposal' },
            { label: 'Contract Negotiation', value: 'Negotiation' },
            { label: 'Closed Won (Deal)', value: 'Won' },
            { label: 'Closed Lost', value: 'Lost' },
          ],
        },
        { name: 'value', label: 'Estimated Deal Value ($)', type: 'number', required: true },
        { name: 'expectedClose', label: 'Expected Close Date', type: 'date', required: true },
      ],
      columns: ['name', 'leadId', 'stage', 'value', 'expectedClose'],
    },
    {
      name: 'rfqcrm',
      label: 'Customer RFQs',
      fields: [
        { name: 'customerId', label: 'Issuing Customer', type: 'select', refModel: 'customer', required: true },
        { name: 'title', label: 'RFQ Title / Scope', type: 'text', required: true },
        {
          name: 'status',
          label: 'RFQ Status',
          type: 'select',
          required: true,
          options: [
            { label: 'RFQ Received', value: 'Received' },
            { label: 'Under Technical Evaluation', value: 'Under Evaluation' },
            { label: 'Responded (Quote Sent)', value: 'Responded' },
            { label: 'Cancelled / Rejected', value: 'Cancelled' },
          ],
        },
        { name: 'dueDate', label: 'Bidding Due Date', type: 'date', required: true },
      ],
      columns: ['title', 'customerId', 'status', 'dueDate'],
    },
    {
      name: 'quotation',
      label: 'Quotations',
      fields: [
        { name: 'rfqId', label: 'Target Customer RFQ', type: 'select', refModel: 'rfqcrm', refLabelField: 'title', required: true },
        { name: 'code', label: 'Quotation Code (QT-...)', type: 'text', required: true },
        { name: 'version', label: 'Revision Version', type: 'number', required: true },
        { name: 'value', label: 'Offered Price Quote ($)', type: 'number', required: true },
        {
          name: 'status',
          label: 'Quotation Status',
          type: 'select',
          required: true,
          options: [
            { label: 'Draft Mode', value: 'Draft' },
            { label: 'Approved (Ready to send)', value: 'Approved' },
            { label: 'Sent to Customer', value: 'Sent' },
            { label: 'Accepted by Client', value: 'Accepted' },
            { label: 'Rejected by Client', value: 'Rejected' },
          ],
        },
      ],
      columns: ['code', 'rfqId', 'value', 'status'],
    },
    {
      name: 'salesorder',
      label: 'Sales Orders',
      fields: [
        { name: 'quotationId', label: 'Accepted Quotation', type: 'select', refModel: 'quotation', refLabelField: 'code', required: true },
        { name: 'orderNo', label: 'Sales Order No (SO-...)', type: 'text', required: true },
        { name: 'value', label: 'Contract Sales Value ($)', type: 'number', required: true },
        {
          name: 'status',
          label: 'Fulfillment Status',
          type: 'select',
          required: true,
          options: [
            { label: 'Pending Processing', value: 'Pending' },
            { label: 'In Manufacturing', value: 'Processing' },
            { label: 'Shipped out', value: 'Shipped' },
            { label: 'Delivered to Destination', value: 'Delivered' },
            { label: 'Order Cancelled', value: 'Cancelled' },
          ],
        },
      ],
      columns: ['orderNo', 'quotationId', 'value', 'status'],
    },
  ];

  // Custom Kanban Board for Opportunities view
  if (view === 'opportunities') {
    const stages: { key: Deal['stage']; label: string; color: string }[] = [
      { key: 'Discovery', label: 'Discovery & Needs', color: 'border-blue-500 text-blue-500' },
      { key: 'Proposal', label: 'Proposal Sent', color: 'border-indigo-500 text-indigo-500' },
      { key: 'Negotiation', label: 'Contract Negotiation', color: 'border-amber-500 text-amber-500' },
      { key: 'Won', label: 'Closed Won ($)', color: 'border-green-500 text-green-500' },
      { key: 'Lost', label: 'Closed Lost', color: 'border-slate-400 text-slate-400' },
    ];

    const totalPipelineValue = deals.reduce((sum, d) => sum + d.value, 0);

    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-500" />
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Sales Pipeline Kanban Board</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">
                Visual deal stage progression, estimated revenue weighted forecasts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 glass-card border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300">
              Total Pipeline: <span className="text-indigo-500 font-black">${totalPipelineValue.toLocaleString()}</span>
            </div>
            <button
              onClick={() => setShowAddDeal(!showAddDeal)}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{showAddDeal ? 'Cancel' : 'New Opportunity'}</span>
            </button>
          </div>
        </div>

        {feedback && (
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Modal / Inline Add Form */}
        {showAddDeal && (
          <form onSubmit={handleCreateDeal} className="glass-card p-5 rounded-xl border border-indigo-500/30 bg-indigo-500/5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Create New Opportunity</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Deal Name"
                value={newDealForm.name}
                onChange={e => setNewDealForm({ ...newDealForm, name: e.target.value })}
                required
                className="px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:border-indigo-500"
              />
              <input
                type="text"
                placeholder="Target Company"
                value={newDealForm.company}
                onChange={e => setNewDealForm({ ...newDealForm, company: e.target.value })}
                required
                className="px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:border-indigo-500"
              />
              <input
                type="number"
                placeholder="Est. Value ($)"
                value={newDealForm.value}
                onChange={e => setNewDealForm({ ...newDealForm, value: e.target.value })}
                required
                className="px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:border-indigo-500"
              />
              <select
                value={newDealForm.stage}
                onChange={e => setNewDealForm({ ...newDealForm, stage: e.target.value as Deal['stage'] })}
                className="px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:border-indigo-500"
              >
                {stages.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
            >
              Add Deal
            </button>
          </form>
        )}

        {/* 5-Column Pipeline Board */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto">
          {stages.map(st => {
            const stageDeals = deals.filter(d => d.stage === st.key);
            const stageSum = stageDeals.reduce((sum, d) => sum + d.value, 0);

            return (
              <div key={st.key} className="glass-card p-3 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 flex flex-col justify-between min-h-[360px]">
                <div>
                  <div className={`flex items-center justify-between pb-2 border-b-2 ${st.color}`}>
                    <span className="text-xs font-bold uppercase tracking-wider">{st.label}</span>
                    <span className="text-[10px] font-extrabold bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300">
                      {stageDeals.length}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-semibold mt-1 mb-3">
                    Sum: ${stageSum.toLocaleString()}
                  </div>

                  <div className="space-y-3">
                    {stageDeals.map(d => (
                      <div key={d.id} className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs space-y-2">
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{d.name}</h4>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium">{d.company}</p>
                        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-850 pt-2 text-[10px]">
                          <span className="font-extrabold text-indigo-500">${d.value.toLocaleString()}</span>
                          <span className="text-slate-400 font-light">{d.expectedClose}</span>
                        </div>

                        {/* Stage transition controls */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-850">
                          {st.key !== 'Discovery' && (
                            <button
                              onClick={() => {
                                const idx = stages.findIndex(s => s.key === st.key);
                                if (idx > 0) moveDealStage(d.id, stages[idx - 1].key);
                              }}
                              className="text-[9px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                            >
                              ← Back
                            </button>
                          )}
                          {st.key !== 'Won' && st.key !== 'Lost' && (
                            <button
                              onClick={() => {
                                const idx = stages.findIndex(s => s.key === st.key);
                                if (idx < stages.length - 1) moveDealStage(d.id, stages[idx + 1].key);
                              }}
                              className="text-[9px] text-indigo-500 font-bold hover:underline ml-auto flex items-center gap-0.5 cursor-pointer"
                            >
                              Next Stage →
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Database table view */}
        <InplaceCrud configs={configs} defaultTab={currentView.tab} hideTabs={true} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="text-indigo-500">{currentView.icon}</div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">{currentView.label}</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">
            Isolated operations tracking and record setup database.
          </p>
        </div>
      </div>
      <InplaceCrud configs={configs} defaultTab={currentView.tab} hideTabs={true} />
    </div>
  );
}
