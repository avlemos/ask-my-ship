import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const accessToken = searchParams.get('access_token');
  const accountId = searchParams.get('account_id');
  
  const headersList = await headers();
  const domain = headersList.get('host') || 'localhost:3000';
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const baseUrl = `${protocol}://${domain}`;
  
  if (!accessToken || !accountId) {
    return NextResponse.redirect(`${baseUrl}/error?message=auth_failed`);
  }

  // Store these values securely (e.g., in a session)
  // Then redirect to the main app
  return NextResponse.redirect(`${baseUrl}/?token=${accessToken}&account_id=${accountId}`);
}