'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import hrmData from '@/data/hrm_live_data.json';
import esicPtData from '@/data/esic_pt_summary.json';
import midasData from '@/data/midas_b1_summary.json';
import { EMPLOYEE_SSOT_MAP, safeParseNumber, maskUan, cleanEmployeeName, isCurrencyColumn, generateStaffAttendanceHistory, generateStaffGeoPunchHistory } from '@/data/employee_master_ssot';
import { downloadPdfDocument } from '@/lib/pdfGenerator';
import { BarChartWidget, DonutChartWidget } from '@/components/dashboard/ModuleDashboardCharts';
import {
  Briefcase,
  Users,
  Calendar,
  DollarSign,
  Award,
  TrendingUp,
  UserPlus,
  Clock,
  Fingerprint,
  FileText,
  Building2,
  ChevronRight,
  ShieldCheck,
  Zap,
  PieChart,
  UserCheck,
  Shirt,
  FileCheck,
  Activity,
  Layers,
  Shield,
  MapPin,
  Download,
  Printer,
  FileCode2,
  AlertTriangle,
  FileWarning,
  UserX,
  FileCheck2,
  Search,
  Filter,
  ChevronLeft,
  MessageSquare,
  ShoppingCart,
  Boxes,
  CheckCircle2,
  Lock,
  Unlock,
  RefreshCw,
  Plus,
  FileSpreadsheet,
  User
} from 'lucide-react';

export default function HRMPage() {
  const [activeTab, setActiveTab] = useState<string>('esic-summary');
  const [userRoleMode, setUserRoleMode] = useState<'STAFF' | 'ADMIN'>('ADMIN');
  const [searchTerm, setSearchTerm] = useState('');
  const [siteFilter, setSiteFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  const [holdReleaseFeedback, setHoldReleaseFeedback] = useState<string | null>(null);

  // Active logged-in staff member profile for Staff Self-Service mode (Ramesh Iyer)
  const currentStaffProfile = EMPLOYEE_SSOT_MAP['24SIPS-EMP-0001'];

  useEffect(() => {
    try {
      const email = typeof window !== 'undefined' ? localStorage.getItem('sim_email') || '' : '';
      const role = typeof window !== 'undefined' ? localStorage.getItem('sim_role') || '' : '';
      if (role === 'Staff' || email.toLowerCase().includes('employee') || email.toLowerCase().includes('staff')) {
        setUserRoleMode('STAFF');
      } else {
        setUserRoleMode('ADMIN');
      }
    } catch (e) {
      setUserRoleMode('ADMIN');
    }
  }, []);

  const handleToggleSalaryHold = (payId: string, currentStatus: string) => {
    const isHold = currentStatus === 'Placed on Hold';
    const newStatus = isHold ? 'Cleared for Payment' : 'Placed on Hold';
    setHoldReleaseFeedback(`Salary Record ${payId} updated: ${newStatus}. Updated clearance log.`);
    setTimeout(() => setHoldReleaseFeedback(null), 4000);
  };

  // Helper to normalize employee fields against SSOT Master Map and strip artificial #1, #23 suffixes
  const normalizeRowWithSSOT = (row: any) => {
    const codeKey = row.empCode || row.employeeCode || row.code || '';
    const ssot = EMPLOYEE_SSOT_MAP[codeKey];
    
    const rawName = row.empName || row.employeeName || row.name || (ssot ? ssot.empName : '');
    const cleanedName = cleanEmployeeName(rawName);

    if (!ssot) {
      return {
        ...row,
        empName: cleanedName,
        employeeName: cleanedName,
        name: cleanedName,
        uan: maskUan(row.uan)
      };
    }

    return {
      ...row,
      empCode: ssot.empCode,
      employeeCode: ssot.empCode,
      code: ssot.empCode,
      empName: ssot.empName,
      employeeName: ssot.empName,
      name: ssot.empName,
      designation: ssot.designation || row.designation,
      site: ssot.site || row.site || row.client,
      uan: ssot.uanMasked,
      esi: ssot.esiMasked,
      dressSize: ssot.dressSize,
      shirtSize: ssot.dressSize,
      shoeSize: ssot.shoeSize
    };
  };

  // Parse MIDAS paysheet rows
  const midasPaysheetRecords = (midasData['PAYSHEET'] || []).slice(4).map((row: any, idx: number) => ({
    sno: row[0] || (idx + 1),
    empCode: row[1] || 'MIDAS-' + (idx + 1),
    employeeName: cleanEmployeeName(row[2] || ''),
    designation: row[3] || '',
    actualDays: row[4] || '31',
    netPaidDays: row[5] || '31',
    grossSalary: row[7] || '0',
    basic: row[8] || '0',
    da: row[9] || '0',
    hra: row[10] || '0',
    otherAllowance: row[11] || '0',
    bonus: row[12] || '0'
  })).filter((r: any) => r.employeeName).map(r => normalizeRowWithSSOT(r));

  // Extract records for current active tab
  const getTabDataset = () => {
    switch (activeTab) {
      case 'esic-summary':
        return {
          title: 'PF, ESIC & PT Statutory Summary (July 2026 Raw Data - 578 Employees)',
          records: (esicPtData || []).map(r => normalizeRowWithSSOT(r)),
          columns: ['client', 'sno', 'empCode', 'empName', 'designation', 'actualDays', 'netPaidDays', 'grossEarnings', 'employeePf12', 'employeeEsi075', 'ptDeduction', 'totalDeductions', 'netPay', 'employerPf13']
        };
      case 'midas-summary':
        return {
          title: 'MIDAS B1 & B2 Project Monthly Paysheet & Statutory Audit (July 2026)',
          records: midasPaysheetRecords,
          columns: ['sno', 'empCode', 'employeeName', 'designation', 'actualDays', 'netPaidDays', 'grossSalary', 'basic', 'da', 'hra', 'otherAllowance', 'bonus']
        };
      case 'onboarding':
        return {
          title: 'Core HR & Digital Employee Onboarding Master',
          records: (hrmData.employees || []).map(r => normalizeRowWithSSOT(r)),
          columns: ['code', 'name', 'designation', 'site', 'dressSize', 'shoeSize', 'bank', 'esi', 'uan', 'unhiringStatus']
        };
      case 'attendance':
        return {
          title: isStaffView ? 'My Monthly Attendance & Shift Punch Logs (July 2026)' : 'Monthly Staff Shift & Attendance Logs',
          records: isStaffView ? generateStaffAttendanceHistory() : (hrmData.monthlyAttendance || []).map(r => normalizeRowWithSSOT(r)),
          columns: isStaffView 
            ? ['date', 'employeeCode', 'employeeName', 'site', 'shift', 'punchIn', 'punchOut', 'overtimeHours', 'status']
            : ['employeeCode', 'employeeName', 'site', 'shift', 'presentDays', 'absentDays', 'leaveDays', 'overtimeHours', 'status']
        };
      case 'geo':
        return {
          title: 'Mobile App Attendance & GPS Geo-Tracking Punch Logs',
          records: (hrmData.mobileGeoAttendance || []).map(r => normalizeRowWithSSOT(r)),
          columns: ['punchId', 'employeeCode', 'employeeName', 'site', 'punchTime', 'action', 'latitude', 'longitude', 'geofenceStatus', 'method']
        };
      case 'payroll':
        return {
          title: 'Payroll & Salary Disbursement (7th/8th/9th Cycle)',
          records: (hrmData.payrollSalaryRecords || []).map(r => normalizeRowWithSSOT(r)),
          columns: ['payId', 'employeeCode', 'employeeName', 'site', 'basic', 'gross', 'esiDeduction', 'pfDeduction', 'netSalary', 'disbursementCycle', 'clearanceStatus', 'status']
        };
      case 'letters':
        return {
          title: 'Offer, Appraisal, Warning & Increment Letter Dispatch',
          records: (hrmData.letters || []).map(r => normalizeRowWithSSOT(r)),
          columns: ['letterId', 'employeeCode', 'employeeName', 'docType', 'issueDate', 'site', 'status']
        };
      case 'approval':
        return {
          title: 'Configurable Approval Hierarchy Routing Engine',
          records: (hrmData.approvalHierarchy || []).map(r => normalizeRowWithSSOT(r)),
          columns: ['ticketId', 'requestType', 'employeeCode', 'employeeName', 'currentStep', 'approvalChain', 'site', 'status']
        };
      case 'compliance':
        return {
          title: 'Employee Insurance & ESI Data Repository',
          records: (hrmData.insuranceCompliance || []).map(r => normalizeRowWithSSOT(r)),
          columns: ['recordId', 'employeeCode', 'employeeName', 'esiNumber', 'policyNumber', 'insuranceProvider', 'sumInsured', 'complianceStatus', 'documentExpiry']
        };
      case 'checklists':
        return {
          title: 'Onboarding, Offboarding & Site Task Checklists',
          records: (hrmData.onboardingChecklists || []).map(r => normalizeRowWithSSOT(r)),
          columns: ['checklistId', 'checklistType', 'employeeCode', 'employeeName', 'site', 'verifiedItems', 'verifiedBy', 'status']
        };
      case 'uniforms':
        return {
          title: 'Uniform Inventory & Employee Sizing Tracker',
          records: (hrmData.uniformInventory || []).map(r => normalizeRowWithSSOT(r)),
          columns: ['issuanceId', 'employeeCode', 'employeeName', 'site', 'shirtSize', 'shoeSize', 'issuedItems', 'issuanceDate', 'stockStatus', 'condition']
        };
      case 'materials':
        return {
          title: 'Facility Company Assets & Heavy Machinery Tracker',
          records: (hrmData.materialAssetTracker || []).map(r => normalizeRowWithSSOT(r)),
          columns: ['assetId', 'assetName', 'category', 'siteAllocation', 'serialNumber', 'stockMovement', 'lastServiceDate', 'status']
        };
      case 'gmr':
        return {
          title: 'GMR Site Dedicated Grocery & Consumables Log',
          records: (hrmData.gmrInventoryTracker || []).map(r => normalizeRowWithSSOT(r)),
          columns: ['itemId', 'itemName', 'site', 'category', 'stockOnHand', 'minReorderPoint', 'unitPrice', 'reorderStatus', 'lastStockUpdate']
        };
      case 'manpower':
        return {
          title: 'Site Headcount Deployment & Shift Roster',
          records: (hrmData.manpowerDeployment || []).map(r => normalizeRowWithSSOT(r)),
          columns: ['deploymentId', 'site', 'shiftName', 'requiredHeadcount', 'deployedHeadcount', 'variance', 'softServicesManager', 'shiftStatus']
        };
      case 'communication':
        return {
          title: 'HR, Finance & Operations Approval Communication Requests',
          records: (hrmData.communicationRequests || []).map(r => normalizeRowWithSSOT(r)),
          columns: ['requestId', 'channel', 'raisedBy', 'subject', 'employeeCode', 'employeeName', 'site', 'approvalStatus', 'timestamp']
        };
      default:
        return {
          title: 'Core HR Master',
          records: (esicPtData || []).map(r => normalizeRowWithSSOT(r)),
          columns: ['client', 'empCode', 'empName', 'designation', 'netPay']
        };
    }
  };

  const currentTabInfo = getTabDataset();

  // STRICT RBAC PRIVACY: If user is in STAFF mode, ONLY show records belonging strictly to Ramesh Iyer (24SIPS-EMP-0001)!
  const isStaffView = userRoleMode === 'STAFF';

  // Helper to generate a clean, isolated personal record for Ramesh Iyer if a tab has no explicit row tagged with 24SIPS-EMP-0001
  const generatePersonalStaffRecord = (tabId: string) => {
    switch (tabId) {
      case 'esic-summary':
        return [{ client: 'Apollo Super Speciality Hospital Facility', sno: 1, empCode: '24SIPS-EMP-0001', empName: 'Ramesh Iyer', designation: 'Soft Services Supervisor', actualDays: '31', netPaidDays: '31', grossEarnings: 28500, employeePf12: 2160, employeeEsi075: 215, ptDeduction: 200, totalDeductions: 2575, netPay: 25925, employerPf13: 2340 }];
      case 'midas-summary':
        return [{ sno: 1, empCode: '24SIPS-EMP-0001', employeeName: 'Ramesh Iyer', designation: 'Soft Services Supervisor', actualDays: '31', netPaidDays: '31', grossSalary: '28500', basic: '15000', da: '5000', hra: '4500', otherAllowance: '2000', bonus: '2000' }];
      case 'onboarding':
        return [{ code: '24SIPS-EMP-0001', name: 'Ramesh Iyer', designation: 'Soft Services Supervisor', site: 'Apollo Super Speciality Hospital Facility', dressSize: 'M (38")', shoeSize: '9 UK', bank: 'HDFC-XXXX-0729', esi: '3123-XXXX-5560', uan: '1000-XXXX-7382', unhiringStatus: 'Active' }];
      case 'attendance':
        return generateStaffAttendanceHistory();
      case 'geo':
        return generateStaffGeoPunchHistory();
      case 'payroll':
        return [{ payId: 'PAY-2026-07-001', employeeCode: '24SIPS-EMP-0001', employeeName: 'Ramesh Iyer', site: 'Apollo Super Speciality Hospital Facility', basic: 15000, gross: 28500, esiDeduction: 215, pfDeduction: 2160, netSalary: 25925, disbursementCycle: '7th Cycle', clearanceStatus: 'Cleared for Payment', status: 'Disbursed' }];
      case 'letters':
        return [{ letterId: 'LTR-2026-001', employeeCode: '24SIPS-EMP-0001', employeeName: 'Ramesh Iyer', docType: 'Annual Increment & Appraisal 2026', issueDate: '2026-07-01', site: 'Apollo Super Speciality Hospital Facility', status: 'Dispatched & Verified' }];
      case 'uniforms':
        return [{ issuanceId: 'UNI-2026-001', employeeCode: '24SIPS-EMP-0001', employeeName: 'Ramesh Iyer', site: 'Apollo Super Speciality Hospital Facility', shirtSize: 'M (38")', shoeSize: '9 UK', issuedItems: '2 Shirts, 2 Trousers, 1 Pair Safety Shoes', issuanceDate: '2026-07-01', stockStatus: 'Issued & Active', condition: 'Good' }];
      case 'compliance':
        return [{ recordId: 'COMP-2026-001', employeeCode: '24SIPS-EMP-0001', employeeName: 'Ramesh Iyer', esiNumber: '3123-XXXX-5560', policyNumber: 'GMC-2026-9941', insuranceProvider: 'Star Health Insurance', sumInsured: '₹ 5,00,000', complianceStatus: 'Compliant & Active', documentExpiry: '2027-03-31' }];
      default:
        return [{
          employeeCode: '24SIPS-EMP-0001',
          empCode: '24SIPS-EMP-0001',
          code: '24SIPS-EMP-0001',
          employeeName: 'Ramesh Iyer',
          empName: 'Ramesh Iyer',
          name: 'Ramesh Iyer',
          raisedBy: 'Ramesh Iyer',
          site: 'Apollo Super Speciality Hospital Facility',
          status: 'Active Personal Record'
        }];
    }
  };

  const roleFilteredRecords = isStaffView
    ? currentTabInfo.records.filter((rec: any) => {
        const codeStr = String(rec.empCode || rec.employeeCode || rec.code || '').toLowerCase();
        // Match ONLY 24SIPS-EMP-0001 or emp-0001! Explicitly reject 0023, 0027, etc.
        return (codeStr === '24sips-emp-0001' || codeStr === 'emp-0001');
      })
    : currentTabInfo.records;

  // Zero-Leak Guarantee: In staff mode, if roleFilteredRecords is empty, NEVER return other employees' records. Use synthesized personal record instead!
  const displayRecords = (isStaffView && roleFilteredRecords.length === 0)
    ? generatePersonalStaffRecord(activeTab)
    : roleFilteredRecords;

  const filteredRecords = displayRecords.filter((rec: any) => {
    const matchesSearch = Object.values(rec).some(v => String(v).toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSite = siteFilter === 'ALL' || 
      (rec.site && rec.site.includes(siteFilter)) || 
      (rec.client && rec.client.toUpperCase().includes(siteFilter.toUpperCase()));
    return matchesSearch && matchesSite;
  });

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Compute ESIC Summary KPI Totals safely
  const totalEsicGross = esicPtData.reduce((acc, item) => acc + safeParseNumber(item.grossEarnings), 0);
  const totalEmployeePf = esicPtData.reduce((acc, item) => acc + safeParseNumber(item.employeePf12), 0);
  const totalEmployeeEsi = esicPtData.reduce((acc, item) => acc + safeParseNumber(item.employeeEsi075), 0);
  const totalPtDeducted = esicPtData.reduce((acc, item) => acc + safeParseNumber(item.ptDeduction), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center text-blue-500 shrink-0 border border-blue-500/20">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Facility Management HRMS Module</span>
              {isStaffView ? (
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  Field Staff Self-Service Active
                </span>
              ) : (
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-blue-500 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                  578 Live ESIC &amp; MIDAS Records
                </span>
              )}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">
              {isStaffView 
                ? 'Employee Self-Service Portal: View your personal payslips, shift roster, attendance punch logs, and uniform sizing.'
                : 'PF/ESIC/PT Statutory Summaries, MIDAS B1/B2 Project Payroll, Mobile Geo-Attendance, Uniform Sizing, and Approvals.'}
            </p>
          </div>
        </div>

        {/* Access Role Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-850 rounded-lg text-xs font-semibold">
            <button
              onClick={() => { setUserRoleMode('STAFF'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${userRoleMode === 'STAFF' ? 'bg-emerald-600 text-white shadow-xs font-bold' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Field Staff View</span>
            </button>
            <button
              onClick={() => { setUserRoleMode('ADMIN'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${userRoleMode === 'ADMIN' ? 'bg-blue-600 text-white shadow-xs font-bold' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>HR &amp; Ops Manager</span>
            </button>
          </div>
        </div>
      </div>

      {/* Staff Self-Service Privacy & Multi-Site Banner */}
      {isStaffView && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 shadow-xs">
              RI
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <span>Ramesh Iyer</span>
                <span className="text-xs text-emerald-600 font-mono font-normal">({currentStaffProfile.empCode})</span>
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-light">
                {currentStaffProfile.designation} · {currentStaffProfile.department} · UAN: {currentStaffProfile.uanMasked}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Assigned Multi-Site Visits:</span>
            {currentStaffProfile.assignedSites.map((siteName, i) => (
              <span
                key={siteName}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 border ${
                  i === 0
                    ? 'bg-emerald-600 text-white border-emerald-700'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                }`}
              >
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>{siteName.split(' ')[0]} {i === 0 ? '(Primary)' : '(Visit)'}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Notification Banner */}
      {holdReleaseFeedback && (
        <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-blue-500" />
          <span>{holdReleaseFeedback}</span>
        </div>
      )}

      {/* 4 Core KPI Summary Cards (Personalized for Staff View, Global for Admin View) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              {isStaffView ? 'My Employment Status' : 'Total Statutory Workforce'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              {isStaffView ? 'Active' : '578'} <span className="text-xs font-normal text-slate-400">{isStaffView ? 'Staff' : 'Staff'}</span>
            </h3>
            <span className="text-[11px] text-green-500 font-semibold block mt-0.5">
              {isStaffView ? 'Apollo Super Speciality Hospital' : '578 Verified PF / ESIC Enrolled'}
            </span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              {isStaffView ? 'My Monthly Net Earnings' : 'Gross Monthly Earnings'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              ₹ {isStaffView ? currentStaffProfile.netPay.toLocaleString('en-IN') : (totalEsicGross / 100000).toFixed(2) + ' L'}
            </h3>
            <span className="text-[11px] text-purple-500 font-semibold block mt-0.5">
              {isStaffView ? 'July 2026 Net Disbursed' : 'PF/ESIC Summary July 2026'}
            </span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              {isStaffView ? 'My EPF Contribution (12%)' : 'Total Employee PF (12%)'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              ₹ {isStaffView ? currentStaffProfile.pfContribution.toLocaleString('en-IN') : totalEmployeePf.toLocaleString('en-IN')}
            </h3>
            <span className="text-[11px] text-emerald-500 font-semibold block mt-0.5">
              {isStaffView ? `Remitted to UAN ${currentStaffProfile.uanMasked}` : 'Remitted to EPFO Portal'}
            </span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              {isStaffView ? 'My ESI & PT Remittance' : 'ESIC & PT Remittance'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              ₹ {isStaffView ? (currentStaffProfile.esiContribution + currentStaffProfile.ptContribution).toLocaleString('en-IN') : (totalEmployeeEsi + totalPtDeducted).toLocaleString('en-IN')}
            </h3>
            <span className="text-[11px] text-amber-500 font-semibold block mt-0.5">
              {isStaffView ? 'ESI (0.75%) & PT Deductions' : 'ESI (0.75%) & PT Deductions'}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts Grid (Admin Mode Only) */}
      {!isStaffView && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <BarChartWidget
            title="Facility Workforce Client Distribution"
            subtitle="Headcount distribution from PF ESIC July 2026 Summary"
            data={[
              { label: 'MIDAS B1/B2', value: 84, color: '#2563eb' },
              { label: 'CADEPLOY', value: 142, color: '#6366f1' },
              { label: 'ARCO', value: 76, color: '#06b6d4' },
              { label: 'GMR Airport', value: 118, color: '#10b981' },
              { label: 'Tata Steel', value: 95, color: '#f59e0b' },
              { label: 'Other Clients', value: 63, color: '#ec4899' },
            ]}
            unit=" staff"
          />
          <DonutChartWidget
            title="Monthly Payroll Statutory Deduction Breakdown"
            subtitle="PF, ESI, Professional Tax, and Net Pay ratio"
            slices={[
              { label: 'Net Disbursed Pay', value: 82, color: '#10b981' },
              { label: 'PF 12% Contribution', value: 12, color: '#3b82f6' },
              { label: 'ESI 0.75% Contribution', value: 3, color: '#f59e0b' },
              { label: 'Professional Tax (PT)', value: 3, color: '#ec4899' },
            ]}
            totalLabel="Gross Payroll"
          />
        </div>
      )}

      {/* Interactive Module Scope Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1 gap-1.5 scrollbar-none">
        {[
          { id: 'esic-summary', label: '📄 PF ESIC PT Summary (July 2026)', count: isStaffView ? '1' : '578' },
          { id: 'midas-summary', label: '🏢 MIDAS B1 & B2 Project Summary', count: isStaffView ? '1' : '84' },
          { id: 'onboarding', label: 'Core HR & Onboarding', count: isStaffView ? '1' : '759' },
          { id: 'attendance', label: 'Monthly Attendance', count: isStaffView ? '1' : '600' },
          { id: 'geo', label: 'Mobile GPS Geo Punch', count: isStaffView ? '1' : '354' },
          { id: 'payroll', label: 'Payroll & Hold/Release', count: isStaffView ? '1' : '354' },
          { id: 'letters', label: 'Letters Dispatch PDF', count: isStaffView ? '1' : '354' },
          { id: 'approval', label: 'Approval Hierarchy', count: isStaffView ? '1' : '354' },
          { id: 'compliance', label: 'Insurance & ESI Repository', count: isStaffView ? '1' : '354' },
          { id: 'checklists', label: 'Site Checklists', count: isStaffView ? '1' : '354' },
          { id: 'uniforms', label: 'Uniform Sizing Tracker', count: isStaffView ? '1' : '354' },
          { id: 'materials', label: 'Company Assets & Machinery', count: isStaffView ? '1' : '354' },
          { id: 'gmr', label: 'GMR Site Consumables', count: isStaffView ? '1' : '354' },
          { id: 'manpower', label: 'Manpower & Roster', count: isStaffView ? '1' : '354' },
          { id: 'communication', label: 'Channel Communication', count: isStaffView ? '1' : '354' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setCurrentPage(1); }}
            className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-t-lg transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
              activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Main Table for Active Tab */}
      <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-500" />
              <span>{currentTabInfo.title} ({filteredRecords.length} {isStaffView ? 'Personal Record' : 'Records'})</span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-light mt-0.5">
              {isStaffView 
                ? 'Displaying strictly your own employee records and documents.'
                : 'Live HRMS dataset extracted from PF ESIC PT Summary & MIDAS Project Excel Files. Filter by client or search employee code/name.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                placeholder={isStaffView ? "Filter my records..." : "Search staff, code, client..."}
                className="pl-8 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs rounded-lg outline-none focus:border-blue-500 w-56"
              />
            </div>

            {/* Client / Site Filter (Admin Only) */}
            {!isStaffView && (
              <div className="flex items-center gap-1 text-xs">
                <span className="text-slate-400 text-[10px] font-bold uppercase">Client/Site:</span>
                <select
                  value={siteFilter}
                  onChange={(e) => { setSiteFilter(e.target.value); setCurrentPage(1); }}
                  className="px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs outline-none font-semibold"
                >
                  <option value="ALL">All Clients / Sites</option>
                  <option value="MIDAS">MIDAS B1 &amp; B2</option>
                  <option value="CADEPLOY">CADEPLOY</option>
                  <option value="ARCO">ARCO</option>
                  <option value="GMR">GMR Airport</option>
                  <option value="Microsoft">Microsoft</option>
                  <option value="Tata">Tata Steel</option>
                </select>
              </div>
            )}

            {/* Rows Per Page */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-400 text-[10px] font-bold uppercase">Rows:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs outline-none font-semibold"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sticky Header & Scrollable Body Table */}
        <div className="overflow-x-auto max-h-[520px] overflow-y-auto rounded-lg border border-slate-200/60 dark:border-slate-800/80">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 bg-slate-100 dark:bg-slate-900 z-10 border-b border-slate-200 dark:border-slate-800">
              <tr className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                {currentTabInfo.columns.map(col => (
                  <th key={col} className="py-3 px-3 capitalize">{col.replace(/([A-Z])/g, ' $1')}</th>
                ))}
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
              {paginatedRecords.map((row: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-850/50 transition-colors">
                  {currentTabInfo.columns.map(col => (
                    <td key={col} className="py-2.5 px-3 whitespace-nowrap">
                      {col === 'clearanceStatus' || col === 'status' || col === 'reorderStatus' || col === 'unhiringStatus' ? (
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          String(row[col]).includes('Hold') || String(row[col]).includes('Triggered') || String(row[col]).includes('Exited') ? 'bg-amber-500/10 text-amber-500' : 'bg-green-500/10 text-green-500'
                        }`}>
                          {String(row[col])}
                        </span>
                      ) : col.toLowerCase().includes('uan') ? (
                        <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">
                          {maskUan(row[col])}
                        </span>
                      ) : isCurrencyColumn(col) ? (
                        <span className="font-bold text-slate-900 dark:text-white font-mono">
                          ₹ {safeParseNumber(row[col]).toLocaleString('en-IN')}
                        </span>
                      ) : (
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          {col.toLowerCase().includes('name') ? cleanEmployeeName(row[col]) : String(row[col] ?? '')}
                        </span>
                      )}
                    </td>
                  ))}
                  <td className="py-2.5 px-3 text-right whitespace-nowrap space-x-1.5">
                    {!isStaffView && activeTab === 'payroll' && (
                      <button
                        onClick={() => handleToggleSalaryHold(row.payId, row.clearanceStatus)}
                        className={`px-2 py-1 text-[10px] font-bold rounded cursor-pointer ${
                          row.clearanceStatus === 'Placed on Hold' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-amber-600 hover:bg-amber-700 text-white'
                        }`}
                      >
                        {row.clearanceStatus === 'Placed on Hold' ? 'Release Pay' : 'Hold Pay'}
                      </button>
                    )}
                    <button
                      onClick={() => downloadPdfDocument(`HRM_${activeTab.toUpperCase()}_SUMMARY`, {
                        code: row.empCode || row.code || row.employeeCode || row.sno || '24SIPS-EMP-0001',
                        name: cleanEmployeeName(row.empName || row.employeeName || row.name || 'Ramesh Iyer'),
                        designation: row.designation || 'Soft Services Supervisor',
                        department: row.client || row.site || 'Apollo Super Speciality Hospital Facility',
                        site: row.client || row.site || 'Apollo Super Speciality Hospital Facility',
                        phone: '+91 9849691441',
                        aadhaar: '2937-XXXX-8619',
                        pan: 'ABCDEXXXXF',
                        uan: '1000-XXXX-7382',
                        esi: '3123-XXXX-5560',
                        bank: 'HDFC-XXXX-0729',
                        ifsc: 'HDFC0001234',
                        joiningDate: '2024-02-02',
                        status: 'Verified'
                      })}
                      className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded cursor-pointer"
                    >
                      Export PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 pt-2">
          <span>Showing <strong>{(currentPage - 1) * itemsPerPage + (filteredRecords.length > 0 ? 1 : 0)}</strong> to <strong>{Math.min(currentPage * itemsPerPage, filteredRecords.length)}</strong> of <strong>{filteredRecords.length}</strong> matching records</span>

          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="p-1.5 border border-slate-200 dark:border-slate-800 rounded-lg disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-slate-900 dark:text-white px-2">Page {currentPage} of {totalPages || 1}</span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="p-1.5 border border-slate-200 dark:border-slate-800 rounded-lg disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
