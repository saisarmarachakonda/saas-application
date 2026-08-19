'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import RecentNavigations from '@/components/dashboard/RecentNavigations';
import {
  Briefcase,
  Layers,
  Users2,
  ShoppingCart,
  Boxes,
  Landmark,
  Database,
  Building2,
  GitFork,
  ArrowUpRight,
  Sparkles,
  Bot,
  Activity,
  CheckCircle2
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
  const [aiInsightsOpen, setAiInsightsOpen] = useState(false);

  // Standalone module cards definition
  const moduleDashboards = [
    {
      id: 'hrm',
      title: 'HRM & Personnel Dashboard',
      subtitle: 'Personnel, Payroll & Bio-Data',
      description: '759 employee records, 599 shift attendance logs, EPF/ESI statutory forms, and native PDF payslip generators.',
      link: '/hrm',
      icon: <Briefcase className="w-6 h-6 text-blue-500" />,
      color: 'blue',
      badge: '759 Active Employees'
    },
    {
      id: 'ops',
      title: 'Vertex Ops Core Dashboard',
      subtitle: 'Work Orders & Capacity Planning',
      description: '364 production work orders, MRP material allocation, multi-plant capacity scheduling, and cost center ledgers.',
      link: '/ops',
      icon: <Layers className="w-6 h-6 text-indigo-500" />,
      color: 'indigo',
      badge: '364 Work Orders'
    },
    {
      id: 'crm',
      title: 'CRM & Bidding Dashboard',
      subtitle: 'Client Leads & RFQ Pipelines',
      description: '354 deal opportunities, 5-stage Kanban sales pipeline, client quotation calculators, and customer accounts.',
      link: '/crm',
      icon: <Users2 className="w-6 h-6 text-cyan-500" />,
      color: 'cyan',
      badge: '354 Active Deals'
    },
    {
      id: 'procurement',
      title: 'Procurement Dashboard',
      subtitle: 'Purchase Orders & 3-Way Match',
      description: '359 purchase orders, vendor reliability scorecards, RFQ bidding matrix, and automated invoice matching.',
      link: '/procurement',
      icon: <ShoppingCart className="w-6 h-6 text-amber-500" />,
      color: 'amber',
      badge: '359 Purchase Orders'
    },
    {
      id: 'inventory',
      title: 'Inventory & Warehouse Dashboard',
      subtitle: 'SKUs, Bin Stock & Expiry Logs',
      description: '364 inventory SKUs, warehouse bin coordinates, FIFO/LIFO valuation, and reorder threshold alerts.',
      link: '/inventory',
      icon: <Boxes className="w-6 h-6 text-emerald-500" />,
      color: 'emerald',
      badge: '364 Inventory SKUs'
    },
    {
      id: 'finance',
      title: 'Finance & Ledger Dashboard',
      subtitle: 'Accounts Payable & CapEx',
      description: '354 double-entry ledger transactions, cost center allocations, tax reconciliation filings, and cash flows.',
      link: '/finance',
      icon: <Landmark className="w-6 h-6 text-purple-500" />,
      color: 'purple',
      badge: '354 Ledger Records'
    },
    {
      id: 'master-data',
      title: 'Master Data Catalog Dashboard',
      subtitle: 'Material & Product Specifications',
      description: '359 master material items, product specifications, HSN code classifications, and deduplication audit.',
      link: '/master-data',
      icon: <Database className="w-6 h-6 text-teal-500" />,
      color: 'teal',
      badge: '359 Master Catalog Items'
    },
    {
      id: 'admin',
      title: 'Platform Admin Dashboard',
      subtitle: 'Security Logs & Access Nodes',
      description: '354 security logs, multi-tenant workspace permissions, JWT active session inspectors, and user management.',
      link: '/admin',
      icon: <Building2 className="w-6 h-6 text-blue-600" />,
      color: 'blue',
      badge: '354 Security Logs'
    },
    {
      id: 'workflows',
      title: 'Workflow Automation Dashboard',
      subtitle: 'Approval Chains & SLA Clearance',
      description: '359 workflow instances, multi-level signoff pathways, approval matrix rules, and SLA tracking.',
      link: '/workflows',
      icon: <GitFork className="w-6 h-6 text-pink-500" />,
      color: 'pink',
      badge: '359 Active Workflows'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Module Dashboard Launchpad</span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
              9 Standalone Module Dashboards
            </span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-light mt-0.5">
            Select an individual module below to enter its dedicated dashboard workspace.
          </p>
        </div>

        {/* Database Status Indicator */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-2 rounded-lg flex items-center gap-2 select-none shadow-xs font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>9 Individual Module Dashboards Online</span>
          </div>
        </div>
      </div>

      {/* Recent Navigations Bar */}
      <RecentNavigations />

      {/* Grid of 9 Standalone Module Dashboard Launcher Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {moduleDashboards.map((mod) => (
          <div
            key={mod.id}
            className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/50 shadow-xs flex flex-col justify-between group transition-all duration-300 hover:shadow-lg relative overflow-hidden bg-white dark:bg-slate-900"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800/80 rounded-xl flex items-center justify-center border border-slate-200/60 dark:border-slate-700 group-hover:scale-105 transition-transform">
                  {mod.icon}
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                  {mod.badge}
                </span>
              </div>

              <h2 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                {mod.title}
              </h2>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-0.5 mb-3">
                {mod.subtitle}
              </h3>
              
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-6 font-light">
                {mod.description}
              </p>
            </div>

            <Link
              href={mod.link}
              className="w-full text-center py-3 btn-enterprise-gradient text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 cursor-pointer group shadow-xs"
            >
              <span>Open {mod.title.split(' ')[0]} Dashboard</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
