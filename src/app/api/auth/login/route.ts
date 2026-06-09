import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { comparePassword, signToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user || !comparePassword(password, user.password)) {
      // Log failed login if desired, but let's avoid DB error
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      roleName: user.roleName,
      companyId: user.companyId,
      departmentId: user.departmentId,
    });

    // Save activity log
    await db.activityLog.create({
      data: {
        userId: user.id,
        userEmail: user.email,
        action: 'LOGIN',
        details: 'Successful user login via API',
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

    // Set cookie
    const host = request.headers.get('host') || '';
    const xProto = request.headers.get('x-forwarded-proto') || '';
    const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1') || host.includes('192.168.');
    const isSecure = !isLocalhost || request.nextUrl.protocol === 'https:' || xProto === 'https' || process.env.NODE_ENV === 'production';
    
    console.log(`[AUTH] Login API - Host: "${host}", Proto: "${xProto}", isSecure: ${isSecure}`);

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
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
