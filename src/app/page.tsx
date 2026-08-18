'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';
import {
  Factory,
  HardHat,
  Building2,
  Users,
  ShoppingCart,
  Boxes,
  Database,
  Landmark,
  Workflow,
  ShieldCheck,
  Activity,
  Bot,
  ArrowRight,
  Check,
  ChevronDown,
  Mail,
  Sun,
  Moon,
  Menu,
  X,
  CheckCircle2,
  Handshake,
  CheckSquare,
  Square,
  Sparkles
} from 'lucide-react';

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Industry Preset Switcher State
  const [activeIndustryTab, setActiveIndustryTab] = useState<'manufacturing' | 'infra' | 'facilities'>('manufacturing');

  // Interactive Module Selection State for Industry Builder
  const [selectedBuilderModules, setSelectedBuilderModules] = useState<{ [key: string]: string[] }>({
    manufacturing: ['Vertex ERP', 'Vertex Inventory & Warehouse', 'Vertex Procurement', 'Vertex Master Data Hub', 'Vertex Finance & Accounts'],
    infra: ['Vertex Facilities & Assets', 'Vertex ERP', 'Vertex Procurement', 'Vertex Workflows Engine', 'Vertex Finance & Accounts'],
    facilities: ['Vertex Facilities & Assets', 'Vertex HRM & Workforce', 'Vertex Procurement', 'Vertex Inventory & Warehouse', 'Vertex Workflows Engine']
  });

  // Interactive Quote / Demo Modal State
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [quoteTargetModule, setQuoteTargetModule] = useState<string>('Custom Industry Package');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    company: '',
    industry: 'Manufacturing',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // All Available 12 Modules
  const standaloneModules = [
    {
      id: 'erp',
      number: '01',
      title: 'Vertex ERP',
      subtitle: 'MRP II Scheduling',
      description: 'MRP II scheduling, multi-plant capacity utilization and cost-center ledgers with full audit exports.',
      features: ['Multi-plant production scheduling', 'Capacity & load balancing', 'Cost-center ledgers & PDF audits'],
      icon: <Factory className="w-5 h-5 text-blue-600" />
    },
    {
      id: 'crm',
      number: '02',
      title: 'Vertex CRM & Bidding',
      subtitle: 'Commercial Pipeline',
      description: 'Track industrial bid pipelines, manage multi-version quotes, Kanban deal boards and contracts.',
      features: ['RFQ & multi-version quoting', 'Kanban bid pipeline', 'Contracts & renewals'],
      icon: <Handshake className="w-5 h-5 text-blue-600" />
    },
    {
      id: 'hrm',
      number: '03',
      title: 'Vertex HRM & Workforce',
      subtitle: 'Shift Rosters & Payroll',
      description: 'Coordinate crew rotations, track safety certifications, EPF/ESI forms and automated shift payroll.',
      features: ['Shift rostering & rotations', 'Safety certification tracking', 'Automated payroll (EPF/ESI)'],
      icon: <Users className="w-5 h-5 text-blue-600" />
    },
    {
      id: 'procurement',
      number: '04',
      title: 'Vertex Procurement',
      subtitle: '3-Way Match Sourcing',
      description: 'Automate high-volume sourcing with 3-way match auditing and supplier scorecard reliability.',
      features: ['Purchase requisitions & POs', '3-way match auditor', 'Supplier scorecards'],
      icon: <ShoppingCart className="w-5 h-5 text-blue-600" />
    },
    {
      id: 'inventory',
      number: '05',
      title: 'Vertex Inventory & Warehouse',
      subtitle: 'Stock Balances & Valuation',
      description: 'Real-time stock tracking, FIFO/LIFO valuation and minimum-stock reorder alerts across warehouses.',
      features: ['Bin & lot-level tracking', 'FIFO/LIFO valuation', 'Reorder-point alerts'],
      icon: <Boxes className="w-5 h-5 text-blue-600" />
    },
    {
      id: 'master-data',
      number: '06',
      title: 'Vertex Master Data Hub',
      subtitle: 'Central Spec Repository',
      description: 'Centralized catalog specs, rebar grades, chemical inventory, and vendor profiles.',
      features: ['Rebar grade & chemical specs', 'Deduplication sanitizer', 'Global barcode indexing'],
      icon: <Database className="w-5 h-5 text-blue-600" />
    },
    {
      id: 'facilities',
      number: '07',
      title: 'Vertex Facilities & Assets',
      subtitle: 'Heavy Machinery Servicing',
      description: 'Heavy machinery tracking (scrubbers, jet washers), preventive maintenance, site transfers, straight-line depreciation.',
      features: ['Heavy machinery asset registers', 'Preventive servicing schedules', 'Straight-line depreciation'],
      icon: <Building2 className="w-5 h-5 text-blue-600" />
    },
    {
      id: 'finance',
      number: '08',
      title: 'Vertex Finance & Accounts',
      subtitle: 'General Ledger & Budgets',
      description: 'Supervise accounts-payable ledgers, double-entry journals and capital allocation across projects.',
      features: ['Double-entry journals', 'AP / AR ledgers', 'CapEx & cost-center control'],
      icon: <Landmark className="w-5 h-5 text-blue-600" />
    },
    {
      id: 'workflows',
      number: '09',
      title: 'Vertex Workflows Engine',
      subtitle: 'Multi-Level Approval Matrix',
      description: 'Multi-level clearance pathways, SLA escalation alerts, audit trail signoff history.',
      features: ['Multi-level clearance pathways', 'SLA escalation alert handlers', 'Audit trail signoff history'],
      icon: <Workflow className="w-5 h-5 text-blue-600" />
    },
    {
      id: 'admin',
      number: '10',
      title: 'Vertex Platform Admin',
      subtitle: 'Security & Access Matrix',
      description: 'Multi-tenant security isolation, user roles (RBAC), developer API key generator.',
      features: ['Multi-tenant schema isolation', 'Role-based access matrix', 'Developer API key generator'],
      icon: <ShieldCheck className="w-5 h-5 text-blue-600" />
    },
    {
      id: 'site-iq',
      number: '11',
      title: 'Vertex Site IQ',
      subtitle: 'IoT Telemetry Stream',
      description: 'Live telemetry stream analyzer, predictive maintenance alerts, multi-site IoT dashboard.',
      features: ['Live telemetry stream analyzer', 'Predictive maintenance alerts', 'Multi-site IoT dashboard'],
      icon: <Activity className="w-5 h-5 text-blue-600" />
    },
    {
      id: 'dashboard',
      number: '12',
      title: 'Vertex Operations Dashboard',
      subtitle: 'Real-Time Intelligence',
      description: 'Query database records, analyze stock warnings, review PO approvals, instant executive PDF reports.',
      features: ['Real-time database query engine', 'Automated stock & PO auditor', 'Instant executive PDF reports'],
      icon: <Bot className="w-5 h-5 text-blue-600" />
    }
  ];

  // Industry Presets Information
  const industryPackages = {
    manufacturing: {
      title: 'Manufacturing & Plants',
      headline: 'Run the whole plant floor from one control plane',
      description: 'From raw-material intake to finished-goods dispatch, VOC Vertex synchronizes MRP, inventory and quality across every plant in real time.',
      image: 'https://images.unsplash.com/photo-1717386255773-1e3037c81788?q=80&w=1200&auto=format&fit=crop'
    },
    infra: {
      title: 'Infra / EPC Construction',
      headline: 'Site execution, machinery, and sub-contractor control',
      description: 'Streamline heavy machinery allocation, inter-site material transfers, subcontractor work order clearances, and straight-line asset depreciation.',
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop'
    },
    facilities: {
      title: 'Facilities Management',
      headline: 'Multi-site asset maintenance, shift roster & SLAs',
      description: 'Track heavy scrubbing machinery, 200 bar jet washers, site staff rosters, mobile attendance, EPF/ESI statutory forms, and client SLAs.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop'
    }
  };

  const currentIndustry = industryPackages[activeIndustryTab];
  const activeModulesList = selectedBuilderModules[activeIndustryTab] || [];

  const toggleModuleSelection = (moduleTitle: string) => {
    setSelectedBuilderModules(prev => {
      const currentList = prev[activeIndustryTab] || [];
      const updatedList = currentList.includes(moduleTitle)
        ? currentList.filter(m => m !== moduleTitle)
        : [...currentList, moduleTitle];
      return { ...prev, [activeIndustryTab]: updatedList };
    });
  };

  const openQuoteModalForModule = (targetName: string, customMessage?: string) => {
    setQuoteTargetModule(targetName);
    setContactForm(prev => ({
      ...prev,
      message: customMessage || `Requesting custom price quote & live demo for ${targetName}. Please email complete licensing proposal to my work email.`
    }));
    setIsContactModalOpen(true);
  };

  const openIndustryQuoteModal = () => {
    const selectedListStr = activeModulesList.join(', ');
    const msg = `Requesting custom price quote for ${currentIndustry.title} Package with the following selected modules:\n- ${activeModulesList.join('\n- ')}\n\nPlease provide itemized licensing proposal and rollout schedule.`;
    openQuoteModalForModule(`${currentIndustry.title} (${activeModulesList.length} Modules)`, msg);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setFormSubmitted(true);
    }, 800);
  };

  const resetContactForm = () => {
    setFormSubmitted(false);
    setContactForm({
      name: '',
      email: '',
      company: '',
      industry: 'Manufacturing',
      message: ''
    });
  };

  return (
    <div className="App relative min-h-screen bg-[#fcfcfd] dark:bg-[#070b12] text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden">
      
      {/* 1. Header Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 bg-white/80 dark:bg-[#070b12]/80 backdrop-blur-xl border-b border-slate-200/70 dark:border-slate-800/70">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="h-[72px] flex items-center justify-between gap-8">
            <Link className="flex items-center shrink-0" href="/">
              <img alt="VOC Vertex" className="h-9 w-auto object-contain" src="/logo.png" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 relative">
              
              {/* MODULES HOVER DROPDOWN */}
              <div className="relative group">
                <button className="group inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold transition-colors text-slate-700 dark:text-slate-300 hover:text-blue-600 cursor-pointer">
                  <span>Modules</span>
                  <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180 text-slate-400" />
                </button>

                <div className="absolute top-full left-0 mt-1 w-[680px] p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 grid grid-cols-2 gap-3 max-h-[80vh] overflow-y-auto">
                  {standaloneModules.map((mod) => (
                    <button
                      key={mod.id}
                      onClick={() => openQuoteModalForModule(mod.title)}
                      className="flex items-start gap-3 p-3 rounded-2xl hover:bg-blue-50/80 dark:hover:bg-slate-800/80 transition-colors text-left group/item cursor-pointer"
                    >
                      <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 shrink-0 group-hover/item:bg-blue-600 group-hover/item:text-white transition-colors">
                        {mod.icon}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white group-hover/item:text-blue-600 transition-colors">
                          {mod.title}
                        </p>
                        <p className="text-[11px] text-slate-500 font-light mt-0.5 line-clamp-1">
                          {mod.subtitle}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* INDUSTRIES HOVER DROPDOWN */}
              <div className="relative group">
                <button className="group inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold transition-colors text-slate-700 dark:text-slate-300 hover:text-blue-600 cursor-pointer">
                  <span>Industries</span>
                  <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180 text-slate-400" />
                </button>

                <div className="absolute top-full left-0 mt-1 w-[420px] p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 space-y-3">
                  <Link
                    href="/industry/manufacturing"
                    className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-blue-50/80 dark:hover:bg-slate-800/80 transition-colors group/ind"
                  >
                    <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 shrink-0 group-hover/ind:bg-blue-600 group-hover/ind:text-white transition-colors">
                      <Factory className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white group-hover/ind:text-blue-600 transition-colors">
                        Manufacturing &amp; Plants
                      </p>
                      <p className="text-[11px] text-slate-500 font-light mt-0.5">
                        MRP II scheduling, plant inventory &amp; quality control.
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/industry/infra"
                    className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-blue-50/80 dark:hover:bg-slate-800/80 transition-colors group/ind"
                  >
                    <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 shrink-0 group-hover/ind:bg-blue-600 group-hover/ind:text-white transition-colors">
                      <HardHat className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white group-hover/ind:text-blue-600 transition-colors">
                        Infra / EPC Construction
                      </p>
                      <p className="text-[11px] text-slate-500 font-light mt-0.5">
                        Machinery allocation, subcontractor work orders &amp; site transfers.
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/industry/facilities"
                    className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-blue-50/80 dark:hover:bg-slate-800/80 transition-colors group/ind"
                  >
                    <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 shrink-0 group-hover/ind:bg-blue-600 group-hover/ind:text-white transition-colors">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white group-hover/ind:text-blue-600 transition-colors">
                        Facilities Management
                      </p>
                      <p className="text-[11px] text-slate-500 font-light mt-0.5">
                        Heavy scrubbing machinery, shift roster &amp; client SLAs.
                      </p>
                    </div>
                  </Link>
                </div>
              </div>

              <Link href="/pricing" className="px-4 py-2 rounded-full text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 transition-colors">
                Pricing
              </Link>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 transition-colors"
              >
                Log in
              </Link>

              <button
                onClick={() => openQuoteModalForModule('Enterprise Get Started')}
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-5 py-2.5 text-sm font-semibold transition-transform duration-300 hover:scale-[1.03] cursor-pointer shadow-md"
              >
                <span>Get started</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-800 dark:text-slate-200"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4 space-y-3">
            <a href="#modules" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-slate-700 dark:text-slate-300 py-1">Modules</a>
            <a href="#industry-presets" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-slate-700 dark:text-slate-300 py-1">Industries</a>
            <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-slate-700 dark:text-slate-300 py-1">Pricing</Link>
            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex flex-col gap-2">
              <Link href="/login" className="w-full text-center py-2 text-sm font-semibold text-slate-700 dark:text-slate-300">Log in</Link>
              <button onClick={() => { setMobileMenuOpen(false); openQuoteModalForModule('Enterprise Get Started'); }} className="w-full py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-semibold rounded-full">Get started</button>
            </div>
          </div>
        )}
      </header>

      {/* 2. Hero Section - NO STATS displayed */}
      <main className="relative z-10">
        <div>
          <section className="relative overflow-hidden grid-lines">
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50/60 via-white to-white dark:from-slate-950 dark:via-[#070b12] dark:to-[#070b12]" />
            <div className="max-w-7xl mx-auto px-6 md:px-10 pt-36 md:pt-44 pb-20">
              <div>
                <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-red-600 dark:text-red-400">
                  <span className="h-px w-6 bg-red-600/50" />
                  Enterprise Multi-Tenant Platform
                </span>
              </div>
              <h1 className="mt-7 font-display text-[11vw] sm:text-7xl lg:text-8xl font-semibold tracking-tighter text-slate-900 dark:text-white leading-[0.92]">
                <span className="block overflow-hidden">
                  <span className="block">The vertex of</span>
                </span>
                <span className="block overflow-hidden">
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500">
                    enterprise modularity
                  </span>
                </span>
              </h1>

              <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
                <p className="lg:col-span-6 text-lg leading-relaxed text-slate-600 dark:text-slate-300 max-w-xl font-light">
                  VOC Vertex builds modular operational systems and automated data pipelines. Deploy individual business applications — or a curated industry package — that adapt their workflows to how you actually run operations.
                </p>

                <div className="lg:col-span-6 flex flex-wrap items-center gap-4 lg:justify-end">
                  <button
                    onClick={() => openQuoteModalForModule('Complete Platform Bundle')}
                    className="inline-flex items-center gap-2 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-6 py-3 text-sm font-semibold transition-transform duration-300 hover:scale-[1.03] cursor-pointer shadow-lg"
                  >
                    <span>Get started</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <a
                    href="#modules"
                    className="inline-flex items-center gap-2 rounded-full border border-slate-300 dark:border-slate-700 px-6 py-3 text-sm font-semibold text-slate-800 dark:text-slate-200 transition-colors hover:border-blue-600 hover:text-blue-600"
                  >
                    Explore modules
                  </a>
                </div>
              </div>

              {/* Hero Banner Image WITHOUT stats */}
              <div className="relative mt-16 md:mt-20 overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-[0_50px_120px_-50px_rgba(15,23,42,0.5)]">
                <div className="relative h-[38vh] md:h-[55vh] w-full overflow-hidden">
                  <img
                    alt="Industrial operations"
                    className="absolute inset-0 h-[120%] w-full object-cover"
                    src="https://images.unsplash.com/photo-1717386255773-1e3037c81788?q=80&w=1600&auto=format&fit=crop"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 flex items-end justify-between gap-6">
                    <div>
                      <p className="font-display text-2xl md:text-3xl font-semibold text-white tracking-tight">One platform. Every operation.</p>
                      <p className="mt-2 text-sm text-white/80 font-light">Manufacturing · Infrastructure &amp; EPC · Facilities Management</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Marquee Banner */}
          <section className="relative z-10 border-y border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 py-8 overflow-hidden">
            <div className="flex w-max animate-marquee whitespace-nowrap">
              {['Enterprise ERP', 'Intelligent CRM', 'Facilities Control', 'Procurement & Logistics', 'AI Copilot', 'Multi-Plant Ops', 'Enterprise ERP', 'Intelligent CRM', 'Facilities Control', 'Procurement & Logistics', 'AI Copilot', 'Multi-Plant Ops'].map((item, idx) => (
                <div key={idx} className="flex items-center">
                  <span className="font-display text-2xl md:text-4xl font-semibold tracking-tight text-slate-900/80 dark:text-slate-200/80 px-10">
                    {item}
                  </span>
                  <span className="h-2 w-2 rounded-full bg-red-600" />
                </div>
              ))}
            </div>
          </section>

          {/* 4. Industry Builder with Module Selection & Request for Quote */}
          <section id="industry-presets" className="max-w-7xl mx-auto px-6 md:px-10 py-24 md:py-32">
            <div className="max-w-2xl">
              <div>
                <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-red-600 dark:text-red-400">
                  <span className="h-px w-6 bg-red-600/50" />
                  Dynamic Industry Builder
                </span>
              </div>
              <h2 className="mt-5 font-display text-4xl md:text-5xl font-semibold tracking-tight text-slate-900 dark:text-white">
                Configure your sector package &amp; request quote
              </h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 font-light">
                Select an industry sector, customize the module bundle required for your operations, and instantly submit a request for an itemized quote.
              </p>
            </div>

            {/* Industry Switcher Tabs */}
            <div className="mt-10 flex flex-wrap gap-3">
              {[
                { key: 'manufacturing', label: 'Manufacturing', icon: <Factory className="h-4 w-4" /> },
                { key: 'infra', label: 'Infra / EPC', icon: <HardHat className="h-4 w-4" /> },
                { key: 'facilities', label: 'Facilities', icon: <Building2 className="h-4 w-4" /> }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveIndustryTab(tab.key as any)}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 cursor-pointer ${
                    activeIndustryTab === tab.key
                      ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md'
                      : 'border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-600 hover:text-blue-600'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Selected Industry Card with Interactive Module Builder */}
            <div className="mt-10 grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-5 relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg">
                <img
                  alt={currentIndustry.title}
                  className="h-72 lg:h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  src={currentIndustry.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="font-display text-2xl font-semibold text-white">{currentIndustry.title}</p>
                  <p className="text-xs text-white/80 font-light mt-1">{currentIndustry.headline}</p>
                </div>
              </div>

              <div className="lg:col-span-7 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 md:p-10 shadow-sm flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div>
                      <h3 className="font-display text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                        {currentIndustry.title} Module Builder
                      </h3>
                      <p className="text-xs text-slate-500 font-light mt-0.5">Select modules to include in your custom quote</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-slate-800 text-blue-600 text-xs font-bold">
                      {activeModulesList.length} Modules Selected
                    </span>
                  </div>

                  {/* Module Checkbox Options */}
                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
                    {standaloneModules.map((mod) => {
                      const isSelected = activeModulesList.includes(mod.title);
                      return (
                        <div
                          key={mod.id}
                          onClick={() => toggleModuleSelection(mod.title)}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50/60 dark:bg-slate-800/80 text-slate-900 dark:text-white shadow-xs'
                              : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={isSelected ? 'text-blue-600' : 'text-slate-400'}>
                              {isSelected ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4" />}
                            </span>
                            <span className="text-xs font-semibold line-clamp-1">{mod.title}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Request Quote Button */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-slate-500 font-light">Customized Bundle</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{activeModulesList.length} Modules for {currentIndustry.title}</p>
                  </div>

                  <button
                    onClick={openIndustryQuoteModal}
                    className="inline-flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-xs font-bold transition-transform duration-300 hover:scale-[1.03] cursor-pointer shadow-lg"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Request Quote for Selected Modules</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 5. Twelve Standalone Modules Catalog */}
          <section id="modules" className="max-w-7xl mx-auto px-6 md:px-10 py-24 md:py-32">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div className="max-w-2xl">
                <div>
                  <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-red-600 dark:text-red-400">
                    <span className="h-px w-6 bg-red-600/50" />
                    Platform Capabilities
                  </span>
                </div>
                <h2 className="mt-5 font-display text-4xl md:text-5xl font-semibold tracking-tight text-slate-900 dark:text-white">
                  Twelve standalone modules, one intelligent spine
                </h2>
              </div>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {standaloneModules.map((mod) => (
                <div key={mod.id} className="group flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-700 justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                        {mod.icon}
                      </span>
                      <span className="font-mono text-xs text-slate-400 font-bold">{mod.number}</span>
                    </div>

                    <h3 className="mt-6 font-display text-xl font-semibold tracking-tight text-slate-900 dark:text-white">{mod.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400 font-light">{mod.description}</p>

                    <ul className="mt-5 space-y-2">
                      {mod.features.map((feat, fidx) => (
                        <li key={fidx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 font-light">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-red-600" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => openQuoteModalForModule(mod.title)}
                      className="w-full py-2.5 rounded-xl bg-blue-50 dark:bg-slate-800 hover:bg-blue-600 text-blue-600 hover:text-white transition-all text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Request Quote &amp; Demo</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 6. Our Architecture Section */}
          <section id="architecture" className="bg-slate-950 text-white relative z-10">
            <div className="max-w-7xl mx-auto px-6 md:px-10 py-24 md:py-32">
              <div>
                <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-red-500">
                  <span className="h-px w-6 bg-red-500/50" />
                  Our Architecture
                </span>
              </div>
              <h2 className="mt-5 max-w-3xl font-display text-4xl md:text-5xl font-semibold tracking-tight">
                Transitioning traditional IT into autonomous control
              </h2>

              <div className="mt-16 grid gap-px overflow-hidden rounded-2xl bg-white/10 md:grid-cols-3">
                <div className="bg-slate-950 p-8 md:p-10">
                  <p className="font-mono text-sm text-red-500 font-bold">01</p>
                  <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight">Decoupled by design</h3>
                  <p className="mt-4 text-sm leading-relaxed text-slate-400 font-light">
                    Every module runs standalone yet shares one master-data spine. Start with a single application, scale to a full suite without a re-implementation.
                  </p>
                </div>
                <div className="bg-slate-950 p-8 md:p-10">
                  <p className="font-mono text-sm text-red-500 font-bold">02</p>
                  <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight">Feedback-driven loops</h3>
                  <p className="mt-4 text-sm leading-relaxed text-slate-400 font-light">
                    Live telemetry from the shop floor, the site and the supply chain feeds predictive models. When stock dips below reorder points, procurement is alerted automatically.
                  </p>
                </div>
                <div className="bg-slate-950 p-8 md:p-10">
                  <p className="font-mono text-sm text-red-500 font-bold">03</p>
                  <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight">Built for enterprise scale</h3>
                  <p className="mt-4 text-sm leading-relaxed text-slate-400 font-light">
                    A multi-tenant, microservice architecture engineered to support concurrent updates across plants, projects and facilities.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 7. Ready to see Vertex CTA Section */}
          <section id="contact" className="max-w-7xl mx-auto px-6 md:px-10 py-24 md:py-32">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-blue-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 p-8 md:p-16 shadow-xl">
              <div className="relative z-10 max-w-2xl">
                <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight text-slate-900 dark:text-white">
                  Ready to see Vertex on your operations?
                </h2>
                <p className="mt-5 text-lg text-slate-600 dark:text-slate-300 font-light leading-relaxed">
                  Get a custom trial configured for your team, or create your account and choose the modules that fit your operation.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <button
                    onClick={() => openQuoteModalForModule('Enterprise Trial')}
                    className="inline-flex items-center gap-2 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-6 py-3 text-sm font-semibold transition-transform duration-300 hover:scale-[1.03] cursor-pointer shadow-md"
                  >
                    <span>Get started</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => openQuoteModalForModule('Custom Demo Request')}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-300 dark:border-slate-700 px-6 py-3 text-sm font-semibold text-slate-800 dark:text-slate-200 transition-colors hover:border-blue-600 hover:text-blue-600 cursor-pointer"
                  >
                    Request a demo
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* 8. Interactive Request Quote or Demo Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4">
          <div className="glass-card w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-2xl space-y-6 relative">
            <button
              onClick={() => { setIsContactModalOpen(false); resetContactForm(); }}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full bg-slate-100 dark:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">Enterprise Proposal</span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">Request Quote or Demo</h2>
              <p className="text-xs text-slate-500 font-light mt-0.5">Target Module: <strong className="text-blue-600">{quoteTargetModule}</strong></p>
            </div>

            {formSubmitted ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-2xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Thank you! Your quote request has been received. An itemized proposal will be emailed to your address shortly.</span>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Your Full Name</label>
                  <input
                    required
                    value={contactForm.name}
                    onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs outline-none focus:border-blue-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Work Email Address</label>
                  <input
                    required
                    type="email"
                    value={contactForm.email}
                    onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="john@company.com"
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs outline-none focus:border-blue-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Company / Organization</label>
                  <input
                    required
                    value={contactForm.company}
                    onChange={e => setContactForm({ ...contactForm, company: e.target.value })}
                    placeholder="Acme Industrial Ltd"
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs outline-none focus:border-blue-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Custom Message / Selected Modules</label>
                  <textarea
                    rows={4}
                    value={contactForm.message}
                    onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Mention specific user licenses, plant locations, or integration requirements..."
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs outline-none focus:border-blue-600 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  {submitting ? 'Submitting Request...' : 'Send Enterprise Quote Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 9. Footer */}
      <footer className="relative z-10 bg-slate-950 text-slate-300">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-20">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4 space-y-6">
              <div className="inline-flex items-center rounded-xl bg-white px-3 py-2">
                <img alt="VOC Vertex" className="h-7 w-auto object-contain" src="/logo.png" />
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-slate-400 font-light">
                The vertex of enterprise modularity. Deploy standalone business applications or an industry-tailored package on one intelligent operations platform.
              </p>
              <div>
                <Link
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-white/15 transition-colors hover:bg-white/20"
                  href="/login"
                >
                  <span>Log in to platform</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
              <div>
                <p className="uppercase tracking-[0.2em] font-semibold text-slate-500">Modules</p>
                <ul className="mt-4 space-y-2.5 font-light">
                  <li><button onClick={() => openQuoteModalForModule('Vertex ERP')} className="hover:text-white transition-colors text-left cursor-pointer">ERP</button></li>
                  <li><button onClick={() => openQuoteModalForModule('Vertex CRM & Bidding')} className="hover:text-white transition-colors text-left cursor-pointer">CRM &amp; Bidding</button></li>
                  <li><button onClick={() => openQuoteModalForModule('Vertex HRM & Workforce')} className="hover:text-white transition-colors text-left cursor-pointer">HRM &amp; Workforce</button></li>
                  <li><button onClick={() => openQuoteModalForModule('Vertex Procurement')} className="hover:text-white transition-colors text-left cursor-pointer">Procurement</button></li>
                  <li><button onClick={() => openQuoteModalForModule('Vertex Inventory & Warehouse')} className="hover:text-white transition-colors text-left cursor-pointer">Inventory &amp; Warehouse</button></li>
                  <li><button onClick={() => openQuoteModalForModule('Vertex Finance & Accounts')} className="hover:text-white transition-colors text-left cursor-pointer">Finance &amp; Accounts</button></li>
                </ul>
              </div>

              <div>
                <p className="uppercase tracking-[0.2em] font-semibold text-slate-500">More modules</p>
                <ul className="mt-4 space-y-2.5 font-light">
                  <li><button onClick={() => openQuoteModalForModule('Vertex Master Data Hub')} className="hover:text-white transition-colors text-left cursor-pointer">Master Data</button></li>
                  <li><button onClick={() => openQuoteModalForModule('Vertex Site IQ')} className="hover:text-white transition-colors text-left cursor-pointer">Project &amp; Site IQ</button></li>
                  <li><button onClick={() => openQuoteModalForModule('Vertex Workflows Engine')} className="hover:text-white transition-colors text-left cursor-pointer">Workflow Automation</button></li>
                  <li><button onClick={() => openQuoteModalForModule('Vertex Platform Admin')} className="hover:text-white transition-colors text-left cursor-pointer">Platform Admin</button></li>
                </ul>
              </div>

              <div>
                <p className="uppercase tracking-[0.2em] font-semibold text-slate-500">Industries</p>
                <ul className="mt-4 space-y-2.5 font-light">
                  <li><Link className="hover:text-white transition-colors" href="/industry/manufacturing">Manufacturing &amp; Plants</Link></li>
                  <li><Link className="hover:text-white transition-colors" href="/industry/infra">Infrastructure &amp; EPC</Link></li>
                  <li><Link className="hover:text-white transition-colors" href="/industry/facilities">Facilities Management</Link></li>
                </ul>
              </div>

              <div>
                <p className="uppercase tracking-[0.2em] font-semibold text-slate-500">Company</p>
                <ul className="mt-4 space-y-2.5 font-light">
                  <li><Link className="hover:text-white transition-colors" href="/pricing">Pricing</Link></li>
                  <li><button onClick={() => openQuoteModalForModule('Footer Contact Sales')} className="hover:text-white transition-colors text-left cursor-pointer">Contact sales</button></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-slate-500">
            <p>© 2026 VOC Vertex. Intelligent operational systems for modern enterprise infrastructure.</p>
            <div className="flex items-center gap-6">
              <span>Privacy</span>
              <span>Terms</span>
              <span>Security</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
