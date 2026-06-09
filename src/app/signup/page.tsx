'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Building, Sparkles, ArrowRight, ShieldAlert } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, companyName }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      // Success
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#090d16] px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md z-10 my-8">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center glow-indigo">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 bg-clip-text text-transparent">
              NextGen ERP
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create Tenant Account</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 font-light">
            Set up your organization dashboard and start your free trial.
          </p>
        </div>

        <div className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl">
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-500 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-100/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-100/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="john@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-100/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                Company / Tenant Name <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-100/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="Apex Industries (Creates new sandbox)"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Get Started'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-500 hover:text-indigo-600 font-semibold transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
