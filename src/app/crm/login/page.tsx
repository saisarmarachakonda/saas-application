import React from 'react';
import DecoupledAppLoginForm from '@/components/auth/DecoupledAppLoginForm';
import { Users2 } from 'lucide-react';

export default function LoginPage() {
  return (
    <DecoupledAppLoginForm
      app="crm"
      title="CRM & Quotation Portal Sign In"
      themeColor="indigo"
      logoIcon={<Users2 className="w-5 h-5" />}
    />
  );
}
