import React from 'react';
import DecoupledAppLoginForm from '@/components/auth/DecoupledAppLoginForm';
import { Landmark } from 'lucide-react';

export default function LoginPage() {
  return (
    <DecoupledAppLoginForm
      app="finance"
      title="Finance & Accounts Portal Sign In"
      themeColor="purple"
      logoIcon={<Landmark className="w-5 h-5" />}
    />
  );
}
