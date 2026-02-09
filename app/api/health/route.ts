import { NextResponse } from 'next/server';
import { getApps } from '@/lib/apps';

export async function GET() {
  try {
    const apps = await getApps();
    
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      catalog: {
        apps_count: apps.length
      }
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
