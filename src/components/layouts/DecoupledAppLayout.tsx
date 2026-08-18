'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import {
  Sparkles,
  Sun,
  Moon,
  LogOut,
  X,
  Menu,
  ChevronRight,
  User,
  ArrowLeft,
  Activity,
  Home,
  Building2,
  Factory,
  Warehouse,
  Layers,
  Users2,
  CreditCard,
  Truck,
  Boxes,
  FileText,
  Compass,
  HelpCircle,
  FileSpreadsheet,
  ShoppingBag,
  FileSignature,
  MailOpen,
  FileCheck,
  ClipboardCheck,
  Award,
  ArrowLeftRight,
  AlertTriangle,
  DollarSign,
  BookOpen,
  PieChart,
  Receipt,
  PlayCircle,
  History,
  Sliders,
  Grid,
  Clock,
  Fingerprint,
  Calendar,
  ShieldCheck,
  Shirt,
  Wrench,
  MapPin
} from 'lucide-react';

interface DecoupledAppLayoutProps {
  app: string;
  title: string;
  themeColor: string; // e.g. 'indigo', 'emerald', 'blue', 'orange', 'cyan', 'purple'
  icon: React.ReactNode;
  children: React.ReactNode;
}

export default function DecoupledAppLayout({
  app,
  title,
  themeColor,
  icon,
  children
}: DecoupledAppLayoutProps) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userName, setUserName] = useState('Workspace User');
  const [userEmail, setUserEmail] = useState('user@example.com');
  const [userRole, setUserRole] = useState<'Admin' | 'Employee'>('Employee');

  // Load user info from cookies/token in client fallback
  useEffect(() => {
    try {
      const email = typeof window !== 'undefined' ? localStorage.getItem('sim_email') || 'staff@vocinfra.com' : 'staff@vocinfra.com';
      const name = typeof window !== 'undefined' ? localStorage.getItem('sim_name') || 'Kiran Kumar' : 'Kiran Kumar';
      const savedRole = typeof window !== 'undefined' ? (localStorage.getItem('sim_role') as 'Admin' | 'Employee') || (email.toLowerCase().includes('admin') ? 'Admin' : 'Employee') : 'Employee';
      setUserEmail(email);
      setUserName(name);
      setUserRole(savedRole);
    } catch (e) {
      // ignore
    }
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch(`/api/auth/${app.toLowerCase()}/logout`, { method: 'POST' });
      if (res.ok) {
        router.push(`/${app.toLowerCase()}/login`);
        router.refresh();
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const getThemeColorClass = () => {
    switch (themeColor) {
      case 'indigo': return 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20';
      case 'emerald': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'blue': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'orange': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'cyan': return 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20';
      case 'purple': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
      case 'pink': return 'text-pink-500 bg-pink-500/10 border-pink-500/20';
      case 'slate': return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
      default: return 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20';
    }
  };

  const getGlowClass = () => {
    switch (themeColor) {
      case 'indigo': return 'glow-indigo bg-indigo-650';
      case 'emerald': return 'glow-emerald bg-emerald-600';
      case 'blue': return 'glow-blue bg-blue-600';
      case 'orange': return 'glow-orange bg-orange-600';
      case 'cyan': return 'glow-cyan bg-cyan-600';
      case 'purple': return 'glow-purple bg-purple-650';
      default: return 'glow-indigo bg-indigo-650';
    }
  };

  const pathname = usePathname();

  const getSidebarLinks = () => {
    const base = `/${app.toLowerCase()}`;
    const links = [
      { name: 'Dashboard Overview', path: base, icon: <Home className="w-5 h-5" /> }
    ];

    switch (app.toLowerCase()) {
      case 'admin':
        links.push(
          { name: 'Companies Setup', path: `${base}/companies`, icon: <Building2 className="w-5 h-5" /> },
          { name: 'Plants Setup', path: `${base}/plants`, icon: <Factory className="w-5 h-5" /> },
          { name: 'Warehouses Catalog', path: `${base}/warehouses`, icon: <Warehouse className="w-5 h-5" /> },
          { name: 'Departments Matrix', path: `${base}/departments`, icon: <Layers className="w-5 h-5" /> },
          { name: 'Users Register', path: `${base}/users`, icon: <Users2 className="w-5 h-5" /> },
          { name: 'Subscriptions', path: `${base}/subscriptions`, icon: <CreditCard className="w-5 h-5" /> },
          { name: 'Security Audit Logs', path: `${base}/security-logs`, icon: <Activity className="w-5 h-5" /> }
        );
        break;
      case 'hrm':
        if (userRole === 'Employee') {
          links.push(
            { name: 'My Profile & Bio-Data', path: `${base}/employees`, icon: <User className="w-5 h-5" /> },
            { name: 'My Attendance Logs', path: `${base}/attendance`, icon: <Fingerprint className="w-5 h-5" /> },
            { name: 'My Mobile GPS Geo Punch', path: `${base}/geo-tracking`, icon: <MapPin className="w-5 h-5" /> },
            { name: 'My Payslips & EPF/ESI', path: `${base}/payroll`, icon: <FileText className="w-5 h-5" /> },
            { name: 'My Letters & Appraisal', path: `${base}/letters`, icon: <MailOpen className="w-5 h-5" /> },
            { name: 'My Uniform & Gear Sizing', path: `${base}/uniforms`, icon: <Shirt className="w-5 h-5" /> },
            { name: 'My Task Checklists', path: `${base}/checklists`, icon: <ClipboardCheck className="w-5 h-5" /> },
            { name: 'My Insurance & ESI Info', path: `${base}/compliance`, icon: <ShieldCheck className="w-5 h-5" /> }
          );
        } else {
          links.push(
            { name: 'Core HR & Employee Master', path: `${base}/employees`, icon: <Users2 className="w-5 h-5" /> },
            { name: 'PF, ESIC & PT Statutory Audit', path: `${base}/esic-summary`, icon: <FileSpreadsheet className="w-5 h-5" /> },
            { name: 'MIDAS Project Payroll', path: `${base}/midas-summary`, icon: <Building2 className="w-5 h-5" /> },
            { name: 'Onboarding & Bio-Data', path: `${base}/onboarding`, icon: <FileCheck className="w-5 h-5" /> },
            { name: 'Monthly Staff Attendance', path: `${base}/attendance`, icon: <Fingerprint className="w-5 h-5" /> },
            { name: 'Mobile GPS Geo Punch Logs', path: `${base}/geo-tracking`, icon: <MapPin className="w-5 h-5" /> },
            { name: 'Payroll & Salary Hold/Release', path: `${base}/payroll`, icon: <FileText className="w-5 h-5" /> },
            { name: 'Letters & Appraisal Dispatch', path: `${base}/letters`, icon: <MailOpen className="w-5 h-5" /> },
            { name: 'Approval Hierarchy Engine', path: `${base}/approval-hierarchy`, icon: <Sliders className="w-5 h-5" /> },
            { name: 'Insurance & ESI Repository', path: `${base}/compliance`, icon: <ShieldCheck className="w-5 h-5" /> },
            { name: 'Site Task Checklists', path: `${base}/checklists`, icon: <ClipboardCheck className="w-5 h-5" /> },
            { name: 'Uniform Inventory & Sizing', path: `${base}/uniforms`, icon: <Shirt className="w-5 h-5" /> },
            { name: 'Company Assets & Machinery', path: `${base}/materials`, icon: <Wrench className="w-5 h-5" /> },
            { name: 'GMR Site Consumables Log', path: `${base}/gmr-inventory`, icon: <Boxes className="w-5 h-5" /> },
            { name: 'Manpower Deployment Roster', path: `${base}/manpower`, icon: <Layers className="w-5 h-5" /> },
            { name: 'Approval Communication', path: `${base}/communication`, icon: <FileSignature className="w-5 h-5" /> }
          );
        }
        break;
      case 'master-data':
        links.push(
          { name: 'Customers Master', path: `${base}/customers`, icon: <Users2 className="w-5 h-5" /> },
          { name: 'Vendors Master', path: `${base}/vendors`, icon: <Truck className="w-5 h-5" /> },
          { name: 'Product Categories', path: `${base}/categories`, icon: <Layers className="w-5 h-5" /> },
          { name: 'Products Setup', path: `${base}/products`, icon: <Boxes className="w-5 h-5" /> },
          { name: 'Materials Specs', path: `${base}/materials`, icon: <FileText className="w-5 h-5" /> }
        );
        break;
      case 'crm':
        links.push(
          { name: 'Leads Pipeline', path: `${base}/leads`, icon: <Compass className="w-5 h-5" /> },
          { name: 'Opportunities', path: `${base}/opportunities`, icon: <Sparkles className="w-5 h-5" /> },
          { name: 'Customer RFQs', path: `${base}/rfqs`, icon: <HelpCircle className="w-5 h-5" /> },
          { name: 'Quotations', path: `${base}/quotations`, icon: <FileSpreadsheet className="w-5 h-5" /> },
          { name: 'Sales Orders', path: `${base}/sales-orders`, icon: <ShoppingBag className="w-5 h-5" /> }
        );
        break;
      case 'procurement':
        links.push(
          { name: 'Requisitions', path: `${base}/requisitions`, icon: <FileSignature className="w-5 h-5" /> },
          { name: 'Vendor RFQs', path: `${base}/rfqs`, icon: <MailOpen className="w-5 h-5" /> },
          { name: 'Purchase Orders', path: `${base}/orders`, icon: <FileCheck className="w-5 h-5" /> },
          { name: 'Goods Receipts', path: `${base}/receipts`, icon: <ClipboardCheck className="w-5 h-5" /> },
          { name: 'Supplier Scorecards', path: `${base}/scorecards`, icon: <Award className="w-5 h-5" /> }
        );
        break;
      case 'inventory':
        links.push(
          { name: 'Stock Inventory', path: `${base}/items`, icon: <Boxes className="w-5 h-5" /> },
          { name: 'Stock Movements', path: `${base}/movements`, icon: <ArrowLeftRight className="w-5 h-5" /> },
          { name: 'Safety Alerts', path: `${base}/alerts`, icon: <AlertTriangle className="w-5 h-5" /> }
        );
        break;
      case 'finance':
        links.push(
          { name: 'GL Transactions', path: `${base}/transactions`, icon: <DollarSign className="w-5 h-5" /> },
          { name: 'Journal Entries', path: `${base}/journal-entries`, icon: <BookOpen className="w-5 h-5" /> },
          { name: 'Budget Tracking', path: `${base}/budgets`, icon: <PieChart className="w-5 h-5" /> },
          { name: 'Tax Compliance', path: `${base}/tax-records`, icon: <Receipt className="w-5 h-5" /> }
        );
        break;
      case 'workflows':
        links.push(
          { name: 'Active Instances', path: `${base}/instances`, icon: <PlayCircle className="w-5 h-5" /> },
          { name: 'Automation Logs', path: `${base}/logs`, icon: <History className="w-5 h-5" /> }
        );
        break;
      case 'erp':
        links.push(
          { name: 'MRP Work Orders', path: `${base}/work-orders`, icon: <Factory className="w-5 h-5" /> },
          { name: 'Material Allocations', path: `${base}/material-allocations`, icon: <Boxes className="w-5 h-5" /> },
          { name: 'Plant Capacity', path: `${base}/plant-capacity`, icon: <Activity className="w-5 h-5" /> },
          { name: 'Bill of Materials (BOM)', path: `${base}/bom`, icon: <Layers className="w-5 h-5" /> },
          { name: 'Cost Center Routing', path: `${base}/cost-centers`, icon: <DollarSign className="w-5 h-5" /> }
        );
        break;
      case 'facilities':
        links.push(
          { name: 'Asset Master Register', path: `${base}/assets`, icon: <Boxes className="w-5 h-5" /> },
          { name: 'Heavy Machinery Tracker', path: `${base}/machinery`, icon: <Factory className="w-5 h-5" /> },
          { name: 'Preventive Maintenance', path: `${base}/maintenance-schedule`, icon: <Calendar className="w-5 h-5" /> },
          { name: 'Site Asset Transfers', path: `${base}/site-transfers`, icon: <ArrowLeftRight className="w-5 h-5" /> },
          { name: 'Depreciation & Ledger', path: `${base}/depreciation-ledger`, icon: <DollarSign className="w-5 h-5" /> },
          { name: 'Spare Parts Stock', path: `${base}/spare-parts`, icon: <Wrench className="w-5 h-5" /> },
          { name: 'Breakdown Tickets', path: `${base}/breakdown-tickets`, icon: <AlertTriangle className="w-5 h-5" /> },
          { name: 'Warranties & Insurance', path: `${base}/warranties-insurance`, icon: <ShieldCheck className="w-5 h-5" /> },
          { name: 'Safety Inspections', path: `${base}/safety-inspections`, icon: <ClipboardCheck className="w-5 h-5" /> },
          { name: 'Maintenance Work Orders', path: `${base}/work-orders`, icon: <FileCheck className="w-5 h-5" /> }
        );
        break;
      case 'settings':
        links.push(
          { name: 'System Settings', path: `${base}/general`, icon: <Sliders className="w-5 h-5" /> },
          { name: 'Approval Matrix', path: `${base}/approval-matrix`, icon: <Grid className="w-5 h-5" /> }
        );
        break;
    }
    return links;
  };

  const sidebarLinks = getSidebarLinks();

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-slate-100 font-sans">
      
      {/* 1. Sidebar */}
      <aside className={`hidden md:flex flex-col border-r border-slate-200/80 dark:border-zinc-900/80 bg-slate-100/95 dark:bg-zinc-950/95 backdrop-blur-xl text-slate-800 dark:text-slate-200 transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        
        {/* Sidebar Brand */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200/60 dark:border-zinc-900/60">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <img src="/logo.png" alt="VOC VERTEX" className="h-9 md:h-10 object-contain shrink-0" />
            {sidebarOpen && (
              <span className="font-extrabold text-xs tracking-wider uppercase truncate text-slate-800 dark:text-white">
                {app.replace('-', ' ')}
              </span>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/80 transition-colors"
          >
            <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${sidebarOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-none">
          {sidebarLinks.map((link, idx) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={idx}
                href={link.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-150 border ${
                  isActive
                    ? 'bg-slate-200 dark:bg-slate-800/80 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/40 dark:hover:bg-slate-850/40 border-transparent'
                }`}
              >
                <span className={isActive ? 'text-indigo-500 dark:text-indigo-400' : 'text-slate-400'}>{link.icon}</span>
                {sidebarOpen && <span>{link.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Card */}
        <div className="p-4 border-t border-slate-200/60 dark:border-zinc-900/60 bg-slate-150/30 dark:bg-zinc-950/30">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-300/30">
              <User className="w-4 h-4 text-slate-655" />
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black truncate text-slate-900 dark:text-white leading-none">{userName}</p>
                <span className="text-[10px] text-slate-400 truncate mt-0.5 block leading-none font-medium">{userEmail}</span>
              </div>
            )}
            {sidebarOpen && (
              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-1.5 rounded-lg text-slate-450 hover:text-red-500 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
          {!sidebarOpen && (
            <button
              onClick={handleLogout}
              className="mt-3 w-full flex items-center justify-center p-2 rounded-lg text-slate-450 hover:text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>

      {/* 2. Main Page Column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-200/80 dark:border-zinc-900/80 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-[#f5f5f7] dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500">
              App Portal
            </span>
            <h2 className="text-sm font-extrabold text-slate-850 dark:text-slate-200 hidden md:block">
              {title}
            </h2>
          </div>

          <div className="flex items-center gap-3.5">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200/80 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors text-slate-500 hover:text-slate-850 dark:hover:text-white cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* Simulated Online Status */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-500 text-[10px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Mock-Db Active</span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-6 scrollbar-none relative">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}
