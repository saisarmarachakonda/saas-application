'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import DecoupledAppLayout from '@/components/layouts/DecoupledAppLayout';
import { Landmark } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname?.endsWith('/login');

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <DecoupledAppLayout
      app="finance"
      title="Finance & Accounts Portal"
      themeColor="purple"
      icon={<Landmark className="w-5 h-5" />}
    >
      {children}
    </DecoupledAppLayout>
  );
}
