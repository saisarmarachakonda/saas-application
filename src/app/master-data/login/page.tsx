import React from 'react';
import DecoupledAppLoginForm from '@/components/auth/DecoupledAppLoginForm';
import { Database } from 'lucide-react';

export default function LoginPage() {
  return (
    <DecoupledAppLoginForm
      app="master-data"
      title="Master Data Repository Sign In"
      themeColor="cyan"
      logoIcon={<Database className="w-5 h-5" />}
    />
  );
}
