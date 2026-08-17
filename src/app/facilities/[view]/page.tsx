'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import facilityData from '@/data/facilities_live_data.json';
import { Building2, Download, Search, ChevronLeft, ChevronRight, Filter, ShieldCheck, Wrench, Boxes, Factory, Activity } from 'lucide-react';
import { downloadPdfDocument } from '@/lib/pdfGenerator';
import {
  BarChartWidget,
  DonutChartWidget,
  LineAreaChartWidget,
  HorizontalBarChartWidget,
  RadialGaugeWidget
} from '@/components/dashboard/ModuleDashboardCharts';

export default function FacilitiesViewPage() {
  const { view } = useParams() as { view: string };
  const [searchTerm, setSearchTerm] = useState('');
  const [siteFilter, setSiteFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  const getViewConfig = () => {
    switch (view) {
      case 'assets':
        return {
          title: 'Asset Master Register & Barcode Catalog',
          subtitle: 'Complete inventory registry of machinery, QR tags, OEM model numbers, zone locations, power specs, and operational health.',
          data: facilityData.facilityAssets || [],
          columns: ['id', 'qrTag', 'assetName', 'oemManufacturer', 'modelNumber', 'powerSpecs', 'category', 'siteAllocation', 'zoneLocation', 'healthIndex', 'currentValuation', 'amcContractStatus', 'assignedTechnician', 'status'],
          chartType: 'horizontal-radial',
          hItems: [
            { label: 'GMR Airport Site', value: 385, displayValue: '₹ 3.85 Cr', color: '#f97316' },
            { label: 'Microsoft GCC Campus', value: 290, displayValue: '₹ 2.90 Cr', color: '#3b82f6' },
            { label: 'Amazon Hub #4', value: 245, displayValue: '₹ 2.45 Cr', color: '#10b981' },
            { label: 'Wipro Tech Park', value: 210, displayValue: '₹ 2.10 Cr', color: '#8b5cf6' },
            { label: 'Apollo Hospital', value: 180, displayValue: '₹ 1.80 Cr', color: '#ec4899' },
            { label: 'Tata Steel Plant', value: 175, displayValue: '₹ 1.75 Cr', color: '#06b6d4' }
          ],
          hTitle: 'Asset Valuation Ranking by Site Location',
          hSubtitle: 'Total asset capital distribution across client nodes',
          gaugeScore: 94.8,
          gaugeTitle: 'Asset Health Index Score',
          gaugeLabel: 'Optimal Health',
          gaugeColor: '#10b981'
        };
      case 'machinery':
        return {
          title: 'Heavy Machinery & Equipment Tracker',
          subtitle: 'Track ride-on floor scrubbers, 200 bar jet washers, wet/dry vacuums, engine operating hours, and power specs.',
          data: facilityData.facilityMachinery || [],
          columns: ['machineryId', 'equipmentName', 'oemModel', 'site', 'zoneLocation', 'engineCapacity', 'operatingHours', 'fuelPowerType', 'operatorAssigned', 'machineryStatus'],
          chartType: 'line-donut',
          lineTitle: 'Machinery Operating Hours Monthly Trend (Hrs)',
          lineSubtitle: 'Fleet engine run-time hours over 6-month cycle',
          lineData: [
            { label: 'Jan', value: 1250 },
            { label: 'Feb', value: 1840 },
            { label: 'Mar', value: 2100 },
            { label: 'Apr', value: 2450 },
            { label: 'May', value: 2980 },
            { label: 'Jun', value: 3420 }
          ],
          lineColor: '#2563eb',
          lineUnit: 'Hrs ',
          donutTitle: 'Machinery Fuel & Power Source Type',
          donutSubtitle: 'Power technology distribution across equipment',
          donutSlices: [
            { label: 'Lithium Battery Pack', value: 165, color: '#10b981' },
            { label: '3-Phase Electric', value: 120, color: '#3b82f6' },
            { label: 'Diesel Engine', value: 69, color: '#f97316' }
          ],
          donutTotalLabel: 'Machines'
        };
      case 'maintenance-schedule':
        return {
          title: 'Preventive Maintenance & Servicing Schedule',
          subtitle: 'Quarterly overhauls, filter replacements, technician assignments, scheduled dates, and SLA compliance.',
          data: facilityData.maintenanceSchedule || [],
          columns: ['scheduleId', 'assetRef', 'assetName', 'site', 'zoneLocation', 'scheduledDate', 'technician', 'serviceType', 'slaCompliance'],
          chartType: 'bar-radial',
          barTitle: 'Scheduled Preventive Maintenance Volume by Site',
          barSubtitle: 'Active monthly servicing rosters',
          barData: [
            { label: 'GMR Airport', value: 85, color: '#f97316' },
            { label: 'MS GCC', value: 64, color: '#3b82f6' },
            { label: 'Amazon Hub', value: 52, color: '#10b981' },
            { label: 'Wipro Tech', value: 46, color: '#8b5cf6' },
            { label: 'Apollo Hosp', value: 41, color: '#ec4899' },
            { label: 'Tata Steel', value: 66, color: '#06b6d4' }
          ],
          barUnit: '',
          gaugeScore: 98.2,
          gaugeTitle: 'Preventive Maintenance SLA Compliance Rate',
          gaugeLabel: '98.2% SLA Compliant',
          gaugeColor: '#3b82f6'
        };
      case 'site-transfers':
        return {
          title: 'Site Asset Allocation & Movement Logs',
          subtitle: 'Inter-site machinery transfer logs from Central Warehouse to GMR Airport, GCC Campus, and client hubs.',
          data: facilityData.siteTransfers || [],
          columns: ['transferId', 'assetRef', 'assetName', 'fromLocation', 'toLocation', 'zoneLocation', 'dispatchedDate', 'dispatchedBy', 'transferStatus'],
          chartType: 'horizontal-donut',
          hTitle: 'Asset Dispatches by Destination Site',
          hSubtitle: 'Inter-site machinery deployment volume',
          hItems: [
            { label: 'GMR Airport Site', value: 92, displayValue: '92 Dispatches', color: '#f97316' },
            { label: 'Microsoft GCC Campus', value: 74, displayValue: '74 Dispatches', color: '#3b82f6' },
            { label: 'Amazon Hub #4', value: 58, displayValue: '58 Dispatches', color: '#10b981' },
            { label: 'Wipro Tech Park', value: 44, displayValue: '44 Dispatches', color: '#8b5cf6' },
            { label: 'Apollo Hospital', value: 36, displayValue: '36 Dispatches', color: '#ec4899' },
            { label: 'Tata Steel Plant', value: 50, displayValue: '50 Dispatches', color: '#06b6d4' }
          ],
          donutTitle: 'Transfer Dispatch & Delivery Status Ratio',
          donutSubtitle: 'Logistics tracking status',
          donutSlices: [
            { label: 'Delivered & Accepted', value: 295, color: '#10b981' },
            { label: 'In-Transit (GPS Monitored)', value: 59, color: '#f97316' }
          ],
          donutTotalLabel: 'Transfers'
        };
      case 'depreciation-ledger':
        return {
          title: 'Asset Depreciation & Capital Valuation Ledger',
          subtitle: 'Straight-line 15% annual depreciation calculation, book valuation, and FY 2026-27 capital balances.',
          data: facilityData.depreciationLedger || [],
          columns: ['ledgerId', 'assetRef', 'assetName', 'purchaseValue', 'annualDepreciation', 'accumulatedDepreciation', 'currentBookValue', 'depreciationMethod', 'financialYear'],
          chartType: 'line-horizontal',
          lineTitle: '5-Year Portfolio Capital Book Value Curve (₹ Cr)',
          lineSubtitle: 'Straight-line asset depreciation trajectory',
          lineData: [
            { label: '2022', value: 24.5 },
            { label: '2023', value: 21.2 },
            { label: '2024', value: 18.6 },
            { label: '2025', value: 16.4 },
            { label: '2026', value: 14.85 },
            { label: '2027 Proj', value: 12.9 }
          ],
          lineColor: '#ef4444',
          lineUnit: '₹ Cr ',
          hTitle: 'Accumulated Depreciation by Machinery Category',
          hSubtitle: 'Depreciation total ranking (₹ Lakhs)',
          hItems: [
            { label: 'Heavy Scrubbers', value: 185, displayValue: '₹ 1.85 Cr', color: '#ef4444' },
            { label: 'Jet Washers', value: 142, displayValue: '₹ 1.42 Cr', color: '#f97316' },
            { label: 'Diesel Generators', value: 115, displayValue: '₹ 1.15 Cr', color: '#8b5cf6' },
            { label: 'Vacuum Units', value: 98, displayValue: '₹ 98 Lakhs', color: '#eab308' },
            { label: 'AHU Systems', value: 84, displayValue: '₹ 84 Lakhs', color: '#3b82f6' }
          ]
        };
      case 'spareParts':
      case 'spare-parts':
        return {
          title: 'Spare Parts & Consumables Inventory Stock',
          subtitle: 'Scrubbing brushes, squeegee blades, jet nozzles, HEPA filters stock levels, unit costs, and reorder alerts.',
          data: facilityData.spareParts || [],
          columns: ['partId', 'partName', 'compatibleAssetCategory', 'stockOnHand', 'minReorderPoint', 'unitCost', 'stockStatus'],
          chartType: 'horizontal-radial',
          hTitle: 'Spare Parts Unit Cost Comparison (₹ per Unit)',
          hSubtitle: 'Replacement consumables catalog pricing',
          hItems: [
            { label: 'HEPA Filter Element', value: 6800, displayValue: '₹ 6,800', color: '#ef4444' },
            { label: 'Hydraulic Pump Seal Kit', value: 5500, displayValue: '₹ 5,500', color: '#8b5cf6' },
            { label: 'Scrubber Poly Brush', value: 4200, displayValue: '₹ 4,200', color: '#3b82f6' },
            { label: 'Jet Nozzle Tips 15-Deg', value: 2400, displayValue: '₹ 2,400', color: '#f59e0b' },
            { label: 'Squeegee Blades (Pair)', value: 1800, displayValue: '₹ 1,800', color: '#10b981' }
          ],
          gaugeScore: 92.4,
          gaugeTitle: 'Spare Parts Stock Availability Index',
          gaugeLabel: '92.4% In-Stock Rate',
          gaugeColor: '#10b981'
        };
      case 'breakdown-tickets':
        return {
          title: 'Breakdown & Emergency Repair Tickets',
          subtitle: 'Emergency breakdown tickets, downtime hours, repair cost estimates, and restoration logs.',
          data: facilityData.breakdownTickets || [],
          columns: ['ticketId', 'assetRef', 'assetName', 'site', 'zoneLocation', 'breakdownSeverity', 'reportedTime', 'resolutionTimeHours', 'repairCost', 'ticketStatus'],
          chartType: 'line-donut',
          lineTitle: 'Emergency Repair Downtime Monthly Trend (Hours)',
          lineSubtitle: 'Average machinery downtime hours per incident',
          lineData: [
            { label: 'Jan', value: 8.5 },
            { label: 'Feb', value: 7.2 },
            { label: 'Mar', value: 6.1 },
            { label: 'Apr', value: 5.4 },
            { label: 'May', value: 4.8 },
            { label: 'Jun', value: 4.1 }
          ],
          lineColor: '#ef4444',
          lineUnit: 'Hrs ',
          donutTitle: 'Breakdown Ticket Severity Breakdown',
          donutSubtitle: 'Severity classification ratio',
          donutSlices: [
            { label: 'Minor Fault', value: 185, color: '#10b981' },
            { label: 'Major Breakdown', value: 115, color: '#f97316' },
            { label: 'Critical Shutdown', value: 54, color: '#ef4444' }
          ],
          donutTotalLabel: 'Tickets'
        };
      case 'warranties-insurance':
        return {
          title: 'Warranties & OEM Insurance Coverage',
          subtitle: 'OEM warranty expiry tracking (Kärcher, Nilfisk, Taski, Bosch) and group insurance policy coverage.',
          data: facilityData.warrantiesInsurance || [],
          columns: ['policyId', 'assetRef', 'assetName', 'oemVendor', 'warrantyExpiryDate', 'insuranceCoverNumber', 'sumInsured', 'warrantyStatus'],
          chartType: 'horizontal-radial',
          hTitle: 'OEM Vendor Machinery Warranty Coverage Units',
          hSubtitle: 'Equipment units covered by active OEM warranty',
          hItems: [
            { label: 'Kärcher Industrial', value: 110, displayValue: '110 Machinery Units', color: '#f97316' },
            { label: 'Nilfisk India', value: 85, displayValue: '85 Machinery Units', color: '#3b82f6' },
            { label: 'Taski Diversey', value: 65, displayValue: '65 Machinery Units', color: '#10b981' },
            { label: 'Bosch Power Tools', value: 54, displayValue: '54 Machinery Units', color: '#8b5cf6' },
            { label: 'Cummins Power', value: 40, displayValue: '40 Generator Units', color: '#ec4899' }
          ],
          gaugeScore: 96.5,
          gaugeTitle: 'Active OEM Warranty Coverage Ratio',
          gaugeLabel: '96.5% Covered',
          gaugeColor: '#8b5cf6'
        };
      case 'safety-inspections':
        return {
          title: 'Asset Safety & Compliance Inspection Checklists',
          subtitle: 'Electrical insulation tests, height platform harness signoffs, inspector tags, and safety green-tag certifications.',
          data: facilityData.safetyInspections || [],
          columns: ['inspectionId', 'assetRef', 'assetName', 'site', 'zoneLocation', 'inspectionType', 'inspector', 'inspectedDate', 'inspectionResult'],
          chartType: 'bar-radial',
          barTitle: 'Green-Tag Safety Inspections Passed by Site',
          barSubtitle: 'Certified safety clearance audits',
          barData: [
            { label: 'GMR Airport', value: 82, color: '#10b981' },
            { label: 'MS GCC', value: 61, color: '#3b82f6' },
            { label: 'Amazon Hub', value: 50, color: '#06b6d4' },
            { label: 'Wipro Tech', value: 44, color: '#8b5cf6' },
            { label: 'Apollo Hosp', value: 40, color: '#ec4899' },
            { label: 'Tata Steel', value: 52, color: '#f59e0b' }
          ],
          barUnit: '',
          gaugeScore: 97.6,
          gaugeTitle: 'Safety Audit Compliance Pass Rate',
          gaugeLabel: 'Green Tag Certified',
          gaugeColor: '#10b981'
        };
      case 'work-orders':
      default:
        return {
          title: 'Facility Maintenance Work Orders',
          subtitle: 'Preventive and corrective maintenance work order tickets across client facility sites.',
          data: facilityData.facilityWorkOrders || [],
          columns: ['ticketId', 'taskName', 'assetRef', 'site', 'zoneLocation', 'assignedTeam', 'priority', 'costEstimate', 'status'],
          chartType: 'bar-donut',
          barTitle: 'Work Order Cost Volume by Site (₹ Thousands)',
          barSubtitle: 'Soft-services maintenance budget per site',
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
          donutSubtitle: 'Work order urgency distribution',
          donutSlices: [
            { label: 'Standard / Routine', value: 180, color: '#10b981' },
            { label: 'High Priority', value: 114, color: '#3b82f6' },
            { label: 'Critical Emergency', value: 60, color: '#ef4444' }
          ],
          donutTotalLabel: 'Work Orders'
        };
    }
  };

  const config = getViewConfig();

  const filteredData = config.data.filter((item: any) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = Object.values(item).some(val => String(val).toLowerCase().includes(search));
    const siteVal = item.siteAllocation || item.site || item.toLocation || '';
    const matchesSite = siteFilter === 'ALL' || siteVal.includes(siteFilter);
    return matchesSearch && matchesSite;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExportView = (rec?: any) => {
    const data = rec || {
      code: `FM-${view.toUpperCase()}-2026`,
      name: `Facilities ${config.title} Audit Report`,
      designation: 'Facilities Asset Director',
      department: 'Asset & Facilities Control',
      site: 'Multi-Site Network (GMR Airport, GCC Campus)',
      phone: '+91 9876543210',
      aadhaar: 'VERIFIED',
      pan: 'CORP-PAN',
      uan: '100099990000',
      esi: '3100000000',
      bank: 'FM-LEDGER-ACC',
      ifsc: 'HDFC0001234',
      joiningDate: '2026-08-08',
      status: 'Synchronized & Verified'
    };
    downloadPdfDocument(`Facilities ${config.title}`, data);
  };

  const renderCharts = () => {
    switch (config.chartType) {
      case 'horizontal-radial':
        return (
          <>
            <HorizontalBarChartWidget
              title={config.hTitle!}
              subtitle={config.hSubtitle!}
              items={config.hItems!}
            />
            <RadialGaugeWidget
              title={config.gaugeTitle!}
              subtitle="Audited multi-site score"
              score={config.gaugeScore!}
              scoreLabel={config.gaugeLabel!}
              color={config.gaugeColor!}
            />
          </>
        );
      case 'line-donut':
        return (
          <>
            <LineAreaChartWidget
              title={config.lineTitle!}
              subtitle={config.lineSubtitle!}
              data={config.lineData!}
              color={config.lineColor!}
              unit={config.lineUnit!}
            />
            <DonutChartWidget
              title={config.donutTitle!}
              subtitle={config.donutSubtitle!}
              slices={config.donutSlices!}
              totalLabel={config.donutTotalLabel!}
            />
          </>
        );
      case 'bar-radial':
        return (
          <>
            <BarChartWidget
              title={config.barTitle!}
              subtitle={config.barSubtitle!}
              data={config.barData!}
              unit={config.barUnit!}
            />
            <RadialGaugeWidget
              title={config.gaugeTitle!}
              subtitle="Audited multi-site score"
              score={config.gaugeScore!}
              scoreLabel={config.gaugeLabel!}
              color={config.gaugeColor!}
            />
          </>
        );
      case 'horizontal-donut':
        return (
          <>
            <HorizontalBarChartWidget
              title={config.hTitle!}
              subtitle={config.hSubtitle!}
              items={config.hItems!}
            />
            <DonutChartWidget
              title={config.donutTitle!}
              subtitle={config.donutSubtitle!}
              slices={config.donutSlices!}
              totalLabel={config.donutTotalLabel!}
            />
          </>
        );
      case 'line-horizontal':
        return (
          <>
            <LineAreaChartWidget
              title={config.lineTitle!}
              subtitle={config.lineSubtitle!}
              data={config.lineData!}
              color={config.lineColor!}
              unit={config.lineUnit!}
            />
            <HorizontalBarChartWidget
              title={config.hTitle!}
              subtitle={config.hSubtitle!}
              items={config.hItems!}
            />
          </>
        );
      case 'bar-donut':
      default:
        return (
          <>
            <BarChartWidget
              title={config.barTitle!}
              subtitle={config.barSubtitle!}
              data={config.barData!}
              unit={config.barUnit!}
            />
            <DonutChartWidget
              title={config.donutTitle!}
              subtitle={config.donutSubtitle!}
              slices={config.donutSlices!}
              totalLabel={config.donutTotalLabel!}
            />
          </>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0 border border-orange-500/20">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white capitalize flex items-center gap-2">
              <span>Facilities {config.title}</span>
              <span className="text-[10px] uppercase font-extrabold text-orange-500 bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20">
                {config.data.length} Live Records
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">
              {config.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExportView()}
            className="px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export View PDF</span>
          </button>
        </div>
      </div>

      {/* RENDER 5 DIFFERENT CHART TYPES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {renderCharts()}
      </div>

      {/* Data Table Container */}
      <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                placeholder="Search asset, QR tag, OEM, zone..."
                className="pl-8 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs rounded-lg outline-none focus:border-orange-500 w-64"
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
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 text-[10px] font-bold uppercase">Rows per page:</span>
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

        {/* Scrollable Sticky Table */}
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
                      onClick={() => handleExportView(row)}
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

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 pt-2">
          <span>Showing <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> to <strong>{Math.min(currentPage * itemsPerPage, filteredData.length)}</strong> of <strong>{filteredData.length}</strong> matching records</span>

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
