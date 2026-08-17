import React from 'react';
import DecoupledAppLoginForm from '@/components/auth/DecoupledAppLoginForm';
import { Layers } from 'lucide-react';

export default function ERPLoginPage() {
  return (
    <DecoupledAppLoginForm
      app="erp"
      title="Enterprise Resource Planning (ERP) Sign In"
      themeColor="blue"
      logoIcon={<Layers className="w-5 h-5" />}
    />
  );
}
