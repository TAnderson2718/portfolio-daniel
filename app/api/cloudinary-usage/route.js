import { NextResponse } from 'next/server';
import { getUsage } from '@/lib/cloudinary-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const u = await getUsage();
    // Slim the response — frontend only cares about a few aggregates.
    return NextResponse.json({
      plan: u.plan,
      lastUpdated: u.last_updated,
      credits: u.credits, // { usage, limit, used_percent }
      objects: u.objects, // { usage, limit, used_percent }   (resource count)
      bandwidth: u.bandwidth, // { usage, limit, used_percent }
      storage: u.storage, // { usage, limit, used_percent }
      transformations: u.transformations,
    });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: e.status || 500 });
  }
}
