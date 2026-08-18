'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';
import {
  Building2,
  Database,
  Users2,
  ShoppingCart,
  Boxes,
  Landmark,
  Sun,
  Moon,
  ArrowRight,
  Check,
  Menu,
  X,
  ChevronDown,
  Workflow,
  ShieldCheck,
  Factory,
  HardHat,
  Handshake,
  Activity,
  Bot,
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  ExternalLink,
  LogIn,
  HelpCircle,
  Layers,
  Sparkles,
  Tag,
  FileText
} from 'lucide-react';

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Contact & Quote Request Form State
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [quoteTargetModule, setQuoteTargetModule] = useState<string>('All Modules Bundle');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    company: '',
    industry: 'Manufacturing',
    selectedModules: [] as string[],
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const openQuoteModalForModule = (moduleTitle: string) => {
    setQuoteTargetModule(moduleTitle);
    setContactForm(prev => ({
      ...prev,
      selectedModules: [moduleTitle],
      message: `Requesting custom price quote & live demo for ${moduleTitle}. Please email complete licensing proposal to my work email.`
    }));
    setIsContactModalOpen(true);
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
      selectedModules: [],
      message: ''
    });
  };

  // Industry Package Data with Dedicated Sector Application Routes
  const industryPackages = [
    {
      key: 'manufacturing',
      title: 'Manufacturing & Plants',
      subtitle: 'Run the whole plant floor from one control plane',
      description: 'From raw-material intake to finished-goods dispatch, VOC Vertex synchronizes MRP II, inventory and quality across every plant in real time.',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop',
      modules: ['ERP', 'Inventory & Warehouse', 'Procurement', 'Master Data', 'Finance & Accounts', 'Operations Dashboard'],
      exploreLink: '/industry/manufacturing'
    },
    {
      key: 'infra',
      title: 'Infra / EPC Construction',
      subtitle: 'Site execution, machinery, and sub-contractor control',
      description: 'Streamline heavy machinery allocation, inter-site material transfers, subcontractor work order clearances, and straight-line asset depreciation.',
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop',
      modules: ['Facilities & Assets', 'ERP', 'Procurement', 'Workflows', 'Finance & Accounts', 'Master Data'],
      exploreLink: '/industry/infra'
    },
    {
      key: 'facilities',
      title: 'Facilities Management',
      subtitle: 'Multi-site asset maintenance, shift roster & SLAs',
      description: 'Track heavy scrubbing machinery, 200 bar jet washers, site staff rosters, mobile attendance, EPF/ESI statutory forms, and client SLAs.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
      modules: ['Facilities & Assets', 'HRM & Workforce', 'Procurement', 'Inventory Depots', 'Finance & Accounts', 'Workflows'],
      exploreLink: '/industry/facilities'
    }
  ];

  // 12 Standalone Modules Catalog
  const standaloneModules = [
    {
      id: 'erp',
      title: 'Vertex ERP',
      subtitle: 'MRP II & Capacity Planning',
      description: 'MRP II scheduling, multi-plant capacity utilization and cost-center ledgers with full audit exports.',
      features: ['Multi-plant production scheduling', 'Capacity & load balancing', 'Cost-center ledgers & PDF audits'],
      icon: <Factory className="w-5 h-5 text-brand-blue" />
    },
    {
      id: 'crm',
      title: 'Vertex CRM & Bidding',
      subtitle: 'Commercial Sales Funnel',
      description: 'Track industrial bid pipelines, manage multi-version quotes, Kanban deal boards and contracts.',
      features: ['RFQ & multi-version quoting', 'Kanban bid pipeline', 'Contracts & renewals'],
      icon: <Handshake className="w-5 h-5 text-brand-blue" />
    },
    {
      id: 'hrm',
      title: 'Vertex HRM & Workforce',
      subtitle: 'Shift Rosters & Statutory Payroll',
      description: 'Coordinate crew rotations, track safety certifications, EPF/ESI forms and automated shift payroll.',
      features: ['Shift rostering & rotations', 'Safety certification tracking', 'Automated payroll (EPF/ESI)'],
      icon: <Users2 className="w-5 h-5 text-brand-blue" />
    },
    {
      id: 'procurement',
      title: 'Vertex Procurement',
      subtitle: 'Procure-to-Pay & 3-Way Audit',
      description: 'Automate high-volume sourcing with 3-way match auditing and supplier scorecard reliability.',
      features: ['Purchase requisitions & POs', '3-way match auditor', 'Supplier scorecards'],
      icon: <ShoppingCart className="w-5 h-5 text-brand-blue" />
    },
    {
      id: 'inventory',
      title: 'Vertex Inventory & Warehouse',
      subtitle: 'Stock Balances & Reorder Alert',
      description: 'Real-time tracking of raw materials and finished stock with FIFO valuation and reorder points.',
      features: ['Depot stock balances & bin allocation', 'FIFO / LIFO valuation calculator', 'Minimum stock reorder warnings'],
      icon: <Boxes className="w-5 h-5 text-brand-blue" />
    },
    {
      id: 'master-data',
      title: 'Vertex Master Data Hub',
      subtitle: 'Central Records Repository',
      description: 'Centralized catalog specs, rebar grades, chemical inventory, and vendor profiles.',
      features: ['Rebar grade & chemical specs', 'Deduplication sanitizer', 'Global barcode indexing'],
      icon: <Database className="w-5 h-5 text-brand-blue" />
    },
    {
      id: 'facilities',
      title: 'Vertex Facilities & Assets',
      subtitle: 'Heavy Machinery & Maintenance',
      description: 'Heavy machinery tracking (scrubbers, jet washers), preventive maintenance, site transfers, straight-line depreciation.',
      features: ['Heavy machinery asset registers', 'Preventive servicing schedules', 'Straight-line depreciation'],
      icon: <Building2 className="w-5 h-5 text-brand-blue" />
    },
    {
      id: 'finance',
      title: 'Vertex Finance & Accounts',
      subtitle: 'General Ledger & Budgets',
      description: 'Double-entry accounting, site profitability audits, accounts payable/receivable, capital expenditure ledgers.',
      features: ['Double-entry journal postings', 'Site margin & profitability audit', 'Capital expenditure ledgers'],
      icon: <Landmark className="w-5 h-5 text-brand-blue" />
    },
    {
      id: 'workflows',
      title: 'Vertex Workflows Engine',
      subtitle: 'Multi-Level Approval Matrix',
      description: 'Multi-level approval pathways, SLA escalation alerts, and audit trail signoffs.',
      features: ['Multi-level clearance pathways', 'SLA escalation alert handlers', 'Audit trail signoff history'],
      icon: <Workflow className="w-5 h-5 text-brand-blue" />
    },
    {
      id: 'admin',
      title: 'Vertex Platform Admin',
      subtitle: 'Tenant & Security Controls',
      description: 'Multi-tenant security isolation, user roles (RBAC), developer API tokens, and JWT session logs.',
      features: ['Multi-tenant schema isolation', 'Role-based access matrix', 'Developer API key generator'],
      icon: <ShieldCheck className="w-5 h-5 text-brand-blue" />
    },
    {
      id: 'site-iq',
      title: 'Vertex Site IQ',
      subtitle: 'Telemetry & IoT Analytics',
      description: 'Real-time telemetry stream analyzer, sensor anomaly detection, and predictive maintenance logs.',
      features: ['Live telemetry stream analyzer', 'Predictive maintenance alerts', 'Multi-site IoT dashboard'],
      icon: <Activity className="w-5 h-5 text-brand-blue" />
    },
    {
      id: 'dashboard',
      title: 'Vertex Operations Dashboard',
      subtitle: 'Real-Time Intelligence',
      description: 'Query database records, analyze stock warnings, review PO approvals, and generate audit reports.',
      features: ['Real-time database query engine', 'Automated stock & PO auditor', 'Instant executive PDF report generation'],
      icon: <Bot className="w-5 h-5 text-brand-blue" />
    }
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-[#070b12] text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
      
      {/* 1. Header Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 bg-white/90 dark:bg-[#070b12]/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-[72px] flex items-center justify-between gap-8">
          <Link href="/" className="flex items-center shrink-0 group">
            <img src="/logo.png" alt="VOC Vertex" className="h-9 w-auto object-contain transition-transform group-hover:scale-105" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2 relative">
            
            {/* MODULES HOVER DROPDOWN */}
            <div className="relative group">
              <a
                href="#modules"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold transition-all text-slate-700 dark:text-slate-300 hover:text-brand-blue hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <span>Modules</span>
                <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180 text-slate-400 group-hover:text-brand-blue" />
              </a>

              {/* Hover Dropdown Menu - Request Demo Action */}
              <div className="absolute top-full left-0 mt-1 w-[680px] p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 grid grid-cols-2 gap-3 max-h-[80vh] overflow-y-auto">
                {standaloneModules.map((mod) => (
                  <button
                    key={mod.id}
                    onClick={() => openQuoteModalForModule(mod.title)}
                    className="flex items-start gap-3 p-3 rounded-2xl hover:bg-blue-50/80 dark:hover:bg-slate-800/80 transition-colors text-left group/item cursor-pointer"
                  >
                    <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-slate-800 text-brand-blue shrink-0 group-hover/item:bg-brand-blue group-hover/item:text-white transition-colors">
                      {mod.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white group-hover/item:text-brand-blue transition-colors">
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

            {/* INDUSTRIES HOVER DROPDOWN - Navigates to Dedicated Industry Apps */}
            <div className="relative group">
              <a
                href="#industry-presets"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold transition-all text-slate-700 dark:text-slate-300 hover:text-brand-blue hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <span>Industries</span>
                <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180 text-slate-400 group-hover:text-brand-blue" />
              </a>

              {/* Hover Dropdown Menu */}
              <div className="absolute top-full left-0 mt-1 w-[420px] p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 space-y-3">
                <Link
                  href="/industry/manufacturing"
                  className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-blue-50/80 dark:hover:bg-slate-800/80 transition-colors group/ind"
                >
                  <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-slate-800 text-brand-blue shrink-0 group-hover/ind:bg-brand-blue group-hover/ind:text-white transition-colors">
                    <Factory className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white group-hover/ind:text-brand-blue transition-colors">
                      Manufacturing &amp; Plants Application
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
                  <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-slate-800 text-brand-blue shrink-0 group-hover/ind:bg-brand-blue group-hover/ind:text-white transition-colors">
                    <HardHat className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white group-hover/ind:text-brand-blue transition-colors">
                      Infra / EPC Construction Application
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
                  <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-slate-800 text-brand-blue shrink-0 group-hover/ind:bg-brand-blue group-hover/ind:text-white transition-colors">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white group-hover/ind:text-brand-blue transition-colors">
                      Facilities Management Application
                    </p>
                    <p className="text-[11px] text-slate-500 font-light mt-0.5">
                      Heavy scrubbing machinery, shift roster &amp; client SLAs.
                    </p>
                  </div>
                </Link>
              </div>
            </div>

            <Link href="/pricing" className="px-4 py-2.5 rounded-full text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-brand-blue hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              Pricing
            </Link>
            <button
              onClick={() => openQuoteModalForModule('Enterprise Proposal')}
              className="px-4 py-2.5 rounded-full text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-brand-blue hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Contact Sales
            </button>
          </nav>

          {/* Nav Right Actions - Single Portal Login Entry Point */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors px-4 py-2 rounded-full shadow-md"
            >
              <LogIn className="w-4 h-4" />
              <span>Portal Login</span>
            </Link>

            <button
              onClick={() => openQuoteModalForModule('Enterprise Consultation')}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 dark:bg-slate-800 text-white px-5 py-2 text-xs font-bold transition-transform hover:scale-105 cursor-pointer shadow-md"
            >
              <Mail className="w-4 h-4 text-blue-400" />
              <span>Request Demo</span>
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-800 dark:text-slate-200"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-32 md:pt-40 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div>
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-brand-crimson">
              <span className="h-px w-6 bg-brand-crimson/50" />
              Enterprise Operations Management System
            </span>
          </div>

          <h1 className="mt-6 max-w-4xl font-display text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.08]">
            Integrated systems for high-complexity operations
          </h1>

          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
            <p className="lg:col-span-8 text-lg leading-relaxed text-slate-600 dark:text-slate-300 max-w-xl font-light">
              VOC Vertex builds modular operational systems and automated data pipelines. Deploy individual business applications — or a curated industry package — that adapt their workflows to how you actually run operations.
            </p>

            <div className="lg:col-span-4 flex flex-wrap items-center gap-4 lg:justify-end">
              <button
                onClick={() => openQuoteModalForModule('Complete Operations Bundle')}
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 text-sm font-semibold transition-transform duration-300 hover:scale-105 cursor-pointer shadow-lg"
              >
                <Mail className="h-4 w-4" />
                <span>Request Demo &amp; Quote</span>
              </button>

              <a
                href="#modules"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 dark:border-slate-700 px-7 py-3.5 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:border-brand-blue hover:text-brand-blue transition-all duration-300"
              >
                Explore Modules
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Industry Presets - Clicking opens Dedicated Industry Pages */}
      <section id="industry-presets" className="max-w-7xl mx-auto px-6 md:px-10 py-20">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-brand-crimson">
            <span className="h-px w-6 bg-brand-crimson/50" />
            Industry Sector Packages
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Dedicated sector operational applications
          </h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 font-light">
            Select an industry below to open its dedicated application portal and explore tailored metrics, rosters and registers.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {industryPackages.map((pkg) => (
            <div
              key={pkg.key}
              className="glass-card rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-lg flex flex-col justify-between group hover:border-blue-500/50 transition-all duration-300"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden">
                  <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                  <span className="absolute bottom-4 left-4 text-xs font-bold uppercase tracking-wider text-white bg-blue-600/90 px-3 py-1 rounded-full backdrop-blur-md">
                    {pkg.title}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{pkg.subtitle}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">{pkg.description}</p>
                </div>
              </div>

              <div className="p-6 pt-0 space-y-3">
                <Link
                  href={pkg.exploreLink}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Open {pkg.title} App</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => openQuoteModalForModule(`${pkg.title} Package`)}
                  className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-blue-500" />
                  <span>Request Quote &amp; Demo</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Standalone Modules Grid - NO "Launch Application" link, ONLY "Request Quote & Demo" */}
      <section id="modules" className="max-w-7xl mx-auto px-6 md:px-10 py-20">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-brand-crimson">
            <span className="h-px w-6 bg-brand-crimson/50" />
            Standalone Modules Catalog
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            12 Enterprise Operational Modules
          </h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 font-light">
            Every module can be evaluated and deployed standalone or integrated into a full enterprise suite.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {standaloneModules.map((mod) => (
            <div
              key={mod.id}
              className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-slate-800 text-brand-blue flex items-center justify-center mb-4">
                  {mod.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{mod.title}</h3>
                <p className="text-xs font-semibold text-blue-500 mt-0.5">{mod.subtitle}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-2 leading-relaxed">{mod.description}</p>
                
                <ul className="mt-4 space-y-1.5">
                  {mod.features.map((feat, fidx) => (
                    <li key={fidx} className="flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-400 font-light">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-crimson" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Single Request Demo Button - NO Launch Application Link */}
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

      {/* 5. Interactive Request Quote or Demo Modal */}
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
              <span className="text-[10px] uppercase font-bold text-blue-500 tracking-wider">Enterprise Proposal</span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">Request Quote or Demo</h2>
              <p className="text-xs text-slate-500 font-light mt-0.5">Target Module: <strong className="text-blue-500">{quoteTargetModule}</strong></p>
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
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs outline-none focus:border-blue-500"
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
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Company / Organization</label>
                  <input
                    required
                    value={contactForm.company}
                    onChange={e => setContactForm({ ...contactForm, company: e.target.value })}
                    placeholder="Acme Industrial Ltd"
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Custom Message / Scale</label>
                  <textarea
                    rows={3}
                    value={contactForm.message}
                    onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Mention specific user licenses, plant locations, or integration requirements..."
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs outline-none focus:border-blue-500"
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

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070b12] py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="VOC VERTEX" className="h-7 w-auto object-contain" />
            <span>© 2026 24 SEVEN INNOVATIVE PRODUCTS AND SERVICES PRIVATE LIMITED. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/pricing" className="hover:text-blue-500 transition-colors">Pricing</Link>
            <Link href="/login" className="hover:text-blue-500 transition-colors font-bold text-slate-900 dark:text-white">Portal Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
