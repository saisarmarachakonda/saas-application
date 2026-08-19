'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, ShieldAlert, Eye, EyeOff, ArrowLeft } from 'lucide-react';

interface DecoupledAppLoginFormProps {
  app: string;
  title: string;
  themeColor: string; // 'indigo', 'emerald', 'blue', etc.
  logoIcon: React.ReactNode;
}

export default function DecoupledAppLoginForm({
  app,
  title,
  themeColor,
  logoIcon
}: DecoupledAppLoginFormProps) {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`/api/auth/${app.toLowerCase()}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Save user details to localStorage for client rendering in sidebar
      localStorage.setItem('sim_email', data.user.email);
      localStorage.setItem('sim_name', data.user.name);

      // Redirect to the app workspace
      window.location.href = `/${app.toLowerCase()}`;
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setLoading(false);
    }
  };

  const getThemeButtonClass = () => {
    switch (themeColor) {
      case 'indigo': return 'bg-indigo-600 hover:bg-transparent text-white hover:text-indigo-600 border border-indigo-600 shadow-lg';
      case 'emerald': return 'bg-emerald-600 hover:bg-transparent text-white hover:text-emerald-600 border border-emerald-600 shadow-lg';
      case 'blue': return 'bg-blue-600 hover:bg-transparent text-white hover:text-blue-600 border border-blue-600 shadow-lg';
      case 'orange': return 'bg-orange-600 hover:bg-transparent text-white hover:text-orange-600 border border-orange-600 shadow-lg';
      case 'cyan': return 'bg-cyan-600 hover:bg-transparent text-white hover:text-cyan-600 border border-cyan-600 shadow-lg';
      case 'purple': return 'bg-purple-600 hover:bg-transparent text-white hover:text-purple-600 border border-purple-600 shadow-lg';
      default: return 'bg-blue-600 hover:bg-transparent text-white hover:text-blue-600 border border-blue-600 shadow-lg';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfcfd] px-4 relative overflow-hidden font-sans">
      <div className="w-full max-w-md z-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3 mb-3">
            <img src="/logo.png" alt="VOC VERTEX" className="h-10 object-contain" />
            <span className="font-extrabold text-xl uppercase tracking-wider text-slate-800">
              {app.replace('-', ' ')} Portal
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <p className="text-xs text-slate-500 mt-1 font-light">
            Isolated authentication workspace.
          </p>
        </div>

        <div className="glass-card rounded-2xl border border-slate-200 p-8 shadow-xl bg-white backdrop-blur-xl">
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-500 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Workspace Email
              </label>
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
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Password
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
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 transition-colors"
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
              className={`w-full py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${getThemeButtonClass()}`}
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to {app.replace('-', ' ')}</span>
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
