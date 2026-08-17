import React from 'react';
import DecoupledAppLoginForm from '@/components/auth/DecoupledAppLoginForm';
import { Boxes } from 'lucide-react';

export default function LoginPage() {
  return (
    <DecoupledAppLoginForm
      app="inventory"
      title="Inventory & Warehouse Portal Sign In"
      themeColor="emerald"
      logoIcon={<Boxes className="w-5 h-5" />}
    />
  );
}
