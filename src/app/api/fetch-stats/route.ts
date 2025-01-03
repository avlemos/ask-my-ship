import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const accountId = searchParams.get('account_id');

    if (!token || !accountId) {
        return NextResponse.json({ error: 'Missing token or account ID' }, { status: 400 });
    }

    try {
        //https://api.worldofwarships.eu/wows/ships/stats/?application_id=6cb07d0432b6a854d67f6ed78a255884
        //const url = `https://api.worldofwarships.eu/wows/ships/stats/?` +
        const url = `https://api.worldofwarships.eu/wows/account/info/?` +
            `application_id=${process.env.NEXT_PUBLIC_WARGAMING_APP_ID}&` +
            `account_id=${accountId}&` +
            //`fields=rank_solo.battles&` +
            `access_token=${token}`;

        const response = await fetch(url);

        const data = await response.json();

        if (data.status === 'error') {
            throw new Error(data.error.message);
        }

        if (data.status === 'ok') {
            return NextResponse.json(data.data);
        }

    } catch (error) {
        console.error('Error fetching player stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch player stats' },
            { status: 500 }
        );
    }
}