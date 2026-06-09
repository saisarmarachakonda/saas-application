'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';
import {
  Sparkles,
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
  Mail,
  User,
  MessageSquare,
  Sparkles as SparkleIcon,
  Menu,
  X,
  ChevronDown,
  Cpu,
  Workflow,
  FileSignature,
  QrCode,
  CheckCircle2,
  HelpCircle,
  MapPin,
  Building,
  Briefcase,
  Layers,
  ShieldCheck,
  Send,
  Award
} from 'lucide-react';

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', company: '', message: '' });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Billing Cycle state (Monthly / Annual)
  const [isAnnual, setIsAnnual] = useState(false);

  // Detailed Module Deep-Dive Tabs
  const [activeTourTab, setActiveTourTab] = useState('admin');

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // AI Copilot Sandbox State
  const [sandboxPrompt, setSandboxPrompt] = useState('');
  const [sandboxAnswer, setSandboxAnswer] = useState('Click one of the suggested prompts below to see how the AI Copilot analyzes real-time database records.');
  const [sandboxLoading, setSandboxLoading] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactForm.name && contactForm.email && contactForm.message) {
      setContactSubmitted(true);
      setContactForm({ name: '', email: '', company: '', message: '' });
      setTimeout(() => setContactSubmitted(false), 5000);
    }
  };

  const runSandboxQuery = (query: string) => {
    setSandboxLoading(true);
    setSandboxPrompt(query);
    setTimeout(() => {
      setSandboxLoading(false);
      const q = query.toLowerCase();
      if (q.includes('stock')) {
        setSandboxAnswer(`[AI Copilot Response]
I scanned the active InventoryAlert table and detected 1 critical warning:
- SKU: MAT-STL-02 (Galvanized Steel Sheet)
- Type: Low Stock Alert
- Current Quantity: 80 kg (Threshold: 150 kg)

Action Proposed: Create a Purchase Requisition for 500 kg to replenish safely.`);
      } else if (q.includes('po') || q.includes('purchase')) {
        setSandboxAnswer(`[AI Copilot Response]
I evaluated the PurchaseOrder table:
- PO-2026-0002 for 'Steel Supply LLC' is currently PENDING approval.
- Total value: $3,700.00.

Under company rules (ApprovalMatrix), purchase transactions exceeding $1,000.00 require authorization by the 'DepartmentHead' or 'Admin'.`);
      } else if (q.includes('pipeline') || q.includes('sales')) {
        setSandboxAnswer(`[AI Copilot Response]
CRM Pipeline Summary:
- Active Opportunities: 1 ($75,000.00 value)
- Confirmed Sales Orders: 1 ($120,000.00 value)
- Registered Leads: 2 accounts (Elon Musk - SpaceX, Bruce Wayne - Wayne Corp).`);
      } else {
        setSandboxAnswer(`[AI Copilot Response]
Connected to Apex Global database. Yes, data isolation is active. 2 plants and 2 warehouses are online. Ready to analyze.`);
      }
    }, 1000);
  };

  const modules = [
    {
      id: 'admin',
      icon: <Building2 className="w-5 h-5 text-indigo-500" />,
      title: 'Platform Administration',
      subtitle: 'Tenant & Security Controls',
      description: 'Establish organization hierarchies with separate plants, departments, and warehouse depots. Maintain a flexible system permissions matrix and enforce workflow approval matrices dynamically.'
    },
    {
      id: 'master',
      icon: <Database className="w-5 h-5 text-cyan-500" />,
      title: 'Master Data',
      subtitle: 'Central Records Repository',
      description: 'Host centralized profiles for active Customers and Suppliers. Catalog spec criteria for finished products, raw materials, and assembly parts (UOM, pricing, SKU codes).'
    },
    {
      id: 'crm',
      icon: <Users2 className="w-5 h-5 text-emerald-500" />,
      title: 'CRM & Quotations',
      subtitle: 'Sales Conversion Funnel',
      description: 'Nurture leads through customized sales opportunity stages. Capture customer RFQs, build multi-version quotations, and convert won proposals into standard sales orders.'
    },
    {
      id: 'procurement',
      icon: <ShoppingCart className="w-5 h-5 text-orange-500" />,
      title: 'Procurement Cycle',
      subtitle: 'Procure-to-Pay Workflow',
      description: 'Route internal material requisitions for review, collect vendor bids, issue official purchase orders, match shipments via Goods Receipts (GRN), and log supplier scorecard indices.'
    },
    {
      id: 'inventory',
      icon: <Boxes className="w-5 h-5 text-pink-500" />,
      title: 'Inventory Logistics',
      subtitle: 'Location & Tracking Control',
      description: 'View real-time stock balances across warehouses. Document stock receipts, internal depot transfers, batch-code tracking, QR-code identification, and alert threshold warnings.'
    },
    {
      id: 'finance',
      icon: <Landmark className="w-5 h-5 text-purple-500" />,
      title: 'Finance & Accounting',
      subtitle: 'General Ledger & Budgets',
      description: 'Manage double-entry accounts, process customer receipts/vendor invoices, reconcile banks, run tax reports (GST/TDS), configure cost budgets, and print automated P&L statements.'
    }
  ];

  const faqs = [
    {
      question: "How does the SQLite to production database configuration work?",
      answer: "The application utilizes Prisma ORM with environment-variable based configuration. For local developer sandboxes, it defaults to a file-based SQLite database. Switching to enterprise setups like PostgreSQL, MySQL, or Supabase requires simply updating the DATABASE_URL string inside your .env file—no source code modifications are required."
    },
    {
      question: "Is multi-tenant security configuration supported?",
      answer: "Yes, the architecture supports multi-tenant isolation. When registering a company, the application creates a separate company instance. Users, departments, assets, and transactions are locked to that company ID, ensuring full logical data isolation across tenant accounts."
    },
    {
      question: "How are the custom analytical charts rendered?",
      answer: "To bypass peer dependency conflicts commonly seen in modern frontend environments, the dashboard charts are custom-rendered directly in React using native SVG paths and SVG rectangles. This keeps bundle sizes small, renders perfectly in both dark and light modes, and functions natively without external chart library weights."
    },
    {
      question: "Can I run this platform completely offline using Docker?",
      answer: "Yes, a production-optimized Dockerfile and docker-compose orchestration file are pre-configured. Running docker-compose compiles the Next.js bundle and mounts local folders for database persistence, spinning up the server and database locally on port 3000 with zero external cloud dependencies."
    },
    {
      question: "How does the Finance & Accounting module handle tax compliance?",
      answer: "The application supports automated tax tracking for GST and TDS. Every invoice transaction calculates tax inputs and outputs based on active compliance policies, logging statutory records for tax reconciliation and audit trails."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-[#090d16]">
      {/* 1. Header */}
      <header className="sticky top-0 z-40 w-full glass-card border-b border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-[#090d16]/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center glow-indigo">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-500 to-cyan-500 bg-clip-text text-transparent">
              NextGen ERP
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <a href="#features" className="hover:text-indigo-500 transition-colors">Features</a>
            <a href="#tour" className="hover:text-indigo-500 transition-colors">Platform Tour</a>
            <a href="#pricing" className="hover:text-indigo-500 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-indigo-500 transition-colors">FAQ</a>
            <a href="#contact" className="hover:text-indigo-500 transition-colors">Contact</a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link
              href="/login"
              className="text-sm font-semibold text-slate-600 dark:text-slate-350 hover:text-indigo-500 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all shadow-md shadow-indigo-600/15"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] px-4 py-4 space-y-2">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-slate-600 dark:text-slate-300 py-2">Features</a>
            <a href="#tour" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-slate-600 dark:text-slate-300 py-2">Platform Tour</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-slate-600 dark:text-slate-300 py-2">Pricing</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-slate-600 dark:text-slate-300 py-2">FAQ</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-slate-600 dark:text-slate-300 py-2">Contact</a>
            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex flex-col gap-2">
              <Link href="/login" className="w-full text-center py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-500">Sign In</Link>
              <Link href="/signup" className="w-full text-center py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg">Get Started</Link>
            </div>
          </div>
        )}
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-36 flex flex-col items-center">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[350px] h-[350px] rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 dark:bg-indigo-500/10 mb-6 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <SparkleIcon className="w-4 h-4" /> Next-generation ERP Operations Suite
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
            The Complete Enterprise ERP OS{' '}
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent block mt-2">
              For Scaling Operations
            </span>
          </h1>
          
          <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
            Eliminate operational friction. Manage company divisions, verify raw materials, calculate client quotes, issue purchase orders, scan stock bins, and execute natural language queries.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-wider text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 hover:-translate-y-0.5"
            >
              Start 30-Day Free Trial <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#tour"
              className="px-8 py-4 glass-card text-slate-700 dark:text-slate-350 font-bold uppercase tracking-wider text-xs rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center justify-center"
            >
              Launch Platform Tour
            </a>
          </div>

          {/* Social Proof Logo Ticker */}
          <div className="mt-16 pt-10 border-t border-slate-200/50 dark:border-slate-800/40">
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-450 dark:text-slate-400 mb-6">TRUSTED BY SYSTEMS ARCHITECTS GLOBALLY</p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-50 dark:opacity-40">
              <span className="font-semibold text-sm tracking-widest uppercase text-slate-500 dark:text-slate-300">SPACEX ORBITAL</span>
              <span className="font-semibold text-sm tracking-widest uppercase text-slate-500 dark:text-slate-300">TESLA ENERGY</span>
              <span className="font-semibold text-sm tracking-widest uppercase text-slate-500 dark:text-slate-300">ACME MANUFACTURING</span>
              <span className="font-semibold text-sm tracking-widest uppercase text-slate-500 dark:text-slate-300">WAYNE ENTERPRISES</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Detailed Features Showcase */}
      <section id="features" className="py-20 lg:py-28 border-t border-slate-200 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight">
              One Single Platform,{' '}
              <span className="bg-gradient-to-r from-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                6 Modular Powers
              </span>
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400 text-base font-light">
              Connect platform settings, raw material categories, customer RFQs, comparative supplier bidding, and warehouse log sheets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map((mod, idx) => (
              <div
                key={mod.id}
                className="glass-card p-6 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  {mod.icon}
                </div>
                <div className="text-[10px] uppercase font-bold text-indigo-500 dark:text-indigo-400 mb-1">{mod.subtitle}</div>
                <h3 className="text-base font-bold mb-2 text-slate-900 dark:text-white">
                  {mod.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">
                  {mod.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Interactive Platform Tour */}
      <section id="tour" className="py-20 lg:py-28 border-t border-slate-200 dark:border-slate-800/80 bg-slate-100/50 dark:bg-slate-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Take a Tour of the{' '}
              <span className="bg-gradient-to-r from-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                Dashboard Modules
              </span>
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm font-light">
              Select a module tab below to view detailed previews of the real-time layout structures and operations records.
            </p>
          </div>

          {/* Tab Selection */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1 gap-2 justify-start md:justify-center mb-8">
            {modules.map(mod => (
              <button
                key={mod.id}
                onClick={() => setActiveTourTab(mod.id)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-t-lg transition-colors shrink-0 ${
                  activeTourTab === mod.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800'
                }`}
              >
                {mod.title.replace(' Integration', '')}
              </button>
            ))}
          </div>

          {/* Tour Card Render */}
          <div className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xl p-6 md:p-8 bg-white/40 dark:bg-slate-900/40 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Description Info */}
            <div className="space-y-4">
              <span className="text-[10px] font-bold uppercase text-indigo-500 bg-indigo-500/10 px-2.5 py-1 rounded">
                Interactive Preview
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {modules.find(m => m.id === activeTourTab)?.title} Features
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">
                {modules.find(m => m.id === activeTourTab)?.description}
              </p>

              {/* Specific Bullet points based on selected tab */}
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-450">
                {activeTourTab === 'admin' && (
                  <>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> Multi-user security role validation</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> Plant, Depot, & Department configs</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> Multi-tier Approval matrix controls</li>
                  </>
                )}
                {activeTourTab === 'master' && (
                  <>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-500" /> Customer categorization classifications</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-500" /> Vendor rating scoring matrices</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-500" /> Material specification costs indices</li>
                  </>
                )}
                {activeTourTab === 'crm' && (
                  <>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Lead tracking opportunity scoring</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> RFQ calculations quotation versioning</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Conversion from Proposal to Sales Order</li>
                  </>
                )}
                {activeTourTab === 'procurement' && (
                  <>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-orange-500" /> Material requisition approval gates</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-orange-500" /> Purchase Orders values authorization</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-orange-500" /> GRN material matching reports</li>
                  </>
                )}
                {activeTourTab === 'inventory' && (
                  <>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pink-500" /> Stock balance bin-level visibilities</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pink-500" /> Stock Inward/Outward movements logs</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pink-500" /> Low stock alert parameters triggers</li>
                  </>
                )}
                {activeTourTab === 'finance' && (
                  <>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-500" /> Double-entry journal vouchers posting</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-500" /> Budget allocation and variance metrics</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-500" /> GST and TDS statutory filings logs</li>
                  </>
                )}
              </ul>
            </div>

            {/* Visual Screen Mock representation */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-100/50 dark:bg-slate-950/45 relative overflow-hidden">
              {activeTourTab === 'admin' && (
                <div className="space-y-3 font-mono text-[9px] leading-relaxed">
                  <div className="bg-indigo-600/10 text-indigo-500 p-2 rounded border border-indigo-500/25">ApprovalMatrix Config</div>
                  <div className="p-2 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-900">
                    <p className="font-semibold text-slate-800 dark:text-slate-300">CRM Sales Order Matrix</p>
                    <p className="text-slate-400 mt-1">Value Limit: $20,000.00</p>
                    <p className="text-slate-400">Approver Role: Admin Access</p>
                    <p className="text-green-500 mt-1 font-semibold">● ACTIVE STATUS</p>
                  </div>
                </div>
              )}
              {activeTourTab === 'master' && (
                <div className="space-y-3 font-mono text-[9px] leading-relaxed">
                  <div className="bg-cyan-600/10 text-cyan-500 p-2 rounded border border-cyan-500/25">Supplier Scorecard</div>
                  <div className="p-2 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-900">
                    <p className="font-semibold text-slate-850 dark:text-slate-300">Intel Semiconductors</p>
                    <p className="text-slate-450 mt-1">Quality Index: 98%</p>
                    <p className="text-slate-450">Delivery Index: 95%</p>
                    <p className="text-indigo-400 mt-1 font-semibold">Overall Index: 93.67% (GOLD)</p>
                  </div>
                </div>
              )}
              {activeTourTab === 'crm' && (
                <div className="space-y-3 font-mono text-[9px] leading-relaxed">
                  <div className="bg-emerald-600/10 text-emerald-500 p-2 rounded border border-emerald-500/25">Opportunity pipeline</div>
                  <div className="p-2 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-900">
                    <p className="font-semibold text-slate-800 dark:text-slate-300">SpaceX Fuel Valves Supply</p>
                    <p className="text-slate-450 mt-1">Stage: Proposal Stage</p>
                    <p className="text-slate-450">Estimated Value: $75,000.00</p>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-emerald-500 h-full w-3/5" />
                    </div>
                  </div>
                </div>
              )}
              {activeTourTab === 'procurement' && (
                <div className="space-y-3 font-mono text-[9px] leading-relaxed">
                  <div className="bg-orange-600/10 text-orange-500 p-2 rounded border border-orange-500/25">Procure-to-Pay workflow</div>
                  <div className="p-2 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-900 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-slate-850 dark:text-slate-300">PO-2026-0001</p>
                      <p className="text-slate-450">Amount: $6,250.00</p>
                    </div>
                    <div className="px-2 py-0.5 bg-green-500/15 text-green-500 rounded font-semibold text-[8px]">
                      APPROVED PO
                    </div>
                  </div>
                </div>
              )}
              {activeTourTab === 'inventory' && (
                <div className="space-y-3 font-mono text-[9px] leading-relaxed">
                  <div className="bg-pink-600/10 text-pink-500 p-2 rounded border border-pink-500/25">Stock Bin Safety Alert</div>
                  <div className="p-2 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-900">
                    <p className="font-semibold text-slate-800 dark:text-slate-300">Galvanized Steel Sheet</p>
                    <p className="text-slate-450 mt-1">Stock Level: 80 kg</p>
                    <p className="text-red-500 font-semibold">Safety Min: 150 kg (Low Stock Warning)</p>
                  </div>
                </div>
              )}
              {activeTourTab === 'finance' && (
                <div className="space-y-3 font-mono text-[9px] leading-relaxed">
                  <div className="bg-purple-600/10 text-purple-500 p-2 rounded border border-purple-500/25">Finance Ledger Account</div>
                  <div className="p-2 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-900">
                    <p className="font-semibold text-slate-800 dark:text-slate-355">General Journal #JV-0001</p>
                    <p className="text-slate-450 mt-1">Debit: Customer Receipts ($120,000.00)</p>
                    <p className="text-slate-450">Credit: Accounts Receivable ($120,000.00)</p>
                    <p className="text-indigo-400 mt-1 font-semibold">● FULLY RECONCILED</p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>



      {/* 6. Pricing Tiers */}
      <section id="pricing" className="py-20 lg:py-28 border-t border-slate-200 dark:border-slate-800/80 bg-slate-100/30 dark:bg-[#070b12]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Transparent, Scale-Friendly{' '}
              <span className="bg-gradient-to-r from-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                Pricing Tiers
              </span>
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm font-light">
              Choose your deployment frequency. Get a 20% discount on yearly subscriptions.
            </p>

            {/* Toggle Billing Frequency */}
            <div className="mt-8 flex justify-center items-center gap-3">
              <span className={`text-xs font-bold ${!isAnnual ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>Monthly Billing</span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  isAnnual ? 'bg-indigo-600' : 'bg-slate-350 dark:bg-slate-800'
                }`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
              <span className={`text-xs font-bold flex items-center gap-1.5 ${isAnnual ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
                <span>Annual Billing</span>
                <span className="px-2 py-0.5 bg-green-500/15 text-green-500 rounded text-[9px] font-extrabold uppercase">Save 20%</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="glass-card p-8 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Free Sandbox</h3>
                <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">Perfect for developer local evaluations and prototype configurations.</p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white">$0</span>
                  <span className="text-xs text-slate-500 ml-1">/ forever</span>
                </div>
                <ul className="mt-8 space-y-3 text-xs text-slate-600 dark:text-slate-400 leading-normal font-light">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-500" /> SQLite local database setup</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-500" /> 1 active admin user</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-500" /> Platform Admin & Master CRUD</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-500" /> Basic security audit log</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-500" /> Multi-tenant logic mock</li>
                </ul>
              </div>
              <Link
                href="/signup"
                className="mt-8 w-full py-3 bg-slate-200 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white text-center font-bold uppercase tracking-wider text-[10px] rounded-lg transition-colors"
              >
                Sign Up Free
              </Link>
            </div>

            {/* Pro */}
            <div className="glass-card p-8 rounded-2xl border-2 border-indigo-500 bg-indigo-500/5 dark:bg-indigo-500/5 flex flex-col justify-between relative shadow-xl shadow-indigo-500/5">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-indigo-600 text-white text-[9px] font-bold uppercase tracking-widest">
                Popular
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Professional</h3>
                <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">Ideal for growing teams needing full-stack DB deployments.</p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                    ${isAnnual ? '79' : '99'}
                  </span>
                  <span className="text-xs text-slate-500 ml-1">/ month</span>
                </div>
                <ul className="mt-8 space-y-3 text-xs text-slate-600 dark:text-slate-400 leading-normal font-light">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-500" /> PostgreSQL / MySQL setup ready</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-500" /> Up to 10 active users</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-500" /> Modules 1-5 complete CRUD</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-500" /> QR-code stock identifier scanning</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-500" /> Email service webhook notifications</li>
                </ul>
              </div>
              <Link
                href="/signup"
                className="mt-8 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-center font-bold uppercase tracking-wider text-[10px] rounded-lg transition-colors shadow-lg shadow-indigo-600/10"
              >
                Get Started
              </Link>
            </div>

            {/* Enterprise */}
            <div className="glass-card p-8 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Enterprise Suite</h3>
                <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">Fully loaded multi-tenant configuration with high-volume scaling.</p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                    ${isAnnual ? '399' : '499'}
                  </span>
                  <span className="text-xs text-slate-500 ml-1">/ month</span>
                </div>
                <ul className="mt-8 space-y-3 text-xs text-slate-600 dark:text-slate-400 leading-normal font-light">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-500" /> Unlimited active user accounts</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-500" /> Advanced Workflow Automation</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-500" /> 24/7 technical priority SLA</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-500" /> Docker cloud orchestration setups</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-500" /> Custom integrations API handles</li>
                </ul>
              </div>
              <Link
                href="/signup"
                className="mt-8 w-full py-3 bg-slate-200 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white text-center font-bold uppercase tracking-wider text-[10px] rounded-lg transition-colors"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ Accordions */}
      <section id="faq" className="py-20 lg:py-28 border-t border-slate-200 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <HelpCircle className="w-8 h-8 text-indigo-500 mx-auto mb-3" />
            <h2 className="text-3xl font-extrabold tracking-tight">
              Frequently Asked{' '}
              <span className="bg-gradient-to-r from-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm font-light">
              Clear technical details on deployment architecture, database configurations, and multi-tenant security structures.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="glass-card rounded-xl border border-slate-200 dark:border-slate-800/80 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-4 flex items-center justify-between font-bold text-xs uppercase tracking-wider text-left text-slate-800 dark:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-850/25 transition-colors focus:outline-none"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-250 ${openFaqIndex === idx ? 'rotate-180' : ''}`} />
                </button>
                
                {openFaqIndex === idx && (
                  <div className="px-6 pb-5 pt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light border-t border-slate-100 dark:border-slate-850">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Contact Section */}
      <section id="contact" className="py-20 lg:py-28 border-t border-slate-200 dark:border-slate-800/80 bg-slate-100/50 dark:bg-[#090d16]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto glass-card rounded-3xl border border-slate-200 dark:border-slate-800/80 p-8 md:p-12 overflow-hidden relative shadow-lg bg-white/40 dark:bg-slate-900/40">
            <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-cyan-500/5 blur-[95px] pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              
              {/* Info Column */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-extrabold tracking-tight">
                    Let’s Connect{' '}
                    <span className="bg-gradient-to-r from-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                      Operations
                    </span>
                  </h2>
                  <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                    Have questions about specific module specifications, multi-tenancy logical isolation, custom cloud configurations, or need a personal walk-through of the platform? Write to us!
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-200/50 dark:border-slate-850">
                  <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-450">
                    <Mail className="w-5 h-5 text-indigo-500 shrink-0" />
                    <span>sales@nextgenerp.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-450">
                    <MapPin className="w-5 h-5 text-indigo-500 shrink-0" />
                    <span>Silicon Valley Headquarters, San Jose, CA</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-450">
                    <Briefcase className="w-5 h-5 text-indigo-500 shrink-0" />
                    <span>Business Hours: Mon - Fri, 9:00 AM - 6:00 PM PST</span>
                  </div>
                </div>
              </div>

              {/* Form Column */}
              <div>
                {contactSubmitted ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-green-500/10 border border-green-500/20 rounded-2xl">
                    <CheckCircle2 className="w-12 h-12 text-green-500 mb-4 bg-green-500/20 p-2.5 rounded-full" />
                    <h3 className="font-bold text-green-600 dark:text-green-400">Message Received!</h3>
                    <p className="text-xs text-slate-500 mt-2 font-light">
                      Thanks for reaching out. A systems engineer will follow up within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-bold text-slate-500 mb-1.5">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-100/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                          placeholder="Jane Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider font-bold text-slate-500 mb-1.5">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-100/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                          placeholder="jane@company.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider font-bold text-slate-500 mb-1.5">Message</label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <textarea
                          required
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          rows={4}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-100/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                          placeholder="Describe your operational requirement..."
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-wider text-xs rounded-lg transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2"
                    >
                      <span>Send Message</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 9. Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-slate-100 dark:bg-[#070b12] py-12 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          
          <div className="space-y-4 col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <SparkleIcon className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white">NextGen ERP</span>
            </div>
            <p className="text-[10px] font-light leading-relaxed text-slate-450">
              Modern enterprise resource planning infrastructure built for developers and operators. Local-first databases, dynamic CRUD grids, and real-time operations telemetry.
            </p>
          </div>

          <div className="space-y-3">
            <p className="font-bold uppercase tracking-wider text-[10px] text-slate-800 dark:text-slate-200">ERP Modules</p>
            <ul className="space-y-2 font-light">
              <li><a href="#features" className="hover:text-indigo-500 transition-colors">Platform Administration</a></li>
              <li><a href="#features" className="hover:text-indigo-500 transition-colors">Master Data Hub</a></li>
              <li><a href="#features" className="hover:text-indigo-500 transition-colors">CRM & Quotation Pipeline</a></li>
              <li><a href="#features" className="hover:text-indigo-500 transition-colors">Procurement Flow</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="font-bold uppercase tracking-wider text-[10px] text-slate-800 dark:text-slate-200">Developers</p>
            <ul className="space-y-2 font-light">
              <li><a href="#faq" className="hover:text-indigo-500 transition-colors">Prisma Schema specs</a></li>
              <li><a href="#faq" className="hover:text-indigo-500 transition-colors">Docker Compose files</a></li>
              <li><a href="#faq" className="hover:text-indigo-500 transition-colors">SQLite database URL</a></li>
              <li><a href="#faq" className="hover:text-indigo-500 transition-colors">JWT Middleware logic</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="font-bold uppercase tracking-wider text-[10px] text-slate-800 dark:text-slate-200">Legal & SLA</p>
            <ul className="space-y-2 font-light">
              <li><a href="#" className="hover:text-indigo-500 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-500 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-indigo-500 transition-colors">SLA uptime guarantees</a></li>
              <li><a href="#" className="hover:text-indigo-500 transition-colors">Logical Isolation specs</a></li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200/50 dark:border-slate-800/40 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px]">
          <p>© 2026 NextGen ERP Systems, Inc. All rights reserved. Registered trademark of Apex Global Enterprises.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">GitHub</a>
            <a href="#" className="hover:underline">Twitter</a>
            <a href="#" className="hover:underline">Discord Community</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
