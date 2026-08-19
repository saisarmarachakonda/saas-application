'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import InplaceCrud, { ModelConfig } from '@/components/crud/InplaceCrud';
import {
  Layers,
  Boxes,
  Factory,
  Sliders,
  BarChart3,
  GitPullRequest,
  CheckCircle2,
  Download,
  Search,
  Filter,
  ShieldCheck,
  RefreshCw,
  DollarSign
} from 'lucide-react';
import { downloadPdfDocument } from '@/lib/pdfGenerator';

export default function ERPViewPage() {
  const { view } = useParams() as { view: string };
  const [searchTerm, setSearchTerm] = useState('');

  const configs: ModelConfig[] = [
    {
      name: 'erpRecord',
      label: 'Vertex Ops Resource Master',
      fields: [
        { name: 'id', label: 'Work Order Code', type: 'text', required: true },
        { name: 'name', label: 'Material / Product Item Name', type: 'text', required: true },
        { name: 'plant', label: 'Plant Facility Node', type: 'text', required: true },
        { name: 'costCenter', label: 'Cost Center Ledger', type: 'text' },
        { name: 'mrpBalance', label: 'Ops Allocation Balance', type: 'text' },
        { name: 'status', label: 'Production Status', type: 'text' },
      ],
      columns: ['id', 'name', 'plant', 'costCenter', 'mrpBalance', 'status'],
    }
  ];

  const handleExportView = () => {
    downloadPdfDocument(`VERTEX_OPS_${view.toUpperCase()}_REPORT`, {
      code: `OPS-${view.toUpperCase()}-2026`,
      name: `Vertex Ops ${view.toUpperCase()} Audit`,
      designation: 'Enterprise Auditor',
      department: 'Vertex Ops Control',
      site: 'Multi-Plant Node',
      phone: '+91 9876543210',
      aadhaar: 'AUDIT-PASSED',
      pan: 'CORP-PAN',
      uan: '100099990000',
      esi: 'ACTIVE',
      bank: 'OPS-LEDGER-ACC',
      ifsc: 'SBIN0009999',
      joiningDate: '2026-08-06',
      status: 'Synchronized'
    });
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 border border-blue-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white capitalize flex items-center gap-2">
              <span>Vertex Ops {view.replace('-', ' ')} Control</span>
              <span className="text-[10px] uppercase font-extrabold text-blue-500 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                Vertex Ops Sub-Module
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">
              Material Requirements Planning and resource allocation registers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportView}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export View PDF</span>
          </button>
        </div>
      </div>

      {/* CRUD Engine */}
      <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <InplaceCrud configs={configs} defaultTab="erpRecord" hideTabs={true} />
      </div>
    </div>
  );
}
