import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, signToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, companyName } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email and password are required' },
        { status: 400 }
      );
    }

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 409 }
      );
    }

    // Determine the company for this new user
    let userCompanyId: string | null = null;

    if (companyName && companyName.trim() !== '') {
      const code = companyName.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 10) + Math.floor(Math.random() * 100);
      const newCompany = await db.company.create({
        data: {
          name: companyName,
          code: code || 'NEWORG',
          address: 'Default Tenant Address',
        },
      });
      userCompanyId = newCompany.id;

      // Seed a default department and warehouse for the new tenant
      const dept = await db.department.create({
        data: { name: 'General', code: `GEN-${code}` },
      });

      const plant = await db.plant.create({
        data: { name: 'Main Plant', code: `PLT-${code}`, companyId: newCompany.id },
      });

      await db.warehouse.create({
        data: { name: 'Main Warehouse', code: `WH-${code}`, plantId: plant.id },
      });
    } else {
      // Find default Apex company
      const defaultCompany = await db.company.findUnique({
        where: { code: 'APEX' },
      });
      userCompanyId = defaultCompany ? defaultCompany.id : null;
    }

    const hashedPassword = hashPassword(password);
    const roleName = 'Admin'; // First user in tenant is Admin

    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roleName,
        companyId: userCompanyId,
      },
    });

    // Seed a free subscription automatically
    const sub = await db.subscription.create({
      data: {
        userId: user.id,
        planName: 'Free',
        status: 'Active',
        price: 0,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      roleName: user.roleName,
      companyId: user.companyId,
      departmentId: user.departmentId,
    });

    await db.activityLog.create({
      data: {
        userId: user.id,
        userEmail: user.email,
        action: 'SIGNUP',
        details: `Created user account and company: ${companyName || 'Apex'}`,
        ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1',
      },
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roleName: user.roleName,
      },
    });

    const host = request.headers.get('host') || '';
    const xProto = request.headers.get('x-forwarded-proto') || '';
    const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1') || host.includes('192.168.');
    const isSecure = !isLocalhost || request.nextUrl.protocol === 'https:' || xProto === 'https' || process.env.NODE_ENV === 'production';
    
    console.log(`[AUTH] Signup API - Host: "${host}", Proto: "${xProto}", isSecure: ${isSecure}`);

    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: isSecure,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
