'use client';

import React from 'react';
import InplaceCrud, { ModelConfig } from '@/components/crud/InplaceCrud';
import { ShoppingCart } from 'lucide-react';

export default function ProcurementPage() {
  const configs: ModelConfig[] = [
    {
      name: 'purchaserequisition',
      label: 'Material Requisitions',
      fields: [
        { name: 'title', label: 'Requisition Title', type: 'text', required: true },
        { name: 'departmentName', label: 'Requesting Department', type: 'text', required: true },
        { name: 'requestedBy', label: 'Requested By', type: 'text', required: true },
        { name: 'itemDetails', label: 'Required Material SKU & Quantities', type: 'textarea', required: true },
        { name: 'estimatedCost', label: 'Estimated Cost ($)', type: 'number', required: true },
        {
          name: 'status',
          label: 'Authorization Status',
          type: 'select',
          required: true,
          options: [
            { label: 'Draft Requisition', value: 'Draft' },
            { label: 'Awaiting Authorization', value: 'Pending Approval' },
            { label: 'Requisition Approved', value: 'Approved' },
            { label: 'Requisition Rejected', value: 'Rejected' },
            { label: 'Purchase Order Placed', value: 'Ordered' },
          ],
        },
      ],
      columns: ['title', 'departmentName', 'estimatedCost', 'status'],
    },
    {
      name: 'rfqprocurement',
      label: 'Vendor RFQs',
      fields: [
        { name: 'title', label: 'RFQ Scope/Title', type: 'text', required: true },
        { name: 'vendorId', label: 'Target Supplier', type: 'select', refModel: 'vendor', required: true },
        { name: 'dueDate', label: 'Bids Closing Date', type: 'date', required: true },
        {
          name: 'status',
          label: 'Bidding Status',
          type: 'select',
          required: true,
          options: [
            { label: 'RFQ Sent to Supplier', value: 'Sent' },
            { label: 'Bids Received', value: 'Received' },
            { label: 'Bids Evaluated (Closed)', value: 'Evaluated' },
          ],
        },
        { name: 'comparativeDetails', label: 'Comparative Bid Evaluation Notes', type: 'textarea' },
      ],
      columns: ['title', 'vendorId', 'status', 'dueDate'],
    },
    {
      name: 'purchaseorder',
      label: 'Purchase Orders (PO)',
      fields: [
        { name: 'poNumber', label: 'PO Number (PO-...)', type: 'text', required: true },
        { name: 'vendorId', label: 'Awarded Supplier', type: 'select', refModel: 'vendor', required: true },
        { name: 'value', label: 'Purchase Contract Value ($)', type: 'number', required: true },
        {
          name: 'status',
          label: 'Approval/Shipping Status',
          type: 'select',
          required: true,
          options: [
            { label: 'Pending Approval Limit', value: 'Pending' },
            { label: 'PO Approved & Active', value: 'Approved' },
            { label: 'Items Shipped by Vendor', value: 'Shipped' },
            { label: 'Goods Received (Closed)', value: 'Received' },
            { label: 'PO Cancelled', value: 'Cancelled' },
          ],
        },
      ],
      columns: ['poNumber', 'vendorId', 'value', 'status'],
    },
    {
      name: 'goodsreceipt',
      label: 'Goods Receipt (GRN)',
      fields: [
        { name: 'grnNumber', label: 'GRN Serial Number (GRN-...)', type: 'text', required: true },
        { name: 'purchaseOrderId', label: 'Linked Purchase Order', type: 'select', refModel: 'purchaseOrder', refLabelField: 'poNumber', required: true },
        { name: 'verifiedBy', label: 'Quality Verified By', type: 'text', required: true },
        { name: 'verificationDetails', label: 'Material Quality Inspection Notes', type: 'textarea' },
        {
          name: 'status',
          label: 'Material Matching Status',
          type: 'select',
          required: true,
          options: [
            { label: 'Fully Verified & Accepted', value: 'Verified' },
            { label: 'Quantity Discrepancy Found', value: 'Discrepancy' },
            { label: 'Lot Rejected (Damaged)', value: 'Rejected' },
          ],
        },
        { name: 'receivedDate', label: 'Received Date', type: 'date', required: true },
      ],
      columns: ['grnNumber', 'purchaseOrderId', 'verifiedBy', 'receivedDate', 'status'],
    },
    {
      name: 'supplierscorecard',
      label: 'Supplier Scorecards',
      fields: [
        { name: 'vendorId', label: 'Supplier/Vendor Name', type: 'select', refModel: 'vendor', required: true },
        { name: 'qualityScore', label: 'Material Quality Index (0-100)', type: 'number', required: true },
        { name: 'deliveryScore', label: 'On-Time Delivery Index (0-100)', type: 'number', required: true },
        { name: 'costScore', label: 'Price Competitiveness Index (0-100)', type: 'number', required: true },
        { name: 'overallScore', label: 'Calculated Aggregate Rating', type: 'number', required: true },
        { name: 'period', label: 'Evaluation Period (e.g. Q1-2026)', type: 'text', required: true },
      ],
      columns: ['vendorId', 'overallScore', 'period'],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <ShoppingCart className="w-6 h-6 text-indigo-500" />
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Procurement Management</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">
            Manage material requisitions, compare supplier proposals, generate POs, and verify arrivals with Goods Receipts.
          </p>
        </div>
      </div>

      {/* Procurement Visual Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Supplier Ratings Score */}
        <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Supplier Performance Index</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Calculated overall QA/delivery scorecard</p>
          </div>
          <div className="space-y-3.5 mt-3">
            {[
              { supplier: 'Infosys Technologies', rating: 93.67, color: 'bg-indigo-500' },
              { supplier: 'Jindal Steel & Power', rating: 92.00, color: 'bg-cyan-500' }
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-slate-500">{item.supplier}</span>
                  <span className="text-slate-950 dark:text-white">{item.rating.toFixed(2)}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-850 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.rating}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Purchase Requisitions Breakdown */}
        <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Requisition Status Distribution</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Authorization states breakdown</p>
          </div>
          <div className="flex items-center justify-around py-2 gap-4 mt-2">
            <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(148, 163, 184, 0.1)" strokeWidth="3" />
                {/* Approved (50%): green */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="50 50" strokeDashoffset="0" />
                {/* Pending (30%): amber */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="30 70" strokeDashoffset="-50" />
                {/* Draft/Others (20%): slate */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#64748b" strokeWidth="3" strokeDasharray="20 80" strokeDashoffset="-80" />
              </svg>
              <div className="absolute text-center">
                <span className="text-sm font-extrabold text-slate-850 dark:text-white leading-none">12</span>
                <p className="text-[7px] uppercase tracking-widest text-slate-450 mt-0.5">Reqs</p>
              </div>
            </div>
            <div className="space-y-1.5 text-[10px] w-full max-w-[150px]">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-850">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-slate-500">Approved</span>
                </div>
                <span className="font-bold">50%</span>
              </div>
              <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-850">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-slate-500">Pending</span>
                </div>
                <span className="font-bold">30%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-500" />
                  <span className="text-slate-500">Draft/Other</span>
                </div>
                <span className="font-bold">20%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <InplaceCrud configs={configs} defaultTab="purchaserequisition" />
    </div>
  );
}
