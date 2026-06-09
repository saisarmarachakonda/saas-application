'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import {
  Sparkles,
  Building2,
  Database,
  Users2,
  ShoppingCart,
  Boxes,
  LineChart,
  Settings,
  Bell,
  Sun,
  Moon,
  LogOut,
  Bot,
  Send,
  X,
  Menu,
  ChevronRight,
  User,
  ArrowRight,
  Activity,
  Check,
  Landmark,
  GitFork
} from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface UserProfile {
  userId: string;
  email: string;
  name: string;
  roleName: string;
  companyId?: string | null;
}

export default function DashboardLayout({
  children,
  user,
  initialNotifications = []
}: {
  children: React.ReactNode;
  user: UserProfile;
  initialNotifications?: NotificationItem[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  // Navigation states
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);


  // Auto-close dropdowns and track navigation history in localStorage
  useEffect(() => {
    setNotificationOpen(false);
    setMobileSidebarOpen(false);

    try {
      const currentLink = sidebarLinks.find(link => link.path === pathname || (link.path !== '/dashboard' && pathname.startsWith(link.path)));
      if (currentLink) {
        const stored = localStorage.getItem('recent_navigations');
        let navs = stored ? JSON.parse(stored) : [];
        // Remove existing item to move to top
        navs = navs.filter((item: any) => item.path !== currentLink.path);
        // Add current item to front
        navs.unshift({
          name: currentLink.name,
          path: currentLink.path,
          timestamp: new Date().toISOString()
        });
        // Limit to last 5
        navs = navs.slice(0, 5);
        localStorage.setItem('recent_navigations', JSON.stringify(navs));
        
        // Dispatch custom event to notify other components (e.g. RecentNavigations widget on the same page)
        window.dispatchEvent(new Event('recent_navigations_updated'));
      }
    } catch (e) {
      console.warn('Failed to update navigation history:', e);
    }
  }, [pathname]);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/login');
        router.refresh();
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const markAllNotificationsRead = async () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    // In background we could make API call to mark them read
  };

  const sidebarLinks = [
    { name: 'Executive Dashboard', path: '/dashboard', icon: <LineChart className="w-5 h-5" /> },
    { name: 'Platform Administration', path: '/dashboard/admin', icon: <Building2 className="w-5 h-5" /> },
    { name: 'Master Data', path: '/dashboard/master-data', icon: <Database className="w-5 h-5" /> },
    { name: 'CRM & Quotation', path: '/dashboard/crm', icon: <Users2 className="w-5 h-5" /> },
    { name: 'Procurement', path: '/dashboard/procurement', icon: <ShoppingCart className="w-5 h-5" /> },
    { name: 'Inventory & WH', path: '/dashboard/inventory', icon: <Boxes className="w-5 h-5" /> },
    { name: 'Finance & Accounts', path: '/dashboard/finance', icon: <Landmark className="w-5 h-5" /> },
    { name: 'Workflow Automations', path: '/dashboard/workflows', icon: <GitFork className="w-5 h-5" /> },
    { name: 'Settings & Billing', path: '/dashboard/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-slate-100">
      
      {/* 1. Sidebar - Desktop */}
      <aside className={`hidden md:flex flex-col border-r border-slate-200/80 dark:border-zinc-900/80 bg-slate-100/95 dark:bg-zinc-950/95 backdrop-blur-xl text-slate-800 dark:text-slate-200 transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        {/* Sidebar Brand */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200/60 dark:border-zinc-900/60">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 bg-indigo-650 rounded-lg flex items-center justify-center glow-indigo shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            {sidebarOpen && (
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-indigo-500 to-cyan-555 bg-clip-text text-transparent truncate">
                VOC ERP
              </span>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg text-slate-555 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/80 transition-colors"
          >
            <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${sidebarOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-none">
          {sidebarLinks.map((link, idx) => {
            const isActive = pathname === link.path || (link.path !== '/dashboard' && pathname.startsWith(link.path));
            return (
              <Link
                key={idx}
                href={link.path}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all relative ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-655 dark:text-slate-400 hover:bg-slate-200/65 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
                title={link.name}
              >
                <div className={`shrink-0 transition-colors duration-200 ${isActive ? 'text-white' : 'text-slate-550 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'}`}>
                  {link.icon}
                </div>
                {sidebarOpen && <span className="truncate">{link.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-200/60 dark:border-zinc-900/60 space-y-3">
          {/* User Profile display */}
          <div className="flex items-center gap-3 overflow-hidden bg-slate-200/50 dark:bg-slate-900/60 p-2 rounded-lg border border-slate-300/40 dark:border-slate-800/40">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-655 dark:text-indigo-400 flex items-center justify-center font-bold uppercase shrink-0">
              {user.name.charAt(0)}
            </div>
            {sidebarOpen && (
              <div className="truncate">
                <p className="text-xs font-bold text-slate-850 dark:text-white truncate">{user.name}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-455 truncate font-semibold uppercase tracking-wider mt-0.5">{user.roleName}</p>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold uppercase tracking-wider text-red-655 dark:text-red-400 hover:text-red-750 dark:hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* 2. Mobile Sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs" onClick={() => setMobileSidebarOpen(false)} />
          <aside className="relative flex flex-col w-64 max-w-xs bg-slate-100 dark:bg-zinc-950 border-r border-slate-200 dark:border-zinc-900 p-4">
            <div className="flex items-center justify-between mb-6">
              <span className="font-extrabold text-base uppercase tracking-wider bg-gradient-to-r from-indigo-500 to-cyan-555 bg-clip-text text-transparent">VOC ERP</span>
              <button onClick={() => setMobileSidebarOpen(false)}>
                <X className="w-6 h-6 text-slate-500 dark:text-slate-400" />
              </button>
            </div>
            <nav className="flex-1 space-y-1">
              {sidebarLinks.map((link, idx) => {
                const isActive = pathname === link.path || (link.path !== '/dashboard' && pathname.startsWith(link.path));
                return (
                  <Link
                    key={idx}
                    href={link.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all relative ${
                      isActive ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-655 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className={isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}>{link.icon}</div>
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-slate-200 dark:border-zinc-900 pt-4 mt-auto">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold uppercase tracking-wider text-red-655 dark:text-red-400 hover:bg-red-500/10 rounded-lg"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* 3. Main content structure */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-white/50 dark:bg-[#030712]/50 border-b border-slate-200/80 dark:border-slate-900 backdrop-blur-md relative z-30 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest hidden sm:block">
              {pathname === '/dashboard' ? 'SYS // EXECUTIVE CONTROL PANEL' : `SYS // ${pathname.replace('/dashboard/', '').replace('-', ' ').toUpperCase()}`}
            </div>
          </div>

          <div className="flex items-center gap-4">

            {/* Light/Dark Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-455 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200/40 dark:border-slate-850"
            >
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* Notifications panel dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="p-2 rounded-lg text-slate-500 dark:text-slate-455 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative border border-slate-200/40 dark:border-slate-850"
              >
                <Bell className="w-4.5 h-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-red-500 text-[8px] text-white font-extrabold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationOpen && (
                <div className="absolute right-0 mt-2.5 w-80 glass-card rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-zinc-950 p-4 shadow-xl z-50">
                  <div className="flex items-center justify-between mb-3 border-b border-slate-200 dark:border-slate-800 pb-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Telemetry Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[10px] text-indigo-500 hover:text-indigo-400 font-bold uppercase tracking-wider"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-center text-xs text-slate-450 py-4 font-normal">System is fully cleared.</p>
                    ) : (
                      notifications.map((notif, idx) => (
                        <div key={idx} className={`p-2.5 rounded-lg text-xs leading-relaxed border transition-colors ${
                          notif.read ? 'bg-slate-50/50 dark:bg-slate-950/20 border-transparent text-slate-500' : 'bg-indigo-500/5 dark:bg-indigo-500/10 border-indigo-500/10'
                        }`}>
                          <div className="flex justify-between items-start gap-1">
                            <p className={`font-semibold ${notif.read ? 'text-slate-600 dark:text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>{notif.title}</p>
                            {!notif.read && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1 shrink-0" />}
                          </div>
                          <p className="text-slate-500 dark:text-slate-400 font-light mt-0.5 text-[11px]">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar indicator */}
            <div className="w-8.5 h-8.5 rounded-lg border border-slate-200/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900 flex items-center justify-center font-bold text-xs text-indigo-600 dark:text-indigo-400 select-none shadow-xs">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50/40 dark:bg-[#030712]/30">
          <div className="w-full space-y-6 max-w-none">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}
