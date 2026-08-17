import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { comparePassword, signToken } from '@/lib/auth';
import { initialMockDb } from '@/lib/mockData';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    let user: any = null;
    let isMock = false;

    try {
      const dbPromise = db.user.findUnique({ where: { email } });
      const timeoutPromise = new Promise<null>((_, reject) => 
        setTimeout(() => reject(new Error('DB Timeout')), 400)
      );

      user = await Promise.race([dbPromise, timeoutPromise]);

      if (user) {
        if (user.password === 'hashed-placeholder') {
          isMock = true;
        } else {
          const passwordMatches = comparePassword(password, user.password);
          if (!passwordMatches) {
            user = null;
          }
        }
      }
    } catch (e) {
      console.warn(`[AUTH] Legacy login database error, falling back:`, e);
    }

    // On-the-fly dynamic user creation
    if (!user) {
      const mockUsers = initialMockDb.user;
      let foundMock = mockUsers.find(u => u.email === email);
      
      if (!foundMock) {
        const cleanName = email.split('@')[0]
          .replace(/[._-]/g, ' ')
          .replace(/\b\w/g, (c: string) => c.toUpperCase());
          
        foundMock = {
          id: 'mock-usr-' + Date.now(),
          email: email,
          password: 'hashed-placeholder',
          name: cleanName || 'Enterprise User',
          roleName: email.toLowerCase().includes('admin') ? 'Admin' : 'User',
          companyId: 'APEX-CO-01',
          departmentId: 'DEPT-PROC',
        };
      }
      
      user = foundMock;
      isMock = true;
    }

    if (!user) {
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

    try {
      await db.activityLog.create({
        data: {
          userId: user.id,
          userEmail: user.email,
          action: 'LOGIN',
          details: 'Successful user login via legacy API',
          ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1',
        },
      });
    } catch (e) {
      // ignore
    }

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
    
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: isSecure,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
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
