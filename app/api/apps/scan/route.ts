import { NextRequest, NextResponse } from 'next/server';
import { smartScan } from '@/lib/apps';
import { auth } from '@/lib/auth';

export async function POST(req: NextRequest) {
    const session = await auth.getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { path: directoryPath } = await req.json();
        if (!directoryPath) throw new Error('Path della cartella richiesto');
        
        const suggestedData = await smartScan(directoryPath);
        return NextResponse.json(suggestedData);
    } catch (error: any) {
        console.error('Scan error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
