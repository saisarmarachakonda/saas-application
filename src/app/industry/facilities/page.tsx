'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Users,
  ShoppingCart,
  Boxes,
  Workflow,
  ArrowLeft,
  Mail,
  CheckCircle2,
  CheckSquare,
  Square,
  X
} from 'lucide-react';
import StandardFooter from '@/components/Footer';

export default function FacilitiesIndustryApp() {
  const facilitiesModules = [
    { id: 'facilities', title: 'Vertex Facilities & Assets', subtitle: 'Multi-Site Facility Asset Register', icon: <Building2 className="w-5 h-5 text-teal-600" /> },
    { id: 'hrm', title: 'Vertex HRM & Workforce', subtitle: 'Multi-Site Shift Rosters & EPF/ESI Compliance', icon: <Users className="w-5 h-5 text-teal-600" /> },
    { id: 'procurement', title: 'Vertex Procurement', subtitle: 'Janitorial, Depot & Chemical Supplies', icon: <ShoppingCart className="w-5 h-5 text-teal-600" /> },
    { id: 'inventory', title: 'Vertex Inventory & Warehouse', subtitle: 'Depot Stock Balances & Valuation', icon: <Boxes className="w-5 h-5 text-teal-600" /> },
    { id: 'workflows', title: 'Vertex Workflows Engine', subtitle: 'SLA Escalation Alerts & Work Orders', icon: <Workflow className="w-5 h-5 text-teal-600" /> }
  ];

  const [selectedModules, setSelectedModules] = useState<string[]>([
    'Vertex Facilities & Assets',
    'Vertex HRM & Workforce',
    'Vertex Procurement',
    'Vertex Inventory & Warehouse',
    'Vertex Workflows Engine'
  ]);

  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const toggleModule = (title: string) => {
    setSelectedModules(prev =>
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-slate-900 font-sans selection:bg-teal-600 selection:text-white">
      {/* Top Header Navigation */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors">
              <ArrowLeft className="w-4 h-4 text-slate-700" />
            </Link>
            
            <Link href="/" className="text-xs font-semibold text-slate-700 hover:text-teal-600 transition-colors">
              Home
            </Link>

            <span className="text-slate-300">|</span>

            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-slate-900">Facilities &amp; Asset Management Suite</h1>
                <p className="text-[11px] text-slate-500 font-light">Multi-Site Heavy Scrubbers, Mobile Geo-Attendance &amp; EPF/ESI Audit</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
              Portal Login
            </Link>
            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="px-4 py-2 text-xs font-bold rounded-lg bg-teal-600 hover:bg-teal-700 text-white shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Request Facilities Quote</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* Industry Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-950 via-emerald-900 to-slate-950 text-white p-8 md:p-12 shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-[10px] uppercase font-extrabold tracking-widest bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full border border-teal-400/30">
              Dedicated Sector Suite
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Facilities Management Sector
            </h1>
            <p className="text-sm font-semibold text-teal-300">
              Multi-site asset maintenance, shift roster &amp; SLAs
            </p>
            <p className="text-sm md:text-base text-slate-200 font-light leading-relaxed">
              Track site asset maintenance, site staff rosters, mobile attendance, EPF/ESI statutory forms, and client SLAs. Select your required modules below to generate a tailored quote proposal.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => setIsDemoModalOpen(true)}
                className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg transition-transform hover:scale-105 flex items-center gap-2 cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Request Custom Facilities Package</span>
              </button>
            </div>
          </div>
        </div>

        {/* Relevant Modules Selector */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Facilities Management Modules Bundle</h2>
              <p className="text-xs text-slate-500 font-light mt-0.5">Select modules required for your facility sites and request an itemized proposal</p>
            </div>
            <span className="px-3.5 py-1.5 rounded-full bg-teal-50 text-teal-600 text-xs font-bold border border-teal-200">
              {selectedModules.length} of {facilitiesModules.length} Selected
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilitiesModules.map(mod => {
              const isSelected = selectedModules.includes(mod.title);
              return (
                <div
                  key={mod.id}
                  onClick={() => toggleModule(mod.title)}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                    isSelected
                      ? 'border-teal-500 bg-teal-50/40 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-teal-100 text-teal-600">
                        {mod.icon}
                      </div>
                      <span className={isSelected ? 'text-teal-600' : 'text-slate-400'}>
                        {isSelected ? <CheckSquare className="w-5 h-5 text-teal-600" /> : <Square className="w-5 h-5" />}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{mod.title}</h3>
                      <p className="text-xs text-slate-500 font-light mt-1 leading-relaxed">{mod.subtitle}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-400">Status</span>
                    <span className={`text-[11px] font-bold ${isSelected ? 'text-teal-600' : 'text-slate-400'}`}>
                      {isSelected ? '✓ Included' : '+ Add to bundle'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action CTA */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs text-slate-500">Customized Facilities Selection</p>
              <p className="text-sm font-bold text-slate-900">{selectedModules.length} Modules Selected for Proposal</p>
            </div>
            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              <span>Request Quote for Selected Modules</span>
            </button>
          </div>
        </div>

        {/* Demo & Quote Request Form Section */}
        <div id="demo-request" className="glass-card p-8 rounded-3xl border border-slate-200 bg-white shadow-xl space-y-6">
          <div className="max-w-xl space-y-2">
            <span className="text-[10px] uppercase font-bold text-teal-600 tracking-wider">Enterprise Proposal</span>
            <h2 className="text-2xl font-bold text-slate-900">Request Demo or Quote</h2>
            <p className="text-xs text-slate-500 font-light">
              Target Package: <strong className="text-teal-600">Facilities Management Suite ({selectedModules.length} Modules)</strong>. Fill out your details below to receive an itemized proposal &amp; demo login.
            </p>
          </div>

          {requestSubmitted ? (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-2xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>Thank you! Your quote request for {selectedModules.length} Facilities modules has been submitted. Our operations team will contact you shortly.</span>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Full Name</label>
                <input required value={contactForm.name} onChange={e => setContactForm({ ...contactForm, name: e.target.value })} placeholder="Head of Facilities" className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs outline-none focus:border-teal-500" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Work Email</label>
                <input required type="email" value={contactForm.email} onChange={e => setContactForm({ ...contactForm, email: e.target.value })} placeholder="head@facilities.com" className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs outline-none focus:border-teal-500" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Company Name</label>
                <input required value={contactForm.company} onChange={e => setContactForm({ ...contactForm, company: e.target.value })} placeholder="Compass Facilities Services" className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs outline-none focus:border-teal-500" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Target Sector</label>
                <input readOnly value="Facilities Management Sector" className="w-full p-3 rounded-xl border border-slate-200 bg-slate-100 text-xs text-slate-600 font-semibold" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Selected Facilities Modules &amp; Requirements</label>
                <textarea rows={3} value={contactForm.message || `Requesting custom price quote for Facilities Management Suite with ${selectedModules.length} selected modules:\n- ${selectedModules.join('\n- ')}`} onChange={e => setContactForm({ ...contactForm, message: e.target.value })} placeholder="Mention specific facility locations or machinery requirements..." className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs outline-none focus:border-teal-500" />
              </div>
              <div className="md:col-span-2">
                <button type="submit" className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all">
                  Submit Quote &amp; Demo Request ({selectedModules.length} Modules)
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Quote / Demo Modal */}
      {isDemoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl space-y-6 relative">
            <button
              onClick={() => { setIsDemoModalOpen(false); setRequestSubmitted(false); }}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-900 rounded-full bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] uppercase font-bold text-teal-600 tracking-wider">Facilities Suite Evaluation</span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">Request Facilities Proposal</h2>
              <p className="text-xs text-slate-500 font-light mt-0.5">Selected Modules: <strong className="text-teal-600">{selectedModules.join(', ')}</strong></p>
            </div>

            {requestSubmitted ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-2xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Thank you! Your Facilities demo request has been submitted. Our operations team will contact you shortly.</span>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Full Name</label>
                  <input required value={contactForm.name} onChange={e => setContactForm({ ...contactForm, name: e.target.value })} placeholder="Head of Facilities" className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs outline-none focus:border-teal-500" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Work Email</label>
                  <input required type="email" value={contactForm.email} onChange={e => setContactForm({ ...contactForm, email: e.target.value })} placeholder="head@facilities.com" className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs outline-none focus:border-teal-500" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Company Name</label>
                  <input required value={contactForm.company} onChange={e => setContactForm({ ...contactForm, company: e.target.value })} placeholder="Compass Facilities Services" className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs outline-none focus:border-teal-500" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Message</label>
                  <textarea rows={3} value={contactForm.message} onChange={e => setContactForm({ ...contactForm, message: e.target.value })} placeholder="Mention specific facility locations or machinery requirements..." className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs outline-none focus:border-teal-500" />
                </div>
                <button type="submit" className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all">
                  Submit Facilities Demo Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Standardized Footer */}
      <StandardFooter />
    </div>
  );
}
