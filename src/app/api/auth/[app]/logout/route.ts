import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ app: string }> }
) {
  const { app } = await params;
  const response = NextResponse.json({ success: true });
  
  response.cookies.delete(`${app.toLowerCase()}_auth_token`);
  return response;
}
