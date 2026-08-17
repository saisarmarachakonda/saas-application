import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { hashPassword } from '@/lib/auth';
import { initialMockDb, MockDatabase } from '@/lib/mockData';
import erpLiveData from '@/data/erp_live_data.json';
import facilityData from '@/data/facilities_live_data.json';

// Maintain in-memory mock database state for development/fallback
const globalForMockDb = global as unknown as { mockDb?: MockDatabase };
if (!globalForMockDb.mockDb) {
  globalForMockDb.mockDb = { ...initialMockDb };
}
const mockDb = globalForMockDb.mockDb;
if (!mockDb.erpRecord || mockDb.erpRecord.length === 0) {
  mockDb.erpRecord = erpLiveData;
}
if (!mockDb.facilityAsset || mockDb.facilityAsset.length === 0) {
  mockDb.facilityAsset = facilityData.facilityAssets;
}

// Helper to map route string parameter to Prisma model key
const getModelClient = (modelName: string) => {
  const mapping: { [key: string]: string } = {
    'company': 'company',
    'plant': 'plant',
    'warehouse': 'warehouse',
    'department': 'department',
    'user': 'user',
    'customer': 'customer',
    'vendor': 'vendor',
    'productcategory': 'productCategory',
    'product': 'product',
    'material': 'material',
    'lead': 'lead',
    'opportunity': 'opportunity',
    'rfqcrm': 'rfqCRM',
    'quotation': 'quotation',
    'salesorder': 'salesOrder',
    'purchaserequisition': 'purchaseRequisition',
    'rfqprocurement': 'rfqProcurement',
    'purchaseorder': 'purchaseOrder',
    'goodsreceipt': 'goodsReceipt',
    'supplierscorecard': 'supplierScorecard',
    'inventoryitem': 'inventoryItem',
    'stockmovement': 'stockMovement',
    'inventoryalert': 'inventoryAlert',
    'systemsettings': 'systemSettings',
    'approvalmatrix': 'approvalMatrix',
    'activitylog': 'activityLog',
    'financialtransaction': 'financialTransaction',
    'journalentry': 'journalEntry',
    'budget': 'budget',
    'taxrecord': 'taxRecord',
    'workflowinstance': 'workflowInstance',
    'workflowlog': 'workflowLog',
  };

  const prismaKey = mapping[modelName.toLowerCase()];
  if (!prismaKey) return null;
  return (db as any)[prismaKey];
};

// Helper to map route string parameter to mock DB key
const getMockKey = (modelName: string): keyof MockDatabase | null => {
  const mapping: { [key: string]: keyof MockDatabase } = {
    'company': 'company',
    'plant': 'plant',
    'warehouse': 'warehouse',
    'department': 'department',
    'user': 'user',
    'customer': 'customer',
    'vendor': 'vendor',
    'productcategory': 'productCategory',
    'product': 'product',
    'material': 'material',
    'lead': 'lead',
    'opportunity': 'opportunity',
    'rfqcrm': 'rfqCRM',
    'quotation': 'quotation',
    'salesorder': 'salesOrder',
    'purchaserequisition': 'purchaseRequisition',
    'rfqprocurement': 'rfqProcurement',
    'purchaseorder': 'purchaseOrder',
    'goodsreceipt': 'goodsReceipt',
    'supplierscorecard': 'supplierScorecard',
    'inventoryitem': 'inventoryItem',
    'stockmovement': 'stockMovement',
    'inventoryalert': 'inventoryAlert',
    'financialtransaction': 'financialTransaction',
    'journalentry': 'journalEntry',
    'budget': 'budget',
    'taxrecord': 'taxRecord',
    'workflowinstance': 'workflowInstance',
    'workflowlog': 'workflowLog',
    'employee': 'employee',
    'leaverequest': 'leaverequest',
    'payroll': 'payroll',
    'erprecord': 'erpRecord',
    'erp': 'erpRecord',
    'resourcemaster': 'erpRecord',
    'workorders': 'erpRecord',
    'work-orders': 'erpRecord',
    'materialallocations': 'erpRecord',
    'material-allocations': 'erpRecord',
    'plantcapacity': 'erpRecord',
    'plant-capacity': 'erpRecord',
    'bom': 'erpRecord',
    'costcenters': 'erpRecord',
    'cost-centers': 'erpRecord',
    'facilityasset': 'facilityAsset',
    'facilities': 'facilityAsset',
    'facility': 'facilityAsset',
    'asset': 'facilityAsset',
    'assets': 'facilityAsset',
    'machinery': 'facilityAsset',
    'siteallocations': 'facilityAsset',
    'site-allocations': 'facilityAsset',
    'ledger': 'facilityAsset',
  };
  return mapping[modelName.toLowerCase()] || null;
};

// Type format helper
const formatFields = (key: string, value: any) => {
  if (typeof value === 'string' && value !== '') {
    if (['price', 'cost', 'value', 'amount', 'quantity', 'amountLimit', 'rating', 'minAlertQty', 'maxAlertQty', 'threshold', 'qualityScore', 'deliveryScore', 'costScore', 'overallScore', 'version', 'salary', 'baseSalary', 'bonus', 'deductions', 'netPay'].includes(key)) {
      return parseFloat(value);
    }
    if (['dueDate', 'expectedClose', 'startDate', 'endDate', 'date', 'receivedDate', 'dateJoined', 'paidDate'].includes(key)) {
      return new Date(value);
    }
  }
  return value;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ model: string }> }
) {
  const { model } = await params;
  const mockKey = getMockKey(model);
  
  if (!mockKey) {
    return NextResponse.json({ error: `Model '${model}' not found` }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const modelClient = getModelClient(model);

  // Attempt database query first, fallback to mock DB on error or if HRM model
  if (modelClient) {
    try {
      if (id) {
        const item = await modelClient.findUnique({ where: { id } });
        if (item) return NextResponse.json(item);
      } else {
        const items = await modelClient.findMany();
        if (items) return NextResponse.json(items);
      }
    } catch (dbError) {
      console.warn(`[DATABASE OFFLINE] Falling back to mock state for GET on model "${model}":`, dbError);
    }
  }

  // Mock Database Implementation
  const mockTable = mockDb[mockKey];
  if (id) {
    const item = mockTable.find((record: any) => record.id === id);
    if (!item) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }
    return NextResponse.json(item);
  }

  return NextResponse.json(mockTable);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ model: string }> }
) {
  const { model } = await params;
  const mockKey = getMockKey(model);
  
  if (!mockKey) {
    return NextResponse.json({ error: `Model '${model}' not found` }, { status: 404 });
  }

  const cookieToken = request.cookies.get('auth_token')?.value;
  const user = cookieToken ? verifyToken(cookieToken) : null;
  const body = await request.json();

  // Special Auth logic: Hash user passwords if creating a user
  if (model.toLowerCase() === 'user' && body.password) {
    body.password = hashPassword(body.password);
  }

  // Format fields
  const formattedData: any = {};
  for (const key in body) {
    formattedData[key] = formatFields(key, body[key]);
  }

  const modelClient = getModelClient(model);
  if (modelClient) {
    try {
      const newItem = await modelClient.create({ data: formattedData });
      
      // Write audit log
      if (user) {
        await db.activityLog.create({
          data: {
            userId: user.userId,
            userEmail: user.email,
            action: 'CREATE',
            details: `Created record in ${model} (ID: ${newItem.id})`,
            ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1',
          },
        });
      }
      return NextResponse.json(newItem, { status: 201 });
    } catch (dbError) {
      console.warn(`[DATABASE OFFLINE] Falling back to mock state for POST on model "${model}":`, dbError);
    }
  }

  // Mock Database Implementation
  const newMockRecord = {
    id: `MOCK-${model.toUpperCase().substring(0, 3)}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    ...formattedData,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  mockDb[mockKey].unshift(newMockRecord);

  // Fallback audit log
  if (user) {
    const auditRecord = {
      id: `MOCK-ACT-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      userId: user.userId,
      userEmail: user.email,
      action: 'CREATE',
      details: `Created record in mock ${model} (ID: ${newMockRecord.id})`,
      ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1',
      createdAt: new Date()
    };
    mockDb.activityLog?.unshift(auditRecord);
  }

  return NextResponse.json(newMockRecord, { status: 201 });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ model: string }> }
) {
  const { model } = await params;
  const mockKey = getMockKey(model);
  
  if (!mockKey) {
    return NextResponse.json({ error: `Model '${model}' not found` }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Record ID is required for update' }, { status: 400 });
  }

  const cookieToken = request.cookies.get('auth_token')?.value;
  const user = cookieToken ? verifyToken(cookieToken) : null;
  const body = await request.json();

  if (model.toLowerCase() === 'user' && body.password) {
    body.password = hashPassword(body.password);
  }

  // Format data
  const formattedData: any = {};
  for (const key in body) {
    if (key !== 'id' && key !== 'createdAt' && key !== 'updatedAt') {
      formattedData[key] = formatFields(key, body[key]);
    }
  }

  const modelClient = getModelClient(model);
  if (modelClient) {
    try {
      const updatedItem = await modelClient.update({
        where: { id },
        data: formattedData,
      });

      if (user) {
        await db.activityLog.create({
          data: {
            userId: user.userId,
            userEmail: user.email,
            action: 'UPDATE',
            details: `Updated record in ${model} (ID: ${id})`,
            ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1',
          },
        });
      }
      return NextResponse.json(updatedItem);
    } catch (dbError) {
      console.warn(`[DATABASE OFFLINE] Falling back to mock state for PUT on model "${model}":`, dbError);
    }
  }

  // Mock Database Implementation
  const mockTable = mockDb[mockKey];
  const recordIndex = mockTable.findIndex((record: any) => record.id === id);

  if (recordIndex === -1) {
    return NextResponse.json({ error: 'Record not found in mock store' }, { status: 404 });
  }

  const updatedRecord = {
    ...mockTable[recordIndex],
    ...formattedData,
    updatedAt: new Date()
  };

  mockTable[recordIndex] = updatedRecord;

  // Fallback audit log
  if (user) {
    const auditRecord = {
      id: `MOCK-ACT-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      userId: user.userId,
      userEmail: user.email,
      action: 'UPDATE',
      details: `Updated record in mock ${model} (ID: ${id})`,
      ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1',
      createdAt: new Date()
    };
    mockDb.activityLog?.unshift(auditRecord);
  }

  return NextResponse.json(updatedRecord);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ model: string }> }
) {
  const { model } = await params;
  const mockKey = getMockKey(model);
  
  if (!mockKey) {
    return NextResponse.json({ error: `Model '${model}' not found` }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Record ID is required for delete' }, { status: 400 });
  }

  const cookieToken = request.cookies.get('auth_token')?.value;
  const user = cookieToken ? verifyToken(cookieToken) : null;
  const modelClient = getModelClient(model);

  if (modelClient) {
    try {
      await modelClient.delete({ where: { id } });
      
      if (user) {
        await db.activityLog.create({
          data: {
            userId: user.userId,
            userEmail: user.email,
            action: 'DELETE',
            details: `Deleted record in ${model} (ID: ${id})`,
            ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1',
          },
        });
      }
      return NextResponse.json({ success: true });
    } catch (dbError) {
      console.warn(`[DATABASE OFFLINE] Falling back to mock state for DELETE on model "${model}":`, dbError);
    }
  }

  // Mock Database Implementation
  const mockTable = mockDb[mockKey];
  const recordIndex = mockTable.findIndex((record: any) => record.id === id);

  if (recordIndex === -1) {
    return NextResponse.json({ error: 'Record not found in mock store' }, { status: 404 });
  }

  mockDb[mockKey] = mockTable.filter((record: any) => record.id !== id);

  // Fallback audit log
  if (user) {
    const auditRecord = {
      id: `MOCK-ACT-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      userId: user.userId,
      userEmail: user.email,
      action: 'DELETE',
      details: `Deleted record in mock ${model} (ID: ${id})`,
      ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1',
      createdAt: new Date()
    };
    mockDb.activityLog?.unshift(auditRecord);
  }

  return NextResponse.json({ success: true });
}
