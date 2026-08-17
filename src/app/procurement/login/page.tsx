import React from 'react';
import DecoupledAppLoginForm from '@/components/auth/DecoupledAppLoginForm';
import { ShoppingCart } from 'lucide-react';

export default function LoginPage() {
  return (
    <DecoupledAppLoginForm
      app="procurement"
      title="Procurement Management Portal Sign In"
      themeColor="orange"
      logoIcon={<ShoppingCart className="w-5 h-5" />}
    />
  );
}
