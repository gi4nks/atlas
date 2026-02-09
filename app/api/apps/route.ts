import { NextRequest, NextResponse } from 'next/server';
import { getApps, saveApp } from '@/lib/apps';
import { auth } from '@/lib/auth';

export async function GET() {
  const apps = await getApps();
  return NextResponse.json(apps);
}

export async function POST(req: NextRequest) {
    const session = await auth.getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const data = await req.json();
        await saveApp(data);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
