import React from 'react';
import DecoupledAppLoginForm from '@/components/auth/DecoupledAppLoginForm';
import { Settings } from 'lucide-react';

export default function LoginPage() {
  return (
    <DecoupledAppLoginForm
      app="settings"
      title="Settings & Billing Portal Sign In"
      themeColor="slate"
      logoIcon={<Settings className="w-5 h-5" />}
    />
  );
}
