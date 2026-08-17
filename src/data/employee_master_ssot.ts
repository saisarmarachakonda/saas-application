export interface EmployeeSSOT {
  empCode: string;
  empName: string;
  designation: string;
  department: string;
  primarySite: string;
  assignedSites: string[];
  site: string; // Display formatted primary + secondary sites
  phone: string;
  aadhaarMasked: string;
  panMasked: string;
  uanMasked: string;
  esiMasked: string;
  bankMasked: string;
  ifsc: string;
  joiningDate: string;
  dressSize: string;
  shoeSize: string;
  basicPay: number;
  grossSalary: number;
  pfDeduction: number;
  esiDeduction: number;
  ptDeduction: number;
  pfContribution: number;
  esiContribution: number;
  ptContribution: number;
  netPay: number;
  status: string;
}

export const cleanEmployeeName = (name: any): string => {
  if (!name) return '';
  return String(name).replace(/\s*#\d+/g, '').trim();
};

export const isCurrencyColumn = (colName: string): boolean => {
  if (!colName) return false;
  const col = colName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const currencyKeys = [
    'grossearnings',
    'grosssalary',
    'gross',
    'netpay',
    'netsalary',
    'basic',
    'da',
    'hra',
    'otherallowance',
    'bonus',
    'employeepf12',
    'employeeesi075',
    'ptdeduction',
    'totaldeductions',
    'employerpf13',
    'esideduction',
    'pfdeduction',
    'unitprice',
    'suminsured'
  ];
  return currencyKeys.includes(col);
};

export const EMPLOYEE_SSOT_MAP: Record<string, EmployeeSSOT> = {
  '24SIPS-EMP-0001': {
    empCode: '24SIPS-EMP-0001',
    empName: 'Ramesh Iyer',
    designation: 'Soft Services Supervisor',
    department: 'Technical Operations & Maintenance',
    primarySite: 'Apollo Super Speciality Hospital Facility',
    assignedSites: [
      'Apollo Super Speciality Hospital Facility',
      'GMR International Airport Site',
      'DLF Cyber City Tower B',
      'Microsoft GCC Campus'
    ],
    site: 'Apollo Hospital (Primary) + 3 Visiting Sites (GMR, DLF, Microsoft)',
    phone: '+91 9849691441',
    aadhaarMasked: '2937-XXXX-8619',
    panMasked: 'ABCDEXXXXF',
    uanMasked: '1000-XXXX-7382',
    esiMasked: '3123-XXXX-5560',
    bankMasked: 'HDFC-XXXX-0729',
    ifsc: 'HDFC0001234',
    joiningDate: '2024-02-02',
    dressSize: 'M (38")',
    shoeSize: '9 UK',
    basicPay: 15000,
    grossSalary: 28500,
    pfDeduction: 2160,
    esiDeduction: 215,
    ptDeduction: 200,
    pfContribution: 2160,
    esiContribution: 215,
    ptContribution: 200,
    netPay: 25925,
    status: 'Active'
  },
  '24SIPS-EMP-0002': {
    empCode: '24SIPS-EMP-0002',
    empName: 'Manoj Gupta',
    designation: 'MEP Maintenance Engineer',
    department: 'Pest Control & Sanitization',
    primarySite: 'GMR International Airport Site',
    assignedSites: [
      'GMR International Airport Site',
      'Tata Steel Industrial Plant',
      'Wipro Tech Park'
    ],
    site: 'GMR Airport (Primary) + 2 Visiting Sites (Tata Steel, Wipro)',
    phone: '+91 9854252428',
    aadhaarMasked: '3388-XXXX-2366',
    panMasked: 'ABCDEXXXXF',
    uanMasked: '1000-XXXX-7256',
    esiMasked: '3186-XXXX-3765',
    bankMasked: 'HDFC-XXXX-6486',
    ifsc: 'HDFC0001234',
    joiningDate: '2024-03-03',
    dressSize: 'XXL (44")',
    shoeSize: '9 UK',
    basicPay: 16500,
    grossSalary: 31000,
    pfDeduction: 2340,
    esiDeduction: 232,
    ptDeduction: 200,
    pfContribution: 2340,
    esiContribution: 232,
    ptContribution: 200,
    netPay: 28228,
    status: 'Active'
  },
  '24SIPS-EMP-0003': {
    empCode: '24SIPS-EMP-0003',
    empName: 'Manoj Gupta',
    designation: 'Site HR Coordinator',
    department: 'Security & Gate Control',
    primarySite: 'Microsoft GCC Campus - Hyderabad',
    assignedSites: [
      'Microsoft GCC Campus - Hyderabad',
      'Divyasree B3/B4 Facility'
    ],
    site: 'Microsoft GCC (Primary) + Visiting Divyasree B3/B4',
    phone: '+91 9894691942',
    aadhaarMasked: '9516-XXXX-6840',
    panMasked: 'ABCDEXXXXF',
    uanMasked: '1000-XXXX-2846',
    esiMasked: '3145-XXXX-1942',
    bankMasked: 'HDFC-XXXX-1942',
    ifsc: 'HDFC0001234',
    joiningDate: '2024-01-15',
    dressSize: 'L (40")',
    shoeSize: '8 UK',
    basicPay: 14000,
    grossSalary: 26000,
    pfDeduction: 1980,
    esiDeduction: 195,
    ptDeduction: 200,
    pfContribution: 1980,
    esiContribution: 195,
    ptContribution: 200,
    netPay: 23625,
    status: 'Active'
  },
  '24SIPS-EMP-0004': {
    empCode: '24SIPS-EMP-0004',
    empName: 'Swati Saxena',
    designation: 'Senior Facility Specialist',
    department: 'Facility Soft Services',
    primarySite: 'Microsoft GCC Campus - Hyderabad',
    assignedSites: [
      'Microsoft GCC Campus - Hyderabad',
      'Amazon Fulfillment Center #4',
      'Clean Harbours Facility'
    ],
    site: 'Microsoft GCC (Primary) + 2 Visiting Sites (Amazon, Clean Harbours)',
    phone: '+91 9876543214',
    aadhaarMasked: '4412-XXXX-4412',
    panMasked: 'ABCDEXXXXF',
    uanMasked: '1000-XXXX-9914',
    esiMasked: '3199-XXXX-4412',
    bankMasked: 'HDFC-XXXX-4412',
    ifsc: 'HDFC0001234',
    joiningDate: '2024-04-10',
    dressSize: 'S (36")',
    shoeSize: '6 UK',
    basicPay: 15500,
    grossSalary: 29000,
    pfDeduction: 2200,
    esiDeduction: 217,
    ptDeduction: 200,
    pfContribution: 2200,
    esiContribution: 217,
    ptContribution: 200,
    netPay: 26383,
    status: 'Active'
  },
  '24SIPS-EMP-0005': {
    empCode: '24SIPS-EMP-0005',
    empName: 'Deepak Joshi',
    designation: 'HVAC Shift Technician',
    department: 'Engineering & Maintenance',
    primarySite: 'DLF Cyber City Tower B',
    assignedSites: [
      'DLF Cyber City Tower B',
      'Innopolis Facility',
      'Hetero Life Sciences'
    ],
    site: 'DLF Cyber City (Primary) + 2 Visiting Sites (Innopolis, Hetero)',
    phone: '+91 9812345678',
    aadhaarMasked: '5515-XXXX-5515',
    panMasked: 'ABCDEXXXXF',
    uanMasked: '1000-XXXX-5515',
    esiMasked: '3155-XXXX-5515',
    bankMasked: 'ICICI-XXXX-5515',
    ifsc: 'ICIC0005515',
    joiningDate: '2024-05-01',
    dressSize: 'XL (42")',
    shoeSize: '10 UK',
    basicPay: 17000,
    grossSalary: 32500,
    pfDeduction: 2400,
    esiDeduction: 243,
    ptDeduction: 200,
    pfContribution: 2400,
    esiContribution: 243,
    ptContribution: 200,
    netPay: 29657,
    status: 'Active'
  }
};

export const safeParseNumber = (val: any): number => {
  if (val === null || val === undefined) return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  const cleaned = String(val).replace(/[^0-9.-]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
};

export const maskUan = (uanStr: any): string => {
  if (!uanStr) return '1000-XXXX-7382';
  const str = String(uanStr).replace(/[^0-9]/g, '');
  if (str.length >= 10) {
    return str.substring(0, 4) + '-XXXX-' + str.slice(-4);
  }
  if (str.length > 4) {
    return '1000-XXXX-' + str.slice(-4);
  }
  return '1000-XXXX-7382';
};

// Full 31-Day Attendance Log History for Employee Staff View
export const generateStaffAttendanceHistory = () => {
  const sites = [
    'Apollo Super Speciality Hospital Facility',
    'Apollo Super Speciality Hospital Facility',
    'GMR International Airport Site',
    'DLF Cyber City Tower B',
    'Microsoft GCC Campus - Hyderabad'
  ];

  const logs = [];
  for (let i = 1; i <= 31; i++) {
    const dayNum = String(i).padStart(2, '0');
    const dateStr = `2026-07-${dayNum}`;
    const dayOfWeek = new Date(2026, 6, i).getDay(); // 0 is Sunday
    const isSunday = dayOfWeek === 0;
    const isLeave = i === 15; // 1 day approved casual leave

    const site = sites[(i - 1) % sites.length];
    const isOvertime = i % 5 === 0 && !isSunday && !isLeave;

    logs.push({
      employeeCode: '24SIPS-EMP-0001',
      employeeName: 'Ramesh Iyer',
      date: dateStr,
      site: site,
      shift: isSunday ? 'Weekly Off' : (i % 2 === 0 ? 'Morning Shift A (08:00 - 16:30)' : 'Evening Shift B (14:00 - 22:30)'),
      punchIn: isSunday ? '-' : (isLeave ? '-' : '08:02 AM'),
      punchOut: isSunday ? '-' : (isLeave ? '-' : (isOvertime ? '07:30 PM' : '04:32 PM')),
      presentDays: isSunday || isLeave ? 0 : 1,
      absentDays: 0,
      leaveDays: isLeave ? 1 : 0,
      overtimeHours: isOvertime ? 3 : 0,
      status: isSunday ? 'Sunday Weekly Off' : (isLeave ? 'Approved Casual Leave' : (isOvertime ? 'Verified (3h OT)' : 'Verified Present')),
      geofenceStatus: isSunday || isLeave ? 'N/A' : 'Inside Geofence (GPS Verified)'
    });
  }
  return logs;
};

// Full Monthly GPS Geo Punch Logs for Employee Staff View
export const generateStaffGeoPunchHistory = () => {
  const sites = [
    { name: 'Apollo Super Speciality Hospital Facility', lat: '17.4483', lng: '78.3741' },
    { name: 'GMR International Airport Site', lat: '17.2403', lng: '78.4294' },
    { name: 'DLF Cyber City Tower B', lat: '17.4452', lng: '78.3789' },
    { name: 'Microsoft GCC Campus - Hyderabad', lat: '17.4431', lng: '78.3772' }
  ];

  const punches = [];
  for (let i = 1; i <= 31; i++) {
    const dayNum = String(i).padStart(2, '0');
    const dateStr = `2026-07-${dayNum}`;
    const dayOfWeek = new Date(2026, 6, i).getDay();
    if (dayOfWeek === 0 || i === 15) continue; // Skip Sunday & leave

    const siteObj = sites[(i - 1) % sites.length];

    punches.push({
      punchId: `PUNCH-2026-07-${dayNum}-IN`,
      employeeCode: '24SIPS-EMP-0001',
      employeeName: 'Ramesh Iyer',
      site: siteObj.name,
      punchTime: `${dateStr} 08:02 AM`,
      action: 'IN (Duty Start)',
      latitude: siteObj.lat,
      longitude: siteObj.lng,
      geofenceStatus: 'Inside Geofence',
      method: 'Mobile Facial GPS'
    });

    punches.push({
      punchId: `PUNCH-2026-07-${dayNum}-OUT`,
      employeeCode: '24SIPS-EMP-0001',
      employeeName: 'Ramesh Iyer',
      site: siteObj.name,
      punchTime: `${dateStr} 04:32 PM`,
      action: 'OUT (Duty End)',
      latitude: siteObj.lat,
      longitude: siteObj.lng,
      geofenceStatus: 'Inside Geofence',
      method: 'Mobile Facial GPS'
    });
  }
  return punches;
};
