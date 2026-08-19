'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import StandardFooter from '@/components/Footer';
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
  CheckCircle2,
  LogIn,
  Tag,
  Sliders,
  CheckSquare,
  Square
} from 'lucide-react';

export default function PricingPage() {
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

  // "Build Your Modules" Interactive Tool State
  const [builderModules, setBuilderModules] = useState<string[]>([
    'Vertex ERP',
    'Vertex Inventory & Warehouse',
    'Vertex Procurement',
    'Vertex Operations Dashboard'
  ]);
  const [builderDeployment, setBuilderDeployment] = useState<string>('Dedicated Cloud SaaS');
  const [builderHeadcount, setBuilderHeadcount] = useState<string>('50 - 500 Employees');

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const toggleBuilderModule = (title: string) => {
    if (builderModules.includes(title)) {
      setBuilderModules(builderModules.filter(m => m !== title));
    } else {
      setBuilderModules([...builderModules, title]);
    }
  };

  const handleBuilderQuoteSubmit = () => {
    const selectedList = builderModules.length > 0 ? builderModules.join(', ') : 'Custom Selected Bundle';
    setQuoteTargetModule(`Custom Package (${builderModules.length} Modules)`);
    setContactForm(prev => ({
      ...prev,
      selectedModules: builderModules,
      message: `Requesting custom price quote & live demo for built module package: [ ${selectedList} ]. Deployment: ${builderDeployment}, Organization Scale: ${builderHeadcount}. Please email itemized proposal.`
    }));
    setIsContactModalOpen(true);
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

  // 12 Standalone Modules Catalog (Without Generic Numbers)
  const standaloneModules = [
    {
      id: 'ops-core',
      title: 'Vertex OPS Core',
      subtitle: 'OPS Core & Capacity Planning',
      description: 'Capacity scheduling, multi-plant line utilization and cost-center ledgers with full audit exports.',
      link: '/erp',
      features: ['Multi-plant production scheduling', 'Capacity & load balancing', 'Cost-center ledgers & PDF audits'],
      icon: <Factory className="w-5 h-5 text-brand-blue" />
    },
    {
      id: 'crm',
      title: 'Vertex CRM & Bidding',
      subtitle: 'Commercial Sales Funnel',
      description: 'Track industrial bid pipelines, manage multi-version quotes, Kanban deal boards and contracts.',
      link: '/crm',
      features: ['RFQ & multi-version quoting', 'Kanban bid pipeline', 'Contracts & renewals'],
      icon: <Handshake className="w-5 h-5 text-brand-blue" />
    },
    {
      id: 'hrm',
      title: 'Vertex HRM & Workforce',
      subtitle: 'Shift Rosters & Statutory Payroll',
      description: 'Coordinate crew rotations, track safety certifications, EPF/ESI forms and automated shift payroll.',
      link: '/hrm',
      features: ['Shift rostering & rotations', 'Safety certification tracking', 'Automated payroll (EPF/ESI)'],
      icon: <Users2 className="w-5 h-5 text-brand-blue" />
    },
    {
      id: 'procurement',
      title: 'Vertex Procurement',
      subtitle: 'Procure-to-Pay & 3-Way Audit',
      description: 'Automate high-volume sourcing with 3-way match auditing and supplier scorecard reliability.',
      link: '/procurement',
      features: ['Purchase requisitions & POs', '3-way match auditor', 'Supplier scorecards'],
      icon: <ShoppingCart className="w-5 h-5 text-brand-blue" />
    },
    {
      id: 'inventory',
      title: 'Vertex Inventory & Warehouse',
      subtitle: 'Stock Balances & Reorder Alert',
      description: 'Real-time tracking of raw materials and finished stock with FIFO valuation and reorder points.',
      link: '/inventory',
      features: ['Depot stock balances & bin allocation', 'FIFO / LIFO valuation calculator', 'Minimum stock reorder warnings'],
      icon: <Boxes className="w-5 h-5 text-brand-blue" />
    },
    {
      id: 'master-data',
      title: 'Vertex Master Data Hub',
      subtitle: 'Central Records Repository',
      description: 'Centralized catalog specs, rebar grades, chemical inventory, and vendor profiles.',
      link: '/master-data',
      features: ['Rebar grade & chemical specs', 'Deduplication sanitizer', 'Global barcode indexing'],
      icon: <Database className="w-5 h-5 text-brand-blue" />
    },
    {
      id: 'facilities',
      title: 'Vertex Facilities & Assets',
      subtitle: 'Heavy Machinery & Maintenance',
      description: 'Heavy machinery tracking (scrubbers, jet washers), preventive maintenance, site transfers, straight-line depreciation.',
      link: '/facilities',
      features: ['Heavy machinery asset registers', 'Preventive servicing schedules', 'Straight-line depreciation'],
      icon: <Building2 className="w-5 h-5 text-brand-blue" />
    },
    {
      id: 'finance',
      title: 'Vertex Finance & Accounts',
      subtitle: 'General Ledger & Budgets',
      description: 'Double-entry accounting, site profitability audits, accounts payable/receivable, capital expenditure ledgers.',
      link: '/finance',
      features: ['Double-entry journal postings', 'Site margin & profitability audit', 'Capital expenditure ledgers'],
      icon: <Landmark className="w-5 h-5 text-brand-blue" />
    },
    {
      id: 'workflows',
      title: 'Vertex Workflows Engine',
      subtitle: 'Multi-Level Approval Matrix',
      description: 'Multi-level approval pathways, SLA escalation alerts, and audit trail signoffs.',
      link: '/workflows',
      features: ['Multi-level clearance pathways', 'SLA escalation alert handlers', 'Audit trail signoff history'],
      icon: <Workflow className="w-5 h-5 text-brand-blue" />
    },
    {
      id: 'admin',
      title: 'Vertex Platform Admin',
      subtitle: 'Tenant & Security Controls',
      description: 'Multi-tenant security isolation, user roles (RBAC), developer API tokens, and JWT session logs.',
      link: '/admin',
      features: ['Multi-tenant schema isolation', 'Role-based access matrix', 'Developer API key generator'],
      icon: <ShieldCheck className="w-5 h-5 text-brand-blue" />
    },
    {
      id: 'site-iq',
      title: 'Vertex Site IQ',
      subtitle: 'Telemetry & IoT Analytics',
      description: 'Real-time telemetry stream analyzer, sensor anomaly detection, and predictive maintenance logs.',
      link: '/site-iq',
      features: ['Live telemetry stream analyzer', 'Predictive maintenance alerts', 'Multi-site IoT dashboard'],
      icon: <Activity className="w-5 h-5 text-brand-blue" />
    },
    {
      id: 'dashboard',
      title: 'Vertex Operations Dashboard',
      subtitle: 'Real-Time Intelligence',
      description: 'Query database records, analyze stock warnings, review PO approvals, and generate audit reports.',
      link: '/dashboard',
      features: ['Real-time database query engine', 'Automated stock & PO auditor', 'Instant executive PDF report generation'],
      icon: <Bot className="w-5 h-5 text-brand-blue" />
    }
  ];

  const faqs = [
    {
      question: "How does enterprise module pricing work?",
      answer: "VOC Vertex provides modular licensing based on your specific operational requirements, user seats, and site deployments. Select your required modules using the Build Your Custom Package tool above to receive an itemized proposal emailed directly to your work address."
    },
    {
      question: "Can we start with a single module and scale up later?",
      answer: "Yes, every module is built on a shared master-data spine. You can deploy a single application (e.g. Facilities & Assets or HRM) and smoothly add ERP, Procurement, or Finance as your organization grows."
    },
    {
      question: "Are both Cloud SaaS and On-Premises deployments supported?",
      answer: "Yes, we support multi-tenant Cloud SaaS hosted in regional data centers as well as dedicated On-Premises or Private Cloud container deployments for high-security enterprise environments."
    },
    {
      question: "How are sensitive employee and financial records protected?",
      answer: "Sensitive identifiers such as Aadhaar numbers, PAN cards, bank account numbers, UAN numbers, and API tokens are automatically masked across UI displays, PDF dossiers, and log exports."
    }
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-[#070b12] text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
      
      {/* Header Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 bg-white/90 dark:bg-[#070b12]/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-[72px] flex items-center justify-between gap-8">
          <Link href="/" className="flex items-center shrink-0 group">
            <img src="/logo.png" alt="VOC Vertex" className="h-11 md:h-12 w-auto object-contain transition-transform group-hover:scale-105" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2 relative">
            <Link href="/" className="px-4 py-2.5 rounded-full text-sm font-semibold text-slate-700 hover:text-brand-blue hover:bg-slate-100 transition-colors">
              Home
            </Link>
            
            <Link href="/#modules" className="px-4 py-2.5 rounded-full text-sm font-semibold text-slate-700 hover:text-brand-blue hover:bg-slate-100 transition-colors">
              Modules
            </Link>

            <Link href="/#industry-presets" className="px-4 py-2.5 rounded-full text-sm font-semibold text-slate-700 hover:text-brand-blue hover:bg-slate-100 transition-colors">
              Industries
            </Link>

            <Link href="/pricing" className="px-4 py-2.5 rounded-full text-sm font-bold text-brand-blue bg-blue-50 transition-colors">
              Pricing
            </Link>

            <Link href="/#contact" className="px-4 py-2.5 rounded-full text-sm font-semibold text-slate-700 hover:text-brand-blue hover:bg-slate-100 transition-colors">
              Contact Us
            </Link>
          </nav>

          {/* Nav Right Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-brand-blue transition-colors px-3 py-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Log in</span>
            </Link>

            <button
              onClick={() => setIsContactModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-brand-ink text-white px-5 py-2.5 text-sm font-semibold transition-transform duration-300 hover:scale-[1.03] cursor-pointer shadow-md"
            >
              <Mail className="w-4 h-4 text-blue-400" />
              <span>Request Quote</span>
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-800 dark:text-slate-200"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070b12] px-6 py-6 space-y-4">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block text-base font-medium text-slate-700 dark:text-slate-200">
              Home
            </Link>
            <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="block text-base font-bold text-brand-blue">
              Module Pricing &amp; Custom Bundles
            </Link>
            <Link href="/#modules" onClick={() => setMobileMenuOpen(false)} className="block text-base font-medium text-slate-700 dark:text-slate-200">
              Modules Catalog
            </Link>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block text-base font-medium text-slate-700 dark:text-slate-200">
              Portal Sign In
            </Link>
          </div>
        )}
      </header>

      {/* Main Pricing Hero Header */}
      <section className="pt-36 md:pt-44 pb-16 px-6 md:px-10 max-w-7xl mx-auto text-center space-y-4">
        <div>
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-brand-crimson">
            <span className="h-px w-6 bg-brand-crimson/50" />
            Enterprise Licensing &amp; Module Quotes
            <span className="h-px w-6 bg-brand-crimson/50" />
          </span>
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white">
          Modular Pricing Built Around Your Operations
        </h1>
        <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
          Select individual modules or build a custom bundle tailored to your team headcount and plant locations. Receive an itemized pricing proposal sent directly to your work email.
        </p>
      </section>

      {/* 1. Interactive "Build Your Modules" Tool */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-20">
        <div className="p-8 md:p-10 bg-gradient-to-br from-blue-50/80 via-white to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/70 dark:border-slate-800 pb-6">
            <div>
              <div className="flex items-center gap-2 text-brand-blue font-bold text-xs uppercase tracking-wider">
                <Sliders className="w-4 h-4" />
                <span>Interactive Module Configurator</span>
              </div>
              <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mt-1">
                Build Your Custom Module Package
              </h2>
              <p className="text-xs text-slate-500 font-light mt-0.5">
                Check the modules required for your plant, project, or facility operations.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-xs font-mono">
                {builderModules.length} Modules Selected
              </span>
              <button
                onClick={handleBuilderQuoteSubmit}
                className="px-6 py-2.5 bg-brand-ink text-white font-semibold text-xs rounded-full hover:scale-105 transition-transform flex items-center gap-2 shadow-md cursor-pointer"
              >
                <Mail className="w-4 h-4 text-blue-400" />
                <span>Request Quote or Demo for Selected Bundle</span>
              </button>
            </div>
          </div>

          {/* Module Checkbox Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {standaloneModules.map((mod) => {
              const isSelected = builderModules.includes(mod.title);
              return (
                <div
                  key={mod.id}
                  onClick={() => toggleBuilderModule(mod.title)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    isSelected
                      ? 'bg-blue-50/80 dark:bg-slate-800/90 border-brand-blue shadow-md'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="mt-0.5 text-brand-blue shrink-0">
                    {isSelected ? (
                      <CheckSquare className="w-5 h-5 text-brand-blue" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold truncate ${isSelected ? 'text-brand-blue' : 'text-slate-900 dark:text-white'}`}>
                      {mod.title}
                    </p>
                    <p className="text-[11px] text-slate-500 font-light mt-0.5 line-clamp-1">
                      {mod.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Configuration Deployment Options */}
          <div className="pt-4 border-t border-slate-200/70 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Preferred Deployment Architecture
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {['Dedicated Cloud SaaS', 'On-Premises High Security', 'Hybrid Multi-Plant'].map(mode => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setBuilderDeployment(mode)}
                    className={`p-2.5 text-[11px] font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                      builderDeployment === mode
                        ? 'bg-brand-ink text-white border-brand-ink shadow-xs'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Organization Headcount &amp; Scale
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {['1 - 50 Employees', '50 - 500 Employees', '500+ Enterprise'].map(scale => (
                  <button
                    key={scale}
                    type="button"
                    onClick={() => setBuilderHeadcount(scale)}
                    className={`p-2.5 text-[11px] font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                      builderHeadcount === scale
                        ? 'bg-brand-ink text-white border-brand-ink shadow-xs'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {scale}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Standalone Module Pricing Cards Grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-24">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Individual Module Proposals</h2>
          <p className="text-xs text-slate-500 font-light">Explore standalone modules and request a custom quote or live demo.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {standaloneModules.map((mod) => (
            <div
              key={mod.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-sm hover:border-brand-blue transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-slate-800 text-brand-blue">
                    {mod.icon}
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500">
                    Enterprise Module
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">{mod.title}</h3>
                  <p className="text-xs text-brand-blue font-medium mt-0.5">{mod.subtitle}</p>
                </div>

                <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-slate-800/50 border border-blue-100 dark:border-slate-800 text-xs space-y-1">
                  <p className="font-semibold text-slate-900 dark:text-white flex items-center justify-between">
                    <span>Pricing Tier:</span>
                    <span className="text-brand-blue font-bold">Custom Quote by Mail</span>
                  </p>
                  <p className="text-[11px] text-slate-500 font-light">
                    Includes full operational specs, API tokens &amp; PDF exporters.
                  </p>
                </div>

                <ul className="space-y-2 pt-2">
                  {mod.features.map((feat, fidx) => (
                    <li key={fidx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 font-light">
                      <Check className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => openQuoteModalForModule(mod.title)}
                  className="w-full py-3 bg-brand-ink hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-transform hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span>Request Quote or Demo</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Pricing FAQs */}
      <section className="max-w-4xl mx-auto px-6 md:px-10 py-16 border-t border-slate-200 dark:border-slate-800 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="font-display text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">Licensing &amp; Pricing FAQs</h2>
          <p className="text-xs text-slate-500 font-light">Frequently asked questions about enterprise pricing proposals.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-5 text-left font-semibold text-sm text-slate-900 dark:text-white flex items-center justify-between gap-4 cursor-pointer"
              >
                <span>{faq.question}</span>
                <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${openFaqIndex === idx ? 'rotate-180 text-brand-blue' : 'text-slate-400'}`} />
              </button>
              {openFaqIndex === idx && (
                <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-300 font-light leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Standardized Footer */}
      <StandardFooter />

      {/* Floating Quote & Contact Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 md:p-8 overflow-hidden">
            <button
              onClick={() => setIsContactModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {formSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-950/50 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Quote &amp; Demo Request Submitted</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-light leading-relaxed">
                  Thank you! An itemized price quote &amp; live demo invitation for <strong>{quoteTargetModule}</strong> will be emailed to <strong>{contactForm.email || 'your work email'}</strong> shortly.
                </p>
                <button
                  onClick={() => setIsContactModalOpen(false)}
                  className="mt-4 px-6 py-2.5 bg-brand-ink text-white text-xs font-semibold rounded-full transition-colors cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="flex items-center gap-2 text-brand-blue font-semibold text-xs uppercase tracking-wider">
                  <Tag className="w-4 h-4" />
                  <span>Module Pricing Quote &amp; Demo Request</span>
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Request Quote or Demo</h3>
                  <p className="text-xs text-slate-500 font-light mt-0.5">Target: <strong className="text-slate-800 dark:text-slate-200">{quoteTargetModule}</strong></p>
                </div>
                
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Smith"
                    value={contactForm.name}
                    onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-brand-blue"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">Enterprise Work Email</label>
                  <input
                    type="email"
                    required
                    placeholder="jane@company.com"
                    value={contactForm.email}
                    onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-brand-blue"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">Message / Requirements</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Tell us about required user seats, plant locations, or custom module licensing..."
                    value={contactForm.message}
                    onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-brand-blue resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-brand-ink text-white font-semibold text-xs rounded-xl transition-all duration-300 hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  {submitting ? <span>Sending...</span> : <><Mail className="w-3.5 h-3.5 text-blue-400" /><span>Request Quote or Demo</span></>}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
