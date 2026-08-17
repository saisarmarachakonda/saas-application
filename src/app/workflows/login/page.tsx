import React from 'react';
import DecoupledAppLoginForm from '@/components/auth/DecoupledAppLoginForm';
import { GitFork } from 'lucide-react';

export default function LoginPage() {
  return (
    <DecoupledAppLoginForm
      app="workflows"
      title="Workflow Automation Portal Sign In"
      themeColor="pink"
      logoIcon={<GitFork className="w-5 h-5" />}
    />
  );
}
