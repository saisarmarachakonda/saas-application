'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Sparkles, ArrowRight, ShieldAlert, Check, Eye, EyeOff } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Forgot password modal state
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Successful login
      router.push(callbackUrl);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setError('');
    
    // Simulate sending recovery email
    setTimeout(() => {
      setForgotLoading(false);
      setForgotSuccess(true);
      setForgotEmail('');
      setTimeout(() => {
        setForgotSuccess(false);
        setForgotModalOpen(false);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#090d16] px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center glow-indigo">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 bg-clip-text text-transparent">
              NextGen ERP
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome Back</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 font-light">
            Enter your credentials to access your organization dashboard.
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
              <label className="block text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-100/50 dark:bg-slate-955/50 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-indigo-500 transition-colors text-slate-900 dark:text-white"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">Password</label>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-xs text-indigo-500 hover:text-indigo-600 transition-colors bg-transparent border-none cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-100/50 dark:bg-slate-955/50 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-indigo-500 transition-colors text-slate-900 dark:text-white"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer font-bold uppercase tracking-wider"
            >
              {loading ? 'Signing In...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-900 px-2 text-slate-400">Or continue with</span>
            </div>
          </div>

          {/* OAuth Mock buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => alert('OAuth Integration (Google) triggered. Ready for production wiring!')}
              className="py-2.5 px-4 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              Google
            </button>
            <button
              type="button"
              onClick={() => alert('OAuth Integration (GitHub) triggered. Ready for production wiring!')}
              className="py-2.5 px-4 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              GitHub
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-indigo-500 hover:text-indigo-600 font-semibold transition-colors">
            Sign Up
          </Link>
        </p>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="glass-card w-full max-w-sm rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Password Recovery</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 font-light">
              Enter your registered email address below. We will send a recovery token to reset your password.
            </p>

            {forgotSuccess ? (
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-center flex flex-col items-center">
                <Check className="w-8 h-8 text-green-500 bg-green-500/20 p-1.5 rounded-full mb-2" />
                <span className="text-xs font-semibold text-green-600 dark:text-green-400">Recovery Link Sent!</span>
                <span className="text-[10px] text-slate-400 mt-1">Please check your inbox.</span>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-100/50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
                  placeholder="admin@example.com"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-355 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {forgotLoading ? 'Processing...' : 'Send Link'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#090d16]">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
