import React from 'react';
import DecoupledAppLoginForm from '@/components/auth/DecoupledAppLoginForm';
import { Briefcase } from 'lucide-react';

export default function LoginPage() {
  return (
    <DecoupledAppLoginForm
      app="hrm"
      title="HRM & Payroll Operations Portal Sign In"
      themeColor="blue"
      logoIcon={<Briefcase className="w-5 h-5" />}
    />
  );
}
