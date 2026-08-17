'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import SettingsPage from '../page';
import InplaceCrud, { ModelConfig } from '@/components/crud/InplaceCrud';
import { Sliders, Grid, Key, Copy, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';

export default function SettingsViewPage() {
  const { view } = useParams() as { view: string };

  const [apiKey, setApiKey] = useState('voc_live_sec_99a842f701c4e92b8d1');
  const [copied, setCopied] = useState(false);
  const [keyFeedback, setKeyFeedback] = useState('');

  const generateNewKey = () => {
    const newKey = 'voc_live_sec_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 10);
    setApiKey(newKey);
    setKeyFeedback('New Production API Key secret generated. Previous tokens invalidated.');
    setTimeout(() => setKeyFeedback(''), 3500);
  };

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (view === 'general') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-6 h-6 text-slate-500" />
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Feature Preference & System Settings</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">
                Configure system features toggle preferences and operational defaults flags.
              </p>
            </div>
          </div>
        </div>

        {/* Enterprise API Keys Pro Station */}
        <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-transparent space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-indigo-500" />
              <span>Production API Keys & REST Integration Secret</span>
            </h3>
            <span className="text-[10px] uppercase font-bold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded">
              High Security Scope
            </span>
          </div>

          {keyFeedback && (
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{keyFeedback}</span>
            </div>
          )}

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 overflow-hidden">
              <span className="text-[10px] font-bold uppercase text-slate-400 shrink-0">Live Secret Token:</span>
              <code className="text-xs font-mono font-bold text-indigo-500 truncate">{apiKey}</code>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={copyKey}
                className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied!' : 'Copy Key'}</span>
              </button>
              <button
                onClick={generateNewKey}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Rotate Secret Key</span>
              </button>
            </div>
          </div>
        </div>

        <SettingsPage initialView="general" />
      </div>
    );
  }

  if (view === 'approval-matrix') {
    const configs: ModelConfig[] = [
      {
        name: 'approvalmatrix',
        label: 'Approval Matrix Limits Rules',
        fields: [
          {
            name: 'module',
            label: 'Target Operations Module',
            type: 'select',
            required: true,
            options: [
              { label: 'Procurement Spend Limit', value: 'Procurement' },
              { label: 'CRM Sales Quotation Value', value: 'CRM' },
              { label: 'Warehouse Safety Alert Thresholds', value: 'Inventory' },
            ],
          },
          { name: 'amountLimit', label: 'Authorized Limit Amount ($)', type: 'number', required: true },
          {
            name: 'approvedByRole',
            label: 'Required Sign-off Role',
            type: 'select',
            required: true,
            options: [
              { label: 'System Admin Access', value: 'Admin' },
              { label: 'Department Head Level', value: 'DepartmentHead' },
            ],
          },
          { name: 'isActive', label: 'Status Active', type: 'boolean' },
        ],
        columns: ['module', 'amountLimit', 'approvedByRole', 'isActive'],
      }
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Grid className="w-6 h-6 text-slate-550" />
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Approval Limit Matrix</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">
              Establish release thresholds and verify sign-off workflows bounds.
            </p>
          </div>
        </div>
        <InplaceCrud configs={configs} defaultTab="approvalmatrix" hideTabs={true} />
      </div>
    );
  }

  return <div className="p-8 text-center text-slate-500">Settings View '{view}' not found.</div>;
}
