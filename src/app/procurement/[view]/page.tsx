'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import InplaceCrud, { ModelConfig } from '@/components/crud/InplaceCrud';
import { FileSignature, MailOpen, FileCheck, ClipboardCheck, Award, ShieldAlert, CheckCircle2, XCircle, Search } from 'lucide-react';

interface ThreeWayMatch {
  poNumber: string;
  vendor: string;
  poAmount: number;
  grnQtyVerified: number;
  grnQtyOrdered: number;
  invoiceAmount: number;
  status: 'MATCHED' | 'DISCREPANCY' | 'PENDING_INVOICE';
}

export default function ProcurementViewPage() {
  const { view } = useParams() as { view: string };

  const [audits, setAudits] = useState<ThreeWayMatch[]>([
    { poNumber: 'PO-2026-081', vendor: 'Jindal Steel & Power', poAmount: 48500, grnQtyOrdered: 500, grnQtyVerified: 500, invoiceAmount: 48500, status: 'MATCHED' },
    { poNumber: 'PO-2026-084', vendor: 'Schneider Electric', poAmount: 12000, grnQtyOrdered: 100, grnQtyVerified: 85, invoiceAmount: 12000, status: 'DISCREPANCY' },
    { poNumber: 'PO-2026-089', vendor: 'Infosys Hardware', poAmount: 32400, grnQtyOrdered: 150, grnQtyVerified: 150, invoiceAmount: 33800, status: 'DISCREPANCY' },
  ]);

  const [auditFeedback, setAuditFeedback] = useState('');

  const resolveAudit = (poNumber: string, action: 'APPROVE' | 'REJECT') => {
    const updated = audits.map(a => a.poNumber === poNumber ? { ...a, status: action === 'APPROVE' ? 'MATCHED' as const : 'DISCREPANCY' as const } : a);
    setAudits(updated);
    setAuditFeedback(`Audit record for ${poNumber} marked as ${action === 'APPROVE' ? 'Approved for Payment' : 'Rejected for Clarification'}.`);
    setTimeout(() => setAuditFeedback(''), 3500);
  };

  const viewMapping: { [key: string]: { tab: string; icon: React.ReactNode; label: string } } = {
    'requisitions': { tab: 'purchaserequisition', label: 'Material Requisitions', icon: <FileSignature className="w-5 h-5" /> },
    'rfqs': { tab: 'rfqprocurement', label: 'Vendor RFQs Bidding', icon: <MailOpen className="w-5 h-5" /> },
    'orders': { tab: 'purchaseorder', label: 'Purchase Orders (PO)', icon: <FileCheck className="w-5 h-5" /> },
    'receipts': { tab: 'goodsreceipt', label: 'Goods Receipts (GRN)', icon: <ClipboardCheck className="w-5 h-5" /> },
    'scorecards': { tab: 'supplierscorecard', label: 'Supplier Performance Scorecards', icon: <Award className="w-5 h-5" /> },
  };

  const currentView = viewMapping[view];
  if (!currentView) {
    return <div className="p-8 text-center text-slate-500">Procurement View '{view}' not found.</div>;
  }

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
        <div className="text-orange-500">{currentView.icon}</div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">{currentView.label}</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">
            Isolated material supply tracking and supplier compliance matrix database.
          </p>
        </div>
      </div>

      {/* Interactive 3-Way Matching Auditor for Orders or Receipts */}
      {(view === 'receipts' || view === 'orders') && (
        <div className="space-y-4">
          <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs bg-gradient-to-r from-orange-500/5 via-amber-500/5 to-transparent">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-orange-500" />
                <span>Automated 3-Way Matching Audit (PO vs GRN vs Vendor Invoice)</span>
              </h3>
              <span className="text-[10px] uppercase font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded">
                Pre-Payment Safety Check
              </span>
            </div>

            {auditFeedback && (
              <div className="p-3 mb-3 bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{auditFeedback}</span>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase">
                    <th className="py-2.5">PO Ref</th>
                    <th className="py-2.5">Vendor Name</th>
                    <th className="py-2.5">PO Contract ($)</th>
                    <th className="py-2.5">GRN Delivery Qty</th>
                    <th className="py-2.5">Vendor Billed ($)</th>
                    <th className="py-2.5">Audit Outcome</th>
                    <th className="py-2.5 text-right">Verification Action</th>
                  </tr>
                </thead>
                <tbody>
                  {audits.map(item => {
                    const qtyVariance = item.grnQtyOrdered - item.grnQtyVerified;
                    const priceVariance = item.invoiceAmount - item.poAmount;

                    return (
                      <tr key={item.poNumber} className="border-b border-slate-100 dark:border-slate-850 text-slate-700 dark:text-slate-300">
                        <td className="py-3 font-bold uppercase">{item.poNumber}</td>
                        <td className="py-3 font-semibold">{item.vendor}</td>
                        <td className="py-3">${item.poAmount.toLocaleString()}</td>
                        <td className="py-3">
                          {item.grnQtyVerified} / {item.grnQtyOrdered} units
                          {qtyVariance > 0 && <span className="ml-1 text-[10px] text-red-500 font-bold">(-{qtyVariance} short)</span>}
                        </td>
                        <td className="py-3">
                          ${item.invoiceAmount.toLocaleString()}
                          {priceVariance > 0 && <span className="ml-1 text-[10px] text-red-500 font-bold">(+${priceVariance} extra)</span>}
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                            item.status === 'MATCHED'
                              ? 'bg-green-500/10 text-green-500'
                              : 'bg-red-500/10 text-red-500'
                          }`}>
                            {item.status === 'MATCHED' ? '100% Matched' : 'Variance Detected'}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          {item.status === 'DISCREPANCY' ? (
                            <button
                              onClick={() => resolveAudit(item.poNumber, 'APPROVE')}
                              className="px-2.5 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded text-[10px] font-bold transition-colors cursor-pointer"
                            >
                              Override & Authorize
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-semibold">Verified Safe</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <InplaceCrud configs={configs} defaultTab={currentView.tab} hideTabs={true} />
    </div>
  );
}
