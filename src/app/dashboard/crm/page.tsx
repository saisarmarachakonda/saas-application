'use client';

import React from 'react';
import InplaceCrud, { ModelConfig } from '@/components/crud/InplaceCrud';
import { Users2 } from 'lucide-react';

export default function CRMPage() {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Users2 className="w-6 h-6 text-indigo-500" />
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">CRM & Quotation Management</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">
            Monitor client acquisition, capture RFQs, calculate quotations, and track sales order fulfillment.
          </p>
        </div>
      </div>

      {/* CRM Visual Analytics Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lead Source Acquisition */}
        <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Acquisition Channels</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Distribution of lead sources</p>
          </div>
          <div className="flex items-center justify-around py-2 gap-4 mt-2">
            <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                {/* Background Circle */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(148, 163, 184, 0.1)" strokeWidth="3" />
                {/* Referral (40%): color indigo */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#6366f1" strokeWidth="3" strokeDasharray="40 60" strokeDashoffset="0" />
                {/* Website (35%): color cyan */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#06b6d4" strokeWidth="3" strokeDasharray="35 65" strokeDashoffset="-40" />
                {/* Trade Show (15%): color amber */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="15 85" strokeDashoffset="-75" />
                {/* Outreach (10%): color slate */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#64748b" strokeWidth="3" strokeDasharray="10 90" strokeDashoffset="-90" />
              </svg>
              <div className="absolute text-center">
                <span className="text-sm font-extrabold text-slate-850 dark:text-white leading-none">124</span>
                <p className="text-[7px] uppercase tracking-widest text-slate-450 mt-0.5">Leads</p>
              </div>
            </div>
            <div className="space-y-1.5 text-[10px] w-full max-w-[150px]">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-850">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span className="text-slate-500">Referrals</span>
                </div>
                <span className="font-bold">40%</span>
              </div>
              <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-850">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-500" />
                  <span className="text-slate-500">Website</span>
                </div>
                <span className="font-bold">35%</span>
              </div>
              <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-850">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-slate-500">Trade Shows</span>
                </div>
                <span className="font-bold">15%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-500" />
                  <span className="text-slate-500">Outreach</span>
                </div>
                <span className="font-bold">10%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pipeline Value by Stage */}
        <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Active Opportunity Value</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Deal pipeline breakdown by stage</p>
          </div>
          <div className="space-y-2.5 mt-2">
            {[
              { stage: 'Discovery', val: 45, max: 120, color: 'bg-slate-400 dark:bg-slate-700' },
              { stage: 'Proposal', val: 95, max: 120, color: 'bg-indigo-500' },
              { stage: 'Negotiation', val: 65, max: 120, color: 'bg-cyan-500' },
              { stage: 'Closed Won', val: 120, max: 120, color: 'bg-emerald-500' }
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-slate-500">{item.stage}</span>
                  <span className="text-slate-900 dark:text-white">${item.val}K</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-850 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${(item.val / item.max) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <InplaceCrud configs={configs} defaultTab="lead" />
    </div>
  );
}
