'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Factory,
  Handshake,
  Users2,
  ShoppingCart,
  Boxes,
  Database,
  Building2,
  Landmark,
  Workflow,
  ShieldCheck,
  Activity,
  Bot,
  LogIn,
  ArrowRight,
  Lock,
  Mail,
  Building,
  KeyRound,
  ExternalLink
} from 'lucide-react';

export default function CentralLoginPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [selectedModule, setSelectedModule] = useState('/dashboard');
  const [loading, setLoading] = useState(false);

  const modulesList = [
    { id: 'dashboard', title: 'Operations Dashboard', path: '/dashboard', icon: <Bot className="w-5 h-5 text-blue-600" />, category: 'Intelligence' },
    { id: 'ops-core', title: 'Vertex OPS Core', path: '/erp', icon: <Factory className="w-5 h-5 text-indigo-600" />, category: 'Operations' },
    { id: 'crm', title: 'CRM & Bidding', path: '/crm', icon: <Handshake className="w-5 h-5 text-emerald-600" />, category: 'Commercial' },
    { id: 'hrm', title: 'HRM & Workforce', path: '/hrm/login', icon: <Users2 className="w-5 h-5 text-rose-600" />, category: 'Workforce' },
    { id: 'procurement', title: 'Vertex Procurement', path: '/procurement', icon: <ShoppingCart className="w-5 h-5 text-amber-600" />, category: 'Supply Chain' },
    { id: 'inventory', title: 'Inventory & Depots', path: '/inventory', icon: <Boxes className="w-5 h-5 text-cyan-600" />, category: 'Logistics' },
    { id: 'master-data', title: 'Master Data Hub', path: '/master-data', icon: <Database className="w-5 h-5 text-purple-600" />, category: 'Core Specs' },
    { id: 'facilities', title: 'Facilities & Assets', path: '/facilities', icon: <Building2 className="w-5 h-5 text-teal-600" />, category: 'Assets' },
    { id: 'finance', title: 'Finance & Accounts', path: '/finance', icon: <Landmark className="w-5 h-5 text-green-600" />, category: 'Ledger' },
    { id: 'workflows', title: 'Workflows Engine', path: '/workflows', icon: <Workflow className="w-5 h-5 text-orange-600" />, category: 'Clearance' },
    { id: 'admin', title: 'Platform Admin', path: '/admin', icon: <ShieldCheck className="w-5 h-5 text-violet-600" />, category: 'Security' },
    { id: 'site-iq', title: 'Site IQ Telemetry', path: '/site-iq', icon: <Activity className="w-5 h-5 text-sky-600" />, category: 'IoT Stream' },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push(selectedModule);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Header Navbar */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center shrink-0 group">
            <img src="/logo.png" alt="VOC Vertex" className="h-9 md:h-10 w-auto object-contain transition-transform group-hover:scale-105" />
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors"
            >
              Home
            </Link>

            <Link
              href="/#contact"
              className="text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors hidden sm:block"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        {/* Title Badge */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-red-600">
            <span className="h-px w-6 bg-red-600/50" />
            Central Sign In &amp; Module Directory
            <span className="h-px w-6 bg-red-600/50" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
            VOC Vertex Enterprise Gateway
          </h1>
          <p className="text-sm text-slate-600 font-light">
            Sign in with your organization credentials to access your workspace portals.
          </p>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-12 items-start">
          
          {/* Left Side: Enterprise Sign In Form */}
          <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="font-display text-xl font-bold text-slate-900">Portal Sign In</h2>
                <p className="text-xs text-slate-500 font-light mt-0.5">Enter organization email &amp; password</p>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                <Lock className="w-5 h-5" />
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-blue-600" />
                  <span>Company / Organization ID</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter Organization ID"
                  value={companyId}
                  onChange={e => setCompanyId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                  <span>Username or Work Email</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter username or work email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                  <span>Password</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Target Application Landing
                </label>
                <select
                  value={selectedModule}
                  onChange={e => setSelectedModule(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                >
                  {modulesList.map(mod => (
                    <option key={mod.id} value={mod.path}>
                      {mod.title} ({mod.category})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-slate-900 hover:bg-transparent text-white hover:text-slate-900 border border-slate-900 font-semibold text-xs rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md mt-2"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In to Selected Portal</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Side: Direct Module Access Links */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-slate-900">Direct Module Links</h2>
                <p className="text-xs text-slate-500 font-light mt-0.5">Application portals directory</p>
              </div>
              <span className="px-3 py-1 bg-blue-50 text-blue-600 font-semibold text-xs rounded-full">
                12 Modules Available
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {modulesList.map(mod => (
                <Link
                  key={mod.id}
                  href={mod.path}
                  className="group flex items-start gap-4 p-4 bg-white rounded-2xl border border-slate-200 hover:border-blue-600 hover:shadow-lg transition-all duration-200"
                >
                  <div className="p-3 rounded-xl bg-slate-50 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {mod.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                        {mod.title}
                      </p>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
                    </div>
                    <p className="text-[11px] text-slate-500 font-light mt-0.5">
                      Category: <span className="font-medium text-slate-700">{mod.category}</span>
                    </p>
                    <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Launch Portal</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-slate-900">Need custom enterprise access?</p>
                <p className="text-[11px] text-slate-500 font-light mt-0.5">Our support engineers can configure dedicated single-sign-on (SAML / OAuth2).</p>
              </div>
              <Link
                href="/#contact"
                className="px-5 py-2.5 bg-slate-900 text-white font-semibold text-xs rounded-full shrink-0 hover:scale-105 transition-transform"
              >
                Contact Support
              </Link>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
