'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Users2, ArrowRight, ShieldAlert, Eye, EyeOff, ArrowLeft, Building, KeyRound, BadgeCheck, UserCheck, ShieldCheck } from 'lucide-react';

export default function HrmAutomaticLoginPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Dynamic automatic role resolution based on email ID
  const getAutoDetectedRole = (mail: string): { id: 'employee' | 'hr-manager' | 'admin'; title: string; badge: string; icon: React.ReactNode } => {
    const lower = mail.toLowerCase();
    if (lower.includes('hr') || lower.includes('payroll') || lower.includes('statutory') || lower.includes('officer')) {
      return {
        id: 'hr-manager',
        title: 'HR Manager / Officer',
        badge: 'bg-rose-50 text-rose-600 border-rose-200',
        icon: <BadgeCheck className="w-3.5 h-3.5" />
      };
    }
    if (lower.includes('admin') || lower.includes('head') || lower.includes('lead') || lower.includes('director') || lower.includes('manager')) {
      return {
        id: 'admin',
        title: 'Department Head / Admin',
        badge: 'bg-purple-50 text-purple-600 border-purple-200',
        icon: <ShieldCheck className="w-3.5 h-3.5" />
      };
    }
    return {
      id: 'employee',
      title: 'Employee Portal',
      badge: 'bg-blue-50 text-blue-600 border-blue-200',
      icon: <UserCheck className="w-3.5 h-3.5" />
    };
  };

  const detectedRole = getAutoDetectedRole(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/hrm/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: detectedRole.id, employeeId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('sim_email', data.user.email);
      localStorage.setItem('sim_name', data.user.name);
      localStorage.setItem('hrm_role', detectedRole.id);

      // Redirect to HRM workspace with automatically resolved role context
      window.location.href = `/hrm?role=${detectedRole.id}`;
    } catch (err: any) {
      setError(err.message || 'Invalid credentials or authentication error.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfcfd] px-4 py-12 relative overflow-hidden font-sans">
      <div className="w-full max-w-md z-10">
        
        {/* Header & Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3 mb-3">
            <img src="/logo.png" alt="VOC VERTEX" className="h-10 object-contain" />
            <span className="font-extrabold text-xl uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Users2 className="w-6 h-6 text-rose-600" />
              <span>HRM &amp; Workforce Portal</span>
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Sign In to Workforce Workspace</h1>
          <p className="text-xs text-slate-500 mt-1 font-light">
            Enter your employee credentials. Your workspace role will be detected automatically.
          </p>
        </div>

        {/* Form Container */}
        <div className="rounded-3xl border border-slate-200 p-8 shadow-xl bg-white space-y-5">
          
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 font-semibold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-rose-600" />
                <span>Employee ID / Code</span>
              </label>
              <input
                type="text"
                required
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="e.g. EMP-8842"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:border-rose-600 transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-rose-600" />
                  <span>Work Email</span>
                </label>
                {email && (
                  <span className={`inline-flex items-center gap-1 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${detectedRole.badge}`}>
                    {detectedRole.icon}
                    <span>{detectedRole.title}</span>
                  </span>
                )}
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-600 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-rose-600" />
                <span>Password</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-600 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-rose-600 hover:bg-transparent text-white hover:text-rose-600 border border-rose-600 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <span>Authenticating Workspace...</span>
              ) : (
                <>
                  <span>Sign In as {detectedRole.title}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Main Platform Overview</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
