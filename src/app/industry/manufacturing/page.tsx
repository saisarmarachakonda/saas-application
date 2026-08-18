'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Factory,
  Boxes,
  ShoppingCart,
  Database,
  Landmark,
  Bot,
  ArrowLeft,
  Mail,
  CheckCircle2,
  Sliders,
  FileSpreadsheet,
  Activity,
  Layers,
  ShieldCheck,
  PackageCheck,
  ArrowRight,
  Workflow,
  Check,
  CheckSquare,
  Square,
  Sparkles
} from 'lucide-react';

export default function ManufacturingIndustryApp() {
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [targetModuleForQuote, setTargetModuleForQuote] = useState('Manufacturing Sector Package');
  const [customMessage, setCustomMessage] = useState('');

  // Selected Modules State for Interactive Manufacturing Module Selector
  const [selectedModules, setSelectedModules] = useState<string[]>([
    'MRP II & Capacity Scheduling',
    'BOM & Work Orders',
    'Plant Inventory & FIFO Valuation',
    'Quality Control & Inspection'
  ]);

  // Manufacturing Industry Specific Modules
  const manufacturingModules = [
    {
      id: 'mrp-capacity',
      title: 'MRP II & Capacity Scheduling',
      category: 'Production Planning',
      description: 'Multi-plant production scheduling, capacity load balancing, work-center routing, and shift line allocations.',
      features: [
        'Multi-plant production scheduling',
        'Work-center load balancing',
        'Shift line allocations & capacity forecasting',
        'Real-time bottleneck detection'
      ],
      icon: <Factory className="w-5 h-5 text-blue-500" />
    },
    {
      id: 'bom-work-orders',
      title: 'BOM & Work Orders',
      category: 'Execution & Assembly',
      description: 'Multi-level Bill of Materials (BOM), raw-material staging, batch serial tracking, and work order clearances.',
      features: [
        'Multi-level BOM hierarchy',
        'Raw-material staging & allocation',
        'Batch serial & lot tracking',
        'Production order execution signoffs'
      ],
      icon: <PackageCheck className="w-5 h-5 text-indigo-500" />
    },
    {
      id: 'plant-inventory',
      title: 'Plant Inventory & FIFO Valuation',
      category: 'Warehouse & Stock',
      description: 'Raw-material depot balances, bin allocation, FIFO stock valuation, and automated reorder threshold warnings.',
      features: [
        'Depot stock balances & bin allocation',
        'FIFO / LIFO valuation engine',
        'Minimum stock reorder alerts',
        'Material transfer note clearances'
      ],
      icon: <Boxes className="w-5 h-5 text-cyan-500" />
    },
    {
      id: 'quality-assurance',
      title: 'Quality Control & Inspection',
      category: 'Compliance & Audit',
      description: 'In-process quality checks, non-conformance logging, lab test certificates, and automated audit report exports.',
      features: [
        'In-process quality inspection checkpoints',
        'Non-conformance logging & RCA',
        'Lab test certificate attachments',
        'Automated PDF compliance exports'
      ],
      icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />
    },
    {
      id: 'raw-procurement',
      title: 'Procure-to-Pay & 3-Way Match',
      category: 'Sourcing & Supply',
      description: 'Automate raw-material sourcing with 3-way match auditing (PO vs GRN vs Vendor Invoice) and supplier scorecards.',
      features: ['Purchase requisitions & POs', '3-way match auditor', 'Raw-material GRN verification', 'Supplier reliability scorecards'],
      icon: <ShoppingCart className="w-5 h-5 text-amber-500" />
    },
    {
      id: 'plant-costing',
      title: 'Plant Costing & Ledgers',
      category: 'Finance & Accounts',
      description: 'Work-center cost allocation, direct labor ledgers, capital expenditure tracking, and plant margin analysis.',
      features: ['Work-center cost allocation', 'Direct labor ledger postings', 'CapEx equipment tracking', 'Plant margin & P&L audits'],
      icon: <Landmark className="w-5 h-5 text-purple-500" />
    }
  ];

  const toggleModuleSelection = (title: string) => {
    setSelectedModules(prev =>
      prev.includes(title) ? prev.filter(m => m !== title) : [...prev, title]
    );
  };

  const handleRequestForSelectedModules = () => {
    const listStr = selectedModules.join(', ');
    setTargetModuleForQuote(`Manufacturing Suite (${selectedModules.length} Modules)`);
    setCustomMessage(`Requesting custom price quote & live demo for Manufacturing Suite with the following selected modules:\n- ${selectedModules.join('\n- ')}\n\nPlease email itemized proposal & sandbox credentials.`);
    
    // Smooth scroll to form
    const elem = document.getElementById('demo-request');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b12] text-slate-900 dark:text-slate-100 font-sans">
      {/* Top Header Navigation */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#070b12]/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors">
              <ArrowLeft className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                <Factory className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-slate-900 dark:text-white">Manufacturing &amp; Plant Operations</h1>
                <p className="text-[11px] text-slate-500 font-light">MRP II, Plant Floor Capacity &amp; Quality Control</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              Portal Login
            </Link>
            <button
              onClick={handleRequestForSelectedModules}
              className="px-4 py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Request Demo / Quote</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-12">
        {/* Industry Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-8 md:p-12 shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-[10px] uppercase font-extrabold tracking-widest bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full border border-blue-400/30">
              Sector Application Package
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Manufacturing &amp; Plant Floor Suite
            </h1>
            <p className="text-sm md:text-base text-slate-300 font-light leading-relaxed">
              Select the manufacturing modules required for your plant floor, customize your package, and request an itemized price quote or live demo.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={handleRequestForSelectedModules}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-transform hover:scale-105 flex items-center gap-2 cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Request Quote for {selectedModules.length} Selected Modules</span>
              </button>
              <a
                href="#manufacturing-modules"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2"
              >
                <span>Select Modules Below</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Interactive Module Selection Control Bar */}
        <div id="manufacturing-modules" className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-500 tracking-wider">Module Configurator</span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Select Manufacturing Modules for Quote</h2>
              <p className="text-xs text-slate-500 font-light mt-0.5">Click modules to toggle inclusion in your custom proposal request</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1.5 rounded-full bg-blue-50 dark:bg-slate-800 text-blue-600 text-xs font-bold">
                {selectedModules.length} of {manufacturingModules.length} Selected
              </span>
              <button
                onClick={handleRequestForSelectedModules}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Request Quote &amp; Demo</span>
              </button>
            </div>
          </div>

          {/* Module Cards Grid with Checkboxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {manufacturingModules.map((mod) => {
              const isSelected = selectedModules.includes(mod.title);
              return (
                <div
                  key={mod.id}
                  onClick={() => toggleModuleSelection(mod.title)}
                  className={`glass-card p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/40 dark:bg-slate-800/80 shadow-md'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800">
                        {mod.icon}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                          {mod.category}
                        </span>
                        <button
                          type="button"
                          className={`p-1 rounded-lg transition-colors ${isSelected ? 'text-blue-600' : 'text-slate-400'}`}
                        >
                          {isSelected ? <CheckSquare className="w-5 h-5 text-blue-600" /> : <Square className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{mod.title}</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-2 leading-relaxed">{mod.description}</p>

                    <ul className="mt-4 space-y-1.5">
                      {mod.features.map((feat, fidx) => (
                        <li key={fidx} className="flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-300 font-light">
                          <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isSelected ? 'text-blue-600 font-bold' : 'text-slate-400'}`} />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className={`text-xs font-bold ${isSelected ? 'text-blue-600' : 'text-slate-400'}`}>
                      {isSelected ? '✓ Included in Request' : '+ Click to Select'}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isSelected) toggleModuleSelection(mod.title);
                        handleRequestForSelectedModules();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-[11px] font-bold hover:bg-blue-700 transition-colors"
                    >
                      Request Quote
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Demo & Quote Request Form */}
        <div id="demo-request" className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-6">
          <div className="max-w-xl space-y-2">
            <span className="text-[10px] uppercase font-bold text-blue-500 tracking-wider">Enterprise Proposal</span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Request Demo or Quote</h2>
            <p className="text-xs text-slate-500 font-light">
              Target Package: <strong className="text-blue-600">{targetModuleForQuote}</strong>. Fill out your details below to receive an itemized manufacturing quote &amp; demo login.
            </p>
          </div>

          {requestSubmitted ? (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-2xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>Thank you! Your quote request for {selectedModules.length} manufacturing modules has been submitted. Our team will email your itemized proposal shortly.</span>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setRequestSubmitted(true); }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Full Name</label>
                <input required placeholder="Plant Operations Manager" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs outline-none focus:border-blue-600 dark:text-white" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Work Email</label>
                <input required type="email" placeholder="manager@plant.com" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs outline-none focus:border-blue-600 dark:text-white" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Selected Manufacturing Modules &amp; Scope</label>
                <textarea
                  rows={4}
                  value={customMessage || `Requesting custom price quote for Manufacturing Suite with ${selectedModules.length} selected modules:\n- ${selectedModules.join('\n- ')}`}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Describe your plant locations, number of lines, or specific integration requirements..."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs outline-none focus:border-blue-600 dark:text-white"
                />
              </div>
              <div className="md:col-span-2">
                <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all">
                  Submit Quote &amp; Demo Request ({selectedModules.length} Modules)
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
