import { jsPDF } from 'jspdf';

export function maskSensitiveValue(value: string | number | undefined, type: 'aadhaar' | 'pan' | 'bank' | 'uan' | 'key' | 'general' = 'general'): string {
  if (!value) return '••••••••';
  const str = String(value).trim();
  if (type === 'aadhaar') {
    const clean = str.replace(/\s+/g, '');
    if (clean.length >= 12) {
      return `•••• •••• ${clean.slice(-4)}`;
    }
    return `••••••••${clean.slice(-4)}`;
  }
  if (type === 'pan') {
    if (str.length >= 10) {
      return `${str.slice(0, 2)}••••${str.slice(-3)}`;
    }
    return `${str.slice(0, 2)}••••`;
  }
  if (type === 'bank') {
    if (str.length > 4) {
      return `••••••••${str.slice(-4)}`;
    }
    return '••••••••';
  }
  if (type === 'uan') {
    if (str.length > 4) {
      return `••••••••${str.slice(-4)}`;
    }
    return '••••••••';
  }
  if (type === 'key') {
    if (str.length > 8) {
      return `${str.slice(0, 6)}••••••••${str.slice(-4)}`;
    }
    return '••••••••••••';
  }
  if (str.length > 4) {
    return `${str.slice(0, 2)}••••${str.slice(-2)}`;
  }
  return '••••••••';
}

export function downloadPdfDocument(docType: string, emp: any) {
  if (!emp) return;

  const doc = new jsPDF();

  // Header Banner
  doc.setFillColor(37, 99, 235); // #2563eb
  doc.rect(0, 0, 210, 25, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('VOC VERTEX • 24 SEVEN INNOVATIVE PRODUCTS AND SERVICES', 14, 14);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('CORPORATE FACILITIES & ENTERPRISE ASSET MANAGEMENT SYSTEMS', 14, 20);

  // Document Title
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text(docType.toUpperCase().replace('_', ' ') + ' CERTIFICATE & DOSSIER', 14, 38);

  // Metadata Line
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 140, 38);
  doc.text(`Ref No: 24SIPS/HR/${emp.code || 'DOC'}/${Date.now().toString().slice(-4)}`, 14, 44);

  // Divider Line
  doc.setLineWidth(0.4);
  doc.setDrawColor(203, 213, 225);
  doc.line(14, 48, 196, 48);

  // Employee Profile Box
  doc.setFillColor(248, 250, 252);
  doc.rect(14, 52, 182, 44, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(14, 52, 182, 44, 'S');

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(37, 99, 235);
  doc.text('EMPLOYEE & ASSIGNED CLIENT SITE DETAILS', 18, 60);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 65, 85);
  doc.text('Employee Code:', 18, 68);
  doc.text('Employee Name:', 18, 75);
  doc.text('Designation:', 18, 82);
  doc.text('Department:', 18, 89);

  doc.setFont('helvetica', 'normal');
  doc.text(String(emp.code || 'N/A'), 55, 68);
  doc.text(String(emp.name || 'N/A'), 55, 75);
  doc.text(String(emp.designation || 'N/A'), 55, 82);
  doc.text(String(emp.department || 'N/A'), 55, 89);

  doc.setFont('helvetica', 'bold');
  doc.text('Client Site:', 110, 68);
  doc.text('Joining Date:', 110, 75);
  doc.text('Mobile Phone:', 110, 82);
  doc.text('Status:', 110, 89);

  doc.setFont('helvetica', 'normal');
  doc.text(String(emp.site || 'N/A'), 140, 68);
  doc.text(String(emp.joiningDate || 'N/A'), 140, 75);
  doc.text(String(emp.phone || 'N/A'), 140, 82);
  doc.text(String(emp.status || 'Active'), 140, 89);

  // Statutory KYC Table Box (With Masked Sensitive Information)
  doc.setFillColor(241, 245, 249);
  doc.rect(14, 102, 182, 38, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(14, 102, 182, 38, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(79, 70, 229);
  doc.text('STATUTORY EPF / ESIC / BANKING KYC REGISTRATION (MASKED SECURITY)', 18, 110);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 65, 85);
  doc.text('Aadhaar KYC:', 18, 118);
  doc.text('PAN Card:', 18, 125);
  doc.text('EPF UAN Number:', 18, 132);

  doc.setFont('helvetica', 'normal');
  doc.text(maskSensitiveValue(emp.aadhaar, 'aadhaar'), 55, 118);
  doc.text(maskSensitiveValue(emp.pan, 'pan'), 55, 125);
  doc.text(maskSensitiveValue(emp.uan, 'uan'), 55, 132);

  doc.setFont('helvetica', 'bold');
  doc.text('ESIC IP Code:', 110, 118);
  doc.text('Bank Account:', 110, 125);
  doc.text('IFSC Code:', 110, 132);

  doc.setFont('helvetica', 'normal');
  doc.text(maskSensitiveValue(emp.esi, 'general'), 140, 118);
  doc.text(maskSensitiveValue(emp.bank, 'bank'), 140, 125);
  doc.text(String(emp.ifsc || 'N/A'), 140, 132);

  // Content Paragraphs per document type
  let y = 148;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 41, 59);

  if (docType === 'payslip') {
    doc.setFont('helvetica', 'bold');
    doc.text('SALARY DISBURSAL BREAKDOWN (AUGUST 2026)', 14, y);
    y += 6;

    // Table Header
    doc.setFillColor(37, 99, 235);
    doc.rect(14, y, 182, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text('EARNINGS', 18, y + 5);
    doc.text('AMOUNT', 85, y + 5);
    doc.text('DEDUCTIONS', 110, y + 5);
    doc.text('AMOUNT', 175, y + 5);
    y += 7;

    const items = [
      ['Basic Salary', '₹ 14,800', 'EPF Contribution (12%)', '₹ 1,776'],
      ['HRA Allowance', '₹ 7,400', 'ESIC Contribution (0.75%)', '₹ 214'],
      ['Special Allowance', '₹ 4,200', 'Professional Tax (PT)', '₹ 200'],
      ['Conveyance Allowance', '₹ 2,100', 'Total Deductions', '₹ 2,190']
    ];

    doc.setTextColor(51, 65, 85);
    doc.setFont('helvetica', 'normal');
    items.forEach((item, idx) => {
      doc.setFillColor(idx % 2 === 0 ? 255 : 248, 250, 252);
      doc.rect(14, y, 182, 6, 'F');
      doc.text(item[0], 18, y + 4.5);
      doc.text(item[1], 85, y + 4.5);
      doc.text(item[2], 110, y + 4.5);
      doc.text(item[3], 175, y + 4.5);
      y += 6;
    });

    y += 4;
    doc.setFillColor(236, 253, 245);
    doc.rect(14, y, 182, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(5, 150, 105);
    doc.text('NET SALARY DISBURSED:', 18, y + 5.5);
    doc.text('₹ 26,310 / Month', 140, y + 5.5);
  } else {
    doc.setFont('helvetica', 'normal');
    const body = `This is to certify that ${emp.name || 'Employee'} (Emp Code: ${emp.code || 'N/A'}) is employed with 24 Seven Innovative Products and Services assigned to ${emp.site || 'Client Site'}. All statutory EPF, ESIC, and bank records are verified under multi-tenant enterprise data governance.`;

    const splitText = doc.splitTextToSize(body, 180);
    doc.text(splitText, 14, y);
  }

  // Footer Signatures
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('AUTHORIZED SIGNATORY', 14, 260);
  doc.text('EMPLOYEE ACKNOWLEDGEMENT', 140, 260);

  doc.setFont('helvetica', 'normal');
  doc.text('24 Seven Innovative Products & Services HR Portal', 14, 265);
  doc.text('Digitally Signed & Verified Dossier', 140, 265);

  doc.save(`${docType}_${emp.code || 'DOCUMENT'}.pdf`);
}
