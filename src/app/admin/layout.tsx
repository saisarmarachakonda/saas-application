'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import DecoupledAppLayout from '@/components/layouts/DecoupledAppLayout';
import { Building2 } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname?.endsWith('/login');

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <DecoupledAppLayout
      app="admin"
      title="Platform Administration Portal"
      themeColor="blue"
      icon={<Building2 className="w-5 h-5" />}
    >
      {children}
    </DecoupledAppLayout>
  );
}
