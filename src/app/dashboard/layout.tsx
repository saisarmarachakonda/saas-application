import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';
import DashboardLayoutClient from '@/components/layouts/DashboardLayout';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    redirect('/login');
  }

  const userPayload = verifyToken(token);

  if (!userPayload) {
    // Session token expired or invalid
    redirect('/login');
  }

  // Fetch live notifications for user
  const dbNotifications = await db.notification.findMany({
    where: {
      userId: userPayload.userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 10,
  });

  // Format notifications safely for client serialization
  const notifications = dbNotifications.map((n) => ({
    id: n.id,
    title: n.title,
    message: n.message,
    read: n.read,
    createdAt: n.createdAt.toISOString(),
  }));

  return (
    <DashboardLayoutClient user={userPayload} initialNotifications={notifications}>
      {children}
    </DashboardLayoutClient>
  );
}
