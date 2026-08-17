'use client';

import React from 'react';
import InplaceCrud, { ModelConfig } from '@/components/crud/InplaceCrud';
import { GitFork } from 'lucide-react';

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
        <GitFork className="w-6 h-6 text-pink-500" />
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Workflow Automation Engine</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">
            Monitor multi-level approval stages, check SLA deadlines, inspect escalated jobs, and view decision audit tracks.
          </p>
        </div>
      </div>

      {/* Workflow Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                  <span className="text-slate-955 dark:text-white">{item.count} Jobs ({item.pct}%)</span>
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
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#6366f1" strokeWidth="3" strokeDasharray="55 45" strokeDashoffset="0" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#06b6d4" strokeWidth="3" strokeDasharray="30 70" strokeDashoffset="-55" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#64748b" strokeWidth="3" strokeDasharray="15 85" strokeDashoffset="-85" />
              </svg>
              <div className="absolute text-center">
                <span className="text-sm font-extrabold text-slate-850 dark:text-white leading-none">33</span>
                <p className="text-[7px] uppercase tracking-widest text-slate-450 mt-0.5">Jobs</p>
              </div>
            </div>
            <div className="space-y-1.5 text-[10px] w-full max-w-[150px]">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-855">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span className="text-slate-500">Procurement</span>
                </div>
                <span className="font-bold">55%</span>
              </div>
              <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-855">
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

        {/* Visual Workflow Steps Path Map */}
        <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-xs flex flex-col justify-between bg-gradient-to-br from-pink-500/5 to-transparent">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Active Pipeline Route Map</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Substation procurement validation track</p>
          </div>
          <div className="flex items-center justify-between gap-1 py-3 relative mt-2">
            <div className="absolute inset-x-4 top-[50%] h-[1.5px] border-t border-dashed border-pink-500/30 -translate-y-1/2 z-0" />
            <div className="absolute left-[20%] top-[50%] -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-pink-500/50 animate-ping z-0" />
            <div className="absolute left-[50%] top-[50%] -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-indigo-500/50 animate-ping z-0" />

            <div className="z-10 bg-white dark:bg-slate-900 border border-pink-500/40 rounded-xl p-1.5 shadow-md text-center shrink-0 w-16">
              <span className="text-[8px] font-black uppercase text-pink-500 block leading-tight">Pending</span>
              <span className="text-[7px] text-slate-400 block mt-0.5 leading-none">Draft Req</span>
            </div>
            
            <div className="z-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1.5 shadow-md text-center shrink-0 w-16">
              <span className="text-[8px] font-black uppercase text-slate-550 dark:text-slate-350 block leading-tight">Review</span>
              <span className="text-[7px] text-slate-400 block mt-0.5 leading-none">Dept Head</span>
            </div>

            <div className="z-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1.5 shadow-md text-center shrink-0 w-16">
              <span className="text-[8px] font-black uppercase text-slate-550 dark:text-slate-350 block leading-tight">Verify</span>
              <span className="text-[7px] text-slate-400 block mt-0.5 leading-none">SLA Limit</span>
            </div>

            <div className="z-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1.5 shadow-md text-center shrink-0 w-16">
              <span className="text-[8px] font-black uppercase text-slate-550 dark:text-slate-350 block leading-tight">Release</span>
              <span className="text-[7px] text-slate-400 block mt-0.5 leading-none">CFO Post</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
