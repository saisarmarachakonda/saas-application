import React from 'react';
import DecoupledAppLoginForm from '@/components/auth/DecoupledAppLoginForm';
import { Building2 } from 'lucide-react';

export default function LoginPage() {
  return (
    <DecoupledAppLoginForm
      app="admin"
      title="Platform Administration Portal Sign In"
      themeColor="blue"
      logoIcon={<Building2 className="w-5 h-5" />}
    />
  );
}
