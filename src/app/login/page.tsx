'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
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
  Sun,
  Moon,
  Lock,
  Mail,
  Building,
  KeyRound,
  ExternalLink,
  Shield,
  CheckCircle2
} from 'lucide-react';

export default function CentralLoginPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [selectedModule, setSelectedModule] = useState('/dashboard');
  const [loading, setLoading] = useState(false);

  const modulesList = [
    { id: 'dashboard', title: 'Operations Dashboard', path: '/dashboard', icon: <Bot className="w-5 h-5 text-blue-500" />, category: 'Intelligence' },
    { id: 'erp', title: 'Vertex ERP', path: '/erp', icon: <Factory className="w-5 h-5 text-indigo-500" />, category: 'Operations' },
    { id: 'crm', title: 'CRM & Bidding', path: '/crm', icon: <Handshake className="w-5 h-5 text-emerald-500" />, category: 'Commercial' },
    { id: 'hrm', title: 'HRM & Workforce', path: '/hrm/login', icon: <Users2 className="w-5 h-5 text-rose-500" />, category: 'Workforce' },
    { id: 'procurement', title: 'Vertex Procurement', path: '/procurement', icon: <ShoppingCart className="w-5 h-5 text-amber-500" />, category: 'Supply Chain' },
    { id: 'inventory', title: 'Inventory & Depots', path: '/inventory', icon: <Boxes className="w-5 h-5 text-cyan-500" />, category: 'Logistics' },
    { id: 'master-data', title: 'Master Data Hub', path: '/master-data', icon: <Database className="w-5 h-5 text-purple-500" />, category: 'Core Specs' },
    { id: 'facilities', title: 'Facilities & Assets', path: '/facilities', icon: <Building2 className="w-5 h-5 text-teal-500" />, category: 'Assets' },
    { id: 'finance', title: 'Finance & Accounts', path: '/finance', icon: <Landmark className="w-5 h-5 text-green-500" />, category: 'Ledger' },
    { id: 'workflows', title: 'Workflows Engine', path: '/workflows', icon: <Workflow className="w-5 h-5 text-orange-500" />, category: 'Clearance' },
    { id: 'admin', title: 'Platform Admin', path: '/admin', icon: <ShieldCheck className="w-5 h-5 text-violet-500" />, category: 'Security' },
    { id: 'site-iq', title: 'Site IQ Telemetry', path: '/site-iq', icon: <Activity className="w-5 h-5 text-sky-500" />, category: 'IoT Stream' },
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
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-[#070b12] text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Header Navbar */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#070b12]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center shrink-0 group">
            <img src="/logo.png" alt="VOC Vertex" className="h-8 w-auto object-contain transition-transform group-hover:scale-105" />
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <Link
              href="/#contact"
              className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-blue transition-colors hidden sm:block"
            >
              Contact Support
            </Link>

            <Link
              href="/"
              className="px-4 py-2 text-xs font-semibold rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-800 dark:text-slate-200"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        
        {/* Title Badge */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-brand-crimson">
            <span className="h-px w-6 bg-brand-crimson/50" />
            Central Sign In &amp; Module Directory
            <span className="h-px w-6 bg-brand-crimson/50" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
            VOC Vertex Enterprise Gateway
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-light">
            Sign in with your organization credentials to access your workspace portals.
          </p>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-12 items-start">
          
          {/* Left Side: Enterprise Sign In Form */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">Portal Sign In</h2>
                <p className="text-xs text-slate-500 font-light mt-0.5">Enter organization email &amp; password</p>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-slate-800 text-brand-blue">
                <Lock className="w-5 h-5" />
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-brand-blue" />
                  <span>Company / Organization ID</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter Organization ID"
                  value={companyId}
                  onChange={e => setCompanyId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-brand-blue font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-brand-blue" />
                  <span>Username or Work Email</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter username or work email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-brand-blue"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-brand-blue" />
                  <span>Password</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-brand-blue"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Target Application Landing
                </label>
                <select
                  value={selectedModule}
                  onChange={e => setSelectedModule(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-brand-blue font-medium"
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
                className="w-full py-3 bg-brand-ink text-white font-semibold text-xs rounded-xl transition-all duration-300 hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer shadow-md mt-2"
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
                <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Direct Module Links</h2>
                <p className="text-xs text-slate-500 font-light mt-0.5">Application portals directory</p>
              </div>
              <span className="px-3 py-1 bg-blue-50 dark:bg-slate-800 text-brand-blue font-semibold text-xs rounded-full">
                12 Modules Available
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {modulesList.map(mod => (
                <Link
                  key={mod.id}
                  href={mod.path}
                  className="group flex items-start gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-brand-blue dark:hover:border-blue-500 hover:shadow-lg transition-all duration-200"
                >
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 shrink-0 group-hover:bg-brand-blue group-hover:text-white transition-colors">
                    {mod.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-blue transition-colors truncate">
                        {mod.title}
                      </p>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-blue transition-colors shrink-0" />
                    </div>
                    <p className="text-[11px] text-slate-500 font-light mt-0.5">
                      Category: <span className="font-medium text-slate-700 dark:text-slate-300">{mod.category}</span>
                    </p>
                    <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-brand-blue opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Launch Portal</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-slate-900 dark:to-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Need custom enterprise access?</p>
                <p className="text-[11px] text-slate-500 font-light mt-0.5">Our support engineers can configure dedicated single-sign-on (SAML / OAuth2).</p>
              </div>
              <Link
                href="/#contact"
                className="px-5 py-2.5 bg-brand-ink text-white font-semibold text-xs rounded-full shrink-0 hover:scale-105 transition-transform"
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
