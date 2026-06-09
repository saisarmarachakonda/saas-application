'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import RecentNavigations from '@/components/dashboard/RecentNavigations';
import {
  TrendingUp,
  ShoppingCart,
  Package,
  AlertTriangle,
  Users2,
  Clock,
  CheckCircle,
  FileText,
  Activity,
  ArrowRight,
  TrendingDown,
  Layers,
  Sparkles,
  Search,
  Settings,
  Truck,
  Wrench,
  ShieldAlert,
  Bot
} from 'lucide-react';

interface ExecutiveDashboardShellProps {
  initialSalesOrders: any[];
  initialQuotations: any[];
  initialPurchaseOrders: any[];
  initialInventoryItems: any[];
  initialInventoryAlerts: any[];
  customerCount: number;
  vendorCount: number;
  recentLogs: any[];
}

export default function ExecutiveDashboardShell({
  initialSalesOrders,
  initialQuotations,
  initialPurchaseOrders,
  initialInventoryItems,
  initialInventoryAlerts,
  customerCount,
  vendorCount,
  recentLogs
}: ExecutiveDashboardShellProps) {
  const [activeTab, setActiveTab] = useState('management');
  const [aiInsightsOpen, setAiInsightsOpen] = useState(false);
  const [aiText, setAiText] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [activeChart, setActiveChart] = useState<'line' | 'bar'>('line');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Tab calculations
  const totalSalesVal = initialSalesOrders.reduce((sum, order) => sum + order.value, 0);
  const pendingSalesCount = initialSalesOrders.filter(o => o.status === 'Pending' || o.status === 'Processing').length;
  const pendingQuotations = initialQuotations.filter(q => q.status === 'Draft' || q.status === 'Sent').length;
  const totalPOVal = initialPurchaseOrders.reduce((sum, po) => sum + po.value, 0);
  const pendingPOApprovalCount = initialPurchaseOrders.filter(po => po.status === 'Pending').length;
  const lowStockCount = initialInventoryAlerts.filter(a => a.type === 'Low Stock').length;

  // 1. Production Mock Data
  const productionOrders = [
    { id: 'WO-2026-0001', material: 'Galvanized Steel Sheets', qty: 250, status: 'In Progress', progress: 65, line: 'Assembly Line A' },
    { id: 'WO-2026-0002', material: 'Stainless Steel Pipes', qty: 120, status: 'Planning', progress: 0, line: 'Heavy Machining' },
    { id: 'WO-2026-0003', material: 'Brass Coupling Joints', qty: 500, status: 'Completed', progress: 100, line: 'Precision Assembly' },
    { id: 'WO-2026-0004', material: 'High Tensile Bolts', qty: 1000, status: 'Delayed', progress: 40, line: 'Forging Unit 2' },
  ];

  // 2. Quality Mock Data
  const qualityInspections = [
    { id: 'QA-2026-0091', batch: 'BT-STEEL-09', material: 'Galvanized Steel Sheets', checked: 50, rejected: 2, status: 'Passed', inspector: 'M. Sharma' },
    { id: 'QA-2026-0092', batch: 'BT-COUP-41', material: 'Brass Coupling Joints', checked: 100, rejected: 12, status: 'Failed', inspector: 'S. Iyer' },
    { id: 'QA-2026-0093', batch: 'BT-PIPE-12', material: 'Stainless Steel Pipes', checked: 20, rejected: 0, status: 'Passed', inspector: 'P. Patel' },
  ];

  // 3. Dispatch Mock Data
  const dispatchOrders = [
    { id: 'DSP-2026-001', customer: 'SpaceX Orbital', orderRef: 'SO-0001', items: 'Brass Coupling Joints x500', status: 'Pending Dispatch', courier: 'BlueDart Express' },
    { id: 'DSP-2026-002', customer: 'Wayne Corp', orderRef: 'SO-0002', items: 'Stainless Steel Pipes x80', status: 'Delivered', courier: 'Delhivery Logistics' },
    { id: 'DSP-2026-003', customer: 'Tesla Energy', orderRef: 'SO-0003', items: 'Galvanized Steel Sheets x200', status: 'Transit', courier: 'DTDC Freight' },
  ];

  // AI Copilot context-aware operational summaries
  const triggerAiInsights = () => {
    setAiLoading(true);
    setAiInsightsOpen(true);
    setTimeout(() => {
      setAiLoading(false);
      switch (activeTab) {
        case 'management':
          setAiText(`[AI Copilot Management Summary]
- Operational Health: Overall network is stable. Current aggregate revenue is ₹${totalSalesVal.toLocaleString('en-IN')}.
- Critical Action: 1 Safety Alert is active in Chicago Warehouse (Low stock for SKU: MAT-STL-02).
- Bottleneck Warning: 1 production work order is delayed at Forging Unit 2 due to raw steel shipment delay.`);
          break;
        case 'sales':
          setAiText(`[AI Copilot Sales Summary]
- Pipeline Health: Sales conversion rate stands at 68%. Total active pipeline value is estimated at ₹${(totalSalesVal * 1.5).toLocaleString('en-IN')}.
- Actions Needed: Re-evaluate ${pendingQuotations} pending quotations sent to SpaceX and Tesla. Convert Draft quote Q-0002 to Sales Order.`);
          break;
        case 'procurement':
          setAiText(`[AI Copilot Procurement Summary]
- PO Clearance: ${pendingPOApprovalCount} Purchase Order(s) awaiting validation. PO-2026-0002 exceeds $1,000 limit and requires Admin authorization.
- Supplier Health: Tata Steel Ltd scorecard stands at 92.8%. Delay detected on raw carbon ingot receipt.`);
          break;
        case 'inventory':
          setAiText(`[AI Copilot Inventory Summary]
- Available SKUs: ${initialInventoryItems.length} active inventory items cataloged.
- Safety Thresholds: ${lowStockCount} safety alerts active. SKU 'Galvanized Steel Sheet' is at 80 kg against a minimum safety threshold of 150 kg.`);
          break;
        case 'production':
          setAiText(`[AI Copilot Production Summary]
- Capacity Utilization: Assembly lines running at 82.5% load.
- Bottleneck Alert: Work Order WO-2026-0004 (High Tensile Bolts) is flagged DELAYED at Forging Unit 2. Recommendation: Re-allocate carbon bars from Houston Vault.`);
          break;
        case 'quality':
          setAiText(`[AI Copilot Quality Summary]
- Defect Rate: Rejection rate on Brass Coupling Joints (batch BT-COUP-41) spiked to 12% due to thread tolerances.
- Recommendation: Issue calibrator check on Precision Assembly line. 2 inspections passed successfully.`);
          break;
        case 'dispatch':
          setAiText(`[AI Copilot Dispatch Summary]
- Fulfillment: 1 order pending dispatch (SpaceX - Coupling Joints). BlueDart courier pickup is scheduled.
- Delivered status: SO-0002 delivered to Wayne Corp via Delhivery Logistics.`);
          break;
        default:
          setAiText('Connected to telemetry. Select a tab to generate details.');
      }
    }, 800);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Executive Control Panel</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-light mt-0.5">
            Aggregated operational indicators across CRM, procurement, production, quality, and logistics.
          </p>
        </div>

        {/* AI Insight Trigger & Status */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={triggerAiInsights}
            className="px-3.5 py-1.5 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-2 transition-colors shadow-xs"
          >
            <Bot className="w-4 h-4" />
            <span>AI Copilot Analysis</span>
          </button>
          <div className="text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-1.5 rounded-lg flex items-center gap-2 select-none">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Database Synchronized</span>
          </div>
        </div>
      </div>

      {/* Recent Navigations Bar */}
      <RecentNavigations />

      {/* Tab Switcher Grid */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-0.5 gap-2 scrollbar-none">
        {[
          { id: 'management', label: 'Management Overview' },
          { id: 'sales', label: 'Sales & Quotes' },
          { id: 'procurement', label: 'Procurement Dashboard' },
          { id: 'inventory', label: 'Inventory Logistics' },
          { id: 'production', label: 'Production Status' },
          { id: 'quality', label: 'Quality Control' },
          { id: 'dispatch', label: 'Dispatch & Delivery' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              if (aiInsightsOpen) {
                // Instantly update AI insights text if drawer is open
                setTimeout(() => triggerAiInsights(), 10);
              }
            }}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 ${
              activeTab === tab.id
                ? 'border-indigo-500 text-indigo-650 dark:text-indigo-400 font-extrabold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-850 hover:border-slate-350'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* AI INSIGHTS DRAWER PANEL */}
      {aiInsightsOpen && (
        <div className="glass-card p-4 rounded-xl border border-indigo-550/20 bg-indigo-500/5 dark:bg-indigo-500/5 relative overflow-hidden transition-all duration-300">
          <div className="absolute top-3 right-3">
            <button onClick={() => setAiInsightsOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold uppercase">Close</button>
          </div>
          <div className="flex items-center gap-2 mb-2 text-indigo-650 dark:text-indigo-400">
            <Sparkles className="w-4 h-4 animate-spin [animation-duration:3s]" />
            <h4 className="text-xs font-extrabold uppercase tracking-wider">AI Operations Analyst Insights</h4>
          </div>
          <div className="text-xs font-mono whitespace-pre-wrap leading-relaxed text-slate-700 dark:text-slate-300">
            {aiLoading ? (
              <div className="flex items-center gap-2 py-1 text-slate-450 italic">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                <span>Aggregating active operational database variables...</span>
              </div>
            ) : (
              aiText
            )}
          </div>
        </div>
      )}

      {/* TAB 1: MANAGEMENT OVERVIEW */}
      {activeTab === 'management' && (
        <div className="space-y-6">
          {/* Main KPI Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-xs relative overflow-hidden group hover:scale-[1.02] hover:shadow-md hover:shadow-indigo-500/5 transition-all duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest">Total Sales Revenue</p>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mt-2">₹{totalSalesVal.toLocaleString('en-IN')}</h3>
                  <p className="text-[9px] text-green-500 font-bold mt-1.5 flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3 animate-pulse" /> +14.2% versus Q1
                  </p>
                </div>
                <div className="w-9 h-9 rounded-lg bg-indigo-550/10 text-indigo-500 flex items-center justify-center shrink-0 shadow-xs border border-indigo-550/10"><TrendingUp className="w-4 h-4" /></div>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-indigo-650" />
            </div>

            <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-xs relative overflow-hidden group hover:scale-[1.02] hover:shadow-md hover:shadow-orange-500/5 transition-all duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-slate-455 dark:text-slate-500 uppercase tracking-widest">Procurement Spend</p>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mt-2">₹{totalPOVal.toLocaleString('en-IN')}</h3>
                  <p className="text-[9px] text-amber-500 font-semibold mt-1.5 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-500" /> <span>{pendingPOApprovalCount} POs await approval</span>
                  </p>
                </div>
                <div className="w-9 h-9 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0 border border-orange-500/10"><ShoppingCart className="w-4 h-4" /></div>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-orange-650" />
            </div>

            <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-xs relative overflow-hidden group hover:scale-[1.02] hover:shadow-md hover:shadow-rose-500/5 transition-all duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-slate-455 dark:text-slate-500 uppercase tracking-widest">Inventory SKUs</p>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mt-2">{initialInventoryItems.length} SKUs</h3>
                  <p className="text-[9px] text-rose-500 font-bold mt-1.5 flex items-center gap-0.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500 animate-bounce" /> {lowStockCount} safety alerts active
                  </p>
                </div>
                <div className="w-9 h-9 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0 border border-rose-500/10"><Package className="w-4 h-4" /></div>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-rose-650" />
            </div>

            <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-xs relative overflow-hidden group hover:scale-[1.02] hover:shadow-md hover:shadow-cyan-500/5 transition-all duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-slate-455 dark:text-slate-500 uppercase tracking-widest">CRM Accounts</p>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mt-2">{customerCount} Accounts</h3>
                  <p className="text-[9px] text-cyan-500 font-semibold mt-1.5 flex items-center gap-1">
                    <Users2 className="w-3.5 h-3.5 text-cyan-500" /> <span>{pendingQuotations} active RFQs evaluating</span>
                  </p>
                </div>
                <div className="w-9 h-9 rounded-lg bg-cyan-500/10 text-cyan-500 flex items-center justify-center shrink-0 border border-cyan-500/10"><Users2 className="w-4 h-4" /></div>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-cyan-650" />
            </div>
          </div>

          {/* Activity logs & Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Custom SVG Line Chart */}
            <div className="lg:col-span-2 glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 relative flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Revenue vs Spend Analytics</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-450 font-light mt-0.5">Telemetry metrics for the current fiscal period (INR Lakhs)</p>
                </div>

                {/* Chart Segment Select */}
                <div className="flex bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200/50 dark:border-slate-800">
                  <button
                    onClick={() => setActiveChart('line')}
                    className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-md transition-all ${
                      activeChart === 'line' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs' : 'text-slate-455 dark:text-slate-450'
                    }`}
                  >
                    Area Curve
                  </button>
                  <button
                    onClick={() => setActiveChart('bar')}
                    className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-md transition-all ${
                      activeChart === 'bar' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs' : 'text-slate-455 dark:text-slate-455'
                    }`}
                  >
                    Zebra Bars
                  </button>
                </div>
              </div>

              {/* Chart Legend */}
              <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider mb-2 text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1.5 rounded-sm bg-indigo-600" />
                  <span>Gross revenue</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1.5 rounded-sm bg-emerald-500" />
                  <span>Procured costs</span>
                </div>
              </div>
              
              {/* Custom SVG Charts with gradients */}
              <div className="h-56 w-full relative pt-2">
                <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  <line x1="35" y1="20" x2="575" y2="20" stroke="rgba(148, 163, 184, 0.12)" strokeWidth="0.8" strokeDasharray="3" />
                  <line x1="35" y1="70" x2="575" y2="70" stroke="rgba(148, 163, 184, 0.12)" strokeWidth="0.8" strokeDasharray="3" />
                  <line x1="35" y1="120" x2="575" y2="120" stroke="rgba(148, 163, 184, 0.12)" strokeWidth="0.8" strokeDasharray="3" />
                  <line x1="35" y1="170" x2="575" y2="170" stroke="rgba(148, 163, 184, 0.12)" strokeWidth="0.8" strokeDasharray="3" />

                  {/* Y Axis Labels */}
                  <text x="5" y="24" fill="#94a3b8" className="text-[9px] font-bold font-mono">120L</text>
                  <text x="5" y="74" fill="#94a3b8" className="text-[9px] font-bold font-mono">80L</text>
                  <text x="5" y="124" fill="#94a3b8" className="text-[9px] font-bold font-mono">40L</text>
                  <text x="5" y="174" fill="#94a3b8" className="text-[9px] font-bold font-mono">0L</text>

                  {/* X Axis Labels */}
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, idx) => (
                    <text key={idx} x={50 + idx * 100} y="195" fill="#94a3b8" className="text-[9px] font-bold text-center uppercase tracking-wider">{month}</text>
                  ))}

                  {/* Draw Chart Types */}
                  {activeChart === 'line' ? (
                    <>
                      {/* Area Under Curves */}
                      <path d="M 50 126.25 L 150 110 L 250 92.5 L 350 96.25 L 450 68.75 L 550 38.75 L 550 170 L 50 170 Z" fill="url(#revenueGrad)" />
                      <path d="M 50 139.4 L 150 128 L 250 115.75 L 350 118.4 L 450 99.2 L 550 78.1 L 550 170 L 50 170 Z" fill="url(#spendGrad)" />

                      {/* Stroke Lines */}
                      <path d="M 50 126.25 L 150 110 L 250 92.5 L 350 96.25 L 450 68.75 L 550 38.75" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" />
                      <path d="M 50 139.4 L 150 128 L 250 115.75 L 350 118.4 L 450 99.2 L 550 78.1" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />

                      {/* Dots on nodes */}
                      {[35, 48, 62, 59, 81, 105].map((val, idx) => {
                        const cx = 50 + idx * 100;
                        const cy = 170 - (val / 120) * 150;
                        const isHovered = hoveredIdx === idx;
                        return (
                          <circle
                            key={idx}
                            cx={cx}
                            cy={cy}
                            r={isHovered ? 5.5 : 3.5}
                            fill={isHovered ? 'var(--primary-hover)' : 'var(--primary)'}
                            stroke="white"
                            strokeWidth="1.5"
                            className="transition-all duration-150"
                          />
                        );
                      })}
                    </>
                  ) : (
                    /* Zebra Bar Chart */
                    [35, 48, 62, 59, 81, 105].map((val, idx) => {
                      const startX = 35 + idx * 100;
                      const revHeight = (val / 120) * 150;
                      const spendHeight = revHeight * 0.7;
                      return (
                        <g key={idx}>
                          <rect x={startX} y={170 - revHeight} width="14" height={revHeight} fill="var(--primary)" rx="2" className="hover:opacity-85 transition-opacity" />
                          <rect x={startX + 18} y={170 - spendHeight} width="14" height={spendHeight} fill="var(--accent)" rx="2" className="hover:opacity-85 transition-opacity" />
                        </g>
                      );
                    })
                  )}

                  {/* Horizontal Baseline */}
                  <line x1="35" y1="170" x2="575" y2="170" stroke="rgba(148, 163, 184, 0.4)" strokeWidth="1" />

                  {/* Invisible hover zones for tooltip triggers */}
                  {[35, 48, 62, 59, 81, 105].map((val, idx) => (
                    <rect
                      key={idx}
                      x={20 + idx * 100}
                      y="10"
                      width="60"
                      height="160"
                      fill="transparent"
                      className="cursor-crosshair"
                      onMouseEnter={() => setHoveredIdx(idx)}
                      onMouseLeave={() => setHoveredIdx(null)}
                    />
                  ))}
                </svg>

                {/* Tooltip Overlay */}
                {hoveredIdx !== null && (
                  <div
                    className="absolute bg-slate-900/95 dark:bg-slate-950/95 border border-slate-700/50 p-2.5 rounded-lg text-[10px] text-white space-y-1 shadow-xl animate-fade-in pointer-events-none"
                    style={{
                      left: `${15 + hoveredIdx * 90}px`,
                      bottom: '90px',
                    }}
                  >
                    <p className="font-extrabold uppercase tracking-widest text-slate-400">
                      {['January', 'February', 'March', 'April', 'May', 'June'][hoveredIdx]}
                    </p>
                    <p className="font-bold flex justify-between gap-6">
                      <span>Revenue:</span>
                      <span className="text-indigo-500">₹{[35, 48, 62, 59, 81, 105][hoveredIdx]} Lakhs</span>
                    </p>
                    <p className="font-bold flex justify-between gap-6">
                      <span>Costs:</span>
                      <span className="text-emerald-500">₹{([35, 48, 62, 59, 81, 105][hoveredIdx] * 0.7).toFixed(1)} Lakhs</span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Audit Trail Logs */}
            <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4 border-b border-slate-200/50 dark:border-slate-850/50 pb-2">
                  <Activity className="w-4.5 h-4.5 text-indigo-500 animate-pulse" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Live Operations Stream</h3>
                </div>
                <div className="space-y-4 text-xs">
                  {recentLogs.map((log, idx) => (
                    <div key={idx} className="flex gap-2.5 pb-3 border-b border-slate-200/40 dark:border-slate-850/20 last:border-b-0 last:pb-0">
                      <span className="text-[10px] text-indigo-500 mt-0.5">●</span>
                      <div>
                        <p className="font-bold text-slate-850 dark:text-slate-200">
                          {log.userEmail ? log.userEmail.split('@')[0] : 'system'} //{' '}
                          <span className="text-[9px] font-black text-indigo-500 uppercase tracking-wider">{log.action}</span>
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-light leading-relaxed">{log.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-[9px] font-bold text-slate-400 dark:text-slate-500 tracking-wider text-right uppercase pt-3 border-t border-slate-100 dark:border-slate-850 mt-4">
                Telemetry Log Active
              </div>
            </div>
 
          </div>

          {/* Advanced Telemetry Analytics Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Chart 1: Production Load vs Actual Output */}
            <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Shop Floor Capacity vs Output</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Real-time assembly line productivity (in units)</p>
                </div>
              </div>
              <div className="h-48 w-full">
                <svg className="w-full h-full" viewBox="0 0 400 160" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="40" y1="20" x2="380" y2="20" stroke="rgba(148, 163, 184, 0.1)" strokeWidth="0.8" />
                  <line x1="40" y1="60" x2="380" y2="60" stroke="rgba(148, 163, 184, 0.1)" strokeWidth="0.8" />
                  <line x1="40" y1="100" x2="380" y2="100" stroke="rgba(148, 163, 184, 0.1)" strokeWidth="0.8" />
                  <line x1="40" y1="140" x2="380" y2="140" stroke="rgba(148, 163, 184, 0.1)" strokeWidth="0.8" />

                  {/* Y Axis Labels */}
                  <text x="5" y="24" fill="#94a3b8" className="text-[8px] font-bold font-mono">100%</text>
                  <text x="5" y="64" fill="#94a3b8" className="text-[8px] font-bold font-mono">60%</text>
                  <text x="5" y="104" fill="#94a3b8" className="text-[8px] font-bold font-mono">30%</text>
                  <text x="5" y="144" fill="#94a3b8" className="text-[8px] font-bold font-mono">0%</text>

                  {/* X Axis Labels */}
                  {['Line A', 'Line B', 'Line C', 'Line D'].map((lineName, idx) => (
                    <text key={idx} x={75 + idx * 85} y="155" fill="#94a3b8" className="text-[8px] font-bold text-center uppercase tracking-wider">{lineName}</text>
                  ))}

                  {/* Grouped Bars (Capacity vs Output) */}
                  {[
                    { cap: 120, out: 85 },
                    { cap: 140, out: 125 },
                    { cap: 100, out: 95 },
                    { cap: 160, out: 110 }
                  ].map((data, idx) => {
                    const startX = 55 + idx * 85;
                    const capHeight = (data.cap / 180) * 120;
                    const outHeight = (data.out / 180) * 120;
                    return (
                      <g key={idx}>
                        {/* Capacity Bar (Light Gray / Indigo outline) */}
                        <rect x={startX} y={140 - capHeight} width="16" height={capHeight} fill="rgba(99, 102, 241, 0.15)" stroke="var(--primary)" strokeWidth="1" rx="1.5" />
                        {/* Output Bar (Solid Accent/Indigo) */}
                        <rect x={startX + 18} y={140 - outHeight} width="16" height={outHeight} fill="var(--primary)" rx="1.5" />
                      </g>
                    );
                  })}
                </svg>
              </div>
              <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-wider mt-2 text-slate-500 justify-end">
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500/20 border border-indigo-550" />
                  <span>Target Capacity</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-indigo-600" />
                  <span>Actual Output</span>
                </div>
              </div>
            </div>

            {/* Chart 2: Quality Inspection Pass Rates (Donut Ring Chart) */}
            <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Batch Quality Compliance</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Summary of QA pass rates vs defects</p>
              </div>
              
              <div className="flex items-center justify-around py-2 gap-4">
                {/* SVG Circular Ring */}
                <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    {/* Background Circle */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(148, 163, 184, 0.1)" strokeWidth="2.5" />
                    {/* Dash Pass Circle (91.8%) */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="2.8" strokeDasharray="91.8 8.2" strokeLinecap="round" />
                  </svg>
                  <div className="absolute text-center">
                    <p className="text-lg font-black text-slate-900 dark:text-white leading-none">91.8%</p>
                    <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">Pass rate</p>
                  </div>
                </div>

                {/* Details list */}
                <div className="space-y-3 text-xs w-full max-w-[160px]">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Passed</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">156 Lots</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Defective</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">14 Lots</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-500" />
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Total Audits</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">170 Lots</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: SALES DASHBOARD */}
      {activeTab === 'sales' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="glass-card p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <h4 className="text-[10px] uppercase font-bold text-slate-400">Total Confirmed Orders</h4>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{initialSalesOrders.length} Orders</p>
            </div>
            <div className="glass-card p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <h4 className="text-[10px] uppercase font-bold text-slate-400">Pipeline Sales Value</h4>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">₹{totalSalesVal.toLocaleString('en-IN')}</p>
            </div>
            <div className="glass-card p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <h4 className="text-[10px] uppercase font-bold text-slate-400">Pending Customer RFQs</h4>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{pendingQuotations} Drafts</p>
            </div>
          </div>

          {/* Quotations List */}
          <div className="glass-card rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-250 dark:border-slate-800">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Active Sales Quotations</h3>
            </div>
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold bg-slate-50/20">
                  <th className="p-3">Reference No</th>
                  <th className="p-3">Quotation Status</th>
                  <th className="p-3">Total Value</th>
                  <th className="p-3">Version</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {initialQuotations.map((q, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/20">
                    <td className="p-3 font-bold text-indigo-500">{q.referenceNo}</td>
                    <td className="p-3"><span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 rounded font-semibold">{q.status}</span></td>
                    <td className="p-3 font-bold">₹{q.value.toLocaleString('en-IN')}</td>
                    <td className="p-3">v{q.version || 1}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PROCUREMENT DASHBOARD */}
      {activeTab === 'procurement' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="glass-card p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <h4 className="text-[10px] uppercase font-bold text-slate-400">Total Purchase Orders</h4>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{initialPurchaseOrders.length} POs</p>
            </div>
            <div className="glass-card p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <h4 className="text-[10px] uppercase font-bold text-slate-400">Pending PO Approvals</h4>
              <p className="text-2xl font-extrabold text-red-500 mt-1">{pendingPOApprovalCount} POs</p>
            </div>
          </div>

          {/* PO List */}
          <div className="glass-card rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-250 dark:border-slate-800">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Purchase Orders Status</h3>
            </div>
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold bg-slate-50/20">
                  <th className="p-3">PO Reference</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Spend Value</th>
                  <th className="p-3">Approved By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {initialPurchaseOrders.map((po, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/20">
                    <td className="p-3 font-bold text-indigo-500">{po.poNo}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded font-semibold ${
                        po.status === 'Approved' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {po.status}
                      </span>
                    </td>
                    <td className="p-3 font-bold">₹{po.value.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-slate-450">{po.approvedBy || 'Pending CFO'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: INVENTORY DASHBOARD */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="glass-card p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <h4 className="text-[10px] uppercase font-bold text-slate-400">Total Safety Alerts</h4>
              <p className="text-2xl font-extrabold text-red-500 mt-1">{initialInventoryAlerts.length} Warnings</p>
            </div>
            <div className="glass-card p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <h4 className="text-[10px] uppercase font-bold text-slate-400">Available SKU Catalog</h4>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{initialInventoryItems.length} SKUs</p>
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="glass-card rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-250 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Safety Level Breaches</h3>
            </div>
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold bg-slate-50/20">
                  <th className="p-3">SKU Name</th>
                  <th className="p-3">Location/Warehouse</th>
                  <th className="p-3">Warning Type</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {initialInventoryAlerts.map((a, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/20">
                    <td className="p-3 font-bold">{a.materialId || 'MAT-STL-02'}</td>
                    <td className="p-3 text-slate-500">{a.warehouseId || 'Chicago Depot'}</td>
                    <td className="p-3 text-red-500 font-bold">{a.type}</td>
                    <td className="p-3"><span className="px-2 py-0.5 bg-red-500/10 text-red-550 rounded font-semibold">{a.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: PRODUCTION DASHBOARD */}
      {activeTab === 'production' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="glass-card p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <h4 className="text-[10px] uppercase font-bold text-slate-400 font-bold">Active Work Orders</h4>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">4 Runnings</p>
            </div>
            <div className="glass-card p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <h4 className="text-[10px] uppercase font-bold text-slate-400 font-bold">Line Efficiency</h4>
              <p className="text-2xl font-extrabold text-indigo-500 mt-1">82.5% Avg</p>
            </div>
            <div className="glass-card p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <h4 className="text-[10px] uppercase font-bold text-slate-400 font-bold">Planned Target Output</h4>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">1,870 Units</p>
            </div>
          </div>

          {/* Production Orders list */}
          <div className="glass-card rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-250 dark:border-slate-800">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Active Shop Floor Scheduling</h3>
            </div>
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold bg-slate-50/20">
                  <th className="p-3">Work Order ID</th>
                  <th className="p-3">Material Assembly</th>
                  <th className="p-3">Planned Qty</th>
                  <th className="p-3">Production Line</th>
                  <th className="p-3">Progress</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {productionOrders.map((wo, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/20">
                    <td className="p-3 font-bold text-indigo-500">{wo.id}</td>
                    <td className="p-3 font-semibold">{wo.material}</td>
                    <td className="p-3">{wo.qty} units</td>
                    <td className="p-3 text-slate-450">{wo.line}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 dark:bg-slate-800 h-2 rounded overflow-hidden">
                          <div className="bg-indigo-500 h-full" style={{ width: `${wo.progress}%` }} />
                        </div>
                        <span className="font-semibold text-[10px]">{wo.progress}%</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        wo.status === 'Completed' ? 'bg-green-550/15 text-green-550' :
                        wo.status === 'Delayed' ? 'bg-red-500/15 text-red-500' : 'bg-indigo-500/15 text-indigo-500'
                      }`}>
                        {wo.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: QUALITY CONTROL */}
      {activeTab === 'quality' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="glass-card p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <h4 className="text-[10px] uppercase font-bold text-slate-400 font-bold">Total Inspected</h4>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">170 Batches</p>
            </div>
            <div className="glass-card p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <h4 className="text-[10px] uppercase font-bold text-slate-450 font-bold">Rejections Rate</h4>
              <p className="text-2xl font-extrabold text-red-500 mt-1">8.2% Defective</p>
            </div>
            <div className="glass-card p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <h4 className="text-[10px] uppercase font-bold text-slate-450 font-bold">Inspection Pass Rate</h4>
              <p className="text-2xl font-extrabold text-green-500 mt-1">91.8% passed</p>
            </div>
          </div>

          {/* Quality checks */}
          <div className="glass-card rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-250 dark:border-slate-800">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Recent QA Audits & Defect Log</h3>
            </div>
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold bg-slate-50/20">
                  <th className="p-3">Audit Reference</th>
                  <th className="p-3">Batch Code</th>
                  <th className="p-3">Assembly Unit</th>
                  <th className="p-3">Qty Inspected</th>
                  <th className="p-3">Qty Rejected</th>
                  <th className="p-3">Auditor</th>
                  <th className="p-3 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {qualityInspections.map((qa, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/20">
                    <td className="p-3 font-bold text-indigo-500">{qa.id}</td>
                    <td className="p-3 font-semibold text-slate-450">{qa.batch}</td>
                    <td className="p-3">{qa.material}</td>
                    <td className="p-3">{qa.checked} units</td>
                    <td className="p-3 text-red-500 font-semibold">{qa.rejected} rejects</td>
                    <td className="p-3 text-slate-450">{qa.inspector}</td>
                    <td className="p-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        qa.status === 'Passed' ? 'bg-green-550/15 text-green-500' : 'bg-red-550/15 text-red-500'
                      }`}>
                        {qa.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: DISPATCH & LOGISTICS */}
      {activeTab === 'dispatch' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="glass-card p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <h4 className="text-[10px] uppercase font-bold text-slate-450 font-bold">Pending Shipments</h4>
              <p className="text-2xl font-extrabold text-amber-500 mt-1">1 Shipment</p>
            </div>
            <div className="glass-card p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <h4 className="text-[10px] uppercase font-bold text-slate-450 font-bold">Dispatched (In Transit)</h4>
              <p className="text-2xl font-extrabold text-indigo-500 mt-1">1 In Transit</p>
            </div>
            <div className="glass-card p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <h4 className="text-[10px] uppercase font-bold text-slate-450 font-bold">Successfully Delivered</h4>
              <p className="text-2xl font-extrabold text-green-500 mt-1">1 Delivered</p>
            </div>
          </div>

          {/* Dispatch Logs */}
          <div className="glass-card rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-250 dark:border-slate-800">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Logistics Dispatch Audit</h3>
            </div>
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold bg-slate-50/20">
                  <th className="p-3">Shipment Ref</th>
                  <th className="p-3">Customer Client</th>
                  <th className="p-3">Reference SO</th>
                  <th className="p-3">Items Shipped</th>
                  <th className="p-3">Delivery Partner</th>
                  <th className="p-3 text-right">Delivery Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {dispatchOrders.map((d, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/20">
                    <td className="p-3 font-bold text-indigo-500">{d.id}</td>
                    <td className="p-3 font-semibold">{d.customer}</td>
                    <td className="p-3 font-bold text-slate-450">{d.orderRef}</td>
                    <td className="p-3 text-slate-500">{d.items}</td>
                    <td className="p-3 text-slate-450">{d.courier}</td>
                    <td className="p-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        d.status === 'Delivered' ? 'bg-green-550/15 text-green-500' :
                        d.status === 'Transit' ? 'bg-indigo-550/15 text-indigo-500' : 'bg-amber-550/15 text-amber-500'
                      }`}>
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
