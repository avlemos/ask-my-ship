import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('access_token');
    const accountId = searchParams.get('account_id');
    const nickname = searchParams.get('nickname');
    const headersList = await headers();
    const domain = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const baseUrl = `${protocol}://${domain}`;


    if (!token || !accountId) {
        return NextResponse.json({ error: 'Missing token or account ID' }, { status: 400 });
    }

    try {
        // const url = `https://api.worldofwarships.eu/wows/account/info/?` +
        //     `application_id=${process.env.NEXT_PUBLIC_WARGAMING_APP_ID}&` +
        //     `account_id=${accountId}&` +
        //     `access_token=${token}`;

        // const response = await fetch(url);

        // const data = await response.json();

        // if (data.status === 'error') {
        //     throw new Error(data.error.message);
        // }

        // if (data.status === 'ok') {
            // Redirect back to the main page with the access token and account ID
            return NextResponse.redirect(
              `${baseUrl}/?` +
              `access_token=${token}&` +
              `account_id=${accountId}&` +
              `nickname=${nickname}`
            );
          //}

    } catch (error) {
        console.error('Error fetching player stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch player stats' },
            { status: 500 }
        );
    }
}