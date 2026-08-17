'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import DecoupledAppLayout from '@/components/layouts/DecoupledAppLayout';
import { Settings } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname?.endsWith('/login');

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <DecoupledAppLayout
      app="settings"
      title="Settings & Billing Portal"
      themeColor="slate"
      icon={<Settings className="w-5 h-5" />}
    >
      {children}
    </DecoupledAppLayout>
  );
}
