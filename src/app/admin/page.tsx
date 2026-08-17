'use client';

import React from 'react';
import InplaceCrud, { ModelConfig } from '@/components/crud/InplaceCrud';
import { Building2 } from 'lucide-react';

export default function AdminPage() {
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
      name: 'approvalmatrix',
      label: 'Approval Matrix',
      fields: [
        {
          name: 'module',
          label: 'Target Operations Module',
          type: 'select',
          required: true,
          options: [
            { label: 'Procurement Spend', value: 'Procurement' },
            { label: 'CRM Sales Value', value: 'CRM' },
            { label: 'Warehouse Thresholds', value: 'Inventory' },
          ],
        },
        { name: 'amountLimit', label: 'Authorization Amount Limit', type: 'number', required: true },
        {
          name: 'approvedByRole',
          label: 'Required Approver Role',
          type: 'select',
          required: true,
          options: [
            { label: 'Admin Access', value: 'Admin' },
            { label: 'Department Head', value: 'DepartmentHead' },
          ],
        },
        { name: 'isActive', label: 'Status Active', type: 'boolean' },
      ],
      columns: ['module', 'amountLimit', 'approvedByRole', 'isActive'],
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
        <Building2 className="w-6 h-6 text-blue-500" />
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Platform Administration</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">
            Configure multi-tenant structures, active user permissions, and workflow approval thresholds.
          </p>
        </div>
      </div>

      {/* System Diagnostics Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Server CPU Load</span>
            <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">Healthy</span>
          </div>
          <div className="mt-4">
            <h4 className="text-xl font-black text-slate-900 dark:text-white">24.5 %</h4>
            <div className="w-full bg-slate-100 dark:bg-slate-850 h-1.5 rounded-full overflow-hidden mt-2">
              <div className="h-full bg-blue-550 rounded-full animate-pulse" style={{ width: '24.5%' }} />
            </div>
          </div>
        </div>

        <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Memory Allocated</span>
            <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">Optimal</span>
          </div>
          <div className="mt-4">
            <h4 className="text-xl font-black text-slate-900 dark:text-white">4.2 GB <span className="text-xs font-normal text-slate-400">/ 8 GB</span></h4>
            <div className="w-full bg-slate-100 dark:bg-slate-850 h-1.5 rounded-full overflow-hidden mt-2">
              <div className="h-full bg-indigo-500 rounded-full" style={{ width: '52.5%' }} />
            </div>
          </div>
        </div>

        <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">API Gateway latency</span>
            <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">Excellent</span>
          </div>
          <div className="mt-4">
            <h4 className="text-xl font-black text-slate-900 dark:text-white">14.8 ms</h4>
            <div className="w-full bg-slate-100 dark:bg-slate-850 h-1.5 rounded-full overflow-hidden mt-2">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '15%' }} />
            </div>
          </div>
        </div>

        <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">DB Session pool</span>
            <span className="text-[10px] text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded">Shared</span>
          </div>
          <div className="mt-4">
            <h4 className="text-xl font-black text-slate-900 dark:text-white">3 / 20 <span className="text-xs font-normal text-slate-400">Nodes</span></h4>
            <div className="w-full bg-slate-100 dark:bg-slate-850 h-1.5 rounded-full overflow-hidden mt-2">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: '15%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
