import { db } from '@/lib/db';
import ExecutiveDashboardShell from '@/components/dashboard/ExecutiveDashboardShell';

export const revalidate = 0; // Ensure data is always loaded fresh in real-time

export default async function DashboardPage() {
  // 1. Fetch sales metrics
  const salesOrders = await db.salesOrder.findMany({
    orderBy: { createdAt: 'desc' },
  });
  
  const quotations = await db.quotation.findMany({
    orderBy: { createdAt: 'desc' },
  });

  // 2. Fetch procurement metrics
  const purchaseOrders = await db.purchaseOrder.findMany({
    orderBy: { createdAt: 'desc' },
  });

  // 3. Fetch inventory metrics
  const inventoryItems = await db.inventoryItem.findMany({
    orderBy: { createdAt: 'desc' },
  });
  
  const inventoryAlerts = await db.inventoryAlert.findMany({
    where: { status: 'Active' },
  });

  // 4. Fetch vendor and customer counts
  const customerCount = await db.customer.count();
  const vendorCount = await db.vendor.count();

  // 5. Fetch recent activity logs
  const recentLogs = await db.activityLog.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <ExecutiveDashboardShell
      initialSalesOrders={salesOrders}
      initialQuotations={quotations}
      initialPurchaseOrders={purchaseOrders}
      initialInventoryItems={inventoryItems}
      initialInventoryAlerts={inventoryAlerts}
      customerCount={customerCount}
      vendorCount={vendorCount}
      recentLogs={recentLogs}
    />
  );
}
