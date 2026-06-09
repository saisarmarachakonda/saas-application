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

      <InplaceCrud configs={configs} defaultTab="workflowinstance" />
    </div>
  );
}
