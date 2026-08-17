'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import hrmData from '@/data/hrm_live_data.json';
import esicPtData from '@/data/esic_pt_summary.json';
import midasData from '@/data/midas_b1_summary.json';
import { EMPLOYEE_SSOT_MAP, safeParseNumber, maskUan, cleanEmployeeName, isCurrencyColumn, generateStaffAttendanceHistory, generateStaffGeoPunchHistory } from '@/data/employee_master_ssot';
import { downloadPdfDocument } from '@/lib/pdfGenerator';
import {
  Briefcase,
  Users,
  Calendar,
  DollarSign,
  Award,
  UserPlus,
  Clock,
  Fingerprint,
  FileText,
  Building2,
  ShieldCheck,
  Zap,
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
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  User
} from 'lucide-react';

export default function HRMViewPage() {
  const { view } = useParams() as { view: string };
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [isStaffRole, setIsStaffRole] = useState(false);

  useEffect(() => {
    try {
      const email = typeof window !== 'undefined' ? localStorage.getItem('sim_email') || '' : '';
      const role = typeof window !== 'undefined' ? localStorage.getItem('sim_role') || '' : '';
      if (role === 'Employee' || role === 'Staff' || email.toLowerCase().includes('employee') || email.toLowerCase().includes('staff')) {
        setIsStaffRole(true);
      } else {
        setIsStaffRole(false);
      }
    } catch (e) {
      setIsStaffRole(false);
    }
  }, []);

  // Helper to normalize row with SSOT Master Map and clean employee name
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

  const getViewConfig = () => {
    switch (view) {
      case 'esic-summary':
        return {
          title: 'PF, ESIC & PT Statutory Summary Audit',
          subtitle: 'Raw statutory remittance log for EPF, ESIC, and PT deductions.',
          data: (esicPtData || []).map(r => normalizeRowWithSSOT(r)),
          columns: ['client', 'sno', 'empCode', 'empName', 'designation', 'actualDays', 'netPaidDays', 'grossEarnings', 'employeePf12', 'employeeEsi075', 'ptDeduction', 'totalDeductions', 'netPay', 'employerPf13'],
          badge: isStaffRole ? 'My Personal Record' : '578 Statutory Audit Records'
        };
      case 'midas-summary':
        return {
          title: 'MIDAS B1 & B2 Project Monthly Paysheet Audit',
          subtitle: 'Detailed paysheet breakdowns and salary components.',
          data: midasPaysheetRecords,
          columns: ['sno', 'empCode', 'employeeName', 'designation', 'actualDays', 'netPaidDays', 'grossSalary', 'basic', 'da', 'hra', 'otherAllowance', 'bonus'],
          badge: isStaffRole ? 'My Personal Record' : '84 Project Records'
        };
      case 'onboarding':
      case 'employees':
        return {
          title: 'Core HR & Employee Bio-Data Master',
          subtitle: 'Digital capture of ESI/PF details, Bank statements, Uniform (Dress/Shoe) sizing, and hiring status.',
          data: ((hrmData as any).employees || []).map((r: any) => normalizeRowWithSSOT(r)),
          columns: ['code', 'name', 'designation', 'site', 'dressSize', 'shoeSize', 'bank', 'esi', 'uan', 'unhiringStatus'],
          badge: isStaffRole ? 'My Personal Bio-Data' : '759 Employee Records'
        };
      case 'attendance':
        return {
          title: isStaffRole ? 'My Monthly Attendance & Shift Punch Logs (July 2026)' : 'Monthly Staff Attendance Logs',
          subtitle: 'Attendance, leave, and shift logging module for all site and back-office staff.',
          data: isStaffRole ? generateStaffAttendanceHistory() : ((hrmData as any).monthlyAttendance || []).map((r: any) => normalizeRowWithSSOT(r)),
          columns: isStaffRole
            ? ['date', 'employeeCode', 'employeeName', 'site', 'shift', 'punchIn', 'punchOut', 'overtimeHours', 'status']
            : ['employeeCode', 'employeeName', 'site', 'shift', 'presentDays', 'absentDays', 'leaveDays', 'overtimeHours', 'status'],
          badge: isStaffRole ? '31 Daily Shift Logs' : '600 Attendance Logs'
        };
      case 'geo-tracking':
        return {
          title: isStaffRole ? 'My Mobile GPS Geo Punch Logs (July 2026)' : 'Mobile Attendance & Location Tracking',
          subtitle: 'Field-staff attendance via mobile app with built-in geo-tracking.',
          data: isStaffRole ? generateStaffGeoPunchHistory() : ((hrmData as any).mobileGeoAttendance || []).map((r: any) => normalizeRowWithSSOT(r)),
          columns: ['punchId', 'employeeCode', 'employeeName', 'site', 'punchTime', 'action', 'latitude', 'longitude', 'geofenceStatus', 'method'],
          badge: isStaffRole ? '52 GPS Punch Logs' : '354 Geo Punch Logs'
        };
      case 'payroll':
        return {
          title: 'Payroll & Salary Management (7th/8th/9th Cycle)',
          subtitle: 'Salary processing with clearance status and statutory deductions.',
          data: ((hrmData as any).payrollSalaryRecords || []).map((r: any) => normalizeRowWithSSOT(r)),
          columns: ['payId', 'employeeCode', 'employeeName', 'site', 'basic', 'gross', 'esiDeduction', 'pfDeduction', 'netSalary', 'disbursementCycle', 'clearanceStatus', 'status'],
          badge: isStaffRole ? 'My Payslips' : '354 Salary Records'
        };
      case 'letters':
        return {
          title: 'Increment, Appraisal & Offer Letters Dispatch',
          subtitle: 'Automated generation and digital dispatch of offer letters, appraisal letters, and increment letters.',
          data: ((hrmData as any).letters || []).map((r: any) => normalizeRowWithSSOT(r)),
          columns: ['letterId', 'employeeCode', 'employeeName', 'docType', 'issueDate', 'site', 'status'],
          badge: isStaffRole ? 'My Official Letters' : '354 Letter Dispatches'
        };
      case 'approval-hierarchy':
        return {
          title: 'Approval Hierarchy Routing Engine',
          subtitle: 'Configurable approval routing for onboarding & salary requests.',
          data: ((hrmData as any).approvalHierarchy || []).map((r: any) => normalizeRowWithSSOT(r)),
          columns: ['ticketId', 'requestType', 'employeeCode', 'employeeName', 'currentStep', 'approvalChain', 'site', 'status'],
          badge: isStaffRole ? 'My Approval Requests' : '354 Approval Tickets'
        };
      case 'compliance':
        return {
          title: 'Insurance & ESI Data Tracking Repository',
          subtitle: 'Dedicated repository for employee insurance policies, ESI numbers, UAN numbers, and compliance documentation.',
          data: ((hrmData as any).insuranceCompliance || []).map((r: any) => normalizeRowWithSSOT(r)),
          columns: ['recordId', 'employeeCode', 'employeeName', 'esiNumber', 'policyNumber', 'insuranceProvider', 'sumInsured', 'complianceStatus', 'documentExpiry'],
          badge: isStaffRole ? 'My Policy Details' : '354 Compliance Records'
        };
      case 'checklists':
        return {
          title: 'Site-Level Onboarding & Task Checklists',
          subtitle: 'Configurable checklists for onboarding, offboarding, and recurring task verification at the site level.',
          data: ((hrmData as any).onboardingChecklists || []).map((r: any) => normalizeRowWithSSOT(r)),
          columns: ['checklistId', 'checklistType', 'employeeCode', 'employeeName', 'site', 'verifiedItems', 'verifiedBy', 'status'],
          badge: isStaffRole ? 'My Verification Checklists' : '354 Checklist Verification Logs'
        };
      case 'uniforms':
        return {
          title: 'Uniform Inventory & Employee Sizing Tracker',
          subtitle: 'Procurement, stock levels, and issuance of uniforms (dress & shoe sizing) per employee.',
          data: ((hrmData as any).uniformInventory || []).map((r: any) => normalizeRowWithSSOT(r)),
          columns: ['issuanceId', 'employeeCode', 'employeeName', 'site', 'shirtSize', 'shoeSize', 'issuedItems', 'issuanceDate', 'stockStatus', 'condition'],
          badge: isStaffRole ? 'My Uniform Allocation' : '354 Uniform Issuance Records'
        };
      case 'materials':
        return {
          title: 'Facility Company Assets & Material Tracker',
          subtitle: 'Company assets, heavy scrubbing machinery, stock movement, and allocation tracking across sites.',
          data: ((hrmData as any).materialAssetTracker || []).map((r: any) => normalizeRowWithSSOT(r)),
          columns: ['assetId', 'assetName', 'category', 'siteAllocation', 'serialNumber', 'stockMovement', 'lastServiceDate', 'status'],
          badge: isStaffRole ? 'My Assigned Equipment' : '354 Facility Asset Records'
        };
      case 'gmr-inventory':
        return {
          title: 'GMR Site Grocery & Consumables Tracker',
          subtitle: 'Dedicated grocery, cleaning chemical, and consumable tracking module scoped specifically to the GMR site.',
          data: ((hrmData as any).gmrInventoryTracker || []).map((r: any) => normalizeRowWithSSOT(r)),
          columns: ['itemId', 'itemName', 'site', 'category', 'stockOnHand', 'minReorderPoint', 'unitPrice', 'reorderStatus', 'lastStockUpdate'],
          badge: isStaffRole ? 'Site Consumables Log' : '354 GMR Grocery Stock Items'
        };
      case 'manpower':
        return {
          title: 'Manpower Management & Shift Deployment',
          subtitle: 'Headcount, deployment, shift planning, and roster variance by site.',
          data: ((hrmData as any).manpowerDeployment || []).map((r: any) => normalizeRowWithSSOT(r)),
          columns: ['deploymentId', 'site', 'shiftName', 'requiredHeadcount', 'deployedHeadcount', 'variance', 'softServicesManager', 'shiftStatus'],
          badge: isStaffRole ? 'My Site Shift Deployment' : '354 Site Deployment Logs'
        };
      case 'communication':
        return {
          title: 'HR, Finance & Operations Approval Communication',
          subtitle: 'Communication across all channels with a structured approval process.',
          data: ((hrmData as any).communicationRequests || []).map((r: any) => normalizeRowWithSSOT(r)),
          columns: ['requestId', 'channel', 'raisedBy', 'subject', 'employeeCode', 'employeeName', 'site', 'approvalStatus', 'timestamp'],
          badge: isStaffRole ? 'My Sent Messages' : '354 Communication Request Tickets'
        };
      default:
        return {
          title: `HRM ${view.toUpperCase()} Register`,
          subtitle: 'Facility Management HRMS Scope Module.',
          data: ((hrmData as any).employees || []).map((r: any) => normalizeRowWithSSOT(r)),
          columns: ['code', 'name', 'designation', 'site', 'status'],
          badge: isStaffRole ? 'Personal Record' : '354 Records'
        };
    }
  };

  const config = getViewConfig();

  // Generate isolated personal record for Ramesh Iyer (24SIPS-EMP-0001) if no matching row is found
  const generatePersonalStaffRecord = (viewName: string) => {
    switch (viewName) {
      case 'esic-summary':
        return [{ client: 'Apollo Super Speciality Hospital Facility', sno: 1, empCode: '24SIPS-EMP-0001', empName: 'Ramesh Iyer', designation: 'Soft Services Supervisor', actualDays: '31', netPaidDays: '31', grossEarnings: 28500, employeePf12: 2160, employeeEsi075: 215, ptDeduction: 200, totalDeductions: 2575, netPay: 25925, employerPf13: 2340 }];
      case 'midas-summary':
        return [{ sno: 1, empCode: '24SIPS-EMP-0001', employeeName: 'Ramesh Iyer', designation: 'Soft Services Supervisor', actualDays: '31', netPaidDays: '31', grossSalary: '28500', basic: '15000', da: '5000', hra: '4500', otherAllowance: '2000', bonus: '2000' }];
      case 'onboarding':
      case 'employees':
        return [{ code: '24SIPS-EMP-0001', name: 'Ramesh Iyer', designation: 'Soft Services Supervisor', site: 'Apollo Super Speciality Hospital Facility', dressSize: 'M (38")', shoeSize: '9 UK', bank: 'HDFC-XXXX-0729', esi: '3123-XXXX-5560', uan: '1000-XXXX-7382', unhiringStatus: 'Active' }];
      case 'attendance':
        return [{ employeeCode: '24SIPS-EMP-0001', employeeName: 'Ramesh Iyer', site: 'Apollo Super Speciality Hospital Facility', shift: 'Morning Shift A', presentDays: 26, absentDays: 0, leaveDays: 1, overtimeHours: 12, status: 'Verified' }];
      case 'geo-tracking':
        return [{ punchId: 'PUNCH-2026-001', employeeCode: '24SIPS-EMP-0001', employeeName: 'Ramesh Iyer', site: 'Apollo Super Speciality Hospital Facility', punchTime: '2026-07-31 08:30 AM', action: 'IN', latitude: '17.4483', longitude: '78.3741', geofenceStatus: 'Inside Geofence', method: 'Mobile Facial GPS' }];
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

  // STRICT RBAC PRIVACY: If user is an Employee, ONLY filter records matching Ramesh Iyer (24SIPS-EMP-0001)!
  const roleFilteredData = isStaffRole
    ? config.data.filter((item: any) => {
        const codeStr = String(item.empCode || item.employeeCode || item.code || '').toLowerCase();
        return (codeStr === '24sips-emp-0001' || codeStr === 'emp-0001');
      })
    : config.data;

  // Zero-Leak Guarantee: In staff mode, if roleFilteredData is empty, NEVER expose other employees' rows. Use synthesized personal record instead!
  const finalDataset = (isStaffRole && roleFilteredData.length === 0)
    ? generatePersonalStaffRecord(view)
    : roleFilteredData;

  const filteredData = finalDataset.filter((item: any) => {
    const search = searchTerm.toLowerCase();
    return Object.values(item).some(val => 
      String(val).toLowerCase().includes(search)
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 border border-blue-500/20">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{config.title}</span>
              <span className={`text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full border ${isStaffRole ? 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20' : 'text-blue-500 bg-blue-500/10 border-blue-500/20'}`}>
                {config.badge}
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">
              {config.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Staff Self-Service Privacy & Multi-Site Banner */}
      {isStaffRole && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 shadow-xs">
              RI
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <span>Ramesh Iyer</span>
                <span className="text-xs text-emerald-600 font-mono font-normal">(24SIPS-EMP-0001)</span>
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-light">
                Soft Services Supervisor · Technical Operations & Maintenance · UAN: 1000-XXXX-7382
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Assigned Multi-Site Visits:</span>
            {['Apollo Hospital (Primary)', 'GMR Airport (Visit)', 'DLF Cyber City (Visit)', 'Microsoft GCC (Visit)'].map((siteLabel, i) => (
              <span
                key={siteLabel}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 border ${
                  i === 0
                    ? 'bg-emerald-600 text-white border-emerald-700'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                }`}
              >
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>{siteLabel}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Main Data Table */}
      <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-500" />
              <span>{config.title} ({filteredData.length} {isStaffRole ? 'Personal Record' : 'Records'})</span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-light mt-0.5">
              {isStaffRole ? 'Displaying strictly your own employee records and documents.' : 'Facility Management HRMS dataset.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                placeholder={isStaffRole ? "Filter my records..." : "Search staff, code, site..."}
                className="pl-8 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs rounded-lg outline-none focus:border-blue-500 w-56"
              />
            </div>

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

        {/* Table */}
        <div className="overflow-x-auto max-h-[520px] overflow-y-auto rounded-lg border border-slate-200/60 dark:border-slate-800/80">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 bg-slate-100 dark:bg-slate-900 z-10 border-b border-slate-200 dark:border-slate-800">
              <tr className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                {config.columns.map(col => (
                  <th key={col} className="py-3 px-3 capitalize">{col.replace(/([A-Z])/g, ' $1')}</th>
                ))}
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
              {paginatedData.map((row: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-850/50 transition-colors">
                  {config.columns.map(col => (
                    <td key={col} className="py-2.5 px-3 whitespace-nowrap">
                      {col === 'clearanceStatus' || col === 'status' || col === 'unhiringStatus' || col === 'complianceStatus' ? (
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          String(row[col]).includes('Hold') || String(row[col]).includes('Exited') ? 'bg-amber-500/10 text-amber-500' : 'bg-green-500/10 text-green-500'
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
                  <td className="py-2.5 px-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => downloadPdfDocument(`HRM_${view.toUpperCase()}_SUMMARY`, {
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
          <span>Showing <strong>{(currentPage - 1) * itemsPerPage + (filteredData.length > 0 ? 1 : 0)}</strong> to <strong>{Math.min(currentPage * itemsPerPage, filteredData.length)}</strong> of <strong>{filteredData.length}</strong> matching records</span>

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
