'use client';

import React, { useState, useEffect } from 'react';
import { Settings, CreditCard, Check, Shield, Bell, Activity, Sparkles } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any | null>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [feedback, setFeedback] = useState('');

  const loadData = async () => {
    try {
      // Load settings
      const settingsRes = await fetch('/api/crud/systemsettings');
      if (settingsRes.ok) {
        const settingsList = await settingsRes.json();
        setSettings(settingsList);
      }

      // Load subscriptions
      const subRes = await fetch('/api/crud/subscription');
      if (subRes.ok) {
        const subList = await subRes.json();
        setSubscription(subList.length > 0 ? subList[0] : null);
      }

      // Load payments
      const payRes = await fetch('/api/crud/payment');
      if (payRes.ok) {
        const payList = await payRes.json();
        setPayments(payList);
      }
    } catch (e) {
      console.error('Error loading settings data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleSetting = async (id: string, currentVal: string) => {
    setUpdating(true);
    const newVal = currentVal === 'true' ? 'false' : 'true';
    try {
      const res = await fetch(`/api/crud/systemsettings?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: newVal }),
      });
      if (res.ok) {
        setSettings(settings.map(s => s.id === id ? { ...s, value: newVal } : s));
        setFeedback('Configuration updated successfully!');
        setTimeout(() => setFeedback(''), 3000);
      }
    } catch (err) {
      console.error('Error updating setting:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleMockUpgrade = async (plan: string, price: number) => {
    if (!subscription) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/crud/subscription?id=${subscription.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planName: plan,
          price,
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 3600 * 1000)
        }),
      });

      if (res.ok) {
        // Log a payment
        await fetch('/api/crud/payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subscriptionId: subscription.id,
            amount: price,
            currency: 'USD',
            status: 'Succeeded',
            transactionId: 'TXN_' + Math.random().toString(36).substring(2, 11).toUpperCase()
          })
        });

        setFeedback(`Successfully upgraded to ${plan} plan!`);
        loadData();
        setTimeout(() => setFeedback(''), 3000);
      }
    } catch (e) {
      console.error('Upgrade error:', e);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Activity className="w-8 h-8 animate-spin text-indigo-500 mb-2" />
        <p className="text-xs">Loading application preferences...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-none">
      <div className="flex items-center gap-2">
        <Settings className="w-6 h-6 text-indigo-500" />
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Settings & Billing</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">
            Manage operational feature flags, SaaS subscriptions plans, and view billing invoices.
          </p>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-green-500/10 border border-green-500/20 text-xs text-green-500 rounded-lg flex items-center gap-2">
          <Check className="w-4 h-4 text-green-500 bg-green-500/20 rounded-full p-0.5" />
          <span>{feedback}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Cols: Preferences and Billing */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Feature Flags / System Configuration */}
          <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-indigo-500" />
              <span>Feature Flags & Workflow settings</span>
            </h3>

            <div className="space-y-4">
              {settings.map(sett => (
                <div key={sett.id} className="flex items-center justify-between text-xs pb-3 border-b border-slate-200/50 dark:border-slate-800/50 last:border-b-0 last:pb-0">
                  <div>
                    <p className="font-semibold text-slate-855 dark:text-slate-200">{sett.key.replace(/_/g, ' ').toUpperCase()}</p>
                    <p className="text-slate-450 dark:text-slate-400 font-light text-[10px] capitalize mt-0.5">{sett.category} Preference Flag</p>
                  </div>
                  
                  {/* Switch toggle if value is boolean format */}
                  {(sett.value === 'true' || sett.value === 'false') ? (
                    <button
                      onClick={() => handleToggleSetting(sett.id, sett.value)}
                      disabled={updating}
                      className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                        sett.value === 'true' ? 'bg-indigo-600' : 'bg-slate-350 dark:bg-slate-800'
                      }`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        sett.value === 'true' ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </button>
                  ) : (
                    <span className="font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded">
                      {sett.value}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Billing / Invoice List */}
          <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-indigo-500" />
              <span>Invoice Payments History</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-450 dark:text-slate-400 font-semibold uppercase">
                    <th className="py-2.5">Transaction ID</th>
                    <th className="py-2.5">Date</th>
                    <th className="py-2.5">Amount</th>
                    <th className="py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-6 text-slate-400 font-light">No billing records found.</td>
                    </tr>
                  ) : (
                    payments.map((p, idx) => (
                      <tr key={p.id || idx} className="border-b border-slate-200/50 dark:border-slate-800/40 text-slate-600 dark:text-slate-300 font-light last:border-b-0">
                        <td className="py-3 font-semibold uppercase">{p.transactionId}</td>
                        <td className="py-3">{new Date(p.createdAt).toLocaleDateString()}</td>
                        <td className="py-3">${parseFloat(p.amount).toFixed(2)}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 bg-green-500/10 text-green-500 rounded text-[9px] font-bold uppercase">
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right 1 Col: Subscription Plan detail */}
        <div className="space-y-6">
          <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden bg-gradient-to-b from-indigo-500/5 to-cyan-500/5">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Current Subscription</h3>
            
            {subscription ? (
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-500 bg-indigo-500/10 px-2 py-1 rounded">
                    {subscription.planName} Plan
                  </span>
                  <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
                    ${parseFloat(subscription.price).toFixed(2)}
                    <span className="text-xs text-slate-450 font-normal"> / mo</span>
                  </div>
                </div>

                <div className="text-xs space-y-2 border-t border-slate-200 dark:border-slate-850 pt-3 text-slate-600 dark:text-slate-400 font-light">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="font-semibold text-green-500 capitalize">{subscription.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expiry:</span>
                    <span>{new Date(subscription.endDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Upgrade Button actions */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-850 space-y-2">
                  <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Change subscription</p>
                  {subscription.planName !== 'Enterprise' && (
                    <button
                      onClick={() => handleMockUpgrade('Enterprise', 499.0)}
                      disabled={updating}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 glow-indigo"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Upgrade to Enterprise ($499)</span>
                    </button>
                  )}
                  {subscription.planName === 'Free' && (
                    <button
                      onClick={() => handleMockUpgrade('Professional', 99.0)}
                      disabled={updating}
                      className="w-full py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold rounded-lg transition-colors"
                    >
                      Upgrade to Professional ($99)
                    </button>
                  )}
                  {subscription.planName !== 'Free' && (
                    <button
                      onClick={() => handleMockUpgrade('Free', 0.0)}
                      disabled={updating}
                      className="w-full py-2 border border-slate-200 dark:border-slate-850 text-slate-400 text-xs hover:text-red-500 rounded-lg transition-colors"
                    >
                      Downgrade to Free
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">No active subscription record found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
