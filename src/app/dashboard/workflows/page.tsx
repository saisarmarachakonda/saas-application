'use client';

import React from 'react';
import InplaceCrud, { ModelConfig } from '@/components/crud/InplaceCrud';
import { Network } from 'lucide-react';

export default function WorkflowsPage() {
  const configs: ModelConfig[] = [
    {
      name: 'workflowinstance',
      label: 'Approval Workflows',
      fields: [
        {
          name: 'module',
          label: 'Operations Module',
          type: 'select',
          required: true,
          options: [
            { label: 'CRM Sales Quotation', value: 'CRM' },
            { label: 'Procurement Purchases', value: 'Procurement' },
            { label: 'Finance Disbursements', value: 'Finance' },
          ],
        },
        { name: 'entityId', label: 'Associated Record ID', type: 'text', required: true },
        { name: 'entityName', label: 'Reference Document Code (e.g. PO-001)', type: 'text', required: true },
        { name: 'currentStep', label: 'Active Workflow Step', type: 'text', required: true },
        {
          name: 'assignedRole',
          label: 'Active Assignee Role',
          type: 'select',
          required: true,
          options: [
            { label: 'CFO Office', value: 'CFO' },
            { label: 'Department Head', value: 'DepartmentHead' },
            { label: 'System Administrator', value: 'Admin' },
          ],
        },
        {
          name: 'status',
          label: 'Workflow Status',
          type: 'select',
          required: true,
          options: [
            { label: 'In Progress (Active)', value: 'In Progress' },
            { label: 'Approved (Closed)', value: 'Approved' },
            { label: 'Rejected (Closed)', value: 'Rejected' },
            { label: 'Escalated (Urgent)', value: 'Escalated' },
          ],
        },
        { name: 'slaHours', label: 'SLA Duration Limit (Hours)', type: 'number', required: true },
        { name: 'escalated', label: 'SLA Escalation Flag Triggered', type: 'boolean' },
      ],
      columns: ['entityName', 'module', 'currentStep', 'assignedRole', 'status', 'slaHours', 'escalated'],
    },
    {
      name: 'workflowlog',
      label: 'Approval Action History',
      fields: [
        { name: 'workflowInstanceId', label: 'Parent Workflow Job', type: 'select', refModel: 'workflowInstance', refLabelField: 'entityName', required: true },
        { name: 'step', label: 'Action Step Name', type: 'text', required: true },
        {
          name: 'action',
          label: 'Executed Decision',
          type: 'select',
          required: true,
          options: [
            { label: 'Approved & Signed', value: 'Approved' },
            { label: 'Rejected / Returned', value: 'Rejected' },
            { label: 'Accrual Escalation Triggered', value: 'Escalated' },
            { label: 'Comment Attachment added', value: 'Commented' },
          ],
        },
        { name: 'comment', label: 'Audit Comment / Remark', type: 'textarea' },
        { name: 'performedBy', label: 'Authorized Action Performed By', type: 'text', required: true },
      ],
      columns: ['workflowInstanceId', 'step', 'action', 'comment', 'performedBy'],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Network className="w-6 h-6 text-indigo-500" />
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Workflow Automation Engine</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">
            Monitor multi-level approval stages, check SLA deadlines, inspect escalated jobs, and view decision audit tracks.
          </p>
        </div>
      </div>

      {/* Workflow Visual Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SLA Breach Status */}
        <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Workflow Job SLA Status</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Telemetry tracking SLA compliance</p>
          </div>
          <div className="space-y-3 mt-3">
            {[
              { status: 'SLA Compliant (Safe)', count: 28, pct: 85, color: 'bg-emerald-500' },
              { status: 'Near Breach Limit', count: 4, pct: 12, color: 'bg-amber-500' },
              { status: 'SLA Breached (Escalated)', count: 1, pct: 3, color: 'bg-red-500' }
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-slate-500">{item.status}</span>
                  <span className="text-slate-950 dark:text-white">{item.count} Jobs ({item.pct}%)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-850 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Workflow Module Volume */}
        <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Workflow Volume by Module</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Active approval pipelines distribution</p>
          </div>
          <div className="flex items-center justify-around py-2 gap-4 mt-2">
            <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(148, 163, 184, 0.1)" strokeWidth="3" />
                {/* Procurement (55%): indigo */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#6366f1" strokeWidth="3" strokeDasharray="55 45" strokeDashoffset="0" />
                {/* CRM (30%): cyan */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#06b6d4" strokeWidth="3" strokeDasharray="30 70" strokeDashoffset="-55" />
                {/* Finance (15%): slate */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#64748b" strokeWidth="3" strokeDasharray="15 85" strokeDashoffset="-85" />
              </svg>
              <div className="absolute text-center">
                <span className="text-sm font-extrabold text-slate-850 dark:text-white leading-none">33</span>
                <p className="text-[7px] uppercase tracking-widest text-slate-450 mt-0.5">Jobs</p>
              </div>
            </div>
            <div className="space-y-1.5 text-[10px] w-full max-w-[150px]">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-850">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span className="text-slate-500">Procurement</span>
                </div>
                <span className="font-bold">55%</span>
              </div>
              <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-850">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-500" />
                  <span className="text-slate-500">CRM Sales</span>
                </div>
                <span className="font-bold">30%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-500" />
                  <span className="text-slate-500">Finance</span>
                </div>
                <span className="font-bold">15%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <InplaceCrud configs={configs} defaultTab="workflowinstance" />
    </div>
  );
}
