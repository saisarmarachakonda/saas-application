'use client';

import React, { useState } from 'react';
import facilityData from '@/data/facilities_live_data.json';
import { downloadPdfDocument } from '@/lib/pdfGenerator';
import { BarChartWidget, DonutChartWidget } from '@/components/dashboard/ModuleDashboardCharts';
import {
  Building2,
  Boxes,
  Factory,
  CheckCircle2,
  Clock,
  Download,
  Search,
  Filter,
  ShieldCheck,
  RefreshCw,
  DollarSign,
  TrendingUp,
  Wrench,
  ChevronLeft,
  ChevronRight,
  Activity,
  Layers,
  Calendar,
  ArrowLeftRight,
  AlertTriangle,
  ClipboardCheck,
  FileCheck,
  Shield
} from 'lucide-react';

export default function FacilitiesPage() {
  const [activeTab, setActiveTab] = useState<string>('assets');
  const [searchTerm, setSearchTerm] = useState('');
  const [siteFilter, setSiteFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const getActiveTabConfig = () => {
    switch (activeTab) {
      case 'assets':
        return {
          title: 'Asset Master Register',
          data: facilityData.facilityAssets || [],
          columns: ['id', 'qrTag', 'assetName', 'oemManufacturer', 'modelNumber', 'powerSpecs', 'category', 'siteAllocation', 'zoneLocation', 'healthIndex', 'currentValuation', 'amcContractStatus', 'assignedTechnician', 'status'],
          barTitle: 'Asset Valuation Allocation by Site (₹ Lakhs)',
          barData: [
            { label: 'GMR Airport', value: 385, color: '#f97316' },
            { label: 'MS GCC', value: 290, color: '#3b82f6' },
            { label: 'Amazon Hub', value: 245, color: '#10b981' },
            { label: 'Wipro Tech', value: 210, color: '#8b5cf6' },
            { label: 'Apollo Hosp', value: 180, color: '#ec4899' },
            { label: 'Tata Steel', value: 175, color: '#06b6d4' }
          ],
          barUnit: '₹ ',
          donutTitle: 'Asset Operational Health Index Distribution',
          donutSlices: [
            { label: '95%+ Optimal Health', value: 245, color: '#10b981' },
            { label: '75-90% Good Condition', value: 68, color: '#3b82f6' },
            { label: '<75% Service Needed', value: 41, color: '#f97316' }
          ],
          donutTotalLabel: 'Total Assets'
        };
      case 'machinery':
        return {
          title: 'Heavy Machinery & Equipment Tracker',
          data: facilityData.facilityMachinery || [],
          columns: ['machineryId', 'equipmentName', 'oemModel', 'site', 'zoneLocation', 'engineCapacity', 'operatingHours', 'fuelPowerType', 'operatorAssigned', 'machineryStatus'],
          barTitle: 'Total Operating Hours by Heavy Machinery Class',
          barData: [
            { label: 'Floor Scrubber', value: 3420, color: '#2563eb' },
            { label: 'Jet Washer', value: 2850, color: '#06b6d4' },
            { label: 'Vacuum Unit', value: 2110, color: '#10b981' },
            { label: 'Ladder Access', value: 1940, color: '#f59e0b' },
            { label: 'Diesel Gen 500kVA', value: 1650, color: '#ec4899' }
          ],
          barUnit: 'Hrs ',
          donutTitle: 'Machinery Fuel & Power Source Type',
          donutSlices: [
            { label: 'Lithium Battery Pack', value: 165, color: '#10b981' },
            { label: '3-Phase Electric', value: 120, color: '#3b82f6' },
            { label: 'Diesel Engine', value: 69, color: '#f97316' }
          ],
          donutTotalLabel: 'Total Machines'
        };
      case 'maintenanceSchedule':
        return {
          title: 'Preventive Maintenance & Servicing Schedule',
          data: facilityData.maintenanceSchedule || [],
          columns: ['scheduleId', 'assetRef', 'assetName', 'site', 'zoneLocation', 'scheduledDate', 'technician', 'serviceType', 'slaCompliance'],
          barTitle: 'Scheduled Preventive Maintenance Volume by Site',
          barData: [
            { label: 'GMR Airport', value: 85, color: '#f97316' },
            { label: 'MS GCC', value: 64, color: '#3b82f6' },
            { label: 'Amazon Hub', value: 52, color: '#10b981' },
            { label: 'Wipro Tech', value: 46, color: '#8b5cf6' },
            { label: 'Apollo Hosp', value: 41, color: '#ec4899' },
            { label: 'Tata Steel', value: 66, color: '#06b6d4' }
          ],
          barUnit: '',
          donutTitle: 'Servicing Maintenance Type Breakdown',
          donutSlices: [
            { label: 'Monthly Filter Change', value: 145, color: '#3b82f6' },
            { label: 'Quarterly Overhaul', value: 110, color: '#10b981' },
            { label: 'Electrical Insulation Test', value: 62, color: '#8b5cf6' },
            { label: 'Hydraulic Oil Flush', value: 37, color: '#f97316' }
          ],
          donutTotalLabel: 'Schedules'
        };
      case 'siteTransfers':
        return {
          title: 'Site Asset Allocation & Transfers',
          data: facilityData.siteTransfers || [],
          columns: ['transferId', 'assetRef', 'assetName', 'fromLocation', 'toLocation', 'zoneLocation', 'dispatchedDate', 'dispatchedBy', 'transferStatus'],
          barTitle: 'Asset Movement Volume by Destination Site',
          barData: [
            { label: 'GMR Airport', value: 92, color: '#f97316' },
            { label: 'MS GCC', value: 74, color: '#3b82f6' },
            { label: 'Amazon Hub', value: 58, color: '#10b981' },
            { label: 'Wipro Tech', value: 44, color: '#8b5cf6' },
            { label: 'Apollo Hosp', value: 36, color: '#ec4899' },
            { label: 'Tata Steel', value: 50, color: '#06b6d4' }
          ],
          barUnit: '',
          donutTitle: 'Transfer Dispatch & Delivery Status Ratio',
          donutSlices: [
            { label: 'Delivered & Accepted', value: 295, color: '#10b981' },
            { label: 'In-Transit (GPS Monitored)', value: 59, color: '#f97316' }
          ],
          donutTotalLabel: 'Transfers'
        };
      case 'depreciationLedger':
        return {
          title: 'Asset Depreciation & Capital Valuation Ledger',
          data: facilityData.depreciationLedger || [],
          columns: ['ledgerId', 'assetRef', 'assetName', 'purchaseValue', 'annualDepreciation', 'accumulatedDepreciation', 'currentBookValue', 'depreciationMethod', 'financialYear'],
          barTitle: 'Accumulated Depreciation by Machinery Category (₹ Lakhs)',
          barData: [
            { label: 'Heavy Scrubbers', value: 185, color: '#ef4444' },
            { label: 'Jet Washers', value: 142, color: '#f97316' },
            { label: 'Vacuum Units', value: 98, color: '#eab308' },
            { label: 'AHU Systems', value: 84, color: '#3b82f6' },
            { label: 'Generators', value: 115, color: '#8b5cf6' }
          ],
          barUnit: '₹ ',
          donutTitle: 'Financial Year Depreciation Method Ratio',
          donutSlices: [
            { label: 'Straight-Line 15% Annual', value: 280, color: '#3b82f6' },
            { label: 'Declining Balance 20%', value: 74, color: '#10b981' }
          ],
          donutTotalLabel: 'Assets'
        };
      case 'spareParts':
        return {
          title: 'Spare Parts Stock',
          data: facilityData.spareParts || [],
          columns: ['partId', 'partName', 'compatibleAssetCategory', 'stockOnHand', 'minReorderPoint', 'unitCost', 'stockStatus'],
          barTitle: 'Spare Parts Unit Cost Comparison (₹ per Unit)',
          barData: [
            { label: 'Scrubber Brush', value: 4200, color: '#3b82f6' },
            { label: 'Squeegee Blade', value: 1800, color: '#10b981' },
            { label: 'Jet Nozzle', value: 2400, color: '#f59e0b' },
            { label: 'HEPA Filter', value: 6800, color: '#ef4444' },
            { label: 'Pump Kit', value: 5500, color: '#8b5cf6' }
          ],
          barUnit: '₹ ',
          donutTitle: 'Spare Parts Stock Availability Status',
          donutSlices: [
            { label: 'Adequate Stock Available', value: 304, color: '#10b981' },
            { label: 'Reorder Alert Triggered', value: 50, color: '#ef4444' }
          ],
          donutTotalLabel: 'Parts'
        };
      case 'breakdownTickets':
        return {
          title: 'Breakdown & Emergency Repair Tickets',
          data: facilityData.breakdownTickets || [],
          columns: ['ticketId', 'assetRef', 'assetName', 'site', 'zoneLocation', 'breakdownSeverity', 'reportedTime', 'resolutionTimeHours', 'repairCost', 'ticketStatus'],
          barTitle: 'Emergency Repair Downtime Hours by Site',
          barData: [
            { label: 'GMR Airport', value: 42, color: '#f97316' },
            { label: 'MS GCC', value: 38, color: '#3b82f6' },
            { label: 'Amazon Hub', value: 55, color: '#ef4444' },
            { label: 'Wipro Tech', value: 31, color: '#10b981' },
            { label: 'Apollo Hosp', value: 28, color: '#8b5cf6' },
            { label: 'Tata Steel', value: 62, color: '#ec4899' }
          ],
          barUnit: 'Hrs ',
          donutTitle: 'Breakdown Ticket Severity Breakdown',
          donutSlices: [
            { label: 'Minor Fault', value: 185, color: '#10b981' },
            { label: 'Major Breakdown', value: 115, color: '#f97316' },
            { label: 'Critical Shutdown', value: 54, color: '#ef4444' }
          ],
          donutTotalLabel: 'Tickets'
        };
      case 'warrantiesInsurance':
        return {
          title: 'Warranties & Insurance',
          data: facilityData.warrantiesInsurance || [],
          columns: ['policyId', 'assetRef', 'assetName', 'oemVendor', 'warrantyExpiryDate', 'insuranceCoverNumber', 'sumInsured', 'warrantyStatus'],
          barTitle: 'OEM Vendor Machinery Warranty Coverage Units',
          barData: [
            { label: 'Kärcher', value: 110, color: '#f97316' },
            { label: 'Nilfisk', value: 85, color: '#3b82f6' },
            { label: 'Taski', value: 65, color: '#10b981' },
            { label: 'Bosch', value: 54, color: '#8b5cf6' },
            { label: 'Cummins', value: 40, color: '#ec4899' }
          ],
          barUnit: '',
          donutTitle: 'OEM Warranty & Insurance Active Status',
          donutSlices: [
            { label: 'Active Warranty & OEM Cover', value: 310, color: '#10b981' },
            { label: 'Pending AMC Renewal', value: 44, color: '#f97316' }
          ],
          donutTotalLabel: 'Policies'
        };
      case 'safetyInspections':
        return {
          title: 'Safety Inspections & Compliance Checklists',
          data: facilityData.safetyInspections || [],
          columns: ['inspectionId', 'assetRef', 'assetName', 'site', 'zoneLocation', 'inspectionType', 'inspector', 'inspectedDate', 'inspectionResult'],
          barTitle: 'Green-Tag Safety Inspections Passed by Site',
          barData: [
            { label: 'GMR Airport', value: 82, color: '#10b981' },
            { label: 'MS GCC', value: 61, color: '#3b82f6' },
            { label: 'Amazon Hub', value: 50, color: '#06b6d4' },
            { label: 'Wipro Tech', value: 44, color: '#8b5cf6' },
            { label: 'Apollo Hosp', value: 40, color: '#ec4899' },
            { label: 'Tata Steel', value: 52, color: '#f59e0b' }
          ],
          barUnit: '',
          donutTitle: 'Inspection Safety Audit Outcome',
          donutSlices: [
            { label: 'Green Tag Certified (Passed)', value: 320, color: '#10b981' },
            { label: 'Conditional Recalibration', value: 34, color: '#f97316' }
          ],
          donutTotalLabel: 'Audits'
        };
      case 'workOrders':
      default:
        return {
          title: 'Maintenance Work Orders',
          data: facilityData.facilityWorkOrders || [],
          columns: ['ticketId', 'taskName', 'assetRef', 'site', 'zoneLocation', 'assignedTeam', 'priority', 'costEstimate', 'status'],
          barTitle: 'Work Order Estimated Cost Volume by Site (₹ Thousands)',
          barData: [
            { label: 'GMR Airport', value: 425, color: '#f97316' },
            { label: 'MS GCC', value: 310, color: '#3b82f6' },
            { label: 'Amazon Hub', value: 260, color: '#10b981' },
            { label: 'Wipro Tech', value: 210, color: '#8b5cf6' },
            { label: 'Apollo Hosp', value: 190, color: '#ec4899' },
            { label: 'Tata Steel', value: 380, color: '#06b6d4' }
          ],
          barUnit: '₹ ',
          donutTitle: 'Work Order Priority Level Ratio',
          donutSlices: [
            { label: 'Standard / Routine', value: 180, color: '#10b981' },
            { label: 'High Priority', value: 114, color: '#3b82f6' },
            { label: 'Critical Emergency', value: 60, color: '#ef4444' }
          ],
          donutTotalLabel: 'Work Orders'
        };
    }
  };

  const tabConfig = getActiveTabConfig();

  const handleSync = () => {
    setSyncStatus('Synchronizing Facility Asset Registry across GMR Airport, MS GCC, and 9 Client Sites...');
    setTimeout(() => {
      setSyncStatus('Facility Asset Audit Sync Completed. 354 Assets & Work Orders Tagged & Verified.');
      setTimeout(() => setSyncStatus(null), 5000);
    }, 1200);
  };

  const filteredRecords = tabConfig.data.filter((rec: any) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = Object.values(rec).some(val => String(val).toLowerCase().includes(search));
    const siteVal = rec.siteAllocation || rec.site || rec.toLocation || '';
    const matchesSite = siteFilter === 'ALL' || siteVal.includes(siteFilter);
    return matchesSearch && matchesSite;
  });

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExportPDF = (record?: any) => {
    const data = record || {
      code: `FM-${activeTab.toUpperCase()}-2026`,
      name: `Facility & Asset Management ${tabConfig.title} Audit`,
      designation: 'Facilities Asset Director',
      department: 'Facility & Asset Control',
      site: 'Multi-Site Network (GMR Airport, GCC Campus)',
      phone: '+91 9876543210',
      aadhaar: 'VERIFIED',
      pan: 'CORP-PAN',
      uan: '100099990000',
      esi: '3100000000',
      bank: 'HDFC-ACC-01',
      ifsc: 'HDFC0001234',
      joiningDate: '2026-08-08',
      status: 'Operational & Verified'
    };
    downloadPdfDocument(`Facility Asset ${activeTab.toUpperCase()}`, data);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0 border border-orange-500/20">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Facilities & Asset Management Module</span>
              <span className="text-[10px] uppercase font-extrabold text-orange-500 bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20">
                10 Asset Sub-Modules • 354 Records Each
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">
              Heavy machinery, preventive maintenance schedules, site asset transfers, depreciation ledgers, spare parts, and breakdown tickets.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSync}
            className="px-3.5 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Audit Asset Sync</span>
          </button>

          <button
            onClick={() => handleExportPDF()}
            className="px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export View PDF</span>
          </button>
        </div>
      </div>

      {/* Sync Banner */}
      {syncStatus && (
        <div className="p-3 bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-orange-500" />
          <span>{syncStatus}</span>
        </div>
      )}

      {/* 4 Core KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Facility Assets</span>
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">354 <span className="text-xs font-normal text-slate-400">Assets</span></h3>
            <span className="text-[11px] text-orange-500 font-semibold block mt-0.5">
              Tagging & Barcode Verified
            </span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Asset Book Valuation</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">₹ 14.85 Cr</h3>
            <span className="text-[11px] text-emerald-500 font-semibold block mt-0.5">
              Machinery & Equipment Capital
            </span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Preventive Maintenance</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">354 <span className="text-xs font-normal text-slate-400">Schedules</span></h3>
            <span className="text-[11px] text-blue-500 font-semibold block mt-0.5">
              98.2% SLA Compliance
            </span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Site Asset Deployment SLA</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">99.4%</h3>
            <span className="text-[11px] text-purple-500 font-semibold block mt-0.5">
              GMR & Multi-Site SLA Passed
            </span>
          </div>
        </div>
      </div>

      {/* DYNAMIC CHARTS GRID BASED ON SELECTED TAB */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <BarChartWidget
          title={tabConfig.barTitle}
          subtitle={`Dynamic analytics metrics for ${tabConfig.title}`}
          data={tabConfig.barData}
          unit={tabConfig.barUnit}
        />
        <DonutChartWidget
          title={tabConfig.donutTitle}
          subtitle={`Operational status breakdown for ${activeTab}`}
          slices={tabConfig.donutSlices}
          totalLabel={tabConfig.donutTotalLabel}
        />
      </div>

      {/* 10 Asset Management Sub-Module Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1 gap-1.5 scrollbar-none">
        {[
          { id: 'assets', label: 'Asset Master', count: '354' },
          { id: 'machinery', label: 'Heavy Machinery', count: '354' },
          { id: 'maintenanceSchedule', label: 'Preventive Maintenance', count: '354' },
          { id: 'siteTransfers', label: 'Site Asset Transfers', count: '354' },
          { id: 'depreciationLedger', label: 'Depreciation Ledger', count: '354' },
          { id: 'spareParts', label: 'Spare Parts Stock', count: '354' },
          { id: 'breakdownTickets', label: 'Breakdown Tickets', count: '354' },
          { id: 'warrantiesInsurance', label: 'Warranties & Insurance', count: '354' },
          { id: 'safetyInspections', label: 'Safety Inspections', count: '354' },
          { id: 'workOrders', label: 'Maintenance Work Orders', count: '354' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setCurrentPage(1); }}
            className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-t-lg transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-orange-600 text-white shadow-xs'
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

      {/* Data Table */}
      <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-orange-500" />
              <span>{tabConfig.title} ({filteredRecords.length} Records)</span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-light mt-0.5">
              Scrollable data table with search, site filters, valuations, and PDF exports.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                placeholder="Search asset, QR tag, OEM, zone..."
                className="pl-8 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs rounded-lg outline-none focus:border-orange-500 w-52"
              />
            </div>

            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-400 text-[10px] font-bold uppercase">Site:</span>
              <select
                value={siteFilter}
                onChange={e => { setSiteFilter(e.target.value); setCurrentPage(1); }}
                className="px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs outline-none font-semibold"
              >
                <option value="ALL">All Sites</option>
                <option value="GMR">GMR Airport</option>
                <option value="Microsoft">Microsoft GCC</option>
                <option value="Amazon">Amazon Hub</option>
                <option value="Wipro">Wipro Tech</option>
                <option value="Apollo">Apollo Hospital</option>
                <option value="Tata">Tata Steel</option>
              </select>
            </div>

            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-400 text-[10px] font-bold uppercase">Rows:</span>
              <select
                value={itemsPerPage}
                onChange={e => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
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

        {/* Scrollable Sticky Table */}
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto rounded-lg border border-slate-200/60 dark:border-slate-800/80">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 bg-slate-100 dark:bg-slate-900 z-10 border-b border-slate-200 dark:border-slate-800">
              <tr className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                {tabConfig.columns.map(col => (
                  <th key={col} className="py-3 px-3 capitalize">{col.replace(/([A-Z])/g, ' $1')}</th>
                ))}
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
              {paginatedRecords.map((row: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-850/50 transition-colors">
                  {tabConfig.columns.map(col => (
                    <td key={col} className="py-2.5 px-3 whitespace-nowrap">
                      {col === 'qrTag' ? (
                        <span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded font-bold border border-slate-200 dark:border-slate-700">
                          {row[col]}
                        </span>
                      ) : col === 'healthIndex' ? (
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          String(row[col]).includes('Optimal') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                        }`}>
                          {row[col]}
                        </span>
                      ) : col === 'status' || col === 'machineryStatus' || col === 'transferStatus' || col === 'stockStatus' || col === 'ticketStatus' || col === 'slaCompliance' ? (
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          String(row[col]).includes('Operational') || String(row[col]).includes('Active') || String(row[col]).includes('Delivered') || String(row[col]).includes('Resolved') || String(row[col]).includes('Available') || String(row[col]).includes('On Track') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'
                        }`}>
                          {String(row[col])}
                        </span>
                      ) : col.toLowerCase().includes('value') || col.toLowerCase().includes('cost') || col.toLowerCase().includes('depreciation') ? (
                        <span className="font-bold text-slate-900 dark:text-white font-mono">
                          ₹ {Number(row[col] || 0).toLocaleString('en-IN')}
                        </span>
                      ) : (
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          {String(row[col] ?? '')}
                        </span>
                      )}
                    </td>
                  ))}
                  <td className="py-2.5 px-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleExportPDF(row)}
                      className="px-2 py-1 bg-orange-600 hover:bg-orange-700 text-white text-[10px] font-bold rounded cursor-pointer"
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
          <span>Showing <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> to <strong>{Math.min(currentPage * itemsPerPage, filteredRecords.length)}</strong> of <strong>{filteredRecords.length}</strong> matching records</span>

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
