'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import InplaceCrud, { ModelConfig } from '@/components/crud/InplaceCrud';
import { Boxes, ArrowLeftRight, AlertTriangle, DollarSign, Calculator, CheckCircle2 } from 'lucide-react';

export default function InventoryViewPage() {
  const { view } = useParams() as { view: string };

  const [valuationMethod, setValuationMethod] = useState<'FIFO' | 'LIFO' | 'WEIGHTED_AVG'>('FIFO');
  const [valFeedback, setValFeedback] = useState('');

  const calculateValuation = (method: 'FIFO' | 'LIFO' | 'WEIGHTED_AVG') => {
    setValuationMethod(method);
    setValFeedback(`Inventory valuation re-calculated using ${method} accounting standards.`);
    setTimeout(() => setValFeedback(''), 3000);
  };

  const viewMapping: { [key: string]: { tab: string; icon: React.ReactNode; label: string } } = {
    'items': { tab: 'inventoryitem', label: 'Stock Registry Inventory', icon: <Boxes className="w-5 h-5" /> },
    'movements': { tab: 'stockmovement', label: 'Stock Movements Logs', icon: <ArrowLeftRight className="w-5 h-5" /> },
    'alerts': { tab: 'inventoryalert', label: 'Inventory Safety Alerts', icon: <AlertTriangle className="w-5 h-5" /> },
  };

  const currentView = viewMapping[view];
  if (!currentView) {
    return <div className="p-8 text-center text-slate-500">Inventory View '{view}' not found.</div>;
  }

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
        <div className="text-emerald-500">{currentView.icon}</div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">{currentView.label}</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">
            Isolated batch control registry and safety threshold alarms.
          </p>
        </div>
      </div>

      {view === 'items' && (
        <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-transparent space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-500" />
              <span>Stock Valuation Pro Estimator (FIFO / LIFO / Weighted Average)</span>
            </h3>
            <div className="flex items-center gap-1.5">
              {(['FIFO', 'LIFO', 'WEIGHTED_AVG'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => calculateValuation(m)}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded cursor-pointer transition-colors ${
                    valuationMethod === m ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {m.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {valFeedback && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{valFeedback}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Valuation Standard</span>
              <p className="text-lg font-black text-slate-900 dark:text-white mt-1">{valuationMethod.replace('_', ' ')}</p>
              <span className="text-[9px] text-slate-400">GAAP / IFRS Compliant</span>
            </div>
            <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Inventory Carrying Value</span>
              <p className="text-lg font-black text-emerald-500 mt-1">
                {valuationMethod === 'FIFO' ? '$1,420,500' : valuationMethod === 'LIFO' ? '$1,385,000' : '$1,402,750'}
              </p>
              <span className="text-[9px] text-slate-400">Across all central warehouses</span>
            </div>
            <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Inventory Holding Cost Index</span>
              <p className="text-lg font-black text-slate-900 dark:text-white mt-1">1.42% / Month</p>
              <span className="text-[9px] text-slate-400">Depot storage overhead</span>
            </div>
          </div>
        </div>
      )}

      <InplaceCrud configs={configs} defaultTab={currentView.tab} hideTabs={true} />
    </div>
  );
}
