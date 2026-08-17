'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Users,
  Shirt,
  MapPin,
  ShieldCheck,
  ArrowLeft,
  Mail,
  CheckCircle2,
  FileSpreadsheet,
  Layers,
  Wrench,
  Boxes
} from 'lucide-react';

export default function FacilitiesIndustryApp() {
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
              <div className="p-2 rounded-xl bg-teal-500/10 text-teal-500">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-slate-900 dark:text-white">Facilities &amp; Asset Management Suite</h1>
                <p className="text-[11px] text-slate-500 font-light">Multi-Site Heavy Scrubbers, Mobile Geo-Attendance &amp; EPF/ESI Audit</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              Portal Login
            </Link>
            <a
              href="#demo-request"
              className="px-4 py-2 text-xs font-bold rounded-lg bg-teal-600 hover:bg-teal-700 text-white shadow-md transition-all flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Request Facilities Demo</span>
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Industry Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-950 via-emerald-950 to-slate-900 text-white p-8 md:p-12 shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-[10px] uppercase font-extrabold tracking-widest bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full border border-teal-400/30">
              Sector Application Package
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Facilities &amp; Assets Operations Suite
            </h1>
            <p className="text-sm md:text-base text-slate-300 font-light leading-relaxed">
              Track heavy scrubbing machinery, 200 bar jet washers, site staff multi-site shift rosters, mobile facial GPS attendance, EPF/ESI statutory forms, and client SLAs.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#demo-request"
                className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>Request Custom Facilities Demo</span>
              </a>
            </div>
          </div>
        </div>

        {/* Live Facilities Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Statutory Staff</span>
              <Users className="w-4 h-4 text-teal-500" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">578 Staff</p>
            <p className="text-[11px] text-teal-500 font-semibold mt-1">EPF &amp; ESIC Verified</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Heavy Scrubbing Machinery</span>
              <Wrench className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">354 Equipment</p>
            <p className="text-[11px] text-emerald-500 font-semibold mt-1">Zero Breakdown Downtime</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Mobile GPS Geo Punches</span>
              <MapPin className="w-4 h-4 text-cyan-500" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">354 Punches</p>
            <p className="text-[11px] text-cyan-500 font-semibold mt-1">Geofence Verified</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Client SLA Score</span>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">100.0%</p>
            <p className="text-[11px] text-emerald-500 font-semibold mt-1">Apollo, GMR, Microsoft, DLF</p>
          </div>
        </div>

        {/* Demo Request Form */}
        <div id="demo-request" className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-6">
          <div className="max-w-xl space-y-2">
            <span className="text-[10px] uppercase font-bold text-teal-500 tracking-wider">Schedule Evaluation</span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Request Facilities Suite Demo</h2>
            <p className="text-xs text-slate-500 font-light">Fill out your details to receive an itemized facilities management proposal &amp; live sandbox credentials.</p>
          </div>

          {requestSubmitted ? (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-2xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>Thank you! Your Facilities demo request has been submitted. Our operations team will contact you within 2 hours.</span>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setRequestSubmitted(true); }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Full Name</label>
                <input required placeholder="Head of Soft Services / Facilities" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs outline-none focus:border-teal-500" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Work Email</label>
                <input required type="email" placeholder="head@facilities.com" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs outline-none focus:border-teal-500" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Facility Operations &amp; Staff Scope</label>
                <textarea rows={3} placeholder="Describe facility sites, staff headcount, machinery fleet, or client SLA requirements..." className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs outline-none focus:border-teal-500" />
              </div>
              <div className="md:col-span-2">
                <button type="submit" className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all">
                  Submit Facilities Demo Request
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
