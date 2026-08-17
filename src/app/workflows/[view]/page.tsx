'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import InplaceCrud, { ModelConfig } from '@/components/crud/InplaceCrud';
import { PlayCircle, History, CheckCircle2, XCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

interface WorkflowJob {
  id: string;
  docCode: string;
  module: string;
  step: string;
  assigneeRole: string;
  status: 'In Progress' | 'Approved' | 'Rejected' | 'Escalated';
  hoursRemaining: number;
}

export default function WorkflowsViewPage() {
  const { view } = useParams() as { view: string };

  const [activeJobs, setActiveJobs] = useState<WorkflowJob[]>([
    { id: 'wf-1', docCode: 'PO-2026-081', module: 'Procurement Spend', step: 'CFO Final Approval', assigneeRole: 'CFO Office', status: 'In Progress', hoursRemaining: 4 },
    { id: 'wf-2', docCode: 'QT-2026-042', module: 'CRM Sales Value', step: 'Dept Head Review', assigneeRole: 'Department Head', status: 'Escalated', hoursRemaining: 0 },
    { id: 'wf-3', docCode: 'GRN-2026-019', module: 'Inventory Threshold', step: 'QA Safety Signoff', assigneeRole: 'System Admin', status: 'In Progress', hoursRemaining: 18 },
  ]);

  const [wfFeedback, setWfFeedback] = useState('');

  const executeJobDecision = (jobId: string, decision: 'Approved' | 'Rejected' | 'Escalated') => {
    const updated = activeJobs.map(j => j.id === jobId ? { ...j, status: decision } : j);
    setActiveJobs(updated);
    setWfFeedback(`Decision executed: Job ${jobId} status updated to ${decision}. Logged to audit track.`);
    setTimeout(() => setWfFeedback(''), 3500);
  };

  const viewMapping: { [key: string]: { tab: string; icon: React.ReactNode; label: string } } = {
    'instances': { tab: 'workflowinstance', label: 'Active Workflow Jobs', icon: <PlayCircle className="w-5 h-5" /> },
    'logs': { tab: 'workflowlog', label: 'Workflow Action History Logs', icon: <History className="w-5 h-5" /> },
  };

  const currentView = viewMapping[view];
  if (!currentView) {
    return <div className="p-8 text-center text-slate-500">Workflows View '{view}' not found.</div>;
  }

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
        <div className="text-pink-500">{currentView.icon}</div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">{currentView.label}</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">
            Isolated approval nodes execution tracks and compliance logs.
          </p>
        </div>
      </div>

      {view === 'instances' && (
        <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-transparent space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-pink-500" />
              <span>Manager Decision & Sign-off Console</span>
            </h3>
            <span className="text-[10px] uppercase font-bold text-pink-500 bg-pink-500/10 px-2 py-0.5 rounded">
              Active Pending Jobs
            </span>
          </div>

          {wfFeedback && (
            <div className="p-3 bg-pink-500/10 border border-pink-500/20 text-pink-600 dark:text-pink-400 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{wfFeedback}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeJobs.map(job => (
              <div key={job.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-900 dark:text-white">{job.docCode}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                    job.status === 'Approved' ? 'bg-green-500/10 text-green-500' :
                    job.status === 'Escalated' ? 'bg-red-500/10 text-red-500' :
                    job.status === 'Rejected' ? 'bg-slate-500/10 text-slate-500' :
                    'bg-amber-500/10 text-amber-500'
                  }`}>
                    {job.status}
                  </span>
                </div>

                <div className="text-[11px] space-y-1 text-slate-600 dark:text-slate-400 font-light">
                  <div className="flex justify-between"><span>Module:</span><span className="font-semibold text-slate-800 dark:text-slate-200">{job.module}</span></div>
                  <div className="flex justify-between"><span>Step:</span><span className="font-semibold text-slate-800 dark:text-slate-200">{job.step}</span></div>
                  <div className="flex justify-between"><span>Role:</span><span className="font-semibold text-slate-800 dark:text-slate-200">{job.assigneeRole}</span></div>
                  <div className="flex justify-between"><span>SLA SLA Window:</span><span className="font-bold text-pink-500">{job.hoursRemaining}h remaining</span></div>
                </div>

                {job.status === 'In Progress' || job.status === 'Escalated' ? (
                  <div className="grid grid-cols-2 gap-2 border-t border-slate-100 dark:border-slate-850 pt-2">
                    <button
                      onClick={() => executeJobDecision(job.id, 'Approved')}
                      className="py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => executeJobDecision(job.id, 'Rejected')}
                      className="py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <XCircle className="w-3 h-3" />
                      <span>Reject</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-center text-[10px] text-slate-400 font-semibold border-t border-slate-100 dark:border-slate-850 pt-2">
                    Workflow Node Closed
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <InplaceCrud configs={configs} defaultTab={currentView.tab} hideTabs={true} />
    </div>
  );
}
