'use client';

import React from 'react';
import InplaceCrud, { ModelConfig } from '@/components/crud/InplaceCrud';
import { Database } from 'lucide-react';

export default function MasterDataPage() {
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
      ],
      columns: ['name', 'code', 'category', 'email'],
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
      ],
      columns: ['name', 'code', 'classification', 'rating'],
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
        { name: 'price', label: 'Standard Retail Price', type: 'number', required: true },
        { name: 'specification', label: 'Technical Specifications', type: 'textarea' },
      ],
      columns: ['name', 'sku', 'categoryId', 'price'],
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
      ],
      columns: ['name', 'code', 'type', 'unit', 'cost'],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Database className="w-6 h-6 text-indigo-500" />
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Master Data Repository</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">
            Register and manage customer profiles, suppliers catalogs, SKUs, and material cost specs.
          </p>
        </div>
      </div>

      <InplaceCrud configs={configs} defaultTab="customer" />
    </div>
  );
}
