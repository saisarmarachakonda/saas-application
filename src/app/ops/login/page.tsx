import React from 'react';
import DecoupledAppLoginForm from '@/components/auth/DecoupledAppLoginForm';
import { Factory } from 'lucide-react';

export default function OpsLoginPage() {
  return (
    <DecoupledAppLoginForm
      app="ops"
      title="Vertex Ops Core Portal Sign In"
      themeColor="indigo"
      logoIcon={<Factory className="w-5 h-5" />}
    />
  );
}
