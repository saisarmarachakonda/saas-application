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

      <InplaceCrud configs={configs} defaultTab="purchaserequisition" />
    </div>
  );
}
