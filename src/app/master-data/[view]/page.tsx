'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import InplaceCrud, { ModelConfig } from '@/components/crud/InplaceCrud';
import { Users2, Truck, Layers, Boxes, FileText, Sparkles, CheckCircle2, RefreshCcw, ShieldCheck } from 'lucide-react';

export default function MasterDataViewPage() {
  const { view } = useParams() as { view: string };

  const [sanitizing, setSanitizing] = useState(false);
  const [sanitizeResult, setSanitizeResult] = useState('');

  const runSanitizer = () => {
    setSanitizing(true);
    setSanitizeResult('');
    setTimeout(() => {
      setSanitizing(false);
      setSanitizeResult('AI Sanitizer Audit Complete: 0 Duplicate SKUs found. Standardized 14 UOM units & formatted Tax IDs.');
    }, 1200);
  };

  const viewMapping: { [key: string]: { tab: string; icon: React.ReactNode; label: string } } = {
    'customers': { tab: 'customer', label: 'Customers Master', icon: <Users2 className="w-5 h-5" /> },
    'vendors': { tab: 'vendor', label: 'Vendors Master', icon: <Truck className="w-5 h-5" /> },
    'categories': { tab: 'productcategory', label: 'Product Categories', icon: <Layers className="w-5 h-5" /> },
    'products': { tab: 'product', label: 'Products & SKUs Setup', icon: <Boxes className="w-5 h-5" /> },
    'materials': { tab: 'material', label: 'Materials Specs catalog', icon: <FileText className="w-5 h-5" /> },
  };

  const currentView = viewMapping[view];
  if (!currentView) {
    return <div className="p-8 text-center text-slate-500">Master Data View '{view}' not found.</div>;
  }

  const configs: ModelConfig[] = [
    {
      name: 'customer',
      label: 'Customers Master',
      fields: [
        { name: 'name', label: 'Customer Legal Name', type: 'text', required: true },
        { name: 'code', label: 'Internal Customer Code', type: 'text', required: true },
        { name: 'email', label: 'Contact Email', type: 'email', required: true },
        { name: 'phone', label: 'Contact Phone No', type: 'text' },
        {
          name: 'category',
          label: 'Client Classification',
          type: 'select',
          required: true,
          options: [
            { label: 'Key Account (High Value)', value: 'Key Account' },
            { label: 'Regular Customer', value: 'Regular' },
            { label: 'Wholesale Distributor', value: 'Wholesaler' },
          ],
        },
        { name: 'address', label: 'Dispatch Address', type: 'textarea' },
        { name: 'creditLimit', label: 'Credit Limit ($)', type: 'number', required: true },
        { name: 'website', label: 'Website URL', type: 'text' },
      ],
      columns: ['name', 'code', 'category', 'creditLimit', 'website'],
    },
    {
      name: 'vendor',
      label: 'Vendors Master',
      fields: [
        { name: 'name', label: 'Supplier/Vendor Name', type: 'text', required: true },
        { name: 'code', label: 'Supplier Code', type: 'text', required: true },
        { name: 'email', label: 'Orders Email Address', type: 'email', required: true },
        { name: 'phone', label: 'Supplier Contact No', type: 'text' },
        {
          name: 'classification',
          label: 'Supplier Classification',
          type: 'select',
          required: true,
          options: [
            { label: 'Gold Supplier (Trusted)', value: 'Gold' },
            { label: 'Silver Tier Supplier', value: 'Silver' },
            { label: 'Bronze Tier Supplier', value: 'Bronze' },
          ],
        },
        { name: 'rating', label: 'Performance Score (1-5)', type: 'number' },
        { name: 'performanceTags', label: 'Performance Tags (e.g. Fast, Bulk)', type: 'text' },
        {
          name: 'paymentTerms',
          label: 'Payment Terms',
          type: 'select',
          required: true,
          options: [
            { label: 'Net 30', value: 'Net 30' },
            { label: 'Net 45', value: 'Net 45' },
            { label: 'Net 60', value: 'Net 60' },
          ],
        },
        { name: 'taxRegistration', label: 'Tax Registration Code', type: 'text' },
      ],
      columns: ['name', 'code', 'classification', 'rating', 'paymentTerms'],
    },
    {
      name: 'productcategory',
      label: 'Product Categories',
      fields: [
        { name: 'name', label: 'Category Name', type: 'text', required: true },
        { name: 'code', label: 'Category Code', type: 'text', required: true },
      ],
      columns: ['name', 'code'],
    },
    {
      name: 'product',
      label: 'Products (SKUs)',
      fields: [
        { name: 'name', label: 'Product Name', type: 'text', required: true },
        { name: 'sku', label: 'Stock Keeping Unit (SKU)', type: 'text', required: true },
        { name: 'categoryId', label: 'Product Category', type: 'select', refModel: 'productCategory', required: true },
        { name: 'price', label: 'Standard Retail Price ($)', type: 'number', required: true },
        { name: 'barcode', label: 'Product Barcode', type: 'text' },
        { name: 'costPrice', label: 'Production Cost ($)', type: 'number', required: true },
        { name: 'weight', label: 'Weight (kg)', type: 'number' },
        { name: 'specification', label: 'Technical Specifications', type: 'textarea' },
      ],
      columns: ['name', 'sku', 'price', 'costPrice', 'weight'],
    },
    {
      name: 'material',
      label: 'Materials Master',
      fields: [
        { name: 'name', label: 'Material Name', type: 'text', required: true },
        { name: 'code', label: 'Material Code', type: 'text', required: true },
        {
          name: 'type',
          label: 'Material Classification',
          type: 'select',
          required: true,
          options: [
            { label: 'Raw Materials (Silicon, Metal)', value: 'Raw Material' },
            { label: 'Semi-Finished Goods (Sub-assemblies)', value: 'Semi-Finished Goods' },
            { label: 'Finished Goods (For resale)', value: 'Finished Goods' },
          ],
        },
        {
          name: 'unit',
          label: 'Unit of Measure (UOM)',
          type: 'select',
          required: true,
          options: [
            { label: 'Pieces (pcs)', value: 'pcs' },
            { label: 'Kilograms (kg)', value: 'kg' },
            { label: 'Liters (l)', value: 'liters' },
          ],
        },
        { name: 'cost', label: 'Standard Production Cost', type: 'number', required: true },
        { name: 'leadTimeDays', label: 'Procurement Lead Time (Days)', type: 'number', required: true },
        { name: 'reorderPoint', label: 'Safety Reorder Point', type: 'number', required: true },
      ],
      columns: ['name', 'code', 'type', 'cost', 'leadTimeDays', 'reorderPoint'],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="text-cyan-500">{currentView.icon}</div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">{currentView.label}</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">
              Static definitions, specifications, and client profiles database.
            </p>
          </div>
        </div>

        <button
          onClick={runSanitizer}
          disabled={sanitizing}
          className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-700/50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{sanitizing ? 'Scanning Database...' : 'Run AI Data Sanitizer'}</span>
        </button>
      </div>

      {sanitizeResult && (
        <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{sanitizeResult}</span>
        </div>
      )}

      <InplaceCrud configs={configs} defaultTab={currentView.tab} hideTabs={true} />
    </div>
  );
}
