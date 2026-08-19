'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import erpData from '@/data/erp_live_data.json';
import { BarChartWidget, DonutChartWidget } from '@/components/dashboard/ModuleDashboardCharts';
import {
  Layers,
  Boxes,
  TrendingUp,
  Cpu,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Download,
  Filter,
  Search,
  Plus,
  RefreshCw,
  Sliders,
  BarChart3,
  Factory,
  GitPullRequest,
  Building2,
  DollarSign,
  ShieldCheck,
  FileText,
  Printer,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { downloadPdfDocument } from '@/lib/pdfGenerator';

export default function OpsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'planning' | 'sync'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // Pagination State for 364 Records
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  const handleSyncERP = () => {
    setSyncStatus('Synchronizing MRP ledgers and plant capacity registers...');
    setTimeout(() => {
      setSyncStatus('Success: Vertex Ops database fully synchronized across 4 multi-plant nodes.');
      setTimeout(() => setSyncStatus(null), 5000);
    }, 1200);
  };

  const handleExportERP = () => {
    const docData = {
      code: 'OPS-SUMMARY-2026',
      name: 'Vertex Ops Audit',
      designation: 'MRP & Capacity Manager',
      department: 'Vertex Ops Control',
      site: 'Global Multi-Plant Network',
      phone: '+91 9876543210',
      aadhaar: 'OPS-AUDIT-PASSED',
      pan: 'CORP-PAN-OPS',
      uan: '100099990000',
      esi: 'ACTIVE OPS SYNC',
      bank: 'OPS-LEDGER-ACC-01',
      ifsc: 'SBIN0009999',
      joiningDate: '2026-08-06',
      status: 'Synchronized'
    };
    downloadPdfDocument('Vertex Ops Planning', docData);
  };

  const filteredOrders = erpData.filter((wo: any) => {
    const matchesSearch = wo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          wo.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          wo.plant.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === 'active') return matchesSearch && wo.status === 'In Production';
    if (activeTab === 'planning') return matchesSearch && (wo.status === 'Scheduled' || wo.status === 'Planned');
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center text-blue-500 shrink-0 border border-blue-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Vertex Ops Core Module</span>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-blue-500 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                {erpData.length} Live Records
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">
              Operations Control Plane, Material Requirements Scheduling, Production Lines &amp; Plant Capacity.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleSyncERP}
            className="px-3.5 py-2 bg-blue-600 hover:bg-transparent text-white hover:text-blue-600 border border-blue-600 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Ops Engine</span>
          </button>
          <button
            onClick={handleExportERP}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-transparent text-white hover:text-emerald-600 border border-emerald-600 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Vertex Ops PDF</span>
          </button>
        </div>
      </div>

      {/* Sync Status Banner */}
      {syncStatus && (
        <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-blue-500" />
          <span>{syncStatus}</span>
        </div>
      )}

      {/* 4 Core KPI Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Vertex Ops Orders</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Factory className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{erpData.length} <span className="text-xs font-normal text-slate-400">Orders</span></h3>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-green-500 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Active across 8 Enterprise Plants</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">MRP Inventory Requirement</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">₹ 148.65 L</h3>
            <span className="text-[11px] text-purple-500 font-semibold block mt-0.5">
              99.2% Material Allocated
            </span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Plant Capacity Utilization</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">92.4%</h3>
            <span className="text-[11px] text-emerald-500 font-semibold block mt-0.5">
              Optimal Throughput Efficiency
            </span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Ops Ledger Sync SLA</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">100.0%</h3>
            <span className="text-[11px] text-amber-500 font-semibold block mt-0.5">
              Real-time Double-Entry Posting
            </span>
          </div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <BarChartWidget
          title="Plant Work Order Schedule & Load"
          subtitle="Work order volume by manufacturing plant facility"
          data={[
            { label: 'Plant #1 Houston', value: 84, color: '#2563eb' },
            { label: 'Plant #2 Chicago', value: 72, color: '#6366f1' },
            { label: 'Plant #3 Seattle', value: 68, color: '#06b6d4' },
            { label: 'Plant #4 Dallas', value: 55, color: '#10b981' },
            { label: 'Plant #5 Austin', value: 85, color: '#f59e0b' },
          ]}
          unit=""
        />
        <DonutChartWidget
          title="MRP Material Allocation Status"
          subtitle="Stock reservation status for active work orders"
          slices={[
            { label: 'Cleared for Production', value: 240, color: '#10b981' },
            { label: 'Material Reserved', value: 85, color: '#3b82f6' },
            { label: 'Reorder Exception', value: 39, color: '#ef4444' },
          ]}
          totalLabel="Total Work Orders"
        />
      </div>

      {/* Main Work Orders Table */}
      <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Factory className="w-4 h-4 text-blue-500" />
              <span>Vertex Ops Work Order Schedule ({filteredOrders.length} Records)</span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-light mt-0.5">
              Multi-plant capacity scheduling, material allocation balances, and cost center routing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                placeholder="Search work order or plant..."
                className="pl-8 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs rounded-lg outline-none focus:border-blue-500 w-52"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-850 rounded-lg text-xs font-semibold">
              <button
                onClick={() => { setActiveTab('all'); setCurrentPage(1); }}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${activeTab === 'all' ? 'bg-white dark:bg-slate-800 shadow-xs text-blue-600 dark:text-white' : 'text-slate-500'}`}
              >
                All ({erpData.length})
              </button>
              <button
                onClick={() => { setActiveTab('active'); setCurrentPage(1); }}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${activeTab === 'active' ? 'bg-white dark:bg-slate-800 shadow-xs text-blue-600 dark:text-white' : 'text-slate-500'}`}
              >
                In Production
              </button>
              <button
                onClick={() => { setActiveTab('planning'); setCurrentPage(1); }}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${activeTab === 'planning' ? 'bg-white dark:bg-slate-800 shadow-xs text-blue-600 dark:text-white' : 'text-slate-500'}`}
              >
                Scheduled
              </button>
            </div>

            {/* Rows Per Page */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-400 text-[10px] font-bold uppercase">Rows:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs outline-none font-semibold"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto rounded-lg border border-slate-200/60 dark:border-slate-800/80">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 bg-slate-100 dark:bg-slate-900 z-10 border-b border-slate-200 dark:border-slate-800">
              <tr className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Work Order ID</th>
                <th className="py-3 px-3">Product Item Name</th>
                <th className="py-3 px-3">Manufacturing Plant</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Completion %</th>
                <th className="py-3 px-3">MRP Status</th>
                <th className="py-3 px-3">Cost Center</th>
                <th className="py-3 px-3">Estimated Value</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
              {paginatedOrders.map((wo: any) => (
                <tr key={wo.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-850/50 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-blue-500">{wo.id}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white whitespace-nowrap">{wo.name}</td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-350 whitespace-nowrap">{wo.plant}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      wo.status === 'In Production' ? 'bg-green-500/10 text-green-500' :
                      wo.status === 'Scheduled' ? 'bg-blue-500/10 text-blue-500' :
                      'bg-purple-500/10 text-purple-500'
                    }`}>
                      {wo.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-bold text-slate-700 dark:text-slate-300">{wo.priority}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-blue-600">{wo.progress}%</td>
                  <td className="py-2.5 px-3 text-[10px] font-semibold text-indigo-500">{wo.mrpBalance}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-500">{wo.costCenter}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{wo.val}</td>
                  <td className="py-2.5 px-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => downloadPdfDocument('Work_Order_' + wo.id, {
                        code: wo.id,
                        name: wo.name,
                        designation: 'Plant Engineer',
                        department: wo.costCenter,
                        site: wo.plant,
                        phone: '+91 9876543210',
                        aadhaar: 'WO-AUDIT-OK',
                        pan: 'WO-PAN-01',
                        uan: '100099991111',
                        esi: wo.mrpBalance,
                        bank: wo.val,
                        ifsc: 'SBIN0001234',
                        joiningDate: '2026-08-06',
                        status: wo.status
                      })}
                      className="px-2 py-1 bg-blue-600 hover:bg-transparent text-white hover:text-blue-600 border border-blue-600 text-[10px] font-bold rounded cursor-pointer transition-all"
                    >
                      Export PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 pt-2">
          <span>Showing <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> to <strong>{Math.min(currentPage * itemsPerPage, filteredOrders.length)}</strong> of <strong>{filteredOrders.length}</strong> matching records</span>

          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="p-1.5 border border-slate-200 dark:border-slate-800 rounded-lg disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-slate-900 dark:text-white px-2">Page {currentPage} of {totalPages || 1}</span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="p-1.5 border border-slate-200 dark:border-slate-800 rounded-lg disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
