'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Users2, ArrowRight, ShieldAlert, Eye, EyeOff, ArrowLeft, UserCheck, ShieldCheck, BadgeCheck } from 'lucide-react';

export default function HrmRoleLoginPage() {
  const router = useRouter();
  
  const [role, setRole] = useState<'employee' | 'hr-manager' | 'admin'>('employee');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const rolesConfig = [
    {
      id: 'employee',
      title: 'Employee Portal',
      subtitle: 'Self-service, Pay Slips, Leave & Attendance',
      icon: <UserCheck className="w-5 h-5" />,
      badgeColor: 'bg-blue-50 text-blue-600 border-blue-200',
    },
    {
      id: 'hr-manager',
      title: 'HR Manager / Officer',
      subtitle: 'Payroll Execution, EPF/ESI & Statutory Clearances',
      icon: <BadgeCheck className="w-5 h-5" />,
      badgeColor: 'bg-rose-50 text-rose-600 border-rose-200',
    },
    {
      id: 'admin',
      title: 'Department Head / Admin',
      subtitle: 'Shift Allocation, Headcount Budgeting & Approvals',
      icon: <ShieldCheck className="w-5 h-5" />,
      badgeColor: 'bg-purple-50 text-purple-600 border-purple-200',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/hrm/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role, employeeId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('sim_email', data.user.email);
      localStorage.setItem('sim_name', data.user.name);
      localStorage.setItem('hrm_role', role);

      // Redirect to HRM workspace with role context
      window.location.href = `/hrm?role=${role}`;
    } catch (err: any) {
      setError(err.message || 'Invalid credentials or permission denied for selected role.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfcfd] px-4 py-12 relative overflow-hidden font-sans">
      <div className="w-full max-w-xl z-10">
        
        {/* Header & Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <img src="/logo.png" alt="VOC VERTEX" className="h-10 object-contain" />
            <span className="font-extrabold text-xl uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Users2 className="w-6 h-6 text-rose-600" />
              <span>HRM &amp; Workforce Portal</span>
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Role-Specific Access Control</h1>
          <p className="text-xs text-slate-500 mt-1 font-light">
            Select your enterprise workforce role and type your credentials to sign in.
          </p>
        </div>

        {/* Main Form Container */}
        <div className="rounded-3xl border border-slate-200 p-8 shadow-xl bg-white space-y-6">
          
          {/* Step 1: Role Selector Tabs */}
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">
              1. Select Workspace Role
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {rolesConfig.map((r) => {
                const isSelected = role === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => { setRole(r.id as any); setError(''); }}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50/50 shadow-md ring-2 ring-rose-500/20'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className={`p-2 rounded-xl w-fit mb-2 ${isSelected ? 'bg-rose-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
                      {r.icon}
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${isSelected ? 'text-rose-700' : 'text-slate-900'}`}>{r.title}</p>
                      <p className="text-[10px] text-slate-500 font-light mt-0.5 leading-snug">{r.subtitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 font-semibold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Step 2: Credentials Input Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="border-t border-slate-100 pt-4">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-3">
                2. Enter Credentials for {rolesConfig.find(r => r.id === role)?.title}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Employee ID / Code
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
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Work Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Mail className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-600 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Lock className="w-3.5 h-3.5" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-600 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <span>Authenticating Role Access...</span>
              ) : (
                <>
                  <span>Sign In as {rolesConfig.find(r => r.id === role)?.title}</span>
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
