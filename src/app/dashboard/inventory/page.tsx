'use client';

import React from 'react';
import InplaceCrud, { ModelConfig } from '@/components/crud/InplaceCrud';
import { Boxes } from 'lucide-react';

export default function InventoryPage() {
  const configs: ModelConfig[] = [
    {
      name: 'inventoryitem',
      label: 'Stock Registry',
      fields: [
        { name: 'warehouseId', label: 'Warehouse Location', type: 'select', refModel: 'warehouse', required: true },
        { name: 'materialName', label: 'Material Name', type: 'text', required: true },
        { name: 'sku', label: 'Material SKU', type: 'text', required: true },
        { name: 'quantity', label: 'Available Stock Quantity', type: 'number', required: true },
        {
          name: 'unit',
          label: 'Unit of Measure',
          type: 'select',
          required: true,
          options: [
            { label: 'Pieces (pcs)', value: 'pcs' },
            { label: 'Kilograms (kg)', value: 'kg' },
            { label: 'Liters (l)', value: 'liters' },
          ],
        },
        { name: 'batchNumber', label: 'Batch/Lot Number', type: 'text' },
        { name: 'qrCode', label: 'QR Identification Code', type: 'text' },
        { name: 'minAlertQty', label: 'Minimum Safety Level (Alert)', type: 'number', required: true },
        { name: 'maxAlertQty', label: 'Maximum Storage Limit (Alert)', type: 'number', required: true },
      ],
      columns: ['sku', 'materialName', 'warehouseId', 'quantity', 'unit', 'batchNumber'],
    },
    {
      name: 'stockmovement',
      label: 'Stock Movements',
      fields: [
        { name: 'materialName', label: 'Material Name', type: 'text', required: true },
        { name: 'sku', label: 'Material SKU', type: 'text', required: true },
        { name: 'quantity', label: 'Transaction Quantity', type: 'number', required: true },
        {
          name: 'type',
          label: 'Transaction Type',
          type: 'select',
          required: true,
          options: [
            { label: 'Stock Inward (GRN/Purchase)', value: 'Stock Inward' },
            { label: 'Stock Outward (Production/Sales)', value: 'Stock Outward' },
            { label: 'Stock Transfer (Inter-depot)', value: 'Stock Transfer' },
          ],
        },
        { name: 'fromWarehouse', label: 'From Depot (Optional)', type: 'text' },
        { name: 'toWarehouse', label: 'To Depot (Optional)', type: 'text' },
        { name: 'referenceNo', label: 'Reference Document No (GRN/WO)', type: 'text' },
        { name: 'date', label: 'Movement Date', type: 'date', required: true },
      ],
      columns: ['sku', 'type', 'quantity', 'fromWarehouse', 'toWarehouse', 'date', 'referenceNo'],
    },
    {
      name: 'inventoryalert',
      label: 'Inventory Alerts',
      fields: [
        { name: 'sku', label: 'Material SKU', type: 'text', required: true },
        { name: 'materialName', label: 'Material Name', type: 'text', required: true },
        {
          name: 'type',
          label: 'Threshold Alert Type',
          type: 'select',
          required: true,
          options: [
            { label: 'Low Stock Alert (Restock)', value: 'Low Stock' },
            { label: 'Overstock Alert (High Storage)', value: 'Overstock' },
          ],
        },
        { name: 'quantity', label: 'Current Quantity', type: 'number', required: true },
        { name: 'threshold', label: 'Trigger Threshold Level', type: 'number', required: true },
        {
          name: 'status',
          label: 'Alert Status',
          type: 'select',
          required: true,
          options: [
            { label: 'Active Warning', value: 'Active' },
            { label: 'Warning Resolved', value: 'Resolved' },
          ],
        },
      ],
      columns: ['sku', 'materialName', 'type', 'quantity', 'threshold', 'status'],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Boxes className="w-6 h-6 text-indigo-500" />
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Inventory & Warehouse Management</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">
            Monitor real-time bin storage levels, track inter-depot material movements, and resolve threshold safety warnings.
          </p>
        </div>
      </div>

      {/* Inventory Visual Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Warehouse Capacity Utilization */}
        <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Warehouse Storage Utilization</h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Cubic capacity volume tracking</p>
          <div className="grid grid-cols-2 gap-4 mt-4 text-center">
            <div className="space-y-2">
              <div className="relative h-20 w-8 mx-auto bg-slate-100 dark:bg-slate-850 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
                <div className="absolute bottom-0 w-full bg-indigo-500 rounded-b-lg" style={{ height: '78%' }} />
              </div>
              <p className="text-[10px] font-bold text-slate-900 dark:text-white">Chicago Depot</p>
              <p className="text-[9px] text-slate-500 font-semibold">78% Filled</p>
            </div>
            <div className="space-y-2">
              <div className="relative h-20 w-8 mx-auto bg-slate-100 dark:bg-slate-850 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
                <div className="absolute bottom-0 w-full bg-cyan-500 rounded-b-lg" style={{ height: '42%' }} />
              </div>
              <p className="text-[10px] font-bold text-slate-900 dark:text-white">Houston Vault</p>
              <p className="text-[9px] text-slate-500 font-semibold">42% Filled</p>
            </div>
          </div>
        </div>

        {/* Stock Allocation by UOM */}
        <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Stock Allocation by UOM</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Material units distribution</p>
          </div>
          <div className="space-y-3 mt-3">
            {[
              { unit: 'Pieces (pcs)', count: 1850, pct: 60, color: 'bg-indigo-500' },
              { unit: 'Kilograms (kg)', count: 920, pct: 30, color: 'bg-cyan-500' },
              { unit: 'Liters (l)', count: 310, pct: 10, color: 'bg-slate-500' }
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-slate-500">{item.unit}</span>
                  <span className="text-slate-950 dark:text-white">{item.count.toLocaleString()} units ({item.pct}%)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-850 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <InplaceCrud configs={configs} defaultTab="inventoryitem" />
    </div>
  );
}
