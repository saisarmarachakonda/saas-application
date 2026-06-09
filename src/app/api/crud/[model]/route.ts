import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { hashPassword } from '@/lib/auth';

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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ model: string }> }
) {
  try {
    const { model } = await params;
    const modelClient = getModelClient(model);
    if (!modelClient) {
      return NextResponse.json({ error: `Model '${model}' not found` }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const item = await modelClient.findUnique({
        where: { id },
      });
      if (!item) {
        return NextResponse.json({ error: 'Record not found' }, { status: 404 });
      }
      return NextResponse.json(item);
    }

    // Determine sorting options dynamically to prevent errors on models without a 'createdAt' field
    let orderBy: any = undefined;
    const lowerModel = model.toLowerCase();
    
    const modelsWithCreatedAt = [
      'company', 'plant', 'warehouse', 'department', 'user', 'subscription',
      'payment', 'customer', 'vendor', 'productcategory', 'product', 'material',
      'lead', 'opportunity', 'rfqcrm', 'quotation', 'salesorder',
      'purchaserequisition', 'rfqprocurement', 'purchaseorder', 'goodsreceipt',
      'supplierscorecard', 'inventoryitem', 'inventoryalert', 'notification',
      'activitylog', 'financialtransaction', 'journalentry', 'budget', 'taxrecord',
      'workflowinstance', 'workflowlog'
    ];

    if (modelsWithCreatedAt.includes(lowerModel)) {
      orderBy = { createdAt: 'desc' };
    } else if (lowerModel === 'stockmovement') {
      orderBy = { date: 'desc' };
    } else if (lowerModel === 'systemsettings') {
      orderBy = { updatedAt: 'desc' };
    }

    const items = await modelClient.findMany({
      ...(orderBy ? { orderBy } : {})
    });
    return NextResponse.json(items);
  } catch (error: any) {
    console.error('CRUD GET error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ model: string }> }
) {
  try {
    const { model } = await params;
    const cookieToken = request.cookies.get('auth_token')?.value;
    const user = cookieToken ? verifyToken(cookieToken) : null;

    const modelClient = getModelClient(model);
    if (!modelClient) {
      return NextResponse.json({ error: `Model '${model}' not found` }, { status: 404 });
    }

    const body = await request.json();

    // Special Auth logic: Hash user passwords if creating a user
    if (model.toLowerCase() === 'user' && body.password) {
      body.password = hashPassword(body.password);
    }

    // Convert potential number strings to numbers
    const formattedData = { ...body };
    for (const key in formattedData) {
      if (typeof formattedData[key] === 'string' && formattedData[key] !== '') {
        // Parse floats for cost, value, amount, quantity, price, score
        if (['price', 'cost', 'value', 'amount', 'quantity', 'amountLimit', 'rating', 'minAlertQty', 'maxAlertQty', 'threshold', 'qualityScore', 'deliveryScore', 'costScore', 'overallScore', 'version'].includes(key)) {
          formattedData[key] = parseFloat(formattedData[key]);
        }
        // Parse dates
        if (['dueDate', 'expectedClose', 'startDate', 'endDate', 'date', 'receivedDate'].includes(key)) {
          formattedData[key] = new Date(formattedData[key]);
        }
      }
    }

    const newItem = await modelClient.create({
      data: formattedData,
    });

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
  } catch (error: any) {
    console.error('CRUD POST error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ model: string }> }
) {
  try {
    const { model } = await params;
    const cookieToken = request.cookies.get('auth_token')?.value;
    const user = cookieToken ? verifyToken(cookieToken) : null;

    const modelClient = getModelClient(model);
    if (!modelClient) {
      return NextResponse.json({ error: `Model '${model}' not found` }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Record ID is required for update' }, { status: 400 });
    }

    const body = await request.json();

    // Hashing password if updating User table password
    if (model.toLowerCase() === 'user' && body.password) {
      body.password = hashPassword(body.password);
    }

    // Convert potential numeric keys and dates
    const formattedData = { ...body };
    delete formattedData.id;
    delete formattedData.createdAt;
    delete formattedData.updatedAt;

    for (const key in formattedData) {
      if (typeof formattedData[key] === 'string' && formattedData[key] !== '') {
        if (['price', 'cost', 'value', 'amount', 'quantity', 'amountLimit', 'rating', 'minAlertQty', 'maxAlertQty', 'threshold', 'qualityScore', 'deliveryScore', 'costScore', 'overallScore', 'version'].includes(key)) {
          formattedData[key] = parseFloat(formattedData[key]);
        }
        if (['dueDate', 'expectedClose', 'startDate', 'endDate', 'date', 'receivedDate'].includes(key)) {
          formattedData[key] = new Date(formattedData[key]);
        }
      }
    }

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
  } catch (error: any) {
    console.error('CRUD PUT error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ model: string }> }
) {
  try {
    const { model } = await params;
    const cookieToken = request.cookies.get('auth_token')?.value;
    const user = cookieToken ? verifyToken(cookieToken) : null;

    const modelClient = getModelClient(model);
    if (!modelClient) {
      return NextResponse.json({ error: `Model '${model}' not found` }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Record ID is required for delete' }, { status: 400 });
    }

    await modelClient.delete({
      where: { id },
    });

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
  } catch (error: any) {
    console.error('CRUD DELETE error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
