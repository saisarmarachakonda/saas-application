'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Clock } from 'lucide-react';

interface NavItem {
  name: string;
  path: string;
}

const defaultNavs: NavItem[] = [
  { name: 'Platform Administration', path: '/dashboard/admin' },
  { name: 'CRM & Quotation', path: '/dashboard/crm' },
  { name: 'Finance & Accounts', path: '/dashboard/finance' },
  { name: 'Inventory & WH', path: '/dashboard/inventory' },
];

export default function RecentNavigations() {
  const [navs, setNavs] = useState<NavItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  const loadNavs = () => {
    try {
      const stored = localStorage.getItem('recent_navigations');
      let loaded: NavItem[] = stored ? JSON.parse(stored) : [];
      
      // Filter out the current pathname to avoid self-linking
      loaded = loaded.filter(item => item.path !== pathname);

      // If empty, fallback to a subset of default pages
      if (loaded.length === 0) {
        loaded = defaultNavs.filter(item => item.path !== pathname);
      }

      setNavs(loaded.slice(0, 4));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadNavs();

    const handleUpdate = () => {
      loadNavs();
    };

    window.addEventListener('recent_navigations_updated', handleUpdate);
    return () => {
      window.removeEventListener('recent_navigations_updated', handleUpdate);
    };
  }, [pathname]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs py-1">
      <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500 font-medium select-none">
        <Clock className="w-3.5 h-3.5" />
        <span>Recent:</span>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        {navs.map((nav, index) => (
          <Link
            key={index}
            href={nav.path}
            className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-slate-100 hover:bg-indigo-650 hover:text-white dark:bg-slate-800/80 dark:hover:bg-indigo-600 border border-slate-200 dark:border-slate-700/50 text-slate-600 dark:text-slate-350 transition-all"
          >
            {nav.name.replace(' & WH', '').replace(' & Accounts', '').replace(' & Quotation', '')}
          </Link>
        ))}
      </div>
    </div>
  );
}
