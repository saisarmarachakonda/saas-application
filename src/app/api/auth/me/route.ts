import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const cookieToken = request.cookies.get('auth_token')?.value;

    if (!cookieToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const payload = verifyToken(cookieToken);

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: payload,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
