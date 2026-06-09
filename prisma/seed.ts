import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing database...');
  await prisma.activityLog.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.inventoryAlert.deleteMany({});
  await prisma.stockMovement.deleteMany({});
  await prisma.inventoryItem.deleteMany({});
  await prisma.goodsReceipt.deleteMany({});
  await prisma.purchaseOrder.deleteMany({});
  await prisma.rfqProcurement.deleteMany({});
  await prisma.purchaseRequisition.deleteMany({});
  await prisma.salesOrder.deleteMany({});
  await prisma.quotation.deleteMany({});
  await prisma.rfqCRM.deleteMany({});
  await prisma.opportunity.deleteMany({});
  await prisma.lead.deleteMany({});
  await prisma.material.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.productCategory.deleteMany({});
  await prisma.vendor.deleteMany({});
  await prisma.supplierScorecard.deleteMany({});
  await prisma.customer.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.subscription.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.department.deleteMany({});
  await prisma.warehouse.deleteMany({});
  await prisma.plant.deleteMany({});
  await prisma.company.deleteMany({});
  await prisma.systemSettings.deleteMany({});
  await prisma.approvalMatrix.deleteMany({});
  await prisma.workflowLog.deleteMany({});
  await prisma.workflowInstance.deleteMany({});
  await prisma.taxRecord.deleteMany({});
  await prisma.budget.deleteMany({});
  await prisma.journalEntry.deleteMany({});
  await prisma.financialTransaction.deleteMany({});

  console.log('Seeding initial configurations...');

  // System Settings
  await prisma.systemSettings.createMany({
    data: [
      { key: 'multi_tenant_enabled', value: 'true', category: 'FeatureFlags' },
      { key: 'require_po_approval_limit', value: '5000', category: 'Workflow' },
      { key: 'system_email_sender', value: 'notifications@saas-erp.com', category: 'General' },
      { key: 'dark_mode_default', value: 'true', category: 'General' },
    ],
  });

  // Approval Matrix
  await prisma.approvalMatrix.createMany({
    data: [
      { module: 'Procurement', amountLimit: 1000, approvedByRole: 'DepartmentHead', isActive: true },
      { module: 'Procurement', amountLimit: 5000, approvedByRole: 'Admin', isActive: true },
      { module: 'CRM', amountLimit: 20000, approvedByRole: 'Admin', isActive: true },
    ],
  });

  // Company Structure
  const company = await prisma.company.create({
    data: {
      name: 'Apex Global Enterprises',
      code: 'APEX',
      address: '100 Silicon Valley Way, San Jose, CA',
      industry: 'Manufacturing',
      taxId: 'TX-APEX-9981',
    },
  });

  const plantA = await prisma.plant.create({
    data: {
      name: 'Chicago Assembly Plant',
      code: 'CHI-01',
      companyId: company.id,
    },
  });

  const plantB = await prisma.plant.create({
    data: {
      name: 'Houston Chemical Plant',
      code: 'HOU-01',
      companyId: company.id,
    },
  });

  const whA = await prisma.warehouse.create({
    data: {
      name: 'Chicago Central Depot',
      code: 'CHI-WH-01',
      plantId: plantA.id,
    },
  });

  const whB = await prisma.warehouse.create({
    data: {
      name: 'Houston Storage Vault',
      code: 'HOU-WH-01',
      plantId: plantB.id,
    },
  });

  const deptSales = await prisma.department.create({
    data: { name: 'Sales & Marketing', code: 'DEPT-SALES' },
  });

  const deptProcure = await prisma.department.create({
    data: { name: 'Global Procurement', code: 'DEPT-PROC' },
  });

  const deptInv = await prisma.department.create({
    data: { name: 'Logistics & Warehousing', code: 'DEPT-LOG' },
  });

  console.log('Seeding users...');
  const hashedPassword = bcrypt.hashSync('Password123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Aarav Sharma',
      roleName: 'Admin',
      phone: '+91 98765 43210',
      status: 'Active',
      companyId: company.id,
      departmentId: deptProcure.id,
    },
  });

  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      password: hashedPassword,
      name: 'Rajesh Patel',
      roleName: 'User',
      phone: '+91 98765 12345',
      status: 'Active',
      companyId: company.id,
      departmentId: deptSales.id,
    },
  });

  // Subscriptions & Payments
  const sub = await prisma.subscription.create({
    data: {
      userId: admin.id,
      planName: 'Enterprise',
      status: 'Active',
      price: 499.0,
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    },
  });

  await prisma.payment.create({
    data: {
      subscriptionId: sub.id,
      amount: 499.0,
      status: 'Succeeded',
      transactionId: 'TXN_' + Math.random().toString(36).substring(2, 11).toUpperCase(),
    },
  });

  console.log('Seeding Master Data...');

  // Customers
  const custA = await prisma.customer.create({
    data: { name: 'Tata Motors Ltd', code: 'TATAMOTORS', email: 'procurement@tatamotors.com', category: 'Key Account', address: 'Mumbai, Maharashtra', creditLimit: 250000.0, website: 'https://www.tatamotors.com' },
  });
  const custB = await prisma.customer.create({
    data: { name: 'Reliance Industries', code: 'RELIANCE', email: 'buying@reliance.com', category: 'Regular', address: 'Navi Mumbai, Maharashtra', creditLimit: 500000.0, website: 'https://www.ril.com' },
  });

  // Vendors
  const vendorA = await prisma.vendor.create({
    data: { name: 'Infosys Technologies', code: 'INFOSYS', email: 'supply@infosys.com', classification: 'Gold', rating: 4.8, performanceTags: 'Fast,Premium', paymentTerms: 'Net 30', taxRegistration: 'GST-INFY-5544' },
  });
  const vendorB = await prisma.vendor.create({
    data: { name: 'Jindal Steel & Power', code: 'JINDAL', email: 'sales@jindalsteel.com', classification: 'Silver', rating: 4.2, performanceTags: 'Reliable,Bulk', paymentTerms: 'Net 45', taxRegistration: 'GST-JINDAL-9988' },
  });

  // Supplier Scorecards
  await prisma.supplierScorecard.createMany({
    data: [
      { vendorId: vendorA.id, qualityScore: 98, deliveryScore: 95, costScore: 88, overallScore: 93.67, period: 'Q1-2026' },
      { vendorId: vendorB.id, qualityScore: 89, deliveryScore: 92, costScore: 95, overallScore: 92.0, period: 'Q1-2026' },
    ],
  });

  // Product Category & Products
  const catElectro = await prisma.productCategory.create({
    data: { name: 'Electronics & Chips', code: 'CAT-ELEC' },
  });
  const catHardware = await prisma.productCategory.create({
    data: { name: 'Structural Hardware', code: 'CAT-HARD' },
  });

  const prodCpu = await prisma.product.create({
    data: { name: 'Core i7 Microprocessor', sku: 'SKU-CPU-I7', categoryId: catElectro.id, specification: '8 cores, 4.2GHz, 14nm', price: 299.99, barcode: '012345678901', costPrice: 150.0, weight: 0.05 },
  });
  const prodSteel = await prisma.product.create({
    data: { name: 'Reinforced Steel Beam', sku: 'SKU-BEAM-ST', categoryId: catHardware.id, specification: '10ft, Grade 50 Structural Steel', price: 89.5, barcode: '987654321098', costPrice: 45.00, weight: 120.5 },
  });

  // Materials
  const matCpu = await prisma.material.create({
    data: { name: 'Silicon Wafer Raw', code: 'MAT-SIL-01', type: 'Raw Material', unit: 'pcs', cost: 12.5, leadTimeDays: 14, reorderPoint: 200.0 },
  });
  const matSteelSheet = await prisma.material.create({
    data: { name: 'Galvanized Steel Sheet', code: 'MAT-STL-02', type: 'Raw Material', unit: 'kg', cost: 1.85, leadTimeDays: 5, reorderPoint: 500.0 },
  });
  const matCircuit = await prisma.material.create({
    data: { name: 'Assembled Chipset board', code: 'MAT-PCB-03', type: 'Semi-Finished Goods', unit: 'pcs', cost: 45.0, leadTimeDays: 10, reorderPoint: 100.0 },
  });

  console.log('Seeding CRM pipeline...');

  // Leads
  const leadA = await prisma.lead.create({
    data: { name: 'Vikram Malhotra', email: 'vikram@malhotracorp.in', company: 'Malhotra Enterprises', status: 'Qualified', source: 'Referral', assignedTo: 'Rajesh Patel' },
  });
  const leadB = await prisma.lead.create({
    data: { name: 'Aditya Birla', email: 'aditya@birlagroup.co.in', company: 'Birla Group', status: 'New', source: 'Website', assignedTo: 'Rajesh Patel' },
  });

  // Opportunities
  const oppA = await prisma.opportunity.create({
    data: { leadId: leadA.id, name: 'Starship Fuel Valves Supply', stage: 'Proposal', value: 75000.00, expectedClose: new Date(Date.now() + 60 * 24 * 3600 * 1000) },
  });

  // RFQ (CRM)
  const rfqCrmA = await prisma.rfqCRM.create({
    data: { customerId: custA.id, title: 'Tesla Model Y Chipset bidding', status: 'Under Evaluation', dueDate: new Date(Date.now() + 15 * 24 * 3600 * 1000) },
  });

  // Quotation
  const quoteA = await prisma.quotation.create({
    data: { rfqId: rfqCrmA.id, code: 'QT-2026-001', version: 1, value: 120000.0, status: 'Approved' },
  });

  // Sales Order
  await prisma.salesOrder.create({
    data: { quotationId: quoteA.id, orderNo: 'SO-2026-0001', value: 120000.0, status: 'Processing' },
  });

  console.log('Seeding Procurement pipeline...');

  // Purchase Requisitions
  await prisma.purchaseRequisition.createMany({
    data: [
      { title: 'Urgent Microcontroller procurement', departmentName: 'Global Procurement', requestedBy: 'Aarav Sharma', itemDetails: '500x Silicon Wafer Raw (MAT-SIL-01)', estimatedCost: 6250.0, status: 'Approved' },
      { title: 'Structural sheet replenishment', departmentName: 'Logistics & Warehousing', requestedBy: 'Sanjay Mehta', itemDetails: '2000kg Galvanized Steel Sheet (MAT-STL-02)', estimatedCost: 3700.0, status: 'Pending Approval' },
    ],
  });

  // RFQ (Procurement)
  await prisma.rfqProcurement.create({
    data: { title: 'Procurement Bid for Silicon Wafers', vendorId: vendorA.id, dueDate: new Date(Date.now() + 7 * 24 * 3600 * 1000), status: 'Sent' },
  });

  // Purchase Orders
  const poA = await prisma.purchaseOrder.create({
    data: { poNumber: 'PO-2026-0001', vendorId: vendorA.id, value: 6250.0, status: 'Approved' },
  });
  const poB = await prisma.purchaseOrder.create({
    data: { poNumber: 'PO-2026-0002', vendorId: vendorB.id, value: 3700.0, status: 'Pending' },
  });

  // Goods Receipt
  await prisma.goodsReceipt.create({
    data: {
      grnNumber: 'GRN-2026-0001',
      purchaseOrderId: poA.id,
      verifiedBy: 'Aarav Sharma',
      verificationDetails: 'Passed inspection. 500 wafers received in intact trays.',
      status: 'Verified',
    },
  });

  console.log('Seeding Inventory...');

  // Inventory items
  const invA = await prisma.inventoryItem.create({
    data: { warehouseId: whA.id, materialName: 'Silicon Wafer Raw', sku: 'MAT-SIL-01', quantity: 500, unit: 'pcs', batchNumber: 'BAT-SIL-2026A', qrCode: 'MAT-SIL-01|BAT-SIL-2026A', minAlertQty: 200, maxAlertQty: 1000 },
  });
  const invB = await prisma.inventoryItem.create({
    data: { warehouseId: whA.id, materialName: 'Galvanized Steel Sheet', sku: 'MAT-STL-02', quantity: 80, unit: 'kg', batchNumber: 'BAT-STL-992', qrCode: 'MAT-STL-02|BAT-STL-992', minAlertQty: 150, maxAlertQty: 5000 },
  });
  const invC = await prisma.inventoryItem.create({
    data: { warehouseId: whB.id, materialName: 'Assembled Chipset board', sku: 'MAT-PCB-03', quantity: 1200, unit: 'pcs', batchNumber: 'BAT-PCB-004', qrCode: 'MAT-PCB-03|BAT-PCB-004', minAlertQty: 100, maxAlertQty: 1000 },
  });

  // Stock Movements
  await prisma.stockMovement.createMany({
    data: [
      { materialName: 'Silicon Wafer Raw', sku: 'MAT-SIL-01', quantity: 500, type: 'Stock Inward', toWarehouse: 'Chicago Central Depot', referenceNo: 'GRN-2026-0001' },
      { materialName: 'Galvanized Steel Sheet', sku: 'MAT-STL-02', quantity: 120, type: 'Stock Outward', fromWarehouse: 'Chicago Central Depot', referenceNo: 'WO-882' },
      { materialName: 'Assembled Chipset board', sku: 'MAT-PCB-03', quantity: 200, type: 'Stock Transfer', fromWarehouse: 'Chicago Central Depot', toWarehouse: 'Houston Storage Vault', referenceNo: 'TR-1002' },
    ],
  });

  // Inventory Alerts
  await prisma.inventoryAlert.create({
    data: { sku: 'MAT-STL-02', materialName: 'Galvanized Steel Sheet', type: 'Low Stock', quantity: 80, threshold: 150, status: 'Active' },
  });

  await prisma.inventoryAlert.create({
    data: { sku: 'MAT-PCB-03', materialName: 'Assembled Chipset board', type: 'Overstock', quantity: 1200, threshold: 1000, status: 'Active' },
  });

  // Notifications
  await prisma.notification.createMany({
    data: [
      { userId: admin.id, title: 'Low Stock Alert', message: 'Galvanized Steel Sheet is down to 80kg (threshold 150kg).', read: false },
      { userId: admin.id, title: 'PO Approval Required', message: 'PO-2026-0002 for Steel Supply LLC ($3,700.00) requires authorization.', read: false },
      { userId: user.id, title: 'Lead Assigned', message: 'Opportunity "Starship Fuel Valves Supply" has been qualified and assigned to you.', read: false },
    ],
  });

  // Activity Log
  await prisma.activityLog.createMany({
    data: [
      { userId: admin.id, userEmail: 'admin@example.com', action: 'LOGIN', details: 'Successful login', ipAddress: '192.168.1.5' },
      { userId: admin.id, userEmail: 'admin@example.com', action: 'PO_APPROVE', details: 'Approved PO-2026-0001 for Intel Semiconductors', ipAddress: '192.168.1.5' },
      { userId: user.id, userEmail: 'user@example.com', action: 'LEAD_CREATE', details: 'Created Lead Bruce Wayne from Website', ipAddress: '192.168.1.8' },
    ],
  });

  console.log('Seeding Finance & Accounting...');

  // Budgets
  await prisma.budget.createMany({
    data: [
      { departmentName: 'Sales & Marketing', allocated: 50000.0, spent: 42000.0, variance: 8000.0, period: 'Q1-2026' },
      { departmentName: 'Global Procurement', allocated: 120000.0, spent: 112500.0, variance: 7500.0, period: 'Q1-2026' },
      { departmentName: 'Logistics & Warehousing', allocated: 35000.0, spent: 38200.0, variance: -3200.0, period: 'Q1-2026' },
    ],
  });

  // Financial Transactions
  await prisma.financialTransaction.createMany({
    data: [
      { type: 'Customer Receipt', amount: 120000.0, description: 'Fulfillment payment for SO-2026-0001', referenceNo: 'SO-2026-0001', status: 'Reconciled', category: 'Accounts Receivable' },
      { type: 'Advance Payment', amount: 15000.0, description: 'Advance deposit for SpaceX Opportunity', referenceNo: 'OPP-STARSHIP', status: 'Approved', category: 'Cash' },
      { type: 'Vendor Invoice', amount: 6250.0, description: 'Intel chipset invoice for PO-2026-0001', referenceNo: 'PO-2026-0001', status: 'Processed', category: 'Accounts Payable' },
      { type: 'Vendor Payment', amount: 6250.0, description: 'Settlement for Intel invoice', referenceNo: 'PO-2026-0001', status: 'Processed', category: 'Bank' },
    ],
  });

  // Journal Entries
  await prisma.journalEntry.createMany({
    data: [
      { code: 'JV-2026-001', description: 'Depreciation of assembly plant machinery', amount: 1200.0, debitAccount: 'Depreciation Expense', creditAccount: 'Accumulated Depreciation' },
      { code: 'JV-2026-002', description: 'Accrued department payroll Q1', amount: 25000.0, debitAccount: 'Salaries Expense', creditAccount: 'Payroll Payable' },
    ],
  });

  // Tax Records
  await prisma.taxRecord.createMany({
    data: [
      { type: 'GST', amount: 21600.0, rate: 0.18, referenceNo: 'SO-2026-0001', status: 'Tracked' },
      { type: 'TDS', amount: 625.0, rate: 0.10, referenceNo: 'PO-2026-0001', status: 'Filed' },
    ],
  });

  console.log('Seeding Workflow Automation instances...');

  // Workflow Instances & Logs
  const flowA = await prisma.workflowInstance.create({
    data: {
      module: 'Procurement',
      entityId: poB.id,
      entityName: 'PO-2026-0002',
      currentStep: 'CFO Final Approval',
      assignedRole: 'Admin',
      status: 'In Progress',
      slaHours: 24,
      escalated: false,
    },
  });

  await prisma.workflowLog.createMany({
    data: [
      { workflowInstanceId: flowA.id, step: 'Initiation', action: 'Approved', comment: 'PO generated automatically from Requisition', performedBy: 'Sanjay Mehta' },
      { workflowInstanceId: flowA.id, step: 'Department Head Review', action: 'Approved', comment: 'Requisition cost within normal guidelines', performedBy: 'Aarav Sharma' },
      { workflowInstanceId: flowA.id, step: 'CFO Final Review', action: 'Escalated', comment: 'Approver SLA window (24h) expired. Escalated to administrator.', performedBy: 'System Engine' },
    ],
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
