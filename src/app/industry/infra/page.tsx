'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HardHat,
  Building2,
  Truck,
  Wrench,
  FileCheck,
  ArrowLeft,
  Mail,
  CheckCircle2,
  ShieldCheck,
  Layers,
  MapPin,
  TrendingUp
} from 'lucide-react';

export default function InfraIndustryApp() {
  const [requestSubmitted, setRequestSubmitted] = useState(false);

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
              <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
                <HardHat className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-slate-900 dark:text-white">Infra / EPC Construction Suite</h1>
                <p className="text-[11px] text-slate-500 font-light">Site Execution, Subcontractor Work Orders &amp; Machinery</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              Portal Login
            </Link>
            <a
              href="#demo-request"
              className="px-4 py-2 text-xs font-bold rounded-lg bg-orange-600 hover:bg-orange-700 text-white shadow-md transition-all flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Request Infra Demo</span>
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Industry Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-950 via-amber-950 to-slate-900 text-white p-8 md:p-12 shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-[10px] uppercase font-extrabold tracking-widest bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full border border-orange-400/30">
              Sector Application Package
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Infra / EPC Project Control
            </h1>
            <p className="text-sm md:text-base text-slate-300 font-light leading-relaxed">
              Streamline heavy machinery allocation, inter-site material transfers, rebar grade specifications, subcontractor work order clearances, and site asset depreciation.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#demo-request"
                className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>Request Custom Infra Demo</span>
              </a>
            </div>
          </div>
        </div>

        {/* Live Infra Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Active EPC Sites</span>
              <MapPin className="w-4 h-4 text-orange-500" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">18 Sites</p>
            <p className="text-[11px] text-orange-500 font-semibold mt-1">Live Multi-Site Geo Tracking</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Subcontractor Bills</span>
              <FileCheck className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">₹ 1.84 Cr</p>
            <p className="text-[11px] text-emerald-500 font-semibold mt-1">3-Way Match Verified</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Heavy Machinery Fleet</span>
              <Truck className="w-4 h-4 text-yellow-500" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">42 Heavy Units</p>
            <p className="text-[11px] text-blue-500 font-semibold mt-1">100% Serviced &amp; Deployed</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Safety &amp; SLA Compliance</span>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">99.8%</p>
            <p className="text-[11px] text-emerald-500 font-semibold mt-1">Zero Site Penalties</p>
          </div>
        </div>

        {/* Demo Request Form */}
        <div id="demo-request" className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-6">
          <div className="max-w-xl space-y-2">
            <span className="text-[10px] uppercase font-bold text-orange-500 tracking-wider">Schedule Evaluation</span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Request Infra / EPC Suite Demo</h2>
            <p className="text-xs text-slate-500 font-light">Fill out your details to receive an itemized infra construction proposal &amp; live sandbox credentials.</p>
          </div>

          {requestSubmitted ? (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-2xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>Thank you! Your Infra/EPC demo request has been submitted. Our engineering team will contact you within 2 hours.</span>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setRequestSubmitted(true); }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Full Name</label>
                <input required placeholder="Project Director / Site Manager" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs outline-none focus:border-orange-500" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Work Email</label>
                <input required type="email" placeholder="director@infra.com" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs outline-none focus:border-orange-500" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Construction &amp; Machinery Scope</label>
                <textarea rows={3} placeholder="Describe project sites, machinery fleet size, or subcontractor requirements..." className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs outline-none focus:border-orange-500" />
              </div>
              <div className="md:col-span-2">
                <button type="submit" className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all">
                  Submit Infra Demo Request
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
