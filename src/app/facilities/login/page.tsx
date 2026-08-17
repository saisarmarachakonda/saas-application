import React from 'react';
import DecoupledAppLoginForm from '@/components/auth/DecoupledAppLoginForm';
import { Building2 } from 'lucide-react';

export default function FacilitiesLoginPage() {
  return (
    <DecoupledAppLoginForm
      app="facilities"
      title="Facilities & Asset Management Sign In"
      themeColor="orange"
      logoIcon={<Building2 className="w-5 h-5" />}
    />
  );
}
