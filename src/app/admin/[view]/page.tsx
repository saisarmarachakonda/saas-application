'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import InplaceCrud, { ModelConfig } from '@/components/crud/InplaceCrud';
import { Building2, Factory, Warehouse, Layers, Users2, CreditCard, Activity, ShieldAlert, CheckCircle2, RefreshCw, Key } from 'lucide-react';

interface ActiveSession {
  id: string;
  userEmail: string;
  ip: string;
  location: string;
  lastActive: string;
  status: 'Active' | 'Revoked';
}

export default function AdminViewPage() {
  const { view } = useParams() as { view: string };

  const [sessions, setSessions] = useState<ActiveSession[]>([
    { id: 'sess-1', userEmail: 'admin@example.com', ip: '192.168.1.102', location: 'Bangalore HQ (Internal Subnet)', lastActive: 'Just now', status: 'Active' },
    { id: 'sess-2', userEmail: 'cfo@vocinfra.com', ip: '103.24.18.91', location: 'Mumbai Financial Hub', lastActive: '12 mins ago', status: 'Active' },
    { id: 'sess-3', userEmail: 'site.mgr@vocinfra.com', ip: '49.207.214.12', location: 'Chennai Field Depot', lastActive: '45 mins ago', status: 'Active' },
  ]);

  const [adminFeedback, setAdminFeedback] = useState('');

  const revokeSession = (sessId: string) => {
    const updated = sessions.map(s => s.id === sessId ? { ...s, status: 'Revoked' as const } : s);
    setSessions(updated);
    setAdminFeedback(`JWT token revoked for session ${sessId}. Client cookie invalidated.`);
    setTimeout(() => setAdminFeedback(''), 3500);
  };

  const viewMapping: { [key: string]: { tab: string; icon: React.ReactNode; label: string } } = {
    'companies': { tab: 'company', label: 'Companies Setup', icon: <Building2 className="w-5 h-5" /> },
    'plants': { tab: 'plant', label: 'Plants Configuration', icon: <Factory className="w-5 h-5" /> },
    'warehouses': { tab: 'warehouse', label: 'Warehouses & Depots', icon: <Warehouse className="w-5 h-5" /> },
    'departments': { tab: 'department', label: 'Departments Matrix', icon: <Layers className="w-5 h-5" /> },
    'users': { tab: 'user', label: 'System Users', icon: <Users2 className="w-5 h-5" /> },
    'subscriptions': { tab: 'subscription', label: 'Corporate Subscriptions', icon: <CreditCard className="w-5 h-5" /> },
    'security-logs': { tab: 'activitylog', label: 'Security Audit Logs', icon: <Activity className="w-5 h-5" /> },
  };

  const currentView = viewMapping[view];
  if (!currentView) {
    return <div className="p-8 text-center text-slate-500">Admin View '{view}' not found.</div>;
  }

  const configs: ModelConfig[] = [
    {
      name: 'company',
      label: 'Companies',
      fields: [
        { name: 'name', label: 'Company Name', type: 'text', required: true },
        { name: 'code', label: 'Company Code', type: 'text', required: true },
        { name: 'address', label: 'Registered Address', type: 'textarea' },
      ],
      columns: ['name', 'code', 'address'],
    },
    {
      name: 'plant',
      label: 'Plants',
      fields: [
        { name: 'name', label: 'Plant Name', type: 'text', required: true },
        { name: 'code', label: 'Plant Code', type: 'text', required: true },
        { name: 'companyId', label: 'Affiliated Company', type: 'select', refModel: 'company', required: true },
      ],
      columns: ['name', 'code', 'companyId'],
    },
    {
      name: 'warehouse',
      label: 'Depots & Warehouses',
      fields: [
        { name: 'name', label: 'Warehouse Name', type: 'text', required: true },
        { name: 'code', label: 'Warehouse Code', type: 'text', required: true },
        { name: 'plantId', label: 'Parent Plant Location', type: 'select', refModel: 'plant', required: true },
      ],
      columns: ['name', 'code', 'plantId'],
    },
    {
      name: 'department',
      label: 'Departments',
      fields: [
        { name: 'name', label: 'Department Name', type: 'text', required: true },
        { name: 'code', label: 'Department Code', type: 'text', required: true },
      ],
      columns: ['name', 'code'],
    },
    {
      name: 'user',
      label: 'Users',
      fields: [
        { name: 'name', label: 'User Display Name', type: 'text', required: true },
        { name: 'email', label: 'Corporate Email', type: 'email', required: true },
        { name: 'password', label: 'Sign-in Password', type: 'password', required: true },
        {
          name: 'roleName',
          label: 'System Access Role',
          type: 'select',
          required: true,
          options: [
            { label: 'Admin', value: 'Admin' },
            { label: 'User', value: 'User' },
          ],
        },
        { name: 'companyId', label: 'Assigned Company', type: 'select', refModel: 'company' },
        { name: 'departmentId', label: 'Primary Department', type: 'select', refModel: 'department' },
      ],
      columns: ['name', 'email', 'roleName', 'departmentId'],
    },
    {
      name: 'subscription',
      label: 'Subscriptions',
      fields: [
        { name: 'userId', label: 'Subscribing User', type: 'select', refModel: 'user', refLabelField: 'name', required: true },
        { name: 'planName', label: 'Plan Name', type: 'select', required: true, options: [{label: 'Free', value: 'Free'}, {label: 'Pro', value: 'Pro'}, {label: 'Enterprise', value: 'Enterprise'}] },
        { name: 'status', label: 'Subscription Status', type: 'select', required: true, options: [{label: 'Active', value: 'Active'}, {label: 'Cancelled', value: 'Cancelled'}] },
        { name: 'price', label: 'Billing Amount ($)', type: 'number', required: true },
        { name: 'endDate', label: 'Contract Expiration Date', type: 'date', required: true }
      ],
      columns: ['userId', 'planName', 'status', 'price', 'endDate'],
    },
    {
      name: 'activitylog',
      label: 'Security Audit Logs',
      fields: [],
      columns: ['userEmail', 'action', 'details', 'ipAddress'],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="text-blue-500">{currentView.icon}</div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">{currentView.label}</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">
            Admin console configuration and multi-tenant security monitoring.
          </p>
        </div>
      </div>

      {view === 'security-logs' && (
        <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-transparent space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-blue-500" />
              <span>Active JWT Sessions & Security Inspector Pro</span>
            </h3>
            <span className="text-[10px] uppercase font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded">
              Realtime Telemetry
            </span>
          </div>

          {adminFeedback && (
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{adminFeedback}</span>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase">
                  <th className="py-2.5">User Identity</th>
                  <th className="py-2.5">IP Address</th>
                  <th className="py-2.5">Geolocation Node</th>
                  <th className="py-2.5">Last Active</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5 text-right">Revocation Control</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map(s => (
                  <tr key={s.id} className="border-b border-slate-100 dark:border-slate-850">
                    <td className="py-3 font-bold text-slate-900 dark:text-white">{s.userEmail}</td>
                    <td className="py-3 text-blue-500 font-semibold">{s.ip}</td>
                    <td className="py-3 text-slate-500">{s.location}</td>
                    <td className="py-3 font-light">{s.lastActive}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        s.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      {s.status === 'Active' ? (
                        <button
                          onClick={() => revokeSession(s.id)}
                          className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold rounded transition-colors cursor-pointer"
                        >
                          Revoke Token
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-semibold">Invalidated</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <InplaceCrud configs={configs} defaultTab={currentView.tab} hideTabs={true} />
    </div>
  );
}
