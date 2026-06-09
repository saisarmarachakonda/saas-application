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

      <InplaceCrud configs={configs} defaultTab="lead" />
    </div>
  );
}
