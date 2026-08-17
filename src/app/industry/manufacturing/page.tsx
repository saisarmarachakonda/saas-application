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
  TrendingUp,
  Cpu,
  PackageCheck
} from 'lucide-react';
import DecoupledAppLayout from '@/components/layouts/DecoupledAppLayout';

export default function ManufacturingIndustryApp() {
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [selectedShift, setSelectedShift] = useState('Morning Shift A (06:00 - 14:00)');

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
            <a
              href="#demo-request"
              className="px-4 py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Request Industry Demo</span>
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
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
              Synchronize raw-material intake, bill of materials (BOM), MRP II capacity scheduling, finished goods warehousing, and automated 3-way match procurement.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#demo-request"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>Request Custom Plant Demo</span>
              </a>
            </div>
          </div>
        </div>

        {/* Live Plant Telemetry Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Overall Plant OEE</span>
              <Cpu className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">88.4%</p>
            <p className="text-[11px] text-emerald-500 font-semibold mt-1">+3.2% vs target shift</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">BOM Work Orders</span>
              <PackageCheck className="w-4 h-4 text-indigo-500" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">142 Orders</p>
            <p className="text-[11px] text-blue-500 font-semibold mt-1">118 Completed · 24 In-Progress</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Raw Stock Inventory</span>
              <Boxes className="w-4 h-4 text-cyan-500" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">₹ 4.28 Cr</p>
            <p className="text-[11px] text-cyan-500 font-semibold mt-1">FIFO Evaluated &amp; Audited</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Quality Audit Pass</span>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">99.1%</p>
            <p className="text-[11px] text-emerald-500 font-semibold mt-1">Zero Non-Conformances</p>
          </div>
        </div>

        {/* Demo Request Form */}
        <div id="demo-request" className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-6">
          <div className="max-w-xl space-y-2">
            <span className="text-[10px] uppercase font-bold text-blue-500 tracking-wider">Schedule Evaluation</span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Request Manufacturing Suite Demo</h2>
            <p className="text-xs text-slate-500 font-light">Fill out your details to receive an itemized manufacturing proposal &amp; live sandbox credentials.</p>
          </div>

          {requestSubmitted ? (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-2xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>Thank you! Your manufacturing demo request has been submitted. Our engineering team will email you within 2 hours.</span>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setRequestSubmitted(true); }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Full Name</label>
                <input required placeholder="Plant Operations Manager" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Work Email</label>
                <input required type="email" placeholder="manager@plant.com" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs outline-none focus:border-blue-500" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Plant Location / Manufacturing Scope</label>
                <textarea rows={3} placeholder="Describe number of plants, manufacturing lines, or MRP requirements..." className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs outline-none focus:border-blue-500" />
              </div>
              <div className="md:col-span-2">
                <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all">
                  Submit Manufacturing Demo Request
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
